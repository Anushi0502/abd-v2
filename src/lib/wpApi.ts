import { WP_API_ORIGIN } from '../constants'
import { getFallbackContentIndex } from './fallbackContent'
import type { ContentIndex, ContentType, WpRecord } from '../types'

interface WpApiEntry {
  id: number
  slug: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  modified: string
}

interface WpCollectionResponse {
  entries: WpApiEntry[]
  totalPages: number
}

interface FetchContentIndexOptions {
  forceRefresh?: boolean
}

interface PersistedContentIndex {
  createdAt: number
  index: ContentIndex
}

const COLLECTION_FIELDS =
  '_fields=id,slug,link,title,excerpt,content,date,modified&per_page=100'
const WP_API_TIMEOUT_MS = 12000
const MAX_RETRY_ATTEMPTS = 1
const CONTENT_INDEX_SESSION_KEY = 'abd-content-index-v1'
const CONTENT_INDEX_MAX_AGE_MS = 10 * 60 * 1000
const REMOVED_PAGE_SLUGS = new Set(['about-us-copy'])
const isBrowser = typeof window !== 'undefined'

const decodeEntity = (value: string): string => {
  if (!value) {
    return ''
  }

  const parser = new DOMParser()
  const decoded = parser.parseFromString(value, 'text/html').documentElement.textContent
  return decoded ?? value
}

const normalizeEntry = (entry: WpApiEntry, type: ContentType): WpRecord => {
  return {
    id: entry.id,
    slug: entry.slug,
    link: entry.link,
    title: decodeEntity(entry.title.rendered).trim(),
    excerpt: decodeEntity(entry.excerpt.rendered).trim(),
    content: entry.content.rendered,
    date: entry.date,
    modified: entry.modified,
    type,
  }
}

const sanitizeContentIndex = (index: ContentIndex): ContentIndex => {
  const pages = index.pages.filter((entry) => !REMOVED_PAGE_SLUGS.has(entry.slug.toLowerCase()))

  if (pages.length === index.pages.length) {
    return index
  }

  return {
    pages,
    posts: index.posts,
  }
}

const isPersistedContentIndex = (value: unknown): value is PersistedContentIndex => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<PersistedContentIndex>
  return (
    typeof candidate.createdAt === 'number' &&
    !!candidate.index &&
    Array.isArray(candidate.index.pages) &&
    Array.isArray(candidate.index.posts)
  )
}

const readPersistedContentIndex = (allowExpired = false): ContentIndex | null => {
  if (!isBrowser) {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(CONTENT_INDEX_SESSION_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as unknown
    if (!isPersistedContentIndex(parsed)) {
      window.sessionStorage.removeItem(CONTENT_INDEX_SESSION_KEY)
      return null
    }

    const ageMs = Date.now() - parsed.createdAt
    if (!allowExpired && ageMs > CONTENT_INDEX_MAX_AGE_MS) {
      return null
    }

    return parsed.index
  } catch {
    return null
  }
}

const writePersistedContentIndex = (index: ContentIndex) => {
  if (!isBrowser) {
    return
  }

  try {
    const payload: PersistedContentIndex = {
      createdAt: Date.now(),
      index,
    }
    window.sessionStorage.setItem(CONTENT_INDEX_SESSION_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage write failures and proceed with memory cache.
  }
}

const timedFetch = async (url: string, init: RequestInit): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort()
  }, WP_API_TIMEOUT_MS)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    globalThis.clearTimeout(timeoutId)
  }
}

const parseTotalPages = (response: Response): number => {
  const raw = response.headers.get('X-WP-TotalPages')
  const parsed = raw ? Number(raw) : 1

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

const withPageQuery = (path: string, page: number): string => {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}page=${page}`
}

const fetchWpCollectionPage = async (
  path: string,
  page: number,
  attempt = 0
): Promise<WpCollectionResponse> => {
  const requestPath = withPageQuery(path, page)
  let response: Response

  try {
    response = await timedFetch(`${WP_API_ORIGIN}/${requestPath}`, {
      headers: {
        Accept: 'application/json',
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        return fetchWpCollectionPage(path, page, attempt + 1)
      }

      throw new Error(`WordPress API request timed out for ${requestPath}`)
    }

    if (attempt < MAX_RETRY_ATTEMPTS) {
      return fetchWpCollectionPage(path, page, attempt + 1)
    }

    throw error
  }

  if (!response.ok) {
    if (attempt < MAX_RETRY_ATTEMPTS && response.status >= 500) {
      return fetchWpCollectionPage(path, page, attempt + 1)
    }

    throw new Error(`WordPress API request failed for ${requestPath}: ${response.status}`)
  }

  const payload = (await response.json()) as unknown
  if (!Array.isArray(payload)) {
    throw new Error(`Unexpected WordPress API payload for ${requestPath}`)
  }

  return {
    entries: payload as WpApiEntry[],
    totalPages: parseTotalPages(response),
  }
}

const fetchWpCollection = async (path: string): Promise<WpApiEntry[]> => {
  const firstPage = await fetchWpCollectionPage(path, 1)
  if (firstPage.totalPages <= 1) {
    return firstPage.entries
  }

  const remainingPageIndexes = Array.from(
    { length: firstPage.totalPages - 1 },
    (_unused, index) => index + 2
  )

  const remainingPages = await Promise.all(
    remainingPageIndexes.map((pageNumber) => fetchWpCollectionPage(path, pageNumber))
  )

  return [firstPage.entries, ...remainingPages.map((page) => page.entries)].flat()
}

let cachedIndex: ContentIndex | null = null
let cachedIndexPromise: Promise<ContentIndex> | null = null

export const fetchContentIndex = async (
  options: FetchContentIndexOptions = {}
): Promise<ContentIndex> => {
  if (options.forceRefresh) {
    cachedIndex = null
    cachedIndexPromise = null
  }

  if (cachedIndex) {
    const sanitized = sanitizeContentIndex(cachedIndex)
    cachedIndex = sanitized
    return sanitized
  }

  if (!options.forceRefresh) {
    const persisted = readPersistedContentIndex()
    if (persisted) {
      const sanitized = sanitizeContentIndex(persisted)
      cachedIndex = sanitized
      writePersistedContentIndex(sanitized)
      return sanitized
    }
  }

  if (cachedIndexPromise) {
    return cachedIndexPromise
  }

  cachedIndexPromise = (async () => {
    const [rawPages, rawPosts] = await Promise.all([
      fetchWpCollection(`pages?${COLLECTION_FIELDS}`),
      fetchWpCollection(`posts?${COLLECTION_FIELDS}`),
    ])

    const pages = rawPages.map((entry) => normalizeEntry(entry, 'page'))
    const posts = rawPosts.map((entry) => normalizeEntry(entry, 'post'))

    const nextIndex = sanitizeContentIndex({ pages, posts })
    cachedIndex = nextIndex
    writePersistedContentIndex(nextIndex)
    return nextIndex
  })()

  try {
    return await cachedIndexPromise
  } catch {
    const stalePersisted = readPersistedContentIndex(true)
    if (stalePersisted) {
      const sanitized = sanitizeContentIndex(stalePersisted)
      cachedIndex = sanitized
      writePersistedContentIndex(sanitized)
      return sanitized
    }

    const fallback = sanitizeContentIndex(getFallbackContentIndex())
    cachedIndex = fallback
    writePersistedContentIndex(fallback)
    return fallback
  } finally {
    cachedIndexPromise = null
  }
}

export const clearContentCache = () => {
  cachedIndex = null
  cachedIndexPromise = null

  if (!isBrowser) {
    return
  }

  try {
    window.sessionStorage.removeItem(CONTENT_INDEX_SESSION_KEY)
  } catch {
    // Ignore storage cleanup failures.
  }
}

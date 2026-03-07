import { WP_API_ORIGIN } from '../constants'
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

const PAGE_FIELDS =
  '_fields=id,slug,link,title,excerpt,content,date,modified&per_page=100'

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

const fetchWpCollection = async (path: string): Promise<WpApiEntry[]> => {
  const response = await fetch(`${WP_API_ORIGIN}/${path}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`WordPress API request failed for ${path}: ${response.status}`)
  }

  return (await response.json()) as WpApiEntry[]
}

let cachedIndex: ContentIndex | null = null

export const fetchContentIndex = async (): Promise<ContentIndex> => {
  if (cachedIndex) {
    return cachedIndex
  }

  const [rawPages, rawPosts] = await Promise.all([
    fetchWpCollection(`pages?${PAGE_FIELDS}`),
    fetchWpCollection(`posts?${PAGE_FIELDS}`),
  ])

  const pages = rawPages.map((entry) => normalizeEntry(entry, 'page'))
  const posts = rawPosts.map((entry) => normalizeEntry(entry, 'post'))

  cachedIndex = { pages, posts }
  return cachedIndex
}

export const clearContentCache = () => {
  cachedIndex = null
}

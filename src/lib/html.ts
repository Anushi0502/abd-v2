import DOMPurify from 'dompurify'
import { LEGACY_ALIASES, SITE_ORIGIN } from '../constants'

interface TransformOptions {
  preserveStyles?: boolean
  preserveIframes?: boolean
}

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const normalizePathname = (pathname: string) => {
  if (!pathname) {
    return ''
  }

  return pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
}

export const resolveAliasSlug = (slug: string): string => {
  const normalized = normalizePathname(slug)
  return LEGACY_ALIASES[normalized] ?? normalized
}

export const toInternalPath = (input: string): string | null => {
  if (!input) {
    return null
  }

  if (input.startsWith('mailto:') || input.startsWith('tel:') || input.startsWith('#')) {
    return null
  }

  if (input.startsWith('/')) {
    const normalized = resolveAliasSlug(input)
    return normalized ? `/${normalized}` : '/home'
  }

  if (!input.startsWith('http://') && !input.startsWith('https://')) {
    return null
  }

  try {
    const url = new URL(input)
    if (stripTrailingSlash(url.origin) !== stripTrailingSlash(SITE_ORIGIN)) {
      return null
    }

    const normalized = resolveAliasSlug(url.pathname)
    return normalized ? `/${normalized}` : '/home'
  } catch {
    return null
  }
}

export const plainTextFromHtml = (html: string): string => {
  const parser = new DOMParser()
  const parsed = parser.parseFromString(html, 'text/html')
  return (parsed.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export const extractHighlights = (html: string, max = 5): string[] => {
  const parser = new DOMParser()
  const parsed = parser.parseFromString(html, 'text/html')

  const nodes = parsed.querySelectorAll('h2, h3, li')
  const highlights: string[] = []

  nodes.forEach((node) => {
    if (highlights.length >= max) {
      return
    }

    const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (text.length >= 18 && text.length <= 120 && !highlights.includes(text)) {
      highlights.push(text)
    }
  })

  if (highlights.length > 0) {
    return highlights
  }

  const fallback = plainTextFromHtml(html)
  if (!fallback) {
    return []
  }

  return fallback
    .split('. ')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length >= 20)
    .slice(0, max)
}

const rewriteLinksAndMedia = (sourceHtml: string, options: Required<TransformOptions>) => {
  const parser = new DOMParser()
  const parsed = parser.parseFromString(sourceHtml, 'text/html')

  parsed.querySelectorAll('script, noscript').forEach((element) => element.remove())

  if (!options.preserveStyles) {
    parsed.querySelectorAll('style').forEach((element) => element.remove())
  }

  if (!options.preserveIframes) {
    parsed.querySelectorAll('iframe, object, embed').forEach((element) => element.remove())
  }

  parsed.querySelectorAll<HTMLElement>('*').forEach((node) => {
    Array.from(node.attributes)
      .filter((attribute) => attribute.name.startsWith('on'))
      .forEach((attribute) => node.removeAttribute(attribute.name))
  })

  parsed.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
    const breezeSrc = image.getAttribute('data-breeze')
    if (breezeSrc) {
      image.setAttribute('src', breezeSrc)
    }

    const breezeSrcSet = image.getAttribute('data-brsrcset')
    if (breezeSrcSet) {
      image.setAttribute('srcset', breezeSrcSet)
    }

    const breezeSizes = image.getAttribute('data-brsizes')
    if (breezeSizes) {
      image.setAttribute('sizes', breezeSizes)
    }

    if (!image.getAttribute('loading')) {
      image.setAttribute('loading', 'lazy')
    }
  })

  parsed.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (!href) {
      return
    }

    const internalPath = toInternalPath(href)
    if (internalPath) {
      anchor.setAttribute('href', internalPath)
      anchor.removeAttribute('target')
      anchor.removeAttribute('rel')
      return
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
      anchor.setAttribute('target', '_blank')
      anchor.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return parsed.body.innerHTML
}

export const transformContentHtml = (rawHtml: string, options: TransformOptions = {}): string => {
  const normalizedOptions: Required<TransformOptions> = {
    preserveStyles: options.preserveStyles ?? false,
    preserveIframes: options.preserveIframes ?? true,
  }

  const transformed = rewriteLinksAndMedia(rawHtml, normalizedOptions)

  return DOMPurify.sanitize(transformed, {
    ADD_TAGS: normalizedOptions.preserveStyles ? ['style'] : [],
    ADD_ATTR: [
      'style',
      'target',
      'rel',
      'srcset',
      'sizes',
      'loading',
      'decoding',
      'fetchpriority',
      'allow',
      'allowfullscreen',
      'frameborder',
      'aria-label',
      'data-id',
      'data-element_type',
      'data-elementor-type',
      'data-elementor-id',
      'data-elementor-post-type',
      'data-settings',
      'role',
      'dir',
      'aria-roledescription',
    ],
  })
}

export const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

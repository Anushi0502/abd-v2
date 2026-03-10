import type { WpRecord } from '../../types'

const PROFILE_IMAGE_URL =
  'https://advancedbenefitdesigns.com/wp-content/uploads/2025/02/KMS-Head-Shot-21_page-0001-e1772705284359.jpg'

const LOCATION_IMAGE_URL =
  'https://advancedbenefitdesigns.com/wp-content/uploads/2026/03/abd-company-location.jpeg'

const ABOUT_SLUGS = new Set(['financial-company', 'about-us-copy', 'about-us'])

const replaceAll = (content: string, pattern: RegExp, next: string) => {
  return content.replace(pattern, next)
}

const normalizeImageUrl = (input: string) => {
  return input
    .trim()
    .toLowerCase()
    .replace(/\?.*$/, '')
    .replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)$)/, '')
}

const forceImageSource = (image: HTMLImageElement, nextUrl: string) => {
  image.setAttribute('src', nextUrl)
  image.setAttribute('data-src', nextUrl)
  image.setAttribute('data-lazy-src', nextUrl)
  image.setAttribute('data-breeze', nextUrl)
  image.setAttribute('loading', 'eager')
  image.setAttribute('decoding', 'async')
  image.setAttribute('fetchpriority', 'high')
  image.removeAttribute('srcset')
  image.removeAttribute('sizes')
  image.removeAttribute('data-srcset')
  image.removeAttribute('data-lazy-srcset')
  image.removeAttribute('data-brsrcset')
  image.removeAttribute('data-brsizes')
}

const applyPositionedImageSwap = (content: string, secondaryUrl?: string) => {
  const parser = new DOMParser()
  const parsed = parser.parseFromString(content, 'text/html')
  const images = Array.from(parsed.querySelectorAll('img'))

  if (images.length === 0) {
    return content
  }

  const portraitImage =
    images.find((image) => {
      const source = normalizeImageUrl(image.getAttribute('src') ?? '')
      return source.includes('kms-pro-shot') || source.includes('kms-head-shot')
    }) ?? images[0]

  forceImageSource(portraitImage, PROFILE_IMAGE_URL)

  if (secondaryUrl) {
    const locationImage =
      images.find((image) => {
        if (image === portraitImage) {
          return false
        }

        const source = normalizeImageUrl(image.getAttribute('src') ?? '')
        return (
          source.includes('office-buildings') ||
          source.includes('modern-architecture') ||
          source.includes('company-location') ||
          source.includes('abd-company-location')
        )
      }) ?? images.find((image) => image !== portraitImage)

    if (locationImage) {
      forceImageSource(locationImage, secondaryUrl)
    }
  }

  return parsed.body.innerHTML
}

const applyAboutImageSwaps = (content: string) => {
  let next = content

  next = replaceAll(
    next,
    /https:\/\/advancedbenefitdesigns\.com\/wp-content\/uploads\/2025\/02\/KMS-Pro-Shot_page-0001(?:-e\d+)?(?:-\d+x\d+)?\.jpg/g,
    PROFILE_IMAGE_URL,
  )

  next = replaceAll(
    next,
    /https:\/\/advancedbenefitdesigns\.com\/wp-content\/uploads\/2025\/02\/office-buildings-with-modern-architecture(?:-\d+x\d+)?\.jpg/g,
    LOCATION_IMAGE_URL,
  )

  return applyPositionedImageSwap(next, LOCATION_IMAGE_URL)
}

const applyCommunityImageSwap = (content: string) => {
  let next = content

  next = replaceAll(
    next,
    /https:\/\/advancedbenefitdesigns\.com\/wp-content\/uploads\/2025\/02\/KMS-Pro-Shot_page-0001(?:-e\d+)?(?:-\d+x\d+)?\.jpg/g,
    PROFILE_IMAGE_URL,
  )

  return applyPositionedImageSwap(next)
}

export const withContentOverrides = (entity: WpRecord | null): WpRecord | null => {
  if (!entity) {
    return null
  }

  let nextContent = entity.content

  if (ABOUT_SLUGS.has(entity.slug)) {
    nextContent = applyAboutImageSwaps(nextContent)
  }

  if (entity.slug === 'community') {
    nextContent = applyCommunityImageSwap(nextContent)
  }

  if (nextContent === entity.content) {
    return entity
  }

  return { ...entity, content: nextContent }
}

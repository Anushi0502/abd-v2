import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ContactFormPanel from '../components/ContactFormPanel'
import RichContent from '../components/RichContent'
import { extractHighlights, formatDate, plainTextFromHtml } from '../lib/html'
import type { WpRecord } from '../types'

export interface DynamicPageProps {
  entity: WpRecord | null
  slug: string
  loading: boolean
  error: string | null
  suggestedPages: WpRecord[]
  posts: WpRecord[]
}

const estimateReadingMinutes = (text: string) => {
  const words = text
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 220))
}

const EXCLUDED_CONTINUE_EXPLORING_SLUGS = new Set(['about-us-copy'])

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

const slugify = (input: string) => {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const buildContentWithOutline = (html: string): { html: string; toc: TocItem[] } => {
  try {
    const parser = new DOMParser()
    const parsed = parser.parseFromString(html, 'text/html')
    const headingNodes = Array.from(parsed.querySelectorAll('h2, h3'))
    const usedIds = new Set<string>()
    const toc: TocItem[] = []

    headingNodes.forEach((node) => {
      const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim()
      if (text.length < 4) {
        return
      }

      const nodeLevel = node.tagName === 'H3' ? 3 : 2
      const baseId = node.id?.trim() || slugify(text)
      if (!baseId) {
        return
      }

      let finalId = baseId
      let suffix = 2
      while (usedIds.has(finalId)) {
        finalId = `${baseId}-${suffix}`
        suffix += 1
      }

      node.id = finalId
      usedIds.add(finalId)
      toc.push({ id: finalId, text, level: nodeLevel })
    })

    return { html: parsed.body.innerHTML, toc: toc.slice(0, 12) }
  } catch {
    return { html, toc: [] }
  }
}

const extractFirstImageSrc = (html: string) => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

const DynamicPage = ({ entity, slug, loading, error, suggestedPages, posts }: DynamicPageProps) => {
  if (loading) {
    return (
      <section className="page-state container">
        <h1>Loading page...</h1>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-state container">
        <h1>Backend Connection Error</h1>
        <p>{error}</p>
      </section>
    )
  }

  if (!entity) {
    return (
      <section className="page-state container">
        <p className="eyebrow">Route Not Found</p>
        <h1>We could not find: /{slug}</h1>
        <p>Try one of these active ABD routes:</p>

        <div className="suggested-routes">
          {suggestedPages.slice(0, 12).map((page) => (
            <Link key={page.id} to={`/${page.slug}`} className="route-chip">
              {page.title}
            </Link>
          ))}
        </div>
      </section>
    )
  }

  const { html: enhancedContent, toc } = useMemo(() => buildContentWithOutline(entity.content), [entity.content])
  const excerptText = plainTextFromHtml(entity.excerpt)
  const contentText = plainTextFromHtml(entity.content)
  const highlights = extractHighlights(entity.content, 7)
  const summarySource = excerptText || contentText.slice(0, 360)
  const summaryText =
    summarySource.length > 290 ? `${summarySource.slice(0, 287).replace(/\s+\S*$/, '')}...` : summarySource
  const heroHighlights =
    highlights.length > 0
      ? highlights.slice(0, 4)
      : [
          'Personalized strategy aligned to your goals',
          'Tax-aware and risk-aware planning guidance',
          'Implementation support and periodic reviews',
          'Clear next steps without pressure',
        ]
  const railHighlights = highlights.length > 0 ? highlights.slice(0, 6) : heroHighlights
  const readingMinutes = estimateReadingMinutes(contentText)
  const pageSlugClass = `page-${entity.slug.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}`
  const latestBlogs = useMemo(() => {
    return [...posts]
      .filter((post) => post.slug !== entity.slug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
      .map((post) => {
        const excerpt = plainTextFromHtml(post.excerpt).trim()
        const fallbackText = excerpt.length > 0 ? excerpt : plainTextFromHtml(post.content).trim()
        const snippet =
          fallbackText.length > 118
            ? `${fallbackText.slice(0, 115).replace(/\s+\S*$/, '')}...`
            : fallbackText

        return {
          id: post.id,
          slug: post.slug,
          title: post.title,
          date: post.date,
          snippet,
          image: extractFirstImageSrc(post.content),
        }
      })
  }, [entity.slug, posts])

  return (
    <article className={`enhanced-page page2026 page2026-dynamic ${pageSlugClass}`}>
      <section className="container page-crumbs page2026-crumbs animate-in">
        <Link to="/home">Home</Link>
        <span>/</span>
        <span>{entity.type === 'post' ? 'Blogs' : 'Advisory'}</span>
        <span>/</span>
        <strong>{entity.title}</strong>
      </section>

      <section className="container enhanced-hero page2026-hero animate-in">
        <p className="eyebrow">{entity.type === 'post' ? 'Insights Article' : 'Client Strategy Brief'}</p>
        <h1>{entity.title}</h1>
        <p>{summaryText}</p>

        <div className="hero-meta">
          <span>Published: {formatDate(entity.date)}</span>
          <span>Updated: {formatDate(entity.modified)}</span>
          <span>{readingMinutes} min read</span>
          <Link to="/contact-us">Schedule a Strategy Call</Link>
        </div>

        <div className="hero-highlights">
          {heroHighlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
      </section>

      <section className="container enhanced-layout">
        <div className="enhanced-main animate-in">
          <RichContent html={enhancedContent} preserveStyles preserveIframes />
        </div>

        <aside className="enhanced-rail animate-in">
          <div className="rail-card rail-outline">
            <h3>On This Page</h3>
            {toc.length === 0 ? (
              <p>Jump links appear automatically when section headings are available.</p>
            ) : (
              <nav className="rail-toc" aria-label="On this page">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={`rail-toc-link level-${item.level}`}>
                    {item.text}
                  </a>
                ))}
              </nav>
            )}
          </div>

          <div className="rail-card">
            <h3>Key Takeaways</h3>
            {highlights.length === 0 && <p>No direct bullet highlights found, showing smart defaults.</p>}
            <ul>
              {railHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="rail-card rail-cta rail-cta-sticky">
            <h3>Need clear guidance for your next financial move?</h3>
            <p>
              Book a focused review and receive recommendations tailored to your timeline, income, and
              risk comfort.
            </p>
            <Link to="/contact-us" className="btn btn-primary">
              Request Strategy Review
            </Link>
          </div>

          <div className="rail-card">
            <h3>Popular Services</h3>
            <div className="route-list-compact">
              <Link to="/life-insurance">Life Insurance</Link>
              <Link to="/retirement-planning-strategies">Tax-Free Retirement</Link>
              <Link to="/estate-planning">Estate Planning</Link>
              <Link to="/medicare-insurance-plans">Medicare Insurance</Link>
            </div>
          </div>

          <div className="rail-card">
            <h3>Latest Insights</h3>
            {latestBlogs.length === 0 ? (
              <div className="route-list-compact">
                <Link to="/blogs">Explore blog insights</Link>
              </div>
            ) : (
              <div className="rail-blog-list">
                {latestBlogs.map((post) => {
                  return (
                    <Link key={post.id} to={`/${post.slug}`} className="rail-blog-item">
                      {post.image ? (
                        <img src={post.image} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className="rail-blog-fallback" aria-hidden="true">
                          ABD
                        </span>
                      )}
                      <span className="rail-blog-copy">
                        <strong>{post.title}</strong>
                        <small>{formatDate(post.date)}</small>
                        {post.snippet ? <span>{post.snippet}</span> : null}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rail-card">
            <h3>Continue Exploring</h3>
            <div className="route-list-compact">
              {suggestedPages
                .filter(
                  (page) =>
                    page.slug !== entity.slug && !EXCLUDED_CONTINUE_EXPLORING_SLUGS.has(page.slug)
                )
                .slice(0, 4)
                .map((page) => (
                  <Link key={page.id} to={`/${page.slug}`}>
                    {page.title}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </section>

      {entity.slug === 'contact-us' && (
        <div className="container">
          <ContactFormPanel />
        </div>
      )}

      <section className="container upgrade-band animate-in">
        <h2>Ready for a More Confident Financial Decision?</h2>
        <p>
          Start a focused conversation and get guidance that aligns with your goals, timeline, and
          priorities.
        </p>
        <Link to="/contact-us" className="btn btn-outline">
          Start Your Consultation
        </Link>
      </section>
    </article>
  )
}

export default DynamicPage

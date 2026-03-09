import { Link } from 'react-router-dom'
import ContactFormPanel from '../components/ContactFormPanel'
import RichContent from '../components/RichContent'
import { formatDate, extractHighlights, plainTextFromHtml } from '../lib/html'
import type { WpRecord } from '../types'

interface DynamicPageProps {
  entity: WpRecord | null
  slug: string
  loading: boolean
  error: string | null
  suggestedPages: WpRecord[]
}

const estimateReadingMinutes = (text: string) => {
  const words = text
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean).length

  return Math.max(1, Math.round(words / 220))
}

const DynamicPage = ({ entity, slug, loading, error, suggestedPages }: DynamicPageProps) => {
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

  const highlights = extractHighlights(entity.content, 7)
  const summaryText = plainTextFromHtml(entity.excerpt) || plainTextFromHtml(entity.content).slice(0, 260)
  const readingMinutes = estimateReadingMinutes(plainTextFromHtml(entity.content))

  return (
    <article className="enhanced-page">
      <section className="container page-crumbs animate-in">
        <Link to="/home">Home</Link>
        <span>/</span>
        <span>{entity.type === 'post' ? 'Blogs' : 'Advisory'}</span>
        <span>/</span>
        <strong>{entity.title}</strong>
      </section>

      <section className="container enhanced-hero animate-in">
        <p className="eyebrow">{entity.type === 'post' ? 'Blog Article' : 'Advisory Page'}</p>
        <h1>{entity.title}</h1>
        <p>{summaryText}</p>

        <div className="hero-meta">
          <span>Published: {formatDate(entity.date)}</span>
          <span>Updated: {formatDate(entity.modified)}</span>
          <span>{readingMinutes} min read</span>
          <Link to="/contact-us">Talk to an Advisor</Link>
        </div>

        {highlights.length > 0 && (
          <div className="hero-highlights">
            {highlights.slice(0, 4).map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        )}
      </section>

      <section className="container enhanced-layout">
        <div className="enhanced-main animate-in">
          <RichContent html={entity.content} preserveStyles preserveIframes />
        </div>

        <aside className="enhanced-rail animate-in">
          <div className="rail-card">
            <h3>Key Takeaways</h3>
            <ul>
              {highlights.slice(0, 6).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="rail-card rail-cta rail-cta-sticky">
            <h3>Need a second opinion on your current strategy?</h3>
            <p>
              Schedule a no-pressure review and get recommendations tailored to your timeline,
              risk, and income goals.
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
            <h3>Continue Exploring</h3>
            <div className="route-list-compact">
              {suggestedPages
                .filter((page) => page.slug !== entity.slug)
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
        <h2>Built to be clearer, faster, and conversion-focused.</h2>
        <p>
          Every internal page now uses stronger hierarchy, tighter content flow, and explicit action
          paths while preserving live source data and backend connectivity.
        </p>
        <Link to="/contact-us" className="btn btn-outline">
          Start Your Consultation
        </Link>
      </section>
    </article>
  )
}

export default DynamicPage

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

  const highlights = extractHighlights(entity.content)
  const summaryText = plainTextFromHtml(entity.excerpt) || plainTextFromHtml(entity.content).slice(0, 240)

  return (
    <article className="enhanced-page">
      <section className="container enhanced-hero">
        <p className="eyebrow">{entity.type === 'post' ? 'Blog Article' : 'Advisory Page'}</p>
        <h1>{entity.title}</h1>
        <p>{summaryText}</p>

        <div className="hero-meta">
          <span>Published: {formatDate(entity.date)}</span>
          <span>Updated: {formatDate(entity.modified)}</span>
          <Link to="/contact-us">Talk to an Advisor</Link>
        </div>
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

          <div className="rail-card rail-cta">
            <h3>Need a 2nd opinion on your current strategy?</h3>
            <p>
              Schedule a no-pressure review and get actionable recommendations tailored to your
              timeline.
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
        </aside>
      </section>

      {entity.slug === 'contact-us' && (
        <div className="container">
          <ContactFormPanel />
        </div>
      )}

      <section className="container upgrade-band">
        <h2>Built to be clearer, faster, and conversion-focused.</h2>
        <p>
          Every internal page now uses a stronger visual hierarchy, tighter content flow, and explicit
          conversion actions while preserving all source data and backend connectivity.
        </p>
        <Link to="/contact-us" className="btn btn-outline">
          Start Your Consultation
        </Link>
      </section>
    </article>
  )
}

export default DynamicPage

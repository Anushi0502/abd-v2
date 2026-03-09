import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RichContent from '../components/RichContent'
import type { WpRecord } from '../types'

interface HomePageProps {
  homePage: WpRecord | null
  loading: boolean
  error: string | null
}

const HOME_ELEMENTOR_STYLES = [
  'https://advancedbenefitdesigns.com/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=3.35.6',
  'https://advancedbenefitdesigns.com/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css?ver=8.4.5',
  'https://advancedbenefitdesigns.com/wp-content/uploads/elementor/css/post-6.css?ver=1772708099',
  'https://advancedbenefitdesigns.com/wp-content/uploads/elementor/css/post-4108.css?ver=1772708140',
]

const useHomeStyleBridge = () => {
  useEffect(() => {
    const createdNodes: HTMLLinkElement[] = []

    HOME_ELEMENTOR_STYLES.forEach((href) => {
      const selector = `link[data-abd-home-style="${href}"]`
      const existing = document.head.querySelector<HTMLLinkElement>(selector)
      if (existing) {
        return
      }

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.dataset.abdHomeStyle = href
      document.head.append(link)
      createdNodes.push(link)
    })

    return () => {
      createdNodes.forEach((node) => node.remove())
    }
  }, [])
}

const HomePage = ({ homePage, loading, error }: HomePageProps) => {
  useHomeStyleBridge()

  if (loading) {
    return (
      <section className="page-state container">
        <h1>Loading homepage...</h1>
        <p>Pulling the latest homepage content from the live ABD backend.</p>
      </section>
    )
  }

  if (error || !homePage) {
    return (
      <section className="page-state container">
        <h1>Home Content Not Available</h1>
        <p>{error ?? 'Unable to fetch live homepage content.'}</p>
        <p>
          <Link to="/contact-us" className="btn btn-primary">
            Contact Advanced Benefit Designs
          </Link>
        </p>
      </section>
    )
  }

  return (
    <article className="home-preserved">
      <section className="home-path-intro animate-in">
        <div className="container">
          <h1>Choose Your Path to Financial Security</h1>
        </div>
      </section>

      <section className="home-path-stage">
        <div className="home-path-backdrop" aria-hidden="true" />

        <div className="container home-path-grid animate-in">
          <article className="home-path-card is-new">
            <div className="home-path-icon" aria-hidden="true">
              <span>01</span>
            </div>
            <h2>I'm New Here</h2>
            <p>Start with a clear, pressure-free consultation.</p>
            <Link to="/contact-us" className="home-path-btn">
              Start Free Consultation
            </Link>
          </article>

          <article className="home-path-card is-review">
            <div className="home-path-icon" aria-hidden="true">
              <span>02</span>
            </div>
            <h2>I Already Have a Plan</h2>
            <p>Get a second opinion on what you already have.</p>
            <Link to="/contact-us" className="home-path-btn">
              Request Plan Review
            </Link>
          </article>
        </div>
      </section>

      <div className="home-live-frame">
        <RichContent
          html={homePage.content}
          className="home-live-content"
          preserveStyles
          preserveIframes
          unsafeRaw
          executeScripts
        />
      </div>
    </article>
  )
}

export default HomePage

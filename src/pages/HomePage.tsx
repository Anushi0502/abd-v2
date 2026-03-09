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
      <section className="container home-command animate-in">
        <div className="home-command-copy">
          <p className="eyebrow">Advisory Grade Planning</p>
          <h1>Build financial confidence with strategy, not guesswork.</h1>
          <p>
            Review retirement, insurance, tax, and estate decisions from one connected planning lens.
          </p>

          <div className="home-command-actions">
            <Link to="/retirement-calculator" className="btn btn-primary">
              Run Retirement Scenario
            </Link>
            <Link to="/contact-us" className="btn btn-outline">
              Talk to an Advisor
            </Link>
          </div>
        </div>

        <div className="home-command-metrics">
          <article>
            <span>Planning Lens</span>
            <strong>Tax + Income + Risk</strong>
          </article>
          <article>
            <span>Engagement Style</span>
            <strong>Strategy-First Advisory</strong>
          </article>
          <article>
            <span>Client Experience</span>
            <strong>Transparent and Actionable</strong>
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

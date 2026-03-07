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
    <section className="home-preserved">
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
    </section>
  )
}

export default HomePage

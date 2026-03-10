import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME_SERVICE_CARDS } from '../constants'
import { plainTextFromHtml } from '../lib/html'
import type { WpRecord } from '../types'

interface HomePageProps {
  homePage: WpRecord | null
  loading: boolean
  error: string | null
}

const TRUST_STATS = [
  { key: 'years', value: '25+', label: 'Years of Industry Experience', counterTarget: 25 },
  { key: 'plans', value: '1,000+', label: 'Financial Plans Designed', counterTarget: 1000 },
  { key: 'independent', value: 'Independent', label: 'Client-First Advisory Model' },
  { key: 'ongoing', value: 'Ongoing', label: 'Reviews & Strategy Adjustments' },
] as const

const CLIENT_SEGMENTS = [
  {
    icon: 'Work',
    title: 'Working Professionals',
    description:
      'Protect income, reduce taxes, and build durable long-term wealth with a plan that fits your life.',
  },
  {
    icon: 'Home',
    title: 'Families & Parents',
    description:
      'Plan for education, family protection, and a secure lifestyle through every stage of life.',
  },
  {
    icon: 'Business',
    title: 'Business Owners',
    description:
      'Strengthen succession planning, key-person coverage, and tax strategy to protect business value.',
  },
] as const

const PROCESS_STEPS = [
  'Discovery: Clarify goals, concerns, cash flow, and timeline.',
  'Design: Build a personalized strategy across protection, retirement, and tax efficiency.',
  'Implementation: Put recommendations in place with transparent guidance.',
  'Review: Recalibrate annually as life, markets, and priorities change.',
] as const

const ASSOCIATED_LOGOS = [
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/Untitled-design-1.png',
    alt: 'Associated organization 1',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/Untitled-design.png',
    alt: 'Associated organization 2',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/8.png',
    alt: 'Associated organization 3',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/7.png',
    alt: 'Associated organization 4',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/6.png',
    alt: 'Associated organization 5',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/5.png',
    alt: 'Associated organization 6',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/4.png',
    alt: 'Associated organization 7',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/3.png',
    alt: 'Associated organization 8',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/2.png',
    alt: 'Associated organization 9',
  },
  {
    src: 'https://advancedbenefitdesigns.com/wp-content/uploads/2025/10/1.png',
    alt: 'Associated organization 10',
  },
] as const

const APPROACH_COMPARE = [
  {
    title: 'Traditional Financial Advice',
    points: [
      'Product-driven recommendations',
      'One-time planning sessions',
      'Limited adaptability over time',
      'Often tied to a single provider',
    ],
  },
  {
    title: 'Advanced Benefit Designs',
    points: [
      'Strategy-first, product-agnostic advice',
      'Ongoing reviews and adjustments',
      'Built for changing life stages',
      'Independent and client-aligned',
    ],
  },
] as const

const TESTIMONIALS = [
  {
    quote:
      'Great resource! The Secure Future Hub offers valuable toolkits, webinars, and a supportive community for smarter retirement and financial planning.',
    name: 'Rodriguez Veratti',
  },
  {
    quote:
      'Advanced Benefit Designs is a game-changer for planning my future. The toolkits and webinars are top-notch, and the community is super supportive.',
    name: 'Haya Suleiman',
  },
  {
    quote:
      'I heartily endorse Advanced Benefit Designs. Their Secure Future Hub offers excellent toolkits for wealth and retirement security.',
    name: 'Mahin Munna',
  },
  {
    quote: 'This is a very good and interesting channel. I learn many things from it.',
    name: 'Ali Butt',
  },
  {
    quote:
      'Excellent page for retirees looking to secure both finances and well being. Very professional page with quality content.',
    name: 'Syed Aliraza',
  },
  {
    quote:
      'Building a secure future starts with the right guidance. This community-driven approach makes long-term financial goals feel achievable.',
    name: 'Jack Williams',
  },
] as const

const MISCONCEPTIONS = [
  {
    title: '“I’ll deal with this later.”',
    description: 'Waiting often limits options. Early planning creates flexibility, not commitment.',
  },
  {
    title: '“I already have coverage.”',
    description: 'Coverage does not always equal strategy. Alignment matters more than ownership.',
  },
  {
    title: '“This is only for the wealthy.”',
    description: 'Smart planning is about decisions, not net worth.',
  },
  {
    title: '“One plan lasts forever.”',
    description: 'Financial strategies must adapt as life evolves.',
  },
] as const

const FAQS = [
  {
    question: 'What is Advanced Benefit Designs?',
    answer:
      'We are an independent financial advisory firm focused on risk management, retirement planning, and long-term financial clarity for individuals, families, and business owners.',
  },
  {
    question: 'Why consider Long-Term Care planning?',
    answer:
      'Long-term care planning protects your independence and finances if illness or injury impacts daily living.',
  },
  {
    question: 'How does tax-free retirement planning work?',
    answer:
      'Through strategic use of insurance-based and tax-advantaged tools, we help structure income streams that reduce exposure to future tax increases.',
  },
  {
    question: 'Do you help business owners?',
    answer:
      'Yes. We assist with employee benefits, succession planning, key-person protection, and strategies that help preserve business value.',
  },
  {
    question: 'Is this only for high-net-worth clients?',
    answer:
      'No. Our strategies are scalable and designed for people who want to make smarter financial decisions, regardless of where they are today.',
  },
] as const

const HomePage = ({ homePage, loading, error }: HomePageProps) => {
  const excerpt = homePage ? plainTextFromHtml(homePage.excerpt).replace(/\s+/g, ' ').trim() : ''
  const excerptLooksNoisy = /start free consultation|request plan review|choose your path/i.test(excerpt)
  const cleanedExcerpt = excerptLooksNoisy ? '' : excerpt
  const trustGridRef = useRef<HTMLDivElement | null>(null)
  const hasAnimatedTrustRef = useRef(false)
  const [trustRollStarted, setTrustRollStarted] = useState(false)
  const [trustCounters, setTrustCounters] = useState({ years: 0, plans: 0 })

  const summary =
    cleanedExcerpt.length > 0
      ? `${cleanedExcerpt.slice(0, 220).replace(/\s+\S*$/, '')}...`
      : 'Tax-efficient planning, risk-aware guidance, and implementation support designed for people who want clarity instead of confusion.'

  useEffect(() => {
    if (trustRollStarted || (loading && !homePage)) {
      return
    }

    const node = trustGridRef.current
    if (!node) {
      return
    }

    const triggerRoll = () => setTrustRollStarted(true)

    const checkVisibility = () => {
      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const visible = rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.15
      if (visible) {
        triggerRoll()
      }
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0.12)) {
                triggerRoll()
              }
            },
            {
              threshold: [0.12, 0.25, 0.4],
              rootMargin: '0px 0px -10% 0px',
            },
          )
        : null

    observer?.observe(node)
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)

    const visibilityCheckId = window.setTimeout(checkVisibility, 80)
    const fallbackId = window.setTimeout(triggerRoll, 5000)

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      window.clearTimeout(visibilityCheckId)
      window.clearTimeout(fallbackId)
    }
  }, [trustRollStarted, loading, homePage])

  useEffect(() => {
    if (!trustRollStarted || hasAnimatedTrustRef.current) {
      return
    }

    hasAnimatedTrustRef.current = true
    const duration = 1800
    const startedAt = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startedAt
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setTrustCounters({
        years: Math.round(25 * eased),
        plans: Math.round(1000 * eased),
      })

      if (progress >= 1) {
        window.clearInterval(intervalId)
      }
    }

    const intervalId = window.setInterval(tick, 16)
    const finalizeId = window.setTimeout(() => {
      setTrustCounters({ years: 25, plans: 1000 })
      window.clearInterval(intervalId)
    }, duration + 350)

    tick()

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(finalizeId)
    }
  }, [trustRollStarted])

  if (loading && !homePage) {
    return (
      <section className="page-state container">
        <h1>Loading Home...</h1>
      </section>
    )
  }

  if (error && !homePage) {
    return (
      <section className="page-state container">
        <h1>Unable to load Home content</h1>
        <p>{error}</p>
      </section>
    )
  }

  return (
    <article className="home2026 page2026 page2026-home">
      <section className="home2026-hero">
        <div className="container home2026-hero-grid animate-in">
          <div className="home2026-hero-copy">
            <h1>Financial Planning With 2026 Clarity and Confidence</h1>
            <p>{summary}</p>

            <div className="home2026-cta-row">
              <Link to="/contact-us" className="btn btn-primary">
                Start Free Consultation
              </Link>
              <Link to="/retirement-calculator" className="btn btn-outline">
                Open Retirement Calculator
              </Link>
            </div>
          </div>

          <aside className="home2026-hero-panel" aria-label="Planning highlights">
            <h3>Built for Action, Not Guesswork</h3>
            <ul>
              <li>Tax-aware strategy aligned to your timeline and risk comfort.</li>
              <li>Transparent recommendations with practical implementation steps.</li>
              <li>Ongoing reviews as life goals and market conditions evolve.</li>
            </ul>
            <div className="home2026-hero-panel-metrics">
              <article>
                <strong>25+</strong>
                <span>Years experience</span>
              </article>
              <article>
                <strong>1,000+</strong>
                <span>Plans designed</span>
              </article>
            </div>
          </aside>
        </div>
      </section>

      <section className="home2026-paths">
        <div className="container home2026-path-grid animate-in">
          <article className="home2026-path-card is-new">
            <h2>I&apos;m New Here</h2>
            <p>Start with a clear consultation and a practical action roadmap.</p>
            <Link to="/contact-us" className="home2026-path-btn">
              Start Free Consultation
            </Link>
          </article>

          <article className="home2026-path-card is-existing">
            <h2>I Already Have a Plan</h2>
            <p>Get a focused second opinion to improve outcomes and reduce blind spots.</p>
            <Link to="/contact-us" className="home2026-path-btn">
              Request Plan Review
            </Link>
          </article>
        </div>
      </section>

      <section className="home2026-strategy">
        <div className="container home2026-strategy-grid animate-in">
          <div className="home2026-strategy-copy">
            <h2>
              Strategic Financial Planning,
              <br />
              <span>Engineered for Confidence</span>
            </h2>
            <p>
              Tax-efficient strategy, risk-aware decision-making, and practical guidance for long-term
              financial confidence.
            </p>
            <div className="home2026-cta-row">
              <Link to="/contact-us" className="btn btn-primary">
                Get My Financial Roadmap
              </Link>
              <a className="btn btn-outline" href="#services">
                Explore Services
              </a>
            </div>
          </div>

          <article className="home2026-strategy-card">
            <h3>LET&apos;S BUILD YOUR PLAN</h3>
            <p>Share a few details and we will reach out with your best-fit next steps.</p>
            
            <div className="home2026-strategy-form-shell">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/ZRWtcp1dHQbApx7QFGTk"
                title="ABD strategic plan form"
                loading="eager"
                allow="clipboard-read; clipboard-write"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="home2026-trust">
        <div className="container">
          <p className="home2026-trust-copy">
            We don&apos;t believe in one-size-fits-all solutions. Every recommendation is tailored to
            your goals, timeline, and comfort with risk, never quotas or pressure.
          </p>
          <div className="home2026-trust-grid" ref={trustGridRef}>
            {TRUST_STATS.map((item) => (
              <article key={item.label}>
                <strong>
                  {item.key === 'years'
                    ? `${trustCounters.years.toLocaleString('en-US')}+`
                    : item.key === 'plans'
                      ? `${trustCounters.plans.toLocaleString('en-US')}+`
                      : item.value}
                </strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-segments">
        <div className="container">
          <h2>Who We Typically Help</h2>
          <div className="home2026-segment-grid">
            {CLIENT_SEGMENTS.map((segment) => (
              <article key={segment.title}>
                <small>{segment.icon}</small>
                <h3>{segment.title}</h3>
                <p>{segment.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-process">
        <div className="container">
          <h2>How We Work</h2>
          <div className="home2026-process-grid">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-associated">
        <div className="container">
          <h2>Associated with them</h2>
          <div className="home2026-logo-marquee">
            <div className="home2026-logo-track">
              {[...ASSOCIATED_LOGOS, ...ASSOCIATED_LOGOS].map((logo, index) => (
                <figure key={`${logo.src}-${index}`} className="home2026-logo-item">
                  <img src={logo.src} alt={logo.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="home2026-services abd-section abd-hero">
        <div className="container abd-container">
          <h2 className="abd-services-title">Our Services</h2>
          <div className="home2026-service-grid abd-grid abd-services-grid">
            {HOME_SERVICE_CARDS.map((service) => (
              <Link key={service.to} to={service.to} className="home2026-service-item abd-card abd-service-card">
                <div className="abd-cta-icon" aria-hidden="true">
                  {service.icon}
                </div>
                <h2>{service.title}</h2>
                <h5>{service.description}</h5>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-approach">
        <div className="container">
          <h2>How Our Approach Is Different</h2>
          <div className="home2026-approach-grid">
            {APPROACH_COMPARE.map((card) => (
              <article key={card.title}>
                <h3>{card.title}</h3>
                <ul>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-testimonials">
        <div className="container">
          <h2>What Clients Appreciate Most</h2>
        </div>
        <div className="home2026-testimonial-marquee">
          <div className="home2026-testimonial-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, index) => (
              <article key={`${testimonial.name}-${index}`} className="home2026-testimonial-card">
                <p>{testimonial.quote}</p>
                <strong>{testimonial.name} · Facebook Review</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-misconceptions">
        <div className="container">
          <h2>Common Misconceptions We Help Clear Up</h2>
          <div className="home2026-misconception-grid">
            {MISCONCEPTIONS.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="home2026-faq-grid">
            {FAQS.map((item) => (
              <details key={item.question} className="home2026-faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home2026-final-cta">
        <div className="container home2026-final-cta-inner">
          <div>
            <h2>No Pressure. No Obligation. Just Clarity.</h2>
            <p>
              A conversation designed to help you understand your options, even if you decide not to
              move forward.
            </p>
          </div>
          <div className="home2026-cta-row">
            <Link to="/contact-us" className="btn btn-primary">
              Schedule a Conversation
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}

export default HomePage


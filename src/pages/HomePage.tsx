import { Link } from 'react-router-dom'
import { SERVICE_NAV } from '../constants'
import { formatDate, plainTextFromHtml } from '../lib/html'
import type { WpRecord } from '../types'

interface HomePageProps {
  homePage: WpRecord | null
  loading: boolean
  error: string | null
}

const TRUST_STATS = [
  { value: '25+', label: 'Years of Industry Experience' },
  { value: '1,000+', label: 'Financial Plans Designed' },
  { value: 'Independent', label: 'Client-First Advisory Model' },
  { value: 'Ongoing', label: 'Reviews & Strategy Adjustments' },
] as const

const CLIENT_SEGMENTS = [
  {
    icon: 'Work',
    title: 'Working Professionals',
    description:
      'Individuals focused on protecting income, reducing taxes, and building long-term financial security.',
  },
  {
    icon: 'Home',
    title: 'Families & Parents',
    description:
      'Those planning for education, protection, and ensuring their family’s lifestyle is secure no matter what happens.',
  },
  {
    icon: 'Business',
    title: 'Business Owners',
    description:
      'Entrepreneurs looking for succession planning, key-person protection, and smarter tax strategies.',
  },
] as const

const PROCESS_STEPS = [
  'Discovery: We understand your goals, concerns, and current situation.',
  'Design: We build strategies tailored to your income, lifestyle, and timeline.',
  'Implementation: Solutions are put in place carefully and transparently.',
  'Review: Plans evolve as your life and priorities change.',
] as const

const SERVICE_CARDS = [
  {
    icon: '🛡️',
    title: 'Life Insurance',
    description: 'Protection designed to secure your family’s financial future and legacy.',
    to: '/life-insurance',
  },
  {
    icon: '↗',
    title: 'Tax-Free Retirement',
    description: 'Strategies designed to reduce future tax exposure and create flexible income.',
    to: '/retirement-planning-strategies',
  },
  {
    icon: '💼',
    title: 'Business Preservation',
    description: 'Succession planning, key-person protection, and continuity strategies.',
    to: '/business-preservation',
  },
  {
    icon: '📜',
    title: 'Estate Planning',
    description: 'Ensuring your assets are distributed according to your wishes with clarity.',
    to: '/estate-planning',
  },
  {
    icon: '⏳',
    title: 'Long Term Care Planning',
    description: 'Planning that protects independence and financial stability if care is needed.',
    to: '/long-term-care-planning',
  },
  {
    icon: '♾',
    title: 'Life Time Income',
    description: 'Income strategies designed to last through retirement and beyond.',
    to: '/lifetime-income',
  },
  {
    icon: '🏠',
    title: 'Mortgage Protection',
    description: 'Ensures your home and family are protected against unexpected events.',
    to: '/mortgage-protection-insurance',
  },
  {
    icon: '🏥',
    title: 'Medicare Insurance',
    description: 'Guidance to help you navigate Medicare choices with confidence and clarity.',
    to: '/medicare-insurance-plans',
  },
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

  const summary =
    cleanedExcerpt.length > 0
      ? `${cleanedExcerpt.slice(0, 220).replace(/\s+\S*$/, '')}...`
      : 'Tax-efficient planning, risk-aware guidance, and implementation support designed for people who want clarity instead of confusion.'

  const backendMessage = loading
    ? 'Syncing live backend content...'
    : error
      ? 'Live backend feed unavailable. Displaying optimized homepage experience.'
      : `Live backend connected · Updated ${formatDate(homePage?.modified ?? new Date().toISOString())}`

  return (
    <article className="home2026">
      <section className="home2026-hero">
        <div className="container home2026-hero-grid animate-in">
          <div className="home2026-hero-copy">
            <p className="eyebrow">Advanced Benefit Designs</p>
            <h1>Financial Planning With 2026 Clarity and High Readability</h1>
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
          <aside className="home2026-hero-panel">
          <p className="home2026-live-pill">{backendMessage}</p>

          <div className="home2026-kpis">
            <article>
              <span>Advisory Approach</span>
              <strong>Transparent & No-Pressure Guidance</strong>
            </article>

            <article>
              <span>Strategy Focus</span>
              <strong>Tax-Efficient Wealth Planning</strong>
            </article>

            <article>
              <span>Advisory Model</span>
              <strong>Independent & Client-First</strong>
            </article>

            <article>
              <span>Initial Consultation</span>
              <strong>100% Complimentary</strong>
            </article>
          </div>
        </aside>
        </div>
      </section>

      <section className="home2026-paths">
        <div className="container home2026-path-grid animate-in">
          <article className="home2026-path-card is-new">
            <p className="home2026-path-eyebrow">01 · New Client</p>
            <h2>I&apos;m New Here</h2>
            <p>Start with a clear consultation and a practical action roadmap.</p>
            <Link to="/contact-us" className="home2026-path-btn">
              Start Free Consultation
            </Link>
          </article>

          <article className="home2026-path-card is-existing">
            <p className="home2026-path-eyebrow">02 · Existing Plan</p>
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
            <p className="eyebrow">Strategic Financial Planning</p>
            <h2>
              Strategic Financial Planning,
              <br />
              <span>Engineered for Confidence</span>
            </h2>
            <p>
              Tax-efficient strategies. Risk-aware decisions. Designed for people who want clarity,
              not complexity.
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
            <p>Share a few details and we will reach out with your best-fit strategy.</p>
            <span className="home2026-strategy-card-line" aria-hidden="true" />
          </article>
        </div>
      </section>

      <section className="home2026-trust">
        <div className="container">
          <p className="home2026-trust-copy">
            We don&apos;t believe in one-size-fits-all solutions. Every recommendation is based on
            your goals, timeline, and comfort with risk, not quotas, commissions, or pressure.
          </p>
          <div className="home2026-trust-grid">
            {TRUST_STATS.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
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
            {SERVICE_CARDS.map((service) => (
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
            {SERVICE_NAV.length > 0 && (
              <Link to={SERVICE_NAV[0].to} className="btn btn-outline">
                Review Service Paths
              </Link>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}

export default HomePage

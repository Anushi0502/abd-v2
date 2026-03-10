import { AREAS_SERVED, CONTACT_DETAILS, HOME_SERVICE_CARDS, SITE_ORIGIN } from '../constants'
import type { ContentIndex, ContentType, WpRecord } from '../types'

const PROFILE_IMAGE_URL =
  '/wp-content/uploads/2025/02/KMS-Head-Shot-21_page-0001-e1772705284359.jpg'

const LOCATION_IMAGE_URL =
  '/wp-content/uploads/2026/03/abd-company-location.jpeg'

const PUBLISHED_AT = '2026-02-24T09:00:00.000Z'
const UPDATED_AT = '2026-03-10T09:00:00.000Z'

interface RecordInput {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  type?: ContentType
}

const makeRecord = ({ id, slug, title, excerpt, content, type = 'page' }: RecordInput): WpRecord => {
  return {
    id,
    slug,
    title,
    excerpt,
    content,
    type,
    link: `${SITE_ORIGIN}/${slug}/`,
    date: PUBLISHED_AT,
    modified: UPDATED_AT,
  }
}

const serviceLeadBySlug = new Map(
  HOME_SERVICE_CARDS.map((service) => [service.to.replace(/^\//, ''), service.description])
)

const buildServiceContent = (title: string, description: string) => `
  <h2>${title}</h2>
  <p>${description}</p>
  <h3>What You Can Expect</h3>
  <ul>
    <li>Clear recommendations aligned to your goals and timeline.</li>
    <li>Practical implementation support from strategy to execution.</li>
    <li>Ongoing reviews to keep your plan responsive to life changes.</li>
  </ul>
  <h3>Why This Matters</h3>
  <p>
    We focus on decisions that improve confidence, protect outcomes, and reduce avoidable risk.
    Each recommendation is personalized to your household or business priorities.
  </p>
`

const buildAreaContent = (areaLabel: string) => `
  <h2>Financial Planning in ${areaLabel}</h2>
  <p>
    Advanced Benefit Designs serves clients in ${areaLabel} with independent planning guidance for
    retirement, protection, tax efficiency, and legacy outcomes.
  </p>
  <h3>Planning Priorities We Address</h3>
  <ul>
    <li>Retirement income confidence and distribution strategy.</li>
    <li>Protection planning for family, health, and business continuity.</li>
    <li>Tax-aware strategy designed for long-term financial clarity.</li>
  </ul>
  <p>
    Schedule a consultation to review your current strategy and identify your next best move.
  </p>
`

const fallbackHome = makeRecord({
  id: 100,
  slug: 'home',
  title: 'Home',
  excerpt:
    'Tax-efficient planning, risk-aware guidance, and implementation support designed for people who want clarity instead of confusion.',
  content: `
    <h2>Choose Your Path to Financial Security</h2>
    <p>Independent strategy focused on retirement confidence, protection, and tax-aware planning.</p>
  `,
})

const fallbackRetirementCalculator = makeRecord({
  id: 107,
  slug: 'retirement-calculator',
  title: 'Retirement Calculator',
  excerpt: 'Model retirement outcomes with confidence using practical assumptions and scenarios.',
  content: `
    <h2>Retirement Calculator</h2>
    <p>
      Use the calculator to compare savings rate, timeline, spending, and income assumptions.
      Then review your results with strategy guidance tailored to your goals.
    </p>
  `,
})

const fallbackAboutContent = `
  <h2>Simplifying Employee Benefits for a Better Tomorrow.</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;align-items:start;">
    <div>
      <h3>Advanced Benefits- financial company</h3>
      <p>
        I have been in the insurance industry for over 25 years. Working in the Health Insurance
        industry my career rose from a sales Associate to Manager and finally Director.
      </p>
      <p>
        In 2000, I began my own company Advanced Benefits Designs located in Doylestown, PA.
        We work with local independent businesses and help them provide group benefit programs to
        protect themselves and their employees.
      </p>
      <p>
        We develop customized plans that enable business owners to attract and hold top talented
        employees and develop plans that support a successful retirement.
      </p>
      <p><strong>Kevin Smith</strong></p>
    </div>
    <figure style="margin:0;">
      <img src="${PROFILE_IMAGE_URL}" alt="Kevin Smith" loading="eager" decoding="async" />
    </figure>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;align-items:start;margin-top:1.5rem;">
    <figure style="margin:0;">
      <img src="${LOCATION_IMAGE_URL}" alt="Advanced Benefit Designs company location" loading="lazy" decoding="async" />
    </figure>
    <div>
      <h3>Our Mission</h3>
      <p>
        At Advanced Benefits Design, we design financial plans that protect yourself, your estate,
        kids, and businesses. We use best-fit financial tools to support retirement confidence and
        estate protection from debt risk.
      </p>
      <h3>Core Value: Your Reliable Financial Company for Life</h3>
      <p>
        At Advanced Benefits, we uphold integrity, customer focus, innovation, and reliability in
        everything we do. We are committed to delivering transparent, client-centric, and
        forward-thinking benefits solutions that businesses and employees can trust.
      </p>
    </div>
  </div>
`

const fallbackAbout = makeRecord({
  id: 101,
  slug: 'financial-company',
  title: 'About Us',
  excerpt:
    'Built around people, not pressure. Client-first planning with practical guidance you can act on.',
  content: fallbackAboutContent,
})

const fallbackAboutAlias = makeRecord({
  id: 102,
  slug: 'about-us',
  title: 'About Us',
  excerpt:
    'Built around people, not pressure. Client-first planning with practical guidance you can act on.',
  content: fallbackAboutContent,
})

const fallbackCommunity = makeRecord({
  id: 103,
  slug: 'community',
  title: 'Community',
  excerpt:
    'Join a practical education community focused on retirement confidence and smarter financial decisions.',
  content: `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;align-items:start;">
      <figure style="margin:0;">
        <img src="${PROFILE_IMAGE_URL}" alt="Community leadership" loading="eager" decoding="async" />
      </figure>
      <div>
        <h2>Learn how to move forward with confidence</h2>
        <ul>
          <li>Lower taxes legally</li>
          <li>Create tax-free income</li>
          <li>Understand Medicare with confidence</li>
          <li>Choose health insurance that works for your real needs</li>
        </ul>
        <p>
          The ABD community shares practical guidance, planning resources, and updates you can apply.
        </p>
      </div>
    </div>
  `,
})

const fallbackContact = makeRecord({
  id: 104,
  slug: 'contact-us',
  title: 'Contact Us',
  excerpt: 'Book a focused consultation and get guidance aligned to your goals and timeline.',
  content: `
    <h2>Start Your Consultation</h2>
    <p>
      Speak with Advanced Benefit Designs about your current strategy, retirement goals, and protection priorities.
    </p>
    <ul>
      <li><strong>Phone:</strong> ${CONTACT_DETAILS.phone}</li>
      <li><strong>Email:</strong> ${CONTACT_DETAILS.email}</li>
      <li><strong>Address:</strong> ${CONTACT_DETAILS.address}</li>
    </ul>
  `,
})

const fallbackPrivacy = makeRecord({
  id: 105,
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  excerpt: 'Your data privacy and communication preferences matter to us.',
  content: `
    <h2>Privacy Policy</h2>
    <p>
      Advanced Benefit Designs is committed to protecting your personal information and handling data
      in a responsible and transparent way.
    </p>
    <h3>Information Use</h3>
    <p>
      Contact information submitted through forms is used only to respond to requests and provide
      relevant service communication.
    </p>
  `,
})

const fallbackTerms = makeRecord({
  id: 106,
  slug: 'terms-conditions',
  title: 'Terms and Conditions',
  excerpt: 'Please review the terms governing use of this website and related services.',
  content: `
    <h2>Terms and Conditions</h2>
    <p>
      By using this website, you agree to use its content for informational purposes and to verify
      important financial decisions with a licensed professional.
    </p>
    <h3>Advisory Notice</h3>
    <p>
      Content on this site is educational and does not replace personalized professional advice.
    </p>
  `,
})

const fallbackServicePages = HOME_SERVICE_CARDS.map((service, index) => {
  const slug = service.to.replace(/^\//, '')

  return makeRecord({
    id: 200 + index,
    slug,
    title: service.title,
    excerpt: service.description,
    content: buildServiceContent(service.title, service.description),
  })
})

const fallbackAreaPages = AREAS_SERVED.map((area, index) => {
  const slug = area.to.replace(/^\//, '')

  return makeRecord({
    id: 300 + index,
    slug,
    title: area.label,
    excerpt: `Advisory support and financial planning guidance in ${area.label}.`,
    content: buildAreaContent(area.label),
  })
})

const fallbackBlogPosts: WpRecord[] = [
  makeRecord({
    id: 400,
    slug: 'tax-efficient-retirement-income-strategy',
    type: 'post',
    title: 'Tax-Efficient Retirement Income Strategy',
    excerpt: 'How to structure withdrawals across accounts to reduce unnecessary lifetime tax drag.',
    content: `
      <h2>Sequence Matters</h2>
      <p>
        Retirement income planning is not only about return assumptions. Withdrawal sequencing can
        significantly impact tax burden and portfolio longevity.
      </p>
      <h3>Key Focus Areas</h3>
      <ul>
        <li>Coordinate taxable, tax-deferred, and tax-free buckets.</li>
        <li>Plan around bracket management and future rate changes.</li>
        <li>Review annually as market performance and goals shift.</li>
      </ul>
    `,
  }),
  makeRecord({
    id: 401,
    slug: 'protecting-family-income-with-life-insurance',
    type: 'post',
    title: 'Protecting Family Income With Life Insurance',
    excerpt: 'Coverage should support outcomes, not just policy ownership.',
    content: `
      <h2>Coverage With Purpose</h2>
      <p>
        The right strategy protects income, liquidity, and long-term goals for the people who depend
        on you most.
      </p>
      <h3>Review Checklist</h3>
      <ul>
        <li>Right coverage amount for current responsibilities.</li>
        <li>Term and permanent structure aligned to timeline.</li>
        <li>Integration with overall estate and tax planning.</li>
      </ul>
    `,
  }),
  makeRecord({
    id: 402,
    slug: 'business-owner-protection-and-succession-basics',
    type: 'post',
    title: 'Business Owner Protection and Succession Basics',
    excerpt: 'A stronger business strategy includes continuity planning before disruption happens.',
    content: `
      <h2>Build Continuity Before You Need It</h2>
      <p>
        Business preservation planning protects enterprise value and reduces decision friction under
        pressure events.
      </p>
      <h3>Core Building Blocks</h3>
      <ul>
        <li>Key-person protection and buy-sell readiness.</li>
        <li>Succession framework with defined responsibilities.</li>
        <li>Tax-aware planning for transition and liquidity.</li>
      </ul>
    `,
  }),
  makeRecord({
    id: 403,
    slug: 'medicare-decisions-without-the-confusion',
    type: 'post',
    title: 'Medicare Decisions Without the Confusion',
    excerpt: 'Evaluate plan options with a structured decision process and confidence.',
    content: `
      <h2>Choose Based on Fit, Not Noise</h2>
      <p>
        Medicare decisions become easier when you compare costs, provider access, travel needs, and
        medication coverage in one framework.
      </p>
      <h3>What to Compare</h3>
      <ul>
        <li>Total annual cost, not premium only.</li>
        <li>Network and provider continuity.</li>
        <li>Drug coverage, travel, and flexibility requirements.</li>
      </ul>
    `,
  }),
]

const fallbackPages: WpRecord[] = [
  fallbackHome,
  fallbackRetirementCalculator,
  fallbackAbout,
  fallbackAboutAlias,
  fallbackCommunity,
  fallbackContact,
  fallbackPrivacy,
  fallbackTerms,
  ...fallbackServicePages,
  ...fallbackAreaPages,
]

export const FALLBACK_CONTENT_INDEX: ContentIndex = {
  pages: fallbackPages,
  posts: fallbackBlogPosts,
}

export const getFallbackContentIndex = (): ContentIndex => {
  return {
    pages: FALLBACK_CONTENT_INDEX.pages.map((page) => ({ ...page })),
    posts: FALLBACK_CONTENT_INDEX.posts.map((post) => ({ ...post })),
  }
}

export const getServiceLeadFromFallback = (slug: string): string | null => {
  return serviceLeadBySlug.get(slug.toLowerCase()) ?? null
}

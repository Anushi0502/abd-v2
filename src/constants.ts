export const SITE_ORIGIN = 'https://advancedbenefitdesigns.com'
export const WP_API_ORIGIN = `${SITE_ORIGIN}/wp-json/wp/v2`

export const LOGO_URL =
  'https://advancedbenefitdesigns.com/wp-content/uploads/2025/02/ABD-LOGO-1-e1739423897271.png'

export const COMMUNITY_BADGE_URL =
  'https://advancedbenefitdesigns.com/wp-content/uploads/2025/02/Untitled-design-1-e1758880559940.png'

export const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1A2sciAZtx/',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/advancedbenefitsdesigns/',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@AdvancedBenefitsDesigns',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/advancedbenefitdesigns?igsh=YTdxamRybzFrc2Vv',
  },
] as const

export const PRIMARY_NAV = [
  { label: 'Home', to: '/home' },
  { label: 'About Us', to: '/financial-company' },
  { label: 'Retirement Calculator', to: '/retirement-calculator' },
  { label: 'Community', to: '/community' },
  { label: 'Blogs', to: '/blogs' },
] as const

export const HOME_SERVICE_CARDS = [
  {
    icon: '\u{1F6E1}\uFE0F',
    title: 'Life Insurance',
    description: "Protection designed to secure your family's financial future and legacy.",
    to: '/life-insurance',
  },
  {
    icon: '\u{21D7}',
    title: 'Tax-Free Retirement',
    description: 'Strategies designed to reduce future tax exposure and create flexible income.',
    to: '/retirement-planning-strategies',
  },
  {
    icon: '\u{1F4BC}',
    title: 'Business Preservation',
    description: 'Succession planning, key-person protection, and continuity strategies.',
    to: '/business-preservation',
  },
  {
    icon: '\u{1F4DC}',
    title: 'Estate Planning',
    description: 'Ensuring your assets are distributed according to your wishes with clarity.',
    to: '/estate-planning',
  },
  {
    icon: '\u{23F3}',
    title: 'Long Term Care Planning',
    description: 'Planning that protects independence and financial stability if care is needed.',
    to: '/long-term-care-planning',
  },
  {
    icon: '\u{267E}',
    title: 'Life Time Income',
    description: 'Income strategies designed to last through retirement and beyond.',
    to: '/lifetime-income',
  },
  {
    icon: '\u{1F3E0}',
    title: 'Mortgage Protection',
    description: 'Ensures your home and family are protected against unexpected events.',
    to: '/mortgage-protection-insurance',
  },
  {
    icon: '\u{1F3E5}',
    title: 'Medicare Insurance',
    description: 'Guidance to help you navigate Medicare choices with confidence and clarity.',
    to: '/medicare-insurance-plans',
  },
] as const

export const SERVICE_NAV = [
  { label: 'Life Insurance', to: '/life-insurance' },
  { label: 'Tax-Free Retirement', to: '/retirement-planning-strategies' },
  { label: 'Business Preservation', to: '/business-preservation' },
  { label: 'Estate Planning', to: '/estate-planning' },
  { label: 'Long Term Care Planning', to: '/long-term-care-planning' },
  { label: 'Life Time Income', to: '/lifetime-income' },
  { label: 'Mortgage Protection', to: '/mortgage-protection-insurance' },
  { label: 'Medicare Insurance', to: '/medicare-insurance-plans' },
] as const

export const AREAS_SERVED = [
  { label: 'Doylestown, PA', to: '/doylestown-pa-medicare' },
  { label: 'New Britain, PA', to: '/new-britain-mortgage-life-insurance' },
  { label: 'Chalfont, PA', to: '/chalfont-business-loans' },
  { label: 'Montgomeryville, PA', to: '/montgomeryville-realestate' },
  { label: 'New Hope, PA', to: '/new-hope' },
  { label: 'Greater Philadelphia', to: '/the-greater-philadelphia-area' },
  { label: 'Horsham', to: '/best-financial-advisors-near-me' },
] as const

export const LEGACY_ALIASES: Record<string, string> = {
  '': 'home',
  '/': 'home',
  home: 'home',
  'about-us': 'financial-company',
  mortgage_protection: 'mortgage-protection-insurance',
  'mortgage-protection': 'mortgage-protection-insurance',
  medicare: 'medicare-insurance-plans',
  'doylestown-pa': 'doylestown-pa-medicare',
  'new-britain': 'new-britain-mortgage-life-insurance',
  chalfont: 'chalfont-business-loans',
  montgomeryville: 'montgomeryville-realestate',
}

export const CONTACT_DETAILS = {
  address: '2003 S Easton Road, Suite 308, Doylestown, PA 18901',
  phone: '215-262-5456',
  email: 'support@advancedbenefitsdesigns.com',
}

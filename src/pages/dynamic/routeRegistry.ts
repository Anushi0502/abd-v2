import type { ComponentType } from 'react'
import type { DynamicPageProps } from './DynamicPage'
import AboutUsCopyRoute from './routes/AboutUsCopyRoute'
import CommunityRoute from './routes/CommunityRoute'
import FinancialCompanyRoute from './routes/FinancialCompanyRoute'

export const DYNAMIC_ROUTE_COMPONENTS: Record<string, ComponentType<DynamicPageProps>> = {
  'financial-company': FinancialCompanyRoute,
  'about-us': FinancialCompanyRoute,
  'about-us-copy': AboutUsCopyRoute,
  community: CommunityRoute,
}

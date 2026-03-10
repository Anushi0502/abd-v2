import DynamicPage, { type DynamicPageProps } from '../DynamicPage'
import { withContentOverrides } from '../contentOverrides'

const FinancialCompanyRoute = (props: DynamicPageProps) => {
  return <DynamicPage {...props} entity={withContentOverrides(props.entity)} />
}

export default FinancialCompanyRoute

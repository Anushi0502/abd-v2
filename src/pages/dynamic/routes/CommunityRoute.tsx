import DynamicPage, { type DynamicPageProps } from '../DynamicPage'
import { withContentOverrides } from '../contentOverrides'

const CommunityRoute = (props: DynamicPageProps) => {
  return <DynamicPage {...props} entity={withContentOverrides(props.entity)} />
}

export default CommunityRoute

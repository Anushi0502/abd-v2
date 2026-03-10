import DynamicPage, { type DynamicPageProps } from '../DynamicPage'
import { withContentOverrides } from '../contentOverrides'

const AboutUsCopyRoute = (props: DynamicPageProps) => {
  return <DynamicPage {...props} entity={withContentOverrides(props.entity)} />
}

export default AboutUsCopyRoute

import LearningHubSectionItemRenderer from './LearningHubSectionItemRenderer'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'

const SpecialistDeepDiveTrackPage = () => {
  useLearningHubRouteScrollToTop()
  return <LearningHubSectionItemRenderer sectionKey='specialist-deep-dive-tracks' />
}

export default SpecialistDeepDiveTrackPage


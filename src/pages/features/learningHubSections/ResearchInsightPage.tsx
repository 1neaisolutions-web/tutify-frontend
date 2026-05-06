import LearningHubSectionItemRenderer from './LearningHubSectionItemRenderer'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'

const ResearchInsightPage = () => {
  useLearningHubRouteScrollToTop()
  return <LearningHubSectionItemRenderer sectionKey='research-insights-library' />
}

export default ResearchInsightPage


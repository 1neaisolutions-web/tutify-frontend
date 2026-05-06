import LearningHubSectionItemRenderer from './LearningHubSectionItemRenderer'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'

const AIGuidedTutorialPage = () => {
  useLearningHubRouteScrollToTop()
  return <LearningHubSectionItemRenderer sectionKey='ai-guided-tutorials-demonstrations' />
}

export default AIGuidedTutorialPage


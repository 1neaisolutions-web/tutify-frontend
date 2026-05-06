import { Navigate, useParams } from 'react-router-dom'
import { legacyLearningHubSlugToNewPath } from '../../features/learningHub'

const LearningHubLegacyRedirect = () => {
  const { itemSlug } = useParams()
  const destination = itemSlug ? legacyLearningHubSlugToNewPath[itemSlug] : undefined
  return <Navigate to={destination ?? '/learning-hub'} replace />
}

export default LearningHubLegacyRedirect


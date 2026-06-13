// @ts-nocheck
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getSectionItemBySlug } from '../../../features/learningHub'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import AIGrowthRecommendationRenderer from './AIGrowthRecommendationRenderer'
import axiosInstance from '../../../redux/http'

const AIGrowthRecommendationPage = () => {
  const { t } = useTranslation()
  const { slug } = useParams()
  const location = useLocation()
  const [backendItem, setBackendItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useLearningHubRouteScrollToTop(!loading)
  const contentId = location?.state?.content_id
  const assignmentId = location?.state?.assignment_id

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!contentId) {
        setLoading(false)
        return
      }
      try {
        const { data } = await axiosInstance.get(
          `/api/v1/learning-hub/content/${encodeURIComponent(contentId)}/detail`,
          { params: assignmentId ? { assignment_id: assignmentId } : undefined },
        )
        if (!mounted) return
        const payload = data?.detail_payload || {}
        const rich = payload?.aiGrowthRecommendationContent || payload?.ai_growth_recommendation_content || null
        if (rich) {
          setBackendItem({
            title: data.title || location?.state?.title || 'AI Growth Recommendation',
            section: 'ai-growth-recommendations',
            slug: slug || data.content_id,
            aiGrowthRecommendationContent: rich,
          })
        }
      } catch {
        // fallback below
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [assignmentId, contentId, location?.state?.title, slug])

  const item = contentId ? backendItem : getSectionItemBySlug('ai-growth-recommendations', slug)

  if (loading) {
    return <div className='p-6 text-sm text-gray-500'>{t('learningHubSections.loadingGrowthPath')}</div>
  }
  if (!item || !item.aiGrowthRecommendationContent) {
    return <Navigate to='/learning-hub' replace />
  }

  return <AIGrowthRecommendationRenderer item={item} />
}

export default AIGrowthRecommendationPage


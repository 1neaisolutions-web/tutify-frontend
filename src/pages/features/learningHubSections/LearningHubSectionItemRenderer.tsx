import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSectionItemBySlug, LearningHubSectionKey, resolveAiGuidedTutorialShell } from '../../../features/learningHub'
import { resolveHubItemDescription, resolveHubItemSubtitle, resolveHubItemTitle } from '../../../i18n/resolveLocalizedContent'
import { LessonPlannerTutorialView } from '../LessonPlannerTutorial'
import { AssessmentTutorialView } from '../AssessmentTutorial'
import { DifferentiationTutorialView } from '../DifferentiationTutorial'
import { ResearchInsightArticleView } from './ResearchInsightArticleView'
import { SpecialistDeepDiveTrackRenderer } from './SpecialistDeepDiveTrackRenderer'
import axiosInstance from '../../../redux/http'

interface LearningHubSectionItemRendererProps {
  sectionKey: LearningHubSectionKey
}

const LearningHubSectionItemRenderer = ({ sectionKey }: LearningHubSectionItemRendererProps) => {
  const { t } = useTranslation()
  const { slug } = useParams()
  const location = useLocation()
  const [backendItem, setBackendItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const contentId = (location?.state as any)?.content_id
  const assignmentId = (location?.state as any)?.assignment_id

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
        const itemSlug = slug || data.content_id
        const base = {
          id: data.content_id,
          slug: itemSlug,
          title: resolveHubItemTitle(t, itemSlug, data.title),
          subtitle: resolveHubItemSubtitle(t, itemSlug, data.subtitle ?? ''),
          shortDescription: resolveHubItemDescription(t, itemSlug, data.summary ?? ''),
          duration: data.estimated_duration_min ? `${data.estimated_duration_min} min` : undefined,
          sectionKey,
        }
        setBackendItem({
          ...base,
          aiGuidedTutorialContent: payload.aiGuidedTutorialContent || payload.ai_guided_tutorial_content,
          researchInsightContent: payload.researchInsightContent || payload.research_insight_content,
          specialistDeepDiveContent: payload.specialistDeepDiveContent || payload.specialist_deep_dive_content,
        })
      } catch {
        // no-op; fallback below
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [assignmentId, contentId, sectionKey, slug])

  const item = backendItem || getSectionItemBySlug(sectionKey, slug)

  if (loading) {
    return <div className='p-6 text-sm text-gray-500'>{t('learningHubSections.loadingContent')}</div>
  }

  if (!item) {
    return <Navigate to='/learning-hub' replace />
  }

  if (item.aiGuidedTutorialContent) {
    switch (resolveAiGuidedTutorialShell(item.aiGuidedTutorialContent.renderProfile)) {
      case 'lesson-planner':
        return <LessonPlannerTutorialView item={item} />
      case 'assessment-best-practices':
        return <AssessmentTutorialView item={item} />
      case 'differentiation-case-study':
        return <DifferentiationTutorialView item={item} />
    }
  }

  if (item.researchInsightContent) {
    return <ResearchInsightArticleView item={item} />
  }

  if (item.specialistDeepDiveContent) {
    return <SpecialistDeepDiveTrackRenderer item={item} />
  }

  const ItemComponent = item.component
  if (!ItemComponent) {
    return <Navigate to='/learning-hub' replace />
  }
  return <ItemComponent />
}

export default LearningHubSectionItemRenderer


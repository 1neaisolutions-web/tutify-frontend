import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSectionItemBySlug } from '../../../features/learningHub'
import { useLearningHubRouteScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import PersonalizedMicroCourseRenderer from './PersonalizedMicroCourseRenderer'
import axiosInstance from '../../../redux/http'

const PersonalizedMicroCoursePage = () => {
  useLearningHubRouteScrollToTop()
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
        const micro = payload?.personalizedMicroCourseContent || payload?.personalized_micro_course_content
        if (micro) {
          setBackendItem({
            id: data.content_id,
            slug: slug || data.content_id,
            title: data.title,
            subtitle: data.subtitle,
            duration: data.estimated_duration_min ? `${data.estimated_duration_min} min` : undefined,
            sectionKey: 'personalized-micro-courses',
            ctaLabel: 'Start',
            personalizedMicroCourseContent: micro,
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
  }, [assignmentId, contentId, slug])

  const item = backendItem || getSectionItemBySlug('personalized-micro-courses', slug)

  if (loading) {
    return <div className='p-6 text-sm text-gray-500'>Loading personalized course...</div>
  }

  if (!item || !item.personalizedMicroCourseContent) {
    return <Navigate to='/learning-hub' replace />
  }

  return <PersonalizedMicroCourseRenderer item={item} />
}

export default PersonalizedMicroCoursePage


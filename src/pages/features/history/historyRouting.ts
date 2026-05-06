import type { HistoryItem, HistorySourceType } from '../../../api/historyApi'

/**
 * Route to open full editor/detail for a history item (content-first).
 */
export function getItemRoute(item: HistoryItem): string {
  switch (item.sourceType) {
    case 'quiz':
      return `/teacher-tools/quiz/${item.id}`
    case 'assignment':
      return `/teacher-tools/assignment/${item.id}`
    case 'worksheet':
      return `/teacher-tools/worksheet/${item.id}`
    case 'exam':
      return `/teacher-tools/exams/${item.id}`
    case 'chatbot_conversation': {
      const slug = (item.meta as Record<string, string>).chatbot_slug ?? ''
      return slug ? `/chatbots/${slug}?conversation=${item.id}` : '/chatbots'
    }
    case 'pixgen_generation':
      return `/pixgen?generation=${item.id}`
    case 'youtube_quiz':
      return `/youtube-quiz/results?generation=${item.id}`
    case 'template_execution': {
      const slug = (item.meta as Record<string, string>).template_slug ?? ''
      return slug ? `/templates/${slug}?execution=${item.id}` : '/templates'
    }
    default:
      return '/history'
  }
}

/** Relative paths for apiRequest (same convention as quizApi / chatbots). */
export const DELETE_PATH_MAP: Record<
  HistorySourceType,
  (id: string) => string
> = {
  quiz: (id) => `v1/teacher-tools/quizzes/${id}`,
  assignment: (id) => `v1/teacher-tools/assignments/${id}`,
  worksheet: (id) => `v1/teacher-tools/worksheets/${id}`,
  exam: (id) => `v1/teacher-tools/exams/${id}`,
  chatbot_conversation: (id) => `v1/chatbots/conversations/${id}`,
  pixgen_generation: (id) => `v1/pixgen/generations/${id}`,
  youtube_quiz: (id) => `v1/youtube-quiz/generations/${id}`,
  template_execution: (id) => `v1/template-executions/${id}`,
}

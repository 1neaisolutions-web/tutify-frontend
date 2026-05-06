import { apiRequest } from './client'

export interface YouTubeQuizGenerateRequest {
  video_url: string
  grade_band: string
  subject_lens: string
  learning_focus: string
  quiz_language: string
  question_styles: string[]
  question_count: number
  lesson_strategy_id?: string
  difficultyLevel?: 'easy' | 'medium' | 'challenging'
  accessibilityMode?: boolean
  /** When set, backend resolves URL, subject lens, grade band, learning focus, and question styles from the library. */
  videoId?: string
}

export interface LessonStrategySummary {
  id: string
  title: string
  teaching_mode: string
  description: string
  instruction: string
  learning_objectives: string[]
  base_question_mix: Record<string, number>
  generation_rules: string[]
  recommended_quiz_type: string
  estimated_classroom_time: string
  recommended_export_format: string
  best_use_case: string
  teacher_prompt: string
  differentiation_note: string
}

export interface YouTubeQuizSection {
  heading: string
  details: string
  questions: YouTubeQuizQuestion[]
}

export type QuestionStyle = 'multiple_choice' | 'higher_order' | 'quick_check' | 'discussion_prompt'
export type QuickCheckResponseType = 'one_word' | 'short_phrase' | 'true_false'

export interface YouTubeQuizQuestion {
  id: string
  style: QuestionStyle
  prompt: string
  options?: string[]
  correct_option_index?: number
  sample_answer?: string
  rubric_points?: string[]
  expected_response_type?: QuickCheckResponseType
  answer?: string | boolean
}

export interface YouTubeQuizGenerateResponse {
  id?: string
  title: string
  summary: string
  sections: YouTubeQuizSection[]
}

export interface YouTubeQuizGenerationDetailResponse extends YouTubeQuizGenerateResponse {
  video_url: string
  grade_band: string
  subject_lens: string
  learning_focus: string
  quiz_language: string
  question_count: number
  created_at: string
}

export const generateYouTubeQuiz = (payload: YouTubeQuizGenerateRequest) => {
  return apiRequest<YouTubeQuizGenerateResponse>('/v1/youtube-quiz/generate', {
    method: 'POST',
    body: payload,
  })
}

export const getLessonStrategies = () => {
  return apiRequest<LessonStrategySummary[]>('/v1/youtube-quiz/lesson-strategies', {
    method: 'GET',
  })
}

export function getYouTubeQuizGeneration(generationId: string): Promise<YouTubeQuizGenerationDetailResponse> {
  return apiRequest<YouTubeQuizGenerationDetailResponse>(`/v1/youtube-quiz/generations/${generationId}`)
}


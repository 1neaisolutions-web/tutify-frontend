import type { TFunction } from 'i18next'

/** Map known backend English error strings to i18n keys (language-agnostic API codes). */
const API_MESSAGE_KEYS: Record<string, string> = {
  'Teaching profile subjects are required for video recommendations. Complete your profile subjects in Settings.':
    'youtubeQuizPage.errors.profileSubjectsRequired',
  'Could not load video recommendations.': 'youtubeQuizPage.errors.recommendationsFailed',
  'Failed to analyze text': 'literacyLabCoach.errors.analyzeFailed',
  'Failed to generate guided reading': 'literacyLabCoach.errors.guidedReadingFailed',
  'Failed to generate writing feedback': 'literacyLabCoach.errors.writingFeedbackFailed',
  'Failed to analyze themes': 'literatureAnalysisExpert.errors.themeAnalysisFailed',
  'Failed to analyze characters': 'literatureAnalysisExpert.errors.characterAnalysisFailed',
  'Failed to analyze literary devices': 'literatureAnalysisExpert.errors.literaryDevicesFailed',
  'Failed to generate discussion prompts': 'literatureAnalysisExpert.errors.discussionPromptsFailed',
  'Failed to check grammar': 'grammarWritingMentor.errors.grammarCheckFailed',
  'Failed to generate peer review guide': 'grammarWritingMentor.errors.peerReviewFailed',
  'Failed to generate grammar lesson': 'grammarWritingMentor.errors.grammarLessonFailed',
  'Failed to generate investigation': 'sTEMInquiryMentor.errors.investigationFailed',
  'Failed to generate challenge': 'sTEMInquiryMentor.errors.challengeFailed',
  'Failed to generate guidance': 'sTEMInquiryMentor.errors.guidanceFailed',
  'Failed to generate problem set': 'adaptiveMathStrategist.errors.problemSetFailed',
  'Failed to generate learning path': 'adaptiveMathStrategist.errors.learningPathFailed',
  'Failed to analyze concept': 'adaptiveMathStrategist.errors.conceptAnalysisFailed',
  'Failed to generate intervention strategies': 'adaptiveMathStrategist.errors.interventionFailed',
  'Network error': 'common.errorGeneric',
  'Failed to fetch': 'common.errorGeneric',
}

/**
 * Translate API error messages when the backend returns English literals.
 * Prefer error codes from the API when available; this handles legacy string responses.
 */
export function resolveApiMessage(t: TFunction, message: string | undefined | null): string {
  if (!message?.trim()) return t('common.errorGeneric')
  const trimmed = message.trim()
  const key = API_MESSAGE_KEYS[trimmed]
  if (key) {
    const translated = t(key)
    if (translated !== key) return translated
  }
  for (const [pattern, i18nKey] of Object.entries(API_MESSAGE_KEYS)) {
    if (trimmed.includes(pattern)) {
      const translated = t(i18nKey)
      if (translated !== i18nKey) return translated
    }
  }
  return trimmed
}

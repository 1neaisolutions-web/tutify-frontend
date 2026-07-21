/**
 * Shared localStorage helpers for student portal modules.
 */

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const STUDENT_STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'tutify_student_onboarding_completed',
  PROFILE: 'tutify_student_profile',
  CLASSES: 'tutify_student_classes',
  GOALS: 'tutify_student_goals',
  NOTES: 'tutify_student_notes_v1',
  TASKS: 'tutify_student_tasks_v1',
  STUDY_PLAN: 'tutify_student_study_plan_v1',
  STUDY_TIME: 'tutify_student_study_time_v1',
  EVENT_LOG: 'tutify_student_events_v1',
  SUBMISSIONS: 'tutify_student_submissions_v1',
  MESSAGES: 'tutify_student_messages_v1',
  DOUBTS: 'tutify_student_doubts_v1',
  MASTERY_OVERRIDES: 'tutify_student_mastery_overrides_v1',
  EXAM_ATTEMPTS: 'tutify_student_exam_attempts_v1',
  QUIZ_MISSED_TOPICS: 'tutify_student_quiz_missed_topics_v1',
  TUTOR_THREADS: 'tutify_student_tutor_threads_v1',
  PIXGEN_HISTORY: 'tutify_student_pixgen_history_v1',
  YOUTUBE_QUIZZES: 'tutify_student_youtube_quizzes_v1',
  STUDY_TIME_SESSIONS: 'tutify_student_study_time_sessions_v1',
  GRADE_CALCULATOR: 'tutify_student_grade_calculator_v1',
} as const;

/**
 * Append-only student analytics event stream (plan §3).
 * Progress and Study Plan consume this; modules emit on core actions.
 */

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from './studentStorage';

export type StudentEventModule =
  | 'ai_copilot'
  | 'doubt_solver'
  | 'quiz_center'
  | 'assignment_hub'
  | 'exam_center'
  | 'night_before'
  | 'study_plan'
  | 'notes'
  | 'tasks'
  | 'study_time'
  | 'tutors'
  | 'progress'
  | 'onboarding'
  | 'teachers'
  | 'pixgen'
  | 'youtube_quiz'
  | 'templates'
  | 'content'
  | 'timetable'
  | 'grade_calculator'
  | 'study_rooms';

export type StudentEventAction =
  | 'session_start'
  | 'question_answered'
  | 'submitted'
  | 'hint_used'
  | 'mastery_check'
  | 'generated'
  | 'saved'
  | 'completed'
  | 'viewed'
  | 'message_sent'
  | 'escalated'
  | 'regenerated'
  | 'edited';

export interface StudentEventOutcome {
  score?: number;
  correct?: boolean;
  timeSpentSec?: number;
  confidence?: number;
  [key: string]: unknown;
}

export interface StudentEvent {
  id: string;
  studentId: string;
  sessionId: string;
  timestamp: string;
  module: StudentEventModule;
  action: StudentEventAction;
  subject?: string;
  topic?: string;
  outcome?: StudentEventOutcome;
  artifactRef?: string;
}

const MAX_EVENTS = 500;

function getSessionId(): string {
  const key = 'tutify_student_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    try {
      sessionStorage.setItem(key, id);
    } catch {
      // ignore
    }
  }
  return id;
}

export function emitStudentEvent(
  partial: Omit<StudentEvent, 'id' | 'studentId' | 'sessionId' | 'timestamp'> & {
    studentId?: string;
  }
): StudentEvent {
  const event: StudentEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    studentId: partial.studentId || 'maya-chen',
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    module: partial.module,
    action: partial.action,
    subject: partial.subject,
    topic: partial.topic,
    outcome: partial.outcome,
    artifactRef: partial.artifactRef,
  };

  const existing = readJson<StudentEvent[]>(STUDENT_STORAGE_KEYS.EVENT_LOG, []);
  const next = [...existing, event].slice(-MAX_EVENTS);
  writeJson(STUDENT_STORAGE_KEYS.EVENT_LOG, next);
  return event;
}

export function getStudentEvents(filter?: {
  module?: StudentEventModule;
  subject?: string;
  topic?: string;
}): StudentEvent[] {
  const all = readJson<StudentEvent[]>(STUDENT_STORAGE_KEYS.EVENT_LOG, []);
  if (!filter) return all;
  return all.filter((e) => {
    if (filter.module && e.module !== filter.module) return false;
    if (filter.subject && e.subject !== filter.subject) return false;
    if (filter.topic && e.topic !== filter.topic) return false;
    return true;
  });
}

export function getActivityStreakDays(): number {
  const events = getStudentEvents();
  if (events.length === 0) return 0;
  const days = new Set(events.map((e) => e.timestamp.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak || (days.has(new Date().toISOString().slice(0, 10)) ? 1 : 0);
}

/** Apply quiz/doubt events to derive Logarithms improvement for demo before/after. */
export function getEffectiveTopicScore(
  subjectId: string,
  topicId: string,
  baseScore: number | null
): number | null {
  if (baseScore == null) return null;
  const overrides = readJson<Record<string, number>>(STUDENT_STORAGE_KEYS.MASTERY_OVERRIDES, {});
  const key = `${subjectId}:${topicId}`;
  if (typeof overrides[key] === 'number') return overrides[key];

  const related = getStudentEvents().filter(
    (e) =>
      (e.topic === topicId || e.topic === 'Logarithms' || e.topic === 'logarithms') &&
      (e.module === 'quiz_center' || e.module === 'doubt_solver') &&
      e.action === 'completed'
  );
  if (related.length === 0) return baseScore;
  const bump = Math.min(18, related.length * 6);
  return Math.min(95, baseScore + bump);
}

export function setMasteryOverride(subjectId: string, topicId: string, score: number): void {
  const overrides = readJson<Record<string, number>>(STUDENT_STORAGE_KEYS.MASTERY_OVERRIDES, {});
  overrides[`${subjectId}:${topicId}`] = score;
  writeJson(STUDENT_STORAGE_KEYS.MASTERY_OVERRIDES, overrides);
}

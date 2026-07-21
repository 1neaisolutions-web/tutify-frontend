/**
 * Bridges QuizCenter / AssignmentHub to the real teacher-tools APIs when reachable,
 * falling back to Maya's mock dataset when the backend has no data for this student
 * (e.g. no teacher-owned quizzes/assignments visible, network error, or 401/404).
 *
 * Bridged ("live") items are namespaced with a `live_` id prefix and cached in
 * localStorage so detail/take pages (QuizTake, QuizResults, AssignmentDetail,
 * AssignmentSubmit) can resolve them by id without a second round-trip.
 */
import { fetchQuizList } from '../../../api/quizApi';
import { fetchAssignmentList } from '../../../api/assignmentApi';
import { MAYA_QUIZZES, MAYA_ASSIGNMENTS, getQuizById, getAssignmentById } from '../data/mayaChenDemoData';
import { readJson, writeJson } from '../utils/studentStorage';

const BRIDGE_QUIZ_CACHE_KEY = 'tutify_student_bridge_quizzes_v1';
const BRIDGE_ASSIGNMENT_CACHE_KEY = 'tutify_student_bridge_assignments_v1';

const slugifySubject = (subject) =>
  (subject || 'general').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';

function mapQuizApiItemToMayaShape(item) {
  return {
    id: `live_${item.id}`,
    title: item.title,
    subject: item.subject,
    subjectId: slugifySubject(item.subject),
    timeLimitSec: (item.timeLimitMinutes || 10) * 60,
    isFixIt: false,
    source: 'live',
    questions: (item.questionStubs || []).map((q, idx) => ({
      id: q.id || `live_q${idx}`,
      prompt: q.prompt,
      choices: q.type === 'mcq' ? q.options || [] : q.options || ['True', 'False'],
      // Correct-answer keys aren't exposed to students via the teacher-authoring
      // stub API, so live quizzes are viewable/practice-only until a real
      // student-submission/grading endpoint exists.
      correctIndex: null,
      topic: item.topic || item.subject,
      hint: null,
    })),
  };
}

function mapAssignmentApiItemToMayaShape(item) {
  return {
    id: `live_${item.id}`,
    title: item.title,
    subject: item.subject,
    subjectId: slugifySubject(item.subject),
    dueAt: item.dueAt || new Date().toISOString(),
    status: 'not_started',
    source: 'live',
    requirements: item.studentInstructions || item.sourceSummary || 'See your teacher for full assignment details.',
    rubric: [],
  };
}

/** Quizzes: Maya mock + any real teacher-tools quizzes reachable for this session. */
export async function getBridgedQuizzes() {
  try {
    const res = await fetchQuizList({ page_size: 20 });
    const live = (res.items || []).map(mapQuizApiItemToMayaShape);
    writeJson(BRIDGE_QUIZ_CACHE_KEY, live);
    return [...MAYA_QUIZZES, ...live];
  } catch (err) {
    console.warn('[teacherToolsBridge] quiz list unavailable, using Maya mock data:', err?.message || err);
    return [...MAYA_QUIZZES];
  }
}

/** Assignments: Maya mock + any real teacher-tools assignments reachable for this session. */
export async function getBridgedAssignments() {
  try {
    const res = await fetchAssignmentList({ page_size: 20 });
    const live = (res.items || []).map(mapAssignmentApiItemToMayaShape);
    writeJson(BRIDGE_ASSIGNMENT_CACHE_KEY, live);
    return [...MAYA_ASSIGNMENTS, ...live];
  } catch (err) {
    console.warn('[teacherToolsBridge] assignment list unavailable, using Maya mock data:', err?.message || err);
    return [...MAYA_ASSIGNMENTS];
  }
}

export function findQuizById(id) {
  if (String(id).startsWith('live_')) {
    const cached = readJson(BRIDGE_QUIZ_CACHE_KEY, []);
    return cached.find((q) => q.id === id) || null;
  }
  return getQuizById(id) || null;
}

export function findAssignmentById(id) {
  if (String(id).startsWith('live_')) {
    const cached = readJson(BRIDGE_ASSIGNMENT_CACHE_KEY, []);
    return cached.find((a) => a.id === id) || null;
  }
  return getAssignmentById(id) || null;
}

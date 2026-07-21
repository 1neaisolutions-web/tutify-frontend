import { MAYA_ASSIGNMENTS } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { findAssignmentById } from '../api/teacherToolsBridge';

/** Merge Maya's canned assignment status with any local submission override. */
export function getEffectiveStatus(assignment, submissions) {
  const sub = submissions?.[assignment.id];
  if (!sub) return assignment.status;
  if (assignment.status === 'graded') return assignment.status;
  return sub.status || 'submitted';
}

export function getMergedAssignments(list = MAYA_ASSIGNMENTS) {
  const submissions = readJson(STUDENT_STORAGE_KEYS.SUBMISSIONS, {});
  return list.map((a) => ({
    ...a,
    status: getEffectiveStatus(a, submissions),
    submission: submissions?.[a.id] || null,
  }));
}

export function getMergedAssignmentById(id) {
  const submissions = readJson(STUDENT_STORAGE_KEYS.SUBMISSIONS, {});
  const assignment = findAssignmentById(id);
  if (!assignment) return null;
  return {
    ...assignment,
    status: getEffectiveStatus(assignment, submissions),
    submission: submissions?.[id] || null,
  };
}

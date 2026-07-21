/**
 * Reactive Study Plan generator — derives this week's blocks from assignments, exams,
 * and weak-topic progress instead of shuffling a static list. Pure function of "now" +
 * the shared Maya Chen demo dataset, so regenerating rebuilds deterministically.
 */
import { MAYA_ASSIGNMENTS, MAYA_EXAMS, MAYA_PROGRESS, getProgressSubject } from '../data/mayaChenDemoData';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function diffInDays(a, b) {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / (1000 * 60 * 60 * 24));
}

export function generateStudyPlan(now = new Date()) {
  const today = startOfDay(now);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { day: DAY_NAMES[d.getDay()], date: d.toISOString(), blocks: [] };
  });

  const pushBlock = (dayIdx, block) => {
    const idx = Math.min(Math.max(dayIdx, 0), 6);
    days[idx].blocks.push(block);
  };

  // 1) Weak topics get first priority — drilled today, checked with a fix-it two days later.
  MAYA_PROGRESS.subjects.forEach((subject) => {
    subject.topics
      .filter((topic) => topic.level === 'weak')
      .forEach((topic) => {
        pushBlock(0, {
          id: `weak_${subject.id}_${topic.id}_drill`,
          subject: subject.name,
          label: `${subject.name}: ${topic.name} weak-spot drill (25m)`,
          minutes: 25,
          why: `${topic.name} is your weakest ${subject.name} topic at ${topic.score}% mastery — working on it first has the biggest impact on your grade.`,
        });
        pushBlock(2, {
          id: `weak_${subject.id}_${topic.id}_fixit`,
          subject: subject.name,
          label: `${subject.name}: ${topic.name} fix-it quiz (15m)`,
          minutes: 15,
          why: `A short fix-it quiz two days later checks whether Monday's practice on ${topic.name} stuck.`,
        });
      });
  });

  // 2) Assignments due this week get a work block the day before they're due.
  MAYA_ASSIGNMENTS.filter((a) => a.status !== 'graded').forEach((a) => {
    const due = new Date(a.dueAt);
    const daysUntilDue = diffInDays(due, today);
    if (daysUntilDue < 0 || daysUntilDue > 7) return;
    const targetIdx = Math.max(0, daysUntilDue - 1);
    pushBlock(targetIdx, {
      id: `assignment_${a.id}`,
      subject: a.subject,
      label: `${a.subject}: Work on "${a.title}" (25m)`,
      minutes: 25,
      why: `Due ${due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · status is "${a.status.replace(/_/g, ' ')}" — scheduled the day before so you're not rushing.`,
    });
  });

  // 3) Exams within the week get review blocks anchored to the subject's weakest topic.
  MAYA_EXAMS.forEach((exam) => {
    const start = new Date(exam.startsAt);
    const daysUntilExam = diffInDays(start, today);
    if (daysUntilExam < 0 || daysUntilExam > 7) return;
    const subjectProgress = getProgressSubject(exam.subjectId);
    const weakTopic = subjectProgress?.topics.find((t) => t.level === 'weak');

    if (daysUntilExam - 2 >= 0) {
      pushBlock(daysUntilExam - 2, {
        id: `exam_${exam.id}_topic_review`,
        subject: exam.subject,
        label: `${exam.title} review: ${weakTopic ? weakTopic.name : 'weak topics'} (30m)`,
        minutes: 30,
        why: `${exam.title} is in ${daysUntilExam} days. ${
          weakTopic ? `${weakTopic.name} is still your weakest area (${weakTopic.score}%), so it gets a dedicated review pass.` : 'A focused review pass before mixed practice.'
        }`,
      });
    }
    if (daysUntilExam - 1 >= 0) {
      pushBlock(daysUntilExam - 1, {
        id: `exam_${exam.id}_mixed_practice`,
        subject: exam.subject,
        label: `${exam.title} mixed practice (25m)`,
        minutes: 25,
        why: `The night before ${exam.title.toLowerCase()}, mixed practice across all topics beats re-reading notes.`,
      });
    }
  });

  // 4) Any day still empty gets a light, deterministic review cycling through subjects in mastery order (weakest first).
  const bySubjectWeakest = [...MAYA_PROGRESS.subjects].sort((a, b) => a.masteryPct - b.masteryPct);
  let fillerCursor = 0;
  days.forEach((day, idx) => {
    if (day.blocks.length > 0) return;
    const subject = bySubjectWeakest[fillerCursor % bySubjectWeakest.length];
    fillerCursor += 1;
    pushBlock(idx, {
      id: `filler_${subject.id}_${idx}`,
      subject: subject.name,
      label: `${subject.name}: light review (20m)`,
      minutes: 20,
      why: `No assignments or exam prep land here, so this keeps ${subject.name} (${subject.masteryPct}% mastery) fresh with a light touch.`,
    });
  });

  return days;
}

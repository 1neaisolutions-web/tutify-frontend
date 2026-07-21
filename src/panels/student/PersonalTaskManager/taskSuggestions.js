import { MAYA_ASSIGNMENTS, MAYA_PROGRESS } from '../data/mayaChenDemoData';

const relativeDue = (dueAt) => {
  const hours = (new Date(dueAt).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hours <= 0) return 'Overdue';
  if (hours < 24) return 'Today';
  if (hours < 48) return 'Tomorrow';
  return `In ${Math.ceil(hours / 24)} days`;
};

/**
 * Suggestions derived from Maya's actual weak topics (MAYA_PROGRESS) and
 * assignments due soon (MAYA_ASSIGNMENTS), instead of static placeholder text.
 */
export function getTaskSuggestions() {
  const weakTopicSuggestions = MAYA_PROGRESS.subjects.flatMap((subject) =>
    subject.topics
      .filter((topic) => topic.level === 'weak')
      .map((topic) => ({
        id: `weak_${subject.id}_${topic.id}`,
        title: `Review ${topic.name} (${subject.name})`,
        due: 'This week',
        description: `${topic.name} is your weakest topic in ${subject.name} at ${topic.score}% mastery.`,
      }))
  );

  const dueSoonSuggestions = MAYA_ASSIGNMENTS.filter((a) => {
    const hours = (new Date(a.dueAt).getTime() - Date.now()) / (1000 * 60 * 60);
    return a.status !== 'graded' && hours > -24 && hours < 72;
  }).map((a) => ({
    id: `due_${a.id}`,
    title: `Prep for: ${a.title}`,
    due: relativeDue(a.dueAt),
    description: `Due ${new Date(a.dueAt).toLocaleString()} — ${a.subject}.`,
  }));

  return [...weakTopicSuggestions, ...dueSoonSuggestions].slice(0, 4);
}

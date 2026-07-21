/**
 * Consistent per-subject color coding shared across Notes, Study Rooms, and
 * anywhere else a subject chip/badge appears — so "Algebra II" reads as the same
 * color everywhere in the portal instead of each module inventing its own palette.
 */
const PALETTE = {
  'algebra-ii': {
    chip: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-200 dark:border-sky-800',
    bar: 'bg-sky-500',
    dot: 'bg-sky-500',
  },
  biology: {
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-800',
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
  'english-ii': {
    chip: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-200 dark:border-violet-800',
    bar: 'bg-violet-500',
    dot: 'bg-violet-500',
  },
  'world-history': {
    chip: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800',
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
};

const FALLBACK = {
  chip: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/40 dark:text-gray-200 dark:border-gray-800',
  bar: 'bg-gray-400',
  dot: 'bg-gray-400',
};

export const subjectColor = (subjectId) => PALETTE[subjectId] || FALLBACK;

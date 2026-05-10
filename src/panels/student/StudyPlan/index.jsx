import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tutify_student_study_plan_v1';

const defaultPlan = () => [
  { day: 'Mon', blocks: ['Math: Algebra drills (25m)', 'Biology: Photosynthesis notes (20m)'] },
  { day: 'Tue', blocks: ['English: Essay outline (25m)', 'Math: Practice quiz (15m)'] },
  { day: 'Wed', blocks: ['Chemistry: Balancing equations (25m)', 'History: Summary + flashcards (20m)'] },
  { day: 'Thu', blocks: ['Biology: Review + 10 MCQs (25m)', 'English: Draft intro paragraph (15m)'] },
  { day: 'Fri', blocks: ['Math: Mixed practice (25m)', 'Free: Catch-up tasks (15m)'] },
  { day: 'Sat', blocks: ['Deep study: weak topic (45m)'] },
  { day: 'Sun', blocks: ['Plan next week (15m)', 'Light review (20m)'] },
];

const StudyPlan = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : defaultPlan();
    } catch {
      return defaultPlan();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // ignore
    }
  }, [plan]);

  const flatCount = useMemo(() => plan.reduce((acc, d) => acc + (d.blocks?.length || 0), 0), [plan]);

  const regenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 850));
    setPlan((prev) => {
      const next = prev.map((d) => ({ ...d, blocks: [...(d.blocks || [])].sort(() => Math.random() - 0.5) }));
      return next;
    });
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Study Plan</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{flatCount} blocks this week • demo AI regeneration</p>
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Regenerating…' : 'Regenerate'}
        </button>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.map((d) => (
            <div key={d.day} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{d.day}</h2>
              </div>
              <ul className="mt-3 space-y-2">
                {(d.blocks || []).map((b) => (
                  <li key={b} className="text-sm text-gray-700 dark:text-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;


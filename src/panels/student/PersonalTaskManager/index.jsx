import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_tasks_v1';

const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const PersonalTaskManager = () => {
  const navigate = useNavigate();
  const tasks = useMemo(() => loadTasks(), []);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Tasks</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Personal productivity tasks (Phase 1 local demo).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/tasks/create')}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          Add task
        </button>
      </div>

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">AI Suggestions (demo)</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Review weak quiz topics', due: 'Tomorrow' },
              { title: 'Create flashcards for photosynthesis', due: 'This week' },
            ].map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => navigate('/student/tasks/create', { state: { title: s.title } })}
                className="text-left rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-3"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">{s.title}</p>
                <p className="text-xs text-gray-500">Suggested due: {s.due}</p>
              </button>
            ))}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 text-sm text-gray-700 dark:text-gray-200">
            No tasks yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => navigate(`/student/tasks/${t.id}`)}
                className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t.description || '—'}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">{t.dueAt ? new Date(t.dueAt).toLocaleString() : 'No due date'}</span>
                  <span className={`text-xs font-medium ${t.completed ? 'text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-200'}`}>
                    {t.completed ? 'Completed' : 'Open'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalTaskManager;


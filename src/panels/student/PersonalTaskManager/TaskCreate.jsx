import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_tasks_v1';

const TaskCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const suggestedTitle = location.state?.title || '';

  const [title, setTitle] = useState(suggestedTitle);
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState('');

  const canSave = useMemo(() => Boolean(title.trim()), [title]);

  const save = () => {
    const task = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      description,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([task, ...list].slice(0, 300)));
    } catch {
      // ignore
    }
    navigate(`/student/tasks/${task.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Task</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Saved locally for Phase 1 demo.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/student/tasks')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full min-h-[160px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Due date (optional)</span>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          />
        </label>
      </div>
    </div>
  );
};

export default TaskCreate;


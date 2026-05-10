import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_tasks_v1';

const TaskEdit = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      return list.find((t) => String(t.id) === String(taskId)) || null;
    } catch {
      return null;
    }
  }, [taskId]);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueAt, setDueAt] = useState(() => {
    if (!task?.dueAt) return '';
    const d = new Date(task.dueAt);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const save = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      const next = list.map((t) =>
        String(t.id) === String(taskId)
          ? { ...t, title: title.trim(), description, dueAt: dueAt ? new Date(dueAt).toISOString() : null, updatedAt: new Date().toISOString() }
          : t
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    navigate(`/student/tasks/${taskId}`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Task</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Demo edit flow.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/student/tasks/${taskId}`)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Cancel
          </button>
          <button type="button" onClick={save} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
            Save
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {task ? (
          <>
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
                className="mt-1 w-full min-h-[180px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
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
          </>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-200">Task not found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskEdit;


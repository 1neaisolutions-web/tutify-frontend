import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_tasks_v1';

const TaskDetail = () => {
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

  const update = (patch) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      const next = list.map((t) => (String(t.id) === String(taskId) ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    navigate(0);
  };

  const remove = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.filter((t) => String(t.id) !== String(taskId))));
    } catch {
      // ignore
    }
    navigate('/student/tasks');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{task?.title || 'Task'}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{task?.completed ? 'Completed' : 'Open'}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/student/tasks')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Back
          </button>
          {task ? (
            <button
              type="button"
              onClick={() => navigate(`/student/tasks/${task.id}/edit`)}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Edit
            </button>
          ) : null}
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {task ? (
          <>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{task.description || '—'}</p>
              <p className="text-xs text-gray-500">{task.dueAt ? `Due: ${new Date(task.dueAt).toLocaleString()}` : 'No due date'}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => update({ completed: !task.completed })}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {task.completed ? 'Mark as open' : 'Mark completed'}
              </button>
              <button type="button" onClick={remove} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-200">Task not found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;


import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ASSIGNMENT_STATUS } from '../constants/statusTypes';

const assignments = [
  {
    id: 'a1',
    title: 'Physics: Forces worksheet',
    subject: 'Science',
    dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: ASSIGNMENT_STATUS.NOT_STARTED,
  },
  {
    id: 'a2',
    title: 'English: Essay draft (climate change)',
    subject: 'English',
    dueAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    status: ASSIGNMENT_STATUS.IN_PROGRESS,
  },
  {
    id: 'a3',
    title: 'Biology: Photosynthesis questions',
    subject: 'Biology',
    dueAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: ASSIGNMENT_STATUS.SUBMITTED,
  },
  {
    id: 'a4',
    title: 'Math: Quadratics practice set',
    subject: 'Math',
    dueAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: ASSIGNMENT_STATUS.GRADED,
  },
  {
    id: 'a5',
    title: 'History: Industrial revolution short answers',
    subject: 'History',
    dueAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    status: ASSIGNMENT_STATUS.REVISION_REQUESTED,
  },
];

const statusLabel = (s) => {
  switch (s) {
    case ASSIGNMENT_STATUS.NOT_STARTED:
      return 'Not started';
    case ASSIGNMENT_STATUS.IN_PROGRESS:
      return 'In progress';
    case ASSIGNMENT_STATUS.SUBMITTED:
      return 'Submitted';
    case ASSIGNMENT_STATUS.GRADED:
      return 'Graded';
    case ASSIGNMENT_STATUS.REVISION_REQUESTED:
      return 'Revision requested';
    default:
      return s;
  }
};

const deadlineTone = (dueAt) => {
  const ms = new Date(dueAt).getTime() - Date.now();
  const hours = ms / (1000 * 60 * 60);
  if (hours <= 0) return { label: 'Overdue', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200' };
  if (hours < 6) return { label: 'Due soon', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200' };
  if (hours < 24) return { label: 'Due <24h', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' };
  if (hours < 72) return { label: 'Due <72h', cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' };
  return { label: 'Upcoming', cls: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-200' };
};

const AssignmentHub = () => {
  const navigate = useNavigate();
  const items = useMemo(() => assignments, []);
  const tasks = useMemo(() => {
    try {
      const raw = localStorage.getItem('tutify_student_tasks_v1');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
    } catch {
      return [];
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assignments</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Teacher-linked work with AI help (demo data).</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((a) => {
          const tone = deadlineTone(a.dueAt);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate(`/student/assignments/${a.id}`)}
              className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{a.title}</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{a.subject}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tone.cls}`}>
                  {tone.label}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
                  {statusLabel(a.status)}
                </span>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-200">
                  AI Help available
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">Due: {new Date(a.dueAt).toLocaleString()}</p>
            </button>
          );
        })}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">My Tasks</h2>
            <button
              type="button"
              onClick={() => navigate('/student/tasks')}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Open tasks
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Demo integration: personal tasks live alongside teacher assignments.
          </p>
          <div className="mt-3 space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">No tasks yet.</p>
            ) : (
              tasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => navigate(`/student/tasks/${t.id}`)}
                  className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 px-3 py-2"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.dueAt ? new Date(t.dueAt).toLocaleString() : 'No due date'}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentHub;


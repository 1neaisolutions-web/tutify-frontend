import { useNavigate } from 'react-router-dom';

const teachers = [
  { id: 't1', name: 'Ms. Johnson', subject: 'Math' },
  { id: 't2', name: 'Mr. Lee', subject: 'Science' },
];

const TeacherHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Teachers</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Messages + doubt tickets (demo).</p>
      </div>

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">My Teachers</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {teachers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => navigate(`/student/teachers/${t.id}`)}
                className="text-left rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.subject}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">My Doubts</h2>
            <button
              type="button"
              onClick={() => navigate('/student/doubts')}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              View all
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Phase 2: submit a doubt ticket from Doubt Solver and track replies here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherHub;


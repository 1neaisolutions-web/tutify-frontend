import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const demoSubjects = [
  { id: 'math', name: 'Math', quizAvg: 68, assignmentsDone: 6, totalAssignments: 8 },
  { id: 'biology', name: 'Biology', quizAvg: 82, assignmentsDone: 4, totalAssignments: 5 },
  { id: 'english', name: 'English', quizAvg: 75, assignmentsDone: 3, totalAssignments: 4 },
];

const ProgressView = () => {
  const navigate = useNavigate();

  const overall = useMemo(() => {
    const avg = Math.round(demoSubjects.reduce((a, s) => a + s.quizAvg, 0) / demoSubjects.length);
    const done = demoSubjects.reduce((a, s) => a + s.assignmentsDone, 0);
    const total = demoSubjects.reduce((a, s) => a + s.totalAssignments, 0);
    return { avg, done, total };
  }, []);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Progress</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Summary across subjects (demo).</p>
      </div>

      <div className="px-6 py-6 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <p className="text-xs text-gray-500">Quiz average</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{overall.avg}%</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <p className="text-xs text-gray-500">Assignments</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {overall.done}/{overall.total}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <p className="text-xs text-gray-500">Streak</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">3 days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoSubjects.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate(`/student/progress/${s.id}`)}
              className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
            >
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Quiz avg: {s.quizAvg}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Assignments: {s.assignmentsDone}/{s.totalAssignments}
              </p>
              <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">View details →</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;


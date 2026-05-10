import { useNavigate, useParams } from 'react-router-dom';

const ExamTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Exam Take</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Exam {id} (demo placeholder).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/exams')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Exit
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Phase 1 demo: exam-taking UI is scaffolded. In Phase 2 this will include sections, timers, and answer review rules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamTake;


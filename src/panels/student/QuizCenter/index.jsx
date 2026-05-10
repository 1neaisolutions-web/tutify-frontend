import { useNavigate } from 'react-router-dom';

const quizzes = [
  { id: 'qz1', title: 'Newton’s Laws (MCQ)', questions: 3, durationMin: 5 },
  { id: 'qz2', title: 'Photosynthesis Basics (MCQ)', questions: 3, durationMin: 5 },
];

const QuizCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quizzes</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Take a quiz with timer and AI hint (demo).</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => navigate(`/student/quiz/${q.id}/take`)}
            className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{q.title}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {q.questions} questions • {q.durationMin} min
            </p>
            <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">Start →</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCenter;


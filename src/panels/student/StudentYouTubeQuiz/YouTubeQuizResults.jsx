import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const YouTubeQuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const result = useMemo(() => {
    try {
      const raw = localStorage.getItem(`tutify_student_youtube_quiz_result_${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quiz Results</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Demo scoring summary.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/youtube-quiz')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Done
        </button>
      </div>

      <div className="px-6 py-6 max-w-2xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          {result ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Score: <span className="font-semibold">{result.score}</span> / {result.total}
              </p>
              <p className="text-xs text-gray-500">Completed: {new Date(result.completedAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-200">No results found for this quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeQuizResults;


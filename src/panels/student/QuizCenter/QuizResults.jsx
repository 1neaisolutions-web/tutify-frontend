import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sendCopilotMessage } from '../api/aiApi';

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [explaining, setExplaining] = useState(false);
  const [explainText, setExplainText] = useState('');

  const result = useMemo(() => {
    try {
      const raw = localStorage.getItem(`tutify_student_quiz_result_${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [id]);

  const percent = result ? Math.round((result.score / result.total) * 100) : 0;

  const explainMistakes = async () => {
    if (explaining) return;
    setExplaining(true);
    setExplainText('');
    try {
      await sendCopilotMessage(
        'Explain my mistakes and give me a short improvement plan.',
        'explain',
        (chunk) => setExplainText(chunk),
        () => setExplaining(false)
      );
    } catch (e) {
      setExplainText(`Failed to explain mistakes. ${e?.message || ''}`.trim());
      setExplaining(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quiz Results</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Demo scoring + AI review.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/quizzes')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          {result ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Score: <span className="font-semibold">{result.score}</span> / {result.total} ({percent}%)
              </p>
              {result.autoSubmitted ? <p className="text-xs text-gray-500">Auto-submitted when timer ended.</p> : null}
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-200">No results found.</p>
          )}
        </div>

        {result && percent < 70 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Explain my mistakes</h2>
              <button
                type="button"
                onClick={explainMistakes}
                disabled={explaining}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {explaining ? 'Explaining…' : 'Run AI Review'}
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap min-h-[120px]">
              {explainText || (explaining ? 'Thinking…' : 'Run the AI review to see feedback.')}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuizResults;


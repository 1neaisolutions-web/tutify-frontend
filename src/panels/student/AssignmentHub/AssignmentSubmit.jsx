import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AssignmentSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    window.alert('Submitted (demo).');
    navigate(`/student/assignments/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Submit Assignment</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Demo submission flow.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/student/assignments/${id}`)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-2xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Your submission</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full min-h-[160px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Paste your answer or notes here…"
            />
          </label>
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300">
            File upload placeholder (Phase 2).
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={loading || !text.trim()}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmit;


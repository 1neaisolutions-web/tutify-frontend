import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { solveProblem } from '../api/aiApi';

const NOTES_KEY = 'tutify_student_notes_v1';

const DoubtSolverSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const session = useMemo(() => {
    try {
      const raw = localStorage.getItem('tutify_student_doubt_sessions_v1');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      return list.find((s) => String(s.id) === String(sessionId)) || null;
    } catch {
      return null;
    }
  }, [sessionId]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await solveProblem(session?.problem || 'Solve this problem', session?.subject || 'General');
        if (!alive) return;
        setData(res.data);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Failed to solve');
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [session?.problem, session?.subject]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Doubt Solver Session</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{session?.subject || 'General'} • demo solution</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/doubt-solver')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Problem</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {session?.problem || 'Session not found.'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Solution</h2>
          {loading ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Solving…</p>
          ) : error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : (
            <div className="mt-3 space-y-2">
              {(data?.steps || []).map((s, idx) => (
                <div key={String(idx)} className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2 text-sm text-gray-800 dark:text-gray-100">
                  <span className="font-medium">Step {idx + 1}:</span> {s}
                </div>
              ))}
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100">
                <span className="font-medium">Answer:</span> {data?.answer}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Practice</h2>
          <ul className="mt-3 space-y-2">
            {(data?.practiceProblems || []).length ? (
              data.practiceProblems.map((p) => (
                <li key={p} className="text-sm text-gray-700 dark:text-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">
                  {p}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600 dark:text-gray-300">No practice problems for this demo input.</li>
            )}
          </ul>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                try {
                  const raw = localStorage.getItem(NOTES_KEY);
                  const parsed = raw ? JSON.parse(raw) : [];
                  const list = Array.isArray(parsed) ? parsed : [];
                  const note = {
                    id: `note_${Date.now()}`,
                    title: `Doubt Solver: ${session?.subject || 'General'}`,
                    content: [
                      'Problem:',
                      session?.problem || '',
                      '',
                      'Solution:',
                      ...(data?.steps || []).map((s, i) => `Step ${i + 1}: ${s}`),
                      '',
                      `Answer: ${data?.answer || ''}`,
                    ].join('\n'),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  localStorage.setItem(NOTES_KEY, JSON.stringify([note, ...list].slice(0, 200)));
                  navigate(`/student/notes/${note.id}`);
                } catch {
                  navigate('/student/notes/new');
                }
              }}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Save to Notes
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/doubts')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Ask Teacher Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtSolverSession;


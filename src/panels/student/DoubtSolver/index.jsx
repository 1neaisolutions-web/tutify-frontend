import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoubtSolver = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [subject, setSubject] = useState('Math');

  const start = () => {
    const p = problem.trim();
    if (!p) return;
    const id = `ds_${Date.now()}`;
    const payload = { id, problem: p, subject, createdAt: new Date().toISOString() };
    try {
      const raw = localStorage.getItem('tutify_student_doubt_sessions_v1');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem('tutify_student_doubt_sessions_v1', JSON.stringify([payload, ...list].slice(0, 30)));
    } catch {
      // ignore
    }
    navigate(`/student/doubt-solver/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Doubt Solver</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Step-by-step solution + practice (demo).</p>
      </div>

      <div className="px-6 py-6 max-w-3xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            >
              <option>Math</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Your question / problem</span>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="mt-1 w-full min-h-[140px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Paste the problem statement…"
            />
          </label>
          <button
            type="button"
            onClick={start}
            disabled={!problem.trim()}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Solve
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoubtSolver;


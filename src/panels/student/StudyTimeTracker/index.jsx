import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tutify_student_study_time_sessions_v1';

const loadSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const StudyTimeTracker = () => {
  const [subject, setSubject] = useState('Math');
  const [running, setRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [sessions, setSessions] = useState(() => loadSessions());

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 200)));
    } catch {
      // ignore
    }
  }, [sessions]);

  const saveSession = () => {
    if (elapsedSec < 10) {
      setRunning(false);
      setElapsedSec(0);
      return;
    }
    const item = { id: `sess_${Date.now()}`, subject, seconds: elapsedSec, endedAt: new Date().toISOString() };
    setSessions((prev) => [item, ...prev]);
    setRunning(false);
    setElapsedSec(0);
  };

  const weeklyTotals = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recent = sessions.filter((s) => new Date(s.endedAt).getTime() >= weekAgo);
    const totals = recent.reduce((acc, s) => {
      acc[s.subject] = (acc[s.subject] || 0) + s.seconds;
      return acc;
    }, {});
    return totals;
  }, [sessions]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Study Time Tracker</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Timer + weekly summary (Phase 1 demo).</p>
      </div>

      <div className="px-6 py-6 max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500">Elapsed</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, '0')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRunning((v) => !v)}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              onClick={saveSession}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Save session
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setElapsedSec(0);
              }}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-gray-500">Sessions under 10s are ignored (to avoid accidental saves).</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Last 7 days</h2>
          <div className="mt-3 space-y-2">
            {Object.keys(weeklyTotals).length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">No sessions yet.</p>
            ) : (
              Object.entries(weeklyTotals).map(([k, sec]) => (
                <div key={k} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 px-3 py-2">
                  <span className="text-sm text-gray-800 dark:text-gray-100">{k}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{Math.round(sec / 60)} min</span>
                </div>
              ))
            )}
          </div>

          <h3 className="mt-6 font-semibold text-gray-900 dark:text-gray-100">Recent sessions</h3>
          <div className="mt-3 space-y-2 max-h-[240px] overflow-y-auto">
            {sessions.slice(0, 10).map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                <span>{s.subject}</span>
                <span className="text-gray-500">{Math.round(s.seconds / 60)} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeTracker;


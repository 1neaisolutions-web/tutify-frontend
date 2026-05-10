import { useMemo, useState } from 'react';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const GradeCalculator = () => {
  const [currentGrade, setCurrentGrade] = useState(72);
  const [targetGrade, setTargetGrade] = useState(80);
  const [currentWeight, setCurrentWeight] = useState(70);

  const neededOnFinal = useMemo(() => {
    const cw = clamp(Number(currentWeight) / 100, 0, 0.99);
    const fw = 1 - cw;
    const cur = Number(currentGrade);
    const tgt = Number(targetGrade);
    if (fw <= 0) return null;
    return (tgt - cw * cur) / fw;
  }, [currentGrade, targetGrade, currentWeight]);

  const status = useMemo(() => {
    if (neededOnFinal == null || Number.isNaN(neededOnFinal)) return null;
    if (neededOnFinal <= 0) return { label: 'Already secured', tone: 'green' };
    if (neededOnFinal <= 100) return { label: 'Possible', tone: 'blue' };
    return { label: 'Unlikely', tone: 'red' };
  }, [neededOnFinal]);

  const badgeCls =
    status?.tone === 'green'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
      : status?.tone === 'blue'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200';

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Grade Calculator</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">What score do you need on the final to hit your target?</p>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Current grade (%)</span>
            <input
              type="number"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Target grade (%)</span>
            <input
              type="number"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Current weight (%)</span>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500">Final weight is 100 − currentWeight.</p>
          </label>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Result</h2>
            {status ? <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeCls}`}>{status.label}</span> : null}
          </div>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
            Needed on final: <span className="font-semibold">{neededOnFinal == null ? '—' : `${Math.round(neededOnFinal)}%`}</span>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Formula: target = w_current · current + w_final · final
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;


/**
 * Standardized stat display: number + label + optional trend, used to replace
 * ad hoc stat rows across Progress, Grade Calculator, Study Tracker, Copilot's
 * context strip. `tone` maps to the portal's success=mastery / amber=risk / red=hard-error rule.
 */
const TONE_STYLES = {
  neutral: 'text-gray-900 dark:text-gray-100',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

const StatTile = ({ label, value, trend, tone = 'neutral' }) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-xl font-semibold tracking-tight ${TONE_STYLES[tone] || TONE_STYLES.neutral}`}>{value}</p>
      {trend ? <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{trend}</p> : null}
    </div>
  );
};

export default StatTile;

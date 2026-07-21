/**
 * Shimmer skeleton primitive, replacing bare "Loading…" text across student modules.
 * `rows` renders stacked line skeletons (chat/list contexts); `variant="card"` renders
 * a card-shaped block (grid contexts).
 */
const shimmerClass =
  'bg-[linear-gradient(90deg,rgba(148,163,184,0.15)_25%,rgba(148,163,184,0.35)_37%,rgba(148,163,184,0.15)_63%)] bg-[length:800px_100%] animate-shimmer rounded-md';

const SkeletonBlock = ({ variant = 'line', rows = 3, className = '' }) => {
  if (variant === 'card') {
    return (
      <div className={`rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3 ${className}`}>
        <div className={`${shimmerClass} h-4 w-1/3`} />
        <div className={`${shimmerClass} h-3 w-2/3`} />
        <div className={`${shimmerClass} h-20 w-full`} />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${shimmerClass} h-3.5`} style={{ width: `${85 - i * 12}%` }} />
      ))}
    </div>
  );
};

export default SkeletonBlock;

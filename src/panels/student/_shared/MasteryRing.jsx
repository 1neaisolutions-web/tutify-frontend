/**
 * Circular mastery indicator (SVG, no chart library needed). Reused wherever a single
 * subject/topic mastery number deserves hero visual weight (Study Room, Progress).
 */
const toneForValue = (value) => {
  if (value >= 75) return '#10b981'; // emerald-500
  if (value >= 60) return '#0ea5e9'; // sky-500 (primary)
  return '#f59e0b'; // amber-500
};

const MasteryRing = ({ value, size = 96, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  const offset = circumference - (clamped / 100) * circumference;
  const color = toneForValue(clamped);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-gray-100 dark:stroke-gray-800" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-gray-900 dark:fill-gray-100 font-semibold"
          style={{ fontSize: size * 0.22 }}
        >
          {value == null ? '—' : `${Math.round(value)}%`}
        </text>
      </svg>
      {label ? <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span> : null}
    </div>
  );
};

export default MasteryRing;

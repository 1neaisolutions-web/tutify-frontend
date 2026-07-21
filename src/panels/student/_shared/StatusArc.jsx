/**
 * Horizontal status-arc header for multi-stage flows (Exam: not started → prepared →
 * taken → reflected). `activeIndex` is the furthest-completed stage (-1 = none started).
 */
const StatusArc = ({ stages, activeIndex }) => {
  return (
    <div className="flex items-center" aria-label={`Stage ${activeIndex + 1} of ${stages.length}`}>
      {stages.map((stage, i) => {
        const done = i <= activeIndex;
        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  done ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              />
              <span className={`text-[10px] font-medium whitespace-nowrap ${done ? 'text-primary-700 dark:text-primary-300' : 'text-gray-400 dark:text-gray-600'}`}>
                {stage}
              </span>
            </div>
            {i < stages.length - 1 ? (
              <div className={`h-px flex-1 mx-1.5 mb-4 transition-colors duration-300 ${i < activeIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default StatusArc;

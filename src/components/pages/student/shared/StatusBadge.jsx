const StatusBadge = ({ label = 'Status', tone = 'gray' }) => {
  const tones = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone] || tones.gray}`}>
      {label}
    </span>
  );
};

export default StatusBadge;


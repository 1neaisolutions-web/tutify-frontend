const ModeSelectorChip = ({ label, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full text-xs font-medium border transition',
        active
          ? 'bg-primary-600 text-white border-primary-600'
          : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900',
      ].join(' ')}
    >
      {label}
    </button>
  );
};

export default ModeSelectorChip;


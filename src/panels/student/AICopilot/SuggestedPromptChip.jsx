const SuggestedPromptChip = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(text)}
      className="text-left px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
    >
      {text}
    </button>
  );
};

export default SuggestedPromptChip;


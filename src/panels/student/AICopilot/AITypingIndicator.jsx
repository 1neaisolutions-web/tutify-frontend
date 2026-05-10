const AITypingIndicator = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.1s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
        </span>
        <span>Thinking…</span>
      </div>
    </div>
  );
};

export default AITypingIndicator;


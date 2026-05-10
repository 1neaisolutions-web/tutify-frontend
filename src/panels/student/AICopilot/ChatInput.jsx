import { useEffect, useState } from 'react';

const ChatInput = ({ onSend, disabled, onStop }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && value.trim()) onSend?.(value.trim());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [disabled, onSend, value]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-4">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 min-h-[44px] max-h-[160px] resize-y rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          placeholder="Type a message…"
        />
        {disabled ? (
          <button
            type="button"
            onClick={onStop}
            className="h-[44px] px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            disabled={!value.trim()}
            onClick={() => {
              const text = value.trim();
              if (!text) return;
              setValue('');
              onSend?.(text);
            }}
            className="h-[44px] px-4 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">Tip: Press Ctrl/⌘ + Enter to send.</p>
    </div>
  );
};

export default ChatInput;


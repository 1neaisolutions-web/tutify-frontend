const MessageBubble = ({ role, text }) => {
  const isUser = role === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800',
        ].join(' ')}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;


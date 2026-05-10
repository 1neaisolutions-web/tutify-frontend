import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import AITypingIndicator from './AITypingIndicator';

const ChatThread = ({ messages, isGenerating, streamingText }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isGenerating, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" aria-live="polite">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} text={m.text} />
      ))}

      {isGenerating ? (
        streamingText ? (
          <MessageBubble role="assistant" text={streamingText} />
        ) : (
          <AITypingIndicator />
        )
      ) : null}

      <div ref={endRef} />
    </div>
  );
};

export default ChatThread;


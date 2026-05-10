import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ChatThread from '../AICopilot/ChatThread';
import ChatInput from '../AICopilot/ChatInput';

const personaIntro = (tutorId) => {
  switch (tutorId) {
    case 'math-mentor':
      return "I'm your Math Mentor. I'll show worked steps and check your reasoning.";
    case 'science-guide':
      return "I'm your Science Guide. I'll explain concepts with intuition and examples.";
    case 'essay-coach':
      return "I'm your Essay Coach. I'll help you structure arguments and improve clarity.";
    default:
      return "I'm your tutor. Ask your question and I'll help.";
  }
};

const tutorName = (tutorId) => {
  switch (tutorId) {
    case 'math-mentor':
      return 'Math Mentor';
    case 'science-guide':
      return 'Science Guide';
    case 'essay-coach':
      return 'Essay Coach';
    default:
      return 'AI Tutor';
  }
};

const cannedResponse = (tutorId, text) => {
  const msg = String(text || '').toLowerCase();
  if (tutorId === 'math-mentor') {
    if (msg.includes('newton')) return "Let's do it step-by-step. What are the two objects interacting? Then we’ll write the action/reaction force pair.";
    return "Show me the problem and what you've tried. I'll list the givens, pick a method, then solve step-by-step.";
  }
  if (tutorId === 'science-guide') {
    if (msg.includes('photo')) return "Photosynthesis has two big parts: light reactions (make ATP/NADPH) and the Calvin cycle (build sugar from CO2). Want a quick diagram-style summary?";
    return "Tell me the topic and level. I'll explain the intuition first, then the key terms, then a quick self-check question.";
  }
  if (tutorId === 'essay-coach') {
    return "Share your prompt and your thesis. I'll propose an outline, then improve topic sentences and evidence placement.";
  }
  return "Got it. Tell me a bit more and I'll help.";
};

const AITutorChat = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => [
    { id: 'sys_1', role: 'assistant', text: personaIntro(tutorId) },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const timerRef = useRef(null);

  const title = useMemo(() => tutorName(tutorId), [tutorId]);

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsGenerating(false);
    setStreamingText('');
  };

  const send = async (text) => {
    if (!text || isGenerating) return;
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: 'user', text }]);
    setIsGenerating(true);
    setStreamingText('');

    const full = cannedResponse(tutorId, text);
    // simple streaming simulation
    const words = full.split(/\s+/).filter(Boolean);
    let idx = 0;
    const tick = () => {
      idx += 1;
      setStreamingText(words.slice(0, idx).join(' '));
      if (idx >= words.length) {
        setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: 'assistant', text: full }]);
        setIsGenerating(false);
        setStreamingText('');
        timerRef.current = null;
        return;
      }
      timerRef.current = setTimeout(tick, 40);
    };
    timerRef.current = setTimeout(tick, 300);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full flex flex-col bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Domain style chat (demo).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/tutors')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <ChatThread messages={messages} isGenerating={isGenerating} streamingText={streamingText} />
      <ChatInput onSend={send} disabled={isGenerating} onStop={stop} />
    </div>
  );
};

export default AITutorChat;


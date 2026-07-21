import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ChatThread from '../AICopilot/ChatThread';
import ChatInput from '../AICopilot/ChatInput';
import { sendCopilotMessage } from '../api/aiApi';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';

/**
 * Thin persona map: each tutor reuses the shared Copilot AI pipeline
 * (sendCopilotMessage) but biases the AI mode and wraps the reply with a
 * persona-specific framing so the three tutors feel distinct without
 * duplicating response logic.
 */
export const TUTOR_PERSONAS = {
  'math-mentor': {
    name: 'Math Mentor',
    style: 'socratic',
    mode: 'explain',
    accent: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200',
  },
  'lab-partner': {
    name: 'Lab Partner',
    style: 'lab-partner',
    mode: 'explain',
    accent: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200',
  },
  'essay-coach': {
    name: 'Essay Coach',
    style: 'coach',
    mode: 'summarise',
    accent: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200',
  },
};

const DEFAULT_PERSONA = { name: 'AI Tutor', style: 'default', mode: 'qa', accent: 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200' };

const framePersonaReply = (style, text) => {
  switch (style) {
    case 'socratic':
      return `Before I hand you the full answer — what have you tried so far? Here's a guided, step-by-step walkthrough:\n\n${text}`;
    case 'lab-partner':
      return `Let's think like scientists for a second. Here's the concept broken down:\n\n${text}`;
    case 'coach':
      return `Good start — let's sharpen this. Here's my feedback and a suggested structure:\n\n${text}`;
    default:
      return text;
  }
};

const personaIntro = (tutorId, t) => {
  switch (tutorId) {
    case 'math-mentor':
      return t('studentPanel.tutors.chat.intro.mathMentor');
    case 'lab-partner':
      return t('studentPanel.tutors.chat.intro.labPartner');
    case 'essay-coach':
      return t('studentPanel.tutors.chat.intro.essayCoach');
    default:
      return t('studentPanel.tutors.chat.intro.default');
  }
};

const tutorName = (tutorId, t) => {
  switch (tutorId) {
    case 'math-mentor':
      return t('studentPanel.tutors.mathMentor.name');
    case 'lab-partner':
      return t('studentPanel.tutors.labPartner.name');
    case 'essay-coach':
      return t('studentPanel.tutors.essayCoach.name');
    default:
      return t('studentPanel.tutors.defaultName');
  }
};

const loadThread = (tutorId) => {
  const threads = readJson(STUDENT_STORAGE_KEYS.TUTOR_THREADS, {});
  return Array.isArray(threads[tutorId]) ? threads[tutorId] : null;
};

const saveThread = (tutorId, messages) => {
  const threads = readJson(STUDENT_STORAGE_KEYS.TUTOR_THREADS, {});
  threads[tutorId] = messages.slice(-50);
  writeJson(STUDENT_STORAGE_KEYS.TUTOR_THREADS, threads);
};

const AITutorChat = () => {
  const { t } = useTranslation();
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const persona = useMemo(() => TUTOR_PERSONAS[tutorId] || DEFAULT_PERSONA, [tutorId]);

  const [messages, setMessages] = useState(() => {
    const existing = loadThread(tutorId);
    return existing && existing.length ? existing : [{ id: 'sys_1', role: 'assistant', text: personaIntro(tutorId, t) }];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const cleanupRef = useRef(null);
  const sessionEmittedRef = useRef(false);

  const title = useMemo(() => tutorName(tutorId, t), [tutorId, t]);

  useEffect(() => {
    if (sessionEmittedRef.current) return;
    sessionEmittedRef.current = true;
    emitStudentEvent({ module: 'tutors', action: 'session_start', topic: tutorId, subject: title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId]);

  useEffect(() => {
    saveThread(tutorId, messages);
  }, [tutorId, messages]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [tutorId]);

  const stop = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setIsGenerating(false);
    setStreamingText('');
  };

  const send = async (text) => {
    if (!text || isGenerating) return;
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: 'user', text }]);
    setIsGenerating(true);
    setStreamingText('');

    emitStudentEvent({ module: 'tutors', action: 'message_sent', topic: tutorId, subject: title });

    const chunkRef = { current: '' };
    try {
      cleanupRef.current = await sendCopilotMessage(
        text,
        persona.mode,
        (chunk) => {
          chunkRef.current = chunk;
          setStreamingText(framePersonaReply(persona.style, chunk));
        },
        () => {
          setMessages((prev) => [
            ...prev,
            { id: `a_${Date.now()}`, role: 'assistant', text: framePersonaReply(persona.style, String(chunkRef.current || '').trim()) },
          ]);
          setIsGenerating(false);
          setStreamingText('');
          cleanupRef.current = null;
        }
      );
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: `err_${Date.now()}`, role: 'assistant', text: t('studentPanel.common.sorryError', { message: e?.message || '' }).trim() },
      ]);
      setIsGenerating(false);
      setStreamingText('');
      cleanupRef.current = null;
    }
  };

  return (
    <div className="h-full min-h-0 w-full flex flex-col bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="AI Tutors"
        title={title}
        subtitle={t('studentPanel.tutors.chat.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/tutors')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      >
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${persona.accent}`}>
          {persona.style === 'socratic'
            ? 'Socratic style'
            : persona.style === 'lab-partner'
            ? 'Lab partner style'
            : persona.style === 'coach'
            ? 'Coaching style'
            : 'Tutor'}
        </span>
      </PageHeader>

      <ChatThread messages={messages} isGenerating={isGenerating} streamingText={streamingText} />
      <ChatInput onSend={send} disabled={isGenerating} onStop={stop} />
    </div>
  );
};

export default AITutorChat;

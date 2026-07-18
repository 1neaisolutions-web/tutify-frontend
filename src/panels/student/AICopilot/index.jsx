import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AI_MODES, DEFAULT_AI_MODE } from '../constants/aiModes';
import { sendCopilotMessage } from '../api/aiApi';

import { GamificationSummaryCard } from '@/features/gamification';

import ChatThread from './ChatThread';
import ChatInput from './ChatInput';
import ModeSelectorChip from './ModeSelectorChip';
import SuggestedPromptChip from './SuggestedPromptChip';

const ONBOARDING_KEY = 'tutify_student_onboarding_completed';
const MAX_MESSAGES = 50;

const makeStorageKey = (mode) => `tutify_student_copilot_thread_${mode}`;

const AICopilot = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(DEFAULT_AI_MODE);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const cleanupRef = useRef(null);

  const suggestedPrompts = useMemo(
    () => [
      t('studentPanel.copilot.prompts.newton'),
      t('studentPanel.copilot.prompts.summariseNotes'),
      t('studentPanel.copilot.prompts.photosynthesis'),
      t('studentPanel.copilot.prompts.studyPlan'),
    ],
    [t]
  );

  useEffect(() => {
    if (localStorage.getItem(ONBOARDING_KEY) !== 'true') {
      navigate('/student/onboarding', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(makeStorageKey(mode));
      const parsed = raw ? JSON.parse(raw) : [];
      setMessages(Array.isArray(parsed) ? parsed : []);
    } catch {
      setMessages([]);
    }
    setStreamingText('');
    setIsGenerating(false);
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, [mode]);

  useEffect(() => {
    try {
      const capped = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(makeStorageKey(mode), JSON.stringify(capped));
    } catch {
      // ignore storage failures
    }
  }, [messages, mode]);

  const stopGenerating = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setIsGenerating(false);
    setStreamingText('');
  };

  const sendMessage = async (text) => {
    if (!text) return;
    if (isGenerating) return;

    const userMsg = { id: `u_${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev.slice(-MAX_MESSAGES + 1), userMsg]);
    setIsGenerating(true);
    setStreamingText('');

    try {
      cleanupRef.current = await sendCopilotMessage(
        text,
        mode,
        (chunk) => {
          chunkOrEmptyRef.current = chunk;
          setStreamingText(chunk);
        },
        () => {
          setMessages((prev) => {
            const assistantMsg = { id: `a_${Date.now()}`, role: 'assistant', text: String(chunkOrEmptyRef.current || '').trim() };
            const merged = [...prev, assistantMsg].slice(-MAX_MESSAGES);
            return merged;
          });
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

  // Keep latest stream without re-render timing bugs
  const chunkOrEmptyRef = useRef('');
  useEffect(() => {
    chunkOrEmptyRef.current = streamingText;
  }, [streamingText]);

  const showEmpty = messages.length === 0 && !isGenerating;

  return (
    <div className="min-h-[calc(100vh-65px)] w-full flex flex-col bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.copilot.title')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('studentPanel.copilot.subtitle')}
              </p>
            </div>
          </div>

          <GamificationSummaryCard />

          <div className="flex flex-wrap gap-2">
            {AI_MODES.map((m) => (
              <ModeSelectorChip key={m.key} label={t(`studentPanel.copilot.modes.${m.key}`)} active={m.key === mode} onClick={() => setMode(m.key)} />
            ))}
          </div>
        </div>
      </div>

      {showEmpty ? (
        <div className="flex-1 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.copilot.empty.title')}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {t('studentPanel.copilot.empty.subtitle')}
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedPrompts.map((p) => (
                  <SuggestedPromptChip key={p} text={p} onClick={(t) => sendMessage(t)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ChatThread messages={messages} isGenerating={isGenerating} streamingText={streamingText} />
      )}

      <ChatInput onSend={sendMessage} disabled={isGenerating} onStop={stopGenerating} />
    </div>
  );
};

export default AICopilot;


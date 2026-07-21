import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AI_MODES, DEFAULT_AI_MODE } from '../constants/aiModes';
import { sendCopilotMessage } from '../api/aiApi';
import { getCopilotContextItems, MAYA_PROFILE } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { getActivityStreakDays } from '../utils/studentEventLog';

import ChatThread from './ChatThread';
import ChatInput from './ChatInput';
import ModeSelectorChip from './ModeSelectorChip';
import SuggestedPromptChip from './SuggestedPromptChip';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import StatTile from '../_shared/StatTile';
import FadeIn from '../_shared/FadeIn';

const greetingForNow = (name) => {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return `Good ${timeOfDay}, ${name}`;
};

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
      'Help me review for the Algebra II midterm in 3 days',
      'Explain how to factor x² + 5x + 6 step by step',
      'Quiz me on photosynthesis for Biology',
      t('studentPanel.copilot.prompts.studyPlan'),
    ],
    [t]
  );

  const contextItems = useMemo(() => getCopilotContextItems(), []);
  const streakDays = useMemo(() => getActivityStreakDays(), [messages]);
  const studentName = useMemo(() => {
    const profile = readJson(STUDENT_STORAGE_KEYS.PROFILE, { name: '' });
    return profile?.name?.trim() || MAYA_PROFILE.name;
  }, []);

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
    <div className="h-full min-h-0 w-full flex flex-col bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow={t('studentPanel.copilot.title')}
        title={greetingForNow(studentName)}
        subtitle={t('studentPanel.copilot.subtitle')}
        right={<StatTile label="Streak" value={`${streakDays}d`} tone={streakDays > 0 ? 'success' : 'neutral'} />}
      >
        <div className="flex flex-wrap gap-2">
          {AI_MODES.map((m) => (
            <ModeSelectorChip key={m.key} label={t(`studentPanel.copilot.modes.${m.key}`)} active={m.key === mode} onClick={() => setMode(m.key)} />
          ))}
        </div>
      </PageHeader>

      <FadeIn className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50/60 to-emerald-50/40 dark:from-primary-950/20 dark:to-emerald-950/10">
        <div className="flex flex-wrap items-center gap-2">
          {contextItems.nextExam ? (
            <button
              type="button"
              onClick={() => navigate(`/student/exams/${contextItems.nextExam.id}/prepare`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
              {contextItems.nextExam.title} in {contextItems.daysUntilExam}d
            </button>
          ) : null}
          {contextItems.dueSoon.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/student/assignments/${item.id}`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {item.title} · due {new Date(item.dueAt).toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
            </button>
          ))}
          {!contextItems.nextExam && contextItems.dueSoon.length === 0 ? (
            <p className="text-xs text-gray-500">No urgent items — nice work staying on top of things.</p>
          ) : null}
        </div>
      </FadeIn>

      {showEmpty ? (
        <div className="flex-1 px-6 py-8">
          <FadeIn className="max-w-3xl mx-auto">
            <SectionCard accent className="p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.copilot.empty.title')}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {t('studentPanel.copilot.empty.subtitle')}
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedPrompts.map((p) => (
                  <SuggestedPromptChip key={p} text={p} onClick={(t) => sendMessage(t)} />
                ))}
              </div>
            </SectionCard>
          </FadeIn>
        </div>
      ) : (
        <ChatThread messages={messages} isGenerating={isGenerating} streamingText={streamingText} />
      )}

      <ChatInput onSend={sendMessage} disabled={isGenerating} onStop={stopGenerating} />
    </div>
  );
};

export default AICopilot;


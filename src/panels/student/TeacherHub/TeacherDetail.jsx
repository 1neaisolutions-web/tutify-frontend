import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSnackbar } from '../../../hooks/useSnackbar';
import { MAYA_TEACHERS } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const AUTO_REPLIES = [
  "Thanks for reaching out — I'll take a look and get back to you before our next class.",
  'Got it. Can you share which problem number is giving you trouble?',
  "Good question — let's go over this together during office hours this week.",
];

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const TeacherDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState(() => readJson(STUDENT_STORAGE_KEYS.MESSAGES, {}));

  const teacher = useMemo(() => {
    const found = MAYA_TEACHERS.find((tt) => tt.id === id);
    return found || { id, name: t('studentPanel.teachers.detail.unknownTeacher'), subject: '—' };
  }, [id, t]);

  const color = subjectColor(teacher.subjectId);
  const thread = threads[id] || [];

  const send = () => {
    const text = message.trim();
    if (!text) return;

    const studentMsg = { id: `msg_${Date.now()}`, sender: 'student', text, sentAt: new Date().toISOString() };
    const autoReply = {
      id: `msg_${Date.now() + 1}`,
      sender: 'teacher',
      text: AUTO_REPLIES[thread.length % AUTO_REPLIES.length],
      sentAt: new Date(Date.now() + 1000).toISOString(),
    };
    const nextThread = [...thread, studentMsg, autoReply];
    const nextThreads = { ...threads, [id]: nextThread };
    setThreads(nextThreads);
    writeJson(STUDENT_STORAGE_KEYS.MESSAGES, nextThreads);

    emitStudentEvent({
      module: 'teachers',
      action: 'message_sent',
      subject: teacher.subject,
      artifactRef: id,
    });

    setMessage('');
    toast.success(t('studentPanel.teachers.detail.successAlert'));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Teachers"
        title={teacher.name}
        subtitle={`${teacher.subject}${teacher.room ? ` · ${t('studentPanel.teachers.room')} ${teacher.room}` : ''}`}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/teachers')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      >
        <div className={`inline-flex h-9 w-9 rounded-full items-center justify-center text-xs font-semibold text-white ${color.bar}`}>
          {initials(teacher.name)}
        </div>
      </PageHeader>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <FadeIn>
          <SectionCard className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('studentPanel.teachers.detail.thread')}</h2>
            {thread.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.teachers.detail.noMessages')}</p>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto">
                {thread.map((m) => (
                  <FadeIn key={m.id}>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        m.sender === 'student'
                          ? 'ml-auto bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <p className={`mt-1 text-[11px] ${m.sender === 'student' ? 'text-primary-100' : 'text-gray-500'}`}>
                        {new Date(m.sentAt).toLocaleString()}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}
          </SectionCard>
        </FadeIn>

        <FadeIn delayMs={60}>
          <SectionCard accent className="p-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.teachers.detail.sendMessage')}</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
                placeholder={t('studentPanel.teachers.detail.placeholder')}
              />
            </label>
            <button
              type="button"
              onClick={send}
              disabled={!message.trim()}
              className="mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
            >
              {t('studentPanel.common.send')}
            </button>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default TeacherDetail;

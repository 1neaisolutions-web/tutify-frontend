import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAYA_TEACHERS } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const TeacherHub = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const threads = useMemo(() => readJson(STUDENT_STORAGE_KEYS.MESSAGES, {}), []);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Teachers" title={t('studentPanel.teachers.title')} subtitle={t('studentPanel.teachers.subtitle')} />

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <FadeIn>
          <SectionCard className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.teachers.myTeachers')}</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {MAYA_TEACHERS.map((teacher) => {
                const thread = threads[teacher.id] || [];
                const lastMessage = thread[thread.length - 1];
                const awaitingReply = lastMessage?.sender === 'student';
                const color = subjectColor(teacher.subjectId);
                return (
                  <button
                    key={teacher.id}
                    type="button"
                    onClick={() => navigate(`/student/teachers/${teacher.id}`)}
                    className="text-left rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${color.bar}`}>
                        {initials(teacher.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{teacher.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{teacher.subject}</p>
                          </div>
                          {thread.length > 0 ? (
                            <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-200">
                              {t('studentPanel.teachers.messageCount', { count: thread.length })}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{teacher.room ? `${t('studentPanel.teachers.room')}: ${teacher.room}` : teacher.email}</p>
                        {lastMessage ? (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{lastMessage.text}</p>
                        ) : null}
                        {awaitingReply ? (
                          <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium">Usually replies within a few hours</p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </FadeIn>

        <FadeIn delayMs={60}>
          <SectionCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.teachers.myDoubts')}</h2>
              <button
                type="button"
                onClick={() => navigate('/student/doubts')}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {t('studentPanel.common.viewAll')}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.teachers.doubtsHint')}</p>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default TeacherHub;

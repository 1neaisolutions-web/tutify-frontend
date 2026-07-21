import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getProgressSubject } from '../data/mayaChenDemoData';
import { getEffectiveTopicScore } from '../utils/studentEventLog';
import StudentEmptyState from '../_shared/StudentEmptyState';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import AiAssistedChip from '../_shared/AiAssistedChip';

const LEVEL_META = {
  strong: { label: 'Strong', cls: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200', bar: 'bg-emerald-500' },
  moderate: { label: 'Moderate', cls: 'bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800 text-sky-800 dark:text-sky-200', bar: 'bg-sky-500' },
  weak: { label: 'Weak', cls: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-amber-800 dark:text-amber-200', bar: 'bg-amber-500' },
  not_assessed: { label: 'Not assessed', cls: 'bg-gray-50 border-gray-200 dark:bg-gray-900/40 dark:border-gray-800 text-gray-500 dark:text-gray-400', bar: 'bg-gray-300 dark:bg-gray-700' },
};

const SubjectProgress = () => {
  const { t } = useTranslation();
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const subject = useMemo(() => getProgressSubject(subjectId), [subjectId]);

  const topics = useMemo(() => {
    if (!subject) return [];
    return subject.topics.map((topic) => ({
      ...topic,
      liveScore: getEffectiveTopicScore(subjectId, topic.id, topic.score),
    }));
  }, [subject, subjectId]);

  const sortedHistory = useMemo(() => {
    if (!subject) return [];
    return [...subject.scoreHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [subject]);

  if (!subject) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <StudentEmptyState
          title="Subject not found"
          subtitle="We couldn't find progress data for this subject."
          ctaLabel="Back to Progress"
          ctaPath="/student/progress"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="My Progress"
        title={subject.name}
        subtitle={`Mastery ${subject.masteryPct}% · ${subject.assignmentsDone}/${subject.totalAssignments} assignments done`}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/progress')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <FadeIn>
          <SectionCard accent className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Topic mastery</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.map((topic) => {
                const meta = LEVEL_META[topic.level] || LEVEL_META.not_assessed;
                return (
                  <div key={topic.id} className={`rounded-lg border p-3 ${meta.cls}`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{topic.name}</p>
                      <span className="text-xs font-semibold uppercase tracking-wide">{meta.label}</span>
                    </div>
                    <p className="mt-1 text-lg font-bold">{topic.liveScore != null ? `${topic.liveScore}%` : '—'}</p>
                    {topic.liveScore != null ? (
                      <div className="mt-2 h-1.5 rounded-full bg-white/60 dark:bg-black/20 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${meta.bar}`}
                          style={{ width: `${topic.liveScore}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </FadeIn>

        <FadeIn delayMs={80}>
          <SectionCard className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.progress.subject.scoreHistory')}</h2>
            {sortedHistory.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">No score history yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {sortedHistory.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{h.label}</p>
                      <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString()} • {h.topic}</p>
                    </div>
                    <span
                      className={`font-semibold ${
                        h.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : h.score >= 60 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {h.score}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </FadeIn>

        {subject.recommendation ? (
          <FadeIn delayMs={140}>
            <SectionCard hero accent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.progress.subject.recommendations')}</h2>
                <AiAssistedChip label="AI-assisted" />
              </div>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{subject.recommendation.title}</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{subject.recommendation.detail}</p>
              <button
                type="button"
                onClick={() => navigate(subject.recommendation.actionPath)}
                className="mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm transition-colors"
              >
                Act on this
              </button>
            </SectionCard>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default SubjectProgress;

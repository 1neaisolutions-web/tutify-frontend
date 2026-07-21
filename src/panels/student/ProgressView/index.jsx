import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAYA_PROGRESS } from '../data/mayaChenDemoData';
import { getActivityStreakDays, getEffectiveTopicScore } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import StatTile from '../_shared/StatTile';
import FadeIn from '../_shared/FadeIn';
import AiAssistedChip from '../_shared/AiAssistedChip';

const TREND_META = {
  improving: { label: '↑ Improving', cls: 'text-emerald-700 dark:text-emerald-300' },
  declining: { label: '↓ Declining', cls: 'text-red-700 dark:text-red-300' },
  stable: { label: '→ Stable', cls: 'text-gray-600 dark:text-gray-300' },
};

const TOPIC_DOT_CLS = {
  strong: 'bg-emerald-500',
  moderate: 'bg-sky-500',
  weak: 'bg-amber-500',
  not_assessed: 'bg-gray-200 dark:bg-gray-800',
};

const ProgressView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const subjects = useMemo(
    () =>
      MAYA_PROGRESS.subjects.map((s) => {
        const topics = s.topics.map((topic) => ({
          ...topic,
          score: getEffectiveTopicScore(s.id, topic.id, topic.score),
        }));
        const assessed = topics.filter((topic) => topic.score != null);
        const liveMastery = assessed.length
          ? Math.round(assessed.reduce((sum, topic) => sum + topic.score, 0) / assessed.length)
          : s.masteryPct;
        return { ...s, topics, liveMastery };
      }),
    []
  );

  const streak = useMemo(() => getActivityStreakDays(), []);

  const overall = useMemo(() => {
    const avg = Math.round(subjects.reduce((a, s) => a + s.liveMastery, 0) / subjects.length);
    const done = subjects.reduce((a, s) => a + s.assignmentsDone, 0);
    const total = subjects.reduce((a, s) => a + s.totalAssignments, 0);
    return { avg, done, total };
  }, [subjects]);

  // The single weakest assessed topic across every subject — the "the system knows you" hero moment.
  const weakestOverall = useMemo(() => {
    let worst = null;
    for (const s of subjects) {
      for (const topic of s.topics) {
        if (topic.score == null) continue;
        if (!worst || topic.score < worst.score) {
          worst = { subjectId: s.id, subjectName: s.name, ...topic };
        }
      }
    }
    return worst;
  }, [subjects]);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="My Progress"
        title={t('studentPanel.progress.title')}
        subtitle={t('studentPanel.progress.subtitle')}
      />

      <div className="px-6 py-6 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatTile label={t('studentPanel.progress.stats.quizAverage')} value={`${overall.avg}%`} tone={overall.avg >= 75 ? 'success' : overall.avg >= 60 ? 'warning' : 'danger'} />
          <StatTile label={t('studentPanel.progress.stats.assignments')} value={`${overall.done}/${overall.total}`} />
          <StatTile label={t('studentPanel.progress.stats.streak')} value={`${streak} ${streak === 1 ? 'day' : 'days'}`} tone={streak > 0 ? 'success' : 'neutral'} />
        </div>

        {weakestOverall ? (
          <FadeIn>
            <SectionCard hero accent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Weakest topic right now</span>
                    <AiAssistedChip label="AI-flagged" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {weakestOverall.name} <span className="text-gray-500 dark:text-gray-400 font-normal">· {weakestOverall.subjectName}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Sitting at {weakestOverall.score}% — this is dragging {weakestOverall.subjectName} down the most. A focused session here has the biggest payoff.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/student/progress/${weakestOverall.subjectId}`)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium transition-colors"
                >
                  {t('studentPanel.progress.viewDetails')}
                </button>
              </div>
            </SectionCard>
          </FadeIn>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((s, i) => {
            const trend = TREND_META[s.trend] || TREND_META.stable;
            return (
              <FadeIn key={s.id} delayMs={i * 60}>
                <button
                  type="button"
                  onClick={() => navigate(`/student/progress/${s.id}`)}
                  className="text-left w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</h2>
                    <span className={`text-xs font-medium ${trend.cls}`}>{trend.label}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          s.liveMastery >= 75 ? 'bg-emerald-500' : s.liveMastery >= 60 ? 'bg-sky-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${s.liveMastery}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-10 text-right">{s.liveMastery}%</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Assignments: {s.assignmentsDone}/{s.totalAssignments}
                  </p>

                  <div className="mt-3 flex gap-1">
                    {s.topics.map((topic) => (
                      <span key={topic.id} title={`${topic.name}: ${topic.level}`} className={`h-1.5 flex-1 rounded-full ${TOPIC_DOT_CLS[topic.level] || TOPIC_DOT_CLS.not_assessed}`} />
                    ))}
                  </div>

                  <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">{t('studentPanel.progress.viewDetails')}</p>
                </button>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;

import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

import { LineBarChat } from '../../../components/shared/LineBarChat';
import { MAYA_SUBJECTS } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent, getActivityStreakDays } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import StatTile from '../_shared/StatTile';
import FadeIn from '../_shared/FadeIn';

const SUBJECT_COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];
const WEEKLY_GOAL_MIN = 150;

const dayLabel = (date) => date.toLocaleDateString(undefined, { weekday: 'short' });

const StudyTimeTracker = () => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState(MAYA_SUBJECTS[0]?.name || 'Algebra II');
  const [running, setRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [sessions, setSessions] = useState(() => readJson(STUDENT_STORAGE_KEYS.STUDY_TIME_SESSIONS, []));

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    writeJson(STUDENT_STORAGE_KEYS.STUDY_TIME_SESSIONS, sessions.slice(0, 200));
  }, [sessions]);

  const saveSession = () => {
    setRunning(false);
    if (elapsedSec < 10) {
      setElapsedSec(0);
      return;
    }
    const item = { id: `sess_${Date.now()}`, subject, seconds: elapsedSec, endedAt: new Date().toISOString() };
    setSessions((prev) => [item, ...prev]);
    emitStudentEvent({
      module: 'study_time',
      action: 'session_start',
      subject,
      outcome: { timeSpentSec: elapsedSec },
    });
    setElapsedSec(0);
  };

  const streakDays = useMemo(() => getActivityStreakDays(), [sessions]);

  const weeklyTotals = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recent = sessions.filter((s) => new Date(s.endedAt).getTime() >= weekAgo);
    return recent.reduce((acc, s) => {
      acc[s.subject] = (acc[s.subject] || 0) + s.seconds;
      return acc;
    }, {});
  }, [sessions]);

  const weeklyTotalMin = useMemo(
    () => Math.round(Object.values(weeklyTotals).reduce((a, s) => a + s, 0) / 60),
    [weeklyTotals]
  );
  const goalPct = Math.min(100, Math.round((weeklyTotalMin / WEEKLY_GOAL_MIN) * 100));

  const chartData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    const categories = days.map(dayLabel);

    const subjectNames = MAYA_SUBJECTS.map((s) => s.name);
    const usedSubjects = new Set(sessions.map((s) => s.subject));
    const allSubjects = [...new Set([...subjectNames, ...usedSubjects])];

    const series = allSubjects
      .map((name, idx) => {
        const data = days.map((d) => {
          const dayEnd = new Date(d);
          dayEnd.setDate(d.getDate() + 1);
          const minutes = sessions
            .filter((s) => s.subject === name && new Date(s.endedAt) >= d && new Date(s.endedAt) < dayEnd)
            .reduce((sum, s) => sum + s.seconds, 0) / 60;
          return Math.round(minutes * 10) / 10;
        });
        return { name, data, color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length] };
      })
      .filter((s) => s.data.some((v) => v > 0));

    return { categories, series };
  }, [sessions]);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Study Tracker" title={t('studentPanel.studyTime.title')} subtitle={t('studentPanel.studyTime.subtitle')} />

      <div className="px-6 py-6 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatTile label="Streak" value={`${streakDays}d`} tone={streakDays > 0 ? 'success' : 'neutral'} />
          <StatTile label="This week" value={`${weeklyTotalMin}m`} trend={`Goal: ${WEEKLY_GOAL_MIN}m`} tone={goalPct >= 100 ? 'success' : 'neutral'} />
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Weekly goal</p>
            <div className="mt-1.5 h-2 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
              <div className="h-full rounded-full bg-primary-500 transition-all duration-700 ease-out" style={{ width: `${goalPct}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{goalPct}% of {WEEKLY_GOAL_MIN}m</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn>
            <SectionCard accent className="p-4 space-y-4 h-full">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.doubtSolver.fields.subject')}</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  {MAYA_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-500">{t('studentPanel.studyTime.elapsed')}</p>
                <p className={`text-3xl font-semibold tabular-nums text-gray-900 dark:text-gray-100 ${running ? 'animate-pulse' : ''}`}>
                  {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, '0')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRunning((v) => !v)}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
                >
                  {running ? t('studentPanel.common.pause') : t('studentPanel.common.start')}
                </button>
                <button
                  type="button"
                  onClick={saveSession}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {t('studentPanel.studyTime.saveSession')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    setElapsedSec(0);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {t('studentPanel.common.reset')}
                </button>
              </div>

              <p className="text-xs text-gray-500">{t('studentPanel.studyTime.minDurationHint')}</p>
            </SectionCard>
          </FadeIn>

          <FadeIn delayMs={60}>
            <SectionCard className="p-4 h-full">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.studyTime.last7Days')}</h2>
              <div className="mt-3 space-y-2">
                {Object.keys(weeklyTotals).length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.studyTime.empty')}</p>
                ) : (
                  Object.entries(weeklyTotals).map(([k, sec]) => (
                    <div key={k} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 px-3 py-2">
                      <span className="text-sm text-gray-800 dark:text-gray-100">{k}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{Math.round(sec / 60)} min</span>
                    </div>
                  ))
                )}
              </div>

              <h3 className="mt-6 font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.studyTime.recentSessions')}</h3>
              <div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto">
                {sessions.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.studyTime.empty')}</p>
                ) : (
                  sessions.slice(0, 10).map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                      <span>{s.subject}</span>
                      <span className="text-gray-500">{Math.round(s.seconds / 60)} min</span>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </FadeIn>

          <FadeIn delayMs={100} className="lg:col-span-2">
            <SectionCard className="p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.studyTime.chartTitle')}</h2>
              {chartData.series.length === 0 ? (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.studyTime.chartEmpty')}</p>
              ) : (
                <div className="mt-3">
                  <LineBarChat
                    categories={chartData.categories}
                    series={chartData.series}
                    colors={chartData.series.map((s) => s.color)}
                    type="bar"
                    height="300px"
                    yFormatter={(v) => `${v}m`}
                  />
                </div>
              )}
            </SectionCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeTracker;

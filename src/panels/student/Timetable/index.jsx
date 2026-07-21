import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAYA_TIMETABLE } from '../data/mayaChenDemoData';
import { emitStudentEvent } from '../utils/studentEventLog';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const DAY_NAMES = Object.keys(MAYA_TIMETABLE);

const parseStartMinutes = (timeRange) => {
  const start = timeRange.split(/[–-]/)[0].trim();
  const [h, m] = start.split(':').map(Number);
  return h * 60 + (m || 0);
};

const getNextClassInfo = () => {
  const now = new Date();
  const todayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const todayIdx = DAY_NAMES.indexOf(todayName);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (todayIdx !== -1) {
    const todays = [...(MAYA_TIMETABLE[todayName] || [])].sort((a, b) => a.period - b.period);
    const upcoming = todays.find((cls) => parseStartMinutes(cls.time) > nowMinutes);
    if (upcoming) return { ...upcoming, day: todayName, isToday: true };
  }

  for (let i = 1; i <= DAY_NAMES.length; i++) {
    const idx = (todayIdx + i + DAY_NAMES.length) % DAY_NAMES.length;
    const dayName = DAY_NAMES[idx];
    const classes = [...(MAYA_TIMETABLE[dayName] || [])].sort((a, b) => a.period - b.period);
    if (classes.length) return { ...classes[0], day: dayName, isToday: false };
  }
  return null;
};

const periodsForDay = (day) => [...(MAYA_TIMETABLE[day] || [])].sort((a, b) => a.period - b.period);

const StudentTimetable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nextClass = useMemo(() => getNextClassInfo(), []);

  const periodNumbers = useMemo(() => {
    const all = new Set();
    DAY_NAMES.forEach((day) => periodsForDay(day).forEach((c) => all.add(c.period)));
    return [...all].sort((a, b) => a - b);
  }, []);

  const classForCell = (day, period) => periodsForDay(day).find((c) => c.period === period);

  const goToRoom = (cls) => {
    if (!cls?.subjectId) return;
    emitStudentEvent({ module: 'timetable', action: 'viewed', subject: cls.subject });
    navigate(`/student/subjects/${cls.subjectId}/room`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Timetable" title={t('studentPanel.timetable.title')} subtitle={t('studentPanel.timetable.subtitle')} />

      <div className="px-6 py-6 space-y-4">
        <FadeIn>
          {nextClass ? (
            <SectionCard hero accent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                    {nextClass.isToday ? t('studentPanel.timetable.nextClassToday') : t('studentPanel.timetable.nextClassUpcoming')}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{nextClass.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {nextClass.day} {nextClass.time} · {t('studentPanel.timetable.room')} {nextClass.room} · {nextClass.teacher}
                  </p>
                </div>
                {nextClass.subjectId ? (
                  <button
                    type="button"
                    onClick={() => goToRoom(nextClass)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium transition-colors"
                  >
                    Open Study Room
                  </button>
                ) : null}
              </div>
            </SectionCard>
          ) : (
            <SectionCard className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.timetable.noUpcoming')}</p>
            </SectionCard>
          )}
        </FadeIn>

        <FadeIn delayMs={60}>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">{t('studentPanel.timetable.columnPeriod')}</th>
                  {DAY_NAMES.map((d) => (
                    <th key={d} className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodNumbers.map((period) => (
                  <tr key={period} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {t('studentPanel.timetable.period')} {period}
                    </td>
                    {DAY_NAMES.map((day) => {
                      const cls = classForCell(day, period);
                      const isNext = nextClass && nextClass.day === day && cls && cls.period === nextClass.period;
                      const color = subjectColor(cls?.subjectId);
                      return (
                        <td key={day} className="px-3 py-3">
                          {cls ? (
                            <button
                              type="button"
                              onClick={() => goToRoom(cls)}
                              disabled={!cls.subjectId}
                              className={`text-left inline-flex flex-col rounded-lg border px-2 py-1 transition-colors ${
                                isNext
                                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-950/30'
                                  : `border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 ${cls.subjectId ? 'hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer' : 'cursor-default'}`
                              }`}
                            >
                              <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-100 font-medium">
                                <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} aria-hidden />
                                {cls.subject}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {cls.time} · {cls.room}
                              </span>
                            </button>
                          ) : (
                            <span className="text-gray-400">{t('studentPanel.common.emDash')}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default StudentTimetable;

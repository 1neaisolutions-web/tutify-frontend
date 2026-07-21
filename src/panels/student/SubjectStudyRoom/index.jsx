import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAYA_SUBJECTS, MAYA_ASSIGNMENTS, getProgressSubject } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { getEffectiveTopicScore } from '../utils/studentEventLog';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const MASTERY_TONE = (pct) => {
  if (pct >= 80) return 'text-emerald-700 dark:text-emerald-300';
  if (pct >= 65) return 'text-amber-700 dark:text-amber-300';
  return 'text-red-700 dark:text-red-300';
};

const SubjectStudyRoom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const subjects = useMemo(() => {
    const classes = readJson(STUDENT_STORAGE_KEYS.CLASSES, null);
    const classIds = Array.isArray(classes?.classIds) ? classes.classIds : null;
    if (classIds && classIds.length) {
      return MAYA_SUBJECTS.filter((s) => classIds.includes(s.id));
    }
    return MAYA_SUBJECTS;
  }, []);

  const cards = useMemo(
    () =>
      subjects.map((s) => {
        const progress = getProgressSubject(s.id);
        const liveMastery = progress
          ? Math.round(
              progress.topics
                .map((topic) => getEffectiveTopicScore(s.id, topic.id, topic.score))
                .filter((v) => v != null)
                .reduce((sum, v, _i, arr) => sum + v / arr.length, 0)
            )
          : null;
        const nextDue = MAYA_ASSIGNMENTS.filter((a) => a.subjectId === s.id && a.status !== 'graded')
          .slice()
          .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];
        const weakTopic = progress?.topics.find((topic) => topic.level === 'weak');
        return { ...s, mastery: liveMastery ?? progress?.masteryPct ?? null, nextDue, weakTopic };
      }),
    [subjects]
  );

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Study Rooms" title={t('studentPanel.studyRoom.title')} subtitle={t('studentPanel.studyRoom.subtitle')} />

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((s, i) => {
          const color = subjectColor(s.id);
          return (
            <FadeIn key={s.id} delayMs={i * 60}>
              <button
                type="button"
                onClick={() => navigate(`/student/subjects/${s.id}/room`)}
                className="text-left w-full relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
              >
                <div className={`absolute top-0 left-0 h-full w-1 ${color.bar}`} aria-hidden />
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</h2>
                  {s.mastery != null ? (
                    <span className={`text-sm font-semibold ${MASTERY_TONE(s.mastery)}`}>{s.mastery}%</span>
                  ) : null}
                </div>
                {s.mastery != null ? (
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${color.bar}`}
                      style={{ width: `${s.mastery}%` }}
                    />
                  </div>
                ) : null}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.studyRoom.cardSubtitle')}</p>
                {s.weakTopic ? (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Weak spot: {s.weakTopic.name} ({s.weakTopic.score}%)</p>
                ) : null}
                {s.nextDue ? (
                  <p className="mt-2 text-xs text-gray-500">
                    Next due: {s.nextDue.title} · {new Date(s.nextDue.dueAt).toLocaleString()}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">No upcoming assignments</p>
                )}
              </button>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectStudyRoom;

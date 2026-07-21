import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { findPackByExamId } from '../NightBeforePack/nightBeforePackStorage';
import { MAYA_EXAMS } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import StatusArc from '../_shared/StatusArc';

const STAGES = ['Prepared', 'Taken', 'Reflected'];

const ExamCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const attempts = readJson(STUDENT_STORAGE_KEYS.EXAM_ATTEMPTS, {});

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Exams" title={t('studentPanel.exam.title')} subtitle={t('studentPanel.exam.subtitle')} />

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {MAYA_EXAMS.map((e, i) => {
          const nightPack = findPackByExamId(e.id);
          const attempt = attempts?.[e.id];
          const prepared = Boolean(readJson(`tutify_student_exam_prepare_${e.id}`, null)?.allDone);
          const reflected = Boolean((() => {
            try {
              return localStorage.getItem(`tutify_student_exam_reflection_${e.id}`);
            } catch {
              return null;
            }
          })());
          const activeIndex = reflected ? 2 : attempt?.submittedAt ? 1 : prepared ? 0 : -1;
          const daysUntil = Math.ceil((new Date(e.startsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return (
            <FadeIn key={e.id} delayMs={i * 60}>
              <SectionCard accent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">{e.title}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {e.subject} • {e.questions.length} questions • {e.durationMin} min
                    </p>
                  </div>
                  {daysUntil >= 0 ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      {daysUntil === 0 ? 'Today' : `In ${daysUntil}d`}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.common.startsAt', { date: new Date(e.startsAt).toLocaleString() })}</p>
                {attempt?.submittedAt ? (
                  <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                    Last attempt: {attempt.score}/{attempt.total} ({Math.round((attempt.score / attempt.total) * 100)}%)
                  </p>
                ) : null}

                <div className="mt-4 max-w-xs">
                  <StatusArc stages={STAGES} activeIndex={activeIndex} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/student/exams/${e.id}/prepare`)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    {t('studentPanel.exam.prepare')}
                  </button>
                  {nightPack ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/student/night-before/${nightPack.id}`)}
                      className="px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                    >
                      {t('studentPanel.exam.nightBefore')}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => navigate(`/student/exam/${e.id}/take`)}
                    className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    {attempt?.submittedAt ? 'Retake' : t('studentPanel.exam.take')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/student/exams/${e.id}/reflect`)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    {t('studentPanel.exam.reflect')}
                  </button>
                </div>
              </SectionCard>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

export default ExamCenter;

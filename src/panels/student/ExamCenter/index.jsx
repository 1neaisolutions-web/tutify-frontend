import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { findPackByExamId } from '../NightBeforePack/nightBeforePackStorage';

const exams = [
  { id: 'ex1', title: 'Midterm Practice Exam (Demo)', startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
];

const ExamCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.exam.title')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.exam.subtitle')}</p>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {exams.map((e) => {
          const nightPack = findPackByExamId(e.id);
          return (
            <div key={e.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{e.title}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.common.startsAt', { date: new Date(e.startsAt).toLocaleString() })}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/student/exams/${e.id}/prepare`)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {t('studentPanel.exam.prepare')}
                </button>
                {nightPack ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/student/night-before/${nightPack.id}`)}
                    className="px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                  >
                    {t('studentPanel.exam.nightBefore')}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => navigate(`/student/exam/${e.id}/take`)}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                >
                  {t('studentPanel.exam.take')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/student/exams/${e.id}/reflect`)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {t('studentPanel.exam.reflect')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamCenter;

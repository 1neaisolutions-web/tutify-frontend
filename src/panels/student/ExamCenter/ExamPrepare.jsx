import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const ExamPrepare = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.exam.preparePage.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.exam.preparePage.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/exams')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >{t('studentPanel.common.back')}</button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.common.prepareHeading', { id })}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">{t('studentPanel.exam.preparePage.checklist.review')}</li>
            <li className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">{t('studentPanel.exam.preparePage.checklist.practice')}</li>
            <li className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">{t('studentPanel.exam.preparePage.checklist.sleep')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamPrepare;


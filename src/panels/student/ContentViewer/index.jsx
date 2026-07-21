import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MAYA_CONTENT } from '../data/mayaChenDemoData';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const ContentViewer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subjects = Object.values(MAYA_CONTENT);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Study Materials" title={t('studentPanel.content.title')} subtitle={t('studentPanel.content.subtitle')} />

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((s, i) => {
          const color = subjectColor(s.id);
          return (
            <FadeIn key={s.id} delayMs={i * 60}>
              <button
                type="button"
                onClick={() => navigate(`/student/content/${s.id}`)}
                className="text-left w-full relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
              >
                <div className={`absolute top-0 left-0 h-full w-1 ${color.bar}`} aria-hidden />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.common.itemsCount', { count: s.worksheets.length })}</p>
              </button>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

export default ContentViewer;

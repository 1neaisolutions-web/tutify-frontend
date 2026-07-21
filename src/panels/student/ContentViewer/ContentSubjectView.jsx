import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MAYA_CONTENT } from '../data/mayaChenDemoData';
import StudentEmptyState from '../_shared/StudentEmptyState';
import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const ContentSubjectView = () => {
  const { t } = useTranslation();
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = MAYA_CONTENT[subjectId];
  const items = useMemo(() => subject?.worksheets || [], [subject]);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Study Materials"
        title={subject ? t('studentPanel.common.materialsSubject', { subjectId: subject.name }) : t('studentPanel.common.materialsSubject', { subjectId })}
        subtitle={t('studentPanel.content.subject.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/content')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-3xl space-y-3">
        {items.length === 0 ? (
          <StudentEmptyState title="No materials yet" subtitle={t('studentPanel.content.subject.empty')} />
        ) : (
          items.map((it, i) => (
            <FadeIn key={it.id} delayMs={i * 50}>
              <button
                type="button"
                onClick={() => navigate(`/student/content/worksheet/${it.id}`)}
                className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{it.title}</p>
                  <span className="shrink-0 inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Class curriculum
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{it.body}</p>
              </button>
            </FadeIn>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentSubjectView;

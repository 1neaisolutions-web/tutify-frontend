import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import StudentEmptyState from '../_shared/StudentEmptyState';
import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const DoubtList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const doubts = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.DOUBTS, []);
    return Array.isArray(list) ? [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)) : [];
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Teachers"
        title={t('studentPanel.teachers.myDoubts')}
        subtitle="Questions you escalated from Doubt Solver — tracked with your teachers."
        right={
          <button
            type="button"
            onClick={() => navigate('/student/teachers')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-4 sm:px-6 py-6 max-w-3xl space-y-3">
        {doubts.length === 0 ? (
          <StudentEmptyState
            title="No escalated doubts yet"
            subtitle="When AI confidence is low, use Ask Teacher Instead in Doubt Solver — your question will show up here."
            ctaLabel="Open Doubt Solver"
            ctaPath="/student/doubt-solver"
          />
        ) : (
          doubts.map((d, i) => (
            <FadeIn key={d.id} delayMs={i * 40}>
              <button
                type="button"
                onClick={() => navigate(`/student/doubts/${d.id}`)}
                className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${d.status === 'open' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} aria-hidden />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{d.title}</p>
                      {d.subject ? (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{d.subject}{d.topic ? ` · ${d.topic}` : ''}</p>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      d.status === 'open'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {d.updatedAt ? new Date(d.updatedAt).toLocaleString() : ''}
                </p>
              </button>
            </FadeIn>
          ))
        )}
      </div>
    </div>
  );
};

export default DoubtList;

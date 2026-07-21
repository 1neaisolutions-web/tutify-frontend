import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchTemplates } from '../../../api/templates';
import { useSnackbar } from '../../../hooks/useSnackbar';
import PageHeader from '../_shared/PageHeader';
import SkeletonBlock from '../_shared/SkeletonBlock';
import FadeIn from '../_shared/FadeIn';

const FALLBACK_TEMPLATES = [
  { id: 'fallback-essay-outline', slug: 'essay-outline', title: 'Essay Outline', description: 'Generate a structured outline from a topic + thesis.', subject: 'English' },
  { id: 'fallback-study-schedule', slug: 'study-schedule', title: 'Study Schedule', description: 'Build a revision schedule for a test.', subject: 'General' },
  { id: 'fallback-lab-report', slug: 'lab-report', title: 'Lab Report', description: 'Create a lab report structure and hypothesis.', subject: 'Science' },
];

const StudentTemplates = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchTemplates({})
      .then((res) => {
        if (!active) return;
        if (res.items?.length) {
          setTemplates(res.items);
          setUsingFallback(false);
        } else {
          setTemplates(FALLBACK_TEMPLATES);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (!active) return;
        setTemplates(FALLBACK_TEMPLATES);
        setUsingFallback(true);
        toast.warning(t('studentPanel.templates.errors.listFailed'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Templates" title={t('studentPanel.templates.title')} subtitle={t('studentPanel.templates.subtitle')}>
        {usingFallback ? (
          <p className="text-xs text-amber-600 dark:text-amber-400">{t('studentPanel.templates.usingFallback')}</p>
        ) : null}
      </PageHeader>

      {loading ? (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} variant="card" />
          ))}
        </div>
      ) : (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tpl, i) => (
            <FadeIn key={tpl.id || tpl.slug} delayMs={i * 60}>
              <button
                type="button"
                onClick={() => navigate(`/student/templates/${tpl.slug}`)}
                className="text-left w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
              >
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{tpl.title}</h2>
                {tpl.subject ? (
                  <span className="mt-1 inline-block rounded-full bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 text-xs text-primary-700 dark:text-primary-300">
                    {tpl.subject}
                  </span>
                ) : null}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tpl.description}</p>
                <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">{t('studentPanel.common.openArrow')}</p>
              </button>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTemplates;

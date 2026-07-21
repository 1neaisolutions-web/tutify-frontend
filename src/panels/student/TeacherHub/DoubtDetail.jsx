import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import StudentEmptyState from '../_shared/StudentEmptyState';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import StatusArc from '../_shared/StatusArc';

const DoubtDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const doubt = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.DOUBTS, []);
    return (Array.isArray(list) ? list : []).find((d) => d.id === id) || null;
  }, [id]);

  if (!doubt) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-4 sm:px-6 py-6">
        <StudentEmptyState
          title="Doubt not found"
          subtitle="This escalation may have been cleared from local storage."
          ctaLabel="Back to escalations"
          ctaPath="/student/doubts"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Teachers"
        title={doubt.title}
        subtitle={`${doubt.subject || 'General'} · ${doubt.status}`}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/doubts')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      >
        <div className="max-w-xs">
          <StatusArc stages={['Escalated', 'Replied']} activeIndex={doubt.status === 'open' ? 0 : 1} />
        </div>
      </PageHeader>

      <div className="px-4 sm:px-6 py-6 max-w-3xl space-y-4">
        <FadeIn>
          <SectionCard className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Your question</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{doubt.question || doubt.title}</p>
          </SectionCard>
        </FadeIn>

        <FadeIn delayMs={60}>
          <SectionCard accent={Boolean(doubt.reply)} className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.teachers.doubtDetail.teacherReply')}</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {doubt.reply ||
                'Waiting for your teacher. You’ll see a reply here as soon as they respond — or message them directly below.'}
            </p>
            {doubt.teacherId ? (
              <button
                type="button"
                onClick={() => navigate(`/student/teachers/${doubt.teacherId}`)}
                className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300 hover:underline"
              >
                Message teacher →
              </button>
            ) : null}
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default DoubtDetail;

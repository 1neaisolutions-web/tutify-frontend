import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sendCopilotMessage } from '../api/aiApi';
import { ASSIGNMENT_STATUS } from '../constants/statusTypes';
import { getMergedAssignmentById } from './assignmentUtils';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import SkeletonBlock from '../_shared/SkeletonBlock';
import FadeIn from '../_shared/FadeIn';
import AiAssistedChip from '../_shared/AiAssistedChip';

const AssignmentDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const assignment = useMemo(() => getMergedAssignmentById(id), [id]);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState('');
  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  const runAi = async () => {
    if (!assignment) return;
    setAiLoading(true);
    setAiText('');
    cleanupRef.current?.();
    cleanupRef.current = null;

    const prompt = `Help me get started on this assignment: "${assignment.title}". Requirements: ${assignment.requirements}`;

    try {
      cleanupRef.current = await sendCopilotMessage(
        prompt,
        'explain',
        (chunk) => setAiText(chunk),
        () => {
          setAiLoading(false);
          cleanupRef.current = null;
        }
      );
    } catch (e) {
      setAiText(t('studentPanel.assignments.detail.aiHelp.failed', { message: e?.message || '' }).trim());
      setAiLoading(false);
      cleanupRef.current = null;
    }
  };

  if (!assignment) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.assignments.notFound')}</p>
      </div>
    );
  }

  const isGraded = assignment.status === ASSIGNMENT_STATUS.GRADED;
  const isSubmitted = assignment.status === ASSIGNMENT_STATUS.SUBMITTED;

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Assignments"
        title={assignment.title}
        subtitle={assignment.subject}
        right={
          <div className="flex gap-2">
            {isGraded ? (
              <button
                type="button"
                onClick={() => navigate(`/student/assignments/${assignment.id}/feedback`)}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                View Feedback
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(`/student/assignments/${assignment.id}/submit`)}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                {isSubmitted ? 'Resubmit' : t('studentPanel.common.submit')}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/student/assignments')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('studentPanel.common.back')}
            </button>
          </div>
        }
      />

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FadeIn>
            <SectionCard accent className="p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.assignments.detail.instructions')}</h2>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{assignment.requirements}</p>
              <p className="mt-3 text-xs text-gray-500">{t('studentPanel.common.due', { date: new Date(assignment.dueAt).toLocaleString() })}</p>
            </SectionCard>
          </FadeIn>

          {assignment.submission?.text ? (
            <FadeIn delayMs={60}>
              <SectionCard className="p-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Your submission</h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{assignment.submission.text}</p>
                <p className="mt-2 text-xs text-gray-500">Submitted {new Date(assignment.submission.submittedAt).toLocaleString()}</p>
              </SectionCard>
            </FadeIn>
          ) : assignment.submittedText ? (
            <FadeIn delayMs={60}>
              <SectionCard className="p-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Your submission</h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{assignment.submittedText}</p>
              </SectionCard>
            </FadeIn>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          <FadeIn delayMs={100}>
            <SectionCard className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.assignments.detail.aiHelp.title')}</h2>
                  {aiText ? <AiAssistedChip /> : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAiOpen((v) => !v);
                    if (!aiOpen) {
                      runAi();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {aiOpen ? t('studentPanel.common.hide') : t('studentPanel.common.open')}
                </button>
              </div>

              {aiOpen ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={runAi}
                      disabled={aiLoading}
                      className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 text-sm transition-colors"
                    >
                      {aiLoading ? t('studentPanel.common.generating') : t('studentPanel.common.regenerate')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cleanupRef.current?.();
                        cleanupRef.current = null;
                        setAiLoading(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {t('studentPanel.common.stop')}
                    </button>
                  </div>

                  {aiLoading && !aiText ? (
                    <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 min-h-[140px]">
                      <SkeletonBlock rows={4} />
                    </div>
                  ) : (
                    <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap min-h-[140px]">
                      {aiText || t('studentPanel.assignments.detail.aiHelp.noOutput')}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.assignments.detail.aiHelp.openHint')}</p>
              )}
            </SectionCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSnackbar } from '../../../hooks/useSnackbar';
import { findAssignmentById } from '../api/teacherToolsBridge';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const AssignmentSubmit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const assignment = findAssignmentById(id);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setSubmitted(true); // optimistic — UI reflects success immediately, rolls back only on failure
    await new Promise((r) => setTimeout(r, 700));

    const submissions = readJson(STUDENT_STORAGE_KEYS.SUBMISSIONS, {});
    submissions[id] = {
      assignmentId: id,
      text: text.trim(),
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    writeJson(STUDENT_STORAGE_KEYS.SUBMISSIONS, submissions);

    emitStudentEvent({
      module: 'assignment_hub',
      action: 'submitted',
      subject: assignment?.subject,
      artifactRef: id,
    });

    setLoading(false);
    toast.success(t('studentPanel.assignments.submit.successAlert'));
    navigate(`/student/assignments/${id}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Assignments"
        title={t('studentPanel.assignments.submit.title')}
        subtitle={assignment?.title || t('studentPanel.assignments.submit.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate(`/student/assignments/${id}`)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-2xl">
        {assignment?.requirements ? (
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
            {assignment.requirements}
          </div>
        ) : null}
        <FadeIn>
          <SectionCard accent className="p-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.assignments.submit.label')}</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={submitted}
                className="mt-1 w-full min-h-[160px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow disabled:opacity-60"
                placeholder={t('studentPanel.assignments.submit.placeholder')}
              />
            </label>
            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.assignments.submit.fileUploadPlaceholder')}</div>

            <button
              type="button"
              onClick={submit}
              disabled={loading || submitted || !text.trim()}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${
                submitted ? 'bg-emerald-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
              }`}
            >
              {submitted ? 'Submitted ✓' : loading ? 'Submitting…' : 'Submit'}
            </button>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default AssignmentSubmit;

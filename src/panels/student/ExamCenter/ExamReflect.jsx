import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { getExamById } from '../data/mayaChenDemoData';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const ExamReflect = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const exam = getExamById(id);
  const storageKey = useMemo(() => `tutify_student_exam_reflection_${id}`, [id]);

  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    try {
      localStorage.setItem(storageKey, text);
    } catch {
      // ignore
    }
    emitStudentEvent({ module: 'exam_center', action: 'saved', subject: exam?.subject, artifactRef: id });
    toast.success(t('studentPanel.exam.reflectPage.successAlert'));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Exams"
        title={t('studentPanel.exam.reflectPage.title')}
        subtitle={t('studentPanel.exam.reflectPage.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/exams')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <FadeIn>
          <SectionCard accent className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.common.reflectionHeading', { id })}</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-3 w-full min-h-[180px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
              placeholder={t('studentPanel.exam.reflectPage.placeholder')}
            />
            <button
              type="button"
              onClick={save}
              className="mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
            >
              {saved ? 'Saved ✓' : t('studentPanel.common.save')}
            </button>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default ExamReflect;

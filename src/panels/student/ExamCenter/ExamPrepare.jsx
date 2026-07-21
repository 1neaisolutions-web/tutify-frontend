import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findPackByExamId } from '../NightBeforePack/nightBeforePackStorage';
import { readJson, writeJson } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import AiAssistedChip from '../_shared/AiAssistedChip';

const CHECKLIST_KEYS = ['review', 'practice', 'sleep'];

const ExamPrepare = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const nightPack = findPackByExamId(id);
  const storageKey = useMemo(() => `tutify_student_exam_prepare_${id}`, [id]);

  const [checked, setChecked] = useState(() => readJson(storageKey, {}));

  const toggle = (key) => {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    const allDone = CHECKLIST_KEYS.every((k) => next[k]);
    writeJson(storageKey, { ...next, allDone });
    if (allDone) {
      emitStudentEvent({ module: 'exam_center', action: 'completed', artifactRef: id, outcome: { correct: true } });
    }
  };

  const doneCount = CHECKLIST_KEYS.filter((k) => checked[k]).length;

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Exams"
        title={t('studentPanel.exam.preparePage.title')}
        subtitle={t('studentPanel.exam.preparePage.subtitle')}
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
          {nightPack ? (
            <SectionCard hero accent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-primary-800 dark:text-primary-200">{t('studentPanel.exam.preparePage.packReady')}</p>
                <AiAssistedChip label="AI-generated" />
              </div>
              <button
                type="button"
                onClick={() => navigate(`/student/night-before/${nightPack.id}`)}
                className="mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
              >
                {t('studentPanel.exam.preparePage.openPack')}
              </button>
            </SectionCard>
          ) : (
            <SectionCard className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.nightBefore.empty.subtitle')}</p>
              <button
                type="button"
                onClick={() => navigate('/student/night-before')}
                className="mt-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {t('studentPanel.exam.nightBefore')}
              </button>
            </SectionCard>
          )}
        </FadeIn>

        <FadeIn delayMs={60}>
          <SectionCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.common.prepareHeading', { id })}</h2>
              <span className="text-xs font-medium text-gray-500">{doneCount}/{CHECKLIST_KEYS.length} done</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${(doneCount / CHECKLIST_KEYS.length) * 100}%` }}
              />
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {CHECKLIST_KEYS.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className={`w-full flex items-center gap-3 text-left rounded-lg px-3 py-2 transition-colors ${
                      checked[key] ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center text-xs ${
                        checked[key] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {checked[key] ? '✓' : ''}
                    </span>
                    <span className={checked[key] ? 'line-through text-gray-500 dark:text-gray-400' : ''}>
                      {t(`studentPanel.exam.preparePage.checklist.${key}`)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default ExamPrepare;

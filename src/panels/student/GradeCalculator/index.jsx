import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MAYA_GRADEBOOK } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import MasteryRing from '../_shared/MasteryRing';

const CLASS_IDS = Object.keys(MAYA_GRADEBOOK);

const readPersistedState = () => readJson(STUDENT_STORAGE_KEYS.GRADE_CALCULATOR, {});

const persistState = (classId, patch) => {
  const all = readPersistedState();
  writeJson(STUDENT_STORAGE_KEYS.GRADE_CALCULATOR, { ...all, [classId]: { ...all[classId], ...patch } });
};

const pickTargetCategoryId = (categories) => {
  const examCat = categories.find((c) => c.id === 'exam');
  return examCat ? examCat.id : categories[categories.length - 1]?.id;
};

const GradeCalculator = () => {
  const { t } = useTranslation();
  const [classId, setClassId] = useState(CLASS_IDS[0]);
  const isFirstRun = useRef(true);

  const buildInitialState = (id) => {
    const base = MAYA_GRADEBOOK[id];
    const persisted = readPersistedState()[id];
    const categories = (persisted?.categories || base.categories).map((c) => ({ ...c }));
    const targetId = pickTargetCategoryId(categories);
    return {
      categories,
      targetGrade: persisted?.targetGrade ?? base.targetGrade,
      examScore: persisted?.examScore ?? categories.find((c) => c.id === targetId)?.currentAvg ?? 75,
    };
  };

  const [categories, setCategories] = useState(() => buildInitialState(CLASS_IDS[0]).categories);
  const [targetGrade, setTargetGrade] = useState(() => buildInitialState(CLASS_IDS[0]).targetGrade);
  const [examScore, setExamScore] = useState(() => buildInitialState(CLASS_IDS[0]).examScore);

  useEffect(() => {
    const initial = buildInitialState(classId);
    setCategories(initial.categories);
    setTargetGrade(initial.targetGrade);
    setExamScore(initial.examScore);
    emitStudentEvent({ module: 'grade_calculator', action: 'viewed', subject: MAYA_GRADEBOOK[classId].name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  // Persist + log on meaningful changes, debounced so dragging the what-if slider doesn't
  // spam the event log, and skipping the initial mount (already logged as "viewed" above).
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timer = setTimeout(() => {
      persistState(classId, { categories, targetGrade, examScore });
      const targetId = pickTargetCategoryId(categories);
      const targetCat = categories.find((c) => c.id === targetId);
      const othersSum = categories
        .filter((c) => c.id !== targetId)
        .reduce((sum, c) => sum + Number(c.weight) * Number(c.currentAvg || 0), 0);
      const needed = targetCat?.weight ? (Number(targetGrade) - othersSum) / Number(targetCat.weight) : null;
      emitStudentEvent({
        module: 'grade_calculator',
        action: 'saved',
        subject: MAYA_GRADEBOOK[classId].name,
        outcome: { score: needed == null || Number.isNaN(needed) ? undefined : Math.round(needed) },
      });
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, targetGrade, examScore]);

  const targetCategoryId = useMemo(() => pickTargetCategoryId(categories), [categories]);

  const updateCategory = (id, patch) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const totalWeight = useMemo(() => categories.reduce((sum, c) => sum + Number(c.weight || 0), 0), [categories]);

  const currentOverall = useMemo(() => {
    if (!totalWeight) return null;
    const total = categories.reduce((sum, c) => {
      const score = c.id === targetCategoryId ? Number(examScore) : Number(c.currentAvg);
      return sum + Number(c.weight) * (Number.isNaN(score) ? 0 : score);
    }, 0);
    return total / totalWeight;
  }, [categories, examScore, targetCategoryId, totalWeight]);

  const neededExamScore = useMemo(() => {
    const targetCat = categories.find((c) => c.id === targetCategoryId);
    if (!targetCat || !Number(targetCat.weight)) return null;
    const othersSum = categories
      .filter((c) => c.id !== targetCategoryId)
      .reduce((sum, c) => sum + Number(c.weight) * Number(c.currentAvg || 0), 0);
    return (Number(targetGrade) - othersSum) / Number(targetCat.weight);
  }, [categories, targetGrade, targetCategoryId]);

  const status = useMemo(() => {
    if (neededExamScore == null || Number.isNaN(neededExamScore)) return null;
    if (neededExamScore <= 0) return { label: t('studentPanel.gradeCalculator.result.status.secured'), tone: 'green' };
    if (neededExamScore <= 100) return { label: t('studentPanel.gradeCalculator.result.status.possible'), tone: 'blue' };
    return { label: t('studentPanel.gradeCalculator.result.status.unlikely'), tone: 'red' };
  }, [neededExamScore, t]);

  const badgeCls =
    status?.tone === 'green'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
      : status?.tone === 'blue'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200';

  const targetCategory = categories.find((c) => c.id === targetCategoryId);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Grade Calculator" title={t('studentPanel.gradeCalculator.title')} subtitle={t('studentPanel.gradeCalculator.subtitle')} />

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <FadeIn>
          <SectionCard accent className="p-4 space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.gradeCalculator.fields.class')}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {CLASS_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setClassId(id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      id === classId
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    {MAYA_GRADEBOOK[id].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.gradeCalculator.fields.categories')}</p>
              {categories.map((c) => (
                <div key={c.id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-sm text-gray-800 dark:text-gray-100">{c.name}</span>
                    <span className="text-xs text-gray-500 w-14 text-right">{Math.round(c.weight * 100)}%</span>
                    {c.id === targetCategoryId ? (
                      <span className="w-24 text-right text-sm font-medium text-primary-700 dark:text-primary-300">
                        {t('studentPanel.gradeCalculator.whatIfLabel')}
                      </span>
                    ) : (
                      <input
                        type="number"
                        value={c.currentAvg}
                        onChange={(e) => updateCategory(c.id, { currentAvg: Number(e.target.value) })}
                        className="w-24 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1 text-sm text-right text-gray-900 dark:text-gray-100"
                      />
                    )}
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-400 transition-all duration-500 ease-out"
                      style={{ width: `${c.id === targetCategoryId ? examScore : c.currentAvg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {targetCategory ? (
              <div className="rounded-lg border border-primary-100 dark:border-primary-900 bg-primary-50/60 dark:bg-primary-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {t('studentPanel.gradeCalculator.whatIfSlider', { category: targetCategory.name })}
                  </span>
                  <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">{Math.round(examScore)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={examScore}
                  onChange={(e) => setExamScore(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('studentPanel.gradeCalculator.projectedOverall')}:{' '}
                  <span className="font-semibold">{currentOverall == null ? '—' : `${Math.round(currentOverall)}%`}</span>
                </p>
              </div>
            ) : null}

            <label className="block max-w-xs">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.gradeCalculator.fields.targetGrade')}</span>
              <input
                type="number"
                value={targetGrade}
                onChange={(e) => setTargetGrade(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              />
            </label>
          </SectionCard>
        </FadeIn>

        <FadeIn delayMs={60}>
          <SectionCard hero accent className="p-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <MasteryRing value={currentOverall} label="Projected" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.gradeCalculator.result.title')}</h2>
                  {status ? <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeCls}`}>{status.label}</span> : null}
                </div>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                  {t('studentPanel.gradeCalculator.result.neededOn', { category: targetCategory?.name || t('studentPanel.gradeCalculator.result.final') })}:{' '}
                  <span className="font-semibold">{neededExamScore == null ? '—' : `${Math.round(neededExamScore)}%`}</span>
                </p>
                <p className="mt-2 text-xs text-gray-500">{t('studentPanel.gradeCalculator.result.formulaHint')}</p>
              </div>
            </div>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default GradeCalculator;

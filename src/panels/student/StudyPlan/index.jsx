import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import { generateStudyPlan } from './studyPlanEngine';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import MasteryRing from '../_shared/MasteryRing';

const SUBJECT_CHART_COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#64748b'];

const StudyPlan = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [openBlock, setOpenBlock] = useState(null);
  const [plan, setPlan] = useState(() => {
    const stored = readJson(STUDENT_STORAGE_KEYS.STUDY_PLAN, null);
    if (Array.isArray(stored) && stored.length) return stored;
    const generated = generateStudyPlan();
    writeJson(STUDENT_STORAGE_KEYS.STUDY_PLAN, generated);
    return generated;
  });

  const flatCount = useMemo(() => plan.reduce((acc, d) => acc + (d.blocks?.length || 0), 0), [plan]);
  const doneCount = useMemo(() => plan.reduce((acc, d) => acc + (d.blocks || []).filter((b) => b.done).length, 0), [plan]);
  const adherencePct = flatCount ? Math.round((doneCount / flatCount) * 100) : 0;

  const subjectMinutes = useMemo(() => {
    const totals = new Map();
    plan.forEach((d) => (d.blocks || []).forEach((b) => totals.set(b.subject, (totals.get(b.subject) || 0) + (b.minutes || 0))));
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }, [plan]);

  const persistPlan = (next) => {
    setPlan(next);
    writeJson(STUDENT_STORAGE_KEYS.STUDY_PLAN, next);
  };

  const toggleDone = (dayIdx, blockId) => {
    const next = plan.map((d, i) =>
      i !== dayIdx ? d : { ...d, blocks: d.blocks.map((b) => (b.id === blockId ? { ...b, done: !b.done } : b)) }
    );
    persistPlan(next);
    const block = next[dayIdx].blocks.find((b) => b.id === blockId);
    emitStudentEvent({ module: 'study_plan', action: 'completed', subject: block?.subject, outcome: { correct: block?.done } });
  };

  const regenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const next = generateStudyPlan();
    persistPlan(next);
    emitStudentEvent({ module: 'study_plan', action: 'regenerated', outcome: { blocks: next.reduce((a, d) => a + d.blocks.length, 0) } });
    setLoading(false);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Study Plan"
        title={t('studentPanel.studyPlan.title')}
        subtitle={t('studentPanel.common.blocksThisWeek', { count: flatCount })}
        right={
          <div className="flex items-center gap-4">
            <MasteryRing value={adherencePct} size={64} strokeWidth={6} label="Adherence" />
            <button
              type="button"
              onClick={regenerate}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? t('studentPanel.common.regenerating') : t('studentPanel.studyPlan.regenerate')}
            </button>
          </div>
        }
      />

      <div className="px-6 py-6 space-y-6">
        {subjectMinutes.length ? (
          <FadeIn>
            <SectionCard className="p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">This week's time split</h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Chart
                  options={{
                    labels: subjectMinutes.map(([name]) => name),
                    colors: SUBJECT_CHART_COLORS,
                    legend: { show: false },
                    dataLabels: { enabled: false },
                    tooltip: { y: { formatter: (v) => `${v} min` } },
                    plotOptions: { pie: { donut: { size: '72%' } } },
                  }}
                  series={subjectMinutes.map(([, minutes]) => minutes)}
                  type="donut"
                  width={160}
                  height={160}
                />
                <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                  {subjectMinutes.map(([name, minutes], i) => (
                    <div key={name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: SUBJECT_CHART_COLORS[i % SUBJECT_CHART_COLORS.length] }} />
                      <span className="text-gray-700 dark:text-gray-200 truncate">{name}</span>
                      <span className="ml-auto text-gray-500 text-xs">{minutes}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </FadeIn>
        ) : null}

        <div>
          <p className="mb-3 text-xs text-gray-500">Tap a block to see why it's scheduled — check it off once you've done it.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.map((d, dayIdx) => (
              <FadeIn key={d.day} delayMs={dayIdx * 40}>
                <SectionCard className="p-4 h-full">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{d.day}</h2>
                  <ul className="mt-3 space-y-2">
                    {(d.blocks || []).map((b) => {
                      const isOpen = openBlock === b.id;
                      const color = subjectColor(
                        b.subject === 'Algebra II' ? 'algebra-ii' : b.subject === 'Biology' ? 'biology' : b.subject === 'English II' ? 'english-ii' : b.subject === 'World History' ? 'world-history' : null
                      );
                      return (
                        <li key={b.id}>
                          <div
                            className={`flex items-start gap-2 rounded-lg px-3 py-2 transition-colors ${
                              b.done ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-gray-50 dark:bg-gray-900/40'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleDone(dayIdx, b.id)}
                              aria-label={b.done ? 'Mark not done' : 'Mark done'}
                              className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                b.done
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-gray-300 dark:border-gray-700'
                              }`}
                            >
                              {b.done ? '✓' : null}
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpenBlock(isOpen ? null : b.id)}
                              className={`flex-1 text-left text-sm ${b.done ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                              {b.label}
                            </button>
                            <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${color.dot}`} aria-hidden />
                          </div>
                          {isOpen ? (
                            <FadeIn>
                              <p className="mt-1 rounded-lg border border-primary-100 dark:border-primary-900 bg-primary-50 dark:bg-primary-950/30 px-3 py-2 text-xs text-primary-800 dark:text-primary-200">
                                <span className="font-medium">Why this block: </span>
                                {b.why || "Part of this week's balanced study rotation."}
                              </p>
                            </FadeIn>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </SectionCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;

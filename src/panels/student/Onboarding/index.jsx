import { useTranslation } from 'react-i18next';
import { GradeSelect } from '@/components/shared/GradeSelect';
import { gradeValueForSelect } from '@/catalog/adapters/gradeAdapters';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAYA_SUBJECTS } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import FadeIn from '../_shared/FadeIn';
import SectionCard from '../_shared/SectionCard';

const GOAL_OPTIONS = [
  'Raise my Algebra II grade to a B',
  'Prep for midterms',
  'Build a weekly study habit',
  'Improve Biology lab write-ups',
];

const STEP_LABELS = ['Profile', 'Classes', 'Goals', 'Ready'];

const Stepper = ({ stepIndex, total }) => (
  <div className="flex items-center gap-2 mb-6" aria-label={`Step ${stepIndex + 1} of ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex-1 flex items-center gap-2">
        <div
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i <= stepIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-800'
          }`}
        />
        {i < total - 1 ? null : null}
      </div>
    ))}
  </div>
);

const StepShell = ({ title, subtitle, children, onBack, onNext, nextLabel, disableNext, stepIndex = 0 }) => {
  const { t } = useTranslation();
  const resolvedNextLabel = nextLabel ?? t('studentPanel.common.next');
  return (
    <div className="w-full min-h-0 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Stepper stepIndex={stepIndex} total={STEP_LABELS.length} />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
          Step {stepIndex + 1} of {STEP_LABELS.length} · {STEP_LABELS[stepIndex]}
        </p>

        <FadeIn key={stepIndex}>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p> : null}
          </div>

          <SectionCard accent className="p-5">
            {children}
          </SectionCard>
        </FadeIn>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
          <button
            type="button"
            disabled={disableNext}
            onClick={onNext}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resolvedNextLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Builds a first Study Plan week seeded from selected classes + weak Logarithms if Algebra II is selected. */
function buildFirstStudyPlanWeek(classIds) {
  const selected = MAYA_SUBJECTS.filter((s) => classIds.includes(s.id));
  const names = selected.map((s) => s.shortName);
  const hasAlgebra = classIds.includes('algebra-ii');

  const blockFor = (subjectName, label, minutes) => ({
    id: `blk_${subjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    subject: subjectName,
    label: `${subjectName}: ${label} (${minutes}m)`,
    minutes,
    why: `Because you selected ${subjectName} during onboarding.`,
  });

  const week = [
    { day: 'Mon', blocks: [] },
    { day: 'Tue', blocks: [] },
    { day: 'Wed', blocks: [] },
    { day: 'Thu', blocks: [] },
    { day: 'Fri', blocks: [] },
    { day: 'Sat', blocks: [] },
    { day: 'Sun', blocks: [] },
  ];

  if (hasAlgebra) {
    week[0].blocks.push({
      ...blockFor('Algebra II', 'Logarithms weak-spot drill', 25),
      why: 'Logarithms is your weakest Algebra II topic (52% mastery) — prioritized first.',
    });
    week[2].blocks.push({
      ...blockFor('Algebra II', 'Logarithms fix-it quiz', 15),
      why: 'A short fix-it quiz locks in what you practiced Monday.',
    });
  }

  names
    .filter((n) => n !== 'Algebra II')
    .forEach((name, idx) => {
      const day = week[(idx + (hasAlgebra ? 1 : 0)) % 7];
      day.blocks.push(blockFor(name, 'Review + practice set', 20));
    });

  week[5].blocks.push({
    id: 'blk_deep_study',
    subject: names[0] || 'Study',
    label: `Deep study: ${hasAlgebra ? 'Logarithms' : 'weakest topic'} (45m)`,
    minutes: 45,
    why: 'Saturday is reserved for your longest focused session on the topic dragging your grade down most.',
  });
  week[6].blocks.push({
    id: 'blk_plan_next',
    subject: 'Planning',
    label: 'Plan next week + light review (20m)',
    minutes: 20,
    why: 'A short Sunday review keeps momentum without burnout.',
  });

  return week;
}

const StudentOnboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const initialProfile = useMemo(
    () => readJson(STUDENT_STORAGE_KEYS.PROFILE, { name: '', gradeLevel: '', timezone: '' }),
    []
  );
  const initialClasses = useMemo(() => readJson(STUDENT_STORAGE_KEYS.CLASSES, { classIds: [] }), []);
  const initialGoals = useMemo(() => readJson(STUDENT_STORAGE_KEYS.GOALS, { selected: [] }), []);

  const [profile, setProfile] = useState(initialProfile);
  const [classIds, setClassIds] = useState(
    Array.isArray(initialClasses?.classIds) ? initialClasses.classIds : []
  );
  const [selectedGoals, setSelectedGoals] = useState(
    Array.isArray(initialGoals?.selected) ? initialGoals.selected : []
  );

  const toggleClass = (id) => {
    setClassIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const previewWeek = useMemo(() => buildFirstStudyPlanWeek(classIds), [classIds]);

  const steps = useMemo(
    () => [
      {
        title: t('studentPanel.onboarding.welcome.title'),
        subtitle: t('studentPanel.onboarding.welcome.subtitle'),
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.name')}</span>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder={t('studentPanel.onboarding.placeholders.name')}
              />
            </label>
            <div className="block">
              <GradeSelect
                variant="native"
                value={gradeValueForSelect(profile.gradeLevel)}
                onChange={(v) => setProfile((p) => ({ ...p, gradeLevel: v }))}
                label={t('studentPanel.onboarding.fields.gradeLevel')}
              />
            </div>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.timezone')}</span>
              <input
                value={profile.timezone}
                onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder={t('studentPanel.onboarding.placeholders.timezone')}
              />
            </label>
          </div>
        ),
        canNext: () => Boolean(profile.name.trim()),
        onNext: () => writeJson(STUDENT_STORAGE_KEYS.PROFILE, profile),
      },
      {
        title: t('studentPanel.onboarding.classes.title'),
        subtitle: 'Pick the classes you want Tutify to track for you.',
        content: (
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.classes')}</span>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MAYA_SUBJECTS.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    classIds.includes(s.id)
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/30 dark:border-primary-800 text-primary-800 dark:text-primary-200'
                      : 'border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={classIds.includes(s.id)}
                    onChange={() => toggleClass(s.id)}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                  <span className="font-medium">{s.name}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">{t('studentPanel.onboarding.classes.hint')}</p>
          </div>
        ),
        canNext: () => classIds.length > 0,
        onNext: () => writeJson(STUDENT_STORAGE_KEYS.CLASSES, { classIds }),
      },
      {
        title: t('studentPanel.onboarding.goals.title'),
        subtitle: t('studentPanel.onboarding.goals.subtitle'),
        content: (
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.goals')}</span>
            <div className="mt-2 space-y-2">
              {GOAL_OPTIONS.map((goal) => (
                <label
                  key={goal}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    selectedGoals.includes(goal)
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/30 dark:border-primary-800 text-primary-800 dark:text-primary-200'
                      : 'border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal)}
                    onChange={() => toggleGoal(goal)}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>
        ),
        canNext: () => selectedGoals.length > 0,
        onNext: () => writeJson(STUDENT_STORAGE_KEYS.GOALS, { selected: selectedGoals }),
      },
      {
        title: t('studentPanel.onboarding.tour.title'),
        subtitle: t('studentPanel.onboarding.tour.subtitle'),
        content: (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
            <p>{t('studentPanel.onboarding.tour.modeHint')}</p>
            <p>{t('studentPanel.onboarding.tour.tip')}</p>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Your first Study Plan week — built from what you just told us
              </p>
              <div className="space-y-1.5">
                {previewWeek
                  .filter((day) => day.blocks.length > 0)
                  .slice(0, 3)
                  .map((day) => (
                    <div key={day.day} className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-9 pt-0.5">{day.day}</span>
                      <div className="flex-1 min-w-0">
                        {day.blocks.map((b) => (
                          <div key={b.id} className="text-sm text-gray-800 dark:text-gray-100">
                            {b.label}
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{b.why}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 px-4 py-3">
              <p className="font-medium text-primary-800 dark:text-primary-200">{t('studentPanel.onboarding.tour.ready')}</p>
              <p className="text-primary-700 dark:text-primary-300">
                The full week is waiting in Study Plan — you&apos;ll land on your AI Copilot right after this, already knowing what&apos;s due.
              </p>
            </div>
          </div>
        ),
        canNext: () => true,
        onNext: () => {
          const week = buildFirstStudyPlanWeek(classIds);
          writeJson(STUDENT_STORAGE_KEYS.STUDY_PLAN, week);
          writeJson(STUDENT_STORAGE_KEYS.ONBOARDING_COMPLETED, true);
          emitStudentEvent({
            module: 'onboarding',
            action: 'completed',
            outcome: { classIds, goals: selectedGoals },
          });
        },
      },
    ],
    [t, profile, classIds, selectedGoals, previewWeek]
  );

  const current = steps[step];

  const handleBack = () => {
    if (step === 0) {
      navigate('/student/dashboard');
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    current.onNext?.();
    if (step === steps.length - 1) {
      navigate('/student/dashboard');
      return;
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  return (
    <StepShell
      title={current.title}
      subtitle={current.subtitle}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel={step === steps.length - 1 ? t('studentPanel.common.finish') : t('studentPanel.common.next')}
      disableNext={!current.canNext()}
      stepIndex={step}
    >
      {current.content}
    </StepShell>
  );
};

export default StudentOnboarding;

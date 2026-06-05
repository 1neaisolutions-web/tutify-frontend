import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'tutify_student_onboarding_completed';
const PROFILE_KEY = 'tutify_student_profile';
const CLASSES_KEY = 'tutify_student_classes';
const GOALS_KEY = 'tutify_student_goals';

const StepShell = ({ title, subtitle, children, onBack, onNext, nextLabel, disableNext }) => {
  const { t } = useTranslation();
  const resolvedNextLabel = nextLabel ?? t('studentPanel.common.next');
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p> : null}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
          {children}
        </div>

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
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resolvedNextLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentOnboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const initialProfile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || { name: '', gradeLevel: '', timezone: '' };
    } catch {
      return { name: '', gradeLevel: '', timezone: '' };
    }
  }, []);

  const initialClasses = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(CLASSES_KEY) || 'null') || { classes: '' };
    } catch {
      return { classes: '' };
    }
  }, []);

  const initialGoals = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(GOALS_KEY) || 'null') || { goals: '' };
    } catch {
      return { goals: '' };
    }
  }, []);

  const [profile, setProfile] = useState(initialProfile);
  const [classes, setClasses] = useState(initialClasses);
  const [goals, setGoals] = useState(initialGoals);

  const steps = useMemo(() => [
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
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.gradeLevel')}</span>
            <input
              value={profile.gradeLevel}
              onChange={(e) => setProfile((p) => ({ ...p, gradeLevel: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder={t('studentPanel.onboarding.placeholders.grade')}
            />
          </label>
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
      onNext: () => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
    },
    {
      title: t('studentPanel.onboarding.classes.title'),
      subtitle: t('studentPanel.onboarding.classes.subtitle'),
      content: (
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.classes')}</span>
          <textarea
            value={classes.classes}
            onChange={(e) => setClasses({ classes: e.target.value })}
            className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('studentPanel.onboarding.placeholders.classes')}
          />
          <p className="mt-2 text-xs text-gray-500">{t('studentPanel.onboarding.classes.hint')}</p>
        </label>
      ),
      canNext: () => true,
      onNext: () => localStorage.setItem(CLASSES_KEY, JSON.stringify(classes)),
    },
    {
      title: t('studentPanel.onboarding.goals.title'),
      subtitle: t('studentPanel.onboarding.goals.subtitle'),
      content: (
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.onboarding.fields.goals')}</span>
          <textarea
            value={goals.goals}
            onChange={(e) => setGoals({ goals: e.target.value })}
            className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('studentPanel.onboarding.placeholders.goals')}
          />
        </label>
      ),
      canNext: () => true,
      onNext: () => localStorage.setItem(GOALS_KEY, JSON.stringify(goals)),
    },
    {
      title: t('studentPanel.onboarding.tour.title'),
      subtitle: t('studentPanel.onboarding.tour.subtitle'),
      content: (
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <p>{t('studentPanel.onboarding.tour.modeHint')}</p>
          <p>{t('studentPanel.onboarding.tour.tip')}</p>
          <div className="rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 px-4 py-3">
            <p className="font-medium text-primary-800 dark:text-primary-200">{t('studentPanel.onboarding.tour.ready')}</p>
            <p className="text-primary-700 dark:text-primary-300">{t('studentPanel.onboarding.tour.finishHint')}</p>
          </div>
        </div>
      ),
      canNext: () => true,
      onNext: () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
      },
    },
  ], [t, profile, classes, goals]);

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
    >
      {current.content}
    </StepShell>
  );
};

export default StudentOnboarding;


import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'tutify_student_onboarding_completed';
const PROFILE_KEY = 'tutify_student_profile';
const CLASSES_KEY = 'tutify_student_classes';
const GOALS_KEY = 'tutify_student_goals';

const StepShell = ({ title, subtitle, children, onBack, onNext, nextLabel = 'Next', disableNext }) => {
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
            Back
          </button>
          <button
            type="button"
            disabled={disableNext}
            onClick={onNext}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentOnboarding = () => {
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

  const steps = [
    {
      title: 'Welcome to Tutify',
      subtitle: 'Let’s set up your profile so your AI copilot can help you better.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</span>
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Alex"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Grade / Level</span>
            <input
              value={profile.gradeLevel}
              onChange={(e) => setProfile((p) => ({ ...p, gradeLevel: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Grade 10"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Timezone</span>
            <input
              value={profile.timezone}
              onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="America/New_York"
            />
          </label>
        </div>
      ),
      canNext: () => Boolean(profile.name.trim()),
      onNext: () => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
    },
    {
      title: 'Your classes (optional)',
      subtitle: 'If you’re teacher-linked, this will match your enrolled subjects. If not, just list what you’re studying.',
      content: (
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Classes</span>
          <textarea
            value={classes.classes}
            onChange={(e) => setClasses({ classes: e.target.value })}
            className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder="Math, Biology, English..."
          />
          <p className="mt-2 text-xs text-gray-500">You can change this later.</p>
        </label>
      ),
      canNext: () => true,
      onNext: () => localStorage.setItem(CLASSES_KEY, JSON.stringify(classes)),
    },
    {
      title: 'Your goals',
      subtitle: 'Tell Tutify what you’re aiming for. This powers Study Plan and task suggestions.',
      content: (
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Goals</span>
          <textarea
            value={goals.goals}
            onChange={(e) => setGoals({ goals: e.target.value })}
            className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder="Improve algebra skills, prepare for next week's exam..."
          />
        </label>
      ),
      canNext: () => true,
      onNext: () => localStorage.setItem(GOALS_KEY, JSON.stringify(goals)),
    },
    {
      title: 'Quick AI tour',
      subtitle: 'Your AI Copilot is the default home. Try asking a question anytime.',
      content: (
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <p>On your dashboard, you can switch modes: Q&A, Explain, Summarise, Practice.</p>
          <p>Tip: Paste notes and ask for a summary, then generate practice questions.</p>
          <div className="rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 px-4 py-3">
            <p className="font-medium text-primary-800 dark:text-primary-200">You’re ready.</p>
            <p className="text-primary-700 dark:text-primary-300">Click “Finish” to go to AI Copilot.</p>
          </div>
        </div>
      ),
      canNext: () => true,
      onNext: () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
      },
    },
  ];

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
      nextLabel={step === steps.length - 1 ? 'Finish' : 'Next'}
      disableNext={!current.canNext()}
    >
      {current.content}
    </StepShell>
  );
};

export default StudentOnboarding;


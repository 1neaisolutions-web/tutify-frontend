import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calculator, FlaskConical, PenLine } from 'lucide-react';

import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const tutors = [
  {
    id: 'math-mentor',
    name: 'Math Mentor',
    tagline: 'Socratic, worked examples, no shortcuts.',
    starter: 'Walk me through factoring x² + 5x + 6',
    icon: Calculator,
    accent: 'bg-blue-500',
    ring: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 'lab-partner',
    name: 'Lab Partner',
    tagline: 'Think out loud through experiments, data, and concepts.',
    starter: 'Explain how mitosis differs from meiosis',
    icon: FlaskConical,
    accent: 'bg-emerald-500',
    ring: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'essay-coach',
    name: 'Essay Coach',
    tagline: 'Structure, clarity, and stronger arguments.',
    starter: 'Help me structure a persuasive essay outline',
    icon: PenLine,
    accent: 'bg-purple-500',
    ring: 'border-purple-200 dark:border-purple-800',
  },
];

const AITutors = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="AI Tutors" title={t('studentPanel.tutors.title')} subtitle={t('studentPanel.tutors.subtitle')} />

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tutors.map((tutor, i) => {
          const Icon = tutor.icon;
          return (
            <FadeIn key={tutor.id} delayMs={i * 80}>
              <button
                type="button"
                onClick={() => navigate(`/student/tutors/${tutor.id}`)}
                className={`text-left w-full rounded-xl border bg-white dark:bg-gray-950 hover:shadow-sm transition-all p-4 ${tutor.ring} hover:border-opacity-80`}
              >
                <div className={`h-11 w-11 rounded-full ${tutor.accent} flex items-center justify-center text-white`}>
                  <Icon size={20} />
                </div>
                <h2 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{tutor.name}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{tutor.tagline}</p>
                <p className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">"{tutor.starter}"</p>
                <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">{t('studentPanel.common.chat')}</p>
              </button>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

export default AITutors;

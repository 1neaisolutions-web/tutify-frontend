import { useNavigate } from 'react-router-dom';

const tutors = [
  { id: 'math-mentor', name: 'Math Mentor', tagline: 'Worked examples, step-by-step, no shortcuts.' },
  { id: 'science-guide', name: 'Science Guide', tagline: 'Explain concepts clearly with diagrams and analogies.' },
  { id: 'essay-coach', name: 'Essay Coach', tagline: 'Structure, clarity, and stronger arguments.' },
];

const AITutors = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Tutors</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Pick a tutor for a domain-specific style.</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tutors.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => navigate(`/student/tutors/${t.id}`)}
            className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t.tagline}</p>
            <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">Chat →</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AITutors;


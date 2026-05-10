import { useNavigate } from 'react-router-dom';

const templates = [
  { id: 'essay-outline', title: 'Essay Outline', description: 'Generate a structured outline from a topic + thesis.' },
  { id: 'study-schedule', title: 'Study Schedule', description: 'Build a 7-day revision schedule for a test.' },
  { id: 'lab-report', title: 'Lab Report', description: 'Create a lab report structure and hypothesis.' },
  { id: 'book-review', title: 'Book Review', description: 'Write a balanced review with key themes and quotes.' },
  { id: 'flashcards', title: 'Flashcard Set', description: 'Generate flashcards from a topic or notes.' },
];

const StudentTemplates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Templates</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Fast AI starters for common student tasks.</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => navigate(`/student/templates/${t.id}`)}
            className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t.title}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t.description}</p>
            <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">Open →</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentTemplates;


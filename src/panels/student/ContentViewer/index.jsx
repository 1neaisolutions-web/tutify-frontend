import { useNavigate } from 'react-router-dom';

const subjects = [
  { id: 'math', name: 'Math', items: 3 },
  { id: 'biology', name: 'Biology', items: 2 },
  { id: 'english', name: 'English', items: 2 },
];

const ContentViewer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Study Materials</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Teacher resources + worksheet viewer (demo).</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => navigate(`/student/content/${s.id}`)}
            className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{s.items} items</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentViewer;


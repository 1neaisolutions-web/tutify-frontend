import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const SubjectStudyRoom = () => {
  const navigate = useNavigate();
  const subjects = useMemo(() => {
    try {
      const raw = localStorage.getItem('tutify_student_classes');
      const parsed = raw ? JSON.parse(raw) : null;
      const list = String(parsed?.classes || 'Math, Science, English, History')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return list.length ? list : ['Math', 'Science', 'English', 'History'];
    } catch {
      return ['Math', 'Science', 'English', 'History'];
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Study Rooms</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">A workspace per subject (scoped Phase 1 demo).</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => navigate(`/student/subjects/${encodeURIComponent(s)}/room`)}
            className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{s}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Resources • notes • quick practice</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectStudyRoom;


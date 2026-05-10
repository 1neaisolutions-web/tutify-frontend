import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ExamReflect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const storageKey = useMemo(() => `tutify_student_exam_reflection_${id}`, [id]);

  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  });

  const save = () => {
    try {
      localStorage.setItem(storageKey, text);
    } catch {
      // ignore
    }
    window.alert('Saved reflection (demo).');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Exam Reflect</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Private notes saved to localStorage (demo).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/exams')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Reflection for exam {id}</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-3 w-full min-h-[180px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder="What went well? What will you improve next time?"
          />
          <button type="button" onClick={save} className="mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamReflect;


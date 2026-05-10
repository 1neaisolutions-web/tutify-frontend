import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const bySubject = {
  math: [
    { id: 'w1', type: 'worksheet', title: 'Quadratics practice worksheet' },
    { id: 'w2', type: 'worksheet', title: 'Algebra warmup set' },
  ],
  biology: [{ id: 'w3', type: 'worksheet', title: 'Photosynthesis review questions' }],
  english: [{ id: 'w4', type: 'worksheet', title: 'Essay structure checklist' }],
};

const ContentSubjectView = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const items = useMemo(() => bySubject[subjectId] || [], [subjectId]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Materials: {subjectId}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Select an item to view.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/content')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-700 dark:text-gray-200">No items.</p>
        ) : (
          items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => navigate(`/student/content/worksheet/${it.id}`)}
              className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">{it.title}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{it.type}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentSubjectView;


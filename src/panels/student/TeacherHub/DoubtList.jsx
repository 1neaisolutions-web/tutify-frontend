import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const DoubtList = () => {
  const navigate = useNavigate();

  const doubts = useMemo(
    () => [
      { id: 'd1', title: 'Quadratics factoring confusion', status: 'open', updatedAt: new Date().toISOString() },
      { id: 'd2', title: 'Photosynthesis: Calvin cycle question', status: 'answered', updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
    []
  );

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Doubts</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Tickets raised to teachers (demo).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/teachers')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-3">
        {doubts.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => navigate(`/student/doubts/${d.id}`)}
            className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{d.title}</p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  d.status === 'open'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                }`}
              >
                {d.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Updated: {new Date(d.updatedAt).toLocaleString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoubtList;


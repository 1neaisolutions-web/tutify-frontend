import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DoubtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const doubt = useMemo(() => {
    const map = {
      d1: { title: 'Quadratics factoring confusion', status: 'open', reply: null },
      d2: { title: 'Photosynthesis: Calvin cycle question', status: 'answered', reply: 'Great question. Calvin cycle uses CO2 to build sugars using ATP/NADPH.' },
    };
    return map[id] || { title: 'Doubt', status: 'open', reply: null };
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{doubt.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Status: {doubt.status}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/doubts')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Teacher reply</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {doubt.reply || 'No reply yet. In Phase 2, you’ll receive notifications here.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoubtDetail;


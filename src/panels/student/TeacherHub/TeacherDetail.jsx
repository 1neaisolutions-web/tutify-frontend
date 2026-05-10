import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const teacher = useMemo(() => {
    const map = {
      t1: { name: 'Ms. Johnson', subject: 'Math' },
      t2: { name: 'Mr. Lee', subject: 'Science' },
    };
    return map[id] || { name: 'Teacher', subject: '—' };
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{teacher.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{teacher.subject}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/teachers')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Demo messaging UI. Phase 2 will load real threads and allow attachments.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Send a message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Type your question…"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setMessage('');
              window.alert('Message sent (demo).');
            }}
            disabled={!message.trim()}
            className="mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;


import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NOTES_KEY = 'tutify_student_notes_v1';

const StudyRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const subject = decodeURIComponent(id || '');

  const notes = useMemo(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      // Phase 1: notes aren't tagged; show recent notes as "related"
      return list.slice(0, 5);
    } catch {
      return [];
    }
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{subject} Study Room</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Scoped Phase 1: static resources + notes shortcut.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/subjects')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Resources (demo)</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">Key formulas / definitions</li>
            <li className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">Practice set starter</li>
            <li className="rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">AI: ask questions in Copilot or Tutors</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent notes</h2>
            <button
              type="button"
              onClick={() => navigate('/student/notes/new')}
              className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm"
            >
              New
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">No notes yet.</p>
            ) : (
              notes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => navigate(`/student/notes/${n.id}`)}
                  className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 px-3 py-2"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title || 'Untitled note'}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{n.content || '—'}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoomDetail;


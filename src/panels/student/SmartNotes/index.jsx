import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_notes_v1';

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const SmartNotes = () => {
  const navigate = useNavigate();
  const notes = useMemo(() => loadNotes(), []);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Create notes and attach AI summaries later (demo).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/notes/new')}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          New note
        </button>
      </div>

      <div className="px-6 py-6 max-w-4xl">
        {notes.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 text-sm text-gray-700 dark:text-gray-200">
            No notes yet. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes
              .slice()
              .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
              .map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => navigate(`/student/notes/${n.id}`)}
                  className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4"
                >
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{n.title || 'Untitled note'}</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{n.content || '—'}</p>
                  <p className="mt-3 text-xs text-gray-500">{new Date(n.updatedAt || n.createdAt).toLocaleString()}</p>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotes;


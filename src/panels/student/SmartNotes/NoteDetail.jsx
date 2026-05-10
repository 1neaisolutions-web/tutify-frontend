import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_notes_v1';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const note = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      return list.find((n) => String(n.id) === String(id)) || null;
    } catch {
      return null;
    }
  }, [id]);

  const remove = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.filter((n) => String(n.id) !== String(id))));
    } catch {
      // ignore
    }
    navigate('/student/notes');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{note?.title || 'Note'}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Demo note detail</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/student/notes')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Back
          </button>
          <button type="button" onClick={remove} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          {note ? (
            <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{note.content || '—'}</p>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-200">Note not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;


import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_notes_v1';

const NoteEditor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const save = () => {
    const note = {
      id: `note_${Date.now()}`,
      title: title.trim(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([note, ...list].slice(0, 200)));
    } catch {
      // ignore
    }
    navigate(`/student/notes/${note.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.notes.newNote')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.notes.editor.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/student/notes')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >{t('studentPanel.common.cancel')}</button>
          <button type="button" onClick={save} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">{t('studentPanel.common.save')}</button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          placeholder={t('studentPanel.notes.editor.placeholderTitle')}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[280px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          placeholder={t('studentPanel.notes.editor.placeholderContent')}
        />
      </div>
    </div>
  );
};

export default NoteEditor;


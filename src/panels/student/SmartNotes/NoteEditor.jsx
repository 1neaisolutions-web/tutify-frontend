import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { MAYA_SUBJECTS } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const NoteEditor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = routeId || searchParams.get('id');

  const existing = useMemo(() => {
    if (!editId) return null;
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    return (Array.isArray(list) ? list : []).find((n) => String(n.id) === String(editId)) || null;
  }, [editId]);

  const [title, setTitle] = useState(existing?.title || '');
  const [content, setContent] = useState(existing?.content || '');
  const [subjectId, setSubjectId] = useState(existing?.subjectId || '');

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || '');
      setContent(existing.content || '');
      setSubjectId(existing.subjectId || '');
    }
  }, [existing]);

  const isEditing = Boolean(existing);

  const save = () => {
    const subject = MAYA_SUBJECTS.find((s) => s.id === subjectId);
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    const arr = Array.isArray(list) ? list : [];

    if (isEditing) {
      const updated = arr.map((n) =>
        String(n.id) === String(existing.id)
          ? { ...n, title: title.trim(), content, subjectId: subjectId || null, subject: subject?.name || n.subject || null, updatedAt: new Date().toISOString() }
          : n
      );
      writeJson(STUDENT_STORAGE_KEYS.NOTES, updated);
      emitStudentEvent({ module: 'notes', action: 'edited', subject: subject?.name, artifactRef: existing.id });
      navigate(`/student/notes/${existing.id}`);
      return;
    }

    const note = {
      id: `note_${Date.now()}`,
      title: title.trim(),
      content,
      subjectId: subjectId || null,
      subject: subject?.name || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeJson(STUDENT_STORAGE_KEYS.NOTES, [note, ...arr].slice(0, 200));
    emitStudentEvent({ module: 'notes', action: 'saved', subject: note.subject, artifactRef: note.id });
    navigate(`/student/notes/${note.id}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Notes"
        title={isEditing ? t('studentPanel.common.edit') : t('studentPanel.notes.newNote')}
        subtitle={t('studentPanel.notes.editor.subtitle')}
        right={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(isEditing ? `/student/notes/${existing.id}` : '/student/notes')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('studentPanel.common.cancel')}
            </button>
            <button
              type="button"
              onClick={save}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
            >
              {t('studentPanel.common.save')}
            </button>
          </div>
        }
      />

      <div className="px-6 py-6 max-w-3xl">
        <FadeIn>
          <SectionCard accent className="p-5 space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
              placeholder={t('studentPanel.notes.editor.placeholderTitle')}
            />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject</span>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSubjectId('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    !subjectId
                      ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200'
                      : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  No subject
                </button>
                {MAYA_SUBJECTS.map((s) => {
                  const color = subjectColor(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSubjectId(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        subjectId === s.id ? `${color.chip} ring-1 ring-inset ring-current` : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[280px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
              placeholder={t('studentPanel.notes.editor.placeholderContent')}
            />
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default NoteEditor;

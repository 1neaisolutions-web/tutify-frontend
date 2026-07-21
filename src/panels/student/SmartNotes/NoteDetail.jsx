import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const NoteDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const note = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    return (Array.isArray(list) ? list : []).find((n) => String(n.id) === String(id)) || null;
  }, [id]);

  const color = subjectColor(note?.subjectId);

  const remove = () => {
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    const arr = Array.isArray(list) ? list : [];
    writeJson(STUDENT_STORAGE_KEYS.NOTES, arr.filter((n) => String(n.id) !== String(id)));
    navigate('/student/notes');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Notes"
        title={note?.title || 'Note'}
        subtitle={t('studentPanel.notes.detail.subtitle')}
        right={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/student/notes')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('studentPanel.common.back')}
            </button>
            {note ? (
              <button
                type="button"
                onClick={() => navigate(`/student/notes/${note.id}/edit`)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {t('studentPanel.common.edit')}
              </button>
            ) : null}
            <button type="button" onClick={remove} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        }
      >
        {note?.subject ? (
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${color.chip}`}>{note.subject}</span>
        ) : null}
      </PageHeader>

      <div className="px-6 py-6 max-w-3xl">
        <FadeIn>
          <SectionCard accent={Boolean(note?.subjectId)} className="p-4">
            {note ? (
              <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{note.content || '—'}</p>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.notes.detail.notFound')}</p>
            )}
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default NoteDetail;

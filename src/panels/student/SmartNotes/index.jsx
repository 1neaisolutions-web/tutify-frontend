import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAYA_SUBJECTS } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import StudentEmptyState from '../_shared/StudentEmptyState';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const SmartNotes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notes = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    return Array.isArray(list) ? list : [];
  }, []);
  const [subjectFilter, setSubjectFilter] = useState('all');

  const subjectOptions = useMemo(() => {
    const usedIds = new Set(notes.map((n) => n.subjectId).filter(Boolean));
    return MAYA_SUBJECTS.filter((s) => usedIds.has(s.id));
  }, [notes]);

  const filtered = useMemo(() => {
    const sorted = notes
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
    if (subjectFilter === 'all') return sorted;
    if (subjectFilter === 'none') return sorted.filter((n) => !n.subjectId);
    return sorted.filter((n) => n.subjectId === subjectFilter);
  }, [notes, subjectFilter]);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Notes"
        title={t('studentPanel.notes.title')}
        subtitle={t('studentPanel.notes.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/notes/new')}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
          >
            New note
          </button>
        }
      />

      <div className="px-6 py-6 max-w-4xl">
        {notes.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                subjectFilter === 'all'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              All
            </button>
            {subjectOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubjectFilter(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  subjectFilter === s.id
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                {s.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSubjectFilter('none')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                subjectFilter === 'none'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              No subject
            </button>
          </div>
        ) : null}

        {notes.length === 0 ? (
          <StudentEmptyState
            title={t('studentPanel.notes.empty')}
            subtitle="Save notes from Doubt Solver sessions or start a fresh note tagged to a subject."
            ctaLabel="New note"
            ctaPath="/student/notes/new"
          />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 text-sm text-gray-700 dark:text-gray-200">
            No notes match this subject yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((n, i) => {
              const color = subjectColor(n.subjectId);
              return (
                <FadeIn key={n.id} delayMs={Math.min(i, 6) * 40}>
                  <button
                    type="button"
                    onClick={() => navigate(`/student/notes/${n.id}`)}
                    className="text-left w-full relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
                  >
                    {n.subjectId ? <div className={`absolute top-0 left-0 h-full w-1 ${color.bar}`} aria-hidden /> : null}
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">{n.title || 'Untitled note'}</h2>
                      {n.subject ? (
                        <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${color.chip}`}>
                          {n.subject}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{n.content || '—'}</p>
                    <p className="mt-3 text-xs text-gray-500">{new Date(n.updatedAt || n.createdAt).toLocaleString()}</p>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotes;

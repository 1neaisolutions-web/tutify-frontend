import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const TaskEdit = () => {
  const { t } = useTranslation();
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.TASKS, []);
    return list.find((t) => String(t.id) === String(taskId)) || null;
  }, [taskId]);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueAt, setDueAt] = useState(() => {
    if (!task?.dueAt) return '';
    const d = new Date(task.dueAt);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const save = () => {
    const list = readJson(STUDENT_STORAGE_KEYS.TASKS, []);
    const next = list.map((t) =>
      String(t.id) === String(taskId)
        ? { ...t, title: title.trim(), description, dueAt: dueAt ? new Date(dueAt).toISOString() : null, updatedAt: new Date().toISOString() }
        : t
    );
    writeJson(STUDENT_STORAGE_KEYS.TASKS, next);
    emitStudentEvent({ module: 'tasks', action: 'saved', artifactRef: taskId });
    navigate(`/student/tasks/${taskId}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="My Tasks"
        title={t('studentPanel.tasks.edit.title')}
        subtitle={t('studentPanel.tasks.edit.subtitle')}
        right={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/student/tasks/${taskId}`)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('studentPanel.common.cancel')}
            </button>
            <button
              type="button"
              onClick={save}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              {t('studentPanel.common.save')}
            </button>
          </div>
        }
      />

      <div className="px-6 py-6 max-w-3xl">
        {task ? (
          <FadeIn>
            <SectionCard accent className="p-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.tasks.fields.title')}</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.tasks.fields.description')}</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full min-h-[180px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.tasks.fields.dueDate')}</span>
                <input
                  type="datetime-local"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </label>
            </SectionCard>
          </FadeIn>
        ) : (
          <SectionCard className="p-6">
            <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.tasks.notFound')}</p>
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default TaskEdit;

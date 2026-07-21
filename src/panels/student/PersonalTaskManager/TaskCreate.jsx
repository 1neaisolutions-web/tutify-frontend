import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const TaskCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const suggestedTitle = location.state?.title || '';
  const suggestedDescription = location.state?.description || '';

  const [title, setTitle] = useState(suggestedTitle);
  const [description, setDescription] = useState(suggestedDescription);
  const [dueAt, setDueAt] = useState('');

  const canSave = useMemo(() => Boolean(title.trim()), [title]);

  const save = () => {
    const task = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      description,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = readJson(STUDENT_STORAGE_KEYS.TASKS, []);
    writeJson(STUDENT_STORAGE_KEYS.TASKS, [task, ...list].slice(0, 300));
    emitStudentEvent({ module: 'tasks', action: 'saved', artifactRef: task.id });
    navigate(`/student/tasks/${task.id}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="My Tasks"
        title={t('studentPanel.tasks.create.title')}
        subtitle={t('studentPanel.tasks.create.subtitle')}
        right={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/student/tasks')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('studentPanel.common.cancel')}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {t('studentPanel.common.save')}
            </button>
          </div>
        }
      />

      <div className="px-6 py-6 max-w-3xl">
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
                className="mt-1 w-full min-h-[160px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
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
      </div>
    </div>
  );
};

export default TaskCreate;

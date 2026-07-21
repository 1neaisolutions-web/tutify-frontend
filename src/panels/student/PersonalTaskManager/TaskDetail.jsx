import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const findTask = (taskId) => {
  const list = readJson(STUDENT_STORAGE_KEYS.TASKS, []);
  return list.find((t) => String(t.id) === String(taskId)) || null;
};

const TaskDetail = () => {
  const { t } = useTranslation();
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(() => findTask(taskId));

  useEffect(() => {
    setTask(findTask(taskId));
  }, [taskId]);

  const update = useCallback(
    (patch) => {
      const list = readJson(STUDENT_STORAGE_KEYS.TASKS, []);
      let updated = null;
      const next = list.map((t) => {
        if (String(t.id) !== String(taskId)) return t;
        updated = { ...t, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      });
      writeJson(STUDENT_STORAGE_KEYS.TASKS, next);
      if (updated) setTask(updated);
    },
    [taskId]
  );

  const remove = () => {
    const list = readJson(STUDENT_STORAGE_KEYS.TASKS, []);
    writeJson(STUDENT_STORAGE_KEYS.TASKS, list.filter((t) => String(t.id) !== String(taskId)));
    emitStudentEvent({ module: 'tasks', action: 'saved', artifactRef: taskId, outcome: { deleted: true } });
    navigate('/student/tasks');
  };

  const toggleCompleted = () => {
    const next = !task?.completed;
    update({ completed: next });
    emitStudentEvent({ module: 'tasks', action: 'saved', artifactRef: taskId, outcome: { completed: next } });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="My Tasks"
        title={task?.title || t('studentPanel.tasks.defaultTitle')}
        subtitle={task?.completed ? t('studentPanel.common.completed') : t('studentPanel.common.openStatus')}
        right={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/student/tasks')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('studentPanel.common.back')}
            </button>
            {task ? (
              <button
                type="button"
                onClick={() => navigate(`/student/tasks/${task.id}/edit`)}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                {t('studentPanel.common.edit')}
              </button>
            ) : null}
          </div>
        }
      />

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {task ? (
          <FadeIn>
            <SectionCard accent={task.completed} className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{task.description || '—'}</p>
                <p className="text-xs text-gray-500">{task.dueAt ? t('studentPanel.common.due', { date: new Date(task.dueAt).toLocaleString() }) : t('studentPanel.common.noDueDate')}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleCompleted}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    task.completed
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                      : 'border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                      task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400 dark:border-gray-600'
                    }`}
                  >
                    {task.completed ? '✓' : ''}
                  </span>
                  {task.completed ? t('studentPanel.tasks.detail.markOpen') : t('studentPanel.tasks.detail.markCompleted')}
                </button>
                <button type="button" onClick={remove} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                  {t('studentPanel.common.delete')}
                </button>
              </div>
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

export default TaskDetail;

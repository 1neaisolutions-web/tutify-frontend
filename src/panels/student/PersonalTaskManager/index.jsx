import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { getTaskSuggestions } from './taskSuggestions';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import AiAssistedChip from '../_shared/AiAssistedChip';

const loadTasks = () => readJson(STUDENT_STORAGE_KEYS.TASKS, []);

const PersonalTaskManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tasks = useMemo(() => loadTasks(), []);
  const suggestions = useMemo(() => getTaskSuggestions(), []);

  const sortedTasks = useMemo(() => {
    return tasks.slice().sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.dueAt) return 1;
      if (!b.dueAt) return -1;
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });
  }, [tasks]);

  const isOverdue = (task) => task.dueAt && !task.completed && new Date(task.dueAt).getTime() < Date.now();

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="My Tasks"
        title={t('studentPanel.tasks.title')}
        subtitle={t('studentPanel.tasks.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/tasks/create')}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
          >
            {t('studentPanel.common.addTask')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <FadeIn>
          <SectionCard hero accent className="p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.tasks.suggestions.title')}</h2>
              {suggestions.length ? <AiAssistedChip label="AI-suggested" /> : null}
            </div>
            {suggestions.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                No weak topics or upcoming assignments right now — nice work staying on top of things.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigate('/student/tasks/create', { state: { title: s.title, description: s.description } })}
                    className="text-left rounded-xl border border-primary-100 dark:border-primary-900 bg-white dark:bg-gray-950 hover:bg-primary-50/60 dark:hover:bg-primary-950/20 transition-colors p-3"
                  >
                    <p className="font-medium text-gray-900 dark:text-gray-100">{s.title}</p>
                    <p className="text-xs text-gray-500">{t('studentPanel.common.suggestedDue', { due: s.due })}</p>
                  </button>
                ))}
              </div>
            )}
          </SectionCard>
        </FadeIn>

        {sortedTasks.length === 0 ? (
          <SectionCard className="p-6">
            <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.tasks.empty')}</p>
          </SectionCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedTasks.map((task, i) => {
              const overdue = isOverdue(task);
              return (
                <FadeIn key={task.id} delayMs={i * 40}>
                  <button
                    type="button"
                    onClick={() => navigate(`/student/tasks/${task.id}`)}
                    className={`text-left w-full rounded-xl border bg-white dark:bg-gray-950 hover:shadow-sm transition-all p-4 ${
                      task.completed
                        ? 'border-gray-200 dark:border-gray-800 opacity-60'
                        : overdue
                          ? 'border-red-200 dark:border-red-900/50'
                          : 'border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800'
                    }`}
                  >
                    <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{task.description || '—'}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className={`text-xs ${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500'}`}>
                        {task.dueAt ? new Date(task.dueAt).toLocaleString() : t('studentPanel.common.noDueDate')}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          task.completed
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200'
                            : overdue
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {task.completed ? t('studentPanel.common.completed') : overdue ? 'Overdue' : t('studentPanel.common.openStatus')}
                      </span>
                    </div>
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

export default PersonalTaskManager;

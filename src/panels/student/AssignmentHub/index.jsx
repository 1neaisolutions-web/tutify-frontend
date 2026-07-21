import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ASSIGNMENT_STATUS } from '../constants/statusTypes';
import { getMergedAssignments } from './assignmentUtils';
import { getBridgedAssignments } from '../api/teacherToolsBridge';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const SUBJECT_ID_BY_NAME = {
  'Algebra II': 'algebra-ii',
  Biology: 'biology',
  'English II': 'english-ii',
  'World History': 'world-history',
};

const AssignmentHub = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusLabel = (s) => {
    switch (s) {
      case ASSIGNMENT_STATUS.NOT_STARTED:
        return t('studentPanel.assignments.status.notStarted');
      case ASSIGNMENT_STATUS.IN_PROGRESS:
        return t('studentPanel.assignments.status.inProgress');
      case ASSIGNMENT_STATUS.SUBMITTED:
        return t('studentPanel.assignments.status.submitted');
      case ASSIGNMENT_STATUS.GRADED:
        return t('studentPanel.assignments.status.graded');
      case ASSIGNMENT_STATUS.REVISION_REQUESTED:
        return t('studentPanel.assignments.status.revisionRequested');
      default:
        return s;
    }
  };

  const deadlineTone = (dueAt) => {
    const ms = new Date(dueAt).getTime() - Date.now();
    const hours = ms / (1000 * 60 * 60);
    if (hours <= 0) return { label: t('studentPanel.assignments.deadline.overdue'), cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200' };
    if (hours < 6) return { label: t('studentPanel.assignments.deadline.dueSoon'), cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200' };
    if (hours < 24) return { label: t('studentPanel.assignments.deadline.due24h'), cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' };
    if (hours < 72) return { label: t('studentPanel.assignments.deadline.due72h'), cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' };
    return { label: t('studentPanel.assignments.deadline.upcoming'), cls: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-200' };
  };

  const [items, setItems] = useState(() => getMergedAssignments());
  const tasks = useMemo(() => readJson(STUDENT_STORAGE_KEYS.TASKS, []).slice(0, 3), []);

  useEffect(() => {
    let active = true;
    getBridgedAssignments().then((list) => {
      if (active) setItems(getMergedAssignments(list));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Assignments" title={t('studentPanel.assignments.title')} subtitle={t('studentPanel.assignments.subtitle')} />

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((a, i) => {
            const tone = deadlineTone(a.dueAt);
            const isGraded = a.status === ASSIGNMENT_STATUS.GRADED;
            const earned = isGraded ? a.rubric.reduce((sum, r) => sum + (r.earned || 0), 0) : null;
            const max = isGraded ? a.rubric.reduce((sum, r) => sum + r.maxPoints, 0) : null;
            const color = subjectColor(SUBJECT_ID_BY_NAME[a.subject]);
            return (
              <FadeIn key={a.id} delayMs={Math.min(i, 8) * 40}>
                <button
                  type="button"
                  onClick={() => navigate(`/student/assignments/${a.id}`)}
                  className="text-left w-full relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
                >
                  <div className={`absolute top-0 left-0 h-full w-1 ${color.bar}`} aria-hidden />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">{a.title}</h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{a.subject}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tone.cls}`}>
                      {tone.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
                      {statusLabel(a.status)}
                    </span>
                    {isGraded ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
                        {earned}/{max} pts
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-200">
                        {t('studentPanel.assignments.aiHelpAvailable')}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-gray-500">{t('studentPanel.common.due', { date: new Date(a.dueAt).toLocaleString() })}</p>
                </button>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delayMs={items.length * 40}>
          <SectionCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.assignments.myTasks.title')}</h2>
              <button
                type="button"
                onClick={() => navigate('/student/tasks')}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {t('studentPanel.assignments.myTasks.openTasks')}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {t('studentPanel.assignments.myTasks.integrationNote')}
            </p>
            <div className="mt-3 space-y-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.assignments.myTasks.empty')}</p>
              ) : (
                tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => navigate(`/student/tasks/${task.id}`)}
                    className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 px-3 py-2 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.dueAt ? new Date(task.dueAt).toLocaleString() : t('studentPanel.common.noDueDate')}</p>
                  </button>
                ))
              )}
            </div>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default AssignmentHub;

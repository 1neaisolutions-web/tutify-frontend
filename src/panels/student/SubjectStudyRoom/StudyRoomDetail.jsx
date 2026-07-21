import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MAYA_SUBJECTS, MAYA_STUDY_ROOM_RESOURCES, getProgressSubject } from '../data/mayaChenDemoData';
import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { getEffectiveTopicScore, getStudentEvents } from '../utils/studentEventLog';
import StudentEmptyState from '../_shared/StudentEmptyState';
import { subjectColor } from '../_shared/subjectColors';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import MasteryRing from '../_shared/MasteryRing';

const RESOURCE_ICON = {
  worksheet: '📄',
  pack: '🌙',
  assignment: '📝',
};

const TOPIC_DOT_CLS = {
  strong: 'bg-emerald-500',
  moderate: 'bg-sky-500',
  weak: 'bg-amber-500',
  not_assessed: 'bg-gray-200 dark:bg-gray-800',
};

const StudyRoomDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const subject = useMemo(() => MAYA_SUBJECTS.find((s) => s.id === id) || { id, name: decodeURIComponent(id || '') }, [id]);
  const progress = useMemo(() => getProgressSubject(subject.id), [subject.id]);
  const resources = MAYA_STUDY_ROOM_RESOURCES[subject.id] || [];
  const color = subjectColor(subject.id);

  const notes = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    return (Array.isArray(list) ? list : []).filter((n) => n.subjectId === subject.id).slice(0, 6);
  }, [subject.id]);

  const recentActivity = useMemo(() => {
    return getStudentEvents()
      .filter(
        (e) =>
          e.subject === subject.name ||
          e.subject === subject.id ||
          (subject.name && e.subject?.toLowerCase().includes(subject.name.toLowerCase().split(' ')[0]))
      )
      .slice(-8)
      .reverse();
  }, [subject.name, subject.id]);

  const topics = useMemo(() => {
    if (!progress) return [];
    return progress.topics.map((topic) => ({ ...topic, score: getEffectiveTopicScore(subject.id, topic.id, topic.score) }));
  }, [progress, subject.id]);

  const weakTopic = topics.find((topic) => topic.level === 'weak');

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Study Rooms"
        title={t('studentPanel.common.studyRoomTitle', { subject: subject.name })}
        subtitle={t('studentPanel.studyRoom.detail.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/subjects')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-5xl space-y-6">
        {progress ? (
          <FadeIn>
            <SectionCard hero accent className="p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <MasteryRing value={progress.masteryPct} label="Mastery" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{subject.name} mastery</h2>
                  <div className="mt-2 flex gap-1">
                    {topics.map((topic) => (
                      <span
                        key={topic.id}
                        title={`${topic.name}: ${topic.level}`}
                        className={`h-2 flex-1 rounded-full ${TOPIC_DOT_CLS[topic.level] || TOPIC_DOT_CLS.not_assessed}`}
                      />
                    ))}
                  </div>
                  {weakTopic ? (
                    <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                      Weakest topic: {weakTopic.name} ({weakTopic.score}%) — quick-launch below to work on it.
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate('/student/doubt-solver', {
                          state: { subjectId: subject.id, prefillProblem: weakTopic ? `Help me with ${weakTopic.name} in ${subject.name}` : '' },
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium transition-colors"
                    >
                      Ask Doubt Solver about {subject.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/student/quizzes?subject=${subject.id}`)}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm transition-colors"
                    >
                      Take a {subject.name} quiz
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>
          </FadeIn>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn delayMs={60}>
            <SectionCard className="p-4 h-full">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.studyRoom.detail.resources.title')}</h2>
              {resources.length === 0 ? (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">No resources linked yet for this subject.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  {resources.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => navigate(r.path)}
                        className="w-full text-left flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-900 px-3 py-2 transition-colors"
                      >
                        <span aria-hidden>{RESOURCE_ICON[r.type] || '📎'}</span>
                        <span>{r.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </FadeIn>

          <FadeIn delayMs={100}>
            <SectionCard className="p-4 h-full">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.studyRoom.detail.recentNotes')}</h2>
                <button
                  type="button"
                  onClick={() => navigate('/student/notes/new')}
                  className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm transition-colors"
                >
                  New
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {notes.length === 0 ? (
                  <StudentEmptyState
                    title={t('studentPanel.notes.empty')}
                    subtitle={`Notes tagged "${subject.name}" will show up here.`}
                    ctaLabel="New note"
                    ctaPath="/student/notes/new"
                  />
                ) : (
                  notes.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => navigate(`/student/notes/${n.id}`)}
                      className="w-full text-left relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 px-3 py-2 transition-colors"
                    >
                      <div className={`absolute top-0 left-0 h-full w-0.5 ${color.bar}`} aria-hidden />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title || 'Untitled note'}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{n.content || '—'}</p>
                    </button>
                  ))
                )}
              </div>
            </SectionCard>
          </FadeIn>
        </div>

        {recentActivity.length > 0 ? (
          <FadeIn delayMs={140}>
            <SectionCard className="p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent activity</h2>
              <ul className="mt-4 relative pl-4">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200 dark:bg-gray-800" aria-hidden />
                {recentActivity.map((evt) => (
                  <li key={evt.id} className="relative pb-4 last:pb-0">
                    <span className={`absolute -left-4 top-1 h-2.5 w-2.5 rounded-full ${color.dot} ring-4 ring-white dark:ring-gray-950`} aria-hidden />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-200">
                        <span className="font-medium capitalize">{evt.module.replace(/_/g, ' ')}</span> · {evt.action}
                        {evt.topic ? ` · ${evt.topic}` : ''}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(evt.timestamp).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default StudyRoomDetail;

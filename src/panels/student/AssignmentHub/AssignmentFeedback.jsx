import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { findAssignmentById } from '../api/teacherToolsBridge';
import StudentEmptyState from '../_shared/StudentEmptyState';
import AiAssistedChip from '../_shared/AiAssistedChip';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import MasteryRing from '../_shared/MasteryRing';

const AssignmentFeedback = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const assignment = useMemo(() => findAssignmentById(id), [id]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!assignment) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.assignments.notFound')}</p>
      </div>
    );
  }

  const isGraded = assignment.status === 'graded';
  const totalEarned = assignment.rubric.reduce((sum, r) => sum + (r.earned || 0), 0);
  const totalMax = assignment.rubric.reduce((sum, r) => sum + r.maxPoints, 0);
  const percent = totalMax ? Math.round((totalEarned / totalMax) * 100) : 0;

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Assignments"
        title={assignment.title}
        subtitle={assignment.subject}
        right={
          <button
            type="button"
            onClick={() => navigate(`/student/assignments/${assignment.id}`)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {!isGraded ? (
          <StudentEmptyState
            title="No feedback yet"
            subtitle="Your teacher hasn't graded this assignment. Check back after the due date, or submit your work now if you haven't already."
            ctaLabel="Go to assignment"
            ctaPath={`/student/assignments/${assignment.id}`}
          />
        ) : (
          <>
            <FadeIn>
              <SectionCard hero accent className="p-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <MasteryRing value={percent} label="Score" />
                  <div className="flex-1 min-w-0 w-full">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Rubric breakdown</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{totalEarned}/{totalMax} points</p>
                    <div className="mt-4 space-y-3">
                      {assignment.rubric.map((r) => {
                        const pct = r.maxPoints ? Math.round(((r.earned || 0) / r.maxPoints) * 100) : 0;
                        return (
                          <div key={r.id}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-800 dark:text-gray-100">{r.criterion}</span>
                              <span className="font-medium text-gray-700 dark:text-gray-200">
                                {r.earned}/{r.maxPoints}
                              </span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-sky-500' : 'bg-amber-500'}`}
                                style={{ width: mounted ? `${pct}%` : '0%' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </FadeIn>

            {assignment.feedback ? (
              <FadeIn delayMs={80}>
                <SectionCard className="p-4">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">Teacher feedback</h2>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{assignment.feedback}</p>
                </SectionCard>
              </FadeIn>
            ) : null}

            {assignment.teacherComment ? (
              <FadeIn delayMs={140}>
                <SectionCard className="p-4 border-sky-200 dark:border-sky-900/50 bg-sky-50/60 dark:bg-sky-950/20">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Focus suggestion</h2>
                    <AiAssistedChip label="AI-assisted" />
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{assignment.teacherComment}</p>
                  <button
                    type="button"
                    onClick={() => navigate('/student/doubt-solver')}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm transition-colors"
                  >
                    Get help with this in Doubt Solver
                  </button>
                </SectionCard>
              </FadeIn>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentFeedback;

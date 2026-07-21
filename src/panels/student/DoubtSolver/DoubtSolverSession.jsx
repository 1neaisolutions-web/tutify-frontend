import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { solveProblem } from '../api/aiApi';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent, setMasteryOverride } from '../utils/studentEventLog';
import AiAssistedChip from '../_shared/AiAssistedChip';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import SkeletonBlock from '../_shared/SkeletonBlock';
import FadeIn from '../_shared/FadeIn';

const DOUBT_SESSIONS_KEY = 'tutify_student_doubt_sessions_v1';

const DoubtSolverSession = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(1);
  const completedRef = useRef(false);

  const session = useMemo(() => {
    const list = readJson(DOUBT_SESSIONS_KEY, []);
    return (Array.isArray(list) ? list : []).find((s) => String(s.id) === String(sessionId)) || null;
  }, [sessionId]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await solveProblem(session?.problem || 'Solve this problem', session?.subjectId || session?.subject || 'General');
        if (!alive) return;
        setData(res.data);
        setRevealedSteps(1);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Failed to solve');
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [session?.problem, session?.subject, session?.subjectId]);

  // Emit a session-complete event once we have a solution, and bump Logarithms mastery for the demo persona.
  useEffect(() => {
    if (!data || completedRef.current) return;
    completedRef.current = true;
    emitStudentEvent({
      module: 'doubt_solver',
      action: 'completed',
      subject: data.subject,
      topic: data.topic,
      outcome: { confidence: data.confidence },
    });
    if (data.topic === 'Logarithms') {
      setMasteryOverride('algebra-ii', 'logarithms', Math.min(95, 52 + 12));
    }
  }, [data]);

  const confidencePct = data ? Math.round((data.confidence ?? 0.6) * 100) : 0;
  const totalSteps = data?.steps?.length || 0;
  const allRevealed = revealedSteps >= totalSteps;

  const saveToNotes = () => {
    const notes = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    const note = {
      id: `note_${Date.now()}`,
      title: `Doubt Solver: ${data?.topic || session?.subject || 'General'}`,
      subject: data?.subject || session?.subject || 'General',
      subjectId: data?.subjectId || session?.subjectId || null,
      content: [
        'Problem:',
        session?.problem || '',
        '',
        'Solution:',
        ...(data?.steps || []).map((s, i) => `Step ${i + 1}: ${s}`),
        '',
        `Answer: ${data?.answer || ''}`,
      ].join('\n'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeJson(STUDENT_STORAGE_KEYS.NOTES, [note, ...(Array.isArray(notes) ? notes : [])].slice(0, 200));
    emitStudentEvent({ module: 'notes', action: 'saved', subject: note.subject, topic: data?.topic, artifactRef: note.id });
    setSaved(true);
    setTimeout(() => navigate(`/student/notes/${note.id}`), 300);
  };

  const escalateToTeacher = () => {
    const doubtId = `d_${Date.now()}`;
    const existing = readJson(STUDENT_STORAGE_KEYS.DOUBTS, []);
    const teacherMatch = (session?.subject || '').toLowerCase().includes('algebra') ? 't1' : 't2';
    const next = [
      ...(Array.isArray(existing) ? existing : []),
      {
        id: doubtId,
        title: (session?.question || data?.topic || 'Escalated doubt').slice(0, 80),
        question: session?.question || '',
        subject: session?.subject || 'General',
        topic: data?.topic || undefined,
        status: 'open',
        teacherId: teacherMatch,
        reply: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    writeJson(STUDENT_STORAGE_KEYS.DOUBTS, next);
    emitStudentEvent({
      module: 'doubt_solver',
      action: 'escalated',
      subject: session?.subject,
      topic: data?.topic,
      artifactRef: doubtId,
    });
    navigate(`/student/doubts/${doubtId}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Doubt Solver"
        title={t('studentPanel.doubtSolver.session.title')}
        subtitle={`${session?.subject || 'General'}${data?.topic ? ` · ${data.topic}` : ''}`}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/doubt-solver')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-4xl space-y-4">
        <SectionCard className="p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.doubtSolver.session.problem')}</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {session?.problem || 'Session not found.'}
          </p>
        </SectionCard>

        <SectionCard accent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.doubtSolver.session.solution')}</h2>
            {!loading && !error ? <AiAssistedChip confidence={data?.confidence ?? 0.6} /> : null}
          </div>
          {loading ? (
            <div className="mt-3">
              <SkeletonBlock rows={4} />
            </div>
          ) : error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : (
            <div className="mt-4">
              {/* Progress dots: one per step, showing how far the reveal has gone */}
              <div className="flex items-center gap-1.5 mb-3">
                {(data?.steps || []).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      idx < revealedSteps ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                {(data?.steps || []).slice(0, revealedSteps).map((s, idx) => (
                  <FadeIn key={String(idx)}>
                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-semibold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{s}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {!allRevealed ? (
                <button
                  type="button"
                  onClick={() => setRevealedSteps((n) => Math.min(totalSteps, n + 1))}
                  className="mt-3 w-full px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 text-sm font-medium transition-colors"
                >
                  Show next step ({revealedSteps}/{totalSteps})
                </button>
              ) : (
                <FadeIn>
                  <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100">
                    <span className="font-medium">Answer:</span> {data?.answer}
                  </div>
                </FadeIn>
              )}

              {allRevealed && confidencePct < 70 ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                  Confidence is lower than usual for this topic — double check with your teacher or the practice problems below.
                </p>
              ) : null}
            </div>
          )}
        </SectionCard>

        {!loading && !error && allRevealed ? (
          <FadeIn>
            <SectionCard className="p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.doubtSolver.session.practice.title')}</h2>
              <ul className="mt-3 space-y-2">
                {(data?.practiceProblems || []).length ? (
                  data.practiceProblems.map((p) => (
                    <li key={p} className="text-sm text-gray-700 dark:text-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">
                      {p}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.doubtSolver.session.practice.empty')}</li>
                )}
              </ul>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={saveToNotes}
                  disabled={saved || loading}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {saved ? 'Saved ✓' : t('studentPanel.common.addToNotes')}
                </button>
                <button
                  type="button"
                  onClick={escalateToTeacher}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    confidencePct < 70
                      ? 'border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                      : 'border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  Ask Teacher Instead
                </button>
              </div>
            </SectionCard>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default DoubtSolverSession;

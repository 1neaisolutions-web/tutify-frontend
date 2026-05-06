import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startLearningSession,
  updateLearningSession,
  completeLearningSession,
  fetchLearningSession,
  fetchContentProgress,
  recordLearningEvent,
} from '../redux/features/learningProgress/learningProgressSlice';
import { fetchLearningHubHome } from '../redux/features/learningHub/learningHubSlice';

/**
 * Server-first tutorial progress with localStorage fallback; debounced PATCH metadata.
 * @param {object} opts
 * @param {string} opts.contentId
 * @param {string} [opts.contentType]
 * @param {number} opts.totalSteps
 * @param {string} [opts.storageKeyPrefix]
 */
export function useTutorialProgress({
  contentId,
  contentType = 'ai_guided_tutorial',
  totalSteps,
  storageKeyPrefix = 'tutorial-progress',
}) {
  const dispatch = useDispatch();
  const activeSessionsByContentId = useSelector(
    (state) => state.learningProgress?.activeSessionsByContentId ?? {}
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const persistTimer = useRef(null);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const lsKey = `${storageKeyPrefix}:${contentId}`;

  const readLocal = useCallback(() => {
    try {
      const raw = localStorage.getItem(lsKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [lsKey]);

  const writeLocal = useCallback(
    (step, completed) => {
      try {
        localStorage.setItem(
          lsKey,
          JSON.stringify({
            currentStep: step,
            completedSteps: completed,
            savedAt: Date.now(),
          })
        );
      } catch {
        /* quota */
      }
    },
    [lsKey]
  );

  const storeSessionId = activeSessionsByContentId[contentId]?.sessionId;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!contentId || totalSteps < 1) {
        setHydrated(true);
        return;
      }
      let sid = storeSessionId || null;
      try {
        if (!sid) {
          const started = await dispatch(
            startLearningSession({ contentId, contentType })
          ).unwrap();
          sid = started?.id;
        }
        if (cancelled || !sid) {
          const local = readLocal();
          if (!cancelled && local) {
            setCurrentStep(Math.min(totalSteps - 1, Math.max(0, Number(local.currentStep) || 0)));
            setCompletedSteps(
              Array.isArray(local.completedSteps)
                ? local.completedSteps.filter((n) => n >= 0 && n < totalSteps)
                : []
            );
          }
          setSessionId(sid || null);
          setHydrated(true);
          return;
        }
        setSessionId(sid);
        const full = await dispatch(fetchLearningSession(sid)).unwrap();
        const tp = full?.session_metadata?.tutorial_progress || {};
        const serverStep = Number(tp.current_step_index ?? tp.currentStep ?? 0);
        const serverDone = tp.completed_step_indices || tp.completedSteps;
        const local = readLocal();
        const localStep = Number(local?.currentStep ?? 0);
        const step = Math.max(
          0,
          Math.min(totalSteps - 1, Math.max(Number.isFinite(serverStep) ? serverStep : 0, localStep))
        );
        const merged = new Set();
        if (Array.isArray(serverDone)) {
          serverDone.forEach((n) => {
            if (typeof n === 'number' && n >= 0 && n < totalSteps) merged.add(n);
          });
        }
        if (Array.isArray(local?.completedSteps)) {
          local.completedSteps.forEach((n) => {
            if (typeof n === 'number' && n >= 0 && n < totalSteps) merged.add(n);
          });
        }
        if (!cancelled) {
          const sorted = Array.from(merged).sort((a, b) => a - b);
          setCurrentStep(step);
          setCompletedSteps(sorted);
          writeLocal(step, sorted);
        }
      } catch {
        const local = readLocal();
        if (!cancelled && local) {
          setCurrentStep(Math.min(totalSteps - 1, Math.max(0, Number(local.currentStep) || 0)));
          setCompletedSteps(
            Array.isArray(local.completedSteps)
              ? local.completedSteps.filter((n) => n >= 0 && n < totalSteps)
              : []
          );
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contentId, contentType, totalSteps, dispatch, readLocal, writeLocal, storeSessionId]);

  const flushProgress = useCallback(
    (step, completed) => {
      writeLocal(step, completed);
      const sid = sessionIdRef.current;
      if (!sid) return;
      const progressPercent =
        totalSteps <= 0 ? 0 : Math.min(99, Math.round(((Math.max(step, 0) + 1) / totalSteps) * 100));
      dispatch(
        updateLearningSession({
          sessionId: sid,
          progress_percent: progressPercent,
          session_metadata: {
            tutorial_progress: {
              current_step_index: step,
              completed_step_indices: completed,
              updated_at: new Date().toISOString(),
            },
          },
        })
      ).catch(() => {});
    },
    [dispatch, totalSteps, writeLocal]
  );

  const schedulePersist = useCallback(
    (step, completed) => {
      writeLocal(step, completed);
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(() => flushProgress(step, completed), 450);
    },
    [flushProgress, writeLocal]
  );

  useEffect(
    () => () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    },
    []
  );

  const setStep = useCallback(
    (next) => {
      const clamped = Math.max(0, Math.min(totalSteps - 1, next));
      setCurrentStep(clamped);
      schedulePersist(clamped, completedSteps);
    },
    [completedSteps, schedulePersist, totalSteps]
  );

  const markStepCompleted = useCallback(
    (stepIndex) => {
      setCompletedSteps((prev) => {
        const next = prev.includes(stepIndex) ? prev : [...prev, stepIndex].sort((a, b) => a - b);
        schedulePersist(currentStep, next);
        return next;
      });
    },
    [currentStep, schedulePersist]
  );

  const goNext = useCallback(() => {
    setCompletedSteps((prev) => {
      const nextCompleted = prev.includes(currentStep) ? prev : [...prev, currentStep].sort((a, b) => a - b);
      const nextStep = Math.min(totalSteps - 1, currentStep + 1);
      setCurrentStep(nextStep);
      schedulePersist(nextStep, nextCompleted);
      return nextCompleted;
    });
  }, [currentStep, schedulePersist, totalSteps]);

  const goPrev = useCallback(() => {
    setStep(currentStep - 1);
  }, [currentStep, setStep]);

  const finishTutorial = useCallback(async () => {
    const last = totalSteps - 1;
    const done = Array.from(new Set([...completedSteps, last])).sort((a, b) => a - b);
    setCompletedSteps(done);
    flushProgress(last, done);
    const sid = sessionIdRef.current;
    if (sid) {
      try {
        await dispatch(
          recordLearningEvent({
            session_id: sid,
            content_id: contentId,
            event_type: 'content_completed',
            event_metadata: {},
          })
        ).unwrap();
      } catch {
        /* non-fatal */
      }
      try {
        await dispatch(completeLearningSession({ sessionId: sid, progress_percent: 100 })).unwrap();
      } catch {
        /* still refresh hub */
      }
    }
    await dispatch(fetchContentProgress(contentId)).catch(() => {});
    await dispatch(fetchLearningHubHome()).catch(() => {});
  }, [completedSteps, contentId, dispatch, flushProgress, totalSteps]);

  return {
    currentStep,
    completedSteps,
    hydrated,
    sessionId,
    setStep,
    goNext,
    goPrev,
    markStepCompleted,
    finishTutorial,
  };
}

// @ts-nocheck
/**
 * usePersonalizationPoller
 *
 * Polls when personalization is in 'initializing' or 'partial_ready' mode.
 * On each cycle it fetches BOTH the personalization state AND the home slate,
 * so as soon as the background job completes the UI transitions to real content.
 *
 * Schedule: 3s fast → 10s slow after 30s → stops at 120s with takingLonger flag.
 */
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchPersonalizationState,
  fetchLearningHubSlate,
  PERSONALIZATION_ENABLED,
} from '../redux/features/personalization/personalizationSlice';
import type { PersonalizationUIMode } from './usePersonalizationStatus';

const FAST_INTERVAL_MS = 4000;
const SLOW_INTERVAL_MS = 10000;
const BACKOFF_AFTER_MS = 30000;
const STOP_AFTER_MS = 120000;

export function usePersonalizationPoller(mode: PersonalizationUIMode) {
  const dispatch = useDispatch();
  const elapsedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showTakingLonger, setShowTakingLonger] = useState(false);

  const shouldPoll = PERSONALIZATION_ENABLED && (mode === 'initializing' || mode === 'partial_ready');

  useEffect(() => {
    if (!shouldPoll) {
      if (timerRef.current) clearTimeout(timerRef.current);
      elapsedRef.current = 0;
      setShowTakingLonger(false);
      return;
    }

    const poll = () => {
      if (elapsedRef.current >= STOP_AFTER_MS) {
        setShowTakingLonger(true);
        return;
      }
      // Fetch both state + slate so UI transitions as soon as content is available
      dispatch(fetchPersonalizationState());
      dispatch(fetchLearningHubSlate());

      const interval = elapsedRef.current >= BACKOFF_AFTER_MS ? SLOW_INTERVAL_MS : FAST_INTERVAL_MS;
      elapsedRef.current += interval;
      timerRef.current = setTimeout(poll, interval);
    };

    timerRef.current = setTimeout(poll, FAST_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [shouldPoll, dispatch]);

  return { showTakingLonger };
}

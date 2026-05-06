// @ts-nocheck
/**
 * usePersonalizationStatus
 *
 * Single source of truth for the personalization UI mode.
 *
 * Priority order (most authoritative first):
 *  1. Feature flag off → disabled
 *  2. Slate is still fetching (idle/loading) → initializing (wait for it)
 *  3. Slate explicitly says initializing → initializing
 *  4. Slate has sections + personalization active → ready / partial_ready
 *  5. State endpoint says initializing → initializing
 *  6. No profile anywhere → no_profile
 *  7. Failure state
 *
 * This order prevents the race condition where /personalization/state resolves
 * before /learning-hub/home and returns a stale "active" status, causing dummy
 * sections to render while personalization is actually in progress.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPersonalizationState,
  PERSONALIZATION_ENABLED,
  selectPersonalizationStatus,
  selectSectionReadiness,
  selectSlateMode,
  selectSlateSections,
} from '../redux/features/personalization/personalizationSlice';

export type PersonalizationUIMode =
  | 'disabled'       // Feature flag off
  | 'no_profile'     // No teaching profile / personalization not yet started
  | 'initializing'   // Personalization in progress (show AI loader)
  | 'partial_ready'  // Some sections ready
  | 'ready'          // All sections ready, show real content
  | 'stale'          // Content exists but needs refresh
  | 'failed';        // Terminal failure

export function usePersonalizationStatus(): {
  mode: PersonalizationUIMode;
  loading: boolean;
  sectionReadiness: Array<{ section: string; status: string; visible_count_actual: number }>;
} {
  const dispatch = useDispatch();

  const personalizationStatus = useSelector(selectPersonalizationStatus);
  const slateMode = useSelector(selectSlateMode);
  const slateSections = useSelector(selectSlateSections);
  const rawSectionReadiness = useSelector(selectSectionReadiness);
  const slateStatus = useSelector((s) => s.personalization?.slateStatus);
  const stateLoadStatus = useSelector((s) => s.personalization?.status);

  const sectionReadiness = Array.isArray(rawSectionReadiness) ? rawSectionReadiness : [];
  const hasSections = slateSections != null && Object.keys(slateSections).length > 0;

  useEffect(() => {
    if (!PERSONALIZATION_ENABLED) return;
    dispatch(fetchPersonalizationState());
  }, [dispatch]);

  // ── Priority 1: Feature disabled ──────────────────────────────────────────
  if (!PERSONALIZATION_ENABLED) {
    return { mode: 'disabled', loading: false, sectionReadiness: [] };
  }

  const slateIsLoading = slateStatus === 'idle' || slateStatus === 'loading';
  const loading = slateIsLoading || stateLoadStatus === 'loading' || stateLoadStatus === 'idle';

  // ── Priority 2: Slate still fetching — wait, do not commit to any mode ───
  // This prevents /personalization/state from "winning" the race prematurely.
  if (slateIsLoading) {
    return { mode: 'initializing', loading: true, sectionReadiness: [] };
  }

  // ── Priority 3: Slate explicitly says initializing ────────────────────────
  if (slateMode === 'initializing') {
    return { mode: 'initializing', loading, sectionReadiness };
  }

  // ── Priority 4: No slate response at all (failed / never fetched) ─────────
  if (slateMode === null) {
    // State endpoint hasn't resolved yet either
    if (stateLoadStatus === 'loading' || stateLoadStatus === 'idle') {
      return { mode: 'initializing', loading: true, sectionReadiness: [] };
    }
    // State resolved with no-profile signal (backend correctly says no_profile)
    if (personalizationStatus === 'no_profile' || personalizationStatus === null || personalizationStatus === undefined) {
      return { mode: 'no_profile', loading: false, sectionReadiness: [] };
    }
    // State returned "active" but no slate — treat as initializing
    // (race: home endpoint started personalization but state resolved first with stale "active")
    if (personalizationStatus === 'initializing') {
      return { mode: 'initializing', loading, sectionReadiness };
    }
    // "active" with no slate = ambiguous; wait rather than show dummy data
    return { mode: 'initializing', loading, sectionReadiness };
  }

  // ── Priority 5: Slate says no_profile ─────────────────────────────────────
  if (slateMode === 'no_profile') {
    return { mode: 'no_profile', loading: false, sectionReadiness: [] };
  }

  // ── Priority 6: Slate has content — derive from readiness ─────────────────
  if (hasSections) {
    if (sectionReadiness.length > 0) {
      const statuses = sectionReadiness.map((r) => r.status);
      if (statuses.every((s) => s === 'ready')) return { mode: 'ready', loading, sectionReadiness };
      if (statuses.some((s) => s === 'stale')) return { mode: 'stale', loading, sectionReadiness };
      if (statuses.some((s) => s === 'ready' || s === 'partial_ready')) return { mode: 'partial_ready', loading, sectionReadiness };
      if (statuses.every((s) => s === 'failed')) return { mode: 'failed', loading, sectionReadiness };
      return { mode: 'initializing', loading, sectionReadiness };
    }
    // Slate has sections but no readiness rows yet → treat as ready (content available)
    return { mode: 'ready', loading, sectionReadiness };
  }

  // ── Priority 7: Slate fetched but empty sections ──────────────────────────
  // personalized/partial_ready mode with empty sections = still initializing
  if (slateMode === 'personalized' || slateMode === 'partial_ready') {
    if (hasSections) {
      return { mode: 'ready', loading, sectionReadiness };
    }
    return { mode: 'initializing', loading, sectionReadiness };
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return { mode: 'no_profile', loading: false, sectionReadiness: [] };
}

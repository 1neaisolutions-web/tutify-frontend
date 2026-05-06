// @ts-nocheck
/**
 * Polls GET /learning-hub/home while the hub is not enterable (orchestration lives in hub_bootstrap on that payload).
 * When SSE is available and connected, the polling interval is skipped — SSE is the primary transport.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLearningHubSlate,
  PERSONALIZATION_ENABLED,
  selectHubBootstrap,
} from '../redux/features/personalization/personalizationSlice';
import { useHubBootstrapSSE } from './useHubBootstrapSSE';

const POLL_MS = 3000;

export function useHubBootstrapOrchestration(showColdStart: boolean) {
  const dispatch = useDispatch();
  const hubBootstrap = useSelector(selectHubBootstrap);
  const pageReadiness = useSelector((s) => s.personalization?.pageReadinessState);
  const showBootstrapBanner = useSelector((s) => s.personalization?.showBootstrapBanner ?? false);
  const canEnterHub =
    hubBootstrap?.can_enter_hub === true || pageReadiness === 'hub_ready';

  // SSE is the primary transport while bootstrapping is in progress.
  const sseEnabled =
    PERSONALIZATION_ENABLED && !showColdStart && !canEnterHub && showBootstrapBanner;
  const { connected: sseConnected } = useHubBootstrapSSE(sseEnabled);

  // Polling interval is the fallback: only runs when SSE is not connected.
  useEffect(() => {
    if (!PERSONALIZATION_ENABLED || showColdStart || canEnterHub) return;
    // SSE is live — skip polling to avoid redundant fetches.
    if (sseConnected) return;
    const id = window.setInterval(() => {
      dispatch(fetchLearningHubSlate());
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [dispatch, showColdStart, canEnterHub, sseConnected]);

  useEffect(() => {
    if (hubBootstrap?.can_enter_hub) {
      dispatch(fetchLearningHubSlate());
    }
  }, [dispatch, hubBootstrap?.can_enter_hub]);
}

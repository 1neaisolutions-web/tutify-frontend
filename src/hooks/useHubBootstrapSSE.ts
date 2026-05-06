import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../config/api';
import {
  fetchLearningHubSlate,
  updateHubBootstrapFromSSE,
} from '../redux/features/personalization/personalizationSlice';

const SSE_URL = `${API_BASE_URL}/api/v1/learning-hub/bootstrap-status/stream`;
const POLL_MS = 3000;

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('persist:root');
    if (!raw) return null;
    const root = JSON.parse(raw);
    const auth = JSON.parse(root.auth || '{}');
    return auth?.user?.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Opens a fetch-based SSE connection to the bootstrap-status/stream endpoint.
 * Falls back to 3-second polling if the connection fails or the token is absent.
 * Stops (and cleans up) when `can_enter_hub === true` arrives via SSE.
 *
 * @param enabled - Call with `PERSONALIZATION_ENABLED && !canEnterHub && showBootstrapBanner`
 */
export function useHubBootstrapSSE(enabled: boolean): {
  connected: boolean;
  error: string | null;
} {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable ref so the async SSE loop can read the latest abort state.
  const abortRef = useRef<AbortController | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    function stopPolling() {
      if (pollRef.current !== null) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    function startPolling() {
      stopPolling();
      // Fire immediately then on interval.
      dispatch(fetchLearningHubSlate() as any);
      pollRef.current = setInterval(() => {
        dispatch(fetchLearningHubSlate() as any);
      }, POLL_MS);
    }

    async function openSSE() {
      const token = getAuthToken();
      if (!token) {
        // No token yet — fall back to polling.
        setError('no_token');
        startPolling();
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(SSE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`SSE ${response.status}`);
        }

        if (!response.body) {
          throw new Error('SSE no body');
        }

        if (!active) return;

        setConnected(true);
        setError(null);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const json = JSON.parse(line.slice(6));
              if (active) {
                dispatch(updateHubBootstrapFromSSE(json) as any);
              }
              if (json.can_enter_hub) {
                // Hub is ready — stop everything.
                controller.abort();
                return;
              }
            } catch {
              // Malformed JSON line — ignore and continue.
            }
          }
        }
      } catch (err: unknown) {
        if (!active) return;
        // AbortError means we deliberately closed — not a real error.
        if (err instanceof Error && err.name === 'AbortError') return;

        const msg = err instanceof Error ? err.message : String(err);
        setConnected(false);
        setError(msg);
        startPolling();
      }
    }

    openSSE();

    return () => {
      active = false;
      setConnected(false);
      abortRef.current?.abort();
      abortRef.current = null;
      stopPolling();
    };
    // `enabled` covers all three conditions (PERSONALIZATION_ENABLED, !canEnterHub,
    // showBootstrapBanner) — re-run whenever any of them changes.
  }, [enabled, dispatch]);

  return { connected, error };
}

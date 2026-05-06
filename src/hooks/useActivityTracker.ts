/**
 * useActivityTracker
 *
 * Fire-and-forget activity event tracker with 3-retry exponential backoff.
 * Deduplication is handled server-side by client_event_id.
 * Frontend never reads events back.
 *
 * Retry contract:
 * - 3 retries total
 * - Backoff: 1s, 3s, 9s
 * - Drop silently after all retries
 */
import { useCallback, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axiosInstance from '../redux/http.js';

interface ActivityEvent {
  event_type: string;
  section?: string;
  content_id?: string;
  content_type?: string;
  assignment_id?: string;
  slate_id?: string;
  session_id?: string;
  dwell_ms?: number;
  metadata?: Record<string, unknown>;
}

let _eventCounter = 0;

function generateClientEventId(eventType: string): string {
  _eventCounter += 1;
  return `${eventType}_${Date.now()}_${_eventCounter}`;
}

async function sendEventsWithRetry(
  events: Array<ActivityEvent & { client_event_id: string }>,
  attempt = 0
): Promise<void> {
  const backoffs = [1000, 3000, 9000];
  try {
    await axiosInstance.post('/api/v1/activity/events', { events });
  } catch {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, backoffs[attempt] ?? 9000));
      return sendEventsWithRetry(events, attempt + 1);
    }
    // Silent drop after 3 retries
  }
}

export function useActivityTracker() {
  const pendingRef = useRef<Array<ActivityEvent & { client_event_id: string }>>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPending = useCallback(() => {
    if (pendingRef.current.length === 0) return;
    const batch = [...pendingRef.current];
    pendingRef.current = [];
    sendEventsWithRetry(batch);
  }, []);

  const track = useCallback(
    (event: ActivityEvent) => {
      const enriched = { ...event, client_event_id: generateClientEventId(event.event_type) };
      pendingRef.current.push(enriched);

      // Debounce: flush after 300ms of no new events (batching)
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      flushTimerRef.current = setTimeout(flushPending, 300);
    },
    [flushPending]
  );

  const trackImpression = useCallback(
    (section: string, content_id?: string, content_type?: string, assignment_id?: string) => {
      track({ event_type: 'impression', section, content_id, content_type, assignment_id });
    },
    [track]
  );

  const trackCardClick = useCallback(
    (section: string, content_id: string, content_type: string, assignment_id?: string) => {
      track({ event_type: 'card_clicked', section, content_id, content_type, assignment_id });
    },
    [track]
  );

  const trackContentStart = useCallback(
    (section: string, content_id: string, content_type: string, assignment_id?: string) => {
      track({ event_type: 'content_started', section, content_id, content_type, assignment_id });
    },
    [track]
  );

  return { track, trackImpression, trackCardClick, trackContentStart };
}

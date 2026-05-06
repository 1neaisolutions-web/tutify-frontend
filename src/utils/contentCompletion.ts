/**
 * Content completion API client with retry contract.
 *
 * Retry policy:
 * - 2 retries with 2s interval
 * - On final failure: returns error for caller to show persistent toast
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axiosInstance from '../redux/http.js';

interface CompleteContentParams {
  content_id: string;
  assignment_id?: string;
  session_id?: string;
  progress_percent?: number;
  metadata?: Record<string, unknown>;
}

interface CompleteContentResult {
  ok: boolean;
  assignment_id?: string;
  newly_unlocked: string[];
  message: string;
  error?: string;
}

async function completeContentRequest(params: CompleteContentParams): Promise<CompleteContentResult> {
  const { content_id, ...body } = params;
  const { data } = await axiosInstance.post(`/api/v1/content/${content_id}/complete`, body);
  return {
    ok: true,
    assignment_id: data.assignment_id,
    newly_unlocked: data.newly_unlocked || [],
    message: data.message || 'Completion recorded.',
  };
}

export async function completeContent(params: CompleteContentParams): Promise<CompleteContentResult> {
  const maxRetries = 2;
  const retryDelayMs = 2000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await completeContentRequest(params);
    } catch (err: any) {
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        continue;
      }
      return {
        ok: false,
        newly_unlocked: [],
        message: 'Failed to save progress.',
        error: err?.response?.data?.detail || err?.message || 'Network error',
      };
    }
  }

  return { ok: false, newly_unlocked: [], message: 'Failed after retries.' };
}

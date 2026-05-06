import { ApiError } from '../api/client'

export interface ParsedCreditError {
  reason?: string
  balance?: number
  required?: number
  message?: string
}

function detailToParsed(d: Record<string, unknown>): ParsedCreditError | null {
  const recognized =
    d.error === 'insufficient_credits' ||
    typeof d.balance === 'number' ||
    typeof d.required === 'number'
  if (!recognized) return null
  return {
    reason: typeof d.reason === 'string' ? d.reason : undefined,
    balance: typeof d.balance === 'number' ? d.balance : undefined,
    required: typeof d.required === 'number' ? d.required : undefined,
    message: typeof d.message === 'string' ? d.message : undefined,
  }
}

/** Parse JSON body from a raw 402 response (e.g. fetch before SSE). */
export function parseInsufficientCreditsFrom402Body(errorText: string): ParsedCreditError | null {
  try {
    const errorJson = JSON.parse(errorText) as { detail?: unknown }
    const detail = errorJson.detail
    if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
      return detailToParsed(detail as Record<string, unknown>)
    }
    if (typeof detail === 'string' && detail.trim()) {
      return { message: detail }
    }
  } catch {
    return null
  }
  return null
}

export function parseCreditError(err: unknown): ParsedCreditError | null {
  if (!(err instanceof ApiError) || err.status !== 402) return null
  const payload = err.payload as Record<string, unknown> | null | undefined
  const detail = payload?.detail
  if (detail && typeof detail === 'object' && detail !== null) {
    const parsed = detailToParsed(detail as Record<string, unknown>)
    if (parsed) return parsed
  }
  if (typeof detail === 'string' && detail.trim()) {
    return { message: detail }
  }
  return {
    message: err.message || 'Insufficient credits',
  }
}

export function isInsufficientCredits(err: unknown): boolean {
  return parseCreditError(err) !== null
}

/** RTK Query `.unwrap()` rejects with `{ status, data }` where `data` is the JSON body (not ApiError). */
export function parseCreditErrorFromUnknown(err: unknown): ParsedCreditError | null {
  const fromApi = parseCreditError(err)
  if (fromApi) return fromApi
  if (err && typeof err === 'object' && err !== null && 'status' in err) {
    const status = (err as { status: unknown }).status
    const data = (err as { data?: unknown }).data
    if (status === 402 && data !== undefined && data !== null) {
      return parseCreditError(new ApiError(402, 'Insufficient credits', data))
    }
  }
  return null
}

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { recordEvent } from '@/redux/features/gamification/gamificationSlice'
import type { GamificationEventType } from '../types'

type RootState = {
  preferences: { timezone: string }
}

export const useRecordGamificationEvent = () => {
  const dispatch = useDispatch()
  const timezone = useSelector((state: RootState) => state.preferences?.timezone ?? 'UTC')

  const recordGamificationEvent = useCallback(
    (type: GamificationEventType, payload: Record<string, unknown>, idempotencyKey: string) => {
      dispatch(
        recordEvent({
          event: {
            type,
            payload,
            idempotencyKey,
            occurredAt: new Date().toISOString(),
          },
          timezone,
        }),
      )
    },
    [dispatch, timezone],
  )

  return recordGamificationEvent
}

/**
 * Wrap a V6-origin scene subtree with timeline frame scaling for V9 pacing.
 */
import React from 'react'
import { TimelineFrameProvider } from '../../shared/timelineFrame'

export type ScaledSceneProps = {
  sourceDuration: number
  targetDuration: number
  children: React.ReactNode
}

export const ScaledScene: React.FC<ScaledSceneProps> = ({
  sourceDuration,
  targetDuration,
  children,
}) => (
  <TimelineFrameProvider sourceDuration={sourceDuration} targetDuration={targetDuration}>
    {children}
  </TimelineFrameProvider>
)

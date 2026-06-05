/**
 * Timeline frame scaling — lets V9 sequences compress V6-origin scenes without
 * duplicating animation code. When wrapped in TimelineFrameProvider, useCurrentFrame
 * (via useTimelineFrame) returns a remapped frame in source-duration space.
 */
import React, { createContext, useContext } from 'react'
import {
  useCurrentFrame as useRemotionCurrentFrame,
  useVideoConfig as useRemotionVideoConfig,
} from 'remotion'

type TimelineScaleConfig = {
  sourceDuration: number
  targetDuration: number
  /** Animation math fps (V6 scenes authored at 30fps). */
  sourceFps: number
}

const TimelineFrameContext = createContext<number | null>(null)
const TimelineScaleContext = createContext<TimelineScaleConfig | null>(null)

export type TimelineFrameProviderProps = {
  /** V6 (source) scene length in frames. */
  sourceDuration: number
  /** V9 sequence durationInFrames. */
  targetDuration: number
  sourceFps?: number
  children: React.ReactNode
}

export const TimelineFrameProvider: React.FC<TimelineFrameProviderProps> = ({
  sourceDuration,
  targetDuration,
  sourceFps = 30,
  children,
}) => {
  const localFrame = useRemotionCurrentFrame()
  const scaledFrame = Math.min(
    Math.max(0, sourceDuration - 0.001),
    localFrame * (sourceDuration / Math.max(1, targetDuration)),
  )

  const scaleConfig: TimelineScaleConfig = {
    sourceDuration,
    targetDuration,
    sourceFps,
  }

  return (
    <TimelineFrameContext.Provider value={scaledFrame}>
      <TimelineScaleContext.Provider value={scaleConfig}>{children}</TimelineScaleContext.Provider>
    </TimelineFrameContext.Provider>
  )
}

export const useTimelineFrame = (): number => {
  const scaled = useContext(TimelineFrameContext)
  if (scaled !== null) return scaled
  return useRemotionCurrentFrame()
}

export const useTimelineVideoConfig = () => {
  const scale = useContext(TimelineScaleContext)
  const config = useRemotionVideoConfig()
  if (scale) {
    return { ...config, fps: scale.sourceFps }
  }
  return config
}

export const useTimelineScale = (): TimelineScaleConfig | null =>
  useContext(TimelineScaleContext)

/** Source-timeline frames for a wall-clock hold inside a scaled V9 sequence. */
export const wallClockHoldFrames = (
  seconds: number,
  compositionFps: number,
  scale: TimelineScaleConfig | null,
): number =>
  scale
    ? Math.round(seconds * compositionFps * (scale.sourceDuration / scale.targetDuration))
    : Math.round(seconds * compositionFps)

/** Drop-in aliases for patched scene files. */
export { useTimelineFrame as useCurrentFrame, useTimelineVideoConfig as useVideoConfig }

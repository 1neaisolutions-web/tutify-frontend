/**
 * Fast radial reveal — previous copy hidden; next copy shown only inside expanding circle.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'

/** ~0.23s @ 60fps composition time (scales with V9 TimelineFrameProvider). */
export const VISION_RADIAL_WIPE_FRAMES = 14

const HOLE_MAX_R = 1180
const HOLE_MIN_R = 48

export const visionRadialWipeProgress = (
  frame: number,
  wipeStart: number,
  wipeFrames = VISION_RADIAL_WIPE_FRAMES,
): number => {
  if (frame < wipeStart) return 0
  if (frame >= wipeStart + wipeFrames) return 1
  return interpolate(frame, [wipeStart, wipeStart + wipeFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
}

export const visionRadialHoleRadiusPx = (
  frame: number,
  wipeStart: number,
  holdUntilFrame: number,
  wipeFrames = VISION_RADIAL_WIPE_FRAMES,
): number => {
  if (frame < wipeStart || frame >= holdUntilFrame) return 0
  const p =
    frame >= wipeStart + wipeFrames ? 1 : visionRadialWipeProgress(frame, wipeStart, wipeFrames)
  return interpolate(p, [0, 1], [HOLE_MIN_R, HOLE_MAX_R], { extrapolateRight: 'clamp' })
}

/** Next phase visible only inside the iris. */
export const visionLine2InsideHoleClip = (
  frame: number,
  wipeStart: number,
  holdUntilFrame: number,
  wipeFrames = VISION_RADIAL_WIPE_FRAMES,
): string => {
  const r = visionRadialHoleRadiusPx(frame, wipeStart, holdUntilFrame, wipeFrames)
  const pct = (r / HOLE_MAX_R) * 78
  return `circle(${pct}% at 50% 50%)`
}

export const visionRadialWipeActive = (
  frame: number,
  wipeStart: number,
  holdUntilFrame: number,
): boolean => frame >= wipeStart && frame < holdUntilFrame

type VisionRadialWipeEdgeProps = {
  frame: number
  wipeStart: number
  holdUntilFrame: number
  wipeFrames?: number
}

export const VisionRadialWipeEdge: React.FC<VisionRadialWipeEdgeProps> = ({
  frame,
  wipeStart,
  holdUntilFrame,
  wipeFrames = VISION_RADIAL_WIPE_FRAMES,
}) => {
  if (!visionRadialWipeActive(frame, wipeStart, holdUntilFrame)) return null

  const r = visionRadialHoleRadiusPx(frame, wipeStart, holdUntilFrame, wipeFrames)
  const pct = (r / HOLE_MAX_R) * 78
  const p = visionRadialWipeProgress(
    Math.min(frame, wipeStart + wipeFrames - 0.001),
    wipeStart,
    wipeFrames,
  )
  const edgeStrength = interpolate(p, [0, 0.35, 0.85, 1], [0.7, 1, 0.75, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 60 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: edgeStrength,
          background: `radial-gradient(circle at 50% 50%,
            transparent ${Math.max(0, pct - 1.8)}%,
            rgba(255,255,255,0.96) ${pct}%,
            rgba(91,79,207,0.38) ${pct + 1.2}%,
            transparent ${pct + 4}%)`,
        }}
      />
    </AbsoluteFill>
  )
}

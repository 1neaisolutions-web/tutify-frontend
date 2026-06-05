/**
 * Scene handoff — counterclockwise rotate + scale during crossfade overlap.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

import {
  rotateCCWEnterMotion,
  rotateCCWExitMotion,
  rotateCCWTransform,
} from './rotateCounterclockwise'

type RotateCounterclockwiseWrapProps = {
  mode: 'exit' | 'enter'
  handoffFrames: number
  /** Required for exit — local scene length in frames. */
  sceneDuration?: number
  children: React.ReactNode
}

export const RotateCounterclockwiseWrap: React.FC<RotateCounterclockwiseWrapProps> = ({
  mode,
  handoffFrames,
  sceneDuration,
  children,
}) => {
  const frame = useCurrentFrame()

  let progress = 0
  let active = false

  if (mode === 'exit' && sceneDuration != null) {
    const start = Math.max(0, sceneDuration - handoffFrames)
    if (frame >= start) {
      active = true
      progress = interpolate(frame, [start, sceneDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      })
    }
  } else if (mode === 'enter') {
    if (frame < handoffFrames) {
      active = true
      progress = interpolate(frame, [0, handoffFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      })
    }
  }

  if (!active) {
    return <>{children}</>
  }

  const motion = mode === 'exit' ? rotateCCWExitMotion(progress) : rotateCCWEnterMotion(progress)

  return (
    <AbsoluteFill
      style={{
        transform: rotateCCWTransform(motion),
        transformOrigin: 'center center',
        opacity: motion.opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

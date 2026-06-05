/**
 * Closing portal zoom — V10 holds the zoom longer than V9.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

const PORTAL_ORIGIN = '50% 47%'
const PORTAL_EASE = Easing.out(Easing.cubic)

type ClosingZoomEnterProps = {
  children: React.ReactNode
  enterFrames?: number
}

const DEFAULT_ENTER_V10 = 28

export const ClosingZoomEnter: React.FC<ClosingZoomEnterProps> = ({
  children,
  enterFrames = DEFAULT_ENTER_V10,
}) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: PORTAL_EASE,
  })
  const scale = interpolate(p, [0, 1], [0.22, 1], { extrapolateRight: 'clamp' })
  const opacity = interpolate(p, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: PORTAL_ORIGIN,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

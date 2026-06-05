/**
 * Learning Hub enters from inside the closed pathways portal (zoom out reveal).
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

type HubZoomEnterProps = {
  children: React.ReactNode
  /** Remotion-local frames for the enter animation (unscaled sequence time). */
  enterFrames?: number
}

export const HubZoomEnter: React.FC<HubZoomEnterProps> = ({ children, enterFrames = 42 }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const scale = interpolate(p, [0, 1], [0.14, 1], { extrapolateRight: 'clamp' })
  const opacity = interpolate(frame, [0, Math.round(enterFrames * 0.35)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

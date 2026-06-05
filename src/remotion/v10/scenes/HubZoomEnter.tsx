/**
 * Learning Hub portal zoom-in — V10 uses a longer enter than V9.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

type HubZoomEnterProps = {
  children: React.ReactNode
  enterFrames?: number
}

const DEFAULT_ENTER_V10 = 84

export const HubZoomEnter: React.FC<HubZoomEnterProps> = ({
  children,
  enterFrames = DEFAULT_ENTER_V10,
}) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const scale = interpolate(p, [0, 1], [0.14, 1], { extrapolateRight: 'clamp' })
  const opacity = interpolate(frame, [0, Math.round(enterFrames * 0.45)], [0, 1], {
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

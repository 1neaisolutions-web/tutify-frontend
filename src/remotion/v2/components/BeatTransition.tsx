import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'

interface BeatTransitionProps {
  /** Total length of this beat in frames */
  beatDuration: number
  /** Frames for the opening fade-out from white (default 15) */
  fadeInFrames?: number
  /** Frames for the closing fade-in to white (default 15) */
  fadeOutFrames?: number
  /** Set to false to skip the opening fade (first beat or manual control) */
  openingFade?: boolean
  /** Set to false to skip the closing fade (last beat) */
  closingFade?: boolean
}

export const BeatTransition: React.FC<BeatTransitionProps> = ({
  beatDuration,
  fadeInFrames = 15,
  fadeOutFrames = 15,
  openingFade = true,
  closingFade = true,
}) => {
  const frame = useCurrentFrame()

  // Opening: white fades OUT (opacity 1 → 0)
  const opening = openingFade
    ? interpolate(frame, [0, fadeInFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  // Closing: white fades IN (opacity 0 → 1)
  const closing = closingFade
    ? interpolate(
        frame,
        [beatDuration - fadeOutFrames, beatDuration],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      )
    : 0

  const opacity = Math.max(opening, closing)

  if (opacity <= 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#FFFFFF',
        opacity,
        pointerEvents: 'none',
        zIndex: 200,
      }}
    />
  )
}

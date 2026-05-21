/**
 * Black closing — typewriter tagline with blinking cursor (reference finale).
 */
import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import {
  FINALE_CHAR_FRAMES,
  FINALE_TAGLINE,
  FINALE_TYPE_START,
  P4_START,
} from './constants'

type Props = { fontFamily: string }

export const ClosingFinale: React.FC<Props> = ({ fontFamily }) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [P4_START, P4_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  if (frame < P4_START) return null

  const typedFrames = Math.max(0, frame - FINALE_TYPE_START)
  const charsVisible = Math.min(
    FINALE_TAGLINE.length,
    Math.floor(typedFrames / FINALE_CHAR_FRAMES),
  )
  const visible = FINALE_TAGLINE.slice(0, charsVisible)
  const typingDone = charsVisible >= FINALE_TAGLINE.length
  const cursorBlink = Math.floor((frame - FINALE_TYPE_START) / 16) % 2 === 0

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn,
        pointerEvents: 'none',
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily,
          fontSize: 48,
          fontWeight: 400,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {visible}
        <span style={{ opacity: typingDone && !cursorBlink ? 0 : 1 }}>|</span>
      </p>
    </div>
  )
}

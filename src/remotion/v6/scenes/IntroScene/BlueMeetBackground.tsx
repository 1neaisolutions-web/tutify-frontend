/**
 * Numera-style blue gradient — overscanned so zoom/drift never reveals white edges.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

/** Edge bleed matches gradient terminus (right / bottom). */
export const MEET_BG_EDGE = '#1D4ED8'
export const MEET_BG_DEEP = '#2563EB'

export const BlueMeetBackground: React.FC = () => {
  const frame = useCurrentFrame()

  const breathe = interpolate(
    Math.sin((frame / 30) * 0.38) * 0.5 + 0.5,
    [0, 1],
    [1, 1.06],
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: MEET_BG_EDGE }}>
      {/* Solid bleed — guarantees no white sliver on right/bottom during motion */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '42%',
          background: `linear-gradient(270deg, ${MEET_BG_DEEP} 0%, ${MEET_BG_EDGE} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-12%',
          top: '-10%',
          width: '124%',
          height: '120%',
          background: `
            linear-gradient(128deg,
              #F4FAFF 0%,
              #D6EBFF 26%,
              #8FC0F5 56%,
              #3B82F6 80%,
              ${MEET_BG_DEEP} 92%,
              ${MEET_BG_EDGE} 100%)
          `,
          transform: `scale(${breathe})`,
          transformOrigin: '58% 48%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-4%',
          background: `radial-gradient(ellipse 85% 65% at 78% 72%,
            rgba(37, 99, 235, 0.5) 0%, transparent 64%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-4%',
          background: `radial-gradient(ellipse 50% 42% at 16% 20%,
            rgba(255, 255, 255, 0.72) 0%, transparent 56%)`,
        }}
      />
      {/* Soft edge vignette — hides sub-pixel gaps on any edge */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 80px 12px rgba(29, 78, 216, 0.35)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

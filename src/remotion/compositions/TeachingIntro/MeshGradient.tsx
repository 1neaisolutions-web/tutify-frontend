/**
 * Drifting mesh gradient — soft radial blobs, no hard stops.
 */
import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

const abs: React.CSSProperties = {
  position: 'absolute',
  width: '80vw',
  height: '80vh',
  filter: 'blur(120px)',
  borderRadius: '50%',
  willChange: 'transform',
}

const loop = (frame: number, fps: number, periodSec: number, phase = 0): number => {
  const period = periodSec * fps
  const t = ((frame + phase * period) % period) / period
  return interpolate(t, [0, 0.25, 0.5, 0.75, 1], [-1, 0.2, 1, -0.2, -1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

export const MeshGradient: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const crimsonX = loop(frame, fps, 10, 0) * 6 - 8
  const crimsonY = loop(frame, fps, 9, 0.15) * 5 + 18
  const orangeX = loop(frame, fps, 8, 0.35) * 7 + 28
  const orangeY = loop(frame, fps, 11, 0.5) * 6 - 4
  const indigoX = loop(frame, fps, 12, 0.7) * 8
  const indigoY = loop(frame, fps, 9.5, 0.85) * 7 + 2
  const violetX = loop(frame, fps, 8.5, 1.1) * 5 + 6
  const violetY = loop(frame, fps, 10.5, 1.25) * 6 - 22

  return (
    <AbsoluteFill style={{ background: '#120818', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: '-12%',
          transform: 'scale(1.06)',
        }}
      >
        <div
          style={{
            ...abs,
            left: '4%',
            bottom: '6%',
            background:
              'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(139, 26, 61, 0.95) 0%, rgba(139, 26, 61, 0.35) 42%, transparent 72%)',
            transform: `translate(${crimsonX}%, ${crimsonY}%)`,
          }}
        />
        <div
          style={{
            ...abs,
            right: '-6%',
            top: '18%',
            background:
              'radial-gradient(ellipse 68% 62% at 50% 50%, rgba(232, 90, 44, 0.92) 0%, rgba(232, 90, 44, 0.32) 45%, transparent 74%)',
            transform: `translate(${orangeX}%, ${orangeY}%)`,
          }}
        />
        <div
          style={{
            ...abs,
            left: '22%',
            top: '20%',
            background:
              'radial-gradient(ellipse 72% 68% at 50% 50%, rgba(30, 27, 75, 0.94) 0%, rgba(30, 27, 75, 0.38) 48%, transparent 76%)',
            transform: `translate(${indigoX}%, ${indigoY}%)`,
          }}
        />
        <div
          style={{
            ...abs,
            left: '34%',
            top: '-8%',
            background:
              'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(107, 46, 140, 0.78) 0%, rgba(107, 46, 140, 0.28) 50%, transparent 72%)',
            transform: `translate(${violetX}%, ${violetY}%)`,
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

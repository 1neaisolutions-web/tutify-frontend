/**
 * Giant Meet build → smooth zoom out + drift left into final lockup position.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import {
  HERO_M,
  HERO_E1,
  HERO_E2,
  HERO_T,
  ZOOM_START,
  ZOOM_END,
  MEET_LOCK_START,
  HERO_FONT,
  LOCKUP_SCALE,
} from './constants'

const MEET_LETTERS: { char: string; start: number }[] = [
  { char: 'M', start: HERO_M },
  { char: 'e', start: HERO_E1 },
  { char: 'e', start: HERO_E2 },
  { char: 't', start: HERO_T },
]

const LETTER_SPRING = { damping: 200, stiffness: 95, mass: 1 }
const ZOOM_SPRING = { damping: 260, stiffness: 42, mass: 1.15 }

const smooth = (p: number) =>
  interpolate(p, [0, 0.25, 0.65, 1], [0, 0.35, 0.78, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

type MeetHeroBuildProps = {
  fontFamily: string
  opacity: number
}

export const MeetHeroBuild: React.FC<MeetHeroBuildProps> = ({ fontFamily, opacity }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const heroEnd = MEET_LOCK_START + 4
  if (frame >= heroEnd) return null

  const zoomRaw =
    frame >= ZOOM_START
      ? spring({ frame: frame - ZOOM_START, fps, config: ZOOM_SPRING })
      : 0
  const zoomP = frame < ZOOM_START ? 0 : smooth(zoomRaw)

  const scale =
    frame < ZOOM_START
      ? interpolate(frame, [HERO_T + 8, ZOOM_START], [1.75, 1.85], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(zoomP, [0, 1], [1.85, LOCKUP_SCALE], { extrapolateRight: 'clamp' })

  const fadeHandoff = interpolate(frame, [heroEnd - 10, heroEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: opacity * fadeHandoff,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          fontFamily,
          fontSize: HERO_FONT,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          willChange: 'transform',
        }}
      >
        {MEET_LETTERS.map(({ char, start }, i) => {
          const isM = i === 0
          const raw =
            frame >= start ? spring({ frame: frame - start, fps, config: LETTER_SPRING }) : 0
          const p = interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })

          const fromX = isM ? 0 : interpolate(p, [0, 1], [140, 0])
          const fromY = isM ? 0 : interpolate(p, [0, 1], [100, 0])
          const blur = isM ? 0 : interpolate(p, [0, 1], [18, 0])
          const letterOpacity = frame < start ? 0 : interpolate(p, [0, 1], [0.2, 1])

          return (
            <span
              key={`${char}-${i}`}
              style={{
                display: 'inline-block',
                opacity: letterOpacity,
                transform: `translate(${fromX}px, ${fromY}px)`,
                filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
                color: isM ? '#0A1628' : `rgba(10, 22, 40, ${0.5 + p * 0.5})`,
                fontWeight: isM ? 800 : 700,
              }}
            >
              {char}
            </span>
          )
        })}
      </div>
    </div>
  )
}

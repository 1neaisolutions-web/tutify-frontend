/**
 * Giant Meet build → smooth zoom out + drift into lockup (no snappy springs on motion).
 */
import React from 'react'
import { Easing, interpolate } from 'remotion'import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import {
  HERO_M,
  HERO_E1,
  HERO_E2,
  HERO_T,
  ZOOM_START,
  MEET_LOCK_START,
  HERO_FONT,
  LOCKUP_FONT,
  LOCKUP_SCALE,
} from './constants'
import { getMeetHandoffEnd, getMeetTranslateX, MEET_HANDOFF_FADE } from './meetMotion'

const MEET_LETTERS: { char: string; start: number }[] = [
  { char: 'M', start: HERO_M },
  { char: 'e', start: HERO_E1 },
  { char: 'e', start: HERO_E2 },
  { char: 't', start: HERO_T },
]

const LETTER_IN_FRAMES = 34
const HANDOFF_BLEND_START = MEET_LOCK_START - 28

const easeOut = Easing.bezier(0.22, 0.85, 0.2, 1)
const easeInOut = Easing.bezier(0.33, 0, 0.18, 1)

type MeetHeroBuildProps = {
  fontFamily: string
  opacity: number
}

export const MeetHeroBuild: React.FC<MeetHeroBuildProps> = ({ fontFamily, opacity }) => {
  const frame = useCurrentFrame()

  const heroEnd = getMeetHandoffEnd()
  if (frame >= heroEnd) return null

  const zoomP = interpolate(frame, [ZOOM_START, MEET_LOCK_START - 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  })

  const scale =
    frame < ZOOM_START
      ? interpolate(frame, [HERO_T + 8, ZOOM_START], [1.75, 1.85], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: easeInOut,
        })
      : interpolate(zoomP, [0, 1], [1.85, LOCKUP_SCALE], { extrapolateRight: 'clamp' })

  const handoffOut = interpolate(frame, [MEET_LOCK_START, MEET_LOCK_START + MEET_HANDOFF_FADE], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  })
  const fadeHandoff = frame < MEET_LOCK_START ? 1 : handoffOut

  const meetDriftX = getMeetTranslateX(frame)
  const handoffWordBlend = interpolate(frame, [HANDOFF_BLEND_START, MEET_LOCK_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  })

  const lockupWordStyle = {
    fontFamily,
    fontSize: LOCKUP_FONT,
    fontWeight: 800 as const,
    letterSpacing: INTRO_HEADLINE.letterSpacing,
    lineHeight: INTRO_HEADLINE.lineHeight,
    color: '#0A1628',
  }

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
      {handoffWordBlend < 1 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            transform: `translateX(${meetDriftX}px) scale(${scale})`,
            transformOrigin: 'center center',
            fontFamily,
            fontSize: HERO_FONT,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            opacity: interpolate(handoffWordBlend, [0, 1], [1, 0], {
              extrapolateRight: 'clamp',
              easing: easeInOut,
            }),
            willChange: 'transform, opacity',
          }}
        >
          {MEET_LETTERS.map(({ char, start }, i) => {
            const isM = i === 0
            const p =
              frame < start
                ? 0
                : interpolate(frame, [start, start + LETTER_IN_FRAMES], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: easeOut,
                  })

            const fromX = isM ? 0 : interpolate(p, [0, 1], [28, 0], { extrapolateRight: 'clamp' })
            const fromY = isM ? 0 : interpolate(p, [0, 1], [14, 0], { extrapolateRight: 'clamp' })
            const blur = isM ? 0 : interpolate(p, [0, 1], [6, 0], { extrapolateRight: 'clamp' })
            const letterOpacity = frame < start ? 0 : interpolate(p, [0, 1], [0.35, 1])

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
      ) : null}

      {handoffWordBlend > 0 ? (
        <div
          style={{
            position: handoffWordBlend < 1 ? 'absolute' : 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${meetDriftX}px)`,
            opacity: interpolate(handoffWordBlend, [0, 1], [0, 1], {
              extrapolateRight: 'clamp',
              easing: easeInOut,
            }) * fadeHandoff,
            ...lockupWordStyle,
          }}
        >
          Meet
        </div>
      ) : null}
    </div>
  )
}

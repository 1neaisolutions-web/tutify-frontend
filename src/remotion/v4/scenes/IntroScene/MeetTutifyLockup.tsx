/**
 * Meet · Tutify (10px gap) → logo inserts with same 10px between all items.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img } from 'remotion'
import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import { LOGO_SRC } from '../../assets'
import {
  MEET_LOCK_START,
  TUTIFY_START,
  LOGO_IN,
  LOGO_PULSE_START,
  LOGO_PULSE_END,
  ACT2_START,
  LOCKUP_FONT,
  LOCKUP_GAP_PX,
  LOGO_SIZE,
} from './constants'

const SLIDE_SPRING = { damping: 230, stiffness: 68, mass: 1.05 }
const LOGO_SPRING = { damping: 175, stiffness: 105, mass: 0.92 }

const smooth = (p: number) =>
  interpolate(p, [0, 0.2, 0.75, 1], [0, 0.28, 0.82, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

type MeetTutifyLockupProps = {
  fontFamily: string
  opacity: number
}

export const MeetTutifyLockup: React.FC<MeetTutifyLockupProps> = ({ fontFamily, opacity }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (frame < MEET_LOCK_START - 4) return null

  const act1Opacity = interpolate(frame, [ACT2_START - 14, ACT2_START], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const meetOpacity = interpolate(frame, [MEET_LOCK_START - 4, MEET_LOCK_START + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const tutifyEntryRaw =
    frame >= TUTIFY_START
      ? spring({ frame: frame - TUTIFY_START, fps, config: SLIDE_SPRING })
      : 0
  const tutifyEntryP = smooth(tutifyEntryRaw)

  const tutifySlideX = interpolate(tutifyEntryP, [0, 1], [80, 0], { extrapolateRight: 'clamp' })
  const tutifyBlur = interpolate(tutifyEntryP, [0, 1], [12, 0], { extrapolateRight: 'clamp' })
  const tutifyOpacity = frame < TUTIFY_START ? 0 : tutifyEntryP

  const logoIn =
    frame >= LOGO_IN
      ? spring({ frame: frame - LOGO_IN, fps, config: LOGO_SPRING })
      : 0

  const pulseT = interpolate(
    frame,
    [LOGO_PULSE_START, LOGO_PULSE_START + 7, LOGO_PULSE_END - 6, LOGO_PULSE_END],
    [1, 1.07, 1.07, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const logoScale =
    interpolate(logoIn, [0, 1], [0.35, 1], { extrapolateRight: 'clamp' }) *
    (frame >= LOGO_PULSE_START ? pulseT : 1)

  const wordStyle = {
    fontFamily,
    fontSize: LOCKUP_FONT,
    fontWeight: 800 as const,
    letterSpacing: INTRO_HEADLINE.letterSpacing,
    lineHeight: INTRO_HEADLINE.lineHeight,
    whiteSpace: 'nowrap' as const,
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: opacity * act1Opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: LOCKUP_GAP_PX,
          ...wordStyle,
        }}
      >
        <span style={{ color: '#0A1628', opacity: meetOpacity }}>Meet</span>

        {frame >= LOGO_IN && (
          <div
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              flexShrink: 0,
              borderRadius: 26,
              overflow: 'hidden',
              opacity: interpolate(logoIn, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `scale(${logoScale})`,
              transformOrigin: 'center center',
              boxShadow:
                '0 16px 48px rgba(37, 99, 235, 0.38), 0 4px 14px rgba(0,0,0,0.14)',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d14 100%)',
            }}
          >
            <Img
              src={LOGO_SRC}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <span
          style={{
            background: 'linear-gradient(90deg, #0B2D6B 0%, #1D4ED8 45%, #2563EB 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            opacity: tutifyOpacity,
            transform: `translateX(${tutifySlideX}px)`,
            filter: tutifyBlur > 0.3 ? `blur(${tutifyBlur}px)` : undefined,
          }}
        >
          Tutify
        </span>
      </div>
    </div>
  )
}

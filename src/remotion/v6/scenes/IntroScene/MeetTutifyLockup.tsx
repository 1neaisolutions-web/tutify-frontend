/**
 * Meet · Tutify (10px gap) → logo inserts with same 10px between all items.
 */
import React from 'react'
import { Easing, useCurrentFrame, interpolate, spring, useVideoConfig, Img } from 'remotion'
import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import { LOGO_SRC } from '../../assets'
import {
  MEET_LOCK_START,
  TUTIFY_START,
  LOGO_IN,
  LOGO_PULSE_START,
  LOGO_PULSE_END,
  LOGO_EXIT_START,
  LOGO_EXIT_END,
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

  const exitP = interpolate(frame, [LOGO_EXIT_START, LOGO_EXIT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  const textExitFade = interpolate(exitP, [0, 0.32], [1, 0], { extrapolateRight: 'clamp' })

  const exitDriftX = interpolate(exitP, [0, 1], [0, 96], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  const exitDriftY = interpolate(exitP, [0, 1], [0, -72], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  /** Hero push-in on logo only (arrow corner) — reads more premium than scaling whole row */
  const logoExitZoom = interpolate(exitP, [0, 1], [1, 2.45], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
  const logoGlow = interpolate(exitP, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const act1Opacity =
    interpolate(frame, [ACT2_START - 10, ACT2_START + 4], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) * interpolate(exitP, [0, 0.85, 1], [1, 0.35, 0], { extrapolateRight: 'clamp' })

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
          transform: `translate(${exitDriftX}px, ${exitDriftY}px)`,
          willChange: 'transform',
          ...wordStyle,
        }}
      >
        <span style={{ color: '#0A1628', opacity: meetOpacity * textExitFade }}>Meet</span>

        {frame >= LOGO_IN && (
          <div
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              flexShrink: 0,
              borderRadius: 26,
              overflow: 'hidden',
              opacity: interpolate(logoIn, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `scale(${logoScale * logoExitZoom})`,
              transformOrigin: '58% 40%',
              boxShadow: `0 20px 56px rgba(37, 99, 235, ${0.42 + logoGlow * 0.25}),
                0 0 ${48 + logoGlow * 40}px rgba(96, 165, 250, ${0.35 + logoGlow * 0.35}),
                0 8px 24px rgba(0,0,0,0.12),
                0 0 0 1px rgba(255,255,255,0.08) inset`,
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
            opacity: tutifyOpacity * textExitFade,
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

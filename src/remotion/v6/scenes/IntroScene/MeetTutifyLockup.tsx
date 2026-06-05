/**
 * Meet · Tutify (10px gap) → logo inserts with same 10px between all items.
 */
import React from 'react'
import { Easing, interpolate, spring, Img } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'

import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import { LOGO_SRC } from '../../assets'
import {
  MEET_LOCK_START,
  TUTIFY_START,
  TUTIFY_SETTLE_FRAME,
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
import { getMeetHandoffEnd } from './meetMotion'

const LOGO_SPRING = { damping: 150, stiffness: 132, mass: 0.88 }
const TUTIFY_RESERVE_PX = 300
const gentleEase = Easing.bezier(0.33, 0, 0.18, 1)

const smooth = (p: number) =>
  interpolate(p, [0, 0.15, 0.7, 1], [0, 0.22, 0.78, 1], {
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

  const handoffEnd = getMeetHandoffEnd()

  if (frame < MEET_LOCK_START) return null

  const exitP = interpolate(frame, [LOGO_EXIT_START, LOGO_EXIT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: gentleEase,
  })

  const textExitFade = interpolate(exitP, [0.12, 0.88], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  const exitDriftX = interpolate(exitP, [0, 1], [0, 48], {
    extrapolateRight: 'clamp',
    easing: gentleEase,
  })
  const exitDriftY = interpolate(exitP, [0, 1], [0, -32], {
    extrapolateRight: 'clamp',
    easing: gentleEase,
  })

  const logoExitZoom = interpolate(exitP, [0, 1], [1, 1.85], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  const logoGlow = interpolate(exitP, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const act1Opacity =
    interpolate(frame, [ACT2_START - 36, ACT2_START + 18], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: gentleEase,
    }) *
    interpolate(exitP, [0, 0.55, 1], [1, 0.4, 0], {
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    })

  const meetOpacity = interpolate(frame, [MEET_LOCK_START, handoffEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: gentleEase,
  })

  const tutifyEntryP =
    frame < TUTIFY_START
      ? 0
      : interpolate(frame, [TUTIFY_START, TUTIFY_SETTLE_FRAME], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: gentleEase,
        })

  const tutifySlideX = interpolate(tutifyEntryP, [0, 1], [48, 0], { extrapolateRight: 'clamp' })
  const tutifyBlur = interpolate(tutifyEntryP, [0, 1], [8, 0], { extrapolateRight: 'clamp' })
  const tutifyOpacity = frame < TUTIFY_START ? 0 : tutifyEntryP
  const tutifySlotWidth = interpolate(tutifyEntryP, [0, 1], [0, TUTIFY_RESERVE_PX], {
    extrapolateRight: 'clamp',
  })

  const logoIn =
    frame >= LOGO_IN
      ? spring({ frame: frame - LOGO_IN, fps, config: LOGO_SPRING })
      : 0
  const logoEntryP = smooth(logoIn)
  const logoSlotWidth = interpolate(logoEntryP, [0, 1], [0, LOGO_SIZE], { extrapolateRight: 'clamp' })

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
          transform: `translate(${exitDriftX}px, ${exitDriftY}px)`,
          willChange: 'transform',
          ...wordStyle,
        }}
      >
        <span style={{ color: '#0A1628', opacity: meetOpacity * textExitFade }}>Meet</span>

        {frame >= LOGO_IN && (
          <div
            style={{
              width: logoSlotWidth,
              height: LOGO_SIZE,
              marginLeft: LOCKUP_GAP_PX,
              flexShrink: 0,
              overflow: 'hidden',
              opacity: logoSlotWidth > 4 ? interpolate(logoIn, [0, 1], [0, 1], { extrapolateRight: 'clamp' }) : 0,
            }}
          >
            <div
              style={{
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                borderRadius: 26,
                overflow: 'hidden',
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
          </div>
        )}

        {frame >= TUTIFY_START && (
          <span
            style={{
              display: 'inline-block',
              maxWidth: tutifySlotWidth,
              marginLeft: LOCKUP_GAP_PX,
              overflow: 'hidden',
              verticalAlign: 'bottom',
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
        )}
      </div>
    </div>
  )
}

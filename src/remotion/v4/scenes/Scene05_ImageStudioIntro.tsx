/**
 * Image Studio tagline beats — one line at a time, then handoff to PixGen UI demo.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { AnimatedGradientBG } from '../components/AnimatedGradientBG'
import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../../compositions/shared/introHeadlineTypography'
import { theme } from '../theme'

export const SCENE_IMAGE_STUDIO_INTRO_DURATION = 204

type BeatId = 'title' | 'tagline' | 'subtitle' | 'featureLead'

type Beat = { id: BeatId; text: string; start: number; duration: number }

const BEATS: Beat[] = [
  { id: 'title', text: 'AI IMAGE STUDIO', start: 0, duration: 50 },
  { id: 'tagline', text: 'Because the next generation learns beyond text.', start: 44, duration: 44 },
  {
    id: 'subtitle',
    text: 'Tutify helps educators transform ideas into visual learning experiences.',
    start: 82,
    duration: 50,
  },
  { id: 'featureLead', text: 'AI image generation', start: 128, duration: 40 },
]

const beatOpacity = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + 14, start + duration - 12, start + duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const beatMotion = (frame: number, start: number, fps: number) => {
  const p = spring({ frame: Math.max(0, frame - start), fps, config: theme.spring.word })
  return {
    op: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
    y: interpolate(p, [0, 1], [32, 0], { extrapolateRight: 'clamp' }),
    scale: interpolate(p, [0, 1], [0.9, 1], { extrapolateRight: 'clamp' }),
  }
}

const labelCaps: React.CSSProperties = {
  fontFamily: theme.font.display,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: theme.colors.textMuted,
}

const introCopyStyle: React.CSSProperties = {
  fontFamily: theme.font.display,
  fontSize: INTRO_HEADLINE.fontSize,
  fontWeight: INTRO_HEADLINE.fontWeight,
  letterSpacing: INTRO_HEADLINE.letterSpacing,
  lineHeight: INTRO_HEADLINE.lineHeight,
  maxWidth: INTRO_HEADLINE.maxWidth,
  padding: `0 ${INTRO_HEADLINE.paddingX}px`,
  textAlign: 'center',
}

const BeatLine: React.FC<{ beat: Beat; frame: number; fps: number; alpha: number }> = ({
  beat,
  frame,
  fps,
  alpha,
}) => {
  const m = beatMotion(frame, beat.start, fps)

  switch (beat.id) {
    case 'title':
      return (
        <div
          style={{
            opacity: alpha * m.op,
            transform: `translateY(${m.y}px) scale(${m.scale})`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: theme.font.display,
              fontSize: INTRO_HEADLINE.fontSize,
              fontWeight: 800,
              letterSpacing: '0.12em',
              background: `linear-gradient(135deg, #0F172A 0%, ${theme.colors.secondary} 45%, #059669 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {beat.text}
          </div>
          <div
            style={{
              marginTop: 20,
              height: 4,
              width: interpolate(m.op, [0, 1], [0, 240]),
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 4,
              background: `linear-gradient(90deg, transparent, ${theme.colors.secondary}, transparent)`,
            }}
          />
        </div>
      )

    case 'tagline':
      return (
        <div
          style={{
            ...introCopyStyle,
            opacity: alpha * m.op,
            transform: `translateY(${m.y}px) scale(${m.scale})`,
            fontWeight: INTRO_HEADLINE_EMPHASIS_WEIGHT,
            color: theme.colors.text,
          }}
        >
          {beat.text}
        </div>
      )

    case 'subtitle':
      return (
        <div
          style={{
            ...introCopyStyle,
            opacity: alpha * m.op,
            transform: `translateY(${m.y}px)`,
            color: theme.colors.text,
          }}
        >
          {beat.text}
        </div>
      )

    case 'featureLead':
      return (
        <div
          style={{
            opacity: alpha * m.op,
            transform: `translateY(${m.y}px) scale(${m.scale})`,
            textAlign: 'center',
          }}
        >
          <div style={{ ...labelCaps, marginBottom: 12 }}>Create</div>
          <div
            style={{
              ...introCopyStyle,
              fontWeight: INTRO_HEADLINE_EMPHASIS_WEIGHT,
              background: `linear-gradient(90deg, ${theme.colors.primary}, #7C3AED)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {beat.text}
          </div>
        </div>
      )

    default:
      return null
  }
}

export const Scene05_ImageStudioIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sceneOut = interpolate(frame, [186, SCENE_IMAGE_STUDIO_INTRO_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AnimatedGradientBG variant="cool" />
      <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          {BEATS.map((beat) => {
            const alpha = beatOpacity(frame, beat.start, beat.duration)
            if (alpha < 0.02) return null
            return (
              <AbsoluteFill
                key={beat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <BeatLine beat={beat} frame={frame} fps={fps} alpha={alpha} />
              </AbsoluteFill>
            )
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

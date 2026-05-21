/**
 * Scene — AI Teacher Assistant tagline beats (one line at a time, unique styles).
 * Plays before Scene04_AIAssistant (live generation UI).
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { AnimatedGradientBG } from '../components/AnimatedGradientBG'
import { INTRO_HEADLINE } from '../../compositions/shared/introHeadlineTypography'
import { theme } from '../theme'

export const SCENE_AI_TEACHER_INTRO_DURATION = 228

type BeatId = 'title' | 'quizzes' | 'worksheets' | 'lessonPlans' | 'activities'

type Beat = {
  id: BeatId
  text: string
  start: number
  duration: number
}

const BEATS: Beat[] = [
  { id: 'title', text: 'AI TEACHER ASSISTANT', start: 0, duration: 48 },
  { id: 'quizzes', text: 'Create quizzes,', start: 42, duration: 38 },
  { id: 'worksheets', text: 'worksheets,', start: 76, duration: 38 },
  { id: 'lessonPlans', text: 'lesson plans,', start: 110, duration: 38 },
  { id: 'activities', text: 'and classroom activities in seconds.', start: 144, duration: 46 },
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
    y: interpolate(p, [0, 1], [36, 0], { extrapolateRight: 'clamp' }),
    scale: interpolate(p, [0, 1], [0.88, 1], { extrapolateRight: 'clamp' }),
    blur: interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' }),
  }
}

const labelCaps: React.CSSProperties = {
  fontFamily: theme.font.display,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: theme.colors.textMuted,
}

const BeatLine: React.FC<{ beat: Beat; frame: number; fps: number; alpha: number }> = ({
  beat,
  frame,
  fps,
  alpha,
}) => {
  const local = frame - beat.start
  const m = beatMotion(frame, beat.start, fps)

  switch (beat.id) {
    case 'title': {
      const glow = interpolate(local, [8, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
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
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: '0.14em',
              lineHeight: 1.05,
              background: `linear-gradient(135deg, #1E1B4B 0%, ${theme.colors.primary} 55%, #7C3AED 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: glow > 0 ? `0 0 48px ${theme.colors.primaryGlow}` : undefined,
            }}
          >
            {beat.text}
          </div>
          <div
            style={{
              marginTop: 18,
              height: 4,
              width: interpolate(m.op, [0, 1], [0, 220]),
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 4,
              background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent)`,
              opacity: 0.7,
            }}
          />
        </div>
      )
    }

    case 'quizzes':
      return (
        <div
          style={{
            opacity: alpha * m.op,
            transform: `translateY(${m.y}px) scale(${m.scale})`,
            fontFamily: theme.font.display,
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#1E3A8A',
            textAlign: 'center',
          }}
        >
          {beat.text}
        </div>
      )

    case 'worksheets': {
      const x = interpolate(m.op, [0, 1], [80, 0], { extrapolateRight: 'clamp' })
      return (
        <div
          style={{
            opacity: alpha * m.op,
            transform: `translateX(${x}px) translateY(${m.y * 0.5}px)`,
            fontFamily: theme.font.display,
            fontSize: 92,
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${theme.colors.secondary} 0%, #059669 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
          }}
        >
          {beat.text}
        </div>
      )
    }

    case 'lessonPlans': {
      return (
        <div
          style={{
            opacity: alpha * m.op,
            transform: `translateY(${m.y}px) scale(${m.scale})`,
            filter: m.blur > 0.3 ? `blur(${m.blur}px)` : undefined,
            fontFamily: theme.font.display,
            fontSize: 90,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: theme.colors.accent,
            textAlign: 'center',
            textShadow: '0 8px 32px rgba(232,128,58,0.25)',
          }}
        >
          {beat.text}
        </div>
      )
    }

    case 'activities': {
      const words = beat.text.split(' ')
      const lastIdx = words.length - 1
      return (
        <div
          style={{
            opacity: alpha,
            textAlign: 'center',
            maxWidth: INTRO_HEADLINE.maxWidth,
            lineHeight: INTRO_HEADLINE.lineHeight,
            fontFamily: theme.font.display,
            fontSize: INTRO_HEADLINE.fontSize,
            fontWeight: INTRO_HEADLINE.fontWeight,
            letterSpacing: INTRO_HEADLINE.letterSpacing,
            color: theme.colors.text,
            padding: `0 ${INTRO_HEADLINE.paddingX}px`,
          }}
        >
          {words.map((word, i) => {
            const wp = spring({ frame: Math.max(0, local - i * 4), fps, config: theme.spring.zoom })
            const wop = interpolate(wp, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
            const ws = interpolate(wp, [0, 1], [0.82, 1], { extrapolateRight: 'clamp' })
            const isSeconds = i === lastIdx
            return (
              <React.Fragment key={`${word}-${i}`}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: wop,
                    transform: `scale(${ws})`,
                    transformOrigin: 'center bottom',
                    fontSize: INTRO_HEADLINE.fontSize,
                    fontWeight: isSeconds ? 800 : INTRO_HEADLINE.fontWeight,
                    color: isSeconds ? theme.colors.primary : theme.colors.text,
                  }}
                >
                  {word}
                </span>
                {i < lastIdx ? ' ' : null}
              </React.Fragment>
            )
          })}
        </div>
      )
    }

    default:
      return null
  }
}

export const Scene04_AITeacherIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sceneOut = interpolate(frame, [210, SCENE_AI_TEACHER_INTRO_DURATION], [1, 0], {
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

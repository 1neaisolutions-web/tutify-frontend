/**
 * YouTube Fun Studio — title + tagline, then handoff to quiz UI demo.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { AnimatedGradientBG } from '../components/AnimatedGradientBG'
import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../../compositions/shared/introHeadlineTypography'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'

export const SCENE_YOUTUBE_STUDIO_INTRO_DURATION = 100

type BeatId = 'title' | 'tagline'

type Beat = { id: BeatId; text: string; start: number; duration: number }

const BEATS: Beat[] = [
  { id: 'title', text: 'YOUTUBE FUN STUDIO', start: 0, duration: 48 },
  { id: 'tagline', text: 'Turn everyday videos into meaningful learning.', start: 42, duration: 42 },
]

const beatOpacity = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + 14, start + duration - 12, start + duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

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

const beatMotion = (frame: number, start: number, fps: number) => {
  const p = spring({ frame: Math.max(0, frame - start), fps, config: theme.spring.word })
  return {
    op: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
    y: interpolate(p, [0, 1], [32, 0], { extrapolateRight: 'clamp' }),
    scale: interpolate(p, [0, 1], [0.9, 1], { extrapolateRight: 'clamp' }),
  }
}

const BeatLine: React.FC<{ beat: Beat; frame: number; fps: number; alpha: number }> = ({
  beat,
  frame,
  fps,
  alpha,
}) => {
  const m = beatMotion(frame, beat.start, fps)

  if (beat.id === 'title') {
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
            letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, #1F2937 0%, #EF4444 45%, #F97316 100%)',
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
            width: interpolate(m.op, [0, 1], [0, 260]),
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 4,
            background: 'linear-gradient(90deg, transparent, #EF4444, transparent)',
          }}
        />
      </div>
    )
  }

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
}

export const Scene06_YouTubeStudioIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fg = sceneMaster(frame, SCENE_YOUTUBE_STUDIO_INTRO_DURATION)

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AnimatedGradientBG variant="warm" />
      <AbsoluteFill style={{ opacity: fg }}>
        {BEATS.map((beat) => {
          const alpha = beatOpacity(frame, beat.start, beat.duration)
          if (alpha < 0.02) return null
          return (
            <AbsoluteFill
              key={beat.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
              <BeatLine beat={beat} frame={frame} fps={fps} alpha={alpha} />
            </AbsoluteFill>
          )
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

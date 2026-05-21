import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

type AnimMode = 'fade-up' | 'blur-in' | 'word-reveal' | 'char-reveal' | 'scale-in'

interface KineticTextProps {
  text: string
  mode?: AnimMode
  startFrame?: number
  fontSize?: number
  fontFamily?: string
  color?: string
  fontWeight?: number | string
  letterSpacing?: string
  textAlign?: React.CSSProperties['textAlign']
  stagger?: number
  style?: React.CSSProperties
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  mode = 'fade-up',
  startFrame = 0,
  fontSize = 64,
  fontFamily = '"Sora", "Inter", sans-serif',
  color = '#F8FAFC',
  fontWeight = 700,
  letterSpacing = '-0.02em',
  textAlign = 'left',
  stagger = 4,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)

  if (mode === 'fade-up') {
    const p = spring({ frame: f, fps, config: { damping: 100, stiffness: 280, mass: 1 } })
    const opacity = interpolate(p, [0, 1], [0, 1])
    const translateY = interpolate(p, [0, 1], [36, 0])
    return (
      <div style={{ fontSize, fontFamily, color, fontWeight, letterSpacing, textAlign, opacity, transform: `translateY(${translateY}px)`, ...style }}>
        {text}
      </div>
    )
  }

  if (mode === 'blur-in') {
    const p = spring({ frame: f, fps, config: { damping: 100, stiffness: 200, mass: 1 } })
    const opacity = interpolate(p, [0, 1], [0, 1])
    const blur = interpolate(p, [0, 1], [14, 0])
    const scale = interpolate(p, [0, 1], [0.96, 1])
    return (
      <div style={{ fontSize, fontFamily, color, fontWeight, letterSpacing, textAlign, opacity, filter: `blur(${blur}px)`, transform: `scale(${scale})`, ...style }}>
        {text}
      </div>
    )
  }

  if (mode === 'word-reveal') {
    const words = text.split(' ')
    return (
      <div style={{ fontSize, fontFamily, color, fontWeight, letterSpacing, textAlign, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const op = interpolate(wf, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const ty = interpolate(wf, [0, 18], [22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <span key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, display: 'inline-block' }}>{word}</span>
          )
        })}
      </div>
    )
  }

  if (mode === 'char-reveal') {
    const chars = text.split('')
    return (
      <div style={{ fontSize, fontFamily, color, fontWeight, letterSpacing, textAlign, display: 'flex', flexWrap: 'wrap', ...style }}>
        {chars.map((char, i) => {
          const cf = Math.max(0, f - i * stagger)
          const op = interpolate(cf, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const ty = interpolate(cf, [0, 12], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <span key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>{char}</span>
          )
        })}
      </div>
    )
  }

  if (mode === 'scale-in') {
    const p = spring({ frame: f, fps, config: { damping: 80, stiffness: 300, mass: 1 } })
    const opacity = interpolate(p, [0, 1], [0, 1])
    const scale = interpolate(p, [0, 1], [0.65, 1])
    return (
      <div style={{ fontSize, fontFamily, color, fontWeight, letterSpacing, textAlign, opacity, transform: `scale(${scale})`, ...style }}>
        {text}
      </div>
    )
  }

  return <div style={{ fontSize, fontFamily, color, fontWeight, letterSpacing, textAlign, ...style }}>{text}</div>
}

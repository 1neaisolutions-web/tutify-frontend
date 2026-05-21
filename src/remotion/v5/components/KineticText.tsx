/**
 * KineticText V5 — Extended text animation toolkit.
 * New modes: 'char-up', 'gradient-word', 'mask-reveal', 'blur-word'
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { theme } from '../theme'

type AnimMode =
  | 'fade-up'
  | 'blur-in'
  | 'word-reveal'
  | 'spring-word'
  | 'zoom-word'
  | 'char-reveal'
  | 'scale-in'
  | 'slide-right'
  | 'blur-word'
  | 'gradient-word'
  | 'cinematic'

interface KineticTextProps {
  text: string
  mode?: AnimMode
  startFrame?: number
  fontSize?: number
  fontFamily?: string
  color?: string
  gradient?: string
  fontWeight?: number | string
  letterSpacing?: string
  lineHeight?: number
  textAlign?: React.CSSProperties['textAlign']
  stagger?: number
  style?: React.CSSProperties
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  mode = 'spring-word',
  startFrame = 0,
  fontSize = 64,
  fontFamily = theme.font.display,
  color = theme.colors.text,
  gradient,
  fontWeight = 700,
  letterSpacing = '-0.02em',
  lineHeight = 1.2,
  textAlign = 'left',
  stagger = 3,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)

  const baseStyle: React.CSSProperties = {
    fontSize, fontFamily, fontWeight, letterSpacing, lineHeight, textAlign,
  }

  if (mode === 'spring-word') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: theme.spring.word })
          return (
            <span key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [28, 0])}px) scale(${interpolate(p, [0, 1], [0.84, 1])})`,
              display: 'inline-block',
              transformOrigin: 'bottom center',
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // V5 new: blur word — each word de-blurs in with spring
  if (mode === 'blur-word') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: theme.spring.snappy })
          const op = interpolate(p, [0, 1], [0, 1])
          const blur = interpolate(p, [0, 1], [16, 0])
          const ty = interpolate(p, [0, 1], [16, 0])
          return (
            <span key={i} style={{
              opacity: op,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              transform: `translateY(${ty}px)`,
              display: 'inline-block',
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // V5 new: cinematic — large scale drop + blur de-haze
  if (mode === 'cinematic') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, display: 'flex', flexWrap: 'wrap', gap: '0.3em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: theme.spring.dramatic })
          const op = interpolate(p, [0, 1], [0, 1])
          const sc = interpolate(p, [0, 1], [1.18, 1])
          const blur = interpolate(p, [0, 1], [8, 0])
          const isGrad = gradient && i === words.length - 1
          return (
            <span key={i} style={{
              opacity: op,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              transform: `scale(${sc})`,
              display: 'inline-block',
              transformOrigin: 'center center',
              ...(isGrad ? {
                background: gradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              } : { color }),
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // V5 new: gradient-word — last word renders with gradient
  if (mode === 'gradient-word') {
    const words = text.split(' ')
    const lastGradient = gradient ?? theme.colors.gradientBrand
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: theme.spring.word })
          const isLast = i === words.length - 1
          return (
            <span key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
              display: 'inline-block',
              transformOrigin: 'bottom center',
              ...(isLast ? {
                background: lastGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              } : {}),
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  if (mode === 'zoom-word') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: { damping: 70, stiffness: 260, mass: 1 } })
          return (
            <span key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.50, 1.02])})`,
              display: 'inline-block',
              transformOrigin: 'bottom center',
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  if (mode === 'word-reveal') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const op = interpolate(wf, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const ty = interpolate(wf, [0, 16], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <span key={i} style={{
              opacity: op,
              transform: `translateY(${ty}px)`,
              display: 'inline-block',
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  if (mode === 'fade-up') {
    const p = spring({ frame: f, fps, config: { damping: 100, stiffness: 280, mass: 1 } })
    return (
      <div style={{ ...baseStyle, color, opacity: interpolate(p, [0, 1], [0, 1]), transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`, ...style }}>
        {text}
      </div>
    )
  }

  if (mode === 'blur-in') {
    const p = spring({ frame: f, fps, config: { damping: 100, stiffness: 200, mass: 1 } })
    const blur = interpolate(p, [0, 1], [16, 0])
    return (
      <div style={{ ...baseStyle, color, opacity: interpolate(p, [0, 1], [0, 1]), filter: blur > 0.3 ? `blur(${blur}px)` : undefined, transform: `scale(${interpolate(p, [0, 1], [0.96, 1])})`, ...style }}>
        {text}
      </div>
    )
  }

  if (mode === 'scale-in') {
    const p = spring({ frame: f, fps, config: { damping: 80, stiffness: 300, mass: 1 } })
    return (
      <div style={{ ...baseStyle, color, opacity: interpolate(p, [0, 1], [0, 1]), transform: `scale(${interpolate(p, [0, 1], [0.55, 1])})`, transformOrigin: 'center', ...style }}>
        {text}
      </div>
    )
  }

  if (mode === 'char-reveal') {
    const chars = text.split('')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', ...style }}>
        {chars.map((char, i) => {
          const cf = Math.max(0, f - i * stagger)
          const op = interpolate(cf, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const ty = interpolate(cf, [0, 12], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <span key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
              {char}
            </span>
          )
        })}
      </div>
    )
  }

  if (mode === 'slide-right') {
    const p = spring({ frame: f, fps, config: { damping: 120, stiffness: 220, mass: 1 } })
    return (
      <div style={{ ...baseStyle, color, opacity: interpolate(p, [0, 1], [0, 1]), transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px)`, ...style }}>
        {text}
      </div>
    )
  }

  return <div style={{ ...baseStyle, color, ...style }}>{text}</div>
}

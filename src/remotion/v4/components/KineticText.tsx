/**
 * KineticText — Enhanced text animation component.
 * 'spring-word' and 'zoom-word' modes added for reference-video quality.
 * All modes work on both dark and light backgrounds.
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

interface KineticTextProps {
  text: string
  mode?: AnimMode
  startFrame?: number
  fontSize?: number
  fontFamily?: string
  color?: string
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

  // ── SPRING WORD — premium word-by-word with scale + translate + spring ──
  if (mode === 'spring-word') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: theme.spring.word })
          const op    = interpolate(p, [0, 1], [0, 1])
          const scale = interpolate(p, [0, 1], [0.82, 1])
          const ty    = interpolate(p, [0, 1], [24, 0])
          return (
            <span key={i} style={{
              opacity: op,
              transform: `translateY(${ty}px) scale(${scale})`,
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

  // ── ZOOM WORD — dramatic zoom + spring per word ─────────────────────────
  if (mode === 'zoom-word') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const p = spring({ frame: wf, fps, config: { damping: 70, stiffness: 260, mass: 1 } })
          const op    = interpolate(p, [0, 1], [0, 1])
          const scale = interpolate(p, [0, 1], [0.50, 1.02])
          const ty    = interpolate(p, [0, 1], [30, 0])
          return (
            <span key={i} style={{
              opacity: op,
              transform: `translateY(${ty}px) scale(${scale})`,
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

  // ── WORD REVEAL — simpler word-by-word (legacy compat) ──────────────────
  if (mode === 'word-reveal') {
    const words = text.split(' ')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * stagger)
          const op = interpolate(wf, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const ty = interpolate(wf, [0, 16], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const sc = interpolate(wf, [0, 16], [0.88, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <span key={i} style={{
              opacity: op,
              transform: `translateY(${ty}px) scale(${sc})`,
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

  // ── FADE UP ─────────────────────────────────────────────────────────────
  if (mode === 'fade-up') {
    const p  = spring({ frame: f, fps, config: { damping: 100, stiffness: 280, mass: 1 } })
    const op = interpolate(p, [0, 1], [0, 1])
    const ty = interpolate(p, [0, 1], [36, 0])
    const sc = interpolate(p, [0, 1], [0.94, 1])
    return (
      <div style={{ ...baseStyle, color, opacity: op, transform: `translateY(${ty}px) scale(${sc})`, ...style }}>
        {text}
      </div>
    )
  }

  // ── BLUR IN ─────────────────────────────────────────────────────────────
  if (mode === 'blur-in') {
    const p    = spring({ frame: f, fps, config: { damping: 100, stiffness: 200, mass: 1 } })
    const op   = interpolate(p, [0, 1], [0, 1])
    const blur = interpolate(p, [0, 1], [14, 0])
    const sc   = interpolate(p, [0, 1], [0.96, 1])
    return (
      <div style={{ ...baseStyle, color, opacity: op, filter: `blur(${blur}px)`, transform: `scale(${sc})`, ...style }}>
        {text}
      </div>
    )
  }

  // ── CHAR REVEAL ─────────────────────────────────────────────────────────
  if (mode === 'char-reveal') {
    const chars = text.split('')
    return (
      <div style={{ ...baseStyle, color, display: 'flex', flexWrap: 'wrap', ...style }}>
        {chars.map((char, i) => {
          const cf = Math.max(0, f - i * stagger)
          const op = interpolate(cf, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const ty = interpolate(cf, [0, 12], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <span key={i} style={{
              opacity: op,
              transform: `translateY(${ty}px)`,
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}>
              {char}
            </span>
          )
        })}
      </div>
    )
  }

  // ── SCALE IN ────────────────────────────────────────────────────────────
  if (mode === 'scale-in') {
    const p  = spring({ frame: f, fps, config: { damping: 80, stiffness: 300, mass: 1 } })
    const op = interpolate(p, [0, 1], [0, 1])
    const sc = interpolate(p, [0, 1], [0.55, 1])
    return (
      <div style={{ ...baseStyle, color, opacity: op, transform: `scale(${sc})`, transformOrigin: 'center', ...style }}>
        {text}
      </div>
    )
  }

  // ── SLIDE RIGHT ─────────────────────────────────────────────────────────
  if (mode === 'slide-right') {
    const p  = spring({ frame: f, fps, config: { damping: 120, stiffness: 220, mass: 1 } })
    const op = interpolate(p, [0, 1], [0, 1])
    const tx = interpolate(p, [0, 1], [-60, 0])
    return (
      <div style={{ ...baseStyle, color, opacity: op, transform: `translateX(${tx}px)`, ...style }}>
        {text}
      </div>
    )
  }

  return <div style={{ ...baseStyle, color, ...style }}>{text}</div>
}

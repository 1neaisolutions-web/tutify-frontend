/**
 * CinematicBG — V5 premium animated background.
 *
 * 'dark'  : deep midnight navy with electric-blue/violet glows (opening, closing)
 * 'light' : crisp off-white with very subtle blue-lavender depth blobs (feature scenes)
 * 'dawn'  : transitional warm sunrise (vision scene)
 * 'deep'  : saturated indigo (Meet Tutify reveal)
 *
 * Each variant has 5 depth blobs + diagonal shimmer for living, cinematic feel.
 */
import React from 'react'
import { useCurrentFrame } from 'remotion'

export type CinematicVariant = 'dark' | 'light' | 'dawn' | 'deep' | 'neutral'

interface CinematicBGProps {
  variant?: CinematicVariant
  timeFrame?: number
  intensity?: number  // 0–1 multiplier for blob opacity
}

export const CinematicBG: React.FC<CinematicBGProps> = ({
  variant = 'light',
  timeFrame,
  intensity = 1,
}) => {
  const localFrame = useCurrentFrame()
  const frame = timeFrame ?? localFrame
  const t = frame * 0.016

  // Independent blob oscillators — never in sync
  const b1x = 32 + Math.sin(t * 0.65 + 0.00) * 22
  const b1y = 22 + Math.cos(t * 0.50 + 0.00) * 18
  const b1w = 70 + Math.sin(t * 0.88 + 1.00) * 9
  const b1h = 60 + Math.cos(t * 0.72 + 0.40) * 7
  const b1o = (0.78 + Math.sin(t * 1.05 + 0.50) * 0.08) * intensity

  const b2x = 80 + Math.sin(t * 0.40 + 1.57) * 16
  const b2y = 25 + Math.cos(t * 0.76 + 0.90) * 22
  const b2w = 58 + Math.sin(t * 0.60 + 2.00) * 7
  const b2h = 52 + Math.cos(t * 0.48 + 1.30) * 6
  const b2o = (0.80 + Math.sin(t * 0.75 + 2.10) * 0.07) * intensity

  const b3x = 18 + Math.sin(t * 0.55 + 3.14) * 14
  const b3y = 72 + Math.cos(t * 0.44 + 2.10) * 16
  const b3w = 54 + Math.sin(t * 0.80 + 0.50) * 8
  const b3h = 48 + Math.cos(t * 0.63 + 3.20) * 7
  const b3o = (0.60 + Math.sin(t * 0.90 + 1.80) * 0.06) * intensity

  const b4x = 68 + Math.sin(t * 0.47 + 4.50) * 18
  const b4y = 78 + Math.cos(t * 0.36 + 3.60) * 14
  const b4w = 48 + Math.sin(t * 0.68 + 3.00) * 6
  const b4h = 44 + Math.cos(t * 0.57 + 2.70) * 5
  const b4o = (0.65 + Math.sin(t * 1.15 + 3.40) * 0.06) * intensity

  const b5x = 50 + Math.sin(t * 0.30 + 2.00) * 12
  const b5y = 50 + Math.cos(t * 0.26 + 1.50) * 10
  const b5w = 42 + Math.sin(t * 0.52 + 4.00) * 5
  const b5h = 38 + Math.cos(t * 0.45 + 0.80) * 4
  const b5o = (0.44 + Math.sin(t * 0.68 + 0.20) * 0.07) * intensity

  const shimPos = Math.sin(t * 0.17) * 0.5 + 0.5
  const shimX = -25 + shimPos * 150

  const abs: React.CSSProperties = { position: 'absolute', inset: 0 }

  type Blob = { x: number; y: number; w: number; h: number; o: number; color: string }
  type Palette = {
    base: string
    blobs: Blob[]
    shimmer: string
    vignette?: string
  }

  const palettes: Record<CinematicVariant, Palette> = {
    dark: {
      base: '#070A18',
      blobs: [
        { x: b1x, y: b1y, w: b1w, h: b1h, o: b1o, color: `rgba(79,110,247,${b1o.toFixed(3)})` },
        { x: b2x, y: b2y, w: b2w, h: b2h, o: b2o, color: `rgba(20,15,60,${b2o.toFixed(3)})` },
        { x: b3x, y: b3y, w: b3w, h: b3h, o: b3o, color: `rgba(123,92,245,${b3o.toFixed(3)})` },
        { x: b4x, y: b4y, w: b4w, h: b4h, o: b4o, color: `rgba(10,20,80,${b4o.toFixed(3)})` },
        { x: b5x, y: b5y, w: b5w, h: b5h, o: b5o, color: `rgba(45,55,160,${b5o.toFixed(3)})` },
      ],
      shimmer: 'rgba(79,110,247,0.07)',
      vignette: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(4,5,14,0.55) 100%)',
    },
    deep: {
      base: '#0E1535',
      blobs: [
        { x: b1x, y: b1y, w: b1w, h: b1h, o: b1o, color: `rgba(79,110,247,${(b1o * 0.85).toFixed(3)})` },
        { x: b2x, y: b2y, w: b2w, h: b2h, o: b2o, color: `rgba(140,110,255,${(b2o * 0.5).toFixed(3)})` },
        { x: b3x, y: b3y, w: b3w, h: b3h, o: b3o, color: `rgba(50,30,150,${(b3o * 0.6).toFixed(3)})` },
        { x: b4x, y: b4y, w: b4w, h: b4h, o: b4o, color: `rgba(26,48,184,${(b4o * 0.7).toFixed(3)})` },
        { x: b5x, y: b5y, w: b5w, h: b5h, o: b5o, color: `rgba(100,120,220,${(b5o * 0.5).toFixed(3)})` },
      ],
      shimmer: 'rgba(120,140,255,0.08)',
      vignette: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 45%, rgba(7,10,24,0.40) 100%)',
    },
    dawn: {
      base: '#1A1060',
      blobs: [
        { x: b1x, y: b1y, w: b1w, h: b1h, o: b1o, color: `rgba(79,110,247,${(b1o * 0.6).toFixed(3)})` },
        { x: b2x, y: b2y, w: b2w, h: b2h, o: b2o, color: `rgba(245,166,35,${(b2o * 0.55).toFixed(3)})` },
        { x: b3x, y: b3y, w: b3w, h: b3h, o: b3o, color: `rgba(255,200,100,${(b3o * 0.45).toFixed(3)})` },
        { x: b4x, y: b4y, w: b4w, h: b4h, o: b4o, color: `rgba(180,140,255,${(b4o * 0.55).toFixed(3)})` },
        { x: b5x, y: b5y, w: b5w, h: b5h, o: b5o, color: `rgba(100,90,200,${(b5o * 0.5).toFixed(3)})` },
      ],
      shimmer: 'rgba(255,200,120,0.09)',
    },
    light: {
      base: '#F7F9FF',
      blobs: [
        { x: b1x, y: b1y, w: b1w + 10, h: b1h + 8, o: b1o * 0.22, color: `rgba(148,162,245,${(b1o * 0.22).toFixed(3)})` },
        { x: b2x, y: b2y, w: b2w + 8, h: b2h + 6, o: b2o * 0.18, color: `rgba(220,215,255,${(b2o * 0.18).toFixed(3)})` },
        { x: b3x, y: b3y, w: b3w + 6, h: b3h + 5, o: b3o * 0.14, color: `rgba(255,255,255,${(b3o * 0.14).toFixed(3)})` },
        { x: b4x, y: b4y, w: b4w + 5, h: b4h + 4, o: b4o * 0.16, color: `rgba(200,210,255,${(b4o * 0.16).toFixed(3)})` },
        { x: b5x, y: b5y, w: b5w + 4, h: b5h + 3, o: b5o * 0.12, color: `rgba(230,228,255,${(b5o * 0.12).toFixed(3)})` },
      ],
      shimmer: 'rgba(255,255,255,0.50)',
    },
    neutral: {
      base: '#EEF1FB',
      blobs: [
        { x: b1x, y: b1y, w: b1w, h: b1h, o: b1o * 0.28, color: `rgba(130,148,230,${(b1o * 0.28).toFixed(3)})` },
        { x: b2x, y: b2y, w: b2w, h: b2h, o: b2o * 0.22, color: `rgba(210,200,240,${(b2o * 0.22).toFixed(3)})` },
        { x: b3x, y: b3y, w: b3w, h: b3h, o: b3o * 0.18, color: `rgba(255,255,255,${(b3o * 0.18).toFixed(3)})` },
        { x: b4x, y: b4y, w: b4w, h: b4h, o: b4o * 0.20, color: `rgba(180,172,230,${(b4o * 0.20).toFixed(3)})` },
        { x: b5x, y: b5y, w: b5w, h: b5h, o: b5o * 0.16, color: `rgba(200,196,240,${(b5o * 0.16).toFixed(3)})` },
      ],
      shimmer: 'rgba(255,255,255,0.35)',
    },
  }

  const pal = palettes[variant]

  return (
    <>
      <div style={{ ...abs, background: pal.base }} />
      {pal.blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            ...abs,
            background: `radial-gradient(ellipse ${blob.w}% ${blob.h}% at ${blob.x}% ${blob.y}%, ${blob.color} 0%, transparent 70%)`,
            mixBlendMode: i === 2 ? 'screen' : 'normal',
          }}
        />
      ))}
      <div
        style={{
          ...abs,
          background: `linear-gradient(115deg, transparent ${shimX - 16}%, ${pal.shimmer} ${shimX}%, transparent ${shimX + 16}%)`,
          pointerEvents: 'none',
        }}
      />
      {pal.vignette && (
        <div style={{ ...abs, background: pal.vignette, pointerEvents: 'none' }} />
      )}
    </>
  )
}

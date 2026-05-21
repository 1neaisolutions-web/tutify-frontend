/**
 * AnimatedGradientBG — Living mesh-gradient background.
 *
 * Movement design:
 *   • t = frame * 0.018  → ~1 full oscillation per 11 s (clearly visible, never jarring)
 *   • 5 overlapping blobs, each on a unique phase + frequency so they NEVER sync
 *   • Each blob breathes (size ±10 %) and pulses opacity (±0.07) independently
 *   • A slow diagonal shimmer sweeps the full canvas every ~35 s
 *   • mix-blend-mode: screen on highlight blobs adds depth without over-saturation
 */
import React from 'react'
import { useCurrentFrame } from 'remotion'
import { theme } from '../theme'

type Variant = 'cool' | 'warm' | 'deep' | 'dawn'

interface AnimatedGradientBGProps {
  variant?: Variant
  overlayOpacity?: number
  /** Composition-global frame — keeps blob phase continuous across <Sequence> scenes */
  timeFrame?: number
}

export const AnimatedGradientBG: React.FC<AnimatedGradientBGProps> = ({
  variant = 'cool',
  overlayOpacity = 0,
  timeFrame,
}) => {
  const localFrame = useCurrentFrame()
  const frame = timeFrame ?? localFrame

  // Primary time — 1 full slow oscillation ≈ 11 s.  Fast enough to feel alive.
  const t = frame * 0.018

  // ── Blob positions (% of canvas) ──────────────────────────────────────────
  // Each blob uses different frequency + phase to avoid synchronised movement.

  const b1x = 35 + Math.sin(t * 0.70 + 0.00) * 26
  const b1y = 24 + Math.cos(t * 0.53 + 0.00) * 20
  const b1w = 72 + Math.sin(t * 0.90 + 1.00) * 10   // breathing width
  const b1h = 64 + Math.cos(t * 0.75 + 0.40) * 8    // breathing height
  const b1o = 0.80 + Math.sin(t * 1.10 + 0.50) * 0.07   // opacity pulse

  const b2x = 78 + Math.sin(t * 0.43 + 1.57) * 18
  const b2y = 28 + Math.cos(t * 0.80 + 0.90) * 24
  const b2w = 60 + Math.sin(t * 0.62 + 2.00) * 8
  const b2h = 56 + Math.cos(t * 0.50 + 1.30) * 7
  const b2o = 0.82 + Math.sin(t * 0.80 + 2.10) * 0.07

  const b3x = 20 + Math.sin(t * 0.58 + 3.14) * 16
  const b3y = 70 + Math.cos(t * 0.47 + 2.10) * 18
  const b3w = 56 + Math.sin(t * 0.84 + 0.50) * 9
  const b3h = 50 + Math.cos(t * 0.66 + 3.20) * 8
  const b3o = 0.62 + Math.sin(t * 0.95 + 1.80) * 0.06

  const b4x = 65 + Math.sin(t * 0.50 + 4.50) * 20
  const b4y = 76 + Math.cos(t * 0.38 + 3.60) * 16
  const b4w = 50 + Math.sin(t * 0.72 + 3.00) * 7
  const b4h = 46 + Math.cos(t * 0.60 + 2.70) * 6
  const b4o = 0.66 + Math.sin(t * 1.20 + 3.40) * 0.06

  // Centre mid-tone blob — anchors the composition, drifts slowly
  const b5x = 50 + Math.sin(t * 0.32 + 2.00) * 14
  const b5y = 48 + Math.cos(t * 0.28 + 1.50) * 12
  const b5w = 44 + Math.sin(t * 0.55 + 4.00) * 6
  const b5h = 40 + Math.cos(t * 0.48 + 0.80) * 5
  const b5o = 0.45 + Math.sin(t * 0.70 + 0.20) * 0.08

  // ── Diagonal shimmer — one slow sweep every ~35 s ─────────────────────────
  // pos goes 0 → 1 with a sine so it eases in and out at each end.
  const shimPos = (Math.sin(t * 0.18) * 0.5 + 0.5)   // 0..1
  const shimX   = -30 + shimPos * 160                  // -30% … 130% across canvas

  // ── Palettes ───────────────────────────────────────────────────────────────
  type Palette = {
    base: string
    b1: string; b2: string; b3: string; b4: string; b5: string
    shimmer: string
  }

  const palettes: Record<Variant, Palette> = {
    cool: {
      base:    '#BDC3E8',
      b1:      `rgba(148,155,220,VAR_B1O)`,
      b2:      `rgba(242,232,212,VAR_B2O)`,
      b3:      `rgba(255,255,255,VAR_B3O)`,
      b4:      `rgba(190,180,240,VAR_B4O)`,
      b5:      `rgba(170,162,230,VAR_B5O)`,
      shimmer: 'rgba(255,255,255,0.13)',
    },
    warm: {
      base:    '#D5CCE6',
      b1:      `rgba(230,215,240,VAR_B1O)`,
      b2:      `rgba(252,240,218,VAR_B2O)`,
      b3:      `rgba(255,255,255,VAR_B3O)`,
      b4:      `rgba(212,198,246,VAR_B4O)`,
      b5:      `rgba(220,208,240,VAR_B5O)`,
      shimmer: 'rgba(255,255,255,0.15)',
    },
    deep: {
      base:    '#A6ACE0',
      b1:      `rgba(120,132,218,VAR_B1O)`,
      b2:      `rgba(240,228,205,VAR_B2O)`,
      b3:      `rgba(255,255,255,VAR_B3O)`,
      b4:      `rgba(172,165,238,VAR_B4O)`,
      b5:      `rgba(140,148,228,VAR_B5O)`,
      shimmer: 'rgba(255,255,255,0.11)',
    },
    dawn: {
      base:    '#C6C0E8',
      b1:      `rgba(200,195,245,VAR_B1O)`,
      b2:      `rgba(254,240,212,VAR_B2O)`,
      b3:      `rgba(255,255,255,VAR_B3O)`,
      b4:      `rgba(246,188,152,VAR_B4O)`,
      b5:      `rgba(220,215,248,VAR_B5O)`,
      shimmer: 'rgba(255,255,255,0.14)',
    },
  }

  const raw = palettes[variant]
  // Inject computed opacities into the colour strings
  const fill = (s: string, op: number) =>
    s.replace('VAR_B1O', String(b1o))
     .replace('VAR_B2O', String(b2o))
     .replace('VAR_B3O', String(b3o))
     .replace('VAR_B4O', String(b4o))
     .replace('VAR_B5O', String(b5o))
     .replace(/VAR_B\dO/, String(op))  // fallback

  const p = {
    base:    raw.base,
    b1:      raw.b1.replace('VAR_B1O', b1o.toFixed(3)),
    b2:      raw.b2.replace('VAR_B2O', b2o.toFixed(3)),
    b3:      raw.b3.replace('VAR_B3O', b3o.toFixed(3)),
    b4:      raw.b4.replace('VAR_B4O', b4o.toFixed(3)),
    b5:      raw.b5.replace('VAR_B5O', b5o.toFixed(3)),
    shimmer: raw.shimmer,
  }

  const abs: React.CSSProperties = { position: 'absolute', inset: 0 }

  return (
    <>
      {/* ── 1. Base flat colour ──────────────────────────────────────────── */}
      <div style={{ ...abs, background: p.base }} />

      {/* ── 2. Blob 1 — primary hue, top-left quadrant ──────────────────── */}
      <div style={{
        ...abs,
        background: `radial-gradient(ellipse ${b1w}% ${b1h}% at ${b1x}% ${b1y}%, ${p.b1} 0%, transparent 70%)`,
      }} />

      {/* ── 3. Blob 2 — warm cream, top-right ───────────────────────────── */}
      <div style={{
        ...abs,
        background: `radial-gradient(ellipse ${b2w}% ${b2h}% at ${b2x}% ${b2y}%, ${p.b2} 0%, transparent 68%)`,
      }} />

      {/* ── 4. Blob 3 — white lift, bottom-left (screen blend adds depth) ─ */}
      <div style={{
        ...abs,
        background: `radial-gradient(ellipse ${b3w}% ${b3h}% at ${b3x}% ${b3y}%, ${p.b3} 0%, transparent 62%)`,
        mixBlendMode: 'screen',
      }} />

      {/* ── 5. Blob 4 — purple accent, bottom-right ─────────────────────── */}
      <div style={{
        ...abs,
        background: `radial-gradient(ellipse ${b4w}% ${b4h}% at ${b4x}% ${b4y}%, ${p.b4} 0%, transparent 60%)`,
      }} />

      {/* ── 6. Blob 5 — mid-tone anchor, centre ─────────────────────────── */}
      <div style={{
        ...abs,
        background: `radial-gradient(ellipse ${b5w}% ${b5h}% at ${b5x}% ${b5y}%, ${p.b5} 0%, transparent 56%)`,
        mixBlendMode: 'screen',
      }} />

      {/* ── 7. Diagonal shimmer sweep ───────────────────────────────────── */}
      <div style={{
        ...abs,
        background: `linear-gradient(
          115deg,
          transparent ${shimX - 18}%,
          ${p.shimmer} ${shimX}%,
          transparent ${shimX + 18}%
        )`,
        pointerEvents: 'none',
      }} />

      {/* ── 8. Optional scene mood overlay ──────────────────────────────── */}
      {overlayOpacity > 0 && (
        <div style={{
          ...abs,
          background: `rgba(30,27,75,${overlayOpacity})`,
          pointerEvents: 'none',
        }} />
      )}
    </>
  )
}

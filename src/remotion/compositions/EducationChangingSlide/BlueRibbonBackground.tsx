/**
 * Premium 3D satin-ribbon stage — royal blue base, specular curves, animated light sweep.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

const C = {
  baseDeep: '#0A2A6B',
  baseMid: '#143D8F',
  baseRoyal: '#1E4FB8',
  skyHi: '#3A7BD5',
  skyLight: '#5B9BE8',
  glow: '#A8D0FF',
} as const

export const BlueRibbonBackground: React.FC = () => {
  const frame = useCurrentFrame()

  const sweepPrimary = interpolate(
    Math.sin((frame / 30) * 0.52) * 0.5 + 0.5,
    [0, 1],
    [-35, 135],
  )
  const sweepSecondary = interpolate(
    Math.sin((frame / 30) * 0.52 + 1.8) * 0.5 + 0.5,
    [0, 1],
    [-20, 120],
  )
  const breathe = 1 + Math.sin((frame / 30) * 0.35) * 0.04

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: C.baseDeep }}>
      {/* ── Base depth stack ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(165deg, ${C.baseDeep} 0%, ${C.baseMid} 38%, ${C.baseRoyal} 100%),
            radial-gradient(ellipse 120% 90% at 50% 38%, ${C.baseRoyal} 0%, ${C.baseDeep} 72%)
          `,
        }}
      />

      {/* Top key light (soft, from above) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 90% 55% at 50% -8%, rgba(91, 155, 232, 0.42) 0%, transparent 62%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Edge lift — lighter at sides, darker center (vignette inverse on stage) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 68% 58% at 50% 48%, rgba(10, 42, 107, 0.55) 0%, transparent 68%),
            radial-gradient(ellipse 95% 80% at 50% 50%, transparent 42%, rgba(58, 123, 213, 0.22) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top satin ribbon (3D curved band) ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: -88,
          left: '-12%',
          right: '-12%',
          height: 240 * breathe,
          filter: 'blur(0.5px)',
          transform: `scaleY(${breathe})`,
          transformOrigin: '50% 0%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '0 0 52% 52%',
            background: `
              linear-gradient(180deg,
                ${C.baseDeep} 0%,
                ${C.baseRoyal} 18%,
                ${C.skyHi} 42%,
                ${C.skyLight} 58%,
                rgba(91, 155, 232, 0.35) 78%,
                transparent 100%)
            `,
            boxShadow: `inset 0 -28px 48px rgba(168, 208, 255, 0.28)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '8% 6% 42% 6%',
            borderRadius: '0 0 48% 48%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(168,208,255,0.12) 35%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Top ribbon cyan rim */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${C.glow} 22%, #ffffff 50%, ${C.glow} 78%, transparent 100%)`,
          opacity: 0.7,
          boxShadow: `0 0 12px ${C.glow}`,
        }}
      />

      {/* ── Bottom satin ribbon ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: -92,
          left: '-14%',
          right: '-14%',
          height: 260 * breathe,
          transform: `scaleY(${breathe})`,
          transformOrigin: '50% 100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '54% 54% 0 0',
            background: `
              linear-gradient(0deg,
                ${C.baseDeep} 0%,
                ${C.baseRoyal} 14%,
                ${C.skyHi} 36%,
                ${C.skyLight} 54%,
                rgba(168, 208, 255, 0.45) 72%,
                rgba(255, 255, 255, 0.12) 88%,
                transparent 100%)
            `,
            boxShadow: '0 -20px 56px rgba(10, 42, 107, 0.55)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '38% 5% 6% 5%',
            borderRadius: '52% 52% 0 0',
            background:
              'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.28) 28%, rgba(168,208,255,0.08) 55%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Bottom rim glow / separation */}
      <div
        style={{
          position: 'absolute',
          bottom: 128,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, transparent 0%, ${C.glow} 15%, #ffffff 50%, ${C.glow} 85%, transparent 100%)`,
          boxShadow: `0 0 20px ${C.glow}, 0 0 6px rgba(255,255,255,0.85)`,
          opacity: 0.92,
        }}
      />

      {/* Bottom-right bright reflection band (depth) */}
      <div
        style={{
          position: 'absolute',
          right: '-6%',
          bottom: '10%',
          width: '48%',
          height: '38%',
          background: `radial-gradient(ellipse 70% 60% at 72% 68%, rgba(168, 208, 255, 0.55) 0%, rgba(91, 155, 232, 0.22) 38%, transparent 72%)`,
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '4%',
          bottom: '14%',
          width: '32%',
          height: 3,
          borderRadius: 999,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.75), ${C.glow})`,
          filter: 'blur(1px)',
          opacity: 0.85,
          transform: 'rotate(-8deg)',
        }}
      />

      {/* Specular streak along bottom curve */}
      <div
        style={{
          position: 'absolute',
          bottom: 118,
          left: '8%',
          right: '8%',
          height: 48,
          borderRadius: '50%',
          background: `linear-gradient(95deg, transparent 0%, rgba(168,208,255,0.08) 30%, rgba(255,255,255,0.18) 50%, rgba(168,208,255,0.06) 70%, transparent 100%)`,
          filter: 'blur(10px)',
          transform: `translateX(${interpolate(sweepSecondary, [-20, 120], [-8, 8])}%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Animated highlight sweep (keynote light pass) ───────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            108deg,
            transparent 0%,
            transparent 38%,
            rgba(168, 208, 255, 0.06) 44%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(168, 208, 255, 0.08) 56%,
            transparent 64%,
            transparent 100%
          )`,
          backgroundSize: '220% 100%',
          backgroundPosition: `${sweepPrimary}% 50%`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            75deg,
            transparent 20%,
            rgba(91, 155, 232, 0.04) 42%,
            rgba(168, 208, 255, 0.14) 50%,
            rgba(91, 155, 232, 0.05) 58%,
            transparent 80%
          )`,
          backgroundSize: '180% 140%',
          backgroundPosition: `${sweepSecondary}% 40%`,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />

      {/* Stage center polish — subtle specular pool for text area */}
      <div
        style={{
          position: 'absolute',
          left: '18%',
          right: '18%',
          top: '32%',
          height: '36%',
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, rgba(91, 155, 232, 0.12) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

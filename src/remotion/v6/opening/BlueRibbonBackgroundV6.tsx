/**
 * V6 slide 2 — dark saturated blue stage + glossy top/bottom ribbons (keynote reference).
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { OPENING_HANDOFF } from './constants'
import { STAGE } from './educationStageTheme'

const RISE_FRAMES = OPENING_HANDOFF - 4

const C = STAGE

export const BlueRibbonBackgroundV6: React.FC = () => {
  const frame = useCurrentFrame()

  const rise = interpolate(frame, [0, RISE_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const riseY = interpolate(rise, [0, 1], [6, 0])
  const riseScale = interpolate(rise, [0, 1], [1.03, 1])

  const sweepPrimary = interpolate(
    Math.sin((frame / 30) * 0.48) * 0.5 + 0.5,
    [0, 1],
    [-40, 140],
  )
  const breathe = 1 + Math.sin((frame / 30) * 0.32) * 0.03

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: C.baseDeep,
        transform: `translateY(${riseY}%) scale(${riseScale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {/* Deep base — darker corners, rich center pool */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 95% 75% at 50% 46%, ${C.coreGlow} 0%, ${C.baseMid} 42%, ${C.baseDeep} 100%),
            linear-gradient(180deg, ${C.baseDeep} 0%, ${C.baseRoyal} 55%, ${C.baseMid} 100%)
          `,
        }}
      />

      {/* Center vignette — text sits in darker, calmer band */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 58% 48% at 50% 50%, rgba(6, 21, 64, 0.72) 0%, transparent 72%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Soft top key (subtle, not washed out) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 42% at 50% 0%, rgba(46, 111, 196, 0.28) 0%, transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top satin ribbon ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: -96,
          left: '-14%',
          right: '-14%',
          height: 252 * breathe,
          transform: `scaleY(${breathe})`,
          transformOrigin: '50% 0%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '0 0 54% 54%',
            background: `
              linear-gradient(180deg,
                ${C.baseDeep} 0%,
                ${C.baseRoyal} 12%,
                ${C.skyHi} 38%,
                ${C.ribbonHi} 52%,
                ${C.skyLight} 62%,
                rgba(74, 143, 224, 0.25) 78%,
                transparent 100%)
            `,
            boxShadow: `inset 0 -32px 56px rgba(184, 220, 255, 0.22)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '6% 5% 44% 5%',
            borderRadius: '0 0 50% 50%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(200,228,255,0.14) 32%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Top ribbon rim */}
      <div
        style={{
          position: 'absolute',
          top: 78,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${C.glow} 20%, ${C.specular} 50%, ${C.glow} 80%, transparent 100%)`,
          opacity: 0.75,
          boxShadow: `0 0 14px ${C.glow}`,
        }}
      />

      {/* ── Bottom satin ribbon (strong white lip like reference) ─────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: -98,
          left: '-15%',
          right: '-15%',
          height: 268 * breathe,
          transform: `scaleY(${breathe})`,
          transformOrigin: '50% 100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '56% 56% 0 0',
            background: `
              linear-gradient(0deg,
                ${C.baseDeep} 0%,
                ${C.baseRoyal} 10%,
                ${C.skyHi} 32%,
                ${C.ribbonHi} 48%,
                ${C.skyLight} 58%,
                rgba(184, 220, 255, 0.5) 74%,
                rgba(255, 255, 255, 0.22) 86%,
                transparent 100%)
            `,
            boxShadow: '0 -24px 64px rgba(4, 12, 40, 0.75)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '36% 4% 5% 4%',
            borderRadius: '54% 54% 0 0',
            background:
              'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.38) 24%, rgba(232,244,255,0.1) 52%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Bottom ribbon bright edge (reference highlight) */}
      <div
        style={{
          position: 'absolute',
          bottom: 132,
          left: '2%',
          right: '2%',
          height: 4,
          borderRadius: 999,
          background: `linear-gradient(90deg, transparent 0%, ${C.glow} 12%, ${C.specular} 50%, ${C.glow} 88%, transparent 100%)`,
          boxShadow: `0 0 22px ${C.glow}, 0 0 8px rgba(255,255,255,0.9)`,
          opacity: 0.95,
        }}
      />

      {/* Lower-right specular pool */}
      <div
        style={{
          position: 'absolute',
          right: '-4%',
          bottom: '8%',
          width: '52%',
          height: '42%',
          background: `radial-gradient(ellipse 68% 58% at 70% 65%, rgba(184, 220, 255, 0.45) 0%, rgba(46, 111, 196, 0.15) 40%, transparent 70%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated keynote sweep */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            108deg,
            transparent 0%,
            transparent 40%,
            rgba(184, 220, 255, 0.05) 46%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(184, 220, 255, 0.06) 56%,
            transparent 64%,
            transparent 100%
          )`,
          backgroundSize: '220% 100%',
          backgroundPosition: `${sweepPrimary}% 50%`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Text-area polish */}
      <div
        style={{
          position: 'absolute',
          left: '16%',
          right: '16%',
          top: '34%',
          height: '32%',
          background: `radial-gradient(ellipse 100% 85% at 50% 50%, rgba(30, 91, 184, 0.14) 0%, transparent 72%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Corner depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 45% 35% at 0% 0%, rgba(0, 0, 0, 0.35) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 100% 0%, rgba(0, 0, 0, 0.35) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(0, 0, 0, 0.4) 0%, transparent 65%)
          `,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

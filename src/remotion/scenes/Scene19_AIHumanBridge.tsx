// Scene 19 — AI + Human Bridge (frames 4536–4788)
// "A bridge between artificial intelligence and human-centered teaching —
//  where technology serves the teacher, not the other way around."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

export const Scene19AIHumanBridge: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Left hand (human) slides in from left
  const leftSpring = spring({ frame: frame - 20, fps, config: theme.spring.snappy })
  const leftX = interpolate(leftSpring, [0, 1], [-300, 0])
  const leftOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Right hand (AI) slides in from right
  const rightSpring = spring({ frame: frame - 20, fps, config: theme.spring.snappy })
  const rightX = interpolate(rightSpring, [0, 1], [300, 0])
  const rightOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Burst at meeting point
  const burstFrame = 100
  const burstProgress = interpolate(frame, [burstFrame, burstFrame + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const burstScale = interpolate(burstProgress, [0, 0.3, 1], [0, 1.5, 1])
  const burstOpacity = interpolate(burstProgress, [0, 0.3, 0.8, 1], [0, 0.8, 0.5, 0])

  // Label
  const labelOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <ParticleField density={40} color={theme.colors.skyBlue} speed={0.3} />

      {/* Background silhouettes */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
        {/* Human silhouettes on left */}
        {[200, 350, 500].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={520} rx={28} ry={28} fill="white" />
            <rect x={x - 22} y={548} width={44} height={80} rx={8} fill="white" />
          </g>
        ))}
        {/* Digital nodes on right */}
        {[1420, 1580, 1720].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={520} r={18} stroke={theme.colors.skyBlue} strokeWidth="1.5" fill="none" />
            <circle cx={x} cy={520} r={6} fill={theme.colors.skyBlue} />
            <line x1={x} y1={502} x2={x} y2={464} stroke={theme.colors.skyBlue} strokeWidth="1" strokeDasharray="2 4" />
          </g>
        ))}
      </svg>

      {/* Left hand — human, warm golden */}
      <div style={{
        position: 'absolute',
        left: 280,
        top: '50%',
        transform: `translateY(-50%) translateX(${leftX}px)`,
        opacity: leftOpacity,
      }}>
        <HumanHand />
      </div>

      {/* Right hand — AI, cool blue */}
      <div style={{
        position: 'absolute',
        right: 280,
        top: '50%',
        transform: `translateY(-50%) translateX(${rightX * -1}px) scaleX(-1)`,
        opacity: rightOpacity,
      }}>
        <AIHand />
      </div>

      {/* Meeting point burst */}
      {frame >= burstFrame && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${burstScale})`,
          opacity: burstOpacity,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.colors.skyBlue}80 0%, ${theme.colors.teal}40 40%, transparent 70%)`,
          boxShadow: `0 0 60px ${theme.colors.skyBlue}60`,
        }} />
      )}

      {/* Center plus symbol after burst */}
      {frame >= burstFrame + 10 && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: interpolate(frame, [burstFrame + 10, burstFrame + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: theme.fonts.headline,
            fontSize: 52,
            fontWeight: 800,
            color: theme.colors.white,
            lineHeight: 1,
            textShadow: `0 0 30px ${theme.colors.skyBlue}60`,
          }}>
            +
          </div>
        </div>
      )}

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
      }}>
        <div style={{ fontFamily: theme.fonts.headline, fontSize: 38, fontWeight: 800, color: theme.colors.white, lineHeight: 1.2 }}>
          <span style={{ color: '#FFD580' }}>Human</span>
          {' '}Wisdom{' '}
          <span style={{ color: theme.colors.skyBlue }}>+</span>
          {' '}AI{' '}
          <span style={{ color: theme.colors.skyBlue }}>Intelligence.</span>
        </div>
      </div>
    </AbsoluteFill>
  )
}

const HumanHand: React.FC = () => (
  <svg width="380" height="340" viewBox="0 0 380 340" fill="none">
    <defs>
      <linearGradient id="humanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD580" />
        <stop offset="100%" stopColor="#FFB347" />
      </linearGradient>
    </defs>
    {/* Palm */}
    <path d="M 60 180 C 55 160 60 120 80 110 C 100 100 110 110 115 130 L 120 180 C 140 175 145 140 155 125 C 165 110 180 112 182 130 L 185 175 C 195 168 200 138 210 128 C 220 118 235 122 236 142 L 238 178 C 248 172 256 150 265 142 C 274 134 285 138 284 158 L 280 200 L 275 260 C 270 290 245 310 215 315 L 120 315 C 90 312 70 295 65 270 Z" fill="url(#humanGrad)" opacity="0.85" />
    {/* Fingers extending toward center */}
    <path d="M 80 110 L 78 50" stroke="url(#humanGrad)" strokeWidth="28" strokeLinecap="round" opacity="0.85" />
    <path d="M 115 100 L 115 30" stroke="url(#humanGrad)" strokeWidth="26" strokeLinecap="round" opacity="0.85" />
    <path d="M 155 100 L 160 28" stroke="url(#humanGrad)" strokeWidth="26" strokeLinecap="round" opacity="0.85" />
    <path d="M 185 100 L 195 38" stroke="url(#humanGrad)" strokeWidth="24" strokeLinecap="round" opacity="0.85" />
    {/* Glow */}
    <ellipse cx="220" cy="200" rx="80" ry="60" fill="#FFB347" opacity="0.1" />
  </svg>
)

const AIHand: React.FC = () => (
  <svg width="380" height="340" viewBox="0 0 380 340" fill="none">
    <defs>
      <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme.colors.skyBlue} />
        <stop offset="100%" stopColor={theme.colors.teal} />
      </linearGradient>
    </defs>
    {/* Palm */}
    <path d="M 60 180 C 55 160 60 120 80 110 C 100 100 110 110 115 130 L 120 180 C 140 175 145 140 155 125 C 165 110 180 112 182 130 L 185 175 C 195 168 200 138 210 128 C 220 118 235 122 236 142 L 238 178 C 248 172 256 150 265 142 C 274 134 285 138 284 158 L 280 200 L 275 260 C 270 290 245 310 215 315 L 120 315 C 90 312 70 295 65 270 Z" fill="url(#aiGrad)" opacity="0.75" />
    {/* Fingers */}
    <path d="M 80 110 L 78 50" stroke="url(#aiGrad)" strokeWidth="28" strokeLinecap="round" opacity="0.8" />
    <path d="M 115 100 L 115 30" stroke="url(#aiGrad)" strokeWidth="26" strokeLinecap="round" opacity="0.8" />
    <path d="M 155 100 L 160 28" stroke="url(#aiGrad)" strokeWidth="26" strokeLinecap="round" opacity="0.8" />
    <path d="M 185 100 L 195 38" stroke="url(#aiGrad)" strokeWidth="24" strokeLinecap="round" opacity="0.8" />
    {/* Circuit lines */}
    <path d="M 100 200 L 200 200 L 200 230 L 240 230" stroke={theme.colors.skyBlue} strokeWidth="1" opacity="0.4" fill="none" />
    <circle cx="240" cy="230" r="3" fill={theme.colors.teal} opacity="0.7" />
    {/* Glow */}
    <ellipse cx="220" cy="200" rx="80" ry="60" fill={theme.colors.skyBlue} opacity="0.1" />
  </svg>
)

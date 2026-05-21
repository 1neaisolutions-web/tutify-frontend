// Scene 20 — Enterprise Security (frames 4788–5040)
// "With enterprise-grade privacy, multi-tier governance, and full institutional control —
//  built in from day one."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const BADGES = [
  { label: 'Privacy First', icon: '🔒', color: theme.colors.skyBlue,  angle:  -90, delay: 60 },
  { label: 'Governance',    icon: '✅', color: theme.colors.teal,     angle:    0, delay: 75 },
  { label: 'Compliance',    icon: '📋', color: '#B47FFF',            angle:   90, delay: 90 },
  { label: 'Data Safety',   icon: '🛡', color: '#FFB347',            angle:  180, delay: 105 },
  { label: 'Audit Trail',   icon: '📊', color: '#4ECB71',            angle:  -45, delay: 118 },
  { label: 'Zero Trust',    icon: '🔐', color: '#FF6B6B',            angle:   45, delay: 130 },
]
const ORBIT_R = 300

export const Scene20EnterpriseSecurity: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Shield entrance
  const shieldSpring = spring({ frame: frame - 15, fps, config: theme.spring.gentle })
  const shieldScale = interpolate(shieldSpring, [0, 1], [0.5, 1])
  const shieldOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Shield pulse
  const shieldPulse = Math.sin(frame * 0.04) * 0.04 + 1
  const beamRotation = frame * 0.5

  // Light beams
  const beamOpacity = interpolate(frame, [30, 60], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Label
  const labelOpacity = interpolate(frame, [100, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <ParticleField density={30} color={theme.colors.skyBlue} speed={0.25} />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {/* Rotating light beams */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = ((i * 60 + beamRotation) * Math.PI) / 180
          const bx = 960 + Math.cos(angle) * 600
          const by = 540 + Math.sin(angle) * 400
          return (
            <line key={i}
              x1={960} y1={540}
              x2={bx} y2={by}
              stroke={theme.colors.skyBlue}
              strokeWidth={1}
              strokeOpacity={beamOpacity * 0.4}
            />
          )
        })}

        {/* Badge orbits */}
        {BADGES.map((badge, i) => {
          const angle = (badge.angle * Math.PI) / 180
          const bx = 960 + Math.cos(angle) * ORBIT_R
          const by = 540 + Math.sin(angle) * ORBIT_R

          const orbitProgress = interpolate(frame, [badge.delay, badge.delay + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const badgePulse = Math.sin(frame * 0.06 + i * 1.1) * 0.1 + 1

          return (
            <g key={i} opacity={orbitProgress}>
              {/* Connection to shield */}
              <line
                x1={960} y1={540}
                x2={bx} y2={by}
                stroke={badge.color}
                strokeWidth={1}
                strokeOpacity={0.3}
                strokeDasharray="3 6"
              />
              {/* Badge circle */}
              <circle cx={bx} cy={by} r={40 * badgePulse} fill={badge.color} opacity={0.12} />
              <circle cx={bx} cy={by} r={28} fill={theme.colors.navy} stroke={badge.color} strokeWidth={1.5} opacity={0.95} />
              <text x={bx} y={by + 5} textAnchor="middle" fontSize={16}>{badge.icon}</text>
              <text x={bx} y={by + 48} textAnchor="middle"
                fill={badge.color} fontSize={12} fontFamily={theme.fonts.body} fontWeight={600} opacity={0.85}>
                {badge.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Central shield */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${shieldScale * shieldPulse})`,
        opacity: shieldOpacity,
        transformOrigin: 'center center',
      }}>
        <ShieldSVG frame={frame} />
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 28,
        fontWeight: 700,
        color: theme.colors.white,
      }}>
        Enterprise-Grade Security ·{' '}
        <span style={{ color: theme.colors.skyBlue }}>Built In</span>
      </div>
    </AbsoluteFill>
  )
}

const ShieldSVG: React.FC<{ frame: number }> = ({ frame }) => {
  const circuitOpacity = interpolate(frame, [40, 80], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const glow = Math.sin(frame * 0.04) * 0.2 + 0.8

  return (
    <svg width="200" height="230" viewBox="0 0 200 230" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.colors.skyBlue} stopOpacity="0.9" />
          <stop offset="100%" stopColor={theme.colors.teal} stopOpacity="0.7" />
        </linearGradient>
        <filter id="shieldGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <path d="M 100 10 L 185 45 L 185 120 C 185 168 148 205 100 220 C 52 205 15 168 15 120 L 15 45 Z"
        fill={theme.colors.skyBlue} opacity={0.08 * glow}
        transform="scale(1.15) translate(-13, -11)"
      />

      {/* Shield body */}
      <path d="M 100 10 L 185 45 L 185 120 C 185 168 148 205 100 220 C 52 205 15 168 15 120 L 15 45 Z"
        fill="url(#shieldGrad)"
        opacity={0.85}
        filter="url(#shieldGlow)"
      />

      {/* Shield border */}
      <path d="M 100 10 L 185 45 L 185 120 C 185 168 148 205 100 220 C 52 205 15 168 15 120 L 15 45 Z"
        stroke={theme.colors.skyBlue} strokeWidth={2}
        fill="none"
        opacity={0.9}
      />

      {/* Circuit pattern */}
      <g opacity={circuitOpacity}>
        <line x1="60" y1="80" x2="140" y2="80" stroke="white" strokeWidth="0.8" />
        <line x1="60" y1="100" x2="100" y2="100" stroke="white" strokeWidth="0.8" />
        <line x1="100" y1="100" x2="100" y2="140" stroke="white" strokeWidth="0.8" />
        <line x1="100" y1="140" x2="140" y2="140" stroke="white" strokeWidth="0.8" />
        <circle cx="60" cy="80" r="3" fill={theme.colors.teal} />
        <circle cx="140" cy="80" r="3" fill={theme.colors.teal} />
        <circle cx="100" cy="120" r="3" fill={theme.colors.skyBlue} />
        <circle cx="140" cy="140" r="3" fill={theme.colors.teal} />
      </g>

      {/* Center lock icon */}
      <rect x="84" y="106" width="32" height="26" rx="4" fill="white" opacity="0.9" />
      <path d="M 90 106 L 90 98 C 90 90 110 90 110 98 L 110 106" stroke="white" strokeWidth="3" fill="none" opacity="0.9" />
      <circle cx="100" cy="119" r="4" fill={theme.colors.navy} />
    </svg>
  )
}

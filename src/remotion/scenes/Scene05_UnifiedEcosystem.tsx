// Scene 05 — Unified Ecosystem (frames 1008–1260)
// "Tutify is the AI platform built for intelligent education —
//  one ecosystem connecting everyone who shapes a child's future."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const ROLES = [
  { label: 'Teacher',  angle: -90,  color: theme.colors.skyBlue, size: 70 },
  { label: 'Student',  angle:   0,  color: theme.colors.teal,    size: 65 },
  { label: 'Admin',    angle:  90,  color: '#7B8FFF',            size: 65 },
  { label: 'Parent',   angle: 180,  color: '#FFB347',            size: 60 },
]
const ORBIT_R = 280
const CX = 960
const CY = 540

export const Scene05UnifiedEcosystem: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Slow rotation
  const rotation = frame * 0.18

  // Center orb entrance
  const centerSpring = spring({ frame, fps, config: theme.spring.gentle })
  const centerScale = interpolate(centerSpring, [0, 1], [0.3, 1])
  const centerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // "One platform. Every role." text
  const textOpacity = interpolate(frame, [100, 130], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const textY = interpolate(frame, [100, 130], [20, 0], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, background: `linear-gradient(135deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 60%, #0d2540 100%)` }}>
      <ParticleField density={50} color={theme.colors.skyBlue} speed={0.5} />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.colors.skyBlue} stopOpacity="0.35" />
            <stop offset="100%" stopColor={theme.colors.skyBlue} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow behind center */}
        <circle cx={CX} cy={CY} r={180 * centerScale} fill="url(#centerGlow)" />

        {/* Connection lines to each role */}
        {ROLES.map((role, i) => {
          const angle = ((role.angle + rotation) * Math.PI) / 180
          const rx = CX + Math.cos(angle) * ORBIT_R
          const ry = CY + Math.sin(angle) * ORBIT_R

          const lineOpacity = interpolate(frame, [30 + i * 15, 60 + i * 15], [0, 0.6], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          // Pulse along the line
          const pulseProgress = ((frame * 0.02 + i * 0.25) % 1)

          return (
            <g key={i}>
              <line
                x1={CX} y1={CY} x2={rx} y2={ry}
                stroke={role.color}
                strokeWidth={1.5}
                strokeOpacity={lineOpacity}
                strokeDasharray="4 8"
              />
              {/* Traveling dot */}
              <circle
                cx={CX + (rx - CX) * pulseProgress}
                cy={CY + (ry - CY) * pulseProgress}
                r={4}
                fill={role.color}
                opacity={lineOpacity * 0.8}
              />
            </g>
          )
        })}

        {/* Orbital role orbs */}
        {ROLES.map((role, i) => {
          const angle = ((role.angle + rotation) * Math.PI) / 180
          const rx = CX + Math.cos(angle) * ORBIT_R
          const ry = CY + Math.sin(angle) * ORBIT_R

          const orbSpring = spring({ frame: frame - 25 - i * 12, fps, config: theme.spring.bouncy })
          const orbScale = interpolate(orbSpring, [0, 1], [0, 1])
          const orbOpacity = interpolate(frame, [25 + i * 12, 45 + i * 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          const pulse = Math.sin(frame * 0.06 + i * 1.2) * 0.12 + 1

          return (
            <g key={i} transform={`translate(${rx}, ${ry}) scale(${orbScale})`} opacity={orbOpacity}>
              {/* Glow */}
              <circle r={role.size * 1.6 * pulse} fill={role.color} opacity={0.12} />
              {/* Main sphere */}
              <circle r={role.size * 0.5 * pulse} fill={role.color} opacity={0.9} />
              <circle r={role.size * 0.5 * 0.35} cx={-role.size * 0.12} cy={-role.size * 0.12} fill="white" opacity={0.3} />
              {/* Label */}
              <text
                y={role.size * 0.5 + 22}
                textAnchor="middle"
                fill={theme.colors.white}
                fontSize={15}
                fontFamily={theme.fonts.body}
                fontWeight={600}
                opacity={0.9}
              >
                {role.label}
              </text>
            </g>
          )
        })}

        {/* Center Tutify orb */}
        <g transform={`translate(${CX}, ${CY}) scale(${centerScale})`} opacity={centerOpacity}>
          <circle r={72} fill={`url(#centerGlow)`} />
          <circle r={52} fill={theme.colors.skyBlue} opacity={0.95} />
          <circle r={18} cx={-14} cy={-14} fill="white" opacity={0.3} />
          <text y={6} textAnchor="middle" fill="white" fontSize={18} fontFamily={theme.fonts.headline} fontWeight={800} letterSpacing="-0.5">
            Tutify
          </text>
        </g>
      </svg>

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
        fontFamily: theme.fonts.headline,
        fontSize: 36,
        fontWeight: 700,
        color: theme.colors.white,
        letterSpacing: 1,
      }}>
        One platform.{' '}
        <span style={{ color: theme.colors.skyBlue }}>Every role.</span>
      </div>
    </AbsoluteFill>
  )
}

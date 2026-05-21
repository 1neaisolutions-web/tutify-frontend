// Scene 06 — Three-Tier Architecture (frames 1260–1512)
// "From global organizations, to individual schools, to every
//  single educator — governed, secure, and built for scale."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { theme } from '../theme'

const TIERS = [
  {
    icon: <GlobeIcon />,
    label: 'Organization',
    sub: 'Global governance & analytics',
    color: theme.colors.skyBlue,
    startFrame: 20,
  },
  {
    icon: <SchoolIcon />,
    label: 'School',
    sub: 'Institutional control & oversight',
    color: theme.colors.teal,
    startFrame: 50,
  },
  {
    icon: <TeacherIcon />,
    label: 'Individual',
    sub: 'Every teacher, every classroom',
    color: '#B47FFF',
    startFrame: 80,
  },
]

export const Scene06ThreeTierArchitecture: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Slow upward drift of the whole stack
  const stackY = interpolate(frame, [0, 252], [20, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Label
  const labelOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Grid background */}
      <GridBackground />

      <div style={{ transform: `translateY(${stackY}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {TIERS.map((tier, i) => {
          const tierSpring = spring({ frame: frame - tier.startFrame, fps, config: theme.spring.snappy })
          const tierOpacity = interpolate(frame, [tier.startFrame, tier.startFrame + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const translateX = interpolate(tierSpring, [0, 1], [-80, 0])
          const scl = interpolate(tierSpring, [0, 1], [0.85, 1])

          return (
            <div key={i} style={{ opacity: tierOpacity, transform: `translateX(${translateX}px) scale(${scl})` }}>
              <GlassCard
                width={820}
                height={110}
                glowColor={tier.color}
                glowIntensity={0.5}
                style={{ marginBottom: i < 2 ? 0 : 0, position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px', height: '100%', gap: 28 }}>
                  {/* Icon */}
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${tier.color}40 0%, ${tier.color}10 100%)`,
                    border: `1.5px solid ${tier.color}60`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {tier.icon}
                  </div>
                  {/* Text */}
                  <div>
                    <div style={{ fontFamily: theme.fonts.headline, fontSize: 22, fontWeight: 700, color: theme.colors.white, lineHeight: 1.2 }}>
                      {tier.label}
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 15, color: 'rgba(245,249,255,0.6)', marginTop: 4 }}>
                      {tier.sub}
                    </div>
                  </div>
                  {/* Tier badge */}
                  <div style={{
                    marginLeft: 'auto',
                    background: `${tier.color}18`,
                    border: `1px solid ${tier.color}40`,
                    borderRadius: 6,
                    padding: '4px 14px',
                    fontFamily: theme.fonts.body,
                    fontSize: 13,
                    color: tier.color,
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}>
                    TIER {i + 1}
                  </div>
                </div>
              </GlassCard>

              {/* Connector beam between tiers */}
              {i < 2 && (
                <LightBeam
                  frame={frame}
                  startFrame={tier.startFrame + 30}
                  color={tier.color}
                  nextColor={TIERS[i + 1].color}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom label */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 28,
        fontWeight: 600,
        color: 'rgba(245,249,255,0.7)',
        letterSpacing: 4,
      }}>
        ORGANIZATION · SCHOOL · INDIVIDUAL
      </div>
    </AbsoluteFill>
  )
}

const LightBeam: React.FC<{ frame: number; startFrame: number; color: string; nextColor: string }> = ({ frame, startFrame, color, nextColor }) => {
  const w = interpolate(frame, [startFrame, startFrame + 20], [0, 820], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const opacity = interpolate(frame, [startFrame + 40, startFrame + 60], [0.6, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <div style={{ width: 820, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{
        width: w,
        height: 2,
        background: `linear-gradient(90deg, ${color}, ${nextColor})`,
        opacity,
        boxShadow: `0 0 12px ${color}80`,
      }} />
    </div>
  )
}

const GridBackground: React.FC = () => (
  <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
    {Array.from({ length: 20 }, (_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 60} x2="1920" y2={i * 60} stroke={theme.colors.skyBlue} strokeWidth="1" />
    ))}
    {Array.from({ length: 34 }, (_, i) => (
      <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="1080" stroke={theme.colors.skyBlue} strokeWidth="1" />
    ))}
  </svg>
)

function GlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={theme.colors.skyBlue} strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke={theme.colors.skyBlue} strokeWidth="1.5" />
      <line x1="2" y1="12" x2="22" y2="12" stroke={theme.colors.skyBlue} strokeWidth="1.5" />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M3 10h18M9 21V10M15 21V10M12 3L3 10h18L12 3z" stroke={theme.colors.teal} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function TeacherIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="14" height="12" rx="2" stroke="#B47FFF" strokeWidth="1.5" />
      <path d="M22 21v-2a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v2" stroke="#B47FFF" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="2" stroke="#B47FFF" strokeWidth="1.5" />
    </svg>
  )
}

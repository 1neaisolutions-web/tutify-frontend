// Scene 11 — Template Output / AI Response (frames 2520–2772)
// "Out comes a complete, classroom-ready strategy — in seconds."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { theme } from '../theme'

const SECTIONS = [
  {
    heading: 'Management Solutions',
    color: theme.colors.skyBlue,
    points: [
      'Implement structured seating rotations every 3 weeks',
      'Use proximity seating strategy — position restless students near the teacher',
      'Introduce "Focus Zones" with visual desk markers',
    ],
  },
  {
    heading: 'Proximity & Purpose Seating',
    color: theme.colors.teal,
    points: [
      'Seat students who struggle near a calm peer partner',
      'Front-adjacent placement improves teacher monitoring by 60%',
      'Allow brief stand-and-stretch every 20 minutes',
    ],
  },
  {
    heading: 'Rationale',
    color: '#B47FFF',
    points: [
      'Movement needs are neurological, not behavioural defiance',
      'Structured movement outlets reduce off-task time by up to 40%',
      'Research: Jensen (2005) — movement activates the prefrontal cortex',
    ],
  },
  {
    heading: 'How to Implement',
    color: '#FFB347',
    points: [
      'Week 1: Introduce seating chart with student input',
      'Week 2: Add 5-min structured movement breaks',
      'Week 3: Debrief with students; adjust as needed',
    ],
  },
]

export const Scene11TemplateOutput: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Document scrolls upward — reveals content progressively
  const scrollY = interpolate(frame, [30, 230], [0, -520], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Document card entrance
  const cardOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Label
  const labelOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Vertical scroll mask */}
      <div style={{ position: 'relative', width: 800, height: 600, overflow: 'hidden', opacity: cardOpacity }}>
        {/* Top gradient mask */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: `linear-gradient(to bottom, ${theme.colors.navy}, transparent)`,
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        {/* Bottom gradient mask */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: `linear-gradient(to top, ${theme.colors.navy}, transparent)`,
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Scrolling content */}
        <div style={{ transform: `translateY(${scrollY}px)` }}>
          <GlassCard width={800} height={1200} glowColor={theme.colors.skyBlue} glowIntensity={0.4} borderRadius={20}>
            <div style={{ padding: '32px 40px' }}>
              {/* Document header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: 8,
                    background: `${theme.colors.skyBlue}20`,
                    border: `1px solid ${theme.colors.skyBlue}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill={theme.colors.skyBlue} />
                    </svg>
                  </div>
                  <div style={{ fontFamily: theme.fonts.headline, fontSize: 20, fontWeight: 700, color: theme.colors.white }}>
                    Classroom Management Strategy
                  </div>
                  <div style={{
                    marginLeft: 'auto',
                    background: `${theme.colors.teal}20`,
                    border: `1px solid ${theme.colors.teal}40`,
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontFamily: theme.fonts.body,
                    fontSize: 11,
                    color: theme.colors.teal,
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}>
                    AI GENERATED
                  </div>
                </div>
                <div style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  color: 'rgba(245,249,255,0.55)',
                  lineHeight: 1.5,
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                  borderLeft: `2px solid ${theme.colors.skyBlue}50`,
                }}>
                  Challenge: "students who do not sit in their seats" · Grade 9 · Generated in 2.1s
                </div>
              </div>

              {/* Sections */}
              {SECTIONS.map((section, si) => {
                const sectionOpacity = interpolate(frame, [25 + si * 12, 45 + si * 12], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
                return (
                  <div key={si} style={{ marginBottom: 28, opacity: sectionOpacity }}>
                    <div style={{
                      fontFamily: theme.fonts.headline,
                      fontSize: 17,
                      fontWeight: 700,
                      color: section.color,
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <div style={{ width: 4, height: 18, background: section.color, borderRadius: 2 }} />
                      {section.heading}
                    </div>
                    <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {section.points.map((pt, pi) => {
                        const ptOpacity = interpolate(frame, [30 + si * 12 + pi * 6, 50 + si * 12 + pi * 6], [0, 1], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        })
                        return (
                          <div key={pi} style={{ display: 'flex', gap: 10, opacity: ptOpacity }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: section.color, marginTop: 7, flexShrink: 0, opacity: 0.7 }} />
                            <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: 'rgba(245,249,255,0.82)', lineHeight: 1.5 }}>
                              {pt}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom label */}
      <div style={{
        position: 'absolute',
        bottom: 72,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 28,
        fontWeight: 700,
        color: theme.colors.white,
      }}>
        Challenge →{' '}
        <span style={{ color: theme.colors.teal }}>classroom-ready strategy.</span>
        <span style={{ color: 'rgba(245,249,255,0.5)', fontWeight: 400, fontSize: 22 }}>  In seconds.</span>
      </div>
    </AbsoluteFill>
  )
}

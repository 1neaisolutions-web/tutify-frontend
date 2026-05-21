// Scene 09 — Worksheet Differentiation (frames 2016–2268)
// "Mixed question types. Multiple difficulty levels."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { theme } from '../theme'

const LEVELS = [
  { label: 'Easy',     color: '#4ECB71', accentBg: '#4ECB7120', delay:  0 },
  { label: 'Medium',   color: theme.colors.skyBlue, accentBg: `${theme.colors.skyBlue}20`, delay: 18 },
  { label: 'Advanced', color: '#FF8C42', accentBg: '#FF8C4220', delay: 36 },
]

export const Scene09WorksheetDifferentiation: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Slow pan suggestion — very subtle horizontal drift
  const panX = interpolate(frame, [0, 252], [30, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const labelOpacity = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* 3D angled card group */}
      <div style={{
        display: 'flex',
        gap: 40,
        alignItems: 'center',
        transform: `translateX(${panX}px) perspective(1400px) rotateY(-4deg)`,
      }}>
        {LEVELS.map((level, i) => {
          const cardSpring = spring({ frame: frame - (30 + level.delay), fps, config: theme.spring.bouncy })
          const cardY = interpolate(cardSpring, [0, 1], [80, 0])
          const cardOpacity = interpolate(frame, [30 + level.delay, 50 + level.delay], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          // Center card is slightly larger
          const scale = i === 1 ? 1.04 : 1

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${scale}) rotateY(${(i - 1) * 6}deg)`,
              }}
            >
              <GlassCard
                width={430}
                height={480}
                glowColor={level.color}
                glowIntensity={i === 1 ? 0.7 : 0.45}
                borderRadius={18}
              >
                <div style={{ padding: '24px 28px', height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {/* Level badge */}
                  <div style={{
                    background: level.accentBg,
                    border: `1.5px solid ${level.color}50`,
                    borderRadius: 8,
                    padding: '6px 16px',
                    marginBottom: 18,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    alignSelf: 'flex-start',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: level.color, boxShadow: `0 0 8px ${level.color}` }} />
                    <span style={{ fontFamily: theme.fonts.headline, fontSize: 15, fontWeight: 700, color: level.color, letterSpacing: 1 }}>
                      {level.label}
                    </span>
                  </div>

                  {/* Question blocks */}
                  {getQuestions(level.label).map((q, qi) => (
                    <div key={qi} style={{ marginBottom: 16 }}>
                      <div style={{
                        fontFamily: theme.fonts.body,
                        fontSize: 14,
                        color: 'rgba(245,249,255,0.85)',
                        lineHeight: 1.45,
                        marginBottom: 6,
                      }}>
                        {qi + 1}. {q.text}
                      </div>
                      {q.type === 'mcq' && (
                        <div style={{ display: 'flex', gap: 10, paddingLeft: 14, flexWrap: 'wrap' }}>
                          {['A', 'B', 'C', 'D'].map((opt) => (
                            <div key={opt} style={{
                              width: 26, height: 26, borderRadius: '50%',
                              border: `1.5px solid rgba(245,249,255,0.2)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: theme.fonts.body, fontSize: 11, color: 'rgba(245,249,255,0.55)',
                            }}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.type === 'short' && (
                        <div style={{ height: 32, borderBottom: '1px solid rgba(245,249,255,0.15)', marginLeft: 14, marginRight: 8, marginTop: 4 }} />
                      )}
                      {q.type === 'essay' && (
                        <div style={{ height: 60, border: '1px solid rgba(245,249,255,0.1)', borderRadius: 6, marginLeft: 14, marginTop: 4, background: 'rgba(255,255,255,0.02)' }} />
                      )}
                    </div>
                  ))}

                  <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(245,249,255,0.07)' }}>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: level.color, opacity: 0.7, letterSpacing: 1 }}>
                      TUTIFY AI · {level.label.toUpperCase()} LEVEL
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 26,
        fontWeight: 600,
        color: 'rgba(245,249,255,0.7)',
        letterSpacing: 1,
      }}>
        Easy · Medium · Advanced —{' '}
        <span style={{ color: theme.colors.teal }}>instantly differentiated</span>
      </div>
    </AbsoluteFill>
  )
}

function getQuestions(level: string) {
  if (level === 'Easy') return [
    { text: 'What do plants need to make food?', type: 'mcq' },
    { text: 'Name one thing plants produce during photosynthesis.', type: 'short' },
    { text: 'Circle the correct answer: Plants use sunlight / moonlight.', type: 'mcq' },
  ]
  if (level === 'Medium') return [
    { text: 'Describe the two stages of photosynthesis.', type: 'short' },
    { text: 'Which equation represents photosynthesis?', type: 'mcq' },
    { text: 'How does light intensity affect the rate of photosynthesis?', type: 'essay' },
  ]
  return [
    { text: 'Analyse how limiting factors affect the rate of photosynthesis and suggest a controlled experiment to test one limiting factor.', type: 'essay' },
    { text: 'Evaluate the role of the Calvin cycle in carbon fixation.', type: 'short' },
    { text: 'Compare the Z-scheme of the light reactions with the Q-cycle in cellular respiration.', type: 'essay' },
  ]
}

// Scene 22 — The Numbers That Matter (frames 5292–5544)
// "Up to ten hours saved every week. Strong early adoption.
//  Real teachers, real results — already in classrooms today."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { CounterNumber } from '../components/CounterNumber'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const STATS = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={theme.colors.teal} strokeWidth="1.5" />
        <path d="M12 6v6l4 2" stroke={theme.colors.teal} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label:    'Hours Saved Weekly',
    from:     0,
    to:       10,
    suffix:   '',
    prefix:   '7–',
    display:  '7–10',
    sub:      'per teacher, per week',
    color:    theme.colors.teal,
    delay:    20,
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke={theme.colors.skyBlue} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    label:    'Teacher Satisfaction',
    from:     0,
    to:       98,
    suffix:   '%',
    prefix:   '',
    display:  '98%',
    sub:      'from early adopters',
    color:    theme.colors.skyBlue,
    delay:    45,
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#FFB347" strokeWidth="1.5" />
        <path d="M2 12h20M12 2C6 2 2 7 2 12M12 22C18 22 22 17 22 12" stroke="#FFB347" strokeWidth="1.5" />
      </svg>
    ),
    label:    'Countries Worldwide',
    from:     0,
    to:       50,
    suffix:   '+',
    prefix:   '',
    display:  '50+',
    sub:      'and growing daily',
    color:    '#FFB347',
    delay:    70,
  },
]

export const Scene22NumbersThatMatter: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <ParticleField density={30} color={theme.colors.skyBlue} speed={0.3} />

      <div style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}>
        {STATS.map((stat, i) => {
          const cardSpring = spring({ frame: frame - stat.delay, fps, config: theme.spring.bouncy })
          const cardY = interpolate(cardSpring, [0, 1], [100, 0])
          const cardOpacity = interpolate(frame, [stat.delay, stat.delay + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          return (
            <div key={i} style={{
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
            }}>
              <GlassCard
                width={380}
                height={320}
                glowColor={stat.color}
                glowIntensity={0.6}
                borderRadius={24}
              >
                <div style={{ padding: '36px 40px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `${stat.color}15`,
                    border: `1.5px solid ${stat.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {stat.icon}
                  </div>

                  {/* Animated number */}
                  <div style={{ textAlign: 'center' }}>
                    {stat.prefix ? (
                      <div style={{
                        fontFamily: theme.fonts.headline,
                        fontSize: 80,
                        fontWeight: 800,
                        color: stat.color,
                        lineHeight: 1,
                        letterSpacing: -3,
                        textShadow: `0 0 40px ${stat.color}40`,
                      }}>
                        <CounterNumber
                          from={stat.from}
                          to={stat.to}
                          startFrame={stat.delay + 15}
                          durationFrames={50}
                          suffix={stat.suffix}
                          prefix={stat.prefix}
                          size={80}
                          color={stat.color}
                        />
                      </div>
                    ) : (
                      <CounterNumber
                        from={stat.from}
                        to={stat.to}
                        startFrame={stat.delay + 15}
                        durationFrames={50}
                        suffix={stat.suffix}
                        size={80}
                        color={stat.color}
                      />
                    )}
                  </div>

                  {/* Labels */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: theme.fonts.headline, fontSize: 18, fontWeight: 700, color: theme.colors.white, marginBottom: 6 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: 'rgba(245,249,255,0.55)' }}>
                      {stat.sub}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>

      {/* Headline above */}
      <div style={{
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        fontFamily: theme.fonts.headline,
        fontSize: 22,
        fontWeight: 600,
        color: 'rgba(245,249,255,0.55)',
        letterSpacing: 3,
        textTransform: 'uppercase',
      }}>
        Numbers That Matter
      </div>
    </AbsoluteFill>
  )
}

// Scene 15 — Specialized AI Assistants (frames 3528–3780)
// "Generic AI gives generic answers. Tutify gives teachers a team of
//  subject-expert AI assistants — built for the curriculum, governed for the classroom."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { GlowOrb } from '../components/GlowOrb'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const BOTS = [
  {
    label:    'Teaching Assistant',
    role:     'General pedagogy & lesson support',
    color:    theme.colors.skyBlue,
    x:        380,
    y:        540,
    size:     90,
    delay:    20,
    messages: ['📚 Lesson plan ready', '✏️ Differentiation tip', '📊 Progress update'],
  },
  {
    label:    'Science Specialist',
    role:     'Curriculum-aligned STEM expertise',
    color:    theme.colors.teal,
    x:        960,
    y:        480,
    size:     110,
    delay:    10,
    messages: ['⚗️ Lab activity generated', '🔬 NGSS-aligned quiz', '🌡️ Safety reminder'],
  },
  {
    label:    'Literature Specialist',
    role:     'Language arts & critical reading',
    color:    '#FFB347',
    x:        1540,
    y:        540,
    size:     90,
    delay:    30,
    messages: ['📖 Close-read prompt', '✍️ Essay scaffold', '💬 Discussion questions'],
  },
]

export const Scene15SpecializedBots: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Label
  const labelOpacity = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      <ParticleField density={35} color="rgba(255,255,255,0.3)" speed={0.3} />

      {/* Governance shield background pattern */}
      <ShieldPattern />

      {/* Connection lines between bots */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {BOTS.slice(0, -1).map((bot, i) => {
          const next = BOTS[i + 1]
          const lineOpacity = interpolate(frame, [50, 75], [0, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <line key={i}
              x1={bot.x} y1={bot.y}
              x2={next.x} y2={next.y}
              stroke={bot.color}
              strokeWidth={1.5}
              strokeOpacity={lineOpacity}
              strokeDasharray="4 8"
            />
          )
        })}
      </svg>

      {/* Bot orbs with cards */}
      {BOTS.map((bot, i) => {
        const orbSpring = spring({ frame: frame - bot.delay, fps, config: theme.spring.bouncy })
        const orbScale = interpolate(orbSpring, [0, 1], [0, 1])
        const orbOpacity = interpolate(frame, [bot.delay, bot.delay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

        return (
          <div key={i} style={{
            position: 'absolute',
            left: bot.x - bot.size * 1.5,
            top: bot.y - bot.size * 1.5,
            opacity: orbOpacity,
            transform: `scale(${orbScale})`,
            transformOrigin: 'center center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Orb */}
            <GlowOrb
              color={bot.color}
              size={bot.size}
              pulseSpeed={0.04 + i * 0.01}
              x={bot.size * 1.5}
              y={bot.size * 1.5}
              label={bot.label}
              labelSize={15}
            />

            {/* Floating chat bubbles */}
            <ChatBubbles messages={bot.messages} color={bot.color} frame={frame} index={i} />
          </div>
        )
      })}

      {/* Role labels under each orb */}
      {BOTS.map((bot, i) => {
        const labelOpacityBot = interpolate(frame, [bot.delay + 30, bot.delay + 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        return (
          <div key={i} style={{
            position: 'absolute',
            left: bot.x - 130,
            top: bot.y + bot.size * 0.7,
            width: 260,
            textAlign: 'center',
            opacity: labelOpacityBot,
            fontFamily: theme.fonts.body,
            fontSize: 14,
            color: 'rgba(245,249,255,0.55)',
            lineHeight: 1.4,
          }}>
            {bot.role}
          </div>
        )
      })}

      {/* Bottom label */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 24,
        fontWeight: 600,
        color: 'rgba(245,249,255,0.75)',
        letterSpacing: 1,
      }}>
        Subject-expert ·{' '}
        <span style={{ color: theme.colors.skyBlue }}>Curriculum-aligned</span>
        {' '}· Governed.
      </div>
    </AbsoluteFill>
  )
}

const ChatBubbles: React.FC<{ messages: string[]; color: string; frame: number; index: number }> = ({ messages, color, frame, index }) => {
  const activeMsg = Math.floor((frame / 40 + index) % messages.length)
  const bubbleOpacity = interpolate((frame % 40), [0, 8, 32, 40], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  if (frame < 60) return null

  return (
    <div style={{
      position: 'absolute',
      top: -44,
      left: '50%',
      transform: 'translateX(-50%)',
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderRadius: 10,
      padding: '6px 14px',
      fontFamily: theme.fonts.body,
      fontSize: 13,
      color: theme.colors.white,
      whiteSpace: 'nowrap',
      opacity: bubbleOpacity,
      backdropFilter: 'blur(8px)',
    }}>
      {messages[activeMsg]}
    </div>
  )
}

const ShieldPattern: React.FC = () => (
  <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
    {Array.from({ length: 6 }, (_, i) =>
      Array.from({ length: 10 }, (_, j) => (
        <path
          key={`${i}-${j}`}
          d={`M ${j * 200 + 60} ${i * 180 + 30} L ${j * 200 + 110} ${i * 180 + 10} L ${j * 200 + 160} ${i * 180 + 30} L ${j * 200 + 160} ${i * 180 + 80} L ${j * 200 + 110} ${i * 180 + 100} L ${j * 200 + 60} ${i * 180 + 80} Z`}
          stroke={theme.colors.skyBlue}
          strokeWidth="0.8"
          fill="none"
        />
      ))
    )}
  </svg>
)

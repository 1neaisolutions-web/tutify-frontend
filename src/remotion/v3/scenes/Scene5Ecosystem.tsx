import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { KineticText } from '../components/KineticText'
import { NetworkNode } from '../components/NetworkNode'
import { ParticleField } from '../components/ParticleField'

export const SCENE5_DURATION = 210

const NODES = [
  { label: 'Teachers', emoji: '👩‍🏫', color: '#38BDF8' },
  { label: 'Students', emoji: '👨‍🎓', color: '#34D399' },
  { label: 'Parents',  emoji: '👨‍👩‍👧', color: '#F59E0B' },
  { label: 'Schools',  emoji: '🏫',    color: '#A78BFA' },
]

const STATS = [
  { value: '10,000+', label: 'Educators' },
  { value: '50+',     label: 'Institutions' },
  { value: '98%',     label: 'Satisfaction' },
]

export const Scene5Ecosystem: React.FC = () => {
  const frame = useCurrentFrame()

  const openOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const closeOp = interpolate(frame, [SCENE5_DURATION - 18, SCENE5_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const textOp  = interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const statsOp = interpolate(frame, [100, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const statsY  = interpolate(frame, [100, 122], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: '#07080F', overflow: 'hidden', opacity: openOp }}>
      {/* Radial glow background */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.065) 0%, transparent 68%)',
      }} />

      <ParticleField count={32} color1="#38BDF8" color2="#A78BFA" />

      {/* Decorative orbit rings */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={1920} height={1080}>
        {[290, 355, 420].map((r, i) => (
          <circle key={i} cx={960} cy={580} r={r}
            fill="none" stroke="rgba(56,189,248,0.055)" strokeWidth={1} strokeDasharray="7 11" />
        ))}
        {/* Rotating accent arc */}
        <circle cx={960} cy={580} r={480}
          fill="none" stroke="rgba(167,139,250,0.04)" strokeWidth={1} />
      </svg>

      {/* Network graph */}
      <NetworkNode
        centerLabel="Tutify"
        nodes={NODES}
        startFrame={8}
        radius={242}
        cx={960}
        cy={590}
      />

      {/* Title */}
      <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: textOp, whiteSpace: 'nowrap' }}>
        <KineticText
          text="One connected platform."
          mode="blur-in"
          startFrame={55}
          fontSize={66}
          fontWeight={700}
          color="#F8FAFC"
          letterSpacing="-0.045em"
          textAlign="center"
        />
        <div style={{ marginTop: 14 }}>
          <KineticText
            text="Connecting teachers, students, parents, and schools."
            mode="fade-up"
            startFrame={72}
            fontSize={26}
            fontWeight={400}
            color="rgba(248,250,252,0.5)"
            letterSpacing="-0.01em"
            textAlign="center"
          />
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        position: 'absolute',
        bottom: 76,
        left: '50%',
        transform: `translateX(-50%) translateY(${statsY}px)`,
        display: 'flex',
        gap: 72,
        opacity: statsOp,
        whiteSpace: 'nowrap',
      }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Sora", sans-serif', fontSize: 38, fontWeight: 700,
              color: '#38BDF8', letterSpacing: '-0.04em',
              textShadow: '0 0 30px rgba(56,189,248,0.45)',
            }}>{stat.value}</div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 13,
              color: 'rgba(248,250,252,0.42)', marginTop: 5,
              letterSpacing: '0.03em', textTransform: 'uppercase',
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {closeOp > 0 && (
        <AbsoluteFill style={{ background: `rgba(7,8,15,${closeOp})`, zIndex: 200 }} />
      )}
    </AbsoluteFill>
  )
}

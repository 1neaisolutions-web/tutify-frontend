// Scene 08 — Worksheet Generation Transformation (frames 1764–2016)
// "Worksheets used to take hours. Now they take seconds."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { theme } from '../theme'

export const Scene08WorksheetGeneration: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Paper chaos — left side dissolves away
  const paperOpacity = interpolate(frame, [0, 30, 90, 130], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Particles flow right during transformation
  const particleStart = 90
  const particleOpacity = interpolate(frame, [particleStart, particleStart + 15, particleStart + 60, particleStart + 80], [0, 0.8, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Worksheet card slides in from right
  const cardSpring = spring({ frame: frame - 110, fps, config: theme.spring.snappy })
  const cardX = interpolate(cardSpring, [0, 1], [200, 0])
  const cardOpacity = interpolate(frame, [110, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Label
  const labelOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(140deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      {/* LEFT — Paper chaos */}
      <div style={{
        position: 'absolute',
        left: 120,
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: paperOpacity,
      }}>
        <PaperChaos />
      </div>

      {/* Transformation particles */}
      {frame >= particleStart && (
        <TransformParticles frame={frame} startFrame={particleStart} opacity={particleOpacity} />
      )}

      {/* RIGHT — Clean worksheet card */}
      <div style={{
        position: 'absolute',
        right: 120,
        top: '50%',
        transform: `translateY(-50%) translateX(${cardX}px)`,
        opacity: cardOpacity,
      }}>
        <WorksheetCard />
      </div>

      {/* Central arrow */}
      {frame >= 100 && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: interpolate(frame, [100, 130, 220, 240], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            fontFamily: theme.fonts.headline,
            fontSize: 52,
            color: theme.colors.skyBlue,
            opacity: 0.7,
          }}>→</div>
        </div>
      )}

      {/* Bottom label */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 32,
        fontWeight: 700,
        color: theme.colors.white,
      }}>
        From <span style={{ color: '#FF6B6B', textDecoration: 'line-through', opacity: 0.8 }}>hours</span>
        {' '}→ to{' '}
        <span style={{ color: theme.colors.teal }}>seconds.</span>
      </div>
    </AbsoluteFill>
  )
}

const PaperChaos: React.FC = () => {
  const papers = [
    { x: 0,   y: 0,   rot: -12 },
    { x: 40,  y: 30,  rot:  8 },
    { x: -30, y: 60,  rot: -5 },
    { x: 20,  y: 120, rot: 15 },
    { x: -20, y: 150, rot: -9 },
    { x: 50,  y: 200, rot:  6 },
  ]
  return (
    <div style={{ position: 'relative', width: 400, height: 360 }}>
      {papers.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x + 80,
          top: p.y,
          width: 260,
          height: 180,
          background: 'rgba(245,249,255,0.06)',
          border: '1px solid rgba(245,249,255,0.12)',
          borderRadius: 4,
          transform: `rotate(${p.rot}deg)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {/* Paper lines */}
          {Array.from({ length: 7 }, (_, j) => (
            <div key={j} style={{
              height: 1.5,
              background: 'rgba(245,249,255,0.12)',
              margin: `${20 + j * 20}px 20px 0`,
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

const TransformParticles: React.FC<{ frame: number; startFrame: number; opacity: number }> = ({ frame, startFrame, opacity }) => {
  const t = frame - startFrame
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: 200 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 400,
    y: 200 + (Math.sin(i * 5.3) * 0.5 + 0.5) * 600,
    speed: (Math.sin(i * 2.1) * 0.5 + 0.5) * 5 + 2,
    phase: Math.sin(i * 4.9) * Math.PI,
  }))
  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const px = p.x + t * p.speed + Math.sin(t * 0.05 + p.phase) * 20
        const py = p.y + Math.sin(t * 0.03 + p.phase) * 15
        const alpha = Math.max(0, 1 - t / 60)
        return (
          <circle key={i} cx={px} cy={py} r={3} fill={theme.colors.skyBlue} opacity={alpha * 0.7} />
        )
      })}
    </svg>
  )
}

const WorksheetCard: React.FC = () => (
  <GlassCard width={500} height={520} glowColor={theme.colors.skyBlue} glowIntensity={0.6} borderRadius={20}>
    <div style={{ padding: '28px 32px', height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(90deg, ${theme.colors.skyBlue}22, ${theme.colors.teal}18)`,
        borderRadius: 10,
        padding: '14px 20px',
        marginBottom: 18,
        borderLeft: `3px solid ${theme.colors.skyBlue}`,
      }}>
        <div style={{ fontFamily: theme.fonts.headline, fontSize: 18, fontWeight: 700, color: theme.colors.white }}>
          Worksheet — Grade 9 Science
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.skyBlue, marginTop: 4, letterSpacing: 0.5 }}>
          Photosynthesis & Cellular Respiration
        </div>
      </div>

      {/* Section label */}
      <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.teal, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>
        SECTION A — MULTIPLE CHOICE
      </div>

      {/* Question blocks */}
      {[
        'Which organelle is responsible for photosynthesis?',
        'What is the primary product of the light-dependent reactions?',
        'Compare the inputs and outputs of cellular respiration.',
      ].map((q, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: 'rgba(245,249,255,0.85)', lineHeight: 1.4, marginBottom: 8 }}>
            {i + 1}. {q}
          </div>
          {i < 2 && (
            <div style={{ display: 'flex', gap: 12, paddingLeft: 16 }}>
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div key={opt} style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  border: `1.5px solid rgba(245,249,255,0.25)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: theme.fonts.body, fontSize: 12, color: 'rgba(245,249,255,0.6)',
                }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
          {i === 2 && (
            <div style={{ height: 40, borderBottom: '1px solid rgba(245,249,255,0.15)', marginLeft: 16, marginRight: 8 }} />
          )}
        </div>
      ))}

      {/* Footer badge */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTop: '1px solid rgba(245,249,255,0.08)',
      }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: 'rgba(245,249,255,0.4)' }}>
          Generated by Tutify AI
        </div>
        <div style={{
          background: `${theme.colors.teal}20`,
          border: `1px solid ${theme.colors.teal}40`,
          borderRadius: 6, padding: '3px 10px',
          fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.teal, fontWeight: 600,
        }}>
          Print-ready
        </div>
      </div>
    </div>
  </GlassCard>
)

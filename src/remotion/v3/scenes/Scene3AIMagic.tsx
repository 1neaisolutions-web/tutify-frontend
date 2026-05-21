import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { KineticText } from '../components/KineticText'
import { UICard } from '../components/UICard'
import { ParticleField } from '../components/ParticleField'

export const SCENE3_DURATION = 300

const PROMPT = 'Create a Grade 6 science lesson about volcanoes.'

const OUTPUT_CARDS = [
  { title: 'Lesson Plan',    subtitle: 'Volcanoes — Grade 6',           icon: '📋', delay: 142 },
  { title: 'Quiz',           subtitle: '10 Multiple Choice Questions',  icon: '❓', delay: 162 },
  { title: 'Worksheet',      subtitle: 'Fill in the Blanks + Diagram',  icon: '📝', delay: 182 },
  { title: 'Class Activity', subtitle: 'Build a Volcano Model',         icon: '🧪', delay: 202 },
]

export const Scene3AIMagic: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Opening from white/dark
  const openOp = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Typewriter: starts at frame 38, 1 char per 2.2 frames
  const typedChars = Math.floor(Math.max(0, frame - 38) / 2.2)
  const displayedText = PROMPT.slice(0, typedChars)
  const isTyping = typedChars < PROMPT.length && frame >= 38
  const typingDone = typedChars >= PROMPT.length
  const showCursor = isTyping || (typingDone && frame < 128 && (frame % 28) < 14)

  // Button glow at click (frame 122)
  const btnGlow = interpolate(frame, [122, 135], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    * interpolate(frame, [135, 158], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Generation pulse burst
  const genPulse = interpolate(frame, [128, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    * interpolate(frame, [165, 210], [1, 0.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Closing
  const closeOp = interpolate(frame, [SCENE3_DURATION - 18, SCENE3_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: '#07080F', overflow: 'hidden', opacity: openOp }}>
      {/* Subtle grid */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Particle field */}
      <ParticleField count={28} color1="#38BDF8" color2="#34D399" />

      {/* Generation radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900, height: 900,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(56,189,248,${genPulse * 0.14}) 0%, transparent 68%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
        <KineticText text="Meet Tutify." mode="blur-in" startFrame={0} fontSize={80} fontWeight={700} color="#F8FAFC" letterSpacing="-0.045em" textAlign="center" />
        <div style={{ marginTop: 14 }}>
          <KineticText text="Your AI-powered teaching assistant." mode="blur-in" startFrame={16} fontSize={32} fontWeight={400} color="rgba(56,189,248,0.82)" letterSpacing="-0.01em" textAlign="center" />
        </div>
      </div>

      {/* AI Input + Output column */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -46%)',
        width: 880,
        marginTop: 28,
      }}>
        {/* Input card */}
        <UICard
          startFrame={22}
          width={880}
          height={116}
          glowColor={`rgba(56,189,248,${0.18 + btnGlow * 0.55})`}
          style={{ padding: '0 30px', display: 'flex', alignItems: 'center', gap: 18 }}
        >
          {/* Tutify spark icon */}
          <div style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #38BDF8 0%, #34D399 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: 22,
            boxShadow: `0 0 ${16 + btnGlow * 30}px rgba(56,189,248,0.45)`,
          }}>✦</div>

          {/* Typed prompt */}
          <div style={{
            flex: 1,
            fontFamily: '"DM Sans", "Inter", sans-serif',
            fontSize: 22,
            color: 'rgba(248,250,252,0.88)',
            letterSpacing: '-0.01em',
            minHeight: 28,
          }}>
            {displayedText}
            {showCursor && (
              <span style={{
                display: 'inline-block',
                width: 2,
                height: '1.1em',
                background: '#38BDF8',
                marginLeft: 3,
                verticalAlign: 'text-bottom',
                boxShadow: '0 0 8px rgba(56,189,248,0.9)',
              }} />
            )}
          </div>

          {/* Generate button */}
          <div style={{
            padding: '11px 26px',
            background: 'linear-gradient(135deg, #38BDF8 0%, #34D399 100%)',
            borderRadius: 11,
            fontFamily: '"Sora", sans-serif',
            fontSize: 16,
            fontWeight: 700,
            color: '#07080F',
            whiteSpace: 'nowrap',
            boxShadow: `0 0 ${18 + btnGlow * 45}px rgba(56,189,248,${0.28 + btnGlow * 0.55})`,
            transform: `scale(${1 + btnGlow * 0.04})`,
            opacity: typingDone ? 1 : 0.45,
            transition: 'opacity 0.3s',
          }}>
            {frame >= 125 && frame < 142 ? '●●●' : 'Generate ✦'}
          </div>
        </UICard>

        {/* Output cards 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
          {OUTPUT_CARDS.map((card, i) => {
            const cf = Math.max(0, frame - card.delay)
            const cP = spring({ frame: cf, fps, config: { damping: 80, stiffness: 200 } })
            const cOp = interpolate(cP, [0, 1], [0, 1])
            const cY  = interpolate(cP, [0, 1], [28, 0])
            const streamLines = Math.min(4, Math.floor(Math.max(0, frame - card.delay - 8) / 9))

            return (
              <div key={i} style={{ opacity: cOp, transform: `translateY(${cY}px)` }}>
                <div style={{
                  background: 'rgba(255,255,255,0.038)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 16,
                  padding: '20px 22px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 28 }}>{card.icon}</span>
                    <div>
                      <div style={{ fontFamily: '"Sora", sans-serif', fontSize: 17, fontWeight: 700, color: '#F8FAFC' }}>{card.title}</div>
                      <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#38BDF8', marginTop: 2 }}>{card.subtitle}</div>
                    </div>
                    {/* Done checkmark */}
                    {streamLines >= 4 && (
                      <div style={{
                        marginLeft: 'auto',
                        width: 22, height: 22,
                        borderRadius: '50%',
                        background: 'rgba(52,211,153,0.2)',
                        border: '1px solid #34D399',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: '#34D399',
                      }}>✓</div>
                    )}
                  </div>

                  {/* Streaming content bars */}
                  {Array.from({ length: streamLines }, (_, li) => {
                    const fillPct = Math.min(100, Math.max(0, (frame - card.delay - 8 - li * 9) * 6))
                    return (
                      <div key={li} style={{
                        height: 7,
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: 4,
                        marginBottom: 7,
                        width: `${60 + (li % 3) * 14}%`,
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(90deg, rgba(56,189,248,0.35), rgba(52,211,153,0.35))',
                          width: `${fillPct}%`,
                          borderRadius: 4,
                        }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Caption */}
        <div style={{
          textAlign: 'center', marginTop: 22,
          opacity: interpolate(frame, [245, 265], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 20, color: 'rgba(248,250,252,0.45)', letterSpacing: '0.015em' }}>
            From prompt to classroom — in seconds.
          </span>
        </div>
      </div>

      {/* Closing dark fade */}
      {closeOp > 0 && (
        <AbsoluteFill style={{ background: `rgba(7,8,15,${closeOp})`, zIndex: 200 }} />
      )}
    </AbsoluteFill>
  )
}

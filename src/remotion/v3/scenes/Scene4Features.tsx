import React from 'react'
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import volcanoDiagram from '../volcano-diagram.png'
import historyIllustration from '../history-illustration.png'
import { KineticText } from '../components/KineticText'
import { UICard } from '../components/UICard'
import { ParticleField } from '../components/ParticleField'

export const SCENE4_DURATION = 600

// Crossfade helper
const xfade = (frame: number, inStart: number, outStart: number, dur = 22) => {
  const fadeIn  = interpolate(frame, [inStart,  inStart  + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const fadeOut = outStart > 0
    ? interpolate(frame, [outStart, outStart + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1
  return Math.min(fadeIn, fadeOut)
}

const QUIZ_ROWS = [
  { q: 'What is the capital of France?',     a: 'Paris',  correct: true },
  { q: 'Chemical symbol for Gold?',          a: 'Au',     correct: true },
  { q: 'Year WWI ended?',                    a: '1918',   correct: true },
]

const YT_OUTPUTS = ['Quiz: 10 Questions', 'Discussion Prompts', 'Debate Topics']

const PERSON_NODES = [
  { label: 'Region',        value: 'Middle East',    color: '#38BDF8', delay: 468 },
  { label: 'Curriculum',    value: 'UAE National',   color: '#34D399', delay: 484 },
  { label: 'Teaching Style',value: 'Inquiry-Based',  color: '#F59E0B', delay: 500 },
  { label: 'Preferences',   value: 'Visual Learners',color: '#A78BFA', delay: 516 },
]

const BAR_HEIGHTS = [30, 44, 36, 50, 39, 54, 46, 60]

export const Scene4Features: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const openOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const closeOp = interpolate(frame, [SCENE4_DURATION - 18, SCENE4_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const aOp = xfade(frame, 0,   130)
  const bOp = xfade(frame, 150, 280)
  const cOp = xfade(frame, 300, 430)
  const dOp = xfade(frame, 450, 0)

  // Feature A — slider progress
  const sliderPct = interpolate(frame, [40, 115], [18, 76], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Feature C — YouTube progress bar
  const ytPct = interpolate(frame, [310, 372], [0, 68], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ytTransformP = spring({ frame: Math.max(0, frame - 380), fps, config: { damping: 80, stiffness: 160 } })

  return (
    <AbsoluteFill style={{ background: '#07080F', overflow: 'hidden', opacity: openOp }}>
      {/* Grid background */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
      <ParticleField count={18} color1="#38BDF8" color2="#34D399" />

      {/* ═══ FEATURE A — Quizzes & Worksheets ═══════════════════════════ */}
      <AbsoluteFill style={{ opacity: aOp }}>
        <div style={{ position: 'absolute', top: 78, left: 100 }}>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#38BDF8', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 14 }}>
            Feature 01
          </div>
          <KineticText text="Quizzes &"   mode="fade-up" startFrame={0}  fontSize={74} fontWeight={700} color="#F8FAFC" letterSpacing="-0.045em" />
          <KineticText text="Worksheets"  mode="fade-up" startFrame={10} fontSize={74} fontWeight={700} color="#38BDF8" letterSpacing="-0.045em" />
          <div style={{ marginTop: 22 }}>
            <KineticText text="Generate in seconds. Export in one click." mode="fade-up" startFrame={30} fontSize={24} fontWeight={400} color="rgba(248,250,252,0.58)" letterSpacing="-0.01em" />
          </div>
        </div>

        <div style={{ position: 'absolute', right: 90, top: '50%', transform: 'translateY(-50%)', width: 570 }}>
          {/* Difficulty slider */}
          <UICard startFrame={18} width={570} height={82} style={{ padding: '0 28px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: 'rgba(248,250,252,0.55)', whiteSpace: 'nowrap' }}>Difficulty</span>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.09)', borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'linear-gradient(90deg, #38BDF8, #34D399)', borderRadius: 2, width: `${sliderPct}%` }} />
              <div style={{
                position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                left: `${sliderPct}%`, width: 18, height: 18, borderRadius: '50%',
                background: '#38BDF8', boxShadow: '0 0 12px rgba(56,189,248,0.85)',
              }} />
            </div>
            <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 15, fontWeight: 700, color: '#38BDF8', whiteSpace: 'nowrap' }}>Medium</span>
          </UICard>

          {/* Quiz question rows */}
          {QUIZ_ROWS.map((row, i) => {
            const rOp = interpolate(frame - (40 + i * 22), [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            const rY  = interpolate(frame - (40 + i * 22), [0, 16], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            return (
              <div key={i} style={{ opacity: rOp, transform: `translateY(${rY}px)`, marginBottom: 12 }}>
                <div style={{
                  background: 'rgba(255,255,255,0.038)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '14px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                }}>
                  <div>
                    <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(248,250,252,0.45)', marginBottom: 4 }}>Q{i + 1}</div>
                    <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 17, color: '#F8FAFC' }}>{row.q}</div>
                  </div>
                  <div style={{
                    fontFamily: '"Sora", sans-serif', fontSize: 16, fontWeight: 700, color: '#34D399',
                    background: 'rgba(52,211,153,0.1)', padding: '6px 16px', borderRadius: 8, whiteSpace: 'nowrap',
                  }}>{row.a}</div>
                </div>
              </div>
            )
          })}

          {/* Export row */}
          <div style={{
            marginTop: 18,
            opacity: interpolate(frame, [102, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            display: 'flex', gap: 12,
          }}>
            {['Export PDF', 'Export DOCX', 'Share Link'].map((btn, i) => (
              <div key={i} style={{
                padding: '10px 20px',
                background: i === 0 ? 'linear-gradient(135deg, #38BDF8, #34D399)' : 'rgba(255,255,255,0.055)',
                border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.09)',
                borderRadius: 8,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14, fontWeight: i === 0 ? 700 : 400,
                color: i === 0 ? '#07080F' : 'rgba(248,250,252,0.65)',
              }}>{btn}</div>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* ═══ FEATURE B — Image Studio ════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: bOp }}>
        <div style={{ position: 'absolute', top: 78, left: 100 }}>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#34D399', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 14 }}>
            Feature 02
          </div>
          <KineticText text="Image Studio" mode="fade-up" startFrame={150} fontSize={74} fontWeight={700} color="#F8FAFC" letterSpacing="-0.045em" />
          <div style={{ marginTop: 22 }}>
            <KineticText text="Turn complex ideas into visual learning." mode="fade-up" startFrame={165} fontSize={24} fontWeight={400} color="rgba(248,250,252,0.58)" />
          </div>
        </div>

        <div style={{
          position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', gap: 26, alignItems: 'flex-start',
        }}>
          {/* Volcano diagram */}
          <div style={{
            opacity: interpolate(frame, [162, 192], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(frame, [162, 192], [0.84, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.038)',
              border: '1px solid rgba(52,211,153,0.32)',
              borderRadius: 16, overflow: 'hidden',
              width: 320, height: 238,
              boxShadow: '0 0 50px rgba(52,211,153,0.14)',
            }}>
              <Img src={volcanoDiagram} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(248,250,252,0.42)', textAlign: 'center', marginTop: 9 }}>
              Volcano Cross-Section
            </div>
          </div>

          {/* History illustration */}
          <div style={{
            opacity: interpolate(frame, [185, 215], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(frame, [185, 215], [0.84, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}) translateY(-22px)`,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.038)',
              border: '1px solid rgba(56,189,248,0.32)',
              borderRadius: 16, overflow: 'hidden',
              width: 320, height: 238,
              boxShadow: '0 0 50px rgba(56,189,248,0.13)',
            }}>
              <Img src={historyIllustration} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(248,250,252,0.42)', textAlign: 'center', marginTop: 9 }}>
              Ancient Civilizations
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: interpolate(frame, [168, 188], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          whiteSpace: 'nowrap',
        }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 10px rgba(52,211,153,0.9)' }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 17, color: 'rgba(248,250,252,0.55)' }}>
            Generated by Tutify AI · 2 images in 3 seconds
          </span>
        </div>
      </AbsoluteFill>

      {/* ═══ FEATURE C — YouTube Learning ════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: cOp }}>
        <div style={{ position: 'absolute', top: 78, left: 100 }}>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#F59E0B', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 14 }}>
            Feature 03
          </div>
          <KineticText text="YouTube"   mode="fade-up" startFrame={300} fontSize={74} fontWeight={700} color="#F8FAFC" letterSpacing="-0.045em" />
          <KineticText text="Learning"  mode="fade-up" startFrame={310} fontSize={74} fontWeight={700} color="#F59E0B" letterSpacing="-0.045em" />
          <div style={{ marginTop: 22 }}>
            <KineticText text="Transform any video into classroom activities." mode="fade-up" startFrame={325} fontSize={24} fontWeight={400} color="rgba(248,250,252,0.58)" />
          </div>
        </div>

        <div style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', width: 640 }}>
          {/* YouTube player mockup */}
          <div style={{
            opacity: interpolate(frame, [312, 334], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(ytTransformP, [0, 1], [1, 0.76])}) translateY(${interpolate(ytTransformP, [0, 1], [0, -85])}px)`,
            transformOrigin: 'top center',
          }}>
            <div style={{ background: '#0F0F0F', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div style={{ height: 200, background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 0, height: 0, borderTop: '13px solid transparent', borderBottom: '13px solid transparent', borderLeft: '22px solid #FF0000', marginLeft: 4 }} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: 4, background: '#FF0000', width: `${ytPct}%` }} />
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.09)' }} />
                <div>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: '#F8FAFC' }}>World War I: Causes & Effects</div>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(248,250,252,0.38)' }}>History Channel · 1.2M views</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI transform spark */}
          <div style={{
            position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%)',
            opacity: interpolate(frame, [380, 400], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #38BDF8, #34D399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, boxShadow: '0 0 35px rgba(56,189,248,0.55)',
            }}>✦</div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(248,250,252,0.42)', marginTop: 6 }}>AI Transforms</div>
          </div>

          {/* Output activity list */}
          <div style={{
            marginTop: 24,
            opacity: interpolate(frame, [402, 420], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            {YT_OUTPUTS.map((item, i) => {
              const iOp = interpolate(frame, [402 + i * 14, 416 + i * 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              return (
                <div key={i} style={{
                  opacity: iOp, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
                  background: 'rgba(255,255,255,0.038)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '12px 18px',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px rgba(56,189,248,0.85)' }} />
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, color: '#F8FAFC' }}>{item}</span>
                  <div style={{ marginLeft: 'auto', fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '3px 12px', borderRadius: 6 }}>
                    Ready
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* ═══ FEATURE D — Personalized Learning ══════════════════════════ */}
      <AbsoluteFill style={{ opacity: dOp }}>
        <div style={{ position: 'absolute', top: 78, left: 100 }}>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A78BFA', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 14 }}>
            Feature 04
          </div>
          <KineticText text="Personalized"    mode="fade-up" startFrame={450} fontSize={74} fontWeight={700} color="#F8FAFC" letterSpacing="-0.045em" />
          <KineticText text="Learning Paths"  mode="fade-up" startFrame={460} fontSize={74} fontWeight={700} color="#A78BFA" letterSpacing="-0.045em" />
          <div style={{ marginTop: 22 }}>
            <KineticText text="Tailored to every educator's unique needs." mode="fade-up" startFrame={476} fontSize={24} fontWeight={400} color="rgba(248,250,252,0.58)" />
          </div>
        </div>

        <div style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', width: 590 }}>
          {/* Profile header card */}
          <UICard startFrame={454} width={590} height={90} glowColor="rgba(167,139,250,0.28)" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #A78BFA, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👩‍🏫</div>
            <div>
              <div style={{ fontFamily: '"Sora", sans-serif', fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>Sarah Al-Rashidi</div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(248,250,252,0.45)' }}>Grade 6–8 · Science · UAE</div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A78BFA', background: 'rgba(167,139,250,0.1)', padding: '4px 14px', borderRadius: 6, whiteSpace: 'nowrap' }}>
              AI Matched
            </div>
          </UICard>

          {/* Adaptation nodes */}
          {PERSON_NODES.map((node, i) => {
            const nOp = interpolate(frame, [node.delay, node.delay + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            const nY  = interpolate(frame, [node.delay, node.delay + 16], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            return (
              <div key={i} style={{
                opacity: nOp, transform: `translateY(${nY}px)`,
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,255,255,0.028)', border: `1px solid ${node.color}28`,
                borderRadius: 10, padding: '12px 20px', marginBottom: 10,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: 'rgba(248,250,252,0.5)' }}>{node.label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: '"Sora", sans-serif', fontSize: 14, fontWeight: 600, color: node.color }}>{node.value}</span>
              </div>
            )
          })}

          {/* Engagement graph */}
          <div style={{
            marginTop: 16,
            opacity: interpolate(frame, [524, 544], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '16px 22px',
          }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(248,250,252,0.38)', marginBottom: 12 }}>Engagement Score</div>
            <svg width={546} height={52}>
              {BAR_HEIGHTS.map((h, i) => {
                const barP = interpolate(frame, [532 + i * 5, 544 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                return (
                  <rect key={i} x={i * 70 + 8} y={52 - h * barP} width={52} height={h * barP}
                    rx={4} fill={`rgba(167,139,250,${0.38 + i * 0.065})`} />
                )
              })}
            </svg>
          </div>
        </div>
      </AbsoluteFill>

      {/* Closing */}
      {closeOp > 0 && (
        <AbsoluteFill style={{ background: `rgba(7,8,15,${closeOp})`, zIndex: 200 }} />
      )}
    </AbsoluteFill>
  )
}

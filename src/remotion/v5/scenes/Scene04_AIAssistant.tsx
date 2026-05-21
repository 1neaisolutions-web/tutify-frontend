/**
 * Scene 04b V5 — AI Content Generator (enhanced from v4)
 *
 * Key improvements:
 * - Cleaner light background (no grid clutter)
 * - More premium prompt card with better shadow/glow
 * - Smoother slide-to-left with better timing
 * - Output cards: larger content area, bolder titles
 * - Better connection arrows (gradient + dot-pulse)
 * - Speed badge: more prominent "Generated in 0.8s"
 *
 * Duration: 330f (11s) — 30f tighter than v4
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { AnimatedGradientBG } from '../../v4/components/AnimatedGradientBG'
import { SectionChip } from '../components/SectionChip'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'

export const SCENE04_DURATION = 330

const PROMPT_TEXT = 'Generate a Grade 8 science quiz, worksheet, and lesson plan on the water cycle.'

const INPUT_W = 600
const INPUT_H = 350
const CARD_W = 540
const CARD_H = 206
const CARD_GAP = 14

const INPUT_CX = (1920 - INPUT_W) / 2
const INPUT_CY = (1080 - INPUT_H) / 2 - 20
const INPUT_LEFT = 88
const INPUT_TOP  = 256

const RIGHT_X = 1920 - 88 - CARD_W
const CARDS_TOP = 180

const GENERATE_CLICK = 120
const SLIDE_START    = 130
const GENERATING_END = 240

const OUTPUT_CARDS = [
  { icon: '🎯', title: 'Quiz', subtitle: 'The Water Cycle · Grade 8', color: theme.colors.primary, delay: 164, arrowEndY: CARDS_TOP + CARD_H / 2 },
  { icon: '📋', title: 'Worksheet', subtitle: 'Practice set · 15 min', color: theme.colors.emerald, delay: 204, arrowEndY: CARDS_TOP + CARD_H + CARD_GAP + CARD_H / 2 },
  { icon: '📚', title: 'Lesson Plan', subtitle: '45 min · IB aligned', color: theme.colors.gold, delay: 244, arrowEndY: CARDS_TOP + 2 * (CARD_H + CARD_GAP) + CARD_H / 2 },
]

const PROC_STEPS = [
  { text: 'Parsing topic: The Water Cycle…', delay: 136 },
  { text: 'Building quiz & worksheet items…', delay: 152 },
  { text: 'Formatting lesson plan template…', delay: 168 },
]

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase', fontFamily: theme.font.display,
}
const bodyStyle: React.CSSProperties = {
  fontSize: 12, lineHeight: 1.45,
  color: theme.colors.textMuted, fontFamily: theme.font.display,
}

const QuizPreview: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <div style={{ ...labelStyle, color: theme.colors.primary }}>Section A — Multiple choice</div>
    <div style={bodyStyle}><strong style={{ color: theme.colors.text }}>1.</strong> What process turns water vapor into liquid droplets?
      <div style={{ marginTop: 3, paddingLeft: 14, fontSize: 11 }}>A) Evaporation &nbsp; <span style={{ color: theme.colors.emerald, fontWeight: 700 }}>B) Condensation</span> &nbsp; C) Runoff</div>
    </div>
    <div style={bodyStyle}><strong style={{ color: theme.colors.text }}>2.</strong> Where does most evaporation occur?
      <div style={{ marginTop: 3, paddingLeft: 14, fontSize: 11 }}>A) Rivers &nbsp; B) Soil &nbsp; <span style={{ color: theme.colors.emerald, fontWeight: 700 }}>C) Oceans</span></div>
    </div>
  </div>
)

const WorksheetPreview: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <div style={{ ...labelStyle, color: theme.colors.emerald }}>Section A — Fill in the blanks</div>
    <div style={bodyStyle}>1. Water turning into vapor is called _______________.</div>
    <div style={bodyStyle}>2. Clouds form when water vapor _______________.</div>
    <div style={bodyStyle}>3. Water that soaks into the ground is _______________.</div>
    <div style={{ ...labelStyle, color: theme.colors.emerald, marginTop: 2 }}>Section B — Short answer</div>
    <div style={bodyStyle}>4. Name two places water is stored in the water cycle.</div>
  </div>
)

const LessonPlanPreview: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ ...labelStyle, color: theme.colors.gold }}>45 min · Grade 8 Science</div>
    <div style={{ ...bodyStyle, color: theme.colors.text, fontWeight: 600, fontSize: 11.5 }}>Objective: Students explain evaporation, condensation & precipitation.</div>
    <div style={bodyStyle}><span style={{ color: theme.colors.gold, fontWeight: 700 }}>0–8 min</span> — Hook: cloud-in-a-jar demo</div>
    <div style={bodyStyle}><span style={{ color: theme.colors.gold, fontWeight: 700 }}>8–25 min</span> — Diagram labeling + pair discussion</div>
    <div style={bodyStyle}><span style={{ color: theme.colors.gold, fontWeight: 700 }}>25–45 min</span> — Exit ticket quiz (printed)</div>
  </div>
)

const PREVIEWS = [QuizPreview, WorksheetPreview, LessonPlanPreview]

function arrowPath(x1: number, y1: number, x2: number, y2: number): string {
  const cx1 = x1 + (x2 - x1) * 0.40
  const cx2 = x1 + (x2 - x1) * 0.65
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`
}

export const Scene04_AIAssistant: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fg = sceneMaster(frame, SCENE04_DURATION)

  const slideP = spring({
    frame: Math.max(0, frame - SLIDE_START),
    fps,
    config: { damping: 210, stiffness: 68, mass: 1 },
  })
  const inputLeft = interpolate(slideP, [0, 1], [INPUT_CX, INPUT_LEFT], { extrapolateRight: 'clamp' })
  const inputTop  = interpolate(slideP, [0, 1], [INPUT_CY, INPUT_TOP], { extrapolateRight: 'clamp' })

  const entranceP = spring({ frame: Math.max(0, frame - 6), fps, config: theme.spring.zoom })
  const inputOp   = interpolate(entranceP, [0, 1], [0, 1]) * fg
  const inputSc   = frame < SLIDE_START ? interpolate(entranceP, [0, 1], [0.9, 1]) : 1

  const charCount = Math.floor(
    interpolate(frame, [28, 92], [0, PROMPT_TEXT.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  )
  const cursorBlink = frame % 18 < 9 && frame < GENERATE_CLICK

  const btnP = spring({ frame: Math.max(0, frame - 100), fps, config: theme.spring.zoom })
  const btnVisible = btnP > 0.02

  // Click flash
  const clickFlash = interpolate(
    frame, [GENERATE_CLICK, GENERATE_CLICK + 4, GENERATE_CLICK + 16], [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Generating state
  const isGenerating = frame >= GENERATE_CLICK + 4 && frame < GENERATING_END
  const isDone = frame >= GENERATING_END
  const spinnerRot = isGenerating ? (frame - GENERATE_CLICK) * 14 : 0

  // Border glow on click
  const clickGlow = interpolate(
    frame, [GENERATE_CLICK, GENERATE_CLICK + 6, GENERATE_CLICK + 28], [0, 1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const inputBorder = frame >= GENERATE_CLICK
    ? `1.5px solid rgba(79,110,247,${(0.3 + clickGlow * 0.5).toFixed(3)})`
    : `1.5px solid rgba(203,213,240,0.6)`

  const inputRightX = inputLeft + INPUT_W
  const inputMidY   = inputTop + INPUT_H / 2

  // Badge
  const badgeP = spring({ frame: Math.max(0, frame - 252), fps, config: theme.spring.snappy })
  const badgeOp = interpolate(badgeP, [0, 1], [0, 1]) * fg

  // Caption
  const captionOp = interpolate(frame, [265, 285], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * fg

  // Status dot color
  const statusColor = isDone
    ? theme.colors.emerald
    : frame >= 100
    ? theme.colors.primary
    : theme.colors.textDim

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AnimatedGradientBG variant="cool" />

      <AbsoluteFill style={{ opacity: fg }}>
        {/* Section chip */}
        <div style={{ position: 'absolute', left: 120, top: 58 }}>
          <SectionChip
            label="AI Content Generator"
            startFrame={4}
            color={theme.colors.primary}
          />
        </div>

        {/* Connection arrows */}
        {frame >= GENERATE_CLICK + 8 && slideP > 0.25 && (
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} width={1920} height={1080}>
            <defs>
              <marker id="v5arr" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={theme.colors.primary} opacity={0.75} />
              </marker>
              <linearGradient id="v5line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.20} />
                <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0.80} />
              </linearGradient>
            </defs>
            {OUTPUT_CARDS.map((card, i) => {
              const drawStart = card.delay - 8
              const drawP = interpolate(frame, [drawStart, drawStart + 26], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              if (drawP <= 0) return null
              const path = arrowPath(inputRightX, inputMidY, RIGHT_X, card.arrowEndY)
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke="url(#v5line)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={520}
                  strokeDashoffset={520 * (1 - drawP)}
                  markerEnd={drawP > 0.90 ? 'url(#v5arr)' : undefined}
                  opacity={interpolate(frame, [drawStart, drawStart + 10, 308, 320], [0, 0.85, 0.85, 0], {
                    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                  })}
                />
              )
            })}
          </svg>
        )}

        {/* Prompt card */}
        <div
          style={{
            position: 'absolute',
            left: inputLeft, top: inputTop,
            opacity: inputOp,
            transform: `scale(${inputSc})`,
            transformOrigin: 'center center',
            zIndex: 4,
          }}
        >
          <div
            style={{
              width: INPUT_W, height: INPUT_H,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.96)',
              border: `1.5px solid rgba(203,213,240,0.70)`,
              boxShadow: clickGlow > 0.05
                ? `0 0 0 3px rgba(79,110,247,${(clickGlow * 0.22).toFixed(3)}), 0 16px 48px rgba(13,22,65,0.12)`
                : '0 8px 40px rgba(13,22,65,0.10)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '26px 30px', height: '100%', boxSizing: 'border-box' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `${theme.colors.primary}12`,
                    border: `1.5px solid ${theme.colors.primarySoft}`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15, color: theme.colors.primary,
                  }}
                >
                  ✦
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.textMuted, fontFamily: theme.font.display }}>
                  AI Prompt
                </span>
                <div
                  style={{
                    marginLeft: 'auto',
                    width: 8, height: 8, borderRadius: '50%',
                    background: statusColor,
                    boxShadow: isDone ? `0 0 12px ${theme.colors.emeraldGlow}` : frame >= 100 ? `0 0 8px ${theme.colors.primaryGlow}` : 'none',
                    transform: isDone ? `scale(${0.9 + Math.sin((frame / 5) * Math.PI) * 0.2})` : 'scale(1)',
                  }}
                />
              </div>

              {/* Text area */}
              <div
                style={{
                  background: `${theme.colors.primary}04`,
                  border: inputBorder,
                  borderRadius: 14,
                  padding: '16px 18px',
                  fontSize: 18, color: theme.colors.text,
                  fontFamily: theme.font.display,
                  lineHeight: 1.5, minHeight: 100,
                  transition: 'border 0.2s',
                }}
              >
                {PROMPT_TEXT.slice(0, charCount)}
                {cursorBlink && (
                  <span style={{ borderRight: `2px solid ${theme.colors.primary}`, marginLeft: 2 }}>&nbsp;</span>
                )}
              </div>

              {/* Generate button */}
              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', opacity: btnVisible ? 1 : 0 }}>
                {/* Ripple */}
                {frame >= GENERATE_CLICK && frame < GENERATE_CLICK + 24 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 48, bottom: 18,
                      width: 52, height: 52,
                      borderRadius: '50%',
                      border: `2px solid ${theme.colors.primary}`,
                      transform: `scale(${interpolate(frame, [GENERATE_CLICK, GENERATE_CLICK + 24], [0.4, 2.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
                      opacity: interpolate(frame, [GENERATE_CLICK, GENERATE_CLICK + 8, GENERATE_CLICK + 24], [0.5, 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <div
                  style={{
                    borderRadius: 12,
                    padding: '12px 28px',
                    fontSize: 15, fontWeight: 700,
                    color: '#fff',
                    fontFamily: theme.font.display,
                    display: 'flex', alignItems: 'center', gap: 9,
                    minWidth: 158, justifyContent: 'center',
                    background: frame >= GENERATE_CLICK
                      ? `linear-gradient(135deg, ${theme.colors.primaryDark}, ${theme.colors.primaryDeep})`
                      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    boxShadow: `0 4px 20px ${theme.colors.primaryGlow}`,
                  }}
                >
                  {clickFlash > 0.05 && (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(255,255,255,0.30)', opacity: clickFlash, pointerEvents: 'none' }} />
                  )}
                  {isGenerating ? (
                    <>
                      <div
                        style={{
                          width: 17, height: 17, borderRadius: '50%',
                          border: '2.5px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          transform: `rotate(${spinnerRot}deg)`,
                          flexShrink: 0,
                        }}
                      />
                      <span>Generating…</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 13 }}>✦</span>
                      <span>Generate</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing steps */}
        {frame >= GENERATE_CLICK + 6 && slideP > 0.22 && (
          <div
            style={{
              position: 'absolute',
              left: inputRightX + 32, top: inputTop + 36,
              width: 300, display: 'flex', flexDirection: 'column', gap: 13, zIndex: 3,
            }}
          >
            {PROC_STEPS.map((step, i) => {
              const stepOp = interpolate(frame, [step.delay, step.delay + 12, 222, 235], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              const stepP = spring({ frame: Math.max(0, frame - step.delay), fps, config: theme.spring.snappy })
              const stepY = interpolate(stepP, [0, 1], [12, 0])
              return (
                <div key={i} style={{ opacity: stepOp, transform: `translateY(${stepY}px)`, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: theme.colors.primary, boxShadow: `0 0 8px ${theme.colors.primaryGlow}` }} />
                  <span style={{ fontSize: 13, color: theme.colors.primary, fontFamily: theme.font.display, fontWeight: 600 }}>{step.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Speed badge */}
        {badgeOp > 0.02 && (
          <div
            style={{
              position: 'absolute',
              left: inputRightX + 72, top: inputTop + INPUT_H - 20,
              opacity: badgeOp,
              transform: `scale(${interpolate(badgeP, [0, 1], [0.8, 1])})`,
              zIndex: 5,
            }}
          >
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `${theme.colors.emerald}10`,
                border: `1.5px solid ${theme.colors.emerald}35`,
                borderRadius: 44, padding: '8px 20px',
                boxShadow: `0 4px 18px ${theme.colors.emeraldGlow}`,
              }}
            >
              <span style={{ fontSize: 13 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.emerald, fontFamily: theme.font.display }}>
                Generated in 0.8s
              </span>
            </div>
          </div>
        )}

        {/* Output cards */}
        <div style={{ position: 'absolute', left: RIGHT_X, top: CARDS_TOP, zIndex: 4 }}>
          {OUTPUT_CARDS.map((card, i) => {
            const Preview = PREVIEWS[i]
            const cardOp = interpolate(frame, [card.delay, card.delay + 18], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            }) * fg
            const cardP = spring({ frame: Math.max(0, frame - card.delay), fps, config: theme.spring.precise })
            const cardY = interpolate(cardP, [0, 1], [18, 0])
            return (
              <div
                key={card.title}
                style={{ marginBottom: CARD_GAP, opacity: cardOp, transform: `translateY(${cardY}px)` }}
              >
                <div
                  style={{
                    width: CARD_W, height: CARD_H,
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.96)',
                    border: `1.5px solid ${card.color}22`,
                    boxShadow: `0 8px 28px ${card.color}14, 0 2px 8px rgba(13,22,65,0.06)`,
                    borderLeft: `4px solid ${card.color}`,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '15px 18px 13px 22px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: `${card.color}10`,
                          border: `1.5px solid ${card.color}28`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>{card.title}</div>
                        <div style={{ fontSize: 10.5, color: card.color, fontFamily: theme.font.display, fontWeight: 600, marginTop: 2 }}>{card.subtitle}</div>
                      </div>
                      <div
                        style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: `${card.color}12`,
                          border: `1.5px solid ${card.color}38`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: card.color, flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                    </div>
                    <Preview />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Caption */}
        {captionOp > 0.02 && (
          <div
            style={{
              position: 'absolute', bottom: 52, left: 0, right: 0,
              display: 'flex', justifyContent: 'center',
              opacity: captionOp,
            }}
          >
            <div
              style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.28em',
                justifyContent: 'center',
              }}
            >
              {['Powered', 'by', 'AI.', 'Guided', 'by', 'educators.'].map((word, i) => {
                const wf = Math.max(0, frame - (265 + i * 3))
                const wp = spring({ frame: wf, fps, config: theme.spring.word })
                const wop = interpolate(wp, [0, 1], [0, 1])
                const wty = interpolate(wp, [0, 1], [18, 0])
                return (
                  <span
                    key={i}
                    style={{
                      opacity: wop, transform: `translateY(${wty}px)`,
                      display: 'inline-block',
                      fontSize: 28, fontWeight: 500,
                      color: theme.colors.textMuted,
                      fontFamily: theme.font.display,
                    }}
                  >
                    {word}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

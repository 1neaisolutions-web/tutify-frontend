/**
 * Scene 04 — AI Content Generator
 * Center prompt → slide left → arrows to Quiz / Worksheet / Lesson Plan previews.
 */
import React from 'react'
import { AbsoluteFill, Easing, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { UICard } from '../components/UICard'
import { theme } from '../theme'

import { SCENE04_DURATION as SCENE04_TARGET } from '../timeline/sceneDurations'
import { CROSSFADE } from '../utils/sceneTransition'

const PROMPT_TEXT =
  'Generate a Grade 8 science quiz, worksheet, and lesson plan on the water cycle.'

const INPUT_W = 620
const INPUT_H = 368
const CARD_W = 548
const CARD_H = 212
const CARD_GAP = 16

const INPUT_CENTER_LEFT = (1920 - INPUT_W) / 2
const INPUT_CENTER_TOP = (1080 - INPUT_H) / 2 - 24
const INPUT_LEFT = 96
const INPUT_TOP = 268

const RIGHT_X = 1920 - 96 - CARD_W
const CARDS_TOP = 188

const TYPE_START = 32
const GENERATE_CLICK = 108
const SLIDE_START = 116
const GENERATING_END = 214

const OUTPUT_CARDS = [
  { icon: '🎯', title: 'Quiz', color: theme.colors.primary, delay: 172, arrowEndY: CARDS_TOP + CARD_H / 2 },
  { icon: '📋', title: 'Worksheet', color: theme.colors.secondary, delay: 212, arrowEndY: CARDS_TOP + CARD_H + CARD_GAP + CARD_H / 2 },
  { icon: '📚', title: 'Lesson Plan', color: theme.colors.accent, delay: 252, arrowEndY: CARDS_TOP + 2 * (CARD_H + CARD_GAP) + CARD_H / 2 },
] as const

const PROC_TYPE_FRAMES = 18

const PROC_STEPS = [
  { text: 'Parsing topic: The Water Cycle …', delay: 142 },
  { text: 'Building quiz & worksheet items …', delay: 162 },
  { text: 'Formatting lesson plan template …', delay: 182 },
] as const

/** Hold full UI readable after last output card settles (~1s @ 30fps). */
const OUTPUT_SETTLE = 28
const SCENE04_HOLD_FRAMES = 30
const LAST_OUTPUT_FRAME = OUTPUT_CARDS[OUTPUT_CARDS.length - 1]!.delay + OUTPUT_SETTLE
export const SCENE04_FADE_START = LAST_OUTPUT_FRAME + SCENE04_HOLD_FRAMES
export const SCENE04_DURATION = Math.max(SCENE04_TARGET, SCENE04_FADE_START + CROSSFADE)

const TYPE_END = 98

/** Local frames for Root.tsx SFX — prompt typing + output cards only (no proc-line SFX). */
export const SCENE04_SFX_FRAMES = {
  keyboardTyping: { start: TYPE_START, duration: TYPE_END - TYPE_START },
  cardAppear: OUTPUT_CARDS.map((c) => c.delay + 10),
} as const

function procTypedText(frame: number, fullText: string, delay: number): string {
  if (frame < delay) return ''
  const chars = Math.floor(
    interpolate(frame - delay, [0, PROC_TYPE_FRAMES], [0, fullText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  return fullText.slice(0, chars)
}

const BADGE_START = LAST_OUTPUT_FRAME - 18
/** Whole-line caption — fades once, stable through hold (no per-word spring at scene end). */
const CAPTION_START = BADGE_START + 4

const CARD_SHADOW =
  '0 20px 56px rgba(91,79,207,0.12), 0 8px 24px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.98)'

const GenerateButton: React.FC<{ frame: number; fps: number; visible: boolean }> = ({ frame, fps, visible }) => {
  const clicked = frame >= GENERATE_CLICK
  const generating = frame >= GENERATE_CLICK + 4 && frame < GENERATING_END
  const done = frame >= GENERATING_END

  const pressElapsed = Math.max(0, frame - GENERATE_CLICK)
  const releaseSpring =
    pressElapsed >= 3 && pressElapsed < 16
      ? spring({ frame: pressElapsed - 3, fps, config: { damping: 14, stiffness: 280, mass: 0.6 } })
      : 1
  const pressScale =
    pressElapsed <= 0
      ? 1
      : pressElapsed < 3
        ? interpolate(pressElapsed, [0, 3], [1, 0.88], { extrapolateRight: 'clamp' })
        : interpolate(releaseSpring, [0, 1], [0.88, 1], { extrapolateRight: 'clamp' })
  const pressY =
    pressElapsed < 3 ? interpolate(pressElapsed, [0, 3], [0, 3], { extrapolateRight: 'clamp' }) : pressElapsed < 8 ? 0 : 0

  const rippleP = clicked
    ? interpolate(frame, [GENERATE_CLICK, GENERATE_CLICK + 22], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0
  const rippleScale = interpolate(rippleP, [0, 1], [0.4, 2.8])
  const rippleOp = interpolate(rippleP, [0, 0.25, 1], [0.55, 0.35, 0])

  const clickFlash = interpolate(
    frame,
    [GENERATE_CLICK, GENERATE_CLICK + 4, GENERATE_CLICK + 14],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const spinnerRot = generating ? (frame - GENERATE_CLICK) * 14 : 0
  const genPulse = generating ? 0.96 + Math.sin((frame / 6) * Math.PI) * 0.03 : 1
  const idlePulse =
    visible && !clicked ? 1 + Math.sin((frame / 10) * Math.PI) * 0.025 : 1

  if (!visible) return null

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
      {rippleOp > 0.01 && (
        <div
          style={{
            position: 'absolute',
            right: 48,
            bottom: 22,
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: `2px solid ${theme.colors.primary}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOp,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          borderRadius: 12,
          padding: '13px 30px',
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          fontFamily: theme.font.display,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minWidth: 168,
          justifyContent: 'center',
          transform: `scale(${pressScale * genPulse * idlePulse}) translateY(${pressY}px)`,
          transformOrigin: 'center center',
          background: clicked
            ? `linear-gradient(135deg, ${theme.colors.primaryDark}, #2a2278)`
            : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          boxShadow: clicked
            ? `0 2px 8px ${theme.colors.primaryGlow}, inset 0 2px 6px rgba(0,0,0,0.18)`
            : `0 4px 24px ${theme.colors.primaryGlow}`,
          opacity: done ? 0.92 : 1,
        }}
      >
        {clickFlash > 0.05 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.35)',
              opacity: clickFlash,
              pointerEvents: 'none',
            }}
          />
        )}
        {generating ? (
          <>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2.5px solid rgba(255,255,255,0.35)',
                borderTopColor: '#fff',
                transform: `rotate(${spinnerRot}deg)`,
                flexShrink: 0,
              }}
            />
            <span>Generating…</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 14 }}>✦</span>
            <span>Generate</span>
          </>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  fontFamily: theme.font.display,
}

const bodyStyle: React.CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.45,
  color: theme.colors.textMuted,
  fontFamily: theme.font.display,
}

const QuizPreview: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ ...labelStyle, color: theme.colors.primary }}>Section A — Multiple choice</div>
    <div style={bodyStyle}>
      <strong style={{ color: theme.colors.text }}>1.</strong> What process turns water vapor into liquid droplets?
      <div style={{ marginTop: 4, paddingLeft: 14, fontSize: 11.5 }}>
        A) Evaporation &nbsp; <span style={{ color: theme.colors.secondary, fontWeight: 700 }}>B) Condensation</span> &nbsp; C) Runoff
      </div>
    </div>
    <div style={bodyStyle}>
      <strong style={{ color: theme.colors.text }}>2.</strong> Where does most evaporation on Earth occur?
      <div style={{ marginTop: 4, paddingLeft: 14, fontSize: 11.5 }}>A) Rivers &nbsp; B) Soil &nbsp; <span style={{ color: theme.colors.secondary, fontWeight: 700 }}>C) Oceans</span></div>
    </div>
    <div style={bodyStyle}>
      <strong style={{ color: theme.colors.text }}>3.</strong> Precipitation returns water to Earth mainly as _____.
    </div>
  </div>
)

const WorksheetPreview: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ ...labelStyle, color: theme.colors.secondary }}>Section A — Fill in the blanks</div>
    <div style={bodyStyle}>1. Water turning into vapor is called _______________.</div>
    <div style={bodyStyle}>2. Clouds form when water vapor _______________.</div>
    <div style={bodyStyle}>3. Water that soaks into the ground is called _______________.</div>
    <div style={{ ...labelStyle, color: theme.colors.secondary, marginTop: 2 }}>Section B — Short answer</div>
    <div style={bodyStyle}>4. Name two places water is stored in the water cycle.</div>
  </div>
)

const LessonPlanPreview: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <div style={{ ...labelStyle, color: theme.colors.accent }}>45 min · Grade 8 Science</div>
    <div style={{ ...bodyStyle, color: theme.colors.text, fontWeight: 600, fontSize: 12 }}>
      Objective: Students explain evaporation, condensation & precipitation.
    </div>
    <div style={bodyStyle}>
      <span style={{ color: theme.colors.accent, fontWeight: 700 }}>0–8 min</span> — Hook: cloud-in-a-jar demo
    </div>
    <div style={bodyStyle}>
      <span style={{ color: theme.colors.accent, fontWeight: 700 }}>8–25 min</span> — Diagram labeling + pair discussion
    </div>
    <div style={bodyStyle}>
      <span style={{ color: theme.colors.accent, fontWeight: 700 }}>25–45 min</span> — Exit ticket quiz (printed)
    </div>
  </div>
)

const OUTPUT_PREVIEWS = [QuizPreview, WorksheetPreview, LessonPlanPreview]

function arrowPath(x1: number, y1: number, x2: number, y2: number): string {
  const cx1 = x1 + (x2 - x1) * 0.42
  const cx2 = x1 + (x2 - x1) * 0.68
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`
}

export const Scene04_AIAssistant: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const fadeOut = interpolate(
    frame,
    [SCENE04_FADE_START, SCENE04_FADE_START + CROSSFADE],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )
  const exitScale = interpolate(fadeOut, [0, 1], [1, 0.97], { extrapolateRight: 'clamp' })
  const fgAlpha = fadeIn * fadeOut

  const inputEntrance = spring({ frame: Math.max(0, frame - 6), fps, config: theme.spring.zoom })
  const inputEntranceScale = interpolate(inputEntrance, [0, 1], [0.88, 1])
  const inputEntranceOp = interpolate(inputEntrance, [0, 1], [0, 1])

  const slideToLeft = spring({ frame: Math.max(0, frame - SLIDE_START), fps, config: { damping: 200, stiffness: 72, mass: 1 } })
  const inputLeft = interpolate(slideToLeft, [0, 1], [INPUT_CENTER_LEFT, INPUT_LEFT], { extrapolateRight: 'clamp' })
  const inputTop = interpolate(slideToLeft, [0, 1], [INPUT_CENTER_TOP, INPUT_TOP], { extrapolateRight: 'clamp' })

  const inputOp = inputEntranceOp * fgAlpha
  const inputScale = frame < SLIDE_START ? inputEntranceScale : 1

  const charCount = Math.floor(
    interpolate(frame, [TYPE_START, 98], [0, PROMPT_TEXT.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const cursorBlink = frame % 18 < 9 && frame < GENERATE_CLICK

  const btnP = spring({ frame: Math.max(0, frame - 108), fps, config: theme.spring.zoom })
  const btnVisible = btnP > 0.02

  const cardClickGlow = interpolate(
    frame,
    [GENERATE_CLICK, GENERATE_CLICK + 6, GENERATE_CLICK + 28],
    [0, 1, 0.35],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const textareaBorder =
    frame >= GENERATE_CLICK
      ? `1.5px solid rgba(91,79,207,${0.35 + cardClickGlow * 0.45})`
      : `1.5px solid ${theme.colors.borderDim}`

  const inputRightX = inputLeft + INPUT_W
  const inputMidY = inputTop + INPUT_H / 2
  const outputStackCenterY =
    CARDS_TOP + (OUTPUT_CARDS.length * CARD_H + (OUTPUT_CARDS.length - 1) * CARD_GAP) / 2
  const procCenterX = (inputRightX + RIGHT_X) / 2
  const procCenterY = (inputMidY + outputStackCenterY) / 2

  const badgeP = spring({ frame: Math.max(0, frame - BADGE_START), fps, config: theme.spring.snappy })
  const badgeOp = interpolate(badgeP, [0, 1], [0, 1]) * fadeOut

  const captionLineIn = interpolate(frame, [CAPTION_START, CAPTION_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const captionY = interpolate(captionLineIn, [0, 1], [10, 0], { extrapolateRight: 'clamp' })
  const captionOp = captionLineIn * fadeOut

  const chipP = spring({ frame: Math.max(0, frame - 4), fps, config: theme.spring.snappy })
  const chipOp = interpolate(chipP, [0, 1], [0, 1]) * fgAlpha
  const chipLeft = interpolate(slideToLeft, [0, 1], [INPUT_CENTER_LEFT, INPUT_LEFT], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#F4F7FC' }}>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(128deg, #FAFCFF 0%, #EEF4FF 38%, #F5F0FF 72%, #F8FAFC 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-8%',
            top: '18%',
            width: '52%',
            height: '58%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${theme.colors.primary}22 0%, transparent 68%)`,
            filter: 'blur(48px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-6%',
            bottom: '8%',
            width: '48%',
            height: '52%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${theme.colors.secondary}18 0%, transparent 70%)`,
            filter: 'blur(52px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 42%, rgba(15,23,42,0.035) 100%)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: fgAlpha,
          transform: `scale(${exitScale})`,
          transformOrigin: '50% 46%',
        }}
      >
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none' }} width={1920} height={1080}>
          <defs>
            <pattern id="grid-s4" width={80} height={80} patternUnits="userSpaceOnUse">
              <path d="M80 0L0 0 0 80" fill="none" stroke={theme.colors.primary} strokeWidth={0.5} />
            </pattern>
          </defs>
          <rect width={1920} height={1080} fill="url(#grid-s4)" />
        </svg>

        {/* Arrows — input right edge → each card left edge */}
        {frame >= GENERATE_CLICK + 8 && slideToLeft > 0.25 && (
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} width={1920} height={1080}>
            <defs>
              <marker id="s4arr" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={theme.colors.primary} opacity={0.85} />
              </marker>
              <linearGradient id="s4line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.35} />
                <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            {OUTPUT_CARDS.map((card, i) => {
              const drawStart = card.delay - 8
              const drawP = interpolate(frame, [drawStart, drawStart + 28], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
              if (drawP <= 0) return null
              const path = arrowPath(inputRightX, inputMidY, RIGHT_X, card.arrowEndY)
              const pathLen = 520
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke="url(#s4line)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray={pathLen}
                  strokeDashoffset={pathLen * (1 - drawP)}
                  markerEnd={drawP > 0.92 ? 'url(#s4arr)' : undefined}
                  opacity={interpolate(frame, [drawStart, drawStart + 10, 320, 335], [0, 0.9, 0.9, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  })}
                />
              )
            })}
          </svg>
        )}

        {/* Label chip */}
        <div
          style={{
            position: 'absolute',
            left: chipLeft,
            top: interpolate(slideToLeft, [0, 1], [INPUT_CENTER_TOP - 52, 58], { extrapolateRight: 'clamp' }),
            opacity: chipOp,
            transform: `scale(${interpolate(chipP, [0, 1], [0.88, 1])})`,
            transformOrigin: 'left center',
            zIndex: 5,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(91,79,207,0.2)',
              borderRadius: 40,
              padding: '7px 18px 7px 14px',
              boxShadow: '0 4px 20px rgba(91,79,207,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: theme.colors.primary,
                boxShadow: `0 0 9px ${theme.colors.primaryGlow}`,
              }}
            />
            <span style={{ ...labelStyle, color: theme.colors.primary, fontSize: 11, letterSpacing: '0.14em' }}>
              AI TEACHER ASSISTANT
            </span>
          </div>
        </div>

        {/* Prompt card — starts center, slides left */}
        <div
          style={{
            position: 'absolute',
            left: inputLeft,
            top: inputTop,
            opacity: inputOp,
            transform: `scale(${inputScale})`,
            transformOrigin: 'center center',
            zIndex: 4,
          }}
        >
          <UICard
            width={INPUT_W}
            height={INPUT_H}
            glowColor={`rgba(91,79,207,${0.12 + cardClickGlow * 0.16})`}
            borderRadius={24}
            style={{
              boxShadow:
                cardClickGlow > 0.05
                  ? `0 0 0 3px rgba(91,79,207,${cardClickGlow * 0.28}), ${CARD_SHADOW}`
                  : CARD_SHADOW,
            }}
          >
            <div style={{ padding: '28px 32px', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${theme.colors.primary}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    color: theme.colors.primary,
                  }}
                >
                  ✦
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: theme.colors.textMuted, fontFamily: theme.font.display }}>
                  AI Prompt
                </span>
                <div
                  style={{
                    marginLeft: 'auto',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background:
                      frame >= GENERATE_CLICK + 4
                        ? theme.colors.secondary
                        : frame >= 108
                          ? theme.colors.primary
                          : theme.colors.textDim,
                    boxShadow:
                      frame >= GENERATE_CLICK + 4
                        ? `0 0 12px ${theme.colors.secondary}`
                        : frame >= 108
                          ? `0 0 8px ${theme.colors.primaryGlow}`
                          : 'none',
                    transform:
                      frame >= GENERATE_CLICK + 4
                        ? `scale(${0.9 + Math.sin((frame / 5) * Math.PI) * 0.2})`
                        : 'scale(1)',
                  }}
                />
              </div>

              <div
                style={{
                  background: 'rgba(91,79,207,0.04)',
                  border: textareaBorder,
                  borderRadius: 14,
                  padding: '18px 20px',
                  fontSize: 19,
                  color: theme.colors.text,
                  fontFamily: theme.font.display,
                  lineHeight: 1.5,
                  minHeight: 108,
                }}
              >
                {PROMPT_TEXT.slice(0, charCount)}
                {cursorBlink && (
                  <span style={{ borderRight: `2px solid ${theme.colors.primary}`, marginLeft: 2 }}>&nbsp;</span>
                )}
              </div>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', opacity: btnVisible ? 1 : 0 }}>
                <GenerateButton frame={frame} fps={fps} visible={btnVisible} />
              </div>
            </div>
          </UICard>
        </div>

        {/* Processing steps — centered in lane between prompt and outputs */}
        {frame >= GENERATE_CLICK + 6 && slideToLeft > 0.2 && (
          <div
            style={{
              position: 'absolute',
              left: procCenterX,
              top: procCenterY,
              transform: 'translate(-50%, -50%)',
              width: Math.max(280, RIGHT_X - inputRightX - 56),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              zIndex: 3,
            }}
          >
            {PROC_STEPS.map((step, i) => {
              const typed = procTypedText(frame, step.text, step.delay)
              if (!typed && frame < step.delay) return null
              const stepOp = interpolate(frame, [step.delay, step.delay + 10, 228, 242], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
              const stepP = spring({ frame: Math.max(0, frame - step.delay), fps, config: theme.spring.snappy })
              const stepY = interpolate(stepP, [0, 1], [10, 0])
              const typing =
                frame >= step.delay &&
                frame < step.delay + PROC_TYPE_FRAMES &&
                typed.length < step.text.length
              const cursorOn = typing && frame % 16 < 8
              return (
                <div
                  key={i}
                  style={{
                    opacity: stepOp,
                    transform: `translateY(${stepY}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: theme.colors.primary,
                      boxShadow: `0 0 8px ${theme.colors.primaryGlow}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: theme.colors.primary,
                      fontFamily: theme.font.display,
                      fontWeight: 600,
                      textAlign: 'center',
                      lineHeight: 1.35,
                    }}
                  >
                    {typed}
                    {cursorOn && (
                      <span style={{ borderRight: `2px solid ${theme.colors.primary}`, marginLeft: 1 }}>&nbsp;</span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {badgeOp > 0.02 && (
          <div
            style={{
              position: 'absolute',
              left: inputRightX + 80,
              top: inputTop + INPUT_H - 24,
              opacity: badgeOp,
              transform: `scale(${interpolate(badgeP, [0, 1], [0.8, 1])})`,
              zIndex: 5,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: `${theme.colors.secondary}12`,
                border: `1.5px solid ${theme.colors.secondary}35`,
                borderRadius: 40,
                padding: '8px 18px',
                boxShadow: `0 4px 16px ${theme.colors.secondaryGlow}`,
              }}
            >
              <span style={{ fontSize: 13 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.secondary, fontFamily: theme.font.display }}>
                Generated in 0.8s
              </span>
            </div>
          </div>
        )}

        {/* Output cards */}
        <div style={{ position: 'absolute', left: RIGHT_X, top: CARDS_TOP, zIndex: 4 }}>
          {OUTPUT_CARDS.map((card, i) => {
            const Preview = OUTPUT_PREVIEWS[i]
            const cardOp =
              interpolate(frame, [card.delay, card.delay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
              fadeOut
            return (
              <div key={card.title} style={{ marginBottom: CARD_GAP, opacity: cardOp }}>
                <UICard
                  startFrame={card.delay}
                  width={CARD_W}
                  height={CARD_H}
                  glowColor={`${card.color}22`}
                  accentColor={card.color}
                  accentPosition="left"
                  direction="left"
                  borderRadius={20}
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div style={{ padding: '16px 20px 14px 24px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          flexShrink: 0,
                          background: `${card.color}12`,
                          border: `1.5px solid ${card.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: 11, color: card.color, fontFamily: theme.font.display, fontWeight: 600, marginTop: 2 }}>
                          {i === 0 && 'The Water Cycle · Grade 8'}
                          {i === 1 && 'Practice set · 15 min'}
                          {i === 2 && '45 min · IB aligned'}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: `${card.color}14`,
                          border: `1.5px solid ${card.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          color: card.color,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                    </div>
                    <Preview />
                  </div>
                </UICard>
              </div>
            )
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 52,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: captionOp,
            transform: `translateY(${captionY}px)`,
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: theme.font.display,
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.35,
              color: theme.colors.textMuted,
              textAlign: 'center',
            }}
          >
            Powered by AI. Guided by{' '}
            <span style={{ fontWeight: 600, color: theme.colors.text }}>educators.</span>
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

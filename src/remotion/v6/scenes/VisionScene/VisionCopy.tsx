/**
 * Slide 1 — "But technology was never meant to replace educators."
 * Slide 2 — "It was meant to empower them." (line 1 fades before line 2)
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import { theme } from '../../theme'

/** Full intro headline scale (96px) */
const HEADLINE = INTRO_HEADLINE.fontSize
const EMPOWER_SIZE = Math.round(HEADLINE * 1.12)

const SLATE = '#0F172A'
const SLATE_MUTED = '#475569'

const LINE1_ROWS = [
  ['But', 'technology', 'was', 'never', 'meant', 'to'],
  ['replace', 'educators.'],
] as const

const LINE2_WORDS = ['It', 'was', 'meant', 'to', 'empower', 'them.'] as const

/** Paced like opening slides (~11–13f/word, readable holds). */
const LINE1_START = 14
const LINE1_ROW_GAP = 12
const LINE1_WORD_STAGGER = 12
const LINE1_SETTLE = 28
const LINE1_FADE_FRAMES = 20
const LINE2_GAP_AFTER_LINE1 = 14
const LINE2_HOLD_AFTER_COMPLETE = 40
const LINE2_WORD_STAGGER = 12
const LINE2_SETTLE = 32
const LINE2_FADE_IN = 14

const WORD_SPRING = { damping: 220, stiffness: 68, mass: 1.05 }

function buildLine1Starts(): number[] {
  const starts: number[] = []
  let t = LINE1_START
  LINE1_ROWS.forEach((row) => {
    row.forEach((_, wi) => {
      starts.push(t + wi * LINE1_WORD_STAGGER)
    })
    t += row.length * LINE1_WORD_STAGGER + LINE1_ROW_GAP
  })
  return starts
}

const LINE1_STARTS = buildLine1Starts()
const LINE1_LAST_START = LINE1_STARTS[LINE1_STARTS.length - 1]!
const LINE1_FADE_OUT = LINE1_LAST_START + LINE1_SETTLE
const LINE2_START = LINE1_FADE_OUT + LINE1_FADE_FRAMES + LINE2_GAP_AFTER_LINE1

type VisionCopyProps = {
  fontFamily: string
  fadeOut: number
}

const RevealWord: React.FC<{
  word: string
  start: number
  frame: number
  fps: number
  color?: string
  weight?: number
  size?: number
}> = ({ word, start, frame, fps, color = SLATE, weight = 600, size = HEADLINE }) => {
  const raw = frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
  const opacity = frame < start ? 0 : interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const y = interpolate(raw, [0, 1], [32, 0], { extrapolateRight: 'clamp' })

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: '-0.03em',
        opacity,
        transform: `translateY(${y}px)`,
        marginRight: '0.32em',
      }}
    >
      {word}
    </span>
  )
}

export const VisionCopy: React.FC<VisionCopyProps> = ({ fontFamily, fadeOut }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const line1Op = interpolate(
    frame,
    [LINE1_FADE_OUT, LINE1_FADE_OUT + LINE1_FADE_FRAMES],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const showLine1 = frame < LINE1_FADE_OUT + LINE1_FADE_FRAMES + 4

  const line2Starts = LINE2_WORDS.map((_, i) => LINE2_START + i * LINE2_WORD_STAGGER)
  const line2Op = interpolate(frame, [LINE2_START, LINE2_START + LINE2_FADE_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const line2LastStart = line2Starts[line2Starts.length - 1]
  const accentBarW = interpolate(
    spring({
      frame: Math.max(0, frame - line2LastStart),
      fps,
      config: theme.spring.snappy,
    }),
    [0, 1],
    [0, 220],
  )

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${INTRO_HEADLINE.paddingX}px`,
        opacity: fadeOut,
        pointerEvents: 'none',
      }}
    >
      {showLine1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            opacity: line1Op,
            fontFamily,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: INTRO_HEADLINE.maxWidth,
              lineHeight: 1.2,
            }}
          >
            {LINE1_ROWS[0].map((word, i) => (
              <RevealWord
                key={word}
                word={word}
                start={LINE1_STARTS[i]}
                frame={frame}
                fps={fps}
                color={SLATE_MUTED}
                weight={500}
                size={HEADLINE}
              />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: INTRO_HEADLINE.maxWidth,
              lineHeight: 1.15,
            }}
          >
            {LINE1_ROWS[1].map((word, i) => (
              <RevealWord
                key={word}
                word={word}
                start={LINE1_STARTS[LINE1_ROWS[0].length + i]}
                frame={frame}
                fps={fps}
                color={SLATE}
                weight={700}
                size={HEADLINE}
              />
            ))}
          </div>
        </div>
      ) : null}

      {frame >= LINE2_START - 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: line2Op,
            fontFamily,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'baseline',
              maxWidth: INTRO_HEADLINE.maxWidth,
              lineHeight: 1.12,
            }}
          >
            {LINE2_WORDS.map((word, i) => {
              const start = line2Starts[i]
              if (word === 'empower') {
                return (
                  <RevealWord
                    key={word}
                    word={word}
                    start={start}
                    frame={frame}
                    fps={fps}
                    color={theme.colors.primary}
                    weight={800}
                    size={EMPOWER_SIZE}
                  />
                )
              }
              if (word === 'them.') {
                return (
                  <RevealWord
                    key={word}
                    word={word}
                    start={start}
                    frame={frame}
                    fps={fps}
                    color={SLATE}
                    weight={700}
                    size={HEADLINE}
                  />
                )
              }
              return (
                <RevealWord
                  key={word}
                  word={word}
                  start={start}
                  frame={frame}
                  fps={fps}
                  color={SLATE_MUTED}
                  weight={500}
                  size={HEADLINE}
                />
              )
            })}
          </div>
          <div
            style={{
              marginTop: 20,
              width: accentBarW,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, ${theme.colors.accent}, transparent)`,
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

const LINE2_LAST_START = LINE2_START + (LINE2_WORDS.length - 1) * LINE2_WORD_STAGGER
export const VISION_LINE2_DONE = LINE2_LAST_START + LINE2_SETTLE
/** Pills + hold before crossfade to Meet Tutify */
export const VISION_SCENE_DURATION = VISION_LINE2_DONE + LINE2_HOLD_AFTER_COMPLETE + 28

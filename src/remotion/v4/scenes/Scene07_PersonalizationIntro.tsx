/**
 * Personalized Learning — opening beats (white theme, Numera-style typography).
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { INTRO_HEADLINE } from '../../compositions/shared/introHeadlineTypography'
import { sceneEnter, sceneExit } from '../utils/sceneTransition'

const { fontFamily } = loadFont('normal', {
  weights: ['500', '600', '700'],
  subsets: ['latin'],
})

export const SCENE07_INTRO_DURATION = 380

const ACCENT = '#38BDF8'
const TEXT = '#0F172A'

const LINE1_WORDS = ['Every', 'educator', 'is', 'different,', 'every', 'classroom', 'is', 'unique.'] as const
const LINE2_WORDS = ['Tutify', 'personalizes', 'your'] as const
const LINE2_ACCENT = ['{', 'learning', '}'] as const

const L1_START = 6
const L1_STAGGER = 14
const L2_START = 168
const L2_STAGGER = 13
const LINE1_HOLD_UNTIL = 158
const LINE2_CROSS_START = 152

const smooth = (p: number) =>
  interpolate(p, [0, 0.35, 1], [0, 0.45, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

type WordInProps = {
  word: string
  start: number
  frame: number
  fps: number
  color?: string
  fontWeight?: number
}

const WordIn: React.FC<WordInProps> = ({
  word,
  start,
  frame,
  fps,
  color = TEXT,
  fontWeight = INTRO_HEADLINE.fontWeight,
}) => {
  const raw = frame >= start ? spring({ frame: frame - start, fps, config: { damping: 220, stiffness: 72 } }) : 0
  const p = smooth(raw)
  const y = interpolate(p, [0, 1], [-40, 0], { extrapolateRight: 'clamp' })
  const blur = interpolate(p, [0, 1], [10, 0], { extrapolateRight: 'clamp' })
  const op = frame < start ? 0 : interpolate(p, [0, 1], [0.25, 1], { extrapolateRight: 'clamp' })

  return (
    <span
      style={{
        display: 'inline-block',
        opacity: op,
        transform: `translateY(${y}px)`,
        filter: blur > 0.4 ? `blur(${blur}px)` : 'none',
        color,
        fontWeight,
        marginRight: INTRO_HEADLINE.wordGap,
      }}
    >
      {word}
    </span>
  )
}

const headlineRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'baseline',
  fontFamily,
  fontSize: INTRO_HEADLINE.fontSize,
  fontWeight: INTRO_HEADLINE.fontWeight,
  letterSpacing: INTRO_HEADLINE.letterSpacing,
  lineHeight: INTRO_HEADLINE.lineHeight,
  textAlign: 'center',
  maxWidth: INTRO_HEADLINE.maxWidth,
}

export const Scene07_PersonalizationIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneIn = sceneEnter(frame)
  const sceneOut = sceneExit(frame, SCENE07_INTRO_DURATION)
  const contentOp = sceneIn * sceneOut

  const showLine1 = frame < LINE1_HOLD_UNTIL + 24
  const showLine2 = frame >= LINE2_CROSS_START

  const line1Op = showLine1
    ? interpolate(frame, [0, 6, LINE2_CROSS_START, LINE1_HOLD_UNTIL + 20], [1, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  const line2Op = showLine2
    ? interpolate(frame, [LINE2_CROSS_START, LINE2_CROSS_START + 18], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  return (
    <AbsoluteFill style={{ background: '#FFFFFF', overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: contentOp }}>
        {showLine1 ? (
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: line1Op,
              padding: `0 ${INTRO_HEADLINE.paddingX}px`,
            }}
          >
            <div style={headlineRow}>
              {LINE1_WORDS.map((w, i) => (
                <WordIn key={w + i} word={w} start={L1_START + i * L1_STAGGER} frame={frame} fps={fps} />
              ))}
            </div>
          </AbsoluteFill>
        ) : null}

        {showLine2 ? (
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: line2Op,
              padding: `0 ${INTRO_HEADLINE.paddingX}px`,
            }}
          >
            <div style={{ ...headlineRow, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
              {LINE2_WORDS.map((w, i) => (
                <WordIn
                  key={w}
                  word={w}
                  start={L2_START + i * L2_STAGGER}
                  frame={frame}
                  fps={fps}
                />
              ))}
              {LINE2_ACCENT.map((w, i) => (
                <WordIn
                  key={w + i}
                  word={w}
                  start={L2_START + (LINE2_WORDS.length + i) * L2_STAGGER}
                  frame={frame}
                  fps={fps}
                  color={ACCENT}
                  fontWeight={600}
                />
              ))}
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

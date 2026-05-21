/**
 * Personalized Learning — analysis UI, progress bar, It turns → solution → pathways.
 * Numera-inspired blue bar + profile analysis + dark bracket finale.
 */
import React from 'react'
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import teacherAvatar from '../../v3/teacher-hero.png'
import { sceneMaster } from '../utils/sceneTransition'

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export const SCENE07_DURATION = 632

const BLUE = '#3B82F6'
const BLUE_LIGHT = '#38BDF8'
const DARK_GRADIENT =
  'radial-gradient(ellipse 90% 80% at 50% 45%, #1e4a7a 0%, #0c1929 55%, #060d18 100%)'

/* ── Phase timing ─────────────────────────────────────────────────────────── */
const BAR_ZOOM_END = 48
const BAR_SETTLE_END = 78
const ANALYSIS_START = 24
const ANALYSIS_END = 340
const COMPLETE_END = 400

const IT_TURNS_START = 408
const IT_TURNS_WORDS = [
  {
    letters: [
      { c: 'I', s: 408 },
      { c: 't', s: 418 },
    ],
  },
  {
    letters: [
      { c: 't', s: 432 },
      { c: 'u', s: 442 },
      { c: 'r', s: 452 },
      { c: 'n', s: 462 },
      { c: 's', s: 472 },
    ],
  },
]
const SOLUTION_START = 488
const PATHWAYS_START = 556
const PATHWAYS_ZOOM_END = 596
const PATHWAYS_HOLD_END = 612

const TEACHER = {
  name: 'Sarah Johnson',
  role: 'Mathematics Teacher · IB Programme',
  experience: '7 years',
  subject: 'Mathematics',
  curriculum: 'IB Programme',
  region: 'International',
}

const ANALYSIS_LOG = [
  { text: 'Tutify analyzing your teaching profile…', at: 95 },
  { text: 'Training profile data…', at: 130 },
  { text: 'Fetching curriculum preferences', at: 168 },
  { text: 'Details fetched', at: 205 },
  { text: 'Building personalized pathways…', at: 248 },
]

const PROFILE_STATS = [
  { label: 'Learning pathways', value: '+3' },
  { label: 'Curriculum matches', value: '12' },
  { label: 'Skill recommendations', value: '8' },
]

const activePulse = (frame: number, seed: number) =>
  1 + 0.018 * Math.sin(frame * 0.22 + seed)

/** Plain div centering — Remotion AbsoluteFill defaults to flex-column and stacks phrase children vertically. */
const DarkPhraseStage: React.FC<{
  master: number
  eyebrow: string
  phraseStyle?: React.CSSProperties
  scale?: number
  phraseOpacity?: number
  children: React.ReactNode
}> = ({ master, eyebrow, phraseStyle, scale = 1, phraseOpacity = 1, children }) => (
  <AbsoluteFill style={{ background: DARK_GRADIENT, overflow: 'hidden', opacity: master }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        padding: '0 72px',
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(148, 163, 184, 0.95)',
        }}
      >
        {eyebrow}
      </span>
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'baseline',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          transform: `scale(${scale})`,
          opacity: phraseOpacity,
          fontFamily,
          letterSpacing: '-0.03em',
          color: 'rgba(248,250,252,0.94)',
          lineHeight: 1.05,
          ...phraseStyle,
        }}
      >
        {children}
      </div>
    </div>
  </AbsoluteFill>
)

export const Scene07_Personalization: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const master = sceneMaster(frame, SCENE07_DURATION)

  const showAnalysis = frame >= ANALYSIS_START && frame < PATHWAYS_START
  const showPathways = frame >= PATHWAYS_START
  const showTurns = frame >= IT_TURNS_START && frame < PATHWAYS_START

  /* Bar zoom: full width → settle center */
  const barZoomP = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 200, stiffness: 55 },
  })
  const barScaleX =
    frame < BAR_ZOOM_END
      ? interpolate(barZoomP, [0, 1], [1.35, 1.02], { extrapolateRight: 'clamp' })
      : interpolate(frame, [BAR_ZOOM_END, BAR_SETTLE_END], [1.02, 0.88], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
  const barScaleY =
    frame < BAR_ZOOM_END
      ? interpolate(barZoomP, [0, 1], [1.2, 1], { extrapolateRight: 'clamp' })
      : interpolate(frame, [BAR_ZOOM_END, BAR_SETTLE_END], [1, 0.94], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

  const progressPct = interpolate(frame, [ANALYSIS_START, ANALYSIS_END - 20], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const displayPct = Math.round(progressPct)

  const visibleLogs = ANALYSIS_LOG.filter((l) => frame >= l.at)

  const completeOp = interpolate(frame, [ANALYSIS_END - 10, ANALYSIS_END + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  /* It turns — letter build */
  const turnsOp = interpolate(frame, [IT_TURNS_START, IT_TURNS_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const turnsFade = interpolate(frame, [SOLUTION_START - 8, SOLUTION_START + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  /* the solution — from right */
  const solutionWords = ['the', 'solution', 'into']
  const solutionOp = interpolate(frame, [SOLUTION_START, SOLUTION_START + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const solutionFade = interpolate(frame, [PATHWAYS_START - 10, PATHWAYS_START + 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  /* [ complete pathways ] */
  const pathZoomP = spring({
    frame: Math.max(0, frame - PATHWAYS_START),
    fps,
    config: { damping: 180, stiffness: 48 },
  })
  const pathScale =
    frame < PATHWAYS_ZOOM_END
      ? interpolate(pathZoomP, [0, 1], [1.45, 1.06], { extrapolateRight: 'clamp' })
      : interpolate(frame, [PATHWAYS_ZOOM_END, PATHWAYS_HOLD_END], [1.06, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
  const pathOp = interpolate(frame, [PATHWAYS_START, PATHWAYS_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  if (showPathways) {
    return (
      <AbsoluteFill
        style={{
          background: DARK_GRADIENT,
          overflow: 'hidden',
          opacity: master,
        }}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${pathScale})`,
            opacity: pathOp,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              fontFamily,
              fontSize: 88,
              fontWeight: 500,
              letterSpacing: '-0.03em',
            }}
          >
            <span style={{ color: BLUE_LIGHT, fontWeight: 600, fontSize: 120 }}>[</span>
            <span style={{ color: BLUE_LIGHT }}>complete pathways</span>
            <span style={{ color: BLUE_LIGHT, fontWeight: 600, fontSize: 120 }}>]</span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    )
  }

  const horizontalPhrase: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'baseline',
    justifyContent: 'center',
    fontFamily,
    letterSpacing: '-0.03em',
    color: 'rgba(248,250,252,0.92)',
  }

  if (showTurns && frame >= SOLUTION_START) {
    return (
      <AbsoluteFill
        style={{
          background: DARK_GRADIENT,
          overflow: 'hidden',
          opacity: master,
        }}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              ...horizontalPhrase,
              fontSize: 96,
              fontWeight: 500,
              gap: 20,
            }}
          >
            {solutionWords.map((w, i) => {
              const start = SOLUTION_START + 8 + i * 14
              const raw =
                frame >= start
                  ? spring({ frame: frame - start, fps, config: { damping: 200, stiffness: 80 } })
                  : 0
              const x = interpolate(raw, [0, 1], [280, 0], { extrapolateRight: 'clamp' })
              const op = frame < start ? 0 : interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
              return (
                <span
                  key={w}
                  style={{
                    display: 'inline-block',
                    opacity: op * solutionFade,
                    transform: `translateX(${x}px)`,
                    color: i === 0 ? 'rgba(255,255,255,0.55)' : '#F8FAFC',
                    fontWeight: i === 1 ? 600 : 500,
                  }}
                >
                  {w}
                </span>
              )
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    )
  }

  if (showTurns) {
    return (
      <AbsoluteFill
        style={{
          background: DARK_GRADIENT,
          overflow: 'hidden',
          opacity: master,
        }}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              ...horizontalPhrase,
              fontSize: 120,
              fontWeight: 500,
              opacity: turnsOp * turnsFade,
              gap: 40,
            }}
          >
            {IT_TURNS_WORDS.map((word, wi) => (
              <span
                key={wi}
                style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'baseline' }}
              >
                {word.letters.map(({ c, s }) => {
                  const raw =
                    frame >= s
                      ? spring({ frame: frame - s, fps, config: { damping: 200, stiffness: 90 } })
                      : 0
                  const sc = interpolate(raw, [0, 1], [1.5, 1], { extrapolateRight: 'clamp' })
                  const op =
                    frame < s ? 0 : interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
                  return (
                    <span
                      key={s}
                      style={{
                        display: 'inline-block',
                        opacity: op,
                        transform: `scale(${sc})`,
                        transformOrigin: 'center bottom',
                      }}
                    >
                      {c}
                    </span>
                  )
                })}
              </span>
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    )
  }

  /* Analysis UI — white canvas */
  return (
    <AbsoluteFill style={{ background: '#F8FAFC', overflow: 'hidden', opacity: master }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 80px',
        }}
      >
        {/* Learning progress bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 1100,
            transform: `scale(${barScaleX}, ${barScaleY})`,
            transformOrigin: 'center center',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: BLUE,
              borderRadius: 16,
              padding: '20px 28px 18px',
              boxShadow: '0 20px 60px rgba(59,130,246,0.35)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
                fontFamily,
                fontSize: 22,
                fontWeight: 500,
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              <span>learning…</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{displayPct}</span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 4,
                background: 'rgba(0,0,0,0.25)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: '#fff',
                  borderRadius: 4,
                  boxShadow: '0 0 12px rgba(255,255,255,0.5)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Profile + analysis stack */}
        {showAnalysis ? (
          <div
            style={{
              width: '100%',
              maxWidth: 720,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Profile card */}
            <div
              style={{
                background: '#fff',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                padding: '24px 28px',
                boxShadow: '0 16px 48px rgba(15,23,42,0.08)',
                transform: `scale(${activePulse(frame, 0)})`,
              }}
            >
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18 }}>
                <Img
                  src={teacherAvatar}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${BLUE}40`,
                  }}
                />
                <div>
                  <div style={{ margin: 0, fontFamily, fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
                    {TEACHER.name}
                  </div>
                  <p style={{ margin: '4px 0 0', fontFamily, fontSize: 14, color: '#64748B' }}>{TEACHER.role}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { l: 'Experience', v: TEACHER.experience },
                  { l: 'Subject', v: TEACHER.subject },
                  { l: 'Curriculum', v: TEACHER.curriculum },
                  { l: 'Region', v: TEACHER.region },
                ].map((row) => (
                  <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily, fontSize: 13 }}>
                    <span style={{ color: '#94A3B8' }}>{row.l}</span>
                    <span style={{ color: BLUE, fontWeight: 600 }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis log card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                padding: '22px 28px',
                boxShadow: '0 12px 40px rgba(59,130,246,0.12)',
                transform: `scale(${activePulse(frame, 2)})`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {frame >= ANALYSIS_START + 20 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: interpolate(frame, [ANALYSIS_START + 20, ANALYSIS_END], [0, 100], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${BLUE_LIGHT}, transparent)`,
                    opacity: 0.7,
                  }}
                />
              ) : null}
              <p style={{ margin: '0 0 14px', fontFamily, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                Analysis
              </p>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14, lineHeight: 1.7, color: '#334155' }}>
                {visibleLogs.map((l, i) => (
                  <div key={i} style={{ opacity: interpolate(frame, [l.at, l.at + 8], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                    {l.text}
                  </div>
                ))}
                {frame >= ANALYSIS_END - 30 ? (
                  <div style={{ color: BLUE, fontWeight: 600 }}>Knowledge pathways ready|</div>
                ) : null}
              </div>
            </div>

            {/* 100% complete card */}
            {completeOp > 0 ? (
              <div
                style={{
                  opacity: completeOp,
                  transform: `scale(${interpolate(completeOp, [0, 1], [0.96, 1])})`,
                }}
              >
                <div
                  style={{
                    background: BLUE,
                    borderRadius: 16,
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily,
                    color: '#fff',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 600 }}>Personalization complete</span>
                  <span style={{ fontSize: 28, fontWeight: 700 }}>100</span>
                </div>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    padding: '20px 24px',
                    boxShadow: '0 8px 32px rgba(15,23,42,0.06)',
                    transform: `scale(${activePulse(frame, 4)})`,
                  }}
                >
                  <p style={{ margin: '0 0 14px', fontFamily, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                    Knowledge Unit Created
                  </p>
                  {PROFILE_STATS.map((s, i) => (
                    <div
                      key={s.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                        borderTop: i > 0 ? '1px solid #F1F5F9' : undefined,
                        fontFamily,
                        fontSize: 14,
                      }}
                    >
                      <span style={{ color: '#94A3B8' }}>{s.label}</span>
                      <span style={{ color: BLUE, fontWeight: 700 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/**
 * Scene 08 — Connected Ecosystem
 * 1. Headline + inline role word carousel (no emojis)
 * 2. Enhanced network diagram
 * 3. Nodes merge into Tutify nucleus
 */
import React from 'react'
import { AbsoluteFill, Easing, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { NetworkGraph, NetworkNode } from '../components/NetworkGraph'
import { EcosystemSceneBackground } from '../components/EcosystemSceneBackground'
import { LOGO_SRC } from '../assets'
import { theme } from '../theme'
import { INTRO_HEADLINE } from '../../compositions/shared/introHeadlineTypography'

const HEADLINE_SIZE = INTRO_HEADLINE.fontSize

import { CROSSFADE, sceneMaster } from '../utils/sceneTransition'
import { TEXT_REVEAL_HOLD } from '../timeline/sceneRhythm'

const ROLE_WORDS = [
  { word: 'teachers', color: '#2563EB', tint: 'rgba(37,99,235,0.10)' },
  { word: 'students', color: '#059669', tint: 'rgba(5,150,105,0.10)' },
  { word: 'parents', color: '#C2410C', tint: 'rgba(194,65,12,0.10)' },
  { word: 'administrators', color: '#6D28D9', tint: 'rgba(109,40,217,0.10)' },
] as const

/* ── Phases (local frames) ───────────────────────────────────────────────── */
const CHIP_END = 24
const HEADLINE_START = 16
const CYCLE_START = 64
/** Role carousel — aligned with intro word stagger (~12f/word feel). */
const CYCLE_SLOT = 44
const CYCLE_ENTER = 16
const CYCLE_EXIT = 14
const CYCLE_END = CYCLE_START + CYCLE_SLOT * ROLE_WORDS.length
const DIAGRAM_START = CYCLE_END + 12
const MERGE_START = DIAGRAM_START + 148
const MERGE_END = MERGE_START + 84
const CAPTION_START = DIAGRAM_START + 34

export const SCENE08_DURATION = MERGE_END + TEXT_REVEAL_HOLD + CROSSFADE

/** Slide-up enter / exit for one role word in the carousel slot */
const RoleWordCarousel: React.FC<{
  frame: number
  fps: number
  cycleStart: number
  slotFrames: number
}> = ({ frame, fps, cycleStart, slotFrames }) => {
  if (frame < cycleStart) {
    return <div style={{ height: 112, marginTop: 16 }} />
  }

  const elapsed = frame - cycleStart
  const activeIndex = Math.min(ROLE_WORDS.length - 1, Math.floor(elapsed / slotFrames))
  const local = elapsed - activeIndex * slotFrames
  const role = ROLE_WORDS[activeIndex]
  const fontSize =
    role.word.length > 12 ? Math.round(HEADLINE_SIZE * 0.88) : HEADLINE_SIZE

  const enterP = spring({
    frame: Math.min(local, CYCLE_ENTER),
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.85 },
  })
  const exitT =
    local > slotFrames - CYCLE_EXIT
      ? (local - (slotFrames - CYCLE_EXIT)) / CYCLE_EXIT
      : 0

  const enterY = interpolate(enterP, [0, 1], [36, 0])
  const exitY = interpolate(exitT, [0, 1], [0, -28])
  const y = enterY + exitY
  const opacity =
    interpolate(enterP, [0, 1], [0, 1]) * interpolate(exitT, [0, 1], [1, 0])

  const scale =
    interpolate(enterP, [0, 1], [0.96, 1]) * interpolate(exitT, [0, 1], [1, 0.98])

  return (
    <div
      style={{
        height: 112,
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          transformOrigin: 'center',
          padding: '12px 40px',
          borderRadius: 14,
          background: role.tint,
          border: `1.5px solid ${role.color}28`,
          boxShadow: `0 8px 28px ${role.color}18`,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize,
            fontWeight: 700,
            fontFamily: theme.font.display,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: role.color,
          }}
        >
          {role.word}
        </span>
      </div>
    </div>
  )
}

const ECOSYSTEM_NODES: NetworkNode[] = [
  { id: 'teacher', label: 'Teachers', icon: '👩‍🏫', color: theme.colors.primary, x: 960, y: 248 },
  { id: 'student', label: 'Students', icon: '👨‍🎓', color: theme.colors.secondary, x: 1255, y: 655 },
  { id: 'parent', label: 'Parents', icon: '👨‍👩‍👧', color: theme.colors.accent, x: 665, y: 655 },
  { id: 'admin', label: 'Administrators', icon: '🏛️', color: theme.colors.purple, x: 1285, y: 368 },
  { id: 'school', label: 'Schools', icon: '🏫', color: theme.colors.rose, x: 635, y: 368 },
]

const NODE_STATS = [
  { nodeId: 'teacher', text: '10,200+ educators' },
  { nodeId: 'student', text: '140k+ students' },
  { nodeId: 'parent', text: '98k+ families' },
  { nodeId: 'admin', text: '320+ institutions' },
  { nodeId: 'school', text: '48 countries' },
]

export const Scene08_Ecosystem: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const fgAlpha = sceneMaster(frame, SCENE08_DURATION)

  const chipOp = interpolate(frame, [4, CHIP_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headlineOp = interpolate(frame, [HEADLINE_START, HEADLINE_START + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const headlineY = interpolate(frame, [HEADLINE_START, HEADLINE_START + 28], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const cycleActiveIndex =
    frame >= CYCLE_START
      ? Math.min(ROLE_WORDS.length - 1, Math.floor((frame - CYCLE_START) / CYCLE_SLOT))
      : -1

  const textPhaseOp = interpolate(
    frame,
    [DIAGRAM_START - 18, DIAGRAM_START + 8],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const diagramOp = interpolate(frame, [DIAGRAM_START, DIAGRAM_START + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const mergeProgress = interpolate(frame, [MERGE_START, MERGE_END], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const captionOp = interpolate(frame, [CAPTION_START, CAPTION_START + 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const captionHide = interpolate(frame, [MERGE_START, MERGE_START + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const badgeOp = interpolate(frame, [DIAGRAM_START + 50, DIAGRAM_START + 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const badge2Op = interpolate(frame, [DIAGRAM_START + 64, DIAGRAM_START + 86], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const graphStart = DIAGRAM_START

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <EcosystemSceneBackground />

      <AbsoluteFill style={{ opacity: fgAlpha }}>

        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 56,
            opacity: chipOp,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(91,79,207,0.08)',
              border: '1.5px solid rgba(91,79,207,0.22)',
              borderRadius: 40,
              padding: '6px 16px 6px 12px',
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
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: theme.colors.primary,
                fontFamily: theme.font.display,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Connected Ecosystem
            </span>
          </div>
        </div>

        {/* Phase 1-2: headline + role carousel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: textPhaseOp,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              opacity: headlineOp,
              transform: `translateY(${headlineY}px)`,
              textAlign: 'center',
              maxWidth: INTRO_HEADLINE.maxWidth,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: HEADLINE_SIZE,
                fontWeight: INTRO_HEADLINE.fontWeight,
                color: '#1E293B',
                fontFamily: theme.font.display,
                letterSpacing: INTRO_HEADLINE.letterSpacing,
                lineHeight: INTRO_HEADLINE.lineHeight,
              }}
            >
              One secure ecosystem connecting
            </p>

            <RoleWordCarousel
              frame={frame}
              fps={fps}
              cycleStart={CYCLE_START}
              slotFrames={CYCLE_SLOT}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 10,
                marginTop: 24,
                opacity: interpolate(frame, [CYCLE_START, CYCLE_START + 14], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              {ROLE_WORDS.map((r, i) => {
                const isActive = cycleActiveIndex === i
                return (
                  <div
                    key={r.word}
                    style={{
                      height: 4,
                      width: isActive ? 24 : 4,
                      borderRadius: 2,
                      background: isActive ? r.color : 'rgba(148,163,184,0.45)',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Phase 3–4: Network + merge ─────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, opacity: diagramOp }}>
          <NetworkGraph
            centerLogoSrc={LOGO_SRC}
            nodes={ECOSYSTEM_NODES}
            startFrame={graphStart}
            width={1920}
            height={1080}
            showStats
            stats={NODE_STATS}
            mergeProgress={mergeProgress}
            enhanced
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 80,
            bottom: 108,
            opacity: badgeOp * diagramOp,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1.5px solid rgba(255,255,255,0.85)',
              borderRadius: 14,
              padding: '13px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 24px rgba(14,168,113,0.12)',
            }}
          >
            <span style={{ fontSize: 18 }}>🔒</span>
            <span
              style={{
                fontSize: 14,
                color: theme.colors.secondary,
                fontFamily: theme.font.display,
                fontWeight: 600,
              }}
            >
              Enterprise-grade security · FERPA compliant
            </span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: 108,
            opacity: badge2Op * diagramOp,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 14,
              padding: '13px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 24px rgba(91,79,207,0.10)',
              border: '1.5px solid rgba(255,255,255,0.85)',
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: theme.colors.primary,
                opacity: frame % 20 < 10 ? 1 : 0.4,
              }}
            />
            <span
              style={{
                fontSize: 14,
                color: theme.colors.primary,
                fontFamily: theme.font.display,
                fontWeight: 600,
              }}
            >
              Real-time sync · 99.9% uptime
            </span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: captionOp * captionHide * diagramOp,
            padding: '0 80px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: Math.round(HEADLINE_SIZE * 0.56),
              fontWeight: 600,
              color: theme.colors.textMuted,
              fontFamily: theme.font.display,
              textAlign: 'center',
              letterSpacing: INTRO_HEADLINE.letterSpacing,
              lineHeight: 1.35,
            }}
          >
            One secure ecosystem connecting everyone together.
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

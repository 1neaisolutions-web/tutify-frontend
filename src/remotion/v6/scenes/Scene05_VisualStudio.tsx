/**
 * Scene 05b — PixGen UI demo (Generative canvas + Live preview).
 * Single cycle: type prompt → generate → reveal volcano diagram.
 */
import React from 'react'
import { AbsoluteFill, Easing, Img, interpolate, spring } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'

import volcanoDiagram from '../../v3/volcano-diagram.png'
import { theme } from '../theme'
import {
  FEATURE_DEMO_POST_TYPE_PAUSE,
  FEATURE_DEMO_RESULT_HOLD,
} from '../timeline/sceneRhythm'
import { CROSSFADE, sceneMaster } from '../utils/sceneTransition'
import { promptTypeDuration, promptTypewriter } from '../utils/promptTyping'

const PROMPT =
  'Labeled cross-section diagram of a volcano for Grade 6 earth science — clear layers, arrows, and student-friendly labels.'

const PANEL_READY = 40
const LOAD_DURATION = 24

const TYPE_START = PANEL_READY
const TYPE_DURATION = promptTypeDuration(PROMPT.length)
const TYPE_END = TYPE_START + TYPE_DURATION
const GEN_CLICK = TYPE_END + FEATURE_DEMO_POST_TYPE_PAUSE
const LOAD_START = GEN_CLICK + 6
const LOAD_END = LOAD_START + LOAD_DURATION
const REVEAL = LOAD_END + 4
const HOLD_END = REVEAL + FEATURE_DEMO_RESULT_HOLD

const SCENE05_FADE_START = HOLD_END
export const SCENE05_DURATION = SCENE05_FADE_START + CROSSFADE

export const SCENE05_SFX_FRAMES = {
  keyboardTyping: [{ start: TYPE_START, duration: TYPE_DURATION }] as const,
} as const

const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = '#fff',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l1.2 4.2L17 7.4l-3.8 1.2L12 13l-1.2-4.4L7 7.4l3.8-1.2L12 2zM5 14l.8 2.8L8.6 18l-2.8.9L5 21.7l-.8-2.8L1.4 18l2.8-.9L5 14zm14 0l.8 2.8 2.8.9-2.8.9-.8 2.8-.8-2.8-2.8-.9 2.8-.9.8-2.8z"
      fill={color}
    />
  </svg>
)

const ZapIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = '#7C3AED',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
)

const ImageFrameIcon: React.FC = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#8B5CF6" strokeWidth="2" />
    <circle cx="8.5" cy="10" r="1.5" fill="#8B5CF6" />
    <path d="M3 16l5-4 4 3 3-2 6 5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const CARD_SLIDE_ENTER_FRAMES = 38
/** Card travels from fully below the stage edge into its resting position. */
const CARD_SLIDE_OFFSET = 780

/** Symmetric depth tilt — rotateX only so left/right stay level. */
const CARD_STAGE_PERSPECTIVE = 2200
const CARD_ROTATE_X = 12
const CARD_DISPLAY_SCALE = 0.92

/** Card layout — outer 3D tilt unchanged; size extended so content stays clear on the plane. */
const CARD_MAX_WIDTH = 1280
const CARD_MIN_HEIGHT = 600
const CARD_PREVIEW_HEIGHT = 740

const CARD_BASE_FONT = 30

/** Consistent horizontal rhythm — keeps content off the card edges. */
const CARD_SPACE = {
  padY: 36,
  padX: 52,
  bodyInsetX: 8,
  promptPadY: 30,
  promptPadX: 34,
  sectionGap: 30,
  footerGap: 40,
  headerGap: 24,
  buttonGap: 16,
} as const

/** Readable type scale — fixed px so 3D tilt does not shrink hierarchy. */
const CARD_READ = {
  title: 34,
  subtitle: 22,
  prompt: 30,
  label: 15,
  chip: 18,
  button: 15,
} as const

const cardShellPadding: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: `${CARD_SPACE.padY}px ${CARD_SPACE.padX}px`,
}

const CARD_TEXT = {
  primary: '#0F172A',
  secondary: '#334155',
  muted: '#475569',
  label: '#64748B',
} as const

const cardRootStyle: React.CSSProperties = {
  fontFamily: theme.font.display,
  fontSize: CARD_BASE_FONT,
  lineHeight: 1.5,
  color: CARD_TEXT.primary,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
}

const cardSectionLabelStyle: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: CARD_READ.label,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: CARD_TEXT.label,
}

const cardSubtitleStyle: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: CARD_READ.subtitle,
  lineHeight: 1.45,
  fontWeight: 500,
  color: CARD_TEXT.secondary,
}

const cardActionBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 22px',
  borderRadius: 999,
  fontSize: CARD_READ.button,
  fontWeight: 700,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  lineHeight: 1.1,
}

const cardChipStyle = (active: boolean, accent: 'violet' | 'sky'): React.CSSProperties => ({
  padding: '10px 18px',
  borderRadius: 999,
  fontSize: CARD_READ.chip,
  fontWeight: active ? 700 : 600,
  background:
    accent === 'violet'
      ? active
        ? 'rgba(124,58,237,0.18)'
        : '#EEF2F6'
      : active
        ? 'rgba(14,165,233,0.18)'
        : '#EEF2F6',
  color:
    accent === 'violet'
      ? active
        ? '#5B21B6'
        : '#1E293B'
      : active
        ? '#0369A1'
        : '#1E293B',
  border: active
    ? accent === 'violet'
      ? '1.5px solid rgba(124,58,237,0.35)'
      : '1.5px solid rgba(14,165,233,0.35)'
    : '1.5px solid #E2E8F0',
})

const cardInnerStyle: React.CSSProperties = {
  width: '100%',
  paddingInline: CARD_SPACE.bodyInsetX,
  boxSizing: 'border-box',
}

const cardPromptBoxStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: `${CARD_SPACE.promptPadY}px ${CARD_SPACE.promptPadX}px`,
}

type CardSlideMotion = {
  opacity: number
  translateY: number
}

const cardStageTransform = (translateY: number): string =>
  `translateY(${translateY}px) perspective(${CARD_STAGE_PERSPECTIVE}px) rotateX(${CARD_ROTATE_X}deg) scale(${CARD_DISPLAY_SCALE})`

/** Card rises from below the bottom border — same tilted plane, no flip. */
const cardSlideUpEnter = (
  frame: number,
  fps: number,
  start: number,
  duration = CARD_SLIDE_ENTER_FRAMES,
): CardSlideMotion => {
  const p = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 18, stiffness: 95, mass: 1 },
    durationInFrames: duration,
  })
  const translateY = interpolate(p, [0, 1], [CARD_SLIDE_OFFSET, 0], { extrapolateRight: 'clamp' })
  const opacity = interpolate(p, [0, 0.05, 1], [0, 1, 1], { extrapolateRight: 'clamp' })

  return { opacity, translateY }
}

/** Card sinks back below the bottom border when swapping panels. */
const cardSlideDownExit = (
  frame: number,
  start: number,
  duration: number,
): CardSlideMotion => {
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
  const translateY = interpolate(p, [0, 1], [0, CARD_SLIDE_OFFSET], { extrapolateRight: 'clamp' })
  const opacity = interpolate(p, [0, 0.8, 1], [1, 1, 0], { extrapolateRight: 'clamp' })

  return { opacity, translateY }
}

export const Scene05_VisualStudio: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fg = sceneMaster(frame, SCENE05_DURATION)

  const panelP = spring({ frame: Math.max(0, frame - 8), fps, config: theme.spring.zoom })
  const panelOp = interpolate(panelP, [0, 1], [0, 1])

  const activePrompt =
    frame < TYPE_START
      ? ''
      : frame <= TYPE_END
        ? promptTypewriter(frame, TYPE_START, PROMPT)
        : PROMPT

  const activeStyle = 'SCIENCE DIAGRAM'
  const activeRatio = '3:2 Landscape'

  const isGenerating = frame >= LOAD_START && frame < LOAD_END
  const hasImage = frame >= REVEAL
  const previewSrc = volcanoDiagram

  const btnPress =
    frame >= GEN_CLICK && frame < GEN_CLICK + 8
      ? interpolate(frame, [GEN_CLICK, GEN_CLICK + 8], [1, 0.94], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  const genBtnGlow =
    frame >= GEN_CLICK - 4 && frame < GEN_CLICK + 20
      ? interpolate(frame, [GEN_CLICK, GEN_CLICK + 20], [0.4, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

  const imageReveal = hasImage
    ? spring({ frame: Math.max(0, frame - REVEAL), fps, config: theme.spring.snappy })
    : 0
  const imageOp = interpolate(imageReveal, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const imageScale = interpolate(imageReveal, [0, 1], [1.04, 1], { extrapolateRight: 'clamp' })

  const loadPulse = isGenerating ? 0.55 + 0.45 * Math.sin(frame * 0.35) : 0
  const cursorBlink = frame % 18 < 9
  const isTyping = frame >= TYPE_START && frame < TYPE_END

  const CARD_SWAP = GEN_CLICK
  const CARD_SWAP_DURATION = 14
  const showCanvasCard = frame < CARD_SWAP + CARD_SWAP_DURATION
  const showPreviewCard = frame >= CARD_SWAP

  const canvasEnterMotion = cardSlideUpEnter(frame, fps, 8)
  const canvasExitMotion = cardSlideDownExit(frame, CARD_SWAP, CARD_SWAP_DURATION)
  const previewEnterMotion = cardSlideUpEnter(frame, fps, CARD_SWAP)

  const canvasCardMotion: CardSlideMotion =
    frame < CARD_SWAP
      ? canvasEnterMotion
      : {
          opacity: canvasEnterMotion.opacity * canvasExitMotion.opacity,
          translateY: canvasExitMotion.translateY,
        }
  const previewCardMotion = previewEnterMotion

  const focusScale = interpolate(
    frame,
    [8, PANEL_READY, TYPE_START + 14, CARD_SWAP, REVEAL + 24],
    [1, 1, 1, 1, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: fg }}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 45%, #EEF2FF 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0 32px 64px',
          overflow: 'visible',
          opacity: panelOp,
          transform: `scale(${focusScale})`,
          transformOrigin: '50% 85%',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: CARD_MAX_WIDTH,
            overflow: 'visible',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            perspective: CARD_STAGE_PERSPECTIVE,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Generative canvas — visible only while typing / before Generate */}
          {showCanvasCard ? (
          <div
            style={{
              width: '100%',
              borderRadius: 28,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              boxShadow: '0 24px 64px rgba(15,23,42,0.08)',
              ...cardShellPadding,
              minHeight: CARD_MIN_HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              opacity: canvasCardMotion.opacity,
              transform: cardStageTransform(canvasCardMotion.translateY),
              transformOrigin: '50% 50%',
              transformStyle: 'preserve-3d',
              pointerEvents: frame >= CARD_SWAP ? 'none' : 'auto',
              ...cardRootStyle,
            }}
          >
            <div style={cardInnerStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: CARD_SPACE.headerGap,
              }}
            >
              <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ImageFrameIcon />
                  <span
                    style={{
                      fontSize: CARD_READ.title,
                      fontWeight: 800,
                      color: CARD_TEXT.primary,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Generative canvas
                  </span>
                </div>
                <p style={cardSubtitleStyle}>
                  Craft a prompt, pick a style, and preview variations before exporting.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: CARD_SPACE.buttonGap,
                  flexShrink: 0,
                  paddingTop: 4,
                }}
              >
                <div
                  style={{
                    ...cardActionBtnBase,
                    transform: `scale(${btnPress})`,
                    transformOrigin: 'center center',
                    background: '#7C3AED',
                    boxShadow:
                      genBtnGlow > 0
                        ? `0 0 0 ${8 + genBtnGlow * 12}px rgba(124,58,237,${genBtnGlow})`
                        : '0 4px 14px rgba(124,58,237,0.35)',
                    color: '#fff',
                  }}
                >
                  <SparkleIcon size={16} />
                  {isGenerating ? 'Generating…' : 'Generate'}
                </div>
                <div
                  style={{
                    ...cardActionBtnBase,
                    border: '2px solid #7C3AED',
                    background: '#fff',
                    color: '#6D28D9',
                  }}
                >
                  <ZapIcon size={16} />
                  Batch
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: CARD_SPACE.sectionGap,
                display: 'flex',
                flexDirection: 'column',
                gap: CARD_SPACE.sectionGap,
                flex: 1,
              }}
            >
              <div>
                <div style={cardSectionLabelStyle}>Prompt</div>
                <div
                  style={{
                    minHeight: 200,
                    borderRadius: 18,
                    border: `2px solid ${frame >= TYPE_START ? '#A78BFA' : '#E2E8F0'}`,
                    background: '#FFFFFF',
                    ...cardPromptBoxStyle,
                    fontSize: CARD_READ.prompt,
                    lineHeight: 1.55,
                    fontWeight: 600,
                    color: activePrompt ? CARD_TEXT.primary : '#94A3B8',
                    boxShadow:
                      frame >= GEN_CLICK - 2 && frame < GEN_CLICK + 16
                        ? '0 0 0 3px rgba(124,58,237,0.15)'
                        : undefined,
                  }}
                >
                  <span>
                    {activePrompt || 'Illustrate your lesson idea…'}
                    {isTyping ? (
                      <span style={{ opacity: cursorBlink ? 1 : 0, color: '#7C3AED' }}>|</span>
                    ) : null}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: CARD_SPACE.footerGap }}>
                <div style={{ flex: 1 }}>
                  <p style={cardSectionLabelStyle}>Style presets</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {['Watercolour storybook', 'Science diagram', 'Flat infographic', 'Sketch notes'].map(
                      (s, i) => {
                        const active = i === 1
                        return (
                          <span key={s} style={cardChipStyle(active, 'violet')}>
                            {s}
                          </span>
                        )
                      },
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={cardSectionLabelStyle}>Aspect ratio</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {['3:2 Landscape', '4:3 Landscape', '1:1 Square'].map((r) => {
                      const active = r === activeRatio
                      return (
                        <span key={r} style={cardChipStyle(active, 'sky')}>
                          {r}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
          ) : null}

          {/* Live preview — visible after Generate is pressed */}
          {showPreviewCard ? (
          <div
            style={{
              position: showCanvasCard && frame >= CARD_SWAP ? 'absolute' : 'relative',
              inset: showCanvasCard && frame >= CARD_SWAP ? 0 : undefined,
              width: '100%',
              borderRadius: 28,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              boxShadow: '0 24px 64px rgba(15,23,42,0.08)',
              ...cardShellPadding,
              display: 'flex',
              flexDirection: 'column',
              height: CARD_PREVIEW_HEIGHT,
              minHeight: CARD_PREVIEW_HEIGHT,
              opacity: previewCardMotion.opacity,
              transform: cardStageTransform(previewCardMotion.translateY),
              transformOrigin: '50% 50%',
              transformStyle: 'preserve-3d',
              pointerEvents: frame < CARD_SWAP ? 'none' : 'auto',
              ...cardRootStyle,
            }}
          >
            <h3 style={{ ...cardSectionLabelStyle, marginBottom: '0.75em' }}>Live preview</h3>

            <div
              style={{
                flex: 1,
                borderRadius: 20,
                background: '#F3F4F6',
                overflow: 'hidden',
                position: 'relative',
                minHeight: 0,
              }}
            >
              {isGenerating ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div style={{ transform: `scale(${1 + loadPulse * 0.08})` }}>
                    <SparkleIcon size={36} color="#7C3AED" />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1em',
                      fontWeight: 600,
                      color: CARD_TEXT.secondary,
                    }}
                  >
                    Generating image…
                  </p>
                  <div
                    style={{
                      width: 200,
                      height: 4,
                      borderRadius: 4,
                      background: '#E5E7EB',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${interpolate(frame, [LOAD_START, LOAD_END], [8, 100], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        })}%`,
                        background: 'linear-gradient(90deg, #7C3AED, #6366F1)',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ) : hasImage ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Img
                    src={previewSrc}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: imageOp,
                      transform: `scale(${imageScale})`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: '20px 22px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      opacity: imageOp,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.85)',
                          fontFamily: theme.font.display,
                        }}
                      >
                        {activeStyle}
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: theme.font.display,
                        }}
                      >
                        {activeRatio}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '10px 18px',
                        borderRadius: 999,
                        background: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#7C3AED',
                        fontFamily: theme.font.display,
                      }}
                    >
                      Download PNG
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    height: '100%',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.62em',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#7C3AED',
                      }}
                    >
                      {activeStyle}
                    </p>
                    <h4
                      style={{
                        margin: '0.45em 0 0',
                        fontSize: '1.08em',
                        fontWeight: 700,
                        color: CARD_TEXT.primary,
                      }}
                    >
                      Select a prompt to preview
                    </h4>
                    <p
                      style={{
                        margin: '0.45em 0 0',
                        fontSize: '0.78em',
                        lineHeight: 1.5,
                        fontWeight: 400,
                        color: CARD_TEXT.muted,
                        maxWidth: '22em',
                      }}
                    >
                      Choose a quick start prompt above or enter your own to see the generated image
                      here.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: theme.font.display,
                      fontSize: 12,
                      color: '#9CA3AF',
                    }}
                  >
                    <span>{activeRatio}</span>
                    <span
                      style={{
                        padding: '8px 16px',
                        borderRadius: 999,
                        background: '#E5E7EB',
                        color: '#9CA3AF',
                        fontWeight: 600,
                      }}
                    >
                      Download PNG
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  )
}

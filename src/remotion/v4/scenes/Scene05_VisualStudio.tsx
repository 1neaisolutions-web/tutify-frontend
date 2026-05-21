/**
 * Scene 05b — PixGen UI demo (local 0–480f · 16s)
 * Matches tutify-frontend /pixgen: Generative canvas + Live preview.
 * Two generation cycles: volcano diagram → history illustration.
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
import volcanoDiagram from '../../v3/volcano-diagram.png'
import historyIllustration from '../../v3/history-illustration.png'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'

export const SCENE05_DURATION = 480

const PROMPT_VOLCANO =
  'Labeled cross-section diagram of a volcano for Grade 6 earth science — clear layers, arrows, and student-friendly labels.'
const PROMPT_HISTORY =
  'Watercolour storybook illustration of ancient Egyptian civilization — pyramids, Nile, and classroom-safe details for history.'

const TYPE_1_START = 72
const TYPE_1_END = 138
const GEN_1_CLICK = 148
const LOAD_1_START = 158
const LOAD_1_END = 208
const REVEAL_1 = 212
const HOLD_1_END = 298

const TYPE_2_START = 308
const TYPE_2_END = 358
const GEN_2_CLICK = 368
const LOAD_2_START = 378
const LOAD_2_END = 418
const REVEAL_2 = 422

const typewriter = (frame: number, start: number, end: number, text: string) => {
  const len = text.length
  const n = Math.floor(
    interpolate(frame, [start, end], [0, len], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  )
  return text.slice(0, n)
}

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
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#8B5CF6" strokeWidth="2" />
    <circle cx="8.5" cy="10" r="1.5" fill="#8B5CF6" />
    <path d="M3 16l5-4 4 3 3-2 6 5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Scene05_VisualStudio: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fg = sceneMaster(frame, SCENE05_DURATION)

  const panelP = spring({ frame: Math.max(0, frame - 8), fps, config: theme.spring.zoom })
  const panelY = interpolate(panelP, [0, 1], [36, 0])
  const panelOp = interpolate(panelP, [0, 1], [0, 1])

  const cycle = frame < HOLD_1_END ? 1 : 2
  const activePrompt =
    cycle === 1
      ? typewriter(frame, TYPE_1_START, TYPE_1_END, PROMPT_VOLCANO)
      : typewriter(frame, TYPE_2_START, TYPE_2_END, PROMPT_HISTORY)
  const activeStyle = cycle === 1 ? 'SCIENCE DIAGRAM' : 'WATERCOLOUR STORYBOOK'
  const activeRatio = cycle === 1 ? '3:2 Landscape' : '4:3 Landscape'

  const genClick = cycle === 1 ? GEN_1_CLICK : GEN_2_CLICK
  const loadStart = cycle === 1 ? LOAD_1_START : LOAD_2_START
  const loadEnd = cycle === 1 ? LOAD_1_END : LOAD_2_END
  const revealAt = cycle === 1 ? REVEAL_1 : REVEAL_2

  const isGenerating = frame >= loadStart && frame < loadEnd
  const hasImage = frame >= revealAt
  const previewSrc = cycle === 1 ? volcanoDiagram : historyIllustration

  const btnPress =
    frame >= genClick && frame < genClick + 8
      ? interpolate(frame, [genClick, genClick + 8], [1, 0.94], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  const genBtnGlow =
    frame >= genClick - 4 && frame < genClick + 20
      ? interpolate(frame, [genClick, genClick + 20], [0.4, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

  const imageReveal = hasImage
    ? spring({ frame: Math.max(0, frame - revealAt), fps, config: theme.spring.snappy })
    : 0
  const imageOp = interpolate(imageReveal, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const imageScale = interpolate(imageReveal, [0, 1], [1.04, 1], { extrapolateRight: 'clamp' })

  const loadPulse = isGenerating ? 0.55 + 0.45 * Math.sin(frame * 0.35) : 0
  const cursorBlink = frame % 18 < 9
  const isTyping =
    (frame >= TYPE_1_START && frame < TYPE_1_END + 20) ||
    (frame >= TYPE_2_START && frame < TYPE_2_END + 20)

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: fg }}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 45%, #EEF2FF 100%)',
        }}
      />

      <div        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '56px 72px',
          opacity: panelOp,
          transform: `translateY(${panelY}px)`,
        }}
      >
        <div          style={{
            display: 'grid',
            gridTemplateColumns: '1.45fr 1fr',
            gap: 28,
            width: '100%',
            maxWidth: 1760,
            height: '100%',
            maxHeight: 920,
          }}
        >
          {/* Generative canvas */}
          <div            style={{
              borderRadius: 28,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              boxShadow: '0 24px 64px rgba(15,23,42,0.08)',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <ImageFrameIcon />
                  <span
                    style={{
                      fontFamily: theme.font.display,
                      fontSize: 26,
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    Generative canvas
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    maxWidth: 520,
                    fontFamily: theme.font.display,
                    fontSize: 17,
                    lineHeight: 1.5,
                    color: '#6B7280',
                  }}
                >
                  Craft a prompt, pick a style, and preview variations live before exporting to your
                  favourite tools.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <div
                  style={{
                    transform: `scale(${btnPress})`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 22px',
                    borderRadius: 999,
                    background: '#7C3AED',
                    boxShadow:
                      genBtnGlow > 0
                        ? `0 0 0 ${8 + genBtnGlow * 12}px rgba(124,58,237,${genBtnGlow})`
                        : '0 4px 14px rgba(124,58,237,0.35)',
                    fontFamily: theme.font.display,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#fff',
                  }}
                >
                  <SparkleIcon size={14} />
                  {isGenerating ? 'Generating…' : 'Generate'}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 22px',
                    borderRadius: 999,
                    border: '2px solid #7C3AED',
                    background: '#fff',
                    fontFamily: theme.font.display,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#7C3AED',
                  }}
                >
                  <ZapIcon size={14} />
                  Generate batch
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    marginBottom: 10,
                  }}
                >
                  Prompt
                </div>
                <div
                  style={{
                    minHeight: 108,
                    borderRadius: 20,
                    border: `1.5px solid ${frame >= TYPE_1_START || frame >= TYPE_2_START ? '#C4B5FD' : '#E5E7EB'}`,
                    background: '#F9FAFB',
                    padding: '18px 22px',
                    fontFamily: theme.font.display,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: activePrompt ? '#374151' : '#9CA3AF',
                    boxShadow:
                      frame >= genClick - 2 && frame < genClick + 16
                        ? '0 0 0 3px rgba(124,58,237,0.15)'
                        : undefined,
                  }}
                >
                  {activePrompt || 'Illustrate your lesson idea…'}
                  {isTyping ? (
                    <span style={{ opacity: cursorBlink ? 1 : 0, color: '#7C3AED' }}>|</span>
                  ) : null}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#9CA3AF',
                      fontFamily: theme.font.display,
                    }}
                  >
                    Style presets
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Watercolour storybook', 'Science diagram', 'Flat infographic', 'Sketch notes'].map(
                      (s, i) => {
                        const active = (cycle === 1 && i === 1) || (cycle === 2 && i === 0)
                        return (
                          <span
                            key={s}
                            style={{
                              padding: '8px 14px',
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              fontFamily: theme.font.display,
                              background: active ? 'rgba(124,58,237,0.12)' : '#F3F4F6',
                              color: active ? '#6D28D9' : '#6B7280',
                            }}
                          >
                            {s}
                          </span>
                        )
                      },
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#9CA3AF',
                      fontFamily: theme.font.display,
                    }}
                  >
                    Aspect ratio
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['3:2 Landscape', '4:3 Landscape', '1:1 Square'].map((r) => {
                      const active = r === activeRatio
                      return (
                        <span
                          key={r}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: theme.font.display,
                            background: active ? 'rgba(14,165,233,0.12)' : '#F3F4F6',
                            color: active ? '#0284C7' : '#6B7280',
                          }}
                        >
                          {r}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div            style={{
              borderRadius: 28,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              boxShadow: '0 24px 64px rgba(15,23,42,0.08)',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px',
                fontFamily: theme.font.display,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
              }}
            >
              Live preview
            </h3>

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
                      fontFamily: theme.font.display,
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#4B5563',
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
                        width: `${interpolate(frame, [loadStart, loadEnd], [8, 100], {
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
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#8B5CF6',
                        fontFamily: theme.font.display,
                      }}
                    >
                      {activeStyle}
                    </p>
                    <h4
                      style={{
                        margin: '10px 0 0',
                        fontFamily: theme.font.display,
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#111827',
                      }}
                    >
                      Select a prompt to preview
                    </h4>
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontFamily: theme.font.display,
                        fontSize: 15,
                        lineHeight: 1.5,
                        color: '#6B7280',
                        maxWidth: 380,
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
        </div>
      </div>
    </AbsoluteFill>
  )
}

/**
 * Scene 06b — YouTube Quiz blueprint demo.
 * Arc: paste URL → analyse → quiz reveal (hero) → discussion topics → metrics hold.
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
import { theme } from '../theme'
import { CROSSFADE, sceneMaster } from '../utils/sceneTransition'
import { promptTypeDuration, promptTypewriter } from '../utils/promptTyping'
import {
  FEATURE_DEMO_POST_TYPE_PAUSE,
  FEATURE_DEMO_RESULT_HOLD,
} from '../timeline/sceneRhythm'
import { DEMO_THUMBNAIL, DEMO_VIDEO_URL } from './youtubeQuizDemoData'
import { YouTubeQuizRightRail } from './YouTubeQuizRightRail'
import { YouTubeQuizPanel } from './YouTubeQuizPanel'

const RED = '#EF4444'
const RED_DARK = '#DC2626'

const PANEL_READY = 36
const ANALYZE_DURATION = 50

const TYPE_START = PANEL_READY
const TYPE_DURATION = promptTypeDuration(DEMO_VIDEO_URL.length)
const TYPE_END = TYPE_START + TYPE_DURATION
const GEN_CLICK = TYPE_END + FEATURE_DEMO_POST_TYPE_PAUSE
const ANALYZE_START = GEN_CLICK + 10
const ANALYZE_END = ANALYZE_START + ANALYZE_DURATION
const QUIZ_REVEAL = ANALYZE_END + 8
/** Reveal spring (~0.6s) before auto-scroll through quiz. */
const QUIZ_ENTER_FRAMES = 20
const QUIZ_SCROLL_START = QUIZ_REVEAL + QUIZ_ENTER_FRAMES
/** Scroll through full quiz (~2.8s @ 30fps). */
const QUIZ_SCROLL_FRAMES = 84
/** Hold fully scrolled quiz readable — matches Scene04/05 FEATURE_DEMO_RESULT_HOLD (~1s). */
const QUIZ_END_HOLD = FEATURE_DEMO_RESULT_HOLD
const TOPICS_START = QUIZ_SCROLL_START + QUIZ_SCROLL_FRAMES + QUIZ_END_HOLD
const METRICS_START = TOPICS_START + 72
const SCENE06_FADE_START = METRICS_START + 56 + FEATURE_DEMO_RESULT_HOLD
export const SCENE06_DURATION = SCENE06_FADE_START + CROSSFADE

/** Left blueprint card height when quiz is hero (fills panel below sticky URL bar). */
const LEFT_PANEL_HEIGHT = 836
/** Inner quiz content is taller than viewport so Remotion can scroll through all sections. */
const QUIZ_SCROLL_MAX = 360
const THUMB_HEIGHT = 200
const cardShell: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid #E5E7EB',
  background: '#fff',
  boxShadow: '0 12px 40px rgba(15,23,42,0.06)',
}

const YoutubeIcon: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="#EF4444">
    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
)

const SelectField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontFamily: theme.font.display, fontSize: 14, fontWeight: 600, color: '#374151' }}>
      {label}
    </div>
    <div
      style={{
        marginTop: 8,
        padding: '14px 18px',
        borderRadius: 14,
        border: '1px solid #E5E7EB',
        background: '#fff',
        fontFamily: theme.font.display,
        fontSize: 15,
        color: '#374151',
      }}
    >
      {value}
    </div>
  </div>
)

export const Scene06_YouTube: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fg = sceneMaster(frame, SCENE06_DURATION)

  const panelP = spring({ frame: Math.max(0, frame - 8), fps, config: theme.spring.zoom })
  const panelY = interpolate(panelP, [0, 1], [28, 0])
  const panelOp = interpolate(panelP, [0, 1], [0, 1])

  const chipP = spring({ frame: Math.max(0, frame - 4), fps, config: theme.spring.snappy })
  const chipOp = interpolate(chipP, [0, 1], [0, 1]) * fg

  const urlText = promptTypewriter(frame, TYPE_START, DEMO_VIDEO_URL)
  const isTyping = frame >= TYPE_START && frame < TYPE_END
  const cursorBlink = frame % 16 < 8
  const isGenerating = frame >= ANALYZE_START && frame < ANALYZE_END
  const btnPress =
    frame >= GEN_CLICK && frame < GEN_CLICK + 8
      ? interpolate(frame, [GEN_CLICK, GEN_CLICK + 8], [1, 0.94], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  const scanOp = isGenerating
    ? interpolate(frame, [ANALYZE_START, ANALYZE_START + 8, ANALYZE_END - 8, ANALYZE_END], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  const urlComplete = frame >= TYPE_END
  const showThumbnail = urlComplete && frame < QUIZ_REVEAL

  const thumbP = showThumbnail
    ? spring({ frame: Math.max(0, frame - TYPE_END), fps, config: theme.spring.snappy })
    : 0
  const thumbOp = interpolate(thumbP, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const thumbScale = interpolate(thumbP, [0, 1], [0.96, 1], { extrapolateRight: 'clamp' })

  const showTopics = frame >= TOPICS_START
  const showQuiz = frame >= QUIZ_REVEAL
  const showMetrics = frame >= METRICS_START
  const showClassroomCards = frame >= TOPICS_START

  const quizP = showQuiz ? spring({ frame: Math.max(0, frame - QUIZ_REVEAL), fps, config: theme.spring.snappy }) : 0
  const quizY = interpolate(quizP, [0, 1], [48, 0], { extrapolateRight: 'clamp' })
  const quizOp = interpolate(quizP, [0, 1], [0, 1], { extrapolateRight: 'clamp' })

  const quizScrollProgress =
    showQuiz && frame >= QUIZ_SCROLL_START
      ? interpolate(frame, [QUIZ_SCROLL_START, QUIZ_SCROLL_START + QUIZ_SCROLL_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0
  const quizScrollY = quizScrollProgress * QUIZ_SCROLL_MAX

  const metricsP = showMetrics
    ? interpolate(frame, [METRICS_START, METRICS_START + 50], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: fg, background: '#F9FAFB' }}>
      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 28,
          opacity: chipOp,
          transform: `scale(${interpolate(chipP, [0, 1], [0.88, 1])})`,
          transformOrigin: 'left center',
          zIndex: 6,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 40,
            padding: '7px 18px 7px 14px',
            boxShadow: '0 4px 20px rgba(239,68,68,0.1)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, boxShadow: '0 0 8px rgba(239,68,68,0.45)' }} />
          <span
            style={{
              fontFamily: theme.font.display,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: RED_DARK,
            }}
          >
            YouTube Fun Studio
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '56px 48px 40px',
          opacity: panelOp,
          transform: `translateY(${panelY}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Sticky bar — Generate your quiz blueprint */}
        <div
          style={{
            borderRadius: 18,
            border: '1px solid #E5E7EB',
            background: 'rgba(255,255,255,0.95)',
            padding: '20px 24px',
            boxShadow: '0 8px 32px rgba(15,23,42,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <YoutubeIcon />
            <span style={{ fontFamily: theme.font.display, fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Generate your quiz blueprint
            </span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', fontFamily: theme.font.display, marginBottom: 6 }}>
            YouTube video link
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                border: `1px solid ${frame >= TYPE_START ? '#FCA5A5' : '#E5E7EB'}`,
                background: '#fff',
                padding: '0 18px',
                display: 'flex',
                alignItems: 'center',
                fontFamily: theme.font.display,
                fontSize: 14,
                color: urlText ? '#374151' : '#9CA3AF',
                boxShadow: frame >= GEN_CLICK - 2 && frame < GEN_CLICK + 14 ? '0 0 0 3px rgba(239,68,68,0.15)' : undefined,
              }}
            >
              {urlText || 'https://www.youtube.com/watch?v=...'}
              {isTyping ? <span style={{ color: RED, opacity: cursorBlink ? 1 : 0 }}>|</span> : null}
            </div>
            <div
              style={{
                height: 48,
                padding: '0 22px',
                borderRadius: 999,
                border: `2px solid ${RED}`,
                display: 'flex',
                alignItems: 'center',
                fontFamily: theme.font.display,
                fontSize: 14,
                fontWeight: 600,
                color: RED,
              }}
            >
              Preview
            </div>
            <div
              style={{
                height: 48,
                padding: '0 24px',
                borderRadius: 999,
                background: isGenerating ? '#FCA5A5' : RED,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transform: `scale(${btnPress})`,
                fontFamily: theme.font.display,
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
              }}
            >
              ▶ {isGenerating ? 'Analysing…' : 'Generate quiz'}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.55fr 1fr',
            gap: 20,
            alignItems: showQuiz ? 'stretch' : 'start',
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              ...cardShell,
              padding: showQuiz ? 0 : '24px 28px',
              overflow: 'hidden',
              position: 'relative',
              alignSelf: showQuiz ? 'stretch' : 'start',
              width: '100%',
              minHeight: showQuiz ? LEFT_PANEL_HEIGHT : undefined,
              height: showQuiz ? LEFT_PANEL_HEIGHT : undefined,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {!showQuiz ? (
              <>
            <h3 style={{ margin: 0, fontFamily: theme.font.display, fontSize: 20, fontWeight: 700, color: '#111827' }}>
              Blueprint details
            </h3>
            <p style={{ margin: '8px 0 0', fontFamily: theme.font.display, fontSize: 14, color: '#6B7280', lineHeight: 1.45 }}>
              Choose grade, subject, and question styles — then paste your link above.
            </p>

            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <SelectField label="Grade band" value="Grades 11-12" />
              <SelectField label="Subject lens" value="Social Sciences" />
              <SelectField label="Learning focus" value="Critical analysis" />
              <SelectField label="Quiz language" value="English" />
            </div>

            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
              <div>
                <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  Question styles
                </p>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Multiple choice', 'Higher-order thinking', 'Quick check', 'Discussion prompt'].map((s) => {
                    const active = s === 'Multiple choice' || s === 'Higher-order thinking'
                    return (
                      <span
                        key={s}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: theme.font.display,
                          border: active ? '1px solid #F87171' : '1px solid #E5E7EB',
                          background: active ? '#FEF2F2' : '#fff',
                          color: active ? RED_DARK : '#6B7280',
                        }}
                      >
                        {s}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 8px', fontFamily: theme.font.display, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  Question count <span style={{ fontWeight: 400, color: '#9CA3AF' }}>6 prompts</span>
                </p>
                <div style={{ height: 6, borderRadius: 4, background: '#E5E7EB', overflow: 'hidden' }}>
                  <div style={{ width: '55%', height: '100%', background: RED, borderRadius: 4 }} />
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#9CA3AF', fontFamily: theme.font.display }}>
                  Slider adjusts pacing recommendations & differentiations.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 18, padding: 16, borderRadius: 16, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                Quiz Intelligence controls
              </p>
              <div style={{ marginTop: 12, display: 'flex', gap: 24 }}>
                <div>
                  <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', fontFamily: theme.font.display }}>
                    Adaptive difficulty
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Easy', 'Medium', 'Challenging'].map((d) => (
                      <span
                        key={d}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: theme.font.display,
                          border: d === 'Medium' ? '1px solid #F87171' : '1px solid #E5E7EB',
                          background: d === 'Medium' ? '#FEF2F2' : '#fff',
                          color: d === 'Medium' ? RED_DARK : '#6B7280',
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', fontFamily: theme.font.display }}>
                    Accessibility assistant
                  </p>
                  <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: theme.font.display, border: '1px solid #E5E7EB', color: '#6B7280' }}>
                    Accessibility Mode: OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Video preview after URL paste */}
            {showThumbnail ? (
              <div
                style={{
                  marginTop: 18,
                  position: 'relative',
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  background: '#0F172A',
                  opacity: thumbOp,
                  transform: `scale(${thumbScale})`,
                  transformOrigin: 'center top',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: THUMB_HEIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Img
                    src={DEMO_THUMBNAIL}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </div>
                {scanOp > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: `${interpolate(frame, [ANALYZE_START, ANALYZE_END], [0, 100], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      })}%`,
                      height: 3,
                      background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                      boxShadow: '0 0 20px rgba(255,255,255,0.9)',
                      opacity: scanOp,
                    }}
                  />
                ) : null}
              </div>
            ) : null}

              </>
            ) : (
              <YouTubeQuizPanel quizOp={quizOp} quizY={quizY} quizScrollY={quizScrollY} />
            )}
          </div>

          <YouTubeQuizRightRail
            urlComplete={urlComplete}
            showThumbnail={showThumbnail}
            showQuiz={showQuiz}
            showTopics={showTopics}
            showClassroomCards={showClassroomCards}
            showMetrics={showMetrics}
            isGenerating={isGenerating}
            thumbOp={thumbOp}
            thumbScale={thumbScale}
            metricsP={metricsP}
            topicsStart={TOPICS_START}
            metricsStart={METRICS_START}
          />
        </div>
      </div>
    </AbsoluteFill>
  )
}

/**
 * Scene 06b — YouTube Quiz blueprint demo (0–540f · 18s)
 * Matches /youtube-quiz UI + quiz results format.
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
import { sceneMaster } from '../utils/sceneTransition'
import {
  DEMO_DISCUSSION_TOPICS,
  DEMO_QUIZ,
  DEMO_THUMBNAIL,
  DEMO_VIDEO_URL,
} from './youtubeQuizDemoData'

export const SCENE06_DURATION = 540

const RED = '#EF4444'
const RED_DARK = '#DC2626'

const TYPE_START = 36
const TYPE_END = 92
const GEN_CLICK = 102
const ANALYZE_END = 168
const TOPICS_START = 178
const QUIZ_REVEAL = 248
const STUDENTS_START = 380
const METRICS_START = 440

const typewriter = (frame: number, start: number, end: number, text: string) => {
  const n = Math.floor(
    interpolate(frame, [start, end], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  return text.slice(0, n)
}

const YoutubeIcon: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="#EF4444">
    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
)

const BookIcon: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 004 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
)

const TargetIcon: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
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

  const panelP = spring({ frame: Math.max(0, frame - 6), fps, config: theme.spring.zoom })
  const panelY = interpolate(panelP, [0, 1], [28, 0])
  const panelOp = interpolate(panelP, [0, 1], [0, 1])

  const urlText = typewriter(frame, TYPE_START, TYPE_END, DEMO_VIDEO_URL)
  const isTyping = frame >= TYPE_START && frame < TYPE_END + 16
  const cursorBlink = frame % 16 < 8
  const isGenerating = frame >= GEN_CLICK && frame < ANALYZE_END
  const btnPress =
    frame >= GEN_CLICK && frame < GEN_CLICK + 8
      ? interpolate(frame, [GEN_CLICK, GEN_CLICK + 8], [1, 0.94], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  const scanOp = isGenerating
    ? interpolate(frame, [GEN_CLICK, GEN_CLICK + 8, ANALYZE_END - 8, ANALYZE_END], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  const urlComplete = frame >= TYPE_END && urlText.length >= DEMO_VIDEO_URL.length - 2
  const showThumbnail = urlComplete && frame < QUIZ_REVEAL

  const thumbP = showThumbnail
    ? spring({ frame: Math.max(0, frame - TYPE_END), fps, config: theme.spring.snappy })
    : 0
  const thumbOp = interpolate(thumbP, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const thumbScale = interpolate(thumbP, [0, 1], [0.96, 1], { extrapolateRight: 'clamp' })

  const showTopics = frame >= TOPICS_START
  const showQuiz = frame >= QUIZ_REVEAL
  const showStudents = frame >= STUDENTS_START
  const showMetrics = frame >= METRICS_START

  const quizP = showQuiz ? spring({ frame: Math.max(0, frame - QUIZ_REVEAL), fps, config: theme.spring.snappy }) : 0
  const quizY = interpolate(quizP, [0, 1], [80, 0], { extrapolateRight: 'clamp' })
  const quizOp = interpolate(quizP, [0, 1], [0, 1], { extrapolateRight: 'clamp' })

  const metricsP = showMetrics
    ? interpolate(frame, [METRICS_START, METRICS_START + 50], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  const METRICS = [
    { label: 'Engagement', value: 0.87, color: RED },
    { label: 'Completion', value: 0.72, color: '#F97316' },
    { label: 'Discussion', value: 0.94, color: theme.colors.secondary },
  ]

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: fg, background: '#F9FAFB' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '40px 48px',
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

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 20, minHeight: 0 }}>
          {/* Blueprint details */}
          <div
            style={{
              borderRadius: 24,
              border: '1px solid #E5E7EB',
              background: '#fff',
              padding: '24px 28px',
              boxShadow: '0 12px 40px rgba(15,23,42,0.06)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <h3 style={{ margin: 0, fontFamily: theme.font.display, fontSize: 20, fontWeight: 700, color: '#111827' }}>
              Blueprint details
            </h3>
            <p style={{ margin: '8px 0 0', fontFamily: theme.font.display, fontSize: 14, color: '#6B7280', lineHeight: 1.45 }}>
              Set your audience and preferences. The link and Generate button are always available in the sticky bar above.
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
                    height: 200,
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
                      objectFit: 'contain',
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
                      top: `${interpolate(frame, [GEN_CLICK, ANALYZE_END], [0, 100], {
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

            {/* Quiz results overlay */}
            {showQuiz ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  maxHeight: '62%',
                  overflow: 'auto',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.97) 12%)',
                  padding: '20px 28px 24px',
                  opacity: quizOp,
                  transform: `translateY(${quizY}px)`,
                }}
              >
                <h4 style={{ margin: 0, fontFamily: theme.font.display, fontSize: 17, fontWeight: 700, color: '#111827' }}>
                  {DEMO_QUIZ.title}
                </h4>
                <p style={{ margin: '6px 0 16px', fontFamily: theme.font.display, fontSize: 13, color: '#6B7280', lineHeight: 1.45 }}>
                  {DEMO_QUIZ.summary}
                </p>
                {DEMO_QUIZ.sections.map((section, si) => (
                  <div
                    key={section.heading}
                    style={{
                      marginBottom: 14,
                      padding: 16,
                      borderRadius: 16,
                      border: '1px solid #E5E7EB',
                      background: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RED, fontWeight: 700, fontSize: 14 }}>
                        {si + 1}
                      </div>
                      <div>
                        <span style={{ fontFamily: theme.font.display, fontSize: 15, fontWeight: 700, color: '#111827' }}>
                          {section.heading}
                        </span>
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 999 }}>
                          {section.questions.length} questions
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6B7280', fontFamily: theme.font.display }}>
                      {section.details}
                    </p>
                    {section.questions.map((q, qi) => (
                      <div key={q.id} style={{ marginTop: qi > 0 ? 10 : 0, padding: 12, borderRadius: 12, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                        <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                          {qi + 1}. {q.prompt}
                        </p>
                        {q.style === 'multiple_choice' && q.options ? (
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {q.options.map((opt, oi) => (
                              <div                                key={opt}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: 10,
                                  border: '1px solid #E5E7EB',
                                  background: '#fff',
                                  fontFamily: theme.font.display,
                                  fontSize: 12,
                                  color: '#4B5563',
                                }}
                              >
                                <span style={{ fontWeight: 700, marginRight: 6 }}>{String.fromCharCode(65 + oi)}.</span>
                                {opt}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6B7280', fontStyle: 'italic', fontFamily: theme.font.display }}>
                            Long response · sample answer included for teachers
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderRadius: 24, border: '1px solid #E5E7EB', background: '#fff', padding: '22px 24px', boxShadow: '0 12px 40px rgba(15,23,42,0.06)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <BookIcon />
                <span style={{ fontFamily: theme.font.display, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280' }}>
                  Sample classroom use
                </span>
              </div>
              {[
                { title: 'Day-before preview', bg: '#FEF2F2', text: 'Share the quiz as pre-work. Students collect unfamiliar vocab while watching at home.' },
                { title: 'Station rotation', bg: '#FFF7ED', text: 'Set up a media lab station featuring the clip, earbuds, and QR code access.' },
                { title: 'Mini-documentary study', bg: '#FFF1F2', text: 'Pair documentaries with reflection prompts to build media literacy.' },
              ].map((card, i) => {
                const cardP = spring({ frame: Math.max(0, frame - 20 - i * 12), fps, config: theme.spring.snappy })
                return (
                  <div
                    key={card.title}
                    style={{
                      marginBottom: 10,
                      padding: 14,
                      borderRadius: 16,
                      background: card.bg,
                      opacity: interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
                      transform: `translateX(${interpolate(cardP, [0, 1], [16, 0], { extrapolateRight: 'clamp' })}px)`,
                    }}
                  >
                    <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 14, fontWeight: 700, color: '#111827' }}>{card.title}</p>
                    <p style={{ margin: '6px 0 0', fontFamily: theme.font.display, fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{card.text}</p>
                  </div>
                )
              })}

              {showTopics
                ? DEMO_DISCUSSION_TOPICS.map((topic, i) => {
                    const tP = spring({ frame: Math.max(0, frame - TOPICS_START - i * 18), fps, config: theme.spring.snappy })
                    return (
                      <div
                        key={topic}
                        style={{
                          marginTop: 8,
                          padding: 12,
                          borderRadius: 12,
                          border: '1px solid #FECACA',
                          background: '#FEF2F2',
                          opacity: interpolate(tP, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
                          transform: `translateY(${interpolate(tP, [0, 1], [12, 0], { extrapolateRight: 'clamp' })}px)`,
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: theme.font.display }}>
                          Discussion
                        </span>
                        <p style={{ margin: '4px 0 0', fontFamily: theme.font.display, fontSize: 12, fontWeight: 600, color: '#374151', lineHeight: 1.35 }}>
                          {topic}
                        </p>
                      </div>
                    )
                  })
                : null}
            </div>

            <div style={{ borderRadius: 24, border: '1px solid #E5E7EB', background: '#fff', padding: '22px 24px', boxShadow: '0 12px 40px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TargetIcon />
                <span style={{ fontFamily: theme.font.display, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280' }}>
                  Pedagogical guardrails
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF2F2', flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 14, fontWeight: 700, color: '#111827' }}>Pre-watch prompts</p>
                  <p style={{ margin: '4px 0 0', fontFamily: theme.font.display, fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
                    Set purpose before pressing play. Students note predictions to activate prior knowledge.
                  </p>
                </div>
              </div>
            </div>

            {/* Engagement metrics */}
            {showMetrics ? (
              <div style={{ borderRadius: 24, border: '1px solid #E5E7EB', background: '#fff', padding: '20px 24px', opacity: metricsP }}>
                <p style={{ margin: '0 0 14px', fontFamily: theme.font.display, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280' }}>
                  Live engagement
                </p>
                {METRICS.map((bar, i) => {
                  const barFill = interpolate(
                    frame,
                    [METRICS_START + i * 12, METRICS_START + 40 + i * 12],
                    [0, bar.value],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                  )
                  return (
                    <div key={bar.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: theme.font.display, fontSize: 12, color: '#374151' }}>
                        <span>{bar.label}</span>
                        <span style={{ fontWeight: 700 }}>{Math.round(barFill * 100)}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: '#F3F4F6', overflow: 'hidden' }}>
                        <div style={{ width: `${barFill * 100}%`, height: '100%', background: bar.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}

            {/* Students interacting */}
            {showStudents ? (
              <div                style={{
                  borderRadius: 24,
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  padding: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {['🧑‍🎓', '👩‍🎓', '🧑‍💻', '👨‍🏫'].map((emoji, i) => {
                  const sP = spring({ frame: Math.max(0, frame - STUDENTS_START - i * 10), fps, config: theme.spring.bouncy })
                  return (
                    <div
                      key={emoji}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#FEF2F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        transform: `scale(${interpolate(sP, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' })})`,
                        opacity: interpolate(sP, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
                      }}
                    >
                      {emoji}
                    </div>
                  )
                })}
                <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  24 students active in discussion
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

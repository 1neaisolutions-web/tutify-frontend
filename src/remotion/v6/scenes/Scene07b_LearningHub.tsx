/**
 * Learning Hub product walkthrough — mirrors /learning-hub and a full micro-course path.
 * Hub overview → micro-courses → course lessons → quiz → certificate.
 */
import React from 'react'
import {
  AbsoluteFill,
  Easing,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'
import {
  LearningHubDashboardChrome,
  FEATURED_COURSE_CLICK,
} from '../components/LearningHubDashboardChrome'
import {
  DEMO_COURSE,
  DEMO_GROWTH_REC,
  DEMO_HUB_HERO,
  DEMO_LESSON_STEPS,
  DEMO_MICRO_COURSES,
} from './learningHubDemoData'

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

const AMBER = '#F59E0B'
const AMBER_DARK = '#D97706'
const BLUE = '#2563EB'
const BLUE_LIGHT = '#3B82F6'
const INDIGO = '#4F46E5'

/* ── Timeline (snappy hub cursor → click, then course path) ───────────────── */
export const HUB_FOCUS_MICRO = 56
export const CLICK_AT = 84
const CLICK_END = 94
export const COURSE_ENTER = 100
const LESSON_START = 128
const FRAMES_PER_STEP = 28
export const QUIZ_START = LESSON_START + DEMO_LESSON_STEPS.length * FRAMES_PER_STEP + 10
export const Q_SELECT_GAP = 12
const Q_SCROLL_STEP = 128
export const QUIZ_SUBMIT =
  QUIZ_START + DEMO_COURSE.quizQuestions.length * Q_SELECT_GAP + 8
const QUIZ_RESULTS = QUIZ_SUBMIT + 6
export const CERT_START = QUIZ_RESULTS + 10
const CERT_HOLD = 48
export const SCENE07B_DURATION = CERT_START + CERT_HOLD
type Phase = 'hub' | 'course' | 'quiz' | 'certificate'

const getPhase = (frame: number): Phase => {
  if (frame >= CERT_START) return 'certificate'
  if (frame >= QUIZ_START) return 'quiz'
  if (frame >= COURSE_ENTER) return 'course'
  return 'hub'
}

const ZapIcon: React.FC<{ color?: string; size?: number }> = ({ color = AMBER, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
  </svg>
)

const TargetIcon: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const PremiumCursor: React.FC<{ x: number; y: number; clicking?: boolean; ripple?: number }> = ({
  x,
  y,
  clicking,
  ripple = 0,
}) => (
  <>
    {ripple > 0 ? (
      <div
        style={{
          position: 'absolute',
          left: x - 22,
          top: y - 22,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '2px solid rgba(245,158,11,0.55)',
          transform: `scale(${1 + ripple * 2.5})`,
          opacity: Math.max(0, 1 - ripple),
          pointerEvents: 'none',
          zIndex: 199,
        }}
      />
    ) : null}
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 200,
        transform: clicking ? 'scale(0.86) translateY(2px)' : 'scale(1)',
        filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.3))',
        pointerEvents: 'none',
      }}
    >
      <svg width={30} height={30} viewBox="0 0 24 24">
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L6.35 3.21a.5.5 0 00-.85.35z"
          fill="#fff"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  </>
)

const Box: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => <div {...props} />

const HubView: React.FC<{
  microHighlight: number
  clickPulse: number
  featuredHover: number
}> = ({ microHighlight, clickPulse, featuredHover }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div
      style={{
        borderRadius: 20,
        padding: '18px 22px',
        background: 'linear-gradient(90deg, #F59E0B 0%, #F97316 45%, #F43F5E 100%)',
        color: '#fff',
        boxShadow: '0 12px 28px rgba(249,115,22,0.2)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 10px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.2)',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 10,
        }}
      >
        <ZapIcon color="#fff" size={12} /> Growth Hub
      </div>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>{DEMO_HUB_HERO.title}</h1>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.88)' }}>{DEMO_HUB_HERO.subtitle}</p>
      <div style={{ display: 'flex', gap: 22, marginTop: 14 }}>
        {[
          { label: 'Unlocked', value: String(DEMO_HUB_HERO.unlocked) },
          { label: 'Prepared', value: String(DEMO_HUB_HERO.prepared) },
          { label: 'Readiness', value: `${DEMO_HUB_HERO.readiness}%` },
        ].map((s) => (
          <div key={s.label}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', opacity: 0.75 }}>{s.label}</p>
            <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>

    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.48fr 0.92fr', gap: 14, minHeight: 0 }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          border: `2px solid ${microHighlight > 0.25 ? 'rgba(245,158,11,0.5)' : '#E5E7EB'}`,
          padding: '16px 18px',
          boxShadow: microHighlight > 0.25 ? '0 0 0 4px rgba(245,158,11,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexShrink: 0 }}>
          <ZapIcon size={18} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' }}>Personalized micro-courses</h2>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6B7280', flexShrink: 0 }}>
          Short 5–10 minute AI learning units aligned to your classroom.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, justifyContent: 'flex-start' }}>
          {DEMO_MICRO_COURSES.map((course) => {
            const isFeatured = course.featured
            const locked = 'locked' in course && course.locked
            const isHover = isFeatured && featuredHover > 0
            const pressed = isFeatured && clickPulse > 0
            return (
              <div
                key={course.title}
                style={{
                  borderRadius: 14,
                  border: isFeatured
                    ? `2px solid ${pressed ? AMBER : isHover ? 'rgba(245,158,11,0.55)' : '#FDE68A'}`
                    : '1px solid #F3F4F6',
                  background: locked ? 'rgba(249,250,251,0.9)' : isFeatured ? '#FFFBEB' : '#F9FAFB',
                  padding: '10px 12px',
                  opacity: locked ? 0.72 : 1,
                  transform: pressed ? 'scale(0.985)' : isHover ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: isFeatured
                    ? `0 ${8 + featuredHover * 6}px ${20 + featuredHover * 8}px rgba(245,158,11,${0.12 + featuredHover * 0.08})`
                    : undefined,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: AMBER_DARK, lineHeight: 1.3 }}>
                      {course.category} • {course.duration} • {course.difficulty}
                    </p>
                    <h3 style={{ margin: '5px 0 0', fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.35 }}>
                      {course.title}
                    </h3>
                    {course.progress > 0 ? (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ height: 5, borderRadius: 999, background: '#E5E7EB', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${course.progress}%`, background: AMBER, borderRadius: 999 }} />
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: 10, color: '#9CA3AF' }}>{course.progress}% complete</p>
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      flexShrink: 0,
                      padding: '7px 14px',
                      borderRadius: 999,
                      background: locked ? '#F3F4F6' : pressed ? '#FDE68A' : '#FFFBEB',
                      color: locked ? '#9CA3AF' : AMBER_DARK,
                      fontSize: 11,
                      fontWeight: 700,
                      border: isFeatured && !locked ? `1px solid ${AMBER}` : '1px solid transparent',
                    }}
                  >
                    {locked ? '🔒 Locked' : course.cta}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid #E5E7EB',
          padding: 16,
          alignSelf: 'start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TargetIcon />
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
            AI growth recommendations
          </h3>
        </div>
        <div style={{ padding: 14, borderRadius: 14, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{DEMO_GROWTH_REC.skill}</p>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6B7280', lineHeight: 1.45 }}>{DEMO_GROWTH_REC.reason}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: '#FEE2E2', color: '#B91C1C' }}>
              {DEMO_GROWTH_REC.impact} impact
            </span>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{DEMO_GROWTH_REC.time}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)
const CourseView: React.FC<{ stepIndex: number; stepProgress: number; enterT: number }> = ({ stepIndex, stepProgress, enterT }) => {
  const step = DEMO_LESSON_STEPS[Math.min(stepIndex, DEMO_LESSON_STEPS.length - 1)]
  const progressPct = ((stepIndex + stepProgress) / DEMO_LESSON_STEPS.length) * 100
  const blockFade = interpolate(stepProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const blockY = interpolate(stepProgress, [0, 0.2], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const btnGlow = stepProgress > 0.55 ? 0.35 + 0.25 * Math.sin(stepProgress * Math.PI * 4) : 0

  return (
    <div
      style={{
        transform: `translateY(${interpolate(enterT, [0, 1], [20, 0])}px)`,
        opacity: enterT,
        height: '100%',
      }}
    >
      <div
        style={{
          borderRadius: 24,
          padding: '28px 32px',
          background: `linear-gradient(90deg, ${BLUE} 0%, ${INDIGO} 50%, #7C3AED 100%)`,
          color: '#fff',
          marginBottom: 20,
          boxShadow: '0 16px 40px rgba(37,99,235,0.2)',
        }}
      >
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', opacity: 0.85 }}>
          {DEMO_COURSE.subtitle} • {DEMO_COURSE.duration} • {DEMO_COURSE.difficulty}
        </p>
        <h1 style={{ margin: '10px 0 8px', fontSize: 26, fontWeight: 700 }}>{DEMO_COURSE.title}</h1>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9, maxWidth: 720 }}>{DEMO_COURSE.description}</p>
        <div style={{ marginTop: 16, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: '#fff', borderRadius: 999 }} />
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 12, opacity: 0.85 }}>
          Lesson {step.lessonIdx + 1} of {step.lessonCount} • {Math.round(progressPct)}% complete
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', padding: 20 }}>
          <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
            Course Content
          </p>
          {DEMO_COURSE.lessons.map((lesson, idx) => {
            const done = idx < step.lessonIdx
            const active = idx === step.lessonIdx
            return (
              <div
                key={lesson.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  marginBottom: 8,
                  border: active ? `2px solid ${BLUE_LIGHT}` : '2px solid transparent',
                  background: active ? 'rgba(59,130,246,0.06)' : done ? 'rgba(22,163,74,0.06)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: done ? '#DCFCE7' : active ? '#DBEAFE' : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: done ? '#16A34A' : active ? BLUE : '#9CA3AF',
                    }}
                  >
                    {done ? '✓' : idx + 1}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{lesson.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{lesson.duration}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', padding: 28 }}>
          <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6B7280' }}>
            Lesson {step.lessonIdx + 1} of {step.lessonCount} • {step.lessonDuration}
          </p>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 700, color: '#111827' }}>{step.lessonTitle}</h2>
          <div style={{ opacity: blockFade, transform: `translateY(${blockY}px)` }}>
          {step.block.type === 'text' ? (
            <div>
              <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#111827' }}>{step.block.heading}</h3>
              <p style={{ margin: 0, fontSize: 15, color: '#4B5563', lineHeight: 1.65 }}>{step.block.body}</p>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 16,
                border: `2px solid ${BLUE_LIGHT}`,
                background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
                padding: 20,
              }}
            >
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: BLUE }}>Reflection</p>
              <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700, color: '#111827' }}>{step.block.heading}</h3>
              <p style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>{step.block.body}</p>
            </div>
          )}
          </div>
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>
              Content {step.blockIdx + 1} of {step.blockCount}
            </span>
            <div
              style={{
                padding: '12px 22px',
                borderRadius: 999,
                background: BLUE,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                boxShadow:
                  btnGlow > 0 ? `0 0 0 ${3 + btnGlow * 4}px rgba(37,99,235,${btnGlow})` : undefined,
              }}
            >
              {stepIndex >= DEMO_LESSON_STEPS.length - 1 && stepProgress > 0.7 ? 'Complete Course' : 'Continue'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const QuizView: React.FC<{ quizFrame: number; submitted: boolean }> = ({ quizFrame, submitted }) => {
  const scrollY = interpolate(
    quizFrame,
    DEMO_COURSE.quizQuestions.map((_, i) => i * Q_SELECT_GAP),
    DEMO_COURSE.quizQuestions.map((_, i) => -i * Q_SCROLL_STEP),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const atSubmit = quizFrame >= QUIZ_SUBMIT - QUIZ_START - 4

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', height: '100%' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          border: '1px solid #E5E7EB',
          padding: '22px 26px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Course Assessment</h2>
        <p style={{ margin: '6px 0 12px', fontSize: 13, color: '#6B7280' }}>{DEMO_COURSE.quizSubtitle}</p>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
          <div style={{ transform: `translateY(${scrollY}px)` }}>
            {DEMO_COURSE.quizQuestions.map((q, idx) => {
              const selectAt = idx * Q_SELECT_GAP
              const selected =
                submitted || quizFrame >= selectAt + 3
                  ? q.correctAnswer
                  : quizFrame >= selectAt
                    ? Math.min(q.options.length - 1, Math.floor((quizFrame - selectAt) / 3))
                    : -1
              const showResult = submitted
              return (
                <div
                  key={q.id}
                  style={{
                    marginBottom: 14,
                    padding: 16,
                    borderRadius: 16,
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: showResult ? '#DCFCE7' : '#DBEAFE',
                        color: showResult ? '#16A34A' : BLUE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827', lineHeight: 1.35 }}>
                      {q.question}
                    </h3>
                  </div>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selected === optIdx
                    const isCorrect = optIdx === q.correctAnswer
                    let border = '#E5E7EB'
                    let bg = '#fff'
                    if (showResult && isCorrect) {
                      border = '#22C55E'
                      bg = '#F0FDF4'
                    } else if (showResult && isSelected && !isCorrect) {
                      border = '#EF4444'
                      bg = '#FEF2F2'
                    } else if (isSelected && !showResult) {
                      border = BLUE_LIGHT
                      bg = '#EFF6FF'
                    }
                    return (
                      <div
                        key={opt}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '11px 14px',
                          marginBottom: 6,
                          borderRadius: 10,
                          border: `2px solid ${border}`,
                          background: bg,
                          fontSize: 13,
                          color: '#374151',
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? BLUE : '#D1D5DB'}`,
                            background: isSelected ? BLUE : '#fff',
                            flexShrink: 0,
                          }}
                        />
                        {opt}
                      </div>
                    )
                  })}
                  {showResult ? (
                    <p style={{ margin: '10px 0 0', fontSize: 12, color: '#16A34A', fontWeight: 500 }}>
                      ✓ {q.explanation}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
        {!submitted ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, flexShrink: 0 }}>
            <div
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                background: atSubmit ? BLUE : '#93C5FD',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                transform: atSubmit ? 'scale(0.96)' : 'scale(1)',
              }}
            >
              Submit Assessment →
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: 10,
              padding: 18,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
              border: `1px solid ${BLUE_LIGHT}`,
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Congratulations! You passed!</p>
            <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, color: BLUE }}>Score: 4/4 (100%)</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CertificateView: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      opacity,
    }}
  >
    <div
      style={{
        transform: `scale(${scale})`,
        background: '#fff',
        borderRadius: 28,
        padding: '48px 56px',
        maxWidth: 640,
        textAlign: 'center',
        boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
        border: `2px solid ${BLUE_LIGHT}`,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: BLUE,
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
        }}
      >
        🏆
      </div>
      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: '#111827' }}>Congratulations!</h1>
      <p style={{ margin: '0 0 24px', fontSize: 16, color: '#6B7280' }}>You&apos;ve completed the course</p>
      <div
        style={{
          padding: 28,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
          border: `1px solid ${BLUE_LIGHT}`,
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#111827' }}>{DEMO_COURSE.title}</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>Certificate of Completion</p>
        <p style={{ margin: '16px 0 0', fontSize: 14, color: BLUE, fontWeight: 600 }}>
          Formative assessment strategies — verified
        </p>
      </div>
    </div>
  </div>
)

export const Scene07b_LearningHub: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const master = sceneMaster(frame, SCENE07B_DURATION)
  const phase = getPhase(frame)

  const microHighlight = interpolate(frame, [HUB_FOCUS_MICRO, HUB_FOCUS_MICRO + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const clickPulse = interpolate(frame, [CLICK_AT, CLICK_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const courseLocal = frame - COURSE_ENTER
  const lessonFrame = Math.max(0, courseLocal - (LESSON_START - COURSE_ENTER))
  const stepIndex = Math.min(
    DEMO_LESSON_STEPS.length - 1,
    Math.floor(lessonFrame / FRAMES_PER_STEP),
  )
  const stepProgress = (lessonFrame % FRAMES_PER_STEP) / FRAMES_PER_STEP

  const quizFrame = frame - QUIZ_START
  const submitted = frame >= QUIZ_SUBMIT

  const certLocal = frame - CERT_START
  const certOp = interpolate(certLocal, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const certScale = spring({
    frame: Math.max(0, certLocal),
    fps,
    config: { damping: 90, stiffness: 220, mass: 0.8 },
  })

  const hubOp = phase === 'hub' ? 1 : interpolate(frame, [COURSE_ENTER, COURSE_ENTER + 14], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const courseOp = interpolate(
    frame,
    [COURSE_ENTER, COURSE_ENTER + 14, QUIZ_START, QUIZ_START + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const quizOp = interpolate(
    frame,
    [QUIZ_START, QUIZ_START + 10, CERT_START, CERT_START + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const cursorVisible = frame >= HUB_FOCUS_MICRO && frame < COURSE_ENTER + 12
  const clicking = frame >= CLICK_AT && frame < CLICK_END
  const featuredHover = interpolate(frame, [HUB_FOCUS_MICRO + 10, CLICK_AT - 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const clickRipple = interpolate(frame, [CLICK_AT, CLICK_AT + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cursorStart = { x: 920, y: 620 }
  const cursorTravelEnd = CLICK_AT - 5
  const cursorMove = interpolate(
    frame,
    [HUB_FOCUS_MICRO, cursorTravelEnd],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  )
  const cursorX = interpolate(
    cursorMove,
    [0, 1],
    [cursorStart.x, FEATURED_COURSE_CLICK.x],
  )
  const cursorY = interpolate(
    cursorMove,
    [0, 1],
    [cursorStart.y, FEATURED_COURSE_CLICK.y],
  )
  const courseEnterT = spring({
    frame: Math.max(0, frame - COURSE_ENTER),
    fps,
    config: theme.spring.zoom,
  })

  return (
    <AbsoluteFill style={{ opacity: master, fontFamily }}>
      <LearningHubDashboardChrome
        fontFamily={fontFamily}
        pageTitle={phase === 'hub' ? 'Professional Learning Hub' : 'Micro-course'}
      >
        {hubOp > 0.01 ? (
          <Box style={{ opacity: hubOp, height: '100%' }}>
            <HubView
              microHighlight={microHighlight}
              clickPulse={clickPulse}
              featuredHover={featuredHover}
            />
          </Box>
        ) : null}
        {courseOp > 0.01 ? (
          <Box style={{ opacity: courseOp, position: 'absolute', inset: 0, height: '100%' }}>
            <CourseView stepIndex={stepIndex} stepProgress={stepProgress} enterT={courseEnterT} />
          </Box>
        ) : null}
        {quizOp > 0.01 ? (
          <Box style={{ opacity: quizOp, height: '100%' }}>
            <QuizView quizFrame={quizFrame} submitted={submitted} />
          </Box>
        ) : null}
        {phase === 'certificate' ? (
          <Box style={{ position: 'absolute', inset: 0 }}>
            <CertificateView opacity={certOp} scale={certScale} />
          </Box>
        ) : null}
      </LearningHubDashboardChrome>
      {cursorVisible ? (
        <PremiumCursor x={cursorX} y={cursorY} clicking={clicking} ripple={clickRipple} />
      ) : null}
    </AbsoluteFill>
  )
}


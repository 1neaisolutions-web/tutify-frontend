/**
 * Learning Hub product walkthrough — mirrors /learning-hub and a full micro-course path.
 * Hub overview → micro-courses → course lessons → quiz → certificate.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, spring } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'

import { loadFont } from '@remotion/google-fonts/Inter'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'
import {
  PRODUCT_UI_REVEAL_DURATION,
  productUI3DRevealIn,
  productUI3DRevealOutBlur,
  productUI3DRevealTransform,
} from '../../shared/transitions/productUI3DReveal'
import { ProductUI3DRevealOverlay } from '../../shared/transitions/ProductUI3DRevealOverlay'
import {
  LearningHubDashboardChrome,
  FEATURED_COURSE_CLICK,
  QUIZ_SUBMIT_BUTTON_CLICK,
  QUIZ_SUBMIT_CURSOR_START,
} from '../components/LearningHubDashboardChrome'
import {
  QUIZ_HERO_BUTTON_TARGET,
  QUIZ_SUBMIT_CLICK_HOLD,
  QUIZ_SUBMIT_CURSOR_LEAD,
  QUIZ_SUBMIT_EXIT_FRAMES,
  QUIZ_SUBMIT_ZOOM_HOLD,
  QUIZ_SUBMIT_ZOOM_IN_FRAMES,
  quizChromeHideOpacity,
  quizContentFadeOpacity,
  QUIZ_HERO_TRANSFORM_ORIGIN,
  quizHeroCardPan,
  quizHeroCardScale,
  quizHeroCardTilt,
  quizHeroHeaderPeekOpacity,
  quizHeroSlideUpY,
  quizSubmitButtonPress,
  quizSubmitGlowOpacity,
  quizZeliosPurpleOpacity,
} from '../../shared/transitions/quizSubmitClickZoom'
import { QuizSubmitZeliosBackdrop } from '../components/QuizSubmitZeliosBackdrop'
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
export const CLICK_AT = 70
const CLICK_END = 78
export const COURSE_ENTER = 84
const LESSON_START = 102
const FRAMES_PER_STEP = 18
export const QUIZ_START = LESSON_START + DEMO_LESSON_STEPS.length * FRAMES_PER_STEP + 6
export const Q_SELECT_GAP = 8
const Q_SCROLL_STEP = 128
/** All questions answered — submit button becomes active. */
export const QUIZ_READY_AT =
  QUIZ_START + DEMO_COURSE.quizQuestions.length * Q_SELECT_GAP + 4
/** Cursor → real submit pill (aligned to ~00:53 in TutifyDemoV10). */
export const SUBMIT_CURSOR_TRAVEL_START = QUIZ_READY_AT - 4
export const SUBMIT_CURSOR_ARRIVAL = QUIZ_READY_AT + 10
/** Screen change only after cursor points at button (no click yet). */
const SUBMIT_ON_BUTTON_HOLD = 12
export const SUBMIT_HERO_START = SUBMIT_CURSOR_ARRIVAL + SUBMIT_ON_BUTTON_HOLD
export const SUBMIT_FOCUS_START = SUBMIT_HERO_START
/** Tight zoom: button + header strip above. */
export const SUBMIT_ZOOM_END = SUBMIT_HERO_START + QUIZ_SUBMIT_ZOOM_IN_FRAMES
/** Hold zoom, then click. */
export const SUBMIT_CLICK_AT = SUBMIT_ZOOM_END + QUIZ_SUBMIT_ZOOM_HOLD
export const SUBMIT_CLICK_END = SUBMIT_CLICK_AT + QUIZ_SUBMIT_CLICK_HOLD
/** Slide up + hand off to results. */
export const QUIZ_SUBMIT = SUBMIT_CLICK_END + QUIZ_SUBMIT_EXIT_FRAMES
const QUIZ_RESULTS = QUIZ_SUBMIT + 4
export const CERT_START = QUIZ_RESULTS + 6
const CERT_HOLD = 40
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

const SKY_CTA_GRADIENT = 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 42%, #0EA5E9 100%)'
const PURPLE_CTA_GRADIENT = 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 48%, #5B21B6 100%)'
const PURPLE_CTA_GLOW =
  '0 0 36px rgba(124,58,237,0.5), 0 10px 28px rgba(91,33,182,0.4)'
const SKY_CTA_GLOW = '0 8px 22px rgba(14,165,233,0.32), 0 4px 12px rgba(56,189,248,0.2)'

const QuizView: React.FC<{
  quizFrame: number
  submitted: boolean
  submitPress?: number
  submitGlow?: number
  submitReady?: boolean
  heroMode?: boolean
  heroScale?: number
  heroTilt?: { rotateX: number; rotateY: number }
  heroPanX?: number
  heroPanY?: number
  contentFade?: number
  headerPeek?: number
}> = ({
  quizFrame,
  submitted,
  submitPress = 1,
  submitGlow = 0,
  submitReady = false,
  heroMode = false,
  heroScale = 1,
  heroTilt = { rotateX: 0, rotateY: 0 },
  heroPanX = 0,
  heroPanY = 0,
  contentFade = 1,
  headerPeek = 0,
}) => {
  const scrollY = interpolate(
    quizFrame,
    DEMO_COURSE.quizQuestions.map((_, i) => i * Q_SELECT_GAP),
    DEMO_COURSE.quizQuestions.map((_, i) => -i * Q_SCROLL_STEP),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const readyToSubmit = submitReady
  const submitPressed = submitGlow > 0.02 || submitPress < 0.95

  const tealGlow = `0 0 ${44 + submitGlow * 48}px rgba(45,212,191,${0.38 + submitGlow * 0.42}), 0 28px 80px rgba(0,0,0,${0.14 + submitGlow * 0.06})`

  const outerStyle: React.CSSProperties = heroMode
    ? {
        width: 1080,
        height: 640,
        transform: `
          translate(${heroPanX}px, ${heroPanY}px)
          perspective(1800px)
          rotateX(${heroTilt.rotateX}deg)
          rotateY(${heroTilt.rotateY}deg)
          scale(${heroScale})
        `,
        transformOrigin: QUIZ_HERO_TRANSFORM_ORIGIN,
      }
    : {
        maxWidth: 920,
        margin: '0 auto',
        height: '100%',
      }

  return (
    <div style={outerStyle}>
      <div
        style={{
          background: '#fff',
          borderRadius: heroMode ? 22 : 24,
          border: '1px solid #E5E7EB',
          padding: heroMode ? '24px 28px' : '22px 26px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: heroMode ? tealGlow : '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ opacity: heroMode ? headerPeek : contentFade }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Course Assessment</h2>
          <p style={{ margin: '6px 0 12px', fontSize: 13, color: '#6B7280' }}>{DEMO_COURSE.quizSubtitle}</p>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 0,
            opacity: contentFade,
          }}
        >
          {heroMode && contentFade < 0.4 ? (
            <div style={{ padding: '12px 8px 0', opacity: 0.5 }}>
              {[72, 88, 64, 80, 55].map((w) => (
                <div
                  key={w}
                  style={{
                    height: 11,
                    width: `${w}%`,
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #E9D5FF, #F3E8FF)',
                    marginBottom: 14,
                  }}
                />
              ))}
            </div>
          ) : null}
          <div style={{ transform: `translateY(${scrollY}px)`, opacity: heroMode && contentFade < 0.4 ? 0 : 1 }}>
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
                position: 'relative',
                padding: heroMode ? '15px 34px' : '12px 24px',
                borderRadius: 999,
                background: !readyToSubmit
                  ? '#93C5FD'
                  : submitPressed
                    ? PURPLE_CTA_GRADIENT
                    : SKY_CTA_GRADIENT,
                color: '#fff',
                fontSize: heroMode ? 17 : 13,
                fontWeight: 700,
                transform: `scale(${submitPress})`,
                boxShadow:
                  submitGlow > 0.02
                    ? `0 0 ${36 + submitGlow * 32}px rgba(124,58,237,${0.5 + submitGlow * 0.35}), 0 10px 28px rgba(91,33,182,0.4)`
                    : submitPressed
                      ? PURPLE_CTA_GLOW
                      : readyToSubmit
                        ? SKY_CTA_GLOW
                        : '0 4px 12px rgba(147,197,253,0.35)',
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

export type LearningHubMotionStyle = 'default' | 'product3d'

export type Scene07bLearningHubProps = {
  /** V10 — SaaS-style tilt + blur reveal into quiz UI (course → assessment handoff). */
  motionStyle?: LearningHubMotionStyle
  /** V10 — submit button cursor click + zoom-out from bottom-right. */
  enableSubmitClickBeat?: boolean
}

export const Scene07b_LearningHub: React.FC<Scene07bLearningHubProps> = ({
  motionStyle = 'default',
  enableSubmitClickBeat = false,
}) => {
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

  const useProduct3d = motionStyle === 'product3d'
  const useSubmitBeat = enableSubmitClickBeat || useProduct3d
  const quizRevealStart = QUIZ_START
  const quizRevealMotion = useProduct3d
    ? productUI3DRevealIn(frame, quizRevealStart, PRODUCT_UI_REVEAL_DURATION)
    : null
  const courseExitBlur = useProduct3d
    ? productUI3DRevealOutBlur(frame, quizRevealStart, PRODUCT_UI_REVEAL_DURATION)
    : 0

  const hubOp = phase === 'hub' ? 1 : interpolate(frame, [COURSE_ENTER, COURSE_ENTER + 14], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const courseOp = interpolate(
    frame,
    useProduct3d
      ? [COURSE_ENTER, COURSE_ENTER + 14, QUIZ_START, QUIZ_START + PRODUCT_UI_REVEAL_DURATION]
      : [COURSE_ENTER, COURSE_ENTER + 14, QUIZ_START, QUIZ_START + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const quizOp = useProduct3d
    ? quizRevealMotion!.opacity *
      interpolate(
        frame,
        [QUIZ_START + PRODUCT_UI_REVEAL_DURATION, CERT_START, CERT_START + 10],
        [1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : interpolate(
        frame,
        [QUIZ_START, QUIZ_START + 10, CERT_START, CERT_START + 10],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )

  const cursorVisible = frame >= HUB_FOCUS_MICRO && frame < COURSE_ENTER + 12
  const clicking = frame >= CLICK_AT && frame < CLICK_END
  const featuredHover = interpolate(frame, [HUB_FOCUS_MICRO + 6, CLICK_AT - 1], [0, 1], {
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

  const submitCursorStart = SUBMIT_CURSOR_TRAVEL_START
  const submitCursorArrival = SUBMIT_CURSOR_ARRIVAL
  const submitHeroActive =
    useSubmitBeat && phase === 'quiz' && frame >= SUBMIT_HERO_START && frame < QUIZ_SUBMIT
  const purpleBg = useSubmitBeat
    ? quizZeliosPurpleOpacity(frame, SUBMIT_HERO_START, SUBMIT_CLICK_END, QUIZ_SUBMIT)
    : 0
  const chromeVisible = useSubmitBeat
    ? quizChromeHideOpacity(frame, SUBMIT_HERO_START, SUBMIT_CLICK_END, QUIZ_SUBMIT)
    : 1
  const contentFade = useSubmitBeat
    ? quizContentFadeOpacity(frame, SUBMIT_HERO_START, QUIZ_SUBMIT)
    : 1
  const headerPeek = useSubmitBeat
    ? quizHeroHeaderPeekOpacity(frame, SUBMIT_ZOOM_END, SUBMIT_CLICK_END)
    : 1
  const heroScale = useSubmitBeat
    ? quizHeroCardScale(frame, SUBMIT_HERO_START, SUBMIT_ZOOM_END, SUBMIT_CLICK_END)
    : 1
  const heroTilt = useSubmitBeat ? quizHeroCardTilt(frame, SUBMIT_HERO_START, SUBMIT_ZOOM_END) : { rotateX: 0, rotateY: 0 }
  const heroPan = useSubmitBeat
    ? quizHeroCardPan(frame, SUBMIT_HERO_START, SUBMIT_ZOOM_END, SUBMIT_CLICK_END)
    : { x: 0, y: 0 }
  const heroSlideY = useSubmitBeat ? quizHeroSlideUpY(frame, SUBMIT_CLICK_END, QUIZ_SUBMIT) : 0
  const submitGlow = useSubmitBeat
    ? quizSubmitGlowOpacity(frame, SUBMIT_CLICK_AT, SUBMIT_CLICK_END)
    : 0
  const submitPress = useSubmitBeat ? quizSubmitButtonPress(frame, SUBMIT_CLICK_AT) : 1
  const submitCursorVisible =
    useSubmitBeat &&
    phase === 'quiz' &&
    frame >= submitCursorStart &&
    frame < SUBMIT_CLICK_AT + QUIZ_SUBMIT_CLICK_HOLD + 10
  const submitClicking =
    useSubmitBeat &&
    frame >= SUBMIT_CLICK_AT &&
    frame < SUBMIT_CLICK_AT + QUIZ_SUBMIT_CLICK_HOLD
  const submitRipple = interpolate(frame, [SUBMIT_CLICK_AT, SUBMIT_CLICK_AT + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cursorOnRealButton = frame >= submitCursorArrival && frame < SUBMIT_HERO_START
  const submitCursorMove = interpolate(
    frame,
    [submitCursorStart, submitCursorArrival],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  )
  const cursorXOnButton =
    submitHeroActive || frame >= SUBMIT_HERO_START
      ? QUIZ_HERO_BUTTON_TARGET.x
      : cursorOnRealButton
        ? QUIZ_SUBMIT_BUTTON_CLICK.x
        : interpolate(
            submitCursorMove,
            [0, 1],
            [QUIZ_SUBMIT_CURSOR_START.x, QUIZ_SUBMIT_BUTTON_CLICK.x],
            { extrapolateRight: 'clamp' },
          )
  const cursorYOnButton =
    submitHeroActive || frame >= SUBMIT_HERO_START
      ? QUIZ_HERO_BUTTON_TARGET.y
      : cursorOnRealButton
        ? QUIZ_SUBMIT_BUTTON_CLICK.y
        : interpolate(
            submitCursorMove,
            [0, 1],
            [QUIZ_SUBMIT_CURSOR_START.y, QUIZ_SUBMIT_BUTTON_CLICK.y],
            { extrapolateRight: 'clamp' },
          )

  const quizViewProps = {
    quizFrame,
    submitted,
    submitPress,
    submitGlow,
    submitReady: frame >= QUIZ_READY_AT,
    contentFade,
    headerPeek,
  }

  return (
    <AbsoluteFill style={{ opacity: master, fontFamily }}>
      <QuizSubmitZeliosBackdrop opacity={purpleBg} />
      {chromeVisible > 0.02 ? (
      <AbsoluteFill style={{ opacity: chromeVisible, zIndex: 300 }}>
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
          <Box
            style={{
              opacity: courseOp,
              position: 'absolute',
              inset: 0,
              height: '100%',
              filter: courseExitBlur > 0.4 ? `blur(${courseExitBlur}px)` : undefined,
            }}
          >
            <CourseView stepIndex={stepIndex} stepProgress={stepProgress} enterT={courseEnterT} />
          </Box>
        ) : null}
        {quizOp > 0.01 && !submitHeroActive ? (
          <Box
            style={
              useProduct3d && quizRevealMotion
                ? {
                    opacity: quizOp,
                    height: '100%',
                    transform: productUI3DRevealTransform(quizRevealMotion),
                    transformOrigin: 'center 42%',
                    filter:
                      quizRevealMotion.blur > 0.35 ? `blur(${quizRevealMotion.blur}px)` : undefined,
                  }
                : { opacity: quizOp, height: '100%' }
            }
          >
            <QuizView {...quizViewProps} />
          </Box>
        ) : null}
        {phase === 'certificate' ? (
          <Box style={{ position: 'absolute', inset: 0 }}>
            <CertificateView opacity={certOp} scale={certScale} />
          </Box>
        ) : null}
      </LearningHubDashboardChrome>
      </AbsoluteFill>
      ) : null}
      {quizOp > 0.01 && submitHeroActive ? (
        <AbsoluteFill
          style={{
            zIndex: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: 1800,
            transform: `translateY(${heroSlideY}px)`,
          }}
        >
          <QuizView
            {...quizViewProps}
            heroMode
            heroScale={heroScale}
            heroTilt={heroTilt}
            heroPanX={heroPan.x}
            heroPanY={heroPan.y}
            headerPeek={headerPeek}
          />
        </AbsoluteFill>
      ) : null}
      {cursorVisible ? (
        <PremiumCursor x={cursorX} y={cursorY} clicking={clicking} ripple={clickRipple} />
      ) : null}
      {submitCursorVisible ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 500, pointerEvents: 'none' }}>
          <PremiumCursor
            x={cursorXOnButton}
            y={cursorYOnButton}
            clicking={submitClicking}
            ripple={submitRipple}
          />
        </div>
      ) : null}
      {useProduct3d && quizRevealMotion && !submitHeroActive ? (
        <ProductUI3DRevealOverlay opacity={quizRevealMotion.glowOpacity} />
      ) : null}
    </AbsoluteFill>
  )
}


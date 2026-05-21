import React from 'react'
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { theme } from '../theme'
import { DEMO_DISCUSSION_TOPICS, DEMO_THUMBNAIL } from './youtubeQuizDemoData'

const RED = '#EF4444'

const cardShell: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid #E5E7EB',
  background: '#fff',
  boxShadow: '0 12px 40px rgba(15,23,42,0.06)',
}

const THUMB_HEIGHT = 200

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

type YouTubeQuizRightRailProps = {
  urlComplete: boolean
  showThumbnail: boolean
  showQuiz: boolean
  showTopics: boolean
  showClassroomCards: boolean
  showMetrics: boolean
  isGenerating: boolean
  thumbOp: number
  thumbScale: number
  metricsP: number
  topicsStart: number
  metricsStart: number
}

export const YouTubeQuizRightRail: React.FC<YouTubeQuizRightRailProps> = ({
  urlComplete,
  showThumbnail,
  showQuiz,
  showTopics,
  showClassroomCards,
  showMetrics,
  isGenerating,
  thumbOp,
  thumbScale,
  metricsP,
  topicsStart,
  metricsStart,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const METRICS = [
    { label: 'Engagement', value: 0.87, color: RED },
    { label: 'Completion', value: 0.72, color: '#F97316' },
    { label: 'Discussion', value: 0.94, color: theme.colors.secondary },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignSelf: 'start', width: '100%' }}>
      {!urlComplete ? (
        <div style={{ ...cardShell, padding: '20px 22px' }}>
          <p
            style={{
              margin: '0 0 10px',
              fontFamily: theme.font.display,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
            }}
          >
            Video preview
          </p>
          <div
            style={{
              height: 108,
              borderRadius: 14,
              border: '1.5px dashed #E5E7EB',
              background: '#F9FAFB',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 16,
            }}
          >
            <YoutubeIcon />
            <p
              style={{
                margin: 0,
                fontFamily: theme.font.display,
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: 1.45,
                maxWidth: 260,
              }}
            >
              Paste a YouTube link above to load the source video here.
            </p>
          </div>
        </div>
      ) : null}

      {showThumbnail && !showQuiz ? (
        <div
          style={{
            ...cardShell,
            padding: '18px 20px',
            opacity: thumbOp,
            transform: `scale(${thumbScale})`,
            transformOrigin: 'center top',
          }}
        >
          <p
            style={{
              margin: '0 0 10px',
              fontFamily: theme.font.display,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6B7280',
            }}
          >
            Source video
          </p>
          <div
            style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #E5E7EB',
              background: '#0F172A',
              height: THUMB_HEIGHT,
            }}
          >
            <Img
              src={DEMO_THUMBNAIL}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            {isGenerating ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(15,23,42,0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                  Analysing transcript…
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showQuiz && !showTopics ? (
        <div style={{ ...cardShell, padding: '18px 20px' }}>
          <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 14, fontWeight: 600, color: '#374151', lineHeight: 1.45 }}>
            Building discussion prompts from your quiz…
          </p>
        </div>
      ) : null}

      {showTopics ? (
        <div style={{ ...cardShell, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BookIcon />
            <span
              style={{
                fontFamily: theme.font.display,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#6B7280',
              }}
            >
              Discussion prompts
            </span>
          </div>
          {DEMO_DISCUSSION_TOPICS.map((topic, i) => {
            const tP = spring({
              frame: Math.max(0, frame - topicsStart - i * 18),
              fps,
              config: theme.spring.snappy,
            })
            return (
              <div
                key={topic}
                style={{
                  marginTop: i > 0 ? 8 : 0,
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid #FECACA',
                  background: '#FEF2F2',
                  opacity: interpolate(tP, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
                  transform: `translateY(${interpolate(tP, [0, 1], [10, 0], { extrapolateRight: 'clamp' })}px)`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: RED,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontFamily: theme.font.display,
                  }}
                >
                  Discussion
                </span>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontFamily: theme.font.display,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#374151',
                    lineHeight: 1.35,
                  }}
                >
                  {topic}
                </p>
              </div>
            )
          })}
        </div>
      ) : null}

      {showClassroomCards
        ? [
            { title: 'Day-before preview', bg: '#FEF2F2', text: 'Share the quiz as pre-work before class.' },
            { title: 'Station rotation', bg: '#FFF7ED', text: 'Media lab station with the clip and QR access.' },
            { title: 'Mini-documentary study', bg: '#FFF1F2', text: 'Pair the video with reflection prompts.' },
          ].map((card, i) => {
            const cardP = spring({
              frame: Math.max(0, frame - topicsStart - 8 - i * 14),
              fps,
              config: theme.spring.snappy,
            })
            return (
              <div
                key={card.title}
                style={{
                  ...cardShell,
                  padding: '14px 18px',
                  background: card.bg,
                  border: '1px solid #FECACA',
                  opacity: interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
                  transform: `translateX(${interpolate(cardP, [0, 1], [12, 0], { extrapolateRight: 'clamp' })}px)`,
                }}
              >
                <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 13, fontWeight: 700, color: '#111827' }}>
                  {card.title}
                </p>
                <p style={{ margin: '4px 0 0', fontFamily: theme.font.display, fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
                  {card.text}
                </p>
              </div>
            )
          })
        : null}

      {urlComplete && !showTopics ? (
        <div style={{ ...cardShell, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <TargetIcon />
            <span
              style={{
                fontFamily: theme.font.display,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#6B7280',
              }}
            >
              Pedagogical guardrails
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: theme.font.display, fontSize: 13, color: '#6B7280', lineHeight: 1.45 }}>
            Pre-watch prompts help students set purpose before pressing play.
          </p>
        </div>
      ) : null}

      {showMetrics ? (
        <div style={{ ...cardShell, padding: '20px 22px', opacity: metricsP }}>
          <p
            style={{
              margin: '0 0 14px',
              fontFamily: theme.font.display,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6B7280',
            }}
          >
            Live engagement
          </p>
          {METRICS.map((bar, i) => {
            const barFill = interpolate(
              frame,
              [metricsStart + i * 12, metricsStart + 40 + i * 12],
              [0, bar.value],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            )
            return (
              <div key={bar.label} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontFamily: theme.font.display,
                    fontSize: 12,
                    color: '#374151',
                  }}
                >
                  <span>{bar.label}</span>
                  <span style={{ fontWeight: 700 }}>{Math.round(barFill * 100)}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#F3F4F6', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${barFill * 100}%`,
                      height: '100%',
                      background: bar.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

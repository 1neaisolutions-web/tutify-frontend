import React from 'react'
import { theme } from '../theme'
import { DEMO_QUIZ } from './youtubeQuizDemoData'

const RED = '#EF4444'

type YouTubeQuizPanelProps = {
  quizOp: number
  quizY: number
  quizScrollY: number
}

export const YouTubeQuizPanel: React.FC<YouTubeQuizPanelProps> = ({
  quizOp,
  quizY,
  quizScrollY,
}) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      opacity: quizOp,
      transform: `translateY(${quizY}px)`,
    }}
  >
    <div
      style={{
        flexShrink: 0,
        padding: '18px 28px 12px',
        borderBottom: '1px solid #F3F4F6',
        background: '#fff',
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: theme.font.display,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#6B7280',
        }}
      >
        Generated quiz
      </p>
      <h4
        style={{
          margin: '6px 0 0',
          fontFamily: theme.font.display,
          fontSize: 17,
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.3,
        }}
      >
        {DEMO_QUIZ.title}
      </h4>
    </div>

    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative', background: '#FAFAFA' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          padding: '16px 28px 28px',
          transform: `translateY(-${quizScrollY}px)`,
        }}
      >
        <p
          style={{
            margin: '0 0 16px',
            fontFamily: theme.font.display,
            fontSize: 13,
            color: '#6B7280',
            lineHeight: 1.45,
          }}
        >
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
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: RED,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {si + 1}
              </div>
              <div>
                <span
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {section.heading}
                </span>
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#6B7280',
                    background: '#F3F4F6',
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  {section.questions.length} questions
                </span>
              </div>
            </div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 12,
                color: '#6B7280',
                fontFamily: theme.font.display,
              }}
            >
              {section.details}
            </p>
            {section.questions.map((q, qi) => (
              <div
                key={q.id}
                style={{
                  marginTop: qi > 0 ? 10 : 0,
                  padding: 12,
                  borderRadius: 12,
                  background: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: theme.font.display,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {qi + 1}. {q.prompt}
                </p>
                {q.style === 'multiple_choice' && q.options ? (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {q.options.map((opt, oi) => (
                      <div
                        key={opt}
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
                        <span style={{ fontWeight: 700, marginRight: 6 }}>
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: 12,
                      color: '#6B7280',
                      fontStyle: 'italic',
                      fontFamily: theme.font.display,
                    }}
                  >
                    Long response · sample answer included for teachers
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
        {/* Spacer so last section can scroll fully into view */}
        <div style={{ height: 48 }} />
      </div>
    </div>
  </div>
)

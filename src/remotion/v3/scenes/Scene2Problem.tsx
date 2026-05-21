import React from 'react'
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import teacherOverwhelmed from '../teacher-overwhelmed.png'
import { KineticText } from '../components/KineticText'

export const SCENE2_DURATION = 210

const TABS = [
  { label: 'Gmail (47 unread)', color: '#EA4335', x: 55,  y: 38 },
  { label: 'Google Docs',       color: '#4285F4', x: 255, y: 38 },
  { label: 'YouTube',           color: '#FF0000', x: 425, y: 38 },
  { label: 'WhatsApp Web',      color: '#25D366', x: 55,  y: 82 },
  { label: 'Google Drive',      color: '#FBBC04', x: 260, y: 82 },
  { label: 'Google Meet',       color: '#00897B', x: 440, y: 82 },
  { label: 'Canva',             color: '#00C4CC', x: 135, y: 126 },
  { label: 'Grading (12)',      color: '#AB47BC', x: 330, y: 126 },
]

const NOTIFICATIONS = [
  { text: '47 unread emails',      x: 1370, y: 160, delay: 18 },
  { text: '12 assignments to grade', x: 1320, y: 238, delay: 33 },
  { text: 'Meeting in 5 min',      x: 1400, y: 316, delay: 48 },
  { text: '3 parent messages',     x: 1350, y: 394, delay: 63 },
  { text: 'Lesson plan overdue',   x: 1310, y: 472, delay: 78 },
]

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Opening from white
  const openOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Image blur escalates over time — overwhelm effect
  const imgBlur = interpolate(frame, [0, SCENE2_DURATION - 50], [3, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Freeze effect — at frame 162 everything halts
  const freezeP = interpolate(frame, [155, 172], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Desaturate on freeze
  const saturation = interpolate(freezeP, [0, 1], [1, 0.15])

  // Tutify logo reveal at freeze
  const logoOp = interpolate(frame, [170, 186], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    * interpolate(frame, [188, 204], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const logoS = spring({ frame: Math.max(0, frame - 170), fps, config: { damping: 80, stiffness: 250 } })

  // Closing white flash
  const flashOp = interpolate(frame, [SCENE2_DURATION - 16, SCENE2_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: '#07080F', overflow: 'hidden', opacity: openOp }}>
      {/* Background image */}
      <AbsoluteFill style={{
        filter: `blur(${imgBlur}px) brightness(0.65) saturate(${saturation})`,
      }}>
        <Img src={teacherOverwhelmed} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Dark overlay */}
      <AbsoluteFill style={{
        background: `rgba(7,8,15,${interpolate(frame, [0, 40], [0.45, 0.68], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
      }} />

      {/* Browser tabs bar — top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 178,
        background: 'rgba(22,22,32,0.96)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transform: `translateY(${interpolate(freezeP, [0, 1], [0, -8])}px)`,
      }}>
        {TABS.map((tab, i) => {
          const tOp = interpolate(frame - i * 7, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const shake = freezeP < 0.5 ? Math.sin(frame * 0.9 + i * 1.4) * 1.5 : 0
          return (
            <div key={i} style={{
              position: 'absolute',
              left: tab.x + 18 + shake,
              top: tab.y + 18,
              opacity: tOp * (1 - freezeP * 0.25),
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${tab.color}55`,
              borderRadius: 6,
              padding: '5px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: tab.color, boxShadow: `0 0 6px ${tab.color}` }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>
                {tab.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Notification badges — right side */}
      {NOTIFICATIONS.map((notif, i) => {
        const nOp = interpolate(frame - notif.delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const shake = freezeP < 0.5 ? Math.sin(frame * 0.7 + i * 2.1) * 2 : 0
        return (
          <div key={i} style={{
            position: 'absolute',
            left: notif.x + shake,
            top: notif.y,
            opacity: nOp * (1 - freezeP * 0.55),
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#FF4444',
              boxShadow: '0 0 10px rgba(255,68,68,0.9)',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 15,
              color: 'rgba(255,255,255,0.72)',
              background: 'rgba(255,255,255,0.055)',
              padding: '5px 15px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.09)',
              whiteSpace: 'nowrap',
            }}>{notif.text}</span>
          </div>
        )
      })}

      {/* Main narration text */}
      <div style={{
        position: 'absolute',
        bottom: 180,
        left: 100,
        maxWidth: 800,
        opacity: 1 - freezeP * 0.65,
      }}>
        <div style={{ marginBottom: 18 }}>
          <KineticText text="Too many tools." mode="fade-up" startFrame={18} fontSize={72} fontWeight={700} color="#F8FAFC" letterSpacing="-0.04em" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <KineticText text="Too much manual work." mode="fade-up" startFrame={50} fontSize={46} fontWeight={400} color="rgba(248,250,252,0.68)" letterSpacing="-0.015em" />
        </div>
        <div>
          <KineticText text="And no clear path into the AI era." mode="fade-up" startFrame={82} fontSize={46} fontWeight={400} color="#F87171" letterSpacing="-0.015em" />
        </div>
      </div>

      {/* Freeze desaturation wash */}
      <AbsoluteFill style={{
        background: `rgba(190,205,235,${interpolate(freezeP, [0, 1], [0, 0.07])})`,
        pointerEvents: 'none',
      }} />

      {/* Tutify wordmark appears at freeze moment */}
      {frame >= 168 && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(logoS, [0, 1], [0.8, 1])})`,
          opacity: logoOp,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: 88,
            fontWeight: 700,
            color: '#38BDF8',
            letterSpacing: '-0.05em',
            textShadow: '0 0 80px rgba(56,189,248,0.7), 0 0 30px rgba(56,189,248,0.4)',
          }}>tutify</div>
        </div>
      )}

      {/* Closing flash */}
      {flashOp > 0 && (
        <AbsoluteFill style={{ background: `rgba(255,255,255,${flashOp})`, zIndex: 200 }} />
      )}
    </AbsoluteFill>
  )
}

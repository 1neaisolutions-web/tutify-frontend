import React from 'react'
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from 'remotion'
import teacherLate from '../teacher-late.png'
import { KineticText } from '../components/KineticText'

export const SCENE1_DURATION = 240

const BURDEN_WORDS = [
  { text: 'Lesson Plans',     x: 110,  y: 190, delay: 15, angle: -4 },
  { text: 'Worksheets',       x: 1380, y: 270, delay: 28, angle:  3 },
  { text: 'Reports',          x: 180,  y: 740, delay: 42, angle: -2 },
  { text: 'Parent Emails',    x: 1440, y: 680, delay: 56, angle:  5 },
  { text: 'Grade Submissions',x: 680,  y: 880, delay: 70, angle: -3 },
]

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame()

  // Ken Burns slow push-in
  const scale = interpolate(frame, [0, SCENE1_DURATION], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Bottom-heavy dark overlay for text legibility
  const overlayBotOpacity = interpolate(frame, [0, 40], [0.5, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Clock fade-in
  const clockOp = interpolate(frame, [18, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const clockY = interpolate(frame, [18, 48], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Closing white flash for scene transition
  const flashOp = interpolate(frame, [SCENE1_DURATION - 16, SCENE1_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: '#07080F', overflow: 'hidden' }}>
      {/* Background image with Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Img src={teacherLate} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Cinematic overlays */}
      <AbsoluteFill style={{
        background: `linear-gradient(to top, rgba(7,8,15,${overlayBotOpacity}) 0%, rgba(7,8,15,0.38) 45%, rgba(7,8,15,0.15) 100%)`,
      }} />
      <AbsoluteFill style={{
        background: 'linear-gradient(to right, rgba(7,8,15,0.65) 0%, transparent 45%)',
      }} />

      {/* Clock — top right */}
      <div style={{
        position: 'absolute',
        top: 58,
        right: 90,
        textAlign: 'right',
        opacity: clockOp,
        transform: `translateY(${clockY}px)`,
      }}>
        <div style={{
          fontFamily: '"Sora", "Inter", sans-serif',
          fontSize: 60,
          fontWeight: 200,
          color: 'rgba(248,250,252,0.88)',
          letterSpacing: '0.05em',
          textShadow: '0 0 40px rgba(56,189,248,0.35)',
          lineHeight: 1,
        }}>9:07 PM</div>
        <div style={{
          fontFamily: '"DM Sans", "Inter", sans-serif',
          fontSize: 15,
          fontWeight: 400,
          color: 'rgba(248,250,252,0.38)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginTop: 6,
        }}>Thursday Evening</div>
      </div>

      {/* Floating burden words */}
      {BURDEN_WORDS.map((word, i) => {
        const wf = frame - word.delay
        const wOp = interpolate(wf, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const drift = Math.sin((frame / 65 + i * 1.3) * 0.9) * 7
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y + drift,
              opacity: wOp * 0.52,
              fontFamily: '"DM Sans", "Inter", sans-serif',
              fontSize: 17,
              color: '#F8FAFC',
              fontWeight: 500,
              letterSpacing: '0.04em',
              padding: '7px 16px',
              background: 'rgba(255,255,255,0.065)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.09)',
              transform: `rotate(${word.angle}deg)`,
            }}
          >
            {word.text}
          </div>
        )
      })}

      {/* Floating dust particles */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={1920} height={1080}>
        {Array.from({ length: 18 }, (_, i) => {
          const x = (Math.sin(i * 3.7) * 0.5 + 0.5) * 1920
          const baseY = (Math.sin(i * 5.3) * 0.5 + 0.5) * 1080
          const speed = 0.08 + i * 0.004
          const y = ((baseY - frame * speed) % 1080 + 1080) % 1080
          return (
            <circle key={i} cx={x} cy={y} r={1 + i * 0.08} fill="rgba(248,250,252,0.5)" opacity={0.25} />
          )
        })}
      </svg>

      {/* Narration text — bottom left */}
      <div style={{ position: 'absolute', bottom: 110, left: 100, maxWidth: 700 }}>
        <div style={{ marginBottom: 14 }}>
          <KineticText
            text="It's 9 PM."
            mode="fade-up"
            startFrame={30}
            fontSize={78}
            fontWeight={700}
            color="#F8FAFC"
            letterSpacing="-0.04em"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <KineticText
            text="The students are home…"
            mode="fade-up"
            startFrame={65}
            fontSize={48}
            fontWeight={400}
            color="rgba(248,250,252,0.72)"
            letterSpacing="-0.015em"
          />
        </div>
        <div>
          <KineticText
            text="but the teacher is still working."
            mode="fade-up"
            startFrame={100}
            fontSize={48}
            fontWeight={500}
            color="#38BDF8"
            letterSpacing="-0.015em"
          />
        </div>
      </div>

      {/* Closing white flash */}
      {flashOp > 0 && (
        <AbsoluteFill style={{ background: `rgba(255,255,255,${flashOp})`, zIndex: 200 }} />
      )}
    </AbsoluteFill>
  )
}

// Scene 01 — Exhausted Teacher (frames 0–252)
// "Every day, millions of teachers stay long after the bell —
//  drowning in admin, paperwork, and burnout."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { VeoPlaceholder } from '../components/VeoPlaceholder'
import { theme } from '../theme'

export const Scene01ExhaustedTeacher: React.FC = () => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 20, 232, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      <VeoPlaceholder
        src="/veo-clips/scene01.mp4"
        fallbackVariant="teacher"
        overlayColor={theme.colors.navy}
        overlayOpacity={0.45}
      />

      {/* Voiceover caption — lower third */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 120,
        right: 120,
        textAlign: 'center',
      }}>
        {frame >= 40 && frame < 220 && (
          <div style={{
            opacity: interpolate(frame, [40, 60, 200, 220], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            fontFamily: theme.fonts.body,
            fontSize: 28,
            color: 'rgba(245,249,255,0.85)',
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: 0.3,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            Every day, millions of teachers stay long after the bell —
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

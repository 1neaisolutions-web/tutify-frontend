// Scene 02 — Disengaged Students + Worried Parent (frames 252–504)
// "Students are drifting. Parents are left in the dark.
//  The old system is quietly failing everyone it was built for."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { VeoPlaceholder } from '../components/VeoPlaceholder'
import { AnimatedText } from '../components/AnimatedText'
import { theme } from '../theme'

export const Scene02DisengagedStudents: React.FC = () => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      <VeoPlaceholder
        src="/veo-clips/scene02.mp4"
        fallbackVariant="students"
        overlayColor={theme.colors.navy}
        overlayOpacity={0.5}
      />

      {/* Lower-third overlay text */}
      <div style={{
        position: 'absolute',
        bottom: 110,
        left: 120,
        right: 120,
        textAlign: 'center',
      }}>
        <AnimatedText
          text="Students drifting. Parents left in the dark."
          font={theme.fonts.headline}
          size={36}
          weight={700}
          color={theme.colors.white}
          startFrame={60}
          durationFrames={25}
          direction="up"
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.9)',
            letterSpacing: 0.5,
          }}
        />
      </div>

      {/* Divider line */}
      {frame >= 80 && (
        <div style={{
          position: 'absolute',
          bottom: 155,
          left: '50%',
          transform: 'translateX(-50%)',
          width: interpolate(frame, [80, 120], [0, 600], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${theme.colors.skyBlue}, transparent)`,
          opacity: interpolate(frame, [200, 230], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />
      )}
    </AbsoluteFill>
  )
}

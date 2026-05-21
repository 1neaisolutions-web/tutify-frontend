// Scene 03 — Principal Overwhelmed (frames 504–756)
// "Principals lose visibility. Schools lose control.
//  Fragmented tools and unmanaged AI are creating new risks every day."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { VeoPlaceholder } from '../components/VeoPlaceholder'
import { AnimatedText } from '../components/AnimatedText'
import { theme } from '../theme'

export const Scene03PrincipalOverwhelmed: React.FC = () => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      <VeoPlaceholder
        src="/veo-clips/scene03.mp4"
        fallbackVariant="principal"
        overlayColor={theme.colors.navyDeep}
        overlayOpacity={0.6}
      />

      {/* Ominous warning text */}
      <div style={{
        position: 'absolute',
        bottom: 110,
        left: 120,
        right: 120,
        textAlign: 'center',
      }}>
        <AnimatedText
          text="The system is breaking — quietly."
          font={theme.fonts.headline}
          size={40}
          weight={700}
          color={theme.colors.white}
          startFrame={60}
          durationFrames={28}
          direction="up"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.95)', letterSpacing: 0.3 }}
        />
      </div>

      {/* Red warning stripe */}
      {frame >= 70 && (
        <div style={{
          position: 'absolute',
          bottom: 160,
          left: '50%',
          transform: 'translateX(-50%)',
          width: interpolate(frame, [70, 110], [0, 400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          background: 'linear-gradient(90deg, transparent, #FF4D4D, transparent)',
          opacity: interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />
      )}
    </AbsoluteFill>
  )
}

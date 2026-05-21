// Scene 18 — Next Era Vision (frames 4284–4536)
// "Tutify is not just another platform. It is the next era of education —
//  a unified, protected, intelligent ecosystem."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { VeoPlaceholder } from '../components/VeoPlaceholder'
import { AnimatedText } from '../components/AnimatedText'
import { theme } from '../theme'

export const Scene18NextEraVision: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Slow upward camera drift feel
  const containerY = interpolate(frame, [0, 252], [15, -15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Headline
  const headlineOpacity = interpolate(frame, [30, 60], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const headlineY = interpolate(frame, [30, 60], [30, 0], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <div style={{ transform: `translateY(${containerY}px)`, width: '100%', height: '100%' }}>
        <VeoPlaceholder
          src="/veo-clips/scene18.mp4"
          fallbackVariant="vision"
          overlayColor={theme.colors.navy}
          overlayOpacity={0.38}
        />
      </div>

      {/* Hero headline */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        textAlign: 'center',
        opacity: headlineOpacity,
        transform: `translate(-50%, calc(-50% + ${headlineY}px))`,
        width: 900,
      }}>
        <div style={{
          fontFamily: theme.fonts.headline,
          fontSize: 80,
          fontWeight: 800,
          color: theme.colors.white,
          lineHeight: 1.08,
          letterSpacing: -2,
          textShadow: `0 0 80px ${theme.colors.skyBlue}44, 0 4px 40px rgba(0,0,0,0.8)`,
        }}>
          The Next Era of
          <br />
          <span style={{ color: theme.colors.skyBlue }}>Education</span>
        </div>
      </div>

      {/* Bottom label strip */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
      }} />
    </AbsoluteFill>
  )
}

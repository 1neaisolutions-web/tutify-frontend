// Scene 21 — Classroom Joy (frames 5040–5292)
// "The result — teachers reclaim hours. Students stay engaged.
//  Parents stay connected. And learning finally works the way it should."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { VeoPlaceholder } from '../components/VeoPlaceholder'
import { AnimatedText } from '../components/AnimatedText'
import { theme } from '../theme'

export const Scene21ClassroomJoy: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Warm color grade overlay
  const warmOverlayOpacity = interpolate(frame, [0, 40], [0, 0.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Stats strip
  const statsOpacity = interpolate(frame, [70, 100], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <VeoPlaceholder
        src="/veo-clips/scene21.mp4"
        fallbackVariant="classroom"
        overlayColor={theme.colors.navy}
        overlayOpacity={0.25}
      />

      {/* Warm amber color grade */}
      <AbsoluteFill style={{
        background: 'rgba(255,180,60,0.1)',
        mixBlendMode: 'overlay',
        opacity: warmOverlayOpacity,
        pointerEvents: 'none',
      }} />

      {/* Stats strip at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: statsOpacity,
      }}>
        {/* Gradient background */}
        <div style={{
          height: 130,
          background: `linear-gradient(to top, rgba(11,31,58,0.92), transparent)`,
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: 30,
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 80,
            alignItems: 'center',
          }}>
            {[
              { value: '7-10 hrs', label: 'Saved per week', color: theme.colors.teal },
              { value: '98%', label: 'Satisfaction rate', color: theme.colors.skyBlue },
              { value: '50+', label: 'Countries active', color: '#FFB347' },
            ].map((stat, i) => {
              const statDelay = interpolate(frame, [100 + i * 15, 120 + i * 15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
              return (
                <div key={i} style={{ textAlign: 'center', opacity: statDelay }}>
                  <div style={{ fontFamily: theme.fonts.headline, fontSize: 36, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: theme.fonts.body, fontSize: 15, color: 'rgba(245,249,255,0.7)', marginTop: 4 }}>
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <AnimatedText
          text="Real Classrooms. Real Impact."
          font={theme.fonts.headline}
          size={52}
          weight={800}
          color={theme.colors.white}
          startFrame={40}
          durationFrames={30}
          direction="up"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)', letterSpacing: -0.5 }}
        />
      </div>
    </AbsoluteFill>
  )
}

/**
 * Clean slate background for the Connected Ecosystem scene.
 * Opaque base covers the global mesh so this beat has its own look.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

export const EcosystemSceneBackground: React.FC = () => {
  const frame = useCurrentFrame()
  const t = frame * 0.014

  const driftX = 50 + Math.sin(t * 0.7) * 6
  const driftY = 42 + Math.cos(t * 0.55) * 5

  return (
    <AbsoluteFill style={{ background: '#F4F6FA' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 95% 80% at 50% 38%, #FFFFFF 0%, #F0F4FA 52%, #E8EEF6 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 48% at ${driftX}% ${driftY}%, rgba(91,79,207,0.09) 0%, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 42% 38% at 88% 82%, rgba(37,99,235,0.07) 0%, transparent 68%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 38% 32% at 12% 78%, rgba(14,168,113,0.05) 0%, transparent 65%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 28%, transparent 72%, rgba(241,245,249,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

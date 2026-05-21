/**
 * Scene — AI Teacher Assistant intro (title + cumulative tagline).
 * Hands off to Scene04_AIAssistant (live generation UI).
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { AITeacherCopy } from './AITeacherIntro/AITeacherCopy'
import {
  SCENE_AI_TEACHER_INTRO_DURATION,
  SCENE_FADE_START,
} from './AITeacherIntro/constants'

export { SCENE_AI_TEACHER_INTRO_DURATION }

const { fontFamily } = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
})

export const Scene04_AITeacherIntro: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneIn = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const sceneOut = interpolate(
    frame,
    [SCENE_FADE_START, SCENE_AI_TEACHER_INTRO_DURATION],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#FFFFFF' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91, 79, 207, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: sceneIn * sceneOut,
        }}
      >
        <AITeacherCopy fontFamily={fontFamily} contentOpacity={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

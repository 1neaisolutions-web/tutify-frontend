/**
 * YouTube Fun Studio — title + cumulative tagline, then handoff to quiz UI demo.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { loadFont } from '@remotion/google-fonts/Inter'
import { YouTubeStudioCopy } from './YouTubeStudioIntro/YouTubeStudioCopy'
import {
  SCENE_YOUTUBE_STUDIO_INTRO_DURATION,
  SCENE_FADE_START,
} from './YouTubeStudioIntro/constants'
import { CROSSFADE } from '../utils/sceneTransition'

export { SCENE_YOUTUBE_STUDIO_INTRO_DURATION }

const { fontFamily } = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
})

type Scene06YouTubeStudioIntroProps = {
  /** TransitionSeries exit handles fade — keep title visible through rotate. */
  handoffExit?: boolean
}

export const Scene06_YouTubeStudioIntro: React.FC<Scene06YouTubeStudioIntroProps> = ({
  handoffExit = false,
}) => {
  const frame = useCurrentFrame()

  const delayedIn = interpolate(frame, [CROSSFADE, CROSSFADE + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const sceneIn = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const sceneOut = handoffExit
    ? 1
    : interpolate(frame, [SCENE_FADE_START, SCENE_YOUTUBE_STUDIO_INTRO_DURATION], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      })

  const fg = delayedIn * sceneIn * sceneOut

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#FFFFFF' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill style={{ opacity: fg }}>
        <YouTubeStudioCopy fontFamily={fontFamily} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/**
 * YouTube Fun Studio intro → quiz demo via TransitionSeries (rotate CCW handoff).
 */
import React from 'react'
import { TransitionSeries, linearTiming } from '@remotion/transitions'

import {
  Scene06_YouTubeStudioIntro,
  SCENE_YOUTUBE_STUDIO_INTRO_DURATION,
} from '../../v6/scenes/Scene06_YouTubeStudioIntro'
import { Scene06_YouTube, SCENE06_DURATION } from '../../v6/scenes/Scene06_YouTube'
import { rotateCounterclockwise } from '../../transitions/RotateCounterclockwise'
import { ScaledScene } from '../../v9/utils/ScaledScene'
import { YouTubeIntroToQuizTransition } from '../../v9/transitions/ChapterTransitions'

type YouTubeIntroQuizBlockProps = {
  introDuration: number
  quizDuration: number
  crossfade: number
}

export const YouTubeIntroQuizBlock: React.FC<YouTubeIntroQuizBlockProps> = ({
  introDuration,
  quizDuration,
  crossfade,
}) => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={introDuration}>
      <ScaledScene
        sourceDuration={SCENE_YOUTUBE_STUDIO_INTRO_DURATION}
        targetDuration={introDuration}
      >
        <Scene06_YouTubeStudioIntro handoffExit />
      </ScaledScene>
    </TransitionSeries.Sequence>

    <TransitionSeries.Transition
      presentation={rotateCounterclockwise({ maxRotationDeg: -90 })}
      timing={linearTiming({ durationInFrames: crossfade })}
    />

    <TransitionSeries.Sequence durationInFrames={quizDuration}>
      <ScaledScene sourceDuration={SCENE06_DURATION} targetDuration={quizDuration}>
        <Scene06_YouTube handoffEnter />
      </ScaledScene>
    </TransitionSeries.Sequence>
  </TransitionSeries>
)

/** Orange ring wash during the rotate overlap (sibling in parent Sequence). */
export const YouTubeIntroQuizTransitionOverlay: React.FC<{ crossfade: number }> = ({
  crossfade,
}) => <YouTubeIntroToQuizTransition durationInFrames={crossfade} />

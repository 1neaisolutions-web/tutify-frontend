/**
 * Education slide — blue ribbon BG, headline drops top → down word by word.
 * 1920×1080 · 30fps · 210 frames (7s)
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { BlueRibbonBackground } from './BlueRibbonBackground'
import { LineWordReveal, EDUCATION_SLIDE_DURATION } from './LineWordReveal'
import { SceneExitFade } from './SceneExitFade'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500'],
  subsets: ['latin'],
})

export { interFont as EDUCATION_HEADLINE_FONT }

export { EDUCATION_SLIDE_DURATION, REVEAL_COMPLETE_FRAME } from './LineWordReveal'

const EducationChangingSlide: React.FC = () => (
  <SceneExitFade>
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <BlueRibbonBackground />
      <LineWordReveal fontFamily={interFont} />
    </AbsoluteFill>
  </SceneExitFade>
)

export default EducationChangingSlide
export { EducationChangingSlide }

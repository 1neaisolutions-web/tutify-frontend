/**
 * V6 Education slide — rising ribbon + delayed headline.
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { SceneExitFadeV6 } from './SceneExitFadeV6'
import { BlueRibbonBackgroundV6 } from './BlueRibbonBackgroundV6'
import { LineWordRevealV6, EDUCATION_SLIDE_V6_DURATION } from './LineWordRevealV6'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500'],
  subsets: ['latin'],
})

export { EDUCATION_SLIDE_V6_DURATION }
export { interFont as EDUCATION_HEADLINE_FONT }

const EducationChangingSlideV6: React.FC = () => (
  <SceneExitFadeV6>
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <BlueRibbonBackgroundV6 />
      <LineWordRevealV6 fontFamily={interFont} />
    </AbsoluteFill>
  </SceneExitFadeV6>
)

export default EducationChangingSlideV6
export { EducationChangingSlideV6 }

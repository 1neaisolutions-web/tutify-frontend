// Custom morph-dissolve transition (used for dramatic moments)
// For scene-to-scene standard crossfades, the TutifyDemo.tsx uses @remotion/transitions fade()
import React from 'react'
import { AbsoluteFill, interpolate, Easing } from 'remotion'
import { TransitionPresentationComponentProps } from '@remotion/transitions'

type MorphDissolveProps = {
  direction?: 'center-out' | 'left-to-right'
}

export const morphDissolvePresentation = (props?: MorphDissolveProps) => {
  const { direction = 'center-out' } = props ?? {}

  return {
    component: MorphDissolveComponent,
    props: { direction },
  }
}

export const MorphDissolveComponent: React.FC<
  TransitionPresentationComponentProps<{ direction: 'center-out' | 'left-to-right' }>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { direction } = passedProps

  const entering = presentationDirection === 'entering'
  const p = presentationProgress

  if (direction === 'center-out') {
    const scale = entering
      ? interpolate(p, [0, 1], [1.08, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1) })
      : interpolate(p, [0, 1], [1, 0.94], { easing: Easing.bezier(0.4, 0, 0.2, 1) })
    const opacity = entering
      ? interpolate(p, [0, 0.4, 1], [0, 0.8, 1])
      : interpolate(p, [0, 0.6, 1], [1, 0.2, 0])

    return (
      <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
        {children}
      </AbsoluteFill>
    )
  }

  // left-to-right wipe
  const translateX = entering
    ? interpolate(p, [0, 1], [80, 0], { easing: Easing.bezier(0.4, 0, 0.2, 1) })
    : interpolate(p, [0, 1], [0, -80], { easing: Easing.bezier(0.4, 0, 1, 1) })
  const opacity = entering
    ? interpolate(p, [0, 0.5, 1], [0, 0.9, 1])
    : interpolate(p, [0, 0.5, 1], [1, 0.1, 0])

  return (
    <AbsoluteFill style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {children}
    </AbsoluteFill>
  )
}

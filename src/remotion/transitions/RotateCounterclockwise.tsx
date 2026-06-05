/**
 * @remotion/transitions presentation — full-scene rotate counterclockwise (Z axis).
 */
import React, { useMemo } from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'
import type { TransitionPresentationComponentProps } from '@remotion/transitions'

export type RotateCounterclockwiseProps = {
  perspective?: number
  /** Peak rotation in degrees (CSS negative = counterclockwise). */
  maxRotationDeg?: number
}

export const RotateCounterclockwisePresentation: React.FC<
  TransitionPresentationComponentProps<RotateCounterclockwiseProps>
> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const perspective = passedProps.perspective ?? 1400
  const maxDeg = passedProps.maxRotationDeg ?? -90
  const entering = presentationDirection === 'entering'

  const style = useMemo(() => {
    const p = interpolate(presentationProgress, [0, 1], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    })

    const rotation = entering
      ? interpolate(p, [0, 1], [maxDeg, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(p, [0, 1], [0, maxDeg], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

    const scale = entering
      ? interpolate(p, [0, 1], [0.88, 1], { extrapolateRight: 'clamp' })
      : interpolate(p, [0, 1], [1, 0.88], { extrapolateRight: 'clamp' })

    const opacity = entering
      ? interpolate(p, [0, 0.2, 1], [0, 0.92, 1], { extrapolateRight: 'clamp' })
      : interpolate(p, [0, 0.55, 1], [1, 0.65, 0], { extrapolateRight: 'clamp' })

    return {
      width: '100%',
      height: '100%',
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity,
      transformOrigin: 'center center',
    }
  }, [entering, maxDeg, presentationProgress])

  return (
    <AbsoluteFill
      style={{
        perspective,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
    </AbsoluteFill>
  )
}

export const rotateCounterclockwise = (props?: RotateCounterclockwiseProps) => ({
  component: RotateCounterclockwisePresentation,
  props: props ?? {},
})

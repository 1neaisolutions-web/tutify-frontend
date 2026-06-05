/**
 * Card-flip handoff between closing headline beats (line 1 → line 2).
 * Matches @remotion/transitions/flip (rotateY, from-right).
 */
import React, { useMemo } from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'

type FlipFaceProps = {
  children: React.ReactNode
  progress: number
  direction: 'entering' | 'exiting'
}

const FlipFace: React.FC<FlipFaceProps> = ({ children, progress, direction }) => {
  const style = useMemo(() => {
    const startRotationEntering = -180
    const endRotationEntering = 180
    const rotation =
      direction === 'entering'
        ? interpolate(progress, [0, 1], [startRotationEntering, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : interpolate(progress, [0, 1], [0, endRotationEntering], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

    return {
      width: '100%',
      height: '100%',
      transform: `rotateY(${rotation}deg)`,
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
    }
  }, [direction, progress])

  return (
    <AbsoluteFill style={{ transformStyle: 'preserve-3d' }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
    </AbsoluteFill>
  )
}

type ClosingCardFlipProps = {
  progress: number
  exiting: React.ReactNode
  entering: React.ReactNode
}

export const ClosingCardFlip: React.FC<ClosingCardFlipProps> = ({
  progress,
  exiting,
  entering,
}) => {
  const p = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  return (
    <AbsoluteFill style={{ perspective: 1400, transformStyle: 'preserve-3d' }}>
      <FlipFace progress={p} direction="exiting">
        {exiting}
      </FlipFace>
      <FlipFace progress={p} direction="entering">
        {entering}
      </FlipFace>
    </AbsoluteFill>
  )
}

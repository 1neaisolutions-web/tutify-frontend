/**
 * Dark purple field — zelios reference images 2 & 3.
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'

type Props = { opacity: number }

export const QuizSubmitZeliosBackdrop: React.FC<Props> = ({ opacity }) => {
  if (opacity < 0.02) return null

  return (
    <AbsoluteFill
      style={{
        zIndex: 360,
        pointerEvents: 'none',
        opacity,
        background: `
          radial-gradient(ellipse 95% 85% at 48% 40%, #2d1b4e 0%, #1a0f2e 40%, #0d0618 100%),
          radial-gradient(ellipse 55% 45% at 88% 12%, rgba(124,58,237,0.45) 0%, transparent 58%),
          radial-gradient(ellipse 50% 42% at 8% 90%, rgba(91,33,182,0.38) 0%, transparent 55%)
        `,
      }}
    />
  )
}

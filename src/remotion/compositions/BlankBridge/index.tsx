/**
 * Short blank beat between scenes (fade through soft neutral).
 */
import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

export const BLANK_BRIDGE_DURATION = 45

const BlankBridge: React.FC = () => {
  const frame = useCurrentFrame()
  const mid = BLANK_BRIDGE_DURATION / 2

  const op =
    frame < mid
      ? interpolate(frame, [0, mid], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(frame, [mid, BLANK_BRIDGE_DURATION], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

  return (
    <AbsoluteFill style={{ background: '#F4F6F8', opacity: op }} />
  )
}

export default BlankBridge
export { BlankBridge }

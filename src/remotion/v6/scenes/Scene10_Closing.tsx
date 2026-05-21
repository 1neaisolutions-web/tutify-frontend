/**
 * Scene 10 — Closing (tight handoffs between beats)
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'
import {
  SCENE10_DURATION,
  P2_START,
  P3_START,
  P4_START,
} from './ClosingScene/constants'
import {
  ClosingBlackBackground,
  ClosingLightBackground,
  ClosingSkyBackground,
} from './ClosingScene/ClosingBackgrounds'
import { FutureEducationLine } from './ClosingScene/FutureEducationLine'
import { AlreadyHereLine } from './ClosingScene/AlreadyHereLine'
import { ClosingBrandLockup } from './ClosingScene/ClosingBrandLockup'
import { ClosingFinale } from './ClosingScene/ClosingFinale'

export { SCENE10_DURATION } from './ClosingScene/constants'

const CROSS = 6

export const Scene10_Closing: React.FC = () => {
  const frame = useCurrentFrame()
  const fontFamily = theme.font.display
  const master = sceneMaster(frame, SCENE10_DURATION)

  const line2In = interpolate(frame, [P2_START, P2_START + CROSS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const lockupIn = interpolate(frame, [P3_START, P3_START + CROSS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const finaleIn =
    frame >= P4_START
      ? interpolate(frame, [P4_START, P4_START + CROSS], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: master }}>
        {frame < P2_START + CROSS && (
          <AbsoluteFill>
            <ClosingSkyBackground />
            {frame < P2_START && <FutureEducationLine fontFamily={fontFamily} />}
          </AbsoluteFill>
        )}

        {frame >= P2_START && frame < P3_START && (
          <AbsoluteFill style={{ opacity: line2In }}>
            <ClosingLightBackground />
            <AlreadyHereLine fontFamily={fontFamily} />
          </AbsoluteFill>
        )}

        {frame >= P3_START && frame < P4_START && (
          <AbsoluteFill style={{ opacity: lockupIn }}>
            <ClosingLightBackground />
            <ClosingBrandLockup fontFamily={fontFamily} />
          </AbsoluteFill>
        )}

        {finaleIn > 0 && (
          <AbsoluteFill style={{ opacity: finaleIn }}>
            <ClosingBlackBackground />
            <ClosingFinale fontFamily={fontFamily} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

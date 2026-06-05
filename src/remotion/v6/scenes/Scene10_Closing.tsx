/**
 * Scene 10 — Closing (tight handoffs between beats)
 */
import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'
import {
  SCENE10_DURATION,
  FLIP_START,
  P2_START,
  P3_START,
  P4_START,
} from './ClosingScene/constants'
import {
  ClosingBlackBackground,
  ClosingLightBackground,
  ClosingSkyBackground,
} from './ClosingScene/ClosingBackgrounds'
import { ClosingCardFlip } from './ClosingScene/ClosingCardFlip'
import { FutureEducationLine } from './ClosingScene/FutureEducationLine'
import { AlreadyHereLine } from './ClosingScene/AlreadyHereLine'
import { ClosingBrandLockup } from './ClosingScene/ClosingBrandLockup'
import { ClosingFinale } from './ClosingScene/ClosingFinale'

export { SCENE10_DURATION } from './ClosingScene/constants'

const CROSS = 3

export const Scene10_Closing: React.FC = () => {
  const frame = useCurrentFrame()
  const fontFamily = theme.font.display
  const master = sceneMaster(frame, SCENE10_DURATION)

  const flipProgress =
    frame >= FLIP_START && frame < P2_START
      ? (frame - FLIP_START) / (P2_START - FLIP_START)
      : 0

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
        {frame < FLIP_START && (
          <AbsoluteFill>
            <ClosingSkyBackground />
            <FutureEducationLine fontFamily={fontFamily} />
          </AbsoluteFill>
        )}

        {frame >= FLIP_START && frame < P2_START && (
          <ClosingCardFlip
            progress={flipProgress}
            exiting={
              <AbsoluteFill>
                <ClosingSkyBackground />
                <FutureEducationLine fontFamily={fontFamily} />
              </AbsoluteFill>
            }
            entering={
              <AbsoluteFill>
                <ClosingLightBackground />
              </AbsoluteFill>
            }
          />
        )}

        {frame >= P2_START && frame < P3_START && (
          <AbsoluteFill>
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

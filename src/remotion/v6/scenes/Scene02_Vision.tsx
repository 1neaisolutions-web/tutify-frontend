/**
 * Scene 04 — The Vision (local 0–210 f · 7 s)
 *
 * "But technology was never meant to replace educators."
 *   → words drop top-to-bottom, one by one
 * "It was meant to empower them."
 *   → word-by-word typing with cursor
 */
import React from 'react'
import { AbsoluteFill, interpolate, spring } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'

import { loadFont } from '@remotion/google-fonts/Inter'
import { VisionBackground } from './VisionScene/VisionBackground'
import {
  VisionCopy,
  VISION_LINE1_WIPE_START,
  VISION_LINE2_DONE,
  VISION_LINE2_START,
  VISION_SCENE_DURATION,
} from './VisionScene/VisionCopy'
import { VisionRadialWipeEdge, visionRadialWipeActive } from './VisionScene/VisionRadialWipe'
import { theme } from '../theme'
import { visionSceneEnter } from '../slides/teachersOverwhelmed/visionHandoff'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})

import { SCENE02_DURATION as SCENE02_TARGET } from '../timeline/sceneDurations'
export const SCENE02_DURATION = Math.max(VISION_SCENE_DURATION, SCENE02_TARGET)

const VALUE_PILLS = [
  { text: 'Save hours every week', color: theme.colors.accent, delay: 0 },
  { text: 'Better student outcomes', color: theme.colors.secondary, delay: 0 },
  { text: 'Human-centered AI', color: theme.colors.primary, delay: 0 },
]

export const Scene02_Vision: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const enter = visionSceneEnter(frame)
  const fadeOut = interpolate(frame, [SCENE02_DURATION - 16, SCENE02_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fgAlpha = enter.opacity * fadeOut
  const enterTransform = `translateY(${enter.translateY}px) scale(${enter.scale})`
  const enterFilter = enter.blur > 0.3 ? `blur(${enter.blur}px)` : undefined

  const pillsBase = VISION_LINE2_DONE + 8
  const pills = VALUE_PILLS.map((pill, i) => ({
    ...pill,
    delay: pillsBase + i * 8,
  }))

  const chipP = spring({ frame: Math.max(0, frame - 10), fps, config: theme.spring.gentle })
  const chipOp = interpolate(chipP, [0, 1], [0, 1]) * fgAlpha

  const line1WipeActive = visionRadialWipeActive(
    frame,
    VISION_LINE1_WIPE_START,
    VISION_LINE2_START,
  )
  const wipeKickFlash = interpolate(
    frame,
    [VISION_LINE1_WIPE_START, VISION_LINE1_WIPE_START + 3],
    [0, 0.38],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <VisionBackground />
      <AbsoluteFill
        style={{
          opacity: fgAlpha,
          transform: enterTransform,
          filter: enterFilter,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 58,
            opacity: chipOp,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(91,79,207,0.08)',
              border: '1.5px solid rgba(91,79,207,0.22)',
              borderRadius: 40,
              padding: '6px 16px 6px 12px',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: theme.colors.primary,
                boxShadow: `0 0 9px ${theme.colors.primaryGlow}`,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: theme.colors.primary,
                fontFamily: interFont,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              The Turning Point
            </span>
          </div>
        </div>

        <VisionCopy fontFamily={interFont} fadeOut={fadeOut} />

        {line1WipeActive ? (
          <>
            {wipeKickFlash > 0.02 ? (
              <AbsoluteFill
                style={{
                  zIndex: 55,
                  pointerEvents: 'none',
                  background: `rgba(255,255,255,${wipeKickFlash * fgAlpha})`,
                }}
              />
            ) : null}
            <VisionRadialWipeEdge
              frame={frame}
              wipeStart={VISION_LINE1_WIPE_START}
              holdUntilFrame={VISION_LINE2_START}
            />
          </>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 118,
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          {pills.map((pill, i) => {
            const pillP = spring({
              frame: Math.max(0, frame - pill.delay),
              fps,
              config: theme.spring.snappy,
            })
            const pillOp = interpolate(pillP, [0, 1], [0, 1]) * fadeOut
            const pillSc = interpolate(pillP, [0, 1], [0.78, 1])
            return (
              <div
                key={i}
                style={{
                  opacity: pillOp,
                  transform: `scale(${pillSc})`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: `1.5px solid ${pill.color}30`,
                  borderRadius: 40,
                  padding: '10px 22px',
                  boxShadow: `0 4px 20px ${pill.color}1A`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: pill.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: theme.colors.textMuted,
                    fontFamily: interFont,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pill.text}
                </span>
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

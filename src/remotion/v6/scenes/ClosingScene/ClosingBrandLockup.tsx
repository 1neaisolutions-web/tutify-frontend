/**
 * Logo floats in, then joins “Tutify” wordmark (Numera-style lockup).
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img } from 'remotion'
import { LOGO_SRC } from '../../assets'
import { P3_START } from './constants'

const FLOAT_END = 26
const JOIN_START = 28
const LOGO_SIZE_FLOAT = 168
const LOGO_SIZE_LOCK = 112
const LOCKUP_GAP = 22
const LOGO_SPRING = { damping: 175, stiffness: 100, mass: 0.9 }
const TEXT_SPRING = { damping: 220, stiffness: 72, mass: 0.95 }

const smooth = (p: number) =>
  interpolate(p, [0, 0.38, 1], [0, 0.48, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

type Props = { fontFamily: string }

export const ClosingBrandLockup: React.FC<Props> = ({ fontFamily }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const local = frame - P3_START

  if (local < 0) return null

  const holdOpacity = interpolate(local, [0, 8, 78, 88], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const floatY = local < FLOAT_END ? Math.sin(local * 0.14) * 14 : 0
  const floatScale = local < FLOAT_END ? 1 + Math.sin(local * 0.1) * 0.025 : 1

  const joinRaw =
    local >= JOIN_START
      ? spring({ frame: local - JOIN_START, fps, config: LOGO_SPRING })
      : 0
  const joinP = smooth(joinRaw)

  const logoScale = interpolate(joinP, [0, 1], [LOGO_SIZE_FLOAT / LOGO_SIZE_LOCK, 1], {
    extrapolateRight: 'clamp',
  })
  const logoX = interpolate(joinP, [0, 1], [0, 0], { extrapolateRight: 'clamp' })

  const textRaw =
    local >= JOIN_START + 8
      ? spring({ frame: local - JOIN_START - 8, fps, config: TEXT_SPRING })
      : 0
  const textP = smooth(textRaw)
  const textX = interpolate(textP, [0, 1], [90, 0], { extrapolateRight: 'clamp' })
  const textBlur = interpolate(textP, [0, 1], [14, 0], { extrapolateRight: 'clamp' })

  const showLockup = local >= JOIN_START
  const logoOnly = !showLockup

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: holdOpacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: showLockup ? LOCKUP_GAP : 0,
          transform: `translateY(${floatY}px)`,
        }}
      >
        <div
          style={{
            width: LOGO_SIZE_LOCK,
            height: LOGO_SIZE_LOCK,
            flexShrink: 0,
            borderRadius: 28,
            overflow: 'hidden',
            transform: `scale(${(logoOnly ? LOGO_SIZE_FLOAT / LOGO_SIZE_LOCK : logoScale) * floatScale}) translateX(${logoX}px)`,
            transformOrigin: 'center center',
            boxShadow:
              '0 20px 56px rgba(37, 99, 235, 0.32), 0 6px 18px rgba(0,0,0,0.12)',
            opacity: interpolate(local, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <Img src={LOGO_SRC} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {showLockup && (
          <span
            style={{
              fontFamily,
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#2563EB',
              opacity: textP,
              transform: `translateX(${textX}px)`,
              filter: textBlur > 0.4 ? `blur(${textBlur}px)` : undefined,
            }}
          >
            Tutify
          </span>
        )}
      </div>
    </div>
  )
}

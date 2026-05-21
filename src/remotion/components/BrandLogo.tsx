import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { theme } from '../theme'

interface BrandLogoProps {
  variant?: 'static' | 'assemble' | 'glow'
  scale?: number
  color?: string
  tagline?: boolean
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'static',
  scale = 1,
  color = theme.colors.navy,
  tagline = false,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const word = 'Tutify'
  const letters = word.split('')

  if (variant === 'static') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <LogoMark color={color} scale={scale} />
        {tagline && (
          <div style={{
            fontFamily: theme.fonts.body,
            fontSize: 18 * scale,
            color: theme.colors.skyBlue,
            letterSpacing: 2,
            fontWeight: 500,
            opacity: 0.85,
          }}>
            Education, reimagined.
          </div>
        )}
      </div>
    )
  }

  if (variant === 'assemble') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {letters.map((letter, i) => {
            const letterProgress = spring({
              frame: frame - i * 5,
              fps,
              config: theme.spring.bouncy,
            })
            const opacity = interpolate(frame - i * 5, [0, 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            const translateY = interpolate(letterProgress, [0, 1], [50, 0])
            const letterScale = interpolate(letterProgress, [0, 1], [0.5, 1])

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity,
                  transform: `translateY(${translateY}px) scale(${letterScale})`,
                  fontFamily: theme.fonts.headline,
                  fontSize: 120 * scale,
                  fontWeight: 800,
                  color,
                  lineHeight: 1,
                  letterSpacing: -2 * scale,
                }}
              >
                {letter}
              </span>
            )
          })}
        </div>

        {/* Underline sweeps in */}
        {(() => {
          const lineProgress = interpolate(frame, [150, 180], [0, 1], {
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <div style={{
              width: `${lineProgress * 100}%`,
              maxWidth: 400 * scale,
              height: 4 * scale,
              background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
              borderRadius: 2,
              marginTop: -8,
            }} />
          )
        })()}

        {tagline && (() => {
          const tagOpacity = interpolate(frame, [180, 220], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const tagY = interpolate(frame, [180, 220], [20, 0], {
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <div style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              fontFamily: theme.fonts.body,
              fontSize: 22 * scale,
              color: theme.colors.textDark,
              letterSpacing: 1.5,
              fontWeight: 400,
              marginTop: 8,
            }}>
              Education, reimagined.
            </div>
          )
        })()}
      </div>
    )
  }

  // glow variant — static logo with pulse
  const pulse = Math.sin(frame * 0.05) * 0.15 + 1
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      filter: `drop-shadow(0 0 ${20 * pulse}px ${theme.colors.skyBlue}) drop-shadow(0 0 ${40 * pulse}px rgba(59,158,255,0.3))`,
    }}>
      <div style={{
        fontFamily: theme.fonts.headline,
        fontSize: 100 * scale,
        fontWeight: 800,
        color: theme.colors.white,
        letterSpacing: -2 * scale,
        lineHeight: 1,
      }}>
        Tutify
      </div>
      <div style={{
        width: 300 * scale,
        height: 3,
        background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
        borderRadius: 2,
      }} />
      {tagline && (
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 18 * scale,
          color: theme.colors.skyBlue,
          letterSpacing: 2,
          fontWeight: 500,
        }}>
          Education, reimagined.
        </div>
      )}
    </div>
  )
}

const LogoMark: React.FC<{ color: string; scale: number }> = ({ color, scale }) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <span style={{
      fontFamily: theme.fonts.headline,
      fontSize: 80 * scale,
      fontWeight: 800,
      color,
      letterSpacing: -2 * scale,
      lineHeight: 1,
    }}>
      Tutify
    </span>
  </div>
)

/**
 * SectionChip — Premium animated section label used across all V5 scenes.
 * Dark variant: white text on translucent dark. Light variant: brand color on soft tint.
 */
import React from 'react'
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'
import { theme } from '../theme'

interface SectionChipProps {
  label: string
  startFrame?: number
  variant?: 'light' | 'dark'
  color?: string
}

export const SectionChip: React.FC<SectionChipProps> = ({
  label,
  startFrame = 0,
  variant = 'light',
  color,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)
  const p = spring({ frame: f, fps, config: theme.spring.snappy })
  const op = interpolate(p, [0, 1], [0, 1])
  const tx = interpolate(p, [0, 1], [-18, 0])

  const dotColor = color ?? (variant === 'dark' ? '#FFFFFF' : theme.colors.primary)
  const textColor = color ?? (variant === 'dark' ? 'rgba(255,255,255,0.85)' : theme.colors.primary)
  const bg = variant === 'dark'
    ? 'rgba(255,255,255,0.09)'
    : 'rgba(79,110,247,0.08)'
  const border = variant === 'dark'
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(79,110,247,0.22)'
  const dotGlow = variant === 'dark'
    ? 'rgba(79,110,247,0.9)'
    : theme.colors.primaryGlow

  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${tx}px)`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: 40,
        padding: '7px 18px 7px 13px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: `0 0 10px ${dotGlow}`,
          animation: 'none',
          opacity: 0.9 + Math.sin(frame * 0.2) * 0.1,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: textColor,
          fontFamily: theme.font.display,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  )
}

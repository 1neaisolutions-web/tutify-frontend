import React from 'react'
import { theme } from '../theme'

interface SoftCardProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  width?: number | string
  height?: number | string
  padding?: number
  borderRadius?: number
  accentColor?: string
  accentPosition?: 'top' | 'left'
  shadow?: 'card' | 'lifted' | 'soft' | 'none'
}

export const SoftCard: React.FC<SoftCardProps> = ({
  children,
  style,
  width,
  height,
  padding = 32,
  borderRadius = 20,
  accentColor,
  accentPosition = 'top',
  shadow = 'card',
}) => {
  const shadowValue =
    shadow === 'none' ? 'none' : theme.shadows[shadow]

  const accentStyle: React.CSSProperties = accentColor
    ? accentPosition === 'top'
      ? { borderTop: `3px solid ${accentColor}` }
      : { borderLeft: `4px solid ${accentColor}` }
    : {}

  return (
    <div
      style={{
        width,
        height,
        background: theme.colors.surface,
        borderRadius,
        padding,
        boxShadow: shadowValue,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...accentStyle,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

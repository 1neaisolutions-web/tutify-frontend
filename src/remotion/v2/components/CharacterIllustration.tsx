import React from 'react'
import { theme } from '../theme'

export type CharacterType = 'teacher' | 'student' | 'parent' | 'admin'

interface CharacterIllustrationProps {
  type: CharacterType
  size?: number
  style?: React.CSSProperties
}

export const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  type,
  size = 200,
  style,
}) => {
  const configs: Record<CharacterType, { color: string; bg: string; Icon: React.FC<{ size: number; color: string }> }> = {
    teacher: { color: theme.colors.mint,     bg: theme.colors.mintPastel,     Icon: TeacherIcon },
    student: { color: theme.colors.skyBlue,  bg: theme.colors.skyPastel,      Icon: StudentIcon },
    parent:  { color: theme.colors.coral,    bg: theme.colors.coralPastel,    Icon: ParentIcon },
    admin:   { color: theme.colors.lavender, bg: theme.colors.lavenderPastel, Icon: AdminIcon },
  }

  const { color, bg, Icon } = configs[type]

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon size={size * 0.62} color={color} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Character SVG illustrations — friendly flat style
// ─────────────────────────────────────────────

const TeacherIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    {/* Head */}
    <circle cx="40" cy="22" r="13" fill={color} opacity="0.9" />
    {/* Body */}
    <path d="M20 70 Q20 46 40 46 Q60 46 60 70Z" fill={color} opacity="0.85" />
    {/* Collar / teacher detail */}
    <path d="M33 46 L40 56 L47 46" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Book */}
    <rect x="10" y="52" width="18" height="14" rx="2" fill="white" opacity="0.7" />
    <line x1="19" y1="52" x2="19" y2="66" stroke={color} strokeWidth="1.5" opacity="0.5" />
    {/* Star / highlight */}
    <circle cx="56" cy="28" r="4" fill="white" opacity="0.5" />
  </svg>
)

const StudentIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    {/* Head */}
    <circle cx="40" cy="22" r="13" fill={color} opacity="0.9" />
    {/* Graduation cap */}
    <rect x="27" y="11" width="26" height="4" rx="2" fill="white" opacity="0.8" />
    <polygon points="40,6 52,12 40,16 28,12" fill="white" opacity="0.7" />
    <line x1="52" y1="12" x2="52" y2="20" stroke="white" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
    {/* Body */}
    <path d="M22 70 Q22 46 40 46 Q58 46 58 70Z" fill={color} opacity="0.85" />
    {/* Backpack */}
    <rect x="54" y="48" width="10" height="14" rx="3" fill="white" opacity="0.5" />
  </svg>
)

const ParentIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    {/* Head */}
    <circle cx="40" cy="20" r="13" fill={color} opacity="0.9" />
    {/* Body */}
    <path d="M18 72 Q18 44 40 44 Q62 44 62 72Z" fill={color} opacity="0.85" />
    {/* Phone */}
    <rect x="46" y="52" width="10" height="16" rx="2.5" fill="white" opacity="0.65" />
    <rect x="48" y="55" width="6" height="9" rx="1" fill={color} opacity="0.3" />
    {/* Heart */}
    <path
      d="M30 52 Q30 48 34 48 Q37 48 37 51 Q37 48 40 48 Q44 48 44 52 Q44 56 37 61 Q30 56 30 52Z"
      fill="white"
      opacity="0.7"
    />
  </svg>
)

const AdminIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    {/* Head */}
    <circle cx="40" cy="22" r="13" fill={color} opacity="0.9" />
    {/* Body — suit */}
    <path d="M20 72 Q20 46 40 46 Q60 46 60 72Z" fill={color} opacity="0.85" />
    {/* Tie */}
    <path d="M38 46 L40 58 L42 46" fill="white" opacity="0.6" />
    {/* Clipboard */}
    <rect x="8" y="48" width="16" height="20" rx="2" fill="white" opacity="0.65" />
    <rect x="13" y="45" width="6" height="5" rx="1" fill={color} opacity="0.6" />
    {[53, 58, 63].map((y) => (
      <line key={y} x1="11" y1={y} x2="21" y2={y} stroke={color} strokeWidth="1.2" opacity="0.4" />
    ))}
    {/* Shield / authority badge */}
    <path d="M56 28 Q56 22 60 20 Q64 22 64 28 Q64 34 60 36 Q56 34 56 28Z" fill="white" opacity="0.5" />
  </svg>
)

import React from 'react'
import { AbsoluteFill, Video, staticFile, useCurrentFrame, interpolate } from 'remotion'
import { ParticleField } from './ParticleField'
import { theme } from '../theme'

interface VeoPlaceholderProps {
  src: string
  fallbackText?: string
  fallbackVariant?: 'teacher' | 'students' | 'principal' | 'classroom' | 'vision' | 'default'
  overlayColor?: string
  overlayOpacity?: number
}

export const VeoPlaceholder: React.FC<VeoPlaceholderProps> = ({
  src,
  fallbackText,
  fallbackVariant = 'default',
  overlayColor = theme.colors.navy,
  overlayOpacity = 0.55,
}) => {
  const frame = useCurrentFrame()

  // Ken Burns: slow push-in
  const kbScale = interpolate(frame, [0, 252], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fallbacks: Record<string, React.ReactNode> = {
    teacher:   <TeacherFallback frame={frame} />,
    students:  <StudentsFallback frame={frame} />,
    principal: <PrincipalFallback frame={frame} />,
    classroom: <ClassroomFallback frame={frame} />,
    vision:    <VisionFallback frame={frame} />,
    default:   <DefaultFallback text={fallbackText ?? 'Veo Clip'} frame={frame} />,
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Ken Burns wrapper */}
      <div style={{ width: '100%', height: '100%', transform: `scale(${kbScale})`, transformOrigin: 'center center' }}>
        {fallbacks[fallbackVariant]}
      </div>

      {/* Cinematic overlay */}
      <AbsoluteFill style={{ background: `${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}`, mixBlendMode: 'multiply' }} />

      {/* Vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }} />

      {/* VEO CLIP PLACEHOLDER badge */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        right: 40,
        background: 'rgba(59,158,255,0.25)',
        border: '1px solid rgba(59,158,255,0.5)',
        borderRadius: 8,
        padding: '6px 14px',
        fontFamily: theme.fonts.body,
        fontSize: 13,
        color: theme.colors.skyBlue,
        letterSpacing: 1.5,
        fontWeight: 600,
        backdropFilter: 'blur(8px)',
      }}>
        VEO CLIP · {src.split('/').pop()}
      </div>
    </AbsoluteFill>
  )
}

/* ─────────────────────────── Fallback Scenes ─────────────────────────── */

const TeacherFallback: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: 'linear-gradient(160deg, #1a0a00 0%, #2d1200 30%, #0B1F3A 100%)' }}>
    <ParticleField density={30} color="#FFB347" speed={0.3} />
    {/* Desk silhouette */}
    <svg width="1920" height="1080" style={{ position: 'absolute', bottom: 0 }}>
      {/* Warm desk lamp glow */}
      <radialGradient id="lampGlow" cx="60%" cy="45%" r="20%">
        <stop offset="0%" stopColor="#FFD580" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFD580" stopOpacity="0" />
      </radialGradient>
      <rect x="0" y="0" width="1920" height="1080" fill="url(#lampGlow)" />
      {/* Desk */}
      <rect x="800" y="700" width="700" height="20" rx="4" fill="#1a0800" opacity="0.9" />
      {/* Paper pile silhouette */}
      <rect x="950" y="640" width="180" height="65" rx="3" fill="#0d0500" opacity="0.85" />
      <rect x="970" y="625" width="160" height="20" rx="2" fill="#0d0500" opacity="0.7" />
      {/* Teacher silhouette */}
      <ellipse cx="1050" cy="580" rx="55" ry="55" fill="#060a0f" opacity="0.95" />
      <rect x="980" y="620" width="140" height="100" rx="8" fill="#060a0f" opacity="0.95" />
    </svg>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,9,15,0.8) 0%, transparent 60%)' }} />
  </AbsoluteFill>
)

const StudentsFallback: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0B1F3A 0%, #112845 60%, #0a1520 100%)' }}>
    <ParticleField density={40} color={theme.colors.skyBlue} speed={0.2} />
    <svg width="1920" height="1080" style={{ position: 'absolute' }}>
      {/* Classroom windows — blue-grey light */}
      <rect x="200" y="100" width="300" height="500" rx="4" fill="#1a2d4a" opacity="0.6" />
      <rect x="600" y="100" width="300" height="500" rx="4" fill="#1a2d4a" opacity="0.6" />
      {/* Student silhouettes */}
      {[300, 560, 820, 1080, 1340, 1600].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={780} rx={38} ry={38} fill="#060a0f" opacity={0.9} />
          <rect x={x - 45} y={808} width={90} height={80} rx={6} fill="#060a0f" opacity={0.9} />
        </g>
      ))}
      {/* Desks */}
      <rect x="100" y="840" width="1720" height="12" rx="4" fill="#0d151f" opacity="0.8" />
    </svg>
  </AbsoluteFill>
)

const PrincipalFallback: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, #060a0f 0%, #0B1F3A 100%)' }}>
    <ParticleField density={20} color={theme.colors.teal} speed={0.2} />
    <svg width="1920" height="1080" style={{ position: 'absolute' }}>
      {/* Monitor glow */}
      <radialGradient id="monGlow" cx="50%" cy="40%" r="30%">
        <stop offset="0%" stopColor={theme.colors.teal} stopOpacity="0.2" />
        <stop offset="100%" stopColor={theme.colors.teal} stopOpacity="0" />
      </radialGradient>
      <rect x="0" y="0" width="1920" height="1080" fill="url(#monGlow)" />
      {/* Monitor screens */}
      {[500, 850, 1200].map((x, i) => (
        <rect key={i} x={x} y={250} width={360} height={240} rx={8} fill="#0d1f30" stroke={theme.colors.teal} strokeOpacity={0.3} strokeWidth={1} />
      ))}
      {/* Principal silhouette */}
      <ellipse cx={960} cy={550} rx={52} ry={52} fill="#040810" />
      <rect x={890} y={595} width={140} height={120} rx={8} fill="#040810" />
    </svg>
  </AbsoluteFill>
)

const ClassroomFallback: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, #e8f4ff 0%, #c5dff5 100%)' }}>
    <svg width="1920" height="1080" style={{ position: 'absolute' }}>
      {/* Bright window light */}
      <radialGradient id="sunGlow" cx="30%" cy="20%" r="40%">
        <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFF9E6" stopOpacity="0" />
      </radialGradient>
      <rect x="0" y="0" width="1920" height="1080" fill="url(#sunGlow)" />
      {/* Whiteboard */}
      <rect x="400" y="80" width="1120" height="400" rx="8" fill="white" opacity="0.9" stroke="#ddd" strokeWidth="2" />
      {/* Students at desks — engaged */}
      {[350, 650, 950, 1250, 1550].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={760} rx={42} ry={42} fill="#1a3050" opacity={0.8} />
          <rect x={x - 55} y={800} width={110} height={90} rx={6} fill="#1a3050" opacity={0.8} />
        </g>
      ))}
    </svg>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(11,31,58,0.4) 100%)' }} />
  </AbsoluteFill>
)

const VisionFallback: React.FC<{ frame: number }> = ({ frame }) => {
  const starCount = 120
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #020810 0%, #0B1F3A 60%, #112845 100%)' }}>
      <svg width="1920" height="1080" style={{ position: 'absolute' }}>
        {/* Stars */}
        {Array.from({ length: starCount }, (_, i) => {
          const x = (Math.sin(i * 7.3) * 0.5 + 0.5) * 1920
          const y = (Math.sin(i * 3.7) * 0.5 + 0.5) * 700
          const r = (Math.sin(i * 5.1) * 0.5 + 0.5) * 2.5 + 0.5
          const twinkle = Math.sin(frame * 0.03 + i * 0.8) * 0.3 + 0.7
          return <circle key={i} cx={x} cy={y} r={r} fill={theme.colors.white} opacity={0.6 * twinkle} />
        })}
        {/* Aurora */}
        <defs>
          <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors.teal} stopOpacity="0.12" />
            <stop offset="50%" stopColor={theme.colors.skyBlue} stopOpacity="0.18" />
            <stop offset="100%" stopColor={theme.colors.teal} stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <path d={`M 0 400 Q 480 ${350 + Math.sin(frame * 0.02) * 30} 960 380 Q 1440 ${410 + Math.sin(frame * 0.018 + 1) * 25} 1920 370 L 1920 500 Q 1440 520 960 510 Q 480 500 0 520 Z`} fill="url(#aurora)" />
        {/* Silhouettes */}
        <ellipse cx={600} cy={980} rx={55} ry={55} fill="#020508" />
        <rect x={535} y={1020} width={130} height={160} rx={8} fill="#020508" />
        <ellipse cx={1320} cy={960} rx={48} ry={48} fill="#020508" />
        <rect x={1265} y={1000} width={110} height={180} rx={8} fill="#020508" />
      </svg>
    </AbsoluteFill>
  )
}

const DefaultFallback: React.FC<{ text: string; frame: number }> = ({ text, frame }) => (
  <AbsoluteFill style={{ background: theme.colors.navyDeep, alignItems: 'center', justifyContent: 'center' }}>
    <ParticleField density={40} />
    <div style={{
      fontFamily: theme.fonts.body,
      fontSize: 28,
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: 2,
      textTransform: 'uppercase',
    }}>
      {text}
    </div>
  </AbsoluteFill>
)

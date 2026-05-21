// Scene 14 — Image Studio (frames 3276–3528)
// "Students learn better when they see, not just read.
//  Image Studio generates beautiful classroom visuals from a single prompt."
// NOTE: PixGen is renamed to Image Studio
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const ILLUSTRATIONS = [
  { label: 'Solar System',     icon: <SolarSystem />,  x: -320, y: -160, delay:  20 },
  { label: 'Molecule',         icon: <Molecule />,      x:  320, y: -160, delay:  35 },
  { label: 'Heart Anatomy',    icon: <HeartIcon />,     x: -380, y:   60, delay:  50 },
  { label: 'Geometry',         icon: <GeometryIcon />,  x:  380, y:   60, delay:  65 },
  { label: 'Photosynthesis',   icon: <PhotosynthIcon />, x: -300, y:  200, delay:  80 },
  { label: 'Historical Scene', icon: <HistoryIcon />,   x:  300, y:  200, delay:  95 },
]

export const Scene14ImageStudio: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Central canvas entrance
  const canvasSpring = spring({ frame: frame - 10, fps, config: theme.spring.gentle })
  const canvasScale = interpolate(canvasSpring, [0, 1], [0.7, 1])
  const canvasOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Label
  const labelOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <ParticleField density={30} color={theme.colors.teal} speed={0.35} />

      {/* Floating illustration orbs */}
      {ILLUSTRATIONS.map((illus, i) => {
        const illSpring = spring({ frame: frame - illus.delay, fps, config: theme.spring.bouncy })
        const illScale = interpolate(illSpring, [0, 1], [0, 1])
        const illOpacity = interpolate(frame, [illus.delay, illus.delay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        const floatY = Math.sin(frame * 0.025 + i * 1.1) * 8

        return (
          <div key={i} style={{
            position: 'absolute',
            left: 960 + illus.x - 64,
            top: 540 + illus.y - 64,
            opacity: illOpacity,
            transform: `scale(${illScale}) translateY(${floatY}px)`,
            transformOrigin: 'center center',
          }}>
            <GlassCard width={128} height={128} glowColor={theme.colors.teal} glowIntensity={0.45} borderRadius={20}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
                {illus.icon}
                <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: 'rgba(245,249,255,0.65)', textAlign: 'center', letterSpacing: 0.3 }}>
                  {illus.label}
                </div>
              </div>
            </GlassCard>
          </div>
        )
      })}

      {/* Central creative canvas */}
      <div style={{
        transform: `scale(${canvasScale})`,
        opacity: canvasOpacity,
        zIndex: 1,
      }}>
        <GlassCard width={380} height={240} glowColor={theme.colors.teal} glowIntensity={0.8} borderRadius={24}>
          <div style={{ padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${theme.colors.teal}40, ${theme.colors.skyBlue}30)`,
                border: `1px solid ${theme.colors.teal}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke={theme.colors.teal} strokeWidth="1.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill={theme.colors.teal} />
                  <path d="M21 15l-5-5L5 21" stroke={theme.colors.teal} strokeWidth="1.5" />
                </svg>
              </div>
              <div style={{ fontFamily: theme.fonts.headline, fontSize: 18, fontWeight: 700, color: theme.colors.white }}>
                Image Studio
              </div>
              <div style={{
                marginLeft: 'auto',
                background: `${theme.colors.teal}18`,
                border: `1px solid ${theme.colors.teal}40`,
                borderRadius: 6,
                padding: '2px 10px',
                fontFamily: theme.fonts.body,
                fontSize: 11,
                color: theme.colors.teal,
                fontWeight: 600,
                letterSpacing: 1,
              }}>
                AI
              </div>
            </div>

            {/* Prompt area */}
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${theme.colors.teal}30`,
              borderRadius: 10,
              padding: '10px 14px',
              fontFamily: theme.fonts.body,
              fontSize: 14,
              color: 'rgba(245,249,255,0.75)',
              lineHeight: 1.5,
              marginBottom: 14,
            }}>
              "Diagram of the human digestive system with labels"
              <span style={{
                display: 'inline-block',
                width: 2, height: '1em',
                background: theme.colors.teal,
                marginLeft: 2,
                verticalAlign: 'middle',
                opacity: Math.sin(frame * 0.18) > 0 ? 1 : 0,
              }} />
            </div>

            {/* Generate */}
            <div style={{
              background: `linear-gradient(90deg, ${theme.colors.teal}, ${theme.colors.skyBlue})`,
              borderRadius: 10,
              padding: '10px',
              textAlign: 'center',
              fontFamily: theme.fonts.body,
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              boxShadow: `0 0 ${20 * (Math.sin(frame * 0.08) * 0.2 + 0.9)}px ${theme.colors.teal}60`,
            }}>
              Generate Visual →
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 28,
        fontWeight: 700,
        color: theme.colors.white,
      }}>
        Image Studio ·{' '}
        <span style={{ color: theme.colors.teal }}>Visuals That Teach</span>
      </div>
    </AbsoluteFill>
  )
}

// Illustration SVG components
function SolarSystem() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="8" fill="#FFD700" opacity="0.9" />
      <ellipse cx="30" cy="30" rx="20" ry="7" stroke={theme.colors.skyBlue} strokeWidth="1" fill="none" />
      <circle cx="50" cy="30" r="3" fill={theme.colors.skyBlue} />
      <ellipse cx="30" cy="30" rx="26" ry="10" stroke={theme.colors.teal} strokeWidth="0.8" fill="none" opacity="0.6" />
      <circle cx="56" cy="30" r="2" fill={theme.colors.teal} />
    </svg>
  )
}

function Molecule() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="10" fill={theme.colors.skyBlue} opacity="0.8" />
      <circle cx="12" cy="18" r="7" fill={theme.colors.teal} opacity="0.8" />
      <circle cx="48" cy="18" r="7" fill="white" opacity="0.5" />
      <circle cx="12" cy="42" r="7" fill="white" opacity="0.5" />
      <circle cx="48" cy="42" r="7" fill={theme.colors.teal} opacity="0.8" />
      <line x1="19" y1="22" x2="24" y2="26" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="41" y1="22" x2="36" y2="26" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="19" y1="38" x2="24" y2="34" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="41" y1="38" x2="36" y2="34" stroke="white" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M30 50 C20 40 5 30 5 20 C5 12 11 8 18 10 C22 11 26 15 30 20 C34 15 38 11 42 10 C49 8 55 12 55 20 C55 30 40 40 30 50Z" fill="#FF6B6B" opacity="0.8" />
      <line x1="20" y1="28" x2="40" y2="28" stroke="white" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="18" x2="30" y2="38" stroke="white" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function GeometryIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <polygon points="30,5 55,50 5,50" stroke={theme.colors.skyBlue} strokeWidth="1.5" fill="none" />
      <circle cx="30" cy="30" r="14" stroke={theme.colors.teal} strokeWidth="1.5" fill="none" />
      <line x1="5" y1="50" x2="55" y2="50" stroke="#FFB347" strokeWidth="1.5" />
      <line x1="30" y1="5" x2="30" y2="50" stroke="#B47FFF" strokeWidth="1" opacity="0.5" strokeDasharray="3 4" />
    </svg>
  )
}

function PhotosynthIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="10" cy="10" r="7" fill="#FFD700" opacity="0.8" />
      <path d="M18 14 L30 28" stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="36" cy="34" rx="14" ry="10" fill="#4ECB71" opacity="0.5" stroke="#4ECB71" strokeWidth="1" />
      <path d="M36 24 L36 55" stroke="#6B3A0A" strokeWidth="2" />
      <text x="8" y="58" fontSize="8" fill={theme.colors.teal} fontFamily="monospace">CO₂+H₂O→O₂</text>
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <rect x="5" y="25" width="50" height="30" rx="2" fill="#8B4513" opacity="0.5" />
      <polygon points="5,25 30,5 55,25" fill="#CD853F" opacity="0.7" />
      <rect x="22" y="35" width="16" height="20" rx="2" fill="#4A2C0A" opacity="0.8" />
      <rect x="12" y="30" width="10" height="10" rx="1" fill="#FFD700" opacity="0.4" />
      <rect x="38" y="30" width="10" height="10" rx="1" fill="#FFD700" opacity="0.4" />
    </svg>
  )
}

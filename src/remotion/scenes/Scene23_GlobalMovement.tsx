// Scene 23 — Global Movement (frames 5544–5796)
// "Educators, schools, and entire districts are joining the movement.
//  The future of learning is being written — right now."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { theme } from '../theme'

// City coordinates as approximate [0-1920, 0-1080] positions
const CITIES = [
  [300, 320], [380, 280], [200, 380], [460, 300], [320, 420], [250, 460],
  [920, 200], [980, 230], [860, 260], [1020, 185], [940, 290],
  [1060, 340], [1120, 370], [1040, 410], [1100, 310],
  [1260, 280], [1340, 300], [1320, 240], [1400, 310], [1280, 360],
  [960, 430], [1000, 460], [920, 490], [1040, 500],
  [820, 550], [880, 590], [760, 580], [820, 620],
  [480, 540], [550, 580], [420, 600], [500, 620],
  [1500, 480], [1560, 510], [1580, 450], [1520, 560],
  [680, 200], [720, 230], [660, 260],
  [1160, 220], [1200, 195], [1180, 260],
  [380, 200], [440, 220], [350, 250],
  [1700, 350], [1740, 380], [1680, 400],
  [960, 640], [1000, 660], [1040, 630],
  [600, 700], [640, 720], [560, 680],
]

export const Scene23GlobalMovement: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Label
  const labelOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="worldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.colors.skyBlue} stopOpacity="0.04" />
            <stop offset="100%" stopColor={theme.colors.skyBlue} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background glow */}
        <rect x="0" y="0" width="1920" height="1080" fill="url(#worldGlow)" />

        {/* World outline — simplified continental shapes */}
        <g opacity="0.12" fill="none" stroke={theme.colors.skyBlue} strokeWidth="0.8">
          {/* North America */}
          <path d="M 180 220 L 250 180 L 310 200 L 350 260 L 380 340 L 360 420 L 320 480 L 280 500 L 240 540 L 210 520 L 180 470 L 165 400 L 170 330 Z" />
          {/* South America */}
          <path d="M 310 540 L 360 520 L 420 560 L 440 640 L 420 740 L 380 820 L 340 860 L 310 820 L 290 740 L 280 660 L 290 580 Z" />
          {/* Europe */}
          <path d="M 860 150 L 940 120 L 1020 140 L 1080 180 L 1060 240 L 1000 260 L 940 255 L 875 230 Z" />
          {/* Africa */}
          <path d="M 920 300 L 1000 280 L 1080 300 L 1110 380 L 1100 480 L 1060 580 L 1000 640 L 940 600 L 900 520 L 880 420 Z" />
          {/* Asia */}
          <path d="M 1080 140 L 1220 100 L 1420 130 L 1540 180 L 1560 260 L 1520 320 L 1440 360 L 1300 360 L 1180 340 L 1100 280 Z" />
          {/* Oceania */}
          <path d="M 1440 540 L 1540 510 L 1600 540 L 1600 600 L 1540 630 L 1460 610 Z" />
        </g>

        {/* City dots illuminating progressively */}
        {CITIES.map(([cx, cy], i) => {
          const dotStart = (i / CITIES.length) * 180
          const dotOpacity = interpolate(frame, [dotStart, dotStart + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const colors = [theme.colors.skyBlue, theme.colors.teal, '#FFB347', '#B47FFF', '#4ECB71']
          const color = colors[i % colors.length]
          const pulse = Math.sin(frame * 0.06 + i * 0.7) * 0.3 + 0.8

          return (
            <g key={i} opacity={dotOpacity}>
              <circle cx={cx} cy={cy} r={10 * pulse} fill={color} opacity={0.1} />
              <circle cx={cx} cy={cy} r={4} fill={color} opacity={0.9} />
            </g>
          )
        })}

        {/* Connection lines between nearby cities */}
        {CITIES.map(([cx, cy], i) =>
          CITIES.slice(i + 1, i + 4)
            .filter(([ox, oy]) => Math.hypot(ox - cx, oy - cy) < 160)
            .map(([ox, oy], j) => {
              const lineStart = Math.max((i / CITIES.length) * 180, ((i + j + 1) / CITIES.length) * 180)
              const lineOpacity = interpolate(frame, [lineStart + 15, lineStart + 35], [0, 0.25], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
              return (
                <line key={`${i}-${j}`}
                  x1={cx} y1={cy}
                  x2={ox} y2={oy}
                  stroke={theme.colors.skyBlue}
                  strokeWidth={0.8}
                  strokeOpacity={lineOpacity}
                />
              )
            })
        )}
      </svg>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
      }}>
        <div style={{
          fontFamily: theme.fonts.headline,
          fontSize: 52,
          fontWeight: 800,
          color: theme.colors.white,
          textShadow: `0 0 40px ${theme.colors.skyBlue}40`,
          letterSpacing: -1,
        }}>
          Join the{' '}
          <span style={{ color: theme.colors.skyBlue }}>Movement.</span>
        </div>
      </div>
    </AbsoluteFill>
  )
}

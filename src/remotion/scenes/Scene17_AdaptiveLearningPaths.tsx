// Scene 17 — Adaptive Learning Paths (frames 4032–4284)
// "And AI builds an adaptive learning path — for every teacher, every student, every classroom."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

// Bezier curve path data for animated paths
const PATHS = [
  { d: 'M 200 540 C 400 400 500 480 700 360', color: theme.colors.skyBlue,  delay:  0, label: 'Teacher A' },
  { d: 'M 200 540 C 350 600 480 540 700 480', color: theme.colors.teal,     delay: 15, label: 'Teacher B' },
  { d: 'M 200 540 C 380 650 500 600 700 620', color: '#FFB347',             delay: 30, label: 'Student Group' },
  { d: 'M 700 360 C 900 280 1000 320 1200 240', color: theme.colors.skyBlue, delay: 60, label: 'Advanced Path' },
  { d: 'M 700 480 C 920 460 1020 430 1200 400', color: theme.colors.teal,    delay: 70, label: 'Standard Path' },
  { d: 'M 700 620 C 900 620 1000 580 1200 540', color: '#FFB347',            delay: 80, label: 'Support Path' },
  { d: 'M 1200 240 C 1400 200 1550 220 1720 200', color: theme.colors.skyBlue, delay: 110, label: '' },
  { d: 'M 1200 400 C 1380 380 1520 360 1720 340', color: theme.colors.teal,   delay: 115, label: '' },
  { d: 'M 1200 540 C 1380 530 1520 510 1720 500', color: '#FFB347',           delay: 120, label: '' },
  { d: 'M 1200 240 C 1380 300 1500 450 1720 480', color: '#B47FFF',           delay: 130, label: '' },
]

export const Scene17AdaptiveLearningPaths: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Central AI orb pulsing
  const aiPulse = Math.sin(frame * 0.05) * 0.12 + 1

  // Label
  const labelOpacity = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      <ParticleField density={30} color={theme.colors.skyBlue} speed={0.25} />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          {PATHS.map((path, i) => (
            <filter key={i} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Animated paths — strokeDashoffset reveal */}
        {PATHS.map((path, i) => {
          const pathProgress = interpolate(frame, [path.delay, path.delay + 50], [0, 1], {
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const pathLength = 400
          const dashOffset = pathLength * (1 - pathProgress)

          return (
            <g key={i}>
              {/* Glow layer */}
              <path
                d={path.d}
                stroke={path.color}
                strokeWidth={3}
                strokeOpacity={0.15}
                fill="none"
                strokeDasharray={`${pathLength}`}
                strokeDashoffset={dashOffset}
                filter={`url(#glow-${i})`}
              />
              {/* Main path */}
              <path
                d={path.d}
                stroke={path.color}
                strokeWidth={2}
                strokeOpacity={0.75 * pathProgress}
                fill="none"
                strokeDasharray={`${pathLength}`}
                strokeDashoffset={dashOffset}
              />

              {/* Traveling dot */}
              {pathProgress > 0 && pathProgress < 1.2 && (
                <circle r={5} fill={path.color} opacity={0.9}>
                  <animateMotion dur={`${50 / 30}s`} begin="0s" fill="freeze" path={path.d} />
                </circle>
              )}

              {/* Labels at endpoints */}
              {path.label && pathProgress > 0.7 && (
                <text
                  opacity={interpolate(pathProgress, [0.7, 1], [0, 0.65])}
                  fill={path.color}
                  fontSize={12}
                  fontFamily={theme.fonts.body}
                  fontWeight={600}
                >
                  <textPath href={`#path-${i}`} startOffset="50%">
                    {path.label}
                  </textPath>
                </text>
              )}
            </g>
          )
        })}

        {/* Source orb — AI */}
        <circle cx={200} cy={540} r={50 * aiPulse} fill={theme.colors.skyBlue} opacity={0.12} />
        <circle cx={200} cy={540} r={36 * aiPulse} fill={theme.colors.skyBlue} opacity={0.9} />
        <circle cx={186} cy={526} r={10} fill="white" opacity={0.3} />
        <text x={200} y={545} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={13} fontFamily={theme.fonts.headline} fontWeight={800}>
          AI
        </text>
        <text x={200} y={598} textAnchor="middle"
          fill={theme.colors.skyBlue} fontSize={12} fontFamily={theme.fonts.body} fontWeight={600} opacity={0.8}>
          Personalization Engine
        </text>

        {/* End-point learner icons */}
        {[
          { cx: 1720, cy: 200 },
          { cx: 1720, cy: 340 },
          { cx: 1720, cy: 480 },
        ].map((pt, i) => {
          const dotOpacity = interpolate(frame, [130 + i * 10, 150 + i * 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const colors = [theme.colors.skyBlue, theme.colors.teal, '#FFB347']
          return (
            <g key={i} opacity={dotOpacity}>
              <circle cx={pt.cx} cy={pt.cy} r={22} fill={colors[i]} opacity={0.8} />
              <text x={pt.cx} y={pt.cy + 5} textAnchor="middle" fill="white" fontSize={12}>
                {['🎓', '📚', '⭐'][i]}
              </text>
            </g>
          )
        })}
      </svg>

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
        Personalized for{' '}
        <span style={{ color: theme.colors.skyBlue }}>every learner.</span>
      </div>
    </AbsoluteFill>
  )
}

/**
 * Scene 09 — AI Adoption (figures + adoption message only).
 * Headline beats moved to Scene 10 Closing.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { KineticText } from '../components/KineticText'
import { theme } from '../theme'
import { sceneMaster } from '../utils/sceneTransition'

export const SCENE09_DURATION = 195

const FIGURES = [
  { x: 340,  y: 460, delay: 18, orbColor: theme.colors.primary,   orbX: 420, orbY: 360 },
  { x: 960,  y: 445, delay: 30, orbColor: theme.colors.accent,    orbX: 1055, orbY: 338 },
  { x: 1580, y: 460, delay: 42, orbColor: theme.colors.secondary, orbX: 1488, orbY: 358 },
]

export const Scene09_Adoption: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fgAlpha = sceneMaster(frame, SCENE09_DURATION)
  const contentFade = interpolate(frame, [SCENE09_DURATION - 36, SCENE09_DURATION - 12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const dawnP  = interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const chipOp = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: fgAlpha * contentFade }}>

        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(168deg,
            rgba(252,238,210,${(0.18 * dawnP).toFixed(3)}) 0%,
            rgba(91,79,207,${(0.06 * dawnP).toFixed(3)}) 60%,
            transparent 100%)`,
          pointerEvents: 'none',
        }} />

        <div
          style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 112% 48% at 50% 102%,
            rgba(245,158,11,${(0.16 * dawnP).toFixed(3)}) 0%,
            rgba(91,79,207,${(0.07 * dawnP).toFixed(3)}) 45%,
            transparent 68%)`,
            opacity: interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            pointerEvents: 'none',
          }}
        />

        <div style={{
          position: 'absolute', left: 120, top: 56,
          opacity: chipOp,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(232,128,58,0.10)',
            border: '1.5px solid rgba(232,128,58,0.28)',
            borderRadius: 40, padding: '6px 16px 6px 12px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: theme.colors.accent,
              boxShadow: `0 0 9px ${theme.colors.accentGlow}`,
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: theme.colors.accent,
              fontFamily: theme.font.display,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              The Future Is Now
            </span>
          </div>
        </div>

        {FIGURES.map((fig, i) => {
          const ff  = Math.max(0, frame - fig.delay)
          const fp  = spring({ frame: ff, fps, config: theme.spring.zoom })
          const figOp      = interpolate(fp, [0, 1], [0, 1])
          const figSc      = interpolate(fp, [0, 1], [0.75, 1])
          const breathe    = 1 + 0.008 * Math.sin(frame * 0.025 + i * 1.1)

          const orbF       = Math.max(0, frame - fig.delay - 22)
          const orbP       = spring({ frame: orbF, fps, config: theme.spring.snappy })
          const orbOp      = interpolate(orbP, [0, 1], [0, 1])
          const orbSc      = interpolate(orbP, [0, 1], [0.5, 1])
          const orbPulse   = Math.sin(frame * 0.035 + i * 0.8) * 0.5 + 0.5

          return (
            <React.Fragment key={i}>
              <svg style={{
                position: 'absolute',
                left: fig.x - 50, top: fig.y - 120,
                opacity: figOp,
                transform: `scale(${figSc * breathe})`,
                transformOrigin: '50px 120px',
                overflow: 'visible',
              }} width={100} height={200}>
                <circle cx={50} cy={30} r={26}
                  fill={theme.colors.surface}
                  stroke={`${fig.orbColor}50`} strokeWidth={1.5} />
                <circle cx={50} cy={30} r={34}
                  fill="none" stroke={fig.orbColor} strokeWidth={1} strokeOpacity={0.22} />
                <rect x={22} y={62} width={56} height={80} rx={14}
                  fill={theme.colors.surface}
                  stroke="rgba(91,79,207,0.12)" strokeWidth={1.5} />
                <line x1={30} y1={72} x2={70} y2={72}
                  stroke={fig.orbColor} strokeWidth={1.5} strokeOpacity={0.45} />
                <rect x={2}  y={65} width={18} height={55} rx={9}
                  fill={theme.colors.surfaceDim} stroke="rgba(91,79,207,0.10)" strokeWidth={1} />
                <rect x={80} y={65} width={18} height={55} rx={9}
                  fill={theme.colors.surfaceDim} stroke="rgba(91,79,207,0.10)" strokeWidth={1} />
                <rect x={8} y={152} width={84} height={26} rx={13}
                  fill={`${fig.orbColor}14`}
                  stroke={fig.orbColor} strokeWidth={1} strokeOpacity={0.45} />
                <text x={50} y={169} textAnchor="middle" dominantBaseline="middle"
                  fill={fig.orbColor} fontSize={11} fontWeight={700}
                  fontFamily={theme.font.display}>
                  {i === 0 ? 'EDUCATOR' : i === 1 ? 'STUDENT' : 'LEADER'}
                </text>
              </svg>

              <div style={{
                position: 'absolute',
                left: fig.orbX - 24, top: fig.orbY - 24,
                width: 48, height: 48,
                borderRadius: '50%',
                background: `radial-gradient(circle at 38% 32%, ${fig.orbColor}ff 0%, ${fig.orbColor}88 50%, transparent 80%)`,
                boxShadow: `0 0 ${20 + orbPulse * 14}px ${fig.orbColor}55`,
                opacity: orbOp,
                transform: `scale(${orbSc})`,
              }} />
            </React.Fragment>
          )
        })}

        <div style={{
          position: 'absolute', top: 300, left: '14%', right: '14%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(91,79,207,0.16), transparent)',
          opacity: interpolate(frame, [52, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />

        <div style={{
          position: 'absolute', top: 340, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          padding: '0 200px',
          opacity: interpolate(frame, [78, 98], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <KineticText
            text="Adapting to AI becomes simple, safe, and human-centered."
            mode="spring-word"
            startFrame={78}
            fontSize={40}
            fontWeight={500}
            color={theme.colors.text}
            textAlign="center"
            stagger={3}
            style={{ maxWidth: 940, lineHeight: 1.35 }}
          />
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/**
 * NetworkGraph — ecosystem hub with optional merge-into-center finale.
 */
import React from 'react'
import { Img, interpolate, spring } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'

import { theme } from '../theme'

export interface NetworkNode {
  id: string
  label: string
  icon: string
  color: string
  x: number
  y: number
}

interface NetworkGraphProps {
  centerLabel?: string
  centerIcon?: string
  centerLogoSrc?: string
  nodes: NetworkNode[]
  startFrame?: number
  width?: number
  height?: number
  showStats?: boolean
  stats?: Array<{ nodeId: string; text: string }>
  /** 0 = spread, 1 = all nodes absorbed into center */
  mergeProgress?: number
  /** 0–1 spin+collapse outro — tightens orbit and hub glow */
  spinProgress?: number
  /** 0–1 hub-only zoom-out after nodes absorbed */
  hubZoomOutProgress?: number
  enhanced?: boolean
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  centerLabel = 'Tutify',
  centerIcon = '✦',
  centerLogoSrc,
  nodes,
  startFrame = 0,
  width = 1920,
  height = 1080,
  showStats = true,
  stats = [],
  mergeProgress = 0,
  spinProgress = 0,
  hubZoomOutProgress = 0,
  enhanced = false,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)

  const cx = width / 2
  const cy = height / 2 - 20

  const nodeR = enhanced ? 42 : 30
  const iconSize = enhanced ? 28 : 18
  const labelSize = enhanced ? 15 : 14
  const statSize = enhanced ? 12 : 12
  const centerR = enhanced ? 78 : 58
  const haloR = enhanced ? 68 : 52

  const centerP = spring({ frame: f, fps, config: theme.spring.zoom })
  const centerScale = interpolate(centerP, [0, 1], [0, 1])
  const merge = Math.max(0, Math.min(1, mergeProgress))
  const spin = Math.max(0, Math.min(1, spinProgress))
  const hubZoom = Math.max(0, Math.min(1, hubZoomOutProgress))
  const orbitRadius =
    nodes.length > 0 ? Math.hypot(nodes[0]!.x - cx, nodes[0]!.y - cy) : 280
  const centerMergeScale = 1 + merge * 0.52 + spin * 0.08
  const hubLogoZoomScale = 1 + hubZoom * 0.65
  const centerGlow =
    (0.06 + 0.14 * merge + 0.1 * spin + 0.04 * Math.sin(f * 0.05)) *
    interpolate(hubZoom, [0, 0.12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const hubScale = centerScale * centerMergeScale * hubLogoZoomScale
  const hubOpacity =
    centerScale *
    (1 - merge * 0.06) *
    interpolate(hubZoom, [0, 0.45], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  const graphHidden = hubZoom > 0.02
  const hubSize = centerR * 2
  const labelOpacity = interpolate(centerScale, [0, 1], [0, 1])

  return (
    <>
      <svg
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="node-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation={enhanced ? 10 : 6} floodColor="rgba(91,79,207,0.18)" />
          </filter>
          <filter id="pulse-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map((node, i) => {
          const lineDelay = 12 + i * 14
          const lf = Math.max(0, f - lineDelay)
          const lp = interpolate(lf, [0, 32], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const nx = cx + (node.x - cx) * lp
          const ny = cy + (node.y - cy) * lp
          const spiral = spin * 0.2 * orbitRadius * 0.08 * (i + 1)
          const dx = nx - cx
          const dy = ny - cy
          const dist = Math.hypot(dx, dy) || orbitRadius
          const orbitX = (-dy / dist) * spiral
          const orbitY = (dx / dist) * spiral
          const mx = nx + (cx - nx) * merge + orbitX * (1 - merge)
          const my = ny + (cy - ny) * merge + orbitY * (1 - merge)
          const lineOp = graphHidden ? 0 : (0.45 - merge * 0.42 - spin * 0.25) * lp

          const pulseCycle = ((f - lineDelay - 20) % 70) / 70
          const ppx = cx + (node.x - cx) * Math.max(0, Math.min(1, pulseCycle))
          const ppy = cy + (node.y - cy) * Math.max(0, Math.min(1, pulseCycle))
          const showPulse = pulseCycle > 0 && pulseCycle < 1 && f > lineDelay + 20 && merge < 0.15

          return (
            <g key={`line-${node.id}`}>
              <line
                x1={cx}
                y1={cy}
                x2={mx}
                y2={my}
                stroke={node.color}
                strokeWidth={enhanced ? 2.5 : 2}
                strokeOpacity={lineOp}
                strokeDasharray="7 5"
              />
              {showPulse && (
                <circle cx={ppx} cy={ppy} r={5} fill={node.color} opacity={0.85} filter="url(#pulse-glow)" />
              )}
            </g>
          )
        })}

        {nodes.map((node, i) => {
          const nodeDelay = 28 + i * 16
          const nf = Math.max(0, f - nodeDelay)
          const np = spring({ frame: nf, fps, config: theme.spring.zoom })
          const nScale =
            interpolate(np, [0, 1], [0, 1]) * (1 - merge * 0.92) * (1 - spin * 0.35)
          const nOpacity = interpolate(np, [0, 1], [0, 1]) * (1 - merge * 0.98)

          const spiral = spin * 0.2 * orbitRadius * 0.08 * (i + 1)
          const dx = node.x - cx
          const dy = node.y - cy
          const dist = Math.hypot(dx, dy) || orbitRadius
          const orbitX = (-dy / dist) * spiral
          const orbitY = (dx / dist) * spiral
          const px = node.x + (cx - node.x) * merge + orbitX * (1 - merge)
          const py = node.y + (cy - node.y) * merge + orbitY * (1 - merge)
          const nodeHidden = graphHidden || merge > 0.98

          const statEntry = stats.find((s) => s.nodeId === node.id)
          const sf = Math.max(0, f - nodeDelay - 18)
          const stp = spring({ frame: sf, fps, config: theme.spring.gentle })
          const stOp = interpolate(stp, [0, 1], [0, 1]) * (1 - merge)
          const stY = interpolate(stp, [0, 1], [10, 0])

          return (
            <g key={node.id} transform={`translate(${px}, ${py})`} opacity={nodeHidden ? 0 : nOpacity}>
              <circle r={haloR} fill={node.color} opacity={0.1 + 0.05 * Math.sin(f * 0.04 + i)} />
              <circle
                r={nodeR}
                fill="rgba(255,255,255,0.92)"
                stroke={node.color}
                strokeWidth={enhanced ? 2.5 : 2}
                strokeOpacity={0.85}
                filter="url(#node-shadow)"
                transform={`scale(${nScale})`}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={iconSize}
                transform={`scale(${nScale})`}
              >
                {node.icon}
              </text>
              <text
                y={nodeR + 18}
                textAnchor="middle"
                fill={theme.colors.text}
                fontSize={labelSize}
                fontWeight={700}
                fontFamily={theme.font.display}
              >
                {node.label}
              </text>
              {showStats && statEntry && (
                <text
                  y={nodeR + 36}
                  textAnchor="middle"
                  fill={node.color}
                  fontSize={statSize}
                  fontFamily={theme.font.display}
                  fontWeight={600}
                  opacity={stOp}
                  transform={`translateY(${stY})`}
                >
                  {statEntry.text}
                </text>
              )}
            </g>
          )
        })}

        <g transform={`translate(${cx}, ${cy})`}>
          <circle
            r={centerR + (enhanced ? 28 : 24)}
            fill={theme.colors.primary}
            opacity={centerGlow}
            transform={`scale(${hubScale})`}
          />
          {!centerLogoSrc ? (
            <>
              <circle
                r={centerR}
                fill="rgba(255,255,255,0.94)"
                stroke={theme.colors.primary}
                strokeWidth={3}
                strokeOpacity={0.85}
                filter="url(#node-shadow)"
                transform={`scale(${hubScale})`}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={enhanced ? 32 : 24}
                fill={theme.colors.primary}
                fontWeight={700}
                fontFamily={theme.font.display}
                transform={`scale(${hubScale})`}
              >
                {centerIcon}
              </text>
              <text
                y={centerR + (enhanced ? 22 : 18)}
                textAnchor="middle"
                fill={theme.colors.text}
                fontSize={enhanced ? 18 : 16}
                fontWeight={700}
                fontFamily={theme.font.display}
                opacity={labelOpacity}
                transform={`scale(${centerMergeScale})`}
              >
                {centerLabel}
              </text>
            </>
          ) : null}
        </g>
      </svg>

      {centerLogoSrc ? (
        <div
          style={{
            position: 'absolute',
            left: cx - centerR,
            top: cy - centerR,
            width: hubSize,
            height: hubSize,
            opacity: hubOpacity,
            transform: `scale(${hubScale})`,
            transformOrigin: 'center center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              padding: enhanced ? 4 : 3,
              background: `linear-gradient(145deg, ${theme.colors.primary} 0%, #6366F1 42%, #4338CA 100%)`,
              boxShadow: `0 14px 48px ${theme.colors.primaryGlow}, 0 6px 20px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.35)`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                background:
                  'linear-gradient(165deg, #1e3a5f 0%, #0f172a 48%, #020617 100%)',
              }}
            >
              <Img
                src={centerLogoSrc}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 32% 22%, rgba(255,255,255,0.14) 0%, transparent 48%), radial-gradient(circle at 72% 88%, rgba(0,0,0,0.22) 0%, transparent 55%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

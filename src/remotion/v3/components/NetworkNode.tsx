import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface NodeDef {
  label: string
  emoji?: string
  color?: string
}

interface NetworkNodeProps {
  centerLabel?: string
  nodes: NodeDef[]
  startFrame?: number
  radius?: number
  cx?: number
  cy?: number
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  centerLabel = 'Tutify',
  nodes,
  startFrame = 0,
  radius = 230,
  cx = 960,
  cy = 560,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)

  const centerP = spring({ frame: f, fps, config: { damping: 80, stiffness: 200 } })
  const centerScale = interpolate(centerP, [0, 1], [0, 1])
  const centerOp = interpolate(centerP, [0, 1], [0, 1])

  // Pulse ring animation (loops every 60 frames)
  const pulseCycle = (f % 60) / 60
  const pulseR = interpolate(pulseCycle, [0, 1], [55, 130])
  const pulseOp = interpolate(pulseCycle, [0, 1], [0.5, 0])

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={1920}
      height={1080}
    >
      {/* Decorative orbit rings */}
      {[radius * 0.55, radius * 0.85, radius * 1.1].map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(56,189,248,0.05)"
          strokeWidth={1}
          strokeDasharray="6 10"
        />
      ))}

      {/* Connection lines with draw animation */}
      {nodes.map((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
        const nx = cx + Math.cos(angle) * radius
        const ny = cy + Math.sin(angle) * radius
        const lineDelay = 18 + i * 14
        const lineF = Math.max(0, f - lineDelay)
        const lineP = spring({ frame: lineF, fps, config: { damping: 100, stiffness: 140 } })
        const lineOp = interpolate(lineP, [0, 1], [0, 0.45])
        const lineLen = Math.sqrt(Math.pow(nx - cx, 2) + Math.pow(ny - cy, 2))
        const dashOffset = interpolate(lineP, [0, 1], [lineLen, 0])

        return (
          <g key={i}>
            <line
              x1={cx} y1={cy} x2={nx} y2={ny}
              stroke={node.color ?? '#38BDF8'}
              strokeWidth={1.5}
              opacity={lineOp}
              strokeDasharray={lineLen}
              strokeDashoffset={dashOffset}
            />
            {/* Traveling glow dot */}
            <circle
              cx={cx + (nx - cx) * interpolate(lineP, [0, 1], [0, 1])}
              cy={cy + (ny - cy) * interpolate(lineP, [0, 1], [0, 1])}
              r={3}
              fill={node.color ?? '#38BDF8'}
              opacity={lineOp * 2}
            />
          </g>
        )
      })}

      {/* Center pulse rings */}
      <circle cx={cx} cy={cy} r={pulseR} fill="none" stroke="#38BDF8" strokeWidth={1}
        opacity={pulseOp * centerOp} />
      <circle cx={cx} cy={cy} r={pulseR * 0.6} fill="none" stroke="#38BDF8" strokeWidth={0.8}
        opacity={pulseOp * 0.5 * centerOp} />

      {/* Center hub */}
      <circle cx={cx} cy={cy} r={62 * centerScale} fill="rgba(56,189,248,0.12)"
        stroke="#38BDF8" strokeWidth={1.5} opacity={centerOp} />
      <circle cx={cx} cy={cy} r={56 * centerScale} fill="rgba(7,8,15,0.88)" opacity={centerOp} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill="#38BDF8" fontSize={20} fontWeight={700} fontFamily="Sora, Inter, sans-serif"
        opacity={centerOp}>
        {centerLabel}
      </text>

      {/* Outer nodes */}
      {nodes.map((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
        const nx = cx + Math.cos(angle) * radius
        const ny = cy + Math.sin(angle) * radius
        const nodeDelay = 34 + i * 14
        const nodeF = Math.max(0, f - nodeDelay)
        const nodeP = spring({ frame: nodeF, fps, config: { damping: 80, stiffness: 240 } })
        const nodeScale = interpolate(nodeP, [0, 1], [0, 1])
        const nodeOp = interpolate(nodeP, [0, 1], [0, 1])
        const color = node.color ?? '#38BDF8'
        // Per-node pulse offset
        const nodePulse = ((f + i * 15) % 60) / 60
        const nodePulseR = interpolate(nodePulse, [0, 1], [44, 72])
        const nodePulseOp = interpolate(nodePulse, [0, 1], [0.4, 0]) * nodeOp

        return (
          <g key={i} opacity={nodeOp}>
            {/* Node pulse ring */}
            <circle cx={nx} cy={ny} r={nodePulseR} fill="none" stroke={color}
              strokeWidth={1} opacity={nodePulseOp} />
            {/* Node body */}
            <circle cx={nx} cy={ny} r={46 * nodeScale} fill={`${color}18`}
              stroke={color} strokeWidth={1.5} />
            <circle cx={nx} cy={ny} r={41 * nodeScale} fill="rgba(7,8,15,0.88)" />
            {/* Emoji */}
            {node.emoji && (
              <text x={nx} y={ny - 6} textAnchor="middle" dominantBaseline="middle"
                fontSize={20} opacity={nodeOp}>
                {node.emoji}
              </text>
            )}
            {/* Label */}
            <text x={nx} y={ny + (node.emoji ? 14 : 0)} textAnchor="middle" dominantBaseline="middle"
              fill="#F8FAFC" fontSize={13} fontWeight={600}
              fontFamily="DM Sans, Inter, sans-serif" opacity={nodeOp}>
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

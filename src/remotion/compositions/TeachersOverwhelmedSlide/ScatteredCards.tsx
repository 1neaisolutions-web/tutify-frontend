import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { theme } from '../../v4/theme'
import { sceneCloseDriftY } from './sceneClose'
import {
  PLACEMENTS,
  CHAOS_CARDS,
  COLOR_SLATE,
  COLOR_SLATE_MID,
  COLOR_CORAL,
  CARDS_START,
  type CardPlacement,
} from './constants'

const SHADOW = '0 18px 48px rgba(0,0,0,0.09), 0 4px 14px rgba(0,0,0,0.04)'

const fromDelta = (side: CardPlacement['from'], p: number): { x: number; y: number } => {
  const d = interpolate(p, [0, 1], [520, 0])
  switch (side) {
    case 'left':
      return { x: -d, y: 0 }
    case 'right':
      return { x: d, y: 0 }
    case 'top':
      return { x: 0, y: -d }
    case 'bottom':
      return { x: 0, y: d }
    case 'topLeft':
      return { x: -d * 0.85, y: -d * 0.7 }
    case 'topRight':
      return { x: d * 0.85, y: -d * 0.7 }
    case 'bottomLeft':
      return { x: -d * 0.8, y: d * 0.75 }
    case 'bottomRight':
      return { x: d * 0.8, y: d * 0.75 }
    default:
      return { x: 0, y: 0 }
  }
}

const NotifyCard: React.FC<{ index: number; w: number }> = ({ index, w }) => {
  const c = CHAOS_CARDS[index]
  return (
    <div
      style={{
        width: w,
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${c.accent}`,
        boxShadow: SHADOW,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 11,
          background: 'rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {c.emoji}
      </div>
      <div>
        <div
          style={{ fontSize: 16, fontWeight: 700, color: COLOR_SLATE, fontFamily: theme.font.display }}
        >
          {c.title}
        </div>
        <div style={{ fontSize: 13, color: COLOR_SLATE_MID, marginTop: 3, fontFamily: theme.font.display }}>
          {c.sub}
        </div>
      </div>
    </div>
  )
}

const MenuCard: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FFF',
      borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: SHADOW,
      padding: 14,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 700, color: COLOR_CORAL, marginBottom: 12 }}>Tickets</div>
    {['Snoozed', 'Resolved', 'Categories'].map((l) => (
      <div
        key={l}
        style={{
          fontSize: 13,
          color: COLOR_SLATE_MID,
          padding: '8px 0',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {l}
      </div>
    ))}
  </div>
)

const ThreadCard: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FFF',
      borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: SHADOW,
      padding: 14,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
      {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
      ))}
    </div>
    {['Dashboard Ticket', 'Login Ticket'].map((t) => (
      <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.08)' }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: COLOR_SLATE }}>{t}</div>
      </div>
    ))}
  </div>
)

const PillCard: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#2C2C2E',
      borderRadius: 999,
      boxShadow: SHADOW,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '0 20px',
      boxSizing: 'border-box',
    }}
  >
    <span style={{ color: '#FFF', fontSize: 14, fontWeight: 600 }}>Unresolved Tickets</span>
    <span
      style={{
        background: '#FF3B30',
        color: '#FFF',
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 999,
      }}
    >
      99+
    </span>
  </div>
)

const WindowCard: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FFF',
      borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: SHADOW,
      padding: 12,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
      {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
      ))}
    </div>
    {[0.95, 0.7, 0.85, 0.6, 0.75].map((rw, i) => (
      <div
        key={i}
        style={{
          height: 7,
          width: `${rw * 100}%`,
          background: 'rgba(0,0,0,0.07)',
          borderRadius: 4,
          marginBottom: 7,
        }}
      />
    ))}
  </div>
)

const renderCard = (p: CardPlacement) => {
  switch (p.kind) {
    case 'notify':
      return <NotifyCard index={p.notifyIndex ?? 0} w={p.w} />
    case 'menu':
      return <MenuCard w={p.w} h={p.h ?? 200} />
    case 'thread':
      return <ThreadCard w={p.w} h={p.h ?? 150} />
    case 'pill':
      return <PillCard w={p.w} h={p.h ?? 52} />
    case 'window':
      return <WindowCard w={p.w} h={p.h ?? 180} />
    default:
      return null
  }
}

export const ScatteredCards: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const driftY = sceneCloseDriftY(frame)

  return (
    <>
      {PLACEMENTS.map((p) => {
        const start = CARDS_START + p.delay
        if (frame < start) return null

        const prog = spring({
          frame: frame - start,
          fps,
          config: { damping: 22, stiffness: 165, mass: 0.95 },
        })
        const { x: dx, y: dy } = fromDelta(p.from, prog)
        const op = interpolate(prog, [0, 1], [0, 1])
        const blur = p.blur ? interpolate(prog, [0, 1], [6, p.blur * 8]) : 0

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              opacity: op * (p.blur ? 1 - p.blur * 0.35 : 1),
              transform: `translate(${dx}px, ${dy + driftY}px) rotate(${p.rot ?? 0}deg)`,
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
              zIndex: Math.round(10 - (p.blur ?? 0) * 5),
              pointerEvents: 'none',
            }}
          >
            {renderCard(p)}
          </div>
        )
      })}
    </>
  )
}

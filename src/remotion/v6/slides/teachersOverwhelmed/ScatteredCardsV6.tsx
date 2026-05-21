import React from 'react'
import { Easing, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { theme } from '../../../v4/theme'
import {
  CHAOS_CARDS,
  CLOSE_START,
  COLOR_CORAL,
  COLOR_SLATE,
  COLOR_SLATE_MID,
} from '../../../compositions/TeachersOverwhelmedSlide/constants'
import { PLACEMENTS_V6, type CardPlacementV6, type CardDepth } from './placements'
import { CARDS_ANIMATION_ORIGIN } from './timing'

const SHADOW_NEAR =
  '0 28px 72px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset'
const SHADOW_MID = '0 20px 52px rgba(0,0,0,0.11), 0 4px 16px rgba(0,0,0,0.05)'
const SHADOW_FAR = '0 12px 36px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'

const depthScale = (d: CardDepth = 0): number => (d === 2 ? 0.9 : d === 1 ? 0.96 : 1)
const depthShadow = (d: CardDepth = 0): string =>
  d === 2 ? SHADOW_FAR : d === 1 ? SHADOW_MID : SHADOW_NEAR
const depthBlur = (d: CardDepth = 0): number => (d === 2 ? 5 : d === 1 ? 2 : 0)
const depthZ = (d: CardDepth = 0): number => (d === 2 ? 6 : d === 1 ? 14 : 22)
const ENTER_SPRING = { damping: 28, stiffness: 105, mass: 1.05 }

const hashOffset = (id: string): number => {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 100
  return h / 100
}

const fromDelta = (side: CardPlacementV6['from'], p: number): { x: number; y: number } => {
  const d = interpolate(p, [0, 1], [340, 0], { easing: Easing.out(Easing.cubic) })
  switch (side) {
    case 'left':
      return { x: -d, y: d * 0.08 }
    case 'right':
      return { x: d, y: d * 0.08 }
    case 'top':
      return { x: d * 0.06, y: -d }
    case 'bottom':
      return { x: -d * 0.05, y: d }
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

const NotifyCard: React.FC<{ index: number; w: number; shadow: string }> = ({
  index,
  w,
  shadow,
}) => {
  const c = CHAOS_CARDS[index]!
  return (
    <div
      style={{
        width: w,
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.055)',
        borderLeft: `4px solid ${c.accent}`,
        boxShadow: shadow,
        padding: '15px 18px',
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

const MenuCard: React.FC<{ w: number; h: number; shadow: string }> = ({ w, h, shadow }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FFF',
      borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: shadow,
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

const ThreadCard: React.FC<{ w: number; h: number; shadow: string; tall?: boolean }> = ({
  w,
  h,
  shadow,
  tall,
}) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FFF',
      borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: shadow,
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

const PillCard: React.FC<{ w: number; h: number; shadow: string }> = ({ w, h, shadow }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#2C2C2E',
      borderRadius: 999,
      boxShadow: shadow,
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

const DashboardCard: React.FC<{ w: number; h: number; shadow: string }> = ({ w, h, shadow }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FAFBFC',
      borderRadius: 18,
      border: '1px solid rgba(0,0,0,0.07)',
      boxShadow: shadow,
      padding: 16,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}
  >
    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
      {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
        <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
      ))}
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 72, marginBottom: 12 }}>
      {[0.45, 0.72, 0.55, 0.9, 0.62, 0.78].map((ht, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${ht * 100}%`,
            background: `linear-gradient(180deg, ${theme.colors.accent} 0%, rgba(37,99,235,0.35) 100%)`,
            borderRadius: 4,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
    {[0.92, 0.78, 0.65, 0.88].map((rw, i) => (
      <div
        key={i}
        style={{
          height: 8,
          width: `${rw * 100}%`,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 4,
          marginBottom: 8,
        }}
      />
    ))}
  </div>
)

const WindowCard: React.FC<{ w: number; h: number; shadow: string }> = ({ w, h, shadow }) => (
  <div
    style={{
      width: w,
      height: h,
      background: '#FFF',
      borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: shadow,
      padding: 12,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
      {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
      ))}
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: COLOR_SLATE, marginBottom: 8 }}>Dashboard Ticket</div>
    <div style={{ fontSize: 12, color: COLOR_SLATE_MID, marginBottom: 10, lineHeight: 1.35 }}>
      I can&apos;t find following features in the dashboard…
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: COLOR_SLATE, marginBottom: 6 }}>Login Ticket</div>
    <div style={{ fontSize: 12, color: COLOR_SLATE_MID, lineHeight: 1.35 }}>Facing login issue while 2FA…</div>
  </div>
)

const renderCard = (p: CardPlacementV6) => {
  const d = p.depth ?? 0
  const shadow = depthShadow(d)
  switch (p.kind) {
    case 'notify':
      return <NotifyCard index={p.notifyIndex ?? 0} w={p.w} shadow={shadow} />
    case 'menu':
      return <MenuCard w={p.w} h={p.h ?? 218} shadow={shadow} />
    case 'thread':
      return <ThreadCard w={p.w} h={p.h ?? 128} shadow={shadow} />
    case 'threadTall':
      return <ThreadCard w={p.w} h={p.h ?? 348} shadow={shadow} tall />
    case 'pill':
      return <PillCard w={p.w} h={p.h ?? 52} shadow={shadow} />
    case 'window':
      return <WindowCard w={p.w} h={p.h ?? 196} shadow={shadow} />
    case 'dashboard':
      return <DashboardCard w={p.w} h={p.h ?? 360} shadow={shadow} />
    default:
      return null
  }
}

export const ScatteredCardsV6: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <>
      {PLACEMENTS_V6.map((p) => {
        const start = CARDS_ANIMATION_ORIGIN + p.delay
        if (frame < start - 2) return null

        const enter = spring({
          frame: Math.max(0, frame - start),
          fps,
          config: ENTER_SPRING,
        })
        const enterEase = interpolate(enter, [0, 1], [0, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })

        const exitStagger = p.delay * 0.35
        const exit = interpolate(
          frame,
          [CLOSE_START + exitStagger, CLOSE_START + exitStagger + 22],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) },
        )

        const { x: dx, y: dy } = fromDelta(p.from, enterEase * (1 - exit * 0.85))
        const d = p.depth ?? 0
        const scale = depthScale(d) * interpolate(enterEase, [0, 1], [0.82, 1]) * (1 - exit * 0.12)

        const settleAt = start + 28
        const floatPhase = hashOffset(p.id) * Math.PI * 2
        const floatY =
          frame > settleAt && exit < 0.05
            ? Math.sin((frame - settleAt) * 0.055 + floatPhase) * (d === 0 ? 4 : 2.5)
            : 0
        const floatRot =
          frame > settleAt && exit < 0.05
            ? Math.sin((frame - settleAt) * 0.04 + floatPhase + 1) * (d === 0 ? 0.6 : 0.35)
            : 0

        const rot = (p.rot ?? 0) + floatRot
        const blurAmt = depthBlur(d) + interpolate(enterEase, [0, 1], [8, 0]) + exit * 6
        const opacity = interpolate(enterEase, [0, 1], [0, 1]) * (1 - exit)

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              opacity,
              transform: `translate(${dx}px, ${dy + floatY}px) rotate(${rot}deg) scale(${scale})`,
              transformOrigin: '50% 50%',
              filter: blurAmt > 0.35 ? `blur(${blurAmt}px)` : undefined,
              zIndex: depthZ(d),
              pointerEvents: 'none',
              willChange: 'transform, opacity, filter',
            }}
          >
            {renderCard(p)}
          </div>
        )
      })}
    </>
  )
}



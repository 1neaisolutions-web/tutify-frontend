import React from 'react'
import { Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

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

const SHADOW_ZELIOS_NEAR = '0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(120, 90, 200, 0.12)'
const SHADOW_ZELIOS_FAR = '0 20px 48px rgba(0,0,0,0.45)'

export type ScatteredCardsAppearance = 'light' | 'zelios'

type CardChrome = {
  surface: string
  border: string
  title: string
  sub: string
  shadow: string
  backdropFilter?: string
}

const chromeLight = (shadow: string): CardChrome => ({
  surface: '#FFFFFF',
  border: 'rgba(0,0,0,0.06)',
  title: COLOR_SLATE,
  sub: COLOR_SLATE_MID,
  shadow,
})

const chromeZelios = (shadow: string, light: boolean, glassEffect: boolean): CardChrome =>
  light
    ? {
        surface: 'rgba(255, 255, 255, 0.94)',
        border: 'rgba(255, 255, 255, 0.38)',
        title: COLOR_SLATE,
        sub: COLOR_SLATE_MID,
        shadow: '0 24px 56px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12)',
        backdropFilter: glassEffect ? 'blur(16px) saturate(1.25)' : undefined,
      }
    : {
        surface: 'rgba(10, 5, 24, 0.68)',
        border: 'rgba(140, 100, 220, 0.32)',
        title: '#EEEBFA',
        sub: 'rgba(205, 195, 230, 0.72)',
        shadow,
        backdropFilter: glassEffect ? 'blur(22px) saturate(1.18)' : undefined,
      }

const depthScale = (d: CardDepth = 0, appearance: ScatteredCardsAppearance = 'light'): number =>
  appearance === 'zelios' ? (d === 2 ? 0.82 : d === 1 ? 0.9 : 0.98) : d === 2 ? 0.9 : d === 1 ? 0.96 : 1

const depthShadow = (d: CardDepth = 0, appearance: ScatteredCardsAppearance = 'light'): string => {
  if (appearance === 'zelios') return d === 2 ? SHADOW_ZELIOS_FAR : SHADOW_ZELIOS_NEAR
  return d === 2 ? SHADOW_FAR : d === 1 ? SHADOW_MID : SHADOW_NEAR
}

const depthBlur = (
  d: CardDepth = 0,
  appearance: ScatteredCardsAppearance = 'light',
  blurCards = true,
): number => {
  if (!blurCards) return 0
  return appearance === 'zelios' ? (d === 2 ? 8 : d === 1 ? 4 : 0) : d === 2 ? 5 : d === 1 ? 2 : 0
}

const depthOpacity = (
  d: CardDepth = 0,
  appearance: ScatteredCardsAppearance = 'light',
  blurCards = true,
): number => {
  if (!blurCards) return 1
  return appearance === 'zelios' ? (d === 2 ? 0.52 : d === 1 ? 0.76 : 1) : 1
}

const depthZ = (d: CardDepth = 0): number => (d === 2 ? 6 : d === 1 ? 14 : 22)

const DEFAULT_ZELIOS_LIGHT_IDS = new Set(['n-top-center', 'win-top'])

const isZeliosLightCard = (p: CardPlacementV6, lightCardIds?: Set<string>): boolean => {
  const ids = lightCardIds ?? DEFAULT_ZELIOS_LIGHT_IDS
  return p.kind === 'window' || ids.has(p.id)
}
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

const NotifyCard: React.FC<{
  index: number
  w: number
  chrome: CardChrome
}> = ({ index, w, chrome }) => {
  const c = CHAOS_CARDS[index % CHAOS_CARDS.length]!
  return (
    <div
      style={{
        width: w,
        background: chrome.surface,
        borderRadius: 16,
        border: `1px solid ${chrome.border}`,
        borderLeft: `4px solid ${c.accent}`,
        boxShadow: chrome.shadow,
        backdropFilter: chrome.backdropFilter,
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
          background: 'rgba(255,255,255,0.08)',
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
          style={{ fontSize: 16, fontWeight: 700, color: chrome.title, fontFamily: theme.font.display }}
        >
          {c.title}
        </div>
        <div style={{ fontSize: 13, color: chrome.sub, marginTop: 3, fontFamily: theme.font.display }}>
          {c.sub}
        </div>
      </div>
    </div>
  )
}

const MenuCard: React.FC<{ w: number; h: number; chrome: CardChrome }> = ({ w, h, chrome }) => (
  <div
    style={{
      width: w,
      height: h,
      background: chrome.surface,
      borderRadius: 14,
      border: `1px solid ${chrome.border}`,
      boxShadow: chrome.shadow,
      backdropFilter: chrome.backdropFilter,
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
          color: chrome.sub,
          padding: '8px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {l}
      </div>
    ))}
  </div>
)

const ThreadCard: React.FC<{ w: number; h: number; chrome: CardChrome; tall?: boolean }> = ({
  w,
  h,
  chrome,
}) => (
  <div
    style={{
      width: w,
      height: h,
      background: chrome.surface,
      borderRadius: 14,
      border: `1px solid ${chrome.border}`,
      boxShadow: chrome.shadow,
      backdropFilter: chrome.backdropFilter,
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
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: chrome.title }}>{t}</div>
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

const DashboardCard: React.FC<{ w: number; h: number; chrome: CardChrome }> = ({ w, h, chrome }) => (
  <div
    style={{
      width: w,
      height: h,
      background: chrome.surface,
      borderRadius: 18,
      border: `1px solid ${chrome.border}`,
      boxShadow: chrome.shadow,
      backdropFilter: chrome.backdropFilter,
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
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 4,
          marginBottom: 8,
        }}
      />
    ))}
  </div>
)

const WindowCard: React.FC<{ w: number; h: number; chrome: CardChrome }> = ({ w, h, chrome }) => (
  <div
    style={{
      width: w,
      height: h,
      background: chrome.surface,
      borderRadius: 14,
      border: `1px solid ${chrome.border}`,
      boxShadow: chrome.shadow,
      backdropFilter: chrome.backdropFilter,
      padding: 12,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
      {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
      ))}
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: chrome.title, marginBottom: 8 }}>Dashboard Ticket</div>
    <div style={{ fontSize: 12, color: chrome.sub, marginBottom: 10, lineHeight: 1.35 }}>
      I can&apos;t find following features in the dashboard…
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: chrome.title, marginBottom: 6 }}>Login Ticket</div>
    <div style={{ fontSize: 12, color: chrome.sub, lineHeight: 1.35 }}>Facing login issue while 2FA…</div>
  </div>
)

const renderCard = (
  p: CardPlacementV6,
  appearance: ScatteredCardsAppearance,
  glassEffect: boolean,
  lightCardIds?: Set<string>,
) => {
  const d = p.depth ?? 0
  const shadow = depthShadow(d, appearance)
  const light = appearance === 'zelios' && isZeliosLightCard(p, lightCardIds)
  const chrome =
    appearance === 'zelios'
      ? chromeZelios(shadow, light, glassEffect)
      : chromeLight(shadow)

  switch (p.kind) {
    case 'notify':
      return <NotifyCard index={p.notifyIndex ?? 0} w={p.w} chrome={chrome} />
    case 'menu':
      return <MenuCard w={p.w} h={p.h ?? 218} chrome={chrome} />
    case 'thread':
      return <ThreadCard w={p.w} h={p.h ?? 128} chrome={chrome} />
    case 'threadTall':
      return <ThreadCard w={p.w} h={p.h ?? 348} chrome={chrome} />
    case 'pill':
      return <PillCard w={p.w} h={p.h ?? 52} shadow={shadow} />
    case 'window':
      return <WindowCard w={p.w} h={p.h ?? 196} chrome={chrome} />
    case 'dashboard':
      return <DashboardCard w={p.w} h={p.h ?? 360} chrome={chrome} />
    default:
      return null
  }
}

export type ScatteredCardsV6Props = {
  appearance?: ScatteredCardsAppearance
  placements?: CardPlacementV6[]
  /** Depth-of-field blur on distant cards (foreground stays sharp). */
  blurCards?: boolean
  /** Frosted-glass backdrop on zelios cards (independent of DOF blur). */
  glassEffect?: boolean
  /** Card ids that use light frosted chrome (zelios appearance). */
  lightCardIds?: Set<string>
  /** Per-card scale jitter for scattered layouts. */
  scatterScaleJitter?: boolean
}

export const ScatteredCardsV6: React.FC<ScatteredCardsV6Props> = ({
  appearance = 'light',
  placements = PLACEMENTS_V6,
  blurCards = true,
  glassEffect,
  lightCardIds,
  scatterScaleJitter = false,
}) => {
  const useGlass = glassEffect ?? (appearance === 'zelios')
  const frame = useCurrentFrame()

  return (
    <>
      {placements.map((p) => {
        const start = CARDS_ANIMATION_ORIGIN + p.delay
        if (frame < start - 2) return null

        const enter = interpolate(frame, [start, start + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
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
        const jitter = scatterScaleJitter ? 0.88 + hashOffset(p.id) * 0.22 : 1
        const scale =
          depthScale(d, appearance) *
          jitter *
          interpolate(enterEase, [0, 1], [0.98, 1]) *
          (1 - exit * 0.1)

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
        const blurAmt =
          depthBlur(d, appearance, blurCards) +
          interpolate(enterEase, [0, 1], [blurCards && appearance === 'zelios' ? 8 : blurCards ? 8 : 0, 0]) +
          exit * (blurCards ? 5 : 0)
        const opacity =
          interpolate(enterEase, [0, 1], [0, 1]) * (1 - exit) * depthOpacity(d, appearance, blurCards)

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
            {renderCard(p, appearance, useGlass, lightCardIds)}
          </div>
        )
      })}
    </>
  )
}



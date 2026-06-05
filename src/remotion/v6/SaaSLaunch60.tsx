import React from 'react'
import { AbsoluteFill, Sequence, interpolate, spring } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'

import {
  alphaMaskReveal,
  cursorVisibleAt,
  getCounterPercent,
  getProgress,
  getTypewriterLength,
  slideBlurTransition,
} from './launch/animationSystems'
import { launchSegments } from './launch/sequencePlan'
import {
  LAUNCH_DURATION_FRAMES,
  launchColors,
  launchEasing,
  launchSpacing,
  launchTypography,
} from './launch/styleTokens'

export const SAAS_LAUNCH_60_DURATION = LAUNCH_DURATION_FRAMES

const SegmentBackground: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = Math.sin(frame * 0.008) * 2
  return (
    <AbsoluteFill
      style={{
        background:
          launchColors.pageGradient,
        transform: `translateY(${drift}px)`,
      }}
    />
  )
}

const GlassCard: React.FC<{
  style?: React.CSSProperties
  children: React.ReactNode
}> = ({ style, children }) => (
  <div
    style={{
      background: launchColors.glassBg,
      border: `1px solid ${launchColors.glassStroke}`,
      borderRadius: launchSpacing.cardRadius,
      boxShadow: launchColors.glassShadow,
      backdropFilter: 'blur(10px)',
      ...style,
    }}
  >
    {children}
  </div>
)

const TypewriterPrompt: React.FC<{ frame: number }> = ({ frame }) => {
  const prompt = 'Generate a self-optimizing onboarding workflow for enterprise teams.'
  const cursorLead = 24
  const typeStart = 60
  const chars = getTypewriterLength(frame, typeStart, 160, prompt.length)
  const blink = cursorVisibleAt(frame)

  const cardIn = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: launchEasing.standard,
  })
  const scale = interpolate(cardIn, [0, 1], [1.04, 1], { extrapolateRight: 'clamp' })

  return (
    <GlassCard
      style={{
        width: 1120,
        height: 300,
        margin: '0 auto',
        marginTop: 260,
        opacity: cardIn,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ padding: '34px 40px' }}>
        <div
          style={{
            fontFamily: launchTypography.family,
            fontSize: launchTypography.labelSize,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#4B6DA9',
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          AI Command Console
        </div>
        <div
          style={{
            borderRadius: 16,
            border: '1px solid rgba(105, 140, 201, 0.25)',
            background: 'rgba(245,250,255,0.85)',
            minHeight: 156,
            padding: '22px 24px',
            fontFamily: launchTypography.family,
            fontSize: 32,
            letterSpacing: '-0.02em',
            lineHeight: 1.35,
            color: launchColors.primaryText,
          }}
        >
          {frame < cursorLead ? '' : prompt.slice(0, chars)}
          {(frame < typeStart || chars < prompt.length) && blink ? (
            <span style={{ color: launchColors.accentBlue, marginLeft: 2 }}>|</span>
          ) : null}
        </div>
      </div>
    </GlassCard>
  )
}

const WorkflowBuilder: React.FC<{ frame: number }> = ({ frame }) => {
  const handoff = slideBlurTransition(frame, 0, 16, 64)

  const stepDelay = [24, 44, 64, 84]
  return (
    <div
      style={{
        opacity: handoff.opacity,
        transform: `translateX(${handoff.translateX}px)`,
        margin: '0 auto',
        width: 1300,
        marginTop: 180,
        filter: `blur(${handoff.blur}px)`,
      }}
    >
      <GlassCard style={{ padding: 28, height: 700 }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#173A6A', fontSize: 24 }}>
          Workflow Builder
        </div>
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {['Input', 'Route', 'Enrich', 'Deploy'].map((label, i) => {
            const reveal = alphaMaskReveal(frame, stepDelay[i], 18)
            return (
              <div
                key={label}
                style={{
                  height: 180,
                  borderRadius: 16,
                  border: '1px solid rgba(109, 146, 211, 0.25)',
                  background: 'rgba(242,248,255,0.88)',
                  transform: `scaleY(${reveal.scaleY})`,
                  transformOrigin: 'center bottom',
                  opacity: reveal.opacity,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div style={{ padding: '14px 16px', fontFamily: 'Inter, sans-serif', color: '#214A84', fontWeight: 600 }}>
                  {label}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 16,
                    height: 8,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #93C5FD, #2563EB)',
                    opacity: 0.75,
                  }}
                />
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}

const DataLoad: React.FC<{ frame: number }> = ({ frame }) => {
  const loadStart = 24
  const loadEnd = 210
  const pct = getCounterPercent(frame, loadStart, loadEnd)
  const barW = getProgress(frame, loadStart, loadEnd) * 100
  return (
    <div style={{ width: 1200, margin: '0 auto', marginTop: 250 }}>
      <GlassCard style={{ padding: 34 }}>
        <div style={{ fontFamily: launchTypography.family, fontSize: launchTypography.headingSize, fontWeight: 700, color: '#113162' }}>
          Live Intelligence Processing
        </div>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: 24, height: 14, borderRadius: 999, background: '#DCEBFF', overflow: 'hidden' }}>
            <div
              style={{
                width: `${barW}%`,
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #60A5FA, #2563EB)',
              }}
            />
          </div>
          <div style={{ fontFamily: launchTypography.family, fontSize: 44, color: launchColors.accentBlueDeep, fontWeight: 700, width: 140, textAlign: 'right' }}>
            {pct}%
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

const ModuleGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const modules = ['Tickets', 'Automation', 'Forecast', 'Settings']
  return (
    <div style={{ width: 1320, margin: '0 auto', marginTop: 160 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        {modules.map((mod, i) => {
          const start = 18 + i * 10
          const inP = interpolate(frame, [start, start + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: launchEasing.revealSnap,
          })
          return (
            <GlassCard
              key={mod}
              style={{
                padding: 24,
                height: 260,
                opacity: inP,
                transform: `translateY(${interpolate(inP, [0, 1], [22, 0])}px) scale(${interpolate(inP, [0, 1], [0.96, 1])})`,
              }}
            >
              <div style={{ fontFamily: launchTypography.family, color: '#1B3E72', fontWeight: 700, fontSize: 26 }}>{mod}</div>
              <div style={{ marginTop: 18, height: 140, borderRadius: 14, background: 'linear-gradient(160deg, rgba(147,197,253,0.35), rgba(255,255,255,0.7))' }} />
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}

const UnifiedFlow: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig()
  const zoom = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 200, stiffness: 78, mass: 1 },
  })
  const scale = interpolate(zoom, [0, 1], [1.1, 1], { extrapolateRight: 'clamp' })
  const panX = interpolate(frame, [40, 180], [80, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const items = ['Input', 'Process', 'Outcome']
  return (
    <div style={{ width: 1320, margin: '0 auto', marginTop: 280, transform: `translateX(${panX}px) scale(${scale})` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {items.map((item, i) => {
          const reveal = interpolate(frame, [18 + i * 20, 34 + i * 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: launchEasing.standard,
          })
          return (
            <GlassCard key={item} style={{ height: 220, padding: 20, opacity: reveal, transform: `scale(${interpolate(reveal, [0, 1], [0.92, 1])})` }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1E3A66', fontSize: 24 }}>{item}</div>
              <div style={{ marginTop: 14, height: 130, borderRadius: 12, background: 'rgba(147,197,253,0.22)' }} />
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}

const Closing: React.FC<{ frame: number }> = ({ frame }) => {
  const tagline = 'Modern AI Infrastructure for High-velocity Teams'
  const startType = 34
  const chars = Math.floor(
    interpolate(frame, [startType, startType + 120], [0, tagline.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: launchEasing.standard,
    }),
  )
  const inP = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: launchEasing.standard,
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: inP,
      }}
    >
      <GlassCard style={{ width: 1180, padding: '44px 54px', textAlign: 'center' }}>
        <div style={{ fontFamily: launchTypography.family, fontSize: launchTypography.heroSize, fontWeight: 800, color: '#103367' }}>TUTIFY</div>
        <div style={{ marginTop: 22, fontFamily: launchTypography.family, fontSize: 30, color: launchColors.secondaryText, minHeight: 42 }}>
          {tagline.slice(0, chars)}
        </div>
        <div
          style={{
            marginTop: 28,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '14px 26px',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${launchColors.accentBlue}, ${launchColors.accentBlueDeep})`,
            color: '#fff',
            fontFamily: launchTypography.family,
            fontWeight: 700,
            boxShadow: '0 10px 28px rgba(37,99,235,0.25)',
            transform: `scale(${interpolate(frame, [130, 148], [1, 1.04], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })})`,
          }}
        >
          Book a Demo
        </div>
      </GlassCard>
    </AbsoluteFill>
  )
}

export const SaaSLaunch60: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <SegmentBackground frame={frame} />

      <Sequence from={launchSegments[0]!.startFrame} durationInFrames={launchSegments[0]!.durationInFrames}>
        <TypewriterPrompt frame={frame} />
      </Sequence>

      <Sequence from={launchSegments[1]!.startFrame} durationInFrames={launchSegments[1]!.durationInFrames}>
        <WorkflowBuilder frame={frame - launchSegments[1]!.startFrame} />
      </Sequence>

      <Sequence from={launchSegments[2]!.startFrame} durationInFrames={launchSegments[2]!.durationInFrames}>
        <DataLoad frame={frame - launchSegments[2]!.startFrame} />
      </Sequence>

      <Sequence from={launchSegments[3]!.startFrame} durationInFrames={launchSegments[3]!.durationInFrames}>
        <ModuleGrid frame={frame - launchSegments[3]!.startFrame} />
      </Sequence>

      <Sequence from={launchSegments[4]!.startFrame} durationInFrames={launchSegments[4]!.durationInFrames}>
        <UnifiedFlow frame={frame - launchSegments[4]!.startFrame} />
      </Sequence>

      <Sequence from={launchSegments[5]!.startFrame} durationInFrames={launchSegments[5]!.durationInFrames}>
        <Closing frame={frame - launchSegments[5]!.startFrame} />
      </Sequence>
    </AbsoluteFill>
  )
}

export default SaaSLaunch60

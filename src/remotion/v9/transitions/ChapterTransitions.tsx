/**
 * V9 chapter transition overlays — unique motion per major section handoff.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

type TransitionProps = {
  durationInFrames: number
}

/** Teaching → Education: pixel grid dissolve as next phase enters */
export const TeachingToEducationTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  const gridStep = interpolate(p, [0, 0.45, 1], [72, 28, 10], { extrapolateRight: 'clamp' })
  const gridOpacity = interpolate(p, [0, 0.2, 0.65, 1], [0, 0.55, 0.35, 0], {
    extrapolateRight: 'clamp',
  })
  const coolReveal = interpolate(p, [0.15, 0.85], [0, 0.42], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)
          `,
          backgroundSize: `${gridStep}px ${gridStep}px`,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: coolReveal,
          background: `
            radial-gradient(ellipse 85% 70% at 50% 105%, rgba(10, 42, 107, 0.75) 0%, transparent 58%),
            linear-gradient(180deg, transparent 0%, rgba(30, 79, 184, 0.35) 100%)
          `,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: interpolate(p, [0.35, 0.75, 1], [0, 0.35, 0], { extrapolateRight: 'clamp' }),
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 55%)',
          transform: `scale(${interpolate(p, [0.35, 1], [1.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
        }}
      />
    </AbsoluteFill>
  )
}

/** Opening → Vision: parallax depth + DOF blur sweep */
export const OpeningToVisionTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  const blur = interpolate(p, [0, 0.5, 1], [0, 14, 0], { extrapolateRight: 'clamp' })
  const sweepX = interpolate(p, [0, 1], [-40, 140], { extrapolateRight: 'clamp' })
  const whiteFlash = interpolate(p, [0, 0.05, 0.2, 0.45, 1], [0, 0.9, 0.45, 0.08, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
      {whiteFlash > 0.03 ? (
        <AbsoluteFill
          style={{
            background: `rgba(255,255,255,${whiteFlash * 0.9})`,
            opacity: whiteFlash,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0, 0.35, 1], [0, 0.35, 0], { extrapolateRight: 'clamp' }),
          backdropFilter: blur > 0.5 ? `blur(${blur}px)` : undefined,
          WebkitBackdropFilter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 48%, transparent 100%)`,
          transform: `translateX(${sweepX}%)`,
          opacity: interpolate(p, [0, 0.25, 0.75, 1], [0, 0.9, 0.6, 0], {
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  )
}

/** Vision → Meet: particle dissolve + camera push */
export const VisionToMeetTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2
    const r = interpolate(p, [0, 1], [0, 420 + (i % 5) * 40], { extrapolateRight: 'clamp' })
    return {
      x: 960 + Math.cos(angle) * r,
      y: 540 + Math.sin(angle) * r * 0.6,
      op: interpolate(p, [0, 0.2, 0.8, 1], [0, 0.85, 0.5, 0], { extrapolateRight: 'clamp' }),
      size: 3 + (i % 4),
    }
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
      {particles.map((pt, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pt.x,
            top: pt.y,
            width: pt.size,
            height: pt.size,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#5B4FCF' : '#2563EB',
            opacity: pt.op,
            boxShadow: '0 0 12px rgba(91,79,207,0.45)',
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0, 0.4, 1], [0, 0.2, 0], { extrapolateRight: 'clamp' }),
          background: 'radial-gradient(circle at 50% 50%, rgba(91,79,207,0.25), transparent 70%)',
          transform: `scale(${interpolate(p, [0, 1], [1, 1.06], { extrapolateRight: 'clamp' })})`,
        }}
      />
    </AbsoluteFill>
  )
}

/** Meet → AI Teacher: glass light sweep */
export const MeetToAITransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  const sweep = interpolate(p, [0, 1], [-30, 130], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)`,
          transform: `translateX(${sweep}%) skewX(-12deg)`,
          opacity: interpolate(p, [0, 0.3, 0.7, 1], [0, 0.95, 0.7, 0], { extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  )
}

/** AI Teacher → Image Studio: workflow connector wipe */
export const AIToImageTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const lineW = interpolate(p, [0, 0.6, 1], [0, 100, 100], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: `${lineW}%`,
          height: 3,
          borderRadius: 999,
          background: 'linear-gradient(90deg, #5B4FCF, #0D9488, #2563EB)',
          boxShadow: '0 0 24px rgba(91,79,207,0.35)',
          opacity: interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], { extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  )
}

/** Image → YouTube: canvas expand flash */
export const ImageToYouTubeTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scale = interpolate(p, [0, 0.5, 1], [0.92, 1.04, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 50,
        transform: `scale(${scale})`,
        opacity: interpolate(p, [0, 0.2, 0.8, 1], [0, 0.25, 0.15, 0], { extrapolateRight: 'clamp' }),
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(249,115,22,0.2), transparent 70%)',
      }}
    />
  )
}

/** YouTube Fun Studio intro → quiz demo: counterclockwise rotate handoff */
export const YouTubeIntroToQuizTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  const spin = interpolate(p, [0, 1], [0, -22], { extrapolateRight: 'clamp' })
  const ringScale = interpolate(p, [0, 0.55, 1], [0.65, 1.05, 1.35], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 200, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0, 0.25, 0.75, 1], [0, 0.35, 0.28, 0], {
            extrapolateRight: 'clamp',
          }),
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(249,115,22,0.22) 0%, transparent 72%)',
          transform: `rotate(${spin}deg) scale(${interpolate(p, [0, 1], [1.02, 1.08], { extrapolateRight: 'clamp' })})`,
        }}
      />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 920,
            height: 520,
            borderRadius: 28,
            border: '2px solid rgba(249,115,22,0.45)',
            transform: `rotate(${spin * 0.6}deg) scale(${ringScale})`,
            opacity: interpolate(p, [0, 0.2, 0.8, 1], [0, 0.75, 0.4, 0], { extrapolateRight: 'clamp' }),
            boxShadow: '0 0 80px rgba(249,115,22,0.25)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0.4, 1], [0, 0.5], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          background:
            'radial-gradient(circle at 50% 50%, transparent 0%, rgba(15,23,42,0.35) 100%)',
        }}
      />
    </AbsoluteFill>
  )
}

/** YouTube → Personalization: data stream vertical flow */
export const YouTubeToPersoTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${12 + i * 11}%`,
            top: interpolate(p, [0, 1], [110, -20], { extrapolateRight: 'clamp' }) + '%',
            width: 2,
            height: 120,
            background: 'linear-gradient(180deg, transparent, #38BDF8, transparent)',
            opacity: 0.5 + (i % 3) * 0.15,
          }}
        />
      ))}
    </AbsoluteFill>
  )
}

/** Personalization → Learning Hub: closed bracket portal zoom-through */
export const PersoToHubTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  const portalOpen = interpolate(p, [0, 0.42, 1], [0.08, 0.55, 1.35], { extrapolateRight: 'clamp' })
  const ringOpacity = interpolate(p, [0, 0.2, 0.7, 1], [0.9, 0.75, 0.35, 0], {
    extrapolateRight: 'clamp',
  })
  const coreFlash = interpolate(p, [0, 0.25, 0.55, 1], [0.7, 0.5, 0.2, 0], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(248,250,252,${coreFlash * 0.55}) 0%, rgba(56,189,248,${coreFlash * 0.25}) 18%, transparent 58%)`,
          transform: `scale(${interpolate(p, [0, 0.5, 1], [2.8, 1.15, 1], { extrapolateRight: 'clamp' })})`,
          opacity: coreFlash,
        }}
      />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 720,
            height: 220,
            borderRadius: 14,
            border: '3px solid rgba(56,189,248,0.9)',
            transform: `scale(${portalOpen})`,
            opacity: ringOpacity,
            boxShadow: '0 0 80px rgba(56,189,248,0.45), inset 0 0 40px rgba(56,189,248,0.15)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(6,13,24,0.55) 100%)',
          opacity: interpolate(p, [0.35, 1], [0, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  )
}

/** Learning Hub → Ecosystem: network pulse */
export const HubToEcosystemTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ring = interpolate(p, [0, 1], [0.3, 1.8], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 800,
          height: 800,
          borderRadius: '50%',
          border: '2px solid rgba(91,79,207,0.35)',
          transform: `scale(${ring})`,
          opacity: interpolate(p, [0, 0.5, 1], [0.8, 0.4, 0], { extrapolateRight: 'clamp' }),
          boxShadow: '0 0 60px rgba(91,79,207,0.2)',
        }}
      />
    </AbsoluteFill>
  )
}

/** Ecosystem → Closing: fast portal wash (closing zoom handled by ClosingZoomEnter) */
export const EcosystemToClosingTransition: React.FC<TransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const portalScale = interpolate(p, [0, 1], [0.55, 2.4], { extrapolateRight: 'clamp' })
  const washOpacity = interpolate(p, [0, 0.4, 1], [0.88, 0.45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
      <AbsoluteFill
        style={{
          transform: `scale(${portalScale})`,
          transformOrigin: '50% 47%',
          background:
            'radial-gradient(circle at 50% 47%, rgba(255,255,255,0.94) 0%, rgba(224,231,255,0.5) 30%, transparent 60%)',
          opacity: washOpacity,
        }}
      />
    </AbsoluteFill>
  )
}

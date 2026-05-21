/**
 * Beat 09 — The Invitation (240 frames / 8 s)
 * Global: 2577–2817
 * Type: B — Bold Brand Wash (second and final use)
 *
 * Visual intent: "How do I get it?"
 * The frame that lives in memory. Full-screen sky→mint gradient.
 * Logo. Tagline. CTA button. URL. Then: complete stillness.
 * The silence after this frame IS the applause.
 *
 * Local frame map:
 *   0–60    Tutify wordmark springs in (scale 0.92→1.0, blur 8→0)
 *   30–90   Tagline fades in below logo
 *   90–150  "Book a Demo" CTA button appears with pulse
 *   120–180 "www.tutify.co" URL fades in
 *   180–240 COMPLETE STILLNESS — logo + tagline + button + URL held
 *            Only particles drift. Music resolves. This is the finish.
 */
import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Sora'
import { BeatTransition } from '../components/BeatTransition'
import { SoftParticles } from '../components/SoftParticles'

const { fontFamily: soraFont } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})

export const BEAT09_DURATION = 240

const SETTLE = { damping: 200, stiffness: 100, mass: 1 } as const

export const Beat09_TheInvitation: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // ── Tutify wordmark (0–240) ───────────────────────────────────────────────
  const wmS = spring({ frame, fps, config: SETTLE, durationInFrames: 50 })
  const wmScale = interpolate(wmS, [0, 1], [0.92, 1.0])
  const wmOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const wmBlur = interpolate(wmS, [0, 1], [8, 0])

  // Soft white glow halo — grows in with logo
  const haloOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Tagline (30–240) ──────────────────────────────────────────────────────
  const tagS = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: SETTLE,
    durationInFrames: 40,
  })
  const tagY = interpolate(tagS, [0, 1], [18, 0])
  const tagOpacity = interpolate(frame, [30, 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── CTA button (90–240) ───────────────────────────────────────────────────
  const btnS = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: SETTLE,
    durationInFrames: 35,
  })
  const btnY = interpolate(btnS, [0, 1], [14, 0])
  const btnOpacity = interpolate(frame, [90, 112], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // Gentle continuous pulse on button glow
  const btnPulse = 0.5 + 0.5 * Math.sin(frame * (2 * Math.PI / 70))

  // ── URL (120–240) ─────────────────────────────────────────────────────────
  const urlOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Ambient centre glow pulse ─────────────────────────────────────────────
  const glowPulse = 1 + 0.05 * Math.sin(frame * (2 * Math.PI / 150))

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, #2A8EEB 0%, #3B9EFF 32%, #44BFAB 68%, #5DD4B5 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── Centre glow ───────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 1100px 860px at 50% 46%,
            rgba(255,255,255,${0.16 * glowPulse}) 0%,
            rgba(255,255,255,0.04) 50%,
            transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Corner vignette ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 118% 118% at 50% 50%, transparent 54%, rgba(8,44,92,0.24) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Noise grain 6% ────────────────────────────────────────────── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
        <defs>
          <filter id="b09grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="37" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="1920" height="1080" filter="url(#b09grain)" />
      </svg>

      {/* ── Particles — slower drift, more peaceful than Beat 03 ─────── */}
      <SoftParticles
        count={22}
        colors={[
          'rgba(255,255,255,0.18)',
          'rgba(255,255,255,0.28)',
          'rgba(255,255,255,0.10)',
          'rgba(200,240,255,0.16)',
        ]}
        width={1920}
        height={1080}
      />

      {/* ── Soft halo behind wordmark ──────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 900,
          height: 350,
          transform: 'translate(-50%, -70%)',
          background:
            'radial-gradient(ellipse 420px 180px at 50% 50%, rgba(255,255,255,0.14) 0%, transparent 72%)',
          pointerEvents: 'none',
          opacity: haloOpacity,
        }}
      />

      {/* ── Brand content — centred column ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            opacity: wmOpacity,
            transform: `scale(${wmScale})`,
            filter: `blur(${wmBlur}px)`,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 140,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.034em',
              lineHeight: 1,
              display: 'block',
              textShadow: '0 6px 48px rgba(8,44,92,0.16)',
            }}
          >
            Tutify
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            marginBottom: 48,
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 36,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.86)',
              letterSpacing: '0.006em',
              display: 'block',
            }}
          >
            Education, reimagined.
          </span>
        </div>

        {/* CTA button */}
        <div
          style={{
            opacity: btnOpacity,
            transform: `translateY(${btnY}px)`,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 999,
              padding: '16px 44px',
              boxShadow: `0 4px 24px rgba(255,255,255,${0.30 + 0.18 * btnPulse}), 0 2px 8px rgba(255,255,255,0.20)`,
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontFamily: soraFont,
                fontSize: 22,
                fontWeight: 700,
                color: '#3B9EFF',
                letterSpacing: '-0.01em',
              }}
            >
              Book a Demo
            </span>
          </div>
        </div>

        {/* URL */}
        <div style={{ opacity: urlOpacity }}>
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 24,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.60)',
              letterSpacing: '0.02em',
            }}
          >
            www.tutify.co
          </span>
        </div>
      </div>

      {/* No closing fade — this is the last frame. It holds. */}
      <BeatTransition beatDuration={BEAT09_DURATION} openingFade closingFade={false} />
    </AbsoluteFill>
  )
}

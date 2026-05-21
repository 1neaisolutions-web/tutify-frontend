/**
 * Beat 03 — The Promise (396 frames / ~13.2 s)
 * Global: 621–1017
 * Type: B — Golden hour bridge → full brand gradient sunrise
 *
 * Visual intent: "Wait, what's this?" → quiet gasp.
 * The most dramatic moment in the video. Dark teacher image
 * → golden clock → sky/mint brand gradient → Tutify.
 *
 * Local frame map:
 *   0–90    "Clock at 900 (Golden Hour).png" emerges (the sunrise)
 *   90–150  Golden image fades out, sky→mint gradient takes over
 *   150–240 Tutify wordmark materialises (blur 10→0, spring scale)
 *   240–330 Tagline slides up: "Education, reimagined."
 *   330–396 Full hold — breathing scale on logo — particles drift
 */
import React from 'react'
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Sora'
import { BeatTransition } from '../components/BeatTransition'
import { SoftParticles } from '../components/SoftParticles'
import { IMG } from '../assets'

const { fontFamily: soraFont } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})

export const BEAT03_DURATION = 396

const SETTLE = { damping: 200, stiffness: 100, mass: 1 } as const

export const Beat03_ThePromise: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Breathing — gentle 5-second sine cycle
  const breathe = 1 + 0.006 * Math.sin(frame * (2 * Math.PI / 150))

  // Camera push-in across the full beat
  const cameraScale = interpolate(frame, [0, BEAT03_DURATION], [1.0, 1.018], {
    extrapolateRight: 'clamp',
  })

  // ── Golden hour image (0–150) ────────────────────────────────────────────
  // Fades in from 0–30 (as white-wash clears), then fades out 90–150
  const goldenOpacity = interpolate(frame, [0, 30, 90, 150], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // Gentle settle — image drifts into position
  const goldenScale = interpolate(frame, [0, 120], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Gradient presence — fades in as image fades out ──────────────────────
  // Already present at 0 (behind image), fully revealed by frame 150
  const gradientOpacity = interpolate(frame, [60, 150], [0.2, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Ambient centre glow pulse ─────────────────────────────────────────────
  const glowPulse = 1 + 0.06 * Math.sin(frame * (2 * Math.PI / 150))

  // ── Tutify wordmark (150–396) ─────────────────────────────────────────────
  const wmS = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: SETTLE,
    durationInFrames: 55,
  })
  const wmScale = interpolate(wmS, [0, 1], [0.88, 1.0])
  const wmOpacity = interpolate(frame, [150, 178], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const wmBlur = interpolate(wmS, [0, 1], [10, 0])
  // Breathing starts once logo is settled (frame 220+)
  const wmScale2 = frame >= 220 ? wmScale * breathe : wmScale

  // ── Tagline (240–396) ─────────────────────────────────────────────────────
  const tagS = spring({
    frame: Math.max(0, frame - 240),
    fps,
    config: SETTLE,
    durationInFrames: 45,
  })
  const tagY = interpolate(tagS, [0, 1], [22, 0])
  const tagOpacity = interpolate(frame, [240, 264], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#1A4A7A' }}>

      {/* ── Sky→mint diagonal gradient — always underneath ──────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, #2A8EEB 0%, #3B9EFF 32%, #44BFAB 68%, #5DD4B5 100%)',
          opacity: gradientOpacity,
        }}
      />

      {/* Camera scale wrapper — push-in effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* ── Bright centre glow ─────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 1050px 820px at 50% 46%,
              rgba(255,255,255,${0.17 * glowPulse}) 0%,
              rgba(255,255,255,0.04) 50%,
              transparent 68%)`,
            pointerEvents: 'none',
            opacity: gradientOpacity,
          }}
        />

        {/* ── Cinematic corner vignette ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 118% 118% at 50% 50%, transparent 54%, rgba(8, 44, 92, 0.26) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Noise grain (6%) — kills the CSS-gradient look ────────────── */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.06,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <filter id="b03grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="15" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="1920" height="1080" filter="url(#b03grain)" />
        </svg>

        {/* ── White particles — light motes ─────────────────────────────── */}
        <div style={{ opacity: gradientOpacity }}>
          <SoftParticles
            count={28}
            colors={[
              'rgba(255,255,255,0.22)',
              'rgba(255,255,255,0.34)',
              'rgba(255,255,255,0.12)',
              'rgba(200,240,255,0.20)',
            ]}
            width={1920}
            height={1080}
          />
        </div>

        {/* ── Soft halo behind wordmark ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 960,
            height: 400,
            transform: 'translate(-50%, -60%)',
            background:
              'radial-gradient(ellipse 460px 200px at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 72%)',
            pointerEvents: 'none',
            opacity: wmOpacity,
          }}
        />

        {/* ── Tutify wordmark + tagline ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -54%) scale(${wmScale2})`,
            transformOrigin: 'center center',
            opacity: wmOpacity,
            filter: `blur(${wmBlur}px)`,
            textAlign: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 200,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.034em',
              lineHeight: 1,
              display: 'block',
              textShadow: '0 6px 48px rgba(8, 44, 92, 0.18)',
            }}
          >
            Tutify
          </span>

          <div
            style={{
              marginTop: 26,
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: soraFont,
                fontSize: 46,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.86)',
                letterSpacing: '0.008em',
                lineHeight: 1,
                display: 'block',
              }}
            >
              Education, reimagined.
            </span>
          </div>
        </div>
      </div>

      {/* ── Golden hour image overlay — the sunrise bridge ──────────────── */}
      {/* Positioned ABOVE camera wrapper so it covers gradient during reveal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: goldenOpacity,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <Img
          src={IMG.clockGoldenHour}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: `scale(${goldenScale})`,
            filter: 'brightness(1.1) saturate(1.15)',
            display: 'block',
          }}
        />
        {/* Warm golden overlay on image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,200,80,0.12)',
          }}
        />
        {/* Vignette — pulls attention centre */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(20,10,0,0.55) 100%)',
          }}
        />
      </div>

      <BeatTransition beatDuration={BEAT03_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

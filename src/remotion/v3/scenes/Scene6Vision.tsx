import React from 'react'
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import futureClassroom from '../future-classroom.png'
import teacherHero from '../teacher-hero.png'
import { KineticText } from '../components/KineticText'
import { ParticleField } from '../components/ParticleField'

export const SCENE6_DURATION = 240

export const Scene6Vision: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const openOp = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Phase 1: 0–148 — vision text over future classroom
  const phase1Op = interpolate(frame, [128, 152], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Ken Burns on classroom image
  const imgScale = interpolate(frame, [0, 148], [1.0, 1.07], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Phase 2: 140–240 — brand close
  const phase2Op = interpolate(frame, [138, 162], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Hero image slide-in
  const heroOp = interpolate(frame, [144, 168], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const heroX  = interpolate(frame, [144, 168], [55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Wordmark spring entrance
  const logoP = spring({ frame: Math.max(0, frame - 152), fps, config: { damping: 80, stiffness: 220 } })
  const logoOp = interpolate(logoP, [0, 1], [0, 1])
  const logoS  = interpolate(logoP, [0, 1], [0.88, 1])

  // Tagline + CTA
  const tagOp  = interpolate(frame, [172, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ctaOp  = interpolate(frame, [194, 214], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ctaY   = interpolate(frame, [194, 214], [22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // CTA pulse glow
  const ctaGlow = 0.28 + Math.sin(frame / 22) * 0.1

  return (
    <AbsoluteFill style={{ background: '#07080F', overflow: 'hidden', opacity: openOp }}>

      {/* ── PHASE 1: Future classroom + Vision text ───────────────────── */}
      <AbsoluteFill style={{ opacity: phase1Op }}>
        {/* Background image */}
        <AbsoluteFill style={{ transform: `scale(${imgScale})`, transformOrigin: 'center center' }}>
          <Img src={futureClassroom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>

        {/* Overlays for text legibility */}
        <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(7,8,15,0.92) 0%, rgba(7,8,15,0.42) 50%, rgba(7,8,15,0.18) 100%)' }} />
        <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(7,8,15,0.7) 0%, transparent 50%)' }} />

        {/* Vision narration — bottom left */}
        <div style={{ position: 'absolute', bottom: 120, left: 100, maxWidth: 820 }}>
          <div style={{ marginBottom: 18 }}>
            <KineticText text="Not replacing teachers." mode="fade-up" startFrame={14} fontSize={72} fontWeight={700} color="#F8FAFC" letterSpacing="-0.04em" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <KineticText text="Empowering them." mode="fade-up" startFrame={52} fontSize={72} fontWeight={700} color="#38BDF8" letterSpacing="-0.04em" />
          </div>
          <div>
            <KineticText text="This is the future of education." mode="fade-up" startFrame={92} fontSize={40} fontWeight={400} color="rgba(248,250,252,0.62)" letterSpacing="-0.015em" />
          </div>
        </div>
      </AbsoluteFill>

      {/* ── PHASE 2: Brand close ──────────────────────────────────────── */}
      <AbsoluteFill style={{ opacity: phase2Op, background: '#07080F' }}>
        {/* Gradient accent */}
        <AbsoluteFill style={{
          background: 'radial-gradient(ellipse at 58% 50%, rgba(56,189,248,0.09) 0%, transparent 62%)',
        }} />

        <ParticleField count={24} color1="#38BDF8" color2="#34D399" />

        {/* Teacher hero — right side */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 700,
          opacity: heroOp, transform: `translateX(${heroX}px)`,
        }}>
          <Img src={teacherHero} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          {/* Fade left edge into dark */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #07080F 0%, rgba(7,8,15,0.5) 30%, transparent 55%)' }} />
          {/* Fade bottom */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #07080F 0%, transparent 30%)' }} />
        </div>

        {/* Brand content — left */}
        <div style={{ position: 'absolute', top: '50%', left: 110, transform: 'translateY(-50%)', maxWidth: 730 }}>
          {/* Tutify wordmark */}
          <div style={{
            opacity: logoOp,
            transform: `scale(${logoS})`,
            transformOrigin: 'left center',
            marginBottom: 30,
          }}>
            <div style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: '-0.055em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #F8FAFC 0%, #38BDF8 55%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>tutify</div>
          </div>

          {/* Tagline */}
          <div style={{ opacity: tagOp, marginBottom: 42 }}>
            <KineticText
              text="Education, reimagined."
              mode="fade-up"
              startFrame={172}
              fontSize={36}
              fontWeight={400}
              color="rgba(248,250,252,0.65)"
              letterSpacing="-0.01em"
            />
          </div>

          {/* CTA */}
          <div style={{
            opacity: ctaOp,
            transform: `translateY(${ctaY}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            flexWrap: 'wrap',
          }}>
            <div style={{
              padding: '18px 44px',
              background: 'linear-gradient(135deg, #38BDF8 0%, #34D399 100%)',
              borderRadius: 14,
              fontFamily: '"Sora", sans-serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#07080F',
              letterSpacing: '-0.01em',
              boxShadow: `0 0 48px rgba(56,189,248,${ctaGlow}), 0 8px 24px rgba(56,189,248,0.2)`,
            }}>
              Join the future of learning
            </div>

            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 18,
              color: 'rgba(248,250,252,0.38)',
              letterSpacing: '0.03em',
            }}>
              tutify.co
            </div>
          </div>
        </div>

        {/* Bottom tagline strip */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          left: 110,
          opacity: interpolate(frame, [218, 236], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px rgba(56,189,248,0.8)' }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: 'rgba(248,250,252,0.32)', letterSpacing: '0.06em' }}>
            © 2025 Tutify · AI-Powered Teaching Platform
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

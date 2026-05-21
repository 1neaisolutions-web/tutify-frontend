/**
 * Beat 04 — The Magic Moment (hero beat, 360 frames / 12 s)
 * Global timeline: 1017–1377
 * Type: C (Product Hero)
 *
 * Emotional intent: "Oh." — the moment a principal leans forward.
 *
 * Local frame map:
 *   0–45    Input card springs in (white-box entrance)
 *   45–80   Card header materialises (icon + title + subtitle)
 *   70–88   Input field fades in
 *   80–232  Typewriter: "students who won't stay in their seats"
 *   180–210 Generate button fades in with continuous pulse
 *   210–230 Button click: compress → spring back + sky glow burst
 *   230–360 Output document builds (4 sections, 12-frame stagger)
 *   270–360 Caption: "From challenge to classroom — in seconds."
 *   330–360 Full hold, breathing scale on caption
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
import { theme } from '../theme'
import { BeatTransition } from '../components/BeatTransition'

const { fontFamily: soraFont } = loadFont('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
})

export const BEAT04_DURATION = 360

const ENTER = { damping: 200, stiffness: 100, mass: 1 } as const

const INPUT_TEXT = "students who won't stay in their seats"

const SECTIONS = [
  {
    heading: 'Management Solutions',
    color: theme.colors.skyBlue,
    bullets: ['Assigned seating chart', 'Visual seating cues', 'Movement break system'],
  },
  {
    heading: 'Seating Strategy',
    color: theme.colors.mint,
    bullets: ['U-shape near teacher desk', 'Pair with focused peers'],
  },
  {
    heading: 'Why This Works',
    color: theme.colors.lavender,
    bullets: ['Reduces social distractions', 'Increases teacher proximity'],
  },
  {
    heading: 'Implementation',
    color: theme.colors.coral,
    bullets: ['Day 1: Introduce new chart', 'Week 1: Adjust as needed'],
  },
]

// Layout constants — tuned for 1920×1080
const CARD_WIDTH = 880
const INPUT_CARD_TOP = 240
const OUTPUT_CARD_TOP = 520  // input_top(240) + input_height(~250) + gap(30)

export const Beat04_MagicMoment: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Breathing: 0.5% amplitude, 4-second sine cycle
  const breathe = 1 + 0.005 * Math.sin(frame * (2 * Math.PI / 120))

  // Camera push-in: scale 1.0 → 1.015 over the full beat
  const cameraScale = interpolate(frame, [0, BEAT04_DURATION], [1.0, 1.015], {
    extrapolateRight: 'clamp',
  })

  // ── Input card entrance (0–45) ────────────────────────────────────────────
  const cardEntS = spring({ frame, fps, config: ENTER, durationInFrames: 45 })
  const cardScale = interpolate(cardEntS, [0, 1], [0.94, 1.0])
  const cardOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Card header materialise (45–80) ──────────────────────────────────────
  const headerS = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: ENTER,
    durationInFrames: 35,
  })
  const headerOpacity = interpolate(frame, [45, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const headerY = interpolate(headerS, [0, 1], [10, 0])

  // ── Input section reveal (70–88) ─────────────────────────────────────────
  const inputSectionOpacity = interpolate(frame, [70, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Typewriter (80–232, 1 char per 4 frames ≈ 7.5 chars/s) ──────────────
  const charsVisible = Math.max(0, Math.floor((frame - 80) / 4))
  const typedText = INPUT_TEXT.slice(0, charsVisible)
  const isTyping = frame >= 80 && charsVisible <= INPUT_TEXT.length
  // 0.3-second blink cycle
  const cursorBlink = Math.sin(frame * (2 * Math.PI / 9)) > 0
  // Input field highlights once typing starts
  const isActive = frame >= 80

  // ── Generate button (180–210) ─────────────────────────────────────────────
  const btnOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // Continuous gentle glow pulse for the button
  const btnPulse = 0.5 + 0.5 * Math.sin(frame * (2 * Math.PI / 60))

  // ── Button click (210–235) ────────────────────────────────────────────────
  // Snappy compress-and-spring-back spring
  const clickS = spring({
    frame: Math.max(0, frame - 210),
    fps,
    config: { damping: 18, stiffness: 500, mass: 0.6 },
    durationInFrames: 25,
  })
  const isClicking = frame >= 210 && frame <= 240
  const btnScale = isClicking
    ? interpolate(clickS, [0, 0.4, 1], [1.0, 0.95, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1.0

  // Sky glow burst — flares briefly on click then fades
  const glowBurstOpacity = interpolate(
    frame,
    [210, 216, 232],
    [0, 0.55, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // ── Output document (230–360) ─────────────────────────────────────────────
  const docEntS = spring({
    frame: Math.max(0, frame - 230),
    fps,
    config: ENTER,
    durationInFrames: 30,
  })
  const docOpacity = interpolate(frame, [230, 248], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const docY = interpolate(docEntS, [0, 1], [20, 0])

  // ── Caption (270–360) ─────────────────────────────────────────────────────
  const captionOpacity = interpolate(frame, [270, 296], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const captionScale = frame >= 330 ? breathe : 1

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <GrainLayer id="b04grain" />

      {/* Camera push-in wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 45%',
        }}
      >
        {/* ══ INPUT CARD ═══════════════════════════════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            top: INPUT_CARD_TOP,
            left: '50%',
            width: CARD_WIDTH,
            transform: `translateX(-50%) scale(${cardScale})`,
            transformOrigin: 'top center',
            opacity: cardOpacity,
          }}
        >
          <div
            style={{
              background: theme.colors.surface,
              borderRadius: 20,
              padding: '26px 36px',
              boxShadow: theme.shadows.lifted,
              position: 'relative',
            }}
          >
            {/* Gradient accent bar — sky → mint */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.mint})`,
                borderRadius: '20px 20px 0 0',
              }}
            />

            {/* ── Header row (45–80) ────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 22,
                opacity: headerOpacity,
                transform: `translateY(${headerY}px)`,
              }}
            >
              {/* Icon bubble */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: `${theme.colors.mint}18`,
                  border: `1.5px solid ${theme.colors.mint}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WandIcon size={24} color={theme.colors.mint} />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: soraFont,
                    fontSize: 24,
                    fontWeight: 700,
                    color: theme.colors.charcoal,
                    letterSpacing: '-0.022em',
                    lineHeight: 1,
                  }}
                >
                  Classroom Management
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 14,
                    color: theme.colors.muted,
                    marginTop: 5,
                  }}
                >
                  AI strategy generator
                </div>
              </div>

              {/* Template badge */}
              <div
                style={{
                  background: `${theme.colors.skyBlue}0E`,
                  border: `1px solid ${theme.colors.skyBlue}2A`,
                  borderRadius: 8,
                  padding: '5px 14px',
                  fontFamily: theme.fonts.body,
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.skyBlue,
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                Template
              </div>
            </div>

            {/* ── Input section (70–88 reveal) ──────────────────────────── */}
            <div style={{ opacity: inputSectionOpacity }}>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.muted,
                  marginBottom: 7,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Describe the challenge
              </div>

              {/* Text input field */}
              <div
                style={{
                  minHeight: 62,
                  background: isActive ? '#EEF6FF' : '#F4F6FB',
                  border: `1.5px solid ${isActive ? `${theme.colors.skyBlue}48` : '#E2E8F0'}`,
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 18,
                  fontFamily: theme.fonts.body,
                  fontSize: 16,
                  color: theme.colors.charcoal,
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  boxShadow: isActive
                    ? `0 0 0 3px ${theme.colors.skyBlue}0A`
                    : 'none',
                }}
              >
                <span>
                  {typedText}
                  {isTyping && cursorBlink && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 2,
                        height: '1.1em',
                        background: theme.colors.skyBlue,
                        marginLeft: 2,
                        verticalAlign: 'middle',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </span>
              </div>

              {/* Generate button + click glow burst */}
              <div style={{ opacity: btnOpacity, position: 'relative', display: 'inline-block' }}>
                {/* Radial glow burst (flares on click) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 240,
                    height: 80,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(ellipse, rgba(59,158,255,${glowBurstOpacity}) 0%, transparent 65%)`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    transform: `scale(${btnScale})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div
                    style={{
                      background: theme.colors.skyBlue,
                      borderRadius: 999,
                      padding: '13px 28px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: `0 4px 18px rgba(59,158,255,${0.28 + 0.15 * btnPulse}), 0 2px 8px rgba(59,158,255,0.15)`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: soraFont,
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Generate
                    </span>
                    <SparkleIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ OUTPUT DOCUMENT ══════════════════════════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            top: OUTPUT_CARD_TOP,
            left: '50%',
            width: CARD_WIDTH,
            transform: `translateX(-50%) translateY(${docY}px)`,
            opacity: docOpacity,
          }}
        >
          <div
            style={{
              background: theme.colors.surface,
              borderRadius: 20,
              padding: '20px 36px 24px',
              boxShadow: theme.shadows.card,
            }}
          >
            {/* Document header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: '1px solid #EEF0F6',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: theme.colors.skyBlue,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: soraFont,
                  fontSize: 15,
                  fontWeight: 700,
                  color: theme.colors.charcoal,
                  letterSpacing: '-0.01em',
                  flex: 1,
                }}
              >
                Classroom Management Strategy
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 12,
                  color: theme.colors.muted,
                }}
              >
                Generated in 1.8s
              </span>
            </div>

            {/* Sections — staggered 12 frames apart */}
            {SECTIONS.map((section, si) => {
              const sectionStart = 230 + si * 12
              const sOpacity = interpolate(
                frame,
                [sectionStart, sectionStart + 10],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
              return (
                <div
                  key={si}
                  style={{
                    marginBottom: si < SECTIONS.length - 1 ? 14 : 0,
                    opacity: sOpacity,
                  }}
                >
                  {/* Section heading */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 7,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 15,
                        borderRadius: 2,
                        background: section.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: soraFont,
                        fontSize: 14,
                        fontWeight: 700,
                        color: section.color,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {section.heading}
                    </span>
                  </div>

                  {/* Bullets — cascade in 4 frames apart */}
                  <div
                    style={{
                      paddingLeft: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    {section.bullets.map((bullet, bi) => {
                      const bulletStart = sectionStart + 5 + bi * 4
                      const bOpacity = interpolate(
                        frame,
                        [bulletStart, bulletStart + 6],
                        [0, 1],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                      )
                      return (
                        <div
                          key={bi}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            opacity: bOpacity,
                          }}
                        >
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: section.color,
                              flexShrink: 0,
                              opacity: 0.55,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: theme.fonts.body,
                              fontSize: 13,
                              color: theme.colors.charcoal,
                              lineHeight: 1.4,
                              opacity: 0.82,
                            }}
                          >
                            {bullet}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ══ CAPTION ══════════════════════════════════════════════════════════ */}
        {/* "From challenge to classroom — in seconds." */}
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: captionOpacity,
            transform: `scale(${captionScale})`,
            transformOrigin: 'center center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 28,
              fontWeight: 500,
              color: theme.colors.muted,
              letterSpacing: '-0.01em',
            }}
          >
            From challenge to classroom —{' '}
            <span
              style={{
                color: theme.colors.charcoal,
                fontWeight: 700,
              }}
            >
              in seconds.
            </span>
          </span>
        </div>
      </div>

      <BeatTransition beatDuration={BEAT04_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

// ── Inline icon primitives ────────────────────────────────────────────────────

const WandIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Wand body */}
    <line x1="3" y1="21" x2="21" y2="3" />
    {/* Sparkle rays */}
    <path d="M17.5 3.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    {/* Small spark */}
    <path d="M6 6l0.7 1.5 1.5 0.7-1.5 0.7L6 10.4l-0.7-1.5L3.8 8.2l1.5-0.7z" />
  </svg>
)

const SparkleIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M12 2l2.09 6.26L20 8.27l-5.46 3.97 1.84 6.2L12 14.77l-4.38 3.67 1.84-6.2L4 8.27l5.91-.01z" />
  </svg>
)

// Paper grain overlay — unique filter id per beat avoids SVG conflicts
const GrainLayer: React.FC<{ id: string }> = ({ id }) => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.04,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          seed="17"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
)

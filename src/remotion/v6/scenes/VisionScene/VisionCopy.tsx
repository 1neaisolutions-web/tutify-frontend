/**

 * Slide 1 — "But technology was never meant to replace educators."

 * Slide 2 — "It was meant to empower them." (radial iris between lines)

 */

import React from 'react'

import { AbsoluteFill, interpolate, spring } from 'remotion'

import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'



import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'

import { theme } from '../../theme'

import {

  VISION_RADIAL_WIPE_FRAMES,

  visionLine2InsideHoleClip,

  visionRadialWipeActive,

} from './VisionRadialWipe'



const HEADLINE = INTRO_HEADLINE.fontSize

const EMPOWER_SIZE = Math.round(HEADLINE * 1.12)



const SLATE = '#0F172A'

const SLATE_MUTED = '#475569'



const LINE1_ROWS = [

  ['But', 'technology', 'was', 'never', 'meant', 'to'],

  ['replace', 'educators.'],

] as const



const LINE2_WORDS = ['It', 'was', 'meant', 'to', 'empower', 'them.'] as const



const LINE1_START = 14

const LINE1_ROW_GAP = 12

const LINE1_WORD_STAGGER = 6

const LINE1_SETTLE = 16

const LINE2_GAP_AFTER_WIPE = 0

const LINE2_HOLD_AFTER_COMPLETE = 20

const LINE2_SETTLE = 18

const WORD_SPRING = { damping: 160, stiffness: 122, mass: 0.9 }



function buildLine1Starts(): number[] {

  const starts: number[] = []

  let t = LINE1_START

  LINE1_ROWS.forEach((row) => {

    row.forEach((_, wi) => {

      starts.push(t + wi * LINE1_WORD_STAGGER)

    })

    t += row.length * LINE1_WORD_STAGGER + LINE1_ROW_GAP

  })

  return starts

}



const LINE1_STARTS = buildLine1Starts()

const LINE1_LAST_START = LINE1_STARTS[LINE1_STARTS.length - 1]!

export const VISION_LINE1_DONE = LINE1_LAST_START + LINE1_SETTLE

export const VISION_LINE1_WIPE_START = VISION_LINE1_DONE

const LINE1_WIPE_START = VISION_LINE1_WIPE_START

export const VISION_LINE2_START = LINE1_WIPE_START + VISION_RADIAL_WIPE_FRAMES + LINE2_GAP_AFTER_WIPE

const LINE2_START = VISION_LINE2_START



/** Accent bar after full-screen handoff; line 2 copy is instant during radial wipe */
const LINE2_WORD_START = LINE2_START
const LINE2_WORD_STAGGER = 6



type VisionCopyProps = {

  fontFamily: string

  fadeOut: number

}



const RevealWord: React.FC<{

  word: string

  start: number

  frame: number

  fps: number

  color?: string

  weight?: number

  size?: number

  instant?: boolean

}> = ({ word, start, frame, fps, color = SLATE, weight = 600, size = HEADLINE, instant }) => {

  const raw = frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0

  const opacity = instant ? 1 : frame < start ? 0 : interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })

  const y = instant ? 0 : interpolate(raw, [0, 1], [32, 0], { extrapolateRight: 'clamp' })



  return (

    <span

      style={{

        display: 'inline-block',

        fontSize: size,

        fontWeight: weight,

        color,

        letterSpacing: '-0.03em',

        opacity,

        transform: `translateY(${y}px)`,

        marginRight: '0.32em',

      }}

    >

      {word}

    </span>

  )

}



const Line1Block: React.FC<{

  fontFamily: string

  frame: number

  fps: number

}> = ({ fontFamily, frame, fps }) => (

  <div

    style={{

      display: 'flex',

      flexDirection: 'column',

      alignItems: 'center',

      justifyContent: 'center',

      gap: 12,

      fontFamily,

      width: '100%',

      height: '100%',

      padding: `0 ${INTRO_HEADLINE.paddingX}px`,

    }}

  >

    <div

      style={{

        display: 'flex',

        flexWrap: 'wrap',

        justifyContent: 'center',

        maxWidth: INTRO_HEADLINE.maxWidth,

        lineHeight: 1.2,

      }}

    >

      {LINE1_ROWS[0].map((word, i) => (

        <RevealWord

          key={word}

          word={word}

          start={LINE1_STARTS[i]!}

          frame={frame}

          fps={fps}

          color={SLATE_MUTED}

          weight={500}

          size={HEADLINE}

        />

      ))}

    </div>

    <div

      style={{

        display: 'flex',

        flexWrap: 'wrap',

        justifyContent: 'center',

        maxWidth: INTRO_HEADLINE.maxWidth,

        lineHeight: 1.15,

      }}

    >

      {LINE1_ROWS[1].map((word, i) => (

        <RevealWord

          key={word}

          word={word}

          start={LINE1_STARTS[LINE1_ROWS[0].length + i]!}

          frame={frame}

          fps={fps}

          color={SLATE}

          weight={700}

          size={HEADLINE}

        />

      ))}

    </div>

  </div>

)



const Line2Block: React.FC<{

  fontFamily: string

  frame: number

  fps: number

  showAccent: boolean

  accentBarW: number

  instantReveal?: boolean

}> = ({ fontFamily, frame, fps, showAccent, accentBarW, instantReveal }) => {

  const line2Starts = LINE2_WORDS.map((_, i) => LINE2_WORD_START + i * LINE2_WORD_STAGGER)



  return (

    <div

      style={{

        display: 'flex',

        flexDirection: 'column',

        alignItems: 'center',

        justifyContent: 'center',

        fontFamily,

        width: '100%',

        height: '100%',

        padding: `0 ${INTRO_HEADLINE.paddingX}px`,

      }}

    >

      <div

        style={{

          display: 'flex',

          flexWrap: 'wrap',

          justifyContent: 'center',

          alignItems: 'baseline',

          maxWidth: INTRO_HEADLINE.maxWidth,

          lineHeight: 1.12,

        }}

      >

        {LINE2_WORDS.map((word, i) => {

          const start = line2Starts[i]!

          if (word === 'empower') {

            return (

              <RevealWord

                key={word}

                word={word}

                start={start}

                frame={frame}

                fps={fps}

                color={theme.colors.primary}

                weight={800}

                size={EMPOWER_SIZE}

                instant={instantReveal}

              />

            )

          }

          if (word === 'them.') {

            return (

              <RevealWord

                key={word}

                word={word}

                start={start}

                frame={frame}

                fps={fps}

                color={SLATE}

                weight={700}

                size={HEADLINE}

                instant={instantReveal}

              />

            )

          }

          return (

            <RevealWord

              key={word}

              word={word}

              start={start}

              frame={frame}

              fps={fps}

              color={SLATE_MUTED}

              weight={500}

              size={HEADLINE}

              instant={instantReveal}

            />

          )

        })}

      </div>

      {showAccent ? (

        <div

          style={{

            marginTop: 20,

            width: accentBarW,

            height: 4,

            borderRadius: 2,

            background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, ${theme.colors.accent}, transparent)`,

          }}

        />

      ) : null}

    </div>

  )

}



export const VisionCopy: React.FC<VisionCopyProps> = ({ fontFamily, fadeOut }) => {

  const frame = useCurrentFrame()

  const { fps } = useVideoConfig()



  const wipeActive = visionRadialWipeActive(frame, LINE1_WIPE_START, LINE2_START)

  /** Previous phase off as soon as the iris starts */
  const showLine1 = frame < LINE1_WIPE_START

  const showLine2InHole = wipeActive

  const showLine2Full = frame >= LINE2_START

  const line2HoleClip = visionLine2InsideHoleClip(frame, LINE1_WIPE_START, LINE2_START)



  const line2LastStart = LINE2_WORD_START + (LINE2_WORDS.length - 1) * LINE2_WORD_STAGGER

  const accentBarW = interpolate(

    spring({

      frame: Math.max(0, frame - line2LastStart),

      fps,

      config: theme.spring.snappy,

    }),

    [0, 1],

    [0, 220],

  )



  return (

    <AbsoluteFill style={{ opacity: fadeOut, pointerEvents: 'none' }}>

      {showLine2InHole ? (

        <AbsoluteFill

          style={{

            zIndex: 5,

            clipPath: line2HoleClip,

            WebkitClipPath: line2HoleClip,

          }}

        >

          <Line2Block
            fontFamily={fontFamily}
            frame={frame}
            fps={fps}
            showAccent={false}
            accentBarW={0}
            instantReveal
          />

        </AbsoluteFill>

      ) : null}



      {showLine1 ? (

        <AbsoluteFill style={{ zIndex: 10 }}>

          <Line1Block fontFamily={fontFamily} frame={frame} fps={fps} />

        </AbsoluteFill>

      ) : null}



      {showLine2Full ? (

        <AbsoluteFill style={{ zIndex: 20 }}>

          <Line2Block

            fontFamily={fontFamily}

            frame={frame}

            fps={fps}

            showAccent

            accentBarW={accentBarW}

            instantReveal

          />

        </AbsoluteFill>

      ) : null}

    </AbsoluteFill>

  )

}



const LINE2_LAST_START = LINE2_WORD_START + (LINE2_WORDS.length - 1) * LINE2_WORD_STAGGER

export const VISION_LINE2_DONE = LINE2_LAST_START + LINE2_SETTLE

export const VISION_SCENE_DURATION = VISION_LINE2_DONE + LINE2_HOLD_AFTER_COMPLETE + 14



/**

 * V10 Teachers headline — dark purple glow bg, white copy, blue box on OVERWHELMED only.

 */

import React from 'react'

import { Easing, interpolate } from 'remotion'

import { useCurrentFrame } from '@/remotion/shared/timelineFrame'



import {

  SELECT_BLUE,

  T_CURSOR_END,

  HIGHLIGHT_START,

  HIGHLIGHT_END,

  CLOSE_START,

  FULL_HEADLINE,

  OVERWHELMED_START,

  WORD_OVER_END,
  WORD_OVER_START,

} from '../../../compositions/TeachersOverwhelmedSlide/constants'

import {

  getTypingState,

  splitForRender,

} from '../../../compositions/TeachersOverwhelmedSlide/typingEngine'

import {

  INTRO_HEADLINE,

  INTRO_HEADLINE_EMPHASIS_WEIGHT,

} from '../../../compositions/shared/introHeadlineTypography'

import {

  ColorRevealTypewriter,

  COLOR_REVEAL_HEAD,

  COLOR_REVEAL_ON_DARK,

} from '../../components/ColorRevealTypewriter'



const NORMAL_TEXT = FULL_HEADLINE.slice(0, OVERWHELMED_START)

const EMPHASIS_TEXT = FULL_HEADLINE.slice(OVERWHELMED_START)

/** V10 Teachers slide — matches shared INTRO_HEADLINE scale. */
const TEACHERS_HEADLINE_FONT_SIZE = 96
const TEACHERS_HEADLINE_MAX_WIDTH = 1560

const ZOOM_OUT_SCALE = 0.88
const ZOOM_OUT_DRIFT_Y = 22
const ZOOM_OUT_ANIM_FRAMES = 14
const ZOOM_IN_FRAMES = 26

type TypingHeadlineV10Props = {

  fontFamily: string

}



const CURSOR_BLINK_FRAMES = 16

const TYPE_START = T_CURSOR_END

const TYPE_DURATION = Math.max(1, WORD_OVER_END - T_CURSOR_END)



export const TypingHeadlineV10: React.FC<TypingHeadlineV10Props> = ({ fontFamily }) => {

  const frame = useCurrentFrame()



  const { phase, visibleText, atWordBoundary } = getTypingState(frame)

  const { normal, emphasis } = splitForRender(visibleText)

  const cursorBlink = Math.floor(frame / CURSOR_BLINK_FRAMES) % 2 === 0



  const highlightOn = frame >= HIGHLIGHT_START && frame < HIGHLIGHT_END

  const highlightFade = interpolate(

    frame,

    [HIGHLIGHT_END, CLOSE_START + 10],

    [1, 0],

    {

      extrapolateLeft: 'clamp',

      extrapolateRight: 'clamp',

      easing: Easing.out(Easing.quad),

    },

  )



  const showCursor =

    phase === 'cursor' ||

    phase === 'typing' ||

    phase === 'word_pause' ||

    phase === 'erasing' ||

    (phase === 'done' && frame < CLOSE_START && visibleText.length > 0)



  const cursorOpacity =

    phase === 'cursor' || atWordBoundary

      ? cursorBlink

        ? 1

        : 0.12

      : cursorBlink

        ? 0.92

        : 0.14



  const lineVisible = phase === 'cursor' || showCursor || visibleText.length > 0

  const lineFadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  let headlineScale = 1
  let headlineTranslateY = 0

  if (frame >= T_CURSOR_END && frame < WORD_OVER_START) {
    const zoomOut = interpolate(
      frame,
      [T_CURSOR_END, T_CURSOR_END + ZOOM_OUT_ANIM_FRAMES],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      },
    )
    headlineScale = interpolate(zoomOut, [0, 1], [1, ZOOM_OUT_SCALE], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    headlineTranslateY = interpolate(zoomOut, [0, 1], [0, ZOOM_OUT_DRIFT_Y], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  } else if (frame >= WORD_OVER_START && frame < WORD_OVER_START + ZOOM_IN_FRAMES) {
    const zoomIn = interpolate(
      frame,
      [WORD_OVER_START, WORD_OVER_START + ZOOM_IN_FRAMES],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      },
    )
    headlineScale = interpolate(zoomIn, [0, 1], [ZOOM_OUT_SCALE, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    headlineTranslateY = interpolate(zoomIn, [0, 1], [ZOOM_OUT_DRIFT_Y, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const emphasisVisible = emphasis.length > 0

  const showHighlight =

    emphasisVisible && (highlightOn || (frame >= HIGHLIGHT_END && highlightFade > 0))



  const highlightForceWhite =

    showHighlight && (highlightOn || highlightFade > 0.15)



  const cursorColor = highlightForceWhite ? '#FFFFFF' : COLOR_REVEAL_ON_DARK



  const headlineBase: React.CSSProperties = {

    fontFamily,

    fontSize: TEACHERS_HEADLINE_FONT_SIZE,

    fontWeight: INTRO_HEADLINE.fontWeight,

    letterSpacing: INTRO_HEADLINE.letterSpacing,

    lineHeight: INTRO_HEADLINE.lineHeight,

    whiteSpace: 'pre',

  }



  const cursorStyle: React.CSSProperties = {

    fontWeight: 300,

    fontSize: TEACHERS_HEADLINE_FONT_SIZE,

    lineHeight: INTRO_HEADLINE.lineHeight,

    opacity: cursorOpacity,

    marginLeft: visibleText.length > 0 ? '0.06em' : 0,

    color: cursorColor,

  }



  return (

    <div

      style={{

        position: 'absolute',

        inset: 0,

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        zIndex: 50,

        pointerEvents: 'none',

        padding: `0 ${INTRO_HEADLINE.paddingX}px`,

        opacity: lineVisible ? lineFadeIn : 0,

        width: '100%',

        textAlign: 'center',

      }}

    >

      <div
        style={{
          transform: `translateY(${headlineTranslateY}px) scale(${headlineScale})`,
          transformOrigin: 'center center',
        }}
      >
      {phase === 'cursor' ? (

        <span style={{ ...headlineBase, ...cursorStyle }}>|</span>

      ) : (

        <div

          style={{

            display: 'inline-flex',

            alignItems: 'baseline',

            justifyContent: 'center',

            flexWrap: 'wrap',

            width: '100%',

            maxWidth: TEACHERS_HEADLINE_MAX_WIDTH,

            margin: '0 auto',

            textAlign: 'center',

            ...headlineBase,

          }}

        >

          {normal.length > 0 ? (

            <ColorRevealTypewriter

              text={NORMAL_TEXT}

              startFrame={TYPE_START}

              duration={TYPE_DURATION}

              visibleCount={normal.length}

              charIndexOffset={0}

              settledColor={COLOR_REVEAL_ON_DARK}

              headColor={COLOR_REVEAL_HEAD}

              headPurpleFrames={14}

            />

          ) : null}



          {emphasis.length > 0 ? (

            <span

              style={{

                position: 'relative',

                display: 'inline-block',

                fontWeight: INTRO_HEADLINE_EMPHASIS_WEIGHT,

                textTransform: 'uppercase',

                letterSpacing: INTRO_HEADLINE.letterSpacing,

              }}

            >

              {showHighlight && (

                <span

                  style={{

                    position: 'absolute',

                    left: -10,

                    right: -10,

                    top: '6%',

                    bottom: '4%',

                    background: SELECT_BLUE,

                    borderRadius: 8,

                    opacity: highlightOn ? 1 : highlightFade,

                    zIndex: 0,

                  }}

                />

              )}

              <span style={{ position: 'relative', zIndex: 1 }}>

                <ColorRevealTypewriter

                  text={EMPHASIS_TEXT}

                  startFrame={TYPE_START}

                  duration={TYPE_DURATION}

                  visibleCount={emphasis.length}

                  charIndexOffset={OVERWHELMED_START}

                  settledColor={COLOR_REVEAL_ON_DARK}

                  headColor={COLOR_REVEAL_HEAD}

                  emphasisFromIndex={0}

                  emphasisWeight={INTRO_HEADLINE_EMPHASIS_WEIGHT}

                  headPurpleFrames={14}

                  emphasisGradient={!highlightForceWhite}

                  forceColor={highlightForceWhite ? '#FFFFFF' : undefined}

                />

              </span>

            </span>

          ) : null}



          {showCursor && <span style={cursorStyle}>|</span>}

        </div>

      )}

      </div>

    </div>

  )

}



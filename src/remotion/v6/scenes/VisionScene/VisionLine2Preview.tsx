/**
 * Static line 2 headline — shown inside the radial wipe before word-by-word reveal.
 */
import React from 'react'

import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import { theme } from '../../theme'

const HEADLINE = INTRO_HEADLINE.fontSize
const EMPOWER_SIZE = Math.round(HEADLINE * 1.12)
const SLATE = '#0F172A'
const SLATE_MUTED = '#475569'

type Props = {
  fontFamily: string
}

export const VisionLine2Preview: React.FC<Props> = ({ fontFamily }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily,
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
      <span
        style={{
          fontSize: HEADLINE,
          fontWeight: 500,
          color: SLATE_MUTED,
          letterSpacing: '-0.03em',
          marginRight: '0.32em',
        }}
      >
        It
      </span>
      <span
        style={{
          fontSize: HEADLINE,
          fontWeight: 500,
          color: SLATE_MUTED,
          letterSpacing: '-0.03em',
          marginRight: '0.32em',
        }}
      >
        was
      </span>
      <span
        style={{
          fontSize: HEADLINE,
          fontWeight: 500,
          color: SLATE_MUTED,
          letterSpacing: '-0.03em',
          marginRight: '0.32em',
        }}
      >
        meant
      </span>
      <span
        style={{
          fontSize: HEADLINE,
          fontWeight: 500,
          color: SLATE_MUTED,
          letterSpacing: '-0.03em',
          marginRight: '0.32em',
        }}
      >
        to
      </span>
      <span
        style={{
          fontSize: EMPOWER_SIZE,
          fontWeight: 800,
          color: theme.colors.primary,
          letterSpacing: '-0.03em',
          marginRight: '0.32em',
        }}
      >
        empower
      </span>
      <span
        style={{
          fontSize: HEADLINE,
          fontWeight: 700,
          color: SLATE,
          letterSpacing: '-0.03em',
        }}
      >
        them.
      </span>
    </div>
  </div>
)

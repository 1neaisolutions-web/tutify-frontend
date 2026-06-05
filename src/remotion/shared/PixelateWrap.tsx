/**
 * Scale-down / scale-up pixelation — animates block size for a mosaic dissolve.
 */
import React from 'react'

export type PixelateWrapProps = {
  children: React.ReactNode
  /** 1 = crisp; higher = coarser blocks */
  blockSize: number
  opacity?: number
}

export const PixelateWrap: React.FC<PixelateWrapProps> = ({
  children,
  blockSize,
  opacity = 1,
}) => {
  const clamped = Math.max(1, blockSize)

  if (clamped <= 1.01) {
    return <div style={{ width: '100%', height: '100%', opacity }}>{children}</div>
  }

  const scale = 1 / clamped

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        opacity,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${clamped})`,
            transformOrigin: 'center center',
            imageRendering: 'pixelated',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

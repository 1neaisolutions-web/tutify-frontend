/** No sound effects at or after this timestamp (TutifyDemoV6). */
export const SFX_CUTOFF_TIME = '01:52.00' as const

export const SFX_CUTOFF_FRAME = Math.round((1 * 60 + 52.0) * 30)

export const sfxAllowedAt = (globalFrame: number): boolean => globalFrame < SFX_CUTOFF_FRAME

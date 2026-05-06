/**
 * Specialist deep-dive tracks use one shell; unknown `renderProfile` strings normalize to `deep-dive-track`.
 */
export type SpecialistDeepDiveRenderProfileId = 'deep-dive-track'

const KNOWN: SpecialistDeepDiveRenderProfileId[] = ['deep-dive-track']

export function resolveSpecialistDeepDiveRenderProfile(
  profile: string | undefined
): SpecialistDeepDiveRenderProfileId {
  const p = (profile ?? 'deep-dive-track').trim()
  if (KNOWN.includes(p as SpecialistDeepDiveRenderProfileId)) {
    return p as SpecialistDeepDiveRenderProfileId
  }
  return 'deep-dive-track'
}

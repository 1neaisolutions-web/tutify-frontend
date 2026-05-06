/**
 * Resolves `aiGuidedTutorialContent.renderProfile` to one of three tutorial shells.
 * Unknown values fall back to `lesson-planner` so new catalog rows keep working without
 * router changes. Add aliases here when a new string should map to a non-default shell.
 */
export type AiGuidedTutorialShellId =
  | 'lesson-planner'
  | 'assessment-best-practices'
  | 'differentiation-case-study'

/** Optional aliases (e.g. engagement case study uses differentiation shell for completion UI). */
const PROFILE_TO_SHELL: Record<string, AiGuidedTutorialShellId> = {
  'engagement-case-study': 'differentiation-case-study',
  'pbl-case-study': 'differentiation-case-study',
}

const KNOWN_SHELLS = new Set<AiGuidedTutorialShellId>([
  'lesson-planner',
  'assessment-best-practices',
  'differentiation-case-study',
])

export function resolveAiGuidedTutorialShell(
  renderProfile: string | undefined
): AiGuidedTutorialShellId {
  const raw = (renderProfile ?? 'lesson-planner').trim()
  if (KNOWN_SHELLS.has(raw as AiGuidedTutorialShellId)) {
    return raw as AiGuidedTutorialShellId
  }
  const aliased = PROFILE_TO_SHELL[raw]
  if (aliased) return aliased
  return 'lesson-planner'
}

/** Short label for catalog / authoring (theme column). */
export function labelAiGuidedTutorialShell(shell: AiGuidedTutorialShellId): string {
  switch (shell) {
    case 'lesson-planner':
      return 'Lesson planner walkthrough'
    case 'assessment-best-practices':
      return 'Assessment walkthrough'
    case 'differentiation-case-study':
      return 'Differentiation / case study walkthrough'
  }
}

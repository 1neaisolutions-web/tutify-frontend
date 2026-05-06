/**
 * Variants that map to dedicated React shells (Bloom, Hattie, legacy inline articles, etc.).
 * Anything else + a structured `payload` is handled by `ResearchInsightSectionsPayloadView`.
 */
export const RESEARCH_INSIGHT_BESPOKE_VARIANT_IDS = [
  'evidence-based-teaching',
  'blooms-taxonomy',
  'assessment-research',
  'sel-behavior-research',
  'growth-mindset-research',
  'cognitive-load-research',
  'metacognition-research',
  'scaffolding-research',
] as const

export type ResearchInsightBespokeVariantId = (typeof RESEARCH_INSIGHT_BESPOKE_VARIANT_IDS)[number]

export function isResearchInsightBespokeVariant(v: string): v is ResearchInsightBespokeVariantId {
  return (RESEARCH_INSIGHT_BESPOKE_VARIANT_IDS as readonly string[]).includes(v)
}

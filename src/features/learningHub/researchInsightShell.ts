/**
 * Research insight detail pages use one rendering contract: `renderProfile: 'research-article'`.
 * Actual layout differences are handled by `ResearchInsightVariant` in `ResearchInsightArticleView`.
 */
export type ResearchInsightRenderProfileId = 'research-article'

const KNOWN: ResearchInsightRenderProfileId[] = ['research-article']

export function resolveResearchInsightRenderProfile(
  profile: string | undefined
): ResearchInsightRenderProfileId {
  const p = (profile ?? 'research-article').trim()
  if (KNOWN.includes(p as ResearchInsightRenderProfileId)) {
    return p as ResearchInsightRenderProfileId
  }
  return 'research-article'
}

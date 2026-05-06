import { Navigate } from 'react-router-dom'
import type { LearningHubSectionItem } from '../../../features/learningHub/types'
import { resolveResearchInsightRenderProfile } from '../../../features/learningHub/researchInsightShell'
import { isResearchInsightBespokeVariant } from '../../../features/learningHub/researchInsightRouting'
import { isResearchStructuredSectionsPayload } from '../../../features/learningHub/researchInsightStructuredPayload'
import { BloomsTaxonomyResearchView } from '../BloomsTaxonomyResearch'
import { EvidenceBasedTeachingResearchView } from '../EvidenceBasedTeachingResearch'
import { AssessmentResearchView } from '../AssessmentResearch'
import { SELBehaviorResearchView } from '../SELBehaviorResearch'
import { GrowthMindsetResearchView } from '../GrowthMindsetResearch'
import { CognitiveLoadTheoryResearchView } from '../CognitiveLoadTheoryResearch'
import { MetacognitionResearchView } from '../MetacognitionResearch'
import { ScaffoldingResearchView } from '../ScaffoldingResearch'
import { ResearchInsightSectionsPayloadView } from './ResearchInsightSectionsPayloadView'

export function ResearchInsightArticleView({ item }: { item: LearningHubSectionItem }) {
  const c = item.researchInsightContent
  if (!c || c.type !== 'research-insight') {
    return <Navigate to="/learning-hub" replace />
  }

  resolveResearchInsightRenderProfile(c.renderProfile)

  if (isResearchInsightBespokeVariant(c.variant)) {
    switch (c.variant) {
      case 'blooms-taxonomy':
        return <BloomsTaxonomyResearchView item={item} />
      case 'evidence-based-teaching':
        return <EvidenceBasedTeachingResearchView item={item} />
      case 'assessment-research':
        return <AssessmentResearchView item={item} />
      case 'sel-behavior-research':
        return <SELBehaviorResearchView item={item} />
      case 'growth-mindset-research':
        return <GrowthMindsetResearchView item={item} />
      case 'cognitive-load-research':
        return <CognitiveLoadTheoryResearchView item={item} />
      case 'metacognition-research':
        return <MetacognitionResearchView item={item} />
      case 'scaffolding-research':
        return <ScaffoldingResearchView item={item} />
      default:
        return <Navigate to="/learning-hub" replace />
    }
  }

  if (isResearchStructuredSectionsPayload(c.payload)) {
    return <ResearchInsightSectionsPayloadView item={item} />
  }

  return <Navigate to="/learning-hub" replace />
}

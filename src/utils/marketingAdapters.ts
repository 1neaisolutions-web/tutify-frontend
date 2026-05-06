/**
 * Adapters: map backend capability JSON to frontend Marketing & Branding UI types.
 * Backend marketing_concepts returns { items: [ { title, description } ] } or { gradeLevel, concepts: [ { title, description } ] }
 */
import type {
  BrandingStrategy,
  DigitalMarketingChannel,
  MarketingCampaign,
  MarketingConcept,
  MarketingStandard,
  MarketResearchMethod,
} from './marketingUtils'

function ensureArray<T = string>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  return []
}

function ensureString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v
  return fallback
}

/** Backend: items[] with title, description OR concepts[] with title, description; optional gradeLevel */
export function mapMarketingConceptsResponseToUI(
  result: Record<string, unknown>,
  gradeLevel: string
): MarketingConcept[] {
  const items = ensureArray<Record<string, unknown>>(result.items || result.concepts)
  const level = ensureString(result.gradeLevel) || gradeLevel
  return items.map((item, i) => ({
    id: `mc-${i}-${ensureString(item.title).slice(0, 20).replace(/\s+/g, '-')}`,
    concept: ensureString(item.title),
    description: ensureString(item.description),
    gradeLevel: level,
    keyPrinciples: [],
    examples: [],
    activities: [],
    realWorldApplications: [],
    tools: [],
  }))
}

/** Backend: items[] with title, description */
export function mapBrandingStrategiesResponseToUI(result: Record<string, unknown>): BrandingStrategy[] {
  const items = ensureArray<Record<string, unknown>>(result.items)
  return items.map((item, i) => ({
    id: `bs-${i}-${ensureString(item.title).slice(0, 20).replace(/\s+/g, '-')}`,
    strategy: ensureString(item.title),
    description: ensureString(item.description),
    components: [],
    steps: [],
    examples: [],
    benefits: [],
    challenges: [],
    bestPractices: [],
  }))
}

/** Backend: items[] with title, description */
export function mapDigitalMarketingChannelsResponseToUI(result: Record<string, unknown>): DigitalMarketingChannel[] {
  const items = ensureArray<Record<string, unknown>>(result.items)
  return items.map((item, i) => ({
    id: `dmc-${i}-${ensureString(item.title).slice(0, 20).replace(/\s+/g, '-')}`,
    channel: ensureString(item.title),
    description: ensureString(item.description),
    platforms: [],
    bestPractices: [],
    metrics: [],
    tools: [],
    targetAudience: '',
    budgetConsiderations: '',
  }))
}

/** Backend: items[] with title, description */
export function mapMarketResearchMethodsResponseToUI(result: Record<string, unknown>): MarketResearchMethod[] {
  const items = ensureArray<Record<string, unknown>>(result.items)
  return items.map((item, i) => ({
    id: `mrm-${i}-${ensureString(item.title).slice(0, 20).replace(/\s+/g, '-')}`,
    method: ensureString(item.title),
    description: ensureString(item.description),
    useCases: [],
    steps: [],
    tools: [],
    advantages: [],
    limitations: [],
    examples: [],
  }))
}

/** Backend: items[] with title, tags[0]=organization, tags[1]=region, description */
export function mapMarketingStandardsResponseToUI(result: Record<string, unknown>): MarketingStandard[] {
  const items = ensureArray<Record<string, unknown>>(result.items)
  return items.map((item, i) => {
    const tags = ensureArray<string>(item.tags)
    return {
      id: `ms-${i}-${ensureString(item.title).slice(0, 20).replace(/\s+/g, '-')}`,
      name: ensureString(item.title),
      organization: ensureString(tags[0]),
      region: ensureString(tags[1]),
      description: ensureString(item.description),
      keyComponents: [],
      gradeLevels: [],
      competencies: [],
    }
  })
}

/** Backend: campaignTitle, objectives, channels, keyMessages, tactics, successMetrics, duration, targetAudience */
export function mapMarketingCampaignResponseToUI(result: Record<string, unknown>): MarketingCampaign {
  const title = ensureString(result.campaignTitle, 'Marketing Campaign')
  return {
    id: `camp-${title.slice(0, 20).replace(/\s+/g, '-')}`,
    title,
    description: '',
    objectives: ensureArray<string>(result.objectives),
    targetAudience: ensureString(result.targetAudience),
    channels: ensureArray<string>(result.channels),
    timeline: ensureString(result.duration),
    budget: '',
    keyMessages: ensureArray<string>(result.keyMessages),
    tactics: ensureArray<string>(result.tactics),
    successMetrics: ensureArray<string>(result.successMetrics),
    caseStudy: '',
  }
}

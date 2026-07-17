import { useEffect, useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import {
  capabilitiesForTool,
  categoryForTool,
  findCapability,
  firstCapabilityForTool,
  type CoachCapability,
  type CoachCategory,
} from '../../../data/coachCatalog'

export interface CoachCapabilityRoute {
  /** When set, page should redirect instead of rendering */
  redirectTo: string | null
  capability: CoachCapability | null
  siblings: CoachCapability[]
  category: CoachCategory | undefined
  tabId: string | null
  isWorkspaceMode: boolean
}

/**
 * Reads ?cap= for a specialist tool page.
 * Bare URLs redirect to the tool's first capability.
 */
export function useCoachCapabilityRoute(toolSlug: string): CoachCapabilityRoute {
  const [searchParams] = useSearchParams()
  const capParam = searchParams.get('cap')?.trim() || ''

  const siblings = useMemo(() => capabilitiesForTool(toolSlug), [toolSlug])
  const category = useMemo(() => categoryForTool(toolSlug), [toolSlug])
  const first = useMemo(() => firstCapabilityForTool(toolSlug), [toolSlug])

  const capability = useMemo(() => {
    if (!capParam) return null
    return findCapability(capParam, toolSlug) ?? siblings.find((c) => c.tabId === capParam) ?? null
  }, [capParam, toolSlug, siblings])

  const redirectTo = !capParam && first ? `/chatbots/${toolSlug}?cap=${encodeURIComponent(first.id)}` : null

  return {
    redirectTo,
    capability,
    siblings,
    category,
    tabId: capability?.tabId ?? null,
    isWorkspaceMode: Boolean(capability),
  }
}

/** Sync activeTab from capability route once resolved */
export function useSyncCapabilityTab<T extends string>(
  tabId: string | null,
  setActiveTab: (tab: T) => void,
  isValid: (tab: string) => tab is T,
) {
  useEffect(() => {
    if (tabId && isValid(tabId)) {
      setActiveTab(tabId)
    }
  }, [tabId, setActiveTab, isValid])
}

export function CoachCapabilityRedirect({ to }: { to: string }) {
  return <Navigate to={to} replace />
}

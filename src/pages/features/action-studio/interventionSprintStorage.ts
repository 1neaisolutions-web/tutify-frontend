import type { SprintPlan } from './interventionSprintTypes'

const STORAGE_KEY = 'tutify.actionStudio.sprints'

function readAll(): SprintPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(plans: SprintPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently, demo feature only.
  }
}

export function listSavedSprints(): SprintPlan[] {
  return readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function getSavedSprint(id: string): SprintPlan | null {
  return readAll().find((p) => p.id === id) ?? null
}

export function saveSprint(plan: SprintPlan): void {
  const all = readAll()
  const idx = all.findIndex((p) => p.id === plan.id)
  if (idx >= 0) {
    all[idx] = plan
  } else {
    all.push(plan)
  }
  writeAll(all)
}

export function deleteSprint(id: string): void {
  writeAll(readAll().filter((p) => p.id !== id))
}

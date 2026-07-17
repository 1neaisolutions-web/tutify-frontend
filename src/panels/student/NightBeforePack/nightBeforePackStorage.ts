import type { NightBeforePack, PackProgress } from './nightBeforePackTypes'
import { getSeedPacks } from './nightBeforePackMockData'

export const STORAGE_KEY = 'tutify_student_night_before_packs_v1'

export type StorageResult<T> = { ok: true; data: T } | { ok: false; data: T; error: string }

function safeParse(raw: string | null): NightBeforePack[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as NightBeforePack[]) : null
  } catch {
    return null
  }
}

/** Merge seeds so demo packs always exist; keep user progress on matching ids. */
export function mergeWithSeeds(stored: NightBeforePack[] | null): NightBeforePack[] {
  const seeds = getSeedPacks()
  if (!stored || stored.length === 0) return seeds

  const byId = new Map(stored.map((p) => [p.id, p]))
  const merged: NightBeforePack[] = []

  for (const seed of seeds) {
    const existing = byId.get(seed.id)
    if (existing) {
      // Keep user progress/status; refresh relative exam dates from seed for scheduled/ready demo feel
      merged.push({
        ...seed,
        ...existing,
        examAt: existing.status === 'completed' ? existing.examAt : seed.examAt,
        content: existing.content?.warmupMcqs?.length ? existing.content : seed.content,
        progress: existing.progress || seed.progress,
      })
      byId.delete(seed.id)
    } else {
      merged.push(seed)
    }
  }

  for (const leftover of byId.values()) {
    merged.push(leftover)
  }

  return merged
}

export function loadPacks(): StorageResult<NightBeforePack[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = safeParse(raw)
    const data = mergeWithSeeds(parsed)
    if (!parsed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    return { ok: true, data }
  } catch {
    return { ok: false, data: mergeWithSeeds(null), error: 'storage' }
  }
}

export function savePacks(packs: NightBeforePack[]): StorageResult<NightBeforePack[]> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs))
    return { ok: true, data: packs }
  } catch {
    return { ok: false, data: packs, error: 'storage' }
  }
}

export function getPackById(id: string): StorageResult<NightBeforePack | null> {
  const result = loadPacks()
  const pack = result.data.find((p) => p.id === id) || null
  if (!result.ok) return { ok: false, data: pack, error: result.error }
  return { ok: true, data: pack }
}

export function upsertPack(pack: NightBeforePack): StorageResult<NightBeforePack[]> {
  const loaded = loadPacks()
  const next = [...loaded.data]
  const idx = next.findIndex((p) => p.id === pack.id)
  if (idx >= 0) next[idx] = pack
  else next.unshift(pack)
  const saved = savePacks(next)
  if (!saved.ok || !loaded.ok) {
    return { ok: false, data: next, error: 'storage' }
  }
  return { ok: true, data: next }
}

export function updatePackProgress(id: string, progressPatch: Partial<PackProgress>): StorageResult<NightBeforePack | null> {
  const loaded = loadPacks()
  const idx = loaded.data.findIndex((p) => p.id === id)
  if (idx < 0) return { ok: loaded.ok, data: null, ...(loaded.ok ? {} : { error: loaded.error }) } as StorageResult<NightBeforePack | null>

  const current = loaded.data[idx]
  const updated: NightBeforePack = {
    ...current,
    progress: {
      ...current.progress,
      ...progressPatch,
      sectionsViewed: progressPatch.sectionsViewed
        ? Array.from(new Set([...(current.progress.sectionsViewed || []), ...progressPatch.sectionsViewed]))
        : current.progress.sectionsViewed,
      mcqAnswers: progressPatch.mcqAnswers
        ? { ...current.progress.mcqAnswers, ...progressPatch.mcqAnswers }
        : current.progress.mcqAnswers,
    },
  }

  if (progressPatch.markedDoneAt) {
    updated.status = 'completed'
  }

  const next = [...loaded.data]
  next[idx] = updated
  const saved = savePacks(next)
  if (!saved.ok || !loaded.ok) {
    return { ok: false, data: updated, error: 'storage' }
  }
  return { ok: true, data: updated }
}

export function findPackByExamId(examId: string): NightBeforePack | null {
  const { data } = loadPacks()
  return data.find((p) => p.examId === examId) || null
}

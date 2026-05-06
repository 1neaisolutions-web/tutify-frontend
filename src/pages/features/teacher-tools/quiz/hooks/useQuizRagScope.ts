import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  adaptCatalogBook,
  fetchCatalog,
  fetchTopicsForPacks,
  fetchScopePreview,
  type AdaptedBook,
  type CatalogListResponse,
  type TopicsResponse,
  type ScopePreviewResponse,
} from '../../../../../api/quizCatalog'
import { buildRagScopeGenerationContext, type GenerationSourceContext } from '../../demo/generationFromSources'

function isRequestCancelled(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { name?: string; message?: string }
  if (e.name === 'AbortError') return true
  return typeof e.message === 'string' && e.message.toLowerCase().includes('request was cancelled')
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface UseQuizRagScopeOptions {
  subject: string
  grade: string
  /** Kept for signature compatibility; ignored (backend is the real source). */
  extraBooks?: unknown[]
  /** Hydrate when editing an existing quiz. */
  initialSelectedBookIds?: string[]
  initialScopeTopics?: string[]
  initialScopeRefinement?: string
  /** Hydrate when editing an assignment that was saved with this flag. */
  initialGenerateWithoutSources?: boolean
  /** Assignment flow: at most one catalog title; picking a new title replaces the previous. */
  bookSelectionMode?: 'multi' | 'single'
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useQuizRagScope({
  subject,
  grade,
  initialSelectedBookIds,
  initialScopeTopics,
  initialScopeRefinement,
  initialGenerateWithoutSources,
  bookSelectionMode = 'multi',
}: UseQuizRagScopeOptions) {
  // ---- catalog state -------------------------------------------------------
  const [catalog, setCatalog] = useState<AdaptedBook[]>([])
  const [filteredCatalog, setFilteredCatalog] = useState<AdaptedBook[]>([])
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogBusy, setCatalogBusy] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)

  // ---- book selection ------------------------------------------------------
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(
    () => initialSelectedBookIds ?? [],
  )
  const [generateWithoutSources, setGenerateWithoutSources] = useState(
    () => initialGenerateWithoutSources ?? false,
  )

  // ---- topic state ---------------------------------------------------------
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    () => initialScopeTopics ?? [],
  )
  const [topicQuery, setTopicQuery] = useState('')
  const [topicsIndexing, setTopicsIndexing] = useState(false)
  const [topicsError, setTopicsError] = useState<string | null>(null)

  // ---- scope refinement / preview ------------------------------------------
  const [scopeRefinement, setScopeRefinement] = useState(initialScopeRefinement ?? '')
  const [estimatedSegments, setEstimatedSegments] = useState(0)

  // ---- abort controller refs -----------------------------------------------
  /** Subject/grade full catalog load — must not share with search or typing aborts the list load. */
  const catalogLoadAbortRef = useRef<AbortController | null>(null)
  const catalogSearchAbortRef = useRef<AbortController | null>(null)
  const topicsAbortRef = useRef<AbortController | null>(null)
  const previewAbortRef = useRef<AbortController | null>(null)

  // ---- hydration effects ---------------------------------------------------
  useEffect(() => {
    if (initialSelectedBookIds === undefined) return
    setSelectedBookIds(
      bookSelectionMode === 'single' && initialSelectedBookIds.length > 1
        ? [initialSelectedBookIds[0]!]
        : initialSelectedBookIds,
    )
  }, [initialSelectedBookIds, bookSelectionMode])

  useEffect(() => {
    if (initialScopeTopics === undefined) return
    setSelectedTopics(initialScopeTopics)
  }, [initialScopeTopics])

  useEffect(() => {
    if (initialScopeRefinement === undefined) return
    setScopeRefinement(initialScopeRefinement)
  }, [initialScopeRefinement])

  useEffect(() => {
    if (initialGenerateWithoutSources === undefined) return
    setGenerateWithoutSources(!!initialGenerateWithoutSources)
  }, [initialGenerateWithoutSources])

  /** Full catalog is tenant-wide; quiz subject/grade are for the handout only, not catalog filtering. */
  const CATALOG_PAGE_SIZE = 100

  // ---- catalog load: initial + retry (all published packs for the workspace) ---
  useEffect(() => {
    catalogLoadAbortRef.current?.abort()
    const controller = new AbortController()
    catalogLoadAbortRef.current = controller

    setCatalogBusy(true)
    setCatalogError(null)
    setCatalog([])

    fetchCatalog({ page: 1, page_size: CATALOG_PAGE_SIZE }, controller.signal)
      .then((res: CatalogListResponse) => {
        const adapted = res.items.map(adaptCatalogBook)
        setCatalog(adapted)
        setCatalogBusy(false)
      })
      .catch((err: Error) => {
        if (isRequestCancelled(err)) return
        setCatalogError(err.message)
        setCatalogBusy(false)
      })

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCounter])

  // ---- catalog search: debounced server query (non-empty only) ------------
  useEffect(() => {
    if (!catalogQuery.trim()) {
      return
    }

    catalogSearchAbortRef.current?.abort()
    const controller = new AbortController()
    catalogSearchAbortRef.current = controller

    setCatalogBusy(true)
    setCatalogError(null)

    const timer = window.setTimeout(() => {
      fetchCatalog({ page: 1, page_size: CATALOG_PAGE_SIZE, q: catalogQuery }, controller.signal)
        .then((res: CatalogListResponse) => {
          setFilteredCatalog(res.items.map(adaptCatalogBook))
          setCatalogBusy(false)
        })
        .catch((err: Error) => {
          if (isRequestCancelled(err)) return
          setCatalogError(err.message)
          setCatalogBusy(false)
        })
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [catalogQuery])

  // When there is no active search, list rows always mirror the loaded catalog.
  useEffect(() => {
    if (!catalogQuery.trim()) {
      setFilteredCatalog(catalog)
    }
  }, [catalog, catalogQuery])

  // ---- generateWithoutSources toggle --------------------------------------
  useEffect(() => {
    if (!generateWithoutSources) return
    setSelectedBookIds([])
    setSelectedTopics([])
    setTopicsIndexing(false)
    setCatalogQuery('')
  }, [generateWithoutSources])

  // ---- topic loading: when selectedBookIds changes ------------------------
  useEffect(() => {
    if (generateWithoutSources) return

    if (selectedBookIds.length === 0) {
      setAvailableTopics([])
      setSelectedTopics([])
      setTopicsIndexing(false)
      return
    }

    topicsAbortRef.current?.abort()
    const controller = new AbortController()
    topicsAbortRef.current = controller

    setTopicsIndexing(true)
    setTopicsError(null)

    fetchTopicsForPacks(selectedBookIds, controller.signal)
      .then((res: TopicsResponse) => {
        const labels = res.topics.map((t: { label: string; count: number }) => t.label).sort()
        setAvailableTopics(labels)
        // Prune selected topics to only those still available
        const labelSet = new Set(labels)
        setSelectedTopics((prev) => prev.filter((t) => labelSet.has(t)))
        setTopicsIndexing(false)
      })
      .catch((err: Error) => {
        if (isRequestCancelled(err)) return
        setTopicsError(err.message)
        setTopicsIndexing(false)
      })

    return () => {
      controller.abort()
    }
  }, [selectedBookIds, generateWithoutSources])

  // ---- scope preview: debounced, silent on error --------------------------
  useEffect(() => {
    if (selectedBookIds.length === 0) {
      setEstimatedSegments(0)
      return
    }

    previewAbortRef.current?.abort()
    const controller = new AbortController()
    previewAbortRef.current = controller

    const timer = window.setTimeout(() => {
      fetchScopePreview(selectedBookIds, selectedTopics, scopeRefinement || undefined, controller.signal)
        .then((res: ScopePreviewResponse) => {
          setEstimatedSegments(res.estimated_segments)
        })
        .catch((err: Error) => {
          // Silent: keep last value on error or abort
          if (!isRequestCancelled(err)) {
            console.warn('[useQuizRagScope] scope preview error (non-critical):', err.message)
          }
        })
    }, 500)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [selectedBookIds, selectedTopics, scopeRefinement])

  // ---- derived / memoised -------------------------------------------------

  const pool = catalog

  const topicOptionsFiltered = useMemo(() => {
    const q = topicQuery.trim().toLowerCase()
    if (!q) return availableTopics
    return availableTopics.filter((t) => t.toLowerCase().includes(q))
  }, [availableTopics, topicQuery])

  const combinedTopicLabel = useMemo(() => {
    const base = selectedTopics.join(' · ')
    return scopeRefinement.trim() ? `${base} — ${scopeRefinement.trim()}` : base || 'General scope'
  }, [selectedTopics, scopeRefinement])

  // ---- callbacks -----------------------------------------------------------

  const retryCatalog = useCallback(() => {
    setRetryCounter((n) => n + 1)
  }, [])

  const toggleBook = useCallback(
    (id: string) => {
      if (bookSelectionMode === 'single') {
        setSelectedBookIds((prev) => (prev[0] === id ? [] : [id]))
        return
      }
      setSelectedBookIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    },
    [bookSelectionMode],
  )

  const removeBook = useCallback((id: string) => {
    setSelectedBookIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    )
  }, [])

  const clearAllTopics = useCallback(() => setSelectedTopics([]), [])

  const getGenerationContext = useCallback((): GenerationSourceContext => {
    // Cast AdaptedBook to the minimal shape buildRagScopeGenerationContext
    // needs (only id and title are read back from allBooks via getBookById).
    // This avoids pulling in the full DemoBook type while keeping the
    // generation payload shape correct for downstream consumers.
    return buildRagScopeGenerationContext({
      subject,
      grade,
      materialMode: generateWithoutSources ? 'none' : 'system',
      groundingEnabled: !generateWithoutSources,
      selectedBookIds,
      selectedScopeTopics: selectedTopics,
      scopeRefinement,
      allBooks: catalog as never,
    })
  }, [subject, grade, generateWithoutSources, selectedBookIds, selectedTopics, scopeRefinement, catalog])

  const generationSignature = useMemo(
    () =>
      [
        subject,
        grade,
        generateWithoutSources ? 'nosource' : 'source',
        selectedBookIds.join(','),
        selectedTopics.join('|'),
        scopeRefinement,
      ].join('~'),
    [subject, grade, generateWithoutSources, selectedBookIds, selectedTopics, scopeRefinement],
  )

  const isDirty = useMemo(
    () =>
      selectedBookIds.length > 0 ||
      selectedTopics.length > 0 ||
      generateWithoutSources ||
      !!scopeRefinement.trim() ||
      !!catalogQuery ||
      !!topicQuery,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBookIds.length, selectedTopics.length, generateWithoutSources, scopeRefinement, catalogQuery, topicQuery],
  )

  const resetSources = useCallback(() => {
    setCatalogQuery('')
    setSelectedBookIds([])
    setSelectedTopics([])
    setScopeRefinement('')
    setGenerateWithoutSources(false)
    setTopicQuery('')
  }, [])

  const ragSourceLabels = useMemo(
    () =>
      selectedBookIds
        .map((id) => catalog.find((b) => b.id === id))
        .filter((b): b is AdaptedBook => Boolean(b))
        .map((b) => {
          const t = b.title
          return t.length > 40 ? `${t.slice(0, 38)}\u2026` : t
        }),
    [selectedBookIds, catalog],
  )

  // ---- return shape --------------------------------------------------------

  return {
    catalog,
    pool,
    catalogQuery,
    setCatalogQuery,
    filteredCatalog,
    catalogBusy,
    catalogError,
    retryCatalog,
    generateWithoutSources,
    setGenerateWithoutSources,
    selectedBookIds,
    toggleBook,
    removeBook,
    topicQuery,
    setTopicQuery,
    availableTopics,
    topicOptionsFiltered,
    topicsIndexing,
    topicsError,
    selectedTopics,
    toggleTopic,
    clearAllTopics,
    scopeRefinement,
    setScopeRefinement,
    estimatedSegments,
    combinedTopicLabel,
    getGenerationContext,
    generationSignature,
    isDirty,
    resetSources,
    ragSourceLabels,
  }
}

export type QuizRagScopeModel = ReturnType<typeof useQuizRagScope>

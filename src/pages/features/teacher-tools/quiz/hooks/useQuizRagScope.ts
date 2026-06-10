import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  adaptCatalogBook,
  fetchCatalog,
  fetchCatalogStructure,
  fetchScopePreview,
  fetchTopicsForPacks,
  type AdaptedBook,
  type CatalogListResponse,
  type CatalogStructureResponse,
  type PackStructure,
  type ScopePreviewResponse,
  type TopicNode,
  type TopicsResponse,
} from '../../../../../api/quizCatalog'
import { buildRagScopeGenerationContext, type GenerationSourceContext } from '../../demo/generationFromSources'

function isRequestCancelled(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { name?: string; message?: string }
  if (e.name === 'AbortError') return true
  return typeof e.message === 'string' && e.message.toLowerCase().includes('request was cancelled')
}

function collectTopicIds(node: TopicNode, includeChildren = true): string[] {
  if (node.chunk_count === 0) return []
  const ids = [node.id]
  if (includeChildren) {
    for (const child of node.children) {
      ids.push(...collectTopicIds(child, true))
    }
  }
  return ids
}

function findTopicTitle(structure: CatalogStructureResponse | null, topicId: string): string | null {
  for (const pack of structure?.packs ?? []) {
    for (const doc of pack.documents) {
      const walk = (nodes: TopicNode[]): string | null => {
        for (const n of nodes) {
          if (n.id === topicId) return n.display_title
          const child = walk(n.children)
          if (child) return child
        }
        return null
      }
      const title = walk(doc.topic_tree)
      if (title) return title
    }
  }
  return null
}

export interface UseQuizRagScopeOptions {
  subject: string
  grade: string
  extraBooks?: unknown[]
  initialSelectedBookIds?: string[]
  initialScopeTopics?: string[]
  initialScopeTopicIds?: string[]
  initialScopeRefinement?: string
  initialGenerateWithoutSources?: boolean
  bookSelectionMode?: 'multi' | 'single'
}

export function useQuizRagScope({
  subject,
  grade,
  initialSelectedBookIds,
  initialScopeTopics,
  initialScopeTopicIds,
  initialScopeRefinement,
  initialGenerateWithoutSources,
  bookSelectionMode = 'multi',
}: UseQuizRagScopeOptions) {
  const [catalog, setCatalog] = useState<AdaptedBook[]>([])
  const [filteredCatalog, setFilteredCatalog] = useState<AdaptedBook[]>([])
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogBusy, setCatalogBusy] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)

  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(() => initialSelectedBookIds ?? [])
  const [generateWithoutSources, setGenerateWithoutSources] = useState(
    () => initialGenerateWithoutSources ?? false,
  )

  const [catalogStructure, setCatalogStructure] = useState<CatalogStructureResponse | null>(null)
  const [structureLoading, setStructureLoading] = useState(false)
  const [structureError, setStructureError] = useState<string | null>(null)
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(
    () => new Set(initialScopeTopicIds ?? []),
  )

  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => initialScopeTopics ?? [])
  const [topicQuery, setTopicQuery] = useState('')
  const [topicsIndexing, setTopicsIndexing] = useState(false)
  const [topicsError, setTopicsError] = useState<string | null>(null)

  const [scopeRefinement, setScopeRefinement] = useState(initialScopeRefinement ?? '')
  const [estimatedSegments, setEstimatedSegments] = useState(0)
  const [scopePreviewLoading, setScopePreviewLoading] = useState(false)
  const [scopeError, setScopeError] = useState<string | null>(null)
  const [perDocumentPreview, setPerDocumentPreview] = useState<ScopePreviewResponse['per_document']>([])

  const catalogLoadAbortRef = useRef<AbortController | null>(null)
  const catalogSearchAbortRef = useRef<AbortController | null>(null)
  const structureAbortRef = useRef<AbortController | null>(null)
  const topicsAbortRef = useRef<AbortController | null>(null)
  const previewAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (initialSelectedBookIds === undefined) return
    setSelectedBookIds(
      bookSelectionMode === 'single' && initialSelectedBookIds.length > 1
        ? [initialSelectedBookIds[0]!]
        : initialSelectedBookIds,
    )
  }, [initialSelectedBookIds, bookSelectionMode])

  useEffect(() => {
    if (initialScopeTopicIds === undefined) return
    setSelectedTopicIds(new Set(initialScopeTopicIds))
  }, [initialScopeTopicIds])

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

  const CATALOG_PAGE_SIZE = 100

  useEffect(() => {
    catalogLoadAbortRef.current?.abort()
    const controller = new AbortController()
    catalogLoadAbortRef.current = controller
    setCatalogBusy(true)
    setCatalogError(null)
    setCatalog([])
    fetchCatalog({ page: 1, page_size: CATALOG_PAGE_SIZE }, controller.signal)
      .then((res: CatalogListResponse) => {
        setCatalog(res.items.map(adaptCatalogBook))
        setCatalogBusy(false)
      })
      .catch((err: Error) => {
        if (isRequestCancelled(err)) return
        setCatalogError(err.message)
        setCatalogBusy(false)
      })
    return () => controller.abort()
  }, [retryCounter])

  useEffect(() => {
    if (!catalogQuery.trim()) return
    catalogSearchAbortRef.current?.abort()
    const controller = new AbortController()
    catalogSearchAbortRef.current = controller
    setCatalogBusy(true)
    setCatalogError(null)
    const timer = window.setTimeout(() => {
      fetchCatalog({ page: 1, page_size: CATALOG_PAGE_SIZE, q: catalogQuery }, controller.signal)
        .then((res) => {
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

  useEffect(() => {
    if (!catalogQuery.trim()) setFilteredCatalog(catalog)
  }, [catalog, catalogQuery])

  useEffect(() => {
    if (!generateWithoutSources) return
    setSelectedBookIds([])
    setSelectedTopicIds(new Set())
    setSelectedTopics([])
    setCatalogStructure(null)
    setTopicsIndexing(false)
    setCatalogQuery('')
  }, [generateWithoutSources])

  useEffect(() => {
    if (generateWithoutSources || selectedBookIds.length === 0) {
      setCatalogStructure(null)
      setStructureLoading(false)
      return
    }

    structureAbortRef.current?.abort()
    const controller = new AbortController()
    structureAbortRef.current = controller
    setStructureLoading(true)
    setStructureError(null)

    fetchCatalogStructure(selectedBookIds, controller.signal)
      .then((res) => {
        setCatalogStructure(res)
        setStructureLoading(false)
        if (res.packs.every((p) => p.documents.every((d) => d.topic_tree.length === 0))) {
          topicsAbortRef.current?.abort()
          const tc = new AbortController()
          topicsAbortRef.current = tc
          setTopicsIndexing(true)
          fetchTopicsForPacks(selectedBookIds, tc.signal)
            .then((topicsRes: TopicsResponse) => {
              setAvailableTopics(topicsRes.topics.map((t) => t.label).sort())
              setTopicsIndexing(false)
            })
            .catch(() => setTopicsIndexing(false))
        }
      })
      .catch((err: Error) => {
        if (isRequestCancelled(err)) return
        setStructureError(err.message)
        setStructureLoading(false)
      })

    return () => controller.abort()
  }, [selectedBookIds, generateWithoutSources])

  const allSelectedTopicIds = useMemo(() => Array.from(selectedTopicIds), [selectedTopicIds])

  const selectedTopicTitles = useMemo(() => {
    const titles = allSelectedTopicIds
      .map((id) => findTopicTitle(catalogStructure, id))
      .filter((t): t is string => Boolean(t))
    return titles.length > 0 ? titles : selectedTopics
  }, [allSelectedTopicIds, catalogStructure, selectedTopics])

  useEffect(() => {
    if (selectedBookIds.length === 0) {
      setEstimatedSegments(0)
      setScopeError(null)
      setPerDocumentPreview([])
      return
    }

    previewAbortRef.current?.abort()
    const controller = new AbortController()
    previewAbortRef.current = controller
    setScopePreviewLoading(true)

    const timer = window.setTimeout(() => {
      fetchScopePreview(
        selectedBookIds,
        allSelectedTopicIds,
        selectedTopics,
        scopeRefinement || undefined,
        controller.signal,
      )
        .then((res) => {
          setEstimatedSegments(res.estimated_segments)
          setPerDocumentPreview(res.per_document ?? [])
          setScopeError(
            allSelectedTopicIds.length > 0 && res.estimated_segments === 0
              ? 'No content found for selected chapters.'
              : null,
          )
          setScopePreviewLoading(false)
        })
        .catch((err: Error) => {
          if (!isRequestCancelled(err)) {
            setScopeError(err.message)
          }
          setScopePreviewLoading(false)
        })
    }, 500)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [selectedBookIds, allSelectedTopicIds, selectedTopics, scopeRefinement])

  const pool = catalog

  const topicOptionsFiltered = useMemo(() => {
    const q = topicQuery.trim().toLowerCase()
    if (!q) return availableTopics
    return availableTopics.filter((t) => t.toLowerCase().includes(q))
  }, [availableTopics, topicQuery])

  const combinedTopicLabel = useMemo(() => {
    const base = selectedTopicTitles.join(' · ')
    return scopeRefinement.trim() ? `${base} — ${scopeRefinement.trim()}` : base || 'General scope'
  }, [selectedTopicTitles, scopeRefinement])

  const hasScope = generateWithoutSources || allSelectedTopicIds.length > 0 || selectedTopics.length > 0

  const scopeSummaryLabel = useMemo(() => {
    const books = selectedBookIds.length
    const chapters = allSelectedTopicIds.length || selectedTopics.length
    return `${books} book${books !== 1 ? 's' : ''} · ${chapters} chapter${chapters !== 1 ? 's' : ''} · ${estimatedSegments} segments`
  }, [selectedBookIds.length, allSelectedTopicIds.length, selectedTopics.length, estimatedSegments])

  const selectedPackStructures = useMemo((): PackStructure[] => {
    if (!catalogStructure) return []
    return catalogStructure.packs.filter((p) => selectedBookIds.includes(p.pack_id))
  }, [catalogStructure, selectedBookIds])

  const retryCatalog = useCallback(() => setRetryCounter((n) => n + 1), [])

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

  const clearBookScope = useCallback((packId: string) => {
    const pack = catalogStructure?.packs.find((p) => p.pack_id === packId)
    if (!pack) return
    const ids = new Set(
      pack.documents.flatMap((d) => d.topic_tree.flatMap((n) => collectTopicIds(n, true))),
    )
    setSelectedTopicIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }, [catalogStructure])

  const toggleTopicId = useCallback(
    (topicId: string, includeChildren = true) => {
      const pack = catalogStructure?.packs.find((p) =>
        p.documents.some((d) => {
          const walk = (nodes: TopicNode[]): boolean =>
            nodes.some((n) => n.id === topicId || walk(n.children))
          return walk(d.topic_tree)
        }),
      )
      let ids = [topicId]
      if (pack && includeChildren) {
        for (const doc of pack.documents) {
          const walk = (nodes: TopicNode[]): TopicNode | null => {
            for (const n of nodes) {
              if (n.id === topicId) return n
              const found = walk(n.children)
              if (found) return found
            }
            return null
          }
          const node = walk(doc.topic_tree)
          if (node) ids = collectTopicIds(node, true)
        }
      }
      setSelectedTopicIds((prev) => {
        const next = new Set(prev)
        const allSelected = ids.every((id) => next.has(id))
        if (allSelected) ids.forEach((id) => next.delete(id))
        else ids.forEach((id) => next.add(id))
        return next
      })
    },
    [catalogStructure],
  )

  const toggleDocumentTopics = useCallback((topicIds: string[]) => {
    setSelectedTopicIds((prev) => {
      const next = new Set(prev)
      const allSelected = topicIds.length > 0 && topicIds.every((id) => next.has(id))
      if (allSelected) topicIds.forEach((id) => next.delete(id))
      else topicIds.forEach((id) => next.add(id))
      return next
    })
  }, [])

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    )
  }, [])

  const clearAllScope = useCallback(() => {
    setSelectedTopicIds(new Set())
    setSelectedTopics([])
  }, [])

  const clearAllTopics = clearAllScope

  const getGenerationContext = useCallback((): GenerationSourceContext => {
    return buildRagScopeGenerationContext({
      subject,
      grade,
      materialMode: generateWithoutSources ? 'none' : 'system',
      groundingEnabled: !generateWithoutSources,
      selectedBookIds,
      selectedScopeTopics: selectedTopicTitles,
      scopeRefinement,
      allBooks: catalog as never,
    })
  }, [subject, grade, generateWithoutSources, selectedBookIds, selectedTopicTitles, scopeRefinement, catalog])

  const generationSignature = useMemo(
    () =>
      [
        subject,
        grade,
        generateWithoutSources ? 'nosource' : 'source',
        selectedBookIds.join(','),
        allSelectedTopicIds.join('|'),
        selectedTopics.join('|'),
        scopeRefinement,
      ].join('~'),
    [subject, grade, generateWithoutSources, selectedBookIds, allSelectedTopicIds, selectedTopics, scopeRefinement],
  )

  const isDirty = useMemo(
    () =>
      selectedBookIds.length > 0 ||
      allSelectedTopicIds.length > 0 ||
      selectedTopics.length > 0 ||
      generateWithoutSources ||
      !!scopeRefinement.trim() ||
      !!catalogQuery ||
      !!topicQuery,
    [
      selectedBookIds.length,
      allSelectedTopicIds.length,
      selectedTopics.length,
      generateWithoutSources,
      scopeRefinement,
      catalogQuery,
      topicQuery,
    ],
  )

  const resetSources = useCallback(() => {
    setCatalogQuery('')
    setSelectedBookIds([])
    setSelectedTopicIds(new Set())
    setSelectedTopics([])
    setScopeRefinement('')
    setGenerateWithoutSources(false)
    setTopicQuery('')
    setScopeError(null)
  }, [])

  const applySourceSnapshot = useCallback(
    (snap: {
      bookIds?: string[]
      topics?: string[]
      topicIds?: string[]
      refinement?: string
      generateWithoutSources?: boolean
    }) => {
      if (snap.generateWithoutSources != null) setGenerateWithoutSources(snap.generateWithoutSources)
      if (snap.bookIds) setSelectedBookIds(snap.bookIds)
      if (snap.topicIds) setSelectedTopicIds(new Set(snap.topicIds))
      if (snap.topics) setSelectedTopics(snap.topics)
      if (snap.refinement != null) setScopeRefinement(snap.refinement)
    },
    [],
  )

  const ragSourceLabels = useMemo(
    () =>
      selectedBookIds
        .map((id) => catalog.find((b) => b.id === id))
        .filter((b): b is AdaptedBook => Boolean(b))
        .map((b) => (b.title.length > 40 ? `${b.title.slice(0, 38)}…` : b.title)),
    [selectedBookIds, catalog],
  )

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
    catalogStructure,
    structureLoading,
    structureError,
    selectedPackStructures,
    selectedTopicIds,
    allSelectedTopicIds,
    toggleTopicId,
    toggleDocumentTopics,
    clearBookScope,
    topicQuery,
    setTopicQuery,
    availableTopics,
    topicOptionsFiltered,
    topicsIndexing: topicsIndexing || structureLoading,
    topicsError: topicsError || structureError,
    selectedTopics: selectedTopicTitles,
    toggleTopic,
    clearAllTopics,
    clearAllScope,
    scopeRefinement,
    setScopeRefinement,
    estimatedSegments,
    scopePreviewLoading,
    scopeError,
    perDocumentPreview,
    hasScope,
    scopeSummaryLabel,
    combinedTopicLabel,
    getGenerationContext,
    generationSignature,
    isDirty,
    resetSources,
    applySourceSnapshot,
    ragSourceLabels,
  }
}

export type QuizRagScopeModel = ReturnType<typeof useQuizRagScope>

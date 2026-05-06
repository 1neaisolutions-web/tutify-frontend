import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DemoBook, MaterialSourceKind } from '../demo/demoContentLibrary'
import {
  SYSTEM_BOOKS,
  getBooksForSubjectGrade,
  getTopicsForSubject,
  searchBooks,
} from '../demo/demoContentLibrary'
import { buildGenerationContext, type GenerationSourceContext } from '../demo/generationFromSources'

export interface UseContentSourcesFormOptions {
  subject: string
  grade: string
  /** Reserved for future admin-seeded catalog entries; optional. */
  extraBooks?: DemoBook[]
  /** When editing an item, align topic preset to saved topic label. */
  initialTopic?: string
}

export function useContentSourcesForm({ subject, grade, extraBooks = [], initialTopic }: UseContentSourcesFormOptions) {
  const topicsForSubject = useMemo(() => getTopicsForSubject(subject), [subject])
  const [materialMode, setMaterialMode] = useState<MaterialSourceKind>('system')
  const [topicPreset, setTopicPreset] = useState(() => topicsForSubject[0] ?? '')
  const [topicRefinement, setTopicRefinement] = useState('')
  const [selectedBookId, setSelectedBookId] = useState('')
  const [chapterIds, setChapterIds] = useState<string[]>([])
  const [groundingEnabled, setGroundingEnabled] = useState(true)
  const [bookSearchQuery, setBookSearchQuery] = useState('')

  useEffect(() => {
    if (initialTopic) {
      const list = getTopicsForSubject(subject)
      if (list.includes(initialTopic)) {
        setTopicPreset(initialTopic)
        setTopicRefinement('')
        return
      }
      setTopicPreset(list[0] ?? '')
      setTopicRefinement(initialTopic)
      return
    }
    setTopicPreset((prev) => {
      const list = getTopicsForSubject(subject)
      if (list.includes(prev)) return prev
      return list[0] ?? ''
    })
  }, [subject, initialTopic])

  const catalog = useMemo(() => [...SYSTEM_BOOKS, ...extraBooks], [extraBooks])

  const effectiveBooks = useMemo(
    () => getBooksForSubjectGrade(subject, grade, extraBooks),
    [subject, grade, extraBooks]
  )

  const filteredBooks = useMemo(
    () => searchBooks(bookSearchQuery, effectiveBooks),
    [bookSearchQuery, effectiveBooks]
  )

  useEffect(() => {
    setChapterIds([])
  }, [selectedBookId])

  useEffect(() => {
    if (materialMode !== 'system') {
      setSelectedBookId('')
      setChapterIds([])
    }
  }, [materialMode])

  const toggleChapter = useCallback((id: string) => {
    setChapterIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const getGenerationContext = useCallback((): GenerationSourceContext => {
    const topic = topicPreset || topicsForSubject[0] || 'General'
    return buildGenerationContext({
      subject,
      grade,
      topic,
      topicRefinement,
      materialMode,
      groundingEnabled,
      selectedBookId,
      chapterIds,
      uploadedMaterialTitle: undefined,
      allBooks: catalog,
    })
  }, [
    subject,
    grade,
    topicPreset,
    topicRefinement,
    materialMode,
    groundingEnabled,
    selectedBookId,
    chapterIds,
    catalog,
    topicsForSubject,
  ])

  const combinedTopicLabel = useMemo(() => {
    const base = topicPreset || topicsForSubject[0] || 'General'
    return topicRefinement ? `${base} — ${topicRefinement}` : base
  }, [topicPreset, topicRefinement, topicsForSubject])

  const generationSignature = useMemo(
    () =>
      [
        subject,
        grade,
        topicPreset,
        topicRefinement,
        materialMode,
        selectedBookId,
        chapterIds.join(','),
        groundingEnabled ? '1' : '0',
      ].join('|'),
    [subject, grade, topicPreset, topicRefinement, materialMode, selectedBookId, chapterIds, groundingEnabled]
  )

  const isDirty = useMemo(() => {
    return (
      materialMode !== 'system' ||
      !!topicRefinement ||
      !!selectedBookId ||
      chapterIds.length > 0 ||
      !groundingEnabled
    )
  }, [materialMode, topicRefinement, selectedBookId, chapterIds.length, groundingEnabled])

  const resetSources = useCallback(() => {
    setMaterialMode('system')
    setTopicRefinement('')
    setSelectedBookId('')
    setChapterIds([])
    setGroundingEnabled(true)
    setBookSearchQuery('')
  }, [])

  return {
    topicsForSubject,
    materialMode,
    setMaterialMode,
    topicPreset,
    setTopicPreset,
    topicRefinement,
    setTopicRefinement,
    selectedBookId,
    setSelectedBookId,
    chapterIds,
    setChapterIds,
    toggleChapter,
    groundingEnabled,
    setGroundingEnabled,
    bookSearchQuery,
    setBookSearchQuery,
    effectiveBooks,
    filteredBooks,
    catalog,
    getGenerationContext,
    combinedTopicLabel,
    generationSignature,
    isDirty,
    resetSources,
  }
}

export type ContentSourcesFormModel = ReturnType<typeof useContentSourcesForm>

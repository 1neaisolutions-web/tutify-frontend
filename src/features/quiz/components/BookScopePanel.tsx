import { useMemo, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import type { PackStructure, TopicNode } from '../../../api/quizCatalog'

type Props = {
  packStructure: PackStructure
  selectedTopicIds: Set<string>
  onToggleTopic: (topicId: string, includeChildren: boolean, leafOnly?: boolean) => void
  onToggleDocument: (documentId: string, topicIds: string[]) => void
  onRemoveBook: () => void
  filterQuery?: string
}

function collectSelectableIds(node: TopicNode, includeChildren: boolean): string[] {
  if (node.chunk_count === 0) return []
  const ids = [node.id]
  if (includeChildren) {
    for (const child of node.children) {
      ids.push(...collectSelectableIds(child, true))
    }
  }
  return ids
}

function isNodeFullySelected(node: TopicNode, selected: Set<string>): boolean {
  const ids = collectSelectableIds(node, true)
  return ids.length > 0 && ids.every((id) => selected.has(id))
}

function hasAnySectionTopics(tree: TopicNode[]): boolean {
  return tree.some((n) => n.children.length > 0)
}

function nodeMatchesFilter(node: TopicNode, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (node.display_title.toLowerCase().includes(q)) return true
  return node.children.some((child) => nodeMatchesFilter(child, q))
}

function collectAncestorIdsForMatches(
  nodes: TopicNode[],
  query: string,
  ancestors: string[] = [],
): Set<string> {
  const ids = new Set<string>()
  const q = query.trim().toLowerCase()
  if (!q) return ids

  for (const node of nodes) {
    const path = [...ancestors, node.id]
    const selfMatch = node.display_title.toLowerCase().includes(q)
    const childIds = collectAncestorIdsForMatches(node.children, query, path)
    if (selfMatch || childIds.size > 0) {
      for (const id of ancestors) ids.add(id)
      if (node.children.length > 0) ids.add(node.id)
      childIds.forEach((id) => ids.add(id))
    }
  }
  return ids
}

function TopicTreeRow({
  node,
  depth,
  selectedTopicIds,
  onToggleTopic,
  expanded,
  onToggleExpand,
  filterQuery,
}: {
  node: TopicNode
  depth: number
  selectedTopicIds: Set<string>
  onToggleTopic: (topicId: string, includeChildren: boolean, leafOnly?: boolean) => void
  expanded: Set<string>
  onToggleExpand: (id: string) => void
  filterQuery: string
}) {
  const { t } = useTranslation()
  const hasChildren = node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const disabled = node.chunk_count === 0
  const selected = hasChildren
    ? isNodeFullySelected(node, selectedTopicIds)
    : selectedTopicIds.has(node.id)

  if (!nodeMatchesFilter(node, filterQuery)) return null

  const visibleChildren = hasChildren
    ? node.children.filter((child) => nodeMatchesFilter(child, filterQuery))
    : []

  const handleRowClick = () => {
    if (disabled) return
    if (hasChildren) {
      onToggleExpand(node.id)
      return
    }
    onToggleTopic(node.id, false, true)
  }

  const handleSelectChapter = (e: MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    onToggleTopic(node.id, true, false)
  }

  return (
    <>
      <div
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${disabled ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleRowClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleRowClick()
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
            className="shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-100"
            aria-label={isExpanded ? t('teacherTools.collapseChapter') : t('teacherTools.expandChapter')}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <div
          className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border px-2 py-1 ${
            selected ? 'border-violet-500 bg-violet-50' : 'border-transparent'
          }`}
        >
          <span className="truncate font-medium text-gray-900">{node.display_title}</span>
          <span className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
            {selected ? <Check className="h-3.5 w-3.5 text-violet-600" /> : null}
            {t('teacherTools.sectionsCount', { count: node.chunk_count })}
            {hasChildren ? (
              <button
                type="button"
                disabled={disabled}
                onClick={handleSelectChapter}
                className="rounded-md bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 hover:bg-violet-200 disabled:opacity-50"
              >
                {selected ? t('teacherTools.clearChapter') : t('teacherTools.selectChapter')}
              </button>
            ) : null}
          </span>
        </div>
      </div>
      {hasChildren && isExpanded
        ? visibleChildren.map((child) => (
            <TopicTreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedTopicIds={selectedTopicIds}
              onToggleTopic={onToggleTopic}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              filterQuery={filterQuery}
            />
          ))
        : null}
    </>
  )
}

export function BookScopePanel({
  packStructure,
  selectedTopicIds,
  onToggleTopic,
  onToggleDocument,
  onRemoveBook,
  filterQuery = '',
}: Props) {
  const { t } = useTranslation()
  const [userExpanded, setUserExpanded] = useState<Set<string>>(() => new Set())
  const [bookExpanded, setBookExpanded] = useState(false)
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(() => new Set())

  const totalChunks = useMemo(
    () => packStructure.documents.reduce((n, d) => n + d.total_chunks, 0),
    [packStructure.documents],
  )

  const showChapterOnlyHint = useMemo(
    () => packStructure.documents.every((d) => !hasAnySectionTopics(d.topic_tree)),
    [packStructure.documents],
  )

  const searchExpanded = useMemo(() => {
    const q = filterQuery.trim()
    if (!q) return new Set<string>()
    const ids = new Set<string>()
    for (const doc of packStructure.documents) {
      const docMatch = doc.document_title.toLowerCase().includes(q.toLowerCase())
      const treeIds = collectAncestorIdsForMatches(doc.topic_tree, q)
      if (docMatch || treeIds.size > 0) {
        ids.add(doc.document_id)
        treeIds.forEach((id) => ids.add(id))
      }
    }
    return ids
  }, [filterQuery, packStructure.documents])

  const expanded = useMemo(() => {
    if (filterQuery.trim()) {
      return new Set([...userExpanded, ...searchExpanded])
    }
    return userExpanded
  }, [filterQuery, userExpanded, searchExpanded])

  const selectedInPack = useMemo(() => {
    let count = 0
    for (const doc of packStructure.documents) {
      const walk = (nodes: TopicNode[]) => {
        for (const node of nodes) {
          if (selectedTopicIds.has(node.id) && node.chunk_count > 0) count += 1
          walk(node.children)
        }
      }
      walk(doc.topic_tree)
    }
    return count
  }, [packStructure.documents, selectedTopicIds])

  const toggleExpand = (id: string) => {
    setUserExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDocument = (docId: string) => {
    setExpandedDocuments((prev) => {
      const next = new Set(prev)
      if (next.has(docId)) next.delete(docId)
      else next.add(docId)
      return next
    })
  }

  const isDocVisible = (doc: (typeof packStructure.documents)[number]) => {
    const q = filterQuery.trim().toLowerCase()
    if (!q) return true
    if (doc.document_title.toLowerCase().includes(q)) return true
    return doc.topic_tree.some((n) => nodeMatchesFilter(n, filterQuery))
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => setBookExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-start gap-2 text-left"
          aria-expanded={bookExpanded}
        >
          {bookExpanded ? (
            <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
          ) : (
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{packStructure.pack_name}</p>
            <p className="text-xs text-gray-500">
              {t('teacherTools.sectionsIndexedMeta', {
                documents: packStructure.documents.length,
                count: totalChunks,
              })}
              {selectedInPack > 0
                ? ` · ${t('teacherTools.chapterCount', { count: selectedInPack })}`
                : ''}
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={onRemoveBook}
          className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-700"
        >
          {t('teacherTools.remove')}
        </button>
      </div>

      {bookExpanded ? (
        <>
          {showChapterOnlyHint && (
            <p className="mt-3 text-xs text-gray-600">{t('quiz.rag.chapterScopeOnlyHint')}</p>
          )}

          <div className="mt-4 max-h-96 space-y-4 overflow-y-auto">
            {packStructure.documents.filter(isDocVisible).map((doc) => {
              const allIds = doc.topic_tree.flatMap((n) => collectSelectableIds(n, true))
              const allSelected = allIds.length > 0 && allIds.every((id) => selectedTopicIds.has(id))
              const docOpen = expandedDocuments.has(doc.document_id) || Boolean(filterQuery.trim())
              return (
                <div key={doc.document_id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDocument(doc.document_id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      aria-expanded={docOpen}
                    >
                      {docOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
                      )}
                      <p className="truncate text-sm font-medium text-gray-900">{doc.document_title}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleDocument(doc.document_id, allIds)}
                      className="shrink-0 text-xs font-semibold text-violet-700 hover:text-violet-600"
                    >
                      {allSelected ? t('quiz.rag.clearDocument') : t('quiz.rag.selectAllDocument')}
                    </button>
                  </div>
                  {docOpen ? (
                    <div className="mt-2">
                      {doc.topic_tree.map((node) => (
                        <TopicTreeRow
                          key={node.id}
                          node={node}
                          depth={0}
                          selectedTopicIds={selectedTopicIds}
                          onToggleTopic={onToggleTopic}
                          expanded={expanded}
                          onToggleExpand={toggleExpand}
                          filterQuery={filterQuery}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

/**
 * Collect display titles for selected topic IDs from pack structures (display-only chips).
 */
export function collectSelectedTopicLabels(
  packs: PackStructure[],
  selectedTopicIds: Set<string>,
): string[] {
  const labels: string[] = []
  const seen = new Set<string>()
  const walk = (nodes: TopicNode[]) => {
    for (const node of nodes) {
      if (selectedTopicIds.has(node.id) && node.chunk_count > 0 && !seen.has(node.id)) {
        seen.add(node.id)
        labels.push(node.display_title)
      }
      walk(node.children)
    }
  }
  for (const pack of packs) {
    for (const doc of pack.documents) {
      walk(doc.topic_tree)
    }
  }
  return labels
}

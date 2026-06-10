import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Check, ChevronDown, ChevronRight } from 'lucide-react'
import type { PackStructure, TopicNode } from '../../../api/quizCatalog'

type Props = {
  packStructure: PackStructure
  selectedTopicIds: Set<string>
  onToggleTopic: (topicId: string, includeChildren: boolean) => void
  onToggleDocument: (documentId: string, topicIds: string[]) => void
  onRemoveBook: () => void
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

function TopicTreeRow({
  node,
  depth,
  selectedTopicIds,
  onToggleTopic,
  expanded,
  onToggleExpand,
}: {
  node: TopicNode
  depth: number
  selectedTopicIds: Set<string>
  onToggleTopic: (topicId: string, includeChildren: boolean) => void
  expanded: Set<string>
  onToggleExpand: (id: string) => void
}) {
  const hasChildren = node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const disabled = node.chunk_count === 0
  const selected = selectedTopicIds.has(node.id)

  return (
    <>
      <div
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${disabled ? 'opacity-50' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpand(node.id)}
            className="shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-100"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggleTopic(node.id, true)}
          className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border px-2 py-1 text-left ${
            selected ? 'border-violet-500 bg-violet-50' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <span className="truncate font-medium text-gray-900">{node.display_title}</span>
          <span className="shrink-0 text-xs text-gray-500">
            {selected ? <Check className="inline h-3.5 w-3.5 text-violet-600" /> : null}{' '}
            {node.chunk_count} chunks
          </span>
        </button>
      </div>
      {hasChildren && isExpanded
        ? node.children.map((child) => (
            <TopicTreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedTopicIds={selectedTopicIds}
              onToggleTopic={onToggleTopic}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
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
}: Props) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())

  const totalChunks = useMemo(
    () => packStructure.documents.reduce((n, d) => n + d.total_chunks, 0),
    [packStructure.documents],
  )

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{packStructure.pack_name}</p>
          <p className="text-xs text-gray-500">
            {packStructure.documents.length} documents · {totalChunks} chunks indexed
          </p>
        </div>
        <button
          type="button"
          onClick={onRemoveBook}
          className="text-xs font-semibold text-red-600 hover:text-red-700"
        >
          {t('teacherTools.remove')}
        </button>
      </div>

      {packStructure.documents.some((d) => d.has_page_bin_fallbacks) && (
        <div className="mt-3 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {t('quiz.rag.approximateChapterMap')}
        </div>
      )}

      <div className="mt-4 space-y-4">
        {packStructure.documents.map((doc) => {
          const allIds = doc.topic_tree.flatMap((n) => collectSelectableIds(n, true))
          const allSelected = allIds.length > 0 && allIds.every((id) => selectedTopicIds.has(id))
          return (
            <div key={doc.document_id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-gray-900">{doc.document_title}</p>
                <button
                  type="button"
                  onClick={() => onToggleDocument(doc.document_id, allIds)}
                  className="shrink-0 text-xs font-semibold text-violet-700 hover:text-violet-600"
                >
                  {allSelected ? t('quiz.rag.clearDocument') : t('quiz.rag.selectAllDocument')}
                </button>
              </div>
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
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

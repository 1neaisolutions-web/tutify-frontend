import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  AlertCircle,
  History as HistoryIcon,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { clearHistory, type HistoryItem, type HistorySourceType } from '../../api/historyApi'
import { apiRequest } from '../../api/client'
import * as examApi from '../../api/examApi'
import {
  useGetHistoryQuotaQuery,
  useGetHistoryStatsQuery,
  useListHistoryQuery,
  useTogglePinMutation,
} from '../../redux/features/history/historyApiSlice'
import { historyApiSlice } from '../../redux/features/history/historyApiSlice'
import { useDuplicateAssignmentMutation } from '../../redux/features/teacherTools/assignment/assignmentApiSlice'
import { useDuplicateQuizMutation } from '../../redux/features/teacherTools/quiz/quizApiSlice'
import { useDuplicateWorksheetMutation } from '../../redux/features/teacherTools/worksheet/worksheetApiSlice'
import { TeacherToolsBulkActionBar } from './teacher-tools/components'
import { CustomModal } from '../../components/shared/CustomModal'
import { useSnackbar } from '../../hooks/useSnackbar'

import { HistoryCard } from './history/HistoryCard'
import { HistoryDetailPanel } from './history/HistoryDetailPanel'
import { DELETE_PATH_MAP, getItemRoute } from './history/historyRouting'

const SOURCE_LABELS: Record<HistorySourceType, string> = {
  quiz: 'Quiz',
  assignment: 'Assignment',
  worksheet: 'Worksheet',
  exam: 'Exam',
  chatbot_conversation: 'Chatbot',
  pixgen_generation: 'PixGen',
  youtube_quiz: 'YouTube Quiz',
  template_execution: 'Template',
}

const ALL_SOURCE_TYPES: HistorySourceType[] = [
  'quiz',
  'assignment',
  'worksheet',
  'exam',
  'chatbot_conversation',
  'pixgen_generation',
  'youtube_quiz',
  'template_execution',
]

const PAGE_SIZE = 20
const CHATBOT_GROUP_WINDOW_MS = 30 * 60 * 1000

type GroupedHistoryItem = HistoryItem & {
  __collapsedIds?: string[]
}

function collapseChatbotHistoryItems(items: HistoryItem[]): GroupedHistoryItem[] {
  // Collapse consecutive chatbot_conversation items with the same (chatbot_slug, title)
  // within a 30-minute window.
  const out: GroupedHistoryItem[] = []

  for (const item of items) {
    if (item.sourceType !== 'chatbot_conversation') {
      out.push(item)
      continue
    }

    const last = out[out.length - 1]
    if (!last || last.sourceType !== 'chatbot_conversation') {
      out.push(item)
      continue
    }

    const slugA = String((last.meta as any)?.chatbot_slug ?? '')
    const slugB = String((item.meta as any)?.chatbot_slug ?? '')
    if (!slugA || !slugB || slugA !== slugB) {
      out.push(item)
      continue
    }

    if ((last.title ?? '') !== (item.title ?? '')) {
      out.push(item)
      continue
    }

    const tLast = new Date(last.updatedAt ?? last.createdAt).getTime()
    const tCur = new Date(item.updatedAt ?? item.createdAt).getTime()
    if (!Number.isFinite(tLast) || !Number.isFinite(tCur) || Math.abs(tLast - tCur) > CHATBOT_GROUP_WINDOW_MS) {
      out.push(item)
      continue
    }

    // Keep the most-recent item as the "card" and stash prior ids for display only.
    const collapsed = last.__collapsedIds ? [...last.__collapsedIds] : []
    collapsed.push(last.id)
    out[out.length - 1] = { ...item, __collapsedIds: collapsed }
  }

  return out
}

const History = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useSnackbar()

  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<HistorySourceType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [dateRangePreset, setDateRangePreset] = useState<string>('All')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [page, setPage] = useState(1)

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkDeletePending, setBulkDeletePending] = useState(false)
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false)
  const [clearPending, setClearPending] = useState(false)
  const [keepPinned, setKeepPinned] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedSourceTypes, dateRangePreset, customStartDate, customEndDate])

  const computedDateFrom = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    switch (dateRangePreset) {
      case 'Today':
        return startOfToday.toISOString()
      case 'This week':
        return startOfWeek.toISOString()
      case 'Last 30 days':
        return thirtyDaysAgo.toISOString()
      case 'This month':
        return startOfMonth.toISOString()
      case 'Custom':
        return customStartDate ? new Date(customStartDate).toISOString() : undefined
      default:
        return undefined
    }
  }, [customStartDate, dateRangePreset])

  const computedDateTo = useMemo(() => {
    if (dateRangePreset === 'Custom') {
      return customEndDate ? new Date(customEndDate).toISOString() : undefined
    }
    if (dateRangePreset === 'All') return undefined
    return new Date().toISOString()
  }, [customEndDate, dateRangePreset])

  const listParams = useMemo(
    () => ({
      sourceTypes: selectedSourceTypes.length ? selectedSourceTypes : undefined,
      q: debouncedSearch || undefined,
      dateFrom: computedDateFrom,
      dateTo: computedDateTo,
      page,
      pageSize: PAGE_SIZE,
    }),
    [computedDateFrom, computedDateTo, debouncedSearch, page, selectedSourceTypes],
  )

  const { data: historyData, isLoading, isFetching } = useListHistoryQuery(listParams)
  const { data: stats } = useGetHistoryStatsQuery()
  const { data: quota } = useGetHistoryQuotaQuery()
  const [togglePin] = useTogglePinMutation()

  const [duplicateQuiz] = useDuplicateQuizMutation()
  const [duplicateAssignment] = useDuplicateAssignmentMutation()
  const [duplicateWorksheet] = useDuplicateWorksheetMutation()

  const items = historyData?.items ?? []
  const collapsedItems = useMemo(() => collapseChatbotHistoryItems(items), [items])
  const selectMode = selectedIds.length > 0

  const invalidateHistory = () => {
    dispatch(
      historyApiSlice.util.invalidateTags([
        { type: 'HistoryList', id: 'LIST' },
        { type: 'HistoryStats', id: 'STATS' },
        { type: 'HistoryQuota', id: 'QUOTA' },
      ]),
    )
  }

  useEffect(() => {
    const onChanged = () => invalidateHistory()
    window.addEventListener('history:changed', onChanged as EventListener)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'history:last_changed') {
        invalidateHistory()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('history:changed', onChanged as EventListener)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAllOnPage = () => {
    setSelectedIds(items.map((i) => i.id))
  }

  const clearSelection = () => setSelectedIds([])

  const handleTogglePinItem = (item: HistoryItem) => {
    togglePin({
      sourceType: item.sourceType,
      sourceId: item.id,
      pinned: !item.pinned,
      listParams,
    })
  }

  async function handleDuplicate(item: HistoryItem) {
    switch (item.sourceType) {
      case 'quiz': {
        const result = await duplicateQuiz(item.id).unwrap()
        navigate(`/teacher-tools/quiz/${result.id}`)
        return
      }
      case 'assignment': {
        const result = await duplicateAssignment(item.id).unwrap()
        navigate(`/teacher-tools/assignment/${result.id}`)
        return
      }
      case 'worksheet': {
        const result = await duplicateWorksheet(item.id).unwrap()
        navigate(`/teacher-tools/worksheet/${result.id}`)
        return
      }
      case 'exam': {
        const r = await examApi.duplicateExam(item.id)
        if (r.ok && r.id) {
          navigate(`/teacher-tools/exams/${r.id}`)
        }
        return
      }
      default:
        navigate(getItemRoute(item))
    }
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds]
    const n = ids.length
    setBulkDeletePending(true)
    try {
      await Promise.allSettled(
        ids.map((id) => {
          const row = items.find((i) => i.id === id)
          if (!row) return Promise.resolve()
          const path = DELETE_PATH_MAP[row.sourceType](id)
          return apiRequest(path, { method: 'DELETE' })
        }),
      )
      clearSelection()
      setBulkDeleteOpen(false)
      setSelectedItem(null)
      invalidateHistory()
      toast.success(`${n} items deleted`)
    } catch {
      toast.error('Some items could not be deleted')
    } finally {
      setBulkDeletePending(false)
    }
  }

  const isFiltered =
    selectedSourceTypes.length > 0 || Boolean(debouncedSearch) || dateRangePreset !== 'All'

  async function handleClearHistory() {
    setClearPending(true)
    try {
      await clearHistory({
        sourceTypes: selectedSourceTypes.length ? selectedSourceTypes : undefined,
        q: debouncedSearch || undefined,
        dateFrom: computedDateFrom,
        dateTo: computedDateTo,
        keepPinned,
      })
      setClearHistoryOpen(false)
      clearSelection()
      setSelectedItem(null)
      invalidateHistory()
      toast.success('History cleared')
    } catch {
      toast.error('Could not clear history')
    } finally {
      setClearPending(false)
    }
  }

  const quotaShouldShow = quota?.usage?.some((u) => u.warningLevel !== 'ok')

  const totalPages = historyData ? Math.max(1, Math.ceil(historyData.total / PAGE_SIZE)) : 1

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-8 py-12 text-white shadow-xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90">
              <HistoryIcon className="h-4 w-4" /> Your Teaching Archive
            </div>
            <h1 className="text-4xl font-semibold leading-tight">Everything you’ve created, all in one place</h1>
            <p className="text-base text-white/80">Find, reuse, and improve your best teaching resources.</p>
          </div>

          <div className="grid w-full max-w-sm gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Total items</span>
              <span className="text-2xl font-semibold">{stats?.total ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">This week</span>
              <span className="text-2xl font-semibold">{stats?.thisWeek ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Pinned</span>
              <span className="text-2xl font-semibold">{stats?.pinned ?? '—'}</span>
            </div>
          </div>
        </div>
      </section>

      {quota && quotaShouldShow && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-900">Storage usage</p>
            </div>
            <a
              href="/settings?tab=plan"
              className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-500"
            >
              Upgrade for more
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {quota.usage.map((u) => {
              const pct = Math.min(100, Math.round((u.used / u.limit) * 100))
              const barColor =
                u.warningLevel === 'full' ? 'bg-red-500' : u.warningLevel === 'warning' ? 'bg-amber-500' : 'bg-blue-400'
              return (
                <div key={u.sourceType}>
                  <div className="mb-1 flex justify-between text-xs text-gray-600">
                    <span className="font-medium">{SOURCE_LABELS[u.sourceType]}</span>
                    <span>
                      {u.used} / {u.limit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200">
                    <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="flex min-h-[520px] gap-6 xl:grid xl:grid-cols-[1fr_420px]">
        <div className="min-w-0 space-y-5">
          <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your history…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSourceTypes([])}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedSourceTypes.length === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              {ALL_SOURCE_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() =>
                    setSelectedSourceTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedSourceTypes.includes(t) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {SOURCE_LABELS[t]}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {['All', 'Today', 'This week', 'Last 30 days', 'This month', 'Custom'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setDateRangePreset(p)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    dateRangePreset === p ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              {dateRangePreset === 'Custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-1 text-xs"
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-1 text-xs"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-xl p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded-xl p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectMode && viewMode === 'grid' && (
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selectedIds.length === items.length}
                      onChange={(e) => (e.target.checked ? selectAllOnPage() : clearSelection())}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600"
                    />
                    Select all
                  </label>
                )}
                <button
                  type="button"
                  onClick={() => setClearHistoryOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear history
                </button>
              </div>
            </div>
          </div>

          <TeacherToolsBulkActionBar selectedCount={selectedIds.length} onClear={clearSelection}>
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(true)}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}
            </button>
          </TeacherToolsBulkActionBar>

          {viewMode === 'list' && items.length > 0 && (
            <div className="flex items-center gap-3 px-2 py-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={items.length > 0 && selectedIds.length === items.length}
                onChange={(e) => (e.target.checked ? selectAllOnPage() : clearSelection())}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
              <span>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : `${historyData?.total ?? 0} items`}
              </span>
            </div>
          )}

          <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'flex flex-col gap-2'}>
            {isLoading ? (
              <div className="col-span-full grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : collapsedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center">
                <Sparkles className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-base font-semibold text-gray-500">Nothing here yet</p>
                <p className="mt-2 max-w-sm text-sm text-gray-400">
                  Your quizzes, assignments, chatbot sessions, images, and more will appear here.
                </p>
              </div>
            ) : (
              collapsedItems.map((item) => (
                <div key={`${item.sourceType}:${item.id}`} className="space-y-2">
                  <HistoryCard
                    item={item}
                  viewMode={viewMode}
                  isSelected={selectedIds.includes(item.id)}
                  isActive={selectedItem?.id === item.id && selectedItem?.sourceType === item.sourceType}
                  selectMode={selectMode}
                  onSelect={toggleSelect}
                  onClick={(it) => setSelectedItem(it)}
                  onDelete={(it) => {
                    const path = DELETE_PATH_MAP[it.sourceType](it.id)
                    apiRequest(path, { method: 'DELETE' })
                      .then(() => {
                        if (selectedItem?.id === it.id) setSelectedItem(null)
                        invalidateHistory()
                        toast.success('Deleted')
                      })
                      .catch(() => toast.error('Could not delete'))
                  }}
                  onDuplicate={handleDuplicate}
                  onTogglePin={handleTogglePinItem}
                  onOpenEdit={(it) => navigate(getItemRoute(it))}
                  />
                  {item.__collapsedIds && item.__collapsedIds.length > 0 && (
                    <button
                      type="button"
                      className="ml-6 text-left text-xs font-semibold text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.info(`Collapsed ${item.__collapsedIds.length} earlier run${item.__collapsedIds.length === 1 ? '' : 's'}.`)
                      }}
                    >
                      Latest output · +{item.__collapsedIds.length} earlier
                    </button>
                  )}
                </div>
              ))
            )}
            {isFetching && !isLoading && <div className="text-xs text-gray-500">Updating…</div>}
          </div>

          {historyData && historyData.total > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, historyData.total)} of{' '}
                {historyData.total}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-6 max-h-[calc(100vh-4rem)]">
            <HistoryDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
          </div>
        </aside>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white xl:hidden">
          <div className="p-4">
            <HistoryDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
          </div>
        </div>
      )}

      <CustomModal
        open={bulkDeleteOpen}
        close={() => setBulkDeleteOpen(false)}
        title={`Delete ${selectedIds.length} item${selectedIds.length !== 1 ? 's' : ''}?`}
        primaryButtonText={`Delete ${selectedIds.length} item${selectedIds.length !== 1 ? 's' : ''}`}
        isDelete
        loading={bulkDeletePending}
        handleSave={handleBulkDelete}
      >
        <p className="text-sm text-gray-600">
          This will permanently delete the selected items. Items that are pinned will also be removed. This cannot be
          undone.
        </p>
      </CustomModal>

      <CustomModal
        open={clearHistoryOpen}
        close={() => setClearHistoryOpen(false)}
        title={isFiltered ? 'Clear filtered items?' : 'Clear all history?'}
        primaryButtonText={
          isFiltered
            ? `Delete ${historyData?.total ?? ''} filtered items`
            : `Delete all ${stats?.total ?? ''} items`
        }
        isDelete
        loading={clearPending}
        handleSave={handleClearHistory}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {isFiltered
              ? `This will permanently delete the ${historyData?.total ?? ''} items matching your current filters.`
              : `This will permanently delete all ${stats?.total ?? ''} items in your history.`}
          </p>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={keepPinned}
              onChange={(e) => setKeepPinned(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
            <span className="text-sm font-medium text-gray-700">Keep pinned items</span>
          </label>
          {!isFiltered && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
              This action is irreversible. Your quizzes, assignments, chatbot conversations, and generated images will
              be permanently deleted.
            </p>
          )}
        </div>
      </CustomModal>
    </div>
  )
}

export default History

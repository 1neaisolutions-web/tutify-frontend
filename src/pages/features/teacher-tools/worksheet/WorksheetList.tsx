import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
  TeacherToolsActionMenu,
  TeacherToolsBulkActionBar,
  TeacherToolsFilterBar,
  TeacherToolsPageHeader,
  TeacherToolsStatusBadge,
  TableSkeletonRows,
  type FilterValues,
} from '../components'
import { WORKSHEET_STATUS_FILTER_OPTIONS } from '../components/teacherToolsStatusFilterOptions'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { SUBJECTS, GRADES } from '../types'
import { formatListLoadError } from '../utils/listLoadError'
import {
  useDeleteWorksheetMutation,
  useDuplicateWorksheetMutation,
  useListWorksheetsQuery,
  usePatchWorksheetMutation,
} from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'
import type { WorksheetApiItem } from '../../../../api/worksheetApi'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'

const tabs = ['All', 'Draft', 'Published', 'Printable', 'Digital', 'Archived'] as const

function formatLabelForRow(w: WorksheetApiItem): string {
  const f = w.outputFormat
  if (f === 'printable_pdf') return 'Printable'
  if (f === 'both') return 'Both'
  return 'Digital'
}

export default function WorksheetList() {
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState<(typeof tabs)[number]>('All')
  const [simulateLoadError, setSimulateLoadError] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({
    q: '',
    subject: '',
    grade: '',
    classKey: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })
  const [selected, setSelected] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [archivePending, setArchivePending] = useState(false)
  const [bulkPending, setBulkPending] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, isLoading, isError, error, refetch } = useListWorksheetsQuery(
    { page_size: 200 },
    { refetchOnMountOrArgChange: true },
  )

  useEffect(() => {
    void refetch()
  }, [location.pathname, refreshKey, refetch])

  const allWorksheets = data?.items ?? []
  const listReady = !isLoading || Boolean(data)
  const listError = simulateLoadError
    ? 'Simulated load failure'
    : isError
      ? formatListLoadError(error)
      : null

  const filtered = useMemo(() => {
    return allWorksheets.filter((w) => {
      if (filters.q && !w.title.toLowerCase().includes(filters.q.toLowerCase())) return false
      if (filters.subject && w.subject !== filters.subject) return false
      if (filters.grade && w.grade !== filters.grade) return false
      if (filters.classKey && !w.classes?.includes(filters.classKey)) return false
      if (tab === 'All' && filters.status && w.status !== filters.status) return false
      const f = w.outputFormat
      if (tab === 'Printable' && f !== 'printable_pdf' && f !== 'both') return false
      if (tab === 'Digital' && f !== 'interactive_digital' && f !== 'both') return false
      if (tab === 'Draft' && w.status !== 'draft') return false
      if (tab === 'Published' && w.status !== 'published') return false
      if (tab === 'Archived' && w.status !== 'archived') return false
      if (w.createdAt) {
        const day = w.createdAt.slice(0, 10)
        if (filters.dateFrom && day < filters.dateFrom) return false
        if (filters.dateTo && day > filters.dateTo) return false
      }
      return true
    })
  }, [allWorksheets, filters, tab])

  const [patchWorksheet] = usePatchWorksheetMutation()
  const [deleteWorksheet] = useDeleteWorksheetMutation()
  const [duplicateWorksheet] = useDuplicateWorksheetMutation()

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const bump = useCallback(() => {
    setRefreshKey((k) => k + 1)
    void refetch()
  }, [refetch])

  const goEdit = (id: string) => {
    navigate(`/teacher-tools/worksheet/${id}/edit`)
  }

  const confirmArchive = async () => {
    if (!archiveId) return
    setArchivePending(true)
    try {
      await patchWorksheet({ id: archiveId, patch: { status: 'archived' } }).unwrap()
      toast.success('Worksheet archived')
      setArchiveId(null)
      bump()
    } catch {
      toast.error('Could not archive worksheet')
    } finally {
      setArchivePending(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeletePending(true)
    try {
      await deleteWorksheet(deleteId).unwrap()
      toast.success('Worksheet deleted')
      setDeleteId(null)
      bump()
    } catch {
      toast.error('Could not delete worksheet')
    } finally {
      setDeletePending(false)
    }
  }

  const runDuplicate = async (id: string) => {
    try {
      await duplicateWorksheet(id).unwrap()
      toast.success('Worksheet duplicated')
      bump()
    } catch {
      toast.error('Could not duplicate')
    }
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title="Worksheets"
        subtitle="Printable packs and interactive practice with topic-aware blocks."
        breadcrumbs={[{ label: 'Teacher Tools', to: '/teacher-tools' }, { label: 'Worksheet' }]}
        actions={
          <Link
            to="/teacher-tools/worksheet/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" /> Create Worksheet
          </Link>
        }
      />
      <TeacherToolsFilterBar
        value={filters}
        onChange={setFilters}
        subjects={[...SUBJECTS]}
        grades={[...GRADES]}
        classOptions={demoClasses.map((c) => ({ key: c.key, label: c.label, grade: c.grade }))}
        statusOptions={WORKSHEET_STATUS_FILTER_OPTIONS}
      />

      {import.meta.env.DEV && (
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" checked={simulateLoadError} onChange={(e) => setSimulateLoadError(e.target.checked)} />
          Dev: simulate list load failure
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <TeacherToolsBulkActionBar selectedCount={selected.length} onClear={() => setSelected([])}>
        <button
          type="button"
          disabled={bulkPending || selected.length === 0}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow disabled:opacity-50"
          onClick={async () => {
            setBulkPending(true)
            try {
              for (const id of selected) {
                await duplicateWorksheet(id).unwrap()
              }
              toast.success('Duplicated selected')
              setSelected([])
              bump()
            } catch {
              toast.error('Bulk duplicate failed')
            } finally {
              setBulkPending(false)
            }
          }}
        >
          {bulkPending ? 'Working…' : 'Duplicate selected'}
        </button>
      </TeacherToolsBulkActionBar>

      <CustomModal
        open={Boolean(deleteId)}
        close={() => !deletePending && setDeleteId(null)}
        title="Delete worksheet?"
        primaryButtonText="Delete"
        isDelete
        loading={deletePending}
        handleSave={confirmDelete}
      >
        <p className="py-3 text-sm text-gray-600">This removes the worksheet from your session. This cannot be undone.</p>
      </CustomModal>

      <CustomModal
        open={Boolean(archiveId)}
        close={() => !archivePending && setArchiveId(null)}
        title="Archive worksheet?"
        primaryButtonText="Archive"
        loading={archivePending}
        handleSave={() => void confirmArchive()}
      >
        <p className="py-3 text-sm text-gray-600">Archived worksheets stay under the Archived tab. You can duplicate or delete later.</p>
      </CustomModal>

      {(isLoading && !data) && !listError && <TableSkeletonRows />}

      {listError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">No worksheets to show</p>
          <p className="mt-1 text-red-700">{listError}</p>
          <button
            type="button"
            onClick={() => bump()}
            className="mt-4 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {listReady && !listError && filtered.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          No worksheets match your filters.{' '}
          <button
            type="button"
            className="font-semibold text-primary-600 hover:underline"
            onClick={() => setFilters({ q: '', subject: '', grade: '', classKey: '', status: '', dateFrom: '', dateTo: '' })}
          >
            Clear filters
          </button>
          {' · '}
          <Link to="/teacher-tools/worksheet/create" className="font-semibold text-primary-600">
            Create worksheet
          </Link>
        </div>
      )}

      {listReady && !listError && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    onChange={(e) => {
                      if (e.target.checked) setSelected(filtered.map((w) => w.id))
                      else setSelected([])
                    }}
                    checked={selected.length === filtered.length && filtered.length > 0}
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Title</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Topic</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Format</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.includes(w.id)} onChange={() => toggle(w.id)} />
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">
                    <Link to={`/teacher-tools/worksheet/${w.id}`} className="hover:text-primary-600">
                      {w.title}
                    </Link>
                    {w.sourceSummary && <p className="mt-0.5 text-xs font-normal text-gray-500 line-clamp-1">{w.sourceSummary}</p>}
                  </td>
                  <td className="px-3 py-3 text-gray-600">{w.topic}</td>
                  <td className="px-3 py-3 text-gray-600">{formatLabelForRow(w)}</td>
                  <td className="px-3 py-3">
                    <TeacherToolsStatusBadge kind="content" value={w.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <TeacherToolsActionMenu
                      actions={[
                        { key: 'edit', label: 'Edit', onClick: () => goEdit(w.id) },
                        { key: 'dup', label: 'Duplicate', onClick: () => void runDuplicate(w.id) },
                        {
                          key: 'arch',
                          label: 'Archive',
                          onClick: () => setArchiveId(w.id),
                        },
                        {
                          key: 'del',
                          label: 'Delete',
                          onClick: () => setDeleteId(w.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

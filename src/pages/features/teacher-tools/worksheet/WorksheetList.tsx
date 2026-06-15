import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { subjectsMatch } from '@/catalog/adapters/subjectAdapters'
import { formatGradeDisplay, gradesMatch } from '@/catalog/adapters/gradeAdapters'
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

const WORKSHEET_TAB_KEYS: Record<(typeof tabs)[number], string> = {
  All: 'teacherTools.tabAll',
  Draft: 'teacherTools.tabDraft',
  Published: 'teacherTools.tabPublished',
  Printable: 'worksheet.tabPrintable',
  Digital: 'worksheet.tabDigital',
  Archived: 'teacherTools.tabArchived',
}

function formatLabelForRow(w: WorksheetApiItem, t: (key: string) => string): string {
  const f = w.outputFormat
  if (f === 'printable_pdf') return t('worksheet.formatPrintable')
  if (f === 'both') return t('worksheet.formatBoth')
  return t('worksheet.formatDigital')
}

export default function WorksheetList() {
  const { t } = useTranslation()
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
      if (!subjectsMatch(filters.subject, w.subject)) return false
      if (filters.grade && !gradesMatch(w.grade, filters.grade)) return false
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
      toast.success(t('worksheet.toastArchived'))
      setArchiveId(null)
      bump()
    } catch {
      toast.error(t('worksheet.toastArchiveFailed'))
    } finally {
      setArchivePending(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeletePending(true)
    try {
      await deleteWorksheet(deleteId).unwrap()
      toast.success(t('worksheet.toastDeleted'))
      setDeleteId(null)
      bump()
    } catch {
      toast.error(t('worksheet.toastDeleteFailed'))
    } finally {
      setDeletePending(false)
    }
  }

  const runDuplicate = async (id: string) => {
    try {
      await duplicateWorksheet(id).unwrap()
      toast.success(t('worksheet.toastDuplicated'))
      bump()
    } catch {
      toast.error(t('teacherTools.toastDuplicateFailed'))
    }
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={t('worksheet.title')}
        subtitle={t('worksheet.listSubtitle')}
        breadcrumbs={[{ label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' }, { label: t('worksheet.breadcrumb') }]}
        actions={
          <Link
            to="/teacher-tools/worksheet/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" /> {t('teacherTools.createWorksheet')}
          </Link>
        }
      />
      <TeacherToolsFilterBar
        value={filters}
        onChange={setFilters}
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
        {tabs.map((tabItem) => (
          <button
            key={tabItem}
            type="button"
            onClick={() => setTab(tabItem)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              tab === tabItem ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(WORKSHEET_TAB_KEYS[tabItem])}
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
              toast.success(t('teacherTools.toastBulkDuplicated'))
              setSelected([])
              bump()
            } catch {
              toast.error(t('worksheet.toastBulkDuplicateFailed'))
            } finally {
              setBulkPending(false)
            }
          }}
        >
          {bulkPending ? t('teacherTools.working') : t('teacherTools.duplicateSelected')}
        </button>
      </TeacherToolsBulkActionBar>

      <CustomModal
        open={Boolean(deleteId)}
        close={() => !deletePending && setDeleteId(null)}
        title={t('worksheet.deleteTitle')}
        primaryButtonText={t('teacherTools.delete')}
        isDelete
        loading={deletePending}
        handleSave={confirmDelete}
      >
        <p className="py-3 text-sm text-gray-600">{t('worksheet.deleteBody')}</p>
      </CustomModal>

      <CustomModal
        open={Boolean(archiveId)}
        close={() => !archivePending && setArchiveId(null)}
        title={t('worksheet.archiveTitle')}
        primaryButtonText={t('teacherTools.archive')}
        loading={archivePending}
        handleSave={() => void confirmArchive()}
      >
        <p className="py-3 text-sm text-gray-600">{t('worksheet.archiveBody')}</p>
      </CustomModal>

      {(isLoading && !data) && !listError && <TableSkeletonRows />}

      {listError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">{t('worksheet.listErrorTitle')}</p>
          <p className="mt-1 text-red-700">{listError}</p>
          <button
            type="button"
            onClick={() => bump()}
            className="mt-4 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
          >
            {t('teacherTools.tryAgain')}
          </button>
        </div>
      )}

      {listReady && !listError && filtered.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          {t('worksheet.emptyFilters')}{' '}
          <button
            type="button"
            className="font-semibold text-primary-600 hover:underline"
            onClick={() => setFilters({ q: '', subject: '', grade: '', classKey: '', status: '', dateFrom: '', dateTo: '' })}
          >
            {t('teacherTools.clearFilters')}
          </button>
          {' · '}
          <Link to="/teacher-tools/worksheet/create" className="font-semibold text-primary-600">
            {t('worksheet.createLink')}
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
                    aria-label={t('teacherTools.ariaSelectAll')}
                    onChange={(e) => {
                      if (e.target.checked) setSelected(filtered.map((w) => w.id))
                      else setSelected([])
                    }}
                    checked={selected.length === filtered.length && filtered.length > 0}
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('teacherTools.title')}</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('worksheet.colTopic')}</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('worksheet.colFormat')}</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('teacherTools.status')}</th>
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
                  <td className="px-3 py-3 text-gray-600">{formatLabelForRow(w, t)}</td>
                  <td className="px-3 py-3">
                    <TeacherToolsStatusBadge kind="content" value={w.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <TeacherToolsActionMenu
                      actions={[
                        { key: 'edit', label: t('teacherTools.edit'), onClick: () => goEdit(w.id) },
                        { key: 'dup', label: t('teacherTools.duplicate'), onClick: () => void runDuplicate(w.id) },
                        {
                          key: 'arch',
                          label: t('teacherTools.archive'),
                          onClick: () => setArchiveId(w.id),
                        },
                        {
                          key: 'del',
                          label: t('teacherTools.delete'),
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

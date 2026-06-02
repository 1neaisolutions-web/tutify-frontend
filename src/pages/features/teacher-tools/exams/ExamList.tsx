import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
  TeacherToolsActionMenu,
  TeacherToolsBulkActionBar,
  TeacherToolsFilterBar,
  TeacherToolsPageHeader,
  TeacherToolsListSyncHint,
  TeacherToolsStatusBadge,
  TableSkeletonRows,
  type FilterValues,
} from '../components'
import { EXAM_STATUS_FILTER_OPTIONS } from '../components/teacherToolsStatusFilterOptions'
import { demoClasses, TEACHER_TOOLS_SEED_EXAM_IDS } from '../demo/teacherToolsDemoData'
import { SUBJECTS, GRADES } from '../types'
import * as examApi from '../../../../api/examApi'
import { formatListLoadError } from '../utils/listLoadError'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'

const tabs = ['All', 'Draft', 'Scheduled', 'Ongoing', 'Completed', 'Archived'] as const

const EXAM_TAB_KEYS: Record<(typeof tabs)[number], string> = {
  All: 'teacherTools.tabAll',
  Draft: 'teacherTools.tabDraft',
  Scheduled: 'teacherTools.tabScheduled',
  Ongoing: 'teacherTools.tabOngoing',
  Completed: 'teacherTools.tabCompleted',
  Archived: 'teacherTools.tabArchived',
}

export default function ExamList() {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState<(typeof tabs)[number]>('All')
  const [rows, setRows] = useState<examApi.ExamApiItem[]>([])
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
  const [listReady, setListReady] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [liveListUnavailable, setLiveListUnavailable] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const runListLoad = useCallback(async () => {
    setListReady(false)
    setListError(null)
    setLiveListUnavailable(false)
    try {
      if (import.meta.env.DEV && simulateLoadError) throw new Error('Simulated load failure')
      const statusForTab =
        tab === 'All'
          ? filters.status || undefined
          : tab === 'Draft'
            ? 'draft'
            : tab === 'Scheduled'
              ? 'scheduled'
              : tab === 'Ongoing'
                ? 'scheduled'
                : tab === 'Completed'
                  ? 'completed'
                  : tab === 'Archived'
                    ? 'archived'
                    : undefined
      const res = await examApi.fetchExamList({
        q: filters.q || undefined,
        subject: filters.subject || undefined,
        grade: filters.grade || undefined,
        status: statusForTab,
        class_key: filters.classKey || undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        page: 1,
        page_size: 200,
      })
      setRows(res.items)
      setListReady(true)
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[ExamList] fetchExamList failed', e)
      const msg = formatListLoadError(e)
      setListError(msg)
      setListReady(false)
      setLiveListUnavailable(true)
    }
  }, [filters.classKey, filters.dateFrom, filters.dateTo, filters.grade, filters.q, filters.status, filters.subject, simulateLoadError, tab])

  useEffect(() => {
    void runListLoad()
  }, [runListLoad, refreshKey, location.pathname])

  const filtered = useMemo(() => {
    return rows.filter((e) => {
      if (tab === 'Ongoing') {
        if (e.status !== 'scheduled') return false
        const start = e.scheduleStart ? new Date(e.scheduleStart) : null
        if (!start || start > new Date()) return false
      }
      return true
    })
  }, [rows, tab])

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const bump = () => setRefreshKey((k) => k + 1)

  const goEdit = async (id: string) => {
    if (TEACHER_TOOLS_SEED_EXAM_IDS.has(id)) {
      try {
        const r = await examApi.duplicateExam(id)
        if (r.ok && r.id) {
          toast.success(t('teacherTools.toastEditableCopy'))
          navigate(`/teacher-tools/exams/${r.id}/edit`)
          return
        }
      } catch {
        /* fall through */
      }
      toast.error(t('teacherTools.toastCopyFailed'))
      return
    }
    navigate(`/teacher-tools/exams/${id}/edit`)
  }

  const confirmArchive = async () => {
    if (!archiveId) return
    setArchivePending(true)
    try {
      await examApi.patchExam(archiveId, { status: 'archived' })
      toast.success(t('exam.toastArchived'))
      setArchiveId(null)
      bump()
    } catch {
      toast.error(t('exam.toastArchiveFailed'))
    } finally {
      setArchivePending(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeletePending(true)
    try {
      await examApi.deleteExam(deleteId)
      toast.success(t('exam.toastDeleted'))
      setDeleteId(null)
      bump()
    } catch {
      toast.error(t('exam.toastDeleteListFailed'))
    } finally {
      setDeletePending(false)
    }
  }

  const runDuplicate = async (id: string) => {
    try {
      const r = await examApi.duplicateExam(id)
      if (r.ok && r.id) {
        toast.success(t('exam.toastDuplicated'))
        bump()
      } else toast.error(t('teacherTools.toastDuplicateFailed'))
    } catch {
      toast.error(t('teacherTools.toastDuplicateFailed'))
    }
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={t('exam.title')}
        subtitle={t('exam.listSubtitle')}
        breadcrumbs={[{ label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' }, { label: t('exam.breadcrumb') }]}
        actions={
          <Link
            to="/teacher-tools/exams/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" /> {t('teacherTools.createExam')}
          </Link>
        }
      />
      <TeacherToolsFilterBar
        value={filters}
        onChange={setFilters}
        subjects={[...SUBJECTS]}
        grades={[...GRADES]}
        classOptions={demoClasses.map((c) => ({ key: c.key, label: c.label, grade: c.grade }))}
        statusOptions={EXAM_STATUS_FILTER_OPTIONS}
      />

      {import.meta.env.DEV && (
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" checked={simulateLoadError} onChange={(e) => setSimulateLoadError(e.target.checked)} />
          Dev: simulate list load failure
        </label>
      )}

      {liveListUnavailable && <TeacherToolsListSyncHint kind="exams" onRetry={() => bump()} />}

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
            {t(EXAM_TAB_KEYS[tabItem])}
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
                await examApi.duplicateExam(id)
              }
              toast.success(t('teacherTools.toastBulkDuplicated'))
              setSelected([])
              bump()
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
        title={t('exam.deleteTitle')}
        primaryButtonText={t('teacherTools.delete')}
        isDelete
        loading={deletePending}
        handleSave={confirmDelete}
      >
        <p className="py-3 text-sm text-gray-600">{t('exam.deleteBody')}</p>
      </CustomModal>

      <CustomModal
        open={Boolean(archiveId)}
        close={() => !archivePending && setArchiveId(null)}
        title={t('exam.archiveTitle')}
        primaryButtonText={t('teacherTools.archive')}
        loading={archivePending}
        handleSave={() => void confirmArchive()}
      >
        <p className="py-3 text-sm text-gray-600">{t('exam.archiveBody')}</p>
      </CustomModal>

      {!listReady && !listError && <TableSkeletonRows />}

      {listError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">{t('exam.listErrorTitle')}</p>
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

      {listReady && filtered.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          {t('exam.emptyFilters')}{' '}
          <button
            type="button"
            className="font-semibold text-primary-600 hover:underline"
            onClick={() => setFilters({ q: '', subject: '', grade: '', classKey: '', status: '', dateFrom: '', dateTo: '' })}
          >
            {t('teacherTools.clearFilters')}
          </button>
          {' · '}
          <Link to="/teacher-tools/exams/create" className="font-semibold text-primary-600">
            {t('exam.createLink')}
          </Link>
        </div>
      )}

      {listReady && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    aria-label={t('teacherTools.ariaSelectAll')}
                    onChange={(e) => {
                      if (e.target.checked) setSelected(filtered.map((x) => x.id))
                      else setSelected([])
                    }}
                    checked={selected.length === filtered.length && filtered.length > 0}
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('teacherTools.title')}</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('exam.colType')}</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('exam.colWhen')}</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('teacherTools.status')}</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggle(e.id)} />
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">
                    <Link to={`/teacher-tools/exams/${e.id}`} className="hover:text-primary-600">
                      {e.title}
                    </Link>
                    {e.sourceSummary && <p className="mt-0.5 text-xs font-normal text-gray-500 line-clamp-1">{e.sourceSummary}</p>}
                  </td>
                  <td className="px-3 py-3 text-gray-600">{e.examType}</td>
                  <td className="px-3 py-3 text-gray-600">{e.scheduleStart?.slice(0, 10)}</td>
                  <td className="px-3 py-3">
                    <TeacherToolsStatusBadge kind="content" value={e.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <TeacherToolsActionMenu
                      actions={[
                        { key: 'edit', label: t('teacherTools.edit'), onClick: () => void goEdit(e.id) },
                        { key: 'dup', label: t('teacherTools.duplicate'), onClick: () => void runDuplicate(e.id) },
                        {
                          key: 'arch',
                          label: t('teacherTools.archive'),
                          onClick: () => setArchiveId(e.id),
                        },
                        {
                          key: 'del',
                          label: t('teacherTools.delete'),
                          onClick: () => setDeleteId(e.id),
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

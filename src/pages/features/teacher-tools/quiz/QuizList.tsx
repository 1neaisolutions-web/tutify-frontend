import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { QUIZ_STATUS_FILTER_OPTIONS } from '../components/teacherToolsStatusFilterOptions'
import { demoClasses, demoQuizzes, TEACHER_TOOLS_SEED_QUIZ_IDS } from '../demo/teacherToolsDemoData'
import { SUBJECTS, GRADES } from '../types'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { formatListLoadError } from '../utils/listLoadError'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'

const tabs = ['All', 'Draft', 'Published', 'Scheduled', 'Archived'] as const

export default function QuizList() {
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const { api, allQuizzes } = useTeacherToolsDemo()
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
      await api.listQuizzes()
      setListReady(true)
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[QuizList] listQuizzes failed', e)
      const msg = formatListLoadError(e)
      if (demoQuizzes.length > 0) {
        setListReady(true)
        setLiveListUnavailable(true)
      } else {
        setListError(msg)
        setListReady(false)
      }
    }
  }, [api, simulateLoadError])

  useEffect(() => {
    void runListLoad()
  }, [runListLoad, refreshKey, location.pathname])

  const filtered = useMemo(() => {
    return allQuizzes.filter((q) => {
      if (filters.q && !q.title.toLowerCase().includes(filters.q.toLowerCase())) return false
      if (filters.subject && q.subject !== filters.subject) return false
      if (filters.grade && q.grade !== filters.grade) return false
      if (filters.classKey && !q.classes?.includes(filters.classKey)) return false
      if (tab === 'All' && filters.status && q.status !== filters.status) return false
      if (tab === 'Draft' && q.status !== 'draft') return false
      if (tab === 'Published' && q.status !== 'published') return false
      if (tab === 'Scheduled' && q.status !== 'scheduled') return false
      if (tab === 'Archived' && q.status !== 'archived') return false
      const d = q.dueAt || q.assignedAt
      if (d) {
        const day = d.slice(0, 10)
        if (filters.dateFrom && day < filters.dateFrom) return false
        if (filters.dateTo && day > filters.dateTo) return false
      }
      return true
    })
  }, [allQuizzes, filters, tab])

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const bump = () => setRefreshKey((k) => k + 1)

  const goEdit = async (id: string) => {
    if (TEACHER_TOOLS_SEED_QUIZ_IDS.has(id)) {
      const r = await api.duplicateQuiz(id)
      if (r.ok && 'id' in r && r.id) {
        toast.success('Created an editable copy from the sample library')
        navigate(`/teacher-tools/quiz/${r.id}/edit`)
        return
      }
      toast.error('Could not create a copy')
      return
    }
    navigate(`/teacher-tools/quiz/${id}/edit`)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeletePending(true)
    try {
      const res = await api.deleteQuiz(deleteId)
      if (!res.ok) {
        if (res.error === 'READ_ONLY') toast.error('Sample library items cannot be deleted.')
        else toast.error('Could not delete quiz')
        return
      }
      toast.success('Quiz deleted')
      setDeleteId(null)
      bump()
    } finally {
      setDeletePending(false)
    }
  }

  const runDuplicate = async (id: string) => {
    const r = await api.duplicateQuiz(id)
    if (r.ok && 'id' in r && r.id) {
      toast.success('Quiz duplicated')
      bump()
    } else toast.error('Could not duplicate')
  }

  const confirmArchive = async () => {
    if (!archiveId) return
    setArchivePending(true)
    try {
      const res = await api.updateQuiz(archiveId, { status: 'archived' })
      if (!res.ok && res.error === 'READ_ONLY') {
        toast.error('Sample items cannot be archived. Duplicate first.')
        return
      }
      if (res.ok) {
        toast.success('Quiz archived')
        setArchiveId(null)
        bump()
      }
    } finally {
      setArchivePending(false)
    }
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title="Quizzes"
        subtitle="Create and manage formative quizzes with scheduling, attempts, and analytics."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Quiz' },
        ]}
        actions={
          <Link
            to="/teacher-tools/quiz/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" /> Create Quiz
          </Link>
        }
      />

      <TeacherToolsFilterBar
        value={filters}
        onChange={setFilters}
        subjects={[...SUBJECTS]}
        grades={[...GRADES]}
        classOptions={demoClasses.map((c) => ({ key: c.key, label: c.label, grade: c.grade }))}
        statusOptions={QUIZ_STATUS_FILTER_OPTIONS}
      />

      {import.meta.env.DEV && (
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" checked={simulateLoadError} onChange={(e) => setSimulateLoadError(e.target.checked)} />
          Dev: simulate list load failure
        </label>
      )}

      {liveListUnavailable && <TeacherToolsListSyncHint kind="quizzes" onRetry={() => bump()} />}

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
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
                await api.duplicateQuiz(id)
              }
              toast.success('Duplicated selected')
              setSelected([])
              bump()
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
        title="Delete quiz?"
        primaryButtonText="Delete"
        isDelete
        loading={deletePending}
        handleSave={confirmDelete}
      >
        <p className="py-3 text-sm text-gray-600">This removes the quiz from your session. This cannot be undone.</p>
      </CustomModal>

      <CustomModal
        open={Boolean(archiveId)}
        close={() => !archivePending && setArchiveId(null)}
        title="Archive quiz?"
        primaryButtonText="Archive"
        loading={archivePending}
        handleSave={() => void confirmArchive()}
      >
        <p className="py-3 text-sm text-gray-600">Archived quizzes stay in your list under the Archived tab. You can duplicate or delete later.</p>
      </CustomModal>

      {!listReady && !listError && <TableSkeletonRows />}

      {listError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">No quizzes to show</p>
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

      {listReady && filtered.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          No quizzes match your filters.{' '}
          <button
            type="button"
            className="font-semibold text-primary-600 hover:underline"
            onClick={() => setFilters({ q: '', subject: '', grade: '', classKey: '', status: '', dateFrom: '', dateTo: '' })}
          >
            Clear filters
          </button>
          {' · '}
          <Link to="/teacher-tools/quiz/create" className="font-semibold text-primary-600">
            Create a quiz
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
                    aria-label="Select all"
                    onChange={(e) => {
                      if (e.target.checked) setSelected(filtered.map((q) => q.id))
                      else setSelected([])
                    }}
                    checked={selected.length === filtered.length && filtered.length > 0}
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Title</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Subject</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Grade</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Qs</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Marks</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Avg</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggle(q.id)} />
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">
                    <Link to={`/teacher-tools/quiz/${q.id}`} className="hover:text-primary-600">
                      {q.title}
                    </Link>
                    {q.sourceSummary && (
                      <p className="mt-0.5 text-xs font-normal text-gray-500 line-clamp-1">{q.sourceSummary}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-gray-600">{q.subject}</td>
                  <td className="px-3 py-3 text-gray-600">{q.grade}</td>
                  <td className="px-3 py-3">{q.questions}</td>
                  <td className="px-3 py-3">{q.totalMarks}</td>
                  <td className="px-3 py-3">
                    <TeacherToolsStatusBadge kind="content" value={q.status} />
                  </td>
                  <td className="px-3 py-3">{q.avgScore ? `${q.avgScore.toFixed(1)}` : '—'}</td>
                  <td className="px-3 py-3 text-right">
                    <TeacherToolsActionMenu
                      actions={[
                        { key: 'edit', label: 'Edit', onClick: () => void goEdit(q.id) },
                        { key: 'dup', label: 'Duplicate', onClick: () => void runDuplicate(q.id) },
                        {
                          key: 'arch',
                          label: 'Archive',
                          onClick: () => setArchiveId(q.id),
                        },
                        {
                          key: 'del',
                          label: 'Delete',
                          onClick: () => setDeleteId(q.id),
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

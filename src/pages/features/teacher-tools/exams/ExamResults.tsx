import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader } from '../components'
import { demoStudents } from '../demo/teacherToolsDemoData'
import * as examApi from '../../../../api/examApi'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

export default function ExamResults() {
  const { examId } = useParams()
  const { toast } = useSnackbar()
  const [exam, setExam] = useState<examApi.ExamApiItem | null>(null)
  const [published, setPublished] = useState(true)

  useEffect(() => {
    if (!examId) return
    let c = false
    ;(async () => {
      try {
        const ex = await examApi.fetchExam(examId)
        if (!c) setExam(ex)
      } catch {
        if (!c) setExam(null)
      }
    })()
    return () => {
      c = true
    }
  }, [examId])

  const e = exam

  if (!e) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">Exam not found.</p>
        <Link to="/teacher-tools/exams" className="text-sm font-semibold text-primary-600">
          ← Back to exams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`Results · ${e.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Exams', to: '/teacher-tools/exams' },
          { label: e.title, to: `/teacher-tools/exams/${e.id}` },
          { label: 'Results' },
        ]}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold"
              onClick={() => {
                setPublished(!published)
                toast.success(published ? 'Results unpublished' : 'Results published')
              }}
            >
              {published ? 'Unpublish' : 'Publish'} results
            </button>
            <button type="button" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => toast.success('Export started')}>
              Export CSV
            </button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Pass rate</p>
          <p className="mt-2 text-2xl font-semibold">84%</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Median</p>
          <p className="mt-2 text-2xl font-semibold">72 / {e.totalMarks}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Top score</p>
          <p className="mt-2 text-2xl font-semibold">94</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left">Student</th>
              <th className="px-3 py-3 text-left">Marks</th>
              <th className="px-3 py-3 text-left">Pass/Fail</th>
            </tr>
          </thead>
          <tbody>
            {demoStudents.map((s, i) => (
              <tr key={s.id} className="border-t border-gray-100">
                <td className="px-3 py-3">{s.name}</td>
                <td className="px-3 py-3">{55 + i * 3}</td>
                <td className="px-3 py-3">{55 + i * 3 >= e.totalMarks * 0.5 ? 'Pass' : 'Fail'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to={`/teacher-tools/exams/${e.id}`} className="text-sm font-semibold text-primary-600">← Back</Link>
    </div>
  )
}

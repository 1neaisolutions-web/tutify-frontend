import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge, Phase2Section } from '../components'
import { demoStudents } from '../demo/teacherToolsDemoData'
import * as examApi from '../../../../api/examApi'

export default function ExamCandidates() {
  const { examId } = useParams()
  const [exam, setExam] = useState<examApi.ExamApiItem | null>(null)

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
        title={`Candidates · ${e.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Exams', to: '/teacher-tools/exams' },
          { label: e.title, to: `/teacher-tools/exams/${e.id}` },
          { label: 'Candidates' },
        ]}
      />
      <Phase2Section title="Registered candidates" footnote="Roster import, seating, and check-in unlock in Phase 2.">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left">Student</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Time spent</th>
            </tr>
          </thead>
          <tbody>
            {demoStudents.map((s, i) => (
              <tr key={s.id} className="border-t border-gray-100">
                <td className="px-3 py-3">{s.name}</td>
                <td className="px-3 py-3">
                  <TeacherToolsStatusBadge
                    kind="submission"
                    value={i % 5 === 0 ? 'missed' : i % 5 === 1 ? 'in_progress' : 'submitted'}
                  />
                </td>
                <td className="px-3 py-3">{e.durationMinutes - 10 - i} min</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Phase2Section>
      <Link to={`/teacher-tools/exams/${e.id}`} className="text-sm font-semibold text-primary-600">← Back</Link>
    </div>
  )
}

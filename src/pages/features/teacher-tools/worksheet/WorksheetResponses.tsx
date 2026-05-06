import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge, Phase2Section } from '../components'
import { demoStudents } from '../demo/teacherToolsDemoData'
import { useGetWorksheetQuery } from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'

export default function WorksheetResponses() {
  const { worksheetId } = useParams()
  const { data: w, isLoading, isError } = useGetWorksheetQuery(worksheetId ?? '', { skip: !worksheetId })

  if (isLoading && !w) {
    return <div className="p-6 text-sm text-gray-600">Loading…</div>
  }

  if (isError || !w) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">Worksheet not found.</p>
        <Link to="/teacher-tools/worksheet" className="text-sm font-semibold text-primary-600">
          ← Back to worksheets
        </Link>
      </div>
    )
  }

  const f = w.outputFormat

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`Responses · ${w.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: w.title, to: `/teacher-tools/worksheet/${w.id}` },
          { label: 'Responses' },
        ]}
      />
      <p className="text-sm text-gray-600">
        {f === 'printable_pdf'
          ? 'Printable worksheet: distribution history and download counts (preview).'
          : f === 'both'
            ? 'Hybrid worksheet: printable distribution plus digital completion (preview).'
            : 'Digital worksheet: per-student completion and scoring (preview).'}
      </p>
      <Phase2Section title="Worksheet responses" footnote="Device sync and auto-grading connectors launch in Phase 2.">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">Student</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-left">Time</th>
                <th className="px-3 py-3 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {demoStudents.slice(0, 5).map((s, i) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-3 py-3">{s.name}</td>
                  <td className="px-3 py-3">
                    <TeacherToolsStatusBadge kind="submission" value={i % 2 === 0 ? 'graded' : 'submitted'} />
                  </td>
                  <td className="px-3 py-3">{12 + i} min</td>
                  <td className="px-3 py-3">
                    {f === 'interactive_digital' || f === 'both' ? `${80 + i}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Phase2Section>
      <Link to={`/teacher-tools/worksheet/${w.id}`} className="text-sm font-semibold text-primary-600">
        ← Back
      </Link>
    </div>
  )
}

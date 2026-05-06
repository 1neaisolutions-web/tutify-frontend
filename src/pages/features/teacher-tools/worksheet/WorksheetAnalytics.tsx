import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SimpleBarChart, TeacherToolsPageHeader } from '../components'
import { analyticsForTopic, getTopicBlueprint } from '../demo/topicAwareGenerators'
import { worksheetClassMasteryBars } from '../utils/analyticsDemoSeries'
import { useGetWorksheetQuery } from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'

const ranges = [
  { id: '7d' as const, label: 'Last 7 days' },
  { id: '30d' as const, label: 'Last 30 days' },
  { id: 'all' as const, label: 'All time' },
]

export default function WorksheetAnalytics() {
  const { worksheetId } = useParams()
  const { data: w, isLoading, isError } = useGetWorksheetQuery(worksheetId ?? '', { skip: !worksheetId })
  const [range, setRange] = useState<(typeof ranges)[number]['id']>('30d')
  const classPoints = useMemo(() => (w ? worksheetClassMasteryBars(w, range) : []), [w, range])

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

  const bp = getTopicBlueprint(w.subject, w.topic)
  const an = analyticsForTopic(bp)
  const rangeNote = ranges.find((x) => x.id === range)?.label ?? ''

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`Analytics · ${w.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: w.title, to: `/teacher-tools/worksheet/${w.id}` },
          { label: 'Analytics' },
        ]}
      />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Common errors (topic-aware demo): {an.commonErrors.join(' · ')}
      </div>

      <div className="flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              range === r.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          <span className="font-semibold">Preview data</span>
          <span>— Real results will appear here after students submit.</span>
        </div>
        <SimpleBarChart
          title="Topic mastery by class"
          subtitle={`Deterministic bars · ${rangeNote}`}
          points={classPoints}
        />
      </div>
      <Link to={`/teacher-tools/worksheet/${w.id}`} className="text-sm font-semibold text-primary-600">
        ← Back
      </Link>
    </div>
  )
}

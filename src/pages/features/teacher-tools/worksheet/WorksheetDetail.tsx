import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { Phase2Section, Phase2Badge } from '../components/Phase2Lock'
import { analyticsForTopic, getTopicBlueprint } from '../demo/topicAwareGenerators'
import { useGetWorksheetQuery } from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'
import { apiBlockToLocal } from './worksheetApiAdapters'

const tabs = ['Overview', 'Content', 'Responses', 'Analytics', 'Settings'] as const

const BLOCK_LABELS: Record<string, string> = {
  mcq: 'Multiple choice',
  fill_blank: 'Fill in the blank',
  short: 'Short answer',
  match: 'Matching',
}

export default function WorksheetDetail() {
  const { worksheetId } = useParams()
  const navigate = useNavigate()
  const { data: w, isLoading, isError } = useGetWorksheetQuery(worksheetId ?? '', { skip: !worksheetId })
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  const goEdit = () => {
    if (!worksheetId) return
    navigate(`/teacher-tools/worksheet/${worksheetId}/edit`)
  }

  const blocksForUi = useMemo(() => {
    if (!w?.sessions) return []
    return w.sessions.flatMap((s) => (s.blocks ?? []).map(apiBlockToLocal))
  }, [w?.sessions])

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
  const blockTypesForUi = useMemo(() => new Set(blocksForUi.map((b) => b.type)).size, [blocksForUi])
  const formatLabel =
    w.outputFormat === 'printable_pdf'
      ? 'Print-ready PDF'
      : w.outputFormat === 'both'
        ? 'Both (print + digital)'
        : 'Interactive digital'

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={w.title}
        subtitle={`${w.subject} · ${w.topic}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: w.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <TeacherToolsStatusBadge kind="content" value={w.status} />
            <button
              type="button"
              onClick={() => goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Edit
            </button>
            <Link
              to={`/teacher-tools/worksheet/${w.id}/responses`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Responses
              <Phase2Badge className="ml-0.5" />
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              if (t === 'Analytics') return
              setTab(t)
            }}
            title={t === 'Analytics' ? 'Available in Phase 2' : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
              tab === t
                ? 'bg-primary-600 text-white'
                : t === 'Analytics'
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
            {t === 'Analytics' ? <span className="ml-1.5 align-middle">• P2</span> : null}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Format</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatLabel}</p>
              <p className="mt-1 text-xs text-gray-500">
                {w.outputFormat === 'printable_pdf'
                  ? 'PDF download'
                  : w.outputFormat === 'both'
                    ? 'PDF + in-browser'
                    : 'In-browser interaction'}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Questions</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{blocksForUi.length}</p>
              <p className="mt-1 text-xs text-gray-500">Across {blockTypesForUi} types</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Times used</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{w.submissionCount}</p>
              <p className="mt-1 text-xs text-gray-500">
                {w.submissionCount === 0 ? 'Not yet distributed' : 'Student interactions'}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Est. mastery</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {w.submissionCount > 0 ? `${Math.round(an.masteryEstimate * 100)}%` : 'N/A'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {w.submissionCount > 0 ? 'Based on response patterns' : 'Available after first use'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Topic</dt>
                  <dd className="text-right text-gray-800">{w.topic}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Grade</dt>
                  <dd className="text-right text-gray-800">{w.grade}</dd>
                </div>
                {w.sourceSummary && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-500">Source strategy</dt>
                    <dd className="text-right text-gray-800">{w.sourceSummary}</dd>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-right text-gray-800">{w.createdAt}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Learning objective</h3>
              <p className="mt-2 text-sm text-gray-700">{bp.objective}</p>
              {w.status === 'draft' && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  This worksheet is a draft. Publish to share with classes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'Content' && (
        <div className="space-y-4">
          {(['mcq', 'fill_blank', 'short', 'match'] as const).map((kind) => {
            const group = blocksForUi.filter((b) => b.type === kind)
            if (group.length === 0) return null
            return (
              <section key={kind} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {BLOCK_LABELS[kind]}
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-gray-800">
                  {group.map((b, i) => (
                    <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      {'prompt' in b && <p>{b.prompt}</p>}
                      {'left' in b && (
                        <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                          <ul className="space-y-1">
                            {b.left.map((l, j) => (
                              <li key={j} className="font-medium">
                                {l}
                              </li>
                            ))}
                          </ul>
                          <ul className="space-y-1 text-gray-500">
                            {b.right.map((r, j) => (
                              <li key={j}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {tab === 'Responses' && (
        <Phase2Section title="Student responses (preview)">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Individual student attempts, answer comparisons, and auto-marking results appear here.</p>
            <p>Per-student progress and class-level mastery heatmaps unlock in Phase 2.</p>
            <Link
              to={`/teacher-tools/worksheet/${w.id}/responses`}
              className="mt-2 inline-block font-semibold text-primary-600"
            >
              Open responses preview →
            </Link>
          </div>
        </Phase2Section>
      )}

      {tab === 'Analytics' && (
        <Phase2Section title="Worksheet analytics (locked)">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Question difficulty index, common error patterns, and mastery over time appear here.</p>
            <p>Requires student interaction telemetry and standards tagging in Phase 2.</p>
          </div>
        </Phase2Section>
      )}

      {tab === 'Settings' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Worksheet settings</h3>
          <dl className="text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Format</dt>
              <dd className="text-gray-800">{formatLabel}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Answer key</dt>
              <dd className="text-gray-800">Hidden from students (teacher-only — Phase 2)</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Randomisation</dt>
              <dd className="text-gray-800">Off (configurable in Edit)</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Sharing</dt>
              <dd className="text-gray-800">{w.classes.length > 0 ? `${w.classes.length} class(es)` : 'Not shared'}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}

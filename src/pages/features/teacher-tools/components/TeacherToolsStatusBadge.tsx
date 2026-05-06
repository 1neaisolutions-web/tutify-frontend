import type { ContentStatus, SubmissionStatus } from '../types'

const contentMap: Record<ContentStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  active: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  pending_review: 'bg-amber-100 text-amber-900 border-amber-200',
  graded: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
  completed: 'bg-teal-100 text-teal-800 border-teal-200',
  missing: 'bg-rose-100 text-rose-800 border-rose-200',
}

const submissionMap: Record<SubmissionStatus, string> = {
  not_started: 'bg-gray-100 text-gray-600 border-gray-200',
  submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  late_submitted: 'bg-orange-100 text-orange-800 border-orange-200',
  under_review: 'bg-amber-100 text-amber-900 border-amber-200',
  graded: 'bg-green-100 text-green-800 border-green-200',
  missing: 'bg-rose-100 text-rose-800 border-rose-200',
  in_progress: 'bg-violet-100 text-violet-800 border-violet-200',
  auto_submitted: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  missed: 'bg-red-100 text-red-800 border-red-200',
}

function formatLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function TeacherToolsStatusBadge({
  kind,
  value,
}: {
  kind: 'content' | 'submission'
  value: ContentStatus | SubmissionStatus
}) {
  const cls =
    kind === 'content'
      ? contentMap[value as ContentStatus] ?? contentMap.draft
      : submissionMap[value as SubmissionStatus] ?? submissionMap.not_started
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {formatLabel(value)}
    </span>
  )
}

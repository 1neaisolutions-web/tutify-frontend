/**
 * Shown when the live list API failed but seeded / session items are still listed.
 * Keeps copy short — technical details belong in the browser console only.
 */
type ListKind = 'assignments' | 'quizzes' | 'worksheets' | 'exams'

const COPY: Record<ListKind, string> = {
  assignments: 'assignments',
  quizzes: 'quizzes',
  worksheets: 'worksheets',
  exams: 'exams',
}

export function TeacherToolsListSyncHint({
  kind,
  onRetry,
}: {
  kind: ListKind
  onRetry: () => void
}) {
  const label = COPY[kind]
  return (
    <div
      role="status"
      className="flex flex-col gap-2 rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-gray-800">
        <span className="font-semibold text-amber-950">Sample library.</span>{' '}
        Your live {label} could not be loaded from the server. New items will appear here after the API is running with the latest version.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 self-start rounded-full bg-amber-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-950 sm:self-auto"
      >
        Try again
      </button>
    </div>
  )
}

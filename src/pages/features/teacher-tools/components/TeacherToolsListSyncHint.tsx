/**
 * Shown when the live list API failed but seeded / session items are still listed.
 * Keeps copy short — technical details belong in the browser console only.
 */
import { useTranslation } from 'react-i18next'

type ListKind = 'assignments' | 'quizzes' | 'worksheets' | 'exams'

const KIND_KEYS: Record<ListKind, string> = {
  assignments: 'teacherTools.kindAssignments',
  quizzes: 'teacherTools.kindQuizzes',
  worksheets: 'teacherTools.kindWorksheets',
  exams: 'teacherTools.kindExams',
}

export function TeacherToolsListSyncHint({
  kind,
  onRetry,
}: {
  kind: ListKind
  onRetry: () => void
}) {
  const { t } = useTranslation()
  const kindLabel = t(KIND_KEYS[kind])

  return (
    <div
      role="status"
      className="flex flex-col gap-2 rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-gray-800">
        <span className="font-semibold text-amber-950">{t('teacherTools.sampleLibrary')}</span>{' '}
        {t('teacherTools.syncHintBody', { kind: kindLabel })}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 self-start rounded-full bg-amber-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-950 sm:self-auto"
      >
        {t('teacherTools.tryAgain')}
      </button>
    </div>
  )
}

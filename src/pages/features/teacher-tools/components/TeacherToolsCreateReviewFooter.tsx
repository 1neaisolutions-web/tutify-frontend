import { ArrowLeft } from 'lucide-react'
import {
  TeacherToolsReviewPublishDock,
  type TeacherToolsReviewPublishDockProps,
} from './TeacherToolsReviewPublishDock'

type Props = {
  exitLabel: string
  onExitToList: () => void
  onEditRequirements: () => void
  publish: TeacherToolsReviewPublishDockProps
}

export function TeacherToolsCreateReviewFooter({
  exitLabel,
  onExitToList,
  onEditRequirements,
  publish,
}: Props) {
  return (
    <div>
      <TeacherToolsReviewPublishDock {...publish} />
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onExitToList}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {exitLabel}
        </button>
        <span className="hidden h-4 w-px bg-gray-200 sm:inline" aria-hidden />
        <button
          type="button"
          onClick={onEditRequirements}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50"
        >
          Edit requirements
        </button>
      </div>
    </div>
  )
}

import { Download, FileJson, Printer } from 'lucide-react'

export type TeacherToolsReviewPublishDockProps = {
  onPrintPreview?: () => void
  printPreviewDisabled?: boolean
  onSaveDraft?: () => void
  saveDraftPending?: boolean
  saveDraftDisabled?: boolean
  onExportPdf?: () => void
  exportDisabled?: boolean
  onPublish: () => void
  publishPending?: boolean
  publishDisabled?: boolean
  publishLabel: string
  showLmsSoon?: boolean
}

const btnSecondary =
  'inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'

export function TeacherToolsReviewPublishDock({
  onPrintPreview,
  printPreviewDisabled,
  onSaveDraft,
  saveDraftPending,
  saveDraftDisabled,
  onExportPdf,
  exportDisabled,
  onPublish,
  publishPending,
  publishDisabled,
  publishLabel,
  showLmsSoon = true,
}: TeacherToolsReviewPublishDockProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 px-3 py-2">
      <span className="mr-0.5 hidden text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:inline">
        Publish
      </span>
      {onPrintPreview && (
        <button
          type="button"
          disabled={printPreviewDisabled}
          onClick={onPrintPreview}
          className={btnSecondary}
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          Print
        </button>
      )}
      {onSaveDraft && (
        <button
          type="button"
          disabled={saveDraftPending || saveDraftDisabled}
          onClick={onSaveDraft}
          className={btnSecondary}
        >
          {saveDraftPending ? 'Saving…' : 'Draft'}
        </button>
      )}
      {onExportPdf && (
        <button
          type="button"
          disabled={exportDisabled}
          onClick={onExportPdf}
          className={btnSecondary}
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          PDF
        </button>
      )}
      {showLmsSoon && (
        <button
          type="button"
          disabled
          title="Coming with LMS integration"
          className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-dashed border-gray-200 px-2 py-1.5 text-xs text-gray-400"
        >
          <FileJson className="h-3.5 w-3.5" aria-hidden />
          LMS
        </button>
      )}
      <button
        type="button"
        disabled={publishPending || publishDisabled}
        onClick={onPublish}
        className="ml-auto inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {publishPending ? 'Publishing…' : publishLabel}
      </button>
    </div>
  )
}

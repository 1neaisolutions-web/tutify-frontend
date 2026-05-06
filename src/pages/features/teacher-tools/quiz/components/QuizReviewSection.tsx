import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileJson,
  Loader2,
  Pencil,
  PlusCircle,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { clampResponseLines, type QuizQuestionStub } from '../../demo/generationFromSources'
import { ShortAnswerStudentResponsePreview } from './ShortAnswerHandoutLines'
import { newDemoId } from '../../demo/newDemoId'
import { QuizEditQuestionModal } from './QuizEditQuestionModal'
import type { HandoutLayoutOpts } from '../config/handoutLayoutConfig'
import { QuizPrintPreviewModal, type QuizPrintMeta } from './QuizPrintPreviewModal'

type Props = {
  stubs: QuizQuestionStub[]
  totalPoints: number
  sourceSummaryLine: string
  printMeta: QuizPrintMeta
  handoutLayout: HandoutLayoutOpts
  onHandoutLayoutSave: (layout: HandoutLayoutOpts) => void
  canAddMoreQuestions: boolean
  onReorder: (from: number, to: number) => void
  onDelete: (index: number) => void
  onUpdateStub: (index: number, next: QuizQuestionStub) => void
  onAddQuestion: (stub: QuizQuestionStub) => void
  onRegenerateAll: () => void
  onRegenerateOne: (index: number) => void
  questionLoadingId?: string | null
  regeneratingAll?: boolean
  onBackToEdit: () => void
  onSaveDraft: () => void
  onExportPdf: () => void
  onPublish: () => void
  saveDraftPending: boolean
  publishPending: boolean
}

function blankManualStub(): QuizQuestionStub {
  return {
    id: newDemoId('qq'),
    type: 'mcq',
    points: 2,
    prompt: '',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  }
}

export function QuizReviewSection({
  stubs,
  totalPoints,
  sourceSummaryLine,
  printMeta,
  handoutLayout,
  onHandoutLayoutSave,
  canAddMoreQuestions,
  onReorder,
  onDelete,
  onUpdateStub,
  onAddQuestion,
  onRegenerateAll,
  onRegenerateOne,
  questionLoadingId,
  regeneratingAll,
  onBackToEdit,
  onSaveDraft,
  onExportPdf,
  onPublish,
  saveDraftPending,
  publishPending,
}: Props) {
  const [editing, setEditing] = useState<QuizQuestionStub | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [printOpen, setPrintOpen] = useState(false)
  const [manualDraft, setManualDraft] = useState<QuizQuestionStub | null>(null)

  const busy = Boolean(questionLoadingId) || Boolean(regeneratingAll)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Review</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">Generated question set</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Edit prompts, reorder, or regenerate items. When you publish, this snapshot is stored for students and exports.
          </p>
          <p className="mt-2 text-xs text-gray-500">{sourceSummaryLine}</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
              <p className="text-2xl font-semibold text-gray-900">{stubs.length}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
              <p className="text-2xl font-semibold text-gray-900">{totalPoints}</p>
              <p className="text-xs text-gray-500">Total marks</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPrintOpen(true)}
              disabled={stubs.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye className="h-3.5 w-3.5" />
              Print preview
            </button>
            <button
              type="button"
              onClick={() => {
                if (!canAddMoreQuestions) return
                setManualDraft(blankManualStub())
              }}
              disabled={!canAddMoreQuestions}
              title={!canAddMoreQuestions ? 'Maximum questions reached for this quiz' : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add question manually
            </button>
          </div>
        </div>
      </div>

      {stubs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-sm font-medium text-gray-800">No questions in this quiz yet.</p>
          <p className="mt-1 text-sm text-gray-600">Go back and run generation again, or regenerate from the toolbar.</p>
          <button
            type="button"
            onClick={onBackToEdit}
            className="mt-4 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
          >
            Back to build
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {stubs.map((q, index) => (
            <li
              key={q.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold uppercase text-gray-600 ring-1 ring-gray-200">
                  {q.type === 'mcq' ? 'MCQ' : q.type === 'tf' ? 'T/F' : 'Short'}
                </span>
                {q.reviewBadges?.difficulty ? (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-100">
                    {q.reviewBadges.difficulty}
                  </span>
                ) : null}
                {q.reviewBadges?.source ? (
                  <span
                    className="inline-flex max-w-[min(100%,14rem)] items-center truncate rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                    title={q.reviewBadges.source}
                  >
                    {q.reviewBadges.source}
                  </span>
                ) : null}
                <span className="text-xs font-medium text-gray-500">
                  Q{index + 1} · {q.points ?? '—'} pts
                  {q.type === 'short' ? (
                    <span className="ml-2 text-gray-400">· {clampResponseLines(q.responseLines)} lines</span>
                  ) : null}
                </span>
                <div className="ml-auto flex flex-wrap gap-1">
                  <button
                    type="button"
                    title="Move up"
                    disabled={busy || index === 0}
                    onClick={() => onReorder(index, index - 1)}
                    className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={busy || index === stubs.length - 1}
                    onClick={() => onReorder(index, index + 1)}
                    className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Edit"
                    disabled={busy}
                    onClick={() => {
                      if (busy) return
                      setEditingIndex(index)
                      setEditing(q)
                    }}
                    className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Regenerate this question"
                    disabled={busy}
                    onClick={() => {
                      if (busy) return
                      onRegenerateOne(index)
                    }}
                    className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100"
                  >
                    {questionLoadingId === q.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="Remove"
                    disabled={busy}
                    onClick={() => {
                      if (busy) return
                      onDelete(index)
                    }}
                    className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-gray-900">{q.prompt}</p>
                {q.type === 'mcq' && q.options && q.options.length > 0 && (
                  <ol className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm text-gray-700">
                    {q.options.map((opt, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-mono text-xs text-gray-400">{String.fromCharCode(65 + i)}.</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {q.type === 'short' && (
                  <ShortAnswerStudentResponsePreview
                    responseLines={q.responseLines}
                    ruledLineSpacingPx={handoutLayout.ruledLineSpacingPx}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onBackToEdit}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          ← Edit requirements
        </button>
        <button
          type="button"
          onClick={onRegenerateAll}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"
        >
          {regeneratingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {regeneratingAll ? 'Regenerating…' : 'Regenerate all'}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Publish & export</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saveDraftPending || stubs.length === 0}
            onClick={onSaveDraft}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {saveDraftPending ? 'Saving draft…' : 'Save draft'}
          </button>
          <button
            type="button"
            onClick={() => setPrintOpen(true)}
            disabled={stubs.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Printer className="h-4 w-4" />
            Print preview
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            disabled={stubs.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button
            type="button"
            disabled
            title="Coming with LMS integration"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-gray-300 bg-white/60 px-4 py-2 text-sm font-medium text-gray-400"
          >
            <FileJson className="h-4 w-4" />
            QTI / LMS (soon)
          </button>
          <button
            type="button"
            disabled={publishPending || stubs.length === 0}
            onClick={onPublish}
            className="ml-auto rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
          >
            {publishPending ? 'Publishing…' : 'Publish quiz'}
          </button>
        </div>
      </div>

      <QuizEditQuestionModal
        open={editing !== null && editingIndex !== null}
        stub={editing}
        onClose={() => {
          setEditing(null)
          setEditingIndex(null)
        }}
        onSave={(next) => {
          if (editingIndex === null) return
          onUpdateStub(editingIndex, next)
        }}
      />

      <QuizEditQuestionModal
        open={manualDraft !== null}
        stub={manualDraft}
        isNew
        modalTitle="Add question"
        formId="quiz-q-add-form"
        onClose={() => setManualDraft(null)}
        onSave={(next) => {
          onAddQuestion(next)
          setManualDraft(null)
        }}
      />

      <QuizPrintPreviewModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        meta={printMeta}
        stubs={stubs}
        savedLayout={handoutLayout}
        onSaveLayout={onHandoutLayoutSave}
      />
    </div>
  )
}

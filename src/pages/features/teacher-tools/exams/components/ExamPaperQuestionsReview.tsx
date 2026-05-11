import { ArrowDown, ArrowUp, Loader2, Pencil, PlusCircle, RefreshCw, Trash2 } from 'lucide-react'
import type { ExamPaperConfig } from '../config/examPaperConfig'
import type { ExamLongStub, ExamMcqStub, ExamShortStub } from '../demo/examQuestionStubs'
import { shortPoolSize } from '../demo/examQuestionStubs'
import { stripLeadingMcqOptionLabel } from '../utils/mcqOptionDisplay'

type Props = {
  paper: ExamPaperConfig
  mcqs: ExamMcqStub[]
  shorts: ExamShortStub[]
  longs: ExamLongStub[]
  objMarksPer: number
  shortMarksPer: number
  longMarksPer: number
  onReorderMcq: (from: number, to: number) => void
  onDeleteMcq: (index: number) => void
  onRegenerateMcq: (index: number) => void
  onEditMcq: (index: number) => void
  onAddManualMcq: () => void
  onReorderShort: (from: number, to: number) => void
  onDeleteShort: (index: number) => void
  onRegenerateShort: (index: number) => void
  onEditShort: (index: number) => void
  onAddManualShort: () => void
  onReorderLong: (from: number, to: number) => void
  onDeleteLong: (index: number) => void
  onRegenerateLong: (index: number) => void
  onEditLong: (index: number) => void
  onAddManualLong: () => void
  /** e.g. `mcq:<uuid>` while that question is regenerating; disables other row actions */
  regenerateBusyKey?: string | null
}

function toolbarClass(disabled?: boolean) {
  return `rounded-lg p-1.5 ${disabled ? 'cursor-not-allowed opacity-30' : 'text-gray-600 hover:bg-gray-200'}`
}

function stripLeadingSubpartLabel(text: string, letter: string): string {
  // Avoid "(a) (a) ..." when backend already included a label prefix.
  // Supports "(a) foo", "a) foo", "(a). foo", "(a): foo"
  const re = new RegExp(`^\\s*(?:\\(${letter}\\)|${letter}\\))\\s*[:\\.-]?\\s*`, 'i')
  return text.replace(re, '').trimStart()
}

export function ExamPaperQuestionsReview({
  paper,
  mcqs,
  shorts,
  longs,
  objMarksPer,
  shortMarksPer,
  longMarksPer,
  onReorderMcq,
  onDeleteMcq,
  onRegenerateMcq,
  onEditMcq,
  onAddManualMcq,
  onReorderShort,
  onDeleteShort,
  onRegenerateShort,
  onEditShort,
  onAddManualShort,
  onReorderLong,
  onDeleteLong,
  onRegenerateLong,
  onEditLong,
  onAddManualLong,
  regenerateBusyKey = null,
}: Props) {
  const shortStart = paper.objCount + 1
  const longStart = paper.objCount + shortPoolSize(paper) + 1
  const letters = paper.objOptions === 5 ? (['A', 'B', 'C', 'D', 'E'] as const) : (['A', 'B', 'C', 'D'] as const)

  const canDelMcq = mcqs.length > 1
  const canDelShort = shorts.length > 1
  const canDelLong = longs.length > 1

  const maxMcq = 100
  const maxShort = 20
  const maxLong = 10

  const busy = Boolean(regenerateBusyKey)
  const rowKey = (q: { id: string; _id?: string }, kind: 'mcq' | 'short' | 'long') =>
    `${kind}:${(q as { _id?: string })._id ?? q.id}`

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-sky-50/70 to-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-800">Examination paper (draft)</p>
            <h3 className="mt-0.5 text-base font-bold text-gray-900">Part A — Objective (multiple choice)</h3>
            <p className="mt-1 text-xs text-gray-600">
              {mcqs.length} item{mcqs.length === 1 ? '' : 's'} · {objMarksPer} mark{objMarksPer === 1 ? '' : 's'} each ·{' '}
              {paper.objOptions} options
            </p>
          </div>
          <button
            type="button"
            onClick={onAddManualMcq}
            disabled={mcqs.length >= maxMcq}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add MCQ
          </button>
        </div>
        <ul className="divide-y divide-gray-100">
          {mcqs.map((q, index) => {
            const n = index + 1
            const rk = rowKey(q, 'mcq')
            const rowRegen = regenerateBusyKey === rk
            return (
              <li key={q.id} className="px-5 py-4 sm:px-6" aria-busy={rowRegen}>
                <div className="flex flex-wrap items-start gap-2 border-b border-gray-50 pb-2 sm:border-0 sm:pb-0">
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-900 ring-1 ring-sky-100">
                    Q{n} · {objMarksPer} pt{objMarksPer === 1 ? '' : 's'}
                  </span>
                  <div className="ml-auto flex flex-wrap gap-0.5">
                    <button
                      type="button"
                      title="Move up"
                      disabled={busy || index === 0}
                      onClick={() => onReorderMcq(index, index - 1)}
                      className={toolbarClass(busy || index === 0)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={busy || index === mcqs.length - 1}
                      onClick={() => onReorderMcq(index, index + 1)}
                      className={toolbarClass(busy || index === mcqs.length - 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      disabled={busy}
                      onClick={() => onEditMcq(index)}
                      className={`rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100 ${busy ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={rowRegen ? 'Regenerating…' : 'Regenerate'}
                      disabled={busy}
                      onClick={() => onRegenerateMcq(index)}
                      className={`rounded-lg p-1.5 text-amber-800 hover:bg-amber-100 ${busy && !rowRegen ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      {rowRegen ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
                    </button>
                    <button
                      type="button"
                      title="Remove"
                      disabled={busy || !canDelMcq}
                      onClick={() => onDeleteMcq(index)}
                      className={`rounded-lg p-1.5 text-red-700 hover:bg-red-50 ${busy || !canDelMcq ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className={`mt-2 text-sm font-medium leading-relaxed text-gray-900 ${rowRegen ? 'opacity-60' : ''}`}>{q.stem}</p>
                <ol className="mt-3 grid gap-1.5 text-sm text-gray-800 sm:grid-cols-2">
                  {q.options.map((opt, i) => (
                    <li key={i} className="flex gap-2 leading-snug">
                      <span className="shrink-0 font-semibold tabular-nums text-gray-500">{letters[i] ?? String(i)}.</span>
                      <span>{stripLeadingMcqOptionLabel(opt)}</span>
                    </li>
                  ))}
                </ol>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-amber-50/60 to-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900">Examination paper (draft)</p>
            <h3 className="mt-0.5 text-base font-bold text-gray-900">Part B1 — Short questions</h3>
            <p className="mt-1 text-xs text-gray-600">
              {shorts.length} item{shorts.length === 1 ? '' : 's'} · {shortMarksPer} marks each · no response lines in preview
            </p>
          </div>
          <button
            type="button"
            onClick={onAddManualShort}
            disabled={shorts.length >= maxShort}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add short
          </button>
        </div>
        <ul className="divide-y divide-gray-100">
          {shorts.map((q, index) => {
            const n = shortStart + index
            const rk = rowKey(q, 'short')
            const rowRegen = regenerateBusyKey === rk
            return (
              <li key={q.id} className="px-5 py-4 sm:px-6" aria-busy={rowRegen}>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-950 ring-1 ring-amber-100">
                    Q{n} · {shortMarksPer} marks
                  </span>
                  <div className="ml-auto flex flex-wrap gap-0.5">
                    <button
                      type="button"
                      title="Move up"
                      disabled={busy || index === 0}
                      onClick={() => onReorderShort(index, index - 1)}
                      className={toolbarClass(busy || index === 0)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={busy || index === shorts.length - 1}
                      onClick={() => onReorderShort(index, index + 1)}
                      className={toolbarClass(busy || index === shorts.length - 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      disabled={busy}
                      onClick={() => onEditShort(index)}
                      className={`rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100 ${busy ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={rowRegen ? 'Regenerating…' : 'Regenerate'}
                      disabled={busy}
                      onClick={() => onRegenerateShort(index)}
                      className={`rounded-lg p-1.5 text-amber-800 hover:bg-amber-100 ${busy && !rowRegen ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      {rowRegen ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
                    </button>
                    <button
                      type="button"
                      title="Remove"
                      disabled={busy || !canDelShort}
                      onClick={() => onDeleteShort(index)}
                      className={`rounded-lg p-1.5 text-red-700 hover:bg-red-50 ${busy || !canDelShort ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className={`mt-2 text-sm font-medium leading-relaxed text-gray-900 ${rowRegen ? 'opacity-60' : ''}`}>{q.stem}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-900">Examination paper (draft)</p>
            <h3 className="mt-0.5 text-base font-bold text-gray-900">Part B2 — Long questions</h3>
            <p className="mt-1 text-xs text-gray-600">
              {longs.length} item{longs.length === 1 ? '' : 's'} · {longMarksPer} marks each · sub-parts shown only (no ruled space)
            </p>
          </div>
          <button
            type="button"
            onClick={onAddManualLong}
            disabled={longs.length >= maxLong}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add long
          </button>
        </div>
        <ul className="divide-y divide-gray-100">
          {longs.map((q, index) => {
            const n = longStart + index
            const rk = rowKey(q, 'long')
            const rowRegen = regenerateBusyKey === rk
            return (
              <li key={q.id} className="px-5 py-4 sm:px-6" aria-busy={rowRegen}>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-900 ring-1 ring-violet-100">
                    Q{n} · {longMarksPer} marks
                  </span>
                  <div className="ml-auto flex flex-wrap gap-0.5">
                    <button
                      type="button"
                      title="Move up"
                      disabled={busy || index === 0}
                      onClick={() => onReorderLong(index, index - 1)}
                      className={toolbarClass(busy || index === 0)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={busy || index === longs.length - 1}
                      onClick={() => onReorderLong(index, index + 1)}
                      className={toolbarClass(busy || index === longs.length - 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      disabled={busy}
                      onClick={() => onEditLong(index)}
                      className={`rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100 ${busy ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={rowRegen ? 'Regenerating…' : 'Regenerate'}
                      disabled={busy}
                      onClick={() => onRegenerateLong(index)}
                      className={`rounded-lg p-1.5 text-amber-800 hover:bg-amber-100 ${busy && !rowRegen ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      {rowRegen ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
                    </button>
                    <button
                      type="button"
                      title="Remove"
                      disabled={busy || !canDelLong}
                      onClick={() => onDeleteLong(index)}
                      className={`rounded-lg p-1.5 text-red-700 hover:bg-red-50 ${busy || !canDelLong ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className={`mt-2 text-sm font-medium leading-relaxed text-gray-900 ${rowRegen ? 'opacity-60' : ''}`}>{q.stem}</p>
                <ul className="mt-3 space-y-2 border-l-2 border-violet-100 pl-3">
                  {q.subparts.map((sp, si) => (
                    <li key={si} className="text-sm leading-relaxed text-gray-800">
                      {(() => {
                        const letter = String.fromCharCode(97 + si)
                        const cleaned = stripLeadingSubpartLabel(sp, letter)
                        return (
                          <>
                            <span className="font-semibold text-gray-900">({letter})</span> {cleaned}
                          </>
                        )
                      })()}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

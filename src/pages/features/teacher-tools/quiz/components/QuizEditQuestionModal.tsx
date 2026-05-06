// @ts-expect-error — JS module
import { CustomModal } from '../../../../../components/shared/CustomModal'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import {
  MCQ_OPTION_BOUNDS,
  SHORT_RESPONSE_LINES,
  clampResponseLines,
  normalizeQuizQuestionStub,
  type QuizQuestionStub,
} from '../../demo/generationFromSources'
import { DEFAULT_HANDOUT_LAYOUT } from '../config/handoutLayoutConfig'
import { ShortAnswerHandoutLines } from './ShortAnswerHandoutLines'

const PROMPT_MAX = 2000

type Props = {
  open: boolean
  stub: QuizQuestionStub | null
  /** When true, empty prompt falls back to a starter line instead of the previous stub text. */
  isNew?: boolean
  modalTitle?: string
  /** Distinct id when two instances could exist in the same view tree. */
  formId?: string
  onClose: () => void
  onSave: (next: QuizQuestionStub) => void
}

function defaultMcqOptions(): string[] {
  return ['Option A', 'Option B', 'Option C', 'Option D']
}

function draftFromStub(s: QuizQuestionStub): QuizQuestionStub {
  const points = s.points ?? 2
  if (s.type === 'mcq') {
    const opts = s.options?.length ? [...s.options] : defaultMcqOptions()
    while (opts.length < MCQ_OPTION_BOUNDS.min) opts.push('')
    return {
      ...s,
      type: 'mcq',
      points,
      prompt: s.prompt,
      options: opts.slice(0, MCQ_OPTION_BOUNDS.max),
      responseLines: undefined,
    }
  }
  if (s.type === 'tf') {
    return { ...s, type: 'tf', points, prompt: s.prompt, options: undefined, responseLines: undefined }
  }
  return {
    ...s,
    type: 'short',
    points,
    prompt: s.prompt,
    options: undefined,
    responseLines: clampResponseLines(s.responseLines),
  }
}

function QuizEditQuestionModalInner({
  stub,
  isNew,
  modalTitle,
  formId = 'quiz-q-edit-form',
  onClose,
  onSave,
}: Omit<Props, 'open'> & { stub: QuizQuestionStub }) {
  const [draft, setDraft] = useState<QuizQuestionStub>(() => draftFromStub(stub))

  const fallbackPrompt = isNew
    ? 'New question — replace this text with your full prompt.'
    : stub.prompt

  const setType = (t: QuizQuestionStub['type']) => {
    setDraft((d) => {
      if (t === d.type) return d
      if (t === 'mcq') {
        return {
          ...d,
          type: 'mcq',
          options: d.type === 'mcq' && d.options?.length ? [...d.options] : defaultMcqOptions(),
          responseLines: undefined,
        }
      }
      if (t === 'tf') {
        return { ...d, type: 'tf', options: undefined, responseLines: undefined }
      }
      return {
        ...d,
        type: 'short',
        options: undefined,
        responseLines: clampResponseLines(d.responseLines),
      }
    })
  }

  const submit = () => {
    const prompt = draft.prompt.trim() || fallbackPrompt
    const points = Number.isFinite(draft.points) ? Math.max(0.5, Math.min(20, draft.points!)) : 2
    const merged: QuizQuestionStub = { ...draft, prompt, points }
    onSave(normalizeQuizQuestionStub(merged))
    onClose()
  }

  const mcqOptions = draft.type === 'mcq' ? draft.options ?? [] : []

  return (
    <CustomModal
      open={open}
      close={onClose}
      title={modalTitle ?? 'Edit question'}
      primaryButtonText={isNew ? 'Add question' : 'Save changes'}
      handleSave={() => {
        submit()
      }}
    >
      <div id={formId} className="max-h-[min(72vh,640px)] overflow-y-auto py-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2">
          <p className="text-xs font-semibold text-indigo-900">Question composer</p>
          <p className="text-xs text-indigo-800/80">Changes apply to review, PDF, and print handout.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-800">
            Question type
            <select
              value={draft.type}
              onChange={(e) => setType(e.target.value as QuizQuestionStub['type'])}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="mcq">Multiple choice</option>
              <option value="tf">True / false</option>
              <option value="short">Short answer</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Marks
            <input
              type="number"
              step={0.5}
              min={0.5}
              max={20}
              value={draft.points ?? 2}
              onChange={(e) => setDraft((d) => ({ ...d, points: Number(e.target.value) || 0.5 }))}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>

        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Question text</h3>
              <p className="mt-0.5 text-xs text-gray-500">This is the full stem students see on screen and on paper.</p>
            </div>
            <span className="text-xs tabular-nums text-gray-500">
              {draft.prompt.length}/{PROMPT_MAX}
            </span>
          </div>
          <textarea
            value={draft.prompt}
            maxLength={PROMPT_MAX}
            onChange={(e) => setDraft((d) => ({ ...d, prompt: e.target.value }))}
            rows={8}
            placeholder="Write the full question stem here. Be explicit about what evidence or format you expect…"
            className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-gray-50/40 px-3 py-3 font-sans text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </section>

        {draft.type === 'mcq' && (
          <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-semibold text-gray-900">Answer choices</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {MCQ_OPTION_BOUNDS.min}–{MCQ_OPTION_BOUNDS.max} options. Labels A–F map to order below.
              </p>
            </div>
            <ul className="mt-3 space-y-2">
              {mcqOptions.map((opt, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2.5 w-7 shrink-0 text-center font-mono text-xs font-semibold text-gray-400">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const v = e.target.value
                      setDraft((d) => {
                        if (d.type !== 'mcq' || !d.options) return d
                        const next = [...d.options]
                        next[i] = v
                        return { ...d, options: next }
                      })
                    }}
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                  />
                  <button
                    type="button"
                    disabled={mcqOptions.length <= MCQ_OPTION_BOUNDS.min}
                    onClick={() => {
                      setDraft((d) => {
                        if (d.type !== 'mcq' || !d.options || d.options.length <= MCQ_OPTION_BOUNDS.min) return d
                        return { ...d, options: d.options.filter((_, j) => j !== i) }
                      })
                    }}
                    className="shrink-0 rounded-lg px-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={mcqOptions.length >= MCQ_OPTION_BOUNDS.max}
              onClick={() => {
                setDraft((d) => {
                  if (d.type !== 'mcq' || !d.options || d.options.length >= MCQ_OPTION_BOUNDS.max) return d
                  return { ...d, options: [...d.options, ''] }
                })
              }}
              className="mt-3 inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add choice
            </button>
          </section>
        )}

        {draft.type === 'short' && (
          <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-semibold text-gray-900">Response space (print and PDF)</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Ruled lines appear under this question on the student handout. Adjust before print or export.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  aria-label="Fewer lines"
                  disabled={clampResponseLines(draft.responseLines) <= SHORT_RESPONSE_LINES.min}
                  onClick={() =>
                    setDraft((d) =>
                      d.type === 'short'
                        ? {
                            ...d,
                            responseLines: clampResponseLines((d.responseLines ?? SHORT_RESPONSE_LINES.default) - 1),
                          }
                        : d
                    )
                  }
                  className="rounded-lg p-2 text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center font-mono text-sm font-semibold text-gray-900">
                  {clampResponseLines(draft.responseLines)}
                </span>
                <button
                  type="button"
                  aria-label="More lines"
                  disabled={clampResponseLines(draft.responseLines) >= SHORT_RESPONSE_LINES.max}
                  onClick={() =>
                    setDraft((d) =>
                      d.type === 'short'
                        ? {
                            ...d,
                            responseLines: clampResponseLines((d.responseLines ?? SHORT_RESPONSE_LINES.default) + 1),
                          }
                        : d
                    )
                  }
                  className="rounded-lg p-2 text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600">
                Lines: {SHORT_RESPONSE_LINES.min}–{SHORT_RESPONSE_LINES.max}. Preview updates in review and print preview.
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-3 py-3">
              <p className="text-xs font-medium text-gray-600">Quick preview (matches default handout line height)</p>
              <ShortAnswerHandoutLines
                responseLines={draft.type === 'short' ? draft.responseLines : undefined}
                ruledLineSpacingPx={DEFAULT_HANDOUT_LAYOUT.ruledLineSpacingPx}
                lineStyle="review"
                className="mt-2 flex flex-col"
              />
            </div>
          </section>
        )}

        {draft.type === 'tf' && (
          <section className="mt-5 rounded-2xl border border-gray-200 bg-amber-50/40 p-4">
            <h3 className="text-sm font-semibold text-gray-900">True / false layout</h3>
            <p className="mt-1 text-xs text-gray-600">
              The handout shows ○ True and ○ False under the statement. Edit the stem above to refine the claim.
            </p>
          </section>
        )}
      </div>
    </CustomModal>
  )
}

export function QuizEditQuestionModal({ open, stub, ...rest }: Props) {
  if (!open || !stub) return null
  return <QuizEditQuestionModalInner key={stub.id} stub={stub} {...rest} />
}

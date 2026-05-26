import { AlertCircle } from 'lucide-react'
import { DIFFICULTY_OPTIONS, QUESTION_COUNT } from '../../quiz/config/quizCreationConfig'
import type { QuestionMixMode, QuizDifficultyId } from '../../demo/generationFromSources'

function StepHeader({
  step,
  kicker,
  title,
  subtitle,
}: {
  step: number
  kicker: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex gap-4 border-b border-gray-100 pb-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-600/25">
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">{kicker}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{subtitle}</p>
      </div>
    </div>
  )
}

type Props = {
  mixMode: QuestionMixMode
  onMixModeChange: (v: QuestionMixMode) => void
  questionCount: number
  onQuestionCountChange: (v: number) => void
  countMcq: number
  countFillBlank: number
  countShort: number
  countMatch: number
  onCountMcq: (v: number) => void
  onCountFillBlank: (v: number) => void
  onCountShort: (v: number) => void
  onCountMatch: (v: number) => void
  difficulty: QuizDifficultyId
  onDifficultyChange: (v: QuizDifficultyId) => void
  includeMcq: boolean
  includeFillBlank: boolean
  includeShort: boolean
  includeMatch: boolean
  onToggleMcq: (v: boolean) => void
  onToggleFillBlank: (v: boolean) => void
  onToggleShort: (v: boolean) => void
  onToggleMatch: (v: boolean) => void
  teacherNotes: string
  onTeacherNotesChange: (v: string) => void
}

export function WorksheetGenerationParametersSection({
  mixMode,
  onMixModeChange,
  questionCount,
  onQuestionCountChange,
  countMcq,
  countFillBlank,
  countShort,
  countMatch,
  onCountMcq,
  onCountFillBlank,
  onCountShort,
  onCountMatch,
  difficulty,
  onDifficultyChange,
  includeMcq,
  includeFillBlank,
  includeShort,
  includeMatch,
  onToggleMcq,
  onToggleFillBlank,
  onToggleShort,
  onToggleMatch,
  teacherNotes,
  onTeacherNotesChange,
}: Props) {
  const customTotal = countMcq + countFillBlank + countShort + countMatch

  return (
    <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
      <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50/70 to-white px-6 py-5">
        <StepHeader
          step={2}
          kicker="Question design"
          title="Generation parameters"
          subtitle="Volume, difficulty, and item types for this worksheet. These mirror the quiz generation card and map to a backend job."
        />
      </div>
      <div className="space-y-5 p-6">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Question volume</p>
              <p className="mt-0.5 text-xs text-gray-600">Balanced mix across selected types, or set exact counts per format.</p>
            </div>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm" role="group" aria-label="Question mix mode">
              <button
                type="button"
                onClick={() => onMixModeChange('balanced')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  mixMode === 'balanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Balanced mix
              </button>
              <button
                type="button"
                onClick={() => onMixModeChange('custom')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  mixMode === 'custom' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Per-type counts
              </button>
            </div>
          </div>

          {mixMode === 'balanced' ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                Total questions
                <input
                  type="number"
                  min={QUESTION_COUNT.min}
                  max={QUESTION_COUNT.max}
                  value={questionCount}
                  onChange={(e) =>
                    onQuestionCountChange(
                      Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, Number(e.target.value) || QUESTION_COUNT.min)),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block text-sm font-medium text-gray-800">
                  Multiple choice
                  <input
                    type="number"
                    min={0}
                    max={QUESTION_COUNT.max}
                    value={countMcq}
                    onChange={(e) => onCountMcq(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Fill in the blank
                  <input
                    type="number"
                    min={0}
                    max={QUESTION_COUNT.max}
                    value={countFillBlank}
                    onChange={(e) => onCountFillBlank(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Short answer
                  <input
                    type="number"
                    min={0}
                    max={QUESTION_COUNT.max}
                    value={countShort}
                    onChange={(e) => onCountShort(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Matching
                  <input
                    type="number"
                    min={0}
                    max={QUESTION_COUNT.max}
                    value={countMatch}
                    onChange={(e) => onCountMatch(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                <span className="text-gray-700">
                  Total: <span className="font-semibold text-gray-900">{customTotal}</span>
                  <span className="text-gray-500"> / {QUESTION_COUNT.max}</span>
                </span>
                {customTotal < QUESTION_COUNT.min && (
                  <span className="text-xs font-medium text-amber-700">Minimum {QUESTION_COUNT.min} items.</span>
                )}
              </div>
            </div>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-gray-800">Difficulty profile</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {DIFFICULTY_OPTIONS.map((d) => (
              <label
                key={d.id}
                className={`cursor-pointer rounded-2xl border px-3 py-3 text-sm transition ${
                  difficulty === d.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="worksheet-difficulty"
                  className="sr-only"
                  checked={difficulty === d.id}
                  onChange={() => onDifficultyChange(d.id)}
                />
                <span className="font-semibold text-gray-900">{d.label}</span>
                <span className="mt-1 block text-xs text-gray-600">{d.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {mixMode === 'balanced' ? (
          <fieldset>
            <legend className="text-sm font-medium text-gray-800">
              Item types <span className="text-red-500">*</span>
            </legend>
            <p className="mt-1 text-xs text-gray-500">Choose which blocks appear on the sheet. Totals rotate across enabled types.</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {(
                [
                  ['mcq', 'Multiple choice', includeMcq, onToggleMcq],
                  ['fill', 'Fill in the blank', includeFillBlank, onToggleFillBlank],
                  ['short', 'Short answer', includeShort, onToggleShort],
                  ['match', 'Matching', includeMatch, onToggleMatch],
                ] as const
              ).map(([key, label, on, set]) => (
                <label
                  key={key}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                    on ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="rounded border-gray-300" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3 text-sm text-gray-700">
            <span className="font-medium text-gray-900">Item types</span> follow the numeric counts above (use zero to omit a format).
          </div>
        )}

        <label className="block text-sm font-medium text-gray-800">
          Generator instructions (optional)
          <textarea
            rows={2}
            value={teacherNotes}
            onChange={(e) => onTeacherNotesChange(e.target.value)}
            placeholder="e.g. Emphasise diagram interpretation; add one misconception trap."
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <span className="mt-1 block text-xs text-gray-500">Merged with retrieval scope when the job runs.</span>
        </label>
      </div>

    </section>
  )
}

import type { ContentSourcesFormModel } from '../../hooks/useContentSourcesForm'
import { ContentSourcesPanel } from '../../components'
import { DIFFICULTY_OPTIONS, QUESTION_COUNT } from '../config/quizCreationConfig'
import type { QuestionMixMode, QuizDifficultyId } from '../../demo/generationFromSources'
import { SUBJECTS, GRADES } from '../../types'

type Props = {
  title: string
  onTitleChange: (v: string) => void
  subject: string
  onSubjectChange: (v: string) => void
  grade: string
  onGradeChange: (v: string) => void
  studentInstructions: string
  onStudentInstructionsChange: (v: string) => void
  teacherNotes: string
  onTeacherNotesChange: (v: string) => void
  mixMode: QuestionMixMode
  onMixModeChange: (v: QuestionMixMode) => void
  questionCount: number
  onQuestionCountChange: (v: number) => void
  countMcq: number
  countTf: number
  countShort: number
  onCountMcq: (v: number) => void
  onCountTf: (v: number) => void
  onCountShort: (v: number) => void
  difficulty: QuizDifficultyId
  onDifficultyChange: (v: QuizDifficultyId) => void
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  onToggleMcq: (v: boolean) => void
  onToggleTf: (v: boolean) => void
  onToggleShort: (v: boolean) => void
  timeLimit: number
  onTimeLimitChange: (v: number) => void
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  negativeMarking: boolean
  onShuffleQuestions: (v: boolean) => void
  onShuffleAnswers: (v: boolean) => void
  onNegativeMarking: (v: boolean) => void
  sources: ContentSourcesFormModel
  validationErrors: string[]
}

export function QuizBuildSection({
  title,
  onTitleChange,
  subject,
  onSubjectChange,
  grade,
  onGradeChange,
  studentInstructions,
  onStudentInstructionsChange,
  teacherNotes,
  onTeacherNotesChange,
  mixMode,
  onMixModeChange,
  questionCount,
  onQuestionCountChange,
  countMcq,
  countTf,
  countShort,
  onCountMcq,
  onCountTf,
  onCountShort,
  difficulty,
  onDifficultyChange,
  includeMcq,
  includeTf,
  includeShort,
  onToggleMcq,
  onToggleTf,
  onToggleShort,
  timeLimit,
  onTimeLimitChange,
  shuffleQuestions,
  shuffleAnswers,
  negativeMarking,
  onShuffleQuestions,
  onShuffleAnswers,
  onNegativeMarking,
  sources,
  validationErrors,
}: Props) {
  const customTotal = countMcq + countTf + countShort

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">Quiz details</h2>
          <p className="mt-1 text-sm text-gray-600">
            Name your assessment and set instructions students will see at the start (shown after publish).
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 block text-sm font-medium text-gray-700">
            Quiz title <span className="text-red-500">*</span>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Photosynthesis checkpoint — Grade 10"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Subject
            <select
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Grade / cohort
            <select
              value={grade}
              onChange={(e) => onGradeChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 block text-sm font-medium text-gray-700">
            Student instructions
            <textarea
              rows={3}
              value={studentInstructions}
              onChange={(e) => onStudentInstructionsChange(e.target.value)}
              placeholder="Answer all questions. Show working where appropriate."
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">Displayed on the student start screen when the quiz is assigned.</span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">Generation</h2>
          <p className="mt-1 text-sm text-gray-600">
            These parameters drive question generation. In production they are sent to your curriculum + RAG pipeline.
          </p>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Question volume</p>
                <p className="mt-0.5 text-xs text-gray-600">
                  Use a single total with a balanced mix, or set exact counts per format.
                </p>
              </div>
              <div
                className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm"
                role="group"
                aria-label="Question mix mode"
              >
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
                <label className="block text-sm font-medium text-gray-700">
                  Total questions
                  <input
                    type="number"
                    min={QUESTION_COUNT.min}
                    max={QUESTION_COUNT.max}
                    value={questionCount}
                    onChange={(e) =>
                      onQuestionCountChange(
                        Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, Number(e.target.value) || QUESTION_COUNT.min))
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                  <span className="mt-1 block text-xs text-gray-500">
                    {QUESTION_COUNT.min}–{QUESTION_COUNT.max} items, distributed evenly across the types you select below.
                  </span>
                </label>
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 md:mt-7">
                  <p className="font-medium text-gray-800">How balanced mix works</p>
                  <p className="mt-1 leading-relaxed">
                    Example: 10 questions with MCQ + T/F + short answer selected cycles MCQ → T/F → short → repeat until the
                    total is reached.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-gray-600">
                  Set how many of each item type to generate. Order is shuffled for variety while keeping your counts.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Multiple choice
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countMcq}
                      onChange={(e) => onCountMcq(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    True / false
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countTf}
                      onChange={(e) => onCountTf(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Short answer
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countShort}
                      onChange={(e) => onCountShort(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                  <span className="text-gray-700">
                    Total in quiz:{' '}
                    <span className="font-semibold text-gray-900">{customTotal}</span>
                    <span className="text-gray-500"> / {QUESTION_COUNT.max} max</span>
                  </span>
                  {customTotal < QUESTION_COUNT.min && (
                    <span className="text-xs font-medium text-amber-700">Minimum {QUESTION_COUNT.min} questions required.</span>
                  )}
                  {customTotal > QUESTION_COUNT.max && (
                    <span className="text-xs font-medium text-red-700">Reduce counts to stay within the limit.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Time limit (minutes)
            <input
              type="number"
              min={5}
              max={180}
              value={timeLimit}
              onChange={(e) => onTimeLimitChange(Number(e.target.value) || 30)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="hidden md:block" aria-hidden />

          <fieldset className="md:col-span-2">
            <legend className="text-sm font-medium text-gray-800">Difficulty</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {DIFFICULTY_OPTIONS.map((d) => (
                <label
                  key={d.id}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition ${
                    difficulty === d.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
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
            <fieldset className="md:col-span-2">
              <legend className="text-sm font-medium text-gray-800">
                Include in the mix <span className="text-red-500">*</span>
              </legend>
              <p className="mt-1 text-xs text-gray-500">At least one type. The total above is split across selected types in order.</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {(
                  [
                    ['mcq', 'Multiple choice', includeMcq, onToggleMcq],
                    ['tf', 'True / false', includeTf, onToggleTf],
                    ['short', 'Short answer', includeShort, onToggleShort],
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
            <div className="md:col-span-2 rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Types included:</span> counts above — use zero to omit a format.
            </div>
          )}

          <label className="md:col-span-2 block text-sm font-medium text-gray-700">
            Instructions for generation (optional)
            <textarea
              rows={2}
              value={teacherNotes}
              onChange={(e) => onTeacherNotesChange(e.target.value)}
              placeholder="e.g. Emphasise misconceptions from last lesson; include one practical lab scenario."
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
            <span className="mt-1 block text-xs text-gray-500">
              Combined with your topic and sources — similar to an “AI brief” for the generator.
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">Delivery defaults</h2>
          <p className="mt-1 text-sm text-gray-600">Applied when students take this quiz (saved with the quiz).</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleQuestions} onChange={(e) => onShuffleQuestions(e.target.checked)} />
            Shuffle question order
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleAnswers} onChange={(e) => onShuffleAnswers(e.target.checked)} />
            Shuffle MCQ options
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={negativeMarking} onChange={(e) => onNegativeMarking(e.target.checked)} />
            Negative marking
          </label>
        </div>
      </section>

      <section>
        <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
      </section>

      {validationErrors.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Before you generate:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {validationErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

import {
  AlertCircle,
  BookMarked,
  Check,
  ChevronRight,
  Layers,
  Library,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type { QuizRagScopeModel } from '../hooks/useQuizRagScope'
import { getBookById, type DemoBook } from '../../demo/demoContentLibrary'
import { DIFFICULTY_OPTIONS, QUESTION_COUNT } from '../config/quizCreationConfig'
import type { QuestionMixMode, QuizDifficultyId } from '../../demo/generationFromSources'
import { SUBJECTS, GRADES } from '../../types'

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
  rag: QuizRagScopeModel
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
  validationErrors: string[]
}

export function QuizRagBuildSection({
  rag,
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
  validationErrors,
}: Props) {
  const customTotal = countMcq + countTf + countShort

  const selectedBooks = rag.selectedBookIds
    .map((id) => getBookById(id, rag.catalog as unknown as DemoBook[]))
    .filter(Boolean)

  return (
    <div className="space-y-10">
      {/* Step 1 — Quiz basics */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white px-6 py-5">
          <StepHeader
            step={1}
            kicker="Assessment identity"
            title="Quiz basics"
            subtitle="Name the quiz and set what students see before they begin. Subject and cohort tune the catalog and defaults."
          />
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <label className="md:col-span-2 block text-sm font-medium text-gray-800">
            Quiz title <span className="text-red-500">*</span>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Fractions & decimals — retrieval check (Grade 5)"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Subject
            <select
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Grade / cohort
            <select
              value={grade}
              onChange={(e) => onGradeChange(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 block text-sm font-medium text-gray-800">
            Student-facing instructions
            <textarea
              rows={3}
              value={studentInstructions}
              onChange={(e) => onStudentInstructionsChange(e.target.value)}
              placeholder="Answer all questions. Show working where appropriate."
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">Shown at quiz start after you publish.</span>
          </label>
        </div>
      </section>

      {/* Step 2 — Source materials */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white px-6 py-5">
          <StepHeader
            step={2}
            kicker="Retrieval sources"
            title="Source materials"
            subtitle="Pick any published pack in your workspace (any board or publisher). Retrieval uses indexed chunks; titles and topic strands come from pack and document metadata."
          />
        </div>
        <div className="space-y-5 p-6">
          <label className="inline-flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={rag.generateWithoutSources}
              onChange={(e) => rag.setGenerateWithoutSources(e.target.checked)}
              className="mt-0.5 rounded border-gray-300"
            />
            <span>
              <span className="block font-semibold text-gray-900">Generate without source materials</span>
              <span className="mt-0.5 block text-xs text-gray-600">
                Use topic-only generation. Catalog retrieval is skipped and source selection is hidden.
              </span>
            </span>
          </label>

          {!rag.generateWithoutSources ? (
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={rag.catalogQuery}
                  onChange={(e) => rag.setCatalogQuery(e.target.value)}
                  placeholder="Search title, author, ISBN, or topic strand…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  aria-label="Search catalog"
                />
                {rag.catalogBusy && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700">
                    Updating…
                  </span>
                )}
              </div>

              {rag.catalogError && !rag.catalogBusy && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-950">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Could not load catalog</p>
                    <p className="mt-0.5 text-red-900/80 text-xs">{rag.catalogError}</p>
                    <button
                      type="button"
                      onClick={rag.retryCatalog}
                      className="mt-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {rag.catalogBusy && rag.filteredCatalog.length === 0 ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
                    ))}
                  </>
                ) : null}
                {rag.filteredCatalog.map((b) => {
                  const on = rag.selectedBookIds.includes(b.id)
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => rag.toggleBook(b.id)}
                      className={`flex h-full flex-col rounded-2xl border p-4 text-left transition ${
                        on
                          ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/25'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Library
                        className={`h-5 w-5 shrink-0 ${on ? 'text-emerald-700' : 'text-gray-400'}`}
                        aria-hidden
                      />
                      <span className="truncate text-sm font-semibold text-gray-900">{b.title}</span>
                    </div>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                        on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-200 bg-white text-gray-300'
                      }`}
                      aria-hidden
                    >
                      {on ? <Check className="h-4 w-4" /> : null}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-600">{b.authors}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 ring-1 ring-gray-200">
                      {b.indexedSections} sections indexed
                    </span>
                    {b.grades.slice(0, 2).map((g) => (
                      <span key={g} className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] text-gray-600 ring-1 ring-gray-100">
                        {g}
                      </span>
                    ))}
                  </div>
                    </button>
                  )
                })}
              </div>

              {rag.filteredCatalog.length === 0 && !rag.catalogBusy && (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                  <Search className="h-8 w-8 text-gray-300" aria-hidden />
                  {rag.catalogQuery.trim() ? (
                    <>
                      <p className="mt-2 text-sm font-medium text-gray-800">No catalog titles match this search</p>
                      <p className="mt-1 max-w-sm text-xs text-gray-600">
                        Try a shorter query, adjust subject or grade above, or clear the search field.
                      </p>
                      <button
                        type="button"
                        onClick={() => rag.setCatalogQuery('')}
                        className="mt-4 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-sm font-medium text-gray-800">No catalog titles for this subject and grade</p>
                      <p className="mt-1 max-w-sm text-xs text-gray-600">
                        The list only shows <span className="font-medium">active content packs</span> that include at least one{' '}
                        <span className="font-medium">published</span> document whose pack metadata matches{' '}
                        <span className="font-medium">{subject}</span> and <span className="font-medium">{grade}</span>. Choose a
                        matching subject/grade, publish your material from the library, or use &quot;Generate without source
                        materials&quot; above.
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <BookMarked className="h-4 w-4 text-indigo-600" aria-hidden />
                  Selected for retrieval ({selectedBooks.length})
                </p>
                {selectedBooks.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-600">
                    No materials selected yet. Pick at least one title above to enable topic strands and retrieval scope.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {selectedBooks.map((b) =>
                      b ? (
                        <li
                          key={b.id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-white bg-white px-3 py-2.5 shadow-sm"
                        >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{b.title}</p>
                        <p className="text-xs text-gray-500">
                          {b.authors} · {b.publisher}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => rag.removeBook(b.id)}
                        className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-700"
                        aria-label={`Remove ${b.title}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
              Source selection is disabled for this run. Generation will rely on your scope prompt and quiz settings only.
            </div>
          )}
        </div>
      </section>

      {/* Step 3 — Scope */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/80 to-white px-6 py-5">
          <StepHeader
            step={3}
            kicker="Scope definition"
            title="Topics & refinement"
            subtitle="Strands come from the book's PDF outline or chapter map when available; otherwise they are grouped by page ranges. Pick one or more, then optionally narrow with the hint below."
          />
        </div>
        <div className="space-y-5 p-6">
          {!rag.generateWithoutSources && rag.selectedBookIds.length === 0 ? (
            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-amber-950">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
              <div>
                <p className="font-semibold">Select one or more materials to browse available topics</p>
                <p className="mt-1 text-amber-900/90">
                  Topic strands are derived from the catalog metadata attached to each approved title.
                </p>
              </div>
            </div>
          ) : (
            <>
              {!rag.generateWithoutSources ? (
                <div>
                  <label className="block text-sm font-medium text-gray-800">Search & select topic strands</label>
                  <p className="mt-1 text-xs text-gray-500">
                    Topics update when your material selection changes.{rag.topicsIndexing ? ' Refreshing index…' : ''}
                  </p>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      value={rag.topicQuery}
                      onChange={(e) => rag.setTopicQuery(e.target.value)}
                      placeholder="Type to filter (e.g. fraction, word problem…)"
                      className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                    />
                  </div>

                {rag.topicsError && !rag.topicsIndexing && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                    <span>Topics unavailable — {rag.topicsError}</span>
                  </div>
                )}

                {rag.topicsIndexing ? (
                  <div className="mt-3 h-24 animate-pulse rounded-xl bg-gray-100" aria-hidden />
                ) : (
                  <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2">
                    {rag.topicOptionsFiltered.length === 0 ? (
                      <p className="px-2 py-6 text-center text-xs text-gray-600">
                        {rag.topicQuery.trim()
                          ? `No topics match "${rag.topicQuery.trim()}".`
                          : rag.availableTopics.length === 0
                            ? 'No topic strands returned for this selection. Try refreshing the page, or use Scope refinement below to steer generation.'
                            : 'No topics match your filter.'}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {rag.topicOptionsFiltered.map((t) => {
                          const active = rag.selectedTopics.includes(t)
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => rag.toggleTopic(t)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                active
                                  ? 'border-violet-500 bg-violet-600 text-white shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {active ? <Check className="h-3 w-3" /> : <ChevronRight className="h-3 w-3 opacity-40" />}
                              {t}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {rag.selectedTopics.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600">Selected ({rag.selectedTopics.length})</span>
                      <button
                        type="button"
                        onClick={() => rag.clearAllTopics()}
                        className="text-xs font-semibold text-violet-700 hover:text-violet-600"
                      >
                        Clear all topics
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rag.selectedTopics.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900 ring-1 ring-violet-200"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => rag.toggleTopic(t)}
                            className="rounded-full p-0.5 hover:bg-violet-100"
                            aria-label={`Remove ${t}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-700">
                  Topic strands are hidden in no-source mode. Use the scope refinement prompt below to define what to generate.
                </div>
              )}

              <label className="block text-sm font-medium text-gray-800">
                Scope refinement {rag.generateWithoutSources ? <span className="text-red-500">*</span> : '(optional)'}
                <textarea
                  rows={2}
                  value={rag.scopeRefinement}
                  onChange={(e) => rag.setScopeRefinement(e.target.value)}
                  placeholder={
                    rag.generateWithoutSources
                      ? 'e.g. Focus on Grade 5 fraction and decimal word problems with exam-style reasoning'
                      : 'Focus on word problems, exam-style reasoning, and common misconceptions'
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
                <span className="mt-1 block text-xs text-gray-500">
                  {rag.generateWithoutSources
                    ? 'Required in no-source mode so the generator still has clear scope.'
                    : 'Acts as a retrieval hint paired with the strands above.'}
                </span>
              </label>

              {/* Scope preview */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-white p-5 shadow-sm ring-1 ring-indigo-100/60">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
                      <Layers className="h-4 w-4" aria-hidden />
                      Scope preview
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {rag.generateWithoutSources ? 'Topic-only scope preview' : 'Retrieval window (demo estimate)'}
                    </p>
                  </div>
                  <Sparkles className="h-5 w-5 text-indigo-400" aria-hidden />
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/90 px-3 py-3 ring-1 ring-gray-100">
                    <dt className="text-[11px] font-semibold uppercase text-gray-500">Sources</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{rag.selectedBookIds.length}</dd>
                  </div>
                  <div className="rounded-xl bg-white/90 px-3 py-3 ring-1 ring-gray-100">
                    <dt className="text-[11px] font-semibold uppercase text-gray-500">Topic strands</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{rag.selectedTopics.length}</dd>
                  </div>
                  <div className="rounded-xl bg-white/90 px-3 py-3 ring-1 ring-gray-100">
                    <dt className="text-[11px] font-semibold uppercase text-gray-500">
                      {rag.generateWithoutSources ? 'Segments (n/a)' : 'Segments matched'}
                    </dt>
                    <dd className="mt-1 text-2xl font-bold text-indigo-700">
                      {rag.generateWithoutSources ? '—' : rag.estimatedSegments}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-gray-600">
                  {rag.generateWithoutSources
                    ? 'No-source mode bypasses retrieval and generates from your prompt, subject, and cohort settings only.'
                    : 'Generation will prioritize approved catalog content. In production, counts come from your vector index after filtering by subject, cohort, and licensing.'}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Step 4 — Generation settings */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50/70 to-white px-6 py-5">
          <StepHeader
            step={4}
            kicker="Question design"
            title="Generation parameters"
            subtitle="Volume, difficulty, and formats for this retrieval pass. These map cleanly to a backend generation job."
          />
        </div>
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Question volume</p>
                <p className="mt-0.5 text-xs text-gray-600">Balanced mix or explicit counts per item type.</p>
              </div>
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm" role="group">
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
                        Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, Number(e.target.value) || QUESTION_COUNT.min))
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
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
                    True / false
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countTf}
                      onChange={(e) => onCountTf(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
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
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                  <span className="text-gray-700">
                    Total: <span className="font-semibold text-gray-900">{customTotal}</span>
                    <span className="text-gray-500"> / {QUESTION_COUNT.max}</span>
                  </span>
                  {customTotal < QUESTION_COUNT.min && (
                    <span className="text-xs font-medium text-amber-700">Minimum {QUESTION_COUNT.min} questions.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-800">Difficulty profile</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Difficulty profile">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={difficulty === d.id}
                  onClick={() => onDifficultyChange(d.id)}
                  className={`text-left rounded-2xl border px-3 py-3 text-sm transition ${
                    difficulty === d.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold text-gray-900">{d.label}</span>
                  <span className="mt-1 block text-xs text-gray-600">{d.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {mixMode === 'balanced' ? (
            <fieldset>
              <legend className="text-sm font-medium text-gray-800">
                Formats <span className="text-red-500">*</span>
              </legend>
              <p className="mt-1 text-xs text-gray-500">At least one type. Totals rotate across enabled formats.</p>
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
            <div className="rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Formats</span> follow the numeric counts above (use zero to omit).
            </div>
          )}

          <label className="block text-sm font-medium text-gray-800">
            Generator instructions (optional)
            <textarea
              rows={2}
              value={teacherNotes}
              onChange={(e) => onTeacherNotesChange(e.target.value)}
              placeholder="e.g. Emphasise misconceptions from last lesson; include one diagram-based item."
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">Merged with retrieval scope when the job runs.</span>
          </label>

          <label className="block max-w-xs text-sm font-medium text-gray-800">
            Time limit (minutes)
            <input
              type="number"
              min={5}
              max={180}
              value={timeLimit}
              onChange={(e) => onTimeLimitChange(Number(e.target.value) || 30)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
          </label>
        </div>
      </section>

      {/* Step 5 — Delivery */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <StepHeader
            step={5}
            kicker="Delivery defaults"
            title="Delivery & scoring defaults"
            subtitle="Saved with the quiz for assignees — independent of the generation pass."
          />
        </div>
        <div className="flex flex-wrap gap-4 p-6">
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleQuestions} onChange={(e) => onShuffleQuestions(e.target.checked)} />
            Shuffle question order for each student
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

      {validationErrors.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950 shadow-sm">
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            Complete the following before generating
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1.5">
            {validationErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

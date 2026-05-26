import {
  AlertCircle,
  BookMarked,
  Check,
  ChevronRight,
  Layers,
  Library,
  Minus,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type { QuizRagScopeModel } from '../../quiz/hooks/useQuizRagScope'
import { getBookById, type DemoBook } from '../../demo/demoContentLibrary'
import { DIFFICULTY_OPTIONS } from '../../quiz/config/quizCreationConfig'
import type { QuizDifficultyId } from '../../demo/generationFromSources'
import { SUBJECTS, GRADES } from '../../types'
import { ASSIGNMENT_TOPIC_COUNT } from '../config/assignmentCreationConfig'
import type { AssignmentBuildSubStepId } from '../config/assignmentWizardSteps'

type SectionTone = 'blue' | 'teal' | 'amber' | 'purple'

const SECTION_HEADER: Record<
  SectionTone,
  { wrap: string; circle: string; kicker: string }
> = {
  blue: {
    wrap: 'border-b border-[#0C447C]/10 bg-gradient-to-r from-[#E6F1FB]/90 to-white',
    circle: 'bg-[#E6F1FB] text-[#0C447C] shadow-md shadow-[#0C447C]/10',
    kicker: 'text-[#0C447C]',
  },
  teal: {
    wrap: 'border-b border-[#085041]/10 bg-gradient-to-r from-[#E1F5EE]/90 to-white',
    circle: 'bg-[#E1F5EE] text-[#085041] shadow-md shadow-emerald-900/10',
    kicker: 'text-[#085041]',
  },
  amber: {
    wrap: 'border-b border-[#633806]/10 bg-gradient-to-r from-[#FAEEDA]/90 to-white',
    circle: 'bg-[#FAEEDA] text-[#633806] shadow-md shadow-amber-900/10',
    kicker: 'text-[#633806]',
  },
  purple: {
    wrap: 'border-b border-[#3C3489]/10 bg-gradient-to-r from-[#EEEDFE]/90 to-white',
    circle: 'bg-[#EEEDFE] text-[#3C3489] shadow-md shadow-indigo-900/10',
    kicker: 'text-[#3C3489]',
  },
}

function StepHeader({
  step,
  tone,
  kicker,
  title,
  subtitle,
}: {
  step: number
  tone: SectionTone
  kicker: string
  title: string
  subtitle: string
}) {
  const s = SECTION_HEADER[tone]
  return (
    <div className="flex gap-4 border-b border-gray-100 pb-4">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${s.circle}`}
      >
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[11px] font-bold uppercase tracking-wide ${s.kicker}`}>{kicker}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{subtitle}</p>
      </div>
    </div>
  )
}

const ASSIGNMENT_TYPES = [
  'Structured response',
  'Essay',
  'Research report',
  'Presentation',
] as const

const RIGOR_OPTIONS = ['Standard', 'Advanced (IB-aligned)', 'Cambridge IGCSE'] as const

export type TopicVolumeMode = 'balanced' | 'per_topic'

type Props = {
  rag: QuizRagScopeModel
  title: string
  onTitleChange: (v: string) => void
  assignmentType: string
  onAssignmentTypeChange: (v: string) => void
  dueAt: string
  onDueAtChange: (v: string) => void
  subject: string
  onSubjectChange: (v: string) => void
  grade: string
  onGradeChange: (v: string) => void
  rigorProfile: string
  onRigorProfileChange: (v: string) => void
  studentInstructions: string
  onStudentInstructionsChange: (v: string) => void
  topicMixMode: TopicVolumeMode
  onTopicMixModeChange: (v: TopicVolumeMode) => void
  topicCount: number
  onTopicCountChange: (v: number) => void
  difficulty: QuizDifficultyId
  onDifficultyChange: (v: QuizDifficultyId) => void
  generatorInstructions: string
  onGeneratorInstructionsChange: (v: string) => void
  activeStepId: AssignmentBuildSubStepId
}

export function AssignmentRagBuildSection({
  rag,
  title,
  onTitleChange,
  assignmentType,
  onAssignmentTypeChange,
  dueAt,
  onDueAtChange,
  subject,
  onSubjectChange,
  grade,
  onGradeChange,
  rigorProfile,
  onRigorProfileChange,
  studentInstructions,
  onStudentInstructionsChange,
  topicMixMode,
  onTopicMixModeChange,
  topicCount,
  onTopicCountChange,
  difficulty,
  onDifficultyChange,
  generatorInstructions,
  onGeneratorInstructionsChange,
  activeStepId,
}: Props) {
  const selectedBooks = rag.selectedBookIds
    .map((id) => getBookById(id, rag.catalog as unknown as DemoBook[]))
    .filter(Boolean)

  const bumpTopicCount = (delta: number) => {
    onTopicCountChange(
      Math.min(ASSIGNMENT_TOPIC_COUNT.max, Math.max(ASSIGNMENT_TOPIC_COUNT.min, topicCount + delta)),
    )
  }

  return (
    <div className="space-y-6">
      {activeStepId === 'basics' && (
      <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
        <div className={`px-6 py-5 ${SECTION_HEADER.blue.wrap}`}>
          <StepHeader
            step={1}
            tone="blue"
            kicker="Assignment identity"
            title="Basics"
            subtitle="Name the assignment, set type and due date, and tune subject and cohort for catalog alignment."
          />
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <label className="block text-sm font-medium text-gray-800">
            Title <span className="text-red-500">*</span>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Comparative analysis — primary sources (Grade 9)"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Assignment type
            <select
              value={assignmentType}
              onChange={(e) => onAssignmentTypeChange(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {ASSIGNMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Due date
            <input
              type="date"
              value={dueAt.length >= 10 ? dueAt.slice(0, 10) : dueAt}
              onChange={(e) => onDueAtChange(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
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
        </div>
        <div className="space-y-4 px-6 pb-6">
          <label className="block text-sm font-medium text-gray-800">
            International rigor profile
            <select
              value={rigorProfile}
              onChange={(e) => onRigorProfileChange(e.target.value)}
              className="mt-1.5 w-full max-w-xl rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {RIGOR_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Student-facing instructions
            <textarea
              rows={3}
              value={studentInstructions}
              onChange={(e) => onStudentInstructionsChange(e.target.value)}
              placeholder="What students see after publish — deadlines, format, and tone."
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">Shown to students after you publish.</span>
          </label>
        </div>
      </section>
      )}

      {activeStepId === 'sources' && (
      <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
        <div className={`px-6 py-5 ${SECTION_HEADER.teal.wrap}`}>
          <StepHeader
            step={2}
            tone="teal"
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
                  placeholder="Search title, author, ISBN, or topic strand..."
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
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Could not load catalog</p>
                    <p className="mt-0.5 text-xs text-red-900/80">{rag.catalogError}</p>
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
                      <p className="mt-2 text-xs text-gray-600">
                        {b.authors} · {b.indexedSections} sections indexed
                      </p>
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
                        The list shows <span className="font-medium">active content packs</span> with{' '}
                        <span className="font-medium">published</span> documents. Adjust filters or use &quot;Generate without
                        source materials&quot; above.
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
                    No materials selected yet. Pick one title above to enable topic strands and retrieval scope.
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
                      ) : null,
                    )}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
              Source selection is disabled for this run. Generation will rely on your scope prompt and assignment settings only.
            </div>
          )}
        </div>
      </section>
      )}

      {activeStepId === 'scope' && (
      <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
        <div className={`px-6 py-5 ${SECTION_HEADER.amber.wrap}`}>
          <StepHeader
            step={3}
            tone="amber"
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
                <p className="font-semibold">Select a material to browse available topics</p>
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
                    Strands update when your material selection changes.{rag.topicsIndexing ? ' Refreshing index…' : ''}
                  </p>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      value={rag.topicQuery}
                      onChange={(e) => rag.setTopicQuery(e.target.value)}
                      placeholder="Type to filter (e.g. argument, evidence...)"
                      className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
                                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
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
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-700"
                        >
                          Clear all topics
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {rag.selectedTopics.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 ring-1 ring-emerald-200"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => rag.toggleTopic(t)}
                              className="rounded-full p-0.5 hover:bg-emerald-100"
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
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <span className="mt-1 block text-xs text-gray-500">
                  {rag.generateWithoutSources
                    ? 'Required in no-source mode so the generator still has clear scope.'
                    : 'Acts as a retrieval hint paired with the strands above.'}
                </span>
              </label>

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
                    : 'Generation will prioritise approved catalog content. In production, counts come from your vector index after filtering by subject, cohort, and licensing.'}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      )}

      {activeStepId === 'design' && (
      <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
        <div className={`px-6 py-5 ${SECTION_HEADER.purple.wrap}`}>
          <StepHeader
            step={4}
            tone="purple"
            kicker="Assignment design"
            title="Generation parameters"
            subtitle="Volume, difficulty, and optional generator notes for this retrieval pass."
          />
        </div>
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Topic volume</p>
                <p className="mt-0.5 text-xs text-gray-600">Balanced mix or explicit per-topic count emphasis.</p>
              </div>
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => onTopicMixModeChange('balanced')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    topicMixMode === 'balanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Balanced mix
                </button>
                <button
                  type="button"
                  onClick={() => onTopicMixModeChange('per_topic')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    topicMixMode === 'per_topic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Per-topic count
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800">Total topics</label>
                <div className="mt-1.5 inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => bumpTopicCount(-1)}
                    disabled={topicCount <= ASSIGNMENT_TOPIC_COUNT.min}
                    className="rounded-l-xl p-2.5 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease topic count"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2.5rem] px-2 text-center text-sm font-semibold tabular-nums text-gray-900">
                    {topicCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => bumpTopicCount(1)}
                    disabled={topicCount >= ASSIGNMENT_TOPIC_COUNT.max}
                    className="rounded-r-xl p-2.5 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase topic count"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              Each topic generates one section in the assignment brief with its own objective, tasks, and scaffolding.
            </p>
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
                    name="assignment-difficulty"
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

          <label className="block text-sm font-medium text-gray-800">
            Generator instructions (optional)
            <textarea
              rows={2}
              value={generatorInstructions}
              onChange={(e) => onGeneratorInstructionsChange(e.target.value)}
              placeholder="e.g. Emphasise real-world application, include a reflection question at the end of each topic section"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">Merged with retrieval scope when the job runs.</span>
          </label>
        </div>
      </section>
      )}
    </div>
  )
}

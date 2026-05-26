import {
  AlertCircle,
  BookMarked,
  Check,
  ChevronRight,
  Library,
  Search,
  X,
} from 'lucide-react'
import type { QuizRagScopeModel } from '../../quiz/hooks/useQuizRagScope'
import { getBookById, type DemoBook } from '../../demo/demoContentLibrary'
import { SUBJECTS, GRADES } from '../../types'
import type { WorksheetBuildSubStepId } from '../config/worksheetWizardSteps'
import { TeacherToolsPanelHeader } from '../../components/TeacherToolsPanelHeader'

const STEP_META: Record<
  WorksheetBuildSubStepId,
  { kicker: string; title: string; subtitle: string; tone: 'indigo' | 'emerald' | 'amber' }
> = {
  basics: {
    kicker: 'Worksheet identity',
    title: 'Worksheet basics',
    subtitle: 'Name the worksheet and set output format, subject, and cohort.',
    tone: 'indigo',
  },
  sources: {
    kicker: 'Content sources',
    title: 'Source materials',
    subtitle: 'Choose catalog titles or switch to topic-only generation.',
    tone: 'emerald',
  },
  scope: {
    kicker: 'Scope definition',
    title: 'Topic strands & refinement',
    subtitle: 'Pick strands from your materials or describe the topic focus.',
    tone: 'amber',
  },
  generation: {
    kicker: 'Generation',
    title: 'Generation parameters',
    subtitle: '',
    tone: 'indigo',
  },
}

export type WorksheetOutputFormat = 'interactive_digital' | 'printable_pdf' | 'both'

type Props = {
  rag: QuizRagScopeModel
  title: string
  onTitleChange: (v: string) => void
  outputFormat: WorksheetOutputFormat
  onOutputFormatChange: (v: WorksheetOutputFormat) => void
  subject: string
  onSubjectChange: (v: string) => void
  grade: string
  onGradeChange: (v: string) => void
  activeStepId: WorksheetBuildSubStepId
}

function generationScopeSummary(rag: QuizRagScopeModel): string {
  if (rag.generateWithoutSources) return 'Topic-only — catalog retrieval skipped.'
  const titles = rag.selectedBookIds
    .map((id) => getBookById(id, rag.catalog as unknown as DemoBook[])?.title)
    .filter(Boolean)
  if (titles.length === 0) return 'No specific book selected'
  return titles.join(' · ')
}

export function WorksheetRagIdentitySection({
  rag,
  title,
  onTitleChange,
  outputFormat,
  onOutputFormatChange,
  subject,
  onSubjectChange,
  grade,
  onGradeChange,
  activeStepId,
}: Props) {
  const selectedBooks = rag.selectedBookIds
    .map((id) => getBookById(id, rag.catalog as unknown as DemoBook[]))
    .filter(Boolean)

  const useMaterials = !rag.generateWithoutSources

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {activeStepId === 'basics' && (
        <>
          <TeacherToolsPanelHeader {...STEP_META.basics} />
          <div className="space-y-4 p-5">
            <label className="block text-sm font-medium text-gray-800">
              Title <span className="text-red-500">*</span>
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Photosynthesis — retrieval practice (Grade 8)"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                Output format
                <select
                  value={outputFormat}
                  onChange={(e) => onOutputFormatChange(e.target.value as WorksheetOutputFormat)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="interactive_digital">Interactive digital</option>
                  <option value="printable_pdf">Print-ready PDF</option>
                  <option value="both">Both</option>
                </select>
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
          </div>
        </>
      )}

      {activeStepId === 'sources' && (
        <>
          <TeacherToolsPanelHeader {...STEP_META.sources} />
          <div className="space-y-4 p-5">
            <label className="inline-flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={useMaterials}
                onChange={(e) => rag.setGenerateWithoutSources(!e.target.checked)}
                className="mt-0.5 rounded border-gray-300"
              />
              <span>
                <span className="block font-semibold text-gray-900">Use selected materials for generation</span>
                <span className="mt-0.5 block text-xs text-gray-600">
                  Topic-only mode skips retrieval and only uses your scope prompt.
                </span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => rag.setGenerateWithoutSources(true)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  rag.generateWithoutSources
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Generate topic-only
              </button>
              <button
                type="button"
                onClick={() => rag.setGenerateWithoutSources(false)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  !rag.generateWithoutSources
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Generate with selected materials
              </button>
            </div>
            {!rag.generateWithoutSources ? (
              <div className="space-y-5">
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
                  {rag.catalogBusy && rag.filteredCatalog.length === 0
                    ? [1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)
                    : null}
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
                        <p className="mt-2 text-xs text-gray-600">{b.authors}</p>
                      </button>
                    )
                  })}
                </div>
                <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BookMarked className="h-4 w-4 text-indigo-600" aria-hidden />
                    Selected for retrieval ({selectedBooks.length})
                  </p>
                  {selectedBooks.length === 0 ? (
                    <p className="mt-3 text-sm text-gray-600">No materials selected yet.</p>
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
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                Catalog search is hidden in topic-only mode. Continue to Scope to define your focus.
              </div>
            )}
          </div>
        </>
      )}

      {activeStepId === 'scope' && (
        <>
          <TeacherToolsPanelHeader {...STEP_META.scope} />
          <div className="space-y-4 p-5">
            {!rag.generateWithoutSources && rag.selectedBookIds.length === 0 ? (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-amber-950">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                <div>
                  <p className="font-semibold">Select materials first</p>
                  <p className="mt-1 text-amber-900/90">Go back to Sources to pick catalog titles.</p>
                </div>
              </div>
            ) : null}

            {!rag.generateWithoutSources && rag.selectedBookIds.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-800">Search & select topic strands</label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={rag.topicQuery}
                    onChange={(e) => rag.setTopicQuery(e.target.value)}
                    placeholder="Type to filter (e.g. fraction, word problem...)"
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                {rag.topicsIndexing ? (
                  <div className="mt-3 h-24 animate-pulse rounded-xl bg-gray-100" aria-hidden />
                ) : (
                  <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2">
                    {rag.topicOptionsFiltered.length === 0 ? (
                      <p className="px-2 py-6 text-center text-xs text-gray-600">No strands match your filter.</p>
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
              </div>
            ) : null}

            <label className="block text-sm font-medium text-gray-800">
              Scope refinement {rag.generateWithoutSources ? <span className="text-red-500">*</span> : '(optional)'}
              <textarea
                rows={3}
                value={rag.scopeRefinement}
                onChange={(e) => rag.setScopeRefinement(e.target.value)}
                placeholder="Focus on word problems, exam-style reasoning, and common misconceptions"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Generation scope:</span>{' '}
              <span className="text-gray-600">{generationScopeSummary(rag)}</span>
            </p>
          </div>
        </>
      )}
    </section>
  )
}

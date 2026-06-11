import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  BookMarked,
  Check,
  ChevronRight,
  Library,
  Search,
  X,
} from 'lucide-react'
import type { QuizRagScopeModel } from '../hooks/useQuizRagScope'
import { BookScopePanel } from '../../../../../features/quiz/components/BookScopePanel'
import { ScopeSummaryBar } from '../../../../../features/quiz/components/ScopeSummaryBar'
import { TeacherToolsPanelHeader } from '../../components/TeacherToolsPanelHeader'
import { getBookById, type DemoBook } from '../../demo/demoContentLibrary'
import { DIFFICULTY_OPTIONS, QUESTION_COUNT } from '../config/quizCreationConfig'
import type { QuizBuildSubStepId } from '../config/quizWizardSteps'
import type { QuestionMixMode, QuizDifficultyId } from '../../demo/generationFromSources'
import { SUBJECTS, GRADES } from '../../types'

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
  activeStepId: QuizBuildSubStepId
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
  activeStepId,
}: Props) {
  const { t } = useTranslation()

  const stepMeta = useMemo(
    (): Record<
      QuizBuildSubStepId,
      { kicker: string; title: string; subtitle: string; tone: 'indigo' | 'emerald' | 'violet' | 'sky' | 'gray' }
    > => ({
      basics: {
        kicker: t('quiz.rag.stepBasicsKicker'),
        title: t('quiz.rag.stepBasicsTitle'),
        subtitle: t('quiz.rag.stepBasicsSubtitle'),
        tone: 'indigo',
      },
      sources: {
        kicker: t('quiz.rag.stepSourcesKicker'),
        title: t('quiz.rag.stepSourcesTitle'),
        subtitle: t('quiz.rag.stepSourcesSubtitle'),
        tone: 'emerald',
      },
      scope: {
        kicker: t('quiz.rag.stepScopeKicker'),
        title: t('quiz.rag.stepScopeTitle'),
        subtitle: t('quiz.rag.stepScopeSubtitle'),
        tone: 'violet',
      },
      design: {
        kicker: t('quiz.rag.stepDesignKicker'),
        title: t('quiz.rag.stepDesignTitle'),
        subtitle: t('quiz.rag.stepDesignSubtitle'),
        tone: 'sky',
      },
      delivery: {
        kicker: t('quiz.rag.stepDeliveryKicker'),
        title: t('quiz.rag.stepDeliveryTitle'),
        subtitle: t('quiz.rag.stepDeliverySubtitle'),
        tone: 'gray',
      },
    }),
    [t],
  )

  const formatOptions = useMemo(
    () =>
      [
        ['mcq', t('teacherTools.multipleChoice'), includeMcq, onToggleMcq],
        ['tf', t('teacherTools.trueFalse'), includeTf, onToggleTf],
        ['short', t('teacherTools.shortAnswer'), includeShort, onToggleShort],
      ] as const,
    [t, includeMcq, includeTf, includeShort, onToggleMcq, onToggleTf, onToggleShort],
  )

  const customTotal = countMcq + countTf + countShort

  const selectedBooks = rag.selectedBookIds
    .map((id) => getBookById(id, rag.catalog as unknown as DemoBook[]))
    .filter(Boolean)

  return (
    <div>
      {activeStepId === 'basics' && (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <TeacherToolsPanelHeader {...stepMeta.basics} />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="md:col-span-2 block text-sm font-medium text-gray-800">
            {t('teacherTools.title')} <span className="text-red-500">*</span>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t('quiz.rag.titlePlaceholder')}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            {t('teacherTools.subject')}
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
            {t('teacherTools.gradeCohort')}
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
            {t('teacherTools.studentInstructions')}
            <textarea
              rows={3}
              value={studentInstructions}
              onChange={(e) => onStudentInstructionsChange(e.target.value)}
              placeholder={t('quiz.defaultInstructions')}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">{t('quiz.rag.instructionsHint')}</span>
          </label>
        </div>
      </section>
      )}

      {activeStepId === 'sources' && (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <TeacherToolsPanelHeader {...stepMeta.sources} />
        <div className="space-y-5 p-5">
          <label className="inline-flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={rag.generateWithoutSources}
              onChange={(e) => rag.setGenerateWithoutSources(e.target.checked)}
              className="mt-0.5 rounded border-gray-300"
            />
            <span>
              <span className="block font-semibold text-gray-900">{t('teacherTools.generateWithoutSources')}</span>
              <span className="mt-0.5 block text-xs text-gray-600">
                {t('quiz.rag.generateWithoutSourcesHint')}
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
                  placeholder={t('teacherTools.catalogSearchPlaceholder')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  aria-label={t('teacherTools.ariaSearch')}
                />
                {rag.catalogBusy && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700">
                    {t('teacherTools.working')}
                  </span>
                )}
              </div>

              {rag.catalogError && !rag.catalogBusy && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-950">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{t('quiz.rag.catalogLoadFailed')}</p>
                    <p className="mt-0.5 text-red-900/80 text-xs">{rag.catalogError}</p>
                    <button
                      type="button"
                      onClick={rag.retryCatalog}
                      className="mt-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      {t('teacherTools.retry')}
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
                      {t('teacherTools.sectionsIndexed', { count: b.indexedSections })}
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
                      <p className="mt-2 text-sm font-medium text-gray-800">{t('quiz.rag.noSearchMatch')}</p>
                      <p className="mt-1 max-w-sm text-xs text-gray-600">
                        {t('quiz.rag.noSearchMatchHint')}
                      </p>
                      <button
                        type="button"
                        onClick={() => rag.setCatalogQuery('')}
                        className="mt-4 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                      >
                        {t('teacherTools.clearSearch')}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-sm font-medium text-gray-800">{t('quiz.rag.noCatalogForGrade')}</p>
                      <p className="mt-1 max-w-sm text-xs text-gray-600">
                        {t('quiz.rag.noCatalogHint', { subject, grade })}
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <BookMarked className="h-4 w-4 text-indigo-600" aria-hidden />
                  {t('quiz.rag.selectedForRetrieval', { count: selectedBooks.length })}
                </p>
                {selectedBooks.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-600">
                    {t('quiz.rag.noMaterialsSelected')}
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
                        aria-label={`${t('teacherTools.remove')} ${b.title}`}
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
              {t('quiz.rag.topicOnlySourcesDisabled')}
            </div>
          )}
        </div>
      </section>
      )}

      {activeStepId === 'scope' && (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <TeacherToolsPanelHeader {...stepMeta.scope} />
        <div className="space-y-5 p-5">
          {!rag.generateWithoutSources && rag.selectedBookIds.length === 0 ? (
            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-amber-950">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
              <div>
                <p className="font-semibold">{t('quiz.rag.selectMaterialsForTopics')}</p>
                <p className="mt-1 text-amber-900/90">
                  {t('quiz.rag.topicsFromCatalog')}
                </p>
              </div>
            </div>
          ) : (
            <>
              {!rag.generateWithoutSources ? (
                <>
                  {rag.structureLoading ? (
                    <div className="h-32 animate-pulse rounded-xl bg-gray-100" aria-hidden />
                  ) : rag.selectedPackStructures.length > 0 ? (
                    <div className="space-y-4">
                      {rag.selectedPackStructures.map((pack) => (
                        <BookScopePanel
                          key={pack.pack_id}
                          packStructure={pack}
                          selectedTopicIds={rag.selectedTopicIds}
                          onToggleTopic={(topicId, includeChildren, leafOnly) =>
                            rag.toggleTopicId(topicId, includeChildren, leafOnly)
                          }
                          onToggleDocument={(_docId, topicIds) => rag.toggleDocumentTopics(topicIds)}
                          onRemoveBook={() => {
                            rag.removeBook(pack.pack_id)
                            rag.clearBookScope(pack.pack_id)
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-800">{t('teacherTools.topicStrandsHeading')}</label>
                      <p className="mt-1 text-xs text-gray-500">{t('quiz.rag.topicsRefreshHint')}</p>
                      <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2">
                        {rag.topicOptionsFiltered.length === 0 ? (
                          <p className="px-2 py-6 text-center text-xs text-gray-600">{t('quiz.rag.noTopicsReturned')}</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {rag.topicOptionsFiltered.map((topicLabel) => {
                              const active = rag.selectedTopics.includes(topicLabel)
                              return (
                                <button
                                  key={topicLabel}
                                  type="button"
                                  onClick={() => rag.toggleTopic(topicLabel)}
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                    active
                                      ? 'border-violet-500 bg-violet-600 text-white shadow-sm'
                                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  {active ? <Check className="h-3 w-3" /> : <ChevronRight className="h-3 w-3 opacity-40" />}
                                  {topicLabel}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-700">
                  {t('quiz.rag.topicOnlyStrandsHidden')}
                </div>
              )}

              <label className="block text-sm font-medium text-gray-800">
                {rag.generateWithoutSources ? (
                  <>
                    {t('teacherTools.scopeRefinement')} <span className="text-red-500">*</span>
                  </>
                ) : (
                  t('teacherTools.scopeRefinementOptional')
                )}
                <textarea
                  rows={2}
                  value={rag.scopeRefinement}
                  onChange={(e) => rag.setScopeRefinement(e.target.value)}
                  placeholder={
                    rag.generateWithoutSources
                      ? t('quiz.rag.scopePlaceholderNoSource')
                      : t('teacherTools.scopeRefinementPlaceholder')
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </label>

              <ScopeSummaryBar
                bookCount={rag.selectedBookIds.length}
                topicCount={rag.allSelectedTopicIds.length || rag.selectedTopics.length}
                estimatedSegments={rag.estimatedSegments}
                generateWithoutSources={rag.generateWithoutSources}
                scopeError={rag.scopeError}
                perDocument={rag.perDocumentPreview}
                scopeSummaryLabel={rag.scopeSummaryLabel}
              />
            </>
          )}
        </div>
      </section>
      )}

      {activeStepId === 'design' && (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <TeacherToolsPanelHeader {...stepMeta.design} />
        <div className="space-y-5 p-5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('quiz.rag.questionVolume')}</p>
                <p className="mt-0.5 text-xs text-gray-600">{t('quiz.rag.questionVolumeHint')}</p>
              </div>
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => onMixModeChange('balanced')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mixMode === 'balanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('teacherTools.balancedMix')}
                </button>
                <button
                  type="button"
                  onClick={() => onMixModeChange('custom')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mixMode === 'custom' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('teacherTools.perTypeCounts')}
                </button>
              </div>
            </div>

            {mixMode === 'balanced' ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-800">
                  {t('teacherTools.totalQuestions')}
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
                    {t('teacherTools.multipleChoice')}
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
                    {t('teacherTools.trueFalse')}
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
                    {t('teacherTools.shortAnswer')}
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
                    {t('quiz.rag.total')}{' '}
                    <span className="font-semibold text-gray-900">{customTotal}</span>
                    <span className="text-gray-500"> / {QUESTION_COUNT.max}</span>
                  </span>
                  {customTotal < QUESTION_COUNT.min && (
                    <span className="text-xs font-medium text-amber-700">
                      {t('quiz.rag.minimumQuestions', { count: QUESTION_COUNT.min })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-800">{t('teacherTools.difficultyProfile')}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label={t('teacherTools.difficultyProfile')}>
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
                {t('quiz.rag.formats')} <span className="text-red-500">*</span>
              </legend>
              <p className="mt-1 text-xs text-gray-500">{t('quiz.rag.formatsHint')}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {formatOptions.map(([key, label, on, set]) => (
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
              {t('quiz.rag.formatsFollowCounts')}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-800">
            {t('quiz.rag.generatorInstructions')}
            <textarea
              rows={2}
              value={teacherNotes}
              onChange={(e) => onTeacherNotesChange(e.target.value)}
              placeholder={t('quiz.rag.generatorPlaceholder')}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">{t('quiz.rag.generatorHint')}</span>
          </label>

          <label className="block max-w-xs text-sm font-medium text-gray-800">
            {t('quiz.rag.timeLimitMinutes')}
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
      )}

      {activeStepId === 'delivery' && (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <TeacherToolsPanelHeader {...stepMeta.delivery} />
        <div className="flex flex-wrap gap-4 p-5">
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleQuestions} onChange={(e) => onShuffleQuestions(e.target.checked)} />
            {t('quiz.rag.shuffleQuestions')}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleAnswers} onChange={(e) => onShuffleAnswers(e.target.checked)} />
            {t('quiz.rag.shuffleMcq')}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={negativeMarking} onChange={(e) => onNegativeMarking(e.target.checked)} />
            {t('quiz.rag.negativeMarking')}
          </label>
        </div>
      </section>
      )}
    </div>
  )
}

/**
 * Exam Step 1 — catalog + topic strands + scope refinement (quiz-equivalent UI).
 * Omits the quiz “Scope preview” metrics card; ends with a worksheet-style generation scope line.
 */
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
import type { QuizRagScopeModel } from '../../quiz/hooks/useQuizRagScope'
import { getBookById } from '../../demo/demoContentLibrary'
import { formatSourceSummary } from '../../demo/generationFromSources'
import { subjectToTeacherToolsLabel } from '@/catalog/adapters/subjectAdapters'
import { ScopeStepChrome, TeacherToolsFieldBand } from '../../components'

type Props = {
  rag: QuizRagScopeModel
  subject: string
  grade: string
  panelStep: 'sources' | 'scope'
}

export function ExamSourcesRagPanel({ rag, subject, grade, panelStep }: Props) {
  const { t } = useTranslation()

  const selectedBooks = rag.selectedBookIds
    .map((id) => getBookById(id, rag.catalog as never))
    .filter(Boolean)

  return (
    <div className="space-y-5">
      {panelStep === 'sources' && (
        <>
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
                {t('history.updating')}
              </span>
            )}
          </div>

          {rag.catalogError && !rag.catalogBusy && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-950">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t('quiz.rag.catalogLoadFailed')}</p>
                <p className="mt-0.5 text-xs text-red-900/80">{rag.catalogError}</p>
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
                      <Library className={`h-5 w-5 shrink-0 ${on ? 'text-emerald-700' : 'text-gray-400'}`} aria-hidden />
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
                      <span
                        key={g}
                        className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] text-gray-600 ring-1 ring-gray-100"
                      >
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
                    {t('quiz.rag.noCatalogHint', { subject: subjectToTeacherToolsLabel(subject), grade })}
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
                  ) : null,
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
        </>
      )}

      {panelStep === 'scope' && (
        <>
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
        <ScopeStepChrome
          title={t('teacherTools.scopeStep.title')}
          subtitle={t('teacherTools.scopeStep.subtitle')}
          searchSlot={
            !rag.generateWithoutSources ? (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={rag.topicQuery}
                  onChange={(e) => rag.setTopicQuery(e.target.value)}
                  placeholder={t('teacherTools.scopeSearchPlaceholder')}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </div>
            ) : undefined
          }
        >
          {!rag.generateWithoutSources ? (
            <TeacherToolsFieldBand variant="library">
            <div>
              <label className="block text-sm font-medium text-gray-800">{t('teacherTools.topicStrandsHeading')}</label>
              <p className="mt-1 text-xs text-gray-500">
                {t('quiz.rag.topicsRefreshHint')}
                {rag.topicsIndexing ? ` ${t('quiz.rag.topicsRefreshing')}` : ''}
              </p>
              {rag.topicsError && !rag.topicsIndexing && (
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  <span>{t('quiz.rag.topicsUnavailable')} {rag.topicsError}</span>
                </div>
              )}

              {rag.topicsIndexing ? (
                <div className="mt-3 h-24 animate-pulse rounded-xl bg-gray-100" aria-hidden />
              ) : (
                <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2">
                  {rag.topicOptionsFiltered.length === 0 ? (
                    <p className="px-2 py-6 text-center text-xs text-gray-600">
                      {rag.topicQuery.trim()
                        ? t('quiz.rag.noTopicsMatch', { query: rag.topicQuery.trim() })
                        : rag.availableTopics.length === 0
                          ? t('quiz.rag.noTopicsReturned')
                          : t('quiz.rag.noTopicsFilter')}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {rag.topicOptionsFiltered.map((topic) => {
                        const active = rag.selectedTopics.includes(topic)
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => rag.toggleTopic(topic)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                              active
                                ? 'border-violet-500 bg-violet-600 text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {active ? <Check className="h-3 w-3" /> : <ChevronRight className="h-3 w-3 opacity-40" />}
                            {topic}
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
                    <span className="text-xs font-semibold text-gray-600">
                      {t('quiz.rag.selectedTopics', { count: rag.selectedTopics.length })}
                    </span>
                    <button
                      type="button"
                      onClick={() => rag.clearAllTopics()}
                      className="text-xs font-semibold text-violet-700 hover:text-violet-600"
                    >
                      {t('quiz.rag.clearAllTopics')}
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rag.selectedTopics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900 ring-1 ring-violet-200"
                      >
                        {topic}
                        <button
                          type="button"
                          onClick={() => rag.toggleTopic(topic)}
                          className="rounded-full p-0.5 hover:bg-violet-100"
                          aria-label={`${t('teacherTools.remove')} ${topic}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </TeacherToolsFieldBand>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-700">
              {t('quiz.rag.topicOnlyStrandsHidden')}
            </div>
          )}

          <TeacherToolsFieldBand variant="ai">
          <label className="block text-sm font-medium text-gray-800">
            {rag.generateWithoutSources ? (
              <>
                {t('teacherTools.focusForAi')} <span className="text-red-500">*</span>
              </>
            ) : (
              t('teacherTools.focusForAi')
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
            <span className="mt-1 block text-xs text-gray-500">
              {rag.generateWithoutSources
                ? t('quiz.rag.scopeRequiredNoSource')
                : t('quiz.rag.scopeHintWithSource')}
            </span>
          </label>
          </TeacherToolsFieldBand>

          <p className="border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-600">
            <span className="font-semibold text-gray-800">{t('teacherTools.generationScope')}</span>{' '}
            {formatSourceSummary(rag.getGenerationContext())}
          </p>
        </ScopeStepChrome>
      )}
        </>
      )}
    </div>
  )
}

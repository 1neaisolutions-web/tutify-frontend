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
import { TeacherToolsFieldBand, TeacherToolsScopeStepContent } from '../../components'

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
        <TeacherToolsScopeStepContent
          rag={rag}
          accent="violet"
          refinementExtra={
            <span className="mt-1 block text-xs text-gray-500">
              {rag.generateWithoutSources
                ? t('quiz.rag.scopeRequiredNoSource')
                : t('quiz.rag.scopeHintWithSource')}
            </span>
          }
          afterRefinement={
            <p className="border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-800">{t('teacherTools.generationScope')}</span>{' '}
              {formatSourceSummary(rag.getGenerationContext())}
            </p>
          }
        />
      )}
        </>
      )}
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { AlertCircle, BookMarked, Search, X } from 'lucide-react'
import { subjectToTeacherToolsLabel } from '@/catalog/adapters/subjectAdapters'
import { gradeToLabel } from '@/catalog/adapters/gradeAdapters'
import type { AdaptedBook } from '@/api/quizCatalog'
import type { QuizRagScopeModel } from '../quiz/hooks/useQuizRagScope'
import { CatalogBrowseControls } from './CatalogBrowseControls'
import { CatalogBookGrid } from './CatalogBookGrid'

type Props = {
  rag: QuizRagScopeModel
  subject: string
  grade: string
  /** Resolved selected book objects for the footer list */
  selectedBooks: AdaptedBook[]
}

export function CatalogSourcesBookPicker({ rag, subject, grade, selectedBooks }: Props) {
  const { t } = useTranslation()
  const subjectLabel = subjectToTeacherToolsLabel(subject)
  const gradeLabel = gradeToLabel(grade)

  return (
    <>
      <CatalogBrowseControls
        subject={subject}
        grade={grade}
        browseAllCatalog={rag.browseAllCatalog}
        onBrowseAllChange={rag.setBrowseAllCatalog}
      />

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

      {rag.catalogBusy && rag.filteredCatalog.length === 0 && !rag.showNearMatches ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <CatalogBookGrid
          books={rag.filteredCatalog}
          rag={rag}
          showIncompleteMetadata={rag.browseAllCatalog}
        />
      )}

      {rag.showNearMatches ? (
        <div className="space-y-3 border-t border-gray-100 pt-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {t('teacherTools.catalogNearMatchesTitle', { subject: subjectLabel })}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {t('teacherTools.catalogNearMatchesHint', { subject: subjectLabel, grade: gradeLabel })}
            </p>
          </div>
          <CatalogBookGrid books={rag.nearMatchCatalog} rag={rag} />
        </div>
      ) : null}

      {rag.filteredCatalog.length === 0 && !rag.catalogBusy && !rag.showNearMatches ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <Search className="h-8 w-8 text-gray-300" aria-hidden />
          {rag.catalogQuery.trim() ? (
            <>
              <p className="mt-2 text-sm font-medium text-gray-800">{t('quiz.rag.noSearchMatch')}</p>
              <p className="mt-1 max-w-sm text-xs text-gray-600">{t('quiz.rag.noSearchMatchHint')}</p>
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
                {t('quiz.rag.noCatalogHint', { subject: subjectLabel, grade: gradeLabel })}
              </p>
            </>
          )}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <BookMarked className="h-4 w-4 text-indigo-600" aria-hidden />
          {t('quiz.rag.selectedForRetrieval', { count: selectedBooks.length })}
        </p>
        {selectedBooks.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{t('quiz.rag.noMaterialsSelected')}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selectedBooks.map((b) => (
              <li
                key={b.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white bg-white px-3 py-2.5 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">
                    {b.authors} · {b.publisher}
                  </p>
                  {rag.isBookOutsideFilter(b) ? (
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                      {t('teacherTools.bookOutsideFilter')}
                    </p>
                  ) : null}
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
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

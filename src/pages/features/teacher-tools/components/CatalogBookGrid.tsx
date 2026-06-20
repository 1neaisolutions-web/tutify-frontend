import { useTranslation } from 'react-i18next'
import { Check, Library } from 'lucide-react'
import type { AdaptedBook } from '@/api/quizCatalog'
import type { QuizRagScopeModel } from '../quiz/hooks/useQuizRagScope'

type Props = {
  books: AdaptedBook[]
  rag: QuizRagScopeModel
  showIncompleteMetadata?: boolean
}

export function CatalogBookGrid({ books, rag, showIncompleteMetadata = false }: Props) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((b) => {
        const on = rag.selectedBookIds.includes(b.id)
        const incomplete =
          showIncompleteMetadata && (!b.subject || b.grades.length === 0)
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
              {incomplete ? (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 ring-1 ring-amber-200">
                  {t('teacherTools.incompleteMetadata')}
                </span>
              ) : null}
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
  )
}

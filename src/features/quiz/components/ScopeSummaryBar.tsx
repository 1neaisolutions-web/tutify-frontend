import { useTranslation } from 'react-i18next'
import { AlertCircle, BarChart3 } from 'lucide-react'
import type { ScopePreviewResponse } from '../../../api/quizCatalog'

type Props = {
  bookCount: number
  topicCount: number
  estimatedSegments: number
  generateWithoutSources: boolean
  scopeError: string | null
  perDocument?: ScopePreviewResponse['per_document']
  scopeSummaryLabel: string
}

export function ScopeSummaryBar({
  bookCount,
  topicCount,
  estimatedSegments,
  generateWithoutSources,
  scopeError,
  perDocument,
  scopeSummaryLabel,
}: Props) {
  const { t } = useTranslation()
  const showEmptyWarning = !generateWithoutSources && topicCount > 0 && estimatedSegments === 0

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-white p-5 shadow-sm ring-1 ring-indigo-100/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
            <BarChart3 className="h-4 w-4" aria-hidden />
            {t('quiz.rag.scopeSummaryTitle')}
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900">{scopeSummaryLabel}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/90 px-3 py-3 ring-1 ring-gray-100">
          <dt className="text-[11px] font-semibold uppercase text-gray-500">{t('quiz.rag.sources')}</dt>
          <dd className="mt-1 text-2xl font-bold text-gray-900">{bookCount}</dd>
        </div>
        <div className="rounded-xl bg-white/90 px-3 py-3 ring-1 ring-gray-100">
          <dt className="text-[11px] font-semibold uppercase text-gray-500">{t('quiz.rag.topicStrands')}</dt>
          <dd className="mt-1 text-2xl font-bold text-gray-900">{topicCount}</dd>
        </div>
        <div className="rounded-xl bg-white/90 px-3 py-3 ring-1 ring-gray-100">
          <dt className="text-[11px] font-semibold uppercase text-gray-500">
            {generateWithoutSources ? t('quiz.rag.segmentsNa') : t('quiz.rag.segmentsMatched')}
          </dt>
          <dd className="mt-1 text-2xl font-bold text-indigo-700">
            {generateWithoutSources ? '—' : estimatedSegments}
          </dd>
        </div>
      </dl>

      {perDocument && perDocument.length > 0 && !generateWithoutSources ? (
        <ul className="mt-4 space-y-1 text-xs text-gray-600">
          {perDocument.map((row) => (
            <li key={row.document_id}>
              {row.document_title} → {row.chunk_count} {t('quiz.rag.segmentsMatched').toLowerCase()}
            </li>
          ))}
        </ul>
      ) : null}

      {(scopeError || showEmptyWarning) && (
        <div className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{scopeError || t('quiz.rag.noSegmentsForScope')}</span>
        </div>
      )}
    </div>
  )
}

import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronRight, Search, X } from 'lucide-react'
import type { QuizRagScopeModel } from '../quiz/hooks/useQuizRagScope'
import {
  BookScopePanel,
  collectSelectedTopicEntries,
} from '../../../../features/quiz/components/BookScopePanel'
import { ScopeSummaryBar } from '../../../../features/quiz/components/ScopeSummaryBar'
import { ScopeStepChrome } from './ScopeStepChrome'
import { TeacherToolsFieldBand } from './TeacherToolsFieldBand'

type ScopeAccent = 'violet' | 'emerald'

const ACCENT: Record<
  ScopeAccent,
  {
    searchFocus: string
    chipActive: string
    chipLabel: string
    textareaFocus: string
  }
> = {
  violet: {
    searchFocus: 'focus:border-violet-500 focus:ring-violet-100',
    chipActive: 'border-violet-500 bg-violet-600 text-white shadow-sm',
    chipLabel: 'bg-violet-50 text-violet-900 ring-violet-200',
    textareaFocus: 'focus:border-violet-400 focus:ring-violet-100',
  },
  emerald: {
    searchFocus: 'focus:border-emerald-500 focus:ring-emerald-100',
    chipActive: 'border-emerald-500 bg-emerald-600 text-white shadow-sm',
    chipLabel: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
    textareaFocus: 'focus:border-emerald-400 focus:ring-emerald-100',
  },
}

export type TeacherToolsScopeStepContentProps = {
  rag: QuizRagScopeModel
  accent?: ScopeAccent
  refinementRows?: number
  refinementExtra?: ReactNode
  afterRefinement?: ReactNode
}

export function TeacherToolsScopeStepContent({
  rag,
  accent = 'violet',
  refinementRows = 2,
  refinementExtra,
  afterRefinement,
}: TeacherToolsScopeStepContentProps) {
  const { t } = useTranslation()
  const [scopeTreeQuery, setScopeTreeQuery] = useState('')
  const styles = ACCENT[accent]

  const selectedTopicEntries = useMemo(
    () => collectSelectedTopicEntries(rag.selectedPackStructures, rag.selectedTopicIds),
    [rag.selectedPackStructures, rag.selectedTopicIds],
  )

  const selectedCount =
    selectedTopicEntries.length || rag.selectedTopics.length

  const selectedTopicsPanel = (chips: ReactNode) =>
    selectedCount > 0 ? (
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {t('quiz.rag.selectedTopics', { count: selectedCount })}
          </h4>
          <button
            type="button"
            onClick={() => rag.clearAllTopics()}
            className="text-xs font-semibold text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            {t('quiz.rag.clearAllTopics')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">{chips}</div>
      </div>
    ) : null

  const scopeSearchInput = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={scopeTreeQuery}
        onChange={(e) => setScopeTreeQuery(e.target.value)}
        placeholder={t('teacherTools.scopeSearchPlaceholder')}
        className={`w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 ${styles.searchFocus}`}
        aria-label={t('teacherTools.ariaSearch')}
      />
    </div>
  )

  const fallbackSearchInput = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={rag.topicQuery}
        onChange={(e) => rag.setTopicQuery(e.target.value)}
        placeholder={t('teacherTools.scopeSearchPlaceholder')}
        className={`w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 ${styles.searchFocus}`}
        aria-label={t('teacherTools.ariaSearch')}
      />
    </div>
  )

  const hasPackStructures = rag.selectedPackStructures.length > 0

  return (
    <ScopeStepChrome
      title={t('teacherTools.scopeStep.title')}
      subtitle={t('teacherTools.scopeStep.subtitle')}
      searchSlot={
        !rag.generateWithoutSources
          ? hasPackStructures
            ? scopeSearchInput
            : fallbackSearchInput
          : undefined
      }
      summarySlot={
        <ScopeSummaryBar
          bookCount={rag.selectedBookIds.length}
          topicCount={rag.allSelectedTopicIds.length || rag.selectedTopics.length}
          estimatedSegments={rag.estimatedSegments}
          generateWithoutSources={rag.generateWithoutSources}
          scopeError={rag.scopeError}
          perDocument={rag.perDocumentPreview}
          scopeSummaryLabel={rag.scopeSummaryLabel}
        />
      }
    >
      {!rag.generateWithoutSources ? (
        <>
          {rag.structureLoading ? (
            <div className="h-32 animate-pulse rounded-xl bg-gray-100" aria-hidden />
          ) : hasPackStructures ? (
            <TeacherToolsFieldBand variant="library">
              <div className="space-y-4">
                {rag.selectedPackStructures.map((pack) => (
                  <BookScopePanel
                    key={pack.pack_id}
                    packStructure={pack}
                    selectedTopicIds={rag.selectedTopicIds}
                    filterQuery={scopeTreeQuery}
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
                {selectedTopicsPanel(
                  selectedTopicEntries.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => rag.toggleTopicId(id, false, true)}
                      className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-3 pr-2 text-xs font-medium ring-1 transition hover:opacity-90 ${styles.chipLabel}`}
                      aria-label={`${t('teacherTools.remove')} ${label}`}
                    >
                      {label}
                      <X className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                    </button>
                  )),
                )}
              </div>
            </TeacherToolsFieldBand>
          ) : (
            <TeacherToolsFieldBand variant="library">
              <label className="block text-sm font-medium text-gray-800">{t('teacherTools.topicStrandsHeading')}</label>
              <p className="mt-1 text-xs text-gray-500">
                {t('quiz.rag.topicsRefreshHint')}
                {rag.topicsIndexing ? ` ${t('quiz.rag.topicsRefreshing')}` : ''}
              </p>
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
                      {rag.topicOptionsFiltered.map((topicLabel) => {
                        const active = rag.selectedTopics.includes(topicLabel)
                        return (
                          <button
                            key={topicLabel}
                            type="button"
                            onClick={() => rag.toggleTopic(topicLabel)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                              active ? styles.chipActive : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
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
              )}
              {selectedTopicsPanel(
                rag.selectedTopics.map((topicLabel) => (
                  <button
                    key={topicLabel}
                    type="button"
                    onClick={() => rag.toggleTopic(topicLabel)}
                    className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-3 pr-2 text-xs font-medium ring-1 transition hover:opacity-90 ${styles.chipLabel}`}
                    aria-label={`${t('teacherTools.remove')} ${topicLabel}`}
                  >
                    {topicLabel}
                    <X className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                  </button>
                )),
              )}
            </TeacherToolsFieldBand>
          )}
        </>
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
            rows={refinementRows}
            value={rag.scopeRefinement}
            onChange={(e) => rag.setScopeRefinement(e.target.value)}
            placeholder={
              rag.generateWithoutSources
                ? t('quiz.rag.scopePlaceholderNoSource')
                : t('teacherTools.scopeRefinementPlaceholder')
            }
            className={`mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${styles.textareaFocus}`}
          />
        </label>
        {refinementExtra}
      </TeacherToolsFieldBand>

      {afterRefinement}
    </ScopeStepChrome>
  )
}

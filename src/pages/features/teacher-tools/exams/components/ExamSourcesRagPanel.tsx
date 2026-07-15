/**
 * Exam Step 1 — catalog + topic strands + scope refinement (quiz-equivalent UI).
 * Omits the quiz “Scope preview” metrics card; ends with a worksheet-style generation scope line.
 */
import { useTranslation } from 'react-i18next'
import { AlertCircle, ChevronRight } from 'lucide-react'
import type { QuizRagScopeModel } from '../../quiz/hooks/useQuizRagScope'
import { formatSourceSummary } from '../../demo/generationFromSources'
import { TeacherToolsFieldBand, TeacherToolsScopeStepContent, CatalogSourcesBookPicker } from '../../components'

type Props = {
  rag: QuizRagScopeModel
  subject: string
  grade: string
  panelStep: 'sources' | 'scope'
}

export function ExamSourcesRagPanel({ rag, subject, grade, panelStep }: Props) {
  const { t } = useTranslation()

  const selectedBooks = rag.selectedBookIds
    .map((id) => rag.pool.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

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
        <CatalogSourcesBookPicker
          rag={rag}
          subject={subject}
          grade={grade}
          selectedBooks={selectedBooks}
        />
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

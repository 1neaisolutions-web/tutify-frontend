import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
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
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { GradeSelect } from '@/components/shared/GradeSelect'
import type { WorksheetBuildSubStepId } from '../config/worksheetWizardSteps'
import { TeacherToolsFieldBand, TeacherToolsPanelHeader, TeacherToolsScopeStepContent, CatalogSourcesBookPicker } from '../../components'

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

function generationScopeSummary(rag: QuizRagScopeModel, t: TFunction): string {
  if (rag.generateWithoutSources) return t('worksheet.rag.topicOnlyScope')
  const titles = rag.selectedBookIds
    .map((id) => rag.pool.find((b) => b.id === id)?.title)
    .filter(Boolean)
  if (titles.length === 0) return t('teacherTools.noBookSelected')
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
  const { t } = useTranslation()

  const stepMeta = useMemo(
    () =>
      ({
        basics: {
          kicker: t('worksheet.rag.basicsKicker'),
          title: t('worksheet.rag.basicsTitle'),
          subtitle: t('worksheet.rag.basicsSubtitle'),
          tone: 'indigo' as const,
        },
        sources: {
          kicker: t('worksheet.rag.sourcesKicker'),
          title: t('worksheet.rag.sourcesTitle'),
          subtitle: t('worksheet.rag.sourcesSubtitle'),
          tone: 'emerald' as const,
        },
        scope: {
          kicker: t('worksheet.rag.scopeKicker'),
          title: t('worksheet.rag.scopeTitle'),
          subtitle: t('worksheet.rag.scopeSubtitle'),
          tone: 'amber' as const,
        },
        generation: {
          kicker: t('worksheet.generation.kicker'),
          title: t('worksheet.generation.title'),
          subtitle: t('worksheet.generation.subtitle'),
          tone: 'indigo' as const,
        },
      }) satisfies Record<
        WorksheetBuildSubStepId,
        { kicker: string; title: string; subtitle: string; tone: 'indigo' | 'emerald' | 'amber' }
      >,
    [t],
  )

  const selectedBooks = rag.selectedBookIds
    .map((id) => rag.pool.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  const useMaterials = !rag.generateWithoutSources

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {activeStepId === 'basics' && (
        <>
          <TeacherToolsPanelHeader {...stepMeta.basics} />
          <div className="space-y-4 p-5">
            <TeacherToolsFieldBand variant="student">
              <label className="block text-sm font-medium text-gray-800">
                {t('teacherTools.title')} <span className="text-red-500">*</span>
                <input
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder={t('worksheet.rag.titlePlaceholder')}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('worksheet.rag.outputFormat')}
                <select
                  value={outputFormat}
                  onChange={(e) => onOutputFormatChange(e.target.value as WorksheetOutputFormat)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="interactive_digital">{t('worksheet.rag.outputInteractive')}</option>
                  <option value="printable_pdf">{t('worksheet.rag.outputPrintable')}</option>
                  <option value="both">{t('worksheet.rag.outputBoth')}</option>
                </select>
              </label>
            </TeacherToolsFieldBand>
            <TeacherToolsFieldBand variant="library">
              <div className="grid gap-4 md:grid-cols-2">
                <SubjectSelect
                  value={subject}
                  onChange={onSubjectChange}
                  label={t('teacherTools.subject')}
                  variant="native"
                  context="teacherTools"
                  selectClassName="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
                <GradeSelect
                  value={grade}
                  onChange={onGradeChange}
                  label={t('teacherTools.gradeCohort')}
                  variant="native"
                />
              </div>
              <p className="text-xs text-gray-500">{t('teacherTools.libraryMatchHint')}</p>
            </TeacherToolsFieldBand>
          </div>
        </>
      )}

      {activeStepId === 'sources' && (
        <>
          <TeacherToolsPanelHeader {...stepMeta.sources} />
          <div className="space-y-4 p-5">
            <label className="inline-flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={useMaterials}
                onChange={(e) => rag.setGenerateWithoutSources(!e.target.checked)}
                className="mt-0.5 rounded border-gray-300"
              />
              <span>
                <span className="block font-semibold text-gray-900">{t('teacherTools.groundingLabel')}</span>
                <span className="mt-0.5 block text-xs text-gray-600">{t('teacherTools.groundingHint')}</span>
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
                {t('teacherTools.generateTopicOnly')}
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
                {t('teacherTools.generateWithSources')}
              </button>
            </div>
            {!rag.generateWithoutSources ? (
              <CatalogSourcesBookPicker
                rag={rag}
                subject={subject}
                grade={grade}
                selectedBooks={selectedBooks}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                {t('worksheet.rag.topicOnlyCatalogHidden')}
              </div>
            )}
          </div>
        </>
      )}

      {activeStepId === 'scope' && (
        <>
          <TeacherToolsPanelHeader {...stepMeta.scope} />
          <div className="space-y-4 p-5">
            {!rag.generateWithoutSources && rag.selectedBookIds.length === 0 ? (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-amber-950">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                <div>
                  <p className="font-semibold">{t('worksheet.rag.selectMaterialsFirst')}</p>
                  <p className="mt-1 text-amber-900/90">{t('worksheet.rag.selectMaterialsFirstHint')}</p>
                </div>
              </div>
            ) : (
              <TeacherToolsScopeStepContent
                rag={rag}
                accent="emerald"
                refinementRows={3}
                refinementExtra={
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{t('teacherTools.generationScope')}</span>{' '}
                    <span className="text-gray-600">{generationScopeSummary(rag, t)}</span>
                  </p>
                }
              />
            )}
          </div>
        </>
      )}
    </section>
  )
}

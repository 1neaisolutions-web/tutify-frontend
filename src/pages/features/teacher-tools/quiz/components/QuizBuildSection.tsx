import type { ContentSourcesFormModel } from '../../hooks/useContentSourcesForm'
import { useTranslation } from 'react-i18next'
import { ContentSourcesPanel } from '../../components'
import { DIFFICULTY_OPTIONS, QUESTION_COUNT } from '../config/quizCreationConfig'
import type { QuestionMixMode, QuizDifficultyId } from '../../demo/generationFromSources'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { GradeSelect } from '@/components/shared/GradeSelect'

type Props = {
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
  sources: ContentSourcesFormModel
  validationErrors: string[]
}

export function QuizBuildSection({
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
  sources,
  validationErrors,
}: Props) {
  const { t } = useTranslation()
  const customTotal = countMcq + countTf + countShort

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">{t('quiz.build.detailsTitle')}</h2>
          <p className="mt-1 text-sm text-gray-600">{t('quiz.build.detailsSubtitle')}</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 block text-sm font-medium text-gray-700">
            {t('teacherTools.title')} <span className="text-red-500">*</span>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t('quiz.build.titlePlaceholder')}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm ring-primary-500/20 focus:border-primary-400 focus:outline-none focus:ring-4"
            />
          </label>
          <SubjectSelect
            value={subject}
            onChange={onSubjectChange}
            label={t('teacherTools.subject')}
            variant="native"
            context="teacherTools"
            selectClassName="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
          />
          <GradeSelect
            value={grade}
            onChange={onGradeChange}
            label={t('teacherTools.gradeCohort')}
            variant="native"
          />
          <label className="md:col-span-2 block text-sm font-medium text-gray-700">
            {t('teacherTools.studentInstructions')}
            <textarea
              rows={3}
              value={studentInstructions}
              onChange={(e) => onStudentInstructionsChange(e.target.value)}
              placeholder={t('quiz.defaultInstructions')}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
            <span className="mt-1 block text-xs text-gray-500">{t('quiz.build.instructionsHint')}</span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">{t('quiz.build.generationTitle')}</h2>
          <p className="mt-1 text-sm text-gray-600">{t('quiz.build.generationSubtitle')}</p>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('quiz.rag.questionVolume')}</p>
                <p className="mt-0.5 text-xs text-gray-600">{t('quiz.build.questionVolumeHintCheckout')}</p>
              </div>
              <div
                className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm"
                role="group"
                aria-label={t('teacherTools.questionMixMode')}
              >
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
                <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />
                  <span className="mt-1 block text-xs text-gray-500">
                    {t('quiz.build.balancedRangeHint', { min: QUESTION_COUNT.min, max: QUESTION_COUNT.max })}
                  </span>
                </label>
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 md:mt-7">
                  <p className="font-medium text-gray-800">{t('quiz.build.balancedMixTitle')}</p>
                  <p className="mt-1 leading-relaxed">{t('quiz.build.balancedMixBody')}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-gray-600">{t('quiz.build.customCountsHint')}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('teacherTools.multipleChoice')}
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countMcq}
                      onChange={(e) => onCountMcq(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('teacherTools.trueFalse')}
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countTf}
                      onChange={(e) => onCountTf(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('teacherTools.shortAnswer')}
                    <input
                      type="number"
                      min={0}
                      max={QUESTION_COUNT.max}
                      value={countShort}
                      onChange={(e) => onCountShort(Math.min(QUESTION_COUNT.max, Math.max(0, Number(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                  <span className="text-gray-700">
                    {t('teacherTools.totalInQuiz')}{' '}
                    <span className="font-semibold text-gray-900">{customTotal}</span>
                    <span className="text-gray-500"> {t('quiz.build.maxSuffix', { max: QUESTION_COUNT.max })}</span>
                  </span>
                  {customTotal < QUESTION_COUNT.min && (
                    <span className="text-xs font-medium text-amber-700">
                      {t('teacherTools.minimumQuestionsRequired', { min: QUESTION_COUNT.min })}
                    </span>
                  )}
                  {customTotal > QUESTION_COUNT.max && (
                    <span className="text-xs font-medium text-red-700">{t('teacherTools.reduceCountsLimit')}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <label className="block text-sm font-medium text-gray-700">
            {t('quiz.build.timeLimitMinutes')}
            <input
              type="number"
              min={5}
              max={180}
              value={timeLimit}
              onChange={(e) => onTimeLimitChange(Number(e.target.value) || 30)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="hidden md:block" aria-hidden />

          <fieldset className="md:col-span-2">
            <legend className="text-sm font-medium text-gray-800">{t('teacherTools.difficultyProfile')}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {DIFFICULTY_OPTIONS.map((d) => (
                <label
                  key={d.id}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition ${
                    difficulty === d.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    className="sr-only"
                    checked={difficulty === d.id}
                    onChange={() => onDifficultyChange(d.id)}
                  />
                  <span className="font-semibold text-gray-900">{t(`quiz.difficulty.${d.id}.label`)}</span>
                  <span className="mt-1 block text-xs text-gray-600">{t(`quiz.difficulty.${d.id}.hint`)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {mixMode === 'balanced' ? (
            <fieldset className="md:col-span-2">
              <legend className="text-sm font-medium text-gray-800">
                {t('quiz.build.includeInMix')} <span className="text-red-500">*</span>
              </legend>
              <p className="mt-1 text-xs text-gray-500">{t('quiz.build.includeInMixHint')}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {(
                  [
                    ['mcq', t('teacherTools.multipleChoice'), includeMcq, onToggleMcq],
                    ['tf', t('teacherTools.trueFalse'), includeTf, onToggleTf],
                    ['short', t('teacherTools.shortAnswer'), includeShort, onToggleShort],
                  ] as const
                ).map(([key, label, on, set]) => (
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
            <div className="md:col-span-2 rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3 text-sm text-gray-700">
              <span className="font-medium text-gray-900">{t('quiz.build.typesIncludedCounts')}</span> {t('quiz.build.typesIncludedHint')}
            </div>
          )}

          <label className="md:col-span-2 block text-sm font-medium text-gray-700">
            {t('quiz.build.generatorInstructions')}
            <textarea
              rows={2}
              value={teacherNotes}
              onChange={(e) => onTeacherNotesChange(e.target.value)}
              placeholder={t('quiz.build.generatorPlaceholder')}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            />
            <span className="mt-1 block text-xs text-gray-500">{t('quiz.build.generatorHint')}</span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-semibold text-gray-900">{t('quiz.rag.stepDeliveryKicker')}</h2>
          <p className="mt-1 text-sm text-gray-600">{t('quiz.build.deliverySubtitle')}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleQuestions} onChange={(e) => onShuffleQuestions(e.target.checked)} />
            {t('quiz.build.shuffleQuestionOrder')}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={shuffleAnswers} onChange={(e) => onShuffleAnswers(e.target.checked)} />
            {t('quiz.build.shuffleMcqOptions')}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={negativeMarking} onChange={(e) => onNegativeMarking(e.target.checked)} />
            {t('quiz.rag.negativeMarking')}
          </label>
        </div>
      </section>

      <section>
        <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
      </section>

      {validationErrors.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">{t('teacherTools.beforeGenerate')}</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {validationErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

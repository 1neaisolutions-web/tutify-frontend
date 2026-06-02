import { useTranslation } from 'react-i18next'
import type { ExamPaperConfig } from '../config/examPaperConfig'
import { deriveExamPaperMarks } from '../config/examPaperConfig'

export function ExamPaperStructureReviewCard({
  paper,
  onEdit,
}: {
  paper: ExamPaperConfig
  onEdit: () => void
}) {
  const { t } = useTranslation()
  const { partA, partB1, partB2, grand } = deriveExamPaperMarks(paper)
  const shortAttempt =
    paper.shortRule === 'pickNM'
      ? t('exam.structureReview.attemptPickN', { n: paper.shortN, m: paper.shortM })
      : t('exam.structureReview.attemptAll')
  const longAttempt =
    paper.longRule === 'pickNM'
      ? t('exam.structureReview.attemptPickN', { n: paper.longN, m: paper.longM })
      : t('exam.structureReview.attemptAll')
  const subLabel = t('exam.structureReview.subPartsLetters', {
    ellipsis: paper.longSubparts > 3 ? t('exam.structureReview.subPartsEllipsis') : '',
  })
  const optionsLastLetter = paper.objOptions === 5 ? 'E' : 'D'

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-4">
        <h3 className="font-semibold text-gray-900">{t('exam.paper.kicker')}</h3>
        <button type="button" onClick={onEdit} className="ml-auto text-xs font-semibold text-indigo-600 hover:text-indigo-500">
          {t('teacherTools.edit')}
        </button>
      </div>
      <div className="space-y-6 p-6 text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{t('exam.printPreview.partAObjective')}</p>
          <dl className="mt-2 space-y-1.5 text-gray-800">
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('teacherTools.questions')}</dt>
              <dd className="font-medium">{paper.objCount}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.marksPerQuestion')}</dt>
              <dd className="font-medium">{paper.objMarksPer}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.options')}</dt>
              <dd className="font-medium">
                {t('exam.structureReview.optionsRange', { count: paper.objOptions, last: optionsLastLetter })}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.negativeMarking')}</dt>
              <dd className="font-medium">
                {paper.objNegative ? t('exam.structureReview.negativeYes') : t('exam.structureReview.negativeNo')}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 font-semibold text-teal-900">
              <dt>{t('exam.structureReview.totalPartA')}</dt>
              <dd>{partA}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{t('exam.printPreview.partB1Short')}</p>
          <dl className="mt-2 space-y-1.5 text-gray-800">
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('teacherTools.questions')}</dt>
              <dd className="font-medium">{paper.shortCount}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.attempt')}</dt>
              <dd className="font-medium">{shortAttempt}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.marksPerQuestion')}</dt>
              <dd className="font-medium">{paper.shortMarksPer}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 font-semibold text-teal-900">
              <dt>{t('exam.structureReview.totalB1')}</dt>
              <dd>{partB1}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{t('exam.printPreview.partB2Long')}</p>
          <dl className="mt-2 space-y-1.5 text-gray-800">
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('teacherTools.questions')}</dt>
              <dd className="font-medium">{paper.longCount}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.subPartsEach')}</dt>
              <dd className="font-medium">
                {paper.longSubparts} {subLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.marksPerQuestion')}</dt>
              <dd className="font-medium">{paper.longMarksPer}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">{t('exam.structureReview.attempt')}</dt>
              <dd className="font-medium">{longAttempt}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 font-semibold text-teal-900">
              <dt>{t('exam.structureReview.totalB2')}</dt>
              <dd>{partB2}</dd>
            </div>
          </dl>
        </div>
        <p className="border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
          {t('exam.structureReview.grandTotal', { count: grand })}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">{t('exam.structureReview.footnote')}</p>
      </div>
    </section>
  )
}

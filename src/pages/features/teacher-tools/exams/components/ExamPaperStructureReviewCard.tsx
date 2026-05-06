import type { ExamPaperConfig } from '../config/examPaperConfig'
import { deriveExamPaperMarks } from '../config/examPaperConfig'

export function ExamPaperStructureReviewCard({
  paper,
  onEdit,
}: {
  paper: ExamPaperConfig
  onEdit: () => void
}) {
  const { partA, partB1, partB2, grand } = deriveExamPaperMarks(paper)
  const shortAttempt =
    paper.shortRule === 'pickNM' ? `Any ${paper.shortN} out of ${paper.shortM}` : 'All required'
  const longAttempt = paper.longRule === 'pickNM' ? `Any ${paper.longN} out of ${paper.longM}` : 'All required'
  const subLabel = `${paper.longSubparts} (a, b, c${paper.longSubparts > 3 ? ', …' : ''})`

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-4">
        <h3 className="font-semibold text-gray-900">Paper structure</h3>
        <button type="button" onClick={onEdit} className="ml-auto text-xs font-semibold text-indigo-600 hover:text-indigo-500">
          Edit
        </button>
      </div>
      <div className="space-y-6 p-6 text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Part A — Objective</p>
          <dl className="mt-2 space-y-1.5 text-gray-800">
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Questions</dt>
              <dd className="font-medium">{paper.objCount}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Marks per question</dt>
              <dd className="font-medium">{paper.objMarksPer}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Options</dt>
              <dd className="font-medium">{paper.objOptions} (A–{paper.objOptions === 5 ? 'E' : 'D'})</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Negative marking</dt>
              <dd className="font-medium">{paper.objNegative ? 'Yes (−0.25)' : 'No'}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 font-semibold text-teal-900">
              <dt>Total Part A marks</dt>
              <dd>{partA}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Part B1 — Short questions</p>
          <dl className="mt-2 space-y-1.5 text-gray-800">
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Questions</dt>
              <dd className="font-medium">{paper.shortCount}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Attempt</dt>
              <dd className="font-medium">{shortAttempt}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Marks per question</dt>
              <dd className="font-medium">{paper.shortMarksPer}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 font-semibold text-teal-900">
              <dt>Total B1 marks</dt>
              <dd>{partB1}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Part B2 — Long questions</p>
          <dl className="mt-2 space-y-1.5 text-gray-800">
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Questions</dt>
              <dd className="font-medium">{paper.longCount}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Sub-parts each</dt>
              <dd className="font-medium">
                {paper.longSubparts} {subLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Marks per question</dt>
              <dd className="font-medium">{paper.longMarksPer}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-50 py-1.5">
              <dt className="text-gray-500">Attempt</dt>
              <dd className="font-medium">{longAttempt}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 font-semibold text-teal-900">
              <dt>Total B2 marks</dt>
              <dd>{partB2}</dd>
            </div>
          </dl>
        </div>
        <p className="border-t border-gray-200 pt-4 text-base font-bold text-gray-900">Grand total: {grand} marks</p>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Question counts and marks follow the editable examination draft on this page. Use Edit to change rules in the builder.
        </p>
      </div>
    </section>
  )
}

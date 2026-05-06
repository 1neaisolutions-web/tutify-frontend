import type { HandoutLayoutOpts } from '../../quiz/config/handoutLayoutConfig'
import type { ExamSectionStub } from '../../demo/generationFromSources'
import type { ExamPaperConfig } from '../config/examPaperConfig'
import { deriveExamPaperMarks } from '../config/examPaperConfig'
import type { ExamLongStub, ExamMcqStub, ExamShortStub } from '../demo/examQuestionStubs'
import { longPoolSize, shortPoolSize } from '../demo/examQuestionStubs'
import { getDemoLongBlock, getDemoMcq, getDemoShortStem } from '../demo/examReviewDemoContent'
import { stripLeadingMcqOptionLabel } from '../utils/mcqOptionDisplay'

type Props = {
  title: string
  subject: string
  grade: string
  examType: string
  durationMinutes: number
  scheduleStartIso: string
  paper: ExamPaperConfig
  sections: ExamSectionStub[]
  draftLayout: HandoutLayoutOpts
  fmtWindow: (iso: string) => string
  /** When provided and lengths match the paper, print uses these stems (review edits). */
  reviewMcqs?: ExamMcqStub[]
  reviewShorts?: ExamShortStub[]
  reviewLongs?: ExamLongStub[]
}

/** Screen “page” shell; print: objective and subjective each start a new sheet. */
const pageShell =
  'mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:shadow-none print:rounded-none print:border-gray-300 print:p-8'

export function ExamPrintPreviewContent({
  title,
  subject,
  grade,
  examType,
  durationMinutes,
  scheduleStartIso,
  paper,
  sections,
  draftLayout,
  fmtWindow,
  reviewMcqs,
  reviewShorts,
  reviewLongs,
}: Props) {
  const { partA, partB1, partB2, grand } = deriveExamPaperMarks(paper)
  const shortM = shortPoolSize(paper)
  const longM = longPoolSize(paper)
  const shortStart = paper.objCount + 1
  const longStart = shortStart + shortM

  const useMcqs = reviewMcqs && reviewMcqs.length === paper.objCount
  const useShorts = reviewShorts && reviewShorts.length === shortM
  const useLongs = reviewLongs && reviewLongs.length === longM

  const negLine = paper.objNegative ? ' Negative marking: −0.25 per wrong answer.' : ''

  const objGap = draftLayout.questionGapPx
  const subjGap = Math.min(objGap, 16)

  return (
    <div className="space-y-6 text-sm text-gray-800" style={{ lineHeight: draftLayout.bodyLineHeight }}>
      {/* Print page 1 — Objective (MCQ only) */}
      <div className={`${pageShell} print:break-after-page`}>
        <header className="border-b border-gray-200 pb-4 print:border-gray-300">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Examination paper</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-gray-900">{title || 'Untitled exam'}</h3>
          <p className="mt-1.5 text-xs text-gray-600">
            {subject} · {grade} · {examType} · {durationMinutes} min · {fmtWindow(scheduleStartIso)}
          </p>
        </header>

        <div className="mt-5">
          <h4 className="text-sm font-bold text-gray-900">Part A — Objective</h4>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Multiple choice. Each question carries {paper.objMarksPer} mark{paper.objMarksPer === 1 ? '' : 's'}.
            {negLine}
          </p>
        </div>

        <ol className="mt-5 list-none space-y-0 p-0">
          {(useMcqs ? reviewMcqs : null)?.map((q, i) => {
            const n = i + 1
            const letters = paper.objOptions === 5 ? (['A', 'B', 'C', 'D', 'E'] as const) : (['A', 'B', 'C', 'D'] as const)
            return (
              <li
                key={q.id}
                className="break-inside-avoid border-b border-gray-100 py-3 last:border-b-0 print:border-gray-200"
                style={{ paddingBottom: Math.max(8, objGap * 0.35) }}
              >
                <p className="font-semibold text-gray-900">
                  <span className="tabular-nums">{n}.</span> {q.stem}
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-800 print:grid-cols-2">
                  {letters.map((L, idx) => (
                    <p key={L} className="leading-snug">
                      <span className="font-medium tabular-nums">{L})</span>{' '}
                      {stripLeadingMcqOptionLabel(q.options[idx] ?? '—')}
                    </p>
                  ))}
                </div>
              </li>
            )
          }) ??
            Array.from({ length: paper.objCount }, (_, i) => {
              const n = i + 1
              const mcq = getDemoMcq(subject, n, paper.objOptions)
              const letters = paper.objOptions === 5 ? (['A', 'B', 'C', 'D', 'E'] as const) : (['A', 'B', 'C', 'D'] as const)
              return (
                <li
                  key={n}
                  className="break-inside-avoid border-b border-gray-100 py-3 last:border-b-0 print:border-gray-200"
                  style={{ paddingBottom: Math.max(8, objGap * 0.35) }}
                >
                  <p className="font-semibold text-gray-900">
                    <span className="tabular-nums">{n}.</span> {mcq.stem}
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-800 print:grid-cols-2">
                    {letters.map((L, idx) => (
                      <p key={L} className="leading-snug">
                        <span className="font-medium tabular-nums">{L})</span>{' '}
                        {stripLeadingMcqOptionLabel(mcq.options[idx] ?? `—`)}
                      </p>
                    ))}
                  </div>
                </li>
              )
            })}
        </ol>

        <p className="mt-6 border-t border-gray-200 pt-3 text-xs font-semibold text-gray-700 print:border-gray-300">
          Part A — maximum marks: {partA}
        </p>
      </div>

      {/* Print page 2 — Subjective (short + long, no ruled answer space) */}
      <div className={`${pageShell} print:break-before-page`}>
        <header className="border-b border-gray-200 pb-4 print:border-gray-300 print:pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Examination paper (continued)</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">{title || 'Untitled exam'}</h3>
          <p className="mt-1 text-xs text-gray-600">Part B — Subjective</p>
        </header>

        <section className="mt-5">
          <h4 className="text-sm font-bold text-gray-900">Part B1 — Short questions</h4>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {paper.shortRule === 'pickNM'
              ? `Attempt any ${paper.shortN} out of ${paper.shortM} questions. Each question carries ${paper.shortMarksPer} marks.`
              : `Answer all questions. Each question carries ${paper.shortMarksPer} marks.`}
          </p>
          <ul className="mt-4 list-none space-y-0 p-0">
            {(useShorts ? reviewShorts : null)?.map((q, i) => {
              const n = shortStart + i
              return (
                <li
                  key={q.id}
                  className="break-inside-avoid border-b border-gray-100 py-2.5 text-gray-900 last:border-b-0 print:border-gray-200"
                  style={{ marginBottom: subjGap * 0.25 }}
                >
                  <p className="font-semibold leading-snug">
                    <span className="tabular-nums">{n}.</span> {q.stem}{' '}
                    <span className="font-normal text-gray-500">({paper.shortMarksPer} marks)</span>
                  </p>
                </li>
              )
            }) ??
              Array.from({ length: shortM }, (_, i) => {
                const n = shortStart + i
                return (
                  <li
                    key={n}
                    className="break-inside-avoid border-b border-gray-100 py-2.5 text-gray-900 last:border-b-0 print:border-gray-200"
                    style={{ marginBottom: subjGap * 0.25 }}
                  >
                    <p className="font-semibold leading-snug">
                      <span className="tabular-nums">{n}.</span> {getDemoShortStem(subject, i)}{' '}
                      <span className="font-normal text-gray-500">({paper.shortMarksPer} marks)</span>
                    </p>
                  </li>
                )
              })}
          </ul>
          <p className="mt-3 text-xs font-medium text-gray-600">Part B1 — maximum marks: {partB1}</p>
        </section>

        <section className="mt-8 border-t border-gray-100 pt-6 print:border-gray-200 print:pt-5">
          <h4 className="text-sm font-bold text-gray-900">Part B2 — Long questions</h4>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {paper.longRule === 'pickNM'
              ? `Attempt any ${paper.longN} out of ${paper.longM} questions. Each question carries ${paper.longMarksPer} marks.`
              : `Answer all questions. Each question carries ${paper.longMarksPer} marks.`}
          </p>
          <div className="mt-4 space-y-6">
            {(useLongs ? reviewLongs : null)?.map((q, qi) => {
              const n = longStart + qi
              const subparts = q.subparts.slice(0, Math.max(1, paper.longSubparts))
              return (
                <div key={q.id} className="break-inside-avoid space-y-2 border-b border-gray-100 pb-5 last:border-b-0 print:border-gray-200">
                  <p className="font-semibold leading-snug text-gray-900">
                    <span className="tabular-nums">{n}.</span> {q.stem}{' '}
                    <span className="font-normal text-gray-500">({paper.longMarksPer} marks)</span>
                  </p>
                  <div className="ml-0 space-y-2 border-l-2 border-gray-200 pl-3 print:border-gray-300">
                    {subparts.map((text, si) => {
                      const sub = `(${String.fromCharCode(97 + si)})`
                      return (
                        <p key={sub} className="text-sm leading-relaxed text-gray-800">
                          <span className="font-medium text-gray-900">{sub}</span> {text}
                        </p>
                      )
                    })}
                  </div>
                </div>
              )
            }) ??
              Array.from({ length: longM }, (_, qi) => {
                const n = longStart + qi
                const block = getDemoLongBlock(subject, qi)
                const subparts = block.subparts.slice(0, Math.max(1, paper.longSubparts))
                return (
                  <div key={n} className="break-inside-avoid space-y-2 border-b border-gray-100 pb-5 last:border-b-0 print:border-gray-200">
                    <p className="font-semibold leading-snug text-gray-900">
                      <span className="tabular-nums">{n}.</span> {block.stem}{' '}
                      <span className="font-normal text-gray-500">({paper.longMarksPer} marks)</span>
                    </p>
                    <div className="ml-0 space-y-2 border-l-2 border-gray-200 pl-3 print:border-gray-300">
                      {subparts.map((text, si) => {
                        const sub = `(${String.fromCharCode(97 + si)})`
                        return (
                          <p key={sub} className="text-sm leading-relaxed text-gray-800">
                            <span className="font-medium text-gray-900">{sub}</span> {text}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
          <p className="mt-3 text-xs font-medium text-gray-600">Part B2 — maximum marks: {partB2}</p>
        </section>

        <p className="mt-8 border-t border-gray-200 pt-3 text-sm font-semibold text-gray-900 print:border-gray-300">
          Parts B1 + B2 — combined maximum: {partB1 + partB2} &nbsp;·&nbsp; Paper total: {grand} marks
        </p>
      </div>

      {/* On-screen teacher reference only — hidden when printing */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 print:hidden">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Mark allocation (teacher)</p>
        <div className="mt-4 space-y-2 font-mono text-sm">
          <p>Part A (objective): {partA}</p>
          <p>Part B1 (short): {partB1}</p>
          <p>Part B2 (long): {partB2}</p>
          <p className="border-t border-gray-300 pt-2 font-bold text-gray-900">Grand total: {grand}</p>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Topic structure reference: {sections.map((s) => s.title).join(' · ') || '—'}
        </p>
      </div>
    </div>
  )
}

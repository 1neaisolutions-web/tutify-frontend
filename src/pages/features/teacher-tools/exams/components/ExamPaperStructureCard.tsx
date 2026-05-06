import { ExamNumberedSectionHeader, ExamSectionShell } from './ExamNumberedSectionHeader'
import type { ExamPaperConfig, ExamPaperChoiceRule } from '../config/examPaperConfig'
import { deriveExamPaperMarks, validateExamPaperFields } from '../config/examPaperConfig'

type Props = {
  paper: ExamPaperConfig
  onChange: (patch: Partial<ExamPaperConfig>) => void
}

export function ExamPaperStructureCard({ paper, onChange }: Props) {
  const { partA, partB1, partB2, grand } = deriveExamPaperMarks(paper)
  const fe = validateExamPaperFields(paper)

  const setRule = (which: 'short' | 'long', rule: ExamPaperChoiceRule) => {
    if (which === 'short') onChange({ shortRule: rule })
    else onChange({ longRule: rule })
  }

  return (
    <ExamSectionShell
      variant="purple"
      header={
        <ExamNumberedSectionHeader
          step={2}
          kicker="Paper structure"
          title="Objective & subjective sections"
          subtitle="Define the structure of the exam paper. Each section has its own question type, mark allocation, and optional choice rules."
          variant="purple"
        />
      }
    >
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Part A — Objective (Multiple Choice)</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-800">
              Number of objective questions
              <input
                type="number"
                min={0}
                max={100}
                value={paper.objCount}
                onChange={(e) => onChange({ objCount: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
              {fe.objCount ? <p className="mt-1 text-xs text-red-600">{fe.objCount}</p> : null}
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Marks per objective question
              <input
                type="number"
                min={0}
                value={paper.objMarksPer}
                onChange={(e) => onChange({ objMarksPer: Math.max(0, Number(e.target.value) || 0) })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Options per question
              <select
                value={paper.objOptions}
                onChange={(e) => onChange({ objOptions: Number(e.target.value) === 5 ? 5 : 4 })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                <option value={4}>4 options (A–D)</option>
                <option value={5}>5 options (A–E)</option>
              </select>
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 md:col-span-2">
              <span className="text-sm text-gray-700">Apply negative marking (−0.25 per wrong answer)</span>
              <input
                type="checkbox"
                checked={paper.objNegative}
                onChange={(e) => onChange({ objNegative: e.target.checked })}
                className="rounded border-gray-300"
              />
            </label>
          </div>
          <p className="mt-3 text-sm font-semibold text-teal-800">
            Total Part A marks: <span className="tabular-nums">{partA}</span>
          </p>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-sm font-semibold text-gray-900">Part B — Subjective</h3>

          <div className="mt-6 space-y-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-600">B1 — Short questions</p>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                Number of short questions
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={paper.shortCount}
                  onChange={(e) => onChange({ shortCount: Math.min(20, Math.max(0, Number(e.target.value) || 0)) })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
                {fe.shortCount ? <p className="mt-1 text-xs text-red-600">{fe.shortCount}</p> : null}
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Marks per short question
                <input
                  type="number"
                  min={0}
                  value={paper.shortMarksPer}
                  onChange={(e) => onChange({ shortMarksPer: Math.max(0, Number(e.target.value) || 0) })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
              </label>
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                Choice rule
                <select
                  value={paper.shortRule}
                  onChange={(e) => setRule('short', e.target.value === 'pickNM' ? 'pickNM' : 'all')}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="all">No choice (all required)</option>
                  <option value="pickNM">Attempt any N out of M</option>
                </select>
              </label>
              {paper.shortRule === 'pickNM' ? (
                <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-sm text-gray-800">
                  <span>Attempt any</span>
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm"
                    value={paper.shortN}
                    onChange={(e) => onChange({ shortN: Math.max(1, Number(e.target.value) || 1) })}
                  />
                  <span>out of</span>
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm"
                    value={paper.shortM}
                    onChange={(e) => onChange({ shortM: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </div>
              ) : null}
            </div>
            {fe.shortPick ? <p className="mt-2 text-xs text-red-600">{fe.shortPick}</p> : null}
            <p className="text-sm font-semibold text-teal-800">
              Total B1 marks: <span className="tabular-nums">{partB1}</span>
            </p>
          </div>

          <div className="mt-6 space-y-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-600">B2 — Long questions</p>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                Number of long questions
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={paper.longCount}
                  onChange={(e) => onChange({ longCount: Math.min(10, Math.max(0, Number(e.target.value) || 0)) })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
                {fe.longCount ? <p className="mt-1 text-xs text-red-600">{fe.longCount}</p> : null}
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Marks per long question
                <input
                  type="number"
                  min={0}
                  value={paper.longMarksPer}
                  onChange={(e) => onChange({ longMarksPer: Math.max(0, Number(e.target.value) || 0) })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Sub-parts per long question
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={paper.longSubparts}
                  onChange={(e) => onChange({ longSubparts: Math.min(6, Math.max(1, Number(e.target.value) || 1)) })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
                {fe.longSubparts ? <p className="mt-1 text-xs text-red-600">{fe.longSubparts}</p> : null}
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Choice rule
                <select
                  value={paper.longRule}
                  onChange={(e) => setRule('long', e.target.value === 'pickNM' ? 'pickNM' : 'all')}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="all">No choice (all required)</option>
                  <option value="pickNM">Attempt any N out of M</option>
                </select>
              </label>
              {paper.longRule === 'pickNM' ? (
                <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-sm text-gray-800">
                  <span>Attempt any</span>
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm"
                    value={paper.longN}
                    onChange={(e) => onChange({ longN: Math.max(1, Number(e.target.value) || 1) })}
                  />
                  <span>out of</span>
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm"
                    value={paper.longM}
                    onChange={(e) => onChange({ longM: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </div>
              ) : null}
            </div>
            {fe.longPick ? <p className="mt-2 text-xs text-red-600">{fe.longPick}</p> : null}
            <p className="text-sm font-semibold text-teal-800">
              Total B2 marks: <span className="tabular-nums">{partB2}</span>
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-gray-500">
          Objective questions are numbered Q1, Q2, Q3… Subjective short questions continue from where objective ends
          (e.g. Q21, Q22…). Long questions are numbered with sub-parts: Q27(a), Q27(b), Q27(c).
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="grid gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Part A (Objective)</p>
              <p className="mt-1 font-semibold text-gray-900">{partA} marks</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Part B1 (Short)</p>
              <p className="mt-1 font-semibold text-gray-900">{partB1} marks</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Part B2 (Long)</p>
              <p className="mt-1 font-semibold text-gray-900">{partB2} marks</p>
            </div>
            <div className="border-t border-gray-200 pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Grand Total</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{grand} marks</p>
            </div>
          </div>
        </div>
      </div>
    </ExamSectionShell>
  )
}

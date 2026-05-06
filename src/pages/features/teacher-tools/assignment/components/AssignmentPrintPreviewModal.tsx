import { useCallback, useEffect, useState } from 'react'
import { Printer, X } from 'lucide-react'
import type { AssignmentBriefTopicStub } from '../../demo/generationFromSources'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  RULED_LINE_SPACING_PRESETS,
  type HandoutLayoutOpts,
} from '../../quiz/config/handoutLayoutConfig'
import { formatAssignmentDueDate } from '../../utils/generateAssignmentPdf'

export type AssignmentPrintMeta = {
  title: string
  subject: string
  grade: string
  dueAt: string
  assignmentType: string
  studentInstructions: string
  topic?: string
  sourceSummaryLine?: string
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildAssignmentPrintHtml(
  meta: AssignmentPrintMeta,
  topics: AssignmentBriefTopicStub[],
  layout: HandoutLayoutOpts = DEFAULT_HANDOUT_LAYOUT,
): string {
  const due = formatAssignmentDueDate(meta.dueAt)
  const subLine = [meta.subject, meta.grade, `Due ${due}`, meta.assignmentType].map(esc).join(' · ')
  const topicLine = meta.topic?.trim() ? `<p><strong>Focus:</strong> ${esc(meta.topic)}</p>` : ''
  const srcLine = meta.sourceSummaryLine?.trim()
    ? `<p><strong>Materials:</strong> ${esc(meta.sourceSummaryLine)}</p>`
    : ''

  const topicsHtml = topics
    .map((t) => {
      const linesHtml = t.lines
        .map(
          (ln, i) =>
            `<li class="brief-line" style="margin-bottom:${layout.ruledLineSpacingPx * 0.35}px"><span class="num">${i + 1}.</span> <span class="txt">${esc(ln.text)}</span></li>`,
        )
        .join('')
      return `<section class="topic-block" style="margin-bottom:${layout.questionGapPx}px"><h2 class="topic-title">${esc(t.title)}</h2><ol class="brief-list">${linesHtml}</ol></section>`
    })
    .join('')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${esc(meta.title)}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #111; margin: 14mm; line-height: ${layout.bodyLineHeight}; }
  h1 { font-size: 17pt; margin: 0 0 8px; font-weight: 700; font-family: ui-sans-serif, system-ui, sans-serif; color: #0f172a; letter-spacing: -0.02em; }
  .sub { font-size: 9.5pt; color: #475569; margin-bottom: 12px; font-family: ui-sans-serif, system-ui, sans-serif; }
  .sub p { margin: 4px 0 0; }
  .instr { font-size: 9.5pt; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; margin: 14px 0 16px; background: #f8fafc; white-space: pre-wrap; font-family: ui-sans-serif, system-ui, sans-serif; }
  .meta-row { font-size: 8.5pt; color: #64748b; margin-bottom: 18px; font-family: ui-sans-serif, system-ui, sans-serif; }
  .topic-block { page-break-inside: avoid; }
  .topic-title { font-size: 11pt; font-weight: 700; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid #cbd5e1; color: #0f172a; font-family: ui-sans-serif, system-ui, sans-serif; }
  .brief-list { margin: 0; padding-left: 0; list-style: none; }
  .brief-line { margin-bottom: ${layout.ruledLineSpacingPx * 0.35}px; padding-left: 0; }
  .num { font-weight: 700; color: #0f766e; font-family: ui-sans-serif, system-ui, sans-serif; margin-right: 6px; }
  .txt { white-space: pre-wrap; }
  @media print { body { margin: 12mm; } }
</style></head><body>
  <h1>${esc(meta.title)}</h1>
  <div class="sub"><p>${subLine}</p>${topicLine}${srcLine}</div>
  <div class="instr"><strong>Instructions for students</strong><br/>${esc(meta.studentInstructions || '—')}</div>
  <p class="meta-row">Name: ________________________________ &nbsp;&nbsp; Date: ________________</p>
  ${topicsHtml || '<p class="sub">No brief sections to display.</p>'}
</body></html>`
}

type Props = {
  open: boolean
  onClose: () => void
  meta: AssignmentPrintMeta
  topics: AssignmentBriefTopicStub[]
  savedLayout: HandoutLayoutOpts
  onSaveLayout: (layout: HandoutLayoutOpts) => void
}

export function AssignmentPrintPreviewModal({ open, onClose, meta, topics, savedLayout, onSaveLayout }: Props) {
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(savedLayout)

  useEffect(() => {
    if (open) setDraftLayout({ ...DEFAULT_HANDOUT_LAYOUT, ...savedLayout })
  }, [open, savedLayout])

  const handlePrint = useCallback(() => {
    const html = buildAssignmentPrintHtml(meta, topics, draftLayout)
    const iframe = document.createElement('iframe')
    iframe.setAttribute('style', 'position:fixed;right:0;bottom:0;width:0;height:0;border:0')
    document.body.appendChild(iframe)
    const doc = iframe.contentDocument
    const win = iframe.contentWindow
    if (!doc || !win) {
      document.body.removeChild(iframe)
      return
    }
    doc.open()
    doc.write(html)
    doc.close()
    win.focus()
    win.print()
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 500)
  }, [meta, topics, draftLayout])

  const handleSaveAndClose = () => {
    onSaveLayout(draftLayout)
    onClose()
  }

  if (!open) return null

  const dueLabel = formatAssignmentDueDate(meta.dueAt)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close preview" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Print preview</p>
            <h2 className="text-lg font-semibold text-gray-900">Assignment — student handout</h2>
            <p className="mt-0.5 max-w-xl text-xs text-gray-600">
              Preview matches PDF export: assignment brief only (no quiz-style sections). Adjust spacing below, then save
              so Export PDF uses the same layout.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" />
              Print (current preview)
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Save layout and close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Document layout</span>
          <label className="flex items-center gap-1.5 text-xs text-gray-800">
            <span className="text-gray-600">Line height</span>
            <select
              value={draftLayout.bodyLineHeight}
              onChange={(e) =>
                setDraftLayout((l) => ({
                  ...l,
                  bodyLineHeight: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.bodyLineHeight,
                }))
              }
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
            >
              {LINE_HEIGHT_PRESETS.map((lh) => (
                <option key={lh} value={lh}>
                  {lh}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-800">
            <span className="text-gray-600">Space after each topic</span>
            <select
              value={draftLayout.questionGapPx}
              onChange={(e) =>
                setDraftLayout((l) => ({
                  ...l,
                  questionGapPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.questionGapPx,
                }))
              }
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
            >
              {QUESTION_GAP_PRESETS.map((px) => (
                <option key={px} value={px}>
                  {px}px
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-800">
            <span className="text-gray-600">Space between brief lines</span>
            <select
              value={draftLayout.ruledLineSpacingPx}
              onChange={(e) =>
                setDraftLayout((l) => ({
                  ...l,
                  ruledLineSpacingPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.ruledLineSpacingPx,
                }))
              }
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
            >
              {RULED_LINE_SPACING_PRESETS.map((px) => (
                <option key={px} value={px}>
                  {px}px
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div
            className="mx-auto max-w-[210mm] bg-white px-10 py-12 shadow-lg ring-1 ring-gray-200/80"
            style={{ lineHeight: draftLayout.bodyLineHeight }}
          >
            <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">{meta.title}</h1>
            <div className="mt-3 font-sans text-xs leading-relaxed text-slate-600">
              <p>
                {meta.subject} · {meta.grade} · Due {dueLabel} · {meta.assignmentType}
              </p>
              {meta.topic ? <p className="mt-1.5">Focus: {meta.topic}</p> : null}
              {meta.sourceSummaryLine ? <p className="mt-1.5">Materials: {meta.sourceSummaryLine}</p> : null}
            </div>
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-sans text-xs leading-relaxed text-slate-800">
              <span className="font-semibold text-slate-900">Instructions for students</span>
              <span className="mt-1 block whitespace-pre-wrap">{meta.studentInstructions || '—'}</span>
            </div>
            <p className="mt-6 font-sans text-[11px] text-slate-500">
              Name: <span className="inline-block min-w-[12rem] border-b border-slate-300" /> &nbsp;&nbsp; Date:{' '}
              <span className="inline-block w-24 border-b border-slate-300" />
            </p>

            {topics.map((topic) => (
              <section key={topic.id} className="mt-8" style={{ marginBottom: draftLayout.questionGapPx }}>
                <h2 className="border-b border-slate-200 pb-2 font-sans text-sm font-semibold text-slate-900">
                  {topic.title}
                </h2>
                <ol className="mt-4 list-none space-y-0 p-0">
                  {topic.lines.map((line, i) => (
                    <li
                      key={line.id}
                      className="flex gap-2 text-sm leading-relaxed text-slate-800"
                      style={{ marginBottom: draftLayout.ruledLineSpacingPx * 0.35 }}
                    >
                      <span className="shrink-0 font-sans text-sm font-bold text-teal-700">{i + 1}.</span>
                      <span className="min-w-0 whitespace-pre-wrap">{line.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Printer, X } from 'lucide-react'
import { clampResponseLines, type QuizQuestionStub } from '../../demo/generationFromSources'
import { groupQuizStubsByType } from '../../utils/generateQuizPdf'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  RULED_LINE_SPACING_PRESETS,
  type HandoutLayoutOpts,
} from '../config/handoutLayoutConfig'
import { ShortAnswerHandoutLines } from './ShortAnswerHandoutLines'

export type QuizPrintMeta = {
  title: string
  subject: string
  grade: string
  timeLimitMinutes: number
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

function buildHandoutPrintDocument(
  meta: QuizPrintMeta,
  stubs: QuizQuestionStub[],
  layout: HandoutLayoutOpts = DEFAULT_HANDOUT_LAYOUT
): string {
  const groups = groupQuizStubsByType(stubs)
  let qn = 1
  const sectionsHtml = groups
    .map((g) => {
      const itemsHtml = g.items
        .map((item) => {
          const num = qn
          qn += 1
          let body = ''
          if (item.type === 'mcq') {
            const opts =
              item.options && item.options.length > 0
                ? `<ol class="opts">${item.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>`
                : ''
            body = `${opts}<p class="hint">Select one answer. Mark clearly in the circles: ○ A &nbsp; ○ B &nbsp; ○ C &nbsp; ○ D</p>`
          } else if (item.type === 'tf') {
            body = '<p class="tf">○ True &nbsp;&nbsp;&nbsp; ○ False</p>'
          } else {
            const nl = clampResponseLines(item.responseLines)
            body = `<div class="lines">${Array.from({ length: nl }, () => '<div class="l"></div>').join('')}</div>`
          }
          return `<div class="q"><p class="stem"><span class="qn">Q${num}.</span> ${esc(item.prompt)}${
            item.points != null ? ` <span class="pts">(${item.points} marks)</span>` : ''
          }</p>${body}</div>`
        })
        .join('')
      return `<section class="sec"><h2>${esc(g.label)}</h2>${itemsHtml}</section>`
    })
    .join('')

  const topicLine = meta.topic ? `<p><strong>Topic:</strong> ${esc(meta.topic)}</p>` : ''
  const srcLine = meta.sourceSummaryLine
    ? `<p><strong>Materials:</strong> ${esc(meta.sourceSummaryLine)}</p>`
    : ''

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${esc(meta.title)}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #111; margin: 14mm; line-height: ${layout.bodyLineHeight}; }
  h1 { font-size: 15pt; margin: 0 0 6px; font-family: system-ui, sans-serif; }
  .banner { font-size: 9pt; color: #333; margin-bottom: 14px; font-family: system-ui, sans-serif; }
  .instr { font-size: 9pt; border: 1px solid #ccc; padding: 8px 10px; margin: 12px 0 18px; background: #fafafa; white-space: pre-wrap; }
  .sec { margin-top: 16px; page-break-inside: avoid; }
  .sec h2 { font-size: 10.5pt; border-bottom: 1px solid #999; padding-bottom: 4px; margin: 0 0 10px; font-family: system-ui, sans-serif; }
  .q { margin-bottom: ${layout.questionGapPx}px; page-break-inside: avoid; }
  .stem { white-space: pre-wrap; }
  .qn { font-weight: 700; }
  .pts { font-weight: 400; color: #444; font-size: 9.5pt; }
  .opts { margin: 6px 0 0 0; padding-left: 20px; }
  .opts li { margin-bottom: 3px; white-space: pre-wrap; }
  .hint { font-size: 8.5pt; color: #555; margin: 8px 0 0; }
  .tf { margin-top: 8px; font-size: 10pt; }
  .lines { margin-top: 8px; }
  .lines .l { box-sizing: border-box; border-bottom: 1px solid #555; min-height: ${layout.ruledLineSpacingPx}px; margin-top: 10px; padding-bottom: 2px; }
  .lines .l:first-child { margin-top: 4px; }
  @media print { body { margin: 12mm; } }
</style></head><body>
  <h1>${esc(meta.title)}</h1>
  <div class="banner">
    <p>${esc(meta.subject)} · ${esc(meta.grade)} · Time: ${meta.timeLimitMinutes} minutes</p>
    ${topicLine}
    ${srcLine}
  </div>
  <div class="instr"><strong>Instructions for students:</strong> ${esc(meta.studentInstructions || '—')}</div>
  ${sectionsHtml}
</body></html>`
}

type Props = {
  open: boolean
  onClose: () => void
  meta: QuizPrintMeta
  stubs: QuizQuestionStub[]
  /** Last saved layout (applied to PDF / print after Save). */
  savedLayout: HandoutLayoutOpts
  /** Persist layout and should close the modal (parent sets state then closes). */
  onSaveLayout: (layout: HandoutLayoutOpts) => void
}

export function QuizPrintPreviewModal({ open, onClose, meta, stubs, savedLayout, onSaveLayout }: Props) {
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(savedLayout)

  useEffect(() => {
    if (open) setDraftLayout({ ...DEFAULT_HANDOUT_LAYOUT, ...savedLayout })
  }, [open, savedLayout])

  const handlePrint = useCallback(() => {
    const html = buildHandoutPrintDocument(meta, stubs, draftLayout)
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
  }, [meta, stubs, draftLayout])

  const handleSaveAndClose = () => {
    onSaveLayout(draftLayout)
    onClose()
  }

  if (!open) return null

  const groups = groupQuizStubsByType(stubs)
  let n = 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close preview" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Print preview</p>
            <h2 className="text-lg font-semibold text-gray-900">Student handout layout</h2>
            <p className="mt-0.5 text-xs text-gray-600">
              Preview only — tune line height and spacing below, then use Save layout and close so PDF export and the next
              print use your settings. Close without saving keeps the previous layout.
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

        <div className="flex flex-wrap items-center gap-3 border-b border-indigo-100 bg-indigo-50/50 px-5 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">Handout spacing</span>
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
            <span className="text-gray-600">Space after each question</span>
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
            <span className="text-gray-600">Short answer line height</span>
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
            <h1 className="font-sans text-xl font-bold text-gray-900">{meta.title}</h1>
            <div className="mt-2 font-sans text-xs text-gray-600">
              <p>
                {meta.subject} · {meta.grade} · Time: {meta.timeLimitMinutes} minutes
              </p>
              {meta.topic ? <p className="mt-1">Topic: {meta.topic}</p> : null}
              {meta.sourceSummaryLine ? <p className="mt-1">Materials: {meta.sourceSummaryLine}</p> : null}
            </div>
            <div className="mt-5 whitespace-pre-wrap border border-gray-200 bg-gray-50/80 px-4 py-3 text-xs text-gray-800">
              <span className="font-semibold">Instructions for students:</span> {meta.studentInstructions || '—'}
            </div>

            {groups.map((g) => (
              <section key={g.type} className="mt-8">
                <h2 className="border-b border-gray-300 pb-2 font-sans text-sm font-semibold text-gray-900">{g.label}</h2>
                <ul className="mt-4">
                  {g.items.map((item) => {
                    const num = n
                    n += 1
                    return (
                      <li
                        key={item.id}
                        className="text-sm text-gray-900"
                        style={{ marginBottom: draftLayout.questionGapPx }}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          <span className="font-semibold">Q{num}.</span> {item.prompt}
                          {item.points != null ? (
                            <span className="text-xs font-normal text-gray-500"> ({item.points} marks)</span>
                          ) : null}
                        </p>
                        {item.type === 'mcq' && item.options && item.options.length > 0 ? (
                          <ol className="mt-2 list-[lower-alpha] space-y-1 pl-5 text-gray-800">
                            {item.options.map((o, i) => (
                              <li key={i} className="whitespace-pre-wrap">
                                {o}
                              </li>
                            ))}
                          </ol>
                        ) : null}
                        {item.type === 'mcq' ? (
                          <p className="mt-2 text-xs text-gray-500">
                            Select one answer. Mark clearly: ○ A &nbsp; ○ B &nbsp; ○ C &nbsp; ○ D
                          </p>
                        ) : null}
                        {item.type === 'tf' ? (
                          <p className="mt-3 text-sm text-gray-800">
                            ○ True &nbsp;&nbsp;&nbsp; ○ False
                          </p>
                        ) : null}
                        {item.type === 'short' ? (
                          <ShortAnswerHandoutLines
                            responseLines={item.responseLines}
                            ruledLineSpacingPx={draftLayout.ruledLineSpacingPx}
                            lineStyle="print"
                          />
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

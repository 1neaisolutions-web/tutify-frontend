import { jsPDF } from 'jspdf'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import { clampResponseLines, type QuizQuestionStub } from '../demo/generationFromSources'
import {
  DEFAULT_HANDOUT_LAYOUT,
  questionGapPxToMm,
  ruledLineSpacingPxToMm,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'

const PAGE_H_MM = 297
const MARGIN = 14
const BOTTOM_SAFE = 18
const EXAM_HEADER_H = 20

function pageWidth(doc: jsPDF) {
  return doc.internal.pageSize.getWidth()
}

function addPageNumbers(doc: jsPDF) {
  const total = doc.getNumberOfPages()
  const w = pageWidth(doc)
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Page ${i} of ${total}`, w / 2, PAGE_H_MM - 10, { align: 'center' })
    doc.setTextColor(0, 0, 0)
  }
}

/** Prevent duplicate "Qn." prefixes when prompt already contains numbering. */
function stripLeadingQuestionNumber(prompt: string): string {
  let out = prompt.trim()
  // Some generated prompts may accidentally include repeated prefixes like "Q8. Q3. ..."
  for (let i = 0; i < 3; i += 1) {
    const next = out.replace(/^Q\d+\.\s*/i, '')
    if (next === out) break
    out = next.trim()
  }
  return out
}

function drawPageHeader(doc: jsPDF, quiz: DemoQuiz) {
  const w = pageWidth(doc) - MARGIN * 2
  const top = MARGIN - 4
  doc.setDrawColor(210)
  doc.setFillColor(250, 250, 252)
  doc.roundedRect(MARGIN, top, w, EXAM_HEADER_H, 2, 2, 'FD')
  doc.setDrawColor(0)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(quiz.title.slice(0, 90), MARGIN + 3, top + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(85, 85, 85)
  doc.text(`${quiz.subject} · ${quiz.grade} · ${quiz.timeLimitMinutes} min`, MARGIN + 3, top + 11)
  doc.text('Candidate name: ______________________', MARGIN + 3, top + 16)
  doc.text('Class: __________________', MARGIN + 82, top + 16)
  doc.setTextColor(0, 0, 0)
}

function ensureY(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H_MM - BOTTOM_SAFE) {
    doc.addPage()
    return MARGIN + EXAM_HEADER_H + 4
  }
  return y
}

function writeParagraph(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineStepMm: number): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  let yy = y
  doc.setFontSize(10)
  for (const line of lines) {
    yy = ensureY(doc, yy, lineStepMm + 1)
    doc.text(line, x, yy)
    yy += lineStepMm
  }
  return yy + 2
}

function resolveHandoutLayout(quiz: DemoQuiz): HandoutLayoutOpts {
  return { ...DEFAULT_HANDOUT_LAYOUT, ...quiz.handoutLayout }
}

function drawMcqResponseRow(doc: jsPDF, y: number, x: number) {
  const labels = ['A', 'B', 'C', 'D']
  doc.setFontSize(9)
  let cx = x
  labels.forEach((lab) => {
    doc.circle(cx + 2, y - 1.2, 2)
    doc.text(lab, cx + 6, y)
    cx += 22
  })
  return y + 10
}

function drawTfRow(doc: jsPDF, y: number, x: number) {
  doc.setFontSize(9)
  doc.circle(x + 2, y - 1.2, 2)
  doc.text('True', x + 8, y)
  doc.circle(x + 28, y - 1.2, 2)
  doc.text('False', x + 34, y)
  return y + 12
}

function drawShortLines(doc: jsPDF, y: number, x: number, w: number, lineCount: number, lineStepMm: number) {
  const n = Math.min(12, Math.max(1, Math.round(lineCount) || 3))
  const step = Math.max(5.5, lineStepMm)
  let yy = y
  for (let i = 0; i < n; i += 1) {
    yy = ensureY(doc, yy, step + 2)
    doc.setDrawColor(180)
    doc.line(x, yy, x + w, yy)
    yy += step
  }
  doc.setDrawColor(0)
  return yy + 4
}

export type QuizStubSectionGroup = {
  type: 'mcq' | 'tf' | 'short'
  items: QuizQuestionStub[]
  label: string
}

function sectionLabel(t: 'mcq' | 'tf' | 'short') {
  if (t === 'mcq') return 'Section A — Multiple choice'
  if (t === 'tf') return 'Section B — True / false'
  return 'Section C — Short answer'
}

/** Same ordering as PDF export — used for print preview and handouts. */
export function groupQuizStubsByType(stubs: QuizQuestionStub[]): QuizStubSectionGroup[] {
  const order: Array<'mcq' | 'tf' | 'short'> = ['mcq', 'tf', 'short']
  const map: Record<string, QuizQuestionStub[]> = { mcq: [], tf: [], short: [] }
  for (const s of stubs) {
    if (s.type in map) map[s.type].push(s)
  }
  return order
    .filter((k) => map[k].length > 0)
    .map((k) => ({ type: k as 'mcq' | 'tf' | 'short', items: map[k], label: sectionLabel(k as 'mcq' | 'tf' | 'short') }))
}

export function downloadQuizPdf(quiz: DemoQuiz, filename?: string) {
  const stubs = quiz.questionStubs ?? []
  const layout = resolveHandoutLayout(quiz)
  const lineStep = 5 * (layout.bodyLineHeight / DEFAULT_HANDOUT_LAYOUT.bodyLineHeight)
  const gapAfterQ = questionGapPxToMm(layout.questionGapPx)
  const ruledLineStepMm = ruledLineSpacingPxToMm(layout.ruledLineSpacingPx)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  drawPageHeader(doc, quiz)
  let y = MARGIN + EXAM_HEADER_H + 4
  const w = pageWidth(doc) - MARGIN * 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  y = ensureY(doc, y, 10)
  doc.text('Student handout', MARGIN, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const meta = [quiz.subject, quiz.grade, `Time limit: ${quiz.timeLimitMinutes} min`, `Topic: ${quiz.topic}`].join(' · ')
  y = writeParagraph(doc, meta, MARGIN, y, w, lineStep)
  if (quiz.sourceSummary) {
    y = writeParagraph(doc, `Sources: ${quiz.sourceSummary}`, MARGIN, y, w, lineStep)
  }
  y += 4

  if (stubs.length === 0) {
    y = writeParagraph(
      doc,
      'No question snapshot on file. Edit and publish the quiz to generate printable items.',
      MARGIN,
      y,
      w,
      lineStep
    )
    addPageNumbers(doc)
    doc.save(filename ?? `${quiz.title.replace(/\s+/g, '-').slice(0, 40)}-quiz.pdf`)
    return
  }

  const groups = groupQuizStubsByType(stubs)
  let n = 1
  for (const g of groups) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    y = ensureY(doc, y, 12)
    doc.setDrawColor(185)
    doc.line(MARGIN, y - 4.5, MARGIN + w, y - 4.5)
    doc.setDrawColor(0)
    doc.text(g.label, MARGIN, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    for (const item of g.items) {
      y = ensureY(doc, y, 28)
      doc.setFont('helvetica', 'normal')
      const cleanPrompt = stripLeadingQuestionNumber(item.prompt)
      const marks = item.points != null ? ` (${item.points} marks)` : ''
      y = writeParagraph(doc, `Q${n}. ${cleanPrompt}${marks}`, MARGIN, y, w, lineStep)
      n += 1

      if (item.type === 'mcq') {
        y = drawMcqResponseRow(doc, y, MARGIN + 10)
        doc.setFontSize(7.5)
        doc.setTextColor(120, 120, 120)
        y = ensureY(doc, y, 5)
        doc.text('Select one answer. Mark clearly in the circles.', MARGIN + 10, y)
        doc.setTextColor(0, 0, 0)
        y += 5
      } else if (item.type === 'tf') {
        y = drawTfRow(doc, y, MARGIN + 10)
        y += 3
      } else {
        y = drawShortLines(doc, y, MARGIN + 10, w - 10, clampResponseLines(item.responseLines), ruledLineStepMm)
      }
      y += gapAfterQ
    }
    y += 4
  }

  addPageNumbers(doc)
  doc.save(filename ?? `${quiz.title.replace(/\s+/g, '-').slice(0, 40)}-quiz.pdf`)
}

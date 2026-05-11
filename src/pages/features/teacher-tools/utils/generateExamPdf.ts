import { jsPDF } from 'jspdf'
import {
  DEFAULT_HANDOUT_LAYOUT,
  questionGapPxToMm,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'
import { stripLeadingMcqOptionLabel } from '../exams/utils/mcqOptionDisplay'

function stripLeadingSubpartLabel(text: string, letter: string): string {
  const re = new RegExp(`^\\s*(?:\\(${letter}\\)|${letter}\\))\\s*[:\\.-]?\\s*`, 'i')
  return text.replace(re, '').trimStart()
}

const PAGE_H_MM = 297
const MARGIN = 14
const BOTTOM_SAFE = 18
const EXAM_HEADER_H = 20

export type ExamHandoutPdfInput = {
  title: string
  subject: string
  grade: string
  timeLimitMinutes: number
  topic: string
  sourceSummary?: string
  mcqs: Array<{ stem: string; options: string[]; marks: number }>
  shorts: Array<{ stem: string; marks: number }>
  longs: Array<{ stem: string; subparts: string[]; marks: number }>
  handoutLayout?: HandoutLayoutOpts
}

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

function drawPageHeader(
  doc: jsPDF,
  meta: { title: string; subject: string; grade: string; timeLimitMinutes: number },
) {
  const w = pageWidth(doc) - MARGIN * 2
  const top = MARGIN - 4
  doc.setDrawColor(210)
  doc.setFillColor(250, 250, 252)
  doc.roundedRect(MARGIN, top, w, EXAM_HEADER_H, 2, 2, 'FD')
  doc.setDrawColor(0)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(meta.title.slice(0, 90), MARGIN + 3, top + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(85, 85, 85)
  doc.text(`${meta.subject} · ${meta.grade} · ${meta.timeLimitMinutes} min`, MARGIN + 3, top + 11)
  doc.text('Candidate name: ______________________', MARGIN + 3, top + 16)
  doc.text('Class: __________________', MARGIN + 82, top + 16)
  doc.setTextColor(0, 0, 0)
}

function ensureY(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H_MM - BOTTOM_SAFE) {
    doc.addPage()
    return MARGIN + 6
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

function sectionHeading(doc: jsPDF, y: number, w: number, title: string, subtitle?: string): number {
  let yy = ensureY(doc, y, 14)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setDrawColor(185)
  doc.line(MARGIN, yy - 3, MARGIN + w, yy - 3)
  doc.setDrawColor(0)
  doc.text(title, MARGIN, yy)
  yy += 6
  if (subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(75, 75, 75)
    yy = writeParagraph(doc, subtitle, MARGIN, yy, w, 4.2)
    doc.setTextColor(0, 0, 0)
  }
  return yy + 2
}

function resolveLayout(layout?: HandoutLayoutOpts): HandoutLayoutOpts {
  return { ...DEFAULT_HANDOUT_LAYOUT, ...layout }
}

/**
 * Student-facing exam handout: objective (stem + printed options), then short and long
 * without ruled answer lines (clean layout for print/PDF).
 */
export function downloadExamHandoutPdf(input: ExamHandoutPdfInput, filename?: string) {
  const layout = resolveLayout(input.handoutLayout)
  const lineStep = 5 * (layout.bodyLineHeight / DEFAULT_HANDOUT_LAYOUT.bodyLineHeight)
  const gapAfterQ = questionGapPxToMm(layout.questionGapPx)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const w = pageWidth(doc) - MARGIN * 2

  const headerMeta = {
    title: input.title,
    subject: input.subject,
    grade: input.grade,
    timeLimitMinutes: input.timeLimitMinutes,
  }

  drawPageHeader(doc, headerMeta)
  let y = MARGIN + EXAM_HEADER_H + 4

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  y = ensureY(doc, y, 10)
  doc.text('Examination paper', MARGIN, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const metaLine = [input.subject, input.grade, `Time: ${input.timeLimitMinutes} min`, `Topic: ${input.topic}`].join(' · ')
  y = writeParagraph(doc, metaLine, MARGIN, y, w, lineStep)
  if (input.sourceSummary) {
    y = writeParagraph(doc, `Sources: ${input.sourceSummary}`, MARGIN, y, w, lineStep)
  }
  y += 3

  let qNum = 1

  if (input.mcqs.length > 0) {
    y = sectionHeading(
      doc,
      y,
      w,
      'Part A — Objective (multiple choice)',
      'Select one answer for each question. Write the letter clearly in the margin if required by your centre.',
    )
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    for (const q of input.mcqs) {
      y = ensureY(doc, y, 22)
      const marks = q.marks === 1 ? '1 mark' : `${q.marks} marks`
      y = writeParagraph(doc, `Q${qNum}. ${q.stem} (${marks})`, MARGIN, y, w, lineStep)
      qNum += 1

      const letters = q.options.map((_, i) => String.fromCharCode(65 + i))
      doc.setFontSize(9.5)
      for (let i = 0; i < q.options.length; i += 1) {
        const lab = letters[i] ?? String(i + 1)
        const line = `${lab}. ${stripLeadingMcqOptionLabel(q.options[i])}`
        y = ensureY(doc, y, 5)
        doc.text(line, MARGIN + 4, y)
        y += 4.8
      }
      doc.setFontSize(10)
      y += gapAfterQ
    }
  }

  const hasSubjective = input.shorts.length > 0 || input.longs.length > 0
  if (hasSubjective) {
    doc.addPage()
    drawPageHeader(doc, headerMeta)
    y = MARGIN + EXAM_HEADER_H + 4
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    y = ensureY(doc, y, 8)
    doc.text('Examination paper (continued)', MARGIN, y)
    y += 8
  }

  if (input.shorts.length > 0) {
    y = sectionHeading(
      doc,
      y,
      w,
      'Part B1 — Short written answers',
      'Answer each question concisely. No response lines are printed; use the space below each item and continue on the reverse if needed.',
    )
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    for (const q of input.shorts) {
      y = ensureY(doc, y, 16)
      const marks = q.marks === 1 ? '1 mark' : `${q.marks} marks`
      y = writeParagraph(doc, `Q${qNum}. ${q.stem} (${marks})`, MARGIN, y, w, lineStep)
      qNum += 1
      y += 6
    }
    y += 2
  }

  if (input.longs.length > 0) {
    y = sectionHeading(
      doc,
      y,
      w,
      'Part B2 — Long written answers',
      'Answer all parts as indicated. Sub-parts are labelled (a), (b), …',
    )
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    for (const q of input.longs) {
      y = ensureY(doc, y, 24)
      const marks = q.marks === 1 ? '1 mark' : `${q.marks} marks`
      y = writeParagraph(doc, `Q${qNum}. ${q.stem} (${marks})`, MARGIN, y, w, lineStep)
      qNum += 1
      doc.setFontSize(9.5)
      let si = 0
      for (const sp of q.subparts) {
        const label = `(${String.fromCharCode(97 + si)})`
        const letter = String.fromCharCode(97 + si)
        const cleaned = stripLeadingSubpartLabel(sp, letter)
        y = ensureY(doc, y, 6)
        y = writeParagraph(doc, `${label} ${cleaned}`, MARGIN + 4, y, w - 4, lineStep - 0.3)
        si += 1
      }
      doc.setFontSize(10)
      y += gapAfterQ + 2
    }
  }

  addPageNumbers(doc)
  const safeName = (filename ?? `${input.title.replace(/\s+/g, '-').slice(0, 40)}-exam.pdf`).replace(/[/\\?%*:|"<>]/g, '-')
  doc.save(safeName)
}

import { jsPDF } from 'jspdf'
import type { AssignmentBriefTopicStub } from '../demo/generationFromSources'
import {
  DEFAULT_HANDOUT_LAYOUT,
  questionGapPxToMm,
  ruledLineSpacingPxToMm,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'

const PAGE_H_MM = 297
const MARGIN = 14
const BOTTOM_SAFE = 18

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

function ensureY(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H_MM - BOTTOM_SAFE) {
    doc.addPage()
    return MARGIN + 4
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

export function formatAssignmentDueDate(dueAt: string): string {
  if (!dueAt || dueAt.length < 10) return dueAt || '—'
  try {
    const d = new Date(`${dueAt.slice(0, 10)}T12:00:00`)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dueAt
  }
}

export type AssignmentPdfMeta = {
  title: string
  subject: string
  grade: string
  dueAt: string
  assignmentType: string
  studentInstructions: string
  topic?: string
  sourceSummary?: string
}

export function downloadAssignmentBriefPdf(
  meta: AssignmentPdfMeta,
  topics: AssignmentBriefTopicStub[],
  layout: HandoutLayoutOpts = DEFAULT_HANDOUT_LAYOUT,
  filename?: string,
) {
  const mergedLayout = { ...DEFAULT_HANDOUT_LAYOUT, ...layout }
  const lineStep = 5 * (mergedLayout.bodyLineHeight / DEFAULT_HANDOUT_LAYOUT.bodyLineHeight)
  const gapBetweenTopics = questionGapPxToMm(mergedLayout.questionGapPx) + 2
  const gapBetweenLines = ruledLineSpacingPxToMm(mergedLayout.ruledLineSpacingPx) * 0.35 + 1.5

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN
  const w = pageWidth(doc) - MARGIN * 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  y = ensureY(doc, y, 12)
  doc.text(meta.title.slice(0, 80), MARGIN, y)
  y += 9

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(70, 70, 70)
  const due = formatAssignmentDueDate(meta.dueAt)
  const sub = [meta.subject, meta.grade, `Due ${due}`, meta.assignmentType].join(' · ')
  y = writeParagraph(doc, sub, MARGIN, y, w, lineStep)
  doc.setTextColor(0, 0, 0)

  if (meta.topic?.trim()) {
    y = writeParagraph(doc, `Focus: ${meta.topic}`, MARGIN, y, w, lineStep)
  }
  if (meta.sourceSummary?.trim()) {
    y = writeParagraph(doc, `Materials: ${meta.sourceSummary}`, MARGIN, y, w, lineStep)
  }

  y += 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  y = writeParagraph(doc, 'Instructions for students', MARGIN, y, w, lineStep)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y = writeParagraph(doc, meta.studentInstructions?.trim() || '—', MARGIN, y, w, lineStep)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(90, 90, 90)
  y = writeParagraph(doc, 'Name: ________________________________    Date: ________________', MARGIN, y, w, 4.5)
  doc.setTextColor(0, 0, 0)
  y += 3

  if (topics.length === 0) {
    y = writeParagraph(doc, 'No assignment brief content to print.', MARGIN, y, w, lineStep)
    addPageNumbers(doc)
    doc.save(filename ?? `${meta.title.replace(/\s+/g, '-').slice(0, 40)}-assignment.pdf`)
    return
  }

  doc.setFontSize(10)
  for (const topic of topics) {
    y = ensureY(doc, y, 14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(17, 24, 39)
    y = writeParagraph(doc, topic.title, MARGIN, y, w, lineStep + 0.5)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    topic.lines.forEach((line, i) => {
      y = ensureY(doc, y, 10)
      const prefix = `${i + 1}. `
      const body = `${prefix}${line.text}`
      y = writeParagraph(doc, body, MARGIN + 2, y, w - 2, lineStep)
      y += gapBetweenLines
    })
    y += gapBetweenTopics
  }

  addPageNumbers(doc)
  doc.save(filename ?? `${meta.title.replace(/\s+/g, '-').slice(0, 40)}-assignment.pdf`)
}

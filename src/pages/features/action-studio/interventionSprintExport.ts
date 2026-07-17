import { Document, HeadingLevel, Packer, Paragraph } from 'docx'
import { saveAs } from 'file-saver'
import { SECTION_LABELS, SECTION_ORDER, type SprintPlan, type SprintPlanSections } from './interventionSprintTypes'

function sectionBodyAsLines(plan: SprintPlan, key: keyof SprintPlanSections): string[] {
  const s = plan.sections
  switch (key) {
    case 'problemSummary':
      return [s.problemSummary]
    case 'interventionGoal':
      return [s.interventionGoal]
    case 'dailyActionPlan':
      return s.dailyActionPlan.map(
        (d) =>
          `Day ${d.day} — ${d.phase} (${d.minutes} min)\n  Focus: ${d.focus}\n  Activity: ${d.activity}\n  Teacher move: ${d.teacherMove}`,
      )
    case 'differentiation':
      return s.differentiation.map((d) => `${d.label}: ${d.adjustment}`)
    case 'progressMonitoring':
      return s.progressMonitoring.map((p) => `Day ${p.day} — ${p.method}: ${p.lookFor}`)
    case 'teacherGuidance':
      return s.teacherGuidance.map((g) => `- ${g}`)
    case 'familyCommunication':
      return [s.familyCommunication]
    case 'adminSummary':
      return [s.adminSummary]
    default:
      return []
  }
}

export function sectionToPlainText(plan: SprintPlan, key: keyof SprintPlanSections): string {
  return sectionBodyAsLines(plan, key).join('\n')
}

export function planToPlainText(plan: SprintPlan): string {
  const title = `Intervention Sprint: ${plan.context.topicOrSkill || 'Untitled'}`
  const subtitle = `${plan.context.grade || 'Grade N/A'} · ${plan.context.subject || 'Subject N/A'} · ${plan.context.durationDays}-day sprint · ${plan.context.minutesPerDay} min/day`
  const body = SECTION_ORDER.map((key) => `${SECTION_LABELS[key]}\n${sectionToPlainText(plan, key)}`).join('\n\n')
  return `${title}\n${subtitle}\n\n${body}`
}

export async function exportPlanAsDocx(plan: SprintPlan): Promise<void> {
  const title = `Intervention Sprint: ${plan.context.topicOrSkill || 'Untitled'}`
  const subtitle = `${plan.context.grade || 'Grade N/A'} · ${plan.context.subject || 'Subject N/A'} · ${plan.context.durationDays}-day sprint · ${plan.context.minutesPerDay} min/day`

  const paragraphs: Paragraph[] = [
    new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: subtitle }),
    new Paragraph({ text: '' }),
  ]

  SECTION_ORDER.forEach((key) => {
    paragraphs.push(new Paragraph({ text: SECTION_LABELS[key], heading: HeadingLevel.HEADING_2 }))
    const lines = sectionBodyAsLines(plan, key)
    lines.forEach((line) => {
      line.split('\n').forEach((sub) => {
        const trimmed = sub.trim()
        if (trimmed.startsWith('- ')) {
          paragraphs.push(new Paragraph({ text: trimmed.substring(2), bullet: { level: 0 } }))
        } else {
          paragraphs.push(new Paragraph({ text: sub }))
        }
      })
    })
    paragraphs.push(new Paragraph({ text: '' }))
  })

  try {
    const doc = new Document({ sections: [{ children: paragraphs }] })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `intervention-sprint-${plan.context.topicOrSkill || 'plan'}.docx`.replace(/\s+/g, '-').toLowerCase())
  } catch (err) {
    console.error('DOCX export failed, falling back to plain text:', err)
    const text = planToPlainText(plan)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `intervention-sprint-${plan.context.topicOrSkill || 'plan'}.txt`.replace(/\s+/g, '-').toLowerCase())
  }
}

export function printPlan(plan: SprintPlan): void {
  const text = planToPlainText(plan)
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  win.document.write(
    `<!doctype html><html><head><title>Intervention Sprint Plan</title>` +
      `<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:pre-wrap;line-height:1.6;padding:2rem;color:#111827;}</style>` +
      `</head><body>${escaped}</body></html>`,
  )
  win.document.close()
  win.focus()
  win.print()
}

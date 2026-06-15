import {
  formatGradeDisplay,
  gradeValueForSelect,
  resolveGradeValue,
} from './gradeAdapters'
import { chatbotBandToApi, chatbotBandValueForSelect } from './gradeBandAdapters'

/** Legacy grade_level → canonical slug for GradeSelect. */
export function gradeLevelForSelect(stored: string | number | null | undefined): string {
  return gradeValueForSelect(stored)
}

/** Chatbot API expects numeric string or K. */
export function gradeLevelToChatbotApi(canonical: string | number | null | undefined): string {
  const resolved = resolveGradeValue(canonical)
  return resolved ?? String(canonical ?? '')
}

export function formatGradeLevelDisplay(stored: string | number | null | undefined): string {
  return formatGradeDisplay(stored)
}

export { chatbotBandValueForSelect, chatbotBandToApi }

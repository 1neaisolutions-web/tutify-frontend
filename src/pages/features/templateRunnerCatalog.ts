import { gradeToNumeric, gradeValueForSelect } from '@/catalog/adapters/gradeAdapters'
import { gradeBandValueForSelect } from '@/catalog/adapters/gradeBandAdapters'
import {
  templateSubjectToApi,
  templateSubjectValueForSelect,
} from '@/catalog/adapters/subjectAdapters'
import {
  isTemplateGradeLevelField,
  templateGradeLevelToApi,
  templateGradeLevelValueForSelect,
} from '@/catalog/adapters/templateGradeLevelAdapters'

export type TemplateField = {
  name: string
  type: string
  label?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  min?: number
  max?: number
  default?: string
}

export { isTemplateGradeLevelField }

export function applyTemplateFieldDefault(field: TemplateField): string {
  const d = field.default || ''
  if (!d) return ''
  if (field.name === 'grade') return gradeValueForSelect(d)
  if (isTemplateGradeLevelField(field)) {
    return templateGradeLevelValueForSelect(d, field.options)
  }
  if (field.name === 'grade_band') return gradeBandValueForSelect(d)
  if (field.name === 'subject') return templateSubjectValueForSelect(d)
  return d
}

export function normalizeTemplateFieldValue(field: TemplateField, raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  if (field.name === 'grade') {
    return gradeValueForSelect(typeof raw === 'number' || typeof raw === 'boolean' ? String(raw) : String(raw))
  }
  if (isTemplateGradeLevelField(field)) {
    return templateGradeLevelValueForSelect(
      typeof raw === 'number' || typeof raw === 'boolean' ? String(raw) : String(raw),
      field.options,
    )
  }
  if (field.name === 'grade_band') {
    return gradeBandValueForSelect(String(raw))
  }
  if (field.name === 'subject') {
    return templateSubjectValueForSelect(String(raw))
  }
  if (typeof raw === 'string') return raw
  if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw)
  if (Array.isArray(raw)) return raw.map((x) => String(x)).join('\n')
  return JSON.stringify(raw)
}

export function buildTemplatePayload(
  formValues: Record<string, string>,
  schemaFields: TemplateField[],
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  schemaFields.forEach((field) => {
    const raw = formValues[field.name]
    if (!raw || raw.trim() === '') return

    if (field.name === 'grade') {
      const num = gradeToNumeric(raw)
      if (num !== undefined) payload[field.name] = num
      return
    }
    if (isTemplateGradeLevelField(field)) {
      payload[field.name] = templateGradeLevelToApi(raw, field.options!)
      return
    }
    if (field.name === 'subject') {
      payload[field.name] = templateSubjectToApi(raw)
      return
    }
    if (field.name === 'grade_band') {
      payload[field.name] = raw.trim()
      return
    }

    if (field.type === 'number') {
      const numericValue = Number(raw)
      payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
    } else if (field.type === 'select' && field.options) {
      if (field.options.length === 2 && field.options.includes('true') && field.options.includes('false')) {
        payload[field.name] = raw === 'true'
      } else {
        payload[field.name] = raw
      }
    } else if (field.type === 'array') {
      payload[field.name] = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    } else {
      payload[field.name] = raw.trim()
    }
  })

  if (payload.question_types) {
    const raw = String(payload.question_types)
    const tokens = raw
      .split(/[,;/]|and|\n/gi)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
    const mapped = tokens
      .map((t) => {
        if (t.includes('mcq') || t.includes('multiple')) return 'MCQ'
        if (t.includes('short')) return 'short_answer'
        if (t.includes('essay')) return 'essay'
        if (t.includes('diagram') || t.includes('label')) return 'diagram'
        if (t.includes('match')) return 'matching'
        return ''
      })
      .filter(Boolean)
    if (mapped.length > 0) {
      payload.question_types = mapped
    } else {
      delete payload.question_types
    }
  }

  if (payload.difficulty) {
    payload.difficulty = String(payload.difficulty).toLowerCase()
  }

  if (payload.bloom_level) {
    payload.bloom_level = String(payload.bloom_level).toLowerCase()
  }

  return payload
}

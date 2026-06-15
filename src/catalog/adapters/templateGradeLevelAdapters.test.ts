import { describe, expect, it } from 'vitest'
import {
  gradeOptionsForTemplateEnum,
  isTemplateOrdinalGradeEnum,
  resolveTemplateOrdinalGrade,
  templateGradeLevelToApi,
  templateGradeLevelValueForSelect,
} from './templateGradeLevelAdapters'

const FULL_K12 = [
  'Kindergarten',
  '1st grade',
  '2nd grade',
  '3rd grade',
  '4th grade',
  '5th grade',
  '6th grade',
  '7th grade',
  '8th grade',
  '9th grade',
  '10th grade',
  '11th grade',
  '12th grade',
]

const THIRD_TO_TWELFTH = [
  '3rd grade',
  '4th grade',
  '5th grade',
  '6th grade',
  '7th grade',
  '8th grade',
  '9th grade',
  '10th grade',
  '11th grade',
  '12th grade',
]

describe('resolveTemplateOrdinalGrade', () => {
  it.each([
    ['Kindergarten', 'K'],
    ['10th grade', '10'],
    ['7th grade', '7'],
    ['3rd grade', '3'],
    ['unknown', null],
  ] as const)('maps %s → %s', (raw, expected) => {
    expect(resolveTemplateOrdinalGrade(raw)).toBe(expected)
  })
})

describe('isTemplateOrdinalGradeEnum', () => {
  it('returns true for full ordinal enums', () => {
    expect(isTemplateOrdinalGradeEnum(FULL_K12)).toBe(true)
    expect(isTemplateOrdinalGradeEnum(THIRD_TO_TWELFTH)).toBe(true)
  })

  it('returns false when any option is not an ordinal grade', () => {
    expect(isTemplateOrdinalGradeEnum(['Middle School', 'High School'])).toBe(false)
  })
})

describe('templateGradeLevelValueForSelect', () => {
  it('returns canonical slug for stored enum strings', () => {
    expect(templateGradeLevelValueForSelect('Kindergarten')).toBe('K')
    expect(templateGradeLevelValueForSelect('10th grade')).toBe('10')
  })
})

describe('templateGradeLevelToApi', () => {
  it('maps slug to exact schema enum string', () => {
    expect(templateGradeLevelToApi('7', THIRD_TO_TWELFTH)).toBe('7th grade')
    expect(templateGradeLevelToApi('K', FULL_K12)).toBe('Kindergarten')
  })

  it('returns empty when slug not in schema subset', () => {
    expect(templateGradeLevelToApi('K', THIRD_TO_TWELFTH)).toBe('')
    expect(templateGradeLevelToApi('2', THIRD_TO_TWELFTH)).toBe('')
  })
})

describe('gradeOptionsForTemplateEnum', () => {
  it('excludes grades not in schema enum', () => {
    const options = gradeOptionsForTemplateEnum(THIRD_TO_TWELFTH)
    expect(options.map((o) => o.value)).toEqual(['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    expect(options.some((o) => o.value === 'K' || o.value === '1' || o.value === '2')).toBe(false)
  })

  it('uses metadata labels from fallback grades', () => {
    const options = gradeOptionsForTemplateEnum(['7th grade'])
    expect(options).toEqual([{ value: '7', label: 'Grade 7' }])
  })
})

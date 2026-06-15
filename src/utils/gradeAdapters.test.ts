import { describe, expect, it } from 'vitest'
import {
  formatGradeDisplay,
  gradeToLabel,
  gradeToNumeric,
  gradeValueForSelect,
  gradesMatch,
  resolveGradeValue,
} from '@/catalog/adapters/gradeAdapters'

describe('resolveGradeValue', () => {
  it.each([
    ['Year 7', '7'],
    ['year 7', '7'],
    ['Grade 8', '8'],
    ['grade 8', '8'],
    ['8', '8'],
    [8, '8'],
    [0, 'K'],
    ['0', 'K'],
    ['K', 'K'],
    ['Kindergarten', 'K'],
    ['kinder', 'K'],
    ['Grade 12', '12'],
    ['Year 11', '11'],
    ['grade k', 'K'],
    [null, null],
    ['unknown_value', null],
  ] as const)('maps %s → %s', (raw, expected) => {
    expect(resolveGradeValue(raw)).toBe(expected)
  })
})

describe('gradeToLabel', () => {
  it.each([
    ['Year 7', 'Grade 7'],
    ['8', 'Grade 8'],
    [0, 'Kindergarten'],
    ['K', 'Kindergarten'],
    ['Grade 12', 'Grade 12'],
    ['unknown', 'unknown'],
  ] as const)('formats %s as %s', (raw, expected) => {
    expect(gradeToLabel(raw)).toBe(expected)
  })
})

describe('gradeToNumeric', () => {
  it.each([
    ['K', 0],
    ['1', 1],
    ['12', 12],
    ['Year 7', 7],
    ['Grade 8', 8],
    [0, 0],
    [8, 8],
    [null, undefined],
    ['unknown', undefined],
  ] as const)('numeric %s → %s', (raw, expected) => {
    expect(gradeToNumeric(raw)).toBe(expected)
  })
})

describe('formatGradeDisplay', () => {
  it('matches gradeToLabel', () => {
    expect(formatGradeDisplay('Year 7')).toBe('Grade 7')
  })
})

describe('gradesMatch', () => {
  it('matches legacy and canonical values', () => {
    expect(gradesMatch('Year 7', '7')).toBe(true)
    expect(gradesMatch('Grade 8', '8')).toBe(true)
    expect(gradesMatch('Year 7', '8')).toBe(false)
  })

  it('returns true when filter is empty', () => {
    expect(gradesMatch('Year 7', '')).toBe(true)
  })
})

describe('gradeValueForSelect', () => {
  it('returns canonical value for select', () => {
    expect(gradeValueForSelect('Year 7')).toBe('7')
    expect(gradeValueForSelect('unknown')).toBe('')
  })
})

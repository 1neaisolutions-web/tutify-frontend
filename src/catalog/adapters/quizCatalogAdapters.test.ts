import { describe, expect, it } from 'vitest'
import { buildCatalogListParams } from './quizCatalogAdapters'

describe('buildCatalogListParams', () => {
  it('passes canonical subject and grade slugs with strict defaults', () => {
    expect(buildCatalogListParams({ subject: 'math', grade: '8' })).toEqual({
      subject: 'math',
      grade: '8',
      page: 1,
      page_size: 100,
      strict: true,
      include_near_matches: false,
    })
  })

  it('omits empty subject and grade', () => {
    expect(buildCatalogListParams({ subject: '', grade: '  ', q: 'algebra' })).toEqual({
      q: 'algebra',
      page: 1,
      page_size: 100,
      strict: true,
      include_near_matches: false,
    })
  })

  it('supports browse-all and near-match flags', () => {
    expect(
      buildCatalogListParams({
        subject: 'physics',
        grade: '11',
        strict: false,
        includeNearMatches: true,
      }),
    ).toEqual({
      subject: 'physics',
      grade: '11',
      page: 1,
      page_size: 100,
      strict: false,
      include_near_matches: true,
    })
  })
})

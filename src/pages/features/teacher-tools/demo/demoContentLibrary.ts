/** Curated system books + supplementary materials for Teacher Tools demo (RAG-ready UX). */

export type MaterialSourceKind = 'none' | 'system'

export interface DemoChapter {
  id: string
  title: string
  summary: string
  pageRange: string
  excerpt: string
}

export interface DemoBook {
  id: string
  title: string
  authors: string
  publisher: string
  isbn: string
  subjects: string[]
  grades: string[]
  editionYear: number
  chapters: DemoChapter[]
  source: 'system' | 'uploaded_demo'
  indexedSections: number
  /** Indexed topical strands used for RAG scope UX (union across selected books). */
  catalogTopics: string[]
}

export interface DemoSupplementaryMaterial {
  id: string
  title: string
  type: 'syllabus' | 'past_paper' | 'teacher_guide' | 'worksheet_pack'
  subject: string
  grades: string[]
  relatedBookIds: string[]
  summary: string
  indexedSections: number
}

export const SYSTEM_BOOKS: DemoBook[] = [
  {
    id: 'book-math-heinemann-8',
    title: 'Heinemann Mathematics 8 (International Edition)',
    authors: 'J. Smith et al.',
    publisher: 'Pearson Education',
    isbn: '978-0-435-98214-2',
    subjects: ['Mathematics'],
    grades: ['Grade 5', 'Grade 6', 'Grade 8', 'Year 9'],
    editionYear: 2021,
    source: 'system',
    indexedSections: 48,
    catalogTopics: [
      'Linear equations',
      'Graphing linear relationships',
      'Algebraic manipulation',
      'Word problems',
      'Ratio and proportion',
      'Exam-style reasoning',
    ],
    chapters: [
      {
        id: 'ch-alg-1',
        title: 'Linear equations',
        summary: 'Solving ax + b = c; balance method; applications.',
        pageRange: 'pp. 112–128',
        excerpt:
          'To maintain equality, perform the same operation on both sides. Example: 2x + 5 = 13 implies 2x = 8 and x = 4.',
      },
      {
        id: 'ch-alg-2',
        title: 'Graphing linear relationships',
        summary: 'Slope, intercept, interpreting graphs in context.',
        pageRange: 'pp. 129–145',
        excerpt:
          'The slope m measures rate of change. In y = mx + c, c is the y-intercept where the line crosses the vertical axis.',
      },
    ],
  },
  {
    id: 'book-bio-cambridge-10',
    title: 'Cambridge IGCSE Biology Coursebook',
    authors: 'Mary Jones, Geoff Jones',
    publisher: 'Cambridge University Press',
    isbn: '978-1-108-76193-0',
    subjects: ['Biology', 'Science'],
    grades: ['Grade 10', 'Year 11'],
    editionYear: 2023,
    source: 'system',
    indexedSections: 62,
    catalogTopics: ['Photosynthesis', 'Plant nutrition', 'Transport in plants', 'Leaf structure', 'Scientific diagrams'],
    chapters: [
      {
        id: 'ch-photo-1',
        title: 'Photosynthesis',
        summary: 'Light-dependent and light-independent reactions; leaf structure.',
        pageRange: 'pp. 204–221',
        excerpt:
          'Photosynthesis converts light energy into chemical energy stored in glucose. Gas exchange occurs mainly through stomata.',
      },
      {
        id: 'ch-photo-2',
        title: 'Plant nutrition and transport',
        summary: 'Xylem, phloem, mineral uptake.',
        pageRange: 'pp. 222–238',
        excerpt:
          'Transpiration pull helps move water from roots to leaves. Phloem transports sugars produced in leaves to storage organs.',
      },
    ],
  },
  {
    id: 'book-eng-oxford-7',
    title: 'Oxford English: An International Approach 3',
    authors: 'R. Acosta, L. Hird',
    publisher: 'Oxford University Press',
    isbn: '978-0-19-839034-2',
    subjects: ['English'],
    grades: ['Year 7', 'Grade 8'],
    editionYear: 2020,
    source: 'system',
    indexedSections: 36,
    catalogTopics: ['Persuasive writing', 'Thesis and evidence', 'Grammar and punctuation', 'Reading comprehension'],
    chapters: [
      {
        id: 'ch-eng-1',
        title: 'Persuasive writing',
        summary: 'Thesis, evidence, counterargument, tone.',
        pageRange: 'pp. 88–104',
        excerpt:
          'A strong persuasive paragraph opens with a clear claim, supports it with evidence, and acknowledges a counterpoint before reinforcing the claim.',
      },
    ],
  },
  {
    id: 'book-hist-pearson-7',
    title: 'World History: Connections to Today (International)',
    authors: 'E. Ellis, A. Esler',
    publisher: 'Pearson',
    isbn: '978-0-13-323103-4',
    subjects: ['History'],
    grades: ['Year 7', 'Year 9'],
    editionYear: 2019,
    source: 'system',
    indexedSections: 55,
    catalogTopics: ['World War II', 'Treaty of Versailles', 'Cold War overview', 'Primary sources'],
    chapters: [
      {
        id: 'ch-hist-ww2',
        title: 'World War II: causes and course',
        summary: 'Treaty tensions, mobilisation, key fronts, outcomes.',
        pageRange: 'pp. 612–645',
        excerpt:
          'Economic instability after 1919 contributed to political extremism. Allied strategy combined Atlantic and Pacific campaigns with industrial mobilisation.',
      },
    ],
  },
  {
    id: 'book-chem-pearson-9',
    title: 'Chemistry: The Central Science (Secondary International)',
    authors: 'T. Brown et al.',
    publisher: 'Pearson',
    isbn: '978-0-13-441423-2',
    subjects: ['Chemistry', 'Science'],
    grades: ['Year 9', 'Grade 10'],
    editionYear: 2022,
    source: 'system',
    indexedSections: 41,
    catalogTopics: ['Acid-base reactions', 'pH and indicators', 'Periodic table trends', 'Moles and stoichiometry'],
    chapters: [
      {
        id: 'ch-chem-acid',
        title: 'Acids, bases, and salts',
        summary: 'pH, neutralisation, indicators, common reactions.',
        pageRange: 'pp. 318–340',
        excerpt:
          'Neutralisation forms a salt and water. Strong acids fully ionise in solution; weak acids only partially ionise.',
      },
    ],
  },
  {
    id: 'book-math-singapore-5a',
    title: 'Math in Focus: Singapore Math (Grade 5A)',
    authors: 'Cavendish Education',
    publisher: 'Marshall Cavendish',
    isbn: '978-0-76-149699-0',
    subjects: ['Mathematics'],
    grades: ['Grade 5', 'Grade 6'],
    editionYear: 2020,
    source: 'system',
    indexedSections: 52,
    catalogTopics: [
      'Whole numbers',
      'Fractions',
      'Decimals',
      'Multiplying fractions',
      'Word problems',
      'Volume and capacity',
      'Order of operations',
    ],
    chapters: [
      {
        id: 'ch-sg5-frac',
        title: 'Fractions and mixed numbers',
        summary: 'Equivalent fractions, addition and subtraction, bar models.',
        pageRange: 'pp. 45–78',
        excerpt:
          'Use a bar model to compare fractional parts. When denominators differ, find a common denominator before adding.',
      },
      {
        id: 'ch-sg5-dec',
        title: 'Decimals to thousandths',
        summary: 'Place value, comparing decimals, rounding.',
        pageRange: 'pp. 79–102',
        excerpt:
          'Each place to the right of the decimal is ten times smaller. Compare digits from left to right when ordering.',
      },
    ],
  },
  {
    id: 'book-math-ready-5',
    title: 'Ready Classroom Mathematics — Grade 5 (National)',
    authors: 'Curriculum Associates',
    publisher: 'Curriculum Associates',
    isbn: '978-1-76-004321-8',
    subjects: ['Mathematics'],
    grades: ['Grade 5'],
    editionYear: 2023,
    source: 'system',
    indexedSections: 44,
    catalogTopics: [
      'Numerical expressions',
      'Coordinate plane',
      'Fractions',
      'Decimals',
      'Measurement conversions',
      'Multistep word problems',
      'Common misconceptions',
    ],
    chapters: [
      {
        id: 'ch-ready5-wp',
        title: 'Applying operations',
        summary: 'Interpret expressions; solve multistep problems with parentheses.',
        pageRange: 'Unit 3',
        excerpt:
          'Parentheses indicate which operations belong together; evaluate inner expressions before combining results.',
      },
    ],
  },
]

export const SUPPLEMENTARY_MATERIALS: DemoSupplementaryMaterial[] = [
  {
    id: 'mat-syllabus-igcse-sci',
    title: 'IGCSE Coordinated Science syllabus (2025)',
    type: 'syllabus',
    subject: 'Science',
    grades: ['Grade 6', 'Grade 10'],
    relatedBookIds: ['book-bio-cambridge-10'],
    summary: 'Assessment objectives and topic weightings.',
    indexedSections: 14,
  },
  {
    id: 'mat-past-math-2024',
    title: 'Past paper pack: Algebra (2024)',
    type: 'past_paper',
    subject: 'Mathematics',
    grades: ['Grade 8'],
    relatedBookIds: ['book-math-heinemann-8'],
    summary: '12 exam-style items with mark schemes.',
    indexedSections: 24,
  },
]

export const TOPIC_PRESETS: { subject: string; topics: string[] }[] = [
  { subject: 'Mathematics', topics: ['Linear equations', 'Fractions', 'Percentages', 'Geometry basics'] },
  { subject: 'Biology', topics: ['Photosynthesis', 'Cell structure', 'Genetics introduction'] },
  { subject: 'English', topics: ['Persuasive writing', 'Grammar and punctuation', 'Reading comprehension'] },
  { subject: 'History', topics: ['World War II', 'Cold War overview', 'Industrial Revolution'] },
  { subject: 'Chemistry', topics: ['Acid-base reactions', 'Periodic table trends', 'Moles and stoichiometry'] },
  { subject: 'Science', topics: ['Scientific method', 'Energy transfers', 'Forces'] },
]

export function getTopicsForSubject(subject: string): string[] {
  const row = TOPIC_PRESETS.find((r) => r.subject === subject)
  return row?.topics ?? ['General topic']
}

export function gradeMatches(bookGrades: string[], selectedGrade: string): boolean {
  if (!selectedGrade) return true
  return bookGrades.some((g) => g === selectedGrade || selectedGrade.includes(g) || g.includes(selectedGrade))
}

export function subjectMatches(bookSubjects: string[], selectedSubject: string): boolean {
  if (!selectedSubject) return true
  return bookSubjects.some((s) => s === selectedSubject || selectedSubject.includes(s))
}

export function getBooksForSubjectGrade(subject: string, grade: string, extraBooks: DemoBook[] = []): DemoBook[] {
  const all = [...SYSTEM_BOOKS, ...extraBooks]
  return all.filter((b) => subjectMatches(b.subjects, subject) && gradeMatches(b.grades, grade))
}

export function searchBooks(query: string, pool: DemoBook[]): DemoBook[] {
  const q = query.trim().toLowerCase()
  if (!q) return pool
  return pool.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.authors.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.subjects.some((s) => s.toLowerCase().includes(q)) ||
      b.catalogTopics.some((t) => t.toLowerCase().includes(q))
  )
}

/** Union of catalog topic strands across the given books, sorted. */
export function aggregateCatalogTopicsFromBooks(bookIds: string[], pool: DemoBook[]): string[] {
  const set = new Set<string>()
  for (const id of bookIds) {
    const b = pool.find((x) => x.id === id)
    b?.catalogTopics.forEach((t) => set.add(t))
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

/**
 * Demo-only estimate of how many indexed segments match the current scope.
 * Backend should replace with retrieval counts from the vector index.
 */
export function estimateIndexedSegmentsMatched(
  bookIds: string[],
  selectedTopics: string[],
  pool: DemoBook[]
): number {
  if (bookIds.length === 0) return 0
  let sectionSum = 0
  for (const id of bookIds) {
    const b = pool.find((x) => x.id === id)
    if (b) sectionSum += b.indexedSections
  }
  const topicFactor =
    selectedTopics.length === 0 ? 0.32 : Math.min(1, 0.22 + selectedTopics.length * 0.17)
  return Math.max(8, Math.round(sectionSum * topicFactor))
}

export function getChapters(bookId: string, pool: DemoBook[] = [...SYSTEM_BOOKS]): DemoChapter[] {
  const b = pool.find((x) => x.id === bookId)
  return b?.chapters ?? []
}

export function getBookById(bookId: string, pool: DemoBook[]): DemoBook | undefined {
  return pool.find((b) => b.id === bookId)
}

export function getExcerptsForSelection(book: DemoBook | undefined, chapterIds: string[]): string[] {
  if (!book) return []
  const chapters = book.chapters.filter((c) => chapterIds.length === 0 || chapterIds.includes(c.id))
  return chapters.map((c) => `${c.title}: ${c.excerpt}`)
}

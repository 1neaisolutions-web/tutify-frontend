/** Offline fallbacks when /metadata/* has not loaded yet. Keep in sync with metadata_data.py */

export const FALLBACK_GRADES = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
] as const

export const FALLBACK_GRADE_BANDS = [
  { value: 'K-2', label: 'K–2' },
  { value: '3-5', label: '3–5' },
  { value: '6-8', label: '6–8' },
  { value: '9-12', label: '9–12' },
  { value: 'higher_ed', label: 'Higher Education' },
  { value: 'other', label: 'Other' },
] as const

export const FALLBACK_SUBJECTS = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'ela', label: 'English Language Arts' },
  { value: 'social_studies', label: 'Social Studies' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'biology', label: 'Biology' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'other', label: 'Other' },
] as const

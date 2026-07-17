export type GroupType = 'one_on_one' | 'small_group' | 'whole_class_subgroup'

export type MinutesPerDay = 10 | 15 | 20 | 30

export type DurationDays = 5 | 10 | 15 | 20

export type SupportNeed = 'el_support' | 'iep_504' | 'behavior_support' | 'gifted_extension'

export type Difficulty = 'standard' | 'easier' | 'more_rigorous'

export interface SprintContext {
  grade: string
  subject: string
  topicOrSkill: string
  groupType: GroupType
  mainConcern: string
  evidence: string
  minutesPerDay: MinutesPerDay
  durationDays: DurationDays
  supportNeeds: SupportNeed[]
  expectedGoal: string
}

export interface DailyActionItem {
  day: number
  phase: string
  focus: string
  activity: string
  teacherMove: string
  minutes: number
}

export interface DifferentiationItem {
  label: string
  adjustment: string
}

export interface ProgressMonitoringCheckpoint {
  day: number
  method: string
  lookFor: string
}

export interface SprintPlanSections {
  problemSummary: string
  interventionGoal: string
  dailyActionPlan: DailyActionItem[]
  differentiation: DifferentiationItem[]
  progressMonitoring: ProgressMonitoringCheckpoint[]
  teacherGuidance: string[]
  familyCommunication: string
  adminSummary: string
}

export interface SprintPlan {
  id: string
  createdAt: string
  updatedAt: string
  context: SprintContext
  difficulty: Difficulty
  elSupportAdded: boolean
  sections: SprintPlanSections
}

export const SECTION_LABELS: Record<keyof SprintPlanSections, string> = {
  problemSummary: 'Problem summary',
  interventionGoal: 'Intervention goal',
  dailyActionPlan: 'Daily action plan',
  differentiation: 'Differentiation',
  progressMonitoring: 'Progress monitoring',
  teacherGuidance: 'Teacher guidance',
  familyCommunication: 'Family communication',
  adminSummary: 'Admin / MTSS summary',
}

export const SECTION_ORDER: (keyof SprintPlanSections)[] = [
  'problemSummary',
  'interventionGoal',
  'dailyActionPlan',
  'differentiation',
  'progressMonitoring',
  'teacherGuidance',
  'familyCommunication',
  'adminSummary',
]

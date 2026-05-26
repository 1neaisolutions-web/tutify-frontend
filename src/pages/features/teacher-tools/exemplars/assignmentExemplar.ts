import { newDemoId } from '../demo/newDemoId'
import type { AssignmentBriefTopicStub } from '../demo/generationFromSources'
import type { TeacherToolExemplarPack } from './types'

export type AssignmentExemplarInput = {
  title: string
  subject: string
  grade: string
  assignmentType: string
  dueAt: string
  studentInstructions: string
  rigorProfile: string
  topicCount: number
  difficulty: 'foundation' | 'standard' | 'challenge'
  generatorInstructions: string
  generateWithoutSources: boolean
  bookIds: string[]
  topics: string[]
  scopeRefinement: string
}

export type AssignmentExemplarOutput = {
  topics: AssignmentBriefTopicStub[]
}

export const ASSIGNMENT_EXEMPLAR: TeacherToolExemplarPack<AssignmentExemplarInput, AssignmentExemplarOutput> = {
  label: 'Ecosystem case study brief',
  input: {
    title: 'Human impact on ecosystems — research brief',
    subject: 'Science',
    grade: 'Grade 8',
    assignmentType: 'Structured response',
    dueAt: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    studentInstructions:
      'Submit a single document with cited sources. Use the success criteria checklist provided.',
    rigorProfile: 'Standard',
    topicCount: 3,
    difficulty: 'standard',
    generatorInstructions: 'Include cause-effect reasoning and one feasible intervention per topic.',
    generateWithoutSources: false,
    bookIds: ['book-bio-cambridge-10'],
    topics: ['Biodiversity', 'Human activity', 'Conservation'],
    scopeRefinement: 'Case-study lens on deforestation and habitat loss in tropical regions.',
  },
  output: {
    topics: [
      {
        id: newDemoId('asg-topic'),
        title: 'Deforestation drivers',
        lines: [
          { id: newDemoId('asg-line'), text: 'Objective — Explain two economic drivers of deforestation in your assigned region.' },
          { id: newDemoId('asg-line'), text: 'Task — Annotate a map showing land-use change 2000–2020 with three cited facts.' },
          { id: newDemoId('asg-line'), text: 'Check — Success criteria: accurate citations, clear cause-effect links.' },
        ],
      },
      {
        id: newDemoId('asg-topic'),
        title: 'Species impact',
        lines: [
          { id: newDemoId('asg-line'), text: 'Objective — Describe how habitat loss affects one keystone species.' },
          { id: newDemoId('asg-line'), text: 'Task — Build a simple food-web diagram before/after disturbance.' },
        ],
      },
      {
        id: newDemoId('asg-topic'),
        title: 'Intervention trade-offs',
        lines: [
          { id: newDemoId('asg-line'), text: 'Objective — Evaluate one conservation intervention with evidence.' },
          { id: newDemoId('asg-line'), text: 'Task — Write a short recommendation paragraph with pros and cons.' },
        ],
      },
    ],
  },
}

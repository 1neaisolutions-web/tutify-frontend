import { useState } from 'react'
import { FileText, Sparkles, RefreshCw, Download } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { GradeSelect } from '@/components/shared/GradeSelect'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { subjectToTemplateLabel } from '@/catalog/adapters/subjectAdapters'
import { gradeToNumeric } from '@/catalog/adapters/gradeAdapters'
type ProjectFormat =
  | 'poster'
  | 'presentation'
  | 'prototype'
  | 'digital_report'
  | 'video'

type OutputFormat = 'structured_json' | 'markdown' | 'teacher_friendly_text'

interface PblInputs {
  grade: string
  subject: string
  secondary_subjects: string[]
  driving_question: string
  duration: string
  real_world_context: boolean
  team_size: number | ''
  project_format: ProjectFormat | ''
  learning_objectives: string[]
  assessment_focus: string[]
  differentiation_needed: boolean
  language: string
  output_format: OutputFormat | ''
}

interface PblOutput {
  title: string
  grade: number
  subject: string
  duration: string
  driving_question: string
  summary: string
  project_format?: string
  real_world_context?: string
  phases: {
    name: string
    focus: string
    teacher_actions: string[]
    student_tasks: string[]
  }[]
  resources: {
    required: string[]
    suggested: string[]
  }
  assessment_plan: {
    checkpoints: string[]
    final_product: string
    focus_areas?: string[]
  }
  differentiation?: {
    support: string[]
    extension: string[]
  }
  reflection_prompts: string[]
}

const samplePblPlan: PblOutput = {
  title: 'Waste Reduction Action Project',
  grade: 8,
  subject: 'Science',
  duration: 'P3W',
  driving_question: 'How can we reduce waste in our school community?',
  summary:
    'Students investigate current waste practices, collect data, and design actionable solutions to reduce waste within the school.',
  project_format: 'presentation',
  real_world_context:
    'Partners with the school facilities team to implement viable waste reduction strategies.',
  phases: [
    {
      name: 'Launch & Inquiry',
      focus: 'Build curiosity and establish project purpose',
      teacher_actions: [
        'Host a project launch event featuring a guest speaker from local waste management.',
        'Facilitate brainstorming around existing waste challenges in the school.',
        'Guide students in forming essential questions and assigning roles.',
      ],
      student_tasks: [
        'Capture initial ideas in project journals.',
        'Form teams based on interests and assign responsibilities.',
        'Draft investigation plans outlining data to collect.',
      ],
    },
    {
      name: 'Research & Investigation',
      focus: 'Collect data and analyze findings',
      teacher_actions: [
        'Provide data collection tools and modeling of data logging methods.',
        'Meet with teams for formative feedback on research progress.',
        'Connect students with community partners for interviews or facility tours.',
      ],
      student_tasks: [
        'Conduct waste audits in designated areas and summarize data.',
        'Interview stakeholders to understand current challenges and constraints.',
        'Synthesize findings into visual summaries for peer feedback.',
      ],
    },
    {
      name: 'Design & Prototype',
      focus: 'Develop solutions and plan implementation',
      teacher_actions: [
        'Facilitate design thinking workshops to refine ideas.',
        'Provide checkpoints to review feasibility and impact.',
        'Support teams in aligning solutions with school policies.',
      ],
      student_tasks: [
        'Ideate potential solutions and select one to develop.',
        'Create prototypes or action plans with budget and timeline.',
        'Prepare presentations outlining solution impact and next steps.',
      ],
    },
    {
      name: 'Share & Reflect',
      focus: 'Present solutions and evaluate learning',
      teacher_actions: [
        'Organize a showcase event with authentic audience members.',
        'Lead reflection sessions connecting learning to standards.',
        'Facilitate feedback collection from stakeholders.',
      ],
      student_tasks: [
        'Present final solutions to peers, teachers, and community members.',
        'Gather feedback and outline revisions or implementation plans.',
        'Reflect individually on collaboration, research, and solution development.',
      ],
    },
  ],
  resources: {
    required: ['Project journals', 'Data collection sheets', 'Presentation materials'],
    suggested: ['Digital collaboration tools', 'Access to recycling facility', 'Community mentor contacts'],
  },
  assessment_plan: {
    checkpoints: [
      'Initial project proposal outlining goals and roles',
      'Investigation findings summary with data visualizations',
      'Prototype or solution pitch feedback form',
    ],
    final_product: 'Final presentation to stakeholders with actionable solution plan',
    focus_areas: ['collaboration', 'research', 'creativity', 'presentation'],
  },
  differentiation: {
    support: [
      'Provide research graphic organizers and question stems.',
      'Offer mini-lessons on data interpretation and presentation skills.',
    ],
    extension: [
      'Challenge teams to conduct cost-benefit analysis for proposed solutions.',
      'Invite advanced learners to produce a community education campaign.',
    ],
  },
  reflection_prompts: [
    'What evidence best supports your proposed solution?',
    'How did your team leverage individual strengths during the project?',
    'What would you do differently if given more time or resources?',
  ],
}

const ProjectBasedLearningPlanner = () => {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState<PblInputs>({
    grade: '8',
    subject: 'science',
    secondary_subjects: ['Math'],
    driving_question: 'How can we reduce waste in our school?',
    duration: 'P3W',
    real_world_context: true,
    team_size: 4,
    project_format: 'presentation',
    learning_objectives: [
      'Apply scientific inquiry to analyze real-world problems.',
      'Collaborate effectively within a project team.',
    ],
    assessment_focus: ['collaboration', 'research', 'presentation'],
    differentiation_needed: true,
    language: 'en-GB',
    output_format: 'teacher_friendly_text',
  })

  const [currentSecondarySubject, setCurrentSecondarySubject] = useState('')
  const [currentObjective, setCurrentObjective] = useState('')
  const [currentAssessment, setCurrentAssessment] = useState('')
  const [output, setOutput] = useState<PblOutput | null>(samplePblPlan)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof PblInputs>(field: K, value: PblInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddItem = (
    value: string,
    field: 'secondary_subjects' | 'learning_objectives' | 'assessment_focus'
  ) => {
    if (value.trim()) {
      handleInputChange(field, [...inputs[field], value.trim()])
    }
  }

  const handleRemoveItem = (
    index: number,
    field: 'secondary_subjects' | 'learning_objectives' | 'assessment_focus'
  ) => {
    handleInputChange(
      field,
      inputs[field].filter((_, i) => i !== index)
    )
  }

  const generatePblPlan = () => {
    if (!inputs.grade || !inputs.subject || !inputs.driving_question || !inputs.duration) {
      alert('Please fill all required fields (Grade, Subject, Driving Question, Duration)')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: PblOutput = {
        title: inputs.driving_question,
        grade: gradeToNumeric(inputs.grade) ?? 1,
        subject: subjectToTemplateLabel(inputs.subject),
        duration: inputs.duration,
        driving_question: inputs.driving_question,
        summary: `Students engage in a project-based learning experience centered on "${inputs.driving_question}". Over the course of ${
          inputs.duration
        }, they will collaborate to research, design, and present solutions connected to the core subject.`,
        project_format: inputs.project_format || undefined,
        real_world_context: inputs.real_world_context
          ? 'Connects learning to a relevant local or community issue to increase authenticity.'
          : undefined,
        phases: [
          {
            name: 'Launch & Define',
            focus: 'Introduce project and clarify expectations',
            teacher_actions: [
              'Introduce the driving question with an engaging provocation.',
              'Co-create success criteria with students.',
              'Support teams in drafting project charters that define roles and milestones.',
            ],
            student_tasks: [
              'Develop initial hypotheses or solution pathways.',
              'Identify prior knowledge and questions to investigate.',
              'Establish team norms and workflow plans.',
            ],
          },
          {
            name: 'Investigation',
            focus: 'Research and gather evidence',
            teacher_actions: [
              'Provide resource lists and check for understanding during mini-lessons.',
              'Conference with teams to monitor progress and redirect as needed.',
              'Model how to evaluate source credibility.',
            ],
            student_tasks: [
              'Collect data, conduct interviews, or experiment as appropriate.',
              'Document findings in shared research logs.',
              'Synthesize evidence to refine solution ideas.',
            ],
          },
          {
            name: 'Creation',
            focus: 'Prototype and develop final product',
            teacher_actions: [
              'Facilitate peer feedback protocols using rubric-aligned criteria.',
              'Offer targeted workshops on skills such as data visualization or storytelling.',
              'Ensure differentiation supports are provided where needed.',
            ],
            student_tasks: [
              'Iterate on prototypes based on feedback and checkpoints.',
              'Prepare final deliverables aligned to the selected project format.',
              'Organize evidence to justify proposed solutions.',
            ],
          },
          {
            name: 'Sharing & Reflection',
            focus: 'Present learning and evaluate impact',
            teacher_actions: [
              'Coordinate final presentation logistics with authentic audience members.',
              'Guide students through reflective discussions connecting learning to standards.',
              'Collect feedback to inform future iterations of the project.',
            ],
            student_tasks: [
              'Deliver final presentations or products to peers and stakeholders.',
              'Reflect on collaboration, problem-solving, and subject area insights.',
              'Develop next-step recommendations or action plans.',
            ],
          },
        ],
        resources: {
          required: ['Project planning templates', 'Research materials', 'Presentation tools'],
          suggested: [
            'Community expert contacts',
            'Digital collaboration platform',
            'Access to multimedia creation tools',
          ],
        },
        assessment_plan: {
          checkpoints: [
            'Project proposal outlining goals, roles, and timeline',
            'Mid-project progress check aligned to learning objectives',
            'Draft product review with peer feedback',
          ],
          final_product: `Final ${
            inputs.project_format || 'presentation'
          } demonstrating understanding and recommended solutions.`,
          focus_areas:
            inputs.assessment_focus.length > 0 ? inputs.assessment_focus : undefined,
        },
        differentiation: inputs.differentiation_needed
          ? {
              support: [
                'Offer scaffolded research organizers and sentence frames.',
                'Provide flexible deadlines or alternative product options as needed.',
              ],
              extension: [
                'Encourage advanced learners to lead community outreach or develop implementation plans.',
                'Invite teams to publish findings in a digital space or partner newsletter.',
              ],
            }
          : undefined,
        reflection_prompts: [
          'Which collaboration strategies helped your team succeed?',
          'How did research evidence shape your final product?',
          'Where do you see opportunities to extend this project beyond the classroom?',
        ],
      }

      setOutput(mockOutput)
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 min-h-16 lg:min-h-20 py-3 lg:py-4 flex items-center justify-between mb-6 relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{t('projectBasedLearningPlanner.projectBasedLearningPlanner')}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{t('projectBasedLearningPlanner.designAuthenticPblExperiencesWithStructuredPhasesAndAss')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>{t('projectBasedLearningPlanner.projectInputs')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.grade2')}<span className="text-red-500">*</span>
                </label>
                <GradeSelect
                  variant="native"
                  value={String(inputs.grade ?? '')}
                  onChange={(v) => handleInputChange('grade', v)}
                  label=""
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.subject2')}<span className="text-red-500">*</span>
                </label>
                <SubjectSelect
                  variant="native"
                  context="template"
                  allowEmpty
                  emptyLabel={t('projectBasedLearningPlanner.selectSubject')}
                  value={inputs.subject}
                  onChange={(v) => handleInputChange('subject', v)}
                  label=""
                  selectClassName="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.crossCurricularLinks')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSecondarySubject}
                    onChange={(e) => setCurrentSecondarySubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddItem(currentSecondarySubject, 'secondary_subjects')
                        setCurrentSecondarySubject('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "Math", "Geography"'
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddItem(currentSecondarySubject, 'secondary_subjects')
                      setCurrentSecondarySubject('')
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.secondary_subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.secondary_subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index, 'secondary_subjects')}
                          className="hover:text-blue-900"
                          aria-label={`Remove ${subject}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.drivingQuestion2')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.driving_question}
                  onChange={(e) => handleInputChange('driving_question', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "How can we reduce waste in our school?"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.duration2')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder={t('projectBasedLearningPlanner.eGP3w')}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Use ISO 8601 duration (e.g., P3W for 3 weeks).</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="real-world-context"
                  checked={inputs.real_world_context}
                  onChange={(e) => handleInputChange('real_world_context', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="real-world-context" className="ml-2 text-sm text-gray-700">{t('projectBasedLearningPlanner.includeRealWorldContext')}</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.teamSize')}</label>
                <input
                  type="number"
                  min="1"
                  value={inputs.team_size}
                  onChange={(e) => handleInputChange('team_size', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder={t('projectBasedLearningPlanner.eG4')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.projectFormat')}</label>
                <select
                  value={inputs.project_format}
                  onChange={(e) =>
                    handleInputChange(
                      'project_format',
                      (e.target.value || '') as PblInputs['project_format']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select format (optional)</option>
                  <option value="poster">{t('projectBasedLearningPlanner.poster')}</option>
                  <option value="presentation">{t('projectBasedLearningPlanner.presentation')}</option>
                  <option value="prototype">{t('projectBasedLearningPlanner.prototype')}</option>
                  <option value="digital_report">{t('projectBasedLearningPlanner.digitalReport')}</option>
                  <option value="video">{t('projectBasedLearningPlanner.video')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.learningObjectives')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddItem(currentObjective, 'learning_objectives')
                        setCurrentObjective('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder={t('projectBasedLearningPlanner.enterLearningObjective')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddItem(currentObjective, 'learning_objectives')
                      setCurrentObjective('')
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.learning_objectives.length > 0 && (
                  <div className="space-y-2">
                    {inputs.learning_objectives.map((objective, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700"
                      >
                        <span>{objective}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index, 'learning_objectives')}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${objective}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.assessmentFocus')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentAssessment}
                    onChange={(e) => setCurrentAssessment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddItem(currentAssessment, 'assessment_focus')
                        setCurrentAssessment('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "collaboration", "research"'
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddItem(currentAssessment, 'assessment_focus')
                      setCurrentAssessment('')
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.assessment_focus.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.assessment_focus.map((focus, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {focus}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index, 'assessment_focus')}
                          className="hover:text-green-900"
                          aria-label={`Remove ${focus}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="differentiation"
                  checked={inputs.differentiation_needed}
                  onChange={(e) => handleInputChange('differentiation_needed', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="differentiation" className="ml-2 text-sm text-gray-700">{t('projectBasedLearningPlanner.includeDifferentiationPathways')}</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.language')}</label>
                <input
                  type="text"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="input-field"
                  placeholder={t('projectBasedLearningPlanner.eGEnGb')}
                />
                <p className="mt-1 text-xs text-gray-500">BCP47 format (e.g., en-GB, fr-FR).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('projectBasedLearningPlanner.outputFormat')}</label>
                <select
                  value={inputs.output_format}
                  onChange={(e) =>
                    handleInputChange(
                      'output_format',
                      (e.target.value || '') as PblInputs['output_format']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select output format (optional)</option>
                  <option value="teacher_friendly_text">{t('projectBasedLearningPlanner.teacherFriendlyText')}</option>
                  <option value="markdown">{t('projectBasedLearningPlanner.markdown')}</option>
                  <option value="structured_json">{t('projectBasedLearningPlanner.structuredJson')}</option>
                </select>
              </div>

              <button
                onClick={generatePblPlan}
                disabled={isGenerating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t('projectBasedLearningPlanner.generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('projectBasedLearningPlanner.generatePblPlan')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {output ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('projectBasedLearningPlanner.generatedPblPlan')}</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>{t('projectBasedLearningPlanner.download')}</span>
                  </button>
                  <button
                    onClick={() => setOutput(null)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('projectBasedLearningPlanner.reset')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{output.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>{t('projectBasedLearningPlanner.grade')}</strong> {output.grade}
                    </span>
                    <span>
                      <strong>{t('projectBasedLearningPlanner.subject')}</strong> {output.subject}
                    </span>
                    <span>
                      <strong>{t('projectBasedLearningPlanner.duration')}</strong> {output.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    <strong>{t('projectBasedLearningPlanner.drivingQuestion')}</strong> {output.driving_question}
                  </p>
                  <p className="mt-3 text-gray-700 text-sm">{output.summary}</p>
                  {output.project_format && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>{t('projectBasedLearningPlanner.finalFormat')}</strong> {output.project_format}
                    </p>
                  )}
                  {output.real_world_context && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>{t('projectBasedLearningPlanner.realWorldConnection')}</strong> {output.real_world_context}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('projectBasedLearningPlanner.projectPhases')}</h4>
                  <div className="space-y-4">
                    {output.phases.map((phase, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-gray-900">{phase.name}</h5>
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {phase.focus}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <h6 className="text-sm font-semibold text-gray-800 mb-1">{t('projectBasedLearningPlanner.teacherActions')}</h6>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {phase.teacher_actions.map((action, actionIndex) => (
                                <li key={actionIndex}>{action}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-semibold text-gray-800 mb-1">{t('projectBasedLearningPlanner.studentTasks')}</h6>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {phase.student_tasks.map((task, taskIndex) => (
                                <li key={taskIndex}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('projectBasedLearningPlanner.resources')}</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('projectBasedLearningPlanner.required')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.resources.required.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('projectBasedLearningPlanner.suggested')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.resources.suggested.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('projectBasedLearningPlanner.assessmentPlan')}</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('projectBasedLearningPlanner.checkpoints')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.assessment_plan.checkpoints.map((checkpoint, index) => (
                          <li key={index}>{checkpoint}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>{t('projectBasedLearningPlanner.finalProduct')}</strong> {output.assessment_plan.final_product}
                    </p>
                    {output.assessment_plan.focus_areas && (
                      <p className="text-sm text-gray-700">
                        <strong>{t('projectBasedLearningPlanner.focusAreas')}</strong> {output.assessment_plan.focus_areas.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {output.differentiation && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('projectBasedLearningPlanner.differentiation')}</h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">{t('projectBasedLearningPlanner.support')}</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.support.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">{t('projectBasedLearningPlanner.extension')}</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.extension.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('projectBasedLearningPlanner.reflectionPrompts')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.reflection_prompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('projectBasedLearningPlanner.yourPblPlanWillAppearHere')}</h3>
                <p className="text-gray-600">{t('projectBasedLearningPlanner.completeTheInputsAndSelectGeneratePblPlanToPreview')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectBasedLearningPlanner



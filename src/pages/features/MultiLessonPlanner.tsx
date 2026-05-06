import { useState } from 'react'
import { BookOpen, Sparkles, RefreshCw, Download } from 'lucide-react'

type FocusArea = 'reading' | 'writing' | 'literature' | 'language' | 'integrated'
type AssessmentType = 'essay' | 'presentation' | 'creative_writing' | 'portfolio'
type OutputFormat = 'structured_json' | 'teacher_text'

interface UnitPlanInputs {
  grade: number | ''
  unit_title: string
  duration_weeks: number | ''
  focus_area: FocusArea | ''
  learning_objectives: string[]
  core_text: string
  assessment_type: AssessmentType | ''
  differentiation_needed: boolean
  language: string
  output_format: OutputFormat | ''
}

interface LessonSequence {
  week: number
  focus: string
  key_lessons: string[]
}

interface DifferentiationPlan {
  emerging: string[]
  on_level: string[]
  advanced: string[]
}

interface UnitPlanOutput {
  unit_title: string
  grade: number
  focus_area: string
  duration_weeks: number
  overview: string
  anchor_text?: string
  learning_objectives: string[]
  weekly_sequence: LessonSequence[]
  assessment_type?: string
  assessment_overview: string
  differentiation?: DifferentiationPlan
  recommended_resources: string[]
  communication_highlights: string[]
  language?: string
}

const sampleUnitPlan: UnitPlanOutput = {
  unit_title: 'Narrative Writing: Building Characters and Conflict',
  grade: 8,
  focus_area: 'writing',
  duration_weeks: 3,
  overview:
    'Students craft original narratives that showcase well-developed characters, vivid settings, and escalating conflict leading to a meaningful resolution.',
  anchor_text: '“The Tell-Tale Heart” by Edgar Allan Poe',
  learning_objectives: [
    'Use sensory language and figurative devices to create mood.',
    'Develop coherent paragraphs that advance the plot.',
    'Employ dialogue and pacing to reveal character motivation.',
  ],
  weekly_sequence: [
    {
      week: 1,
      focus: 'Characterisation & Setting',
      key_lessons: [
        'Analyze mentor texts to identify effective character descriptions.',
        'Workshop sensory setting paragraphs with peer feedback.',
        'Mini-lesson on showing vs telling in narrative voice.',
      ],
    },
    {
      week: 2,
      focus: 'Plot Structure & Conflict',
      key_lessons: [
        'Story mountain planning session using anchor text as model.',
        'Collaborative revision of rising action scenes for pacing.',
        'Conference check-in on conflict escalation plans.',
      ],
    },
    {
      week: 3,
      focus: 'Drafting, Feedback, & Publication',
      key_lessons: [
        'Silent sustained writing to draft complete narratives.',
        'Peer review carousel with focused feedback stems.',
        'Final polish, author’s reflection, and publication celebration.',
      ],
    },
  ],
  assessment_type: 'creative_writing',
  assessment_overview:
    'Students submit a polished narrative accompanied by an author reflection detailing revisions tied to feedback.',
  differentiation: {
    emerging: [
      'Provide guided graphic organizer with sentence stems for each plot stage.',
      'Offer small-group mini-lessons on dialogue punctuation and paragraphing.',
    ],
    on_level: [
      'Use narrative checklists to self-monitor pacing and description.',
      'Embed choice boards for revision targets aligned to rubric criteria.',
    ],
    advanced: [
      'Incorporate dual perspectives or non-linear timelines for complexity.',
      'Craft author commentary comparing their narrative to the anchor text.',
    ],
  },
  recommended_resources: [
    'Narrative writing rubric aligned to grade 8 standards',
    'Anchor text anthology with mentor narrative passages',
    'Peer feedback stems for character, setting, and conflict',
  ],
  communication_highlights: [
    'Send weekly learning update to families summarizing narrative focus.',
    'Invite community authors for virtual Q&A on crafting compelling stories.',
    'Share student narratives in school newsletter or class blog.',
  ],
  language: 'en-US',
}

const MultiLessonPlanner = () => {
  const [inputs, setInputs] = useState<UnitPlanInputs>({
    grade: 8,
    unit_title: 'Narrative Writing: Building Characters and Conflict',
    duration_weeks: 3,
    focus_area: 'writing',
    learning_objectives: [...sampleUnitPlan.learning_objectives],
    core_text: 'The Tell-Tale Heart by Edgar Allan Poe',
    assessment_type: 'creative_writing',
    differentiation_needed: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [currentObjective, setCurrentObjective] = useState('')
  const [output, setOutput] = useState<UnitPlanOutput | null>(sampleUnitPlan)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof UnitPlanInputs>(
    field: K,
    value: UnitPlanInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addObjective = () => {
    if (currentObjective.trim()) {
      handleInputChange('learning_objectives', [...inputs.learning_objectives, currentObjective.trim()])
      setCurrentObjective('')
    }
  }

  const removeObjective = (index: number) => {
    handleInputChange(
      'learning_objectives',
      inputs.learning_objectives.filter((_, i) => i !== index)
    )
  }

  const generateUnitPlan = () => {
    if (!inputs.grade || !inputs.unit_title || !inputs.duration_weeks || !inputs.focus_area) {
      alert('Please complete all required fields (Grade, Unit Title, Duration Weeks, Focus Area).')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const totalWeeks = inputs.duration_weeks as number

      const mockSequence: LessonSequence[] = Array.from({ length: totalWeeks }).map((_, index) => ({
        week: index + 1,
        focus:
          index === 0
            ? 'Launch & Foundations'
            : index === totalWeeks - 1
            ? 'Synthesis & Showcase'
            : 'Skill Building & Practice',
        key_lessons: [
          `Mini-lesson tied to ${inputs.focus_area} focus for the week.`,
          'Collaborative task applying new learning in pairs or small groups.',
          'Reflection routine to capture evidence of progress.',
        ],
      }))

      const mockOutput: UnitPlanOutput = {
        unit_title: inputs.unit_title,
        grade: inputs.grade as number,
        focus_area: inputs.focus_area as string,
        duration_weeks: totalWeeks,
        overview: `This ${inputs.focus_area} unit guides grade ${inputs.grade} learners through sequenced lessons that build towards a culminating assessment.`,
        anchor_text: inputs.core_text || undefined,
        learning_objectives:
          inputs.learning_objectives.length > 0
            ? inputs.learning_objectives
            : ['Articulate key understandings related to the unit focus.'],
        weekly_sequence: mockSequence,
        assessment_type: inputs.assessment_type || undefined,
        assessment_overview:
          inputs.assessment_type === 'essay'
            ? 'Students craft a polished essay demonstrating mastery of unit skills.'
            : inputs.assessment_type === 'presentation'
            ? 'Learners deliver a presentation synthesizing unit concepts with multimedia support.'
            : inputs.assessment_type === 'creative_writing'
            ? 'Students produce a creative writing piece that showcases targeted language techniques.'
            : inputs.assessment_type === 'portfolio'
            ? 'Students compile a portfolio of artefacts with reflections linked to learning objectives.'
            : 'Students complete a culminating performance task aligned to unit goals.',
        differentiation: inputs.differentiation_needed
          ? {
              emerging: [
                'Provide scaffolded graphic organizers and sentence stems.',
                'Offer guided conference slots focusing on foundational skills.',
              ],
              on_level: [
                'Incorporate self-assessment checkpoints aligned to the rubric.',
                'Embed choices for collaboration or independent application.',
              ],
              advanced: [
                'Encourage extension projects connecting the unit to interdisciplinary themes.',
                'Invite students to mentor peers or lead mini-lessons on strengths.',
              ],
            }
          : undefined,
        recommended_resources: [
          'Unit pacing guide outlining weekly milestones',
          'Rubric aligned to unit focus and assessment type',
          'Curated articles/videos supporting focus area mini-lessons',
        ],
        communication_highlights: [
          'Share weekly learning snapshots with families or guardians.',
          'Invite feedback from students midway through the unit to adapt instruction.',
          'Celebrate culminating assessment outcomes via newsletter or class showcase.',
        ],
        language: inputs.language || undefined,
      }

      setOutput(mockOutput)
      setIsGenerating(false)
    }, 1200)
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 min-h-16 lg:min-h-20 py-3 lg:py-4 flex items-center justify-between mb-6 relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Multi-Lesson Planner</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Sequence a multi-week unit with objectives, weekly focus, and a culminating assessment
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Unit Inputs</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={inputs.grade}
                  onChange={(e) => handleInputChange('grade', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder="Enter grade (1-12)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.unit_title}
                  onChange={(e) => handleInputChange('unit_title', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "Narrative Writing: Building Characters and Conflict"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Weeks) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.duration_weeks}
                  onChange={(e) => handleInputChange('duration_weeks', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder="e.g., 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.focus_area}
                  onChange={(e) =>
                    handleInputChange('focus_area', e.target.value as UnitPlanInputs['focus_area'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select focus area</option>
                  <option value="reading">Reading</option>
                  <option value="writing">Writing</option>
                  <option value="literature">Literature</option>
                  <option value="language">Language</option>
                  <option value="integrated">Integrated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addObjective()
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "Use sensory language"'
                  />
                  <button type="button" onClick={addObjective} className="btn-primary whitespace-nowrap">
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
                          onClick={() => removeObjective(index)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Core Text</label>
                <input
                  type="text"
                  value={inputs.core_text}
                  onChange={(e) => handleInputChange('core_text', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "The Tell-Tale Heart by Edgar Allan Poe"'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                <select
                  value={inputs.assessment_type}
                  onChange={(e) =>
                    handleInputChange(
                      'assessment_type',
                      (e.target.value || '') as UnitPlanInputs['assessment_type']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select assessment type (optional)</option>
                  <option value="essay">Essay</option>
                  <option value="presentation">Presentation</option>
                  <option value="creative_writing">Creative Writing</option>
                  <option value="portfolio">Portfolio</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="differentiation-needed"
                  checked={inputs.differentiation_needed}
                  onChange={(e) => handleInputChange('differentiation_needed', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="differentiation-needed" className="ml-2 text-sm text-gray-700">
                  Include differentiation strategies
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <input
                  type="text"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="input-field"
                  placeholder="e.g., en-US"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                <select
                  value={inputs.output_format}
                  onChange={(e) =>
                    handleInputChange(
                      'output_format',
                      (e.target.value || '') as UnitPlanInputs['output_format']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select output format (optional)</option>
                  <option value="teacher_text">Teacher Text</option>
                  <option value="structured_json">Structured JSON</option>
                </select>
              </div>

              <button
                onClick={generateUnitPlan}
                disabled={isGenerating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Unit Plan</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Unit Plan</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setOutput(null)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{output.unit_title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>Grade:</strong> {output.grade}
                    </span>
                    <span>
                      <strong>Focus Area:</strong> {output.focus_area}
                    </span>
                    <span>
                      <strong>Duration:</strong> {output.duration_weeks} week(s)
                    </span>
                    {output.assessment_type && (
                      <span>
                        <strong>Assessment:</strong> {output.assessment_type.replace(/_/g, ' ')}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.overview}</p>
                  {output.anchor_text && (
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>Anchor Text:</strong> {output.anchor_text}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.learning_objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Weekly Sequence</h4>
                  <div className="space-y-4">
                    {output.weekly_sequence.map((sequence) => (
                      <div key={sequence.week} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">Week {sequence.week}</h5>
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {sequence.focus}
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {sequence.key_lessons.map((lesson, index) => (
                            <li key={index}>{lesson}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Culminating Assessment</h4>
                  <p className="text-sm text-gray-700">{output.assessment_overview}</p>
                </div>

                {output.differentiation && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Differentiation</h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Emerging Learners</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.emerging.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">On-Level Learners</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.on_level.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Advanced Learners</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.advanced.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Resources</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.recommended_resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication Highlights</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.communication_highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your unit plan will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Unit Plan" to view your multi-lesson sequence.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MultiLessonPlanner




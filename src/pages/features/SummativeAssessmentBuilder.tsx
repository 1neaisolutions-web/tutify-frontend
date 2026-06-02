import { useState } from 'react'
import { ClipboardCheck, Sparkles, RefreshCw, Download } from 'lucide-react'

import { useTranslation } from 'react-i18next'
type AssessmentSubject =
  | 'Science'
  | 'Math'
  | 'English'
  | 'Arts'
  | 'Social Studies'
  | 'Technology'
  | 'Physical Education'
  | 'Other'

type AssessmentType = 'exam' | 'performance_task' | 'project' | 'presentation'

type DifficultyLevel = 'easy' | 'moderate' | 'challenging'

interface SummativeAssessmentInputs {
  grade: number | ''
  subject: AssessmentSubject | ''
  topic: string
  assessment_type: AssessmentType | ''
  learning_objectives: string[]
  question_format: string[]
  rubric_needed: boolean
  difficulty_level: DifficultyLevel | ''
  duration: string
  language: string
}

interface AssessmentRubric {
  criteria: string
  descriptors: {
    level: string
    description: string
  }[]
}

interface AssessmentQuestion {
  type: string
  prompt: string
  expected_response?: string
  points: number
}

interface SummativeAssessmentOutput {
  title: string
  grade: number
  subject: string
  topic: string
  assessment_type: string
  duration?: string
  difficulty_level?: string
  overview: string
  learning_objectives: string[]
  structure: {
    section: string
    description: string
    weight: string
  }[]
  questions: AssessmentQuestion[]
  rubric?: AssessmentRubric[]
  teacher_notes: string[]
}

const defaultObjectives = [
  'Explain energy flow within an ecosystem.',
  'Analyze the impact of environmental changes on populations.',
]

const sampleAssessment: SummativeAssessmentOutput = {
  title: 'Ecosystems Performance Task',
  grade: 7,
  subject: 'Science',
  topic: 'Ecosystems',
  assessment_type: 'performance_task',
  duration: 'PT45M',
  difficulty_level: 'moderate',
  overview:
    'Students synthesize their understanding of ecosystems by designing an informative presentation that explains energy flow and human impact on a chosen biome.',
  learning_objectives: [...defaultObjectives],
  structure: [
    {
      section: 'Planning & Research',
      description: 'Students gather data and evidence about their selected ecosystem.',
      weight: '30%',
    },
    {
      section: 'Presentation Development',
      description: 'Teams organize findings into a visual presentation with supporting explanations.',
      weight: '40%',
    },
    {
      section: 'Presentation Delivery',
      description: 'Students present to peers and respond to audience questions.',
      weight: '30%',
    },
  ],
  questions: [
    {
      type: 'short_answer',
      prompt: 'Describe the primary source of energy in your ecosystem and how it flows between organisms.',
      expected_response:
        'Students should reference the sun (or chemical energy) and describe producer → consumer relationships.',
      points: 5,
    },
    {
      type: 'essay',
      prompt:
        'Explain how a significant environmental change would impact the balance within your chosen ecosystem.',
      expected_response:
        'Students should analyze the cascading effects on populations, food webs, and overall biodiversity.',
      points: 10,
    },
    {
      type: 'presentation',
      prompt:
        'Deliver a 5-minute presentation summarizing your ecosystem research, including visuals and recommendations for conservation.',
      points: 15,
    },
  ],
  rubric: [
    {
      criteria: 'Content Accuracy',
      descriptors: [
        { level: 'Exceeds', description: 'Information is precise, thorough, and includes insightful connections.' },
        { level: 'Meets', description: 'Information is accurate and covers required concepts.' },
        { level: 'Developing', description: 'Information has minor inaccuracies or lacks depth.' },
        { level: 'Beginning', description: 'Information is incomplete or contains major inaccuracies.' },
      ],
    },
    {
      criteria: 'Communication & Presentation',
      descriptors: [
        { level: 'Exceeds', description: 'Presentation is highly engaging, well-paced, and uses visuals effectively.' },
        { level: 'Meets', description: 'Presentation is clear and organized with appropriate visuals.' },
        { level: 'Developing', description: 'Presentation lacks clarity or relies minimally on visuals.' },
        { level: 'Beginning', description: 'Presentation is difficult to follow and visuals are missing or ineffective.' },
      ],
    },
  ],
  teacher_notes: [
    'Schedule time for peer review before the final presentation day.',
    'Coordinate space and technology needs for student presentations.',
    'Consider inviting another class or community member to serve as an authentic audience.',
  ],
}

const SummativeAssessmentBuilder = () => {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState<SummativeAssessmentInputs>({
    grade: 7,
    subject: 'Science',
    topic: 'Ecosystems',
    assessment_type: 'performance_task',
    learning_objectives: [...defaultObjectives],
    question_format: ['short_answer', 'essay', 'presentation'],
    rubric_needed: true,
    difficulty_level: 'moderate',
    duration: 'PT45M',
    language: 'en-US',
  })

  const [currentObjective, setCurrentObjective] = useState('')
  const [currentFormat, setCurrentFormat] = useState('')
  const [output, setOutput] = useState<SummativeAssessmentOutput | null>(sampleAssessment)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof SummativeAssessmentInputs>(
    field: K,
    value: SummativeAssessmentInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addListItem = (value: string, field: 'learning_objectives' | 'question_format') => {
    if (value.trim()) {
      handleInputChange(field, [...inputs[field], value.trim()])
    }
  }

  const removeListItem = (index: number, field: 'learning_objectives' | 'question_format') => {
    handleInputChange(
      field,
      inputs[field].filter((_, i) => i !== index)
    )
  }

  const generateAssessment = () => {
    if (!inputs.grade || !inputs.subject || !inputs.topic || !inputs.assessment_type) {
      alert('Please complete all required fields (Grade, Subject, Topic, Assessment Type).')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: SummativeAssessmentOutput = {
        title: `${inputs.topic} Summative Assessment`,
        grade: inputs.grade as number,
        subject: inputs.subject as string,
        topic: inputs.topic,
        assessment_type: inputs.assessment_type as string,
        duration: inputs.duration || undefined,
        difficulty_level: inputs.difficulty_level || undefined,
        overview: `This ${inputs.assessment_type} assesses student understanding of ${inputs.topic.toLowerCase()} at a grade ${
          inputs.grade
        } level. Students will demonstrate mastery through aligned tasks and questions.`,
        learning_objectives:
          inputs.learning_objectives.length > 0
            ? inputs.learning_objectives
            : ['Demonstrate understanding of key concepts.'],
        structure: [
          {
            section: 'Warm-Up & Review',
            description: 'Brief review of critical vocabulary and concepts before assessment begins.',
            weight: '10%',
          },
          {
            section: 'Core Assessment Tasks',
            description: `Primary tasks aligned to the ${inputs.assessment_type} format.`,
            weight: '70%',
          },
          {
            section: 'Reflection & Feedback',
            description: 'Students reflect on their performance and set goals for future learning.',
            weight: '20%',
          },
        ],
        questions:
          inputs.question_format.length > 0
            ? inputs.question_format.map((format, index) => ({
                type: format,
                prompt: `Prompt for ${format.replace(/_/g, ' ')}`,
                expected_response:
                  format === 'mcq'
                    ? 'Provide four answer options with one correct choice.'
                    : format === 'short_answer'
                    ? `Students respond in 2-3 sentences demonstrating understanding of ${inputs.topic.toLowerCase()}.`
                    : format === 'essay'
                    ? `Students write a detailed response analyzing or evaluating aspects of ${inputs.topic.toLowerCase()}.`
                    : format === 'diagram'
                    ? 'Students create or label a diagram representing the key concept.'
                    : format === 'practical'
                    ? 'Students complete a hands-on task demonstrating applied skills.'
                    : 'Students present their findings using the designated format.',
                points: 5 + index * 5,
              }))
            : [
                {
                  type: 'short_answer',
                  prompt: `Describe a key concept related to ${inputs.topic}.`,
                  expected_response: 'Students provide a concise explanation demonstrating understanding.',
                  points: 5,
                },
              ],
        rubric:
          inputs.rubric_needed && inputs.assessment_type !== 'exam'
            ? [
                {
                  criteria: 'Content Understanding',
                  descriptors: [
                    { level: 'Exceeds', description: 'Insightful connections and precise explanations.' },
                    { level: 'Meets', description: 'Accurate explanations covering core concepts.' },
                    { level: 'Developing', description: 'Partial understanding with minor misconceptions.' },
                    { level: 'Beginning', description: 'Limited or inaccurate understanding shown.' },
                  ],
                },
                {
                  criteria: 'Communication & Organization',
                  descriptors: [
                    { level: 'Exceeds', description: 'Ideas are organized logically with strong supporting evidence.' },
                    { level: 'Meets', description: 'Information is clear with adequate supporting details.' },
                    { level: 'Developing', description: 'Ideas lack clarity or logical flow.' },
                    { level: 'Beginning', description: 'Responses are disorganized or incomplete.' },
                  ],
                },
              ]
            : undefined,
        teacher_notes: [
          inputs.duration
            ? `Allocate approximately ${inputs.duration.replace('PT', '')} for students to complete the assessment.`
            : 'Set an appropriate time limit to ensure students can demonstrate understanding.',
          'Review the assessment criteria with students beforehand to build transparency.',
          'Plan time for post-assessment reflection and reteaching if needed.',
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
            <ClipboardCheck className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{t('summativeAssessmentBuilder.summativeAssessmentBuilder')}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{t('summativeAssessmentBuilder.craftEndOfUnitAssessmentsAlignedToLearningObjectivesAnd')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>{t('summativeAssessmentBuilder.assessmentInputs')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.grade2')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={inputs.grade}
                  onChange={(e) => handleInputChange('grade', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder={t('common.gradePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.subject2')}<span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.subject}
                  onChange={(e) =>
                    handleInputChange('subject', e.target.value as SummativeAssessmentInputs['subject'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">{t('summativeAssessmentBuilder.selectSubject')}</option>
                  <option value="Science">{t('summativeAssessmentBuilder.science')}</option>
                  <option value="Math">{t('summativeAssessmentBuilder.math')}</option>
                  <option value="English">{t('summativeAssessmentBuilder.english')}</option>
                  <option value="Arts">{t('summativeAssessmentBuilder.arts')}</option>
                  <option value="Social Studies">{t('summativeAssessmentBuilder.socialStudies')}</option>
                  <option value="Technology">{t('summativeAssessmentBuilder.technology')}</option>
                  <option value="Physical Education">{t('summativeAssessmentBuilder.physicalEducation')}</option>
                  <option value="Other">{t('summativeAssessmentBuilder.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.topic2')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "Ecosystems"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.assessmentType')}<span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.assessment_type}
                  onChange={(e) =>
                    handleInputChange(
                      'assessment_type',
                      e.target.value as SummativeAssessmentInputs['assessment_type']
                    )
                  }
                  className="input-field"
                  required
                >
                  <option value="">{t('summativeAssessmentBuilder.selectType')}</option>
                  <option value="exam">{t('summativeAssessmentBuilder.exam')}</option>
                  <option value="performance_task">{t('summativeAssessmentBuilder.performanceTask')}</option>
                  <option value="project">{t('summativeAssessmentBuilder.project')}</option>
                  <option value="presentation">{t('summativeAssessmentBuilder.presentation')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.learningObjectives')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addListItem(currentObjective, 'learning_objectives')
                        setCurrentObjective('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder={t('summativeAssessmentBuilder.enterLearningObjective')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addListItem(currentObjective, 'learning_objectives')
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
                          onClick={() => removeListItem(index, 'learning_objectives')}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.questionFormats')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentFormat}
                    onChange={(e) => setCurrentFormat(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addListItem(currentFormat, 'question_format')
                        setCurrentFormat('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "mcq", "essay"'
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addListItem(currentFormat, 'question_format')
                      setCurrentFormat('')
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.question_format.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.question_format.map((format, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {format}
                        <button
                          type="button"
                          onClick={() => removeListItem(index, 'question_format')}
                          className="hover:text-indigo-900"
                          aria-label={`Remove ${format}`}
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
                  id="rubric-needed"
                  checked={inputs.rubric_needed}
                  onChange={(e) => handleInputChange('rubric_needed', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="rubric-needed" className="ml-2 text-sm text-gray-700">{t('summativeAssessmentBuilder.generateRubric')}</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.difficultyLevel')}</label>
                <select
                  value={inputs.difficulty_level}
                  onChange={(e) =>
                    handleInputChange(
                      'difficulty_level',
                      (e.target.value || '') as SummativeAssessmentInputs['difficulty_level']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select level (optional)</option>
                  <option value="easy">{t('summativeAssessmentBuilder.easy')}</option>
                  <option value="moderate">{t('summativeAssessmentBuilder.moderate')}</option>
                  <option value="challenging">{t('summativeAssessmentBuilder.challenging')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.duration2')}</label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder={t('summativeAssessmentBuilder.eGPt40m')}
                />
                <p className="mt-1 text-xs text-gray-500">Use ISO 8601 duration (e.g., PT40M).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('summativeAssessmentBuilder.language')}</label>
                <input
                  type="text"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="input-field"
                  placeholder={t('summativeAssessmentBuilder.eGEnUs')}
                />
              </div>

              <button
                onClick={generateAssessment}
                disabled={isGenerating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t('summativeAssessmentBuilder.generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('summativeAssessmentBuilder.generateAssessment')}</span>
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
                <h2 className="text-lg font-semibold text-gray-900">{t('summativeAssessmentBuilder.generatedAssessmentPlan')}</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>{t('summativeAssessmentBuilder.download')}</span>
                  </button>
                  <button
                    onClick={() => setOutput(null)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('summativeAssessmentBuilder.reset')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{output.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>{t('summativeAssessmentBuilder.grade')}</strong> {output.grade}
                    </span>
                    <span>
                      <strong>{t('summativeAssessmentBuilder.subject')}</strong> {output.subject}
                    </span>
                    <span>
                      <strong>{t('summativeAssessmentBuilder.topic')}</strong> {output.topic}
                    </span>
                    <span>
                      <strong>{t('summativeAssessmentBuilder.type')}</strong> {output.assessment_type}
                    </span>
                    {output.duration && (
                      <span>
                        <strong>{t('summativeAssessmentBuilder.duration')}</strong> {output.duration}
                      </span>
                    )}
                    {output.difficulty_level && (
                      <span>
                        <strong>{t('summativeAssessmentBuilder.difficulty')}</strong> {output.difficulty_level}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.overview}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('summativeAssessmentBuilder.learningObjectives')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.learning_objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('summativeAssessmentBuilder.assessmentStructure')}</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    {output.structure.map((section, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-gray-900">{section.section}</h5>
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {section.weight}
                          </span>
                        </div>
                        <p>{section.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('summativeAssessmentBuilder.questionSet')}</h4>
                  <div className="space-y-3">
                    {output.questions.map((question, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-800 capitalize">
                            {question.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {question.points} pts
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{question.prompt}</p>
                        {question.expected_response && (
                          <p className="mt-2 text-xs text-gray-500">
                            <strong>{t('summativeAssessmentBuilder.expectedResponse')}</strong> {question.expected_response}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {output.rubric && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('summativeAssessmentBuilder.rubric')}</h4>
                    <div className="space-y-4">
                      {output.rubric.map((criteria, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{criteria.criteria}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                            {criteria.descriptors.map((descriptor, descriptorIndex) => (
                              <div key={descriptorIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="font-semibold text-gray-800">{descriptor.level}</p>
                                <p className="mt-1 text-sm text-gray-600">{descriptor.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('summativeAssessmentBuilder.teacherNotes')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.teacher_notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('summativeAssessmentBuilder.yourAssessmentPlanWillAppearHere')}</h3>
                <p className="text-gray-600">{t('summativeAssessmentBuilder.completeTheInputsAndSelectGenerateAssessmentToPreviewTh')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SummativeAssessmentBuilder



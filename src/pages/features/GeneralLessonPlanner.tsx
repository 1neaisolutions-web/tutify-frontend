import { useState } from 'react'
import { FileText, Sparkles, Download, RefreshCw } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { GradeSelect } from '@/components/shared/GradeSelect'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { subjectToTemplateLabel } from '@/catalog/adapters/subjectAdapters'
import { gradeToNumeric } from '@/catalog/adapters/gradeAdapters'
interface LessonPlanInputs {
  grade: string
  subject: string
  topic: string
  duration: string
  curriculum_profile: string
  learning_objectives: string[]
  prior_knowledge: string
  teaching_method: string
  differentiation_needed: boolean
  materials_available: string[]
  student_grouping: string
  language: string
  tone_preference: string
  output_format: string
}

interface LessonPlanOutput {
  title: string
  grade: number
  subject: string
  duration: string
  cognitive_level: string
  framework: string
  learning_objectives: string[]
  lesson_flow: {
    section: string
    time: string
    activities: string[]
  }[]
  assessment_plan: {
    formative: string[]
    summative: string[]
  }
  differentiation?: {
    emerging: string[]
    advanced: string[]
  }
  reflection_extensions: string[]
}

const sampleLessonPlan: LessonPlanOutput = {
  title: 'Exploring Photosynthesis',
  grade: 5,
  subject: 'Science',
  duration: 'PT45M',
  cognitive_level: 'Analyze',
  framework: "Bloom's Taxonomy",
  learning_objectives: [
    'Explain how plants use sunlight to produce energy.',
    'Identify the main parts of a plant involved in photosynthesis.',
  ],
  lesson_flow: [
    {
      section: 'Introduction',
      time: '10 min',
      activities: [
        '🎬 Engage: Show a short video comparing plants in sunlight and shade.',
        '💬 Ask: "What do you think plants eat?"',
      ],
    },
    {
      section: 'Main Activity',
      time: '25 min',
      activities: [
        '🔬 Explore: Students use leaf cutouts to trace how sunlight enters the plant.',
        '🧑‍🏫 Explain: Demonstrate the photosynthesis equation visually.',
      ],
    },
    {
      section: 'Closure',
      time: '10 min',
      activities: [
        '✏️ Reflect: Students summarize photosynthesis in one sentence.',
        '✅ Assessment: Exit ticket question.',
      ],
    },
  ],
  assessment_plan: {
    formative: ['Teacher observation checklist', 'Exit ticket'],
    summative: ['Short quiz - "Identify plant parts involved in photosynthesis."'],
  },
  differentiation: {
    emerging: ['Use diagrams and flashcards for vocabulary support.'],
    advanced: ['Design a mini-experiment testing light intensity on plants.'],
  },
  reflection_extensions: [
    'What surprised you about how plants make food?',
    'Grow a small plant at home and track sunlight exposure vs growth.',
  ],
}

const GeneralLessonPlanner = () => {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState<LessonPlanInputs>({
    grade: '5',
    subject: 'science',
    topic: 'Photosynthesis',
    duration: 'PT45M',
    curriculum_profile: 'US_COMMON_CORE',
    learning_objectives: [...sampleLessonPlan.learning_objectives],
    prior_knowledge: 'Students know that plants need sunlight and water to grow.',
    teaching_method: 'inquiry_based',
    differentiation_needed: true,
    materials_available: ['notebooks', 'chart paper', 'internet'],
    student_grouping: 'groups_of_4',
    language: 'en-US',
    tone_preference: 'teacher_friendly',
    output_format: 'teacher_friendly_text',
  })

  const [currentObjective, setCurrentObjective] = useState('')
  const [currentMaterial, setCurrentMaterial] = useState('')
  const [output, setOutput] = useState<LessonPlanOutput | null>(sampleLessonPlan)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (
    field: keyof LessonPlanInputs,
    value: string | number | boolean | string[]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addObjective = () => {
    if (currentObjective.trim()) {
      handleInputChange('learning_objectives', [
        ...inputs.learning_objectives,
        currentObjective.trim(),
      ])
      setCurrentObjective('')
    }
  }

  const removeObjective = (index: number) => {
    handleInputChange(
      'learning_objectives',
      inputs.learning_objectives.filter((_, i) => i !== index)
    )
  }

  const addMaterial = () => {
    if (currentMaterial.trim()) {
      handleInputChange('materials_available', [
        ...inputs.materials_available,
        currentMaterial.trim(),
      ])
      setCurrentMaterial('')
    }
  }

  const removeMaterial = (index: number) => {
    handleInputChange(
      'materials_available',
      inputs.materials_available.filter((_, i) => i !== index)
    )
  }

  const generateLessonPlan = async () => {
    // Validate required fields
    if (!inputs.grade || !inputs.subject || !inputs.topic || !inputs.duration) {
      alert('Please fill in all required fields (Grade, Subject, Topic, Duration)')
      return
    }

    setIsGenerating(true)

    // TODO: Replace with actual API call
    // Simulate API call
    setTimeout(() => {
      const mockOutput: LessonPlanOutput = {
        title: `Exploring ${inputs.topic}`,
        grade: gradeToNumeric(inputs.grade) ?? 1,
        subject: subjectToTemplateLabel(inputs.subject),
        duration: inputs.duration,
        cognitive_level: 'Analyze',
        framework: 'Bloom\'s Taxonomy',
        learning_objectives: inputs.learning_objectives.length > 0
          ? inputs.learning_objectives
          : [`Understand ${inputs.topic}`],
        lesson_flow: [
          {
            section: 'Introduction',
            time: '10 min',
            activities: [
              '🎬 Engage: Show a short video related to the topic',
              `💬 Ask: "What do you know about ${inputs.topic}?"`,
            ],
          },
          {
            section: 'Main Activity',
            time: '25 min',
            activities: [
              '🔬 Explore: Hands-on activity related to the topic',
              '🧑‍🏫 Explain: Demonstrate key concepts visually',
            ],
          },
          {
            section: 'Closure',
            time: '10 min',
            activities: [
              '✏️ Reflect: Students summarize key learnings',
              '✅ Assessment: Exit ticket question',
            ],
          },
        ],
        assessment_plan: {
          formative: ['Teacher observation checklist', 'Exit ticket'],
          summative: [`Short quiz on ${inputs.topic}`],
        },
        differentiation: inputs.differentiation_needed
          ? {
              emerging: ['Use diagrams and flashcards for vocabulary support'],
              advanced: ['Design a mini-experiment or extension activity'],
            }
          : undefined,
        reflection_extensions: [
          `What surprised you about ${inputs.topic}?`,
          'Extension activity for home or further exploration',
        ],
      }

      setOutput(mockOutput)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 min-h-16 lg:min-h-20 py-3 lg:py-4 flex items-center justify-between mb-6 relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{t('generalLessonPlanner.generalLessonPlanner')}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{t('generalLessonPlanner.createComprehensiveLessonPlansWithLearningObjectivesAnd')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>{t('generalLessonPlanner.lessonDetails')}</span>
            </h2>

            <div className="space-y-4">
              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.grade2')}<span className="text-red-500">*</span>
                </label>
                <GradeSelect
                  variant="native"
                  value={String(inputs.grade ?? '')}
                  onChange={(v) => handleInputChange('grade', v)}
                  label=""
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.subject2')}<span className="text-red-500">*</span>
                </label>
                <SubjectSelect
                  variant="native"
                  context="template"
                  allowEmpty
                  emptyLabel={t('generalLessonPlanner.selectSubject')}
                  value={inputs.subject}
                  onChange={(v) => handleInputChange('subject', v)}
                  label=""
                  selectClassName="input-field"
                  required
                />
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.topic')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input-field"
                  placeholder={t('generalLessonPlanner.eGPhotosynthesis')}
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.duration2')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder={t('generalLessonPlanner.eGPt45mOr45Minutes')}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  ISO 8601 format (e.g., PT45M) or simple format (e.g., 45 minutes)
                </p>
              </div>

              {/* Curriculum Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.curriculumProfile')}</label>
                <select
                  value={inputs.curriculum_profile}
                  onChange={(e) => handleInputChange('curriculum_profile', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select curriculum (optional)</option>
                  <option value="US_COMMON_CORE">{t('generalLessonPlanner.usCommonCore')}</option>
                  <option value="CBSE_IN">CBSE (India)</option>
                  <option value="ACARA_AU">ACARA (Australia)</option>
                  <option value="UK_NATIONAL">{t('generalLessonPlanner.ukNationalCurriculum')}</option>
                </select>
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.learningObjectives')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                    className="input-field flex-1"
                    placeholder={t('generalLessonPlanner.enterLearningObjective')}
                  />
                  <button
                    type="button"
                    onClick={addObjective}
                    className="btn-primary whitespace-nowrap"
                  >{t('generalLessonPlanner.add')}</button>
                </div>
                {inputs.learning_objectives.length > 0 && (
                  <div className="space-y-2">
                    {inputs.learning_objectives.map((obj, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{obj}</span>
                        <button
                          type="button"
                          onClick={() => removeObjective(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span className="text-sm">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prior Knowledge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.priorKnowledge')}</label>
                <textarea
                  value={inputs.prior_knowledge}
                  onChange={(e) => handleInputChange('prior_knowledge', e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder={t('generalLessonPlanner.whatDoStudentsAlreadyKnowAboutThisTopic')}
                />
              </div>

              {/* Teaching Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.teachingMethod')}</label>
                <select
                  value={inputs.teaching_method}
                  onChange={(e) => handleInputChange('teaching_method', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select method (optional)</option>
                  <option value="inquiry_based">{t('generalLessonPlanner.inquiryBased')}</option>
                  <option value="direct_instruction">{t('generalLessonPlanner.directInstruction')}</option>
                  <option value="project_based">{t('generalLessonPlanner.projectBased')}</option>
                  <option value="cooperative_learning">{t('generalLessonPlanner.cooperativeLearning')}</option>
                </select>
              </div>

              {/* Differentiation Needed */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="differentiation"
                  checked={inputs.differentiation_needed}
                  onChange={(e) => handleInputChange('differentiation_needed', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="differentiation" className="ml-2 text-sm text-gray-700">{t('generalLessonPlanner.includeDifferentiationStrategies')}</label>
              </div>

              {/* Materials Available */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.materialsAvailable')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentMaterial}
                    onChange={(e) => setCurrentMaterial(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                    className="input-field flex-1"
                    placeholder={t('generalLessonPlanner.eGNotebooksChartPaper')}
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="btn-primary whitespace-nowrap"
                  >{t('generalLessonPlanner.add')}</button>
                </div>
                {inputs.materials_available.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.materials_available.map((material, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {material}
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Grouping */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.studentGrouping')}</label>
                <select
                  value={inputs.student_grouping}
                  onChange={(e) => handleInputChange('student_grouping', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select grouping (optional)</option>
                  <option value="whole_class">{t('generalLessonPlanner.wholeClass')}</option>
                  <option value="pairs">{t('generalLessonPlanner.pairs')}</option>
                  <option value="groups_of_4">{t('generalLessonPlanner.groupsOf4')}</option>
                  <option value="individual">{t('generalLessonPlanner.individual')}</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.language')}</label>
                <input
                  type="text"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="input-field"
                  placeholder={t('generalLessonPlanner.eGEnUs')}
                />
                <p className="mt-1 text-xs text-gray-500">BCP47 format (e.g., en-US, fr-FR)</p>
              </div>

              {/* Tone Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.tonePreference')}</label>
                <select
                  value={inputs.tone_preference}
                  onChange={(e) => handleInputChange('tone_preference', e.target.value)}
                  className="input-field"
                >
                  <option value="teacher_friendly">{t('generalLessonPlanner.teacherFriendly')}</option>
                  <option value="formal">{t('generalLessonPlanner.formal')}</option>
                  <option value="friendly">{t('generalLessonPlanner.friendly')}</option>
                  <option value="creative">{t('generalLessonPlanner.creative')}</option>
                  <option value="academic">{t('generalLessonPlanner.academic')}</option>
                </select>
              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('generalLessonPlanner.outputFormat')}</label>
                <select
                  value={inputs.output_format}
                  onChange={(e) => handleInputChange('output_format', e.target.value)}
                  className="input-field"
                >
                  <option value="teacher_friendly_text">{t('generalLessonPlanner.teacherFriendlyText')}</option>
                  <option value="structured_json">{t('generalLessonPlanner.structuredJson')}</option>
                  <option value="markdown">{t('generalLessonPlanner.markdown')}</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateLessonPlan}
                disabled={isGenerating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t('generalLessonPlanner.generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('generalLessonPlanner.generateLessonPlan')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Display */}
        <div className="space-y-6">
          {output ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('generalLessonPlanner.generatedLessonPlan')}</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>{t('generalLessonPlanner.download')}</span>
                  </button>
                  <button
                    onClick={() => setOutput(null)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('generalLessonPlanner.newPlan')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{output.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>{t('generalLessonPlanner.grade')}</strong> {output.grade}
                    </span>
                    <span>
                      <strong>{t('generalLessonPlanner.subject')}</strong> {output.subject}
                    </span>
                    <span>
                      <strong>{t('generalLessonPlanner.duration')}</strong> {output.duration}
                    </span>
                    <span>
                      <strong>{t('generalLessonPlanner.cognitiveLevel')}</strong> {output.cognitive_level}
                    </span>
                    <span>
                      <strong>{t('generalLessonPlanner.framework')}</strong> {output.framework}
                    </span>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('generalLessonPlanner.learningObjectives')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {output.learning_objectives.map((obj, index) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Flow */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('generalLessonPlanner.lessonFlow')}</h4>
                  <div className="space-y-4">
                    {output.lesson_flow.map((section, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{section.section}</h5>
                          <span className="text-sm text-gray-500">{section.time}</span>
                        </div>
                        <ul className="space-y-1">
                          {section.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="text-gray-700 text-sm">
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Plan */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('generalLessonPlanner.assessmentPlan')}</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">{t('generalLessonPlanner.formative')}</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {output.assessment_plan.formative.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">{t('generalLessonPlanner.summative')}</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {output.assessment_plan.summative.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Differentiation */}
                {output.differentiation && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('generalLessonPlanner.differentiation')}</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">{t('generalLessonPlanner.emergingLearners')}</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {output.differentiation.emerging.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">{t('generalLessonPlanner.advancedLearners')}</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {output.differentiation.advanced.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reflection & Extensions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('generalLessonPlanner.reflectionExtensions')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {output.reflection_extensions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('generalLessonPlanner.yourLessonPlanWillAppearHere')}</h3>
                <p className="text-gray-600">{t('generalLessonPlanner.fillInTheFormOnTheLeftAndClickGenerate')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneralLessonPlanner


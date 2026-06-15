import { useState } from 'react'
import { FlaskConical, Sparkles, RefreshCw, Download } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { GradeSelect } from '@/components/shared/GradeSelect'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { subjectToTemplateLabel } from '@/catalog/adapters/subjectAdapters'
import { gradeToNumeric } from '@/catalog/adapters/gradeAdapters'
type ActivityType =
  | 'experiment'
  | 'engineering_challenge'
  | 'simulation'
  | 'investigation'
type LabAccess = 'none' | 'basic' | 'full'
type OutputFormat = 'structured_json' | 'markdown' | 'teacher_text'

interface StemActivityInputs {
  grade: string
  subject: string
  topic: string
  duration: string
  activity_type: ActivityType | ''
  available_materials: string[]
  lab_access: LabAccess | ''
  safety_constraints: string[]
  learning_objectives: string[]
  real_world_context: boolean
  differentiation_needed: boolean
  language: string
  output_format: OutputFormat | ''
}

interface StemActivityOutput {
  title: string
  grade: number
  subject: string
  duration: string
  summary: string
  activity_type?: string
  setup_steps: string[]
  activity_steps: string[]
  materials: {
    must_have: string[]
    nice_to_have: string[]
  }
  safety_notes: string[]
  differentiation?: {
    support: string[]
    extension: string[]
  }
  real_world_connection?: string
  assessment: {
    formative: string[]
    summative: string[]
  }
  extensions: string[]
}

const sampleActivity: StemActivityOutput = {
  title: 'Designing a Catapult to Explore Forces',
  grade: 7,
  subject: 'Science',
  duration: 'PT60M',
  summary:
    'Students investigate the relationship between force, distance, and motion by designing and testing tabletop catapults.',
  activity_type: 'engineering_challenge',
  setup_steps: [
    'Prepare materials stations with craft sticks, rubber bands, bottle caps, and tape.',
    'Arrange lab groups of 3–4 students and distribute planning templates.',
    'Review safety expectations for launching objects in the classroom.',
  ],
  activity_steps: [
    'Engage: Discuss real-world applications of catapults and how engineers optimize designs.',
    'Explore: Teams design and build a catapult that launches a cotton ball at least two meters.',
    'Explain: Students measure launch distances, record data, and connect results to force and motion concepts.',
    'Evaluate: Groups reflect on design iterations and present findings to the class.',
  ],
  materials: {
    must_have: ['craft sticks', 'rubber bands', 'spoons or bottle caps', 'tape', 'cotton balls'],
    nice_to_have: ['protractors', 'rulers', 'masking tape for launch zones'],
  },
  safety_notes: [
    'Launch only soft projectiles (cotton balls) and ensure a clear area in front of the device.',
    'Wear protective eyewear if available and stand behind the launch line during testing.',
  ],
  differentiation: {
    support: [
      'Provide pre-cut templates and visual build guides for groups needing additional structure.',
      'Allow extended build time or pair with a mentor student for design troubleshooting.',
    ],
    extension: [
      'Challenge groups to calculate average launch distances and graph results.',
      'Invite advanced teams to test variable arm lengths and analyze how it affects force and range.',
    ],
  },
  real_world_connection:
    'Connects to modern engineering fields where launching mechanisms are used in disaster relief, sports technology, and aerospace.',
  assessment: {
    formative: [
      'Teacher observation checklist focusing on collaboration and application of force vocabulary.',
      'Exit ticket prompting students to explain how changing force impacts motion.',
    ],
    summative: [
      'Lab report summarizing design process, test data, and reflection on improvements.',
    ],
  },
  extensions: [
    'Students create a digital presentation comparing their design to historical siege engines.',
    'Assign a reflective journaling prompt on how engineers iterate to solve real-world problems.',
  ],
}

const StemActivityGenerator = () => {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState<StemActivityInputs>({
    grade: '7',
    subject: 'science',
    topic: 'Forces and Motion',
    duration: 'PT60M',
    activity_type: 'engineering_challenge',
    available_materials: [...sampleActivity.materials.must_have],
    lab_access: 'basic',
    safety_constraints: ['no sharp projectiles', 'launch in designated zone'],
    learning_objectives: [
      'Explain how applied force influences the motion of an object.',
      'Collect and analyze data from repeated trials to improve a design.',
    ],
    real_world_context: true,
    differentiation_needed: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [currentMaterial, setCurrentMaterial] = useState('')
  const [currentSafety, setCurrentSafety] = useState('')
  const [currentObjective, setCurrentObjective] = useState('')
  const [output, setOutput] = useState<StemActivityOutput | null>(sampleActivity)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof StemActivityInputs>(
    field: K,
    value: StemActivityInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddToArray = (value: string, field: 'available_materials' | 'safety_constraints' | 'learning_objectives') => {
    if (value.trim()) {
      handleInputChange(field, [...inputs[field], value.trim()])
    }
  }

  const handleRemoveFromArray = (
    index: number,
    field: 'available_materials' | 'safety_constraints' | 'learning_objectives'
  ) => {
    handleInputChange(
      field,
      inputs[field].filter((_, i) => i !== index)
    )
  }

  const generateActivity = async () => {
    if (!inputs.grade || !inputs.subject || !inputs.topic || !inputs.duration) {
      alert('Please fill in all required fields (Grade, Subject, Topic, Duration)')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: StemActivityOutput = {
        title: `${inputs.topic} STEM Challenge`,
        grade: gradeToNumeric(inputs.grade) ?? 1,
        subject: subjectToTemplateLabel(inputs.subject),
        duration: inputs.duration,
        summary: `Students engage in a ${
          inputs.activity_type || 'STEM'
        } activity that deepens understanding of ${inputs.topic.toLowerCase()}.`,
        activity_type: inputs.activity_type || undefined,
        setup_steps: [
          'Organize materials and review the learning objectives with the class.',
          inputs.lab_access && inputs.lab_access !== 'none'
            ? `Confirm that the ${inputs.lab_access} lab resources are ready for student use.`
            : 'Set up a classroom station with the available materials.',
          'Highlight safety expectations before students begin planning.',
        ],
        activity_steps: [
          `Engage: Introduce the challenge by connecting ${inputs.topic.toLowerCase()} to a real-world scenario.`,
          'Explore: Students prototype, test, and iterate on their designs while recording observations.',
          'Explain: Facilitate a class discussion to surface the science/engineering concepts in action.',
          'Evaluate: Teams synthesize findings and propose improvements based on data collected.',
        ],
        materials: {
          must_have:
            inputs.available_materials.length > 0
              ? inputs.available_materials
              : ['Common classroom supplies'],
          nice_to_have:
            inputs.lab_access === 'full'
              ? ['Advanced lab tools', 'Data logging sensors']
              : ['Stopwatch', 'Measurement tools'],
        },
        safety_notes:
          inputs.safety_constraints.length > 0
            ? inputs.safety_constraints
            : ['Review general lab safety expectations before beginning.'],
        differentiation: inputs.differentiation_needed
          ? {
              support: [
                'Offer visual planning guides and sentence stems for reflection.',
                'Provide check-in points with guiding questions for groups needing coaching.',
              ],
              extension: [
                'Challenge learners to quantify results and present findings with supporting data.',
                'Encourage exploration of an additional variable or constraint.',
              ],
            }
          : undefined,
        real_world_connection: inputs.real_world_context
          ? `Connect the activity to how ${subjectToTemplateLabel(inputs.subject).toLowerCase()} professionals leverage ${inputs.topic.toLowerCase()} in authentic settings.`
          : undefined,
        assessment: {
          formative: [
            'Teacher walkthrough notes capturing collaboration and concept use.',
            'Exit ticket prompting students to explain a key insight from their testing.',
          ],
          summative: [
            'Student reflection or mini-report summarizing their design decisions and outcomes.',
          ],
        },
        extensions: [
          'Invite students to document their process in a short video or slide deck.',
          'Assign an optional research prompt linking the challenge to a STEM career.',
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
            <FlaskConical className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{t('stemActivityGenerator.stemActivityGenerator')}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{t('stemActivityGenerator.craftEngagingStemChallengesTailoredToYourClassroomConte')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>{t('stemActivityGenerator.activityInputs')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.grade2')}<span className="text-red-500">*</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.subject2')}<span className="text-red-500">*</span>
                </label>
                <SubjectSelect
                  variant="native"
                  context="template"
                  allowEmpty
                  emptyLabel={t('stemActivityGenerator.selectSubject')}
                  value={inputs.subject}
                  onChange={(v) => handleInputChange('subject', v)}
                  label=""
                  selectClassName="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.topic')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input-field"
                  placeholder={t('stemActivityGenerator.eGForcesAndMotion')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.duration2')}<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder={t('stemActivityGenerator.eGPt60m')}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Use ISO 8601 (e.g., PT60M).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.activityType')}</label>
                <select
                  value={inputs.activity_type}
                  onChange={(e) =>
                    handleInputChange(
                      'activity_type',
                      (e.target.value || '') as StemActivityInputs['activity_type']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select activity type (optional)</option>
                  <option value="experiment">{t('stemActivityGenerator.experiment')}</option>
                  <option value="engineering_challenge">{t('stemActivityGenerator.engineeringChallenge')}</option>
                  <option value="simulation">{t('stemActivityGenerator.simulation')}</option>
                  <option value="investigation">{t('stemActivityGenerator.investigation')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.availableMaterials')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentMaterial}
                    onChange={(e) => setCurrentMaterial(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddToArray(currentMaterial, 'available_materials')
                        setCurrentMaterial('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder={t('stemActivityGenerator.eGStringRulerTape')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToArray(currentMaterial, 'available_materials')
                      setCurrentMaterial('')
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.available_materials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.available_materials.map((material, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {material}
                        <button
                          type="button"
                          onClick={() => handleRemoveFromArray(index, 'available_materials')}
                          className="hover:text-blue-900"
                          aria-label={`Remove ${material}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.labAccess')}</label>
                <select
                  value={inputs.lab_access}
                  onChange={(e) =>
                    handleInputChange(
                      'lab_access',
                      (e.target.value || '') as StemActivityInputs['lab_access']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select lab access (optional)</option>
                  <option value="none">{t('stemActivityGenerator.none')}</option>
                  <option value="basic">{t('stemActivityGenerator.basic')}</option>
                  <option value="full">{t('stemActivityGenerator.full')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.safetyConstraints')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSafety}
                    onChange={(e) => setCurrentSafety(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddToArray(currentSafety, 'safety_constraints')
                        setCurrentSafety('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder={t('stemActivityGenerator.eGNoChemicals')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToArray(currentSafety, 'safety_constraints')
                      setCurrentSafety('')
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.safety_constraints.length > 0 && (
                  <div className="space-y-2">
                    {inputs.safety_constraints.map((constraint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700"
                      >
                        <span>{constraint}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromArray(index, 'safety_constraints')}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${constraint}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.learningObjectives')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddToArray(currentObjective, 'learning_objectives')
                        setCurrentObjective('')
                      }
                    }}
                    className="input-field flex-1"
                    placeholder={t('stemActivityGenerator.enterLearningObjective')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToArray(currentObjective, 'learning_objectives')
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
                          onClick={() => handleRemoveFromArray(index, 'learning_objectives')}
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="real-world-context"
                  checked={inputs.real_world_context}
                  onChange={(e) => handleInputChange('real_world_context', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="real-world-context" className="ml-2 text-sm text-gray-700">{t('stemActivityGenerator.connectToRealWorldContext')}</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="differentiation"
                  checked={inputs.differentiation_needed}
                  onChange={(e) => handleInputChange('differentiation_needed', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="differentiation" className="ml-2 text-sm text-gray-700">{t('stemActivityGenerator.includeDifferentiationSupports')}</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.language')}</label>
                <input
                  type="text"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="input-field"
                  placeholder={t('stemActivityGenerator.eGEnUs')}
                />
                <p className="mt-1 text-xs text-gray-500">BCP47 format (e.g., en-US).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('stemActivityGenerator.outputFormat')}</label>
                <select
                  value={inputs.output_format}
                  onChange={(e) =>
                    handleInputChange(
                      'output_format',
                      (e.target.value || '') as StemActivityInputs['output_format']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select output format (optional)</option>
                  <option value="teacher_text">{t('stemActivityGenerator.teacherText')}</option>
                  <option value="markdown">{t('stemActivityGenerator.markdown')}</option>
                  <option value="structured_json">{t('stemActivityGenerator.structuredJson')}</option>
                </select>
              </div>

              <button
                onClick={generateActivity}
                disabled={isGenerating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t('stemActivityGenerator.generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('stemActivityGenerator.generateStemActivity')}</span>
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
                <h2 className="text-lg font-semibold text-gray-900">{t('stemActivityGenerator.generatedActivityPlan')}</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>{t('stemActivityGenerator.download')}</span>
                  </button>
                  <button
                    onClick={() => setOutput(null)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('stemActivityGenerator.reset')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{output.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>{t('stemActivityGenerator.grade')}</strong> {output.grade}
                    </span>
                    <span>
                      <strong>{t('stemActivityGenerator.subject')}</strong> {output.subject}
                    </span>
                    <span>
                      <strong>{t('stemActivityGenerator.duration')}</strong> {output.duration}
                    </span>
                    {output.activity_type && (
                      <span>
                        <strong>{t('stemActivityGenerator.type')}</strong> {output.activity_type}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.summary}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.setupSteps')}</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {output.setup_steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.activityFlow')}</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {output.activity_steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.materials')}</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('stemActivityGenerator.mustHave')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.materials.must_have.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('stemActivityGenerator.niceToHave')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.materials.nice_to_have.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.safetyNotes')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.safety_notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>

                {output.differentiation && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.differentiation')}</h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">{t('stemActivityGenerator.support')}</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.support.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">{t('stemActivityGenerator.extension')}</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {output.differentiation.extension.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {output.real_world_connection && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.realWorldConnection')}</h4>
                    <p className="text-sm text-gray-700">{output.real_world_connection}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.assessment')}</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('stemActivityGenerator.formative')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.assessment.formative.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">{t('stemActivityGenerator.summative')}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.assessment.summative.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.extensions')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.extensions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('stemActivityGenerator.yourStemActivityWillAppearHere')}</h3>
                <p className="text-gray-600">{t('stemActivityGenerator.completeTheInputsAndSelectGenerateStemActivityToPreview')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StemActivityGenerator




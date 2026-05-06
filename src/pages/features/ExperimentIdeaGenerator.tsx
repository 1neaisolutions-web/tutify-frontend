import { useState } from 'react'
import { FlaskConical, Sparkles, RefreshCw, Download } from 'lucide-react'

type LabAccess = 'none' | 'basic' | 'full'
type Difficulty = 'easy' | 'moderate' | 'challenging'
type OutputFormat = 'structured_json' | 'teacher_text'

interface ExperimentInputs {
  grade: number | ''
  topic: string
  subtopic: string
  available_materials: string[]
  lab_access: LabAccess | ''
  difficulty: Difficulty | ''
  duration: string
  learning_objective: string
  safety_focus: boolean
  language: string
  output_format: OutputFormat | ''
}

interface ExperimentStep {
  description: string
  tips?: string
}

interface ExperimentIdeaOutput {
  title: string
  grade: number
  topic: string
  subtopic?: string
  duration?: string
  difficulty?: string
  lab_access?: string
  learning_objective?: string
  overview: string
  materials: string[]
  safety_notes?: string[]
  procedure: ExperimentStep[]
  data_collection: string[]
  reflection_questions: string[]
  extension_ideas: string[]
  language?: string
}

const sampleExperiment: ExperimentIdeaOutput = {
  title: 'Photosynthesis Light Intensity Investigation',
  grade: 6,
  topic: 'photosynthesis',
  subtopic: 'light intensity',
  duration: 'PT30M',
  difficulty: 'moderate',
  lab_access: 'basic',
  learning_objective: 'Investigate how varying light intensity affects plant growth indicators.',
  overview:
    'Students explore the relationship between light intensity and photosynthesis by measuring oxygen bubble production in aquatic plants exposed to different light levels.',
  materials: ['Aquatic plants (elodea)', 'Lamps with adjustable distance', 'Timer', 'Ruler', 'Beaker'],
  safety_notes: [
    'Remind students to avoid touching hot bulbs and unplug equipment after use.',
    'Ensure water spills are cleaned promptly to prevent slipping.',
  ],
  procedure: [
    {
      description: 'Set up beakers with aquatic plants and ensure each lamp is positioned at a different distance.',
      tips: 'Label each station with its distance to keep data organized.',
    },
    {
      description: 'Allow plants to acclimate for 2 minutes, then count oxygen bubbles released in 60 seconds.',
      tips: 'Use multiple timers to keep each group on schedule.',
    },
    {
      description: 'Record data and repeat measurements twice for reliability.',
    },
  ],
  data_collection: [
    'Use a table to record bubble counts for each distance (low, medium, high light).',
    'Calculate the average bubble count for each light level.',
  ],
  reflection_questions: [
    'How did bubble production change with light intensity?',
    'What might this suggest about plant energy use?',
  ],
  extension_ideas: [
    'Introduce different colored filters to test light wavelength effects.',
    'Have students design a simple experiment for home using houseplants and sunlight exposure.',
  ],
  language: 'en-US',
}

const ExperimentIdeaGenerator = () => {
  const [inputs, setInputs] = useState<ExperimentInputs>({
    grade: 6,
    topic: 'photosynthesis',
    subtopic: 'light intensity',
    available_materials: ['plants', 'foil', 'thermometer', 'beaker'],
    lab_access: 'basic',
    difficulty: 'moderate',
    duration: 'PT30M',
    learning_objective: 'Investigate how light affects plant growth',
    safety_focus: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [currentMaterial, setCurrentMaterial] = useState('')
  const [output, setOutput] = useState<ExperimentIdeaOutput | null>(sampleExperiment)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof ExperimentInputs>(
    field: K,
    value: ExperimentInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addMaterial = () => {
    if (currentMaterial.trim()) {
      handleInputChange('available_materials', [...inputs.available_materials, currentMaterial.trim()])
      setCurrentMaterial('')
    }
  }

  const removeMaterial = (index: number) => {
    handleInputChange(
      'available_materials',
      inputs.available_materials.filter((_, i) => i !== index)
    )
  }

  const generateExperiment = () => {
    if (!inputs.grade || !inputs.topic) {
      alert('Please provide Grade and Topic to generate an experiment idea.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const materials =
        inputs.available_materials.length > 0
          ? inputs.available_materials
          : ['Household items or lab resources as available']

      const mockOutput: ExperimentIdeaOutput = {
        title: `${inputs.topic} Exploration`,
        grade: inputs.grade as number,
        topic: inputs.topic,
        subtopic: inputs.subtopic || undefined,
        duration: inputs.duration || undefined,
        difficulty: inputs.difficulty || undefined,
        lab_access: inputs.lab_access || undefined,
        learning_objective: inputs.learning_objective || undefined,
        overview: `Students conduct an investigation into ${inputs.topic}, collecting evidence to support scientific explanations.`,
        materials,
        safety_notes:
          inputs.safety_focus && inputs.lab_access !== 'none'
            ? [
                'Review lab safety rules before starting the experiment.',
                'Ensure students wear protective gear appropriate to the materials used.',
              ]
            : undefined,
        procedure: [
          {
            description: 'Introduce the investigation question and review experiment setup.',
            tips: 'Model how to record observations accurately.',
          },
          {
            description: 'Conduct the experiment in pairs or small groups, monitoring variables carefully.',
            tips: 'Rotate roles so each student collects data and assists with setup.',
          },
          {
            description: 'Analyze the results and prepare a short explanation connecting findings to prior knowledge.',
          },
        ],
        data_collection: [
          'Use a data table to capture quantitative or qualitative observations.',
          'Encourage students to note anomalies or unexpected results.',
        ],
        reflection_questions: [
          'What patterns did you notice in your data?',
          'How does this experiment help explain the concept of ' + inputs.topic + '?',
        ],
        extension_ideas: [
          'Design a follow-up experiment changing one variable at a time.',
          'Connect findings to a real-world problem or current event related to the topic.',
        ],
        language: inputs.language || undefined,
      }

      setOutput(mockOutput)
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 min-h-16 lg:min-h-20 py-3 lg:py-4 flex items-center justify-between mb-6 relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Experiment Idea Generator</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Generate hands-on science investigations aligned to your classroom resources
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Experiment Inputs</span>
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
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "photosynthesis"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtopic</label>
                <input
                  type="text"
                  value={inputs.subtopic}
                  onChange={(e) => handleInputChange('subtopic', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "light intensity"'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Materials
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentMaterial}
                    onChange={(e) => setCurrentMaterial(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addMaterial()
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "plants"'
                  />
                  <button type="button" onClick={addMaterial} className="btn-primary whitespace-nowrap">
                    Add
                  </button>
                </div>
                {inputs.available_materials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.available_materials.map((material, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {material}
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="hover:text-green-900"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Access</label>
                <select
                  value={inputs.lab_access}
                  onChange={(e) =>
                    handleInputChange('lab_access', (e.target.value || '') as ExperimentInputs['lab_access'])
                  }
                  className="input-field"
                >
                  <option value="">Select lab access (optional)</option>
                  <option value="none">None</option>
                  <option value="basic">Basic</option>
                  <option value="full">Full</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={inputs.difficulty}
                  onChange={(e) =>
                    handleInputChange(
                      'difficulty',
                      (e.target.value || '') as ExperimentInputs['difficulty']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select difficulty (optional)</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder="e.g., PT30M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objective
                </label>
                <input
                  type="text"
                  value={inputs.learning_objective}
                  onChange={(e) => handleInputChange('learning_objective', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "investigate how light affects plant growth"'
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="safety-focus"
                  checked={inputs.safety_focus}
                  onChange={(e) => handleInputChange('safety_focus', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="safety-focus" className="ml-2 text-sm text-gray-700">
                  Include safety notes
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
                      (e.target.value || '') as ExperimentInputs['output_format']
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
                onClick={generateExperiment}
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
                    <span>Generate Experiment Idea</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Idea</h2>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{output.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>Grade:</strong> {output.grade}
                    </span>
                    <span>
                      <strong>Topic:</strong> {output.topic}
                    </span>
                    {output.subtopic && (
                      <span>
                        <strong>Subtopic:</strong> {output.subtopic}
                      </span>
                    )}
                    {output.duration && (
                      <span>
                        <strong>Duration:</strong> {output.duration}
                      </span>
                    )}
                    {output.difficulty && (
                      <span>
                        <strong>Difficulty:</strong> {output.difficulty}
                      </span>
                    )}
                    {output.lab_access && (
                      <span>
                        <strong>Lab Access:</strong> {output.lab_access}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.overview}</p>
                  {output.learning_objective && (
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>Learning Objective:</strong> {output.learning_objective}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>

                {output.safety_notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Safety Notes</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {output.safety_notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Procedure</h4>
                  <div className="space-y-3">
                    {output.procedure.map((step, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{step.description}</p>
                        {step.tips && (
                          <p className="mt-1 text-xs text-gray-500">
                            <strong>Tip:</strong> {step.tips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Collection</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.data_collection.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reflection Questions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.reflection_questions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Extension Ideas</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.extension_ideas.map((idea, index) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your experiment idea will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Experiment Idea" to view the investigation plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExperimentIdeaGenerator




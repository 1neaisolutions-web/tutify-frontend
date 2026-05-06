import { useState } from 'react'
import { ListChecks, Sparkles, RefreshCw, Download } from 'lucide-react'

type LearningFocus = 'knowledge' | 'skills' | 'application' | 'investigation'
type Difficulty = 'easy' | 'moderate' | 'advanced'
type OutputFormat = 'structured_json' | 'teacher_text'

interface LearningIntentionInputs {
  grade: number | ''
  topic: string
  curriculum_standard: string
  learning_focus: LearningFocus | ''
  duration: string
  difficulty: Difficulty | ''
  language: string
  output_format: OutputFormat | ''
}

interface LearningIntentionOutput {
  title: string
  grade: number
  topic: string
  curriculum_standard?: string
  learning_focus?: string
  duration?: string
  difficulty?: string
  language?: string
  overview: string
  success_criteria: string[]
  teacher_moves: string[]
  student_actions: string[]
  checks_for_understanding: string[]
  differentiation_tips: string[]
}

const sampleBreakdown: LearningIntentionOutput = {
  title: 'Learning Intention Breakdown: Forces and Motion',
  grade: 8,
  topic: 'Forces and Motion',
  curriculum_standard: 'Describe the relationship between force, mass, and acceleration (Newton’s Second Law).',
  learning_focus: 'application',
  duration: 'PT40M',
  difficulty: 'moderate',
  overview:
    'Students will apply Newton’s Second Law to predict how changes in mass and force influence acceleration in real-world contexts.',
  success_criteria: [
    'Explain Newton’s Second Law using correct vocabulary.',
    'Calculate acceleration when given mass and force.',
    'Justify predictions about motion using data or diagrams.',
  ],
  teacher_moves: [
    'Launch with a quick demo showing carts moving with varying weights.',
    'Model how to set up F = ma calculations, highlighting units.',
    'Circulate to prompt deeper thinking with “what if” questions.',
  ],
  student_actions: [
    'Record observations from the demo and connect them to prior knowledge.',
    'Solve structured practice problems in partners, comparing strategies.',
    'Create a visual showing how force, mass, and acceleration relate.',
  ],
  checks_for_understanding: [
    'Quick whiteboard response: “If force doubles and mass stays the same, what happens to acceleration?”',
    'Exit ticket requiring students to solve a novel scenario and explain the result.',
  ],
  differentiation_tips: [
    'Provide scaffolded calculation templates for emerging learners.',
    'Offer challenge problems that incorporate friction or more complex systems.',
  ],
  language: 'en-US',
}

const LearningIntentionBreakdown = () => {
  const [inputs, setInputs] = useState<LearningIntentionInputs>({
    grade: 8,
    topic: 'Forces and Motion',
    curriculum_standard:
      'Describe the relationship between force, mass, and acceleration (Newton’s Second Law).',
    learning_focus: 'application',
    duration: 'PT40M',
    difficulty: 'moderate',
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [output, setOutput] = useState<LearningIntentionOutput | null>(sampleBreakdown)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof LearningIntentionInputs>(
    field: K,
    value: LearningIntentionInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const generateBreakdown = () => {
    if (!inputs.grade || !inputs.topic) {
      alert('Please complete the required fields (Grade and Topic).')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const focusText = inputs.learning_focus
        ? ` with a focus on ${inputs.learning_focus.replace(/_/g, ' ')}`
        : ''

      const mockOutput: LearningIntentionOutput = {
        title: `Learning Intention Breakdown: ${inputs.topic}`,
        grade: inputs.grade as number,
        topic: inputs.topic,
        curriculum_standard: inputs.curriculum_standard || undefined,
        learning_focus: inputs.learning_focus || undefined,
        duration: inputs.duration || undefined,
        difficulty: inputs.difficulty || undefined,
        language: inputs.language || undefined,
        overview: `Students deepen understanding of ${inputs.topic}${focusText}, demonstrating proficiency through targeted success criteria.`,
        success_criteria: [
          `Describe key concepts related to ${inputs.topic} using precise vocabulary.`,
          'Apply the learning intention in a guided practice scenario.',
          'Communicate reasoning using appropriate representations or evidence.',
        ],
        teacher_moves: [
          'Activate prior knowledge with a quick diagnostic prompt.',
          'Model exemplar responses or problem-solving steps, highlighting misconceptions to avoid.',
          'Facilitate guided practice with embedded checks for understanding.',
        ],
        student_actions: [
          'Engage in guided or collaborative practice tasks tied to the learning intention.',
          'Track progress toward success criteria using self-assessment tools.',
          'Explain thinking to peers, referencing the learning intention language.',
        ],
        checks_for_understanding: [
          'Use exit tickets or digital polls to capture individual mastery.',
          'Listen for accurate use of key terms during partner discussions.',
        ],
        differentiation_tips: [
          'Provide sentence stems or graphic organizers for learners who need structure.',
          'Encourage advanced learners to extend concepts into real-world or cross-curricular contexts.',
        ],
      }

      setOutput(mockOutput)
      setIsGenerating(false)
    }, 900)
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 min-h-16 lg:min-h-20 py-3 lg:py-4 flex items-center justify-between mb-6 relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ListChecks className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Learning Intention Breakdown</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Translate standards into clear success criteria and instructional moves
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Learning Intention Inputs</span>
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
                  placeholder='e.g., "Ecosystems"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Standard</label>
                <textarea
                  value={inputs.curriculum_standard}
                  onChange={(e) => handleInputChange('curriculum_standard', e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder='e.g., "Describe the relationship between force, mass, and acceleration..."'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Focus</label>
                <select
                  value={inputs.learning_focus}
                  onChange={(e) =>
                    handleInputChange(
                      'learning_focus',
                      (e.target.value || '') as LearningIntentionInputs['learning_focus']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select focus (optional)</option>
                  <option value="knowledge">Knowledge</option>
                  <option value="skills">Skills</option>
                  <option value="application">Application</option>
                  <option value="investigation">Investigation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder="e.g., PT40M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={inputs.difficulty}
                  onChange={(e) =>
                    handleInputChange('difficulty', (e.target.value || '') as LearningIntentionInputs['difficulty'])
                  }
                  className="input-field"
                >
                  <option value="">Select difficulty (optional)</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="advanced">Advanced</option>
                </select>
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
                      (e.target.value || '') as LearningIntentionInputs['output_format']
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
                onClick={generateBreakdown}
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
                    <span>Generate Breakdown</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Breakdown</h2>
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
                    {output.learning_focus && (
                      <span>
                        <strong>Focus:</strong> {output.learning_focus.replace(/_/g, ' ')}
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
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.overview}</p>
                  {output.curriculum_standard && (
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>Curriculum Standard:</strong> {output.curriculum_standard}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Success Criteria</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.success_criteria.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Teacher Moves</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.teacher_moves.map((move, index) => (
                      <li key={index}>{move}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Student Actions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.student_actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Checks for Understanding</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.checks_for_understanding.map((check, index) => (
                      <li key={index}>{check}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Differentiation Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.differentiation_tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <ListChecks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your breakdown will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Breakdown" to see the learning intention details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearningIntentionBreakdown




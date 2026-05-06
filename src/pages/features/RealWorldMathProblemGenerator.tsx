import { useState } from 'react'
import { Calculator, Sparkles, RefreshCw, Download } from 'lucide-react'

type MathDomain =
  | 'algebra'
  | 'geometry'
  | 'measurement'
  | 'statistics'
  | 'number_operations'
  | 'percentages'

type Difficulty = 'easy' | 'moderate' | 'challenging'
type OutputFormat = 'structured_json' | 'teacher_text'

interface ProblemGeneratorInputs {
  grade: number | ''
  math_domain: MathDomain | ''
  topic: string
  context: string
  difficulty: Difficulty | ''
  problem_count: number | ''
  include_solution_steps: boolean
  real_world_alignment: boolean
  language: string
  output_format: OutputFormat | ''
}

interface GeneratedProblem {
  title: string
  prompt: string
  answer: string
  solution_steps?: string[]
  alignment_notes?: string
}

interface ProblemSetOutput {
  grade: number
  math_domain: string
  topic: string
  context?: string
  difficulty?: string
  language?: string
  overview: string
  problems: GeneratedProblem[]
  tips_for_instruction: string[]
  extension_ideas: string[]
}

const sampleProblemSet: ProblemSetOutput = {
  grade: 7,
  math_domain: 'percentages',
  topic: 'Speed, Distance, Time',
  context: 'travel',
  difficulty: 'moderate',
  overview:
    'Students solve real-world travel scenarios involving speed, distance, and time, interpreting unit rates and proportional reasoning.',
  problems: [
    {
      title: 'City Commute Challenge',
      prompt:
        'Sasha bikes 15 miles to school in 1 hour and 15 minutes. If she wants to cut her commute time to under an hour, what average speed must she maintain?',
      answer: 'She must average at least 15 mph.',
      solution_steps: [
        'Convert 1 hour 15 minutes to 1.25 hours.',
        'Use speed = distance ÷ time: 15 miles ÷ 1 hour = 15 mph.',
        'To complete within 1 hour, she must maintain 15 mph or higher.',
      ],
      alignment_notes: 'Connects to unit rates and proportional reasoning in motion contexts.',
    },
    {
      title: 'Weekend Road Trip',
      prompt:
        'A family drives 192 miles at an average speed of 48 mph. If they want to arrive 30 minutes earlier, what average speed should they target?',
      answer: 'They need to travel at approximately 57.6 mph.',
      solution_steps: [
        'Current time: 192 ÷ 48 = 4 hours.',
        'New target time: 4 hours - 0.5 hours = 3.5 hours.',
        'Required speed: 192 ÷ 3.5 ≈ 54.9 mph (students compare and adjust).',
      ],
    },
  ],
  tips_for_instruction: [
    'Use maps or navigation apps to visualize distances and travel times.',
    'Encourage students to annotate problem statements highlighting given and unknown quantities.',
    'Discuss how changes in speed affect time and fuel consumption to reinforce proportional thinking.',
  ],
  extension_ideas: [
    'Have students design their own travel scenario using a local transit map.',
    'Introduce multi-leg trips requiring conversions between units (minutes ↔ hours).',
  ],
  language: 'en-US',
}

const RealWorldMathProblemGenerator = () => {
  const [inputs, setInputs] = useState<ProblemGeneratorInputs>({
    grade: 7,
    math_domain: 'algebra',
    topic: 'Speed, distance, time',
    context: 'travel',
    difficulty: 'moderate',
    problem_count: 5,
    include_solution_steps: true,
    real_world_alignment: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [output, setOutput] = useState<ProblemSetOutput | null>(sampleProblemSet)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof ProblemGeneratorInputs>(
    field: K,
    value: ProblemGeneratorInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const generateProblems = () => {
    if (!inputs.grade || !inputs.math_domain || !inputs.topic) {
      alert('Please complete Grade, Math Domain, and Topic to generate problems.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const count = inputs.problem_count || 5
      const problems: GeneratedProblem[] = Array.from({ length: count }).map((_, index) => ({
        title: `Scenario ${index + 1}`,
        prompt: `Create a real-world ${inputs.context || 'everyday'} situation involving ${
          inputs.topic
        } for grade ${inputs.grade} students.`,
        answer: 'Provide a worked answer here.',
        solution_steps: inputs.include_solution_steps
          ? [
              'Identify known quantities from the scenario.',
              'Determine the mathematical relationship needed.',
              'Solve step-by-step showing calculations and units.',
            ]
          : undefined,
        alignment_notes: inputs.real_world_alignment
          ? 'Ensure data mirrors realistic measures and student experiences.'
          : undefined,
      }))

      const mockOutput: ProblemSetOutput = {
        grade: inputs.grade as number,
        math_domain: inputs.math_domain,
        topic: inputs.topic,
        context: inputs.context || undefined,
        difficulty: inputs.difficulty || undefined,
        language: inputs.language || undefined,
        overview: `Problem set targeting ${inputs.math_domain.replace(/_/g, ' ')} skills with ${
          inputs.topic
        } scenarios for grade ${inputs.grade}.`,
        problems,
        tips_for_instruction: [
          'Preview vocabulary or measurement units before diving into problems.',
          'Encourage students to model the situation using diagrams or tables.',
          'Prompt learners to justify solutions using complete sentences.',
        ],
        extension_ideas: [
          'Invite students to collect real data and create similar problems.',
          'Integrate technology tools (spreadsheets or graphing apps) for deeper exploration.',
        ],
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
            <Calculator className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Real-World Math Problem Generator</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Generate contextualized math problems with realistic data and optional solution steps
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Problem Inputs</span>
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
                  Math Domain <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.math_domain}
                  onChange={(e) =>
                    handleInputChange('math_domain', e.target.value as ProblemGeneratorInputs['math_domain'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select domain</option>
                  <option value="algebra">Algebra</option>
                  <option value="geometry">Geometry</option>
                  <option value="measurement">Measurement</option>
                  <option value="statistics">Statistics</option>
                  <option value="number_operations">Number Operations</option>
                  <option value="percentages">Percentages</option>
                </select>
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
                  placeholder='e.g., "speed, distance, time"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                <select
                  value={inputs.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select context (optional)</option>
                  <option value="travel">Travel</option>
                  <option value="shopping">Shopping</option>
                  <option value="sports">Sports</option>
                  <option value="environment">Environment</option>
                  <option value="construction">Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={inputs.difficulty}
                  onChange={(e) =>
                    handleInputChange('difficulty', (e.target.value || '') as ProblemGeneratorInputs['difficulty'])
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={inputs.problem_count}
                  onChange={(e) => handleInputChange('problem_count', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder="Default is 5"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="solution-steps"
                  checked={inputs.include_solution_steps}
                  onChange={(e) => handleInputChange('include_solution_steps', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="solution-steps" className="ml-2 text-sm text-gray-700">
                  Include solution steps
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="real-world-alignment"
                  checked={inputs.real_world_alignment}
                  onChange={(e) => handleInputChange('real_world_alignment', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="real-world-alignment" className="ml-2 text-sm text-gray-700">
                  Ensure real-world authenticity
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
                      (e.target.value || '') as ProblemGeneratorInputs['output_format']
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
                onClick={generateProblems}
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
                    <span>Generate Problem Set</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Problem Set</h2>
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>Grade:</strong> {output.grade}
                    </span>
                    <span>
                      <strong>Domain:</strong> {output.math_domain.replace(/_/g, ' ')}
                    </span>
                    <span>
                      <strong>Topic:</strong> {output.topic}
                    </span>
                    {output.context && (
                      <span>
                        <strong>Context:</strong> {output.context}
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
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Problems</h4>
                  <div className="space-y-4">
                    {output.problems.map((problem, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-1">
                          {problem.title || `Problem ${index + 1}`}
                        </h5>
                        <p className="text-sm text-gray-800">{problem.prompt}</p>
                        <p className="mt-2 text-sm text-gray-700">
                          <strong>Answer:</strong> {problem.answer}
                        </p>
                        {problem.solution_steps && (
                          <div className="mt-3">
                            <h6 className="text-xs font-semibold text-gray-600 uppercase">
                              Solution Steps
                            </h6>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                              {problem.solution_steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {problem.alignment_notes && (
                          <p className="mt-2 text-xs text-gray-500">
                            <strong>Alignment:</strong> {problem.alignment_notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tips for Instruction</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.tips_for_instruction.map((tip, index) => (
                      <li key={index}>{tip}</li>
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
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your problem set will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Problem Set" to review contextualized questions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RealWorldMathProblemGenerator




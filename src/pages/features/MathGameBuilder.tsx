import { useState } from 'react'
import { Gamepad2, Sparkles, RefreshCw, Download } from 'lucide-react'

type MathDomain =
  | 'fractions'
  | 'geometry'
  | 'algebra'
  | 'data'
  | 'measurement'
  | 'number_operations'

type Difficulty = 'easy' | 'moderate' | 'challenging'
type GameType = 'competitive' | 'cooperative' | 'puzzle' | 'quiz' | 'movement'
type OutputFormat = 'structured_json' | 'teacher_text'

interface MathGameInputs {
  grade: number | ''
  math_domain: MathDomain | ''
  topic: string
  players: number | ''
  materials_available: string[]
  duration: string
  difficulty: Difficulty | ''
  game_type: GameType | ''
  include_extensions: boolean
  language: string
  output_format: OutputFormat | ''
}

interface GameRound {
  name: string
  description: string
  scoring: string
}

interface MathGameOutput {
  title: string
  grade: number
  math_domain: string
  topic: string
  players: number
  duration?: string
  difficulty?: string
  game_type?: string
  language?: string
  setup_instructions: string[]
  materials: string[]
  gameplay_rounds: GameRound[]
  reflection_prompts: string[]
  extension_variations?: string[]
}

const sampleGame: MathGameOutput = {
  title: 'Fraction Relay Challenge',
  grade: 5,
  math_domain: 'fractions',
  topic: 'equivalent fractions',
  players: 4,
  duration: 'PT15M',
  difficulty: 'moderate',
  game_type: 'cooperative',
  setup_instructions: [
    'Divide students into groups of four and assign roles (Starter, Strategist, Checker, Recorder).',
    'Place fraction cards face down in the centre and provide each team with whiteboards.',
    'Review the goal: build fraction models that prove equivalence before time runs out.',
  ],
  materials: ['Fraction cards', 'Dice', 'Mini whiteboards and markers', 'Timer'],
  gameplay_rounds: [
    {
      name: 'Round 1: Quick Match',
      description:
        'Teams draw a card and race to represent the fraction using models or number lines. First to show an equivalent wins the card.',
      scoring: '1 point for each correct representation checked by opposing team.',
    },
    {
      name: 'Round 2: Strategy Swap',
      description:
        'Teams trade one card and must generate two new equivalents using different models (area vs. number line).',
      scoring: '2 points for accurate dual representations with supporting explanations.',
    },
    {
      name: 'Round 3: Dice Challenge',
      description:
        'Roll dice to create a fraction; teams determine if it matches any existing equivalents or must justify why not.',
      scoring: 'Bonus point for justified reasoning even when no match is found.',
    },
  ],
  reflection_prompts: [
    'Which strategy helped your team identify equivalent fractions fastest?',
    'How did visual models support your explanations?',
  ],
  extension_variations: [
    'Advanced teams create real-world word problems using the equivalent fractions they collected.',
    'Introduce improper fractions and mixed numbers for a higher-level challenge.',
  ],
  language: 'en-US',
}

const MathGameBuilder = () => {
  const [inputs, setInputs] = useState<MathGameInputs>({
    grade: 5,
    math_domain: 'fractions',
    topic: 'equivalent fractions',
    players: 4,
    materials_available: ['cards', 'dice', 'whiteboard'],
    duration: 'PT15M',
    difficulty: 'moderate',
    game_type: 'cooperative',
    include_extensions: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [currentMaterial, setCurrentMaterial] = useState('')
  const [output, setOutput] = useState<MathGameOutput | null>(sampleGame)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof MathGameInputs>(
    field: K,
    value: MathGameInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addMaterial = () => {
    if (currentMaterial.trim()) {
      handleInputChange('materials_available', [...inputs.materials_available, currentMaterial.trim()])
      setCurrentMaterial('')
    }
  }

  const removeMaterial = (index: number) => {
    handleInputChange(
      'materials_available',
      inputs.materials_available.filter((_, i) => i !== index)
    )
  }

  const generateGamePlan = () => {
    if (!inputs.grade || !inputs.math_domain || !inputs.topic) {
      alert('Please complete Grade, Math Domain, and Topic to generate a game plan.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const players = inputs.players && inputs.players > 0 ? inputs.players : 4
      const mockOutput: MathGameOutput = {
        title: `${inputs.topic} ${inputs.game_type ? inputs.game_type.replace(/_/g, ' ') : 'math'} game`,
        grade: inputs.grade as number,
        math_domain: inputs.math_domain,
        topic: inputs.topic,
        players,
        duration: inputs.duration || undefined,
        difficulty: inputs.difficulty || undefined,
        game_type: inputs.game_type || undefined,
        language: inputs.language || undefined,
        setup_instructions: [
          'Form groups and review the learning objective for the session.',
          `Explain the rules for the ${inputs.game_type || 'classroom'} game and model a sample turn.`,
          'Distribute materials and set ground rules for collaboration and sportsmanship.',
        ],
        materials:
          inputs.materials_available.length > 0
            ? inputs.materials_available
            : ['No additional materials required'],
        gameplay_rounds: [
          {
            name: 'Round 1: Warm-Up',
            description:
              'Introduce a low-stakes challenge to ensure all players understand the rules and mechanics.',
            scoring: 'Award quick wins for correct answers and teamwork demonstrations.',
          },
          {
            name: 'Round 2: Core Challenge',
            description:
              `Increase complexity with problems tied to ${inputs.topic}, encouraging teams to verbalize strategies.`,
            scoring: 'Points for accuracy, strategy explanations, and peer coaching.',
          },
          {
            name: 'Round 3: Finale',
            description:
              'Introduce a timed or cumulative challenge requiring teams to apply all learned strategies.',
            scoring: 'Bonus points for creativity or connecting the math to real-life contexts.',
          },
        ],
        reflection_prompts: [
          'What strategy helped your team solve problems the fastest?',
          'How did you support teammates when the challenge became more difficult?',
        ],
        extension_variations: inputs.include_extensions
          ? [
              'Design a student-led tournament or leaderboard for continued practice.',
              'Modify the game rules to include a cooperative puzzle or real-world scenario.',
            ]
          : undefined,
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
            <Gamepad2 className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Math Game Builder</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Craft engaging math games that reinforce core concepts through play
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Game Inputs</span>
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
                    handleInputChange('math_domain', e.target.value as MathGameInputs['math_domain'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select domain</option>
                  <option value="fractions">Fractions</option>
                  <option value="geometry">Geometry</option>
                  <option value="algebra">Algebra</option>
                  <option value="data">Data</option>
                  <option value="measurement">Measurement</option>
                  <option value="number_operations">Number Operations</option>
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
                  placeholder='e.g., "equivalent fractions"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Players per Group</label>
                <input
                  type="number"
                  min="1"
                  value={inputs.players}
                  onChange={(e) => handleInputChange('players', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder="Default is 4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Available
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
                    placeholder='e.g., "cards"'
                  />
                  <button type="button" onClick={addMaterial} className="btn-primary whitespace-nowrap">
                    Add
                  </button>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder="e.g., PT15M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={inputs.difficulty}
                  onChange={(e) =>
                    handleInputChange('difficulty', (e.target.value || '') as MathGameInputs['difficulty'])
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Type</label>
                <select
                  value={inputs.game_type}
                  onChange={(e) =>
                    handleInputChange('game_type', (e.target.value || '') as MathGameInputs['game_type'])
                  }
                  className="input-field"
                >
                  <option value="">Select game type (optional)</option>
                  <option value="competitive">Competitive</option>
                  <option value="cooperative">Cooperative</option>
                  <option value="puzzle">Puzzle</option>
                  <option value="quiz">Quiz</option>
                  <option value="movement">Movement</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-extensions"
                  checked={inputs.include_extensions}
                  onChange={(e) => handleInputChange('include_extensions', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="include-extensions" className="ml-2 text-sm text-gray-700">
                  Include extension variations
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
                      (e.target.value || '') as MathGameInputs['output_format']
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
                onClick={generateGamePlan}
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
                    <span>Generate Game Plan</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Game Plan</h2>
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
                      <strong>Domain:</strong> {output.math_domain.replace(/_/g, ' ')}
                    </span>
                    <span>
                      <strong>Topic:</strong> {output.topic}
                    </span>
                    <span>
                      <strong>Players:</strong> {output.players}
                    </span>
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
                    {output.game_type && (
                      <span>
                        <strong>Type:</strong> {output.game_type.replace(/_/g, ' ')}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">
                    Engage learners with a structured game that builds mastery of {output.topic}.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Setup Instructions</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {output.setup_instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Gameplay Rounds</h4>
                  <div className="space-y-3">
                    {output.gameplay_rounds.map((round, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-gray-900">{round.name}</h5>
                        </div>
                        <p className="text-sm text-gray-700">{round.description}</p>
                        <p className="mt-2 text-xs text-gray-600">
                          <strong>Scoring:</strong> {round.scoring}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reflection Prompts</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.reflection_prompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>

                {output.extension_variations && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Extension Variations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {output.extension_variations.map((variation, index) => (
                        <li key={index}>{variation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your game plan will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Game Plan" to preview your math game outline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MathGameBuilder




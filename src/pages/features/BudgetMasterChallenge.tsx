import { useState } from 'react'
import { Calculator, Sparkles, RefreshCw, Download } from 'lucide-react'

type ScenarioType = 'event' | 'business' | 'personal_finance' | 'trip' | 'school_project'
type BudgetDifficulty = 'easy' | 'moderate' | 'advanced'
type OutputFormat = 'structured_json' | 'teacher_text'

interface BudgetChallengeInputs {
  grade: number | ''
  scenario_type: ScenarioType | ''
  budget_limit: number | ''
  currency: string
  difficulty: BudgetDifficulty | ''
  duration: string
  include_extensions: boolean
  language: string
  output_format: OutputFormat | ''
}

interface BudgetItem {
  name: string
  cost: string
  quantity: string
  justification: string
}

interface BudgetChallengeOutput {
  title: string
  grade: number
  scenario_type: string
  budget_limit: string
  difficulty?: string
  duration?: string
  summary: string
  planning_steps: string[]
  required_items: BudgetItem[]
  decision_points: string[]
  reflection_tasks?: string[]
  extension_challenge?: string
  language?: string
}

const sampleBudgetChallenge: BudgetChallengeOutput = {
  title: 'Budget Master Challenge: Grade 8 School Fundraiser',
  grade: 8,
  scenario_type: 'school_project',
  budget_limit: '$150.00',
  difficulty: 'moderate',
  duration: 'PT45M',
  summary:
    'Students plan a school fundraiser with a limited budget, making strategic decisions about supplies, marketing, and venue costs while justifying trade-offs.',
  planning_steps: [
    'Start with a needs assessment: list essential and optional items.',
    'Research realistic prices and note bulk or discount opportunities.',
    'Allocate funds to prioritize impact while staying under budget.',
  ],
  required_items: [
    {
      name: 'Refreshments',
      cost: '$45.00',
      quantity: 'Snacks and drinks for 50 attendees',
      justification: 'Keeps guests engaged and supports fundraising atmosphere.',
    },
    {
      name: 'Promotional Posters',
      cost: '$15.00',
      quantity: 'Printing for 20 posters',
      justification: 'Essential for raising awareness and boosting attendance.',
    },
    {
      name: 'Venue Setup Supplies',
      cost: '$30.00',
      quantity: 'Tablecloths, signage materials',
      justification: 'Creates an inviting space that reflects the event theme.',
    },
  ],
  decision_points: [
    'Choose between renting professional sound equipment or using school resources.',
    'Decide whether to hire a guest speaker (extra cost) or showcase student talent.',
    'Evaluate the value of digital advertising versus traditional flyers.',
  ],
  reflection_tasks: [
    'Explain how your group balanced needs and wants within the budget.',
    'Describe one trade-off that improved your final plan and why.',
  ],
  extension_challenge:
    'Revise the plan for a VIP donor event with a new budget of $300, incorporating upscale elements while maintaining profitability.',
  language: 'en-US',
}

const BudgetMasterChallenge = () => {
  const [inputs, setInputs] = useState<BudgetChallengeInputs>({
    grade: 8,
    scenario_type: 'school_project',
    budget_limit: 150,
    currency: 'USD',
    difficulty: 'moderate',
    duration: 'PT40M',
    include_extensions: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [output, setOutput] = useState<BudgetChallengeOutput | null>(sampleBudgetChallenge)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof BudgetChallengeInputs>(
    field: K,
    value: BudgetChallengeInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (amount: number, currency?: string) => {
    if (!Number.isFinite(amount)) return `${amount}`
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    })
    try {
      return formatter.format(amount)
    } catch {
      return `${currency || 'USD'} ${amount.toFixed(2)}`
    }
  }

  const generateChallenge = () => {
    if (!inputs.grade || !inputs.scenario_type || !inputs.budget_limit) {
      alert('Please complete Grade, Scenario Type, and Budget Limit to generate the challenge.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const currency = inputs.currency || 'USD'
      const budgetFormatted = formatCurrency(inputs.budget_limit as number, currency)
      const mockOutput: BudgetChallengeOutput = {
        title: `Budget Master Challenge: ${inputs.scenario_type.replace(/_/g, ' ')}`,
        grade: inputs.grade as number,
        scenario_type: inputs.scenario_type,
        budget_limit: budgetFormatted,
        difficulty: inputs.difficulty || undefined,
        duration: inputs.duration || undefined,
        summary: `Students manage a ${inputs.scenario_type.replace(
          /_/g,
          ' '
        )} budget of ${budgetFormatted}, making cost-benefit decisions and justifying allocations.`,
        planning_steps: [
          'Clarify the objective and identify essential vs. optional expenses.',
          'Research realistic prices using local or online sources.',
          'Draft a budget proposal with savings strategies and trade-offs.',
        ],
        required_items: [
          {
            name: 'Core Expense',
            cost: `${formatCurrency((inputs.budget_limit as number) * 0.3, currency)}`,
            quantity: 'Quantity based on scenario specifics',
            justification: 'Foundational cost that supports the primary goal.',
          },
          {
            name: 'Enhancement',
            cost: `${formatCurrency((inputs.budget_limit as number) * 0.2, currency)}`,
            quantity: 'Add-on to elevate participant experience',
            justification: 'Adds value while staying within budget constraints.',
          },
          {
            name: 'Contingency Fund',
            cost: `${formatCurrency((inputs.budget_limit as number) * 0.1, currency)}`,
            quantity: 'Reserved for unexpected costs',
            justification: 'Models real-world budgeting with emergency planning.',
          },
        ],
        decision_points: [
          'Determine which optional expense should be prioritized if extra funds remain.',
          'Choose between higher-quality materials versus lower-cost alternatives.',
          'Evaluate potential partnerships or sponsorships to offset costs.',
        ],
        reflection_tasks: inputs.include_extensions
          ? [
              'Reflect on how your budget choices align with the overall goal.',
              'What compromises did you make, and how did they affect the final plan?',
            ]
          : undefined,
        extension_challenge: inputs.include_extensions
          ? 'Develop an advanced scenario with a reduced budget and present a persuasive pitch for stakeholder approval.'
          : undefined,
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
            <Calculator className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Budget Master Challenge</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Design budget simulations that strengthen financial literacy and decision-making
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Challenge Inputs</span>
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
                  Scenario Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.scenario_type}
                  onChange={(e) =>
                    handleInputChange('scenario_type', e.target.value as BudgetChallengeInputs['scenario_type'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select scenario type</option>
                  <option value="event">Event</option>
                  <option value="business">Business</option>
                  <option value="personal_finance">Personal Finance</option>
                  <option value="trip">Trip</option>
                  <option value="school_project">School Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Limit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.budget_limit}
                  onChange={(e) => handleInputChange('budget_limit', parseFloat(e.target.value) || '')}
                  className="input-field"
                  placeholder="Enter amount (e.g., 150)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <input
                  type="text"
                  value={inputs.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="input-field"
                  placeholder="e.g., USD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={inputs.difficulty}
                  onChange={(e) =>
                    handleInputChange('difficulty', (e.target.value || '') as BudgetChallengeInputs['difficulty'])
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={inputs.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="input-field"
                  placeholder="e.g., PT40M"
                />
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
                  Include reflection and extension challenge
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
                      (e.target.value || '') as BudgetChallengeInputs['output_format']
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
                onClick={generateChallenge}
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
                    <span>Generate Budget Challenge</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Challenge Plan</h2>
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
                      <strong>Scenario:</strong> {output.scenario_type.replace(/_/g, ' ')}
                    </span>
                    <span>
                      <strong>Budget Limit:</strong> {output.budget_limit}
                    </span>
                    {output.difficulty && (
                      <span>
                        <strong>Difficulty:</strong> {output.difficulty}
                      </span>
                    )}
                    {output.duration && (
                      <span>
                        <strong>Duration:</strong> {output.duration}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.summary}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Planning Steps</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {output.planning_steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Suggested Budget Items</h4>
                  <div className="space-y-3">
                    {output.required_items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-800">
                          <strong>{item.name}</strong> — {item.cost}
                        </p>
                        <p className="text-xs text-gray-600">Quantity/Detail: {item.quantity}</p>
                        <p className="mt-1 text-sm text-gray-700">{item.justification}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Decision Points</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.decision_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                {output.reflection_tasks && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Reflection Tasks</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {output.reflection_tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {output.extension_challenge && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Extension Challenge</h4>
                    <p className="text-sm text-gray-700">{output.extension_challenge}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your budget challenge will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Budget Challenge" to preview the activity.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BudgetMasterChallenge




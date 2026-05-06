import { useState } from 'react'
import { Users, Sparkles, RefreshCw, Download } from 'lucide-react'

type OutputFormat = 'structured_json' | 'markdown' | 'teacher_text'

interface BehaviourPlanInputs {
  grade: number | ''
  class_size: number | ''
  age_range: string
  known_challenges: string[]
  rules_count: number | ''
  positive_reinforcement: boolean
  parent_communication: boolean
  language: string
  output_format: OutputFormat | ''
}

interface BehaviourRule {
  rule: string
  rationale: string
  reinforcement: string
}

interface BehaviourIntervention {
  trigger: string
  proactive_strategy: string
  responsive_action: string
}

interface BehaviourCommunicationTemplate {
  audience: string
  purpose: string
  template: string
}

interface BehaviourPlanOutput {
  title: string
  grade: number
  class_size: number
  age_range?: string
  summary: string
  priorities: string[]
  classroom_rules: BehaviourRule[]
  routines: string[]
  positive_reinforcement: string[]
  interventions: BehaviourIntervention[]
  parent_communication?: BehaviourCommunicationTemplate[]
  monitoring_plan: string[]
  language?: string
}

const samplePlan: BehaviourPlanOutput = {
  title: 'Year 6 Behaviour Management Plan',
  grade: 6,
  class_size: 30,
  age_range: '10–12',
  summary:
    'This plan focuses on establishing consistent routines, increasing participation, and reducing disruptions through positive reinforcement and proactive strategies.',
  priorities: [
    'Increase on-task behaviour during whole-class instruction.',
    'Encourage student voice and participation in class discussions.',
    'Minimise transition time between activities.',
  ],
  classroom_rules: [
    {
      rule: 'Listen actively when others are speaking.',
      rationale: 'Shows respect and helps everyone learn effectively.',
      reinforcement: 'Specific praise highlighting how listening supported learning.',
    },
    {
      rule: 'Be prepared with materials at the start of each lesson.',
      rationale: 'Keeps lessons running smoothly and maximises learning time.',
      reinforcement: 'Class point awarded when everyone has materials ready.',
    },
    {
      rule: 'Use positive language and actions towards classmates.',
      rationale: 'Builds a safe and supportive classroom community.',
      reinforcement: 'Student shout-outs for kindness during closing circle.',
    },
  ],
  routines: [
    'Morning routine: greet at the door, do-now task on board, attendance check within 5 minutes.',
    'Transition routine: 2-minute timer with visual countdown, students move only when music plays.',
    'Group discussion protocol: think-pair-share, raise hands for whole-group share-out.',
  ],
  positive_reinforcement: [
    'Weekly recognition board celebrating risk-taking and participation.',
    'Class dojo points for meeting daily participation targets.',
    'Choice time on Fridays when class meets weekly behaviour goal.',
  ],
  interventions: [
    {
      trigger: 'Frequent side conversations during instruction.',
      proactive_strategy: 'Assign purposeful partners and use proximity support.',
      responsive_action: 'Provide a private reminder and redirect to note-taking task.',
    },
    {
      trigger: 'Low participation in discussions.',
      proactive_strategy: 'Offer sentence stems and allow think time before calling on students.',
      responsive_action: 'Use random name generator with support prompts to scaffold responses.',
    },
  ],
  parent_communication: [
    {
      audience: 'Families',
      purpose: 'Introduce behaviour plan',
      template:
        'Dear families,\n\nWe are launching our Year 6 behaviour focus on respectful listening and collaboration. You can support by asking your child how they demonstrated our class values each day.\n\nThank you,\n[Teacher Name]',
    },
    {
      audience: 'Individual student follow-up',
      purpose: 'Celebrate growth',
      template:
        'Hello [Family Name],\n\nI wanted to share that [Student] met their participation goal today by contributing thoughtful ideas during science. Please join me in celebrating this success.\n\nBest,\n[Teacher Name]',
    },
  ],
  monitoring_plan: [
    'Track participation using a simple tally chart for each lesson.',
    'Schedule fortnightly reflections with students showing repeated disruptions.',
    'Review data every two weeks and adjust strategies with grade-level team.',
  ],
  language: 'en-US',
}

const BehaviourPlanBuilder = () => {
  const [inputs, setInputs] = useState<BehaviourPlanInputs>({
    grade: 6,
    class_size: 30,
    age_range: '10–12',
    known_challenges: ['low participation', 'frequent disruptions'],
    rules_count: 3,
    positive_reinforcement: true,
    parent_communication: true,
    language: 'en-US',
    output_format: 'teacher_text',
  })

  const [currentChallenge, setCurrentChallenge] = useState('')
  const [output, setOutput] = useState<BehaviourPlanOutput | null>(samplePlan)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof BehaviourPlanInputs>(
    field: K,
    value: BehaviourPlanInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addChallenge = () => {
    if (currentChallenge.trim()) {
      handleInputChange('known_challenges', [...inputs.known_challenges, currentChallenge.trim()])
      setCurrentChallenge('')
    }
  }

  const removeChallenge = (index: number) => {
    handleInputChange(
      'known_challenges',
      inputs.known_challenges.filter((_, i) => i !== index)
    )
  }

  const generatePlan = () => {
    if (!inputs.grade || !inputs.class_size) {
      alert('Please provide Grade and Class Size to build the plan.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: BehaviourPlanOutput = {
        title: `Grade ${inputs.grade} Behaviour Plan`,
        grade: inputs.grade as number,
        class_size: inputs.class_size as number,
        age_range: inputs.age_range || undefined,
        summary: `This plan supports a class of ${inputs.class_size} students by addressing key challenges through consistent expectations, reinforcement, and responsive strategies.`,
        priorities:
          inputs.known_challenges.length > 0
            ? inputs.known_challenges.map(
                (challenge) => `Address classroom challenge: ${challenge}`
              )
            : [
                'Sustain a positive classroom climate with consistent routines.',
                'Promote student agency and collaborative learning behaviours.',
              ],
        classroom_rules: Array.from({ length: inputs.rules_count || 3 }).map((_, index) => ({
          rule: `Class expectation ${index + 1}`,
          rationale: 'Explain why this expectation supports a productive classroom.',
          reinforcement: inputs.positive_reinforcement
            ? 'Plan specific praise or reward when students meet this expectation.'
            : 'Provide clear reminder procedures when expectation is met or missed.',
        })),
        routines: [
          'Arrival routine: establish calm start with greeting and independent task.',
          'Transition routine: use timers and clear cues to guide movement between activities.',
          'Closing routine: daily reflection circle highlighting successes and next steps.',
        ],
        positive_reinforcement: inputs.positive_reinforcement
          ? [
              'Daily shout-outs recognising specific positive behaviours.',
              'Class incentive tracker tied to collaborative goals.',
              'Student choice menu for individual recognition moments.',
            ]
          : [],
        interventions: [
          {
            trigger: 'Off-task behaviour during instruction.',
            proactive_strategy: 'Use seating plans, preview expectations, and offer roles during lessons.',
            responsive_action:
              'Provide calm redirection, restate expectation, and follow up privately if behaviour continues.',
          },
          {
            trigger: 'Escalating conflicts between peers.',
            proactive_strategy: 'Teach conflict resolution steps and schedule social-emotional mini-lessons.',
            responsive_action:
              'Facilitate restorative conversation and document agreements with students involved.',
          },
        ],
        parent_communication: inputs.parent_communication
          ? [
              {
                audience: 'Families',
                purpose: 'Share behaviour focus and home connection ideas',
                template:
                  'Hello families,\n\nOur class is focusing on building respectful routines and collaborative learning behaviours. You can support your child by discussing our class expectations and celebrating positive choices together.\n\nWarm regards,\n[Teacher Name]',
              },
              {
                audience: 'Individual check-in',
                purpose: 'Request partnership for behaviour support',
                template:
                  'Dear [Family Name],\n\nI would appreciate your partnership in supporting [Student] with our classroom expectation of [specific behaviour]. At home, you might reinforce this by ... Let’s touch base next week to review progress.\n\nThank you,\n[Teacher Name]',
              },
            ]
          : undefined,
        monitoring_plan: [
          'Log behaviour data using a simple spreadsheet to identify patterns.',
          'Review logs weekly and adjust strategies with the support team.',
          'Invite student reflection during one-on-one conferences twice per month.',
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
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Behaviour Management Plan Builder</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Create proactive classroom behaviour plans with rules, reinforcement, and interventions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Classroom Context</span>
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
                  placeholder="Grade level (1-12)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.class_size}
                  onChange={(e) =>
                    handleInputChange('class_size', Math.max(1, parseInt(e.target.value) || ''))
                  }
                  className="input-field"
                  placeholder="Total number of students"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <input
                  type="text"
                  value={inputs.age_range}
                  onChange={(e) => handleInputChange('age_range', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 10–12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Challenges
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentChallenge}
                    onChange={(e) => setCurrentChallenge(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addChallenge()
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "low participation"'
                  />
                  <button
                    type="button"
                    onClick={addChallenge}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.known_challenges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.known_challenges.map((challenge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {challenge}
                        <button
                          type="button"
                          onClick={() => removeChallenge(index)}
                          className="hover:text-purple-900"
                          aria-label={`Remove ${challenge}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rules Count</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={inputs.rules_count}
                  onChange={(e) => handleInputChange('rules_count', parseInt(e.target.value) || '')}
                  className="input-field"
                  placeholder="Number of core class expectations"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="positive-reinforcement"
                  checked={inputs.positive_reinforcement}
                  onChange={(e) => handleInputChange('positive_reinforcement', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="positive-reinforcement" className="ml-2 text-sm text-gray-700">
                  Include positive reinforcement ideas
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parent-communication"
                  checked={inputs.parent_communication}
                  onChange={(e) => handleInputChange('parent_communication', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="parent-communication" className="ml-2 text-sm text-gray-700">
                  Include parent communication templates
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
                      (e.target.value || '') as BehaviourPlanInputs['output_format']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select output format (optional)</option>
                  <option value="teacher_text">Teacher Text</option>
                  <option value="markdown">Markdown</option>
                  <option value="structured_json">Structured JSON</option>
                </select>
              </div>

              <button
                onClick={generatePlan}
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
                    <span>Generate Behaviour Plan</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Behaviour Plan</h2>
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
                      <strong>Class Size:</strong> {output.class_size}
                    </span>
                    {output.age_range && (
                      <span>
                        <strong>Age Range:</strong> {output.age_range}
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
                  <h4 className="font-semibold text-gray-900 mb-2">Priority Focus Areas</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.priorities.map((priority, index) => (
                      <li key={index}>{priority}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Classroom Rules</h4>
                  <div className="space-y-3">
                    {output.classroom_rules.map((rule, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-gray-900">Rule {index + 1}</h5>
                        </div>
                        <p className="text-sm text-gray-800">
                          <strong>Expectation:</strong> {rule.rule}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Why it matters:</strong> {rule.rationale}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Reinforcement:</strong> {rule.reinforcement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Core Routines</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.routines.map((routine, index) => (
                      <li key={index}>{routine}</li>
                    ))}
                  </ul>
                </div>

                {output.positive_reinforcement.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Positive Reinforcement Ideas</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {output.positive_reinforcement.map((idea, index) => (
                        <li key={index}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Intervention Strategies</h4>
                  <div className="space-y-3">
                    {output.interventions.map((intervention, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800">
                          <strong>Trigger:</strong> {intervention.trigger}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Proactive Strategy:</strong> {intervention.proactive_strategy}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Responsive Action:</strong> {intervention.responsive_action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {output.parent_communication && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parent Communication Templates</h4>
                    <div className="space-y-3">
                      {output.parent_communication.map((template, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-800">
                            <strong>Audience:</strong> {template.audience}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>Purpose:</strong> {template.purpose}
                          </p>
                          <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-white border border-gray-200 rounded-lg p-3">
                            {template.template}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Monitoring Plan</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.monitoring_plan.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your behaviour plan will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the classroom context and click "Generate Behaviour Plan" to see the recommendations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BehaviourPlanBuilder




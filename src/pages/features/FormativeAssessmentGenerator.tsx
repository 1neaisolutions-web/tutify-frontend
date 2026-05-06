import { useState } from 'react'
import { ClipboardList, Sparkles, RefreshCw, Download } from 'lucide-react'

type FormativeSubject =
  | 'Math'
  | 'Science'
  | 'English'
  | 'Social Studies'
  | 'Arts'
  | 'Technology'
  | 'Physical Education'
  | 'Other'

type FormativeActivityType = 'exit_ticket' | 'quiz' | 'group_discussion' | 'reflection'

interface FormativeAssessmentInputs {
  grade: number | ''
  subject: FormativeSubject | ''
  learning_objective: string
  context: string
  time_available: string
  activity_type: FormativeActivityType | ''
  language: string
}

interface FormativePrompt {
  question: string
  expected_response: string
  differentiation?: string
}

interface FormativeAssessmentOutput {
  title: string
  grade: number
  subject: string
  learning_objective: string
  activity_type?: string
  context?: string
  time_available?: string
  overview: string
  activity_steps: string[]
  prompts: FormativePrompt[]
  quick_checks: string[]
  follow_up_actions: string[]
  language?: string
}

const sampleFormativePlan: FormativeAssessmentOutput = {
  title: 'Water Cycle Exit Ticket',
  grade: 5,
  subject: 'Science',
  learning_objective: 'Identify key features of the water cycle.',
  activity_type: 'exit_ticket',
  context: 'After watching a video',
  time_available: 'PT10M',
  overview:
    'Students complete a quick exit ticket to demonstrate understanding of the water cycle immediately after the lesson.',
  activity_steps: [
    'Review the learning objective and remind students of key vocabulary (evaporation, condensation, precipitation).',
    'Distribute exit ticket template or display prompts on the board.',
    'Give students 5 minutes to respond individually.',
    'Collect responses and review common themes before dismissal.',
  ],
  prompts: [
    {
      question: 'Describe one stage of the water cycle and what happens during that stage.',
      expected_response: 'Students should name a stage (e.g., evaporation) and explain the process clearly.',
      differentiation: 'Provide visual icons representing each stage for students who need support.',
    },
    {
      question: 'Explain how the sun influences the water cycle.',
      expected_response: 'Students should note that the sun provides heat energy that causes evaporation.',
    },
  ],
  quick_checks: [
    'Listen for scientific vocabulary use during student explanations.',
    'Note which students describe processes accurately versus generally.',
    'Collect exit tickets and highlight misconceptions to address next lesson.',
  ],
  follow_up_actions: [
    'Group students with similar misconceptions for a targeted mini-lesson.',
    'Plan a hands-on condensation demonstration for students needing concrete visuals.',
    'Provide enrichment reading on extreme weather and the water cycle for advanced learners.',
  ],
  language: 'en-US',
}

const FormativeAssessmentGenerator = () => {
  const [inputs, setInputs] = useState<FormativeAssessmentInputs>({
    grade: 5,
    subject: 'Science',
    learning_objective: 'Identify key features of the water cycle.',
    context: 'After watching a video',
    time_available: 'PT10M',
    activity_type: 'exit_ticket',
    language: 'en-US',
  })

  const [output, setOutput] = useState<FormativeAssessmentOutput | null>(sampleFormativePlan)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof FormativeAssessmentInputs>(
    field: K,
    value: FormativeAssessmentInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const generateFormativePlan = () => {
    if (!inputs.grade || !inputs.subject || !inputs.learning_objective) {
      alert('Please complete all required fields (Grade, Subject, Learning Objective).')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: FormativeAssessmentOutput = {
        title: `${inputs.learning_objective} Check-in`,
        grade: inputs.grade as number,
        subject: inputs.subject as string,
        learning_objective: inputs.learning_objective,
        activity_type: inputs.activity_type || undefined,
        context: inputs.context || undefined,
        time_available: inputs.time_available || undefined,
        overview: `This formative ${
          inputs.activity_type || 'activity'
        } captures quick evidence of learning connected to "${inputs.learning_objective}" for grade ${
          inputs.grade
        } ${inputs.subject?.toLowerCase()} students.`,
        activity_steps: [
          inputs.context
            ? `Remind students of the context (${inputs.context}) and restate the learning objective.`
            : 'Briefly restate the learning objective to focus students.',
          `Explain the ${
            inputs.activity_type?.replace(/_/g, ' ') || 'activity'
          } instructions and success criteria.`,
          inputs.time_available
            ? `Give students ${inputs.time_available.replace('PT', '')} to complete the task.`
            : 'Allow enough time for thoughtful responses while keeping the pace brisk.',
          'Collect student responses and note immediate trends or misconceptions.',
        ],
        prompts: [
          {
            question: `What is one key idea you learned about ${inputs.learning_objective.toLowerCase()}?`,
            expected_response:
              'Students provide a concise statement demonstrating core understanding.',
            differentiation:
              inputs.activity_type === 'group_discussion'
                ? 'Invite students to build on a partner’s idea or provide sentence stems for support.'
                : 'Offer sentence starters for learners needing additional scaffolding.',
          },
          {
            question: `What question do you still have about ${inputs.topic || inputs.learning_objective.toLowerCase()}?`,
            expected_response:
              'Students identify an area of uncertainty, giving insight into next instructional steps.',
          },
        ],
        quick_checks: [
          'Observe student body language and participation to gauge confidence.',
          'Collect a sample of responses to categorize common strengths and needs.',
          'Use a quick show of hands or digital poll to identify lingering questions.',
        ],
        follow_up_actions: [
          'Plan a mini-lesson or clarification addressing the most frequent misconception.',
          'Provide targeted feedback to individual students needing support.',
          'Extend learning with an optional challenge prompt for students who demonstrated mastery.',
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
            <ClipboardList className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Formative Assessment Generator</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Create quick checks for understanding aligned to your lesson objective
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Assessment Inputs</span>
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
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.subject}
                  onChange={(e) =>
                    handleInputChange('subject', e.target.value as FormativeAssessmentInputs['subject'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select subject</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Arts">Arts</option>
                  <option value="Technology">Technology</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objective <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={inputs.learning_objective}
                  onChange={(e) => handleInputChange('learning_objective', e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder='e.g., "Identify key features of the water cycle."'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                <input
                  type="text"
                  value={inputs.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  className="input-field"
                  placeholder="e.g., After watching a video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Available</label>
                <input
                  type="text"
                  value={inputs.time_available}
                  onChange={(e) => handleInputChange('time_available', e.target.value)}
                  className="input-field"
                  placeholder="e.g., PT10M"
                />
                <p className="mt-1 text-xs text-gray-500">Use ISO 8601 duration (e.g., PT10M).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                <select
                  value={inputs.activity_type}
                  onChange={(e) =>
                    handleInputChange(
                      'activity_type',
                      (e.target.value || '') as FormativeAssessmentInputs['activity_type']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select activity type (optional)</option>
                  <option value="exit_ticket">Exit Ticket</option>
                  <option value="quiz">Quiz</option>
                  <option value="group_discussion">Group Discussion</option>
                  <option value="reflection">Reflection</option>
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

              <button
                onClick={generateFormativePlan}
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
                    <span>Generate Formative Plan</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Formative Plan</h2>
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
                      <strong>Subject:</strong> {output.subject}
                    </span>
                    {output.activity_type && (
                      <span>
                        <strong>Type:</strong> {output.activity_type.replace(/_/g, ' ')}
                      </span>
                    )}
                    {output.time_available && (
                      <span>
                        <strong>Time:</strong> {output.time_available}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    <strong>Learning Objective:</strong> {output.learning_objective}
                  </p>
                  {output.context && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Context:</strong> {output.context}
                    </p>
                  )}
                  <p className="mt-3 text-gray-700 text-sm">{output.overview}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Activity Steps</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {output.activity_steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prompts & Questions</h4>
                  <div className="space-y-3">
                    {output.prompts.map((prompt, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800 font-medium">{prompt.question}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          <strong>Expected Response:</strong> {prompt.expected_response}
                        </p>
                        {prompt.differentiation && (
                          <p className="mt-1 text-xs text-gray-500">
                            <strong>Support:</strong> {prompt.differentiation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Checks</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.quick_checks.map((check, index) => (
                      <li key={index}>{check}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Follow-Up Actions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.follow_up_actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your formative plan will appear here
                </h3>
                <p className="text-gray-600">
                  Fill out the inputs and click "Generate Formative Plan" to create a quick-check activity.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormativeAssessmentGenerator




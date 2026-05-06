import { useState } from 'react'
import { Lightbulb, Sparkles, RefreshCw, Download } from 'lucide-react'

type ActivitySubject = 'Math' | 'Science' | 'English' | 'Arts' | 'Technology' | 'Business'
type ActivityGoal =
  | 'application'
  | 'reflection'
  | 'discussion'
  | 'collaboration'
  | 'creativity'
  | 'review'
type StudentGrouping = 'pairs' | 'small_groups' | 'whole_class' | 'individual'
type TonePreference = 'fun' | 'academic' | 'reflective' | 'competitive'

interface ActivityInputs {
  grade: number | ''
  subject: ActivitySubject | ''
  topic: string
  duration: string
  activity_goal: ActivityGoal | ''
  learning_objective: string
  materials_available: string[]
  student_grouping: StudentGrouping | ''
  language: string
  tone_preference: TonePreference | ''
}

interface ActivityStep {
  title: string
  description: string
  time: string
}

interface ActivityOutput {
  title: string
  grade: number
  subject: string
  topic: string
  duration?: string
  activity_goal?: string
  learning_objective?: string
  tone_preference?: string
  language?: string
  summary: string
  materials: string[]
  steps: ActivityStep[]
  student_roles: string[]
  discussion_prompts: string[]
  quick_check: string
  extensions: string[]
}

const sampleActivity: ActivityOutput = {
  title: 'Collaborative Photosynthesis Challenge',
  grade: 9,
  subject: 'Science',
  topic: 'Photosynthesis',
  duration: 'PT20M',
  activity_goal: 'application',
  learning_objective: 'Students will apply key components of photosynthesis to model energy transfer.',
  tone_preference: 'fun',
  summary:
    'Students work in small groups to create a rapid prototype explaining photosynthesis using limited materials, focusing on clear visuals and concise explanations.',
  materials: ['Chart paper', 'Markers', 'Sticky notes', 'Timer'],
  steps: [
    {
      title: 'Hook & Challenge',
      description:
        'Introduce a quick scenario: “Design a museum exhibit explaining photosynthesis in 3 minutes or less.” Review success criteria.',
      time: '5 min',
    },
    {
      title: 'Prototype Sprint',
      description:
        'Groups build their exhibit using provided materials. Encourage roles: designer, writer, presenter, quality checker.',
      time: '10 min',
    },
    {
      title: 'Gallery Walk & Debrief',
      description:
        'Groups share exhibits. Peers leave sticky note feedback highlighting clarity and creativity. Facilitator captures key scientific ideas.',
      time: '5 min',
    },
  ],
  student_roles: ['Designer', 'Writer', 'Presenter', 'Quality Checker'],
  discussion_prompts: [
    'What part of photosynthesis is easiest to explain? Hardest?',
    'How does energy move through the system you illustrated?',
  ],
  quick_check: 'Collect exit slips where students describe how light energy converts to chemical energy.',
  extensions: [
    'Challenge students to translate their exhibit into a digital infographic.',
    'Assign a reflective journal entry on how collaboration clarified scientific ideas.',
  ],
}

const ActivityPlanner = () => {
  const [inputs, setInputs] = useState<ActivityInputs>({
    grade: 9,
    subject: 'Science',
    topic: 'Photosynthesis',
    duration: 'PT20M',
    activity_goal: 'application',
    learning_objective: 'Students will apply key components of photosynthesis to model energy transfer.',
    materials_available: ['chart paper', 'markers', 'sticky notes', 'timer'],
    student_grouping: 'small_groups',
    language: 'en-US',
    tone_preference: 'fun',
  })

  const [currentMaterial, setCurrentMaterial] = useState('')
  const [output, setOutput] = useState<ActivityOutput | null>(sampleActivity)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof ActivityInputs>(
    field: K,
    value: ActivityInputs[K]
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

  const generateActivity = () => {
    if (!inputs.grade || !inputs.subject || !inputs.topic) {
      alert('Please complete required fields (Grade, Subject, Topic).')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: ActivityOutput = {
        title: `${inputs.topic} ${inputs.activity_goal ? inputs.activity_goal.replace(/_/g, ' ') : 'Learning'} Activity`,
        grade: inputs.grade as number,
        subject: inputs.subject as string,
        topic: inputs.topic,
        duration: inputs.duration || undefined,
        activity_goal: inputs.activity_goal || undefined,
        learning_objective: inputs.learning_objective || undefined,
        tone_preference: inputs.tone_preference || undefined,
        language: inputs.language || undefined,
        summary: `Students engage in a ${
          inputs.student_grouping ? inputs.student_grouping.replace(/_/g, ' ') : 'collaborative'
        } task that reinforces ${inputs.topic.toLowerCase()} through ${
          inputs.activity_goal ? inputs.activity_goal.replace(/_/g, ' ') : 'active learning'
        }.`,
        materials:
          inputs.materials_available.length > 0
            ? inputs.materials_available
            : ['Whiteboard', 'Markers'],
        steps: [
          {
            title: 'Activate & Frame',
            description:
              'Briefly review prior knowledge and outline the challenge. Share success criteria connected to the learning objective.',
            time: inputs.duration ? '5 min' : '5 min',
          },
          {
            title: 'Main Activity',
            description:
              'Students complete the core task—apply concepts, discuss prompts, or create a representation—using available materials.',
            time: inputs.duration ? '10 min' : '10 min',
          },
          {
            title: 'Share & Reflect',
            description:
              'Groups present or compare findings. Facilitate a discussion drawing attention to misconceptions and highlight exemplar thinking.',
            time: inputs.duration ? '5 min' : '5 min',
          },
        ],
        student_roles: [
          'Facilitator keeps the group on task and manages time.',
          'Recorder captures notes or product details.',
          'Presenter shares takeaways with the class.',
          'Questioner probes teammates for deeper thinking.',
        ],
        discussion_prompts: [
          `How does today's activity connect to our learning objective${
            inputs.learning_objective ? `: "${inputs.learning_objective}"` : ''
          }?`,
          `Where do you see ${inputs.topic.toLowerCase()} influencing real-world situations?`,
        ],
        quick_check:
          inputs.activity_goal === 'reflection'
            ? 'Students submit a quick reflection describing what they learned and remaining questions.'
            : 'Collect a brief exit ticket demonstrating key understanding from the activity.',
        extensions: [
          'Offer an optional challenge task for students who finish early.',
          'Invite learners to create a digital summary or infographic capturing the main insights.',
        ],
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
            <Lightbulb className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Activity Planner</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Design quick engagement activities aligned to your learning goals
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Activity Inputs</span>
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
                    handleInputChange('subject', e.target.value as ActivityInputs['subject'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select subject</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Arts">Arts</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
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
                  placeholder='e.g., "Photosynthesis"'
                  required
                />
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
                <p className="mt-1 text-xs text-gray-500">Use ISO 8601 duration (e.g., PT15M).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Goal</label>
                <select
                  value={inputs.activity_goal}
                  onChange={(e) =>
                    handleInputChange(
                      'activity_goal',
                      (e.target.value || '') as ActivityInputs['activity_goal']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select goal (optional)</option>
                  <option value="application">Application</option>
                  <option value="reflection">Reflection</option>
                  <option value="discussion">Discussion</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="creativity">Creativity</option>
                  <option value="review">Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objective</label>
                <textarea
                  value={inputs.learning_objective}
                  onChange={(e) => handleInputChange('learning_objective', e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder='e.g., "Students will apply key concepts of motion in real-life scenarios"'
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
                    placeholder='e.g., "whiteboard"'
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="btn-primary whitespace-nowrap"
                  >
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Grouping</label>
                <select
                  value={inputs.student_grouping}
                  onChange={(e) =>
                    handleInputChange(
                      'student_grouping',
                      (e.target.value || '') as ActivityInputs['student_grouping']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select grouping (optional)</option>
                  <option value="pairs">Pairs</option>
                  <option value="small_groups">Small Groups</option>
                  <option value="whole_class">Whole Class</option>
                  <option value="individual">Individual</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone Preference</label>
                <select
                  value={inputs.tone_preference}
                  onChange={(e) =>
                    handleInputChange(
                      'tone_preference',
                      (e.target.value || '') as ActivityInputs['tone_preference']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select tone (optional)</option>
                  <option value="fun">Fun</option>
                  <option value="academic">Academic</option>
                  <option value="reflective">Reflective</option>
                  <option value="competitive">Competitive</option>
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
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Activity</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Activity Plan</h2>
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
                    <span>
                      <strong>Topic:</strong> {output.topic}
                    </span>
                    {output.duration && (
                      <span>
                        <strong>Duration:</strong> {output.duration}
                      </span>
                    )}
                    {output.activity_goal && (
                      <span>
                        <strong>Goal:</strong> {output.activity_goal.replace(/_/g, ' ')}
                      </span>
                    )}
                    {output.tone_preference && (
                      <span>
                        <strong>Tone:</strong> {output.tone_preference}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.summary}</p>
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

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Steps</h4>
                  <div className="space-y-3">
                    {output.steps.map((step, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-gray-900">{step.title}</h5>
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Student Roles</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.student_roles.map((role, index) => (
                      <li key={index}>{role}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Discussion Prompts</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.discussion_prompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Check</h4>
                  <p className="text-sm text-gray-700">{output.quick_check}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Extensions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.extensions.map((extension, index) => (
                      <li key={index}>{extension}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your activity plan will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the inputs and click "Generate Activity" to preview an engagement plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityPlanner




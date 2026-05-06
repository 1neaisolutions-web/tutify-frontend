import { useState } from 'react'
import { Users, Sparkles, RefreshCw, Download } from 'lucide-react'

type IcebreakerGoal = 'team_building' | 'focus_reset' | 'energy_boost' | 'get_to_know_each_other'
type IcebreakerContext = 'start_of_term' | 'after_break' | 'before_exam'

interface IcebreakerInputs {
  grade: number | ''
  group_size: number | ''
  time_available: string
  goal: IcebreakerGoal | ''
  context: IcebreakerContext | ''
  language: string
}

interface IcebreakerStep {
  title: string
  description: string
  time: string
}

interface IcebreakerDifferentiation {
  support: string[]
  extension: string[]
}

interface IcebreakerOutput {
  title: string
  grade: number
  group_size: number
  goal?: string
  context?: string
  time_available?: string
  overview: string
  materials: string[]
  steps: IcebreakerStep[]
  prompts: string[]
  differentiation: IcebreakerDifferentiation
  reflection: string[]
  language?: string
}

const sampleIcebreaker: IcebreakerOutput = {
  title: 'Collaborative Bingo Icebreaker',
  grade: 6,
  group_size: 25,
  goal: 'team_building',
  context: 'start_of_term',
  time_available: 'PT10M',
  overview:
    'Students connect with new classmates by finding peers who match prompts on a bingo card, encouraging conversation and quick community building.',
  materials: ['Printed bingo cards or digital versions', 'Pens or markers', 'Timer'],
  steps: [
    {
      title: 'Set the Stage',
      description:
        'Explain that students will mingle to find classmates who match prompts such as “Has the same favourite book” or “Can solve a Rubik’s cube.”',
      time: '2 min',
    },
    {
      title: 'Active Mingle',
      description:
        'Students circulate, introducing themselves and asking questions to fill their bingo cards. Encourage them to find a different classmate for each square.',
      time: '6 min',
    },
    {
      title: 'Shared Highlights',
      description:
        'Gather the class and invite a few volunteers to share interesting facts they discovered. Celebrate connections and note themes for future grouping.',
      time: '2 min',
    },
  ],
  prompts: [
    'Find someone who has visited another country.',
    'Find someone who enjoys the same type of music as you.',
    'Find someone who remembers a highlight from last school year.',
  ],
  differentiation: {
    support: [
      'Provide sentence starters on the cards (e.g., “Hi, my name is ___. Do you…?”).',
      'Allow students who need movement alternatives to stay seated and have classmates visit them.',
    ],
    extension: [
      'Challenge students to find a common goal they can work on together this term.',
      'Invite students to create a class word cloud with shared interests after the activity.',
    ],
  },
  reflection: [
    'What surprised you about your classmates?',
    'Which connection are you excited to build on this term?',
  ],
  language: 'en-US',
}

const IcebreakerIdeaGenerator = () => {
  const [inputs, setInputs] = useState<IcebreakerInputs>({
    grade: 6,
    group_size: 25,
    time_available: 'PT10M',
    goal: 'team_building',
    context: 'start_of_term',
    language: 'en-US',
  })

  const [output, setOutput] = useState<IcebreakerOutput | null>(sampleIcebreaker)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof IcebreakerInputs>(
    field: K,
    value: IcebreakerInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const generateIcebreaker = () => {
    if (!inputs.grade || !inputs.group_size) {
      alert('Please provide Grade and Group Size to generate an idea.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: IcebreakerOutput = {
        title: `${inputs.goal ? inputs.goal.replace(/_/g, ' ') : 'Class'} Icebreaker`,
        grade: inputs.grade as number,
        group_size: inputs.group_size as number,
        goal: inputs.goal || undefined,
        context: inputs.context || undefined,
        time_available: inputs.time_available || undefined,
        overview: `This quick activity helps grade ${inputs.grade} students ${
          inputs.goal
            ? `by focusing on ${inputs.goal.replace(/_/g, ' ')}`
            : 'build classroom connection'
        }${
          inputs.context ? ` during the ${inputs.context.replace(/_/g, ' ')}` : ''
        }. Students engage with peers to spark conversation and positive energy.`,
        materials: [
          'Prepared prompt cards or slide deck',
          'Timer or music track',
          'Optional: small tokens or stickers for participation',
        ],
        steps: [
          {
            title: 'Welcome Prompt',
            description:
              'Introduce the activity and model how to greet classmates and respond to prompts.',
            time: '2 min',
          },
          {
            title: 'Active Engagement',
            description:
              'Students rotate or mingle to connect with new peers, completing tasks or responding to questions.',
            time: inputs.time_available ? `${Math.max(4, inputs.group_size / 10)} min` : '6 min',
          },
          {
            title: 'Group Share & Transition',
            description:
              'Facilitate a brief share-out highlighting interesting discoveries, then segue into the next lesson component.',
            time: '2 min',
          },
        ],
        prompts: [
          `Find someone who can share ${inputs.goal === 'focus_reset' ? 'a calming strategy before learning' : 'a fun fact about themselves'}.`,
          'Discover a partner who enjoys a hobby different from yours.',
          'Ask a classmate to teach you a quick gesture, phrase, or movement you can use as a group cue.',
        ],
        differentiation: {
          support: [
            'Provide a visual checklist of prompts for students who benefit from structure.',
            'Allow pairing with familiar peers before branching out to new connections.',
          ],
          extension: [
            'Invite students to create their own prompt to keep the activity going.',
            'Challenge small groups to come up with a collaborative chant or motto based on what they learned.',
          ],
        },
        reflection: [
          'Who did you connect with today that you might collaborate with in the future?',
          'How did this activity help you feel ready for our next lesson?',
        ],
        language: inputs.language || undefined,
      }

      setOutput(mockOutput)
      setIsGenerating(false)
    }, 800)
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 min-h-16 lg:min-h-20 py-3 lg:py-4 flex items-center justify-between mb-6 relative z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Icebreaker & Engagement Generator</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Generate quick community-building activities tailored to your class
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
                  Group Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputs.group_size}
                  onChange={(e) =>
                    handleInputChange('group_size', Math.max(1, parseInt(e.target.value) || ''))
                  }
                  className="input-field"
                  placeholder="Number of students"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                <select
                  value={inputs.goal}
                  onChange={(e) =>
                    handleInputChange('goal', (e.target.value || '') as IcebreakerInputs['goal'])
                  }
                  className="input-field"
                >
                  <option value="">Select goal (optional)</option>
                  <option value="team_building">Team Building</option>
                  <option value="focus_reset">Focus Reset</option>
                  <option value="energy_boost">Energy Boost</option>
                  <option value="get_to_know_each_other">Get to Know Each Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                <select
                  value={inputs.context}
                  onChange={(e) =>
                    handleInputChange(
                      'context',
                      (e.target.value || '') as IcebreakerInputs['context']
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select context (optional)</option>
                  <option value="start_of_term">Start of Term</option>
                  <option value="after_break">After Break</option>
                  <option value="before_exam">Before Exam</option>
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
                onClick={generateIcebreaker}
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
                    <span>Generate Idea</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Activity</h2>
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
                      <strong>Group Size:</strong> {output.group_size}
                    </span>
                    {output.goal && (
                      <span>
                        <strong>Goal:</strong> {output.goal.replace(/_/g, ' ')}
                      </span>
                    )}
                    {output.context && (
                      <span>
                        <strong>Context:</strong> {output.context.replace(/_/g, ' ')}
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
                  <p className="mt-3 text-gray-700 text-sm">{output.overview}</p>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Prompts</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.prompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Differentiation</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Support</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.differentiation.support.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Extension</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {output.differentiation.extension.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reflection</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {output.reflection.map((item, index) => (
                      <li key={index}>{item}</li>
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
                  Your icebreaker idea will appear here
                </h3>
                <p className="text-gray-600">
                  Fill in the activity inputs and click "Generate Idea" to preview an engagement activity.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IcebreakerIdeaGenerator




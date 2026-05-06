import { useState } from 'react'
import { FileText, Sparkles, RefreshCw, Download } from 'lucide-react'

type NewsletterAudience = 'parents' | 'community' | 'school_leadership'
type NewsletterTone = 'celebratory' | 'informative' | 'reflective'

interface NewsletterInputs {
  topic: string
  audience: NewsletterAudience | ''
  tone: NewsletterTone | ''
  word_count: number | ''
  key_activities: string[]
  language: string
}

interface NewsletterSection {
  heading: string
  content: string
}

interface NewsletterOutput {
  title: string
  audience: string
  tone?: string
  language?: string
  word_count?: number
  introduction: string
  highlights: NewsletterSection[]
  quote: string
  closing: string
  call_to_action: string
}

const sampleNewsletter: NewsletterOutput = {
  title: 'STEM Week Highlights',
  audience: 'parents',
  tone: 'celebratory',
  language: 'en-US',
  word_count: 250,
  introduction:
    "What an inspiring week! Our young innovators explored robotics, engineering challenges, and real-world problem solving during STEM Week. Here's a snapshot of their achievements.",
  highlights: [
    {
      heading: 'Robotics Challenge',
      content:
        'Grade 5 students collaborated in mixed teams to design robots that could navigate obstacle courses. Judges were impressed by the creative coding solutions and teamwork on display.',
    },
    {
      heading: 'Student Presentations',
      content:
        'Learners showcased inquiry projects to families, sharing how STEM ideas connect to everyday life. Parents noted the confidence and clarity with which students explained their thinking.',
    },
  ],
  quote:
    '"Seeing the students problem-solve together and celebrate every small win was the highlight of the week," shared Ms. Patel, STEM Coordinator.',
  closing:
    'We are proud of the curiosity and perseverance our students demonstrated. A special thank-you to families and volunteers who supported this week-long experience.',
  call_to_action:
    'Stay tuned for our upcoming Family Makers’ Night on March 15, where students will guide you through hands-on STEM stations!',
}

const NewsletterArticleGenerator = () => {
  const [inputs, setInputs] = useState<NewsletterInputs>({
    topic: 'STEM Week Highlights',
    audience: 'parents',
    tone: 'celebratory',
    word_count: 250,
    key_activities: ['robotics challenge', 'student presentations'],
    language: 'en-US',
  })

  const [currentActivity, setCurrentActivity] = useState('')
  const [output, setOutput] = useState<NewsletterOutput | null>(sampleNewsletter)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = <K extends keyof NewsletterInputs>(
    field: K,
    value: NewsletterInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addActivity = () => {
    if (currentActivity.trim()) {
      handleInputChange('key_activities', [...inputs.key_activities, currentActivity.trim()])
      setCurrentActivity('')
    }
  }

  const removeActivity = (index: number) => {
    handleInputChange(
      'key_activities',
      inputs.key_activities.filter((_, i) => i !== index)
    )
  }

  const generateNewsletter = () => {
    if (!inputs.topic || !inputs.audience) {
      alert('Please provide Topic and Audience to generate the article.')
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const mockOutput: NewsletterOutput = {
        title: inputs.topic,
        audience: inputs.audience as string,
        tone: inputs.tone || undefined,
        language: inputs.language || undefined,
        word_count: inputs.word_count || undefined,
        introduction: `Thank you for supporting ${inputs.topic}! This week we ${
          inputs.key_activities.length > 0
            ? `highlighted ${inputs.key_activities.join(', ')}`
            : 'celebrated student learning'
        } and saw tremendous growth in our learners.`,
        highlights:
          inputs.key_activities.length > 0
            ? inputs.key_activities.map((activity) => ({
                heading: activity
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
                content: `Students engaged enthusiastically in ${activity}, applying classroom concepts and showcasing their creativity.`,
              }))
            : [
                {
                  heading: 'Learning in Action',
                  content:
                    'Students collaborated on hands-on tasks that connected academic learning to real-life skills.',
                },
              ],
        quote:
          inputs.tone === 'reflective'
            ? '"This experience reminded us how reflection deepens learning," noted one of our teachers.'
            : inputs.tone === 'informative'
            ? '"The data shows that students’ engagement increased throughout the week," shared the program lead.'
            : '"The joy on students’ faces was unforgettable," shared one of our classroom teachers.',
        closing:
          inputs.audience === 'school_leadership'
            ? 'Thank you for your continued leadership in supporting innovative learning experiences across our school.'
            : inputs.audience === 'community'
            ? 'We appreciate our community partners for helping bring these learning experiences to life.'
            : 'Families, your encouragement and partnership make all the difference. Thank you for cheering on our learners!',
        call_to_action:
          inputs.audience === 'parents'
            ? 'Join us for next month’s Learning Showcase evening to see student projects firsthand.'
            : inputs.audience === 'community'
            ? 'Consider volunteering at our upcoming events or sharing expertise with our classes.'
            : 'We look forward to collaborating on future initiatives that elevate student learning.',
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
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Newsletter Article Generator</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Craft ready-to-share newsletter stories tailored to your audience
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Story Inputs</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputs.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input-field"
                  placeholder='e.g., "STEM Week Highlights"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs.audience}
                  onChange={(e) =>
                    handleInputChange('audience', e.target.value as NewsletterInputs['audience'])
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select audience</option>
                  <option value="parents">Parents</option>
                  <option value="community">Community</option>
                  <option value="school_leadership">School Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={inputs.tone}
                  onChange={(e) =>
                    handleInputChange('tone', (e.target.value || '') as NewsletterInputs['tone'])
                  }
                  className="input-field"
                >
                  <option value="">Select tone (optional)</option>
                  <option value="celebratory">Celebratory</option>
                  <option value="informative">Informative</option>
                  <option value="reflective">Reflective</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Word Count</label>
                <input
                  type="number"
                  min="50"
                  value={inputs.word_count}
                  onChange={(e) =>
                    handleInputChange('word_count', parseInt(e.target.value) || '')
                  }
                  className="input-field"
                  placeholder="e.g., 250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Activities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentActivity}
                    onChange={(e) => setCurrentActivity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addActivity()
                      }
                    }}
                    className="input-field flex-1"
                    placeholder='e.g., "robotics challenge"'
                  />
                  <button
                    type="button"
                    onClick={addActivity}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {inputs.key_activities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inputs.key_activities.map((activity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                      >
                        {activity}
                        <button
                          type="button"
                          onClick={() => removeActivity(index)}
                          className="hover:text-primary-900"
                          aria-label={`Remove ${activity}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                onClick={generateNewsletter}
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
                    <span>Generate Article</span>
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
                <h2 className="text-lg font-semibold text-gray-900">Generated Newsletter Article</h2>
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
                      <strong>Audience:</strong> {output.audience}
                    </span>
                    {output.tone && (
                      <span>
                        <strong>Tone:</strong> {output.tone}
                      </span>
                    )}
                    {output.word_count && (
                      <span>
                        <strong>Approx. Word Count:</strong> {output.word_count}
                      </span>
                    )}
                    {output.language && (
                      <span>
                        <strong>Language:</strong> {output.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm">{output.introduction}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Highlights</h4>
                  <div className="space-y-3">
                    {output.highlights.map((section, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-1">{section.heading}</h5>
                        <p className="text-sm text-gray-700">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quote</h4>
                  <blockquote className="border-l-4 border-primary-400 pl-4 italic text-gray-700 text-sm">
                    {output.quote}
                  </blockquote>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Closing</h4>
                  <p className="text-sm text-gray-700">{output.closing}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Call to Action</h4>
                  <p className="text-sm text-gray-700">{output.call_to_action}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your newsletter article will appear here
                </h3>
                <p className="text-gray-600">
                  Provide the topic and audience, then click "Generate Article" to preview the story.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsletterArticleGenerator




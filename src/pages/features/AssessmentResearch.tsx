import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getSectionItemBySlug } from '../../features/learningHub'
import type { LearningHubSectionItem } from '../../features/learningHub/types'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Lightbulb,
  Target,
  Star,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Eye,
  Zap,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'

interface FeedbackType {
  type: string
  description: string
  examples: string[]
  timing: string
  effectiveness: string
}

interface FormativeAssessmentStrategy {
  strategy: string
  description: string
  implementation: string[]
  benefits: string[]
  examples: string[]
}

const ASSESSMENT_SLUG = 'assessment-research'

function AssessmentResearchInner() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'research' | 'feedback' | 'strategies' | 'implementation'>('overview')

  const feedbackTypes: FeedbackType[] = [
    {
      type: 'Task-Level Feedback',
      description: 'Feedback about how well a task was performed',
      examples: [
        'Your answer is correct',
        'You solved 8 out of 10 problems correctly',
        'Your essay has a clear introduction',
      ],
      timing: 'Immediate or soon after task completion',
      effectiveness: 'Low to moderate - focuses on the task, not learning',
    },
    {
      type: 'Process-Level Feedback',
      description: 'Feedback about the process used to complete the task',
      examples: [
        'You used the correct strategy to solve this problem',
        'Try breaking this into smaller steps',
        'Your research process was thorough',
      ],
      timing: 'During or immediately after task',
      effectiveness: 'High - helps students understand how to improve',
    },
    {
      type: 'Self-Regulation Feedback',
      description: 'Feedback that helps students monitor and control their own learning',
      examples: [
        'You checked your work carefully before submitting',
        'What strategies did you use to solve this?',
        'How confident are you in your answer?',
      ],
      timing: 'During learning process',
      effectiveness: 'Very high - develops metacognitive skills',
    },
  ]

  const formativeStrategies: FormativeAssessmentStrategy[] = [
    {
      strategy: 'Exit Tickets',
      description: 'Quick questions or prompts at the end of a lesson to check understanding',
      implementation: [
        'Prepare 1-3 questions aligned to lesson objectives',
        'Give students 2-3 minutes at end of class',
        'Collect and review responses',
        'Use data to plan next lesson',
      ],
      benefits: [
        'Quick check of understanding',
        'Low-stakes assessment',
        'Immediate feedback for teacher',
        'Helps identify misconceptions',
      ],
      examples: [
        'What was the main idea of today\'s lesson?',
        'What question do you still have?',
        'Rate your understanding 1-5',
      ],
    },
    {
      strategy: 'Think-Pair-Share',
      description: 'Students think individually, discuss with a partner, then share with class',
      implementation: [
        'Pose a question or prompt',
        'Give students 1-2 minutes to think',
        'Students discuss with partner for 2-3 minutes',
        'Select pairs to share with whole class',
      ],
      benefits: [
        'All students engage in thinking',
        'Builds confidence through discussion',
        'Reveals understanding through explanation',
        'Promotes collaboration',
      ],
      examples: [
        'Explain the water cycle to your partner',
        'What do you think causes this phenomenon?',
        'Compare your solution with your partner\'s',
      ],
    },
    {
      strategy: 'One-Minute Papers',
      description: 'Students write for one minute about what they learned',
      implementation: [
        'Pose a prompt at end of lesson',
        'Give students exactly one minute to write',
        'Collect papers',
        'Review to identify patterns',
      ],
      benefits: [
        'Quick assessment of learning',
        'Encourages reflection',
        'Identifies gaps in understanding',
        'Low preparation required',
      ],
      examples: [
        'What was the most important thing you learned today?',
        'What was confusing or unclear?',
        'What would you like to learn more about?',
      ],
    },
    {
      strategy: 'Traffic Light Cards',
      description: 'Students use colored cards to indicate understanding level',
      implementation: [
        'Provide red, yellow, green cards',
        'Ask students to show card based on understanding',
        'Quick visual check of class understanding',
        'Follow up with students showing red/yellow',
      ],
      benefits: [
        'Immediate visual feedback',
        'Non-verbal assessment',
        'Quick to implement',
        'Encourages self-assessment',
      ],
      examples: [
        'Show green if you understand, yellow if unsure, red if confused',
        'Use cards to answer quick questions',
        'Check understanding after each concept',
      ],
    },
  ]

  const researchFindings = [
    {
      finding: 'Formative assessment can double learning speed',
      source: 'Black & Wiliam (1998)',
      evidence: 'Students in classes using formative assessment showed learning gains equivalent to moving from the 50th to the 65th percentile.',
      practicalTip: 'Use formative assessment regularly, not just for grading',
    },
    {
      finding: 'Feedback must be specific and actionable',
      source: 'Hattie & Timperley (2007)',
      evidence: 'Effective feedback focuses on the task, process, or self-regulation, not the person. It tells students what to do next.',
      practicalTip: 'Instead of "good job," say "Your evidence supports your claim. Try adding a counterargument."',
    },
    {
      finding: 'Timing matters',
      source: 'Shute (2008)',
      evidence: 'Feedback is most effective when given during learning, not after. Immediate feedback helps students correct errors before they become habits.',
      practicalTip: 'Provide feedback during practice, not just on final assessments',
    },
    {
      finding: 'Students need to act on feedback',
      source: 'Sadler (1989)',
      evidence: 'Feedback only works if students use it to improve. Without action, feedback is wasted.',
      practicalTip: 'Build in time for students to revise work based on feedback',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Research Insight
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">Assessment</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    7 min read
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Formative Assessment: What Research Says</h1>
                <p className="mt-2 text-green-100">
                  Key findings from Black & Wiliam and how to implement feedback loops effectively
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 w-4" />
                <span>Practical Strategies</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 w-4" />
                <span>High Impact</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Sections</h3>
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'research', label: 'Research Findings', icon: BookOpen },
                { id: 'feedback', label: 'Feedback Loops', icon: RefreshCw },
                { id: 'strategies', label: 'Strategies', icon: ClipboardCheck },
                { id: 'implementation', label: 'Implementation', icon: Zap },
              ].map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-green-50 border-2 border-green-300 text-green-900'
                        : 'border-2 border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Formative Assessment?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Formative assessment is the process of gathering evidence about student learning during instruction 
                    to inform teaching and learning. Unlike summative assessment (which evaluates learning at the end), 
                    formative assessment happens continuously throughout the learning process.
                  </p>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Characteristics</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Ongoing:</strong> Happens continuously during instruction</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Low-stakes:</strong> Not used for grades, but for learning</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Actionable:</strong> Provides information to adjust teaching and learning</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Student-centered:</strong> Involves students in the assessment process</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">Assessment FOR Learning</h4>
                      <p className="text-sm text-gray-700">
                        Formative assessment helps teachers understand what students know and adjust instruction accordingly.
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">Assessment OF Learning</h4>
                      <p className="text-sm text-gray-700">
                        Summative assessment evaluates what students have learned at the end of a unit or course.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Research Findings Section */}
            {activeSection === 'research' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Black & Wiliam's Research</h2>
                  <p className="text-gray-700 mb-6">
                    Paul Black and Dylan Wiliam's 1998 review of research on formative assessment found compelling evidence 
                    for its effectiveness. Their work has shaped how we understand assessment for learning.
                  </p>
                  <div className="space-y-4 mb-6">
                    {researchFindings.map((finding, idx) => (
                      <div key={idx} className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{finding.finding}</h4>
                          <Star className="h-5 w-5 text-green-600 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-600 italic mb-3">{finding.source}</p>
                        <p className="text-gray-700 mb-3">{finding.evidence}</p>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 mb-1">Practical Tip:</p>
                          <p className="text-sm text-gray-700">{finding.practicalTip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">The Feedback Loop</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Gather Evidence</h4>
                          <p className="text-sm text-gray-700">Collect information about student understanding through observations, questions, or tasks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Interpret Evidence</h4>
                          <p className="text-sm text-gray-700">Analyze what the evidence tells you about student learning and misconceptions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Take Action</h4>
                          <p className="text-sm text-gray-700">Adjust instruction, provide feedback, or modify learning activities based on evidence</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Repeat</h4>
                          <p className="text-sm text-gray-700">Continue the cycle throughout instruction to ensure continuous improvement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Loops Section */}
            {activeSection === 'feedback' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Feedback</h2>
                  <p className="text-gray-700 mb-6">
                    Not all feedback is created equal. Research shows that effective feedback focuses on the task, 
                    process, or self-regulation rather than the person.
                  </p>
                  <div className="space-y-4">
                    {feedbackTypes.map((feedback, idx) => (
                      <div key={idx} className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{feedback.type}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                feedback.effectiveness.includes('Very high') ? 'bg-green-100 text-green-700' :
                                feedback.effectiveness.includes('High') ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {feedback.effectiveness}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{feedback.description}</p>
                            <div className="bg-white rounded-lg p-4 border border-green-100 mb-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
                              <ul className="space-y-1">
                                {feedback.examples.map((example, exIdx) => (
                                  <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <MessageSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>"{example}"</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {feedback.timing}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback Best Practices</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Be specific:</strong> Tell students exactly what they did well and what needs improvement</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Focus on the task:</strong> Avoid personal comments; focus on the work</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Be timely:</strong> Provide feedback while learning is still happening</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Make it actionable:</strong> Tell students what to do next</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Involve students:</strong> Encourage self-assessment and peer feedback</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Strategies Section */}
            {activeSection === 'strategies' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Formative Assessment Strategies</h2>
                  <p className="text-gray-700 mb-6">
                    These practical strategies can be implemented immediately in your classroom to gather evidence 
                    of student learning and provide effective feedback.
                  </p>
                  <div className="space-y-4">
                    {formativeStrategies.map((strategy, idx) => (
                      <div key={idx} className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{strategy.strategy}</h3>
                        <p className="text-gray-700 mb-4">{strategy.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-green-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Implementation Steps:</h4>
                            <ol className="space-y-2">
                              {strategy.implementation.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                                    {stepIdx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits:</h4>
                            <ul className="space-y-2">
                              {strategy.benefits.map((benefit, benIdx) => (
                                <li key={benIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-100">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Example Prompts:</h4>
                          <div className="flex flex-wrap gap-2">
                            {strategy.examples.map((example, exIdx) => (
                              <span key={exIdx} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Implementation Section */}
            {activeSection === 'implementation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Guide</h2>
                  <p className="text-gray-700 mb-6">
                    Successfully implementing formative assessment requires planning, consistency, and a focus on using 
                    evidence to improve learning.
                  </p>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">1. Start Small</h4>
                        <p className="text-sm text-gray-700">
                          Choose one or two formative assessment strategies to implement consistently. Master these before adding more.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">2. Plan Your Questions</h4>
                        <p className="text-sm text-gray-700">
                          Prepare questions or prompts aligned to your learning objectives. Good formative assessment questions reveal understanding, not just recall.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">3. Create a Routine</h4>
                        <p className="text-sm text-gray-700">
                          Build formative assessment into your regular lesson structure. Consistency helps students understand expectations.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">4. Use the Data</h4>
                        <p className="text-sm text-gray-700">
                          Actually use the information you gather to adjust instruction. If you collect data but don't act on it, it's not formative assessment.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">5. Involve Students</h4>
                        <p className="text-sm text-gray-700">
                          Teach students to self-assess and peer-assess. When students understand their own learning, they become more effective learners.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Pitfalls to Avoid</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>Grading everything:</strong> Formative assessment shouldn't be graded. Keep it low-stakes.</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>Collecting but not using:</strong> If you gather data but don't act on it, it's not formative assessment.</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>Vague feedback:</strong> "Good job" doesn't help students improve. Be specific.</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>Only using at the end:</strong> Formative assessment should happen throughout learning, not just at the end.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Action Steps</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <span>Choose one formative assessment strategy to try this week</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <span>Plan 2-3 questions aligned to your learning objectives</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <span>Implement the strategy and collect evidence</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <span>Use the evidence to adjust your next lesson</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        <span>Reflect on what worked and what to improve</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AssessmentResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <AssessmentResearchInner />
}

export default function AssessmentResearch() {
  const row = getSectionItemBySlug('research-insights-library', ASSESSMENT_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <AssessmentResearchView item={row} />
}




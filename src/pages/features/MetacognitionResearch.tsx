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
  Brain,
  MessageSquare,
  Users,
  Search,
  RefreshCw,
} from 'lucide-react'

interface MetacognitiveComponent {
  component: string
  description: string
  examples: string[]
  teachingStrategies: string[]
}

interface Strategy {
  strategy: string
  description: string
  examples: string[]
  impact: string
}

const METACOGNITION_SLUG = 'metacognition-research'

function MetacognitionResearchInner() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'components' | 'strategies' | 'reflection' | 'implementation'>('overview')

  const metacognitiveComponents: MetacognitiveComponent[] = [
    {
      component: 'Metacognitive Knowledge',
      description: 'What students know about their own thinking and learning processes.',
      examples: [
        'Knowing that you learn better by reading than listening',
        'Understanding that math problems require careful reading',
        'Recognizing that you need quiet to concentrate',
        'Knowing which study strategies work best for you',
      ],
      teachingStrategies: [
        'Help students identify their learning preferences',
        'Teach about different learning styles and strategies',
        'Encourage self-awareness about strengths and challenges',
        'Discuss how the brain learns',
      ],
    },
    {
      component: 'Metacognitive Regulation',
      description: 'How students control and monitor their learning processes.',
      examples: [
        'Planning how to approach a task',
        'Monitoring understanding while reading',
        'Evaluating progress toward goals',
        'Adjusting strategies when something isn\'t working',
      ],
      teachingStrategies: [
        'Teach planning strategies (think before acting)',
        'Model monitoring techniques (checking for understanding)',
        'Provide self-assessment tools',
        'Encourage strategy adjustment',
      ],
    },
    {
      component: 'Metacognitive Experiences',
      description: 'Awareness and feelings during the learning process.',
      examples: [
        'Feeling confused and recognizing it',
        'Experiencing "aha!" moments',
        'Noticing when something clicks',
        'Feeling confident or uncertain about understanding',
      ],
      teachingStrategies: [
        'Normalize confusion as part of learning',
        'Help students recognize their feelings about learning',
        'Celebrate moments of understanding',
        'Teach students to trust their instincts',
      ],
    },
  ]

  const strategies: Strategy[] = [
    {
      strategy: 'Think-Alouds',
      description: 'Model your thinking process out loud to show students how experts approach problems.',
      examples: [
        'Read a passage and verbalize your thoughts',
        'Solve a math problem while explaining your reasoning',
        'Show how you check your work',
        'Demonstrate how you choose strategies',
      ],
      impact: 'Students see expert thinking in action and can imitate the process',
    },
    {
      strategy: 'Planning Prompts',
      description: 'Ask questions that help students plan before starting tasks.',
      examples: [
        'What do you already know about this topic?',
        'What strategies have worked for you before?',
        'What resources do you need?',
        'How long will this take?',
        'What might be challenging?',
      ],
      impact: 'Encourages students to think before acting, improving outcomes',
    },
    {
      strategy: 'Self-Questioning',
      description: 'Teach students to ask themselves questions during learning.',
      examples: [
        'Do I understand what I just read?',
        'Does this make sense?',
        'What do I need to clarify?',
        'How does this connect to what I know?',
        'Am I on the right track?',
      ],
      impact: 'Helps students monitor their understanding in real-time',
    },
    {
      strategy: 'Reflection Journals',
      description: 'Regular writing about learning experiences and strategies.',
      examples: [
        'What did I learn today?',
        'What strategies helped me?',
        'What was challenging and why?',
        'What would I do differently next time?',
        'How did I feel during this task?',
      ],
      impact: 'Develops self-awareness and helps students identify effective strategies',
    },
    {
      strategy: 'Strategy Instruction',
      description: 'Explicitly teach learning strategies and when to use them.',
      examples: [
        'Teach specific reading comprehension strategies',
        'Show different problem-solving approaches',
        'Demonstrate note-taking methods',
        'Explain when to use each strategy',
        'Practice strategy selection',
      ],
      impact: 'Gives students tools and knowledge about when to use them',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/learning-hub')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold">Back to Learning Hub</span>
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wide">
                    Learning strategies
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    8 min read
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Metacognition: Teaching Students to Think About Thinking
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Research-backed strategies for developing metacognitive skills that improve learning outcomes. 
                  Based on John Flavell's foundational research on metacognition and self-regulated learning.
                </p>
              </div>
              <div className="flex items-center gap-2 ml-6">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6 sticky top-4 z-10">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'components', label: 'Components' },
              { id: 'strategies', label: 'Teaching Strategies' },
              { id: 'reflection', label: 'Reflection Tools' },
              { id: 'implementation', label: 'Implementation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeSection === tab.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-green-600" />
                  What is Metacognition?
                </h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>
                    Metacognition is "thinking about thinking" - the awareness and understanding of one's own thought processes. 
                    It involves knowing what you know, knowing what you don't know, and knowing how to learn.
                  </p>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Metacognition Matters</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Improved Learning Outcomes</p>
                          <p className="text-sm text-gray-700">Students who use metacognitive strategies perform better academically</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Transfer of Learning</p>
                          <p className="text-sm text-gray-700">Metacognitive skills transfer across subjects and contexts</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Self-Regulated Learning</p>
                          <p className="text-sm text-gray-700">Students become more independent and effective learners</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Lifelong Learning</p>
                          <p className="text-sm text-gray-700">Metacognitive skills support learning throughout life</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-emerald-600" />
                  The Metacognitive Cycle
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { step: 'Plan', icon: Target, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
                    { step: 'Monitor', icon: Eye, bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
                    { step: 'Evaluate', icon: Search, bgColor: 'bg-green-50', borderColor: 'border-green-200', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
                    { step: 'Adjust', icon: RefreshCw, bgColor: 'bg-purple-50', borderColor: 'border-purple-200', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className={`${item.bgColor} rounded-xl p-6 border ${item.borderColor} text-center`}>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.iconBg} mb-3`}>
                          <Icon className={`h-6 w-6 ${item.iconColor}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900">{item.step}</h3>
                      </div>
                    )
                  })}
                </div>
                <p className="text-sm text-gray-700 mt-4 text-center">
                  Effective learners continuously cycle through planning, monitoring, evaluating, and adjusting their approach.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'components' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Three Components of Metacognition</h2>
                <div className="space-y-6">
                  {metacognitiveComponents.map((component, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{component.component}</h3>
                          <p className="text-gray-700 mb-4">{component.description}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Examples</p>
                          <ul className="space-y-1">
                            {component.examples.map((example, exIdx) => (
                              <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-gray-400">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Teaching Strategies</p>
                          <ul className="space-y-1">
                            {component.teachingStrategies.map((strategy, stIdx) => (
                              <li key={stIdx} className="flex items-start gap-2 text-sm text-green-700">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{strategy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'strategies' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Strategies for Metacognition</h2>
                <div className="space-y-6">
                  {strategies.map((strategy, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{strategy.strategy}</h3>
                          <p className="text-gray-700 mb-4">{strategy.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Examples</p>
                            <ul className="space-y-2">
                              {strategy.examples.map((example, exIdx) => (
                                <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <p className="text-xs font-semibold text-green-800 mb-1">Impact</p>
                            <p className="text-sm text-green-700">{strategy.impact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reflection' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reflection and Self-Assessment Tools</h2>
                
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Before Learning</h3>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Questions to Ask:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• What do I already know about this topic?</li>
                        <li>• What do I want to learn?</li>
                        <li>• What strategies have worked for me before?</li>
                        <li>• What might be challenging?</li>
                        <li>• How will I know if I understand?</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">During Learning</h3>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Monitoring Questions:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Do I understand what I'm reading/learning?</li>
                        <li>• Am I making progress toward my goal?</li>
                        <li>• Is my strategy working?</li>
                        <li>• What do I need to clarify?</li>
                        <li>• Should I try a different approach?</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">After Learning</h3>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Reflection Questions:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• What did I learn?</li>
                        <li>• What strategies helped me?</li>
                        <li>• What was challenging and why?</li>
                        <li>• What would I do differently next time?</li>
                        <li>• How can I apply this learning?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'implementation' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Guide</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Week 1-2: Foundation
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Introduce the concept of metacognition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Model think-alouds during instruction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Start using planning prompts before tasks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Teach self-questioning strategies</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Week 3-4: Practice
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Have students practice think-alouds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Introduce reflection journals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Teach specific learning strategies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Use self-assessment checklists</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Ongoing: Sustain
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Integrate metacognitive prompts into daily lessons</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Regularly reflect on learning processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Celebrate metacognitive growth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Help students transfer strategies across subjects</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Wins</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">Start Today</p>
                    <p className="text-sm text-green-700">Model one think-aloud during a lesson</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">This Week</p>
                    <p className="text-sm text-blue-700">Add planning prompts before a major assignment</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-900 mb-2">This Month</p>
                    <p className="text-sm text-purple-700">Introduce reflection journals for one subject</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <p className="text-sm font-semibold text-pink-900 mb-2">Ongoing</p>
                    <p className="text-sm text-pink-700">Use self-questioning prompts regularly</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function MetacognitionResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <MetacognitionResearchInner />
}

export default function MetacognitionResearch() {
  const row = getSectionItemBySlug('research-insights-library', METACOGNITION_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <MetacognitionResearchView item={row} />
}


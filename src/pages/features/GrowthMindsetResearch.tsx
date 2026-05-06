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
  ArrowUp,
  ArrowDown,
  Heart,
} from 'lucide-react'

interface MindsetCharacteristic {
  characteristic: string
  fixedMindset: string
  growthMindset: string
  teacherAction: string
}

interface Strategy {
  strategy: string
  description: string
  examples: string[]
  impact: string
}

const GROWTH_SLUG = 'growth-mindset-research'

function GrowthMindsetResearchInner() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'characteristics' | 'strategies' | 'language' | 'implementation'>('overview')

  const mindsetCharacteristics: MindsetCharacteristic[] = [
    {
      characteristic: 'Challenges',
      fixedMindset: 'Avoids challenges, fears failure',
      growthMindset: 'Embraces challenges, sees failure as learning',
      teacherAction: 'Provide tasks that are challenging but achievable with effort',
    },
    {
      characteristic: 'Obstacles',
      fixedMindset: 'Gives up easily when facing difficulties',
      growthMindset: 'Persists through obstacles, tries new strategies',
      teacherAction: 'Teach problem-solving strategies and celebrate effort',
    },
    {
      characteristic: 'Effort',
      fixedMindset: 'Sees effort as fruitless or a sign of weakness',
      growthMindset: 'Views effort as path to mastery',
      teacherAction: 'Praise process and effort, not just outcomes',
    },
    {
      characteristic: 'Criticism',
      fixedMindset: 'Ignores or rejects constructive feedback',
      growthMindset: 'Learns from criticism and feedback',
      teacherAction: 'Frame feedback as opportunities for growth',
    },
    {
      characteristic: 'Success of Others',
      fixedMindset: 'Feels threatened by others\' success',
      growthMindset: 'Finds inspiration in others\' success',
      teacherAction: 'Use peer examples to show what\'s possible with effort',
    },
  ]

  const strategies: Strategy[] = [
    {
      strategy: 'Praise Process, Not Intelligence',
      description: 'Focus feedback on effort, strategies, and process rather than innate ability.',
      examples: [
        'Instead of "You\'re so smart!" say "You worked hard and used great strategies!"',
        'Instead of "You\'re a natural at math" say "Your practice and persistence paid off!"',
        'Instead of "You\'re talented" say "You tried different approaches until you found one that worked!"',
      ],
      impact: 'Students learn that ability can be developed through effort',
    },
    {
      strategy: 'Teach About Brain Plasticity',
      description: 'Help students understand that their brains can grow and change.',
      examples: [
        'Explain how neural pathways strengthen with practice',
        'Share stories of people who improved through effort',
        'Use brain science to show learning changes the brain',
        'Create "brain growth" celebrations when students overcome challenges',
      ],
      impact: 'Students develop scientific understanding of their potential',
    },
    {
      strategy: 'Reframe Mistakes as Learning Opportunities',
      description: 'Help students see mistakes as valuable information, not failures.',
      examples: [
        'Create a "Mistakes That Made Me Think" board',
        'Model making mistakes and learning from them',
        'Use "yet" language: "You haven\'t mastered this yet"',
        'Celebrate "productive failures" that lead to understanding',
      ],
      impact: 'Reduces fear of failure and encourages risk-taking',
    },
    {
      strategy: 'Set Learning Goals, Not Performance Goals',
      description: 'Focus on what students will learn rather than what they will achieve.',
      examples: [
        'Instead of "Get an A" use "Learn to solve multi-step equations"',
        'Instead of "Be the best" use "Improve your writing clarity"',
        'Create goals like "Master 5 new vocabulary words this week"',
        'Track progress toward learning goals, not just grades',
      ],
      impact: 'Shifts focus from proving ability to developing ability',
    },
    {
      strategy: 'Use Growth-Oriented Language',
      description: 'Choose words that emphasize development and potential.',
      examples: [
        'Use "not yet" instead of "can\'t"',
        'Say "challenge" instead of "difficulty"',
        'Use "developing" instead of "struggling"',
        'Frame feedback as "next steps" rather than "what\'s wrong"',
      ],
      impact: 'Language shapes thinking and beliefs about ability',
    },
  ]

  const languageExamples = [
    {
      fixed: 'You\'re so smart!',
      growth: 'You worked hard and figured it out!',
      reason: 'Praise effort and process, not intelligence',
    },
    {
      fixed: 'You\'re a natural at this',
      growth: 'Your practice is really paying off!',
      reason: 'Emphasize that skill comes from practice',
    },
    {
      fixed: 'You got it wrong',
      growth: 'What did you learn from trying that?',
      reason: 'Frame mistakes as learning opportunities',
    },
    {
      fixed: 'This is too hard for you',
      growth: 'This is challenging. What strategies can we try?',
      reason: 'Emphasize that challenges can be overcome',
    },
    {
      fixed: 'You\'re not good at math',
      growth: 'You\'re working on building your math skills',
      reason: 'Use growth-oriented language',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
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
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wide">
                    Student motivation
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    6 min read
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Growth Mindset: Dweck's Research in Practice
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  How to cultivate a growth mindset in students and transform their approach to learning challenges. 
                  Based on Carol Dweck's groundbreaking research on the power of believing you can improve.
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
              { id: 'characteristics', label: 'Fixed vs Growth' },
              { id: 'strategies', label: 'Strategies' },
              { id: 'language', label: 'Language Matters' },
              { id: 'implementation', label: 'Implementation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeSection === tab.id
                    ? 'bg-purple-600 text-white'
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
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                  What is Growth Mindset?
                </h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>
                    Carol Dweck's research revolutionized our understanding of how beliefs about intelligence affect learning. 
                    She identified two mindsets:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-bold text-red-900 mb-3">Fixed Mindset</h3>
                      <p className="text-sm text-red-800 mb-3">
                        The belief that intelligence and abilities are fixed traits that cannot be changed.
                      </p>
                      <ul className="space-y-2 text-sm text-red-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>Believes intelligence is innate</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>Avoids challenges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>Gives up easily</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>Sees effort as fruitless</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-bold text-green-900 mb-3">Growth Mindset</h3>
                      <p className="text-sm text-green-800 mb-3">
                        The belief that intelligence and abilities can be developed through dedication and hard work.
                      </p>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>Believes intelligence can grow</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>Embraces challenges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>Persists through obstacles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>Sees effort as path to mastery</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  Research Findings
                </h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Research Results</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Students with growth mindsets show significantly higher achievement over time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Praising intelligence can actually decrease motivation and performance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Growth mindset interventions can improve grades, especially for struggling students</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Mindsets can be changed through targeted teaching and feedback</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'characteristics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Fixed vs Growth Mindset Characteristics</h2>
                <div className="space-y-4">
                  {mindsetCharacteristics.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.characteristic}</h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Fixed Mindset</p>
                          <p className="text-sm text-red-800">{item.fixedMindset}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Growth Mindset</p>
                          <p className="text-sm text-green-800">{item.growthMindset}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Teacher Action</p>
                        <p className="text-sm text-blue-800">{item.teacherAction}</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategies for Cultivating Growth Mindset</h2>
                <div className="space-y-6">
                  {strategies.map((strategy, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{strategy.strategy}</h3>
                          <p className="text-gray-700 mb-4">{strategy.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Examples</p>
                            <ul className="space-y-2">
                              {strategy.examples.map((example, exIdx) => (
                                <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                            <p className="text-xs font-semibold text-purple-800 mb-1">Impact</p>
                            <p className="text-sm text-purple-700">{strategy.impact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">The Power of Language</h2>
                <p className="text-gray-700 mb-6">
                  The words we use shape students' beliefs about their abilities. Here's how to reframe common phrases:
                </p>
                <div className="space-y-4">
                  {languageExamples.map((example, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Fixed Mindset Language</p>
                          <p className="text-sm text-red-800 italic">"{example.fixed}"</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Growth Mindset Language</p>
                          <p className="text-sm text-green-800 italic">"{example.growth}"</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-800 mb-1">Why This Matters</p>
                        <p className="text-sm text-blue-700">{example.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'implementation' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Guide</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Week 1-2: Foundation
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Introduce the concept of growth mindset to students</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Teach about brain plasticity and how the brain grows</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Start using growth-oriented language in your feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Create a "Mistakes Help Us Learn" display</span>
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
                        <span>Implement process praise in all feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Help students set learning goals instead of performance goals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Teach students to reframe challenges as opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Celebrate effort and persistence, not just achievement</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Ongoing: Sustain
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Consistently use growth mindset language</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Share stories of growth and improvement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Model growth mindset in your own learning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Regularly reflect on mindset with students</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Wins</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-900 mb-2">Start Today</p>
                    <p className="text-sm text-purple-700">Replace one instance of intelligence praise with process praise</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">This Week</p>
                    <p className="text-sm text-blue-700">Add "yet" to your vocabulary when students say "I can't"</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">This Month</p>
                    <p className="text-sm text-green-700">Teach a lesson about brain plasticity and growth</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm font-semibold text-amber-900 mb-2">Ongoing</p>
                    <p className="text-sm text-amber-700">Celebrate mistakes that lead to learning</p>
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

export function GrowthMindsetResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <GrowthMindsetResearchInner />
}

export default function GrowthMindsetResearch() {
  const row = getSectionItemBySlug('research-insights-library', GROWTH_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <GrowthMindsetResearchView item={row} />
}




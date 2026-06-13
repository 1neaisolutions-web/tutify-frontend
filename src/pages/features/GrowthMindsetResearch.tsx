import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { navigateBackToLearningHubCatalog } from '../../features/learningHub/useLearningHubBackNavigation'
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

import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
            onClick={() => navigateBackToLearningHubCatalog(navigate)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold">{t('growthMindsetResearch.backToLearningHub')}</span>
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wide">{t('growthMindsetResearch.studentMotivation')}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />{t('growthMindsetResearch.kMinRead')}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('growthMindsetResearch.growthMindsetDweckSResearchInPractice')}</h1>
                <p className="text-lg text-gray-700 leading-relaxed">{t('growthMindsetResearch.howToCultivateAGrowthMindsetInStudentsAndTransform')}</p>
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
                  <Lightbulb className="h-6 w-6 text-purple-600" />{t('growthMindsetResearch.whatIsGrowthMindset')}</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>{t('growthMindsetResearch.carolDweckSResearchRevolutionizedOurUnderstandingOfHowB')}</p>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-bold text-red-900 mb-3">{t('growthMindsetResearch.fixedMindset')}</h3>
                      <p className="text-sm text-red-800 mb-3">{t('growthMindsetResearch.theBeliefThatIntelligenceAndAbilitiesAreFixedTraitsThat')}</p>
                      <ul className="space-y-2 text-sm text-red-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>{t('growthMindsetResearch.believesIntelligenceIsInnate')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>{t('growthMindsetResearch.avoidsChallenges')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>{t('growthMindsetResearch.givesUpEasily')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>{t('growthMindsetResearch.seesEffortAsFruitless')}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-bold text-green-900 mb-3">{t('growthMindsetResearch.growthMindset')}</h3>
                      <p className="text-sm text-green-800 mb-3">{t('growthMindsetResearch.theBeliefThatIntelligenceAndAbilitiesCanBeDevelopedThro')}</p>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>{t('growthMindsetResearch.believesIntelligenceCanGrow')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>{t('growthMindsetResearch.embracesChallenges')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>{t('growthMindsetResearch.persistsThroughObstacles')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>{t('growthMindsetResearch.seesEffortAsPathToMastery')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />{t('growthMindsetResearch.researchFindings')}</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('growthMindsetResearch.keyResearchResults')}</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.studentsWithGrowthMindsetsShowSignificantlyHigherAchiev')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.praisingIntelligenceCanActuallyDecreaseMotivationAndPer')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.growthMindsetInterventionsCanImproveGradesEspeciallyFor')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.mindsetsCanBeChangedThroughTargetedTeachingAndFeedback')}</span>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('growthMindsetResearch.fixedVsGrowthMindsetCharacteristics')}</h2>
                <div className="space-y-4">
                  {mindsetCharacteristics.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.characteristic}</h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">{t('growthMindsetResearch.fixedMindset')}</p>
                          <p className="text-sm text-red-800">{item.fixedMindset}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">{t('growthMindsetResearch.growthMindset')}</p>
                          <p className="text-sm text-green-800">{item.growthMindset}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{t('growthMindsetResearch.teacherAction')}</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('growthMindsetResearch.strategiesForCultivatingGrowthMindset')}</h2>
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
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('growthMindsetResearch.examples')}</p>
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
                            <p className="text-xs font-semibold text-purple-800 mb-1">{t('growthMindsetResearch.impact')}</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('growthMindsetResearch.thePowerOfLanguage')}</h2>
                <p className="text-gray-700 mb-6">{t('growthMindsetResearch.theWordsWeUseShapeStudentsBeliefsAboutTheirAbilities')}</p>
                <div className="space-y-4">
                  {languageExamples.map((example, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">{t('growthMindsetResearch.fixedMindsetLanguage')}</p>
                          <p className="text-sm text-red-800 italic">"{example.fixed}"</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">{t('growthMindsetResearch.growthMindsetLanguage')}</p>
                          <p className="text-sm text-green-800 italic">"{example.growth}"</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-800 mb-1">{t('growthMindsetResearch.whyThisMatters')}</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('growthMindsetResearch.implementationGuide')}</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />{t('growthMindsetResearch.week12Foundation')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.introduceTheConceptOfGrowthMindsetToStudents')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.teachAboutBrainPlasticityAndHowTheBrainGrows')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.startUsingGrowthOrientedLanguageInYourFeedback')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.createAMistakesHelpUsLearnDisplay')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />{t('growthMindsetResearch.week34Practice')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.implementProcessPraiseInAllFeedback')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.helpStudentsSetLearningGoalsInsteadOfPerformanceGoals')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.teachStudentsToReframeChallengesAsOpportunities')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.celebrateEffortAndPersistenceNotJustAchievement')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />{t('growthMindsetResearch.ongoingSustain')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.consistentlyUseGrowthMindsetLanguage')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.shareStoriesOfGrowthAndImprovement')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.modelGrowthMindsetInYourOwnLearning')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('growthMindsetResearch.regularlyReflectOnMindsetWithStudents')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('growthMindsetResearch.quickWins')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-900 mb-2">{t('growthMindsetResearch.startToday')}</p>
                    <p className="text-sm text-purple-700">{t('growthMindsetResearch.replaceOneInstanceOfIntelligencePraiseWithProcessPraise')}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">{t('growthMindsetResearch.thisWeek')}</p>
                    <p className="text-sm text-blue-700">{t('growthMindsetResearch.addYetToYourVocabularyWhenStudentsSayICan')}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">{t('growthMindsetResearch.thisMonth')}</p>
                    <p className="text-sm text-green-700">{t('growthMindsetResearch.teachALessonAboutBrainPlasticityAndGrowth')}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm font-semibold text-amber-900 mb-2">{t('growthMindsetResearch.ongoing')}</p>
                    <p className="text-sm text-amber-700">{t('growthMindsetResearch.celebrateMistakesThatLeadToLearning')}</p>
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




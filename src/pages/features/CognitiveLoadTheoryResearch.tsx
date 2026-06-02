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
  AlertTriangle,
  Layers,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'
interface CognitiveLoadType {
  type: string
  description: string
  examples: string[]
  strategies: string[]
}

interface DesignPrinciple {
  principle: string
  description: string
  examples: string[]
  impact: string
}

const COGNITIVE_SLUG = 'cognitive-load-research'

function CognitiveLoadTheoryResearchInner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'types' | 'principles' | 'strategies' | 'implementation'>('overview')

  const cognitiveLoadTypes: CognitiveLoadType[] = [
    {
      type: 'Intrinsic Cognitive Load',
      description: 'The inherent difficulty of the material itself. This is determined by the complexity of the content and the learner\'s prior knowledge.',
      examples: [
        'Learning to solve quadratic equations',
        'Understanding the water cycle',
        'Memorizing vocabulary words',
        'Learning a new language',
      ],
      strategies: [
        'Break complex topics into smaller chunks',
        'Build on prior knowledge gradually',
        'Use worked examples for complex problems',
        'Sequence content from simple to complex',
      ],
    },
    {
      type: 'Extraneous Cognitive Load',
      description: 'Unnecessary mental effort caused by poor instructional design. This is the "noise" that distracts from learning.',
      examples: [
        'Cluttered slides with too much information',
        'Irrelevant animations or graphics',
        'Poorly organized materials',
        'Split attention between multiple sources',
      ],
      strategies: [
        'Eliminate irrelevant information',
        'Integrate related information spatially',
        'Use clear, simple visuals',
        'Remove decorative elements that don\'t support learning',
      ],
    },
    {
      type: 'Germane Cognitive Load',
      description: 'Mental effort devoted to processing, constructing, and automating schemas. This is the "good" cognitive load that leads to learning.',
      examples: [
        'Connecting new information to existing knowledge',
        'Identifying patterns and relationships',
        'Practicing until skills become automatic',
        'Reflecting on learning strategies',
      ],
      strategies: [
        'Encourage deep processing',
        'Help students make connections',
        'Provide opportunities for practice',
        'Use varied examples to build schemas',
      ],
    },
  ]

  const designPrinciples: DesignPrinciple[] = [
    {
      principle: 'Worked Examples Effect',
      description: 'Providing step-by-step solutions helps students learn problem-solving procedures.',
      examples: [
        'Show complete solutions before asking students to solve problems',
        'Use faded examples (gradually remove steps)',
        'Compare correct and incorrect examples',
        'Provide examples for different problem types',
      ],
      impact: 'Reduces extraneous load and helps build problem-solving schemas',
    },
    {
      principle: 'Split-Attention Effect',
      description: 'Avoid splitting attention between multiple sources of information.',
      examples: [
        'Integrate text and diagrams instead of separating them',
        'Place labels directly on diagrams',
        'Use audio narration with visuals (not text)',
        'Combine related information spatially',
      ],
      impact: 'Reduces extraneous load by eliminating need to mentally integrate information',
    },
    {
      principle: 'Modality Effect',
      description: 'Use both visual and auditory channels to present information.',
      examples: [
        'Narrate visuals instead of using on-screen text',
        'Use diagrams with spoken explanations',
        'Combine visual demonstrations with verbal instructions',
        'Present information through multiple channels',
      ],
      impact: 'Increases working memory capacity by using both channels',
    },
    {
      principle: 'Redundancy Effect',
      description: 'Avoid presenting the same information in multiple formats simultaneously.',
      examples: [
        'Don\'t read text that\'s already on screen',
        'Avoid duplicating information unnecessarily',
        'Choose the best format for each type of information',
        'Remove redundant elements',
      ],
      impact: 'Reduces extraneous load by eliminating unnecessary processing',
    },
    {
      principle: 'Expertise Reversal Effect',
      description: 'Instructional methods that help novices may hinder experts.',
      examples: [
        'Remove worked examples for advanced students',
        'Provide more autonomy to experienced learners',
        'Adjust scaffolding based on prior knowledge',
        'Use different strategies for different ability levels',
      ],
      impact: 'Optimizes load for each learner\'s level of expertise',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/learning-hub')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold">{t('cognitiveLoadTheoryResearch.backToLearningHub')}</span>
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">{t('cognitiveLoadTheoryResearch.learningScience')}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />{t('cognitiveLoadTheoryResearch.kMinRead')}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('cognitiveLoadTheoryResearch.cognitiveLoadTheoryOptimizingLearning')}</h1>
                <p className="text-lg text-gray-700 leading-relaxed">{t('cognitiveLoadTheoryResearch.understandingHowStudentsProcessInformationAndDesigningL')}</p>
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
              { id: 'types', label: 'Types of Load' },
              { id: 'principles', label: 'Design Principles' },
              { id: 'strategies', label: 'Strategies' },
              { id: 'implementation', label: 'Implementation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white'
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
                  <Brain className="h-6 w-6 text-blue-600" />{t('cognitiveLoadTheoryResearch.whatIsCognitiveLoadTheory')}</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>{t('cognitiveLoadTheoryResearch.cognitiveLoadTheoryDevelopedByJohnSwellerExplainsHowOur')}</p>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('cognitiveLoadTheoryResearch.keyConcepts')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.workingMemory')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.limitedCapacitySystemThatProcessesNewInformation')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.longTermMemory')}</p>
                          <p className="text-sm text-gray-700">Unlimited storage for organized knowledge (schemas)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.schemaConstruction')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.processOfOrganizingInformationIntoMeaningfulPatterns')}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-indigo-600" />{t('cognitiveLoadTheoryResearch.theGoalOptimizeCognitiveLoad')}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.reduce')}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{t('cognitiveLoadTheoryResearch.extraneousLoad')}</p>
                    <p className="text-xs text-gray-600">{t('cognitiveLoadTheoryResearch.eliminateUnnecessaryMentalEffortFromPoorDesign')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.manage')}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{t('cognitiveLoadTheoryResearch.intrinsicLoad')}</p>
                    <p className="text-xs text-gray-600">{t('cognitiveLoadTheoryResearch.breakDownComplexContentAppropriately')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.increase')}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{t('cognitiveLoadTheoryResearch.germaneLoad')}</p>
                    <p className="text-xs text-gray-600">{t('cognitiveLoadTheoryResearch.encourageDeepProcessingAndSchemaConstruction')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'types' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cognitiveLoadTheoryResearch.threeTypesOfCognitiveLoad')}</h2>
                <div className="space-y-6">
                  {cognitiveLoadTypes.map((load, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-red-600' : 'bg-green-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{load.type}</h3>
                          <p className="text-gray-700 mb-4">{load.description}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('cognitiveLoadTheoryResearch.examples')}</p>
                          <ul className="space-y-1">
                            {load.examples.map((example, exIdx) => (
                              <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-gray-400">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{t('cognitiveLoadTheoryResearch.strategies')}</p>
                          <ul className="space-y-1">
                            {load.strategies.map((strategy, stIdx) => (
                              <li key={stIdx} className="flex items-start gap-2 text-sm text-blue-700">
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

          {activeSection === 'principles' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cognitiveLoadTheoryResearch.instructionalDesignPrinciples')}</h2>
                <div className="space-y-6">
                  {designPrinciples.map((principle, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{principle.principle}</h3>
                          <p className="text-gray-700 mb-4">{principle.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('cognitiveLoadTheoryResearch.examples')}</p>
                            <ul className="space-y-2">
                              {principle.examples.map((example, exIdx) => (
                                <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-xs font-semibold text-blue-800 mb-1">{t('cognitiveLoadTheoryResearch.impact')}</p>
                            <p className="text-sm text-blue-700">{principle.impact}</p>
                          </div>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cognitiveLoadTheoryResearch.practicalStrategies')}</h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />{t('cognitiveLoadTheoryResearch.reduceExtraneousLoad')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.simplifyVisuals')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.removeDecorativeElementsUseClearFontsLimitColors')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.integrateInformation')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.placeLabelsOnDiagramsCombineRelatedContentSpatially')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.eliminateRedundancy')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.donTRepeatInformationInMultipleFormats')}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-blue-600" />{t('cognitiveLoadTheoryResearch.manageIntrinsicLoad')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.chunkInformation')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.breakComplexTopicsIntoSmallerManageablePieces')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.sequenceCarefully')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.startSimpleBuildComplexityGradually')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.useWorkedExamples')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.showCompleteSolutionsBeforeAskingStudentsToSolve')}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />{t('cognitiveLoadTheoryResearch.increaseGermaneLoad')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.encourageConnections')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.helpStudentsLinkNewInformationToPriorKnowledge')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.useVariedExamples')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.presentConceptsInDifferentContextsToBuildRobustSchemas')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('cognitiveLoadTheoryResearch.promoteReflection')}</p>
                          <p className="text-sm text-gray-700">{t('cognitiveLoadTheoryResearch.encourageStudentsToThinkAboutTheirThinking')}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'implementation' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cognitiveLoadTheoryResearch.implementationGuide')}</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('cognitiveLoadTheoryResearch.lessonDesignChecklist')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{t('cognitiveLoadTheoryResearch.beforeTeaching')}</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.simplifyVisualsAndRemoveClutter')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.chunkContentIntoManageablePieces')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.prepareWorkedExamples')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.integrateTextAndVisualsSpatially')}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{t('cognitiveLoadTheoryResearch.duringTeaching')}</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Use narration with visuals (not text)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.presentOneConceptAtATime')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.pauseForProcessingTime')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{t('cognitiveLoadTheoryResearch.helpStudentsMakeConnections')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t('cognitiveLoadTheoryResearch.quickWins')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">{t('cognitiveLoadTheoryResearch.startToday')}</p>
                        <p className="text-sm text-blue-700">{t('cognitiveLoadTheoryResearch.simplifyOneSlideOrHandoutByRemovingUnnecessaryElements')}</p>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <p className="text-sm font-semibold text-indigo-900 mb-2">{t('cognitiveLoadTheoryResearch.thisWeek')}</p>
                        <p className="text-sm text-indigo-700">{t('cognitiveLoadTheoryResearch.integrateLabelsDirectlyOntoDiagramsInsteadOfUsingAKey')}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-semibold text-purple-900 mb-2">{t('cognitiveLoadTheoryResearch.thisMonth')}</p>
                        <p className="text-sm text-purple-700">{t('cognitiveLoadTheoryResearch.createWorkedExamplesForComplexProblemTypes')}</p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                        <p className="text-sm font-semibold text-pink-900 mb-2">{t('cognitiveLoadTheoryResearch.ongoing')}</p>
                        <p className="text-sm text-pink-700">{t('cognitiveLoadTheoryResearch.monitorStudentUnderstandingAndAdjustPacing')}</p>
                      </div>
                    </div>
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

export function CognitiveLoadTheoryResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <CognitiveLoadTheoryResearchInner />
}

export default function CognitiveLoadTheoryResearch() {
  const row = getSectionItemBySlug('research-insights-library', COGNITIVE_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <CognitiveLoadTheoryResearchView item={row} />
}




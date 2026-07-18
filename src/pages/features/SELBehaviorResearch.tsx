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
  Heart,
  Users,
  MessageCircle,
  Shield,
  Circle,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'
interface RestorativePractice {
  practice: string
  description: string
  steps: string[]
  benefits: string[]
  examples: string[]
}

interface SELCompetency {
  competency: string
  description: string
  indicators: string[]
  classroomStrategies: string[]
  researchEvidence: string
}

const SEL_SLUG = 'sel-behavior-research'

function SELBehaviorResearchInner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'restorative' | 'sel' | 'implementation' | 'tools'>('overview')

  const restorativePractices: RestorativePractice[] = [
    {
      practice: 'Restorative Circles',
      description: 'Structured dialogue process where participants sit in a circle and share thoughts, feelings, and perspectives.',
      steps: [
        'Set agreements for respectful participation',
        'Use a talking piece to ensure everyone has a voice',
        'Pose questions that promote reflection and understanding',
        'Listen actively without judgment',
        'Focus on understanding, not blame',
      ],
      benefits: [
        'Builds community and trust',
        'Develops empathy and perspective-taking',
        'Prevents conflicts before they escalate',
        'Creates safe space for expression',
        'Strengthens relationships',
      ],
      examples: [
        'Morning check-in circles',
        'Conflict resolution circles',
        'Celebration circles',
        'Problem-solving circles',
      ],
    },
    {
      practice: 'Restorative Conversations',
      description: 'One-on-one or small group conversations that address harm and repair relationships.',
      steps: [
        'Create a safe, private space',
        'Ask what happened (not why)',
        'Explore who was affected and how',
        'Identify needs and obligations',
        'Agree on how to make things right',
      ],
      benefits: [
        'Addresses root causes of behavior',
        'Repairs relationships',
        'Teaches accountability',
        'Prevents future incidents',
        'Maintains dignity for all involved',
      ],
      examples: [
        'After a conflict between students',
        'When a student disrupts class',
        'Following a bullying incident',
        'When harm has occurred',
      ],
    },
    {
      practice: 'Restorative Conferences',
      description: 'Formal process bringing together all affected parties to address serious incidents.',
      steps: [
        'Prepare all participants',
        'Create safe, structured environment',
        'Facilitate dialogue about the incident',
        'Identify impacts and needs',
        'Develop agreement for moving forward',
        'Follow up to ensure agreement is kept',
      ],
      benefits: [
        'Addresses serious incidents comprehensively',
        'Involves all stakeholders',
        'Creates lasting solutions',
        'Builds understanding and empathy',
        'Reduces repeat offenses',
      ],
      examples: [
        'Serious conflicts between students',
        'Incidents involving multiple students',
        'Harm affecting classroom community',
        'Repeated behavioral issues',
      ],
    },
  ]

  const selCompetencies: SELCompetency[] = [
    {
      competency: 'Self-Awareness',
      description: 'The ability to recognize one\'s own emotions, thoughts, and values and how they influence behavior.',
      indicators: [
        'Identifies emotions accurately',
        'Recognizes strengths and limitations',
        'Demonstrates self-confidence',
        'Shows sense of purpose',
      ],
      classroomStrategies: [
        'Emotion check-ins and mood meters',
        'Reflection journals',
        'Strengths-based activities',
        'Goal-setting exercises',
      ],
      researchEvidence: 'Students with strong self-awareness show better academic performance and social relationships.',
    },
    {
      competency: 'Self-Management',
      description: 'The ability to regulate emotions, thoughts, and behaviors in different situations.',
      indicators: [
        'Manages stress effectively',
        'Controls impulses',
        'Sets and works toward goals',
        'Demonstrates self-discipline',
      ],
      classroomStrategies: [
        'Mindfulness and breathing exercises',
        'Calm-down strategies',
        'Self-monitoring tools',
        'Progress tracking',
      ],
      researchEvidence: 'Self-management skills predict academic success and reduce behavioral problems.',
    },
    {
      competency: 'Social Awareness',
      description: 'The ability to understand and empathize with others from diverse backgrounds.',
      indicators: [
        'Shows empathy for others',
        'Recognizes social cues',
        'Appreciates diversity',
        'Understands social norms',
      ],
      classroomStrategies: [
        'Perspective-taking activities',
        'Cultural awareness lessons',
        'Community service projects',
        'Literature with diverse characters',
      ],
      researchEvidence: 'Social awareness correlates with positive peer relationships and reduced bullying.',
    },
    {
      competency: 'Relationship Skills',
      description: 'The ability to establish and maintain healthy relationships with diverse individuals.',
      indicators: [
        'Communicates clearly',
        'Listens actively',
        'Cooperates with others',
        'Resolves conflicts constructively',
      ],
      classroomStrategies: [
        'Collaborative projects',
        'Peer mediation training',
        'Communication practice',
        'Team-building activities',
      ],
      researchEvidence: 'Strong relationship skills lead to better academic collaboration and social support.',
    },
    {
      competency: 'Responsible Decision-Making',
      description: 'The ability to make constructive choices about personal behavior and social interactions.',
      indicators: [
        'Evaluates consequences',
        'Considers ethical standards',
        'Makes responsible choices',
        'Solves problems effectively',
      ],
      classroomStrategies: [
        'Problem-solving frameworks',
        'Ethical dilemma discussions',
        'Decision-making models',
        'Consequence mapping',
      ],
      researchEvidence: 'Responsible decision-making reduces risk behaviors and improves academic outcomes.',
    },
  ]

  const researchEvidence = [
    {
      finding: 'SEL programs improve academic outcomes',
      source: 'CASEL (2020)',
      evidence: 'Students participating in SEL programs show an 11 percentile-point gain in academic achievement.',
      practicalTip: 'Integrate SEL into academic instruction, don\'t treat it as separate',
    },
    {
      finding: 'Restorative practices reduce suspensions',
      source: 'Gregory et al. (2018)',
      evidence: 'Schools implementing restorative practices see 30-50% reductions in suspension rates.',
      practicalTip: 'Focus on relationship-building and community, not just discipline',
    },
    {
      finding: 'SEL skills are teachable',
      source: 'Durlak et al. (2011)',
      evidence: 'SEL skills can be taught and learned through explicit instruction and practice.',
      practicalTip: 'Teach SEL skills directly, don\'t assume students will learn them naturally',
    },
    {
      finding: 'Teacher-student relationships matter',
      source: 'Cornelius-White (2007)',
      evidence: 'Positive teacher-student relationships have effect sizes of 0.72 on student achievement.',
      practicalTip: 'Invest time in building relationships with all students',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
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
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">{t('sELBehaviorResearch.researchInsight')}</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">{t('sELBehaviorResearch.selBehavior')}</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />{t('sELBehaviorResearch.kMinRead')}</span>
                </div>
                <h1 className="text-3xl font-bold">{t('sELBehaviorResearch.selBehaviorRestorativePractices')}</h1>
                <p className="mt-2 text-pink-100">{t('sELBehaviorResearch.evidenceBackedApproachesToBuildingClassroomCommunityAnd')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{t('sELBehaviorResearch.evidenceBased')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 w-4" />
                <span>{t('sELBehaviorResearch.relationshipFocused')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 w-4" />
                <span>{t('sELBehaviorResearch.highImpact')}</span>
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">{t('sELBehaviorResearch.sections')}</h3>
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'restorative', label: 'Restorative Practices', icon: Users },
                { id: 'sel', label: 'SEL Competencies', icon: Heart },
                { id: 'implementation', label: 'Implementation', icon: Zap },
                { id: 'tools', label: 'Tools & Resources', icon: FileText },
              ].map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-pink-50 border-2 border-pink-300 text-pink-900'
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sELBehaviorResearch.whatAreRestorativePractices')}</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Restorative practices are a framework for building community, resolving conflicts, and addressing harm 
                    through dialogue and relationship-building. Unlike punitive approaches that focus on punishment, 
                    restorative practices focus on understanding, accountability, and repairing relationships.
                  </p>
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('sELBehaviorResearch.corePrinciples')}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('sELBehaviorResearch.relationshipsFirst')}</strong>{t('sELBehaviorResearch.strongRelationshipsPreventAndResolveConflicts')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('sELBehaviorResearch.addressHarm')}</strong>{t('sELBehaviorResearch.whenHarmOccursFocusOnRepairingRelationshipsNotPunishmen')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('sELBehaviorResearch.involveAllAffected')}</strong>{t('sELBehaviorResearch.includeEveryoneImpactedByAnIncidentInTheResolutionProce')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('sELBehaviorResearch.buildCommunity')}</strong>{t('sELBehaviorResearch.createOpportunitiesForConnectionAndBelonging')}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.punitiveApproach')}</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>{t('sELBehaviorResearch.focusesOnRuleBreaking')}</li>
                        <li>{t('sELBehaviorResearch.assignsBlameAndPunishment')}</li>
                        <li>{t('sELBehaviorResearch.excludesThoseAffected')}</li>
                        <li>{t('sELBehaviorResearch.createsFearAndResentment')}</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.restorativeApproach')}</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>{t('sELBehaviorResearch.focusesOnHarmAndRelationships')}</li>
                        <li>{t('sELBehaviorResearch.promotesAccountabilityAndRepair')}</li>
                        <li>{t('sELBehaviorResearch.includesAllAffectedParties')}</li>
                        <li>{t('sELBehaviorResearch.buildsUnderstandingAndConnection')}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {researchEvidence.map((evidence, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">{evidence.finding}</h4>
                          <Star className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2 italic">{evidence.source}</p>
                        <p className="text-sm text-gray-700 mb-3">{evidence.evidence}</p>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 mb-1">{t('sELBehaviorResearch.practicalTip')}</p>
                          <p className="text-xs text-gray-700">{evidence.practicalTip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Restorative Practices Section */}
            {activeSection === 'restorative' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sELBehaviorResearch.restorativePractices')}</h2>
                  <p className="text-gray-700 mb-6">{t('sELBehaviorResearch.thesePracticesProvideStructuredWaysToBuildCommunityPrev')}</p>
                  <div className="space-y-4">
                    {restorativePractices.map((practice, idx) => (
                      <div key={idx} className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{practice.practice}</h3>
                        <p className="text-gray-700 mb-4">{practice.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.implementationSteps')}</h4>
                            <ol className="space-y-2">
                              {practice.steps.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                                    {stepIdx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.benefits')}</h4>
                            <ul className="space-y-2">
                              {practice.benefits.map((benefit, benIdx) => (
                                <li key={benIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-pink-100">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.whenToUse')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {practice.examples.map((example, exIdx) => (
                              <span key={exIdx} className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
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

            {/* SEL Competencies Section */}
            {activeSection === 'sel' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sELBehaviorResearch.socialEmotionalLearningCompetencies')}</h2>
                  <p className="text-gray-700 mb-6">{t('sELBehaviorResearch.caselSFrameworkIdentifiesFiveCoreSelCompetenciesThatSup')}</p>
                  <div className="space-y-4">
                    {selCompetencies.map((competency, idx) => (
                      <div key={idx} className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{competency.competency}</h3>
                        <p className="text-gray-700 mb-4">{competency.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.indicators')}</h4>
                            <ul className="space-y-1">
                              {competency.indicators.map((indicator, indIdx) => (
                                <li key={indIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <Circle className="h-3 w-3 text-pink-600 mt-1 flex-shrink-0 fill-current" />
                                  <span>{indicator}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.classroomStrategies')}</h4>
                            <ul className="space-y-1">
                              {competency.classroomStrategies.map((strategy, stratIdx) => (
                                <li key={stratIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <Zap className="h-3 w-3 text-pink-600 mt-1 flex-shrink-0" />
                                  <span>{strategy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-pink-100">
                          <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.researchEvidence')}</p>
                          <p className="text-sm text-gray-700">{competency.researchEvidence}</p>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sELBehaviorResearch.implementationGuide')}</h2>
                  <p className="text-gray-700 mb-6">{t('sELBehaviorResearch.successfullyImplementingRestorativePracticesAndSelRequi')}</p>
                  
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sELBehaviorResearch.gettingStarted')}</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.kBuildRelationshipsFirst')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.startWithCommunityBuildingActivitiesStrongRelationships')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.kStartWithProactivePractices')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.beginWithCommunityCirclesAndRelationshipBuildingBeforeM')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.kModelRestorativeLanguage')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.useIStatementsAskWhatHappenedInsteadOfWhyDid')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.kIntegrateSelIntoAcademics')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.donTTreatSelAsSeparateEmbedSocialEmotionalLearning')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.kBePatientAndConsistent')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.buildingARestorativeCultureTakesTimeConsistencyIsKeyUse')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sELBehaviorResearch.restorativeLanguageExamples')}</h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.insteadOf')}</p>
                        <p className="text-sm text-red-600 italic mb-2">{t('sELBehaviorResearch.whyDidYouDoThat')}</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.try')}</p>
                        <p className="text-sm text-green-600">{t('sELBehaviorResearch.whatHappenedOrHelpMeUnderstandWhatLedToThis')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.insteadOf')}</p>
                        <p className="text-sm text-red-600 italic mb-2">{t('sELBehaviorResearch.youNeedToApologize')}</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.try')}</p>
                        <p className="text-sm text-green-600">"How do you think [person] felt? What can we do to make things right?"</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.insteadOf')}</p>
                        <p className="text-sm text-red-600 italic mb-2">{t('sELBehaviorResearch.thatWasWrong')}</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{t('sELBehaviorResearch.try')}</p>
                        <p className="text-sm text-green-600">{t('sELBehaviorResearch.whoWasAffectedByWhatHappenedHowWereTheyAffected')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sELBehaviorResearch.quickActionSteps')}</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <span>{t('sELBehaviorResearch.startEachDayWithABriefCheckInCircleTo')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <span>{t('sELBehaviorResearch.teachStudentsOneSelSkillExplicitlyEachWeek')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <span>{t('sELBehaviorResearch.useRestorativeConversationsInsteadOfTraditionalDiscipli')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <span>{t('sELBehaviorResearch.createClassroomAgreementsTogetherWithStudents')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        <span>{t('sELBehaviorResearch.reflectRegularlyOnWhatSWorkingAndWhatNeedsAdjustment')}</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Tools & Resources Section */}
            {activeSection === 'tools' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('sELBehaviorResearch.toolsResources')}</h2>
                  <p className="text-gray-700 mb-6">{t('sELBehaviorResearch.practicalToolsAndFrameworksToSupportImplementationOfRes')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('sELBehaviorResearch.circleQuestions')}</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>{t('sELBehaviorResearch.whatSOneThingYouReGratefulForToday')}</li>
                        <li>{t('sELBehaviorResearch.whatSAChallengeYouReFacing')}</li>
                        <li>{t('sELBehaviorResearch.howCanWeSupportEachOtherThisWeek')}</li>
                        <li>{t('sELBehaviorResearch.whatDidYouLearnAboutYourselfToday')}</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('sELBehaviorResearch.restorativeQuestions')}</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>{t('sELBehaviorResearch.whatHappened')}</li>
                        <li>{t('sELBehaviorResearch.whatWereYouThinkingAtTheTime')}</li>
                        <li>{t('sELBehaviorResearch.whoHasBeenAffected')}</li>
                        <li>{t('sELBehaviorResearch.whatNeedsToHappenToMakeThingsRight')}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sELBehaviorResearch.selIntegrationIdeas')}</h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.morningMeetings')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.startEachDayWithABriefCheckInThatBuilds')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.academicIntegration')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.useLiteratureHistoryAndScienceToExploreEmotionsRelation')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.conflictResolution')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.teachStudentsToUseIStatementsAndActiveListeningWhen')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('sELBehaviorResearch.reflectionActivities')}</h4>
                        <p className="text-sm text-gray-700">{t('sELBehaviorResearch.buildInTimeForStudentsToReflectOnTheirLearning')}</p>
                      </div>
                    </div>
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

export function SELBehaviorResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <SELBehaviorResearchInner />
}

export default function SELBehaviorResearch() {
  const row = getSectionItemBySlug('research-insights-library', SEL_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <SELBehaviorResearchView item={row} />
}


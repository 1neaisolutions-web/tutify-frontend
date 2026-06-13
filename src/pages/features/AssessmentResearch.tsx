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
  RefreshCw,
  MessageSquare,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
                onClick={() => navigateBackToLearningHubCatalog(navigate)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">{t('assessmentResearch.researchInsight')}</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">{t('assessmentResearch.assessment')}</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />{t('assessmentResearch.kMinRead')}</span>
                </div>
                <h1 className="text-3xl font-bold">{t('assessmentResearch.formativeAssessmentWhatResearchSays')}</h1>
                <p className="mt-2 text-green-100">{t('assessmentResearch.keyFindingsFromBlackWiliamAndHowToImplementFeedback')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{t('assessmentResearch.evidenceBased')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 w-4" />
                <span>{t('assessmentResearch.practicalStrategies')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 w-4" />
                <span>{t('assessmentResearch.highImpact')}</span>
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">{t('assessmentResearch.sections')}</h3>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('assessmentResearch.whatIsFormativeAssessment')}</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Formative assessment is the process of gathering evidence about student learning during instruction 
                    to inform teaching and learning. Unlike summative assessment (which evaluates learning at the end), 
                    formative assessment happens continuously throughout the learning process.
                  </p>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('assessmentResearch.keyCharacteristics')}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.ongoing')}</strong>{t('assessmentResearch.happensContinuouslyDuringInstruction')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.lowStakes')}</strong>{t('assessmentResearch.notUsedForGradesButForLearning')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.actionable')}</strong>{t('assessmentResearch.providesInformationToAdjustTeachingAndLearning')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.studentCentered')}</strong>{t('assessmentResearch.involvesStudentsInTheAssessmentProcess')}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{t('assessmentResearch.assessmentForLearning')}</h4>
                      <p className="text-sm text-gray-700">{t('assessmentResearch.formativeAssessmentHelpsTeachersUnderstandWhatStudentsK')}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{t('assessmentResearch.assessmentOfLearning')}</h4>
                      <p className="text-sm text-gray-700">{t('assessmentResearch.summativeAssessmentEvaluatesWhatStudentsHaveLearnedAtTh')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Research Findings Section */}
            {activeSection === 'research' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('assessmentResearch.blackWiliamSResearch')}</h2>
                  <p className="text-gray-700 mb-6">{t('assessmentResearch.paulBlackAndDylanWiliamS1998ReviewOfResearch')}</p>
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
                          <p className="text-xs font-semibold text-green-700 mb-1">{t('assessmentResearch.practicalTip')}</p>
                          <p className="text-sm text-gray-700">{finding.practicalTip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('assessmentResearch.theFeedbackLoop')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{t('assessmentResearch.gatherEvidence')}</h4>
                          <p className="text-sm text-gray-700">{t('assessmentResearch.collectInformationAboutStudentUnderstandingThroughObser')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{t('assessmentResearch.interpretEvidence')}</h4>
                          <p className="text-sm text-gray-700">{t('assessmentResearch.analyzeWhatTheEvidenceTellsYouAboutStudentLearningAnd')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{t('assessmentResearch.takeAction')}</h4>
                          <p className="text-sm text-gray-700">{t('assessmentResearch.adjustInstructionProvideFeedbackOrModifyLearningActivit')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{t('assessmentResearch.repeat')}</h4>
                          <p className="text-sm text-gray-700">{t('assessmentResearch.continueTheCycleThroughoutInstructionToEnsureContinuous')}</p>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('assessmentResearch.typesOfFeedback')}</h2>
                  <p className="text-gray-700 mb-6">{t('assessmentResearch.notAllFeedbackIsCreatedEqualResearchShowsThatEffective')}</p>
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
                              <p className="text-sm font-semibold text-gray-900 mb-2">{t('assessmentResearch.examples')}</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('assessmentResearch.feedbackBestPractices')}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.beSpecific')}</strong>{t('assessmentResearch.tellStudentsExactlyWhatTheyDidWellAndWhatNeeds')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.focusOnTheTask')}</strong> Avoid personal comments; focus on the work</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.beTimely')}</strong>{t('assessmentResearch.provideFeedbackWhileLearningIsStillHappening')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.makeItActionable')}</strong>{t('assessmentResearch.tellStudentsWhatToDoNext')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>{t('assessmentResearch.involveStudents')}</strong>{t('assessmentResearch.encourageSelfAssessmentAndPeerFeedback')}</span>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('assessmentResearch.formativeAssessmentStrategies')}</h2>
                  <p className="text-gray-700 mb-6">{t('assessmentResearch.thesePracticalStrategiesCanBeImplementedImmediatelyInYo')}</p>
                  <div className="space-y-4">
                    {formativeStrategies.map((strategy, idx) => (
                      <div key={idx} className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{strategy.strategy}</h3>
                        <p className="text-gray-700 mb-4">{strategy.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-green-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('assessmentResearch.implementationSteps')}</h4>
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
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('assessmentResearch.benefits')}</h4>
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
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('assessmentResearch.examplePrompts')}</h4>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('assessmentResearch.implementationGuide')}</h2>
                  <p className="text-gray-700 mb-6">{t('assessmentResearch.successfullyImplementingFormativeAssessmentRequiresPlan')}</p>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assessmentResearch.gettingStarted')}</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('assessmentResearch.kStartSmall')}</h4>
                        <p className="text-sm text-gray-700">{t('assessmentResearch.chooseOneOrTwoFormativeAssessmentStrategiesToImplementC')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('assessmentResearch.kPlanYourQuestions')}</h4>
                        <p className="text-sm text-gray-700">{t('assessmentResearch.prepareQuestionsOrPromptsAlignedToYourLearningObjective')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('assessmentResearch.kCreateARoutine')}</h4>
                        <p className="text-sm text-gray-700">{t('assessmentResearch.buildFormativeAssessmentIntoYourRegularLessonStructureC')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('assessmentResearch.kUseTheData')}</h4>
                        <p className="text-sm text-gray-700">{t('assessmentResearch.actuallyUseTheInformationYouGatherToAdjustInstructionIf')}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('assessmentResearch.kInvolveStudents')}</h4>
                        <p className="text-sm text-gray-700">{t('assessmentResearch.teachStudentsToSelfAssessAndPeerAssessWhenStudents')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assessmentResearch.commonPitfallsToAvoid')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>{t('assessmentResearch.gradingEverything')}</strong>{t('assessmentResearch.formativeAssessmentShouldnTBeGradedKeepItLowStakes')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>{t('assessmentResearch.collectingButNotUsing')}</strong>{t('assessmentResearch.ifYouGatherDataButDonTActOnIt')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>{t('assessmentResearch.vagueFeedback')}</strong>{t('assessmentResearch.goodJobDoesnTHelpStudentsImproveBeSpecific')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 font-bold">✗</span>
                        <span><strong>{t('assessmentResearch.onlyUsingAtTheEnd')}</strong>{t('assessmentResearch.formativeAssessmentShouldHappenThroughoutLearningNotJus')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assessmentResearch.quickActionSteps')}</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <span>{t('assessmentResearch.chooseOneFormativeAssessmentStrategyToTryThisWeek')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <span>{t('assessmentResearch.plan23QuestionsAlignedToYourLearningObjectives')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <span>{t('assessmentResearch.implementTheStrategyAndCollectEvidence')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <span>{t('assessmentResearch.useTheEvidenceToAdjustYourNextLesson')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        <span>{t('assessmentResearch.reflectOnWhatWorkedAndWhatToImprove')}</span>
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




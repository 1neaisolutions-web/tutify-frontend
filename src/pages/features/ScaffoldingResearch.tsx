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
  Layers,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'
interface ScaffoldingTechnique {
  technique: string
  description: string
  examples: string[]
  whenToUse: string
}

interface ReleaseStage {
  stage: string
  teacherRole: string
  studentRole: string
  examples: string[]
}

const SCAFFOLDING_SLUG = 'scaffolding-research'

function ScaffoldingResearchInner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'zpd' | 'techniques' | 'release' | 'implementation'>('overview')

  const scaffoldingTechniques: ScaffoldingTechnique[] = [
    {
      technique: 'Modeling',
      description: 'Demonstrating the desired thinking or behavior while thinking aloud.',
      examples: [
        'Show how to solve a math problem step-by-step',
        'Read a passage and think aloud about comprehension',
        'Demonstrate how to write a thesis statement',
        'Model how to conduct a science experiment',
      ],
      whenToUse: 'When introducing new concepts or skills',
    },
    {
      technique: 'Questioning',
      description: 'Asking strategic questions that guide students toward understanding.',
      examples: [
        'What do you notice about this pattern?',
        'How does this connect to what we learned yesterday?',
        'What would happen if we tried a different approach?',
        'Why do you think that strategy worked?',
      ],
      whenToUse: 'Throughout learning to prompt thinking',
    },
    {
      technique: 'Graphic Organizers',
      description: 'Visual tools that help students organize information and see relationships.',
      examples: [
        'Venn diagrams for comparing concepts',
        'Flow charts for processes',
        'Concept maps for relationships',
        'T-charts for pros and cons',
      ],
      whenToUse: 'When students need help organizing complex information',
    },
    {
      technique: 'Sentence Starters',
      description: 'Providing the beginning of sentences to help students express their thinking.',
      examples: [
        'I think this means...',
        'One similarity is...',
        'The evidence suggests...',
        'I disagree because...',
      ],
      whenToUse: 'When students struggle to articulate their thoughts',
    },
    {
      technique: 'Think-Pair-Share',
      description: 'Students think individually, discuss with a partner, then share with the class.',
      examples: [
        'Think about the answer, discuss with your partner, then share',
        'Reflect on the reading, compare notes, present findings',
        'Solve individually, check with partner, explain to class',
      ],
      whenToUse: 'When students need support before whole-class sharing',
    },
    {
      technique: 'Checklists and Rubrics',
      description: 'Providing clear criteria and steps for completing tasks.',
      examples: [
        'Step-by-step checklists for writing assignments',
        'Rubrics that break down expectations',
        'Self-assessment checklists',
        'Peer review guides',
      ],
      whenToUse: 'When tasks are complex or multi-step',
    },
  ]

  const releaseStages: ReleaseStage[] = [
    {
      stage: 'I Do (Teacher Models)',
      teacherRole: 'Demonstrates and explains',
      studentRole: 'Observes and listens',
      examples: [
        'Teacher solves a problem while thinking aloud',
        'Teacher reads a passage and models comprehension strategies',
        'Teacher writes a paragraph showing the process',
      ],
    },
    {
      stage: 'We Do (Guided Practice)',
      teacherRole: 'Guides and supports',
      studentRole: 'Participates with support',
      examples: [
        'Teacher and students solve problems together',
        'Students practice with teacher guidance',
        'Teacher provides prompts and feedback',
      ],
    },
    {
      stage: 'You Do Together (Collaborative)',
      teacherRole: 'Observes and facilitates',
      studentRole: 'Works with peers',
      examples: [
        'Students work in pairs or small groups',
        'Teacher circulates and provides support as needed',
        'Students help each other',
      ],
    },
    {
      stage: 'You Do Alone (Independent)',
      teacherRole: 'Assesses and provides feedback',
      studentRole: 'Works independently',
      examples: [
        'Students complete tasks on their own',
        'Teacher checks for understanding',
        'Students demonstrate mastery',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/learning-hub')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold">{t('scaffoldingResearch.backToLearningHub')}</span>
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide">{t('scaffoldingResearch.instructionalDesign')}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />{t('scaffoldingResearch.kMinRead')}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('scaffoldingResearch.scaffoldingInstructionVygotskySZoneOfProximalDevelopmen')}</h1>
                <p className="text-lg text-gray-700 leading-relaxed">{t('scaffoldingResearch.practicalWaysToProvideJustRightSupportThatHelpsStudents')}</p>
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
              { id: 'zpd', label: 'Understanding ZPD' },
              { id: 'techniques', label: 'Scaffolding Techniques' },
              { id: 'release', label: 'Gradual Release' },
              { id: 'implementation', label: 'Implementation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeSection === tab.id
                    ? 'bg-indigo-600 text-white'
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
                  <Layers className="h-6 w-6 text-indigo-600" />{t('scaffoldingResearch.whatIsScaffolding')}</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>{t('scaffoldingResearch.scaffoldingIsTemporarySupportProvidedToHelpStudentsAcco')}</p>
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('scaffoldingResearch.keyPrinciples')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('scaffoldingResearch.temporarySupport')}</p>
                          <p className="text-sm text-gray-700">{t('scaffoldingResearch.scaffoldingIsRemovedAsStudentsBecomeMoreCapable')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('scaffoldingResearch.justRightChallenge')}</p>
                          <p className="text-sm text-gray-700">{t('scaffoldingResearch.supportMatchesWhatStudentsNeedNotMoreOrLess')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('scaffoldingResearch.gradualRelease')}</p>
                          <p className="text-sm text-gray-700">{t('scaffoldingResearch.supportDecreasesAsStudentsGainCompetence')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{t('scaffoldingResearch.individualized')}</p>
                          <p className="text-sm text-gray-700">{t('scaffoldingResearch.differentStudentsNeedDifferentLevelsOfSupport')}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  The Zone of Proximal Development (ZPD)
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowDown className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">{t('scaffoldingResearch.belowZpd')}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{t('scaffoldingResearch.whatStudentsCanDoIndependently')}</p>
                    <p className="text-xs text-gray-600">{t('scaffoldingResearch.noScaffoldingNeededStudentsCanDoThisAlone')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-2 border-indigo-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-900">{t('scaffoldingResearch.zpd')}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{t('scaffoldingResearch.whatStudentsCanDoWithSupport')}</p>
                    <p className="text-xs text-gray-600">{t('scaffoldingResearch.thisIsWhereScaffoldingIsMostEffective')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUp className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">{t('scaffoldingResearch.aboveZpd')}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{t('scaffoldingResearch.whatStudentsCannotDoYet')}</p>
                    <p className="text-xs text-gray-600">{t('scaffoldingResearch.tooDifficultEvenWithSupportNeedPrerequisiteSkills')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-4 text-center">{t('scaffoldingResearch.effectiveScaffoldingTargetsTheZpdTasksStudentsCanAccomp')}</p>
              </div>
            </div>
          )}

          {activeSection === 'zpd' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('scaffoldingResearch.identifyingStudentsZpd')}</h2>
                
                <div className="space-y-6">
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('scaffoldingResearch.howToIdentifyZpd')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-indigo-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{t('scaffoldingResearch.observation')}</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>{t('scaffoldingResearch.watchStudentsAttemptTasks')}</li>
                          <li>{t('scaffoldingResearch.noticeWhereTheyStruggle')}</li>
                          <li>{t('scaffoldingResearch.seeWhatTheyCanDoWithHints')}</li>
                          <li>{t('scaffoldingResearch.identifyPatternsInErrors')}</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-indigo-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{t('scaffoldingResearch.assessment')}</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>{t('scaffoldingResearch.preAssessmentsBeforeUnits')}</li>
                          <li>{t('scaffoldingResearch.formativeAssessmentsDuringLearning')}</li>
                          <li>{t('scaffoldingResearch.exitTicketsAndQuickChecks')}</li>
                          <li>{t('scaffoldingResearch.studentSelfAssessments')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('scaffoldingResearch.signsStudentsAreInTheirZpd')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.studentsCanCompletePartsOfTheTaskButNotAll')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.withHintsOrPromptsStudentsCanSucceed')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.studentsShowUnderstandingButNeedSupportToApplyIt')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.studentsAreEngagedAndMakingProgress')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'techniques' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('scaffoldingResearch.scaffoldingTechniques')}</h2>
                <div className="space-y-6">
                  {scaffoldingTechniques.map((technique, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{technique.technique}</h3>
                          <p className="text-gray-700 mb-4">{technique.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('scaffoldingResearch.examples')}</p>
                            <ul className="space-y-2">
                              {technique.examples.map((example, exIdx) => (
                                <li key={exIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                            <p className="text-xs font-semibold text-indigo-800 mb-1">{t('scaffoldingResearch.whenToUse')}</p>
                            <p className="text-sm text-indigo-700">{technique.whenToUse}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'release' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('scaffoldingResearch.gradualReleaseOfResponsibility')}</h2>
                <p className="text-gray-700 mb-6">{t('scaffoldingResearch.theGradualReleaseModelMovesStudentsFromDependenceToInde')}</p>
                <div className="space-y-6">
                  {releaseStages.map((stage, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-blue-600' : idx === 2 ? 'bg-cyan-600' : 'bg-green-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{stage.stage}</h3>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t('scaffoldingResearch.teacherRole')}</p>
                              <p className="text-sm text-gray-700">{stage.teacherRole}</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{t('scaffoldingResearch.studentRole')}</p>
                              <p className="text-sm text-blue-700">{stage.studentRole}</p>
                            </div>
                          </div>
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">{t('scaffoldingResearch.examples')}</p>
                            <ul className="space-y-1">
                              {stage.examples.map((example, exIdx) => (
                                <li key={exIdx} className="flex items-start gap-2 text-sm text-indigo-700">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('scaffoldingResearch.implementationGuide')}</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-indigo-600" />{t('scaffoldingResearch.step1AssessStudentsZpd')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.usePreAssessmentsToIdentifyWhatStudentsCanDoIndependent')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.observeStudentsAttemptingTasks')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.identifyWhereStudentsNeedSupport')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.determineAppropriateLevelOfScaffolding')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />{t('scaffoldingResearch.step2ProvideScaffolding')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.startWithModelingAndThinkAlouds')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.useAppropriateScaffoldingTechniques')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.provideJustEnoughSupportNotTooMuchOrTooLittle')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.monitorStudentProgressContinuously')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-green-50 rounded-xl p-6 border border-cyan-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-cyan-600" />{t('scaffoldingResearch.step3GraduallyRelease')}</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.moveFromIDoToWeDoToYouDo')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.reduceSupportAsStudentsGainCompetence')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.provideMoreSupportWhenStudentsStruggle')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span>{t('scaffoldingResearch.removeScaffoldingCompletelyWhenStudentsAreReady')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('scaffoldingResearch.quickWins')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <p className="text-sm font-semibold text-indigo-900 mb-2">{t('scaffoldingResearch.startToday')}</p>
                    <p className="text-sm text-indigo-700">{t('scaffoldingResearch.addOneThinkAloudToYourNextLesson')}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">{t('scaffoldingResearch.thisWeek')}</p>
                    <p className="text-sm text-blue-700">{t('scaffoldingResearch.useSentenceStartersForOneWritingAssignment')}</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                    <p className="text-sm font-semibold text-cyan-900 mb-2">{t('scaffoldingResearch.thisMonth')}</p>
                    <p className="text-sm text-cyan-700">{t('scaffoldingResearch.implementGradualReleaseForOneUnit')}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">{t('scaffoldingResearch.ongoing')}</p>
                    <p className="text-sm text-green-700">{t('scaffoldingResearch.continuouslyAssessAndAdjustScaffolding')}</p>
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

export function ScaffoldingResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <ScaffoldingResearchInner />
}

export default function ScaffoldingResearch() {
  const row = getSectionItemBySlug('research-insights-library', SCAFFOLDING_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <ScaffoldingResearchView item={row} />
}




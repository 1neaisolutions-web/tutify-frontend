import { useState } from 'react'
import {
  Briefcase,
  FileText,
  Users,
  Target,
  Award,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  Globe,
  TrendingUp,
  BarChart3,
  Lightbulb,
  BookOpen,
  Zap,
  Copy,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  Linkedin,
  Eye,
  CheckCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import {
  getResumeRegions,
  getCareerIndustries,
  getInterviewCategories,
  ResumeFormat,
  InterviewQuestion,
  NACECompetency,
  IndustryInsight,
  CareerPathway,
  LinkedInOptimization,
  SkillsAssessment,
} from '../../utils/careerUtils'
import * as chatbotApi from '../../api/chatbots'
import {
  mapResumeFormatResponseToUI,
  mapInterviewPrepResponseToUI,
  mapNACECompetenciesResponseToUI,
  mapIndustryInsightsResponseToUI,
  mapCareerPathwayResponseToUI,
  mapLinkedInGuideResponseToUI,
  mapSkillsAssessmentResponseToUI,
} from '../../utils/careerAdapters'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'

import { useTranslation } from 'react-i18next'
const CAREER_COACH_SLUG = 'career-readiness-coach'

type TabType = 'resume' | 'interview' | 'skills' | 'industry' | 'pathway' | 'linkedin' | 'assessment' | 'standards'

const CareerReadinessCoach = () => {
  const { t } = useTranslation()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('resume')
  const [gradeLevel, setGradeLevel] = useState('9-12')
  const [selectedRegion, setSelectedRegion] = useState('United States')
  const [selectedIndustry, setSelectedIndustry] = useState('Technology')
  const [careerLevel, setCareerLevel] = useState('Entry')
  const [isGenerating, setIsGenerating] = useState(false)

  // Resume Builder State
  const [selectedResumeFormat, setSelectedResumeFormat] = useState('US Resume')
  const [resumeFormat, setResumeFormat] = useState<ResumeFormat | null>(null)

  // Interview Prep State
  const [interviewCategory, setInterviewCategory] = useState('Behavioral')
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null)

  // Professional Skills State
  const [naceCompetencies, setNACECompetencies] = useState<NACECompetency[]>([])
  const [selectedCompetency, setSelectedCompetency] = useState<string | null>(null)

  // Industry Insights State
  const [industryInsight, setIndustryInsight] = useState<IndustryInsight | null>(null)

  // Career Pathway State
  const [careerPathway, setCareerPathway] = useState<CareerPathway | null>(null)
  const [targetCareer, setTargetCareer] = useState('Software Engineer')

  // LinkedIn State
  const [linkedInGuide, setLinkedInGuide] = useState<LinkedInOptimization | null>(null)

  // Skills Assessment State
  const [skillsAssessment, setSkillsAssessment] = useState<SkillsAssessment | null>(null)
  const [assessmentCompetency, setAssessmentCompetency] = useState('Critical Thinking/Problem Solving')
  const [currentLevel, setCurrentLevel] = useState('A1')
  const [targetLevel, setTargetLevel] = useState('B2')

  const regions = getResumeRegions()
  const industries = getCareerIndustries()
  const interviewCategories = getInterviewCategories()

  const CAREER_CAP_TABS: Record<string, TabType> = {
    international_resume_builder: 'resume',
    interview_prep: 'interview',
    professional_skills_competencies: 'skills',
    industry_insights: 'industry',
    career_pathway_planning: 'pathway',
    linkedin_guide: 'linkedin',
    skills_assessment_gap_analysis: 'assessment',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CAREER_COACH_SLUG,
    activeTab,
    capabilityKeyToTab: CAREER_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = ['resume', 'interview', 'skills', 'industry', 'pathway', 'linkedin', 'assessment', 'standards']
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && CAREER_CAP_TABS[cap]
            ? CAREER_CAP_TABS[cap]
            : 'resume'

      setActiveTab(tab)
      if (userContent) {
        if (tab === 'resume') setSelectedResumeFormat(userContent)
        if (tab === 'interview') setInterviewCategory(userContent)
        if (tab === 'industry') setSelectedIndustry(userContent)
        if (tab === 'pathway') setTargetCareer(userContent)
        if (tab === 'assessment') setAssessmentCompetency(userContent)
      }

      try {
        const data = JSON.parse(assistantContent) as Record<string, unknown>
        setResumeFormat(null)
        setInterviewQuestions([])
        setSelectedQuestion(null)
        setNACECompetencies([])
        setSelectedCompetency(null)
        setIndustryInsight(null)
        setCareerPathway(null)
        setLinkedInGuide(null)
        setSkillsAssessment(null)

        if (tab === 'resume') {
          setResumeFormat(mapResumeFormatResponseToUI(data, selectedResumeFormat))
        } else if (tab === 'interview') {
          setInterviewQuestions(mapInterviewPrepResponseToUI(data, interviewCategory))
        } else if (tab === 'skills') {
          setNACECompetencies(mapNACECompetenciesResponseToUI(data))
        } else if (tab === 'industry') {
          setIndustryInsight(mapIndustryInsightsResponseToUI(data, selectedIndustry))
        } else if (tab === 'pathway') {
          setCareerPathway(mapCareerPathwayResponseToUI(data, targetCareer, selectedIndustry))
        } else if (tab === 'linkedin') {
          setLinkedInGuide(mapLinkedInGuideResponseToUI(data))
        } else if (tab === 'assessment') {
          setSkillsAssessment(mapSkillsAssessmentResponseToUI(data, assessmentCompetency, currentLevel, targetLevel))
        }
      } catch {
        // keep restore silent
      }
    },
  })

  // Resume Format Explorer (backend)
  const handleExploreResumeFormat = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'international_resume_builder', {
        input: selectedResumeFormat,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const format = mapResumeFormatResponseToUI(response.result as Record<string, unknown>, selectedResumeFormat)
      setResumeFormat(format)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Resume format:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Interview Questions (backend)
  const handleGetInterviewQuestions = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'interview_prep', {
        input: interviewCategory,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const questions = mapInterviewPrepResponseToUI(response.result as Record<string, unknown>, interviewCategory)
      setInterviewQuestions(questions)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Interview prep:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // NACE Competencies (backend)
  const handleGetNACECompetencies = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'professional_skills_competencies', {
        input: '',
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const competencies = mapNACECompetenciesResponseToUI(response.result as Record<string, unknown>)
      setNACECompetencies(competencies)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Professional skills:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Industry Insights (backend)
  const handleGetIndustryInsights = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'industry_insights', {
        input: selectedIndustry,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const insight = mapIndustryInsightsResponseToUI(response.result as Record<string, unknown>, selectedIndustry)
      setIndustryInsight(insight)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Industry insights:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Career Pathway (backend)
  const handleGeneratePathway = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'career_pathway_planning', {
        input: targetCareer,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry, career_level: careerLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const pathway = mapCareerPathwayResponseToUI(response.result as Record<string, unknown>, targetCareer, selectedIndustry)
      setCareerPathway(pathway)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Career pathway:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // LinkedIn Guide (backend)
  const handleGetLinkedInGuide = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'linkedin_guide', {
        input: '',
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const guide = mapLinkedInGuideResponseToUI(response.result as Record<string, unknown>)
      setLinkedInGuide(guide)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('LinkedIn guide:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Skills Assessment (backend)
  const handleGenerateAssessment = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CAREER_COACH_SLUG, 'skills_assessment_gap_analysis', {
        input: assessmentCompetency,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, current_level: currentLevel, target_level: targetLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const assessment = mapSkillsAssessmentResponseToUI(response.result as Record<string, unknown>, assessmentCompetency, currentLevel, targetLevel)
      setSkillsAssessment(assessment)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Skills assessment:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'resume' as TabType, label: t('careerReadinessCoach.tabs.resume'), icon: FileText },
    { id: 'interview' as TabType, label: t('careerReadinessCoach.tabs.interview'), icon: MessageSquare },
    { id: 'skills' as TabType, label: t('careerReadinessCoach.tabs.skills'), icon: Target },
    { id: 'industry' as TabType, label: t('careerReadinessCoach.tabs.industry'), icon: TrendingUp },
    { id: 'pathway' as TabType, label: t('careerReadinessCoach.tabs.pathway'), icon: Award },
    { id: 'linkedin' as TabType, label: t('careerReadinessCoach.tabs.linkedin'), icon: Linkedin },
    { id: 'assessment' as TabType, label: t('careerReadinessCoach.tabs.assessment'), icon: BarChart3 },
    { id: 'standards' as TabType, label: t('careerReadinessCoach.tabs.standards'), icon: CheckCircle },
  ]
  // Exclude last sub-chatbot from UI; data still from backend for rest
  const visibleTabs = tabs.slice(0, -1)

  return (
    <div className="space-y-6">
      {creditError && (
        <NoCreditsCard
          reason={creditError.reason}
          balance={creditError.balance}
          required={creditError.required}
          onActivated={clearCreditError}
        />
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">{t('careerReadinessCoach.careerReadinessCoach')}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" />{t('careerReadinessCoach.premium')}</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Globe className="inline h-3 w-3 mr-1" />{t('careerReadinessCoach.internationalStandards')}</span>
                </div>
                <p className="mt-2 text-blue-100">{t('careerReadinessCoach.heroDescription')}</p>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('careerReadinessCoach.gradeLevel')}</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="chatbot-header-select chatbot-header-select--emerald"
                >
                  <option value="9-12">9-12</option>
                  <option value="11-12">11-12</option>
                  <option value="College">{t('careerReadinessCoach.college')}</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('careerReadinessCoach.region')}</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="chatbot-header-select chatbot-header-select--emerald"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('careerReadinessCoach.industry')}</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="chatbot-header-select chatbot-header-select--emerald"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('careerReadinessCoach.careerLevel')}</label>
                <select
                  value={careerLevel}
                  onChange={(e) => setCareerLevel(e.target.value)}
                  className="chatbot-header-select chatbot-header-select--emerald"
                >
                  <option>{t('careerReadinessCoach.entry')}</option>
                  <option>{t('careerReadinessCoach.mid')}</option>
                  <option>{t('careerReadinessCoach.senior')}</option>
                  <option>{t('careerReadinessCoach.executive')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Resume Builder Tab */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />{t('careerReadinessCoach.internationalResumeCvBuilder')}</h2>
                <p className="text-gray-600 mb-4">{t('careerReadinessCoach.exploreResumeFormatsFromDifferentRegionsUnderstandCount')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.selectResumeFormat')}</label>
                    <select
                      value={selectedResumeFormat}
                      onChange={(e) => setSelectedResumeFormat(e.target.value)}
                      className="chatbot-content-select chatbot-content-select--blue"
                    >
                      <option>{t('careerReadinessCoach.usResume')}</option>
                      <option>{t('careerReadinessCoach.ukCv')}</option>
                      <option>EU CV (Europass)</option>
                      <option>{t('careerReadinessCoach.asiaPacificCv')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleExploreResumeFormat}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.loading')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.exploreFormat')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {resumeFormat && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{resumeFormat.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {resumeFormat.region}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {resumeFormat.length}
                        </span>
                        {resumeFormat.photo && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{t('careerReadinessCoach.photoIncluded')}</span>
                        )}
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.description')}</h4>
                      <p className="text-gray-700">{resumeFormat.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.sectionOrder')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeFormat.order.map((section, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {i + 1}. {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.keyDifferences')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {resumeFormat.keyDifferences.map((diff, i) => (
                          <li key={i}>{diff}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.personalInformationIncluded')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeFormat.personalInfo.map((info, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {info}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.bestFor')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeFormat.bestFor.map((use, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.exampleStructure')}</h4>
                      <div className="space-y-3">
                        {resumeFormat.exampleStructure.map((example, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-2">{example.section}</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {example.content.map((item, j) => (
                                <li key={j}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />{t('careerReadinessCoach.atsOptimizationTips')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>{t('careerReadinessCoach.useStandardSectionHeadings')}</li>
                        <li>{t('careerReadinessCoach.includeRelevantKeywordsFromJobDescriptions')}</li>
                        <li>{t('careerReadinessCoach.useSimpleCleanFormatting')}</li>
                        <li>{t('careerReadinessCoach.avoidGraphicsAndComplexLayouts')}</li>
                        <li>{t('careerReadinessCoach.saveAsPdfForBestCompatibility')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interview Prep Tab */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-purple-600" />{t('careerReadinessCoach.globalInterviewPreparation')}</h2>
                <p className="text-gray-600 mb-4">{t('careerReadinessCoach.prepareForInterviewsAcrossDifferentCulturesAndInterview')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.questionCategory')}</label>
                    <select
                      value={interviewCategory}
                      onChange={(e) => setInterviewCategory(e.target.value)}
                      className="chatbot-content-select chatbot-content-select--purple"
                    >
                      {interviewCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetInterviewQuestions}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.loading')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.getQuestions')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {interviewQuestions.length > 0 && (
                <div className="space-y-4">
                  {interviewQuestions.map((question, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-purple-300 transition"
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{question.question}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {question.category}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {question.difficulty}
                            </span>
                            {question.industry && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {question.industry}
                              </span>
                            )}
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">{question.culturalContext}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedQuestion && (
                <div className="bg-white border-2 border-purple-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedQuestion.question}</h3>
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.culturalContext')}</h4>
                      <p className="text-gray-700">{selectedQuestion.culturalContext}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Answer Framework: {selectedQuestion.suggestedAnswer.framework}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {selectedQuestion.suggestedAnswer.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 italic">{selectedQuestion.suggestedAnswer.example}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.commonMistakes')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {selectedQuestion.commonMistakes.map((mistake, i) => (
                            <li key={i}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.tips')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {selectedQuestion.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Professional Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />{t('careerReadinessCoach.naceCareerReadinessCompetencies')}</h2>
                <p className="text-gray-600 mb-4">
                  Explore the 8 core competencies identified by NACE (National Association of Colleges and Employers). 
                  These competencies bridge education and workforce readiness.
                </p>
                <button
                  onClick={handleGetNACECompetencies}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.loadCompetencies')}</>
                  )}
                </button>
              </div>

              {naceCompetencies.length > 0 && (
                <div className="space-y-4">
                  {naceCompetencies.map((competency, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-green-300 transition"
                      onClick={() => setSelectedCompetency(selectedCompetency === competency.id ? null : competency.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{competency.name}</h3>
                          <p className="text-gray-600 mt-1">{competency.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Competency {idx + 1}/8
                        </span>
                      </div>

                      {selectedCompetency === competency.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">{t('careerReadinessCoach.proficiencyLevels')}</h4>
                            <div className="space-y-3">
                              {competency.proficiencyLevels.map((level, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold text-gray-900">{level.level}</h5>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                      {level.level.split(' - ')[0]}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{level.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {level.indicators.map((indicator, j) => (
                                      <span key={j} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                        {indicator}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.developmentActivities')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {competency.developmentActivities.map((activity, i) => (
                                  <li key={i}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.evidenceExamples')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {competency.evidenceExamples.map((evidence, i) => (
                                  <li key={i}>{evidence}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.assessmentCriteria')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {competency.assessmentCriteria.map((criteria, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {criteria}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Industry Insights Tab */}
          {activeTab === 'industry' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />{t('careerReadinessCoach.industryInsightsMarketIntelligence')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.selectIndustry')}</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="chatbot-content-select chatbot-content-select--amber"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetIndustryInsights}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.loading')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.getInsights')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {industryInsight && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{industryInsight.industry}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          industryInsight.growthTrend === 'high' ? 'bg-green-100 text-green-700' :
                          industryInsight.growthTrend === 'moderate' ? 'bg-blue-100 text-blue-700' :
                          industryInsight.growthTrend === 'stable' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {industryInsight.growthTrend.toUpperCase()} Growth
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.globalOpportunities')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {industryInsight.globalOpportunities.map((opp, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {opp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.requiredSkills')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {industryInsight.requiredSkills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.certifications')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {industryInsight.certifications.map((cert, i) => (
                            <li key={i}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.salaryRanges')}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">{t('careerReadinessCoach.entryLevel')}</div>
                          <div className="font-bold text-gray-900">{industryInsight.salaryRange.entry}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">{t('careerReadinessCoach.midLevel')}</div>
                          <div className="font-bold text-gray-900">{industryInsight.salaryRange.mid}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">{t('careerReadinessCoach.senior')}</div>
                          <div className="font-bold text-gray-900">{industryInsight.salaryRange.senior}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.careerPathways')}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">{t('careerReadinessCoach.entry')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {industryInsight.careerPathways.entry.map((role, i) => (
                              <li key={i}>{role}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">{t('careerReadinessCoach.progression')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {industryInsight.careerPathways.progression.map((role, i) => (
                              <li key={i}>{role}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">{t('careerReadinessCoach.senior')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {industryInsight.careerPathways.senior.map((role, i) => (
                              <li key={i}>{role}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.geographicHotspots')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {industryInsight.geographicHotspots.map((location, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.futureOutlook')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {industryInsight.futureOutlook.map((outlook, i) => (
                          <li key={i}>{outlook}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Career Pathways Tab */}
          {activeTab === 'pathway' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-indigo-600" />{t('careerReadinessCoach.careerPathwayPlanning')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.targetCareer')}</label>
                    <input
                      type="text"
                      value={targetCareer}
                      onChange={(e) => setTargetCareer(e.target.value)}
                      placeholder={t('careerReadinessCoach.eGSoftwareEngineer')}
                      className="chatbot-content-select chatbot-content-select--indigo"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGeneratePathway}
                      disabled={!targetCareer.trim() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.generating')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.generatePathway')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {careerPathway && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{careerPathway.career}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('careerReadinessCoach.entryLevelRequirements')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">{t('careerReadinessCoach.education')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {careerPathway.entryLevel.education.map((edu, i) => (
                              <li key={i}>{edu}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">{t('careerReadinessCoach.skills')}</h5>
                          <div className="flex flex-wrap gap-2">
                            {careerPathway.entryLevel.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('careerReadinessCoach.careerProgression')}</h4>
                      <div className="space-y-4">
                        {careerPathway.progression.map((level, idx) => (
                          <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{level.level}</h5>
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                {level.years}
                              </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h6 className="font-medium text-gray-900 mb-1 text-sm">{t('careerReadinessCoach.skills')}</h6>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {level.skills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h6 className="font-medium text-gray-900 mb-1 text-sm">{t('careerReadinessCoach.responsibilities')}</h6>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {level.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.seniorLevel')}</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-2">
                          <h5 className="font-medium text-gray-900 mb-1">{t('careerReadinessCoach.roles')}</h5>
                          <div className="flex flex-wrap gap-2">
                            {careerPathway.seniorLevel.roles.map((role, i) => (
                              <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-2">
                          <h5 className="font-medium text-gray-900 mb-1">{t('careerReadinessCoach.requirements')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {careerPathway.seniorLevel.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{t('careerReadinessCoach.compensation')}</h5>
                          <p className="text-gray-700 font-semibold">{careerPathway.seniorLevel.compensation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.alternativePaths')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {careerPathway.alternativePaths.map((path, i) => (
                            <li key={i}>{path}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.internationalOpportunities')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {careerPathway.internationalOpportunities.map((opp, i) => (
                            <li key={i}>{opp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LinkedIn Guide Tab */}
          {activeTab === 'linkedin' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Linkedin className="h-6 w-6 text-blue-600" />{t('careerReadinessCoach.linkedinProfessionalNetworking')}</h2>
                <p className="text-gray-600 mb-4">{t('careerReadinessCoach.optimizeYourLinkedinProfileForGlobalOpportunitiesBuildP')}</p>
                <button
                  onClick={handleGetLinkedInGuide}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.loadGuide')}</>
                  )}
                </button>
              </div>

              {linkedInGuide && (
                <div className="space-y-4">
                  {linkedInGuide.profileSections.map((section, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{section.section}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block ${
                            section.importance === 'Critical' ? 'bg-red-100 text-red-700' :
                            section.importance === 'High' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {section.importance}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.bestPractices')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {section.bestPractices.map((practice, i) => (
                              <li key={i}>{practice}</li>
                            ))}
                          </ul>
                        </div>

                        {section.examples.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.examples')}</h4>
                            <div className="space-y-2">
                              {section.examples.map((example, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-700 italic">"{example}"</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{t('careerReadinessCoach.keywordStrategy')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {linkedInGuide.keywordStrategy.map((keyword, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{t('careerReadinessCoach.networkingTips')}</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {linkedInGuide.networkingTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('careerReadinessCoach.contentStrategy')}</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {linkedInGuide.contentStrategy.map((strategy, i) => (
                        <li key={i}>{strategy}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />{t('careerReadinessCoach.commonMistakesToAvoid')}</h3>
                    <ul className="list-disc list-inside space-y-1 text-red-800">
                      {linkedInGuide.commonMistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skills Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-teal-600" />{t('careerReadinessCoach.skillsAssessmentGapAnalysis')}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.competency')}</label>
                    <select
                      value={assessmentCompetency}
                      onChange={(e) => setAssessmentCompetency(e.target.value)}
                      className="chatbot-content-select chatbot-content-select--teal"
                    >
                      <option>{t('careerReadinessCoach.criticalThinkingProblemSolving')}</option>
                      <option>{t('careerReadinessCoach.oralWrittenCommunications')}</option>
                      <option>{t('careerReadinessCoach.teamworkCollaboration')}</option>
                      <option>{t('careerReadinessCoach.digitalTechnology')}</option>
                      <option>{t('careerReadinessCoach.leadership')}</option>
                      <option>{t('careerReadinessCoach.professionalismWorkEthic')}</option>
                      <option>{t('careerReadinessCoach.careerManagement')}</option>
                      <option>{t('careerReadinessCoach.globalInterculturalFluency')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.currentLevel')}</label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="chatbot-content-select chatbot-content-select--teal"
                    >
                      <option value="A1">{t('careerReadinessCoach.a1Basic')}</option>
                      <option value="A2">{t('careerReadinessCoach.a2Elementary')}</option>
                      <option value="B1">{t('careerReadinessCoach.b1Intermediate')}</option>
                      <option value="B2">{t('careerReadinessCoach.b2Proficient')}</option>
                      <option value="C1">{t('careerReadinessCoach.c1Advanced')}</option>
                      <option value="C2">{t('careerReadinessCoach.c2Outstanding')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('careerReadinessCoach.targetLevel')}</label>
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="chatbot-content-select chatbot-content-select--teal"
                    >
                      <option value="A2">{t('careerReadinessCoach.a2Elementary')}</option>
                      <option value="B1">{t('careerReadinessCoach.b1Intermediate')}</option>
                      <option value="B2">{t('careerReadinessCoach.b2Proficient')}</option>
                      <option value="C1">{t('careerReadinessCoach.c1Advanced')}</option>
                      <option value="C2">{t('careerReadinessCoach.c2Outstanding')}</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGenerateAssessment}
                  disabled={isGenerating}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('careerReadinessCoach.generating')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('careerReadinessCoach.generateAssessment')}</>
                  )}
                </button>
              </div>

              {skillsAssessment && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{skillsAssessment.competency}</h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">{t('careerReadinessCoach.currentLevel')}</div>
                        <div className="text-2xl font-bold text-gray-900">{skillsAssessment.currentLevel}</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600">{t('careerReadinessCoach.targetLevel')}</div>
                        <div className="text-2xl font-bold text-blue-900">{skillsAssessment.targetLevel}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.gapAnalysis')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {skillsAssessment.gapAnalysis.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('careerReadinessCoach.developmentPlan')}</h4>
                      <div className="space-y-3">
                        {skillsAssessment.developmentPlan.map((plan, idx) => (
                          <div key={idx} className="border-l-4 border-teal-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{plan.activity}</h5>
                              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                                {plan.timeline}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">{t('careerReadinessCoach.resources')}</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {plan.resources.map((resource, i) => (
                                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.evidenceNeeded')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {skillsAssessment.evidenceNeeded.map((evidence, i) => (
                          <li key={i}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standards Alignment Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-violet-600" />{t('careerReadinessCoach.internationalStandardsAlignment')}</h2>
                <p className="text-gray-600">{t('careerReadinessCoach.thisCareerReadinessCoachAlignsWithMajorInternationalSta')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-violet-600" />{t('careerReadinessCoach.naceCareerReadinessCompetencies')}</h3>
                  <p className="text-gray-700 mb-3">{t('careerReadinessCoach.fullAlignmentWithAll8CoreCompetenciesIdentifiedByThe')}</p>
                  <div className="space-y-2">
                    {[
                      'Critical Thinking/Problem Solving',
                      'Oral/Written Communications',
                      'Teamwork/Collaboration',
                      'Digital Technology',
                      'Leadership',
                      'Professionalism/Work Ethic',
                      'Career Management',
                      'Global/Intercultural Fluency'
                    ].map((comp, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {comp}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-violet-600" />{t('careerReadinessCoach.cifrFramework')}</h3>
                  <p className="text-gray-700 mb-3">
                    Proficiency level assessment aligned with Common International Framework of Reference 
                    for Future Readiness (A1-C2 scale).
                  </p>
                  <div className="space-y-2">
                    {[
                      'A1 - Basic Proficiency',
                      'A2 - Elementary',
                      'B1 - Intermediate',
                      'B2 - Proficient',
                      'C1 - Advanced',
                      'C2 - Outstanding Mastery'
                    ].map((level, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {level}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-violet-600" />{t('careerReadinessCoach.actCollegeCareerReadinessStandards')}</h3>
                  <p className="text-gray-700 mb-3">{t('careerReadinessCoach.alignmentWithActStandardsDescribingEssentialSkillsForCo')}</p>
                  <div className="space-y-2">
                    {[
                      'English Language Arts',
                      'Mathematics',
                      'Reading',
                      'Science',
                      'Writing',
                      'Cross-cutting Skills'
                    ].map((standard, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {standard}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-violet-600" />{t('careerReadinessCoach.oecdCareerReadinessGuidelines')}</h3>
                  <p className="text-gray-700 mb-3">{t('careerReadinessCoach.integrationOfOecdBestPracticesForPreparingYoungPeopleFo')}</p>
                  <div className="space-y-2">
                    {[
                      'Career exploration activities',
                      'Work-based learning',
                      'Career guidance',
                      'Skills development',
                      'Labor market information',
                      'Employer engagement'
                    ].map((guideline, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {guideline}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">21st Century Skills (P21 Framework)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.learningInnovation')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>{t('careerReadinessCoach.criticalThinking')}</li>
                      <li>{t('careerReadinessCoach.creativity')}</li>
                      <li>{t('careerReadinessCoach.communication')}</li>
                      <li>{t('careerReadinessCoach.collaboration')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.informationMedia')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>{t('careerReadinessCoach.informationLiteracy')}</li>
                      <li>{t('careerReadinessCoach.mediaLiteracy')}</li>
                      <li>{t('careerReadinessCoach.ictLiteracy')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('careerReadinessCoach.lifeCareer')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>{t('careerReadinessCoach.flexibilityAdaptability')}</li>
                      <li>{t('careerReadinessCoach.initiativeSelfDirection')}</li>
                      <li>{t('careerReadinessCoach.socialCrossCultural')}</li>
                      <li>{t('careerReadinessCoach.productivityAccountability')}</li>
                      <li>{t('careerReadinessCoach.leadershipResponsibility')}</li>
                    </ul>
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

export default CareerReadinessCoach


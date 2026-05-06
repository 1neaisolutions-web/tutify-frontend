import { useState } from 'react'
import {
  Shield,
  AlertTriangle,
  FlaskConical,
  Beaker,
  Eye,
  Heart,
  FileCheck,
  CheckCircle,
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
  AlertCircle,
  Flame,
  Droplets,
  Users,
} from 'lucide-react'
import {
  getLabTypes,
  getLabGradeLevels,
  getProtocolCategories,
  SafetyStandard,
  SafetyProtocol,
  RiskAssessment,
  ChemicalInfo,
  EquipmentSafety,
  EmergencyProcedure,
  ExperimentDesign,
} from '../../utils/labSafetyUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapLabSafetyStandardsResult,
  mapLabSafetyProtocolResult,
  mapLabRiskAssessmentResult,
  mapLabChemicalResult,
  mapLabEquipmentResult,
  mapLabEmergencyResult,
  mapLabExperimentDesignResult,
  labProtocolCategoryToParam,
} from '../../utils/labSafetyAdapters'

const CHATBOT_SLUG = 'lab-safety-protocol-advisor'

type TabType = 'standards' | 'protocols' | 'risk-assessment' | 'chemicals' | 'equipment' | 'emergency' | 'experiment-design' | 'compliance'

const LabSafetyProtocolAdvisor = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('standards')
  const [labType, setLabType] = useState('Chemistry')
  const [gradeLevel, setGradeLevel] = useState('High School (9-12)')
  const [isGenerating, setIsGenerating] = useState(false)

  // Standards State
  const [safetyStandards, setSafetyStandards] = useState<SafetyStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<SafetyStandard | null>(null)

  // Protocols State
  const [protocolCategory, setProtocolCategory] = useState('Chemical Handling')
  const [safetyProtocol, setSafetyProtocol] = useState<SafetyProtocol | null>(null)

  // Risk Assessment State
  const [experimentName, setExperimentName] = useState('')
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)

  // Chemical Safety State
  const [chemicalName, setChemicalName] = useState('')
  const [chemicalInfo, setChemicalInfo] = useState<ChemicalInfo | null>(null)

  // Equipment State
  const [equipmentName, setEquipmentName] = useState('')
  const [equipmentSafety, setEquipmentSafety] = useState<EquipmentSafety | null>(null)

  // Emergency State
  const [emergencyType, setEmergencyType] = useState('chemical-spill')
  const [emergencyProcedure, setEmergencyProcedure] = useState<EmergencyProcedure | null>(null)

  // Experiment Design State
  const [experimentTitle, setExperimentTitle] = useState('')
  const [experimentObjective, setExperimentObjective] = useState('')
  const [experimentDesign, setExperimentDesign] = useState<ExperimentDesign | null>(null)

  const LAB_CAP_TABS: Record<string, TabType> = {
    lab_safety_standards: 'standards',
    lab_safety_protocols: 'protocols',
    lab_risk_assessment: 'risk-assessment',
    lab_chemical_safety: 'chemicals',
    lab_equipment_safety: 'equipment',
    lab_emergency_procedures: 'emergency',
    lab_experiment_design: 'experiment-design',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: LAB_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = [
        'standards',
        'protocols',
        'risk-assessment',
        'chemicals',
        'equipment',
        'emergency',
        'experiment-design',
        'compliance',
      ]
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && LAB_CAP_TABS[cap]
            ? LAB_CAP_TABS[cap]
            : 'standards'
      setActiveTab(tab)
      const u = userContent?.trim() ?? ''
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setSafetyStandards([])
        setSafetyProtocol(null)
        setRiskAssessment(null)
        setChemicalInfo(null)
        setEquipmentSafety(null)
        setEmergencyProcedure(null)
        setExperimentDesign(null)
        if (tab === 'standards') setSafetyStandards(mapLabSafetyStandardsResult(raw))
        else if (tab === 'protocols') setSafetyProtocol(mapLabSafetyProtocolResult(raw))
        else if (tab === 'risk-assessment') {
          if (u) setExperimentName(u)
          setRiskAssessment(mapLabRiskAssessmentResult(raw))
        } else if (tab === 'chemicals') {
          if (u) setChemicalName(u)
          setChemicalInfo(mapLabChemicalResult(raw))
        } else if (tab === 'equipment') {
          if (u) setEquipmentName(u)
          setEquipmentSafety(mapLabEquipmentResult(raw))
        } else if (tab === 'emergency') setEmergencyProcedure(mapLabEmergencyResult(raw))
        else if (tab === 'experiment-design') {
          if (u) setExperimentTitle(u)
          setExperimentDesign(mapLabExperimentDesignResult(raw))
        }
      } catch {
        toast.error('Could not restore saved output from History.')
      }
    },
  })

  const labTypes = getLabTypes()
  const gradeLevels = getLabGradeLevels()
  const protocolCategories = getProtocolCategories()

  // Load Safety Standards
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_safety_standards', {
        input: ' ',
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setSafetyStandards(mapLabSafetyStandardsResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Safety standards loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load standards'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Safety Protocol
  const handleGenerateProtocol = async () => {
    setIsGenerating(true)
    try {
      const context = `Lab safety protocol for ${labType} (${gradeLevel}). Focus: ${protocolCategory}.`
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_safety_protocols', {
        input: context,
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
          protocol_category: labProtocolCategoryToParam(protocolCategory),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setSafetyProtocol(mapLabSafetyProtocolResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Protocol generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate protocol'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Risk Assessment
  const handleGenerateRiskAssessment = async () => {
    if (!experimentName.trim()) return
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_risk_assessment', {
        input: experimentName.trim(),
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setRiskAssessment(mapLabRiskAssessmentResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Risk assessment generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate risk assessment'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Get Chemical Info
  const handleGetChemicalInfo = async () => {
    if (!chemicalName.trim()) return
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_chemical_safety', {
        input: chemicalName.trim(),
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setChemicalInfo(mapLabChemicalResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Chemical information loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load chemical info'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Get Equipment Safety
  const handleGetEquipmentSafety = async () => {
    if (!equipmentName.trim()) return
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_equipment_safety', {
        input: equipmentName.trim(),
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEquipmentSafety(mapLabEquipmentResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Equipment safety guide loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load equipment safety'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Get Emergency Procedure
  const handleGetEmergencyProcedure = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_emergency_procedures', {
        input: ' ',
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
          emergency_type: emergencyType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEmergencyProcedure(mapLabEmergencyResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Emergency procedure loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load emergency procedure'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Experiment Design
  const handleGenerateExperimentDesign = async () => {
    if (!experimentTitle.trim() || !experimentObjective.trim()) return
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'lab_experiment_design', {
        input: experimentTitle.trim(),
        input_type: 'text',
        parameters: {
          lab_type: labType,
          grade_level: gradeLevel,
          experiment_title: experimentTitle.trim(),
          experiment_objective: experimentObjective.trim(),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setExperimentDesign(mapLabExperimentDesignResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Experiment design generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate experiment design'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'standards' as TabType, label: 'Safety Standards', icon: Shield },
    { id: 'protocols' as TabType, label: 'Safety Protocols', icon: FileCheck },
    { id: 'risk-assessment' as TabType, label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'chemicals' as TabType, label: 'Chemical Safety', icon: Beaker },
    { id: 'equipment' as TabType, label: 'Equipment Safety', icon: FlaskConical },
    { id: 'emergency' as TabType, label: 'Emergency Procedures', icon: Heart },
    { id: 'experiment-design' as TabType, label: 'Experiment Design', icon: Lightbulb },
    { id: 'compliance' as TabType, label: 'Compliance', icon: CheckCircle },
  ]

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
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Lab Safety & Protocol Advisor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.8★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Globe className="inline h-3 w-3 mr-1" /> International Standards
                  </span>
                </div>
                <p className="mt-2 text-red-100">
                  Comprehensive lab safety tools aligned with international standards (ISO/IEC 17025, OSHA, GHS, IAEA, IEC). 
                  Help teachers ensure student safety with protocols, risk assessments, chemical safety information, 
                  and emergency procedures. Prepare students for safe laboratory work globally.
                </p>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Lab Type:</label>
                <select
                  value={labType}
                  onChange={(e) => setLabType(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {labTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Grade Level:</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {gradeLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
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
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600 bg-red-50'
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
          {/* Safety Standards Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  International Safety Standards
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore major international safety standards for laboratory operations. Understand compliance 
                  requirements and best practices for global lab safety.
                </p>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load Standards
                    </>
                  )}
                </button>
              </div>

              {safetyStandards.length > 0 && (
                <div className="space-y-4">
                  {safetyStandards.map((standard, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-red-300 transition"
                      onClick={() => setSelectedStandard(selectedStandard?.id === standard.id ? null : standard)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{standard.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              {standard.organization}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {standard.region}
                            </span>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600">{standard.description}</p>

                      {selectedStandard?.id === standard.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Requirements</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.keyRequirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Compliance Checklist</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.complianceChecklist.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Safety Protocols Tab */}
          {activeTab === 'protocols' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-orange-600" />
                  Safety Protocol Generator
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protocol Category
                    </label>
                    <select
                      value={protocolCategory}
                      onChange={(e) => setProtocolCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      {protocolCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateProtocol}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate Protocol
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {safetyProtocol && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{safetyProtocol.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          {safetyProtocol.labType}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {safetyProtocol.gradeLevel}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Protocol Steps</h4>
                      <div className="space-y-2">
                        {safetyProtocol.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
                              {step.step}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-900">{step.action}</p>
                              {step.safetyNote && (
                                <p className="text-sm text-orange-700 mt-1 flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4" />
                                  {step.safetyNote}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required PPE</h4>
                        <div className="flex flex-wrap gap-2">
                          {safetyProtocol.requiredPPE.map((ppe, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {ppe}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Potential Hazards</h4>
                        <div className="flex flex-wrap gap-2">
                          {safetyProtocol.hazards.map((hazard, i) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {hazard}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Emergency Procedures</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {safetyProtocol.emergencyProcedures.map((proc, i) => (
                          <li key={i}>{proc}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Compliance Standards</h4>
                      <div className="flex flex-wrap gap-2">
                        {safetyProtocol.complianceStandards.map((standard, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {standard}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Risk Assessment Tab */}
          {activeTab === 'risk-assessment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  Risk Assessment Tool
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiment Name
                    </label>
                    <input
                      type="text"
                      value={experimentName}
                      onChange={(e) => setExperimentName(e.target.value)}
                      placeholder="e.g., Acid-Base Titration"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateRiskAssessment}
                      disabled={!experimentName.trim() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Assessing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Assess Risk
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {riskAssessment && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{riskAssessment.experiment}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          riskAssessment.overallRisk === 'critical' ? 'bg-red-100 text-red-700' :
                          riskAssessment.overallRisk === 'high' ? 'bg-orange-100 text-orange-700' :
                          riskAssessment.overallRisk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {riskAssessment.overallRisk.toUpperCase()} RISK
                        </span>
                        {riskAssessment.approvalRequired && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            Approval Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Identified Hazards</h4>
                      <div className="space-y-3">
                        {riskAssessment.hazards.map((hazard, idx) => (
                          <div key={idx} className="border-l-4 border-yellow-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                {hazard.type}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                hazard.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                hazard.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                hazard.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {hazard.severity}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{hazard.description}</p>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Control Measures:</span>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-1">
                                {hazard.controls.map((control, i) => (
                                  <li key={i}>{control}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {riskAssessment.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chemical Safety Tab */}
          {activeTab === 'chemicals' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Beaker className="h-6 w-6 text-blue-600" />
                  Chemical Safety Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chemical Name
                    </label>
                    <input
                      type="text"
                      value={chemicalName}
                      onChange={(e) => setChemicalName(e.target.value)}
                      placeholder="e.g., Hydrochloric Acid"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetChemicalInfo}
                      disabled={!chemicalName.trim() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Get Safety Info
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {chemicalInfo && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{chemicalInfo.name}</h3>
                  
                  <div className="space-y-4">
                    {chemicalInfo.formula && (
                      <div>
                        <span className="text-sm text-gray-600">Formula:</span>
                        <span className="ml-2 font-mono text-gray-900">{chemicalInfo.formula}</span>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">GHS Hazard Classes</h4>
                      <div className="flex flex-wrap gap-2">
                        {chemicalInfo.ghsHazardClasses.map((hazard, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {hazard}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Storage Requirements</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {chemicalInfo.storageRequirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Incompatibilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {chemicalInfo.incompatibilities.map((incomp, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              {incomp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Required PPE</h4>
                      <div className="flex flex-wrap gap-2">
                        {chemicalInfo.ppeRequired.map((ppe, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {ppe}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Disposal Method</h4>
                      <p className="text-gray-700">{chemicalInfo.disposalMethod}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Emergency Procedures</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {chemicalInfo.emergencyProcedures.map((proc, i) => (
                          <li key={i}>{proc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Equipment Safety Tab */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FlaskConical className="h-6 w-6 text-purple-600" />
                  Equipment Safety Guide
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Name
                    </label>
                    <input
                      type="text"
                      value={equipmentName}
                      onChange={(e) => setEquipmentName(e.target.value)}
                      placeholder="e.g., Bunsen Burner"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetEquipmentSafety}
                      disabled={!equipmentName.trim() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Get Safety Guide
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {equipmentSafety && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{equipmentSafety.equipment}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Safety Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {equipmentSafety.safetyFeatures.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Operating Procedures</h4>
                      <div className="space-y-2">
                        {equipmentSafety.operatingProcedures.map((proc, i) => (
                          <div key={i} className="flex gap-3 p-2 bg-gray-50 rounded">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="text-gray-700">{proc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Hazards</h4>
                        <div className="flex flex-wrap gap-2">
                          {equipmentSafety.hazards.map((hazard, i) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {hazard}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required PPE</h4>
                        <div className="flex flex-wrap gap-2">
                          {equipmentSafety.ppeRequired.map((ppe, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {ppe}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Emergency Procedures</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {equipmentSafety.emergencyProcedures.map((proc, i) => (
                          <li key={i}>{proc}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Age Appropriate</h4>
                      <p className="text-gray-700">{equipmentSafety.ageAppropriate.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Emergency Procedures Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-600" />
                  Emergency Procedures
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Type
                    </label>
                    <select
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="chemical-spill">Chemical Spill</option>
                      <option value="fire">Fire</option>
                      <option value="medical-emergency">Medical Emergency</option>
                      <option value="evacuation">Evacuation</option>
                      <option value="equipment-failure">Equipment Failure</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetEmergencyProcedure}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Get Procedure
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {emergencyProcedure && (
                <div className="bg-white border-2 border-red-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {emergencyType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Procedure
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Emergency Steps</h4>
                      <div className="space-y-2">
                        {emergencyProcedure.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                            <span className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-sm">
                              {i + 1}
                            </span>
                            <span className="text-gray-900 font-medium">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Required PPE</h4>
                      <div className="flex flex-wrap gap-2">
                        {emergencyProcedure.ppeRequired.map((ppe, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {ppe}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Emergency Contacts</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {emergencyProcedure.contacts.map((contact, i) => (
                          <li key={i}>{contact}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Follow-Up Actions</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {emergencyProcedure.followUp.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experiment Design Tab */}
          {activeTab === 'experiment-design' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                  Experiment Design Advisor
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiment Title
                    </label>
                    <input
                      type="text"
                      value={experimentTitle}
                      onChange={(e) => setExperimentTitle(e.target.value)}
                      placeholder="e.g., Photosynthesis Rate Measurement"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objective
                    </label>
                    <textarea
                      value={experimentObjective}
                      onChange={(e) => setExperimentObjective(e.target.value)}
                      placeholder="Describe what students will learn..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={handleGenerateExperimentDesign}
                    disabled={!experimentTitle.trim() || !experimentObjective.trim() || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Design
                      </>
                    )}
                  </button>
                </div>
              </div>

              {experimentDesign && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{experimentDesign.title}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Objective</h4>
                      <p className="text-gray-700">{experimentDesign.objective}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                      <div className="space-y-2">
                        {experimentDesign.materials.map((material, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-gray-700">{material.item} ({material.quantity})</span>
                            {material.safetyNotes && (
                              <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                                {material.safetyNotes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Procedure</h4>
                      <div className="space-y-2">
                        {experimentDesign.procedure.map((step, i) => (
                          <div key={i} className="flex gap-3 p-2 bg-gray-50 rounded">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Safety Considerations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {experimentDesign.safetyConsiderations.map((consideration, i) => (
                          <li key={i}>{consideration}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        experimentDesign.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                        experimentDesign.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                        experimentDesign.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {experimentDesign.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  Compliance & Standards Alignment
                </h2>
                <p className="text-gray-600">
                  This Lab Safety & Protocol Advisor aligns with major international safety standards 
                  for laboratory operations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    ISO/IEC 17025
                  </h3>
                  <p className="text-gray-700 mb-3">
                    General requirements for laboratory competence
                  </p>
                  <div className="space-y-2">
                    {['Technical competence', 'Quality management', 'Equipment calibration', 'Personnel qualifications'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-indigo-600" />
                    OSHA Lab Standard
                  </h3>
                  <p className="text-gray-700 mb-3">
                    29 CFR 1910.1450 - Laboratory safety requirements
                  </p>
                  <div className="space-y-2">
                    {['Chemical Hygiene Plan', 'Hazard communication', 'Training requirements', 'Exposure limits'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-indigo-600" />
                    GHS (Globally Harmonized System)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Standardized chemical classification and labeling
                  </p>
                  <div className="space-y-2">
                    {['Hazard classification', 'Safety data sheets', 'Labeling requirements', 'Pictograms'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-indigo-600" />
                    NFPA 45
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Fire protection for laboratories using chemicals
                  </p>
                  <div className="space-y-2">
                    {['Fire protection systems', 'Ventilation requirements', 'Storage compliance', 'Emergency planning'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {item}
                      </div>
                    ))}
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

export default LabSafetyProtocolAdvisor


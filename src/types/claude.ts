export interface EthicalAIPrinciples {
  constitutionalAI: boolean
  biasMitigation: boolean
  privacyFirst: boolean
  harmfulContentPrevention: boolean
  ethicalAssessment: boolean
}

export interface BiasDetectionResult {
  detected: boolean
  type?: 'gender' | 'cultural' | 'socioeconomic' | 'racial' | 'ability' | 'other'
  severity: 'low' | 'medium' | 'high'
  location?: string
  suggestion: string
}

export interface PrivacyComplianceStatus {
  ferpaCompliant: boolean
  coppaCompliant: boolean
  dataMinimized: boolean
  consentManaged: boolean
  secureHandling: boolean
  issues: string[]
  recommendations: string[]
}

export interface LongDocumentAnalysis {
  documentId: string
  fileName: string
  fileSize: number
  tokenCount: number
  keyInsights: string[]
  standardsExtracted: string[]
  curriculumInfo: {
    subjects: string[]
    gradeLevels: string[]
    topics: string[]
  }
  summary: string
  processedAt: Date
}

export interface GuidedLearningSession {
  sessionId: string
  mode: 'socratic' | 'step-by-step' | 'critical-thinking' | 'metacognitive'
  questions: GuidedQuestion[]
  currentStep: number
  hints: string[]
  reflections: string[]
}

export interface GuidedQuestion {
  id: string
  question: string
  type: 'socratic' | 'hint' | 'reflection' | 'critical-thinking'
  level: 'beginner' | 'intermediate' | 'advanced'
  answered: boolean
}

export interface CurriculumAlignmentResult {
  standards: string[]
  alignmentScore: number
  coverage: {
    standard: string
    covered: boolean
    evidence: string[]
  }[]
  gaps: string[]
  crossCurricularConnections: {
    subject: string
    connections: string[]
  }[]
  ethicalReview: {
    passed: boolean
    concerns: string[]
    recommendations: string[]
  }
}

export interface DocumentComparison {
  documents: string[]
  similarities: string[]
  differences: string[]
  standardsComparison: {
    common: string[]
    unique: string[]
  }
  synthesis: string
}

export interface EthicalAssessmentReview {
  biasFree: boolean
  culturallyResponsive: boolean
  accessible: boolean
  fair: boolean
  issues: BiasDetectionResult[]
  recommendations: string[]
  score: number
}




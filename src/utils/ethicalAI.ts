import { BiasDetectionResult, PrivacyComplianceStatus, EthicalAIPrinciples } from '../types/claude'

// Constitutional AI Principles
export const constitutionalAIPrinciples: EthicalAIPrinciples = {
  constitutionalAI: true,
  biasMitigation: true,
  privacyFirst: true,
  harmfulContentPrevention: true,
  ethicalAssessment: true,
}

// Bias detection keywords and patterns
const biasPatterns = {
  gender: [
    /he should|she should|boys are|girls are|men are|women are/gi,
    /masculine|feminine|manly|girly/gi,
  ],
  cultural: [
    /western way|american way|traditional values/gi,
    /exotic|civilized|primitive/gi,
  ],
  socioeconomic: [
    /poor kids|rich kids|affluent|disadvantaged/gi,
    /inner city|suburban|urban/gi,
  ],
  racial: [
    /race|ethnicity|skin color/gi,
  ],
  ability: [
    /normal kids|special needs|disabled|handicapped/gi,
  ],
}

export const detectBias = (content: string): BiasDetectionResult[] => {
  const results: BiasDetectionResult[] = []
  const lowerContent = content.toLowerCase()

  Object.entries(biasPatterns).forEach(([type, patterns]) => {
    patterns.forEach((pattern) => {
      if (pattern.test(content)) {
        const matches = content.match(pattern)
        if (matches) {
          results.push({
            detected: true,
            type: type as BiasDetectionResult['type'],
            severity: matches.length > 2 ? 'high' : matches.length > 1 ? 'medium' : 'low',
            location: matches[0],
            suggestion: `Consider revising language to be more inclusive and avoid ${type} bias.`,
          })
        }
      }
    })
  })

  return results.length > 0 ? results : [{ detected: false, severity: 'low', suggestion: 'No bias detected.' }]
}

export const checkPrivacyCompliance = (
  content: string,
  includesStudentData: boolean = false
): PrivacyComplianceStatus => {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check for potential student data
  const studentDataPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{3}-\d{3}-\d{4}\b/, // Phone
  ]

  const hasStudentData = studentDataPatterns.some((pattern) => pattern.test(content))

  if (hasStudentData || includesStudentData) {
    issues.push('Potential student data detected')
    recommendations.push('Remove or anonymize student data before processing')
  }

  // FERPA compliance
  const ferpaCompliant = !hasStudentData && !includesStudentData
  if (!ferpaCompliant) {
    recommendations.push('Ensure FERPA compliance by removing personally identifiable information')
  }

  // COPPA compliance (for students under 13)
  const coppaCompliant = ferpaCompliant

  // Data minimization
  const dataMinimized = content.length < 10000 // Simplified check
  if (!dataMinimized) {
    recommendations.push('Consider minimizing data to only what is necessary')
  }

  return {
    ferpaCompliant,
    coppaCompliant,
    dataMinimized,
    consentManaged: true, // Assume managed if no issues
    secureHandling: true, // Assume secure
    issues,
    recommendations,
  }
}

export const checkContentSafety = (content: string): { safe: boolean; concerns: string[] } => {
  const concerns: string[] = []
  const harmfulPatterns = [
    /violence|weapon|harm|danger/gi,
    /inappropriate|explicit/gi,
  ]

  harmfulPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      concerns.push('Content may contain potentially harmful material')
    }
  })

  return {
    safe: concerns.length === 0,
    concerns,
  }
}

export const applyEthicalPrinciples = (content: string): string => {
  let ethicalContent = content

  // Remove biased language
  const biasResults = detectBias(content)
  biasResults.forEach((result) => {
    if (result.detected && result.location) {
      // Simplified bias mitigation
      ethicalContent = ethicalContent.replace(
        new RegExp(result.location, 'gi'),
        '[revised for inclusivity]'
      )
    }
  })

  return ethicalContent
}




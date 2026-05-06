// Business Studies Mentor Utilities - International Business Focus

export interface InternationalBusinessStandard {
  id: string
  name: string
  organization: string
  region: string
  description: string
  keyPrinciples: string[]
  applicationAreas: string[]
  complianceRequirements: string[]
  benefits: string[]
  caseStudies: {
    company: string
    scenario: string
    outcome: string
  }[]
}

export interface EntrepreneurshipFramework {
  stage: string
  description: string
  activities: string[]
  skills: string[]
  resources: string[]
  challenges: string[]
  successFactors: string[]
  internationalConsiderations: string[]
}

export interface EconomicConcept {
  name: string
  category: string
  description: string
  keyTerms: string[]
  realWorldExamples: string[]
  internationalImplications: string[]
  teachingStrategies: string[]
  caseStudies: string[]
}

export interface FinancialLiteracyModule {
  topic: string
  gradeLevel: string
  learningObjectives: string[]
  keyConcepts: string[]
  activities: string[]
  realWorldApplications: string[]
  internationalPerspectives: string[]
  assessment: string[]
}

export interface BusinessScenario {
  title: string
  type: 'case-study' | 'simulation' | 'project'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  industry: string
  region: string
  scenario: string
  objectives: string[]
  questions: string[]
  resources: string[]
  expectedOutcomes: string[]
  internationalElements: string[]
}

export interface TradeAgreement {
  name: string
  countries: string[]
  type: string
  keyProvisions: string[]
  benefits: string[]
  challenges: string[]
  impact: string[]
  teachingPoints: string[]
}

export interface CrossCulturalBusinessGuide {
  region: string
  businessPractices: string[]
  communicationStyles: string[]
  negotiationApproaches: string[]
  culturalConsiderations: string[]
  commonMistakes: string[]
  successStrategies: string[]
  caseExamples: string[]
}

// International Business Standards
export const getInternationalStandards = (): InternationalBusinessStandard[] => [
  {
    id: 'iso-9001',
    name: 'ISO 9001: Quality Management',
    organization: 'ISO',
    region: 'Global',
    description: 'International standard for quality management systems, ensuring consistent quality in products and services',
    keyPrinciples: [
      'Customer focus',
      'Leadership',
      'Engagement of people',
      'Process approach',
      'Continuous improvement'
    ],
    applicationAreas: ['Manufacturing', 'Services', 'Healthcare', 'Education'],
    complianceRequirements: [
      'Documented quality management system',
      'Management commitment',
      'Regular audits',
      'Continuous improvement processes'
    ],
    benefits: [
      'Improved customer satisfaction',
      'Enhanced market credibility',
      'Operational efficiency',
      'Global market access'
    ],
    caseStudies: [
      {
        company: 'Toyota',
        scenario: 'Implemented ISO 9001 across global operations',
        outcome: 'Achieved consistent quality standards worldwide, increased customer trust'
      }
    ]
  },
  {
    id: 'ifrs',
    name: 'IFRS: International Financial Reporting Standards',
    organization: 'IASB',
    region: 'Global',
    description: 'Global accounting standards for financial reporting, enabling comparability across countries',
    keyPrinciples: [
      'Fair presentation',
      'Going concern',
      'Accrual basis',
      'Materiality',
      'Consistency'
    ],
    applicationAreas: ['Financial Reporting', 'Accounting', 'Investment Analysis'],
    complianceRequirements: [
      'Adoption of IFRS standards',
      'Professional accounting qualifications',
      'Regular financial audits',
      'Transparent disclosure'
    ],
    benefits: [
      'Global financial comparability',
      'Easier cross-border investment',
      'Reduced reporting costs',
      'Enhanced transparency'
    ],
    caseStudies: [
      {
        company: 'Samsung',
        scenario: 'Adopted IFRS for international operations',
        outcome: 'Easier access to global capital markets, improved investor confidence'
      }
    ]
  },
  {
    id: 'wto',
    name: 'WTO Trade Rules',
    organization: 'WTO',
    region: 'Global',
    description: 'Rules governing international trade, promoting fair and open global commerce',
    keyPrinciples: [
      'Non-discrimination',
      'Transparency',
      'Predictable trading environment',
      'Fair competition',
      'Development support'
    ],
    applicationAreas: ['International Trade', 'Export/Import', 'Trade Disputes'],
    complianceRequirements: [
      'Tariff commitments',
      'Non-tariff barrier reduction',
      'Intellectual property protection',
      'Dispute settlement participation'
    ],
    benefits: [
      'Market access expansion',
      'Dispute resolution mechanisms',
      'Predictable trade environment',
      'Economic growth opportunities'
    ],
    caseStudies: [
      {
        company: 'Various SMEs',
        scenario: 'Accessing new markets through WTO membership',
        outcome: 'Expanded export opportunities, economic growth'
      }
    ]
  }
]

// Entrepreneurship Framework
export const getEntrepreneurshipFramework = (): EntrepreneurshipFramework[] => [
  {
    stage: 'Ideation & Validation',
    description: 'Generate and validate business ideas with market research',
    activities: [
      'Market research and analysis',
      'Customer interviews',
      'Problem-solution fit validation',
      'Competitive analysis',
      'Value proposition development'
    ],
    skills: ['Research', 'Critical thinking', 'Communication', 'Analytical skills'],
    resources: ['Market research tools', 'Survey platforms', 'Industry reports'],
    challenges: [
      'Identifying real market needs',
      'Differentiating from competitors',
      'Validating assumptions'
    ],
    successFactors: [
      'Deep customer understanding',
      'Clear value proposition',
      'Market timing'
    ],
    internationalConsiderations: [
      'Cultural market differences',
      'Regulatory variations',
      'Currency and payment systems',
      'Language barriers',
      'Local competition analysis'
    ]
  },
  {
    stage: 'Business Planning',
    description: 'Develop comprehensive business plan with financial projections',
    activities: [
      'Business model canvas',
      'Financial projections',
      'Marketing strategy',
      'Operations planning',
      'Risk assessment'
    ],
    skills: ['Financial planning', 'Strategic thinking', 'Writing', 'Analysis'],
    resources: ['Business plan templates', 'Financial modeling tools', 'Industry benchmarks'],
    challenges: [
      'Realistic financial projections',
      'Market size estimation',
      'Competitive positioning'
    ],
    successFactors: [
      'Clear business model',
      'Realistic assumptions',
      'Comprehensive planning'
    ],
    internationalConsiderations: [
      'Multi-currency planning',
      'International tax implications',
      'Cross-border logistics',
      'Regulatory compliance',
      'Cultural adaptation strategies'
    ]
  },
  {
    stage: 'Launch & Growth',
    description: 'Execute launch and scale business operations',
    activities: [
      'Product/service launch',
      'Customer acquisition',
      'Operations scaling',
      'Team building',
      'Performance monitoring'
    ],
    skills: ['Execution', 'Leadership', 'Marketing', 'Operations management'],
    resources: ['Launch platforms', 'Marketing tools', 'HR systems'],
    challenges: [
      'Managing growth',
      'Maintaining quality',
      'Cash flow management'
    ],
    successFactors: [
      'Strong execution',
      'Customer focus',
      'Operational efficiency'
    ],
    internationalConsiderations: [
      'International expansion strategies',
      'Cross-cultural team management',
      'Global supply chain',
      'International marketing',
      'Regulatory compliance across markets'
    ]
  }
]

// Economic Concepts
export const getEconomicConcept = (conceptName: string): EconomicConcept => {
  const concepts: Record<string, EconomicConcept> = {
    'Supply and Demand': {
      name: 'Supply and Demand',
      category: 'Microeconomics',
      description: 'Fundamental economic model explaining price determination in markets',
      keyTerms: ['Equilibrium', 'Surplus', 'Shortage', 'Price elasticity', 'Market clearing'],
      realWorldExamples: [
        'Oil prices during supply disruptions',
        'Housing markets in growing cities',
        'Technology product launches'
      ],
      internationalImplications: [
        'Global commodity markets',
        'Currency exchange rates',
        'International trade flows',
        'Cross-border price differences'
      ],
      teachingStrategies: [
        'Interactive simulations',
        'Real-world market analysis',
        'Case studies',
        'Graphical analysis'
      ],
      caseStudies: [
        'Coffee market price fluctuations',
        'Semiconductor supply chain',
        'Renewable energy adoption'
      ]
    },
    'Comparative Advantage': {
      name: 'Comparative Advantage',
      category: 'International Economics',
      description: 'Principle that countries benefit from specializing in goods they can produce most efficiently',
      keyTerms: ['Opportunity cost', 'Specialization', 'Trade benefits', 'Absolute advantage'],
      realWorldExamples: [
        'China manufacturing vs. US technology',
        'Brazil agriculture exports',
        'India IT services'
      ],
      internationalImplications: [
        'Global supply chains',
        'Trade agreements',
        'Economic development',
        'Job market shifts'
      ],
      teachingStrategies: [
        'Country comparison exercises',
        'Trade simulation games',
        'Historical trade analysis',
        'Current events discussion'
      ],
      caseStudies: [
        'NAFTA/USMCA trade patterns',
        'EU single market benefits',
        'ASEAN economic integration'
      ]
    },
    'Exchange Rates': {
      name: 'Exchange Rates',
      category: 'International Finance',
      description: 'The value of one currency relative to another, affecting international trade and investment',
      keyTerms: ['Currency pairs', 'Appreciation', 'Depreciation', 'Forex market', 'Purchasing power'],
      realWorldExamples: [
        'USD/EUR fluctuations',
        'Emerging market currencies',
        'Cryptocurrency markets'
      ],
      internationalImplications: [
        'Export competitiveness',
        'Import costs',
        'Foreign investment',
        'Tourism flows'
      ],
      teachingStrategies: [
        'Currency tracking projects',
        'Exchange rate calculations',
        'Impact analysis',
        'Forex simulation'
      ],
      caseStudies: [
        'Japanese yen and exports',
        'Brexit pound impact',
        'Emerging market devaluations'
      ]
    }
  }
  
  return concepts[conceptName] || concepts['Supply and Demand']
}

// Financial Literacy Modules
export const generateFinancialLiteracyModule = (
  topic: string,
  gradeLevel: string
): FinancialLiteracyModule => {
  const modules: Record<string, FinancialLiteracyModule> = {
    'Personal Budgeting': {
      topic: 'Personal Budgeting',
      gradeLevel: '9-12',
      learningObjectives: [
        'Create and manage a personal budget',
        'Understand income vs. expenses',
        'Plan for financial goals',
        'Make informed spending decisions'
      ],
      keyConcepts: [
        'Fixed vs. variable expenses',
        'Needs vs. wants',
        'Emergency funds',
        'Savings goals'
      ],
      activities: [
        'Create monthly budget',
        'Track expenses for one month',
        'Set savings goals',
        'Compare budgeting apps'
      ],
      realWorldApplications: [
        'College financial planning',
        'First job budgeting',
        'Living independently'
      ],
      internationalPerspectives: [
        'Cost of living differences',
        'Currency purchasing power',
        'Global savings rates',
        'Cultural spending patterns'
      ],
      assessment: [
        'Budget creation project',
        'Expense tracking journal',
        'Financial goal presentation'
      ]
    },
    'Investment Basics': {
      topic: 'Investment Basics',
      gradeLevel: '11-12',
      learningObjectives: [
        'Understand investment options',
        'Assess risk vs. return',
        'Diversification principles',
        'Long-term wealth building'
      ],
      keyConcepts: [
        'Stocks, bonds, mutual funds',
        'Risk tolerance',
        'Diversification',
        'Compound interest'
      ],
      activities: [
        'Virtual stock market game',
        'Portfolio construction',
        'Risk assessment quiz',
        'Investment research project'
      ],
      realWorldApplications: [
        'Retirement planning',
        'College savings',
        'Long-term goals'
      ],
      internationalPerspectives: [
        'Global stock markets',
        'International diversification',
        'Currency risk',
        'Emerging market opportunities'
      ],
      assessment: [
        'Investment portfolio project',
        'Risk analysis report',
        'Investment strategy presentation'
      ]
    }
  }
  
  return modules[topic] || modules['Personal Budgeting']
}

// Business Scenarios
export const generateBusinessScenario = (
  type: string,
  industry: string
): BusinessScenario => {
  const scenarios: Record<string, BusinessScenario> = {
    'Export Expansion': {
      title: 'Expanding to International Markets',
      type: 'case-study',
      difficulty: 'advanced',
      industry: 'Manufacturing',
      region: 'Global',
      scenario: 'A successful domestic manufacturer wants to expand exports to three new countries. They need to navigate trade regulations, cultural differences, and competitive markets.',
      objectives: [
        'Identify target markets',
        'Develop export strategy',
        'Navigate trade regulations',
        'Create marketing plan',
        'Manage logistics and distribution'
      ],
      questions: [
        'What factors should determine market selection?',
        'How do trade agreements affect export strategy?',
        'What cultural considerations are important?',
        'How do you manage currency risk?',
        'What logistics challenges exist?'
      ],
      resources: [
        'WTO trade data',
        'Country market reports',
        'Trade agreement databases',
        'Cultural guides'
      ],
      expectedOutcomes: [
        'Comprehensive export plan',
        'Market analysis',
        'Risk assessment',
        'Financial projections'
      ],
      internationalElements: [
        'Trade regulations',
        'Currency exchange',
        'Cultural adaptation',
        'International logistics',
        'Cross-border payments'
      ]
    },
    'Startup Pitch': {
      title: 'International Startup Pitch',
      type: 'simulation',
      difficulty: 'intermediate',
      industry: 'Technology',
      region: 'Global',
      scenario: 'Students develop a tech startup idea and pitch it to international investors, considering global market potential and scalability.',
      objectives: [
        'Develop business idea',
        'Create pitch deck',
        'Analyze global market',
        'Present to investors',
        'Answer investor questions'
      ],
      questions: [
        'What problem does your startup solve?',
        'What is your global market opportunity?',
        'How will you scale internationally?',
        'What is your competitive advantage?',
        'How will you generate revenue?'
      ],
      resources: [
        'Pitch deck templates',
        'Market research tools',
        'Investor presentation guides',
        'Startup case studies'
      ],
      expectedOutcomes: [
        'Complete pitch deck',
        'Market analysis',
        'Financial model',
        'Presentation skills'
      ],
      internationalElements: [
        'Global market sizing',
        'International expansion plan',
        'Cross-cultural considerations',
        'Regulatory compliance',
        'Multi-currency revenue'
      ]
    }
  }
  
  return scenarios[type] || scenarios['Export Expansion']
}

// Trade Agreements
export const getTradeAgreements = (): TradeAgreement[] => [
  {
    name: 'USMCA (United States-Mexico-Canada Agreement)',
    countries: ['United States', 'Mexico', 'Canada'],
    type: 'Regional Trade Agreement',
    keyProvisions: [
      'Elimination of most tariffs',
      'Rules of origin requirements',
      'Labor and environmental standards',
      'Digital trade provisions',
      'Dispute settlement mechanisms'
    ],
    benefits: [
      'Increased trade flows',
      'Job creation',
      'Economic growth',
      'Supply chain integration'
    ],
    challenges: [
      'Compliance costs',
      'Rules of origin complexity',
      'Labor standard enforcement',
      'Dispute resolution delays'
    ],
    impact: [
      'Automotive industry restructuring',
      'Agricultural trade expansion',
      'Digital services growth',
      'Manufacturing shifts'
    ],
    teachingPoints: [
      'Trade agreement structure',
      'Economic integration benefits',
      'Regional cooperation',
      'Policy negotiation'
    ]
  },
  {
    name: 'RCEP (Regional Comprehensive Economic Partnership)',
    countries: ['ASEAN members', 'China', 'Japan', 'South Korea', 'Australia', 'New Zealand'],
    type: 'Mega-Regional Trade Agreement',
    keyProvisions: [
      'Tariff reductions',
      'Services trade liberalization',
      'Investment protection',
      'E-commerce rules',
      'Intellectual property'
    ],
    benefits: [
      'Largest trading bloc',
      'Supply chain integration',
      'Economic growth',
      'Regional stability'
    ],
    challenges: [
      'Diverse development levels',
      'Implementation complexity',
      'Geopolitical tensions',
      'Competing interests'
    ],
    impact: [
      'Asian economic integration',
      'Global supply chain shifts',
      'Trade diversion effects',
      'Regional power dynamics'
    ],
    teachingPoints: [
      'Mega-regional agreements',
      'Asian economic integration',
      'Global trade architecture',
      'Development considerations'
    ]
  }
]

// Cross-Cultural Business Guides
export const getCrossCulturalGuide = (region: string): CrossCulturalBusinessGuide => {
  const guides: Record<string, CrossCulturalBusinessGuide> = {
    'Asia-Pacific': {
      region: 'Asia-Pacific',
      businessPractices: [
        'Relationship building is crucial',
        'Hierarchical decision-making',
        'Group consensus important',
        'Face-saving essential',
        'Long-term orientation'
      ],
      communicationStyles: [
        'Indirect communication',
        'Non-verbal cues important',
        'Respect for hierarchy',
        'Formal address',
        'Reading between lines'
      ],
      negotiationApproaches: [
        'Relationship before business',
        'Patience required',
        'Group decision-making',
        'Face-saving solutions',
        'Long-term perspective'
      ],
      culturalConsiderations: [
        'Gift-giving customs',
        'Business card etiquette',
        'Dining traditions',
        'Religious observances',
        'Family business structures'
      ],
      commonMistakes: [
        'Rushing negotiations',
        'Ignoring hierarchy',
        'Direct confrontation',
        'Disregarding relationships',
        'Short-term focus'
      ],
      successStrategies: [
        'Build relationships first',
        'Show respect for hierarchy',
        'Be patient and flexible',
        'Understand cultural context',
        'Invest in long-term partnerships'
      ],
      caseExamples: [
        'Western companies in Japan',
        'Tech partnerships in China',
        'Manufacturing in Southeast Asia'
      ]
    },
    'Middle East': {
      region: 'Middle East',
      businessPractices: [
        'Personal relationships essential',
        'Religious considerations',
        'Family business networks',
        'Hospitality traditions',
        'Face-to-face preferred'
      ],
      communicationStyles: [
        'Formal and respectful',
        'Indirect when needed',
        'Relationship-focused',
        'Non-verbal important',
        'Storytelling valued'
      ],
      negotiationApproaches: [
        'Relationship building first',
        'Flexible timelines',
        'Personal connections matter',
        'Hospitality during negotiations',
        'Consensus building'
      ],
      culturalConsiderations: [
        'Islamic business principles',
        'Ramadan observances',
        'Gender considerations',
        'Gift-giving customs',
        'Hospitality expectations'
      ],
      commonMistakes: [
        'Ignoring religious practices',
        'Rushing relationships',
        'Gender insensitivity',
        'Disregarding local customs',
        'Impatience'
      ],
      successStrategies: [
        'Respect religious practices',
        'Build personal relationships',
        'Understand local customs',
        'Show hospitality',
        'Be patient and flexible'
      ],
      caseExamples: [
        'Energy sector partnerships',
        'Construction projects',
        'Technology investments'
      ]
    },
    'Latin America': {
      region: 'Latin America',
      businessPractices: [
        'Personal relationships important',
        'Flexible time management',
        'Family business culture',
        'Networking essential',
        'Face-to-face preferred'
      ],
      communicationStyles: [
        'Warm and expressive',
        'Personal connections',
        'Non-verbal communication',
        'Relationship-focused',
        'Emotional expression'
      ],
      negotiationApproaches: [
        'Relationship building',
        'Flexible approaches',
        'Personal connections',
        'Consensus building',
        'Long-term perspective'
      ],
      culturalConsiderations: [
        'Family values',
        'Social connections',
        'Time flexibility',
        'Personal space',
        'Celebration culture'
      ],
      commonMistakes: [
        'Being too direct',
        'Ignoring relationships',
        'Rigid time management',
        'Disregarding family',
        'Lack of personal connection'
      ],
      successStrategies: [
        'Build personal relationships',
        'Be flexible with time',
        'Understand family dynamics',
        'Show warmth and interest',
        'Invest in networking'
      ],
      caseExamples: [
        'Retail expansion',
        'Manufacturing partnerships',
        'Service sector growth'
      ]
    }
  }
  
  return guides[region] || guides['Asia-Pacific']
}

// Get available regions
export const getBusinessRegions = () => [
  'Global',
  'Asia-Pacific',
  'Europe',
  'North America',
  'Latin America',
  'Middle East',
  'Africa',
  'Oceania'
]

// Get industries
export const getIndustries = () => [
  'Technology',
  'Manufacturing',
  'Services',
  'Agriculture',
  'Energy',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Tourism'
]




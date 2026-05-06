// Environmental Science Guide Utilities - International Standards Focus

export interface RegionalClimateImpact {
  region: string
  climateZone: string
  keyImpacts: string[]
  temperatureTrends: string
  precipitationChanges: string
  extremeEvents: string[]
  seaLevelRise?: string
  caseStudies: {
    title: string
    description: string
    impacts: string[]
  }[]
  adaptationStrategies: string[]
  vulnerabilityLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface SustainabilityProject {
  id: string
  title: string
  category: 'energy' | 'waste' | 'water' | 'biodiversity' | 'community'
  gradeLevel: string
  duration: string
  objectives: string[]
  materials: string[]
  steps: string[]
  expectedOutcomes: string[]
  standardsAlignment: string[]
  assessmentCriteria: string[]
  extensions: string[]
}

export interface EcosystemInfo {
  type: string
  category: 'terrestrial' | 'aquatic' | 'urban'
  description: string
  keyFeatures: string[]
  abioticFactors: string[]
  bioticFactors: string[]
  energyFlow: string[]
  nutrientCycles: string[]
  threats: string[]
  conservation: string[]
  examples: string[]
}

export interface ClimateData {
  region: string
  indicator: string
  currentValue: string
  trend: 'increasing' | 'decreasing' | 'stable' | 'variable'
  historicalData: string[]
  projections: string[]
  significance: string
}

export interface EnvironmentalStandard {
  id: string
  name: string
  organization: string
  description: string
  keyPrinciples: string[]
  applicationAreas: string[]
  complianceRequirements: string[]
  benefits: string[]
  educationalRelevance: string[]
}

export interface SustainabilityAssessment {
  category: string
  currentValue: number
  targetValue: number
  unit: string
  impact: 'low' | 'medium' | 'high'
  recommendations: string[]
  actionItems: string[]
}

export interface ActionPlan {
  goal: string
  timeframe: string
  objectives: string[]
  actions: {
    action: string
    responsible: string
    deadline: string
    resources: string[]
  }[]
  successMetrics: string[]
  challenges: string[]
  solutions: string[]
}

// Regional Climate Impacts
export const getRegionalClimateImpacts = (region: string): RegionalClimateImpact => {
  const impacts: Record<string, RegionalClimateImpact> = {
    'Arctic': {
      region: 'Arctic',
      climateZone: 'Polar',
      keyImpacts: [
        'Rapid ice melting',
        'Permafrost thawing',
        'Sea level rise contribution',
        'Loss of habitat for polar species',
        'Increased shipping routes'
      ],
      temperatureTrends: 'Warming 2-3 times faster than global average',
      precipitationChanges: 'Increased precipitation, more as rain than snow',
      extremeEvents: ['Heatwaves', 'Wildfires', 'Coastal erosion'],
      seaLevelRise: 'Contributing significantly to global sea level rise',
      caseStudies: [
        {
          title: 'Greenland Ice Sheet Melting',
          description: 'Rapid acceleration of ice loss affecting global sea levels',
          impacts: ['Sea level rise', 'Ocean circulation changes', 'Global climate feedback']
        },
        {
          title: 'Permafrost Thaw in Siberia',
          description: 'Thawing permafrost releasing methane and carbon dioxide',
          impacts: ['Greenhouse gas emissions', 'Infrastructure damage', 'Ecosystem changes']
        }
      ],
      adaptationStrategies: [
        'Relocate vulnerable communities',
        'Strengthen infrastructure',
        'Protect biodiversity',
        'Monitor permafrost stability'
      ],
      vulnerabilityLevel: 'critical'
    },
    'Tropical': {
      region: 'Tropical Regions',
      climateZone: 'Tropical',
      keyImpacts: [
        'Extreme weather events',
        'Coral bleaching',
        'Biodiversity loss',
        'Agricultural disruption',
        'Water scarcity'
      ],
      temperatureTrends: 'Consistent warming with increased heat stress',
      precipitationChanges: 'More intense rainfall, longer dry seasons',
      extremeEvents: ['Hurricanes', 'Cyclones', 'Droughts', 'Floods'],
      caseStudies: [
        {
          title: 'Great Barrier Reef Coral Bleaching',
          description: 'Mass coral bleaching events due to ocean warming',
          impacts: ['Marine biodiversity loss', 'Tourism impact', 'Coastal protection loss']
        },
        {
          title: 'Amazon Rainforest Deforestation',
          description: 'Deforestation combined with climate change threatens ecosystem',
          impacts: ['Carbon sink loss', 'Biodiversity decline', 'Regional climate change']
        }
      ],
      adaptationStrategies: [
        'Coral reef restoration',
        'Reforestation programs',
        'Drought-resistant agriculture',
        'Early warning systems'
      ],
      vulnerabilityLevel: 'high'
    },
    'Temperate': {
      region: 'Temperate Zones',
      climateZone: 'Temperate',
      keyImpacts: [
        'Changing seasons',
        'Agricultural shifts',
        'Water scarcity',
        'Extreme weather',
        'Ecosystem disruption'
      ],
      temperatureTrends: 'Moderate warming with seasonal variations',
      precipitationChanges: 'Altered precipitation patterns, more intense storms',
      extremeEvents: ['Heatwaves', 'Floods', 'Wildfires', 'Storms'],
      caseStudies: [
        {
          title: 'European Heatwaves',
          description: 'Increasing frequency and intensity of heatwaves',
          impacts: ['Health risks', 'Agricultural losses', 'Water stress', 'Energy demand']
        },
        {
          title: 'California Wildfires',
          description: 'Longer fire seasons with more intense fires',
          impacts: ['Air quality', 'Ecosystem loss', 'Property damage', 'Displacement']
        }
      ],
      adaptationStrategies: [
        'Water conservation',
        'Fire-resistant landscaping',
        'Heat action plans',
        'Agricultural adaptation'
      ],
      vulnerabilityLevel: 'medium'
    },
    'Arid': {
      region: 'Arid Regions',
      climateZone: 'Arid',
      keyImpacts: [
        'Desertification',
        'Water stress',
        'Heat extremes',
        'Food security',
        'Dust storms'
      ],
      temperatureTrends: 'Rapid warming with extreme heat',
      precipitationChanges: 'Decreasing and more variable rainfall',
      extremeEvents: ['Droughts', 'Dust storms', 'Heatwaves'],
      caseStudies: [
        {
          title: 'Sahel Desertification',
          description: 'Expanding desert affecting agriculture and livelihoods',
          impacts: ['Food insecurity', 'Migration', 'Conflict', 'Ecosystem loss']
        },
        {
          title: 'Middle East Water Scarcity',
          description: 'Increasing water stress in already arid regions',
          impacts: ['Water conflicts', 'Agricultural decline', 'Urban water stress']
        }
      ],
      adaptationStrategies: [
        'Water harvesting',
        'Drought-resistant crops',
        'Desert greening',
        'Water-efficient technologies'
      ],
      vulnerabilityLevel: 'critical'
    },
    'Coastal': {
      region: 'Coastal Areas',
      climateZone: 'Various',
      keyImpacts: [
        'Sea level rise',
        'Storm surges',
        'Coastal erosion',
        'Saltwater intrusion',
        'Marine ecosystem changes'
      ],
      temperatureTrends: 'Moderate warming with ocean temperature rise',
      precipitationChanges: 'Variable, influenced by ocean patterns',
      extremeEvents: ['Storm surges', 'Coastal flooding', 'Erosion'],
      seaLevelRise: 'Global average 3-4mm/year, accelerating',
      caseStudies: [
        {
          title: 'Small Island States',
          description: 'Existential threat from sea level rise',
          impacts: ['Land loss', 'Freshwater contamination', 'Displacement', 'Economic impact']
        },
        {
          title: 'Bangladesh Delta',
          description: 'Vulnerable to sea level rise and storm surges',
          impacts: ['Flooding', 'Salinization', 'Displacement', 'Agricultural loss']
        }
      ],
      adaptationStrategies: [
        'Coastal protection',
        'Managed retreat',
        'Mangrove restoration',
        'Early warning systems'
      ],
      vulnerabilityLevel: 'high'
    }
  }
  
  return impacts[region] || impacts['Temperate']
}

// Sustainability Projects
export const getSustainabilityProjects = (category: string, gradeLevel: string): SustainabilityProject[] => {
  const projects: Record<string, SustainabilityProject[]> = {
    'energy': [
      {
        id: 'solar-energy',
        title: 'Solar Energy Investigation',
        category: 'energy',
        gradeLevel,
        duration: '4-6 weeks',
        objectives: [
          'Understand solar energy principles',
          'Design and test solar-powered devices',
          'Calculate energy savings',
          'Evaluate environmental impact'
        ],
        materials: [
          'Solar panels (small)',
          'Multimeter',
          'LED lights',
          'Rechargeable batteries',
          'Measuring tools'
        ],
        steps: [
          'Research solar energy basics',
          'Design solar-powered device',
          'Build prototype',
          'Test and measure output',
          'Calculate energy savings',
          'Present findings'
        ],
        expectedOutcomes: [
          'Working solar device',
          'Energy calculations',
          'Environmental impact assessment',
          'Presentation of results'
        ],
        standardsAlignment: ['ISO 14001', 'UN SDG 7', 'NGSS'],
        assessmentCriteria: [
          'Understanding of concepts',
          'Design quality',
          'Data collection accuracy',
          'Environmental analysis'
        ],
        extensions: [
          'Compare with other renewable sources',
          'Community solar project',
          'Energy audit of school'
        ]
      }
    ],
    'waste': [
      {
        id: 'waste-audit',
        title: 'School Waste Audit',
        category: 'waste',
        gradeLevel,
        duration: '2-3 weeks',
        objectives: [
          'Analyze waste generation',
          'Identify waste reduction opportunities',
          'Design waste reduction plan',
          'Implement and monitor changes'
        ],
        materials: [
          'Scales',
          'Gloves',
          'Sorting bins',
          'Data sheets',
          'Compost bins'
        ],
        steps: [
          'Conduct baseline waste audit',
          'Categorize waste types',
          'Calculate waste generation rates',
          'Identify reduction opportunities',
          'Design action plan',
          'Implement changes',
          'Monitor and evaluate'
        ],
        expectedOutcomes: [
          'Waste audit report',
          'Reduction action plan',
          'Measured waste reduction',
          'School-wide awareness'
        ],
        standardsAlignment: ['ISO 14001', 'UN SDG 12', 'Zero Waste'],
        assessmentCriteria: [
          'Audit accuracy',
          'Analysis quality',
          'Action plan feasibility',
          'Implementation success'
        ],
        extensions: [
          'Composting program',
          'Recycling expansion',
          'Community waste reduction'
        ]
      }
    ],
    'water': [
      {
        id: 'water-conservation',
        title: 'Water Conservation Campaign',
        category: 'water',
        gradeLevel,
        duration: '3-4 weeks',
        objectives: [
          'Measure water usage',
          'Identify conservation opportunities',
          'Design conservation strategies',
          'Implement and track savings'
        ],
        materials: [
          'Water meters',
          'Measuring containers',
          'Data collection sheets',
          'Educational materials'
        ],
        steps: [
          'Measure baseline water usage',
          'Identify high-use areas',
          'Research conservation methods',
          'Design conservation plan',
          'Implement strategies',
          'Monitor water savings',
          'Share results'
        ],
        expectedOutcomes: [
          'Water usage baseline',
          'Conservation plan',
          'Measured water savings',
          'School-wide campaign'
        ],
        standardsAlignment: ['ISO 14001', 'UN SDG 6', 'Water Stewardship'],
        assessmentCriteria: [
          'Measurement accuracy',
          'Plan effectiveness',
          'Savings achieved',
          'Campaign impact'
        ],
        extensions: [
          'Rainwater harvesting',
          'Greywater systems',
          'Community water project'
        ]
      }
    ],
    'biodiversity': [
      {
        id: 'pollinator-garden',
        title: 'Pollinator Garden Project',
        category: 'biodiversity',
        gradeLevel,
        duration: 'Ongoing',
        objectives: [
          'Understand pollinator importance',
          'Design native plant garden',
          'Create pollinator habitat',
          'Monitor biodiversity'
        ],
        materials: [
          'Native plants',
          'Garden tools',
          'Soil and compost',
          'Identification guides',
          'Observation journals'
        ],
        steps: [
          'Research native pollinators',
          'Design garden layout',
          'Prepare site',
          'Plant native species',
          'Maintain garden',
          'Monitor pollinators',
          'Document biodiversity'
        ],
        expectedOutcomes: [
          'Functioning pollinator garden',
          'Biodiversity documentation',
          'Habitat creation',
          'Educational resource'
        ],
        standardsAlignment: ['ISO 14001', 'UN SDG 15', 'Biodiversity'],
        assessmentCriteria: [
          'Garden design quality',
          'Plant selection appropriateness',
          'Biodiversity observed',
          'Maintenance success'
        ],
        extensions: [
          'Butterfly monitoring',
          'Bee hotel construction',
          'Community garden expansion'
        ]
      }
    ],
    'community': [
      {
        id: 'green-transport',
        title: 'Green Transportation Initiative',
        category: 'community',
        gradeLevel,
        duration: '6-8 weeks',
        objectives: [
          'Analyze transportation emissions',
          'Promote sustainable transport',
          'Reduce carbon footprint',
          'Engage community'
        ],
        materials: [
          'Survey forms',
          'Carbon calculators',
          'Promotional materials',
          'Tracking tools'
        ],
        steps: [
          'Survey transportation habits',
          'Calculate carbon footprint',
          'Research alternatives',
          'Design promotion campaign',
          'Implement initiatives',
          'Track participation',
          'Measure impact'
        ],
        expectedOutcomes: [
          'Transportation survey results',
          'Carbon footprint reduction',
          'Increased sustainable transport',
          'Community engagement'
        ],
        standardsAlignment: ['ISO 14064', 'UN SDG 11', 'Climate Action'],
        assessmentCriteria: [
          'Survey quality',
          'Campaign effectiveness',
          'Participation rates',
          'Impact measurement'
        ],
        extensions: [
          'Bike-to-school program',
          'Public transit advocacy',
          'Electric vehicle promotion'
        ]
      }
    ]
  }
  
  return projects[category] || projects['energy']
}

// Ecosystem Information
export const getEcosystemInfo = (ecosystemType: string): EcosystemInfo => {
  const ecosystems: Record<string, EcosystemInfo> = {
    'Tropical Rainforest': {
      type: 'Tropical Rainforest',
      category: 'terrestrial',
      description: 'Dense, biodiverse forests near the equator with high rainfall',
      keyFeatures: ['High biodiversity', 'Dense canopy', 'High rainfall', 'Warm temperatures'],
      abioticFactors: ['Temperature: 20-25°C', 'Rainfall: 2000-10000mm/year', 'Humidity: High', 'Soil: Nutrient-poor'],
      bioticFactors: ['Trees: Canopy, understory, forest floor', 'Animals: Monkeys, birds, insects', 'Plants: Epiphytes, lianas'],
      energyFlow: ['Sun → Producers (trees, plants)', 'Primary consumers (herbivores)', 'Secondary consumers (carnivores)', 'Decomposers (fungi, bacteria)'],
      nutrientCycles: ['Rapid nutrient cycling', 'Most nutrients in biomass', 'Decomposition on forest floor'],
      threats: ['Deforestation', 'Climate change', 'Mining', 'Agriculture'],
      conservation: ['Protected areas', 'Sustainable logging', 'Reforestation', 'Indigenous rights'],
      examples: ['Amazon', 'Congo Basin', 'Southeast Asian rainforests']
    },
    'Coral Reef': {
      type: 'Coral Reef',
      category: 'aquatic',
      description: 'Diverse marine ecosystems built by coral polyps',
      keyFeatures: ['High biodiversity', 'Symbiotic relationships', 'Clear warm water', 'Shallow depths'],
      abioticFactors: ['Temperature: 20-29°C', 'Light: High', 'Salinity: Stable', 'Water clarity: High'],
      bioticFactors: ['Corals: Builders of reef', 'Fish: Diverse species', 'Algae: Symbiotic zooxanthellae'],
      energyFlow: ['Sun → Algae (zooxanthellae)', 'Corals → Fish', 'Predators → Top predators', 'Decomposers'],
      nutrientCycles: ['Nutrient-poor water', 'Efficient recycling', 'Symbiotic nutrient exchange'],
      threats: ['Ocean warming', 'Ocean acidification', 'Pollution', 'Overfishing'],
      conservation: ['Marine protected areas', 'Reduced emissions', 'Water quality protection', 'Sustainable fishing'],
      examples: ['Great Barrier Reef', 'Caribbean reefs', 'Red Sea reefs']
    },
    'Grassland': {
      type: 'Grassland',
      category: 'terrestrial',
      description: 'Open ecosystems dominated by grasses with seasonal rainfall',
      keyFeatures: ['Grass-dominated', 'Seasonal fires', 'Grazing animals', 'Rich soils'],
      abioticFactors: ['Rainfall: 250-900mm/year', 'Temperature: Variable', 'Fire: Natural', 'Soil: Fertile'],
      bioticFactors: ['Grasses: Dominant plants', 'Herbivores: Grazers', 'Predators: Carnivores', 'Birds: Ground-nesting'],
      energyFlow: ['Sun → Grasses', 'Grazers (bison, antelope)', 'Predators (lions, wolves)', 'Decomposers'],
      nutrientCycles: ['Fire releases nutrients', 'Grazing returns nutrients', 'Deep root systems'],
      threats: ['Conversion to agriculture', 'Overgrazing', 'Invasive species', 'Climate change'],
      conservation: ['Protected grasslands', 'Sustainable grazing', 'Fire management', 'Restoration'],
      examples: ['African savannas', 'North American prairies', 'Eurasian steppes']
    }
  }
  
  return ecosystems[ecosystemType] || ecosystems['Tropical Rainforest']
}

// Climate Data
export const getClimateData = (region: string, indicator: string): ClimateData => {
  return {
    region,
    indicator,
    currentValue: 'Simulated current value',
    trend: 'increasing',
    historicalData: ['Historical trend data'],
    projections: ['Future projections'],
    significance: 'Significance of this indicator'
  }
}

// Environmental Standards
export const getEnvironmentalStandards = (): EnvironmentalStandard[] => [
  {
    id: 'iso-14001',
    name: 'ISO 14001: Environmental Management Systems',
    organization: 'ISO',
    description: 'Framework for managing environmental responsibilities systematically',
    keyPrinciples: [
      'Plan-Do-Check-Act cycle',
      'Continuous improvement',
      'Legal compliance',
      'Stakeholder engagement'
    ],
    applicationAreas: ['Organizations', 'Educational institutions', 'Businesses', 'Government'],
    complianceRequirements: [
      'Environmental policy',
      'Planning and objectives',
      'Implementation and operation',
      'Monitoring and measurement',
      'Management review'
    ],
    benefits: [
      'Improved environmental performance',
      'Legal compliance',
      'Cost savings',
      'Enhanced reputation'
    ],
    educationalRelevance: [
      'School environmental programs',
      'Sustainability initiatives',
      'Environmental education',
      'Student projects'
    ]
  },
  {
    id: 'iso-14064',
    name: 'ISO 14064: Greenhouse Gas Accounting',
    organization: 'ISO',
    description: 'Principles and requirements for quantifying and reporting greenhouse gas emissions',
    keyPrinciples: [
      'Relevance',
      'Completeness',
      'Consistency',
      'Accuracy',
      'Transparency'
    ],
    applicationAreas: ['Carbon footprint', 'Emissions reporting', 'Climate action', 'Sustainability'],
    complianceRequirements: [
      'GHG inventory',
      'Emission calculations',
      'Uncertainty assessment',
      'Reporting and verification'
    ],
    benefits: [
      'Accurate emissions tracking',
      'Credible reporting',
      'Climate action planning',
      'Stakeholder trust'
    ],
    educationalRelevance: [
      'Carbon footprint projects',
      'Climate action planning',
      'Sustainability assessments',
      'Student carbon audits'
    ]
  },
  {
    id: 'un-sdgs',
    name: 'UN Sustainable Development Goals',
    organization: 'UN',
    description: '17 global goals for sustainable development by 2030',
    keyPrinciples: [
      'No poverty',
      'Zero hunger',
      'Good health',
      'Quality education',
      'Climate action',
      'Life on land',
      'Life below water'
    ],
    applicationAreas: ['Global', 'National', 'Local', 'Educational'],
    complianceRequirements: [
      'Goal alignment',
      'Target setting',
      'Progress tracking',
      'Stakeholder engagement'
    ],
    benefits: [
      'Global framework',
      'Comprehensive approach',
      'Measurable targets',
      'International cooperation'
    ],
    educationalRelevance: [
      'Curriculum integration',
      'Student projects',
      'School initiatives',
      'Global citizenship'
    ]
  }
]

// Sustainability Assessment Generator
export const generateSustainabilityAssessment = (category: string): SustainabilityAssessment => {
  return {
    category,
    currentValue: 0,
    targetValue: 0,
    unit: 'varies',
    impact: 'medium',
    recommendations: [
      'Set specific targets',
      'Implement action plan',
      'Monitor progress',
      'Engage stakeholders'
    ],
    actionItems: [
      'Baseline measurement',
      'Target setting',
      'Action planning',
      'Implementation',
      'Monitoring'
    ]
  }
}

// Action Plan Generator
export const generateActionPlan = (goal: string, timeframe: string): ActionPlan => {
  return {
    goal,
    timeframe,
    objectives: [
      'Define clear objectives',
      'Set measurable targets',
      'Identify actions',
      'Assign responsibilities'
    ],
    actions: [
      {
        action: 'Initial assessment',
        responsible: 'Team',
        deadline: 'Week 1',
        resources: ['Assessment tools', 'Data collection']
      },
      {
        action: 'Action planning',
        responsible: 'Coordinator',
        deadline: 'Week 2',
        resources: ['Planning tools', 'Stakeholder input']
      }
    ],
    successMetrics: [
      'Measurable outcomes',
      'Timeline adherence',
      'Stakeholder engagement',
      'Impact achieved'
    ],
    challenges: [
      'Resource constraints',
      'Stakeholder engagement',
      'Behavior change',
      'Measurement difficulties'
    ],
    solutions: [
      'Creative resource use',
      'Clear communication',
      'Incentives and recognition',
      'Simple measurement tools'
    ]
  }
}

// Get regions
export const getRegions = () => [
  'Arctic',
  'Tropical',
  'Temperate',
  'Arid',
  'Coastal',
  'Global'
]

// Get project categories
export const getProjectCategories = () => [
  'Energy',
  'Waste',
  'Water',
  'Biodiversity',
  'Community'
]

// Get ecosystem types
export const getEcosystemTypes = () => [
  'Tropical Rainforest',
  'Coral Reef',
  'Grassland',
  'Desert',
  'Tundra',
  'Wetland',
  'Ocean',
  'Forest'
]

// Get grade levels
export const getGradeLevels = () => [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College'
]




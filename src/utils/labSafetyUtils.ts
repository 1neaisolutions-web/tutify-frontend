// Lab Safety & Protocol Advisor Utilities - International Standards Focus

export interface SafetyStandard {
  id: string
  name: string
  organization: string
  region: string
  description: string
  keyRequirements: string[]
  applicableLabs: string[]
  complianceChecklist: string[]
  resources: string[]
}

export interface SafetyProtocol {
  id: string
  title: string
  labType: 'biology' | 'chemistry' | 'physics' | 'general'
  gradeLevel: string
  category: 'chemical' | 'equipment' | 'ppe' | 'emergency' | 'general'
  steps: {
    step: number
    action: string
    safetyNote?: string
  }[]
  requiredPPE: string[]
  hazards: string[]
  emergencyProcedures: string[]
  complianceStandards: string[]
}

export interface RiskAssessment {
  experiment: string
  labType: string
  gradeLevel: string
  hazards: {
    type: 'chemical' | 'biological' | 'physical' | 'radiological'
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain'
    controls: string[]
  }[]
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  approvalRequired: boolean
}

export interface ChemicalInfo {
  name: string
  casNumber?: string
  formula?: string
  ghsHazardClasses: string[]
  ghsPictograms: string[]
  storageRequirements: string[]
  incompatibilities: string[]
  ppeRequired: string[]
  disposalMethod: string
  emergencyProcedures: string[]
}

export interface EquipmentSafety {
  equipment: string
  labType: string
  safetyFeatures: string[]
  operatingProcedures: string[]
  maintenanceSchedule: string[]
  hazards: string[]
  ppeRequired: string[]
  emergencyProcedures: string[]
  ageAppropriate: string[]
}

export interface EmergencyProcedure {
  type: 'spill' | 'fire' | 'medical' | 'evacuation' | 'equipment-failure'
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  steps: string[]
  ppeRequired: string[]
  contacts: string[]
  followUp: string[]
}

export interface ExperimentDesign {
  title: string
  objective: string
  labType: string
  gradeLevel: string
  materials: {
    item: string
    quantity: string
    safetyNotes?: string
  }[]
  procedure: string[]
  safetyConsiderations: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  alternatives: string[]
  assessment: string[]
}

// International Safety Standards
export const getSafetyStandards = (): SafetyStandard[] => [
  {
    id: 'iso-17025',
    name: 'ISO/IEC 17025',
    organization: 'ISO/IEC',
    region: 'Global',
    description: 'General requirements for the competence of testing and calibration laboratories',
    keyRequirements: [
      'Technical competence',
      'Quality management system',
      'Equipment calibration',
      'Personnel qualifications',
      'Documentation control'
    ],
    applicableLabs: ['All laboratory types', 'Testing labs', 'Calibration labs'],
    complianceChecklist: [
      'Documented quality management system',
      'Qualified personnel',
      'Calibrated equipment',
      'Validated methods',
      'Traceability of measurements'
    ],
    resources: ['ISO/IEC 17025 standard', 'Accreditation bodies', 'Training programs']
  },
  {
    id: 'osha-lab-standard',
    name: 'OSHA Laboratory Standard (29 CFR 1910.1450)',
    organization: 'OSHA',
    region: 'United States',
    description: 'Ensures laboratory personnel are informed about hazardous chemicals and protected from exposures',
    keyRequirements: [
      'Chemical Hygiene Plan',
      'Hazard communication',
      'Exposure limits',
      'Medical consultation',
      'Training requirements'
    ],
    applicableLabs: ['All laboratories using chemicals'],
    complianceChecklist: [
      'Written Chemical Hygiene Plan',
      'Designated Chemical Hygiene Officer',
      'Employee training',
      'Hazard identification',
      'Exposure monitoring'
    ],
    resources: ['OSHA regulations', 'Chemical Hygiene Plan template', 'Training materials']
  },
  {
    id: 'ghs',
    name: 'GHS (Globally Harmonized System)',
    organization: 'UN',
    region: 'Global',
    description: 'Standardized system for classification and labeling of chemicals',
    keyRequirements: [
      'Hazard classification',
      'Safety data sheets (SDS)',
      'Labeling requirements',
      'Pictograms',
      'Signal words'
    ],
    applicableLabs: ['All laboratories handling chemicals'],
    complianceChecklist: [
      'GHS-compliant labels',
      'Updated SDS available',
      'Proper pictogram usage',
      'Signal words on labels',
      'Hazard statements'
    ],
    resources: ['GHS Purple Book', 'SDS database', 'Labeling guides']
  },
  {
    id: 'iaea-safety',
    name: 'IAEA Safety Standards',
    organization: 'IAEA',
    region: 'Global',
    description: 'Radiation protection and safety of radiation sources',
    keyRequirements: [
      'Radiation protection program',
      'Dose limits',
      'Monitoring requirements',
      'Emergency procedures',
      'Training and qualification'
    ],
    applicableLabs: ['Labs using radioactive materials', 'X-ray equipment'],
    complianceChecklist: [
      'Radiation safety program',
      'Dosimetry monitoring',
      'Shielding requirements',
      'Emergency procedures',
      'Authorized users only'
    ],
    resources: ['IAEA Safety Standards', 'Radiation safety guides', 'Training programs']
  },
  {
    id: 'nfpa-45',
    name: 'NFPA 45',
    organization: 'NFPA',
    region: 'United States',
    description: 'Standard on fire protection for laboratories using chemicals',
    keyRequirements: [
      'Fire protection systems',
      'Hazard classification',
      'Ventilation requirements',
      'Storage requirements',
      'Emergency planning'
    ],
    applicableLabs: ['Chemical laboratories'],
    complianceChecklist: [
      'Fire suppression systems',
      'Proper ventilation',
      'Chemical storage compliance',
      'Emergency evacuation plans',
      'Fire safety training'
    ],
    resources: ['NFPA 45 standard', 'Fire safety guides', 'Inspection checklists']
  }
]

// Safety Protocol Generator
export const generateSafetyProtocol = (
  labType: string,
  category: string,
  gradeLevel: string
): SafetyProtocol => {
  const protocols: Record<string, SafetyProtocol> = {
    'chemical-handling': {
      id: 'chem-handling',
      title: 'Chemical Handling Protocol',
      labType: 'chemistry',
      gradeLevel,
      category: 'chemical',
      steps: [
        { step: 1, action: 'Review Safety Data Sheet (SDS) before handling', safetyNote: 'Always check SDS for hazards' },
        { step: 2, action: 'Wear appropriate PPE (gloves, goggles, lab coat)', safetyNote: 'PPE must be compatible with chemical' },
        { step: 3, action: 'Work in well-ventilated area or fume hood', safetyNote: 'Check ventilation before starting' },
        { step: 4, action: 'Use smallest quantity necessary', safetyNote: 'Minimize exposure' },
        { step: 5, action: 'Never return unused chemicals to original container', safetyNote: 'Prevent contamination' },
        { step: 6, action: 'Clean up spills immediately using proper procedures', safetyNote: 'Follow spill response protocol' }
      ],
      requiredPPE: ['Safety goggles', 'Lab coat', 'Chemical-resistant gloves', 'Closed-toe shoes'],
      hazards: ['Chemical exposure', 'Skin contact', 'Inhalation', 'Fire'],
      emergencyProcedures: [
        'Eye contact: Flush with water for 15 minutes',
        'Skin contact: Remove contaminated clothing, wash with water',
        'Inhalation: Move to fresh air',
        'Ingestion: Do not induce vomiting, seek medical attention'
      ],
      complianceStandards: ['OSHA Lab Standard', 'GHS', 'NFPA 45']
    },
    'equipment-operation': {
      id: 'equip-operation',
      title: 'Equipment Operation Safety Protocol',
      labType: 'general',
      gradeLevel,
      category: 'equipment',
      steps: [
        { step: 1, action: 'Inspect equipment before use', safetyNote: 'Check for damage or defects' },
        { step: 2, action: 'Read and understand operating manual', safetyNote: 'Know all safety features' },
        { step: 3, action: 'Ensure proper setup and calibration', safetyNote: 'Follow manufacturer instructions' },
        { step: 4, action: 'Wear appropriate PPE', safetyNote: 'Protect eyes, hands, and body' },
        { step: 5, action: 'Never leave equipment unattended while operating', safetyNote: 'Stay alert and focused' },
        { step: 6, action: 'Follow shutdown procedures', safetyNote: 'Proper cleanup and storage' }
      ],
      requiredPPE: ['Safety goggles', 'Lab coat', 'Appropriate gloves'],
      hazards: ['Equipment malfunction', 'Electrical shock', 'Moving parts', 'High temperatures'],
      emergencyProcedures: [
        'Turn off equipment immediately if unsafe',
        'Unplug electrical equipment if needed',
        'Notify instructor/supervisor',
        'Do not attempt repairs unless qualified'
      ],
      complianceStandards: ['IEC 61508', 'Equipment manufacturer standards']
    }
  }
  
  return protocols[category] || protocols['chemical-handling']
}

// Risk Assessment Generator
export const generateRiskAssessment = (
  experiment: string,
  labType: string,
  gradeLevel: string
): RiskAssessment => {
  const hazards = [
    {
      type: 'chemical' as const,
      description: 'Use of [chemical name] - corrosive/toxic',
      severity: 'high' as const,
      likelihood: 'possible' as const,
      controls: [
        'Use fume hood',
        'Wear appropriate PPE',
        'Use smallest quantity',
        'Have spill kit ready'
      ]
    },
    {
      type: 'physical' as const,
      description: 'Hot surfaces or open flames',
      severity: 'medium' as const,
      likelihood: 'likely' as const,
      controls: [
        'Use heat-resistant gloves',
        'Keep flammable materials away',
        'Have fire extinguisher nearby',
        'Supervise students closely'
      ]
    }
  ]
  
  return {
    experiment,
    labType,
    gradeLevel,
    hazards,
    overallRisk: 'high' as const,
    recommendations: [
      'Conduct pre-lab safety briefing',
      'Ensure all students have proper PPE',
      'Have emergency procedures posted',
      'Supervise experiment closely',
      'Review safety protocols before starting'
    ],
    approvalRequired: true
  }
}

// Chemical Information Database
export const getChemicalInfo = (chemicalName: string): ChemicalInfo => {
  const chemicals: Record<string, ChemicalInfo> = {
    'Hydrochloric Acid': {
      name: 'Hydrochloric Acid (HCl)',
      casNumber: '7647-01-0',
      formula: 'HCl',
      ghsHazardClasses: ['Skin Corrosion', 'Eye Damage', 'Acute Toxicity'],
      ghsPictograms: ['Corrosive', 'Health Hazard'],
      storageRequirements: [
        'Store in acid cabinet',
        'Keep away from bases',
        'Store in well-ventilated area',
        'Keep container tightly closed'
      ],
      incompatibilities: ['Bases', 'Metals', 'Oxidizing agents'],
      ppeRequired: ['Chemical-resistant gloves', 'Safety goggles', 'Lab coat', 'Face shield'],
      disposalMethod: 'Neutralize with base, then dispose according to local regulations',
      emergencyProcedures: [
        'Eye contact: Flush with water for 15 minutes, seek medical attention',
        'Skin contact: Remove clothing, flush with water for 15 minutes',
        'Inhalation: Move to fresh air, seek medical attention if symptoms persist'
      ]
    },
    'Sodium Hydroxide': {
      name: 'Sodium Hydroxide (NaOH)',
      casNumber: '1310-73-2',
      formula: 'NaOH',
      ghsHazardClasses: ['Skin Corrosion', 'Eye Damage'],
      ghsPictograms: ['Corrosive'],
      storageRequirements: [
        'Store in base cabinet',
        'Keep away from acids',
        'Store in airtight container',
        'Keep away from moisture'
      ],
      incompatibilities: ['Acids', 'Metals', 'Organic compounds'],
      ppeRequired: ['Chemical-resistant gloves', 'Safety goggles', 'Lab coat'],
      disposalMethod: 'Neutralize with acid, then dispose according to local regulations',
      emergencyProcedures: [
        'Eye contact: Flush with water for 15 minutes, seek medical attention',
        'Skin contact: Remove clothing, flush with water for 15 minutes'
      ]
    }
  }
  
  return chemicals[chemicalName] || {
    name: chemicalName,
    ghsHazardClasses: ['Unknown - check SDS'],
    ghsPictograms: [],
    storageRequirements: ['Check Safety Data Sheet'],
    incompatibilities: ['Check Safety Data Sheet'],
    ppeRequired: ['Safety goggles', 'Lab coat', 'Gloves'],
    disposalMethod: 'Check Safety Data Sheet and local regulations',
    emergencyProcedures: ['Refer to Safety Data Sheet', 'Seek medical attention if needed']
  }
}

// Equipment Safety Guide
export const getEquipmentSafety = (equipment: string, labType: string): EquipmentSafety => {
  const equipmentGuide: Record<string, EquipmentSafety> = {
    'Bunsen Burner': {
      equipment: 'Bunsen Burner',
      labType: 'general',
      safetyFeatures: [
        'Gas shut-off valve',
        'Air control valve',
        'Stable base'
      ],
      operatingProcedures: [
        'Check gas connections',
        'Clear area of flammable materials',
        'Light with striker, not matches',
        'Adjust flame to appropriate size',
        'Never leave unattended',
        'Turn off gas when finished'
      ],
      maintenanceSchedule: [
        'Inspect monthly for leaks',
        'Clean burner tube quarterly',
        'Check gas connections annually'
      ],
      hazards: ['Fire', 'Burns', 'Gas leaks', 'Explosion'],
      ppeRequired: ['Safety goggles', 'Lab coat', 'Heat-resistant gloves'],
      emergencyProcedures: [
        'Turn off gas immediately',
        'Use fire extinguisher if needed',
        'Evacuate if necessary',
        'Notify instructor'
      ],
      ageAppropriate: ['Middle School and above', 'With supervision']
    },
    'Microscope': {
      equipment: 'Microscope',
      labType: 'biology',
      safetyFeatures: [
        'Light intensity control',
        'Secure stage',
        'Eye piece protection'
      ],
      operatingProcedures: [
        'Carry with two hands',
        'Clean lenses with lens paper only',
        'Use appropriate magnification',
        'Store properly after use'
      ],
      maintenanceSchedule: [
        'Clean lenses weekly',
        'Check light source monthly',
        'Service annually'
      ],
      hazards: ['Eye strain', 'Broken glass', 'Electrical'],
      ppeRequired: ['Safety goggles if using chemicals'],
      emergencyProcedures: [
        'Turn off if malfunctioning',
        'Report damage immediately',
        'Do not attempt repairs'
      ],
      ageAppropriate: ['All grade levels', 'With instruction']
    }
  }
  
  return equipmentGuide[equipment] || {
    equipment,
    labType,
    safetyFeatures: ['Check manufacturer manual'],
    operatingProcedures: ['Refer to manufacturer instructions'],
    maintenanceSchedule: ['Follow manufacturer recommendations'],
    hazards: ['Check equipment manual'],
    ppeRequired: ['Safety goggles', 'Lab coat'],
    emergencyProcedures: ['Turn off equipment', 'Notify instructor'],
    ageAppropriate: ['Check with instructor']
  }
}

// Emergency Procedures
export const getEmergencyProcedure = (type: string, severity: string): EmergencyProcedure => {
  const procedures: Record<string, EmergencyProcedure> = {
    'chemical-spill': {
      type: 'spill',
      severity: 'moderate',
      steps: [
        'Alert others in the area',
        'Evacuate if necessary',
        'Put on appropriate PPE',
        'Contain spill if safe to do so',
        'Use appropriate spill kit',
        'Clean up according to procedure',
        'Dispose of waste properly',
        'Report incident'
      ],
      ppeRequired: ['Gloves', 'Goggles', 'Lab coat', 'Face shield if needed'],
      contacts: ['Instructor', 'Safety officer', 'Emergency services if needed'],
      followUp: [
        'Document incident',
        'Review procedures',
        'Update safety protocols if needed'
      ]
    },
    'fire': {
      type: 'fire',
      severity: 'critical',
      steps: [
        'Alert others - shout "Fire!"',
        'Evacuate immediately',
        'Pull fire alarm',
        'Call emergency services',
        'Use fire extinguisher only if trained and safe',
        'Do not re-enter building',
        'Assemble at designated meeting point'
      ],
      ppeRequired: ['None - evacuate immediately'],
      contacts: ['Fire department', 'Emergency services', 'School administration'],
      followUp: [
        'Report to authorities',
        'Document incident',
        'Review fire safety procedures'
      ]
    },
    'medical-emergency': {
      type: 'medical',
      severity: 'critical',
      steps: [
        'Assess situation - is it safe to help?',
        'Call emergency services immediately',
        'Provide first aid if trained',
        'Do not move injured person unless unsafe',
        'Control bleeding if present',
        'Stay with person until help arrives',
        'Notify school nurse/medical staff'
      ],
      ppeRequired: ['Gloves if providing first aid'],
      contacts: ['Emergency services', 'School nurse', 'Administration'],
      followUp: [
        'Complete incident report',
        'Review safety procedures',
        'Provide support to affected individuals'
      ]
    }
  }
  
  return procedures[type] || procedures['chemical-spill']
}

// Experiment Design Generator
export const generateExperimentDesign = (
  title: string,
  objective: string,
  labType: string,
  gradeLevel: string
): ExperimentDesign => {
  return {
    title,
    objective,
    labType,
    gradeLevel,
    materials: [
      { item: 'Beaker', quantity: '1', safetyNotes: 'Check for cracks' },
      { item: 'Safety goggles', quantity: '1 per student', safetyNotes: 'Required PPE' },
      { item: 'Lab coat', quantity: '1 per student', safetyNotes: 'Required PPE' }
    ],
    procedure: [
      'Put on all required PPE',
      'Set up equipment as instructed',
      'Follow procedure step-by-step',
      'Record observations',
      'Clean up and dispose of materials properly'
    ],
    safetyConsiderations: [
      'Review safety protocols before starting',
      'Ensure proper ventilation',
      'Have emergency procedures posted',
      'Supervise students closely'
    ],
    riskLevel: 'medium',
    alternatives: [
      'Use safer chemicals if possible',
      'Reduce quantities',
      'Use simulation software for high-risk experiments'
    ],
    assessment: [
      'Safety protocol adherence',
      'Proper use of equipment',
      'Accurate observations',
      'Proper cleanup'
    ]
  }
}

// Get lab types
export const getLabTypes = () => [
  'Biology',
  'Chemistry',
  'Physics',
  'General Science'
]

// Get grade levels
export const getLabGradeLevels = () => [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College'
]

// Get protocol categories
export const getProtocolCategories = () => [
  'Chemical Handling',
  'Equipment Operation',
  'PPE Usage',
  'Emergency Procedures',
  'General Safety'
]

// Get risk levels
export const getRiskLevels = () => [
  'Low',
  'Medium',
  'High',
  'Critical'
]




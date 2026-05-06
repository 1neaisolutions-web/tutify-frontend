// Drama & Theater Director Utilities - International Standards Focus

export interface ScriptAnalysis {
  title: string
  playwright: string
  period: string
  genre: string
  structure: {
    acts: number
    scenes: number
    plotStructure: {
      exposition: string
      risingAction: string
      climax: string
      fallingAction: string
      resolution: string
    }
  }
  characters: {
    name: string
    role: string
    relationships: string[]
    objectives: string[]
    arc: string
  }[]
  themes: string[]
  symbols: string[]
  style: string
  culturalContext: string
}

export interface CharacterProfile {
  name: string
  age: string
  physicalTraits: string[]
  psychologicalTraits: string[]
  background: string
  objectives: string[]
  obstacles: string[]
  tactics: string[]
  relationships: {
    character: string
    relationship: string
  }[]
  arc: string
  keyQuotes: string[]
}

export interface StageDirection {
  scene: string
  stageType: string
  blocking: {
    character: string
    position: string
    movement: string
    focus: string
  }[]
  stagePicture: string
  technicalNotes: {
    lighting: string[]
    sound: string[]
    props: string[]
    costume: string[]
  }
  objectives: string[]
}

export interface ProductionPlan {
  title: string
  timeline: {
    phase: string
    startDate: string
    endDate: string
    tasks: string[]
  }[]
  budget: {
    category: string
    amount: string
    notes: string
  }[]
  team: {
    role: string
    responsibilities: string[]
    requirements: string[]
  }[]
  rehearsalSchedule: {
    date: string
    type: string
    focus: string
    duration: string
  }[]
  performanceSchedule: {
    date: string
    time: string
    type: string
    notes: string
  }[]
}

export interface ActingMethod {
  id: string
  name: string
  founder: string
  description: string
  keyPrinciples: string[]
  techniques: string[]
  exercises: string[]
  applications: string[]
  benefits: string[]
}

export interface TheaterStyle {
  id: string
  name: string
  origin: string
  description: string
  characteristics: string[]
  keyPractitioners: string[]
  examples: string[]
  teachingApproach: string[]
}

export interface TheaterStandard {
  id: string
  name: string
  organization: string
  region: string
  description: string
  keyComponents: string[]
  gradeLevels: string[]
  assessmentCriteria: string[]
}

// Script Analysis Generator
export const generateScriptAnalysis = (title: string, playwright: string): ScriptAnalysis => {
  return {
    title,
    playwright,
    period: 'Modern',
    genre: 'Drama',
    structure: {
      acts: 3,
      scenes: 12,
      plotStructure: {
        exposition: 'Introduction of characters and setting',
        risingAction: 'Conflict develops and intensifies',
        climax: 'Turning point of the play',
        fallingAction: 'Consequences of climax unfold',
        resolution: 'Final outcome and conclusion'
      }
    },
    characters: [
      {
        name: 'Protagonist',
        role: 'Main character',
        relationships: ['Other characters'],
        objectives: ['Primary goal', 'Secondary goals'],
        arc: 'Character development throughout play'
      }
    ],
    themes: ['Theme 1', 'Theme 2', 'Theme 3'],
    symbols: ['Symbol 1', 'Symbol 2'],
    style: 'Realistic',
    culturalContext: 'Contemporary setting with social relevance'
  }
}

// Character Development Tools
export const generateCharacterProfile = (name: string, role: string): CharacterProfile => {
  return {
    name,
    age: 'To be determined',
    physicalTraits: ['Appearance', 'Posture', 'Movement style'],
    psychologicalTraits: ['Personality', 'Emotions', 'Beliefs'],
    background: 'Character history and experiences',
    objectives: ['What the character wants', 'Primary objective', 'Secondary objectives'],
    obstacles: ['What prevents achieving objectives'],
    tactics: ['How character tries to achieve objectives'],
    relationships: [
      {
        character: 'Other Character',
        relationship: 'Relationship type'
      }
    ],
    arc: 'How character changes throughout the play',
    keyQuotes: ['Memorable lines', 'Revealing dialogue']
  }
}

// Stage Direction Generator
export const generateStageDirection = (scene: string, stageType: string): StageDirection => {
  return {
    scene,
    stageType,
    blocking: [
      {
        character: 'Character 1',
        position: 'Center stage',
        movement: 'Enters from stage left',
        focus: 'Downstage center'
      }
    ],
    stagePicture: 'Visual composition of the scene',
    technicalNotes: {
      lighting: ['Warm lighting', 'Spotlight on character'],
      sound: ['Background music', 'Sound effects'],
      props: ['Key props needed'],
      costume: ['Costume notes']
    },
    objectives: ['Scene objectives', 'Character objectives']
  }
}

// Production Plan Generator
export const generateProductionPlan = (title: string, duration: string): ProductionPlan => {
  return {
    title,
    timeline: [
      {
        phase: 'Pre-Production',
        startDate: 'Week 1',
        endDate: 'Week 4',
        tasks: [
          'Script selection',
          'Team assembly',
          'Budget planning',
          'Design concepts'
        ]
      },
      {
        phase: 'Rehearsal',
        startDate: 'Week 5',
        endDate: 'Week 10',
        tasks: [
          'Table work',
          'Blocking',
          'Scene work',
          'Run-throughs'
        ]
      },
      {
        phase: 'Technical',
        startDate: 'Week 11',
        endDate: 'Week 12',
        tasks: [
          'Tech rehearsals',
          'Dress rehearsals',
          'Final preparations'
        ]
      },
      {
        phase: 'Performance',
        startDate: 'Week 13',
        endDate: 'Week 14',
        tasks: [
          'Performances',
          'Post-show discussions',
          'Strike'
        ]
      }
    ],
    budget: [
      {
        category: 'Sets',
        amount: '$X',
        notes: 'Set construction materials'
      },
      {
        category: 'Costumes',
        amount: '$X',
        notes: 'Costume rental/purchase'
      },
      {
        category: 'Lighting',
        amount: '$X',
        notes: 'Lighting equipment rental'
      }
    ],
    team: [
      {
        role: 'Director',
        responsibilities: [
          'Overall vision',
          'Actor coaching',
          'Blocking',
          'Production coordination'
        ],
        requirements: ['Theater experience', 'Leadership skills']
      },
      {
        role: 'Stage Manager',
        responsibilities: [
          'Rehearsal coordination',
          'Performance calling',
          'Backstage management'
        ],
        requirements: ['Organization', 'Communication']
      }
    ],
    rehearsalSchedule: [
      {
        date: 'Week 5',
        type: 'Table Work',
        focus: 'Script analysis',
        duration: '2 hours'
      },
      {
        date: 'Week 6',
        type: 'Blocking',
        focus: 'Stage movement',
        duration: '3 hours'
      }
    ],
    performanceSchedule: [
      {
        date: 'Opening Night',
        time: '7:00 PM',
        type: 'Performance',
        notes: 'Opening night performance'
      }
    ]
  }
}

// Acting Methods
export const getActingMethods = (): ActingMethod[] => [
  {
    id: 'stanislavski',
    name: 'Stanislavski System',
    founder: 'Konstantin Stanislavski',
    description: 'Systematic approach to realistic acting focusing on truth and emotional authenticity',
    keyPrinciples: [
      'Given circumstances',
      'Magic if',
      'Emotional memory',
      'Objectives and super-objectives',
      'Through-line of action'
    ],
    techniques: [
      'Given circumstances analysis',
      'Emotional memory exercises',
      'Objective identification',
      'Tactic development',
      'Sense memory work'
    ],
    exercises: [
      'Given circumstances worksheet',
      'Emotional memory recall',
      'Objective and obstacle identification',
      'Tactic improvisation',
      'Through-line mapping'
    ],
    applications: [
      'Realistic drama',
      'Character development',
      'Emotional truth',
      'Scene work',
      'Monologue preparation'
    ],
    benefits: [
      'Authentic performances',
      'Deep character understanding',
      'Emotional connection',
      'Truthful acting',
      'Strong technique foundation'
    ]
  },
  {
    id: 'meisner',
    name: 'Meisner Technique',
    founder: 'Sanford Meisner',
    description: 'Acting technique focusing on truthful moment-to-moment work and emotional preparation',
    keyPrinciples: [
      'Repetition exercises',
      'Emotional preparation',
      'Truthful moment-to-moment',
      'Living truthfully under imaginary circumstances',
      'Spontaneity'
    ],
    techniques: [
      'Repetition exercises',
      'Emotional preparation',
      'Independent activities',
      'Knock at the door',
      'Scene work'
    ],
    exercises: [
      'Repetition game',
      'Emotional preparation',
      'Independent activity',
      'Knock at the door exercise',
      'Scene repetition'
    ],
    applications: [
      'Contemporary drama',
      'Film acting',
      'Naturalistic performance',
      'Emotional authenticity',
      'Spontaneous reactions'
    ],
    benefits: [
      'Spontaneous reactions',
      'Emotional authenticity',
      'Listening skills',
      'Truthful moment-to-moment',
      'Strong technique'
    ]
  },
  {
    id: 'brecht',
    name: 'Brechtian Techniques',
    founder: 'Bertolt Brecht',
    description: 'Epic theater techniques emphasizing social and political awareness',
    keyPrinciples: [
      'Verfremdungseffekt (Alienation Effect)',
      'Gestus',
      'Epic theater',
      'Social commentary',
      'Audience awareness'
    ],
    techniques: [
      'Alienation effect',
      'Gestus (gesture + attitude)',
      'Narration',
      'Direct address',
      'Breaking the fourth wall'
    ],
    exercises: [
      'Alienation exercises',
      'Gestus practice',
      'Narration work',
      'Direct address',
      'Social commentary'
    ],
    applications: [
      'Political theater',
      'Epic theater',
      'Social commentary',
      'Educational theater',
      'Contemporary drama'
    ],
    benefits: [
      'Social awareness',
      'Critical thinking',
      'Political engagement',
      'Audience engagement',
      'Educational value'
    ]
  },
  {
    id: 'physical',
    name: 'Physical Theater',
    founder: 'Various (Lecoq, Grotowski, etc.)',
    description: 'Theater emphasizing physical expression, movement, and body language',
    keyPrinciples: [
      'Body as instrument',
      'Movement and gesture',
      'Physical characterization',
      'Ensemble work',
      'Visual storytelling'
    ],
    techniques: [
      'Movement exercises',
      'Gesture work',
      'Physical characterization',
      'Ensemble movement',
      'Mime and mask work'
    ],
    exercises: [
      'Movement improvisation',
      'Gesture exercises',
      'Physical characterization',
      'Ensemble exercises',
      'Mime work'
    ],
    applications: [
      'Physical theater',
      'Movement-based performance',
      'Ensemble work',
      'Visual storytelling',
      'Contemporary performance'
    ],
    benefits: [
      'Physical expression',
      'Body awareness',
      'Ensemble skills',
      'Visual storytelling',
      'Creative movement'
    ]
  }
]

// Theater Styles
export const getTheaterStyles = (): TheaterStyle[] => [
  {
    id: 'realism',
    name: 'Realism',
    origin: '19th Century Europe',
    description: 'Theater that presents life as it is, without idealization',
    characteristics: [
      'Everyday characters',
      'Natural dialogue',
      'Realistic settings',
      'Social issues',
      'Psychological depth'
    ],
    keyPractitioners: ['Henrik Ibsen', 'Anton Chekhov', 'August Strindberg'],
    examples: ['A Doll\'s House', 'The Cherry Orchard', 'Miss Julie'],
    teachingApproach: [
      'Character analysis',
      'Given circumstances',
      'Emotional truth',
      'Social context'
    ]
  },
  {
    id: 'expressionism',
    name: 'Expressionism',
    origin: 'Early 20th Century Germany',
    description: 'Theater emphasizing emotional expression and subjective reality',
    characteristics: [
      'Distorted reality',
      'Emotional intensity',
      'Symbolic settings',
      'Internal states',
      'Stylized performance'
    ],
    keyPractitioners: ['Georg Kaiser', 'Ernst Toller', 'Eugene O\'Neill'],
    examples: ['The Hairy Ape', 'From Morn to Midnight'],
    teachingApproach: [
      'Emotional expression',
      'Symbolic interpretation',
      'Stylized movement',
      'Visual design'
    ]
  },
  {
    id: 'absurdism',
    name: 'Theater of the Absurd',
    origin: 'Mid-20th Century Europe',
    description: 'Theater exploring the meaninglessness of existence',
    characteristics: [
      'Illogical plots',
      'Repetitive dialogue',
      'Existential themes',
      'Comic and tragic',
      'Minimalist settings'
    ],
    keyPractitioners: ['Samuel Beckett', 'Eugene Ionesco', 'Harold Pinter'],
    examples: ['Waiting for Godot', 'The Bald Soprano', 'The Birthday Party'],
    teachingApproach: [
      'Absurd logic',
      'Repetition',
      'Existential themes',
      'Comic timing'
    ]
  },
  {
    id: 'epic',
    name: 'Epic Theater',
    origin: '20th Century Germany',
    description: 'Theater emphasizing social and political awareness',
    characteristics: [
      'Narration',
      'Alienation effect',
      'Social commentary',
      'Epic scope',
      'Audience engagement'
    ],
    keyPractitioners: ['Bertolt Brecht', 'Erwin Piscator'],
    examples: ['Mother Courage', 'The Threepenny Opera'],
    teachingApproach: [
      'Social analysis',
      'Political awareness',
      'Alienation techniques',
      'Critical thinking'
    ]
  }
]

// Theater Standards
export const getTheaterStandards = (): TheaterStandard[] => [
  {
    id: 'ista',
    name: 'ISTA Standards',
    organization: 'International Schools Theatre Association',
    region: 'Global',
    description: 'International standards for theater education in schools',
    keyComponents: [
      'Creating',
      'Performing',
      'Responding',
      'Connecting',
      'Collaboration'
    ],
    gradeLevels: ['All levels'],
    assessmentCriteria: [
      'Creative expression',
      'Performance skills',
      'Theater knowledge',
      'Collaboration',
      'Reflection'
    ]
  },
  {
    id: 'iti',
    name: 'ITI Framework',
    organization: 'International Theatre Institute',
    region: 'Global',
    description: 'Global framework for theater education and practice',
    keyComponents: [
      'Theater education',
      'Cultural exchange',
      'Professional development',
      'International collaboration',
      'Arts advocacy'
    ],
    gradeLevels: ['All levels'],
    assessmentCriteria: [
      'Theater skills',
      'Cultural awareness',
      'Collaboration',
      'Professional development',
      'Global engagement'
    ]
  },
  {
    id: 'nafme-arts',
    name: 'NAfME Arts Standards',
    organization: 'National Association for Music Education',
    region: 'United States',
    description: 'National standards for theater arts education',
    keyComponents: [
      'Creating',
      'Performing',
      'Responding',
      'Connecting'
    ],
    gradeLevels: ['K-12'],
    assessmentCriteria: [
      'Creative expression',
      'Performance skills',
      'Theater analysis',
      'Cultural connections',
      'Theater literacy'
    ]
  }
]

// Get play genres
export const getPlayGenres = () => [
  'Drama',
  'Comedy',
  'Tragedy',
  'Tragicomedy',
  'Musical',
  'Experimental',
  'Physical Theater',
  'Absurdist'
]

// Get stage types
export const getStageTypes = () => [
  'Proscenium',
  'Thrust',
  'Arena',
  'Black Box',
  'Site-Specific',
  'Outdoor'
]

// Get production roles
export const getProductionRoles = () => [
  'Director',
  'Stage Manager',
  'Assistant Director',
  'Set Designer',
  'Lighting Designer',
  'Costume Designer',
  'Sound Designer',
  'Props Master',
  'Technical Director',
  'Producer'
]

// Get theater periods
export const getTheaterPeriods = () => [
  'Classical',
  'Medieval',
  'Renaissance',
  'Restoration',
  '19th Century',
  'Modern',
  'Contemporary',
  'Postmodern'
]




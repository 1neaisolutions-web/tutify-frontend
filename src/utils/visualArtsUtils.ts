// Visual Arts Studio Assistant Utilities

export interface ArtMovement {
  id: string
  name: string
  period: string
  region: string
  description: string
  keyArtists: string[]
  characteristics: string[]
  culturalContext: string
  relatedMovements: string[]
  notableArtworks: {
    title: string
    artist: string
    year: string
    description: string
  }[]
}

export interface TechniqueGuide {
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  materials: string[]
  tools: string[]
  steps: {
    step: number
    title: string
    description: string
    tips: string[]
    safetyNotes?: string[]
  }[]
  commonMistakes: string[]
  variations: string[]
  culturalExamples: string[]
}

export interface PortfolioAssessment {
  criteria: {
    category: string
    description: string
    points: number
    indicators: string[]
  }[]
  reflectionPrompts: string[]
  documentationTips: string[]
  presentationGuidelines: string[]
}

export interface CreativeProject {
  title: string
  gradeLevel: string
  duration: string
  media: string[]
  learningObjectives: string[]
  materials: {
    required: string[]
    optional: string[]
    budget: string
  }
  steps: {
    phase: string
    activities: string[]
    duration: string
  }[]
  differentiation: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
  }
  assessmentCriteria: string[]
  culturalConnections: string[]
  crossCurricular: string[]
}

export interface VisualLiteracyAnalysis {
  artwork: {
    title: string
    artist: string
    period: string
    culture: string
  }
  formalElements: {
    line: string[]
    shape: string[]
    color: string[]
    texture: string[]
    space: string[]
    form: string[]
  }
  principlesOfDesign: {
    balance: string
    contrast: string
    emphasis: string
    movement: string
    pattern: string
    rhythm: string
    unity: string
  }
  contextualAnalysis: {
    historical: string
    cultural: string
    social: string
    personal: string
  }
  criticalQuestions: {
    describe: string[]
    analyze: string[]
    interpret: string[]
    evaluate: string[]
  }
}

export interface CulturalConnection {
  artwork: string
  culture: string
  region: string
  themes: string[]
  techniques: string[]
  contemporaryRelevance: string[]
  crossCulturalInfluences: string[]
  teachingStrategies: string[]
}

export interface AssessmentRubric {
  title: string
  criteria: {
    category: string
    excellent: string
    proficient: string
    developing: string
    beginning: string
    points: number
  }[]
  totalPoints: number
  standards: string[]
}

// Art History Database (Global Scope)
export const getArtMovements = (): ArtMovement[] => [
  {
    id: 'renaissance',
    name: 'Renaissance',
    period: '14th-17th Century',
    region: 'Europe',
    description: 'Revival of classical learning and values, emphasis on humanism and naturalism',
    keyArtists: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Titian'],
    characteristics: ['Perspective', 'Chiaroscuro', 'Human anatomy', 'Classical themes'],
    culturalContext: 'Period of cultural rebirth following the Middle Ages, influenced by classical antiquity',
    relatedMovements: ['Mannerism', 'Baroque'],
    notableArtworks: [
      {
        title: 'Mona Lisa',
        artist: 'Leonardo da Vinci',
        year: '1503-1519',
        description: 'Iconic portrait demonstrating sfumato technique'
      }
    ]
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    period: '1860s-1880s',
    region: 'France',
    description: 'Focus on capturing light and momentary impressions',
    keyArtists: ['Claude Monet', 'Pierre-Auguste Renoir', 'Edgar Degas', 'Camille Pissarro'],
    characteristics: ['Visible brushstrokes', 'Light effects', 'Outdoor scenes', 'Everyday subjects'],
    culturalContext: 'Reaction against academic art, influenced by photography and Japanese prints',
    relatedMovements: ['Post-Impressionism', 'Pointillism'],
    notableArtworks: [
      {
        title: 'Impression, Sunrise',
        artist: 'Claude Monet',
        year: '1872',
        description: 'Painting that gave the movement its name'
      }
    ]
  },
  {
    id: 'ukiyo-e',
    name: 'Ukiyo-e',
    period: '17th-19th Century',
    region: 'Japan',
    description: 'Woodblock prints depicting "floating world" scenes',
    keyArtists: ['Hokusai', 'Hiroshige', 'Utamaro'],
    characteristics: ['Flat colors', 'Bold outlines', 'Asymmetric composition', 'Nature themes'],
    culturalContext: 'Popular art form during Edo period, influenced Western art movements',
    relatedMovements: ['Japonisme', 'Art Nouveau'],
    notableArtworks: [
      {
        title: 'The Great Wave off Kanagawa',
        artist: 'Hokusai',
        year: '1831',
        description: 'Most famous Japanese woodblock print'
      }
    ]
  },
  {
    id: 'african-contemporary',
    name: 'Contemporary African Art',
    period: '20th-21st Century',
    region: 'Africa',
    description: 'Diverse artistic expressions addressing identity, history, and social issues',
    keyArtists: ['El Anatsui', 'Yinka Shonibare', 'Wangechi Mutu', 'Julie Mehretu'],
    characteristics: ['Mixed media', 'Cultural identity', 'Social commentary', 'Global perspectives'],
    culturalContext: 'Addresses post-colonial identity, globalization, and African diaspora',
    relatedMovements: ['Post-colonial Art', 'Global Contemporary'],
    notableArtworks: [
      {
        title: 'Gravity and Grace',
        artist: 'El Anatsui',
        year: '2010',
        description: 'Large-scale installation using recycled materials'
      }
    ]
  },
  {
    id: 'indigenous-australian',
    name: 'Indigenous Australian Art',
    period: 'Ancient-Contemporary',
    region: 'Australia',
    description: 'Rich tradition spanning 60,000+ years, contemporary expressions of cultural identity',
    keyArtists: ['Emily Kame Kngwarreye', 'Clifford Possum Tjapaltjarri', 'Sally Gabori'],
    characteristics: ['Dot painting', 'Dreamtime stories', 'Connection to land', 'Symbolic patterns'],
    culturalContext: 'Deep spiritual connection to land and ancestors, contemporary political expression',
    relatedMovements: ['Aboriginal Art', 'Contemporary Indigenous'],
    notableArtworks: [
      {
        title: 'Earth\'s Creation',
        artist: 'Emily Kame Kngwarreye',
        year: '1994',
        description: 'Large-scale abstract work representing creation story'
      }
    ]
  },
  {
    id: 'mexican-muralism',
    name: 'Mexican Muralism',
    period: '1920s-1950s',
    region: 'Mexico',
    description: 'Public art movement promoting social and political messages',
    keyArtists: ['Diego Rivera', 'José Clemente Orozco', 'David Alfaro Siqueiros'],
    characteristics: ['Large-scale murals', 'Social themes', 'Indigenous influences', 'Public accessibility'],
    culturalContext: 'Post-revolutionary Mexico, promoting national identity and social justice',
    relatedMovements: ['Social Realism', 'Public Art'],
    notableArtworks: [
      {
        title: 'Man at the Crossroads',
        artist: 'Diego Rivera',
        year: '1933',
        description: 'Controversial mural addressing social themes'
      }
    ]
  }
]

// Technique Guidance
export const getTechniqueGuide = (techniqueName: string): TechniqueGuide => {
  const techniques: Record<string, TechniqueGuide> = {
    'Watercolor Painting': {
      name: 'Watercolor Painting',
      category: 'Painting',
      difficulty: 'intermediate',
      materials: ['Watercolor paints', 'Watercolor paper', 'Brushes (round, flat)', 'Water containers', 'Palette'],
      tools: ['Brushes', 'Sponges', 'Masking fluid', 'Salt', 'Plastic wrap'],
      steps: [
        {
          step: 1,
          title: 'Prepare Materials',
          description: 'Set up your workspace with water, paints, and paper',
          tips: ['Use quality watercolor paper', 'Have multiple water containers', 'Test colors on scrap paper'],
          safetyNotes: ['Ensure good ventilation', 'Wash hands after painting']
        },
        {
          step: 2,
          title: 'Wet-on-Wet Technique',
          description: 'Apply wet paint to wet paper for soft, blended effects',
          tips: ['Wet paper evenly', 'Work quickly before paper dries', 'Use less water for more control'],
          safetyNotes: []
        },
        {
          step: 3,
          title: 'Layering',
          description: 'Build up colors gradually, allowing each layer to dry',
          tips: ['Start with light colors', 'Let layers dry completely', 'Use transparent colors for layering'],
          safetyNotes: []
        }
      ],
      commonMistakes: [
        'Using too much water',
        'Overworking the paper',
        'Not planning color placement',
        'Mixing too many colors'
      ],
      variations: ['Wet-on-dry', 'Dry brush', 'Glazing', 'Splattering'],
      culturalExamples: ['Chinese ink painting', 'Japanese sumi-e', 'European watercolor tradition']
    },
    'Charcoal Drawing': {
      name: 'Charcoal Drawing',
      category: 'Drawing',
      difficulty: 'beginner',
      materials: ['Charcoal sticks', 'Charcoal pencils', 'Drawing paper', 'Kneaded eraser', 'Fixative'],
      tools: ['Blending stumps', 'Paper towels', 'Chamois cloth'],
      steps: [
        {
          step: 1,
          title: 'Basic Setup',
          description: 'Prepare your drawing surface and materials',
          tips: ['Use textured paper', 'Have fixative ready', 'Work on an easel or tilted surface'],
          safetyNotes: ['Work in well-ventilated area', 'Avoid breathing charcoal dust']
        },
        {
          step: 2,
          title: 'Blocking In',
          description: 'Establish basic shapes and composition',
          tips: ['Use light pressure initially', 'Focus on large shapes first', 'Check proportions'],
          safetyNotes: []
        },
        {
          step: 3,
          title: 'Value Development',
          description: 'Build up darks and lights to create form',
          tips: ['Use eraser for highlights', 'Blend for smooth transitions', 'Preserve white paper for brightest areas'],
          safetyNotes: []
        }
      ],
      commonMistakes: [
        'Smudging unintentionally',
        'Not preserving highlights',
        'Over-blending',
        'Using too much pressure'
      ],
      variations: ['Conté crayon', 'Graphite', 'Carbon pencil'],
      culturalExamples: ['Renaissance drawing studies', 'Contemporary portrait work', 'Gesture drawing traditions']
    }
  }
  
  return techniques[techniqueName] || techniques['Watercolor Painting']
}

// Portfolio Assessment
export const generatePortfolioAssessment = (gradeLevel: string, portfolioType: string): PortfolioAssessment => {
  return {
    criteria: [
      {
        category: 'Technical Skill',
        description: 'Demonstration of technical proficiency with chosen media',
        points: 25,
        indicators: [
          'Appropriate use of materials',
          'Control of techniques',
          'Craftsmanship quality',
          'Skill development over time'
        ]
      },
      {
        category: 'Creative Expression',
        description: 'Originality and personal voice in artwork',
        points: 25,
        indicators: [
          'Unique artistic vision',
          'Risk-taking and experimentation',
          'Personal meaning conveyed',
          'Innovative approaches'
        ]
      },
      {
        category: 'Conceptual Development',
        description: 'Depth of ideas and artistic thinking',
        points: 25,
        indicators: [
          'Clear artistic intent',
          'Research and planning',
          'Conceptual complexity',
          'Cultural awareness'
        ]
      },
      {
        category: 'Presentation',
        description: 'Quality of portfolio organization and documentation',
        points: 25,
        indicators: [
          'Professional documentation',
          'Clear organization',
          'Effective sequencing',
          'Written reflection quality'
        ]
      }
    ],
    reflectionPrompts: [
      'What artistic growth do you see in your portfolio?',
      'How does your work connect to your personal experiences?',
      'What cultural or historical influences inform your art?',
      'What challenges did you overcome?',
      'What would you like to explore further?'
    ],
    documentationTips: [
      'Use consistent lighting for photography',
      'Include multiple angles for 3D work',
      'Maintain high resolution for digital files',
      'Document process and sketches',
      'Include detail shots of important areas'
    ],
    presentationGuidelines: [
      'Organize chronologically or thematically',
      'Include artist statement',
      'Provide context for each piece',
      'Consider digital and physical formats',
      'Prepare for both online and in-person viewing'
    ]
  }
}

// Creative Project Generator
export const generateCreativeProject = (
  gradeLevel: string,
  media: string,
  theme: string,
  duration: string
): CreativeProject => {
  const projects: Record<string, CreativeProject> = {
    'Identity Collage': {
      title: 'Cultural Identity Collage',
      gradeLevel: '6-12',
      duration: '3-4 weeks',
      media: ['Mixed Media', 'Collage', 'Drawing'],
      learningObjectives: [
        'Explore personal and cultural identity',
        'Understand symbolism in art',
        'Develop composition skills',
        'Connect art to personal experience'
      ],
      materials: {
        required: ['Magazines', 'Scissors', 'Glue', 'Cardboard or canvas', 'Acrylic paint'],
        optional: ['Fabric scraps', 'Photographs', 'Found objects', 'Text'],
        budget: '$15-25 per student'
      },
      steps: [
        {
          phase: 'Research & Planning',
          activities: [
            'Research cultural symbols and meanings',
            'Collect personal images and materials',
            'Create preliminary sketches',
            'Write artist statement draft'
          ],
          duration: '1 week'
        },
        {
          phase: 'Creation',
          activities: [
            'Arrange composition',
            'Layer materials',
            'Add paint and drawing',
            'Refine details'
          ],
          duration: '2 weeks'
        },
        {
          phase: 'Reflection & Presentation',
          activities: [
            'Complete artist statement',
            'Participate in critique',
            'Prepare for exhibition',
            'Document artwork'
          ],
          duration: '1 week'
        }
      ],
      differentiation: {
        beginner: ['Provide templates', 'Pre-cut materials', 'Simplified composition', 'Guided symbolism'],
        intermediate: ['Open-ended composition', 'Student choice of materials', 'Independent research', 'Peer collaboration'],
        advanced: ['Complex layering techniques', 'Multi-media integration', 'Thematic series', 'Curatorial practice']
      },
      assessmentCriteria: [
        'Composition and design',
        'Use of symbolism',
        'Technical skill',
        'Personal expression',
        'Cultural awareness'
      ],
      culturalConnections: [
        'Indigenous storytelling traditions',
        'Contemporary identity art',
        'Dada and Surrealist collage',
        'Global collage artists'
      ],
      crossCurricular: [
        'Social Studies: Cultural studies',
        'Language Arts: Personal narrative',
        'History: Historical context',
        'Psychology: Identity development'
      ]
    },
    'Nature Printmaking': {
      title: 'Nature-Inspired Printmaking',
      gradeLevel: 'K-8',
      duration: '2-3 weeks',
      media: ['Printmaking', 'Nature Materials'],
      learningObjectives: [
        'Understand printmaking processes',
        'Observe natural forms',
        'Create patterns and repetition',
        'Connect art to environment'
      ],
      materials: {
        required: ['Printing ink', 'Brayer', 'Printing paper', 'Nature materials (leaves, etc.)', 'Styrofoam plates'],
        optional: ['Linoleum blocks', 'Carving tools', 'Multiple colors'],
        budget: '$10-20 per student'
      },
      steps: [
        {
          phase: 'Exploration',
          activities: [
            'Nature walk and collection',
            'Study natural forms',
            'Practice printing techniques',
            'Experiment with materials'
          ],
          duration: '1 week'
        },
        {
          phase: 'Design & Print',
          activities: [
            'Create printing plate',
            'Plan composition',
            'Print multiple copies',
            'Experiment with color'
          ],
          duration: '1-2 weeks'
        }
      ],
      differentiation: {
        beginner: ['Simple stamping', 'Pre-cut materials', 'Single color', 'Guided process'],
        intermediate: ['Multi-color printing', 'Original designs', 'Pattern creation', 'Independent exploration'],
        advanced: ['Complex compositions', 'Carving techniques', 'Edition creation', 'Artistic series']
      },
      assessmentCriteria: [
        'Print quality',
        'Composition',
        'Use of natural forms',
        'Technical skill',
        'Creativity'
      ],
      culturalConnections: [
        'Japanese nature printing',
        'Indigenous pattern traditions',
        'Botanical illustration',
        'Environmental art'
      ],
      crossCurricular: [
        'Science: Plant study',
        'Math: Patterns and repetition',
        'Environmental Studies: Nature appreciation'
      ]
    }
  }
  
  return projects[theme] || projects['Identity Collage']
}

// Visual Literacy Analysis
export const analyzeArtwork = (artworkTitle: string, artist: string): VisualLiteracyAnalysis => {
  return {
    artwork: {
      title: artworkTitle,
      artist,
      period: 'Contemporary',
      culture: 'Global'
    },
    formalElements: {
      line: [
        'Bold, expressive lines create movement',
        'Varied line weights add visual interest',
        'Lines guide the viewer\'s eye through the composition'
      ],
      shape: [
        'Geometric and organic shapes create contrast',
        'Negative space shapes are carefully considered',
        'Shapes suggest depth and dimension'
      ],
      color: [
        'Warm and cool colors create balance',
        'Color choices convey mood and emotion',
        'Color relationships follow color theory principles'
      ],
      texture: [
        'Visual texture suggests material qualities',
        'Texture adds tactile interest',
        'Texture variation creates focal points'
      ],
      space: [
        'Foreground, middle ground, and background create depth',
        'Overlapping elements suggest spatial relationships',
        'Perspective techniques enhance spatial illusion'
      ],
      form: [
        'Three-dimensional forms are suggested through shading',
        'Light and shadow create volume',
        'Forms interact with space'
      ]
    },
    principlesOfDesign: {
      balance: 'Asymmetric balance creates dynamic composition',
      contrast: 'High contrast draws attention to focal areas',
      emphasis: 'Focal point is established through size, color, and placement',
      movement: 'Visual flow guides viewer through the artwork',
      pattern: 'Repeated elements create rhythm and unity',
      rhythm: 'Rhythmic patterns create visual interest',
      unity: 'Elements work together cohesively'
    },
    contextualAnalysis: {
      historical: 'Created during period of social change, reflects contemporary concerns',
      cultural: 'Draws from multiple cultural traditions, addresses identity',
      social: 'Comments on social issues, engages with community',
      personal: 'Expresses artist\'s personal experiences and perspectives'
    },
    criticalQuestions: {
      describe: [
        'What do you see?',
        'What materials and techniques are used?',
        'What is the subject matter?'
      ],
      analyze: [
        'How are the elements of art used?',
        'What principles of design are evident?',
        'How does the composition work?'
      ],
      interpret: [
        'What is the artist trying to communicate?',
        'What emotions or ideas does this evoke?',
        'What cultural or historical context is relevant?'
      ],
      evaluate: [
        'Is the artwork successful? Why?',
        'What is your personal response?',
        'How does this compare to other artworks?'
      ]
    }
  }
}

// Cultural Connections
export const findCulturalConnections = (artwork: string, theme: string): CulturalConnection => {
  return {
    artwork,
    culture: 'Global',
    region: 'Multiple',
    themes: [
      'Identity and belonging',
      'Cultural heritage',
      'Social justice',
      'Environmental concerns'
    ],
    techniques: [
      'Traditional techniques adapted',
      'Contemporary materials',
      'Cross-cultural influences',
      'Innovative approaches'
    ],
    contemporaryRelevance: [
      'Addresses current social issues',
      'Connects past and present',
      'Global perspectives',
      'Digital age considerations'
    ],
    crossCulturalInfluences: [
      'Western and non-Western traditions',
      'Indigenous and contemporary',
      'Local and global',
      'Traditional and innovative'
    ],
    teachingStrategies: [
      'Compare and contrast artworks',
      'Explore cultural contexts',
      'Discuss contemporary relevance',
      'Create culturally responsive projects'
    ]
  }
}

// Assessment Rubric Generator
export const generateAssessmentRubric = (projectType: string, gradeLevel: string): AssessmentRubric => {
  return {
    title: `${projectType} Assessment Rubric`,
    criteria: [
      {
        category: 'Technical Skill',
        excellent: 'Demonstrates exceptional technical proficiency with clear mastery of techniques',
        proficient: 'Shows good technical skill with minor areas for improvement',
        developing: 'Demonstrates basic technical skills with some inconsistencies',
        beginning: 'Shows limited technical skill requiring significant development',
        points: 25
      },
      {
        category: 'Creativity & Originality',
        excellent: 'Highly original work showing unique artistic vision and risk-taking',
        proficient: 'Shows creativity with some original elements',
        developing: 'Some creative elements but relies on familiar approaches',
        beginning: 'Limited creativity, mostly derivative work',
        points: 25
      },
      {
        category: 'Composition & Design',
        excellent: 'Excellent use of design principles creating compelling composition',
        proficient: 'Good composition with effective use of design principles',
        developing: 'Basic composition with some design considerations',
        beginning: 'Weak composition lacking design awareness',
        points: 25
      },
      {
        category: 'Concept & Meaning',
        excellent: 'Clear artistic intent with deep conceptual development',
        proficient: 'Good concept with some depth',
        developing: 'Basic concept with limited development',
        beginning: 'Unclear or absent concept',
        points: 25
      }
    ],
    totalPoints: 100,
    standards: ['NAEA Standard 1: Creating', 'NAEA Standard 2: Presenting', 'NAEA Standard 3: Responding']
  }
}

// Get available art movements
export const getAvailableArtMovements = () => [
  'Renaissance',
  'Impressionism',
  'Ukiyo-e',
  'Contemporary African Art',
  'Indigenous Australian Art',
  'Mexican Muralism',
  'Abstract Expressionism',
  'Pop Art',
  'Minimalism',
  'Contemporary Global'
]

// Get media types
export const getMediaTypes = () => [
  'Drawing',
  'Painting',
  'Sculpture',
  'Digital Art',
  'Mixed Media',
  'Photography',
  'Printmaking',
  'Ceramics',
  'Textiles',
  'Installation'
]

// Get cultural regions
export const getCulturalRegions = () => [
  'Global',
  'Western',
  'Asian',
  'African',
  'Indigenous',
  'Latin American',
  'Middle Eastern',
  'Oceanic',
  'Contemporary Global'
]




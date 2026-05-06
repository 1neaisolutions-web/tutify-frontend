// Music & Performance Coach Utilities - International Standards Focus

export interface MusicTheoryConcept {
  id: string
  name: string
  category: 'notes' | 'rhythm' | 'scales' | 'chords' | 'intervals' | 'form'
  description: string
  fundamentals: string[]
  examples: string[]
  exercises: string[]
  visualAids: string[]
  commonMistakes: string[]
  tips: string[]
}

export interface CompositionGuide {
  id: string
  title: string
  style: string
  gradeLevel: string
  elements: {
    element: string
    description: string
    techniques: string[]
  }[]
  structure: string[]
  examples: string[]
  exercises: string[]
}

export interface PerformanceTechnique {
  id: string
  name: string
  instrument: string
  category: 'posture' | 'breathing' | 'articulation' | 'expression' | 'practice'
  description: string
  steps: string[]
  exercises: string[]
  commonIssues: string[]
  solutions: string[]
  tips: string[]
}

export interface EnsembleGuide {
  type: string
  description: string
  instrumentation: string[]
  roles: {
    role: string
    responsibilities: string[]
  }[]
  rehearsalTechniques: string[]
  performanceTips: string[]
  commonChallenges: string[]
  solutions: string[]
}

export interface PedagogicalMethod {
  id: string
  name: string
  founder: string
  description: string
  keyPrinciples: string[]
  teachingStrategies: string[]
  activities: string[]
  benefits: string[]
  applications: string[]
}

export interface MusicGame {
  id: string
  name: string
  category: 'theory' | 'ear-training' | 'rhythm' | 'composition'
  description: string
  objectives: string[]
  rules: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
}

export interface MusicStandard {
  id: string
  name: string
  organization: string
  region: string
  description: string
  keyComponents: string[]
  gradeLevels: string[]
  assessmentCriteria: string[]
}

// Music Theory Concepts
export const getMusicTheoryConcept = (conceptName: string): MusicTheoryConcept => {
  const concepts: Record<string, MusicTheoryConcept> = {
    'Major Scale': {
      id: 'major-scale',
      name: 'Major Scale',
      category: 'scales',
      description: 'A seven-note scale following the pattern: whole, whole, half, whole, whole, whole, half',
      fundamentals: [
        'Pattern: W-W-H-W-W-W-H',
        'Tonic (root note)',
        'Major third interval',
        'Perfect fifth interval'
      ],
      examples: [
        'C Major: C-D-E-F-G-A-B-C',
        'G Major: G-A-B-C-D-E-F#-G',
        'F Major: F-G-A-Bb-C-D-E-F'
      ],
      exercises: [
        'Play all major scales',
        'Identify major scales by ear',
        'Write major scales in different keys',
        'Find major scales in pieces'
      ],
      visualAids: [
        'Keyboard diagram',
        'Staff notation',
        'Scale degree numbers',
        'Interval patterns'
      ],
      commonMistakes: [
        'Forgetting accidentals',
        'Incorrect interval spacing',
        'Missing leading tone'
      ],
      tips: [
        'Memorize the pattern',
        'Practice ascending and descending',
        'Use finger patterns on instruments'
      ]
    },
    'Triads': {
      id: 'triads',
      name: 'Triads',
      category: 'chords',
      description: 'Three-note chords built from stacked thirds',
      fundamentals: [
        'Root, third, fifth',
        'Major triad: major third + minor third',
        'Minor triad: minor third + major third',
        'Diminished triad: minor third + minor third',
        'Augmented triad: major third + major third'
      ],
      examples: [
        'C Major: C-E-G',
        'A Minor: A-C-E',
        'B Diminished: B-D-F',
        'C Augmented: C-E-G#'
      ],
      exercises: [
        'Build triads on each scale degree',
        'Identify triads by ear',
        'Play triads in different inversions',
        'Analyze triads in music'
      ],
      visualAids: [
        'Chord diagrams',
        'Staff notation',
        'Interval patterns',
        'Keyboard positions'
      ],
      commonMistakes: [
        'Confusing major and minor',
        'Incorrect interval spacing',
        'Missing notes'
      ],
      tips: [
        'Learn interval patterns',
        'Practice chord recognition',
        'Use chord symbols'
      ]
    },
    'Time Signatures': {
      id: 'time-signatures',
      name: 'Time Signatures',
      category: 'rhythm',
      description: 'Notation indicating how many beats per measure and which note gets the beat',
      fundamentals: [
        'Top number: beats per measure',
        'Bottom number: note value for beat',
        'Common time: 4/4',
        'Simple time: beats divide into two',
        'Compound time: beats divide into three'
      ],
      examples: [
        '4/4: Four quarter notes per measure',
        '3/4: Three quarter notes per measure',
        '6/8: Six eighth notes per measure (compound)',
        '2/2: Two half notes per measure'
      ],
      exercises: [
        'Count rhythms in different time signatures',
        'Identify time signatures by listening',
        'Write rhythms in various time signatures',
        'Conduct different time signatures'
      ],
      visualAids: [
        'Beat patterns',
        'Conducting patterns',
        'Rhythm notation',
        'Metronome visualization'
      ],
      commonMistakes: [
        'Confusing top and bottom numbers',
        'Not understanding compound time',
        'Incorrect beat emphasis'
      ],
      tips: [
        'Learn conducting patterns',
        'Practice counting aloud',
        'Use metronome'
      ]
    }
  }
  
  return concepts[conceptName] || concepts['Major Scale']
}

// Composition Guides
export const getCompositionGuide = (style: string, gradeLevel: string): CompositionGuide => {
  const guides: Record<string, CompositionGuide> = {
    'melody': {
      id: 'melody-composition',
      title: 'Melody Writing Guide',
      style: 'General',
      gradeLevel,
      elements: [
        {
          element: 'Contour',
          description: 'The shape and direction of the melody',
          techniques: ['Ascending', 'Descending', 'Arch shape', 'Wave pattern']
        },
        {
          element: 'Motif',
          description: 'A short musical idea that can be developed',
          techniques: ['Repetition', 'Variation', 'Sequence', 'Inversion']
        },
        {
          element: 'Phrase',
          description: 'A musical sentence, usually 4-8 measures',
          techniques: ['Question-answer phrases', 'Balanced phrases', 'Phrase extension']
        }
      ],
      structure: [
        'Start with a simple motif (2-4 notes)',
        'Develop the motif through repetition and variation',
        'Create a phrase (4-8 measures)',
        'Add a contrasting phrase',
        'Create a complete melody (8-16 measures)'
      ],
      examples: [
        'Folk song melodies',
        'Classical themes',
        'Popular song melodies'
      ],
      exercises: [
        'Write a 4-measure melody',
        'Develop a given motif',
        'Create question-answer phrases',
        'Compose a complete melody'
      ]
    },
    'harmony': {
      id: 'harmony-composition',
      title: 'Harmony Writing Guide',
      style: 'General',
      gradeLevel,
      elements: [
        {
          element: 'Chord Progressions',
          description: 'Sequence of chords that support the melody',
          techniques: ['I-IV-V-I', 'ii-V-I', 'Circle of fifths', 'Modal progressions']
        },
        {
          element: 'Voice Leading',
          description: 'Smooth movement between chord tones',
          techniques: ['Common tones', 'Stepwise motion', 'Avoid leaps', 'Parallel motion']
        }
      ],
      structure: [
        'Analyze the melody',
        'Identify chord tones',
        'Choose appropriate chords',
        'Write chord progression',
        'Add voice leading'
      ],
      examples: [
        'Classical harmony',
        'Jazz harmony',
        'Popular music harmony'
      ],
      exercises: [
        'Harmonize a simple melody',
        'Write chord progressions',
        'Practice voice leading',
        'Create full harmonic accompaniment'
      ]
    }
  }
  
  return guides[style] || guides['melody']
}

// Performance Techniques
export const getPerformanceTechnique = (technique: string, instrument: string): PerformanceTechnique => {
  const techniques: Record<string, PerformanceTechnique> = {
    'breathing': {
      id: 'breathing-technique',
      name: 'Breathing Technique',
      instrument: 'Wind/Voice',
      category: 'breathing',
      description: 'Proper breathing for wind instruments and voice',
      steps: [
        'Stand/sit with good posture',
        'Breathe from diaphragm, not chest',
        'Inhale deeply and silently',
        'Support air with abdominal muscles',
        'Control exhalation for steady tone'
      ],
      exercises: [
        'Diaphragmatic breathing exercises',
        'Breath support exercises',
        'Long tone practice',
        'Breath control exercises'
      ],
      commonIssues: [
        'Shallow chest breathing',
        'Tension in shoulders',
        'Running out of air quickly',
        'Inconsistent tone'
      ],
      solutions: [
        'Focus on lower abdomen expansion',
        'Relax shoulders and neck',
        'Practice breath control exercises',
        'Use metronome for steady rhythm'
      ],
      tips: [
        'Practice breathing exercises daily',
        'Visualize filling from bottom up',
        'Maintain relaxed posture',
        'Build endurance gradually'
      ]
    },
    'posture': {
      id: 'posture-technique',
      name: 'Posture & Positioning',
      instrument: 'All',
      category: 'posture',
      description: 'Proper body alignment and instrument positioning',
      steps: [
        'Stand/sit with straight back',
        'Relax shoulders',
        'Position instrument correctly',
        'Maintain natural hand position',
        'Keep head balanced'
      ],
      exercises: [
        'Posture awareness exercises',
        'Mirror practice',
        'Posture check routines',
        'Stretching exercises'
      ],
      commonIssues: [
        'Slouching',
        'Tension in shoulders',
        'Incorrect instrument angle',
        'Strained neck position'
      ],
      solutions: [
        'Use posture reminders',
        'Practice in front of mirror',
        'Adjust instrument position',
        'Take regular breaks'
      ],
      tips: [
        'Check posture frequently',
        'Use ergonomic equipment',
        'Practice relaxation',
        'Build strength gradually'
      ]
    }
  }
  
  return techniques[technique] || techniques['posture']
}

// Ensemble Guides
export const getEnsembleGuide = (type: string): EnsembleGuide => {
  const guides: Record<string, EnsembleGuide> = {
    'Orchestra': {
      type: 'Orchestra',
      description: 'Large ensemble with strings, winds, brass, and percussion',
      instrumentation: ['Strings', 'Woodwinds', 'Brass', 'Percussion'],
      roles: [
        {
          role: 'Conductor',
          responsibilities: ['Set tempo', 'Cue entrances', 'Shape interpretation', 'Balance sections']
        },
        {
          role: 'Section Leader',
          responsibilities: ['Lead section', 'Ensure intonation', 'Coordinate bowings', 'Communicate with conductor']
        },
        {
          role: 'Musician',
          responsibilities: ['Follow conductor', 'Listen to others', 'Maintain rhythm', 'Blend with section']
        }
      ],
      rehearsalTechniques: [
        'Full ensemble warm-up',
        'Sectional rehearsals',
        'Full ensemble run-through',
        'Detail work on difficult passages',
        'Balance and blend exercises'
      ],
      performanceTips: [
        'Watch conductor closely',
        'Listen across sections',
        'Maintain consistent tempo',
        'Balance dynamics',
        'Stay focused throughout'
      ],
      commonChallenges: [
        'Intonation across sections',
        'Rhythm synchronization',
        'Dynamic balance',
        'Tempo consistency'
      ],
      solutions: [
        'Regular tuning',
        'Metronome practice',
        'Balance exercises',
        'Clear conducting'
      ]
    },
    'Choir': {
      type: 'Choir',
      description: 'Vocal ensemble with multiple voice parts',
      instrumentation: ['Soprano', 'Alto', 'Tenor', 'Bass'],
      roles: [
        {
          role: 'Conductor',
          responsibilities: ['Shape interpretation', 'Cue entrances', 'Balance voices', 'Guide expression']
        },
        {
          role: 'Section Leader',
          responsibilities: ['Lead section', 'Ensure pitch accuracy', 'Model tone', 'Support others']
        },
        {
          role: 'Singer',
          responsibilities: ['Blend with section', 'Follow conductor', 'Maintain pitch', 'Express text']
        }
      ],
      rehearsalTechniques: [
        'Vocal warm-ups',
        'Sectional rehearsals',
        'Full choir practice',
        'Text work',
        'Diction exercises'
      ],
      performanceTips: [
        'Unified vowel sounds',
        'Clear consonants',
        'Expressive text delivery',
        'Dynamic contrast',
        'Emotional connection'
      ],
      commonChallenges: [
        'Pitch accuracy',
        'Vowel unification',
        'Blend and balance',
        'Text clarity'
      ],
      solutions: [
        'Regular pitch matching',
        'Vowel exercises',
        'Balance awareness',
        'Diction practice'
      ]
    }
  }
  
  return guides[type] || guides['Orchestra']
}

// Pedagogical Methods
export const getPedagogicalMethods = (): PedagogicalMethod[] => [
  {
    id: 'dalcroze',
    name: 'Dalcroze Eurhythmics',
    founder: 'Émile Jaques-Dalcroze',
    description: 'Teaching music through movement, connecting physical experience with musical understanding',
    keyPrinciples: [
      'Movement-based learning',
      'Rhythm through body movement',
      'Kinesthetic understanding',
      'Improvisation through movement',
      'Physical expression of music'
    ],
    teachingStrategies: [
      'Walk to the beat',
      'Express dynamics through movement',
      'Show phrase structure with body',
      'Improvise movements to music',
      'Connect movement to notation'
    ],
    activities: [
      'Rhythm walking',
      'Movement improvisation',
      'Body percussion',
      'Movement to music',
      'Conducting patterns'
    ],
    benefits: [
      'Deep physical understanding',
      'Improved rhythm',
      'Enhanced musical expression',
      'Kinesthetic learning',
      'Engaging and fun'
    ],
    applications: [
      'Elementary music education',
      'Rhythm training',
      'Musical expression',
      'Ensemble coordination',
      'Music therapy'
    ]
  },
  {
    id: 'kodaly',
    name: 'Kodaly Method',
    founder: 'Zoltán Kodály',
    description: 'Sequential music education using solfege, hand signs, and folk music',
    keyPrinciples: [
      'Solfege system (do-re-mi)',
      'Hand signs for pitches',
      'Folk music foundation',
      'Sequential learning',
      'Singing first approach'
    ],
    teachingStrategies: [
      'Use solfege syllables',
      'Hand signs for visual aid',
      'Start with simple folk songs',
      'Build complexity gradually',
      'Emphasize singing'
    ],
    activities: [
      'Solfege exercises',
      'Hand sign practice',
      'Folk song singing',
      'Interval training',
      'Rhythm syllables'
    ],
    benefits: [
      'Strong pitch sense',
      'Visual learning support',
      'Cultural appreciation',
      'Sequential skill building',
      'Accessible to all'
    ],
    applications: [
      'Elementary music',
      'Choral education',
      'Ear training',
      'Music literacy',
      'General music classes'
    ]
  },
  {
    id: 'orff',
    name: 'Orff Schulwerk',
    founder: 'Carl Orff',
    description: 'Elemental music education through play, movement, and improvisation',
    keyPrinciples: [
      'Elemental music',
      'Play-based learning',
      'Improvisation',
      'Movement and dance',
      'Instrumental play'
    ],
    teachingStrategies: [
      'Start with speech patterns',
      'Add body percussion',
      'Introduce instruments',
      'Encourage improvisation',
      'Combine with movement'
    ],
    activities: [
      'Body percussion',
      'Orff instruments',
      'Movement games',
      'Improvisation exercises',
      'Ensemble playing'
    ],
    benefits: [
      'Creative expression',
      'Active participation',
      'Musical creativity',
      'Social interaction',
      'Joyful learning'
    ],
    applications: [
      'Elementary music',
      'General music classes',
      'Creative music making',
      'Ensemble work',
      'Music therapy'
    ]
  },
  {
    id: 'suzuki',
    name: 'Suzuki Method',
    founder: 'Shinichi Suzuki',
    description: 'Mother-tongue approach emphasizing listening, repetition, and parent involvement',
    keyPrinciples: [
      'Listening first',
      'Parent involvement',
      'Repetition and review',
      'Sequential repertoire',
      'Nurturing environment'
    ],
    teachingStrategies: [
      'Extensive listening',
      'Learn by ear first',
      'Parent participation',
      'Review old pieces',
      'Positive reinforcement'
    ],
    activities: [
      'Daily listening',
      'Repetition practice',
      'Group classes',
      'Parent-child practice',
      'Recital preparation'
    ],
    benefits: [
      'Early start possible',
      'Strong listening skills',
      'Parent-child bonding',
      'Confidence building',
      'Musical sensitivity'
    ],
    applications: [
      'Private lessons',
      'Group instruction',
      'Early childhood music',
      'String education',
      'Parent-child programs'
    ]
  }
]

// Music Games
export const getMusicGames = (category: string): MusicGame[] => {
  const games: Record<string, MusicGame[]> = {
    'theory': [
      {
        id: 'note-ninja',
        name: 'Note Ninja',
        category: 'theory',
        description: 'Fast-paced note identification game',
        objectives: ['Identify notes quickly', 'Improve note reading', 'Build speed'],
        rules: [
          'Notes appear on staff',
          'Select correct note name',
          'Score points for correct answers',
          'Speed increases with level'
        ],
        difficulty: 'beginner',
        duration: '5-10 minutes'
      },
      {
        id: 'chord-builder',
        name: 'Chord Builder Challenge',
        category: 'theory',
        description: 'Build chords by selecting correct notes',
        objectives: ['Understand chord construction', 'Learn chord types', 'Practice intervals'],
        rules: [
          'Given root note',
          'Select third and fifth',
          'Build major, minor, diminished, augmented',
          'Score for correct chords'
        ],
        difficulty: 'intermediate',
        duration: '10-15 minutes'
      }
    ],
    'ear-training': [
      {
        id: 'interval-hero',
        name: 'Interval Hero',
        category: 'ear-training',
        description: 'Identify intervals by ear',
        objectives: ['Recognize intervals', 'Develop relative pitch', 'Improve listening'],
        rules: [
          'Listen to interval',
          'Select interval name',
          'Start with simple intervals',
          'Progress to complex intervals'
        ],
        difficulty: 'intermediate',
        duration: '10-15 minutes'
      },
      {
        id: 'pitch-perfect',
        name: 'Pitch Perfect',
        category: 'ear-training',
        description: 'Match pitches and identify notes',
        objectives: ['Develop pitch recognition', 'Improve intonation', 'Train ear'],
        rules: [
          'Listen to note',
          'Sing or play matching pitch',
          'Get feedback on accuracy',
          'Progress through levels'
        ],
        difficulty: 'beginner',
        duration: '5-10 minutes'
      }
    ],
    'rhythm': [
      {
        id: 'rhythm-race',
        name: 'Rhythm Race',
        category: 'rhythm',
        description: 'Tap rhythms accurately to win',
        objectives: ['Practice rhythm reading', 'Improve timing', 'Develop coordination'],
        rules: [
          'See rhythm notation',
          'Tap rhythm accurately',
          'Score for correct timing',
          'Race against time'
        ],
        difficulty: 'beginner',
        duration: '5-10 minutes'
      }
    ]
  }
  
  return games[category] || games['theory']
}

// Music Standards
export const getMusicStandards = (): MusicStandard[] => [
  {
    id: 'isme',
    name: 'ISME Standards',
    organization: 'International Society for Music Education',
    region: 'Global',
    description: 'International standards for music education promoting quality music education worldwide',
    keyComponents: [
      'Music for all',
      'Qualified teachers',
      'Accessible resources',
      'Cultural diversity',
      'Lifelong learning'
    ],
    gradeLevels: ['All levels'],
    assessmentCriteria: [
      'Musical understanding',
      'Performance skills',
      'Creative expression',
      'Cultural awareness',
      'Lifelong engagement'
    ]
  },
  {
    id: 'ism',
    name: 'ISM Curriculum Framework',
    organization: 'Independent Society of Musicians',
    region: 'UK',
    description: 'Comprehensive curriculum framework for primary and secondary music education',
    keyComponents: [
      'Performing',
      'Composing',
      'Listening',
      'Appraising',
      'Musical knowledge'
    ],
    gradeLevels: ['Primary', 'Secondary'],
    assessmentCriteria: [
      'Technical skills',
      'Musical understanding',
      'Creative expression',
      'Critical listening',
      'Musical knowledge'
    ]
  },
  {
    id: 'nafme',
    name: 'NAfME Standards',
    organization: 'National Association for Music Education',
    region: 'United States',
    description: 'National standards for music education in the United States',
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
      'Musical analysis',
      'Cultural connections',
      'Musical literacy'
    ]
  }
]

// Get instruments
export const getInstruments = () => [
  'Piano',
  'Voice',
  'Violin',
  'Viola',
  'Cello',
  'Bass',
  'Flute',
  'Clarinet',
  'Saxophone',
  'Trumpet',
  'Trombone',
  'French Horn',
  'Tuba',
  'Percussion',
  'Guitar',
  'Drums'
]

// Get music styles
export const getMusicStyles = () => [
  'Classical',
  'Jazz',
  'Popular',
  'World Music',
  'Folk',
  'Electronic',
  'Rock',
  'Blues'
]

// Get ensemble types
export const getEnsembleTypes = () => [
  'Orchestra',
  'Band',
  'Choir',
  'Chamber Group',
  'Jazz Ensemble',
  'World Music Ensemble',
  'Rock Band',
  'Percussion Ensemble'
]

// Get game categories
export const getGameCategories = () => [
  'Theory',
  'Ear Training',
  'Rhythm',
  'Composition'
]

// Get theory categories
export const getTheoryCategories = () => [
  'Major Scale',
  'Triads',
  'Time Signatures',
  'Intervals',
  'Chord Progressions',
  'Modes'
]




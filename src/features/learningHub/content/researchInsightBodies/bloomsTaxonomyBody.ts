/** Structured body for Blooms taxonomy research insight (render-only data). */

export interface BloomsCognitiveLevel {
  level: string
  verb: string
  description: string
  exampleVerbs: string[]
  classroomExamples: string[]
  assessmentIdeas: string[]
  modernApplications: string[]
}

export interface BloomsLessonExample {
  subject: string
  grade: string
  objective: string
  bloomLevel: string
  activities: string[]
  assessment: string
}

export interface BloomsResearchEvidence {
  finding: string
  source: string
  evidence: string
  practicalTip: string
}

export interface BloomsTaxonomyBody {
  sidebarNav: Array<{ id: string; label: string; icon: 'Eye' | 'Layers' | 'Target' | 'FileText' | 'Zap' }>
  overview: {
    sectionTitle: string
    paragraphs: string[]
    whyItMatters: string[]
  }
  cognitiveLevels: BloomsCognitiveLevel[]
  lessonExamples: BloomsLessonExample[]
  researchEvidence: BloomsResearchEvidence[]
  quickTips: string[]
  applications: {
    lessonPlanningSteps: string[]
    differentiationStrategies: Array<{ strategy: string; description: string; example: string }>
  }
  assessment: {
    goldenRuleLead: string
    goldenRuleSupport: string
    checklist: string[]
  }
  modern: {
    pageTitle: string
    digitalTitle: string
    digitalIntro: string
    digitalLevels: Array<{ level: string; digital: string; tools: string }>
    integrationTips: string[]
  }
  cta: {
    title: string
    description: string
    primaryPath: string
    primaryLabel: string
    secondaryPath: string
    secondaryLabel: string
  }
}

export const bloomsTaxonomyBody: BloomsTaxonomyBody = {
  sidebarNav: [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'levels', label: 'Cognitive Levels', icon: 'Layers' },
    { id: 'applications', label: 'Classroom Applications', icon: 'Target' },
    { id: 'assessment', label: 'Assessment Design', icon: 'FileText' },
    { id: 'modern', label: 'Modern Updates', icon: 'Zap' },
  ],
  overview: {
    sectionTitle: "What is Bloom's Taxonomy?",
    paragraphs: [
      "Bloom's Taxonomy is a framework for categorizing educational goals and objectives into levels of complexity. Originally developed by Benjamin Bloom in 1956, it was revised in 2001 by Anderson and Krathwohl to better reflect 21st-century learning needs. The taxonomy helps teachers design lessons that move students from basic recall to higher-order thinking skills.",
      "Think of Bloom's Taxonomy as a ladder: students start at the bottom (remembering facts) and climb up to creating new knowledge. Each level builds on the previous one, making it essential to scaffold instruction appropriately.",
    ],
    whyItMatters: [
      'Helps you write clear, measurable learning objectives',
      'Guides lesson planning to ensure appropriate challenge levels',
      'Ensures assessments match learning objectives',
      'Supports differentiation by providing multiple entry points',
      'Encourages higher-order thinking skills essential for modern learners',
    ],
  },
  cognitiveLevels: [
    {
      level: 'Remember',
      verb: 'Recall',
      description:
        'Retrieving relevant knowledge from long-term memory. Students recognize and recall facts, terms, and basic concepts.',
      exampleVerbs: ['Define', 'List', 'Identify', 'Name', 'Recall', 'Recognize', 'Match', 'Select'],
      classroomExamples: [
        'List the states of matter',
        'Define photosynthesis',
        'Identify the main characters in a story',
        'Recall multiplication tables',
        'Name the parts of a plant',
      ],
      assessmentIdeas: [
        'Multiple choice questions',
        'Fill-in-the-blank exercises',
        'Matching activities',
        'Flashcard quizzes',
        'Labeling diagrams',
      ],
      modernApplications: [
        'Digital flashcards (Quizlet, Anki)',
        'Gamified recall games',
        'Spaced repetition systems',
        'Quick knowledge checks via polling apps',
      ],
    },
    {
      level: 'Understand',
      verb: 'Comprehend',
      description:
        'Constructing meaning from instructional messages. Students can explain ideas or concepts in their own words.',
      exampleVerbs: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast', 'Paraphrase'],
      classroomExamples: [
        'Explain how the water cycle works',
        'Summarize the main idea of a passage',
        'Compare and contrast two historical events',
        'Describe the process of photosynthesis',
        'Interpret data from a graph',
      ],
      assessmentIdeas: [
        'Exit tickets asking "in your own words"',
        'Summary paragraphs',
        'Concept maps',
        'Think-pair-share explanations',
        'One-minute papers',
      ],
      modernApplications: [
        'Video explanations (Flipgrid, Loom)',
        'Digital concept mapping tools',
        'Collaborative annotation platforms',
        'Peer explanation activities',
      ],
    },
    {
      level: 'Apply',
      verb: 'Use',
      description:
        'Carrying out or using a procedure in a given situation. Students use information in new situations.',
      exampleVerbs: ['Solve', 'Use', 'Demonstrate', 'Calculate', 'Apply', 'Execute', 'Implement', 'Construct'],
      classroomExamples: [
        'Solve word problems using multiplication',
        'Apply grammar rules to write sentences',
        'Use the scientific method to conduct an experiment',
        'Calculate the area of different shapes',
        'Demonstrate a math concept using manipulatives',
      ],
      assessmentIdeas: [
        'Problem-solving tasks',
        'Performance assessments',
        'Lab reports',
        'Application worksheets',
        'Real-world scenario problems',
      ],
      modernApplications: [
        'Simulation software',
        'Virtual labs',
        'Coding projects',
        'Interactive problem-solving platforms',
        'Project-based learning tools',
      ],
    },
    {
      level: 'Analyze',
      verb: 'Examine',
      description:
        'Breaking material into constituent parts and determining how parts relate to one another. Students can see patterns and organize parts.',
      exampleVerbs: ['Analyze', 'Compare', 'Organize', 'Deconstruct', 'Examine', 'Investigate', 'Differentiate', 'Distinguish'],
      classroomExamples: [
        'Analyze the causes of World War II',
        'Compare different literary themes',
        'Examine the structure of an argument',
        'Investigate patterns in data',
        'Organize information into categories',
      ],
      assessmentIdeas: ['Graphic organizers', 'Venn diagrams', 'Case studies', 'Data analysis tasks', 'Text analysis essays'],
      modernApplications: [
        'Data visualization tools',
        'Collaborative analysis platforms',
        'Digital annotation tools',
        'Infographic creation',
        'Comparative analysis software',
      ],
    },
    {
      level: 'Evaluate',
      verb: 'Judge',
      description:
        'Making judgments based on criteria and standards. Students can critique, justify, and defend positions.',
      exampleVerbs: ['Evaluate', 'Critique', 'Judge', 'Justify', 'Defend', 'Appraise', 'Argue', 'Support'],
      classroomExamples: [
        'Evaluate the effectiveness of a solution',
        'Critique a piece of writing',
        'Judge the credibility of sources',
        'Justify your answer with evidence',
        'Defend your position in a debate',
      ],
      assessmentIdeas: [
        'Peer review activities',
        'Debates',
        'Rubric-based evaluations',
        'Critique essays',
        'Self-assessment reflections',
      ],
      modernApplications: [
        'Peer review platforms',
        'Debate forums',
        'Rubric-based assessment tools',
        'Collaborative evaluation projects',
        'Digital portfolios',
      ],
    },
    {
      level: 'Create',
      verb: 'Produce',
      description:
        'Putting elements together to form a coherent or functional whole. Students can generate, plan, and produce new products.',
      exampleVerbs: ['Create', 'Design', 'Invent', 'Compose', 'Construct', 'Produce', 'Develop', 'Formulate'],
      classroomExamples: [
        'Create a story using vocabulary words',
        'Design a solution to an environmental problem',
        'Invent a new product',
        'Compose a song about a historical event',
        'Develop a research project',
      ],
      assessmentIdeas: [
        'Portfolio projects',
        'Creative presentations',
        'Design challenges',
        'Research projects',
        'Multimedia creations',
      ],
      modernApplications: [
        'Digital storytelling tools',
        '3D modeling software',
        'Video creation platforms',
        'Coding projects',
        'Multimedia presentation tools',
      ],
    },
  ],
  lessonExamples: [
    {
      subject: 'Science',
      grade: '5th Grade',
      objective: 'Students will understand the water cycle',
      bloomLevel: 'Understand',
      activities: [
        'Watch a video explaining the water cycle',
        'Create a labeled diagram',
        'Write a paragraph describing the process',
        'Participate in a hands-on demonstration',
      ],
      assessment: 'Exit ticket: Explain the water cycle in your own words',
    },
    {
      subject: 'Math',
      grade: '7th Grade',
      objective: 'Students will solve real-world problems using percentages',
      bloomLevel: 'Apply',
      activities: [
        'Review percentage calculation methods',
        'Practice with guided examples',
        'Solve word problems in small groups',
        'Create their own percentage problem',
      ],
      assessment: 'Performance task: Calculate discounts and sales tax for a shopping scenario',
    },
    {
      subject: 'English Language Arts',
      grade: '9th Grade',
      objective: 'Students will analyze themes in literature',
      bloomLevel: 'Analyze',
      activities: [
        'Read and annotate a short story',
        'Identify recurring themes',
        'Compare themes across multiple texts',
        'Create a theme analysis essay',
      ],
      assessment: 'Essay: Analyze how the author develops a central theme',
    },
    {
      subject: 'Social Studies',
      grade: '11th Grade',
      objective: 'Students will evaluate historical sources',
      bloomLevel: 'Evaluate',
      activities: [
        'Examine primary source documents',
        'Compare different perspectives',
        'Assess source credibility',
        'Defend a historical interpretation',
      ],
      assessment: 'Research project: Evaluate the reliability of sources and defend your thesis',
    },
  ],
  researchEvidence: [
    {
      finding: 'Higher-order thinking improves retention',
      source: 'Anderson & Krathwohl (2001)',
      evidence:
        'Students who engage in analysis, evaluation, and creation activities show 40% better long-term retention compared to rote memorization.',
      practicalTip: 'Balance lower and higher-order thinking in your lessons',
    },
    {
      finding: 'Scaffolding is essential',
      source: 'Vygotsky (1978)',
      evidence:
        'Students need support to move from lower to higher cognitive levels. Effective scaffolding can increase achievement by 30%.',
      practicalTip: 'Start with remember/understand, then gradually increase complexity',
    },
    {
      finding: 'Assessment alignment matters',
      source: 'Wiggins & McTighe (2005)',
      evidence:
        'When assessments align with learning objectives at the same Bloom level, student performance improves significantly.',
      practicalTip: 'Match your assessment verbs to your learning objective verbs',
    },
    {
      finding: 'Modern classrooms need updated verbs',
      source: 'Churches (2008)',
      evidence:
        'Digital Bloom\'s Taxonomy adds verbs like "blogging," "podcasting," and "programming" to reflect 21st-century skills.',
      practicalTip: 'Incorporate digital tools that align with higher-order thinking',
    },
  ],
  quickTips: [
    'Start with lower levels (Remember, Understand) before moving to higher levels',
    "Use action verbs from Bloom's Taxonomy in your learning objectives",
    'Design assessments that match the cognitive level of your objectives',
    'Provide scaffolding to help students reach higher cognitive levels',
    "Balance your lessons across all levels - don't stay only at lower levels",
    "Use Bloom's Taxonomy to differentiate instruction for diverse learners",
    'Encourage students to create products that demonstrate higher-order thinking',
    'Reflect on your lessons: Are you challenging students at appropriate levels?',
  ],
  applications: {
    lessonPlanningSteps: [
      'Identify your learning objective and determine the appropriate Bloom level',
      'Choose action verbs that match that cognitive level',
      'Design activities that align with the chosen level',
      'Create assessments that measure understanding at the same level',
      'Consider scaffolding: start lower and build up',
    ],
    differentiationStrategies: [
      {
        strategy: 'Tiered Activities',
        description: 'Same concept, different complexity levels',
        example: 'Remember: List facts. Understand: Explain concepts. Apply: Solve problems.',
      },
      {
        strategy: 'Choice Boards',
        description: 'Students choose activities at their level',
        example: 'Offer 3 activities at different Bloom levels, let students choose 2.',
      },
      {
        strategy: 'Scaffolded Progression',
        description: 'Start low, build up gradually',
        example: 'Begin with Remember, move to Understand, then Apply.',
      },
    ],
  },
  assessment: {
    goldenRuleLead: 'Your assessment should match the cognitive level of your learning objective.',
    goldenRuleSupport:
      'If your objective uses "analyze," your assessment should require analysis, not just recall.',
    checklist: [
      'Does my assessment verb match my objective verb?',
      'Are students demonstrating the same cognitive level in assessment as in learning?',
      'Have I provided appropriate scaffolding for the assessment level?',
      'Can students at different readiness levels access the assessment?',
      'Does the assessment measure what I intended to measure?',
    ],
  },
  modern: {
    pageTitle: "Bloom's Taxonomy for the 21st Century",
    digitalTitle: "Digital Bloom's Taxonomy",
    digitalIntro:
      "Andrew Churches updated Bloom's Taxonomy to include digital skills and tools. This modern version recognizes that students need to create, collaborate, and communicate using technology.",
    digitalLevels: [
      { level: 'Remember', digital: 'Bookmarking, searching, googling', tools: 'Google, Wikipedia, databases' },
      { level: 'Understand', digital: 'Annotating, blogging, commenting', tools: 'Blogs, forums, social media' },
      { level: 'Apply', digital: 'Running, playing, uploading', tools: 'Simulations, games, applications' },
      { level: 'Analyze', digital: 'Mashing, linking, validating', tools: 'Data analysis tools, spreadsheets' },
      { level: 'Evaluate', digital: 'Blog commenting, reviewing, posting', tools: 'Peer review platforms, forums' },
      { level: 'Create', digital: 'Programming, filming, animating', tools: 'Video editors, coding platforms, design tools' },
    ],
    integrationTips: [
      'Use digital tools that align with higher-order thinking (e.g., coding for Create level)',
      'Encourage collaboration through digital platforms',
      'Leverage multimedia for different learning styles',
      'Use digital portfolios to showcase student creation',
      'Incorporate real-world digital skills students will need',
    ],
  },
  cta: {
    title: "Ready to Apply Bloom's Taxonomy?",
    description: "Use our lesson planner to create Bloom's-aligned lessons with AI assistance",
    primaryPath: '/templates/general-lesson-planner',
    primaryLabel: 'Create a Lesson Plan',
    secondaryPath: '/learning-hub',
    secondaryLabel: 'Explore More Research',
  },
}

// Digital Literacy Advisor Utilities - International Standards Focus

export interface DigitalCitizenshipStandard {
  id: string
  name: string
  organization: string
  region: string
  description: string
  keyComponents: string[]
  gradeLevels: string[]
  competencies: {
    competency: string
    description: string
    indicators: string[]
  }[]
}

export interface OnlineSafetyGuideline {
  id: string
  topic: string
  description: string
  risks: string[]
  preventionStrategies: string[]
  responseActions: string[]
  resources: string[]
  ageAppropriate: string[]
}

export interface MediaLiteracyConcept {
  id: string
  concept: string
  description: string
  keySkills: string[]
  activities: string[]
  assessmentCriteria: string[]
  realWorldExamples: string[]
}

export interface TechnologyIntegrationStrategy {
  id: string
  strategy: string
  description: string
  tools: string[]
  implementationSteps: string[]
  benefits: string[]
  challenges: string[]
  bestPractices: string[]
  gradeLevels: string[]
}

export interface DigitalCitizenshipLesson {
  title: string
  gradeLevel: string
  duration: string
  learningObjectives: string[]
  activities: {
    activity: string
    description: string
    duration: string
  }[]
  assessment: string[]
  resources: string[]
  standardsAlignment: string[]
}

export interface DigitalSafetyPlan {
  topic: string
  gradeLevel: string
  preventionStrategies: string[]
  detectionMethods: string[]
  responseProtocol: string[]
  resources: string[]
  parentCommunication: string[]
}

// International Standards
export const getDigitalCitizenshipStandards = (): DigitalCitizenshipStandard[] => [
  {
    id: 'iste-digital-citizen',
    name: 'ISTE Digital Citizen Standard',
    organization: 'International Society for Technology in Education (ISTE)',
    region: 'Global',
    description: 'Students recognize the rights, responsibilities and opportunities of living, learning and working in an interconnected digital world, and they act and model in ways that are safe, legal and ethical.',
    keyComponents: [
      'Digital Identity',
      'Digital Privacy',
      'Digital Footprint',
      'Online Behavior',
      'Intellectual Property',
      'Cybersecurity'
    ],
    gradeLevels: ['K-12'],
    competencies: [
      {
        competency: 'Digital Identity',
        description: 'Students cultivate and manage their digital identity and reputation and are aware of the permanence of their actions in the digital world.',
        indicators: [
          'Understands digital identity',
          'Manages online reputation',
          'Recognizes permanence of digital actions',
          'Demonstrates positive digital presence'
        ]
      },
      {
        competency: 'Digital Privacy',
        description: 'Students manage their personal data to maintain digital privacy and security and are aware of data-collection technology used to track their navigation online.',
        indicators: [
          'Protects personal information',
          'Understands data collection',
          'Uses privacy settings',
          'Recognizes tracking technologies'
        ]
      },
      {
        competency: 'Intellectual Property',
        description: 'Students understand the rights, responsibilities and opportunities of living, learning and working in an interconnected digital world.',
        indicators: [
          'Respects copyright',
          'Cites sources properly',
          'Understands fair use',
          'Creates original content'
        ]
      }
    ]
  },
  {
    id: 'unesco-mil',
    name: 'UNESCO Media and Information Literacy',
    organization: 'United Nations Educational, Scientific and Cultural Organization',
    region: 'Global',
    description: 'A framework for empowering people to access, retrieve, understand, evaluate and use, create, as well as share information and media content in all formats.',
    keyComponents: [
      'Access to Information',
      'Evaluation of Information',
      'Creation of Content',
      'Ethical Use',
      'Critical Thinking',
      'Media Analysis'
    ],
    gradeLevels: ['All levels'],
    competencies: [
      {
        competency: 'Access and Retrieve',
        description: 'Ability to locate and access information and media content.',
        indicators: [
          'Uses search strategies effectively',
          'Evaluates information sources',
          'Accesses diverse media formats',
          'Understands information architecture'
        ]
      },
      {
        competency: 'Evaluate and Analyze',
        description: 'Ability to critically evaluate information and media content.',
        indicators: [
          'Assesses credibility',
          'Identifies bias',
          'Recognizes misinformation',
          'Analyzes media messages'
        ]
      },
      {
        competency: 'Create and Share',
        description: 'Ability to create and share information and media content ethically.',
        indicators: [
          'Creates original content',
          'Uses appropriate tools',
          'Shares responsibly',
          'Respects intellectual property'
        ]
      }
    ]
  },
  {
    id: 'digcomp',
    name: 'Digital Competence Framework (DigComp)',
    organization: 'European Commission',
    region: 'European Union',
    description: 'A framework describing what it means to be digitally competent in five areas: information and data literacy, communication and collaboration, digital content creation, safety, and problem solving.',
    keyComponents: [
      'Information and Data Literacy',
      'Communication and Collaboration',
      'Digital Content Creation',
      'Safety',
      'Problem Solving'
    ],
    gradeLevels: ['All levels'],
    competencies: [
      {
        competency: 'Information and Data Literacy',
        description: 'Browsing, searching and filtering data, information and digital content.',
        indicators: [
          'Effective search strategies',
          'Information evaluation',
          'Data management',
          'Critical information consumption'
        ]
      },
      {
        competency: 'Safety',
        description: 'Protecting devices, personal data, health, and the environment.',
        indicators: [
          'Device protection',
          'Personal data protection',
          'Health and well-being',
          'Environmental awareness'
        ]
      },
      {
        competency: 'Problem Solving',
        description: 'Identifying needs and technological responses, creatively using digital technologies.',
        indicators: [
          'Technical problem solving',
          'Creative use of technology',
          'Identifying digital competence gaps',
          'Innovation and creativity'
        ]
      }
    ]
  },
  {
    id: 'common-sense',
    name: 'Common Sense Media Digital Citizenship',
    organization: 'Common Sense Media',
    region: 'United States (Global Application)',
    description: 'A comprehensive K-12 digital citizenship curriculum covering privacy, relationships, cyberbullying, news literacy, and more.',
    keyComponents: [
      'Media Balance & Well-Being',
      'Privacy & Security',
      'Digital Footprint & Identity',
      'Relationships & Communication',
      'Cyberbullying & Digital Drama',
      'News & Media Literacy'
    ],
    gradeLevels: ['K-12'],
    competencies: [
      {
        competency: 'Media Balance & Well-Being',
        description: 'Understanding how to balance media use and maintain well-being.',
        indicators: [
          'Recognizes healthy media habits',
          'Understands media impact on well-being',
          'Manages screen time',
          'Maintains balance'
        ]
      },
      {
        competency: 'Privacy & Security',
        description: 'Protecting personal information and understanding privacy settings.',
        indicators: [
          'Protects personal information',
          'Uses privacy settings',
          'Recognizes security threats',
          'Creates strong passwords'
        ]
      },
      {
        competency: 'Cyberbullying & Digital Drama',
        description: 'Understanding and preventing cyberbullying and digital drama.',
        indicators: [
          'Recognizes cyberbullying',
          'Responds appropriately',
          'Supports others',
          'Creates positive online culture'
        ]
      }
    ]
  }
]

// Online Safety Guidelines
export const getOnlineSafetyGuidelines = (): OnlineSafetyGuideline[] => [
  {
    id: 'cyberbullying',
    topic: 'Cyberbullying Prevention',
    description: 'Strategies to prevent, recognize, and respond to cyberbullying.',
    risks: [
      'Harassment through digital platforms',
      'Social exclusion online',
      'Sharing embarrassing content',
      'Impersonation or fake accounts',
      'Doxing (sharing private information)'
    ],
    preventionStrategies: [
      'Teach empathy and respect online',
      'Establish clear online behavior expectations',
      'Create positive online culture',
      'Monitor online interactions',
      'Encourage reporting mechanisms',
      'Promote digital citizenship education'
    ],
    responseActions: [
      'Document evidence',
      'Block and report offenders',
      'Contact platform administrators',
      'Inform school administration',
      'Contact law enforcement if necessary',
      'Provide support to victims',
      'Counsel both parties'
    ],
    resources: [
      'StopBullying.gov',
      'Common Sense Media resources',
      'Cyberbullying Research Center',
      'National Bullying Prevention Center'
    ],
    ageAppropriate: ['Elementary: Basic concepts', 'Middle: Recognition and response', 'High: Advanced prevention strategies']
  },
  {
    id: 'privacy',
    topic: 'Privacy Protection',
    description: 'Understanding and protecting personal information online.',
    risks: [
      'Identity theft',
      'Data breaches',
      'Location tracking',
      'Unauthorized data sharing',
      'Phishing attacks'
    ],
    preventionStrategies: [
      'Use strong, unique passwords',
      'Enable two-factor authentication',
      'Review privacy settings regularly',
      'Limit personal information sharing',
      'Be cautious with public Wi-Fi',
      'Use privacy-focused browsers',
      'Understand app permissions'
    ],
    responseActions: [
      'Change compromised passwords immediately',
      'Enable additional security measures',
      'Monitor accounts for suspicious activity',
      'Report data breaches',
      'Freeze credit if identity theft suspected',
      'Contact relevant authorities'
    ],
    resources: [
      'Privacy Rights Clearinghouse',
      'StaySafeOnline.org',
      'Common Sense Privacy Program',
      'GDPR guidelines'
    ],
    ageAppropriate: ['Elementary: Basic privacy concepts', 'Middle: Privacy settings management', 'High: Advanced privacy protection']
  },
  {
    id: 'misinformation',
    topic: 'Misinformation & Disinformation',
    description: 'Identifying and combating false information online.',
    risks: [
      'Believing false information',
      'Sharing misinformation',
      'Making decisions based on false data',
      'Erosion of trust in media',
      'Social division'
    ],
    preventionStrategies: [
      'Teach fact-checking skills',
      'Verify sources before sharing',
      'Understand bias and perspective',
      'Recognize common misinformation patterns',
      'Use fact-checking tools',
      'Develop critical thinking skills',
      'Understand algorithms and echo chambers'
    ],
    responseActions: [
      'Verify information before sharing',
      'Correct misinformation when safe',
      'Report false content to platforms',
      'Educate others about misinformation',
      'Support credible news sources',
      'Engage in media literacy education'
    ],
    resources: [
      'Snopes.com',
      'FactCheck.org',
      'PolitiFact',
      'MediaWise',
      'News Literacy Project'
    ],
    ageAppropriate: ['Elementary: Basic fact-checking', 'Middle: Source evaluation', 'High: Advanced media analysis']
  },
  {
    id: 'online-predators',
    topic: 'Online Predator Safety',
    description: 'Protecting against online predators and inappropriate contact.',
    risks: [
      'Grooming behaviors',
      'Inappropriate contact',
      'Sharing personal information',
      'Meeting strangers offline',
      'Manipulation and exploitation'
    ],
    preventionStrategies: [
      'Never share personal information online',
      'Never meet online friends in person without supervision',
      'Recognize grooming behaviors',
      'Understand that people online may not be who they claim',
      'Use privacy settings',
      'Report suspicious behavior',
      'Communicate with trusted adults'
    ],
    responseActions: [
      'Stop communication immediately',
      'Block the person',
      'Save evidence',
      'Report to platform',
      'Tell a trusted adult',
      'Contact law enforcement',
      'Contact National Center for Missing & Exploited Children'
    ],
    resources: [
      'NetSmartz',
      'FBI Safe Online Surfing',
      'National Center for Missing & Exploited Children',
      'Common Sense Media'
    ],
    ageAppropriate: ['Elementary: Stranger danger online', 'Middle: Recognizing manipulation', 'High: Advanced safety strategies']
  },
  {
    id: 'sexting',
    topic: 'Sexting & Inappropriate Content',
    description: 'Understanding the risks and consequences of sharing inappropriate content.',
    risks: [
      'Legal consequences',
      'Social and emotional harm',
      'Permanent digital footprint',
      'Blackmail and exploitation',
      'Impact on future opportunities'
    ],
    preventionStrategies: [
      'Understand legal consequences',
      'Recognize permanence of digital content',
      'Develop healthy relationship skills',
      'Understand consent',
      'Create safe spaces for discussion',
      'Promote positive body image',
      'Teach about digital permanence'
    ],
    responseActions: [
      'Do not forward or share content',
      'Report to trusted adult',
      'Contact law enforcement if necessary',
      'Seek counseling support',
      'Understand legal options',
      'Access support resources'
    ],
    resources: [
      'ThatsNotCool.com',
      'Love is Respect',
      'National Sexual Violence Resource Center',
      'Common Sense Media'
    ],
    ageAppropriate: ['Middle: Understanding consequences', 'High: Comprehensive education']
  }
]

// Media Literacy Concepts
export const getMediaLiteracyConcepts = (): MediaLiteracyConcept[] => [
  {
    id: 'source-evaluation',
    concept: 'Source Evaluation',
    description: 'Skills to evaluate the credibility, reliability, and bias of information sources.',
    keySkills: [
      'Identify author credentials',
      'Check publication date',
      'Evaluate source reputation',
      'Recognize bias and perspective',
      'Cross-reference information',
      'Identify primary vs. secondary sources'
    ],
    activities: [
      'CRAAP Test (Currency, Relevance, Authority, Accuracy, Purpose)',
      'Source comparison exercises',
      'Bias detection activities',
      'Fact-checking challenges',
      'Source credibility ranking'
    ],
    assessmentCriteria: [
      'Accurately identifies credible sources',
      'Recognizes bias and perspective',
      'Uses multiple sources',
      'Evaluates source authority',
      'Applies evaluation criteria consistently'
    ],
    realWorldExamples: [
      'Evaluating news articles',
      'Assessing social media posts',
      'Reviewing academic sources',
      'Analyzing advertisements',
      'Examining political content'
    ]
  },
  {
    id: 'misinformation-detection',
    concept: 'Misinformation Detection',
    description: 'Identifying false, misleading, or manipulated information.',
    keySkills: [
      'Recognize common misinformation patterns',
      'Identify manipulated images and videos',
      'Understand deepfakes and AI-generated content',
      'Recognize clickbait',
      'Identify conspiracy theories',
      'Understand confirmation bias'
    ],
    activities: [
      'Fact-checking exercises',
      'Image verification activities',
      'Deepfake detection challenges',
      'Misinformation analysis',
      'Reverse image search practice'
    ],
    assessmentCriteria: [
      'Accurately identifies misinformation',
      'Uses fact-checking tools effectively',
      'Recognizes manipulation techniques',
      'Applies critical thinking',
      'Verifies information before sharing'
    ],
    realWorldExamples: [
      'COVID-19 misinformation',
      'Election-related false claims',
      'Health misinformation',
      'Social media hoaxes',
      'Viral false stories'
    ]
  },
  {
    id: 'media-analysis',
    concept: 'Media Analysis',
    description: 'Understanding how media messages are constructed and their intended effects.',
    keySkills: [
      'Analyze media techniques',
      'Identify target audiences',
      'Recognize persuasive techniques',
      'Understand media production',
      'Analyze visual and audio elements',
      'Interpret media messages'
    ],
    activities: [
      'Advertisement analysis',
      'News deconstruction',
      'Social media post analysis',
      'Documentary analysis',
      'Media production projects'
    ],
    assessmentCriteria: [
      'Identifies media techniques',
      'Recognizes target audience',
      'Analyzes persuasive elements',
      'Interprets messages accurately',
      'Understands production techniques'
    ],
    realWorldExamples: [
      'Analyzing political ads',
      'Deconstructing news coverage',
      'Examining social media campaigns',
      'Reviewing documentary techniques',
      'Analyzing entertainment media'
    ]
  },
  {
    id: 'digital-storytelling',
    concept: 'Digital Storytelling',
    description: 'Creating and sharing digital content effectively and ethically.',
    keySkills: [
      'Plan and organize content',
      'Use appropriate digital tools',
      'Create engaging narratives',
      'Respect copyright and fair use',
      'Cite sources properly',
      'Consider audience and purpose'
    ],
    activities: [
      'Digital story creation',
      'Podcast production',
      'Video creation projects',
      'Blog writing',
      'Social media campaigns'
    ],
    assessmentCriteria: [
      'Creates engaging content',
      'Uses tools effectively',
      'Respects intellectual property',
      'Cites sources properly',
      'Considers audience',
      'Demonstrates technical skills'
    ],
    realWorldExamples: [
      'Student news production',
      'Educational video creation',
      'Social media content',
      'Podcast development',
      'Digital portfolios'
    ]
  },
  {
    id: 'algorithm-awareness',
    concept: 'Algorithm Awareness',
    description: 'Understanding how algorithms shape online experiences and information access.',
    keySkills: [
      'Understand how algorithms work',
      'Recognize filter bubbles',
      'Understand echo chambers',
      'Recognize algorithmic bias',
      'Diversify information sources',
      'Understand recommendation systems'
    ],
    activities: [
      'Algorithm exploration',
      'Filter bubble analysis',
      'Echo chamber identification',
      'Diverse source challenges',
      'Recommendation system analysis'
    ],
    assessmentCriteria: [
      'Understands algorithm impact',
      'Recognizes filter bubbles',
      'Diversifies information sources',
      'Identifies algorithmic bias',
      'Makes informed choices'
    ],
    realWorldExamples: [
      'Social media feeds',
      'Search engine results',
      'Video recommendations',
      'News algorithms',
      'Shopping recommendations'
    ]
  }
]

// Technology Integration Strategies
export const getTechnologyIntegrationStrategies = (): TechnologyIntegrationStrategy[] => [
  {
    id: 'flipped-classroom',
    strategy: 'Flipped Classroom',
    description: 'Students learn new content at home through videos and online resources, then apply knowledge in class.',
    tools: [
      'Video platforms (Khan Academy, Edpuzzle)',
      'Learning management systems',
      'Interactive videos',
      'Online quizzes',
      'Discussion forums'
    ],
    implementationSteps: [
      'Create or curate video content',
      'Set up learning management system',
      'Design pre-class activities',
      'Plan in-class application activities',
      'Provide access to resources',
      'Monitor student progress',
      'Facilitate in-class discussions'
    ],
    benefits: [
      'Self-paced learning',
      'More class time for application',
      'Increased student engagement',
      'Better use of class time',
      'Access to content anytime'
    ],
    challenges: [
      'Requires reliable internet access',
      'Student motivation',
      'Content creation time',
      'Technology access equity'
    ],
    bestPractices: [
      'Start with existing content',
      'Keep videos short (5-10 minutes)',
      'Include interactive elements',
      'Provide multiple access options',
      'Monitor completion',
      'Use class time effectively'
    ],
    gradeLevels: ['Middle School', 'High School', 'College']
  },
  {
    id: 'blended-learning',
    strategy: 'Blended Learning',
    description: 'Combining traditional face-to-face instruction with online learning activities.',
    tools: [
      'Learning management systems',
      'Online collaboration tools',
      'Digital assessment tools',
      'Multimedia resources',
      'Virtual field trips'
    ],
    implementationSteps: [
      'Identify learning objectives',
      'Select appropriate technology',
      'Design online and offline activities',
      'Create digital resources',
      'Train students on tools',
      'Monitor and adjust',
      'Assess effectiveness'
    ],
    benefits: [
      'Flexible learning',
      'Personalized pace',
      'Increased engagement',
      'Access to diverse resources',
      'Data-driven insights'
    ],
    challenges: [
      'Technology access',
      'Teacher training needs',
      'Time investment',
      'Student support',
      'Technical issues'
    ],
    bestPractices: [
      'Start small',
      'Provide clear instructions',
      'Offer technical support',
      'Balance online and offline',
      'Regular check-ins',
      'Use data to inform instruction'
    ],
    gradeLevels: ['All levels']
  },
  {
    id: 'project-based-learning',
    strategy: 'Project-Based Learning (PBL) with Technology',
    description: 'Using technology to support authentic, inquiry-based projects.',
    tools: [
      'Collaboration platforms (Google Workspace, Microsoft Teams)',
      'Research databases',
      'Presentation tools',
      'Video editing software',
      '3D modeling tools',
      'Coding platforms'
    ],
    implementationSteps: [
      'Define driving question',
      'Plan project timeline',
      'Select technology tools',
      'Provide research resources',
      'Facilitate collaboration',
      'Support creation process',
      'Plan presentation and reflection'
    ],
    benefits: [
      'Real-world application',
      '21st century skills',
      'Student ownership',
      'Collaboration skills',
      'Technology fluency'
    ],
    challenges: [
      'Time management',
      'Technology access',
      'Assessment complexity',
      'Group dynamics',
      'Technical support needs'
    ],
    bestPractices: [
      'Clear project guidelines',
      'Regular checkpoints',
      'Technology training',
      'Rubric-based assessment',
      'Celebrate process and product',
      'Reflection opportunities'
    ],
    gradeLevels: ['All levels']
  },
  {
    id: 'gamification',
    strategy: 'Gamification',
    description: 'Using game elements to increase engagement and motivation in learning.',
    tools: [
      'Kahoot!',
      'Quizizz',
      'Classcraft',
      'Duolingo',
      'Code.org',
      'Badge systems'
    ],
    implementationSteps: [
      'Identify learning objectives',
      'Select game elements (points, badges, levels)',
      'Choose appropriate platform',
      'Design game mechanics',
      'Implement in classroom',
      'Monitor engagement',
      'Adjust based on feedback'
    ],
    benefits: [
      'Increased motivation',
      'Immediate feedback',
      'Healthy competition',
      'Progress tracking',
      'Engaging learning experience'
    ],
    challenges: [
      'Overemphasis on rewards',
      'Equity concerns',
      'Distraction potential',
      'Platform costs',
      'Maintaining educational focus'
    ],
    bestPractices: [
      'Balance competition and collaboration',
      'Focus on learning, not just points',
      'Provide meaningful rewards',
      'Ensure accessibility',
      'Regular reflection',
      'Avoid over-gamification'
    ],
    gradeLevels: ['Elementary', 'Middle School', 'High School']
  },
  {
    id: 'adaptive-learning',
    strategy: 'Adaptive Learning',
    description: 'Using technology to personalize learning based on student performance and needs.',
    tools: [
      'Khan Academy',
      'DreamBox',
      'IXL',
      'ALEKS',
      'Smart Sparrow',
      'Adaptive assessment platforms'
    ],
    implementationSteps: [
      'Assess student needs',
      'Select adaptive platform',
      'Set learning goals',
      'Monitor student progress',
      'Provide interventions',
      'Adjust instruction',
      'Celebrate growth'
    ],
    benefits: [
      'Personalized learning',
      'Self-paced progress',
      'Targeted interventions',
      'Data-driven insights',
      'Increased engagement'
    ],
    challenges: [
      'Platform costs',
      'Technology access',
      'Student motivation',
      'Teacher training',
      'Data interpretation'
    ],
    bestPractices: [
      'Combine with teacher instruction',
      'Set clear expectations',
      'Monitor progress regularly',
      'Provide support',
      'Use data to inform instruction',
      'Maintain human connection'
    ],
    gradeLevels: ['Elementary', 'Middle School', 'High School']
  },
  {
    id: 'collaborative-learning',
    strategy: 'Collaborative Learning with Technology',
    description: 'Using digital tools to facilitate collaboration and communication among students.',
    tools: [
      'Google Workspace',
      'Microsoft Teams',
      'Padlet',
      'Miro',
      'Flipgrid',
      'Slack',
      'Zoom'
    ],
    implementationSteps: [
      'Define collaboration goals',
      'Select appropriate tools',
      'Train students on tools',
      'Design collaborative activities',
      'Establish norms and expectations',
      'Monitor collaboration',
      'Assess both process and product'
    ],
    benefits: [
      'Communication skills',
      'Teamwork abilities',
      'Diverse perspectives',
      'Real-world skills',
      'Increased engagement'
    ],
    challenges: [
      'Group dynamics',
      'Technology access',
      'Time management',
      'Assessment complexity',
      'Digital citizenship'
    ],
    bestPractices: [
      'Clear roles and responsibilities',
      'Establish collaboration norms',
      'Use structured protocols',
      'Provide regular feedback',
      'Celebrate collaboration',
      'Address conflicts promptly'
    ],
    gradeLevels: ['All levels']
  }
]

// Generate Digital Citizenship Lesson
export const generateDigitalCitizenshipLesson = (
  topic: string,
  gradeLevel: string,
  duration: string = '45 minutes'
): DigitalCitizenshipLesson => {
  return {
    title: `Digital Citizenship: ${topic}`,
    gradeLevel,
    duration,
    learningObjectives: [
      `Understand key concepts of ${topic}`,
      'Recognize responsibilities as digital citizens',
      'Apply digital citizenship principles',
      'Evaluate online behavior'
    ],
    activities: [
      {
        activity: 'Introduction and Discussion',
        description: `Introduce ${topic} through discussion and real-world examples`,
        duration: '10 minutes'
      },
      {
        activity: 'Interactive Activity',
        description: 'Engage students in hands-on activity related to the topic',
        duration: '20 minutes'
      },
      {
        activity: 'Reflection and Application',
        description: 'Students reflect on learning and create action plans',
        duration: '15 minutes'
      }
    ],
    assessment: [
      'Participation in discussions',
      'Completion of activities',
      'Reflection responses',
      'Application of concepts'
    ],
    resources: [
      'Common Sense Media resources',
      'ISTE Digital Citizen resources',
      'Relevant videos and articles',
      'Interactive tools'
    ],
    standardsAlignment: [
      'ISTE Digital Citizen',
      'Common Sense Media Digital Citizenship',
      'UNESCO Media and Information Literacy'
    ]
  }
}

// Generate Digital Safety Plan
export const generateDigitalSafetyPlan = (
  topic: string,
  gradeLevel: string
): DigitalSafetyPlan => {
  return {
    topic,
    gradeLevel,
    preventionStrategies: [
      'Education and awareness',
      'Clear policies and guidelines',
      'Regular monitoring',
      'Open communication',
      'Positive online culture'
    ],
    detectionMethods: [
      'Regular check-ins with students',
      'Monitoring online activity',
      'Student reporting mechanisms',
      'Parent communication',
      'Behavioral observations'
    ],
    responseProtocol: [
      'Document the incident',
      'Assess severity',
      'Provide immediate support',
      'Contact appropriate parties',
      'Follow school policies',
      'Implement interventions',
      'Monitor and follow up'
    ],
    resources: [
      'School counseling services',
      'Online safety organizations',
      'Law enforcement contacts',
      'Parent resources',
      'Support hotlines'
    ],
    parentCommunication: [
      'Inform parents of incident',
      'Provide resources and support',
      'Collaborate on solutions',
      'Maintain ongoing communication',
      'Share prevention strategies'
    ]
  }
}

// Get grade levels
export const getGradeLevels = () => [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College'
]

// Get digital citizenship topics
export const getDigitalCitizenshipTopics = () => [
  'Digital Footprint',
  'Online Privacy',
  'Cyberbullying',
  'Intellectual Property',
  'Online Safety',
  'Digital Identity',
  'Information Literacy',
  'Media Literacy'
]

// Get online safety topics
export const getOnlineSafetyTopics = () => [
  'Cyberbullying Prevention',
  'Privacy Protection',
  'Misinformation & Disinformation',
  'Online Predator Safety',
  'Sexting & Inappropriate Content',
  'Social Media Safety',
  'Gaming Safety',
  'Online Scams'
]




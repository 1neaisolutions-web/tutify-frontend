// Career Readiness Coach Utilities - International Standards Focus

export interface ResumeFormat {
  id: string
  name: string
  region: string
  description: string
  sections: string[]
  order: string[]
  length: string
  photo: boolean
  personalInfo: string[]
  keyDifferences: string[]
  bestFor: string[]
  exampleStructure: {
    section: string
    content: string[]
  }[]
}

export interface InterviewQuestion {
  id: string
  question: string
  category: string
  industry?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  culturalContext: string
  suggestedAnswer: {
    framework: string
    points: string[]
    example: string
  }
  commonMistakes: string[]
  tips: string[]
}

export interface NACECompetency {
  id: string
  name: string
  description: string
  proficiencyLevels: {
    level: string
    description: string
    indicators: string[]
  }[]
  developmentActivities: string[]
  evidenceExamples: string[]
  assessmentCriteria: string[]
}

export interface IndustryInsight {
  industry: string
  growthTrend: 'high' | 'moderate' | 'stable' | 'declining'
  globalOpportunities: string[]
  requiredSkills: string[]
  certifications: string[]
  salaryRange: {
    entry: string
    mid: string
    senior: string
  }
  careerPathways: {
    entry: string[]
    progression: string[]
    senior: string[]
  }
  geographicHotspots: string[]
  futureOutlook: string[]
}

export interface CareerPathway {
  career: string
  industry: string
  entryLevel: {
    education: string[]
    skills: string[]
    certifications: string[]
    experience: string[]
  }
  progression: {
    level: string
    years: string
    skills: string[]
    responsibilities: string[]
  }[]
  seniorLevel: {
    roles: string[]
    requirements: string[]
    compensation: string
  }
  alternativePaths: string[]
  internationalOpportunities: string[]
}

export interface LinkedInOptimization {
  profileSections: {
    section: string
    importance: string
    bestPractices: string[]
    examples: string[]
  }[]
  keywordStrategy: string[]
  networkingTips: string[]
  contentStrategy: string[]
  commonMistakes: string[]
}

export interface SkillsAssessment {
  competency: string
  currentLevel: string
  targetLevel: string
  gapAnalysis: string[]
  developmentPlan: {
    activity: string
    timeline: string
    resources: string[]
  }[]
  evidenceNeeded: string[]
}

// Resume Formats by Region
export const getResumeFormats = (): ResumeFormat[] => [
  {
    id: 'us-resume',
    name: 'US Resume',
    region: 'United States',
    description: 'Concise, achievement-focused format typically 1-2 pages',
    sections: ['Contact', 'Professional Summary', 'Experience', 'Education', 'Skills', 'Optional: Certifications, Awards'],
    order: ['Contact', 'Summary', 'Experience', 'Education', 'Skills'],
    length: '1-2 pages',
    photo: false,
    personalInfo: ['Name', 'Email', 'Phone', 'Location', 'LinkedIn'],
    keyDifferences: [
      'No photo required',
      'Focus on achievements and metrics',
      'Reverse chronological order',
      'Action verbs emphasized',
      'ATS-friendly formatting'
    ],
    bestFor: ['Corporate jobs', 'Tech industry', 'Finance', 'Consulting'],
    exampleStructure: [
      {
        section: 'Professional Summary',
        content: ['2-3 sentence overview', 'Key achievements', 'Relevant skills']
      },
      {
        section: 'Experience',
        content: ['Company, Title, Dates', 'Bullet points with metrics', 'Action verbs']
      }
    ]
  },
  {
    id: 'uk-cv',
    name: 'UK CV',
    region: 'United Kingdom',
    description: 'Comprehensive document, typically 2-3 pages, includes personal statement',
    sections: ['Contact', 'Personal Statement', 'Experience', 'Education', 'Skills', 'References'],
    order: ['Contact', 'Personal Statement', 'Experience', 'Education', 'Skills', 'References'],
    length: '2-3 pages',
    photo: false,
    personalInfo: ['Name', 'Address', 'Email', 'Phone', 'LinkedIn'],
    keyDifferences: [
      'Personal statement section',
      'References included',
      'More detailed descriptions',
      'Professional tone',
      'Education dates included'
    ],
    bestFor: ['UK job market', 'Academic positions', 'Public sector'],
    exampleStructure: [
      {
        section: 'Personal Statement',
        content: ['4-6 sentences', 'Career objectives', 'Key strengths']
      },
      {
        section: 'References',
        content: ['2-3 professional references', 'Contact information']
      }
    ]
  },
  {
    id: 'eu-cv',
    name: 'EU CV (Europass)',
    region: 'European Union',
    description: 'Standardized format across EU countries, includes photo',
    sections: ['Personal Information', 'Work Experience', 'Education', 'Skills', 'Languages', 'Additional Information'],
    order: ['Personal Information', 'Work Experience', 'Education', 'Skills', 'Languages'],
    length: '2-4 pages',
    photo: true,
    personalInfo: ['Name', 'Address', 'Email', 'Phone', 'Nationality', 'Date of Birth'],
    keyDifferences: [
      'Photo included',
      'Date of birth included',
      'Language proficiency levels',
      'Standardized format',
      'Personal information more detailed'
    ],
    bestFor: ['EU job market', 'Multilingual positions', 'International organizations'],
    exampleStructure: [
      {
        section: 'Languages',
        content: ['Proficiency levels (A1-C2)', 'CEFR framework', 'Certifications']
      },
      {
        section: 'Skills',
        content: ['Technical skills', 'Soft skills', 'Digital competencies']
      }
    ]
  },
  {
    id: 'asia-pacific',
    name: 'Asia-Pacific CV',
    region: 'Asia-Pacific',
    description: 'Varies by country, often includes photo and personal details',
    sections: ['Contact', 'Photo', 'Objective', 'Experience', 'Education', 'Skills', 'Personal Details'],
    order: ['Contact', 'Photo', 'Objective', 'Experience', 'Education', 'Skills'],
    length: '2-3 pages',
    photo: true,
    personalInfo: ['Name', 'Email', 'Phone', 'Address', 'Date of Birth', 'Nationality'],
    keyDifferences: [
      'Photo typically included',
      'Personal details common',
      'Objective statement',
      'Respect for hierarchy shown',
      'Education emphasized'
    ],
    bestFor: ['Asian markets', 'Japan', 'South Korea', 'Singapore', 'China'],
    exampleStructure: [
      {
        section: 'Objective',
        content: ['Career goals', 'Company alignment', 'Value proposition']
      },
      {
        section: 'Personal Details',
        content: ['Date of birth', 'Nationality', 'Visa status']
      }
    ]
  }
]

// Interview Questions Database
export const getInterviewQuestions = (category: string, industry?: string): InterviewQuestion[] => {
  const questions: Record<string, InterviewQuestion[]> = {
    'behavioral': [
      {
        id: 'tell-me-about-yourself',
        question: 'Tell me about yourself',
        category: 'behavioral',
        difficulty: 'beginner',
        culturalContext: 'Universal opening question, varies by region in expected detail level',
        suggestedAnswer: {
          framework: 'Present-Past-Future',
          points: [
            'Current role and key responsibilities',
            'Relevant background and experience',
            'Why you\'re interested in this position',
            'What you bring to the role'
          ],
          example: 'I\'m currently a [role] with [years] years of experience in [field]. I\'ve developed expertise in [skills] and have successfully [achievement]. I\'m excited about this opportunity because...'
        },
        commonMistakes: [
          'Giving life story',
          'Being too vague',
          'Not connecting to the role',
          'Talking too long'
        ],
        tips: [
          'Keep it 2-3 minutes',
          'Focus on professional background',
          'Connect to the job',
          'End with why you\'re interested'
        ]
      },
      {
        id: 'strengths-weaknesses',
        question: 'What are your strengths and weaknesses?',
        category: 'behavioral',
        difficulty: 'intermediate',
        culturalContext: 'US: Direct honesty expected. Asia: Modesty important. EU: Balanced approach',
        suggestedAnswer: {
          framework: 'Strengths: STAR, Weaknesses: Growth Mindset',
          points: [
            '2-3 relevant strengths with examples',
            '1-2 weaknesses showing self-awareness',
            'How you\'re working on weaknesses',
            'Turn weakness into growth opportunity'
          ],
          example: 'My strength is [skill] which I demonstrated when [example]. A weakness I\'ve identified is [weakness], and I\'ve been working on it by [action].'
        },
        commonMistakes: [
          'Listing too many weaknesses',
          'Not providing examples',
          'Being dishonest',
          'Not showing improvement'
        ],
        tips: [
          'Choose job-relevant strengths',
          'Show genuine self-awareness',
          'Demonstrate growth mindset',
          'Keep it balanced'
        ]
      },
      {
        id: 'why-should-we-hire-you',
        question: 'Why should we hire you?',
        category: 'behavioral',
        difficulty: 'advanced',
        culturalContext: 'US: Confident self-promotion. Asia: Humble but capable. EU: Value-focused',
        suggestedAnswer: {
          framework: 'Value Proposition',
          points: [
            'Unique combination of skills',
            'Relevant experience',
            'Cultural fit',
            'Specific contributions you\'ll make'
          ],
          example: 'You should hire me because I bring [unique combination] that directly addresses [company need]. My experience in [area] and ability to [skill] will help [specific outcome].'
        },
        commonMistakes: [
          'Being too generic',
          'Not researching the company',
          'Overpromising',
          'Not differentiating yourself'
        ],
        tips: [
          'Research the company thoroughly',
          'Connect your skills to their needs',
          'Be specific and confident',
          'Show enthusiasm'
        ]
      }
    ],
    'technical': [
      {
        id: 'problem-solving',
        question: 'Describe a complex problem you solved',
        category: 'technical',
        difficulty: 'intermediate',
        culturalContext: 'Universal - focus on methodology and results',
        suggestedAnswer: {
          framework: 'STAR Method',
          points: [
            'Situation: Context and challenge',
            'Task: Your responsibility',
            'Action: Steps you took',
            'Result: Outcome and impact'
          ],
          example: 'In my previous role, we faced [situation]. My task was to [task]. I took action by [steps]. The result was [outcome] with [impact].'
        },
        commonMistakes: [
          'Not using STAR framework',
          'Focusing on team effort without personal contribution',
          'Not quantifying results',
          'Choosing irrelevant examples'
        ],
        tips: [
          'Use STAR method consistently',
          'Quantify your impact',
          'Choose relevant examples',
          'Show your specific contribution'
        ]
      }
    ]
  }
  
  return questions[category] || questions['behavioral']
}

// NACE Career Readiness Competencies
export const getNACECompetencies = (): NACECompetency[] => [
  {
    id: 'critical-thinking',
    name: 'Critical Thinking/Problem Solving',
    description: 'Exercise sound reasoning to analyze issues, make decisions, and overcome problems',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Can identify basic problems and follow established procedures',
        indicators: ['Recognizes problems', 'Follows instructions', 'Uses basic problem-solving steps']
      },
      {
        level: 'B2 - Proficient',
        description: 'Analyzes complex problems and develops creative solutions',
        indicators: ['Breaks down complex issues', 'Evaluates multiple solutions', 'Implements effective solutions']
      },
      {
        level: 'C2 - Advanced',
        description: 'Synthesizes information from multiple sources to solve novel problems',
        indicators: ['Innovative problem-solving', 'Strategic thinking', 'Anticipates future challenges']
      }
    ],
    developmentActivities: [
      'Case study analysis',
      'Problem-solving workshops',
      'Critical thinking exercises',
      'Real-world project challenges'
    ],
    evidenceExamples: [
      'Project documentation showing problem-solving process',
      'Case study analysis reports',
      'Innovation project outcomes',
      'Problem-solving portfolio'
    ],
    assessmentCriteria: [
      'Ability to identify root causes',
      'Quality of analysis',
      'Creativity of solutions',
      'Implementation success'
    ]
  },
  {
    id: 'communication',
    name: 'Oral/Written Communications',
    description: 'Articulate thoughts and ideas clearly and effectively in written and oral forms',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Can communicate basic ideas clearly',
        indicators: ['Clear writing', 'Basic presentation skills', 'Appropriate tone']
      },
      {
        level: 'B2 - Proficient',
        description: 'Adapts communication style to audience and context',
        indicators: ['Persuasive communication', 'Professional presentations', 'Effective written reports']
      },
      {
        level: 'C2 - Advanced',
        description: 'Masterful communication across diverse audiences and platforms',
        indicators: ['Executive-level communication', 'Cross-cultural communication', 'Strategic messaging']
      }
    ],
    developmentActivities: [
      'Writing workshops',
      'Presentation practice',
      'Public speaking opportunities',
      'Professional writing projects'
    ],
    evidenceExamples: [
      'Written reports and proposals',
      'Presentation recordings',
      'Published articles or blogs',
      'Communication portfolio'
    ],
    assessmentCriteria: [
      'Clarity and organization',
      'Audience adaptation',
      'Professional tone',
      'Impact and effectiveness'
    ]
  },
  {
    id: 'teamwork',
    name: 'Teamwork/Collaboration',
    description: 'Build collaborative relationships with colleagues and customers',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Works effectively in small groups',
        indicators: ['Participates actively', 'Respects others', 'Completes assigned tasks']
      },
      {
        level: 'B2 - Proficient',
        description: 'Leads teams and manages group dynamics',
        indicators: ['Facilitates collaboration', 'Resolves conflicts', 'Achieves team goals']
      },
      {
        level: 'C2 - Advanced',
        description: 'Builds high-performing cross-functional teams',
        indicators: ['Strategic team building', 'Cross-cultural collaboration', 'Organizational impact']
      }
    ],
    developmentActivities: [
      'Team projects',
      'Collaborative workshops',
      'Group problem-solving',
      'Cross-functional initiatives'
    ],
    evidenceExamples: [
      'Team project outcomes',
      'Peer evaluations',
      'Collaboration documentation',
      'Team leadership examples'
    ],
    assessmentCriteria: [
      'Contribution to team goals',
      'Collaboration skills',
      'Conflict resolution',
      'Team leadership'
    ]
  },
  {
    id: 'digital-technology',
    name: 'Digital Technology',
    description: 'Leverage existing digital technologies and adapt to emerging technologies',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Uses common digital tools effectively',
        indicators: ['Basic software proficiency', 'Digital communication', 'Online research']
      },
      {
        level: 'B2 - Proficient',
        description: 'Applies advanced digital tools and adapts to new technologies',
        indicators: ['Advanced software skills', 'Digital problem-solving', 'Technology integration']
      },
      {
        level: 'C2 - Advanced',
        description: 'Innovates with technology and drives digital transformation',
        indicators: ['Technology leadership', 'Innovation', 'Digital strategy']
      }
    ],
    developmentActivities: [
      'Technology training',
      'Digital projects',
      'Software certifications',
      'Tech innovation challenges'
    ],
    evidenceExamples: [
      'Digital portfolios',
      'Technology certifications',
      'Digital project outcomes',
      'Tech innovation examples'
    ],
    assessmentCriteria: [
      'Tool proficiency',
      'Adaptation to new tech',
      'Innovation with technology',
      'Digital problem-solving'
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Leverage the strengths of others to achieve common goals',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Takes initiative in group settings',
        indicators: ['Volunteers for tasks', 'Supports team members', 'Shows responsibility']
      },
      {
        level: 'B2 - Proficient',
        description: 'Leads projects and influences others',
        indicators: ['Project leadership', 'Mentoring others', 'Achieving results through others']
      },
      {
        level: 'C2 - Advanced',
        description: 'Strategic leadership and organizational impact',
        indicators: ['Visionary leadership', 'Organizational change', 'Developing other leaders']
      }
    ],
    developmentActivities: [
      'Leadership roles',
      'Mentoring programs',
      'Leadership workshops',
      'Project leadership opportunities'
    ],
    evidenceExamples: [
      'Leadership project outcomes',
      'Mentoring documentation',
      'Team achievements',
      'Leadership portfolio'
    ],
    assessmentCriteria: [
      'Influence and impact',
      'Team development',
      'Vision and strategy',
      'Results achieved'
    ]
  },
  {
    id: 'professionalism',
    name: 'Professionalism/Work Ethic',
    description: 'Demonstrate personal accountability and effective work habits',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Meets basic expectations and deadlines',
        indicators: ['Punctuality', 'Reliability', 'Basic work quality']
      },
      {
        level: 'B2 - Proficient',
        description: 'Exceeds expectations and demonstrates integrity',
        indicators: ['High work quality', 'Ethical behavior', 'Continuous improvement']
      },
      {
        level: 'C2 - Advanced',
        description: 'Sets standards and models excellence',
        indicators: ['Excellence in all areas', 'Ethical leadership', 'Organizational culture impact']
      }
    ],
    developmentActivities: [
      'Professional development',
      'Ethics training',
      'Work quality projects',
      'Professional networking'
    ],
    evidenceExamples: [
      'Performance evaluations',
      'Professional references',
      'Ethics case studies',
      'Professional development records'
    ],
    assessmentCriteria: [
      'Reliability and consistency',
      'Work quality',
      'Ethical behavior',
      'Professional growth'
    ]
  },
  {
    id: 'career-management',
    name: 'Career Management',
    description: 'Identify and articulate skills, strengths, knowledge, and experiences',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Understands basic career concepts',
        indicators: ['Resume creation', 'Basic networking', 'Job search basics']
      },
      {
        level: 'B2 - Proficient',
        description: 'Manages career proactively and strategically',
        indicators: ['Strategic career planning', 'Professional branding', 'Network building']
      },
      {
        level: 'C2 - Advanced',
        description: 'Strategic career leadership and mentorship',
        indicators: ['Career strategy', 'Industry influence', 'Mentoring others']
      }
    ],
    developmentActivities: [
      'Career planning workshops',
      'Networking events',
      'Professional branding',
      'Career coaching'
    ],
    evidenceExamples: [
      'Career portfolio',
      'Networking documentation',
      'Professional achievements',
      'Career development plan'
    ],
    assessmentCriteria: [
      'Self-awareness',
      'Career planning',
      'Professional branding',
      'Network development'
    ]
  },
  {
    id: 'global-fluency',
    name: 'Global/Intercultural Fluency',
    description: 'Value, respect, and learn from diverse cultures and perspectives',
    proficiencyLevels: [
      {
        level: 'A1 - Basic',
        description: 'Awareness of cultural differences',
        indicators: ['Cultural awareness', 'Basic cross-cultural communication', 'Respect for diversity']
      },
      {
        level: 'B2 - Proficient',
        description: 'Effective cross-cultural collaboration',
        indicators: ['Cross-cultural communication', 'Cultural adaptation', 'Inclusive practices']
      },
      {
        level: 'C2 - Advanced',
        description: 'Cultural leadership and global impact',
        indicators: ['Cultural bridge-building', 'Global strategy', 'Diversity leadership']
      }
    ],
    developmentActivities: [
      'Cultural immersion',
      'Language learning',
      'International projects',
      'Diversity training'
    ],
    evidenceExamples: [
      'Cross-cultural project outcomes',
      'Language certifications',
      'International experience',
      'Cultural competency portfolio'
    ],
    assessmentCriteria: [
      'Cultural awareness',
      'Cross-cultural communication',
      'Adaptation skills',
      'Inclusive leadership'
    ]
  }
]

// Industry Insights
export const getIndustryInsights = (industry: string): IndustryInsight => {
  const insights: Record<string, IndustryInsight> = {
    'Technology': {
      industry: 'Technology',
      growthTrend: 'high',
      globalOpportunities: [
        'Software development',
        'AI/ML engineering',
        'Cybersecurity',
        'Cloud computing',
        'Data science'
      ],
      requiredSkills: [
        'Programming languages',
        'Problem-solving',
        'Agile methodologies',
        'Technical communication',
        'Continuous learning'
      ],
      certifications: [
        'AWS/Azure/GCP certifications',
        'Scrum Master',
        'Cybersecurity certifications',
        'Cloud architecture'
      ],
      salaryRange: {
        entry: '$60,000 - $90,000',
        mid: '$90,000 - $150,000',
        senior: '$150,000 - $250,000+'
      },
      careerPathways: {
        entry: ['Junior Developer', 'QA Engineer', 'Technical Support'],
        progression: ['Senior Developer', 'Tech Lead', 'Architect'],
        senior: ['Engineering Manager', 'CTO', 'VP Engineering']
      },
      geographicHotspots: [
        'Silicon Valley, USA',
        'Seattle, USA',
        'London, UK',
        'Singapore',
        'Tel Aviv, Israel',
        'Bangalore, India'
      ],
      futureOutlook: [
        'AI/ML integration across industries',
        'Remote work normalization',
        'Cybersecurity critical importance',
        'Low-code/no-code platforms growth'
      ]
    },
    'Finance': {
      industry: 'Finance',
      growthTrend: 'moderate',
      globalOpportunities: [
        'Investment banking',
        'Financial analysis',
        'Risk management',
        'FinTech',
        'Wealth management'
      ],
      requiredSkills: [
        'Financial analysis',
        'Excel proficiency',
        'Risk assessment',
        'Regulatory knowledge',
        'Communication'
      ],
      certifications: [
        'CFA (Chartered Financial Analyst)',
        'CPA (Certified Public Accountant)',
        'FRM (Financial Risk Manager)',
        'Series licenses'
      ],
      salaryRange: {
        entry: '$50,000 - $80,000',
        mid: '$80,000 - $150,000',
        senior: '$150,000 - $300,000+'
      },
      careerPathways: {
        entry: ['Financial Analyst', 'Junior Accountant', 'Trainee'],
        progression: ['Senior Analyst', 'Manager', 'Director'],
        senior: ['VP Finance', 'CFO', 'Managing Director']
      },
      geographicHotspots: [
        'New York, USA',
        'London, UK',
        'Hong Kong',
        'Singapore',
        'Zurich, Switzerland',
        'Dubai, UAE'
      ],
      futureOutlook: [
        'FinTech disruption',
        'Digital banking growth',
        'ESG investing focus',
        'Regulatory technology'
      ]
    },
    'Healthcare': {
      industry: 'Healthcare',
      growthTrend: 'high',
      globalOpportunities: [
        'Clinical roles',
        'Healthcare administration',
        'Medical research',
        'Health technology',
        'Public health'
      ],
      requiredSkills: [
        'Medical knowledge',
        'Patient care',
        'Administrative skills',
        'Technology proficiency',
        'Communication'
      ],
      certifications: [
        'Medical licenses',
        'Nursing certifications',
        'Healthcare administration',
        'Health informatics'
      ],
      salaryRange: {
        entry: '$45,000 - $70,000',
        mid: '$70,000 - $120,000',
        senior: '$120,000 - $250,000+'
      },
      careerPathways: {
        entry: ['Nurse', 'Medical Assistant', 'Administrative Support'],
        progression: ['Senior Nurse', 'Nurse Practitioner', 'Manager'],
        senior: ['Director', 'Chief Medical Officer', 'Hospital Administrator']
      },
      geographicHotspots: [
        'Boston, USA',
        'Zurich, Switzerland',
        'Singapore',
        'London, UK',
        'Sydney, Australia'
      ],
      futureOutlook: [
        'Aging population needs',
        'Telemedicine expansion',
        'Preventive care focus',
        'Health technology innovation'
      ]
    }
  }
  
  return insights[industry] || insights['Technology']
}

// Career Pathway Generator
export const generateCareerPathway = (career: string, industry: string): CareerPathway => {
  return {
    career,
    industry,
    entryLevel: {
      education: ['Bachelor\'s degree', 'Relevant certifications', 'Internships'],
      skills: ['Basic technical skills', 'Communication', 'Problem-solving'],
      certifications: ['Entry-level certifications', 'Industry-specific credentials'],
      experience: ['Internships', 'Entry-level positions', 'Volunteer work']
    },
    progression: [
      {
        level: 'Mid-Level (2-5 years)',
        years: '2-5',
        skills: ['Advanced technical skills', 'Leadership basics', 'Project management'],
        responsibilities: ['Lead small projects', 'Mentor juniors', 'Client interaction']
      },
      {
        level: 'Senior (5-10 years)',
        years: '5-10',
        skills: ['Strategic thinking', 'Advanced leadership', 'Industry expertise'],
        responsibilities: ['Strategic planning', 'Team leadership', 'Business development']
      }
    ],
    seniorLevel: {
      roles: ['Director', 'VP', 'C-Suite'],
      requirements: ['Advanced degree', 'Extensive experience', 'Leadership track record'],
      compensation: '$150,000 - $500,000+'
    },
    alternativePaths: [
      'Entrepreneurship',
      'Consulting',
      'Academia',
      'Non-profit leadership'
    ],
    internationalOpportunities: [
      'Global companies',
      'International assignments',
      'Cross-border projects',
      'Expatriate positions'
    ]
  }
}

// LinkedIn Optimization Guide
export const getLinkedInOptimizationGuide = (): LinkedInOptimization => {
  return {
    profileSections: [
      {
        section: 'Headline',
        importance: 'Critical - First impression',
        bestPractices: [
          'Include target role and key skills',
          'Use industry keywords',
          'Keep it concise (120 characters)',
          'Show value proposition'
        ],
        examples: [
          'Software Engineer | Full-Stack Developer | React & Node.js',
          'Marketing Manager | Digital Strategy | B2B Growth Expert',
          'Data Scientist | Machine Learning | Python & SQL Specialist'
        ]
      },
      {
        section: 'Summary',
        importance: 'High - Tells your story',
        bestPractices: [
          'Write in first person',
          'Tell your career story',
          'Include achievements with metrics',
          'Use keywords naturally',
          'Show personality'
        ],
        examples: [
          'I\'m a passionate software engineer with 5+ years...',
          'Results-driven marketing professional specializing in...'
        ]
      },
      {
        section: 'Experience',
        importance: 'Critical - Shows your track record',
        bestPractices: [
          'Use action verbs',
          'Quantify achievements',
          'Include relevant keywords',
          'Show progression',
          'Add media/links'
        ],
        examples: [
          'Increased sales by 30% through...',
          'Led team of 5 developers to deliver...'
        ]
      },
      {
        section: 'Skills & Endorsements',
        importance: 'High - ATS optimization',
        bestPractices: [
          'List 50+ relevant skills',
          'Get endorsements from connections',
          'Take skill assessments',
          'Update regularly'
        ],
        examples: []
      }
    ],
    keywordStrategy: [
      'Industry-specific terms',
      'Job title variations',
      'Technical skills',
      'Soft skills',
      'Certifications',
      'Tools and technologies'
    ],
    networkingTips: [
      'Connect with industry professionals',
      'Join relevant groups',
      'Engage with content',
      'Personalize connection requests',
      'Follow companies of interest',
      'Attend virtual events'
    ],
    contentStrategy: [
      'Share industry insights',
      'Comment on others\' posts',
      'Publish articles',
      'Share achievements',
      'Engage authentically',
      'Post consistently'
    ],
    commonMistakes: [
      'Incomplete profile',
      'Generic headline',
      'No profile photo',
      'Not customizing connection requests',
      'Ignoring engagement',
      'Outdated information'
    ]
  }
}

// Skills Assessment Generator
export const generateSkillsAssessment = (
  competency: string,
  currentLevel: string,
  targetLevel: string
): SkillsAssessment => {
  return {
    competency,
    currentLevel,
    targetLevel,
    gapAnalysis: [
      'Identify specific skill gaps',
      'Compare current vs. target proficiency',
      'Prioritize development areas',
      'Set measurable goals'
    ],
    developmentPlan: [
      {
        activity: 'Formal training',
        timeline: '3-6 months',
        resources: ['Online courses', 'Workshops', 'Certifications']
      },
      {
        activity: 'Practical application',
        timeline: 'Ongoing',
        resources: ['Projects', 'Volunteer work', 'Side projects']
      },
      {
        activity: 'Mentorship',
        timeline: '6-12 months',
        resources: ['Find a mentor', 'Join professional groups', 'Networking']
      }
    ],
    evidenceNeeded: [
      'Project documentation',
      'Performance reviews',
      'Certifications',
      'Recommendations',
      'Portfolio examples'
    ]
  }
}

// Get available countries/regions
export const getResumeRegions = () => [
  'United States',
  'United Kingdom',
  'European Union',
  'Asia-Pacific',
  'Canada',
  'Australia',
  'Global'
]

// Get industries
export const getCareerIndustries = () => [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Consulting',
  'Engineering',
  'Sales',
  'Human Resources',
  'Operations'
]

// Get interview categories
export const getInterviewCategories = () => [
  'Behavioral',
  'Technical',
  'Case Study',
  'Situational',
  'Cultural Fit',
  'Leadership',
  'Industry-Specific'
]




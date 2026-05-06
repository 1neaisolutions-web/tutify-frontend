// AI & Machine Learning Educator Utilities - International Standards Focus

export interface AIConcept {
  id: string
  concept: string
  description: string
  gradeLevel: string
  keyPoints: string[]
  examples: string[]
  activities: string[]
  misconceptions: string[]
  realWorldApplications: string[]
}

export interface EthicalAIPrinciple {
  id: string
  principle: string
  description: string
  importance: string
  examples: string[]
  discussionQuestions: string[]
  caseStudies: string[]
  resources: string[]
  standardsAlignment: string[]
}

export interface MLProject {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  gradeLevel: string
  duration: string
  learningObjectives: string[]
  tools: string[]
  datasets: string[]
  steps: {
    step: string
    description: string
    duration: string
  }[]
  assessment: string[]
  extensions: string[]
  realWorldConnection: string
}

export interface AIStandard {
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

export interface AIEthicsFramework {
  id: string
  name: string
  organization: string
  description: string
  principles: {
    principle: string
    description: string
    examples: string[]
  }[]
  applications: string[]
}

// AI Concepts
export const getAIConcepts = (): AIConcept[] => [
  {
    id: 'what-is-ai',
    concept: 'What is Artificial Intelligence?',
    description: 'Introduction to AI as machines that can perform tasks typically requiring human intelligence.',
    gradeLevel: 'Elementary (K-5)',
    keyPoints: [
      'AI is machines that can think and learn',
      'AI can recognize patterns',
      'AI helps solve problems',
      'AI is used in everyday life'
    ],
    examples: [
      'Voice assistants (Siri, Alexa)',
      'Recommendation systems (Netflix, YouTube)',
      'Image recognition (photo apps)',
      'Game AI (chess, video games)'
    ],
    activities: [
      'AI vs Human activity sorting',
      'Identify AI in daily life',
      'Create simple decision trees',
      'Design an AI helper'
    ],
    misconceptions: [
      'AI is the same as robots',
      'AI can think like humans',
      'AI is always smart',
      'AI will replace all humans'
    ],
    realWorldApplications: [
      'Healthcare: Medical diagnosis',
      'Transportation: Self-driving cars',
      'Education: Personalized learning',
      'Entertainment: Content recommendations'
    ]
  },
  {
    id: 'machine-learning-basics',
    concept: 'Machine Learning Fundamentals',
    description: 'Understanding how machines learn from data without explicit programming.',
    gradeLevel: 'Middle School (6-8)',
    keyPoints: [
      'ML learns from examples',
      'Training data teaches the model',
      'Models make predictions',
      'More data usually means better results'
    ],
    examples: [
      'Email spam filters',
      'Image classification',
      'Language translation',
      'Recommendation systems'
    ],
    activities: [
      'Train a simple classifier',
      'Collect and label data',
      'Test model accuracy',
      'Improve model performance'
    ],
    misconceptions: [
      'ML is magic',
      'More data always helps',
      'ML models are always correct',
      'ML replaces human judgment'
    ],
    realWorldApplications: [
      'Fraud detection in banking',
      'Weather prediction',
      'Product recommendations',
      'Medical image analysis'
    ]
  },
  {
    id: 'neural-networks',
    concept: 'Neural Networks',
    description: 'Understanding how artificial neural networks mimic the human brain to process information.',
    gradeLevel: 'High School (9-12)',
    keyPoints: [
      'Neurons process information',
      'Networks learn through layers',
      'Weights adjust during training',
      'Deep learning uses many layers'
    ],
    examples: [
      'Image recognition',
      'Natural language processing',
      'Speech recognition',
      'Autonomous vehicles'
    ],
    activities: [
      'Build a simple neural network',
      'Visualize network layers',
      'Experiment with different architectures',
      'Train on real datasets'
    ],
    misconceptions: [
      'Neural networks work exactly like brains',
      'More layers always better',
      'Neural networks understand meaning',
      'Training is instant'
    ],
    realWorldApplications: [
      'Computer vision systems',
      'Language translation services',
      'Autonomous systems',
      'Medical diagnosis tools'
    ]
  },
  {
    id: 'supervised-learning',
    concept: 'Supervised Learning',
    description: 'Learning from labeled examples to make predictions or classifications.',
    gradeLevel: 'High School (9-12)',
    keyPoints: [
      'Uses labeled training data',
      'Learns input-output relationships',
      'Can predict or classify',
      'Requires quality labeled data'
    ],
    examples: [
      'Email spam detection',
      'Image classification',
      'Price prediction',
      'Disease diagnosis'
    ],
    activities: [
      'Create labeled datasets',
      'Train classification models',
      'Evaluate model performance',
      'Improve predictions'
    ],
    misconceptions: [
      'Supervised learning is easy',
      'Any data works',
      'Models always generalize',
      'Labeling is trivial'
    ],
    realWorldApplications: [
      'Credit scoring',
      'Medical diagnosis',
      'Quality control',
      'Customer segmentation'
    ]
  },
  {
    id: 'unsupervised-learning',
    concept: 'Unsupervised Learning',
    description: 'Finding patterns in data without labeled examples.',
    gradeLevel: 'High School (9-12)',
    keyPoints: [
      'No labeled data needed',
      'Finds hidden patterns',
      'Groups similar data',
      'Discovers structure'
    ],
    examples: [
      'Customer segmentation',
      'Anomaly detection',
      'Topic modeling',
      'Image compression'
    ],
    activities: [
      'Cluster unlabeled data',
      'Find patterns in datasets',
      'Visualize clusters',
      'Discover anomalies'
    ],
    misconceptions: [
      'Unsupervised is easier',
      'No evaluation needed',
      'Clusters are always meaningful',
      'No human input required'
    ],
    realWorldApplications: [
      'Market research',
      'Fraud detection',
      'Data compression',
      'Pattern discovery'
    ]
  },
  {
    id: 'ai-ethics-intro',
    concept: 'AI Ethics Introduction',
    description: 'Understanding the ethical implications and responsibilities of AI systems.',
    gradeLevel: 'Middle School (6-8)',
    keyPoints: [
      'AI affects people\'s lives',
      'Bias can be built into AI',
      'Privacy matters',
      'Transparency is important'
    ],
    examples: [
      'Facial recognition bias',
      'Hiring algorithm fairness',
      'Social media algorithms',
      'Autonomous vehicle decisions'
    ],
    activities: [
      'Discuss AI bias scenarios',
      'Analyze fairness in AI',
      'Design ethical AI systems',
      'Debate AI decisions'
    ],
    misconceptions: [
      'AI is neutral',
      'Technology is always good',
      'AI decisions are fair',
      'Ethics don\'t matter in tech'
    ],
    realWorldApplications: [
      'Criminal justice systems',
      'Healthcare decisions',
      'Employment screening',
      'Social media content'
    ]
  }
]

// Ethical AI Principles
export const getEthicalAIPrinciples = (): EthicalAIPrinciple[] => [
  {
    id: 'fairness-bias',
    principle: 'Fairness and Bias',
    description: 'Ensuring AI systems treat all individuals and groups fairly without discrimination.',
    importance: 'Prevents discrimination and ensures equal opportunities for all users.',
    examples: [
      'Hiring algorithms favoring certain demographics',
      'Facial recognition performing poorly on certain groups',
      'Loan approval systems with racial bias',
      'Healthcare AI with gender bias'
    ],
    discussionQuestions: [
      'How can bias enter AI systems?',
      'What are the consequences of biased AI?',
      'How can we detect bias in AI?',
      'What steps can prevent bias?',
      'Who is responsible for biased AI?'
    ],
    caseStudies: [
      'Amazon hiring algorithm gender bias',
      'COMPAS recidivism prediction tool',
      'Healthcare algorithms and racial disparities',
      'Facial recognition accuracy disparities'
    ],
    resources: [
      'AI Fairness 360 Toolkit',
      'Fairness Indicators',
      'Algorithmic Justice League',
      'Partnership on AI'
    ],
    standardsAlignment: [
      'ISTE Digital Citizen',
      'UNESCO AI Ethics',
      'EU AI Act',
      'IEEE Ethically Aligned Design'
    ]
  },
  {
    id: 'privacy-data',
    principle: 'Privacy and Data Protection',
    description: 'Protecting personal information and ensuring data is used responsibly.',
    importance: 'Safeguards individual rights and prevents misuse of personal data.',
    examples: [
      'Data collection without consent',
      'Personal information leaks',
      'Surveillance systems',
      'Data used for unintended purposes'
    ],
    discussionQuestions: [
      'What data should AI systems collect?',
      'How should personal data be protected?',
      'What is informed consent?',
      'Who owns data?',
      'How can we balance privacy and functionality?'
    ],
    caseStudies: [
      'Cambridge Analytica scandal',
      'Facial recognition in public spaces',
      'Health data privacy breaches',
      'Location tracking concerns'
    ],
    resources: [
      'GDPR guidelines',
      'CCPA regulations',
      'Privacy by Design principles',
      'Data protection frameworks'
    ],
    standardsAlignment: [
      'GDPR',
      'CCPA',
      'UNESCO Privacy Framework',
      'OECD Privacy Guidelines'
    ]
  },
  {
    id: 'transparency-explainability',
    principle: 'Transparency and Explainability',
    description: 'Making AI decisions understandable and explainable to users.',
    importance: 'Builds trust and allows users to understand and challenge AI decisions.',
    examples: [
      'Black box algorithms',
      'Unexplained loan denials',
      'Mysterious content recommendations',
      'Unclear medical diagnoses'
    ],
    discussionQuestions: [
      'Why is transparency important?',
      'What makes an AI system explainable?',
      'When should AI decisions be explained?',
      'How can we make AI more transparent?',
      'What are the limits of explainability?'
    ],
    caseStudies: [
      'Explainable AI in healthcare',
      'Transparency in credit scoring',
      'Algorithmic decision-making in government',
      'Explainable recommendations'
    ],
    resources: [
      'Explainable AI frameworks',
      'LIME and SHAP tools',
      'Interpretability research',
      'Transparency guidelines'
    ],
    standardsAlignment: [
      'EU AI Act transparency requirements',
      'IEEE Explainable AI',
      'NIST AI Explainability',
      'UNESCO Transparency Principles'
    ]
  },
  {
    id: 'accountability-responsibility',
    principle: 'Accountability and Responsibility',
    description: 'Ensuring clear responsibility for AI system outcomes and decisions.',
    importance: 'Holds developers and users accountable for AI impacts.',
    examples: [
      'Autonomous vehicle accidents',
      'AI hiring discrimination',
      'Medical AI errors',
      'Algorithmic trading failures'
    ],
    discussionQuestions: [
      'Who is responsible for AI decisions?',
      'What happens when AI makes mistakes?',
      'How should AI errors be handled?',
      'What is developer responsibility?',
      'What is user responsibility?'
    ],
    caseStudies: [
      'Tesla Autopilot accidents',
      'Uber self-driving car incident',
      'AI in criminal justice',
      'Healthcare AI malpractice'
    ],
    resources: [
      'AI accountability frameworks',
      'Liability guidelines',
      'Ethics review boards',
      'Responsible AI practices'
    ],
    standardsAlignment: [
      'EU AI Act liability',
      'IEEE Accountability',
      'UNESCO Responsibility',
      'OECD AI Principles'
    ]
  },
  {
    id: 'safety-security',
    principle: 'Safety and Security',
    description: 'Ensuring AI systems are safe, secure, and robust against attacks.',
    importance: 'Protects users and prevents malicious use of AI systems.',
    examples: [
      'Adversarial attacks on AI',
      'AI system vulnerabilities',
      'Malicious AI use',
      'System failures and errors'
    ],
    discussionQuestions: [
      'What makes AI systems safe?',
      'How can AI be attacked?',
      'What are adversarial examples?',
      'How can we secure AI systems?',
      'What happens when AI fails?'
    ],
    caseStudies: [
      'Adversarial attacks on image recognition',
      'AI system hacking',
      'Deepfake technology misuse',
      'Autonomous system failures'
    ],
    resources: [
      'AI security frameworks',
      'Adversarial robustness research',
      'Safety guidelines',
      'Security best practices'
    ],
    standardsAlignment: [
      'NIST AI Security',
      'EU AI Act safety requirements',
      'IEEE Safety Standards',
      'ISO/IEC AI Security'
    ]
  },
  {
    id: 'human-autonomy',
    principle: 'Human Autonomy and Control',
    description: 'Ensuring humans maintain control and autonomy in AI-assisted decisions.',
    importance: 'Preserves human agency and prevents over-reliance on AI.',
    examples: [
      'Over-reliance on AI recommendations',
      'Loss of human skills',
      'AI making critical decisions',
      'Reduced human judgment'
    ],
    discussionQuestions: [
      'When should humans make decisions?',
      'How much control should AI have?',
      'What is human-in-the-loop?',
      'How do we balance AI and human judgment?',
      'What happens when we rely too much on AI?'
    ],
    caseStudies: [
      'AI in medical diagnosis',
      'Autonomous weapons systems',
      'AI in education',
      'Automated decision-making'
    ],
    resources: [
      'Human-centered AI',
      'Human-in-the-loop systems',
      'Autonomy frameworks',
      'Control mechanisms'
    ],
    standardsAlignment: [
      'UNESCO Human Autonomy',
      'IEEE Human Control',
      'EU AI Act human oversight',
      'OECD Human-Centered AI'
    ]
  }
]

// Machine Learning Projects
export const getMLProjects = (): MLProject[] => [
  {
    id: 'image-classifier',
    title: 'Image Classifier',
    description: 'Build a simple image classification model to recognize different objects.',
    difficulty: 'Beginner',
    gradeLevel: 'Middle School (6-8)',
    duration: '4-6 hours',
    learningObjectives: [
      'Understand image classification',
      'Learn about training data',
      'Use ML tools and platforms',
      'Evaluate model performance'
    ],
    tools: [
      'Teachable Machine',
      'Google Colab',
      'Scratch for ML',
      'Machine Learning for Kids'
    ],
    datasets: [
      'Custom student photos',
      'Public image datasets',
      'Pre-labeled image sets'
    ],
    steps: [
      {
        step: '1. Collect Data',
        description: 'Gather images of different objects (e.g., cats, dogs, birds)',
        duration: '30 minutes'
      },
      {
        step: '2. Label Data',
        description: 'Organize images into categories',
        duration: '30 minutes'
      },
      {
        step: '3. Train Model',
        description: 'Use ML platform to train classifier',
        duration: '1 hour'
      },
      {
        step: '4. Test Model',
        description: 'Test with new images and evaluate accuracy',
        duration: '30 minutes'
      },
      {
        step: '5. Improve Model',
        description: 'Add more data and retrain to improve',
        duration: '1 hour'
      }
    ],
    assessment: [
      'Model accuracy',
      'Understanding of process',
      'Ability to explain results',
      'Improvement strategies'
    ],
    extensions: [
      'Add more categories',
      'Improve accuracy',
      'Create interactive demo',
      'Deploy as web app'
    ],
    realWorldConnection: 'Used in photo apps, security systems, medical imaging'
  },
  {
    id: 'sentiment-analyzer',
    title: 'Sentiment Analyzer',
    description: 'Create a model that analyzes text to determine positive, negative, or neutral sentiment.',
    difficulty: 'Intermediate',
    gradeLevel: 'High School (9-12)',
    duration: '6-8 hours',
    learningObjectives: [
      'Understand natural language processing',
      'Work with text data',
      'Apply ML to real-world problems',
      'Evaluate model performance'
    ],
    tools: [
      'Google Colab',
      'Python (scikit-learn)',
      'Natural Language Toolkit',
      'TextBlob'
    ],
    datasets: [
      'Movie reviews',
      'Social media posts',
      'Product reviews',
      'News articles'
    ],
    steps: [
      {
        step: '1. Prepare Data',
        description: 'Collect and clean text data',
        duration: '1 hour'
      },
      {
        step: '2. Label Sentiment',
        description: 'Label text as positive, negative, or neutral',
        duration: '1 hour'
      },
      {
        step: '3. Feature Extraction',
        description: 'Convert text to numerical features',
        duration: '1 hour'
      },
      {
        step: '4. Train Model',
        description: 'Train classifier on labeled data',
        duration: '1 hour'
      },
      {
        step: '5. Evaluate',
        description: 'Test model and analyze results',
        duration: '1 hour'
      }
    ],
    assessment: [
      'Model accuracy',
      'Code quality',
      'Understanding of NLP',
      'Real-world application'
    ],
    extensions: [
      'Analyze social media trends',
      'Create sentiment dashboard',
      'Improve accuracy',
      'Handle multiple languages'
    ],
    realWorldConnection: 'Used in social media monitoring, customer feedback, market research'
  },
  {
    id: 'recommendation-system',
    title: 'Recommendation System',
    description: 'Build a simple recommendation system that suggests items based on user preferences.',
    difficulty: 'Intermediate',
    gradeLevel: 'High School (9-12)',
    duration: '8-10 hours',
    learningObjectives: [
      'Understand recommendation algorithms',
      'Work with user data',
      'Implement collaborative filtering',
      'Evaluate recommendation quality'
    ],
    tools: [
      'Python',
      'Pandas',
      'scikit-learn',
      'Google Colab'
    ],
    datasets: [
      'Movie ratings',
      'Book preferences',
      'Music listening data',
      'Product reviews'
    ],
    steps: [
      {
        step: '1. Collect Data',
        description: 'Gather user preference data',
        duration: '1 hour'
      },
      {
        step: '2. Preprocess',
        description: 'Clean and organize data',
        duration: '1 hour'
      },
      {
        step: '3. Build Model',
        description: 'Implement recommendation algorithm',
        duration: '3 hours'
      },
      {
        step: '4. Test Recommendations',
        description: 'Test system with sample users',
        duration: '1 hour'
      },
      {
        step: '5. Evaluate',
        description: 'Measure recommendation quality',
        duration: '1 hour'
      }
    ],
    assessment: [
      'Algorithm implementation',
      'Recommendation quality',
      'Code documentation',
      'Understanding of concepts'
    ],
    extensions: [
      'Add content-based filtering',
      'Improve accuracy',
      'Create user interface',
      'Handle cold start problem'
    ],
    realWorldConnection: 'Used by Netflix, Amazon, Spotify, YouTube'
  },
  {
    id: 'predictive-model',
    title: 'Predictive Model',
    description: 'Create a model that predicts outcomes based on historical data.',
    difficulty: 'Advanced',
    gradeLevel: 'High School (9-12)',
    duration: '10-12 hours',
    learningObjectives: [
      'Understand predictive modeling',
      'Work with time series data',
      'Evaluate predictions',
      'Handle real-world data'
    ],
    tools: [
      'Python',
      'scikit-learn',
      'Pandas',
      'Matplotlib'
    ],
    datasets: [
      'Weather data',
      'Stock prices',
      'Sales data',
      'Student performance'
    ],
    steps: [
      {
        step: '1. Explore Data',
        description: 'Analyze and visualize data',
        duration: '2 hours'
      },
      {
        step: '2. Feature Engineering',
        description: 'Create relevant features',
        duration: '2 hours'
      },
      {
        step: '3. Train Models',
        description: 'Train multiple models',
        duration: '2 hours'
      },
      {
        step: '4. Compare Models',
        description: 'Evaluate and compare performance',
        duration: '2 hours'
      },
      {
        step: '5. Make Predictions',
        description: 'Use best model for predictions',
        duration: '1 hour'
      }
    ],
    assessment: [
      'Model accuracy',
      'Feature engineering',
      'Data analysis',
      'Prediction quality'
    ],
    extensions: [
      'Improve model performance',
      'Add more features',
      'Create visualizations',
      'Deploy model'
    ],
    realWorldConnection: 'Used in weather forecasting, stock prediction, demand forecasting'
  }
]

// International Standards
export const getAIStandards = (): AIStandard[] => [
  {
    id: 'iste-ai',
    name: 'ISTE AI Standards',
    organization: 'International Society for Technology in Education',
    region: 'Global',
    description: 'Standards for teaching AI concepts and skills to K-12 students.',
    keyComponents: [
      'AI Concepts',
      'AI Applications',
      'AI Ethics',
      'AI Tools',
      'Problem Solving with AI'
    ],
    gradeLevels: ['K-12'],
    competencies: [
      {
        competency: 'AI Concepts',
        description: 'Students understand fundamental AI concepts and how AI systems work.',
        indicators: [
          'Defines AI and its capabilities',
          'Understands machine learning basics',
          'Recognizes AI in daily life',
          'Explains how AI systems learn'
        ]
      },
      {
        competency: 'AI Applications',
        description: 'Students identify and evaluate AI applications.',
        indicators: [
          'Identifies AI applications',
          'Evaluates AI effectiveness',
          'Understands AI limitations',
          'Recognizes appropriate AI use'
        ]
      },
      {
        competency: 'AI Ethics',
        description: 'Students understand ethical implications of AI.',
        indicators: [
          'Recognizes AI bias',
          'Understands privacy concerns',
          'Evaluates AI fairness',
          'Considers ethical implications'
        ]
      }
    ]
  },
  {
    id: 'csta-ai',
    name: 'CSTA AI Standards',
    organization: 'Computer Science Teachers Association',
    region: 'United States',
    description: 'K-12 computer science standards including AI and machine learning.',
    keyComponents: [
      'AI Concepts',
      'Machine Learning',
      'Data Science',
      'Ethics',
      'Applications'
    ],
    gradeLevels: ['K-12'],
    competencies: [
      {
        competency: 'AI Concepts',
        description: 'Understanding of AI fundamentals.',
        indicators: [
          'Defines AI',
          'Understands ML basics',
          'Recognizes AI applications',
          'Explains AI capabilities'
        ]
      },
      {
        competency: 'Machine Learning',
        description: 'Understanding of how machines learn.',
        indicators: [
          'Understands training data',
          'Recognizes model types',
          'Evaluates model performance',
          'Applies ML concepts'
        ]
      }
    ]
  },
  {
    id: 'unesco-ai-ethics',
    name: 'UNESCO AI Ethics',
    organization: 'United Nations Educational, Scientific and Cultural Organization',
    region: 'Global',
    description: 'Recommendation on the Ethics of Artificial Intelligence.',
    keyComponents: [
      'Human Rights',
      'Fairness',
      'Transparency',
      'Accountability',
      'Privacy',
      'Human Dignity'
    ],
    gradeLevels: ['All levels'],
    competencies: [
      {
        competency: 'Ethical AI Development',
        description: 'Understanding ethical principles in AI development.',
        indicators: [
          'Respects human rights',
          'Ensures fairness',
          'Maintains transparency',
          'Takes accountability'
        ]
      },
      {
        competency: 'Ethical AI Use',
        description: 'Using AI systems ethically and responsibly.',
        indicators: [
          'Recognizes ethical issues',
          'Evaluates AI impacts',
          'Makes ethical decisions',
          'Advocates for ethical AI'
        ]
      }
    ]
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act',
    organization: 'European Union',
    region: 'European Union',
    description: 'Regulation on artificial intelligence establishing rules for AI systems.',
    keyComponents: [
      'Risk-Based Approach',
      'Prohibited Practices',
      'High-Risk AI',
      'Transparency',
      'Accountability'
    ],
    gradeLevels: ['All levels'],
    competencies: [
      {
        competency: 'AI Risk Assessment',
        description: 'Understanding risk levels of AI systems.',
        indicators: [
          'Identifies AI risks',
          'Categorizes risk levels',
          'Understands requirements',
          'Applies risk framework'
        ]
      },
      {
        competency: 'Compliance',
        description: 'Understanding AI regulations and compliance.',
        indicators: [
          'Knows prohibited practices',
          'Understands requirements',
          'Recognizes compliance needs',
          'Applies regulations'
        ]
      }
    ]
  },
  {
    id: 'ieee-ethics',
    name: 'IEEE Ethically Aligned Design',
    organization: 'Institute of Electrical and Electronics Engineers',
    region: 'Global',
    description: 'Framework for ethical AI design and implementation.',
    keyComponents: [
      'Human Well-being',
      'Accountability',
      'Transparency',
      'Awareness of Misuse',
      'Competence'
    ],
    gradeLevels: ['All levels'],
    competencies: [
      {
        competency: 'Ethical Design',
        description: 'Designing AI systems with ethics in mind.',
        indicators: [
          'Considers human well-being',
          'Ensures accountability',
          'Maintains transparency',
          'Prevents misuse'
        ]
      },
      {
        competency: 'Ethical Implementation',
        description: 'Implementing AI systems ethically.',
        indicators: [
          'Follows ethical guidelines',
          'Ensures competence',
          'Maintains oversight',
          'Addresses concerns'
        ]
      }
    ]
  }
]

// AI Ethics Frameworks
export const getAIEthicsFrameworks = (): AIEthicsFramework[] => [
  {
    id: 'asilomar',
    name: 'Asilomar AI Principles',
    organization: 'Future of Life Institute',
    description: '23 principles for beneficial AI development.',
    principles: [
      {
        principle: 'Research Goal',
        description: 'The goal of AI research should be to create beneficial intelligence.',
        examples: ['Focus on positive impacts', 'Avoid harmful applications']
      },
      {
        principle: 'Research Funding',
        description: 'Investment in AI should include funding for safety research.',
        examples: ['Safety research funding', 'Risk mitigation']
      },
      {
        principle: 'Science-Policy Link',
        description: 'Constructive and healthy exchange between AI researchers and policy-makers.',
        examples: ['Policy engagement', 'Research communication']
      }
    ],
    applications: [
      'AI research guidelines',
      'Policy development',
      'Ethical AI development',
      'Safety standards'
    ]
  },
  {
    id: 'partnership-ai',
    name: 'Partnership on AI',
    organization: 'Partnership on AI',
    description: 'Multi-stakeholder organization promoting responsible AI.',
    principles: [
      {
        principle: 'Benefit People',
        description: 'AI should benefit and empower people.',
        examples: ['Human-centered design', 'Social good applications']
      },
      {
        principle: 'Fairness',
        description: 'AI systems should be fair and transparent.',
        examples: ['Bias mitigation', 'Transparency measures']
      },
      {
        principle: 'Safety',
        description: 'AI systems should be safe and secure.',
        examples: ['Safety testing', 'Security measures']
      }
    ],
    applications: [
      'Responsible AI development',
      'Fairness initiatives',
      'Safety standards',
      'Ethical guidelines'
    ]
  }
]

// Get grade levels
export const getGradeLevels = () => [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College'
]

// Get difficulty levels
export const getDifficultyLevels = () => [
  'Beginner',
  'Intermediate',
  'Advanced'
]

// Get AI concept categories
export const getAIConceptCategories = () => [
  'AI Fundamentals',
  'Machine Learning',
  'Neural Networks',
  'Ethics',
  'Applications'
]




// Marketing & Branding Strategist Utilities - International Standards Focus

export interface MarketingConcept {
  id: string
  concept: string
  description: string
  gradeLevel: string
  keyPrinciples: string[]
  examples: string[]
  activities: string[]
  realWorldApplications: string[]
  tools: string[]
}

export interface BrandingStrategy {
  id: string
  strategy: string
  description: string
  components: string[]
  steps: string[]
  examples: string[]
  benefits: string[]
  challenges: string[]
  bestPractices: string[]
}

export interface DigitalMarketingChannel {
  id: string
  channel: string
  description: string
  platforms: string[]
  bestPractices: string[]
  metrics: string[]
  tools: string[]
  targetAudience: string[]
  budgetConsiderations: string[]
}

export interface MarketingCampaign {
  id: string
  title: string
  description: string
  objectives: string[]
  targetAudience: string
  channels: string[]
  timeline: string
  budget: string
  keyMessages: string[]
  tactics: string[]
  successMetrics: string[]
  caseStudy: string
}

export interface MarketingStandard {
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

export interface MarketResearchMethod {
  id: string
  method: string
  description: string
  useCases: string[]
  steps: string[]
  tools: string[]
  advantages: string[]
  limitations: string[]
  examples: string[]
}

// Marketing Concepts
export const getMarketingConcepts = (): MarketingConcept[] => [
  {
    id: 'marketing-mix',
    concept: 'Marketing Mix (4Ps)',
    description: 'The fundamental framework of Product, Price, Place, and Promotion used to develop marketing strategies.',
    gradeLevel: 'High School (9-12)',
    keyPrinciples: [
      'Product: What you sell and its features',
      'Price: Pricing strategy and value proposition',
      'Place: Distribution channels and availability',
      'Promotion: Communication and advertising strategies'
    ],
    examples: [
      'Apple: Premium products, high prices, exclusive stores, innovative advertising',
      'Coca-Cola: Consistent product, competitive pricing, global distribution, emotional campaigns',
      'Amazon: Diverse products, competitive prices, online platform, convenience messaging'
    ],
    activities: [
      'Analyze a product using 4Ps framework',
      'Create marketing mix for a new product',
      'Compare marketing mixes of competitors',
      'Develop 4Ps strategy for school event'
    ],
    realWorldApplications: [
      'Product launch planning',
      'Competitive analysis',
      'Market positioning',
      'Strategic planning'
    ],
    tools: [
      'Marketing Mix Template',
      'SWOT Analysis',
      'Competitor Analysis Framework',
      'Product Positioning Map'
    ]
  },
  {
    id: 'market-segmentation',
    concept: 'Market Segmentation',
    description: 'Dividing a market into distinct groups of consumers with similar needs, characteristics, or behaviors.',
    gradeLevel: 'High School (9-12)',
    keyPrinciples: [
      'Demographic segmentation (age, gender, income)',
      'Psychographic segmentation (lifestyle, values)',
      'Geographic segmentation (location)',
      'Behavioral segmentation (purchasing patterns)'
    ],
    examples: [
      'Nike: Segments by sports (running, basketball, soccer)',
      'Starbucks: Segments by lifestyle and occasion',
      'Toyota: Segments by income and needs (luxury vs economy)'
    ],
    activities: [
      'Segment a market for a product',
      'Create customer personas',
      'Analyze segmentation strategies',
      'Develop targeting approach'
    ],
    realWorldApplications: [
      'Targeted advertising',
      'Product development',
      'Pricing strategies',
      'Channel selection'
    ],
    tools: [
      'Segmentation Matrix',
      'Customer Persona Template',
      'Targeting Framework',
      'Positioning Map'
    ]
  },
  {
    id: 'consumer-behavior',
    concept: 'Consumer Behavior',
    description: 'Understanding how consumers make purchasing decisions and what influences their choices.',
    gradeLevel: 'High School (9-12)',
    keyPrinciples: [
      'Consumer decision-making process',
      'Factors influencing purchases',
      'Buyer personas and motivations',
      'Customer journey mapping'
    ],
    examples: [
      'Impulse buying vs planned purchases',
      'Brand loyalty influences',
      'Social media impact on decisions',
      'Price sensitivity factors'
    ],
    activities: [
      'Map consumer decision process',
      'Analyze purchase influences',
      'Create buyer personas',
      'Study customer journey'
    ],
    realWorldApplications: [
      'Product positioning',
      'Advertising messaging',
      'Store layout design',
      'Pricing strategies'
    ],
    tools: [
      'Consumer Decision Model',
      'Buyer Persona Template',
      'Customer Journey Map',
      'Influence Analysis Framework'
    ]
  },
  {
    id: 'brand-identity',
    concept: 'Brand Identity',
    description: 'The visible elements of a brand that together identify and distinguish it in consumers\' minds.',
    gradeLevel: 'Middle School (6-8)',
    keyPrinciples: [
      'Brand name and logo',
      'Color palette and typography',
      'Brand voice and messaging',
      'Visual identity consistency'
    ],
    examples: [
      'Coca-Cola: Red color, distinctive script, happiness messaging',
      'Nike: Swoosh logo, "Just Do It" slogan, athletic imagery',
      'Apple: Minimalist design, innovation messaging, premium positioning'
    ],
    activities: [
      'Design brand identity',
      'Analyze brand elements',
      'Create brand guidelines',
      'Develop brand story'
    ],
    realWorldApplications: [
      'Brand development',
      'Rebranding projects',
      'Brand consistency',
      'Marketing communications'
    ],
    tools: [
      'Brand Identity Template',
      'Logo Design Tools',
      'Brand Guidelines Framework',
      'Brand Audit Checklist'
    ]
  },
  {
    id: 'digital-marketing-basics',
    concept: 'Digital Marketing Fundamentals',
    description: 'Marketing strategies and tactics using digital channels and technologies.',
    gradeLevel: 'High School (9-12)',
    keyPrinciples: [
      'Website and SEO optimization',
      'Social media marketing',
      'Email marketing',
      'Content marketing',
      'Digital advertising'
    ],
    examples: [
      'SEO: Google search optimization',
      'Social Media: Instagram, TikTok campaigns',
      'Email: Newsletter marketing',
      'Content: Blog posts, videos, infographics'
    ],
    activities: [
      'Create social media campaign',
      'Develop SEO strategy',
      'Design email campaign',
      'Plan content calendar'
    ],
    realWorldApplications: [
      'Online business growth',
      'Brand awareness',
      'Lead generation',
      'Customer engagement'
    ],
    tools: [
      'Google Analytics',
      'Social Media Management Tools',
      'Email Marketing Platforms',
      'SEO Tools'
    ]
  }
]

// Branding Strategies
export const getBrandingStrategies = (): BrandingStrategy[] => [
  {
    id: 'brand-positioning',
    strategy: 'Brand Positioning',
    description: 'Creating a unique place in the market and in consumers\' minds relative to competitors.',
    components: [
      'Target audience identification',
      'Competitive analysis',
      'Unique value proposition',
      'Positioning statement',
      'Brand differentiation'
    ],
    steps: [
      'Analyze target market',
      'Identify competitors',
      'Determine unique attributes',
      'Develop positioning statement',
      'Communicate positioning consistently'
    ],
    examples: [
      'Volvo: Safety positioning',
      'Tesla: Innovation and sustainability',
      'Dove: Real beauty and self-esteem',
      'Red Bull: Energy and extreme sports'
    ],
    benefits: [
      'Clear market identity',
      'Competitive advantage',
      'Customer loyalty',
      'Premium pricing potential'
    ],
    challenges: [
      'Market saturation',
      'Changing consumer preferences',
      'Competitor responses',
      'Maintaining consistency'
    ],
    bestPractices: [
      'Focus on unique strengths',
      'Be consistent across channels',
      'Monitor market changes',
      'Evolve with customer needs'
    ]
  },
  {
    id: 'brand-storytelling',
    strategy: 'Brand Storytelling',
    description: 'Using narrative techniques to communicate brand values and connect emotionally with customers.',
    components: [
      'Brand origin story',
      'Core values and mission',
      'Customer success stories',
      'Emotional connection points',
      'Consistent narrative voice'
    ],
    steps: [
      'Identify core brand story',
      'Develop narrative structure',
      'Create emotional hooks',
      'Choose storytelling channels',
      'Measure engagement'
    ],
    examples: [
      'Patagonia: Environmental activism',
      'Airbnb: Belonging and community',
      'Warby Parker: Social impact',
      'TOMS: One-for-one giving'
    ],
    benefits: [
      'Emotional connection',
      'Brand memorability',
      'Customer loyalty',
      'Differentiation'
    ],
    challenges: [
      'Authenticity maintenance',
      'Story consistency',
      'Measuring impact',
      'Staying relevant'
    ],
    bestPractices: [
      'Be authentic',
      'Focus on customer benefits',
      'Use multiple channels',
      'Evolve story over time'
    ]
  },
  {
    id: 'rebranding',
    strategy: 'Rebranding Strategy',
    description: 'Changing the corporate image and identity to reflect new direction or market position.',
    components: [
      'Brand audit',
      'Market research',
      'New identity development',
      'Implementation plan',
      'Communication strategy'
    ],
    steps: [
      'Conduct brand audit',
      'Research market and customers',
      'Develop new brand identity',
      'Create implementation timeline',
      'Launch and communicate changes'
    ],
    examples: [
      'Burger King: Modern rebrand',
      'Mastercard: Simplified logo',
      'Uber: Brand refresh',
      'Instagram: Logo evolution'
    ],
    benefits: [
      'Modern brand image',
      'Market relevance',
      'Competitive positioning',
      'Growth opportunities'
    ],
    challenges: [
      'Customer confusion',
      'Implementation costs',
      'Brand equity risk',
      'Timeline management'
    ],
    bestPractices: [
      'Maintain core values',
      'Communicate clearly',
      'Plan thoroughly',
      'Monitor feedback'
    ]
  }
]

// Digital Marketing Channels
export const getDigitalMarketingChannels = (): DigitalMarketingChannel[] => [
  {
    id: 'social-media',
    channel: 'Social Media Marketing',
    description: 'Using social media platforms to connect with audiences and promote brands.',
    platforms: [
      'Facebook',
      'Instagram',
      'Twitter/X',
      'LinkedIn',
      'TikTok',
      'YouTube',
      'Pinterest'
    ],
    bestPractices: [
      'Consistent posting schedule',
      'Engaging content creation',
      'Community interaction',
      'Visual storytelling',
      'Hashtag strategy',
      'Influencer partnerships'
    ],
    metrics: [
      'Followers and reach',
      'Engagement rate',
      'Click-through rate',
      'Conversions',
      'Brand mentions',
      'Share of voice'
    ],
    tools: [
      'Hootsuite',
      'Buffer',
      'Sprout Social',
      'Canva',
      'Later',
      'Analytics platforms'
    ],
    targetAudience: [
      'B2C consumers',
      'Young demographics',
      'Visual content lovers',
      'Mobile users'
    ],
    budgetConsiderations: [
      'Content creation costs',
      'Advertising spend',
      'Tool subscriptions',
      'Influencer fees',
      'Time investment'
    ]
  },
  {
    id: 'seo',
    channel: 'Search Engine Optimization (SEO)',
    description: 'Optimizing websites to rank higher in search engine results.',
    platforms: [
      'Google Search',
      'Bing',
      'YouTube',
      'Amazon',
      'Local search'
    ],
    bestPractices: [
      'Keyword research',
      'Quality content creation',
      'Technical SEO',
      'Link building',
      'Mobile optimization',
      'Page speed optimization'
    ],
    metrics: [
      'Organic traffic',
      'Keyword rankings',
      'Click-through rate',
      'Bounce rate',
      'Conversion rate',
      'Domain authority'
    ],
    tools: [
      'Google Analytics',
      'SEMrush',
      'Ahrefs',
      'Moz',
      'Google Search Console',
      'Screaming Frog'
    ],
    targetAudience: [
      'Search users',
      'Information seekers',
      'Purchase researchers',
      'Local customers'
    ],
    budgetConsiderations: [
      'SEO tools costs',
      'Content creation',
      'Link building',
      'Technical improvements',
      'Long-term investment'
    ]
  },
  {
    id: 'email-marketing',
    channel: 'Email Marketing',
    description: 'Sending targeted messages to subscribers to build relationships and drive actions.',
    platforms: [
      'Email service providers',
      'Marketing automation',
      'Newsletter platforms',
      'Transactional emails'
    ],
    bestPractices: [
      'Segmentation',
      'Personalization',
      'Mobile-responsive design',
      'Clear call-to-action',
      'A/B testing',
      'Compliance (GDPR, CAN-SPAM)'
    ],
    metrics: [
      'Open rate',
      'Click-through rate',
      'Conversion rate',
      'Unsubscribe rate',
      'Revenue per email',
      'List growth'
    ],
    tools: [
      'Mailchimp',
      'Constant Contact',
      'HubSpot',
      'SendGrid',
      'Campaign Monitor',
      'ConvertKit'
    ],
    targetAudience: [
      'Existing customers',
      'Newsletter subscribers',
      'Lead nurturing',
      'Retention campaigns'
    ],
    budgetConsiderations: [
      'Platform costs',
      'Email design',
      'List management',
      'Automation setup',
      'Compliance requirements'
    ]
  },
  {
    id: 'content-marketing',
    channel: 'Content Marketing',
    description: 'Creating and distributing valuable content to attract and engage target audiences.',
    platforms: [
      'Blog',
      'Video platforms',
      'Podcasts',
      'Infographics',
      'Ebooks',
      'Webinars'
    ],
    bestPractices: [
      'Value-driven content',
      'SEO optimization',
      'Consistent publishing',
      'Visual elements',
      'Storytelling',
      'Distribution strategy'
    ],
    metrics: [
      'Content views',
      'Engagement time',
      'Shares',
      'Lead generation',
      'Backlinks',
      'Brand awareness'
    ],
    tools: [
      'WordPress',
      'Canva',
      'Video editing tools',
      'Analytics platforms',
      'Content calendars',
      'Distribution tools'
    ],
    targetAudience: [
      'Information seekers',
      'Problem solvers',
      'Decision makers',
      'Brand enthusiasts'
    ],
    budgetConsiderations: [
      'Content creation',
      'Design and editing',
      'Platform costs',
      'Promotion spend',
      'Time investment'
    ]
  },
  {
    id: 'paid-advertising',
    channel: 'Paid Digital Advertising',
    description: 'Promoting brands through paid placements on digital platforms.',
    platforms: [
      'Google Ads',
      'Facebook Ads',
      'LinkedIn Ads',
      'Instagram Ads',
      'YouTube Ads',
      'Display networks'
    ],
    bestPractices: [
      'Target audience definition',
      'Compelling ad creative',
      'Landing page optimization',
      'Bid management',
      'A/B testing',
      'Performance monitoring'
    ],
    metrics: [
      'Impressions',
      'Click-through rate',
      'Cost per click',
      'Conversion rate',
      'Return on ad spend',
      'Quality score'
    ],
    tools: [
      'Google Ads',
      'Facebook Ads Manager',
      'LinkedIn Campaign Manager',
      'Analytics platforms',
      'Bid management tools',
      'Creative testing tools'
    ],
    targetAudience: [
      'Targeted demographics',
      'Interest-based audiences',
      'Lookalike audiences',
      'Retargeting audiences'
    ],
    budgetConsiderations: [
      'Ad spend',
      'Platform fees',
      'Creative production',
      'Landing page development',
      'Testing budget'
    ]
  }
]

// Market Research Methods
export const getMarketResearchMethods = (): MarketResearchMethod[] => [
  {
    id: 'surveys',
    method: 'Surveys',
    description: 'Collecting data from respondents through structured questionnaires.',
    useCases: [
      'Customer satisfaction',
      'Market preferences',
      'Brand awareness',
      'Product feedback'
    ],
    steps: [
      'Define research objectives',
      'Design questionnaire',
      'Select sample',
      'Distribute survey',
      'Collect responses',
      'Analyze data'
    ],
    tools: [
      'SurveyMonkey',
      'Google Forms',
      'Qualtrics',
      'Typeform',
      'Microsoft Forms'
    ],
    advantages: [
      'Large sample sizes',
      'Quantitative data',
      'Cost-effective',
      'Quick collection'
    ],
    limitations: [
      'Response bias',
      'Low response rates',
      'Limited depth',
      'Question design challenges'
    ],
    examples: [
      'Customer satisfaction surveys',
      'Product feature preferences',
      'Brand perception studies',
      'Market size estimation'
    ]
  },
  {
    id: 'focus-groups',
    method: 'Focus Groups',
    description: 'Qualitative research method using group discussions to gather insights.',
    useCases: [
      'Product concept testing',
      'Brand perception',
      'Advertising evaluation',
      'Consumer motivations'
    ],
    steps: [
      'Define objectives',
      'Recruit participants',
      'Develop discussion guide',
      'Conduct session',
      'Moderate discussion',
      'Analyze insights'
    ],
    tools: [
      'Video conferencing',
      'Recording equipment',
      'Discussion guides',
      'Analysis software'
    ],
    advantages: [
      'Rich qualitative data',
      'Group dynamics',
      'Interactive exploration',
      'Immediate feedback'
    ],
    limitations: [
      'Small sample sizes',
      'Groupthink risk',
      'Moderator bias',
      'Higher costs'
    ],
    examples: [
      'New product concepts',
      'Advertising campaigns',
      'Brand positioning',
      'Packaging design'
    ]
  },
  {
    id: 'interviews',
    method: 'In-Depth Interviews',
    description: 'One-on-one conversations to explore topics in detail.',
    useCases: [
      'Customer journey mapping',
      'Expert opinions',
      'Sensitive topics',
      'Detailed exploration'
    ],
    steps: [
      'Define objectives',
      'Recruit interviewees',
      'Prepare interview guide',
      'Conduct interviews',
      'Record and transcribe',
      'Analyze findings'
    ],
    tools: [
      'Recording devices',
      'Video conferencing',
      'Transcription services',
      'Analysis software'
    ],
    advantages: [
      'Deep insights',
      'Personal perspectives',
      'Flexible questioning',
      'Detailed understanding'
    ],
    limitations: [
      'Time intensive',
      'Small sample sizes',
      'Interviewer bias',
      'Higher costs'
    ],
    examples: [
      'Customer experience research',
      'Expert interviews',
      'User research',
      'Case studies'
    ]
  },
  {
    id: 'observation',
    method: 'Observational Research',
    description: 'Watching and recording consumer behavior in natural settings.',
    useCases: [
      'Shopping behavior',
      'Product usage',
      'Store layout effectiveness',
      'Customer experience'
    ],
    steps: [
      'Define observation goals',
      'Select locations',
      'Develop observation protocol',
      'Conduct observations',
      'Record findings',
      'Analyze patterns'
    ],
    tools: [
      'Video recording',
      'Observation forms',
      'Mobile apps',
      'Analytics tools'
    ],
    advantages: [
      'Natural behavior',
      'Unbiased data',
      'Real-world context',
      'Behavioral insights'
    ],
    limitations: [
      'Time intensive',
      'Privacy concerns',
      'Observer effect',
      'Limited explanations'
    ],
    examples: [
      'Store shopping patterns',
      'Website user behavior',
      'Product usage studies',
      'Customer service interactions'
    ]
  },
  {
    id: 'data-analysis',
    method: 'Data Analytics',
    description: 'Analyzing existing data to uncover patterns and insights.',
    useCases: [
      'Sales trends',
      'Customer segmentation',
      'Market trends',
      'Performance analysis'
    ],
    steps: [
      'Identify data sources',
      'Collect data',
      'Clean and prepare',
      'Analyze patterns',
      'Visualize findings',
      'Draw insights'
    ],
    tools: [
      'Google Analytics',
      'Excel',
      'Tableau',
      'Python/R',
      'SQL',
      'Business intelligence tools'
    ],
    advantages: [
      'Large datasets',
      'Objective data',
      'Trend identification',
      'Cost-effective'
    ],
    limitations: [
      'Data quality issues',
      'Technical skills needed',
      'Privacy concerns',
      'Interpretation challenges'
    ],
    examples: [
      'Website analytics',
      'Sales data analysis',
      'Social media metrics',
      'Customer database analysis'
    ]
  }
]

// International Marketing Standards
export const getMarketingStandards = (): MarketingStandard[] => [
  {
    id: 'ama',
    name: 'AMA Marketing Education Standards',
    organization: 'American Marketing Association',
    region: 'United States (Global Application)',
    description: 'Comprehensive standards for marketing education covering core marketing concepts, digital marketing, and ethical practices.',
    keyComponents: [
      'Marketing Fundamentals',
      'Consumer Behavior',
      'Marketing Research',
      'Digital Marketing',
      'Brand Management',
      'Marketing Ethics'
    ],
    gradeLevels: ['High School', 'College'],
    competencies: [
      {
        competency: 'Marketing Fundamentals',
        description: 'Understanding core marketing concepts and frameworks.',
        indicators: [
          'Understands marketing mix (4Ps)',
          'Applies segmentation and targeting',
          'Develops positioning strategies',
          'Creates marketing plans'
        ]
      },
      {
        competency: 'Digital Marketing',
        description: 'Knowledge of digital marketing channels and strategies.',
        indicators: [
          'Understands SEO principles',
          'Uses social media effectively',
          'Implements email marketing',
          'Analyzes digital metrics'
        ]
      },
      {
        competency: 'Marketing Ethics',
        description: 'Understanding ethical considerations in marketing.',
        indicators: [
          'Recognizes ethical issues',
          'Applies ethical frameworks',
          'Understands consumer protection',
          'Practices responsible marketing'
        ]
      }
    ]
  },
  {
    id: 'cim',
    name: 'CIM Marketing Qualifications',
    organization: 'Chartered Institute of Marketing',
    region: 'United Kingdom (Global Application)',
    description: 'Internationally recognized marketing qualifications and standards.',
    keyComponents: [
      'Marketing Principles',
      'Customer Experience',
      'Digital Marketing',
      'Brand Management',
      'Marketing Strategy',
      'Professional Practice'
    ],
    gradeLevels: ['High School', 'College', 'Professional'],
    competencies: [
      {
        competency: 'Marketing Strategy',
        description: 'Developing and implementing marketing strategies.',
        indicators: [
          'Conducts market analysis',
          'Develops marketing strategies',
          'Implements marketing plans',
          'Evaluates marketing performance'
        ]
      },
      {
        competency: 'Customer Experience',
        description: 'Understanding and managing customer relationships.',
        indicators: [
          'Maps customer journeys',
          'Improves customer experience',
          'Builds customer loyalty',
          'Manages customer relationships'
        ]
      }
    ]
  },
  {
    id: 'iaa',
    name: 'IAA Advertising Standards',
    organization: 'International Advertising Association',
    region: 'Global',
    description: 'Global standards for advertising and marketing communications.',
    keyComponents: [
      'Advertising Principles',
      'Creative Development',
      'Media Planning',
      'Campaign Management',
      'Ethical Advertising',
      'Regulatory Compliance'
    ],
    gradeLevels: ['High School', 'College', 'Professional'],
    competencies: [
      {
        competency: 'Creative Development',
        description: 'Creating effective advertising campaigns.',
        indicators: [
          'Develops creative concepts',
          'Creates compelling messages',
          'Designs visual elements',
          'Produces advertising content'
        ]
      },
      {
        competency: 'Ethical Advertising',
        description: 'Understanding and applying ethical advertising principles.',
        indicators: [
          'Follows advertising codes',
          'Ensures truthfulness',
          'Respects consumer rights',
          'Avoids deceptive practices'
        ]
      }
    ]
  },
  {
    id: 'esomar',
    name: 'ESOMAR Market Research Standards',
    organization: 'European Society for Opinion and Market Research',
    region: 'Global',
    description: 'International standards for market research practices and ethics.',
    keyComponents: [
      'Research Methodology',
      'Data Collection',
      'Data Analysis',
      'Research Ethics',
      'Quality Standards',
      'Privacy Protection'
    ],
    gradeLevels: ['College', 'Professional'],
    competencies: [
      {
        competency: 'Research Methodology',
        description: 'Understanding and applying research methods.',
        indicators: [
          'Selects appropriate methods',
          'Designs research studies',
          'Collects quality data',
          'Analyzes research findings'
        ]
      },
      {
        competency: 'Research Ethics',
        description: 'Conducting ethical market research.',
        indicators: [
          'Protects participant privacy',
          'Obtains informed consent',
          'Ensures data security',
          'Reports findings accurately'
        ]
      }
    ]
  },
  {
    id: 'gdpr-marketing',
    name: 'GDPR Marketing Compliance',
    organization: 'European Union',
    region: 'European Union (Global Application)',
    description: 'Data protection regulations affecting marketing practices.',
    keyComponents: [
      'Consent Management',
      'Data Privacy',
      'Marketing Communications',
      'Data Security',
      'Consumer Rights',
      'Compliance Requirements'
    ],
    gradeLevels: ['All levels'],
    competencies: [
      {
        competency: 'Privacy Compliance',
        description: 'Understanding and implementing privacy regulations.',
        indicators: [
          'Obtains proper consent',
          'Protects personal data',
          'Respects consumer rights',
          'Maintains compliance'
        ]
      },
      {
        competency: 'Ethical Data Use',
        description: 'Using customer data ethically and responsibly.',
        indicators: [
          'Transparent data collection',
          'Secure data storage',
          'Respects privacy preferences',
          'Provides opt-out options'
        ]
      }
    ]
  }
]

// Generate Marketing Campaign
export const generateMarketingCampaign = (
  product: string,
  targetAudience: string,
  objective: string
): MarketingCampaign => {
  return {
    id: `campaign-${Date.now()}`,
    title: `Marketing Campaign: ${product}`,
    description: `Comprehensive marketing campaign for ${product} targeting ${targetAudience}`,
    objectives: [
      objective,
      'Increase brand awareness',
      'Drive customer engagement',
      'Generate leads or sales'
    ],
    targetAudience: targetAudience,
    channels: [
      'Social Media',
      'Digital Advertising',
      'Content Marketing',
      'Email Marketing'
    ],
    timeline: '8-12 weeks',
    budget: 'To be determined based on scope',
    keyMessages: [
      `Value proposition for ${product}`,
      'Key benefits and features',
      'Call-to-action message',
      'Brand positioning'
    ],
    tactics: [
      'Content creation',
      'Social media posts',
      'Paid advertising',
      'Email campaigns',
      'Influencer partnerships'
    ],
    successMetrics: [
      'Reach and impressions',
      'Engagement rate',
      'Click-through rate',
      'Conversion rate',
      'Return on investment'
    ],
    caseStudy: `Example: Similar campaign achieved X% increase in awareness and Y% conversion rate`
  }
}

// Get grade levels
export const getGradeLevels = () => [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College'
]

// Get marketing topics
export const getMarketingTopics = () => [
  'Marketing Mix (4Ps)',
  'Market Segmentation',
  'Consumer Behavior',
  'Brand Identity',
  'Digital Marketing',
  'Advertising',
  'Market Research'
]




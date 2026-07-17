import {
  Bot,
  BookOpen,
  Calculator,
  FlaskConical,
  Laptop,
  Palette,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'

export interface CoachTool {
  slug: string
  /** i18n key under chatbotsPage.catalog.<slug>.name / .description */
  i18nKey: string
  /** true for the one real streaming-chat experience; false = guided capability tool */
  isChat: boolean
}

export interface CoachCapability {
  /** Stable id used in ?cap= URL (usually capability_key) */
  id: string
  label: string
  description: string
  toolSlug: string
  /** Internal tab id on the specialist page */
  tabId: string
  /** Backend capability_key when different from id (defaults to id) */
  capabilityKey?: string
  inputHint?: string
  resultHint?: string
}

export interface CoachCategory {
  key: string
  label: string
  description: string
  icon: LucideIcon
  colorClasses: string
  /** @deprecated prefer capabilities — kept for search/tool listing */
  tools: CoachTool[]
  capabilities: CoachCapability[]
}

export const GENERAL_COACH: CoachTool = {
  slug: 'general-teaching-assistant',
  i18nKey: 'general-teaching-assistant',
  isChat: true,
}

function caps(
  toolSlug: string,
  items: Array<{
    id: string
    label: string
    description: string
    tabId: string
    capabilityKey?: string
    inputHint?: string
    resultHint?: string
  }>,
): CoachCapability[] {
  return items.map((item) => ({ ...item, toolSlug }))
}

const literacyCaps = caps('literacy-lab-coach', [
  {
    id: 'text_complexity',
    tabId: 'analyze',
    label: 'Text Complexity Analysis',
    description: 'Paste a reading passage and get grade-level analysis, vocabulary notes, and teaching recommendations.',
    inputHint: 'Passage + grade',
    resultHint: 'Complexity analysis',
  },
  {
    id: 'guided_reading',
    tabId: 'guided',
    label: 'Guided Reading Strategies',
    description: 'Generate before/during/after reading moves, vocabulary, and comprehension questions.',
    inputHint: 'Text + grade',
    resultHint: 'Guided reading plan',
  },
  {
    id: 'writing_feedback',
    tabId: 'writing',
    label: 'Writing Feedback',
    description: 'Review student writing with strengths, improvement areas, and rubric scores.',
    inputHint: 'Student writing',
    resultHint: 'Feedback + rubric',
  },
])

const grammarCaps = caps('grammar-writing-mentor', [
  {
    id: 'grammar_check',
    tabId: 'grammar',
    label: 'Grammar Review',
    description: 'Check grammar and conventions with clear classroom-ready explanations.',
    inputHint: 'Student text',
    resultHint: 'Corrections',
  },
  {
    id: 'writing_feedback',
    tabId: 'feedback',
    label: 'Writing Feedback',
    description: 'Structured feedback on content, organization, language, and conventions.',
    inputHint: 'Draft writing',
    resultHint: 'Feedback report',
  },
  {
    id: 'peer_review_guide',
    tabId: 'peer',
    label: 'Peer Review Guide',
    description: 'Create peer-review prompts and protocols for writing workshops.',
    inputHint: 'Assignment context',
    resultHint: 'Peer review guide',
  },
  {
    id: 'grammar_lesson',
    tabId: 'lessons',
    label: 'Grammar Lessons',
    description: 'Build a short grammar mini-lesson with examples and practice.',
    inputHint: 'Skill + grade',
    resultHint: 'Lesson outline',
  },
])

const literatureCaps = caps('literature-analysis-expert', [
  {
    id: 'theme_exploration',
    tabId: 'theme',
    label: 'Theme Exploration',
    description: 'Surface themes with evidence and discussion-ready teaching notes.',
    inputHint: 'Passage or work',
    resultHint: 'Theme analysis',
  },
  {
    id: 'character_analysis',
    tabId: 'character',
    label: 'Character Analysis',
    description: 'Analyze character traits, motivations, and development.',
    inputHint: 'Text excerpt',
    resultHint: 'Character notes',
  },
  {
    id: 'literary_devices',
    tabId: 'devices',
    label: 'Literary Devices',
    description: 'Identify devices with examples and teaching talking points.',
    inputHint: 'Passage',
    resultHint: 'Device analysis',
  },
  {
    id: 'discussion_prompts',
    tabId: 'discussion',
    label: 'Discussion Questions',
    description: 'Generate layered discussion prompts for literary conversation.',
    inputHint: 'Text + grade',
    resultHint: 'Discussion set',
  },
])

const mathCaps = caps('adaptive-math-strategist', [
  {
    id: 'differentiated_problems',
    tabId: 'problems',
    label: 'Differentiated Problems',
    description: 'Create leveled practice sets for mixed-readiness groups.',
    inputHint: 'Topic + grade',
    resultHint: 'Problem sets',
  },
  {
    id: 'adaptive_learning_path',
    tabId: 'adaptive',
    label: 'Adaptive Learning Path',
    description: 'Sequence practice from prerequisite gaps to target skill.',
    inputHint: 'Skill + evidence',
    resultHint: 'Learning path',
  },
  {
    id: 'conceptual_learning',
    tabId: 'concepts',
    label: 'Concept Explanation',
    description: 'Explain a math concept with models, language, and checks for understanding.',
    inputHint: 'Concept + grade',
    resultHint: 'Concept guide',
  },
  {
    id: 'intervention_strategies',
    tabId: 'intervention',
    label: 'Short Intervention Ideas',
    description: 'Plan quick intervention moves for students who are stuck.',
    inputHint: 'Struggle area',
    resultHint: 'Intervention plan',
  },
])

const stemCaps = caps('stem-inquiry-mentor', [
  {
    id: 'ngss_investigation',
    tabId: 'investigation',
    label: 'NGSS Investigation',
    description: 'Design an investigation aligned to NGSS practices and phenomena.',
    inputHint: 'Topic + grade',
    resultHint: 'Investigation plan',
  },
  {
    id: 'engineering_design',
    tabId: 'engineering',
    label: 'Engineering Design',
    description: 'Scaffold an engineering design challenge with constraints and criteria.',
    inputHint: 'Challenge idea',
    resultHint: 'Design brief',
  },
  {
    id: 'inquiry_guidance',
    tabId: 'inquiry',
    label: 'Inquiry Guidance',
    description: 'Guide student questioning, evidence gathering, and explanation.',
    inputHint: 'Phenomenon',
    resultHint: 'Inquiry moves',
  },
])

const labCaps = caps('lab-safety-protocol-advisor', [
  {
    id: 'lab_safety_standards',
    tabId: 'standards',
    label: 'Lab Safety Standards',
    description: 'Map safety expectations for a lab activity and grade band.',
    inputHint: 'Lab context',
    resultHint: 'Standards notes',
  },
  {
    id: 'lab_safety_protocols',
    tabId: 'protocols',
    label: 'Safety Protocols',
    description: 'Generate step-by-step safety protocols teachers can post and teach.',
    inputHint: 'Activity',
    resultHint: 'Protocol',
  },
  {
    id: 'lab_risk_assessment',
    tabId: 'risk-assessment',
    label: 'Risk Assessment',
    description: 'Identify hazards and mitigation steps before students begin.',
    inputHint: 'Experiment',
    resultHint: 'Risk assessment',
  },
  {
    id: 'lab_chemical_safety',
    tabId: 'chemicals',
    label: 'Chemical Safety',
    description: 'Guidance for handling, storage, and student-safe chemical use.',
    inputHint: 'Chemicals used',
    resultHint: 'Chemical safety notes',
  },
  {
    id: 'lab_equipment_safety',
    tabId: 'equipment',
    label: 'Equipment Safety',
    description: 'Safe setup and use reminders for common lab equipment.',
    inputHint: 'Equipment list',
    resultHint: 'Equipment guide',
  },
  {
    id: 'lab_emergency_procedures',
    tabId: 'emergency',
    label: 'Emergency Procedures',
    description: 'Clear emergency response language for classroom labs.',
    inputHint: 'Lab setting',
    resultHint: 'Emergency plan',
  },
  {
    id: 'lab_experiment_design',
    tabId: 'experiment-design',
    label: 'Experiment Design',
    description: 'Structure a safer, clearer student experiment workflow.',
    inputHint: 'Investigation goal',
    resultHint: 'Experiment design',
  },
])

const envCaps = caps('environmental-science-guide', [
  {
    id: 'global_climate_education',
    tabId: 'climate',
    label: 'Climate Education',
    description: 'Teach climate concepts with grade-appropriate framing and activities.',
    inputHint: 'Topic + grade',
    resultHint: 'Climate lesson ideas',
  },
  {
    id: 'sustainability_projects',
    tabId: 'sustainability',
    label: 'Sustainability Projects',
    description: 'Design project-based sustainability work students can complete.',
    inputHint: 'Focus area',
    resultHint: 'Project outline',
  },
  {
    id: 'ecological_systems',
    tabId: 'ecosystems',
    label: 'Ecological Systems',
    description: 'Explain ecosystems and interactions with classroom examples.',
    inputHint: 'System topic',
    resultHint: 'Ecosystem guide',
  },
  {
    id: 'regional_climate_analysis',
    tabId: 'regional',
    label: 'Regional Climate Analysis',
    description: 'Localize climate learning to a region students recognize.',
    inputHint: 'Region',
    resultHint: 'Regional analysis',
  },
  {
    id: 'environmental_standards',
    tabId: 'standards',
    label: 'Environmental Standards',
    description: 'Align environmental learning to relevant standards language.',
    inputHint: 'Unit focus',
    resultHint: 'Standards map',
  },
  {
    id: 'sustainability_assessment_tools',
    tabId: 'assessment',
    label: 'Assessment Tools',
    description: 'Build checks for understanding around sustainability learning.',
    inputHint: 'Learning goals',
    resultHint: 'Assessment tools',
  },
  {
    id: 'environmental_action_planning',
    tabId: 'action-plan',
    label: 'Action Planning',
    description: 'Help students turn learning into a realistic environmental action plan.',
    inputHint: 'Issue + constraints',
    resultHint: 'Action plan',
  },
])

const codingCaps = caps('coding-programming-tutor', [
  {
    id: 'competition_analyzer',
    tabId: 'competition',
    label: 'Competition Analyzer',
    description: 'Break down contest-style problems into teachable steps.',
    inputHint: 'Problem statement',
    resultHint: 'Solution path',
  },
  {
    id: 'algorithm_tutor',
    tabId: 'algorithm',
    label: 'Algorithm Tutor',
    description: 'Explain algorithms with classroom-friendly scaffolding.',
    inputHint: 'Algorithm topic',
    resultHint: 'Algorithm lesson',
  },
  {
    id: 'debugging_assistant',
    tabId: 'debugging',
    label: 'Debugging Assistant',
    description: 'Diagnose buggy student code and suggest teaching moves.',
    inputHint: 'Code + error',
    resultHint: 'Debug guidance',
  },
  {
    id: 'project_planner',
    tabId: 'pbl',
    label: 'Project Planner',
    description: 'Plan a coding project with milestones and checkpoints.',
    inputHint: 'Project idea',
    resultHint: 'Project plan',
  },
  {
    id: 'computational_thinking',
    tabId: 'thinking',
    label: 'Computational Thinking',
    description: 'Build CT warm-ups and practice without requiring heavy syntax.',
    inputHint: 'Grade + focus',
    resultHint: 'CT activities',
  },
  {
    id: 'competition_roadmap',
    tabId: 'roadmap',
    label: 'Competition Roadmap',
    description: 'Sequence preparation for coding contests or olympiads.',
    inputHint: 'Contest goal',
    resultHint: 'Prep roadmap',
  },
  {
    id: 'standards_alignment',
    tabId: 'standards',
    label: 'Standards Alignment',
    description: 'Align coding activities to CS or computational thinking standards.',
    inputHint: 'Unit focus',
    resultHint: 'Standards map',
  },
])

const digitalCaps = caps('digital-literacy-advisor', [
  {
    id: 'digital_citizenship',
    tabId: 'digital-citizenship',
    label: 'Digital Citizenship',
    description: 'Teach responsible online behavior with practical classroom scenarios.',
    inputHint: 'Grade + focus',
    resultHint: 'Citizenship plan',
  },
  {
    id: 'online_safety',
    tabId: 'online-safety',
    label: 'Online Safety',
    description: 'Create age-appropriate online safety guidance and discussion prompts.',
    inputHint: 'Risk area',
    resultHint: 'Safety guidance',
  },
  {
    id: 'media_literacy',
    tabId: 'media-literacy',
    label: 'Media Literacy',
    description: 'Help students evaluate sources, claims, and media messages.',
    inputHint: 'Media topic',
    resultHint: 'Media literacy set',
  },
  {
    id: 'tech_integration',
    tabId: 'technology-integration',
    label: 'Tech Integration',
    description: 'Plan purposeful classroom technology use tied to learning goals.',
    inputHint: 'Lesson goal',
    resultHint: 'Integration plan',
  },
  {
    id: 'standards',
    tabId: 'standards',
    label: 'Digital Standards',
    description: 'Align digital learning with ISTE-style or local digital standards.',
    inputHint: 'Unit focus',
    resultHint: 'Standards map',
  },
])

const aiMlCaps = caps('ai-machine-learning-educator', [
  {
    id: 'ai_concepts',
    tabId: 'ai-concepts',
    label: 'AI Concepts',
    description: 'Explain AI ideas in teacher-friendly, grade-aware language.',
    inputHint: 'Concept + grade',
    resultHint: 'Concept lesson',
  },
  {
    id: 'ethical_ai',
    tabId: 'ethical-ai',
    label: 'Ethical AI',
    description: 'Facilitate classroom conversations about AI ethics and bias.',
    inputHint: 'Scenario',
    resultHint: 'Ethics guide',
  },
  {
    id: 'ml_projects',
    tabId: 'ml-projects',
    label: 'ML Projects',
    description: 'Design approachable machine-learning classroom projects.',
    inputHint: 'Project theme',
    resultHint: 'Project outline',
  },
  {
    id: 'ai_standards',
    tabId: 'standards',
    label: 'AI Standards',
    description: 'Connect AI learning to standards and curriculum language.',
    inputHint: 'Unit focus',
    resultHint: 'Standards map',
  },
])

const artsCaps = [
  ...caps('visual-arts-studio-assistant', [
    {
      id: 'art_history_explorer',
      tabId: 'history',
      label: 'Art History Explorer',
      description: 'Explore movements and artists with classroom discussion hooks.',
      inputHint: 'Movement or artist',
      resultHint: 'History brief',
    },
    {
      id: 'art_technique_guidance',
      tabId: 'technique',
      label: 'Technique Guidance',
      description: 'Teach techniques with steps, materials, and differentiation.',
      inputHint: 'Technique',
      resultHint: 'Technique guide',
    },
    {
      id: 'portfolio_development',
      tabId: 'portfolio',
      label: 'Portfolio Development',
      description: 'Help students curate and reflect on portfolio work.',
      inputHint: 'Portfolio goal',
      resultHint: 'Portfolio plan',
    },
    {
      id: 'creative_project_generator',
      tabId: 'projects',
      label: 'Creative Projects',
      description: 'Generate creative studio projects with constraints and criteria.',
      inputHint: 'Theme + grade',
      resultHint: 'Project brief',
    },
    {
      id: 'visual_literacy_analysis',
      tabId: 'literacy',
      label: 'Visual Literacy',
      description: 'Analyze images for meaning, composition, and cultural context.',
      inputHint: 'Image context',
      resultHint: 'Visual analysis',
    },
    {
      id: 'cultural_connections',
      tabId: 'cultural',
      label: 'Cultural Connections',
      description: 'Connect artworks to culture, identity, and place respectfully.',
      inputHint: 'Artwork focus',
      resultHint: 'Cultural notes',
    },
    {
      id: 'art_assessment_builder',
      tabId: 'assessment',
      label: 'Art Assessment',
      description: 'Build rubrics and reflection prompts for studio work.',
      inputHint: 'Assignment',
      resultHint: 'Assessment tools',
    },
  ]),
  ...caps('music-performance-coach', [
    {
      id: 'music_theory',
      tabId: 'theory',
      label: 'Music Theory',
      description: 'Explain theory concepts with practice and listening ideas.',
      inputHint: 'Theory topic',
      resultHint: 'Theory lesson',
    },
    {
      id: 'music_composition',
      tabId: 'composition',
      label: 'Composition',
      description: 'Scaffold student composition tasks by level.',
      inputHint: 'Composition goal',
      resultHint: 'Composition guide',
    },
    {
      id: 'performance_techniques',
      tabId: 'performance',
      label: 'Performance Techniques',
      description: 'Coach performance technique and rehearsal focus.',
      inputHint: 'Instrument/voice',
      resultHint: 'Technique notes',
    },
    {
      id: 'ensemble_coordination',
      tabId: 'ensemble',
      label: 'Ensemble Coordination',
      description: 'Plan ensemble rehearsal structures and roles.',
      inputHint: 'Ensemble type',
      resultHint: 'Rehearsal plan',
    },
    {
      id: 'music_pedagogy',
      tabId: 'pedagogy',
      label: 'Music Pedagogy',
      description: 'Get teaching moves for music classrooms and studios.',
      inputHint: 'Teaching challenge',
      resultHint: 'Pedagogy guidance',
    },
    {
      id: 'music_games',
      tabId: 'games',
      label: 'Music Games',
      description: 'Generate engaging music warm-ups and learning games.',
      inputHint: 'Skill focus',
      resultHint: 'Game ideas',
    },
    {
      id: 'music_standards',
      tabId: 'standards',
      label: 'Music Standards',
      description: 'Align music activities to standards language.',
      inputHint: 'Unit focus',
      resultHint: 'Standards map',
    },
  ]),
  ...caps('drama-theater-director', [
    {
      id: 'script_analysis_tools',
      tabId: 'script-analysis',
      label: 'Script Analysis',
      description: 'Analyze scripts for theme, conflict, and teaching opportunities.',
      inputHint: 'Script excerpt',
      resultHint: 'Script analysis',
    },
    {
      id: 'character_development',
      tabId: 'character',
      label: 'Character Development',
      description: 'Support actors with character objectives and choices.',
      inputHint: 'Character',
      resultHint: 'Character work',
    },
    {
      id: 'stage_direction',
      tabId: 'stage-direction',
      label: 'Stage Direction',
      description: 'Plan blocking notes and staging intentions clearly.',
      inputHint: 'Scene',
      resultHint: 'Staging notes',
    },
    {
      id: 'production_planning',
      tabId: 'production',
      label: 'Production Planning',
      description: 'Organize production timelines, roles, and checkpoints.',
      inputHint: 'Show context',
      resultHint: 'Production plan',
    },
    {
      id: 'acting_methods',
      tabId: 'acting-methods',
      label: 'Acting Methods',
      description: 'Introduce acting methods with classroom-safe exercises.',
      inputHint: 'Method focus',
      resultHint: 'Method guide',
    },
    {
      id: 'theater_styles',
      tabId: 'theater-styles',
      label: 'Theater Styles',
      description: 'Compare theater styles and how to teach them.',
      inputHint: 'Style',
      resultHint: 'Style notes',
    },
    {
      id: 'theater_standards',
      tabId: 'standards',
      label: 'Theater Standards',
      description: 'Align drama work to arts standards language.',
      inputHint: 'Unit focus',
      resultHint: 'Standards map',
    },
  ]),
]

const careerCaps = [
  ...caps('business-studies-mentor', [
    {
      id: 'international_standards',
      tabId: 'standards',
      label: 'Business Standards',
      description: 'Connect business topics to international or local standards.',
      inputHint: 'Topic',
      resultHint: 'Standards notes',
    },
    {
      id: 'entrepreneurship_framework',
      tabId: 'entrepreneurship',
      label: 'Entrepreneurship',
      description: 'Scaffold entrepreneurship projects and pitch readiness.',
      inputHint: 'Venture idea',
      resultHint: 'Framework',
    },
    {
      id: 'economic_concepts',
      tabId: 'economics',
      label: 'Economic Concepts',
      description: 'Explain economics concepts with classroom examples.',
      inputHint: 'Concept',
      resultHint: 'Concept guide',
    },
    {
      id: 'financial_literacy_module',
      tabId: 'financial',
      label: 'Financial Literacy',
      description: 'Build financial literacy modules students can apply.',
      inputHint: 'Skill focus',
      resultHint: 'Module outline',
    },
    {
      id: 'business_scenarios',
      tabId: 'scenarios',
      label: 'Business Scenarios',
      description: 'Create realistic case scenarios for discussion and decisions.',
      inputHint: 'Industry/context',
      resultHint: 'Scenario set',
    },
    {
      id: 'trade_agreements',
      tabId: 'trade',
      label: 'Trade Agreements',
      description: 'Teach trade concepts through accessible classroom framing.',
      inputHint: 'Trade topic',
      resultHint: 'Trade notes',
    },
    {
      id: 'cross_cultural_guide',
      tabId: 'cultural',
      label: 'Cross-Cultural Guide',
      description: 'Prepare students for cross-cultural business communication.',
      inputHint: 'Context',
      resultHint: 'Cultural guide',
    },
  ]),
  ...caps('career-readiness-coach', [
    {
      id: 'international_resume_builder',
      tabId: 'resume',
      label: 'Resume Builder',
      description: 'Coach resume structure and language for student readiness.',
      inputHint: 'Target role',
      resultHint: 'Resume guidance',
    },
    {
      id: 'interview_prep',
      tabId: 'interview',
      label: 'Interview Prep',
      description: 'Practice interview questions with feedback framing.',
      inputHint: 'Role/industry',
      resultHint: 'Interview set',
    },
    {
      id: 'professional_skills_competencies',
      tabId: 'skills',
      label: 'Professional Skills',
      description: 'Map workplace competencies to classroom practice.',
      inputHint: 'Skill focus',
      resultHint: 'Skills plan',
    },
    {
      id: 'industry_insights',
      tabId: 'industry',
      label: 'Industry Insights',
      description: 'Give students a clear picture of industry pathways.',
      inputHint: 'Industry',
      resultHint: 'Industry brief',
    },
    {
      id: 'career_pathway_planning',
      tabId: 'pathway',
      label: 'Career Pathways',
      description: 'Help students plan next steps toward a pathway.',
      inputHint: 'Interest area',
      resultHint: 'Pathway plan',
    },
    {
      id: 'linkedin_guide',
      tabId: 'linkedin',
      label: 'LinkedIn Guide',
      description: 'Guide professional profile building for older students.',
      inputHint: 'Student goal',
      resultHint: 'Profile guide',
    },
    {
      id: 'skills_assessment_gap_analysis',
      tabId: 'assessment',
      label: 'Skills Assessment',
      description: 'Identify skill gaps and suggest targeted practice.',
      inputHint: 'Target role',
      resultHint: 'Gap analysis',
    },
  ]),
  ...caps('marketing-branding-strategist', [
    {
      id: 'marketing_concepts',
      tabId: 'marketing-concepts',
      label: 'Marketing Concepts',
      description: 'Teach core marketing ideas with classroom examples.',
      inputHint: 'Concept',
      resultHint: 'Concept lesson',
    },
    {
      id: 'branding_strategies',
      tabId: 'branding',
      label: 'Branding Strategies',
      description: 'Help students build brand identity and positioning.',
      inputHint: 'Brand context',
      resultHint: 'Branding plan',
    },
    {
      id: 'digital_marketing_channels',
      tabId: 'digital-marketing',
      label: 'Digital Marketing',
      description: 'Compare digital channels and when to use them.',
      inputHint: 'Campaign goal',
      resultHint: 'Channel plan',
    },
    {
      id: 'market_research_methods',
      tabId: 'market-research',
      label: 'Market Research',
      description: 'Design simple market-research activities for class.',
      inputHint: 'Research question',
      resultHint: 'Research plan',
    },
    {
      id: 'compaign',
      tabId: 'campaigns',
      label: 'Campaigns',
      description: 'Plan a classroom marketing campaign from brief to message.',
      inputHint: 'Campaign brief',
      resultHint: 'Campaign outline',
    },
    {
      id: 'international_marketing_standards',
      tabId: 'standards',
      label: 'Marketing Standards',
      description: 'Align marketing learning to standards language.',
      inputHint: 'Unit focus',
      resultHint: 'Standards map',
    },
  ]),
]

function toolsFromCaps(capabilityList: CoachCapability[]): CoachTool[] {
  const seen = new Set<string>()
  const out: CoachTool[] = []
  for (const c of capabilityList) {
    if (seen.has(c.toolSlug)) continue
    seen.add(c.toolSlug)
    out.push({ slug: c.toolSlug, i18nKey: c.toolSlug, isChat: false })
  }
  return out
}

export const COACH_CATEGORIES: CoachCategory[] = [
  {
    key: 'literacy',
    label: 'Literacy & Writing Coach',
    description: 'Reading strategies, writing feedback, and literary analysis.',
    icon: BookOpen,
    colorClasses: 'bg-blue-50 text-blue-600 border-blue-200',
    capabilities: [...literacyCaps, ...grammarCaps, ...literatureCaps],
    tools: toolsFromCaps([...literacyCaps, ...grammarCaps, ...literatureCaps]),
  },
  {
    key: 'math',
    label: 'Math Coach',
    description: 'Differentiated problem sets and conceptual understanding support.',
    icon: Calculator,
    colorClasses: 'bg-green-50 text-green-600 border-green-200',
    capabilities: mathCaps,
    tools: toolsFromCaps(mathCaps),
  },
  {
    key: 'stem',
    label: 'STEM Coach',
    description: 'Inquiry investigations, lab safety, and environmental science.',
    icon: FlaskConical,
    colorClasses: 'bg-purple-50 text-purple-600 border-purple-200',
    capabilities: [...stemCaps, ...labCaps, ...envCaps],
    tools: toolsFromCaps([...stemCaps, ...labCaps, ...envCaps]),
  },
  {
    key: 'digital',
    label: 'Digital Learning Coach',
    description: 'Coding, digital citizenship, and AI/ML for the classroom.',
    icon: Laptop,
    colorClasses: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    capabilities: [...codingCaps, ...digitalCaps, ...aiMlCaps],
    tools: toolsFromCaps([...codingCaps, ...digitalCaps, ...aiMlCaps]),
  },
  {
    key: 'arts',
    label: 'Creative Arts Coach',
    description: 'Visual arts, music, and drama & theater guidance.',
    icon: Palette,
    colorClasses: 'bg-pink-50 text-pink-600 border-pink-200',
    capabilities: artsCaps,
    tools: toolsFromCaps(artsCaps),
  },
  {
    key: 'career',
    label: 'Career & Business Coach',
    description: 'Business studies, career readiness, and marketing.',
    icon: Briefcase,
    colorClasses: 'bg-amber-50 text-amber-600 border-amber-200',
    capabilities: careerCaps,
    tools: toolsFromCaps(careerCaps),
  },
]

export function findCategory(categoryKey: string): CoachCategory | undefined {
  return COACH_CATEGORIES.find((c) => c.key === categoryKey)
}

export function allVisibleTools(): CoachTool[] {
  return [GENERAL_COACH, ...COACH_CATEGORIES.flatMap((c) => c.tools)]
}

export function allCapabilities(): CoachCapability[] {
  return COACH_CATEGORIES.flatMap((c) => c.capabilities)
}

export function findCapability(capId: string, toolSlug?: string): CoachCapability | undefined {
  return allCapabilities().find((c) => c.id === capId && (!toolSlug || c.toolSlug === toolSlug))
}

export function capabilitiesForTool(toolSlug: string): CoachCapability[] {
  return allCapabilities().filter((c) => c.toolSlug === toolSlug)
}

export function firstCapabilityForTool(toolSlug: string): CoachCapability | undefined {
  return capabilitiesForTool(toolSlug)[0]
}

export function categoryForTool(toolSlug: string): CoachCategory | undefined {
  return COACH_CATEGORIES.find((c) => c.tools.some((t) => t.slug === toolSlug) || c.capabilities.some((cap) => cap.toolSlug === toolSlug))
}

export function capabilityWorkspacePath(cap: CoachCapability): string {
  return `/chatbots/${cap.toolSlug}?cap=${encodeURIComponent(cap.id)}`
}

export { Bot as GeneralCoachIcon }

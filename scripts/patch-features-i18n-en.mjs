import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const localePath = path.join(root, 'src/locales/en-US.json')
const locale = JSON.parse(readFileSync(localePath, 'utf8'))

locale.chatbotsPage = {
  rating: '{{value}}★',
  hero: {
    badge: 'AI Teaching Assistants',
    title: 'Meet your AI co-teachers.',
    description:
      'Choose from our general assistant or subject-specific bots trained on curriculum data and pedagogical best practices.',
    startNewChat: 'Start a new chat',
  },
  search: { placeholder: 'Search by subject, standard, or teaching goal' },
  filter: { allBots: 'All bots', favorites: 'Favorites' },
  general: {
    sectionTitle: 'General Teaching Assistant',
    sectionSubtitle: 'Your all-purpose AI assistant for everyday teaching tasks',
    name: 'General Teaching Assistant',
    description:
      'Your versatile AI companion for lesson planning, assessment ideas, and classroom management support. Perfect for getting started with AI-powered teaching tools.',
    startChatting: 'Start chatting',
    features: {
      lessonPlanning: 'Lesson planning assistance',
      assessmentIdeas: 'Assessment ideas generation',
      classroomManagement: 'Classroom management tips',
      quickQa: 'Quick Q&A support',
    },
  },
  subjects: {
    title: 'Subject-Specific Specialists',
    description:
      'Bots with deep curriculum knowledge and pedagogical expertise for each subject area',
    botCount: '{{count}} specialized bots',
  },
  categories: {
    english: 'English',
    mathematics: 'Mathematics',
    sciences: 'Sciences',
    business: 'Business',
    arts: 'Arts',
    technology: 'Technology',
  },
  actions: {
    startChat: 'Start chat →',
    temporarilyUnavailable: 'Temporarily unavailable',
    creditsApply: 'Credits apply per tool',
  },
  catalog: {
    'literacy-lab-coach': {
      name: 'Literacy Lab Coach',
      description:
        'Guided reading strategies, text complexity analysis, and writing feedback tailored to grade levels.',
    },
    'grammar-writing-mentor': {
      name: 'Grammar & Writing Mentor',
      description: 'Grammar instruction, writing workshop facilitation, and peer review guidance.',
    },
    'literature-analysis-expert': {
      name: 'Literature Analysis Expert',
      description:
        'Literary analysis, theme exploration, and discussion prompts for classic and contemporary texts.',
    },
    'advanced-knowledge-skills-coach': {
      name: 'Advanced Knowledge and Skills Coach',
      description: "This tool will increase teachers' knowledge and skills on modern pedagogical methods.",
    },
    'unec-academic-development': {
      name: 'UNEC Academic Development & Innovation',
      description:
        'Comprehensive program for syllabus design, assessment, digital literacy, AI integration, and student-centered teaching methods.',
    },
    'adaptive-math-strategist': {
      name: 'Adaptive Math Strategist',
      description:
        'Differentiated problem sets, step-by-step modeling, and conceptual understanding support.',
    },
    'problem-solving-coach': {
      name: 'Problem-Solving Coach',
      description:
        'Real-world math applications, word problem strategies, and mathematical reasoning development.',
    },
    'algebra-geometry-tutor': {
      name: 'Algebra & Geometry Tutor',
      description: 'Visual explanations, proof strategies, and scaffolded practice for advanced mathematics.',
    },
    'stem-inquiry-mentor': {
      name: 'STEM Inquiry Mentor',
      description: 'NGSS-aligned investigations, engineering design challenges, and scientific method guidance.',
    },
    'lab-safety-protocol-advisor': {
      name: 'Lab Safety & Protocol Advisor',
      description: 'Safety protocols, experiment design, and hands-on activity planning for science labs.',
    },
    'environmental-science-guide': {
      name: 'Environmental Science Guide',
      description: 'Climate education, sustainability projects, and ecological systems understanding.',
    },
    'business-studies-mentor': {
      name: 'Business Studies Mentor',
      description: 'Entrepreneurship, economics, financial literacy, and real-world business scenarios.',
    },
    'career-readiness-coach': {
      name: 'Career Readiness Coach',
      description: 'Resume building, interview prep, professional skills, and industry insights.',
    },
    'marketing-branding-strategist': {
      name: 'Marketing & Branding Strategist',
      description: 'Marketing fundamentals, branding strategies, digital marketing, and market research.',
    },
    'visual-arts-studio-assistant': {
      name: 'Visual Arts Studio Assistant',
      description: 'Art history, technique guidance, portfolio development, and creative project ideas.',
    },
    'music-performance-coach': {
      name: 'Music & Performance Coach',
      description: 'Music theory, composition, performance techniques, and ensemble coordination.',
    },
    'drama-theater-director': {
      name: 'Drama & Theater Director',
      description: 'Script analysis, character development, stage direction, and production planning.',
    },
    'coding-programming-tutor': {
      name: 'Coding & Programming Tutor',
      description:
        'Programming concepts, debugging help, project-based learning, and computational thinking.',
    },
    'digital-literacy-advisor': {
      name: 'Digital Literacy Advisor',
      description:
        'Digital citizenship, online safety, media literacy, and technology integration strategies.',
    },
    'ai-machine-learning-educator': {
      name: 'AI & Machine Learning Educator',
      description: 'AI concepts for students, ethical AI discussions, and hands-on ML projects.',
    },
  },
}

const yq = locale.youtubeQuizPage ?? {}
Object.assign(yq, {
  hero: {
    badge: 'YouTube Quiz Generator',
    title: 'Turn a YouTube lesson into a classroom-ready quiz.',
    description: 'Paste a link, choose your audience, and generate scaffolded questions in seconds.',
    dismissAria: 'Dismiss banner',
    dismiss: 'Dismiss',
    pillStandards: 'Standards-aligned prompts',
    pillMultilingual: 'Multilingual support',
    pillDifferentiation: 'Differentiation-ready',
    collapsedTitle: 'YouTube Quiz Generator',
    collapsedHint: 'Paste a link → tune settings → generate.',
    expand: 'Expand',
  },
  progress: {
    comprehensionLabel: 'Video comprehension rate',
    comprehensionValue: '87%',
    comprehensionCaption: 'Average score for last 14 generated quizzes.',
    timeSavedLabel: 'Time saved per quiz',
    timeSavedValue: '28 min',
    timeSavedCaption: 'Compared with manual question design.',
    reflectionLabel: 'Student reflection prompts',
    reflectionValue: 'Included',
    reflectionCaption: 'Every quiz comes with SEL-aware reflection ideas.',
  },
  sticky: {
    title: 'Generate your quiz blueprint',
    strategyApplied: 'Strategy: {{title}}',
    urlLabel: 'YouTube video link',
    urlPlaceholder: 'https://www.youtube.com/watch?v=...',
    preview: 'Preview',
    generate: 'Generate quiz',
    analysing: 'Analysing…',
  },
  blueprint: {
    title: 'Blueprint details',
    description:
      'Set your audience and preferences. The link and Generate button are always available in the sticky bar above.',
    gradeBand: 'Grade band',
    subjectLens: 'Subject lens',
    learningFocus: 'Learning focus',
    quizLanguage: 'Quiz language',
    questionStyles: 'Question styles',
    questionCount: 'Question count',
    promptsCount: '{{count}} prompts',
    sliderHint: 'Slider adjusts pacing recommendations & differentiations.',
    intelligenceTitle: 'Quiz Intelligence controls',
    adaptiveDifficulty: 'Adaptive difficulty',
    accessibilityAssistant: 'Accessibility assistant',
    accessibilityMode: 'Accessibility Mode: {{state}}',
    accessibilityOn: 'ON',
    accessibilityOff: 'OFF',
    worksheetHint:
      'Worksheet from Quiz becomes available after generation and uses your generated quiz result.',
  },
  gradeBands: {
    grades35: 'Grades 3-5',
    grades68: 'Grades 6-8',
    grades910: 'Grades 9-10',
    grades1112: 'Grades 11-12',
    higherEd: 'Higher Education',
  },
  subjects: {
    scienceStem: 'Science & STEM',
    mathematics: 'Mathematics',
    englishLanguageArts: 'English Language Arts',
    socialSciences: 'Social Sciences',
    creativeArtsMedia: 'Creative Arts & Media',
    careerTechnical: 'Career & Technical Education',
  },
  learningFocusOptions: {
    conceptComprehension: 'Concept comprehension',
    vocabularyDevelopment: 'Vocabulary development',
    criticalAnalysis: 'Critical analysis',
    labSkills: 'Lab skills & procedures',
    projectReflection: 'Project reflection',
  },
  languages: {
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    arabic: 'Arabic',
    hindi: 'Hindi',
  },
  questionStyles: {
    multipleChoice: 'Multiple choice',
    higherOrder: 'Higher-order thinking',
    quickCheck: 'Quick check',
    discussionPrompt: 'Discussion prompt',
  },
  difficulty: {
    easy: 'Easy',
    medium: 'Medium',
    challenging: 'Challenging',
  },
  examples: {
    title: 'Try with example videos',
    hint: 'Click a card to fill the link and suggested grade/subject above — then press Generate quiz when you are ready.',
    photosynthesis: {
      title: 'Photosynthesis Explained - Crash Course Biology',
      description: 'Perfect for biology units on plant processes and energy conversion.',
    },
    waterCycle: {
      title: 'The Water Cycle - Educational Video for Kids',
      description: 'Engaging explanation of the water cycle with visual animations.',
    },
    fractions: {
      title: 'Introduction to Fractions - Math Antics',
      description: 'Clear introduction to fractions with step-by-step examples.',
    },
    worldWarIi: {
      title: 'World War II: Crash Course World History',
      description: 'Comprehensive overview of WWII with historical context and analysis.',
    },
    scientificMethod: {
      title: 'The Scientific Method - Khan Academy',
      description: 'Step-by-step guide to the scientific method with real examples.',
    },
  },
  workflow: {
    grabLink: {
      title: 'Grab the lesson link',
      description:
        'We pull transcripts, chapter markers, and engagement cues directly from the video metadata.',
    },
    layerPedagogy: {
      title: 'Layer pedagogy intelligence',
      description: "Question stems align to Webb's DOK and Bloom's taxonomy with SEL-aware scaffolds.",
    },
    publishShare: {
      title: 'Publish & share instantly',
      description: 'Export to Google Forms, LMS quizzes, or printable exit tickets with one click.',
    },
  },
  pedagogy: {
    preWatch: {
      title: 'Pre-watch prompts',
      body: 'Set purpose before pressing play. Students note predictions or questions to activate prior knowledge.',
    },
    listening: {
      title: 'Listening evidence',
      body: 'Prompt oral summaries or think-pair-share moments between quiz sections to check comprehension.',
    },
    transfer: {
      title: 'Transfer & reflection',
      body: 'Wrap with a creative task: connect the video to real-world practice or design challenges.',
    },
  },
  sidebar: {
    classroomUseTitle: 'Sample classroom use',
    dayBeforeTitle: 'Day-before preview',
    dayBeforeBody:
      'Share the quiz as pre-work. Students collect unfamiliar vocab while watching at home, then tackle higher-order prompts when class begins.',
    stationTitle: 'Station rotation',
    stationBody:
      'Set up a media lab station featuring the clip, earbuds, and QR code access to the adaptive quiz.',
    documentaryTitle: 'Mini-documentary study',
    documentaryBody:
      'Pair longer-form YouTube documentaries with reflection prompts to build media literacy and note-taking habits.',
    guardrailsTitle: 'Pedagogical guardrails',
  },
  validation: {
    invalidUrl: 'Please paste a valid YouTube watch/share/shorts URL.',
  },
  toasts: {
    exampleLoaded:
      'Example loaded — review settings in the sticky bar, then click Generate quiz.',
    adaptiveDifficulty: 'Adaptive Difficulty: {{level}}',
    accessibilityEnabled: 'Accessibility Assistant: Enabled',
    accessibilityDisabled: 'Accessibility Assistant: Disabled',
  },
  errors: {
    generationFailed: 'Quiz generation failed. Please try again.',
    invalidRequest: 'Invalid request. Please check the YouTube link and form inputs.',
    serverFailed: 'Quiz generation failed on the server. Please retry in a moment.',
    networkFailed: 'Cannot reach backend right now. Please check server connection and try again.',
  },
})
locale.youtubeQuizPage = yq

const pg = locale.pixGenPage ?? {}
Object.assign(pg, {
  styles: {
    watercolourStorybook: 'Watercolour storybook',
    photoRealScienceLab: 'Photo-real science lab',
    flatInfographic: 'Flat infographic',
    pixelArtMiniGame: 'Pixel art mini-game',
  },
  ratios: {
    square: '1:1 Square',
    landscape: '3:2 Landscape',
    vertical: '9:16 Vertical',
    portrait: '2:3 Portrait',
  },
  inspiration: {
    slideDecks: {
      title: 'Interactive slide deck backgrounds',
      notes: 'Create cohesive cover slides, section dividers, and icon suites with one prompt bundle.',
    },
    stemSignage: {
      title: 'STEM lab signage pack',
      notes: 'Generate safety reminders, lab station cues, and process diagrams in matching styles.',
    },
    readAloud: {
      title: 'Read aloud visual supports',
      notes: 'Produce scene illustrations, character cards, and vocabulary visuals for literacy blocks.',
    },
  },
  automation: {
    batchLesson: {
      label: 'Batch lesson art',
      description:
        'Upload your weekly planner and let PixGen suggest visual assets for hooks, anchor charts, and small-group centres.',
    },
    curriculumRemix: {
      label: 'Curriculum-aligned remix',
      description:
        'Search district-approved themes. PixGen automatically swaps mascots, colours, and iconography to match your brand.',
    },
    studentCocreation: {
      label: 'Student co-creation mode',
      description:
        'Enable moderated prompts so learners storyboard, illustrate, and reflect while you monitor review queues.',
    },
  },
  roadmapItems: {
    videoOverlays: {
      heading: 'Video overlays',
      description:
        'Auto-generate lower-thirds, animated captions, and thumbnail sets for your classroom recordings.',
      owner: 'Beta • Q1 2026',
    },
    assetExport: {
      heading: '3D asset export',
      description: 'Export STL files and AR markers for makerspaces and tactile learning labs.',
      owner: 'Research • Q2 2026',
    },
    brandKitSync: {
      heading: 'Brand kit sync',
      description:
        'Connect Google Slides and Canva brand kits to maintain typography, colours, and logos automatically.',
      owner: 'Planned • Q3 2026',
    },
  },
  prompts: {
    waterCycle: {
      title: 'Water Cycle Diagram',
      prompt:
        'Illustrate the water cycle for grade 5 students with annotated arrows showing evaporation, condensation, precipitation, and collection. Use playful cloud characters and bright, educational colors.',
    },
    photosynthesis: {
      title: 'Photosynthesis Process',
      prompt:
        'Create a detailed diagram of photosynthesis for middle school science class. Show sunlight, water, carbon dioxide entering a plant leaf, and oxygen and glucose being produced. Use clear labels and vibrant green colors.',
    },
    fractions: {
      title: 'Math Fractions Visual',
      prompt:
        'Design an engaging visual aid for teaching fractions to elementary students. Show pizza slices, pie charts, and number lines with colorful, friendly illustrations that make fractions easy to understand.',
    },
    worldMap: {
      title: 'World Map with Continents',
      prompt:
        'Generate a colorful world map poster for geography class showing all seven continents with clear labels, ocean names, and fun facts. Use bright, kid-friendly colors and simple iconography.',
    },
    periodicTable: {
      title: 'Periodic Table Elements',
      prompt:
        'Create a modern, colorful periodic table poster for chemistry class. Use distinct colors for different element groups, clear atomic numbers, and symbols. Make it visually appealing and easy to read.',
    },
    solarSystem: {
      title: 'Solar System Diagram',
      prompt:
        'Illustrate the solar system for elementary astronomy lesson. Show all eight planets in order from the sun with accurate relative sizes and colors. Include asteroid belt and make it engaging for young learners.',
    },
    humanBody: {
      title: 'Human Body Systems',
      prompt:
        'Design an educational poster showing major human body systems (circulatory, respiratory, digestive) for biology class. Use clear diagrams, color coding, and simple labels suitable for middle school students.',
    },
    ancientCivilizations: {
      title: 'Ancient Civilizations Timeline',
      prompt:
        'Create a visual timeline poster showing major ancient civilizations (Egypt, Greece, Rome, China) with key dates, achievements, and cultural icons. Use an engaging, educational design for history class.',
    },
  },
  templatesCount: '{{count}} templates',
  previewAlt: 'Generated preview',
  previewFallbackTitle: 'Preview',
  previewFallbackPrompt: 'Generated image preview',
  batchPreviewTitle: 'Batch preview ({{count}} variations)',
  variationAlt: 'Variation {{index}}',
  errors: {
    sessionExpired: 'Your session expired. Please log in again and retry.',
    invalidInput: 'Please check your prompt and selected options, then try again.',
    serviceUnavailable: 'Image service is currently unavailable. Please try again in a moment.',
    timeout:
      'Generation is taking too long. Please retry with a shorter prompt or single image.',
    network:
      'Network issue detected. Please check your connection and backend server.',
    batchNoImages: 'Batch completed but no image previews were returned.',
    batchPartial: '{{count}} image(s) failed to generate. Showing successful results.',
    batchFailed: 'Batch generation failed.',
    noImageUrl: 'Generation completed but no image URL was returned.',
    generationFailed: 'Image generation failed.',
    downloadFailed: 'Unable to download image. Please try again.',
  },
})
locale.pixGenPage = pg

writeFileSync(localePath, JSON.stringify(locale, null, 2) + '\n', 'utf8')
console.log('Patched en-US.json: chatbotsPage, youtubeQuizPage, pixGenPage')

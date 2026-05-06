import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  BookOpen,
  Lightbulb,
  Zap,
  Star,
  Brain,
  Shield,
  ChevronDown,
  ExternalLink,
  Target,
  TrendingUp,
  FileText,
  Video,
  Share2,
  Sparkles,
  ArrowRight,
  Trophy,
  Eye,
  MessageSquare,
  Settings,
  Filter,
  BarChart3,
  Layers,
  Wrench,
  Beaker,
  Microscope,
  Atom,
  Rocket,
  Globe,
  Bookmark,
  Calendar,
  Download,
  Languages,
  PenTool,
  Type,
  BookMarked,
} from 'lucide-react'

interface CourseModule {
  id: string
  title: string
  description: string
  duration: string
  learningOutcomes: string[]
  content: {
    type: 'video' | 'reading' | 'interactive' | 'assessment' | 'project'
    title: string
    duration?: string
    points?: number
  }[]
  standardsConnections?: string[]
  realWorldApplication: string
  assessment: {
    type: string
    description: string
    points: number
  }
  completed: boolean
  locked: boolean
}

interface ELAStandard {
  code: string
  title: string
  description: string
  domains: string[]
  gradeLevel: string
}

interface LiteracyResource {
  title: string
  description: string
  type: string
  gradeLevel: string
  duration: string
}

const LiteracyExpertCourse = () => {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState<string | null>(null)
  // Load completed modules from localStorage
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('literacy-expert-completed-modules')
    return saved ? JSON.parse(saved) : []
  })
  const [enrolled, setEnrolled] = useState(() => {
    const saved = localStorage.getItem('literacy-expert-enrolled')
    return saved === 'true'
  })
  const [currentTab, setCurrentTab] = useState<'overview' | 'modules' | 'standards' | 'resources'>('overview')
  const [showModuleMenu, setShowModuleMenu] = useState(false)

  // Save completed modules to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('literacy-expert-completed-modules', JSON.stringify(completedModules))
  }, [completedModules])

  // Save enrolled status to localStorage
  useEffect(() => {
    localStorage.setItem('literacy-expert-enrolled', enrolled.toString())
  }, [enrolled])

  // Close module menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showModuleMenu && !target.closest('.module-menu-container')) {
        setShowModuleMenu(false)
      }
    }

    if (showModuleMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showModuleMenu])

  const courseModules: CourseModule[] = [
    {
      id: 'foundations',
      title: 'Foundations of Literacy Instruction',
      description: 'Master the core principles of effective literacy instruction, including research-based practices, balanced literacy approaches, and alignment with Common Core and state standards.',
      duration: '90 min',
      learningOutcomes: [
        'Understand the science of reading and evidence-based literacy practices',
        'Implement a balanced literacy framework in your classroom',
        'Align instruction with Common Core ELA standards',
        'Design literacy-rich classroom environments',
        'Use data to inform literacy instruction',
      ],
      content: [
        { type: 'video', title: 'The Science of Reading: What Works', duration: '20 min', points: 20 },
        { type: 'reading', title: 'Balanced Literacy Framework', points: 15 },
        { type: 'interactive', title: 'Standards Alignment Tool', points: 25 },
        { type: 'video', title: 'Creating Literacy-Rich Environments', duration: '18 min', points: 20 },
        { type: 'project', title: 'Design Your Literacy Block', points: 20 },
      ],
      standardsConnections: ['All Common Core ELA Standards', 'Reading Foundational Skills', 'Reading Literature', 'Reading Informational Text'],
      realWorldApplication: 'Design a comprehensive literacy block schedule that integrates all components of balanced literacy instruction.',
      assessment: {
        type: 'Unit Plan',
        description: 'Create a complete literacy unit plan aligned to Common Core standards with explicit instructional strategies',
        points: 100,
      },
      completed: false,
      locked: false,
    },
    {
      id: 'phonics',
      title: 'Phonics & Phonemic Awareness',
      description: 'Master systematic phonics instruction, decoding strategies, and phonemic awareness activities that build foundational reading skills for all learners.',
      duration: '105 min',
      learningOutcomes: [
        'Implement systematic, explicit phonics instruction',
        'Teach decoding and encoding strategies effectively',
        'Design phonemic awareness activities',
        'Use word work activities to reinforce phonics skills',
        'Assess and differentiate phonics instruction',
      ],
      content: [
        { type: 'video', title: 'Systematic Phonics Instruction', duration: '22 min', points: 20 },
        { type: 'reading', title: 'Decoding Strategies That Work', points: 15 },
        { type: 'interactive', title: 'Phonics Assessment Tool', points: 25 },
        { type: 'video', title: 'Word Work Activities', duration: '20 min', points: 20 },
        { type: 'project', title: 'Create Phonics Lesson Sequence', points: 20 },
      ],
      standardsConnections: ['RF.K.3', 'RF.1.3', 'RF.2.3', 'RF.3.3', 'RF.4.3', 'RF.5.3'],
      realWorldApplication: 'Develop a systematic phonics scope and sequence with engaging activities for your grade level.',
      assessment: {
        type: 'Lesson Sequence',
        description: 'Create a complete phonics lesson sequence with assessments and differentiation strategies',
        points: 100,
      },
      completed: false,
      locked: false,
    },
    {
      id: 'guided-reading',
      title: 'Guided Reading Strategies',
      description: 'Learn to implement effective guided reading instruction using leveled texts, strategic teaching points, and small group instruction that accelerates reading growth.',
      duration: '90 min',
      learningOutcomes: [
        'Conduct running records and determine reading levels',
        'Select appropriate leveled texts for instruction',
        'Plan strategic teaching points for guided reading',
        'Facilitate meaningful small group discussions',
        'Use guided reading data to inform instruction',
      ],
      content: [
        { type: 'video', title: 'Guided Reading Fundamentals', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Running Records & Leveling', points: 15 },
        { type: 'interactive', title: 'Text Level Analyzer', points: 25 },
        { type: 'video', title: 'Strategic Teaching Points', duration: '20 min', points: 20 },
        { type: 'project', title: 'Plan Guided Reading Groups', points: 20 },
      ],
      standardsConnections: ['RL.1-5', 'RI.1-5', 'Reading Fluency Standards'],
      realWorldApplication: 'Plan and implement guided reading groups with appropriate texts and strategic teaching points for your students.',
      assessment: {
        type: 'Group Plan',
        description: 'Develop a complete guided reading plan with text selection, teaching points, and assessment strategies',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'writing-workshop',
      title: 'Writing Workshop Framework',
      description: 'Master the writing workshop model, including mini-lessons, conferencing, process writing, and publishing strategies that develop confident writers.',
      duration: '120 min',
      learningOutcomes: [
        'Implement the writing workshop structure',
        'Design effective mini-lessons for writing',
        'Conduct meaningful writing conferences',
        'Teach the writing process across genres',
        'Create authentic publishing opportunities',
      ],
      content: [
        { type: 'video', title: 'Writing Workshop Structure', duration: '20 min', points: 20 },
        { type: 'reading', title: 'Mini-Lesson Design', points: 15 },
        { type: 'interactive', title: 'Conference Planning Tool', points: 25 },
        { type: 'video', title: 'Genre Study & Process Writing', duration: '25 min', points: 20 },
        { type: 'project', title: 'Design Writing Unit', points: 20 },
      ],
      standardsConnections: ['W.1-5', 'Writing Process Standards', 'Genre-Specific Standards'],
      realWorldApplication: 'Design and implement a complete writing unit using the workshop model with mini-lessons, conferences, and publishing.',
      assessment: {
        type: 'Unit Design',
        description: 'Create a comprehensive writing workshop unit with mini-lessons, conferencing strategies, and assessment rubrics',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary Development',
      description: 'Build students\' vocabulary through word study, morphology, academic vocabulary instruction, and context clue strategies that deepen comprehension.',
      duration: '90 min',
      learningOutcomes: [
        'Implement tiered vocabulary instruction',
        'Teach word study and morphology',
        'Use context clues and word relationships',
        'Design vocabulary-rich activities',
        'Assess vocabulary acquisition',
      ],
      content: [
        { type: 'video', title: 'Tiered Vocabulary Framework', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Word Study & Morphology', points: 15 },
        { type: 'interactive', title: 'Vocabulary Builder Tool', points: 25 },
        { type: 'video', title: 'Context Clues & Word Relationships', duration: '20 min', points: 20 },
        { type: 'project', title: 'Create Vocabulary Unit', points: 20 },
      ],
      standardsConnections: ['L.4', 'L.5', 'L.6', 'Vocabulary Acquisition Standards'],
      realWorldApplication: 'Develop a vocabulary instruction program that integrates word study, morphology, and academic vocabulary across content areas.',
      assessment: {
        type: 'Program Design',
        description: 'Create a comprehensive vocabulary program with instructional strategies, activities, and assessment tools',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'comprehension',
      title: 'Reading Comprehension Strategies',
      description: 'Teach essential comprehension strategies including questioning, inferencing, summarizing, and text structure analysis that help students understand complex texts.',
      duration: '105 min',
      learningOutcomes: [
        'Teach metacognitive reading strategies',
        'Implement questioning techniques',
        'Develop inferencing and prediction skills',
        'Use text structure to support comprehension',
        'Assess comprehension through authentic tasks',
      ],
      content: [
        { type: 'video', title: 'Comprehension Strategy Instruction', duration: '20 min', points: 20 },
        { type: 'reading', title: 'Questioning & Inferencing', points: 15 },
        { type: 'interactive', title: 'Text Structure Analyzer', points: 25 },
        { type: 'video', title: 'Metacognitive Reading Strategies', duration: '22 min', points: 20 },
        { type: 'project', title: 'Design Comprehension Lesson', points: 20 },
      ],
      standardsConnections: ['RL.1-10', 'RI.1-10', 'Comprehension Standards'],
      realWorldApplication: 'Create comprehension strategy lessons that teach students to actively engage with and understand complex texts.',
      assessment: {
        type: 'Lesson Design',
        description: 'Develop a complete comprehension lesson with strategy instruction, practice activities, and assessment',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'multilingual',
      title: 'Multilingual Learner Supports',
      description: 'Provide effective literacy instruction for multilingual learners through scaffolding strategies, language acquisition support, and culturally responsive teaching.',
      duration: '90 min',
      learningOutcomes: [
        'Implement language scaffolds for ELL students',
        'Use visual and kinesthetic supports',
        'Design culturally responsive literacy lessons',
        'Support language acquisition through literacy',
        'Assess multilingual learners appropriately',
      ],
      content: [
        { type: 'video', title: 'Supporting Multilingual Learners', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Scaffolding Strategies', points: 15 },
        { type: 'interactive', title: 'Language Support Tool', points: 25 },
        { type: 'video', title: 'Culturally Responsive Literacy', duration: '20 min', points: 20 },
        { type: 'project', title: 'Adapt Lesson for ELL Students', points: 20 },
      ],
      standardsConnections: ['WIDA Standards', 'ELD Standards', 'All ELA Standards with Supports'],
      realWorldApplication: 'Adapt existing literacy lessons with appropriate scaffolds and supports for multilingual learners in your classroom.',
      assessment: {
        type: 'Adapted Lesson',
        description: 'Create an adapted literacy lesson with language scaffolds, visual supports, and culturally responsive elements',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'assessment',
      title: 'Assessment & Differentiation',
      description: 'Use running records, formative assessments, and data-driven instruction to differentiate literacy teaching and meet diverse learner needs.',
      duration: '90 min',
      learningOutcomes: [
        'Conduct and analyze running records',
        'Design formative literacy assessments',
        'Use assessment data to differentiate instruction',
        'Create flexible grouping strategies',
        'Monitor literacy progress effectively',
      ],
      content: [
        { type: 'video', title: 'Running Records & Assessment', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Formative Assessment Strategies', points: 15 },
        { type: 'interactive', title: 'Data Analysis Tool', points: 25 },
        { type: 'video', title: 'Differentiation in Literacy', duration: '20 min', points: 20 },
        { type: 'project', title: 'Create Assessment System', points: 20 },
      ],
      standardsConnections: ['Assessment Standards', 'All ELA Standards'],
      realWorldApplication: 'Develop a comprehensive literacy assessment system with formative and summative tools that inform differentiated instruction.',
      assessment: {
        type: 'Assessment System',
        description: 'Create a complete literacy assessment system with tools, rubrics, and data analysis strategies',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'content-literacy',
      title: 'Literacy Across Content Areas',
      description: 'Integrate literacy instruction across science, math, and social studies through disciplinary literacy strategies and content-area reading approaches.',
      duration: '90 min',
      learningOutcomes: [
        'Teach disciplinary literacy skills',
        'Integrate reading strategies in content areas',
        'Use text sets for cross-curricular learning',
        'Support content-area vocabulary development',
        'Assess literacy skills within content instruction',
      ],
      content: [
        { type: 'video', title: 'Disciplinary Literacy', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Content-Area Reading Strategies', points: 15 },
        { type: 'interactive', title: 'Text Set Builder', points: 25 },
        { type: 'video', title: 'Cross-Curricular Integration', duration: '20 min', points: 20 },
        { type: 'project', title: 'Design Integrated Unit', points: 20 },
      ],
      standardsConnections: ['RI.1-10', 'Content-Area Standards', 'Literacy in History/Social Studies', 'Literacy in Science'],
      realWorldApplication: 'Design an integrated unit that teaches literacy skills within science, math, or social studies content.',
      assessment: {
        type: 'Integrated Unit',
        description: 'Create a cross-curricular unit plan that integrates literacy instruction with content-area learning',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'digital-literacy',
      title: 'Technology & Digital Literacy',
      description: 'Integrate digital tools and media literacy into your instruction, teaching students to read, write, and communicate effectively in digital environments.',
      duration: '75 min',
      learningOutcomes: [
        'Use digital tools for literacy instruction',
        'Teach online reading strategies',
        'Implement media literacy skills',
        'Design digital writing experiences',
        'Assess digital literacy competencies',
      ],
      content: [
        { type: 'video', title: 'Digital Literacy Fundamentals', duration: '15 min', points: 15 },
        { type: 'reading', title: 'Online Reading Strategies', points: 15 },
        { type: 'interactive', title: 'Digital Tool Library', points: 25 },
        { type: 'video', title: 'Media Literacy & Critical Thinking', duration: '12 min', points: 15 },
        { type: 'project', title: 'Create Digital Literacy Lesson', points: 30 },
      ],
      standardsConnections: ['ISTE Standards', 'Digital Literacy Standards', 'Media Literacy Standards'],
      realWorldApplication: 'Design and implement digital literacy lessons that teach students to navigate, evaluate, and create digital content effectively.',
      assessment: {
        type: 'Digital Lesson',
        description: 'Create a comprehensive digital literacy lesson with technology integration and assessment strategies',
        points: 100,
      },
      completed: false,
      locked: true,
    },
  ]

  const elaStandards: ELAStandard[] = [
    {
      code: 'RL.3.1',
      title: 'Reading Literature: Key Ideas and Details',
      description: 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.',
      domains: ['Key Ideas and Details', 'Reading Literature'],
      gradeLevel: 'Grade 3',
    },
    {
      code: 'RI.4.2',
      title: 'Reading Informational Text: Main Idea',
      description: 'Determine the main idea of a text and explain how it is supported by key details; summarize the text.',
      domains: ['Key Ideas and Details', 'Reading Informational Text'],
      gradeLevel: 'Grade 4',
    },
    {
      code: 'W.5.3',
      title: 'Writing: Narrative Writing',
      description: 'Write narratives to develop real or imagined experiences or events using effective technique, descriptive details, and clear event sequences.',
      domains: ['Text Types and Purposes', 'Writing'],
      gradeLevel: 'Grade 5',
    },
  ]

  const literacyResources: LiteracyResource[] = [
    {
      title: 'Leveled Text Library',
      description: 'Access to thousands of leveled texts for guided reading instruction',
      type: 'Library',
      gradeLevel: 'K-5',
      duration: 'Ongoing',
    },
    {
      title: 'Phonics Scope & Sequence',
      description: 'Comprehensive phonics scope and sequence aligned to Common Core',
      type: 'Framework',
      gradeLevel: 'K-3',
      duration: 'Year-long',
    },
    {
      title: 'Writing Workshop Templates',
      description: 'Ready-to-use templates for mini-lessons, conferences, and units',
      type: 'Template',
      gradeLevel: 'K-5',
      duration: 'Ongoing',
    },
    {
      title: 'Vocabulary Word Lists',
      description: 'Tiered vocabulary lists organized by grade level and content area',
      type: 'Resource',
      gradeLevel: 'K-5',
      duration: 'Ongoing',
    },
    {
      title: 'Running Record Forms',
      description: 'Digital running record forms with automatic analysis',
      type: 'Tool',
      gradeLevel: 'K-5',
      duration: 'Ongoing',
    },
    {
      title: 'ELL Support Strategies',
      description: 'Scaffolding strategies and language supports for multilingual learners',
      type: 'Guide',
      gradeLevel: 'K-5',
      duration: 'Ongoing',
    },
  ]

  const totalPoints = courseModules.reduce((sum, module) => {
    if (completedModules.includes(module.id)) {
      const contentPoints = module.content?.reduce((pts, item) => pts + (item.points || 0), 0) || 0
      const assessmentPoints = module.assessment?.points || 0
      return sum + contentPoints + assessmentPoints
    }
    return sum
  }, 0)

  const handleEnroll = () => {
    setEnrolled(true)
    setActiveModule('foundations')
  }

  // Determine which modules are unlocked based on completion
  const getUnlockedModules = () => {
    return courseModules.map((module, index) => {
      // First 2 modules are always unlocked
      if (index < 2) {
        return { ...module, locked: false }
      }
      // Module 3 (Guided Reading) unlocks when first 2 are completed
      if (index === 2) {
        const firstTwoCompleted = ['foundations', 'phonics'].every(
          id => completedModules.includes(id)
        )
        return { ...module, locked: !firstTwoCompleted }
      }
      // Subsequent modules unlock when previous module is completed
      const previousModuleId = courseModules[index - 1].id
      return { ...module, locked: !completedModules.includes(previousModuleId) }
    })
  }

  const unlockedModulesList = getUnlockedModules()
  const unlockedModules = unlockedModulesList.filter(m => !m.locked)
  const completedCount = completedModules.length
  const totalProgress = unlockedModules.length > 0 ? (completedCount / unlockedModules.length) * 100 : 0
  
  // Check if all modules are completed (must be after courseModules is defined)
  const allModulesCompleted = enrolled && completedModules.length === courseModules.length

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Specialist Track
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    15 hours
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    10 modules
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Literacy Expert</h1>
                <p className="mt-2 text-blue-100">
                  Phonics instruction, guided reading, writing workshop, and multilingual supports
                </p>
              </div>
            </div>
            {enrolled && (
              <>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>{completedModules.length} of {courseModules.length} modules completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{totalPoints} points earned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{Math.round(totalProgress)}% Complete</span>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {allModulesCompleted && (
              <div className="relative module-menu-container">
                <button
                  onClick={() => setShowModuleMenu(!showModuleMenu)}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition flex items-center justify-center relative"
                  title="Access Module Content"
                >
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  {showModuleMenu && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  )}
                </button>
                
                {showModuleMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden module-menu-container">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="h-5 w-5 text-yellow-300" />
                        <h3 className="font-bold text-sm">Course Completed!</h3>
                      </div>
                      <p className="text-xs text-blue-100">Access module content</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {courseModules.map((module, idx) => {
                        const isCompleted = completedModules.includes(module.id)
                        
                        return (
                          <button
                            key={module.id}
                            onClick={() => {
                              setActiveModule(module.id)
                              setCurrentTab('modules')
                              setShowModuleMenu(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center justify-between border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{module.title}</p>
                                <p className="text-xs text-gray-500">{module.duration}</p>
                              </div>
                              {isCompleted && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!enrolled && (
              <button
                onClick={handleEnroll}
                className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'modules', label: 'Modules', icon: BookOpen },
              { id: 'standards', label: 'Standards & Frameworks', icon: Target },
              { id: 'resources', label: 'Resources', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    currentTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {currentTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This comprehensive specialist track equips you with the knowledge, skills, and tools needed to excel
                  in literacy instruction. Through ten carefully designed modules, you'll master phonics instruction,
                  guided reading strategies, writing workshop frameworks, vocabulary development, and multilingual learner
                  supports. Each module combines research-backed pedagogy with practical, classroom-ready strategies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <GraduationCap className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Aligned</h3>
                    <p className="text-sm text-gray-700">
                      Aligned with Common Core ELA, state standards, and international literacy frameworks
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                    <Sparkles className="h-8 w-8 text-teal-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Tools</h3>
                    <p className="text-sm text-gray-700">
                      Access AI-assisted lesson planning, text analysis, and assessment generation
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <Trophy className="h-8 w-8 text-green-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification</h3>
                    <p className="text-sm text-gray-700">
                      Earn a professional certificate recognized by educational institutions worldwide
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Master</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Phonics & Decoding',
                      description: 'Systematic phonics instruction and decoding strategies',
                      icon: Type,
                      bgColor: 'bg-blue-100',
                      textColor: 'text-blue-600',
                    },
                    {
                      title: 'Guided Reading',
                      description: 'Small group instruction with leveled texts and strategic teaching',
                      icon: BookOpen,
                      bgColor: 'bg-teal-100',
                      textColor: 'text-teal-600',
                    },
                    {
                      title: 'Writing Workshop',
                      description: 'Process writing, mini-lessons, and authentic publishing',
                      icon: PenTool,
                      bgColor: 'bg-green-100',
                      textColor: 'text-green-600',
                    },
                    {
                      title: 'Multilingual Supports',
                      description: 'Scaffolding strategies for ELL and diverse learners',
                      icon: Languages,
                      bgColor: 'bg-purple-100',
                      textColor: 'text-purple-600',
                    },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bgColor} ${item.textColor} mb-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-700">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Outcomes</h3>
                <ul className="space-y-2">
                  {[
                    'Design and implement systematic phonics instruction aligned to research',
                    'Facilitate effective guided reading groups with strategic teaching points',
                    'Implement writing workshop frameworks that develop confident writers',
                    'Build vocabulary through word study, morphology, and context clues',
                    'Teach comprehension strategies that deepen understanding',
                    'Support multilingual learners with appropriate scaffolds and strategies',
                    'Use assessment data to differentiate literacy instruction',
                    'Integrate literacy instruction across content areas',
                    'Implement digital literacy and media literacy skills',
                    'Create comprehensive literacy programs that meet diverse learner needs',
                  ].map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Modules Tab */}
          {currentTab === 'modules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
                {enrolled && (
                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    Enrolled
                  </span>
                )}
              </div>

              {!enrolled ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enroll to Access Modules</h3>
                  <p className="text-gray-600 mb-6">Click "Enroll Now" in the header to begin your Literacy Expert journey</p>
                  <button
                    onClick={handleEnroll}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                  >
                    Enroll Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {unlockedModulesList.map((module, idx) => {
                    const isCompleted = completedModules.includes(module.id)
                    const isActive = activeModule === module.id
                    const isLocked = module.locked

                    return (
                      <div
                        key={module.id}
                        className={`rounded-xl border-2 p-6 transition ${
                          isCompleted
                            ? 'bg-green-50 border-green-300'
                            : module.locked
                            ? 'bg-gray-50 border-gray-200 opacity-60'
                            : isActive
                            ? 'bg-blue-50 border-blue-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                {idx + 1}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                              {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                              {module.locked && <Lock className="h-6 w-6 text-gray-400" />}
                            </div>
                            <p className="text-gray-700 ml-12 mb-3">{module.description}</p>
                            <div className="flex flex-wrap items-center gap-2 ml-12">
                              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.duration}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                                {module.assessment.points} points
                              </span>
                            </div>
                          </div>
                        </div>

                        {module.learningOutcomes && module.learningOutcomes.length > 0 && (
                          <div className="ml-12 mb-4">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Learning Outcomes</p>
                            <ul className="space-y-1">
                              {module.learningOutcomes.map((outcome, outIdx) => (
                                <li key={outIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {isActive && (
                          <>
                            {module.content && Array.isArray(module.content) && module.content.length > 0 && (
                              <div className="ml-12 mb-4 bg-white rounded-lg p-5 border border-blue-200">
                                <p className="text-sm font-semibold text-gray-900 mb-3">Module Content</p>
                                <div className="space-y-3">
                                  {module.content.map((item, itemIdx) => {
                                    const ContentIcon =
                                      item.type === 'video'
                                        ? Video
                                        : item.type === 'reading'
                                        ? BookOpen
                                        : item.type === 'interactive'
                                        ? Zap
                                        : item.type === 'assessment'
                                        ? FileText
                                        : Rocket
                                    return (
                                      <div
                                        key={itemIdx}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                                      >
                                        <div className="flex items-center gap-3">
                                          <ContentIcon className="h-5 w-5 text-blue-600" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                            {item.duration && (
                                              <p className="text-xs text-gray-500">{item.duration}</p>
                                            )}
                                          </div>
                                        </div>
                                        {item.points && (
                                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                            {item.points} pts
                                          </span>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                                {module.assessment && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-900 mb-2">Assessment</p>
                                    <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                                      <p className="text-sm font-medium text-gray-900 mb-1">{module.assessment.type}</p>
                                      <p className="text-xs text-gray-700">{module.assessment.description}</p>
                                      <p className="text-xs text-teal-700 font-semibold mt-1">
                                        {module.assessment.points} points
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {module.realWorldApplication && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-900 mb-2">Real-World Application</p>
                                    <p className="text-sm text-gray-700 bg-green-50 rounded-lg p-3 border border-green-200">
                                      {module.realWorldApplication}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        <div className="ml-12 flex items-center gap-3">
                          {module.locked ? (
                            <button
                              disabled
                              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center gap-2"
                            >
                              <Lock className="h-4 w-4" />
                              Complete previous modules
                            </button>
                          ) : isCompleted ? (
                            <>
                              <button
                                onClick={() => setActiveModule(isActive ? null : module.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                                  isActive
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    Review Module
                                  </>
                                )}
                              </button>
                              <button className="px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download Certificate
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setActiveModule(isActive ? null : module.id)}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
                              >
                                {isActive ? (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4" />
                                    Start Module
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleModuleComplete(module.id)}
                                className="px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Standards Tab */}
          {currentTab === 'standards' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Common Core ELA Standards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {elaStandards.map((standard, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-semibold">
                        {standard.code}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                        {standard.gradeLevel}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{standard.title}</h3>
                    <p className="text-sm text-gray-700 mb-4">{standard.description}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Domains</p>
                        {standard.domains.map((domain, domainIdx) => (
                          <p key={domainIdx} className="text-xs text-gray-700 bg-blue-50 rounded p-2 mb-1">
                            {domain}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 border border-teal-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Standards Coverage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Reading Standards</h4>
                    <p className="text-xs text-gray-700">RL.1-10, RI.1-10, RF.K-5</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Writing Standards</h4>
                    <p className="text-xs text-gray-700">W.1-10, Writing Process</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Language Standards</h4>
                    <p className="text-xs text-gray-700">L.1-6, Vocabulary Acquisition</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {currentTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {literacyResources.map((resource, idx) => {
                  const ResourceIcon = resource.type === 'Library' ? BookOpen : resource.type === 'Framework' ? Target : resource.type === 'Template' ? FileText : resource.type === 'Tool' ? Zap : resource.type === 'Guide' ? BookMarked : FileText
                  return (
                    <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-300 transition">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                        <ResourceIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{resource.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{resource.type}</p>
                      <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">{resource.gradeLevel}</span>
                        <span className="text-xs text-gray-500">{resource.duration}</span>
                      </div>
                      <button className="w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition">
                        Access Resource
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Preview */}
      {completedModules.length === courseModules.length && enrolled && (
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-blue-100 mb-6">
              You've completed the Literacy Expert specialist track. Download your certificate below.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center gap-2">
                <Award className="h-4 w-4" />
                Download Certificate
              </button>
              <button className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition">
                Share Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiteracyExpertCourse




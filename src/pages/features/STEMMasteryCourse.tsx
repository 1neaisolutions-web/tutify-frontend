import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  FlaskConical,
  Code,
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
  ngssConnections?: string[]
  realWorldApplication: string
  assessment: {
    type: string
    description: string
    points: number
  }
  completed: boolean
  locked: boolean
}

interface NGSSStandard {
  code: string
  title: string
  description: string
  dci: string[]
  sep: string[]
  ccc: string[]
}

interface EngineeringDesignChallenge {
  title: string
  problem: string
  constraints: string[]
  criteria: string[]
  gradeLevel: string
  duration: string
}

const STEMMasteryCourse = () => {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState<string | null>(null)
  // Load completed modules from localStorage
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('stem-mastery-completed-modules')
    return saved ? JSON.parse(saved) : []
  })
  const [enrolled, setEnrolled] = useState(() => {
    const saved = localStorage.getItem('stem-mastery-enrolled')
    return saved === 'true'
  })
  const [currentTab, setCurrentTab] = useState<'overview' | 'modules' | 'ngss' | 'resources'>('overview')
  const [showModuleMenu, setShowModuleMenu] = useState(false)

  // Save completed modules to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
  }, [completedModules])

  // Save enrolled status to localStorage
  useEffect(() => {
    localStorage.setItem('stem-mastery-enrolled', enrolled.toString())
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
      id: 'ngss-foundations',
      title: 'NGSS Foundations & Three-Dimensional Learning',
      description: 'Master the Next Generation Science Standards framework, understanding how Disciplinary Core Ideas (DCIs), Science and Engineering Practices (SEPs), and Crosscutting Concepts (CCCs) work together to create meaningful learning experiences.',
      duration: '90 min',
      learningOutcomes: [
        'Understand the structure and philosophy of NGSS',
        'Identify and apply the three dimensions of learning',
        'Map performance expectations to your curriculum',
        'Design three-dimensional lessons aligned to NGSS',
        'Use NGSS as a framework for assessment design',
      ],
      content: [
        { type: 'video', title: 'Introduction to NGSS Framework', duration: '18 min', points: 20 },
        { type: 'reading', title: 'The Three Dimensions Explained', points: 15 },
        { type: 'interactive', title: 'NGSS Dimension Mapping Tool', points: 25 },
        { type: 'video', title: 'Performance Expectations Deep Dive', duration: '22 min', points: 20 },
        { type: 'project', title: 'Create Your NGSS-Aligned Lesson', points: 20 },
      ],
      ngssConnections: ['All Performance Expectations', 'All DCIs', 'All SEPs', 'All CCCs'],
      realWorldApplication: 'Design a complete NGSS-aligned unit plan for your grade level and subject area.',
      assessment: {
        type: 'Project-Based',
        description: 'Create a three-dimensional lesson plan with explicit DCI, SEP, and CCC connections',
        points: 100,
      },
      completed: false,
      locked: false,
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design Process & Real-World Problem Solving',
      description: 'Learn to facilitate authentic engineering design challenges that engage students in solving real-world problems while developing critical thinking, creativity, and collaboration skills.',
      duration: '105 min',
      learningOutcomes: [
        'Master the engineering design cycle (Ask, Imagine, Plan, Create, Improve)',
        'Design authentic, real-world engineering challenges',
        'Facilitate student-driven problem-solving',
        'Integrate engineering design across STEM subjects',
        'Assess engineering design process skills',
      ],
      content: [
        { type: 'video', title: 'Engineering Design Cycle Explained', duration: '20 min', points: 20 },
        { type: 'reading', title: 'Authentic Engineering Challenges', points: 15 },
        { type: 'interactive', title: 'Challenge Generator Tool', points: 25 },
        { type: 'video', title: 'Facilitating Design Thinking', duration: '25 min', points: 20 },
        { type: 'project', title: 'Design Your Engineering Challenge', points: 20 },
      ],
      ngssConnections: ['MS-ETS1-1', 'MS-ETS1-2', 'MS-ETS1-3', 'MS-ETS1-4'],
      realWorldApplication: 'Create and implement an engineering design challenge that addresses a local community need.',
      assessment: {
        type: 'Portfolio',
        description: 'Develop a complete engineering design challenge with rubrics and assessment tools',
        points: 100,
      },
      completed: false,
      locked: false,
    },
    {
      id: 'computational-thinking',
      title: 'Computational Thinking & Coding Integration',
      description: 'Integrate computational thinking concepts and coding activities into your STEM curriculum, helping students develop problem-solving skills applicable across disciplines.',
      duration: '120 min',
      learningOutcomes: [
        'Understand the four pillars of computational thinking',
        'Integrate coding activities into existing curriculum',
        'Use block-based and text-based programming tools',
        'Design computational thinking challenges',
        'Assess computational thinking skills',
      ],
      content: [
        { type: 'video', title: 'Computational Thinking Fundamentals', duration: '22 min', points: 20 },
        { type: 'reading', title: 'Coding in the Classroom', points: 15 },
        { type: 'interactive', title: 'Scratch/Blockly Workshop', points: 30 },
        { type: 'video', title: 'Unplugged Activities', duration: '18 min', points: 15 },
        { type: 'project', title: 'Create Computational Thinking Lesson', points: 20 },
      ],
      ngssConnections: ['HS-ETS1-4', 'Computational Thinking SEP'],
      realWorldApplication: 'Design a cross-curricular project that integrates computational thinking with science or math concepts.',
      assessment: {
        type: 'Project + Reflection',
        description: 'Create and implement a computational thinking activity with student work samples',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'lab-safety',
      title: 'Lab Safety Protocols & Risk Management',
      description: 'Establish comprehensive lab safety protocols, conduct risk assessments, and create a culture of safety in your STEM classroom.',
      duration: '75 min',
      learningOutcomes: [
        'Develop comprehensive lab safety protocols',
        'Conduct risk assessments for activities',
        'Create safety documentation and procedures',
        'Train students in safe laboratory practices',
        'Respond to safety incidents effectively',
      ],
      content: [
        { type: 'video', title: 'Lab Safety Fundamentals', duration: '15 min', points: 15 },
        { type: 'reading', title: 'OSHA & School Safety Standards', points: 15 },
        { type: 'interactive', title: 'Risk Assessment Tool', points: 25 },
        { type: 'video', title: 'Emergency Response Procedures', duration: '12 min', points: 15 },
        { type: 'project', title: 'Create Your Safety Manual', points: 30 },
      ],
      ngssConnections: ['Safety in Science Practices'],
      realWorldApplication: 'Develop a complete lab safety manual for your classroom with protocols, checklists, and emergency procedures.',
      assessment: {
        type: 'Safety Manual',
        description: 'Create a comprehensive lab safety manual meeting all regulatory requirements',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'phenomena-driven',
      title: 'Phenomena-Driven Instruction',
      description: 'Learn to use authentic phenomena to drive student inquiry, making science relevant and engaging while building conceptual understanding.',
      duration: '90 min',
      learningOutcomes: [
        'Identify and select appropriate phenomena',
        'Design phenomena-driven investigations',
        'Facilitate student-driven inquiry',
        'Connect phenomena to NGSS performance expectations',
        'Assess understanding through phenomena',
      ],
      content: [
        { type: 'video', title: 'The Power of Phenomena', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Selecting Authentic Phenomena', points: 15 },
        { type: 'interactive', title: 'Phenomena Library & Selector', points: 25 },
        { type: 'video', title: 'Facilitating Inquiry', duration: '20 min', points: 20 },
        { type: 'project', title: 'Design Phenomena-Based Unit', points: 20 },
      ],
      ngssConnections: ['All Performance Expectations'],
      realWorldApplication: 'Develop a phenomena-driven unit that engages students in authentic scientific inquiry.',
      assessment: {
        type: 'Unit Plan',
        description: 'Create a complete phenomena-driven unit with investigations and assessments',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'data-literacy',
      title: 'Data Literacy & Scientific Modeling',
      description: 'Develop students\' ability to collect, analyze, interpret, and communicate scientific data while creating and using models to explain phenomena.',
      duration: '105 min',
      learningOutcomes: [
        'Teach data collection and analysis skills',
        'Facilitate scientific modeling activities',
        'Use digital tools for data visualization',
        'Assess data literacy skills',
        'Connect data to scientific explanations',
      ],
      content: [
        { type: 'video', title: 'Data Literacy in STEM', duration: '20 min', points: 20 },
        { type: 'reading', title: 'Scientific Modeling Practices', points: 15 },
        { type: 'interactive', title: 'Data Visualization Tools', points: 25 },
        { type: 'video', title: 'Model-Based Reasoning', duration: '22 min', points: 20 },
        { type: 'project', title: 'Create Data Analysis Activity', points: 20 },
      ],
      ngssConnections: ['SEP: Analyzing and Interpreting Data', 'SEP: Using Mathematics', 'SEP: Developing and Using Models'],
      realWorldApplication: 'Design a data-driven investigation where students collect, analyze, and communicate findings.',
      assessment: {
        type: 'Activity Design',
        description: 'Create a complete data literacy activity with rubrics and student examples',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'integration-strategies',
      title: 'STEM Integration Strategies',
      description: 'Learn to seamlessly integrate Science, Technology, Engineering, and Mathematics in meaningful ways that enhance learning across all disciplines.',
      duration: '90 min',
      learningOutcomes: [
        'Design integrated STEM lessons',
        'Connect STEM concepts across disciplines',
        'Use project-based learning for integration',
        'Assess integrated STEM learning',
        'Collaborate with colleagues on STEM integration',
      ],
      content: [
        { type: 'video', title: 'STEM Integration Models', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Cross-Curricular Connections', points: 15 },
        { type: 'interactive', title: 'STEM Integration Planner', points: 25 },
        { type: 'video', title: 'Project-Based STEM', duration: '20 min', points: 20 },
        { type: 'project', title: 'Design Integrated STEM Project', points: 20 },
      ],
      ngssConnections: ['All Performance Expectations'],
      realWorldApplication: 'Create a comprehensive integrated STEM project that spans multiple subjects and weeks.',
      assessment: {
        type: 'Project Plan',
        description: 'Develop a complete integrated STEM project with cross-curricular connections',
        points: 100,
      },
      completed: false,
      locked: true,
    },
    {
      id: 'assessment-ngss',
      title: 'NGSS-Aligned Assessment & Portfolio Development',
      description: 'Design three-dimensional assessments that authentically measure student understanding while building comprehensive portfolios of student work.',
      duration: '75 min',
      learningOutcomes: [
        'Create three-dimensional assessments',
        'Design performance tasks',
        'Develop rubrics aligned to NGSS',
        'Build student portfolios',
        'Use assessment data to inform instruction',
      ],
      content: [
        { type: 'video', title: 'Three-Dimensional Assessment', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Performance Task Design', points: 15 },
        { type: 'interactive', title: 'Rubric Builder Tool', points: 25 },
        { type: 'video', title: 'Portfolio Development', duration: '15 min', points: 15 },
        { type: 'project', title: 'Create Assessment Suite', points: 25 },
      ],
      ngssConnections: ['All Performance Expectations'],
      realWorldApplication: 'Develop a complete assessment system including formative, summative, and portfolio assessments.',
      assessment: {
        type: 'Assessment Suite',
        description: 'Create a comprehensive NGSS-aligned assessment system with rubrics and exemplars',
        points: 100,
      },
      completed: false,
      locked: true,
    },
  ]

  const ngssStandards: NGSSStandard[] = [
    {
      code: 'MS-PS1-1',
      title: 'Structure and Properties of Matter',
      description: 'Develop models to describe the atomic composition of simple molecules and extended structures.',
      dci: ['PS1.A: Structure and Properties of Matter'],
      sep: ['Developing and Using Models'],
      ccc: ['Scale, Proportion, and Quantity'],
    },
    {
      code: 'MS-ETS1-1',
      title: 'Engineering Design',
      description: 'Define the criteria and constraints of a design problem with sufficient precision.',
      dci: ['ETS1.A: Defining and Delimiting Engineering Problems'],
      sep: ['Asking Questions and Defining Problems'],
      ccc: ['Influence of Science, Engineering, and Technology'],
    },
    {
      code: 'HS-LS1-1',
      title: 'From Molecules to Organisms',
      description: 'Construct an explanation based on evidence for how the structure of DNA determines the structure of proteins.',
      dci: ['LS1.A: Structure and Function'],
      sep: ['Constructing Explanations and Designing Solutions'],
      ccc: ['Structure and Function'],
    },
  ]

  const engineeringChallenges: EngineeringDesignChallenge[] = [
    {
      title: 'Water Filtration System',
      problem: 'Design a water filtration system for communities without access to clean water',
      constraints: ['Use only locally available materials', 'Cost under $10 per unit', 'Filter 1L per hour'],
      criteria: ['Removes 90% of particles', 'Durable for 3 months', 'Easy to operate'],
      gradeLevel: '6-8',
      duration: '2 weeks',
    },
    {
      title: 'Earthquake-Resistant Building',
      problem: 'Design a building structure that can withstand simulated earthquakes',
      constraints: ['Limited materials budget', 'Must meet height requirements', 'Time limit'],
      criteria: ['Stability during shaking', 'Cost efficiency', 'Aesthetic design'],
      gradeLevel: '9-12',
      duration: '3 weeks',
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
    setActiveModule('ngss-foundations')
  }

  // Determine which modules are unlocked based on completion
  const getUnlockedModules = () => {
    return courseModules.map((module, index) => {
      // First 2 modules are always unlocked
      if (index < 2) {
        return { ...module, locked: false }
      }
      // Module 3 (Computational Thinking) unlocks when first 2 are completed
      if (index === 2) {
        const firstTwoCompleted = ['ngss-foundations', 'engineering-design'].every(
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
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
                    12 hours
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    8 modules
                  </span>
                </div>
                <h1 className="text-3xl font-bold">STEM Mastery</h1>
                <p className="mt-2 text-indigo-100">
                  NGSS alignment, engineering design, computational thinking, and lab safety protocols
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
                    <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="h-5 w-5 text-yellow-300" />
                        <h3 className="font-bold text-sm">Course Completed!</h3>
                      </div>
                      <p className="text-xs text-indigo-100">Access module content</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {courseModules.map((module, idx) => {
                        const moduleRoutes: Record<string, string> = {
                          'ngss-foundations': '/learning-hub/ngss-foundations',
                          'engineering-design': '/learning-hub/engineering-design',
                          'computational-thinking': '/learning-hub/computational-thinking',
                          'lab-safety': '/learning-hub/lab-safety',
                          'phenomena-driven': '/learning-hub/phenomena-driven',
                          'data-literacy': '/learning-hub/data-literacy',
                          'integration-strategies': '/learning-hub/stem-integration',
                          'assessment-ngss': '/learning-hub/ngss-assessment',
                        }
                        const route = moduleRoutes[module.id]
                        const isCompleted = completedModules.includes(module.id)
                        
                        return (
                          <button
                            key={module.id}
                            onClick={() => {
                              if (route) {
                                navigate(route)
                                setShowModuleMenu(false)
                              } else {
                                setActiveModule(module.id)
                                setCurrentTab('modules')
                                setShowModuleMenu(false)
                              }
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition flex items-center justify-between border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
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
                            {route && (
                              <ExternalLink className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                            )}
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
                className="px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition flex items-center gap-2"
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
              { id: 'ngss', label: 'NGSS Tools', icon: Target },
              { id: 'resources', label: 'Resources', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    currentTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
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
                  in STEM education. Through eight carefully designed modules, you'll master NGSS alignment, engineering
                  design processes, computational thinking integration, and comprehensive lab safety protocols. Each module
                  combines research-backed pedagogy with practical, classroom-ready strategies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <GraduationCap className="h-8 w-8 text-indigo-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">International Standards</h3>
                    <p className="text-sm text-gray-700">
                      Aligned with NGSS, ISTE, and international STEM education frameworks
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Tools</h3>
                    <p className="text-sm text-gray-700">
                      Access AI-assisted lesson planning, NGSS alignment, and assessment generation
                    </p>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                    <Trophy className="h-8 w-8 text-pink-600 mb-3" />
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
                      title: 'NGSS Alignment',
                      description: 'Master three-dimensional learning and performance expectations',
                      icon: Target,
                      bgColor: 'bg-indigo-100',
                      textColor: 'text-indigo-600',
                    },
                    {
                      title: 'Engineering Design',
                      description: 'Facilitate authentic problem-solving through the design cycle',
                      icon: Wrench,
                      bgColor: 'bg-purple-100',
                      textColor: 'text-purple-600',
                    },
                    {
                      title: 'Computational Thinking',
                      description: 'Integrate coding and computational concepts across STEM',
                      icon: Code,
                      bgColor: 'bg-pink-100',
                      textColor: 'text-pink-600',
                    },
                    {
                      title: 'Lab Safety',
                      description: 'Establish comprehensive safety protocols and risk management',
                      icon: Shield,
                      bgColor: 'bg-red-100',
                      textColor: 'text-red-600',
                    },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition">
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

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Outcomes</h3>
                <ul className="space-y-2">
                  {[
                    'Design and implement NGSS-aligned three-dimensional lessons',
                    'Facilitate authentic engineering design challenges',
                    'Integrate computational thinking and coding into STEM curriculum',
                    'Establish comprehensive lab safety protocols',
                    'Use phenomena to drive student inquiry',
                    'Develop data literacy and scientific modeling skills',
                    'Create integrated STEM learning experiences',
                    'Design three-dimensional assessments aligned to NGSS',
                  ].map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
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
                  <p className="text-gray-600 mb-6">Click "Enroll Now" in the header to begin your STEM Mastery journey</p>
                  <button
                    onClick={handleEnroll}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
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
                            ? 'bg-indigo-50 border-indigo-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                {idx + 1}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                              {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                              {module.locked && <Lock className="h-6 w-6 text-gray-400" />}
                            </div>
                            <p className="text-gray-700 ml-12 mb-3">{module.description}</p>
                            <div className="flex flex-wrap items-center gap-2 ml-12">
                              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.duration}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
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
                                      <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                      <span>{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                        {isActive && (
                          <>
                            {module.content && Array.isArray(module.content) && module.content.length > 0 && (
                              <div className="ml-12 mb-4 bg-white rounded-lg p-5 border border-indigo-200">
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
                                      <ContentIcon className="h-5 w-5 text-indigo-600" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                        {item.duration && (
                                          <p className="text-xs text-gray-500">{item.duration}</p>
                                        )}
                                      </div>
                                    </div>
                                    {item.points && (
                                      <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold">
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
                                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                  <p className="text-sm font-medium text-gray-900 mb-1">{module.assessment.type}</p>
                                  <p className="text-xs text-gray-700">{module.assessment.description}</p>
                                  <p className="text-xs text-purple-700 font-semibold mt-1">
                                    {module.assessment.points} points
                                  </p>
                                </div>
                              </div>
                            )}
                            {module.realWorldApplication && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Real-World Application</p>
                                <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-200">
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
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
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
                              {(() => {
                                const moduleRoutes: Record<string, string> = {
                                  'ngss-foundations': '/learning-hub/ngss-foundations',
                                  'engineering-design': '/learning-hub/engineering-design',
                                  'computational-thinking': '/learning-hub/computational-thinking',
                                  'lab-safety': '/learning-hub/lab-safety',
                                  'phenomena-driven': '/learning-hub/phenomena-driven',
                                  'data-literacy': '/learning-hub/data-literacy',
                                  'integration-strategies': '/learning-hub/stem-integration',
                                  'assessment-ngss': '/learning-hub/ngss-assessment',
                                }
                                const route = moduleRoutes[module.id]
                                return route ? (
                                  <Link
                                    to={route}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
                                  >
                                    <Play className="h-4 w-4" />
                                    Preview Content
                                  </Link>
                                ) : null
                              })()}
                              <button className="px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download Certificate
                              </button>
                            </>
                          ) : (
                            <>
                              {(() => {
                                const moduleRoutes: Record<string, string> = {
                                  'ngss-foundations': '/learning-hub/ngss-foundations',
                                  'engineering-design': '/learning-hub/engineering-design',
                                  'computational-thinking': '/learning-hub/computational-thinking',
                                  'lab-safety': '/learning-hub/lab-safety',
                                  'phenomena-driven': '/learning-hub/phenomena-driven',
                                  'data-literacy': '/learning-hub/data-literacy',
                                  'integration-strategies': '/learning-hub/stem-integration',
                                  'assessment-ngss': '/learning-hub/ngss-assessment',
                                }

                                const route = moduleRoutes[module.id]

                                return route ? (
                                  <Link
                                    to={route}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
                                  >
                                    <Play className="h-4 w-4" />
                                    Start Module
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => setActiveModule(isActive ? null : module.id)}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
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
                                )
                              })()}
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

          {/* NGSS Tools Tab */}
          {currentTab === 'ngss' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">NGSS Alignment Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ngssStandards.map((standard, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-mono font-semibold">
                        {standard.code}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{standard.title}</h3>
                    <p className="text-sm text-gray-700 mb-4">{standard.description}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">DCIs</p>
                        {standard.dci.map((dci, dciIdx) => (
                          <p key={dciIdx} className="text-xs text-gray-700 bg-indigo-50 rounded p-2 mb-1">
                            {dci}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">SEPs</p>
                        {standard.sep.map((sep, sepIdx) => (
                          <p key={sepIdx} className="text-xs text-gray-700 bg-purple-50 rounded p-2 mb-1">
                            {sep}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">CCCs</p>
                        {standard.ccc.map((ccc, cccIdx) => (
                          <p key={cccIdx} className="text-xs text-gray-700 bg-pink-50 rounded p-2 mb-1">
                            {ccc}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineering Design Challenges</h3>
                <div className="space-y-4">
                  {engineeringChallenges.map((challenge, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-5 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-semibold text-gray-900">{challenge.title}</h4>
                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                          {challenge.gradeLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{challenge.problem}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Constraints</p>
                          <ul className="space-y-1">
                            {challenge.constraints.map((constraint, cIdx) => (
                              <li key={cIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-red-600">•</span>
                                <span>{constraint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Success Criteria</p>
                          <ul className="space-y-1">
                            {challenge.criteria.map((criterion, crIdx) => (
                              <li key={crIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {currentTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'NGSS Standards Database', icon: Target, type: 'Tool' },
                  { name: 'Engineering Design Templates', icon: Wrench, type: 'Template' },
                  { name: 'Lab Safety Checklists', icon: Shield, type: 'Checklist' },
                  { name: 'Computational Thinking Activities', icon: Code, type: 'Activity' },
                  { name: 'Assessment Rubrics', icon: FileText, type: 'Rubric' },
                  { name: 'Phenomena Library', icon: Beaker, type: 'Library' },
                ].map((resource, idx) => {
                  const Icon = resource.icon
                  return (
                    <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 transition">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{resource.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{resource.type}</p>
                      <button className="w-full px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition">
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-indigo-100 mb-6">
              You've completed the STEM Mastery specialist track. Download your certificate below.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition flex items-center gap-2">
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

export default STEMMasteryCourse


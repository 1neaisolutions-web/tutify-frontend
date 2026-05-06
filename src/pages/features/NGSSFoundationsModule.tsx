import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Star,
  Download,
  Share2,
  Bookmark,
  Video,
  BookOpen,
  Zap,
  FileText,
  Rocket,
  Target,
  Trophy,
  Award,
  Users,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Eye,
  MessageSquare,
  Settings,
  Maximize2,
  Volume2,
  Brain,
  FlaskConical,
  Atom,
  Microscope,
  Layers,
  Code,
  Shield,
  BarChart3,
  GraduationCap,
  Sparkles,
} from 'lucide-react'

interface LessonContent {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template' | 'project'
  title: string
  duration?: string
  points: number
  completed: boolean
  content: any
}

interface NGSSDimension {
  dimension: 'DCI' | 'SEP' | 'CCC'
  name: string
  description: string
  examples: string[]
  gradeLevel: string
}

interface PerformanceExpectation {
  code: string
  title: string
  dci: string[]
  sep: string[]
  ccc: string[]
  description: string
}

const NGSSFoundationsModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showMappingTool, setShowMappingTool] = useState(false)
  const [showLessonDesigner, setShowLessonDesigner] = useState(false)
  const [mappingData, setMappingData] = useState({
    gradeLevel: '',
    topic: '',
    selectedDCI: '',
    selectedSEP: '',
    selectedCCC: '',
  })
  const [lessonDesign, setLessonDesign] = useState({
    title: '',
    gradeLevel: '',
    performanceExpectation: '',
    dci: '',
    sep: '',
    ccc: '',
    phenomenon: '',
    activities: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'ngss-intro',
      type: 'video',
      title: 'Introduction to NGSS Framework',
      duration: '18 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn the foundational concepts of Next Generation Science Standards and understand how they transform science education.',
        keyPoints: [
          'NGSS was developed to improve science education for all students',
          'Three-dimensional learning integrates DCIs, SEPs, and CCCs',
          'Performance Expectations combine all three dimensions',
          'NGSS emphasizes depth over breadth',
          'Standards are designed to be coherent across grade levels',
        ],
        transcript: 'Welcome to NGSS Foundations. The Next Generation Science Standards represent a fundamental shift in how we teach and assess science...',
      },
    },
    {
      id: 'three-dimensions',
      type: 'reading',
      title: 'The Three Dimensions Explained',
      points: 15,
      completed: false,
      content: {
        article: `# The Three Dimensions of NGSS

## Disciplinary Core Ideas (DCIs)

DCIs are the fundamental scientific concepts that students should understand. They are organized into four domains:

### Physical Sciences (PS)
- Matter and its interactions
- Motion and stability: Forces and interactions
- Energy
- Waves and their applications

### Life Sciences (LS)
- From molecules to organisms: Structures and processes
- Ecosystems: Interactions, energy, and dynamics
- Heredity: Inheritance and variation of traits
- Biological evolution: Unity and diversity

### Earth and Space Sciences (ESS)
- Earth's place in the universe
- Earth's systems
- Earth and human activity

### Engineering, Technology, and Applications of Science (ETS)
- Engineering design
- Links among engineering, technology, science, and society

## Science and Engineering Practices (SEPs)

SEPs describe the behaviors that scientists and engineers engage in:

1. **Asking Questions and Defining Problems**
2. **Developing and Using Models**
3. **Planning and Carrying Out Investigations**
4. **Analyzing and Interpreting Data**
5. **Using Mathematics and Computational Thinking**
6. **Constructing Explanations and Designing Solutions**
7. **Engaging in Argument from Evidence**
8. **Obtaining, Evaluating, and Communicating Information**

## Crosscutting Concepts (CCCs)

CCCs are concepts that apply across all domains of science:

1. **Patterns** - Observed patterns guide organization and classification
2. **Cause and Effect** - Mechanism and explanation
3. **Scale, Proportion, and Quantity** - Considering size, time, and energy
4. **Systems and System Models** - Defining boundaries and components
5. **Energy and Matter** - Flows, cycles, and conservation
6. **Structure and Function** - The way objects are shaped determines their use
7. **Stability and Change** - Conditions of stability and rates of change`,
        keyTakeaways: [
          'DCIs provide the content knowledge students need',
          'SEPs describe how students engage with science',
          'CCCs help students make connections across domains',
          'All three dimensions work together in three-dimensional learning',
        ],
      },
    },
    {
      id: 'mapping-tool',
      type: 'interactive',
      title: 'NGSS Dimension Mapping Tool',
      points: 25,
      completed: false,
      content: {
        description: 'Use this interactive tool to map NGSS dimensions to your curriculum and create three-dimensional learning experiences.',
        steps: [
          'Select your grade level',
          'Choose a topic or concept',
          'Select relevant DCIs, SEPs, and CCCs',
          'Generate performance expectations',
          'Create your three-dimensional lesson plan',
        ],
      },
    },
    {
      id: 'performance-expectations',
      type: 'video',
      title: 'Performance Expectations Deep Dive',
      duration: '22 min',
      points: 20,
      completed: false,
      content: {
        description: 'Understand how Performance Expectations combine DCIs, SEPs, and CCCs to create meaningful learning targets.',
        keyPoints: [
          'Performance Expectations are statements of what students should be able to do',
          'Each PE integrates at least one DCI, one SEP, and one CCC',
          'PEs are not meant to be taught in isolation',
          'Multiple PEs can be addressed in a single unit',
          'Assessment should reflect the three-dimensional nature of PEs',
        ],
        transcript: 'Performance Expectations are the heart of NGSS. They describe what students should know and be able to do...',
      },
    },
    {
      id: 'lesson-project',
      type: 'project',
      title: 'Create Your NGSS-Aligned Lesson',
      points: 20,
      completed: false,
      content: {
        description: 'Design a complete three-dimensional lesson plan aligned to NGSS standards.',
        requirements: [
          'Select a Performance Expectation',
          'Identify the DCI, SEP, and CCC',
          'Design a phenomenon-based hook',
          'Create three-dimensional activities',
          'Develop three-dimensional assessments',
        ],
      },
    },
  ]

  const ngssDimensions: NGSSDimension[] = [
    {
      dimension: 'DCI',
      name: 'Disciplinary Core Ideas',
      description: 'The fundamental scientific concepts students should understand',
      examples: [
        'PS1: Matter and its interactions',
        'LS1: From molecules to organisms',
        'ESS1: Earth\'s place in the universe',
        'ETS1: Engineering design',
      ],
      gradeLevel: 'All grades',
    },
    {
      dimension: 'SEP',
      name: 'Science and Engineering Practices',
      description: 'The behaviors scientists and engineers engage in',
      examples: [
        'Asking questions and defining problems',
        'Developing and using models',
        'Planning and carrying out investigations',
        'Analyzing and interpreting data',
      ],
      gradeLevel: 'All grades',
    },
    {
      dimension: 'CCC',
      name: 'Crosscutting Concepts',
      description: 'Concepts that apply across all domains of science',
      examples: [
        'Patterns',
        'Cause and effect',
        'Systems and system models',
        'Energy and matter',
      ],
      gradeLevel: 'All grades',
    },
  ]

  const performanceExpectations: PerformanceExpectation[] = [
    {
      code: 'MS-PS1-1',
      title: 'Develop models to describe the atomic composition of simple molecules',
      dci: ['PS1.A: Structure and Properties of Matter'],
      sep: ['Developing and Using Models'],
      ccc: ['Structure and Function'],
      description: 'Students use models to represent atoms and molecules, showing how atoms combine to form molecules.',
    },
    {
      code: 'MS-LS1-5',
      title: 'Construct a scientific explanation based on evidence for how environmental factors influence the growth of organisms',
      dci: ['LS1.B: Growth and Development of Organisms'],
      sep: ['Constructing Explanations'],
      ccc: ['Cause and Effect'],
      description: 'Students investigate how factors like light, water, and nutrients affect plant growth.',
    },
    {
      code: 'MS-ESS1-1',
      title: 'Develop and use a model of the Earth-sun-moon system to describe the cyclic patterns of lunar phases',
      dci: ['ESS1.A: The Universe and Its Stars', 'ESS1.B: Earth and the Solar System'],
      sep: ['Developing and Using Models'],
      ccc: ['Patterns'],
      description: 'Students create models to explain the phases of the moon and their cyclic nature.',
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId]
      setCompletedLessons(newCompletedLessons)
      const newProgress = (newCompletedLessons.length / lessons.length) * 100
      setProgress(newProgress)
      
      // If all lessons are completed, mark module as complete in localStorage
      if (newCompletedLessons.length === lessons.length) {
        const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
        if (!completedModules.includes('ngss-foundations')) {
          completedModules.push('ngss-foundations')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('ngss-foundations') && completedLessons.length < lessons.length) {
      // Mark all lessons as completed if module is already completed
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handleMappingSubmit = () => {
    alert('NGSS mapping saved! You can now use this to design your three-dimensional lesson.')
    setShowMappingTool(false)
  }

  const handleLessonSubmit = () => {
    alert('NGSS-aligned lesson plan saved! Great work on creating a three-dimensional learning experience.')
    setShowLessonDesigner(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/stem-mastery')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Module 1
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    90 min
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {completedLessons.reduce((sum, id) => {
                      const lesson = lessons.find(l => l.id === id)
                      return sum + (lesson?.points || 0)
                    }, 0)} / {lessons.reduce((sum, l) => sum + l.points, 0)} points
                  </span>
                </div>
                <h1 className="text-3xl font-bold">NGSS Foundations & Three-Dimensional Learning</h1>
                <p className="mt-2 text-indigo-100">
                  Master the Next Generation Science Standards framework and understand how DCIs, SEPs, and CCCs work together
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>High Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>{completedLessons.length} of {lessons.length} lessons completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{Math.round(moduleProgress)}% Complete</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lesson Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isActive = idx === currentLesson
                const isCompleted = completedLessons.includes(lesson.id)
                const Icon = lesson.type === 'video' ? Video : lesson.type === 'reading' ? BookOpen : lesson.type === 'interactive' ? Zap : lesson.type === 'project' ? Rocket : FileText

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-indigo-50 border-2 border-indigo-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${
                            isActive ? 'text-indigo-900' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                        </div>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        )}
                        <p className="text-xs text-gray-500">{lesson.points} points</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Lesson Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>Lesson {currentLesson + 1} of {lessons.length}</span>
                    <span>•</span>
                    <span>{currentLessonData.points} points</span>
                    {currentLessonData.duration && (
                      <>
                        <span>•</span>
                        <span>{currentLessonData.duration}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                </div>
                {completedLessons.includes(currentLessonData.id) && (
                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Video Lesson */}
            {currentLessonData.type === 'video' && (
              <div className="space-y-6">
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                    >
                      {isPlaying ? (
                        <Pause className="h-10 w-10" />
                      ) : (
                        <Play className="h-10 w-10 ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-white text-xs">
                      <span>0:00</span>
                      <span>{currentLessonData.duration}</span>
                    </div>
                  </div>
                </div>

                {currentLessonData.content.keyPoints && (
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reading Lesson */}
            {currentLessonData.type === 'reading' && (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.article?.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') || '' }} />
                </div>

                {currentLessonData.content.keyTakeaways && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyTakeaways.map((takeaway: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Three Dimensions Display */}
                {currentLessonData.id === 'three-dimensions' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {ngssDimensions.map((dim, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                            {dim.dimension}
                          </div>
                          <h3 className="text-base font-bold text-gray-900">{dim.name}</h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{dim.description}</p>
                        <div className="space-y-1">
                          {dim.examples.map((example, exIdx) => (
                            <div key={exIdx} className="text-xs text-gray-600 bg-white rounded p-2 border border-indigo-100">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Mapping Tool */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'mapping-tool' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showMappingTool ? (
                    <button
                      onClick={() => setShowMappingTool(true)}
                      className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch NGSS Mapping Tool
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">NGSS Dimension Mapping Tool</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={mappingData.gradeLevel}
                              onChange={(e) => setMappingData({ ...mappingData, gradeLevel: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                              <option value="">Select grade</option>
                              {['K', '1', '2', '3', '4', '5', 'MS', 'HS'].map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade === 'MS' ? 'Middle School' : grade === 'HS' ? 'High School' : `Grade ${grade}`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topic or Concept</label>
                            <input
                              type="text"
                              value={mappingData.topic}
                              onChange={(e) => setMappingData({ ...mappingData, topic: e.target.value })}
                              placeholder="e.g., Photosynthesis, Forces, Ecosystems"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Disciplinary Core Idea (DCI)</label>
                          <select
                            value={mappingData.selectedDCI}
                            onChange={(e) => setMappingData({ ...mappingData, selectedDCI: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          >
                            <option value="">Select DCI</option>
                            <option value="PS1">PS1: Matter and its interactions</option>
                            <option value="LS1">LS1: From molecules to organisms</option>
                            <option value="ESS1">ESS1: Earth's place in the universe</option>
                            <option value="ETS1">ETS1: Engineering design</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Science and Engineering Practice (SEP)</label>
                          <select
                            value={mappingData.selectedSEP}
                            onChange={(e) => setMappingData({ ...mappingData, selectedSEP: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          >
                            <option value="">Select SEP</option>
                            <option value="SEP1">Asking Questions and Defining Problems</option>
                            <option value="SEP2">Developing and Using Models</option>
                            <option value="SEP3">Planning and Carrying Out Investigations</option>
                            <option value="SEP4">Analyzing and Interpreting Data</option>
                            <option value="SEP5">Using Mathematics and Computational Thinking</option>
                            <option value="SEP6">Constructing Explanations</option>
                            <option value="SEP7">Engaging in Argument from Evidence</option>
                            <option value="SEP8">Obtaining, Evaluating, and Communicating Information</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Crosscutting Concept (CCC)</label>
                          <select
                            value={mappingData.selectedCCC}
                            onChange={(e) => setMappingData({ ...mappingData, selectedCCC: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          >
                            <option value="">Select CCC</option>
                            <option value="Patterns">Patterns</option>
                            <option value="Cause and Effect">Cause and Effect</option>
                            <option value="Scale, Proportion, and Quantity">Scale, Proportion, and Quantity</option>
                            <option value="Systems and System Models">Systems and System Models</option>
                            <option value="Energy and Matter">Energy and Matter</option>
                            <option value="Structure and Function">Structure and Function</option>
                            <option value="Stability and Change">Stability and Change</option>
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleMappingSubmit}
                            disabled={!mappingData.gradeLevel || !mappingData.topic || !mappingData.selectedDCI || !mappingData.selectedSEP || !mappingData.selectedCCC}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Generate Mapping
                          </button>
                          <button
                            onClick={() => setShowMappingTool(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Expectations Examples */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Performance Expectations</h3>
                  <div className="space-y-4">
                    {performanceExpectations.map((pe, idx) => (
                      <div key={idx} className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-bold text-gray-900">{pe.code}</h4>
                          <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold">
                            Middle School
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-3">{pe.title}</p>
                        <p className="text-sm text-gray-700 mb-4">{pe.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">DCI</p>
                            {pe.dci.map((d, dIdx) => (
                              <p key={dIdx} className="text-xs text-gray-700 bg-white rounded p-2 border border-indigo-100">{d}</p>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">SEP</p>
                            {pe.sep.map((s, sIdx) => (
                              <p key={sIdx} className="text-xs text-gray-700 bg-white rounded p-2 border border-indigo-100">{s}</p>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">CCC</p>
                            {pe.ccc.map((c, cIdx) => (
                              <p key={cIdx} className="text-xs text-gray-700 bg-white rounded p-2 border border-indigo-100">{c}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Project Lesson */}
            {currentLessonData.type === 'project' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showLessonDesigner ? (
                    <button
                      onClick={() => setShowLessonDesigner(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Lesson Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">NGSS-Aligned Lesson Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                          <input
                            type="text"
                            value={lessonDesign.title}
                            onChange={(e) => setLessonDesign({ ...lessonDesign, title: e.target.value })}
                            placeholder="e.g., Exploring Photosynthesis"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={lessonDesign.gradeLevel}
                              onChange={(e) => setLessonDesign({ ...lessonDesign, gradeLevel: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            >
                              <option value="">Select grade</option>
                              {['K', '1', '2', '3', '4', '5', 'MS', 'HS'].map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade === 'MS' ? 'Middle School' : grade === 'HS' ? 'High School' : `Grade ${grade}`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Performance Expectation</label>
                            <input
                              type="text"
                              value={lessonDesign.performanceExpectation}
                              onChange={(e) => setLessonDesign({ ...lessonDesign, performanceExpectation: e.target.value })}
                              placeholder="e.g., MS-LS1-5"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">DCI</label>
                            <textarea
                              value={lessonDesign.dci}
                              onChange={(e) => setLessonDesign({ ...lessonDesign, dci: e.target.value })}
                              rows={2}
                              placeholder="Disciplinary Core Idea"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SEP</label>
                            <textarea
                              value={lessonDesign.sep}
                              onChange={(e) => setLessonDesign({ ...lessonDesign, sep: e.target.value })}
                              rows={2}
                              placeholder="Science & Engineering Practice"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CCC</label>
                            <textarea
                              value={lessonDesign.ccc}
                              onChange={(e) => setLessonDesign({ ...lessonDesign, ccc: e.target.value })}
                              rows={2}
                              placeholder="Crosscutting Concept"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phenomenon or Hook</label>
                          <textarea
                            value={lessonDesign.phenomenon}
                            onChange={(e) => setLessonDesign({ ...lessonDesign, phenomenon: e.target.value })}
                            rows={3}
                            placeholder="Describe the phenomenon or hook that will engage students..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Three-Dimensional Activities</label>
                          <textarea
                            value={lessonDesign.activities}
                            onChange={(e) => setLessonDesign({ ...lessonDesign, activities: e.target.value })}
                            rows={4}
                            placeholder="Describe activities that integrate DCI, SEP, and CCC..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleLessonSubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Save Lesson Plan
                          </button>
                          <button
                            onClick={() => setShowLessonDesigner(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Requirements</h3>
                  <ol className="space-y-3">
                    {currentLessonData.content.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                onClick={() => {
                  handleLessonComplete(currentLessonData.id)
                  if (currentLesson < lessons.length - 1) {
                    setCurrentLesson(currentLesson + 1)
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition"
              >
                {completedLessons.includes(currentLessonData.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Marked Complete
                  </>
                ) : currentLesson === lessons.length - 1 ? (
                  <>
                    <Trophy className="h-4 w-4" />
                    Complete Module
                  </>
                ) : (
                  <>
                    Complete & Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Module Completion */}
          {completedLessons.length === lessons.length && (
            <div className="mt-6 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Module Complete!</h3>
              <p className="text-gray-700 mb-6">
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Congratulations on mastering NGSS Foundations!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/learning-hub/stem-mastery')}
                  className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Continue to Next Module
                </button>
                <button className="rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Download Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NGSSFoundationsModule


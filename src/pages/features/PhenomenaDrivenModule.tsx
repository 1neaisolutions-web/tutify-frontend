import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Star,
  Video,
  BookOpen,
  Zap,
  FileText,
  Rocket,
  Target,
  Trophy,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Eye,
  Search,
  Filter,
  Sparkles,
  Globe,
  Beaker,
  Microscope,
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

interface Phenomenon {
  title: string
  description: string
  gradeLevel: string
  subject: string
  dci: string[]
  sep: string[]
  ccc: string[]
}

const PhenomenaDrivenModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showPhenomenaSelector, setShowPhenomenaSelector] = useState(false)
  const [showUnitPlanner, setShowUnitPlanner] = useState(false)
  const [selectedPhenomenon, setSelectedPhenomenon] = useState<Phenomenon | null>(null)
  const [unitData, setUnitData] = useState({
    title: '',
    gradeLevel: '',
    phenomenon: '',
    performanceExpectations: '',
    investigations: '',
    assessments: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'power-phenomena',
      type: 'video',
      title: 'The Power of Phenomena',
      duration: '18 min',
      points: 20,
      completed: false,
      content: {
        description: 'Discover how authentic phenomena drive student inquiry and make science relevant and engaging.',
        keyPoints: [
          'Phenomena are observable events that spark curiosity',
          'Authentic phenomena connect to students\' lived experiences',
          'Phenomena-driven instruction promotes inquiry and sense-making',
          'Good phenomena are puzzling, relevant, and observable',
          'Phenomena should drive the entire unit, not just the introduction',
        ],
      },
    },
    {
      id: 'selecting-phenomena',
      type: 'reading',
      title: 'Selecting Authentic Phenomena',
      points: 15,
      completed: false,
      content: {
        article: `# Selecting Authentic Phenomena

## What Makes a Phenomenon Effective?

Authentic phenomena are observable events that spark curiosity and drive scientific inquiry. They serve as the anchor for entire units of instruction.

### Characteristics of Effective Phenomena

**Observable**: Students can directly observe or experience the phenomenon
- Real-world events students can see, hear, or experience
- Not abstract concepts or theories
- Accessible through videos, demonstrations, or field experiences

**Puzzling**: Creates a "need to know"
- Raises questions students want to answer
- Not immediately explainable with current knowledge
- Promotes curiosity and wonder

**Relevant**: Connects to students' lives
- Relates to students' experiences, interests, or communities
- Addresses real-world problems or issues
- Culturally responsive and inclusive

**Complex**: Allows for multiple investigations
- Can be explored through various lenses
- Connects multiple science concepts
- Supports extended inquiry over time

### Examples of Effective Phenomena

**Elementary**: Why do some plants grow better in certain places?
**Middle School**: How do birds know when to migrate?
**High School**: Why do some communities experience more flooding than others?

### Selecting Phenomena for Your Context

Consider:
- Student interests and backgrounds
- Local environmental or community issues
- Current events or seasonal patterns
- Available resources and materials
- Alignment with NGSS performance expectations`,
        keyTakeaways: [
          'Effective phenomena are observable, puzzling, relevant, and complex',
          'Phenomena should connect to students\' lived experiences',
          'Select phenomena that align with your performance expectations',
          'Consider local context and student interests',
        ],
      },
    },
    {
      id: 'phenomena-selector',
      type: 'interactive',
      title: 'Phenomena Library & Selector',
      points: 25,
      completed: false,
      content: {
        description: 'Browse and select phenomena from a curated library, or add your own phenomena.',
        steps: [
          'Browse phenomena by grade level and subject',
          'Filter by NGSS dimensions',
          'Preview phenomenon details',
          'Select or customize phenomena',
          'Save to your collection',
        ],
      },
    },
    {
      id: 'facilitating-inquiry',
      type: 'video',
      title: 'Facilitating Inquiry',
      duration: '20 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn strategies for facilitating student-driven inquiry around phenomena.',
        keyPoints: [
          'Start with observation and wonder',
          'Let students generate questions',
          'Support multiple investigation pathways',
          'Facilitate sense-making discussions',
          'Connect investigations back to the phenomenon',
        ],
      },
    },
    {
      id: 'unit-design-project',
      type: 'project',
      title: 'Design Phenomena-Based Unit',
      points: 20,
      completed: false,
      content: {
        description: 'Create a complete phenomena-driven unit plan with investigations and assessments.',
        requirements: [
          'Select an authentic phenomenon',
          'Identify performance expectations',
          'Design investigations',
          'Plan sense-making activities',
          'Create assessments',
        ],
      },
    },
  ]

  const phenomenaExamples: Phenomenon[] = [
    {
      title: 'Why do some plants grow better in certain places?',
      description: 'Students observe plants growing in different locations and investigate factors affecting growth.',
      gradeLevel: 'Elementary (3-5)',
      subject: 'Life Science',
      dci: ['LS1.C: Organization for Matter and Energy Flow', 'LS2.A: Interdependent Relationships'],
      sep: ['Asking Questions', 'Planning and Carrying Out Investigations'],
      ccc: ['Cause and Effect', 'Systems and System Models'],
    },
    {
      title: 'How do birds know when to migrate?',
      description: 'Students investigate migration patterns and the environmental cues that trigger migration.',
      gradeLevel: 'Middle School (6-8)',
      subject: 'Life Science',
      dci: ['LS1.D: Information Processing', 'LS2.C: Ecosystem Dynamics'],
      sep: ['Analyzing and Interpreting Data', 'Constructing Explanations'],
      ccc: ['Patterns', 'Cause and Effect'],
    },
    {
      title: 'Why do some communities experience more flooding than others?',
      description: 'Students explore factors contributing to flooding and design solutions for flood prevention.',
      gradeLevel: 'High School (9-12)',
      subject: 'Earth Science',
      dci: ['ESS3.B: Natural Hazards', 'ESS2.C: The Roles of Water'],
      sep: ['Using Mathematics', 'Designing Solutions'],
      ccc: ['Stability and Change', 'Systems and System Models'],
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
        if (!completedModules.includes('phenomena-driven')) {
          completedModules.push('phenomena-driven')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('phenomena-driven') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handlePhenomenonSelect = (phenomenon: Phenomenon) => {
    setSelectedPhenomenon(phenomenon)
    alert(`Phenomenon "${phenomenon.title}" selected! You can now use this in your unit design.`)
  }

  const handleUnitSubmit = () => {
    alert('Phenomena-based unit plan saved! You can now implement this in your classroom.')
    setShowUnitPlanner(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 5
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
                <h1 className="text-3xl font-bold">Phenomena-Driven Instruction</h1>
                <p className="mt-2 text-purple-100">
                  Learn to use authentic phenomena to drive student inquiry and make science relevant and engaging
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
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
                      isActive ? 'bg-purple-50 border-2 border-purple-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-purple-900' : 'text-gray-900'}`}>
                            {lesson.title}
                          </p>
                        </div>
                        {lesson.duration && <p className="text-xs text-gray-500">{lesson.duration}</p>}
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
                      {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
                    </button>
                  </div>
                </div>
                {currentLessonData.content.keyPoints && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
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
              </div>
            )}

            {/* Interactive Phenomena Selector */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'phenomena-selector' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showPhenomenaSelector ? (
                    <button
                      onClick={() => setShowPhenomenaSelector(true)}
                      className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Phenomena Library
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Search className="h-5 w-5 text-purple-600" />
                        <input
                          type="text"
                          placeholder="Search phenomena..."
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                        <button className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold hover:bg-purple-200 flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Filter
                        </button>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-base font-semibold text-gray-900">Example Phenomena</h4>
                        {phenomenaExamples.map((phenomenon, idx) => (
                          <div key={idx} className="bg-purple-50 rounded-lg p-5 border border-purple-200 hover:border-purple-300 transition">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h5 className="text-base font-bold text-gray-900 mb-2">{phenomenon.title}</h5>
                                <p className="text-sm text-gray-700 mb-3">{phenomenon.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="px-2 py-1 rounded bg-white text-purple-700 text-xs font-semibold">
                                    {phenomenon.gradeLevel}
                                  </span>
                                  <span className="px-2 py-1 rounded bg-white text-purple-700 text-xs font-semibold">
                                    {phenomenon.subject}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <p className="font-semibold text-gray-600 mb-1">DCIs:</p>
                                    {phenomenon.dci.map((dci, dIdx) => (
                                      <p key={dIdx} className="text-gray-700">{dci}</p>
                                    ))}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-600 mb-1">SEPs:</p>
                                    {phenomenon.sep.map((sep, sIdx) => (
                                      <p key={sIdx} className="text-gray-700">{sep}</p>
                                    ))}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-600 mb-1">CCCs:</p>
                                    {phenomenon.ccc.map((ccc, cIdx) => (
                                      <p key={cIdx} className="text-gray-700">{ccc}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePhenomenonSelect(phenomenon)}
                              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                            >
                              Select This Phenomenon
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Lesson */}
            {currentLessonData.type === 'project' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showUnitPlanner ? (
                    <button
                      onClick={() => setShowUnitPlanner(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Unit Planner
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phenomena-Based Unit Planner</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Unit Title</label>
                          <input
                            type="text"
                            value={unitData.title}
                            onChange={(e) => setUnitData({ ...unitData, title: e.target.value })}
                            placeholder="e.g., Investigating Plant Growth"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={unitData.gradeLevel}
                              onChange={(e) => setUnitData({ ...unitData, gradeLevel: e.target.value })}
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
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Anchor Phenomenon</label>
                          <textarea
                            value={unitData.phenomenon}
                            onChange={(e) => setUnitData({ ...unitData, phenomenon: e.target.value })}
                            rows={3}
                            placeholder="Describe the anchor phenomenon that will drive this unit..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Performance Expectations</label>
                          <textarea
                            value={unitData.performanceExpectations}
                            onChange={(e) => setUnitData({ ...unitData, performanceExpectations: e.target.value })}
                            rows={2}
                            placeholder="List NGSS performance expectations..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Investigations</label>
                          <textarea
                            value={unitData.investigations}
                            onChange={(e) => setUnitData({ ...unitData, investigations: e.target.value })}
                            rows={4}
                            placeholder="Describe the investigations students will conduct..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assessments</label>
                          <textarea
                            value={unitData.assessments}
                            onChange={(e) => setUnitData({ ...unitData, assessments: e.target.value })}
                            rows={3}
                            placeholder="Describe how you will assess student understanding..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleUnitSubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Save Unit Plan
                          </button>
                          <button
                            onClick={() => setShowUnitPlanner(false)}
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
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition"
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
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Excellent work!
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

export default PhenomenaDrivenModule

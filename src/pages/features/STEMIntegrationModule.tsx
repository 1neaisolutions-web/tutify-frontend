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
  Layers,
  Link2,
  Network,
  Puzzle,
  Code,
  FlaskConical,
  Calculator,
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

interface IntegrationModel {
  name: string
  description: string
  approach: string
  example: string
}

const STEMIntegrationModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showIntegrationPlanner, setShowIntegrationPlanner] = useState(false)
  const [showProjectDesigner, setShowProjectDesigner] = useState(false)
  const [projectData, setProjectData] = useState({
    title: '',
    gradeLevel: '',
    subjects: [] as string[],
    duration: '',
    drivingQuestion: '',
    activities: '',
    assessments: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'integration-models',
      type: 'video',
      title: 'STEM Integration Models',
      duration: '18 min',
      points: 20,
      completed: false,
      content: {
        description: 'Explore different models for integrating Science, Technology, Engineering, and Mathematics.',
        keyPoints: [
          'Multiple models exist for STEM integration',
          'Integration can be content-based, context-based, or project-based',
          'Choose integration models that fit your context',
          'Effective integration enhances learning across disciplines',
          'Collaboration with colleagues strengthens integration',
        ],
      },
    },
    {
      id: 'cross-curricular',
      type: 'reading',
      title: 'Cross-Curricular Connections',
      points: 15,
      completed: false,
      content: {
        article: `# Cross-Curricular Connections

## Why Integrate STEM?

STEM integration helps students see connections between disciplines and understand how knowledge applies in real-world contexts.

### Benefits of Integration

**Deeper Understanding**: Students see how concepts connect across subjects
- Science concepts reinforced through mathematics
- Engineering challenges require scientific knowledge
- Technology tools support all disciplines

**Real-World Relevance**: Integration mirrors how problems are solved in the real world
- Real problems don't fit into single subject boxes
- Professionals use knowledge from multiple disciplines
- Students develop transferable skills

**Engagement**: Integrated approaches increase student motivation
- More engaging than isolated subjects
- Students see purpose and relevance
- Multiple entry points for different learners

### Integration Approaches

**Content Integration**: Teaching concepts from multiple subjects together
- Science and math concepts taught simultaneously
- Technology used to explore scientific phenomena
- Engineering challenges incorporate math and science

**Context Integration**: Using one subject as context for others
- Science provides context for math problems
- Engineering challenges drive science learning
- Technology tools support all subjects

**Project-Based Integration**: Projects that require multiple disciplines
- Long-term projects spanning weeks or months
- Students apply knowledge from all STEM subjects
- Authentic problems requiring integrated solutions

### Planning Integrated Lessons

1. **Identify Connections**: Find natural connections between subjects
2. **Set Learning Goals**: Define what students will learn in each subject
3. **Design Activities**: Create activities that integrate multiple subjects
4. **Plan Assessment**: Assess learning in all integrated subjects
5. **Collaborate**: Work with colleagues from other subjects`,
        keyTakeaways: [
          'Integration helps students see connections between disciplines',
          'Multiple approaches to integration exist',
          'Effective integration requires planning and collaboration',
          'Real-world problems naturally integrate multiple subjects',
        ],
      },
    },
    {
      id: 'integration-planner',
      type: 'interactive',
      title: 'STEM Integration Planner',
      points: 25,
      completed: false,
      content: {
        description: 'Use this tool to plan integrated STEM lessons and projects.',
        steps: [
          'Select subjects to integrate',
          'Identify learning goals for each subject',
          'Design integrated activities',
          'Plan assessments',
          'Create implementation timeline',
        ],
      },
    },
    {
      id: 'project-based-stem',
      type: 'video',
      title: 'Project-Based STEM',
      duration: '20 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn how to design and implement project-based learning that integrates all STEM subjects.',
        keyPoints: [
          'Projects should address authentic problems',
          'Design projects that require multiple disciplines',
          'Provide scaffolds and supports for students',
          'Assess both process and product',
          'Reflect and iterate on project design',
        ],
      },
    },
    {
      id: 'integrated-project',
      type: 'project',
      title: 'Design Integrated STEM Project',
      points: 20,
      completed: false,
      content: {
        description: 'Create a comprehensive integrated STEM project that spans multiple subjects and weeks.',
        requirements: [
          'Identify authentic problem or challenge',
          'Integrate all four STEM subjects',
          'Design project timeline and milestones',
          'Create assessment rubrics',
          'Plan collaboration strategies',
        ],
      },
    },
  ]

  const integrationModels: IntegrationModel[] = [
    {
      name: 'Content Integration',
      description: 'Teaching concepts from multiple subjects simultaneously',
      approach: 'Science and math concepts taught together, technology used to explore phenomena, engineering challenges incorporate multiple subjects',
      example: 'Teaching force and motion while using mathematical equations and engineering design challenges',
    },
    {
      name: 'Context Integration',
      description: 'Using one subject as context for others',
      approach: 'Science provides context for math problems, engineering drives science learning, technology supports all subjects',
      example: 'Using environmental science data to teach statistical analysis and data visualization',
    },
    {
      name: 'Project-Based Integration',
      description: 'Long-term projects requiring multiple disciplines',
      approach: 'Authentic problems requiring integrated solutions, students apply knowledge from all STEM subjects',
      example: 'Designing and building a sustainable garden system integrating biology, engineering, data analysis, and technology',
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
        if (!completedModules.includes('integration-strategies')) {
          completedModules.push('integration-strategies')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('integration-strategies') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handleProjectSubmit = () => {
    alert('Integrated STEM project saved! You can now implement this in your classroom.')
    setShowProjectDesigner(false)
  }

  const toggleSubject = (subject: string) => {
    setProjectData({
      ...projectData,
      subjects: projectData.subjects.includes(subject)
        ? projectData.subjects.filter(s => s !== subject)
        : [...projectData.subjects, subject]
    })
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
                    Module 7
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
                <h1 className="text-3xl font-bold">STEM Integration Strategies</h1>
                <p className="mt-2 text-indigo-100">
                  Learn to seamlessly integrate Science, Technology, Engineering, and Mathematics
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
                      isActive ? 'bg-indigo-50 border-2 border-indigo-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-900' : 'text-gray-900'}`}>
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

                {/* Integration Models */}
                {currentLessonData.id === 'integration-models' && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">STEM Integration Models</h3>
                    <div className="space-y-4">
                      {integrationModels.map((model, idx) => (
                        <div key={idx} className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Layers className="h-5 w-5 text-indigo-600" />
                            <h4 className="text-base font-bold text-gray-900">{model.name}</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{model.description}</p>
                          <div className="bg-white rounded p-3 border border-indigo-100 mb-3">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Approach:</p>
                            <p className="text-xs text-gray-700">{model.approach}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-indigo-100">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Example:</p>
                            <p className="text-xs text-gray-700">{model.example}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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

            {/* Interactive Integration Planner */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'integration-planner' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showIntegrationPlanner ? (
                    <button
                      onClick={() => setShowIntegrationPlanner(true)}
                      className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Integration Planner
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">STEM Integration Planner</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Subjects to Integrate</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Science', 'Technology', 'Engineering', 'Mathematics'].map((subject) => {
                              const Icon = subject === 'Science' ? FlaskConical : subject === 'Technology' ? Code : subject === 'Engineering' ? Puzzle : Calculator
                              const isSelected = projectData.subjects.includes(subject)
                              return (
                                <button
                                  key={subject}
                                  onClick={() => toggleSubject(subject)}
                                  className={`p-4 rounded-lg border-2 transition ${
                                    isSelected
                                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-indigo-300'
                                  }`}
                                >
                                  <Icon className="h-6 w-6 mx-auto mb-2" />
                                  <p className="text-sm font-semibold">{subject}</p>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Integration Model</p>
                          <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                            <option>Content Integration</option>
                            <option>Context Integration</option>
                            <option>Project-Based Integration</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
                          <textarea
                            rows={4}
                            placeholder="Describe learning goals for each integrated subject..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Save Integration Plan
                          </button>
                          <button
                            onClick={() => setShowIntegrationPlanner(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
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
                  
                  {!showProjectDesigner ? (
                    <button
                      onClick={() => setShowProjectDesigner(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Project Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrated STEM Project Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                          <input
                            type="text"
                            value={projectData.title}
                            onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                            placeholder="e.g., Sustainable Garden System"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={projectData.gradeLevel}
                              onChange={(e) => setProjectData({ ...projectData, gradeLevel: e.target.value })}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <input
                              type="text"
                              value={projectData.duration}
                              onChange={(e) => setProjectData({ ...projectData, duration: e.target.value })}
                              placeholder="e.g., 4 weeks"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Driving Question</label>
                          <textarea
                            value={projectData.drivingQuestion}
                            onChange={(e) => setProjectData({ ...projectData, drivingQuestion: e.target.value })}
                            rows={2}
                            placeholder="What is the central question that drives this project?"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Project Activities</label>
                          <textarea
                            value={projectData.activities}
                            onChange={(e) => setProjectData({ ...projectData, activities: e.target.value })}
                            rows={5}
                            placeholder="Describe activities that integrate all STEM subjects..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assessments</label>
                          <textarea
                            value={projectData.assessments}
                            onChange={(e) => setProjectData({ ...projectData, assessments: e.target.value })}
                            rows={4}
                            placeholder="Describe how you will assess learning in each integrated subject..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleProjectSubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Save Project Plan
                          </button>
                          <button
                            onClick={() => setShowProjectDesigner(false)}
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

export default STEMIntegrationModule




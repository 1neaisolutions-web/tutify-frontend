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
  ClipboardCheck,
  FileCheck,
  Award,
  CheckSquare,
  ListChecks,
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

interface RubricCriteria {
  dimension: 'DCI' | 'SEP' | 'CCC'
  criteria: string
  levels: string[]
}

const NGSSAssessmentModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showRubricBuilder, setShowRubricBuilder] = useState(false)
  const [showAssessmentDesigner, setShowAssessmentDesigner] = useState(false)
  const [rubricData, setRubricData] = useState({
    title: '',
    performanceExpectation: '',
    criteria: [] as RubricCriteria[],
  })
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    type: '',
    performanceExpectations: '',
    task: '',
    rubric: '',
    portfolioItems: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'three-dimensional-assessment',
      type: 'video',
      title: 'Three-Dimensional Assessment',
      duration: '18 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn how to design assessments that authentically measure three-dimensional learning.',
        keyPoints: [
          'Three-dimensional assessments integrate DCIs, SEPs, and CCCs',
          'Assessments should mirror how students use knowledge in the real world',
          'Performance tasks are ideal for three-dimensional assessment',
          'Formative assessment supports learning throughout instruction',
          'Summative assessment demonstrates final understanding',
        ],
      },
    },
    {
      id: 'performance-tasks',
      type: 'reading',
      title: 'Performance Task Design',
      points: 15,
      completed: false,
      content: {
        article: `# Performance Task Design

## What Are Performance Tasks?

Performance tasks are assessments that require students to demonstrate their understanding by completing authentic, meaningful tasks.

### Characteristics of Effective Performance Tasks

**Authentic**: Tasks mirror real-world applications
- Students solve problems similar to those professionals face
- Tasks have real-world relevance and purpose
- Multiple solution pathways are possible

**Three-Dimensional**: Integrate DCIs, SEPs, and CCCs
- Tasks require students to use disciplinary knowledge
- Students engage in science and engineering practices
- Crosscutting concepts are explicitly assessed

**Complex**: Require multiple steps and skills
- Tasks cannot be completed with simple recall
- Students must integrate knowledge and skills
- Multiple components assess different aspects of understanding

**Open-Ended**: Allow for multiple approaches
- No single "correct" answer
- Students can demonstrate understanding in various ways
- Creativity and critical thinking are valued

### Designing Performance Tasks

**1. Identify Learning Goals**
- What should students know and be able to do?
- Which performance expectations are being assessed?
- What DCIs, SEPs, and CCCs are involved?

**2. Create Authentic Context**
- What real-world problem or phenomenon provides context?
- How does this connect to students' lives?
- What makes this task meaningful?

**3. Design the Task**
- What will students actually do?
- What products or performances will demonstrate understanding?
- What resources and supports are needed?

**4. Develop Rubrics**
- What does success look like?
- How will you assess each dimension?
- What evidence demonstrates understanding?

**5. Plan Implementation**
- How will you introduce the task?
- What scaffolds and supports are needed?
- How will you provide feedback?`,
        keyTakeaways: [
          'Performance tasks should be authentic and three-dimensional',
          'Tasks should require complex thinking and multiple skills',
          'Effective rubrics assess all three dimensions',
          'Scaffolding supports student success',
        ],
      },
    },
    {
      id: 'rubric-builder',
      type: 'interactive',
      title: 'Rubric Builder Tool',
      points: 25,
      completed: false,
      content: {
        description: 'Create three-dimensional rubrics that assess DCIs, SEPs, and CCCs.',
        steps: [
          'Select performance expectation',
          'Identify assessment dimensions',
          'Define criteria for each dimension',
          'Create performance levels',
          'Generate rubric',
        ],
      },
    },
    {
      id: 'portfolio-development',
      type: 'video',
      title: 'Portfolio Development',
      duration: '15 min',
      points: 15,
      completed: false,
      content: {
        description: 'Learn how to build comprehensive portfolios that showcase student growth and understanding.',
        keyPoints: [
          'Portfolios document student learning over time',
          'Include multiple types of evidence',
          'Students reflect on their learning',
          'Portfolios demonstrate growth and achievement',
          'Use portfolios for both assessment and celebration',
        ],
      },
    },
    {
      id: 'assessment-suite-project',
      type: 'project',
      title: 'Create Assessment Suite',
      points: 25,
      completed: false,
      content: {
        description: 'Develop a complete NGSS-aligned assessment system including formative, summative, and portfolio assessments.',
        requirements: [
          'Design performance task',
          'Create three-dimensional rubric',
          'Plan formative assessments',
          'Develop portfolio framework',
          'Design assessment timeline',
        ],
      },
    },
  ]

  const rubricCriteriaExamples: RubricCriteria[] = [
    {
      dimension: 'DCI',
      criteria: 'Understanding of Disciplinary Core Ideas',
      levels: [
        'Demonstrates deep understanding with accurate explanations',
        'Shows solid understanding with minor gaps',
        'Demonstrates basic understanding with some misconceptions',
        'Shows limited understanding with significant gaps',
      ],
    },
    {
      dimension: 'SEP',
      criteria: 'Engagement in Science and Engineering Practices',
      levels: [
        'Independently engages in practices with sophistication',
        'Engages in practices with guidance and support',
        'Attempts practices but needs significant support',
        'Struggles to engage in practices',
      ],
    },
    {
      dimension: 'CCC',
      criteria: 'Application of Crosscutting Concepts',
      levels: [
        'Consistently applies concepts across contexts',
        'Applies concepts with some support',
        'Recognizes concepts but struggles to apply',
        'Does not demonstrate understanding of concepts',
      ],
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
        if (!completedModules.includes('assessment-ngss')) {
          completedModules.push('assessment-ngss')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('assessment-ngss') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handleRubricSubmit = () => {
    alert('Three-dimensional rubric saved! You can now use this for assessment.')
    setShowRubricBuilder(false)
  }

  const handleAssessmentSubmit = () => {
    alert('Assessment suite saved! You now have a complete NGSS-aligned assessment system.')
    setShowAssessmentDesigner(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 8
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    75 min
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
                <h1 className="text-3xl font-bold">NGSS-Aligned Assessment & Portfolio Development</h1>
                <p className="mt-2 text-emerald-100">
                  Design three-dimensional assessments that authentically measure student understanding
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
                      isActive ? 'bg-emerald-50 border-2 border-emerald-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-emerald-900' : 'text-gray-900'}`}>
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
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
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

            {/* Interactive Rubric Builder */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'rubric-builder' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showRubricBuilder ? (
                    <button
                      onClick={() => setShowRubricBuilder(true)}
                      className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Rubric Builder
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Three-Dimensional Rubric Builder</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rubric Title</label>
                          <input
                            type="text"
                            value={rubricData.title}
                            onChange={(e) => setRubricData({ ...rubricData, title: e.target.value })}
                            placeholder="e.g., Ecosystem Interactions Performance Task Rubric"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Performance Expectation</label>
                          <input
                            type="text"
                            value={rubricData.performanceExpectation}
                            onChange={(e) => setRubricData({ ...rubricData, performanceExpectation: e.target.value })}
                            placeholder="e.g., MS-LS2-1"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold text-gray-900">Rubric Criteria</h4>
                          {rubricCriteriaExamples.map((criteria, idx) => (
                            <div key={idx} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckSquare className="h-5 w-5 text-emerald-600" />
                                <h5 className="text-sm font-bold text-gray-900">{criteria.dimension}: {criteria.criteria}</h5>
                              </div>
                              <div className="space-y-2">
                                {criteria.levels.map((level, levelIdx) => (
                                  <div key={levelIdx} className="flex items-start gap-2 text-xs text-gray-700 bg-white rounded p-2 border border-emerald-100">
                                    <span className="font-semibold text-emerald-700">{levelIdx + 1}.</span>
                                    <span>{level}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleRubricSubmit}
                            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                          >
                            Save Rubric
                          </button>
                          <button
                            onClick={() => setShowRubricBuilder(false)}
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
                  
                  {!showAssessmentDesigner ? (
                    <button
                      onClick={() => setShowAssessmentDesigner(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Assessment Suite Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">NGSS Assessment Suite Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Suite Title</label>
                          <input
                            type="text"
                            value={assessmentData.title}
                            onChange={(e) => setAssessmentData({ ...assessmentData, title: e.target.value })}
                            placeholder="e.g., Ecosystems Unit Assessment Suite"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                          <select
                            value={assessmentData.type}
                            onChange={(e) => setAssessmentData({ ...assessmentData, type: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          >
                            <option value="">Select type</option>
                            <option value="performance-task">Performance Task</option>
                            <option value="formative">Formative Assessment</option>
                            <option value="summative">Summative Assessment</option>
                            <option value="portfolio">Portfolio Assessment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Performance Expectations</label>
                          <textarea
                            value={assessmentData.performanceExpectations}
                            onChange={(e) => setAssessmentData({ ...assessmentData, performanceExpectations: e.target.value })}
                            rows={2}
                            placeholder="List NGSS performance expectations being assessed..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Task</label>
                          <textarea
                            value={assessmentData.task}
                            onChange={(e) => setAssessmentData({ ...assessmentData, task: e.target.value })}
                            rows={5}
                            placeholder="Describe the assessment task students will complete..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rubric</label>
                          <textarea
                            value={assessmentData.rubric}
                            onChange={(e) => setAssessmentData({ ...assessmentData, rubric: e.target.value })}
                            rows={4}
                            placeholder="Describe rubric criteria for each dimension..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Items</label>
                          <textarea
                            value={assessmentData.portfolioItems}
                            onChange={(e) => setAssessmentData({ ...assessmentData, portfolioItems: e.target.value })}
                            rows={3}
                            placeholder="List items students should include in their portfolio..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleAssessmentSubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Save Assessment Suite
                          </button>
                          <button
                            onClick={() => setShowAssessmentDesigner(false)}
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
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition"
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
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Congratulations!
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

export default NGSSAssessmentModule




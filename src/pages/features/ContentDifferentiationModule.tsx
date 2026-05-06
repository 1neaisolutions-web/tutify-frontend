import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  Download,
  Share2,
  Bookmark,
  Video,
  BookOpen,
  Zap,
  FileText,
  Target,
  Trophy,
  Award,
  Lightbulb,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Eye,
  Settings,
  Maximize2,
  FileCheck,
  Users,
} from 'lucide-react'

interface LessonContent {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template'
  title: string
  duration?: string
  points: number
  completed: boolean
  content: any
}

interface LearningContract {
  studentName: string
  learningObjective: string
  contentOptions: string[]
  timeline: string
  assessmentMethod: string
  resources: string[]
  checkpoints: string[]
}

const ContentDifferentiationModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showContractTool, setShowContractTool] = useState(false)
  const [learningContract, setLearningContract] = useState<LearningContract>({
    studentName: '',
    learningObjective: '',
    contentOptions: [],
    timeline: '',
    assessmentMethod: '',
    resources: [],
    checkpoints: [],
  })
  const [currentContentOption, setCurrentContentOption] = useState('')
  const [currentResource, setCurrentResource] = useState('')
  const [currentCheckpoint, setCurrentCheckpoint] = useState('')

  const lessons: LessonContent[] = [
    {
      id: 'content-video',
      type: 'video',
      title: 'Content Differentiation Strategies',
      duration: '15 min',
      points: 25,
      completed: false,
      content: {
        description: 'Learn how to vary what students learn based on readiness, interests, and learning profiles while maintaining rigor.',
        keyPoints: [
          'Content differentiation varies what students learn, not just how',
          'Learning contracts provide structure and choice',
          'Curriculum compacting accelerates advanced learners',
          'Interest-based learning increases engagement',
          'All content variations must maintain academic rigor',
        ],
        transcript: 'Welcome to Advanced Content Differentiation. In this module, you\'ll learn sophisticated strategies for varying what students learn based on their readiness, interests, and learning profiles...',
      },
    },
    {
      id: 'contracts-reading',
      type: 'reading',
      title: 'Learning Contracts & Compacting',
      points: 20,
      completed: false,
      content: {
        article: `# Learning Contracts & Curriculum Compacting

## Understanding Learning Contracts

Learning contracts are agreements between teachers and students that outline what students will learn, how they'll learn it, and how they'll demonstrate their learning. They provide structure while offering choice and autonomy.

### Key Components of Learning Contracts

**Learning Objectives**: Clear statements of what students will learn
**Content Options**: Multiple ways to access and engage with content
**Timeline**: Realistic deadlines and checkpoints
**Assessment Methods**: How students will demonstrate learning
**Resources**: Materials and supports available
**Checkpoints**: Regular progress reviews

### Benefits of Learning Contracts

- **Student Ownership**: Students take responsibility for their learning
- **Differentiation**: Contracts can be tailored to individual needs
- **Choice**: Students have agency in how they learn
- **Structure**: Provides clear expectations and timelines
- **Flexibility**: Can be adjusted based on progress

## Curriculum Compacting

Curriculum compacting is a strategy for advanced learners who have already mastered content. It involves:

1. **Pre-Assessment**: Identify what students already know
2. **Elimination**: Remove content students have mastered
3. **Acceleration**: Move students to more advanced content
4. **Enrichment**: Provide deeper, more complex learning opportunities

### When to Use Compacting

- Students consistently score 90%+ on pre-assessments
- Students demonstrate mastery through performance tasks
- Students express boredom or disengagement
- Students finish work quickly and accurately

### Compacting Process

**Step 1: Pre-Assess**
- Use quizzes, performance tasks, or observations
- Identify mastered content and skills

**Step 2: Document Mastery**
- Create a record of what students know
- Share with students and parents

**Step 3: Create Replacement Activities**
- Design enrichment or acceleration activities
- Ensure activities are meaningful and challenging

**Step 4: Monitor Progress**
- Check in regularly with students
- Adjust activities as needed

## Interest-Based Learning

Interest-based learning taps into students' passions and curiosities while maintaining learning objectives.

### Strategies

**Interest Inventories**: Survey students about their interests
**Choice Boards**: Offer multiple content options aligned to interests
**Project-Based Learning**: Allow students to explore interests through projects
**Real-World Connections**: Connect content to students' interests

### Maintaining Rigor

- Ensure all content options address learning objectives
- Use rubrics that work across content variations
- Provide appropriate challenge levels
- Maintain academic standards

## Key Takeaways

- Learning contracts provide structure with choice
- Compacting accelerates advanced learners appropriately
- Interest-based learning increases engagement
- All content variations must maintain rigor
- Regular checkpoints ensure progress`,
        keyTakeaways: [
          'Learning contracts balance structure and choice',
          'Compacting accelerates advanced learners appropriately',
          'Interest-based learning increases engagement',
          'All content must maintain academic rigor',
          'Regular checkpoints ensure student progress',
        ],
      },
    },
    {
      id: 'planner-tool',
      type: 'interactive',
      title: 'Content Differentiation Planner',
      points: 30,
      completed: false,
      content: {
        description: 'Design learning contracts and compacting plans that provide choice while maintaining rigor.',
        steps: [
          'Define learning objectives',
          'Identify student readiness and interests',
          'Create content options',
          'Design learning contract',
          'Plan assessment methods',
        ],
      },
    },
    {
      id: 'contract-templates',
      type: 'template',
      title: 'Learning Contract Templates',
      points: 20,
      completed: false,
      content: {
        description: 'Download ready-to-use templates for creating learning contracts across subjects and grade levels.',
        sections: [
          'Learning Objective Definition',
          'Content Option Selection',
          'Timeline and Checkpoints',
          'Assessment Planning',
          'Resource List',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('content-differentiation-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('content-differentiation-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddContentOption = () => {
    if (currentContentOption.trim()) {
      setLearningContract({
        ...learningContract,
        contentOptions: [...learningContract.contentOptions, currentContentOption.trim()],
      })
      setCurrentContentOption('')
    }
  }

  const handleAddResource = () => {
    if (currentResource.trim()) {
      setLearningContract({
        ...learningContract,
        resources: [...learningContract.resources, currentResource.trim()],
      })
      setCurrentResource('')
    }
  }

  const handleAddCheckpoint = () => {
    if (currentCheckpoint.trim()) {
      setLearningContract({
        ...learningContract,
        checkpoints: [...learningContract.checkpoints, currentCheckpoint.trim()],
      })
      setCurrentCheckpoint('')
    }
  }

  const handleContractSubmit = () => {
    if (!learningContract.learningObjective || learningContract.contentOptions.length === 0) {
      alert('Please fill in the learning objective and at least one content option.')
      return
    }
    alert('Learning contract saved! You can now implement this with your students.')
    setShowContractTool(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/advanced-differentiation-path')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Module 2 of 6
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    35 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Advanced Content Differentiation</h1>
                <p className="mt-2 text-green-100">
                  Learn sophisticated strategies for varying what students learn based on readiness, interests, and learning profiles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{completedLessons.length} of {lessons.length} lessons completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{Math.round(moduleProgress)}% Complete</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lessons Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isActive = idx === currentLesson
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : isCompleted
                        ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs font-semibold">Lesson {idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {lesson.type === 'video' && <Video className="h-3 w-3" />}
                      {lesson.type === 'reading' && <BookOpen className="h-3 w-3" />}
                      {lesson.type === 'interactive' && <Zap className="h-3 w-3" />}
                      {lesson.type === 'template' && <FileText className="h-3 w-3" />}
                      <span>{lesson.title}</span>
                    </div>
                    {lesson.duration && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-semibold text-gray-900">{Math.round(moduleProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Video Lesson */}
            {currentLessonData.type === 'video' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Video Lesson</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {currentLessonData.points} points
                    </span>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-20"></div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-green-600 ml-1" />
                    ) : (
                      <Play className="h-8 w-8 text-green-600 ml-1" />
                    )}
                  </button>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints?.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Reading Lesson */}
            {currentLessonData.type === 'reading' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Reading</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white rounded-lg p-8 border border-gray-200">
                    <div
                      className="text-gray-700 leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: currentLessonData.content.article?.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') || '',
                      }}
                    />
                  </div>
                </div>

                {currentLessonData.content.keyTakeaways && (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyTakeaways.map((takeaway: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Interactive Tool */}
            {currentLessonData.type === 'interactive' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Interactive Tool</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Design Steps</h3>
                  <ol className="space-y-2">
                    {currentLessonData.content.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Student Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={learningContract.studentName}
                      onChange={(e) => setLearningContract({ ...learningContract, studentName: e.target.value })}
                      placeholder="Enter student name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Learning Objective *
                    </label>
                    <textarea
                      value={learningContract.learningObjective}
                      onChange={(e) => setLearningContract({ ...learningContract, learningObjective: e.target.value })}
                      placeholder="What should the student learn? (e.g., Students will understand the causes and effects of the American Revolution)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Content Options * (Add at least one)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentContentOption}
                        onChange={(e) => setCurrentContentOption(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddContentOption()}
                        placeholder="Enter a content option"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddContentOption}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {learningContract.contentOptions.map((option, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {option}
                          <button
                            onClick={() => {
                              setLearningContract({
                                ...learningContract,
                                contentOptions: learningContract.contentOptions.filter((_, i) => i !== idx),
                              })
                            }}
                            className="text-green-700 hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Timeline
                    </label>
                    <input
                      type="text"
                      value={learningContract.timeline}
                      onChange={(e) => setLearningContract({ ...learningContract, timeline: e.target.value })}
                      placeholder="e.g., 2 weeks, due by March 15th"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Assessment Method
                    </label>
                    <textarea
                      value={learningContract.assessmentMethod}
                      onChange={(e) => setLearningContract({ ...learningContract, assessmentMethod: e.target.value })}
                      placeholder="How will the student demonstrate learning?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Resources
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentResource}
                        onChange={(e) => setCurrentResource(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddResource()}
                        placeholder="Enter a resource"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddResource}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {learningContract.resources.map((resource, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {resource}
                          <button
                            onClick={() => {
                              setLearningContract({
                                ...learningContract,
                                resources: learningContract.resources.filter((_, i) => i !== idx),
                              })
                            }}
                            className="text-blue-700 hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Checkpoints
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentCheckpoint}
                        onChange={(e) => setCurrentCheckpoint(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCheckpoint()}
                        placeholder="Enter a checkpoint"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddCheckpoint}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {learningContract.checkpoints.map((checkpoint, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700">{checkpoint}</span>
                          <button
                            onClick={() => {
                              setLearningContract({
                                ...learningContract,
                                checkpoints: learningContract.checkpoints.filter((_, i) => i !== idx),
                              })
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleContractSubmit}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <FileCheck className="h-5 w-5" />
                    Save Learning Contract
                  </button>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Template Lesson */}
            {currentLessonData.type === 'template' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Template</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Template Sections</h3>
                  <div className="space-y-3">
                    {currentLessonData.content.sections?.map((section: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-gray-700">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Elementary Template</span>
                    <span className="text-xs text-gray-600">Grades K-5</span>
                  </button>
                  <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Middle School Template</span>
                    <span className="text-xs text-gray-600">Grades 6-8</span>
                  </button>
                  <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">High School Template</span>
                    <span className="text-xs text-gray-600">Grades 9-12</span>
                  </button>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentDifferentiationModule




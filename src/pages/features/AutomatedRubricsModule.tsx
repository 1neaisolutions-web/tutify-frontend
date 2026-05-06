import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Video,
  BookOpen,
  Zap,
  FileText,
  Target,
  TrendingUp,
  Lightbulb,
  ClipboardCheck,
  Plus,
  X,
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

interface RubricCriteria {
  criterion: string
  excellent: string
  proficient: string
  developing: string
  beginning: string
}

const AutomatedRubricsModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [rubricPrompt, setRubricPrompt] = useState('')
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriteria[]>([])
  const [currentCriterion, setCurrentCriterion] = useState<RubricCriteria>({
    criterion: '',
    excellent: '',
    proficient: '',
    developing: '',
    beginning: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'rubric-video',
      type: 'video',
      title: 'AI Rubric Generation Techniques',
      duration: '12 min',
      points: 25,
      completed: false,
      content: {
        description: 'Learn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality and rigor.',
        keyPoints: [
          'Effective prompts are essential for quality rubric generation',
          'AI can align rubrics to standards automatically',
          'Customization ensures rubrics fit your specific context',
          'Quality control maintains rubric validity',
          'AI saves time while maintaining rigor',
        ],
        transcript: 'Welcome to Automated Rubric Generation. In this module, you\'ll learn how to leverage AI to create detailed, standards-aligned rubrics efficiently...',
      },
    },
    {
      id: 'rubric-reading',
      type: 'reading',
      title: 'Rubric Design Best Practices',
      points: 20,
      completed: false,
      content: {
        article: `# Rubric Design Best Practices

## Understanding Rubrics

Rubrics are scoring guides that describe levels of performance for specific criteria. Well-designed rubrics provide clear expectations, consistent evaluation, and meaningful feedback.

### Key Components of Effective Rubrics

**Clear Criteria**: Specific, observable characteristics of performance
**Performance Levels**: Distinct levels of achievement (typically 3-5 levels)
**Descriptors**: Detailed descriptions of performance at each level
**Standards Alignment**: Connection to learning objectives and standards

### Types of Rubrics

#### Holistic Rubrics
Provide a single score based on overall quality:
- **Use Cases**: Quick evaluation, simple tasks
- **Benefits**: Fast scoring, holistic view
- **Limitations**: Less specific feedback

#### Analytic Rubrics
Break performance into multiple criteria:
- **Use Cases**: Complex tasks, detailed feedback
- **Benefits**: Specific feedback, clear expectations
- **Limitations**: More time-consuming

### Best Practices

#### 1. Start with Learning Objectives
- Base criteria on learning objectives
- Ensure alignment with standards
- Focus on what students should demonstrate

#### 2. Use Clear, Observable Language
- Avoid vague terms like "good" or "nice"
- Use specific, measurable descriptors
- Focus on observable behaviors and products

#### 3. Create Meaningful Performance Levels
- Use 3-5 performance levels
- Ensure clear distinctions between levels
- Use consistent language across criteria

#### 4. Balance Specificity and Flexibility
- Be specific enough for clarity
- Allow flexibility for diverse responses
- Avoid over-prescription

#### 5. Include Examples
- Provide exemplars at each level
- Use anchor papers or samples
- Help students understand expectations

### AI-Enhanced Rubric Creation

**Prompt Engineering**: Write clear, specific prompts that guide AI generation
**Standards Integration**: Include standards in prompts for alignment
**Iterative Refinement**: Generate, review, and refine rubrics
**Quality Checks**: Verify accuracy, appropriateness, and validity

### Common Pitfalls to Avoid

- **Vague Language**: Using unclear descriptors
- **Too Many Criteria**: Overwhelming students and evaluators
- **Unclear Distinctions**: Performance levels that blur together
- **Missing Standards**: Not aligning to learning objectives
- **Lack of Examples**: No exemplars to guide understanding

## Key Takeaways

- Effective rubrics have clear criteria and performance levels
- AI can accelerate rubric creation while maintaining quality
- Prompt engineering is crucial for good AI-generated rubrics
- Always review and customize AI-generated rubrics
- Examples and clear language improve rubric effectiveness`,
        keyTakeaways: [
          'Clear criteria and performance levels are essential',
          'AI accelerates rubric creation with proper prompts',
          'Standards alignment ensures validity',
          'Review and customization maintain quality',
          'Examples help students understand expectations',
        ],
      },
    },
    {
      id: 'rubric-generator',
      type: 'interactive',
      title: 'AI Rubric Generator Tool',
      points: 35,
      completed: false,
      content: {
        description: 'Generate standards-aligned rubrics using AI with customizable criteria and performance levels.',
        steps: [
          'Define learning objectives and standards',
          'Write effective rubric generation prompts',
          'Generate rubric with AI',
          'Review and customize criteria',
          'Refine performance level descriptors',
        ],
      },
    },
    {
      id: 'prompt-templates',
      type: 'template',
      title: 'Rubric Prompt Templates',
      points: 20,
      completed: false,
      content: {
        description: 'Download ready-to-use prompt templates for generating rubrics across subjects and assessment types.',
        sections: [
          'Prompt Structure Guide',
          'Standards Integration Templates',
          'Subject-Specific Prompts',
          'Assessment Type Prompts',
          'Customization Guidelines',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('automated-rubrics-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('automated-rubrics-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddCriterion = () => {
    if (currentCriterion.criterion && currentCriterion.excellent && currentCriterion.proficient) {
      setRubricCriteria([...rubricCriteria, currentCriterion])
      setCurrentCriterion({
        criterion: '',
        excellent: '',
        proficient: '',
        developing: '',
        beginning: '',
      })
    }
  }

  const handleGenerateRubric = () => {
    if (!rubricPrompt.trim()) {
      alert('Please enter a rubric generation prompt.')
      return
    }
    // Simulate AI generation
    alert('Rubric generated! Review and customize the criteria below.')
    // In a real app, this would call an AI API
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/ai-assessment-path')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Module 2 of 5
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    30 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Automated Rubric Generation</h1>
                <p className="mt-2 text-indigo-100">
                  Learn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality
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
                        ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-900'
                        : isCompleted
                        ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
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
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
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
                      <Video className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Video Lesson</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 opacity-20"></div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-indigo-600 ml-1" />
                    ) : (
                      <Play className="h-8 w-8 text-indigo-600 ml-1" />
                    )}
                  </button>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints?.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Reading</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
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
                  <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyTakeaways.map((takeaway: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <Lightbulb className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      <Zap className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Interactive Tool</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Generation Steps</h3>
                  <ol className="space-y-2">
                    {currentLessonData.content.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
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
                      Rubric Generation Prompt *
                    </label>
                    <textarea
                      value={rubricPrompt}
                      onChange={(e) => setRubricPrompt(e.target.value)}
                      placeholder="e.g., Create a rubric for a 5th grade science project on ecosystems. Include criteria for research, presentation, and scientific accuracy. Align to NGSS standards..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={5}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Include learning objectives, standards, assessment type, and grade level for best results.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateRubric}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Generate Rubric with AI
                  </button>

                  {rubricCriteria.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Rubric Criteria</h3>
                      <div className="space-y-4">
                        {rubricCriteria.map((criteria, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{criteria.criterion}</h4>
                              <button
                                onClick={() => setRubricCriteria(rubricCriteria.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3 text-xs">
                              <div>
                                <p className="font-semibold text-green-700 mb-1">Excellent</p>
                                <p className="text-gray-600">{criteria.excellent}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-blue-700 mb-1">Proficient</p>
                                <p className="text-gray-600">{criteria.proficient}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-amber-700 mb-1">Developing</p>
                                <p className="text-gray-600">{criteria.developing}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-red-700 mb-1">Beginning</p>
                                <p className="text-gray-600">{criteria.beginning}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Custom Criterion</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Criterion Name *</label>
                        <input
                          type="text"
                          value={currentCriterion.criterion}
                          onChange={(e) => setCurrentCriterion({ ...currentCriterion, criterion: e.target.value })}
                          placeholder="e.g., Research Quality"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Excellent *</label>
                          <textarea
                            value={currentCriterion.excellent}
                            onChange={(e) => setCurrentCriterion({ ...currentCriterion, excellent: e.target.value })}
                            placeholder="Description of excellent performance..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Proficient *</label>
                          <textarea
                            value={currentCriterion.proficient}
                            onChange={(e) => setCurrentCriterion({ ...currentCriterion, proficient: e.target.value })}
                            placeholder="Description of proficient performance..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Developing</label>
                          <textarea
                            value={currentCriterion.developing}
                            onChange={(e) => setCurrentCriterion({ ...currentCriterion, developing: e.target.value })}
                            placeholder="Description of developing performance..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Beginning</label>
                          <textarea
                            value={currentCriterion.beginning}
                            onChange={(e) => setCurrentCriterion({ ...currentCriterion, beginning: e.target.value })}
                            placeholder="Description of beginning performance..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleAddCriterion}
                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Add Criterion
                      </button>
                    </div>
                  </div>

                  {rubricCriteria.length > 0 && (
                    <button
                      onClick={() => {
                        alert('Rubric saved! You can now use this rubric for your assessments.')
                      }}
                      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      <ClipboardCheck className="h-5 w-5" />
                      Save Rubric
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Template</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Template Sections</h3>
                  <div className="space-y-3">
                    {currentLessonData.content.sections?.map((section: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-gray-700">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-900">Elementary Template</span>
                    <span className="text-xs text-gray-600">Grades K-5</span>
                  </button>
                  <button className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-900">Middle School Template</span>
                    <span className="text-xs text-gray-600">Grades 6-8</span>
                  </button>
                  <button className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-900">High School Template</span>
                    <span className="text-xs text-gray-600">Grades 9-12</span>
                  </button>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default AutomatedRubricsModule




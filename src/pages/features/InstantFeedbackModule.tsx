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
  MessageSquare,
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

interface FeedbackPrompt {
  name: string
  prompt: string
  useCase: string
  tone: string
}

const InstantFeedbackModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [feedbackPrompts, setFeedbackPrompts] = useState<FeedbackPrompt[]>([])
  const [currentPrompt, setCurrentPrompt] = useState<FeedbackPrompt>({
    name: '',
    prompt: '',
    useCase: '',
    tone: 'Supportive',
  })

  const lessons: LessonContent[] = [
    {
      id: 'feedback-video',
      type: 'video',
      title: 'AI Feedback Systems',
      duration: '15 min',
      points: 25,
      completed: false,
      content: {
        description: 'Implement AI-powered feedback systems that provide immediate, actionable feedback to students, accelerating learning.',
        keyPoints: [
          'Instant feedback accelerates learning cycles',
          'AI feedback should be specific and actionable',
          'Balance AI feedback with teacher feedback',
          'Effective prompts guide quality feedback generation',
          'Feedback data informs instruction',
        ],
        transcript: 'Welcome to Instant Feedback Loops. In this module, you\'ll learn how to implement AI-powered feedback systems that provide immediate, actionable feedback to students...',
      },
    },
    {
      id: 'feedback-reading',
      type: 'reading',
      title: 'Effective Feedback Strategies',
      points: 20,
      completed: false,
      content: {
        article: `# Effective Feedback Strategies

## Understanding Feedback

Feedback is information provided to students about their performance that helps them understand what they've done well and how to improve. Effective feedback accelerates learning and builds student confidence.

### Types of Feedback

#### Formative Feedback
Provided during learning to guide improvement:
- **Timing**: During or immediately after learning
- **Purpose**: Guide improvement and understanding
- **Tone**: Supportive and constructive
- **Focus**: Process and progress

#### Summative Feedback
Provided after learning to summarize performance:
- **Timing**: After completion of work
- **Purpose**: Summarize achievement
- **Tone**: Evaluative and informative
- **Focus**: Final product and outcomes

### Characteristics of Effective Feedback

**Specific**: Addresses particular aspects of work, not generalities
**Actionable**: Provides clear guidance on how to improve
**Timely**: Provided when it can still influence learning
**Balanced**: Acknowledges strengths and areas for growth
**Goal-Oriented**: Connects to learning objectives

### Feedback Models

#### The Feedback Sandwich
1. **Positive**: Start with what's working well
2. **Improvement**: Address areas for growth
3. **Encouragement**: End with support and next steps

#### The SBI Model (Situation-Behavior-Impact)
- **Situation**: Context of the feedback
- **Behavior**: Specific actions or work
- **Impact**: Effect on learning or outcomes

#### Growth-Oriented Feedback
- Focuses on effort and process
- Emphasizes learning and improvement
- Provides strategies for growth
- Celebrates progress

### AI-Enhanced Feedback

**Instant Availability**: AI provides feedback 24/7
**Consistency**: Uniform application of criteria
**Personalization**: Tailored to individual responses
**Efficiency**: Frees teacher time for deeper interactions
**Data Collection**: Tracks patterns and trends

### Best Practices

**Set Clear Criteria**: Define what good work looks like
**Use Rubrics**: Provide consistent evaluation standards
**Be Specific**: Address particular aspects of work
**Focus on Learning**: Emphasize growth and improvement
**Balance Types**: Combine AI and teacher feedback

### Common Pitfalls

- **Vague Language**: Using unclear or general comments
- **Only Negative**: Focusing only on what's wrong
- **Too Much**: Overwhelming students with feedback
- **No Action Steps**: Not providing guidance for improvement
- **Ignoring Strengths**: Missing opportunities to build confidence

## Key Takeaways

- Effective feedback is specific, actionable, and timely
- AI can provide instant, consistent feedback
- Balance AI feedback with teacher feedback
- Focus on growth and improvement
- Use feedback data to inform instruction`,
        keyTakeaways: [
          'Effective feedback is specific and actionable',
          'AI provides instant, consistent feedback',
          'Balance AI and teacher feedback',
          'Focus on growth and improvement',
          'Use feedback to inform instruction',
        ],
      },
    },
    {
      id: 'feedback-designer',
      type: 'interactive',
      title: 'Feedback Loop Designer',
      points: 35,
      completed: false,
      content: {
        description: 'Design AI-powered feedback systems with effective prompts and feedback loops.',
        steps: [
          'Define feedback goals and criteria',
          'Create effective feedback prompts',
          'Design feedback delivery system',
          'Plan feedback follow-up actions',
          'Test and refine feedback loops',
        ],
      },
    },
    {
      id: 'prompt-library',
      type: 'template',
      title: 'Feedback Prompt Library',
      points: 20,
      completed: false,
      content: {
        description: 'Download ready-to-use feedback prompt templates for various assessment types.',
        sections: [
          'Writing Feedback Prompts',
          'Math Problem Feedback',
          'Science Lab Feedback',
          'Project Feedback Prompts',
          'Presentation Feedback',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('instant-feedback-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('instant-feedback-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddPrompt = () => {
    if (currentPrompt.name && currentPrompt.prompt) {
      setFeedbackPrompts([...feedbackPrompts, currentPrompt])
      setCurrentPrompt({
        name: '',
        prompt: '',
        useCase: '',
        tone: 'Supportive',
      })
    }
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
                    Module 3 of 5
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    35 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Instant Feedback Loops</h1>
                <p className="mt-2 text-indigo-100">
                  Implement AI-powered feedback systems that provide immediate, actionable feedback to students
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Design Steps</h3>
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
                      Feedback Prompt Name *
                    </label>
                    <input
                      type="text"
                      value={currentPrompt.name}
                      onChange={(e) => setCurrentPrompt({ ...currentPrompt, name: e.target.value })}
                      placeholder="e.g., Writing Feedback - Argumentative Essay"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Feedback Prompt * (Instructions for AI)
                    </label>
                    <textarea
                      value={currentPrompt.prompt}
                      onChange={(e) => setCurrentPrompt({ ...currentPrompt, prompt: e.target.value })}
                      placeholder="e.g., Provide specific, actionable feedback on this student's argumentative essay. Focus on: 1) Thesis clarity, 2) Evidence quality, 3) Organization, 4) Writing mechanics. Use a supportive tone and provide concrete suggestions for improvement..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Use Case
                      </label>
                      <input
                        type="text"
                        value={currentPrompt.useCase}
                        onChange={(e) => setCurrentPrompt({ ...currentPrompt, useCase: e.target.value })}
                        placeholder="e.g., Argumentative essays, Math problems"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Tone
                      </label>
                      <select
                        value={currentPrompt.tone}
                        onChange={(e) => setCurrentPrompt({ ...currentPrompt, tone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="Supportive">Supportive</option>
                        <option value="Encouraging">Encouraging</option>
                        <option value="Direct">Direct</option>
                        <option value="Constructive">Constructive</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAddPrompt}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Feedback Prompt
                  </button>

                  {feedbackPrompts.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Feedback Prompts ({feedbackPrompts.length})</h3>
                      <div className="space-y-4">
                        {feedbackPrompts.map((prompt, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{prompt.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-indigo-600">{prompt.useCase}</span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-600">Tone: {prompt.tone}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => setFeedbackPrompts(feedbackPrompts.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{prompt.prompt}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          alert('Feedback prompts saved! You can now use these in your AI feedback system.')
                        }}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="h-5 w-5" />
                        Save Feedback Library
                      </button>
                    </div>
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

export default InstantFeedbackModule




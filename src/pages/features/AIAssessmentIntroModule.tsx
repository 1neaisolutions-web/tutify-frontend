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
  Bot,
  Search,
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

interface AITool {
  name: string
  category: string
  description: string
  useCase: string
  pros: string[]
  cons: string[]
}

const AIAssessmentIntroModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showToolExplorer, setShowToolExplorer] = useState(false)
  const [selectedTools, setSelectedTools] = useState<AITool[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const lessons: LessonContent[] = [
    {
      id: 'intro-video',
      type: 'video',
      title: 'AI in Assessment: An Overview',
      duration: '10 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn how AI can enhance assessment design, automate rubric creation, and provide instant feedback to improve learning outcomes.',
        keyPoints: [
          'AI can automate time-consuming assessment tasks',
          'AI tools can generate rubrics aligned to standards',
          'Instant feedback accelerates student learning',
          'AI maintains assessment validity when used correctly',
          'Teacher judgment remains essential in assessment design',
        ],
        transcript: 'Welcome to Introduction to AI in Assessment. In this module, you\'ll learn how artificial intelligence can enhance your assessment practices while maintaining quality and validity...',
      },
    },
    {
      id: 'tools-reading',
      type: 'reading',
      title: 'AI Tools for Teachers',
      points: 15,
      completed: false,
      content: {
        article: `# AI Tools for Teachers

## Understanding AI in Assessment

Artificial Intelligence is transforming how teachers create, deliver, and analyze assessments. Understanding available tools and their capabilities is the first step toward effective integration.

### Key AI Capabilities

**Automated Generation**: AI can generate assessment questions, rubrics, and feedback based on learning objectives and standards.

**Instant Feedback**: AI-powered systems can provide immediate, personalized feedback to students, accelerating learning cycles.

**Data Analysis**: AI can analyze assessment data to identify learning gaps, patterns, and trends that inform instruction.

**Personalization**: AI can adapt assessments to individual student needs while maintaining validity.

### Categories of AI Assessment Tools

#### 1. Rubric Generators
Tools that create detailed, standards-aligned rubrics:
- **Use Cases**: Project rubrics, writing rubrics, performance assessments
- **Benefits**: Time savings, consistency, standards alignment
- **Considerations**: May need customization for specific contexts

#### 2. Feedback Systems
AI-powered platforms that provide instant feedback:
- **Use Cases**: Formative assessments, writing assignments, practice problems
- **Benefits**: Immediate feedback, 24/7 availability, consistency
- **Considerations**: Should complement, not replace, teacher feedback

#### 3. Question Generators
Tools that create assessment questions:
- **Use Cases**: Formative checks, practice tests, review materials
- **Benefits**: Variety, efficiency, alignment to objectives
- **Considerations**: Requires review for quality and appropriateness

#### 4. Assessment Analyzers
AI systems that analyze student responses:
- **Use Cases**: Identifying misconceptions, learning gaps, trends
- **Benefits**: Deep insights, pattern recognition, efficiency
- **Considerations**: Interpretation requires teacher expertise

### Evaluating AI Tools

**Validity**: Does the tool maintain assessment validity?
**Reliability**: Are results consistent and accurate?
**Bias**: Does the tool introduce or perpetuate bias?
**Privacy**: How is student data handled?
**Ease of Use**: Is the tool teacher-friendly?
**Cost**: Is the tool accessible and affordable?

### Maintaining Assessment Quality

**Teacher Oversight**: AI should assist, not replace, teacher judgment
**Standards Alignment**: Ensure AI-generated content aligns with standards
**Validity Checks**: Review AI outputs for accuracy and appropriateness
**Bias Monitoring**: Watch for potential bias in AI-generated content
**Student Privacy**: Protect student data and privacy

### Getting Started

1. **Identify Needs**: What assessment tasks take the most time?
2. **Research Tools**: Explore available AI assessment tools
3. **Start Small**: Begin with one tool or one assessment type
4. **Evaluate Results**: Assess effectiveness and make adjustments
5. **Scale Up**: Expand use as you gain confidence

## Key Takeaways

- AI can automate time-consuming assessment tasks
- Multiple categories of AI tools serve different purposes
- Tool evaluation is essential for quality and validity
- Teacher judgment remains critical
- Start small and scale gradually`,
        keyTakeaways: [
          'AI can automate assessment tasks while maintaining quality',
          'Multiple tool categories serve different assessment needs',
          'Tool evaluation ensures validity and appropriateness',
          'Teacher oversight is essential for quality',
          'Start with one tool and expand gradually',
        ],
      },
    },
    {
      id: 'tool-explorer',
      type: 'interactive',
      title: 'AI Assessment Tool Explorer',
      points: 25,
      completed: false,
      content: {
        description: 'Explore and evaluate AI assessment tools to find the best fit for your needs.',
        steps: [
          'Identify your assessment needs',
          'Explore available AI tools',
          'Evaluate tools based on criteria',
          'Select tools for trial',
          'Plan implementation',
        ],
      },
    },
    {
      id: 'planning-template',
      type: 'template',
      title: 'Assessment Planning Template',
      points: 15,
      completed: false,
      content: {
        description: 'Download templates for planning AI-enhanced assessments across subjects and grade levels.',
        sections: [
          'Assessment Objectives',
          'AI Tool Selection',
          'Implementation Plan',
          'Quality Assurance Checklist',
          'Evaluation Criteria',
        ],
      },
    },
  ]

  const aiTools: AITool[] = [
    {
      name: 'RubricAI',
      category: 'Rubric Generator',
      description: 'Generates standards-aligned rubrics for various assessment types',
      useCase: 'Project rubrics, writing assessments, performance tasks',
      pros: ['Saves time', 'Standards-aligned', 'Customizable'],
      cons: ['May need refinement', 'Requires clear prompts'],
    },
    {
      name: 'FeedbackBot',
      category: 'Feedback System',
      description: 'Provides instant, personalized feedback on student work',
      useCase: 'Formative assessments, writing assignments, practice problems',
      pros: ['Instant feedback', '24/7 availability', 'Consistent'],
      cons: ['May lack nuance', 'Should complement teacher feedback'],
    },
    {
      name: 'QuestionGen',
      category: 'Question Generator',
      description: 'Creates assessment questions aligned to learning objectives',
      useCase: 'Formative checks, practice tests, review materials',
      pros: ['Efficient', 'Variety', 'Aligned to objectives'],
      cons: ['Requires review', 'May need customization'],
    },
    {
      name: 'AssessAnalyzer',
      category: 'Assessment Analyzer',
      description: 'Analyzes student responses to identify patterns and gaps',
      useCase: 'Identifying misconceptions, learning gaps, trends',
      pros: ['Deep insights', 'Pattern recognition', 'Efficient'],
      cons: ['Requires interpretation', 'May need teacher expertise'],
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-assessment-intro-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('ai-assessment-intro-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddTool = (tool: AITool) => {
    if (!selectedTools.find(t => t.name === tool.name)) {
      setSelectedTools([...selectedTools, tool])
    }
  }

  const handleRemoveTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter(t => t.name !== toolName))
  }

  const filteredTools = aiTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                    Module 1 of 5
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    25 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Introduction to AI in Assessment</h1>
                <p className="mt-2 text-indigo-100">
                  Understand how AI can enhance assessment design and improve learning outcomes
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Exploration Steps</h3>
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
                      Search AI Tools
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, category, or description..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Available AI Tools</h3>
                    <div className="space-y-4">
                      {filteredTools.map((tool, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                              <span className="text-xs text-indigo-600 font-semibold">{tool.category}</span>
                            </div>
                            {!selectedTools.find(t => t.name === tool.name) && (
                              <button
                                onClick={() => handleAddTool(tool)}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Add
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                          <p className="text-xs text-gray-500 mb-3">Use case: {tool.useCase}</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-semibold text-green-700 mb-1">Pros:</p>
                              <ul className="space-y-1">
                                {tool.pros.map((pro, pIdx) => (
                                  <li key={pIdx} className="text-gray-600">• {pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-amber-700 mb-1">Cons:</p>
                              <ul className="space-y-1">
                                {tool.cons.map((con, cIdx) => (
                                  <li key={cIdx} className="text-gray-600">• {con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTools.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Selected Tools ({selectedTools.length})</h3>
                      <div className="space-y-2">
                        {selectedTools.map((tool, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between"
                          >
                            <div>
                              <span className="font-semibold text-gray-900">{tool.name}</span>
                              <span className="text-xs text-indigo-600 ml-2">({tool.category})</span>
                            </div>
                            <button
                              onClick={() => handleRemoveTool(tool.name)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          alert('Tool selection saved! You can now plan implementation for these tools.')
                        }}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Save Tool Selection
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

export default AIAssessmentIntroModule




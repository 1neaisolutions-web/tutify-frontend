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
  Shield,
  Plus,
  X,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'
interface LessonContent {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template'
  title: string
  duration?: string
  points: number
  completed: boolean
  content: any
}

interface AssessmentComponent {
  component: string
  description: string
  weight: number
  questions: number
}

const SummativeAIDesignModule = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [assessmentTitle, setAssessmentTitle] = useState('')
  const [learningObjectives, setLearningObjectives] = useState<string[]>([])
  const [currentObjective, setCurrentObjective] = useState('')
  const [components, setComponents] = useState<AssessmentComponent[]>([])
  const [currentComponent, setCurrentComponent] = useState<AssessmentComponent>({
    component: '',
    description: '',
    weight: 0,
    questions: 0,
  })

  const lessons: LessonContent[] = [
    {
      id: 'summative-video',
      type: 'video',
      title: 'AI in Summative Assessment',
      duration: '10 min',
      points: 20,
      completed: false,
      content: {
        description: 'Design comprehensive summative assessments with AI assistance while maintaining rigor, validity, and fairness.',
        keyPoints: [
          'Summative assessments measure final learning outcomes',
          'AI can assist in comprehensive assessment design',
          'Validity and reliability are essential',
          'Balance AI efficiency with teacher judgment',
          'Quality assurance maintains assessment standards',
        ],
        transcript: 'Welcome to AI-Enhanced Summative Assessment Design. In this module, you\'ll learn how to design comprehensive summative assessments with AI assistance...',
      },
    },
    {
      id: 'summative-reading',
      type: 'reading',
      title: 'Summative Assessment Design Principles',
      points: 15,
      completed: false,
      content: {
        article: `# Summative Assessment Design Principles

## Understanding Summative Assessment

Summative assessment evaluates student learning at the end of an instructional period. It measures what students have learned and provides evidence of achievement.

### Key Characteristics

**End-of-Learning**: Conducted after instruction
**High-Stakes**: Often carries significant weight
**Comprehensive**: Covers full range of learning
**Standardized**: Consistent evaluation criteria
**Accountable**: Provides evidence of learning

### Types of Summative Assessment

#### Tests and Exams
Traditional written assessments:
- **Unit Tests**: End-of-unit assessments
- **Final Exams**: End-of-course evaluations
- **Standardized Tests**: External assessments
- **Performance Tests**: Skill demonstrations

#### Projects and Portfolios
Extended work products:
- **Research Projects**: In-depth investigations
- **Portfolios**: Collections of student work
- **Presentations**: Oral or multimedia demonstrations
- **Performances**: Live demonstrations

#### Performance Assessments
Real-world applications:
- **Lab Practicals**: Science experiments
- **Simulations**: Real-world scenarios
- **Case Studies**: Problem-solving tasks
- **Authentic Tasks**: Real-world applications

### Design Principles

#### 1. Alignment
- Align to learning objectives
- Match instruction to assessment
- Ensure content coverage
- Connect to standards

#### 2. Validity
- Measure intended learning
- Use appropriate methods
- Avoid bias
- Ensure fairness

#### 3. Reliability
- Consistent scoring
- Clear criteria
- Standardized procedures
- Multiple measures

#### 4. Comprehensiveness
- Cover full range of learning
- Include various question types
- Assess different cognitive levels
- Balance breadth and depth

#### 5. Fairness
- Accessible to all students
- Accommodations available
- Clear expectations
- Multiple pathways

### AI-Enhanced Design

**Question Generation**: AI creates varied, aligned questions
**Rubric Development**: AI generates detailed scoring guides
**Validity Checks**: AI verifies alignment and appropriateness
**Efficiency**: Saves time in assessment creation
**Quality Assurance**: Maintains standards while accelerating

### Quality Assurance

**Review Process**: Teacher review of AI-generated content
**Standards Check**: Verify alignment to objectives
**Bias Detection**: Identify potential bias
**Appropriateness**: Ensure age and level appropriateness
**Validity Verification**: Confirm accurate measurement

### Best Practices

**Start with Objectives**: Base assessment on learning goals
**Use Multiple Measures**: Don't rely on single assessment
**Provide Clear Criteria**: Students understand expectations
**Ensure Accessibility**: Accommodate diverse learners
**Maintain Rigor**: Challenge students appropriately

## Key Takeaways

- Summative assessment measures final learning outcomes
- AI can assist in comprehensive assessment design
- Validity and reliability are essential
- Quality assurance maintains standards
- Balance AI efficiency with teacher judgment`,
        keyTakeaways: [
          'Summative assessment measures final learning outcomes',
          'AI assists in comprehensive assessment design',
          'Validity and reliability are essential',
          'Quality assurance maintains standards',
          'Balance AI efficiency with teacher judgment',
        ],
      },
    },
    {
      id: 'summative-designer',
      type: 'interactive',
      title: 'Summative Assessment Designer',
      points: 30,
      completed: false,
      content: {
        description: 'Design comprehensive summative assessments with AI assistance, ensuring validity and quality.',
        steps: [
          'Define learning objectives',
          'Plan assessment components',
          'Generate questions with AI',
          'Review and refine assessment',
          'Ensure validity and quality',
        ],
      },
    },
    {
      id: 'summative-templates',
      type: 'template',
      title: 'Summative Assessment Templates',
      points: 20,
      completed: false,
      content: {
        description: 'Download templates for creating comprehensive summative assessments across subjects.',
        sections: [
          'Assessment Planning Framework',
          'Question Generation Prompts',
          'Validity Checklist',
          'Quality Assurance Guide',
          'Scoring Rubrics',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('summative-ai-design-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('summative-ai-design-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddObjective = () => {
    if (currentObjective.trim()) {
      setLearningObjectives([...learningObjectives, currentObjective.trim()])
      setCurrentObjective('')
    }
  }

  const handleAddComponent = () => {
    if (currentComponent.component && currentComponent.description) {
      setComponents([...components, currentComponent])
      setCurrentComponent({
        component: '',
        description: '',
        weight: 0,
        questions: 0,
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
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">{t('summativeAIDesignModule.module5Of5')}</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />{t('summativeAIDesignModule.k5Min')}</span>
                </div>
                <h1 className="text-3xl font-bold">{t('summativeAIDesignModule.aiEnhancedSummativeAssessmentDesign')}</h1>
                <p className="mt-2 text-indigo-100">{t('summativeAIDesignModule.designComprehensiveSummativeAssessmentsWithAiAssistance')}</p>
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">{t('summativeAIDesignModule.lessons')}</h3>
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
                <span className="text-xs text-gray-600">{t('summativeAIDesignModule.progress')}</span>
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
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('summativeAIDesignModule.videoLesson')}</span>
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('summativeAIDesignModule.keyPoints')}</h3>
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
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.lessonCompleted')}</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.markAsComplete')}</>
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
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('summativeAIDesignModule.reading')}</span>
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('summativeAIDesignModule.keyTakeaways')}</h3>
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
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.lessonCompleted')}</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.markAsComplete')}</>
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
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('summativeAIDesignModule.interactiveTool')}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('summativeAIDesignModule.designSteps')}</h3>
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
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('summativeAIDesignModule.assessmentTitle')}</label>
                    <input
                      type="text"
                      value={assessmentTitle}
                      onChange={(e) => setAssessmentTitle(e.target.value)}
                      placeholder={t('summativeAIDesignModule.eGUnit3EcosystemsSummativeAssessment')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('summativeAIDesignModule.learningObjectives')}</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentObjective}
                        onChange={(e) => setCurrentObjective(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
                        placeholder={t('summativeAIDesignModule.enterALearningObjective')}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddObjective}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >{t('summativeAIDesignModule.add')}</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {learningObjectives.map((obj, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {obj}
                          <button
                            onClick={() => setLearningObjectives(learningObjectives.filter((_, i) => i !== idx))}
                            className="text-indigo-700 hover:text-indigo-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('summativeAIDesignModule.assessmentComponents')}</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">{t('summativeAIDesignModule.componentName')}</label>
                          <input
                            type="text"
                            value={currentComponent.component}
                            onChange={(e) => setCurrentComponent({ ...currentComponent, component: e.target.value })}
                            placeholder={t('summativeAIDesignModule.eGMultipleChoiceSection')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Weight (%)</label>
                          <input
                            type="number"
                            value={currentComponent.weight}
                            onChange={(e) => setCurrentComponent({ ...currentComponent, weight: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('summativeAIDesignModule.description')}</label>
                        <textarea
                          value={currentComponent.description}
                          onChange={(e) => setCurrentComponent({ ...currentComponent, description: e.target.value })}
                          placeholder={t('summativeAIDesignModule.describeThisAssessmentComponent')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('summativeAIDesignModule.numberOfQuestions')}</label>
                        <input
                          type="number"
                          value={currentComponent.questions}
                          onChange={(e) => setCurrentComponent({ ...currentComponent, questions: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <button
                        onClick={handleAddComponent}
                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      >{t('summativeAIDesignModule.addComponent')}</button>
                    </div>
                  </div>

                  {components.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Assessment Components ({components.length})</h3>
                      <div className="space-y-3">
                        {components.map((comp, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{comp.component}</h4>
                                <p className="text-sm text-gray-600 mt-1">{comp.description}</p>
                              </div>
                              <button
                                onClick={() => setComponents(components.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>Weight: {comp.weight}%</span>
                              <span>Questions: {comp.questions}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">{t('summativeAIDesignModule.validityChecklist')}</span>
                        </div>
                        <ul className="space-y-1 text-xs text-gray-700">
                          <li>{t('summativeAIDesignModule.assessmentAlignsToLearningObjectives')}</li>
                          <li>{t('summativeAIDesignModule.componentsCoverFullRangeOfLearning')}</li>
                          <li>{t('summativeAIDesignModule.weightDistributionIsAppropriate')}</li>
                          <li>{t('summativeAIDesignModule.questionsMatchCognitiveLevels')}</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          alert('Assessment design saved! You can now generate questions and refine the assessment.')
                        }}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      >
                        <ClipboardCheck className="h-5 w-5" />{t('summativeAIDesignModule.saveAssessmentDesign')}</button>
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
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.lessonCompleted')}</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.markAsComplete')}</>
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
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('summativeAIDesignModule.template')}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('summativeAIDesignModule.templateSections')}</h3>
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
                    <span className="text-sm font-semibold text-gray-900">{t('summativeAIDesignModule.elementaryTemplate')}</span>
                    <span className="text-xs text-gray-600">{t('summativeAIDesignModule.gradesK5')}</span>
                  </button>
                  <button className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-900">{t('summativeAIDesignModule.middleSchoolTemplate')}</span>
                    <span className="text-xs text-gray-600">{t('summativeAIDesignModule.grades68')}</span>
                  </button>
                  <button className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-900">{t('summativeAIDesignModule.highSchoolTemplate')}</span>
                    <span className="text-xs text-gray-600">{t('summativeAIDesignModule.grades912')}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.lessonCompleted')}</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />{t('summativeAIDesignModule.markAsComplete')}</>
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

export default SummativeAIDesignModule


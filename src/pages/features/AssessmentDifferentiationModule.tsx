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

interface AssessmentOption {
  option: string
  description: string
  format: string
  accommodations: string[]
}

const AssessmentDifferentiationModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [assessmentTitle, setAssessmentTitle] = useState('')
  const [learningObjective, setLearningObjective] = useState('')
  const [options, setOptions] = useState<AssessmentOption[]>([])
  const [currentOption, setCurrentOption] = useState<AssessmentOption>({
    option: '',
    description: '',
    format: 'Written',
    accommodations: [],
  })
  const [currentAccommodation, setCurrentAccommodation] = useState('')

  const lessons: LessonContent[] = [
    {
      id: 'assessment-video',
      type: 'video',
      title: 'Differentiated Assessment Design',
      duration: '15 min',
      points: 25,
      completed: false,
      content: {
        description: 'Learn how to differentiate assessments to accurately measure learning while accommodating diverse learners.',
        keyPoints: [
          'Differentiated assessments maintain validity while accommodating needs',
          'Multiple assessment formats measure the same learning',
          'Accommodations ensure fairness without lowering standards',
          'Alternative assessments provide authentic evaluation',
          'Fairness requires equal rigor across all options',
        ],
        transcript: 'Welcome to Differentiated Assessment Strategies. In this module, you\'ll learn how to differentiate assessments to accurately measure learning while accommodating diverse learners...',
      },
    },
    {
      id: 'fairness-reading',
      type: 'reading',
      title: 'Fairness & Validity in Differentiation',
      points: 20,
      completed: false,
      content: {
        article: `# Fairness & Validity in Differentiation

## Understanding Differentiated Assessment

Differentiated assessment provides multiple ways for students to demonstrate learning while maintaining validity and fairness. All assessment options measure the same learning objectives but accommodate different learning needs and preferences.

### Key Principles

**Same Objectives, Different Formats**: All assessments measure the same learning
**Maintained Validity**: All options accurately measure intended learning
**Equal Rigor**: All options require similar depth and complexity
**Fairness**: All students have equal opportunity to succeed
**Accommodations**: Support access without lowering standards

## Assessment Formats

### Written Assessments
- Essays, reports, research papers
- Short answer, constructed response
- Journals, reflections, portfolios
- **Accommodations**: Extended time, dictation, word processors

### Visual Assessments
- Diagrams, charts, infographics
- Posters, presentations, slideshows
- Models, demonstrations, videos
- **Accommodations**: Visual aids, templates, graphic organizers

### Performance Assessments
- Presentations, speeches, demonstrations
- Skits, plays, role-plays
- Teaching lessons, tutorials
- **Accommodations**: Practice time, visual cues, peer support

### Oral Assessments
- Interviews, discussions, debates
- Explanations, descriptions, storytelling
- Q&A sessions, conferences
- **Accommodations**: Extra time, note cards, quiet space

## Accommodations

### Time Accommodations
- Extended time for completion
- Breaks during assessment
- Multiple sessions
- Flexible scheduling

### Format Accommodations
- Larger print, different fonts
- Audio versions
- Digital formats
- Simplified language

### Response Accommodations
- Dictation, speech-to-text
- Word processors
- Calculators, formula sheets
- Graphic organizers

### Environment Accommodations
- Quiet space
- Reduced distractions
- Preferential seating
- Individual or small group

## Validity Considerations

**Content Validity**: Does it measure intended learning?
**Construct Validity**: Does it measure the right construct?
**Face Validity**: Does it look like it measures learning?
**Criterion Validity**: Does it predict performance?

## Fairness Principles

**Equal Opportunity**: All students can access assessment
**Equal Rigor**: All options require similar effort
**Equal Standards**: Same learning objectives for all
**No Bias**: Assessment doesn't disadvantage groups
**Transparency**: Clear expectations and criteria

## Best Practices

**Start with Objectives**: Base assessments on learning goals
**Offer Multiple Formats**: Provide varied assessment options
**Maintain Rigor**: Ensure all options are equally challenging
**Provide Accommodations**: Support access without lowering standards
**Use Universal Rubrics**: One rubric works across formats
**Ensure Fairness**: Equal opportunity and rigor for all

## Key Takeaways

- Differentiated assessments maintain validity while accommodating needs
- Multiple formats measure the same learning objectives
- Accommodations ensure fairness without lowering standards
- Alternative assessments provide authentic evaluation
- Fairness requires equal rigor across all options`,
        keyTakeaways: [
          'Differentiated assessments maintain validity while accommodating needs',
          'Multiple formats measure the same learning objectives',
          'Accommodations ensure fairness without lowering standards',
          'Alternative assessments provide authentic evaluation',
          'Fairness requires equal rigor across all options',
        ],
      },
    },
    {
      id: 'assessment-tool',
      type: 'interactive',
      title: 'Assessment Differentiation Tool',
      points: 30,
      completed: false,
      content: {
        description: 'Design differentiated assessments with multiple formats and accommodations.',
        steps: [
          'Define learning objectives',
          'Create assessment options',
          'Identify accommodations',
          'Ensure validity and fairness',
          'Develop universal rubric',
        ],
      },
    },
    {
      id: 'assessment-templates',
      type: 'template',
      title: 'Differentiated Assessment Templates',
      points: 25,
      completed: false,
      content: {
        description: 'Download templates for creating differentiated assessments across subjects.',
        sections: [
          'Assessment Planning Framework',
          'Format Options Guide',
          'Accommodation Checklist',
          'Universal Rubric Templates',
          'Fairness Evaluation Tool',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('assessment-differentiation-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('assessment-differentiation-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddAccommodation = () => {
    if (currentAccommodation.trim() && !currentOption.accommodations.includes(currentAccommodation.trim())) {
      setCurrentOption({
        ...currentOption,
        accommodations: [...currentOption.accommodations, currentAccommodation.trim()],
      })
      setCurrentAccommodation('')
    }
  }

  const handleRemoveAccommodation = (acc: string) => {
    setCurrentOption({
      ...currentOption,
      accommodations: currentOption.accommodations.filter(a => a !== acc),
    })
  }

  const handleAddOption = () => {
    if (currentOption.option && currentOption.description) {
      setOptions([...options, currentOption])
      setCurrentOption({
        option: '',
        description: '',
        format: 'Written',
        accommodations: [],
      })
    }
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
                    Module 5 of 6
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    35 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Differentiated Assessment Strategies</h1>
                <p className="mt-2 text-green-100">
                  Learn how to differentiate assessments to accurately measure learning while accommodating diverse learners
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
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
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
                      Assessment Title *
                    </label>
                    <input
                      type="text"
                      value={assessmentTitle}
                      onChange={(e) => setAssessmentTitle(e.target.value)}
                      placeholder="e.g., Unit 3: Ecosystems Assessment"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Learning Objective *
                    </label>
                    <textarea
                      value={learningObjective}
                      onChange={(e) => setLearningObjective(e.target.value)}
                      placeholder="What should all students demonstrate? (e.g., Students will explain ecosystem relationships and demonstrate understanding of food webs)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Assessment Options</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Option Name *</label>
                        <input
                          type="text"
                          value={currentOption.option}
                          onChange={(e) => setCurrentOption({ ...currentOption, option: e.target.value })}
                          placeholder="e.g., Written Essay"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
                        <textarea
                          value={currentOption.description}
                          onChange={(e) => setCurrentOption({ ...currentOption, description: e.target.value })}
                          placeholder="Describe this assessment option..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Format</label>
                        <select
                          value={currentOption.format}
                          onChange={(e) => setCurrentOption({ ...currentOption, format: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option>Written</option>
                          <option>Visual</option>
                          <option>Performance</option>
                          <option>Oral</option>
                          <option>Digital</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Accommodations</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={currentAccommodation}
                            onChange={(e) => setCurrentAccommodation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAccommodation()}
                            placeholder="e.g., Extended time"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleAddAccommodation}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentOption.accommodations.map((acc, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-2"
                            >
                              {acc}
                              <button
                                onClick={() => handleRemoveAccommodation(acc)}
                                className="text-green-700 hover:text-green-900"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={handleAddOption}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Add Assessment Option
                      </button>
                    </div>
                  </div>

                  {options.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Assessment Options ({options.length})</h3>
                      <div className="space-y-4">
                        {options.map((opt, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{opt.option}</h4>
                                <span className="text-xs text-green-600 font-semibold">{opt.format}</span>
                              </div>
                              <button
                                onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{opt.description}</p>
                            {opt.accommodations.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Accommodations:</p>
                                <div className="flex flex-wrap gap-1">
                                  {opt.accommodations.map((acc, accIdx) => (
                                    <span key={accIdx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                      {acc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          alert('Differentiated assessment saved! Ensure all options maintain equal rigor.')
                        }}
                        className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <ClipboardCheck className="h-5 w-5" />
                        Save Assessment Design
                      </button>
                    </div>
                  )}
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

export default AssessmentDifferentiationModule




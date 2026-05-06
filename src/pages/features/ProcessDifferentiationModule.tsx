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
  Layers,
  Users,
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

interface LearningStation {
  stationName: string
  learningStyle: string
  activity: string
  materials: string[]
  timeAllocation: string
  assessment: string
}

const ProcessDifferentiationModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showStationTool, setShowStationTool] = useState(false)
  const [stations, setStations] = useState<LearningStation[]>([])
  const [currentStation, setCurrentStation] = useState<LearningStation>({
    stationName: '',
    learningStyle: '',
    activity: '',
    materials: [],
    timeAllocation: '',
    assessment: '',
  })
  const [currentMaterial, setCurrentMaterial] = useState('')

  const lessons: LessonContent[] = [
    {
      id: 'process-video',
      type: 'video',
      title: 'Process Differentiation Techniques',
      duration: '18 min',
      points: 25,
      completed: false,
      content: {
        description: 'Learn how to vary how students make sense of content through different learning activities and strategies.',
        keyPoints: [
          'Process differentiation varies how students learn, not what they learn',
          'Learning stations engage different learning styles',
          'Flexible grouping maximizes learning opportunities',
          'Multiple intelligences inform activity design',
          'All process variations address the same learning objectives',
        ],
        transcript: 'Welcome to Process Differentiation Mastery. In this module, you\'ll learn techniques for varying how students make sense of content through different learning activities...',
      },
    },
    {
      id: 'stations-reading',
      type: 'reading',
      title: 'Learning Stations & Flexible Grouping',
      points: 20,
      completed: false,
      content: {
        article: `# Learning Stations & Flexible Grouping

## Understanding Process Differentiation

Process differentiation focuses on varying **how** students make sense of content, not what they learn. All students work toward the same learning objectives, but they engage with content in different ways.

### Key Principles

**Same Objectives, Different Paths**: All activities address the same learning goals
**Learning Style Consideration**: Activities appeal to different learning preferences
**Flexible Grouping**: Groups change based on learning needs
**Multiple Intelligences**: Activities tap into different intelligences
**Student Choice**: Students often choose their learning path

## Learning Stations

Learning stations are designated areas where students engage in different activities, all addressing the same learning objectives.

### Benefits

- **Engagement**: Students move and interact with content
- **Differentiation**: Each station can target different learning styles
- **Independence**: Students work at their own pace
- **Collaboration**: Some stations encourage peer interaction
- **Variety**: Multiple activities prevent boredom

### Station Design Principles

**1. Clear Objectives**
- Each station must address the learning objective
- Students understand what they're learning

**2. Varied Modalities**
- Visual: diagrams, charts, videos
- Auditory: discussions, recordings, presentations
- Kinesthetic: manipulatives, movement, hands-on
- Reading/Writing: texts, note-taking, writing

**3. Appropriate Time**
- Allocate sufficient time for completion
- Consider transition time between stations

**4. Clear Instructions**
- Written directions at each station
- Visual cues and examples
- Checkpoints for understanding

**5. Assessment Integration**
- Built-in checks for understanding
- Exit tickets or reflection questions
- Peer or self-assessment

## Flexible Grouping Strategies

Flexible grouping means students work in different groups based on learning needs, not fixed ability levels.

### Types of Groups

**Readiness Groups**: Based on current understanding
**Interest Groups**: Based on shared interests
**Learning Style Groups**: Based on preferred learning styles
**Random Groups**: For variety and new perspectives
**Mixed Groups**: Heterogeneous for peer learning

### Grouping Considerations

- **Purpose**: Match group type to learning goal
- **Duration**: Some groups are short-term, others longer
- **Size**: Optimal group size (usually 3-5 students)
- **Roles**: Assign roles to ensure participation
- **Accountability**: Individual and group accountability

## Multiple Intelligences in Process Design

Howard Gardner's theory of multiple intelligences suggests students have different strengths:

**Linguistic**: Word-smart (reading, writing, speaking)
**Logical-Mathematical**: Number-smart (problem-solving, patterns)
**Spatial**: Picture-smart (visualization, art, design)
**Bodily-Kinesthetic**: Body-smart (movement, hands-on)
**Musical**: Music-smart (rhythm, sound, patterns)
**Interpersonal**: People-smart (collaboration, empathy)
**Intrapersonal**: Self-smart (reflection, independence)
**Naturalist**: Nature-smart (observation, classification)

### Applying Multiple Intelligences

Design activities that tap into different intelligences:
- **Linguistic**: Writing, reading, storytelling
- **Logical**: Problem-solving, experiments, logic puzzles
- **Spatial**: Diagrams, mind maps, visual art
- **Kinesthetic**: Movement, manipulatives, building
- **Musical**: Songs, rhythms, patterns
- **Interpersonal**: Group work, discussions, peer teaching
- **Intrapersonal**: Journals, independent work, reflection
- **Naturalist**: Observation, classification, nature study

## Key Takeaways

- Process differentiation varies how students learn, not what
- Learning stations engage different learning styles
- Flexible grouping maximizes learning opportunities
- Multiple intelligences inform activity design
- All process variations must address learning objectives`,
        keyTakeaways: [
          'Process differentiation varies how students learn',
          'Learning stations engage different learning styles',
          'Flexible grouping adapts to learning needs',
          'Multiple intelligences inform activity design',
          'All activities address the same learning objectives',
        ],
      },
    },
    {
      id: 'station-designer',
      type: 'interactive',
      title: 'Station Designer Tool',
      points: 35,
      completed: false,
      content: {
        description: 'Design learning stations that engage different learning styles while maintaining learning objective alignment.',
        steps: [
          'Define learning objectives',
          'Identify learning styles to address',
          'Design station activities',
          'Plan materials and resources',
          'Create assessment checkpoints',
        ],
      },
    },
    {
      id: 'process-templates',
      type: 'template',
      title: 'Process Differentiation Templates',
      points: 25,
      completed: false,
      content: {
        description: 'Download templates for creating learning stations and flexible grouping activities.',
        sections: [
          'Learning Objective Definition',
          'Station Activity Design',
          'Grouping Strategy Planning',
          'Materials and Resources',
          'Assessment Integration',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('process-differentiation-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('process-differentiation-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddMaterial = () => {
    if (currentMaterial.trim()) {
      setCurrentStation({
        ...currentStation,
        materials: [...currentStation.materials, currentMaterial.trim()],
      })
      setCurrentMaterial('')
    }
  }

  const handleAddStation = () => {
    if (currentStation.stationName && currentStation.activity) {
      setStations([...stations, currentStation])
      setCurrentStation({
        stationName: '',
        learningStyle: '',
        activity: '',
        materials: [],
        timeAllocation: '',
        assessment: '',
      })
    }
  }

  const handleSaveStations = () => {
    if (stations.length === 0) {
      alert('Please add at least one learning station.')
      return
    }
    alert('Learning stations saved! You can now implement these in your classroom.')
    setShowStationTool(false)
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
                    Module 3 of 6
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    45 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Process Differentiation Mastery</h1>
                <p className="mt-2 text-green-100">
                  Master techniques for varying how students make sense of content through different learning activities
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
                  <h3 className="text-lg font-semibold text-gray-900">Create Learning Stations</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Station Name *</label>
                      <input
                        type="text"
                        value={currentStation.stationName}
                        onChange={(e) => setCurrentStation({ ...currentStation, stationName: e.target.value })}
                        placeholder="e.g., Visual Analysis Station"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Learning Style</label>
                      <select
                        value={currentStation.learningStyle}
                        onChange={(e) => setCurrentStation({ ...currentStation, learningStyle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select learning style</option>
                        <option value="Visual">Visual</option>
                        <option value="Auditory">Auditory</option>
                        <option value="Kinesthetic">Kinesthetic</option>
                        <option value="Reading/Writing">Reading/Writing</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Activity Description *</label>
                      <textarea
                        value={currentStation.activity}
                        onChange={(e) => setCurrentStation({ ...currentStation, activity: e.target.value })}
                        placeholder="Describe the activity students will do at this station..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Materials</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={currentMaterial}
                          onChange={(e) => setCurrentMaterial(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
                          placeholder="Enter a material"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleAddMaterial}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentStation.materials.map((material, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                          >
                            {material}
                            <button
                              onClick={() => {
                                setCurrentStation({
                                  ...currentStation,
                                  materials: currentStation.materials.filter((_, i) => i !== idx),
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Time Allocation</label>
                        <input
                          type="text"
                          value={currentStation.timeAllocation}
                          onChange={(e) => setCurrentStation({ ...currentStation, timeAllocation: e.target.value })}
                          placeholder="e.g., 15 minutes"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Assessment</label>
                        <input
                          type="text"
                          value={currentStation.assessment}
                          onChange={(e) => setCurrentStation({ ...currentStation, assessment: e.target.value })}
                          placeholder="e.g., Exit ticket"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddStation}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Station
                    </button>
                  </div>

                  {stations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Your Learning Stations ({stations.length})</h4>
                      <div className="space-y-4">
                        {stations.map((station, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{station.stationName}</h5>
                              <button
                                onClick={() => setStations(stations.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{station.activity}</p>
                            {station.learningStyle && (
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mb-2">
                                {station.learningStyle}
                              </span>
                            )}
                            {station.materials.length > 0 && (
                              <div className="text-xs text-gray-600 mt-2">
                                Materials: {station.materials.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleSaveStations}
                        className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Save All Stations
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

export default ProcessDifferentiationModule




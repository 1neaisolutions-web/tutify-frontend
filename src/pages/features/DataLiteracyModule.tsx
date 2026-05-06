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
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Database,
  Layers,
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

interface DataTool {
  name: string
  type: 'visualization' | 'analysis' | 'collection'
  description: string
  gradeLevel: string
  link?: string
}

const DataLiteracyModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showVisualizationTool, setShowVisualizationTool] = useState(false)
  const [showModelBuilder, setShowModelBuilder] = useState(false)
  const [activityData, setActivityData] = useState({
    title: '',
    gradeLevel: '',
    dataType: '',
    collectionMethod: '',
    analysis: '',
    visualization: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'data-literacy-stem',
      type: 'video',
      title: 'Data Literacy in STEM',
      duration: '20 min',
      points: 20,
      completed: false,
      content: {
        description: 'Understand the importance of data literacy and how to develop students\' ability to work with data.',
        keyPoints: [
          'Data literacy is essential for scientific understanding',
          'Students need to collect, analyze, and interpret data',
          'Data visualization helps students see patterns and trends',
          'Data literacy connects to all NGSS Science and Engineering Practices',
          'Real-world data makes science relevant and engaging',
        ],
      },
    },
    {
      id: 'scientific-modeling',
      type: 'reading',
      title: 'Scientific Modeling Practices',
      points: 15,
      completed: false,
      content: {
        article: `# Scientific Modeling Practices

## What Are Scientific Models?

Scientific models are representations that help us understand, explain, and predict phenomena. They can be physical, mathematical, computational, or conceptual.

### Types of Models

**Physical Models**: Three-dimensional representations
- Scale models of structures
- Molecular models
- Ecosystem dioramas

**Mathematical Models**: Equations and formulas
- Population growth equations
- Motion equations
- Statistical models

**Computational Models**: Computer simulations
- Climate models
- Ecosystem simulations
- Molecular dynamics

**Conceptual Models**: Diagrams and flowcharts
- Food webs
- Water cycles
- Energy flow diagrams

### Using Models in the Classroom

**Model Development**: Students create models to represent their understanding
- Start simple and refine over time
- Models should be testable and revisable
- Multiple models can represent the same phenomenon

**Model Use**: Students use models to make predictions
- Test model predictions against observations
- Revise models based on new evidence
- Compare different models

**Model Evaluation**: Students evaluate model limitations
- All models have limitations
- Models represent simplified versions of reality
- Understanding limitations helps students think critically

### Benefits of Modeling

- Makes abstract concepts concrete
- Supports sense-making
- Encourages revision of thinking
- Develops systems thinking
- Connects to real-world applications`,
        keyTakeaways: [
          'Models are tools for understanding and explaining phenomena',
          'Students should develop, use, and revise models',
          'Multiple types of models serve different purposes',
          'Understanding model limitations is important',
        ],
      },
    },
    {
      id: 'visualization-tools',
      type: 'interactive',
      title: 'Data Visualization Tools',
      points: 25,
      completed: false,
      content: {
        description: 'Explore tools for data visualization and learn how to help students create effective visualizations.',
        steps: [
          'Select appropriate visualization type',
          'Choose data visualization tool',
          'Create and customize visualizations',
          'Interpret and analyze visualizations',
          'Share visualizations with others',
        ],
      },
    },
    {
      id: 'model-reasoning',
      type: 'video',
      title: 'Model-Based Reasoning',
      duration: '22 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn strategies for facilitating model-based reasoning and helping students use models effectively.',
        keyPoints: [
          'Start with observations and questions',
          'Develop initial models based on current understanding',
          'Use models to make predictions',
          'Test predictions through investigation',
          'Revise models based on evidence',
        ],
      },
    },
    {
      id: 'data-activity-project',
      type: 'project',
      title: 'Create Data Analysis Activity',
      points: 20,
      completed: false,
      content: {
        description: 'Design a complete data literacy activity that develops students\' data collection, analysis, and communication skills.',
        requirements: [
          'Design data collection method',
          'Plan data analysis activities',
          'Create visualization opportunities',
          'Develop assessment rubrics',
          'Plan sense-making discussions',
        ],
      },
    },
  ]

  const dataTools: DataTool[] = [
    {
      name: 'Google Sheets',
      type: 'analysis',
      description: 'Spreadsheet tool for organizing and analyzing data, creating charts and graphs.',
      gradeLevel: 'All grades',
    },
    {
      name: 'Desmos',
      type: 'visualization',
      description: 'Graphing calculator and data visualization tool for mathematical modeling.',
      gradeLevel: 'Middle School - High School',
    },
    {
      name: 'CODAP',
      type: 'analysis',
      description: 'Common Online Data Analysis Platform for exploring data sets.',
      gradeLevel: 'Elementary - High School',
    },
    {
      name: 'PhET Simulations',
      type: 'visualization',
      description: 'Interactive simulations that generate data for analysis.',
      gradeLevel: 'All grades',
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
        if (!completedModules.includes('data-literacy')) {
          completedModules.push('data-literacy')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('data-literacy') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handleActivitySubmit = () => {
    alert('Data analysis activity saved! You can now implement this in your classroom.')
    setShowModelBuilder(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 6
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    105 min
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
                <h1 className="text-3xl font-bold">Data Literacy & Scientific Modeling</h1>
                <p className="mt-2 text-blue-100">
                  Develop students' ability to collect, analyze, interpret, and communicate scientific data
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
                      isActive ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
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
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
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

            {/* Interactive Visualization Tools */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'visualization-tools' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showVisualizationTool ? (
                    <button
                      onClick={() => setShowVisualizationTool(true)}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Visualization Tool Selector
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Visualization Tools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {dataTools.map((tool, idx) => (
                          <div key={idx} className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              {tool.type === 'visualization' ? (
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Database className="h-5 w-5 text-blue-600" />
                              )}
                              <h4 className="text-base font-bold text-gray-900">{tool.name}</h4>
                              <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${
                                tool.type === 'visualization' ? 'bg-green-100 text-green-700' :
                                tool.type === 'analysis' ? 'bg-purple-100 text-purple-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {tool.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{tool.gradeLevel}</p>
                            <p className="text-sm text-gray-700">{tool.description}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Visualization Types</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <LineChart className="h-4 w-4 text-blue-600" />
                            <span>Line Graphs</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span>Bar Charts</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <PieChart className="h-4 w-4 text-blue-600" />
                            <span>Pie Charts</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <span>Scatter Plots</span>
                          </div>
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
                  
                  {!showModelBuilder ? (
                    <button
                      onClick={() => setShowModelBuilder(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Activity Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Analysis Activity Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title</label>
                          <input
                            type="text"
                            value={activityData.title}
                            onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                            placeholder="e.g., Analyzing Plant Growth Data"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={activityData.gradeLevel}
                              onChange={(e) => setActivityData({ ...activityData, gradeLevel: e.target.value })}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                            <select
                              value={activityData.dataType}
                              onChange={(e) => setActivityData({ ...activityData, dataType: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            >
                              <option value="">Select type</option>
                              <option value="quantitative">Quantitative</option>
                              <option value="qualitative">Qualitative</option>
                              <option value="mixed">Mixed</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data Collection Method</label>
                          <textarea
                            value={activityData.collectionMethod}
                            onChange={(e) => setActivityData({ ...activityData, collectionMethod: e.target.value })}
                            rows={3}
                            placeholder="Describe how students will collect data..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Activities</label>
                          <textarea
                            value={activityData.analysis}
                            onChange={(e) => setActivityData({ ...activityData, analysis: e.target.value })}
                            rows={4}
                            placeholder="Describe data analysis activities..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Visualization Plan</label>
                          <textarea
                            value={activityData.visualization}
                            onChange={(e) => setActivityData({ ...activityData, visualization: e.target.value })}
                            rows={3}
                            placeholder="Describe how students will visualize the data..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleActivitySubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Save Activity
                          </button>
                          <button
                            onClick={() => setShowModelBuilder(false)}
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
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
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
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Great work!
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

export default DataLiteracyModule

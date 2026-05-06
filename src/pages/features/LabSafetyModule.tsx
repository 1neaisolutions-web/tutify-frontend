import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Star,
  Download,
  Share2,
  Bookmark,
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
  Eye,
  Shield,
  AlertTriangle,
  FirstAid,
  ClipboardCheck,
  CheckSquare,
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

interface SafetyProtocol {
  category: string
  protocols: string[]
  importance: string
}

interface RiskAssessment {
  activity: string
  hazards: string[]
  controls: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
}

const LabSafetyModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showRiskTool, setShowRiskTool] = useState(false)
  const [showSafetyManual, setShowSafetyManual] = useState(false)
  const [riskData, setRiskData] = useState({
    activity: '',
    hazards: '',
    controls: '',
    riskLevel: 'Low' as 'Low' | 'Medium' | 'High',
  })

  const lessons: LessonContent[] = [
    {
      id: 'safety-fundamentals',
      type: 'video',
      title: 'Lab Safety Fundamentals',
      duration: '15 min',
      points: 15,
      completed: false,
      content: {
        description: 'Learn essential lab safety principles and establish a culture of safety in your classroom.',
        keyPoints: [
          'Always wear appropriate personal protective equipment (PPE)',
          'Know the location of safety equipment',
          'Follow proper procedures for handling chemicals',
          'Maintain clean and organized workspaces',
          'Report accidents immediately',
        ],
      },
    },
    {
      id: 'osha-standards',
      type: 'reading',
      title: 'OSHA & School Safety Standards',
      points: 15,
      completed: false,
      content: {
        article: `# OSHA & School Safety Standards

## Understanding Safety Regulations

Schools must comply with Occupational Safety and Health Administration (OSHA) standards and local safety regulations to ensure student and staff safety.

### Key Safety Standards

**Chemical Safety**: Proper storage, labeling, and handling of chemicals
- Use Safety Data Sheets (SDS) for all chemicals
- Store chemicals according to compatibility
- Label all containers clearly

**Personal Protective Equipment (PPE)**: Appropriate safety gear for activities
- Safety goggles for eye protection
- Lab coats or aprons
- Gloves when handling chemicals
- Closed-toe shoes

**Emergency Procedures**: Clear protocols for emergencies
- Fire evacuation procedures
- Chemical spill response
- First aid procedures
- Emergency contact information

### School-Specific Considerations

**Age-Appropriate Activities**: Activities must match student maturity and skill level

**Supervision**: Adequate adult supervision at all times

**Equipment Maintenance**: Regular inspection and maintenance of safety equipment

**Documentation**: Keep records of safety training and incidents`,
        keyTakeaways: [
          'Comply with OSHA and local safety regulations',
          'Use appropriate PPE for all activities',
          'Maintain clear emergency procedures',
          'Document all safety training and incidents',
        ],
      },
    },
    {
      id: 'risk-assessment',
      type: 'interactive',
      title: 'Risk Assessment Tool',
      points: 25,
      completed: false,
      content: {
        description: 'Conduct comprehensive risk assessments for laboratory activities and experiments.',
        steps: [
          'Identify potential hazards',
          'Assess risk levels',
          'Implement control measures',
          'Document assessment',
          'Review and update regularly',
        ],
      },
    },
    {
      id: 'emergency-response',
      type: 'video',
      title: 'Emergency Response Procedures',
      duration: '12 min',
      points: 15,
      completed: false,
      content: {
        description: 'Learn how to respond effectively to safety incidents and emergencies in the lab.',
        keyPoints: [
          'Stay calm and assess the situation',
          'Follow established emergency procedures',
              'Administer first aid when appropriate',
          'Contact emergency services if needed',
          'Document all incidents',
        ],
      },
    },
    {
      id: 'safety-manual-project',
      type: 'project',
      title: 'Create Your Safety Manual',
      points: 30,
      completed: false,
      content: {
        description: 'Develop a comprehensive lab safety manual for your classroom.',
        requirements: [
          'Safety protocols and procedures',
          'Emergency contact information',
          'PPE requirements',
          'Chemical storage guidelines',
          'Risk assessment templates',
        ],
      },
    },
  ]

  const safetyProtocols: SafetyProtocol[] = [
    {
      category: 'Personal Protective Equipment',
      protocols: [
        'Wear safety goggles at all times',
        'Use lab coats or aprons',
        'Wear appropriate gloves',
        'Closed-toe shoes required',
        'Tie back long hair',
      ],
      importance: 'Prevents injuries from chemicals, heat, and projectiles',
    },
    {
      category: 'Chemical Safety',
      protocols: [
        'Read Safety Data Sheets (SDS) before use',
        'Never mix unknown chemicals',
        'Use fume hoods for volatile chemicals',
        'Store chemicals properly',
        'Dispose of chemicals correctly',
      ],
      importance: 'Prevents chemical exposure and reactions',
    },
    {
      category: 'Equipment Safety',
      protocols: [
        'Inspect equipment before use',
        'Follow manufacturer instructions',
        'Report damaged equipment immediately',
        'Use equipment only for intended purposes',
        'Clean equipment after use',
      ],
      importance: 'Prevents equipment-related accidents',
    },
    {
      category: 'Emergency Procedures',
      protocols: [
        'Know location of safety equipment',
        'Know evacuation routes',
        'Know how to use fire extinguisher',
        'Know first aid procedures',
        'Report all accidents immediately',
      ],
      importance: 'Ensures quick response to emergencies',
    },
  ]

  const riskAssessments: RiskAssessment[] = [
    {
      activity: 'Acid-Base Titration',
      hazards: ['Chemical burns', 'Eye injury', 'Spills'],
      controls: [
        'Wear safety goggles and gloves',
        'Use fume hood',
        'Have neutralizing agents ready',
        'Small group sizes',
      ],
      riskLevel: 'Medium',
    },
    {
      activity: 'Microscope Use',
      hazards: ['Eye strain', 'Broken slides'],
      controls: [
        'Proper lighting',
        'Supervised use',
        'Handle slides carefully',
      ],
      riskLevel: 'Low',
    },
    {
      activity: 'Bunsen Burner Use',
      hazards: ['Burns', 'Fire', 'Gas leaks'],
      controls: [
        'Proper ventilation',
        'Supervised use only',
        'Check connections',
        'Have fire extinguisher nearby',
      ],
      riskLevel: 'High',
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
        if (!completedModules.includes('lab-safety')) {
          completedModules.push('lab-safety')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('lab-safety') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handleRiskSubmit = () => {
    alert('Risk assessment saved! This will be included in your safety manual.')
    setShowRiskTool(false)
  }

  const handleManualSubmit = () => {
    alert('Safety manual saved! You now have a comprehensive safety guide for your classroom.')
    setShowSafetyManual(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 4
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
                <h1 className="text-3xl font-bold">Lab Safety Protocols & Risk Management</h1>
                <p className="mt-2 text-red-100">
                  Establish comprehensive lab safety protocols and create a culture of safety in your STEM classroom
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
                      isActive ? 'bg-red-50 border-2 border-red-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-red-900' : 'text-gray-900'}`}>
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
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Protocols */}
                {currentLessonData.id === 'safety-fundamentals' && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Safety Protocols</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safetyProtocols.map((protocol, idx) => (
                        <div key={idx} className="bg-red-50 rounded-lg p-5 border border-red-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="h-5 w-5 text-red-600" />
                            <h4 className="text-base font-bold text-gray-900">{protocol.category}</h4>
                          </div>
                          <ul className="space-y-2 mb-3">
                            {protocol.protocols.map((p, pIdx) => (
                              <li key={pIdx} className="text-xs text-gray-700 flex items-start gap-2">
                                <CheckSquare className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-600 italic">{protocol.importance}</p>
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

            {/* Interactive Risk Assessment Tool */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'risk-assessment' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showRiskTool ? (
                    <button
                      onClick={() => setShowRiskTool(true)}
                      className="w-full px-6 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Risk Assessment Tool
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Tool</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Activity Name</label>
                          <input
                            type="text"
                            value={riskData.activity}
                            onChange={(e) => setRiskData({ ...riskData, activity: e.target.value })}
                            placeholder="e.g., Acid-Base Titration"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Potential Hazards</label>
                          <textarea
                            value={riskData.hazards}
                            onChange={(e) => setRiskData({ ...riskData, hazards: e.target.value })}
                            rows={3}
                            placeholder="List potential hazards (one per line)..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Control Measures</label>
                          <textarea
                            value={riskData.controls}
                            onChange={(e) => setRiskData({ ...riskData, controls: e.target.value })}
                            rows={4}
                            placeholder="Describe control measures to mitigate risks..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['Low', 'Medium', 'High'] as const).map((level) => (
                              <button
                                key={level}
                                onClick={() => setRiskData({ ...riskData, riskLevel: level })}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                  riskData.riskLevel === level
                                    ? level === 'Low'
                                      ? 'bg-green-600 text-white'
                                      : level === 'Medium'
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleRiskSubmit}
                            disabled={!riskData.activity || !riskData.hazards}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Save Assessment
                          </button>
                          <button
                            onClick={() => setShowRiskTool(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Assessment Examples */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Risk Assessments</h3>
                  <div className="space-y-4">
                    {riskAssessments.map((assessment, idx) => (
                      <div key={idx} className="bg-red-50 rounded-lg p-5 border border-red-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-bold text-gray-900">{assessment.activity}</h4>
                          <span className={`px-3 py-1 rounded text-xs font-semibold ${
                            assessment.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                            assessment.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {assessment.riskLevel} Risk
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Hazards:</p>
                            <ul className="space-y-1">
                              {assessment.hazards.map((hazard, hIdx) => (
                                <li key={hIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                  <span>{hazard}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Control Measures:</p>
                            <ul className="space-y-1">
                              {assessment.controls.map((control, cIdx) => (
                                <li key={cIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <Shield className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{control}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Project Lesson */}
            {currentLessonData.type === 'project' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showSafetyManual ? (
                    <button
                      onClick={() => setShowSafetyManual(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Safety Manual Builder
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Safety Manual Builder</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                            <input
                              type="text"
                              placeholder="Your School Name"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Levels</label>
                            <input
                              type="text"
                              placeholder="e.g., 6-12"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contacts</label>
                          <textarea
                            rows={3}
                            placeholder="List emergency contact numbers..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Safety Protocols</label>
                          <textarea
                            rows={5}
                            placeholder="Document your safety protocols..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleManualSubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Generate Safety Manual
                          </button>
                          <button
                            onClick={() => setShowSafetyManual(false)}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Requirements</h3>
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
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition"
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
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Safety first!
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

export default LabSafetyModule

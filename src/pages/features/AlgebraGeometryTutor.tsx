import { useState } from 'react'
import {
  Calculator,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Award,
  Clock,
  Star,
  Lock,
  Layers,
  Brain,
  Zap,
  Compass,
  Puzzle,
  LineChart,
  PieChart,
  Grid3x3,
  Shapes,
  BookOpen,
  FileText,
  Eye,
  Wand2,
  Settings,
  Filter,
  GraduationCap,
  Code,
  Ruler,
  Triangle,
  Square,
  Circle as CircleIcon,
  Hexagon,
  PlayCircle,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  PenTool,
  Eraser,
} from 'lucide-react'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'

interface VisualExplanation {
  concept: string
  explanation: string
  visualType: 'graph' | 'diagram' | 'animation' | 'interactive'
  steps: {
    step: number
    description: string
    visual: string
  }[]
  interactiveElements: string[]
}

interface ProofStrategy {
  theorem: string
  proofType: 'direct' | 'indirect' | 'contradiction' | 'induction' | 'construction'
  strategy: string
  steps: {
    step: number
    statement: string
    justification: string
    visual?: string
  }[]
  hints: string[]
  commonMistakes: string[]
}

interface ScaffoldedPractice {
  topic: string
  levels: {
    level: number
    name: string
    problems: {
      id: number
      question: string
      hints: string[]
      solution: string
      explanation: string
    }[]
  }[]
}

interface GeometryVisual {
  type: string
  description: string
  interactive: boolean
  elements: string[]
}

type TutorTab = 'visual' | 'proof' | 'practice' | 'interactive' | 'assessment' | 'resources'

function inferTabFromPayload(parsed: Record<string, unknown>): TutorTab | null {
  if ('visualType' in parsed && typeof (parsed as VisualExplanation).visualType === 'string') return 'visual'
  if ('proofType' in parsed && typeof (parsed as ProofStrategy).proofType === 'string') return 'proof'
  if ('levels' in parsed && Array.isArray((parsed as ScaffoldedPractice).levels)) return 'practice'
  return null
}

const AlgebraGeometryTutor = () => {
  const { toast } = useSnackbar()
  const CHATBOT_SLUG = 'algebra-geometry-tutor'
  const [activeTab, setActiveTab] = useState<TutorTab>('visual')
  const [gradeLevel, setGradeLevel] = useState('9')
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState<'algebra' | 'geometry'>('algebra')
  const [isGenerating, setIsGenerating] = useState(false)
  const [visualExplanation, setVisualExplanation] = useState<VisualExplanation | null>(null)
  const [proofStrategy, setProofStrategy] = useState<ProofStrategy | null>(null)
  const [scaffoldedPractice, setScaffoldedPractice] = useState<ScaffoldedPractice | null>(null)

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    detectTabFromMetadata: (m) => {
      const t = (m?.tab ?? m?.Tab) as string | undefined
      if (t === 'visual' || t === 'proof' || t === 'practice') return t
      return null
    },
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      try {
        if (!assistantContent?.trim()) {
          toast.info('This history entry has no saved output to restore.')
          return
        }
        const meta = assistantMetadata || {}
        let tab: TutorTab =
          tabKey === 'visual' || tabKey === 'proof' || tabKey === 'practice' ? (tabKey as TutorTab) : 'visual'

        const tabRaw = (meta.tab ?? meta.Tab) as string | undefined
        const subj = meta.subject as string | undefined
        if (subj === 'algebra' || subj === 'geometry') {
          setSubject(subj)
        }

        const gl = meta.grade_level ?? meta.gradeLevel
        if (typeof gl === 'string' || typeof gl === 'number') {
          const g = String(gl).replace(/\D/g, '')
          if (g) setGradeLevel(g)
        }

        if (userContent) {
          setTopic(userContent)
        }

        let parsed: Record<string, unknown>
        try {
          parsed = JSON.parse(assistantContent) as Record<string, unknown>
        } catch {
          toast.info('Could not restore this generation (unexpected format).')
          return
        }

        const inferred = inferTabFromPayload(parsed)
        if (!tabRaw && inferred) {
          tab = inferred
        }
        setActiveTab(tab)

        setVisualExplanation(null)
        setProofStrategy(null)
        setScaffoldedPractice(null)

        if (tab === 'visual') {
          setVisualExplanation(parsed as unknown as VisualExplanation)
        } else if (tab === 'proof') {
          setProofStrategy(parsed as unknown as ProofStrategy)
        } else if (tab === 'practice') {
          setScaffoldedPractice(parsed as unknown as ScaffoldedPractice)
        }
      } catch {
        toast.info('Could not load this conversation from History.')
      }
    },
  })

  const handleVisualExplanation = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockVisual: VisualExplanation = {
        concept: topic || 'Linear Equations',
        explanation: subject === 'algebra' 
          ? 'Linear equations represent relationships where one variable depends on another in a straight-line pattern. The general form is y = mx + b, where m is the slope and b is the y-intercept.'
          : 'The Pythagorean Theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c².',
        visualType: subject === 'algebra' ? 'graph' : 'diagram',
        steps: subject === 'algebra' ? [
          {
            step: 1,
            description: 'Identify the slope (m) and y-intercept (b) from the equation',
            visual: 'Graph showing y = 2x + 3 with slope of 2 and y-intercept at (0, 3)',
          },
          {
            step: 2,
            description: 'Plot the y-intercept on the coordinate plane',
            visual: 'Point marked at (0, 3)',
          },
          {
            step: 3,
            description: 'Use the slope to find another point (rise over run)',
            visual: 'Arrow showing rise of 2 and run of 1 from the y-intercept',
          },
          {
            step: 4,
            description: 'Draw the line through both points',
            visual: 'Complete line graph extending through both points',
          },
        ] : [
          {
            step: 1,
            description: 'Identify the right triangle and label the sides',
            visual: 'Right triangle with sides labeled a, b, and hypotenuse c',
          },
          {
            step: 2,
            description: 'Visualize the squares on each side',
            visual: 'Squares constructed on each side of the triangle',
          },
          {
            step: 3,
            description: 'Demonstrate that a² + b² = c²',
            visual: 'Visual proof showing the area relationship',
          },
        ],
        interactiveElements: [
          'Drag points to change the equation',
          'Adjust sliders for slope and intercept',
          'Zoom in/out on the graph',
          'Toggle grid and axes',
        ],
      }
      setVisualExplanation(mockVisual)
      setIsGenerating(false)
      void chatbotApi
        .logChatbotHistory(CHATBOT_SLUG, {
          title: `Visual explanation · ${mockVisual.concept}`,
          user_content: topic,
          assistant_content: JSON.stringify(mockVisual, null, 2),
          metadata: { tab: 'visual', subject, grade_level: gradeLevel },
          conversation_id: conversationIdForActiveTab ?? undefined,
        })
        .then((r) => pinFromResponse(r.conversation_id))
        .catch(() => toast.info('Generated, but could not save to History.'))
    }, 2000)
  }

  const handleProofStrategy = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockProof: ProofStrategy = {
        theorem: topic || 'Pythagorean Theorem',
        proofType: 'direct',
        strategy: 'We will use a direct proof by constructing squares on each side of a right triangle and showing the area relationship.',
        steps: [
          {
            step: 1,
            statement: 'Given: Right triangle with sides a, b, and hypotenuse c',
            justification: 'Given',
            visual: 'Right triangle diagram',
          },
          {
            step: 2,
            statement: 'Construct squares on each side with areas a², b², and c²',
            justification: 'Definition of square area',
            visual: 'Three squares constructed on triangle sides',
          },
          {
            step: 3,
            statement: 'Arrange four copies of the triangle to form a larger square',
            justification: 'Geometric construction',
            visual: 'Four triangles arranged in a square pattern',
          },
          {
            step: 4,
            statement: 'The area of the large square equals (a + b)²',
            justification: 'Area formula for square',
            visual: 'Large square with side length (a + b)',
          },
          {
            step: 5,
            statement: 'The area also equals c² + 4(½ab) = c² + 2ab',
            justification: 'Sum of areas of inner square and four triangles',
            visual: 'Decomposition showing inner square and triangles',
          },
          {
            step: 6,
            statement: 'Therefore, (a + b)² = c² + 2ab',
            justification: 'Equality of expressions',
            visual: 'Algebraic manipulation',
          },
          {
            step: 7,
            statement: 'Expanding: a² + 2ab + b² = c² + 2ab',
            justification: 'Algebraic expansion',
            visual: 'Step-by-step algebraic work',
          },
          {
            step: 8,
            statement: 'Subtracting 2ab from both sides: a² + b² = c²',
            justification: 'Subtraction property of equality',
            visual: 'Final equation',
          },
        ],
        hints: [
          'Start by drawing a clear diagram',
          'Label all given information',
          'Consider what you need to prove',
          'Think about geometric constructions that might help',
          'Look for relationships between areas',
        ],
        commonMistakes: [
          'Assuming the theorem without proving it',
          'Using the theorem to prove itself (circular reasoning)',
          'Not clearly labeling the right angle',
          'Confusing which side is the hypotenuse',
        ],
      }
      setProofStrategy(mockProof)
      setIsGenerating(false)
      void chatbotApi
        .logChatbotHistory(CHATBOT_SLUG, {
          title: `Proof strategy · ${mockProof.theorem}`,
          user_content: topic,
          assistant_content: JSON.stringify(mockProof, null, 2),
          metadata: { tab: 'proof', subject, grade_level: gradeLevel },
          conversation_id: conversationIdForActiveTab ?? undefined,
        })
        .then((r) => pinFromResponse(r.conversation_id))
        .catch(() => toast.info('Generated, but could not save to History.'))
    }, 2000)
  }

  const handleScaffoldedPractice = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockPractice: ScaffoldedPractice = {
        topic: topic || 'Solving Quadratic Equations',
        levels: [
          {
            level: 1,
            name: 'Foundation',
            problems: [
              {
                id: 1,
                question: 'Solve: x² = 16',
                hints: [
                  'What number squared equals 16?',
                  'Remember: both positive and negative numbers can be solutions',
                ],
                solution: 'x = 4 or x = -4',
                explanation: 'Since 4² = 16 and (-4)² = 16, there are two solutions.',
              },
              {
                id: 2,
                question: 'Solve: (x - 3)² = 25',
                hints: [
                  'Take the square root of both sides',
                  'Don\'t forget to solve for x after taking the square root',
                ],
                solution: 'x = 8 or x = -2',
                explanation: 'Taking square root: x - 3 = ±5, so x = 3 + 5 = 8 or x = 3 - 5 = -2',
              },
            ],
          },
          {
            level: 2,
            name: 'Intermediate',
            problems: [
              {
                id: 3,
                question: 'Solve: x² - 5x + 6 = 0',
                hints: [
                  'Try factoring the quadratic',
                  'Look for two numbers that multiply to 6 and add to -5',
                ],
                solution: 'x = 2 or x = 3',
                explanation: 'Factoring: (x - 2)(x - 3) = 0, so x = 2 or x = 3',
              },
              {
                id: 4,
                question: 'Solve: 2x² - 8x = 0',
                hints: [
                  'Factor out the common term',
                  'Use the zero product property',
                ],
                solution: 'x = 0 or x = 4',
                explanation: 'Factoring: 2x(x - 4) = 0, so 2x = 0 or x - 4 = 0',
              },
            ],
          },
          {
            level: 3,
            name: 'Advanced',
            problems: [
              {
                id: 5,
                question: 'Solve: x² - 4x - 5 = 0 using the quadratic formula',
                hints: [
                  'Identify a = 1, b = -4, c = -5',
                  'Substitute into the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a',
                ],
                solution: 'x = 5 or x = -1',
                explanation: 'Using quadratic formula: x = (4 ± √(16 + 20)) / 2 = (4 ± 6) / 2',
              },
              {
                id: 6,
                question: 'Solve: 3x² + 7x - 6 = 0',
                hints: [
                  'This doesn\'t factor easily, so use the quadratic formula',
                  'Calculate the discriminant first: b² - 4ac',
                ],
                solution: 'x = 2/3 or x = -3',
                explanation: 'Discriminant = 49 + 72 = 121, so x = (-7 ± 11) / 6',
              },
            ],
          },
        ],
      }
      setScaffoldedPractice(mockPractice)
      setIsGenerating(false)
      void chatbotApi
        .logChatbotHistory(CHATBOT_SLUG, {
          title: `Practice · ${mockPractice.topic}`,
          user_content: topic,
          assistant_content: JSON.stringify(mockPractice, null, 2),
          metadata: { tab: 'practice', subject, grade_level: gradeLevel },
          conversation_id: conversationIdForActiveTab ?? undefined,
        })
        .then((r) => pinFromResponse(r.conversation_id))
        .catch(() => toast.info('Generated, but could not save to History.'))
    }, 2000)
  }

  const tabs = [
    { id: 'visual', label: 'Visual Explanations', icon: Eye },
    { id: 'proof', label: 'Proof Strategies', icon: Brain },
    { id: 'practice', label: 'Scaffolded Practice', icon: Layers },
    { id: 'interactive', label: 'Interactive Tools', icon: PlayCircle },
    { id: 'assessment', label: 'Assessment', icon: FileText },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Algebra & Geometry Tutor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.7★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                </div>
                <p className="mt-2 text-indigo-100">
                  Advanced mathematics support with visual explanations, proof strategies, 
                  and scaffolded practice for algebra and geometry.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Eye className="h-4 w-4" />
                <span>Visual Explanations</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Brain className="h-4 w-4" />
                <span>Proof Strategies</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Layers className="h-4 w-4" />
                <span>Scaffolded Practice</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <PlayCircle className="h-4 w-4" />
                <span>Interactive Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visuals Created</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Eye className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Proofs Explained</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Brain className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Supported</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3,456</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mastery Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">91%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Visual Explanations Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as 'algebra' | 'geometry')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="algebra">Algebra</option>
                      <option value="geometry">Geometry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic/Concept
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={subject === 'algebra' ? 'e.g., Linear Equations, Quadratic Functions' : 'e.g., Pythagorean Theorem, Similar Triangles'}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleVisualExplanation}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Visual Explanation
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {visualExplanation ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-indigo-600" />
                          {visualExplanation.concept}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{visualExplanation.explanation}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium capitalize">
                            {visualExplanation.visualType}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Visual Guide</h3>
                        <div className="space-y-4">
                          {visualExplanation.steps.map((step, idx) => (
                            <div key={idx} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 mb-2">{step.description}</p>
                                  <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Eye className="h-4 w-4 text-indigo-600" />
                                      <span className="italic">{step.visual}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <PlayCircle className="h-5 w-5 text-purple-600" />
                          Interactive Elements
                        </h3>
                        <ul className="space-y-2">
                          {visualExplanation.interactiveElements.map((element, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-purple-200">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{element}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                          <PlayCircle className="h-4 w-4" />
                          Launch Interactive
                        </button>
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Visual
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a topic and generate visual explanations with step-by-step guides
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Proof Strategies Tab */}
          {activeTab === 'proof' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as 'algebra' | 'geometry')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="algebra">Algebra</option>
                      <option value="geometry">Geometry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theorem/Statement to Prove
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Pythagorean Theorem, Angle Sum Theorem"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof Type
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                      <option>Direct Proof</option>
                      <option>Indirect Proof</option>
                      <option>Proof by Contradiction</option>
                      <option>Proof by Induction</option>
                      <option>Proof by Construction</option>
                    </select>
                  </div>
                  <button
                    onClick={handleProofStrategy}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Proof Strategy
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {proofStrategy ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                          {proofStrategy.theorem}
                        </h3>
                        <div className="mb-3">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold capitalize">
                            {proofStrategy.proofType} Proof
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{proofStrategy.strategy}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof Steps</h3>
                        <div className="space-y-4">
                          {proofStrategy.steps.map((step, idx) => (
                            <div key={idx} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 mb-2">{step.statement}</p>
                                  <div className="bg-white rounded-lg p-3 border border-indigo-200 mb-2">
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Justification:</p>
                                    <p className="text-sm text-gray-700">{step.justification}</p>
                                  </div>
                                  {step.visual && (
                                    <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                                      <p className="text-xs text-blue-700 italic">{step.visual}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-green-600" />
                            Helpful Hints
                          </h3>
                          <ul className="space-y-2">
                            {proofStrategy.hints.map((hint, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{hint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            Common Mistakes
                          </h3>
                          <ul className="space-y-2">
                            {proofStrategy.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Proof Guide
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a theorem or statement to generate proof strategies with step-by-step guidance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scaffolded Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as 'algebra' | 'geometry')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="algebra">Algebra</option>
                      <option value="geometry">Geometry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Quadratic Equations, Triangle Congruence"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleScaffoldedPractice}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Practice Problems
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {scaffoldedPractice ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Layers className="h-5 w-5 text-indigo-600" />
                          {scaffoldedPractice.topic}
                        </h3>
                        <p className="text-sm text-gray-600">Scaffolded practice from foundation to advanced levels</p>
                      </div>

                      {scaffoldedPractice.levels.map((level, levelIdx) => {
                        const levelColors = {
                          1: 'bg-blue-50 border-blue-200',
                          2: 'bg-green-50 border-green-200',
                          3: 'bg-purple-50 border-purple-200',
                        }
                        const levelLabels = {
                          1: 'Foundation',
                          2: 'Intermediate',
                          3: 'Advanced',
                        }

                        return (
                          <div key={levelIdx} className={`rounded-2xl border-2 p-6 ${levelColors[level.level as keyof typeof levelColors]}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-base font-bold text-gray-900">Level {level.level}: {level.name}</h4>
                              <span className="px-3 py-1 rounded-full bg-white text-xs font-semibold">
                                {level.problems.length} problems
                              </span>
                            </div>
                            <div className="space-y-4">
                              {level.problems.map((problem) => (
                                <div key={problem.id} className="bg-white rounded-xl p-5 border border-gray-200">
                                  <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-900 mb-2">Problem:</p>
                                    <p className="text-gray-700">{problem.question}</p>
                                  </div>
                                  <div className="mb-3">
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Hints:</p>
                                    <ul className="space-y-1">
                                      {problem.hints.map((hint, hintIdx) => (
                                        <li key={hintIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                          <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                          <span>{hint}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <details className="mt-3">
                                    <summary className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-700">
                                      Show Solution
                                    </summary>
                                    <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                      <p className="text-sm font-semibold text-gray-900 mb-1">Solution:</p>
                                      <p className="text-sm text-gray-700 mb-2">{problem.solution}</p>
                                      <p className="text-sm font-semibold text-gray-900 mb-1">Explanation:</p>
                                      <p className="text-sm text-gray-700">{problem.explanation}</p>
                                    </div>
                                  </details>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Practice Set
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a topic to generate scaffolded practice problems from foundation to advanced levels
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Tools Tab */}
          {activeTab === 'interactive' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PlayCircle className="h-6 w-6 text-blue-600" />
                  Interactive Learning Tools
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Access interactive tools for algebra and geometry visualization and manipulation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Graphing Calculator', icon: LineChart, color: 'blue', description: 'Plot functions, analyze graphs' },
                    { name: 'Geometry Builder', icon: Triangle, color: 'green', description: 'Construct and manipulate shapes' },
                    { name: 'Coordinate Plane', icon: Grid3x3, color: 'purple', description: 'Interactive coordinate system' },
                    { name: 'Function Explorer', icon: TrendingUp, color: 'pink', description: 'Explore function transformations' },
                    { name: 'Proof Builder', icon: Brain, color: 'indigo', description: 'Step-by-step proof construction' },
                    { name: '3D Geometry Viewer', icon: Shapes, color: 'teal', description: 'Visualize 3D shapes and solids' },
                  ].map((tool, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${tool.color}-100 text-${tool.color}-600 mb-4`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{tool.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Launch Tool
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  Assessment Tools
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Create comprehensive assessments aligned with learning objectives.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Concept Check', icon: Target, description: 'Quick understanding assessment', color: 'blue' },
                    { type: 'Proof Assessment', icon: Brain, description: 'Evaluate proof-writing skills', color: 'purple' },
                    { type: 'Problem Solving', icon: Puzzle, description: 'Multi-step problem assessment', color: 'green' },
                    { type: 'Visual Reasoning', icon: Eye, description: 'Assess geometric visualization', color: 'pink' },
                  ].map((assessment, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${assessment.color}-100 text-${assessment.color}-600 mb-3`}>
                        <assessment.icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{assessment.type}</h4>
                      <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Create Assessment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                  Learning Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Video Tutorials', count: '245', icon: PlayCircle },
                    { title: 'Practice Worksheets', count: '189', icon: FileText },
                    { title: 'Proof Templates', count: '67', icon: Brain },
                    { title: 'Visual Guides', count: '134', icon: Eye },
                  ].map((resource, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                          <resource.icon className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{resource.count}</span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{resource.title}</h4>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Browse Resources
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced AI-Powered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Visualizations</h3>
            <p className="text-sm text-gray-600">
              Interactive graphs, diagrams, and 3D models that respond to user input and parameter changes.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Intelligent Proof Assistance</h3>
            <p className="text-sm text-gray-600">
              AI-powered hints and suggestions to guide students through complex proof constructions.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Scaffolding</h3>
            <p className="text-sm text-gray-600">
              Problems automatically adjust difficulty based on student performance and understanding.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Feedback</h3>
            <p className="text-sm text-gray-600">
              Instant feedback on solutions with detailed explanations and alternative approaches.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Alignment</h3>
            <p className="text-sm text-gray-600">
              All content aligned with Common Core, state standards, and international curricula.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Learning</h3>
            <p className="text-sm text-gray-600">
              Customized learning paths based on individual student strengths and learning styles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlgebraGeometryTutor




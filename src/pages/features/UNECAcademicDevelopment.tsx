import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  PenTool,
  BarChart3,
  BookMarked,
  GraduationCap,
  Award,
  Clock,
  Search,
  Filter,
  Star,
  Lock,
  Brain,
  Zap,
  Compass,
  Layers,
  Eye,
  ArrowRight,
  Book,
  Users2,
  Target as TargetIcon,
  BrainCircuit,
  Rocket,
  Puzzle,
  Video,
  FileCheck,
  ClipboardList,
  Laptop,
  Wand2,
  Globe,
  Settings,
  Presentation,
  Layout,
  FileEdit,
  CheckSquare,
  Cpu,
  Code,
} from 'lucide-react'

interface SyllabusDesign {
  courseTitle: string
  learningOutcomes: string[]
  courseStructure: {
    module: string
    topics: string[]
    duration: string
    assessments: string[]
  }[]
  teachingMethods: string[]
  resources: string[]
  assessmentPlan: {
    type: string
    weight: number
    description: string
  }[]
}

interface RubricDesign {
  criteria: {
    name: string
    description: string
    levels: {
      level: string
      description: string
      points: number
    }[]
  }[]
  totalPoints: number
}

interface DigitalMaterial {
  type: string
  tool: string
  description: string
  aiIntegration: string
  steps: string[]
  examples: string[]
}

interface StudentCenteredMethod {
  method: string
  description: string
  implementation: string[]
  benefits: string[]
  challenges: string[]
  examples: string[]
}

const UNECAcademicDevelopment = () => {
  const [activeTab, setActiveTab] = useState<'pedagogy' | 'syllabus' | 'assessment' | 'digital' | 'student-centered' | 'chat'>('pedagogy')
  const [isGenerating, setIsGenerating] = useState(false)
  const [syllabusDesign, setSyllabusDesign] = useState<SyllabusDesign | null>(null)
  const [rubricDesign, setRubricDesign] = useState<RubricDesign | null>(null)
  const [digitalMaterial, setDigitalMaterial] = useState<DigitalMaterial | null>(null)
  const [studentCenteredMethod, setStudentCenteredMethod] = useState<StudentCenteredMethod | null>(null)

  const pedagogicalValues = [
    'Respect for student diversity and individual learning needs',
    'Commitment to continuous professional development',
    'Promotion of critical thinking and independent learning',
    'Ethical use of technology and AI in education',
    'Student-centered approach to teaching and learning',
    'Evidence-based instructional practices',
    'Collaboration and knowledge sharing among educators',
    'Innovation and adaptability in teaching methods',
  ]

  const handleSyllabusDesign = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      const mockSyllabus: SyllabusDesign = {
        courseTitle: 'Introduction to Modern Teaching Methods',
        learningOutcomes: [
          'Design effective course syllabi aligned with learning objectives',
          'Apply student-centered teaching methodologies',
          'Create comprehensive assessment strategies',
          'Integrate digital tools and AI in teaching materials',
        ],
        courseStructure: [
          {
            module: 'Module 1: Foundations of Teaching',
            topics: ['Pedagogical values', 'Learning theories', 'Curriculum design principles'],
            duration: '2 weeks',
            assessments: ['Reflection paper', 'Discussion forum'],
          },
          {
            module: 'Module 2: Syllabus and Subject Design',
            topics: ['Learning outcomes', 'Course structure', 'Resource selection'],
            duration: '3 weeks',
            assessments: ['Syllabus draft', 'Peer review'],
          },
        ],
        teachingMethods: [
          'Interactive lectures',
          'Group discussions',
          'Case studies',
          'Project-based learning',
          'Peer collaboration',
        ],
        resources: [
          'Academic textbooks',
          'Online articles and journals',
          'Multimedia presentations',
          'Digital platforms',
        ],
        assessmentPlan: [
          {
            type: 'Formative Assessment',
            weight: 30,
            description: 'Quizzes, discussions, and reflection activities',
          },
          {
            type: 'Summative Assessment',
            weight: 70,
            description: 'Final project and comprehensive exam',
          },
        ],
      }
      setSyllabusDesign(mockSyllabus)
      setIsGenerating(false)
    }, 2000)
  }

  const handleRubricDesign = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      const mockRubric: RubricDesign = {
        criteria: [
          {
            name: 'Content Knowledge',
            description: 'Demonstrates understanding of key concepts',
            levels: [
              { level: 'Excellent', description: 'Comprehensive understanding with deep insights', points: 25 },
              { level: 'Good', description: 'Solid understanding of main concepts', points: 20 },
              { level: 'Satisfactory', description: 'Basic understanding demonstrated', points: 15 },
              { level: 'Needs Improvement', description: 'Limited understanding shown', points: 10 },
            ],
          },
          {
            name: 'Critical Thinking',
            description: 'Ability to analyze and evaluate information',
            levels: [
              { level: 'Excellent', description: 'Sophisticated analysis and evaluation', points: 25 },
              { level: 'Good', description: 'Good analytical skills demonstrated', points: 20 },
              { level: 'Satisfactory', description: 'Basic analysis present', points: 15 },
              { level: 'Needs Improvement', description: 'Limited critical thinking', points: 10 },
            ],
          },
        ],
        totalPoints: 100,
      }
      setRubricDesign(mockRubric)
      setIsGenerating(false)
    }, 2000)
  }

  const handleDigitalMaterial = async (type: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      const mockMaterial: DigitalMaterial = {
        type: type,
        tool: 'AI-Powered Content Generator',
        description: `Create engaging ${type.toLowerCase()} using AI assistance`,
        aiIntegration: 'Use AI to generate initial content, then customize for your specific needs',
        steps: [
          'Define learning objectives',
          'Input topic and key points',
          'Generate initial content with AI',
          'Review and refine content',
          'Add interactive elements',
          'Test with sample students',
        ],
        examples: [
          'Interactive presentations with embedded quizzes',
          'Video lessons with AI-generated transcripts',
          'Digital worksheets with auto-grading',
        ],
      }
      setDigitalMaterial(mockMaterial)
      setIsGenerating(false)
    }, 2000)
  }

  const handleStudentCenteredMethod = async (method: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      const mockMethod: StudentCenteredMethod = {
        method: method,
        description: `${method} empowers students to take an active role in their learning journey.`,
        implementation: [
          'Assess student needs and interests',
          'Design activities that promote student autonomy',
          'Provide scaffolding and support',
          'Encourage reflection and self-assessment',
          'Foster collaborative learning environments',
        ],
        benefits: [
          'Increased student engagement',
          'Development of critical thinking skills',
          'Better retention of knowledge',
          'Preparation for lifelong learning',
        ],
        challenges: [
          'Requires careful planning',
          'May need adjustment period',
          'Requires ongoing teacher support',
        ],
        examples: [
          'Student-led research projects',
          'Peer teaching sessions',
          'Self-paced learning modules',
        ],
      }
      setStudentCenteredMethod(mockMethod)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">UNEC Academic Development & Innovation</h1>
                <p className="text-indigo-100 mt-1">
                  Strengthen academic development and apply innovative methods in teaching
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-white/90">
              This program improves teachers' knowledge and skills on pedagogical values, syllabus design, 
              assessment, digital literacy, AI integration, and student-centered teaching methods to create 
              a more efficient and high-quality teaching environment.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'pedagogy', label: 'Pedagogical Values', icon: BookOpen },
              { id: 'syllabus', label: 'Syllabus Design', icon: FileEdit },
              { id: 'assessment', label: 'Assessment & Rubrics', icon: ClipboardList },
              { id: 'digital', label: 'Digital & AI Tools', icon: Cpu },
              { id: 'student-centered', label: 'Student-Centered Methods', icon: Users },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Pedagogical Values Tab */}
          {activeTab === 'pedagogy' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Principles of Teaching and Pedagogical Values</h2>
                <p className="text-gray-600">
                  Core values and principles that guide effective teaching practices
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {pedagogicalValues.map((value, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg mt-1">
                        <CheckCircle2 className="h-5 w-5 text-primary-600" />
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Key Principles
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Student-Centered Learning:</strong> Focus on student needs, interests, and active participation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Continuous Improvement:</strong> Regular reflection and adaptation of teaching methods</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Evidence-Based Practice:</strong> Use research and data to inform instructional decisions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Innovation:</strong> Embrace new technologies and methodologies to enhance learning</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Syllabus Design Tab */}
          {activeTab === 'syllabus' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Syllabus Design and Subject Design</h2>
                <p className="text-gray-600">
                  Create comprehensive, well-structured course syllabi that align with learning objectives
                </p>
              </div>

              <button
                onClick={handleSyllabusDesign}
                disabled={isGenerating}
                className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating Syllabus...
                  </>
                ) : (
                  <>
                    <FileEdit className="h-5 w-5" />
                    Generate Syllabus Template
                  </>
                )}
              </button>

              {syllabusDesign && (
                <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{syllabusDesign.courseTitle}</h3>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {syllabusDesign.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Layout className="h-5 w-5 text-blue-600" />
                      Course Structure
                    </h4>
                    <div className="space-y-4">
                      {syllabusDesign.courseStructure.map((module, idx) => (
                        <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{module.module}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {module.duration}
                            </span>
                          </div>
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">Topics:</p>
                            <ul className="flex flex-wrap gap-2">
                              {module.topics.map((topic, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                                >
                                  {topic}
                                </span>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Assessments:</p>
                            <ul className="flex flex-wrap gap-2">
                              {module.assessments.map((assessment, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
                                >
                                  {assessment}
                                </span>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <PenTool className="h-5 w-5 text-purple-600" />
                        Teaching Methods
                      </h4>
                      <ul className="space-y-2">
                        {syllabusDesign.teachingMethods.map((method, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookMarked className="h-5 w-5 text-indigo-600" />
                        Resources
                      </h4>
                      <ul className="space-y-2">
                        {syllabusDesign.resources.map((resource, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-indigo-600 mt-1">📚</span>
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-amber-600" />
                      Assessment Plan
                    </h4>
                    <div className="space-y-3">
                      {syllabusDesign.assessmentPlan.map((assessment, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{assessment.type}</span>
                            <span className="text-sm font-semibold text-primary-600">{assessment.weight}%</span>
                          </div>
                          <p className="text-sm text-gray-700">{assessment.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment & Rubrics Tab */}
          {activeTab === 'assessment' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment and Rubrics</h2>
                <p className="text-gray-600">
                  Design effective assessment strategies and comprehensive rubrics for student evaluation
                </p>
              </div>

              <button
                onClick={handleRubricDesign}
                disabled={isGenerating}
                className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating Rubric...
                  </>
                ) : (
                  <>
                    <ClipboardList className="h-5 w-5" />
                    Generate Assessment Rubric
                  </>
                )}
              </button>

              {rubricDesign && (
                <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Assessment Rubric</h3>
                    <span className="text-sm font-semibold text-gray-600">
                      Total Points: {rubricDesign.totalPoints}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {rubricDesign.criteria.map((criterion, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6">
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-1">{criterion.name}</h4>
                          <p className="text-sm text-gray-600">{criterion.description}</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-3 font-semibold text-gray-700">Level</th>
                                <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                                <th className="text-right py-2 px-3 font-semibold text-gray-700">Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {criterion.levels.map((level, lIdx) => (
                                <tr key={lIdx} className="border-b border-gray-100">
                                  <td className="py-2 px-3 font-medium text-gray-900">{level.level}</td>
                                  <td className="py-2 px-3 text-gray-700">{level.description}</td>
                                  <td className="py-2 px-3 text-right font-semibold text-primary-600">
                                    {level.points}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Digital & AI Tools Tab */}
          {activeTab === 'digital' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Creating Teaching Materials with Digital Literacy and AI
                </h2>
                <p className="text-gray-600">
                  Leverage digital tools and artificial intelligence to create engaging teaching materials
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { type: 'Interactive Presentations', icon: Presentation },
                  { type: 'Video Lessons', icon: Video },
                  { type: 'Digital Worksheets', icon: FileText },
                  { type: 'Online Quizzes', icon: CheckSquare },
                  { type: 'Infographics', icon: Layout },
                  { type: 'Interactive Simulations', icon: Cpu },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDigitalMaterial(item.type)}
                      disabled={isGenerating}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.type}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {digitalMaterial && (
                <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {digitalMaterial.type} with AI Integration
                    </h3>
                    <p className="text-gray-700 mb-4">{digitalMaterial.description}</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Integration Strategy
                    </h4>
                    <p className="text-sm text-gray-700">{digitalMaterial.aiIntegration}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-600" />
                      Implementation Steps
                    </h4>
                    <ol className="space-y-3">
                      {digitalMaterial.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-gray-700 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      Examples
                    </h4>
                    <ul className="space-y-2">
                      {digitalMaterial.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student-Centered Methods Tab */}
          {activeTab === 'student-centered' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Student-Centered Teaching Methods</h2>
                <p className="text-gray-600">
                  Explore methods that put students at the center of the learning process
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  'Project-Based Learning',
                  'Inquiry-Based Learning',
                  'Problem-Based Learning',
                  'Collaborative Learning',
                  'Flipped Classroom',
                  'Self-Directed Learning',
                  'Peer Teaching',
                  'Case Study Method',
                  'Role-Playing',
                ].map((method) => (
                  <button
                    key={method}
                    onClick={() => handleStudentCenteredMethod(method)}
                    disabled={isGenerating}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition text-left disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">{method}</span>
                    </div>
                  </button>
                ))}
              </div>

              {studentCenteredMethod && (
                <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{studentCenteredMethod.method}</h3>
                    <p className="text-gray-700">{studentCenteredMethod.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Benefits
                      </h4>
                      <ul className="space-y-2">
                        {studentCenteredMethod.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Challenges
                      </h4>
                      <ul className="space-y-2">
                        {studentCenteredMethod.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-amber-600 mt-1">⚠</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-600" />
                      Implementation Steps
                    </h4>
                    <ol className="space-y-3">
                      {studentCenteredMethod.implementation.map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-gray-700 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-purple-600" />
                      Examples
                    </h4>
                    <ul className="space-y-2">
                      {studentCenteredMethod.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat with Your Academic Development Coach</h2>
                <p className="text-gray-600">
                  Ask questions about syllabus design, assessment, digital tools, AI integration, or student-centered methods
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h3>
                <p className="text-gray-600 mb-6">
                  Ask me anything about UNEC's Academic Development program, pedagogical methods, or teaching innovation
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'How do I design an effective syllabus?',
                    'What are best practices for rubric design?',
                    'How can I integrate AI into my teaching materials?',
                    'What student-centered methods work best?',
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm hover:bg-primary-100 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UNECAcademicDevelopment



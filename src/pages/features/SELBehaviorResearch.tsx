import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getSectionItemBySlug } from '../../features/learningHub'
import type { LearningHubSectionItem } from '../../features/learningHub/types'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Lightbulb,
  Target,
  Star,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Eye,
  Zap,
  CheckCircle2,
  Heart,
  Users,
  MessageCircle,
  Shield,
  Circle,
} from 'lucide-react'

interface RestorativePractice {
  practice: string
  description: string
  steps: string[]
  benefits: string[]
  examples: string[]
}

interface SELCompetency {
  competency: string
  description: string
  indicators: string[]
  classroomStrategies: string[]
  researchEvidence: string
}

const SEL_SLUG = 'sel-behavior-research'

function SELBehaviorResearchInner() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'restorative' | 'sel' | 'implementation' | 'tools'>('overview')

  const restorativePractices: RestorativePractice[] = [
    {
      practice: 'Restorative Circles',
      description: 'Structured dialogue process where participants sit in a circle and share thoughts, feelings, and perspectives.',
      steps: [
        'Set agreements for respectful participation',
        'Use a talking piece to ensure everyone has a voice',
        'Pose questions that promote reflection and understanding',
        'Listen actively without judgment',
        'Focus on understanding, not blame',
      ],
      benefits: [
        'Builds community and trust',
        'Develops empathy and perspective-taking',
        'Prevents conflicts before they escalate',
        'Creates safe space for expression',
        'Strengthens relationships',
      ],
      examples: [
        'Morning check-in circles',
        'Conflict resolution circles',
        'Celebration circles',
        'Problem-solving circles',
      ],
    },
    {
      practice: 'Restorative Conversations',
      description: 'One-on-one or small group conversations that address harm and repair relationships.',
      steps: [
        'Create a safe, private space',
        'Ask what happened (not why)',
        'Explore who was affected and how',
        'Identify needs and obligations',
        'Agree on how to make things right',
      ],
      benefits: [
        'Addresses root causes of behavior',
        'Repairs relationships',
        'Teaches accountability',
        'Prevents future incidents',
        'Maintains dignity for all involved',
      ],
      examples: [
        'After a conflict between students',
        'When a student disrupts class',
        'Following a bullying incident',
        'When harm has occurred',
      ],
    },
    {
      practice: 'Restorative Conferences',
      description: 'Formal process bringing together all affected parties to address serious incidents.',
      steps: [
        'Prepare all participants',
        'Create safe, structured environment',
        'Facilitate dialogue about the incident',
        'Identify impacts and needs',
        'Develop agreement for moving forward',
        'Follow up to ensure agreement is kept',
      ],
      benefits: [
        'Addresses serious incidents comprehensively',
        'Involves all stakeholders',
        'Creates lasting solutions',
        'Builds understanding and empathy',
        'Reduces repeat offenses',
      ],
      examples: [
        'Serious conflicts between students',
        'Incidents involving multiple students',
        'Harm affecting classroom community',
        'Repeated behavioral issues',
      ],
    },
  ]

  const selCompetencies: SELCompetency[] = [
    {
      competency: 'Self-Awareness',
      description: 'The ability to recognize one\'s own emotions, thoughts, and values and how they influence behavior.',
      indicators: [
        'Identifies emotions accurately',
        'Recognizes strengths and limitations',
        'Demonstrates self-confidence',
        'Shows sense of purpose',
      ],
      classroomStrategies: [
        'Emotion check-ins and mood meters',
        'Reflection journals',
        'Strengths-based activities',
        'Goal-setting exercises',
      ],
      researchEvidence: 'Students with strong self-awareness show better academic performance and social relationships.',
    },
    {
      competency: 'Self-Management',
      description: 'The ability to regulate emotions, thoughts, and behaviors in different situations.',
      indicators: [
        'Manages stress effectively',
        'Controls impulses',
        'Sets and works toward goals',
        'Demonstrates self-discipline',
      ],
      classroomStrategies: [
        'Mindfulness and breathing exercises',
        'Calm-down strategies',
        'Self-monitoring tools',
        'Progress tracking',
      ],
      researchEvidence: 'Self-management skills predict academic success and reduce behavioral problems.',
    },
    {
      competency: 'Social Awareness',
      description: 'The ability to understand and empathize with others from diverse backgrounds.',
      indicators: [
        'Shows empathy for others',
        'Recognizes social cues',
        'Appreciates diversity',
        'Understands social norms',
      ],
      classroomStrategies: [
        'Perspective-taking activities',
        'Cultural awareness lessons',
        'Community service projects',
        'Literature with diverse characters',
      ],
      researchEvidence: 'Social awareness correlates with positive peer relationships and reduced bullying.',
    },
    {
      competency: 'Relationship Skills',
      description: 'The ability to establish and maintain healthy relationships with diverse individuals.',
      indicators: [
        'Communicates clearly',
        'Listens actively',
        'Cooperates with others',
        'Resolves conflicts constructively',
      ],
      classroomStrategies: [
        'Collaborative projects',
        'Peer mediation training',
        'Communication practice',
        'Team-building activities',
      ],
      researchEvidence: 'Strong relationship skills lead to better academic collaboration and social support.',
    },
    {
      competency: 'Responsible Decision-Making',
      description: 'The ability to make constructive choices about personal behavior and social interactions.',
      indicators: [
        'Evaluates consequences',
        'Considers ethical standards',
        'Makes responsible choices',
        'Solves problems effectively',
      ],
      classroomStrategies: [
        'Problem-solving frameworks',
        'Ethical dilemma discussions',
        'Decision-making models',
        'Consequence mapping',
      ],
      researchEvidence: 'Responsible decision-making reduces risk behaviors and improves academic outcomes.',
    },
  ]

  const researchEvidence = [
    {
      finding: 'SEL programs improve academic outcomes',
      source: 'CASEL (2020)',
      evidence: 'Students participating in SEL programs show an 11 percentile-point gain in academic achievement.',
      practicalTip: 'Integrate SEL into academic instruction, don\'t treat it as separate',
    },
    {
      finding: 'Restorative practices reduce suspensions',
      source: 'Gregory et al. (2018)',
      evidence: 'Schools implementing restorative practices see 30-50% reductions in suspension rates.',
      practicalTip: 'Focus on relationship-building and community, not just discipline',
    },
    {
      finding: 'SEL skills are teachable',
      source: 'Durlak et al. (2011)',
      evidence: 'SEL skills can be taught and learned through explicit instruction and practice.',
      practicalTip: 'Teach SEL skills directly, don\'t assume students will learn them naturally',
    },
    {
      finding: 'Teacher-student relationships matter',
      source: 'Cornelius-White (2007)',
      evidence: 'Positive teacher-student relationships have effect sizes of 0.72 on student achievement.',
      practicalTip: 'Invest time in building relationships with all students',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Research Insight
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">SEL & Behavior</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    8 min read
                  </span>
                </div>
                <h1 className="text-3xl font-bold">SEL & Behavior: Restorative Practices</h1>
                <p className="mt-2 text-pink-100">
                  Evidence-backed approaches to building classroom community and addressing conflicts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 w-4" />
                <span>Relationship-Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 w-4" />
                <span>High Impact</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Sections</h3>
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'restorative', label: 'Restorative Practices', icon: Users },
                { id: 'sel', label: 'SEL Competencies', icon: Heart },
                { id: 'implementation', label: 'Implementation', icon: Zap },
                { id: 'tools', label: 'Tools & Resources', icon: FileText },
              ].map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-pink-50 border-2 border-pink-300 text-pink-900'
                        : 'border-2 border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Restorative Practices?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Restorative practices are a framework for building community, resolving conflicts, and addressing harm 
                    through dialogue and relationship-building. Unlike punitive approaches that focus on punishment, 
                    restorative practices focus on understanding, accountability, and repairing relationships.
                  </p>
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Principles</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Relationships First:</strong> Strong relationships prevent and resolve conflicts</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Address Harm:</strong> When harm occurs, focus on repairing relationships, not punishment</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Involve All Affected:</strong> Include everyone impacted by an incident in the resolution process</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Build Community:</strong> Create opportunities for connection and belonging</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">Punitive Approach</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Focuses on rule-breaking</li>
                        <li>• Assigns blame and punishment</li>
                        <li>• Excludes those affected</li>
                        <li>• Creates fear and resentment</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">Restorative Approach</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Focuses on harm and relationships</li>
                        <li>• Promotes accountability and repair</li>
                        <li>• Includes all affected parties</li>
                        <li>• Builds understanding and connection</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {researchEvidence.map((evidence, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">{evidence.finding}</h4>
                          <Star className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2 italic">{evidence.source}</p>
                        <p className="text-sm text-gray-700 mb-3">{evidence.evidence}</p>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 mb-1">Practical Tip:</p>
                          <p className="text-xs text-gray-700">{evidence.practicalTip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Restorative Practices Section */}
            {activeSection === 'restorative' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Restorative Practices</h2>
                  <p className="text-gray-700 mb-6">
                    These practices provide structured ways to build community, prevent conflicts, and address harm when it occurs.
                  </p>
                  <div className="space-y-4">
                    {restorativePractices.map((practice, idx) => (
                      <div key={idx} className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{practice.practice}</h3>
                        <p className="text-gray-700 mb-4">{practice.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Implementation Steps:</h4>
                            <ol className="space-y-2">
                              {practice.steps.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                                    {stepIdx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits:</h4>
                            <ul className="space-y-2">
                              {practice.benefits.map((benefit, benIdx) => (
                                <li key={benIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-pink-100">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">When to Use:</h4>
                          <div className="flex flex-wrap gap-2">
                            {practice.examples.map((example, exIdx) => (
                              <span key={exIdx} className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEL Competencies Section */}
            {activeSection === 'sel' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Social-Emotional Learning Competencies</h2>
                  <p className="text-gray-700 mb-6">
                    CASEL's framework identifies five core SEL competencies that support student success in school and life.
                  </p>
                  <div className="space-y-4">
                    {selCompetencies.map((competency, idx) => (
                      <div key={idx} className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{competency.competency}</h3>
                        <p className="text-gray-700 mb-4">{competency.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Indicators:</h4>
                            <ul className="space-y-1">
                              {competency.indicators.map((indicator, indIdx) => (
                                <li key={indIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <Circle className="h-3 w-3 text-pink-600 mt-1 flex-shrink-0 fill-current" />
                                  <span>{indicator}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Classroom Strategies:</h4>
                            <ul className="space-y-1">
                              {competency.classroomStrategies.map((strategy, stratIdx) => (
                                <li key={stratIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <Zap className="h-3 w-3 text-pink-600 mt-1 flex-shrink-0" />
                                  <span>{strategy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-pink-100">
                          <p className="text-sm font-semibold text-gray-900 mb-1">Research Evidence:</p>
                          <p className="text-sm text-gray-700">{competency.researchEvidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Implementation Section */}
            {activeSection === 'implementation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Guide</h2>
                  <p className="text-gray-700 mb-6">
                    Successfully implementing restorative practices and SEL requires a shift in mindset and consistent practice.
                  </p>
                  
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">1. Build Relationships First</h4>
                        <p className="text-sm text-gray-700">
                          Start with community-building activities. Strong relationships prevent conflicts and make restorative practices more effective.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">2. Start with Proactive Practices</h4>
                        <p className="text-sm text-gray-700">
                          Begin with community circles and relationship-building before moving to conflict resolution. Prevention is easier than repair.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">3. Model Restorative Language</h4>
                        <p className="text-sm text-gray-700">
                          Use "I" statements, ask "what happened?" instead of "why did you do that?", and focus on impact rather than intent.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">4. Integrate SEL into Academics</h4>
                        <p className="text-sm text-gray-700">
                          Don't treat SEL as separate. Embed social-emotional learning into your regular instruction and activities.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-pink-100">
                        <h4 className="font-semibold text-gray-900 mb-2">5. Be Patient and Consistent</h4>
                        <p className="text-sm text-gray-700">
                          Building a restorative culture takes time. Consistency is key - use practices regularly, not just when problems arise.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Restorative Language Examples</h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Instead of:</p>
                        <p className="text-sm text-red-600 italic mb-2">"Why did you do that?"</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Try:</p>
                        <p className="text-sm text-green-600">"What happened?" or "Help me understand what led to this."</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Instead of:</p>
                        <p className="text-sm text-red-600 italic mb-2">"You need to apologize."</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Try:</p>
                        <p className="text-sm text-green-600">"How do you think [person] felt? What can we do to make things right?"</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Instead of:</p>
                        <p className="text-sm text-red-600 italic mb-2">"That was wrong."</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Try:</p>
                        <p className="text-sm text-green-600">"Who was affected by what happened? How were they affected?"</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Action Steps</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <span>Start each day with a brief check-in circle to build community</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <span>Teach students one SEL skill explicitly each week</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <span>Use restorative conversations instead of traditional discipline when possible</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <span>Create classroom agreements together with students</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        <span>Reflect regularly on what's working and what needs adjustment</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Tools & Resources Section */}
            {activeSection === 'tools' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tools & Resources</h2>
                  <p className="text-gray-700 mb-6">
                    Practical tools and frameworks to support implementation of restorative practices and SEL in your classroom.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Circle Questions</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• "What's one thing you're grateful for today?"</li>
                        <li>• "What's a challenge you're facing?"</li>
                        <li>• "How can we support each other this week?"</li>
                        <li>• "What did you learn about yourself today?"</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Restorative Questions</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• "What happened?"</li>
                        <li>• "What were you thinking at the time?"</li>
                        <li>• "Who has been affected?"</li>
                        <li>• "What needs to happen to make things right?"</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEL Integration Ideas</h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Morning Meetings</h4>
                        <p className="text-sm text-gray-700">Start each day with a brief check-in that builds SEL skills and community.</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Academic Integration</h4>
                        <p className="text-sm text-gray-700">Use literature, history, and science to explore emotions, relationships, and decision-making.</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Conflict Resolution</h4>
                        <p className="text-sm text-gray-700">Teach students to use "I" statements and active listening when conflicts arise.</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Reflection Activities</h4>
                        <p className="text-sm text-gray-700">Build in time for students to reflect on their learning, emotions, and relationships.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SELBehaviorResearchView({ item }: { item: LearningHubSectionItem }) {
  if (!item.researchInsightContent) return null
  return <SELBehaviorResearchInner />
}

export default function SELBehaviorResearch() {
  const row = getSectionItemBySlug('research-insights-library', SEL_SLUG)
  if (!row?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <SELBehaviorResearchView item={row} />
}


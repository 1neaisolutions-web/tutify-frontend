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
  Settings,
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

interface DesignStep {
  step: string
  description: string
  activities: string[]
  questions: string[]
}

interface EngineeringChallenge {
  title: string
  problem: string
  constraints: string[]
  criteria: string[]
  gradeLevel: string
  subject: string
}

const EngineeringDesignModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showChallengeGenerator, setShowChallengeGenerator] = useState(false)
  const [showChallengeDesigner, setShowChallengeDesigner] = useState(false)
  const [challengeData, setChallengeData] = useState<EngineeringChallenge>({
    title: '',
    problem: '',
    constraints: [],
    criteria: [],
    gradeLevel: '',
    subject: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'design-cycle',
      type: 'video',
      title: 'Engineering Design Cycle Explained',
      duration: '20 min',
      points: 20,
      completed: false,
      content: {
        description: 'Master the engineering design cycle and learn how to facilitate authentic problem-solving experiences.',
        keyPoints: [
          'The design cycle: Ask, Imagine, Plan, Create, Improve',
          'Iteration is essential to engineering design',
          'Real-world problems drive authentic learning',
          'Failure is a learning opportunity',
          'Students should document their design process',
        ],
      },
    },
    {
      id: 'authentic-challenges',
      type: 'reading',
      title: 'Authentic Engineering Challenges',
      points: 15,
      completed: false,
      content: {
        article: `# Authentic Engineering Challenges

## What Makes a Challenge Authentic?

Authentic engineering challenges connect to real-world problems that students can relate to and solve. They should:

### Characteristics of Authentic Challenges

**Real-World Relevance**: Problems should connect to students' lives, communities, or current events.

**Open-Ended**: Multiple solutions are possible, encouraging creativity and critical thinking.

**Constraints**: Real engineering involves constraints (budget, materials, time, regulations).

**Stakeholders**: Students consider who will benefit from their solution.

**Iterative Process**: Solutions are refined through testing and improvement.

### Examples of Authentic Challenges

**Elementary**: Design a solution to reduce lunch waste in our school
**Middle School**: Create a water filtration system for a community in need
**High School**: Design a renewable energy solution for our school building

### Facilitating Authentic Challenges

- Start with a compelling problem or need
- Allow students to research and understand the problem deeply
- Provide constraints that mirror real-world limitations
- Encourage multiple solution approaches
- Support iterative testing and improvement
- Connect solutions to real-world impact`,
        keyTakeaways: [
          'Authentic challenges connect to real-world problems',
          'Constraints make challenges more realistic and engaging',
          'Multiple solutions encourage creativity',
          'Iteration is key to successful engineering design',
        ],
      },
    },
    {
      id: 'challenge-generator',
      type: 'interactive',
      title: 'Challenge Generator Tool',
      points: 25,
      completed: false,
      content: {
        description: 'Generate authentic engineering design challenges tailored to your grade level and subject.',
        steps: [
          'Select grade level and subject',
          'Choose problem context',
          'Define constraints',
          'Set success criteria',
          'Generate challenge',
        ],
      },
    },
    {
      id: 'design-thinking',
      type: 'video',
      title: 'Facilitating Design Thinking',
      duration: '25 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn strategies for facilitating design thinking and supporting student-driven problem-solving.',
        keyPoints: [
          'Empathize with users and stakeholders',
          'Define the problem clearly',
          'Ideate multiple solutions',
          'Prototype and test',
          'Iterate based on feedback',
        ],
      },
    },
    {
      id: 'challenge-project',
      type: 'project',
      title: 'Design Your Engineering Challenge',
      points: 20,
      completed: false,
      content: {
        description: 'Create a complete engineering design challenge with rubrics and assessment tools.',
        requirements: [
          'Define an authentic problem',
          'Identify constraints and criteria',
          'Design the challenge structure',
          'Create assessment rubrics',
          'Plan facilitation strategies',
        ],
      },
    },
  ]

  const designCycleSteps: DesignStep[] = [
    {
      step: 'Ask',
      description: 'Identify the problem and understand the needs',
      activities: [
        'Research the problem',
        'Interview stakeholders',
        'Define success criteria',
        'Identify constraints',
      ],
      questions: [
        'What is the problem we need to solve?',
        'Who is affected by this problem?',
        'What are the constraints?',
        'What would success look like?',
      ],
    },
    {
      step: 'Imagine',
      description: 'Brainstorm multiple possible solutions',
      activities: [
        'Generate many ideas',
        'Consider different approaches',
        'Build on others\' ideas',
        'Think creatively',
      ],
      questions: [
        'What are all possible solutions?',
        'How might we approach this differently?',
        'What if we had unlimited resources?',
        'What can we learn from nature?',
      ],
    },
    {
      step: 'Plan',
      description: 'Select and develop the best solution',
      activities: [
        'Compare solutions',
        'Create detailed plans',
        'List materials needed',
        'Plan testing procedures',
      ],
      questions: [
        'Which solution best meets the criteria?',
        'What materials do we need?',
        'How will we test our solution?',
        'What could go wrong?',
      ],
    },
    {
      step: 'Create',
      description: 'Build and test the solution',
      activities: [
        'Build the prototype',
        'Test the solution',
        'Document the process',
        'Collect data',
      ],
      questions: [
        'Does it work as expected?',
        'What problems did we encounter?',
        'How can we improve it?',
        'Does it meet the criteria?',
      ],
    },
    {
      step: 'Improve',
      description: 'Refine and optimize the solution',
      activities: [
        'Analyze test results',
        'Identify improvements',
        'Redesign and retest',
        'Document final solution',
      ],
      questions: [
        'What worked well?',
        'What needs improvement?',
        'How can we make it better?',
        'What did we learn?',
      ],
    },
  ]

  const challengeExamples: EngineeringChallenge[] = [
    {
      title: 'Water Filtration Challenge',
      problem: 'Design a water filtration system for communities without clean water access',
      constraints: [
        'Must use only common materials',
        'Budget limit: $10',
        'Must filter at least 1 liter in 5 minutes',
        'Must be portable',
      ],
      criteria: [
        'Effectiveness of filtration',
        'Cost efficiency',
        'Ease of use',
        'Durability',
      ],
      gradeLevel: 'Middle School',
      subject: 'Science',
    },
    {
      title: 'School Lunch Waste Reduction',
      problem: 'Reduce food waste in school cafeteria',
      constraints: [
        'Must be implementable by students',
        'No additional cost to school',
        'Must engage all students',
      ],
      criteria: [
        'Reduction in waste',
        'Student engagement',
        'Sustainability',
        'Ease of implementation',
      ],
      gradeLevel: 'Elementary',
      subject: 'Science/Social Studies',
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
        if (!completedModules.includes('engineering-design')) {
          completedModules.push('engineering-design')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('engineering-design') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const handleChallengeGenerate = () => {
    setTimeout(() => {
      alert('Engineering challenge generated! Check your challenge designer.')
      setShowChallengeGenerator(false)
      setShowChallengeDesigner(true)
    }, 1500)
  }

  const handleChallengeSubmit = () => {
    alert('Engineering challenge saved! You can now implement this in your classroom.')
    setShowChallengeDesigner(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 2
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
                <h1 className="text-3xl font-bold">Engineering Design Process & Real-World Problem Solving</h1>
                <p className="mt-2 text-orange-100">
                  Learn to facilitate authentic engineering design challenges that engage students in solving real-world problems
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
                      isActive ? 'bg-orange-50 border-2 border-orange-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-orange-900' : 'text-gray-900'}`}>
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
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Design Cycle Steps */}
                {currentLessonData.id === 'design-cycle' && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">The Engineering Design Cycle</h3>
                    <div className="space-y-4">
                      {designCycleSteps.map((step, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-5 border border-orange-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <h4 className="text-base font-bold text-gray-900">{step.step}</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{step.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Activities:</p>
                              <ul className="space-y-1">
                                {step.activities.map((activity, aIdx) => (
                                  <li key={aIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                    <ArrowRight className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Guiding Questions:</p>
                              <ul className="space-y-1">
                                {step.questions.map((question, qIdx) => (
                                  <li key={qIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                    <Lightbulb className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <span>{question}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
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

            {/* Interactive Challenge Generator */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'challenge-generator' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showChallengeGenerator ? (
                    <button
                      onClick={() => setShowChallengeGenerator(true)}
                      className="w-full px-6 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Challenge Generator
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineering Challenge Generator</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={challengeData.gradeLevel}
                              onChange={(e) => setChallengeData({ ...challengeData, gradeLevel: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            >
                              <option value="">Select grade</option>
                              <option value="Elementary">Elementary (K-5)</option>
                              <option value="Middle School">Middle School (6-8)</option>
                              <option value="High School">High School (9-12)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Area</label>
                            <select
                              value={challengeData.subject}
                              onChange={(e) => setChallengeData({ ...challengeData, subject: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            >
                              <option value="">Select subject</option>
                              <option value="Science">Science</option>
                              <option value="Math">Math</option>
                              <option value="Technology">Technology</option>
                              <option value="Engineering">Engineering</option>
                              <option value="Cross-curricular">Cross-curricular</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
                          <textarea
                            value={challengeData.problem}
                            onChange={(e) => setChallengeData({ ...challengeData, problem: e.target.value })}
                            rows={3}
                            placeholder="Describe the real-world problem students need to solve..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleChallengeGenerate}
                            disabled={!challengeData.gradeLevel || !challengeData.problem}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Generate Challenge
                          </button>
                          <button
                            onClick={() => setShowChallengeGenerator(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Challenge Examples */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Engineering Challenges</h3>
                  <div className="space-y-4">
                    {challengeExamples.map((challenge, idx) => (
                      <div key={idx} className="bg-orange-50 rounded-lg p-5 border border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-bold text-gray-900">{challenge.title}</h4>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-white text-orange-700 text-xs font-semibold">
                              {challenge.gradeLevel}
                            </span>
                            <span className="px-2 py-1 rounded bg-white text-orange-700 text-xs font-semibold">
                              {challenge.subject}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">{challenge.problem}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Constraints:</p>
                            <ul className="space-y-1">
                              {challenge.constraints.map((constraint, cIdx) => (
                                <li key={cIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <Settings className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span>{constraint}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Success Criteria:</p>
                            <ul className="space-y-1">
                              {challenge.criteria.map((criterion, crIdx) => (
                                <li key={crIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <Target className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{criterion}</span>
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
                  
                  {!showChallengeDesigner ? (
                    <button
                      onClick={() => setShowChallengeDesigner(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Challenge Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineering Challenge Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Title</label>
                          <input
                            type="text"
                            value={challengeData.title}
                            onChange={(e) => setChallengeData({ ...challengeData, title: e.target.value })}
                            placeholder="e.g., Water Filtration Challenge"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
                          <textarea
                            value={challengeData.problem}
                            onChange={(e) => setChallengeData({ ...challengeData, problem: e.target.value })}
                            rows={3}
                            placeholder="Describe the problem students need to solve..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Constraints (one per line)</label>
                          <textarea
                            value={challengeData.constraints.join('\n')}
                            onChange={(e) => setChallengeData({ ...challengeData, constraints: e.target.value.split('\n').filter(c => c.trim()) })}
                            rows={4}
                            placeholder="Enter constraints, one per line..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Success Criteria (one per line)</label>
                          <textarea
                            value={challengeData.criteria.join('\n')}
                            onChange={(e) => setChallengeData({ ...challengeData, criteria: e.target.value.split('\n').filter(c => c.trim()) })}
                            rows={4}
                            placeholder="Enter success criteria, one per line..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleChallengeSubmit}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Save Challenge
                          </button>
                          <button
                            onClick={() => setShowChallengeDesigner(false)}
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
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white text-sm font-semibold rounded-full hover:bg-orange-700 transition"
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
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Excellent work!
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

export default EngineeringDesignModule

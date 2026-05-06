import { useState } from 'react'
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
  Target,
  Trophy,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Eye,
  Map,
  Compass,
  Sword,
  Shield,
  Crown,
  Scroll,
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

interface QuestElement {
  element: string
  description: string
  examples: string[]
  tips: string[]
}

const QuestBasedLearning = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showQuestBuilder, setShowQuestBuilder] = useState(false)
  const [questDesign, setQuestDesign] = useState({
    title: '',
    narrative: '',
    objectives: '',
    challenges: '',
    rewards: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'quest-foundations',
      type: 'video',
      title: 'Building Learning Quests',
      duration: '20 min',
      points: 25,
      completed: false,
      content: {
        description: 'Learn how to transform your curriculum into engaging quests that guide students through meaningful learning journeys.',
        keyPoints: [
          'Quests provide narrative structure to learning',
          'Each quest should have clear objectives and challenges',
          'Progressive difficulty maintains engagement',
          'Student choice increases motivation',
          'Quests connect learning to real-world contexts',
        ],
      },
    },
    {
      id: 'narrative-design',
      type: 'reading',
      title: 'Storytelling in Education',
      points: 20,
      completed: false,
      content: {
        article: `# Storytelling in Education

## The Power of Narrative

Stories have been used to teach and engage for thousands of years. When we wrap learning in narrative, we tap into fundamental human psychology that makes information memorable and meaningful.

### Why Stories Work

**Emotional Connection**: Stories create emotional engagement that facts alone cannot achieve.

**Context**: Narrative provides context that helps students understand why learning matters.

**Memory**: Information embedded in stories is more easily remembered.

**Motivation**: Stories create desire to see what happens next, driving continued engagement.

### Quest Narrative Elements

1. **Setting**: Where does the quest take place? (real-world or fictional)
2. **Characters**: Who are the students in the story? (explorers, scientists, heroes)
3. **Challenge**: What problem needs solving?
4. **Journey**: What steps must be taken?
5. **Resolution**: What is achieved or learned?`,
        keyTakeaways: [
          'Narrative makes learning memorable',
          'Students become characters in their own learning story',
          'Stories provide context and meaning',
          'Quests create natural progression through content',
        ],
      },
    },
    {
      id: 'quest-builder',
      type: 'interactive',
      title: 'Quest Builder Tool',
      points: 30,
      completed: false,
      content: {
        description: 'Design your own learning quest with our interactive builder.',
        steps: [
          'Define quest narrative',
          'Set learning objectives',
          'Design challenges',
          'Plan progression',
          'Create rewards',
        ],
      },
    },
    {
      id: 'choice-agency',
      type: 'reading',
      title: 'Choice and Agency in Quests',
      points: 15,
      completed: false,
      content: {
        article: `# Choice and Agency in Quests

## Student Agency

Agency refers to students' ability to make meaningful choices about their learning. In quest-based learning, agency is built through:

### Multiple Pathways
Offer different ways to complete quests:
- Different topics to explore
- Various methods of investigation
- Multiple ways to demonstrate learning

### Meaningful Choices
Choices should:
- Impact the learning experience
- Allow students to pursue interests
- Provide different challenges
- Lead to different outcomes

### Progressive Autonomy
Start with guided choices, gradually increase student autonomy as they become more skilled.`,
      },
    },
    {
      id: 'template',
      type: 'template',
      title: 'Quest Template Library',
      points: 20,
      completed: false,
      content: {
        description: 'Access ready-to-use quest templates for various subjects and grade levels.',
        sections: [
          'Quest Narrative Template',
          'Challenge Design Framework',
          'Progression Map',
          'Reward System',
          'Assessment Integration',
        ],
      },
    },
  ]

  const questElements: QuestElement[] = [
    {
      element: 'Narrative Hook',
      description: 'The opening story that draws students in',
      examples: [
        'You are an archaeologist discovering an ancient civilization',
        'A mysterious problem threatens your community',
        'You must solve a series of puzzles to unlock knowledge',
      ],
      tips: [
        'Make it relevant to students\' interests',
        'Create a sense of urgency or mystery',
        'Connect to real-world contexts',
      ],
    },
    {
      element: 'Clear Objectives',
      description: 'What students will learn and achieve',
      examples: [
        'Master 5 key concepts about ecosystems',
        'Design a solution to reduce waste',
        'Create a presentation on historical events',
      ],
      tips: [
        'Align with learning standards',
        'Make objectives clear and measurable',
        'Show how objectives connect to the narrative',
      ],
    },
    {
      element: 'Progressive Challenges',
      description: 'Increasingly difficult tasks that build skills',
      examples: [
        'Start with observation, move to analysis',
        'Begin with simple problems, advance to complex',
        'Progress from individual to collaborative tasks',
      ],
      tips: [
        'Scaffold difficulty appropriately',
        'Provide support for each challenge',
        'Celebrate completion of each challenge',
      ],
    },
    {
      element: 'Choices & Pathways',
      description: 'Options that allow student agency',
      examples: [
        'Choose which topic to investigate first',
        'Select investigation method',
        'Decide how to present findings',
      ],
      tips: [
        'Offer meaningful choices',
        'Ensure all pathways lead to learning',
        'Respect student preferences',
      ],
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      setProgress(((completedLessons.length + 1) / lessons.length) * 100)
    }
  }

  const handleQuestSubmit = () => {
    alert('Quest design saved! You can now implement this quest in your classroom.')
    setShowQuestBuilder(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/student-engagement-path')}
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
                </div>
                <h1 className="text-3xl font-bold">Quest-Based Learning Design</h1>
                <p className="mt-2 text-purple-100">
                  Transform your curriculum into engaging quests and missions
                </p>
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
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isActive = idx === currentLesson
                const isCompleted = completedLessons.includes(lesson.id)
                const Icon = lesson.type === 'video' ? Video : lesson.type === 'reading' ? BookOpen : lesson.type === 'interactive' ? Zap : FileText

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive ? 'bg-purple-50 border-2 border-purple-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-purple-900' : 'text-gray-900'}`}>
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

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
            </div>

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
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentLessonData.type === 'reading' && (
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.article?.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') || '' }} />
              </div>
            )}

            {currentLessonData.type === 'interactive' && (
              <div className="space-y-6">
                {!showQuestBuilder ? (
                  <button
                    onClick={() => setShowQuestBuilder(true)}
                    className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Launch Quest Builder
                  </button>
                ) : (
                  <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quest Builder</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quest Title</label>
                        <input
                          type="text"
                          value={questDesign.title}
                          onChange={(e) => setQuestDesign({ ...questDesign, title: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Narrative Story</label>
                        <textarea
                          value={questDesign.narrative}
                          onChange={(e) => setQuestDesign({ ...questDesign, narrative: e.target.value })}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
                        <textarea
                          value={questDesign.objectives}
                          onChange={(e) => setQuestDesign({ ...questDesign, objectives: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleQuestSubmit}
                          className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                        >
                          Save Quest
                        </button>
                        <button
                          onClick={() => setShowQuestBuilder(false)}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quest Elements</h3>
                  <div className="space-y-4">
                    {questElements.map((element, idx) => (
                      <div key={idx} className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{element.element}</h4>
                        <p className="text-sm text-gray-700 mb-3">{element.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">Examples:</p>
                            {element.examples.map((ex, exIdx) => (
                              <p key={exIdx} className="text-xs text-gray-700 bg-white rounded p-2 mb-1">{ex}</p>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">Tips:</p>
                            {element.tips.map((tip, tipIdx) => (
                              <p key={tipIdx} className="text-xs text-gray-700 bg-white rounded p-2 mb-1">{tip}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentLessonData.type === 'template' && (
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.sections.map((section: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Template
                </button>
              </div>
            )}

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
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition"
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

          {completedLessons.length === lessons.length && (
            <div className="mt-6 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <Trophy className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Module Complete!</h3>
              <button
                onClick={() => navigate('/learning-hub/student-engagement-path')}
                className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                Continue to Next Module
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestBasedLearning




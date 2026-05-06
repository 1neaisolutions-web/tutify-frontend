import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Circle,
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
  Award,
  Users,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Eye,
  MessageSquare,
  Settings,
  Maximize2,
  Volume2,
  Medal,
  Crown,
  Gift,
  TrendingDown,
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

interface BadgeDesign {
  name: string
  description: string
  criteria: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface LeaderboardConfig {
  type: 'individual' | 'team' | 'personal-best'
  updateFrequency: string
  displayOptions: string[]
  privacySettings: string
}

const PointsBadgesLeaderboards = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showBadgeDesigner, setShowBadgeDesigner] = useState(false)
  const [showLeaderboardConfig, setShowLeaderboardConfig] = useState(false)
  const [badgeDesign, setBadgeDesign] = useState<BadgeDesign>({
    name: '',
    description: '',
    criteria: '',
    icon: '',
    tier: 'bronze',
  })
  const [leaderboardConfig, setLeaderboardConfig] = useState<LeaderboardConfig>({
    type: 'individual',
    updateFrequency: 'daily',
    displayOptions: [],
    privacySettings: 'public',
  })

  const lessons: LessonContent[] = [
    {
      id: 'points-system',
      type: 'video',
      title: 'Designing Effective Point Systems',
      duration: '15 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn how to create point systems that motivate students without creating unhealthy competition or demotivating struggling learners.',
        keyPoints: [
          'Points should reflect learning, not just completion',
          'Use varied point values to show importance',
          'Allow point redemption for meaningful rewards',
          'Consider bonus points for effort and improvement',
          'Balance individual and team point systems',
        ],
        transcript: 'Welcome to Points, Badges & Leaderboards. In this module, you\'ll master the three most popular gamification elements...',
      },
    },
    {
      id: 'badge-design',
      type: 'reading',
      title: 'Badge Design Best Practices',
      points: 15,
      completed: false,
      content: {
        article: `# Badge Design Best Practices

## The Power of Badges

Badges serve as visual representations of achievement, providing students with tangible recognition for their accomplishments. When designed well, badges can significantly boost motivation and create a sense of accomplishment.

### Key Principles

**Meaningful Achievement**: Badges should represent genuine accomplishments, not just participation. Students should feel proud to earn them.

**Clear Criteria**: Students must understand exactly what they need to do to earn each badge. Ambiguity leads to frustration.

**Visual Appeal**: Well-designed badges are visually appealing and recognizable. They should be something students want to display.

**Progressive Difficulty**: Create badge tiers (bronze, silver, gold) that allow students to progress and feel continuous achievement.

### Badge Categories

1. **Skill Mastery Badges**: Recognize when students master specific skills or concepts
2. **Effort Badges**: Reward persistence, improvement, and hard work
3. **Collaboration Badges**: Celebrate teamwork and peer support
4. **Creativity Badges**: Recognize innovative thinking and unique solutions
5. **Growth Badges**: Acknowledge improvement over time

### Common Mistakes to Avoid

- Creating too many badges (dilutes their value)
- Making badges too easy to earn (loses meaning)
- Focusing only on high achievers (demotivates others)
- Using generic designs (lacks personalization)
- Not celebrating badge achievements publicly`,
        keyTakeaways: [
          'Badges should represent meaningful achievements',
          'Clear criteria are essential for student understanding',
          'Progressive tiers maintain long-term motivation',
          'Celebrate badge achievements to maximize impact',
        ],
      },
    },
    {
      id: 'badge-designer',
      type: 'interactive',
      title: 'Create Your Badge System',
      points: 25,
      completed: false,
      content: {
        description: 'Use our interactive badge designer to create a complete badge system for your classroom.',
        steps: [
          'Define badge categories',
          'Design individual badges',
          'Set earning criteria',
          'Create badge tiers',
          'Plan celebration strategies',
        ],
      },
    },
    {
      id: 'leaderboards',
      type: 'video',
      title: 'Leaderboard Management',
      duration: '18 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn how to use leaderboards effectively while avoiding common pitfalls that can demotivate students.',
        keyPoints: [
          'Use multiple leaderboards to avoid single-winner focus',
          'Consider team-based or personal best leaderboards',
          'Update frequently to maintain engagement',
          'Focus on growth, not just current standing',
          'Protect student privacy and self-esteem',
        ],
        transcript: 'Leaderboards can be powerful motivators, but they can also create unhealthy competition...',
      },
    },
    {
      id: 'template',
      type: 'template',
      title: 'Leaderboard Template',
      points: 20,
      completed: false,
      content: {
        description: 'Download ready-to-use templates for points systems, badges, and leaderboards.',
        sections: [
          'Point System Calculator',
          'Badge Design Templates',
          'Leaderboard Formats',
          'Reward Redemption System',
          'Progress Tracking Sheets',
        ],
      },
    },
  ]

  const pointSystemExamples = [
    {
      activity: 'Complete homework assignment',
      basePoints: 10,
      bonusPoints: '+5 for early submission, +3 for extra effort',
      rationale: 'Rewards completion while encouraging quality and timeliness',
    },
    {
      activity: 'Participate in class discussion',
      basePoints: 5,
      bonusPoints: '+2 for asking questions, +3 for helping peers',
      rationale: 'Encourages active participation and peer support',
    },
    {
      activity: 'Score 90%+ on assessment',
      basePoints: 20,
      bonusPoints: '+10 for perfect score, +5 for improvement',
      rationale: 'Recognizes achievement while rewarding growth',
    },
    {
      activity: 'Complete project',
      basePoints: 50,
      bonusPoints: '+15 for creativity, +10 for collaboration',
      rationale: 'Reflects the complexity and importance of projects',
    },
  ]

  const badgeExamples = [
    {
      name: 'Master Researcher',
      category: 'Skill Mastery',
      criteria: 'Successfully complete 5 research projects with citations',
      tier: 'gold',
      icon: '🔍',
    },
    {
      name: 'Collaboration Champion',
      category: 'Collaboration',
      criteria: 'Work effectively in 10 different team projects',
      tier: 'silver',
      icon: '🤝',
    },
    {
      name: 'Growth Mindset',
      category: 'Growth',
      criteria: 'Show improvement of 20%+ over 3 consecutive assessments',
      tier: 'gold',
      icon: '📈',
    },
    {
      name: 'Creative Thinker',
      category: 'Creativity',
      criteria: 'Submit 3 innovative solutions to problems',
      tier: 'bronze',
      icon: '💡',
    },
  ]

  const leaderboardTypes = [
    {
      type: 'Individual Leaderboard',
      description: 'Shows individual student rankings',
      pros: ['Clear competition', 'Easy to understand', 'Motivates high achievers'],
      cons: ['Can demotivate struggling students', 'Single winner focus', 'Privacy concerns'],
      bestFor: 'Confident students, competitive environments',
    },
    {
      type: 'Team Leaderboard',
      description: 'Ranks teams or groups instead of individuals',
      pros: ['Promotes collaboration', 'Reduces individual pressure', 'Builds community'],
      cons: ['Individual contributions may be hidden', 'Team dynamics can be complex'],
      bestFor: 'Group projects, collaborative learning',
    },
    {
      type: 'Personal Best Leaderboard',
      description: 'Students compete against their own previous scores',
      pros: ['Focuses on growth', 'Reduces comparison', 'Builds self-confidence'],
      cons: ['Less competitive element', 'Requires tracking individual progress'],
      bestFor: 'Struggling students, growth-focused classrooms',
    },
    {
      type: 'Category Leaderboards',
      description: 'Separate leaderboards for different skills or subjects',
      pros: ['Recognizes diverse strengths', 'More students can be "winners"', 'Reduces single-focus competition'],
      cons: ['More complex to manage', 'May dilute competition'],
      bestFor: 'Diverse classrooms, multiple subjects',
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      const newProgress = ((completedLessons.length + 1) / lessons.length) * 100
      setProgress(newProgress)
    }
  }

  const handleBadgeSubmit = () => {
    alert('Badge design saved! You can now implement this badge system in your classroom.')
    setShowBadgeDesigner(false)
  }

  const handleLeaderboardSubmit = () => {
    alert('Leaderboard configuration saved!')
    setShowLeaderboardConfig(false)
  }

  const currentLessonData = lessons[currentLesson] || lessons[0]
  const moduleProgress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0

  if (!currentLessonData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 2
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    60 min
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
                <h1 className="text-3xl font-bold">Points, Badges & Leaderboards</h1>
                <p className="mt-2 text-blue-100">
                  Master the most popular gamification elements and learn when and how to use them effectively
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
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lesson Navigation */}
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
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                        </div>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        )}
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
            {/* Lesson Header */}
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
                      {isPlaying ? (
                        <Pause className="h-10 w-10" />
                      ) : (
                        <Play className="h-10 w-10 ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-white text-xs">
                      <span>0:00</span>
                      <span>{currentLessonData.duration}</span>
                    </div>
                  </div>
                </div>

                {currentLessonData.content?.keyPoints && currentLessonData.content.keyPoints.length > 0 && (
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
                {currentLessonData.content?.article && (
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: (currentLessonData.content.article || '').replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') }} />
                  </div>
                )}

                {currentLessonData.content?.keyTakeaways && currentLessonData.content.keyTakeaways.length > 0 && (
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

            {/* Interactive Badge Designer */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'badge-designer' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  {currentLessonData.content?.description && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content?.description}</h3>
                  )}
                  
                  {!showBadgeDesigner ? (
                    <button
                      onClick={() => setShowBadgeDesigner(true)}
                      className="w-full px-6 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Badge Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-amber-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                          <input
                            type="text"
                            value={badgeDesign.name}
                            onChange={(e) => setBadgeDesign({ ...badgeDesign, name: e.target.value })}
                            placeholder="e.g., Master Researcher"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={badgeDesign.description}
                            onChange={(e) => setBadgeDesign({ ...badgeDesign, description: e.target.value })}
                            placeholder="What does this badge represent?"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Earning Criteria</label>
                          <textarea
                            value={badgeDesign.criteria}
                            onChange={(e) => setBadgeDesign({ ...badgeDesign, criteria: e.target.value })}
                            placeholder="What must students do to earn this badge?"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Badge Tier</label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tier) => (
                              <button
                                key={tier}
                                onClick={() => setBadgeDesign({ ...badgeDesign, tier })}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                  badgeDesign.tier === tier
                                    ? tier === 'bronze'
                                      ? 'bg-amber-600 text-white'
                                      : tier === 'silver'
                                      ? 'bg-gray-400 text-white'
                                      : tier === 'gold'
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleBadgeSubmit}
                            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                          >
                            Save Badge
                          </button>
                          <button
                            onClick={() => setShowBadgeDesigner(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badge Examples */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badgeExamples.map((badge, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{badge.icon}</span>
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">{badge.name}</h4>
                            <p className="text-xs text-gray-600">{badge.category}</p>
                          </div>
                          <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${
                            badge.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                            badge.tier === 'silver' ? 'bg-gray-100 text-gray-700' :
                            badge.tier === 'bronze' ? 'bg-amber-100 text-amber-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {badge.tier}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{badge.criteria}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Configuration */}
            {currentLessonData.type === 'video' && currentLessonData.id === 'leaderboards' && (
              <div className="mt-6 space-y-6">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard Types</h3>
                  <div className="space-y-4">
                    {leaderboardTypes.map((type, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-5 border border-indigo-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{type.type}</h4>
                        <p className="text-sm text-gray-700 mb-3">{type.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-green-700 mb-1">Pros:</p>
                            <ul className="space-y-1">
                              {type.pros.map((pro, pIdx) => (
                                <li key={pIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-red-700 mb-1">Cons:</p>
                            <ul className="space-y-1">
                              {type.cons.map((con, cIdx) => (
                                <li key={cIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <TrendingDown className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="text-xs text-indigo-700 mt-3 font-semibold">Best for: {type.bestFor}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {!showLeaderboardConfig ? (
                  <button
                    onClick={() => setShowLeaderboardConfig(true)}
                    className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Configure Your Leaderboard
                  </button>
                ) : (
                  <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Leaderboard Type</label>
                        <select
                          value={leaderboardConfig.type}
                          onChange={(e) => setLeaderboardConfig({ ...leaderboardConfig, type: e.target.value as any })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="individual">Individual</option>
                          <option value="team">Team</option>
                          <option value="personal-best">Personal Best</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Frequency</label>
                        <select
                          value={leaderboardConfig.updateFrequency}
                          onChange={(e) => setLeaderboardConfig({ ...leaderboardConfig, updateFrequency: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="real-time">Real-time</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="per-assessment">Per Assessment</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Options</label>
                        <div className="space-y-2">
                          {['Show top 10', 'Show all students', 'Show only my rank', 'Show team rankings'].map((option) => (
                            <label key={option} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={leaderboardConfig.displayOptions.includes(option)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setLeaderboardConfig({
                                      ...leaderboardConfig,
                                      displayOptions: [...leaderboardConfig.displayOptions, option],
                                    })
                                  } else {
                                    setLeaderboardConfig({
                                      ...leaderboardConfig,
                                      displayOptions: leaderboardConfig.displayOptions.filter(o => o !== option),
                                    })
                                  }
                                }}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleLeaderboardSubmit}
                          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                          Save Configuration
                        </button>
                        <button
                          onClick={() => setShowLeaderboardConfig(false)}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Point System Examples */}
            {currentLessonData.type === 'video' && currentLessonData.id === 'points-system' && (
              <div className="mt-6 space-y-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Point System Examples</h3>
                  <div className="space-y-4">
                    {pointSystemExamples.map((example, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-5 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{example.activity}</h4>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                            {example.basePoints} pts
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{example.bonusPoints}</p>
                        <p className="text-xs text-gray-600 italic">{example.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Template Lesson */}
            {currentLessonData.type === 'template' && (
              <div className="space-y-6">
                {currentLessonData.content?.description && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content?.description}</h3>
                    {currentLessonData.content?.sections && currentLessonData.content.sections.length > 0 && (
                      <>
                        <p className="text-sm text-gray-700 mb-4">This template includes the following sections:</p>
                        <ul className="space-y-2">
                          {currentLessonData.content.sections.map((section: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span>{section}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {currentLessonData.content?.sections && currentLessonData.content.sections.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
                    <div className="space-y-4">
                      {currentLessonData.content.sections.map((section: string, idx: number) => (
                        <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{section}</h4>
                          <p className="text-xs text-gray-500 italic">Your content will appear here...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Template
                </button>
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
                  onClick={() => navigate('/learning-hub/student-engagement-path')}
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

export default PointsBadgesLeaderboards


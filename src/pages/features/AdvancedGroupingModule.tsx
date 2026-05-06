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

interface GroupingScenario {
  scenario: string
  groupingType: string
  rationale: string
  students: string[]
  learningGoal: string
}

const AdvancedGroupingModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [scenarios, setScenarios] = useState<GroupingScenario[]>([])
  const [currentScenario, setCurrentScenario] = useState<GroupingScenario>({
    scenario: '',
    groupingType: 'Heterogeneous',
    rationale: '',
    students: [],
    learningGoal: '',
  })
  const [currentStudent, setCurrentStudent] = useState('')

  const lessons: LessonContent[] = [
    {
      id: 'grouping-video',
      type: 'video',
      title: 'Advanced Grouping Techniques',
      duration: '12 min',
      points: 20,
      completed: false,
      content: {
        description: 'Master sophisticated grouping techniques that maximize learning through strategic student placement and collaboration.',
        keyPoints: [
          'Different grouping strategies serve different purposes',
          'Heterogeneous groups promote collaboration and peer learning',
          'Homogeneous groups enable targeted instruction',
          'Dynamic grouping adapts to changing needs',
          'Strategic grouping maximizes learning for all students',
        ],
        transcript: 'Welcome to Advanced Grouping Strategies. In this module, you\'ll learn sophisticated grouping techniques that maximize learning through strategic student placement...',
      },
    },
    {
      id: 'grouping-reading',
      type: 'reading',
      title: 'Research on Grouping Effectiveness',
      points: 15,
      completed: false,
      content: {
        article: `# Research on Grouping Effectiveness

## Understanding Grouping Strategies

Effective grouping is strategic and purposeful. Different grouping strategies serve different learning goals and should be used intentionally based on learning objectives and student needs.

### Types of Grouping

#### Heterogeneous Groups
Groups with mixed ability levels:
- **Purpose**: Collaboration, peer learning, diverse perspectives
- **Benefits**: Peer support, varied viewpoints, social learning
- **Best For**: Projects, discussions, collaborative tasks
- **Considerations**: Ensure all students contribute meaningfully

#### Homogeneous Groups
Groups with similar ability levels:
- **Purpose**: Targeted instruction, appropriate challenge
- **Benefits**: Focused support, matched difficulty, efficient instruction
- **Best For**: Skill practice, targeted interventions, extension
- **Considerations**: Avoid permanent tracking, maintain flexibility

#### Interest-Based Groups
Groups formed around shared interests:
- **Purpose**: Engagement, motivation, relevance
- **Benefits**: Increased engagement, authentic learning
- **Best For**: Projects, research, exploration
- **Considerations**: Ensure academic rigor maintained

#### Learning Style Groups
Groups based on learning preferences:
- **Purpose**: Match activities to preferences
- **Benefits**: Comfortable learning environment, varied approaches
- **Best For**: Process differentiation, varied activities
- **Considerations**: Don't limit students to one style

#### Random Groups
Groups formed randomly:
- **Purpose**: Mix students, build relationships
- **Benefits**: New interactions, diverse perspectives
- **Best For**: Quick activities, icebreakers, mixing
- **Considerations**: May need support for collaboration

### Research Findings

**Flexible Grouping**: Most effective when groups change based on needs
**Heterogeneous Benefits**: Peer learning and collaboration improve outcomes
**Homogeneous Benefits**: Targeted instruction accelerates learning
**Dynamic Approach**: Varying grouping strategies maximizes effectiveness
**Student Choice**: Allowing some student choice increases engagement

### Best Practices

**1. Purpose-Driven**
- Group based on learning goals
- Match grouping strategy to task
- Consider what each strategy accomplishes

**2. Flexible**
- Change groups frequently
- Avoid permanent grouping
- Adapt to changing needs

**3. Strategic**
- Use heterogeneous for collaboration
- Use homogeneous for targeted instruction
- Mix strategies throughout units

**4. Transparent**
- Explain grouping rationale to students
- Help students understand purpose
- Build grouping skills

**5. Balanced**
- Don't always use same strategy
- Vary grouping approaches
- Consider all students' needs

## Key Takeaways

- Different grouping strategies serve different purposes
- Heterogeneous groups promote collaboration
- Homogeneous groups enable targeted instruction
- Dynamic grouping adapts to changing needs
- Strategic grouping maximizes learning for all`,
        keyTakeaways: [
          'Different grouping strategies serve different purposes',
          'Heterogeneous groups promote collaboration and peer learning',
          'Homogeneous groups enable targeted instruction',
          'Dynamic grouping adapts to changing needs',
          'Strategic grouping maximizes learning for all students',
        ],
      },
    },
    {
      id: 'grouping-planner',
      type: 'interactive',
      title: 'Grouping Strategy Planner',
      points: 25,
      completed: false,
      content: {
        description: 'Plan strategic grouping scenarios for different learning situations.',
        steps: [
          'Identify learning goal',
          'Select grouping strategy',
          'Plan group composition',
          'Determine rationale',
          'Plan implementation',
        ],
      },
    },
    {
      id: 'grouping-templates',
      type: 'template',
      title: 'Grouping Templates & Tools',
      points: 20,
      completed: false,
      content: {
        description: 'Download templates and tools for planning effective grouping strategies.',
        sections: [
          'Grouping Strategy Guide',
          'Scenario Planning Templates',
          'Group Composition Tools',
          'Implementation Checklists',
          'Reflection Prompts',
        ],
      },
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('advanced-grouping-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('advanced-grouping-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleAddStudent = () => {
    if (currentStudent.trim() && !currentScenario.students.includes(currentStudent.trim())) {
      setCurrentScenario({
        ...currentScenario,
        students: [...currentScenario.students, currentStudent.trim()],
      })
      setCurrentStudent('')
    }
  }

  const handleRemoveStudent = (student: string) => {
    setCurrentScenario({
      ...currentScenario,
      students: currentScenario.students.filter(s => s !== student),
    })
  }

  const handleAddScenario = () => {
    if (currentScenario.scenario && currentScenario.learningGoal && currentScenario.students.length > 0) {
      setScenarios([...scenarios, currentScenario])
      setCurrentScenario({
        scenario: '',
        groupingType: 'Heterogeneous',
        rationale: '',
        students: [],
        learningGoal: '',
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
                    Module 6 of 6
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    25 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Advanced Grouping Strategies</h1>
                <p className="mt-2 text-green-100">
                  Master sophisticated grouping techniques that maximize learning through strategic student placement and collaboration
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Planning Steps</h3>
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
                      Scenario Name *
                    </label>
                    <input
                      type="text"
                      value={currentScenario.scenario}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, scenario: e.target.value })}
                      placeholder="e.g., Collaborative Research Project"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Learning Goal *
                    </label>
                    <textarea
                      value={currentScenario.learningGoal}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, learningGoal: e.target.value })}
                      placeholder="What should students accomplish? (e.g., Students will collaborate to research and present on ecosystem relationships)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Grouping Type
                    </label>
                    <select
                      value={currentScenario.groupingType}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, groupingType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option>Heterogeneous</option>
                      <option>Homogeneous</option>
                      <option>Interest-Based</option>
                      <option>Learning Style</option>
                      <option>Random</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Rationale
                    </label>
                    <textarea
                      value={currentScenario.rationale}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, rationale: e.target.value })}
                      placeholder="Why this grouping strategy? (e.g., Heterogeneous grouping will allow peer support and diverse perspectives for collaborative research)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Students in Group
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentStudent}
                        onChange={(e) => setCurrentStudent(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                        placeholder="Enter student name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddStudent}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentScenario.students.map((student, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {student}
                          <button
                            onClick={() => handleRemoveStudent(student)}
                            className="text-green-700 hover:text-green-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddScenario}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Grouping Scenario
                  </button>

                  {scenarios.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Grouping Scenarios ({scenarios.length})</h3>
                      <div className="space-y-4">
                        {scenarios.map((scenario, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{scenario.scenario}</h4>
                                <span className="text-xs text-green-600 font-semibold">{scenario.groupingType}</span>
                              </div>
                              <button
                                onClick={() => setScenarios(scenarios.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-700 mb-2"><strong>Goal:</strong> {scenario.learningGoal}</p>
                            {scenario.rationale && (
                              <p className="text-sm text-gray-600 mb-2"><strong>Rationale:</strong> {scenario.rationale}</p>
                            )}
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Students:</p>
                              <div className="flex flex-wrap gap-1">
                                {scenario.students.map((student, sIdx) => (
                                  <span key={sIdx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                    {student}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          alert('Grouping scenarios saved! Use these to plan strategic grouping in your classroom.')
                        }}
                        className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <Users className="h-5 w-5" />
                        Save Grouping Plan
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

export default AdvancedGroupingModule




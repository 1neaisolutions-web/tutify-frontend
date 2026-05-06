import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  BookOpen,
  Play,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  Target,
  Lightbulb,
  Users,
  Shield,
  TrendingUp,
  FileText,
  Star,
  X,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react'
import {
  startLearningSession,
  recordLearningEvent,
  completeLearningSession,
  fetchContentProgress,
} from '../../redux/features/learningProgress/learningProgressSlice'
import { fetchLearningHubHome } from '../../redux/features/learningHub/learningHubSlice'
import axiosInstance from '../../redux/http'

interface Lesson {
  id: number
  title: string
  duration: string
  content: {
    type: 'text' | 'video' | 'interactive' | 'quiz'
    data: any
  }[]
  completed: boolean
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const staticCourseData = {
  title: 'Differentiation made simple',
  category: 'Differentiation',
  duration: '10 min',
  difficulty: 'Beginner',
  description: 'Learn practical strategies to meet the diverse needs of all learners in your classroom without overwhelming yourself or your students.',
  learningObjectives: [
    'Understand the three dimensions of differentiation: content, process, and product',
    'Implement tiered assignments that challenge all students appropriately',
    'Use flexible grouping strategies effectively',
    'Create a differentiated lesson plan you can use immediately',
  ],
  lessons: [
    {
      id: 1,
      title: 'What is Differentiation?',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Differentiation Defined',
            paragraphs: [
              'Differentiation is the process of tailoring instruction to meet individual student needs. It\'s not about creating 30 different lesson plans—it\'s about providing multiple pathways for students to access, engage with, and demonstrate learning.',
              'Carol Ann Tomlinson, a leading expert in differentiation, defines it as "a teacher\'s proactive response to learner needs shaped by mindset and guided by general principles."',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'The Three Dimensions',
            paragraphs: [
              'Content: What students learn (the curriculum, concepts, skills)',
              'Process: How students learn (activities, strategies, methods)',
              'Product: How students demonstrate learning (assessments, projects, presentations)',
              'You don\'t need to differentiate all three dimensions in every lesson. Start with one and build from there.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Reflection',
            prompt: 'Think about your current teaching. Which dimension do you already differentiate? Which could you improve?',
            tips: [
              'Most teachers naturally differentiate process through varied activities',
              'Content differentiation often requires the most planning',
              'Product differentiation can be the easiest to implement',
              'Start small—choose one lesson per week to differentiate',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 2,
      title: 'Content Differentiation',
      duration: '3 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Tiered Assignments',
            paragraphs: [
              'Tiered assignments provide the same learning objective but at different levels of complexity. All students work toward the same goal, but the path varies.',
              'Example: In a math lesson on fractions, tier 1 students might work with visual models, tier 2 students solve word problems, and tier 3 students create their own problems.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Learning Contracts',
            paragraphs: [
              'Learning contracts give students choice in what they learn and how they demonstrate understanding. They\'re especially effective for advanced learners who need more challenge.',
              'A contract might include: required tasks, choice tasks, and extension activities. Students work at their own pace within set parameters.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Compacting',
            paragraphs: [
              'Compacting allows students who have already mastered content to skip ahead. Pre-assess students, then provide alternative activities for those who demonstrate mastery.',
              'This prevents boredom and allows you to focus instruction on students who need it most.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Plan Your Tiered Assignment',
            prompt: 'Choose an upcoming lesson and plan three tiers for the same learning objective.',
            tips: [
              'Keep the learning objective the same for all tiers',
              'Vary complexity, not just quantity',
              'Ensure all tiers are equally engaging',
              'Use clear labels: "Foundation," "Standard," "Challenge"',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Process Differentiation',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Flexible Grouping',
            paragraphs: [
              'Flexible grouping means students work in different groups for different purposes. Groups change based on the task, not fixed ability levels.',
              'Types of groups: whole class, small groups, pairs, individual work. Mix it up throughout a lesson to meet various needs.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Learning Stations',
            paragraphs: [
              'Learning stations allow students to engage with content in different ways. Set up 3-4 stations with varied activities: hands-on, reading, technology, discussion.',
              'Students rotate through stations, spending time at each based on their needs and interests.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Scaffolding Strategies',
            paragraphs: [
              'Provide different levels of support: graphic organizers, sentence starters, checklists, or peer partners.',
              'Gradually remove scaffolds as students become more independent. The goal is to support, not enable dependency.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Design Learning Stations',
            prompt: 'Plan 3-4 learning stations for an upcoming lesson, each offering a different way to engage with the content.',
            tips: [
              'Include at least one hands-on station',
              'Vary the learning modalities (visual, auditory, kinesthetic)',
              'Make stations self-explanatory with clear directions',
              'Plan for 10-15 minutes per station',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 4,
      title: 'Product Differentiation',
      duration: '3 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Choice Boards',
            paragraphs: [
              'Choice boards (also called menus) give students options for how they demonstrate learning. Create a 3x3 grid with 9 different product options.',
              'Example options: write a story, create a video, design a poster, give a presentation, write a song, create a model, etc.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Rubrics for All Products',
            paragraphs: [
              'Create rubrics that focus on learning objectives, not the product type. A rubric for "demonstrating understanding of the water cycle" works whether students write, draw, or build.',
              'Focus on: accuracy of content, depth of understanding, creativity, and effort.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Multiple Intelligences',
            paragraphs: [
              'Consider Howard Gardner\'s multiple intelligences when designing product options: linguistic, logical-mathematical, spatial, bodily-kinesthetic, musical, interpersonal, intrapersonal, naturalistic.',
              'Offering varied product options allows students to use their strengths while still demonstrating mastery of learning objectives.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Create a Choice Board',
            prompt: 'Design a choice board with 6-9 options for an upcoming assessment. Ensure all options assess the same learning objective.',
            tips: [
              'Include options for different learning styles',
              'Make sure all options are equally rigorous',
              'Provide clear expectations for each option',
              'Consider your available resources and time',
            ],
          },
        },
      ],
      completed: false,
    },
  ],
  quiz: {
    questions: [
      {
        id: 1,
        question: 'What are the three dimensions of differentiation?',
        options: [
          'Reading, writing, and math',
          'Content, process, and product',
          'Beginning, middle, and end',
          'Easy, medium, and hard',
        ],
        correctAnswer: 1,
        explanation: 'Differentiation occurs in three dimensions: content (what students learn), process (how they learn), and product (how they demonstrate learning).',
      },
      {
        id: 2,
        question: 'What is a tiered assignment?',
        options: [
          'Assignments given at different times',
          'Assignments with the same learning objective but different complexity levels',
          'Assignments for different subjects',
          'Assignments completed in groups',
        ],
        correctAnswer: 1,
        explanation: 'Tiered assignments provide the same learning objective but at different levels of complexity, allowing all students to work toward the same goal at an appropriate level.',
      },
      {
        id: 3,
        question: 'What is flexible grouping?',
        options: [
          'Groups that never change',
          'Groups based only on ability level',
          'Groups that change based on the task and student needs',
          'Groups chosen by students only',
        ],
        correctAnswer: 2,
        explanation: 'Flexible grouping means students work in different groups for different purposes, with groups changing based on the task rather than fixed ability levels.',
      },
      {
        id: 4,
        question: 'What is a key principle of product differentiation?',
        options: [
          'All students must create the same product',
          'Products should focus on learning objectives, not product type',
          'Only advanced students get choice',
          'Products don\'t need rubrics',
        ],
        correctAnswer: 1,
        explanation: 'Product differentiation should focus on learning objectives rather than product type. Rubrics should assess understanding regardless of how students demonstrate it.',
      },
    ],
  },
}

function toTrimmedStringArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (v == null ? '' : String(v)).trim())
      .filter((s) => Boolean(s))
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n+/g)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

function normalizeId(value: any): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function toDurationString(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number' && Number.isFinite(value)) return `${value} min`
  const s = String(value).trim()
  if (!s) return ''
  if (/^\d+(\.\d+)?$/.test(s)) return `${s} min`
  // If the model already returned e.g. "10 min", keep it.
  if (s.toLowerCase().includes('min')) return s
  return `${s} min`
}

/** Split an array across N lessons so each lesson gets a slice (deterministic). */
function sliceForLesson<T>(arr: T[], lessonIdx: number, lessonCount: number): T[] {
  if (!Array.isArray(arr) || arr.length === 0 || lessonCount <= 0) return []
  const n = Math.max(1, Math.ceil(arr.length / lessonCount))
  const start = lessonIdx * n
  return arr.slice(start, start + n)
}

/**
 * The LLM structure agent often emits one-line `content_summary` per step. The rich material lives in
 * curriculum + pedagogy + assessment. Merge those into each lesson so the UI is not empty-looking.
 */
function enrichLessonWithPipelineSections(
  lessonIdx: number,
  lessonCount: number,
  baseContent: any[],
  curriculum: any,
  pedagogy: any,
  assessment: any,
  review: any,
  quality: any,
  modules: any[]
): any[] {
  const flow = toTrimmedStringArray(pedagogy?.instructional_flow)
  const concepts = toTrimmedStringArray(curriculum?.key_concepts)
  const strategies = toTrimmedStringArray(pedagogy?.teaching_strategies)
  const examples = toTrimmedStringArray(pedagogy?.examples)
  const reflectionsPed = toTrimmedStringArray(pedagogy?.teacher_reflections)
  const prereq = toTrimmedStringArray(curriculum?.prerequisites)
  const skills = toTrimmedStringArray(curriculum?.target_skills)
  const reflectionPrompts = toTrimmedStringArray(assessment?.reflection_prompts)

  const supplemental: string[] = []
  if (Array.isArray(modules) && modules[lessonIdx]) {
    const m = modules[lessonIdx]
    const line = String(m?.summary || m?.title || '').trim()
    if (line) supplemental.push(line)
  }
  supplemental.push(...sliceForLesson(flow, lessonIdx, lessonCount))
  supplemental.push(...sliceForLesson(concepts, lessonIdx, lessonCount))
  supplemental.push(...sliceForLesson(strategies, lessonIdx, lessonCount))
  supplemental.push(...sliceForLesson(examples, lessonIdx, lessonCount))

  if (lessonIdx === 0) {
    supplemental.unshift(...prereq.slice(0, 4))
    supplemental.push(...skills.slice(0, 5))
    const qfb = String(quality?.quality_feedback || '').trim()
    if (qfb) supplemental.push(qfb)
    supplemental.push(...toTrimmedStringArray(review?.improvement_notes).slice(0, 5))
  }

  const out = [...baseContent]

  const deduped = [...new Set(supplemental.map((s) => s.trim()).filter(Boolean))].slice(0, 12)
  if (deduped.length) {
    out.push({
      type: 'text',
      data: {
        heading: 'Extend your practice',
        paragraphs: deduped,
      },
    })
  }

  const refl =
    reflectionPrompts[lessonIdx] ||
    (reflectionPrompts.length ? reflectionPrompts[lessonIdx % reflectionPrompts.length] : '')
  if (refl) {
    const tips = sliceForLesson(reflectionsPed, lessonIdx, lessonCount).slice(0, 4)
    out.push({
      type: 'interactive',
      data: {
        title: 'Reflection',
        prompt: refl,
        tips: tips.length ? tips : [],
      },
    })
  }

  const tasks = Array.isArray(assessment?.practice_tasks) ? assessment.practice_tasks : []
  const task = tasks[lessonIdx]
  if (task && typeof task === 'object') {
    const paras = toTrimmedStringArray(
      task.description ?? task.task ?? task.prompt ?? task.title ?? task.text ?? ''
    )
    if (paras.length) {
      out.push({
        type: 'text',
        data: {
          heading: 'Practice task',
          paragraphs: paras.slice(0, 8),
        },
      })
    }
  }

  return out
}

function buildMicroCourseFromRegistryJsonBlob(registryItem: any, fallback: any): any | null {
  const blob = registryItem?.json_blob
  if (!blob || typeof blob !== 'object') return null

  const structure = blob.structure || {}
  const curriculum = blob.curriculum || {}
  const pedagogy = blob.pedagogy || {}
  const assessment = blob.assessment || {}
  const review = blob.review || {}
  const quality = blob.quality || {}

  const lessonsRaw = Array.isArray(structure.lessons) ? structure.lessons : []
  const stepsRaw = Array.isArray(structure.steps) ? structure.steps : []
  const activitiesRaw = Array.isArray(structure.activities) ? structure.activities : []

  if (!lessonsRaw.length || !stepsRaw.length) return null

  const learningObjectives =
    toTrimmedStringArray(curriculum?.learning_objectives || curriculum?.learningObjectives || []) || []

  const title = String(registryItem?.title || fallback?.title || 'Micro-course')
  const description = String(registryItem?.summary || fallback?.description || '')
  const category = String(registryItem?.category || fallback?.category || '')
  const difficulty = String(registryItem?.difficulty || fallback?.difficulty || '')
  const estimatedDurationMin = registryItem?.estimated_duration_min ?? fallback?.duration
  const duration =
    typeof estimatedDurationMin === 'number' || /^\d+(\.\d+)?$/.test(String(estimatedDurationMin || ''))
      ? toDurationString(estimatedDurationMin)
      : String(estimatedDurationMin || fallback?.duration || '')

  const lessons = lessonsRaw.map((lesson: any, lessonIdx: number) => {
    const lessonId = lesson?.id ?? lesson?.lesson_id ?? lesson?.order ?? lessonIdx + 1
    const lessonTitle = String(lesson?.title || `Lesson ${lessonIdx + 1}`)
    const lessonDuration = toDurationString(lesson?.duration_min ?? lesson?.duration ?? '')

    let lessonSteps = stepsRaw.filter((s: any) => {
      const sid = s?.lesson_id ?? s?.lessonId ?? s?.lesson ?? s?.order
      if (sid === undefined || sid === null) return false
      return normalizeId(sid) === normalizeId(lessonId) || normalizeId(sid) === normalizeId(lessonIdx + 1)
    })

    // If the model didn't link steps to lessons, distribute by order to avoid dead-ends.
    if (lessonSteps.length === 0 && stepsRaw.length > 0) {
      const start = Math.floor((lessonIdx * stepsRaw.length) / lessonsRaw.length)
      const end = Math.floor(((lessonIdx + 1) * stepsRaw.length) / lessonsRaw.length)
      lessonSteps = stepsRaw.slice(start, end)
    }

    const content = lessonSteps
      .map((step: any, stepIdx: number) => {
        const stepType = String(step?.type || '').toLowerCase()
        const interactive =
          stepType.includes('interactive') || stepType.includes('reflection') || stepType.includes('prompt')

        const stepTitle = String(step?.title || step?.step_title || `Step ${stepIdx + 1}`)
        const stepSummary = step?.content_summary ?? step?.contentSummary ?? step?.content ?? ''
        const stepId = step?.step_id ?? step?.id ?? step?.order ?? `${lessonIdx + 1}-${stepIdx + 1}`

        const matchingActivities = activitiesRaw.filter((a: any) => {
          const aStepId = a?.step_id ?? a?.stepId ?? a?.step
          return normalizeId(aStepId) === normalizeId(stepId)
        })

        const descriptions: string[] = []
        matchingActivities.forEach((a: any) => {
          descriptions.push(...toTrimmedStringArray(a?.description))
        })

        if (interactive) {
          const prompt = String(stepSummary || descriptions[0] || '').trim()
          const tips = (descriptions.length ? descriptions : toTrimmedStringArray(stepSummary)).slice(0, 4)
          if (!prompt && tips.length === 0) return null
          return {
            type: 'interactive',
            data: {
              title: stepTitle,
              prompt: prompt || '',
              tips: tips.length ? tips : [],
            },
          }
        }

        const paragraphs = (descriptions.length ? descriptions : toTrimmedStringArray(stepSummary)).slice(0, 6)
        if (paragraphs.length === 0) return null
        return {
          type: 'text',
          data: {
            heading: stepTitle,
            paragraphs,
          },
        }
      })
      .filter(Boolean)

    const enriched = enrichLessonWithPipelineSections(
      lessonIdx,
      lessonsRaw.length,
      content as any[],
      curriculum,
      pedagogy,
      assessment,
      review,
      quality,
      Array.isArray(structure.modules) ? structure.modules : []
    )

    if (!enriched.length) return null

    return {
      id: lessonIdx + 1,
      title: lessonTitle,
      duration: lessonDuration || fallback?.lessons?.[lessonIdx]?.duration || '',
      content: enriched as any[],
      completed: false,
    }
  }).filter(Boolean)

  if (!lessons.length) return null

  // Assessment → quiz mapping
  const miniQuizzesRaw = Array.isArray(assessment?.mini_quizzes) ? assessment.mini_quizzes : []
  const questions = miniQuizzesRaw
    .map((mq: any, idx: number) => {
      const questionText =
        mq?.question ?? mq?.prompt ?? mq?.text ?? mq?.stem ?? mq?.title ?? `Question ${idx + 1}`

      const rawOptions = mq?.options ?? mq?.choices ?? mq?.answer_options ?? mq?.answerOptions ?? []
      const options = Array.isArray(rawOptions) ? rawOptions.map((o) => String(o).trim()).filter(Boolean) : []
      if (!questionText || !String(questionText).trim()) return null

      const rawCorrect = mq?.correct_answer ?? mq?.correctAnswer ?? mq?.correct_index ?? mq?.correctIndex
      let correctAnswerIndex = 0
      if (typeof rawCorrect === 'number' && Number.isFinite(rawCorrect)) {
        correctAnswerIndex = rawCorrect
      } else if (typeof rawCorrect === 'string') {
        const asNum = parseInt(rawCorrect, 10)
        if (!Number.isNaN(asNum)) correctAnswerIndex = asNum
        else {
          const asStr = rawCorrect.trim()
          const found = options.findIndex((o) => o.toLowerCase() === asStr.toLowerCase())
          if (found >= 0) correctAnswerIndex = found
        }
      }

      // Normalize possible 1-based vs 0-based indices to 0-based for the UI.
      if (typeof rawCorrect === 'number' && options.length) {
        if (rawCorrect >= 0 && rawCorrect < options.length) {
          correctAnswerIndex = rawCorrect
        } else if (rawCorrect >= 1 && rawCorrect <= options.length) {
          correctAnswerIndex = rawCorrect - 1
        }
      }

      // Clamp to valid range to keep UI stable.
      if (options.length) {
        correctAnswerIndex = Math.max(0, Math.min(options.length - 1, correctAnswerIndex))
      } else {
        correctAnswerIndex = 0
      }

      return {
        id: idx + 1,
        question: String(questionText),
        options: options,
        correctAnswer: correctAnswerIndex,
        explanation: String(mq?.explanation ?? mq?.rationale ?? mq?.review ?? ''),
      }
    })
    .filter(Boolean)

  return {
    title,
    category: category || fallback?.category,
    duration: duration || fallback?.duration,
    difficulty: difficulty || fallback?.difficulty,
    description: description || fallback?.description,
    learningObjectives: learningObjectives.length ? learningObjectives : fallback?.learningObjectives || [],
    lessons: lessons as any[],
    quiz: {
      questions,
    },
  }
}

const DifferentiationCourse = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { activeSessionsByContentId = {} } = useSelector((state: any) => state.learningProgress) ?? {}
  const persisted = (() => {
    try {
      const raw = sessionStorage.getItem(`learningHubRouteState:${location.pathname}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()
  const contentId =
    (location.state as any)?.contentId ||
    persisted?.contentId ||
    'learning-hub:differentiation-course'
  const contentType = (location.state as any)?.contentType || persisted?.contentType || 'micro_course'
  const [courseData, setCourseData] = useState(staticCourseData)
  const [courseDataLoading, setCourseDataLoading] = useState(false)
  const [courseDataError, setCourseDataError] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const currentLessonData = courseData.lessons[currentLesson]
  const currentContent = currentLessonData?.content[currentContentIndex]
  const progress = ((completedLessons.length + (currentLesson > 0 ? 1 : 0)) / courseData.lessons.length) * 100
  const hideGeneratedDurations = typeof contentId === 'string' && contentId.startsWith('factory-')

  // Load generated micro-course content when the route carries an AI-generated `factory-*` contentId.
  useEffect(() => {
    const shouldFetch = typeof contentId === 'string' && contentId.startsWith('factory-')
    if (!shouldFetch) return

    let cancelled = false
    const run = async () => {
      setCourseDataLoading(true)
      setCourseDataError(null)
      try {
        const res = await axiosInstance.get(
          `/api/v1/content-registry/by-content-id/${encodeURIComponent(contentId)}`
        )
        const item = res?.data
        const next = buildMicroCourseFromRegistryJsonBlob(item, staticCourseData)
        if (!cancelled && next) {
          setCourseData(next)
          // Reset navigation state for the newly loaded course.
          setCurrentLesson(0)
          setCurrentContentIndex(0)
          setCompletedLessons([])
          setShowQuiz(false)
          setQuizAnswers({})
          setQuizSubmitted(false)
          setCourseCompleted(false)
          setShowCertificate(false)
        }
      } catch (e: any) {
        if (cancelled) return
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          'Could not load generated course content.'
        setCourseDataError(String(msg))
      } finally {
        if (!cancelled) setCourseDataLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId])

  useEffect(() => {
    if (!contentId) return
    const existing = (activeSessionsByContentId as any)[contentId]
    if (!existing) {
      dispatch(
        startLearningSession({
          contentId,
          contentType,
        })
      )
    } else {
      dispatch(
        recordLearningEvent({
          session_id: existing.sessionId,
          content_id: contentId,
          event_type: 'content_opened',
        })
      )
    }
  }, [contentId, contentType, dispatch])

  const handleNext = () => {
    if (currentContentIndex < currentLessonData.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
    } else if (currentLesson < courseData.lessons.length - 1) {
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson])
      }
      setCurrentLesson(currentLesson + 1)
      setCurrentContentIndex(0)
    } else {
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson])
      }
      const hasQuiz = Array.isArray(courseData.quiz?.questions) && courseData.quiz.questions.length > 0
      if (hasQuiz) {
        setShowQuiz(true)
      } else {
        // If generated content doesn't include a quiz, finish the course so the UI doesn't dead-end.
        setCourseCompleted(true)
        setTimeout(() => setShowCertificate(true), 1000)
        const session = (activeSessionsByContentId as any)[contentId]
        if (session) {
          dispatch(
            recordLearningEvent({
              session_id: session.sessionId,
              content_id: contentId,
              event_type: 'content_completed',
            })
          )
          dispatch(
            completeLearningSession({
              sessionId: session.sessionId,
              progress_percent: 100,
            })
          )
        }
      }
    }
  }

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
    } else if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setCurrentContentIndex(courseData.lessons[currentLesson - 1].content.length - 1)
    }
  }

  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    if (quizSubmitted) return
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })
  }

  const handleQuizSubmit = () => {
    const questions = courseData.quiz?.questions || []
    if (!questions.length) return
    setQuizSubmitted(true)
    const score = Object.entries(quizAnswers).filter(
      ([qId, answer]) => questions[parseInt(qId) - 1]?.correctAnswer === answer
    ).length
    if (score >= questions.length * 0.7) {
      setCourseCompleted(true)
      setTimeout(() => setShowCertificate(true), 1000)
      const session = (activeSessionsByContentId as any)[contentId]
      if (session) {
        dispatch(
          recordLearningEvent({
            session_id: session.sessionId,
            content_id: contentId,
            event_type: 'content_completed',
          })
        )
        dispatch(
          completeLearningSession({
            sessionId: session.sessionId,
            progress_percent: 100,
          })
        )
      }
    }
  }

  const handleCompleteCourse = () => {
    if (contentId) {
      const session = (activeSessionsByContentId as any)[contentId]
      if (session) {
        dispatch(
          recordLearningEvent({
            session_id: session.sessionId,
            content_id: contentId,
            event_type: 'content_completed',
          })
        )
        dispatch(
          completeLearningSession({
            sessionId: session.sessionId,
            progress_percent: 100,
          })
        )
        dispatch(fetchContentProgress(contentId))
        dispatch(fetchLearningHubHome())
      }
    }
    navigate('/learning-hub')
  }

  if (courseDataLoading && !showCertificate && !showQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 mb-2">Loading your generated course...</p>
          {courseDataError ? <p className="text-xs text-red-700">{courseDataError}</p> : <p className="text-xs text-gray-500">Please wait.</p>}
        </div>
      </div>
    )
  }

  if (courseDataError && contentId && String(contentId).startsWith('factory-') && !showCertificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-lg w-full rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-red-800 mb-2">Could not load generated course</h2>
          <p className="text-xs text-red-700 mb-4">{courseDataError}</p>
          <button
            onClick={() => {
              // Hard refresh state by reloading the page.
              // This avoids needing a second fetch implementation and keeps UI consistent.
              window.location.reload()
            }}
            className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
              <p className="text-lg text-gray-600">You've completed the course</p>
            </div>

            <div className="border-2 border-green-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                {!hideGeneratedDurations && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {courseData.duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {courseData.difficulty}
                </span>
              </div>
              <div className="mt-6 pt-6 border-t border-green-200">
                <p className="text-sm text-gray-600 mb-2">Certificate of Completion</p>
                <p className="text-lg font-semibold text-gray-900">This certifies that you have successfully completed</p>
                <p className="text-xl font-bold text-green-600 mt-2">{courseData.title}</p>
                <p className="text-sm text-gray-500 mt-4">Issued on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Download Certificate
              </button>
              <button
                onClick={handleCompleteCourse}
                className="flex-1 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                Back to Learning Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showQuiz) {
    const score = Object.entries(quizAnswers).filter(
      ([qId, answer]) => courseData.quiz.questions[parseInt(qId) - 1].correctAnswer === answer
    ).length
    const percentage = (score / courseData.quiz.questions.length) * 100
    const passed = percentage >= 70

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Course Assessment</h2>
              <p className="text-sm text-gray-600 mt-1">Test your understanding of differentiation strategies</p>
            </div>
            <button
              onClick={() => navigate('/learning-hub')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {courseData.quiz.questions.map((question, idx) => {
              const userAnswer = quizAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <div key={question.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      quizSubmitted
                        ? isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isSelected = userAnswer === optIdx
                          const isCorrectOption = optIdx === question.correctAnswer

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(question.id, optIdx)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                                quizSubmitted
                                  ? isCorrectOption
                                    ? 'border-green-500 bg-green-50'
                                    : isSelected
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 bg-white'
                                  : isSelected
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-green-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  quizSubmitted
                                    ? isCorrectOption
                                      ? 'border-green-500 bg-green-500'
                                      : isSelected
                                      ? 'border-red-500 bg-red-500'
                                      : 'border-gray-300'
                                    : isSelected
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }`}>
                                  {quizSubmitted && isCorrectOption && <CheckCircle2 className="w-3 h-3 text-white" />}
                                  {isSelected && !quizSubmitted && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`flex-1 ${quizSubmitted && !isCorrectOption && isSelected ? 'text-red-700' : quizSubmitted && isCorrectOption ? 'text-green-700' : 'text-gray-700'}`}>
                                  {option}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {quizSubmitted && (
                        <div className={`mt-4 p-4 rounded-lg ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                        }`}>
                          <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                            {isCorrect ? '✓ Correct!' : 'Explanation:'}
                          </p>
                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {quizSubmitted && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
                  {passed ? (
                    <Award className="w-8 h-8 text-white" />
                  ) : (
                    <Target className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {passed ? 'Congratulations! You passed!' : 'Keep Learning'}
                </h3>
                <p className="text-lg font-semibold text-green-600 mb-2">
                  Score: {score}/{courseData.quiz.questions.length} ({Math.round(percentage)}%)
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {passed
                    ? 'You\'ve demonstrated a strong understanding of differentiation strategies!'
                    : 'Review the course materials and try again. You need 70% to pass.'}
                </p>
                {passed ? (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Award className="w-4 h-4" />
                    View Certificate
                  </button>
                ) : (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowQuiz(false)
                        setCurrentLesson(0)
                        setCurrentContentIndex(0)
                        setQuizAnswers({})
                        setQuizSubmitted(false)
                      }}
                      className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Review Course
                    </button>
                    <button
                      onClick={() => {
                        setQuizAnswers({})
                        setQuizSubmitted(false)
                      }}
                      className="rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!quizSubmitted && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < courseData.quiz.questions.length}
                className="rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Submit Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-page-kind="micro_course" data-content-id={contentId || ''} data-content-type={contentType || 'micro_course'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {courseData.category}
              </span>
              {!hideGeneratedDurations && (
                <>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">{courseData.duration}</span>
                </>
              )}
              <span className="text-white/80">•</span>
              <span className="text-white/80 text-sm">{courseData.difficulty}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{courseData.title}</h1>
            <p className="text-white/90 text-lg mb-4">{courseData.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Progress: {Math.round(progress)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Lesson {currentLesson + 1} of {courseData.lessons.length}</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/learning-hub')}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lesson Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Course Content</h3>
            <div className="space-y-2">
              {courseData.lessons.map((lesson, idx) => {
                const isActive = idx === currentLesson
                const isCompleted = completedLessons.includes(idx)

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLesson(idx)
                      setCurrentContentIndex(0)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-green-50 border-2 border-green-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          isActive ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </p>
                        {!hideGeneratedDurations && (
                          <p className="text-xs text-gray-500 mt-0.5">{lesson.duration}</p>
                        )}
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
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Lesson {currentLesson + 1} of {courseData.lessons.length}</span>
                {!hideGeneratedDurations && (
                  <>
                    <span>•</span>
                    <span>{currentLessonData.duration}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
            </div>

            {/* Content */}
            <div className="space-y-8 mb-8">
              {currentContent?.type === 'text' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{currentContent.data.heading}</h3>
                  {currentContent.data.paragraphs.map((para: string, idx: number) => (
                    <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {currentContent?.type === 'interactive' && (
                <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{currentContent.data.title}</h3>
                      <p className="text-gray-700 mb-4">{currentContent.data.prompt}</p>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Tips:</p>
                        <ul className="space-y-1">
                          {currentContent.data.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentLesson === 0 && currentContentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Content {currentContentIndex + 1} of {currentLessonData.content.length}</span>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition"
              >
                {currentContentIndex === currentLessonData.content.length - 1 && currentLesson === courseData.lessons.length - 1
                  ? 'Complete Course'
                  : currentContentIndex === currentLessonData.content.length - 1
                  ? 'Next Lesson'
                  : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Learning Objectives Sidebar */}
          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {courseData.learningObjectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DifferentiationCourse




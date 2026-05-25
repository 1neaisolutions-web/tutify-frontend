import { useEffect, useState } from 'react'
import {
  Bot,
  Filter,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Atom,
  Beaker,
  Palette,
  Star,
  Brain,
  Code,
  Briefcase,
  Music,
  Camera,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { listChatbots, Chatbot } from '../../api/chatbots'

// General Teaching Assistant (always shown)
const generalBot = {
  name: 'General Teaching Assistant',
  description:
    'Your versatile AI companion for lesson planning, assessment ideas, and classroom management support. Perfect for getting started with AI-powered teaching tools.',
  icon: Bot,
  features: [
    'Lesson planning assistance',
    'Assessment ideas generation',
    'Classroom management tips',
    'Quick Q&A support',
  ],
}

// Subject-Specific Specialists
const subjectBots = {
  English: [
    {
      name: 'Literacy Lab Coach',
      slug: 'literacy-lab-coach',
      description: 'Guided reading strategies, text complexity analysis, and writing feedback tailored to grade levels.',
      icon: BookOpen,
      rating: '4.9★',
    },
    {
      name: 'Grammar & Writing Mentor',
      slug: 'grammar-writing-mentor',
      description: 'Grammar instruction, writing workshop facilitation, and peer review guidance.',
      icon: BookOpen,
      rating: '4.8★',
    },
    {
      name: 'Literature Analysis Expert',
      slug: 'literature-analysis-expert',
      description: 'Literary analysis, theme exploration, and discussion prompts for classic and contemporary texts.',
      icon: BookOpen,
      rating: '4.7★',
    },
    {
      name: 'Advanced Knowledge and Skills Coach',
      slug: 'advanced-knowledge-skills-coach',
      description: "This tool will increase teachers' knowledge and skills on modern pedagogical methods.",
      icon: BookOpen,
      rating: '4.9★',
    },
    {
      name: 'UNEC Academic Development & Innovation',
      slug: 'unec-academic-development',
      description:
        'Comprehensive program for syllabus design, assessment, digital literacy, AI integration, and student-centered teaching methods.',
      icon: BookOpen,
      rating: '5.0★',
    },
  ],
  Mathematics: [
    {
      name: 'Adaptive Math Strategist',
      slug: 'adaptive-math-strategist',
      description: 'Differentiated problem sets, step-by-step modeling, and conceptual understanding support.',
      icon: Atom,
      rating: '4.9★',
    },
    {
      name: 'Problem-Solving Coach',
      slug: 'problem-solving-coach',
      description: 'Real-world math applications, word problem strategies, and mathematical reasoning development.',
      icon: Atom,
      rating: '4.8★',
    },
    {
      name: 'Algebra & Geometry Tutor',
      slug: 'algebra-geometry-tutor',
      description: 'Visual explanations, proof strategies, and scaffolded practice for advanced mathematics.',
      icon: Atom,
      rating: '4.7★',
    },
  ],
  Sciences: [
    {
      name: 'STEM Inquiry Mentor',
      slug: 'stem-inquiry-mentor',
      description: 'NGSS-aligned investigations, engineering design challenges, and scientific method guidance.',
      icon: Beaker,
      rating: '4.9★',
    },
    {
      name: 'Lab Safety & Protocol Advisor',
      slug: 'lab-safety-protocol-advisor',
      description: 'Safety protocols, experiment design, and hands-on activity planning for science labs.',
      icon: Beaker,
      rating: '4.8★',
    },
    {
      name: 'Environmental Science Guide',
      slug: 'environmental-science-guide',
      description: 'Climate education, sustainability projects, and ecological systems understanding.',
      icon: Beaker,
      rating: '4.7★',
    },
  ],
  Business: [
    {
      name: 'Business Studies Mentor',
      slug: 'business-studies-mentor',
      description: 'Entrepreneurship, economics, financial literacy, and real-world business scenarios.',
      icon: Briefcase,
      rating: '4.8★',
    },
    {
      name: 'Career Readiness Coach',
      slug: 'career-readiness-coach',
      description: 'Resume building, interview prep, professional skills, and industry insights.',
      icon: Briefcase,
      rating: '4.7★',
    },
    {
      name: 'Marketing & Branding Strategist',
      slug: 'marketing-branding-strategist',
      description: 'Marketing fundamentals, branding strategies, digital marketing, and market research.',
      icon: Briefcase,
      rating: '4.8★',
    },
  ],
  Arts: [
    {
      name: 'Visual Arts Studio Assistant',
      slug: 'visual-arts-studio-assistant',
      description: 'Art history, technique guidance, portfolio development, and creative project ideas.',
      icon: Palette,
      rating: '4.8★',
    },
    {
      name: 'Music & Performance Coach',
      slug: 'music-performance-coach',
      description: 'Music theory, composition, performance techniques, and ensemble coordination.',
      icon: Music,
      rating: '4.7★',
    },
    {
      name: 'Drama & Theater Director',
      slug: 'drama-theater-director',
      description: 'Script analysis, character development, stage direction, and production planning.',
      icon: Camera,
      rating: '4.6★',
    },
  ],
  Technology: [
    {
      name: 'Coding & Programming Tutor',
      slug: 'coding-programming-tutor',
      description: 'Programming concepts, debugging help, project-based learning, and computational thinking.',
      icon: Code,
      rating: '4.9★',
    },
    {
      name: 'Digital Literacy Advisor',
      slug: 'digital-literacy-advisor',
      description: 'Digital citizenship, online safety, media literacy, and technology integration strategies.',
      icon: Code,
      rating: '4.8★',
    },
    {
      name: 'AI & Machine Learning Educator',
      slug: 'ai-machine-learning-educator',
      description: 'AI concepts for students, ethical AI discussions, and hands-on ML projects.',
      icon: Brain,
      rating: '4.7★',
    },
  ],
}

const subjectIcons: Record<string, React.ElementType> = {
  English: BookOpen,
  Mathematics: Atom,
  Sciences: Beaker,
  Business: Briefcase,
  Arts: Palette,
  Technology: Code,
}

const subjectColors: Record<string, string> = {
  English: 'bg-blue-50 text-blue-600 border-blue-200',
  Mathematics: 'bg-green-50 text-green-600 border-green-200',
  Sciences: 'bg-purple-50 text-purple-600 border-purple-200',
  Business: 'bg-amber-50 text-amber-600 border-amber-200',
  Arts: 'bg-pink-50 text-pink-600 border-pink-200',
  Technology: 'bg-indigo-50 text-indigo-600 border-indigo-200',
}

const SpecializedChatbots = () => {
  const [businessBots, setBusinessBots] = useState<typeof subjectBots.Business | null>(null)
  /** null = loading; slug -> is_active from API */
  const [chatbotAvailability, setChatbotAvailability] = useState<Record<string, boolean> | null>(null)

  useEffect(() => {
    let isMounted = true

    const syncFromBackend = async () => {
      try {
        const chatbots = await listChatbots()
        const avail: Record<string, boolean> = {}
        chatbots.forEach((b) => {
          avail[b.slug] = b.is_active
        })
        if (isMounted) setChatbotAvailability(avail)

        const updated = subjectBots.Business.map((fallbackBot) => {
          const backendBot: Chatbot | undefined = chatbots.find(
            (bot) => bot.slug === fallbackBot.slug
          )
          if (!backendBot) return fallbackBot
          return { ...fallbackBot, name: backendBot.name || fallbackBot.name }
        })

        if (isMounted) setBusinessBots(updated)
      } catch (err) {
        console.warn('Failed to load chatbot availability from API', err)
        if (isMounted) setChatbotAvailability(null)
      }
    }

    syncFromBackend()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-500 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Sparkles className="h-4 w-4" /> AI Teaching Assistants
            </div>
            <h1 className="text-3xl font-semibold lg:text-4xl">Meet your AI co-teachers.</h1>
            <p className="text-white/80">
              Choose from our general assistant or subject-specific bots trained on curriculum data
              and pedagogical best practices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/chatbots/general-teaching-assistant"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition hover:bg-primary-50"
              >
                <Plus className="h-4 w-4" /> Start a new chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Controls */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search by subject, standard, or teaching goal"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
            <Filter className="h-4 w-4" /> All bots
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
            <Star className="h-4 w-4 text-amber-500" /> Favorites
          </button>
        </div>
      </section>

      {/* General Teaching Assistant */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">General Teaching Assistant</h2>
            <p className="mt-0.5 text-sm text-gray-500">Your all-purpose AI assistant for everyday teaching tasks</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <generalBot.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">{generalBot.name}</h3>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3" /> 4.8★
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{generalBot.description}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {generalBot.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link
                to="/chatbots/general-teaching-assistant"
                className="mt-6 inline-block rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-500"
              >
                Start chatting
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subject-Specific Specialists */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Subject-Specific Specialists</h2>
          <p className="mt-2 text-sm text-gray-600">
            Bots with deep curriculum knowledge and pedagogical expertise for each subject area
          </p>
        </div>

        {Object.entries(subjectBots).map(([subject, bots]) => {
          const SubjectIcon = subjectIcons[subject] || Bot
          const effectiveBots = subject === 'Business' && businessBots ? businessBots : bots

          return (
            <div
              key={subject}
              className="rounded-3xl border border-gray-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 shadow-md"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${subjectColors[subject]}`}>
                  <SubjectIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject}</h3>
                  <p className="text-sm text-gray-500">{effectiveBots.length} specialized bots</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {effectiveBots.map((bot, idx) => {
                  const Icon = bot.icon
                  // While loading, show cards normally; unknown slugs default to available (dedicated routes exist).
                  const isAvailable =
                    chatbotAvailability === null ||
                    chatbotAvailability[bot.slug] !== false
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border border-gray-100 bg-white p-5 ${isAvailable ? '' : 'opacity-70'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isAvailable ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-semibold ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>{bot.name}</p>
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              {bot.rating}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{bot.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        {isAvailable ? (
                          <Link
                            to={`/chatbots/${bot.slug}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-500"
                          >
                            Start chat →
                          </Link>
                        ) : (
                          <span className="text-xs font-medium text-gray-500">Temporarily unavailable</span>
                        )}
                        <span className="text-xs text-gray-400 shrink-0">Credits apply per tool</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default SpecializedChatbots

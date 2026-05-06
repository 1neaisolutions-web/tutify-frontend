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
  PlayCircle,
  Globe,
  MessageSquare,
  Search,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

interface WordProblem {
  problem: string
  context: string
  gradeLevel: string
  mathTopic: string
  solution: {
    steps: {
      step: number
      action: string
      calculation: string
      explanation: string
    }[]
    finalAnswer: string
    check: string
  }
  strategies: string[]
  similarProblems: string[]
}

interface RealWorldApplication {
  scenario: string
  mathConcepts: string[]
  problem: string
  solution: string
  extensions: string[]
  connections: string[]
}

interface ProblemSolvingStrategy {
  strategy: string
  description: string
  whenToUse: string
  steps: string[]
  example: {
    problem: string
    application: string
  }
}

interface ReasoningFramework {
  framework: string
  steps: {
    step: number
    question: string
    guidance: string
  }[]
  examples: string[]
}

const ProblemSolvingCoach = () => {
  const [activeTab, setActiveTab] = useState<'word-problems' | 'real-world' | 'strategies' | 'reasoning' | 'practice' | 'assessment'>('word-problems')
  const [gradeLevel, setGradeLevel] = useState('5')
  const [topic, setTopic] = useState('')
  const [problemInput, setProblemInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [wordProblem, setWordProblem] = useState<WordProblem | null>(null)
  const [realWorldApp, setRealWorldApp] = useState<RealWorldApplication | null>(null)
  const [strategies, setStrategies] = useState<ProblemSolvingStrategy[] | null>(null)
  const [reasoningFramework, setReasoningFramework] = useState<ReasoningFramework | null>(null)

  const handleWordProblem = async () => {
    if (!topic.trim() && !problemInput.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockProblem: WordProblem = {
        problem: problemInput || `Sarah is planning a party. She needs to buy decorations, food, and drinks. Decorations cost $45, food costs $120, and drinks cost $35. If she has a budget of $200, how much money will she have left after buying everything?`,
        context: 'Party Planning',
        gradeLevel: gradeLevel,
        mathTopic: topic || 'Addition and Subtraction',
        solution: {
          steps: [
            {
              step: 1,
              action: 'Identify what we know',
              calculation: 'Decorations: $45\nFood: $120\nDrinks: $35\nBudget: $200',
              explanation: 'List all the given information clearly.',
            },
            {
              step: 2,
              action: 'Find the total cost',
              calculation: '$45 + $120 + $35 = $200',
              explanation: 'Add all the expenses together.',
            },
            {
              step: 3,
              action: 'Calculate remaining money',
              calculation: '$200 - $200 = $0',
              explanation: 'Subtract total cost from the budget.',
            },
          ],
          finalAnswer: 'Sarah will have $0 left. She spent exactly her budget.',
          check: 'Verify: $45 + $120 + $35 = $200 ✓',
        },
        strategies: [
          'Read the problem carefully and identify key information',
          'Underline or highlight important numbers and words',
          'Determine what operation(s) are needed',
          'Set up the problem step by step',
          'Check if the answer makes sense in context',
        ],
        similarProblems: [
          'If Sarah had $250 instead, how much would she have left?',
          'If decorations cost $50 instead of $45, would she stay within budget?',
          'What is the total cost if she buys 2 sets of decorations?',
        ],
      }
      setWordProblem(mockProblem)
      setIsGenerating(false)
    }, 2000)
  }

  const handleRealWorldApplication = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockApp: RealWorldApplication = {
        scenario: 'Designing a Community Garden',
        mathConcepts: ['Area', 'Perimeter', 'Multiplication', 'Division', 'Fractions'],
        problem: 'A community wants to create a rectangular garden that is 24 feet long and 18 feet wide. They want to divide it into equal square plots for different families. Each plot should be 6 feet by 6 feet. How many plots can they create? What fraction of the garden does each plot represent?',
        solution: 'Step 1: Calculate total garden area = 24 × 18 = 432 square feet\nStep 2: Calculate area of each plot = 6 × 6 = 36 square feet\nStep 3: Number of plots = 432 ÷ 36 = 12 plots\nStep 4: Fraction per plot = 1/12 of the total garden',
        extensions: [
          'If each family can grow 8 plants per plot, how many total plants can be grown?',
          'If the garden needs a 2-foot path around the perimeter, what is the new area?',
          'Calculate the cost if fencing costs $5 per foot and soil costs $2 per square foot.',
        ],
        connections: [
          'Connects to geometry and spatial reasoning',
          'Real-world application of multiplication and division',
          'Relevant to urban planning and community development',
          'Teaches practical problem-solving skills',
        ],
      }
      setRealWorldApp(mockApp)
      setIsGenerating(false)
    }, 2000)
  }

  const handleStrategies = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockStrategies: ProblemSolvingStrategy[] = [
        {
          strategy: 'Draw a Picture or Diagram',
          description: 'Visualize the problem by creating a drawing, diagram, or model.',
          whenToUse: 'Use when the problem involves spatial relationships, geometry, or when visualizing helps understand the situation.',
          steps: [
            'Read the problem carefully',
            'Identify what needs to be visualized',
            'Draw or sketch the situation',
            'Label all given information',
            'Use the diagram to solve the problem',
          ],
          example: {
            problem: 'A rectangular field is 30 meters long and 20 meters wide. What is the perimeter?',
            application: 'Draw a rectangle, label the length (30m) and width (20m), then add all sides: 30 + 20 + 30 + 20 = 100 meters',
          },
        },
        {
          strategy: 'Make a Table or Chart',
          description: 'Organize information in a systematic way to identify patterns.',
          whenToUse: 'Use when dealing with multiple pieces of data, patterns, or when you need to compare different scenarios.',
          steps: [
            'Identify what information to organize',
            'Create columns for different categories',
            'Fill in the table with given information',
            'Look for patterns or relationships',
            'Use the pattern to solve the problem',
          ],
          example: {
            problem: 'How many hours does a student study if they study 2 hours each day for 5 days?',
            application: 'Create a table: Day 1: 2 hours, Day 2: 2 hours, Day 3: 2 hours, Day 4: 2 hours, Day 5: 2 hours. Total: 2 × 5 = 10 hours',
          },
        },
        {
          strategy: 'Work Backwards',
          description: 'Start with the answer and work backwards to find the starting point.',
          whenToUse: 'Use when you know the end result and need to find what led to it, or when forward solving is difficult.',
          steps: [
            'Identify the final result or answer',
            'Determine what operation led to this result',
            'Work backwards step by step',
            'Reverse each operation',
            'Verify by working forward',
          ],
          example: {
            problem: 'A number is multiplied by 3, then 5 is added, resulting in 17. What is the original number?',
            application: 'Start with 17, subtract 5: 17 - 5 = 12, then divide by 3: 12 ÷ 3 = 4. Check: 4 × 3 + 5 = 17 ✓',
          },
        },
        {
          strategy: 'Guess and Check',
          description: 'Make educated guesses and check if they work, adjusting as needed.',
          whenToUse: 'Use when other strategies are difficult to apply or when you need to find a specific value through trial.',
          steps: [
            'Make a reasonable guess based on the problem',
            'Check if the guess satisfies all conditions',
            'If not, adjust your guess',
            'Continue until you find the correct answer',
            'Reflect on what made your guesses better',
          ],
          example: {
            problem: 'Find two numbers that add to 15 and multiply to 56.',
            application: 'Try 7 and 8: 7 + 8 = 15 ✓, 7 × 8 = 56 ✓. Found it!',
          },
        },
        {
          strategy: 'Look for a Pattern',
          description: 'Identify patterns in numbers, shapes, or sequences to solve the problem.',
          whenToUse: 'Use when dealing with sequences, repeated operations, or when you notice regularities in the problem.',
          steps: [
            'List out several examples or cases',
            'Look for what stays the same and what changes',
            'Identify the pattern or rule',
            'Apply the pattern to find the answer',
            'Verify the pattern works',
          ],
          example: {
            problem: 'What is the 10th number in the sequence: 3, 6, 9, 12, ...?',
            application: 'Pattern: Add 3 each time. 10th number = 3 + (9 × 3) = 3 + 27 = 30',
          },
        },
      ]
      setStrategies(mockStrategies)
      setIsGenerating(false)
    }, 2000)
  }

  const handleReasoningFramework = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockFramework: ReasoningFramework = {
        framework: 'Mathematical Reasoning Process',
        steps: [
          {
            step: 1,
            question: 'What is the problem asking me to find?',
            guidance: 'Read the problem carefully and identify the question. Underline or highlight key words like "how many," "what is," "find," etc.',
          },
          {
            step: 2,
            question: 'What information do I have?',
            guidance: 'List all the numbers, facts, and conditions given in the problem. Organize this information clearly.',
          },
          {
            step: 3,
            question: 'What information do I need?',
            guidance: 'Determine what additional information or calculations are needed to solve the problem.',
          },
          {
            step: 4,
            question: 'What strategy should I use?',
            guidance: 'Consider different problem-solving strategies (draw a picture, make a table, work backwards, etc.) and choose the most appropriate one.',
          },
          {
            step: 5,
            question: 'How do I solve it step by step?',
            guidance: 'Show your work clearly, showing each step of your solution process.',
          },
          {
            step: 6,
            question: 'Does my answer make sense?',
            guidance: 'Check your answer by: (1) Re-reading the problem, (2) Checking calculations, (3) Verifying the answer is reasonable, (4) Using estimation to confirm.',
          },
        ],
        examples: [
          'Problem: A store has 48 apples. They sell 3 apples to each customer. How many customers can buy apples?\nReasoning: 48 ÷ 3 = 16 customers. Check: 16 × 3 = 48 ✓',
          'Problem: Maria has $50. She spends $23 on groceries and $15 on gas. How much does she have left?\nReasoning: $50 - $23 - $15 = $12. Check: $12 + $23 + $15 = $50 ✓',
        ],
      }
      setReasoningFramework(mockFramework)
      setIsGenerating(false)
    }, 2000)
  }

  const tabs = [
    { id: 'word-problems', label: 'Word Problems', icon: Puzzle },
    { id: 'real-world', label: 'Real-World Applications', icon: Globe },
    { id: 'strategies', label: 'Problem Strategies', icon: Lightbulb },
    { id: 'reasoning', label: 'Reasoning Framework', icon: Brain },
    { id: 'practice', label: 'Practice Generator', icon: Target },
    { id: 'assessment', label: 'Assessment Tools', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Puzzle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Problem-Solving Coach</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.8★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                </div>
                <p className="mt-2 text-orange-100">
                  Real-world math applications, word problem strategies, and mathematical reasoning development 
                  for confident problem solvers.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>Real-World Math</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Puzzle className="h-4 w-4" />
                <span>Word Problem Strategies</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Brain className="h-4 w-4" />
                <span>Mathematical Reasoning</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Lightbulb className="h-4 w-4" />
                <span>Step-by-Step Guidance</span>
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
              <p className="text-sm font-medium text-gray-600">Problems Solved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,456</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Puzzle className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Supported</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Strategies Taught</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Lightbulb className="h-6 w-6" />
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
                      ? 'border-orange-600 text-orange-600'
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
          {/* Word Problems Tab */}
          {activeTab === 'word-problems' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Math Topic (Optional)
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Addition, Fractions, Algebra"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste Word Problem or Generate
                    </label>
                    <textarea
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      placeholder="Paste a word problem here or leave blank to generate one..."
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <button
                    onClick={handleWordProblem}
                    disabled={(!topic.trim() && !problemInput.trim()) || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze Problem
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {wordProblem ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                              {wordProblem.context}
                            </span>
                            <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                              Grade {wordProblem.gradeLevel}
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {wordProblem.mathTopic}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem:</h3>
                        <p className="text-gray-700 text-base leading-relaxed bg-white p-4 rounded-lg border border-orange-200">
                          {wordProblem.problem}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-orange-600" />
                          Step-by-Step Solution
                        </h3>
                        <div className="space-y-4">
                          {wordProblem.solution.steps.map((step, idx) => (
                            <div key={idx} className="rounded-lg border-2 border-orange-200 bg-orange-50 p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{step.action}</h4>
                                  <div className="bg-white rounded-lg p-3 border border-orange-200 mb-2">
                                    <p className="text-sm font-mono text-gray-700 whitespace-pre-line">{step.calculation}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{step.explanation}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 rounded-lg bg-green-50 border-2 border-green-300">
                          <p className="text-sm font-semibold text-green-800 mb-1">Final Answer:</p>
                          <p className="text-base font-bold text-green-900">{wordProblem.solution.finalAnswer}</p>
                          <p className="text-xs text-green-700 mt-2">{wordProblem.solution.check}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          Problem-Solving Strategies
                        </h3>
                        <ul className="space-y-2">
                          {wordProblem.strategies.map((strategy, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Puzzle className="h-5 w-5 text-purple-600" />
                          Similar Practice Problems
                        </h3>
                        <ul className="space-y-2">
                          {wordProblem.similarProblems.map((problem, idx) => (
                            <li key={idx} className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-purple-200">
                              {problem}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Problem Analysis
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Puzzle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Paste a word problem or enter a topic to get step-by-step solutions and strategies
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Real-World Applications Tab */}
          {activeTab === 'real-world' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Real-World Scenario or Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Budgeting, Cooking, Sports, Shopping"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <button
                    onClick={handleRealWorldApplication}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Application
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {realWorldApp ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-orange-600" />
                          {realWorldApp.scenario}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {realWorldApp.mathConcepts.map((concept, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-white text-orange-700 text-xs font-semibold border border-orange-200">
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem:</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {realWorldApp.problem}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Solution
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line bg-white p-4 rounded-lg border border-green-200">
                          {realWorldApp.solution}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-blue-600" />
                          Extension Problems
                        </h3>
                        <ul className="space-y-2">
                          {realWorldApp.extensions.map((extension, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white p-3 rounded-lg border border-blue-200">
                              <Puzzle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{extension}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-purple-600" />
                          Real-World Connections
                        </h3>
                        <ul className="space-y-2">
                          {realWorldApp.connections.map((connection, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{connection}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Real-World Application
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter a real-world scenario or topic to generate math applications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Problem Strategies Tab */}
          {activeTab === 'strategies' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                      Problem-Solving Strategies Library
                    </h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive strategies to help students approach and solve word problems confidently.
                    </p>
                  </div>
                  <button
                    onClick={handleStrategies}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Load Strategies
                      </>
                    )}
                  </button>
                </div>

                {strategies && (
                  <div className="space-y-6">
                    {strategies.map((strategy, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{strategy.strategy}</h4>
                            <p className="text-gray-700 mb-3">{strategy.description}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                              <HelpCircle className="h-3 w-3" />
                              When to use: {strategy.whenToUse}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Steps:</p>
                          <ol className="space-y-2">
                            {strategy.steps.map((step, stepIdx) => (
                              <li key={stepIdx} className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                  {stepIdx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Example:</p>
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Problem:</p>
                            <p className="text-sm text-gray-700">{strategy.example.problem}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">Application:</p>
                            <p className="text-sm text-gray-700">{strategy.example.application}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasoning Framework Tab */}
          {activeTab === 'reasoning' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="h-6 w-6 text-indigo-600" />
                      Mathematical Reasoning Framework
                    </h3>
                    <p className="text-sm text-gray-600">
                      A systematic approach to developing mathematical reasoning and critical thinking skills.
                    </p>
                  </div>
                  <button
                    onClick={handleReasoningFramework}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Load Framework
                      </>
                    )}
                  </button>
                </div>

                {reasoningFramework && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">{reasoningFramework.framework}</h4>
                      <div className="space-y-4">
                        {reasoningFramework.steps.map((step, idx) => (
                          <div key={idx} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                                  {step.question}
                                </h5>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border border-indigo-200">
                                  {step.guidance}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-indigo-600" />
                        Example Applications
                      </h4>
                      <div className="space-y-3">
                        {reasoningFramework.examples.map((example, idx) => (
                          <div key={idx} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Practice Generator Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />
                  Practice Problem Generator
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Generate customized word problems and practice sets based on grade level and math topics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Math Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Fractions, Percentages, Algebra"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Problems</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>5 problems</option>
                      <option>10 problems</option>
                      <option>15 problems</option>
                      <option>20 problems</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>Mixed</option>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Context Type</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>Mixed Real-World</option>
                      <option>Money & Shopping</option>
                      <option>Time & Scheduling</option>
                      <option>Measurement</option>
                      <option>Sports & Games</option>
                    </select>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Practice Set
                </button>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Assessment Tools
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Create assessments to evaluate problem-solving skills and mathematical reasoning.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Problem-Solving Rubric', icon: ClipboardCheck, description: 'Assess solution process and reasoning', color: 'purple' },
                    { type: 'Word Problem Quiz', icon: Puzzle, description: 'Generate quiz with multiple word problems', color: 'pink' },
                    { type: 'Reasoning Assessment', icon: Brain, description: 'Evaluate mathematical reasoning skills', color: 'indigo' },
                    { type: 'Strategy Application', icon: Lightbulb, description: 'Test ability to apply problem-solving strategies', color: 'blue' },
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
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced AI-Powered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-World Context</h3>
            <p className="text-sm text-gray-600">
              Connect math to everyday situations: shopping, cooking, sports, travel, and more.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
              <Puzzle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Word Problem Analysis</h3>
            <p className="text-sm text-gray-600">
              Break down complex word problems into manageable steps with clear explanations.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-yellow-50 to-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reasoning Development</h3>
            <p className="text-sm text-gray-600">
              Build critical thinking and mathematical reasoning through guided frameworks.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategy Library</h3>
            <p className="text-sm text-gray-600">
              Access comprehensive problem-solving strategies with examples and when to use them.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Generator</h3>
            <p className="text-sm text-gray-600">
              Generate unlimited practice problems tailored to grade level and topics.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Monitor student progress in problem-solving skills and identify areas for improvement.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Differentiation</h3>
            <p className="text-sm text-gray-600">
              Automatically adapt problems for different skill levels and learning styles.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Alignment</h3>
            <p className="text-sm text-gray-600">
              All content aligned with Common Core Math Standards and state curricula.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemSolvingCoach




/**
 * Map problem-solving-coach capability JSON to ProblemSolvingCoach.tsx UI types.
 */
import { ensureArray, ensureString, ensureRecord } from './adapterHelpers'

export interface WordProblemUI {
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

export interface RealWorldApplicationUI {
  scenario: string
  mathConcepts: string[]
  problem: string
  solution: string
  extensions: string[]
  connections: string[]
}

export interface ProblemSolvingStrategyUI {
  strategy: string
  description: string
  whenToUse: string
  steps: string[]
  example: {
    problem: string
    application: string
  }
}

export interface ReasoningFrameworkUI {
  framework: string
  steps: {
    step: number
    question: string
    guidance: string
  }[]
  examples: string[]
}

function getVal(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k]
  }
  return undefined
}

const DEFAULT_WORD_STRATEGIES = [
  'Read the problem carefully and identify key information',
  'Underline or highlight important numbers and words',
  'Determine what operation(s) are needed',
  'Set up the problem step by step',
  'Check if the answer makes sense in context',
]

function parseSolutionStep(raw: string, index: number): WordProblemUI['solution']['steps'][0] {
  const step = index + 1
  const colonIdx = raw.indexOf(':')
  if (colonIdx > 0 && colonIdx < 60) {
    return {
      step,
      action: raw.slice(0, colonIdx).trim(),
      calculation: raw.slice(colonIdx + 1).trim(),
      explanation: '',
    }
  }
  return {
    step,
    action: `Step ${step}`,
    calculation: raw,
    explanation: 'Work through this step carefully and show your reasoning.',
  }
}

function inferMathConcepts(problem: string, steps: string[]): string[] {
  const text = `${problem} ${steps.join(' ')}`.toLowerCase()
  const concepts: string[] = []
  const checks: [RegExp, string][] = [
    [/\barea\b|\bperimeter\b|\bvolume\b|\bgeometry\b/, 'Geometry'],
    [/\bfraction|\bpercent|\bratio\b/, 'Fractions & Ratios'],
    [/\bmultiply|\bdivision|\bproduct|\bquotient\b/, 'Multiplication & Division'],
    [/\badd|\bsubtract|\bsum|\bdifference\b/, 'Addition & Subtraction'],
    [/\bgraph|\bcoordinate|\blinear\b/, 'Algebra'],
    [/\bprobability|\bstatistics|\bdata\b/, 'Statistics'],
    [/\bmeasurement|\bunit|\bconvert\b/, 'Measurement'],
  ]
  for (const [re, label] of checks) {
    if (re.test(text)) concepts.push(label)
  }
  return concepts.length ? concepts.slice(0, 5) : ['Problem Solving', 'Real-World Math']
}

function parseStrategyExample(raw: string): { problem: string; application: string } {
  const text = raw.trim()
  if (!text) return { problem: '', application: '' }

  const appMatch = text.match(/(?:application|apply):\s*(.+)/i)
  const probMatch = text.match(/(?:problem|example):\s*(.+?)(?=(?:application|apply):|$)/is)

  if (probMatch && appMatch) {
    return {
      problem: probMatch[1].trim(),
      application: appMatch[1].trim(),
    }
  }

  const parts = text.split(/\n+/)
  if (parts.length >= 2) {
    return { problem: parts[0].trim(), application: parts.slice(1).join(' ').trim() }
  }

  return { problem: 'See strategy description', application: text }
}

function descriptionToSteps(description: string): string[] {
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (sentences.length >= 2) return sentences.slice(0, 5)
  return [
    'Read and understand the problem',
    'Apply this strategy to organize your thinking',
    'Solve step by step and show your work',
    'Verify the answer makes sense in context',
  ]
}

export function mapWordProblemsResult(result: Record<string, unknown>): WordProblemUI {
  const gradeLevel = ensureString(getVal(result, 'gradeLevel', 'grade_level'))
  const mathTopic = ensureString(getVal(result, 'mathTopic', 'math_topic'), 'Mathematics')
  const problemsRaw = ensureArray<Record<string, unknown>>(result.problems)
  const p = problemsRaw[0] ?? {}

  const given = ensureArray<string>(p.given)
  const question = ensureString(p.question)
  const problemText = ensureString(p.problem)
  const fullProblem = question && !problemText.includes(question)
    ? `${problemText}\n\n${question}`.trim()
    : problemText || question

  const solutionSteps = ensureArray<string>(p.solutionSteps ?? p.solution_steps)
  const answer = ensureString(p.answer)

  const context =
    mathTopic.split(/[,/]/)[0]?.trim() ||
    problemText.split(/[.!?]/)[0]?.slice(0, 40).trim() ||
    'Word Problem'

  const similarProblems = [
    given.length
      ? `Try solving again using only these givens: ${given.join(', ')}`
      : 'Change one number in the problem and solve again.',
    `Create a similar ${mathTopic.toLowerCase()} word problem with a different context.`,
    'Explain each solution step in your own words to check understanding.',
  ]

  return {
    problem: fullProblem,
    context,
    gradeLevel,
    mathTopic,
    solution: {
      steps: solutionSteps.map(parseSolutionStep),
      finalAnswer: answer,
      check: given.length
        ? `Verify using the given information: ${given.join('; ')}`
        : 'Re-read the problem and check that your answer fits the context.',
    },
    strategies: DEFAULT_WORD_STRATEGIES,
    similarProblems,
  }
}

export function mapRealWorldApplicationResult(result: Record<string, unknown>): RealWorldApplicationUI {
  const scenario = ensureString(getVal(result, 'scenarioTopic', 'scenario_topic', 'scenario'))
  const problem = ensureString(result.problem)
  const solutionSteps = ensureArray<string>(result.solutionSteps ?? result.solution_steps)
  const answer = ensureString(result.answer)
  const extensionRaw = getVal(result, 'extension', 'extensions')

  const extensions = Array.isArray(extensionRaw)
    ? ensureArray<string>(extensionRaw)
    : ensureString(extensionRaw)
      ? [ensureString(extensionRaw)]
      : []

  const solutionBody = solutionSteps.length
    ? solutionSteps.map((s, i) => `Step ${i + 1}: ${s}`).join('\n')
    : ''
  const solution = [solutionBody, answer ? `Answer: ${answer}` : ''].filter(Boolean).join('\n')

  const mathConcepts = inferMathConcepts(problem, solutionSteps)

  return {
    scenario,
    mathConcepts,
    problem,
    solution,
    extensions,
    connections: [
      `Connects ${scenario.toLowerCase()} to grade-level mathematics`,
      'Real-world application of problem-solving and reasoning',
      `Reinforces ${mathConcepts[0]?.toLowerCase() ?? 'mathematical'} thinking in context`,
      'Supports transferable skills for everyday decision-making',
    ],
  }
}

export function mapProblemStrategiesResult(result: Record<string, unknown>): ProblemSolvingStrategyUI[] {
  const strategiesRaw = ensureArray<Record<string, unknown>>(result.strategies)
  return strategiesRaw.map((s) => {
    const description = ensureString(s.description)
    const exampleRaw = ensureString(s.example)
    return {
      strategy: ensureString(getVal(s, 'name', 'strategy')),
      description,
      whenToUse: ensureString(getVal(s, 'whenToUse', 'when_to_use')),
      steps: descriptionToSteps(description),
      example: parseStrategyExample(exampleRaw),
    }
  })
}

export function mapReasoningFrameworkResult(result: Record<string, unknown>): ReasoningFrameworkUI {
  const frameworksRaw = ensureArray<Record<string, unknown>>(result.frameworks)
  const primary = frameworksRaw[0] ?? ensureRecord(result)

  const name = ensureString(getVal(primary, 'name', 'framework'), 'Mathematical Reasoning Process')
  const stepsRaw = ensureArray<string>(primary.steps)
  const checklist = ensureArray<string>(primary.quickChecklist ?? primary.quick_checklist)

  const allExamples: string[] = []
  for (const fw of frameworksRaw) {
    allExamples.push(...ensureArray<string>(fw.quickChecklist ?? fw.quick_checklist))
  }

  return {
    framework: name,
    steps: stepsRaw.map((step, idx) => ({
      step: idx + 1,
      question: step,
      guidance: checklist[idx] ?? 'Work through this step carefully and explain your thinking.',
    })),
    examples: allExamples.length ? allExamples : checklist,
  }
}

export type DemoMcqItem = { stem: string; options: [string, string, string, string]; optionE?: string }

const PHYSICS_MCQ: DemoMcqItem[] = [
  {
    stem: 'A student measures the period of a simple pendulum. Which change most reliably increases the measured period?',
    options: ['Shortening the string', 'Increasing the bob mass only', 'Lengthening the string', 'Moving the experiment to a taller room only'],
  },
  {
    stem: 'For uniform acceleration from rest, which graph shows displacement versus time correctly?',
    options: ['Straight line through the origin', 'Horizontal line', 'Parabola opening upward from the origin', 'Hyperbola'],
  },
  {
    stem: 'The SI unit of power is equivalent to which combination?',
    options: ['J / s', 'N · m²', 'kg · m / s', 'A · Ω'],
  },
  {
    stem: 'When a block slides at constant velocity on a rough horizontal surface, the net force on the block is',
    options: ['equal to the weight', 'zero', 'equal to kinetic friction only if accelerating', 'greater than the applied push'],
  },
  {
    stem: 'Which statement best describes internal energy of an ideal gas at fixed temperature?',
    options: ['It is zero', 'It depends only on volume', 'It is proportional to the average kinetic energy of molecules', 'It decreases if pressure increases'],
  },
]

const MATH_MCQ: DemoMcqItem[] = [
  {
    stem: 'If 3x − 7 = 14, what is the value of x?',
    options: ['5', '7', '9', '11'],
  },
  {
    stem: 'A line has slope 2 and passes through (1, 5). What is its y-intercept?',
    options: ['1', '2', '3', '4'],
  },
  {
    stem: 'What is the derivative of x³ + 2x with respect to x?',
    options: ['3x² + 2', '3x²', 'x² + 2', '3x + 2'],
  },
  {
    stem: 'A fair die is rolled once. What is the probability of an even number?',
    options: ['1/6', '1/3', '1/2', '2/3'],
  },
]

const ENGLISH_MCQ: DemoMcqItem[] = [
  {
    stem: 'Which sentence uses the past perfect tense correctly?',
    options: [
      'She finished the essay before the bell rang.',
      'She had finished the essay before the bell rang.',
      'She has finished the essay before the bell rang.',
      'She finishing the essay before the bell rang.',
    ],
  },
  {
    stem: 'In “The wind whispered through the trees,” the figurative device is primarily',
    options: ['simile', 'metaphor', 'personification', 'hyperbole'],
  },
]

const DEFAULT_MCQ: DemoMcqItem[] = [
  {
    stem: 'Which option best describes a reliable source for academic revision?',
    options: ['Anonymous forum posts', 'Peer-reviewed summaries with citations', 'Social captions only', 'Unverifiable chain messages'],
  },
  {
    stem: 'A hypothesis should be',
    options: ['untestable', 'vague', 'falsifiable and clearly stated', 'identical to the conclusion'],
  },
]

const PHYSICS_SHORT = [
  'Define pressure at a point in a fluid and state its SI unit.',
  'Sketch velocity–time graphs for (i) uniform velocity and (ii) uniform acceleration from rest.',
  'Explain one advantage and one limitation of using a digital data logger instead of a stopwatch for timing oscillations.',
  'State Newton’s second law in words and give the vector equation with standard symbols.',
  'Describe how to reduce systematic error when measuring the diameter of a wire with a micrometer.',
  'Compare elastic and inelastic collisions with one example of each from everyday motion.',
]

const MATH_SHORT = [
  'Factorise x² − 5x + 6 fully.',
  'Show that the triangle with side lengths 5, 12, and 13 is right-angled.',
  'Find the equation of the line through (0, −2) parallel to y = 3x + 1.',
]

const ENGLISH_SHORT = [
  'Summarise the writer’s main argument in two sentences, using your own words.',
  'Identify two language features used to create tone in the passage and explain their effect.',
]

const DEFAULT_SHORT = [
  'Explain the key idea in one clear paragraph, using terminology from the unit.',
  'Give one worked example that illustrates the method taught this term.',
]

const PHYSICS_LONG_BANK: { stem: string; subparts: string[] }[] = [
  {
    stem: 'A car of mass 950 kg accelerates from rest along a straight horizontal road. The driving force is 3.8 kN and a constant resistive force of 600 N acts on the car.',
    subparts: [
      'Calculate the net force on the car and hence its acceleration.',
      'Determine the speed of the car after it has travelled 40 m, assuming acceleration stays constant.',
      'Discuss briefly how air resistance might change in a real journey and the effect on acceleration.',
    ],
  },
  {
    stem: 'Two resistors of 12 Ω and 6 Ω are connected in parallel across a 9 V supply.',
    subparts: [
      'Calculate the equivalent resistance of the combination.',
      'Find the total current drawn from the supply.',
      'Explain why domestic lighting circuits are usually wired in parallel rather than in series.',
    ],
  },
]

const MATH_LONG_BANK: { stem: string; subparts: string[] }[] = [
  {
    stem: 'The quadratic f(x) = x² − 6x + 5 is defined for real x.',
    subparts: [
      'Write f(x) in completed-square form and state the coordinates of the vertex.',
      'Solve f(x) = 0 and sketch the graph, labelling intercepts.',
      'Find the minimum value of f(x) on the interval [0, 4] and justify your answer.',
    ],
  },
  {
    stem: 'A geometric sequence has first term 20 and common ratio 1.1.',
    subparts: [
      'Write the first four terms of the sequence.',
      'Find the sum of the first 10 terms, correct to two decimal places.',
      'State whether the infinite series converges; justify briefly.',
    ],
  },
]

const ENGLISH_LONG_BANK: { stem: string; subparts: string[] }[] = [
  {
    stem: 'Read the following viewpoint: “Technology in the classroom distracts more than it helps.”',
    subparts: [
      'Outline two arguments that could support this claim.',
      'Present a counter-argument with one concrete example from learning.',
      'Write a balanced conclusion (about 60–80 words) suitable for an editorial.',
    ],
  },
  {
    stem: 'Compare how two writers use evidence to persuade the reader in the extracts you have studied.',
    subparts: [
      'Identify the main claim in each extract.',
      'Comment on the type and quality of evidence used in each.',
      'Which text do you find more convincing, and why?',
    ],
  },
]

const DEFAULT_LONG_BANK: { stem: string; subparts: string[] }[] = [
  {
    stem: 'Analyse how the curriculum topic for this exam connects to a real-world context of your choice.',
    subparts: [
      'State the context and the main concept being assessed.',
      'Explain the connection using at least two specific points.',
      'Suggest one extension question a teacher could use for differentiation.',
    ],
  },
  {
    stem: 'Evaluate how feedback from a peer review improved the clarity of a draft explanation.',
    subparts: [
      'Summarise one change you made after feedback.',
      'Explain why that change improved clarity for a reader.',
      'Name one further improvement you would still make.',
    ],
  },
]

function subjectBand(subject: string): 'physics' | 'math' | 'english' | 'default' {
  const s = subject.toLowerCase()
  if (s.includes('phys') || s.includes('physical science')) return 'physics'
  if (s.includes('math')) return 'math'
  if (s.includes('english') || s.includes('liter')) return 'english'
  return 'default'
}

function mcqBank(subject: string): DemoMcqItem[] {
  switch (subjectBand(subject)) {
    case 'physics':
      return PHYSICS_MCQ
    case 'math':
      return MATH_MCQ
    case 'english':
      return ENGLISH_MCQ
    default:
      return DEFAULT_MCQ
  }
}

function shortBank(subject: string): string[] {
  switch (subjectBand(subject)) {
    case 'physics':
      return PHYSICS_SHORT
    case 'math':
      return MATH_SHORT
    case 'english':
      return ENGLISH_SHORT
    default:
      return DEFAULT_SHORT
  }
}

function longBank(subject: string): { stem: string; subparts: string[] }[] {
  switch (subjectBand(subject)) {
    case 'physics':
      return PHYSICS_LONG_BANK
    case 'math':
      return MATH_LONG_BANK
    case 'english':
      return ENGLISH_LONG_BANK
    default:
      return DEFAULT_LONG_BANK
  }
}

/** Fifth distractor when paper uses five options — generic but plausible. */
const OPTION_E_EXTRA = 'None of the above'

export function getDemoMcq(subject: string, questionIndex1: number, optionCount: 4 | 5): { stem: string; options: string[] } {
  const bank = mcqBank(subject)
  const item = bank[(questionIndex1 - 1 + bank.length * 10) % bank.length]!
  const base = [...item.options] as string[]
  if (optionCount === 5) {
    base.push(item.optionE ?? OPTION_E_EXTRA)
  }
  return { stem: item.stem, options: base }
}

export function getDemoShortStem(subject: string, index0: number): string {
  const bank = shortBank(subject)
  return bank[index0 % bank.length]!
}

export function getDemoLongBlock(subject: string, longIndex0: number): { stem: string; subparts: string[] } {
  const bank = longBank(subject)
  const base = bank[longIndex0 % bank.length]!
  return { stem: base.stem, subparts: [...base.subparts] }
}

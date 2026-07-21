/**
 * Subject-organized canned Doubt Solver content — richer than a generic 4-step template.
 * Matched by keyword against the student's typed problem; falls back to a general solve path.
 */

export const DOUBT_TOPICS = [
  {
    id: 'logarithms',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    topic: 'Logarithms',
    keywords: ['log', 'logarithm', 'ln(', 'change of base', 'logarithms'],
    confidence: 0.93,
    steps: [
      'Identify the log form: logₐ(b) = c means aᶜ = b. Write down what a, b, and c are in your problem.',
      'Pick the right property — Product: log(mn) = log(m) + log(n); Quotient: log(m/n) = log(m) − log(n); Power: log(mᵏ) = k·log(m).',
      'If bases differ, apply change of base: logₐ(b) = ln(b) / ln(a) (or log₁₀(b) / log₁₀(a)).',
      'Rewrite the equation using the property, simplify both sides, and solve for the unknown.',
      'Check your answer by substituting back into the original log equation.',
    ],
    answer: 'Apply the matching log property, then change-of-base if needed, and verify by substitution.',
    practiceProblems: [
      'Solve for x: log₂(x) = 5',
      'Simplify: log₃(9) + log₃(3)',
      'Which is equivalent to logₐ(b/c)? Explain using the quotient rule.',
      'Evaluate log₅(1/25) using the power rule.',
    ],
  },
  {
    id: 'factoring',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    topic: 'Factoring',
    keywords: ['factor', 'trinomial', 'x^2', 'x²', 'quadratic', 'polynomial'],
    confidence: 0.9,
    steps: [
      'Write the trinomial in standard form ax² + bx + c and note the values of a, b, and c.',
      'If a = 1, find two numbers that multiply to c and add to b — these become your factor pair.',
      'If a ≠ 1, use the "ac method": multiply a·c, find factors of that product summing to b, then split the middle term.',
      'Rewrite as two binomials, e.g. x² + 5x + 6 = (x + 2)(x + 3).',
      'Check your factoring by expanding (FOIL) the binomials back out.',
    ],
    answer: 'Find the factor pair that multiplies to c and sums to b, then write as two binomials and verify by expanding.',
    practiceProblems: [
      'Factor completely: x² + 5x + 6',
      'Factor: x² − 16',
      'Expand and check: (x + 4)(x − 2)',
      'Factor: 2x² + 7x + 3 (a ≠ 1 — use the ac method)',
    ],
  },
  {
    id: 'quadratic-formula',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    topic: 'Quadratic Formula',
    keywords: ['quadratic formula', 'discriminant', 'ax^2+bx+c', 'ax²+bx+c'],
    confidence: 0.88,
    steps: [
      'Confirm the equation is in standard form ax² + bx + c = 0.',
      'Compute the discriminant Δ = b² − 4ac to see how many real solutions exist.',
      'Substitute a, b, c into x = (−b ± √(b² − 4ac)) / 2a.',
      'Simplify the square root and reduce the fraction if possible.',
      'Write both solutions (from + and −) and check one by substitution.',
    ],
    answer: 'x = (−b ± √(b² − 4ac)) / 2a, after computing the discriminant.',
    practiceProblems: [
      'Find the discriminant of x² − 4x + 4.',
      'Solve using the quadratic formula: 2x² + 3x − 5 = 0',
      'How many real solutions does x² + x + 1 = 0 have?',
    ],
  },
  {
    id: 'exponentials',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    topic: 'Exponentials',
    keywords: ['exponential', '2^x', '3^x', 'exponent rule'],
    confidence: 0.85,
    steps: [
      'Identify the base and exponent, and whether both sides can be written with the same base.',
      'If bases match, set exponents equal to each other and solve.',
      'If bases don\u2019t match, take log of both sides and use log properties to bring exponents down.',
      'Solve the resulting linear (or simple) equation for the variable.',
    ],
    answer: 'Match bases (or apply logs) to isolate and solve for the exponent.',
    practiceProblems: ['Solve: 3ˣ = 27', 'Evaluate f(3) if f(x) = 2ˣ', 'Solve: 5ˣ = 40 (use logs)'],
  },
  {
    id: 'cell-biology',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Cell Structure',
    keywords: ['mitochondria', 'organelle', 'cell structure', 'nucleus', 'ribosome'],
    confidence: 0.87,
    steps: [
      'List the organelle(s) mentioned and their primary job in the cell.',
      'Connect structure to function — e.g. mitochondria have folded membranes (cristae) to maximize ATP production surface area.',
      'Compare to a related organelle to avoid mixing up functions on the exam.',
    ],
    answer: 'Match each organelle to its one main function, then relate structure to that function.',
    practiceProblems: ['Which organelle produces ATP?', 'What does the nucleus control?', 'Compare rough vs. smooth ER.'],
  },
  {
    id: 'mitosis',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Mitosis',
    keywords: ['mitosis', 'prophase', 'metaphase', 'anaphase', 'telophase'],
    confidence: 0.86,
    steps: [
      'List the four phases in order: prophase → metaphase → anaphase → telophase.',
      'For each phase, name the one key event (e.g. anaphase = sister chromatids separate).',
      'Remember the result: two identical diploid daughter cells.',
    ],
    answer: 'Prophase, metaphase, anaphase, telophase — ending in two identical diploid cells.',
    practiceProblems: ['What happens during anaphase?', 'Mitosis produces how many cells, and are they identical?'],
  },
  {
    id: 'enzymes',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Enzymes',
    keywords: ['enzyme', 'activation energy', 'denature', 'catalyst'],
    confidence: 0.84,
    steps: [
      'State what the enzyme lowers: activation energy, speeding up the reaction.',
      'Note that enzyme activity rises with temperature until it denatures (loses shape) past its optimum.',
      'Identify the optimal pH range for this specific enzyme — it varies by enzyme.',
    ],
    answer: 'Enzymes lower activation energy and work best within an optimal temperature/pH range before denaturing.',
    practiceProblems: ['Why does enzyme activity drop at high temperatures?', 'What are enzymes mostly made of?'],
  },
  {
    id: 'newton',
    subject: 'Physics',
    subjectId: 'physics',
    topic: "Newton's Laws",
    keywords: ['newton', "newton's", '3rd law', 'third law'],
    confidence: 0.82,
    steps: ['Identify the interacting objects.', 'Write the force pair (A on B, B on A).', 'Note they are equal in magnitude and opposite in direction.'],
    answer: 'Equal and opposite forces act on two different objects.',
    practiceProblems: ['A swimmer pushes water back—what pushes the swimmer forward?', 'A ball hits a wall—what is the reaction force?'],
  },
  {
    id: 'photosynthesis',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Photosynthesis',
    keywords: ['photosynthesis', 'chlorophyll', 'calvin cycle'],
    confidence: 0.85,
    steps: ['Light reactions make ATP/NADPH.', 'The Calvin cycle uses CO₂ to build sugars.', 'Oxygen is released from splitting water.'],
    answer: 'Light → ATP/NADPH → CO₂ fixed into sugar; O₂ released.',
    practiceProblems: ['Where does the Calvin cycle occur?', 'What is the role of chlorophyll?', 'Why is water needed?'],
  },
];

export const GENERAL_FALLBACK = {
  id: 'general',
  subject: 'General',
  subjectId: null,
  topic: 'General',
  confidence: 0.55,
  steps: ['Identify what you know and what you need to find.', 'Pick a method or formula that fits the problem type.', 'Solve step by step, showing your work.', 'Verify the result makes sense in context.'],
  answer: 'See steps above for a general problem-solving approach.',
  practiceProblems: [],
};

export function matchDoubtTopic(problem, subjectHint) {
  const text = String(problem || '').toLowerCase();
  const bySubject = subjectHint
    ? DOUBT_TOPICS.filter((t) => t.subject.toLowerCase() === String(subjectHint).toLowerCase() || t.subjectId === subjectHint)
    : DOUBT_TOPICS;
  const pool = bySubject.length ? bySubject : DOUBT_TOPICS;
  const match = pool.find((t) => t.keywords?.some((k) => text.includes(k)));
  if (match) return match;
  // fall back to searching the full bank in case subject filter excluded the right match
  const anyMatch = DOUBT_TOPICS.find((t) => t.keywords?.some((k) => text.includes(k)));
  return anyMatch || GENERAL_FALLBACK;
}

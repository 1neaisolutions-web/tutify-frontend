/**
 * Unified Maya Chen demo dataset — single source of truth for student portal Phase A.
 * Persona: Grade 10, Algebra II midterm in 3 days, Logarithms weak @ 68% mastery.
 */

export const MAYA_PROFILE = {
  name: 'Maya Chen',
  grade: '10',
  school: 'Suburban Texas public high school',
  goal: 'Raise my Algebra II grade to a B by the midterm',
} as const;

export const MAYA_SUBJECTS = [
  { id: 'algebra-ii', name: 'Algebra II', shortName: 'Algebra II', teacherId: 't1' },
  { id: 'biology', name: 'Biology', shortName: 'Biology', teacherId: 't2' },
  { id: 'english-ii', name: 'English II', shortName: 'English II', teacherId: 't1' },
  { id: 'world-history', name: 'World History', shortName: 'World History', teacherId: 't2' },
] as const;

const hoursFromNow = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
const daysFromNow = (d: number) => hoursFromNow(d * 24);

export const MAYA_ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Algebra II: Chapter 6 Factoring Practice',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    dueAt: hoursFromNow(6),
    status: 'not_started',
    requirements:
      'Complete problems 1–20 on factoring polynomials. Show all steps. Submit typed or clear photo of work.',
    rubric: [
      { id: 'r1', criterion: 'Correct factoring', maxPoints: 40, earned: null as number | null },
      { id: 'r2', criterion: 'Shows work / steps', maxPoints: 30, earned: null as number | null },
      { id: 'r3', criterion: 'Notation & clarity', maxPoints: 20, earned: null as number | null },
      { id: 'r4', criterion: 'On-time submission', maxPoints: 10, earned: null as number | null },
    ],
  },
  {
    id: 'a2',
    title: 'Biology: Enzyme activity lab questions',
    subject: 'Biology',
    subjectId: 'biology',
    dueAt: daysFromNow(2),
    status: 'in_progress',
    requirements: 'Answer lab questions on enzyme activity vs. temperature. Cite your data table.',
    rubric: [
      { id: 'r1', criterion: 'Data interpretation', maxPoints: 40, earned: null as number | null },
      { id: 'r2', criterion: 'Scientific reasoning', maxPoints: 40, earned: null as number | null },
      { id: 'r3', criterion: 'Clarity', maxPoints: 20, earned: null as number | null },
    ],
  },
  {
    id: 'a3',
    title: 'English II: Persuasive essay outline',
    subject: 'English II',
    subjectId: 'english-ii',
    dueAt: daysFromNow(4),
    status: 'not_started',
    requirements: 'Submit a thesis + 3 supporting claim outlines for your persuasive essay.',
    rubric: [
      { id: 'r1', criterion: 'Thesis clarity', maxPoints: 30, earned: null as number | null },
      { id: 'r2', criterion: 'Evidence plan', maxPoints: 40, earned: null as number | null },
      { id: 'r3', criterion: 'Structure', maxPoints: 30, earned: null as number | null },
    ],
  },
  {
    id: 'a4',
    title: 'Algebra II: Logarithms warm-up set',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    dueAt: hoursFromNow(-48),
    status: 'graded',
    requirements: 'Complete the logarithms warm-up (10 problems).',
    rubric: [
      { id: 'r1', criterion: 'Correct answers', maxPoints: 50, earned: 32 },
      { id: 'r2', criterion: 'Shows work / steps', maxPoints: 30, earned: 18 },
      { id: 'r3', criterion: 'Notation & clarity', maxPoints: 10, earned: 8 },
      { id: 'r4', criterion: 'On-time submission', maxPoints: 10, earned: 10 },
    ],
    feedback:
      'Strong effort on product/quotient rules. Missing step 3 on problems involving change-of-base. Review logₐ(b) = ln(b)/ln(a) before the midterm.',
    teacherComment: 'Focus on Logarithms this week — this is dragging your Algebra II mastery.',
    submittedText:
      '1) log₂(8)=3\n2) log₅(25)=2\n3) log(100)=2\n…\n(steps incomplete on #7–#9)',
  },
  {
    id: 'a5',
    title: 'World History: Industrial Revolution short answers',
    subject: 'World History',
    subjectId: 'world-history',
    dueAt: daysFromNow(5),
    status: 'revision_requested',
    requirements: 'Answer 4 short-response prompts on causes and effects of industrialization.',
    rubric: [
      { id: 'r1', criterion: 'Historical accuracy', maxPoints: 40, earned: 28 },
      { id: 'r2', criterion: 'Evidence from sources', maxPoints: 40, earned: 24 },
      { id: 'r3', criterion: 'Writing quality', maxPoints: 20, earned: 16 },
    ],
    feedback: 'Revise question 2 with a primary-source citation. Otherwise on track.',
  },
] as const;

export const MAYA_EXAMS = [
  {
    id: 'ex1',
    title: 'Algebra II Midterm',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    startsAt: daysFromNow(3),
    durationMin: 90,
    questions: [
      {
        id: 'q1',
        prompt: 'Factor completely: x² + 5x + 6',
        choices: ['(x+2)(x+3)', '(x+1)(x+6)', '(x−2)(x−3)', '(x+5)(x+1)'],
        correctIndex: 0,
        topic: 'Factoring',
      },
      {
        id: 'q2',
        prompt: 'Solve for x: log₂(x) = 5',
        choices: ['x = 10', 'x = 25', 'x = 32', 'x = 16'],
        correctIndex: 2,
        topic: 'Logarithms',
      },
      {
        id: 'q3',
        prompt: 'Simplify: log₃(9) + log₃(3)',
        choices: ['2', '3', '4', '1'],
        correctIndex: 1,
        topic: 'Logarithms',
      },
      {
        id: 'q4',
        prompt: 'Which is equivalent to logₐ(b/c)?',
        choices: ['logₐ(b) − logₐ(c)', 'logₐ(b) + logₐ(c)', 'logₐ(b)·logₐ(c)', 'logₐ(b)/logₐ(c)'],
        correctIndex: 0,
        topic: 'Logarithms',
      },
      {
        id: 'q5',
        prompt: 'Solve: x² − 9 = 0',
        choices: ['x = 3 only', 'x = ±3', 'x = 9', 'x = −9'],
        correctIndex: 1,
        topic: 'Quadratics',
      },
      {
        id: 'q6',
        prompt: 'The quadratic formula for ax²+bx+c=0 is:',
        choices: [
          'x = (−b ± √(b²−4ac)) / (2a)',
          'x = (b ± √(b²−4ac)) / (2a)',
          'x = (−b ± √(b²+4ac)) / (2a)',
          'x = (−b ± √(b²−4ac)) / a',
        ],
        correctIndex: 0,
        topic: 'Quadratic Formula',
      },
      {
        id: 'q7',
        prompt: 'Expand: (x+4)(x−2)',
        choices: ['x² + 2x − 8', 'x² − 2x − 8', 'x² + 6x − 8', 'x² + 2x + 8'],
        correctIndex: 0,
        topic: 'Factoring',
      },
      {
        id: 'q8',
        prompt: 'Convert to exponential form: log₅(25) = 2',
        choices: ['5² = 25', '25² = 5', '2⁵ = 25', '5²⁵ = 2'],
        correctIndex: 0,
        topic: 'Logarithms',
      },
      {
        id: 'q9',
        prompt: 'Find the vertex of y = (x−3)² + 2',
        choices: ['(3, 2)', '(−3, 2)', '(3, −2)', '(2, 3)'],
        correctIndex: 0,
        topic: 'Quadratics',
      },
      {
        id: 'q10',
        prompt: 'Evaluate: log₁₀(1000)',
        choices: ['2', '3', '4', '10'],
        correctIndex: 1,
        topic: 'Logarithms',
      },
      {
        id: 'q11',
        prompt: 'If f(x)=2ˣ, then f(3)=',
        choices: ['6', '8', '9', '5'],
        correctIndex: 1,
        topic: 'Exponentials',
      },
      {
        id: 'q12',
        prompt: 'Solve: 3ˣ = 27',
        choices: ['x=2', 'x=3', 'x=9', 'x=4'],
        correctIndex: 1,
        topic: 'Exponentials',
      },
      {
        id: 'q13',
        prompt: 'Discriminant of x²−4x+4 is:',
        choices: ['0', '4', '8', '−4'],
        correctIndex: 0,
        topic: 'Quadratic Formula',
      },
      {
        id: 'q14',
        prompt: 'log₂(1/8) =',
        choices: ['−3', '3', '−2', '1/3'],
        correctIndex: 0,
        topic: 'Logarithms',
      },
      {
        id: 'q15',
        prompt: 'Factor: x² − 16',
        choices: ['(x−4)(x+4)', '(x−8)(x+2)', '(x−4)²', '(x+4)²'],
        correctIndex: 0,
        topic: 'Factoring',
      },
    ],
  },
] as const;

export const MAYA_QUIZZES = [
  {
    id: 'qz1',
    title: 'Algebra II — Factoring & Logarithms Check',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    timeLimitSec: 600,
    questions: [
      {
        id: 'qq1',
        prompt: 'Factor: x² + 5x + 6',
        choices: ['(x+2)(x+3)', '(x+1)(x+6)', '(x−2)(x+3)', '(x+5)(x+1)'],
        correctIndex: 0,
        topic: 'Factoring',
        hint: 'Find two numbers that multiply to 6 and add to 5.',
      },
      {
        id: 'qq2',
        prompt: 'log₂(16) =',
        choices: ['2', '4', '8', '16'],
        correctIndex: 1,
        topic: 'Logarithms',
        hint: '2 to what power equals 16?',
      },
      {
        id: 'qq3',
        prompt: 'Simplify: log₅(25)',
        choices: ['5', '2', '25', '1'],
        correctIndex: 1,
        topic: 'Logarithms',
        hint: '5² = 25, so the log is 2.',
      },
      {
        id: 'qq4',
        prompt: 'Which property: log(a) − log(b) = log(a/b)?',
        choices: ['Product', 'Quotient', 'Power', 'Change of base'],
        correctIndex: 1,
        topic: 'Logarithms',
        hint: 'Subtraction of logs corresponds to division inside.',
      },
      {
        id: 'qq5',
        prompt: 'Solve: x² − 5x + 6 = 0',
        choices: ['x=2,3', 'x=1,6', 'x=−2,−3', 'x=5,1'],
        correctIndex: 0,
        topic: 'Factoring',
        hint: 'Factor into (x−2)(x−3)=0.',
      },
    ],
  },
  {
    id: 'qz2',
    title: 'Biology — Cell Structure Quick Check',
    subject: 'Biology',
    subjectId: 'biology',
    timeLimitSec: 480,
    questions: [
      {
        id: 'bq1',
        prompt: 'Which organelle produces ATP?',
        choices: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'],
        correctIndex: 1,
        topic: 'Cell Structure',
        hint: 'Powerhouse of the cell.',
      },
      {
        id: 'bq2',
        prompt: 'Mitosis produces:',
        choices: ['4 haploid cells', '2 identical diploid cells', '1 diploid cell', 'Gametes only'],
        correctIndex: 1,
        topic: 'Mitosis',
        hint: 'Somatic cell division yields two identical cells.',
      },
      {
        id: 'bq3',
        prompt: 'Enzymes are mostly:',
        choices: ['Lipids', 'Proteins', 'Carbs', 'Nucleic acids'],
        correctIndex: 1,
        topic: 'Enzymes',
        hint: 'Biological catalysts are proteins.',
      },
    ],
  },
  {
    id: 'qz-fixit-logs',
    title: 'Fix-it: Logarithm Rules (3 questions)',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    timeLimitSec: 300,
    isFixIt: true,
    questions: [
      {
        id: 'fi1',
        prompt: 'logₐ(b) − logₐ(c) =',
        choices: ['logₐ(b/c)', 'logₐ(bc)', 'logₐ(b)^c', 'c·logₐ(b)'],
        correctIndex: 0,
        topic: 'Logarithms',
        hint: 'Quotient rule.',
      },
      {
        id: 'fi2',
        prompt: 'Change of base: logₐ(b) =',
        choices: ['ln(b)/ln(a)', 'ln(a)/ln(b)', 'a/b', 'b/a'],
        correctIndex: 0,
        topic: 'Logarithms',
        hint: 'Divide natural logs.',
      },
      {
        id: 'fi3',
        prompt: 'log₂(1/4) =',
        choices: ['−2', '2', '1/2', '−4'],
        correctIndex: 0,
        topic: 'Logarithms',
        hint: '2^(−2)=1/4.',
      },
    ],
  },
] as const;

export type TopicLevel = 'strong' | 'moderate' | 'weak' | 'not_assessed';

export const MAYA_PROGRESS = {
  subjects: [
    {
      id: 'algebra-ii',
      name: 'Algebra II',
      masteryPct: 68,
      trend: 'declining' as const,
      assignmentsDone: 6,
      totalAssignments: 8,
      quizAvg: 68,
      topics: [
        { id: 'factoring', name: 'Factoring', level: 'strong' as TopicLevel, score: 88 },
        { id: 'logarithms', name: 'Logarithms', level: 'weak' as TopicLevel, score: 52 },
        { id: 'quadratic-formula', name: 'Quadratic Formula', level: 'moderate' as TopicLevel, score: 70 },
        { id: 'exponentials', name: 'Exponentials', level: 'moderate' as TopicLevel, score: 72 },
        { id: 'sequences', name: 'Sequences', level: 'not_assessed' as TopicLevel, score: null },
      ],
      scoreHistory: [
        { id: 'sh1', date: daysFromNow(-21), label: 'Quiz: Factoring', score: 90, topic: 'Factoring' },
        { id: 'sh2', date: daysFromNow(-14), label: 'Assignment: Quadratics', score: 78, topic: 'Quadratic Formula' },
        { id: 'sh3', date: daysFromNow(-7), label: 'Quiz: Intro Logs', score: 55, topic: 'Logarithms' },
        { id: 'sh4', date: daysFromNow(-2), label: 'Warm-up: Logarithms', score: 64, topic: 'Logarithms' },
      ],
      recommendation: {
        title: 'Focus 20 min on Logarithms this week',
        detail: 'Logarithms are dragging your Algebra II mastery down ~8 points. Midterm in 3 days.',
        topicId: 'logarithms',
        actionPath: '/student/doubt-solver',
      },
    },
    {
      id: 'biology',
      name: 'Biology',
      masteryPct: 82,
      trend: 'stable' as const,
      assignmentsDone: 4,
      totalAssignments: 5,
      quizAvg: 82,
      topics: [
        { id: 'cell-structure', name: 'Cell Structure', level: 'strong' as TopicLevel, score: 90 },
        { id: 'mitosis', name: 'Mitosis', level: 'moderate' as TopicLevel, score: 75 },
        { id: 'enzymes', name: 'Enzymes', level: 'moderate' as TopicLevel, score: 78 },
      ],
      scoreHistory: [
        { id: 'bh1', date: daysFromNow(-10), label: 'Quiz: Cells', score: 88, topic: 'Cell Structure' },
        { id: 'bh2', date: daysFromNow(-4), label: 'Lab: Enzymes', score: 80, topic: 'Enzymes' },
      ],
      recommendation: {
        title: 'Quick mitosis review before Thursday quiz',
        detail: 'Solid overall — one short review pass on mitosis phases.',
        topicId: 'mitosis',
        actionPath: '/student/quizzes',
      },
    },
    {
      id: 'english-ii',
      name: 'English II',
      masteryPct: 75,
      trend: 'improving' as const,
      assignmentsDone: 3,
      totalAssignments: 4,
      quizAvg: 75,
      topics: [
        { id: 'thesis', name: 'Thesis writing', level: 'moderate' as TopicLevel, score: 72 },
        { id: 'evidence', name: 'Evidence & citation', level: 'strong' as TopicLevel, score: 85 },
      ],
      scoreHistory: [
        { id: 'eh1', date: daysFromNow(-12), label: 'Essay draft 1', score: 70, topic: 'Thesis writing' },
      ],
      recommendation: {
        title: 'Outline your persuasive essay early',
        detail: 'Assignment due in 4 days — draft the thesis tonight.',
        topicId: 'thesis',
        actionPath: '/student/assignments',
      },
    },
    {
      id: 'world-history',
      name: 'World History',
      masteryPct: 71,
      trend: 'stable' as const,
      assignmentsDone: 2,
      totalAssignments: 3,
      quizAvg: 71,
      topics: [
        { id: 'industrial-rev', name: 'Industrial Revolution', level: 'moderate' as TopicLevel, score: 70 },
      ],
      scoreHistory: [
        { id: 'wh1', date: daysFromNow(-5), label: 'Short answers draft', score: 68, topic: 'Industrial Revolution' },
      ],
      recommendation: {
        title: 'Add a primary source to Q2',
        detail: 'Revision requested — cite one primary source and resubmit.',
        topicId: 'industrial-rev',
        actionPath: '/student/assignments/a5',
      },
    },
  ],
} as const;

export const MAYA_TEACHERS = [
  {
    id: 't1',
    name: 'Ms. Ortiz',
    subject: 'Algebra II',
    subjectId: 'algebra-ii',
    email: 'ortiz@example.edu',
    room: 'B214',
  },
  {
    id: 't2',
    name: 'Mr. Patel',
    subject: 'Biology',
    subjectId: 'biology',
    email: 'patel@example.edu',
    room: 'C108',
  },
] as const;

export const MAYA_GRADEBOOK = {
  'algebra-ii': {
    subjectId: 'algebra-ii',
    name: 'Algebra II',
    categories: [
      { id: 'hw', name: 'Homework', weight: 0.2, currentAvg: 88 },
      { id: 'quiz', name: 'Quizzes', weight: 0.3, currentAvg: 74 },
      { id: 'exam', name: 'Exams', weight: 0.5, currentAvg: 70 },
    ],
    targetGrade: 80,
  },
  biology: {
    subjectId: 'biology',
    name: 'Biology',
    categories: [
      { id: 'hw', name: 'Homework', weight: 0.25, currentAvg: 90 },
      { id: 'lab', name: 'Labs', weight: 0.25, currentAvg: 85 },
      { id: 'quiz', name: 'Quizzes', weight: 0.25, currentAvg: 82 },
      { id: 'exam', name: 'Exams', weight: 0.25, currentAvg: 78 },
    ],
    targetGrade: 85,
  },
} as const;

export const MAYA_TIMETABLE = {
  Monday: [
    { period: 1, subject: 'Algebra II', subjectId: 'algebra-ii', time: '8:00–8:50', room: 'B214', teacher: 'Ms. Ortiz' },
    { period: 2, subject: 'Biology', subjectId: 'biology', time: '8:55–9:45', room: 'C108', teacher: 'Mr. Patel' },
    { period: 3, subject: 'English II', subjectId: 'english-ii', time: '9:50–10:40', room: 'A101', teacher: 'Ms. Ortiz' },
    { period: 4, subject: 'World History', subjectId: 'world-history', time: '10:45–11:35', room: 'D220', teacher: 'Mr. Patel' },
    { period: 5, subject: 'PE', subjectId: 'pe', time: '12:20–1:10', room: 'Gym', teacher: 'Coach Lee' },
  ],
  Tuesday: [
    { period: 1, subject: 'Algebra II', subjectId: 'algebra-ii', time: '8:00–8:50', room: 'B214', teacher: 'Ms. Ortiz' },
    { period: 2, subject: 'Biology', subjectId: 'biology', time: '8:55–9:45', room: 'C108', teacher: 'Mr. Patel' },
    { period: 3, subject: 'English II', subjectId: 'english-ii', time: '9:50–10:40', room: 'A101', teacher: 'Ms. Ortiz' },
    { period: 4, subject: 'World History', subjectId: 'world-history', time: '10:45–11:35', room: 'D220', teacher: 'Mr. Patel' },
    { period: 5, subject: 'PE', subjectId: 'pe', time: '12:20–1:10', room: 'Gym', teacher: 'Coach Lee' },
  ],
  Wednesday: [
    { period: 1, subject: 'Algebra II', subjectId: 'algebra-ii', time: '8:00–8:50', room: 'B214', teacher: 'Ms. Ortiz' },
    { period: 2, subject: 'Biology', subjectId: 'biology', time: '8:55–9:45', room: 'C108', teacher: 'Mr. Patel' },
    { period: 3, subject: 'English II', subjectId: 'english-ii', time: '9:50–10:40', room: 'A101', teacher: 'Ms. Ortiz' },
    { period: 4, subject: 'World History', subjectId: 'world-history', time: '10:45–11:35', room: 'D220', teacher: 'Mr. Patel' },
    { period: 5, subject: 'Advisory', subjectId: 'advisory', time: '12:20–1:10', room: 'B214', teacher: 'Ms. Ortiz' },
  ],
  Thursday: [
    { period: 1, subject: 'Algebra II', subjectId: 'algebra-ii', time: '8:00–8:50', room: 'B214', teacher: 'Ms. Ortiz' },
    { period: 2, subject: 'Biology', subjectId: 'biology', time: '8:55–9:45', room: 'C108', teacher: 'Mr. Patel' },
    { period: 3, subject: 'English II', subjectId: 'english-ii', time: '9:50–10:40', room: 'A101', teacher: 'Ms. Ortiz' },
    { period: 4, subject: 'World History', subjectId: 'world-history', time: '10:45–11:35', room: 'D220', teacher: 'Mr. Patel' },
    { period: 5, subject: 'PE', subjectId: 'pe', time: '12:20–1:10', room: 'Gym', teacher: 'Coach Lee' },
  ],
  Friday: [
    { period: 1, subject: 'Algebra II', subjectId: 'algebra-ii', time: '8:00–8:50', room: 'B214', teacher: 'Ms. Ortiz' },
    { period: 2, subject: 'Biology', subjectId: 'biology', time: '8:55–9:45', room: 'C108', teacher: 'Mr. Patel' },
    { period: 3, subject: 'English II', subjectId: 'english-ii', time: '9:50–10:40', room: 'A101', teacher: 'Ms. Ortiz' },
    { period: 4, subject: 'World History', subjectId: 'world-history', time: '10:45–11:35', room: 'D220', teacher: 'Mr. Patel' },
    { period: 5, subject: 'Club period', subjectId: 'club', time: '12:20–1:10', room: 'Various', teacher: '—' },
  ],
} as const;

export const MAYA_CONTENT = {
  biology: {
    id: 'biology',
    name: 'Biology',
    worksheets: [
      {
        id: 'ws-cell',
        title: 'Cell Structure Reading',
        body: 'Cells are the basic unit of life. Prokaryotic cells lack a nucleus; eukaryotic cells have membrane-bound organelles. Mitochondria generate ATP through cellular respiration. The nucleus stores DNA and controls gene expression.',
      },
      {
        id: 'ws-mitosis',
        title: 'Mitosis Worksheet',
        body: 'Mitosis stages: prophase (chromosomes condense), metaphase (align at equator), anaphase (sister chromatids separate), telophase (nuclei reform), cytokinesis (cytoplasm divides). Result: two identical diploid cells.',
      },
      {
        id: 'ws-enzyme',
        title: 'Enzyme Lab Prep',
        body: 'Enzymes lower activation energy. Activity rises with temperature until denaturation. Optimal pH depends on the enzyme (e.g., pepsin vs. trypsin). Record rate of reaction vs. temperature for your lab write-up.',
      },
    ],
  },
  'algebra-ii': {
    id: 'algebra-ii',
    name: 'Algebra II',
    worksheets: [
      {
        id: 'ws-factor',
        title: 'Factoring Practice Sheet',
        body: 'Factor trinomials of the form x²+bx+c by finding two numbers that multiply to c and add to b. Example: x²+5x+6 = (x+2)(x+3). Always check by expanding.',
      },
      {
        id: 'ws-logs',
        title: 'Logarithms Study Guide',
        body: 'Definition: logₐ(b)=c means a^c=b. Product rule: log(mn)=log(m)+log(n). Quotient: log(m/n)=log(m)−log(n). Power: log(m^k)=k·log(m). Change of base: logₐ(b)=ln(b)/ln(a).',
      },
    ],
  },
} as const;

export const MAYA_STUDY_ROOM_RESOURCES: Record<
  string,
  { id: string; title: string; type: string; path: string }[]
> = {
  'algebra-ii': [
    { id: 'res1', title: 'Logarithms Study Guide', type: 'worksheet', path: '/student/content/worksheet/ws-logs' },
    { id: 'res2', title: 'Factoring Practice', type: 'worksheet', path: '/student/content/worksheet/ws-factor' },
    { id: 'res3', title: 'Midterm Night Before Pack', type: 'pack', path: '/student/night-before' },
  ],
  biology: [
    { id: 'res4', title: 'Cell Structure Reading', type: 'worksheet', path: '/student/content/worksheet/ws-cell' },
    { id: 'res5', title: 'Mitosis Worksheet', type: 'worksheet', path: '/student/content/worksheet/ws-mitosis' },
    { id: 'res6', title: 'Enzyme Lab Prep', type: 'worksheet', path: '/student/content/worksheet/ws-enzyme' },
  ],
  'english-ii': [
    { id: 'res7', title: 'Persuasive essay outline template', type: 'assignment', path: '/student/assignments/a3' },
  ],
  'world-history': [
    { id: 'res8', title: 'Industrial Revolution short answers', type: 'assignment', path: '/student/assignments/a5' },
  ],
};

export function getAssignmentById(id: string) {
  return MAYA_ASSIGNMENTS.find((a) => a.id === id);
}

export function getExamById(id: string) {
  return MAYA_EXAMS.find((e) => e.id === id);
}

export function getQuizById(id: string) {
  return MAYA_QUIZZES.find((q) => q.id === id);
}

export function getProgressSubject(subjectId: string) {
  return MAYA_PROGRESS.subjects.find((s) => s.id === subjectId);
}

export function getCopilotContextItems() {
  const dueSoon = MAYA_ASSIGNMENTS.filter((a) => {
    const hours = (new Date(a.dueAt).getTime() - Date.now()) / (1000 * 60 * 60);
    return hours > -24 && hours < 48 && a.status !== 'graded';
  }).slice(0, 3);
  const nextExam = MAYA_EXAMS[0];
  const daysUntilExam = Math.max(
    0,
    Math.ceil((new Date(nextExam.startsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  return { dueSoon, nextExam, daysUntilExam };
}

export type WorksheetBlock =
  | { type: 'mcq'; prompt: string; options: string[]; answer: string }
  | { type: 'fill_blank'; prompt: string; answer: string }
  | { type: 'short'; prompt: string; sampleAnswer: string; responseLines?: number }
  | { type: 'match'; left: string[]; right: string[] }

export interface TopicBlueprint {
  objective: string
  misconceptions: string[]
  blocks: WorksheetBlock[]
  rubricHints: string[]
}

const photosynthesis: TopicBlueprint = {
  objective: 'Explain how plants convert light energy into chemical energy and identify reactants and products.',
  misconceptions: [
    'Confusing CO₂ intake with O₂ release pathways',
    'Believing plants only respire at night',
    'Mixing up chloroplast location vs function',
  ],
  blocks: [
    {
      type: 'mcq',
      prompt: 'Which gas is primarily taken in through stomata for photosynthesis?',
      options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
      answer: 'Carbon dioxide',
    },
    {
      type: 'fill_blank',
      prompt: 'The green pigment that absorbs light is called ______.',
      answer: 'chlorophyll',
    },
    {
      type: 'short',
      prompt: 'In one sentence, state the overall word equation for photosynthesis.',
      sampleAnswer: 'Carbon dioxide + water → glucose + oxygen (with light energy).',
    },
    {
      type: 'match',
      left: ['Chloroplast', 'Stomata', 'Mitochondria'],
      right: ['Site of photosynthesis', 'Gas exchange pores', 'Cellular respiration energy'],
    },
  ],
  rubricHints: ['Accuracy of equation', 'Use of scientific vocabulary', 'Clarity of explanation'],
}

const algebra: TopicBlueprint = {
  objective: 'Solve linear equations in one variable and interpret solutions in context.',
  misconceptions: [
    'Sign errors when moving terms across the equals sign',
    'Distributing incorrectly across parentheses',
  ],
  blocks: [
    {
      type: 'mcq',
      prompt: 'Solve: 2x + 5 = 13',
      options: ['x = 3', 'x = 4', 'x = 6', 'x = 9'],
      answer: 'x = 4',
    },
    {
      type: 'fill_blank',
      prompt: 'If 3(x − 2) = 12, then x = ______.',
      answer: '6',
    },
    {
      type: 'short',
      prompt: 'Show your steps to solve 4x − 7 = 2x + 5.',
      sampleAnswer: 'Subtract 2x: 2x − 7 = 5; add 7: 2x = 12; divide: x = 6.',
    },
    {
      type: 'match',
      left: ['Like terms', 'Inverse operation', 'Solution'],
      right: ['Same variable power', 'Undo +/− or ×/÷', 'Value that satisfies the equation'],
    },
  ],
  rubricHints: ['Correct algebraic steps', 'Final answer', 'Communication of reasoning'],
}

const defaultTopic: TopicBlueprint = {
  objective: 'Demonstrate understanding of the selected topic with varied question types.',
  misconceptions: ['Rushing without checking units', 'Skipping planning before writing'],
  blocks: [
    {
      type: 'mcq',
      prompt: 'Which best describes a key idea for this topic?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 'Option B',
    },
    {
      type: 'short',
      prompt: 'Explain the main concept in 2–3 sentences.',
      sampleAnswer: 'A concise explanation aligned to the learning objective.',
    },
  ],
  rubricHints: ['Content accuracy', 'Structure', 'Evidence or examples'],
}

export function getTopicBlueprint(subject: string, topic: string): TopicBlueprint {
  const t = topic.toLowerCase()
  if (t.includes('photosynth') || (subject === 'Biology' && t.includes('plant'))) return photosynthesis
  if (t.includes('algebra') || t.includes('linear') || t.includes('equation')) return algebra
  return defaultTopic
}

function djb2(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i += 1) h = (h << 5) + h + s.charCodeAt(i)
  return Math.abs(h)
}

export function analyticsForTopic(bp: TopicBlueprint) {
  const h = djb2(bp.objective) % 1000
  const masteryEstimate = 0.58 + (h % 200) / 1000
  return {
    mostMissed: bp.blocks[0]?.type === 'mcq' ? (bp.blocks[0] as { prompt: string }).prompt : 'Concept check item 1',
    commonErrors: bp.misconceptions,
    masteryEstimate,
  }
}

/** Mock quiz aligned to Tutify YouTube Quiz results format (WWII reference video). */
export const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=Q78COTwT7nE'
export const DEMO_THUMBNAIL = 'https://img.youtube.com/vi/Q78COTwT7nE/maxresdefault.jpg'

export const DEMO_DISCUSSION_TOPICS = [
  'How did the Treaty of Versailles contribute to instability in Europe?',
  'Debate: Was appeasement a rational policy in the 1930s?',
  'Which turning point most changed the course of the war — and why?',
]

export const DEMO_QUIZ = {
  title: 'World War II: Crash Course World History — Classroom Quiz',
  summary:
    'Six scaffolded prompts for Grades 11–12 Social Sciences. Critical analysis of causes, alliances, and turning points from the video.',
  sections: [
    {
      heading: 'Key idea check',
      details: 'Verify comprehension of major events and vocabulary from the episode.',
      questions: [
        {
          id: 'q1',
          style: 'multiple_choice' as const,
          prompt: 'Which event is most commonly cited as the immediate trigger for WWII in Europe?',
          options: [
            'The bombing of Pearl Harbor',
            "Germany's invasion of Poland",
            'The signing of the Treaty of Versailles',
            'The Berlin Blockade',
          ],
          correct_option_index: 1,
        },
        {
          id: 'q2',
          style: 'multiple_choice' as const,
          prompt: 'The Axis powers primarily included which group of nations?',
          options: [
            'USA, UK, and France',
            'Germany, Italy, and Japan',
            'Soviet Union, China, and Brazil',
            'Canada, Australia, and India',
          ],
          correct_option_index: 1,
        },
      ],
    },
    {
      heading: 'Discussion launcher',
      details: 'Open-ended prompts for think-pair-share and seminar discussion.',
      questions: [
        {
          id: 'q3',
          style: 'discussion_prompt' as const,
          prompt:
            'How did economic hardship in the 1930s create conditions that authoritarian leaders exploited?',
          sample_answer:
            'Students should connect unemployment, hyperinflation, and loss of trust in democratic institutions to rising extremist movements.',
        },
        {
          id: 'q4',
          style: 'higher_order' as const,
          prompt:
            'Evaluate the statement: "WWII was inevitable after 1919." Use evidence from the video to support or challenge it.',
          sample_answer:
            'Strong responses weigh structural causes (Treaty terms, reparations) against agency (diplomatic choices, appeasement).',
          rubric_points: ['Uses specific historical evidence', 'Considers multiple causes', 'Clear claim with reasoning'],
        },
      ],
    },
  ],
}

export const QUIZ_PANEL_HEADER_HEIGHT = 74

const SCROLL_PAD_TOP = 16
const SCROLL_PAD_BOTTOM = 12

const lineCount = (text: string, charsPerLine: number): number =>
  Math.max(1, Math.ceil(text.length / charsPerLine))

const sectionChrome = (details: string): number =>
  14 + 32 + 36 + 8 + lineCount(details, 96) * 16 + 10

const mcQuestion = (prompt: string, optionCount: number): number =>
  10 + 24 + lineCount(prompt, 88) * 18 + 8 + optionCount * 34 + Math.max(0, optionCount - 1) * 6

const openQuestion = (prompt: string): number =>
  10 + 24 + lineCount(prompt, 88) * 18 + 8 + 18

export const estimateQuizContentHeight = (): number => {
  let h = SCROLL_PAD_TOP + SCROLL_PAD_BOTTOM
  h += lineCount(DEMO_QUIZ.summary, 98) * 18 + 16
  for (const section of DEMO_QUIZ.sections) {
    h += sectionChrome(section.details)
    for (const q of section.questions) {
      if (q.style === 'multiple_choice' && q.options) {
        h += mcQuestion(q.prompt, q.options.length)
      } else {
        h += openQuestion(q.prompt)
      }
    }
  }
  return h
}

/** Left card height (matches Scene06 grid — full size beside right rail). */
export const QUIZ_CARD_HEIGHT = 836

/** Max scroll — stops at content end, never past (was 360px and showed blank). */
const QUIZ_SCROLL_MAX_CAP = 118

export type QuizPanelLayout = {
  scrollMax: number
  scrollViewport: number
}

export const getQuizPanelLayout = (cardHeight: number = QUIZ_CARD_HEIGHT): QuizPanelLayout => {
  const scrollViewport = cardHeight - QUIZ_PANEL_HEADER_HEIGHT
  const contentH = estimateQuizContentHeight()
  /** Visible quiz area at scroll start (~first screen), not full 762px tail. */
  const scrollWindow = 560
  const scrollMax = Math.min(Math.max(0, contentH - scrollWindow), QUIZ_SCROLL_MAX_CAP)

  return {
    scrollMax,
    scrollViewport,
  }
}

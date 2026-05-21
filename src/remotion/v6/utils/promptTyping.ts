import { interpolate } from 'remotion'

/** Scene04_AIAssistant — prompt types frames 32→98 for the reference string below. */
const AI_TEACHER_TYPE_START = 32
const AI_TEACHER_TYPE_END = 98
const AI_TEACHER_PROMPT_LEN =
  'Generate a Grade 8 science quiz, worksheet, and lesson plan on the water cycle.'.length

const FRAMES_PER_CHAR =
  (AI_TEACHER_TYPE_END - AI_TEACHER_TYPE_START) / AI_TEACHER_PROMPT_LEN

/** Duration (frames) to type `charCount` characters at AI Teacher speed. */
export const promptTypeDuration = (charCount: number): number =>
  Math.max(24, Math.round(FRAMES_PER_CHAR * charCount))

export const promptTypewriter = (
  frame: number,
  start: number,
  text: string,
): string => {
  const end = start + promptTypeDuration(text.length)
  const n = Math.floor(
    interpolate(frame, [start, end], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  return text.slice(0, n)
}

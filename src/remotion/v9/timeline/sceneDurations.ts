/**
 * TutifyDemoV9 — 75s @ 60fps (4500 frames).
 * Major section targets from creative brief; sub-scenes split proportionally from V6.
 */
import { TEACHING_INTRO_V6_DURATION } from '../../v6/opening/BlurTextV6'
import { EDUCATION_SLIDE_V6_DURATION } from '../../v6/opening/LineWordRevealV6'
import { TEACHERS_OVERWHELMED_V6_DURATION } from '../../v6/slides/teachersOverwhelmed'
import { SCENE02_DURATION as SCENE02_SOURCE } from '../../v6/scenes/Scene02_Vision'
import { SCENE03_DURATION as SCENE03_SOURCE } from '../../v6/scenes/Scene03_Introduction'
import { SCENE_AI_TEACHER_INTRO_DURATION as AI_INTRO_SOURCE } from '../../v6/scenes/AITeacherIntro/constants'
import { SCENE04_DURATION as SCENE04_SOURCE } from '../../v6/scenes/Scene04_AIAssistant'
import { SCENE_IMAGE_STUDIO_INTRO_DURATION as IMAGE_INTRO_SOURCE } from '../../v6/scenes/ImageStudioIntro/constants'
import { SCENE05_DURATION as SCENE05_SOURCE } from '../../v6/scenes/Scene05_VisualStudio'
import { SCENE_YOUTUBE_STUDIO_INTRO_DURATION as YT_INTRO_SOURCE } from '../../v6/scenes/YouTubeStudioIntro/constants'
import { SCENE06_DURATION as SCENE06_SOURCE } from '../../v6/scenes/Scene06_YouTube'
import { SCENE07_INTRO_DURATION as PERSO_INTRO_SOURCE } from '../../v6/scenes/Scene07_PersonalizationIntro'
import { SCENE07_DURATION as SCENE07_SOURCE } from '../../v6/scenes/Scene07_Personalization'
import { SCENE07B_DURATION as SCENE07B_SOURCE } from '../../v6/scenes/Scene07b_LearningHub'
import { SCENE08_DURATION as SCENE08_SOURCE } from '../../v6/scenes/Scene08_Ecosystem'
import { SCENE10_DURATION as SCENE10_SOURCE } from '../../v6/scenes/ClosingScene/constants'

export const FPS_V9 = 60
/** Target cap — actual composition length follows crossfade timeline in v9/Root.tsx */
export const TOTAL_DURATION_V9_TARGET = 75 * FPS_V9

/** Major sections (must sum to 4500). */
export const OPENING_BLOCK_V9 = 8 * FPS_V9
export const VISION_BLOCK_V9 = 5 * FPS_V9
export const MEET_BLOCK_V9 = 4 * FPS_V9
export const AI_TEACHER_BLOCK_V9 = 12 * FPS_V9
export const IMAGE_STUDIO_BLOCK_V9 = 8 * FPS_V9
export const YOUTUBE_BLOCK_V9 = 10 * FPS_V9
export const PERSONALIZATION_BLOCK_V9 = 8 * FPS_V9
export const LEARNING_HUB_BLOCK_V9 = 10 * FPS_V9
export const ECOSYSTEM_BLOCK_V9 = 6 * FPS_V9
export const CLOSING_BLOCK_V9 = 4 * FPS_V9

const splitProportional = (total: number, parts: number[]): number[] => {
  const sum = parts.reduce((a, b) => a + b, 0)
  const raw = parts.map((p) => (total * p) / sum)
  const floored = raw.map((v) => Math.floor(v))
  let remainder = total - floored.reduce((a, b) => a + b, 0)
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
  for (let k = 0; k < remainder; k++) {
    floored[order[k % order.length]!.i]! += 1
  }
  return floored
}

const [TEACHING_V9, EDUCATION_V9, PROBLEM_V9] = splitProportional(OPENING_BLOCK_V9, [
  TEACHING_INTRO_V6_DURATION,
  EDUCATION_SLIDE_V6_DURATION,
  TEACHERS_OVERWHELMED_V6_DURATION,
])

const [AI_INTRO_V9, AI_DEMO_V9] = splitProportional(AI_TEACHER_BLOCK_V9, [
  AI_INTRO_SOURCE,
  SCENE04_SOURCE,
])

const [IMAGE_INTRO_V9, IMAGE_DEMO_V9] = splitProportional(IMAGE_STUDIO_BLOCK_V9, [
  IMAGE_INTRO_SOURCE,
  SCENE05_SOURCE,
])

const [YT_INTRO_V9, YT_DEMO_V9] = splitProportional(YOUTUBE_BLOCK_V9, [YT_INTRO_SOURCE, SCENE06_SOURCE])

const [PERSO_INTRO_V9_FRAMES, PERSO_DEMO_V9] = splitProportional(PERSONALIZATION_BLOCK_V9, [
  PERSO_INTRO_SOURCE,
  SCENE07_SOURCE,
])

export const TEACHING_INTRO_V9 = TEACHING_V9
export const EDUCATION_SLIDE_V9 = EDUCATION_V9
export const PROBLEM_SLIDE_V9 = PROBLEM_V9

export const SCENE02_V9 = VISION_BLOCK_V9
export const SCENE03_V9 = MEET_BLOCK_V9

export const AI_TEACHER_INTRO_V9 = AI_INTRO_V9
export const SCENE04_V9 = AI_DEMO_V9

export const IMAGE_STUDIO_INTRO_V9 = IMAGE_INTRO_V9
export const SCENE05_V9 = IMAGE_DEMO_V9

export const YOUTUBE_STUDIO_INTRO_V9 = YT_INTRO_V9
export const SCENE06_V9 = YT_DEMO_V9

export const PERSO_INTRO_V9 = PERSO_INTRO_V9_FRAMES
export const SCENE07_V9 = PERSO_DEMO_V9

export const SCENE07B_V9 = LEARNING_HUB_BLOCK_V9
export const SCENE08_V9 = ECOSYSTEM_BLOCK_V9
export const SCENE10_V9 = CLOSING_BLOCK_V9

/** V6 source frame counts for TimelineFrameProvider. */
export const SOURCE = {
  teachingIntro: TEACHING_INTRO_V6_DURATION,
  educationSlide: EDUCATION_SLIDE_V6_DURATION,
  problemSlide: TEACHERS_OVERWHELMED_V6_DURATION,
  vision: SCENE02_SOURCE,
  meet: SCENE03_SOURCE,
  aiTeacherIntro: AI_INTRO_SOURCE,
  aiAssistant: SCENE04_SOURCE,
  imageStudioIntro: IMAGE_INTRO_SOURCE,
  visualStudio: SCENE05_SOURCE,
  youtubeIntro: YT_INTRO_SOURCE,
  youtube: SCENE06_SOURCE,
  persoIntro: PERSO_INTRO_SOURCE,
  personalization: SCENE07_SOURCE,
  learningHub: SCENE07B_SOURCE,
  ecosystem: SCENE08_SOURCE,
  closing: SCENE10_SOURCE,
} as const

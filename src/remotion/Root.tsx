import React from 'react'
import { Composition } from 'remotion'
import { TutifyDemo } from './TutifyDemo'
import { TutifyDemoV2 } from './v2/TutifyDemoV2'
import { TutifyDemoV3, TOTAL_DURATION_V3 } from './v3/Root'
import { TutifyDemoV4, TOTAL_DURATION_V4 } from './v4/Root'
import { TutifyDemoV5, TOTAL_DURATION_V5 } from './v5/Root'
import { TutifyDemoV6, TOTAL_DURATION_V6 } from './v6/Root'
import { TutifyScenes123, TOTAL_DURATION_SCENES_123 } from './v4/TutifyScenes123'
import TeachingIntro, { TEACHING_INTRO_DURATION } from './compositions/TeachingIntro'
import EducationChangingSlide, {
  EDUCATION_SLIDE_DURATION,
} from './compositions/EducationChangingSlide'
import TeachersOverwhelmedSlide, {
  TEACHERS_OVERWHELMED_DURATION,
} from './compositions/TeachersOverwhelmedSlide'
import {
  Scene04_AITeacherIntro,
  SCENE_AI_TEACHER_INTRO_DURATION,
} from './v4/scenes/Scene04_AITeacherIntro'
import { Scene04_AIAssistant, SCENE04_DURATION } from './v4/scenes/Scene04_AIAssistant'
import {
  Scene05_ImageStudioIntro,
  SCENE_IMAGE_STUDIO_INTRO_DURATION,
} from './v4/scenes/Scene05_ImageStudioIntro'
import { Scene05_VisualStudio, SCENE05_DURATION } from './v4/scenes/Scene05_VisualStudio'
import {
  Scene06_YouTubeStudioIntro,
  SCENE_YOUTUBE_STUDIO_INTRO_DURATION,
} from './v4/scenes/Scene06_YouTubeStudioIntro'
import { Scene06_YouTube, SCENE06_DURATION } from './v4/scenes/Scene06_YouTube'
import {
  Scene07_PersonalizationIntro,
  SCENE07_INTRO_DURATION,
} from './v4/scenes/Scene07_PersonalizationIntro'
import { Scene07_Personalization, SCENE07_DURATION } from './v4/scenes/Scene07_Personalization'
import { SaaSLaunch60, SAAS_LAUNCH_60_DURATION } from './v6/SaaSLaunch60'
import { TutifyDemoV7, TOTAL_DURATION_V7 } from './v7/Root'
import { TutifyDemoV8, TOTAL_DURATION_V8 } from './v8/Root'
import { TutifyDemoV9, TOTAL_DURATION_V9 } from './v9/Root'
import { TutifyDemoV10, TOTAL_DURATION_V10 } from './v10/Root'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* V1 — original 3.5-min dark version */}
      <Composition
        id="TutifyDemo"
        component={TutifyDemo}
        durationInFrames={6300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* V2 — 90-sec warm/light rebuild — COMPLETE (2817 frames = 93.9s) */}
      <Composition
        id="TutifyDemoV2"
        component={TutifyDemoV2}
        durationInFrames={2817}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* V3 — 60-sec cinematic dark launch video (1800 frames = 60s) */}
      <Composition
        id="TutifyDemoV3"
        component={TutifyDemoV3}
        durationInFrames={TOTAL_DURATION_V3}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* V4 — cinematic AI education video */}
      <Composition
        id="TutifyDemoV4"
        component={TutifyDemoV4}
        durationInFrames={TOTAL_DURATION_V4}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* V5 — premium cinematic AI education video (dark arc + enhanced everything) */}
      <Composition
        id="TutifyDemoV5"
        component={TutifyDemoV5}
        durationInFrames={TOTAL_DURATION_V5}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* V6 — premium V4 evolution (unified pacing, eased motion, light theme) */}
      <Composition
        id="TutifyDemoV6"
        component={TutifyDemoV6}
        durationInFrames={TOTAL_DURATION_V6}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Scenes 1–3 combined — intro + education + overwhelmed + music */}
      <Composition
        id="TutifyScenes123"
        component={TutifyScenes123}
        durationInFrames={TOTAL_DURATION_SCENES_123}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Standalone — Teaching Intro title reveal (180 frames = 6s) */}
      <Composition
        id="TeachingIntro"
        component={TeachingIntro}
        durationInFrames={TEACHING_INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="EducationChangingSlide"
        component={EducationChangingSlide}
        durationInFrames={EDUCATION_SLIDE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TeachersOverwhelmedSlide"
        component={TeachersOverwhelmedSlide}
        durationInFrames={TEACHERS_OVERWHELMED_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="AITeacherIntro"
        component={Scene04_AITeacherIntro}
        durationInFrames={SCENE_AI_TEACHER_INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="AIContentGenerator"
        component={Scene04_AIAssistant}
        durationInFrames={SCENE04_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="ImageStudioIntro"
        component={Scene05_ImageStudioIntro}
        durationInFrames={SCENE_IMAGE_STUDIO_INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PixGenDemo"
        component={Scene05_VisualStudio}
        durationInFrames={SCENE05_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="YouTubeFunStudioIntro"
        component={Scene06_YouTubeStudioIntro}
        durationInFrames={SCENE_YOUTUBE_STUDIO_INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="YouTubeQuizDemo"
        component={Scene06_YouTube}
        durationInFrames={SCENE06_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PersonalizationIntro"
        component={Scene07_PersonalizationIntro}
        durationInFrames={SCENE07_INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PersonalizationDemo"
        component={Scene07_Personalization}
        durationInFrames={SCENE07_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="SaaSLaunch60"
        component={SaaSLaunch60}
        durationInFrames={SAAS_LAUNCH_60_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TutifyDemoV7"
        component={TutifyDemoV7}
        durationInFrames={TOTAL_DURATION_V7}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TutifyDemoV8"
        component={TutifyDemoV8}
        durationInFrames={TOTAL_DURATION_V8}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* V9 — 75s premium launch @ 60fps (full V6 storyboard, compressed pacing) */}
      <Composition
        id="TutifyDemoV9"
        component={TutifyDemoV9}
        durationInFrames={TOTAL_DURATION_V9}
        fps={60}
        width={1920}
        height={1080}
      />

      {/* V10 — V9 content pacing; chapter transitions ~2× slower for visible handoffs */}
      <Composition
        id="TutifyDemoV10"
        component={TutifyDemoV10}
        durationInFrames={TOTAL_DURATION_V10}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  )
}

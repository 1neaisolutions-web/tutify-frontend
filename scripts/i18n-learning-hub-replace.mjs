import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '../src/pages/features/learningHubSections')

const files = [
  'SpecialistDeepDiveTrackRenderer.tsx',
  'PersonalizedMicroCourseRenderer.tsx',
  'ResearchInsightSectionsPayloadView.tsx',
  'AIGrowthStudentEngagementPathView.tsx',
  'AIGrowthRecommendationRenderer.tsx',
]

const replacements = [
  ["import { useMemo, useRef, useState } from 'react'", "import { useMemo, useRef, useState } from 'react'\nimport { useTranslation } from 'react-i18next'"],
  ["import { useEffect, useMemo, useState } from 'react'", "import { useEffect, useMemo, useState } from 'react'\nimport { useTranslation } from 'react-i18next'"],
  ["import type { NavigateFunction } from 'react-router-dom'", "import type { NavigateFunction } from 'react-router-dom'\nimport { useTranslation } from 'react-i18next'"],
  ['{block.media.title ?? \'Video\'}', "{block.media.title ?? tr('learningHubSections.video')}"],
  ["title={block.media.title ?? 'Video'}", "title={block.media.title ?? tr('learningHubSections.video')}"],
  ['This video URL could not be embedded.', "{tr('learningHubSections.videoEmbedFailed')}"],
  ['Tips', "{tr('learningHubSections.tips')}"],
  ['Discussion', "{tr('learningHubSections.discussion')}"],
  ["content.certification?.title ?? 'Track complete'", "content.certification?.title ?? tr('learningHubSections.trackComplete')}"],
  ['You have completed all modules in this specialist deep-dive track.', "tr('learningHubSections.trackCompleteHint')"],
  ['Outcomes', "{tr('learningHubSections.outcomes')}"],
  ["isLastStep ? 'Finish track' : 'Next'", "isLastStep ? tr('learningHubSections.finishTrack') : tr('common.next')"],
  ["content.assessment.title ?? 'Track assessment'", "content.assessment.title ?? tr('learningHubSections.trackAssessment')"],
  ["label: 'Summary'", "label: tr('learningHubSections.summary')"],
  ["label: 'Takeaways & resources'", "label: tr('learningHubSections.takeawaysResources')"],
  ['>Summary<', ">{tr('learningHubSections.summary')}<"],
  ['>Takeaways & resources<', ">{tr('learningHubSections.takeawaysResources')}<"],
  ['Implementation ideas', "{tr('learningHubSections.implementationIdeas')}"],
  ["'>Congratulations!<'", ">{tr('learningHubSections.congratulations')}<"],
  ["You've completed the course", "{tr('learningHubSections.courseCompleted')}"],
  ['Certificate of Completion', "{tr('learningHubSections.certificateCompletion')}"],
  ['This certifies that you have successfully completed', "{tr('learningHubSections.certifiesCompleted')}"],
  ['Course Assessment', "{tr('learningHubSections.courseAssessment')}"],
  ["isCorrect ? '✓ Correct!' : 'Explanation:'", "isCorrect ? tr('learningHubSections.correct') : tr('learningHubSections.explanation')"],
  ["passed ? 'Congratulations! You passed!' : 'Keep Learning'", "passed ? tr('learningHubSections.passedTitle') : tr('learningHubSections.keepLearning')"],
  ['Course Content', "{tr('learningHubSections.courseContent')}"],
  ['Tips:', "{tr('learningHubSections.tips')}:"],
  ["? 'Complete Course'", "? tr('learningHubSections.completeCourse')"],
  [": 'Continue'}", ": tr('learningHubSections.continue')}"],
  ['AI-Powered Learning Guidance', "{tr('learningHubSections.growth.aiGuidance')}"],
  ['>Personalized<', ">{tr('learningHubSections.growth.personalized')}<"],
  ['Personalized Tip', "{tr('learningHubSections.growth.personalizedTip')}"],
  ['Your Next Steps', "{tr('learningHubSections.growth.yourNextSteps')}"],
  ['Expected Impact on Your Teaching', "{tr('learningHubSections.growth.expectedImpact')}"],
  ['Learning Modules', "{tr('learningHubSections.growth.learningModules')}"],
  ["value='all'>All Levels</option>", "value='all'>{tr('learningHubSections.levels.all')}</option>"],
  ["value='Beginner'>Beginner</option>", "value='Beginner'>{tr('learningHubSections.levels.beginner')}</option>"],
  ["value='Intermediate'>Intermediate</option>", "value='Intermediate'>{tr('learningHubSections.levels.intermediate')}</option>"],
  ["value='Advanced'>Advanced</option>", "value='Advanced'>{tr('learningHubSections.levels.advanced')}</option>"],
  ["Skills You'll Gain", "{tr('learningHubSections.growth.skillsGain')}"],
  ['Learning Outcomes', "{tr('learningHubSections.growth.learningOutcomes')}"],
  ['Module Content', "{tr('learningHubSections.growth.moduleContent')}"],
  ["'Assessment'", "{tr('learningHubSections.growth.assessment')}"],
  ['Real-World Application', "{tr('learningHubSections.growth.realWorldApp')}"],
  ['Locked - Complete first 3 modules to unlock', "{tr('learningHubSections.growth.lockedFirstThree')}"],
  ['Locked - Complete previous module to unlock', "{tr('learningHubSections.growth.lockedPrevious')}"],
  ['Your Progress', "{tr('learningHubSections.growth.yourProgress')}"],
  ['Overall Completion', "{tr('learningHubSections.growth.overallCompletion')}"],
  ["'>Completed<'", ">{tr('learningHubSections.growth.completed')}<"],
  ["'>Remaining<'", ">{tr('learningHubSections.growth.remaining')}<"],
  ['Quick Actions', "{tr('learningHubSections.growth.quickActions')}"],
  ['Download Certificate', "{tr('learningHubSections.growth.downloadCertificate')}"],
  ['Share Progress', "{tr('learningHubSections.growth.shareProgress')}"],
  ['Customize Path', "{tr('learningHubSections.growth.customizePath')}"],
  ['Lessons', "{tr('learningHubSections.growth.lessons')}"],
  ["'>Progress<'", ">{tr('learningHubSections.growth.progress')}<"],
  ['Video Lesson', "{tr('learningHubSections.growth.videoLesson')}"],
  ['Key Points', "{tr('learningHubSections.growth.keyPoints')}"],
  ['Transcript', "{tr('learningHubSections.growth.transcript')}"],
  ['Reading', "{tr('learningHubSections.growth.reading')}"],
  ['Key Takeaways', "{tr('learningHubSections.growth.keyTakeaways')}"],
  ['Interactive Tool', "{tr('learningHubSections.growth.interactiveTool')}"],
  ["'Interactive Practice'", "{tr('learningHubSections.growth.interactivePractice')}"],
  ["'Template'", "{tr('learningHubSections.growth.template')}"],
  ['Template Sections', "{tr('learningHubSections.growth.templateSections')}"],
  ["'Elementary Template', 'Middle School Template', 'High School Template'", "tr('learningHubSections.growth.elementaryTemplate'), tr('learningHubSections.growth.middleSchoolTemplate'), tr('learningHubSections.growth.highSchoolTemplate')"],
  ["'Grades K-5', 'Grades 6-8', 'Grades 9-12'", "tr('learningHubSections.growth.gradesK5'), tr('learningHubSections.growth.grades68'), tr('learningHubSections.growth.grades912')"],
  ["'Template Resource'", "{tr('learningHubSections.growth.templateResource')}"],
  ['This template includes the following sections:', "{tr('learningHubSections.growth.templateIncludes')}"],
  ['Template Preview', "{tr('learningHubSections.growth.templatePreview')}"],
  ['Your content will appear here...', "{tr('learningHubSections.growth.contentPlaceholder')}"],
  ['No lesson content configured for this module yet.', "{tr('learningHubSections.growth.noLessonContent')}"],
  ['Module Complete!', "{tr('learningHubSections.growth.moduleComplete')}"],
  ['You completed all lessons in this module.', "{tr('learningHubSections.growth.moduleCompleteHint')}"],
  ['Modules Completed', "{tr('learningHubSections.growth.modulesCompleted')}"],
  ["Skills You'll Master", "{tr('learningHubSections.growth.skillsMaster')}"],
  ['Path Overview', "{tr('learningHubSections.growth.pathOverview')}"],
  ['Total Modules', "{tr('learningHubSections.growth.totalModules')}"],
  ['Estimated Time', "{tr('learningHubSections.growth.estimatedTime')}"],
  ['Impact Level', "{tr('learningHubSections.growth.impactLevel')}"],
  ["?? 'Module'", "?? tr('learningHubSections.growth.module')"],
  [' estimated', " {tr('learningHubSections.growth.estimated')}"],
]

for (const file of files) {
  const path = join(dir, file)
  let content = readFileSync(path, 'utf8')
  if (!content.includes('useTranslation')) {
    if (file === 'AIGrowthStudentEngagementPathView.tsx') {
      content =
        "import { useTranslation } from 'react-i18next'\n" +
        content.replace(
          '}: AIGrowthStudentEngagementPathViewProps) => {',
          '}: AIGrowthStudentEngagementPathViewProps) => {\n  const { t: tr } = useTranslation()',
        )
    } else if (file === 'AIGrowthRecommendationRenderer.tsx') {
      content = content.replace(
        'const AIGrowthRecommendationRenderer = ({ item }: AIGrowthRecommendationRendererProps) => {',
        "const AIGrowthRecommendationRenderer = ({ item }: AIGrowthRecommendationRendererProps) => {\n  const { t: tr } = useTranslation()",
      )
      if (!content.includes("useTranslation")) {
        content = "import { useTranslation } from 'react-i18next'\n" + content
      }
    } else {
      content = content.replace(
        /export default function (\w+)/,
        "export default function $1",
      )
      if (file.includes('Renderer') && !content.includes('const { t: tr }')) {
        content = content.replace(
          /(export default function \w+\([^)]*\) \{)/,
          "$1\n  const { t: tr } = useTranslation()",
        )
        if (!content.includes('useTranslation')) {
          content = "import { useTranslation } from 'react-i18next'\n" + content
        }
      }
      if (file === 'SpecialistDeepDiveTrackRenderer.tsx') {
        content = content.replace(
          'export function SpecialistDeepDiveTrackRenderer',
          "import { useTranslation } from 'react-i18next'\n\nexport function SpecialistDeepDiveTrackRenderer",
        )
        content = content.replace(
          '}: SpecialistDeepDiveTrackRendererProps) {',
          '}: SpecialistDeepDiveTrackRendererProps) {\n  const { t: tr } = useTranslation()',
        )
      }
      if (file === 'PersonalizedMicroCourseRenderer.tsx') {
        content = content.replace(
          'const PersonalizedMicroCourseRenderer = ({ item }: { item: LearningHubSectionItem }) => {',
          "const PersonalizedMicroCourseRenderer = ({ item }: { item: LearningHubSectionItem }) => {\n  const { t: tr } = useTranslation()",
        )
      }
      if (file === 'ResearchInsightSectionsPayloadView.tsx') {
        content = content.replace(
          'export function ResearchInsightSectionsPayloadView',
          "import { useTranslation } from 'react-i18next'\n\nexport function ResearchInsightSectionsPayloadView",
        )
        content = content.replace(
          '}: { item: LearningHubSectionItem }) {',
          '}: { item: LearningHubSectionItem }) {\n  const { t: tr } = useTranslation()',
        )
      }
    }
  }
  for (const [from, to] of replacements) {
    content = content.split(from).join(to)
  }
  writeFileSync(path, content, 'utf8')
  console.log('Updated', file)
}

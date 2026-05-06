/**
 * AI Growth — **one array**: `aiGrowthRecommendationsData`.
 * Copy a full top-level object to add another path; edit `pathTheme` (colors/chrome) and `modules` in place.
 */
import type { LearningHubSectionItem } from '../types'

export const aiGrowthRecommendationsData: LearningHubSectionItem[] = [
  {
    "id": "agr-1",
    "slug": "advanced-differentiation-strategies",
    "title": "Advanced differentiation strategies",
    "shortDescription": "You frequently create lessons for diverse learners. Deepen your toolkit with tiered instruction frameworks.",
    "duration": "2 hours",
    "ctaLabel": "Start Path",
    "sectionKey": "ai-growth-recommendations",
    "aiGrowthRecommendationContent": {
      "type": "path",
      "themeId": "ai-growth-differentiation",
      "storageKey": "advanced-differentiation-completed",
      "estimatedTime": "2 hours",
      "impactLevel": "High",
      "heroSubtitle": "AI-Guided Learning Path",
      "heroDescription": "Deepen your toolkit with tiered instruction frameworks and sophisticated differentiation techniques",
      "aiGuidance": {
        "recommendation": "Start with Tiered Instruction, then explore Content Differentiation",
        "reason": "Based on your lesson patterns, you work with diverse learners. Tiered instruction provides a solid foundation, then content differentiation will help you meet individual needs more precisely.",
        "nextSteps": [
          "Complete Tiered Instruction Frameworks module",
          "Create your first tiered lesson",
          "Explore Content Differentiation strategies",
          "Assess student readiness before planning"
        ],
        "personalizedTip": "Your students benefit from clear structure. Start with 3 tiers (foundation, standard, challenge) before adding more complexity."
      },
      "skillImpacts": [
        {
          "skillId": "impact-diff-student-achievement",
          "before": 68,
          "after": 89,
          "improvement": 21,
          "description": "Increase in student achievement across ability levels"
        },
        {
          "skillId": "impact-diff-student-engagement",
          "before": 62,
          "after": 87,
          "improvement": 25,
          "description": "Improvement in engagement for all learners"
        },
        {
          "skillId": "impact-diff-advanced-learner-growth",
          "before": 55,
          "after": 85,
          "improvement": 30,
          "description": "Better growth for advanced learners through appropriate challenge"
        },
        {
          "skillId": "impact-diff-struggling-learner-support",
          "before": 58,
          "after": 82,
          "improvement": 24,
          "description": "Improved outcomes for struggling learners through targeted support"
        },
        {
          "skillId": "impact-diff-classroom-equity",
          "before": 65,
          "after": 91,
          "improvement": 26,
          "description": "Increased equity in learning opportunities"
        }
      ],
      "modules": [
        {
          "id": "tiered-instruction",
          "slug": "tiered-instruction-module",
          "title": "Tiered Instruction Frameworks",
          "description": "Master the art of creating tiered lessons that challenge all students at their appropriate level while maintaining the same learning objectives.",
          "duration": "40 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "diff-tiered-design",
            "diff-readiness-assessment",
            "diff-complexity-scaling",
            "diff-objective-alignment"
          ],
          "learningOutcomes": [
            "Understand tiered instruction principles",
            "Assess student readiness effectively",
            "Create tiered activities at 3-4 complexity levels",
            "Maintain learning objective alignment across tiers",
            "Implement tiered instruction in your classroom"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design a complete tiered lesson with activities for 3 readiness levels",
            "points": 100
          },
          "realWorldApplication": "Create a tiered lesson for your next unit, ensuring all students work toward the same learning objectives.",
          "content": [
            {
              "type": "video",
              "title": "Introduction to Tiered Instruction",
              "duration": "12 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.w3schools.com/html/mov_bbb.mp4",
                "provider": "mp4",
                "title": "Introduction to Tiered Instruction",
                "duration": "12 min",
                "controls": true
              }
            },
            {
              "type": "reading",
              "title": "Readiness Assessment Strategies",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Tiered Activity Designer",
              "points": 30
            },
            {
              "type": "template",
              "title": "Tiered Lesson Template Library",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 1 of 6",
            "backPathSlug": "advanced-differentiation-strategies",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-green-100 border-2 border-green-500 text-green-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-green-600",
              "pointsPill": "bg-green-100 text-green-700",
              "videoOverlayGradient": "from-green-600 to-emerald-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-green-600",
              "showLessonHeaderShare": true,
              "keyPointsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "keyPointsCheck": "text-green-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "readingTakeawaysIcon": "text-green-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-green-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-green-100 text-green-700",
              "templateDownloadCard": "p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100",
              "templateDownloadIcon": "text-green-600",
              "markCompleteButton": "bg-green-600 hover:bg-green-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "tiered-instruction-lesson-1",
                "type": "video",
                "title": "Introduction to Tiered Instruction",
                "duration": "12 min",
                "points": 20,
                "content": {
                  "description": "Master the art of creating tiered lessons that challenge all students at their appropriate level while maintaining the same learning objectives.",
                  "keyPoints": [
                    "Understand tiered instruction principles",
                    "Assess student readiness effectively",
                    "Create tiered activities at 3-4 complexity levels",
                    "Maintain learning objective alignment across tiers",
                    "Implement tiered instruction in your classroom"
                  ],
                  "transcript": "Master the art of creating tiered lessons that challenge all students at their appropriate level while maintaining the same learning objectives. Create a tiered lesson for your next unit, ensuring all students work toward the same learning objectives."
                }
              },
              {
                "id": "tiered-instruction-lesson-2",
                "type": "reading",
                "title": "Readiness Assessment Strategies",
                "points": 15,
                "content": {
                  "article": "# Tiered Instruction Frameworks\n\n## Overview\n\nMaster the art of creating tiered lessons that challenge all students at their appropriate level while maintaining the same learning objectives.\n\n## Skills In Focus\n\n1. Tiered design\n2. Readiness assessment\n3. Complexity scaling\n4. Objective alignment\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Understand tiered instruction principles",
                    "Assess student readiness effectively",
                    "Create tiered activities at 3-4 complexity levels",
                    "Maintain learning objective alignment across tiers",
                    "Implement tiered instruction in your classroom"
                  ]
                }
              },
              {
                "id": "tiered-instruction-lesson-3",
                "type": "interactive",
                "title": "Tiered Activity Designer",
                "points": 30,
                "content": {
                  "description": "Design a complete tiered lesson with activities for 3 readiness levels",
                  "steps": [
                    "Understand tiered instruction principles",
                    "Assess student readiness effectively",
                    "Create tiered activities at 3-4 complexity levels",
                    "Maintain learning objective alignment across tiers",
                    "Implement tiered instruction in your classroom"
                  ]
                }
              },
              {
                "id": "tiered-instruction-lesson-4",
                "type": "template",
                "title": "Tiered Lesson Template Library",
                "points": 20,
                "content": {
                  "description": "Create a tiered lesson for your next unit, ensuring all students work toward the same learning objectives.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "content-differentiation",
          "slug": "content-differentiation-module",
          "title": "Advanced Content Differentiation",
          "description": "Learn sophisticated strategies for varying what students learn based on readiness, interests, and learning profiles.",
          "duration": "35 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "diff-content-variation",
            "diff-learning-contracts",
            "diff-compacting",
            "diff-interest-based-learning"
          ],
          "learningOutcomes": [
            "Design learning contracts that provide choice",
            "Implement curriculum compacting for advanced learners",
            "Create interest-based content options",
            "Use varied texts and resources effectively",
            "Maintain rigor across all content levels"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Create a learning contract and compacting plan for your advanced learners",
            "points": 100
          },
          "realWorldApplication": "Develop learning contracts for your next unit that allow students to explore content aligned with their interests.",
          "content": [
            {
              "type": "video",
              "title": "Content Differentiation Strategies",
              "duration": "15 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Content Differentiation Strategies",
                "duration": "15 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Learning Contracts & Compacting",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Content Differentiation Planner",
              "points": 30
            },
            {
              "type": "template",
              "title": "Learning Contract Templates",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 2 of 6",
            "backPathSlug": "advanced-differentiation-strategies",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-green-100 border-2 border-green-500 text-green-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-green-600",
              "pointsPill": "bg-green-100 text-green-700",
              "videoOverlayGradient": "from-green-600 to-emerald-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-green-600",
              "showLessonHeaderShare": true,
              "keyPointsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "keyPointsCheck": "text-green-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "readingTakeawaysIcon": "text-green-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-green-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-green-100 text-green-700",
              "templateDownloadCard": "p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100",
              "templateDownloadIcon": "text-green-600",
              "markCompleteButton": "bg-green-600 hover:bg-green-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "content-differentiation-lesson-1",
                "type": "video",
                "title": "Content Differentiation Strategies",
                "duration": "15 min",
                "points": 25,
                "content": {
                  "description": "Learn sophisticated strategies for varying what students learn based on readiness, interests, and learning profiles.",
                  "keyPoints": [
                    "Design learning contracts that provide choice",
                    "Implement curriculum compacting for advanced learners",
                    "Create interest-based content options",
                    "Use varied texts and resources effectively",
                    "Maintain rigor across all content levels"
                  ],
                  "transcript": "Learn sophisticated strategies for varying what students learn based on readiness, interests, and learning profiles. Develop learning contracts for your next unit that allow students to explore content aligned with their interests."
                }
              },
              {
                "id": "content-differentiation-lesson-2",
                "type": "reading",
                "title": "Learning Contracts & Compacting",
                "points": 20,
                "content": {
                  "article": "# Advanced Content Differentiation\n\n## Overview\n\nLearn sophisticated strategies for varying what students learn based on readiness, interests, and learning profiles.\n\n## Skills In Focus\n\n1. Content variation\n2. Learning contracts\n3. Compacting\n4. Interest-based learning\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design learning contracts that provide choice",
                    "Implement curriculum compacting for advanced learners",
                    "Create interest-based content options",
                    "Use varied texts and resources effectively",
                    "Maintain rigor across all content levels"
                  ]
                }
              },
              {
                "id": "content-differentiation-lesson-3",
                "type": "interactive",
                "title": "Content Differentiation Planner",
                "points": 30,
                "content": {
                  "description": "Create a learning contract and compacting plan for your advanced learners",
                  "steps": [
                    "Design learning contracts that provide choice",
                    "Implement curriculum compacting for advanced learners",
                    "Create interest-based content options",
                    "Use varied texts and resources effectively",
                    "Maintain rigor across all content levels"
                  ]
                }
              },
              {
                "id": "content-differentiation-lesson-4",
                "type": "template",
                "title": "Learning Contract Templates",
                "points": 20,
                "content": {
                  "description": "Develop learning contracts for your next unit that allow students to explore content aligned with their interests.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "process-differentiation",
          "slug": "process-differentiation-module",
          "title": "Process Differentiation Mastery",
          "description": "Master techniques for varying how students make sense of content through different learning activities and strategies.",
          "duration": "45 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "diff-activity-variation",
            "diff-learning-stations",
            "diff-flexible-grouping",
            "diff-multiple-intelligences"
          ],
          "learningOutcomes": [
            "Design learning stations that engage all learners",
            "Implement flexible grouping strategies",
            "Create activities for different learning styles",
            "Use multiple intelligences in lesson design",
            "Facilitate varied process experiences"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design and implement learning stations for a unit that address multiple learning styles",
            "points": 100
          },
          "realWorldApplication": "Create learning stations for your next lesson that allow students to engage with content in different ways.",
          "content": [
            {
              "type": "video",
              "title": "Process Differentiation Techniques",
              "duration": "18 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Process Differentiation Techniques",
                "duration": "18 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Learning Stations & Flexible Grouping",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Station Designer Tool",
              "points": 35
            },
            {
              "type": "template",
              "title": "Process Differentiation Templates",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 3 of 6",
            "backPathSlug": "advanced-differentiation-strategies",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-green-100 border-2 border-green-500 text-green-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-green-600",
              "pointsPill": "bg-green-100 text-green-700",
              "videoOverlayGradient": "from-green-600 to-emerald-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-green-600",
              "showLessonHeaderShare": true,
              "keyPointsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "keyPointsCheck": "text-green-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "readingTakeawaysIcon": "text-green-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-green-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-green-100 text-green-700",
              "templateDownloadCard": "p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100",
              "templateDownloadIcon": "text-green-600",
              "markCompleteButton": "bg-green-600 hover:bg-green-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "process-differentiation-lesson-1",
                "type": "video",
                "title": "Process Differentiation Techniques",
                "duration": "18 min",
                "points": 25,
                "content": {
                  "description": "Master techniques for varying how students make sense of content through different learning activities and strategies.",
                  "keyPoints": [
                    "Design learning stations that engage all learners",
                    "Implement flexible grouping strategies",
                    "Create activities for different learning styles",
                    "Use multiple intelligences in lesson design",
                    "Facilitate varied process experiences"
                  ],
                  "transcript": "Master techniques for varying how students make sense of content through different learning activities and strategies. Create learning stations for your next lesson that allow students to engage with content in different ways."
                }
              },
              {
                "id": "process-differentiation-lesson-2",
                "type": "reading",
                "title": "Learning Stations & Flexible Grouping",
                "points": 20,
                "content": {
                  "article": "# Process Differentiation Mastery\n\n## Overview\n\nMaster techniques for varying how students make sense of content through different learning activities and strategies.\n\n## Skills In Focus\n\n1. Activity variation\n2. Learning stations\n3. Flexible grouping\n4. Multiple intelligences\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design learning stations that engage all learners",
                    "Implement flexible grouping strategies",
                    "Create activities for different learning styles",
                    "Use multiple intelligences in lesson design",
                    "Facilitate varied process experiences"
                  ]
                }
              },
              {
                "id": "process-differentiation-lesson-3",
                "type": "interactive",
                "title": "Station Designer Tool",
                "points": 35,
                "content": {
                  "description": "Design and implement learning stations for a unit that address multiple learning styles",
                  "steps": [
                    "Design learning stations that engage all learners",
                    "Implement flexible grouping strategies",
                    "Create activities for different learning styles",
                    "Use multiple intelligences in lesson design",
                    "Facilitate varied process experiences"
                  ]
                }
              },
              {
                "id": "process-differentiation-lesson-4",
                "type": "template",
                "title": "Process Differentiation Templates",
                "points": 25,
                "content": {
                  "description": "Create learning stations for your next lesson that allow students to engage with content in different ways.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "product-differentiation",
          "slug": "product-differentiation-module",
          "title": "Product Differentiation Excellence",
          "description": "Create multiple pathways for students to demonstrate learning through varied products and assessments.",
          "duration": "30 min",
          "level": "Intermediate",
          "impact": "Medium",
          "skillIds": [
            "diff-choice-boards",
            "diff-product-design",
            "diff-rubric-creation",
            "diff-multiple-intelligences"
          ],
          "learningOutcomes": [
            "Design effective choice boards",
            "Create product options that maintain rigor",
            "Develop rubrics that work across product types",
            "Incorporate multiple intelligences in product design",
            "Implement product differentiation successfully"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Create a choice board with 6-9 product options and a universal rubric",
            "points": 100
          },
          "realWorldApplication": "Replace your next assessment with a choice board that allows students to demonstrate learning in varied ways.",
          "content": [
            {
              "type": "video",
              "title": "Product Differentiation Strategies",
              "duration": "12 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Product Differentiation Strategies",
                "duration": "12 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Choice Boards & Product Options",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Choice Board Builder",
              "points": 30
            },
            {
              "type": "template",
              "title": "Product Differentiation Templates",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 4 of 6",
            "backPathSlug": "advanced-differentiation-strategies",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-green-100 border-2 border-green-500 text-green-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-green-600",
              "pointsPill": "bg-green-100 text-green-700",
              "videoOverlayGradient": "from-green-600 to-emerald-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-green-600",
              "showLessonHeaderShare": true,
              "keyPointsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "keyPointsCheck": "text-green-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "readingTakeawaysIcon": "text-green-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-green-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-green-100 text-green-700",
              "templateDownloadCard": "p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100",
              "templateDownloadIcon": "text-green-600",
              "markCompleteButton": "bg-green-600 hover:bg-green-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "product-differentiation-lesson-1",
                "type": "video",
                "title": "Product Differentiation Strategies",
                "duration": "12 min",
                "points": 20,
                "content": {
                  "description": "Create multiple pathways for students to demonstrate learning through varied products and assessments.",
                  "keyPoints": [
                    "Design effective choice boards",
                    "Create product options that maintain rigor",
                    "Develop rubrics that work across product types",
                    "Incorporate multiple intelligences in product design",
                    "Implement product differentiation successfully"
                  ],
                  "transcript": "Create multiple pathways for students to demonstrate learning through varied products and assessments. Replace your next assessment with a choice board that allows students to demonstrate learning in varied ways."
                }
              },
              {
                "id": "product-differentiation-lesson-2",
                "type": "reading",
                "title": "Choice Boards & Product Options",
                "points": 15,
                "content": {
                  "article": "# Product Differentiation Excellence\n\n## Overview\n\nCreate multiple pathways for students to demonstrate learning through varied products and assessments.\n\n## Skills In Focus\n\n1. Choice boards\n2. Product design\n3. Rubric creation\n4. Multiple intelligences\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design effective choice boards",
                    "Create product options that maintain rigor",
                    "Develop rubrics that work across product types",
                    "Incorporate multiple intelligences in product design",
                    "Implement product differentiation successfully"
                  ]
                }
              },
              {
                "id": "product-differentiation-lesson-3",
                "type": "interactive",
                "title": "Choice Board Builder",
                "points": 30,
                "content": {
                  "description": "Create a choice board with 6-9 product options and a universal rubric",
                  "steps": [
                    "Design effective choice boards",
                    "Create product options that maintain rigor",
                    "Develop rubrics that work across product types",
                    "Incorporate multiple intelligences in product design",
                    "Implement product differentiation successfully"
                  ]
                }
              },
              {
                "id": "product-differentiation-lesson-4",
                "type": "template",
                "title": "Product Differentiation Templates",
                "points": 20,
                "content": {
                  "description": "Replace your next assessment with a choice board that allows students to demonstrate learning in varied ways.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "assessment-differentiation",
          "slug": "assessment-differentiation-module",
          "title": "Differentiated Assessment Strategies",
          "description": "Learn how to differentiate assessments to accurately measure learning while accommodating diverse learners.",
          "duration": "35 min",
          "level": "Advanced",
          "impact": "High",
          "skillIds": [
            "diff-assessment-variation",
            "diff-accommodations",
            "diff-alternative-assessments",
            "diff-fairness"
          ],
          "learningOutcomes": [
            "Design differentiated assessments",
            "Create accommodations that maintain validity",
            "Develop alternative assessment options",
            "Ensure fairness across assessment types",
            "Use assessment data to inform differentiation"
          ],
          "assessment": {
            "type": "Project + Reflection",
            "description": "Design differentiated assessments and reflect on fairness and validity",
            "points": 100
          },
          "realWorldApplication": "Create differentiated assessment options for your next unit that accurately measure learning for all students.",
          "content": [
            {
              "type": "video",
              "title": "Differentiated Assessment Design",
              "duration": "15 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Differentiated Assessment Design",
                "duration": "15 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Fairness & Validity in Differentiation",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Assessment Differentiation Tool",
              "points": 30
            },
            {
              "type": "template",
              "title": "Differentiated Assessment Templates",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 5 of 6",
            "backPathSlug": "advanced-differentiation-strategies",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-green-100 border-2 border-green-500 text-green-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-green-600",
              "pointsPill": "bg-green-100 text-green-700",
              "videoOverlayGradient": "from-green-600 to-emerald-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-green-600",
              "showLessonHeaderShare": true,
              "keyPointsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "keyPointsCheck": "text-green-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "readingTakeawaysIcon": "text-green-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-green-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-green-100 text-green-700",
              "templateDownloadCard": "p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100",
              "templateDownloadIcon": "text-green-600",
              "markCompleteButton": "bg-green-600 hover:bg-green-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "assessment-differentiation-lesson-1",
                "type": "video",
                "title": "Differentiated Assessment Design",
                "duration": "15 min",
                "points": 25,
                "content": {
                  "description": "Learn how to differentiate assessments to accurately measure learning while accommodating diverse learners.",
                  "keyPoints": [
                    "Design differentiated assessments",
                    "Create accommodations that maintain validity",
                    "Develop alternative assessment options",
                    "Ensure fairness across assessment types",
                    "Use assessment data to inform differentiation"
                  ],
                  "transcript": "Learn how to differentiate assessments to accurately measure learning while accommodating diverse learners. Create differentiated assessment options for your next unit that accurately measure learning for all students."
                }
              },
              {
                "id": "assessment-differentiation-lesson-2",
                "type": "reading",
                "title": "Fairness & Validity in Differentiation",
                "points": 20,
                "content": {
                  "article": "# Differentiated Assessment Strategies\n\n## Overview\n\nLearn how to differentiate assessments to accurately measure learning while accommodating diverse learners.\n\n## Skills In Focus\n\n1. Assessment variation\n2. Accommodations\n3. Alternative assessments\n4. Fairness\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design differentiated assessments",
                    "Create accommodations that maintain validity",
                    "Develop alternative assessment options",
                    "Ensure fairness across assessment types",
                    "Use assessment data to inform differentiation"
                  ]
                }
              },
              {
                "id": "assessment-differentiation-lesson-3",
                "type": "interactive",
                "title": "Assessment Differentiation Tool",
                "points": 30,
                "content": {
                  "description": "Design differentiated assessments and reflect on fairness and validity",
                  "steps": [
                    "Design differentiated assessments",
                    "Create accommodations that maintain validity",
                    "Develop alternative assessment options",
                    "Ensure fairness across assessment types",
                    "Use assessment data to inform differentiation"
                  ]
                }
              },
              {
                "id": "assessment-differentiation-lesson-4",
                "type": "template",
                "title": "Differentiated Assessment Templates",
                "points": 25,
                "content": {
                  "description": "Create differentiated assessment options for your next unit that accurately measure learning for all students.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "advanced-grouping",
          "slug": "advanced-grouping-module",
          "title": "Advanced Grouping Strategies",
          "description": "Master sophisticated grouping techniques that maximize learning through strategic student placement and collaboration.",
          "duration": "25 min",
          "level": "Advanced",
          "impact": "Medium",
          "skillIds": [
            "diff-strategic-grouping",
            "diff-heterogeneous-groups",
            "diff-homogeneous-groups",
            "diff-dynamic-grouping"
          ],
          "learningOutcomes": [
            "Understand when to use different grouping strategies",
            "Design heterogeneous groups for collaboration",
            "Create homogeneous groups for targeted instruction",
            "Implement dynamic grouping that changes based on needs",
            "Maximize learning through strategic grouping"
          ],
          "assessment": {
            "type": "Reflection",
            "description": "Reflect on your grouping strategies and plan improvements",
            "points": 100
          },
          "realWorldApplication": "Implement strategic grouping in your next unit, varying groups based on learning needs.",
          "content": [
            {
              "type": "video",
              "title": "Advanced Grouping Techniques",
              "duration": "12 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Advanced Grouping Techniques",
                "duration": "12 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Research on Grouping Effectiveness",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Grouping Strategy Planner",
              "points": 25
            },
            {
              "type": "template",
              "title": "Grouping Templates & Tools",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 6 of 6",
            "backPathSlug": "advanced-differentiation-strategies",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-green-100 border-2 border-green-500 text-green-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-green-600",
              "pointsPill": "bg-green-100 text-green-700",
              "videoOverlayGradient": "from-green-600 to-emerald-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-green-600",
              "showLessonHeaderShare": true,
              "keyPointsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "keyPointsCheck": "text-green-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "readingTakeawaysIcon": "text-green-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-green-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-green-100 text-green-700",
              "templateDownloadCard": "p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100",
              "templateDownloadIcon": "text-green-600",
              "markCompleteButton": "bg-green-600 hover:bg-green-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "advanced-grouping-lesson-1",
                "type": "video",
                "title": "Advanced Grouping Techniques",
                "duration": "12 min",
                "points": 20,
                "content": {
                  "description": "Master sophisticated grouping techniques that maximize learning through strategic student placement and collaboration.",
                  "keyPoints": [
                    "Understand when to use different grouping strategies",
                    "Design heterogeneous groups for collaboration",
                    "Create homogeneous groups for targeted instruction",
                    "Implement dynamic grouping that changes based on needs",
                    "Maximize learning through strategic grouping"
                  ],
                  "transcript": "Master sophisticated grouping techniques that maximize learning through strategic student placement and collaboration. Implement strategic grouping in your next unit, varying groups based on learning needs."
                }
              },
              {
                "id": "advanced-grouping-lesson-2",
                "type": "reading",
                "title": "Research on Grouping Effectiveness",
                "points": 15,
                "content": {
                  "article": "# Advanced Grouping Strategies\n\n## Overview\n\nMaster sophisticated grouping techniques that maximize learning through strategic student placement and collaboration.\n\n## Skills In Focus\n\n1. Strategic grouping\n2. Heterogeneous groups\n3. Homogeneous groups\n4. Dynamic grouping\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Understand when to use different grouping strategies",
                    "Design heterogeneous groups for collaboration",
                    "Create homogeneous groups for targeted instruction",
                    "Implement dynamic grouping that changes based on needs",
                    "Maximize learning through strategic grouping"
                  ]
                }
              },
              {
                "id": "advanced-grouping-lesson-3",
                "type": "interactive",
                "title": "Grouping Strategy Planner",
                "points": 25,
                "content": {
                  "description": "Reflect on your grouping strategies and plan improvements",
                  "steps": [
                    "Understand when to use different grouping strategies",
                    "Design heterogeneous groups for collaboration",
                    "Create homogeneous groups for targeted instruction",
                    "Implement dynamic grouping that changes based on needs",
                    "Maximize learning through strategic grouping"
                  ]
                }
              },
              {
                "id": "advanced-grouping-lesson-4",
                "type": "template",
                "title": "Grouping Templates & Tools",
                "points": 20,
                "content": {
                  "description": "Implement strategic grouping in your next unit, varying groups based on learning needs.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        }
      ],
      "pathTheme": {
        "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
        "accentBorder": "border-green-200",
        "accentBg": "from-green-50 to-emerald-50",
        "accentText": "text-green-600",
        "button": "bg-green-600 hover:bg-green-700",
        "tipPanelBg": "from-green-50 to-emerald-50",
        "tipPanelBorder": "border-green-200",
        "heroDescriptionClass": "text-green-100",
        "sparklesIconBg": "bg-green-600",
        "guidancePersonalizedBadge": "px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold",
        "guidanceTipBoxBorder": "border-green-200",
        "nextStepIconClass": "text-green-600",
        "skillImpactHeaderIcon": "text-green-600",
        "skillImprovementClass": "text-green-600",
        "skillBarAfter": "bg-green-500",
        "pathSidebarProgressBar": "bg-green-600",
        "pathSkillChip": "px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium",
        "moduleNumberBadge": "bg-green-100 text-green-600",
        "moduleExpandedBorder": "border-green-300",
        "moduleExpandedBg": "bg-green-50",
        "moduleCollapsedHoverBorder": "hover:border-green-200",
        "moduleExpandedInnerBorder": "border-t border-green-200",
        "sectionHeadingIconClass": "text-green-600",
        "moduleContentRowIconClass": "text-green-600",
        "moduleContentPointsClass": "text-green-600",
        "assessmentPanel": "bg-green-50 rounded-lg p-4 border border-green-200",
        "assessmentIconClass": "text-green-600",
        "assessmentPointsClass": "text-green-600",
        "markCompleteOutlineButton": "border-2 border-green-600 text-green-600 hover:bg-green-50",
        "pathOverviewImpactBadgeHigh": "px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeMedium": "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeLow": "px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
      }
    }
  },
  {
    "id": "agr-2",
    "slug": "ai-assisted-assessment-design",
    "title": "AI-assisted assessment design",
    "shortDescription": "Your formative assessments could benefit from automated rubric generation and instant feedback loops.",
    "duration": "1.5 hours",
    "ctaLabel": "Start Path",
    "sectionKey": "ai-growth-recommendations",
    "aiGrowthRecommendationContent": {
      "type": "path",
      "themeId": "ai-growth-assessment",
      "storageKey": "ai-assessment-completed",
      "estimatedTime": "1.5 hours",
      "impactLevel": "Medium",
      "heroSubtitle": "AI-Guided Learning Path",
      "heroDescription": "Leverage AI to automate rubric generation and create instant feedback loops that accelerate learning",
      "aiGuidance": {
        "recommendation": "Start with Automated Rubrics, then explore Instant Feedback",
        "reason": "Your formative assessments could benefit from automated rubric generation and instant feedback loops. Start with rubrics to establish clear criteria, then add instant feedback to accelerate learning.",
        "nextSteps": [
          "Complete Automated Rubric Generation module",
          "Generate your first AI rubric",
          "Explore Instant Feedback Loops",
          "Implement AI feedback in one assessment"
        ],
        "personalizedTip": "You create detailed assessments regularly. AI can help you generate rubrics quickly while you focus on refining them for your specific students."
      },
      "skillImpacts": [
        {
          "skillId": "impact-assess-efficiency",
          "before": 55,
          "after": 85,
          "improvement": 30,
          "description": "Time saved on assessment creation and grading"
        },
        {
          "skillId": "impact-assess-feedback-quality",
          "before": 62,
          "after": 88,
          "improvement": 26,
          "description": "Improvement in feedback timeliness and specificity"
        },
        {
          "skillId": "impact-assess-frequency",
          "before": 58,
          "after": 82,
          "improvement": 24,
          "description": "Increase in formative assessment frequency"
        },
        {
          "skillId": "impact-assess-student-growth",
          "before": 65,
          "after": 86,
          "improvement": 21,
          "description": "Better student growth through faster feedback"
        },
        {
          "skillId": "impact-assess-data-insights",
          "before": 60,
          "after": 84,
          "improvement": 24,
          "description": "Improved insights from automated analysis"
        }
      ],
      "modules": [
        {
          "id": "ai-assessment-intro",
          "slug": "ai-assessment-intro-module",
          "title": "Introduction to AI in Assessment",
          "description": "Understand how AI can enhance assessment design, automate rubric creation, and provide instant feedback to improve learning outcomes.",
          "duration": "25 min",
          "level": "Beginner",
          "impact": "Medium",
          "skillIds": [
            "assess-ai-tools",
            "assess-assessment-design",
            "assess-automation",
            "assess-feedback-systems"
          ],
          "learningOutcomes": [
            "Understand AI capabilities in assessment",
            "Identify opportunities for AI integration",
            "Evaluate AI assessment tools",
            "Maintain assessment validity with AI",
            "Set up your AI assessment workflow"
          ],
          "assessment": {
            "type": "Reflection",
            "description": "Reflect on how AI can enhance your assessment practices",
            "points": 100
          },
          "realWorldApplication": "Identify one assessment in your next unit that could benefit from AI assistance.",
          "content": [
            {
              "type": "video",
              "title": "AI in Assessment: An Overview",
              "duration": "10 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "provider": "youtube",
                "title": "AI in Assessment: An Overview",
                "duration": "10 min",
                "controls": true
              }
            },
            {
              "type": "reading",
              "title": "AI Tools for Teachers",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "AI Assessment Tool Explorer",
              "points": 25
            },
            {
              "type": "template",
              "title": "Assessment Planning Template",
              "points": 15
            }
          ],
          "detail": {
            "moduleLabel": "Module 1 of 5",
            "backPathSlug": "ai-assisted-assessment-design",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-indigo-600 via-blue-600 to-cyan-600",
              "heroSubtitleClass": "text-indigo-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-indigo-100 border-2 border-indigo-500 text-indigo-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-indigo-600",
              "sidebarProgressFill": "bg-indigo-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-indigo-600",
              "pointsPill": "bg-indigo-100 text-indigo-700",
              "videoOverlayGradient": "from-indigo-600 to-blue-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-indigo-600",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "keyPointsCheck": "text-indigo-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "readingTakeawaysIcon": "text-indigo-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-indigo-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-indigo-100 text-indigo-700",
              "templateDownloadCard": "p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100",
              "templateDownloadIcon": "text-indigo-600",
              "markCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-indigo-600 hover:bg-indigo-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "ai-assessment-intro-lesson-1",
                "type": "video",
                "title": "AI in Assessment: An Overview",
                "duration": "10 min",
                "points": 20,
                "content": {
                  "description": "Understand how AI can enhance assessment design, automate rubric creation, and provide instant feedback to improve learning outcomes.",
                  "keyPoints": [
                    "Understand AI capabilities in assessment",
                    "Identify opportunities for AI integration",
                    "Evaluate AI assessment tools",
                    "Maintain assessment validity with AI",
                    "Set up your AI assessment workflow"
                  ],
                  "transcript": "Understand how AI can enhance assessment design, automate rubric creation, and provide instant feedback to improve learning outcomes. Identify one assessment in your next unit that could benefit from AI assistance."
                }
              },
              {
                "id": "ai-assessment-intro-lesson-2",
                "type": "reading",
                "title": "AI Tools for Teachers",
                "points": 15,
                "content": {
                  "article": "# Introduction to AI in Assessment\n\n## Overview\n\nUnderstand how AI can enhance assessment design, automate rubric creation, and provide instant feedback to improve learning outcomes.\n\n## Skills In Focus\n\n1. AI tools\n2. Assessment design\n3. Automation\n4. Feedback systems\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Understand AI capabilities in assessment",
                    "Identify opportunities for AI integration",
                    "Evaluate AI assessment tools",
                    "Maintain assessment validity with AI",
                    "Set up your AI assessment workflow"
                  ]
                }
              },
              {
                "id": "ai-assessment-intro-lesson-3",
                "type": "interactive",
                "title": "AI Assessment Tool Explorer",
                "points": 25,
                "content": {
                  "description": "Reflect on how AI can enhance your assessment practices",
                  "steps": [
                    "Understand AI capabilities in assessment",
                    "Identify opportunities for AI integration",
                    "Evaluate AI assessment tools",
                    "Maintain assessment validity with AI",
                    "Set up your AI assessment workflow"
                  ]
                }
              },
              {
                "id": "ai-assessment-intro-lesson-4",
                "type": "template",
                "title": "Assessment Planning Template",
                "points": 15,
                "content": {
                  "description": "Identify one assessment in your next unit that could benefit from AI assistance.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "automated-rubrics",
          "slug": "automated-rubrics-module",
          "title": "Automated Rubric Generation",
          "description": "Learn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality and rigor.",
          "duration": "30 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "assess-rubric-design",
            "assess-ai-prompts",
            "assess-standards-alignment",
            "assess-quality-control"
          ],
          "learningOutcomes": [
            "Write effective prompts for rubric generation",
            "Generate standards-aligned rubrics with AI",
            "Refine and customize AI-generated rubrics",
            "Ensure rubric quality and validity",
            "Create rubrics efficiently"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Generate and refine 3 rubrics using AI for different assessment types",
            "points": 100
          },
          "realWorldApplication": "Use AI to generate rubrics for your next major assignment, then customize them for your needs.",
          "content": [
            {
              "type": "video",
              "title": "AI Rubric Generation Techniques",
              "duration": "12 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "AI Rubric Generation Techniques",
                "duration": "12 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Rubric Design Best Practices",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "AI Rubric Generator Tool",
              "points": 35
            },
            {
              "type": "template",
              "title": "Rubric Prompt Templates",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 2 of 5",
            "backPathSlug": "ai-assisted-assessment-design",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-indigo-600 via-blue-600 to-cyan-600",
              "heroSubtitleClass": "text-indigo-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-indigo-100 border-2 border-indigo-500 text-indigo-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-indigo-600",
              "sidebarProgressFill": "bg-indigo-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-indigo-600",
              "pointsPill": "bg-indigo-100 text-indigo-700",
              "videoOverlayGradient": "from-indigo-600 to-blue-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-indigo-600",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "keyPointsCheck": "text-indigo-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "readingTakeawaysIcon": "text-indigo-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-indigo-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-indigo-100 text-indigo-700",
              "templateDownloadCard": "p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100",
              "templateDownloadIcon": "text-indigo-600",
              "markCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-indigo-600 hover:bg-indigo-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "automated-rubrics-lesson-1",
                "type": "video",
                "title": "AI Rubric Generation Techniques",
                "duration": "12 min",
                "points": 25,
                "content": {
                  "description": "Learn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality and rigor.",
                  "keyPoints": [
                    "Write effective prompts for rubric generation",
                    "Generate standards-aligned rubrics with AI",
                    "Refine and customize AI-generated rubrics",
                    "Ensure rubric quality and validity",
                    "Create rubrics efficiently"
                  ],
                  "transcript": "Learn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality and rigor. Use AI to generate rubrics for your next major assignment, then customize them for your needs."
                }
              },
              {
                "id": "automated-rubrics-lesson-2",
                "type": "reading",
                "title": "Rubric Design Best Practices",
                "points": 20,
                "content": {
                  "article": "# Automated Rubric Generation\n\n## Overview\n\nLearn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality and rigor.\n\n## Skills In Focus\n\n1. Rubric design\n2. AI prompts\n3. Standards alignment\n4. Quality control\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Write effective prompts for rubric generation",
                    "Generate standards-aligned rubrics with AI",
                    "Refine and customize AI-generated rubrics",
                    "Ensure rubric quality and validity",
                    "Create rubrics efficiently"
                  ]
                }
              },
              {
                "id": "automated-rubrics-lesson-3",
                "type": "interactive",
                "title": "AI Rubric Generator Tool",
                "points": 35,
                "content": {
                  "description": "Generate and refine 3 rubrics using AI for different assessment types",
                  "steps": [
                    "Write effective prompts for rubric generation",
                    "Generate standards-aligned rubrics with AI",
                    "Refine and customize AI-generated rubrics",
                    "Ensure rubric quality and validity",
                    "Create rubrics efficiently"
                  ]
                }
              },
              {
                "id": "automated-rubrics-lesson-4",
                "type": "template",
                "title": "Rubric Prompt Templates",
                "points": 20,
                "content": {
                  "description": "Use AI to generate rubrics for your next major assignment, then customize them for your needs.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "instant-feedback",
          "slug": "instant-feedback-module",
          "title": "Instant Feedback Loops",
          "description": "Implement AI-powered feedback systems that provide immediate, actionable feedback to students, accelerating learning.",
          "duration": "35 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "assess-feedback-automation",
            "assess-ai-feedback",
            "assess-formative-assessment",
            "assess-student-growth"
          ],
          "learningOutcomes": [
            "Design AI-powered feedback systems",
            "Create effective feedback prompts",
            "Implement instant feedback in assessments",
            "Balance AI feedback with teacher feedback",
            "Use feedback data to inform instruction"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Design and implement an AI feedback system for one assessment",
            "points": 100
          },
          "realWorldApplication": "Set up instant AI feedback for your next formative assessment to provide immediate guidance to students.",
          "content": [
            {
              "type": "video",
              "title": "AI Feedback Systems",
              "duration": "15 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "AI Feedback Systems",
                "duration": "15 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Effective Feedback Strategies",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Feedback Loop Designer",
              "points": 35
            },
            {
              "type": "template",
              "title": "Feedback Prompt Library",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 3 of 5",
            "backPathSlug": "ai-assisted-assessment-design",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-indigo-600 via-blue-600 to-cyan-600",
              "heroSubtitleClass": "text-indigo-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-indigo-100 border-2 border-indigo-500 text-indigo-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-indigo-600",
              "sidebarProgressFill": "bg-indigo-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-indigo-600",
              "pointsPill": "bg-indigo-100 text-indigo-700",
              "videoOverlayGradient": "from-indigo-600 to-blue-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-indigo-600",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "keyPointsCheck": "text-indigo-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "readingTakeawaysIcon": "text-indigo-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-indigo-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-indigo-100 text-indigo-700",
              "templateDownloadCard": "p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100",
              "templateDownloadIcon": "text-indigo-600",
              "markCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-indigo-600 hover:bg-indigo-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "instant-feedback-lesson-1",
                "type": "video",
                "title": "AI Feedback Systems",
                "duration": "15 min",
                "points": 25,
                "content": {
                  "description": "Implement AI-powered feedback systems that provide immediate, actionable feedback to students, accelerating learning.",
                  "keyPoints": [
                    "Design AI-powered feedback systems",
                    "Create effective feedback prompts",
                    "Implement instant feedback in assessments",
                    "Balance AI feedback with teacher feedback",
                    "Use feedback data to inform instruction"
                  ],
                  "transcript": "Implement AI-powered feedback systems that provide immediate, actionable feedback to students, accelerating learning. Set up instant AI feedback for your next formative assessment to provide immediate guidance to students."
                }
              },
              {
                "id": "instant-feedback-lesson-2",
                "type": "reading",
                "title": "Effective Feedback Strategies",
                "points": 20,
                "content": {
                  "article": "# Instant Feedback Loops\n\n## Overview\n\nImplement AI-powered feedback systems that provide immediate, actionable feedback to students, accelerating learning.\n\n## Skills In Focus\n\n1. Feedback automation\n2. AI feedback\n3. Formative assessment\n4. Student growth\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design AI-powered feedback systems",
                    "Create effective feedback prompts",
                    "Implement instant feedback in assessments",
                    "Balance AI feedback with teacher feedback",
                    "Use feedback data to inform instruction"
                  ]
                }
              },
              {
                "id": "instant-feedback-lesson-3",
                "type": "interactive",
                "title": "Feedback Loop Designer",
                "points": 35,
                "content": {
                  "description": "Design and implement an AI feedback system for one assessment",
                  "steps": [
                    "Design AI-powered feedback systems",
                    "Create effective feedback prompts",
                    "Implement instant feedback in assessments",
                    "Balance AI feedback with teacher feedback",
                    "Use feedback data to inform instruction"
                  ]
                }
              },
              {
                "id": "instant-feedback-lesson-4",
                "type": "template",
                "title": "Feedback Prompt Library",
                "points": 20,
                "content": {
                  "description": "Set up instant AI feedback for your next formative assessment to provide immediate guidance to students.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "formative-automation",
          "slug": "formative-automation-module",
          "title": "Formative Assessment Automation",
          "description": "Automate formative assessment creation and analysis to save time while maintaining quality and gaining deeper insights.",
          "duration": "30 min",
          "level": "Advanced",
          "impact": "Medium",
          "skillIds": [
            "assess-formative-assessment",
            "assess-question-generation",
            "assess-data-analysis",
            "assess-time-efficiency"
          ],
          "learningOutcomes": [
            "Generate formative assessment questions with AI",
            "Automate assessment analysis and insights",
            "Create quick-check assessments efficiently",
            "Use AI to identify learning gaps",
            "Streamline formative assessment workflow"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Create a suite of automated formative assessments for one unit",
            "points": 100
          },
          "realWorldApplication": "Automate formative assessment creation for your next unit to save time and increase frequency.",
          "content": [
            {
              "type": "video",
              "title": "Automating Formative Assessment",
              "duration": "12 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Automating Formative Assessment",
                "duration": "12 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Formative Assessment Best Practices",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Formative Assessment Builder",
              "points": 30
            },
            {
              "type": "template",
              "title": "Automated Assessment Templates",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 4 of 5",
            "backPathSlug": "ai-assisted-assessment-design",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-indigo-600 via-blue-600 to-cyan-600",
              "heroSubtitleClass": "text-indigo-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-indigo-100 border-2 border-indigo-500 text-indigo-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-indigo-600",
              "sidebarProgressFill": "bg-indigo-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-indigo-600",
              "pointsPill": "bg-indigo-100 text-indigo-700",
              "videoOverlayGradient": "from-indigo-600 to-blue-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-indigo-600",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "keyPointsCheck": "text-indigo-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "readingTakeawaysIcon": "text-indigo-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-indigo-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-indigo-100 text-indigo-700",
              "templateDownloadCard": "p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100",
              "templateDownloadIcon": "text-indigo-600",
              "markCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-indigo-600 hover:bg-indigo-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "formative-automation-lesson-1",
                "type": "video",
                "title": "Automating Formative Assessment",
                "duration": "12 min",
                "points": 25,
                "content": {
                  "description": "Automate formative assessment creation and analysis to save time while maintaining quality and gaining deeper insights.",
                  "keyPoints": [
                    "Generate formative assessment questions with AI",
                    "Automate assessment analysis and insights",
                    "Create quick-check assessments efficiently",
                    "Use AI to identify learning gaps",
                    "Streamline formative assessment workflow"
                  ],
                  "transcript": "Automate formative assessment creation and analysis to save time while maintaining quality and gaining deeper insights. Automate formative assessment creation for your next unit to save time and increase frequency."
                }
              },
              {
                "id": "formative-automation-lesson-2",
                "type": "reading",
                "title": "Formative Assessment Best Practices",
                "points": 20,
                "content": {
                  "article": "# Formative Assessment Automation\n\n## Overview\n\nAutomate formative assessment creation and analysis to save time while maintaining quality and gaining deeper insights.\n\n## Skills In Focus\n\n1. Formative assessment\n2. Question generation\n3. Data analysis\n4. Time efficiency\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Generate formative assessment questions with AI",
                    "Automate assessment analysis and insights",
                    "Create quick-check assessments efficiently",
                    "Use AI to identify learning gaps",
                    "Streamline formative assessment workflow"
                  ]
                }
              },
              {
                "id": "formative-automation-lesson-3",
                "type": "interactive",
                "title": "Formative Assessment Builder",
                "points": 30,
                "content": {
                  "description": "Create a suite of automated formative assessments for one unit",
                  "steps": [
                    "Generate formative assessment questions with AI",
                    "Automate assessment analysis and insights",
                    "Create quick-check assessments efficiently",
                    "Use AI to identify learning gaps",
                    "Streamline formative assessment workflow"
                  ]
                }
              },
              {
                "id": "formative-automation-lesson-4",
                "type": "template",
                "title": "Automated Assessment Templates",
                "points": 25,
                "content": {
                  "description": "Automate formative assessment creation for your next unit to save time and increase frequency.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "summative-ai-design",
          "slug": "summative-ai-design-module",
          "title": "AI-Enhanced Summative Assessment Design",
          "description": "Design comprehensive summative assessments with AI assistance while maintaining rigor, validity, and fairness.",
          "duration": "25 min",
          "level": "Advanced",
          "impact": "Medium",
          "skillIds": [
            "assess-summative-design",
            "assess-ai-integration",
            "assess-assessment-validity",
            "assess-quality-assurance"
          ],
          "learningOutcomes": [
            "Design summative assessments with AI support",
            "Ensure assessment validity and reliability",
            "Create comprehensive assessment suites",
            "Balance AI efficiency with teacher judgment",
            "Maintain assessment quality standards"
          ],
          "assessment": {
            "type": "Project + Reflection",
            "description": "Design a summative assessment with AI assistance and reflect on the process",
            "points": 100
          },
          "realWorldApplication": "Use AI to design your next summative assessment, then refine it with your professional judgment.",
          "content": [
            {
              "type": "video",
              "title": "AI in Summative Assessment",
              "duration": "10 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "AI in Summative Assessment",
                "duration": "10 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Summative Assessment Design Principles",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Summative Assessment Designer",
              "points": 30
            },
            {
              "type": "template",
              "title": "Summative Assessment Templates",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 5 of 5",
            "backPathSlug": "ai-assisted-assessment-design",
            "pageVisual": {
              "sidebarStyle": "tiered",
              "headerGradient": "from-indigo-600 via-blue-600 to-cyan-600",
              "heroSubtitleClass": "text-indigo-100",
              "heroShowEarnedPoints": false,
              "heroShowImpactRow": false,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "bg-indigo-100 border-2 border-indigo-500 text-indigo-900",
              "tieredSidebarCompleted": "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
              "tieredSidebarIdle": "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              "tieredSidebarCheckComplete": "text-indigo-600",
              "sidebarProgressFill": "bg-indigo-600",
              "engagementSidebarActive": "",
              "engagementSidebarIdle": "",
              "engagementNumCompleted": "",
              "engagementNumActive": "",
              "engagementNumIdle": "",
              "engagementTitleActive": "",
              "lessonTypeIconClass": "text-indigo-600",
              "pointsPill": "bg-indigo-100 text-indigo-700",
              "videoOverlayGradient": "from-indigo-600 to-blue-600",
              "videoPlayUseTranslucent": false,
              "videoPlayIconClass": "text-indigo-600",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "keyPointsCheck": "text-indigo-600",
              "transcriptPanel": "bg-white rounded-lg p-6 border border-gray-200",
              "readingArticleWrap": "bg-white rounded-lg p-8 border border-gray-200",
              "readingTakeawaysPanel": "bg-indigo-50 rounded-lg p-6 border border-indigo-200",
              "readingTakeawaysIcon": "text-indigo-600",
              "interactiveStepsPanel": "bg-green-50 rounded-lg p-6 border border-green-200",
              "interactiveStepNumber": "bg-indigo-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-indigo-100 text-indigo-700",
              "templateDownloadCard": "p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100",
              "templateDownloadIcon": "text-indigo-600",
              "markCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-indigo-600 hover:bg-indigo-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "inline-only",
              "footerCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "blockHeadingClass": "text-sm font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "summative-ai-design-lesson-1",
                "type": "video",
                "title": "AI in Summative Assessment",
                "duration": "10 min",
                "points": 20,
                "content": {
                  "description": "Design comprehensive summative assessments with AI assistance while maintaining rigor, validity, and fairness.",
                  "keyPoints": [
                    "Design summative assessments with AI support",
                    "Ensure assessment validity and reliability",
                    "Create comprehensive assessment suites",
                    "Balance AI efficiency with teacher judgment",
                    "Maintain assessment quality standards"
                  ],
                  "transcript": "Design comprehensive summative assessments with AI assistance while maintaining rigor, validity, and fairness. Use AI to design your next summative assessment, then refine it with your professional judgment."
                }
              },
              {
                "id": "summative-ai-design-lesson-2",
                "type": "reading",
                "title": "Summative Assessment Design Principles",
                "points": 15,
                "content": {
                  "article": "# AI-Enhanced Summative Assessment Design\n\n## Overview\n\nDesign comprehensive summative assessments with AI assistance while maintaining rigor, validity, and fairness.\n\n## Skills In Focus\n\n1. Summative design\n2. AI integration\n3. Assessment validity\n4. Quality assurance\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design summative assessments with AI support",
                    "Ensure assessment validity and reliability",
                    "Create comprehensive assessment suites",
                    "Balance AI efficiency with teacher judgment",
                    "Maintain assessment quality standards"
                  ]
                }
              },
              {
                "id": "summative-ai-design-lesson-3",
                "type": "interactive",
                "title": "Summative Assessment Designer",
                "points": 30,
                "content": {
                  "description": "Design a summative assessment with AI assistance and reflect on the process",
                  "steps": [
                    "Design summative assessments with AI support",
                    "Ensure assessment validity and reliability",
                    "Create comprehensive assessment suites",
                    "Balance AI efficiency with teacher judgment",
                    "Maintain assessment quality standards"
                  ]
                }
              },
              {
                "id": "summative-ai-design-lesson-4",
                "type": "template",
                "title": "Summative Assessment Templates",
                "points": 20,
                "content": {
                  "description": "Use AI to design your next summative assessment, then refine it with your professional judgment.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        }
      ],
      "pathTheme": {
        "headerGradient": "from-indigo-600 via-blue-600 to-cyan-600",
        "accentBorder": "border-indigo-200",
        "accentBg": "from-indigo-50 to-blue-50",
        "accentText": "text-indigo-600",
        "button": "bg-indigo-600 hover:bg-indigo-700",
        "tipPanelBg": "from-indigo-50 to-blue-50",
        "tipPanelBorder": "border-indigo-200",
        "heroDescriptionClass": "text-indigo-100",
        "sparklesIconBg": "bg-indigo-600",
        "guidancePersonalizedBadge": "px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold",
        "guidanceTipBoxBorder": "border-indigo-200",
        "nextStepIconClass": "text-indigo-600",
        "skillImpactHeaderIcon": "text-indigo-600",
        "skillImprovementClass": "text-indigo-600",
        "skillBarAfter": "bg-indigo-500",
        "pathSidebarProgressBar": "bg-indigo-600",
        "pathSkillChip": "px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium",
        "moduleNumberBadge": "bg-indigo-100 text-indigo-600",
        "moduleExpandedBorder": "border-indigo-300",
        "moduleExpandedBg": "bg-indigo-50",
        "moduleCollapsedHoverBorder": "hover:border-indigo-200",
        "moduleExpandedInnerBorder": "border-t border-indigo-200",
        "sectionHeadingIconClass": "text-indigo-600",
        "moduleContentRowIconClass": "text-indigo-600",
        "moduleContentPointsClass": "text-indigo-600",
        "assessmentPanel": "bg-indigo-50 rounded-lg p-4 border border-indigo-200",
        "assessmentIconClass": "text-indigo-600",
        "assessmentPointsClass": "text-indigo-600",
        "markCompleteOutlineButton": "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        "pathOverviewImpactBadgeHigh": "px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeMedium": "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeLow": "px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
      }
    }
  },
  {
    "id": "agr-3",
    "slug": "student-engagement-techniques",
    "title": "Student engagement techniques",
    "shortDescription": "Based on your lesson patterns, explore gamification and inquiry-based learning hooks.",
    "duration": "3 hours",
    "ctaLabel": "Start Path",
    "sectionKey": "ai-growth-recommendations",
    "aiGrowthRecommendationContent": {
      "type": "path",
      "themeId": "ai-growth-student-engagement",
      "storageKey": "student-engagement-completed",
      "estimatedTime": "3 hours",
      "impactLevel": "High",
      "heroSubtitle": "AI-Guided Learning Path",
      "heroDescription": "Master gamification and inquiry-based learning hooks to transform your classroom",
      "aiGuidance": {
        "recommendation": "Focus on Gamification Fundamentals first, then move to Inquiry Hooks",
        "reason": "Based on your lesson patterns, you create structured lessons that would benefit from gamification elements. Once students are engaged, inquiry-based hooks will deepen their learning.",
        "nextSteps": [
          "Complete Gamification Fundamentals module",
          "Apply points system to your next lesson",
          "Try one inquiry hook this week",
          "Track student engagement metrics"
        ],
        "personalizedTip": "Your students respond well to visual rewards. Consider starting with badge systems before introducing leaderboards."
      },
      "skillImpacts": [
        {
          "skillId": "impact-eng-participation",
          "before": 65,
          "after": 92,
          "improvement": 27,
          "description": "Increase in active student participation during lessons"
        },
        {
          "skillId": "impact-eng-lesson-engagement",
          "before": 58,
          "after": 88,
          "improvement": 30,
          "description": "Improvement in overall lesson engagement scores"
        },
        {
          "skillId": "impact-eng-retention",
          "before": 62,
          "after": 85,
          "improvement": 23,
          "description": "Better long-term retention of learned concepts"
        },
        {
          "skillId": "impact-eng-motivation",
          "before": 59,
          "after": 90,
          "improvement": 31,
          "description": "Increase in intrinsic motivation to learn"
        },
        {
          "skillId": "impact-eng-classroom-management",
          "before": 71,
          "after": 89,
          "improvement": 18,
          "description": "Reduction in behavioral issues through engagement"
        }
      ],
      "pathLayout": "student-engagement",
      "studentEngagementExtras": {
        "achievements": [
          {
            "name": "First Steps",
            "description": "Complete your first module",
            "rule": {
              "type": "minCompleted",
              "count": 1
            }
          },
          {
            "name": "Gamification Master",
            "description": "Master gamification fundamentals",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "gamification-basics"
            }
          },
          {
            "name": "Inquiry Expert",
            "description": "Learn inquiry-based hooks",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "inquiry-hooks"
            }
          },
          {
            "name": "Engagement Champion",
            "description": "Complete 5 modules",
            "rule": {
              "type": "minCompleted",
              "count": 5
            }
          },
          {
            "name": "Pathway Complete",
            "description": "Finish all modules",
            "rule": {
              "type": "allUnlockedCompleted"
            }
          }
        ],
        "bottomCta": {
          "title": "Ready to Transform Your Classroom?",
          "subtitle": "Start your first module and begin applying engagement techniques immediately",
          "primaryLabel": "Start Learning Path",
          "secondaryLabel": "Explore More Paths"
        }
      },
      "modules": [
        {
          "id": "gamification-basics",
          "slug": "gamification-fundamentals",
          "title": "Gamification Fundamentals",
          "description": "Learn the core principles of gamification and how to apply game mechanics to increase student motivation and engagement.",
          "duration": "45 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "eng-game-mechanics",
            "eng-reward-systems",
            "eng-progress-tracking",
            "eng-student-motivation"
          ],
          "learningOutcomes": [
            "Understand core gamification principles and psychology",
            "Design effective reward systems that motivate students",
            "Apply game mechanics to lesson planning",
            "Create progress tracking systems",
            "Implement gamification in your classroom"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Create a complete gamified lesson plan with reward systems and progress tracking",
            "points": 100
          },
          "realWorldApplication": "Implement a gamified unit in your classroom and track student engagement improvements.",
          "content": [
            {
              "type": "video",
              "title": "Introduction to Gamification",
              "duration": "12 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Introduction to Gamification",
                "duration": "12 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "The Psychology of Game-Based Learning",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Gamification Design Workshop",
              "points": 25
            },
            {
              "type": "template",
              "title": "Gamification Lesson Template",
              "points": 15
            },
            {
              "type": "project",
              "title": "Design Your Gamified Lesson",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 1 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-amber-600 via-orange-600 to-red-600",
              "heroSubtitleClass": "text-amber-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": true,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-amber-600",
              "engagementSidebarActive": "bg-amber-50 border-2 border-amber-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-amber-100 text-amber-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-amber-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "gamification-basics-lesson-1",
                "type": "video",
                "title": "Introduction to Gamification",
                "duration": "12 min",
                "points": 20,
                "content": {
                  "description": "Learn the core principles of gamification and how to apply game mechanics to increase student motivation and engagement.",
                  "keyPoints": [
                    "Understand core gamification principles and psychology",
                    "Design effective reward systems that motivate students",
                    "Apply game mechanics to lesson planning",
                    "Create progress tracking systems",
                    "Implement gamification in your classroom"
                  ],
                  "transcript": "Learn the core principles of gamification and how to apply game mechanics to increase student motivation and engagement. Implement a gamified unit in your classroom and track student engagement improvements."
                }
              },
              {
                "id": "gamification-basics-lesson-2",
                "type": "reading",
                "title": "The Psychology of Game-Based Learning",
                "points": 15,
                "content": {
                  "article": "# Gamification Fundamentals\n\n## Overview\n\nLearn the core principles of gamification and how to apply game mechanics to increase student motivation and engagement.\n\n## Skills In Focus\n\n1. Game mechanics\n2. Reward systems\n3. Progress tracking\n4. Student motivation\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Understand core gamification principles and psychology",
                    "Design effective reward systems that motivate students",
                    "Apply game mechanics to lesson planning",
                    "Create progress tracking systems",
                    "Implement gamification in your classroom"
                  ]
                }
              },
              {
                "id": "gamification-basics-lesson-3",
                "type": "interactive",
                "title": "Gamification Design Workshop",
                "points": 25,
                "content": {
                  "description": "Create a complete gamified lesson plan with reward systems and progress tracking",
                  "steps": [
                    "Understand core gamification principles and psychology",
                    "Design effective reward systems that motivate students",
                    "Apply game mechanics to lesson planning",
                    "Create progress tracking systems",
                    "Implement gamification in your classroom"
                  ]
                }
              },
              {
                "id": "gamification-basics-lesson-4",
                "type": "template",
                "title": "Gamification Lesson Template",
                "points": 15,
                "content": {
                  "description": "Implement a gamified unit in your classroom and track student engagement improvements.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              },
              {
                "id": "gamification-basics-lesson-5",
                "type": "interactive",
                "title": "Design Your Gamified Lesson",
                "points": 25,
                "content": {
                  "description": "Create a complete gamified lesson plan with reward systems and progress tracking",
                  "steps": [
                    "Understand core gamification principles and psychology",
                    "Design effective reward systems that motivate students",
                    "Apply game mechanics to lesson planning",
                    "Create progress tracking systems",
                    "Implement gamification in your classroom"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "points-badges-leaderboards",
          "slug": "points-badges-leaderboards",
          "title": "Points, Badges & Leaderboards",
          "description": "Master the most popular gamification elements and learn when and how to use them effectively in your classroom.",
          "duration": "60 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "eng-point-systems",
            "eng-badge-design",
            "eng-leaderboard-management",
            "eng-fair-competition"
          ],
          "learningOutcomes": [
            "Design effective point systems that reflect learning",
            "Create meaningful badge systems with clear criteria",
            "Implement leaderboards that motivate without demotivating",
            "Balance competition with collaboration",
            "Avoid common gamification pitfalls"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Design a complete points, badges, and leaderboard system for your classroom",
            "points": 100
          },
          "realWorldApplication": "Implement a points and badge system in your next unit and measure student engagement.",
          "content": [
            {
              "type": "video",
              "title": "Designing Effective Point Systems",
              "duration": "15 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Designing Effective Point Systems",
                "duration": "15 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Badge Design Best Practices",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Create Your Badge System",
              "points": 25
            },
            {
              "type": "video",
              "title": "Leaderboard Management",
              "duration": "18 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Leaderboard Management",
                "duration": "18 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "template",
              "title": "Leaderboard Template",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 2 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-blue-600 via-indigo-600 to-purple-600",
              "heroSubtitleClass": "text-blue-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": true,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-blue-600",
              "engagementSidebarActive": "bg-blue-50 border-2 border-blue-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-blue-100 text-blue-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-blue-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-blue-600 hover:bg-blue-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "points-badges-leaderboards-lesson-1",
                "type": "video",
                "title": "Designing Effective Point Systems",
                "duration": "15 min",
                "points": 20,
                "content": {
                  "description": "Master the most popular gamification elements and learn when and how to use them effectively in your classroom.",
                  "keyPoints": [
                    "Design effective point systems that reflect learning",
                    "Create meaningful badge systems with clear criteria",
                    "Implement leaderboards that motivate without demotivating",
                    "Balance competition with collaboration",
                    "Avoid common gamification pitfalls"
                  ],
                  "transcript": "Master the most popular gamification elements and learn when and how to use them effectively in your classroom. Implement a points and badge system in your next unit and measure student engagement."
                }
              },
              {
                "id": "points-badges-leaderboards-lesson-2",
                "type": "reading",
                "title": "Badge Design Best Practices",
                "points": 15,
                "content": {
                  "article": "# Points, Badges & Leaderboards\n\n## Overview\n\nMaster the most popular gamification elements and learn when and how to use them effectively in your classroom.\n\n## Skills In Focus\n\n1. Point systems\n2. Badge design\n3. Leaderboard management\n4. Fair competition\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design effective point systems that reflect learning",
                    "Create meaningful badge systems with clear criteria",
                    "Implement leaderboards that motivate without demotivating",
                    "Balance competition with collaboration",
                    "Avoid common gamification pitfalls"
                  ]
                }
              },
              {
                "id": "points-badges-leaderboards-lesson-3",
                "type": "interactive",
                "title": "Create Your Badge System",
                "points": 25,
                "content": {
                  "description": "Design a complete points, badges, and leaderboard system for your classroom",
                  "steps": [
                    "Design effective point systems that reflect learning",
                    "Create meaningful badge systems with clear criteria",
                    "Implement leaderboards that motivate without demotivating",
                    "Balance competition with collaboration",
                    "Avoid common gamification pitfalls"
                  ]
                }
              },
              {
                "id": "points-badges-leaderboards-lesson-4",
                "type": "video",
                "title": "Leaderboard Management",
                "duration": "18 min",
                "points": 20,
                "content": {
                  "description": "Master the most popular gamification elements and learn when and how to use them effectively in your classroom.",
                  "keyPoints": [
                    "Design effective point systems that reflect learning",
                    "Create meaningful badge systems with clear criteria",
                    "Implement leaderboards that motivate without demotivating",
                    "Balance competition with collaboration",
                    "Avoid common gamification pitfalls"
                  ],
                  "transcript": "Master the most popular gamification elements and learn when and how to use them effectively in your classroom. Implement a points and badge system in your next unit and measure student engagement."
                }
              },
              {
                "id": "points-badges-leaderboards-lesson-5",
                "type": "template",
                "title": "Leaderboard Template",
                "points": 20,
                "content": {
                  "description": "Implement a points and badge system in your next unit and measure student engagement.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "inquiry-hooks",
          "slug": "inquiry-learning-hooks",
          "title": "Inquiry-Based Learning Hooks",
          "description": "Discover powerful strategies to spark curiosity and launch inquiry-based learning experiences that captivate students.",
          "duration": "50 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "eng-question-design",
            "eng-curiosity-triggers",
            "eng-problem-based-learning",
            "eng-student-driven-inquiry"
          ],
          "learningOutcomes": [
            "Design compelling hooks that spark curiosity",
            "Create phenomenon-based learning experiences",
            "Craft effective inquiry questions",
            "Launch student-driven investigations",
            "Use hooks to drive meaningful inquiry"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Create and implement an inquiry-based lesson with a compelling hook",
            "points": 100
          },
          "realWorldApplication": "Design and launch an inquiry-based unit using a compelling hook to engage your students.",
          "content": [
            {
              "type": "video",
              "title": "The Art of the Hook",
              "duration": "18 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "The Art of the Hook",
                "duration": "18 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Types of Inquiry Hooks",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Hook Generator Tool",
              "points": 25
            },
            {
              "type": "reading",
              "title": "Designing Inquiry Questions",
              "points": 15
            },
            {
              "type": "template",
              "title": "Inquiry Lesson Framework",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 3 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-green-600 via-emerald-600 to-teal-600",
              "heroSubtitleClass": "text-green-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-green-600",
              "engagementSidebarActive": "bg-green-50 border-2 border-green-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-green-100 text-green-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-green-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-green-600 hover:bg-green-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "inquiry-hooks-lesson-1",
                "type": "video",
                "title": "The Art of the Hook",
                "duration": "18 min",
                "points": 20,
                "content": {
                  "description": "Discover powerful strategies to spark curiosity and launch inquiry-based learning experiences that captivate students.",
                  "keyPoints": [
                    "Design compelling hooks that spark curiosity",
                    "Create phenomenon-based learning experiences",
                    "Craft effective inquiry questions",
                    "Launch student-driven investigations",
                    "Use hooks to drive meaningful inquiry"
                  ],
                  "transcript": "Discover powerful strategies to spark curiosity and launch inquiry-based learning experiences that captivate students. Design and launch an inquiry-based unit using a compelling hook to engage your students."
                }
              },
              {
                "id": "inquiry-hooks-lesson-2",
                "type": "reading",
                "title": "Types of Inquiry Hooks",
                "points": 15,
                "content": {
                  "article": "# Inquiry-Based Learning Hooks\n\n## Overview\n\nDiscover powerful strategies to spark curiosity and launch inquiry-based learning experiences that captivate students.\n\n## Skills In Focus\n\n1. Question design\n2. Curiosity triggers\n3. Problem-based learning\n4. Student-driven inquiry\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design compelling hooks that spark curiosity",
                    "Create phenomenon-based learning experiences",
                    "Craft effective inquiry questions",
                    "Launch student-driven investigations",
                    "Use hooks to drive meaningful inquiry"
                  ]
                }
              },
              {
                "id": "inquiry-hooks-lesson-3",
                "type": "interactive",
                "title": "Hook Generator Tool",
                "points": 25,
                "content": {
                  "description": "Create and implement an inquiry-based lesson with a compelling hook",
                  "steps": [
                    "Design compelling hooks that spark curiosity",
                    "Create phenomenon-based learning experiences",
                    "Craft effective inquiry questions",
                    "Launch student-driven investigations",
                    "Use hooks to drive meaningful inquiry"
                  ]
                }
              },
              {
                "id": "inquiry-hooks-lesson-4",
                "type": "reading",
                "title": "Designing Inquiry Questions",
                "points": 15,
                "content": {
                  "article": "# Inquiry-Based Learning Hooks\n\n## Overview\n\nDiscover powerful strategies to spark curiosity and launch inquiry-based learning experiences that captivate students.\n\n## Skills In Focus\n\n1. Question design\n2. Curiosity triggers\n3. Problem-based learning\n4. Student-driven inquiry\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design compelling hooks that spark curiosity",
                    "Create phenomenon-based learning experiences",
                    "Craft effective inquiry questions",
                    "Launch student-driven investigations",
                    "Use hooks to drive meaningful inquiry"
                  ]
                }
              },
              {
                "id": "inquiry-hooks-lesson-5",
                "type": "template",
                "title": "Inquiry Lesson Framework",
                "points": 20,
                "content": {
                  "description": "Design and launch an inquiry-based unit using a compelling hook to engage your students.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "quest-based-learning",
          "slug": "quest-based-learning",
          "title": "Quest-Based Learning Design",
          "description": "Transform your curriculum into engaging quests and missions that guide students through meaningful learning journeys.",
          "duration": "75 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "eng-quest-design",
            "eng-narrative-structure",
            "eng-choice-agency",
            "eng-progressive-challenges"
          ],
          "learningOutcomes": [
            "Design compelling quest narratives",
            "Create progressive challenges that build skills",
            "Provide meaningful student choice and agency",
            "Structure curriculum as engaging quests",
            "Implement quest-based learning in your classroom"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design a complete quest-based learning unit with narrative, challenges, and student choice",
            "points": 100
          },
          "realWorldApplication": "Transform one of your existing units into a quest-based learning experience.",
          "content": [
            {
              "type": "video",
              "title": "Building Learning Quests",
              "duration": "20 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Building Learning Quests",
                "duration": "20 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Storytelling in Education",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Quest Builder Tool",
              "points": 30
            },
            {
              "type": "reading",
              "title": "Choice and Agency in Quests",
              "points": 15
            },
            {
              "type": "template",
              "title": "Quest Template Library",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 4 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-purple-600 via-pink-600 to-red-600",
              "heroSubtitleClass": "text-purple-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-purple-600",
              "engagementSidebarActive": "bg-purple-50 border-2 border-purple-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-purple-100 text-purple-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-purple-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-purple-600 hover:bg-purple-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "quest-based-learning-lesson-1",
                "type": "video",
                "title": "Building Learning Quests",
                "duration": "20 min",
                "points": 20,
                "content": {
                  "description": "Transform your curriculum into engaging quests and missions that guide students through meaningful learning journeys.",
                  "keyPoints": [
                    "Design compelling quest narratives",
                    "Create progressive challenges that build skills",
                    "Provide meaningful student choice and agency",
                    "Structure curriculum as engaging quests",
                    "Implement quest-based learning in your classroom"
                  ],
                  "transcript": "Transform your curriculum into engaging quests and missions that guide students through meaningful learning journeys. Transform one of your existing units into a quest-based learning experience."
                }
              },
              {
                "id": "quest-based-learning-lesson-2",
                "type": "reading",
                "title": "Storytelling in Education",
                "points": 15,
                "content": {
                  "article": "# Quest-Based Learning Design\n\n## Overview\n\nTransform your curriculum into engaging quests and missions that guide students through meaningful learning journeys.\n\n## Skills In Focus\n\n1. Quest design\n2. Narrative structure\n3. Choice and agency\n4. Progressive challenges\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design compelling quest narratives",
                    "Create progressive challenges that build skills",
                    "Provide meaningful student choice and agency",
                    "Structure curriculum as engaging quests",
                    "Implement quest-based learning in your classroom"
                  ]
                }
              },
              {
                "id": "quest-based-learning-lesson-3",
                "type": "interactive",
                "title": "Quest Builder Tool",
                "points": 30,
                "content": {
                  "description": "Design a complete quest-based learning unit with narrative, challenges, and student choice",
                  "steps": [
                    "Design compelling quest narratives",
                    "Create progressive challenges that build skills",
                    "Provide meaningful student choice and agency",
                    "Structure curriculum as engaging quests",
                    "Implement quest-based learning in your classroom"
                  ]
                }
              },
              {
                "id": "quest-based-learning-lesson-4",
                "type": "reading",
                "title": "Choice and Agency in Quests",
                "points": 15,
                "content": {
                  "article": "# Quest-Based Learning Design\n\n## Overview\n\nTransform your curriculum into engaging quests and missions that guide students through meaningful learning journeys.\n\n## Skills In Focus\n\n1. Quest design\n2. Narrative structure\n3. Choice and agency\n4. Progressive challenges\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design compelling quest narratives",
                    "Create progressive challenges that build skills",
                    "Provide meaningful student choice and agency",
                    "Structure curriculum as engaging quests",
                    "Implement quest-based learning in your classroom"
                  ]
                }
              },
              {
                "id": "quest-based-learning-lesson-5",
                "type": "template",
                "title": "Quest Template Library",
                "points": 20,
                "content": {
                  "description": "Transform one of your existing units into a quest-based learning experience.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "collaborative-games",
          "slug": "collaborative-game-mechanics",
          "title": "Collaborative Game Mechanics",
          "description": "Learn how to design games that promote teamwork, collaboration, and peer learning while maintaining engagement.",
          "duration": "55 min",
          "level": "Intermediate",
          "impact": "Medium",
          "skillIds": [
            "eng-team-dynamics",
            "eng-collaborative-challenges",
            "eng-peer-assessment",
            "eng-group-rewards"
          ],
          "learningOutcomes": [
            "Design games that require teamwork to succeed",
            "Create interdependent challenges",
            "Facilitate peer learning and collaboration",
            "Balance individual and team rewards",
            "Build collaborative classroom culture"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Design and implement a collaborative game that promotes teamwork",
            "points": 100
          },
          "realWorldApplication": "Create a collaborative game for your next group project to enhance teamwork.",
          "content": [
            {
              "type": "video",
              "title": "Cooperative Learning Games",
              "duration": "16 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Cooperative Learning Games",
                "duration": "16 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Social Learning Theory in Practice",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Team Challenge Designer",
              "points": 25
            },
            {
              "type": "template",
              "title": "Collaborative Game Templates",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 5 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-cyan-600 via-blue-600 to-indigo-600",
              "heroSubtitleClass": "text-cyan-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-cyan-600",
              "engagementSidebarActive": "bg-cyan-50 border-2 border-cyan-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-cyan-100 text-cyan-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-cyan-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-cyan-600 hover:bg-cyan-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "collaborative-games-lesson-1",
                "type": "video",
                "title": "Cooperative Learning Games",
                "duration": "16 min",
                "points": 20,
                "content": {
                  "description": "Learn how to design games that promote teamwork, collaboration, and peer learning while maintaining engagement.",
                  "keyPoints": [
                    "Design games that require teamwork to succeed",
                    "Create interdependent challenges",
                    "Facilitate peer learning and collaboration",
                    "Balance individual and team rewards",
                    "Build collaborative classroom culture"
                  ],
                  "transcript": "Learn how to design games that promote teamwork, collaboration, and peer learning while maintaining engagement. Create a collaborative game for your next group project to enhance teamwork."
                }
              },
              {
                "id": "collaborative-games-lesson-2",
                "type": "reading",
                "title": "Social Learning Theory in Practice",
                "points": 15,
                "content": {
                  "article": "# Collaborative Game Mechanics\n\n## Overview\n\nLearn how to design games that promote teamwork, collaboration, and peer learning while maintaining engagement.\n\n## Skills In Focus\n\n1. Team dynamics\n2. Collaborative challenges\n3. Peer assessment\n4. Group rewards\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design games that require teamwork to succeed",
                    "Create interdependent challenges",
                    "Facilitate peer learning and collaboration",
                    "Balance individual and team rewards",
                    "Build collaborative classroom culture"
                  ]
                }
              },
              {
                "id": "collaborative-games-lesson-3",
                "type": "interactive",
                "title": "Team Challenge Designer",
                "points": 25,
                "content": {
                  "description": "Design and implement a collaborative game that promotes teamwork",
                  "steps": [
                    "Design games that require teamwork to succeed",
                    "Create interdependent challenges",
                    "Facilitate peer learning and collaboration",
                    "Balance individual and team rewards",
                    "Build collaborative classroom culture"
                  ]
                }
              },
              {
                "id": "collaborative-games-lesson-4",
                "type": "template",
                "title": "Collaborative Game Templates",
                "points": 20,
                "content": {
                  "description": "Create a collaborative game for your next group project to enhance teamwork.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "adaptive-gamification",
          "slug": "adaptive-gamification",
          "title": "Adaptive Gamification Systems",
          "description": "Create personalized gamification experiences that adapt to individual student needs and learning styles.",
          "duration": "90 min",
          "level": "Advanced",
          "impact": "High",
          "skillIds": [
            "eng-personalization",
            "eng-adaptive-systems",
            "eng-data-driven-design",
            "eng-individual-pathways"
          ],
          "learningOutcomes": [
            "Understand adaptive learning principles",
            "Design personalized gamification experiences",
            "Use data to inform personalization",
            "Create individual learning pathways",
            "Implement adaptive systems in your classroom"
          ],
          "assessment": {
            "type": "Project + Reflection",
            "description": "Design an adaptive gamification system and reflect on its implementation",
            "points": 100
          },
          "realWorldApplication": "Create a personalized gamification system that adapts to individual student progress.",
          "content": [
            {
              "type": "video",
              "title": "AI-Powered Gamification",
              "duration": "25 min",
              "points": 30,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "AI-Powered Gamification",
                "duration": "25 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Adaptive Learning Research",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Adaptive System Builder",
              "points": 35
            },
            {
              "type": "template",
              "title": "Personalization Framework",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 6 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-violet-600 via-purple-600 to-fuchsia-600",
              "heroSubtitleClass": "text-violet-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-violet-600",
              "engagementSidebarActive": "bg-violet-50 border-2 border-violet-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-violet-100 text-violet-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-violet-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-violet-600 hover:bg-violet-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "adaptive-gamification-lesson-1",
                "type": "video",
                "title": "AI-Powered Gamification",
                "duration": "25 min",
                "points": 30,
                "content": {
                  "description": "Create personalized gamification experiences that adapt to individual student needs and learning styles.",
                  "keyPoints": [
                    "Understand adaptive learning principles",
                    "Design personalized gamification experiences",
                    "Use data to inform personalization",
                    "Create individual learning pathways",
                    "Implement adaptive systems in your classroom"
                  ],
                  "transcript": "Create personalized gamification experiences that adapt to individual student needs and learning styles. Create a personalized gamification system that adapts to individual student progress."
                }
              },
              {
                "id": "adaptive-gamification-lesson-2",
                "type": "reading",
                "title": "Adaptive Learning Research",
                "points": 20,
                "content": {
                  "article": "# Adaptive Gamification Systems\n\n## Overview\n\nCreate personalized gamification experiences that adapt to individual student needs and learning styles.\n\n## Skills In Focus\n\n1. Personalization\n2. Adaptive systems\n3. Data-driven design\n4. Individual pathways\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Understand adaptive learning principles",
                    "Design personalized gamification experiences",
                    "Use data to inform personalization",
                    "Create individual learning pathways",
                    "Implement adaptive systems in your classroom"
                  ]
                }
              },
              {
                "id": "adaptive-gamification-lesson-3",
                "type": "interactive",
                "title": "Adaptive System Builder",
                "points": 35,
                "content": {
                  "description": "Design an adaptive gamification system and reflect on its implementation",
                  "steps": [
                    "Understand adaptive learning principles",
                    "Design personalized gamification experiences",
                    "Use data to inform personalization",
                    "Create individual learning pathways",
                    "Implement adaptive systems in your classroom"
                  ]
                }
              },
              {
                "id": "adaptive-gamification-lesson-4",
                "type": "template",
                "title": "Personalization Framework",
                "points": 25,
                "content": {
                  "description": "Create a personalized gamification system that adapts to individual student progress.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "assessment-games",
          "slug": "gamified-assessment",
          "title": "Gamified Assessment Strategies",
          "description": "Transform assessments into engaging game experiences that provide meaningful feedback and reduce test anxiety.",
          "duration": "65 min",
          "level": "Advanced",
          "impact": "High",
          "skillIds": [
            "eng-game-based-assessment",
            "eng-formative-gaming",
            "eng-feedback-loops",
            "eng-reduced-anxiety"
          ],
          "learningOutcomes": [
            "Design gamified assessments that maintain validity",
            "Create engaging formative assessment games",
            "Provide meaningful feedback through game mechanics",
            "Reduce test anxiety through gamification",
            "Balance fun with rigorous assessment"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design and validate a gamified assessment that maintains academic rigor",
            "points": 100
          },
          "realWorldApplication": "Transform one of your assessments into an engaging game experience.",
          "content": [
            {
              "type": "video",
              "title": "Assessment Through Play",
              "duration": "22 min",
              "points": 25,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Assessment Through Play",
                "duration": "22 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Validating Game-Based Assessment",
              "points": 20
            },
            {
              "type": "interactive",
              "title": "Assessment Game Designer",
              "points": 30
            },
            {
              "type": "template",
              "title": "Gamified Assessment Templates",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 7 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-rose-600 via-pink-600 to-red-600",
              "heroSubtitleClass": "text-rose-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-rose-600",
              "engagementSidebarActive": "bg-rose-50 border-2 border-rose-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-rose-100 text-rose-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-rose-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-rose-600 hover:bg-rose-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "assessment-games-lesson-1",
                "type": "video",
                "title": "Assessment Through Play",
                "duration": "22 min",
                "points": 25,
                "content": {
                  "description": "Transform assessments into engaging game experiences that provide meaningful feedback and reduce test anxiety.",
                  "keyPoints": [
                    "Design gamified assessments that maintain validity",
                    "Create engaging formative assessment games",
                    "Provide meaningful feedback through game mechanics",
                    "Reduce test anxiety through gamification",
                    "Balance fun with rigorous assessment"
                  ],
                  "transcript": "Transform assessments into engaging game experiences that provide meaningful feedback and reduce test anxiety. Transform one of your assessments into an engaging game experience."
                }
              },
              {
                "id": "assessment-games-lesson-2",
                "type": "reading",
                "title": "Validating Game-Based Assessment",
                "points": 20,
                "content": {
                  "article": "# Gamified Assessment Strategies\n\n## Overview\n\nTransform assessments into engaging game experiences that provide meaningful feedback and reduce test anxiety.\n\n## Skills In Focus\n\n1. Game-based assessment\n2. Formative gaming\n3. Feedback loops\n4. Reduced anxiety\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design gamified assessments that maintain validity",
                    "Create engaging formative assessment games",
                    "Provide meaningful feedback through game mechanics",
                    "Reduce test anxiety through gamification",
                    "Balance fun with rigorous assessment"
                  ]
                }
              },
              {
                "id": "assessment-games-lesson-3",
                "type": "interactive",
                "title": "Assessment Game Designer",
                "points": 30,
                "content": {
                  "description": "Design and validate a gamified assessment that maintains academic rigor",
                  "steps": [
                    "Design gamified assessments that maintain validity",
                    "Create engaging formative assessment games",
                    "Provide meaningful feedback through game mechanics",
                    "Reduce test anxiety through gamification",
                    "Balance fun with rigorous assessment"
                  ]
                }
              },
              {
                "id": "assessment-games-lesson-4",
                "type": "template",
                "title": "Gamified Assessment Templates",
                "points": 25,
                "content": {
                  "description": "Transform one of your assessments into an engaging game experience.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "advanced-inquiry",
          "slug": "advanced-inquiry-frameworks",
          "title": "Advanced Inquiry Frameworks",
          "description": "Master sophisticated inquiry models including PBL, design thinking, and student-led research projects.",
          "duration": "80 min",
          "level": "Advanced",
          "impact": "High",
          "skillIds": [
            "eng-project-based-learning",
            "eng-design-thinking",
            "eng-research-methods",
            "eng-student-autonomy"
          ],
          "learningOutcomes": [
            "Master project-based learning frameworks",
            "Apply design thinking to education",
            "Facilitate student-led research projects",
            "Create authentic inquiry experiences",
            "Develop student autonomy and ownership"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Design and implement a complete PBL or design thinking project",
            "points": 100
          },
          "realWorldApplication": "Launch a student-led inquiry project using PBL or design thinking frameworks.",
          "content": [
            {
              "type": "video",
              "title": "Advanced Inquiry Models",
              "duration": "28 min",
              "points": 30,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Advanced Inquiry Models",
                "duration": "28 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "PBL Research & Implementation",
              "points": 25
            },
            {
              "type": "interactive",
              "title": "PBL Planner Tool",
              "points": 35
            },
            {
              "type": "template",
              "title": "Advanced Inquiry Templates",
              "points": 30
            }
          ],
          "detail": {
            "moduleLabel": "Module 8 of 8",
            "backPathSlug": "student-engagement-techniques",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-teal-600 via-cyan-600 to-blue-600",
              "heroSubtitleClass": "text-teal-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-teal-600",
              "engagementSidebarActive": "bg-teal-50 border-2 border-teal-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-teal-100 text-teal-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-teal-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-teal-600 hover:bg-teal-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "advanced-inquiry-lesson-1",
                "type": "video",
                "title": "Advanced Inquiry Models",
                "duration": "28 min",
                "points": 30,
                "content": {
                  "description": "Master sophisticated inquiry models including PBL, design thinking, and student-led research projects.",
                  "keyPoints": [
                    "Master project-based learning frameworks",
                    "Apply design thinking to education",
                    "Facilitate student-led research projects",
                    "Create authentic inquiry experiences",
                    "Develop student autonomy and ownership"
                  ],
                  "transcript": "Master sophisticated inquiry models including PBL, design thinking, and student-led research projects. Launch a student-led inquiry project using PBL or design thinking frameworks."
                }
              },
              {
                "id": "advanced-inquiry-lesson-2",
                "type": "reading",
                "title": "PBL Research & Implementation",
                "points": 25,
                "content": {
                  "article": "# Advanced Inquiry Frameworks\n\n## Overview\n\nMaster sophisticated inquiry models including PBL, design thinking, and student-led research projects.\n\n## Skills In Focus\n\n1. Project-based learning\n2. Design thinking\n3. Research methods\n4. Student autonomy\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Master project-based learning frameworks",
                    "Apply design thinking to education",
                    "Facilitate student-led research projects",
                    "Create authentic inquiry experiences",
                    "Develop student autonomy and ownership"
                  ]
                }
              },
              {
                "id": "advanced-inquiry-lesson-3",
                "type": "interactive",
                "title": "PBL Planner Tool",
                "points": 35,
                "content": {
                  "description": "Design and implement a complete PBL or design thinking project",
                  "steps": [
                    "Master project-based learning frameworks",
                    "Apply design thinking to education",
                    "Facilitate student-led research projects",
                    "Create authentic inquiry experiences",
                    "Develop student autonomy and ownership"
                  ]
                }
              },
              {
                "id": "advanced-inquiry-lesson-4",
                "type": "template",
                "title": "Advanced Inquiry Templates",
                "points": 30,
                "content": {
                  "description": "Launch a student-led inquiry project using PBL or design thinking frameworks.",
                  "sections": [
                    "Objectives",
                    "Activity Outline",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        }
      ],
      "pathTheme": {
        "headerGradient": "from-amber-600 via-orange-600 to-red-600",
        "accentBorder": "border-amber-200",
        "accentBg": "from-amber-50 to-orange-50",
        "accentText": "text-amber-600",
        "button": "bg-amber-600 hover:bg-amber-700",
        "tipPanelBg": "from-blue-50 to-indigo-50",
        "tipPanelBorder": "border-blue-200",
        "heroDescriptionClass": "text-amber-100",
        "sparklesIconBg": "bg-blue-600",
        "guidancePersonalizedBadge": "px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold",
        "guidanceTipBoxBorder": "border-blue-200",
        "nextStepIconClass": "text-blue-600",
        "skillImpactHeaderIcon": "text-green-600",
        "skillImprovementClass": "text-green-600",
        "skillBarAfter": "bg-gradient-to-r from-green-500 to-green-600",
        "pathSidebarProgressBar": "bg-gradient-to-r from-amber-500 to-orange-500",
        "pathSkillChip": "px-2 py-1 bg-amber-50 text-amber-800 rounded text-xs font-medium border border-amber-100",
        "moduleNumberBadge": "bg-amber-100 text-amber-700",
        "moduleExpandedBorder": "border-amber-300",
        "moduleExpandedBg": "bg-amber-50",
        "moduleCollapsedHoverBorder": "hover:border-amber-200",
        "moduleExpandedInnerBorder": "border-t border-amber-200",
        "sectionHeadingIconClass": "text-amber-600",
        "moduleContentRowIconClass": "text-amber-600",
        "moduleContentPointsClass": "text-amber-700",
        "assessmentPanel": "bg-purple-50 rounded-lg p-4 border border-purple-200",
        "assessmentIconClass": "text-purple-600",
        "assessmentPointsClass": "text-purple-700",
        "markCompleteOutlineButton": "border-2 border-green-600 text-green-600 hover:bg-green-50",
        "pathOverviewImpactBadgeHigh": "px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeMedium": "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeLow": "px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
      }
    }
  },
  {
    "id": "agr-4",
    "slug": "digital-storytelling-strategies",
    "title": "Digital storytelling strategies",
    "shortDescription": "Based on your teaching style, explore narrative-based learning and multimedia storytelling techniques.",
    "duration": "3.5 hours",
    "ctaLabel": "Start Path",
    "sectionKey": "ai-growth-recommendations",
    "aiGrowthRecommendationContent": {
      "type": "path",
      "themeId": "ai-growth-digital-storytelling",
      "storageKey": "digital-storytelling-completed",
      "estimatedTime": "3.5 hours",
      "impactLevel": "High",
      "heroSubtitle": "AI-Guided Learning Path",
      "heroDescription": "Master digital storytelling techniques to create memorable and immersive classroom experiences",
      "aiGuidance": {
        "recommendation": "Start with Storytelling Fundamentals, then move into Multimedia Narrative Design",
        "reason": "Based on your lesson structure, your teaching would benefit from stronger narrative flow. Adding multimedia storytelling will make concepts more relatable and memorable for students.",
        "nextSteps": [
          "Complete Storytelling Fundamentals module",
          "Create one short story-based lesson",
          "Add one multimedia storytelling activity this week",
          "Track student engagement and retention"
        ],
        "personalizedTip": "Your learners are likely to connect with visual and character-driven content. Start with simple story arcs before adding complex multimedia layers."
      },
      "skillImpacts": [
        {
          "skillId": "impact-story-engagement",
          "before": 61,
          "after": 90,
          "improvement": 29,
          "description": "Increase in student engagement through narrative-based lessons"
        },
        {
          "skillId": "impact-story-retention",
          "before": 57,
          "after": 87,
          "improvement": 30,
          "description": "Improvement in concept retention using storytelling"
        },
        {
          "skillId": "impact-story-creativity",
          "before": 64,
          "after": 91,
          "improvement": 27,
          "description": "Growth in student creativity and expression"
        },
        {
          "skillId": "impact-story-participation",
          "before": 60,
          "after": 88,
          "improvement": 28,
          "description": "Increase in active participation during lessons"
        },
        {
          "skillId": "impact-story-confidence",
          "before": 63,
          "after": 86,
          "improvement": 23,
          "description": "Improved confidence in presenting and communicating ideas"
        }
      ],
      "pathLayout": "digital-storytelling",
      "studentEngagementExtras": {
        "achievements": [
          {
            "name": "Story Starter",
            "description": "Complete your first module",
            "rule": {
              "type": "minCompleted",
              "count": 1
            }
          },
          {
            "name": "Narrative Builder",
            "description": "Complete Storytelling Fundamentals",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "storytelling-basics"
            }
          },
          {
            "name": "Media Creator",
            "description": "Complete Multimedia Story Design",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "multimedia-story-design"
            }
          },
          {
            "name": "Creative Educator",
            "description": "Complete 5 modules",
            "rule": {
              "type": "minCompleted",
              "count": 5
            }
          },
          {
            "name": "Pathway Complete",
            "description": "Finish all modules",
            "rule": {
              "type": "allUnlockedCompleted"
            }
          }
        ],
        "bottomCta": {
          "title": "Ready to Bring Stories Into Your Classroom?",
          "subtitle": "Start your first module and begin creating engaging narrative-based lessons today",
          "primaryLabel": "Start Learning Path",
          "secondaryLabel": "Explore More Paths"
        }
      },
      "modules": [
        {
          "id": "storytelling-basics",
          "slug": "storytelling-fundamentals",
          "title": "Storytelling Fundamentals",
          "description": "Learn the foundations of storytelling and how narrative structure can improve teaching and learning outcomes.",
          "duration": "40 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "story-narrative-structure",
            "story-lesson-flow",
            "story-student-connection",
            "story-memory-hooks"
          ],
          "learningOutcomes": [
            "Understand core storytelling principles",
            "Apply narrative structure to lesson planning",
            "Use characters, conflict, and resolution in teaching",
            "Create emotionally engaging learning moments",
            "Improve recall through story-based delivery"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Create a lesson plan that uses a complete storytelling arc",
            "points": 100
          },
          "realWorldApplication": "Convert one of your current lessons into a story-driven learning experience.",
          "content": [
            {
              "type": "video",
              "title": "Introduction to Storytelling in Education",
              "duration": "10 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Introduction to Storytelling in Education",
                "duration": "10 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Why Stories Improve Learning",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Story Arc Builder",
              "points": 25
            },
            {
              "type": "template",
              "title": "Story-Based Lesson Template",
              "points": 15
            },
            {
              "type": "project",
              "title": "Design a Story-Driven Lesson",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 1 of 8",
            "backPathSlug": "digital-storytelling-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-indigo-600 via-purple-600 to-pink-600",
              "heroSubtitleClass": "text-indigo-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": true,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-indigo-600",
              "engagementSidebarActive": "bg-indigo-50 border-2 border-indigo-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-indigo-100 text-indigo-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-indigo-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl p-6 border border-indigo-200",
              "interactiveStepNumber": "bg-indigo-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-indigo-100 text-indigo-700",
              "templateDownloadCard": "p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100",
              "templateDownloadIcon": "text-indigo-600",
              "markCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-indigo-600 hover:bg-indigo-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "storytelling-basics-lesson-1",
                "type": "video",
                "title": "Introduction to Storytelling in Education",
                "duration": "10 min",
                "points": 20,
                "content": {
                  "description": "Learn the foundations of storytelling and how narrative structure can improve teaching and learning outcomes.",
                  "keyPoints": [
                    "Understand core storytelling principles",
                    "Apply narrative structure to lesson planning",
                    "Use characters, conflict, and resolution in teaching",
                    "Create emotionally engaging learning moments",
                    "Improve recall through story-based delivery"
                  ],
                  "transcript": "Learn the foundations of storytelling and how narrative structure can improve teaching and learning outcomes. Convert one of your current lessons into a story-driven learning experience."
                }
              },
              {
                "id": "storytelling-basics-lesson-2",
                "type": "reading",
                "title": "Why Stories Improve Learning",
                "points": 15,
                "content": {
                  "article": "# Storytelling Fundamentals\n\n## Overview\n\nLearn the foundations of storytelling and how narrative structure can improve teaching and learning outcomes.\n\n## Skills In Focus\n\n1. Narrative structure\n2. Lesson flow\n3. Student connection\n4. Memory hooks\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Understand core storytelling principles",
                    "Apply narrative structure to lesson planning",
                    "Use characters, conflict, and resolution in teaching",
                    "Create emotionally engaging learning moments",
                    "Improve recall through story-based delivery"
                  ]
                }
              },
              {
                "id": "storytelling-basics-lesson-3",
                "type": "interactive",
                "title": "Story Arc Builder",
                "points": 25,
                "content": {
                  "description": "Create a lesson plan that uses a complete storytelling arc",
                  "steps": [
                    "Set the context",
                    "Introduce a challenge or problem",
                    "Build curiosity and tension",
                    "Guide students toward resolution",
                    "Reflect on the lesson outcome"
                  ]
                }
              },
              {
                "id": "storytelling-basics-lesson-4",
                "type": "template",
                "title": "Story-Based Lesson Template",
                "points": 15,
                "content": {
                  "description": "Use a ready-made template to convert lessons into narrative-driven experiences.",
                  "sections": [
                    "Objectives",
                    "Story Setup",
                    "Challenge or Conflict",
                    "Learning Activities",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              },
              {
                "id": "storytelling-basics-lesson-5",
                "type": "interactive",
                "title": "Design a Story-Driven Lesson",
                "points": 25,
                "content": {
                  "description": "Design a complete narrative-based lesson plan for your classroom",
                  "steps": [
                    "Choose your topic",
                    "Define the learner role",
                    "Create a compelling challenge",
                    "Add progression and resolution",
                    "Plan reflection and assessment"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "multimedia-story-design",
          "slug": "multimedia-story-design",
          "title": "Multimedia Story Design",
          "description": "Learn how to combine visuals, audio, text, and interaction to create powerful digital storytelling experiences.",
          "duration": "55 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "story-visual-design",
            "story-audio-integration",
            "story-media-balance",
            "story-digital-expression"
          ],
          "learningOutcomes": [
            "Use visuals to strengthen narrative understanding",
            "Add audio and multimedia purposefully",
            "Balance text, image, and interaction",
            "Design multimedia stories for classroom use",
            "Avoid cognitive overload in digital storytelling"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Create a short multimedia classroom story with visuals and audio support",
            "points": 100
          },
          "realWorldApplication": "Create one multimedia story resource for your next lesson or unit.",
          "content": [
            {
              "type": "video",
              "title": "Designing Multimedia Stories",
              "duration": "14 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Designing Multimedia Stories",
                "duration": "14 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Visual Storytelling Best Practices",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Storyboard Creator",
              "points": 25
            },
            {
              "type": "template",
              "title": "Multimedia Storyboard Template",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 2 of 8",
            "backPathSlug": "digital-storytelling-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-fuchsia-600 via-purple-600 to-indigo-600",
              "heroSubtitleClass": "text-fuchsia-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": true,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-fuchsia-600",
              "engagementSidebarActive": "bg-fuchsia-50 border-2 border-fuchsia-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-fuchsia-100 text-fuchsia-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-fuchsia-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-fuchsia-50 to-indigo-50 rounded-xl p-6 border border-fuchsia-200",
              "interactiveStepNumber": "bg-fuchsia-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-fuchsia-100 text-fuchsia-700",
              "templateDownloadCard": "p-4 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-lg hover:bg-fuchsia-100",
              "templateDownloadIcon": "text-fuchsia-600",
              "markCompleteButton": "bg-fuchsia-600 hover:bg-fuchsia-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-fuchsia-600 hover:bg-fuchsia-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "multimedia-story-design-lesson-1",
                "type": "video",
                "title": "Designing Multimedia Stories",
                "duration": "14 min",
                "points": 20,
                "content": {
                  "description": "Learn how to combine visuals, audio, text, and interaction to create powerful digital storytelling experiences.",
                  "keyPoints": [
                    "Use visuals to strengthen narrative understanding",
                    "Add audio and multimedia purposefully",
                    "Balance text, image, and interaction",
                    "Design multimedia stories for classroom use",
                    "Avoid cognitive overload in digital storytelling"
                  ],
                  "transcript": "Learn how to combine visuals, audio, text, and interaction to create powerful digital storytelling experiences. Create one multimedia story resource for your next lesson or unit."
                }
              },
              {
                "id": "multimedia-story-design-lesson-2",
                "type": "reading",
                "title": "Visual Storytelling Best Practices",
                "points": 15,
                "content": {
                  "article": "# Multimedia Story Design\n\n## Overview\n\nLearn how to combine visuals, audio, text, and interaction to create powerful digital storytelling experiences.\n\n## Skills In Focus\n\n1. Visual design\n2. Audio integration\n3. Media balance\n4. Digital expression\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Use visuals to strengthen narrative understanding",
                    "Add audio and multimedia purposefully",
                    "Balance text, image, and interaction",
                    "Design multimedia stories for classroom use",
                    "Avoid cognitive overload in digital storytelling"
                  ]
                }
              },
              {
                "id": "multimedia-story-design-lesson-3",
                "type": "interactive",
                "title": "Storyboard Creator",
                "points": 25,
                "content": {
                  "description": "Plan a complete multimedia story for classroom use",
                  "steps": [
                    "Define the story objective",
                    "Select visuals and media assets",
                    "Map scene-by-scene flow",
                    "Add sound or narration",
                    "Review learner clarity and pacing"
                  ]
                }
              },
              {
                "id": "multimedia-story-design-lesson-4",
                "type": "template",
                "title": "Multimedia Storyboard Template",
                "points": 20,
                "content": {
                  "description": "Use this template to draft a classroom-friendly digital story.",
                  "sections": [
                    "Objectives",
                    "Scene Sequence",
                    "Visual Elements",
                    "Narration / Audio",
                    "Student Interaction",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "student-story-creation",
          "slug": "student-story-creation",
          "title": "Student Story Creation",
          "description": "Help students become creators by designing storytelling tasks that promote voice, creativity, and deeper understanding.",
          "duration": "50 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "story-student-voice",
            "story-creative-expression",
            "story-project-design",
            "story-peer-sharing"
          ],
          "learningOutcomes": [
            "Design student storytelling projects",
            "Encourage creativity with clear structure",
            "Support voice and personal expression",
            "Use story creation for assessment and reflection",
            "Facilitate peer sharing and feedback"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design a student-led storytelling assignment with rubric and reflection",
            "points": 100
          },
          "realWorldApplication": "Launch a student storytelling task in your next unit.",
          "content": [
            {
              "type": "video",
              "title": "Designing Student Story Projects",
              "duration": "16 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "",
                "provider": "internal",
                "title": "Designing Student Story Projects",
                "duration": "16 min",
                "controls": true,
                "metadata": {
                  "placeholder": true
                }
              }
            },
            {
              "type": "reading",
              "title": "Creative Expression in Learning",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Student Story Assignment Builder",
              "points": 25
            },
            {
              "type": "template",
              "title": "Story Project Rubric Template",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 3 of 8",
            "backPathSlug": "digital-storytelling-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-pink-600 via-rose-600 to-purple-600",
              "heroSubtitleClass": "text-pink-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-pink-600",
              "engagementSidebarActive": "bg-pink-50 border-2 border-pink-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-pink-100 text-pink-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-pink-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200",
              "interactiveStepNumber": "bg-pink-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-pink-100 text-pink-700",
              "templateDownloadCard": "p-4 bg-pink-50 border-2 border-pink-200 rounded-lg hover:bg-pink-100",
              "templateDownloadIcon": "text-pink-600",
              "markCompleteButton": "bg-pink-600 hover:bg-pink-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-pink-600 hover:bg-pink-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "student-story-creation-lesson-1",
                "type": "video",
                "title": "Designing Student Story Projects",
                "duration": "16 min",
                "points": 20,
                "content": {
                  "description": "Help students become creators by designing storytelling tasks that promote voice, creativity, and deeper understanding.",
                  "keyPoints": [
                    "Design student storytelling projects",
                    "Encourage creativity with clear structure",
                    "Support voice and personal expression",
                    "Use story creation for assessment and reflection",
                    "Facilitate peer sharing and feedback"
                  ],
                  "transcript": "Help students become creators by designing storytelling tasks that promote voice, creativity, and deeper understanding. Launch a student storytelling task in your next unit."
                }
              },
              {
                "id": "student-story-creation-lesson-2",
                "type": "reading",
                "title": "Creative Expression in Learning",
                "points": 15,
                "content": {
                  "article": "# Student Story Creation\n\n## Overview\n\nHelp students become creators by designing storytelling tasks that promote voice, creativity, and deeper understanding.\n\n## Skills In Focus\n\n1. Student voice\n2. Creative expression\n3. Project design\n4. Peer sharing\n\n## Classroom Application\n\nUse these strategies in your next lesson cycle and document what changed in student outcomes.",
                  "keyTakeaways": [
                    "Design student storytelling projects",
                    "Encourage creativity with clear structure",
                    "Support voice and personal expression",
                    "Use story creation for assessment and reflection",
                    "Facilitate peer sharing and feedback"
                  ]
                }
              },
              {
                "id": "student-story-creation-lesson-3",
                "type": "interactive",
                "title": "Student Story Assignment Builder",
                "points": 25,
                "content": {
                  "description": "Build a complete storytelling assignment for students",
                  "steps": [
                    "Select a learning objective",
                    "Choose the story format",
                    "Define student choices",
                    "Set feedback checkpoints",
                    "Add presentation or sharing elements"
                  ]
                }
              },
              {
                "id": "student-story-creation-lesson-4",
                "type": "template",
                "title": "Story Project Rubric Template",
                "points": 20,
                "content": {
                  "description": "A ready-made rubric for evaluating student story projects.",
                  "sections": [
                    "Objectives",
                    "Creativity Criteria",
                    "Content Accuracy",
                    "Communication Quality",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        }
      ],
      "pathTheme": {
        "headerGradient": "from-indigo-600 via-purple-600 to-pink-600",
        "accentBorder": "border-indigo-200",
        "accentBg": "from-indigo-50 to-pink-50",
        "accentText": "text-indigo-600",
        "button": "bg-indigo-600 hover:bg-indigo-700",
        "tipPanelBg": "from-purple-50 to-pink-50",
        "tipPanelBorder": "border-purple-200",
        "heroDescriptionClass": "text-indigo-100",
        "sparklesIconBg": "bg-purple-600",
        "guidancePersonalizedBadge": "px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold",
        "guidanceTipBoxBorder": "border-purple-200",
        "nextStepIconClass": "text-purple-600",
        "skillImpactHeaderIcon": "text-green-600",
        "skillImprovementClass": "text-green-600",
        "skillBarAfter": "bg-gradient-to-r from-green-500 to-green-600",
        "pathSidebarProgressBar": "bg-gradient-to-r from-indigo-500 to-pink-500",
        "pathSkillChip": "px-2 py-1 bg-indigo-50 text-indigo-800 rounded text-xs font-medium border border-indigo-100",
        "moduleNumberBadge": "bg-indigo-100 text-indigo-700",
        "moduleExpandedBorder": "border-indigo-300",
        "moduleExpandedBg": "bg-indigo-50",
        "moduleCollapsedHoverBorder": "hover:border-indigo-200",
        "moduleExpandedInnerBorder": "border-t border-indigo-200",
        "sectionHeadingIconClass": "text-indigo-600",
        "moduleContentRowIconClass": "text-indigo-600",
        "moduleContentPointsClass": "text-indigo-700",
        "assessmentPanel": "bg-purple-50 rounded-lg p-4 border border-purple-200",
        "assessmentIconClass": "text-purple-600",
        "assessmentPointsClass": "text-purple-700",
        "markCompleteOutlineButton": "border-2 border-green-600 text-green-600 hover:bg-green-50",
        "pathOverviewImpactBadgeHigh": "px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeMedium": "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeLow": "px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
      }
    }
  },
  {
    "id": "agr-5",
    "slug": "collaborative-learning-strategies",
    "title": "Collaborative learning strategies",
    "shortDescription": "Strengthen peer learning, teamwork, and productive group work through structured collaboration.",
    "duration": "4.5 hours",
    "ctaLabel": "Start Path",
    "sectionKey": "ai-growth-recommendations",
    "aiGrowthRecommendationContent": {
      "type": "path",
      "themeId": "ai-growth-collaborative-learning",
      "storageKey": "collaborative-learning-completed",
      "estimatedTime": "4.5 hours",
      "impactLevel": "High",
      "heroSubtitle": "AI-Guided Learning Path",
      "heroDescription": "Build classroom systems that turn group work into meaningful collaboration and deeper learning",
      "aiGuidance": {
        "recommendation": "Begin with Team Dynamics Fundamentals, then move into Structured Collaboration Models and Peer Feedback routines",
        "reason": "Your current classroom flow appears teacher-directed. Adding structured collaboration can increase participation, accountability, and student-to-student explanation.",
        "nextSteps": [
          "Complete Team Dynamics Fundamentals",
          "Assign clear roles in one group task this week",
          "Introduce one peer-feedback protocol",
          "Track how collaboration affects participation and understanding"
        ],
        "personalizedTip": "Your learners will likely benefit from visible group roles and simple discussion stems before moving into open-ended collaboration."
      },
      "skillImpacts": [
        {
          "skillId": "impact-collab-participation",
          "before": 61,
          "after": 89,
          "improvement": 28,
          "description": "Increase in student participation during collaborative tasks"
        },
        {
          "skillId": "impact-collab-discussion",
          "before": 56,
          "after": 87,
          "improvement": 31,
          "description": "Improvement in discussion quality and peer-to-peer dialogue"
        },
        {
          "skillId": "impact-collab-accountability",
          "before": 59,
          "after": 85,
          "improvement": 26,
          "description": "Stronger accountability in group work and shared responsibilities"
        },
        {
          "skillId": "impact-collab-confidence",
          "before": 63,
          "after": 86,
          "improvement": 23,
          "description": "Growth in confidence when sharing ideas with peers"
        },
        {
          "skillId": "impact-collab-problem-solving",
          "before": 60,
          "after": 88,
          "improvement": 28,
          "description": "Better collaborative problem-solving and collective reasoning"
        }
      ],
      "pathLayout": "collaborative-learning",
      "studentEngagementExtras": {
        "achievements": [
          {
            "name": "Team Starter",
            "description": "Complete your first module",
            "rule": {
              "type": "minCompleted",
              "count": 1
            }
          },
          {
            "name": "Group Builder",
            "description": "Complete Team Dynamics Fundamentals",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "team-dynamics-fundamentals"
            }
          },
          {
            "name": "Discussion Designer",
            "description": "Complete Structured Collaboration Models",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "structured-collaboration-models"
            }
          },
          {
            "name": "Feedback Coach",
            "description": "Complete Peer Feedback & Reflection",
            "rule": {
              "type": "moduleCompleted",
              "moduleId": "peer-feedback-reflection"
            }
          },
          {
            "name": "Collaboration Champion",
            "description": "Complete 5 modules",
            "rule": {
              "type": "minCompleted",
              "count": 5
            }
          },
          {
            "name": "Pathway Complete",
            "description": "Finish all modules",
            "rule": {
              "type": "allUnlockedCompleted"
            }
          }
        ],
        "bottomCta": {
          "title": "Ready to Improve Group Learning?",
          "subtitle": "Start your first module and build collaboration routines your students can use right away",
          "primaryLabel": "Start Learning Path",
          "secondaryLabel": "Explore More Paths"
        }
      },
      "modules": [
        {
          "id": "team-dynamics-fundamentals",
          "slug": "team-dynamics-fundamentals",
          "title": "Team Dynamics Fundamentals",
          "description": "Understand what makes student teams succeed and how to build a collaborative classroom culture.",
          "duration": "50 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "collab-team-roles",
            "collab-group-norms",
            "collab-classroom-culture",
            "collab-shared-responsibility"
          ],
          "learningOutcomes": [
            "Understand the core principles of effective student collaboration",
            "Create clear team roles and responsibilities",
            "Build classroom norms that support collaboration",
            "Reduce common group work issues before they start",
            "Support balanced student participation"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design a collaborative task with group roles, norms, and accountability structures",
            "points": 100
          },
          "realWorldApplication": "Introduce a structured group task in your next lesson using defined roles and norms.",
          "content": [
            {
              "type": "video",
              "title": "Introduction to Team Dynamics",
              "duration": "12 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.youtube.com/watch?v=6fL09e8Tm9c",
                "provider": "youtube",
                "title": "Introduction to Team Dynamics",
                "duration": "12 min",
                "controls": true,
                "metadata": {
                  "placeholder": false
                }
              }
            },
            {
              "type": "reading",
              "title": "Why Group Work Fails Without Structure",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Design Group Roles",
              "points": 25
            },
            {
              "type": "template",
              "title": "Collaborative Task Planning Template",
              "points": 15
            },
            {
              "type": "project",
              "title": "Build a Team-Based Activity",
              "points": 25
            }
          ],
          "detail": {
            "moduleLabel": "Module 1 of 5",
            "backPathSlug": "collaborative-learning-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-emerald-600 via-green-600 to-lime-600",
              "heroSubtitleClass": "text-emerald-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": true,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-emerald-600",
              "engagementSidebarActive": "bg-emerald-50 border-2 border-emerald-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-emerald-100 text-emerald-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-emerald-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-emerald-50 to-lime-50 rounded-xl p-6 border border-emerald-200",
              "interactiveStepNumber": "bg-emerald-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-emerald-100 text-emerald-700",
              "templateDownloadCard": "p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg hover:bg-emerald-100",
              "templateDownloadIcon": "text-emerald-600",
              "markCompleteButton": "bg-emerald-600 hover:bg-emerald-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-emerald-600 hover:bg-emerald-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "team-dynamics-fundamentals-lesson-1",
                "type": "video",
                "title": "Introduction to Team Dynamics",
                "duration": "12 min",
                "points": 20,
                "content": {
                  "description": "Explore the foundations of effective student collaboration and group structure.",
                  "keyPoints": [
                    "Collaboration improves when roles are visible",
                    "Norms should be taught, not assumed",
                    "Group work requires accountability structures",
                    "Balanced participation is a design choice",
                    "Students need support for productive interaction"
                  ],
                  "transcript": "Effective collaboration begins with clear roles, clear expectations, and routines that help students contribute meaningfully to group tasks."
                }
              },
              {
                "id": "team-dynamics-fundamentals-lesson-2",
                "type": "reading",
                "title": "Why Group Work Fails Without Structure",
                "points": 15,
                "content": {
                  "article": "# Team Dynamics Fundamentals\n\n## Overview\n\nStrong collaboration does not happen by chance. Students need roles, routines, and shared expectations.\n\n## Skills In Focus\n\n1. Team roles\n2. Group norms\n3. Shared responsibility\n4. Collaborative culture\n\n## Classroom Application\n\nUse these ideas to redesign one group task so every student contributes clearly and consistently.",
                  "keyTakeaways": [
                    "Unstructured group work often leads to unequal participation",
                    "Visible expectations improve accountability",
                    "Roles help students contribute with confidence",
                    "Norms reduce conflict and confusion",
                    "Teachers should coach collaboration actively"
                  ]
                }
              },
              {
                "id": "team-dynamics-fundamentals-lesson-3",
                "type": "interactive",
                "title": "Design Group Roles",
                "points": 25,
                "content": {
                  "description": "Create a collaboration structure with clear roles and shared responsibilities.",
                  "steps": [
                    "Choose the learning goal",
                    "List the tasks students must complete together",
                    "Assign 3-4 roles linked to the task",
                    "Define what each role is responsible for",
                    "Add one accountability check for each student"
                  ]
                }
              },
              {
                "id": "team-dynamics-fundamentals-lesson-4",
                "type": "template",
                "title": "Collaborative Task Planning Template",
                "points": 15,
                "content": {
                  "description": "Use this template to plan collaborative activities with role clarity and accountability.",
                  "sections": [
                    "Objectives",
                    "Group Roles",
                    "Task Sequence",
                    "Participation Expectations",
                    "Evidence of Learning",
                    "Reflection Notes"
                  ]
                }
              },
              {
                "id": "team-dynamics-fundamentals-lesson-5",
                "type": "interactive",
                "title": "Build a Team-Based Activity",
                "points": 25,
                "content": {
                  "description": "Design a complete classroom task that requires purposeful collaboration.",
                  "steps": [
                    "Pick a topic students will work on together",
                    "Decide how success will be measured",
                    "Add defined student roles",
                    "Create a collaboration checkpoint",
                    "Plan a short debrief or reflection"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "structured-collaboration-models",
          "slug": "structured-collaboration-models",
          "title": "Structured Collaboration Models",
          "description": "Learn classroom structures that make discussion, teamwork, and peer explanation more effective.",
          "duration": "60 min",
          "level": "Beginner",
          "impact": "High",
          "skillIds": [
            "collab-discussion-structures",
            "collab-peer-explanation",
            "collab-routines",
            "collab-task-design"
          ],
          "learningOutcomes": [
            "Use simple collaboration structures effectively",
            "Match a collaboration model to a learning goal",
            "Support stronger peer explanation and discussion",
            "Build routines for productive collaboration",
            "Reduce off-task behavior during group work"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Design a lesson using one structured collaboration model and explain why it fits the objective",
            "points": 100
          },
          "realWorldApplication": "Use one structured discussion routine in your next lesson and observe student participation.",
          "content": [
            {
              "type": "video",
              "title": "Structured Collaboration in Action",
              "duration": "15 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.youtube.com/watch?v=1kI8UsiQmG0",
                "provider": "youtube",
                "title": "Structured Collaboration in Action",
                "duration": "15 min",
                "controls": true,
                "metadata": {
                  "placeholder": false
                }
              }
            },
            {
              "type": "reading",
              "title": "Matching Routines to Learning Goals",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Choose a Collaboration Model",
              "points": 25
            },
            {
              "type": "template",
              "title": "Discussion Routine Planner",
              "points": 20
            },
            {
              "type": "project",
              "title": "Plan a Collaborative Lesson Flow",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 2 of 5",
            "backPathSlug": "collaborative-learning-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-cyan-600 via-sky-600 to-blue-600",
              "heroSubtitleClass": "text-cyan-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": true,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-cyan-600",
              "engagementSidebarActive": "bg-cyan-50 border-2 border-cyan-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-cyan-100 text-cyan-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-cyan-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200",
              "interactiveStepNumber": "bg-cyan-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-cyan-100 text-cyan-700",
              "templateDownloadCard": "p-4 bg-cyan-50 border-2 border-cyan-200 rounded-lg hover:bg-cyan-100",
              "templateDownloadIcon": "text-cyan-600",
              "markCompleteButton": "bg-cyan-600 hover:bg-cyan-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-cyan-600 hover:bg-cyan-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "structured-collaboration-models-lesson-1",
                "type": "video",
                "title": "Structured Collaboration in Action",
                "duration": "15 min",
                "points": 20,
                "content": {
                  "description": "See how collaboration structures guide participation, discussion, and accountability.",
                  "keyPoints": [
                    "Simple structures create safer discussion spaces",
                    "Routines improve focus during group work",
                    "Peer explanation deepens understanding",
                    "Not every task needs the same collaboration model",
                    "Structure increases engagement and clarity"
                  ],
                  "transcript": "Effective collaboration models help students know how to participate, when to speak, and how to build on each other's ideas."
                }
              },
              {
                "id": "structured-collaboration-models-lesson-2",
                "type": "reading",
                "title": "Matching Routines to Learning Goals",
                "points": 15,
                "content": {
                  "article": "# Structured Collaboration Models\n\n## Overview\n\nDifferent tasks require different collaboration routines. Strong design improves both discussion and learning.\n\n## Skills In Focus\n\n1. Discussion structures\n2. Peer explanation\n3. Task design\n4. Participation routines\n\n## Classroom Application\n\nChoose a collaboration model that matches your objective and gives every student a way to contribute.",
                  "keyTakeaways": [
                    "Think-pair-share works well for idea generation",
                    "Jigsaw supports shared responsibility across groups",
                    "Discussion stems improve talk quality",
                    "Timing and task clarity matter",
                    "Teachers should model routines explicitly"
                  ]
                }
              },
              {
                "id": "structured-collaboration-models-lesson-3",
                "type": "interactive",
                "title": "Choose a Collaboration Model",
                "points": 25,
                "content": {
                  "description": "Match a classroom goal to the collaboration routine that best supports it.",
                  "steps": [
                    "Identify the lesson objective",
                    "Decide whether students need discussion, synthesis, or explanation",
                    "Select a routine such as think-pair-share, jigsaw, or carousel",
                    "Plan timing and directions",
                    "Add an accountability check at the end"
                  ]
                }
              },
              {
                "id": "structured-collaboration-models-lesson-4",
                "type": "template",
                "title": "Discussion Routine Planner",
                "points": 20,
                "content": {
                  "description": "Use this planning tool to build a discussion routine with purpose and structure.",
                  "sections": [
                    "Objectives",
                    "Routine Selected",
                    "Student Prompts",
                    "Timing",
                    "Accountability Check",
                    "Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "peer-feedback-reflection",
          "slug": "peer-feedback-reflection",
          "title": "Peer Feedback & Reflection",
          "description": "Teach students how to give useful feedback, reflect on contributions, and improve work through peer support.",
          "duration": "55 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "collab-peer-feedback",
            "collab-reflection",
            "collab-revision",
            "collab-metacognition"
          ],
          "learningOutcomes": [
            "Teach students how to give specific peer feedback",
            "Use reflection to improve collaboration",
            "Support revision through peer-to-peer input",
            "Build student ownership of group outcomes",
            "Connect feedback with improvement"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design a peer feedback routine with sentence stems and a reflection component",
            "points": 100
          },
          "realWorldApplication": "Add one peer feedback protocol to a classroom task this week and observe how students revise their work.",
          "content": [
            {
              "type": "video",
              "title": "Teaching Students to Give Better Feedback",
              "duration": "13 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.youtube.com/watch?v=hqh1MRWZjms",
                "provider": "youtube",
                "title": "Teaching Students to Give Better Feedback",
                "duration": "13 min",
                "controls": true,
                "metadata": {
                  "placeholder": false
                }
              }
            },
            {
              "type": "reading",
              "title": "Why Reflection Improves Collaboration",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Build Feedback Sentence Stems",
              "points": 25
            },
            {
              "type": "template",
              "title": "Peer Feedback Form",
              "points": 20
            },
            {
              "type": "project",
              "title": "Plan a Revision Routine",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 3 of 5",
            "backPathSlug": "collaborative-learning-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-violet-600 via-purple-600 to-fuchsia-600",
              "heroSubtitleClass": "text-violet-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-violet-600",
              "engagementSidebarActive": "bg-violet-50 border-2 border-violet-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-violet-100 text-violet-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-violet-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-200",
              "interactiveStepNumber": "bg-violet-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-violet-100 text-violet-700",
              "templateDownloadCard": "p-4 bg-violet-50 border-2 border-violet-200 rounded-lg hover:bg-violet-100",
              "templateDownloadIcon": "text-violet-600",
              "markCompleteButton": "bg-violet-600 hover:bg-violet-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-violet-600 hover:bg-violet-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "peer-feedback-reflection-lesson-1",
                "type": "video",
                "title": "Teaching Students to Give Better Feedback",
                "duration": "13 min",
                "points": 20,
                "content": {
                  "description": "Learn how to make peer feedback specific, respectful, and useful for revision.",
                  "keyPoints": [
                    "Students need models for effective feedback",
                    "Sentence stems improve feedback quality",
                    "Reflection helps students notice their own contribution",
                    "Peer review is stronger when linked to clear criteria",
                    "Revision should follow feedback"
                  ],
                  "transcript": "Peer feedback works best when students know what quality looks like, how to name strengths, and how to suggest next steps clearly."
                }
              },
              {
                "id": "peer-feedback-reflection-lesson-2",
                "type": "reading",
                "title": "Why Reflection Improves Collaboration",
                "points": 15,
                "content": {
                  "article": "# Peer Feedback & Reflection\n\n## Overview\n\nWhen students reflect on their work and their collaboration, they learn to improve both product and process.\n\n## Skills In Focus\n\n1. Feedback\n2. Reflection\n3. Revision\n4. Ownership\n\n## Classroom Application\n\nAdd a short reflection routine after one collaborative task so students think about how they contributed and what to improve next.",
                  "keyTakeaways": [
                    "Reflection supports self-awareness",
                    "Feedback is more useful when criteria are visible",
                    "Revision should be built into the task",
                    "Students learn collaboration by examining it",
                    "Peer input can improve both confidence and quality"
                  ]
                }
              },
              {
                "id": "peer-feedback-reflection-lesson-3",
                "type": "interactive",
                "title": "Build Feedback Sentence Stems",
                "points": 25,
                "content": {
                  "description": "Create sentence stems that guide respectful, useful peer feedback.",
                  "steps": [
                    "Choose the type of work students will review",
                    "Identify 2-3 criteria students should focus on",
                    "Write one sentence stem for strengths",
                    "Write one sentence stem for revision suggestions",
                    "Add one reflection question for the student receiving feedback"
                  ]
                }
              },
              {
                "id": "peer-feedback-reflection-lesson-4",
                "type": "template",
                "title": "Peer Feedback Form",
                "points": 20,
                "content": {
                  "description": "A ready-to-use form for peer review, revision, and self-reflection.",
                  "sections": [
                    "Objectives",
                    "What Worked Well",
                    "Suggestions for Improvement",
                    "Revision Plan",
                    "Self-Reflection Notes"
                  ]
                }
              }
            ]
          }
        },
        {
          "id": "collaborative-problem-solving",
          "slug": "collaborative-problem-solving",
          "title": "Collaborative Problem Solving",
          "description": "Design tasks where students solve meaningful problems together using reasoning, evidence, and shared decision-making.",
          "duration": "55 min",
          "level": "Intermediate",
          "impact": "High",
          "skillIds": [
            "collab-problem-solving",
            "collab-reasoning",
            "collab-decision-making",
            "collab-shared-inquiry"
          ],
          "learningOutcomes": [
            "Design collaborative problem-solving tasks",
            "Use prompts that encourage reasoning and evidence",
            "Support group decision-making without domination",
            "Encourage collective ownership of solutions",
            "Improve student persistence through collaboration"
          ],
          "assessment": {
            "type": "Project-Based",
            "description": "Design a collaborative problem-solving task with checkpoints for reasoning and shared decisions",
            "points": 100
          },
          "realWorldApplication": "Run one collaborative problem-solving challenge and observe how students explain and defend ideas together.",
          "content": [
            {
              "type": "video",
              "title": "Collaborative Problem Solving in the Classroom",
              "duration": "14 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.youtube.com/watch?v=R2DU85qLfJQ",
                "provider": "youtube",
                "title": "Collaborative Problem Solving in the Classroom",
                "duration": "14 min",
                "controls": true,
                "metadata": {
                  "placeholder": false
                }
              }
            },
            {
              "type": "reading",
              "title": "Designing Problems Worth Solving Together",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Create a Group Challenge",
              "points": 25
            },
            {
              "type": "template",
              "title": "Collaborative Inquiry Planner",
              "points": 20
            },
            {
              "type": "project",
              "title": "Design a Shared-Solution Task",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 4 of 5",
            "backPathSlug": "collaborative-learning-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-amber-600 via-orange-600 to-red-600",
              "heroSubtitleClass": "text-amber-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-amber-600",
              "engagementSidebarActive": "bg-amber-50 border-2 border-amber-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-amber-100 text-amber-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-amber-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200",
              "interactiveStepNumber": "bg-amber-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-amber-100 text-amber-700",
              "templateDownloadCard": "p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100",
              "templateDownloadIcon": "text-amber-600",
              "markCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-amber-600 hover:bg-amber-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "collaborative-problem-solving-lesson-1",
                "type": "video",
                "title": "Collaborative Problem Solving in the Classroom",
                "duration": "14 min",
                "points": 20,
                "content": {
                  "description": "Learn how to design problem-solving tasks that require discussion, evidence, and shared reasoning.",
                  "keyPoints": [
                    "Good collaborative tasks require interdependence",
                    "Students need prompts that invite reasoning",
                    "Shared decision-making should be visible",
                    "Problems should be complex enough for teamwork",
                    "Reflection helps groups improve their process"
                  ],
                  "transcript": "Collaborative problem solving works when students must reason together, weigh evidence, and build shared solutions rather than divide the work superficially."
                }
              }
            ]
          }
        },
        {
          "id": "inclusive-collaboration-practices",
          "slug": "inclusive-collaboration-practices",
          "title": "Inclusive Collaboration Practices",
          "description": "Ensure all students can access, contribute to, and benefit from collaborative learning experiences.",
          "duration": "50 min",
          "level": "Advanced",
          "impact": "Medium",
          "skillIds": [
            "collab-inclusion",
            "collab-accessibility",
            "collab-equity",
            "collab-participation-support"
          ],
          "learningOutcomes": [
            "Identify barriers that limit student participation in groups",
            "Use supports that make collaboration more inclusive",
            "Create equitable opportunities for contribution",
            "Differentiate collaborative tasks for diverse learners",
            "Build belonging and confidence in group settings"
          ],
          "assessment": {
            "type": "Portfolio",
            "description": "Redesign a collaborative task to improve access, participation, and equity",
            "points": 100
          },
          "realWorldApplication": "Review one collaborative activity and add supports that increase access for all learners.",
          "content": [
            {
              "type": "video",
              "title": "Making Collaboration More Inclusive",
              "duration": "11 min",
              "points": 20,
              "media": {
                "type": "video",
                "url": "https://www.youtube.com/watch?v=8R0pD3xM4m8",
                "provider": "youtube",
                "title": "Making Collaboration More Inclusive",
                "duration": "11 min",
                "controls": true,
                "metadata": {
                  "placeholder": false
                }
              }
            },
            {
              "type": "reading",
              "title": "Access, Equity, and Voice in Group Work",
              "points": 15
            },
            {
              "type": "interactive",
              "title": "Audit a Collaborative Task for Inclusion",
              "points": 25
            },
            {
              "type": "template",
              "title": "Inclusive Group Work Checklist",
              "points": 20
            },
            {
              "type": "project",
              "title": "Redesign for Access",
              "points": 20
            }
          ],
          "detail": {
            "moduleLabel": "Module 5 of 5",
            "backPathSlug": "collaborative-learning-strategies",
            "pageVisual": {
              "sidebarStyle": "engagement",
              "headerGradient": "from-rose-600 via-pink-600 to-fuchsia-600",
              "heroSubtitleClass": "text-rose-100",
              "heroShowEarnedPoints": true,
              "heroShowImpactRow": true,
              "heroShowBookmarkShare": false,
              "tieredSidebarActive": "",
              "tieredSidebarCompleted": "",
              "tieredSidebarIdle": "",
              "tieredSidebarCheckComplete": "text-green-600",
              "sidebarProgressFill": "bg-rose-600",
              "engagementSidebarActive": "bg-rose-50 border-2 border-rose-300",
              "engagementSidebarIdle": "border-2 border-transparent hover:bg-gray-50",
              "engagementNumCompleted": "bg-green-100 text-green-600",
              "engagementNumActive": "bg-rose-100 text-rose-600",
              "engagementNumIdle": "bg-gray-100 text-gray-400",
              "engagementTitleActive": "text-rose-900",
              "lessonTypeIconClass": "text-gray-600",
              "pointsPill": "bg-gray-100 text-gray-800",
              "videoOverlayGradient": "from-gray-900 to-gray-800",
              "videoPlayUseTranslucent": true,
              "videoPlayIconClass": "text-white",
              "showLessonHeaderShare": false,
              "keyPointsPanel": "bg-blue-50 rounded-xl p-6 border border-blue-200",
              "keyPointsCheck": "text-blue-600",
              "transcriptPanel": "bg-gray-50 rounded-xl p-6 border border-gray-200",
              "readingArticleWrap": "",
              "readingTakeawaysPanel": "bg-purple-50 rounded-xl p-6 border border-purple-200",
              "readingTakeawaysIcon": "text-purple-600",
              "interactiveStepsPanel": "bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200",
              "interactiveStepNumber": "bg-rose-600 text-white",
              "templateSectionsCard": "bg-white rounded-lg p-6 border border-gray-200",
              "templateSectionNumber": "bg-rose-100 text-rose-700",
              "templateDownloadCard": "p-4 bg-rose-50 border-2 border-rose-200 rounded-lg hover:bg-rose-100",
              "templateDownloadIcon": "text-rose-600",
              "markCompleteButton": "bg-rose-600 hover:bg-rose-700",
              "completionPanel": "border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50",
              "completionIconBg": "bg-green-600",
              "completionCta": "bg-green-600 hover:bg-green-700",
              "completedLessonBadge": "bg-green-100 text-green-700",
              "lessonNavigation": "footer-with-advance",
              "footerCompleteButton": "bg-rose-600 hover:bg-rose-700",
              "blockHeadingClass": "text-lg font-semibold text-gray-900 mb-3"
            },
            "lessons": [
              {
                "id": "inclusive-collaboration-practices-lesson-1",
                "type": "video",
                "title": "Making Collaboration More Inclusive",
                "duration": "11 min",
                "points": 20,
                "content": {
                  "description": "Learn how to make collaborative learning more accessible and equitable for all students.",
                  "keyPoints": [
                    "Not all students access collaboration in the same way",
                    "Sentence stems and visual supports improve access",
                    "Equity requires intentional design",
                    "Participation should not depend on confidence alone",
                    "Inclusive collaboration builds belonging"
                  ],
                  "transcript": "Inclusive collaboration requires teachers to reduce participation barriers, support multiple ways of contributing, and make expectations visible to all learners."
                }
              }
            ]
          }
        }
      ],
      "pathTheme": {
        "headerGradient": "from-emerald-600 via-green-600 to-cyan-600",
        "accentBorder": "border-emerald-200",
        "accentBg": "from-emerald-50 to-cyan-50",
        "accentText": "text-emerald-600",
        "button": "bg-emerald-600 hover:bg-emerald-700",
        "tipPanelBg": "from-blue-50 to-emerald-50",
        "tipPanelBorder": "border-emerald-200",
        "heroDescriptionClass": "text-emerald-100",
        "sparklesIconBg": "bg-emerald-600",
        "guidancePersonalizedBadge": "px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold",
        "guidanceTipBoxBorder": "border-emerald-200",
        "nextStepIconClass": "text-emerald-600",
        "skillImpactHeaderIcon": "text-green-600",
        "skillImprovementClass": "text-green-600",
        "skillBarAfter": "bg-gradient-to-r from-green-500 to-green-600",
        "pathSidebarProgressBar": "bg-gradient-to-r from-emerald-500 to-cyan-500",
        "pathSkillChip": "px-2 py-1 bg-emerald-50 text-emerald-800 rounded text-xs font-medium border border-emerald-100",
        "moduleNumberBadge": "bg-emerald-100 text-emerald-700",
        "moduleExpandedBorder": "border-emerald-300",
        "moduleExpandedBg": "bg-emerald-50",
        "moduleCollapsedHoverBorder": "hover:border-emerald-200",
        "moduleExpandedInnerBorder": "border-t border-emerald-200",
        "sectionHeadingIconClass": "text-emerald-600",
        "moduleContentRowIconClass": "text-emerald-600",
        "moduleContentPointsClass": "text-emerald-700",
        "assessmentPanel": "bg-purple-50 rounded-lg p-4 border border-purple-200",
        "assessmentIconClass": "text-purple-600",
        "assessmentPointsClass": "text-purple-700",
        "markCompleteOutlineButton": "border-2 border-green-600 text-green-600 hover:bg-green-50",
        "pathOverviewImpactBadgeHigh": "px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeMedium": "px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold",
        "pathOverviewImpactBadgeLow": "px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
      }
    }
  }
  
] as LearningHubSectionItem[]

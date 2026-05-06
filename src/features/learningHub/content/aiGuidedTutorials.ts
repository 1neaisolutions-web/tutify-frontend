/**
 * AI-guided tutorials — **one catalog array**: copy a full top-level object, edit card fields and `aiGuidedTutorialContent`
 * (including nested `steps` and `content.data` per step). Slugs must stay unique and match `/learning-hub/ai-guided-tutorials-demonstrations/:slug`.
 *
 * `renderProfile` resolves via `resolveAiGuidedTutorialShell` (see `aiGuidedTutorialShell.ts`): built-in shells are
 * `lesson-planner`, `assessment-best-practices`, `differentiation-case-study`; unknown strings fall back to lesson-planner.
 */
import type { LearningHubSectionItem } from '../types'

export const aiGuidedTutorialsData: LearningHubSectionItem[] = [
  {
    id: 'agt-1',
    slug: 'mastering-lesson-planner-template',
    title: 'Mastering the lesson planner template',
    subtitle: 'Step-by-step walkthrough',
    shortDescription: 'Learn how to use the AI-powered lesson planner to create comprehensive, standards-aligned lesson plans efficiently',
    duration: '12 min',
    ctaLabel: 'Watch',
    sectionKey: 'ai-guided-tutorials-demonstrations',
    aiGuidedTutorialContent: {
      type: 'tutorial',
      renderProfile: 'lesson-planner',
      description: 'Learn how to use the lesson planner effectively from prompt to polished lesson output.',
      heroSubtitle: 'Step-by-step walkthrough',
      heroDescription: 'Learn how to use the AI-powered lesson planner to create comprehensive, standards-aligned lesson plans efficiently',
      headerDurationLabel: '12 min',
      steps: [
    {
      id: 'step-1',
      title: 'Introduction: Getting Started with the Lesson Planner',
      duration: '2 min',
      content: {
        type: 'video',
        data: {
          description: 'Learn how the AI-powered lesson planner can save you time while creating high-quality, standards-aligned lesson plans.',
          keyPoints: [
            'The lesson planner uses AI to generate comprehensive lesson plans',
            'You provide key information and the AI creates structured, detailed plans',
            'All plans are aligned to curriculum standards and frameworks',
            'You can customize and refine the generated plans',
          ],
          media: {
            type: 'video',
            provider: 'youtube',
            url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
            title: 'Introduction: Getting Started with the Lesson Planner',
            duration: '2 min',
            controls: true,
          },
        },
      },
      keyTakeaways: [
        'The planner is a tool to enhance your teaching, not replace your expertise',
        'The more specific your inputs, the better the output',
        'Always review and personalize AI-generated content',
      ],
      reflection: 'What aspects of lesson planning take you the most time? How could AI help streamline your process?',
    },
    {
      id: 'step-2',
      title: 'Step 1: Basic Information',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Start with the fundamentals: grade, subject, topic, and duration',
          examples: [
            {
              scenario: 'Planning a Science Lesson',
              grade: 'Grade 5',
              subject: 'Science',
              topic: 'Water Cycle',
              duration: '45 minutes',
              tip: 'Be specific with topics. "Water Cycle" is better than "Science"',
            },
            {
              scenario: 'Planning a Math Lesson',
              grade: 'Grade 3',
              subject: 'Mathematics',
              topic: 'Multiplication Tables (2s and 5s)',
              duration: '30 minutes',
              tip: 'Include specific learning focus in the topic field',
            },
          ],
          implementation: [
            'Select or enter the grade level',
            'Choose the subject from the dropdown',
            'Enter a specific topic (not just the subject name)',
            'Set the lesson duration',
            'Choose your curriculum profile (e.g., US Common Core, UK National Curriculum)',
          ],
        },
      },
      keyTakeaways: [
        'Specific topics generate better lesson plans',
        'Duration affects the depth and number of activities',
        'Curriculum profile ensures standards alignment',
      ],
      reflection: 'Think of an upcoming lesson. What specific topic will you enter?',
    },
    {
      id: 'step-3',
      title: 'Step 2: Learning Objectives',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Define clear, measurable learning objectives',
          examples: [
            {
              scenario: 'Good Learning Objectives',
              objectives: [
                'Students will explain the stages of the water cycle',
                'Students will identify the role of evaporation and condensation',
                'Students will create a diagram showing the water cycle process',
              ],
            },
            {
              scenario: 'Weak Learning Objectives',
              objectives: [
                'Students will learn about the water cycle',
                'Students will understand science',
                'Students will do activities',
              ],
            },
          ],
          implementation: [
            'Start with action verbs (explain, identify, create, analyze)',
            'Make objectives specific and measurable',
            'Align objectives with curriculum standards',
            'Include 2-4 objectives per lesson',
            'Use Bloom\'s Taxonomy levels appropriately',
          ],
        },
      },
      keyTakeaways: [
        'Use action verbs from Bloom\'s Taxonomy',
        'Objectives should be observable and measurable',
        'Fewer, clearer objectives are better than many vague ones',
      ],
      reflection: 'Write 2-3 learning objectives for your next lesson. Are they specific and measurable?',
    },
    {
      id: 'step-4',
      title: 'Step 3: Prior Knowledge & Teaching Methods',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Prior Knowledge: Describe what students already know or should know',
            'This helps the AI create appropriate scaffolding and connections',
            'Be specific: "Students know basic addition facts" is better than "Students know math"',
            'Teaching Methods: Choose the approach that fits your lesson',
            'Options include: inquiry-based, direct instruction, project-based, collaborative, etc.',
          ],
          tools: [
            'Prior Knowledge Examples:',
            '- "Students can identify nouns and verbs"',
            '- "Students understand that plants need water and sunlight"',
            '- "Students have practiced addition with regrouping"',
            '',
            'Teaching Method Selection:',
            '- Inquiry-based: For exploration and discovery',
            '- Direct instruction: For introducing new concepts',
            '- Project-based: For extended, real-world applications',
            '- Collaborative: For group work and peer learning',
          ],
        },
      },
      keyTakeaways: [
        'Prior knowledge helps AI create appropriate content',
        'Teaching method selection influences activity types',
        'Be honest about what students know',
      ],
      reflection: 'What prior knowledge do your students have for your next lesson?',
    },
    {
      id: 'step-5',
      title: 'Step 4: Materials & Student Grouping',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Specify available materials and preferred grouping strategies',
          examples: [
            {
              scenario: 'Materials Available',
              materials: ['Whiteboard', 'Chart paper', 'Markers', 'Internet access', 'Tablets'],
              tip: 'List what you actually have access to',
            },
            {
              scenario: 'Student Grouping Options',
              options: [
                'Whole class',
                'Pairs',
                'Groups of 3-4',
                'Individual work',
                'Flexible grouping',
              ],
            },
          ],
          implementation: [
            'List all materials you have available',
            'Be realistic about technology access',
            'Choose grouping that supports your learning objectives',
            'Consider your classroom space and management',
            'You can mix grouping strategies within one lesson',
          ],
        },
      },
      keyTakeaways: [
        'Realistic material lists prevent impractical suggestions',
        'Grouping affects activity design',
        'Consider your classroom context',
      ],
      reflection: 'What materials do you typically have available? How do you usually group students?',
    },
    {
      id: 'step-6',
      title: 'Step 5: Differentiation Options',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Enable differentiation if you have diverse learners',
            'The AI will suggest strategies for emerging and advanced learners',
            'Differentiation can include: content, process, product, or environment',
            'Even if you don\'t enable it, you can add differentiation later',
          ],
          tools: [
            'When to Enable Differentiation:',
            '- Mixed ability levels in your class',
            '- Students with IEPs or 504 plans',
            '- English language learners',
            '- Students who need enrichment',
            '',
            'What Gets Generated:',
            '- Support strategies for struggling learners',
            '- Extension activities for advanced learners',
            '- Multiple entry points for activities',
            '- Varied assessment options',
          ],
        },
      },
      keyTakeaways: [
        'Differentiation makes lessons accessible to all learners',
        'You can always add more differentiation manually',
        'Consider your specific student needs',
      ],
      reflection: 'Do you have students who would benefit from differentiated instruction?',
    },
    {
      id: 'step-7',
      title: 'Step 6: Generating & Reviewing Your Lesson Plan',
      duration: '2 min',
      content: {
        type: 'example',
        data: {
          classroom: {
            grade: 5,
            subject: 'Science',
            students: 24,
            diversity: 'Mixed abilities, 2 ELL students',
          },
          challenge: 'Creating a comprehensive lesson plan that meets all students\' needs',
          approach: 'Using AI to generate a draft, then personalizing it',
        },
      },
      keyTakeaways: [
        'Review the generated plan carefully',
        'Check alignment with your objectives',
        'Personalize activities for your students',
        'Adjust timing if needed',
      ],
      reflection: 'What will you look for when reviewing an AI-generated lesson plan?',
    },
    {
      id: 'step-8',
      title: 'Best Practices & Pro Tips',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Maximize the effectiveness of your AI-generated lesson plans',
          steps: [
            'Always review and edit the generated plan',
            'Add personal touches and connections to your students',
            'Verify that activities match your available time',
            'Check that assessments align with learning objectives',
            'Customize differentiation for your specific students',
            'Save successful plans as templates for future use',
            'Iterate and refine based on what works',
          ],
          resources: [
            'Lesson plan template library',
            'Standards alignment guide',
            'Differentiation strategy bank',
            'Assessment rubric examples',
          ],
        },
      },
      keyTakeaways: [
        'AI is a starting point, not the final product',
        'Your expertise makes the plan effective',
        'Save and reuse successful elements',
        'Continuous improvement is key',
      ],
      reflection: 'What is your action plan for using the lesson planner effectively?',
    },
  ],
    },
  },
  {
    id: 'agt-2',
    slug: 'creating-effective-assessments',
    title: 'Creating effective assessments',
    subtitle: 'Best practices',
    shortDescription: 'Master the art of designing assessments that accurately measure learning and drive student improvement',
    duration: '15 min',
    ctaLabel: 'Watch',
    sectionKey: 'ai-guided-tutorials-demonstrations',
    aiGuidedTutorialContent: {
      type: 'tutorial',
      renderProfile: 'assessment-best-practices',
      description: 'Assessment design walkthrough aligned to classroom best practices.',
      heroSubtitle: 'Best practices',
      heroDescription: 'Master the art of designing assessments that accurately measure learning and drive student improvement',
      headerDurationLabel: '15 min',
      steps: [
    {
      id: 'step-1',
      title: 'Introduction: The Purpose of Assessment',
      duration: '2 min',
      content: {
        type: 'video',
        data: {
          description: 'Understand the fundamental purposes of assessment and how effective assessments drive student learning.',
          keyPoints: [
            'Assessment informs instruction and guides learning',
            'Formative assessment happens during learning',
            'Summative assessment evaluates learning at the end',
            'Good assessments align with learning objectives',
            'Assessment should be fair, valid, and reliable',
          ],
          media: {
            type: 'video',
            provider: 'youtube',
            url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            title: 'Introduction: The Purpose of Assessment',
            duration: '2 min',
            controls: true,
          },
        },
      },
      keyTakeaways: [
        'Assessment is a tool for learning, not just evaluation',
        'Different types serve different purposes',
        'Alignment with objectives is critical',
      ],
      reflection: 'What is the primary purpose of assessment in your classroom?',
    },
    {
      id: 'step-2',
      title: 'Understanding Assessment Types',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Know when and how to use formative vs summative assessments',
          examples: [
            {
              scenario: 'Formative Assessment Examples',
              assessments: [
                'Exit tickets',
                'Thumbs up/down',
                'Quick quizzes',
                'Observations',
                'Student self-assessments',
                'Peer feedback',
              ],
              purpose: 'To check understanding during instruction and adjust teaching',
            },
            {
              scenario: 'Summative Assessment Examples',
              assessments: [
                'Unit tests',
                'Final projects',
                'End-of-term exams',
                'Portfolio reviews',
                'Performance assessments',
              ],
              purpose: 'To evaluate learning at the end of a unit or period',
            },
          ],
          implementation: [
            'Use formative assessment frequently during instruction',
            'Use summative assessment at natural endpoints',
            'Balance both types throughout the year',
            'Ensure summative assessments reflect what was taught',
          ],
        },
      },
      keyTakeaways: [
        'Formative = during learning, Summative = after learning',
        'Both types are essential',
        'Frequency matters more for formative',
      ],
      reflection: 'What types of assessments do you currently use? Are they balanced?',
    },
    {
      id: 'step-3',
      title: 'Aligning Assessments with Learning Objectives',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Every assessment should measure specific learning objectives',
            'Match the cognitive level of the objective',
            'If the objective is "analyze," the assessment should require analysis',
            'Use Bloom\'s Taxonomy to ensure alignment',
            'Avoid assessing things you didn\'t teach',
          ],
          tools: [
            'Alignment Checklist:',
            '✓ Does the assessment measure the stated objective?',
            '✓ Is the cognitive level appropriate?',
            '✓ Can students demonstrate mastery through this assessment?',
            '✓ Have students had opportunities to practice this skill?',
            '',
            'Bloom\'s Taxonomy Levels:',
            '- Remember: Multiple choice, fill-in-the-blank',
            '- Understand: Explain, summarize, describe',
            '- Apply: Solve problems, use in new situations',
            '- Analyze: Compare, contrast, examine',
            '- Evaluate: Judge, critique, justify',
            '- Create: Design, construct, produce',
          ],
        },
      },
      keyTakeaways: [
        'Alignment ensures validity',
        'Match cognitive levels',
        'Assess what you taught',
      ],
      reflection: 'Review a recent assessment. Does it align with your learning objectives?',
    },
    {
      id: 'step-4',
      title: 'Creating Effective Questions',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Design questions that accurately measure understanding',
          examples: [
            {
              scenario: 'Multiple Choice Questions',
              good: 'Which of the following best explains why plants need sunlight?',
              bad: 'Do plants need sunlight?',
              tip: 'Avoid yes/no questions. Use "which best" to require deeper thinking',
            },
            {
              scenario: 'Short Answer Questions',
              good: 'Explain how photosynthesis converts sunlight into energy. Include the role of chlorophyll.',
              bad: 'What is photosynthesis?',
              tip: 'Be specific about what you want students to explain',
            },
            {
              scenario: 'Essay Questions',
              good: 'Compare and contrast the water cycle and the carbon cycle. Include at least three similarities and three differences.',
              bad: 'Write about cycles.',
              tip: 'Provide clear structure and expectations',
            },
          ],
          implementation: [
            'Use clear, unambiguous language',
            'Avoid trick questions',
            'Ensure questions are grade-level appropriate',
            'Include specific criteria for open-ended questions',
            'Test one concept per question when possible',
          ],
        },
      },
      keyTakeaways: [
        'Clarity prevents confusion',
        'Specific questions get better answers',
        'Avoid trick questions',
      ],
      reflection: 'Rewrite one of your assessment questions to be more specific and clear.',
    },
    {
      id: 'step-5',
      title: 'Rubric Design Best Practices',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Rubrics clarify expectations for students and teachers',
            'Use 3-4 performance levels (e.g., Exceeds, Meets, Approaching, Below)',
            'Describe what each level looks like',
            'Focus on learning objectives, not effort or behavior',
            'Use student-friendly language',
            'Share rubrics before assessment',
          ],
          tools: [
            'Rubric Components:',
            '1. Criteria: What is being assessed',
            '2. Performance Levels: Different levels of achievement',
            '3. Descriptors: What each level looks like',
            '',
            'Example Criteria for Writing:',
            '- Content and Ideas',
            '- Organization',
            '- Word Choice',
            '- Conventions',
            '',
            'Performance Level Example:',
            'Meets: "Writing includes clear main idea with supporting details. Organization is logical with transitions."',
          ],
        },
      },
      keyTakeaways: [
        'Rubrics make expectations clear',
        'Focus on learning, not behavior',
        'Share rubrics in advance',
      ],
      reflection: 'Do you use rubrics? How could they improve your assessments?',
    },
    {
      id: 'step-6',
      title: 'Formative Assessment Strategies',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Implement quick, effective formative assessments',
          examples: [
            {
              scenario: 'Quick Checks',
              strategies: [
                'Thumbs up/down/sideways',
                'Traffic light cards (red/yellow/green)',
                'One-minute papers',
                'Think-pair-share',
                'Whiteboard responses',
              ],
            },
            {
              scenario: 'Exit Tickets',
              strategies: [
                'What was the main idea?',
                'What question do you still have?',
                'Rate your understanding 1-5',
                'One thing you learned, one thing you\'re confused about',
              ],
            },
            {
              scenario: 'Self-Assessment',
              strategies: [
                'Rate your confidence level',
                'What did you do well?',
                'What do you need to work on?',
                'Set a goal for next time',
              ],
            },
          ],
          implementation: [
            'Use formative assessment 3-5 times per lesson',
            'Keep it quick (1-3 minutes)',
            'Use the information immediately',
            'Make it low-stakes',
            'Vary your methods',
          ],
        },
      },
      keyTakeaways: [
        'Frequency matters',
        'Keep it quick and simple',
        'Use results to adjust instruction',
      ],
      reflection: 'Which formative assessment strategy will you try this week?',
    },
    {
      id: 'step-7',
      title: 'Summative Assessment Best Practices',
      duration: '2 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Summative assessments should reflect cumulative learning',
            'Use a variety of assessment types',
            'Allow students to demonstrate learning in multiple ways',
            'Provide clear instructions and expectations',
            'Ensure assessments are fair and accessible',
            'Give students opportunities to prepare',
          ],
          tools: [
            'Assessment Variety:',
            '- Written tests and quizzes',
            '- Projects and presentations',
            '- Portfolios',
            '- Performance tasks',
            '- Oral assessments',
            '',
            'Fairness Checklist:',
            '✓ All students have access to necessary resources',
            '✓ Instructions are clear and unambiguous',
            '✓ Time limits are reasonable',
            '✓ Accommodations are provided when needed',
            '✓ Assessment measures learning, not test-taking skills',
          ],
        },
      },
      keyTakeaways: [
        'Variety shows different strengths',
        'Fairness is essential',
        'Preparation opportunities matter',
      ],
      reflection: 'How do you ensure your summative assessments are fair?',
    },
    {
      id: 'step-8',
      title: 'Providing Effective Feedback',
      duration: '2 min',
      content: {
        type: 'example',
        data: {
          classroom: {
            grade: 7,
            subject: 'English Language Arts',
            students: 28,
            diversity: 'Mixed abilities, various writing levels',
          },
          challenge: 'Providing feedback that helps students improve without overwhelming them',
          approach: 'Using specific, actionable feedback focused on learning objectives',
        },
      },
      keyTakeaways: [
        'Feedback should be specific and actionable',
        'Focus on learning, not just grades',
        'Timely feedback is more effective',
      ],
      reflection: 'What makes feedback effective in your experience?',
    },
    {
      id: 'step-9',
      title: 'Common Mistakes to Avoid',
      duration: '1 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Learn from common assessment pitfalls',
          steps: [
            'Avoid assessing things you didn\'t teach',
            'Don\'t use trick questions or ambiguous wording',
            'Avoid over-testing or under-assessing',
            'Don\'t rely solely on one assessment type',
            'Avoid grading on effort or behavior instead of learning',
            'Don\'t wait too long to provide feedback',
            'Avoid assessments that only test memorization',
          ],
          resources: [
            'Assessment design checklist',
            'Question quality rubric',
            'Feedback templates',
            'Rubric examples',
          ],
        },
      },
      keyTakeaways: [
        'Learn from mistakes',
        'Keep assessments focused on learning',
        'Balance is key',
      ],
      reflection: 'What assessment mistakes have you made? How will you avoid them in the future?',
    },
  ],
    },
  },
  {
    id: 'agt-3',
    slug: 'differentiation-in-action',
    title: 'Real classroom: Differentiation in action',
    subtitle: 'Case study',
    shortDescription: 'Step-by-step walkthrough showing how to implement differentiation strategies effectively',
    duration: '18 min',
    ctaLabel: 'Watch',
    sectionKey: 'ai-guided-tutorials-demonstrations',
    aiGuidedTutorialContent: {
      type: 'tutorial',
      renderProfile: 'differentiation-case-study',
      description: 'Differentiation strategies in real classrooms.',
      heroSubtitle: 'Case study',
      heroDescription: 'Step-by-step walkthrough showing how to implement differentiation strategies effectively',
      headerDurationLabel: '18 min',
      completionTitle: 'Congratulations!',
      completionBody: "You've completed the Differentiation in Action tutorial.",
      steps: [
    {
      id: 'step-1',
      title: 'Introduction: Understanding Differentiation',
      duration: '3 min',
      content: {
        type: 'video',
        data: {
          description: 'Learn the fundamentals of differentiation and why it matters in today\'s diverse classrooms.',
          keyPoints: [
            'Differentiation is not about creating different lessons for each student',
            'It\'s about providing multiple pathways to learning',
            'Focus on content, process, product, and learning environment',
            'All students work toward the same learning goals',
          ],
          media: {
            type: 'video',
            provider: 'youtube',
            url: 'https://www.youtube.com/watch?v=eRsGyueBVvA',
            title: 'Introduction: Understanding Differentiation',
            duration: '3 min',
            controls: true,
          },
        },
      },
      keyTakeaways: [
        'Differentiation is a mindset, not a set of activities',
        'It requires knowing your students deeply',
        'Flexibility and responsiveness are key',
      ],
      reflection: 'Think about a time when you adjusted your teaching for a student. What did you change and why?',
    },
    {
      id: 'step-2',
      title: 'Case Study: Ms. Rodriguez\'s 5th Grade Class',
      duration: '5 min',
      content: {
        type: 'example',
        data: {
          classroom: {
            grade: 5,
            subject: 'Mathematics - Fractions',
            students: 24,
            diversity: 'Mixed ability levels, 3 ELL students, 2 students with IEPs',
          },
          challenge: 'Teaching equivalent fractions to a class with varying levels of understanding',
          approach: 'Tiered activities with multiple entry points',
        },
      },
      keyTakeaways: [
        'Start with pre-assessment to understand student readiness',
        'Design activities at 3-4 different complexity levels',
        'All students work on the same concept but at appropriate levels',
      ],
      reflection: 'How would you assess student readiness before planning differentiated activities?',
    },
    {
      id: 'step-3',
      title: 'Strategy 1: Content Differentiation',
      duration: '4 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Varying what students learn based on readiness, interest, or learning profile',
          examples: [
            {
              scenario: 'Teaching the American Revolution',
              tier1: 'Students read simplified text with key vocabulary highlighted',
              tier2: 'Students read grade-level text with guided questions',
              tier3: 'Students read primary source documents and analyze multiple perspectives',
            },
          ],
          implementation: [
            'Use pre-assessment to determine student readiness',
            'Create materials at different complexity levels',
            'Ensure all materials address the same learning objectives',
            'Provide choice when possible',
          ],
        },
      },
      keyTakeaways: [
        'Content differentiation doesn\'t mean different topics',
        'Use varied texts, resources, and materials',
        'Maintain high expectations for all students',
      ],
      reflection: 'What resources do you currently use that could be adapted for different readiness levels?',
    },
    {
      id: 'step-4',
      title: 'Strategy 2: Process Differentiation',
      duration: '4 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Varying how students make sense of the content',
          examples: [
            {
              scenario: 'Learning about the water cycle',
              visual: 'Students create diagrams and flowcharts',
              kinesthetic: 'Students act out the water cycle process',
              auditory: 'Students listen to and discuss a podcast',
              reading: 'Students read and annotate scientific articles',
            },
          ],
          implementation: [
            'Identify multiple ways to explore the same concept',
            'Provide learning centers or stations',
            'Offer choice in how students process information',
            'Use flexible grouping strategies',
          ],
        },
      },
      keyTakeaways: [
        'Different learning styles require different processes',
        'Flexible grouping allows for peer learning',
        'Process differentiation increases engagement',
      ],
      reflection: 'Which learning styles are most common in your classroom? How can you address them?',
    },
    {
      id: 'step-5',
      title: 'Strategy 3: Product Differentiation',
      duration: '3 min',
      content: {
        type: 'interactive',
        data: {
          strategy: 'Varying how students demonstrate their learning',
          examples: [
            'Written essay or report',
            'Multimedia presentation',
            'Artistic representation',
            'Oral presentation or debate',
            'Performance or demonstration',
            'Portfolio of work',
          ],
          rubrics: 'Use the same rubric criteria but allow different formats',
        },
      },
      keyTakeaways: [
        'Product differentiation honors different strengths',
        'Students can demonstrate understanding in authentic ways',
        'Clear rubrics ensure fairness across different products',
      ],
      reflection: 'What product options could you offer for your next unit?',
    },
    {
      id: 'step-6',
      title: 'Real Classroom Implementation',
      duration: '5 min',
      content: {
        type: 'example',
        data: {
          examples: [
            {
              scenario: 'Teaching persuasive writing',
              challenge: 'Students have varying writing abilities and interests',
              differentiationStrategy: 'Tiered writing prompts with choice',
              implementation: [
                'Tier 1: Write a letter to the principal about a school issue',
                'Tier 2: Write an opinion article for the school newspaper',
                'Tier 3: Write a persuasive speech on a current event',
              ],
              results: '95% of students met or exceeded learning objectives',
              studentFeedback: [
                'I liked choosing my own topic',
                'The prompts helped me know what to write',
                'I felt challenged but not overwhelmed',
              ],
            },
            {
              scenario: 'Science experiment on plant growth',
              challenge: 'Mixed ability levels and language barriers',
              differentiationStrategy: 'Multiple entry points and language supports',
              implementation: [
                'Visual instructions with pictures for all students',
                'Simplified data collection sheets for emerging learners',
                'Extended analysis questions for advanced learners',
                'Bilingual vocabulary cards available',
              ],
              results: 'All students successfully completed the experiment',
              studentFeedback: [
                'The pictures helped me understand',
                'I could work at my own pace',
                'I learned new vocabulary',
              ],
            },
          ],
        },
      },
      keyTakeaways: [
        'Differentiation works best when planned intentionally',
        'Student choice increases motivation',
        'Multiple entry points ensure all students can participate',
      ],
      reflection: 'Which of these strategies could you implement in your classroom this week?',
    },
    {
      id: 'step-7',
      title: 'Assessment and Monitoring',
      duration: '3 min',
      content: {
        type: 'text',
        data: {
          strategies: [
            'Use ongoing formative assessment to adjust instruction',
            'Track individual student progress toward learning goals',
            'Use exit tickets to check understanding',
            'Confer with students regularly',
            'Adjust groups and activities based on data',
          ],
          tools: [
            'Pre-assessments before new units',
            'Quick checks during lessons',
            'Student self-assessments',
            'Portfolio reviews',
            'Observation notes',
          ],
        },
      },
      keyTakeaways: [
        'Assessment drives differentiation decisions',
        'Regular check-ins help adjust instruction',
        'Students should be involved in monitoring their progress',
      ],
      reflection: 'How do you currently assess student understanding? How could you make it more frequent?',
    },
    {
      id: 'step-8',
      title: 'Common Challenges and Solutions',
      duration: '4 min',
      content: {
        type: 'text',
        data: {
          challenges: [
            {
              challenge: 'Time management',
              solution: 'Start small with one subject or one strategy. Use station rotations to manage multiple activities.',
            },
            {
              challenge: 'Planning complexity',
              solution: 'Use templates and frameworks. Plan with colleagues. Reuse and adapt successful activities.',
            },
            {
              challenge: 'Student resistance',
              solution: 'Explain the "why" behind differentiation. Start with choice to build buy-in.',
            },
            {
              challenge: 'Grading fairness',
              solution: 'Use clear rubrics with the same criteria. Focus on growth and progress.',
            },
          ],
        },
      },
      keyTakeaways: [
        'Start small and build gradually',
        'Collaborate with colleagues',
        'Be transparent with students about differentiation',
      ],
      reflection: 'What challenges do you anticipate? How will you address them?',
    },
    {
      id: 'step-9',
      title: 'Action Plan: Your Next Steps',
      duration: '2 min',
      content: {
        type: 'interactive',
        data: {
          steps: [
            'Identify one unit or lesson to differentiate',
            'Choose one differentiation strategy to try',
            'Plan activities for 2-3 readiness levels',
            'Prepare materials and resources',
            'Implement and observe',
            'Reflect and adjust',
          ],
          resources: [
            'Differentiation planning template',
            'Pre-assessment examples',
            'Tiered activity examples',
            'Rubric templates',
          ],
        },
      },
      keyTakeaways: [
        'Start with one strategy in one subject',
        'Reflection is key to improvement',
        'Build your differentiation toolkit gradually',
      ],
      reflection: 'What is your first step toward implementing differentiation in your classroom?',
    },
  ],
    },
  },
  {
    "id": "agt-4",
    "slug": "classroom-engagement-in-action",
    "title": "Real classroom: Engagement in action",
    "subtitle": "Case study",
    "shortDescription": "Step-by-step walkthrough showing how to implement engagement strategies effectively",
    "duration": "20 min",
    "ctaLabel": "Watch",
    "sectionKey": "ai-guided-tutorials-demonstrations",
    "aiGuidedTutorialContent": {
      "type": "tutorial",
      "renderProfile": "engagement-case-study",
      "description": "Student engagement strategies in real classrooms.",
      "heroSubtitle": "Case study",
      "heroDescription": "Step-by-step walkthrough showing how to implement engagement strategies effectively",
      "headerDurationLabel": "20 min",
      "completionTitle": "Congratulations!",
      "completionBody": "You've completed the Engagement in Action tutorial.",
      "steps": [
        {
          "id": "step-1",
          "title": "Introduction: What is Student Engagement?",
          "duration": "3 min",
          "content": {
            "type": "video",
            "data": {
              "description": "Learn what student engagement really means and why it impacts learning outcomes.",
              "keyPoints": [
                "Engagement is more than participation",
                "It includes emotional, cognitive, and behavioral involvement",
                "Engaged students retain more information",
                "Active learning increases engagement"
              ],
              "media": {
                "type": "video",
                "provider": "youtube",
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "title": "Understanding Student Engagement",
                "duration": "3 min",
                "controls": true
              }
            }
          },
          "keyTakeaways": [
            "Engagement drives learning outcomes",
            "Students must be mentally involved",
            "Passive learning reduces retention"
          ],
          "reflection": "When were your students most engaged recently? What caused it?"
        },
        {
          "id": "step-2",
          "title": "Case Study: Mr. Ahmed's Science Class",
          "duration": "5 min",
          "content": {
            "type": "example",
            "data": {
              "classroom": {
                "grade": 6,
                "subject": "Science - Energy",
                "students": 28,
                "diversity": "Mixed ability, varying attention levels"
              },
              "challenge": "Students losing focus during lectures",
              "approach": "Interactive learning + gamification"
            }
          },
          "keyTakeaways": [
            "Traditional lectures reduce engagement",
            "Interactive elements boost attention",
            "Gamification increases motivation"
          ],
          "reflection": "What causes disengagement in your classroom?"
        },
        {
          "id": "step-3",
          "title": "Strategy 1: Gamification",
          "duration": "4 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Using game mechanics to increase motivation",
              "examples": [
                {
                  "scenario": "Quiz competition",
                  "implementation": "Students earn points for correct answers",
                  "result": "Higher participation"
                }
              ],
              "implementation": [
                "Add points or rewards",
                "Use challenges and levels",
                "Create friendly competition",
                "Track progress visually"
              ]
            }
          },
          "keyTakeaways": [
            "Gamification increases motivation",
            "Rewards should be meaningful",
            "Balance competition and collaboration"
          ],
          "reflection": "How can you gamify your next lesson?"
        },
        {
          "id": "step-4",
          "title": "Strategy 2: Active Learning",
          "duration": "4 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Students actively participate instead of passively listening",
              "examples": [
                {
                  "scenario": "Group discussion",
                  "result": "Improved understanding"
                }
              ],
              "implementation": [
                "Use think-pair-share",
                "Ask open-ended questions",
                "Encourage discussion",
                "Use hands-on activities"
              ]
            }
          },
          "keyTakeaways": [
            "Active learning improves retention",
            "Students learn better by doing",
            "Interaction builds deeper understanding"
          ],
          "reflection": "What active strategy can you try tomorrow?"
        },
        {
          "id": "step-5",
          "title": "Real Classroom Implementation",
          "duration": "4 min",
          "content": {
            "type": "example",
            "data": {
              "examples": [
                {
                  "scenario": "Math quiz game",
                  "challenge": "Low participation",
                  "strategy": "Points + leaderboard",
                  "result": "90% participation"
                },
                {
                  "scenario": "History debate",
                  "challenge": "Student boredom",
                  "strategy": "Group discussions",
                  "result": "Higher engagement"
                }
              ]
            }
          },
          "keyTakeaways": [
            "Small changes create big impact",
            "Engagement increases participation",
            "Students enjoy interactive learning"
          ],
          "reflection": "Which strategy fits your classroom best?"
        },
        {
          "id": "step-6",
          "title": "Assessment and Feedback",
          "duration": "2 min",
          "content": {
            "type": "text",
            "data": {
              "strategies": [
                "Use quick quizzes",
                "Ask reflective questions",
                "Monitor participation",
                "Provide instant feedback"
              ],
              "tools": [
                "Exit tickets",
                "Polls",
                "Observation",
                "Student feedback"
              ]
            }
          },
          "keyTakeaways": [
            "Feedback improves engagement",
            "Assessment should be continuous",
            "Students should reflect on learning"
          ],
          "reflection": "How do you currently measure engagement?"
        },
        {
          "id": "step-7",
          "title": "Action Plan: Next Steps",
          "duration": "2 min",
          "content": {
            "type": "interactive",
            "data": {
              "steps": [
                "Choose one engagement strategy",
                "Apply it in your next lesson",
                "Observe student response",
                "Adjust based on feedback"
              ],
              "resources": [
                "Gamification templates",
                "Active learning strategies",
                "Lesson planning guides"
              ]
            }
          },
          "keyTakeaways": [
            "Start small",
            "Experiment and improve",
            "Consistency builds results"
          ],
          "reflection": "What is one action you will take this week?"
        }
      ]
    }
  },
  {
    "id": "agt-5",
    "slug": "project-based-learning-in-action",
    "title": "Real classroom: Project-Based Learning in action",
    "subtitle": "Deep dive case study",
    "shortDescription": "Explore how a teacher transformed a traditional unit into a project-based learning experience",
    "duration": "22 min",
    "ctaLabel": "Watch",
    "sectionKey": "ai-guided-tutorials-demonstrations",
    "aiGuidedTutorialContent": {
      "type": "tutorial",
      "renderProfile": "pbl-case-study",
      "description": "Project-Based Learning (PBL) implemented in real classrooms.",
      "heroSubtitle": "Deep dive case study",
      "heroDescription": "Follow a real teacher redesigning lessons using project-based learning",
      "headerDurationLabel": "22 min",
      "completionTitle": "Well done!",
      "completionBody": "You've completed the Project-Based Learning case study.",
      "steps": [
        {
          "id": "step-1",
          "title": "What is Project-Based Learning?",
          "duration": "4 min",
          "content": {
            "type": "video",
            "data": {
              "description": "Understand how PBL shifts learning from passive to active exploration.",
              "keyPoints": [
                "Students learn by solving real-world problems",
                "Focus on inquiry and exploration",
                "Encourages collaboration and ownership",
                "Assessment is integrated into the process"
              ],
              "media": {
                "type": "video",
                "provider": "youtube",
                "url": "https://www.youtube.com/watch?v=9WZx4lQ2tM8",
                "title": "Introduction to Project-Based Learning",
                "duration": "4 min",
                "controls": true
              }
            }
          },
          "keyTakeaways": [
            "PBL focuses on real-world relevance",
            "Students take ownership of learning",
            "Learning becomes more meaningful"
          ],
          "reflection": "What topic in your subject could be turned into a real-world project?"
        },
        {
          "id": "step-2",
          "title": "Case Study: Ms. Khan's Environmental Science Unit",
          "duration": "5 min",
          "content": {
            "type": "example",
            "data": {
              "classroom": {
                "grade": 7,
                "subject": "Environmental Science",
                "students": 30,
                "diversity": "Mixed engagement levels, some low motivation"
              },
              "challenge": "Students memorizing concepts but not applying them",
              "approach": "Community-based environmental project"
            }
          },
          "keyTakeaways": [
            "Traditional teaching limited real understanding",
            "Real-world problems increased relevance",
            "Students became more invested"
          ],
          "reflection": "What real-world problem connects to your subject?"
        },
        {
          "id": "step-3",
          "title": "Designing the Driving Question",
          "duration": "3 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Creating a strong driving question to guide learning",
              "examples": [
                {
                  "weak": "What is pollution?",
                  "strong": "How can we reduce pollution in our local community?"
                }
              ],
              "implementation": [
                "Make it open-ended",
                "Ensure real-world relevance",
                "Connect to curriculum goals",
                "Encourage investigation"
              ]
            }
          },
          "keyTakeaways": [
            "Driving question sets direction",
            "It should spark curiosity",
            "Avoid simple factual questions"
          ],
          "reflection": "Rewrite one of your lesson questions into a driving question."
        },
        {
          "id": "step-4",
          "title": "Student Collaboration & Roles",
          "duration": "4 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Structuring teamwork for better outcomes",
              "examples": [
                {
                  "roles": [
                    "Researcher",
                    "Presenter",
                    "Designer",
                    "Data Analyst"
                  ],
                  "benefit": "Each student contributes based on strengths"
                }
              ],
              "implementation": [
                "Assign clear roles",
                "Rotate responsibilities",
                "Set group goals",
                "Monitor collaboration"
              ]
            }
          },
          "keyTakeaways": [
            "Clear roles improve teamwork",
            "Collaboration builds communication skills",
            "Accountability is essential"
          ],
          "reflection": "How do you currently manage group work?"
        },
        {
          "id": "step-5",
          "title": "Real Implementation Example",
          "duration": "4 min",
          "content": {
            "type": "example",
            "data": {
              "examples": [
                {
                  "scenario": "Plastic waste project",
                  "task": "Students audit school waste and propose solutions",
                  "output": "Presentation to school administration",
                  "result": "Students implemented recycling initiative"
                },
                {
                  "scenario": "Water conservation campaign",
                  "task": "Design awareness posters and videos",
                  "output": "School-wide campaign",
                  "result": "Reduced water usage in school"
                }
              ]
            }
          },
          "keyTakeaways": [
            "Projects should have real impact",
            "Students feel proud of outcomes",
            "Learning becomes visible"
          ],
          "reflection": "What outcome could your students create beyond the classroom?"
        },
        {
          "id": "step-6",
          "title": "Assessment in PBL",
          "duration": "3 min",
          "content": {
            "type": "text",
            "data": {
              "strategies": [
                "Assess process, not just final product",
                "Use peer evaluation",
                "Track collaboration",
                "Include reflection journals"
              ],
              "tools": [
                "Rubrics",
                "Checklists",
                "Peer feedback forms",
                "Teacher observation"
              ]
            }
          },
          "keyTakeaways": [
            "Assessment should be continuous",
            "Focus on skills and understanding",
            "Include student reflection"
          ],
          "reflection": "How can you assess both process and outcome?"
        },
        {
          "id": "step-7",
          "title": "Common Pitfalls",
          "duration": "3 min",
          "content": {
            "type": "text",
            "data": {
              "challenges": [
                {
                  "challenge": "Too much freedom",
                  "solution": "Provide structure and checkpoints"
                },
                {
                  "challenge": "Unequal participation",
                  "solution": "Assign roles and track contributions"
                },
                {
                  "challenge": "Time management",
                  "solution": "Break project into phases"
                }
              ]
            }
          },
          "keyTakeaways": [
            "Structure is important in PBL",
            "Monitor student progress",
            "Balance freedom with guidance"
          ],
          "reflection": "Which challenge do you expect the most?"
        },
        {
          "id": "step-8",
          "title": "Your Action Plan",
          "duration": "2 min",
          "content": {
            "type": "interactive",
            "data": {
              "steps": [
                "Select one topic",
                "Create a driving question",
                "Design a simple project",
                "Implement in one class",
                "Reflect and improve"
              ],
              "resources": [
                "PBL templates",
                "Driving question examples",
                "Assessment rubrics"
              ]
            }
          },
          "keyTakeaways": [
            "Start small with one project",
            "Iterate based on experience",
            "Build confidence gradually"
          ],
          "reflection": "What project will you try first?"
        }
      ]
    }
  },
  {
    "id": "agt-6",
    "slug": "classroom-management-in-action",
    "title": "Real classroom: Classroom management in action",
    "subtitle": "Practical walkthrough",
    "shortDescription": "See how a teacher reset routines, improved behavior, and built a calmer learning environment",
    "duration": "21 min",
    "ctaLabel": "Watch",
    "sectionKey": "ai-guided-tutorials-demonstrations",
    "aiGuidedTutorialContent": {
      "type": "tutorial",
      "renderProfile": "classroom-management-case-study",
      "description": "Classroom management strategies applied in real teaching situations.",
      "heroSubtitle": "Practical walkthrough",
      "heroDescription": "See how clear routines and proactive strategies can transform classroom behavior",
      "headerDurationLabel": "21 min",
      "completionTitle": "Great work!",
      "completionBody": "You've completed the Classroom Management in Action tutorial.",
      "steps": [
        {
          "id": "step-1",
          "title": "Why Classroom Management Matters",
          "duration": "3 min",
          "content": {
            "type": "video",
            "data": {
              "description": "Explore how effective classroom management creates the conditions for better learning, stronger relationships, and fewer disruptions.",
              "keyPoints": [
                "Classroom management is about prevention, not just correction",
                "Clear expectations reduce confusion and off-task behavior",
                "Consistency builds safety and trust",
                "Strong routines create more time for teaching"
              ],
              "media": {
                "type": "video",
                "provider": "youtube",
                "url": "https://www.youtube.com/watch?v=3kN7nK7Jr0A",
                "title": "Why Classroom Management Matters",
                "duration": "3 min",
                "controls": true
              }
            }
          },
          "keyTakeaways": [
            "Good management protects learning time",
            "Students respond better to clarity than constant correction",
            "Prevention is more effective than reacting late"
          ],
          "reflection": "What is the most common behavior issue that interrupts your teaching time?"
        },
        {
          "id": "step-2",
          "title": "Case Study: Mr. Tariq's Grade 8 English Class",
          "duration": "4 min",
          "content": {
            "type": "example",
            "data": {
              "classroom": {
                "grade": 8,
                "subject": "English Language Arts",
                "students": 32,
                "diversity": "High-energy group, frequent interruptions, inconsistent homework completion"
              },
              "challenge": "Students entered class noisily, took too long to settle, and often talked over instruction",
              "approach": "Routine reset with explicit expectations, entry procedures, and positive reinforcement"
            }
          },
          "keyTakeaways": [
            "The issue was not only behavior, but lack of predictable systems",
            "Students needed structure at transition points",
            "Resetting routines can quickly improve classroom tone"
          ],
          "reflection": "Which transition in your classroom creates the most chaos: entry, group work, or ending the lesson?"
        },
        {
          "id": "step-3",
          "title": "Strategy 1: Resetting Entry Routines",
          "duration": "3 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Building a calm, predictable start to every lesson",
              "examples": [
                {
                  "scenario": "Students entering after lunch",
                  "routine": [
                    "Pick up warm-up sheet at the door",
                    "Sit in assigned seat within 1 minute",
                    "Start the bell task silently",
                    "Teacher checks in with 2 students during the first 2 minutes"
                  ]
                }
              ],
              "implementation": [
                "Teach the routine explicitly",
                "Model the routine step by step",
                "Practice it several times",
                "Reinforce it consistently every day"
              ]
            }
          },
          "keyTakeaways": [
            "Students need routines to be taught, not assumed",
            "The first few minutes shape the entire lesson",
            "Simple routines reduce the need for repeated reminders"
          ],
          "reflection": "What would an ideal first 3 minutes of your class look like?"
        },
        {
          "id": "step-4",
          "title": "Strategy 2: Clear Expectations and Non-Verbal Signals",
          "duration": "3 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Using explicit expectations and silent cues to guide behavior",
              "examples": [
                {
                  "expectation": "One voice at a time during discussion",
                  "signal": "Teacher raises hand and waits for silence"
                },
                {
                  "expectation": "Transition within 30 seconds",
                  "signal": "Countdown timer displayed on board"
                }
              ],
              "implementation": [
                "Define 3-5 core expectations",
                "Use simple language students understand",
                "Attach each expectation to a routine",
                "Pair verbal reminders with visual or non-verbal signals"
              ]
            }
          },
          "keyTakeaways": [
            "Students respond better to a few clear rules than a long list",
            "Non-verbal signals reduce teacher over-talking",
            "Visual consistency improves follow-through"
          ],
          "reflection": "Which classroom expectation do your students still seem unclear about?"
        },
        {
          "id": "step-5",
          "title": "Strategy 3: Positive Reinforcement That Actually Works",
          "duration": "3 min",
          "content": {
            "type": "interactive",
            "data": {
              "strategy": "Recognizing desired behavior quickly and specifically",
              "examples": [
                {
                  "ineffective": "Good job, class",
                  "effective": "I noticed table 3 started the task immediately and shared materials well"
                }
              ],
              "implementation": [
                "Name the exact behavior you want repeated",
                "Acknowledge effort early",
                "Use praise that is specific and credible",
                "Balance individual, group, and whole-class recognition"
              ]
            }
          },
          "keyTakeaways": [
            "Specific praise is stronger than generic praise",
            "Students repeat behaviors that get noticed",
            "Positive reinforcement should support expectations, not replace them"
          ],
          "reflection": "What behavior do you want to reinforce more intentionally this week?"
        },
        {
          "id": "step-6",
          "title": "Real Classroom Scenario: Group Work Without Chaos",
          "duration": "4 min",
          "content": {
            "type": "example",
            "data": {
              "examples": [
                {
                  "scenario": "Literature discussion groups",
                  "challenge": "Students became loud, some dominated, others stopped contributing",
                  "differentiationStrategy": "Structured discussion roles and timed participation rounds",
                  "implementation": [
                    "Each student got a role card: facilitator, summarizer, evidence finder, reporter",
                    "Teacher displayed noise-level expectations on the board",
                    "Groups used a checklist before calling the teacher",
                    "A 2-minute reflection closed the activity"
                  ],
                  "results": "Group work stayed focused longer and participation became more balanced",
                  "studentFeedback": [
                    "It was easier when I knew my job",
                    "The checklist helped our group solve problems first",
                    "I talked more because everyone had a turn"
                  ]
                },
                {
                  "scenario": "Independent writing time",
                  "challenge": "Frequent off-task talking and repeated requests for help",
                  "differentiationStrategy": "Silent start routine plus help protocol",
                  "implementation": [
                    "First 5 minutes were silent writing time",
                    "Students highlighted the part where they were stuck before asking for help",
                    "Teacher circulated using a priority list",
                    "Peers could help only after the silent start ended"
                  ],
                  "results": "Students settled faster and interruptions dropped significantly",
                  "studentFeedback": [
                    "Starting quietly helped me focus",
                    "I solved some of my own problems first",
                    "Waiting made me think before asking"
                  ]
                }
              ]
            }
          },
          "keyTakeaways": [
            "Management is strongest when built into the task design",
            "Roles and protocols reduce confusion",
            "Students behave better when the process is predictable"
          ],
          "reflection": "Which learning activity in your class would benefit most from a stronger structure?"
        },
        {
          "id": "step-7",
          "title": "Monitoring Behavior and Responding Early",
          "duration": "2 min",
          "content": {
            "type": "text",
            "data": {
              "strategies": [
                "Circulate before problems escalate",
                "Use proximity to redirect without stopping the lesson",
                "Track patterns instead of reacting to isolated moments",
                "Respond privately when possible",
                "Use calm, brief corrections tied to expectations"
              ],
              "tools": [
                "Seating chart notes",
                "Behavior pattern tracker",
                "Quick reflection slips",
                "Teacher observation log",
                "Routine checklist"
              ]
            }
          },
          "keyTakeaways": [
            "Early intervention prevents escalation",
            "Private redirection protects student dignity",
            "Patterns matter more than one-off incidents"
          ],
          "reflection": "Are you mostly reacting to behavior, or noticing patterns before problems grow?"
        },
        {
          "id": "step-8",
          "title": "Common Challenges and Fixes",
          "duration": "3 min",
          "content": {
            "type": "text",
            "data": {
              "challenges": [
                {
                  "challenge": "Students follow routines for a few days, then slip back",
                  "solution": "Reteach routines after breaks and reinforce them consistently for at least 2 weeks"
                },
                {
                  "challenge": "A few students disrupt the system for everyone",
                  "solution": "Use targeted support plans while keeping whole-class systems stable"
                },
                {
                  "challenge": "Teacher feels exhausted by constant correction",
                  "solution": "Reduce talking, use signals, and fix routines at transition points first"
                },
                {
                  "challenge": "Students see expectations as punishment",
                  "solution": "Explain that routines make learning easier, fairer, and calmer for everyone"
                }
              ]
            }
          },
          "keyTakeaways": [
            "Routines fail when they are not retaught",
            "Whole-class systems and individual support should work together",
            "Management gets easier when systems do more of the work"
          ],
          "reflection": "Which challenge sounds most like your classroom right now?"
        },
        {
          "id": "step-9",
          "title": "Action Plan: Reset One Routine This Week",
          "duration": "2 min",
          "content": {
            "type": "interactive",
            "data": {
              "steps": [
                "Choose one routine that causes repeated disruption",
                "Write the routine in 3-5 clear steps",
                "Model it for students",
                "Practice it with feedback",
                "Reinforce it daily for one full week",
                "Review what improved and what still needs adjustment"
              ],
              "resources": [
                "Classroom routine planning template",
                "Expectation poster examples",
                "Behavior reflection form",
                "Transition checklist"
              ]
            }
          },
          "keyTakeaways": [
            "Do not fix everything at once",
            "Start with one high-impact routine",
            "Consistency matters more than complexity"
          ],
          "reflection": "What is the one classroom routine you will reset first?"
        }
      ]
    }
  }
]

import type { LearningHubSectionItem } from '../types'

export const specialistDeepDiveTracksData: LearningHubSectionItem[] = [
  {
    id: 'sdt-1',
    slug: 'stem-mastery',
    title: 'STEM Mastery',
    shortDescription: 'NGSS alignment & evidence habits.',
    duration: '12 hours',
    ctaLabel: 'Continue',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'A structured path through NGSS foundations and evidence routines.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Build integrated instruction with assessment habits.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-cyan-600',
      modules: [
        {
          id: 'module-ngss-foundations',
          title: 'NGSS Foundations & Three-Dimensional Learning',
          description: 'Master how DCIs, SEPs, and CCCs fit together in tasks.',
          duration: '2 hours',
          learningOutcomes: ['Understand NGSS structure', 'Plan evidence', 'Sequence for sense-making'],
          lessons: [
            {
              id: 'lesson-ngss-1',
              title: 'Tagging evidence and dimensions',
              duration: '45 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
                    title: 'Introduction to NGSS Framework',
                    duration: '18 min',
                    controls: true,
                  },
                },
                {
                  type: 'text',
                  heading: 'Build your NGSS checklist',
                  paragraphs: ['Use a simple checklist to find SEPs, CCCs, and DCIs.', 'Focus on evidence-rich student work.'],
                },
                {
                  type: 'interactive',
                  title: 'Practice: Tag one task',
                  prompt: 'Tag the SEP, DCI, and CCC. What evidence will students produce?',
                  tips: ['Choose one activity', 'Mark what students do', 'Write evidence in student language'],
                },
              ],
            },
          ],
        },
      ],
      outcomes: ['Design three-dimensional STEM experiences'],
      assessment: { title: 'Capstone portfolio', description: 'Collect at least one artifact.', points: 50 },
      certification: { title: 'STEM Mastery track', body: 'You reached the end. Keep iterating with your PLC.' },
      metadata: { level: 'Intermediate', discipline: 'STEM' },
    },
    },
  {
    id: 'sdt-2',
    slug: 'literacy-expert',
    title: 'Literacy Expert',
    shortDescription: 'Phonics, guided reading, writing workshop, and multilingual supports.',
    duration: '15 hours',
    ctaLabel: 'Continue',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Deep literacy moves from foundations through evidence planning and student-facing routines.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Strengthen every layer of your literacy block with research-aligned, classroom-ready practices.',
      headerGradientClass: 'from-violet-600 via-indigo-600 to-blue-600',
      modules: [
        {
          id: 'module-literacy-foundations',
          title: 'Foundations of Literacy Instruction',
          description: 'Ground instruction in the science of reading and evidence habits.',
          duration: '2 hours',
          learningOutcomes: ['Connect research to daily decisions', 'Plan for evidence-rich work'],
          lessons: [
            {
              id: 'lesson-lit-1',
              title: 'Plan your literacy evidence',
              duration: '45 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    title: 'The Science of Reading: What Works',
                    duration: '20 min',
                    controls: true,
                  },
                },
                {
                  type: 'text',
                  heading: 'Make evidence explicit',
                  paragraphs: [
                    'Decide what evidence students will produce during each literacy block.',
                    'Use short feedback cycles to adjust quickly.',
                  ],
                },
                {
                  type: 'interactive',
                  title: 'Workshop: choose your evidence',
                  prompt: 'Pick one activity and define the evidence students will show (in student language).',
                  tips: ['Name the student product', 'Tie it to a skill', 'Decide your check step'],
                },
              ],
            },
          ],
        },
      ],
      outcomes: ['Align literacy instruction to evidence and standards'],
      assessment: { title: 'Literacy leadership portfolio', description: 'Assemble evidence-planning artifacts.', points: 180 },
      certification: { title: 'Literacy Expert track', body: 'Teach one focused cycle with your team this month.' },
      metadata: { level: 'Intermediate', discipline: 'ELA' },
    },
  },
  {
    id: 'sdt-3',
    slug: 'ngss-foundations',
    title: 'NGSS Foundations',
    shortDescription: 'Core three-dimensional learning and performance expectations.',
    duration: '8 hours',
    ctaLabel: 'Start',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Build fluency with performance expectations and evidence-aligned tasks.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Design tasks that make students produce evidence aligned to SEPs, DCIs, and CCCs.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-cyan-600',
      modules: [
        {
          id: 'module-ngss-foundations-1',
          title: 'Performance Expectations in Practice',
          description: 'Turn standards into evidence-rich lesson tasks.',
          duration: '2 hours',
          learningOutcomes: ['Tag dimensions quickly', 'Plan evidence checks', 'Sequence for sense-making'],
          lessons: [
            {
              id: 'lesson-ngss-f-1',
              title: 'Tagging the three dimensions',
              duration: '40 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
                    title: 'NGSS: Three Dimensions Overview',
                    duration: '18 min',
                    controls: true,
                  },
                },
                {
                  type: 'text',
                  heading: 'Make evidence explicit',
                  paragraphs: [
                    'Write the evidence students will show (claims, explanations, representations).',
                    'Match that evidence to which SEP and DCI the task measures.',
                  ],
                },
                {
                  type: 'interactive',
                  title: 'Evidence-first planning',
                  prompt: 'Pick one task and define evidence in student language, then match it to SEPs/CCCs.',
                  tips: ['Use student language', 'Name the SEP', 'State the evidence'],
                },
              ],
            },
          ],
        },
      ],
      outcomes: ['Understand NGSS structure', 'Design dimension-aligned tasks'],
      assessment: { title: 'Track checkpoint', description: 'Complete the evidence-first plan.', points: 50 },
      certification: { title: 'NGSS Foundations complete', body: 'Apply your plan to one upcoming unit.' },
      metadata: { level: 'Beginner', discipline: 'STEM' },
    },
  },

  {
    id: 'sdt-4',
    slug: 'engineering-design',
    title: 'Engineering Design',
    shortDescription: 'Facilitate authentic engineering cycles in STEM classrooms.',
    duration: '6 hours',
    ctaLabel: 'Start',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Move students through engineering cycles with clear criteria and evidence checks.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Help students iterate with evidence and structured decision points.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-teal-600',
      modules: [
        {
          id: 'module-eng-design-1',
          title: 'Engineering Cycle Mastery',
          description: 'Ask–Imagine–Plan–Create–Improve in student-friendly steps.',
          duration: '2 hours',
          learningOutcomes: ['Run each cycle phase', 'Use criteria to guide improvement', 'Collect evidence for decisions'],
          lessons: [
            {
              id: 'lesson-eng-d-1',
              title: 'Cycle overview and planning',
              duration: '45 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=3fumBcKC6RE',
                    title: 'Engineering Design Cycle Explained',
                    duration: '20 min',
                    controls: true,
                  },
                },
                {
                  type: 'text',
                  heading: 'Make iterations visible',
                  paragraphs: [
                    'Plan for drafts and revision moments so students can improve with purpose.',
                    'Use criteria so students justify design choices with evidence.',
                  ],
                },
                {
                  type: 'interactive',
                  title: 'Pick your test + evidence',
                  prompt: 'Write one test you will run and the evidence students will record.',
                  tips: ['One test only', 'Clear success criteria', 'Evidence recorded in student work'],
                },
              ],
            },
          ],
        },
      ],
      outcomes: ['Run the design cycle', 'Collect evidence for decisions'],
      assessment: { title: 'Track checkpoint', description: 'Complete the evidence plan for one cycle.', points: 50 },
      certification: { title: 'Engineering Design complete', body: 'Run one cycle with your class next week.' },
      metadata: { level: 'Beginner', discipline: 'STEM' },
    },
  },

  {
    id: 'sdt-5',
    slug: 'computational-thinking',
    title: 'Computational Thinking',
    shortDescription: 'Integrate decomposition, pattern recognition, and debugging across subjects.',
    duration: '7 hours',
    ctaLabel: 'Start',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Connect unplugged and plugged experiences with reasoning and debugging habits.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Strengthen student problem-solving with CT patterns that transfer across disciplines.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-cyan-600',
      modules: [
        {
          id: 'module-ct-1',
          title: 'CT Foundations: Reasoning Patterns',
          description: 'Build fluency with decomposition and debugging.',
          duration: '2 hours',
          learningOutcomes: ['Decompose complex tasks', 'Debug with evidence', 'Transfer CT across tasks'],
          lessons: [
            {
              id: 'lesson-ct-1',
              title: 'Decomposition that students can use',
              duration: '40 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
                    title: 'Computational Thinking Fundamentals',
                    duration: '22 min',
                    controls: true,
                  },
                },
                {
                  type: 'text',
                  heading: 'Teach CT as a reasoning routine',
                  paragraphs: ['Break down, plan, verify, and adjust as observable steps.'],
                },
                {
                  type: 'interactive',
                  title: 'Decompose one unit task',
                  prompt: 'Choose a classroom task and write 3–5 smaller steps students will follow.',
                  tips: ['Keep steps observable', 'Name the outputs', 'Check understanding'],
                },
              ],
            },
          ],
        },
      ],
      outcomes: ['Apply decomposition across tasks', 'Teach debugging responsibly'],
      assessment: { title: 'Track checkpoint', description: 'Submit your decomposition steps for one unit task.', points: 50 },
      certification: { title: 'Computational Thinking complete', body: 'Apply your routines to one cross-curricular task.' },
      metadata: { level: 'Beginner', discipline: 'CS/STEM' },
    },
  },

  {
    id: 'sdt-6',
    slug: 'lab-safety',
    title: 'Lab Safety',
    shortDescription: 'Protocols, documentation, and student training for safer labs.',
    duration: '5 hours',
    ctaLabel: 'Start',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Translate safety rules into student-ready routines and response practice.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Build lab safety culture with clear routines and emergency thinking.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-teal-600',
      modules: [
        {
          id: 'module-safety-1',
          title: 'Safety Routines You Can Teach',
          description: 'Teach procedures and practice calm response.',
          duration: '2 hours',
          learningOutcomes: ['Teach routines', 'Practice response scenarios', 'Document safety expectations'],
          lessons: [
            {
              id: 'lesson-safety-1',
              title: 'Safety fundamentals in student language',
              duration: '40 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    title: 'Lab Safety Fundamentals',
                    duration: '15 min',
                    controls: true,
                  },
                },
                { type: 'text', heading: 'Routine > rule lists', paragraphs: ['Students learn safety through rehearsed routines, not long lists of rules.'] },
                { type: 'interactive', title: 'Teach one routine', prompt: 'Write the 3-step student procedure students will follow.', tips: ['Use student language', 'Include a check step', 'Practice once before the lab'] },
              ],
            },
          ],
        },
      ],
      outcomes: ['Teach safety routines', 'Assess risks quickly'],
      assessment: { title: 'Track checkpoint', description: 'Submit your safety routine steps.', points: 50 },
      certification: { title: 'Lab Safety complete', body: 'Run a rehearsal before the next hands-on rotation.' },
      metadata: { level: 'Beginner', discipline: 'Safety' },
    },
  },

  {
    id: 'sdt-7',
    slug: 'phenomena-driven',
    title: 'Phenomena Driven',
    shortDescription: 'Anchor units with phenomena that motivate investigation.',
    duration: '6 hours',
    ctaLabel: 'Start',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Select phenomena, sequence prompts, and connect evidence to explanations.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Increase engagement while building inquiry and evidence routines.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-teal-600',
      modules: [
        {
          id: 'module-phenomena-1',
          title: 'Phenomena Selection & Prompting',
          description: 'Choose phenomena and plan prompts that pull evidence.',
          duration: '2 hours',
          learningOutcomes: ['Select anchor phenomena', 'Write evidence prompts', 'Guide explanations'],
          lessons: [
            {
              id: 'lesson-phen-1',
              title: 'Choose phenomena that “stick”',
              duration: '40 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
                    title: 'The Power of Phenomena',
                    duration: '18 min',
                    controls: true,
                  },
                },
                { type: 'text', heading: 'Anchor with sense-making', paragraphs: ['Pick phenomena that reveal a pattern students can test or interpret.'] },
                { type: 'interactive', title: 'Phenomenon match', prompt: 'Write one phenomenon and the evidence students will collect to explain it.', tips: ['Make it observable', 'Tie to the concept', 'Name the evidence'] },
              ],
            },
          ],
        },
      ],
      outcomes: ['Select strong phenomena', 'Guide evidence-based explanations'],
      assessment: { title: 'Track checkpoint', description: 'Submit your evidence prompt sequence.', points: 50 },
      certification: { title: 'Phenomena Driven complete', body: 'Run your anchor investigation next unit.' },
      metadata: { level: 'Beginner', discipline: 'STEM' },
    },
  },

  {
    id: 'sdt-8',
    slug: 'data-literacy',
    title: 'Data Literacy',
    shortDescription: 'Modeling, graphing, and arguing from evidence in STEM.',
    duration: '6 hours',
    ctaLabel: 'Start',
    sectionKey: 'specialist-deep-dive-tracks',
    specialistDeepDiveContent: {
      type: 'track',
      renderProfile: 'deep-dive-track',
      description: 'Help students collect, represent, and defend claims with data.',
      heroSubtitle: 'Specialist Track',
      heroDescription: 'Teach students to interpret graphs and use evidence for explanations.',
      headerGradientClass: 'from-indigo-600 via-blue-600 to-cyan-600',
      modules: [
        {
          id: 'module-data-1',
          title: 'Data Collection & Scientific Modeling',
          description: 'Build routines for measurement and evidence-based claims.',
          duration: '2 hours',
          learningOutcomes: ['Collect data', 'Represent evidence', 'Argue from evidence'],
          lessons: [
            {
              id: 'lesson-data-1',
              title: 'Collect and represent',
              duration: '40 min',
              contentBlocks: [
                {
                  type: 'video',
                  media: {
                    type: 'video',
                    provider: 'youtube',
                    url: 'https://www.youtube.com/watch?v=3fumBcKC6RE',
                    title: 'Data Literacy in STEM',
                    duration: '20 min',
                    controls: true,
                  },
                },
                { type: 'text', heading: 'Graph with purpose', paragraphs: ['Teach what the graph is for: compare, identify trends, test claims.'] },
                { type: 'interactive', title: 'Representation choice', prompt: 'Pick the representation students will use and explain why.', tips: ['Match representation to question', 'Use one clear metric', 'Check interpretation'] },
              ],
            },
          ],
        },
      ],
      outcomes: ['Teach data routines', 'Use modeling to explain'],
      assessment: { title: 'Track checkpoint', description: 'Submit representation choice + revised explanation.', points: 50 },
      certification: { title: 'Data Literacy complete', body: 'Apply your frames to one upcoming investigation.' },
      metadata: { level: 'Beginner', discipline: 'STEM' },
    },
  },

  {
    "id": "sdt-12",
    "slug": "critical-thinking-skills",
    "title": "Critical Thinking Skills",
    "shortDescription": "Develop reasoning, analysis, and argumentation in the classroom.",
    "duration": "6 hours",
    "ctaLabel": "Start",
    "sectionKey": "specialist-deep-dive-tracks",
    "specialistDeepDiveContent": {
      "type": "track",
      "renderProfile": "deep-dive-track",
      "description": "Help students question assumptions, analyze information, and construct strong arguments.",
      "heroSubtitle": "Specialist Track",
      "heroDescription": "Teach students how to think, not just what to think, through structured reasoning and debate.",
      "headerGradientClass": "from-purple-600 via-indigo-600 to-blue-600",
      "modules": [
        {
          "id": "module-ct-1",
          "title": "Foundations of Critical Thinking",
          "description": "Introduce students to questioning, reasoning, and evaluating information.",
          "duration": "2 hours",
          "learningOutcomes": [
            "Identify assumptions",
            "Ask deeper questions",
            "Evaluate information sources"
          ],
          "lessons": [
            {
              "id": "lesson-ct-1",
              "title": "Questioning and assumptions",
              "duration": "40 min",
              "contentBlocks": [
                {
                  "type": "video",
                  "media": {
                    "type": "video",
                    "provider": "youtube",
                    "url": "https://www.youtube.com/watch?v=HnJ1bqXUnIM",
                    "title": "What is Critical Thinking?",
                    "duration": "15 min",
                    "controls": true
                  }
                },
                {
                  "type": "text",
                  "heading": "Think beyond the surface",
                  "paragraphs": [
                    "Students often accept information without questioning.",
                    "Critical thinking starts with asking why and how.",
                    "Encourage students to challenge assumptions."
                  ]
                },
                {
                  "type": "interactive",
                  "title": "Identify assumptions",
                  "prompt": "Take a common statement and list hidden assumptions behind it.",
                  "tips": [
                    "Ask what is being taken for granted",
                    "Look for missing perspectives",
                    "Consider alternative explanations"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "module-ct-2",
          "title": "Analyzing Arguments",
          "description": "Teach students how to break down arguments into claims, evidence, and reasoning.",
          "duration": "2 hours",
          "learningOutcomes": [
            "Identify claims and evidence",
            "Analyze argument structure",
            "Evaluate strength of reasoning"
          ],
          "lessons": [
            {
              "id": "lesson-ct-2",
              "title": "Breaking down arguments",
              "duration": "40 min",
              "contentBlocks": [
                {
                  "type": "video",
                  "media": {
                    "type": "video",
                    "provider": "youtube",
                    "url": "https://www.youtube.com/watch?v=6OLPL5p0fMg",
                    "title": "Understanding Arguments",
                    "duration": "12 min",
                    "controls": true
                  }
                },
                {
                  "type": "text",
                  "heading": "Structure of strong arguments",
                  "paragraphs": [
                    "Every argument includes a claim, evidence, and reasoning.",
                    "Weak arguments often lack evidence or logic.",
                    "Students should learn to evaluate each component."
                  ]
                },
                {
                  "type": "interactive",
                  "title": "Analyze an argument",
                  "prompt": "Break down a short argument into claim, evidence, and reasoning.",
                  "tips": [
                    "Look for supporting facts",
                    "Check logical connections",
                    "Identify missing elements"
                  ]
                }
              ]
            },
            {
              "id": "lesson-ct-3",
              "title": "Evaluating sources",
              "duration": "30 min",
              "contentBlocks": [
                {
                  "type": "caseStudy",
                  "title": "Case: Misleading online article",
                  "scenario": "Students use unreliable sources for assignments without checking credibility.",
                  "discussionQuestions": [
                    "What makes a source trustworthy?",
                    "How can students verify information?",
                    "What criteria should be used?"
                  ]
                },
                {
                  "type": "template",
                  "title": "Source evaluation checklist",
                  "sections": [
                    "Author credibility",
                    "Evidence provided",
                    "Bias or perspective",
                    "Date and relevance"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "module-ct-3",
          "title": "Building Student Arguments",
          "description": "Support students in constructing and defending their own ideas.",
          "duration": "2 hours",
          "learningOutcomes": [
            "Construct arguments",
            "Use evidence effectively",
            "Engage in structured debate"
          ],
          "lessons": [
            {
              "id": "lesson-ct-4",
              "title": "Writing strong arguments",
              "duration": "40 min",
              "contentBlocks": [
                {
                  "type": "video",
                  "media": {
                    "type": "video",
                    "provider": "youtube",
                    "url": "https://www.youtube.com/watch?v=9f8c7r1wHjE",
                    "title": "How to Build Arguments",
                    "duration": "14 min",
                    "controls": true
                  }
                },
                {
                  "type": "text",
                  "heading": "From opinion to argument",
                  "paragraphs": [
                    "Students often express opinions without evidence.",
                    "Teach them to support ideas with facts and reasoning.",
                    "Encourage structured writing formats."
                  ]
                },
                {
                  "type": "interactive",
                  "title": "Build your argument",
                  "prompt": "Write a short argument with claim, evidence, and reasoning.",
                  "tips": [
                    "Be clear about your claim",
                    "Use relevant evidence",
                    "Explain your reasoning"
                  ]
                }
              ]
            },
            {
              "id": "lesson-ct-5",
              "title": "Classroom debate strategies",
              "duration": "30 min",
              "contentBlocks": [
                {
                  "type": "caseStudy",
                  "title": "Case: Unstructured debate",
                  "scenario": "Students argue without evidence and discussions become chaotic.",
                  "discussionQuestions": [
                    "What structure is missing?",
                    "How can debate be organized?",
                    "What rules should be introduced?"
                  ]
                },
                {
                  "type": "template",
                  "title": "Debate framework",
                  "sections": [
                    "Opening claim",
                    "Supporting evidence",
                    "Counterargument",
                    "Conclusion"
                  ]
                }
              ]
            }
          ]
        }
      ],
      "outcomes": [
        "Develop critical thinking skills",
        "Analyze and evaluate arguments",
        "Support claims with evidence"
      ],
      "assessment": {
        "title": "Track checkpoint",
        "description": "Submit one student argument task with claim, evidence, and reasoning structure.",
        "points": 50
      },
      "certification": {
        "title": "Critical Thinking complete",
        "body": "You completed the Critical Thinking track. Apply argument structures in your next lesson."
      },
      "metadata": {
        "level": "Intermediate",
        "discipline": "General Education"
      }
    }
  }
]

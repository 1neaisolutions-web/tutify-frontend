/**
 * One `LearningHubSectionItem` per visible course card; all lessons/quiz/theme live in `personalizedMicroCourseContent`.
 * Add a new course by appending one object to this array (see `PersonalizedMicroCourseSectionItem` in `types.ts`).
 */
import type { PersonalizedMicroCourseSectionItem } from '../types'

export const personalizedMicroCoursesData: PersonalizedMicroCourseSectionItem[] = [
  {
    id: 'pmc-1',
    slug: 'classroom-management-essentials',
    title: 'Quick wins: Classroom management essentials',
    subtitle: 'Classroom management',
    duration: '8 min',
    difficulty: 'Beginner',
    ctaLabel: 'Start',
    sectionKey: 'personalized-micro-courses',
    personalizedMicroCourseContent: {
      description:
        'Master the fundamentals of effective classroom management with evidence-based strategies you can implement immediately.',
      learningObjectives: [
        'Establish clear expectations and routines from day one',
        'Use positive reinforcement to build a supportive classroom culture',
        'Implement proactive strategies to prevent disruptions',
        'Respond effectively to challenging behaviors',
      ],
      lessons: [
        {
          id: 1,
          title: 'Setting the Foundation: Clear Expectations',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Why Clear Expectations Matter',
              paragraphs: [
                'Research shows that students perform better when they understand exactly what is expected of them. Clear expectations reduce anxiety, increase engagement, and create a predictable learning environment.',
                "Effective teachers establish expectations early and reinforce them consistently. This isn't about being strict-it's about creating a safe, structured space where learning can thrive.",
              ],
            },
            {
              type: 'text',
              heading: 'The 3-Step Framework',
              paragraphs: [
                '1. Define: Clearly state what you expect in specific, observable terms. Instead of "be respectful," say "listen when others are speaking and raise your hand to contribute."',
                '2. Model: Show students exactly what the expectation looks like in action. Demonstrate both the correct and incorrect behaviors.',
                '3. Practice: Give students opportunities to practice meeting expectations, especially during the first weeks of school.',
              ],
            },
            {
              type: 'interactive',
              title: 'Quick Reflection',
              prompt: 'Think about your current classroom expectations. Are they specific and observable?',
              tips: [
                'Use action verbs: "raise your hand" instead of "be polite"',
                'Make expectations measurable: "complete 3 problems" instead of "do your best"',
                'Keep the list short: 3-5 core expectations work better than 20 rules',
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'Building Positive Relationships',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'The Relationship-Responsibility Connection',
              paragraphs: [
                "Students are more likely to follow expectations when they feel valued and connected to their teacher. Positive relationships are the foundation of effective classroom management.",
                "This doesn't mean being a friend-it means showing genuine interest in students as individuals, acknowledging their strengths, and creating opportunities for connection.",
              ],
            },
            {
              type: 'text',
              heading: 'Daily Connection Strategies',
              paragraphs: [
                'Greet students at the door: A simple "Good morning, [name]" sets a positive tone and shows you notice each student.',
                'Use positive narration: Instead of "Stop talking," try "I see Sarah is ready with her materials. Thank you, Sarah."',
                '2x10 strategy: Spend 2 minutes per day for 10 days having a personal conversation with a challenging student about non-academic topics.',
                'Celebrate small wins: Notice and acknowledge when students meet expectations, even in small ways.',
              ],
            },
            {
              type: 'interactive',
              title: 'Connection Challenge',
              prompt: 'This week, try greeting every student by name at the door. Notice the difference it makes.',
              tips: [
                'Set a reminder on your phone for the first week',
                'If you have a large class, rotate which students you greet personally',
                'Track which students respond most positively to this approach',
              ],
            },
          ],
        },
        {
          id: 3,
          title: 'Proactive Prevention Strategies',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Prevention Beats Reaction',
              paragraphs: [
                'The best classroom management happens before problems occur. Proactive strategies anticipate challenges and address them before they escalate.',
                'Think of it like preventive medicine: addressing small issues early prevents major disruptions later.',
              ],
            },
            {
              type: 'text',
              heading: 'Key Proactive Techniques',
              paragraphs: [
                'Proximity control: Move around the room strategically. Your presence near off-task students often redirects behavior without words.',
                'Non-verbal cues: Develop a system of hand signals, eye contact, or gestures that communicate expectations silently.',
                'Smooth transitions: Plan transitions carefully. Unstructured time between activities invites misbehavior.',
                'Attention signals: Teach and practice a consistent way to get students\' attention (e.g., "Class, class" / "Yes, yes").',
                'Seating arrangements: Strategically place students who need more support near you or positive peer models.',
              ],
            },
            {
              type: 'interactive',
              title: 'Your Prevention Plan',
              prompt: 'Identify one transition time in your day that tends to be chaotic. Plan a specific routine for it.',
              tips: [
                'Write down the exact steps students should follow',
                'Practice the routine with students multiple times',
                'Use a timer to make transitions predictable',
                'Celebrate when transitions go smoothly',
              ],
            },
          ],
        },
        {
          id: 4,
          title: 'Responding to Challenges',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'The Escalation Ladder',
              paragraphs: [
                "When students don't meet expectations, respond in a way that maintains dignity and keeps the focus on learning. Start with the least intrusive intervention and escalate only if needed.",
                'The goal is to redirect behavior while preserving the relationship and minimizing disruption to other students.',
              ],
            },
            {
              type: 'text',
              heading: 'Response Strategies (Least to Most Intrusive)',
              paragraphs: [
                '1. Non-verbal: Eye contact, proximity, or a gesture',
                '2. Quiet verbal: A private word or whisper near the student',
                '3. Reminder: "Remember our expectation about..."',
                '4. Choice: "You can either [option A] or [option B]. Which do you choose?"',
                '5. Logical consequence: "Because you chose to [behavior], you need to [consequence]."',
                '6. Private conversation: Move to a private space to discuss the issue',
              ],
            },
            {
              type: 'text',
              heading: 'Key Principles',
              paragraphs: [
                'Stay calm: Your emotional regulation models the behavior you want to see.',
                'Be consistent: Apply consequences fairly and predictably.',
                'Focus on behavior, not character: "That choice was disruptive" not "You\'re disruptive."',
                'Preserve relationships: Every interaction should maintain or strengthen your connection with the student.',
              ],
            },
          ],
        },
      ],
      quizQuestions: [
        {
          id: 1,
          question: 'What is the most effective way to establish classroom expectations?',
          options: [
            'Post a long list of rules on the wall',
            'Define, model, and practice specific, observable behaviors',
            'Let students figure out expectations on their own',
            'Only mention expectations when students break them',
          ],
          correctAnswer: 1,
          explanation:
            'The Define-Model-Practice framework is research-backed and helps students understand exactly what is expected.',
        },
        {
          id: 2,
          question: 'Which strategy is most effective for preventing disruptions?',
          options: [
            'Reacting quickly to every misbehavior',
            'Using proximity control and smooth transitions',
            'Ignoring minor disruptions',
            'Threatening consequences frequently',
          ],
          correctAnswer: 1,
          explanation:
            'Proactive strategies like proximity control and well-planned transitions prevent problems before they start.',
        },
        {
          id: 3,
          question: 'When responding to challenging behavior, you should:',
          options: [
            'Start with the most severe consequence',
            'Escalate from least to most intrusive interventions',
            'Ignore it and hope it stops',
            'Call parents immediately',
          ],
          correctAnswer: 1,
          explanation:
            'Starting with the least intrusive intervention preserves relationships and often resolves issues without escalation.',
        },
        {
          id: 4,
          question: 'The 2x10 strategy involves:',
          options: [
            'Spending 2 hours with 10 students',
            'Spending 2 minutes per day for 10 days connecting with a challenging student',
            'Giving 2 warnings before 10 consequences',
            'Meeting with 10 parents in 2 days',
          ],
          correctAnswer: 1,
          explanation: 'The 2x10 strategy builds relationships through brief, consistent personal connections.',
        },
      ],
      quizSubtitle: 'Test your understanding of classroom management essentials',
      passingScorePercent: 70,
      successMessage: "You've demonstrated a strong understanding of classroom management essentials!",
      themeId: 'pmc-amber-warm',
    },
  },
  {
    id: 'pmc-2',
    slug: 'formative-assessment-strategies',
    title: 'Formative assessment strategies that work',
    subtitle: 'Assessment strategies',
    duration: '6 min',
    difficulty: 'Intermediate',
    ctaLabel: 'Continue',
    sectionKey: 'personalized-micro-courses',
    personalizedMicroCourseContent: {
      description:
        'Learn evidence-based formative assessment techniques that provide real-time insights into student learning and guide your instruction.',
      learningObjectives: [
        'Implement quick-check strategies to gauge student understanding',
        'Use exit tickets and peer assessment effectively',
        'Provide actionable feedback that moves learning forward',
        'Create a culture of continuous improvement through assessment',
      ],
      lessons: [
        {
          id: 1,
          title: 'The Power of Formative Assessment',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Why Formative Assessment Matters',
              paragraphs: [
                'Formative assessment is the process of gathering evidence about student learning during instruction to inform teaching decisions. Unlike summative assessments that evaluate learning at the end, formative assessments help you adjust your teaching in real-time.',
                'Research by Black & Wiliam shows that formative assessment can significantly improve student achievement, with effect sizes of 0.4 to 0.7-among the highest of any teaching strategy.',
              ],
            },
            {
              type: 'text',
              heading: 'Key Characteristics',
              paragraphs: [
                "Low-stakes: Students aren't graded, reducing anxiety and encouraging risk-taking",
                'Frequent: Conducted regularly throughout instruction, not just at unit end',
                'Actionable: Provides specific information you can use immediately to adjust teaching',
                'Student-focused: Helps students understand their own learning progress',
              ],
            },
            {
              type: 'interactive',
              title: 'Reflection',
              prompt: 'Think about your current assessment practices. How often do you check for understanding during a lesson?',
              tips: [
                'Aim for 3-5 check-ins per lesson',
                'Use a variety of methods to avoid monotony',
                "Make it quick-formative assessment shouldn't take more than 2-3 minutes",
                'Focus on one key concept or skill per check',
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'Quick-Check Strategies',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Thumbs Up, Down, Sideways',
              paragraphs: [
                "A simple, non-verbal way to check understanding. Ask students to show thumbs up (I understand), thumbs down (I need help), or thumbs sideways (I'm getting there).",
                "This strategy works best when you've established a safe classroom culture where students feel comfortable showing they don't understand.",
              ],
            },
            {
              type: 'text',
              heading: 'Traffic Light Cards',
              paragraphs: [
                `Give students red, yellow, and green cards. Red means "I'm stuck," yellow means "I'm working on it," green means "I've got it."`,
                'Students hold up the card that matches their understanding. This gives you an instant visual of where the class stands.',
              ],
            },
            {
              type: 'text',
              heading: 'One-Minute Papers',
              paragraphs: [
                `At the end of a lesson segment, ask students to write for one minute answering: "What was the most important thing you learned?" or "What question do you still have?"`,
                'Collect and quickly scan responses to identify common misconceptions or areas needing clarification.',
              ],
            },
            {
              type: 'interactive',
              title: 'Try It This Week',
              prompt: "Choose one quick-check strategy to implement in your next lesson. Plan when and how you'll use it.",
              tips: [
                'Start with one strategy and master it before adding more',
                "Explain the purpose to students so they understand why you're checking",
                'Use the information you gather to adjust your teaching immediately',
                'Track which strategies work best for different types of content',
              ],
            },
          ],
        },
        {
          id: 3,
          title: 'Exit Tickets & Peer Assessment',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Effective Exit Tickets',
              paragraphs: [
                'Exit tickets are brief assessments given at the end of class. They should take 2-3 minutes and focus on one key question or concept.',
                `Effective exit ticket prompts include: "What was the main idea of today's lesson?" "What's one thing you're still confused about?" "How confident do you feel about [skill]?"`,
              ],
            },
            {
              type: 'text',
              heading: 'Peer Assessment Benefits',
              paragraphs: [
                "Peer assessment helps students develop critical thinking and self-reflection skills. When students evaluate each other's work, they learn to identify quality and apply criteria.",
                'Start with simple rubrics or checklists. Model the process first, then gradually release responsibility to students.',
              ],
            },
            {
              type: 'text',
              heading: 'Structured Peer Feedback',
              paragraphs: [
                'Use the "Two Stars and a Wish" framework: Students identify two strengths and one area for improvement.',
                'Or try "I like, I wonder, I suggest": Students share what they like, what they wonder about, and what they suggest.',
              ],
            },
            {
              type: 'interactive',
              title: 'Design Your Exit Ticket',
              prompt: 'Create an exit ticket prompt for your next lesson. Make it specific and actionable.',
              tips: [
                'Keep it to one question or concept',
                'Make it quick to complete (2-3 minutes)',
                'Ensure you can review responses quickly',
                'Use the responses to plan your next lesson',
              ],
            },
          ],
        },
      ],
      quizQuestions: [
        {
          id: 1,
          question: 'What is the primary purpose of formative assessment?',
          options: [
            'To assign grades to students',
            'To evaluate learning at the end of a unit',
            'To gather evidence during instruction to inform teaching decisions',
            'To compare students to each other',
          ],
          correctAnswer: 2,
          explanation:
            'Formative assessment is used during instruction to gather evidence about student learning and adjust teaching accordingly.',
        },
        {
          id: 2,
          question: 'Which quick-check strategy provides an instant visual of class understanding?',
          options: ['Written essays', 'Traffic light cards', 'Multiple choice tests', 'Oral presentations'],
          correctAnswer: 1,
          explanation:
            'Traffic light cards allow students to quickly show their understanding level, giving teachers an immediate visual of where the class stands.',
        },
        {
          id: 3,
          question: 'Effective exit tickets should:',
          options: [
            'Take 15-20 minutes to complete',
            'Focus on multiple concepts',
            'Take 2-3 minutes and focus on one key question',
            'Be graded for accuracy',
          ],
          correctAnswer: 2,
          explanation:
            'Exit tickets should be brief (2-3 minutes) and focus on one key concept or question to provide quick, actionable feedback.',
        },
        {
          id: 4,
          question: 'What is a key benefit of peer assessment?',
          options: [
            'It reduces teacher workload',
            'It helps students develop critical thinking and self-reflection skills',
            'It eliminates the need for teacher feedback',
            'It ensures all students get the same grade',
          ],
          correctAnswer: 1,
          explanation:
            'Peer assessment helps students develop critical thinking skills as they learn to identify quality and apply criteria to evaluate work.',
        },
      ],
      quizSubtitle: 'Test your understanding of formative assessment strategies',
      passingScorePercent: 70,
      successMessage: "You've demonstrated a strong understanding of formative assessment strategies!",
      themeId: 'pmc-blue-assessment',
    },
  },
  {
    id: 'pmc-3',
    slug: 'differentiation-made-simple',
    title: 'Differentiation made simple',
    subtitle: 'Differentiation',
    duration: '10 min',
    difficulty: 'Beginner',
    ctaLabel: 'Continue',
    sectionKey: 'personalized-micro-courses',
    personalizedMicroCourseContent: {
      description:
        'Learn practical strategies to meet the diverse needs of all learners in your classroom without overwhelming yourself or your students.',
      learningObjectives: [
        'Understand the three dimensions of differentiation: content, process, and product',
        'Implement tiered assignments that challenge all students appropriately',
        'Use flexible grouping strategies effectively',
        'Create a differentiated lesson plan you can use immediately',
      ],
      lessons: [
        {
          id: 1,
          title: 'What is Differentiation?',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Differentiation Defined',
              paragraphs: [
                "Differentiation is the process of tailoring instruction to meet individual student needs. It's not about creating 30 different lesson plans-it's about providing multiple pathways for students to access, engage with, and demonstrate learning.",
                `Carol Ann Tomlinson, a leading expert in differentiation, defines it as "a teacher's proactive response to learner needs shaped by mindset and guided by general principles."`,
              ],
            },
            {
              type: 'text',
              heading: 'The Three Dimensions',
              paragraphs: [
                'Content: What students learn (the curriculum, concepts, skills)',
                'Process: How students learn (activities, strategies, methods)',
                'Product: How students demonstrate learning (assessments, projects, presentations)',
                "You don't need to differentiate all three dimensions in every lesson. Start with one and build from there.",
              ],
            },
            {
              type: 'interactive',
              title: 'Reflection',
              prompt: 'Think about your current teaching. Which dimension do you already differentiate? Which could you improve?',
              tips: [
                'Most teachers naturally differentiate process through varied activities',
                'Content differentiation often requires the most planning',
                'Product differentiation can be the easiest to implement',
                'Start small-choose one lesson per week to differentiate',
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'Content Differentiation',
          duration: '3 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Tiered Assignments',
              paragraphs: [
                'Tiered assignments provide the same learning objective but at different levels of complexity. All students work toward the same goal, but the path varies.',
                'Example: In a math lesson on fractions, tier 1 students might work with visual models, tier 2 students solve word problems, and tier 3 students create their own problems.',
              ],
            },
            {
              type: 'text',
              heading: 'Learning Contracts',
              paragraphs: [
                "Learning contracts give students choice in what they learn and how they demonstrate understanding. They're especially effective for advanced learners who need more challenge.",
                'A contract might include: required tasks, choice tasks, and extension activities. Students work at their own pace within set parameters.',
              ],
            },
            {
              type: 'text',
              heading: 'Compacting',
              paragraphs: [
                'Compacting allows students who have already mastered content to skip ahead. Pre-assess students, then provide alternative activities for those who demonstrate mastery.',
                'This prevents boredom and allows you to focus instruction on students who need it most.',
              ],
            },
            {
              type: 'interactive',
              title: 'Plan Your Tiered Assignment',
              prompt: 'Choose an upcoming lesson and plan three tiers for the same learning objective.',
              tips: [
                'Keep the learning objective the same for all tiers',
                'Vary complexity, not just quantity',
                'Ensure all tiers are equally engaging',
                'Use clear labels: "Foundation," "Standard," "Challenge"',
              ],
            },
          ],
        },
        {
          id: 3,
          title: 'Process Differentiation',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Flexible Grouping',
              paragraphs: [
                'Flexible grouping means students work in different groups for different purposes. Groups change based on the task, not fixed ability levels.',
                'Types of groups: whole class, small groups, pairs, individual work. Mix it up throughout a lesson to meet various needs.',
              ],
            },
            {
              type: 'text',
              heading: 'Learning Stations',
              paragraphs: [
                'Learning stations allow students to engage with content in different ways. Set up 3-4 stations with varied activities: hands-on, reading, technology, discussion.',
                'Students rotate through stations, spending time at each based on their needs and interests.',
              ],
            },
            {
              type: 'text',
              heading: 'Scaffolding Strategies',
              paragraphs: [
                'Provide different levels of support: graphic organizers, sentence starters, checklists, or peer partners.',
                'Gradually remove scaffolds as students become more independent. The goal is to support, not enable dependency.',
              ],
            },
            {
              type: 'interactive',
              title: 'Design Learning Stations',
              prompt: 'Plan 3-4 learning stations for an upcoming lesson, each offering a different way to engage with the content.',
              tips: [
                'Include at least one hands-on station',
                'Vary the learning modalities (visual, auditory, kinesthetic)',
                'Make stations self-explanatory with clear directions',
                'Plan for 10-15 minutes per station',
              ],
            },
          ],
        },
        {
          id: 4,
          title: 'Product Differentiation',
          duration: '3 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Choice Boards',
              paragraphs: [
                'Choice boards (also called menus) give students options for how they demonstrate learning. Create a 3x3 grid with 9 different product options.',
                'Example options: write a story, create a video, design a poster, give a presentation, write a song, create a model, etc.',
              ],
            },
            {
              type: 'text',
              heading: 'Rubrics for All Products',
              paragraphs: [
                'Create rubrics that focus on learning objectives, not the product type. A rubric for "demonstrating understanding of the water cycle" works whether students write, draw, or build.',
                'Focus on: accuracy of content, depth of understanding, creativity, and effort.',
              ],
            },
            {
              type: 'text',
              heading: 'Multiple Intelligences',
              paragraphs: [
                "Consider Howard Gardner's multiple intelligences when designing product options: linguistic, logical-mathematical, spatial, bodily-kinesthetic, musical, interpersonal, intrapersonal, naturalistic.",
                'Offering varied product options allows students to use their strengths while still demonstrating mastery of learning objectives.',
              ],
            },
            {
              type: 'interactive',
              title: 'Create a Choice Board',
              prompt:
                'Design a choice board with 6-9 options for an upcoming assessment. Ensure all options assess the same learning objective.',
              tips: [
                'Include options for different learning styles',
                'Make sure all options are equally rigorous',
                'Provide clear expectations for each option',
                'Consider your available resources and time',
              ],
            },
          ],
        },
      ],
      quizQuestions: [
        {
          id: 1,
          question: 'What are the three dimensions of differentiation?',
          options: ['Reading, writing, and math', 'Content, process, and product', 'Beginning, middle, and end', 'Easy, medium, and hard'],
          correctAnswer: 1,
          explanation:
            'Differentiation occurs in three dimensions: content (what students learn), process (how they learn), and product (how they demonstrate learning).',
        },
        {
          id: 2,
          question: 'What is a tiered assignment?',
          options: [
            'Assignments given at different times',
            'Assignments with the same learning objective but different complexity levels',
            'Assignments for different subjects',
            'Assignments completed in groups',
          ],
          correctAnswer: 1,
          explanation:
            'Tiered assignments provide the same learning objective but at different levels of complexity, allowing all students to work toward the same goal at an appropriate level.',
        },
        {
          id: 3,
          question: 'What is flexible grouping?',
          options: ['Groups that never change', 'Groups based only on ability level', 'Groups that change based on the task and student needs', 'Groups chosen by students only'],
          correctAnswer: 2,
          explanation:
            'Flexible grouping means students work in different groups for different purposes, with groups changing based on the task rather than fixed ability levels.',
        },
        {
          id: 4,
          question: 'What is a key principle of product differentiation?',
          options: [
            'All students must create the same product',
            'Products should focus on learning objectives, not product type',
            'Only advanced students get choice',
            "Products don't need rubrics",
          ],
          correctAnswer: 1,
          explanation:
            'Product differentiation should focus on learning objectives rather than product type. Rubrics should assess understanding regardless of how students demonstrate it.',
        },
      ],
      quizSubtitle: 'Test your understanding of differentiation strategies',
      passingScorePercent: 70,
      successMessage: "You've demonstrated a strong understanding of differentiation strategies!",
      themeId: 'pmc-green-differentiation',
    },
  },
  {
    id: 'pmc-4',
    slug: 'engaging-reluctant-learners',
    title: 'Engaging reluctant learners',
    subtitle: 'Student engagement',
    duration: '7 min',
    difficulty: 'Intermediate',
    ctaLabel: 'Start',
    sectionKey: 'personalized-micro-courses',
    personalizedMicroCourseContent: {
      description:
        'Discover practical strategies to motivate and engage students who seem disconnected, uninterested, or resistant to learning.',
      learningObjectives: [
        'Understand why students become reluctant learners',
        "Build relevance and connect learning to students' interests",
        'Use choice and autonomy to increase motivation',
        'Create a classroom culture that supports engagement',
      ],
      lessons: [
        {
          id: 1,
          title: 'Understanding Reluctant Learners',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Why Students Disengage',
              paragraphs: [
                "Reluctant learners aren't lazy-they're often responding to past failures, lack of relevance, or feeling disconnected from the content. Understanding the root causes helps you address them effectively.",
                'Common reasons include: fear of failure, lack of relevance, feeling overwhelmed, learning differences not being addressed, or negative past experiences with school.',
              ],
            },
            {
              type: 'text',
              heading: 'The Engagement Spectrum',
              paragraphs: [
                "Students exist on a spectrum: highly engaged, moderately engaged, situationally engaged, and disengaged. Your goal isn't to get every student to love every lesson-it's to move them along the spectrum.",
                'Even small shifts matter. A disengaged student who becomes situationally engaged is progress. Celebrate incremental improvements.',
              ],
            },
            {
              type: 'interactive',
              title: 'Reflection',
              prompt:
                'Think about your reluctant learners. What patterns do you notice? What might be underlying their disengagement?',
              tips: [
                'Look beyond surface behaviors to underlying causes',
                'Consider academic, social, and emotional factors',
                'Talk to students individually to understand their perspective',
                'Remember: behavior is communication',
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'Building Relevance',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Connect to Real Life',
              paragraphs: [
                'Students engage when they see how content connects to their lives, interests, or future goals. Start lessons with real-world connections, not abstract concepts.',
                `Example: Instead of "Today we're learning about percentages," try "Today we're learning how to calculate discounts-something you'll use every time you shop."`,
              ],
            },
            {
              type: 'text',
              heading: 'Use Student Interests',
              paragraphs: [
                'Survey students about their interests, hobbies, and goals. Then weave these into your lessons. A student who loves video games might engage more if you frame math problems around game mechanics.',
                'Create interest inventories at the start of the year and refer back to them when planning lessons.',
              ],
            },
            {
              type: 'text',
              heading: 'Show the "Why"',
              paragraphs: [
                'Explain not just what students are learning, but why it matters. Help them see the bigger picture and how skills build on each other.',
                `Use phrases like "This skill will help you..." or "You'll need this when..." to make purpose clear.`,
              ],
            },
            {
              type: 'interactive',
              title: 'Make It Relevant',
              prompt:
                "Choose an upcoming lesson and identify 2-3 ways to connect it to students' real lives or interests.",
              tips: [
                'Start with student interests from your inventory',
                'Think about real-world applications',
                'Consider future career connections',
                'Ask students how they might use this knowledge',
              ],
            },
          ],
        },
        {
          id: 3,
          title: 'Choice and Autonomy',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'The Power of Choice',
              paragraphs: [
                'When students have choices, they feel more ownership and control. This increases motivation and engagement, especially for reluctant learners.',
                'Offer choices in: what to learn (within parameters), how to learn (reading, watching, doing), how to demonstrate learning (product options), and when to work (within deadlines).',
              ],
            },
            {
              type: 'text',
              heading: 'Structured Choices',
              paragraphs: [
                `Choices don't mean chaos. Provide 2-3 options, all of which meet your learning objectives. This gives autonomy while maintaining focus.`,
                `Example: "You can write an essay, create a video, or design a poster-all need to explain the water cycle."`,
              ],
            },
            {
              type: 'text',
              heading: 'Gradual Release',
              paragraphs: [
                'Start with small choices and gradually increase autonomy. Begin with "choose your seat" or "choose your partner," then move to academic choices.',
                'As students demonstrate responsibility, offer more complex choices. This builds trust and capability.',
              ],
            },
            {
              type: 'interactive',
              title: 'Design Choices',
              prompt:
                'Plan a lesson with structured choices. What options will you offer for how students engage with or demonstrate learning?',
              tips: [
                'Ensure all choices meet the same learning objective',
                'Start with 2-3 options to avoid overwhelm',
                'Make choices equally rigorous',
                'Provide clear expectations for each option',
              ],
            },
          ],
        },
        {
          id: 4,
          title: 'Creating an Engaging Culture',
          duration: '1 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Safe to Try',
              paragraphs: [
                'Reluctant learners need to feel safe to take risks. Create a classroom where mistakes are learning opportunities, not failures.',
                'Model risk-taking yourself. Share your own mistakes and what you learned. Celebrate effort, not just achievement.',
              ],
            },
            {
              type: 'text',
              heading: 'Quick Wins',
              paragraphs: [
                'Help reluctant learners experience success early and often. Start with tasks they can complete successfully, then gradually increase challenge.',
                'Break large tasks into smaller steps. Celebrate each step completed. Success breeds motivation.',
              ],
            },
            {
              type: 'interactive',
              title: 'Your Engagement Plan',
              prompt:
                'Identify one reluctant learner and create a plan to increase their engagement using strategies from this course.',
              tips: [
                'Start with building relationship and understanding',
                'Find ways to connect content to their interests',
                'Offer choices to increase autonomy',
                'Create opportunities for quick wins',
                'Be patient-engagement takes time',
              ],
            },
          ],
        },
      ],
      quizQuestions: [
        {
          id: 1,
          question: 'What is a common reason students become reluctant learners?',
          options: ["They are naturally lazy", "They don't like school", 'Fear of failure or lack of relevance', 'They prefer to be at home'],
          correctAnswer: 2,
          explanation:
            'Reluctant learners often disengage due to fear of failure, lack of relevance, feeling overwhelmed, or negative past experiences-not laziness.',
        },
        {
          id: 2,
          question: 'How can you build relevance in your lessons?',
          options: [
            'Only teach abstract concepts',
            "Connect content to students' real lives and interests",
            'Avoid mentioning real-world applications',
            'Focus only on test preparation',
          ],
          correctAnswer: 1,
          explanation:
            "Building relevance means connecting content to students' real lives, interests, and future goals to show why learning matters.",
        },
        {
          id: 3,
          question: 'What is the benefit of offering students choices?',
          options: [
            'It reduces teacher workload',
            'It increases student ownership, control, and motivation',
            'It eliminates the need for planning',
            'It ensures all students do the same work',
          ],
          correctAnswer: 1,
          explanation:
            'When students have choices, they feel more ownership and control, which increases motivation and engagement.',
        },
        {
          id: 4,
          question: 'How can you help reluctant learners experience success?',
          options: [
            'Give them easier work permanently',
            'Start with tasks they can complete successfully, then gradually increase challenge',
            'Ignore their struggles',
            'Compare them to other students',
          ],
          correctAnswer: 1,
          explanation:
            'Help reluctant learners experience success by starting with achievable tasks and gradually increasing challenge, celebrating each step.',
        },
      ],
      quizSubtitle: 'Test your understanding of student engagement strategies',
      passingScorePercent: 70,
      successMessage: "You've demonstrated a strong understanding of student engagement strategies!",
      themeId: 'pmc-purple-engagement',
    },
  },
  {
    id: 'pmc-5',
    slug: 'ai-tools-for-lesson-planning',
    title: 'AI tools for lesson planning',
    subtitle: 'Digital literacy & AI readiness',
    duration: '9 min',
    difficulty: 'Advanced',
    ctaLabel: 'Start',
    sectionKey: 'personalized-micro-courses',
    personalizedMicroCourseContent: {
      description:
        'Master AI-powered tools to streamline lesson planning, create engaging content, and personalize instruction while maintaining pedagogical integrity.',
      learningObjectives: [
        'Select appropriate AI tools for different lesson planning tasks',
        'Write effective prompts that generate high-quality educational content',
        'Integrate AI tools into your lesson planning workflow efficiently',
        'Use AI ethically and maintain teacher judgment in content creation',
      ],
      lessons: [
        {
          id: 1,
          title: 'Introduction to AI in Education',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'The AI Revolution in Teaching',
              paragraphs: [
                'AI tools can help teachers save time on routine tasks like generating lesson plans, creating assessments, and developing differentiated activities. However, AI is a tool, not a replacement for teacher expertise.',
                'Effective use of AI requires understanding what it can and cannot do, maintaining pedagogical judgment, and using it to enhance rather than replace your professional skills.',
              ],
            },
            {
              type: 'text',
              heading: 'What AI Can Do',
              paragraphs: [
                'Generate lesson plan templates and outlines',
                'Create differentiated activities and assessments',
                'Suggest learning objectives aligned to standards',
                'Generate discussion questions and prompts',
                'Provide ideas for engaging activities',
              ],
            },
            {
              type: 'text',
              heading: 'What AI Cannot Do',
              paragraphs: [
                "Understand your specific students' needs and contexts",
                'Replace your pedagogical expertise and judgment',
                "Know your school's culture and community",
                "Make decisions about what's developmentally appropriate",
                'Build relationships with students',
              ],
            },
            {
              type: 'interactive',
              title: 'Reflection',
              prompt: 'Think about your current lesson planning process. Which tasks take the most time? How might AI help?',
              tips: [
                'Identify repetitive tasks that could be streamlined',
                'Consider where AI-generated ideas could spark creativity',
                'Think about tasks that require your unique expertise',
                'Remember: AI enhances, not replaces, your skills',
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'Selecting the Right AI Tools',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'Popular AI Tools for Teachers',
              paragraphs: [
                'ChatGPT/Claude: General-purpose AI assistants for generating content, brainstorming, and answering questions',
                'Curipod: AI-powered interactive presentations and lessons',
                'Diffit: Creates differentiated reading materials',
                'MagicSchool: Suite of AI tools specifically for teachers',
                'Canva AI: Generates images and designs for lessons',
              ],
            },
            {
              type: 'text',
              heading: 'Choosing the Right Tool',
              paragraphs: [
                'Consider your specific need: Are you planning a lesson, creating assessments, or generating activities?',
                'Evaluate output quality: Test tools with sample prompts to see if they meet your standards',
                'Check privacy and data policies: Ensure student data is protected',
                'Consider cost: Some tools are free, others require subscriptions',
              ],
            },
            {
              type: 'interactive',
              title: 'Tool Selection',
              prompt: `Identify one AI tool you'd like to try. What specific task will you use it for?`,
              tips: [
                'Start with one tool and master it before adding more',
                'Choose a tool that addresses a specific pain point',
                'Test it with a simple task first',
                'Evaluate if it actually saves time and improves quality',
              ],
            },
          ],
        },
        {
          id: 3,
          title: 'Mastering Prompt Engineering',
          duration: '3 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'The Art of Prompting',
              paragraphs: [
                'Effective prompts are specific, contextual, and include clear instructions. The better your prompt, the better the AI output.',
                'A good prompt includes: context (grade level, subject), specific requirements (learning objectives, standards), format preferences, and constraints (time, resources).',
              ],
            },
            {
              type: 'text',
              heading: 'Prompt Structure',
              paragraphs: [
                'Role: "You are an experienced [grade] [subject] teacher..."',
                'Task: "Create a lesson plan for..."',
                'Context: "My students are [description]..."',
                'Requirements: "Include [specific elements]..."',
                'Format: "Present it as [format]..."',
              ],
            },
            {
              type: 'text',
              heading: 'Example Prompt',
              paragraphs: [
                'You are an experienced 5th-grade science teacher. Create a 45-minute lesson plan on the water cycle for students who are visual and kinesthetic learners. Include: learning objectives aligned to NGSS, a hands-on activity, formative assessment, and differentiation for struggling learners. Present it as a step-by-step guide with time allocations.',
              ],
            },
            {
              type: 'interactive',
              title: 'Write Your Prompt',
              prompt:
                'Write a detailed prompt for an AI tool to help with an upcoming lesson. Include role, task, context, requirements, and format.',
              tips: [
                'Be specific about grade level and subject',
                'Include information about your students',
                'Specify learning objectives or standards',
                'Request the format you prefer',
                "Ask for revisions if the output doesn't meet your needs",
              ],
            },
          ],
        },
        {
          id: 4,
          title: 'Integrating AI into Your Workflow',
          duration: '2 min',
          contentBlocks: [
            {
              type: 'text',
              heading: 'A Practical Workflow',
              paragraphs: [
                '1. Start with your learning objectives and standards',
                '2. Use AI to generate initial ideas and structures',
                '3. Review and refine AI output with your expertise',
                '4. Personalize for your specific students and context',
                '5. Add your own creative touches and modifications',
              ],
            },
            {
              type: 'text',
              heading: 'Maintaining Quality',
              paragraphs: [
                'Always review AI-generated content for accuracy, appropriateness, and alignment with your goals',
                "Customize AI output to fit your teaching style and students' needs",
                'Use AI as a starting point, not a final product',
                'Combine AI efficiency with your professional judgment',
              ],
            },
            {
              type: 'text',
              heading: 'Ethical Considerations',
              paragraphs: [
                'Protect student privacy: Never input student names or personal information',
                'Maintain academic integrity: Use AI to enhance your work, not replace your thinking',
                'Be transparent: If required by your school, disclose AI use',
                'Stay informed: AI tools and policies evolve rapidly',
              ],
            },
            {
              type: 'interactive',
              title: 'Your AI Workflow',
              prompt: 'Design your own workflow for integrating AI into lesson planning. What steps will you follow?',
              tips: [
                'Start with clear learning objectives',
                'Use AI for ideation and structure',
                'Always review and refine output',
                'Personalize for your students',
                'Maintain your professional judgment',
              ],
            },
          ],
        },
      ],
      quizQuestions: [
        {
          id: 1,
          question: 'What is the primary role of AI in lesson planning?',
          options: [
            'To replace teachers',
            'To enhance teacher efficiency while maintaining professional judgment',
            'To eliminate the need for planning',
            'To make all lessons identical',
          ],
          correctAnswer: 1,
          explanation:
            'AI should enhance teacher efficiency and creativity while teachers maintain their professional judgment and expertise.',
        },
        {
          id: 2,
          question: 'What should an effective AI prompt include?',
          options: ['Only the topic', 'Context, specific requirements, format preferences, and constraints', 'Just the grade level', 'A single sentence'],
          correctAnswer: 1,
          explanation:
            'Effective prompts include context (grade level, subject), specific requirements, format preferences, and constraints to generate high-quality output.',
        },
        {
          id: 3,
          question: 'What is a key ethical consideration when using AI?',
          options: [
            'Never use AI at all',
            'Protect student privacy and maintain academic integrity',
            'Use AI for everything',
            'Share all AI outputs publicly',
          ],
          correctAnswer: 1,
          explanation:
            'Key ethical considerations include protecting student privacy, maintaining academic integrity, and being transparent about AI use when required.',
        },
        {
          id: 4,
          question: 'How should you use AI-generated content?',
          options: ['Use it exactly as generated', 'As a starting point that you review, refine, and personalize', 'Only for assessments', 'Never review it'],
          correctAnswer: 1,
          explanation:
            'AI-generated content should be used as a starting point that you review, refine, and personalize with your expertise and knowledge of your students.',
        },
      ],
      quizSubtitle: 'Test your understanding of AI tools for lesson planning',
      passingScorePercent: 70,
      successMessage: "You've demonstrated a strong understanding of AI tools for lesson planning!",
      themeId: 'pmc-indigo-digital',
    },
  },
  {
    "id": "pmc-6",
    "slug": "student-motivation-strategies",
    "title": "Student Motivation Strategies",
    "subtitle": "Engagement & mindset",
    "duration": "10 min",
    "difficulty": "Intermediate",
    "ctaLabel": "Start",
    "sectionKey": "personalized-micro-courses",
    "personalizedMicroCourseContent": {
      "description": "Learn how to increase student motivation using practical classroom strategies, mindset shifts, and engagement techniques.",
      "learningObjectives": [
        "Understand key drivers of student motivation",
        "Apply strategies to increase engagement",
        "Use feedback and rewards effectively",
        "Build intrinsic motivation in students"
      ],
      "lessons": [
        {
          "id": 1,
          "title": "Understanding Student Motivation",
          "duration": "2 min",
          "contentBlocks": [
            {
              "type": "text",
              "heading": "What Drives Motivation?",
              "paragraphs": [
                "Students are motivated by autonomy, mastery, and purpose.",
                "Extrinsic rewards can help, but intrinsic motivation leads to deeper learning.",
                "Understanding what drives your students is the first step to improving engagement."
              ]
            },
            {
              "type": "text",
              "heading": "Types of Motivation",
              "paragraphs": [
                "Intrinsic motivation: Learning for interest or enjoyment",
                "Extrinsic motivation: Learning for rewards or grades",
                "Both types play a role in the classroom"
              ]
            },
            {
              "type": "interactive",
              "title": "Reflection",
              "prompt": "Think about one student who seems disengaged. What might be affecting their motivation?",
              "tips": [
                "Consider their interests",
                "Think about difficulty level of tasks",
                "Reflect on classroom environment",
                "Look at feedback patterns"
              ]
            }
          ]
        },
        {
          "id": 2,
          "title": "Building Engagement in Lessons",
          "duration": "3 min",
          "contentBlocks": [
            {
              "type": "text",
              "heading": "Active Engagement Strategies",
              "paragraphs": [
                "Use interactive activities instead of long lectures.",
                "Incorporate discussions, group work, and hands-on tasks.",
                "Make lessons relevant to real-world situations."
              ]
            },
            {
              "type": "text",
              "heading": "Choice and Voice",
              "paragraphs": [
                "Giving students choices increases ownership.",
                "Allow different ways to complete tasks.",
                "Encourage student input in learning activities."
              ]
            },
            {
              "type": "interactive",
              "title": "Lesson Redesign",
              "prompt": "Pick one of your lessons and add one engagement strategy.",
              "tips": [
                "Add a discussion component",
                "Include student choice",
                "Make it more interactive",
                "Connect to real-life context"
              ]
            }
          ]
        },
        {
          "id": 3,
          "title": "Using Feedback to Motivate",
          "duration": "3 min",
          "contentBlocks": [
            {
              "type": "text",
              "heading": "Effective Feedback",
              "paragraphs": [
                "Feedback should be specific, timely, and actionable.",
                "Focus on effort and improvement, not just results.",
                "Avoid generic praise like 'good job'."
              ]
            },
            {
              "type": "text",
              "heading": "Growth Mindset",
              "paragraphs": [
                "Encourage students to see mistakes as learning opportunities.",
                "Use language that promotes growth and effort.",
                "Help students track their own progress."
              ]
            },
            {
              "type": "interactive",
              "title": "Rewrite Feedback",
              "prompt": "Turn a generic comment into specific, motivating feedback.",
              "tips": [
                "Mention what was done well",
                "Suggest improvement steps",
                "Encourage effort",
                "Be clear and constructive"
              ]
            }
          ]
        },
        {
          "id": 4,
          "title": "Creating a Motivating Environment",
          "duration": "2 min",
          "contentBlocks": [
            {
              "type": "text",
              "heading": "Classroom Culture",
              "paragraphs": [
                "A positive environment increases motivation.",
                "Students should feel safe to participate and make mistakes.",
                "Respect and support are key."
              ]
            },
            {
              "type": "text",
              "heading": "Practical Strategies",
              "paragraphs": [
                "Celebrate small wins",
                "Set clear expectations",
                "Build relationships with students",
                "Encourage collaboration"
              ]
            },
            {
              "type": "interactive",
              "title": "Action Plan",
              "prompt": "What is one change you will make to improve classroom motivation?",
              "tips": [
                "Start small",
                "Focus on one strategy",
                "Observe results",
                "Adjust as needed"
              ]
            }
          ]
        }
      ],
      "quizQuestions": [
        {
          "id": 1,
          "question": "What is intrinsic motivation?",
          "options": [
            "Learning for rewards",
            "Learning for enjoyment or interest",
            "Learning for grades only",
            "Learning because of pressure"
          ],
          "correctAnswer": 1,
          "explanation": "Intrinsic motivation means learning because of internal interest or enjoyment."
        },
        {
          "id": 2,
          "question": "Which strategy increases student engagement?",
          "options": [
            "Long lectures only",
            "No interaction",
            "Active learning and discussions",
            "Silent reading only"
          ],
          "correctAnswer": 2,
          "explanation": "Active learning strategies like discussions and group work increase engagement."
        },
        {
          "id": 3,
          "question": "What makes feedback effective?",
          "options": [
            "Generic praise",
            "Delayed comments",
            "Specific and actionable guidance",
            "No feedback"
          ],
          "correctAnswer": 2,
          "explanation": "Effective feedback is specific, timely, and helps students improve."
        },
        {
          "id": 4,
          "question": "What is a key element of a motivating classroom?",
          "options": [
            "Strict silence",
            "Fear of mistakes",
            "Positive and supportive environment",
            "No interaction"
          ],
          "correctAnswer": 2,
          "explanation": "Students are more motivated in a supportive and positive environment."
        }
      ],
      "quizSubtitle": "Test your understanding of student motivation strategies",
      "passingScorePercent": 70,
      "successMessage": "Great job! You understand how to improve student motivation.",
      "themeId": "pmc-purple-engagement"
    }
  }
]


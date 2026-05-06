export interface TeachingStrategy {
  strategy: string
  effectSize: number
  category: 'High Impact' | 'Medium Impact' | 'Low Impact'
  description: string
  practicalApplications: string[]
  researchEvidence: string
}

export interface EvidenceBasedTeachingBody {
  sidebarNav: Array<{ id: string; label: string; icon: 'Eye' | 'TrendingUp' | 'BarChart3' | 'Target' | 'Zap' }>
  overview: {
    sectionTitle: string
    lead: string
    effectSizeExplainer: {
      title: string
      intro: string
      bands: Array<{ label: string; description: string; icon: 'up' | 'mid' | 'down' }>
    }
    keyFindings: string[]
  }
  sections: {
    highImpactTitle: string
    highImpactLead: string
    mediumImpactTitle: string
    mediumImpactLead: string
    lowImpactTitle: string
    lowImpactLead: string
  }
  implementation: {
    title: string
    lead: string
    principles: Array<{ title: string; body: string }>
    actionSteps: string[]
  }
  teachingStrategies: TeachingStrategy[]
}

export const evidenceBasedTeachingBody: EvidenceBasedTeachingBody = {
  sidebarNav: [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'high-impact', label: 'High Impact', icon: 'TrendingUp' },
    { id: 'medium-impact', label: 'Medium Impact', icon: 'BarChart3' },
    { id: 'low-impact', label: 'Low Impact', icon: 'Target' },
    { id: 'implementation', label: 'Implementation', icon: 'Zap' },
  ],
  overview: {
    sectionTitle: 'Understanding Effect Sizes',
    lead:
      "John Hattie's Visible Learning research synthesizes over 1,400 meta-analyses involving millions of students. Effect sizes help us understand which teaching strategies have the greatest impact on student learning.",
    effectSizeExplainer: {
      title: 'What is an Effect Size?',
      intro:
        'Effect size measures the magnitude of difference between two groups. In education, it compares students who received a particular intervention to those who did not.',
      bands: [
        { label: 'd ≥ 0.6', description: 'High Impact - Significant positive effect', icon: 'up' },
        { label: '0.4 ≤ d < 0.6', description: 'Medium Impact - Moderate positive effect', icon: 'mid' },
        { label: 'd < 0.4', description: 'Low Impact - Small or negative effect', icon: 'down' },
      ],
    },
    keyFindings: [
      'Most teaching strategies have a positive effect, but magnitude varies significantly',
      "Effect sizes above 0.6 represent a year's worth of growth in half a year",
      'Context matters - what works in one situation may not work in another',
      'Teacher expertise and implementation quality significantly influence outcomes',
    ],
  },
  sections: {
    highImpactTitle: 'High Impact Strategies (Effect Size ≥ 0.6)',
    highImpactLead:
      'These strategies have the strongest evidence for improving student learning outcomes. Focus your professional development and classroom practice on these high-leverage approaches.',
    mediumImpactTitle: 'Medium Impact Strategies (0.4 ≤ Effect Size < 0.6)',
    mediumImpactLead:
      'These strategies have moderate positive effects and can be valuable components of a comprehensive teaching approach.',
    lowImpactTitle: 'Low Impact Strategies (Effect Size < 0.4)',
    lowImpactLead:
      'These strategies show smaller effects but may still have value in specific contexts. Consider implementation carefully and monitor effectiveness.',
  },
  implementation: {
    title: 'Implementation Guide',
    lead:
      'Effect sizes tell us what works on average, but successful implementation requires careful consideration of your context.',
    principles: [
      {
        title: '1. Start with High-Impact Strategies',
        body:
          'Focus your energy on strategies with effect sizes above 0.6. These give you the biggest return on investment.',
      },
      {
        title: '2. Consider Your Context',
        body:
          'What works in one classroom may not work in another. Consider your students, subject, and school culture.',
      },
      {
        title: '3. Implement with Fidelity',
        body:
          'High-impact strategies require proper implementation. Invest in professional development and ongoing support.',
      },
      {
        title: '4. Monitor and Adjust',
        body: 'Collect data on student outcomes and adjust your approach based on what you observe.',
      },
      {
        title: '5. Build Collective Efficacy',
        body:
          'Work with colleagues to implement strategies together. Collective teacher efficacy has the highest effect size.',
      },
    ],
    actionSteps: [
      'Identify 2-3 high-impact strategies that align with your teaching context',
      'Learn about these strategies through professional development or research',
      'Start with one strategy and implement it consistently',
      'Collect evidence of impact through student work and assessments',
      'Share successes and challenges with colleagues',
    ],
  },
  teachingStrategies: [
    {
      strategy: 'Collective Teacher Efficacy',
      effectSize: 1.57,
      category: 'High Impact',
      description: 'The collective belief of teachers in their ability to positively affect students.',
      practicalApplications: [
        'Build collaborative planning time',
        'Share success stories and student growth data',
        'Create professional learning communities',
        'Celebrate team achievements',
      ],
      researchEvidence:
        'When teachers believe they can make a difference together, student achievement increases dramatically.',
    },
    {
      strategy: 'Self-Reported Grades',
      effectSize: 1.33,
      category: 'High Impact',
      description: 'Students predict their own performance before assessment.',
      practicalApplications: [
        'Have students predict test scores before taking tests',
        'Ask students to set learning goals',
        'Use self-assessment rubrics',
        'Encourage reflection on learning progress',
      ],
      researchEvidence:
        'Students are remarkably accurate at predicting their performance, and this metacognitive awareness drives improvement.',
    },
    {
      strategy: 'Teacher Credibility',
      effectSize: 1.09,
      category: 'High Impact',
      description: 'Students perceive teacher as trustworthy, competent, and caring.',
      practicalApplications: [
        'Be consistent and fair',
        'Demonstrate expertise in your subject',
        'Show genuine care for students',
        "Admit when you don't know something",
      ],
      researchEvidence: 'Students learn more from teachers they trust and respect.',
    },
    {
      strategy: 'Feedback',
      effectSize: 0.75,
      category: 'High Impact',
      description: 'Information provided to learners about their performance.',
      practicalApplications: [
        'Provide specific, actionable feedback',
        'Focus on the task, not the person',
        'Give feedback during learning, not just after',
        'Involve students in feedback processes',
      ],
      researchEvidence: 'Effective feedback can double the speed of learning when done correctly.',
    },
    {
      strategy: 'Metacognitive Strategies',
      effectSize: 0.69,
      category: 'High Impact',
      description: 'Teaching students to think about their own thinking.',
      practicalApplications: [
        'Teach students to plan, monitor, and evaluate their learning',
        'Use think-alouds to model thinking',
        'Encourage reflection journals',
        'Ask "How did you figure that out?" questions',
      ],
      researchEvidence: 'Students who understand how they learn become more effective learners.',
    },
    {
      strategy: 'Classroom Discussion',
      effectSize: 0.82,
      category: 'High Impact',
      description: 'Structured dialogue between teacher and students.',
      practicalApplications: [
        'Use Socratic questioning',
        'Implement think-pair-share',
        'Facilitate structured debates',
        'Create discussion protocols',
      ],
      researchEvidence: 'Discussion helps students process and deepen understanding.',
    },
    {
      strategy: 'Direct Instruction',
      effectSize: 0.59,
      category: 'Medium Impact',
      description: 'Explicit teaching of concepts and skills.',
      practicalApplications: [
        'Clear learning objectives',
        'Modeled examples',
        'Guided practice',
        'Independent practice',
      ],
      researchEvidence: 'Structured, explicit instruction is effective for skill building.',
    },
    {
      strategy: 'Problem-Based Learning',
      effectSize: 0.15,
      category: 'Low Impact',
      description: 'Learning through solving authentic problems.',
      practicalApplications: [
        'Present real-world problems',
        'Guide inquiry process',
        'Facilitate collaboration',
        'Connect to multiple subjects',
      ],
      researchEvidence: 'While engaging, PBL requires careful implementation to be effective.',
    },
  ],
}

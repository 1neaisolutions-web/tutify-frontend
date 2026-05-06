// Competition and Coding Utilities for Programming Tutor

export interface CompetitionProblem {
  id: string
  title: string
  competition: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
  description: string
  constraints: string[]
  inputFormat: string
  outputFormat: string
  sampleInput: string[]
  sampleOutput: string[]
  solutionApproach: string[]
  algorithms: string[]
  dataStructures: string[]
  timeComplexity: string
  spaceComplexity: string
  relatedProblems: string[]
}

export interface AlgorithmExplanation {
  name: string
  category: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  useCases: string[]
  pseudocode: string
  codeExample: {
    language: string
    code: string
  }[]
  visualization: {
    step: number
    description: string
    state: Record<string, any>
  }[]
  commonMistakes: string[]
  optimizationTips: string[]
}

export interface DebuggingStrategy {
  errorType: string
  symptoms: string[]
  commonCauses: string[]
  stepByStepApproach: string[]
  tools: string[]
  preventionTips: string[]
  exampleFix: string
}

export interface ProjectMilestone {
  milestone: number
  title: string
  description: string
  deliverables: string[]
  estimatedTime: string
  skills: string[]
  resources: string[]
}

export interface ComputationalThinkingFramework {
  decomposition: {
    steps: string[]
    examples: string[]
  }
  patternRecognition: {
    patterns: string[]
    exercises: string[]
  }
  abstraction: {
    concepts: string[]
    applications: string[]
  }
  algorithmDesign: {
    principles: string[]
    strategies: string[]
  }
}

export interface CompetitionRoadmap {
  competition: string
  level: string
  currentSkills: string[]
  targetSkills: string[]
  learningPath: {
    phase: string
    duration: string
    topics: string[]
    resources: string[]
    practiceProblems: string[]
    milestones: string[]
  }[]
  skillGaps: string[]
  recommendedSchedule: {
    week: number
    focus: string
    hours: number
    activities: string[]
  }[]
}

export interface StandardsAlignment {
  standard: string
  framework: string
  gradeLevel: string
  competencies: {
    competency: string
    description: string
    evidence: string[]
    assessment: string[]
  }[]
  alignmentScore: number
}

// Competition Problem Analysis
export const analyzeCompetitionProblem = (problemText: string, competition: string): CompetitionProblem => {
  const categories = ['Dynamic Programming', 'Graph Theory', 'Greedy', 'Binary Search', 'String Algorithms', 'Number Theory']
  const algorithms = ['DFS', 'BFS', 'Dijkstra', 'Union-Find', 'Segment Tree', 'Binary Search']
  const dataStructures = ['Array', 'Hash Map', 'Tree', 'Graph', 'Stack', 'Queue']
  
  return {
    id: `prob-${Date.now()}`,
    title: problemText.split('\n')[0] || 'Competition Problem',
    competition,
    difficulty: competition.includes('IOI') || competition.includes('ICPC') ? 'expert' : 
                 competition.includes('USACO') ? 'advanced' : 'intermediate',
    category: categories[Math.floor(Math.random() * categories.length)],
    description: problemText || 'A challenging programming problem requiring algorithmic thinking.',
    constraints: [
      '1 ≤ n ≤ 10^5',
      '1 ≤ k ≤ n',
      'All values are integers'
    ],
    inputFormat: 'First line contains n and k. Next n lines contain array elements.',
    outputFormat: 'Output a single integer representing the answer.',
    sampleInput: ['5 3', '1 2 3 4 5'],
    sampleOutput: ['6'],
    solutionApproach: [
      'Identify the problem pattern',
      'Choose appropriate data structure',
      'Implement the algorithm',
      'Handle edge cases',
      'Optimize time complexity'
    ],
    algorithms: [algorithms[Math.floor(Math.random() * algorithms.length)]],
    dataStructures: [dataStructures[Math.floor(Math.random() * dataStructures.length)]],
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    relatedProblems: ['Problem A', 'Problem B', 'Problem C']
  }
}

// Algorithm Explanations
export const getAlgorithmExplanation = (algorithmName: string, language: string = 'python'): AlgorithmExplanation => {
  const algorithms: Record<string, AlgorithmExplanation> = {
    'Binary Search': {
      name: 'Binary Search',
      category: 'Search Algorithm',
      description: 'Efficiently finds an element in a sorted array by repeatedly dividing the search interval in half.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      useCases: [
        'Finding elements in sorted arrays',
        'Finding boundaries in sorted data',
        'Optimization problems with monotonic properties'
      ],
      pseudocode: `
function binarySearch(arr, target):
    left = 0
    right = arr.length - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
      `,
      codeExample: [
        {
          language: 'python',
          code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
        },
        {
          language: 'java',
          code: `public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
        }
      ],
      visualization: [
        { step: 1, description: 'Initialize left=0, right=n-1', state: { left: 0, right: 4, mid: null } },
        { step: 2, description: 'Calculate mid = (left+right)//2', state: { left: 0, right: 4, mid: 2 } },
        { step: 3, description: 'Compare arr[mid] with target', state: { comparison: 'arr[2] vs target' } }
      ],
      commonMistakes: [
        'Off-by-one errors in boundary conditions',
        'Integer overflow when calculating mid',
        'Not handling empty arrays'
      ],
      optimizationTips: [
        'Use left + (right - left) / 2 to avoid overflow',
        'Consider using bisect module in Python',
        'Prefer iterative over recursive for space efficiency'
      ]
    },
    'Quick Sort': {
      name: 'Quick Sort',
      category: 'Sorting Algorithm',
      description: 'Divide-and-conquer algorithm that picks a pivot and partitions the array around it.',
      timeComplexity: 'O(n log n) average, O(n²) worst case',
      spaceComplexity: 'O(log n)',
      useCases: [
        'General-purpose sorting',
        'When average-case performance matters',
        'In-place sorting requirements'
      ],
      pseudocode: `
function quickSort(arr, low, high):
    if low < high:
        pivot = partition(arr, low, high)
        quickSort(arr, low, pivot - 1)
        quickSort(arr, pivot + 1, high)
      `,
      codeExample: [
        {
          language: 'python',
          code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
        }
      ],
      visualization: [],
      commonMistakes: [
        'Not handling duplicate elements',
        'Poor pivot selection leading to worst case',
        'Stack overflow with large arrays'
      ],
      optimizationTips: [
        'Use median-of-three for pivot selection',
        'Switch to insertion sort for small subarrays',
        'Use iterative version to avoid stack overflow'
      ]
    }
  }
  
  return algorithms[algorithmName] || algorithms['Binary Search']
}

// Debugging Strategies
export const getDebuggingStrategy = (errorType: string): DebuggingStrategy => {
  const strategies: Record<string, DebuggingStrategy> = {
    'Index Out of Bounds': {
      errorType: 'Index Out of Bounds',
      symptoms: ['ArrayIndexOutOfBoundsException', 'IndexError', 'Segmentation fault'],
      commonCauses: [
        'Loop boundary conditions',
        'Off-by-one errors',
        'Accessing array with invalid index'
      ],
      stepByStepApproach: [
        'Check loop boundaries (0-indexed vs 1-indexed)',
        'Add bounds checking before array access',
        'Use defensive programming with assertions',
        'Print array length and index values',
        'Use debugger to step through code'
      ],
      tools: ['Debugger', 'Print statements', 'Assertions', 'Static analysis tools'],
      preventionTips: [
        'Always check array bounds before access',
        'Use for-each loops when possible',
        'Validate input ranges',
        'Write unit tests for edge cases'
      ],
      exampleFix: `// Before: arr[i] without checking
// After:
if (i >= 0 && i < arr.length) {
    return arr[i];
} else {
    throw new IndexOutOfBoundsException("Index: " + i);`
    },
    'Null Pointer Exception': {
      errorType: 'Null Pointer Exception',
      symptoms: ['NullPointerException', 'AttributeError', 'Cannot read property'],
      commonCauses: [
        'Uninitialized variables',
        'Method returning null',
        'Missing null checks'
      ],
      stepByStepApproach: [
        'Identify the null object',
        'Trace back to where it should have been initialized',
        'Add null checks before dereferencing',
        'Use optional types where appropriate',
        'Initialize variables properly'
      ],
      tools: ['Null safety analysis', 'Optional types', 'Null checks', 'Debugger'],
      preventionTips: [
        'Initialize variables when declared',
        'Use null-safe operators',
        'Return empty collections instead of null',
        'Use Optional type in Java'
      ],
      exampleFix: `// Before: obj.method() without checking
// After:
if (obj != null) {
    obj.method();
} else {
    // Handle null case
}`
    },
    'Time Limit Exceeded': {
      errorType: 'Time Limit Exceeded',
      symptoms: ['TLE', 'Timeout', 'Program runs too long'],
      commonCauses: [
        'Inefficient algorithm',
        'Nested loops with high complexity',
        'Missing optimizations'
      ],
      stepByStepApproach: [
        'Analyze time complexity',
        'Identify bottlenecks',
        'Consider alternative algorithms',
        'Optimize data structures',
        'Use memoization or dynamic programming'
      ],
      tools: ['Profiler', 'Complexity analyzer', 'Algorithm visualization'],
      preventionTips: [
        'Choose appropriate data structures',
        'Avoid nested loops when possible',
        'Use efficient algorithms',
        'Profile code before submission'
      ],
      exampleFix: `// Before: O(n²) nested loop
// After: O(n log n) with sorting or O(n) with hash map`
    }
  }
  
  return strategies[errorType] || strategies['Index Out of Bounds']
}

// Project-Based Learning Planner
export const generateProjectPlan = (
  projectType: string,
  gradeLevel: string,
  duration: string
): ProjectMilestone[] => {
  const projects: Record<string, ProjectMilestone[]> = {
    'Web Application': [
      {
        milestone: 1,
        title: 'Planning & Design',
        description: 'Define requirements, create wireframes, and plan architecture',
        deliverables: ['Requirements document', 'Wireframes', 'Technology stack selection'],
        estimatedTime: '1-2 weeks',
        skills: ['System design', 'UI/UX basics', 'Requirements analysis'],
        resources: ['Figma tutorials', 'System design guides', 'Architecture patterns']
      },
      {
        milestone: 2,
        title: 'Frontend Development',
        description: 'Build user interface and implement client-side logic',
        deliverables: ['HTML/CSS pages', 'JavaScript functionality', 'Responsive design'],
        estimatedTime: '2-3 weeks',
        skills: ['HTML/CSS', 'JavaScript', 'Responsive design'],
        resources: ['MDN Web Docs', 'CSS Grid/Flexbox guides', 'JavaScript tutorials']
      },
      {
        milestone: 3,
        title: 'Backend Development',
        description: 'Implement server-side logic and database',
        deliverables: ['API endpoints', 'Database schema', 'Authentication'],
        estimatedTime: '2-3 weeks',
        skills: ['Backend frameworks', 'Database design', 'API design'],
        resources: ['REST API guides', 'Database tutorials', 'Security best practices']
      },
      {
        milestone: 4,
        title: 'Testing & Deployment',
        description: 'Test application and deploy to production',
        deliverables: ['Test cases', 'Bug fixes', 'Deployed application'],
        estimatedTime: '1-2 weeks',
        skills: ['Testing', 'DevOps basics', 'Debugging'],
        resources: ['Testing frameworks', 'Deployment guides', 'CI/CD tutorials']
      }
    ],
    'Game Development': [
      {
        milestone: 1,
        title: 'Game Design',
        description: 'Design game mechanics, levels, and user experience',
        deliverables: ['Game design document', 'Level designs', 'Asset list'],
        estimatedTime: '1 week',
        skills: ['Game design', 'Creative thinking', 'Planning'],
        resources: ['Game design principles', 'Asset libraries', 'Design tools']
      },
      {
        milestone: 2,
        title: 'Core Mechanics',
        description: 'Implement basic game mechanics and controls',
        deliverables: ['Player movement', 'Basic physics', 'Game loop'],
        estimatedTime: '2 weeks',
        skills: ['Game programming', 'Physics basics', 'Event handling'],
        resources: ['Game engine tutorials', 'Physics engines', 'Game development guides']
      },
      {
        milestone: 3,
        title: 'Levels & Content',
        description: 'Create game levels, enemies, and content',
        deliverables: ['Multiple levels', 'Enemy AI', 'Collectibles'],
        estimatedTime: '2 weeks',
        skills: ['Level design', 'AI programming', 'Content creation'],
        resources: ['Level design guides', 'AI tutorials', 'Asset creation tools']
      },
      {
        milestone: 4,
        title: 'Polish & Publishing',
        description: 'Add polish, sound effects, and prepare for release',
        deliverables: ['Sound effects', 'UI polish', 'Published game'],
        estimatedTime: '1 week',
        skills: ['Audio integration', 'UI/UX polish', 'Publishing'],
        resources: ['Audio tools', 'UI design guides', 'Publishing platforms']
      }
    ]
  }
  
  return projects[projectType] || projects['Web Application']
}

// Computational Thinking Framework
export const getComputationalThinkingFramework = (): ComputationalThinkingFramework => {
  return {
    decomposition: {
      steps: [
        'Break the problem into smaller sub-problems',
        'Identify the main components',
        'Determine the relationships between parts',
        'Solve each sub-problem independently',
        'Combine solutions to solve the original problem'
      ],
      examples: [
        'Building a website: Break into frontend, backend, database',
        'Sorting algorithm: Divide array, sort halves, merge',
        'Game development: Separate into graphics, physics, AI, UI'
      ]
    },
    patternRecognition: {
      patterns: [
        'Identify similarities in problems',
        'Recognize common algorithmic patterns',
        'Find recurring data structures',
        'Spot optimization opportunities',
        'Learn from previous solutions'
      ],
      exercises: [
        'Group similar problems together',
        'Identify when to use specific algorithms',
        'Recognize data structure patterns',
        'Find common bugs and fixes'
      ]
    },
    abstraction: {
      concepts: [
        'Focus on essential details',
        'Ignore irrelevant information',
        'Create reusable components',
        'Define clear interfaces',
        'Generalize solutions'
      ],
      applications: [
        'Create functions for repeated code',
        'Design classes with clear responsibilities',
        'Use libraries and frameworks',
        'Abstract complex operations into simple interfaces'
      ]
    },
    algorithmDesign: {
      principles: [
        'Start with a clear problem statement',
        'Consider multiple approaches',
        'Choose appropriate data structures',
        'Optimize for time and space',
        'Handle edge cases',
        'Test thoroughly'
      ],
      strategies: [
        'Brute force first, then optimize',
        'Use divide and conquer',
        'Apply dynamic programming',
        'Consider greedy approaches',
        'Use heuristics when appropriate'
      ]
    }
  }
}

// Competition Roadmap Generator
export const generateCompetitionRoadmap = (
  competition: string,
  currentLevel: string,
  targetLevel: string
): CompetitionRoadmap => {
  return {
    competition,
    level: targetLevel,
    currentSkills: ['Basic programming', 'Simple algorithms'],
    targetSkills: ['Advanced algorithms', 'Data structures', 'Problem-solving'],
    learningPath: [
      {
        phase: 'Foundation',
        duration: '4-6 weeks',
        topics: ['Basic syntax', 'Control structures', 'Functions', 'Arrays'],
        resources: ['Official documentation', 'Online tutorials', 'Practice problems'],
        practiceProblems: ['A+B Problem', 'Sum of Array', 'Find Maximum'],
        milestones: ['Complete 20 easy problems', 'Understand basic concepts']
      },
      {
        phase: 'Intermediate',
        duration: '6-8 weeks',
        topics: ['Sorting algorithms', 'Search algorithms', 'String manipulation', 'Basic math'],
        resources: ['Algorithm books', 'Video tutorials', 'Competition problems'],
        practiceProblems: ['Binary Search', 'Two Pointers', 'Greedy Problems'],
        milestones: ['Solve 50 medium problems', 'Master key algorithms']
      },
      {
        phase: 'Advanced',
        duration: '8-12 weeks',
        topics: ['Graph algorithms', 'Dynamic programming', 'Advanced data structures', 'Number theory'],
        resources: ['Advanced textbooks', 'Competition guides', 'Past problems'],
        practiceProblems: ['Graph Traversal', 'DP Problems', 'Complex Data Structures'],
        milestones: ['Solve 100+ hard problems', 'Qualify for next level']
      }
    ],
    skillGaps: ['Graph algorithms', 'Dynamic programming', 'Advanced math'],
    recommendedSchedule: [
      {
        week: 1,
        focus: 'Basic algorithms',
        hours: 10,
        activities: ['Study sorting algorithms', 'Solve 5 problems', 'Review solutions']
      },
      {
        week: 2,
        focus: 'Data structures',
        hours: 12,
        activities: ['Learn arrays/lists', 'Practice problems', 'Code review']
      }
    ]
  }
}

// Standards Alignment
export const checkStandardsAlignment = (
  content: string,
  framework: string,
  gradeLevel: string
): StandardsAlignment => {
  const frameworks: Record<string, any> = {
    'CSTA': {
      competencies: [
        {
          competency: 'Algorithms & Programming',
          description: 'Develop programs with sequences, events, loops, and conditionals',
          evidence: ['Code uses loops', 'Conditional statements present', 'Functions defined'],
          assessment: ['Code review', 'Problem-solving tasks', 'Project evaluation']
        },
        {
          competency: 'Data & Analysis',
          description: 'Collect, store, visualize, and transform data',
          evidence: ['Data structures used', 'Data visualization created', 'Data processing implemented'],
          assessment: ['Data analysis projects', 'Database queries', 'Visualization tasks']
        }
      ]
    },
    'ISTE': {
      competencies: [
        {
          competency: 'Computational Thinker',
          description: 'Students develop and employ strategies for understanding and solving problems',
          evidence: ['Problem decomposition', 'Pattern recognition', 'Algorithm design'],
          assessment: ['Problem-solving exercises', 'Algorithm design tasks', 'Debugging challenges']
        },
        {
          competency: 'Innovative Designer',
          description: 'Students use a variety of technologies to create innovative solutions',
          evidence: ['Creative projects', 'Technology integration', 'Solution design'],
          assessment: ['Project portfolios', 'Design reviews', 'Innovation challenges']
        }
      ]
    }
  }
  
  return {
    standard: framework,
    framework,
    gradeLevel,
    competencies: frameworks[framework]?.competencies || [],
    alignmentScore: 85
  }
}

// Get available competitions
export const getCompetitions = () => [
  { id: 'ioi', name: 'International Olympiad in Informatics (IOI)', level: 'expert' },
  { id: 'icpc', name: 'ACM ICPC', level: 'expert' },
  { id: 'codeforces', name: 'Codeforces', level: 'intermediate' },
  { id: 'usaco', name: 'USACO', level: 'advanced' },
  { id: 'codejam', name: 'Google Code Jam', level: 'advanced' },
  { id: 'hackercup', name: 'Facebook Hacker Cup', level: 'advanced' },
  { id: 'atcoder', name: 'AtCoder', level: 'intermediate' },
  { id: 'leetcode', name: 'LeetCode Contests', level: 'intermediate' }
]

// Get programming languages
export const getProgrammingLanguages = () => [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
  { id: 'csharp', name: 'C#', icon: '🔷' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' }
]




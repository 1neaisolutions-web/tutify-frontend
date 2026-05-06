import { Standard } from '../types/premium'

// Sample Common Core ELA Standards
export const commonCoreELA: Standard[] = [
  {
    id: 'cc-ela-rl-1',
    code: 'RL.1',
    description: 'Read closely to determine what the text says explicitly and to make logical inferences from it.',
    subject: 'English Language Arts',
    grade: 'K-12',
    category: 'Reading: Literature',
  },
  {
    id: 'cc-ela-rl-2',
    code: 'RL.2',
    description: 'Determine central ideas or themes of a text and analyze their development.',
    subject: 'English Language Arts',
    grade: 'K-12',
    category: 'Reading: Literature',
  },
  {
    id: 'cc-ela-rl-3',
    code: 'RL.3',
    description: 'Analyze how and why individuals, events, and ideas develop and interact over the course of a text.',
    subject: 'English Language Arts',
    grade: 'K-12',
    category: 'Reading: Literature',
  },
  {
    id: 'cc-ela-ri-1',
    code: 'RI.1',
    description: 'Read closely to determine what the text says explicitly and to make logical inferences.',
    subject: 'English Language Arts',
    grade: 'K-12',
    category: 'Reading: Informational Text',
  },
  {
    id: 'cc-ela-w-1',
    code: 'W.1',
    description: 'Write arguments to support claims in an analysis of substantive topics or texts.',
    subject: 'English Language Arts',
    grade: 'K-12',
    category: 'Writing',
  },
  {
    id: 'cc-ela-w-2',
    code: 'W.2',
    description: 'Write informative/explanatory texts to examine and convey complex ideas.',
    subject: 'English Language Arts',
    grade: 'K-12',
    category: 'Writing',
  },
]

// Sample Common Core Math Standards
export const commonCoreMath: Standard[] = [
  {
    id: 'cc-math-oa-1',
    code: 'OA.1',
    description: 'Represent and solve problems involving addition and subtraction.',
    subject: 'Mathematics',
    grade: 'K-5',
    category: 'Operations & Algebraic Thinking',
  },
  {
    id: 'cc-math-oa-2',
    code: 'OA.2',
    description: 'Add and subtract within 20.',
    subject: 'Mathematics',
    grade: 'K-5',
    category: 'Operations & Algebraic Thinking',
  },
  {
    id: 'cc-math-nbt-1',
    code: 'NBT.1',
    description: 'Understand place value.',
    subject: 'Mathematics',
    grade: 'K-5',
    category: 'Number & Operations in Base Ten',
  },
  {
    id: 'cc-math-nf-1',
    code: 'NF.1',
    description: 'Extend understanding of fraction equivalence and ordering.',
    subject: 'Mathematics',
    grade: '3-5',
    category: 'Number & Operations—Fractions',
  },
]

// Sample NGSS Standards
export const ngssStandards: Standard[] = [
  {
    id: 'ngss-1-ps4-1',
    code: '1-PS4-1',
    description: 'Plan and conduct investigations to provide evidence that vibrating materials can make sound.',
    subject: 'Science',
    grade: '1',
    category: 'Physical Science',
  },
  {
    id: 'ngss-3-ls1-1',
    code: '3-LS1-1',
    description: 'Develop models to describe that organisms have unique and diverse life cycles.',
    subject: 'Science',
    grade: '3',
    category: 'Life Science',
  },
  {
    id: 'ngss-5-ess1-1',
    code: '5-ESS1-1',
    description: 'Support an argument that differences in the apparent brightness of the sun compared to other stars.',
    subject: 'Science',
    grade: '5',
    category: 'Earth & Space Science',
  },
]

export const allStandards: Standard[] = [
  ...commonCoreELA,
  ...commonCoreMath,
  ...ngssStandards,
]

export const searchStandards = (query: string): Standard[] => {
  const lowerQuery = query.toLowerCase()
  return allStandards.filter(
    (standard) =>
      standard.code.toLowerCase().includes(lowerQuery) ||
      standard.description.toLowerCase().includes(lowerQuery) ||
      standard.category.toLowerCase().includes(lowerQuery) ||
      standard.subject.toLowerCase().includes(lowerQuery)
  )
}

export const filterStandardsBySubject = (subject: string): Standard[] => {
  return allStandards.filter((standard) => standard.subject === subject)
}

export const filterStandardsByGrade = (grade: string): Standard[] => {
  return allStandards.filter((standard) => standard.grade.includes(grade))
}


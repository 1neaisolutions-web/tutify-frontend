export interface Standard {
  id: string
  code: string
  description: string
  subject: string
  grade: string
  category: string
}

export interface SelectedStandard extends Standard {
  selected: boolean
}

export interface ExportFormat {
  type: 'pdf' | 'word' | 'markdown' | 'html' | 'google-docs'
  includeMetadata: boolean
  includeImages: boolean
  formatting: 'professional' | 'simple' | 'custom'
}

export interface SharePermission {
  type: 'read' | 'edit' | 'admin'
  expiresAt?: Date
  password?: string
}

export interface MessageVersion {
  id: string
  messageId: string
  content: string
  timestamp: Date
  author: string
}

export interface CustomInstruction {
  teachingStyle: string[]
  subjectExpertise: string[]
  outputFormat: 'detailed' | 'concise' | 'structured'
  tone: 'professional' | 'friendly' | 'formal'
  language: string
}

export interface MultimodalFile {
  id: string
  file: File
  type: 'image' | 'document' | 'other'
  preview?: string
  analysis?: string
  processed: boolean
}

export interface PremiumAnalytics {
  totalConversations: number
  totalMessages: number
  timeSaved: number // in minutes
  mostUsedFeatures: string[]
  standardsCoverage: Record<string, number>
  effectivenessScore: number
}

export interface TeamWorkspace {
  id: string
  name: string
  members: string[]
  sharedConversations: string[]
  sharedTemplates: string[]
  createdAt: Date
}


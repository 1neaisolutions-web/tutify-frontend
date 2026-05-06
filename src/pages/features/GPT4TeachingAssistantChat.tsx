import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  CheckCircle2,
  History,
  X,
  Search,
  Calendar,
  MessageSquare,
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  Target,
  Lightbulb,
  Edit,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  StopCircle,
  Zap,
  PenTool,
  ClipboardCheck,
  HeartHandshake,
  Upload,
  Paperclip,
  Image,
  File,
  Mic,
  MicOff,
  Volume2,
  Settings,
  ChevronDown,
  Brain,
  Crown,
  Download,
  Share2,
  BarChart3,
  Bookmark,
  Globe,
  HelpCircle,
  Accessibility,
  FileQuestion,
  AlignLeft,
  ChevronRight,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react'
import StandardsBrowserPro from '../../components/premium/StandardsBrowserPro'
import MultimodalUpload from '../../components/premium/MultimodalUpload'
import ExportDialog from '../../components/premium/ExportDialog'
import CustomInstructions from '../../components/premium/CustomInstructions'
import { Standard, MultimodalFile, CustomInstruction as CustomInstructionType } from '../../types/premium'
import { Message } from './GeneralTeachingAssistantChat'
import * as chatbotApi from '../../api/chatbots'
import { useRestoreChatbotConversationFromUrl } from '../../hooks/useRestoreChatbotConversationFromUrl'

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  standards?: Standard[]
}

const GPT4TeachingAssistantChat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editInputValue, setEditInputValue] = useState('')
  const [messageActionMenu, setMessageActionMenu] = useState<string | null>(null)
  const [canStopGeneration, setCanStopGeneration] = useState(false)
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set())
  
  // Premium features state
  const [selectedStandards, setSelectedStandards] = useState<Standard[]>([])
  const [gradeLevel, setGradeLevel] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [multimodalFiles, setMultimodalFiles] = useState<MultimodalFile[]>([])
  const [showStandardsBrowser, setShowStandardsBrowser] = useState(false)
  const [showMultimodalUpload, setShowMultimodalUpload] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showCustomInstructions, setShowCustomInstructions] = useState(false)
  const [customInstructions, setCustomInstructions] = useState<CustomInstructionType | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('gpt4-teaching-assistant-conversations')
    const savedCurrentId = localStorage.getItem('gpt4-teaching-assistant-current-conversation')
    const savedCustomInstructions = localStorage.getItem('gpt4-custom-instructions')
    
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      }))
      setConversations(parsed)
      
      if (savedCurrentId && parsed.find((c: Conversation) => c.id === savedCurrentId)) {
        setCurrentConversationId(savedCurrentId)
        const currentConv = parsed.find((c: Conversation) => c.id === savedCurrentId)
        if (currentConv) {
          setMessages(currentConv.messages)
          setSelectedStandards(currentConv.standards || [])
        }
      }
    }

    if (savedCustomInstructions) {
      setCustomInstructions(JSON.parse(savedCustomInstructions))
    }
  }, [])

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('gpt4-teaching-assistant-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  // Save current conversation ID
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('gpt4-teaching-assistant-current-conversation', currentConversationId)
    }
  }, [currentConversationId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  useRestoreChatbotConversationFromUrl('gpt4-teaching-assistant-current-conversation', async (convId) => {
    try {
      const detail = await chatbotApi.getConversation(convId)
      const loadedMessages: Message[] = detail.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }))
      setMessages(loadedMessages)
      setCurrentConversationId(convId)
      setConversations((prev) => {
        if (prev.some((c) => c.id === convId)) {
          return prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: loadedMessages,
                  title: detail.title?.trim() ? detail.title : c.title,
                  updatedAt: new Date(detail.updated_at),
                }
              : c,
          )
        }
        const conv: Conversation = {
          id: convId,
          title: detail.title || 'Conversation',
          messages: loadedMessages,
          createdAt: new Date(detail.created_at),
          updatedAt: new Date(detail.updated_at),
          standards: [],
        }
        return [conv, ...prev]
      })
    } catch (e) {
      console.error('Failed to restore conversation from history', e)
    }
  })

  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6).join(' ')
    return words.length > 50 ? words.substring(0, 50) + '...' : words
  }

  const createNewConversation = () => {
    setCurrentConversationId(null)
    setMessages([])
    setInputValue('')
    setSelectedStandards([])
    setMultimodalFiles([])
  }

  const saveConversation = (newMessages: Message[]) => {
    if (newMessages.length === 0) return

    const now = new Date()
    const title = generateConversationTitle(newMessages[0].content)

    if (currentConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: newMessages,
                title: newMessages.length > 1 ? title : conv.title,
                updatedAt: now,
                standards: selectedStandards,
              }
            : conv
        )
      )
    } else {
      const newId = `conv-${Date.now()}`
      const newConversation: Conversation = {
        id: newId,
        title,
        messages: newMessages,
        createdAt: now,
        updatedAt: now,
        standards: selectedStandards,
      }
      setConversations((prev) => [newConversation, ...prev])
      setCurrentConversationId(newId)
    }
  }

  const generateEnhancedResponse = (prompt: string): string => {
    // Simulate GPT-4 level enhanced response
    const context = []
    if (selectedStandards.length > 0) {
      context.push(`Aligned with ${selectedStandards.length} educational standard(s): ${selectedStandards.map(s => s.code).join(', ')}`)
    }
    if (gradeLevel) {
      context.push(`Grade level: ${gradeLevel}`)
    }
    if (subject) {
      context.push(`Subject: ${subject}`)
    }
    if (multimodalFiles.length > 0) {
      context.push(`Analyzing ${multimodalFiles.length} uploaded file(s)`)
    }

    let response = `Based on your request: "${prompt}"\n\n`
    
    if (context.length > 0) {
      response += `**Context:** ${context.join(' • ')}\n\n`
    }

    response += `**Comprehensive Analysis:**\n\n`
    response += `I'll provide a detailed, pedagogically sound response that addresses your needs:\n\n`
    response += `1. **Understanding the Request:** ${prompt}\n\n`
    response += `2. **Pedagogical Framework:** Drawing from evidence-based teaching practices and current educational research...\n\n`
    response += `3. **Practical Implementation:** Here's a step-by-step approach:\n`
    response += `   - Step 1: [Detailed explanation]\n`
    response += `   - Step 2: [Specific guidance]\n`
    response += `   - Step 3: [Actionable recommendations]\n\n`
    response += `4. **Differentiation Considerations:** To meet diverse learner needs...\n\n`
    response += `5. **Assessment Alignment:** This approach aligns with formative and summative assessment best practices...\n\n`
    response += `**Research Foundation:** This recommendation is supported by current educational research in [relevant field].\n\n`
    response += `Would you like me to elaborate on any specific aspect or provide additional resources?`

    return response
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)
    setCanStopGeneration(true)

    saveConversation(newMessages)

    const timeoutId = setTimeout(() => {
      const responseContent = generateEnhancedResponse(userMessage.content)
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      }

      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)
      setIsLoading(false)
      setCanStopGeneration(false)
      saveConversation(updatedMessages)
    }, 2000)

    ;(window as any).currentGenerationTimeout = timeoutId
  }

  const handleStopGeneration = () => {
    if ((window as any).currentGenerationTimeout) {
      clearTimeout((window as any).currentGenerationTimeout)
      setIsLoading(false)
      setCanStopGeneration(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopyMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      navigator.clipboard.writeText(message.content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    }
    setMessageActionMenu(null)
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(historySearchQuery.toLowerCase())
  )

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return date.toLocaleDateString()
  }

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMarkdown = (text: string) => {
    // Basic markdown rendering
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={idx}>{line.slice(2, -2)}</strong>
      }
      if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
        return <div key={idx} className="ml-4">{line}</div>
      }
      return <div key={idx}>{line || <br />}</div>
    })
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Premium Header */}
      <div className="border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 via-white to-purple-50 px-6 py-4 shadow-lg z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chatbots')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg ring-4 ring-amber-100">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">GPT-4 Teaching Assistant</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold">
                  <Crown className="h-3 w-3" />
                  PREMIUM
                </div>
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Advanced AI with multimodal capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                showAnalytics
                  ? 'border-purple-300 bg-purple-50 text-purple-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
            <button
              onClick={createNewConversation}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                showHistory
                  ? 'border-amber-500 bg-amber-50 text-amber-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="h-4 w-4" />
              History
              {conversations.length > 0 && (
                <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-600">
                  {conversations.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Toggle Button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-4 top-4 z-10 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition"
            title="Show sidebar"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Sidebar - Collapsible */}
        {showSidebar && (
          <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setShowStandardsBrowser(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-amber-50 hover:border-amber-300 transition text-sm"
                >
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  Standards Browser
                </button>
                <button
                  onClick={() => setShowMultimodalUpload(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition text-sm"
                >
                  <Upload className="h-4 w-4 text-purple-600" />
                  Upload Files
                </button>
                <button
                  onClick={() => setShowCustomInstructions(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition text-sm"
                >
                  <Settings className="h-4 w-4 text-blue-600" />
                  Custom Instructions
                </button>
              </div>
            </div>
            {selectedStandards.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Selected Standards</h4>
                <div className="space-y-1">
                  {selectedStandards.slice(0, 3).map((std) => (
                    <div key={std.id} className="text-xs text-gray-600 truncate">
                      {std.code}
                    </div>
                  ))}
                  {selectedStandards.length > 3 && (
                    <div className="text-xs text-gray-400">+{selectedStandards.length - 3} more</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-4 py-8">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  {/* Premium Welcome Section */}
                  <div className="mb-8 text-center max-w-3xl">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-purple-400 to-indigo-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-purple-500 to-indigo-600 shadow-2xl ring-4 ring-white">
                          <Brain className="h-14 w-14 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <Crown className="h-8 w-8 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        GPT-4 Teaching Assistant
                      </h2>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        PREMIUM
                      </div>
                    </div>
                    <p className="text-sm font-medium text-purple-600 mb-6">Powered by OpenAI GPT-4</p>
                    <div className="max-w-2xl mx-auto mb-8">
                      <p className="text-base text-gray-700 leading-relaxed">
                        Experience the power of GPT-4 with advanced reasoning, multimodal AI capabilities, and deep pedagogical understanding. Upload images, analyze documents, align with standards, and create professional educational content.
                      </p>
                    </div>

                    {/* Premium Features Showcase */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
                      {[
                        {
                          icon: Sparkles,
                          title: 'Multimodal AI',
                          description: 'Upload images and documents for AI analysis',
                          color: 'from-purple-500 to-indigo-600',
                        },
                        {
                          icon: BookOpen,
                          title: 'Standards Alignment',
                          description: 'Automatic alignment with Common Core, NGSS, and state standards',
                          color: 'from-amber-500 to-amber-600',
                        },
                        {
                          icon: Users,
                          title: 'Advanced Differentiation',
                          description: 'IEP support and tiered instruction planning',
                          color: 'from-blue-500 to-cyan-600',
                        },
                        {
                          icon: Download,
                          title: 'Professional Export',
                          description: 'Export to PDF, Word, Markdown, and more',
                          color: 'from-green-500 to-emerald-600',
                        },
                      ].map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300"
                          >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                            <div className="absolute top-2 right-2">
                              <Crown className="h-4 w-4 text-amber-400 opacity-50" />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Quick Start Templates */}
                    <div className="w-full max-w-3xl mx-auto">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Quick Start Templates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Create a standards-aligned lesson plan for 5th grade science',
                          'Generate differentiated activities for diverse learners',
                          'Design a rubric for project-based assessment',
                          'Plan an IEP goal with accommodations',
                        ].map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInputValue(suggestion)
                              setTimeout(() => handleSendMessage(), 100)
                            }}
                            className="group relative rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:border-amber-300 hover:shadow-md hover:bg-gradient-to-r hover:from-amber-50 hover:to-purple-50"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                              {suggestion}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  {messages.map((message, index) => {
                    const isLastMessage = index === messages.length - 1
                    const isEditing = editingMessageId === message.id

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 shadow-lg ring-2 ring-white">
                            <Brain className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col gap-2 max-w-[85%]">
                          {isEditing && message.role === 'user' ? (
                            <div className="rounded-2xl border-2 border-amber-500 bg-white p-4 shadow-lg">
                              <textarea
                                ref={editTextareaRef}
                                value={editInputValue}
                                onChange={(e) => setEditInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    // Handle save edit
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingMessageId(null)
                                    setEditInputValue('')
                                  }
                                }}
                                className="w-full resize-none border-0 bg-transparent text-gray-900 focus:outline-none focus:ring-0"
                                rows={3}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div
                              className={`group relative rounded-2xl px-5 py-4 ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg'
                                  : 'bg-white text-gray-900 shadow-md border-2 border-gray-100'
                              }`}
                            >
                              <div className={message.role === 'assistant' ? 'text-gray-700' : 'text-white'}>
                                {message.role === 'assistant' ? renderMarkdown(message.content) : message.content}
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span className={`text-xs ${message.role === 'user' ? 'text-amber-100' : 'text-gray-400'}`}>
                                  {formatTimestamp(message.timestamp)}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                  {message.role === 'assistant' && (
                                    <>
                                      <button
                                        onClick={() => handleCopyMessage(message.id)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                                        title="Copy"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => setShowExportDialog(true)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                                        title="Export"
                                      >
                                        <Download className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => setMessageActionMenu(message.id)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                                        title="More"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="rounded-2xl bg-white px-5 py-4 shadow-md border-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                      <span className="text-sm text-gray-600 font-medium">GPT-4 is thinking...</span>
                      {canStopGeneration && (
                        <button
                          onClick={handleStopGeneration}
                          className="ml-2 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                        >
                          <StopCircle className="h-3.5 w-3.5" />
                          Stop
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Premium Input Area */}
          <div className="border-t-2 border-gray-200 bg-white">
            <div className="mx-auto max-w-4xl px-4 py-4">
              {/* Premium Controls Bar */}
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowStandardsBrowser(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                >
                  <BookOpen className="h-4 w-4" />
                  Standards {selectedStandards.length > 0 && `(${selectedStandards.length})`}
                </button>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Grade Level</option>
                  {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Subject</option>
                  {['English', 'Mathematics', 'Science', 'Social Studies', 'Arts', 'Physical Education'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowMultimodalUpload(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                >
                  <Upload className="h-4 w-4" />
                  Upload {multimodalFiles.length > 0 && `(${multimodalFiles.length})`}
                </button>
                <button
                  onClick={() => setShowCustomInstructions(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Instructions
                </button>
              </div>

              {/* Input Field */}
              <div className="flex items-end gap-2">
                <div className="flex-1 rounded-xl border-2 border-gray-300 bg-white shadow-sm transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask GPT-4 anything about teaching... (Premium: Upload files, align standards, get advanced responses)"
                    rows={1}
                    className="w-full resize-none border-0 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Premium Disclaimer */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Crown className="h-4 w-4 text-amber-400" />
                <p>
                  Premium Feature: Advanced AI reasoning, multimodal capabilities, and professional tools.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setShowHistory(false)}
            />
            <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col lg:static lg:shadow-none lg:z-auto">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Chat History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <History className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setCurrentConversationId(conversation.id)
                          setMessages(conversation.messages)
                          setSelectedStandards(conversation.standards || [])
                          setShowHistory(false)
                        }}
                        className={`group relative p-3 rounded-lg cursor-pointer transition ${
                          currentConversationId === conversation.id
                            ? 'bg-amber-50 border border-amber-200'
                            : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                          {conversation.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conversation.messages.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(conversation.updatedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Premium Modals */}
      {showStandardsBrowser && (
        <StandardsBrowserPro
          selectedStandards={selectedStandards}
          onSelect={setSelectedStandards}
          onClose={() => setShowStandardsBrowser(false)}
        />
      )}

      {showMultimodalUpload && (
        <MultimodalUpload
          onFilesSelected={(files) => {
            setMultimodalFiles(files)
            setShowMultimodalUpload(false)
          }}
          onClose={() => setShowMultimodalUpload(false)}
        />
      )}

      {showExportDialog && (
        <ExportDialog
          messages={messages}
          onClose={() => setShowExportDialog(false)}
        />
      )}

      {showCustomInstructions && (
        <CustomInstructions
          instructions={customInstructions}
          onSave={(instructions) => {
            setCustomInstructions(instructions)
            localStorage.setItem('gpt4-custom-instructions', JSON.stringify(instructions))
            setShowCustomInstructions(false)
          }}
          onClose={() => setShowCustomInstructions(false)}
        />
      )}
    </div>
  )
}

export default GPT4TeachingAssistantChat


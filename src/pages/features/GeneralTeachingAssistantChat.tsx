import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import * as chatbotApi from '../../api/chatbots'
import * as subscriptionApi from '../../api/subscriptions'
// @ts-ignore - useSnackbar is a JS file
import { useSnackbar } from '../../hooks/useSnackbar'
import NoCreditsCard from '../../components/NoCreditsCard'
import { useRefreshCreditBalance } from '../../hooks/useRefreshCreditBalance'
import { useRestoreChatbotConversationFromUrl } from '../../hooks/useRestoreChatbotConversationFromUrl'
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
  Gauge,
  Sparkles as SparklesIcon,
  HelpCircle,
  Accessibility,
  FileQuestion,
  AlignLeft,
  Bookmark,
  ChevronRight,
  Globe,
  Lock,
} from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages?: Message[] // Optional - lazy loaded from API
  message_count?: number // From API list response
  createdAt: Date
  updatedAt: Date
}

const GeneralTeachingAssistantChat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  /** Pagination for loading older messages (scroll-up). */
  const [olderLoading, setOlderLoading] = useState(false)
  const [hasMoreOlder, setHasMoreOlder] = useState(false)
  const [nextBeforeCursor, setNextBeforeCursor] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // CRITICAL: Separate state for streaming content (like templates use formattedContent)
  // This ensures word-by-word updates without React batching array updates
  const [streamingContent, setStreamingContent] = useState<string>('')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [botMode, setBotMode] = useState<'fastest' | 'smartest' | 'critical-thinking'>('smartest')
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const isRecordingRef = useRef(false)
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showLengthMenu, setShowLengthMenu] = useState(false)
  const [customPrompts, setCustomPrompts] = useState<string[]>([])
  const [showCustomPromptsModal, setShowCustomPromptsModal] = useState(false)
  const [newCustomPrompt, setNewCustomPrompt] = useState('')
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'enterprise'>('free')
  const [quota, setQuota] = useState<subscriptionApi.QuotaSummary | null>(null)
  const [featureAccess, setFeatureAccess] = useState<Record<string, boolean>>({})
  const [insufficientCredits, setInsufficientCredits] = useState(false)
  const [creditErrorReason, setCreditErrorReason] = useState<string | undefined>(undefined)
  const { toast } = useSnackbar()
  const refreshCreditBalance = useRefreshCreditBalance()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesScrollContainerRef = useRef<HTMLDivElement>(null)
  /** When true, skip auto scroll-to-bottom (used after prepending older messages). */
  const skipScrollToBottomRef = useRef(false)
  /** Avoid immediate "load older" on mount when scrollTop is 0 but user hasn't scrolled up yet. */
  const userScrolledAwayFromBottomRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const allFilesInputRef = useRef<HTMLInputElement>(null)

  const CHATBOT_SLUG = 'general-teaching-assistant'

  // Load subscription and quota info - only on mount and when needed
  useEffect(() => {
    const loadSubscriptionInfo = async () => {
      try {
        const [subscription, features, quotaData] = await Promise.all([
          subscriptionApi.getMySubscription().catch(() => null),
          subscriptionApi.getMyFeatures().catch(() => null),
          subscriptionApi.getQuotaSummary().catch(() => null),
        ])

        if (subscription) {
          setSubscriptionTier(subscription.tier)
        }

        if (features) {
          const accessMap: Record<string, boolean> = {}
          features.features.forEach((f) => {
            accessMap[f.feature_key] = f.is_enabled
          })
          setFeatureAccess(accessMap)
        }

        if (quotaData) {
          setQuota(quotaData)
        }
      } catch (error) {
        console.error('Error loading subscription info:', error)
      }
    }

    // Load once on mount
    loadSubscriptionInfo()

    // Only refresh when window regains focus (user comes back to tab)
    // This catches upgrades without excessive polling
    const handleFocus = () => {
      loadSubscriptionInfo()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  type LoadConversationMessagesOpts = {
    /** Full reload of the latest page (default true). */
    reset?: boolean
    /** Cursor from prior response — load older messages and prepend. */
    before?: string | null
  }

  // Lazy-load messages (chunked): latest page first; scroll-up loads older via `before`.
  const loadConversationMessages = async (
    conversationId: string,
    opts: LoadConversationMessagesOpts = {},
  ) => {
    const reset = opts.reset !== false
    const before = opts.before ?? null
    try {
      if (before) {
        setOlderLoading(true)
      } else if (reset) {
        userScrolledAwayFromBottomRef.current = false
        setMessages([])
        setHasMoreOlder(false)
        setNextBeforeCursor(null)
      }

      const page = await chatbotApi.listConversationMessages(conversationId, {
        limit: 50,
        before: before || undefined,
      })

      const loadedMessages: Message[] = page.items
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }))

      if (before) {
        skipScrollToBottomRef.current = true
        const el = messagesScrollContainerRef.current
        const prevScrollHeight = el?.scrollHeight ?? 0
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const merged = loadedMessages.filter((m) => !existingIds.has(m.id))
          return [...merged, ...prev]
        })
        setHasMoreOlder(page.has_more)
        setNextBeforeCursor(page.next_before)
        requestAnimationFrame(() => {
          const el2 = messagesScrollContainerRef.current
          if (el2) {
            el2.scrollTop = el2.scrollHeight - prevScrollHeight
          }
          skipScrollToBottomRef.current = false
          setOlderLoading(false)
        })
      } else {
        setMessages(loadedMessages)
        setHasMoreOlder(page.has_more)
        setNextBeforeCursor(page.next_before)

        let convTitle = 'Untitled Conversation'
        let createdAt = new Date()
        let updatedAt = new Date()
        try {
          const detail = await chatbotApi.getConversation(conversationId)
          convTitle = detail.title || convTitle
          createdAt = new Date(detail.created_at)
          updatedAt = new Date(detail.updated_at)
        } catch {
          /* ignore — title stays default */
        }

        setConversations((prev) => {
          const existingConv = prev.find((c) => c.id === conversationId)
          if (existingConv) {
            return prev.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: undefined,
                    title: convTitle !== 'Untitled Conversation' ? convTitle : conv.title,
                    updatedAt,
                  }
                : conv,
            )
          }
          return [
            {
              id: conversationId,
              title: convTitle,
              messages: undefined,
              message_count: loadedMessages.length,
              createdAt,
              updatedAt,
            },
            ...prev,
          ]
        })

      }
    } catch (error) {
      console.error(`Error loading conversation messages ${conversationId}:`, error)
      toast.error('Failed to load conversation messages')
      setOlderLoading(false)
    }
  }

  // Load conversations list from API on mount (metadata only - ChatGPT-like approach)
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const apiConversations = await chatbotApi.listConversations(CHATBOT_SLUG)

        const formattedConversations: Conversation[] = apiConversations.map((conv) => ({
          id: conv.id,
          title: conv.title || 'Untitled Conversation',
          messages: undefined,
          message_count: conv.message_count,
          createdAt: new Date(conv.created_at),
          updatedAt: new Date(conv.updated_at),
        }))

        setConversations(formattedConversations)

        const savedCurrentId = localStorage.getItem('general-teaching-assistant-current-conversation')
        if (savedCurrentId && formattedConversations.some((c) => c.id === savedCurrentId)) {
          setCurrentConversationId(savedCurrentId)
          void loadConversationMessages(savedCurrentId, { reset: true })
        }
      } catch (error) {
        console.error('Error loading conversations:', error)
        setConversations([])
      }
    }

    void loadConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; loadConversationMessages updates every render
  }, [])

  const paginationScrollRef = useRef({
    olderLoading,
    hasMoreOlder,
    nextBeforeCursor,
    currentConversationId: null as string | null,
  })
  paginationScrollRef.current = {
    olderLoading,
    hasMoreOlder,
    nextBeforeCursor,
    currentConversationId,
  }

  const handleMessagesScroll = () => {
    const el = messagesScrollContainerRef.current
    const st = paginationScrollRef.current
    if (!el || st.olderLoading) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distanceFromBottom > 200) {
      userScrolledAwayFromBottomRef.current = true
    }
    if (!userScrolledAwayFromBottomRef.current) return
    if (el.scrollTop > 100) return
    if (!st.hasMoreOlder || !st.nextBeforeCursor || !st.currentConversationId) return
    void loadConversationMessages(st.currentConversationId, {
      reset: false,
      before: st.nextBeforeCursor,
    })
  }

  useRestoreChatbotConversationFromUrl('general-teaching-assistant-current-conversation', (id) => {
    setCurrentConversationId(id)
    return loadConversationMessages(id, { reset: true })
  })

  // Clean up old localStorage data (one-time migration)
  useEffect(() => {
    try {
      // Remove old localStorage conversation storage (API is source of truth now)
      localStorage.removeItem('general-teaching-assistant-conversations')
    } catch (error) {
      // Ignore errors during cleanup
    }
  }, [])

  // Save current conversation ID
  useEffect(() => {
    try {
      if (currentConversationId) {
        localStorage.setItem('general-teaching-assistant-current-conversation', currentConversationId)
      }
    } catch (error) {
      console.error('Error saving current conversation ID to localStorage:', error)
    }
  }, [currentConversationId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    try {
      if (skipScrollToBottomRef.current) {
        return
      }
      // Use requestAnimationFrame to ensure DOM is ready
      const scrollTimeout = setTimeout(() => {
        try {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        } catch (scrollError) {
          // Fallback to instant scroll if smooth fails
          try {
            messagesEndRef.current?.scrollIntoView()
          } catch (e) {
            console.error('Error scrolling to bottom:', e)
          }
        }
      }, 100)
      return () => clearTimeout(scrollTimeout)
    } catch (error) {
      console.error('Error in scroll effect:', error)
    }
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    try {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    } catch (error) {
      console.error('Error resizing textarea:', error)
    }
  }, [inputValue])

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement
        if (messageActionMenu && !target.closest('.message-action-menu')) {
          setMessageActionMenu(null)
        }
        if (showUploadMenu && !target.closest('.upload-menu-container')) {
          setShowUploadMenu(false)
        }
        if (showModeMenu && !target.closest('.mode-menu-container')) {
          setShowModeMenu(false)
        }
        if (showActionsMenu && !target.closest('.actions-menu-container')) {
          setShowActionsMenu(false)
        }
        if (showLengthMenu && !target.closest('.length-menu-container')) {
          setShowLengthMenu(false)
        }
      } catch (error) {
        console.error('Error in handleClickOutside:', error)
      }
    }

    const shouldAddListener = messageActionMenu || showUploadMenu || showModeMenu || showActionsMenu || showLengthMenu

    if (shouldAddListener) {
      // Use capture phase to ensure we catch the event
      document.addEventListener('mousedown', handleClickOutside, true)
      return () => {
        try {
          document.removeEventListener('mousedown', handleClickOutside, true)
        } catch (error) {
          console.error('Error removing click outside listener:', error)
        }
      }
    }
  }, [messageActionMenu, showUploadMenu, showModeMenu, showActionsMenu, showLengthMenu])

  // Auto-focus edit textarea when editing
  useEffect(() => {
    try {
      if (editingMessageId && editTextareaRef.current) {
        editTextareaRef.current.focus()
        editTextareaRef.current.style.height = 'auto'
        editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`
      }
    } catch (error) {
      console.error('Error focusing edit textarea:', error)
    }
  }, [editingMessageId, editInputValue])

  const generateConversationTitle = (firstMessage: string): string => {
    try {
      if (!firstMessage || typeof firstMessage !== 'string') {
        return 'New Conversation'
      }
      const words = firstMessage.split(' ').slice(0, 6).join(' ')
      return words.length > 50 ? words.substring(0, 50) + '...' : words
    } catch (error) {
      console.error('Error generating conversation title:', error)
      return 'New Conversation'
    }
  }

  const createNewConversation = () => {
    setCurrentConversationId(null)
    setMessages([])
    setHasMoreOlder(false)
    setNextBeforeCursor(null)
    setOlderLoading(false)
    userScrolledAwayFromBottomRef.current = false
    setInputValue('')
    localStorage.removeItem('general-teaching-assistant-current-conversation')
  }

  // Update conversation list after sending message (metadata only - messages from API)
  const refreshConversationInList = async (conversationId: string) => {
    try {
      // Refresh conversation list to get updated metadata
      const apiConversations = await chatbotApi.listConversations(CHATBOT_SLUG)
      const updatedConv = apiConversations.find((c) => c.id === conversationId)
      
      if (updatedConv) {
        setConversations((prev) => {
          const existingConv = prev.find((c) => c.id === conversationId)
          if (existingConv) {
            // Update existing conversation metadata
            return prev.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    title: updatedConv.title || conv.title,
                    message_count: updatedConv.message_count,
                    updatedAt: new Date(updatedConv.updated_at),
                    // Preserve cached messages if they exist
                    messages: conv.messages,
                  }
                : conv
            )
          } else {
            // New conversation - add to list
            const newConv: Conversation = {
              id: conversationId,
              title: updatedConv.title || 'Untitled Conversation',
              messages: undefined, // Lazy loaded when selected
              message_count: updatedConv.message_count,
              createdAt: new Date(updatedConv.created_at),
              updatedAt: new Date(updatedConv.updated_at),
            }
            return [newConv, ...prev]
          }
        })
      }
    } catch (error) {
      console.error('Error refreshing conversation in list:', error)
    }
  }

  // Store timeout ref for cleanup
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [thinkingState, setThinkingState] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    setInsufficientCredits(false)
    setCreditErrorReason(undefined)

    try {
      const getFriendlySendError = (err: unknown): string => {
        const raw =
          (typeof err === 'object' && err !== null && 'detail' in err && typeof (err as any).detail === 'string'
            ? (err as any).detail
            : undefined) ||
          (err instanceof Error ? err.message : undefined) ||
          ''
        const normalized = raw.toLowerCase()
        if (normalized.includes('database error') || normalized.includes('undefinedcolumn')) {
          return 'Sorry — we’re having trouble on our side right now. Please try again in a moment.'
        }
        if (normalized.includes('networkerror') || normalized.includes('failed to fetch')) {
          return 'Sorry — I couldn’t reach the server. Please check your connection and try again.'
        }
        if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
          return 'You’re sending messages a bit too fast. Please wait a moment and try again.'
        }
        return 'Sorry — something went wrong while generating a response. Please try again.'
      }

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
      setThinkingState(null)

      // Clear any existing timeout and abort controller
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller for this request
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      // Don't create empty message - wait for first content chunk (prevents duplicate empty block)
      const assistantMessageId = `msg-${Date.now() + 1}`
      let assistantMessageCreated = false

      // Try streaming first, fallback to regular API if not supported
      try {
        // Track streamed content (like templates use accumulatedContentRef)
        let streamedContent = ''
        
        let conversationId = currentConversationId
        let finalResponse: chatbotApi.SendMessageResponse | null = null

      // Try streaming endpoint
      try {
        const streamGenerator = chatbotApi.sendMessageStream(
          CHATBOT_SLUG,
          {
            message: userMessage.content,
            conversation_id: currentConversationId || undefined,
            bot_mode: botMode,
            response_length: responseLength,
            web_search: webSearchEnabled && featureAccess.web_search,
          },
          abortController.signal
        )

          let hasReceivedContent = false
          
          for await (const chunk of streamGenerator) {
            if (abortController.signal.aborted) {
              break
            }

            if (chunk.type === 'thinking') {
              // Skip thinking state for faster response (like GPT)
            } else if (chunk.type === 'content') {
              // CRITICAL: Process content chunk immediately (word-by-word like GPT)
              // EXACTLY like templates: accumulate chunk immediately, update state immediately
              const chunkText = chunk.content || ''
              if (chunkText) {
                hasReceivedContent = true
                // Accumulate chunk (like templates accumulate markdown)
                streamedContent += chunkText
                setThinkingState(null) // Clear thinking state when content arrives
                
                // CRITICAL: Update streaming content state immediately (like templates)
                // Templates update formattedContent directly - this ensures word-by-word streaming
                // We use a separate state for streaming content to avoid React batching array updates
                if (!assistantMessageCreated) {
                  assistantMessageCreated = true
                  setStreamingMessageId(assistantMessageId)
                  // Create placeholder message - content will be shown via streamingContent state
                  setMessages((prev) => {
                    const assistantMessage: Message = {
                      id: assistantMessageId,
                      role: 'assistant',
                      content: '', // Empty - content shown via streamingContent
                      timestamp: new Date(),
                    }
                    return [...prev, assistantMessage]
                  })
                }
                
                // CRITICAL: Update streaming content directly (like templates)
                // Use flushSync to force immediate render for word-by-word display
                // Templates update state directly - we do the same but with flushSync for safety
                flushSync(() => {
                  setStreamingContent(streamedContent)
                })
                
                // Auto-scroll on next frame (non-blocking, smooth)
                requestAnimationFrame(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                })
              }
            } else if (chunk.type === 'done') {
              // Streaming complete
              finalResponse = chunk.data
              if (chunk.data?.conversation_id) {
                conversationId = String(chunk.data.conversation_id)
              }
              break
            } else if (chunk.type === 'error') {
              const errCode = chunk.data?.error_code
              const errDetail = chunk.data?.detail
              const isCreditError =
                errCode === 'insufficient_credits' ||
                errDetail === 'no_credits' ||
                errDetail === 'credits_expired' ||
                (typeof errDetail === 'string' && errDetail.toLowerCase().includes('credit'))
              if (isCreditError) {
                setCreditErrorReason(errCode || errDetail)
                setInsufficientCredits(true)
                setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId))
                setStreamingContent('')
                setStreamingMessageId(null)
                setIsLoading(false)
                setCanStopGeneration(false)
                setThinkingState(null)
                return
              }
              throw new Error(errDetail || 'Streaming error')
            }
          }

          // If streaming worked, finalize the message
          if (streamedContent && hasReceivedContent) {
            const finalContent = streamedContent
            
            // CRITICAL: Finalize message - move streaming content to message
            setMessages((prev) => {
              // Check if message already exists
              const existingMsg = prev.find((msg) => msg.id === assistantMessageId)
              if (existingMsg) {
                // Update existing message with final content
                return prev.map((msg) => {
                  if (msg.id === assistantMessageId) {
                    return {
                      ...msg,
                      id: finalResponse?.assistant_message?.id || assistantMessageId,
                      content: finalContent,
                      timestamp: finalResponse?.assistant_message?.created_at 
                        ? new Date(finalResponse.assistant_message.created_at)
                        : new Date(),
                    }
                  }
                  return msg
                })
              } else {
                // Create new message with final content
                const assistantMessage: Message = {
                  id: finalResponse?.assistant_message?.id || assistantMessageId,
                  role: 'assistant',
                  content: finalContent,
                  timestamp: finalResponse?.assistant_message?.created_at 
                    ? new Date(finalResponse.assistant_message.created_at)
                    : new Date(),
                }
                return [...prev, assistantMessage]
              }
            })
            
            // Clear streaming state and finalize message
            setStreamingContent('')
            setStreamingMessageId(null)
            setIsLoading(false)
            setCanStopGeneration(false)
            setThinkingState(null)

            // Update conversation ID if new conversation was created
            if (conversationId && conversationId !== currentConversationId) {
              setCurrentConversationId(conversationId)
              localStorage.setItem('general-teaching-assistant-current-conversation', conversationId)
              
              // Refresh conversation list to include new conversation
              refreshConversationInList(conversationId)
            } else if (conversationId) {
              // Refresh existing conversation metadata
              refreshConversationInList(conversationId)
            }
            
            // Update quota
            try {
              const quotaData = await subscriptionApi.getQuotaSummary()
              setQuota(quotaData)
            } catch (error) {
              console.error('Error updating quota:', error)
            }
            await refreshCreditBalance()

            // Play audio if enabled
            if (audioEnabled && featureAccess.audio_transcription) {
              speakText(streamedContent)
            }

            generationTimeoutRef.current = null
            abortControllerRef.current = null
            return
          }
        } catch (streamError: any) {
          // CRITICAL: Don't fall back - streaming MUST work
          // If streaming fails, show error to user
          if (streamError.name === 'AbortError') {
            setIsLoading(false)
            setCanStopGeneration(false)
            setThinkingState(null)
            // Clear streaming state
            setStreamingContent('')
            setStreamingMessageId(null)
            return
          }
          console.error('Streaming failed:', streamError)
          setIsLoading(false)
          setCanStopGeneration(false)
          setThinkingState(null)
          setStreamingContent('')
          setStreamingMessageId(null)
          // Ensure we don't leave an empty assistant placeholder in the thread
          setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId))
          // Show a professional in-thread failure message instead of raw backend errors
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'assistant',
              content: getFriendlySendError(streamError),
              timestamp: new Date(),
            },
          ])
          return
        }

        generationTimeoutRef.current = null
      } catch (error: any) {
        console.error('Error sending message:', error)
        setIsLoading(false)
        setCanStopGeneration(false)
        
        // Show error message
        if (error instanceof Error) {
          toast.error(error.message || 'Failed to send message. Please try again.')
        } else if ((error as any)?.status === 403) {
          toast.error('Premium subscription required for this feature.')
        } else if ((error as any)?.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.')
        } else {
          toast.error('Failed to send message. Please try again.')
        }
      }

      // Timeout ref is no longer needed with async/await, but kept for compatibility
      generationTimeoutRef.current = null
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
      setCanStopGeneration(false)
    }
  }

  const handleStopGeneration = () => {
    try {
      // Abort streaming request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current)
        generationTimeoutRef.current = null
      }
      if ((window as any).currentGenerationTimeout) {
        clearTimeout((window as any).currentGenerationTimeout)
        ;(window as any).currentGenerationTimeout = null
      }
      setIsLoading(false)
      setCanStopGeneration(false)
      setThinkingState(null)
      // Clear streaming state
      setStreamingContent('')
      setStreamingMessageId(null)
    } catch (error) {
      console.error('Error stopping generation:', error)
    }
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message && message.role === 'user') {
      setEditingMessageId(messageId)
      setEditInputValue(message.content)
      setMessageActionMenu(null)
    }
  }

  const handleSaveEdit = () => {
    if (!editingMessageId || !editInputValue.trim()) return

    const messageIndex = messages.findIndex((m) => m.id === editingMessageId)
    if (messageIndex !== -1) {
      const updatedMessages = [...messages]
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: editInputValue.trim(),
        timestamp: new Date(),
      }
      // Remove all messages after the edited one
      const finalMessages = updatedMessages.slice(0, messageIndex + 1)
      setMessages(finalMessages)
      setEditingMessageId(null)
      setEditInputValue('')
      
      // Refresh conversation metadata
      if (currentConversationId) {
        refreshConversationInList(currentConversationId)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditInputValue('')
  }

  const handleDeleteMessage = (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex !== -1) {
      const updatedMessages = messages.filter((m) => m.id !== messageId)
      setMessages(updatedMessages)
      setMessageActionMenu(null)
      
      // Refresh conversation metadata
      if (currentConversationId) {
        refreshConversationInList(currentConversationId)
      }
    }
  }

  const handleRegenerateResponse = async () => {
    try {
      // Get current messages
      const currentMessages = messages
      
      // Find the last assistant message
      const lastAssistantIndex = currentMessages.map((m) => m.role).lastIndexOf('assistant')
      if (lastAssistantIndex === -1) return

      // Get the user message before the assistant response
      const userMessage = currentMessages[lastAssistantIndex - 1]
      if (!userMessage) return

      // Remove the last assistant message
      const messagesUpToUser = currentMessages.slice(0, lastAssistantIndex)
      setMessages(messagesUpToUser)
      setIsLoading(true)
      setCanStopGeneration(true)

      // Regenerate response using API
      try {
        const response = await chatbotApi.sendMessage(CHATBOT_SLUG, {
          message: userMessage.content,
          conversation_id: currentConversationId || undefined,
          bot_mode: botMode,
          response_length: responseLength,
          web_search: webSearchEnabled && featureAccess.web_search,
        })

        const newAssistantMessage: Message = {
          id: response.assistant_message.id,
          role: 'assistant',
          content: response.assistant_message.content,
          timestamp: new Date(response.assistant_message.created_at),
        }

        const updatedMessages = [...messagesUpToUser, newAssistantMessage]
        setMessages(updatedMessages)
        setIsLoading(false)
        setCanStopGeneration(false)
        
        // Refresh conversation metadata
        if (response.conversation_id) {
          refreshConversationInList(response.conversation_id)
        }
        
        // Update quota
        try {
          const quotaData = await subscriptionApi.getQuotaSummary()
          setQuota(quotaData)
        } catch (error) {
          console.error('Error updating quota:', error)
        }
        await refreshCreditBalance()

        // Play audio if enabled (available for all users)
        if (audioEnabled) {
          speakText(newAssistantMessage.content)
        }
      } catch (error: any) {
        console.error('Error regenerating response:', error)
        setIsLoading(false)
        setCanStopGeneration(false)
        if (error instanceof Error) {
          toast.error(error.message || 'Failed to regenerate response.')
        } else {
          toast.error('Failed to regenerate response. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error in handleRegenerateResponse:', error)
      setIsLoading(false)
      setCanStopGeneration(false)
    }
  }

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    if (type === 'like') {
      setLikedMessages((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(messageId)) {
          newSet.delete(messageId)
        } else {
          newSet.add(messageId)
          setDislikedMessages((prevDislike) => {
            const newDislikeSet = new Set(prevDislike)
            newDislikeSet.delete(messageId)
            return newDislikeSet
          })
        }
        return newSet
      })
    } else {
      setDislikedMessages((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(messageId)) {
          newSet.delete(messageId)
        } else {
          newSet.add(messageId)
          setLikedMessages((prevLike) => {
            const newLikeSet = new Set(prevLike)
            newLikeSet.delete(messageId)
            return newLikeSet
          })
        }
        return newSet
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Check if user has access to file attachments (premium feature)
      if (!featureAccess.file_attachments) {
        toast.info('File attachments are available with Premium. Upgrade to access.')
        e.target.value = '' // Reset file input
        return
      }

      const files = Array.from(e.target.files || [])
      setAttachedFiles((prev) => [...prev, ...files])
      setShowUploadMenu(false)
      // Reset input values
      if (imageInputRef.current) imageInputRef.current.value = ''
      if (documentInputRef.current) documentInputRef.current.value = ''
      if (allFilesInputRef.current) allFilesInputRef.current.value = ''
    } catch (error) {
      console.error('Error handling file select:', error)
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes: number): string => {
    try {
      if (bytes === 0) return '0 Bytes'
      if (bytes < 0 || !isFinite(bytes)) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    } catch (error) {
      console.error('Error formatting file size:', error)
      return 'Unknown size'
    }
  }

  const startRecording = async () => {
    try {
      // Check if user has access to audio/voice features (premium)
      if (!featureAccess.audio_transcription) {
        toast.info('Voice input is available with Premium. Upgrade to access.')
        return
      }

      // Stop any existing recording first
      if (mediaRecorderRef.current && isRecordingRef.current) {
        stopRecording()
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        try {
          // Create blob for potential future use (speech-to-text API)
          const blob = new Blob(chunks, { type: 'audio/webm' })
          // Convert audio to text (mock implementation)
          // In production, this would call a speech-to-text API with the blob
          console.log('Audio recorded, size:', blob.size, 'bytes')
          setIsRecording(false)
          isRecordingRef.current = false
          stream.getTracks().forEach((track) => track.stop())
        } catch (error) {
          console.error('Error in recorder onstop:', error)
          setIsRecording(false)
          isRecordingRef.current = false
          stream.getTracks().forEach((track) => track.stop())
        }
      }

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      isRecordingRef.current = true
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setIsRecording(false)
      isRecordingRef.current = false
      setMediaRecorder(null)
      mediaRecorderRef.current = null
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecordingRef.current) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        isRecordingRef.current = false
        // In production, process the audio and convert to text
        // For now, just simulate adding text
        setInputValue((prev) => prev + ' [Audio message transcribed]')
      }
    } catch (error) {
      console.error('Error stopping recording:', error)
      setIsRecording(false)
      isRecordingRef.current = false
    }
  }

  const toggleAudio = () => {
    // Audio (voice input/output) is premium feature - GPT style
    if (!featureAccess.audio_transcription && !audioEnabled) {
      toast.info('Voice features are available with Premium. Upgrade to access.')
      return
    }
    setAudioEnabled(!audioEnabled)
  }

  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window && audioEnabled) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
        }
        
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error('Error in speech synthesis:', error)
    }
  }

  const botModeConfig = {
    fastest: {
      label: 'Fastest',
      icon: Gauge,
      description: 'Quick responses, optimized for speed',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    smartest: {
      label: 'Smartest',
      icon: Brain,
      description: 'Balanced intelligence and speed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    'critical-thinking': {
      label: 'Critical Thinking',
      icon: SparklesIcon,
      description: 'Deep analysis and reasoning',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  }

  const responseLengthConfig = {
    short: { label: 'Short', description: 'Brief, concise responses' },
    medium: { label: 'Medium', description: 'Balanced detail' },
    long: { label: 'Long', description: 'Comprehensive, detailed responses' },
  }

  const handleResponseLengthChange = (length: 'short' | 'medium' | 'long') => {
    setResponseLength(length)
    setShowActionsMenu(false)
  }

  const toggleWebSearch = () => {
    // Check if user has access to web search
    if (!featureAccess.web_search && !webSearchEnabled) {
      toast.info('Web search is a premium feature. Upgrade to access.')
      return
    }
    setWebSearchEnabled(!webSearchEnabled)
  }

  const handleAction = (actionType: string) => {
    setShowActionsMenu(false)
    switch (actionType) {
      case 'questions':
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          let contentToUse = ''
          
          if (lastMessage.role === 'assistant') {
            // Use assistant's last response
            contentToUse = lastMessage.content
          } else if (messages.length >= 2) {
            // Use previous assistant message if last is user
            const prevAssistant = messages.slice().reverse().find(m => m.role === 'assistant')
            if (prevAssistant) {
              contentToUse = prevAssistant.content
            }
          }
          
          if (contentToUse) {
            const truncated = contentToUse.length > 200 
              ? contentToUse.substring(0, 200) + '...'
              : contentToUse
            setInputValue(`Generate thoughtful questions based on the following content:\n\n${truncated}`)
            // Focus input
            setTimeout(() => textareaRef.current?.focus(), 100)
          } else {
            setInputValue('Generate questions based on: ')
            setTimeout(() => textareaRef.current?.focus(), 100)
          }
        } else {
          setInputValue('Generate questions about: ')
          setTimeout(() => textareaRef.current?.focus(), 100)
        }
        break
      case 'summarize':
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          let contentToUse = ''
          
          if (lastMessage.role === 'assistant') {
            contentToUse = lastMessage.content
          } else if (messages.length >= 2) {
            const prevAssistant = messages.slice().reverse().find(m => m.role === 'assistant')
            if (prevAssistant) {
              contentToUse = prevAssistant.content
            }
          }
          
          if (contentToUse) {
            const truncated = contentToUse.length > 200 
              ? contentToUse.substring(0, 200) + '...'
              : contentToUse
            setInputValue(`Please provide a clear and concise summary of the following:\n\n${truncated}`)
            setTimeout(() => textareaRef.current?.focus(), 100)
          } else {
            setInputValue('Summarize: ')
            setTimeout(() => textareaRef.current?.focus(), 100)
          }
        } else {
          setInputValue('Summarize: ')
          setTimeout(() => textareaRef.current?.focus(), 100)
        }
        break
      case 'custom-prompts':
        setShowCustomPromptsModal(true)
        break
      default:
        break
    }
  }

  const saveCustomPrompt = (prompt: string) => {
    try {
      if (prompt.trim() && !customPrompts.includes(prompt.trim())) {
        const updated = [...customPrompts, prompt.trim()]
        setCustomPrompts(updated)
        localStorage.setItem('custom-prompts', JSON.stringify(updated))
        setNewCustomPrompt('')
        toast.success('Custom prompt saved!')
      }
    } catch (error) {
      console.error('Error saving custom prompt:', error)
      toast.error('Failed to save custom prompt')
    }
  }

  const deleteCustomPrompt = (index: number) => {
    try {
      const updated = customPrompts.filter((_, i) => i !== index)
      setCustomPrompts(updated)
      localStorage.setItem('custom-prompts', JSON.stringify(updated))
      toast.success('Custom prompt deleted')
    } catch (error) {
      console.error('Error deleting custom prompt:', error)
      toast.error('Failed to delete custom prompt')
    }
  }

  const useCustomPrompt = (prompt: string) => {
    setInputValue(prompt)
    setShowCustomPromptsModal(false)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  // Load custom prompts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom-prompts')
      if (saved) {
        try {
          setCustomPrompts(JSON.parse(saved))
        } catch (parseError) {
          console.error('Error parsing custom prompts:', parseError)
          localStorage.removeItem('custom-prompts')
        }
      }
    } catch (error) {
      console.error('Error loading custom prompts from localStorage:', error)
    }
  }, [])

  // Cleanup on unmount - critical for preventing crashes
  useEffect(() => {
    return () => {
      // Cleanup timeouts
      try {
        if (generationTimeoutRef.current) {
          clearTimeout(generationTimeoutRef.current)
          generationTimeoutRef.current = null
        }
        if ((window as any).currentGenerationTimeout) {
          clearTimeout((window as any).currentGenerationTimeout)
          ;(window as any).currentGenerationTimeout = null
        }
      } catch (error) {
        console.error('Error cleaning up timeouts:', error)
      }

      // Cleanup MediaRecorder and media streams - use refs to avoid stale closures
      try {
        const recorder = mediaRecorderRef.current
        if (recorder && isRecordingRef.current) {
          try {
            if (recorder.state !== 'inactive') {
              recorder.stop()
            }
          } catch (e) {
            // Ignore errors when stopping already stopped recorder
          }
        }
        // Stop all media tracks from recorder stream
        if (recorder && (recorder as any).stream) {
          try {
            (recorder as any).stream.getTracks().forEach((track: MediaStreamTrack) => {
              track.stop()
            })
          } catch (e) {
            // Ignore errors when stopping tracks
          }
        }
        mediaRecorderRef.current = null
        isRecordingRef.current = false
      } catch (error) {
        console.error('Error cleaning up MediaRecorder:', error)
      }

      // Cleanup Speech Synthesis
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
        }
      } catch (error) {
        console.error('Error cleaning up speech synthesis:', error)
      }
    }
    // Empty dependency array - cleanup only on unmount
  }, [])

  // DEPRECATED: This function is no longer used - we use real API calls now
  // Keeping for reference only, will be removed in future cleanup
  const _generateMockResponse_DEPRECATED = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Simple keyword-based responses for demo
    if (lowerMessage.includes('lesson plan') || lowerMessage.includes('lesson planning')) {
      return `I'd be happy to help you create a lesson plan! Here are some key components to consider:

**1. Learning Objectives**
- What should students know or be able to do by the end of the lesson?
- Make objectives specific, measurable, and aligned with standards

**2. Materials & Resources**
- What materials will you need?
- Are there any digital resources or handouts?

**3. Lesson Structure**
- **Introduction/Hook** (5-10 min): Engage students and activate prior knowledge
- **Direct Instruction** (15-20 min): Teach new concepts
- **Guided Practice** (10-15 min): Students practice with support
- **Independent Practice** (10-15 min): Students work independently
- **Closure** (5 min): Review and assess understanding

**4. Assessment**
- Formative: Exit tickets, observations, quick checks
- Summative: Quizzes, projects, presentations

Would you like me to help you create a specific lesson plan? Please share the subject, grade level, and topic!`
    } else if (lowerMessage.includes('assessment') || lowerMessage.includes('test') || lowerMessage.includes('quiz')) {
      return `Great question about assessments! Here are some effective assessment strategies:

**Formative Assessments** (during learning):
- Exit tickets
- Think-pair-share
- Quick polls or thumbs up/down
- One-minute papers
- Observation checklists

**Summative Assessments** (end of learning):
- Traditional tests and quizzes
- Projects and presentations
- Portfolios
- Performance tasks
- Essays or written responses

**Tips for Effective Assessment:**
1. Align assessments with learning objectives
2. Use a variety of assessment types
3. Provide timely feedback
4. Make assessments authentic and relevant
5. Consider different learning styles

What type of assessment are you looking to create? I can help you design something specific!`
    } else if (lowerMessage.includes('classroom management') || lowerMessage.includes('behavior')) {
      return `Classroom management is crucial for effective teaching! Here are some proven strategies:

**Proactive Strategies:**
- Establish clear expectations and routines from day one
- Build positive relationships with students
- Create an engaging learning environment
- Use positive reinforcement
- Implement consistent consequences

**Reactive Strategies:**
- Address issues privately when possible
- Use proximity and non-verbal cues
- Give choices: "You can work quietly here or move to this seat"
- Follow through with established consequences
- Involve parents/guardians when needed

**Key Principles:**
- Be fair and consistent
- Focus on the behavior, not the student
- Model the behavior you expect
- Celebrate small wins
- Take care of yourself - teacher burnout affects classroom management

What specific classroom management challenge are you facing? I can provide more targeted advice!`
    } else if (lowerMessage.includes('differentiation') || lowerMessage.includes('different learners')) {
      return `Differentiation is about meeting students where they are! Here are key strategies:

**Content Differentiation:**
- Vary the complexity of materials
- Use leveled texts or resources
- Provide multiple entry points

**Process Differentiation:**
- Offer different ways to learn (visual, auditory, kinesthetic)
- Use flexible grouping
- Provide scaffolds and supports

**Product Differentiation:**
- Allow choice in how students demonstrate learning
- Offer different project options
- Use tiered assignments

**Environment Differentiation:**
- Create flexible seating options
- Designate quiet spaces
- Organize materials for easy access

**Quick Tips:**
- Start small - differentiate one aspect at a time
- Use pre-assessments to understand student needs
- Provide choice boards or learning menus
- Don't try to differentiate everything every day

What subject and grade level are you working with? I can suggest specific differentiation strategies!`
    } else {
      return `I'm here to help you with your teaching needs! I can assist with:

📚 **Lesson Planning** - Create standards-aligned lesson plans
📝 **Assessment Design** - Develop formative and summative assessments
👥 **Classroom Management** - Strategies for positive classroom culture
🎯 **Differentiation** - Adapt instruction for diverse learners
💡 **Teaching Strategies** - Evidence-based instructional methods
📊 **Curriculum Alignment** - Align lessons with standards
🔧 **Resource Recommendations** - Suggest teaching tools and materials

What would you like help with today? Feel free to ask me anything about teaching, lesson planning, or classroom strategies!`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      const timeoutId = setTimeout(() => setCopiedMessageId(null), 2000)
      // Store timeout for cleanup if needed
      return () => clearTimeout(timeoutId)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTimestamp = (date: Date): string => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Unknown time'
      }
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
      return date.toLocaleDateString()
    } catch (error) {
      console.error('Error formatting timestamp:', error)
      return 'Unknown time'
    }
  }

  const renderMarkdown = (text: string): JSX.Element => {
    try {
      if (!text || typeof text !== 'string') {
        return <div className="text-gray-700">No content</div>
      }
      // Simple markdown rendering - split by lines and handle basic formatting
      const lines = text.split('\n')
      return (
        <div className="space-y-2">
          {lines.map((line, idx) => {
            try {
              // Bold text
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={idx} className="font-semibold text-gray-900">
                    {line.slice(2, -2)}
                  </p>
                )
              }
              // List items
              if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                return (
                  <li key={idx} className="ml-4 list-disc text-gray-700">
                    {line.trim().substring(1).trim()}
                  </li>
                )
              }
              // Numbered lists
              if (/^\d+\./.test(line.trim())) {
                return (
                  <li key={idx} className="ml-4 list-decimal text-gray-700">
                    {line.trim().substring(line.trim().indexOf('.') + 1).trim()}
                  </li>
                )
              }
              // Emoji headers
              if (/^[📚📝👥🎯💡📊🔧]/.test(line.trim())) {
                return (
                  <p key={idx} className="font-semibold text-gray-900 mt-3">
                    {line.trim()}
                  </p>
                )
              }
              // Regular paragraph
              if (line.trim()) {
                return (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {line}
                  </p>
                )
              }
              return <br key={idx} />
            } catch (error) {
              console.error('Error rendering markdown line:', error)
              return <p key={idx} className="text-gray-700">{line}</p>
            }
          })}
        </div>
      )
    } catch (error) {
      console.error('Error rendering markdown:', error)
      return <div className="text-gray-700">{text}</div>
    }
  }

  const clearCurrentConversation = () => {
    try {
      // Clear any ongoing operations
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current)
        generationTimeoutRef.current = null
      }
      if ((window as any).currentGenerationTimeout) {
        clearTimeout((window as any).currentGenerationTimeout)
        ;(window as any).currentGenerationTimeout = null
      }
      setIsLoading(false)
      setCanStopGeneration(false)
      
      if (currentConversationId) {
        setConversations((prev) => prev.filter((conv) => conv.id !== currentConversationId))
        setCurrentConversationId(null)
        try {
          localStorage.removeItem('general-teaching-assistant-current-conversation')
        } catch (e) {
          console.error('Error removing conversation from localStorage:', e)
        }
      }
      setMessages([])
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }

  const loadConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId)
    localStorage.setItem('general-teaching-assistant-current-conversation', conversationId)
    setShowHistory(false)
    await loadConversationMessages(conversationId, { reset: true })
  }

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return
    }

    try {
      // Delete via API (only for non-temp conversations)
      if (!conversationId.startsWith('temp-')) {
        await chatbotApi.deleteConversation(conversationId)
      }

      // Remove from local state
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setMessages([])
        localStorage.removeItem('general-teaching-assistant-current-conversation')
      }
      
      // Refresh conversation list from API
      try {
        const apiConversations = await chatbotApi.listConversations(CHATBOT_SLUG)
        const formattedConversations: Conversation[] = apiConversations.map((conv) => ({
          id: conv.id,
          title: conv.title || 'Untitled Conversation',
          messages: undefined,
          message_count: conv.message_count,
          createdAt: new Date(conv.created_at),
          updatedAt: new Date(conv.updated_at),
        }))
        setConversations(formattedConversations)
      } catch (error) {
        console.error('Error refreshing conversations after delete:', error)
      }
      
      toast.success('Conversation deleted successfully')
    } catch (error: any) {
      console.error('Error deleting conversation:', error)
      toast.error(error?.message || 'Failed to delete conversation')
    }
  }

  const deleteAllConversations = async () => {
    if (!window.confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      return
    }

    try {
      // Delete all conversations via API
      const conversationsToDelete = conversations.filter((conv) => !conv.id.startsWith('temp-'))
      await Promise.all(conversationsToDelete.map((conv) => chatbotApi.deleteConversation(conv.id)))

      // Clear local state
      setConversations([])
      setCurrentConversationId(null)
      setMessages([])
      localStorage.removeItem('general-teaching-assistant-current-conversation')
      setShowHistory(false)
      
      toast.success('All conversations deleted successfully')
    } catch (error: any) {
      console.error('Error deleting conversations:', error)
      toast.error('Failed to delete some conversations')
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(historySearchQuery.toLowerCase())
  )

  const formatDate = (date: Date): string => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Unknown date'
      }
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days} days ago`
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`
      if (days < 365) return `${Math.floor(days / 30)} months ago`
      return date.toLocaleDateString()
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Unknown date'
    }
  }

  return (
    <div className="flex flex-1 min-h-0 h-full flex-col overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chatbots')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight">General Teaching Assistant</h1>
              <p className="text-[11px] text-gray-500 leading-tight">Your versatile AI companion for teaching</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Quota Display */}
            {quota && (
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-xs">
                  <div className="font-medium text-gray-700">
                    Messages: {quota.daily_messages_used} / {quota.daily_messages_limit}
                  </div>
                  <div className="text-gray-500 text-[10px] mt-0.5">
                    {quota.daily_messages_limit - quota.daily_messages_used} remaining today
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300" />
                <div className="w-20 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      quota.daily_messages_used / quota.daily_messages_limit > 0.8
                        ? 'bg-red-500'
                        : quota.daily_messages_used / quota.daily_messages_limit > 0.5
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (quota.daily_messages_used / quota.daily_messages_limit) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {/* Bot Mode Selector */}
            <div className="relative mode-menu-container">
              <button
                onClick={() => setShowModeMenu(!showModeMenu)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  botModeConfig[botMode].borderColor
                } ${botModeConfig[botMode].bgColor} ${botModeConfig[botMode].color} border-2 hover:shadow-sm`}
              >
                {(() => {
                  const ModeIcon = botModeConfig[botMode].icon
                  return <ModeIcon className="h-4 w-4" />
                })()}
                <span>{botModeConfig[botMode].label}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showModeMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden mode-menu-container">
                  <div className="p-2">
                    {Object.entries(botModeConfig).map(([key, config]) => {
                      const ModeIcon = config.icon
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setBotMode(key as 'fastest' | 'smartest' | 'critical-thinking')
                            setShowModeMenu(false)
                          }}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg transition ${
                            botMode === key
                              ? `${config.bgColor} ${config.borderColor} border-2`
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <ModeIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                          <div className="flex-1 text-left">
                            <div className={`font-semibold ${config.color}`}>{config.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{config.description}</div>
                          </div>
                          {botMode === key && (
                            <CheckCircle2 className={`h-5 w-5 ${config.color}`} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
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
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="h-4 w-4" />
              History
              {conversations.length > 0 && (
                <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-600">
                  {conversations.length}
                </span>
              )}
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearCurrentConversation}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Centered Layout */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex min-w-0 flex-1 flex-col min-h-0">
          <div
            ref={messagesScrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            onScroll={handleMessagesScroll}
          >
            {messages.length > 0 && (
              <div className="sticky top-0 z-10 border-b border-transparent">
                <div className="mx-auto max-w-4xl px-4 pt-3">
                  <div className="rounded-full bg-white/90 px-3 py-1 text-center text-[11px] text-gray-500 shadow-sm ring-1 ring-gray-200 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                    {olderLoading && <span>Loading older messages…</span>}
                    {!olderLoading && !hasMoreOlder && <span className="text-gray-400">Beginning of conversation</span>}
                    {!olderLoading && hasMoreOlder && <span className="text-gray-400">Scroll up to load older messages</span>}
                  </div>
                </div>
              </div>
            )}
            <div className="mx-auto max-w-4xl px-4 py-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  {/* Character Avatar Section */}
                  <div className="mb-8 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 shadow-2xl ring-4 ring-white">
                          <GraduationCap className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                        Hello! I'm General Teaching Assistant
                      </h2>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition">
                        <HelpCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-purple-600 mb-6">Made for Teachers</p>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-base text-gray-700 leading-relaxed">
                        Hello! I'm your AI instructional coach. You can ask any questions related to best practices in teaching or your work in a school building. Feel free to ask me for ideas for your classroom, research on best practices in pedagogy, behavior management strategies, or any general advice! The more specific your questions, the better my responses will be. How can I help you today?
                      </p>
                    </div>
                  </div>

                  {/* Sample Suggestions */}
                  <div className="w-full max-w-3xl mx-auto mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Draft a classroom contract covering respect and responsibility',
                        'Draft a grant proposal outline for classroom tech funding',
                        'Suggest classroom routines to build student ownership daily',
                        'Suggest 5 ways to incorporate mindfulness in classroom',
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputValue(suggestion)
                            setTimeout(() => handleSendMessage(), 100)
                          }}
                          className="group relative rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50"
                        >
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                            {suggestion}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1
              const isLastAssistantMessage = message.role === 'assistant' && isLastMessage
              const isEditing = editingMessageId === message.id

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    {isEditing && message.role === 'user' ? (
                      <div className="rounded-2xl border-2 border-blue-500 bg-white p-4 shadow-lg">
                        <textarea
                          ref={editTextareaRef}
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSaveEdit()
                            }
                            if (e.key === 'Escape') {
                              handleCancelEdit()
                            }
                          }}
                          className="w-full resize-none border-0 bg-transparent text-gray-900 focus:outline-none focus:ring-0"
                          rows={3}
                          autoFocus
                        />
                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`group relative rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                            : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        }`}
                      >
                        <div className={message.role === 'assistant' ? 'text-gray-700' : 'text-white'}>
                          {message.role === 'assistant' ? (
                            // CRITICAL: Show streaming content if this is the streaming message (like templates)
                            streamingMessageId === message.id && streamingContent ? (
                              <>
                                {renderMarkdown(streamingContent)}
                                {/* Show typing cursor during streaming */}
                                {isLoading && <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse" />}
                              </>
                            ) : (
                              renderMarkdown(message.content)
                            )
                          ) : (
                            message.content
                          )}
                        </div>
                        {/* Show generating indicator and stop button inside the message bubble when streaming */}
                        {message.role === 'assistant' && 
                         streamingMessageId === message.id && 
                         isLoading && (
                          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                            <span className="text-xs text-gray-500 font-medium">Generating...</span>
                            {canStopGeneration && (
                              <button
                                onClick={handleStopGeneration}
                                className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                              >
                                <StopCircle className="h-3 w-3" />
                                Stop
                              </button>
                            )}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {formatTimestamp(message.timestamp)}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {message.role === 'user' ? (
                              <>
                                <button
                                  onClick={() => handleEditMessage(message.id)}
                                  className={`p-1.5 rounded-lg transition ${
                                    message.role === 'user'
                                      ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title="Edit message"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  className={`p-1.5 rounded-lg transition ${
                                    message.role === 'user'
                                      ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title="Copy message"
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setMessageActionMenu(messageActionMenu === message.id ? null : message.id)
                                    }
                                    className={`p-1.5 rounded-lg transition ${
                                      message.role === 'user'
                                        ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="More options"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {messageActionMenu === message.id && (
                                    <div className="message-action-menu absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                                      <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete message
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleFeedback(message.id, 'like')}
                                  className={`p-1.5 rounded-lg transition ${
                                    likedMessages.has(message.id)
                                      ? 'text-green-600 bg-green-50'
                                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                  }`}
                                  title="Good response"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleFeedback(message.id, 'dislike')}
                                  className={`p-1.5 rounded-lg transition ${
                                    dislikedMessages.has(message.id)
                                      ? 'text-red-600 bg-red-50'
                                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                  }`}
                                  title="Poor response"
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                                  title="Copy message"
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {isLastAssistantMessage && !isLoading && (
                      <div className="flex items-center gap-2 px-1">
                        <button
                          onClick={handleRegenerateResponse}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Regenerate response
                        </button>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              )
            })}
                  </div>
              )}

          {/* Loading Indicator - Only show when loading AND no streaming content yet (before first chunk arrives) */}
          {isLoading && !streamingMessageId && !streamingContent && (
            <div className="flex gap-4 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  {thinkingState ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      <span className="text-sm text-gray-600 font-medium">{thinkingState}</span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-600 font-medium">Generating...</span>
                    </>
                  )}
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

              {insufficientCredits && (
                <div className="flex gap-4 justify-start mt-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="max-w-sm">
                    <NoCreditsCard
                      compact
                      reason={creditErrorReason}
                      onActivated={() => setInsufficientCredits(false)}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Redesigned */}
          <div className="border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="mx-auto max-w-4xl px-4 py-4">
              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file)
                    return (
                      <div
                        key={index}
                        className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                      >
                        <FileIcon className="h-4 w-4 text-gray-600" />
                        <span className="max-w-[200px] truncate text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="ml-1 rounded p-0.5 text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                {/* Upload Button - Premium Feature */}
                <div className="relative upload-menu-container">
                  <button
                    onClick={() => {
                      if (!featureAccess.file_attachments) {
                        toast.info('File attachments are available with Premium. Upgrade to access.')
                        return
                      }
                      setShowUploadMenu(!showUploadMenu)
                    }}
                    disabled={!featureAccess.file_attachments}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      featureAccess.file_attachments
                        ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    title={featureAccess.file_attachments ? 'Attach files' : 'File attachments require Premium'}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="hidden sm:inline">Attach</span>
                    {!featureAccess.file_attachments && (
                      <Lock className="h-3 w-3 ml-1" />
                    )}
                  </button>
                  {showUploadMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUploadMenu(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden upload-menu-container">
                        <div className="p-2">
                          <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Upload Options
                          </div>
                          <label
                            onClick={() => imageInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <Image className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">Images</div>
                              <div className="text-xs text-gray-500">JPG, PNG, GIF</div>
                            </div>
                            <input
                              ref={imageInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              multiple
                            />
                          </label>
                          <label
                            onClick={() => documentInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">Documents</div>
                              <div className="text-xs text-gray-500">PDF, DOC, DOCX</div>
                            </div>
                            <input
                              ref={documentInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileSelect}
                              className="hidden"
                              multiple
                            />
                          </label>
                          <label
                            onClick={() => allFilesInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                              <File className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">All Files</div>
                              <div className="text-xs text-gray-500">Any file type</div>
                            </div>
                            <input
                              ref={allFilesInputRef}
                              type="file"
                              onChange={handleFileSelect}
                              className="hidden"
                              multiple
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mode Selector */}
                <div className="relative mode-menu-container">
                  <button
                    onClick={() => setShowModeMenu(!showModeMenu)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      botModeConfig[botMode].borderColor
                    } ${botModeConfig[botMode].bgColor} ${botModeConfig[botMode].color} border-gray-300 hover:shadow-sm`}
                  >
                    {(() => {
                      const ModeIcon = botModeConfig[botMode].icon
                      return <ModeIcon className="h-4 w-4" />
                    })()}
                    <span className="hidden sm:inline">{botModeConfig[botMode].label}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showModeMenu && (
                    <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden mode-menu-container">
                      <div className="p-2">
                        {Object.entries(botModeConfig).map(([key, config]) => {
                          const ModeIcon = config.icon
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setBotMode(key as 'fastest' | 'smartest' | 'critical-thinking')
                                setShowModeMenu(false)
                              }}
                              className={`w-full flex items-start gap-3 p-3 rounded-lg transition ${
                                botMode === key
                                  ? `${config.bgColor} ${config.borderColor} border-2`
                                  : 'hover:bg-gray-50 border-2 border-transparent'
                              }`}
                            >
                              <ModeIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                              <div className="flex-1 text-left">
                                <div className={`font-semibold ${config.color}`}>{config.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{config.description}</div>
                              </div>
                              {botMode === key && (
                                <CheckCircle2 className={`h-5 w-5 ${config.color}`} />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Web Search Toggle - Premium Feature */}
                <button
                  onClick={toggleWebSearch}
                  disabled={!featureAccess.web_search}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    !featureAccess.web_search
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                      : webSearchEnabled
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={
                    !featureAccess.web_search
                      ? 'Web search requires Premium'
                      : webSearchEnabled
                      ? 'Web search enabled'
                      : 'Enable web search'
                  }
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Web</span>
                  {!featureAccess.web_search && (
                    <Lock className="h-3 w-3 ml-1" />
                  )}
                </button>

                {/* Actions Menu */}
                <div className="relative actions-menu-container">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Actions</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showActionsMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowActionsMenu(false)}
                      />
                      <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden actions-menu-container">
                        <div className="p-2">
                          <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Actions
                          </div>
                          <button
                            onClick={() => handleAction('questions')}
                            className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                          >
                            <FileQuestion className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">Questions</div>
                              <div className="text-xs text-gray-500">Generate questions</div>
                            </div>
                          </button>
                          <div className="relative length-menu-container">
                            <button
                              onClick={() => setShowLengthMenu(!showLengthMenu)}
                              className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                            >
                              <AlignLeft className="h-5 w-5 text-green-600" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">Length</div>
                                <div className="text-xs text-gray-500">{responseLengthConfig[responseLength].description}</div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                            {showLengthMenu && (
                              <div className="absolute left-full top-0 ml-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50 length-menu-container">
                                {Object.entries(responseLengthConfig).map(([key, config]) => (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      handleResponseLengthChange(key as 'short' | 'medium' | 'long')
                                      setShowLengthMenu(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm transition hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                      responseLength === key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                                  >
                                    {config.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleAction('summarize')}
                            className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                          >
                            <AlignLeft className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium text-gray-900">Summarize</div>
                              <div className="text-xs text-gray-500">Summarize content</div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleAction('custom-prompts')}
                            className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                          >
                            <Bookmark className="h-5 w-5 text-amber-600" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">Custom Prompts</div>
                              <div className="text-xs text-gray-500">
                                {customPrompts.length > 0 
                                  ? `${customPrompts.length} saved prompt${customPrompts.length > 1 ? 's' : ''}`
                                  : 'Save prompts'}
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Input Field Row */}
              <div className="flex items-end gap-2">
                {/* Input Field */}
                <div className="flex-1 rounded-xl border-2 border-gray-300 bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about teaching..."
                    rows={1}
                    className="w-full resize-none border-0 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />
                </div>

                {/* Microphone Button - Premium Feature */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!featureAccess.audio_transcription && !isRecording}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all relative ${
                    !featureAccess.audio_transcription && !isRecording
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                      : isRecording
                      ? 'border-red-300 bg-red-50 text-red-600 animate-pulse'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  title={
                    !featureAccess.audio_transcription
                      ? 'Voice input requires Premium'
                      : isRecording
                      ? 'Stop recording'
                      : 'Record audio'
                  }
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      {!featureAccess.audio_transcription && (
                        <Lock className="h-3 w-3 absolute -top-1 -right-1" />
                      )}
                    </>
                  )}
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Accessibility className="h-4 w-4" />
                <p>
                  AI may make mistakes. Check important info. Responses are generated by AI and may contain errors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <>
            {/* Overlay for mobile */}
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setShowHistory(false)}
            />
            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col lg:static lg:shadow-none lg:z-auto">
              {/* Sidebar Header */}
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
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {conversations.length > 0 && (
                  <button
                    onClick={deleteAllConversations}
                    className="mt-3 w-full text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete all conversations
                  </button>
                )}
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    {historySearchQuery ? (
                      <>
                        <Search className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">No conversations found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <History className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">No conversations yet</p>
                        <p className="text-xs text-gray-400 mt-1">Start a new chat to see it here</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => loadConversation(conversation.id)}
                        className={`group relative p-3 rounded-lg cursor-pointer transition ${
                          currentConversationId === conversation.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                              {conversation.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {conversation.message_count ?? conversation.messages?.length ?? 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(conversation.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => deleteConversation(conversation.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Custom Prompts Modal */}
        {showCustomPromptsModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCustomPromptsModal(false)}
            />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Custom Prompts</h2>
                  <button
                    onClick={() => setShowCustomPromptsModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Save and reuse your favorite prompts</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Add New Prompt */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Add New Prompt</label>
                  <div className="flex gap-2">
                    <textarea
                      value={newCustomPrompt}
                      onChange={(e) => setNewCustomPrompt(e.target.value)}
                      placeholder="Enter your custom prompt..."
                      rows={2}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (newCustomPrompt.trim()) {
                          saveCustomPrompt(newCustomPrompt)
                        }
                      }}
                      disabled={!newCustomPrompt.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Saved Prompts List */}
                {customPrompts.length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Saved Prompts ({customPrompts.length})</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {customPrompts.map((prompt, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 break-words">{prompt}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => useCustomPrompt(prompt)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition opacity-0 group-hover:opacity-100"
                              title="Use this prompt"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteCustomPrompt(index)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition opacity-0 group-hover:opacity-100"
                              title="Delete prompt"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bookmark className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No saved prompts yet</p>
                    <p className="text-xs mt-1">Create a prompt above to get started</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GeneralTeachingAssistantChat


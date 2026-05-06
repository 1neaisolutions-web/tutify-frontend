/**
 * Chatbot API client
 */
import { apiRequest, buildUrl } from './client'

export interface Chatbot {
  id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  subject: string | null
  access_level: string
  is_active: boolean
  capabilities?: Capability[]
}

export interface Capability {
  id: string
  capability_key: string
  capability_name: string
  capability_description: string | null
  capability_category: string | null
  icon_name: string | null
  display_order: number
  is_primary: boolean
  requires_input_type: string | null
}

export interface Conversation {
  id: string
  chatbot_id: string
  chatbot_slug: string | null
  chatbot_name: string | null
  title: string | null
  message_count: number
  created_at: string
  updated_at: string
}

export interface ConversationDetail {
  id: string
  chatbot_id: string
  chatbot_slug: string | null
  chatbot_name: string | null
  title: string | null
  messages: Message[]
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Record<string, any> | null
  created_at: string
}

export interface SendMessageRequest {
  message: string
  conversation_id?: string
  bot_mode?: 'fastest' | 'smartest' | 'critical-thinking'
  response_length?: 'short' | 'medium' | 'long'
  web_search?: boolean
  metadata?: Record<string, any>
}

export interface SendMessageResponse {
  conversation_id: string
  user_message: Message
  assistant_message: Message
  token_usage?: {
    prompt: number
    completion: number
    total: number
  }
  cost_estimate?: number
  model_used?: string
  provider_used?: string
}

export interface ExecuteCapabilityRequest {
  input: string
  input_type?: 'text' | 'file' | 'conversation'
  parameters?: Record<string, any>
  conversation_id?: string
  save_result?: boolean
}

export interface ExecuteCapabilityResponse {
  result: Record<string, any>
  metadata?: Record<string, any>
  usage_id?: string
  progress_update?: Record<string, any>
  conversation_id?: string
}

function notifyHistoryChanged() {
  if (typeof window === 'undefined') return
  try {
    window.dispatchEvent(new CustomEvent('history:changed'))
    // Also notify other browser tabs via storage event.
    window.localStorage?.setItem('history:last_changed', String(Date.now()))
  } catch {
    // no-op
  }
}

/**
 * List all chatbots available to the user
 */
export async function listChatbots(): Promise<Chatbot[]> {
  return apiRequest<Chatbot[]>('v1/chatbots')
}

/**
 * Get chatbot details by slug
 */
export async function getChatbot(slug: string): Promise<Chatbot> {
  return apiRequest<Chatbot>(`v1/chatbots/${slug}`)
}

/**
 * List conversations for a chatbot
 */
export async function listConversations(slug: string): Promise<Conversation[]> {
  return apiRequest<Conversation[]>(`v1/chatbots/${slug}/conversations`)
}

/**
 * Get conversation details with messages
 */
export async function getConversation(conversationId: string): Promise<ConversationDetail> {
  return apiRequest<ConversationDetail>(`v1/chatbots/conversations/${conversationId}`)
}

/** Paginated messages for long chats (newest page first; use `before` to load older). */
export interface ConversationMessagesPage {
  items: Message[]
  has_more: boolean
  next_before: string | null
}

export async function listConversationMessages(
  conversationId: string,
  opts: { limit?: number; before?: string | null } = {},
): Promise<ConversationMessagesPage> {
  return apiRequest<ConversationMessagesPage>(`v1/chatbots/conversations/${conversationId}/messages`, {
    method: 'GET',
    query: {
      limit: opts.limit ?? 50,
      before: opts.before ?? undefined,
    },
  })
}

/**
 * Send a message to a chatbot
 */
export async function sendMessage(slug: string, request: SendMessageRequest): Promise<SendMessageResponse> {
  return apiRequest<SendMessageResponse>(`v1/chatbots/${slug}/messages`, {
    method: 'POST',
    body: request, // apiRequest will JSON.stringify it
  })
}

/**
 * Send a message to a chatbot with streaming response
 * Returns an async generator that yields chunks of the response
 */
export async function* sendMessageStream(
  slug: string,
  request: SendMessageRequest,
  signal?: AbortSignal
): AsyncGenerator<{ type: 'thinking' | 'content' | 'done' | 'error'; data?: any; content?: string }, void, unknown> {
  // CRITICAL: Always use streaming endpoint - never fallback to non-streaming
  // This MUST call /messages/stream, NOT /messages
  const url = buildUrl(`v1/chatbots/${slug}/messages/stream`)
  
  // Get auth token from localStorage
  const persistState = localStorage.getItem('persist:root')
  let token = null
  if (persistState) {
    try {
      const parsed = JSON.parse(persistState)
      const authState = parsed?.auth ? JSON.parse(parsed.auth) : null
      token = authState?.user?.token
    } catch (e) {
      console.warn('[sendMessageStream] Could not get token from localStorage')
    }
  }

  try {
      const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          // Explicitly request SSE streaming
          Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(request),
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Request failed' }))
      console.error('[sendMessageStream] Request failed:', errorData)
      yield { type: 'error', data: errorData }
      return
    }

    if (!response.body) {
      yield { type: 'error', data: { detail: 'No response body' } }
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      // CRITICAL: Process SSE stream line-by-line immediately (like templates)
      // This ensures word-by-word streaming like GPT
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          // Process any remaining buffer before ending
          if (buffer.trim()) {
            const lines = buffer.split('\n').filter((l) => l.trim())
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.slice(6).trim()
                  if (jsonStr) {
                    const data = JSON.parse(jsonStr)
                    if (data.type === 'content' && data.content) {
                      yield { type: 'content', content: data.content }
                    } else if (data.type === 'done') {
                      yield { type: 'done', data: data.data }
                      return
                    }
                  }
                } catch (e) {
                  // Ignore parse errors in final buffer
                }
              }
            }
          }
          yield { type: 'done' }
          break
        }

        // CRITICAL: Decode chunk immediately and process line-by-line (like templates)
        // Do not wait for full "\n\n" events; process each data line as soon as it arrives
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        // Keep the last partial line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue

          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim()
              if (!jsonStr) continue

              const data = JSON.parse(jsonStr)

              // Yield immediately per chunk (word-by-word)
              if (data.type === 'thinking') {
                // Skip thinking for speed
              } else if (data.type === 'content') {
                yield { type: 'content', content: data.content || '' }
              } else if (data.type === 'done') {
                yield { type: 'done', data: data.data }
                return
              } else if (data.type === 'error') {
                yield { type: 'error', data: data.data }
                return
              }
            } catch {
              // Ignore parse errors to keep stream alive
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      yield { type: 'done' }
      return
    }
    yield { type: 'error', data: { detail: error.message || 'Stream error' } }
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  return apiRequest<void>(`v1/chatbots/conversations/${conversationId}`, {
    method: 'DELETE',
  })
}

/**
 * Execute a chatbot capability
 */
export async function executeCapability(
  slug: string,
  capabilityKey: string,
  request: ExecuteCapabilityRequest
): Promise<ExecuteCapabilityResponse> {
  // Some capabilities don't require an input, but the backend enforces a min length of 1.
  // Normalize empty inputs to a single space to avoid 422 validation errors.
  const normalizedRequest: ExecuteCapabilityRequest = {
    ...request,
    input: request.input?.length ? request.input : ' ',
  }
  const res = await apiRequest<ExecuteCapabilityResponse>(`v1/chatbots/${slug}/capabilities/${capabilityKey}`, {
    method: 'POST',
    body: normalizedRequest, // apiRequest will JSON.stringify it
  })
  // Capability execution may create/update a History row (chatbot_conversation)
  if (normalizedRequest.save_result !== false) {
    notifyHistoryChanged()
  }
  return res
}

export async function logChatbotHistory(
  slug: string,
  body: {
    title?: string
    user_content: string
    assistant_content: string
    metadata?: Record<string, any>
    conversation_id?: string
  },
): Promise<{ conversation_id: string }> {
  const res = await apiRequest<{ conversation_id: string }>(`v1/chatbots/${slug}/history-log`, {
    method: 'POST',
    body,
  })
  notifyHistoryChanged()
  return res
}

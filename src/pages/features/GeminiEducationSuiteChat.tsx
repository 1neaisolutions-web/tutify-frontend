import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  Brain,
  User,
  Copy,
  Plus,
  Loader2,
  Sparkles,
  History,
  X,
  Search,
  MessageSquare,
  Calendar,
  MoreVertical,
  StopCircle,
  Globe,
  Image as ImageIcon,
  Mic,
  Languages,
  Zap,
  Layout,
  FileText,
  Download
} from 'lucide-react'
import MultimodalUpload from '../../components/premium/MultimodalUpload'
import ExportDialog from '../../components/premium/ExportDialog'
import { Standard, MultimodalFile } from '../../types/premium'
import { Message } from './GeneralTeachingAssistantChat'
import { generateGeminiResponse, languages, analyzeMultimodalInput } from '../../utils/geminiUtils'
import * as chatbotApi from '../../api/chatbots'
import { useRestoreChatbotConversationFromUrl } from '../../hooks/useRestoreChatbotConversationFromUrl'

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  language: string
}

const GeminiEducationSuiteChat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  
  // Gemini specific state
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [gradeLevel, setGradeLevel] = useState('')
  const [subject, setSubject] = useState('')
  const [multimodalFiles, setMultimodalFiles] = useState<MultimodalFile[]>([])
  const [showMultimodalUpload, setShowMultimodalUpload] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load conversations
  useEffect(() => {
    const savedConversations = localStorage.getItem('gemini-education-suite-conversations')
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
    }
  }, [])

  // Save conversations
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('gemini-education-suite-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  // Auto-scroll
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

  useRestoreChatbotConversationFromUrl('gemini-education-suite-current-conversation', async (convId) => {
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
          language: 'en',
        }
        return [conv, ...prev]
      })
    } catch (e) {
      console.error('Failed to restore conversation from history', e)
    }
  })

  const createNewConversation = () => {
    setCurrentConversationId(null)
    setMessages([])
    setInputValue('')
    setMultimodalFiles([])
    setSelectedLanguage('en')
  }

  const saveConversation = (newMessages: Message[]) => {
    if (newMessages.length === 0) return

    const now = new Date()
    const title = newMessages[0].content.slice(0, 50) + (newMessages[0].content.length > 50 ? '...' : '')

    if (currentConversationId) {
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: newMessages, updatedAt: now, title: newMessages.length > 1 ? title : conv.title }
          : conv
      ))
    } else {
      const newId = `gemini-${Date.now()}`
      const newConv: Conversation = {
        id: newId,
        title,
        messages: newMessages,
        createdAt: now,
        updatedAt: now,
        language: selectedLanguage
      }
      setConversations(prev => [newConv, ...prev])
      setCurrentConversationId(newId)
    }
  }

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && multimodalFiles.length === 0) || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    // Append file info to user message content for display if needed, or handle separately
    if (multimodalFiles.length > 0) {
      userMessage.content += `\n\n[Attached: ${multimodalFiles.map(f => f.file.name).join(', ')}]`
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)
    
    // Save immediately so user sees their message
    saveConversation(newMessages)

    try {
      // Analyze files if any
      if (multimodalFiles.length > 0) {
        for (const file of multimodalFiles) {
           await analyzeMultimodalInput(file.file) // Just simulating delay/processing
        }
      }

      const responseText = await generateGeminiResponse({
        prompt: inputValue,
        gradeLevel,
        subject,
        language: selectedLanguage,
        multimodalFiles
      })

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }

      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)
      saveConversation(updatedMessages)
      
      // Clear files after sending
      setMultimodalFiles([]) 
    } catch (error) {
      console.error('Gemini Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={idx}>{line.slice(2, -2)}</strong>
      if (line.startsWith('**') && line.includes(':')) {
         const parts = line.split(':')
         return <div key={idx}><strong>{parts[0].replace(/\*\*/g, '')}:</strong>{parts.slice(1).join(':')}</div>
      }
      if (line.startsWith('- ')) return <div key={idx} className="ml-4 flex gap-2"><span className="text-gray-400">•</span> <span>{line.slice(2)}</span></div>
      if (line.match(/^\d+\./)) return <div key={idx} className="ml-4 mb-1 font-medium text-gray-800">{line}</div>
      return <div key={idx} className="min-h-[1.2em]">{line}</div>
    })
  }

  // Google Brand Colors for UI accents
  // Blue: #4285F4, Red: #DB4437, Yellow: #F4B400, Green: #0F9D58
  
  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/chatbots')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 opacity-20 blur-lg rounded-full"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">Gemini Education Suite</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">PRO</span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                 <Globe className="h-3 w-3" /> Multilingual • <ImageIcon className="h-3 w-3" /> Multimodal
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={createNewConversation}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-full transition ${showHistory ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <History className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 py-8">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                  <div className="w-20 h-20 mb-6 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4 ring-4 ring-blue-50">
                     <Sparkles className="w-full h-full text-blue-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    <span className="text-blue-600">Gemini</span> Education Suite
                  </h2>
                  <p className="text-gray-600 max-w-lg mb-8">
                    Supercharge your teaching with Google's most capable AI. Analyze images, translate content instantly, and get K-12 fine-tuned support.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                    <button onClick={() => setInputValue("Analyze this diagram for a 5th grade science class...")} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100"><ImageIcon className="h-5 w-5" /></div>
                        <h3 className="font-semibold text-gray-900">Multimodal Analysis</h3>
                      </div>
                      <p className="text-sm text-gray-500">Upload images or charts for instant educational breakdown.</p>
                    </button>
                    
                    <button onClick={() => setInputValue("Create a lesson plan for Spanish speakers learning English...")} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition group">
                       <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100"><Languages className="h-5 w-5" /></div>
                        <h3 className="font-semibold text-gray-900">Multilingual Support</h3>
                      </div>
                      <p className="text-sm text-gray-500">Generate content in 40+ languages with cultural nuance.</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {messages.map((message, index) => (
                    <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-800 border border-gray-100'
                      }`}>
                         {message.role === 'assistant' ? (
                           <div className="text-sm leading-relaxed space-y-2">
                             {renderMarkdown(message.content)}
                             
                             <div className="mt-4 flex items-center gap-2 pt-2 border-t border-gray-100">
                               <button onClick={() => {
                                 navigator.clipboard.writeText(message.content)
                               }} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition" title="Copy">
                                 <Copy className="h-4 w-4" />
                               </button>
                               <button onClick={() => setShowExportDialog(true)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition" title="Export">
                                 <Download className="h-4 w-4" />
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div className="text-sm">{message.content}</div>
                         )}
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                       </div>
                       <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm flex items-center gap-3">
                         <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                         <span className="text-sm text-gray-500">Gemini is processing...</span>
                       </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Controls */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white hover:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer"
                >
                  {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
                
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white hover:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer"
                >
                  <option value="">Grade Level</option>
                  {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>

                <select
                   value={subject}
                   onChange={(e) => setSubject(e.target.value)}
                   className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white hover:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer"
                >
                  <option value="">Subject</option>
                  {['Math', 'Science', 'English', 'History', 'Art', 'Music', 'PE'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <button 
                  onClick={() => setShowMultimodalUpload(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition ${
                    multimodalFiles.length > 0 
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  {multimodalFiles.length > 0 ? `${multimodalFiles.length} File(s)` : 'Add Media'}
                </button>
              </div>

              {/* Text Input */}
              <div className="relative rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Gemini anything... (Try uploading an image or changing language)"
                  className="w-full resize-none bg-transparent px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none max-h-40"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={(!inputValue.trim() && multimodalFiles.length === 0) || isLoading}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                 <p className="text-xs text-gray-400">Gemini Education Suite may display inaccurate info, including about people, so double-check its responses.</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Sidebar (Responsive) */}
        {showHistory && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">History</h2>
              <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-2 flex-1 overflow-y-auto space-y-1">
              {conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No history yet</div>
              ) : (
                conversations
                  .filter(c => c.title.toLowerCase().includes(historySearchQuery.toLowerCase()))
                  .map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setCurrentConversationId(conv.id)
                      setMessages(conv.messages)
                      setSelectedLanguage(conv.language || 'en')
                      setShowHistory(false)
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="font-medium text-gray-900 truncate">{conv.title}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                      <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showMultimodalUpload && (
        <MultimodalUpload
          onFilesSelected={(files) => {
            setMultimodalFiles(prev => [...prev, ...files])
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
    </div>
  )
}

export default GeminiEducationSuiteChat




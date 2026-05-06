import { ChangeEvent, FormEvent, useEffect, useMemo, useState, useRef } from 'react'
import { ArrowLeft, Loader2, Copy, Check, RefreshCw, FileText, Send, ChevronDown, ChevronUp, Download, Printer, Edit, Languages, Volume2, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import TurndownService from 'turndown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { fetchTemplateDetail, fetchTemplateExecution } from '../../api/templates'
import { TemplateResponse } from '../../api/types'
import { useTemplateStream } from '../../hooks/useTemplateStream'
import { useRefreshCreditBalance } from '../../hooks/useRefreshCreditBalance'
import { composeAiDocumentFromSections } from '../../lib/aiDocument'
import { AiDocumentRenderer } from '../../components/ai/AiDocumentRenderer'
import { normalizeStreamingContent } from '../../components/ai/SectionRenderer'
import NoCreditsCard from '../../components/NoCreditsCard'

type TemplateField = {
  name: string
  type: string
  label?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  min?: number
  max?: number
  default?: string
}

const TemplateRunner = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const executionParam = searchParams.get('execution')
  const restoreDoneRef = useRef<string | null>(null)
  const [template, setTemplate] = useState<TemplateResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [parsedOutput, setParsedOutput] = useState<Record<string, any> | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPromptEditor, setShowPromptEditor] = useState(true)
  const [showOutput, setShowOutput] = useState(false)
  const [exemplarNotice, setExemplarNotice] = useState<string | null>(null)
  
  const refreshCreditBalance = useRefreshCreditBalance()
  const {
    content: streamedContent,
    formattedContent,
    sections,
    sectionsSchema,
    isStreaming,
    completedSectionKeys,
    error: streamError,
    executionId,
    providerFailedNotice,
    insufficientCredits,
    startStream,
    stopStream,
    reset: resetStream,
  } = useTemplateStream()

  // Initialize Turndown service for HTML to Markdown conversion (future-proof)
  const turndownServiceRef = useRef<TurndownService | null>(null)
  const exemplarNoticeTimeoutRef = useRef<number | null>(null)
  
  useEffect(() => {
    // Initialize turndown service with optimal settings for markdown output
    turndownServiceRef.current = new TurndownService({
      headingStyle: 'atx', // Use ## for headings (not ===)
      codeBlockStyle: 'fenced', // Use ``` for code blocks
      bulletListMarker: '-', // Use - for bullet lists
      emDelimiter: '*', // Use * for emphasis
      strongDelimiter: '**', // Use ** for bold
      linkStyle: 'inlined', // Inline links [text](url)
      linkReferenceStyle: 'full', // Full reference links
    })

    // Add custom rules to preserve formatting
    if (turndownServiceRef.current) {
      // Preserve heading levels - ensure proper markdown format
      turndownServiceRef.current.addRule('heading', {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        replacement: function (content, node) {
          const level = (node as HTMLElement).tagName.charAt(1)
          const prefix = '#'.repeat(parseInt(level))
          return `${prefix} ${content}\n\n`
        }
      })

      // Preserve list formatting with proper indentation
      turndownServiceRef.current.addRule('listItem', {
        filter: 'li',
        replacement: function (content, node, options) {
          let formattedContent = content
            .replace(/^\n+/, '') // remove leading newlines
            .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
            .replace(/\n/gm, '\n    ') // indent nested content
          
          const parent = node.parentNode
          let prefix = options.bulletListMarker + ' '
          
          if (parent && parent.nodeName === 'OL') {
            const start = (parent as HTMLOListElement).start || 1
            const index = Array.prototype.indexOf.call(parent.children, node)
            prefix = (start + index) + '. '
          }
          
          return prefix + formattedContent + (node.nextSibling && !/\n$/.test(formattedContent) ? '\n' : '')
        }
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      if (exemplarNoticeTimeoutRef.current) {
        window.clearTimeout(exemplarNoticeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!slug) {
      setError('Template not found.')
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchTemplateDetail(slug, controller.signal)
      .then((data) => {
        setTemplate(data)
        setParsedOutput(null)
        resetStream()
        setShowOutput(false)
        setExemplarNotice(null)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Unable to load template.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [slug])

  const schemaFields = useMemo<TemplateField[]>(() => {
    if (!template?.inputSchema) {
      console.warn('Template has no inputSchema:', template)
      return []
    }
    
    const schema = template.inputSchema as any
    console.log('Parsing input_schema:', schema)
    
    // Check if it's already in the expected format (with fields array)
    if (schema.fields && Array.isArray(schema.fields)) {
      const fields = schema.fields.filter((field: any): field is TemplateField => 
        Boolean(field?.name && field?.type)
      )
      // Summative Assessment: ensure we do not show differentiation fields
      const filteredFields = template?.slug === 'summative_assessment'
        ? fields.filter((f) => !f.name.toLowerCase().includes('differentiation'))
        : fields
      console.log('Using fields array format:', filteredFields)
      return filteredFields
    }
    
    // Convert JSON Schema format to frontend format
    // Backend uses JSON Schema: { type: "object", properties: {...}, required: [...] }
    if (schema.type === 'object' && schema.properties) {
      const properties = schema.properties as Record<string, any>
      const required = Array.isArray(schema.required) ? schema.required : []
      
      const fields = Object.entries(properties).map(([name, prop]): TemplateField => {
        // Map JSON Schema types to frontend types
        let fieldType = 'text'
        if (prop.type === 'string') {
          if (prop.enum) {
            fieldType = 'select'
          } else if (prop.format === 'textarea' || 
                     name.toLowerCase().includes('description') || 
                     name.toLowerCase().includes('notes') ||
                     name.toLowerCase().includes('objective') ||
                     name.toLowerCase().includes('differentiation')) {
            fieldType = 'textarea'
          } else {
            fieldType = 'text'
          }
        } else if (prop.type === 'integer' || prop.type === 'number') {
          fieldType = 'number'
        } else if (prop.type === 'boolean') {
          fieldType = 'select' // We'll handle boolean as select with yes/no
        } else if (prop.type === 'array' && prop.items?.type === 'string') {
          fieldType = 'array' // Render as textarea; payload will split into string[]
        }
        
        // Format label from property name
        const label = prop.title || 
                     prop.description || 
                     name.replace(/_/g, ' ')
                         .replace(/\b\w/g, l => l.toUpperCase())
        
        return {
          name,
          type: fieldType,
          label,
          placeholder: prop.description || `Enter ${name.replace(/_/g, ' ')}`,
          required: required.includes(name),
          options: prop.enum || (prop.type === 'boolean' ? ['true', 'false'] : undefined),
          min: prop.minimum,
          max: prop.maximum,
          default: prop.default ? String(prop.default) : undefined,
        }
      }).filter((field): field is TemplateField => Boolean(field?.name && field?.type))
      
      // Summative Assessment: ensure we do not show differentiation fields
      const filteredFields = template?.slug === 'summative_assessment'
        ? fields.filter((f) => !f.name.toLowerCase().includes('differentiation'))
        : fields
      
      console.log('Converted JSON Schema to fields:', filteredFields)
      return filteredFields
    }
    
    console.warn('Unknown input_schema format:', schema)
    return []
  }, [template])

  // Initialize formValues synchronously with schemaFields
  const initialFormValues = useMemo(() => {
    if (schemaFields.length === 0) return {}
    const initial: Record<string, string> = {}
    schemaFields.forEach((field) => {
      // Use default value from schema if available, otherwise empty string
      initial[field.name] = field.default || ''
    })
    return initial
  }, [schemaFields])

  useEffect(() => {
    setFormValues(initialFormValues)
  }, [initialFormValues])

  useEffect(() => {
    restoreDoneRef.current = null
  }, [slug])

  // History → Open: restore form + output from saved execution (`?execution=<id>`)
  useEffect(() => {
    if (!template?.slug || !slug || !executionParam || schemaFields.length === 0) {
      return
    }
    const doneKey = `${slug}:${executionParam}`
    if (restoreDoneRef.current === doneKey) {
      return
    }

    let cancelled = false
    const ac = new AbortController()

    const stripExecutionParam = () => {
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev)
        n.delete('execution')
        return n
      }, { replace: true })
    }

    ;(async () => {
      try {
        const exec = await fetchTemplateExecution(executionParam, ac.signal)
        if (cancelled) {
          return
        }
        if (exec.template_slug !== slug) {
          console.warn('[TemplateRunner] Execution slug mismatch:', exec.template_slug, slug)
          stripExecutionParam()
          return
        }

        const nextValues: Record<string, string> = { ...initialFormValues }
        schemaFields.forEach((field) => {
          const raw = exec.input_data[field.name]
          if (raw === null || raw === undefined) {
            return
          }
          if (typeof raw === 'string') {
            nextValues[field.name] = raw
          } else if (typeof raw === 'number' || typeof raw === 'boolean') {
            nextValues[field.name] = String(raw)
          } else if (Array.isArray(raw)) {
            nextValues[field.name] = raw.map((x) => String(x)).join('\n')
          } else {
            nextValues[field.name] = JSON.stringify(raw)
          }
        })
        setFormValues(nextValues)

        if (exec.output_data && typeof exec.output_data === 'object' && Object.keys(exec.output_data).length > 0) {
          setParsedOutput(exec.output_data as Record<string, any>)
        } else {
          setParsedOutput(null)
        }
        setSubmitError(null)
        setExemplarNotice(null)
        setShowOutput(true)
        setShowPromptEditor(false)
        resetStream()
        restoreDoneRef.current = doneKey
        stripExecutionParam()
      } catch (err) {
        if (cancelled) {
          return
        }
        console.error('[TemplateRunner] Failed to restore execution:', err)
        stripExecutionParam()
      }
    })()

    return () => {
      cancelled = true
      ac.abort()
    }
  }, [
    template?.slug,
    slug,
    executionParam,
    schemaFields,
    initialFormValues,
    setSearchParams,
    resetStream,
  ])

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  // Parse markdown from backend stream into sections (matches output_schema structure)
  const parseMarkdownToSections = (markdown: string): Record<string, string> | null => {
    if (!markdown?.trim()) return null
    const sections: Record<string, string> = {}
    // Split by # or ## headings (backend dict_to_markdown uses # for top-level)
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    let match: RegExpExecArray | null
    let lastKey: string | null = null
    let lastEnd = 0
    while ((match = headingRegex.exec(markdown)) !== null) {
      if (lastKey !== null) {
        const content = markdown.slice(lastEnd, match.index).trim()
        if (content) sections[lastKey] = content
      }
      lastKey = match[2].trim()
      lastEnd = headingRegex.lastIndex
    }
    if (lastKey !== null) {
      const content = markdown.slice(lastEnd).trim()
      if (content) sections[lastKey] = content
    }
    return Object.keys(sections).length > 0 ? sections : null
  }

  // When section-based stream completes, set parsedOutput from sections (for copy/export)
  useEffect(() => {
    if (!isStreaming && sections.length > 0 && (executionId || providerFailedNotice)) {
      setParsedOutput(Object.fromEntries(sections.map((s) => [s.key, s.content])))
    }
  }, [isStreaming, executionId, sections, providerFailedNotice])

  useEffect(() => {
    if (providerFailedNotice) {
      setSubmitError(null)
    }
  }, [providerFailedNotice])

  // Parse final content when streaming completes (legacy blob or fallback)
  useEffect(() => {
    if (!isStreaming && streamedContent && executionId && sections.length === 0) {
      try {
        let parsed: Record<string, any> | null = null
        try {
          parsed = JSON.parse(streamedContent.trim())
          if (!parsed || typeof parsed !== 'object') parsed = null
        } catch {
          const jsonMatches = streamedContent.match(/\{[\s\S]*\}/g)
          if (jsonMatches?.length) {
            const largest = jsonMatches.reduce((a, b) => (a.length > b.length ? a : b))
            try {
              parsed = JSON.parse(largest)
            } catch {
              try {
                parsed = JSON.parse(jsonMatches[0])
              } catch {
                try {
                  parsed = JSON.parse(
                    streamedContent
                      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
                      .replace(/'/g, '"')
                  )
                } catch {
                  parsed = null
                }
              }
            }
          }
        }
        if (!parsed && streamedContent.includes('#')) {
          parsed = parseMarkdownToSections(streamedContent)
        }
        if (parsed) setParsedOutput(parsed)
      } catch (err) {
        console.error('Failed to parse streamed content:', err)
      }
    }
  }, [isStreaming, streamedContent, executionId, sections.length])

  useEffect(() => {
    if (insufficientCredits) {
      setShowOutput(false)
      setShowPromptEditor(true)
      return
    }
    if (streamError) {
      if (streamError.toLowerCase().includes('credit')) {
        setShowOutput(false)
      } else {
        setSubmitError(streamError)
      }
    }
  }, [streamError, insufficientCredits])

  // Professional auto-scroll during streaming (like ChatGPT)
  // Continuously scroll to bottom as content streams in
  useEffect(() => {
    if (isStreaming && formattedContent) {
      // Scroll to bottom smoothly as content streams
      const scrollToBottom = () => {
        // Get the streaming text element
        const streamingText = document.getElementById('streaming-text')
        const outputContainer = document.getElementById('ai-output-content')
        
        if (streamingText) {
          // Scroll the element into view at the bottom
          streamingText.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          })
        } else if (outputContainer) {
          // Fallback: scroll the container
          outputContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end'
          })
        } else {
          // Final fallback: scroll window to bottom
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          })
        }
      }
      
      // Use requestAnimationFrame for smooth, continuous scrolling
      const rafId = requestAnimationFrame(() => {
        scrollToBottom()
      })
      
      return () => {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isStreaming, formattedContent])

  // Initial scroll to output when it first appears
  useEffect(() => {
    if (showOutput && !isStreaming) {
      setTimeout(() => {
        const outputElement = document.getElementById('ai-output')
        if (outputElement) {
          outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [showOutput])

  const exemplarValueToDisplayText = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)

    if (Array.isArray(value)) {
      const allStrings = value.every((x) => typeof x === 'string')
      if (allStrings) {
        return (value as string[]).map((s) => `- ${s}`).join('\n')
      }
      return value
        .map((item) => {
          if (typeof item === 'string') return `- ${item}`
          if (item && typeof item === 'object') {
            const obj = item as Record<string, unknown>
            const name = typeof obj.name === 'string' ? obj.name : ''
            const url = typeof obj.url === 'string' ? obj.url : ''
            const description = typeof obj.description === 'string' ? obj.description : ''
            if (name || url || description) {
              const lines = [`- **${name || 'Item'}**`]
              if (url) lines.push(`  - URL: ${url}`)
              if (description) lines.push(`  - ${description}`)
              return lines.join('\n')
            }
          }
          return `- ${JSON.stringify(item)}`
        })
        .join('\n\n')
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }

    return String(value)
  }

  const buildExemplarParsedOutput = (exemplarOutput: Record<string, unknown>): Record<string, string> => {
    const converted: Record<string, string> = {}
    Object.entries(exemplarOutput).forEach(([key, value]) => {
      converted[key] = exemplarValueToDisplayText(value)
    })
    return converted
  }

  const handleShowExemplar = () => {
    if (!template?.exemplarInput || !template?.exemplarOutput) return

    resetStream()
    setSubmitError(null)
    const nextValues: Record<string, string> = {}
    schemaFields.forEach((field) => {
      const raw = (template.exemplarInput as Record<string, unknown>)[field.name]
      if (raw === null || raw === undefined) {
        nextValues[field.name] = ''
      } else if (typeof raw === 'string') {
        nextValues[field.name] = raw
      } else if (typeof raw === 'number' || typeof raw === 'boolean') {
        nextValues[field.name] = String(raw)
      } else if (Array.isArray(raw)) {
        nextValues[field.name] = raw.map((x) => String(x)).join('\n')
      } else {
        nextValues[field.name] = JSON.stringify(raw)
      }
    })
    setFormValues(nextValues)

    setParsedOutput(buildExemplarParsedOutput(template.exemplarOutput as Record<string, unknown>))
    setShowOutput(true)

    if (exemplarNoticeTimeoutRef.current) {
      window.clearTimeout(exemplarNoticeTimeoutRef.current)
    }
    setExemplarNotice('Exemplar is ready!')
    exemplarNoticeTimeoutRef.current = window.setTimeout(() => setExemplarNotice(null), 3000)

    setTimeout(() => {
      const outputElement = document.getElementById('ai-output')
      if (outputElement) {
        outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 120)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    setExemplarNotice(null)
    if (!template || !slug) return

    // Prevent duplicate API calls if already streaming
    if (isStreaming) {
      return
    }

    const missing = schemaFields.filter((field) => field.required && !formValues[field.name]?.trim())
    if (missing.length > 0) {
      setSubmitError(`Please fill in: ${missing.map((field) => field.label ?? field.name).join(', ')}`)
      return
    }

    // Collapse prompt editor and show output when generation starts
    setShowPromptEditor(false)
    setShowOutput(true)

    // Build payload from form values
    const payload: Record<string, unknown> = {}
    schemaFields.forEach((field) => {
      const raw = formValues[field.name]
      if (!raw || raw.trim() === '') {
        return
      }
      
      // Convert based on field type
      if (field.type === 'number') {
        const numericValue = Number(raw)
        payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
      } else if (field.type === 'select' && field.options) {
        // For select fields, use the value as-is
        // For boolean fields, convert string to boolean
        if (field.options.length === 2 && field.options.includes('true') && field.options.includes('false')) {
          payload[field.name] = raw === 'true'
        } else {
          payload[field.name] = raw
        }
      } else if (field.type === 'array') {
        // Array of strings: split by newline or comma
        payload[field.name] = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      } else {
        // Text, textarea, etc.
        payload[field.name] = raw.trim()
      }
    })

    // Normalize assessment-specific fields for backend schema
    if (payload.question_types) {
      const raw = String(payload.question_types)
      const tokens = raw
        .split(/[,;/]|and|\n/gi)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
      const mapped = tokens.map((t) => {
        if (t.includes('mcq') || t.includes('multiple')) return 'MCQ'
        if (t.includes('short')) return 'short_answer'
        if (t.includes('essay')) return 'essay'
        if (t.includes('diagram') || t.includes('label')) return 'diagram'
        if (t.includes('match')) return 'matching'
        return ''
      }).filter(Boolean)
      if (mapped.length > 0) {
        payload.question_types = mapped
      } else {
        delete payload.question_types
      }
    }

    if (payload.difficulty) {
      payload.difficulty = String(payload.difficulty).toLowerCase()
    }

    if (payload.bloom_level) {
      payload.bloom_level = String(payload.bloom_level).toLowerCase()
    }

    // Start streaming (pass exemplar for provider-failure fallback)
    startStream(slug, payload, {
      exemplarOutput: template?.exemplarOutput ?? undefined,
      outputSchema: template?.outputSchema ?? undefined,
      onSuccessfulCompletion: () => {
        void refreshCreditBalance()
      },
    })
  }

  const handleRegenerate = () => {
    if (!template || !slug) return
    setExemplarNotice(null)
    
    // Prevent duplicate API calls if already streaming
    if (isStreaming) {
      return
    }
    
    // Build payload from form values (same logic as handleSubmit)
    const payload: Record<string, unknown> = {}
    schemaFields.forEach((field) => {
      const raw = formValues[field.name]
      if (!raw || raw.trim() === '') {
        return
      }
      
      // Convert based on field type
      if (field.type === 'number') {
        const numericValue = Number(raw)
        payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
      } else if (field.type === 'select' && field.options) {
        if (field.options.length === 2 && field.options.includes('true') && field.options.includes('false')) {
          payload[field.name] = raw === 'true'
        } else {
          payload[field.name] = raw
        }
      } else if (field.type === 'array') {
        payload[field.name] = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      } else {
        payload[field.name] = raw.trim()
      }
    })

    // Normalize assessment-specific fields for backend schema
    if (payload.question_types) {
      const raw = String(payload.question_types)
      const tokens = raw
        .split(/[,;/]|and|\n/gi)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
      const mapped = tokens.map((t) => {
        if (t.includes('mcq') || t.includes('multiple')) return 'MCQ'
        if (t.includes('short')) return 'short_answer'
        if (t.includes('essay')) return 'essay'
        if (t.includes('diagram') || t.includes('label')) return 'diagram'
        if (t.includes('match')) return 'matching'
        return ''
      }).filter(Boolean)
      if (mapped.length > 0) {
        payload.question_types = mapped
      } else {
        delete payload.question_types
      }
    }

    if (payload.difficulty) {
      payload.difficulty = String(payload.difficulty).toLowerCase()
    }

    if (payload.bloom_level) {
      payload.bloom_level = String(payload.bloom_level).toLowerCase()
    }
    
    // Reset and start new stream
    resetStream()
    setParsedOutput(null)
    setShowOutput(true)
    startStream(slug, payload, {
      exemplarOutput: template?.exemplarOutput ?? undefined,
      outputSchema: template?.outputSchema ?? undefined,
      onSuccessfulCompletion: () => {
        void refreshCreditBalance()
      },
    })
  }

  // Convert parsed output to markdown format that matches the display exactly
  const convertParsedToMarkdown = (output: Record<string, any>): string => {
    // Sections to exclude
    const excludedSections = ['BLOOM_ALIGNMENT', 'bloom_alignment', 'SAFETY_PRECAUTIONS', 'safety_precautions', 'TEACHER_NOTES', 'teacher_notes']
    
    // Filter out excluded sections
    const filteredOutput = Object.fromEntries(
      Object.entries(output).filter(([key]) => !excludedSections.includes(key.toUpperCase()))
    )

    let markdown = ''
    
    // Helper to format values preserving markdown structure
    const formatValue = (val: any): string => {
      if (val === null || val === undefined) return ''
      
      if (typeof val === 'string') {
        // If it's already markdown-like with headings or lists, return as-is
        if (val.includes('##') || val.includes('# ') || val.includes('\n- ') || val.match(/^\s*[-•*]\s/m)) {
          return val
        }
        // Plain text - return as-is (will be formatted by section handler)
        return val.trim()
      }
      
      if (Array.isArray(val)) {
        return val
          .filter(item => item !== null && item !== undefined)
          .map(item => {
            if (typeof item === 'string') {
              // Check if it already has markdown formatting
              if (item.includes('**') || item.includes('- ')) {
                return item.trim()
              }
              return `- ${item.trim()}`
            } else if (typeof item === 'object') {
              // Handle objects in arrays - format as "**key**: value"
              const entries = Object.entries(item)
              if (entries.length === 1) {
                return `- ${entries[0][1]}`
              } else {
                // Multiple key-value pairs - format each
                return entries.map(([k, v]) => {
                  const keyFormatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  return `- **${keyFormatted}**: ${String(v).trim()}`
                }).join('\n')
              }
            }
            return `- ${String(item).trim()}`
          })
          .join('\n')
      }
      
      if (typeof val === 'object') {
        // Handle nested objects - convert to bullet list with bold keys
        return Object.entries(val)
          .map(([k, v]) => {
            const keyFormatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            if (typeof v === 'string') {
              return `- **${keyFormatted}**: ${v.trim()}`
            } else if (Array.isArray(v)) {
              const items = v.map(item => typeof item === 'string' ? item : String(item))
              return `- **${keyFormatted}**: ${items.join(', ')}`
            } else if (typeof v === 'object') {
              const nested = Object.entries(v).map(([nk, nv]) => `${nk}: ${nv}`).join(', ')
              return `- **${keyFormatted}**: ${nested}`
            }
            return `- **${keyFormatted}**: ${String(v)}`
          })
          .join('\n')
      }
      
      return String(val || '')
    }

    // Process each section maintaining exact format
    Object.entries(filteredOutput).forEach(([key, value]) => {
      // Skip empty values
      if (value === null || value === undefined || value === '') return
      
      // Format section title - convert to display format
      let sectionTitle = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      
      // Determine heading level and format
      let heading = ''
      const keyLower = key.toLowerCase()
      if (keyLower.includes('title') || keyLower === 'lesson_title') {
        // H1 for titles
        heading = `# ${sectionTitle}`
      } else {
        // H2 for sections - uppercase like "LEARNING OBJECTIVE"
        heading = `## ${sectionTitle.toUpperCase().replace(/\s+/g, ' ')}`
      }
      
      markdown += `${heading}\n\n`
      
      // Format the content preserving structure
      if (typeof value === 'string') {
        // String content - check if already formatted
        if (value.includes('##') || value.includes('# ') || value.match(/^\s*[-•*]\s/m)) {
          // Already has markdown, use as-is
          markdown += `${value}\n\n`
        } else {
          // Plain text - split by lines and format
          const lines = value.split('\n').filter(line => line.trim())
          lines.forEach(line => {
            const trimmed = line.trim()
            if (trimmed) {
              // Check if it looks like a list item
              if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
                markdown += `${trimmed}\n`
              } else {
                // Regular paragraph
                markdown += `${trimmed}\n\n`
              }
            }
          })
          if (lines.length > 0) markdown += '\n'
        }
      } else if (Array.isArray(value)) {
        // Array - format as bullet list
        value.forEach(item => {
          if (typeof item === 'string') {
            // Check if already formatted
            if (item.includes('**') || item.startsWith('- ')) {
              markdown += `${item.trim()}\n`
            } else {
              markdown += `- ${item.trim()}\n`
            }
          } else if (typeof item === 'object') {
            // Object in array - format with bold keys
            const entries = Object.entries(item)
            entries.forEach(([k, v]) => {
              const keyFormatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              if (typeof v === 'string') {
                markdown += `- **${keyFormatted}**: ${v.trim()}\n`
              } else {
                markdown += `- **${keyFormatted}**: ${String(v).trim()}\n`
              }
            })
          }
        })
        markdown += '\n'
      } else if (typeof value === 'object') {
        // Object - format as nested structure
        const formatted = formatValue(value)
        if (formatted) {
          markdown += `${formatted}\n\n`
        }
      } else {
        // Other types
        markdown += `${String(value)}\n\n`
      }
    })
    
    return markdown.trim()
  }

  const formatOutputForCopy = (output: Record<string, any>, templateSlug?: string): string => {
    // If we have formattedContent, prefer that (it's already in markdown)
    // Otherwise, convert parsed output to markdown
    return convertParsedToMarkdown(output)
  }

  /**
   * Future-proof copy function that works with any content format
   * Priority:
   * 1. formattedContent (already in markdown) - fastest and most accurate
   * 2. Extract from rendered HTML and convert to markdown - works with any HTML structure
   * 3. Convert parsedOutput to markdown - fallback for structured data
   */
  const EXCLUDED_SECTION_KEYS = ['bloom_alignment', 'safety_precautions', 'teacher_notes']

  const handleCopyToClipboard = async () => {
    let textToCopy = ''
    
    try {
      if (sections.length > 0) {
        const doc = composeAiDocumentFromSections(sections, sectionsSchema, { excludeSectionKeys: EXCLUDED_SECTION_KEYS })
        textToCopy = doc.plainText
      }
      if (!textToCopy && formattedContent && formattedContent.trim()) {
        textToCopy = formattedContent.replace(/\[\[SECTION:[^\]]*\]\]/g, '')
      }
      if (!textToCopy && parsedOutput) {
        textToCopy = formatOutputForCopy(parsedOutput, template?.slug).replace(/\[\[SECTION:[^\]]*\]\]/g, '')
      }
      if (!textToCopy) {
        const outputElement = document.getElementById('ai-output-content')
        if (outputElement && turndownServiceRef.current) {
          const htmlContent = outputElement.innerHTML
          textToCopy = turndownServiceRef.current.turndown(htmlContent)
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\[\[SECTION:[^\]]*\]\]/g, '')
            .trim()
        }
        if (!textToCopy) return
      }
      
      // Copy to clipboard
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      // Show "Copied" for 2 seconds like GPT
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback: try using execCommand for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr)
      }
    }
  }

  const handleExport = async () => {
    let contentToExport = ''
    if (sections.length > 0) {
      const doc = composeAiDocumentFromSections(sections, sectionsSchema, { excludeSectionKeys: EXCLUDED_SECTION_KEYS })
      contentToExport = doc.plainText
    }
    if (!contentToExport && parsedOutput) {
      contentToExport = formatOutputForCopy(parsedOutput, template?.slug).replace(/\[\[SECTION:[^\]]*\]\]/g, '')
    }
    if (!contentToExport && formattedContent) {
      contentToExport = formattedContent.replace(/\[\[SECTION:[^\]]*\]\]/g, '')
    }
    if (!contentToExport) return

    try {
      // Convert text to paragraphs for DOCX
      const paragraphs: Paragraph[] = []
      const lines = contentToExport.split('\n')
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        
        if (!trimmedLine) {
          // Empty line
          paragraphs.push(new Paragraph({ text: '' }))
          continue
        }
        
        // Check for headers
        if (trimmedLine.startsWith('# ')) {
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(2),
              heading: HeadingLevel.HEADING_1,
            })
          )
        } else if (trimmedLine.startsWith('## ')) {
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(3),
              heading: HeadingLevel.HEADING_2,
            })
          )
        } else if (trimmedLine.startsWith('### ')) {
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(4),
              heading: HeadingLevel.HEADING_3,
            })
          )
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          // Bullet point
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(2),
              bullet: { level: 0 },
            })
          )
        } else if (/^\d+\.\s/.test(trimmedLine)) {
          // Numbered list
          const match = trimmedLine.match(/^\d+\.\s(.+)/)
          if (match) {
            paragraphs.push(
              new Paragraph({
                text: match[1],
                numbering: { reference: 'default-numbering', level: 0 },
              })
            )
          }
        } else {
          // Regular paragraph
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                }),
              ],
            })
          )
        }
      }

      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs.length > 0 ? paragraphs : [
              new Paragraph({
                children: [
                  new TextRun({
                    text: contentToExport,
                  }),
                ],
              }),
            ],
          },
        ],
      })

      // Generate and download
      const blob = await Packer.toBlob(doc)
      const fileName = `${template?.slug || 'output'}-${new Date().toISOString().split('T')[0]}.docx`
      saveAs(blob, fileName)
    } catch (err) {
      console.error('Failed to export:', err)
      // Fallback to plain text download
      const blob = new Blob([contentToExport], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template?.slug || 'output'}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handlePrint = () => {
    // Get the content element to print
    const outputElement = document.getElementById('ai-output-content')
    if (!outputElement) return

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to print')
      return
    }

    // Get the content HTML
    const content = outputElement.innerHTML
    
    // Create print-friendly HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${template?.title || 'Generated Content'}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.8;
              color: #1f2937;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 1.875rem;
              font-weight: 600;
              color: #111827;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
            }
            h2 {
              font-size: 1.5rem;
              font-weight: 700;
              color: #111827;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
            }
            h3 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #111827;
              margin-top: 1.25rem;
              margin-bottom: 0.75rem;
            }
            h4 {
              font-size: 1.125rem;
              font-weight: 600;
              color: #1f2937;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
            }
            p {
              font-size: 15px;
              line-height: 1.8;
              color: #1f2937;
              margin-bottom: 1rem;
            }
            ul, ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }
            li {
              font-size: 15px;
              line-height: 1.8;
              color: #1f2937;
              margin-bottom: 0.25rem;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `

    printWindow.document.write(printHTML)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // Close window after printing (optional)
        // printWindow.close()
      }, 250)
    }
  }


  const renderField = (field: TemplateField) => {
    const handleChange = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => handleInputChange(field.name, event.target.value)

    // Ensure value is always a string for controlled components
    // Use initialFormValues as fallback to ensure consistent value
    const fieldValue = String(formValues[field.name] ?? initialFormValues[field.name] ?? field.default ?? '')

    const commonProps = {
      id: field.name,
      name: field.name,
      value: fieldValue,
      onChange: handleChange,
      required: field.required,
      className:
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-500',
    }

    if (field.type === 'textarea' || field.type === 'array') {
      return (
        <textarea 
          {...commonProps} 
          rows={field.type === 'array' ? 4 : 8} 
          placeholder={field.type === 'array' ? (field.placeholder || 'One item per line or comma-separated') : field.placeholder} 
          className={`${commonProps.className} resize-y min-h-[120px]`} 
        />
      )
    }

    if (field.type === 'select') {
      // Handle boolean fields specially (show Yes/No instead of true/false)
      const isBoolean = field.options?.length === 2 && 
                       field.options.includes('true') && 
                       field.options.includes('false')
      
      return (
        <select {...commonProps}>
          <option value="">Select {field.label ?? field.name}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {isBoolean ? (option === 'true' ? 'Yes' : 'No') : option}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'number') {
      return <input {...commonProps} type="number" min={field.min} max={field.max} placeholder={field.placeholder} />
    }

    return <input {...commonProps} type="text" placeholder={field.placeholder} />
  }

  const formatLessonFlow = (content: any): string => {
    if (typeof content === 'object' && content !== null) {
      const flow = content as Record<string, any>
      const steps = []
      
      if (flow.warm_up || flow.warmUp) {
        steps.push(`Step 1: Warm-Up / Hook\n${flow.warm_up || flow.warmUp || ''}`)
      }
      if (flow.main_instruction || flow.mainInstruction) {
        steps.push(`Step 2: Main Instruction\n${flow.main_instruction || flow.mainInstruction || ''}`)
      }
      if (flow.activity) {
        steps.push(`Step 3: Activity / Exploration\n${flow.activity || ''}`)
      }
      if (flow.closure) {
        steps.push(`Step 4: Closure / Reflection\n${flow.closure || ''}`)
      }
      
      return steps.join('\n\n')
    }
    return String(content || 'N/A')
  }

  // Format content like a Word document with proper typography
  const formatContentForDisplay = (content: any): React.ReactNode => {
    if (typeof content === 'string') {
      const lines = content.split('\n')
      const elements: React.ReactNode[] = []
      let currentParagraph: string[] = []
      let listItems: string[] = []
      let inList = false
      let listType: 'bullet' | 'number' | null = null

      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        
        // Detect markdown headings
        if (trimmedLine.match(/^#{1,6}\s/)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listItems.length > 0) {
            const ListComponent = listType === 'number' ? 'ol' : 'ul'
            elements.push(
              <ListComponent key={`list-${index}`} className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                {listItems.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                    {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ListComponent>
            )
            listItems = []
            inList = false
          }
          const headingText = trimmedLine.replace(/^#{1,6}\s*/, '')
          const headingLevel = (trimmedLine.match(/^#+/) || [''])[0].length
          // Match project heading styles: h1=text-3xl font-semibold, h2=text-2xl font-bold, h3=text-xl font-semibold, h4=text-lg font-semibold
          let HeadingTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' = 'h3'
          let headingClass = ''
          
          if (headingLevel === 1) {
            HeadingTag = 'h1'
            headingClass = 'mb-4 mt-6 text-3xl font-semibold text-gray-900 first:mt-0'
          } else if (headingLevel === 2) {
            HeadingTag = 'h2'
            headingClass = 'mb-4 mt-6 text-2xl font-bold text-gray-900'
          } else if (headingLevel === 3) {
            HeadingTag = 'h3'
            headingClass = 'mb-3 mt-5 text-xl font-semibold text-gray-900'
          } else if (headingLevel === 4) {
            HeadingTag = 'h4'
            headingClass = 'mb-2 mt-4 text-lg font-semibold text-gray-900'
          } else {
            HeadingTag = 'h5'
            headingClass = 'mb-2 mt-4 text-base font-semibold text-gray-900'
          }
          
          elements.push(
            <HeadingTag key={`heading-${index}`} className={headingClass}>
              {headingText}
            </HeadingTag>
          )
        }
        // Detect numbered list items
        else if (trimmedLine.match(/^\d+\.\s/)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listType && listItems.length > 0) {
            if (listType === 'bullet') {
              elements.push(
                <ul key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-disc">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              )
            } else {
              elements.push(
                <ol key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-decimal">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              )
            }
            listItems = []
          }
          inList = true
          listType = 'number'
          listItems.push(trimmedLine)
        }
        // Detect bullet list items
        else if (trimmedLine.match(/^[-•*]\s/)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listType && listItems.length > 0) {
            if (listType === 'number') {
              elements.push(
                <ol key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-decimal">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              )
            } else {
              elements.push(
                <ul key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-disc">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              )
            }
            listItems = []
          }
          inList = true
          listType = 'bullet'
          listItems.push(trimmedLine)
        }
        // Detect step patterns (Step 1:, Step 2:, etc.)
        else if (trimmedLine.match(/^Step\s+\d+:/i)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listItems.length > 0) {
            const ListComponent = listType === 'number' ? 'ol' : 'ul'
            elements.push(
              <ListComponent key={`list-${index}`} className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                {listItems.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                    {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ListComponent>
            )
            listItems = []
            inList = false
          }
          const stepMatch = trimmedLine.match(/^(Step\s+\d+:\s*)(.+)/i)
          if (stepMatch) {
            elements.push(
              <div key={`step-${index}`} className="mb-3 mt-4">
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  {stepMatch[1].trim()}
                </h4>
                <p className="text-[15px] leading-[1.8] text-gray-800 font-normal ml-4">
                  {stepMatch[2].trim()}
                </p>
              </div>
            )
          }
        }
        // Regular paragraph text
        else if (trimmedLine.length > 0) {
          if (inList && listItems.length > 0 && listType) {
            const ListComponent = listType === 'number' ? 'ol' : 'ul'
            elements.push(
              <ListComponent key={`list-${index}`} className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                {listItems.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                    {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ListComponent>
            )
            listItems = []
            inList = false
            listType = null
          }
          currentParagraph.push(trimmedLine)
        }
        // Empty line - end current paragraph
        else if (trimmedLine.length === 0 && currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
              {currentParagraph.join(' ')}
            </p>
          )
          currentParagraph = []
        }
      })

      // Handle remaining content
      if (currentParagraph.length > 0) {
        elements.push(
          <p key="para-final" className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
            {currentParagraph.join(' ')}
          </p>
        )
      }
      if (inList && listItems.length > 0 && listType) {
        const ListComponent = listType === 'number' ? 'ol' : 'ul'
        elements.push(
          <ListComponent key="list-final" className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
            {listItems.map((item, i) => (
              <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ListComponent>
        )
      }

      return elements.length > 0 ? <div className="document-content">{elements}</div> : <p className="text-[15px] leading-[1.8] text-gray-800 font-normal">{content}</p>
    }

    // Handle object content
    if (typeof content === 'object' && content !== null) {
      if (Array.isArray(content)) {
        return (
          <ul className="mb-4 ml-6 space-y-2 list-disc">
            {content.map((item, i) => (
              <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
              </li>
            ))}
          </ul>
        )
      }

      // Format object as key-value pairs with proper styling
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value], index) => (
            <div key={index} className="border-l-4 border-gray-300 pl-4 py-1">
              <h5 className="mb-2 text-base font-semibold text-gray-900 capitalize">
                {key.replace(/_/g, ' ')}
              </h5>
              <div className="text-[15px] leading-[1.8] text-gray-800">
                {typeof value === 'object' && value !== null ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-gray-50 p-3 rounded border border-gray-200">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <p className="font-normal">{String(value)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return <p className="text-[15px] leading-[1.8] text-gray-800 font-normal">{String(content)}</p>
  }

  const formatMarkdownToHTML = (text: string): string => {
    if (!text) return ''
    let formatted = text
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-5">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold text-gray-900 mb-2 mt-4">$1</h4>')
    formatted = formatted.replace(/^- (.+)$/gm, '<li class="text-[15px] leading-[1.8] text-gray-800 mb-1">$1</li>')
    formatted = formatted.replace(/(<li class="text-\[15px\] leading-\[1\.8\] text-gray-800 mb-1">.*<\/li>\n?)+/g, (match) => '<ul class="mb-4 ml-6 space-y-1 list-disc">' + match + '</ul>')
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li class="text-[15px] leading-[1.8] text-gray-800 mb-1">$1</li>')
    const lines = formatted.split('\n')
    const out: string[] = []
    let inList = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('<')) {
        if (line.includes('</ul>')) inList = false
        else if (line.includes('<ul')) inList = true
        out.push(line)
      } else if (line) {
        out.push(!inList && !line.startsWith('<') ? `<p class="mb-4 text-[15px] leading-[1.8] text-gray-800">${line}</p>` : line)
      }
    }
    return out.join('\n')
  }

  const renderPreviewContent = () => {
    if (!parsedOutput && !isStreaming && !streamedContent && !showOutput && sections.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Try a variety of inputs and input lengths to get the best results.
            </p>
          </div>
        </div>
      )
    }

    if (sections.length > 0) {
      const doc = composeAiDocumentFromSections(sections, sectionsSchema, {
        isStreaming,
        completedSectionKeys,
        excludeSectionKeys: EXCLUDED_SECTION_KEYS,
      })
      const lastSectionKey = doc.sections.length > 0 ? doc.sections[doc.sections.length - 1].key : null
      return (
        <AiDocumentRenderer
          document={doc}
          isStreaming={isStreaming}
          lastSectionKey={lastSectionKey}
        />
      )
    }

    if (isStreaming) {
      return (
        <div className="max-w-[800px] mx-auto py-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500 flex-shrink-0" />
            <span className="text-[15px]">Generating lesson plan...</span>
          </div>
        </div>
      )
    }

    if (!isStreaming && streamedContent && !sections.length) {
      return (
        <div className="max-w-[800px] mx-auto py-4 text-sm text-gray-500">
          Content generated. If sections do not appear, try running again.
        </div>
      )
    }

    // Legacy: parsedOutput but no sections (e.g. old API) — compose document and render
    if (!isStreaming && parsedOutput && Object.keys(parsedOutput).length > 0) {
      const excludedSet = new Set(EXCLUDED_SECTION_KEYS.map((k) => k.toUpperCase().replace(/\s+/g, '_')))
      const legacySections = Object.entries(parsedOutput)
        .filter(([key]) => key !== '_streaming' && !excludedSet.has(key.toUpperCase().replace(/\s+/g, '_')))
        .map(([key, content]) => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          content: typeof content === 'string' ? content : JSON.stringify(content),
        }))
      if (legacySections.length > 0) {
        const doc = composeAiDocumentFromSections(legacySections, sectionsSchema, {
          isStreaming: false,
          completedSectionKeys: legacySections.map((s) => s.key),
          excludeSectionKeys: EXCLUDED_SECTION_KEYS,
        })
        return <AiDocumentRenderer document={doc} />
      }
    }

    return null
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">{error ?? 'Template not found.'}</p>
          <button
            onClick={() => navigate('/templates')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link to="/templates" className="hover:text-gray-900">
                Templates
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{template.title}</li>
          </ol>
        </nav>

        {/* Header with Title and Description */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{template.title}</h1>
              {template.description && (
                <p className="text-sm text-gray-600">{template.description}</p>
              )}
          </div>
          {parsedOutput && !isStreaming && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyToClipboard()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                  </>
                ) : (
                  <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
          )}
        </div>
          {insufficientCredits && (
            <div className="mt-6">
              <NoCreditsCard
                reason={insufficientCredits.reason}
                balance={insufficientCredits.balance}
                required={insufficientCredits.required}
                onActivated={() => resetStream()}
              />
            </div>
          )}
        </div>

        {/* Prompt Editor Section - Collapsible */}
        {schemaFields.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowPromptEditor(!showPromptEditor)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {showPromptEditor ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-900">Prompt Editor</span>
              </div>
            </button>

            {showPromptEditor && (
              <div className="mt-4 border border-gray-200 rounded-lg p-6 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {template?.exemplarInput && template?.exemplarOutput && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleShowExemplar}
                        disabled={isStreaming}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Show exemplar
                      </button>
                    </div>
                  )}

                  {exemplarNotice && (
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                      <p className="text-sm text-indigo-900">{exemplarNotice}</p>
                    </div>
                  )}

                  {schemaFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                        {field.label ?? field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  {submitError && !insufficientCredits && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-800">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isStreaming || schemaFields.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isStreaming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Generate
                      </>
                    )}
                  </button>
                </form>
              </div>
              )}
            </div>
        )}

        {/* Output/Preview Section */}
        {schemaFields.length === 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">This template does not define any input fields yet.</p>
          </div>
        )}

        {/* Output Display - Chat-like Message */}
        {(parsedOutput || isStreaming || sections.length > 0 || showOutput) && !insufficientCredits && (
          <div id="ai-output" className="mt-8">
            {providerFailedNotice && (
              <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-950">{providerFailedNotice}</p>
              </div>
            )}
            {/* AI Message Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Response:</h2>
              
              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <button
                  onClick={() => handleCopyToClipboard()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Export as DOCX"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
                
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Print content"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                
                <button
                  onClick={() => setShowPromptEditor(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                
                <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-2">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Translate"
                  >
                    <Languages className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Bookmark"
                  >
                    <Bookmark className="h-4 w-4 text-gray-600" />
                  </button>
            </div>
                
                <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-2">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Like"
                  >
                    <ThumbsUp className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Dislike"
                  >
                    <ThumbsDown className="h-4 w-4 text-gray-600" />
                  </button>
          </div>
              </div>
            </div>

            {/* Output Content */}
            <div className="border border-gray-200 rounded-lg bg-white">
              <div id="ai-output-content" className="p-6">
            {renderPreviewContent()}
          </div>
        </div>

            {/* Review Prompt - Only show after completion, not during streaming */}
            {parsedOutput && !isStreaming && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Please review the generated content to ensure it matches your expectations and classroom needs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateRunner


import { FormEvent, useState, useEffect, useCallback, useRef } from 'react'
import {
  AlertTriangle,
  Loader2,
  Search,
  SlidersHorizontal,
  FileText,
  Star,
  Flame,
  X,
  BookOpen,
  ClipboardCheck,
  Users,
  GraduationCap,
  MessageSquare,
  Lightbulb,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'

import { TemplateListParams, TemplateResponse, TemplateSort } from '../../api/types'
import { API_BASE_URL, API_URL, HEALTH_URL } from '../../config/api'

type TemplateFilterFormState = {
  q: string
  subject: string
  gradeBand: string
  bloom: string
  kind: string
  framework: string
  standardCode: string
  sort: TemplateSort
  pageSize: number
}

type AttributeFieldKey = 'subject' | 'gradeBand' | 'bloom' | 'kind'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTemplates, toggleTemplateFavorite } from '../../redux/features/templates/templatesSlice'
import { useSnackbar } from '../../hooks/useSnackbar'

const DEFAULT_FILTERS: TemplateListParams = {
  sort: 'title',
}


const TemplatesLibrary = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useSnackbar()
  
  // Redux selectors
  const user = useSelector((state: any) => state?.auth?.user)
  const isRehydrated = useSelector((state: any) => state?._persist?.rehydrated)
  const templates = useSelector((state: any) => state?.templates?.templates || [])
  const favorites = useSelector((state: any) => state?.templates?.favorites || [])
  const loading = useSelector((state: any) => state?.templates?.loading || false)
  const error = useSelector((state: any) => state?.templates?.error)
  const total = useSelector((state: any) => state?.templates?.total || 0)
  
  // Check if user is authenticated
  const isAuthenticated = !!user?.token
  
  const [filters, setFilters] = useState<TemplateListParams>(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [formState, setFormState] = useState<TemplateFilterFormState>({
    q: '',
    subject: '',
    gradeBand: '',
    bloom: '',
    kind: '',
    framework: '',
    standardCode: '',
    sort: DEFAULT_FILTERS.sort as TemplateSort,
    pageSize: DEFAULT_FILTERS.pageSize ?? 6,
  })

  // Track previous user ID to detect user changes (login/logout/switch user)
  const prevUserIdRef = useRef(user?.id)

  // Fetch templates when filters change - but wait for Redux rehydration
  // This ensures auth token is available if user is logged in
  useEffect(() => {
    // Wait for Redux persist to rehydrate before fetching
    // This ensures auth token is available if user is logged in
    if (isRehydrated !== false) {
      dispatch(fetchTemplates(filters) as any)
    }
  }, [dispatch, filters, isRehydrated])

  // Refetch templates when user changes (login/logout/switch user)
  // This ensures favorites are shown for the correct user
  useEffect(() => {
    const currentUserId = user?.id
    const prevUserId = prevUserIdRef.current
    
    // Check if user ID changed (user logged in, logged out, or switched accounts)
    const userIdChanged = currentUserId !== prevUserId
    
    if (userIdChanged) {
      console.log('[TemplatesLibrary] User changed, refetching templates for correct favorites', {
        prevUserId,
        currentUserId,
        isAuthenticated,
      })
      
      // Update ref
      prevUserIdRef.current = currentUserId
      
      // Refetch templates to get correct favorites for the current user
      // Only refetch if user is authenticated (don't refetch on logout, templates will be cleared)
      if (isAuthenticated && currentUserId) {
        dispatch(fetchTemplates(filters) as any)
      }
    }
  }, [dispatch, user?.id, isAuthenticated, filters]) // Refetch when user ID or auth state changes

  const attributeFields: Array<{ label: string; key: AttributeFieldKey; placeholder: string }> = [
    { label: 'Subject', key: 'subject', placeholder: 'e.g., math' },
    { label: 'Grade band', key: 'gradeBand', placeholder: 'e.g., 6 or KS3' },
    { label: 'Bloom level', key: 'bloom', placeholder: 'e.g., apply' },
    { label: 'Template kind', key: 'kind', placeholder: 'lesson, assessment…' },
  ]

  const [hotFilter, setHotFilter] = useState<boolean | undefined>(undefined)
  const [favoriteFilter, setFavoriteFilter] = useState<boolean | undefined>(undefined)

  const applyFilters = useCallback(() => {
    setFilters({
      sort: formState.sort,
      q: formState.q?.trim() || undefined,
      subject: formState.subject || undefined,
      gradeBand: formState.gradeBand || undefined,
      bloom: formState.bloom || undefined,
      kind: formState.kind || undefined,
      framework: formState.framework || undefined,
      standardCode: formState.standardCode || undefined,
      is_hot: hotFilter,
      is_favorite: favoriteFilter,
    })
  }, [formState, hotFilter, favoriteFilter])

  // Debounced search effect - automatically applies search when user types
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // If search is empty, immediately clear the filter
    if (!formState.q || formState.q.trim() === '') {
      if (filters.q !== undefined) {
        setFilters(prev => {
          const { q, ...rest } = prev
          return rest
        })
      }
      return
    }

    // Debounce search - wait 500ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      applyFilters()
    }, 500)

    // Cleanup timeout on unmount or when search changes
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [formState.q, applyFilters, filters.q])

  // Apply filters when hot or favorite filter changes
  useEffect(() => {
    applyFilters()
  }, [hotFilter, favoriteFilter, applyFilters])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    applyFilters()
  }

  const handleReset = () => {
    setFormState({
      q: '',
      subject: '',
      gradeBand: '',
      bloom: '',
      kind: '',
      framework: '',
      standardCode: '',
      sort: 'title',
      pageSize: 6,
    })
    setFilters(DEFAULT_FILTERS)
  }

  // Get icon and color configuration based on template category
  const getTemplateIcon = (template: TemplateResponse): { icon: LucideIcon; color: string; bgColor: string } => {
    // Future: If backend provides icon_name, use it (for extensibility)
    // For now, use category-based mapping
    
    const category = template.category?.toLowerCase() || ''
    const title = template.title?.toLowerCase() || ''
    const slug = template.slug?.toLowerCase() || ''
    
    // Category to icon mapping
    const categoryMap: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
      'lesson_design': {
        icon: BookOpen,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 group-hover:bg-blue-100',
      },
      'assessment': {
        icon: ClipboardCheck,
        color: 'text-green-600',
        bgColor: 'bg-green-50 group-hover:bg-green-100',
      },
      'behavior': {
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 group-hover:bg-purple-100',
      },
      'subject_specific': {
        icon: GraduationCap,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 group-hover:bg-indigo-100',
      },
      'communication': {
        icon: MessageSquare,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50 group-hover:bg-cyan-100',
      },
    }
    
    // Try to match by category first
    if (category && categoryMap[category]) {
      return categoryMap[category]
    }
    
    // Fallback: try to match by title/slug keywords
    if (title.includes('lesson') || slug.includes('lesson')) {
      return categoryMap['lesson_design'] || { icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50 group-hover:bg-blue-100' }
    }
    if (title.includes('assessment') || title.includes('quiz') || slug.includes('assessment')) {
      return categoryMap['assessment'] || { icon: ClipboardCheck, color: 'text-green-600', bgColor: 'bg-green-50 group-hover:bg-green-100' }
    }
    if (title.includes('behavior') || slug.includes('behavior')) {
      return categoryMap['behavior'] || { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50 group-hover:bg-purple-100' }
    }
    if (title.includes('communication') || slug.includes('communication')) {
      return categoryMap['communication'] || { icon: MessageSquare, color: 'text-cyan-600', bgColor: 'bg-cyan-50 group-hover:bg-cyan-100' }
    }
    
    // Default fallback
    return {
      icon: Lightbulb,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 group-hover:bg-indigo-100',
    }
  }

  const handleFavoriteToggle = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check if user is authenticated - show error immediately if not
    if (!isAuthenticated) {
      toast.error('Please log in to add favorites')
      return
    }
    
    // Dispatch Redux thunk - auth token automatically included by axios interceptor
    dispatch(toggleTemplateFavorite(templateId) as any)
      .unwrap()
      .then((result: any) => {
        // Show success feedback
        toast.success(
          result.is_favorite 
            ? 'Template added to favorites' 
            : 'Template removed from favorites'
        )
      })
      .catch((error: any) => {
        console.error('[TemplatesLibrary] Error toggling favorite:', error)
        
        // Show user-friendly error message
        let errorMessage = 'Failed to update favorite. Please try again.'
        
        if (error?.code === 'AUTH_REQUIRED' || error?.message?.includes('log in')) {
          errorMessage = 'Please log in to add favorites'
        } else if (error?.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.'
        } else if (error?.status === 404) {
          errorMessage = 'Template not found.'
        } else if (error?.message) {
          if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
            errorMessage = 'Connection error. Please check your internet connection and try again.'
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.'
          } else {
            errorMessage = error.message
          }
        }
        
        toast.error(errorMessage)
        
        // Log detailed error for debugging
        console.error('[TemplatesLibrary] Favorite toggle failed:', {
          templateId,
          error: error?.message,
          code: error?.code,
          status: error?.status,
          userAuthenticated: isAuthenticated,
          userId: user?.id,
        })
      })
  }

  const renderTemplateCard = (template: TemplateResponse) => {
    const handleOpen = () => {
      if (!template.slug) return
      navigate(`/templates/${template.slug}`)
    }

    // Get favorite status from Redux state
    const isFavorite = favorites.includes(template.id) || template.is_favorite || false

    const { icon: Icon, color, bgColor } = getTemplateIcon(template)
    const isHot = template.is_hot || false

    return (
      <article
        key={template.id}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleOpen()
        }}
        role="button"
        tabIndex={0}
        className="group relative flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {/* Hot badge and favorite icon */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {isHot && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
              <Flame className="h-3 w-3" />
              Hot
            </span>
          )}
          {/* Only show favorite button if user is authenticated */}
          {isAuthenticated && (
            <button
              onClick={(e) => handleFavoriteToggle(template.id, e)}
              className={`rounded-full p-1.5 transition hover:bg-gray-100 ${
                isFavorite 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Icon - Now with dynamic colors based on category */}
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor} ${color} transition`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 pr-16">{template.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {template.description || 'This template is ready for standards alignment and lesson planning.'}
          </p>
        </div>
      </article>
    )
  }

  const hasActiveFilters = Object.values({ ...formState, sort: undefined, pageSize: undefined })
    .some((value) => !!value)

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Templates</h1>
            <p className="mt-1 text-sm text-gray-600">
              Browse and search all available templates
            </p>
          </div>
          {/* Manual test button */}
          {/* <button
            onClick={async () => {
              console.log('[TemplatesLibrary] 🔵 Manual test button clicked')
              try {
                // Test 1: Health endpoint
                console.log('[TemplatesLibrary] Test 1: Health check...')
                const healthUrl = HEALTH_URL
                const healthRes = await fetch(healthUrl, { method: 'GET', mode: 'cors' })
                console.log('[TemplatesLibrary] Health status:', healthRes.status)
                
                // Test 2: Test endpoint
                console.log('[TemplatesLibrary] Test 2: Test endpoint...')
                const testUrl = `${API_URL}/v1/test`
                const testRes = await fetch(testUrl, { method: 'GET', mode: 'cors' })
                console.log('[TemplatesLibrary] Test endpoint status:', testRes.status)
                
                // Test 3: Templates endpoint
                console.log('[TemplatesLibrary] Test 3: Templates endpoint...')
                const templatesUrl = `${API_URL}/v1/templates`
                const response = await fetch(templatesUrl, {
                  method: 'GET',
                  headers: { 'Accept': 'application/json' },
                  mode: 'cors'
                })
                console.log('[TemplatesLibrary] Templates status:', response.status, response.ok)
                
                if (!response.ok) {
                  const text = await response.text()
                  console.error('[TemplatesLibrary] Response error:', text)
                  alert(`API Error: ${response.status} - ${text.substring(0, 100)}`)
                  return
                }
                
                const data = await response.json()
                console.log('[TemplatesLibrary] ✅ Response data:', data)
                const count = Array.isArray(data) ? data.length : 0
                alert(`✅ API Working!\n\nHealth: OK\nTest: OK\nTemplates: ${count} found\n\nCheck console for details.`)
              } catch (error) {
                console.error('[TemplatesLibrary] ❌ Connection error:', error)
                const errorMsg = error instanceof Error ? error.message : 'Unknown error'
                alert(`❌ Connection Failed!\n\n${errorMsg}\n\nCheck:\n1. Backend running on port 8000?\n2. CORS enabled?\n3. Check browser console`)
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            🔍 Test Connection
          </button> */}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={formState.q}
            onChange={(event) => {
              setFormState((prev) => ({ ...prev, q: event.target.value }))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                // Clear timeout and apply immediately on Enter
                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current)
                }
                applyFilters()
              }
            }}
            placeholder="Search all templates..."
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
          />
          {formState.q && (
            <button
              type="button"
              onClick={() => {
                setFormState((prev) => ({ ...prev, q: '' }))
                // Clear search filter immediately
                setFilters(prev => {
                  const { q, ...rest } = prev
                  return rest
                })
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Hot and Favorite Filters */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setHotFilter(prev => prev === true ? undefined : true)
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              hotFilter === true
                ? 'bg-orange-100 text-orange-700 border border-orange-300 shadow-sm'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Flame className={`h-4 w-4 ${hotFilter === true ? 'text-orange-600' : 'text-gray-400'}`} />
            Hot Templates
            {hotFilter === true && (
              <span className="ml-1 rounded-full bg-orange-200 px-1.5 py-0.5 text-xs font-semibold text-orange-800">
                Active
              </span>
            )}
          </button>

          {/* Only show favorites filter if user is authenticated */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setFavoriteFilter(prev => prev === true ? undefined : true)
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                favoriteFilter === true
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Star className={`h-4 w-4 ${favoriteFilter === true ? 'text-yellow-600 fill-yellow-600' : 'text-gray-400'}`} />
              Favorites
              {favoriteFilter === true && (
                <span className="ml-1 rounded-full bg-yellow-200 px-1.5 py-0.5 text-xs font-semibold text-yellow-800">
                  Active
                </span>
              )}
            </button>
          )}

          {(hotFilter !== undefined || favoriteFilter !== undefined) && (
            <button
              type="button"
              onClick={() => {
                setHotFilter(undefined)
                setFavoriteFilter(undefined)
              }}
              className="ml-auto text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Toggle - Collapsible */}
        {/* <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowFilters(!showFilters)
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter by
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleReset()
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filters
            </button>
          )}
        </div> */}

        {/* Collapsible Filter Section */}
        {/* {showFilters && (
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {attributeFields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</label>
                  <input
                    value={formState[field.key]}
                    onChange={(event) => setFormState((prev) => ({ ...prev, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Framework</label>
                <select
                  value={formState.framework}
                  onChange={(event) => setFormState((prev) => ({ ...prev, framework: event.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Any framework</option>
                  {frameworksState.data && Array.isArray(frameworksState.data) && frameworksState.data.map((framework) => (
                    <option key={framework.code} value={framework.code}>
                      {framework.code} · {framework.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Standard code</label>
                <input
                  value={formState.standardCode}
                  onChange={(event) => setFormState((prev) => ({ ...prev, standardCode: event.target.value }))}
                  placeholder="CCSS.MATH.CONTENT.6.EE.A.2"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </form>
          </div>
        )} */}
      </div>

      <div className="space-y-4">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">{total > 0 ? `${total} templates` : 'Templates'}</p>
            <button
              type="button"
              onClick={() => dispatch(fetchTemplates(filters) as any)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              title="Refresh template list from backend"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 py-10 text-sm text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-500" /> Loading templates…
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 mb-1">Error Loading Templates</p>
                  <p className="text-sm text-red-700 mb-3">{error}</p>
                  <div className="text-xs text-red-600 bg-red-100/50 rounded-lg p-3">
                    <p className="font-semibold mb-2">Troubleshooting Steps:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ensure the backend server is running at <code className="bg-red-200 px-1.5 py-0.5 rounded font-mono">{API_BASE_URL}</code></li>
                      <li>Check browser console (F12) for detailed error messages</li>
                      <li>Verify CORS settings if using a different origin</li>
                      <li>Check Network tab to see the failed request details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !templates.length && !error && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-600">
              No templates match those filters yet. Seed data includes math expressions so try subject "math".
            </div>
          )}

          {templates.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => renderTemplateCard(template))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TemplatesLibrary

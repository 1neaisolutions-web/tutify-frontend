/**
 * Worksheet Generator Page
 */
import React, { useState, useEffect } from 'react'
import { Loader2, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  fetchContentPacks,
  generateWorksheet,
  ContentPack,
  WorksheetGenerateRequest,
  WorksheetGenerateResponse,
} from '../../api/contentIngestion'
import { WorksheetDisplay } from '../../components/contentIngestion/WorksheetDisplay'
import { useSnackbar } from '../../hooks/useSnackbar'
import { parseCreditError, type ParsedCreditError } from '../../utils/creditErrors'
import NoCreditsCard from '../../components/NoCreditsCard'
import { useRefreshCreditBalance } from '../../hooks/useRefreshCreditBalance'

export const WorksheetGenerator = () => {
  const [packs, setPacks] = useState<ContentPack[]>([])
  const [selectedPack, setSelectedPack] = useState<string>('')
  const [topicText, setTopicText] = useState('')
  const [topicId, setTopicId] = useState<string>('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [numQuestions, setNumQuestions] = useState(10)
  
  // Difficulty mode: 'single' or 'mix'
  const [difficultyMode, setDifficultyMode] = useState<'single' | 'mix'>('single')
  const [singleDifficulty, setSingleDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [difficultyEasy, setDifficultyEasy] = useState(0.3)
  const [difficultyMedium, setDifficultyMedium] = useState(0.5)
  const [difficultyHard, setDifficultyHard] = useState(0.2)
  
  const [questionTypes, setQuestionTypes] = useState<string[]>(['mcq', 'short_answer'])
  const [forceRegenerate, setForceRegenerate] = useState(false)
  const [generatedWorksheet, setGeneratedWorksheet] = useState<WorksheetGenerateResponse | null>(null)
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cacheStatus, setCacheStatus] = useState<'hit' | 'miss' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creditGate, setCreditGate] = useState<ParsedCreditError | null>(null)
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const refreshCreditBalance = useRefreshCreditBalance()
  
  useEffect(() => {
    loadPacks()
  }, [])
  
  const loadPacks = async () => {
    try {
      setLoading(true)
      const data = await fetchContentPacks({ is_active: true })
      setPacks(data || [])
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load content packs'
      toast.error(errorMessage)
      console.error('Error loading content packs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCacheStatus(null)
    setCreditGate(null)
    
    if (!selectedPack) {
      const errorMsg = 'Please select a content pack'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    if (!topicText.trim() && !topicId.trim()) {
      const errorMsg = 'Please enter a topic or select a topic ID'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    // Validate num_questions range
    if (numQuestions < 1 || numQuestions > 20) {
      const errorMsg = 'Number of questions must be between 1 and 20'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    // Validate difficulty mix if using mix mode
    if (difficultyMode === 'mix') {
      const total = difficultyEasy + difficultyMedium + difficultyHard
      if (Math.abs(total - 1.0) > 0.01) {
        const errorMsg = 'Difficulty mix must sum to 1.0'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }
    }
    
    try {
      setGenerating(true)
      setError(null)
      
      const request: WorksheetGenerateRequest = {
        pack_id: selectedPack,
        topic_text: topicText.trim() || undefined,
        topic_id: topicId.trim() || undefined,
        grade: grade.trim() || undefined,
        subject: subject.trim() || undefined,
        num_questions: numQuestions,
        question_types: questionTypes.length > 0 ? questionTypes : ['mcq', 'short_answer'],
        force_regenerate: forceRegenerate,
      }
      
      // Add difficulty based on mode
      if (difficultyMode === 'single') {
        request.difficulty = singleDifficulty
      } else {
        request.difficulty_mix = {
          easy: difficultyEasy,
          medium: difficultyMedium,
          hard: difficultyHard,
        }
      }
      
      const worksheet = await generateWorksheet(request, {
        timeout: 120000, // 120 seconds client-side timeout
      })
      
      setGeneratedWorksheet(worksheet)
      setCacheStatus(worksheet._cacheStatus || null)
      await refreshCreditBalance()

      if (worksheet._cacheStatus === 'hit') {
        toast.success('Worksheet loaded from cache!')
      } else {
        toast.success('Worksheet generated successfully!')
      }
    } catch (error: any) {
      const credit = parseCreditError(error)
      if (credit) {
        setCreditGate(credit)
        setError(null)
        return
      }
      const errorMessage = error.message || 'Failed to generate worksheet'
      setError(errorMessage)
      
      console.error('[WorksheetGenerator] Error generating worksheet:', error)
      
      // Handle specific error types with user-friendly messages
      if (errorMessage.includes('Authentication required') || 
          errorMessage.includes('Authentication failed') || 
          errorMessage.includes('401') || 
          errorMessage.includes('Unauthorized') ||
          errorMessage.includes('No auth token')) {
        toast.error('Please log in to generate worksheets')
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else if (errorMessage.includes('Network error') || errorMessage.includes('Failed to fetch')) {
        toast.error('Network error. Check backend connection and browser console.')
        console.error('[WorksheetGenerator] Network error details:', error)
      } else if (errorMessage.includes('Topic not found')) {
        toast.error('Topic not found. Please try a different topic.')
        console.warn('Topic not found - user should try a different topic')
      } else if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
        toast.error('Generation timed out. Try reducing the number of questions.')
        console.warn('Timeout - suggest reducing number of questions')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setGenerating(false)
    }
  }
  
  const selectedPackData = packs.find((p) => p.id === selectedPack)
  
  if (generatedWorksheet) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Generated Worksheet</h1>
            <button
              onClick={() => setGeneratedWorksheet(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Generate Another
            </button>
          </div>
          
          <WorksheetDisplay 
            worksheet={generatedWorksheet} 
            showAnswers={false}
            onWorksheetUpdate={(updatedWorksheet) => {
              setGeneratedWorksheet(updatedWorksheet)
              // Optionally save to localStorage or send to backend
              try {
                localStorage.setItem(`worksheet-${updatedWorksheet.id}`, JSON.stringify(updatedWorksheet))
              } catch (error) {
                console.error('Failed to save worksheet to localStorage:', error)
              }
            }}
          />
          
          <div className="mt-6 flex space-x-3 no-print">
            <button
              onClick={() => {
                // Toggle showAnswers by creating new worksheet with answers visible
                navigate(`/worksheets/${generatedWorksheet.id}?answers=true`)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View with Answers
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Generate Worksheet</h1>
          <p className="text-gray-600 mt-1">
            Generate worksheets from curriculum content using AI
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Pack *
              </label>
              {loading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading packs...</span>
                </div>
              ) : (
                <select
                  value={selectedPack}
                  onChange={(e) => setSelectedPack(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a content pack...</option>
                  {(packs || []).map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name} {pack.subject ? `- ${pack.subject}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            {selectedPackData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Pack:</strong> {selectedPackData.name}
                  {selectedPackData.subject && ` • ${selectedPackData.subject}`}
                  {selectedPackData.grade && ` • ${selectedPackData.grade}`}
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Fractions, Photosynthesis, World War II"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the topic or chapter you want to generate questions about
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade (optional)
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Grade 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic ID (optional - alternative to topic text)
              </label>
              <input
                type="text"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., topic-uuid-123"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use topic ID from content pack if available, otherwise use topic text above
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(20, Math.max(1, parseInt(e.target.value) || 10)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Range: 1-20 questions (recommended: 10-15 for faster generation)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="mb-3">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficultyMode"
                      checked={difficultyMode === 'single'}
                      onChange={() => setDifficultyMode('single')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Single Difficulty</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficultyMode"
                      checked={difficultyMode === 'mix'}
                      onChange={() => setDifficultyMode('mix')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Difficulty Mix</span>
                  </label>
                </div>
              </div>
              
              {difficultyMode === 'single' ? (
                <div>
                  <select
                    value={singleDifficulty}
                    onChange={(e) => setSingleDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    All questions will be {singleDifficulty} difficulty
                  </p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Easy</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={difficultyEasy}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setDifficultyEasy(val)
                          // Auto-adjust others to sum to 1.0
                          const remaining = 1.0 - val
                          const currentMedium = difficultyMedium
                          const currentHard = difficultyHard
                          const totalOther = currentMedium + currentHard
                          if (totalOther > 0) {
                            setDifficultyMedium((currentMedium / totalOther) * remaining)
                            setDifficultyHard((currentHard / totalOther) * remaining)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Medium</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={difficultyMedium}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setDifficultyMedium(val)
                          const remaining = 1.0 - difficultyEasy - val
                          setDifficultyHard(Math.max(0, remaining))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Hard</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={difficultyHard}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setDifficultyHard(val)
                          const remaining = 1.0 - difficultyEasy - val
                          setDifficultyMedium(Math.max(0, remaining))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total: {(difficultyEasy + difficultyMedium + difficultyHard).toFixed(2)} (must equal 1.0)
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Types
              </label>
              <div className="space-y-2">
                {['mcq', 'short_answer', 'long_answer'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={questionTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setQuestionTypes([...questionTypes, type])
                        } else {
                          setQuestionTypes(questionTypes.filter((t) => t !== type))
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Default: MCQ and Short Answer
              </p>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={forceRegenerate}
                  onChange={(e) => setForceRegenerate(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Force Regenerate (skip cache, generate fresh worksheet)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Uncheck to use cached worksheets when available (faster)
              </p>
            </div>
            
            {creditGate && (
              <NoCreditsCard
                reason={creditGate.reason}
                balance={creditGate.balance}
                required={creditGate.required}
                onActivated={() => setCreditGate(null)}
              />
            )}

            {error && !creditGate && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                {error.includes('Topic not found') && (
                  <p className="text-xs text-red-600 mt-2">
                    💡 Try a different topic or check if the topic exists in this content pack.
                  </p>
                )}
                {error.includes('timed out') && (
                  <p className="text-xs text-red-600 mt-2">
                    💡 Try reducing the number of questions or try again.
                  </p>
                )}
              </div>
            )}
            
            <button
              type="submit"
              disabled={generating || !selectedPack || (!topicText.trim() && !topicId.trim())}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Worksheet... (this may take 30-60 seconds)</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Generate Worksheet</span>
                </>
              )}
            </button>
            
            {generating && (
              <div className="text-center text-sm text-gray-600">
                <p>⏱️ Estimated time: 30-60 seconds</p>
                <p className="text-xs mt-1">Cache hits return in &lt;100ms</p>
              </div>
            )}
            
            {cacheStatus && (
              <div className={`rounded-lg p-3 ${
                cacheStatus === 'hit' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm font-medium ${
                  cacheStatus === 'hit' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {cacheStatus === 'hit' ? '✓ Using cached worksheet' : '🔄 Generated fresh worksheet'}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

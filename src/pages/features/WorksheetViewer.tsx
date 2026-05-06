/**
 * Worksheet Viewer Page
 */
import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Download, Printer } from 'lucide-react'
import { getWorksheet, Worksheet } from '../../api/contentIngestion'
import { WorksheetDisplay } from '../../components/contentIngestion/WorksheetDisplay'
import { useSnackbar } from '../../hooks/useSnackbar'

export const WorksheetViewer = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null)
  const [showAnswers, setShowAnswers] = useState(searchParams.get('answers') === 'true')
  const [loading, setLoading] = useState(true)
  const { toast } = useSnackbar()
  
  useEffect(() => {
    if (id) {
      loadWorksheet()
    }
  }, [id])
  
  const loadWorksheet = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const data = await getWorksheet(id)
      setWorksheet(data)
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load worksheet'
      toast.error(errorMessage)
      console.error('Error loading worksheet:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!worksheet) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Worksheet not found</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Worksheet</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {showAnswers ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Answers</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Show Answers</span>
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
        
        <WorksheetDisplay worksheet={worksheet} showAnswers={showAnswers} />
      </div>
    </div>
  )
}

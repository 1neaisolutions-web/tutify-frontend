/**
 * Documents List Page
 */
import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchDocuments, Document, fetchContentPacks, ContentPack } from '../../api/contentIngestion'
import { useSnackbar } from '../../hooks/useSnackbar'

export const DocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [packs, setPacks] = useState<ContentPack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [packFilter, setPackFilter] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  useEffect(() => {
    const packId = searchParams.get('pack_id')
    if (packId) {
      setPackFilter(packId)
    }
    loadPacks()
    loadDocuments()
  }, [searchParams])
  
  const loadPacks = async () => {
    try {
      const data = await fetchContentPacks({ is_active: true })
      setPacks(data || [])
    } catch (error: any) {
      console.error('Failed to load packs:', error)
      // Don't show error for packs, just log it
    }
  }
  
  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (packFilter) params.pack_id = packFilter
      if (statusFilter) params.status = statusFilter
      
      const data = await fetchDocuments(params)
      setDocuments(data || [])
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load documents'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDocuments()
  }, [packFilter, statusFilter])
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'uploaded':
      case 'text_extracting':
      case 'ocr_running':
      case 'normalizing':
      case 'chunking':
      case 'embedding':
      case 'indexing':
      case 'qa_validation':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const filteredDocuments = (documents || []).filter((doc) =>
    doc?.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage curriculum documents</p>
          </div>
          <button
            onClick={() => navigate('/admin/documents/upload')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Document</span>
          </button>
        </div>
        
        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={packFilter}
            onChange={(e) => setPackFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Packs</option>
            {packs.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="uploaded">Uploaded</option>
            <option value="text_extracting">Extracting</option>
            <option value="embedding">Embedding</option>
            <option value="qa_validation">QA Validation</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold">Error loading documents</p>
            <p className="text-red-600 text-sm mt-1 whitespace-pre-line">{error}</p>
            {error.includes('404') || error.includes('Not Found') ? (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm font-semibold mb-2">Troubleshooting:</p>
                <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
                  <li>Ensure backend is running (check http://127.0.0.1:8000/health)</li>
                  <li>If testing locally, set VITE_USE_LOCAL=true in .env file</li>
                  <li>Restart backend server to load new routes</li>
                  <li>Check browser console for detailed error messages</li>
                </ul>
              </div>
            ) : null}
            <button
              onClick={loadDocuments}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No documents found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doc.filename}</div>
                      {doc.title && (
                        <div className="text-sm text-gray-500">{doc.title}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.total_pages || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/documents/${doc.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

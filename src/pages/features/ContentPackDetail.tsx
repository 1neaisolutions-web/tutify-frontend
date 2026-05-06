/**
 * Content Pack Detail Page
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, BookOpen, Trash2, AlertCircle, Loader2 } from 'lucide-react'
import { getContentPack, fetchDocuments, deleteDocument, ContentPack, Document } from '../../api/contentIngestion'
import { useSnackbar } from '../../hooks/useSnackbar'

export const ContentPackDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pack, setPack] = useState<ContentPack | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; filename: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useSnackbar()
  const isLoadingPackRef = useRef(false)
  const isLoadingDocumentsRef = useRef(false)
  const hasLoadedRef = useRef<string | null>(null) // Track which ID we've loaded
  
  // Use ref for toast to prevent recreation of functions
  const toastRef = useRef(toast)
  useEffect(() => {
    toastRef.current = toast
  }, [toast])
  
  // Define loadPack and loadDocuments BEFORE useEffect hooks that use them
  const loadPack = useCallback(async () => {
    if (!id) return
    
    // Prevent multiple simultaneous calls
    if (isLoadingPackRef.current) {
      console.log('[ContentPackDetail] Already loading pack, skipping...')
      return
    }
    
    try {
      console.log('[ContentPackDetail] Loading pack for ID:', id)
      isLoadingPackRef.current = true
      setLoading(true)
      const data = await getContentPack(id)
      setPack(data)
      hasLoadedRef.current = id // Mark as loaded for this ID
    } catch (error: any) {
      toastRef.current.error(error.message || 'Failed to load content pack')
      console.error('Error loading content pack:', error)
    } finally {
      setLoading(false)
      isLoadingPackRef.current = false
    }
  }, [id]) // Only depend on id, toast via ref
  
  const loadDocuments = useCallback(async () => {
    if (!id) return
    
    // Prevent multiple simultaneous calls
    if (isLoadingDocumentsRef.current) {
      console.log('[ContentPackDetail] Already loading documents, skipping...')
      return
    }
    
    try {
      console.log('[ContentPackDetail] Loading documents for pack ID:', id)
      isLoadingDocumentsRef.current = true
      const data = await fetchDocuments({ pack_id: id })
      setDocuments(data || [])
    } catch (error: any) {
      console.error('Error loading documents:', error)
    } finally {
      isLoadingDocumentsRef.current = false
    }
  }, [id]) // Only depend on id
  
  // Initial load - only run when id changes
  useEffect(() => {
    console.log('[ContentPackDetail] ===== COMPONENT MOUNTED/UPDATED =====')
    console.log('[ContentPackDetail] id from useParams:', id)
    console.log('[ContentPackDetail] Current URL:', window.location.pathname)
    console.log('[ContentPackDetail] Previously loaded ID:', hasLoadedRef.current)
    
    if (!id) {
      console.warn('[ContentPackDetail] No id in params, redirecting to packs list')
      navigate('/admin/content-packs')
      return
    }
    
    // If ID changed, reset loaded state
    if (hasLoadedRef.current !== id) {
      console.log('[ContentPackDetail] ID changed, resetting loaded state')
      hasLoadedRef.current = null
      setPack(null)
      setDocuments([])
    }
    
    // Only load if this is a new ID or we haven't loaded yet
    if (hasLoadedRef.current !== id && !isLoadingPackRef.current && !isLoadingDocumentsRef.current) {
      console.log('[ContentPackDetail] Loading pack and documents for new ID')
      loadPack()
      loadDocuments()
    } else {
      console.log('[ContentPackDetail] Already loaded for this ID or currently loading, skipping')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]) // Only depend on id and navigate, NOT on loadPack/loadDocuments
  
  const handleDeleteClick = (documentId: string, filename: string) => {
    setDocumentToDelete({ id: documentId, filename })
    setShowDeleteModal(true)
  }
  
  const handleConfirmDelete = async () => {
    if (!documentToDelete || isDeleting) return
    
    try {
      setIsDeleting(true)
      await deleteDocument(documentToDelete.id)
      toast.success('Document deleted successfully')
      
      // Close modal immediately
      setShowDeleteModal(false)
      setDocumentToDelete(null)
      
      // Refresh documents list and pack to update counts
      await loadDocuments()
      await loadPack()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document')
      console.error('Error deleting document:', error)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDocumentToDelete(null)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!pack) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Content pack not found</p>
            <button
              onClick={() => navigate('/admin/content-packs')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Content Packs
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/admin/content-packs')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Content Packs</span>
        </button>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pack.name}</h1>
                {pack.description && (
                  <p className="text-gray-600 mt-1">{pack.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                const path = `/admin/documents/upload?pack_id=${pack.id}`
                console.log('[ContentPackDetail] Upload Document clicked, navigating to:', path)
                navigate(path)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Document</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {pack.subject && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                Subject: {pack.subject}
              </span>
            )}
            {pack.grade && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                Grade: {pack.grade}
              </span>
            )}
            {pack.curriculum && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm">
                Curriculum: {pack.curriculum}
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Documents ({documents.length})</h2>
          </div>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No documents in this pack yet</p>
              <button
                onClick={() => {
                  const path = `/admin/documents/upload?pack_id=${pack.id}`
                  console.log('[ContentPackDetail] Upload First Document clicked, navigating to:', path)
                  navigate(path)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/admin/documents/${doc.id}`)}
                    >
                      <h3 className="font-semibold text-gray-900">{doc.filename}</h3>
                      {doc.title && (
                        <p className="text-sm text-gray-600 mt-1">{doc.title}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          doc.status === 'published' ? 'bg-green-100 text-green-700' :
                          doc.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.status}
                        </span>
                        {doc.file_size && (
                          <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                        {doc.created_at && (
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      
                      {/* Show error details for failed documents */}
                      {doc.status === 'failed' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              {doc.error_message && (
                                <p className="text-sm text-red-800 font-medium mb-1">
                                  {doc.error_message}
                                </p>
                              )}
                              {doc.error_code && (
                                <p className="text-xs text-red-600 mb-1">
                                  Error Code: {doc.error_code}
                                </p>
                              )}
                              {doc.remediation_hint && (
                                <p className="text-xs text-red-700 mt-2">
                                  <strong>Hint:</strong> {doc.remediation_hint}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(doc.id, doc.filename)
                      }}
                      className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                      title="Delete document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Professional Delete Confirmation Modal */}
      {showDeleteModal && documentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Document</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>"{documentToDelete.filename}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This will permanently remove the document and all its associated data from the system.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

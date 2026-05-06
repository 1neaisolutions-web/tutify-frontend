/**
 * Simple Document Upload Page with Streaming Progress
 * Single form: Pack metadata + File upload with real-time progress
 */
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SimpleDocumentUpload } from '../../components/contentIngestion/SimpleDocumentUpload'
import { ProcessingStatusCard } from '../../components/contentIngestion/ProcessingStatusCard'
import { useSnackbar } from '../../hooks/useSnackbar'

export const DocumentUpload = () => {
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null)
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const packIdParam = searchParams.get('pack_id')
  
  const handleUploadSuccess = (documentId: string, packId: string) => {
    setUploadedDocumentId(documentId)
  }
  
  if (uploadedDocumentId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              if (packIdParam) {
                navigate(`/admin/content-packs/${packIdParam}`)
              } else {
                navigate('/admin/documents')
              }
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{packIdParam ? 'Back to Content Pack' : 'Back to Documents'}</span>
          </button>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Document Uploaded Successfully
            </h2>
            <p className="text-gray-600">
              Your document is now being processed. You can monitor the progress below.
            </p>
          </div>
          
          <ProcessingStatusCard
            documentId={uploadedDocumentId}
            onComplete={() => {
              toast.success('Document processing completed!')
              setTimeout(() => {
                // If pack_id was provided, navigate back to pack detail page
                if (packIdParam) {
                  navigate(`/admin/content-packs/${packIdParam}`)
                } else {
                  navigate(`/admin/documents/${uploadedDocumentId}`)
                }
              }, 2000)
            }}
            onError={(error) => {
              toast.error(`Processing failed: ${error}`)
              // Still navigate back to pack if pack_id was provided
              if (packIdParam) {
                setTimeout(() => {
                  navigate(`/admin/content-packs/${packIdParam}`)
                }, 2000)
              }
            }}
          />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            if (packIdParam) {
              navigate(`/admin/content-packs/${packIdParam}`)
            } else {
              navigate('/admin/documents')
            }
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{packIdParam ? 'Back to Content Pack' : 'Back to Documents'}</span>
        </button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
            <p className="text-gray-600 mt-1">
              Upload your curriculum document. Create a new content pack or add to an existing one.
            </p>
          </div>
          
          <SimpleDocumentUpload
            existingPackId={packIdParam || undefined}
            onSuccess={handleUploadSuccess}
            onCancel={() => {
              if (packIdParam) {
                navigate(`/admin/content-packs/${packIdParam}`)
              } else {
                navigate('/admin/documents')
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

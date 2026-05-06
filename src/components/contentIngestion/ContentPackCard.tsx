/**
 * Content Pack Card Component
 */
import React from 'react'
import { BookOpen, FileText, Calendar, Trash2, Edit } from 'lucide-react'
import { ContentPack } from '../../api/contentIngestion'

interface ContentPackCardProps {
  pack: ContentPack
  onClick?: () => void
  onDelete?: (packId: string) => void
  onEdit?: (pack: ContentPack) => void
}

export const ContentPackCard = ({ pack, onClick, onDelete, onEdit }: ContentPackCardProps) => {
  if (!pack) {
    return null
  }
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card itself, not on buttons or their children
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="button"]')) {
      return
    }
    if (onClick) {
      onClick()
    }
  }
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    if (onDelete) {
      onDelete(pack.id)
    }
  }
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    if (onEdit) {
      onEdit(pack)
    }
  }
  
  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow relative ${
        onClick ? 'hover:border-blue-500 border-2 border-transparent' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{pack.name || 'Untitled Pack'}</h3>
          </div>
          
          {pack.description && (
            <p className="text-sm text-gray-600 mb-3">{pack.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {pack.subject && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {pack.subject}
              </span>
            )}
            {pack.grade && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                {pack.grade}
              </span>
            )}
            {pack.curriculum && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {pack.curriculum}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit pack"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete pack"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span>{pack.document_count || 0} documents</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{pack.created_at ? new Date(pack.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

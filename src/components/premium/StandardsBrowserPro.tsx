import { useState } from 'react'
import { Standard } from '../../types/premium'
import { Search, X, Check, BookOpen } from 'lucide-react'
import { allStandards, searchStandards, filterStandardsBySubject, filterStandardsByGrade } from '../../utils/standardsDatabase'

interface StandardsBrowserProProps {
  selectedStandards: Standard[]
  onSelect: (standards: Standard[]) => void
  onClose: () => void
}

const StandardsBrowserPro = ({ selectedStandards, onSelect, onClose }: StandardsBrowserProProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [localSelected, setLocalSelected] = useState<Set<string>>(
    new Set(selectedStandards.map((s) => s.id))
  )

  const subjects = ['all', 'English Language Arts', 'Mathematics', 'Science']
  const grades = ['all', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

  let filteredStandards = allStandards

  if (searchQuery) {
    filteredStandards = searchStandards(searchQuery)
  } else if (selectedSubject !== 'all') {
    filteredStandards = filterStandardsBySubject(selectedSubject)
  }

  if (selectedGrade !== 'all') {
    filteredStandards = filteredStandards.filter((s) => s.grade.includes(selectedGrade))
  }

  const handleToggleStandard = (standard: Standard) => {
    const newSelected = new Set(localSelected)
    if (newSelected.has(standard.id)) {
      newSelected.delete(standard.id)
    } else {
      newSelected.add(standard.id)
    }
    setLocalSelected(newSelected)
  }

  const handleApply = () => {
    const selected = allStandards.filter((s) => localSelected.has(s.id))
    onSelect(selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Standards Browser Pro</h2>
              <p className="text-sm text-gray-600">Select educational standards for alignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search standards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            {localSelected.size} standard{localSelected.size !== 1 ? 's' : ''} selected
          </div>
        </div>

        {/* Standards List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredStandards.map((standard) => {
              const isSelected = localSelected.has(standard.id)
              return (
                <div
                  key={standard.id}
                  onClick={() => handleToggleStandard(standard)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 mt-0.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-amber-700">{standard.code}</span>
                        <span className="text-xs text-gray-500">{standard.category}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{standard.grade}</span>
                      </div>
                      <p className="text-sm text-gray-700">{standard.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {filteredStandards.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No standards found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition shadow-md"
          >
            Apply {localSelected.size} Standard{localSelected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StandardsBrowserPro


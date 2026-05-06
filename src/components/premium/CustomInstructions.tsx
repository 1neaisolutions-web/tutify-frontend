import { useState } from 'react'
import { Settings, X, Save, Sparkles } from 'lucide-react'
import { CustomInstruction } from '../../types/premium'

interface CustomInstructionsProps {
  instructions: CustomInstruction | null
  onSave: (instructions: CustomInstruction) => void
  onClose: () => void
}

const CustomInstructions = ({ instructions: initialInstructions, onSave, onClose }: CustomInstructionsProps) => {
  const defaultInstructions: CustomInstruction = {
    teachingStyle: [],
    subjectExpertise: [],
    outputFormat: 'detailed',
    tone: 'professional',
    language: 'en-US',
  }
  const [instructions, setInstructions] = useState<CustomInstruction>(initialInstructions || defaultInstructions)

  const teachingStyles = [
    'Inquiry-based',
    'Direct Instruction',
    'Project-based Learning',
    'Collaborative Learning',
    'Differentiated Instruction',
    'Flipped Classroom',
  ]

  const subjects = [
    'Mathematics',
    'English Language Arts',
    'Science',
    'Social Studies',
    'Arts',
    'Physical Education',
    'Technology',
    'Foreign Languages',
  ]

  const handleSave = () => {
    onSave(instructions)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Custom Instructions</h2>
              <p className="text-sm text-gray-600">Personalize GPT-4's responses to your teaching style</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Teaching Styles */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Teaching Styles</label>
            <div className="flex flex-wrap gap-2">
              {teachingStyles.map((style) => {
                const isSelected = instructions.teachingStyle.includes(style)
                return (
                  <button
                    key={style}
                    onClick={() => {
                      setInstructions((prev) => ({
                        ...prev,
                        teachingStyle: isSelected
                          ? prev.teachingStyle.filter((s) => s !== style)
                          : [...prev.teachingStyle, style],
                      }))
                    }}
                    className={`px-3 py-1.5 rounded-lg border-2 transition ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                        : 'border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {style}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject Expertise */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Subject Expertise</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const isSelected = instructions.subjectExpertise.includes(subject)
                return (
                  <button
                    key={subject}
                    onClick={() => {
                      setInstructions((prev) => ({
                        ...prev,
                        subjectExpertise: isSelected
                          ? prev.subjectExpertise.filter((s) => s !== subject)
                          : [...prev.subjectExpertise, subject],
                      }))
                    }}
                    className={`px-3 py-1.5 rounded-lg border-2 transition ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                        : 'border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {subject}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Output Format</label>
            <div className="flex gap-3">
              {(['detailed', 'concise', 'structured'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setInstructions((prev) => ({ ...prev, outputFormat: format }))}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    instructions.outputFormat === format
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {format.charAt(0).toUpperCase() + format.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Tone</label>
            <div className="flex gap-3">
              {(['professional', 'friendly', 'formal'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setInstructions((prev) => ({ ...prev, tone }))}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    instructions.tone === tone
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Language</label>
            <select
              value={instructions.language}
              onChange={(e) => setInstructions((prev) => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition shadow-md flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Instructions
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomInstructions


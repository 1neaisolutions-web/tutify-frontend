import { useState } from 'react'
import { GraduationCap, HelpCircle, Brain, Target, X, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GuidedQuestion } from '../../types/claude'
import { generateSocraticQuestions, generateStepByStepHints } from '../../utils/claudeUtils'

interface GuidedLearningModeProps {
  topic: string
  onClose: () => void
}

const MODE_KEYS = {
  socratic: 'claude.guidedLearning.mode.socratic',
  'step-by-step': 'claude.guidedLearning.mode.stepByStep',
  'critical-thinking': 'claude.guidedLearning.mode.criticalThinking',
  metacognitive: 'claude.guidedLearning.mode.metacognitive',
} as const

const LEVEL_KEYS = {
  beginner: 'claude.guidedLearning.level.beginner',
  intermediate: 'claude.guidedLearning.level.intermediate',
  advanced: 'claude.guidedLearning.level.advanced',
} as const

const GuidedLearningMode = ({ topic, onClose }: GuidedLearningModeProps) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'socratic' | 'step-by-step' | 'critical-thinking' | 'metacognitive'>('socratic')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [questions, setQuestions] = useState<GuidedQuestion[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [hints, setHints] = useState<string[]>([])

  const handleGenerateQuestions = () => {
    const generated = generateSocraticQuestions(topic, level)
    setQuestions(generated)
  }

  const handleGenerateHints = () => {
    const generated = generateStepByStepHints(topic, currentStep)
    setHints(generated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('claude.guidedLearning.title')}</h2>
              <p className="text-sm text-gray-600">{t('claude.guidedLearning.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t('claude.guidedLearning.mode.label')}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['socratic', 'step-by-step', 'critical-thinking', 'metacognitive'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-3 rounded-lg border-2 transition ${
                    mode === m
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="text-xs font-medium">{t(MODE_KEYS[m])}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t('claude.guidedLearning.level.label')}</label>
            <div className="flex gap-3">
              {(['beginner', 'intermediate', 'advanced'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    level === l
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {t(LEVEL_KEYS[l])}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">{t('claude.guidedLearning.topic.label')}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{topic || t('claude.guidedLearning.topic.empty')}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerateQuestions}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {t('claude.guidedLearning.actions.generateQuestions')}
            </button>
            {mode === 'step-by-step' && (
              <button
                onClick={handleGenerateHints}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <Brain className="h-4 w-4" />
                {t('claude.guidedLearning.actions.generateHints')}
              </button>
            )}
          </div>

          {questions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                {t('claude.guidedLearning.questions.title')}
              </h3>
              {questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="p-4 border-2 border-purple-200 bg-purple-50 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-white rounded border border-purple-200 capitalize">
                          {question.type.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-1 bg-white rounded border border-purple-200 capitalize">
                          {question.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hints.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                {t('claude.guidedLearning.hints.title')}
              </h3>
              {hints.map((hint, idx) => (
                <div
                  key={idx}
                  className={`p-4 border-2 rounded-xl ${
                    idx <= currentStep
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                      idx <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <p className="font-medium text-gray-900">{hint}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setCurrentStep(Math.min(currentStep + 1, hints.length - 1))}
                disabled={currentStep >= hints.length - 1}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('claude.guidedLearning.hints.nextStep')}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition shadow-md"
          >
            {t('claude.common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuidedLearningMode

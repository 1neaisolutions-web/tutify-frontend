import { BookOpen, CheckCircle2, AlertCircle, Target, X, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CurriculumAlignmentResult } from '../../types/claude'

interface CurriculumAlignmentProProps {
  alignmentResult: CurriculumAlignmentResult
  onClose: () => void
}

const CurriculumAlignmentPro = ({ alignmentResult, onClose }: CurriculumAlignmentProProps) => {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('claude.alignment.title')}</h2>
              <p className="text-sm text-gray-600">{t('claude.alignment.subtitle')}</p>
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
          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">{t('claude.alignment.score.label')}</div>
                <div className="text-4xl font-bold text-purple-600">{alignmentResult.alignmentScore}%</div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <div className="text-sm text-gray-600">
                  {t('claude.alignment.score.standardsAnalyzed', { count: alignmentResult.standards.length })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              {t('claude.alignment.coverage.title')}
            </h3>
            <div className="space-y-2">
              {alignmentResult.coverage.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    item.covered ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.covered ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.standard}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.covered ? t('claude.common.covered') : t('claude.common.notCovered')}
                      </div>
                      {item.evidence.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {t('claude.common.evidence')} {item.evidence.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {alignmentResult.gaps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                {t('claude.alignment.gaps.title')}
              </h3>
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {alignmentResult.gaps.map((gap, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {alignmentResult.crossCurricularConnections.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('claude.alignment.crossCurricular.title')}</h3>
              <div className="space-y-3">
                {alignmentResult.crossCurricularConnections.map((connection, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-white">
                    <div className="font-semibold text-gray-900 mb-2">{connection.subject}</div>
                    <ul className="space-y-1">
                      {connection.connections.map((conn, connIdx) => (
                        <li key={connIdx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-600">•</span>
                          <span>{conn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('claude.alignment.ethical.title')}</h3>
            <div className={`p-5 rounded-xl border-2 ${
              alignmentResult.ethicalReview.passed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {alignmentResult.ethicalReview.passed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                )}
                <div className="font-bold text-gray-900">
                  {alignmentResult.ethicalReview.passed
                    ? t('claude.alignment.ethical.passed')
                    : t('claude.alignment.ethical.reviewRequired')}
                </div>
              </div>
              {alignmentResult.ethicalReview.concerns.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold text-gray-700 mb-2">{t('claude.alignment.ethical.concerns')}</div>
                  <ul className="space-y-1">
                    {alignmentResult.ethicalReview.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {alignmentResult.ethicalReview.recommendations.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{t('claude.alignment.ethical.recommendations')}</div>
                  <ul className="space-y-1">
                    {alignmentResult.ethicalReview.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
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

export default CurriculumAlignmentPro

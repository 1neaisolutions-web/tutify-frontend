import { FileCheck, CheckCircle2, AlertTriangle, Shield, X, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EthicalAssessmentReview } from '../../types/claude'

interface EthicalAssessmentBuilderProps {
  assessmentReview: EthicalAssessmentReview
  onClose: () => void
}

const EthicalAssessmentBuilder = ({ assessmentReview, onClose }: EthicalAssessmentBuilderProps) => {
  const { t } = useTranslation()
  const allPassed =
    assessmentReview.biasFree &&
    assessmentReview.culturallyResponsive &&
    assessmentReview.accessible &&
    assessmentReview.fair

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
              <FileCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('claude.assessment.title')}</h2>
              <p className="text-sm text-gray-600">{t('claude.assessment.subtitle')}</p>
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
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">{t('claude.assessment.score.label')}</div>
                <div className="text-4xl font-bold text-green-600">{assessmentReview.score}%</div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="text-sm text-gray-600">
                  {allPassed ? t('claude.assessment.score.allPassed') : t('claude.assessment.score.reviewRequired')}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('claude.assessment.criteria.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-4 rounded-lg border-2 ${
                assessmentReview.biasFree ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {assessmentReview.biasFree ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="font-semibold text-gray-900">{t('claude.assessment.criteria.biasFree')}</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessmentReview.culturallyResponsive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {assessmentReview.culturallyResponsive ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="font-semibold text-gray-900">{t('claude.assessment.criteria.culturallyResponsive')}</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessmentReview.accessible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {assessmentReview.accessible ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="font-semibold text-gray-900">{t('claude.assessment.criteria.accessible')}</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessmentReview.fair ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {assessmentReview.fair ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="font-semibold text-gray-900">{t('claude.assessment.criteria.fair')}</div>
                </div>
              </div>
            </div>
          </div>

          {assessmentReview.issues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                {t('claude.assessment.biasIssues.title')}
              </h3>
              <div className="space-y-3">
                {assessmentReview.issues.map((issue, idx) => (
                  <div key={idx} className="p-4 border-2 border-amber-200 bg-amber-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {issue.type
                            ? t('claude.assessment.biasIssues.type', {
                                type: issue.type.charAt(0).toUpperCase() + issue.type.slice(1),
                              })
                            : t('claude.assessment.biasIssues.detected')}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {t('claude.common.severity')} <span className="font-semibold">{issue.severity}</span>
                        </div>
                        {issue.location && (
                          <div className="text-xs text-gray-500 mb-2">
                            {t('claude.common.location')} {issue.location}
                          </div>
                        )}
                        <div className="text-sm text-amber-700">{issue.suggestion}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assessmentReview.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                {t('claude.common.recommendations')}
              </h3>
              <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
                <ul className="space-y-2">
                  {assessmentReview.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className={`p-5 rounded-xl border-2 ${
            assessmentReview.score >= 80
              ? 'border-green-300 bg-green-50'
              : assessmentReview.score >= 60
              ? 'border-amber-300 bg-amber-50'
              : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex items-center gap-3">
              {assessmentReview.score >= 80 ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              )}
              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {assessmentReview.score >= 80
                    ? t('claude.assessment.summary.ready')
                    : assessmentReview.score >= 60
                    ? t('claude.assessment.summary.reviewRecommended')
                    : t('claude.assessment.summary.significantIssues')}
                </div>
                <div className="text-sm text-gray-600">
                  {assessmentReview.score >= 80
                    ? t('claude.assessment.summary.readyMessage')
                    : t('claude.assessment.summary.reviewMessage')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition shadow-md"
          >
            {t('claude.common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EthicalAssessmentBuilder

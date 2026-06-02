import { Shield, CheckCircle2, AlertTriangle, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EthicalAIPrinciples, BiasDetectionResult, PrivacyComplianceStatus } from '../../types/claude'

interface EthicalAIDashboardProps {
  principles: EthicalAIPrinciples
  biasResults?: BiasDetectionResult[]
  privacyStatus?: PrivacyComplianceStatus
  onClose: () => void
}

const EthicalAIDashboard = ({ principles, biasResults, privacyStatus, onClose }: EthicalAIDashboardProps) => {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('claude.ethicalDashboard.title')}</h2>
              <p className="text-sm text-gray-600">{t('claude.ethicalDashboard.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('claude.ethicalDashboard.principles.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(principles).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    value ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {value ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {value ? t('claude.common.active') : t('claude.common.inactive')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {biasResults && biasResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('claude.ethicalDashboard.bias.title')}</h3>
              <div className="space-y-2">
                {biasResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      result.detected ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.detected ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {result.detected
                            ? t('claude.ethicalDashboard.bias.detected', { type: result.type })
                            : t('claude.ethicalDashboard.bias.none')}
                        </div>
                        {result.detected && (
                          <>
                            <div className="text-sm text-gray-600 mt-1">
                              {t('claude.common.severity')} <span className="font-semibold">{result.severity}</span>
                            </div>
                            {result.location && (
                              <div className="text-xs text-gray-500 mt-1">
                                {t('claude.common.location')} {result.location}
                              </div>
                            )}
                            <div className="text-sm text-amber-700 mt-2">{result.suggestion}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {privacyStatus && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('claude.ethicalDashboard.privacy.title')}</h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-2 ${
                  privacyStatus.ferpaCompliant ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-3">
                    {privacyStatus.ferpaCompliant ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{t('claude.ethicalDashboard.privacy.ferpa')}</div>
                      <div className="text-sm text-gray-600">
                        {privacyStatus.ferpaCompliant ? t('claude.common.compliant') : t('claude.common.nonCompliant')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  privacyStatus.coppaCompliant ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-3">
                    {privacyStatus.coppaCompliant ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{t('claude.ethicalDashboard.privacy.coppa')}</div>
                      <div className="text-sm text-gray-600">
                        {privacyStatus.coppaCompliant ? t('claude.common.compliant') : t('claude.common.nonCompliant')}
                      </div>
                    </div>
                  </div>
                </div>
                {privacyStatus.recommendations.length > 0 && (
                  <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                    <div className="font-semibold text-gray-900 mb-2">{t('claude.common.recommendations')}</div>
                    <ul className="space-y-1">
                      {privacyStatus.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md"
          >
            {t('claude.common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EthicalAIDashboard

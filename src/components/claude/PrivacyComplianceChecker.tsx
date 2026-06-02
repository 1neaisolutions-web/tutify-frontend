import { Shield, CheckCircle2, AlertTriangle, Lock, Eye, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrivacyComplianceStatus } from '../../types/claude'

interface PrivacyComplianceCheckerProps {
  complianceStatus: PrivacyComplianceStatus
  onClose: () => void
}

const PrivacyComplianceChecker = ({ complianceStatus, onClose }: PrivacyComplianceCheckerProps) => {
  const { t } = useTranslation()
  const allCompliant = complianceStatus.ferpaCompliant && complianceStatus.coppaCompliant

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('claude.privacy.title')}</h2>
              <p className="text-sm text-gray-600">{t('claude.privacy.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-xl border-2 ${
              complianceStatus.ferpaCompliant ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {complianceStatus.ferpaCompliant ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
                <div className="font-bold text-gray-900">{t('claude.privacy.ferpa.title')}</div>
              </div>
              <div className="text-sm text-gray-600">
                {complianceStatus.ferpaCompliant
                  ? t('claude.privacy.ferpa.pass')
                  : t('claude.privacy.ferpa.fail')}
              </div>
            </div>

            <div className={`p-5 rounded-xl border-2 ${
              complianceStatus.coppaCompliant ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {complianceStatus.coppaCompliant ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
                <div className="font-bold text-gray-900">{t('claude.privacy.coppa.title')}</div>
              </div>
              <div className="text-sm text-gray-600">
                {complianceStatus.coppaCompliant
                  ? t('claude.privacy.coppa.pass')
                  : t('claude.privacy.coppa.fail')}
              </div>
            </div>

            <div className={`p-5 rounded-xl border-2 ${
              complianceStatus.dataMinimized ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {complianceStatus.dataMinimized ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                )}
                <div className="font-bold text-gray-900">{t('claude.privacy.dataMinimization.title')}</div>
              </div>
              <div className="text-sm text-gray-600">
                {complianceStatus.dataMinimized
                  ? t('claude.privacy.dataMinimization.pass')
                  : t('claude.privacy.dataMinimization.warn')}
              </div>
            </div>

            <div className={`p-5 rounded-xl border-2 ${
              complianceStatus.secureHandling ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {complianceStatus.secureHandling ? (
                  <Lock className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
                <div className="font-bold text-gray-900">{t('claude.privacy.secureHandling.title')}</div>
              </div>
              <div className="text-sm text-gray-600">
                {complianceStatus.secureHandling
                  ? t('claude.privacy.secureHandling.pass')
                  : t('claude.privacy.secureHandling.fail')}
              </div>
            </div>
          </div>

          {complianceStatus.issues.length > 0 && (
            <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div className="font-bold text-gray-900">{t('claude.privacy.issues.title')}</div>
              </div>
              <ul className="space-y-2">
                {complianceStatus.issues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {complianceStatus.recommendations.length > 0 && (
            <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <div className="font-bold text-gray-900">{t('claude.common.recommendations')}</div>
              </div>
              <ul className="space-y-2">
                {complianceStatus.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={`p-5 rounded-xl border-2 ${
            allCompliant ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
          }`}>
            <div className="flex items-center gap-3">
              {allCompliant ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              )}
              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {allCompliant ? t('claude.privacy.overall.compliant') : t('claude.privacy.overall.reviewRequired')}
                </div>
                <div className="text-sm text-gray-600">
                  {allCompliant ? t('claude.privacy.overall.passMessage') : t('claude.privacy.overall.failMessage')}
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

export default PrivacyComplianceChecker

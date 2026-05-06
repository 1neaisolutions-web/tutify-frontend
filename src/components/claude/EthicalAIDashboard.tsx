import { Shield, CheckCircle2, AlertTriangle, Lock, Eye } from 'lucide-react'
import { EthicalAIPrinciples, BiasDetectionResult, PrivacyComplianceStatus } from '../../types/claude'

interface EthicalAIDashboardProps {
  principles: EthicalAIPrinciples
  biasResults?: BiasDetectionResult[]
  privacyStatus?: PrivacyComplianceStatus
  onClose: () => void
}

const EthicalAIDashboard = ({ principles, biasResults, privacyStatus, onClose }: EthicalAIDashboardProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ethical AI Dashboard</h2>
              <p className="text-sm text-gray-600">Constitutional AI principles and compliance status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Constitutional AI Principles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Constitutional AI Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(principles).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    value
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
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
                        {value ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bias Detection */}
          {biasResults && biasResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bias Detection</h3>
              <div className="space-y-2">
                {biasResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      result.detected
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-green-200 bg-green-50'
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
                          {result.detected ? `Bias Detected: ${result.type}` : 'No Bias Detected'}
                        </div>
                        {result.detected && (
                          <>
                            <div className="text-sm text-gray-600 mt-1">
                              Severity: <span className="font-semibold">{result.severity}</span>
                            </div>
                            {result.location && (
                              <div className="text-xs text-gray-500 mt-1">Location: {result.location}</div>
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

          {/* Privacy Compliance */}
          {privacyStatus && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Compliance</h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-2 ${
                  privacyStatus.ferpaCompliant
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-3">
                    {privacyStatus.ferpaCompliant ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">FERPA Compliance</div>
                      <div className="text-sm text-gray-600">
                        {privacyStatus.ferpaCompliant ? 'Compliant' : 'Non-compliant'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  privacyStatus.coppaCompliant
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-3">
                    {privacyStatus.coppaCompliant ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">COPPA Compliance</div>
                      <div className="text-sm text-gray-600">
                        {privacyStatus.coppaCompliant ? 'Compliant' : 'Non-compliant'}
                      </div>
                    </div>
                  </div>
                </div>
                {privacyStatus.recommendations.length > 0 && (
                  <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                    <div className="font-semibold text-gray-900 mb-2">Recommendations</div>
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default EthicalAIDashboard




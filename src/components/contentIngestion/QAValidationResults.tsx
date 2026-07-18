/**
 * QA Validation Results Component
 */
import React from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface QAValidationResultsProps {
  qaResults: {
    qa_status: string
    page_coverage_check: boolean | null
    text_density_check: boolean | null
    embedding_completeness_check: boolean | null
    vector_retrieval_check: boolean | null
    metrics: Record<string, any> | null
    golden_query_results: Array<{
      query: string
      passed: boolean
      chunks_found: number
    }> | null
    qa_notes: string | null
  }
}

export const QAValidationResults = ({ qaResults }: QAValidationResultsProps) => {
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('content.qa.title')}</h3>
        <div className={`mt-2 flex items-center space-x-2 ${
          qaResults.qa_status === 'passed' ? 'text-green-600' : 'text-red-600'
        }`}>
          {qaResults.qa_status === 'passed' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">
            {t('content.qa.status', { status: qaResults.qa_status.toUpperCase() })}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-700">{t('content.qa.checks.pageCoverage')}</span>
          {qaResults.page_coverage_check ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-700">{t('content.qa.checks.textDensity')}</span>
          {qaResults.text_density_check ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-700">{t('content.qa.checks.embeddingCompleteness')}</span>
          {qaResults.embedding_completeness_check ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-700">{t('content.qa.checks.vectorRetrieval')}</span>
          {qaResults.vector_retrieval_check ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
      </div>

      {qaResults.metrics && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('content.qa.metrics.title')}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(qaResults.metrics).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-600">{key.replace(/_/g, ' ')}:</span>{' '}
                <span className="font-medium text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {qaResults.golden_query_results && qaResults.golden_query_results.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('content.qa.goldenQueries.title')}</h4>
          <div className="space-y-2">
            {qaResults.golden_query_results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{result.query}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {t('content.qa.goldenQueries.chunksFound', { count: result.chunks_found })}
                    </p>
                  </div>
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {qaResults.qa_notes && (
        <div className="border-t pt-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{t('content.qa.notes.title')}</p>
              <p className="text-sm text-gray-600 mt-1">{qaResults.qa_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { ListTree } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TOC_JSON_EXAMPLE } from './tocChapterMapParse'

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TocJsonOptionalSection({ value, onChange, disabled }: Props) {
  const { t } = useTranslation()

  return (
    <details className="group rounded-lg border border-indigo-100 bg-indigo-50/40 open:bg-indigo-50/60">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-950 [&::-webkit-details-marker]:hidden">
        <ListTree className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
        <span>{t('content.toc.title')}</span>
        <span className="ml-auto text-xs font-normal text-indigo-700/80 group-open:hidden">{t('common.showMore')}</span>
        <span className="ml-auto hidden text-xs font-normal text-indigo-700/80 group-open:inline">{t('common.showLess')}</span>
      </summary>
      <div className="space-y-3 border-t border-indigo-100/80 px-4 pb-4 pt-2">
        <p className="text-xs leading-relaxed text-indigo-900/85">
          {t('content.toc.help')}
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          rows={8}
          placeholder={t('content.toc.placeholder')}
          className="w-full rounded-md border border-indigo-200 bg-white px-3 py-2 font-mono text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          aria-label={t('content.toc.ariaLabel')}
        />
        <details className="rounded border border-indigo-100 bg-white/80 text-xs">
          <summary className="cursor-pointer px-3 py-2 font-medium text-indigo-900">{t('content.toc.example.title')}</summary>
          <pre className="max-h-40 overflow-auto border-t border-indigo-50 p-3 text-[11px] leading-relaxed text-gray-700">
            {TOC_JSON_EXAMPLE}
          </pre>
        </details>
      </div>
    </details>
  )
}

import { useState, useRef, useEffect, useId, type KeyboardEvent } from 'react'
import { Search, Globe, Check, ChevronDown, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { tText } from '../../../i18n/tText'
import { useLanguageList } from '../../../hooks/useLanguageList'
import type { LanguageOption } from '../../../constants/languageData'

interface LanguageSearchDropdownProps {
  value: string
  onChange: (code: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

export function LanguageSearchDropdown({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  error,
  className = '',
}: LanguageSearchDropdownProps) {
  const { t } = useTranslation()
  const searchPlaceholder = placeholder ?? tText(t, 'languageDropdown.searchPlaceholder')
  const { languages, isLoading } = useLanguageList()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const id = useId()

  const selected = languages.find((l) => l.code === value) ?? null

  const filtered = query.trim()
    ? languages.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(query.toLowerCase()) ||
          l.code.toLowerCase().includes(query.toLowerCase()),
      )
    : languages

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      const el = listRef.current?.querySelector('[aria-selected="true"]')
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [open])

  function handleSelect(lang: LanguageOption) {
    onChange(lang.code)
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
    if (e.key === 'Enter' && filtered.length === 1) handleSelect(filtered[0])
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex w-full items-center justify-between gap-2
          rounded-xl border px-4 py-3 text-sm text-left
          transition-all duration-150
          ${disabled ? 'cursor-not-allowed bg-gray-50 opacity-60' : 'cursor-pointer bg-white hover:border-primary-400'}
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'}
          focus:outline-none
        `}
      >
        <span className="flex items-center gap-3 min-w-0">
          <Globe className="h-4 w-4 text-gray-400 shrink-0" />
          {isLoading ? (
            <span className="text-gray-400">{t('languageDropdown.loading')}</span>
          ) : selected ? (
            <span className="flex flex-col min-w-0">
              <span className="font-medium text-gray-900 truncate">{selected.name}</span>
              <span className="text-xs text-gray-400 truncate">{selected.nativeName}</span>
            </span>
          ) : (
            <span className="text-gray-400">{t('languageDropdown.placeholder')}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {open && !disabled && (
        <div
          className="
            absolute left-0 right-0 top-full z-50 mt-2
            rounded-2xl border border-gray-200 bg-white shadow-2xl
            overflow-hidden
          "
        >
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="
                  w-full rounded-lg border border-gray-200 bg-gray-50
                  py-2 pl-9 pr-8 text-sm outline-none
                  focus:border-primary-400 focus:bg-white transition-colors
                "
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <ul
            ref={listRef}
            role="listbox"
            aria-label={t('languageDropdown.listLabel')}
            className="max-h-60 overflow-y-auto py-1.5 scroll-smooth"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                {t('languageDropdown.noMatch', { query })}
              </li>
            ) : (
              filtered.map((lang) => {
                const isSelected = lang.code === value
                return (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang)}
                    className={`
                      flex items-center justify-between gap-3
                      cursor-pointer px-4 py-2.5 text-sm
                      transition-colors
                      ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <span className="flex flex-col min-w-0">
                      <span
                        className={`font-medium truncate ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}
                      >
                        {lang.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">{lang.nativeName}</span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-primary-600 shrink-0" />}
                  </li>
                )
              })
            )}
          </ul>

          <div className="border-t border-gray-100 px-4 py-2">
            <p className="text-xs text-gray-400">
              {t('languageDropdown.count', { count: filtered.length })}
              {query ? t('languageDropdown.countMatch', { query }) : t('languageDropdown.countAvailable')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSearchDropdown

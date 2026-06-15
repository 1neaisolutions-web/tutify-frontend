import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SelectDropdown } from '../SelectDropdown'
import { FALLBACK_GRADE_BANDS } from '@/catalog/fallbacks'
import {
  getBandOptionsForContext,
  buildYoutubeBandOptions,
  buildVisualArtsBandOptions,
  buildCareerBusinessBandOptions,
  type GradeBandContextKey,
  type GradeBandOption,
} from '@/catalog/contexts'
import { bandValueForSelect as resolveBandSelectValue } from '@/catalog/adapters/gradeBandAdapters'

export type { GradeBandContextKey }

interface GradeBandSelectProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorMsg?: string
  name?: string
  className?: string
  variant?: 'default' | 'native'
  allowEmpty?: boolean
  emptyLabel?: string
  /** Override Redux metadata options (module-specific band lists). */
  options?: GradeBandOption[]
  /** Custom class for native `<select>` (e.g. themed headers). */
  selectClassName?: string
  /** Resolve options from catalog/contexts.ts */
  context?: GradeBandContextKey
}

const nativeSelectClass =
  'w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100'

export const GradeBandSelect = ({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  errorMsg = '',
  name = 'gradeBand',
  className,
  variant = 'default',
  allowEmpty = false,
  emptyLabel,
  options: optionsOverride,
  selectClassName,
  context = 'default',
}: GradeBandSelectProps) => {
  const { t } = useTranslation()
  const bandsFromStore = useSelector(
    (state: { profileContext?: { gradeBands?: GradeBandOption[] } }) =>
      state.profileContext?.gradeBands,
  )

  const contextOptions =
    context === 'youtube'
      ? buildYoutubeBandOptions(bandsFromStore, {
          grades35: t('youtubeQuizPage.gradeBands.grades35', { defaultValue: 'Grades 3-5' }),
          grades68: t('youtubeQuizPage.gradeBands.grades68', { defaultValue: 'Grades 6-8' }),
          grades910: t('youtubeQuizPage.gradeBands.grades910', { defaultValue: 'Grades 9-10' }),
          grades1112: t('youtubeQuizPage.gradeBands.grades1112', { defaultValue: 'Grades 11-12' }),
          higherEd: t('youtubeQuizPage.gradeBands.higherEd', { defaultValue: 'Higher Education' }),
        })
      : context === 'visualArts'
        ? buildVisualArtsBandOptions(
            bandsFromStore,
            t('visualArtsStudioAssistant.k5', { defaultValue: 'K–5' }),
          )
        : context === 'careerBusiness'
          ? buildCareerBusinessBandOptions(
              bandsFromStore,
              t('careerReadinessCoach.college', { defaultValue: 'College' }),
            )
          : getBandOptionsForContext(context, bandsFromStore)

  const options: GradeBandOption[] =
    optionsOverride ??
    (contextOptions.length > 0 ? contextOptions : [...FALLBACK_GRADE_BANDS])

  const displayValue =
    context === 'default' && !optionsOverride
      ? value
      : resolveBandSelectValue(value, context)

  const resolvedLabel = label ?? t('common.gradeLevel', { defaultValue: 'Grade Band' })
  const resolvedPlaceholder = placeholder ?? t('shared.selectDropdown.placeholder')
  const resolvedEmptyLabel = emptyLabel ?? t('shared.selectDropdown.placeholder')

  if (variant === 'native') {
    return (
      <label className={`block ${className ?? ''}`}>
        {resolvedLabel ? (
          <span className="mb-2 block text-sm font-medium text-gray-700">
            {resolvedLabel}
            {required ? <span className="text-red-500"> *</span> : null}
          </span>
        ) : null}
        <select
          name={name}
          value={displayValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={selectClassName ?? nativeSelectClass}
        >
          {allowEmpty ? <option value="">{resolvedEmptyLabel}</option> : null}
          {options.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        {error && errorMsg ? <span className="text-xs text-red-600">{errorMsg}</span> : null}
      </label>
    )
  }

  const handleChange = (e: { target?: { value?: GradeBandOption | string } }) => {
    const selected = e?.target?.value
    const val =
      typeof selected === 'object' && selected !== null && 'value' in selected
        ? selected.value
        : selected
    onChange(val != null ? String(val) : '')
  }

  return (
    <SelectDropdown
      name={name}
      label={resolvedLabel}
      placeholder={resolvedPlaceholder}
      options={options}
      value={displayValue}
      onChange={handleChange}
      required={required}
      disabled={disabled}
      error={error}
      errorMsg={errorMsg}
      className={className}
    />
  )
}

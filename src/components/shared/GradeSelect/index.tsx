import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SelectDropdown } from '../SelectDropdown'
import { FALLBACK_GRADES } from '@/catalog/fallbacks'

type GradeOption = { value: string; label: string }

export type { GradeOption }

interface GradeSelectProps {
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
  /** Native Tailwind select for teacher-tools filter bars */
  variant?: 'default' | 'native'
  /** Include empty option (filters) */
  allowEmpty?: boolean
  emptyLabel?: string
  /** Override Redux metadata options (e.g. template enum subset). */
  options?: GradeOption[]
  /** Custom class for native `<select>` (e.g. TemplateRunner fields). */
  selectClassName?: string
}

const nativeSelectClass =
  'rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 w-full'

export const GradeSelect = ({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  errorMsg = '',
  name = 'grade',
  className,
  variant = 'default',
  allowEmpty = false,
  emptyLabel,
  options: optionsOverride,
  selectClassName,
}: GradeSelectProps) => {
  const { t } = useTranslation()
  const gradesFromStore = useSelector(
    (state: { profileContext?: { grades?: GradeOption[] } }) => state.profileContext?.grades,
  )
  const options: GradeOption[] =
    optionsOverride ??
    (gradesFromStore && gradesFromStore.length > 0 ? gradesFromStore : [...FALLBACK_GRADES])

  const resolvedLabel = label ?? t('common.gradeLevel', { defaultValue: 'Grade Level' })
  const resolvedPlaceholder = placeholder ?? t('shared.selectDropdown.placeholder')
  const resolvedEmptyLabel = emptyLabel ?? t('teacherTools.allGrades', { defaultValue: 'All grades' })

  if (variant === 'native') {
    return (
      <label className={`flex min-w-0 flex-col gap-1 ${className ?? ''}`}>
        {resolvedLabel ? (
          <span className="text-sm font-medium text-gray-800">
            {resolvedLabel}
            {required ? <span className="text-red-500"> *</span> : null}
          </span>
        ) : null}
        <select
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={selectClassName ?? nativeSelectClass}
          aria-invalid={error}
        >
          {allowEmpty ? <option value="">{resolvedEmptyLabel}</option> : null}
          {options.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        {error && errorMsg ? <span className="text-xs text-red-600">{errorMsg}</span> : null}
      </label>
    )
  }

  const handleChange = (e: { target?: { value?: GradeOption | string } }) => {
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
      value={value}
      onChange={handleChange}
      required={required}
      disabled={disabled}
      error={error}
      errorMsg={errorMsg}
      className={className}
    />
  )
}

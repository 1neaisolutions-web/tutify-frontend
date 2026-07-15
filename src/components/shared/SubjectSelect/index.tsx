import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SelectDropdown } from '../SelectDropdown'
import {
  getSubjectOptionsForContext,
  subjectValueForSelect,
  type SubjectContextKey,
  type SubjectOption,
} from '@/catalog/adapters/subjectAdapters'

export type { SubjectContextKey }

interface SubjectSelectProps {
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
  options?: SubjectOption[]
  selectClassName?: string
  context?: SubjectContextKey
}

const nativeSelectClass =
  'rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 w-full'

export const SubjectSelect = ({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  errorMsg = '',
  name = 'subject',
  className,
  variant = 'default',
  allowEmpty = false,
  emptyLabel,
  options: optionsOverride,
  selectClassName,
  context = 'default',
}: SubjectSelectProps) => {
  const { t } = useTranslation()
  const subjectsFromStore = useSelector(
    (state: { profileContext?: { subjects?: SubjectOption[] } }) =>
      state.profileContext?.subjects,
  )

  const options =
    optionsOverride ?? getSubjectOptionsForContext(context, subjectsFromStore)

  const displayValue = subjectValueForSelect(value)

  const resolvedLabel = label ?? t('common.subject', { defaultValue: 'Subject' })
  const resolvedPlaceholder = placeholder ?? t('shared.selectDropdown.placeholder')
  const resolvedEmptyLabel = emptyLabel ?? t('shared.selectDropdown.placeholder')

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
          value={displayValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={selectClassName ?? nativeSelectClass}
          aria-invalid={error}
        >
          {allowEmpty ? <option value="">{resolvedEmptyLabel}</option> : null}
          {options.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {error && errorMsg ? <span className="text-xs text-red-600">{errorMsg}</span> : null}
      </label>
    )
  }

  const handleChange = (e: { target?: { value?: SubjectOption | string } }) => {
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

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { signup } from '../../redux/features/auth/signupSlice'
import { LanguageSearchDropdown } from '../../components/shared/LanguageSearchDropdown'
import { useAuthLanguage } from '../../hooks/useAuthLanguage'
import type { AppDispatch } from '../../redux/store'

const IndividualSignup: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: { signup: { loading: boolean; error: string | null } }) => state.signup)
  const { selectedLanguage, handleLanguageChange } = useAuthLanguage()

  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    institution_code: '',
  })
  const [isIndividualAccount, setIsIndividualAccount] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = t('signup.validation.emailRequired')
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('signup.validation.emailInvalid')
    if (!formData.password) newErrors.password = t('signup.validation.passwordRequired')
    else if (formData.password.length < 10) newErrors.password = t('signup.validation.passwordMinLength')
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t('signup.validation.passwordMismatch')
    if (!formData.first_name) newErrors.first_name = t('signup.validation.firstNameRequired')
    if (!formData.last_name) newErrors.last_name = t('signup.validation.lastNameRequired')
    if (!isIndividualAccount && !formData.institution_code)
      newErrors.institution_code = t('signup.validation.institutionCodeRequired')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const signupData: Record<string, unknown> = {
      role: selectedRole,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
      language: selectedLanguage,
    }

    if (!isIndividualAccount && formData.institution_code) {
      signupData.institution_code = formData.institution_code
    }

    try {
      await dispatch(signup(signupData)).unwrap()
      navigate('/login')
    } catch {
      // error from Redux state
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <LanguageSearchDropdown
            value={selectedLanguage}
            onChange={handleLanguageChange}
            label={t('signup.fields.language')}
            placeholder={t('signup.languageSearch')}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('signup.individual.title')}</h2>

        {step === 1 && (
          <div>
            <p className="text-gray-600 mb-6">{t('signup.individual.selectRole')}</p>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleRoleSelect('teacher')}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                {t('signup.individual.roleTeacher')}
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                {t('signup.individual.roleStudent')}
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              {t('common.back')}
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('signup.fields.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('signup.fields.password')} *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('signup.fields.confirmPassword')} *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('signup.fields.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('signup.fields.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('signup.fields.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="individual-account"
                  type="checkbox"
                  checked={isIndividualAccount}
                  onChange={(e) => {
                    setIsIndividualAccount(e.target.checked)
                    if (e.target.checked) {
                      setFormData((prev) => ({ ...prev, institution_code: '' }))
                      setErrors((prev) => ({ ...prev, institution_code: '' }))
                    }
                  }}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="individual-account" className="ml-2 block text-sm text-gray-700">
                  {t('signup.individual.createWithoutInstitution')}
                </label>
              </div>

              {!isIndividualAccount && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('signup.fields.institutionCode')} *
                  </label>
                  <input
                    type="text"
                    name="institution_code"
                    value={formData.institution_code}
                    onChange={handleChange}
                    placeholder={t('signup.fields.institutionCodePlaceholder')}
                    className={`w-full px-3 py-2 border rounded-md ${errors.institution_code ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.institution_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.institution_code}</p>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  {t('common.back')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? t('signup.creatingAccount') : t('signup.createAccount')}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default IndividualSignup

/**
 * Content Packs Management Page
 *
 * Admin interface for creating, editing, and deleting content packs.
 * Content packs are the primary catalog source for quiz RAG injection —
 * data quality here directly affects teacher quiz source/topic selection.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus,
  Search,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  PackageOpen,
  RefreshCw,
} from 'lucide-react'
import {
  fetchContentPacks,
  createContentPack,
  deleteContentPack,
  updateContentPack,
  type ContentPack,
  type ContentPackCreate,
} from '../../api/contentIngestion'
import { ContentPackCard } from '../../components/contentIngestion/ContentPackCard'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { GradeBandSelect } from '@/components/shared/GradeBandSelect'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import { gradeBandValueForSelect } from '@/catalog/adapters/gradeBandAdapters'
import { subjectValueForSelect } from '@/catalog/adapters/subjectAdapters'
import type { TFunction } from 'i18next'
// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

function extractApiError(error: unknown, t: TFunction): string {
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>
    const status = e.status as number | undefined
    const message = e.message as string | undefined

    if (status === 409) return t('contentPacksPage.errors.duplicateName')
    if (status === 403) return t('contentPacksPage.errors.forbidden')
    if (status === 404) return t('contentPacksPage.errors.notFound')
    if (status === 422) return message || t('contentPacksPage.errors.invalidInput')
    if (status === 401) return t('contentPacksPage.errors.sessionExpired')
    if (message) return message
  }
  return t('contentPacksPage.errors.unexpected')
}

// ---------------------------------------------------------------------------
// Skeleton loaders
// ---------------------------------------------------------------------------

const PackCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="h-5 w-5 bg-gray-200 rounded mr-2 shrink-0" />
      <div className="flex-1 h-5 bg-gray-200 rounded" />
    </div>
    <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-16 bg-gray-100 rounded" />
      <div className="h-5 w-20 bg-gray-100 rounded" />
    </div>
    <div className="flex justify-between">
      <div className="h-4 w-24 bg-gray-100 rounded" />
      <div className="h-4 w-20 bg-gray-100 rounded" />
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// PackFormModal — unified create/edit modal (prevents label-swap bugs)
// ---------------------------------------------------------------------------

type ModalMode = 'create' | 'edit'

interface PackFormValues {
  name: string
  description: string
  subject: string
  grade: string
  curriculum: string
}

interface PackFormErrors {
  name?: string
}

interface PackFormModalProps {
  mode: ModalMode
  initialValues?: Partial<PackFormValues>
  onClose: () => void
  onSubmit: (data: ContentPackCreate) => Promise<void>
}

const EMPTY_FORM: PackFormValues = {
  name: '',
  description: '',
  subject: '',
  grade: '',
  curriculum: '',
}

const PackFormModal = ({ mode, initialValues, onClose, onSubmit }: PackFormModalProps) => {
  const { t } = useTranslation()
  const [values, setValues] = useState<PackFormValues>({
    ...EMPTY_FORM,
    ...initialValues,
    subject: subjectValueForSelect(initialValues?.subject),
  })
  const [errors, setErrors] = useState<PackFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const modalTitle = mode === 'create' ? t('contentPacksPage.modalCreateTitle') : t('contentPacksPage.modalEditTitle')
  const modalButton = mode === 'create' ? t('contentPacksPage.modalCreateButton') : t('contentPacksPage.modalEditButton')

  const set = (field: keyof PackFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))

  const validate = (): boolean => {
    const next: PackFormErrors = {}
    const trimmedName = values.name.trim()
    if (!trimmedName) {
      next.name = t('contentPacksPage.validationNameRequired')
    } else if (trimmedName.length < 2) {
      next.name = t('contentPacksPage.validationNameMinLength')
    } else if (trimmedName.length > 200) {
      next.name = t('contentPacksPage.validationNameMaxLength')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim() || null,
        subject: values.subject.trim() || null,
        grade: values.grade.trim() || null,
        curriculum: values.curriculum.trim() || null,
      })
    } catch (err) {
      setSubmitError(extractApiError(err, t))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls = (hasError?: string) =>
    `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{modalTitle}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {mode === 'create'
              ? t('contentPacksPage.modalCreateSubtitle')
              : t('contentPacksPage.modalEditSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4">
            {submitError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentPacksPage.name')}<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={values.name}
                onChange={set('name')}
                disabled={isSubmitting}
                placeholder={t('contentPacksPage.namePlaceholder')}
                className={inputCls(errors.name)}
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentPacksPage.description')}</label>
              <textarea
                value={values.description}
                onChange={set('description')}
                disabled={isSubmitting}
                placeholder={t('contentPacksPage.briefDescriptionForAdminReference')}
                className={`${inputCls()} resize-none`}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <SubjectSelect
                  variant="native"
                  context="default"
                  allowEmpty
                  emptyLabel={t('contentPacksPage.eGBiology', { defaultValue: 'Select subject' })}
                  value={values.subject}
                  onChange={(v) => setValues((prev) => ({ ...prev, subject: v }))}
                  label={t('contentPacksPage.subject')}
                  disabled={isSubmitting}
                  selectClassName={inputCls()}
                />
              </div>
              <div>
                <GradeBandSelect
                  variant="native"
                  value={gradeBandValueForSelect(values.grade)}
                  onChange={(v) => setValues((prev) => ({ ...prev, grade: v }))}
                  label={t('contentPacksPage.gradeBand')}
                  disabled={isSubmitting}
                  allowEmpty
                  emptyLabel={t('contentPacksPage.eGGrade10', { defaultValue: 'Select grade band' })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentPacksPage.curriculumBoard')}</label>
              <input
                type="text"
                value={values.curriculum}
                onChange={set('curriculum')}
                disabled={isSubmitting}
                placeholder={t('contentPacksPage.eGCambridgeIbCcss')}
                className={inputCls()}
              />
              <p className="mt-1 text-xs text-gray-500">{t('contentPacksPage.usedToFilterQuizSourceSelectionByCurriculum')}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >{t('contentPacksPage.cancel')}</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[96px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('contentPacksPage.saving')}</span>
                </>
              ) : (
                modalButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Post-create success modal
// ---------------------------------------------------------------------------

interface SuccessModalProps {
  pack: ContentPack
  onUploadDocuments: () => void
  onClose: () => void
}

const SuccessModal = ({ pack, onUploadDocuments, onClose }: SuccessModalProps) => {
  const { t } = useTranslation()
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('contentPacksPage.packCreated')}</h2>
          <p className="text-sm text-gray-500">{t('contentPacksPage.uploadDocumentsToMakeItAvailableForQuizGeneration')}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 mb-6">
        <p className="font-medium text-gray-900 text-sm">{pack.name}</p>
        {(pack.subject || pack.grade || pack.curriculum) && (
          <p className="text-xs text-gray-500 mt-0.5">
            {[pack.subject, pack.grade, pack.curriculum].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >{t('contentPacksPage.done')}</button>
        <button
          type="button"
          onClick={onUploadDocuments}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />{t('contentPacksPage.uploadDocuments')}</button>
      </div>
    </div>
  </div>
  )
}

// ---------------------------------------------------------------------------
// Delete confirmation modal
// ---------------------------------------------------------------------------

interface DeleteModalProps {
  packName: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteModal = ({ packName, isDeleting, onConfirm, onCancel }: DeleteModalProps) => {
  const { t } = useTranslation()
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{t('contentPacksPage.deleteContentPack')}</h3>
          <p className="text-xs text-gray-500">{t('contentPacksPage.thisActionCannotBeUndone')}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2">{t('contentPacksPage.delete')}<strong className="font-medium">"{packName}"</strong>?
      </p>
      <p className="text-xs text-gray-500 mb-6">{t('contentPacksPage.thePackWillBeDeactivatedAndRemovedFromTeacherQuiz')}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >{t('contentPacksPage.cancel')}</button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[96px] justify-center"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('contentPacksPage.deleting')}</span>
            </>
          ) : (
            t('contentPacksPage.delete')
          )}
        </button>
      </div>
    </div>
  </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type ModalState =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; pack: ContentPack }
  | { kind: 'delete'; packId: string; packName: string }
  | { kind: 'success'; pack: ContentPack }

export const ContentPacksManagement = () => {
  const { t } = useTranslation()
  const [packs, setPacks] = useState<ContentPack[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState<ModalState>({ kind: 'none' })
  const [isDeleting, setIsDeleting] = useState(false)

  const { toast } = useSnackbar()
  const navigate = useNavigate()
  const toastRef = useRef(toast)
  useEffect(() => { toastRef.current = toast }, [toast])

  // ---- data loading --------------------------------------------------------

  const loadPacks = useCallback(async () => {
    setLoading(true)
    setListError(null)
    try {
      const data = await fetchContentPacks({ is_active: true })
      setPacks(data ?? [])
    } catch (err) {
      const msg = extractApiError(err, t)
      setListError(msg)
      toastRef.current.error(msg)
      setPacks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPacks() }, [loadPacks])

  // ---- CRUD handlers -------------------------------------------------------

  const handleCreateSubmit = async (data: ContentPackCreate) => {
    const newPack = await createContentPack(data)
    toast.success(t('contentPacksPage.contentPackCreated'))
    setModal({ kind: 'success', pack: newPack })
    await loadPacks()
  }

  const handleEditSubmit = async (data: ContentPackCreate) => {
    if (modal.kind !== 'edit') return
    await updateContentPack(modal.pack.id, data)
    toast.success(t('contentPacksPage.contentPackUpdated'))
    setModal({ kind: 'none' })
    await loadPacks()
  }

  const handleDeleteConfirm = async () => {
    if (modal.kind !== 'delete' || isDeleting) return
    setIsDeleting(true)
    try {
      await deleteContentPack(modal.packId)
      toast.success(t('contentPacksPage.contentPackDeleted'))
      setModal({ kind: 'none' })
      await loadPacks()
    } catch (err) {
      toast.error(extractApiError(err, t))
    } finally {
      setIsDeleting(false)
    }
  }

  const closeModal = () => setModal({ kind: 'none' })

  // Card callbacks — note: ContentPackCard.onDelete passes packId: string
  const handleDeleteClick = useCallback(
    (packId: string) => {
      const pack = packs.find((p) => p.id === packId)
      if (pack) setModal({ kind: 'delete', packId: pack.id, packName: pack.name })
    },
    [packs],
  )

  const handleEditClick = useCallback((pack: ContentPack) => {
    setModal({ kind: 'edit', pack })
  }, [])

  // ---- filtered list -------------------------------------------------------

  const filteredPacks = packs.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.curriculum?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // ---- render --------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('contentPacksPage.contentPacks')}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{t('contentPacksPage.manageCurriculumPacksThesePowerQuizSourceSelectionForTe')}</p>
          </div>
          <button
            onClick={() => setModal({ kind: 'create' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />{t('contentPacksPage.createPack')}</button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('contentPacksPage.searchByNameSubjectOrCurriculum')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        {listError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800">{t('contentPacksPage.failedToLoadContentPacks')}</p>
              <p className="text-sm text-red-600 mt-1">{listError}</p>
              <button
                onClick={() => { setListError(null); loadPacks() }}
                className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />{t('contentPacksPage.retry')}</button>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <PackCardSkeleton key={i} />)}
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <PackageOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">
              {searchQuery ? t('contentPacksPage.emptyNoSearchResults') : t('contentPacksPage.emptyNoPacks')}
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? t('contentPacksPage.emptySearchHint')
                : t('contentPacksPage.emptyCreateHint')}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setModal({ kind: 'create' })}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />{t('contentPacksPage.createYourFirstPack')}</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPacks.map((pack) => (
              <ContentPackCard
                key={pack.id}
                pack={pack}
                onClick={() => navigate(`/admin/content-packs/${pack.id}`)}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal.kind === 'create' && (
        <PackFormModal
          mode="create"
          onClose={closeModal}
          onSubmit={handleCreateSubmit}
        />
      )}

      {modal.kind === 'edit' && (
        <PackFormModal
          mode="edit"
          initialValues={{
            name: modal.pack.name,
            description: modal.pack.description ?? '',
            subject: subjectValueForSelect(modal.pack.subject ?? ''),
            grade: modal.pack.grade ?? '',
            curriculum: modal.pack.curriculum ?? '',
          }}
          onClose={closeModal}
          onSubmit={handleEditSubmit}
        />
      )}

      {modal.kind === 'success' && (
        <SuccessModal
          pack={modal.pack}
          onUploadDocuments={() => {
            navigate(`/admin/documents/upload?pack_id=${modal.pack.id}`)
            closeModal()
          }}
          onClose={closeModal}
        />
      )}

      {modal.kind === 'delete' && (
        <DeleteModal
          packName={modal.packName}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={closeModal}
        />
      )}
    </div>
  )
}

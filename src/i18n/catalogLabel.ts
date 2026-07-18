import type { TFunction } from 'i18next'

export function normalizeCatalogId(id: string): string {
  return id
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Resolve a catalog item label from locale JSON by slug/id.
 * Falls back to the provided English/default string when no translation exists.
 */
export function catalogLabel(
  t: TFunction,
  namespace: string,
  id: string | undefined | null,
  field: 'title' | 'description' | 'name' | 'summary' | 'subtitle',
  fallback: string,
): string {
  if (!id || !fallback) return fallback ?? ''
  const slug = normalizeCatalogId(id)
  if (!slug) return fallback

  const key = `${namespace}.catalog.${slug}.${field}`
  const value = t(key)
  if (typeof value !== 'string' || !value.trim() || value === key) return fallback
  return value
}

/** Localize content-registry / template category slugs (e.g. social_studies). */
export function catalogCategory(
  t: TFunction,
  namespace: string,
  category: string | undefined | null,
): string {
  if (!category) return ''
  const slug = normalizeCatalogId(category)
  if (!slug) return category
  const key = `${namespace}.categories.${slug}`
  const value = t(key)
  if (typeof value !== 'string' || !value.trim() || value === key) {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }
  return value
}

export function catalogDifficulty(
  t: TFunction,
  namespace: string,
  difficulty: string | undefined,
): string {
  if (!difficulty) return ''
  const norm = difficulty.toLowerCase()
  const key = `${namespace}.difficulty.${norm}`
  const value = t(key)
  return value !== key ? value : difficulty
}

/** Localize a template form field label or placeholder by template slug + field name. */
export function catalogTemplateField(
  t: TFunction,
  slug: string | undefined | null,
  fieldName: string,
  part: 'label' | 'placeholder',
  fallback: string,
): string {
  if (!slug || !fieldName || !fallback) return fallback ?? ''
  const key = `templatesLibrary.catalog.${normalizeCatalogId(slug)}.fields.${fieldName}.${part}`
  const value = t(key, { defaultValue: fallback })
  if (typeof value !== 'string' || !value.trim() || value === key) return fallback
  return value
}

/** Localize a select option display label; option value sent to API stays unchanged. */
export function catalogTemplateFieldOption(
  t: TFunction,
  slug: string | undefined | null,
  fieldName: string,
  optionValue: string,
): string {
  if (!slug || !fieldName || !optionValue) return optionValue
  const optKey = normalizeCatalogId(optionValue)
  const key = `templatesLibrary.catalog.${normalizeCatalogId(slug)}.fields.${fieldName}.options.${optKey}`
  const value = t(key, { defaultValue: optionValue })
  if (typeof value !== 'string' || !value.trim() || value === key) return optionValue
  return value
}

export type TemplateFormField = {
  name: string
  type: string
  label?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  min?: number
  max?: number
  default?: string
}

/** Apply locale overlays to parsed template schema fields (labels/placeholders only). */
export function localizeTemplateFields(
  t: TFunction,
  slug: string | undefined | null,
  fields: TemplateFormField[],
): TemplateFormField[] {
  if (!slug) return fields
  return fields.map((field) => ({
    ...field,
    label: field.label
      ? catalogTemplateField(t, slug, field.name, 'label', field.label)
      : field.label,
    placeholder: field.placeholder
      ? catalogTemplateField(t, slug, field.name, 'placeholder', field.placeholder)
      : field.placeholder,
  }))
}

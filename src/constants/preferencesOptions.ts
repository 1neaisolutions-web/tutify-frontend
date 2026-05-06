export type LanguageOption = { value: string; label: string }
export type TimezoneOption = { value: string; label: string; region: string }

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
]

function buildTimezoneList(): TimezoneOption[] {
  const now = Date.now()
  let zones: string[] = []
  try {
    zones = (Intl as any).supportedValuesOf?.('timeZone') ?? []
  } catch {
    zones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Phoenix',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Shanghai',
      'Asia/Tokyo',
      'Australia/Sydney',
      'UTC',
    ]
  }

  return zones.map((tz) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset',
      })
      const parts = formatter.formatToParts(new Date(now))
      const offset = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
      const region = tz.split('/')[0] ?? 'Other'
      return { value: tz, label: `${tz.replace(/_/g, ' ')} (${offset})`, region }
    } catch {
      return { value: tz, label: tz, region: 'Other' }
    }
  })
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = buildTimezoneList()


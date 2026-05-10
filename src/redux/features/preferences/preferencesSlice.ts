import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { apiRequest } from '../../../api/client'
import { LOCKED_LANGUAGE, LOCKED_THEME, PREFERENCES_LOCKED } from '../../../config/preferencesLock'

export type Theme = 'light' | 'dark' | 'system'
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export interface PreferencesState {
  theme: Theme
  language: string
  timezone: string
  syncStatus: SyncStatus
  lastSyncedAt: string | null
}

const detectTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

const initialState: PreferencesState = {
  theme: PREFERENCES_LOCKED ? LOCKED_THEME : 'system',
  language: PREFERENCES_LOCKED ? LOCKED_LANGUAGE : 'en-US',
  timezone: detectTimezone(),
  syncStatus: 'idle',
  lastSyncedAt: null,
}

type PreferencesPatch = Partial<Pick<PreferencesState, 'theme' | 'language' | 'timezone'>>

export const syncPreferences = createAsyncThunk('preferences/sync', async (patch: PreferencesPatch) => {
  return await apiRequest<{ theme: string; language: string; timezone: string }>('/v1/auth/me/preferences', {
    method: 'PATCH',
    body: patch,
  })
})

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      if (PREFERENCES_LOCKED) {
        state.theme = LOCKED_THEME
        return
      }
      state.theme = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      if (PREFERENCES_LOCKED) {
        state.language = LOCKED_LANGUAGE
        return
      }
      state.language = action.payload
    },
    setTimezone(state, action: PayloadAction<string>) {
      state.timezone = action.payload
    },
    loadFromProfile(state, action: PayloadAction<{ theme?: string; language?: string; timezone?: string } | null | undefined>) {
      const p = action.payload
      if (!p) return
      if (!PREFERENCES_LOCKED) {
        if (p.theme && (p.theme === 'light' || p.theme === 'dark' || p.theme === 'system')) state.theme = p.theme
        if (p.language && p.language.length > 0) state.language = p.language
      } else {
        state.theme = LOCKED_THEME
        state.language = LOCKED_LANGUAGE
      }
      if (p.timezone && p.timezone.length > 0) state.timezone = p.timezone
    },
    setSyncStatus(state, action: PayloadAction<SyncStatus>) {
      state.syncStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncPreferences.pending, (state) => {
        state.syncStatus = 'syncing'
      })
      .addCase(syncPreferences.fulfilled, (state) => {
        state.syncStatus = 'synced'
        state.lastSyncedAt = new Date().toISOString()
      })
      .addCase(syncPreferences.rejected, (state) => {
        state.syncStatus = 'error'
      })
  },
})

export const { setTheme, setLanguage, setTimezone, loadFromProfile, setSyncStatus } = preferencesSlice.actions
export default preferencesSlice.reducer


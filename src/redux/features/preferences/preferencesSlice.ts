import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { apiRequest } from '../../../api/client'

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
  theme: 'system',
  language: 'en-US',
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
      state.theme = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    setTimezone(state, action: PayloadAction<string>) {
      state.timezone = action.payload
    },
    loadFromProfile(state, action: PayloadAction<{ theme?: string; language?: string; timezone?: string } | null | undefined>) {
      const p = action.payload
      if (!p) return
      if (p.theme && (p.theme === 'light' || p.theme === 'dark' || p.theme === 'system')) state.theme = p.theme
      if (p.language && p.language.length > 0) state.language = p.language
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


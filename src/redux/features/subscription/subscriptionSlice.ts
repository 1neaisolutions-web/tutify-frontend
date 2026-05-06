import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getCreditBalance, CreditBalance } from '../../../api/subscriptions'

interface SubscriptionState {
  balance: number
  totalAllocated: number
  totalSpent: number
  expiresAt: string | null
  autoRenew: boolean
  subscriptionStartedAt: string | null
  hasActiveCredits: boolean
  loading: boolean
  lastFetched: number | null
  error: string | null
}

const initialState: SubscriptionState = {
  balance: 0,
  totalAllocated: 0,
  totalSpent: 0,
  expiresAt: null,
  autoRenew: false,
  subscriptionStartedAt: null,
  hasActiveCredits: false,
  loading: false,
  lastFetched: null,
  error: null,
}

export const fetchCreditBalance = createAsyncThunk(
  'subscription/fetchBalance',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { subscription: SubscriptionState }
      const now = Date.now()
      // Skip fetch if data is fresh (< 90s — balance changes often after AI actions)
      if (state.subscription.lastFetched && now - state.subscription.lastFetched < 90 * 1000) {
        return null
      }
      return await getCreditBalance()
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch balance')
    }
  }
)

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    deductCredits(state, action: PayloadAction<number>) {
      state.balance = Math.max(0, state.balance - action.payload)
      state.totalSpent += action.payload
    },
    setBalance(state, action: PayloadAction<CreditBalance>) {
      state.balance = action.payload.balance
      state.totalAllocated = action.payload.total_allocated
      state.totalSpent = action.payload.total_spent
      state.expiresAt = action.payload.expires_at
      state.autoRenew = action.payload.auto_renew
      state.subscriptionStartedAt = action.payload.subscription_started_at
      state.hasActiveCredits = action.payload.has_active_credits
      state.lastFetched = Date.now()
    },
    clearBalance(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCreditBalance.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.balance = action.payload.balance
          state.totalAllocated = action.payload.total_allocated
          state.totalSpent = action.payload.total_spent
          state.expiresAt = action.payload.expires_at
          state.autoRenew = action.payload.auto_renew
          state.subscriptionStartedAt = action.payload.subscription_started_at
          state.hasActiveCredits = action.payload.has_active_credits
          state.lastFetched = Date.now()
        }
      })
      .addCase(fetchCreditBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { deductCredits, setBalance, clearBalance } = subscriptionSlice.actions
export default subscriptionSlice.reducer

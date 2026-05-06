# API Configuration Summary

## ✅ Railway Backend URL is Now Global

All API calls in the frontend now use the Railway backend URL: `https://1nebackend-production.up.railway.app`

## Configuration Files

### 1. `.env` File (Created)
```env
# Backend API Configuration
# Railway Production Backend URL
VITE_API_BASE_URL=https://1nebackend-production.up.railway.app
VITE_API_URL=https://1nebackend-production.up.railway.app/api
```

### 2. Centralized Config (`src/config/api.ts`)
- Reads from `.env` file
- Exports: `API_BASE_URL`, `API_URL`, `HEALTH_URL`
- Defaults to Railway URL if env vars not set

### 3. API Flow

#### Authentication APIs (Login, Signup, etc.)
- **File**: `src/redux/features/auth/authSlice.js`
- **File**: `src/redux/features/auth/signupSlice.js`
- **Uses**: `axios` from `src/redux/http.js`
- **http.js** uses: `baseURL` from `src/redux/constant.js`
- **constant.js** uses: `API_BASE_URL` from `src/config/api.ts`
- ✅ **Result**: All auth APIs use Railway URL

#### Other APIs (Chatbots, Templates, Subscriptions, etc.)
- **Files**: `src/api/client.ts`, `src/api/chatbots.ts`, `src/api/templates.ts`, etc.
- **Uses**: `apiRequest` from `src/api/client.ts`
- **client.ts** uses: `API_URL` from `src/config/api.ts`
- ✅ **Result**: All other APIs use Railway URL

## All APIs Now Use Railway URL

✅ **Login** - `/api/v1/auth/login`
✅ **Signup** - `/api/v1/auth/signup`
✅ **Chatbots** - `/api/v1/chatbots/*`
✅ **Templates** - `/api/v1/templates/*`
✅ **Subscriptions** - `/api/v1/subscriptions/*`
✅ **Memberships** - `/api/v1/auth/memberships`
✅ **All other endpoints**

## Next Steps

1. **Restart your dev server** to pick up the new `.env` file:
   ```bash
   npm run dev
   ```

2. **Test the login** - it should now connect to Railway backend

3. **Verify in browser console** - check network tab to confirm requests go to Railway URL

## To Use Local Backend (Optional)

If you need to use localhost for development, add to `.env`:
```env
VITE_USE_LOCAL=true
```

Or set:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

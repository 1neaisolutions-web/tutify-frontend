# Quick Start: Use Localhost Backend

## ✅ Configuration Applied

The frontend is now configured to use `http://127.0.0.1:8000` instead of Railway.

## ⚠️ IMPORTANT: Restart Frontend

**You MUST restart the frontend dev server for changes to take effect:**

1. **Stop current dev server** (press Ctrl+C in the terminal running `yarn dev`)

2. **Restart frontend:**
   ```powershell
   cd 1ne-frontend
   yarn dev
   ```

3. **Verify in browser:**
   - Open DevTools (F12)
   - Go to Network tab
   - Check API calls - should go to `http://127.0.0.1:8000/api/v1/...`
   - NOT to Railway URL

## Start Backend (if not running)

```powershell
cd 1ne_backend
.\start_server.ps1
```

## Test

1. **Backend health:**
   ```bash
   curl http://127.0.0.1:8000/health
   ```

2. **Test endpoint:**
   ```bash
   curl http://127.0.0.1:8000/api/v1/admin/content-packs/test
   ```

3. **In browser:**
   - Go to `/admin/content-packs`
   - Should work now!

## Troubleshooting

### Still calling Railway?
- ✅ Restart frontend dev server (required!)
- ✅ Clear browser cache
- ✅ Check `.env` file has `VITE_USE_LOCAL=true`

### 404 errors?
- ✅ Check backend is running
- ✅ Test endpoint directly with curl
- ✅ Check backend logs

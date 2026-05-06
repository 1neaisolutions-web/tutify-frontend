# Frontend Local Setup - Quick Guide

## ✅ Configuration Complete!

The `.env` file has been configured to use localhost backend.

## What Was Changed

The `.env` file now contains:
```
VITE_USE_LOCAL=true
```

This tells the frontend to use `http://127.0.0.1:8000` instead of Railway.

## Next Steps

### 1. Restart Frontend Dev Server

**IMPORTANT:** After changing `.env`, you MUST restart the frontend:

```powershell
# Stop the current dev server (Ctrl+C)
# Then restart:
cd 1ne-frontend
yarn dev
```

### 2. Verify Configuration

After restarting, check the browser console:
- Open DevTools (F12)
- Go to Console tab
- Look for API requests - they should go to `http://127.0.0.1:8000/api/v1/...`
- NOT to `https://1nebackend-production.up.railway.app/...`

### 3. Start Backend (if not running)

```powershell
cd 1ne_backend
.\start_server.ps1
```

Backend should be running on `http://127.0.0.1:8000`

### 4. Test Endpoints

1. **Health Check:**
   ```bash
   curl http://127.0.0.1:8000/health
   ```

2. **Test Endpoint:**
   ```bash
   curl http://127.0.0.1:8000/api/v1/admin/content-packs/test
   ```

3. **In Browser:**
   - Go to `/admin/content-packs`
   - Should load from localhost backend
   - Check Network tab to verify API calls

## Troubleshooting

### Frontend Still Calls Railway

**Solution:**
1. ✅ Check `.env` file has `VITE_USE_LOCAL=true`
2. ✅ **Restart frontend dev server** (this is critical!)
3. ✅ Clear browser cache
4. ✅ Check browser console for actual API URL

### Backend Not Running

**Solution:**
1. Start backend: `cd 1ne_backend && .\start_server.ps1`
2. Verify: `curl http://127.0.0.1:8000/health`
3. Should return: `{"status": "ok", "database": "connected"}`

### 404 Errors

**If you still get 404:**
1. Check backend is running
2. Verify routes: `python verify_routes.py` (in backend directory)
3. Test endpoint: `curl http://127.0.0.1:8000/api/v1/admin/content-packs/test`
4. Check backend logs for errors

## Configuration Options

You can use any of these in `.env`:

**Option 1 (Recommended):**
```
VITE_USE_LOCAL=true
```

**Option 2:**
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**Option 3:**
```
VITE_API_URL=http://127.0.0.1:8000/api
```

All three options will make the frontend use localhost.

## Switch Back to Railway

To use Railway again, remove or comment out the local config:
```
# VITE_USE_LOCAL=true
```

Then restart the frontend dev server.

# Frontend Setup for Local Testing

## Quick Setup

### 1. Configure Frontend to Use Localhost

Create or update `1ne-frontend/.env` file:
```
VITE_USE_LOCAL=true
```

Or set the API URL directly:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 2. Restart Frontend Dev Server

After changing `.env`, restart the frontend:
```powershell
cd 1ne-frontend
yarn dev
```

### 3. Verify Configuration

Open browser console and check:
- API calls should go to `http://127.0.0.1:8000/api/v1/...`
- Not to Railway URL

## Testing Content Ingestion Endpoints

### Expected Behavior

1. **Content Packs Page** (`/admin/content-packs`):
   - Should load packs from backend
   - If 404 error: Backend routes not registered
   - If 401/403: Need to login with admin account

2. **Documents Page** (`/admin/documents`):
   - Should list documents
   - Upload button should work

3. **Document Upload** (`/admin/documents/upload`):
   - Should show upload form
   - Should stream progress updates

### Error Messages

The frontend now shows helpful error messages:

- **404 Not Found**: 
  - "Endpoint not found" with troubleshooting tips
  - Check if backend is running
  - Check if routes are registered

- **401 Unauthorized**:
  - "Authentication failed"
  - Token may be expired
  - Need to login again

- **403 Forbidden**:
  - "Access denied"
  - User doesn't have required role
  - Need admin role (org_admin, institution_admin, or super_admin)

## Debugging

### Check API Configuration

Open browser console and type:
```javascript
// Check current API URL
import { API_URL, API_BASE_URL } from './src/config/api'
console.log('API_URL:', API_URL)
console.log('API_BASE_URL:', API_BASE_URL)
```

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request URLs:
   - Should be `http://127.0.0.1:8000/api/v1/...` (local)
   - NOT `https://1nebackend-production.up.railway.app/...` (Railway)

### Check Backend Health

Test if backend is running:
```bash
curl http://127.0.0.1:8000/health
```

Expected: `{"status": "ok", "database": "connected"}`

### Check Routes

Test if routes are registered:
```bash
curl http://127.0.0.1:8000/api/v1/admin/content-packs/test
```

Expected: `{"message": "Content packs route is working", ...}`

## Common Issues

### Frontend Still Calls Railway

**Solution:**
1. Check `.env` file exists in `1ne-frontend/` directory
2. Verify `VITE_USE_LOCAL=true` is set
3. Restart frontend dev server completely
4. Clear browser cache
5. Check browser console for actual API URL being used

### 404 Errors

**Possible Causes:**
1. Backend not running
2. Routes not registered
3. Wrong API URL

**Solution:**
1. Start backend: `cd 1ne_backend && .\start_server.ps1`
2. Verify routes: `python verify_routes.py`
3. Check API URL in browser console
4. Test endpoint directly: `curl http://127.0.0.1:8000/api/v1/admin/content-packs/test`

### 401/403 Errors

**This is normal!** Endpoints exist but require authentication.

**Solution:**
1. Login with admin account
2. Check user has required role (org_admin, institution_admin, or super_admin)
3. Token should be automatically included in requests

## Next Steps

1. ✅ Configure frontend for localhost
2. ✅ Start backend server
3. ✅ Test endpoints in browser
4. ✅ Check error messages for helpful tips
5. ✅ Verify all content ingestion features work

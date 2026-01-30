# Frontend-Backend Connection Setup

## ✅ Changes Completed

### 1. **Backend CORS Configuration** (`server/src/server.js`)
   - Updated CORS middleware to accept requests from **any origin**
   - Changed from restrictive origin checking to `origin: '*'`
   - Added explicit HTTP methods and headers support
   - Set `credentials: false` (required when using wildcard origin)

### 2. **Frontend API Configuration**
   
   #### Created Files:
   - **`client/.env`** - Environment variables for API URL
   - **`client/src/config/api.js`** - Centralized API configuration
   - **`client/.env.example`** - Example environment file for reference
   
   #### Updated Files:
   - ✅ `client/src/pages/Login.jsx`
   - ✅ `client/src/pages/Signup.jsx`
   - ✅ `client/src/pages/Dashboard.jsx`
   - ✅ `client/src/pages/AlgorithmList.jsx`
   - ✅ `client/src/pages/AlgorithmDetail.jsx`
   - ✅ `client/.gitignore` (added .env)

## 🔧 Configuration Details

### Environment Variable (`.env`)
```env
VITE_API_URL=https://algoflow-xbfi.onrender.com/api
```

### API Config (`src/config/api.js`)
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

This setup:
- Uses Render backend URL in production
- Falls back to localhost if environment variable is not set
- Provides centralized API endpoint management

## 🚀 How It Works

1. **Frontend** reads `VITE_API_URL` from `.env` file
2. **All API calls** now use the centralized `API_URL` constant
3. **Backend** accepts requests from any origin (CORS enabled)
4. **Render deployment** URL: `https://algoflow-xbfi.onrender.com/api`

## 📝 Important Notes

### For Local Development:
To switch back to local backend, update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### For Production:
Current setup already points to Render:
```env
VITE_API_URL=https://algoflow-xbfi.onrender.com/api
```

### Security Recommendation:
For production, consider restricting CORS to specific origins in `server.js`:
```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🔄 Restart Required

Since your dev server is already running, **restart it** to load the new `.env` file:

1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again

The changes will take effect immediately!

## ✅ Testing

Test the connection by:
1. Opening your frontend in the browser
2. Trying to login/signup
3. Check browser console for any CORS errors (should be none)
4. Verify API calls are going to `https://algoflow-xbfi.onrender.com/api`

## 📦 Files Modified Summary

**Backend (1 file):**
- `server/src/server.js` - CORS configuration

**Frontend (8 files):**
- `client/.env` - Environment variables (NEW)
- `client/.env.example` - Example env file (NEW)
- `client/src/config/api.js` - API config (NEW)
- `client/.gitignore` - Added .env
- `client/src/pages/Login.jsx` - Updated API URL
- `client/src/pages/Signup.jsx` - Updated API URL
- `client/src/pages/Dashboard.jsx` - Updated API URL
- `client/src/pages/AlgorithmList.jsx` - Updated API URL
- `client/src/pages/AlgorithmDetail.jsx` - Updated API URL

---

**Status:** ✅ Ready to use!

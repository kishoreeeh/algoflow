# 🚀 AlgoFlow - Quick Reference

## 🔗 URLs
- **Frontend (Local):** http://localhost:5174
- **Backend (Render):** https://algoflow-xbfi.onrender.com
- **API Base:** https://algoflow-xbfi.onrender.com/api

## 🔐 Authentication Flow

### Register
```javascript
const { register } = useAuth();
await register(name, email, password);
```

### Login
```javascript
const { login } = useAuth();
await login(email, password);
```

### Logout
```javascript
const { logout } = useAuth();
logout();
```

### Check Auth Status
```javascript
const { isAuthenticated, user } = useAuth();
if (isAuthenticated()) {
  console.log('Logged in as:', user.name);
}
```

## 🛡️ Protected API Calls

```javascript
import { API_URL, getAuthHeaders } from '../config/api';
import axios from 'axios';

// GET request
const response = await axios.get(`${API_URL}/progress`, {
  headers: getAuthHeaders()
});

// POST request
const response = await axios.post(`${API_URL}/progress/update`, 
  { algorithmId, status, currentStep, totalSteps },
  { headers: getAuthHeaders() }
);
```

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/progress` | Yes | Get user progress |
| POST | `/api/progress/update` | Yes | Update progress |
| DELETE | `/api/progress/:id` | Yes | Delete progress |

## 🎯 Protected Routes

```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🔧 Common Tasks

### Add New Protected Route
1. Wrap route with `<ProtectedRoute>`
2. Use `useAuth()` to access user data
3. Use `getAuthHeaders()` for API calls

### Access User Info
```javascript
const { user } = useAuth();
console.log(user.name);
console.log(user.email);
```

### Handle Logout
```javascript
const { logout } = useAuth();
const handleLogout = () => {
  logout(); // Clears token & redirects to /login
};
```

## 🐛 Debug Checklist

- [ ] Backend running on Render?
- [ ] Frontend running on localhost:5174?
- [ ] VITE_API_URL set in .env?
- [ ] Token in localStorage?
- [ ] AuthProvider wrapping App?
- [ ] CORS enabled on backend?

## 📦 Key Files

```
client/
├── src/
│   ├── context/AuthContext.jsx       # Auth state
│   ├── components/ProtectedRoute.jsx # Route guard
│   ├── config/api.js                 # API config
│   └── App.jsx                       # Routes

server/
└── src/server.js                     # All backend logic
```

## ✅ Test Credentials

Use any email/password for testing:
- Email: `test@example.com`
- Password: `password123`

(Users are stored in-memory, reset on server restart)

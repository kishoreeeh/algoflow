# 📡 DSA PLATFORM API DOCUMENTATION

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.dsa-platform.com/api
```

---

## 🔐 AUTHENTICATION

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 ENDPOINTS

### **1. Health Check**

**GET** `/health`

Check if server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-27T09:30:00.000Z"
}
```

---

### **2. Register User**

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "student@example.com",
      "name": "John Doe",
      "role": "student",
      "preferences": {
        "theme": "light",
        "animationSpeed": 1,
        "autoPlay": false
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400` - Email already exists
- `400` - Missing required fields
- `400` - Validation errors

---

### **3. Login User**

**POST** `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "student@example.com",
      "name": "John Doe",
      "role": "student",
      "preferences": {
        "theme": "light",
        "animationSpeed": 1,
        "autoPlay": false
      },
      "lastLogin": "2026-01-27T09:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `401` - Account deactivated
- `400` - Missing email or password

---

### **4. Get Current User**

**GET** `/api/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "student@example.com",
      "name": "John Doe",
      "role": "student",
      "preferences": {
        "theme": "light",
        "animationSpeed": 1,
        "autoPlay": false
      },
      "lastLogin": "2026-01-27T09:30:00.000Z",
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  }
}
```

**Errors:**
- `401` - Not authorized / Invalid token

---

### **5. Update Preferences**

**PUT** `/api/auth/preferences`

Update user preferences.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "theme": "dark",
  "animationSpeed": 1.5,
  "autoPlay": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "preferences": {
      "theme": "dark",
      "animationSpeed": 1.5,
      "autoPlay": true
    }
  }
}
```

**Errors:**
- `401` - Not authorized
- `400` - Invalid preference values

---

### **6. Logout**

**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🔒 AUTHENTICATION FLOW

### Registration Flow
```
1. POST /api/auth/register
   ↓
2. Server validates input
   ↓
3. Server checks if email exists
   ↓
4. Server hashes password
   ↓
5. Server creates user
   ↓
6. Server generates JWT token
   ↓
7. Client receives user + token
   ↓
8. Client stores token in localStorage
   ↓
9. Client redirects to dashboard
```

### Login Flow
```
1. POST /api/auth/login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client receives user + token
   ↓
5. Client stores token
   ↓
6. Client redirects to dashboard
```

### Protected Request Flow
```
1. Client sends request with Authorization header
   ↓
2. Server extracts JWT token
   ↓
3. Server verifies token
   ↓
4. Server attaches user to request
   ↓
5. Server processes request
   ↓
6. Server sends response
```

---

## ⚠️ ERROR RESPONSES

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 🔐 JWT TOKEN STRUCTURE

```javascript
{
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "student@example.com",
    "role": "student"
  },
  "expiresIn": "7d"
}
```

---

## 🚦 RATE LIMITING

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response on Limit**: 429 Too Many Requests

---

## 🧪 TESTING WITH CURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 COMING SOON

### Progress API
- `GET /api/progress` - Get all user progress
- `GET /api/progress/:algorithmId` - Get specific algorithm progress
- `POST /api/progress` - Create/update progress
- `PUT /api/progress/:algorithmId` - Update progress

### Algorithm API
- `GET /api/algorithms` - Get all algorithms
- `GET /api/algorithms/:id` - Get algorithm details
- `GET /api/algorithms/category/:category` - Get by category
- `GET /api/algorithms/search?q=query` - Search algorithms

---

## 🔧 DEVELOPMENT

### Start Server
```bash
cd server
npm run dev
```

### Environment Variables
Create `.env` file:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dsa-platform
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Environment Setup
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Use strong JWT_SECRET
4. Enable HTTPS
5. Configure CORS properly
6. Set up monitoring

---

**API Version: 1.0.0**  
**Last Updated: January 27, 2026**

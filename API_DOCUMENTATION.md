# 🚀 FRACTIAI SYNTHEVERSE CENTRAL API

**AI-Assisted API for Entire Ecosystem**

**Version**: 1.0.0  
**Base URL**: `http://localhost:3001` (development) | `https://api.fractiai.com` (production)  
**Date**: January 22, 2026

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [AI Features](#ai-features)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Code Examples](#code-examples)
8. [Deployment](#deployment)

---

## 🎯 **OVERVIEW**

The FractiAI Syntheverse Central API is a unified backend service that:

✅ **Serves entire ecosystem** - Web apps, mobile apps, third-party integrations  
✅ **AI-assisted operations** - Content analysis, scoring, recommendations  
✅ **Central database access** - Single Supabase database for all apps  
✅ **Real-time capabilities** - Chat, notifications, live updates  
✅ **Secure authentication** - JWT-based auth via Supabase  
✅ **Rate limited** - Protection against abuse  
✅ **Production-ready** - Error handling, logging, monitoring  

---

## 🔐 **AUTHENTICATION**

### **How It Works**

1. User signs in via Google OAuth (frontend)
2. Frontend receives JWT token from Supabase
3. Include token in `Authorization` header for API requests

### **Header Format**

```http
Authorization: Bearer <your-jwt-token>
```

### **Example**

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

fetch('http://localhost:3001/api/contributions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **Endpoints That Require Auth**

- ✅ Most endpoints (marked with 🔒)
- ❌ Public endpoints: `/health`, `/api/contributions` (read-only)

---

## 📡 **API ENDPOINTS**

### **System**

#### `GET /health`
Health check endpoint

**Response**:
```json
{
  "status": "healthy",
  "service": "FractiAI Syntheverse API",
  "timestamp": "2026-01-22T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

### **Authentication** (`/api/auth`)

#### 🔒 `GET /api/auth/me`
Get current user profile

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://...",
    "role": "user",
    "tier": "cloud",
    "synth_balance": 1000,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

#### 🔒 `PUT /api/auth/me`
Update current user profile

**Body**:
```json
{
  "name": "New Name",
  "avatar_url": "https://..."
}
```

#### `POST /api/auth/verify`
Verify JWT token

**Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response**:
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

---

### **Contributions** (`/api/contributions`)

#### `GET /api/contributions`
List contributions (public qualified or user's own)

**Query Parameters**:
- `status` (optional): Filter by status (`submitted`, `qualified`, `unqualified`)
- `limit` (default: 20): Number of results
- `offset` (default: 0): Pagination offset

**Response**:
```json
{
  "contributions": [
    {
      "id": "uuid",
      "title": "My Contribution",
      "description": "...",
      "content": "...",
      "status": "qualified",
      "final_score": 85.5,
      "created_at": "2026-01-22T10:00:00Z"
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

#### `GET /api/contributions/:id`
Get single contribution

#### 🔒 `POST /api/contributions`
Create new contribution

**Body**:
```json
{
  "title": "My Contribution",
  "description": "Optional description",
  "content": "Main content here...",
  "contentType": "text",
  "category": "research",
  "tags": ["ai", "blockchain"]
}
```

**Response**:
```json
{
  "contribution": { /* ... */ },
  "message": "Contribution submitted successfully"
}
```

#### 🔒 `PUT /api/contributions/:id`
Update contribution (owner only, submitted status only)

#### 🔒 `DELETE /api/contributions/:id`
Delete contribution (owner only)

---

### **AI Features** (`/api/ai`)

#### 🔒 `POST /api/ai/analyze`
AI-powered content analysis

**Body**:
```json
{
  "content": "Your content here...",
  "contentType": "text"
}
```

**Response**:
```json
{
  "analysis": {
    "wordCount": 150,
    "complexity": 7.5,
    "extractedTopics": ["blockchain", "consensus", "protocol"],
    "sentiment": "positive",
    "metadata": {
      "hasCode": true,
      "hasLinks": false,
      "hasMath": true
    }
  },
  "timestamp": "2026-01-22T10:00:00Z"
}
```

#### 🔒 `POST /api/ai/recommend`
AI-powered content recommendations

**Body**:
```json
{
  "category": "research",
  "limit": 10
}
```

**Response**:
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "title": "...",
      "description": "...",
      "final_score": 92.5
    }
  ],
  "based_on": 5,
  "timestamp": "2026-01-22T10:00:00Z"
}
```

#### 🔒 `POST /api/ai/chat`
AI chat assistant (Queen Bee interactions)

**Body**:
```json
{
  "message": "How does NSPFRNP work?",
  "queenId": "03",
  "context": {}
}
```

**Response**:
```json
{
  "response": {
    "text": "COORDINATOR - I respond to triggers...",
    "queenId": "03",
    "personality": "COORDINATOR",
    "timestamp": "2026-01-22T10:00:00Z"
  }
}
```

#### 🔒 `POST /api/ai/score`
Calculate NSPFRNP-based contribution score

**Body**:
```json
{
  "contributionId": "uuid"
}
```

**Response**:
```json
{
  "contribution": { /* updated contribution */ },
  "scores": {
    "novelty": 85.5,
    "density": 72.3,
    "coherence": 90.1,
    "alignment": 88.7,
    "final": 84.2
  },
  "timestamp": "2026-01-22T10:00:00Z"
}
```

---

### **Sandboxes** (`/api/sandboxes`)

#### 🔒 `GET /api/sandboxes`
List user's sandboxes

**Response**:
```json
{
  "owned": [
    {
      "id": "uuid",
      "name": "My Sandbox",
      "description": "...",
      "type": "personal",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "shared": []
}
```

#### 🔒 `POST /api/sandboxes`
Create new sandbox

**Body**:
```json
{
  "name": "My Sandbox",
  "description": "Description",
  "type": "personal",
  "isPublic": false
}
```

#### 🔒 `GET /api/sandboxes/:id`
Get sandbox details (with members)

---

### **Chat** (`/api/chat`)

#### 🔒 `GET /api/chat/rooms`
List user's chat rooms

#### 🔒 `GET /api/chat/rooms/:roomId/messages`
Get messages for a room

**Query Parameters**:
- `limit` (default: 50): Number of messages
- `before` (optional): Timestamp for pagination

#### 🔒 `POST /api/chat/rooms/:roomId/messages`
Send message to room

**Body**:
```json
{
  "content": "Hello, world!",
  "messageType": "text",
  "imageUrl": "https://...",
  "fileUrl": "https://...",
  "fileName": "document.pdf"
}
```

---

### **Analytics** (`/api/analytics`)

#### 🔒 `GET /api/analytics/dashboard`
Get user dashboard analytics

**Response**:
```json
{
  "contributions": {
    "total": 25,
    "qualified": 18,
    "pending": 7
  },
  "synth": {
    "balance": 5000,
    "earned": 12000
  },
  "user": {
    "tier": "cloud",
    "octave": 2
  }
}
```

#### 🔒 `GET /api/analytics/system`
Get system-wide analytics (admin/operator only)

**Response**:
```json
{
  "users": 1250,
  "contributions": {
    "total": 5000,
    "qualified": 3200
  },
  "sandboxes": 450,
  "synth": {
    "totalAllocated": 10000000
  }
}
```

---

## 🤖 **AI FEATURES**

### **Content Analysis**
- Word count & complexity
- Topic extraction
- Sentiment analysis
- Code/link/math detection

### **NSPFRNP Scoring**
- **Novelty**: Originality of content
- **Density**: Information richness
- **Coherence**: Logical flow
- **Alignment**: NSPFRNP principles adherence
- **Final Score**: Weighted average (qualified if ≥70)

### **Recommendations**
- Based on user's contribution history
- Category & tag matching
- Score-weighted ranking

### **Queen Bee Chat**
- Personality-based responses
- Context-aware interactions
- NSPFRNP-aligned guidance

---

## ⚠️ **ERROR HANDLING**

### **Standard Error Response**

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2026-01-22T10:00:00Z"
}
```

### **HTTP Status Codes**

| Code | Meaning | Example |
|------|---------|---------|
| `200` | Success | Request completed |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid input |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

---

## 🚦 **RATE LIMITING**

**Default Limits**:
- **100 requests per 15 minutes** per IP
- Applies to all `/api/*` routes

**Response When Limit Exceeded**:
```json
{
  "error": "Too many requests",
  "message": "Too many requests from this IP, please try again later."
}
```

---

## 💻 **CODE EXAMPLES**

### **JavaScript/TypeScript**

```typescript
// Initialize API client
const API_BASE = 'http://localhost:3001';
const token = 'your-jwt-token';

// Helper function
async function apiCall(endpoint: string, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

// Get user profile
const profile = await apiCall('/api/auth/me');

// Create contribution
const contribution = await apiCall('/api/contributions', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My Contribution',
    content: 'Content here...',
    tags: ['ai', 'blockchain']
  })
});

// AI analysis
const analysis = await apiCall('/api/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({
    content: 'Analyze this content...'
  })
});
```

### **React Hook**

```typescript
import { useState, useEffect } from 'react';

function useAPI(endpoint: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

// Usage
function MyComponent() {
  const { data, loading, error } = useAPI('/api/contributions');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data.contributions.map(c => (
        <div key={c.id}>{c.title}</div>
      ))}
    </div>
  );
}
```

### **Python**

```python
import requests

API_BASE = 'http://localhost:3001'
TOKEN = 'your-jwt-token'

def api_call(endpoint, method='GET', data=None):
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
    
    response = requests.request(
        method, 
        f'{API_BASE}{endpoint}', 
        headers=headers, 
        json=data
    )
    
    response.raise_for_status()
    return response.json()

# Get contributions
contributions = api_call('/api/contributions')

# Create contribution
new_contribution = api_call('/api/contributions', method='POST', data={
    'title': 'My Contribution',
    'content': 'Content here...',
    'tags': ['ai', 'blockchain']
})
```

---

## 🚀 **DEPLOYMENT**

### **Local Development**

```bash
cd api
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Server runs at `http://localhost:3001`

### **Production (Vercel)**

```bash
# Build
npm run build

# Deploy
vercel --prod

# Environment variables (set in Vercel Dashboard):
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - PORT (set to 3001)
```

### **Production (Docker)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

```bash
docker build -t fractiai-api .
docker run -p 3001:3001 --env-file .env fractiai-api
```

---

## 📖 **DOCUMENTATION FILES**

- `API_DOCUMENTATION.md` - This file
- `CENTRAL_DATABASE_ARCHITECTURE.md` - Database schema
- `ECOSYSTEM_SETUP_COMPLETE.md` - Complete setup guide
- `ENV_TEMPLATE_ECOSYSTEM.txt` - Environment variables

---

## ✅ **CHECKLIST**

### **Setup**:
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] Dependencies installed (`npm install`)

### **Development**:
- [ ] Server runs locally (`npm run dev`)
- [ ] Health check works (`/health`)
- [ ] Authentication works (with JWT)
- [ ] Can create/read contributions
- [ ] AI endpoints respond

### **Production**:
- [ ] Build succeeds (`npm run build`)
- [ ] Deployed to Vercel/Docker
- [ ] Environment variables set in production
- [ ] CORS configured for your domains
- [ ] SSL/HTTPS enabled

---

## 🎯 **NEXT STEPS**

1. **Setup**: Follow deployment instructions above
2. **Test**: Use Postman/Insomnia to test endpoints
3. **Integrate**: Connect your web/mobile apps
4. **Enhance**: Add custom AI models for scoring
5. **Scale**: Monitor and optimize as traffic grows

---

**READY TO SERVE YOUR ENTIRE ECOSYSTEM! 🚀**


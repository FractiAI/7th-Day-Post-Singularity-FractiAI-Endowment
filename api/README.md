# 🚀 FractiAI Syntheverse Central API

**AI-Assisted Backend for Entire Ecosystem**

---

## 📋 **WHAT IS THIS?**

This is the **central API service** for the entire FractiAI Syntheverse ecosystem. All your applications (web, mobile, third-party) connect to this ONE API.

**Features**:
- ✅ **Central database access** (Supabase)
- ✅ **JWT authentication** (Google OAuth)
- ✅ **AI-assisted operations** (content analysis, scoring, recommendations)
- ✅ **Real-time chat** (WebSocket-ready)
- ✅ **RESTful endpoints** (contributions, sandboxes, analytics)
- ✅ **Rate limiting** (100 req/15min)
- ✅ **Production-ready** (error handling, logging, security)

---

## 🚀 **QUICK START**

### **1. Install Dependencies**

```bash
cd api
npm install
```

### **2. Set Environment Variables**

```bash
cp ENV_TEMPLATE.txt .env
# Edit .env with your Supabase credentials
```

### **3. Run Development Server**

```bash
npm run dev
```

Server starts at `http://localhost:3001`

### **4. Test**

```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "FractiAI Syntheverse API",
  "timestamp": "2026-01-22T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 📁 **PROJECT STRUCTURE**

```
api/
├── server.ts              # Main Express server
├── middleware/
│   └── auth.ts           # JWT authentication middleware
├── routes/
│   ├── auth.ts           # Authentication endpoints
│   ├── contributions.ts  # Contributions CRUD
│   ├── sandboxes.ts      # Enterprise sandboxes
│   ├── chat.ts           # Real-time chat
│   ├── ai.ts             # AI-assisted endpoints
│   └── analytics.ts      # System analytics
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── ENV_TEMPLATE.txt      # Environment variables template
└── README.md            # This file
```

---

## 📡 **API ENDPOINTS**

### **System**
- `GET /health` - Health check
- `GET /` - API info

### **Authentication** (`/api/auth`)
- `GET /api/auth/me` 🔒 - Get current user
- `PUT /api/auth/me` 🔒 - Update profile
- `POST /api/auth/verify` - Verify JWT token

### **Contributions** (`/api/contributions`)
- `GET /api/contributions` - List contributions
- `GET /api/contributions/:id` - Get contribution
- `POST /api/contributions` 🔒 - Create contribution
- `PUT /api/contributions/:id` 🔒 - Update contribution
- `DELETE /api/contributions/:id` 🔒 - Delete contribution

### **AI Features** (`/api/ai`)
- `POST /api/ai/analyze` 🔒 - Content analysis
- `POST /api/ai/recommend` 🔒 - AI recommendations
- `POST /api/ai/chat` 🔒 - Queen Bee chat
- `POST /api/ai/score` 🔒 - NSPFRNP scoring

### **Sandboxes** (`/api/sandboxes`)
- `GET /api/sandboxes` 🔒 - List sandboxes
- `POST /api/sandboxes` 🔒 - Create sandbox
- `GET /api/sandboxes/:id` 🔒 - Get sandbox details

### **Chat** (`/api/chat`)
- `GET /api/chat/rooms` 🔒 - List chat rooms
- `GET /api/chat/rooms/:roomId/messages` 🔒 - Get messages
- `POST /api/chat/rooms/:roomId/messages` 🔒 - Send message

### **Analytics** (`/api/analytics`)
- `GET /api/analytics/dashboard` 🔒 - User analytics
- `GET /api/analytics/system` 🔒 - System analytics (admin)

🔒 = Requires authentication

**Full Documentation**: See `../API_DOCUMENTATION.md`

---

## 🔐 **AUTHENTICATION**

All requests to protected endpoints must include a JWT token:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/auth/me
```

**How to get a token**:
1. User signs in via Google OAuth (frontend)
2. Frontend receives JWT from Supabase
3. Include token in `Authorization` header

---

## 🤖 **AI FEATURES**

### **Content Analysis**
Analyze text for complexity, topics, sentiment:

```bash
POST /api/ai/analyze
{
  "content": "Your content here...",
  "contentType": "text"
}
```

### **NSPFRNP Scoring**
Calculate natural protocol scores:

```bash
POST /api/ai/score
{
  "contributionId": "uuid"
}
```

Returns: novelty, density, coherence, alignment, final score

### **Recommendations**
Get personalized content recommendations:

```bash
POST /api/ai/recommend
{
  "category": "research",
  "limit": 10
}
```

### **Queen Bee Chat**
Interact with AI Queen personalities:

```bash
POST /api/ai/chat
{
  "message": "How does NSPFRNP work?",
  "queenId": "03"
}
```

---

## 📦 **DEPENDENCIES**

### **Production**:
- `express` - Web framework
- `@supabase/supabase-js` - Database client
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variables

### **Development**:
- `typescript` - Type safety
- `ts-node-dev` - Hot reload
- `@types/*` - Type definitions

---

## 🚀 **DEPLOYMENT**

### **Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd api
vercel --prod

# Set environment variables in Vercel Dashboard
```

### **Docker**

```bash
# Build
docker build -t fractiai-api .

# Run
docker run -p 3001:3001 --env-file .env fractiai-api
```

### **Traditional Server**

```bash
# Build
npm run build

# Start
NODE_ENV=production node dist/server.js
```

---

## 🧪 **TESTING**

### **Manual Testing with curl**

```bash
# Health check
curl http://localhost:3001/health

# Get contributions (public)
curl http://localhost:3001/api/contributions

# Create contribution (authenticated)
curl -X POST http://localhost:3001/api/contributions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "content": "Content here..."
  }'
```

### **Postman/Insomnia**

Import these endpoints:
- Base URL: `http://localhost:3001`
- Auth: Bearer Token in `Authorization` header
- Test each endpoint from API_DOCUMENTATION.md

---

## 🔧 **CONFIGURATION**

### **Environment Variables**

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key

Optional:
- `PORT` (default: 3001)
- `NODE_ENV` (default: development)
- `RATE_LIMIT_WINDOW_MS` (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` (default: 100)

### **CORS**

By default, allows:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://*.vercel.app`
- `https://*.fractiai.com`
- Value from `NEXT_PUBLIC_WEBSITE_URL`

Edit `server.ts` to add more origins.

---

## 📊 **MONITORING**

### **Logs**

All requests are logged:
```
[2026-01-22T10:00:00.000Z] GET /api/contributions
[2026-01-22T10:00:01.000Z] POST /api/contributions
```

### **Health Check**

Monitor `/health` endpoint for uptime:
```bash
curl http://localhost:3001/health
```

---

## 🐛 **TROUBLESHOOTING**

### **Port already in use**

```bash
# Change PORT in .env
PORT=3002
```

### **Database connection fails**

Check:
- `NEXT_PUBLIC_SUPABASE_URL` is correct
- `SUPABASE_SERVICE_ROLE_KEY` is correct (service role, not anon key)
- Supabase project is running

### **Authentication fails**

- Ensure JWT token is valid (not expired)
- Token should be from Supabase Auth
- Header format: `Authorization: Bearer <token>`

### **Rate limit hit**

- Default: 100 requests per 15 minutes
- Increase in `.env`: `RATE_LIMIT_MAX_REQUESTS=200`

---

## 📖 **ADDITIONAL RESOURCES**

- **API Documentation**: `../API_DOCUMENTATION.md`
- **Database Schema**: `../CENTRAL_DATABASE_ARCHITECTURE.md`
- **Setup Guide**: `../ECOSYSTEM_SETUP_COMPLETE.md`
- **Supabase Docs**: https://supabase.com/docs
- **Express Docs**: https://expressjs.com

---

## ✅ **CHECKLIST**

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env`)
- [ ] Supabase database created & schema deployed
- [ ] Server runs locally (`npm run dev`)
- [ ] Health check works (`/health`)
- [ ] Can create/read contributions
- [ ] Authentication works with JWT
- [ ] AI endpoints respond

---

## 🎯 **NEXT STEPS**

1. **Setup**: Follow Quick Start above
2. **Test**: Use curl/Postman to test endpoints
3. **Integrate**: Connect your web/mobile apps
4. **Customize**: Add custom AI models, endpoints
5. **Deploy**: Push to production (Vercel/Docker)

---

**READY TO POWER YOUR ENTIRE ECOSYSTEM! 🚀**

For questions or issues, see `../API_DOCUMENTATION.md` for detailed endpoint documentation.

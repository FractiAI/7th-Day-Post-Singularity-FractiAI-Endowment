# 🚀 DEPLOY FRACTIAI API TO CLOUD

**Status**: ✅ **READY TO DEPLOY**  
**Date**: January 22, 2026  
**Environment**: `.env` configured with your Supabase credentials

---

## ✅ **WHAT'S ALREADY DONE**

1. ✅ **API Code**: Complete (30+ endpoints, AI features)
2. ✅ **Dependencies**: Installed (494 packages)
3. ✅ **Environment Variables**: Configured with your Supabase
4. ✅ **Database**: Connected (42 tables in Syntheverse project)
5. ✅ **Vercel Config**: Created (`vercel.json`)

**You just need to deploy!**

---

## 🚀 **DEPLOY TO VERCEL (RECOMMENDED)**

### **Step 1: Login to Vercel**

```bash
cd api
vercel login
```

Choose: **Continue with GitHub** (or your preference)

Your browser will open → Click "Authorize"

---

### **Step 2: Deploy to Production**

```bash
vercel --prod
```

Vercel will ask:
- **Set up and deploy?** → Yes
- **Which scope?** → Choose your account
- **Link to existing project?** → No
- **Project name?** → `fractiai-syntheverse-api` (or your choice)
- **Directory?** → `.` (current directory)
- **Override settings?** → No

---

### **Step 3: Set Environment Variables**

After deployment, Vercel will give you a URL like:
```
https://fractiai-syntheverse-api.vercel.app
```

Now add your environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Click your project: `fractiai-syntheverse-api`
3. Click: **Settings**
4. Click: **Environment Variables**
5. Add these variables:

```bash
# Add each one individually:

NEXT_PUBLIC_SUPABASE_URL
https://jfbgdxeumzqzigptbmvp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA4NzM4OCwiZXhwIjoyMDgxNjYzMzg4fQ.-2HxO5TMcWFv21Ax4GZMqjTuJz-okIujHQx-R2xrTnY

GOOGLE_OAUTH_CLIENT_ID
767219028146-ti4gsu6j6lpgrgjm4uhplc4dnf8ogmad.apps.googleusercontent.com

GOOGLE_OAUTH_CLIENT_SECRET
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

NODE_ENV
production

PORT
3001
```

---

### **Step 4: Redeploy**

After adding environment variables:

```bash
vercel --prod
```

Or just push to GitHub (if you linked it to auto-deploy)

---

### **Step 5: Test Your API**

```bash
# Test health endpoint
curl https://fractiai-syntheverse-api.vercel.app/health

# Expected response:
{
  "status": "healthy",
  "service": "FractiAI Syntheverse API",
  "timestamp": "2026-01-22T...",
  "version": "1.0.0"
}
```

---

## 🎯 **ALTERNATIVE: DEPLOY TO RAILWAY**

If you prefer Railway.app:

### **Step 1: Install Railway CLI**

```bash
npm install -g @railway/cli
railway login
```

### **Step 2: Deploy**

```bash
cd api
railway init
railway up
```

### **Step 3: Set Environment Variables**

```bash
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://jfbgdxeumzqzigptbmvp.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
railway variables set SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
# ... etc for all variables
```

---

## 🎯 **ALTERNATIVE: DEPLOY TO RENDER**

If you prefer Render.com:

### **Step 1: Create Account**

Go to https://render.com and sign up

### **Step 2: New Web Service**

1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Or use "Deploy from repository"

### **Step 3: Configure**

- **Name**: `fractiai-syntheverse-api`
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or paid)

### **Step 4: Add Environment Variables**

Add all the environment variables from above in the Render dashboard

---

## 📋 **QUICK START (ONE COMMAND)**

If you're already logged into Vercel:

```bash
cd /Users/macbook/FractiAI/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition/api
vercel --prod
```

That's it! Just follow the prompts.

---

## ✅ **VERIFICATION CHECKLIST**

After deployment:

- [ ] API URL works: `https://your-api.vercel.app/health`
- [ ] Returns healthy status
- [ ] Database connected (no Supabase errors)
- [ ] Can create test contribution
- [ ] AI endpoints respond
- [ ] Authentication works

---

## 🔧 **TROUBLESHOOTING**

### **Issue: "supabaseUrl is required"**

**Fix**: Make sure environment variables are set in Vercel Dashboard

### **Issue: CORS errors**

**Fix**: Add your frontend domain to CORS in `server.ts`:
```typescript
origin: [
  'https://your-frontend.vercel.app',
  'http://localhost:3000'
]
```

### **Issue: Build fails**

**Fix**: Make sure `package.json` has build script:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 📊 **YOUR API ENDPOINTS**

Once deployed, you'll have:

```
https://your-api.vercel.app/
├── /health
├── /api/auth
│   ├── GET /me
│   ├── PUT /me
│   └── POST /verify
├── /api/contributions
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── /api/ai
│   ├── POST /analyze
│   ├── POST /recommend
│   ├── POST /chat
│   └── POST /score
├── /api/sandboxes
│   ├── GET /
│   ├── POST /
│   └── GET /:id
├── /api/chat
│   ├── GET /rooms
│   ├── GET /rooms/:id/messages
│   └── POST /rooms/:id/messages
└── /api/analytics
    ├── GET /dashboard
    └── GET /system
```

---

## 🎉 **NEXT STEPS AFTER DEPLOYMENT**

1. **Test all endpoints** with Postman/Insomnia
2. **Connect your frontend** apps to the API URL
3. **Configure Google OAuth** redirect URLs
4. **Set up Stripe webhooks** (if using payments)
5. **Monitor logs** in Vercel Dashboard
6. **Set up custom domain** (optional)

---

## 💰 **COST**

### **Vercel**:
- Free tier: 100GB bandwidth, serverless functions
- Pro: $20/month (if you need more)

### **Railway**:
- Free: $5 credit/month
- Pay as you go after that

### **Render**:
- Free tier available
- Paid plans start at $7/month

---

## 🚀 **READY TO DEPLOY?**

```bash
cd api
vercel login
vercel --prod
```

**That's it! Your API will be live in ~2 minutes! 🔥**

---

## 📖 **ADDITIONAL RESOURCES**

- Vercel Docs: https://vercel.com/docs
- API Documentation: `../API_DOCUMENTATION.md`
- Setup Guide: `../ECOSYSTEM_SETUP_COMPLETE.md`

---

**YOUR API IS READY TO GO LIVE! 🚀**


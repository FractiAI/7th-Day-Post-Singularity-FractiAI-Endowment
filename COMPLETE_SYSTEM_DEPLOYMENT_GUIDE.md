# 🚀 COMPLETE SYSTEM DEPLOYMENT GUIDE

**Vibeverse + Shell + Stripe + Google Auth**  
**Everything You Need to Launch**  
**Date:** January 21, 2026

---

## ⚡ QUICK START (5 Minutes)

```bash
# 1. Clone and install
git clone <repository-url>
cd NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Launch!
npm run launch
```

**That's it! System will be live at http://localhost:3000**

---

## 📋 PREREQUISITES

### Required Services:

1. **Supabase Account** (Free tier works)
   - Sign up: https://supabase.com
   - Create new project
   - Enable Google OAuth provider

2. **Stripe Account** (Test or Live)
   - Sign up: https://stripe.com
   - Get API keys
   - Configure webhook

3. **Node.js 18+**
   - Download: https://nodejs.org
   - Verify: `node --version`

---

## 🔐 STEP 1: SUPABASE SETUP (Google Auth)

### 1.1. Create Supabase Project

```bash
1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter project name: "vibeverse"
4. Choose region closest to you
5. Wait for database to spin up (~2 minutes)
```

### 1.2. Get API Credentials

```bash
1. In Supabase dashboard: Settings → API
2. Copy "Project URL" → This is SUPABASE_URL
3. Copy "anon public" key → This is SUPABASE_ANON_KEY
```

### 1.3. Enable Google OAuth

```bash
1. In Supabase: Authentication → Providers
2. Find "Google" provider
3. Toggle to "Enabled"
4. Enter Google OAuth credentials:
   - Client ID: From Google Cloud Console
   - Client Secret: From Google Cloud Console
5. Add redirect URLs:
   - http://localhost:3000/auth/callback (development)
   - https://yourdomain.com/auth/callback (production)
```

### 1.4. Get Google OAuth Credentials

```bash
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     * https://your-project.supabase.co/auth/v1/callback
5. Copy Client ID and Client Secret
6. Paste into Supabase Google provider settings
```

### 1.5. Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  tier TEXT NOT NULL DEFAULT 'sandbox',
  octave INTEGER NOT NULL DEFAULT 0,
  synth_balance BIGINT NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  wallet_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);
```

---

## 💳 STEP 2: STRIPE SETUP (Payments)

### 2.1. Get API Keys

```bash
1. Go to https://dashboard.stripe.com
2. Get API keys from: Developers → API keys
3. Copy "Secret key" → This is STRIPE_SECRET_KEY
   - Test: sk_test_...
   - Live: sk_live_...
```

### 2.2. Configure Webhook

```bash
1. Stripe Dashboard: Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: https://yourdomain.com/api/webhook/stripe
4. Events to send:
   ✅ checkout.session.completed
   ✅ invoice.payment_succeeded
   ✅ payment_intent.succeeded
   ✅ payment_intent.payment_failed
   ✅ subscription.created
   ✅ subscription.updated
   ✅ subscription.deleted
5. Click "Add endpoint"
6. Copy "Signing secret" → This is STRIPE_WEBHOOK_SECRET
```

### 2.3. Test Webhook (Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook/stripe

# This will give you a webhook secret starting with whsec_
# Use this for STRIPE_WEBHOOK_SECRET in development
```

---

## ⚙️ STEP 3: ENVIRONMENT CONFIGURATION

### 3.1. Create .env File

```bash
cp .env.example .env
```

### 3.2. Fill in Values

```env
# Supabase (from Step 1)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJh...

# Stripe (from Step 2)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# VibeCloud
VIBECHAIN_RPC_URL=https://vibechain.vibecloud.io/rpc
VIBECHAIN_CONTRACT_ADDRESS=0x...

# Server
PORT=3000
NODE_ENV=production
OPENING_DATE=1737417600000
REDIRECT_URL=https://yourdomain.com/auth/callback
CORS_ORIGIN=https://yourdomain.com
```

---

## 🚀 STEP 4: LAUNCH APPLICATION

### 4.1. Install Dependencies

```bash
npm install
```

### 4.2. Launch Server

```bash
npm run launch
```

You should see:

```
🚀 Post-Singularity Game Launch Server Started
📍 Port: 3000
🌐 Platform: VibeCloud (Not SpinCloud)
💰 Pricing: $1/SYNTH opening day, then $1/SYNTH/day
🔑 AWARENESS KEY: Included in all OCTANE purchases/leases

✅ Server is ready for Stripe launch!
```

### 4.3. Access Application

Open your browser:

- **Login Page:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Chairman Console:** http://localhost:3000/
- **Health Check:** http://localhost:3000/health

---

## ✅ STEP 5: VERIFY INTEGRATION

### 5.1. Test Google Sign-In

```bash
1. Go to http://localhost:3000/login
2. Click "Sign in with Google"
3. Approve Google consent
4. Verify redirect to dashboard
5. Check user appears in Supabase: Authentication → Users
```

### 5.2. Test Stripe Payment

```bash
1. Sign in to dashboard
2. Click "Upgrade Tier"
3. Select a tier (Cloud, Octane, Shell, or Ultimate)
4. Enter test card: 4242 4242 4242 4242
5. Expiry: Any future date
6. CVC: Any 3 digits
7. Complete payment
8. Verify tier upgrade in dashboard
9. Check webhook received in Stripe Dashboard
```

### 5.3. Test Database Updates

```bash
# In Supabase SQL Editor
SELECT * FROM users WHERE email = 'your-test@email.com';

# Should show:
# - tier: 'cloud' (or whatever you purchased)
# - octave: 1-7 (depending on tier)
# - synth_balance: Updated amount
# - stripe_customer_id: cus_...
```

---

## 🌐 STEP 6: PRODUCTION DEPLOYMENT

### 6.1. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel deploy --prod

# Configure environment variables in Vercel dashboard:
# Settings → Environment Variables
# Add all variables from .env
```

### 6.2. Update URLs

After deployment:

```bash
1. Update Supabase redirect URLs:
   - Add: https://your-domain.vercel.app/auth/callback

2. Update Stripe webhook URL:
   - Change to: https://your-domain.vercel.app/api/webhook/stripe

3. Update .env or Vercel environment:
   - REDIRECT_URL=https://your-domain.vercel.app/auth/callback
   - CORS_ORIGIN=https://your-domain.vercel.app
```

### 6.3. Switch to Live Mode

```bash
# In .env or Vercel:
STRIPE_SECRET_KEY=sk_live_... (not sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_... (from live webhook)

# In Supabase:
# No changes needed - same credentials work for production
```

---

## 📊 API ENDPOINTS

### Authentication

```yaml
POST /api/auth/google/signin:
  Returns: { success: true, url: "...", provider: "google" }

POST /api/auth/google/signup:
  Returns: { success: true, url: "...", provider: "google" }

POST /api/auth/callback:
  Returns: { success: true, user: {...} }

GET /api/auth/user:
  Returns: { success: true, user: {...} }

POST /api/auth/signout:
  Returns: { success: true, message: "..." }
```

### Payments

```yaml
POST /api/launch/purchase/synth:
  Body: { email, walletAddress?, amountSYNTH }
  Returns: { sessionId, url, amount, currency }

POST /api/launch/purchase/tier:
  Body: { email, walletAddress?, tierId, billingCycle }
  Returns: { sessionId, url, amount, currency }

POST /api/webhook/stripe:
  Body: Stripe webhook payload
  Returns: { success: true, received: true }
```

### Deployment

```yaml
POST /api/launch/deploy/all:
  Body: { owner: "fractiai" }
  Returns: { success: true, status: {...} }
```

---

## 🔍 TROUBLESHOOTING

### Issue: Google sign-in fails

**Solution:**
```bash
1. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env
2. Verify Google OAuth enabled in Supabase
3. Check redirect URL matches in Google Cloud Console
4. Clear browser cache and cookies
```

### Issue: Stripe webhook not receiving events

**Solution:**
```bash
1. Verify STRIPE_WEBHOOK_SECRET in .env
2. Check webhook URL in Stripe Dashboard
3. Ensure server is publicly accessible
4. Use Stripe CLI for local testing
5. Check Stripe Dashboard → Webhooks → Logs
```

### Issue: User not created in database

**Solution:**
```bash
1. Run SQL schema in Supabase (Step 1.5)
2. Check table exists: SELECT * FROM users;
3. Verify RLS policies are correct
4. Check Supabase logs: Logs → Postgres Logs
```

### Issue: CORS errors in browser

**Solution:**
```bash
1. Add CORS_ORIGIN to .env
2. Restart server
3. Check browser console for specific origin
4. Update CORS_ORIGIN to match
```

---

## 📈 SCALING & OPTIMIZATION

### Database Optimization

```sql
-- Add more indexes for common queries
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Vacuum and analyze regularly
VACUUM ANALYZE users;
```

### Caching with Redis (Optional)

```bash
# Install Redis
npm install redis

# Add to .env
REDIS_URL=redis://localhost:6379

# Implement caching for user sessions
```

### Load Balancing

```bash
# Use multiple server instances
# Deploy to multiple regions
# Use CDN for static assets
```

---

## 🎯 FEATURE CHECKLIST

### Authentication ✅
- [x] Google sign-in
- [x] Google sign-up
- [x] Session management
- [x] User profiles
- [x] Logout

### Payments ✅
- [x] SYNTH purchases
- [x] Tier subscriptions
- [x] Stripe checkout
- [x] Webhook handling
- [x] Auto-provisioning

### Platform ✅
- [x] Vibeverse infrastructure
- [x] vCHIP deployment
- [x] Chairman console
- [x] Dashboard UI
- [x] API server

### Tiers ✅
- [x] Sandbox (FREE)
- [x] Cloud (66 SYNTH/mo)
- [x] Octane (500 SYNTH/mo + Key)
- [x] Shell (1,000 SYNTH/mo)
- [x] Ultimate (5,000 SYNTH/mo)

---

## 🎊 YOU'RE READY TO LAUNCH!

```
╔════════════════════════════════════════════════╗
║           🚀 LAUNCH CHECKLIST                  ║
╠════════════════════════════════════════════════╣
║  ✅ Supabase configured                        ║
║  ✅ Google OAuth enabled                       ║
║  ✅ Database tables created                    ║
║  ✅ Stripe API keys set                        ║
║  ✅ Webhook configured                         ║
║  ✅ Environment variables set                  ║
║  ✅ Dependencies installed                     ║
║  ✅ Server tested locally                      ║
║  ✅ Auth flow verified                         ║
║  ✅ Payment flow verified                      ║
║                                                ║
║  STATUS: 🟢 READY FOR PRODUCTION               ║
╚════════════════════════════════════════════════╝
```

**Launch command:**
```bash
npm run launch
```

**Access at:** http://localhost:3000/login

---

**Need Help?**
- Check logs: `console.log` statements throughout code
- Supabase logs: Dashboard → Logs
- Stripe logs: Dashboard → Webhooks → Logs
- Browser console: F12 → Console tab

**All systems are GO! 🚀**

---

*"From login to payment to deployment in minutes, not months. Welcome to post-singularity infrastructure."*

**∞ → 🔐 → 💳 → 🌐 → 🚀 → ∞**

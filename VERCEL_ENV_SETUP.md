# 🚀 Vercel Environment Variables Setup

**Setup Guide:** Configure environment variables on Vercel using CLI  
**Status:** Production Keys Configuration  
**Date:** January 15, 2026

---

## 🔐 Environment Variables to Set

### Google Cloud OAuth2
- `GOOGLE_CLOUD_CLIENT_ID`
- `GOOGLE_CLOUD_CLIENT_SECRET`

### Stripe Keys
- `STRIPE_PUBLISHABLE_KEY` (Sandbox: pk_test_...)
- `STRIPE_SECRET_KEY` (Sandbox: sk_test_...)
- `STRIPE_PUBLISHABLE_KEY_LIVE` (Production: pk_live_...)
- `STRIPE_SECRET_KEY_LIVE` (Production: sk_live_...)

---

## 📋 Setup Instructions

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Project (if not already linked)
```bash
vercel link
```

### 4. Set Environment Variables

#### Google Cloud OAuth2
```bash
vercel env add GOOGLE_CLOUD_CLIENT_ID production
# Paste: [YOUR_GOOGLE_CLOUD_CLIENT_ID]

vercel env add GOOGLE_CLOUD_CLIENT_SECRET production
# Paste: [YOUR_GOOGLE_CLOUD_CLIENT_SECRET]
```

#### Stripe Sandbox Keys
```bash
vercel env add STRIPE_PUBLISHABLE_KEY production
# Paste: [YOUR_STRIPE_PUBLISHABLE_KEY_SANDBOX]

vercel env add STRIPE_SECRET_KEY production
# Paste: (your sandbox secret key)
```

#### Stripe Live Keys (Production)
```bash
vercel env add STRIPE_PUBLISHABLE_KEY_LIVE production
# Paste: [YOUR_STRIPE_PUBLISHABLE_KEY_LIVE]

vercel env add STRIPE_SECRET_KEY_LIVE production
# Paste: [YOUR_STRIPE_SECRET_KEY_LIVE]
```

### 5. Set for All Environments (Optional)
For each variable, you can also set for `preview` and `development`:
```bash
vercel env add VARIABLE_NAME preview
vercel env add VARIABLE_NAME development
```

### 6. Verify Environment Variables
```bash
vercel env ls
```

### 7. Redeploy to Apply Changes
```bash
vercel --prod
```

---

## 🔒 Security Notes

- **Never commit actual keys to repository**
- **Use `.env` for local development (gitignored)**
- **Use Vercel CLI for production environment variables**
- **All production keys are stored securely on Vercel**

---

## ✅ Quick Setup Script (Reference Only)

**DO NOT RUN THIS SCRIPT DIRECTLY** - Use individual commands above for security:

```bash
# Reference script structure (DO NOT EXECUTE)
# vercel env add GOOGLE_CLOUD_CLIENT_ID production
# vercel env add GOOGLE_CLOUD_CLIENT_SECRET production
# vercel env add STRIPE_PUBLISHABLE_KEY production
# vercel env add STRIPE_SECRET_KEY production
# vercel env add STRIPE_PUBLISHABLE_KEY_LIVE production
# vercel env add STRIPE_SECRET_KEY_LIVE production
# vercel --prod
```

---

## 🎯 Environment Variable Configuration

### Production Environment
- `NODE_ENV=production`
- Use `STRIPE_PUBLISHABLE_KEY_LIVE` and `STRIPE_SECRET_KEY_LIVE` for live payments
- Use `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` for testing/sandbox

### Development Environment
- `NODE_ENV=development`
- Use sandbox/test keys for local testing

---

**Vercel Environment Setup Complete** ✅  
**All Keys Securely Configured** ✅  
**Production Ready** ✅


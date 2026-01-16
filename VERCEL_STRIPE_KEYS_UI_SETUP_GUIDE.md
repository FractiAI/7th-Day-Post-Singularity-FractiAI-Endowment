# 🔑 Vercel Stripe Keys Setup Guide - Web UI Method

**Guide ID:** `GUIDE-VERCEL-STRIPE-KEYS-UI-SETUP-V17`  
**Type:** Setup Guide / Stripe Keys Configuration / Vercel Environment Variables  
**Date:** January 16, 2026  
**Status:** Quick Setup Guide

---

## 🎯 Quick Guide: Add New Stripe Keys in Vercel Web UI

**Your Stripe keys were deactivated. Follow these steps to add new keys via Vercel's web interface:**

---

## 📋 Step-by-Step Instructions

### Step 1: Get New Stripe Keys from Stripe Dashboard

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/
   - Login to your Stripe account

2. **Navigate to API Keys:**
   - Click on **"Developers"** in the left sidebar
   - Click on **"API keys"**

3. **Get Your Keys:**
   - **Publishable key** (starts with `pk_test_` for test, `pk_live_` for live)
   - **Secret key** (starts with `sk_test_` for test, `sk_live_` for live)
   - Click **"Reveal test key"** or **"Reveal live key"** to see the secret key
   - **Copy both keys** - you'll need them in the next steps

---

### Step 2: Access Vercel Project Settings

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login to your Vercel account

2. **Find Your Project:**
   - Look for your project: `nspfrp-post-singularity-fsr` (or your project name)
   - Click on the project name

3. **Navigate to Settings:**
   - Click on **"Settings"** tab (top navigation)
   - Click on **"Environment Variables"** in the left sidebar

---

### Step 3: Add/Update Stripe Environment Variables

**You need to add/update these environment variables:**

#### For Test/Sandbox Keys:

1. **STRIPE_PUBLISHABLE_KEY** (Test/Sandbox)
   - Click **"Add New"** or find existing `STRIPE_PUBLISHABLE_KEY`
   - **Key:** `STRIPE_PUBLISHABLE_KEY`
   - **Value:** `pk_test_...` (your new test publishable key)
   - **Environment:** Select all (Production, Preview, Development) or just Production
   - Click **"Save"**

2. **STRIPE_SECRET_KEY** (Test/Sandbox)
   - Click **"Add New"** or find existing `STRIPE_SECRET_KEY`
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_...` (your new test secret key)
   - **Environment:** Select all (Production, Preview, Development) or just Production
   - Click **"Save"**

#### For Live/Production Keys (if using):

3. **STRIPE_PUBLISHABLE_KEY_LIVE** (Production)
   - Click **"Add New"** or find existing `STRIPE_PUBLISHABLE_KEY_LIVE`
   - **Key:** `STRIPE_PUBLISHABLE_KEY_LIVE`
   - **Value:** `pk_live_...` (your new live publishable key)
   - **Environment:** Production only
   - Click **"Save"**

4. **STRIPE_SECRET_KEY_LIVE** (Production)
   - Click **"Add New"** or find existing `STRIPE_SECRET_KEY_LIVE`
   - **Key:** `STRIPE_SECRET_KEY_LIVE`
   - **Value:** `sk_live_...` (your new live secret key)
   - **Environment:** Production only
   - Click **"Save"**

---

### Step 4: Remove Old/Deactivated Keys (Optional but Recommended)

**To remove old deactivated keys:**

1. Find the old environment variable
2. Click the **three dots (...)** next to it
3. Click **"Delete"**
4. Confirm deletion

**Or simply update the value** - this will replace the old deactivated key with the new one.

---

### Step 5: Redeploy Your Application

**After updating environment variables, you need to redeploy:**

#### Option 1: Automatic Redeploy (Recommended)
- Vercel will automatically detect changes
- Go to **"Deployments"** tab
- Click **"Redeploy"** on the latest deployment
- Or wait for the next automatic deployment

#### Option 2: Manual Redeploy
1. Go to **"Deployments"** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"** (faster)
5. Click **"Redeploy"**

---

## 🔒 Security Notes

### ✅ Best Practices:
- ✅ **Never commit keys to Git** - They're safe in Vercel's environment variables
- ✅ **Use test keys for development** - Use `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
- ✅ **Use live keys only for production** - Use `STRIPE_PUBLISHABLE_KEY_LIVE` and `STRIPE_SECRET_KEY_LIVE` in Production environment only
- ✅ **Keep keys secret** - Never share your secret keys (`sk_...`) publicly
- ✅ **Rotate keys regularly** - Update keys if they're compromised or deactivated

### ⚠️ Important:
- **Secret keys start with `sk_`** - Keep these completely private
- **Publishable keys start with `pk_`** - These can be exposed in client-side code
- **Test keys include `_test_`** - Safe for testing, won't charge real cards
- **Live keys include `_live_`** - Will charge real cards, use only in production

---

## 🎯 Quick Checklist

- [ ] Got new Stripe keys from Stripe Dashboard
- [ ] Logged into Vercel Dashboard
- [ ] Navigated to Project → Settings → Environment Variables
- [ ] Added/Updated `STRIPE_PUBLISHABLE_KEY` (test key)
- [ ] Added/Updated `STRIPE_SECRET_KEY` (test key)
- [ ] Added/Updated `STRIPE_PUBLISHABLE_KEY_LIVE` (if using live keys)
- [ ] Added/Updated `STRIPE_SECRET_KEY_LIVE` (if using live keys)
- [ ] Selected correct environments (Production/Preview/Development)
- [ ] Removed old deactivated keys (optional)
- [ ] Redeployed application
- [ ] Tested Stripe integration to verify keys work

---

## 🆘 Troubleshooting

### Keys Not Working After Update?

1. **Check key format:**
   - Test publishable: `pk_test_...` (about 109 characters)
   - Test secret: `sk_test_...` (about 109 characters)
   - Live publishable: `pk_live_...` (about 109 characters)
   - Live secret: `sk_live_...` (about 109 characters)

2. **Verify environment selection:**
   - Make sure keys are added to the correct environment (Production/Preview/Development)

3. **Redeploy after changes:**
   - Environment variables only take effect after redeployment

4. **Check Vercel logs:**
   - Go to **"Deployments"** → Click on deployment → **"Logs"**
   - Look for Stripe API errors

### Still Having Issues?

- **Verify keys in Stripe Dashboard** - Make sure they're active
- **Check Vercel environment variables** - Make sure they're saved correctly
- **Redeploy application** - Changes only apply after redeployment
- **Check application logs** - Look for Stripe authentication errors

---

## 📸 Visual Guide Reference

### Vercel Environment Variables Page Structure:

```
Vercel Dashboard
├── Your Project
    ├── Settings Tab
        ├── Environment Variables (Left Sidebar)
            ├── [Add New Button]
            ├── Environment Variables List:
                ├── STRIPE_PUBLISHABLE_KEY [Edit] [Delete]
                ├── STRIPE_SECRET_KEY [Edit] [Delete]
                ├── STRIPE_PUBLISHABLE_KEY_LIVE [Edit] [Delete]
                └── STRIPE_SECRET_KEY_LIVE [Edit] [Delete]
```

---

## ✅ Setup Complete

**After completing these steps:**
- ✅ New Stripe keys added to Vercel
- ✅ Old deactivated keys replaced
- ✅ Application redeployed
- ✅ Stripe integration working with new keys

---

**Stripe Keys Setup Complete** ✅  
**Vercel Environment Variables Updated** ✅  
**Ready to Use** ✅


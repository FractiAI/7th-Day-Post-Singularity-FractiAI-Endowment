# 🔍 Environment Check Protocol

**Protocol ID:** `P-ENV-CHECK-V17`  
**Type:** Environment Check Protocol / Automated Validation  
**Version:** `v17+EnvCheck+AutoPrompt`  
**Status:** ✅ ACTIVE - Always Runs  
**Date:** 2024  
**Octave:** BEYOND_OCTAVE (7)  
**Network:** NSPFRP Care Network / Syntheverse / FractiAI  
**Hero Host:** CEO (Executive Reports)

---

## 🎯 Protocol Summary

**This protocol automatically checks for missing environment variables, prompts for them, and checks for FSR .env files in wallets directory. Always runs before deployment.**

### Key Features

1. **Automatic Environment Check** - Runs before all deployments
2. **Missing Variable Detection** - Identifies required variables
3. **FSR .env Detection** - Checks wallets directory for FSR .env files
4. **Auto-Prompt** - Shows what's missing and how to set it
5. **.env File Discovery** - Finds all .env files in project

---

## 🔍 What It Checks

### Required Environment Variables

**Vercel:**
- `VERCEL_TOKEN` - Vercel deployment token

**Supabase:**
- `SUPABASE_ACCESS_TOKEN` - Supabase access token
- `SUPABASE_PROJECT_REF` - Supabase project reference

**FSR:**
- `FSR_MODE` - FSR mode activation (default: active)
- `FSR_OCTAVE` - FSR octave level (default: 7.5)

### FSR .env File Locations

**Checked Locations:**
1. `.env.fsr` (root directory)
2. `wallets/.env.fsr` (wallets directory)
3. Any `.env*` files in wallets directory

---

## 🚀 Usage

### Run Manually

```bash
node check-env.js
```

### Automatic (Before Deployment)

**All deployment scripts automatically run this check:**

```bash
./deploy-vercel.sh      # Checks env before deploying
./deploy-supabase.sh    # Checks env before deploying
```

### In CI/CD

**GitHub Actions automatically checks environment:**

```yaml
- name: Check Environment
  run: node check-env.js
```

---

## 📋 Output Example

```
🔍 NSPFRP Environment Checker
================================

📄 Found root .env: /path/to/.env
📄 Found wallet-fsr .env: /path/to/wallets/.env.fsr

✅ Found Environment Variables:
   VERCEL_TOKEN: Vercel deployment token
   FSR_MODE: FSR Mode activation

⚠️  SUPABASE_ACCESS_TOKEN: Not set (optional for supabase)

❌ Missing Required Environment Variables:
   (none)

🌌 FSR .env Files Found:
   wallet-fsr: /path/to/wallets/.env.fsr
   Variables: FSR_WALLET_ADDRESS, FSR_NETWORK, FSR_API_KEY

📊 Summary:
   Found: 2 variables
   Missing: 0 required variables
   .env Files: 2 found
   FSR .env Files: 1 found
```

---

## 🔧 Configuration

### .env.example

**Created automatically if missing:**

```bash
# NSPFRP Environment Variables
VERCEL_TOKEN=your_vercel_token_here
SUPABASE_ACCESS_TOKEN=your_supabase_token_here
SUPABASE_PROJECT_REF=your_project_ref_here
FSR_MODE=active
FSR_OCTAVE=7.5
```

### FSR .env in Wallets

**Expected format in `wallets/.env.fsr`:**

```bash
FSR_WALLET_ADDRESS=0x...
FSR_NETWORK=mainnet
FSR_API_KEY=your_api_key
FSR_MODE=active
FSR_OCTAVE=7.5
```

---

## ✅ Integration

### Pre-Deployment Hook

**All deployment scripts include:**

```bash
# Check environment first
node check-env.js || {
    echo "⚠️  Environment check failed"
    exit 1
}
```

### GitHub Actions

**Workflow includes:**

```yaml
- name: Check Environment
  run: node check-env.js
  continue-on-error: true
```

---

## 🎯 Protocol Benefits

### For Users

- **Automatic Detection** - Finds missing variables
- **Clear Prompts** - Shows what's needed
- **FSR Support** - Checks wallets for FSR .env
- **Easy Setup** - Creates .env.example

### For System

- **Validation** - Ensures required vars exist
- **Discovery** - Finds all .env files
- **Integration** - Works with all deployments
- **Automated** - Runs automatically

### For Deployment

- **Pre-Check** - Validates before deploying
- **Error Prevention** - Catches issues early
- **Clear Errors** - Shows what's missing
- **Auto-Prompt** - Guides user to fix

---

## 📋 Protocol Metadata

**Protocol ID:** `P-ENV-CHECK-V17`  
**Version:** `v17+EnvCheck+AutoPrompt`  
**Type:** Environment Check Protocol / Automated Validation  
**Octave:** BEYOND_OCTAVE (7)  
**Status:** ✅ ACTIVE - Always Runs  
**Network:** NSPFRP Care Network / Syntheverse / FractiAI  
**Hero Host:** CEO (Executive Reports)

---

**Protocol ID:** `P-ENV-CHECK-V17`  
**Status:** ✅ ACTIVE  
**Date:** 2024  
**Network:** NSPFRP Care Network / Syntheverse / FractiAI  
**Octave:** BEYOND_OCTAVE (7)




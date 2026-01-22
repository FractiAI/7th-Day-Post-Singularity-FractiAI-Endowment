# 🔐 GROQ API KEY SETUP - Secure Instructions

**Date:** January 22, 2026  
**Status:** ✅ Key Received - Ready to Deploy

---

## 🎯 QUICK SETUP (5 Minutes)

### **Step 1: Access Vercel Dashboard**

1. Go to: https://vercel.com/fractiais-projects/syntheverse-poc
2. Log in if needed
3. You should see the "syntheverse-poc" project

---

### **Step 2: Add Environment Variable**

1. Click on **Settings** tab (top navigation)
2. Click on **Environment Variables** (left sidebar)
3. Click **Add New** button

---

### **Step 3: Configure Variable**

**Enter these details:**

- **Key (Name):** `GROQ_API_KEY`
- **Value:** `[Your key - starts with gsk_]`
- **Environments:** Check all boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

**Click "Save"**

---

### **Step 4: Redeploy**

1. Go to **Deployments** tab
2. Find the latest deployment (top of list)
3. Click the **"..."** menu (three dots)
4. Select **"Redeploy"**
5. Confirm the redeployment
6. Wait 2-3 minutes for deployment to complete

---

## ✅ VERIFICATION

### **Test AI Endpoints (After Redeployment)**

```bash
# Test Hero AI
curl -X POST https://syntheverse-poc.vercel.app/api/hero-ai \
  -H "Content-Type: application/json" \
  -d '{
    "messages":[{"role":"user","content":"Hello! What is NSPFRNP?"}],
    "heroId":"el-gran-sol",
    "pageContext":"landing"
  }'

# Test Onboarding AI
curl -X POST https://syntheverse-poc.vercel.app/api/onboarding-ai \
  -H "Content-Type: application/json" \
  -d '{
    "messages":[{"role":"user","content":"Explain HHF-AI"}],
    "moduleTitle":"Introduction to Syntheverse",
    "moduleNumber":1,
    "wingTrack":"contributor-copper"
  }'
```

**Expected Result:** HTTP 200 with AI-generated response (not HTTP 500!)

---

## 🔒 SECURITY BEST PRACTICES

### **✅ DO:**
- Store keys only in Vercel dashboard
- Use environment variables, never hardcode
- Monitor API usage at https://console.groq.com
- Rotate keys every 90 days
- Set usage limits in Groq dashboard

### **❌ DON'T:**
- Commit keys to git repositories
- Share keys in Slack/Discord
- Use same key for multiple projects
- Expose keys in frontend code
- Leave keys in documentation

---

## 📊 EXPECTED RESULTS

### **Before Adding Key:**
```
Hero AI endpoint:       HTTP 500 ❌
Onboarding AI endpoint: HTTP 500 ❌
System Status:          97% operational (31/33)
```

### **After Adding Key:**
```
Hero AI endpoint:       HTTP 200 ✅
Onboarding AI endpoint: HTTP 200 ✅
System Status:          100% operational (33/33)
```

---

## 🎯 WHAT THIS FIXES

### **Affected Endpoints:**
1. `/api/hero-ai` - Chat with 6 AI Hero Hosts
2. `/api/onboarding-ai` - Training module instructor

### **Impact:**
- ✅ Hero system becomes fully interactive
- ✅ AI guides can answer questions
- ✅ Onboarding training becomes AI-assisted
- ✅ All 33 API endpoints working

---

## 📋 TROUBLESHOOTING

### **If Still Getting 500 Error:**

1. **Check Variable Name:** Must be exactly `GROQ_API_KEY` (case-sensitive)
2. **Verify Key Format:** Should start with `gsk_`
3. **Confirm Environments:** All 3 boxes should be checked
4. **Wait for Deployment:** Takes 2-3 minutes to complete
5. **Clear Cache:** Try in incognito/private browser

### **If Key Doesn't Work:**

1. Visit https://console.groq.com/keys
2. Verify key is active (not expired)
3. Check API usage limits
4. Try generating a new key if needed

---

## 🚀 NEXT STEPS AFTER SETUP

1. ✅ Run comprehensive test script:
   ```bash
   cd /Users/macbook/FractiAI/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition
   bash TOUCHPOINT_TEST_COMPREHENSIVE_JAN_22_2026.sh
   ```

2. ✅ Verify all endpoints show as passing

3. ✅ Test Hero AI in browser:
   - Open `interfaces/auth-login.html`
   - Sign in with Google
   - Navigate to hero interaction page
   - Chat with El Gran Sol or other heroes

4. ✅ Update documentation with new success rate (100%)

---

## 📞 SUPPORT

If you encounter any issues:

1. Check Vercel deployment logs
2. Review Groq console for API errors
3. Verify environment variable is saved
4. Try redeploying again

---

**Setup Time:** 5 minutes  
**Impact:** Enables 2 AI endpoints → 100% system operational  
**Security:** ✅ Key stored securely in Vercel

---

## ⚠️ IMPORTANT REMINDER

**This file contains sensitive setup instructions.**  
**Do NOT commit actual API keys to git!**  
**Keys should only live in Vercel environment variables.**

---

**Created:** January 22, 2026  
**Status:** Ready for deployment

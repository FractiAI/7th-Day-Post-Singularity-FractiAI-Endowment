# 🔐 NSPFRNP Wallet Access Information

## Supabase Configuration

### Database Access
- **URL**: `https://jfbgdxeumzqzigptbmvp.supabase.co`
- **Project Reference**: `jfbgdxeumzqzigptbmvp`
- **Database Type**: PostgreSQL

### Authentication Keys
- **Anon Key (Public)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ`
- **Service Role Key**: Set in environment variables (not stored in code)

### Environment Variables

Add these to your `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=https://jfbgdxeumzqzigptbmvp.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://jfbgdxeumzqzigptbmvp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ
SUPABASE_SERVICE_ROLE_KEY=<set-in-environment>
```

## Vercel Configuration

### Deployment Settings
- **Platform**: Vercel
- **Framework**: Static Site (HTML/JS)
- **Build Command**: None (static files)
- **Output Directory**: `.` (root)

### Environment Variables for Vercel

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
SUPABASE_URL=https://jfbgdxeumzqzigptbmvp.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://jfbgdxeumzqzigptbmvp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ
```

## GitHub Actions Secrets

Set these in GitHub → Repository Settings → Secrets and variables → Actions:

- `VERCEL_TOKEN` - Vercel deployment token
- `SUPABASE_ACCESS_TOKEN` - Supabase access token (for CLI)
- `SUPABASE_PROJECT_REF` - `jfbgdxeumzqzigptbmvp`

## Wallet System Access

### Unified Portfolio Wallet
- **Location**: `src/integration/unified-vchip-portfolio-wallet.ts`
- **Instance**: `unifiedVChipPortfolioWallet`
- **Features**:
  - vCHIP burning and minting
  - Awareness key management
  - Portfolio tracking
  - Wallet snapshots
  - Trading cards
  - Branded merchandise

### API Endpoints

- `GET /api/portfolio/:owner` - Get portfolio
- `POST /api/portfolio/:owner/initialize` - Initialize portfolio
- `POST /api/portfolio/:owner/burn-vchip` - Burn vCHIP
- `POST /api/portfolio/:owner/burn-key` - Burn awareness key
- `POST /api/portfolio/:owner/burn-complete` - Complete burn operation
- `PUT /api/portfolio/:owner` - Update portfolio
- `GET /api/portfolios` - Get all portfolios (admin)

## Security Notes

⚠️ **Important**:
- The Supabase Anon Key is **public** and safe to expose in frontend code
- The Service Role Key should **NEVER** be committed to git
- Store sensitive keys in environment variables only
- Use `.env` file locally (gitignored)
- Use Vercel/GitHub Secrets for production

## Database Schema

The Supabase database contains:
- 42 tables (as of last check)
- User authentication tables
- Protocol storage
- Wallet data
- Trading cards
- Portfolio information

## Connection Test

Test Supabase connection:

```bash
curl https://jfbgdxeumzqzigptbmvp.supabase.co/rest/v1/ \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmdkeGV1bXpxemlncHRibXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODczODgsImV4cCI6MjA4MTY2MzM4OH0.PTv7kmbbz8k35blN2pONnK8Msi6mn8O1ok546BPz1gQ"
```

## Troubleshooting

### Common Issues

1. **Supabase connection fails**
   - Check environment variables are set
   - Verify URL is correct
   - Ensure anon key is valid

2. **Vercel deployment errors**
   - Check `vercel.json` configuration
   - Verify environment variables in Vercel dashboard
   - Check build logs for errors

3. **GitHub Actions failures**
   - Verify secrets are set in GitHub
   - Check workflow file syntax
   - Review action logs

4. **Wallet initialization fails**
   - Ensure encryption key is set
   - Check portfolio owner format
   - Verify Supabase connection

## Last Updated

- **Date**: January 22, 2026
- **Status**: ✅ Active
- **Database**: Connected (42 tables)

#!/bin/bash
# Automated Supabase Deployment Script
# Uses SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF environment variables
# Auto-checks environment before deployment

set -e

echo "🚀 NSPFRP Cloud Deployment Protocol - Supabase Deployment"
echo "=================================================="

# Check environment first
echo "🔍 Checking environment..."
node check-env.js || {
    echo ""
    echo "⚠️  Environment check failed. Please set missing variables."
    exit 1
}

echo ""

# Check for Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Check for token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "⚠️  SUPABASE_ACCESS_TOKEN not found in environment"
    echo "💡 Set it with: export SUPABASE_ACCESS_TOKEN=your_token_here"
    echo "   Or add to .env file"
    echo "💡 Also set: export SUPABASE_PROJECT_REF=your_project_ref"
    exit 1
fi

if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "⚠️  SUPABASE_PROJECT_REF not found in environment"
    echo "💡 Set it with: export SUPABASE_PROJECT_REF=your_project_ref"
    echo "   Or add to .env file"
    exit 1
fi

echo "✅ Supabase credentials found"
echo ""

# Link project
echo "🔗 Linking Supabase project..."
supabase link --project-ref "$SUPABASE_PROJECT_REF" --password "$SUPABASE_ACCESS_TOKEN"

# Deploy
echo "📦 Deploying to Supabase..."
supabase functions deploy

# Deploy static files
echo "📦 Deploying static files..."
supabase storage deploy

echo ""
echo "✅ Supabase deployment complete!"
echo "🌐 Your site is live at: https://$SUPABASE_PROJECT_REF.supabase.co"


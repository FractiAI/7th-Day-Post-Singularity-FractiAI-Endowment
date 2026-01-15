#!/bin/bash
# Automated Vercel Deployment Script
# Uses VERCEL_TOKEN environment variable for authentication
# Auto-checks environment before deployment

set -e

echo "🚀 NSPFRP Cloud Deployment Protocol - Vercel Deployment"
echo "=================================================="

# Check environment first
echo "🔍 Checking environment..."
node check-env.js || {
    echo ""
    echo "⚠️  Environment check failed. Please set missing variables."
    exit 1
}

echo ""

# Check for token
if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  VERCEL_TOKEN not found in environment"
    echo "💡 Set it with: export VERCEL_TOKEN=your_token_here"
    echo "   Or add to .env file"
    echo ""
    echo "📋 Alternative: Using GitHub Pages (no token required)"
    echo "   Enable in repository settings → Pages → Deploy from main branch"
    exit 1
fi

echo "✅ Vercel token found"
echo ""

# Deploy using token
echo "📦 Deploying to Vercel..."
vercel --prod --token "$VERCEL_TOKEN" --yes

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is live at the URL shown above"


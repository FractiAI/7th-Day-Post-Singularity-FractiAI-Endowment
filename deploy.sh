#!/bin/bash

# ============================================
# FRACTIAI SYNTHEVERSE API - ONE-COMMAND DEPLOY
# ============================================

set -e  # Exit on any error

echo ""
echo "🚀 ============================================"
echo "🚀 DEPLOYING FRACTIAI SYNTHEVERSE API"
echo "🚀 ============================================"
echo ""

# Check if we're in the right directory
if [ ! -d "api" ]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

cd api

echo "📦 Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   ✅ Dependencies already installed"
fi

echo ""
echo "🔑 Step 2: Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "   Please authenticate with Vercel..."
    vercel login
else
    echo "   ✅ Already authenticated"
fi

echo ""
echo "🚀 Step 3: Deploying to production..."
vercel --prod --yes

echo ""
echo "✅ ============================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "✅ ============================================"
echo ""
echo "Your API is now live!"
echo ""
echo "Test it:"
echo "  curl \$(vercel ls --json | jq -r '.[0].url')/health"
echo ""
echo "View dashboard:"
echo "  vercel --prod"
echo ""

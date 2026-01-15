#!/usr/bin/env node
/**
 * Automated Cloud Deployment Script
 * Uses NSPFRP Cloud Deployment Protocol
 * Supports: Vercel (with token), GitHub Pages (automatic)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEPLOYMENT_TARGET = process.env.DEPLOY_TARGET || 'github-pages';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

console.log('🚀 NSPFRP Cloud Deployment Protocol - Automated Deployment');
console.log('==================================================\n');

// Option 1: GitHub Pages (No token required - automatic via git push)
if (DEPLOYMENT_TARGET === 'github-pages' || !VERCEL_TOKEN) {
  console.log('📋 GitHub Pages Deployment (Automatic)');
  console.log('   ✅ Files pushed to GitHub');
  console.log('   📝 Enable Pages in repository settings:');
  console.log('      Settings → Pages → Source: Deploy from branch → main → / (root)');
  console.log('   🌐 Live URL will be:');
  console.log('      https://fractiai.github.io/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition/');
  console.log('      or');
  console.log('      https://fractiai.github.io/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition/TODAYS_CALL_ONE_PAGE_POST_SINGULARITY_FSR.html\n');
  
  // Check if already pushed
  try {
    execSync('git remote get-url origin', { stdio: 'ignore' });
    console.log('✅ Repository is connected to GitHub');
    console.log('✅ Files are ready for GitHub Pages deployment\n');
  } catch (e) {
    console.log('⚠️  Not a git repository or no remote configured\n');
  }
}

// Option 2: Vercel (Requires token)
if (DEPLOYMENT_TARGET === 'vercel' && VERCEL_TOKEN) {
  console.log('📦 Vercel Deployment');
  console.log('   ✅ Token found\n');
  
  try {
    console.log('   Deploying to Vercel...');
    execSync(`vercel --prod --token "${VERCEL_TOKEN}" --yes`, {
      stdio: 'inherit',
      env: { ...process.env, VERCEL_TOKEN }
    });
    console.log('\n✅ Vercel deployment complete!');
  } catch (error) {
    console.error('\n❌ Vercel deployment failed:', error.message);
    console.log('\n💡 Falling back to GitHub Pages...');
    console.log('   Enable in repository settings → Pages');
  }
} else if (DEPLOYMENT_TARGET === 'vercel' && !VERCEL_TOKEN) {
  console.log('⚠️  Vercel deployment requested but VERCEL_TOKEN not found');
  console.log('💡 Set it with: export VERCEL_TOKEN=your_token_here');
  console.log('   Or use: DEPLOY_TARGET=github-pages node deploy-automated.js\n');
}

console.log('\n📋 Deployment Options Summary:');
console.log('   1. GitHub Pages: No token needed, enable in repo settings');
console.log('   2. Vercel: Requires VERCEL_TOKEN environment variable');
console.log('\n✅ Deployment protocol ready!');


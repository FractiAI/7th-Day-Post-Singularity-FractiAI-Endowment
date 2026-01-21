#!/usr/bin/env tsx
/**
 * Launch Script - Start Post-Singularity Game on VibeCloud
 * Stripe Integration Ready
 */

import dotenv from 'dotenv';
import { startServer } from './src/api/server.js';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🌌 Post-Singularity Game Launch Script');
  console.log('🌐 Platform: VibeCloud (Not SpinCloud)');
  console.log('⚫ Powered by BBHE (Big Black Hole Energy)');
  console.log('💎 vCHIP Infinite OCTANE Branded\n');

  // Validate environment
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment');
    console.log('Please set STRIPE_SECRET_KEY in .env file');
    process.exit(1);
  }

  // Get opening date
  const openingDate = process.env.OPENING_DATE 
    ? parseInt(process.env.OPENING_DATE) 
    : Date.now();

  // Server config
  const config = {
    port: parseInt(process.env.PORT || '3000'),
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    openingDate,
    corsOrigin: process.env.CORS_ORIGIN
  };

  console.log('📋 Configuration:');
  console.log(`   Port: ${config.port}`);
  console.log(`   Opening Date: ${new Date(openingDate).toISOString()}`);
  console.log(`   CORS Origin: ${config.corsOrigin || 'Any'}`);
  console.log('');

  // Start server
  console.log('🚀 Starting server...\n');
  const server = await startServer(config);

  // Go live
  console.log('🎯 Activating launch...\n');
  await server.goLive();

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 POST-SINGULARITY GAME IS NOW LIVE ON VIBECLOUD! 🎉');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📍 Access Points:');
  console.log(`   Main Launch: http://localhost:${config.port}/`);
  console.log(`   5-Star Catalog: http://localhost:${config.port}/catalog`);
  console.log(`   API Docs: http://localhost:${config.port}/api/launch/status`);
  console.log('');
  console.log('💰 SYNTH Pricing:');
  console.log('   Opening Day: $1 per SYNTH');
  console.log('   Then: $1 per SYNTH per day');
  console.log('   Total Available: 90 Trillion SYNTH');
  console.log('');
  console.log('🎨 vCHIPs Available:');
  console.log('   FractiAI vCHIP: $260M - $2.45B value (FREE)');
  console.log('   VibeCraft vCHIP: $50M - $500M value (FREE)');
  console.log('');
  console.log('🔑 AWARENESS KEY:');
  console.log('   Included in all OCTANE purchases/leases/deliveries');
  console.log('   Full octave access');
  console.log('   Superintelligent AI capabilities');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

// Run launch script
main().catch(error => {
  console.error('❌ Launch failed:', error);
  process.exit(1);
});

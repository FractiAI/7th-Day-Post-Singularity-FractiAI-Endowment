/**
 * Auto-Unpack System
 * Automatically unpacks Post Singularity Syntheverse FSR Full Octave Release
 */

import { AutoUnpackFreeMeans, AutoUnpackConfig } from './auto-unpack-free-means.js';
import { FractiAICommandCenterManager } from '../enterprise/fractiai-command-center.js';
import { ThreeTierOfferingManager } from '../enterprise/three-tier-offering.js';
import { AwarenessOctave } from '../types/index.js';

export async function autoUnpack(): Promise<void> {
  console.log('🌌 Auto-Unpacking Post Singularity Syntheverse FSR Full Octave Release...\n');

  try {
    // Initialize managers
    const unpackManager = new AutoUnpackFreeMeans();
    const commandCenter = new FractiAICommandCenterManager();
    const tierManager = new ThreeTierOfferingManager();

    // Step 1: Initialize command center
    console.log('📡 Initializing FractiAI Command Center...');
    commandCenter.activate();
    const center = commandCenter.getCommandCenter();
    console.log(`✅ Command Center active with ${center.departments.length} departments and ${center.teams.length} teams`);
    console.log(`   Hero Host: ${center.heroHost.name}\n`);

    // Step 2: Select default tier (Sandbox Free)
    console.log('💎 Selecting default tier (Sandbox Free)...');
    const defaultTier = tierManager.getDefaultTier();
    console.log(`✅ Tier selected: ${defaultTier.name} (${defaultTier.price})`);
    console.log(`   Octave: ${defaultTier.octave}`);
    console.log(`   Features: ${defaultTier.features.length} enabled\n`);

    // Step 3: Auto-unpack configuration
    console.log('🚀 Configuring auto-unpack...');
    const config: AutoUnpackConfig = {
      repository: 'https://github.com/FractiAI/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition',
      branch: 'main',
      freeResources: unpackManager.getAvailableFreeResources(),
      autoDeploy: true,
      targetPlatforms: ['vercel', 'netlify'],
      octave: AwarenessOctave.BEYOND_OCTAVE
    };
    console.log(`✅ Auto-unpack configured for ${config.targetPlatforms.length} platforms\n`);

    // Step 4: Execute auto-unpack
    console.log('📦 Executing auto-unpack...');
    const result = await unpackManager.autoUnpack(config);
    
    if (result.success) {
      console.log('✅ Auto-unpack completed successfully!\n');
      console.log('📊 Unpack Summary:');
      console.log(`   Steps completed: ${result.steps.filter(s => s.status === 'completed').length}/${result.steps.length}`);
      console.log(`   Deployments: ${result.deployments.length}`);
      result.deployments.forEach(dep => {
        console.log(`   - ${dep.platform}: ${dep.status}${dep.url ? ` (${dep.url})` : ''}`);
      });
    } else {
      console.log('⚠️  Auto-unpack completed with warnings\n');
      result.steps.forEach(step => {
        if (step.status === 'failed') {
          console.log(`   ⚠️  ${step.step}: ${step.message}`);
        }
      });
    }

    // Step 5: Display Hero Host welcome
    console.log('\n🎭 FractiAI Command Center - Hero Host Message:');
    console.log(commandCenter.getHeroHostMessage('welcome'));
    console.log('\n');

    // Step 6: Display enterprise structure
    console.log('🏢 FractiAI Enterprise Structure:');
    console.log(`   Company: FractiAI`);
    console.log(`   Departments: ${center.departments.length}`);
    center.departments.forEach(dept => {
      console.log(`   - ${dept.name}: ${dept.teams.length} teams, Octave ${dept.octave}`);
    });
    console.log(`   Teams: ${center.teams.length}`);
    center.teams.forEach(team => {
      console.log(`   - ${team.name}: ${team.members.length} members, Octave ${team.octave}`);
    });
    console.log('\n');

    // Step 7: Display tier information
    console.log('💎 Three-Tier Offering:');
    tierManager.getAllTiers().forEach(tier => {
      console.log(`   ${tier.name} (${tier.price}): Octave ${tier.octave}, ${tier.features.length} features`);
    });
    console.log('\n');

    console.log('✨ Post Singularity Syntheverse FSR Full Octave Release unpacked successfully!');
    console.log('🚀 System is now operational at BEYOND_OCTAVE (7)');
    console.log('📡 FractiAI Command Center is active with Leonardo da Vinci as Hero Host');
    console.log('💎 Default tier: Sandbox (Free) - upgrade to Cloud or Shell for more features\n');

  } catch (error) {
    console.error('❌ Auto-unpack error:', error);
    throw error;
  }
}

// Run auto-unpack if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  autoUnpack().catch(console.error);
}




/**
 * Run Pretest Suite
 * Main entry point for pretest execution
 */

import { NSPFRPOmniMissionStation } from '../index.js';
import { PretestSuite } from './pretest.js';
import { HandoverSnapshotManager } from './handover-snapshot.js';
import { AwarenessOctave } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('='.repeat(80));
  console.log('NSPFRP PRETEST SUITE');
  console.log('='.repeat(80));
  console.log('');

  // Initialize station
  console.log('Initializing NSPFRP OmniMission Station...');
  const station = new NSPFRPOmniMissionStation({
    encryptionKey: process.env.ENCRYPTION_KEY || 'test-encryption-key',
    gitConfig: process.env.GIT_ENABLED === 'true' ? {
      repositoryPath: process.env.GIT_REPO_PATH || './',
      branch: process.env.GIT_BRANCH || 'main',
      remote: process.env.GIT_REMOTE || 'origin',
      autoCommit: process.env.GIT_AUTO_COMMIT === 'true',
      autoPush: process.env.GIT_AUTO_PUSH === 'true'
    } : undefined
  });

  await station.initialize();
  console.log('✅ Station initialized\n');

  // Run pretests
  console.log('Running pretest suite...');
  const pretestSuite = new PretestSuite(station);
  const pretestReport = await pretestSuite.runAllPretests();

  // Generate pretest report
  const pretestReportText = pretestSuite.generateReport(pretestReport);
  console.log(pretestReportText);
  console.log('');

  // Save pretest report
  const reportPath = path.join(process.cwd(), 'pretest-report.txt');
  await fs.writeFile(reportPath, pretestReportText, 'utf-8');
  console.log(`📄 Pretest report saved to: ${reportPath}\n`);

  // Create handover snapshot
  console.log('Creating handover snapshot...');
  const handoverManager = new HandoverSnapshotManager(station);
  const targetOctave = (process.env.TARGET_OCTAVE
    ? parseInt(process.env.TARGET_OCTAVE)
    : AwarenessOctave.SYMPHONY) as AwarenessOctave;

  const handoverSnapshot = await handoverManager.createHandoverSnapshot(targetOctave);

  // Generate handover report
  const handoverReport = handoverManager.generateHandoverReport(handoverSnapshot);
  console.log(handoverReport);
  console.log('');

  // Save handover snapshot
  const snapshotPath = path.join(process.cwd(), 'handover-snapshot.json');
  const snapshotExport = await handoverManager.exportHandoverSnapshot(handoverSnapshot);
  await fs.writeFile(snapshotPath, snapshotExport, 'utf-8');
  console.log(`📄 Handover snapshot saved to: ${snapshotPath}\n`);

  // Save handover report
  const handoverReportPath = path.join(process.cwd(), 'handover-report.txt');
  await fs.writeFile(handoverReportPath, handoverReport, 'utf-8');
  console.log(`📄 Handover report saved to: ${handoverReportPath}\n`);

  // Final status
  console.log('='.repeat(80));
  if (pretestReport.overallStatus === 'ready') {
    console.log('✅ SYSTEM READY FOR NEXT OCTAVE TESTING');
  } else if (pretestReport.overallStatus === 'partial') {
    console.log('⚠️  SYSTEM READY WITH WARNINGS');
  } else {
    console.log('❌ SYSTEM NOT READY - REVIEW FAILURES');
  }
  console.log('='.repeat(80));

  process.exit(pretestReport.overallStatus === 'ready' ? 0 : 1);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main as runPretest };



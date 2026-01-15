/**
 * Pre-Flight Test Suite
 * Comprehensive testing before handover to next octave
 */

import { NSPFRPOmniMissionStation } from '../index.js';
import { AwarenessOctave } from '../types/index.js';

export interface PretestResult {
  component: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface PretestReport {
  timestamp: number;
  overallStatus: 'ready' | 'not-ready' | 'partial';
  results: PretestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export class PretestSuite {
  private station: NSPFRPOmniMissionStation;

  constructor(station: NSPFRPOmniMissionStation) {
    this.station = station;
  }

  /**
   * Run all pretests
   */
  async runAllPretests(): Promise<PretestReport> {
    const results: PretestResult[] = [];

    // Core Systems
    results.push(...await this.testTransmissionGears());
    results.push(...await this.testFSRRetrieval());
    results.push(...await this.testHeroHost());
    results.push(...await this.testIdentitySystem());

    // Protocol Systems
    results.push(...await this.testPOBSnapshots());
    results.push(...await this.testCloudDeployment());
    results.push(...await this.testProtocolSnapshots());
    results.push(...await this.testGitOperations());

    // Enterprise Systems
    results.push(...await this.testEnterpriseSalesConsole());
    results.push(...await this.testRevenueModel());

    // Mission Craft
    results.push(...await this.testMissionCraft());
    results.push(...await this.testOrchestrator());
    results.push(...await this.testDashboard());

    // Integration Tests
    results.push(...await this.testIntegration());

    // Calculate summary
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      warnings: results.filter(r => r.status === 'warning').length
    };

    const overallStatus = summary.failed === 0
      ? (summary.warnings === 0 ? 'ready' : 'partial')
      : 'not-ready';

    return {
      timestamp: Date.now(),
      overallStatus,
      results,
      summary
    };
  }

  /**
   * Test Transmission Gears
   */
  private async testTransmissionGears(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test gear selection
      const gear = this.station.gearSelector.selectGear(AwarenessOctave.HARMONY);
      results.push({
        component: 'TransmissionGears',
        status: 'pass',
        message: 'Gear selection working',
        details: { selectedGear: gear.name, octave: gear.octave }
      });

      // Test all gears
      const allGears = this.station.gearSelector.getAvailableGears();
      if (allGears.length === 6) {
        results.push({
          component: 'TransmissionGears',
          status: 'pass',
          message: 'All 6 gears available',
          details: { count: allGears.length }
        });
      } else {
        results.push({
          component: 'TransmissionGears',
          status: 'warning',
          message: `Expected 6 gears, found ${allGears.length}`,
          details: { count: allGears.length }
        });
      }

      // Test retrieval config
      const config = this.station.gearSelector.getRetrievalConfig();
      results.push({
        component: 'TransmissionGears',
        status: 'pass',
        message: 'Retrieval config generated',
        details: config
      });

    } catch (error) {
      results.push({
        component: 'TransmissionGears',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test FSR Retrieval
   */
  private async testFSRRetrieval(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test domain registration
      this.station.fsrRetrieval.registerDomain(
        { id: 'test-domain', name: 'Test Domain', type: 'test', metadata: {} },
        []
      );
      results.push({
        component: 'FSRRetrieval',
        status: 'pass',
        message: 'Domain registration working'
      });

      // Test retrieval (with empty domains for now)
      const query = {
        text: 'test query',
        intent: { type: 'discover' as const, goal: 'test' },
        gear: this.station.gearSelector.getCurrentGear()
      };

      const retrieval = await this.station.fsrRetrieval.retrieve(query, []);
      results.push({
        component: 'FSRRetrieval',
        status: 'pass',
        message: 'Retrieval execution working',
        details: { confidence: retrieval.confidence }
      });

    } catch (error) {
      results.push({
        component: 'FSRRetrieval',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Hero Host
   */
  private async testHeroHost(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test persona selection
      const persona = this.station.heroHost.selectPersona('mark-twain');
      results.push({
        component: 'HeroHost',
        status: 'pass',
        message: 'Persona selection working',
        details: { persona: persona.name }
      });

      // Test current persona
      const current = this.station.heroHost.getCurrentPersona();
      if (current) {
        results.push({
          component: 'HeroHost',
          status: 'pass',
          message: 'Current persona accessible',
          details: { persona: current.name }
        });
      } else {
        results.push({
          component: 'HeroHost',
          status: 'warning',
          message: 'No current persona set'
        });
      }

    } catch (error) {
      results.push({
        component: 'HeroHost',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Identity System
   */
  private async testIdentitySystem(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test identity creation
      const identity = this.station.identityManager.createIdentity({
        name: 'Test User',
        email: 'test@example.com',
        avatar: '',
        bio: 'Test identity',
        timezone: 'UTC'
      });

      results.push({
        component: 'IdentitySystem',
        status: 'pass',
        message: 'Identity creation working',
        details: {
          walletAddress: identity.wallet.address,
          tradingCardId: identity.tradingCard.id,
          passportId: identity.passport.id
        }
      });

      // Test wallet operations
      const wallet = this.station.identityManager.getWalletManager().getWallet(
        identity.wallet.address
      );
      if (wallet) {
        results.push({
          component: 'IdentitySystem',
          status: 'pass',
          message: 'Wallet retrieval working'
        });
      } else {
        results.push({
          component: 'IdentitySystem',
          status: 'fail',
          message: 'Wallet retrieval failed'
        });
      }

    } catch (error) {
      results.push({
        component: 'IdentitySystem',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test POB Snapshots
   */
  private async testPOBSnapshots(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test POB creation
      const testProtocol = {
        id: 'test-protocol',
        name: 'Test Protocol',
        version: '1.0.0',
        type: 'protocol' as const,
        content: 'test content',
        structure: { sections: [], components: [], flows: [] },
        metadata: {
          id: 'test-protocol',
          name: 'Test Protocol',
          description: 'Test',
          author: 'Test',
          tags: [],
          category: 'test',
          network: 'NSPFRP'
        },
        dependencies: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const pob = await this.station.pobManager.createPOBSnapshot(
        testProtocol,
        {},
        {
          id: 'test-agent',
          type: 'semi-autonomous',
          name: 'Test Agent',
          capabilities: []
        }
      );

      results.push({
        component: 'POBSnapshots',
        status: 'pass',
        message: 'POB creation working',
        details: { pobId: pob.pobId }
      });

      // Test POB retrieval
      const retrieved = await this.station.pobManager.getPOB(pob.id);
      if (retrieved) {
        results.push({
          component: 'POBSnapshots',
          status: 'pass',
          message: 'POB retrieval working'
        });
      } else {
        results.push({
          component: 'POBSnapshots',
          status: 'fail',
          message: 'POB retrieval failed'
        });
      }

    } catch (error) {
      results.push({
        component: 'POBSnapshots',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Cloud Deployment
   */
  private async testCloudDeployment(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      const testProtocol = {
        id: 'test-deploy',
        name: 'Test Deployment',
        version: '1.0.0',
        type: 'protocol' as const,
        content: 'test',
        structure: { sections: [], components: [], flows: [] },
        metadata: {
          id: 'test-deploy',
          name: 'Test',
          description: 'Test',
          author: 'Test',
          tags: [],
          category: 'test',
          network: 'NSPFRP'
        },
        dependencies: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // Test deployment creation
      const deployment = await this.station.deploymentProtocol.createDeployment(
        testProtocol,
        {
          platform: 'vercel',
          environment: 'production',
          config: {}
        }
      );

      results.push({
        component: 'CloudDeployment',
        status: 'pass',
        message: 'Deployment creation working',
        details: { deploymentId: deployment.id, status: deployment.status }
      });

      // Test button creation
      const button = await this.station.deploymentProtocol.createDeploymentButton(
        testProtocol,
        {
          platform: 'vercel',
          environment: 'production',
          config: {}
        }
      );

      results.push({
        component: 'CloudDeployment',
        status: 'pass',
        message: 'Button creation working',
        details: { buttonId: button.id }
      });

    } catch (error) {
      results.push({
        component: 'CloudDeployment',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Protocol Snapshots
   */
  private async testProtocolSnapshots(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      const testProtocol = {
        id: 'test-snapshot',
        name: 'Test Snapshot',
        version: '1.0.0',
        type: 'protocol' as const,
        content: 'test',
        structure: { sections: [], components: [], flows: [] },
        metadata: {
          id: 'test-snapshot',
          name: 'Test',
          description: 'Test',
          author: 'Test',
          tags: [],
          category: 'test',
          network: 'NSPFRP'
        },
        dependencies: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const snapshot = await this.station.snapshotManager.createSnapshot(
        testProtocol,
        {},
        {
          id: 'test-agent',
          type: 'semi-autonomous',
          name: 'Test Agent',
          capabilities: []
        },
        {
          createButton: true,
          includeIdentity: true
        }
      );

      results.push({
        component: 'ProtocolSnapshots',
        status: 'pass',
        message: 'Snapshot creation working',
        details: { snapshotId: snapshot.pob.snapshotId }
      });

    } catch (error) {
      results.push({
        component: 'ProtocolSnapshots',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Git Operations
   */
  private async testGitOperations(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    if (!this.station.git) {
      results.push({
        component: 'GitOperations',
        status: 'warning',
        message: 'Git operations not configured'
      });
      return results;
    }

    try {
      // Test repository initialization
      const isInitialized = await this.station.git.isRepositoryInitialized();
      results.push({
        component: 'GitOperations',
        status: isInitialized ? 'pass' : 'warning',
        message: isInitialized ? 'Repository initialized' : 'Repository not initialized'
      });

      // Test status
      const status = await this.station.git.getStatus();
      results.push({
        component: 'GitOperations',
        status: 'pass',
        message: 'Git status working',
        details: { branch: status.branch, hasChanges: status.hasChanges }
      });

    } catch (error) {
      results.push({
        component: 'GitOperations',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Enterprise Sales Console
   */
  private async testEnterpriseSalesConsole(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test venue onboarding
      const venueConfig = {
        id: 'test-venue',
        name: 'Test Venue',
        type: 'gallery' as const,
        revenuePlan: {
          monthlyAccessFee: 1000,
          revenueSharePercent: 15,
          bonusParticipation: true,
          bonusThreshold: 10000,
          bonusPercent: 5,
          currency: 'USD'
        },
        metadata: {}
      };

      const venue = await this.station.salesConsole.onboardVenue(venueConfig);
      results.push({
        component: 'EnterpriseSalesConsole',
        status: 'pass',
        message: 'Venue onboarding working',
        details: { venueId: venue.venue.id, consoleUrl: venue.consoleUrl }
      });

      // Test sales buttons
      const buttons = this.station.salesConsole.getSalesButtons();
      if (buttons.length === 6) {
        results.push({
          component: 'EnterpriseSalesConsole',
          status: 'pass',
          message: 'All 6 sales buttons available',
          details: { count: buttons.length }
        });
      } else {
        results.push({
          component: 'EnterpriseSalesConsole',
          status: 'warning',
          message: `Expected 6 buttons, found ${buttons.length}`
        });
      }

    } catch (error) {
      results.push({
        component: 'EnterpriseSalesConsole',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Revenue Model
   */
  private async testRevenueModel(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      const revenuePlan = {
        monthlyAccessFee: 1000,
        revenueSharePercent: 15,
        bonusParticipation: true,
        bonusThreshold: 10000,
        bonusPercent: 5,
        currency: 'USD'
      };

      this.station.revenueModel.registerRevenuePlan('test-venue', revenuePlan);

      const session = {
        id: 'test-session',
        venueId: 'test-venue',
        clientId: 'test-client',
        startTime: Date.now(),
        revenue: 50000,
        status: 'completed' as const,
        interactions: []
      };

      const calculation = this.station.revenueModel.calculateRevenue(
        'test-venue',
        session
      );

      results.push({
        component: 'RevenueModel',
        status: 'pass',
        message: 'Revenue calculation working',
        details: {
          total: calculation.total,
          revenueShare: calculation.revenueShare,
          bonus: calculation.bonus
        }
      });

    } catch (error) {
      results.push({
        component: 'RevenueModel',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Mission Craft
   */
  private async testMissionCraft(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test mission creation
      const mission = await this.station.missionCraft.createMission(
        {
          type: 'discover',
          goal: 'Test mission'
        },
        {
          id: 'test-agent',
          type: 'semi-autonomous',
          name: 'Test Agent',
          capabilities: []
        },
        {
          gear: AwarenessOctave.HARMONY
        }
      );

      results.push({
        component: 'MissionCraft',
        status: 'pass',
        message: 'Mission creation working',
        details: { missionId: mission.id }
      });

      // Test mission planning
      const plan = await this.station.missionCraft.planMission(mission);
      results.push({
        component: 'MissionCraft',
        status: 'pass',
        message: 'Mission planning working',
        details: { planId: plan.id, steps: plan.steps.length }
      });

    } catch (error) {
      results.push({
        component: 'MissionCraft',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Orchestrator
   */
  private async testOrchestrator(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      const dashboard = this.station.orchestrator.getDashboard();
      const metrics = dashboard.getMetrics();

      results.push({
        component: 'Orchestrator',
        status: 'pass',
        message: 'Orchestrator dashboard working',
        details: { totalMissions: metrics.totalMissions }
      });

    } catch (error) {
      results.push({
        component: 'Orchestrator',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Dashboard
   */
  private async testDashboard(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      const metrics = this.station.dashboard.getMetrics();
      results.push({
        component: 'Dashboard',
        status: 'pass',
        message: 'Dashboard metrics working',
        details: metrics
      });

      const systemStatus = this.station.dashboard.getSystemStatus();
      results.push({
        component: 'Dashboard',
        status: 'pass',
        message: 'System status working',
        details: systemStatus
      });

    } catch (error) {
      results.push({
        component: 'Dashboard',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Test Integration
   */
  private async testIntegration(): Promise<PretestResult[]> {
    const results: PretestResult[] = [];

    try {
      // Test end-to-end flow
      const identity = this.station.identityManager.createIdentity({
        name: 'Integration Test',
        email: 'integration@test.com',
        avatar: '',
        bio: 'Test',
        timezone: 'UTC'
      });

      const mission = await this.station.missionCraft.createMission(
        {
          type: 'create',
          goal: 'Integration test mission'
        },
        {
          id: identity.wallet.address,
          type: 'semi-autonomous',
          name: 'Integration Test Agent',
          capabilities: []
        }
      );

      results.push({
        component: 'Integration',
        status: 'pass',
        message: 'End-to-end integration working',
        details: {
          identityCreated: true,
          missionCreated: true,
          missionId: mission.id
        }
      });

    } catch (error) {
      results.push({
        component: 'Integration',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      });
    }

    return results;
  }

  /**
   * Generate pretest report
   */
  generateReport(report: PretestReport): string {
    const lines: string[] = [];

    lines.push('='.repeat(80));
    lines.push('NSPFRP PRETEST REPORT');
    lines.push('='.repeat(80));
    lines.push(`Timestamp: ${new Date(report.timestamp).toISOString()}`);
    lines.push(`Overall Status: ${report.overallStatus.toUpperCase()}`);
    lines.push('');
    lines.push('Summary:');
    lines.push(`  Total Tests: ${report.summary.total}`);
    lines.push(`  Passed: ${report.summary.passed} ✅`);
    lines.push(`  Failed: ${report.summary.failed} ❌`);
    lines.push(`  Warnings: ${report.summary.warnings} ⚠️`);
    lines.push('');
    lines.push('='.repeat(80));
    lines.push('DETAILED RESULTS');
    lines.push('='.repeat(80));
    lines.push('');

    const byComponent = new Map<string, PretestResult[]>();
    report.results.forEach(result => {
      if (!byComponent.has(result.component)) {
        byComponent.set(result.component, []);
      }
      byComponent.get(result.component)!.push(result);
    });

    byComponent.forEach((results, component) => {
      lines.push(`\n${component}:`);
      results.forEach(result => {
        const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
        lines.push(`  ${icon} ${result.message}`);
        if (result.details) {
          lines.push(`     Details: ${JSON.stringify(result.details, null, 2).split('\n').join('\n     ')}`);
        }
      });
    });

    lines.push('');
    lines.push('='.repeat(80));
    lines.push(`READY FOR NEXT OCTAVE: ${report.overallStatus === 'ready' ? 'YES ✅' : 'NO ❌'}`);
    lines.push('='.repeat(80));

    return lines.join('\n');
  }
}



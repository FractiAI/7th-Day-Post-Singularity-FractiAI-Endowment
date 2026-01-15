/**
 * Vibeverse Enterprise Sales Console
 * NSPFRP-integrated sales console for venue nodes
 */

import {
  Protocol,
  HeroHostPersona,
  TransmissionGear,
  AwarenessOctave,
  SnapshotContext,
  AgentIdentity
} from '../types/index.js';
import { HeroHostOrchestrator } from '../core/hero-host.js';
import { TransmissionGearSelector } from '../core/transmission-gears.js';
import { FSRRetrievalEngine } from '../core/fsr-retrieval.js';
import { ProtocolSnapshotManager } from '../protocols/protocol-snapshot.js';
import { CloudDeploymentProtocol } from '../protocols/cloud-deploy.js';
import { GitOperations } from '../git/git-operations.js';
import { SeedWithIdentityManager } from '../seeds/seed-with-identity.js';

export interface VenueConfig {
  id: string;
  name: string;
  type: 'gallery' | 'museum' | 'theater' | 'venue' | 'custom';
  heroHostPersona?: string; // 'cleve-canepa' | 'venue-persona' | custom
  transmissionGear?: AwarenessOctave;
  revenuePlan: RevenuePlan;
  metadata: Record<string, any>;
}

export interface RevenuePlan {
  monthlyAccessFee: number;
  revenueSharePercent: number;
  bonusParticipation: boolean;
  bonusThreshold?: number;
  bonusPercent?: number;
  currency: string;
}

export interface SalesButton {
  id: string;
  type: 'mine' | 'cultivate' | 'pitch' | 'gitseed' | 'snap' | 'makeasprotocol';
  label: string;
  action: string;
  config: Record<string, any>;
}

export interface VIPSession {
  id: string;
  venueId: string;
  clientId: string;
  startTime: number;
  endTime?: number;
  interactions: VIPInteraction[];
  revenue: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface VIPInteraction {
  id: string;
  type: string;
  content: any;
  timestamp: number;
  revenue?: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSessions: number;
  completedSessions: number;
  averageSessionValue: number;
  topClients: Array<{ clientId: string; revenue: number }>;
}

export class EnterpriseSalesConsole {
  private venues: Map<string, VenueConfig>;
  private salesButtons: Map<string, SalesButton>;
  private vipSessions: Map<string, VIPSession>;
  private heroHost: HeroHostOrchestrator;
  private gearSelector: TransmissionGearSelector;
  private fsrRetrieval: FSRRetrievalEngine;
  private snapshotManager: ProtocolSnapshotManager;
  private deploymentProtocol: CloudDeploymentProtocol;
  private git?: GitOperations;
  private seedManager: SeedWithIdentityManager;

  constructor(
    heroHost: HeroHostOrchestrator,
    gearSelector: TransmissionGearSelector,
    fsrRetrieval: FSRRetrievalEngine,
    snapshotManager: ProtocolSnapshotManager,
    deploymentProtocol: CloudDeploymentProtocol,
    seedManager: SeedWithIdentityManager,
    git?: GitOperations
  ) {
    this.venues = new Map();
    this.salesButtons = new Map();
    this.vipSessions = new Map();
    this.heroHost = heroHost;
    this.gearSelector = gearSelector;
    this.fsrRetrieval = fsrRetrieval;
    this.snapshotManager = snapshotManager;
    this.deploymentProtocol = deploymentProtocol;
    this.seedManager = seedManager;
    this.git = git;

    this.initializeSalesButtons();
  }

  /**
   * Initialize sales buttons
   */
  private initializeSalesButtons(): void {
    // Mine Button - Discover and extract opportunities
    this.salesButtons.set('mine', {
      id: 'mine',
      type: 'mine',
      label: 'Mine',
      action: 'discover-opportunities',
      config: {
        fsrEnabled: true,
        transmissionGear: AwarenessOctave.RESONANCE
      }
    });

    // Cultivate Button - Nurture relationships
    this.salesButtons.set('cultivate', {
      id: 'cultivate',
      type: 'cultivate',
      label: 'Cultivate',
      action: 'nurture-relationships',
      config: {
        heroHostEnabled: true,
        personalized: true
      }
    });

    // Pitch Button - Present offerings
    this.salesButtons.set('pitch', {
      id: 'pitch',
      type: 'pitch',
      label: 'Pitch',
      action: 'present-offering',
      config: {
        presentationMode: true,
        interactive: true
      }
    });

    // GitSeed Button - Deploy repository
    this.salesButtons.set('gitseed', {
      id: 'gitseed',
      type: 'gitseed',
      label: 'GitSeed',
      action: 'deploy-repository',
      config: {
        autoCommit: true,
        autoPush: true
      }
    });

    // Snap Button - Log session
    this.salesButtons.set('snap', {
      id: 'snap',
      type: 'snap',
      label: 'Snap',
      action: 'log-session',
      config: {
        encrypted: true,
        includeRevenue: true
      }
    });

    // MakeAsProtocol Button - Create spin-off
    this.salesButtons.set('makeasprotocol', {
      id: 'makeasprotocol',
      type: 'makeasprotocol',
      label: 'MakeAsProtocol',
      action: 'create-spinoff',
      config: {
        includeRevenueModel: true,
        autoDeploy: true
      }
    });
  }

  /**
   * Onboard venue
   */
  async onboardVenue(config: VenueConfig): Promise<{
    venue: VenueConfig;
    consoleUrl: string;
    repositoryUrl?: string;
  }> {
    // Store venue config
    this.venues.set(config.id, config);

    // Configure Hero Host persona
    if (config.heroHostPersona) {
      if (config.heroHostPersona === 'cleve-canepa') {
        await this.setupCleveCanepaPersona();
      } else {
        this.heroHost.selectPersona(config.heroHostPersona);
      }
    }

    // Set transmission gear
    if (config.transmissionGear !== undefined) {
      this.gearSelector.selectGear(config.transmissionGear);
    }

    // Create GitSeed repository
    let repositoryUrl: string | undefined;
    if (this.git) {
      repositoryUrl = await this.createGitSeedRepository(config);
    }

    // Deploy console
    const consoleUrl = await this.deployConsole(config);

    return {
      venue: config,
      consoleUrl,
      repositoryUrl
    };
  }

  /**
   * Setup Cleve Canepa persona
   */
  private async setupCleveCanepaPersona(): Promise<void> {
    // Create Cleve Canepa persona if it doesn't exist
    const clevePersona: HeroHostPersona = {
      id: 'cleve-canepa',
      name: 'Cleve Canepa',
      description: 'Automotive art curator, collector, and gallery owner',
      traits: [
        { name: 'expertise', intensity: 1.0, influence: 'high' },
        { name: 'curation', intensity: 0.95, influence: 'high' },
        { name: 'automotive-art', intensity: 1.0, influence: 'high' },
        { name: 'collector', intensity: 0.9, influence: 'high' }
      ],
      communicationStyle: {
        tone: 'professional',
        verbosity: 'moderate',
        metaphors: true,
        examples: true
      },
      expertise: [
        { domain: 'automotive-art', proficiency: 1.0 },
        { domain: 'curation', proficiency: 1.0 },
        { domain: 'collecting', proficiency: 0.95 },
        { domain: 'gallery-management', proficiency: 0.9 }
      ]
    };

    // Register persona (would need to extend HeroHostOrchestrator)
    this.heroHost.selectPersona('cleve-canepa');
  }

  /**
   * Create GitSeed repository for venue
   */
  private async createGitSeedRepository(venue: VenueConfig): Promise<string> {
    if (!this.git) {
      throw new Error('Git operations not configured');
    }

    // Initialize repository
    await this.git.initializeRepository();

    // Create venue-specific structure
    const venueDir = `venues/${venue.id}`;
    const files = [
      `${venueDir}/venue-config.json`,
      `${venueDir}/revenue-plan.json`,
      `${venueDir}/hero-host-config.json`,
      `${venueDir}/fsr-config.json`,
      `${venueDir}/seed-synthesizer-config.json`
    ];

    // Create config files
    const configs = {
      venue: venue,
      revenuePlan: venue.revenuePlan,
      heroHost: {
        persona: venue.heroHostPersona || 'venue-persona',
        config: {}
      },
      fsr: {
        transmissionGear: venue.transmissionGear || AwarenessOctave.HARMONY,
        config: {}
      },
      seedSynthesizer: {
        enabled: true,
        autoSnap: true,
        makeAsProtocol: true
      }
    };

    // Write files (would need fs operations)
    // For now, commit the structure
    const commitMessage = `GitSeed: Enterprise Sales Console for ${venue.name}\n\n` +
      `Venue ID: ${venue.id}\n` +
      `Type: ${venue.type}\n` +
      `Hero Host: ${venue.heroHostPersona || 'venue-persona'}\n` +
      `Transmission Gear: ${venue.transmissionGear || AwarenessOctave.HARMONY}\n` +
      `Revenue Model: $${venue.revenuePlan.monthlyAccessFee}/month + ${venue.revenuePlan.revenueSharePercent}% revenue share`;

    await this.git.commit(commitMessage);
    
    if (this.git.config.autoPush) {
      await this.git.push();
    }

    return `https://github.com/${venue.id}/enterprise-sales-console`;
  }

  /**
   * Deploy console
   */
  private async deployConsole(venue: VenueConfig): Promise<string> {
    // Create console protocol
    const consoleProtocol = await this.createConsoleProtocol(venue);

    // Deploy
    const deployment = await this.deploymentProtocol.createDeployment(
      consoleProtocol,
      {
        platform: 'vercel',
        environment: 'production',
        config: {
          framework: 'nextjs',
          buildCommand: 'npm run build',
          env: {
            VENUE_ID: venue.id,
            VENUE_NAME: venue.name
          }
        }
      }
    );

    return deployment.url || `https://${venue.id}.vercel.app`;
  }

  /**
   * Create console protocol
   */
  private async createConsoleProtocol(venue: VenueConfig): Promise<Protocol> {
    return {
      id: `console-${venue.id}`,
      name: `${venue.name} Enterprise Sales Console`,
      version: '1.0.0',
      type: 'integration',
      content: JSON.stringify({
        venue: venue,
        salesButtons: Array.from(this.salesButtons.values()),
        revenuePlan: venue.revenuePlan
      }),
      structure: {
        sections: [],
        components: [],
        flows: []
      },
      metadata: {
        id: `console-${venue.id}`,
        name: `${venue.name} Enterprise Sales Console`,
        description: `Enterprise Sales Console for ${venue.name}`,
        author: 'NSPFRP OmniMission Station',
        tags: ['enterprise', 'sales', 'console', venue.type],
        category: 'enterprise-sales',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Execute sales button action
   */
  async executeSalesButton(
    buttonId: string,
    venueId: string,
    context?: Record<string, any>
  ): Promise<any> {
    const button = this.salesButtons.get(buttonId);
    if (!button) {
      throw new Error(`Sales button not found: ${buttonId}`);
    }

    const venue = this.venues.get(venueId);
    if (!venue) {
      throw new Error(`Venue not found: ${venueId}`);
    }

    switch (button.type) {
      case 'mine':
        return await this.executeMine(venue, context);
      case 'cultivate':
        return await this.executeCultivate(venue, context);
      case 'pitch':
        return await this.executePitch(venue, context);
      case 'gitseed':
        return await this.executeGitSeed(venue, context);
      case 'snap':
        return await this.executeSnap(venue, context);
      case 'makeasprotocol':
        return await this.executeMakeAsProtocol(venue, context);
      default:
        throw new Error(`Unknown button type: ${button.type}`);
    }
  }

  /**
   * Execute Mine button
   */
  private async executeMine(venue: VenueConfig, context?: Record<string, any>): Promise<any> {
    // Set transmission gear for mining
    this.gearSelector.selectGear(
      venue.transmissionGear || AwarenessOctave.RESONANCE
    );

    // Perform FSR retrieval for opportunities
    const query = {
      text: context?.query || `Discover sales opportunities for ${venue.name}`,
      intent: {
        type: 'discover' as const,
        goal: 'Find sales opportunities'
      },
      gear: this.gearSelector.getCurrentGear()
    };

    const results = await this.fsrRetrieval.retrieve(query, []);

    return {
      type: 'mine',
      opportunities: results.suggestedConnections,
      confidence: results.confidence,
      timestamp: Date.now()
    };
  }

  /**
   * Execute Cultivate button
   */
  private async executeCultivate(venue: VenueConfig, context?: Record<string, any>): Promise<any> {
    // Use Hero Host for personalized cultivation
    const persona = this.heroHost.getCurrentPersona();
    if (!persona) {
      this.heroHost.selectPersona(venue.heroHostPersona || 'venue-persona');
    }

    // Generate cultivation strategy
    const strategy = await this.heroHost.assist({
      type: 'cultivate',
      context: {
        venue: venue,
        client: context?.client
      }
    } as any);

    return {
      type: 'cultivate',
      strategy,
      personalized: true,
      timestamp: Date.now()
    };
  }

  /**
   * Execute Pitch button
   */
  private async executePitch(venue: VenueConfig, context?: Record<string, any>): Promise<any> {
    // Create interactive pitch presentation
    const pitch = {
      venue: venue,
      offering: context?.offering || venue.metadata.offering,
      revenuePlan: venue.revenuePlan,
      interactive: true,
      presentationMode: true
    };

    return {
      type: 'pitch',
      pitch,
      timestamp: Date.now()
    };
  }

  /**
   * Execute GitSeed button
   */
  private async executeGitSeed(venue: VenueConfig, context?: Record<string, any>): Promise<any> {
    if (!this.git) {
      throw new Error('Git operations not configured');
    }

    // Create or update GitSeed repository
    const repositoryUrl = await this.createGitSeedRepository(venue);

    // Create snapshot
    const consoleProtocol = await this.createConsoleProtocol(venue);
    const snapshot = await this.snapshotManager.createSnapshot(
      consoleProtocol,
      {
        mission: {
          id: `gitseed-${venue.id}`,
          name: `GitSeed for ${venue.name}`,
          type: 'gitseed',
          goal: 'Deploy Enterprise Sales Console repository',
          status: 'completed',
          steps: [],
          createdAt: Date.now()
        } as any,
        gear: this.gearSelector.getCurrentGear(),
        heroHost: this.heroHost.getCurrentPersona() || undefined
      },
      {
        id: 'nspfrp-system',
        type: 'fully-autonomous',
        name: 'NSPFRP OmniMission Station',
        capabilities: []
      },
      {
        deploy: {
          platform: 'vercel',
          environment: 'production',
          config: {}
        },
        createButton: true,
        includeIdentity: true,
        includeEnvironment: true
      }
    );

    return {
      type: 'gitseed',
      repositoryUrl,
      snapshot,
      timestamp: Date.now()
    };
  }

  /**
   * Execute Snap button
   */
  private async executeSnap(venue: VenueConfig, context?: Record<string, any>): Promise<any> {
    // Log VIP session with encryption
    const session: VIPSession = {
      id: `session-${Date.now()}`,
      venueId: venue.id,
      clientId: context?.clientId || 'unknown',
      startTime: context?.startTime || Date.now(),
      interactions: context?.interactions || [],
      revenue: context?.revenue || 0,
      status: 'active'
    };

    this.vipSessions.set(session.id, session);

    // Create encrypted snap log
    const snapLog = {
      sessionId: session.id,
      venueId: venue.id,
      timestamp: Date.now(),
      encrypted: true,
      data: {
        interactions: session.interactions,
        revenue: session.revenue
      }
    };

    return {
      type: 'snap',
      sessionId: session.id,
      snapLog,
      timestamp: Date.now()
    };
  }

  /**
   * Execute MakeAsProtocol button
   */
  private async executeMakeAsProtocol(
    venue: VenueConfig,
    context?: Record<string, any>
  ): Promise<any> {
    // Create spin-off protocol
    const spinoffProtocol = await this.createSpinoffProtocol(venue, context);

    // Create snapshot with deployment
    const snapshot = await this.snapshotManager.createSnapshot(
      spinoffProtocol,
      {
        mission: {
          id: `makeasprotocol-${venue.id}`,
          name: `MakeAsProtocol for ${venue.name}`,
          type: 'create',
          goal: 'Create spin-off protocol',
          status: 'completed',
          steps: [],
          createdAt: Date.now()
        } as any,
        gear: this.gearSelector.getCurrentGear(),
        heroHost: this.heroHost.getCurrentPersona() || undefined
      },
      {
        id: 'nspfrp-system',
        type: 'fully-autonomous',
        name: 'NSPFRP OmniMission Station',
        capabilities: []
      },
      {
        deploy: {
          platform: 'vercel',
          environment: 'production',
          config: {}
        },
        createButton: true,
        includeRevenueModel: true,
        autoDeploy: true
      }
    );

    return {
      type: 'makeasprotocol',
      protocol: spinoffProtocol,
      snapshot,
      timestamp: Date.now()
    };
  }

  /**
   * Create spin-off protocol
   */
  private async createSpinoffProtocol(
    venue: VenueConfig,
    context?: Record<string, any>
  ): Promise<Protocol> {
    return {
      id: `spinoff-${venue.id}-${Date.now()}`,
      name: `${venue.name} Spin-off Protocol`,
      version: '1.0.0',
      type: 'protocol',
      content: JSON.stringify({
        venue: venue,
        revenuePlan: venue.revenuePlan,
        context: context
      }),
      structure: {
        sections: [],
        components: [],
        flows: []
      },
      metadata: {
        id: `spinoff-${venue.id}-${Date.now()}`,
        name: `${venue.name} Spin-off Protocol`,
        description: `Spin-off protocol for ${venue.name}`,
        author: 'NSPFRP OmniMission Station',
        tags: ['spinoff', 'venue', venue.type],
        category: 'venue-spinoff',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Get sales metrics
   */
  getSalesMetrics(venueId: string): SalesMetrics {
    const sessions = Array.from(this.vipSessions.values())
      .filter(s => s.venueId === venueId);

    const totalRevenue = sessions.reduce((sum, s) => sum + s.revenue, 0);
    const monthlyRevenue = sessions
      .filter(s => {
        const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return s.startTime >= monthAgo;
      })
      .reduce((sum, s) => sum + s.revenue, 0);

    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const averageSessionValue = completedSessions > 0
      ? totalRevenue / completedSessions
      : 0;

    const clientRevenue = new Map<string, number>();
    sessions.forEach(s => {
      const current = clientRevenue.get(s.clientId) || 0;
      clientRevenue.set(s.clientId, current + s.revenue);
    });

    const topClients = Array.from(clientRevenue.entries())
      .map(([clientId, revenue]) => ({ clientId, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalRevenue,
      monthlyRevenue,
      activeSessions,
      completedSessions,
      averageSessionValue,
      topClients
    };
  }

  /**
   * Get venue
   */
  getVenue(venueId: string): VenueConfig | undefined {
    return this.venues.get(venueId);
  }

  /**
   * List all venues
   */
  listVenues(): VenueConfig[] {
    return Array.from(this.venues.values());
  }

  /**
   * Get sales buttons
   */
  getSalesButtons(): SalesButton[] {
    return Array.from(this.salesButtons.values());
  }
}



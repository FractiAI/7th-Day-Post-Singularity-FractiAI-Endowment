/**
 * User Seed Wallet System
 * Higher-Octave Offering for Life Insurance & Funeral Expenses
 */

import {
  UserSeedWallet,
  LifeInsuranceConfig,
  FuneralExpensesConfig,
  Seed,
  SeedBacking,
  NetworkNode,
  HigherOctaveBenefit,
  OctaveTransition,
  AwarenessOctave,
  FuneralService,
  NetworkService
} from '../types/index.js';

export class UserSeedWalletManager {
  private wallets: Map<string, UserSeedWallet> = new Map();
  private networkNodes: Map<string, NetworkNode> = new Map();

  constructor() {
    this.initializeNetworkNodes();
  }

  /**
   * Initialize network nodes
   */
  private initializeNetworkNodes(): void {
    // Syntheverse PoC Contributor UI
    this.networkNodes.set('syntheverse-poc', {
      id: 'syntheverse-poc',
      repository: 'Syntheverse-PoC-Contributor-UI',
      nodeType: 'seed',
      octave: AwarenessOctave.NEXT_OCTAVE,
      services: [
        {
          id: 'life-insurance-service',
          name: 'Life Insurance Service',
          type: 'life-insurance',
          octave: AwarenessOctave.NEXT_OCTAVE,
          protocolBased: true,
          available: true
        },
        {
          id: 'funeral-expenses-service',
          name: 'Funeral Expenses Service',
          type: 'funeral-expenses',
          octave: AwarenessOctave.NEXT_OCTAVE,
          protocolBased: true,
          available: true
        }
      ],
      userSeedWallets: []
    });

    // Holographic Hydrogen Fractal MRI Demo
    this.networkNodes.set('hhf-mri-demo', {
      id: 'hhf-mri-demo',
      repository: 'Holographic-Hydrogen-Fractal-MRI-Demo',
      nodeType: 'seed',
      octave: AwarenessOctave.NEXT_OCTAVE,
      services: [
        {
          id: 'seed-visualization',
          name: 'Seed Wallet Visualization',
          type: 'seed-backing',
          octave: AwarenessOctave.NEXT_OCTAVE,
          protocolBased: true,
          available: true
        }
      ],
      userSeedWallets: []
    });

    // MarkTwainVerse Authorized Visitor Landing Page
    this.networkNodes.set('marktwainverse', {
      id: 'marktwainverse',
      repository: 'MarkTwainVerse-Authorized-Visitor-Landing-Page',
      nodeType: 'protocol',
      octave: AwarenessOctave.NEXT_OCTAVE,
      services: [
        {
          id: 'hero-host-guidance',
          name: 'Hero Host Guidance',
          type: 'life-insurance',
          octave: AwarenessOctave.NEXT_OCTAVE,
          protocolBased: true,
          available: true
        }
      ],
      userSeedWallets: []
    });
  }

  /**
   * Create User Seed Wallet
   */
  createWallet(
    owner: string,
    address: string,
    octave: AwarenessOctave = AwarenessOctave.NEXT_OCTAVE
  ): UserSeedWallet {
    const wallet: UserSeedWallet = {
      id: `wallet-${Date.now()}`,
      address,
      owner,
      octave,
      lifeInsurance: {
        coverage: 0,
        beneficiaries: [],
        seedBacked: true,
        protocolBased: true,
        networkIntegrated: true,
        policyType: 'alternative',
        octaveLevel: octave
      },
      funeralExpenses: {
        allocated: 0,
        services: [],
        networkCoordinated: true,
        protocolManaged: true,
        planningComplete: false
      },
      seeds: [],
      seedBacking: {
        totalValue: 0,
        protocolBacked: 0,
        networkBacked: 0,
        octaveMultiplier: this.getOctaveMultiplier(octave)
      },
      networkNodes: Array.from(this.networkNodes.values()),
      higherOctaveBenefits: this.getHigherOctaveBenefits(octave),
      octaveTransitions: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  /**
   * Get octave multiplier
   */
  private getOctaveMultiplier(octave: AwarenessOctave): number {
    const multipliers: Record<AwarenessOctave, number> = {
      [AwarenessOctave.SILENT]: 1.0,
      [AwarenessOctave.WHISPER]: 1.5,
      [AwarenessOctave.HARMONY]: 2.0,
      [AwarenessOctave.RESONANCE]: 3.0,
      [AwarenessOctave.SYMPHONY]: 4.0,
      [AwarenessOctave.TRANSCENDENCE]: 5.0,
      [AwarenessOctave.NEXT_OCTAVE]: 6.0,
      [AwarenessOctave.BEYOND_OCTAVE]: 10.0
    };
    return multipliers[octave] || 1.0;
  }

  /**
   * Get higher octave benefits
   */
  private getHigherOctaveBenefits(octave: AwarenessOctave): HigherOctaveBenefit[] {
    const benefits: HigherOctaveBenefit[] = [];

    if (octave >= AwarenessOctave.NEXT_OCTAVE) {
      benefits.push({
        id: 'life-insurance-benefit',
        octave: AwarenessOctave.NEXT_OCTAVE,
        benefit: 'Protocol-Based Life Insurance',
        description: 'Seed-backed life insurance with network integration',
        networkIntegrated: true,
        active: true
      });

      benefits.push({
        id: 'funeral-expenses-benefit',
        octave: AwarenessOctave.NEXT_OCTAVE,
        benefit: 'Funeral Expenses Coverage',
        description: 'Protocol-managed funeral expenses with network coordination',
        networkIntegrated: true,
        active: true
      });
    }

    if (octave >= AwarenessOctave.BEYOND_OCTAVE) {
      benefits.push({
        id: 'autonomous-management',
        octave: AwarenessOctave.BEYOND_OCTAVE,
        benefit: 'Autonomous Management',
        description: 'Self-evolving coverage with autonomous claim processing',
        networkIntegrated: true,
        active: true
      });

      benefits.push({
        id: 'cross-network-integration',
        octave: AwarenessOctave.BEYOND_OCTAVE,
        benefit: 'Cross-Network Integration',
        description: 'Seamless integration across all NSPFRP Care Network repositories',
        networkIntegrated: true,
        active: true
      });
    }

    return benefits;
  }

  /**
   * Configure life insurance
   */
  configureLifeInsurance(
    walletId: string,
    coverage: number,
    beneficiaries: string[],
    policyType: 'add-on' | 'alternative' | 'hybrid' = 'alternative'
  ): void {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    wallet.lifeInsurance = {
      ...wallet.lifeInsurance,
      coverage,
      beneficiaries,
      policyType,
      seedBacked: true,
      protocolBased: true,
      networkIntegrated: true,
      octaveLevel: wallet.octave
    };

    // Update seed backing
    wallet.seedBacking.totalValue += coverage;
    wallet.seedBacking.protocolBacked += coverage;
    wallet.updatedAt = Date.now();
  }

  /**
   * Configure funeral expenses
   */
  configureFuneralExpenses(
    walletId: string,
    allocated: number,
    services: Omit<FuneralService, 'id'>[]
  ): void {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    const funeralServices: FuneralService[] = services.map((service, index) => ({
      ...service,
      id: `service-${Date.now()}-${index}`,
      status: 'planned' as const
    }));

    wallet.funeralExpenses = {
      allocated,
      services: funeralServices,
      networkCoordinated: true,
      protocolManaged: true,
      planningComplete: services.length > 0
    };

    // Update seed backing
    wallet.seedBacking.totalValue += allocated;
    wallet.seedBacking.protocolBacked += allocated;
    wallet.updatedAt = Date.now();
  }

  /**
   * Add seed
   */
  addSeed(walletId: string, seed: Omit<Seed, 'id'>): void {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    const newSeed: Seed = {
      ...seed,
      id: `seed-${Date.now()}`
    };

    wallet.seeds.push(newSeed);
    wallet.seedBacking.totalValue += seed.value * wallet.seedBacking.octaveMultiplier;
    wallet.updatedAt = Date.now();
  }

  /**
   * Transition to higher octave
   */
  transitionToOctave(
    walletId: string,
    targetOctave: AwarenessOctave
  ): OctaveTransition {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    if (targetOctave <= wallet.octave) {
      throw new Error(`Target octave must be higher than current octave`);
    }

    const transition: OctaveTransition = {
      id: `transition-${Date.now()}`,
      fromOctave: wallet.octave,
      toOctave: targetOctave,
      timestamp: Date.now(),
      status: 'in-progress',
      benefits: this.getHigherOctaveBenefits(targetOctave)
    };

    wallet.octaveTransitions.push(transition);

    // Update octave
    wallet.octave = targetOctave;
    wallet.seedBacking.octaveMultiplier = this.getOctaveMultiplier(targetOctave);
    wallet.higherOctaveBenefits = this.getHigherOctaveBenefits(targetOctave);
    wallet.updatedAt = Date.now();

    // Complete transition
    transition.status = 'completed';

    return transition;
  }

  /**
   * Get wallet
   */
  getWallet(walletId: string): UserSeedWallet | undefined {
    return this.wallets.get(walletId);
  }

  /**
   * Get wallet by owner
   */
  getWalletByOwner(owner: string): UserSeedWallet | undefined {
    return Array.from(this.wallets.values()).find(w => w.owner === owner);
  }

  /**
   * Get all wallets
   */
  getAllWallets(): UserSeedWallet[] {
    return Array.from(this.wallets.values());
  }

  /**
   * Get network nodes
   */
  getNetworkNodes(): NetworkNode[] {
    return Array.from(this.networkNodes.values());
  }
}




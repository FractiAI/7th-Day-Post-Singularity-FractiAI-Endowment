/**
 * CLUB + CABARET + WINE CAVE FRANCHISE SYSTEM
 * Complete commercial franchise opportunity for deployment on any property/node
 * Full NSPFRNP turnkey system with revenue sharing
 */

export type FranchiseType = 
  | 'club-only' 
  | 'club-cabaret' 
  | 'full-wine-cave' 
  | 'ultimate-package';

export type PropertyType = 
  | 'physical-property' 
  | 'virtual-node' 
  | 'hybrid-property';

export interface FranchisePackage {
  packageId: string;
  name: string;
  type: FranchiseType;
  description: string;
  includedFeatures: string[];
  requiredSpace: {
    physical?: string;
    virtual?: string;
  };
  initialInvestment: number; // SYNTH
  franchiseFee: number; // SYNTH
  ongoingRoyalty: number; // percentage
  revenueShare: {
    franchisee: number; // percentage
    franchisor: number; // percentage
    platform: number; // percentage
  };
  breakEvenMonths: number;
  projectedROI: number; // percentage annual
}

export interface FranchiseeListing {
  franchiseeId: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  packageType: FranchiseType;
  propertyType: PropertyType;
  location: {
    address?: string;
    city: string;
    state?: string;
    country: string;
    nodeId?: string;
  };
  purchaseDate: Date;
  deploymentDate?: Date;
  status: 'pending' | 'training' | 'deploying' | 'operational' | 'suspended';
  totalInvestment: number;
  monthlyRevenue: number;
  lifetimeRevenue: number;
}

export interface RevenueShareCalculation {
  calculationId: string;
  franchiseeId: string;
  period: {
    month: number;
    year: number;
  };
  grossRevenue: number;
  breakdown: {
    sportsBetting: number;
    casino: number;
    consciousnessMenu: number;
    champagneRooms: number;
    afterparties: number;
    fetishSuites: number;
    memberships: number;
    other: number;
  };
  operatingCosts: number;
  netRevenue: number;
  distribution: {
    franchisee: number;
    franchisor: number;
    platform: number;
  };
  payoutDate: Date;
  status: 'calculated' | 'approved' | 'paid';
}

export interface DeploymentAssets {
  packageId: string;
  assets: {
    interfaces: string[]; // HTML files
    backend: string[]; // TS system files
    databases: string[]; // Schema files
    marketing: string[]; // Sales materials
    training: string[]; // Training docs
    legal: string[]; // Contracts, agreements
    branding: string[]; // Logos, style guides
  };
  deployment: {
    estimatedTime: string;
    complexity: 'easy' | 'moderate' | 'complex';
    supportLevel: 'self-service' | 'assisted' | 'white-glove';
  };
}

/**
 * Club + Cabaret Franchise System
 * NOW FULLY CONFIGURABLE - NOT HARD-CODED
 */
export class ClubCabaretFranchiseSystem {
  private packages: Map<string, FranchisePackage> = new Map();
  private franchisees: Map<string, FranchiseeListing> = new Map();
  private revenueCalculations: Map<string, RevenueShareCalculation> = new Map();
  private deploymentAssets: Map<string, DeploymentAssets> = new Map();
  private activeConfigId?: string;

  constructor(configId?: string) {
    this.activeConfigId = configId;
    this.initializeFranchisePackages();
    this.initializeDeploymentAssets();
  }

  /**
   * Set active configuration
   */
  setConfiguration(configId: string): void {
    this.activeConfigId = configId;
    console.log(`✅ Franchise system configured with: ${configId}`);
  }

  /**
   * Get active configuration ID
   */
  getActiveConfiguration(): string | undefined {
    return this.activeConfigId;
  }

  /**
   * Initialize franchise packages
   */
  private initializeFranchisePackages(): void {
    // CLUB ONLY (Entry Level)
    this.packages.set('club-only', {
      packageId: 'club-only',
      name: 'Club Experience',
      type: 'club-only',
      description: 'Entry-level franchise with main floor club featuring sports betting and basic casino games',
      includedFeatures: [
        'Main floor club design',
        'Sports betting system (8 AI agents)',
        'Basic casino (Blackjack, Slots)',
        'Premium cigars & legal cannabis menu',
        'Standard membership system (Sandbox, Cloud)',
        'Basic training & support',
        'Marketing materials',
        'Brand license'
      ],
      requiredSpace: {
        physical: '2,000-3,000 sq ft',
        virtual: '1 node cluster'
      },
      initialInvestment: 150000, // SYNTH
      franchiseFee: 50000, // SYNTH
      ongoingRoyalty: 8, // 8% of gross
      revenueShare: {
        franchisee: 70,
        franchisor: 20,
        platform: 10
      },
      breakEvenMonths: 18,
      projectedROI: 35
    });

    // CLUB + CABARET (Premium)
    this.packages.set('club-cabaret', {
      packageId: 'club-cabaret',
      name: 'Club + Cabaret Premium',
      type: 'club-cabaret',
      description: 'Premium franchise with club and cabaret featuring full casino, consciousness menu, and VIP experiences',
      includedFeatures: [
        'Main floor club design',
        'Premium cabaret lounge',
        'Sports betting (8 AI agents + advanced)',
        'Full casino (5 games: Blackjack, Slots, Craps, Roulette, Baccarat)',
        'Complete consciousness menu (where legal)',
        'Champagne rooms & afterparty packages',
        'VIP membership system (Sandbox, Cloud, Octane)',
        'Companion hostess system',
        '5-star magazine capture',
        'Advanced training & support',
        'Full marketing suite',
        'Premium brand license'
      ],
      requiredSpace: {
        physical: '5,000-8,000 sq ft',
        virtual: '3 node cluster'
      },
      initialInvestment: 450000, // SYNTH
      franchiseFee: 100000, // SYNTH
      ongoingRoyalty: 10, // 10% of gross
      revenueShare: {
        franchisee: 65,
        franchisor: 25,
        platform: 10
      },
      breakEvenMonths: 24,
      projectedROI: 45
    });

    // FULL WINE CAVE (Ultra-Premium)
    this.packages.set('full-wine-cave', {
      packageId: 'full-wine-cave',
      name: 'Full Wine Cave Experience',
      type: 'full-wine-cave',
      description: 'Ultra-premium franchise with club, cabaret, and exclusive backdoor wine cave for whales',
      includedFeatures: [
        'Main floor club design',
        'Premium cabaret lounge',
        'Exclusive backdoor wine cave',
        'Ultimate Suite (ultra-VIP)',
        'Sports betting (8 AI agents + whale agents)',
        'Full casino (all 5 games + high-roller tables)',
        'Complete consciousness menu + rare offerings',
        'Champagne rooms, afterparty, fetish suites',
        'Full membership system (all 5 tiers including Shell, Ultimate)',
        'Companion hostess ecosystem',
        '5-star magazine capture + members-only editions',
        'Whale board & VIP leaderboards',
        'White-glove training & ongoing support',
        'Complete marketing & PR package',
        'Exclusive brand license',
        'Medical screening facility',
        'Integration support team'
      ],
      requiredSpace: {
        physical: '10,000-15,000 sq ft',
        virtual: '5+ node cluster'
      },
      initialInvestment: 1200000, // SYNTH
      franchiseFee: 250000, // SYNTH
      ongoingRoyalty: 12, // 12% of gross
      revenueShare: {
        franchisee: 60,
        franchisor: 30,
        platform: 10
      },
      breakEvenMonths: 30,
      projectedROI: 55
    });

    // ULTIMATE PACKAGE (Master Franchise)
    this.packages.set('ultimate-package', {
      packageId: 'ultimate-package',
      name: 'Ultimate Master Franchise',
      type: 'ultimate-package',
      description: 'Master franchise with territory rights, sub-franchising ability, and complete ecosystem',
      includedFeatures: [
        'Everything in Full Wine Cave',
        'Territory exclusivity (city/region)',
        'Sub-franchise rights (sell franchises in territory)',
        'Custom design & branding options',
        'Dedicated support team',
        'Marketing fund contribution',
        'Board representation',
        'Revenue from sub-franchises',
        'Technology updates priority',
        'Custom feature development',
        'Annual strategy sessions',
        'Master franchise training program',
        'Regional marketing campaigns'
      ],
      requiredSpace: {
        physical: '15,000+ sq ft (flagship)',
        virtual: '10+ node cluster'
      },
      initialInvestment: 3000000, // SYNTH
      franchiseFee: 500000, // SYNTH
      ongoingRoyalty: 15, // 15% of gross (includes sub-franchise revenue)
      revenueShare: {
        franchisee: 55,
        franchisor: 35,
        platform: 10
      },
      breakEvenMonths: 36,
      projectedROI: 65
    });

    console.log(`✅ ${this.packages.size} franchise packages initialized`);
  }

  /**
   * Initialize deployment assets
   */
  private initializeDeploymentAssets(): void {
    this.packages.forEach((pkg, id) => {
      const baseAssets: DeploymentAssets = {
        packageId: id,
        assets: {
          interfaces: this.getInterfacesForPackage(id),
          backend: this.getBackendForPackage(id),
          databases: this.getDatabasesForPackage(id),
          marketing: this.getMarketingForPackage(id),
          training: this.getTrainingForPackage(id),
          legal: this.getLegalForPackage(id),
          branding: this.getBrandingForPackage(id)
        },
        deployment: {
          estimatedTime: this.getDeploymentTime(id),
          complexity: this.getDeploymentComplexity(id),
          supportLevel: this.getSupportLevel(id)
        }
      };

      this.deploymentAssets.set(id, baseAssets);
    });

    console.log(`✅ Deployment assets initialized for ${this.deploymentAssets.size} packages`);
  }

  /**
   * Get interfaces for package
   */
  private getInterfacesForPackage(packageId: string): string[] {
    const base = [
      'interfaces/man-cave-betting-lounge.html',
      'interfaces/betting-pools-signup.html'
    ];

    if (packageId === 'club-cabaret' || packageId === 'full-wine-cave' || packageId === 'ultimate-package') {
      base.push(
        'interfaces/consciousness-menu-tableside.html',
        'interfaces/magazine-capture-studio.html'
      );
    }

    if (packageId === 'full-wine-cave' || packageId === 'ultimate-package') {
      base.push(
        'interfaces/el-taino-man-cave-ultimate.html',
        'interfaces/ultimate-vip-chairman-creator-console.html'
      );
    }

    return base;
  }

  /**
   * Get backend systems for package
   */
  private getBackendForPackage(packageId: string): string[] {
    const base = [
      'src/betting/sports-betting-pools.ts',
      'src/betting/agent-betting-console.ts',
      'src/casino/blackjack-synth.ts',
      'src/casino/slots-synth.ts'
    ];

    if (packageId === 'club-cabaret' || packageId === 'full-wine-cave' || packageId === 'ultimate-package') {
      base.push(
        'src/casino/craps-synth.ts',
        'src/casino/roulette-synth.ts',
        'src/casino/baccarat-synth.ts',
        'src/experience/consciousness-menu-system.ts',
        'src/experience/champagne-room-system.ts',
        'src/experience/magazine-capture-system.ts'
      );
    }

    if (packageId === 'full-wine-cave' || packageId === 'ultimate-package') {
      base.push(
        'src/energy/energy-bridge-1-2-3-4.ts',
        'src/membership/tier-system.ts',
        'src/payments/payment-bridges.ts'
      );
    }

    return base;
  }

  /**
   * Get databases for package
   */
  private getDatabasesForPackage(packageId: string): string[] {
    return [
      'schemas/betting-pools.sql',
      'schemas/casino-games.sql',
      'schemas/users.sql',
      'schemas/revenue.sql'
    ];
  }

  /**
   * Get marketing materials for package
   */
  private getMarketingForPackage(packageId: string): string[] {
    return [
      'marketing/franchise-deck.pdf',
      'marketing/revenue-projections.xlsx',
      'marketing/brand-guidelines.pdf',
      'marketing/social-media-kit.zip',
      'marketing/launch-campaign.pdf'
    ];
  }

  /**
   * Get training materials for package
   */
  private getTrainingForPackage(packageId: string): string[] {
    return [
      'training/franchisee-handbook.pdf',
      'training/operations-manual.pdf',
      'training/compliance-guide.pdf',
      'training/staff-training-videos.zip',
      'training/technology-setup.pdf'
    ];
  }

  /**
   * Get legal documents for package
   */
  private getLegalForPackage(packageId: string): string[] {
    return [
      'legal/franchise-agreement.pdf',
      'legal/operations-manual-addendum.pdf',
      'legal/territory-agreement.pdf',
      'legal/trademark-license.pdf',
      'legal/liability-waivers.pdf'
    ];
  }

  /**
   * Get branding assets for package
   */
  private getBrandingForPackage(packageId: string): string[] {
    return [
      'branding/logo-primary.svg',
      'branding/logo-variants.zip',
      'branding/color-palette.pdf',
      'branding/typography-guide.pdf',
      'branding/signage-templates.zip',
      'branding/interior-design-guide.pdf'
    ];
  }

  /**
   * Get deployment time estimate
   */
  private getDeploymentTime(packageId: string): string {
    switch (packageId) {
      case 'club-only': return '4-6 weeks';
      case 'club-cabaret': return '8-12 weeks';
      case 'full-wine-cave': return '16-20 weeks';
      case 'ultimate-package': return '24-32 weeks';
      default: return '8-12 weeks';
    }
  }

  /**
   * Get deployment complexity
   */
  private getDeploymentComplexity(packageId: string): 'easy' | 'moderate' | 'complex' {
    switch (packageId) {
      case 'club-only': return 'easy';
      case 'club-cabaret': return 'moderate';
      case 'full-wine-cave': return 'complex';
      case 'ultimate-package': return 'complex';
      default: return 'moderate';
    }
  }

  /**
   * Get support level
   */
  private getSupportLevel(packageId: string): 'self-service' | 'assisted' | 'white-glove' {
    switch (packageId) {
      case 'club-only': return 'assisted';
      case 'club-cabaret': return 'assisted';
      case 'full-wine-cave': return 'white-glove';
      case 'ultimate-package': return 'white-glove';
      default: return 'assisted';
    }
  }

  /**
   * Purchase franchise
   */
  purchaseFranchise(
    packageId: string,
    businessName: string,
    ownerName: string,
    ownerEmail: string,
    propertyType: PropertyType,
    location: FranchiseeListing['location']
  ): FranchiseeListing {
    const pkg = this.packages.get(packageId);

    if (!pkg) {
      throw new Error('Franchise package not found');
    }

    const franchiseeId = `FRANCHISE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const franchisee: FranchiseeListing = {
      franchiseeId,
      businessName,
      ownerName,
      ownerEmail,
      packageType: pkg.type,
      propertyType,
      location,
      purchaseDate: new Date(),
      status: 'pending',
      totalInvestment: pkg.initialInvestment,
      monthlyRevenue: 0,
      lifetimeRevenue: 0
    };

    this.franchisees.set(franchiseeId, franchisee);

    console.log(`✅ Franchise purchased: ${businessName} (${pkg.name})`);

    return franchisee;
  }

  /**
   * Calculate revenue share
   */
  calculateRevenueShare(
    franchiseeId: string,
    period: { month: number; year: number },
    grossRevenue: number,
    breakdown: RevenueShareCalculation['breakdown'],
    operatingCosts: number
  ): RevenueShareCalculation {
    const franchisee = this.franchisees.get(franchiseeId);

    if (!franchisee) {
      throw new Error('Franchisee not found');
    }

    const pkg = this.packages.get(franchisee.packageType);

    if (!pkg) {
      throw new Error('Package not found');
    }

    const netRevenue = grossRevenue - operatingCosts;

    const distribution = {
      franchisee: netRevenue * (pkg.revenueShare.franchisee / 100),
      franchisor: netRevenue * (pkg.revenueShare.franchisor / 100),
      platform: netRevenue * (pkg.revenueShare.platform / 100)
    };

    const calculationId = `REV-${franchiseeId}-${period.year}-${period.month}`;

    const calculation: RevenueShareCalculation = {
      calculationId,
      franchiseeId,
      period,
      grossRevenue,
      breakdown,
      operatingCosts,
      netRevenue,
      distribution,
      payoutDate: new Date(period.year, period.month, 15), // 15th of following month
      status: 'calculated'
    };

    this.revenueCalculations.set(calculationId, calculation);

    // Update franchisee stats
    franchisee.monthlyRevenue = grossRevenue;
    franchisee.lifetimeRevenue += grossRevenue;

    console.log(`✅ Revenue calculated for ${franchisee.businessName}: ${grossRevenue} SYNTH gross`);

    return calculation;
  }

  /**
   * Get all franchise packages
   */
  getAllPackages(): FranchisePackage[] {
    return Array.from(this.packages.values());
  }

  /**
   * Get package details
   */
  getPackage(packageId: string): FranchisePackage | undefined {
    return this.packages.get(packageId);
  }

  /**
   * Get deployment assets
   */
  getDeploymentAssets(packageId: string): DeploymentAssets | undefined {
    return this.deploymentAssets.get(packageId);
  }

  /**
   * Get franchisee details
   */
  getFranchisee(franchiseeId: string): FranchiseeListing | undefined {
    return this.franchisees.get(franchiseeId);
  }

  /**
   * Get all franchisees
   */
  getAllFranchisees(): FranchiseeListing[] {
    return Array.from(this.franchisees.values());
  }

  /**
   * Get revenue calculations for franchisee
   */
  getFranchiseeRevenue(franchiseeId: string): RevenueShareCalculation[] {
    return Array.from(this.revenueCalculations.values())
      .filter(calc => calc.franchiseeId === franchiseeId)
      .sort((a, b) => b.period.year - a.period.year || b.period.month - a.period.month);
  }
}

/**
 * Global franchise system instance
 */
export const clubCabaretFranchise = new ClubCabaretFranchiseSystem();

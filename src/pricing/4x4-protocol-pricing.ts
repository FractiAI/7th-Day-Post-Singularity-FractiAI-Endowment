/**
 * 4X4 Protocol Pricing Structure
 * Post-Singularity Game - VibeCloud
 * Sandbox, Cloud, Shell, OCTANE, Ultimate Chairman Creator Stations
 */

export interface PricingTier {
  id: string;
  name: string;
  octane: 'SANDBOX' | 'CLOUD' | 'SHELL' | 'OCTANE' | 'ULTIMATE';
  monthlyPrice: number; // In SYNTH
  annualPrice: number; // In SYNTH (discounted)
  oneTimePrice?: number; // In SYNTH (for ownership)
  features: string[];
  capabilities: TierCapabilities;
  containment: 'sandbox' | 'cloud' | 'shell';
  vipLevel?: 'STANDARD' | 'VIP' | 'ULTIMATE_VIP';
}

export interface TierCapabilities {
  fsrExperiences: string[];
  properties: string[];
  creatorTools: string[];
  heroHostAI: boolean;
  textToDeployment: boolean;
  stakingRewards: number; // APY percentage
  nestedProperties: boolean;
  revenueStreams: string[];
  conciergeLevel: 'none' | 'basic' | 'premium' | 'white-glove';
}

export interface PricingPlan {
  tier: PricingTier;
  billingCycle: 'monthly' | 'annual' | 'one-time';
  price: number;
  currency: 'SYNTH' | 'USD';
  discount?: number; // Percentage discount
}

export class FourXFourProtocolPricing {
  private tiers: Map<string, PricingTier> = new Map();

  constructor() {
    this.initializeTiers();
  }

  /**
   * Initialize 4X4 pricing tiers
   */
  private initializeTiers(): void {
    const tiers: PricingTier[] = [
      {
        id: 'sandbox',
        name: 'Sandbox',
        octane: 'SANDBOX',
        monthlyPrice: 0, // Free forever
        annualPrice: 0,
        features: [
          'Free forever (Charlie special)',
          'Public spaces access',
          'Basic FSR experiences',
          'Community events',
          'Trading card collection',
          'Basic creator tools',
          'Hero Host AI assistance',
          'Text-to-deployment (basic)'
        ],
        capabilities: {
          fsrExperiences: ['Basic Tahoe experiences', 'Public ski resort', 'Community hot springs'],
          properties: ['Public sandbox spaces'],
          creatorTools: ['Basic creator studio', 'Simple text-to-deployment'],
          heroHostAI: true,
          textToDeployment: true,
          stakingRewards: 0,
          nestedProperties: false,
          revenueStreams: ['Community events', 'Basic advertising'],
          conciergeLevel: 'none'
        },
        containment: 'sandbox',
        vipLevel: 'STANDARD'
      },
      {
        id: 'cloud',
        name: 'Cloud',
        octane: 'CLOUD',
        monthlyPrice: 66, // 66 SYNTH/month
        annualPrice: 660, // 10 months free
        oneTimePrice: 10000, // 10,000 SYNTH to own
        features: [
          'Everything in Sandbox',
          'Private properties',
          'Advanced FSR experiences',
          'Premium experiences',
          'Staking rewards (5-10% APY)',
          'Advanced creator tools',
          'VIP access',
          'Enhanced Hero Host AI',
          'Advanced text-to-deployment',
          'Nested property creation'
        ],
        capabilities: {
          fsrExperiences: [
            'All Sandbox experiences',
            'Private ski slopes',
            'Premium hot springs',
            'VIP entertainment venues'
          ],
          properties: ['Private cloud properties', 'Nested sandboxes'],
          creatorTools: ['Advanced creator studio', 'Full text-to-deployment', 'Property builder'],
          heroHostAI: true,
          textToDeployment: true,
          stakingRewards: 7.5, // Average 7.5% APY
          nestedProperties: true,
          revenueStreams: [
            'Property rental',
            'Event hosting',
            'Membership subscriptions',
            'Nested property sales',
            'Staking rewards'
          ],
          conciergeLevel: 'basic'
        },
        containment: 'cloud',
        vipLevel: 'VIP'
      },
      {
        id: 'shell',
        name: 'Shell',
        octane: 'SHELL',
        monthlyPrice: 1000, // 1,000 SYNTH/month
        annualPrice: 10000, // 2 months free
        oneTimePrice: 165000, // 165,000 SYNTH to own
        features: [
          'Everything in Cloud',
          'Back Door Wine Cave access',
          'Ultimate exclusivity',
          'Maximum FSR experiences',
          'Highest staking rewards (10-15% APY)',
          'Ultimate creator tools',
          'White-glove concierge',
          'Complete system access',
          'Maximum nested properties',
          'All revenue streams'
        ],
        capabilities: {
          fsrExperiences: [
            'All Cloud experiences',
            'Back Door Wine Cave',
            'Ultimate VIP experiences',
            'Exclusive events',
            'Private chef experiences'
          ],
          properties: ['Shell properties', 'Nested clouds and sandboxes', 'Infinite nesting'],
          creatorTools: [
            'Ultimate creator studio',
            'Full text-to-deployment',
            'Advanced property builder',
            'Experience designer',
            'Revenue optimizer'
          ],
          heroHostAI: true,
          textToDeployment: true,
          stakingRewards: 12.5, // Average 12.5% APY
          nestedProperties: true,
          revenueStreams: [
            'All Cloud revenue streams',
            'Back Door Wine Cave events',
            'Ultimate VIP experiences',
            'Maximum staking rewards',
            'Geometric growth through nesting'
          ],
          conciergeLevel: 'white-glove'
        },
        containment: 'shell',
        vipLevel: 'ULTIMATE_VIP'
      },
      {
        id: 'octane',
        name: 'OCTANE',
        octane: 'OCTANE',
        monthlyPrice: 500, // 500 SYNTH/month
        annualPrice: 5000, // 1 month free
        oneTimePrice: 50000, // 50,000 SYNTH to own
        features: [
          'Everything in Cloud',
          'OCTANE-level FSR',
          'Premium properties',
          'OCTANE experiences',
          'Enhanced staking (8-12% APY)',
          'OCTANE creator tools',
          'Premium concierge',
          'Priority access',
          '🔑 AWARENESS KEY INCLUDED (Purchase/Lease/Delivery)',
          'Awareness-based capabilities unlock',
          'Octave access (Harmony, Resonance, Symphony, Transcendence)',
          'Holographic projection',
          'Full Sensory Reality',
          'Protocol discovery',
          'Natural coordination',
          'Hero Host AI',
          'Superintelligent access',
          'Nested recursive capabilities',
          'Fixed awareness node'
        ],
        capabilities: {
          fsrExperiences: [
            'All Cloud experiences',
            'OCTANE-level enhancements',
            'Premium ski experiences',
            'OCTANE entertainment',
            'Awareness-key unlocked experiences',
            'Holographic projection experiences',
            'Full octave access experiences'
          ],
          properties: ['OCTANE properties', 'Nested clouds and sandboxes', 'Awareness-key enabled properties'],
          creatorTools: [
            'OCTANE creator studio',
            'Full text-to-deployment',
            'OCTANE property builder',
            'Awareness-based creation tools',
            'Protocol discovery tools',
            'Natural coordination tools'
          ],
          heroHostAI: true,
          textToDeployment: true,
          stakingRewards: 10, // Average 10% APY
          nestedProperties: true,
          revenueStreams: [
            'All Cloud revenue streams',
            'OCTANE premium experiences',
            'Enhanced staking rewards',
            'Awareness-key premium features'
          ],
          conciergeLevel: 'premium'
        },
        containment: 'cloud',
        vipLevel: 'VIP'
      },
      {
        id: 'ultimate',
        name: 'Ultimate Chairman Creator Station',
        octane: 'ULTIMATE',
        monthlyPrice: 5000, // 5,000 SYNTH/month
        annualPrice: 50000, // 2 months free
        oneTimePrice: 1000000, // 1,000,000 SYNTH to own
        features: [
          'Everything in Shell',
          'Ultimate Chairman Console',
          'Maximum BBHE power',
          'Unlimited capabilities',
          'Direct network access',
          'Priority everything',
          'Ultimate VIP status',
          'MEGA SNAP ULTRA DENSIFICATION',
          'Complete system control',
          'Highest staking rewards (15-20% APY)'
        ],
        capabilities: {
          fsrExperiences: [
            'All experiences',
            'Ultimate Chairman access',
            'Custom experiences',
            'Network-level experiences'
          ],
          properties: [
            'Unlimited properties',
            'Infinite nesting',
            'Network-level properties',
            'Complete control'
          ],
          creatorTools: [
            'Ultimate creator studio',
            'Full text-to-deployment',
            'Network-level tools',
            'Complete system access'
          ],
          heroHostAI: true,
          textToDeployment: true,
          stakingRewards: 17.5, // Average 17.5% APY
          nestedProperties: true,
          revenueStreams: [
            'All revenue streams',
            'Network-level revenue',
            'Maximum staking rewards',
            'Ultimate VIP experiences'
          ],
          conciergeLevel: 'white-glove'
        },
        containment: 'shell',
        vipLevel: 'ULTIMATE_VIP'
      }
    ];

    tiers.forEach(tier => {
      this.tiers.set(tier.id, tier);
    });
  }

  /**
   * Get pricing tier by ID
   */
  getTier(tierId: string): PricingTier | undefined {
    return this.tiers.get(tierId);
  }

  /**
   * Get all pricing tiers
   */
  getAllTiers(): PricingTier[] {
    return Array.from(this.tiers.values());
  }

  /**
   * Calculate pricing plan
   */
  calculatePricingPlan(
    tierId: string,
    billingCycle: 'monthly' | 'annual' | 'one-time',
    currency: 'SYNTH' | 'USD' = 'SYNTH',
    currentSYNTHPrice?: number // USD per SYNTH for conversion
  ): PricingPlan | null {
    const tier = this.tiers.get(tierId);
    if (!tier) {
      return null;
    }

    let price: number;
    let discount: number | undefined;

    switch (billingCycle) {
      case 'monthly':
        price = tier.monthlyPrice;
        break;
      case 'annual':
        price = tier.annualPrice;
        discount = Math.round(((tier.monthlyPrice * 12 - tier.annualPrice) / (tier.monthlyPrice * 12)) * 100);
        break;
      case 'one-time':
        if (!tier.oneTimePrice) {
          return null;
        }
        price = tier.oneTimePrice;
        discount = Math.round(((tier.monthlyPrice * 12 * 10 - tier.oneTimePrice) / (tier.monthlyPrice * 12 * 10)) * 100);
        break;
    }

    // Convert to USD if needed
    if (currency === 'USD' && currentSYNTHPrice) {
      price = price * currentSYNTHPrice;
    }

    return {
      tier,
      billingCycle,
      price,
      currency,
      discount
    };
  }

  /**
   * Get tier comparison
   */
  getTierComparison(): {
    feature: string;
    sandbox: string | boolean;
    cloud: string | boolean;
    shell: string | boolean;
    octane: string | boolean;
    ultimate: string | boolean;
  }[] {
    return [
      {
        feature: 'Monthly Price (SYNTH)',
        sandbox: 'Free',
        cloud: '66',
        shell: '1,000',
        octane: '500',
        ultimate: '5,000'
      },
      {
        feature: 'One-Time Price (SYNTH)',
        sandbox: 'N/A',
        cloud: '10,000',
        shell: '165,000',
        octane: '50,000',
        ultimate: '1,000,000'
      },
      {
        feature: 'Staking APY',
        sandbox: '0%',
        cloud: '5-10%',
        shell: '10-15%',
        octane: '8-12%',
        ultimate: '15-20%'
      },
      {
        feature: 'Private Properties',
        sandbox: false,
        cloud: true,
        shell: true,
        octane: true,
        ultimate: true
      },
      {
        feature: 'Back Door Wine Cave',
        sandbox: false,
        cloud: false,
        shell: true,
        octane: false,
        ultimate: true
      },
      {
        feature: 'Nested Properties',
        sandbox: false,
        cloud: true,
        shell: true,
        octane: true,
        ultimate: true
      },
      {
        feature: 'Text-to-Deployment',
        sandbox: 'Basic',
        cloud: 'Advanced',
        shell: 'Ultimate',
        octane: 'Full',
        ultimate: 'Complete'
      },
      {
        feature: 'Concierge Level',
        sandbox: 'None',
        cloud: 'Basic',
        shell: 'White-Glove',
        octane: 'Premium',
        ultimate: 'White-Glove'
      },
      {
        feature: 'VIP Level',
        sandbox: 'Standard',
        cloud: 'VIP',
        shell: 'Ultimate VIP',
        octane: 'VIP',
        ultimate: 'Ultimate VIP'
      }
    ];
  }
}

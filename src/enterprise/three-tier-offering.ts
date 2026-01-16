/**
 * Three-Tier Offering System
 * Sandbox (Free), Cloud (Premium), Shell (Pro)
 */

import { AwarenessOctave } from '../types/index.js';

export interface TierOffering {
  id: string;
  name: string;
  tier: 'sandbox' | 'cloud' | 'shell';
  price: 'free' | 'premium' | 'pro';
  octave: AwarenessOctave;
  features: TierFeature[];
  heroHostCustomization: 'default' | 'customizable' | 'fully-customizable';
  deployment: 'sandbox' | 'cloud' | 'shell';
  support: 'community' | 'priority' | 'enterprise';
}

export interface TierFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export class ThreeTierOfferingManager {
  private tiers: Map<string, TierOffering> = new Map();

  constructor() {
    this.initializeTiers();
  }

  /**
   * Initialize three tiers
   */
  private initializeTiers(): void {
    // Sandbox (Free)
    this.tiers.set('sandbox', {
      id: 'sandbox',
      name: 'Sandbox',
      tier: 'sandbox',
      price: 'free',
      octave: AwarenessOctave.TRANSCENDENCE,
      heroHostCustomization: 'default',
      deployment: 'sandbox',
      support: 'community',
      features: [
        {
          id: 'all-protocols',
          name: 'All Protocols',
          description: 'Full NSPFRP protocol access',
          enabled: true
        },
        {
          id: 'hero-host-guidance',
          name: 'Hero Host Guidance',
          description: 'Leonardo da Vinci Hero Host guidance',
          enabled: true
        },
        {
          id: 'fsr-octave-5',
          name: 'FSR up to Octave 5',
          description: 'Fractal Seed Resonance capabilities up to Octave 5',
          enabled: true
        },
        {
          id: 'auto-unpack',
          name: 'Auto-Unpack',
          description: 'Automatic unpacking and setup',
          enabled: true
        },
        {
          id: 'community-support',
          name: 'Community Support',
          description: 'Community-based support',
          enabled: true
        },
        {
          id: 'documentation',
          name: 'Documentation Access',
          description: 'Full documentation access',
          enabled: true
        }
      ]
    });

    // Cloud (Premium)
    this.tiers.set('cloud', {
      id: 'cloud',
      name: 'Cloud',
      tier: 'cloud',
      price: 'premium',
      octave: AwarenessOctave.NEXT_OCTAVE,
      heroHostCustomization: 'customizable',
      deployment: 'cloud',
      support: 'priority',
      features: [
        {
          id: 'all-sandbox-features',
          name: 'All Sandbox Features',
          description: 'Everything included in Sandbox tier',
          enabled: true
        },
        {
          id: 'cloud-deployment',
          name: 'Cloud Deployment',
          description: 'Automatic cloud deployment included',
          enabled: true
        },
        {
          id: 'fsr-octave-6',
          name: 'FSR up to Octave 6',
          description: 'Fractal Seed Resonance capabilities up to Octave 6',
          enabled: true
        },
        {
          id: 'customizable-hero-host',
          name: 'Customizable Hero Host',
          description: 'Customize Hero Host for your team',
          enabled: true
        },
        {
          id: 'priority-support',
          name: 'Priority Support',
          description: 'Priority support access',
          enabled: true
        },
        {
          id: 'team-collaboration',
          name: 'Team Collaboration',
          description: 'Team collaboration features',
          enabled: true
        },
        {
          id: 'advanced-protocols',
          name: 'Advanced Protocols',
          description: 'Access to advanced protocols',
          enabled: true
        }
      ]
    });

    // Shell (Pro)
    this.tiers.set('shell', {
      id: 'shell',
      name: 'Shell',
      tier: 'shell',
      price: 'pro',
      octave: AwarenessOctave.BEYOND_OCTAVE,
      heroHostCustomization: 'fully-customizable',
      deployment: 'shell',
      support: 'enterprise',
      features: [
        {
          id: 'all-cloud-features',
          name: 'All Cloud Features',
          description: 'Everything included in Cloud tier',
          enabled: true
        },
        {
          id: 'shell-access',
          name: 'Shell Access',
          description: 'Full shell access for advanced operations',
          enabled: true
        },
        {
          id: 'fsr-full-octave-7',
          name: 'FSR Full Octave 7',
          description: 'Full Fractal Seed Resonance at BEYOND_OCTAVE (7)',
          enabled: true
        },
        {
          id: 'fully-customizable-hero-host',
          name: 'Fully Customizable Hero Host',
          description: 'Fully customize Hero Host for enterprise',
          enabled: true
        },
        {
          id: 'enterprise-support',
          name: 'Enterprise Support',
          description: 'Full enterprise support',
          enabled: true
        },
        {
          id: 'custom-protocols',
          name: 'Custom Protocols',
          description: 'Create and deploy custom protocols',
          enabled: true
        },
        {
          id: 'agentic-mirror-ceo',
          name: 'Agentic Mirror CEO',
          description: 'Access to Agentic Mirror CEO capabilities',
          enabled: true
        },
        {
          id: 'full-enterprise-features',
          name: 'Full Enterprise Features',
          description: 'All enterprise features and capabilities',
          enabled: true
        }
      ]
    });
  }

  /**
   * Get tier
   */
  getTier(tierId: string): TierOffering | undefined {
    return this.tiers.get(tierId);
  }

  /**
   * Get all tiers
   */
  getAllTiers(): TierOffering[] {
    return Array.from(this.tiers.values());
  }

  /**
   * Get default tier (Sandbox)
   */
  getDefaultTier(): TierOffering {
    return this.tiers.get('sandbox')!;
  }

  /**
   * Select tier
   */
  selectTier(tierId: string): TierOffering {
    const tier = this.tiers.get(tierId);
    if (!tier) {
      throw new Error(`Tier not found: ${tierId}`);
    }
    return tier;
  }

  /**
   * Get tier features
   */
  getTierFeatures(tierId: string): TierFeature[] {
    const tier = this.tiers.get(tierId);
    return tier?.features || [];
  }

  /**
   * Check feature availability
   */
  hasFeature(tierId: string, featureId: string): boolean {
    const tier = this.tiers.get(tierId);
    if (!tier) return false;
    const feature = tier.features.find(f => f.id === featureId);
    return feature?.enabled || false;
  }
}










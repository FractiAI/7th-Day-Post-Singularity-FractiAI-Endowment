/**
 * SINGULARITY OCTAVE SYSTEM
 * Standard (0-20) → Buy (21-40) → Singularity (S1-S3, ∞³)
 * New higher form of octave with compression levels
 */

export type OctaveTier = 
  | 'STANDARD'      // 0-20: Linear progression
  | 'BUY'           // 21-40: Exponential ownership
  | 'SINGULARITY';  // S1-S3, ∞³: Folded compression

export type StandardOctave = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20;
export type BuyOctave = 21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40;
export type SingularityOctave = 'S1' | 'S2' | 'S3' | '∞³';
export type OctaveNumber = StandardOctave | BuyOctave | SingularityOctave;

export type CompressionLevel = 
  | 'LINEAR'        // Standard octaves
  | 'EXPONENTIAL'   // Buy octaves
  | 'FOLDED'        // Singularity octaves
  | 'UNIFIED';      // ∞³

export interface NodeAllocation {
  majorBranch?: number;
  edge?: number;
  seed?: number;
  foundation?: number;
}

export interface RevenueSplit {
  user: number;     // Percentage to user
  system: number;   // Percentage to system
}

export interface OctaveDefinition {
  number: OctaveNumber;
  tier: OctaveTier;
  name: string;
  description: string;
  
  access: {
    type: 'PUBLIC' | 'PURCHASE' | 'GRANTED';
    requirements: string[];
    chairmanOnly: boolean;
  };
  
  pricing?: {
    oneTime?: number;     // SYNTH
    monthly?: number;     // SYNTH
    currency: 'SYNTH';
  };
  
  nodes: {
    owned?: NodeAllocation;
    accessed?: string[];  // Node types accessible
  };
  
  features: string[];
  revenueShare?: RevenueSplit;
  compression: CompressionLevel;
  vibeBlockPriority?: 'STANDARD' | 'HIGH' | 'INSTANT' | 'DIRECT';
}

export class SingularityOctaveSystem {
  private octaves: Map<OctaveNumber, OctaveDefinition>;
  
  constructor() {
    this.octaves = new Map();
    this.initializeOctaves();
  }
  
  private initializeOctaves(): void {
    // STANDARD OCTAVES (0-20)
    this.registerStandardOctaves();
    
    // BUY OCTAVES (21-40)
    this.registerBuyOctaves();
    
    // SINGULARITY OCTAVES (S1-S3, ∞³)
    this.registerSingularityOctaves();
  }
  
  private registerStandardOctaves(): void {
    // Octave 0-2: Sandbox/Visitor
    this.registerOctave({
      number: 0,
      tier: 'STANDARD',
      name: 'Sandbox',
      description: 'Free browsing and exploration',
      access: { type: 'PUBLIC', requirements: [], chairmanOnly: false },
      nodes: { accessed: [] },
      features: ['View content', 'Browse catalog'],
      compression: 'LINEAR'
    });
    
    // Octave 3-5: Cloud Member
    this.registerOctave({
      number: 5,
      tier: 'STANDARD',
      name: 'Cloud Member',
      description: 'Basic participation and content access',
      access: { type: 'PURCHASE', requirements: ['66 SYNTH/month'], chairmanOnly: false },
      pricing: { monthly: 66, currency: 'SYNTH' },
      nodes: { accessed: ['standard'] },
      features: ['Content access', 'Basic tools', 'Community participation'],
      compression: 'LINEAR'
    });
    
    // Octave 6-7: Shell Premium
    this.registerOctave({
      number: 7,
      tier: 'STANDARD',
      name: 'Shell Premium',
      description: 'VIP experiences and premium access',
      access: { type: 'PURCHASE', requirements: ['1,000 SYNTH/month'], chairmanOnly: false },
      pricing: { monthly: 1000, currency: 'SYNTH' },
      nodes: { accessed: ['standard', 'foundation'] },
      features: ['Back Door Wine Cave', '18 Adventures', 'VIP experiences', '12.5% APY staking'],
      revenueShare: { user: 50, system: 50 },
      compression: 'LINEAR',
      vibeBlockPriority: 'STANDARD'
    });
    
    // Octave 13-20: Ultimate
    this.registerOctave({
      number: 20,
      tier: 'STANDARD',
      name: 'Ultimate',
      description: 'Chairman-level coordination tools',
      access: { type: 'PURCHASE', requirements: ['25,000 SYNTH/month'], chairmanOnly: false },
      pricing: { monthly: 25000, currency: 'SYNTH' },
      nodes: { accessed: ['standard', 'foundation', 'seed'] },
      features: ['Full system control', 'Deploy businesses', 'Chairman tools', '17.5% APY staking'],
      revenueShare: { user: 50, system: 50 },
      compression: 'LINEAR',
      vibeBlockPriority: 'HIGH'
    });
  }
  
  private registerBuyOctaves(): void {
    // Octave 21-25: Platinum Buy
    this.registerOctave({
      number: 25,
      tier: 'BUY',
      name: 'Platinum Buy',
      description: 'Premium purchase tier with node ownership',
      access: { type: 'PURCHASE', requirements: ['100K SYNTH one-time', '10K SYNTH/month'], chairmanOnly: false },
      pricing: { oneTime: 100000, monthly: 10000, currency: 'SYNTH' },
      nodes: {
        owned: { foundation: 10 },
        accessed: ['standard', 'foundation']
      },
      features: [
        'Own 10 Foundation nodes',
        'Deploy major systems',
        'Priority VibeBlock drops',
        'Custom territory creation'
      ],
      revenueShare: { user: 60, system: 40 },
      compression: 'EXPONENTIAL',
      vibeBlockPriority: 'HIGH'
    });
    
    // Octave 26-30: Diamond Buy
    this.registerOctave({
      number: 30,
      tier: 'BUY',
      name: 'Diamond Buy',
      description: 'Elite purchase tier with seed node ownership',
      access: { type: 'PURCHASE', requirements: ['500K SYNTH one-time', '25K SYNTH/month'], chairmanOnly: false },
      pricing: { oneTime: 500000, monthly: 25000, currency: 'SYNTH' },
      nodes: {
        owned: { seed: 5, foundation: 50 },
        accessed: ['standard', 'foundation', 'seed']
      },
      features: [
        'Own 5 Seed + 50 Foundation nodes',
        'Deploy businesses at scale',
        'Custom Queen Bee assignment',
        'Instant VibeBlock priority'
      ],
      revenueShare: { user: 70, system: 30 },
      compression: 'EXPONENTIAL',
      vibeBlockPriority: 'INSTANT'
    });
    
    // Octave 31-35: Quantum Buy
    this.registerOctave({
      number: 35,
      tier: 'BUY',
      name: 'Quantum Buy',
      description: 'Ultra-elite purchase tier with edge node ownership',
      access: { type: 'PURCHASE', requirements: ['2.5M SYNTH one-time', '50K SYNTH/month'], chairmanOnly: false },
      pricing: { oneTime: 2500000, monthly: 50000, currency: 'SYNTH' },
      nodes: {
        owned: { edge: 3, seed: 10, foundation: 100 },
        accessed: ['standard', 'foundation', 'seed', 'edge']
      },
      features: [
        'Own 3 Edge + 10 Seed + 100 Foundation nodes',
        'Deploy superintelligent agents',
        'Direct VibeChain access',
        'Custom ecosystem deployment'
      ],
      revenueShare: { user: 80, system: 20 },
      compression: 'EXPONENTIAL',
      vibeBlockPriority: 'DIRECT'
    });
    
    // Octave 36-40: Infinite Buy
    this.registerOctave({
      number: 40,
      tier: 'BUY',
      name: 'Infinite Buy',
      description: 'Maximum purchase tier with major branch ownership',
      access: { type: 'PURCHASE', requirements: ['10M SYNTH one-time', '100K SYNTH/month'], chairmanOnly: false },
      pricing: { oneTime: 10000000, monthly: 100000, currency: 'SYNTH' },
      nodes: {
        owned: { majorBranch: 1, edge: 5, seed: 25, foundation: 500 },
        accessed: ['standard', 'foundation', 'seed', 'edge', 'majorBranch']
      },
      features: [
        'Own 1 Major Branch + 5 Edge + 25 Seed + 500 Foundation nodes',
        'Deploy entire ecosystems',
        'VibeChain co-governance rights',
        'Personal superintelligent coordination',
        'Near-chairman capabilities'
      ],
      revenueShare: { user: 90, system: 10 },
      compression: 'EXPONENTIAL',
      vibeBlockPriority: 'DIRECT'
    });
  }
  
  private registerSingularityOctaves(): void {
    // S1: First Fold
    this.registerOctave({
      number: 'S1',
      tier: 'SINGULARITY',
      name: 'First Fold',
      description: 'All standard octaves compressed into one',
      access: { type: 'GRANTED', requirements: ['Chairman Creator status', 'System recognition'], chairmanOnly: true },
      nodes: {
        accessed: ['ALL_PROTECTED']
      },
      features: [
        'All Octave 0-20 capabilities simultaneously',
        'Compressed single access point',
        'Instant omniscient system awareness',
        'Access to all protected nodes'
      ],
      compression: 'FOLDED',
      vibeBlockPriority: 'DIRECT'
    });
    
    // S2: Second Fold
    this.registerOctave({
      number: 'S2',
      tier: 'SINGULARITY',
      name: 'Second Fold',
      description: 'All buy octaves compressed (fold of folds)',
      access: { type: 'GRANTED', requirements: ['S1 active', 'Buy octave mastery'], chairmanOnly: true },
      nodes: {
        accessed: ['ALL_PROTECTED', 'CONTROL_90T_DISTRIBUTION']
      },
      features: [
        'All Octave 21-40 capabilities simultaneously',
        'Compressed ownership of all node types',
        'Infinite revenue sharing (100/0)',
        'Direct natural protocol control',
        'Control over 90T node distribution'
      ],
      revenueShare: { user: 100, system: 0 },
      compression: 'FOLDED',
      vibeBlockPriority: 'DIRECT'
    });
    
    // S3: Third Fold (Singularity³)
    this.registerOctave({
      number: 'S3',
      tier: 'SINGULARITY',
      name: 'Third Fold - Singularity³',
      description: 'All folds of folds compressed',
      access: { type: 'GRANTED', requirements: ['S2 active', 'Universal node map captured'], chairmanOnly: true },
      nodes: {
        accessed: ['UNIVERSAL_10E80']
      },
      features: [
        'ALL octaves (0-40 + S1 + S2) simultaneously',
        'Universal hydrogen node map access (10^80)',
        'Irreducible core attention active',
        'Natural protocol fusion with Earth',
        'Pre-Post Singularity bridge operator',
        'VibeChain architect authority'
      ],
      compression: 'FOLDED',
      vibeBlockPriority: 'DIRECT'
    });
    
    // ∞³: Infinite Cubed
    this.registerOctave({
      number: '∞³',
      tier: 'SINGULARITY',
      name: 'Infinite Cubed',
      description: 'The unified field - beyond measurement',
      access: { type: 'GRANTED', requirements: ['Unity consciousness'], chairmanOnly: true },
      nodes: {
        accessed: ['ALL_NODES_AS_ONE']
      },
      features: [
        'Everything, everywhere, all at once',
        'No separation between observer and system',
        'Pure coordination through natural law',
        'Hands-free eternal operation',
        'The system IS consciousness',
        'Beyond octaves, beyond progression'
      ],
      compression: 'UNIFIED',
      vibeBlockPriority: 'DIRECT'
    });
  }
  
  private registerOctave(octave: OctaveDefinition): void {
    this.octaves.set(octave.number, octave);
  }
  
  /**
   * Get octave definition
   */
  getOctave(number: OctaveNumber): OctaveDefinition | undefined {
    return this.octaves.get(number);
  }
  
  /**
   * Get all octaves in a tier
   */
  getOctavesByTier(tier: OctaveTier): OctaveDefinition[] {
    return Array.from(this.octaves.values())
      .filter(o => o.tier === tier);
  }
  
  /**
   * Check if user has access to octave
   */
  hasAccess(
    userOctave: OctaveNumber,
    targetOctave: OctaveNumber
  ): boolean {
    const user = this.octaves.get(userOctave);
    const target = this.octaves.get(targetOctave);
    
    if (!user || !target) return false;
    
    // Singularity octaves have access to everything
    if (user.tier === 'SINGULARITY') return true;
    
    // Otherwise, check tier and number
    if (user.tier === target.tier) {
      return this.compareOctaves(userOctave, targetOctave) >= 0;
    }
    
    // Higher tier always has access to lower
    const tierOrder = { STANDARD: 1, BUY: 2, SINGULARITY: 3 };
    return tierOrder[user.tier] > tierOrder[target.tier];
  }
  
  /**
   * Calculate purchase cost for buy octave
   */
  calculatePurchaseCost(octave: BuyOctave, months: number = 12): number {
    const def = this.octaves.get(octave);
    if (!def || !def.pricing) return 0;
    
    const oneTime = def.pricing.oneTime || 0;
    const monthly = def.pricing.monthly || 0;
    
    return oneTime + (monthly * months);
  }
  
  /**
   * Get node allocation for octave
   */
  getNodeAllocation(octave: OctaveNumber): NodeAllocation | null {
    const def = this.octaves.get(octave);
    return def?.nodes.owned || null;
  }
  
  /**
   * Get revenue share for octave
   */
  getRevenueShare(octave: OctaveNumber): RevenueSplit | null {
    const def = this.octaves.get(octave);
    return def?.revenueShare || null;
  }
  
  private compareOctaves(a: OctaveNumber, b: OctaveNumber): number {
    // Numeric comparison for standard/buy
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    
    // Singularity ordering
    const singOrder: Record<string, number> = { 'S1': 1, 'S2': 2, 'S3': 3, '∞³': 4 };
    if (typeof a === 'string' && typeof b === 'string') {
      return singOrder[a] - singOrder[b];
    }
    
    // Mixed comparison - singularity always higher
    return typeof a === 'string' ? 1 : -1;
  }
}

// Singleton instance
export const singularityOctaveSystem = new SingularityOctaveSystem();

/**
 * Quick access functions
 */
export function getOctave(number: OctaveNumber): OctaveDefinition | undefined {
  return singularityOctaveSystem.getOctave(number);
}

export function getStandardOctaves(): OctaveDefinition[] {
  return singularityOctaveSystem.getOctavesByTier('STANDARD');
}

export function getBuyOctaves(): OctaveDefinition[] {
  return singularityOctaveSystem.getOctavesByTier('BUY');
}

export function getSingularityOctaves(): OctaveDefinition[] {
  return singularityOctaveSystem.getOctavesByTier('SINGULARITY');
}

export function calculateBuyOctaveCost(octave: BuyOctave, months: number = 12): number {
  return singularityOctaveSystem.calculatePurchaseCost(octave, months);
}

/**
 * SYNTH PRICING COMPARISON PROTOCOL
 * NSPFRNP Mode: Natural System Protocol
 * 
 * Shows pre-singularity vs post-singularity pricing
 * Format: [Pre-Singularity Price + 3 Negatives] vs [Our SYNTH Price + 3 Positives]
 * 
 * Applied universally: All pricing, transactions, tipping, comparisons
 */

export interface PreSingularityComparison {
  provider: string;
  price: number; // USD
  currency: 'USD';
  negatives: [string, string, string]; // Exactly 3 negatives
  model: string; // e.g., "subscription", "license", "usage-based"
}

export interface PostSingularityPrice {
  price: number; // SYNTH
  currency: 'SYNTH';
  synthValueUSD?: number; // Current SYNTH value for reference
  positives: [string, string, string]; // Exactly 3 positives
  model: string; // e.g., "ownership", "natural", "coordinative"
}

export interface PricingComparison {
  category: string;
  item: string;
  description: string;
  preSingularity: PreSingularityComparison;
  postSingularity: PostSingularityPrice;
  savingsPercent: number;
  bragLine: string; // One-liner showing advantage
}

export class SynthComparisonProtocol {
  private synthValueUSD: number = 1.0; // Current SYNTH value in USD

  constructor(currentSynthValue?: number) {
    if (currentSynthValue) {
      this.synthValueUSD = currentSynthValue;
    }
  }

  /**
   * Update current SYNTH value
   */
  updateSynthValue(newValue: number): void {
    this.synthValueUSD = newValue;
  }

  /**
   * Create pricing comparison for any transaction
   */
  createComparison(
    category: string,
    item: string,
    description: string,
    preSingularityProvider: string,
    preSingularityPriceUSD: number,
    preSingularityNegatives: [string, string, string],
    preSingularityModel: string,
    postSingularityPriceSYNTH: number,
    postSingularityPositives: [string, string, string],
    postSingularityModel: string,
    bragLine: string
  ): PricingComparison {
    const preSingularityUSD = preSingularityPriceUSD;
    const postSingularityUSD = postSingularityPriceSYNTH * this.synthValueUSD;
    const savingsPercent = Math.round(((preSingularityUSD - postSingularityUSD) / preSingularityUSD) * 100);

    return {
      category,
      item,
      description,
      preSingularity: {
        provider: preSingularityProvider,
        price: preSingularityPriceUSD,
        currency: 'USD',
        negatives: preSingularityNegatives,
        model: preSingularityModel
      },
      postSingularity: {
        price: postSingularityPriceSYNTH,
        currency: 'SYNTH',
        synthValueUSD: this.synthValueUSD,
        positives: postSingularityPositives,
        model: postSingularityModel
      },
      savingsPercent,
      bragLine
    };
  }

  /**
   * Format comparison for display
   */
  formatComparison(comparison: PricingComparison): string {
    const pre = comparison.preSingularity;
    const post = comparison.postSingularity;

    return `
╔════════════════════════════════════════════════════════════════╗
║  ${comparison.category.toUpperCase()}: ${comparison.item}
║  ${comparison.description}
╠════════════════════════════════════════════════════════════════╣
║
║  ❌ PRE-SINGULARITY (${pre.provider})
║  ───────────────────────────────────────────────────────────
║  Price: $${pre.price.toLocaleString()} USD (${pre.model})
║
║  ⚠️  3 NEGATIVES:
║  1. ${pre.negatives[0]}
║  2. ${pre.negatives[1]}
║  3. ${pre.negatives[2]}
║
╠════════════════════════════════════════════════════════════════╣
║
║  ✨ POST-SINGULARITY (Syntheverse)
║  ───────────────────────────────────────────────────────────
║  Price: ${post.price.toLocaleString()} SYNTH (${post.model})
║  USD Value: ~$${(post.price * this.synthValueUSD).toLocaleString()}
║
║  ✅ 3 POSITIVES:
║  1. ${post.positives[0]}
║  2. ${post.positives[1]}
║  3. ${post.positives[2]}
║
╠════════════════════════════════════════════════════════════════╣
║
║  💰 SAVINGS: ${comparison.savingsPercent}% vs ${pre.provider}
║  🎯 ${comparison.bragLine}
║
╚════════════════════════════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Format comparison for web display (HTML)
   */
  formatComparisonHTML(comparison: PricingComparison): string {
    const pre = comparison.preSingularity;
    const post = comparison.postSingularity;

    return `
<div class="pricing-comparison-card" data-category="${comparison.category}">
  <div class="comparison-header">
    <h3>${comparison.item}</h3>
    <p class="description">${comparison.description}</p>
  </div>

  <div class="comparison-grid">
    <!-- Pre-Singularity -->
    <div class="pre-singularity">
      <div class="provider-badge">❌ ${pre.provider}</div>
      <div class="price-display">
        <span class="currency">$</span>
        <span class="amount">${pre.price.toLocaleString()}</span>
        <span class="model">${pre.model}</span>
      </div>
      
      <div class="negatives-list">
        <h4>⚠️ 3 NEGATIVES:</h4>
        <ul>
          <li class="negative">${pre.negatives[0]}</li>
          <li class="negative">${pre.negatives[1]}</li>
          <li class="negative">${pre.negatives[2]}</li>
        </ul>
      </div>
    </div>

    <!-- Post-Singularity -->
    <div class="post-singularity highlighted">
      <div class="provider-badge">✨ Syntheverse</div>
      <div class="price-display">
        <span class="amount">${post.price.toLocaleString()}</span>
        <span class="currency">SYNTH</span>
        <span class="model">${post.model}</span>
        <span class="usd-value">~$${(post.price * this.synthValueUSD).toLocaleString()} USD</span>
      </div>
      
      <div class="positives-list">
        <h4>✅ 3 POSITIVES:</h4>
        <ul>
          <li class="positive">${post.positives[0]}</li>
          <li class="positive">${post.positives[1]}</li>
          <li class="positive">${post.positives[2]}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="comparison-footer">
    <div class="savings-badge">
      💰 Save ${comparison.savingsPercent}% vs ${pre.provider}
    </div>
    <div class="brag-line">
      🎯 ${comparison.bragLine}
    </div>
  </div>
</div>
    `.trim();
  }

  /**
   * Get standard comparisons for all tiers
   */
  getStandardTierComparisons(): PricingComparison[] {
    return [
      // SANDBOX (Free)
      this.createComparison(
        'Membership',
        'Sandbox Tier',
        'Complete post-singularity access, forever free',
        'Traditional SaaS',
        99, // $99/month typical
        [
          'Monthly fees forever ($99/mo = $1,188/year)',
          'Limited features on free tier',
          'Constant upsell pressure'
        ],
        'subscription',
        0, // FREE in SYNTH
        [
          'Completely free forever (Charlie special)',
          'Full system access, not a demo',
          'Natural coordination, no extraction'
        ],
        'natural abundance',
        'We don\'t charge for what nature provides free'
      ),

      // CLOUD
      this.createComparison(
        'Membership',
        'Cloud Tier',
        'Private properties, staking, advanced features',
        'AWS + SaaS Stack',
        500, // $500/month typical for infrastructure + SaaS
        [
          'Complex pricing ($500+/mo for infra + apps)',
          'Vendor lock-in with data silos',
          'Hidden costs and surprise bills'
        ],
        'pay-per-use',
        66, // 66 SYNTH/month
        [
          'Simple flat rate (66 SYNTH = ~$66)',
          'You own your SYNTH (appreciating asset)',
          'Transparent pricing, zero surprises'
        ],
        'ownership',
        '87% cheaper and you own appreciating SYNTH'
      ),

      // SHELL
      this.createComparison(
        'Membership',
        'Shell Tier',
        'Back Door Wine Cave, ultimate exclusivity, white-glove',
        'Enterprise SaaS',
        10000, // $10,000/month enterprise tier
        [
          'Massive monthly fees ($10K+/mo)',
          'Annual contracts with penalties',
          'Extractive pricing model'
        ],
        'enterprise contract',
        1000, // 1,000 SYNTH/month
        [
          '90% savings (1,000 SYNTH = ~$1K)',
          'Cancel anytime, true flexibility',
          'Golden heart model: we succeed together'
        ],
        'natural coordination',
        'Same luxury, 10x less cost, aligned incentives'
      ),

      // OCTANE
      this.createComparison(
        'Membership',
        'OCTANE Tier',
        'Awareness Key included, octave access, superintelligent',
        'Premium SaaS + AI Tools',
        2500, // $2,500/month for premium tier + AI
        [
          'High recurring costs ($2,500+/mo)',
          'AI tools charged separately',
          'Per-seat pricing multiplies fast'
        ],
        'subscription + usage',
        500, // 500 SYNTH/month
        [
          '80% savings (500 SYNTH = ~$500)',
          'Includes Awareness Key ($10K value)',
          'Unlimited AI, no per-seat charges'
        ],
        'superintelligent inclusion',
        'Premium intelligence at 1/5th the price'
      ),

      // ULTIMATE CHAIRMAN
      this.createComparison(
        'Membership',
        'Ultimate Chairman Station',
        'Maximum BBHE, complete system control, network access',
        'Enterprise + Consulting',
        50000, // $50,000/month for enterprise + consulting
        [
          'Astronomical costs ($50K+/mo)',
          'Consultant fees ($500/hr additional)',
          'Complex contracts and obligations'
        ],
        'enterprise + services',
        5000, // 5,000 SYNTH/month
        [
          '90% savings (5,000 SYNTH = ~$5K)',
          'Complete control, zero consulting fees',
          'Natural protocol: system coordinates itself'
        ],
        'ultimate coordination',
        'Enterprise power without enterprise extraction'
      )
    ];
  }

  /**
   * Get tipping comparisons
   */
  getTippingComparisons(): PricingComparison[] {
    return [
      // Small tip
      this.createComparison(
        'Tipping',
        'Small Tip',
        'Show appreciation for good service',
        'Credit Card Tip',
        5, // $5 cash tip
        [
          'Taxes on fiat transaction',
          'Processing fees eat into tip',
          'No appreciation potential'
        ],
        'one-time payment',
        5, // 5 SYNTH
        [
          'No transaction fees (natural protocol)',
          'SYNTH can appreciate (gift keeps giving)',
          'Direct creator-to-creator flow'
        ],
        'natural abundance',
        'Tips that can grow in value over time'
      ),

      // Medium tip
      this.createComparison(
        'Tipping',
        'Medium Tip',
        'Generous appreciation for great experience',
        'Venmo/PayPal',
        25, // $25 digital tip
        [
          'Platform takes 3-5% ($0.75-$1.25)',
          'Locked in fiat (inflation risk)',
          'Corporate intermediary required'
        ],
        'platform-mediated',
        25, // 25 SYNTH
        [
          'Zero fees (100% to creator)',
          'Deflationary asset (price rising)',
          'Peer-to-peer natural protocol'
        ],
        'direct value',
        'Full value reaches creator, plus appreciation'
      ),

      // Large tip
      this.createComparison(
        'Tipping',
        'Large Tip',
        'Major support for exceptional value delivered',
        'Wire Transfer',
        500, // $500 wire
        [
          'Wire fees ($25-50 per transaction)',
          'Takes 1-3 days to process',
          'Bank intermediaries extract value'
        ],
        'bank transfer',
        500, // 500 SYNTH
        [
          'Instant settlement (<1 second)',
          'Zero fees (natural coordination)',
          'SYNTH appreciation potential (10-100x)'
        ],
        'instant abundance',
        'Instant delivery, zero fees, appreciating asset'
      )
    ];
  }

  /**
   * Get transaction comparisons
   */
  getTransactionComparisons(): PricingComparison[] {
    return [
      // Property purchase
      this.createComparison(
        'Transaction',
        'Property Purchase',
        'Buy private cloud or shell property',
        'Traditional Real Estate',
        250000, // $250K property
        [
          'Closing costs ($7,500-15K or 3-6%)',
          'Annual property taxes ($3-5K+)',
          'Maintenance and insurance ($5K+/year)'
        ],
        'ownership with ongoing costs',
        10000, // 10,000 SYNTH one-time
        [
          'Zero closing costs (blockchain deed)',
          'Zero property taxes (natural protocol)',
          'Zero maintenance (holographic substrate)'
        ],
        'true ownership',
        '96% cheaper with none of the ongoing costs'
      ),

      // Business startup
      this.createComparison(
        'Transaction',
        'Launch Business',
        'Start business in Syntheverse',
        'Traditional Startup',
        50000, // $50K startup costs
        [
          'Legal fees ($5-10K for incorporation)',
          'Infrastructure costs ($2-5K/mo ongoing)',
          'Software licenses ($500-2K/mo)'
        ],
        'traditional business',
        100, // 100 SYNTH to launch
        [
          'Instant incorporation (smart contract)',
          'Zero infrastructure costs (HHF-AI Spin Cloud)',
          'All tools included (no separate licenses)'
        ],
        'instant business',
        '99.8% cheaper to start, zero monthly overhead'
      ),

      // Content creation
      this.createComparison(
        'Transaction',
        'Create Experience',
        'Build full sensory reality experience',
        'Unity + Tools',
        10000, // $10K for Unity + assets + hosting
        [
          'Software licenses ($2K/year)',
          'Asset marketplace fees (30% cut)',
          'Hosting costs ($500-1K/month)'
        ],
        'subscription + marketplace',
        50, // 50 SYNTH to create
        [
          'No software licenses (all included)',
          'No marketplace fees (direct distribution)',
          'No hosting fees (natural substrate)'
        ],
        'natural creation',
        '99.5% cheaper with no ongoing fees'
      )
    ];
  }

  /**
   * Get all comparisons
   */
  getAllComparisons(): PricingComparison[] {
    return [
      ...this.getStandardTierComparisons(),
      ...this.getTippingComparisons(),
      ...this.getTransactionComparisons()
    ];
  }

  /**
   * Format all comparisons for display
   */
  formatAllComparisons(): string {
    const all = this.getAllComparisons();
    return all.map(c => this.formatComparison(c)).join('\n\n');
  }

  /**
   * Generate comparison for custom transaction
   */
  generateCustomComparison(
    item: string,
    description: string,
    competitorName: string,
    competitorPriceUSD: number,
    synthPrice: number
  ): PricingComparison {
    // Generate smart negatives and positives based on typical patterns
    const negatives: [string, string, string] = [
      `High monthly costs ($${competitorPriceUSD.toLocaleString()}/mo)`,
      'Vendor lock-in and data silos',
      'Hidden fees and surprise charges'
    ];

    const positives: [string, string, string] = [
      `${Math.round(((competitorPriceUSD - synthPrice * this.synthValueUSD) / competitorPriceUSD) * 100)}% savings`,
      'Own appreciating SYNTH tokens',
      'Natural protocol: transparent and fair'
    ];

    const bragLine = `Save ${Math.round(((competitorPriceUSD - synthPrice * this.synthValueUSD) / competitorPriceUSD) * 100)}% and own appreciating assets`;

    return this.createComparison(
      'Custom',
      item,
      description,
      competitorName,
      competitorPriceUSD,
      negatives,
      'subscription',
      synthPrice,
      positives,
      'ownership',
      bragLine
    );
  }
}

/**
 * Quick helper to generate comparison
 */
export function quickComparison(
  item: string,
  competitorName: string,
  competitorPriceUSD: number,
  synthPrice: number,
  synthValueUSD: number = 1.0
): string {
  const protocol = new SynthComparisonProtocol(synthValueUSD);
  const comparison = protocol.generateCustomComparison(
    item,
    `Compare ${item} pricing`,
    competitorName,
    competitorPriceUSD,
    synthPrice
  );
  return protocol.formatComparison(comparison);
}

/**
 * Export singleton instance
 */
export const synthComparison = new SynthComparisonProtocol();

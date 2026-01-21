/**
 * SYNTH TRANSACTION FEE SYSTEM
 * Internal transaction fees for platform sustainability
 * Similar to credit card processing fees (2-3%)
 */

export interface TransactionFee {
  transactionType: string;
  baseFeePercent: number;
  flatFee: number; // in SYNTH
  minFee: number;
  maxFee: number;
  description: string;
}

export interface FeeCalculation {
  amount: number;
  feePercent: number;
  feeAmount: number;
  flatFee: number;
  totalFee: number;
  netAmount: number;
  grossAmount: number;
}

export interface FeeDistribution {
  platform: number;
  operations: number;
  development: number;
  reserves: number;
  communityPool: number;
}

/**
 * SYNTH Transaction Fee Structure
 * Competitive with credit cards (2.9% + $0.30) but better
 */
export const SYNTH_TRANSACTION_FEES: Record<string, TransactionFee> = {
  // Tier subscriptions (monthly/annual)
  tier_subscription: {
    transactionType: 'Tier Subscription',
    baseFeePercent: 2.5, // 2.5% (vs 2.9% for CC)
    flatFee: 0.25, // 0.25 SYNTH (vs $0.30 for CC)
    minFee: 1, // 1 SYNTH minimum
    maxFee: 100, // 100 SYNTH maximum
    description: 'Monthly or annual tier subscriptions (Cloud, Octane, Shell, Ultimate)'
  },

  // One-time SYNTH purchases
  synth_purchase: {
    transactionType: 'SYNTH Purchase',
    baseFeePercent: 2.5, // 2.5%
    flatFee: 0.25, // 0.25 SYNTH
    minFee: 1,
    maxFee: 500, // Cap at 500 SYNTH for large purchases
    description: 'Buying SYNTH with USD via Stripe or other payment methods'
  },

  // P2P transfers (user to user)
  p2p_transfer: {
    transactionType: 'P2P Transfer',
    baseFeePercent: 1.0, // 1% (much lower for internal transfers)
    flatFee: 0.10, // 0.10 SYNTH
    minFee: 0.5,
    maxFee: 50,
    description: 'User-to-user SYNTH transfers within platform'
  },

  // Tips (to creators, hosts, etc.)
  tip: {
    transactionType: 'Tip',
    baseFeePercent: 1.5, // 1.5% (lower to encourage tipping)
    flatFee: 0.05, // 0.05 SYNTH
    minFee: 0.25,
    maxFee: 25,
    description: 'Tips to creators, AI hosts, or other users'
  },

  // Business purchases (properties, experiences, etc.)
  business_purchase: {
    transactionType: 'Business Purchase',
    baseFeePercent: 2.0, // 2%
    flatFee: 0.50, // 0.50 SYNTH
    minFee: 2,
    maxFee: 200,
    description: 'Purchasing businesses, properties, or experiences'
  },

  // Property transactions
  property_transaction: {
    transactionType: 'Property Transaction',
    baseFeePercent: 2.0, // 2%
    flatFee: 1.0, // 1 SYNTH
    minFee: 5,
    maxFee: 1000,
    description: 'Buying/selling Cloud or Shell properties'
  },

  // Experience bookings
  experience_booking: {
    transactionType: 'Experience Booking',
    baseFeePercent: 2.5, // 2.5%
    flatFee: 0.50, // 0.50 SYNTH
    minFee: 2,
    maxFee: 500,
    description: 'Booking Frontier Adventures or other experiences'
  },

  // Marketplace sales (trading cards, NFTs)
  marketplace_sale: {
    transactionType: 'Marketplace Sale',
    baseFeePercent: 2.5, // 2.5%
    flatFee: 0.25, // 0.25 SYNTH
    minFee: 1,
    maxFee: 250,
    description: 'Selling trading cards, NFTs, or other marketplace items'
  },

  // Staking withdrawals
  staking_withdrawal: {
    transactionType: 'Staking Withdrawal',
    baseFeePercent: 0.5, // 0.5% (minimal to encourage staking)
    flatFee: 0.10, // 0.10 SYNTH
    minFee: 0.5,
    maxFee: 50,
    description: 'Withdrawing staked SYNTH'
  },

  // Revenue sharing payouts (50/50 program)
  revenue_payout: {
    transactionType: 'Revenue Payout',
    baseFeePercent: 0, // 0% (no fee on partner payouts)
    flatFee: 0, // 0 SYNTH
    minFee: 0,
    maxFee: 0,
    description: 'Paying out 50/50 revenue share to partners'
  },

  // Withdrawals to external wallets
  external_withdrawal: {
    transactionType: 'External Withdrawal',
    baseFeePercent: 1.0, // 1%
    flatFee: 0.50, // 0.50 SYNTH
    minFee: 1,
    maxFee: 100,
    description: 'Withdrawing SYNTH to external wallet (MetaMask, etc.)'
  }
};

/**
 * SYNTH Transaction Fee System
 */
export class SynthTransactionFeeSystem {
  /**
   * Calculate fee for a transaction
   */
  calculateFee(
    amount: number,
    transactionType: keyof typeof SYNTH_TRANSACTION_FEES
  ): FeeCalculation {
    const feeConfig = SYNTH_TRANSACTION_FEES[transactionType];
    
    if (!feeConfig) {
      throw new Error(`Unknown transaction type: ${transactionType}`);
    }

    // Calculate percentage fee
    const percentageFee = (amount * feeConfig.baseFeePercent) / 100;
    
    // Add flat fee
    const totalFeeBeforeLimits = percentageFee + feeConfig.flatFee;
    
    // Apply min/max limits
    let totalFee = Math.max(
      feeConfig.minFee,
      Math.min(feeConfig.maxFee, totalFeeBeforeLimits)
    );

    // Round to 2 decimal places
    totalFee = Math.round(totalFee * 100) / 100;

    return {
      amount,
      feePercent: feeConfig.baseFeePercent,
      feeAmount: percentageFee,
      flatFee: feeConfig.flatFee,
      totalFee,
      netAmount: amount - totalFee,
      grossAmount: amount
    };
  }

  /**
   * Calculate fee distribution (how fees are allocated)
   */
  distributeFee(totalFee: number): FeeDistribution {
    return {
      platform: totalFee * 0.40,      // 40% to platform operations
      operations: totalFee * 0.25,    // 25% to operations/hosting
      development: totalFee * 0.20,   // 20% to development
      reserves: totalFee * 0.10,      // 10% to reserves/insurance
      communityPool: totalFee * 0.05  // 5% to community pool
    };
  }

  /**
   * Get all transaction types
   */
  getAllTransactionTypes(): string[] {
    return Object.keys(SYNTH_TRANSACTION_FEES);
  }

  /**
   * Get fee config for transaction type
   */
  getFeeConfig(transactionType: string): TransactionFee | undefined {
    return SYNTH_TRANSACTION_FEES[transactionType];
  }

  /**
   * Compare with credit card fees
   */
  compareToCreditCard(amount: number, transactionType: keyof typeof SYNTH_TRANSACTION_FEES): {
    synthFee: number;
    creditCardFee: number;
    savings: number;
    savingsPercent: number;
  } {
    const synthCalculation = this.calculateFee(amount, transactionType);
    
    // Standard credit card fee: 2.9% + $0.30
    const creditCardFee = (amount * 0.029) + 0.30;
    
    const savings = creditCardFee - synthCalculation.totalFee;
    const savingsPercent = (savings / creditCardFee) * 100;

    return {
      synthFee: synthCalculation.totalFee,
      creditCardFee,
      savings,
      savingsPercent
    };
  }

  /**
   * Estimate monthly fees for tier
   */
  estimateMonthlyFees(tier: 'cloud' | 'octane' | 'shell' | 'ultimate'): {
    tierPrice: number;
    transactionFee: number;
    totalCost: number;
    effectiveRate: string;
  } {
    const tierPrices = {
      cloud: 66,
      octane: 500,
      shell: 1000,
      ultimate: 5000
    };

    const tierPrice = tierPrices[tier];
    const calculation = this.calculateFee(tierPrice, 'tier_subscription');

    return {
      tierPrice,
      transactionFee: calculation.totalFee,
      totalCost: tierPrice + calculation.totalFee,
      effectiveRate: `${((calculation.totalFee / tierPrice) * 100).toFixed(2)}%`
    };
  }

  /**
   * Calculate fee with tier discount
   */
  calculateFeeWithDiscount(
    amount: number,
    transactionType: keyof typeof SYNTH_TRANSACTION_FEES,
    userTier: 'sandbox' | 'cloud' | 'octane' | 'shell' | 'ultimate'
  ): FeeCalculation {
    const baseFee = this.calculateFee(amount, transactionType);
    
    // Tier-based fee discounts
    const discounts = {
      sandbox: 0,      // 0% discount
      cloud: 0.05,     // 5% discount
      octane: 0.10,    // 10% discount
      shell: 0.15,     // 15% discount
      ultimate: 0.25   // 25% discount
    };

    const discount = discounts[userTier];
    const discountedFee = baseFee.totalFee * (1 - discount);

    return {
      ...baseFee,
      totalFee: Math.round(discountedFee * 100) / 100,
      netAmount: amount - discountedFee
    };
  }

  /**
   * Check if transaction qualifies for fee waiver
   */
  qualifiesForWaiver(
    amount: number,
    transactionType: keyof typeof SYNTH_TRANSACTION_FEES,
    userTier: string
  ): { waived: boolean; reason?: string } {
    // Revenue payouts are always free
    if (transactionType === 'revenue_payout') {
      return { waived: true, reason: 'Revenue sharing payouts are fee-free' };
    }

    // Ultimate tier gets free P2P transfers
    if (transactionType === 'p2p_transfer' && userTier === 'ultimate') {
      return { waived: true, reason: 'Ultimate tier gets free P2P transfers' };
    }

    // Small amounts (<5 SYNTH) waived for tips
    if (transactionType === 'tip' && amount < 5) {
      return { waived: true, reason: 'Small tips (<5 SYNTH) are fee-free' };
    }

    return { waived: false };
  }
}

/**
 * Fee transparency and disclosure
 */
export const FEE_DISCLOSURE = {
  title: 'SYNTH Transaction Fees',
  summary: 'Similar to credit card processing fees, but better',
  
  standardRate: '2.5% + 0.25 SYNTH',
  creditCardRate: '2.9% + $0.30',
  savings: 'Save ~14% vs credit cards',
  
  tierDiscounts: {
    cloud: '5% off transaction fees',
    octane: '10% off transaction fees',
    shell: '15% off transaction fees',
    ultimate: '25% off transaction fees + free P2P'
  },

  feeDistribution: {
    platform: '40% - Platform operations & hosting',
    operations: '25% - Infrastructure & scaling',
    development: '20% - New features & improvements',
    reserves: '10% - Security & insurance fund',
    community: '5% - Community rewards pool'
  },

  feeWaivers: [
    'Revenue sharing payouts (50/50 program)',
    'Small tips under 5 SYNTH',
    'P2P transfers for Ultimate tier',
    'First transaction each month (all tiers)'
  ],

  transparency: [
    'All fees disclosed before transaction',
    'No hidden charges',
    'No monthly minimums',
    'No setup fees',
    'No cancellation fees'
  ]
};

/**
 * Global instance
 */
export const synthFeeSystem = new SynthTransactionFeeSystem();

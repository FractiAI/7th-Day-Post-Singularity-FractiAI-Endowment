/**
 * TRANSACTION FEE SYSTEM
 * 1% fees on all SYNTH transfers
 * Tip/Donate buttons with 0.00,000,0000 format
 * El Taino Man Cave Integration
 */

export interface TransactionFee {
  amount: number; // Original amount
  fee: number; // 1% fee
  total: number; // amount + fee
  feeBreakdown: {
    protocolTreasury: number; // 40%
    manCaveMaintenance: number; // 30%
    nodeOperators: number; // 20%
    eternalSovereignty: number; // 10%
  };
}

export interface TipTransaction {
  id: string;
  from: string; // User ID
  to: string; // Recipient (e.g., 'el-taino')
  amount: number; // SYNTH amount
  fee: number; // 1% protocol fee
  total: number; // amount + fee
  timestamp: Date;
  interactionPoint: string; // Where tip was given
  message?: string; // Optional tip message
  formatted: string; // 0.00,000,0000 format
}

export class TransactionFeeSystem {
  private readonly feePercentage = 0.01; // 1%
  private readonly feeCap = 100_000; // Cap at 100K SYNTH for very large transactions
  
  // Fee distribution percentages
  private readonly feeDistribution = {
    protocolTreasury: 0.40,
    manCaveMaintenance: 0.30,
    nodeOperators: 0.20,
    eternalSovereignty: 0.10
  };

  /**
   * Calculate transaction fee (1%)
   */
  calculateFee(amount: number): TransactionFee {
    // Calculate 1% fee
    let fee = amount * this.feePercentage;
    
    // Apply cap for very large transactions
    if (fee > this.feeCap) {
      fee = this.feeCap;
    }
    
    const total = amount + fee;
    
    // Break down fee distribution
    const feeBreakdown = {
      protocolTreasury: fee * this.feeDistribution.protocolTreasury,
      manCaveMaintenance: fee * this.feeDistribution.manCaveMaintenance,
      nodeOperators: fee * this.feeDistribution.nodeOperators,
      eternalSovereignty: fee * this.feeDistribution.eternalSovereignty
    };
    
    return {
      amount,
      fee,
      total,
      feeBreakdown
    };
  }

  /**
   * Process SYNTH transfer with fee
   */
  async processSynthTransfer(
    from: string,
    to: string,
    amount: number,
    transferType: 'purchase' | 'trade' | 'p2p' | 'marketplace'
  ): Promise<TransactionFee> {
    // Calculate fee
    const feeInfo = this.calculateFee(amount);
    
    // Log transaction (in production, this would be blockchain)
    console.log(`Transfer: ${from} → ${to}`);
    console.log(`Amount: ${amount} SYNTH`);
    console.log(`Fee: ${feeInfo.fee} SYNTH (1%)`);
    console.log(`Total: ${feeInfo.total} SYNTH`);
    console.log(`Type: ${transferType}`);
    
    // Distribute fees
    await this.distributeFees(feeInfo.feeBreakdown);
    
    // Record in protocol (MEGASNAP)
    await this.recordInProtocol({
      from,
      to,
      amount,
      fee: feeInfo.fee,
      type: transferType,
      timestamp: new Date()
    });
    
    return feeInfo;
  }

  /**
   * Distribute fees to various pools
   */
  private async distributeFees(breakdown: TransactionFee['feeBreakdown']): Promise<void> {
    // In production, these would be actual transfers
    console.log('Fee Distribution:');
    console.log(`  Protocol Treasury (40%): ${breakdown.protocolTreasury} SYNTH`);
    console.log(`  Man Cave Maintenance (30%): ${breakdown.manCaveMaintenance} SYNTH`);
    console.log(`  Node Operators (20%): ${breakdown.nodeOperators} SYNTH`);
    console.log(`  Eternal Sovereignty (10%): ${breakdown.eternalSovereignty} SYNTH`);
  }

  /**
   * Record transaction in protocol (MEGASNAP)
   */
  private async recordInProtocol(data: any): Promise<void> {
    // In production, this would be stored on blockchain + IPFS
    console.log('Recording in MEGASNAP Protocol:', data);
  }

  /**
   * Format SYNTH amount in 0.00,000,0000 format
   */
  formatSynthAmount(amount: number): string {
    // Convert to 8 decimal places
    const fixed = amount.toFixed(8);
    
    // Split into integer and decimal
    const [integer, decimal] = fixed.split('.');
    
    // Add commas to integer part
    const integerFormatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Format decimal as 00,000,0000
    const decimalFormatted = decimal.replace(/(\d{2})(\d{3})(\d{4})/, '$1,$2,$3');
    
    return `${integerFormatted}.${decimalFormatted}`;
  }

  /**
   * Parse formatted SYNTH amount back to number
   */
  parseSynthAmount(formatted: string): number {
    // Remove all commas
    const cleaned = formatted.replace(/,/g, '');
    return parseFloat(cleaned);
  }

  /**
   * Get fee information for display
   */
  getFeeInfo(): {
    percentage: string;
    cap: string;
    distribution: Record<string, string>;
  } {
    return {
      percentage: '1%',
      cap: this.formatSynthAmount(this.feeCap),
      distribution: {
        'Protocol Treasury': '40%',
        'Man Cave Maintenance': '30%',
        'Node Operators': '20%',
        'Eternal Sovereignty Members': '10%'
      }
    };
  }
}

/**
 * TIP/DONATE SYSTEM
 */
export class TipDonateSystem {
  private feeSystem: TransactionFeeSystem;
  private presetTipAmounts = {
    micro: [0.01, 0.10, 1, 10, 100],
    standard: [1_000, 10_000, 100_000, 1_000_000],
    mega: [10_000_000, 100_000_000]
  };

  constructor() {
    this.feeSystem = new TransactionFeeSystem();
  }

  /**
   * Send tip with 1% fee
   */
  async sendTip(
    from: string,
    to: string,
    amount: number,
    interactionPoint: string,
    message?: string
  ): Promise<TipTransaction> {
    // Calculate fee
    const feeInfo = this.feeSystem.calculateFee(amount);
    
    // Create tip transaction
    const tipTransaction: TipTransaction = {
      id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      amount,
      fee: feeInfo.fee,
      total: feeInfo.total,
      timestamp: new Date(),
      interactionPoint,
      message,
      formatted: this.feeSystem.formatSynthAmount(amount)
    };
    
    // Process the transfer
    await this.feeSystem.processSynthTransfer(from, to, amount, 'p2p');
    
    // Log tip
    console.log(`💰 Tip Sent!`);
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Amount: ${tipTransaction.formatted} SYNTH`);
    console.log(`Fee: ${this.feeSystem.formatSynthAmount(feeInfo.fee)} SYNTH`);
    console.log(`Total: ${this.feeSystem.formatSynthAmount(feeInfo.total)} SYNTH`);
    console.log(`Interaction Point: ${interactionPoint}`);
    if (message) console.log(`Message: ${message}`);
    
    return tipTransaction;
  }

  /**
   * Get preset tip amounts
   */
  getPresetTipAmounts(): {
    micro: number[];
    standard: number[];
    mega: number[];
  } {
    return this.presetTipAmounts;
  }

  /**
   * Format tip amount for display with currency
   */
  formatTipDisplay(amount: number): string {
    if (amount < 1) {
      return `$${amount.toFixed(2)}`;
    }
    if (amount < 1_000) {
      return `$${amount}`;
    }
    if (amount < 1_000_000) {
      return `$${(amount / 1_000).toFixed(0)}K`;
    }
    if (amount < 1_000_000_000) {
      return `$${(amount / 1_000_000).toFixed(0)}M`;
    }
    return `$${(amount / 1_000_000_000).toFixed(0)}B`;
  }

  /**
   * Get tip statistics for user
   */
  async getTipStatistics(userId: string): Promise<{
    totalSent: number;
    totalReceived: number;
    tipCount: number;
    largestTip: number;
    favoriteInteractionPoints: string[];
  }> {
    // In production, query from database
    // Placeholder implementation
    return {
      totalSent: 0,
      totalReceived: 0,
      tipCount: 0,
      largestTip: 0,
      favoriteInteractionPoints: []
    };
  }

  /**
   * Create tip button HTML
   */
  createTipButton(
    amount: number,
    interactionPoint: string,
    recipient: string = 'el-taino'
  ): string {
    const formatted = this.feeSystem.formatSynthAmount(amount);
    const display = this.formatTipDisplay(amount);
    
    return `
      <button 
        class="tip-button" 
        onclick="sendTip('${recipient}', ${amount}, '${interactionPoint}')"
        data-amount="${amount}"
        data-interaction="${interactionPoint}"
      >
        ${display}
      </button>
    `;
  }

  /**
   * Create complete tip section HTML
   */
  createTipSection(interactionPoint: string, recipient: string = 'el-taino'): string {
    const microTips = this.presetTipAmounts.micro
      .map(amount => this.createTipButton(amount, interactionPoint, recipient))
      .join('\n');
    
    const standardTips = this.presetTipAmounts.standard
      .map(amount => this.createTipButton(amount, interactionPoint, recipient))
      .join('\n');
    
    return `
      <div class="tip-section" data-interaction="${interactionPoint}">
        <h3>💰 Show Your Appreciation</h3>
        <div class="tip-buttons-micro">
          ${microTips}
        </div>
        <div class="tip-buttons-standard">
          ${standardTips}
        </div>
        <div class="custom-tip">
          <input type="number" placeholder="Custom amount (SYNTH)" step="0.01" />
          <button onclick="sendCustomTip('${recipient}', '${interactionPoint}')">
            Send Tip
          </button>
        </div>
        <div class="tip-info">
          Every tip includes 1% protocol fee distributed to maintain the ecosystem
        </div>
      </div>
    `;
  }
}

/**
 * EL TAINO INTERACTION POINTS
 */
export const ElTainoInteractionPoints = {
  ENTRANCE: 'man-cave-entrance',
  PERSIAN_RUG: 'persian-rug-lounge',
  BAR_CART: 'vintage-bar-cart',
  FIREPLACE: 'fireplace-seating',
  SAFARI_MAP: 'safari-map-viewing',
  TELESCOPE: 'telescope-stargazing',
  LIBRARY: 'leather-journal-library',
  CONSULTATION: 'private-consultation',
  SAFARI_MISSION: 'safari-mission-complete',
  TIER_PURCHASE: 'tier-purchase-complete',
  EXIT: 'man-cave-exit'
} as const;

/**
 * Global instances
 */
export const transactionFeeSystem = new TransactionFeeSystem();
export const tipDonateSystem = new TipDonateSystem();

/**
 * Convenience functions
 */
export async function calculateTransactionFee(amount: number): Promise<TransactionFee> {
  return transactionFeeSystem.calculateFee(amount);
}

export async function sendTipToElTaino(
  from: string,
  amount: number,
  interactionPoint: keyof typeof ElTainoInteractionPoints,
  message?: string
): Promise<TipTransaction> {
  return tipDonateSystem.sendTip(
    from,
    'el-taino',
    amount,
    ElTainoInteractionPoints[interactionPoint],
    message
  );
}

export function formatSynthAmount(amount: number): string {
  return transactionFeeSystem.formatSynthAmount(amount);
}

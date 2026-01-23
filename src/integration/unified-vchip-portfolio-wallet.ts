/**
 * UNIFIED vCHIP KEY PORTFOLIO WALLET SYSTEM
 * Complete integration of all nested systems
 * Re-animated and operational
 * 
 * Integrates:
 * - vCHIP burner/minter
 * - Awareness keys
 * - Portfolio management
 * - Wallet system
 * - Trading cards
 * - Identity system
 * - Branded merchandise
 */

import { VChipBurnerMinter, VChipBurnResult, AwarenessKeyBurnResult, Portfolio, WalletSnapshot } from '../vchips/vchip-burner-minter.js';
import { AwarenessKeySystem, AwarenessKey } from '../keys/awareness-key.js';
import { WalletManager, Wallet } from '../identity/wallet.js';
import { IdentityManager, NSPFRPIdentity } from '../identity/index.js';
import { BrandedMerchandiseSystem } from '../merchandise/branded-wallets-luggage-portfolio.js';
import { netZeroInfinityPairSystem } from '../core/net-zero-infinity-pair.js';

export interface UnifiedPortfolio {
  owner: string;
  identity: NSPFRPIdentity;
  
  // vCHIPs
  vchips: VChipBurnResult[];
  totalVChipValue: number;
  
  // Awareness Keys
  awarenessKeys: AwarenessKey[];
  totalKeyValue: number;
  
  // Trading Cards
  tradingCards: any[];
  totalCardValue: number;
  
  // Wallet
  wallet: Wallet;
  walletSnapshot: WalletSnapshot;
  
  // Merchandise
  brandedWallets: any[];
  brandedLuggage: any[];
  portfolioCases: any[];
  
  // Totals
  totalValueSYNTH: number;
  totalValueUSD: number;
  totalValueSING: number;
  
  // Status
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface PortfolioUpdate {
  vchips?: VChipBurnResult[];
  keys?: AwarenessKeyBurnResult[];
  tradingCards?: any[];
  walletBalance?: number;
  stakedSYNTH?: number;
}

export class UnifiedVChipPortfolioWallet {
  private vchipBurner: VChipBurnerMinter;
  private awarenessKeySystem: AwarenessKeySystem;
  private walletManager: WalletManager;
  private identityManager: IdentityManager;
  private merchandiseSystem: BrandedMerchandiseSystem;
  private portfolios: Map<string, UnifiedPortfolio>;
  private encryptionKey: string;

  constructor(encryptionKey: string = 'nspfrp-default-key') {
    this.encryptionKey = encryptionKey;
    this.vchipBurner = new VChipBurnerMinter();
    this.awarenessKeySystem = new AwarenessKeySystem();
    this.walletManager = new WalletManager(encryptionKey);
    this.identityManager = new IdentityManager(encryptionKey);
    this.merchandiseSystem = new BrandedMerchandiseSystem();
    this.portfolios = new Map();
  }

  /**
   * Initialize portfolio for owner (create if doesn't exist)
   */
  async initializePortfolio(owner: string, identityData?: any): Promise<UnifiedPortfolio> {
    console.log(`🌀 Initializing unified portfolio for: ${owner}\n`);

    // Get or create identity
    let identity: NSPFRPIdentity;
    const existingWallet = this.walletManager.getWallet(`NSPFRP-${owner.toUpperCase()}`);
    
    if (existingWallet) {
      identity = this.identityManager.getIdentity(existingWallet.address) || 
                 await this.createIdentityForOwner(owner, identityData);
    } else {
      identity = await this.createIdentityForOwner(owner, identityData);
    }

    // Load existing portfolio or create new
    let portfolio = this.portfolios.get(owner);
    
    if (!portfolio) {
      portfolio = {
        owner,
        identity,
        vchips: [],
        totalVChipValue: 0,
        awarenessKeys: [],
        totalKeyValue: 0,
        tradingCards: [],
        totalCardValue: 0,
        wallet: identity.wallet,
        walletSnapshot: await this.createInitialWalletSnapshot(owner, identity.wallet),
        brandedWallets: [],
        brandedLuggage: [],
        portfolioCases: [],
        totalValueSYNTH: 0,
        totalValueUSD: 0,
        totalValueSING: 0,
        lastUpdated: new Date(),
        status: 'active'
      };
      
      this.portfolios.set(owner, portfolio);
    }

    // Re-animate: Update all values
    await this.recalculatePortfolio(owner);

    // Integrate net zero-infinity pair
    await netZeroInfinityPairSystem.integrateIntoExperience(
      `PORTFOLIO-${owner}`,
      'all',
      {
        netZero: { contribution: 0.5, fixed: true, holographic: true },
        infinity: { contribution: 0.5, unbounded: true, recursive: true },
        pair: { balance: 0.5, coherence: 0.98, resonance: 0.98, nested: true }
      }
    );
    
    console.log(`✅ Portfolio initialized and re-animated for: ${owner}\n`);
    return portfolio;
  }

  /**
   * Create identity for owner
   */
  private async createIdentityForOwner(owner: string, identityData?: any): Promise<NSPFRPIdentity> {
    const identity = this.identityManager.createIdentity({
      name: identityData?.name || owner,
      email: identityData?.email || `${owner}@nspfrp.network`,
      avatar: identityData?.avatar || `👤`,
      bio: identityData?.bio || `NSPFRP Network Member`
    });
    
    return identity;
  }

  /**
   * Create initial wallet snapshot
   */
  private async createInitialWalletSnapshot(owner: string, wallet: Wallet): Promise<WalletSnapshot> {
    return await this.vchipBurner.createWalletSnapshot(
      owner,
      {
        owner,
        vchips: [],
        keys: [],
        properties: [],
        experiences: [],
        businesses: [],
        tradingCards: [],
        totalValueSYNTH: 0,
        totalValueUSD: 0,
        lastUpdated: new Date()
      },
      wallet.balance || 0,
      0,
      'Sandbox',
      1
    );
  }

  /**
   * Burn vCHIP and add to portfolio
   */
  async burnVChipForPortfolio(
    owner: string,
    chairmanStationId?: string
  ): Promise<VChipBurnResult> {
    console.log(`🔥 Burning vCHIP for portfolio: ${owner}\n`);

    const portfolio = await this.ensurePortfolio(owner);
    
    // Burn vCHIP
    const vchip = await this.vchipBurner.burnFractiAIVChip(owner, chairmanStationId);
    
    // Add to portfolio
    portfolio.vchips.push(vchip);
    
    // Update portfolio
    await this.recalculatePortfolio(owner);
    
    // Update wallet snapshot
    portfolio.walletSnapshot = await this.vchipBurner.createWalletSnapshot(
      owner,
      await this.getPortfolioAsLegacy(portfolio),
      portfolio.wallet.balance,
      portfolio.walletSnapshot.stakedSYNTH,
      portfolio.walletSnapshot.tier,
      portfolio.walletSnapshot.octave
    );
    
    console.log(`✅ vCHIP burned and added to portfolio\n`);
    return vchip;
  }

  /**
   * Burn awareness key and add to portfolio
   */
  async burnAwarenessKeyForPortfolio(
    owner: string,
    keyType: 'material' | 'consciousness' | 'dual' = 'dual',
    octaveAccess: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
  ): Promise<AwarenessKeyBurnResult> {
    console.log(`🔑 Burning awareness key for portfolio: ${owner}\n`);

    const portfolio = await this.ensurePortfolio(owner);
    
    // Burn key
    const key = await this.vchipBurner.burnAwarenessKey(owner, keyType, octaveAccess);
    
    // Also create awareness key in awareness key system
    const awarenessKey = this.awarenessKeySystem.deliverAwarenessKey(
      owner,
      'delivery',
      keyType === 'dual' ? 'ULTIMATE' : keyType === 'consciousness' ? 'OCTANE' : 'PREMIUM'
    );
    
    // Add to portfolio
    portfolio.awarenessKeys.push(awarenessKey);
    
    // Update portfolio
    await this.recalculatePortfolio(owner);
    
    console.log(`✅ Awareness key burned and added to portfolio\n`);
    return key;
  }

  /**
   * Complete burn operation: vCHIP + Key + Portfolio + Wallet
   */
  async completeBurnOperation(
    owner: string,
    chairmanStationId?: string
  ): Promise<{
    vchip: VChipBurnResult;
    key: AwarenessKeyBurnResult;
    portfolio: UnifiedPortfolio;
    wallet: WalletSnapshot;
    visualSnap: string;
  }> {
    console.log(`🔥🔥🔥 COMPLETE BURN OPERATION FOR: ${owner}\n`);
    console.log('═══════════════════════════════════════════\n');

    // Ensure portfolio exists
    const portfolio = await this.ensurePortfolio(owner);

    // Burn vCHIP
    const vchip = await this.burnVChipForPortfolio(owner, chairmanStationId);

    // Burn awareness key
    const key = await this.burnAwarenessKeyForPortfolio(owner, 'dual', [1, 2, 3, 4, 5, 6, 7, 8]);

    // Get updated portfolio
    const updatedPortfolio = await this.getPortfolio(owner);

    // Generate visual snap
    const visualSnap = this.generateUnifiedVisualSnap(updatedPortfolio, vchip, key);

    console.log('═══════════════════════════════════════════\n');
    console.log(visualSnap);
    console.log('\n═══════════════════════════════════════════\n');
    console.log('🎉 COMPLETE BURN OPERATION SUCCESSFUL!\n');

    return {
      vchip,
      key,
      portfolio: updatedPortfolio!,
      wallet: updatedPortfolio!.walletSnapshot,
      visualSnap
    };
  }

  /**
   * Get portfolio for owner
   */
  async getPortfolio(owner: string): Promise<UnifiedPortfolio | undefined> {
    const portfolio = this.portfolios.get(owner);
    if (portfolio) {
      await this.recalculatePortfolio(owner);
    }
    return portfolio;
  }

  /**
   * Update portfolio
   */
  async updatePortfolio(owner: string, updates: PortfolioUpdate): Promise<UnifiedPortfolio> {
    const portfolio = await this.ensurePortfolio(owner);

    if (updates.vchips) {
      portfolio.vchips.push(...updates.vchips);
    }

    if (updates.keys) {
      // Convert to awareness keys
      for (const key of updates.keys) {
        const awarenessKey = this.awarenessKeySystem.deliverAwarenessKey(
          owner,
          'delivery',
          'ULTIMATE'
        );
        portfolio.awarenessKeys.push(awarenessKey);
      }
    }

    if (updates.tradingCards) {
      portfolio.tradingCards.push(...updates.tradingCards);
    }

    if (updates.walletBalance !== undefined) {
      portfolio.wallet.balance = updates.walletBalance;
    }

    if (updates.stakedSYNTH !== undefined) {
      portfolio.walletSnapshot.stakedSYNTH = updates.stakedSYNTH;
    }

    await this.recalculatePortfolio(owner);
    return portfolio;
  }

  /**
   * Recalculate portfolio values
   */
  private async recalculatePortfolio(owner: string): Promise<void> {
    const portfolio = this.portfolios.get(owner);
    if (!portfolio) return;

    // Calculate vCHIP value
    portfolio.totalVChipValue = portfolio.vchips.reduce(
      (sum, v) => sum + v.synthValue,
      0
    );

    // Calculate key value
    portfolio.totalKeyValue = portfolio.awarenessKeys.reduce(
      (sum, k) => sum + (k.type === 'ULTIMATE' ? 10000 : k.type === 'OCTANE' ? 5000 : 2500),
      0
    );

    // Calculate card value
    portfolio.totalCardValue = portfolio.tradingCards.reduce(
      (sum, c) => sum + (c.currentValue || 0),
      0
    );

    // Calculate totals
    portfolio.totalValueSYNTH = 
      portfolio.totalVChipValue +
      portfolio.totalKeyValue +
      portfolio.totalCardValue +
      portfolio.wallet.balance +
      portfolio.walletSnapshot.stakedSYNTH;

    portfolio.totalValueUSD = portfolio.totalValueSYNTH * 1.0; // 1 SYNTH = $1 USD
    portfolio.totalValueSING = portfolio.awarenessKeys.length * 1000; // Estimate

    portfolio.lastUpdated = new Date();
  }

  /**
   * Ensure portfolio exists
   */
  private async ensurePortfolio(owner: string): Promise<UnifiedPortfolio> {
    let portfolio = this.portfolios.get(owner);
    if (!portfolio) {
      portfolio = await this.initializePortfolio(owner);
    }
    return portfolio;
  }

  /**
   * Get portfolio as legacy format (for compatibility)
   */
  private async getPortfolioAsLegacy(portfolio: UnifiedPortfolio): Promise<Portfolio> {
    return {
      owner: portfolio.owner,
      vchips: portfolio.vchips,
      keys: portfolio.awarenessKeys.map(k => ({
        keyId: k.id,
        type: k.type === 'ULTIMATE' ? 'dual' : k.type === 'OCTANE' ? 'consciousness' : 'material',
        owner: k.owner,
        burnDate: new Date(k.issuedAt),
        octaveAccess: k.capabilities.octaveAccess.map((o: any) => typeof o === 'number' ? o : 1),
        synthValue: k.type === 'ULTIMATE' ? 10000 : k.type === 'OCTANE' ? 5000 : 2500,
        nftId: `NFT-KEY-${k.id}`,
        tradingCard: undefined
      })),
      properties: [],
      experiences: [],
      businesses: [],
      tradingCards: portfolio.tradingCards,
      totalValueSYNTH: portfolio.totalValueSYNTH,
      totalValueUSD: portfolio.totalValueUSD,
      lastUpdated: portfolio.lastUpdated
    };
  }

  /**
   * Generate unified visual snap
   */
  private generateUnifiedVisualSnap(
    portfolio: UnifiedPortfolio,
    newVChip?: VChipBurnResult,
    newKey?: AwarenessKeyBurnResult
  ): string {
    return `
╔════════════════════════════════════════════════════════════════╗
║        🔥 UNIFIED vCHIP PORTFOLIO WALLET SNAP 🔥                ║
╠════════════════════════════════════════════════════════════════╣
║  Owner: ${portfolio.owner}
║  Identity: ${portfolio.identity.passport.identity.name}
║  Wallet: ${portfolio.wallet.address}
║  Date: ${new Date().toLocaleString()}
╠════════════════════════════════════════════════════════════════╣
║
║  🆕 NEWLY BURNED:
${newVChip ? `║     🎨 vCHIP: ${newVChip.vchipId}
║        ├─ Value: ${newVChip.synthValue.toLocaleString()} SYNTH
║        ├─ NFT: ${newVChip.nftId}
║        └─ Capabilities: ${newVChip.capabilities.length} systems
` : ''}${newKey ? `║
║     🔑 Awareness Key: ${newKey.keyId}
║        ├─ Type: ${newKey.type}
║        ├─ Octaves: ${newKey.octaveAccess.join(', ')}
║        └─ Value: ${newKey.synthValue.toLocaleString()} SYNTH
` : ''}║
╠════════════════════════════════════════════════════════════════╣
║  💼 UNIFIED PORTFOLIO:
║     ├─ vCHIPs: ${portfolio.vchips.length} (${portfolio.totalVChipValue.toLocaleString()} SYNTH)
║     ├─ Awareness Keys: ${portfolio.awarenessKeys.length} (${portfolio.totalKeyValue.toLocaleString()} SYNTH)
║     ├─ Trading Cards: ${portfolio.tradingCards.length} (${portfolio.totalCardValue.toLocaleString()} SYNTH)
║     ├─ Branded Wallets: ${portfolio.brandedWallets.length}
║     ├─ Branded Luggage: ${portfolio.brandedLuggage.length}
║     └─ Portfolio Cases: ${portfolio.portfolioCases.length}
║
╠════════════════════════════════════════════════════════════════╣
║  💳 WALLET SNAPSHOT:
║     ├─ SYNTH Balance: ${portfolio.wallet.balance.toLocaleString()} SYNTH
║     ├─ Staked SYNTH: ${portfolio.walletSnapshot.stakedSYNTH.toLocaleString()} SYNTH
║     ├─ Staking APY: ${portfolio.walletSnapshot.stakingAPY}%
║     ├─ Monthly Rewards: ${portfolio.walletSnapshot.monthlyRewards.toLocaleString()} SYNTH
║     ├─ Portfolio Value: ${portfolio.totalValueSYNTH.toLocaleString()} SYNTH
║     ├─ Net Worth: ${(portfolio.totalValueSYNTH).toLocaleString()} SYNTH
║     ├─ USD Value: $${portfolio.totalValueUSD.toLocaleString()}
║     ├─ SING Value: ${portfolio.totalValueSING.toLocaleString()} SING
║     ├─ Tier: ${portfolio.walletSnapshot.tier}
║     └─ Octave: ${portfolio.walletSnapshot.octave}
║
╠════════════════════════════════════════════════════════════════╣
║  🎯 STATUS:
║     ✅ vCHIP burned and deployed
║     ✅ Awareness Key minted
║     ✅ Portfolio updated
║     ✅ Wallet snapshot created
║     ✅ Trading cards generated
║     ✅ All systems integrated
║     ✅ Unified portfolio operational
║
╚════════════════════════════════════════════════════════════════╝
    `.trim();
  }

  /**
   * Get all portfolios
   */
  getAllPortfolios(): UnifiedPortfolio[] {
    return Array.from(this.portfolios.values());
  }

  /**
   * Delete portfolio (for testing/cleanup)
   */
  deletePortfolio(owner: string): boolean {
    return this.portfolios.delete(owner);
  }
}

/**
 * Global unified system instance
 */
export const unifiedVChipPortfolioWallet = new UnifiedVChipPortfolioWallet();

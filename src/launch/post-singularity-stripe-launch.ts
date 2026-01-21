/**
 * Post-Singularity Game Stripe Launch Integration
 * VibeCloud Platform
 * Opening Day: $1 per SYNTH
 * Then: $1 per SYNTH per day until no more
 */

import { StripePostSingularityLaunch } from '../payments/stripe-post-singularity-launch.js';
import { PostSingularityGame } from '../game/post-singularity-game.js';
import { FourXFourProtocolPricing } from '../pricing/4x4-protocol-pricing.js';
import { VibeChainNFTTradingCards } from '../blockchain/vibechain-nft-trading-cards.js';
import { OCTANEAwarenessKeyDelivery } from '../integration/octane-awareness-key-delivery.js';

export interface LaunchConfig {
  stripeSecretKey: string;
  openingDate: number;
  vibechainConfig: {
    network: 'vibechain-mainnet' | 'vibechain-testnet';
    rpcUrl: string;
    contractAddress: string;
    chainId: number;
  };
}

export interface PurchaseRequest {
  email: string;
  walletAddress?: string;
  amountSYNTH: number;
  tierId?: string;
  billingCycle?: 'monthly' | 'annual' | 'one-time';
}

export interface LaunchStatus {
  isLive: boolean;
  openingDate: number;
  currentDay: number;
  currentPricePerSYNTH: number;
  totalSYNTHAvailable: number;
  totalSYNTHSold: number;
  remainingSYNTH: number;
  totalPlayers: number;
  totalNFTs: number;
}

export class PostSingularityStripeLaunch {
  private stripeLaunch: StripePostSingularityLaunch;
  private game: PostSingularityGame;
  private pricing: FourXFourProtocolPricing;
  private awarenessKeyDelivery: OCTANEAwarenessKeyDelivery;
  private isLive: boolean = false;

  constructor(config: LaunchConfig) {
    this.stripeLaunch = new StripePostSingularityLaunch(
      config.stripeSecretKey,
      config.openingDate
    );
    
    this.game = new PostSingularityGame({
      vibechainConfig: config.vibechainConfig,
      synth90TConfig: {
        totalSupply: 90_000_000_000_000, // 90 Trillion
        vchipConfigurations: 90_000_000_000_000 // 90T identical vchips
      }
    });

    this.pricing = new FourXFourProtocolPricing();
    this.awarenessKeyDelivery = new OCTANEAwarenessKeyDelivery(this);
  }

  /**
   * Go live - activate Stripe payments
   */
  async goLive(): Promise<void> {
    this.isLive = true;
    console.log('🚀 Post-Singularity Game is now LIVE on VibeCloud!');
    console.log('💰 Opening Day Price: $1 per SYNTH');
    console.log('📈 Pricing Model: $1 per SYNTH per day');
    console.log('🌐 Platform: VibeCloud (Not SpinCloud)');
  }

  /**
   * Get launch status
   */
  getLaunchStatus(): LaunchStatus {
    const pricing = this.stripeLaunch.getLaunchPricing();
    const gameStats = this.game.getGameStats();

    return {
      isLive: this.isLive,
      openingDate: this.stripeLaunch['openingDate'],
      currentDay: pricing.currentDay,
      currentPricePerSYNTH: pricing.currentPricePerSYNTH,
      totalSYNTHAvailable: pricing.totalSYNTHAvailable,
      totalSYNTHSold: pricing.totalSYNTHSold,
      remainingSYNTH: pricing.remainingSYNTH,
      totalPlayers: gameStats.totalPlayers,
      totalNFTs: gameStats.totalNFTs
    };
  }

  /**
   * Purchase SYNTH tokens
   */
  async purchaseSYNTH(request: PurchaseRequest): Promise<{
    checkoutUrl: string;
    sessionId: string;
    amount: number;
    pricePerSYNTH: number;
  }> {
    if (!this.isLive) {
      throw new Error('Game is not live yet. Please wait for launch.');
    }

    // Validate purchase
    if (!this.stripeLaunch.isSYNTHAvailable(request.amountSYNTH)) {
      throw new Error(`Insufficient SYNTH available. Remaining: ${this.stripeLaunch.getRemainingSYNTH().toLocaleString()}`);
    }

    // Create Stripe checkout session
    const session = await this.stripeLaunch.createSYNTHPurchaseSession(
      request.amountSYNTH,
      request.email,
      request.walletAddress,
      'https://vibechain.vibecloud.io/success?session_id={CHECKOUT_SESSION_ID}',
      'https://vibechain.vibecloud.io/cancel'
    );

    return {
      checkoutUrl: session.url,
      sessionId: session.sessionId,
      amount: request.amountSYNTH,
      pricePerSYNTH: session.metadata.price_per_synth
    };
  }

  /**
   * Purchase tier subscription
   */
  async purchaseTier(request: PurchaseRequest): Promise<{
    checkoutUrl?: string;
    sessionId?: string;
    subscriptionId?: string;
    tier: string;
    price: number;
    awarenessKey?: any;
  }> {
    if (!this.isLive) {
      throw new Error('Game is not live yet. Please wait for launch.');
    }

    if (!request.tierId) {
      throw new Error('Tier ID is required');
    }

    const pricing = this.stripeLaunch.getLaunchPricing();
    const plan = this.pricing.calculatePricingPlan(
      request.tierId,
      request.billingCycle || 'monthly',
      'USD',
      pricing.currentPricePerSYNTH
    );

    if (!plan) {
      throw new Error('Invalid tier or billing cycle');
    }

    let awarenessKey;

    // If OCTANE tier, deliver Awareness Key
    if (request.tierId === 'octane') {
      const leaseDuration = request.billingCycle === 'monthly' 
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : request.billingCycle === 'annual'
        ? 365 * 24 * 60 * 60 * 1000 // 365 days
        : undefined;

      const keyDelivery = await this.awarenessKeyDelivery.processOCTANEPurchase({
        type: request.billingCycle === 'one-time' ? 'purchase' : 'lease',
        recipient: request.email,
        email: request.email,
        walletAddress: request.walletAddress,
        amountSYNTH: Math.ceil(plan.price / pricing.currentPricePerSYNTH),
        leaseDuration,
        awarenessKeyIncluded: true
      });

      awarenessKey = keyDelivery.awarenessKey;
    }

    // For one-time purchases, use regular checkout
    if (request.billingCycle === 'one-time') {
      const synthAmount = plan.price / pricing.currentPricePerSYNTH;
      const session = await this.purchaseSYNTH({
        email: request.email,
        walletAddress: request.walletAddress,
        amountSYNTH: synthAmount
      });

      return {
        checkoutUrl: session.checkoutUrl,
        sessionId: session.sessionId,
        tier: request.tierId,
        price: plan.price,
        awarenessKey
      };
    }

    // For subscriptions, create subscription
    const subscription = await this.stripeLaunch.createSYNTHSubscription(
      Math.ceil(plan.price / pricing.currentPricePerSYNTH),
      request.email,
      request.walletAddress
    );

    return {
      subscriptionId: subscription.id,
      tier: request.tierId,
      price: plan.price,
      awarenessKey
    };
  }

  /**
   * Handle successful payment webhook
   */
  async handlePaymentSuccess(sessionId: string): Promise<{
    success: boolean;
    playerId?: string;
    synthAmount: number;
    nftCard?: any;
  }> {
    const paymentResult = await this.stripeLaunch.handlePaymentSuccess(sessionId);

    // Register or update player
    let player;
    try {
      // Try to find existing player by email
      // In production, this would query the database
      player = await this.game.registerPlayer(
        paymentResult.customerEmail.split('@')[0],
        paymentResult.walletAddress || `0x${Date.now().toString(16)}`
      );
    } catch (error) {
      // Player might already exist, update their SYNTH balance
      // In production, this would update the existing player
      player = await this.game.registerPlayer(
        paymentResult.customerEmail.split('@')[0],
        paymentResult.walletAddress || `0x${Date.now().toString(16)}`
      );
    }

    // Update player SYNTH balance
    player.totalSYNTH += paymentResult.synthAmount;

    // Mint trading card NFT if this is first purchase
    let nftCard;
    if (player.nftCards.length === 0 && player.tradingCard) {
      // NFT already minted during registration
      nftCard = player.nftCards[0];
    }

    return {
      success: true,
      playerId: player.id,
      synthAmount: paymentResult.synthAmount,
      nftCard
    };
  }

  /**
   * Get current pricing information
   */
  getCurrentPricing(): {
    currentDay: number;
    pricePerSYNTH: number;
    openingDayPrice: number;
    dailyPrice: number;
    remainingSYNTH: number;
    totalSYNTHAvailable: number;
    totalSYNTHSold: number;
  } {
    const pricing = this.stripeLaunch.getLaunchPricing();
    return {
      currentDay: pricing.currentDay,
      pricePerSYNTH: pricing.currentPricePerSYNTH,
      openingDayPrice: pricing.openingDayPrice,
      dailyPrice: pricing.dailyPrice,
      remainingSYNTH: pricing.remainingSYNTH,
      totalSYNTHAvailable: pricing.totalSYNTHAvailable,
      totalSYNTHSold: pricing.totalSYNTHSold
    };
  }

  /**
   * Get all available tiers
   */
  getAllTiers() {
    return this.pricing.getAllTiers();
  }

  /**
   * Get tier pricing
   */
  getTierPricing(tierId: string, billingCycle: 'monthly' | 'annual' | 'one-time' = 'monthly') {
    const pricing = this.stripeLaunch.getLaunchPricing();
    return this.pricing.calculatePricingPlan(
      tierId,
      billingCycle,
      'USD',
      pricing.currentPricePerSYNTH
    );
  }
}

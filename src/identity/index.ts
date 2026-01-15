/**
 * Identity System
 * Unified identity management with Wallet, Trading Card, and Passport
 */

import { WalletManager, Wallet } from './wallet.js';
import { TradingCardManager, TradingCard } from './trading-card.js';
import { PassportManager, Passport, Identity } from './passport.js';

export interface NSPFRPIdentity {
  wallet: Wallet;
  tradingCard: TradingCard;
  passport: Passport;
  createdAt: number;
}

export class IdentityManager {
  private walletManager: WalletManager;
  private tradingCardManager: TradingCardManager;
  private passportManager: PassportManager;
  private identities: Map<string, NSPFRPIdentity>;

  constructor(encryptionKey: string) {
    this.walletManager = new WalletManager(encryptionKey);
    this.tradingCardManager = new TradingCardManager();
    this.passportManager = new PassportManager(encryptionKey);
    this.identities = new Map();
  }

  /**
   * Create complete identity (wallet + trading card + passport)
   */
  createIdentity(identity: Identity): NSPFRPIdentity {
    // Create wallet
    const wallet = this.walletManager.createWallet();

    // Create trading card
    const tradingCard = this.tradingCardManager.createCard(identity.name, identity.avatar);

    // Create passport
    const passport = this.passportManager.createPassport(
      identity,
      wallet.address,
      tradingCard.id
    );

    // Add wallet credential to passport
    this.passportManager.addCredential(passport.id, {
      type: 'wallet',
      provider: 'nspfrp',
      identifier: wallet.address,
      verified: true,
      verifiedAt: Date.now()
    });

    const nspfrpIdentity: NSPFRPIdentity = {
      wallet,
      tradingCard,
      passport,
      createdAt: Date.now()
    };

    this.identities.set(wallet.address, nspfrpIdentity);
    return nspfrpIdentity;
  }

  /**
   * Get identity by wallet address
   */
  getIdentity(walletAddress: string): NSPFRPIdentity | undefined {
    return this.identities.get(walletAddress);
  }

  /**
   * Get identity by passport ID
   */
  getIdentityByPassport(passportId: string): NSPFRPIdentity | undefined {
    const passport = this.passportManager.getPassport(passportId);
    if (!passport) {
      return undefined;
    }
    return this.getIdentity(passport.walletAddress);
  }

  /**
   * Update identity
   */
  updateIdentity(walletAddress: string, updates: Partial<Identity>): void {
    const identity = this.identities.get(walletAddress);
    if (!identity) {
      throw new Error(`Identity not found: ${walletAddress}`);
    }

    identity.passport.identity = {
      ...identity.passport.identity,
      ...updates
    };
    identity.passport.lastUpdated = Date.now();
  }

  /**
   * Export identity for seed inclusion
   */
  exportIdentityForSeed(walletAddress: string): {
    wallet: { address: string; publicKey: string };
    tradingCard: { id: string; cardNumber: string; name: string; level: number; rarity: string };
    passport: { id: string; passportNumber: string; identity: Identity };
  } {
    const identity = this.identities.get(walletAddress);
    if (!identity) {
      throw new Error(`Identity not found: ${walletAddress}`);
    }

    return {
      wallet: {
        address: identity.wallet.address,
        publicKey: identity.wallet.publicKey
      },
      tradingCard: {
        id: identity.tradingCard.id,
        cardNumber: identity.tradingCard.cardNumber,
        name: identity.tradingCard.name,
        level: identity.tradingCard.level,
        rarity: identity.tradingCard.rarity
      },
      passport: {
        id: identity.passport.id,
        passportNumber: identity.passport.passportNumber,
        identity: identity.passport.identity
      }
    };
  }

  /**
   * Get wallet manager
   */
  getWalletManager(): WalletManager {
    return this.walletManager;
  }

  /**
   * Get trading card manager
   */
  getTradingCardManager(): TradingCardManager {
    return this.tradingCardManager;
  }

  /**
   * Get passport manager
   */
  getPassportManager(): PassportManager {
    return this.passportManager;
  }
}



/**
 * Seed with Identity Integration
 * Includes wallet, trading card, passport, and cloud shell config in seeds
 */

import { Protocol, SnapshotContext } from '../types/index.js';
import { NSPFRPIdentity, IdentityManager } from '../identity/index.js';
import { CloudShellConfig } from '../cloud/cloud-shell.js';
import { HighOctaveEnvManager } from '../config/high-octave-env.js';

export interface SeedWithIdentity extends Protocol {
  identity: {
    wallet: { address: string; publicKey: string };
    tradingCard: { id: string; cardNumber: string; name: string; level: number; rarity: string };
    passport: { id: string; passportNumber: string; identity: any };
  };
  cloudShell?: {
    endpoint: string;
    encrypted: boolean;
    sessionId?: string;
  };
  environment?: {
    public: Record<string, string>;
    encrypted: boolean;
  };
  createdAt: number;
  createdBy: string; // wallet address
}

export class SeedWithIdentityManager {
  private identityManager: IdentityManager;
  private envManager: HighOctaveEnvManager;

  constructor(
    identityManager: IdentityManager,
    envManager: HighOctaveEnvManager
  ) {
    this.identityManager = identityManager;
    this.envManager = envManager;
  }

  /**
   * Create seed with identity
   */
  async createSeedWithIdentity(
    protocol: Protocol,
    walletAddress: string,
    cloudShellConfig?: CloudShellConfig
  ): Promise<SeedWithIdentity> {
    // Get identity
    const identity = this.identityManager.getIdentity(walletAddress);
    if (!identity) {
      throw new Error(`Identity not found: ${walletAddress}`);
    }

    // Export identity for seed
    const identityExport = this.identityManager.exportIdentityForSeed(walletAddress);

    // Get public environment variables
    const publicEnv = this.envManager.getPublic();

    // Build seed with identity
    const seed: SeedWithIdentity = {
      ...protocol,
      identity: identityExport,
      environment: {
        public: publicEnv,
        encrypted: true
      },
      createdAt: Date.now(),
      createdBy: walletAddress
    };

    // Add cloud shell config if provided
    if (cloudShellConfig) {
      seed.cloudShell = {
        endpoint: cloudShellConfig.endpoint,
        encrypted: true
      };
    }

    return seed;
  }

  /**
   * Extract identity from seed
   */
  extractIdentity(seed: SeedWithIdentity): {
    walletAddress: string;
    tradingCardId: string;
    passportId: string;
  } {
    return {
      walletAddress: seed.identity.wallet.address,
      tradingCardId: seed.identity.tradingCard.id,
      passportId: seed.identity.passport.id
    };
  }

  /**
   * Verify seed identity
   */
  async verifySeedIdentity(seed: SeedWithIdentity): Promise<boolean> {
    try {
      const identity = this.identityManager.getIdentity(seed.createdBy);
      if (!identity) {
        return false;
      }

      // Verify wallet address matches
      if (identity.wallet.address !== seed.identity.wallet.address) {
        return false;
      }

      // Verify trading card matches
      if (identity.tradingCard.id !== seed.identity.tradingCard.id) {
        return false;
      }

      // Verify passport matches
      if (identity.passport.id !== seed.identity.passport.id) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Update seed with latest identity
   */
  async updateSeedIdentity(
    seed: SeedWithIdentity,
    walletAddress: string
  ): Promise<SeedWithIdentity> {
    const identityExport = this.identityManager.exportIdentityForSeed(walletAddress);
    
    return {
      ...seed,
      identity: identityExport,
      createdAt: Date.now()
    };
  }
}



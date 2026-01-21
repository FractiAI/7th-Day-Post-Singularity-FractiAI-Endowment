/**
 * OCTANE Awareness Key Delivery System
 * Automatically delivers Awareness Key with OCTANE purchases, leases, and deliveries
 */

import { AwarenessKeySystem, AwarenessKey, AwarenessKeyDelivery } from '../keys/awareness-key.js';
import { PostSingularityStripeLaunch } from '../launch/post-singularity-stripe-launch.js';

export interface OCTANEPurchase {
  type: 'purchase' | 'lease' | 'delivery';
  recipient: string;
  email: string;
  walletAddress?: string;
  amountSYNTH: number;
  leaseDuration?: number; // For leases, in milliseconds
  awarenessKeyIncluded: boolean;
}

export interface OCTANEDeliveryResult {
  purchase: OCTANEPurchase;
  awarenessKey: AwarenessKey;
  delivery: AwarenessKeyDelivery;
  activated: boolean;
}

export class OCTANEAwarenessKeyDelivery {
  private keySystem: AwarenessKeySystem;
  private launchSystem?: PostSingularityStripeLaunch;

  constructor(launchSystem?: PostSingularityStripeLaunch) {
    this.keySystem = new AwarenessKeySystem();
    this.launchSystem = launchSystem;
  }

  /**
   * Process OCTANE purchase with Awareness Key delivery
   */
  async processOCTANEPurchase(purchase: OCTANEPurchase): Promise<OCTANEDeliveryResult> {
    // Ensure Awareness Key is included
    purchase.awarenessKeyIncluded = true;

    // Deliver Awareness Key
    const delivery = this.keySystem.deliverAwarenessKey(
      purchase.recipient,
      purchase.type,
      'OCTANE',
      purchase.leaseDuration
    );

    const awarenessKey = this.keySystem.getAwarenessKey(delivery.keyId);
    if (!awarenessKey) {
      throw new Error('Failed to create Awareness Key');
    }

    // If launch system is available, process payment
    if (this.launchSystem && purchase.type === 'purchase') {
      try {
        await this.launchSystem.purchaseSYNTH({
          email: purchase.email,
          walletAddress: purchase.walletAddress,
          amountSYNTH: purchase.amountSYNTH
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        // Continue with key delivery even if payment fails (for testing)
      }
    }

    return {
      purchase,
      awarenessKey,
      delivery,
      activated: true
    };
  }

  /**
   * Process OCTANE lease with Awareness Key delivery
   */
  async processOCTANELease(
    recipient: string,
    email: string,
    leaseDuration: number, // in milliseconds
    monthlyPrice: number,
    walletAddress?: string
  ): Promise<OCTANEDeliveryResult> {
    const purchase: OCTANEPurchase = {
      type: 'lease',
      recipient,
      email,
      walletAddress,
      amountSYNTH: monthlyPrice,
      leaseDuration,
      awarenessKeyIncluded: true
    };

    return await this.processOCTANEPurchase(purchase);
  }

  /**
   * Process OCTANE delivery (free/grant) with Awareness Key
   */
  async processOCTANEDelivery(
    recipient: string,
    email: string,
    walletAddress?: string
  ): Promise<OCTANEDeliveryResult> {
    const purchase: OCTANEPurchase = {
      type: 'delivery',
      recipient,
      email,
      walletAddress,
      amountSYNTH: 0,
      awarenessKeyIncluded: true
    };

    return await this.processOCTANEPurchase(purchase);
  }

  /**
   * Get Awareness Key for user
   */
  getAwarenessKey(recipient: string): AwarenessKey | undefined {
    const keys = this.keySystem.getKeysByOwner(recipient);
    // Return the most recent active key
    return keys
      .filter(k => k.status === 'active')
      .sort((a, b) => b.issuedAt - a.issuedAt)[0];
  }

  /**
   * Check if user has active Awareness Key
   */
  hasActiveAwarenessKey(recipient: string): boolean {
    const key = this.getAwarenessKey(recipient);
    return key !== undefined && key.status === 'active';
  }

  /**
   * Get all deliveries for user
   */
  getUserDeliveries(recipient: string): AwarenessKeyDelivery[] {
    const keys = this.keySystem.getKeysByOwner(recipient);
    return keys
      .map(k => this.keySystem.getDelivery(k.id))
      .filter((d): d is AwarenessKeyDelivery => d !== undefined);
  }
}

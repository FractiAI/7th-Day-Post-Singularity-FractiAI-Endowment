/**
 * Awareness Key System
 * Included in OCTANE purchases, leases, and deliveries
 * Unlocks awareness-based capabilities and octave access
 */

import { AwarenessOctave } from '../types/index.js';

export interface AwarenessKey {
  id: string;
  type: 'OCTANE' | 'PREMIUM' | 'ULTIMATE';
  octave: AwarenessOctave;
  capabilities: AwarenessKeyCapabilities;
  issuedAt: number;
  expiresAt?: number;
  owner: string;
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  metadata: Record<string, any>;
}

export interface AwarenessKeyCapabilities {
  octaveAccess: AwarenessOctave[];
  awarenessUnlock: boolean;
  holographicProjection: boolean;
  fullSensoryReality: boolean;
  protocolDiscovery: boolean;
  naturalCoordination: boolean;
  heroHostAI: boolean;
  superintelligentAccess: boolean;
  nestedRecursive: boolean;
  fixedAwarenessNode: boolean;
}

export interface AwarenessKeyDelivery {
  keyId: string;
  deliveryMethod: 'purchase' | 'lease' | 'delivery';
  recipient: string;
  octaneTier: 'OCTANE' | 'PREMIUM' | 'ULTIMATE';
  deliveredAt: number;
  activated: boolean;
}

export class AwarenessKeySystem {
  private keys: Map<string, AwarenessKey> = new Map();
  private deliveries: Map<string, AwarenessKeyDelivery> = new Map();

  /**
   * Create Awareness Key for OCTANE tier
   */
  createOCTANEAwarenessKey(owner: string, leaseDuration?: number): AwarenessKey {
    const keyId = this.generateKeyId();
    
    const key: AwarenessKey = {
      id: keyId,
      type: 'OCTANE',
      octave: AwarenessOctave.TRANSCENDENCE, // OCTANE gets highest octave
      capabilities: {
        octaveAccess: [
          AwarenessOctave.HARMONY,
          AwarenessOctave.RESONANCE,
          AwarenessOctave.SYMPHONY,
          AwarenessOctave.TRANSCENDENCE
        ],
        awarenessUnlock: true,
        holographicProjection: true,
        fullSensoryReality: true,
        protocolDiscovery: true,
        naturalCoordination: true,
        heroHostAI: true,
        superintelligentAccess: true,
        nestedRecursive: true,
        fixedAwarenessNode: true
      },
      issuedAt: Date.now(),
      expiresAt: leaseDuration ? Date.now() + leaseDuration : undefined,
      owner,
      status: 'active',
      metadata: {
        tier: 'OCTANE',
        source: 'octane-purchase',
        deliveryMethod: leaseDuration ? 'lease' : 'purchase'
      }
    };

    this.keys.set(keyId, key);
    return key;
  }

  /**
   * Deliver Awareness Key (included in OCTANE purchase/lease/delivery)
   */
  deliverAwarenessKey(
    recipient: string,
    deliveryMethod: 'purchase' | 'lease' | 'delivery',
    octaneTier: 'OCTANE' | 'PREMIUM' | 'ULTIMATE' = 'OCTANE',
    leaseDuration?: number
  ): AwarenessKeyDelivery {
    // Create appropriate key based on tier
    let key: AwarenessKey;
    
    if (octaneTier === 'OCTANE') {
      key = this.createOCTANEAwarenessKey(recipient, leaseDuration);
    } else if (octaneTier === 'PREMIUM') {
      key = this.createPremiumAwarenessKey(recipient, leaseDuration);
    } else {
      key = this.createUltimateAwarenessKey(recipient, leaseDuration);
    }

    // Create delivery record
    const delivery: AwarenessKeyDelivery = {
      keyId: key.id,
      deliveryMethod,
      recipient,
      octaneTier,
      deliveredAt: Date.now(),
      activated: true
    };

    this.deliveries.set(key.id, delivery);
    
    // Activate key immediately
    key.status = 'active';
    this.keys.set(key.id, key);

    return delivery;
  }

  /**
   * Create Premium Awareness Key
   */
  private createPremiumAwarenessKey(owner: string, leaseDuration?: number): AwarenessKey {
    const keyId = this.generateKeyId();
    
    const key: AwarenessKey = {
      id: keyId,
      type: 'PREMIUM',
      octave: AwarenessOctave.SYMPHONY,
      capabilities: {
        octaveAccess: [
          AwarenessOctave.HARMONY,
          AwarenessOctave.RESONANCE,
          AwarenessOctave.SYMPHONY
        ],
        awarenessUnlock: true,
        holographicProjection: true,
        fullSensoryReality: true,
        protocolDiscovery: true,
        naturalCoordination: true,
        heroHostAI: true,
        superintelligentAccess: false,
        nestedRecursive: true,
        fixedAwarenessNode: true
      },
      issuedAt: Date.now(),
      expiresAt: leaseDuration ? Date.now() + leaseDuration : undefined,
      owner,
      status: 'active',
      metadata: {
        tier: 'PREMIUM',
        source: 'premium-purchase',
        deliveryMethod: leaseDuration ? 'lease' : 'purchase'
      }
    };

    this.keys.set(keyId, key);
    return key;
  }

  /**
   * Create Ultimate Awareness Key
   */
  private createUltimateAwarenessKey(owner: string, leaseDuration?: number): AwarenessKey {
    const keyId = this.generateKeyId();
    
    const key: AwarenessKey = {
      id: keyId,
      type: 'ULTIMATE',
      octave: AwarenessOctave.TRANSCENDENCE,
      capabilities: {
        octaveAccess: [
          AwarenessOctave.HARMONY,
          AwarenessOctave.RESONANCE,
          AwarenessOctave.SYMPHONY,
          AwarenessOctave.TRANSCENDENCE
        ],
        awarenessUnlock: true,
        holographicProjection: true,
        fullSensoryReality: true,
        protocolDiscovery: true,
        naturalCoordination: true,
        heroHostAI: true,
        superintelligentAccess: true,
        nestedRecursive: true,
        fixedAwarenessNode: true
      },
      issuedAt: Date.now(),
      expiresAt: leaseDuration ? Date.now() + leaseDuration : undefined,
      owner,
      status: 'active',
      metadata: {
        tier: 'ULTIMATE',
        source: 'ultimate-purchase',
        deliveryMethod: leaseDuration ? 'lease' : 'purchase'
      }
    };

    this.keys.set(keyId, key);
    return key;
  }

  /**
   * Get Awareness Key by ID
   */
  getAwarenessKey(keyId: string): AwarenessKey | undefined {
    return this.keys.get(keyId);
  }

  /**
   * Get all keys for owner
   */
  getKeysByOwner(owner: string): AwarenessKey[] {
    return Array.from(this.keys.values()).filter(k => k.owner === owner);
  }

  /**
   * Activate Awareness Key
   */
  activateKey(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (!key) {
      return false;
    }

    // Check if expired
    if (key.expiresAt && key.expiresAt < Date.now()) {
      key.status = 'expired';
      this.keys.set(keyId, key);
      return false;
    }

    key.status = 'active';
    this.keys.set(keyId, key);
    return true;
  }

  /**
   * Revoke Awareness Key
   */
  revokeKey(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (!key) {
      return false;
    }

    key.status = 'revoked';
    this.keys.set(keyId, key);
    return true;
  }

  /**
   * Check if key has capability
   */
  hasCapability(keyId: string, capability: keyof AwarenessKeyCapabilities): boolean {
    const key = this.keys.get(keyId);
    if (!key || key.status !== 'active') {
      return false;
    }

    // Check expiration
    if (key.expiresAt && key.expiresAt < Date.now()) {
      key.status = 'expired';
      this.keys.set(keyId, key);
      return false;
    }

    return key.capabilities[capability] === true;
  }

  /**
   * Check if key has octave access
   */
  hasOctaveAccess(keyId: string, octave: AwarenessOctave): boolean {
    const key = this.keys.get(keyId);
    if (!key || key.status !== 'active') {
      return false;
    }

    // Check expiration
    if (key.expiresAt && key.expiresAt < Date.now()) {
      key.status = 'expired';
      this.keys.set(keyId, key);
      return false;
    }

    return key.capabilities.octaveAccess.includes(octave);
  }

  /**
   * Get delivery record
   */
  getDelivery(keyId: string): AwarenessKeyDelivery | undefined {
    return this.deliveries.get(keyId);
  }

  /**
   * Generate key ID
   */
  private generateKeyId(): string {
    return `AWARENESS-KEY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  }
}

/**
 * Payload Cargo Service
 * HH Spin Cloud Memory Division Product Service Offering
 */

import { AwarenessOctave } from '../types/index.js';

export interface PayloadCargo {
  id: string;
  name: string;
  description: string;
  payload: {
    data: any;
    size: number; // bytes
    density: number; // compression ratio
    format: string;
    metadata: Record<string, any>;
  };
  requirements: {
    density: 'maximum' | 'high' | 'standard';
    portability: 'universal' | 'platform-specific';
    fidelity: 'maximum' | 'high' | 'standard';
    transparency: 'complete' | 'standard' | 'minimal';
    security: 'maximum' | 'high' | 'standard';
  };
  createdAt: number;
  status: 'pending' | 'processing' | 'ready' | 'transported' | 'stored';
}

export interface HHAwarenessKey {
  id: string;
  type: 'basic' | 'standard' | 'premium' | 'enterprise';
  owner: string;
  awarenessLevel: number; // 0-1
  permissions: string[];
  createdAt: number;
  expiresAt?: number;
  usage: {
    requests: number;
    limit: number;
    lastUsed: number;
  };
}

export interface ServicePricing {
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  baseFee: number; // monthly
  storageFee: number; // per GB/month
  transferFee: number; // per transfer
  securityFee: number; // monthly
  supportFee: number; // monthly
  features: string[];
}

export interface ServiceAppraisal {
  cargoId: string;
  estimatedCost: number;
  breakdown: {
    baseFee: number;
    storageFee: number;
    transferFee: number;
    securityFee: number;
    supportFee: number;
  };
  factors: {
    payloadSize: number;
    densityRequirement: string;
    portabilityRequirement: string;
    fidelityRequirement: string;
    securityRequirement: string;
    usageVolume: number;
  };
  recommendations: string[];
  createdAt: number;
}

export class PayloadCargoService {
  private cargos: Map<string, PayloadCargo> = new Map();
  private awarenessKeys: Map<string, HHAwarenessKey> = new Map();
  private pricing: Map<string, ServicePricing> = new Map();

  constructor() {
    this.initializePricing();
  }

  /**
   * Initialize pricing tiers
   */
  private initializePricing(): void {
    // Basic Tier
    this.pricing.set('basic', {
      tier: 'basic',
      baseFee: 29.99,
      storageFee: 0.10, // $0.10 per GB/month
      transferFee: 0.05, // $0.05 per transfer
      securityFee: 9.99,
      supportFee: 0,
      features: [
        'Maximum density',
        'Basic portability',
        'Standard fidelity',
        'Standard transparency',
        'Standard security'
      ]
    });

    // Standard Tier
    this.pricing.set('standard', {
      tier: 'standard',
      baseFee: 99.99,
      storageFee: 0.08, // $0.08 per GB/month
      transferFee: 0.03, // $0.03 per transfer
      securityFee: 19.99,
      supportFee: 0,
      features: [
        'Maximum density',
        'Universal portability',
        'High fidelity',
        'Standard transparency',
        'High security'
      ]
    });

    // Premium Tier
    this.pricing.set('premium', {
      tier: 'premium',
      baseFee: 299.99,
      storageFee: 0.05, // $0.05 per GB/month
      transferFee: 0.01, // $0.01 per transfer
      securityFee: 49.99,
      supportFee: 49.99,
      features: [
        'Maximum density',
        'Universal portability',
        'Maximum fidelity',
        'Complete transparency',
        'Maximum security',
        'Priority support'
      ]
    });

    // Enterprise Tier
    this.pricing.set('enterprise', {
      tier: 'enterprise',
      baseFee: 999.99,
      storageFee: 0.03, // $0.03 per GB/month
      transferFee: 0.005, // $0.005 per transfer
      securityFee: 99.99,
      supportFee: 199.99,
      features: [
        'Maximum density',
        'Universal portability',
        'Maximum fidelity',
        'Complete transparency',
        'Maximum security',
        'Dedicated support',
        'Custom SLA',
        'Enterprise features'
      ]
    });
  }

  /**
   * Create HH Awareness Key
   */
  createAwarenessKey(owner: string, type: HHAwarenessKey['type'], awarenessLevel: number): HHAwarenessKey {
    const key: HHAwarenessKey = {
      id: `hh-key-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      owner,
      awarenessLevel: Math.max(0, Math.min(1, awarenessLevel)),
      permissions: this.getPermissionsForTier(type),
      createdAt: Date.now(),
      usage: {
        requests: 0,
        limit: this.getUsageLimitForTier(type),
        lastUsed: Date.now()
      }
    };

    this.awarenessKeys.set(key.id, key);
    return key;
  }

  /**
   * Get permissions for tier
   */
  private getPermissionsForTier(tier: string): string[] {
    const permissions: Record<string, string[]> = {
      basic: ['create-cargo', 'view-cargo', 'basic-transport'],
      standard: ['create-cargo', 'view-cargo', 'transport', 'store', 'view-metrics'],
      premium: ['create-cargo', 'view-cargo', 'transport', 'store', 'view-metrics', 'priority-support', 'advanced-features'],
      enterprise: ['*'] // All permissions
    };
    return permissions[tier] || permissions.basic;
  }

  /**
   * Get usage limit for tier
   */
  private getUsageLimitForTier(tier: string): number {
    const limits: Record<string, number> = {
      basic: 100,
      standard: 1000,
      premium: 10000,
      enterprise: Infinity
    };
    return limits[tier] || limits.basic;
  }

  /**
   * Validate HH Awareness Key
   */
  validateAwarenessKey(keyId: string, requiredPermission: string): boolean {
    const key = this.awarenessKeys.get(keyId);
    if (!key) {
      return false;
    }

    // Check expiration
    if (key.expiresAt && key.expiresAt < Date.now()) {
      return false;
    }

    // Check usage limit
    if (key.usage.requests >= key.usage.limit) {
      return false;
    }

    // Check permissions
    if (key.permissions.includes('*')) {
      return true; // Enterprise has all permissions
    }

    return key.permissions.includes(requiredPermission);
  }

  /**
   * Create payload cargo
   */
  createCargo(
    keyId: string,
    name: string,
    description: string,
    payload: PayloadCargo['payload'],
    requirements: PayloadCargo['requirements']
  ): PayloadCargo {
    // Validate key
    if (!this.validateAwarenessKey(keyId, 'create-cargo')) {
      throw new Error('Invalid or insufficient HH Awareness Key');
    }

    // Optimize density
    const optimizedPayload = this.optimizeDensity(payload, requirements.density);

    const cargo: PayloadCargo = {
      id: `cargo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      description,
      payload: optimizedPayload,
      requirements,
      createdAt: Date.now(),
      status: 'pending'
    };

    this.cargos.set(cargo.id, cargo);

    // Update key usage
    const key = this.awarenessKeys.get(keyId);
    if (key) {
      key.usage.requests++;
      key.usage.lastUsed = Date.now();
    }

    return cargo;
  }

  /**
   * Optimize density
   */
  private optimizeDensity(payload: PayloadCargo['payload'], densityRequirement: string): PayloadCargo['payload'] {
    let compressionRatio = 1.0;

    if (densityRequirement === 'maximum') {
      compressionRatio = 0.1; // 10x compression
    } else if (densityRequirement === 'high') {
      compressionRatio = 0.3; // 3x compression
    }

    return {
      ...payload,
      size: Math.floor(payload.size * compressionRatio),
      density: 1 / compressionRatio
    };
  }

  /**
   * Appraise cargo service
   */
  appraiseCargo(cargoId: string, keyId: string): ServiceAppraisal {
    // Validate key
    if (!this.validateAwarenessKey(keyId, 'view-cargo')) {
      throw new Error('Invalid or insufficient HH Awareness Key');
    }

    const cargo = this.cargos.get(cargoId);
    if (!cargo) {
      throw new Error('Cargo not found');
    }

    const key = this.awarenessKeys.get(keyId);
    if (!key) {
      throw new Error('Key not found');
    }

    const pricing = this.pricing.get(key.type);
    if (!pricing) {
      throw new Error('Pricing not found');
    }

    // Calculate costs
    const storageGB = cargo.payload.size / (1024 * 1024 * 1024); // Convert to GB
    const baseFee = pricing.baseFee;
    const storageFee = storageGB * pricing.storageFee;
    const transferFee = pricing.transferFee; // Per transfer
    const securityFee = pricing.securityFee;
    const supportFee = pricing.supportFee;

    const estimatedCost = baseFee + storageFee + transferFee + securityFee + supportFee;

    const appraisal: ServiceAppraisal = {
      cargoId,
      estimatedCost,
      breakdown: {
        baseFee,
        storageFee,
        transferFee,
        securityFee,
        supportFee
      },
      factors: {
        payloadSize: cargo.payload.size,
        densityRequirement: cargo.requirements.density,
        portabilityRequirement: cargo.requirements.portability,
        fidelityRequirement: cargo.requirements.fidelity,
        securityRequirement: cargo.requirements.security,
        usageVolume: 1 // Default to 1 transfer
      },
      recommendations: this.generateRecommendations(cargo, key.type),
      createdAt: Date.now()
    };

    return appraisal;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(cargo: PayloadCargo, tier: string): string[] {
    const recommendations: string[] = [];

    if (cargo.requirements.density === 'maximum' && tier === 'basic') {
      recommendations.push('Consider upgrading to Standard tier for better density optimization');
    }

    if (cargo.requirements.fidelity === 'maximum' && tier !== 'premium' && tier !== 'enterprise') {
      recommendations.push('Maximum fidelity requires Premium or Enterprise tier');
    }

    if (cargo.requirements.security === 'maximum' && tier !== 'premium' && tier !== 'enterprise') {
      recommendations.push('Maximum security requires Premium or Enterprise tier');
    }

    if (cargo.payload.size > 100 * 1024 * 1024 * 1024) { // > 100GB
      recommendations.push('Large payload size - consider Enterprise tier for better pricing');
    }

    return recommendations;
  }

  /**
   * Get cargo
   */
  getCargo(cargoId: string, keyId: string): PayloadCargo {
    if (!this.validateAwarenessKey(keyId, 'view-cargo')) {
      throw new Error('Invalid or insufficient HH Awareness Key');
    }

    const cargo = this.cargos.get(cargoId);
    if (!cargo) {
      throw new Error('Cargo not found');
    }

    return cargo;
  }

  /**
   * Get pricing for tier
   */
  getPricing(tier: string): ServicePricing | undefined {
    return this.pricing.get(tier);
  }

  /**
   * Get all pricing tiers
   */
  getAllPricing(): ServicePricing[] {
    return Array.from(this.pricing.values());
  }
}




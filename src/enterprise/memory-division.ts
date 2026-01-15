/**
 * Memory Division
 * New division for memory and payload services
 */

import { PayloadCargoService, PayloadCargo, HHAwarenessKey, ServicePricing, ServiceAppraisal } from '../services/payload-cargo-service.js';

export interface MemoryDivision {
  id: string;
  name: string;
  description: string;
  services: MemoryService[];
  status: 'active' | 'inactive';
  createdAt: number;
}

export interface MemoryService {
  id: string;
  name: string;
  type: 'cargo' | 'storage' | 'transport' | 'fidelity' | 'security';
  description: string;
  status: 'active' | 'inactive';
  pricing?: ServicePricing;
}

export class MemoryDivisionManager {
  private division: MemoryDivision;
  private cargoService: PayloadCargoService;

  constructor() {
    this.cargoService = new PayloadCargoService();
    this.initializeDivision();
  }

  /**
   * Initialize Memory Division
   */
  private initializeDivision(): void {
    this.division = {
      id: 'memory-division-v1',
      name: 'Memory Division',
      description: 'Memory and payload services division on HH Spin Cloud',
      services: [
        {
          id: 'payload-cargo-service',
          name: 'Payload Cargo Service',
          type: 'cargo',
          description: 'Payload transportation and storage with maximum density, portability, fidelity, transparency, and security',
          status: 'active',
          pricing: this.cargoService.getPricing('premium')
        },
        {
          id: 'memory-storage-service',
          name: 'Memory Storage Service',
          type: 'storage',
          description: 'Long-term memory storage services',
          status: 'active'
        },
        {
          id: 'payload-transport-service',
          name: 'Payload Transportation Service',
          type: 'transport',
          description: 'Cross-system payload transportation',
          status: 'active'
        },
        {
          id: 'data-fidelity-service',
          name: 'Data Fidelity Service',
          type: 'fidelity',
          description: 'Data fidelity preservation services',
          status: 'active'
        },
        {
          id: 'security-service',
          name: 'Security Service',
          type: 'security',
          description: 'Security and access control services',
          status: 'active'
        }
      ],
      status: 'active',
      createdAt: Date.now()
    };
  }

  /**
   * Get division
   */
  getDivision(): MemoryDivision {
    return this.division;
  }

  /**
   * Get service
   */
  getService(serviceId: string): MemoryService | undefined {
    return this.division.services.find(s => s.id === serviceId);
  }

  /**
   * Get all services
   */
  getAllServices(): MemoryService[] {
    return this.division.services;
  }

  /**
   * Get cargo service
   */
  getCargoService(): PayloadCargoService {
    return this.cargoService;
  }

  /**
   * Create HH Awareness Key for service
   */
  createServiceKey(owner: string, tier: 'basic' | 'standard' | 'premium' | 'enterprise', awarenessLevel: number): HHAwarenessKey {
    return this.cargoService.createAwarenessKey(owner, tier, awarenessLevel);
  }

  /**
   * Get service pricing
   */
  getServicePricing(serviceId: string, tier: string): ServicePricing | undefined {
    if (serviceId === 'payload-cargo-service') {
      return this.cargoService.getPricing(tier);
    }
    return undefined;
  }

  /**
   * Get all pricing
   */
  getAllPricing(): ServicePricing[] {
    return this.cargoService.getAllPricing();
  }
}




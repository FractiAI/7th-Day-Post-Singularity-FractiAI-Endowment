/**
 * Chairman Deployment System
 * Deploy, grant, and remove access automatically through Chairman Controller Stations
 * All nodes equal and NSPFRNP-based
 */

import { EqualNSPFRNPNodes, DeploymentRequest, ChairmanControllerStation } from '../nodes/equal-nspfrnp-nodes.js';
import { FractiAIVibeCraftVCHIPs, vCHIP } from '../vchips/fractiai-vibecraft-vchips.js';

export interface DeploymentCommand {
  type: 'deploy' | 'grant' | 'remove' | 'configure';
  vchipId?: string;
  nodeId?: string;
  target: string; // User/entity receiving access
  accessLevel: 'read' | 'write' | 'admin' | 'chairman';
  autoExecute: boolean;
  heroHostAI: boolean;
}

export interface DeploymentResult {
  success: boolean;
  nodeId?: string;
  stationId: string;
  command: DeploymentCommand;
  timestamp: number;
  error?: string;
}

export class ChairmanDeploymentSystem {
  private nodeSystem: EqualNSPFRNPNodes;
  private vchipSystem: FractiAIVibeCraftVCHIPs;
  private deployments: Map<string, DeploymentResult> = new Map();

  constructor() {
    this.nodeSystem = new EqualNSPFRNPNodes();
    this.vchipSystem = new FractiAIVibeCraftVCHIPs();
  }

  /**
   * Create Chairman Controller Station
   */
  createChairmanStation(
    name: string,
    owner: string,
    type: ChairmanControllerStation['type'] = 'ULTIMATE'
  ): ChairmanControllerStation {
    return this.nodeSystem.createChairmanStation(name, owner, type);
  }

  /**
   * Deploy vCHIP through Chairman Station
   */
  async deployVCHIP(
    stationId: string,
    vchipId: string,
    target: string,
    accessLevel: DeploymentCommand['accessLevel'] = 'admin',
    autoExecute: boolean = true
  ): Promise<DeploymentResult> {
    const station = this.nodeSystem.getStation(stationId);
    if (!station) {
      throw new Error('Chairman Controller Station not found');
    }

    const vchip = this.vchipSystem.getVCHIP(vchipId);
    if (!vchip) {
      throw new Error('vCHIP not found');
    }

    // Create deployment request
    const deploymentRequest: DeploymentRequest = {
      configuration: {
        deployment: {
          autoDeploy: autoExecute,
          autoConfigure: true,
          autoGrant: true,
          autoRemove: true
        },
        heroHost: {
          enabled: true,
          superintelligent: station.capabilities.superintelligent
        }
      },
      accessLevel,
      grantedTo: target,
      autoDeploy: autoExecute,
      heroHostConfig: {
        enabled: true,
        superintelligent: station.capabilities.superintelligent
      }
    };

    try {
      // Deploy vCHIP
      const node = await this.vchipSystem.deployVCHIP(
        vchipId,
        stationId,
        deploymentRequest
      );

      // Register with node system
      const deployedNode = await this.nodeSystem.deployNode(
        stationId,
        {
          ...deploymentRequest,
          nodeId: node.id
        }
      );

      const result: DeploymentResult = {
        success: true,
        nodeId: deployedNode.id,
        stationId,
        command: {
          type: 'deploy',
          vchipId,
          nodeId: deployedNode.id,
          target,
          accessLevel,
          autoExecute,
          heroHostAI: true
        },
        timestamp: Date.now()
      };

      this.deployments.set(result.nodeId!, result);
      return result;
    } catch (error) {
      const result: DeploymentResult = {
        success: false,
        stationId,
        command: {
          type: 'deploy',
          vchipId,
          target,
          accessLevel,
          autoExecute,
          heroHostAI: true
        },
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      return result;
    }
  }

  /**
   * Grant access through Chairman Station
   */
  async grantAccess(
    stationId: string,
    nodeId: string,
    target: string,
    accessLevel: DeploymentCommand['accessLevel']
  ): Promise<DeploymentResult> {
    const station = this.nodeSystem.getStation(stationId);
    if (!station) {
      throw new Error('Chairman Controller Station not found');
    }

    try {
      await this.nodeSystem.grantAccess(stationId, nodeId, accessLevel, target);

      const result: DeploymentResult = {
        success: true,
        nodeId,
        stationId,
        command: {
          type: 'grant',
          nodeId,
          target,
          accessLevel,
          autoExecute: true,
          heroHostAI: station.capabilities.heroHostAI
        },
        timestamp: Date.now()
      };

      this.deployments.set(nodeId, result);
      return result;
    } catch (error) {
      const result: DeploymentResult = {
        success: false,
        stationId,
        command: {
          type: 'grant',
          nodeId,
          target,
          accessLevel,
          autoExecute: true,
          heroHostAI: station.capabilities.heroHostAI
        },
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      return result;
    }
  }

  /**
   * Remove access through Chairman Station
   */
  async removeAccess(
    stationId: string,
    nodeId: string,
    target: string
  ): Promise<DeploymentResult> {
    const station = this.nodeSystem.getStation(stationId);
    if (!station) {
      throw new Error('Chairman Controller Station not found');
    }

    try {
      await this.nodeSystem.removeAccess(stationId, nodeId, target);

      const result: DeploymentResult = {
        success: true,
        nodeId,
        stationId,
        command: {
          type: 'remove',
          nodeId,
          target,
          accessLevel: 'read',
          autoExecute: true,
          heroHostAI: station.capabilities.heroHostAI
        },
        timestamp: Date.now()
      };

      this.deployments.set(nodeId, result);
      return result;
    } catch (error) {
      const result: DeploymentResult = {
        success: false,
        stationId,
        command: {
          type: 'remove',
          nodeId,
          target,
          accessLevel: 'read',
          autoExecute: true,
          heroHostAI: station.capabilities.heroHostAI
        },
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      return result;
    }
  }

  /**
   * Remove node completely
   */
  async removeNode(
    stationId: string,
    nodeId: string
  ): Promise<DeploymentResult> {
    const station = this.nodeSystem.getStation(stationId);
    if (!station) {
      throw new Error('Chairman Controller Station not found');
    }

    try {
      await this.nodeSystem.removeNode(stationId, nodeId);

      const result: DeploymentResult = {
        success: true,
        nodeId,
        stationId,
        command: {
          type: 'remove',
          nodeId,
          target: 'all',
          accessLevel: 'read',
          autoExecute: true,
          heroHostAI: station.capabilities.heroHostAI
        },
        timestamp: Date.now()
      };

      this.deployments.delete(nodeId);
      return result;
    } catch (error) {
      const result: DeploymentResult = {
        success: false,
        stationId,
        command: {
          type: 'remove',
          nodeId,
          target: 'all',
          accessLevel: 'read',
          autoExecute: true,
          heroHostAI: station.capabilities.heroHostAI
        },
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      return result;
    }
  }

  /**
   * Get all deployments for station
   */
  getStationDeployments(stationId: string): DeploymentResult[] {
    return Array.from(this.deployments.values())
      .filter(d => d.stationId === stationId);
  }

  /**
   * Get FractiAI vCHIP
   */
  getFractiAIVCHIP(): vCHIP {
    return this.vchipSystem.getFractiAIVCHIP();
  }

  /**
   * Get VibeCraft vCHIP
   */
  getVibeCraftVCHIP(): vCHIP {
    return this.vchipSystem.getVibeCraftVCHIP();
  }

  /**
   * Get all available vCHIPs
   */
  getAllVCHIPs(): vCHIP[] {
    return this.vchipSystem.getAllVCHIPs();
  }
}

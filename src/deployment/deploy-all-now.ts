/**
 * DEPLOY ALL NOW
 * Deploy FractiAI vCHIP and VibeCraft vCHIP immediately
 * Through Chairman Controller Stations
 * All nodes equal and NSPFRNP-based
 */

import { ChairmanDeploymentSystem } from '../integration/chairman-deployment-system.js';
import { EqualNSPFRNPNodes } from '../nodes/equal-nspfrnp-nodes.js';
import { FractiAIVibeCraftVCHIPs } from '../vchips/fractiai-vibecraft-vchips.js';

export interface DeploymentStatus {
  fractiaiVCHIP: {
    deployed: boolean;
    nodeId?: string;
    stationId?: string;
  };
  vibecraftVCHIP: {
    deployed: boolean;
    nodeId?: string;
    stationId?: string;
  };
  chairmanStation: {
    created: boolean;
    stationId?: string;
  };
  totalNodes: number;
  activeNodes: number;
}

export class DeployAllNow {
  private deploymentSystem: ChairmanDeploymentSystem;
  private nodeSystem: EqualNSPFRNPNodes;
  private vchipSystem: FractiAIVibeCraftVCHIPs;

  constructor() {
    this.deploymentSystem = new ChairmanDeploymentSystem();
    this.nodeSystem = new EqualNSPFRNPNodes();
    this.vchipSystem = new FractiAIVibeCraftVCHIPs();
  }

  /**
   * DEPLOY ALL NOW - Main deployment function
   */
  async deployAllNow(owner: string): Promise<DeploymentStatus> {
    console.log('🚀 DEPLOYING ALL NOW...');
    console.log('📦 FractiAI vCHIP');
    console.log('✨ VibeCraft vCHIP');
    console.log('👑 Chairman Controller Station');
    console.log('⚡ All nodes equal and NSPFRNP-based\n');

    const status: DeploymentStatus = {
      fractiaiVCHIP: { deployed: false },
      vibecraftVCHIP: { deployed: false },
      chairmanStation: { created: false },
      totalNodes: 0,
      activeNodes: 0
    };

    try {
      // 1. Create Chairman Controller Station (ULTIMATE)
      console.log('👑 Creating Ultimate Chairman Controller Station...');
      const station = this.deploymentSystem.createChairmanStation(
        'FractiAI Ultimate Chairman Station',
        owner,
        'ULTIMATE'
      );
      status.chairmanStation = {
        created: true,
        stationId: station.id
      };
      console.log(`✅ Chairman Station created: ${station.id}\n`);

      // 2. Deploy FractiAI vCHIP
      console.log('🎨 Deploying FractiAI vCHIP...');
      const fractiaiDeploy = await this.deploymentSystem.deployVCHIP(
        station.id,
        'fractiai-vchip',
        owner,
        'chairman',
        true // auto-execute
      );

      if (fractiaiDeploy.success) {
        status.fractiaiVCHIP = {
          deployed: true,
          nodeId: fractiaiDeploy.nodeId,
          stationId: station.id
        };
        console.log(`✅ FractiAI vCHIP deployed: ${fractiaiDeploy.nodeId}\n`);
      } else {
        console.error(`❌ FractiAI vCHIP deployment failed: ${fractiaiDeploy.error}\n`);
      }

      // 3. Deploy VibeCraft vCHIP
      console.log('✨ Deploying VibeCraft vCHIP...');
      const vibecraftDeploy = await this.deploymentSystem.deployVCHIP(
        station.id,
        'vibecraft-vchip',
        owner,
        'chairman',
        true // auto-execute
      );

      if (vibecraftDeploy.success) {
        status.vibecraftVCHIP = {
          deployed: true,
          nodeId: vibecraftDeploy.nodeId,
          stationId: station.id
        };
        console.log(`✅ VibeCraft vCHIP deployed: ${vibecraftDeploy.nodeId}\n`);
      } else {
        console.error(`❌ VibeCraft vCHIP deployment failed: ${vibecraftDeploy.error}\n`);
      }

      // 4. Get deployment stats
      const allNodes = this.nodeSystem.getAllNodes();
      status.totalNodes = allNodes.length;
      status.activeNodes = allNodes.filter(n => n.status === 'active').length;

      console.log('📊 Deployment Summary:');
      console.log(`   Total Nodes: ${status.totalNodes}`);
      console.log(`   Active Nodes: ${status.activeNodes}`);
      console.log(`   Chairman Station: ${status.chairmanStation.stationId}`);
      console.log(`   FractiAI vCHIP: ${status.fractiaiVCHIP.deployed ? '✅' : '❌'}`);
      console.log(`   VibeCraft vCHIP: ${status.vibecraftVCHIP.deployed ? '✅' : '❌'}\n`);

      console.log('🎉 DEPLOYMENT COMPLETE!');
      console.log('🌟 All vCHIPs are now live and accessible through Chairman Controller Station');
      console.log('🎨 FractiAI vCHIP: Complete Syntheverse PoC package');
      console.log('✨ VibeCraft vCHIP: Personal creator station');
      console.log('👑 Chairman Station: Full control and management\n');

      return status;
    } catch (error) {
      console.error('❌ Deployment error:', error);
      throw error;
    }
  }

  /**
   * Get deployment status
   */
  getDeploymentStatus(owner: string): DeploymentStatus {
    const allNodes = this.nodeSystem.getAllNodes();
    const ownerNodes = allNodes.filter(n => n.deployedBy.includes(owner));

    return {
      fractiaiVCHIP: {
        deployed: ownerNodes.some(n => n.metadata?.vchipId === 'fractiai-vchip'),
        nodeId: ownerNodes.find(n => n.metadata?.vchipId === 'fractiai-vchip')?.id
      },
      vibecraftVCHIP: {
        deployed: ownerNodes.some(n => n.metadata?.vchipId === 'vibecraft-vchip'),
        nodeId: ownerNodes.find(n => n.metadata?.vchipId === 'vibecraft-vchip')?.id
      },
      chairmanStation: {
        created: ownerNodes.length > 0,
        stationId: ownerNodes[0]?.deployedBy
      },
      totalNodes: allNodes.length,
      activeNodes: allNodes.filter(n => n.status === 'active').length
    };
  }

  /**
   * Grant access to deployed vCHIPs
   */
  async grantAccess(
    stationId: string,
    nodeId: string,
    target: string,
    accessLevel: 'read' | 'write' | 'admin' | 'chairman' = 'admin'
  ): Promise<boolean> {
    try {
      const result = await this.deploymentSystem.grantAccess(
        stationId,
        nodeId,
        target,
        accessLevel
      );
      return result.success;
    } catch (error) {
      console.error('Error granting access:', error);
      return false;
    }
  }

  /**
   * Remove access from deployed vCHIPs
   */
  async removeAccess(
    stationId: string,
    nodeId: string,
    target: string
  ): Promise<boolean> {
    try {
      const result = await this.deploymentSystem.removeAccess(
        stationId,
        nodeId,
        target
      );
      return result.success;
    } catch (error) {
      console.error('Error removing access:', error);
      return false;
    }
  }
}

/**
 * Quick deploy function - deploy everything now
 */
export async function deployAllNow(owner: string = 'fractiai'): Promise<DeploymentStatus> {
  const deployer = new DeployAllNow();
  return await deployer.deployAllNow(owner);
}

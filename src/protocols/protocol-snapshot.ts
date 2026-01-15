/**
 * Protocol Snapshot System
 * Complete protocol state capture with cloud deployment support
 */

import {
  Protocol,
  ProtocolObject,
  SnapshotContext,
  AgentIdentity,
  CloudDeploymentConfig,
  DeploymentButton
} from '../types/index.js';
import { POBSnapshotManager } from './pob-snapshot.js';
import { CloudDeploymentProtocol } from './cloud-deploy.js';
import { GitOperations, GitConfig } from '../git/git-operations.js';

export interface ProtocolSnapshot {
  pob: ProtocolObject;
  deployment?: {
    status: string;
    url?: string;
    platform: string;
  };
  button?: DeploymentButton;
  identity?: {
    wallet: string;
    tradingCard: string;
    passport: string;
  };
  environment?: {
    public: Record<string, string>;
    encrypted: boolean;
  };
  cloudShell?: {
    endpoint: string;
    sessionId?: string;
  };
  createdAt: number;
  version: string;
}

export class ProtocolSnapshotManager {
  private pobManager: POBSnapshotManager;
  private deploymentProtocol: CloudDeploymentProtocol;
  private snapshots: Map<string, ProtocolSnapshot>;
  private git?: GitOperations;

  constructor(
    pobManager: POBSnapshotManager,
    deploymentProtocol: CloudDeploymentProtocol,
    gitConfig?: GitConfig
  ) {
    this.pobManager = pobManager;
    this.deploymentProtocol = deploymentProtocol;
    this.snapshots = new Map();
    if (gitConfig) {
      this.git = new GitOperations(gitConfig);
    }
  }

  /**
   * Create complete protocol snapshot
   */
  async createSnapshot(
    protocol: Protocol,
    context: SnapshotContext,
    agentIdentity: AgentIdentity,
    options?: {
      deploy?: CloudDeploymentConfig;
      createButton?: boolean;
      includeIdentity?: boolean;
      includeEnvironment?: boolean;
      includeCloudShell?: boolean;
    }
  ): Promise<ProtocolSnapshot> {
    // Create POB snapshot
    const pob = await this.pobManager.createPOBSnapshot(
      protocol,
      context,
      agentIdentity
    );

    // Create deployment if requested
    let deployment;
    let button;
    if (options?.deploy) {
      const deploymentStatus = await this.deploymentProtocol.createDeployment(
        protocol,
        options.deploy
      );

      deployment = {
        status: deploymentStatus.status,
        url: deploymentStatus.url,
        platform: options.deploy.platform
      };

      // Create button if requested
      if (options.createButton) {
        button = await this.deploymentProtocol.createDeploymentButton(
          protocol,
          options.deploy,
          `Deploy ${protocol.name} to ${options.deploy.platform}`
        );
      }
    }

    // Build snapshot
    const snapshot: ProtocolSnapshot = {
      pob,
      deployment,
      button,
      identity: options?.includeIdentity ? this.extractIdentity(context) : undefined,
      environment: options?.includeEnvironment ? this.extractEnvironment(context) : undefined,
      cloudShell: options?.includeCloudShell ? this.extractCloudShell(context) : undefined,
      createdAt: Date.now(),
      version: protocol.version
    };

    // Store snapshot
    this.snapshots.set(pob.id, snapshot);

    // Commit and push to git if configured
    if (this.git && this.git.config.autoCommit) {
      await this.commitSnapshotToGit(snapshot);
    }

    return snapshot;
  }

  /**
   * Commit snapshot to git
   */
  private async commitSnapshotToGit(snapshot: ProtocolSnapshot): Promise<void> {
    if (!this.git) {
      return;
    }

    try {
      // Create commit message
      const commitMessage = `Protocol Snapshot: ${snapshot.pob.metadata.name} v${snapshot.version}\n\n` +
        `POB ID: ${snapshot.pob.pobId}\n` +
        `Snapshot ID: ${snapshot.pob.snapshotId}\n` +
        `Protocol ID: ${snapshot.pob.protocolId}\n` +
        `Created: ${new Date(snapshot.createdAt).toISOString()}\n` +
        (snapshot.deployment ? `Deployment: ${snapshot.deployment.platform} - ${snapshot.deployment.url}\n` : '') +
        (snapshot.button ? `Deployment Button: ${snapshot.button.id}\n` : '');

      // Commit
      const commitResult = await this.git.commit(commitMessage);

      if (commitResult.success && this.git.config.autoPush) {
        // Push to remote
        await this.git.push();
      }

      // Tag the snapshot
      await this.git.tagSnapshot(snapshot.pob.id, `snapshot-${snapshot.pob.id}`);
    } catch (error) {
      console.error('Failed to commit snapshot to git:', error);
      // Don't throw - git operations are optional
    }
  }

  /**
   * Get snapshot by POB ID
   */
  getSnapshot(pobId: string): ProtocolSnapshot | undefined {
    return this.snapshots.get(pobId);
  }

  /**
   * Get all snapshots for a protocol
   */
  async getSnapshotsForProtocol(protocolId: string): Promise<ProtocolSnapshot[]> {
    const pobs = await this.pobManager.getPOBsForProtocol(protocolId);
    return pobs
      .map(pob => this.snapshots.get(pob.id))
      .filter((snapshot): snapshot is ProtocolSnapshot => snapshot !== undefined);
  }

  /**
   * Export snapshot as JSON
   */
  exportSnapshot(pobId: string): string {
    const snapshot = this.snapshots.get(pobId);
    if (!snapshot) {
      throw new Error(`Snapshot not found: ${pobId}`);
    }
    return JSON.stringify(snapshot, null, 2);
  }

  /**
   * Export snapshot for seed inclusion
   */
  exportSnapshotForSeed(pobId: string): {
    pob: {
      id: string;
      pobId: string;
      protocolId: string;
      version: string;
      snapshotId: string;
    };
    deployment?: {
      status: string;
      url?: string;
      platform: string;
    };
    button?: {
      id: string;
      label: string;
      platform: string;
      buttonMarkdown: string;
    };
    identity?: {
      wallet: string;
      tradingCard: string;
      passport: string;
    };
    createdAt: number;
    version: string;
  } {
    const snapshot = this.snapshots.get(pobId);
    if (!snapshot) {
      throw new Error(`Snapshot not found: ${pobId}`);
    }

    return {
      pob: {
        id: snapshot.pob.id,
        pobId: snapshot.pob.pobId,
        protocolId: snapshot.pob.protocolId,
        version: snapshot.pob.version,
        snapshotId: snapshot.pob.snapshotId
      },
      deployment: snapshot.deployment,
      button: snapshot.button ? {
        id: snapshot.button.id,
        label: snapshot.button.label,
        platform: snapshot.button.platform,
        buttonMarkdown: snapshot.button.buttonMarkdown
      } : undefined,
      identity: snapshot.identity,
      createdAt: snapshot.createdAt,
      version: snapshot.version
    };
  }

  /**
   * Extract identity from context
   */
  private extractIdentity(context: SnapshotContext): {
    wallet: string;
    tradingCard: string;
    passport: string;
  } | undefined {
    // Extract from context if available
    if (context.mission?.metadata?.identity) {
      return context.mission.metadata.identity;
    }
    return undefined;
  }

  /**
   * Extract environment from context
   */
  private extractEnvironment(context: SnapshotContext): {
    public: Record<string, string>;
    encrypted: boolean;
  } | undefined {
    // Extract from context if available
    if (context.mission?.metadata?.environment) {
      return context.mission.metadata.environment;
    }
    return undefined;
  }

  /**
   * Extract cloud shell from context
   */
  private extractCloudShell(context: SnapshotContext): {
    endpoint: string;
    sessionId?: string;
  } | undefined {
    // Extract from context if available
    if (context.mission?.metadata?.cloudShell) {
      return context.mission.metadata.cloudShell;
    }
    return undefined;
  }

  /**
   * Update snapshot with deployment status
   */
  async updateDeploymentStatus(
    pobId: string,
    deploymentId: string
  ): Promise<void> {
    const snapshot = this.snapshots.get(pobId);
    if (!snapshot) {
      return;
    }

    const deploymentStatus = this.deploymentProtocol.getDeploymentStatus(deploymentId);
    if (deploymentStatus && snapshot.deployment) {
      snapshot.deployment.status = deploymentStatus.status;
      snapshot.deployment.url = deploymentStatus.url;
    }
  }

  /**
   * List all snapshots
   */
  listSnapshots(): ProtocolSnapshot[] {
    return Array.from(this.snapshots.values());
  }
}


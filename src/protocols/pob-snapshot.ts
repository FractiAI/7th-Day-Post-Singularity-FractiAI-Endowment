/**
 * Protocol Object (POB) Snapshot System
 * Versioned, reproducible protocol snapshots
 */

import crypto from 'crypto';
import {
  Protocol,
  ProtocolObject,
  SerializedProtocol,
  SnapshotContext,
  EvolutionStep,
  ValidationResult,
  ComplianceResult,
  AgentIdentity,
  Dependency
} from '../types/index.js';
import { GitOperations, GitConfig } from '../git/git-operations.js';

export class POBSnapshotManager {
  private pobs: Map<string, ProtocolObject>;
  private storage: POBStorage;
  private git?: GitOperations;

  constructor(storage?: POBStorage, gitConfig?: GitConfig) {
    this.pobs = new Map();
    this.storage = storage || new InMemoryPOBStorage();
    if (gitConfig) {
      this.git = new GitOperations(gitConfig);
    }
  }

  /**
   * Create a POB snapshot
   */
  async createPOBSnapshot(
    protocol: Protocol,
    context: SnapshotContext,
    agentIdentity: AgentIdentity
  ): Promise<ProtocolObject> {
    // Serialize protocol
    const serialized = await this.serializeProtocol(protocol);

    // Extract metadata
    const metadata = protocol.metadata;

    // Analyze dependencies
    const dependencies = protocol.dependencies || [];

    // Validate protocol
    const validation = await this.validateProtocol(protocol);

    // Check compliance
    const compliance = await this.checkCompliance(protocol);

    // Check for parent POB
    const parentPOB = await this.findParentPOB(protocol);

    // Create POB
    const pob: ProtocolObject = {
      id: this.generatePOBId(),
      pobId: `POB-${protocol.id}-${Date.now()}`,
      protocolId: protocol.id,
      version: protocol.version,
      snapshotId: this.generateSnapshotId(),
      protocol: serialized,
      metadata,
      dependencies,
      context,
      parentPOB: parentPOB?.id,
      childPOBs: [],
      evolutionPath: parentPOB ? [...parentPOB.evolutionPath] : [],
      validation,
      compliance,
      createdAt: Date.now(),
      createdBy: agentIdentity,
      tags: this.generateTags(protocol, context)
    };

    // Link to parent if exists
    if (parentPOB) {
      await this.addChildPOB(parentPOB.id, pob.id);
    }

    // Store POB
    await this.storePOB(pob);

    // Commit and push to git if configured
    if (this.git && this.git.config.autoCommit) {
      await this.commitSnapshotToGit(pob);
    }

    return pob;
  }

  /**
   * Commit snapshot to git
   */
  private async commitSnapshotToGit(pob: ProtocolObject): Promise<void> {
    if (!this.git) {
      return;
    }

    try {
      // Create snapshot directory structure
      const snapshotDir = `snapshots/${pob.protocolId}/${pob.version}`;
      const snapshotFile = `${snapshotDir}/pob-${pob.id}.json`;

      // Ensure directory exists (would need fs operations)
      // For now, we'll commit the POB data

      // Create commit message
      const commitMessage = `POB Snapshot: ${pob.metadata.name} v${pob.version}\n\n` +
        `POB ID: ${pob.pobId}\n` +
        `Snapshot ID: ${pob.snapshotId}\n` +
        `Protocol ID: ${pob.protocolId}\n` +
        `Created: ${new Date(pob.createdAt).toISOString()}\n` +
        `Tags: ${pob.tags.join(', ')}`;

      // Commit
      const commitResult = await this.git.commit(commitMessage);

      if (commitResult.success && this.git.config.autoPush) {
        // Push to remote
        await this.git.push();
      }

      // Tag the snapshot
      await this.git.tagSnapshot(pob.id, `pob-${pob.id}`);
    } catch (error) {
      console.error('Failed to commit snapshot to git:', error);
      // Don't throw - git operations are optional
    }
  }

  /**
   * Reproduce protocol from POB
   */
  async reproduceFromPOB(
    pobId: string,
    context?: Partial<SnapshotContext>
  ): Promise<Protocol> {
    const pob = await this.loadPOB(pobId);

    // Deserialize protocol
    const protocol = await this.deserializeProtocol(pob.protocol);

    // Apply context adaptations if provided
    if (context) {
      return await this.adaptProtocol(protocol, context, pob.context);
    }

    return protocol;
  }

  /**
   * Evolve POB to new version
   */
  async evolvePOB(
    pobId: string,
    evolution: {
      type: 'addition' | 'modification' | 'removal' | 'refactor';
      description: string;
      changes: Array<{ field: string; from: any; to: any }>;
    },
    agentIdentity: AgentIdentity
  ): Promise<ProtocolObject> {
    const parentPOB = await this.loadPOB(pobId);

    // Reproduce protocol
    const protocol = await this.reproduceFromPOB(pobId);

    // Apply evolution
    const evolvedProtocol = await this.evolveProtocol(protocol, evolution);

    // Create new context
    const newContext: SnapshotContext = {
      ...parentPOB.context,
      evolution,
      operation: 'evolution'
    };

    // Create new POB
    const newPOB = await this.createPOBSnapshot(evolvedProtocol, newContext, agentIdentity);

    // Update lineage
    newPOB.parentPOB = parentPOB.id;
    newPOB.evolutionPath = [
      ...parentPOB.evolutionPath,
      {
        step: parentPOB.evolutionPath.length + 1,
        evolution,
        timestamp: Date.now(),
        pobId: parentPOB.id
      }
    ];

    // Link as child
    await this.addChildPOB(parentPOB.id, newPOB.id);

    return newPOB;
  }

  /**
   * Serialize protocol for storage
   */
  private async serializeProtocol(protocol: Protocol): Promise<SerializedProtocol> {
    return {
      id: protocol.id,
      name: protocol.name,
      version: protocol.version,
      type: protocol.type,
      content: JSON.stringify(protocol),
      structure: protocol.structure,
      checksum: await this.calculateChecksum(protocol)
    };
  }

  /**
   * Deserialize protocol from storage
   */
  private async deserializeProtocol(serialized: SerializedProtocol): Promise<Protocol> {
    const protocol = JSON.parse(serialized.content) as Protocol;

    // Verify checksum
    const checksum = await this.calculateChecksum(protocol);
    if (checksum !== serialized.checksum) {
      throw new Error('POB checksum verification failed');
    }

    return protocol;
  }

  /**
   * Calculate protocol checksum
   */
  private async calculateChecksum(protocol: Protocol): Promise<string> {
    const data = JSON.stringify({
      id: protocol.id,
      name: protocol.name,
      version: protocol.version,
      content: protocol.content,
      structure: protocol.structure
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Find parent POB for protocol
   */
  private async findParentPOB(protocol: Protocol): Promise<ProtocolObject | null> {
    // Search for POBs with same protocol ID but earlier version
    const allPOBs = Array.from(this.pobs.values());
    const candidates = allPOBs
      .filter(pob =>
        pob.protocolId === protocol.id &&
        this.isEarlierVersion(pob.version, protocol.version)
      )
      .sort((a, b) => this.compareVersions(b.version, a.version));

    return candidates[0] || null;
  }

  /**
   * Add child POB reference
   */
  private async addChildPOB(parentId: string, childId: string): Promise<void> {
    const parent = this.pobs.get(parentId);
    if (parent) {
      parent.childPOBs.push(childId);
      await this.storePOB(parent);
    }
  }

  /**
   * Store POB
   */
  private async storePOB(pob: ProtocolObject): Promise<void> {
    this.pobs.set(pob.id, pob);
    await this.storage.save(pob);
  }

  /**
   * Load POB
   */
  private async loadPOB(pobId: string): Promise<ProtocolObject> {
    let pob = this.pobs.get(pobId);
    if (!pob) {
      pob = await this.storage.load(pobId);
      if (pob) {
        this.pobs.set(pobId, pob);
      }
    }
    if (!pob) {
      throw new Error(`POB not found: ${pobId}`);
    }
    return pob;
  }

  /**
   * Validate protocol
   */
  private async validateProtocol(protocol: Protocol): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!protocol.id) errors.push('Protocol ID is required');
    if (!protocol.name) errors.push('Protocol name is required');
    if (!protocol.version) errors.push('Protocol version is required');
    if (!protocol.content) errors.push('Protocol content is required');

    // Structure validation
    if (!protocol.structure) {
      warnings.push('Protocol structure is missing');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check protocol compliance
   */
  private async checkCompliance(protocol: Protocol): Promise<ComplianceResult> {
    const violations: string[] = [];
    const suggestions: string[] = [];

    // Check for required metadata
    if (!protocol.metadata.description) {
      suggestions.push('Add protocol description');
    }

    // Check dependencies
    if (protocol.dependencies && protocol.dependencies.length > 0) {
      const missing = protocol.dependencies.filter(d => !d.required).length;
      if (missing > 0) {
        warnings.push(`${missing} optional dependencies may be missing`);
      }
    }

    return {
      compliant: violations.length === 0,
      violations,
      suggestions
    };
  }

  /**
   * Adapt protocol to new context
   */
  private async adaptProtocol(
    protocol: Protocol,
    newContext: Partial<SnapshotContext>,
    oldContext: SnapshotContext
  ): Promise<Protocol> {
    // Create adapted protocol
    const adapted = { ...protocol };

    // Apply context-specific adaptations
    if (newContext.gear && newContext.gear !== oldContext.gear) {
      // Adapt for different transmission gear
      adapted.metadata = {
        ...adapted.metadata,
        adaptedForGear: newContext.gear.octave
      };
    }

    if (newContext.heroHost && newContext.heroHost !== oldContext.heroHost) {
      // Adapt for different hero host
      adapted.metadata = {
        ...adapted.metadata,
        adaptedForHeroHost: newContext.heroHost.id
      };
    }

    return adapted;
  }

  /**
   * Evolve protocol
   */
  private async evolveProtocol(
    protocol: Protocol,
    evolution: {
      type: 'addition' | 'modification' | 'removal' | 'refactor';
      description: string;
      changes: Array<{ field: string; from: any; to: any }>;
    }
  ): Promise<Protocol> {
    const evolved = { ...protocol };

    // Apply changes
    evolution.changes.forEach(change => {
      (evolved as any)[change.field] = change.to;
    });

    // Increment version
    evolved.version = this.incrementVersion(evolved.version);

    // Update metadata
    evolved.metadata = {
      ...evolved.metadata,
      evolution: evolution.description,
      evolvedAt: Date.now()
    };

    return evolved;
  }

  /**
   * Generate POB ID
   */
  private generatePOBId(): string {
    return `POB-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  /**
   * Generate snapshot ID
   */
  private generateSnapshotId(): string {
    return `SNAP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  /**
   * Generate tags
   */
  private generateTags(protocol: Protocol, context: SnapshotContext): string[] {
    const tags: string[] = [];

    tags.push(protocol.type);
    tags.push(`v${protocol.version}`);
    if (context.gear) tags.push(`gear-${context.gear.octave}`);
    if (context.heroHost) tags.push(`host-${context.heroHost.id}`);
    if (context.mission) tags.push(`mission-${context.mission.type}`);

    return tags;
  }

  /**
   * Compare versions
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }

    return 0;
  }

  /**
   * Check if version is earlier
   */
  private isEarlierVersion(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) < 0;
  }

  /**
   * Increment version
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const lastPart = parseInt(parts[parts.length - 1]) || 0;
    parts[parts.length - 1] = (lastPart + 1).toString();
    return parts.join('.');
  }

  /**
   * Get POB by ID
   */
  async getPOB(pobId: string): Promise<ProtocolObject | undefined> {
    return await this.loadPOB(pobId).catch(() => undefined);
  }

  /**
   * Get all POBs for a protocol
   */
  async getPOBsForProtocol(protocolId: string): Promise<ProtocolObject[]> {
    const allPOBs = Array.from(this.pobs.values());
    return allPOBs.filter(pob => pob.protocolId === protocolId);
  }

  /**
   * Export POB as JSON
   */
  async exportPOB(pobId: string): Promise<string> {
    const pob = await this.loadPOB(pobId);
    return JSON.stringify(pob, null, 2);
  }
}

/**
 * POB Storage Interface
 */
export interface POBStorage {
  save(pob: ProtocolObject): Promise<void>;
  load(pobId: string): Promise<ProtocolObject | null>;
  list(): Promise<string[]>;
}

/**
 * In-Memory POB Storage
 */
export class InMemoryPOBStorage implements POBStorage {
  private storage: Map<string, ProtocolObject>;

  constructor() {
    this.storage = new Map();
  }

  async save(pob: ProtocolObject): Promise<void> {
    this.storage.set(pob.id, pob);
  }

  async load(pobId: string): Promise<ProtocolObject | null> {
    return this.storage.get(pobId) || null;
  }

  async list(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}


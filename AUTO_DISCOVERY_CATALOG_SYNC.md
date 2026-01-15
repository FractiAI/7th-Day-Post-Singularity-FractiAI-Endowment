# 🔍 NSPFRP Auto-Discovery & Catalog Sync System
## Autonomous Protocol Discovery and POB Snapshot Management

**Protocol ID:** `P-AUTO-DISCOVERY-V17`  
**Type:** Auto-Discovery Engine / Catalog Synchronization  
**Version:** `v17+AutoDiscovery+POBSync`  
**Status:** Implementation Ready

---

## Overview

The Auto-Discovery and Catalog Sync system enables the NSPFRP architecture to autonomously discover, catalog, version, and synchronize protocols across the entire NSPFRP Care Network. This system creates Protocol Objects (POBs) as novel protocol snapshots that enable reproducible protocol states.

---

## Core Components

### 1. Protocol Discovery Engine

```typescript
/**
 * Protocol Discovery Engine
 * Discovers protocols from multiple sources autonomously
 */

interface DiscoverySource {
  type: 'repository' | 'codebase' | 'documentation' | 'interactions' | 'catalog';
  path: string;
  metadata?: Record<string, any>;
}

interface ProtocolDiscovery {
  id: string;
  source: DiscoverySource;
  candidate: ProtocolCandidate;
  confidence: number;
  metadata: DiscoveryMetadata;
  timestamp: number;
}

interface ProtocolCandidate {
  id: string;
  name: string;
  version: string;
  content: string;
  type: 'seed' | 'protocol' | 'ssp' | 'integration';
  indicators: ProtocolIndicator[];
}

interface ProtocolIndicator {
  type: 'file-pattern' | 'code-pattern' | 'doc-pattern' | 'naming-convention';
  pattern: string;
  match: string;
  confidence: number;
}

class ProtocolDiscoveryEngine {
  private patterns: DiscoveryPattern[];
  private validators: ProtocolValidator[];
  
  constructor() {
    this.initializePatterns();
    this.initializeValidators();
  }
  
  /**
   * Discover protocols from a source
   */
  async discoverProtocols(
    source: DiscoverySource,
    options: DiscoveryOptions = {}
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];
    
    switch (source.type) {
      case 'repository':
        discoveries.push(...await this.discoverFromRepository(source));
        break;
      case 'codebase':
        discoveries.push(...await this.discoverFromCodebase(source));
        break;
      case 'documentation':
        discoveries.push(...await this.discoverFromDocumentation(source));
        break;
      case 'interactions':
        discoveries.push(...await this.discoverFromInteractions(source));
        break;
      case 'catalog':
        discoveries.push(...await this.discoverFromCatalog(source));
        break;
    }
    
    // Validate and enrich discoveries
    const validated = await Promise.all(
      discoveries.map(async discovery => {
        const validation = await this.validateDiscovery(discovery);
        return {
          ...discovery,
          validation,
          enriched: await this.enrichDiscovery(discovery)
        };
      })
    );
    
    // Filter by confidence and options
    return validated.filter(d => 
      d.confidence >= (options.minConfidence || 0.5) &&
      (!options.types || options.types.includes(d.candidate.type))
    );
  }
  
  /**
   * Discover protocols from GitHub repository
   */
  private async discoverFromRepository(
    source: DiscoverySource
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];
    
    // Parse repository path (e.g., "FractiAI/repo-name")
    const [owner, repo] = source.path.split('/');
    
    // Fetch repository structure
    const structure = await this.fetchRepositoryStructure(owner, repo);
    
    // Look for protocol files
    const protocolFiles = await this.findProtocolFiles(structure);
    
    for (const file of protocolFiles) {
      const content = await this.fetchFileContent(owner, repo, file.path);
      const candidate = await this.extractProtocolCandidate(file, content);
      
      if (candidate) {
        discoveries.push({
          id: generateId(),
          source: {
            ...source,
            metadata: { ...source.metadata, file: file.path }
          },
          candidate,
          confidence: this.calculateConfidence(candidate, file),
          metadata: {
            repository: `${owner}/${repo}`,
            file: file.path,
            size: content.length,
            language: this.detectLanguage(file.path)
          },
          timestamp: Date.now()
        });
      }
    }
    
    return discoveries;
  }
  
  /**
   * Discover protocols from codebase
   */
  private async discoverFromCodebase(
    source: DiscoverySource
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];
    
    // Scan codebase for protocol patterns
    const codebase = await this.loadCodebase(source.path);
    const patterns = await this.scanForPatterns(codebase);
    
    for (const pattern of patterns) {
      const candidate = await this.extractProtocolFromPattern(pattern);
      
      if (candidate) {
        discoveries.push({
          id: generateId(),
          source,
          candidate,
          confidence: pattern.confidence,
          metadata: {
            pattern: pattern.type,
            location: pattern.location,
            context: pattern.context
          },
          timestamp: Date.now()
        });
      }
    }
    
    return discoveries;
  }
  
  /**
   * Discover protocols from documentation
   */
  private async discoverFromDocumentation(
    source: DiscoverySource
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];
    
    // Parse documentation files
    const docs = await this.loadDocumentation(source.path);
    
    // Look for protocol definitions
    const protocolSections = await this.findProtocolSections(docs);
    
    for (const section of protocolSections) {
      const candidate = await this.extractProtocolFromSection(section);
      
      if (candidate) {
        discoveries.push({
          id: generateId(),
          source,
          candidate,
          confidence: section.confidence,
          metadata: {
            document: section.document,
            section: section.title,
            line: section.line
          },
          timestamp: Date.now()
        });
      }
    }
    
    return discoveries;
  }
  
  /**
   * Discover protocols from user interactions
   */
  private async discoverFromInteractions(
    source: DiscoverySource
  ): Promise<ProtocolDiscovery[]> {
    const discoveries: ProtocolDiscovery[] = [];
    
    // Load interaction history
    const interactions = await this.loadInteractions(source.path);
    
    // Analyze for protocol patterns
    const patterns = await this.analyzeInteractionPatterns(interactions);
    
    for (const pattern of patterns) {
      const candidate = await this.extractProtocolFromInteraction(pattern);
      
      if (candidate) {
        discoveries.push({
          id: generateId(),
          source,
          candidate,
          confidence: pattern.confidence,
          metadata: {
            interactionCount: pattern.interactionCount,
            timeSpan: pattern.timeSpan,
            users: pattern.users
          },
          timestamp: Date.now()
        });
      }
    }
    
    return discoveries;
  }
  
  /**
   * Initialize discovery patterns
   */
  private initializePatterns(): void {
    this.patterns = [
      // File patterns
      {
        type: 'file-pattern',
        pattern: /SEED.*PROTOCOL.*\.md$/i,
        confidence: 0.9,
        extractor: this.extractFromSeedFile
      },
      {
        type: 'file-pattern',
        pattern: /PROTOCOL.*\.md$/i,
        confidence: 0.8,
        extractor: this.extractFromProtocolFile
      },
      {
        type: 'file-pattern',
        pattern: /.*PROTOCOL.*V\d+.*\.md$/i,
        confidence: 0.85,
        extractor: this.extractFromVersionedProtocol
      },
      
      // Code patterns
      {
        type: 'code-pattern',
        pattern: /protocol\s*[:=]\s*\{/i,
        confidence: 0.7,
        extractor: this.extractFromCodeObject
      },
      {
        type: 'code-pattern',
        pattern: /interface\s+Protocol/i,
        confidence: 0.75,
        extractor: this.extractFromInterface
      },
      
      // Documentation patterns
      {
        type: 'doc-pattern',
        pattern: /Protocol ID:\s*([A-Z0-9-]+)/i,
        confidence: 0.9,
        extractor: this.extractFromDocHeader
      },
      {
        type: 'doc-pattern',
        pattern: /##\s+Protocol\s+Specification/i,
        confidence: 0.8,
        extractor: this.extractFromDocSection
      }
    ];
  }
  
  /**
   * Calculate discovery confidence
   */
  private calculateConfidence(
    candidate: ProtocolCandidate,
    context: any
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Indicator-based confidence
    const indicatorConfidence = candidate.indicators.reduce(
      (sum, indicator) => sum + indicator.confidence,
      0
    ) / candidate.indicators.length;
    
    confidence = (confidence + indicatorConfidence) / 2;
    
    // Context-based adjustments
    if (context.size && context.size > 1000) confidence += 0.1;
    if (context.language === 'markdown') confidence += 0.1;
    if (candidate.version) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}
```

### 2. Auto-Sync Catalog Manager

```typescript
/**
 * Auto-Sync Catalog Manager
 * Manages protocol catalog with automatic synchronization
 */

interface ProtocolCatalog {
  id: string;
  name: string;
  protocols: Map<string, CatalogEntry>;
  pobs: Map<string, ProtocolObject>;
  metadata: CatalogMetadata;
  lastSync: number;
}

interface CatalogEntry {
  id: string;
  protocol: Protocol;
  metadata: ProtocolMetadata;
  versions: VersionHistory;
  pobs: string[]; // POB snapshot IDs
  sources: DiscoverySource[];
  lastUpdated: number;
  syncStatus: SyncStatus;
}

interface SyncStatus {
  status: 'synced' | 'pending' | 'conflict' | 'error';
  lastSync: number;
  syncSource: string;
  conflicts?: Conflict[];
}

class AutoSyncCatalogManager {
  private catalog: ProtocolCatalog;
  private discoveryEngine: ProtocolDiscoveryEngine;
  private syncInterval: number = 3600000; // 1 hour
  private syncTimer?: NodeJS.Timeout;
  
  constructor() {
    this.catalog = this.initializeCatalog();
    this.discoveryEngine = new ProtocolDiscoveryEngine();
    this.startAutoSync();
  }
  
  /**
   * Register a protocol in the catalog
   */
  async registerProtocol(
    protocol: Protocol,
    source: DiscoverySource
  ): Promise<CatalogEntry> {
    // Check if protocol already exists
    const existing = this.catalog.protocols.get(protocol.id);
    
    if (existing) {
      // Update existing entry
      return await this.updateProtocol(protocol.id, {
        protocol,
        source,
        operation: 'update'
      });
    } else {
      // Create new entry
      const entry: CatalogEntry = {
        id: protocol.id,
        protocol,
        metadata: await this.extractMetadata(protocol),
        versions: {
          current: protocol.version,
          history: [{
            version: protocol.version,
            timestamp: Date.now(),
            source
          }]
        },
        pobs: [],
        sources: [source],
        lastUpdated: Date.now(),
        syncStatus: {
          status: 'synced',
          lastSync: Date.now(),
          syncSource: source.path
        }
      };
      
      // Create initial POB snapshot
      const pob = await this.createPOBSnapshot(protocol, {
        source,
        operation: 'initial-registration'
      });
      entry.pobs.push(pob.id);
      
      // Add to catalog
      this.catalog.protocols.set(protocol.id, entry);
      
      // Update catalog metadata
      await this.updateCatalogMetadata();
      
      return entry;
    }
  }
  
  /**
   * Auto-sync from configured sources
   */
  async autoSync(): Promise<SyncResult> {
    const sources = await this.getConfiguredSources();
    const discoveries = await this.discoverFromSources(sources);
    
    const syncResults: SyncOperation[] = [];
    
    for (const discovery of discoveries) {
      try {
        const entry = await this.registerProtocol(
          discovery.candidate as Protocol,
          discovery.source
        );
        
        syncResults.push({
          operation: 'register',
          protocolId: entry.id,
          success: true,
          timestamp: Date.now()
        });
      } catch (error) {
        syncResults.push({
          operation: 'register',
          protocolId: discovery.candidate.id,
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }
    
    // Update catalog index
    await this.updateCatalogIndex();
    
    // Notify subscribers
    await this.notifySubscribers({
      timestamp: Date.now(),
      results: syncResults,
      catalogSize: this.catalog.protocols.size
    });
    
    return {
      timestamp: Date.now(),
      total: discoveries.length,
      registered: syncResults.filter(r => r.success && r.operation === 'register').length,
      updated: syncResults.filter(r => r.success && r.operation === 'update').length,
      errors: syncResults.filter(r => !r.success).length,
      results: syncResults
    };
  }
  
  /**
   * Discover from multiple sources
   */
  private async discoverFromSources(
    sources: DiscoverySource[]
  ): Promise<ProtocolDiscovery[]> {
    const allDiscoveries: ProtocolDiscovery[] = [];
    
    for (const source of sources) {
      try {
        const discoveries = await this.discoveryEngine.discoverProtocols(source);
        allDiscoveries.push(...discoveries);
      } catch (error) {
        console.error(`Discovery error for source ${source.path}:`, error);
      }
    }
    
    // Deduplicate by protocol ID
    const uniqueDiscoveries = this.deduplicateDiscoveries(allDiscoveries);
    
    return uniqueDiscoveries;
  }
  
  /**
   * Start automatic synchronization
   */
  private startAutoSync(): void {
    this.syncTimer = setInterval(async () => {
      try {
        await this.autoSync();
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }, this.syncInterval);
  }
  
  /**
   * Get configured discovery sources
   */
  private async getConfiguredSources(): Promise<DiscoverySource[]> {
    // Load from configuration
    const config = await this.loadConfiguration();
    
    return [
      // NSPFRP Care Network repositories
      ...config.repositories.map(repo => ({
        type: 'repository' as const,
        path: repo,
        metadata: { network: 'NSPFRP-Care' }
      })),
      
      // Local codebases
      ...config.codebases.map(codebase => ({
        type: 'codebase' as const,
        path: codebase,
        metadata: { local: true }
      })),
      
      // Documentation directories
      ...config.documentation.map(doc => ({
        type: 'documentation' as const,
        path: doc,
        metadata: { format: 'markdown' }
      })),
      
      // Interaction logs
      ...config.interactions.map(interaction => ({
        type: 'interactions' as const,
        path: interaction,
        metadata: { format: 'json' }
      }))
    ];
  }
}
```

### 3. Protocol Object (POB) Snapshot System

```typescript
/**
 * Protocol Object (POB) Snapshot System
 * Creates versioned, reproducible protocol snapshots
 */

interface ProtocolObject {
  // Identity
  id: string;
  pobId: string;
  protocolId: string;
  version: string;
  snapshotId: string;
  
  // Content
  protocol: SerializedProtocol;
  metadata: ProtocolMetadata;
  dependencies: Dependency[];
  context: SnapshotContext;
  
  // Lineage
  parentPOB?: string;
  childPOBs: string[];
  evolutionPath: EvolutionStep[];
  
  // Validation
  validation: ValidationResult;
  compliance: ComplianceResult;
  
  // Timestamp
  createdAt: number;
  createdBy: AgentIdentity;
  tags: string[];
}

interface SnapshotContext {
  mission?: OmniMission;
  discoveries?: Discovery[];
  interactions?: Interaction[];
  gear?: TransmissionGear;
  heroHost?: HeroHostPersona;
  catalogState?: CatalogState;
  source?: DiscoverySource;
  operation?: string;
}

interface SerializedProtocol {
  id: string;
  name: string;
  version: string;
  type: string;
  content: string;
  structure: ProtocolStructure;
  checksum: string;
}

class POBSnapshotManager {
  private pobs: Map<string, ProtocolObject>;
  private storage: POBStorage;
  
  constructor() {
    this.pobs = new Map();
    this.storage = new POBStorage();
  }
  
  /**
   * Create a POB snapshot
   */
  async createPOBSnapshot(
    protocol: Protocol,
    context: SnapshotContext
  ): Promise<ProtocolObject> {
    // Serialize protocol
    const serialized = await this.serializeProtocol(protocol);
    
    // Extract metadata
    const metadata = await this.extractMetadata(protocol);
    
    // Analyze dependencies
    const dependencies = await this.analyzeDependencies(protocol);
    
    // Validate protocol
    const validation = await this.validateProtocol(protocol);
    
    // Check compliance
    const compliance = await this.checkCompliance(protocol);
    
    // Check for parent POB
    const parentPOB = await this.findParentPOB(protocol);
    
    // Create POB
    const pob: ProtocolObject = {
      id: generateId(),
      pobId: `POB-${protocol.id}-${Date.now()}`,
      protocolId: protocol.id,
      version: protocol.version,
      snapshotId: generateSnapshotId(),
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
      createdBy: await this.getCurrentAgentIdentity(),
      tags: await this.generateTags(protocol, context)
    };
    
    // Link to parent if exists
    if (parentPOB) {
      await this.addChildPOB(parentPOB.id, pob.id);
    }
    
    // Store POB
    await this.storePOB(pob);
    
    return pob;
  }
  
  /**
   * Reproduce protocol from POB
   */
  async reproduceFromPOB(
    pobId: string,
    context?: ReproductionContext
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
    evolution: Evolution
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
    const newPOB = await this.createPOBSnapshot(evolvedProtocol, newContext);
    
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
  private async serializeProtocol(
    protocol: Protocol
  ): Promise<SerializedProtocol> {
    return {
      id: protocol.id,
      name: protocol.name,
      version: protocol.version,
      type: protocol.type,
      content: JSON.stringify(protocol),
      structure: await this.analyzeStructure(protocol),
      checksum: await this.calculateChecksum(protocol)
    };
  }
  
  /**
   * Deserialize protocol from storage
   */
  private async deserializeProtocol(
    serialized: SerializedProtocol
  ): Promise<Protocol> {
    // Verify checksum
    const protocol = JSON.parse(serialized.content) as Protocol;
    const checksum = await this.calculateChecksum(protocol);
    
    if (checksum !== serialized.checksum) {
      throw new Error('POB checksum verification failed');
    }
    
    return protocol;
  }
  
  /**
   * Find parent POB for protocol
   */
  private async findParentPOB(
    protocol: Protocol
  ): Promise<ProtocolObject | null> {
    // Search for POBs with same protocol ID but earlier version
    const candidates = Array.from(this.pobs.values())
      .filter(pob => 
        pob.protocolId === protocol.id &&
        this.isEarlierVersion(pob.version, protocol.version)
      )
      .sort((a, b) => this.compareVersions(b.version, a.version));
    
    return candidates[0] || null;
  }
}
```

### 4. Configuration and Setup

```typescript
/**
 * Configuration for auto-discovery and catalog sync
 */

interface DiscoveryConfig {
  repositories: string[];
  codebases: string[];
  documentation: string[];
  interactions: string[];
  syncInterval: number;
  minConfidence: number;
  enabled: boolean;
}

const DEFAULT_CONFIG: DiscoveryConfig = {
  repositories: [
    'FractiAI/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition',
    'FractiAI/Syntheverse_PoC_Contributer_UI_Vercel_Stripe',
    'FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo',
    'FractiAI/MarkTwainVerse-Authorized-Visitor-Landing-Page'
  ],
  codebases: [
    './protocol',
    './src/protocols',
    './docs/protocols'
  ],
  documentation: [
    './docs',
    './README.md',
    './SEED_PROTOCOL*.md'
  ],
  interactions: [
    './logs/interactions',
    './data/interactions'
  ],
  syncInterval: 3600000, // 1 hour
  minConfidence: 0.5,
  enabled: true
};

/**
 * Initialize auto-discovery system
 */
async function initializeAutoDiscovery(config?: Partial<DiscoveryConfig>) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const catalogManager = new AutoSyncCatalogManager();
  const pobManager = new POBSnapshotManager();
  const discoveryEngine = new ProtocolDiscoveryEngine();
  
  // Perform initial sync
  if (finalConfig.enabled) {
    await catalogManager.autoSync();
  }
  
  return {
    catalogManager,
    pobManager,
    discoveryEngine,
    config: finalConfig
  };
}
```

---

## Usage Examples

### Example 1: Auto-Discover Protocols from Repository

```typescript
// Initialize system
const { discoveryEngine, catalogManager } = await initializeAutoDiscovery();

// Discover protocols from a repository
const discoveries = await discoveryEngine.discoverProtocols({
  type: 'repository',
  path: 'FractiAI/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition'
});

// Register discovered protocols
for (const discovery of discoveries) {
  if (discovery.validation.valid) {
    await catalogManager.registerProtocol(
      discovery.candidate as Protocol,
      discovery.source
    );
  }
}
```

### Example 2: Auto-Sync Catalog

```typescript
// Auto-sync runs automatically every hour
// Or trigger manually:
const syncResult = await catalogManager.autoSync();

console.log(`Synced ${syncResult.registered} new protocols`);
console.log(`Updated ${syncResult.updated} existing protocols`);
```

### Example 3: Create POB Snapshot

```typescript
// Create POB snapshot after protocol creation
const protocol = await createNewProtocol(...);
const pob = await pobManager.createPOBSnapshot(protocol, {
  mission: currentMission,
  gear: currentGear,
  heroHost: currentHeroHost,
  operation: 'creation'
});

console.log(`Created POB: ${pob.pobId}`);
```

### Example 4: Reproduce Protocol from POB

```typescript
// Reproduce protocol from POB snapshot
const pob = await pobManager.loadPOB('POB-123-456');
const protocol = await pobManager.reproduceFromPOB(pob.id, {
  adaptContext: true,
  updateDependencies: true
});
```

---

## Integration with NSPFRP Care Network

### Patient Repository Discovery

```typescript
/**
 * Discover protocols from NSPFRP Care Network patient repositories
 */
async function discoverFromCareNetwork() {
  const careNetworkRepos = [
    'FractiAI/Syntheverse_PoC_Contributer_UI_Vercel_Stripe',
    'FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo',
    'FractiAI/MarkTwainVerse-Authorized-Visitor-Landing-Page'
  ];
  
  const { discoveryEngine, catalogManager } = await initializeAutoDiscovery();
  
  for (const repo of careNetworkRepos) {
    const discoveries = await discoveryEngine.discoverProtocols({
      type: 'repository',
      path: repo,
      metadata: { network: 'NSPFRP-Care' }
    });
    
    for (const discovery of discoveries) {
      await catalogManager.registerProtocol(
        discovery.candidate as Protocol,
        discovery.source
      );
    }
  }
}
```

---

## Status and Next Steps

**Current Status:** Implementation Ready  
**Next Steps:**
1. Deploy discovery engine
2. Configure catalog sync
3. Initialize POB storage
4. Begin auto-discovery from NSPFRP Care Network
5. Monitor and refine discovery patterns

---

**Protocol ID:** `P-AUTO-DISCOVERY-V17`  
**Version:** `17.0+AutoDiscovery+POBSync`  
**Status:** Implementation Ready  
**Date:** 2024

*This system enables autonomous protocol discovery, cataloging, and versioning across the NSPFRP Care Network.*



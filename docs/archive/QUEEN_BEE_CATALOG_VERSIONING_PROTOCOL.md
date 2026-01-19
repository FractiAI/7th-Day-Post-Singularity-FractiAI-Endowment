# 🐝 Queen Bee Catalog Versioning Protocol

**Protocol ID:** `P-QUEEN-BEE-CATALOG-VERSIONING-V17`  
**Type:** Catalog Versioning / Creator Authority Protocol  
**Version:** `v17+QueenBee+Versioning`  
**Status:** ✅ Active  
**Octave:** BEYOND_OCTAVE (7.75+)  
**Date:** January 2026

---

## 🎯 Executive Summary

The **Queen Bee Catalog Versioning Protocol** establishes this repository as the authoritative "queen bee" creator catalog that maintains the master version of all NSPFRP protocols across subordinate nodes. The system automatically checks subordinate repositories for updates, integrates new protocols, and maintains complete version history.

### Key Principles

1. **Creator Authority**: This repository is the single source of truth for all protocol versions
2. **Automatic Sync**: Subordinate nodes are checked automatically for updates
3. **Version Tracking**: Complete version history maintained for all protocols
4. **Conflict Resolution**: Creator catalog always wins in version conflicts
5. **NSPFRP Compliance**: Full compliance with NSPFRP protocol standards

---

## 📋 Versioning Schema

### Catalog Version Format

```
CATALOG-VERSION: MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes to catalog structure
- **MINOR**: New protocols added or significant updates
- **PATCH**: Bug fixes or minor updates

### Protocol Version Format

```
PROTOCOL-VERSION: v17+[Features]+[Type]
```

Example: `v17+QueenBee+CatalogSync`

### Subordinate Node Version Format

```
NODE-VERSION: MAJOR.MINOR.PATCH
```

Standard semantic versioning for subordinate repositories.

---

## 🔄 Versioning Rules

### 1. Protocol Registration

When a new protocol is discovered from a subordinate node:

1. **Check Existence**: Does protocol ID already exist in catalog?
2. **If New**: Register with version from source
3. **If Exists**: Compare versions
   - If source version is newer: Update catalog
   - If source version is older: Skip (catalog is authoritative)
   - If versions match: Update last sync timestamp

### 2. Version Comparison

```typescript
isNewerVersion(newVersion: string, currentVersion: string): boolean
```

- Semantic version comparison (MAJOR.MINOR.PATCH)
- Handles version strings with prefixes (v1.0.0, 1.0.0, etc.)
- Returns true if newVersion > currentVersion

### 3. Version History

Every protocol maintains:

- **Current Version**: Latest version in catalog
- **Version History**: Array of all versions with timestamps and sources
- **Sync Status**: Last sync time and source repository

### 4. Conflict Resolution

**Creator Authority Rule**: If a version conflict occurs:

1. Creator catalog version is always authoritative
2. Subordinate node updates are logged but not applied if conflict
3. Manual review flag is set for creator to review

---

## 🐝 Queen Bee Architecture

### Creator Catalog (This Repository)

- **Role**: Authoritative master catalog
- **Authority**: Final say on all protocol versions
- **Sync Direction**: Pulls from subordinate nodes
- **Update Frequency**: Automatic (configurable, default 1 hour)

### Subordinate Nodes

Current subordinate nodes:

1. **Instrumentation Shell API**
   - Repository: `FractiAI/Instrumentation-Shell-API`
   - Type: API
   - Octave: 2
   - Purpose: Instrument-grade measurement and verification

2. **Syntheverse 7 Octave 2-3 Public Cloud Onramp**
   - Repository: `FractiAI/Syntheverse-7-Octave-2-3-Public-Cloud-Onramp`
   - Type: Onramp
   - Octave: 2
   - Purpose: Public cloud infrastructure and network operations

### Sync Process

```
1. Queen Bee checks subordinate nodes
  ↓
2. Discover protocols from subordinate node repositories
  ↓
3. Compare with catalog
  ↓
4. Register new protocols or update existing
  ↓
5. Update version history
  ↓
6. Update catalog metadata
```

---

## 📊 Version Tracking

### Catalog Metadata

```typescript
{
  catalogVersion: "1.0.0",
  protocolVersion: "v17+QueenBee+CatalogSync",
  lastSync: timestamp,
  subordinateNodes: [...],
  totalProtocols: number,
  totalUpdates: number
}
```

### Protocol Entry

```typescript
{
  id: "protocol-id",
  protocol: Protocol,
  versions: {
    current: "1.2.3",
    history: [
      {
        version: "1.0.0",
        timestamp: timestamp,
        source: DiscoverySource
      },
      {
        version: "1.2.3",
        timestamp: timestamp,
        source: DiscoverySource
      }
    ]
  },
  syncStatus: {
    status: "synced",
    lastSync: timestamp,
    syncSource: "repository-path"
  }
}
```

---

## 🔧 Configuration

### Sync Interval

Default: 1 hour (3600000 ms)

Configurable via:
```typescript
queenBeeCatalogSync.startAutoSync(interval);
```

### Subordinate Node Registration

```typescript
queenBeeCatalogSync.registerSubordinateNode({
  id: 'node-id',
  name: 'Node Name',
  repository: 'owner/repo',
  type: 'api' | 'onramp' | 'shell' | 'other',
  octave: number,
  version: '1.0.0',
  catalogUrl: 'https://github.com/...',
  apiEndpoint: 'https://...',
  status: 'active',
  metadata: {}
});
```

---

## 🚀 Boot Integration

The Queen Bee Catalog Sync system is integrated into the boot process:

1. **Boot Time**: System initializes on repository boot
2. **Auto-Sync**: Starts automatic synchronization
3. **Initial Sync**: Performs initial sync of all subordinate nodes
4. **Status**: Reports sync status in boot prompt

---

## 📈 Status Monitoring

### Sync Results

```typescript
{
  timestamp: number,
  nodeId: string,
  nodeName: string,
  protocolsFound: number,
  protocolsNew: number,
  protocolsUpdated: number,
  protocolsSkipped: number,
  errors: string[],
  version: string
}
```

### Version Info

```typescript
{
  catalogVersion: string,
  protocolVersion: string,
  lastSync: number,
  subordinateNodes: SubordinateNode[],
  totalProtocols: number,
  totalUpdates: number
}
```

---

## ✅ NSPFRP Compliance

- ✅ **Single Source of Truth**: Creator catalog is authoritative
- ✅ **No Duplication**: Protocols deduplicated by ID
- ✅ **Version Tracking**: Complete history maintained
- ✅ **Automatic Sync**: Hands-off operation
- ✅ **Protocol Self-Application**: System applies to itself

---

## 🔗 Related Protocols

- **Auto-Discovery & Catalog Sync** (`P-AUTO-DISCOVERY-V17`)
- **Protocol Snapshot System** (`P-PROTOCOL-SNAPSHOT-V17`)
- **Protocol Self-Application** (`P-PROTOCOL-SELF-APPLICATION-V17`)

---

**Protocol ID:** `P-QUEEN-BEE-CATALOG-VERSIONING-V17`  
**Version:** `v17+QueenBee+Versioning`  
**Status:** ✅ Active  
**Date:** January 2026

*The Queen Bee Catalog maintains the authoritative version of all NSPFRP protocols across the network.*

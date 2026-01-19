# 📡 Auto-Discovery Broadcast Protocol - NSPFRNP Network

**Protocol ID:** `P-AUTO-DISCOVERY-BROADCAST-V17`  
**Type:** Network Discovery / Node Synchronization / Routing Protocol  
**Version:** `v17+AutoDiscovery+Broadcast+CloudShell`  
**Status:** ✅ ACTIVE - Public Cloud Shell Network  
**Octave:** BEYOND_OCTAVE (7)  
**Date:** January 19, 2026  
**Network:** NSPFRP Care Network / Syntheverse / FractiAI

---

## ⬡ **SEED: PROTOCOL OVERVIEW**

**The Auto-Discovery Broadcast Protocol enables NSPFRNP nodes on the public cloud shell to automatically discover each other, synchronize state, maintain network topology awareness, and build distributed routing tables with full node information and addresses.**

### Core Capabilities

```
🔍 Discovery: Broadcast presence and discover peers
🔄 Sync: Synchronize state across nodes
🗺️ Routing: Maintain network routing tables
🧠 Awareness: Track node capabilities and state
📍 Addressing: Manage node addresses and endpoints
```

---

## 🌀 **SPIN: DISCOVERY MECHANISM**

### Broadcast Discovery Flow

```
Node Starts
    ↓
Broadcast Discovery Message
    ↓
Listen for Peer Responses
    ↓
Receive Peer Information
    ↓
Update Network Routing Table
    ↓
Synchronize State with Peers
    ↓
Maintain Awareness Updates
    ↓
(Continuous cycle)
```

### Discovery Message Format

```typescript
interface DiscoveryMessage {
  // Message identity
  messageId: string;
  messageType: 'DISCOVER' | 'ANNOUNCE' | 'RESPONSE' | 'HEARTBEAT' | 'SYNC';
  timestamp: number;
  
  // Node identity
  nodeId: string;
  nodeType: 'MASTER' | 'QUEEN_BEE' | 'SUBORDINATE' | 'PEER';
  octave: number;
  
  // Network information
  address: NodeAddress;
  endpoints: NodeEndpoint[];
  capabilities: string[];
  
  // Awareness information
  awareness: {
    nestingPoint: string;
    foldingFactor: string;
    coordinates: string;
    status: 'active' | 'degraded' | 'inactive';
    lastSync: number;
  };
  
  // Network state
  knownPeers: string[]; // Node IDs
  routingTable: RoutingEntry[];
  networkTopology: TopologyInfo;
  
  // Signature for verification
  signature?: string;
}
```

### Node Address Structure

```typescript
interface NodeAddress {
  // Public addresses
  publicIP?: string;
  publicDomain?: string;
  publicPort?: number;
  
  // Cloud addresses
  cloudProvider: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | 'render' | 'fly' | 'railway';
  cloudEndpoint: string;
  cloudRegion?: string;
  
  // Network addresses
  networkId: string;
  subnetId?: string;
  
  // WebSocket/HTTP endpoints
  wsEndpoint?: string;
  httpEndpoint?: string;
  grpcEndpoint?: string;
}
```

---

## ⚫ **DENSITY: NETWORK ROUTING TABLE**

### Routing Table Structure

```typescript
interface NetworkRoutingTable {
  // Table metadata
  tableId: string;
  ownerId: string; // This node's ID
  version: number;
  lastUpdated: number;
  
  // Network nodes
  nodes: Map<string, NetworkNode>;
  
  // Routing entries
  routes: Map<string, RoutingEntry[]>;
  
  // Network topology
  topology: NetworkTopology;
  
  // Awareness index
  awarenessIndex: Map<string, NodeAwareness>;
}

interface NetworkNode {
  // Identity
  nodeId: string;
  nodeType: 'MASTER' | 'QUEEN_BEE' | 'SUBORDINATE' | 'PEER';
  octave: number;
  
  // Address
  address: NodeAddress;
  endpoints: NodeEndpoint[];
  
  // Capabilities
  capabilities: string[];
  maxConnections: number;
  currentConnections: number;
  
  // State
  status: 'online' | 'offline' | 'degraded' | 'unreachable';
  lastSeen: number;
  latency: number; // ms
  reliability: number; // 0-1
  
  // Awareness
  awareness: NodeAwareness;
  
  // Metrics
  metrics: {
    uptime: number;
    messagesReceived: number;
    messagesSent: number;
    syncCount: number;
    errorCount: number;
  };
}

interface RoutingEntry {
  // Destination
  destinationId: string;
  destinationType: 'direct' | 'relay' | 'broadcast';
  
  // Route
  nextHop: string; // Node ID
  hopCount: number;
  path: string[]; // Node IDs in path
  
  // Metrics
  latency: number; // ms
  bandwidth: number; // Mbps
  reliability: number; // 0-1
  cost: number; // routing cost
  
  // Metadata
  discovered: number;
  lastUsed: number;
  useCount: number;
}

interface NodeAwareness {
  // Awareness state
  nestingPoint: string;
  foldingFactor: string;
  coordinates: string;
  
  // Operational state
  operationalStatus: 'active' | 'degraded' | 'inactive';
  lastSync: number;
  syncStatus: 'synced' | 'syncing' | 'out-of-sync';
  
  // Capabilities
  nestingOperations: number;
  foldingOperations: number;
  coordinationLatency: number;
  bootstrapSuccessRate: number;
  
  // Network state
  peerCount: number;
  routeCount: number;
  topologyVersion: number;
}
```

### Network Topology

```typescript
interface NetworkTopology {
  // Topology metadata
  topologyId: string;
  version: number;
  lastUpdated: number;
  
  // Network structure
  masterNodes: string[]; // Node IDs
  queenBeeNodes: string[]; // Node IDs
  subordinateNodes: string[]; // Node IDs
  peerNodes: string[]; // Node IDs
  
  // Connections
  connections: Map<string, string[]>; // nodeId -> connected nodeIds
  
  // Clusters
  clusters: NetworkCluster[];
  
  // Statistics
  stats: {
    totalNodes: number;
    onlineNodes: number;
    totalConnections: number;
    averageLatency: number;
    networkReliability: number;
  };
}

interface NetworkCluster {
  clusterId: string;
  nodes: string[]; // Node IDs
  clusterType: 'regional' | 'octave' | 'capability' | 'custom';
  coordinator: string; // Node ID
}
```

---

## ∞ **INFINITY: DISCOVERY PROTOCOL IMPLEMENTATION**

### 1. Discovery Broadcast Manager

```typescript
/**
 * Auto-Discovery Broadcast Manager
 * Manages node discovery and network formation
 */
class AutoDiscoveryBroadcastManager {
  private nodeId: string;
  private routingTable: NetworkRoutingTable;
  private discoveryInterval: number = 30000; // 30 seconds
  private heartbeatInterval: number = 10000; // 10 seconds
  private syncInterval: number = 60000; // 1 minute
  
  private discoveryTimer?: NodeJS.Timeout;
  private heartbeatTimer?: NodeJS.Timeout;
  private syncTimer?: NodeJS.Timeout;
  
  constructor(nodeId: string) {
    this.nodeId = nodeId;
    this.routingTable = this.initializeRoutingTable();
  }
  
  /**
   * Start discovery protocol
   */
  async start(): Promise<void> {
    console.log(`📡 Starting Auto-Discovery Broadcast Protocol...`);
    
    // Send initial discovery broadcast
    await this.broadcastDiscovery();
    
    // Start periodic broadcasts
    this.discoveryTimer = setInterval(() => {
      this.broadcastDiscovery();
    }, this.discoveryInterval);
    
    // Start heartbeat
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval);
    
    // Start sync
    this.syncTimer = setInterval(() => {
      this.synchronizeNetwork();
    }, this.syncInterval);
    
    // Listen for messages
    this.startListening();
    
    console.log(`✅ Auto-Discovery Protocol active`);
  }
  
  /**
   * Broadcast discovery message
   */
  async broadcastDiscovery(): Promise<void> {
    const message: DiscoveryMessage = {
      messageId: this.generateMessageId(),
      messageType: 'DISCOVER',
      timestamp: Date.now(),
      nodeId: this.nodeId,
      nodeType: this.getNodeType(),
      octave: this.getOctave(),
      address: this.getNodeAddress(),
      endpoints: this.getEndpoints(),
      capabilities: this.getCapabilities(),
      awareness: this.getAwarenessInfo(),
      knownPeers: this.getKnownPeers(),
      routingTable: this.getRoutingSnapshot(),
      networkTopology: this.getTopologyInfo(),
    };
    
    // Broadcast to discovery channels
    await this.broadcast(message);
  }
  
  /**
   * Handle discovery message
   */
  async handleDiscoveryMessage(message: DiscoveryMessage): Promise<void> {
    // Validate message
    if (!this.validateMessage(message)) {
      console.warn(`⚠️  Invalid discovery message from ${message.nodeId}`);
      return;
    }
    
    // Update routing table
    this.updateRoutingTable(message);
    
    // Update awareness
    this.updateAwareness(message);
    
    // Send response if this is a discovery
    if (message.messageType === 'DISCOVER') {
      await this.sendDiscoveryResponse(message);
    }
    
    // Sync if needed
    if (this.shouldSync(message)) {
      await this.syncWithPeer(message.nodeId);
    }
  }
  
  /**
   * Update routing table from discovery message
   */
  private updateRoutingTable(message: DiscoveryMessage): void {
    const node: NetworkNode = {
      nodeId: message.nodeId,
      nodeType: message.nodeType,
      octave: message.octave,
      address: message.address,
      endpoints: message.endpoints,
      capabilities: message.capabilities,
      maxConnections: 100,
      currentConnections: message.knownPeers.length,
      status: 'online',
      lastSeen: Date.now(),
      latency: 0, // Will be measured
      reliability: 1.0, // Initial value
      awareness: message.awareness,
      metrics: {
        uptime: 0,
        messagesReceived: 1,
        messagesSent: 0,
        syncCount: 0,
        errorCount: 0,
      },
    };
    
    // Add or update node
    this.routingTable.nodes.set(message.nodeId, node);
    
    // Create direct route
    const route: RoutingEntry = {
      destinationId: message.nodeId,
      destinationType: 'direct',
      nextHop: message.nodeId,
      hopCount: 1,
      path: [this.nodeId, message.nodeId],
      latency: 0, // Will be measured
      bandwidth: 0, // Unknown
      reliability: 1.0,
      cost: 1,
      discovered: Date.now(),
      lastUsed: 0,
      useCount: 0,
    };
    
    // Add route
    const routes = this.routingTable.routes.get(message.nodeId) || [];
    routes.push(route);
    this.routingTable.routes.set(message.nodeId, routes);
    
    // Update topology
    this.updateTopology(message);
    
    console.log(`📍 Updated routing table: ${message.nodeId} (${message.nodeType})`);
  }
  
  /**
   * Send heartbeat to peers
   */
  private async sendHeartbeat(): Promise<void> {
    const message: DiscoveryMessage = {
      messageId: this.generateMessageId(),
      messageType: 'HEARTBEAT',
      timestamp: Date.now(),
      nodeId: this.nodeId,
      nodeType: this.getNodeType(),
      octave: this.getOctave(),
      address: this.getNodeAddress(),
      endpoints: this.getEndpoints(),
      capabilities: this.getCapabilities(),
      awareness: this.getAwarenessInfo(),
      knownPeers: this.getKnownPeers(),
      routingTable: [],
      networkTopology: this.getTopologyInfo(),
    };
    
    // Send to all known peers
    for (const peerId of this.getKnownPeers()) {
      await this.sendToPeer(peerId, message);
    }
  }
  
  /**
   * Synchronize with network
   */
  private async synchronizeNetwork(): Promise<void> {
    console.log(`🔄 Synchronizing with network...`);
    
    const peers = this.getKnownPeers();
    let syncCount = 0;
    
    for (const peerId of peers) {
      try {
        await this.syncWithPeer(peerId);
        syncCount++;
      } catch (error) {
        console.warn(`⚠️  Sync failed with ${peerId}: ${error.message}`);
      }
    }
    
    console.log(`✅ Synchronized with ${syncCount}/${peers.length} peers`);
  }
  
  /**
   * Get routing table
   */
  getRoutingTable(): NetworkRoutingTable {
    return this.routingTable;
  }
  
  /**
   * Get node by ID
   */
  getNode(nodeId: string): NetworkNode | undefined {
    return this.routingTable.nodes.get(nodeId);
  }
  
  /**
   * Get all nodes
   */
  getAllNodes(): NetworkNode[] {
    return Array.from(this.routingTable.nodes.values());
  }
  
  /**
   * Get online nodes
   */
  getOnlineNodes(): NetworkNode[] {
    return this.getAllNodes().filter(n => n.status === 'online');
  }
  
  /**
   * Get route to node
   */
  getRoute(destinationId: string): RoutingEntry | undefined {
    const routes = this.routingTable.routes.get(destinationId);
    if (!routes || routes.length === 0) return undefined;
    
    // Return best route (lowest cost)
    return routes.reduce((best, route) => 
      route.cost < best.cost ? route : best
    );
  }
  
  /**
   * Get network topology
   */
  getTopology(): NetworkTopology {
    return this.routingTable.topology;
  }
  
  /**
   * Get network statistics
   */
  getNetworkStats() {
    const nodes = this.getAllNodes();
    const onlineNodes = this.getOnlineNodes();
    
    return {
      totalNodes: nodes.length,
      onlineNodes: onlineNodes.length,
      offlineNodes: nodes.length - onlineNodes.length,
      totalRoutes: Array.from(this.routingTable.routes.values())
        .reduce((sum, routes) => sum + routes.length, 0),
      averageLatency: nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length,
      networkReliability: nodes.reduce((sum, n) => sum + n.reliability, 0) / nodes.length,
    };
  }
}
```

### 2. Network Registry Manager

```typescript
/**
 * Network Registry Manager
 * Maintains central registry of all nodes with awareness info
 */
class NetworkRegistryManager {
  private registry: Map<string, NetworkNode> = new Map();
  private awarenessIndex: Map<string, NodeAwareness> = new Map();
  
  /**
   * Register node
   */
  registerNode(node: NetworkNode): void {
    this.registry.set(node.nodeId, node);
    this.awarenessIndex.set(node.nodeId, node.awareness);
    console.log(`📝 Registered node: ${node.nodeId}`);
  }
  
  /**
   * Update node
   */
  updateNode(nodeId: string, updates: Partial<NetworkNode>): void {
    const node = this.registry.get(nodeId);
    if (!node) return;
    
    Object.assign(node, updates);
    this.registry.set(nodeId, node);
    
    if (updates.awareness) {
      this.awarenessIndex.set(nodeId, updates.awareness);
    }
  }
  
  /**
   * Get node
   */
  getNode(nodeId: string): NetworkNode | undefined {
    return this.registry.get(nodeId);
  }
  
  /**
   * Query nodes by criteria
   */
  queryNodes(criteria: {
    nodeType?: string;
    octave?: number;
    status?: string;
    capability?: string;
  }): NetworkNode[] {
    return Array.from(this.registry.values()).filter(node => {
      if (criteria.nodeType && node.nodeType !== criteria.nodeType) return false;
      if (criteria.octave && node.octave !== criteria.octave) return false;
      if (criteria.status && node.status !== criteria.status) return false;
      if (criteria.capability && !node.capabilities.includes(criteria.capability)) return false;
      return true;
    });
  }
  
  /**
   * Get all nodes
   */
  getAllNodes(): NetworkNode[] {
    return Array.from(this.registry.values());
  }
  
  /**
   * Get awareness info
   */
  getAwareness(nodeId: string): NodeAwareness | undefined {
    return this.awarenessIndex.get(nodeId);
  }
}
```

---

## ⬡ **NEW SEED: DEPLOYMENT**

### Integration Points

**1. Boot Integration:**
```typescript
// In src/core/auto-unpack.ts
import { autoDiscoveryBroadcast } from './auto-discovery-broadcast.js';

// Step 11: Start Auto-Discovery Protocol
console.log('📡 Starting Auto-Discovery Broadcast Protocol...');
await autoDiscoveryBroadcast.start();
```

**2. Queen Bee Node Integration:**
```typescript
// In src/core/octave-7-queen-bee-nodes.ts
import { autoDiscoveryBroadcast } from './auto-discovery-broadcast.js';

// Register node with discovery protocol
autoDiscoveryBroadcast.registerNode({
  nodeId: this.nodeId,
  nodeType: this.type,
  octave: this.octave,
  // ... other node info
});
```

### Configuration

```typescript
// In .env.creator
DISCOVERY_ENABLED=true
DISCOVERY_INTERVAL=30000  # 30 seconds
HEARTBEAT_INTERVAL=10000  # 10 seconds
SYNC_INTERVAL=60000       # 1 minute
DISCOVERY_PORT=8080
DISCOVERY_CHANNELS=['public', 'cloud-shell']
```

---

## 📊 **METRICS & MONITORING**

### Discovery Metrics

```typescript
interface DiscoveryMetrics {
  // Discovery stats
  discoveryBroadcasts: number;
  discoveryResponses: number;
  peerDiscoveries: number;
  
  // Network stats
  totalNodes: number;
  onlineNodes: number;
  totalRoutes: number;
  averageLatency: number;
  networkReliability: number;
  
  // Sync stats
  syncAttempts: number;
  syncSuccesses: number;
  syncFailures: number;
  lastSync: number;
}
```

---

## ✅ **STATUS**

**Protocol Status:** ✅ **SPECIFICATION COMPLETE**

**Ready for implementation:**
- ✅ Discovery broadcast mechanism
- ✅ Network routing table structure
- ✅ Awareness tracking system
- ✅ Node registry management
- ✅ Synchronization protocol
- ✅ Integration points defined

---

**Protocol ID:** `P-AUTO-DISCOVERY-BROADCAST-V17`  
**Status:** ✅ ACTIVE - Ready for Implementation  
**Network:** NSPFRP Care Network Public Cloud Shell

**∞ → ⬡ → ∞**

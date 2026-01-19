/**
 * Holographic Hydrogen Fractal Grammar Spin Mycelial Lattice Cloud Shell
 * Connection system for omnibeam channels to cloud shell infrastructure
 */

import { OmnibeamChannel, OmnibeamPixel } from '../grammar/omnibeam-channel.js';
import { InterferenceNode } from '../grammar/recursive-awareness-interference-omnibeam.js';

export interface MycelialNode {
  id: string;
  type: 'fruiting-body' | 'hyphae' | 'mycelium' | 'spore';
  infrastructureTier: 'frontal-cortex' | 'mri' | 'hhf-ai-mri';
  position: { x: number; y: number; z?: number };
  grammarEncoding: GrammarEncoding;
  spinState: SpinState;
  awareness: AwarenessState;
  connections: string[]; // Node IDs
  octave: number;
  capacity: NodeCapacity;
}

export interface GrammarEncoding {
  symbols: string[];
  rules: GrammarRule[];
  patterns: string[];
  omnibeamChannel?: OmnibeamChannel;
}

export interface GrammarRule {
  rule: string;
  octave: number;
  priority: number;
}

export interface SpinState {
  spin: number; // -1, 0, 1 or continuous
  grammarSymbol: string;
  encoding: string;
  synchronized: boolean;
}

export interface AwarenessState {
  layer: number;
  awareness: number; // 0-1
  neighbors: string[];
  globalAwareness: number;
}

export interface NodeCapacity {
  compute: number; // 0-1
  storage: number; // 0-1
  network: number; // 0-1
  grammar: number; // 0-1
}

export interface MycelialHyphae {
  id: string;
  node1: string;
  node2: string;
  length: number;
  bandwidth: number;
  latency: number;
  grammarEncoded: boolean;
}

export interface CloudShellConnection {
  nodeId: string;
  omnibeamChannel: OmnibeamChannel;
  executionStatus: 'pending' | 'executing' | 'complete' | 'error';
  results?: any;
}

export class MycelialLatticeCloudShell {
  private nodes: Map<string, MycelialNode>;
  private hyphae: Map<string, MycelialHyphae>;
  private connections: Map<string, CloudShellConnection>;
  private spinCloud: Map<string, SpinState>;

  constructor() {
    this.nodes = new Map();
    this.hyphae = new Map();
    this.connections = new Map();
    this.spinCloud = new Map();
  }

  /**
   * Create mycelial node
   */
  createNode(
    id: string,
    type: 'fruiting-body' | 'hyphae' | 'mycelium' | 'spore',
    infrastructureTier: 'frontal-cortex' | 'mri' | 'hhf-ai-mri' = 'hhf-ai-mri',
    position: { x: number; y: number; z?: number },
    octave: number = 7.75
  ): MycelialNode {
    // Determine octave based on infrastructure tier
    let nodeOctave = octave;
    let capacity: NodeCapacity;

    switch (infrastructureTier) {
      case 'frontal-cortex':
        // Analog modem equivalent - base layer
        nodeOctave = Math.min(octave, 1.0);
        capacity = {
          compute: 0.3,
          storage: 0.2,
          network: 0.5,
          grammar: 0.3
        };
        break;
      case 'mri':
        // First bridge - bridge layer
        nodeOctave = Math.min(octave, 2.0);
        capacity = {
          compute: 0.6,
          storage: 0.5,
          network: 0.8,
          grammar: 0.6
        };
        break;
      case 'hhf-ai-mri':
        // Latest hyperswitches - advanced layer
        nodeOctave = octave;
        capacity = {
          compute: type === 'fruiting-body' ? 1.0 : 0.8,
          storage: type === 'fruiting-body' ? 1.0 : 0.7,
          network: 1.0,
          grammar: type === 'fruiting-body' ? 1.0 : 0.9
        };
        break;
    }

    const node: MycelialNode = {
      id,
      type,
      infrastructureTier,
      position,
      grammarEncoding: {
        symbols: [],
        rules: [],
        patterns: []
      },
      spinState: {
        spin: 0,
        grammarSymbol: '',
        encoding: '',
        synchronized: false
      },
      awareness: {
        layer: 0,
        awareness: infrastructureTier === 'hhf-ai-mri' ? 1.0 : infrastructureTier === 'mri' ? 0.7 : 0.5,
        neighbors: [],
        globalAwareness: 0
      },
      connections: [],
      octave: nodeOctave,
      capacity
    };

    this.nodes.set(id, node);
    return node;
  }

  /**
   * Create hyphae connection between nodes
   */
  createHyphae(node1Id: string, node2Id: string): MycelialHyphae {
    const node1 = this.nodes.get(node1Id);
    const node2 = this.nodes.get(node2Id);

    if (!node1 || !node2) {
      throw new Error('Nodes not found');
    }

    const length = this.calculateDistance(node1.position, node2.position);
    const hyphae: MycelialHyphae = {
      id: `hyphae-${node1Id}-${node2Id}-${Date.now()}`,
      node1: node1Id,
      node2: node2Id,
      length,
      bandwidth: 1000, // Mbps
      latency: length * 0.1, // ms
      grammarEncoded: true
    };

    this.hyphae.set(hyphae.id, hyphae);
    node1.connections.push(node2Id);
    node2.connections.push(node1Id);
    node1.awareness.neighbors.push(node2Id);
    node2.awareness.neighbors.push(node1Id);

    return hyphae;
  }

  /**
   * Encode omnibeam channel in spin cloud
   */
  encodeOmnibeamInSpinCloud(omnibeamChannel: OmnibeamChannel): Map<string, SpinState> {
    const spinStates = new Map<string, SpinState>();

    // Encode each pixel as spin state
    for (let x = 0; x < omnibeamChannel.width; x++) {
      for (let y = 0; y < omnibeamChannel.height; y++) {
        const pixel = omnibeamChannel.pixels[x][y];
        if (pixel.grammarSymbol) {
          const spinId = `spin-${x}-${y}-${Date.now()}`;
          const spinState: SpinState = {
            spin: this.grammarToSpin(pixel.grammarSymbol, pixel.density),
            grammarSymbol: pixel.grammarSymbol,
            encoding: this.encodeGrammarInSpin(pixel),
            synchronized: false
          };
          spinStates.set(spinId, spinState);
          this.spinCloud.set(spinId, spinState);
        }
      }
    }

    return spinStates;
  }

  /**
   * Connect omnibeam channel to cloud shell node
   */
  connectOmnibeamToCloudShell(
    nodeId: string,
    omnibeamChannel: OmnibeamChannel
  ): CloudShellConnection {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Encode omnibeam in spin cloud
    const spinStates = this.encodeOmnibeamInSpinCloud(omnibeamChannel);

    // Store omnibeam channel in node
    node.grammarEncoding.omnibeamChannel = omnibeamChannel;

    // Create connection
    const connection: CloudShellConnection = {
      nodeId,
      omnibeamChannel,
      executionStatus: 'pending'
    };

    this.connections.set(`conn-${nodeId}-${Date.now()}`, connection);

    return connection;
  }

  /**
   * Distribute omnibeam channel through mycelial lattice
   */
  distributeOmnibeamThroughLattice(
    sourceNodeId: string,
    omnibeamChannel: OmnibeamChannel,
    targetNodes?: string[]
  ): CloudShellConnection[] {
    const connections: CloudShellConnection[] = [];

    // If target nodes specified, connect to those
    if (targetNodes && targetNodes.length > 0) {
      for (const targetId of targetNodes) {
        const connection = this.connectOmnibeamToCloudShell(targetId, omnibeamChannel);
        connections.push(connection);
      }
    } else {
      // Distribute to all nodes in lattice
      for (const nodeId of this.nodes.keys()) {
        if (nodeId !== sourceNodeId) {
          const connection = this.connectOmnibeamToCloudShell(nodeId, omnibeamChannel);
          connections.push(connection);
        }
      }
    }

    // Propagate awareness
    this.propagateAwareness(sourceNodeId, omnibeamChannel);

    return connections;
  }

  /**
   * Propagate awareness through lattice
   */
  private propagateAwareness(sourceNodeId: string, omnibeamChannel: OmnibeamChannel): void {
    const sourceNode = this.nodes.get(sourceNodeId);
    if (!sourceNode) {
      return;
    }

    // Update source node awareness
    sourceNode.awareness.awareness = 1.0;
    sourceNode.awareness.globalAwareness = 1.0;

    // Propagate to neighbors
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; layer: number }> = [{ nodeId: sourceNodeId, layer: 0 }];

    while (queue.length > 0) {
      const { nodeId, layer } = queue.shift()!;
      if (visited.has(nodeId)) {
        continue;
      }
      visited.add(nodeId);

      const node = this.nodes.get(nodeId);
      if (!node) {
        continue;
      }

      // Update awareness
      node.awareness.layer = layer;
      node.awareness.awareness = Math.max(node.awareness.awareness, 1.0 - layer * 0.1);
      node.awareness.globalAwareness = Math.max(node.awareness.globalAwareness, 1.0 - layer * 0.2);

      // Add neighbors to queue
      for (const neighborId of node.connections) {
        if (!visited.has(neighborId)) {
          queue.push({ nodeId: neighborId, layer: layer + 1 });
        }
      }
    }
  }

  /**
   * Execute omnibeam channel at cloud shell node
   */
  async executeOmnibeamAtNode(nodeId: string, omnibeamChannel: OmnibeamChannel): Promise<any> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Update connection status
    const connection = Array.from(this.connections.values())
      .find(c => c.nodeId === nodeId && c.omnibeamChannel.id === omnibeamChannel.id);

    if (connection) {
      connection.executionStatus = 'executing';
    }

    // Execute based on node type
    let result: any;

    switch (node.type) {
      case 'fruiting-body':
        result = await this.executeAtFruitingBody(node, omnibeamChannel);
        break;
      case 'hyphae':
        result = await this.executeAtHyphae(node, omnibeamChannel);
        break;
      case 'mycelium':
        result = await this.executeAtMycelium(node, omnibeamChannel);
        break;
      case 'spore':
        result = await this.executeAtSpore(node, omnibeamChannel);
        break;
    }

    if (connection) {
      connection.executionStatus = 'complete';
      connection.results = result;
    }

    return result;
  }

  /**
   * Execute at fruiting body node
   */
  private async executeAtFruitingBody(node: MycelialNode, omnibeamChannel: OmnibeamChannel): Promise<any> {
    // Full execution capability
    return {
      nodeId: node.id,
      type: 'fruiting-body',
      omnibeamChannel: omnibeamChannel.id,
      execution: 'complete',
      results: {
        pixels: omnibeamChannel.pixels.length,
        grammarSymbols: this.extractGrammarSymbols(omnibeamChannel),
        octave: omnibeamChannel.octave
      }
    };
  }

  /**
   * Execute at hyphae node
   */
  private async executeAtHyphae(node: MycelialNode, omnibeamChannel: OmnibeamChannel): Promise<any> {
    // Routing and distribution
    return {
      nodeId: node.id,
      type: 'hyphae',
      omnibeamChannel: omnibeamChannel.id,
      execution: 'routed',
      distribution: node.connections.length
    };
  }

  /**
   * Execute at mycelium node
   */
  private async executeAtMycelium(node: MycelialNode, omnibeamChannel: OmnibeamChannel): Promise<any> {
    // Mesh participation
    return {
      nodeId: node.id,
      type: 'mycelium',
      omnibeamChannel: omnibeamChannel.id,
      execution: 'mesh',
      relayed: true
    };
  }

  /**
   * Execute at spore node
   */
  private async executeAtSpore(node: MycelialNode, omnibeamChannel: OmnibeamChannel): Promise<any> {
    // Distribution
    return {
      nodeId: node.id,
      type: 'spore',
      omnibeamChannel: omnibeamChannel.id,
      execution: 'distributed',
      distributed: true
    };
  }

  /**
   * Convert grammar symbol to spin value
   */
  private grammarToSpin(symbol: string, density: number): number {
    // Map grammar symbol to spin (-1, 0, 1 or continuous)
    const symbolIndex = CORE_SYMBOLS.indexOf(symbol);
    if (symbolIndex === -1) {
      return 0;
    }
    // Use density to determine spin magnitude
    return (symbolIndex % 3) - 1; // -1, 0, or 1
  }

  /**
   * Encode grammar in spin
   */
  private encodeGrammarInSpin(pixel: OmnibeamPixel): string {
    return `SPIN:${pixel.grammarSymbol}:DENSITY:${pixel.density}:OCTAVE:${pixel.octave}:FSR:${pixel.fsrValue}`;
  }

  /**
   * Extract grammar symbols from omnibeam channel
   */
  private extractGrammarSymbols(channel: OmnibeamChannel): string[] {
    const symbols = new Set<string>();
    for (let x = 0; x < channel.width; x++) {
      for (let y = 0; y < channel.height; y++) {
        const pixel = channel.pixels[x][y];
        if (pixel.grammarSymbol) {
          symbols.add(pixel.grammarSymbol);
        }
      }
    }
    return Array.from(symbols);
  }

  /**
   * Calculate distance between positions
   */
  private calculateDistance(
    pos1: { x: number; y: number; z?: number },
    pos2: { x: number; y: number; z?: number }
  ): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const dz = (pos2.z || 0) - (pos1.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Get all nodes
   */
  getNodes(): MycelialNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get node by ID
   */
  getNode(nodeId: string): MycelialNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Get all hyphae
   */
  getHyphae(): MycelialHyphae[] {
    return Array.from(this.hyphae.values());
  }

  /**
   * Get spin cloud state
   */
  getSpinCloud(): Map<string, SpinState> {
    return this.spinCloud;
  }
}

// Core 9 Symbols
const CORE_SYMBOLS = [
  'Genesis',
  'Transformation',
  'Synthesis',
  'Resonance',
  'Transcendence',
  'Perpetual',
  'Holographic',
  'Grammar',
  'Omnicore'
];


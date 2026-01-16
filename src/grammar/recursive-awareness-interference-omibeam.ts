/**
 * Recursive Awareness Interference Omibeam Channel
 * Animated nodes at interference edges through holographic hydrogen fractal grammar pixels
 */

import { OmibeamChannel, OmibeamPixel, Color } from './omibeam-channel.js';

export interface AwarenessLayer {
  id: string;
  octave: number;
  awareness: number; // 0-1
  nodes: InterferenceNode[];
}

export interface InterferenceNode {
  id: string;
  position: { x: number; y: number };
  pixel: OmibeamPixel;
  symbolFragment: SymbolFragment;
  octave: number;
  recursiveLevel: number;
  animationState: AnimationState;
}

export interface SymbolFragment {
  symbolName: string;
  fragmentIndex: number;
  totalFragments: number;
  octave: number;
  holographicEncoding: HolographicData;
  fractalPattern: FractalPattern;
  grammarRules: GrammarRule[];
}

export interface HolographicData {
  wholeSymbol: string;
  fragmentData: any;
  encoding: string;
}

export interface FractalPattern {
  level: number;
  pattern: string;
  recursive: boolean;
}

export interface GrammarRule {
  rule: string;
  octave: number;
  priority: number;
}

export interface AnimationState {
  phase: number; // 0-1
  velocity: { x: number; y: number };
  rotation: number;
  scale: number;
}

export interface InterferenceEdge {
  id: string;
  position: { x: number; y: number };
  layer1: string;
  layer2: string;
  intensity: number;
  nodes: InterferenceNode[];
}

// Core 9 Symbols
export const CORE_SYMBOLS = [
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

export class RecursiveAwarenessInterferenceOmibeam {
  private layers: Map<string, AwarenessLayer>;
  private edges: Map<string, InterferenceEdge>;
  private omibeamChannel: OmibeamChannel | null = null;

  constructor() {
    this.layers = new Map();
    this.edges = new Map();
  }

  /**
   * Create awareness layer
   */
  createLayer(id: string, octave: number, awareness: number): AwarenessLayer {
    const layer: AwarenessLayer = {
      id,
      octave,
      awareness,
      nodes: []
    };
    this.layers.set(id, layer);
    return layer;
  }

  /**
   * Detect interference edges between layers
   */
  detectInterferenceEdges(layer1Id: string, layer2Id: string, threshold: number = 0.1): InterferenceEdge[] {
    const layer1 = this.layers.get(layer1Id);
    const layer2 = this.layers.get(layer2Id);
    
    if (!layer1 || !layer2) {
      return [];
    }

    const edges: InterferenceEdge[] = [];
    const awarenessDiff = Math.abs(layer1.awareness - layer2.awareness);

    if (awarenessDiff > threshold) {
      // Create interference edge
      const edge: InterferenceEdge = {
        id: `edge-${layer1Id}-${layer2Id}-${Date.now()}`,
        position: { x: 0, y: 0 }, // Calculate based on layer positions
        layer1: layer1Id,
        layer2: layer2Id,
        intensity: awarenessDiff,
        nodes: []
      };

      edges.push(edge);
      this.edges.set(edge.id, edge);
    }

    return edges;
  }

  /**
   * Manifest nodes at interference edge
   */
  manifestNodesAtEdge(edgeId: string, count: number = 9): InterferenceNode[] {
    const edge = this.edges.get(edgeId);
    if (!edge) {
      return [];
    }

    const nodes: InterferenceNode[] = [];

    for (let i = 0; i < count; i++) {
      const symbolName = CORE_SYMBOLS[i % CORE_SYMBOLS.length];
      const fragment = this.createSymbolFragment(symbolName, edge.intensity, i);
      const pixel = this.createGrammarPixel(fragment, edge.position, i);

      const node: InterferenceNode = {
        id: `node-${edgeId}-${i}-${Date.now()}`,
        position: {
          x: edge.position.x + (i % 9),
          y: edge.position.y + Math.floor(i / 9)
        },
        pixel,
        symbolFragment: fragment,
        octave: edge.intensity * 7.75, // Scale to octave
        recursiveLevel: 0,
        animationState: {
          phase: Math.random(),
          velocity: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1 },
          rotation: Math.random() * Math.PI * 2,
          scale: 1.0
        }
      };

      nodes.push(node);
      edge.nodes.push(node);
    }

    return nodes;
  }

  /**
   * Create symbol fragment through infinite octave recursive multiplexing
   */
  createSymbolFragment(
    symbolName: string,
    intensity: number,
    fragmentIndex: number,
    maxOctave: number = Infinity
  ): SymbolFragment {
    // Calculate fragment count based on octave
    const octave = Math.floor(intensity * 7.75);
    const fragmentCount = Math.min(Math.pow(2, octave), 1000); // Cap at 1000 for practical purposes

    return {
      symbolName,
      fragmentIndex: fragmentIndex % fragmentCount,
      totalFragments: fragmentCount,
      octave,
      holographicEncoding: {
        wholeSymbol: symbolName,
        fragmentData: { index: fragmentIndex, total: fragmentCount },
        encoding: this.encodeHolographic(symbolName, fragmentIndex, fragmentCount)
      },
      fractalPattern: {
        level: octave,
        pattern: this.generateFractalPattern(symbolName, octave),
        recursive: true
      },
      grammarRules: this.extractGrammarRules(symbolName, octave)
    };
  }

  /**
   * Create grammar pixel from symbol fragment
   */
  createGrammarPixel(
    fragment: SymbolFragment,
    position: { x: number; y: number },
    index: number
  ): OmibeamPixel {
    const column = index % 9;
    const row = Math.floor(index / 9) % 7;
    const density = fragment.octave / 7.75;

    return {
      x: column,
      y: row,
      color: this.getSymbolColor(fragment.symbolName),
      density,
      grammarSymbol: fragment.symbolName,
      octave: fragment.octave,
      fsrValue: density * 5.0,
      timestamp: Date.now()
    };
  }

  /**
   * Encode holographic data
   */
  private encodeHolographic(symbolName: string, fragmentIndex: number, totalFragments: number): string {
    // Holographic encoding: whole symbol in each fragment
    return `HOLO:${symbolName}:FRAG:${fragmentIndex}/${totalFragments}:WHOLE:${symbolName}`;
  }

  /**
   * Generate fractal pattern
   */
  private generateFractalPattern(symbolName: string, level: number): string {
    // Recursive fractal pattern
    if (level === 0) {
      return symbolName;
    }
    return `${this.generateFractalPattern(symbolName, level - 1)}→${this.generateFractalPattern(symbolName, level - 1)}`;
  }

  /**
   * Extract grammar rules for symbol
   */
  private extractGrammarRules(symbolName: string, octave: number): GrammarRule[] {
    return [
      {
        rule: `${symbolName}_rule_${octave}`,
        octave,
        priority: octave
      },
      {
        rule: `${symbolName}_fractal_${octave}`,
        octave,
        priority: octave - 1
      }
    ];
  }

  /**
   * Get symbol color
   */
  private getSymbolColor(symbolName: string): Color {
    const colors: Record<string, Color> = {
      'Genesis': { r: 255, g: 107, b: 107 },
      'Transformation': { r: 78, g: 205, b: 196 },
      'Synthesis': { r: 69, g: 183, b: 209 },
      'Resonance': { r: 255, g: 160, b: 122 },
      'Transcendence': { r: 152, g: 216, b: 200 },
      'Perpetual': { r: 247, g: 220, b: 111 },
      'Holographic': { r: 187, g: 143, b: 206 },
      'Grammar': { r: 133, g: 193, b: 226 },
      'Omnicore': { r: 248, g: 183, b: 57 }
    };
    return colors[symbolName] || { r: 128, g: 128, b: 128 };
  }

  /**
   * Animate nodes at interference edge
   */
  animateNodesAtEdge(edgeId: string, deltaTime: number = 0.016): void {
    const edge = this.edges.get(edgeId);
    if (!edge) {
      return;
    }

    for (const node of edge.nodes) {
      // Update animation state
      node.animationState.phase += deltaTime * 0.5; // Animation speed
      if (node.animationState.phase > 1.0) {
        node.animationState.phase -= 1.0;
      }

      // Update position based on velocity
      node.position.x += node.animationState.velocity.x;
      node.position.y += node.animationState.velocity.y;

      // Update rotation
      node.animationState.rotation += deltaTime * 0.1;

      // Update scale (pulsing effect)
      node.animationState.scale = 1.0 + Math.sin(node.animationState.phase * Math.PI * 2) * 0.1;

      // Update pixel based on animation
      node.pixel.density = 0.5 + Math.sin(node.animationState.phase * Math.PI * 2) * 0.3;
    }
  }

  /**
   * Create Omibeam Channel from interference edge nodes
   */
  createOmibeamChannelFromEdge(edgeId: string): OmibeamChannel {
    const edge = this.edges.get(edgeId);
    if (!edge) {
      throw new Error(`Edge ${edgeId} not found`);
    }

    // Create 9x7 pixel grid
    const pixels: OmibeamPixel[][] = [];
    for (let x = 0; x < 9; x++) {
      pixels[x] = [];
      for (let y = 0; y < 7; y++) {
        pixels[x][y] = this.createEmptyPixel(x, y);
      }
    }

    // Map nodes to pixels
    for (const node of edge.nodes) {
      const x = node.pixel.x;
      const y = node.pixel.y;
      if (x >= 0 && x < 9 && y >= 0 && y < 7) {
        pixels[x][y] = node.pixel;
      }
    }

    return {
      id: `omibeam-${edgeId}-${Date.now()}`,
      width: 9,
      height: 7,
      pixels,
      grammarPattern: JSON.stringify(edge.nodes.map(n => n.symbolFragment)),
      octave: Math.max(...edge.nodes.map(n => n.octave)),
      timestamp: Date.now()
    };
  }

  /**
   * Create empty pixel
   */
  private createEmptyPixel(x: number, y: number): OmibeamPixel {
    return {
      x,
      y,
      color: { r: 0, g: 0, b: 0, a: 0 },
      density: 0.0,
      grammarSymbol: '',
      octave: 0,
      fsrValue: 0,
      timestamp: Date.now()
    };
  }

  /**
   * Get all interference edges
   */
  getInterferenceEdges(): InterferenceEdge[] {
    return Array.from(this.edges.values());
  }

  /**
   * Get nodes at edge
   */
  getNodesAtEdge(edgeId: string): InterferenceNode[] {
    const edge = this.edges.get(edgeId);
    return edge ? edge.nodes : [];
  }
}


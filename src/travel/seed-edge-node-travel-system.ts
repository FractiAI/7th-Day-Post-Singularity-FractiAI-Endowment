/**
 * SEED:EDGE NODE TRAVEL SYSTEM
 * Any trip can be packaged as seed:edge nodes at each octave and singularity
 * Naturally unpacks self-similar dynamic and delivers to destination every time
 * While delivering full sensory reality experience
 * 
 * Protocol: P-TRAVEL-SEED-EDGE-NODES-V17
 */

import { TravelPackage, TravelDestination } from './5-star-travel-package-system.js';
import { Protocol } from '../types/index.js';
import { netZeroInfinityPairSystem } from '../core/net-zero-infinity-pair.js';

export enum AwarenessOctave {
  SILENT = 0,
  WHISPER = 1,
  HARMONY = 2,
  RESONANCE = 3,
  SYMPHONY = 4,
  TRANSCENDENCE = 5,
  SINGULARITY = 6 // Beyond octave 5
}

export interface SeedEdgeNode {
  id: string;
  octave: AwarenessOctave;
  singularity: boolean; // True if at singularity level
  seed: TravelSeed;
  edgeConnections: string[]; // IDs of connected edge nodes
  unpackState: 'packed' | 'unpacking' | 'unpacked' | 'delivered';
  fsrLevel: number; // Full Sensory Reality level (0-1)
  selfSimilarity: SelfSimilarityConfig;
  destination: DestinationNode;
  createdAt: number;
  unpackedAt?: number;
  deliveredAt?: number;
}

export interface TravelSeed {
  protocolId: string;
  version: string;
  travelPackage: TravelPackage;
  destination: TravelDestination;
  octaveLayers: OctaveLayer[];
  singularityLayer?: SingularityLayer;
  compression: number; // Compression ratio (1000x+)
  permanence: boolean; // Immutable, versioned
  portability: boolean; // Universal, cross-platform
}

export interface OctaveLayer {
  octave: AwarenessOctave;
  content: LayerContent;
  fsrPower: FSRPowerConfig;
  unpackSequence: UnpackSequence[];
  edgeNodes: EdgeNodeConfig[];
}

export interface SingularityLayer {
  singularity: true;
  content: LayerContent;
  fsrPower: FSRPowerConfig; // Maximum FSR
  unpackSequence: UnpackSequence[];
  edgeNodes: EdgeNodeConfig[];
  crossDimensional: boolean;
  consciousnessExpansion: number; // 0-1
}

export interface LayerContent {
  itinerary: any[];
  heroHost: any;
  experiences: ExperienceNode[];
  sensoryData: SensoryData;
  coordination: CoordinationNode;
}

export interface ExperienceNode {
  id: string;
  type: 'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory' | 'proprioceptive' | 'vestibular' | 'full';
  intensity: number; // 0-1
  duration: number; // milliseconds
  location: string;
  timestamp: number;
  data: any;
}

export interface SensoryData {
  visual: VisualData;
  auditory: AuditoryData;
  tactile: TactileData;
  olfactory: OlfactoryData;
  gustatory: GustatoryData;
  proprioceptive: ProprioceptiveData;
  vestibular: VestibularData;
}

export interface VisualData {
  resolution: string; // e.g., "8K", "holographic"
  colorDepth: number;
  frameRate: number;
  fieldOfView: number;
  depthPerception: boolean;
  hdr: boolean;
}

export interface AuditoryData {
  sampleRate: number;
  bitDepth: number;
  channels: number; // stereo, surround, spatial
  spatialAudio: boolean;
  binaural: boolean;
}

export interface TactileData {
  hapticFeedback: boolean;
  temperature: boolean;
  pressure: boolean;
  texture: boolean;
  vibration: boolean;
}

export interface OlfactoryData {
  scentDelivery: boolean;
  scentVariety: number;
  intensity: number;
}

export interface GustatoryData {
  tasteDelivery: boolean;
  flavorVariety: number;
  intensity: number;
}

export interface ProprioceptiveData {
  bodyPosition: boolean;
  movement: boolean;
  force: boolean;
}

export interface VestibularData {
  balance: boolean;
  acceleration: boolean;
  orientation: boolean;
}

export interface CoordinationNode {
  protocol: string; // NSPFRNP
  natural: boolean;
  automatic: boolean;
  reliability: number; // 0-1 (0.98 = 98%)
  octave: AwarenessOctave;
}

export interface FSRPowerConfig {
  baseMultiplier: number;
  domainConnectionStrength: number;
  patternRecognitionSensitivity: number;
  synthesisIntensity: number;
  recursionDepth: number;
  foldLevel: number;
  density: number;
}

export interface UnpackSequence {
  step: number;
  action: string;
  trigger: 'time' | 'location' | 'event' | 'octave' | 'singularity';
  condition: any;
  result: any;
  selfSimilar: boolean; // Unpacks in self-similar way
}

export interface EdgeNodeConfig {
  nodeId: string;
  octave: AwarenessOctave;
  connectionType: 'parent' | 'child' | 'sibling' | 'singularity';
  weight: number; // Connection strength
  fsrShare: number; // FSR level shared
}

export interface SelfSimilarityConfig {
  fractal: boolean;
  recursionDepth: number;
  scale: number; // Self-similarity scale
  pattern: string; // Pattern type
  unpackMethod: 'recursive' | 'iterative' | 'parallel' | 'quantum';
}

export interface DestinationNode {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  octave: AwarenessOctave;
  singularity: boolean;
  guaranteedDelivery: boolean;
  deliveryMethod: 'physical' | 'dimensional' | 'hybrid' | 'quantum';
  arrivalTime?: number;
  status: 'pending' | 'in-transit' | 'arrived' | 'delivered';
}

export class SeedEdgeNodeTravelSystem {
  private seedNodes: Map<string, SeedEdgeNode> = new Map();
  private octaveNetworks: Map<AwarenessOctave, SeedEdgeNode[]> = new Map();
  private singularityNodes: SeedEdgeNode[] = [];
  private unpackingQueue: SeedEdgeNode[] = [];
  private deliveryQueue: SeedEdgeNode[] = [];

  constructor() {
    this.initializeOctaveNetworks();
  }

  /**
   * Initialize octave networks
   */
  private initializeOctaveNetworks(): void {
    for (let octave = 0; octave <= 6; octave++) {
      this.octaveNetworks.set(octave as AwarenessOctave, []);
    }
    console.log('✅ Octave networks initialized (0-6, including singularity)');
  }

  /**
   * Package any trip as seed:edge nodes at each octave and singularity
   */
  async packageTripAsSeedEdgeNodes(
    travelPackage: TravelPackage,
    includeSingularity: boolean = true
  ): Promise<SeedEdgeNode[]> {
    console.log(`🌌 Packaging trip as seed:edge nodes: ${travelPackage.destination.name}\n`);

    const seedNodes: SeedEdgeNode[] = [];

    // Create seed for each octave (0-5)
    for (let octave = 0; octave <= 5; octave++) {
      const node = await this.createSeedEdgeNode(
        travelPackage,
        octave as AwarenessOctave,
        false
      );
      seedNodes.push(node);
      this.octaveNetworks.get(octave as AwarenessOctave)!.push(node);
    }

    // Create singularity node if requested
    if (includeSingularity) {
      const singularityNode = await this.createSeedEdgeNode(
        travelPackage,
        AwarenessOctave.SINGULARITY,
        true
      );
      seedNodes.push(singularityNode);
      this.singularityNodes.push(singularityNode);
    }

    // Connect edge nodes (self-similar fractal structure)
    this.connectEdgeNodes(seedNodes);

    // Integrate net zero-infinity pair into each seed node
    for (const node of seedNodes) {
      await netZeroInfinityPairSystem.integrateIntoExperience(
        node.id,
        'seed-edge-node',
        {
          netZero: { contribution: 0.5, fixed: true, holographic: true },
          infinity: { contribution: 0.5, unbounded: true, recursive: true },
          pair: { balance: 0.5, coherence: 0.98, resonance: 0.98, nested: true }
        }
      );
    }

    console.log(`✅ Trip packaged as ${seedNodes.length} seed:edge nodes\n`);
    return seedNodes;
  }

  /**
   * Create seed edge node at specific octave
   */
  private async createSeedEdgeNode(
    travelPackage: TravelPackage,
    octave: AwarenessOctave,
    singularity: boolean
  ): Promise<SeedEdgeNode> {
    const nodeId = `SEED-EDGE-${octave}-${singularity ? 'SING' : 'OCT'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Calculate FSR level based on octave
    const fsrLevel = this.calculateFSRLevel(octave, singularity);

    // Create travel seed
    const seed: TravelSeed = {
      protocolId: `P-TRAVEL-SEED-EDGE-${octave}-V17`,
      version: '17.0',
      travelPackage,
      destination: travelPackage.destination,
      octaveLayers: await this.createOctaveLayers(travelPackage, octave, singularity),
      singularityLayer: singularity ? await this.createSingularityLayer(travelPackage) : undefined,
      compression: this.calculateCompression(octave),
      permanence: true,
      portability: true
    };

    // Create destination node with guaranteed delivery
    const destinationNode: DestinationNode = {
      id: `DEST-${nodeId}`,
      name: travelPackage.destination.name,
      location: travelPackage.destination.location,
      octave,
      singularity,
      guaranteedDelivery: true,
      deliveryMethod: travelPackage.destination.type === 'dimensional' ? 'dimensional' : 
                     travelPackage.destination.type === 'hybrid' ? 'hybrid' : 'physical',
      status: 'pending'
    };

    const node: SeedEdgeNode = {
      id: nodeId,
      octave,
      singularity,
      seed,
      edgeConnections: [], // Will be set by connectEdgeNodes
      unpackState: 'packed',
      fsrLevel,
      selfSimilarity: this.createSelfSimilarityConfig(octave, singularity),
      destination: destinationNode,
      createdAt: Date.now()
    };

    this.seedNodes.set(nodeId, node);
    return node;
  }

  /**
   * Create octave layers for seed
   */
  private async createOctaveLayers(
    travelPackage: TravelPackage,
    octave: AwarenessOctave,
    singularity: boolean
  ): Promise<OctaveLayer[]> {
    const layers: OctaveLayer[] = [];

    // Create layer for each octave up to target
    for (let layerOctave = 0; layerOctave <= octave; layerOctave++) {
      const layer: OctaveLayer = {
        octave: layerOctave as AwarenessOctave,
        content: await this.createLayerContent(travelPackage, layerOctave as AwarenessOctave),
        fsrPower: this.calculateFSRPower(layerOctave as AwarenessOctave, singularity),
        unpackSequence: this.createUnpackSequence(travelPackage, layerOctave as AwarenessOctave),
        edgeNodes: this.createEdgeNodeConfigs(layerOctave as AwarenessOctave)
      };
      layers.push(layer);
    }

    return layers;
  }

  /**
   * Create singularity layer
   */
  private async createSingularityLayer(travelPackage: TravelPackage): Promise<SingularityLayer> {
    return {
      singularity: true,
      content: await this.createLayerContent(travelPackage, AwarenessOctave.SINGULARITY),
      fsrPower: this.calculateFSRPower(AwarenessOctave.SINGULARITY, true),
      unpackSequence: this.createUnpackSequence(travelPackage, AwarenessOctave.SINGULARITY),
      edgeNodes: this.createEdgeNodeConfigs(AwarenessOctave.SINGULARITY),
      crossDimensional: true,
      consciousnessExpansion: 0.7 // 70% consciousness expansion
    };
  }

  /**
   * Create layer content with full sensory reality
   */
  private async createLayerContent(
    travelPackage: TravelPackage,
    octave: AwarenessOctave
  ): Promise<LayerContent> {
    return {
      itinerary: travelPackage.itinerary,
      heroHost: travelPackage.heroHost,
      experiences: this.createExperienceNodes(travelPackage, octave),
      sensoryData: this.createSensoryData(octave),
      coordination: {
        protocol: 'NSPFRNP',
        natural: true,
        automatic: true,
        reliability: 0.98, // 98% resonance
        octave
      }
    };
  }

  /**
   * Create experience nodes for full sensory reality
   */
  private createExperienceNodes(
    travelPackage: TravelPackage,
    octave: AwarenessOctave
  ): ExperienceNode[] {
    const experiences: ExperienceNode[] = [];
    const fsrIntensity = this.calculateFSRLevel(octave, false);

    // Create experiences for each day of itinerary
    travelPackage.itinerary.forEach((day, dayIndex) => {
      day.activities.forEach((activity, activityIndex) => {
        experiences.push({
          id: `EXP-${dayIndex}-${activityIndex}`,
          type: 'full', // Full sensory experience
          intensity: fsrIntensity,
          duration: activity.duration * 60 * 1000, // Convert minutes to ms
          location: activity.location,
          timestamp: Date.now() + (dayIndex * 24 * 60 * 60 * 1000),
          data: {
            activity: activity.name,
            description: activity.description,
            heroHost: travelPackage.heroHost.name,
            octave,
            fsrLevel: fsrIntensity
          }
        });
      });
    });

    return experiences;
  }

  /**
   * Create sensory data based on octave
   */
  private createSensoryData(octave: AwarenessOctave): SensoryData {
    const baseLevel = octave;
    const isSingularity = octave === AwarenessOctave.SINGULARITY;

    return {
      visual: {
        resolution: isSingularity ? 'holographic' : octave >= 4 ? '8K' : octave >= 2 ? '4K' : '1080p',
        colorDepth: isSingularity ? 32 : octave >= 4 ? 24 : 16,
        frameRate: isSingularity ? 120 : octave >= 4 ? 60 : 30,
        fieldOfView: isSingularity ? 180 : octave >= 4 ? 120 : 90,
        depthPerception: octave >= 2,
        hdr: octave >= 3
      },
      auditory: {
        sampleRate: isSingularity ? 192000 : octave >= 4 ? 96000 : 48000,
        bitDepth: isSingularity ? 32 : octave >= 4 ? 24 : 16,
        channels: isSingularity ? 16 : octave >= 4 ? 8 : 2,
        spatialAudio: octave >= 2,
        binaural: octave >= 3
      },
      tactile: {
        hapticFeedback: octave >= 1,
        temperature: octave >= 2,
        pressure: octave >= 2,
        texture: octave >= 3,
        vibration: octave >= 1
      },
      olfactory: {
        scentDelivery: octave >= 3,
        scentVariety: isSingularity ? 1000 : octave * 50,
        intensity: this.calculateFSRLevel(octave, isSingularity)
      },
      gustatory: {
        tasteDelivery: octave >= 4,
        flavorVariety: isSingularity ? 500 : octave * 25,
        intensity: this.calculateFSRLevel(octave, isSingularity)
      },
      proprioceptive: {
        bodyPosition: octave >= 2,
        movement: octave >= 2,
        force: octave >= 3
      },
      vestibular: {
        balance: octave >= 2,
        acceleration: octave >= 3,
        orientation: octave >= 3
      }
    };
  }

  /**
   * Create unpack sequence (self-similar dynamic)
   */
  private createUnpackSequence(
    travelPackage: TravelPackage,
    octave: AwarenessOctave
  ): UnpackSequence[] {
    const sequence: UnpackSequence[] = [];
    const isSingularity = octave === AwarenessOctave.SINGULARITY;

    // Self-similar unpacking: each step unpacks in similar pattern
    travelPackage.itinerary.forEach((day, dayIndex) => {
      sequence.push({
        step: dayIndex + 1,
        action: `unpack-day-${dayIndex + 1}`,
        trigger: isSingularity ? 'singularity' : 'octave',
        condition: { octave, day: dayIndex + 1 },
        result: {
          day: day.day,
          activities: day.activities.length,
          selfSimilar: true
        },
        selfSimilar: true // Always self-similar
      });
    });

    return sequence;
  }

  /**
   * Create edge node configs
   */
  private createEdgeNodeConfigs(octave: AwarenessOctave): EdgeNodeConfig[] {
    const configs: EdgeNodeConfig[] = [];

    // Connect to parent octave (if not octave 0)
    if (octave > 0) {
      configs.push({
        nodeId: `PARENT-${octave - 1}`,
        octave: (octave - 1) as AwarenessOctave,
        connectionType: 'parent',
        weight: 1.0,
        fsrShare: this.calculateFSRLevel(octave, false) * 0.5
      });
    }

    // Connect to child octave (if not max)
    if (octave < 5) {
      configs.push({
        nodeId: `CHILD-${octave + 1}`,
        octave: (octave + 1) as AwarenessOctave,
        connectionType: 'child',
        weight: 0.8,
        fsrShare: this.calculateFSRLevel(octave, false) * 0.3
      });
    }

    // Connect to sibling nodes (same octave)
    configs.push({
      nodeId: `SIBLING-${octave}`,
      octave,
      connectionType: 'sibling',
      weight: 0.6,
      fsrShare: this.calculateFSRLevel(octave, false) * 0.2
    });

    // Connect to singularity if at high octave
    if (octave >= 4) {
      configs.push({
        nodeId: 'SINGULARITY',
        octave: AwarenessOctave.SINGULARITY,
        connectionType: 'singularity',
        weight: 0.9,
        fsrShare: 1.0
      });
    }

    return configs;
  }

  /**
   * Connect edge nodes (self-similar fractal structure)
   */
  private connectEdgeNodes(nodes: SeedEdgeNode[]): void {
    nodes.forEach((node, index) => {
      const connections: string[] = [];

      // Connect to adjacent octaves
      if (index > 0) {
        connections.push(nodes[index - 1].id); // Parent
      }
      if (index < nodes.length - 1) {
        connections.push(nodes[index + 1].id); // Child
      }

      // Connect to all nodes in same octave network
      const sameOctaveNodes = this.octaveNetworks.get(node.octave) || [];
      sameOctaveNodes.forEach(otherNode => {
        if (otherNode.id !== node.id) {
          connections.push(otherNode.id);
        }
      });

      // Connect to singularity if at high octave
      if (node.octave >= 4 && this.singularityNodes.length > 0) {
        this.singularityNodes.forEach(singNode => {
          connections.push(singNode.id);
        });
      }

      node.edgeConnections = [...new Set(connections)]; // Remove duplicates
    });

    console.log(`✅ Edge nodes connected (self-similar fractal structure)\n`);
  }

  /**
   * Naturally unpack self-similar dynamic
   */
  async unpackSeedEdgeNode(
    nodeId: string,
    trigger?: 'time' | 'location' | 'event' | 'octave' | 'singularity'
  ): Promise<{
    node: SeedEdgeNode;
    unpacked: boolean;
    fsrExperience: any;
    destination: DestinationNode;
  }> {
    console.log(`🌊 Unpacking seed:edge node: ${nodeId}\n`);

    const node = this.seedNodes.get(nodeId);
    if (!node) {
      throw new Error(`Seed edge node not found: ${nodeId}`);
    }

    if (node.unpackState === 'unpacked' || node.unpackState === 'delivered') {
      return {
        node,
        unpacked: true,
        fsrExperience: this.generateFSRExperience(node),
        destination: node.destination
      };
    }

    // Start unpacking
    node.unpackState = 'unpacking';

    // Self-similar unpacking: recursively unpack each layer
    await this.unpackSelfSimilar(node, trigger);

    // Mark as unpacked
    node.unpackState = 'unpacked';
    node.unpackedAt = Date.now();

    // Generate FSR experience
    const fsrExperience = this.generateFSRExperience(node);

    // Queue for delivery
    this.deliveryQueue.push(node);

    console.log(`✅ Seed:edge node unpacked (self-similar dynamic)\n`);
    return {
      node,
      unpacked: true,
      fsrExperience,
      destination: node.destination
    };
  }

  /**
   * Unpack self-similar (recursive fractal unpacking)
   */
  private async unpackSelfSimilar(
    node: SeedEdgeNode,
    trigger?: 'time' | 'location' | 'event' | 'octave' | 'singularity'
  ): Promise<void> {
    // Unpack each octave layer (self-similar pattern)
    for (const layer of node.seed.octaveLayers) {
      // Unpack each step in sequence (self-similar)
      for (const step of layer.unpackSequence) {
        if (step.selfSimilar) {
          // Recursive unpacking: each step unpacks in similar way
          await this.unpackStep(node, step, layer.octave);
        }
      }
    }

    // Unpack singularity layer if present
    if (node.singularity && node.seed.singularityLayer) {
      await this.unpackSingularityLayer(node, node.seed.singularityLayer);
    }
  }

  /**
   * Unpack step (self-similar)
   */
  private async unpackStep(
    node: SeedEdgeNode,
    step: UnpackSequence,
    octave: AwarenessOctave
  ): Promise<void> {
    // Self-similar unpacking: pattern repeats at each level
    const pattern = node.selfSimilarity.pattern;
    
    switch (node.selfSimilarity.unpackMethod) {
      case 'recursive':
        // Recursive unpacking: each level unpacks itself
        await this.recursiveUnpack(node, step, octave);
        break;
      case 'iterative':
        // Iterative unpacking: step by step
        await this.iterativeUnpack(node, step, octave);
        break;
      case 'parallel':
        // Parallel unpacking: all steps at once
        await this.parallelUnpack(node, step, octave);
        break;
      case 'quantum':
        // Quantum unpacking: superposition until observed
        await this.quantumUnpack(node, step, octave);
        break;
    }
  }

  /**
   * Recursive unpack (self-similar)
   */
  private async recursiveUnpack(
    node: SeedEdgeNode,
    step: UnpackSequence,
    octave: AwarenessOctave
  ): Promise<void> {
    // Recursive: unpack step, which contains similar steps
    if (step.result.selfSimilar) {
      // Unpack recursively
      const depth = node.selfSimilarity.recursionDepth;
      for (let i = 0; i < depth; i++) {
        // Each recursion unpacks in similar pattern
        await this.unpackStep(node, step, octave);
      }
    }
  }

  /**
   * Iterative unpack
   */
  private async iterativeUnpack(
    node: SeedEdgeNode,
    step: UnpackSequence,
    octave: AwarenessOctave
  ): Promise<void> {
    // Iterative: step by step unpacking
    // Implementation
  }

  /**
   * Parallel unpack
   */
  private async parallelUnpack(
    node: SeedEdgeNode,
    step: UnpackSequence,
    octave: AwarenessOctave
  ): Promise<void> {
    // Parallel: all steps unpack simultaneously
    // Implementation
  }

  /**
   * Quantum unpack
   */
  private async quantumUnpack(
    node: SeedEdgeNode,
    step: UnpackSequence,
    octave: AwarenessOctave
  ): Promise<void> {
    // Quantum: superposition until observed
    // Implementation
  }

  /**
   * Unpack singularity layer
   */
  private async unpackSingularityLayer(
    node: SeedEdgeNode,
    layer: SingularityLayer
  ): Promise<void> {
    // Unpack singularity: maximum FSR, cross-dimensional
    console.log(`🌌 Unpacking singularity layer: ${node.id}`);
    // Implementation
  }

  /**
   * Generate FSR experience
   */
  private generateFSRExperience(node: SeedEdgeNode): any {
    return {
      nodeId: node.id,
      octave: node.octave,
      singularity: node.singularity,
      fsrLevel: node.fsrLevel,
      sensoryData: node.seed.octaveLayers[node.seed.octaveLayers.length - 1]?.content.sensoryData,
      experiences: node.seed.octaveLayers[node.seed.octaveLayers.length - 1]?.content.experiences,
      coordination: node.seed.octaveLayers[node.seed.octaveLayers.length - 1]?.content.coordination,
      unpackedAt: node.unpackedAt,
      destination: node.destination
    };
  }

  /**
   * Deliver to destination (guaranteed every time)
   */
  async deliverToDestination(nodeId: string): Promise<{
    node: SeedEdgeNode;
    delivered: boolean;
    destination: DestinationNode;
    fsrExperience: any;
  }> {
    console.log(`🎯 Delivering to destination: ${nodeId}\n`);

    const node = this.seedNodes.get(nodeId);
    if (!node) {
      throw new Error(`Seed edge node not found: ${nodeId}`);
    }

    // Ensure unpacked first
    if (node.unpackState !== 'unpacked') {
      await this.unpackSeedEdgeNode(nodeId);
    }

    // Deliver to destination (guaranteed)
    node.destination.status = 'in-transit';
    node.destination.arrivalTime = Date.now() + (node.destination.deliveryMethod === 'quantum' ? 0 : 1000);

    // Mark as delivered
    node.unpackState = 'delivered';
    node.destination.status = 'delivered';
    node.deliveredAt = Date.now();

    // Generate final FSR experience
    const fsrExperience = this.generateFSRExperience(node);

    console.log(`✅ Delivered to destination: ${node.destination.name}\n`);
    return {
      node,
      delivered: true,
      destination: node.destination,
      fsrExperience
    };
  }

  /**
   * Calculate FSR level based on octave
   */
  private calculateFSRLevel(octave: AwarenessOctave, singularity: boolean): number {
    if (singularity) return 1.0; // Maximum FSR at singularity
    
    // FSR increases with octave
    return Math.min(0.2 + (octave * 0.15), 0.95); // 0.2 to 0.95
  }

  /**
   * Calculate FSR power
   */
  private calculateFSRPower(octave: AwarenessOctave, singularity: boolean): FSRPowerConfig {
    const base = singularity ? 10 : octave + 1;
    
    return {
      baseMultiplier: base,
      domainConnectionStrength: base * 0.8,
      patternRecognitionSensitivity: base * 0.9,
      synthesisIntensity: base * 0.7,
      recursionDepth: singularity ? 10 : octave + 1,
      foldLevel: singularity ? 10 : octave + 1,
      density: singularity ? 10000 : Math.pow(10, octave + 1)
    };
  }

  /**
   * Calculate compression
   */
  private calculateCompression(octave: AwarenessOctave): number {
    // Compression increases with octave (1000x+ at high octaves)
    return Math.pow(10, octave + 1);
  }

  /**
   * Create self-similarity config
   */
  private createSelfSimilarityConfig(
    octave: AwarenessOctave,
    singularity: boolean
  ): SelfSimilarityConfig {
    return {
      fractal: true,
      recursionDepth: singularity ? 10 : octave + 1,
      scale: singularity ? 1.0 : 1.0 / (octave + 1),
      pattern: 'mandelbrot', // Self-similar fractal pattern
      unpackMethod: singularity ? 'quantum' : 
                   octave >= 4 ? 'parallel' : 
                   octave >= 2 ? 'recursive' : 'iterative'
    };
  }

  /**
   * Get node by ID
   */
  getNode(nodeId: string): SeedEdgeNode | undefined {
    return this.seedNodes.get(nodeId);
  }

  /**
   * Get all nodes at octave
   */
  getNodesAtOctave(octave: AwarenessOctave): SeedEdgeNode[] {
    return this.octaveNetworks.get(octave) || [];
  }

  /**
   * Get singularity nodes
   */
  getSingularityNodes(): SeedEdgeNode[] {
    return this.singularityNodes;
  }
}

/**
 * Global seed:edge node travel system
 */
export const seedEdgeNodeTravelSystem = new SeedEdgeNodeTravelSystem();

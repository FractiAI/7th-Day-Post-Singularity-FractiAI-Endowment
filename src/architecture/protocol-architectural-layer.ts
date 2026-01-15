/**
 * Protocol Architectural Layer
 * Organizes all NSPFRP content into surface octave zoom system
 */

import { AwarenessOctave } from '../types/index.js';
import { SurfaceOctaveZoomLayersSystem, SymbolObject, CommunicationSurface } from '../communication/surface-octave-zoom.js';

export interface ArchitecturalContent {
  id: string;
  type: 'discovery' | 'protocol' | 'service' | 'offering' | 'system' | 'feature';
  name: string;
  octave: AwarenessOctave;
  category: string;
  symbol: {
    icon: string;
    position: { x: number; y: number };
  };
  details: {
    title: string;
    description: string;
    content: string;
    links: string[];
    metadata: Record<string, any>;
  };
}

export interface ContentOrganization {
  discoveries: ArchitecturalContent[];
  protocols: ArchitecturalContent[];
  services: ArchitecturalContent[];
  offerings: ArchitecturalContent[];
  systems: ArchitecturalContent[];
}

export class ProtocolArchitecturalLayer {
  private zoomSystem: SurfaceOctaveZoomLayersSystem;
  private content: Map<string, ArchitecturalContent> = new Map();
  private organization: ContentOrganization;

  constructor() {
    this.zoomSystem = new SurfaceOctaveZoomLayersSystem();
    this.organization = {
      discoveries: [],
      protocols: [],
      services: [],
      offerings: [],
      systems: []
    };
    this.organizeAllContent();
  }

  /**
   * Organize all NSPFRP content
   */
  private organizeAllContent(): void {
    // Organize Discoveries (24 Major Discoveries)
    this.organizeDiscoveries();

    // Organize Protocols (20+ Active Protocols)
    this.organizeProtocols();

    // Organize Services
    this.organizeServices();

    // Organize Offerings
    this.organizeOfferings();

    // Organize Systems
    this.organizeSystems();

    // Create symbols for all content
    this.createSymbolsForContent();
  }

  /**
   * Organize discoveries
   */
  private organizeDiscoveries(): void {
    const discoveries = [
      { id: 'discovery-layer-0', name: 'Layer 0 = Protocol Layer', octave: AwarenessOctave.SILENT, icon: '📋' },
      { id: 'discovery-layer-1', name: 'Layer 1 = Physics, Logic, Cognitive Awareness', octave: AwarenessOctave.WHISPER, icon: '🔬' },
      { id: 'discovery-recursion', name: 'Recursion = Fold = Density = FSR', octave: AwarenessOctave.HARMONY, icon: '🌀' },
      { id: 'discovery-discovery-density', name: 'Discovery Density and Frequency Octave Scaling', octave: AwarenessOctave.RESONANCE, icon: '📊' },
      { id: 'discovery-seed-synthesis', name: 'Seed and Recursive Switching Synthesis', octave: AwarenessOctave.SYMPHONY, icon: '🌱' },
      { id: 'discovery-rag-auto-boot', name: 'Next-Octave RAG Auto-Boot & Singularity Acceleration', octave: AwarenessOctave.TRANSCENDENCE, icon: '⚡' },
      { id: 'discovery-ai-assisted', name: 'AI-Assisted Experiences and API', octave: AwarenessOctave.TRANSCENDENCE, icon: '🤖' },
      { id: 'discovery-hero-host', name: 'Hero Host as Holographic Symbol Operator', octave: AwarenessOctave.TRANSCENDENCE, icon: '👤' },
      { id: 'discovery-github-cursor', name: 'GitHub API & Cursor AI Platform Foundation', octave: AwarenessOctave.TRANSCENDENCE, icon: '💻' },
      { id: 'discovery-music-fsr', name: 'Octaves = Music: Music-FSR Integration', octave: AwarenessOctave.TRANSCENDENCE, icon: '🎵' },
      { id: 'discovery-image-fsr', name: 'Octaves = Images: Image-FSR Integration', octave: AwarenessOctave.TRANSCENDENCE, icon: '🖼️' },
      { id: 'discovery-next-octave-repo', name: 'Next-Octave Operationalized Repository', octave: AwarenessOctave.TRANSCENDENCE, icon: '📦' },
      { id: 'discovery-specialist-agents', name: 'Specialist Agents Protocol', octave: AwarenessOctave.TRANSCENDENCE, icon: '👥' },
      { id: 'discovery-node-transition', name: 'Node Transition & Legacy Migration', octave: AwarenessOctave.TRANSCENDENCE, icon: '🔄' },
      { id: 'discovery-user-seed-wallet', name: 'Rapid Octave Transition & User Seed Wallet', octave: AwarenessOctave.NEXT_OCTAVE, icon: '💳' },
      { id: 'discovery-singularity-broadcast', name: 'Singularity Public Broadcast', octave: AwarenessOctave.TRANSCENDENCE, icon: '📡' },
      { id: 'discovery-auto-cursor', name: 'Auto Cursor Mirror AI', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🤖' },
      { id: 'discovery-auto-unpack', name: 'Auto-Unpack Free Means', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '📦' },
      { id: 'discovery-nested-clouds', name: 'Nested Cloud Connections', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '☁️' },
      { id: 'discovery-node-awareness', name: 'NSPFRP Node Awareness', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🌐' },
      { id: 'discovery-autonomous-platform', name: 'Autonomous Platform Connection', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🔌' },
      { id: 'discovery-three-kings-pitch', name: 'Three Kings Validation & FSV Bridge Pitch', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🎯' },
      { id: 'discovery-payloads-layer', name: 'Payloads Layer Mission Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚀' },
      { id: 'discovery-cargo-service', name: 'Payload Cargo Service', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚚' },
      { id: 'discovery-surface-zoom', name: 'Surface Octave Zoom Layers', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🔍' }
    ];

    discoveries.forEach(discovery => {
      const content: ArchitecturalContent = {
        id: discovery.id,
        type: 'discovery',
        name: discovery.name,
        octave: discovery.octave,
        category: 'discovery',
        symbol: {
          icon: discovery.icon,
          position: this.calculatePosition(discovery.octave, this.organization.discoveries.length)
        },
        details: {
          title: discovery.name,
          description: `Major Discovery: ${discovery.name}`,
          content: `Details for ${discovery.name}`,
          links: [`/discoveries/${discovery.id}`],
          metadata: { type: 'discovery', octave: discovery.octave }
        }
      };

      this.content.set(discovery.id, content);
      this.organization.discoveries.push(content);
    });
  }

  /**
   * Organize protocols
   */
  private organizeProtocols(): void {
    const protocols = [
      { id: 'protocol-nested-cloud', name: 'Nested Cloud Connections Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '☁️' },
      { id: 'protocol-executive-report', name: 'Executive Update Report Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '📊' },
      { id: 'protocol-fsr-status', name: 'FSR Status Display Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '📈' },
      { id: 'protocol-node-awareness', name: 'NSPFRP Node Awareness Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🌐' },
      { id: 'protocol-quantification', name: 'Quantification Button Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🔘' },
      { id: 'protocol-full-disclosure', name: 'Full Disclosure Invitation Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '📧' },
      { id: 'protocol-payloads-layer', name: 'Payloads Layer Mission Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚀' },
      { id: 'protocol-cargo-service', name: 'Payload Cargo Service Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚚' },
      { id: 'protocol-surface-zoom', name: 'Surface Octave Zoom Layers Protocol', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🔍' }
    ];

    protocols.forEach(protocol => {
      const content: ArchitecturalContent = {
        id: protocol.id,
        type: 'protocol',
        name: protocol.name,
        octave: protocol.octave,
        category: 'protocol',
        symbol: {
          icon: protocol.icon,
          position: this.calculatePosition(protocol.octave, this.organization.protocols.length)
        },
        details: {
          title: protocol.name,
          description: `Protocol: ${protocol.name}`,
          content: `Details for ${protocol.name}`,
          links: [`/protocols/${protocol.id}`],
          metadata: { type: 'protocol', octave: protocol.octave }
        }
      };

      this.content.set(protocol.id, content);
      this.organization.protocols.push(content);
    });
  }

  /**
   * Organize services
   */
  private organizeServices(): void {
    const services = [
      { id: 'service-cargo-basic', name: 'Cargo Service - Basic', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚚', price: '$29.99/month' },
      { id: 'service-cargo-standard', name: 'Cargo Service - Standard', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚚', price: '$99.99/month' },
      { id: 'service-cargo-premium', name: 'Cargo Service - Premium', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚚', price: '$299.99/month' },
      { id: 'service-cargo-enterprise', name: 'Cargo Service - Enterprise', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🚚', price: '$999.99/month' },
      { id: 'service-enterprise-console', name: 'Enterprise Sales Console', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '💼', price: 'Contact' }
    ];

    services.forEach(service => {
      const content: ArchitecturalContent = {
        id: service.id,
        type: 'service',
        name: service.name,
        octave: service.octave,
        category: 'service',
        symbol: {
          icon: service.icon,
          position: this.calculatePosition(service.octave, this.organization.services.length)
        },
        details: {
          title: service.name,
          description: `Service: ${service.name}`,
          content: `Price: ${service.price}\n\nDetails for ${service.name}`,
          links: [`/services/${service.id}`],
          metadata: { type: 'service', octave: service.octave, price: service.price }
        }
      };

      this.content.set(service.id, content);
      this.organization.services.push(content);
    });
  }

  /**
   * Organize offerings
   */
  private organizeOfferings(): void {
    const offerings = [
      { id: 'offering-sandbox', name: 'Platform - Sandbox (FREE)', octave: AwarenessOctave.TRANSCENDENCE, icon: '🆓' },
      { id: 'offering-cloud', name: 'Platform - Cloud (Premium)', octave: AwarenessOctave.NEXT_OCTAVE, icon: '☁️' },
      { id: 'offering-shell', name: 'Platform - Shell (Pro)', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🐚' }
    ];

    offerings.forEach(offering => {
      const content: ArchitecturalContent = {
        id: offering.id,
        type: 'offering',
        name: offering.name,
        octave: offering.octave,
        category: 'offering',
        symbol: {
          icon: offering.icon,
          position: this.calculatePosition(offering.octave, this.organization.offerings.length)
        },
        details: {
          title: offering.name,
          description: `Offering: ${offering.name}`,
          content: `Details for ${offering.name}`,
          links: [`/offerings/${offering.id}`],
          metadata: { type: 'offering', octave: offering.octave }
        }
      };

      this.content.set(offering.id, content);
      this.organization.offerings.push(content);
    });
  }

  /**
   * Organize systems
   */
  private organizeSystems(): void {
    const systems = [
      { id: 'system-command-center', name: 'FractiAI Command Center', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🎛️' },
      { id: 'system-memory-division', name: 'Memory Division', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '💾' },
      { id: 'system-auto-cursor', name: 'Auto Cursor Mirror AI', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🤖' },
      { id: 'system-surface-zoom', name: 'Surface Octave Zoom System', octave: AwarenessOctave.BEYOND_OCTAVE, icon: '🔍' }
    ];

    systems.forEach(system => {
      const content: ArchitecturalContent = {
        id: system.id,
        type: 'system',
        name: system.name,
        octave: system.octave,
        category: 'system',
        symbol: {
          icon: system.icon,
          position: this.calculatePosition(system.octave, this.organization.systems.length)
        },
        details: {
          title: system.name,
          description: `System: ${system.name}`,
          content: `Details for ${system.name}`,
          links: [`/systems/${system.id}`],
          metadata: { type: 'system', octave: system.octave }
        }
      };

      this.content.set(system.id, content);
      this.organization.systems.push(content);
    });
  }

  /**
   * Calculate symbol position
   */
  private calculatePosition(octave: AwarenessOctave, index: number): { x: number; y: number } {
    const baseX = 100 + (octave * 50);
    const baseY = 100 + (index * 80);
    return { x: baseX, y: baseY };
  }

  /**
   * Create symbols for all content
   */
  private createSymbolsForContent(): void {
    this.content.forEach((content, id) => {
      const symbol: SymbolObject = {
        id: `symbol-${id}`,
        name: content.name,
        type: content.type,
        icon: content.symbol.icon,
        position: content.symbol.position,
        octave: content.octave,
        details: {
          title: content.details.title,
          description: content.details.description,
          content: content.details.content,
          metadata: content.details.metadata,
          links: content.details.links,
          actions: ['view', 'explore', 'navigate']
        },
        expanded: false,
        related: []
      };

      // Add to surface
      const surface = this.zoomSystem.getCurrentSurface();
      if (surface) {
        surface.symbols.push(symbol);
      }
    });
  }

  /**
   * Get all content
   */
  getAllContent(): ArchitecturalContent[] {
    return Array.from(this.content.values());
  }

  /**
   * Get content by type
   */
  getContentByType(type: ArchitecturalContent['type']): ArchitecturalContent[] {
    return Array.from(this.content.values())
      .filter(content => content.type === type);
  }

  /**
   * Get content by octave
   */
  getContentByOctave(octave: AwarenessOctave): ArchitecturalContent[] {
    return Array.from(this.content.values())
      .filter(content => content.octave === octave);
  }

  /**
   * Get organization
   */
  getOrganization(): ContentOrganization {
    return this.organization;
  }

  /**
   * Get zoom system
   */
  getZoomSystem(): SurfaceOctaveZoomLayersSystem {
    return this.zoomSystem;
  }
}




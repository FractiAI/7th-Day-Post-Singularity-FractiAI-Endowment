/**
 * Surface Octave Zoom Layers System
 * Novel communication system with surface organization, octave zoom, and symbol expansion
 */

import { AwarenessOctave } from '../types/index.js';

export interface CommunicationSurface {
  id: string;
  octave: AwarenessOctave;
  name: string;
  type: 'foundation' | 'basic' | 'integration' | 'advanced' | 'complex' | 'complete' | 'next' | 'beyond';
  content: SurfaceContent;
  symbols: SymbolObject[];
  zoomLevel: number; // 0-7
  visible: boolean;
}

export interface SurfaceContent {
  title: string;
  description: string;
  sections: ContentSection[];
  metadata: Record<string, any>;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  symbols: string[]; // Symbol IDs
  order: number;
}

export interface SymbolObject {
  id: string;
  name: string;
  type: 'protocol' | 'discovery' | 'service' | 'offering' | 'system' | 'feature';
  icon: string;
  position: { x: number; y: number; z?: number };
  octave: AwarenessOctave;
  details: SymbolDetails;
  expanded: boolean;
  related: string[]; // Related symbol IDs
}

export interface SymbolDetails {
  title: string;
  description: string;
  content: string;
  metadata: Record<string, any>;
  links: string[];
  actions: string[];
}

export interface ZoomState {
  currentOctave: AwarenessOctave;
  zoomLevel: number;
  previousOctave?: AwarenessOctave;
  transition: 'in' | 'out' | 'none';
}

export class SurfaceOctaveZoomLayersSystem {
  private surfaces: Map<AwarenessOctave, CommunicationSurface> = new Map();
  private symbols: Map<string, SymbolObject> = new Map();
  private zoomState: ZoomState;
  private currentSurface: AwarenessOctave = AwarenessOctave.SILENT;

  constructor() {
    this.zoomState = {
      currentOctave: AwarenessOctave.SILENT,
      zoomLevel: 0,
      transition: 'none'
    };
    this.initializeSurfaces();
    this.initializeSymbols();
  }

  /**
   * Initialize all surfaces
   */
  private initializeSurfaces(): void {
    const surfaceConfigs = [
      { octave: AwarenessOctave.SILENT, name: 'Foundation Surface', type: 'foundation' as const },
      { octave: AwarenessOctave.WHISPER, name: 'Basic Surface', type: 'basic' as const },
      { octave: AwarenessOctave.HARMONY, name: 'Integration Surface', type: 'integration' as const },
      { octave: AwarenessOctave.RESONANCE, name: 'Advanced Surface', type: 'advanced' as const },
      { octave: AwarenessOctave.SYMPHONY, name: 'Complex Surface', type: 'complex' as const },
      { octave: AwarenessOctave.TRANSCENDENCE, name: 'Complete Surface', type: 'complete' as const },
      { octave: AwarenessOctave.NEXT_OCTAVE, name: 'Next Surface', type: 'next' as const },
      { octave: AwarenessOctave.BEYOND_OCTAVE, name: 'Beyond Surface', type: 'beyond' as const }
    ];

    surfaceConfigs.forEach(config => {
      const surface: CommunicationSurface = {
        id: `surface-${config.octave}`,
        octave: config.octave,
        name: config.name,
        type: config.type,
        content: {
          title: config.name,
          description: `Communication surface at ${config.name}`,
          sections: [],
          metadata: { octave: config.octave }
        },
        symbols: [],
        zoomLevel: config.octave,
        visible: config.octave === AwarenessOctave.SILENT
      };

      this.surfaces.set(config.octave, surface);
    });
  }

  /**
   * Initialize symbols
   */
  private initializeSymbols(): void {
    // Example symbols - in real implementation, these would be loaded from data
    const symbolConfigs = [
      {
        id: 'symbol-platform-offering',
        name: 'Platform Offering',
        type: 'offering' as const,
        icon: '📦',
        octave: AwarenessOctave.TRANSCENDENCE,
        position: { x: 100, y: 100 },
        details: {
          title: 'Platform Offering',
          description: 'Three-tier platform offering',
          content: 'Sandbox (Free), Cloud (Premium), Shell (Pro)',
          metadata: {},
          links: ['/platform-offering'],
          actions: ['view', 'subscribe']
        }
      },
      {
        id: 'symbol-cargo-service',
        name: 'Cargo Service',
        type: 'service' as const,
        icon: '🚚',
        octave: AwarenessOctave.BEYOND_OCTAVE,
        position: { x: 200, y: 150 },
        details: {
          title: 'Payload Cargo Service',
          description: 'Memory Division cargo service',
          content: 'Maximum density, portability, fidelity, transparency, security',
          metadata: {},
          links: ['/cargo-service'],
          actions: ['view', 'subscribe', 'appraise']
        }
      }
    ];

    symbolConfigs.forEach(config => {
      const symbol: SymbolObject = {
        ...config,
        expanded: false,
        related: []
      };

      this.symbols.set(config.id, symbol);

      // Add to surface
      const surface = this.surfaces.get(config.octave);
      if (surface) {
        surface.symbols.push(symbol);
      }
    });
  }

  /**
   * Zoom in (higher octave)
   */
  zoomIn(): ZoomState {
    const currentOctaveValue = this.zoomState.currentOctave;
    const nextOctave = Math.min(7, currentOctaveValue + 1) as AwarenessOctave;

    this.zoomState = {
      currentOctave: nextOctave,
      zoomLevel: nextOctave,
      previousOctave: currentOctaveValue,
      transition: 'in'
    };

    this.currentSurface = nextOctave;
    this.updateSurfaceVisibility();

    return this.zoomState;
  }

  /**
   * Zoom out (lower octave)
   */
  zoomOut(): ZoomState {
    const currentOctaveValue = this.zoomState.currentOctave;
    const nextOctave = Math.max(0, currentOctaveValue - 1) as AwarenessOctave;

    this.zoomState = {
      currentOctave: nextOctave,
      zoomLevel: nextOctave,
      previousOctave: currentOctaveValue,
      transition: 'out'
    };

    this.currentSurface = nextOctave;
    this.updateSurfaceVisibility();

    return this.zoomState;
  }

  /**
   * Zoom to specific octave
   */
  zoomTo(octave: AwarenessOctave): ZoomState {
    const previousOctave = this.zoomState.currentOctave;
    const transition = octave > previousOctave ? 'in' : octave < previousOctave ? 'out' : 'none';

    this.zoomState = {
      currentOctave: octave,
      zoomLevel: octave,
      previousOctave,
      transition
    };

    this.currentSurface = octave;
    this.updateSurfaceVisibility();

    return this.zoomState;
  }

  /**
   * Update surface visibility based on current zoom
   */
  private updateSurfaceVisibility(): void {
    this.surfaces.forEach((surface, octave) => {
      surface.visible = octave === this.currentSurface;
    });
  }

  /**
   * Expand symbol details
   */
  expandSymbol(symbolId: string): SymbolDetails | undefined {
    const symbol = this.symbols.get(symbolId);
    if (!symbol) {
      return undefined;
    }

    symbol.expanded = true;
    return symbol.details;
  }

  /**
   * Collapse symbol details
   */
  collapseSymbol(symbolId: string): void {
    const symbol = this.symbols.get(symbolId);
    if (symbol) {
      symbol.expanded = false;
    }
  }

  /**
   * Get current surface
   */
  getCurrentSurface(): CommunicationSurface | undefined {
    return this.surfaces.get(this.currentSurface);
  }

  /**
   * Get all surfaces
   */
  getAllSurfaces(): CommunicationSurface[] {
    return Array.from(this.surfaces.values());
  }

  /**
   * Get visible surfaces
   */
  getVisibleSurfaces(): CommunicationSurface[] {
    return Array.from(this.surfaces.values())
      .filter(surface => surface.visible);
  }

  /**
   * Get symbols for current surface
   */
  getCurrentSurfaceSymbols(): SymbolObject[] {
    const surface = this.getCurrentSurface();
    return surface?.symbols || [];
  }

  /**
   * Get symbol
   */
  getSymbol(symbolId: string): SymbolObject | undefined {
    return this.symbols.get(symbolId);
  }

  /**
   * Get zoom state
   */
  getZoomState(): ZoomState {
    return { ...this.zoomState };
  }
}




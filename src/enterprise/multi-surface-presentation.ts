/**
 * Multi-Surface Presentation System
 * Public-facing and internal surfaces as octaves
 */

import { AwarenessOctave } from '../types/index.js';

export interface Surface {
  octave: AwarenessOctave;
  name: string;
  type: 'public-facing' | 'internal';
  description: string;
  features: string[];
  demo: SurfaceDemo;
  accessible: boolean;
  requiresTier?: 'free' | 'premium' | 'pro';
}

export interface SurfaceDemo {
  id: string;
  title: string;
  description: string;
  interactive: boolean;
  content: string;
  duration: number; // seconds
}

export class MultiSurfacePresentationManager {
  private surfaces: Map<AwarenessOctave, Surface> = new Map();

  constructor() {
    this.initializeSurfaces();
  }

  /**
   * Initialize all surfaces
   */
  private initializeSurfaces(): void {
    // Public Facing Surfaces (Octaves 0-5)
    this.createSurface({
      octave: AwarenessOctave.SILENT,
      name: 'Silent Surface',
      type: 'public-facing',
      description: 'Foundation protocols and basic access',
      features: ['Foundation protocols', 'Basic protocol access', 'Public documentation'],
      demo: {
        id: 'demo-silent',
        title: 'Silent Surface Demo',
        description: 'Basic protocol demonstration',
        interactive: true,
        content: 'Demonstrating foundation protocols and basic access capabilities.',
        duration: 30
      },
      accessible: true,
      requiresTier: 'free'
    });

    this.createSurface({
      octave: AwarenessOctave.WHISPER,
      name: 'Whisper Surface',
      type: 'public-facing',
      description: 'Basic capabilities and enhanced access',
      features: ['Basic capabilities', 'Enhanced protocol access', 'Hero Host guidance'],
      demo: {
        id: 'demo-whisper',
        title: 'Whisper Surface Demo',
        description: 'Enhanced protocol demonstration',
        interactive: true,
        content: 'Demonstrating basic capabilities and enhanced protocol access.',
        duration: 30
      },
      accessible: true,
      requiresTier: 'free'
    });

    this.createSurface({
      octave: AwarenessOctave.HARMONY,
      name: 'Harmony Surface',
      type: 'public-facing',
      description: 'Integration protocols and multi-protocol access',
      features: ['Integration protocols', 'Multi-protocol access', 'Cross-domain synthesis'],
      demo: {
        id: 'demo-harmony',
        title: 'Harmony Surface Demo',
        description: 'Integration demonstration',
        interactive: true,
        content: 'Demonstrating integration protocols and multi-protocol access.',
        duration: 45
      },
      accessible: true,
      requiresTier: 'free'
    });

    this.createSurface({
      octave: AwarenessOctave.RESONANCE,
      name: 'Resonance Surface',
      type: 'public-facing',
      description: 'Advanced capabilities and full protocol access',
      features: ['Advanced capabilities', 'Full protocol access', 'FSR operations'],
      demo: {
        id: 'demo-resonance',
        title: 'Resonance Surface Demo',
        description: 'Advanced demonstration',
        interactive: true,
        content: 'Demonstrating advanced capabilities and full protocol access.',
        duration: 45
      },
      accessible: true,
      requiresTier: 'free'
    });

    this.createSurface({
      octave: AwarenessOctave.SYMPHONY,
      name: 'Symphony Surface',
      type: 'public-facing',
      description: 'Complex systems and enterprise protocol access',
      features: ['Complex systems', 'Enterprise protocol access', 'Team collaboration'],
      demo: {
        id: 'demo-symphony',
        title: 'Symphony Surface Demo',
        description: 'Enterprise demonstration',
        interactive: true,
        content: 'Demonstrating complex systems and enterprise protocol access.',
        duration: 60
      },
      accessible: true,
      requiresTier: 'free'
    });

    this.createSurface({
      octave: AwarenessOctave.TRANSCENDENCE,
      name: 'Transcendence Surface',
      type: 'public-facing',
      description: 'Complete architecture and full system access',
      features: ['Complete architecture', 'Full system access', 'Discovery acceleration'],
      demo: {
        id: 'demo-transcendence',
        title: 'Transcendence Surface Demo',
        description: 'Complete system demonstration',
        interactive: true,
        content: 'Demonstrating complete architecture and full system access.',
        duration: 60
      },
      accessible: true,
      requiresTier: 'free'
    });

    // Internal Surfaces (Octaves 6-7)
    this.createSurface({
      octave: AwarenessOctave.NEXT_OCTAVE,
      name: 'Next Octave Surface',
      type: 'internal',
      description: 'Next-octave capabilities and advanced features',
      features: [
        'Next-octave capabilities',
        'User Seed Wallet',
        'Life Insurance',
        'Funeral Expenses',
        'Advanced protocols'
      ],
      demo: {
        id: 'demo-next-octave',
        title: 'Next Octave Surface Demo',
        description: 'Next-octave demonstration',
        interactive: true,
        content: 'Demonstrating next-octave capabilities including User Seed Wallet, Life Insurance, and Funeral Expenses.',
        duration: 90
      },
      accessible: false,
      requiresTier: 'premium'
    });

    this.createSurface({
      octave: AwarenessOctave.BEYOND_OCTAVE,
      name: 'Beyond Octave Surface',
      type: 'internal',
      description: 'Beyond-octave capabilities and enterprise features',
      features: [
        'Beyond-octave capabilities',
        'Agentic Mirror CEO',
        'Custom protocols',
        'Enterprise features',
        'Shell access',
        'Full octave operation'
      ],
      demo: {
        id: 'demo-beyond-octave',
        title: 'Beyond Octave Surface Demo',
        description: 'Beyond-octave demonstration',
        interactive: true,
        content: 'Demonstrating beyond-octave capabilities including Agentic Mirror CEO, custom protocols, and full enterprise features.',
        duration: 120
      },
      accessible: false,
      requiresTier: 'pro'
    });
  }

  /**
   * Create surface
   */
  private createSurface(config: {
    octave: AwarenessOctave;
    name: string;
    type: Surface['type'];
    description: string;
    features: string[];
    demo: SurfaceDemo;
    accessible: boolean;
    requiresTier?: Surface['requiresTier'];
  }): void {
    const surface: Surface = {
      ...config
    };

    this.surfaces.set(config.octave, surface);
  }

  /**
   * Get surface by octave
   */
  getSurface(octave: AwarenessOctave): Surface | undefined {
    return this.surfaces.get(octave);
  }

  /**
   * Get all public-facing surfaces
   */
  getPublicFacingSurfaces(): Surface[] {
    return Array.from(this.surfaces.values())
      .filter(s => s.type === 'public-facing');
  }

  /**
   * Get all internal surfaces
   */
  getInternalSurfaces(): Surface[] {
    return Array.from(this.surfaces.values())
      .filter(s => s.type === 'internal');
  }

  /**
   * Get all surfaces
   */
  getAllSurfaces(): Surface[] {
    return Array.from(this.surfaces.values());
  }

  /**
   * Get surface demo
   */
  getSurfaceDemo(octave: AwarenessOctave): SurfaceDemo | undefined {
    const surface = this.surfaces.get(octave);
    return surface?.demo;
  }
}










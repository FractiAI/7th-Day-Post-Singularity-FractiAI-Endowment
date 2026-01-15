/**
 * Transmission Gears System
 * Selectable Awareness Octaves controlling FSR power, Hero Host guidance, and more
 */

import { AwarenessOctave, TransmissionGear, FSRPowerConfig, HeroHostConfig, GeyserConfig, EncryptionTier, ConnectivityConfig } from '../types/index.js';

export class TransmissionGearSelector {
  private currentGear: TransmissionGear;
  private gearPresets: Map<AwarenessOctave, TransmissionGear>;

  constructor() {
    this.gearPresets = this.initializeGearPresets();
    this.currentGear = this.gearPresets.get(AwarenessOctave.HARMONY)!;
  }

  /**
   * Initialize gear presets
   */
  private initializeGearPresets(): Map<AwarenessOctave, TransmissionGear> {
    const presets = new Map<AwarenessOctave, TransmissionGear>();

    // Silent (Octave 0)
    presets.set(AwarenessOctave.SILENT, {
      octave: AwarenessOctave.SILENT,
      name: 'Silent',
      fsrPower: {
        baseMultiplier: 0.1,
        domainConnectionStrength: 0.2,
        patternRecognitionSensitivity: 0.3,
        synthesisIntensity: 0.1
      },
      heroHost: {
        engagementLevel: 'passive',
        suggestionFrequency: 0.1,
        personaIntensity: 0.0,
        contextAwareness: 0.5
      },
      geysers: {
        frequency: 'off',
        intensity: 0.0,
        domainScope: 'single',
        visualization: 'minimal'
      },
      encryption: {
        unepOctave: 0,
        keyRotationFrequency: 3600,
        multiDeviceSupport: false,
        umbilicalSignatureRequired: false
      },
      connectivity: {
        syncFrequency: 0.1,
        bandwidth: 1,
        deviceLimit: 1,
        latencyTolerance: 1000
      }
    });

    // Whisper (Octave 1)
    presets.set(AwarenessOctave.WHISPER, {
      octave: AwarenessOctave.WHISPER,
      name: 'Whisper',
      fsrPower: {
        baseMultiplier: 0.3,
        domainConnectionStrength: 0.4,
        patternRecognitionSensitivity: 0.5,
        synthesisIntensity: 0.3
      },
      heroHost: {
        engagementLevel: 'subtle',
        suggestionFrequency: 0.5,
        personaIntensity: 0.2,
        contextAwareness: 0.6
      },
      geysers: {
        frequency: 'rare',
        intensity: 0.2,
        domainScope: 'dual',
        visualization: 'subtle'
      },
      encryption: {
        unepOctave: 1,
        keyRotationFrequency: 1800,
        multiDeviceSupport: false,
        umbilicalSignatureRequired: false
      },
      connectivity: {
        syncFrequency: 1,
        bandwidth: 10,
        deviceLimit: 2,
        latencyTolerance: 500
      }
    });

    // Harmony (Octave 2)
    presets.set(AwarenessOctave.HARMONY, {
      octave: AwarenessOctave.HARMONY,
      name: 'Harmony',
      fsrPower: {
        baseMultiplier: 0.6,
        domainConnectionStrength: 0.7,
        patternRecognitionSensitivity: 0.8,
        synthesisIntensity: 0.6
      },
      heroHost: {
        engagementLevel: 'guided',
        suggestionFrequency: 2.0,
        personaIntensity: 0.5,
        contextAwareness: 0.75
      },
      geysers: {
        frequency: 'occasional',
        intensity: 0.5,
        domainScope: 'multi',
        visualization: 'moderate'
      },
      encryption: {
        unepOctave: 2,
        keyRotationFrequency: 900,
        multiDeviceSupport: true,
        umbilicalSignatureRequired: false
      },
      connectivity: {
        syncFrequency: 10,
        bandwidth: 100,
        deviceLimit: 5,
        latencyTolerance: 200
      }
    });

    // Resonance (Octave 3)
    presets.set(AwarenessOctave.RESONANCE, {
      octave: AwarenessOctave.RESONANCE,
      name: 'Resonance',
      fsrPower: {
        baseMultiplier: 1.0,
        domainConnectionStrength: 0.9,
        patternRecognitionSensitivity: 1.0,
        synthesisIntensity: 0.9
      },
      heroHost: {
        engagementLevel: 'active',
        suggestionFrequency: 5.0,
        personaIntensity: 0.75,
        contextAwareness: 0.9
      },
      geysers: {
        frequency: 'regular',
        intensity: 0.8,
        domainScope: 'multi',
        visualization: 'vibrant'
      },
      encryption: {
        unepOctave: 3,
        keyRotationFrequency: 300,
        multiDeviceSupport: true,
        umbilicalSignatureRequired: true
      },
      connectivity: {
        syncFrequency: 50,
        bandwidth: 500,
        deviceLimit: 10,
        latencyTolerance: 100
      }
    });

    // Symphony (Octave 4)
    presets.set(AwarenessOctave.SYMPHONY, {
      octave: AwarenessOctave.SYMPHONY,
      name: 'Symphony',
      fsrPower: {
        baseMultiplier: 1.5,
        domainConnectionStrength: 1.0,
        patternRecognitionSensitivity: 1.0,
        synthesisIntensity: 1.0
      },
      heroHost: {
        engagementLevel: 'full',
        suggestionFrequency: 8.0,
        personaIntensity: 0.9,
        contextAwareness: 1.0
      },
      geysers: {
        frequency: 'frequent',
        intensity: 1.0,
        domainScope: 'omniversal',
        visualization: 'intense'
      },
      encryption: {
        unepOctave: 4,
        keyRotationFrequency: 120,
        multiDeviceSupport: true,
        umbilicalSignatureRequired: true
      },
      connectivity: {
        syncFrequency: 100,
        bandwidth: 1000,
        deviceLimit: 50,
        latencyTolerance: 50
      }
    });

    // Transcendence (Octave 5+)
    presets.set(AwarenessOctave.TRANSCENDENCE, {
      octave: AwarenessOctave.TRANSCENDENCE,
      name: 'Transcendence',
      fsrPower: {
        baseMultiplier: 2.0,
        domainConnectionStrength: 1.0,
        patternRecognitionSensitivity: 1.0,
        synthesisIntensity: 1.0
      },
      heroHost: {
        engagementLevel: 'deep',
        suggestionFrequency: 10.0,
        personaIntensity: 1.0,
        contextAwareness: 1.0
      },
      geysers: {
        frequency: 'continuous',
        intensity: 1.0,
        domainScope: 'omniversal',
        visualization: 'intense'
      },
      encryption: {
        unepOctave: 5,
        keyRotationFrequency: 60,
        multiDeviceSupport: true,
        umbilicalSignatureRequired: true
      },
      connectivity: {
        syncFrequency: 100,
        bandwidth: 1000,
        deviceLimit: 100,
        latencyTolerance: 10
      }
    });

    return presets;
  }

  /**
   * Select a transmission gear by octave
   */
  selectGear(octave: AwarenessOctave): TransmissionGear {
    const gear = this.gearPresets.get(octave);
    if (!gear) {
      throw new Error(`Invalid awareness octave: ${octave}`);
    }
    this.currentGear = gear;
    return gear;
  }

  /**
   * Get current gear
   */
  getCurrentGear(): TransmissionGear {
    return this.currentGear;
  }

  /**
   * Get all available gears
   */
  getAvailableGears(): TransmissionGear[] {
    return Array.from(this.gearPresets.values());
  }

  /**
   * Auto-adjust gear based on context
   */
  autoAdjust(context: {
    domainCount?: number;
    connectionComplexity?: number;
    userLevel?: 'beginner' | 'intermediate' | 'expert';
    missionType?: string;
    deviceCount?: number;
    networkQuality?: number;
  }): TransmissionGear {
    let score = 0;

    // Complexity analysis
    if (context.domainCount && context.domainCount > 5) score += 2;
    if (context.connectionComplexity && context.connectionComplexity > 0.7) score += 1;

    // User experience
    if (context.userLevel === 'expert') score += 1;
    if (context.missionType === 'meta-protocol') score += 2;

    // Resource availability
    if (context.deviceCount && context.deviceCount > 3) score += 1;
    if (context.networkQuality && context.networkQuality > 0.8) score += 1;

    // Clamp to valid range
    const octave = Math.min(Math.max(Math.floor(score), 0), 5) as AwarenessOctave;
    return this.selectGear(octave);
  }

  /**
   * Get retrieval configuration for current gear
   */
  getRetrievalConfig(): {
    topK: number;
    depth: number;
    domains: number | 'all';
    contextWindow: number;
    synthesisLevel: string;
  } {
    const octave = this.currentGear.octave;
    
    const configs: Record<AwarenessOctave, {
      topK: number;
      depth: number;
      domains: number | 'all';
      contextWindow: number;
      synthesisLevel: string;
    }> = {
      [AwarenessOctave.SILENT]: {
        topK: 3,
        depth: 1,
        domains: 1,
        contextWindow: 512,
        synthesisLevel: 'minimal'
      },
      [AwarenessOctave.WHISPER]: {
        topK: 5,
        depth: 2,
        domains: 2,
        contextWindow: 1024,
        synthesisLevel: 'basic'
      },
      [AwarenessOctave.HARMONY]: {
        topK: 10,
        depth: 3,
        domains: 3,
        contextWindow: 2048,
        synthesisLevel: 'moderate'
      },
      [AwarenessOctave.RESONANCE]: {
        topK: 20,
        depth: 4,
        domains: 5,
        contextWindow: 4096,
        synthesisLevel: 'high'
      },
      [AwarenessOctave.SYMPHONY]: {
        topK: 50,
        depth: 5,
        domains: 10,
        contextWindow: 8192,
        synthesisLevel: 'very-high'
      },
      [AwarenessOctave.TRANSCENDENCE]: {
        topK: 100,
        depth: 6,
        domains: 'all',
        contextWindow: 16384,
        synthesisLevel: 'maximum'
      }
    };

    return configs[octave];
  }
}



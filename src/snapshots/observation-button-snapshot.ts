/**
 * Observation Button Snapshot System
 * Higher-octave snapshot system for capturing observations as interactive buttons
 */

import {
  Protocol,
  ProtocolSnapshot,
  SnapshotContext,
  AgentIdentity,
  TransmissionGear,
  HeroHostPersona,
  Discovery,
  Observation
} from '../types/index.js';
import { ProtocolSnapshotManager } from '../protocols/protocol-snapshot.js';
import { CloudDeploymentProtocol, DeploymentButton } from '../protocols/cloud-deploy.js';
import { AwarenessOctave } from '../types/index.js';

export interface ObservationButtonSnapshot {
  id: string;
  snapshotId: string;
  observation: Observation;
  octave: AwarenessOctave;
  gear: TransmissionGear;
  heroHost?: HeroHostPersona;
  button: ObservationButton;
  protocolSnapshot?: ProtocolSnapshot;
  metadata: ObservationMetadata;
  timestamp: number;
}

export interface Observation {
  id: string;
  type: 'discovery' | 'pattern' | 'connection' | 'synthesis' | 'breakthrough' | 'custom';
  content: ObservationContent;
  context: ObservationContext;
  confidence: number;
  significance: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  timestamp: number;
}

export interface ObservationContent {
  title: string;
  description: string;
  data: Record<string, any>;
  patterns?: string[];
  connections?: Array<{ from: string; to: string; strength: number }>;
  insights?: string[];
}

export interface ObservationContext {
  missionId?: string;
  domain?: string;
  source?: string;
  gear?: TransmissionGear;
  heroHost?: HeroHostPersona;
  relatedObservations?: string[];
}

export interface ObservationMetadata {
  capturedBy: AgentIdentity;
  octave: AwarenessOctave;
  gear: TransmissionGear;
  heroHost?: HeroHostPersona;
  relatedSnapshots: string[];
  evolution: ObservationEvolution[];
}

export interface ObservationEvolution {
  step: number;
  from: Observation;
  to: Observation;
  transformation: string;
  timestamp: number;
}

export interface ObservationButton {
  id: string;
  type: 'observation-snapshot';
  label: string;
  observationId: string;
  octave: AwarenessOctave;
  buttonHtml: string;
  buttonMarkdown: string;
  interactive: boolean;
  action: ObservationButtonAction;
  metadata: Record<string, any>;
  createdAt: number;
}

export interface ObservationButtonAction {
  type: 'view' | 'reproduce' | 'evolve' | 'share' | 'deploy';
  endpoint: string;
  parameters?: Record<string, any>;
}

export class ObservationButtonSnapshotManager {
  private snapshotManager: ProtocolSnapshotManager;
  private deploymentProtocol: CloudDeploymentProtocol;
  private observations: Map<string, Observation>;
  private buttonSnapshots: Map<string, ObservationButtonSnapshot>;
  private evolutionHistory: Map<string, ObservationEvolution[]>;

  constructor(
    snapshotManager: ProtocolSnapshotManager,
    deploymentProtocol: CloudDeploymentProtocol
  ) {
    this.snapshotManager = snapshotManager;
    this.deploymentProtocol = deploymentProtocol;
    this.observations = new Map();
    this.buttonSnapshots = new Map();
    this.evolutionHistory = new Map();
  }

  /**
   * Capture observation as button snapshot
   */
  async captureObservationAsButton(
    observation: Observation,
    gear: TransmissionGear,
    heroHost?: HeroHostPersona,
    agentIdentity: AgentIdentity,
    options?: {
      createProtocol?: boolean;
      deploy?: boolean;
      octave?: AwarenessOctave;
    }
  ): Promise<ObservationButtonSnapshot> {
    const octave = options?.octave || gear.octave;
    const snapshotId = this.generateSnapshotId();

    // Enhance observation with octave-specific processing
    const enhancedObservation = await this.enhanceObservationForOctave(
      observation,
      octave,
      gear
    );

    // Create observation button
    const button = await this.createObservationButton(
      enhancedObservation,
      octave,
      gear,
      heroHost
    );

    // Create protocol snapshot if requested
    let protocolSnapshot: ProtocolSnapshot | undefined;
    if (options?.createProtocol) {
      protocolSnapshot = await this.createProtocolFromObservation(
        enhancedObservation,
        gear,
        heroHost,
        agentIdentity,
        options
      );
    }

    // Build button snapshot
    const buttonSnapshot: ObservationButtonSnapshot = {
      id: this.generateId(),
      snapshotId,
      observation: enhancedObservation,
      octave,
      gear,
      heroHost,
      button,
      protocolSnapshot,
      metadata: {
        capturedBy: agentIdentity,
        octave,
        gear,
        heroHost,
        relatedSnapshots: protocolSnapshot ? [protocolSnapshot.pob.id] : [],
        evolution: []
      },
      timestamp: Date.now()
    };

    // Store observation and snapshot
    this.observations.set(observation.id, enhancedObservation);
    this.buttonSnapshots.set(buttonSnapshot.id, buttonSnapshot);

    // Initialize evolution history
    this.evolutionHistory.set(observation.id, []);

    return buttonSnapshot;
  }

  /**
   * Enhance observation for specific octave
   */
  private async enhanceObservationForOctave(
    observation: Observation,
    octave: AwarenessOctave,
    gear: TransmissionGear
  ): Promise<Observation> {
    // Apply octave-specific enhancements
    const enhancement = this.getOctaveEnhancement(octave);

    // Enhance content
    const enhancedContent: ObservationContent = {
      ...observation.content,
      description: `${observation.content.description}\n\n[Enhanced at Octave ${octave}]`,
      data: {
        ...observation.content.data,
        octave,
        gearConfig: {
          fsrPower: gear.fsrPower.baseMultiplier,
          synthesisIntensity: gear.fsrPower.synthesisIntensity
        },
        enhancement
      }
    };

    // Enhance patterns if available
    if (observation.content.patterns) {
      enhancedContent.patterns = observation.content.patterns.map(pattern =>
        this.enhancePattern(pattern, octave)
      );
    }

    // Enhance connections
    if (observation.content.connections) {
      enhancedContent.connections = observation.content.connections.map(conn => ({
        ...conn,
        strength: conn.strength * (1 + enhancement.patternMultiplier)
      }));
    }

    // Enhance insights
    if (observation.content.insights) {
      enhancedContent.insights = [
        ...observation.content.insights,
        ...this.generateOctaveInsights(observation, octave)
      ];
    }

    return {
      ...observation,
      content: enhancedContent,
      confidence: Math.min(observation.confidence * (1 + enhancement.confidenceBoost), 1.0),
      context: {
        ...observation.context,
        gear,
        octave
      }
    };
  }

  /**
   * Get octave-specific enhancement
   */
  private getOctaveEnhancement(octave: AwarenessOctave): {
    patternMultiplier: number;
    confidenceBoost: number;
    depth: number;
  } {
    const enhancements: Record<AwarenessOctave, {
      patternMultiplier: number;
      confidenceBoost: number;
      depth: number;
    }> = {
      [AwarenessOctave.SILENT]: { patternMultiplier: 0.1, confidenceBoost: 0.0, depth: 1 },
      [AwarenessOctave.WHISPER]: { patternMultiplier: 0.3, confidenceBoost: 0.1, depth: 2 },
      [AwarenessOctave.HARMONY]: { patternMultiplier: 0.6, confidenceBoost: 0.2, depth: 3 },
      [AwarenessOctave.RESONANCE]: { patternMultiplier: 1.0, confidenceBoost: 0.3, depth: 4 },
      [AwarenessOctave.SYMPHONY]: { patternMultiplier: 1.5, confidenceBoost: 0.4, depth: 5 },
      [AwarenessOctave.TRANSCENDENCE]: { patternMultiplier: 2.0, confidenceBoost: 0.5, depth: 6 }
    };

    return enhancements[octave];
  }

  /**
   * Enhance pattern for octave
   */
  private enhancePattern(pattern: string, octave: AwarenessOctave): string {
    const depth = this.getOctaveEnhancement(octave).depth;
    return `[Octave ${octave}, Depth ${depth}] ${pattern}`;
  }

  /**
   * Generate octave-specific insights
   */
  private generateOctaveInsights(
    observation: Observation,
    octave: AwarenessOctave
  ): string[] {
    const insights: string[] = [];

    if (octave >= AwarenessOctave.RESONANCE) {
      insights.push(`High-octave observation (${octave}) reveals deeper patterns`);
    }

    if (octave >= AwarenessOctave.SYMPHONY) {
      insights.push('Cross-domain synthesis enabled at this octave');
    }

    if (octave === AwarenessOctave.TRANSCENDENCE) {
      insights.push('Transcendent observation - maximum awareness achieved');
    }

    return insights;
  }

  /**
   * Create observation button
   */
  private async createObservationButton(
    observation: Observation,
    octave: AwarenessOctave,
    gear: TransmissionGear,
    heroHost?: HeroHostPersona
  ): Promise<ObservationButton> {
    const buttonId = this.generateButtonId();
    const label = this.generateButtonLabel(observation, octave);

    // Generate button HTML
    const buttonHtml = this.generateButtonHTML(buttonId, observation, octave, label);

    // Generate button Markdown
    const buttonMarkdown = this.generateButtonMarkdown(buttonId, observation, octave, label);

    // Create action
    const action: ObservationButtonAction = {
      type: 'view',
      endpoint: `/api/observations/${observation.id}/snapshot/${buttonId}`,
      parameters: {
        octave,
        gear: gear.octave,
        heroHost: heroHost?.id
      }
    };

    return {
      id: buttonId,
      type: 'observation-snapshot',
      label,
      observationId: observation.id,
      octave,
      buttonHtml,
      buttonMarkdown,
      interactive: true,
      action,
      metadata: {
        observationType: observation.type,
        significance: observation.significance,
        confidence: observation.confidence,
        gear: gear.name,
        heroHost: heroHost?.name
      },
      createdAt: Date.now()
    };
  }

  /**
   * Generate button label
   */
  private generateButtonLabel(observation: Observation, octave: AwarenessOctave): string {
    const octaveLabel = AwarenessOctave[octave];
    const typeLabel = observation.type.charAt(0).toUpperCase() + observation.type.slice(1);
    return `📸 ${typeLabel} @ ${octaveLabel} (${observation.content.title})`;
  }

  /**
   * Generate button HTML
   */
  private generateButtonHTML(
    buttonId: string,
    observation: Observation,
    octave: AwarenessOctave,
    label: string
  ): string {
    const colors = this.getOctaveColors(octave);
    
    return `
      <button 
        id="${buttonId}"
        class="nspfrp-observation-button"
        data-observation-id="${observation.id}"
        data-octave="${octave}"
        data-significance="${observation.significance}"
        style="
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        "
        onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.15)'"
        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'"
        onclick="window.location.href='/api/observations/${observation.id}/snapshot/${buttonId}'">
        ${label}
      </button>
    `.trim();
  }

  /**
   * Generate button Markdown
   */
  private generateButtonMarkdown(
    buttonId: string,
    observation: Observation,
    octave: AwarenessOctave,
    label: string
  ): string {
    return `[${label}](/api/observations/${observation.id}/snapshot/${buttonId})`;
  }

  /**
   * Get octave colors
   */
  private getOctaveColors(octave: AwarenessOctave): { primary: string; secondary: string } {
    const colors: Record<AwarenessOctave, { primary: string; secondary: string }> = {
      [AwarenessOctave.SILENT]: { primary: '#6B7280', secondary: '#4B5563' },
      [AwarenessOctave.WHISPER]: { primary: '#10B981', secondary: '#059669' },
      [AwarenessOctave.HARMONY]: { primary: '#3B82F6', secondary: '#2563EB' },
      [AwarenessOctave.RESONANCE]: { primary: '#8B5CF6', secondary: '#7C3AED' },
      [AwarenessOctave.SYMPHONY]: { primary: '#F59E0B', secondary: '#D97706' },
      [AwarenessOctave.TRANSCENDENCE]: { primary: '#EF4444', secondary: '#DC2626' }
    };

    return colors[octave];
  }

  /**
   * Create protocol from observation
   */
  private async createProtocolFromObservation(
    observation: Observation,
    gear: TransmissionGear,
    heroHost: HeroHostPersona | undefined,
    agentIdentity: AgentIdentity,
    options?: {
      deploy?: boolean;
    }
  ): Promise<ProtocolSnapshot> {
    const protocol: Protocol = {
      id: `obs-protocol-${observation.id}`,
      name: `Observation Protocol: ${observation.content.title}`,
      version: '1.0.0',
      type: 'protocol',
      content: JSON.stringify({
        observation,
        gear,
        heroHost,
        metadata: {
          observationType: observation.type,
          significance: observation.significance,
          confidence: observation.confidence
        }
      }),
      structure: {
        sections: [],
        components: [],
        flows: []
      },
      metadata: {
        id: `obs-protocol-${observation.id}`,
        name: `Observation Protocol: ${observation.content.title}`,
        description: observation.content.description,
        author: agentIdentity.name,
        tags: ['observation', observation.type, ...observation.tags],
        category: 'observation',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return await this.snapshotManager.createSnapshot(
      protocol,
      {
        mission: {
          id: `obs-mission-${observation.id}`,
          name: `Observation: ${observation.content.title}`,
          type: 'observation',
          goal: 'Capture and protocolize observation',
          status: 'completed',
          steps: [],
          createdAt: Date.now()
        } as any,
        gear,
        heroHost,
        discoveries: [observation as any]
      },
      agentIdentity,
      {
        deploy: options?.deploy ? {
          platform: 'vercel',
          environment: 'production',
          config: {}
        } : undefined,
        createButton: true,
        includeIdentity: true
      }
    );
  }

  /**
   * Evolve observation to higher octave
   */
  async evolveObservation(
    observationId: string,
    targetOctave: AwarenessOctave,
    gear: TransmissionGear
  ): Promise<ObservationButtonSnapshot> {
    const original = this.observations.get(observationId);
    if (!original) {
      throw new Error(`Observation not found: ${observationId}`);
    }

    // Enhance to target octave
    const evolved = await this.enhanceObservationForOctave(
      original,
      targetOctave,
      gear
    );

    // Record evolution
    const evolution: ObservationEvolution = {
      step: (this.evolutionHistory.get(observationId)?.length || 0) + 1,
      from: original,
      to: evolved,
      transformation: `Evolved from Octave ${original.context.octave} to ${targetOctave}`,
      timestamp: Date.now()
    };

    const history = this.evolutionHistory.get(observationId) || [];
    history.push(evolution);
    this.evolutionHistory.set(observationId, history);

    // Update observation
    this.observations.set(observationId, evolved);

    // Create new button snapshot
    const buttonSnapshot = this.buttonSnapshots.get(
      Array.from(this.buttonSnapshots.values())
        .find(bs => bs.observation.id === observationId)?.id || ''
    );

    if (buttonSnapshot) {
      // Update existing snapshot
      const newButton = await this.createObservationButton(
        evolved,
        targetOctave,
        gear,
        buttonSnapshot.heroHost
      );

      buttonSnapshot.observation = evolved;
      buttonSnapshot.octave = targetOctave;
      buttonSnapshot.gear = gear;
      buttonSnapshot.button = newButton;
      buttonSnapshot.metadata.evolution.push(evolution);

      return buttonSnapshot;
    }

    throw new Error(`Button snapshot not found for observation: ${observationId}`);
  }

  /**
   * Get observation button snapshot
   */
  getButtonSnapshot(snapshotId: string): ObservationButtonSnapshot | undefined {
    return Array.from(this.buttonSnapshots.values())
      .find(bs => bs.snapshotId === snapshotId);
  }

  /**
   * Get all button snapshots for observation
   */
  getButtonSnapshotsForObservation(observationId: string): ObservationButtonSnapshot[] {
    return Array.from(this.buttonSnapshots.values())
      .filter(bs => bs.observation.id === observationId);
  }

  /**
   * List all button snapshots
   */
  listButtonSnapshots(): ObservationButtonSnapshot[] {
    return Array.from(this.buttonSnapshots.values());
  }

  /**
   * Get observation evolution history
   */
  getEvolutionHistory(observationId: string): ObservationEvolution[] {
    return this.evolutionHistory.get(observationId) || [];
  }

  /**
   * Generate IDs
   */
  private generateId(): string {
    return `OBS-BTN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateSnapshotId(): string {
    return `OBS-SNAP-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateButtonId(): string {
    return `OBS-BTN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}



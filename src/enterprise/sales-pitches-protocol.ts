/**
 * Sales Pitches Protocol
 * Enterprise major branch for interactive pitch delivery
 */

import {
  Protocol,
  ProtocolSnapshot,
  SnapshotContext,
  AgentIdentity,
  TransmissionGear
} from '../types/index.js';
import { GitSeedPitchUnpacker, GitSeedPitch } from './gitseed-pitch-unpacker.js';
import { ProtocolSnapshotManager } from '../protocols/protocol-snapshot.js';
import { CloudDeploymentProtocol } from '../protocols/cloud-deploy.js';
import { ObservationButtonSnapshotManager } from '../snapshots/observation-button-snapshot.js';
import { HeroHostOrchestrator } from '../core/hero-host.js';
import { TransmissionGearSelector } from '../core/transmission-gears.js';

export interface PitchSession {
  id: string;
  pitchId: string;
  clientId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  conversation: ConversationMessage[];
  buttonClicks: ButtonClick[];
  summaries: SessionSummary[];
  decisions: Decision[];
  observations: string[];
  startedAt: number;
  completedAt?: number;
}

export interface ConversationMessage {
  role: 'hero-host' | 'user' | 'system';
  content: string;
  timestamp: number;
  sectionId?: string;
}

export interface ButtonClick {
  buttonId: string;
  buttonLabel: string;
  action: string;
  response: string;
  timestamp: number;
}

export interface SessionSummary {
  id: string;
  content: string;
  timestamp: number;
  sections: string[];
}

export interface Decision {
  id: string;
  decision: string;
  context: string;
  timestamp: number;
}

export interface PitchProtocol {
  id: string;
  pitch: GitSeedPitch;
  protocol: Protocol;
  snapshot?: ProtocolSnapshot;
  sessions: PitchSession[];
  metrics: PitchMetrics;
  createdAt: number;
}

export interface PitchMetrics {
  totalSessions: number;
  completedSessions: number;
  averageSessionDuration: number;
  averageButtonClicks: number;
  conversionRate: number;
}

export class SalesPitchesProtocol {
  private pitchUnpacker: GitSeedPitchUnpacker;
  private snapshotManager: ProtocolSnapshotManager;
  private deploymentProtocol: CloudDeploymentProtocol;
  private observationSnapshots: ObservationButtonSnapshotManager;
  private pitchProtocols: Map<string, PitchProtocol>;
  private sessions: Map<string, PitchSession>;

  constructor(
    pitchUnpacker: GitSeedPitchUnpacker,
    snapshotManager: ProtocolSnapshotManager,
    deploymentProtocol: CloudDeploymentProtocol,
    observationSnapshots: ObservationButtonSnapshotManager
  ) {
    this.pitchUnpacker = pitchUnpacker;
    this.snapshotManager = snapshotManager;
    this.deploymentProtocol = deploymentProtocol;
    this.observationSnapshots = observationSnapshots;
    this.pitchProtocols = new Map();
    this.sessions = new Map();
  }

  /**
   * Create pitch protocol
   */
  async createPitchProtocol(
    pitch: GitSeedPitch,
    agentIdentity: AgentIdentity,
    options?: {
      createSnapshot?: boolean;
      deploy?: boolean;
    }
  ): Promise<PitchProtocol> {
    // Generate GitSeed prompt
    const promptText = this.pitchUnpacker.generateGitSeedPromptText(pitch);

    // Create initial protocol
    const protocol = await this.pitchUnpacker.createProtocolFromPitchSession(
      pitch,
      {
        conversation: [],
        buttonClicks: [],
        summaries: [],
        decisions: [],
        observations: []
      },
      agentIdentity
    );

    // Create snapshot if requested
    let snapshot: ProtocolSnapshot | undefined;
    if (options?.createSnapshot) {
      snapshot = await this.snapshotManager.createSnapshot(
        protocol,
        {
          mission: {
            id: `pitch-mission-${pitch.id}`,
            name: `Sales Pitch: ${pitch.pitchContent.title}`,
            type: 'sales-pitch',
            goal: 'Deliver interactive pitch via GitSeed',
            status: 'completed',
            steps: [],
            createdAt: Date.now()
          } as any,
          gear: this.pitchUnpacker['gearSelector'].getCurrentGear(),
          heroHost: this.pitchUnpacker['heroHost'].getCurrentPersona() || undefined
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

    const pitchProtocol: PitchProtocol = {
      id: `pitch-protocol-${pitch.id}`,
      pitch,
      protocol,
      snapshot,
      sessions: [],
      metrics: {
        totalSessions: 0,
        completedSessions: 0,
        averageSessionDuration: 0,
        averageButtonClicks: 0,
        conversionRate: 0
      },
      createdAt: Date.now()
    };

    this.pitchProtocols.set(pitchProtocol.id, pitchProtocol);
    return pitchProtocol;
  }

  /**
   * Start pitch session
   */
  async startPitchSession(
    pitchId: string,
    clientId: string
  ): Promise<{
    session: PitchSession;
    gitSeedPrompt: string;
  }> {
    const pitch = this.pitchUnpacker.getPitch(pitchId);
    if (!pitch) {
      throw new Error(`Pitch not found: ${pitchId}`);
    }

    // Generate GitSeed prompt
    const gitSeedPrompt = this.pitchUnpacker.generateGitSeedPromptText(pitch);

    // Create session
    const session: PitchSession = {
      id: this.generateSessionId(),
      pitchId,
      clientId,
      status: 'active',
      conversation: [],
      buttonClicks: [],
      summaries: [],
      decisions: [],
      observations: [],
      startedAt: Date.now()
    };

    this.sessions.set(session.id, session);

    // Add initial Hero Host message
    session.conversation.push({
      role: 'hero-host',
      content: `Hello! I'm ${pitch.heroHostPersona}, and I'll be your guide through this pitch. Let's begin by exploring the repository and understanding what we're working with.`,
      timestamp: Date.now()
    });

    // Update pitch protocol
    const pitchProtocol = Array.from(this.pitchProtocols.values())
      .find(pp => pp.pitch.id === pitchId);
    if (pitchProtocol) {
      pitchProtocol.sessions.push(session);
      pitchProtocol.metrics.totalSessions++;
    }

    return {
      session,
      gitSeedPrompt
    };
  }

  /**
   * Record conversation message
   */
  recordMessage(
    sessionId: string,
    role: ConversationMessage['role'],
    content: string,
    sectionId?: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.conversation.push({
      role,
      content,
      timestamp: Date.now(),
      sectionId
    });
  }

  /**
   * Record button click
   */
  recordButtonClick(
    sessionId: string,
    buttonId: string,
    buttonLabel: string,
    action: string,
    response: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.buttonClicks.push({
      buttonId,
      buttonLabel,
      action,
      response,
      timestamp: Date.now()
    });

    // Auto-capture observation if configured
    const pitch = this.pitchUnpacker.getPitch(session.pitchId);
    if (pitch) {
      // Create observation snapshot
      this.captureButtonClickObservation(session, buttonId, buttonLabel, response);
    }
  }

  /**
   * Capture button click as observation
   */
  private async captureButtonClickObservation(
    session: PitchSession,
    buttonId: string,
    buttonLabel: string,
    response: string
  ): Promise<void> {
    const observation = {
      id: `obs-${session.id}-${Date.now()}`,
      type: 'interaction' as const,
      content: {
        title: `Button Click: ${buttonLabel}`,
        description: `User clicked ${buttonLabel} button during pitch session`,
        data: {
          buttonId,
          buttonLabel,
          action: session.buttonClicks[session.buttonClicks.length - 1]?.action,
          response,
          sessionId: session.id
        },
        insights: [response]
      },
      context: {
        missionId: session.id,
        source: 'pitch-session'
      },
      confidence: 0.9,
      significance: 'medium' as const,
      tags: ['pitch', 'interaction', 'button-click'],
      timestamp: Date.now()
    };

    // Capture as observation button snapshot
    await this.observationSnapshots.captureObservationAsButton(
      observation,
      this.pitchUnpacker['gearSelector'].getCurrentGear(),
      this.pitchUnpacker['heroHost'].getCurrentPersona() || undefined,
      {
        id: 'pitch-system',
        type: 'fully-autonomous',
        name: 'Sales Pitches Protocol',
        capabilities: []
      },
      {
        createProtocol: false,
        octave: this.pitchUnpacker['gearSelector'].getCurrentGear().octave
      }
    );

    session.observations.push(observation.id);
  }

  /**
   * Generate summary
   */
  generateSummary(sessionId: string): SessionSummary {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const summary: SessionSummary = {
      id: `summary-${sessionId}-${Date.now()}`,
      content: this.buildSummaryContent(session),
      timestamp: Date.now(),
      sections: session.conversation
        .filter(m => m.sectionId)
        .map(m => m.sectionId!)
        .filter((v, i, a) => a.indexOf(v) === i)
    };

    session.summaries.push(summary);

    // Auto-capture summary observation
    this.captureSummaryObservation(session, summary);

    return summary;
  }

  /**
   * Build summary content
   */
  private buildSummaryContent(session: PitchSession): string {
    const lines: string[] = [];

    lines.push(`# Pitch Session Summary`);
    lines.push(`Session ID: ${session.id}`);
    lines.push(`Client ID: ${session.clientId}`);
    lines.push(`Duration: ${session.completedAt ? (session.completedAt - session.startedAt) / 1000 : 'Ongoing'} seconds`);
    lines.push('');

    lines.push('## Conversation Highlights');
    const heroHostMessages = session.conversation.filter(m => m.role === 'hero-host');
    heroHostMessages.slice(0, 5).forEach(msg => {
      lines.push(`- ${msg.content.substring(0, 100)}...`);
    });

    lines.push('');
    lines.push('## Button Interactions');
    session.buttonClicks.forEach(click => {
      lines.push(`- **${click.buttonLabel}**: ${click.response.substring(0, 80)}...`);
    });

    lines.push('');
    lines.push('## Decisions Made');
    session.decisions.forEach(decision => {
      lines.push(`- ${decision.decision}`);
    });

    return lines.join('\n');
  }

  /**
   * Capture summary observation
   */
  private async captureSummaryObservation(
    session: PitchSession,
    summary: SessionSummary
  ): Promise<void> {
    const observation = {
      id: `obs-summary-${session.id}`,
      type: 'summary' as const,
      content: {
        title: `Session Summary: ${session.id}`,
        description: summary.content,
        data: {
          sessionId: session.id,
          summaryId: summary.id,
          sections: summary.sections,
          buttonClicks: session.buttonClicks.length,
          decisions: session.decisions.length
        },
        insights: [summary.content]
      },
      context: {
        missionId: session.id,
        source: 'pitch-session-summary'
      },
      confidence: 0.95,
      significance: 'high' as const,
      tags: ['pitch', 'summary', 'session'],
      timestamp: Date.now()
    };

    await this.observationSnapshots.captureObservationAsButton(
      observation,
      this.pitchUnpacker['gearSelector'].getCurrentGear(),
      this.pitchUnpacker['heroHost'].getCurrentPersona() || undefined,
      {
        id: 'pitch-system',
        type: 'fully-autonomous',
        name: 'Sales Pitches Protocol',
        capabilities: []
      },
      {
        createProtocol: true,
        octave: this.pitchUnpacker['gearSelector'].getCurrentGear().octave
      }
    );

    session.observations.push(observation.id);
  }

  /**
   * Complete pitch session
   */
  async completePitchSession(
    sessionId: string,
    agentIdentity: AgentIdentity
  ): Promise<{
    session: PitchSession;
    protocol: Protocol;
    snapshot?: ProtocolSnapshot;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'completed';
    session.completedAt = Date.now();

    // Generate final summary
    const summary = this.generateSummary(sessionId);

    // Create protocol from session
    const pitch = this.pitchUnpacker.getPitch(session.pitchId);
    if (!pitch) {
      throw new Error(`Pitch not found: ${session.pitchId}`);
    }

    const protocol = await this.pitchUnpacker.createProtocolFromPitchSession(
      pitch,
      {
        conversation: session.conversation,
        buttonClicks: session.buttonClicks,
        summaries: session.summaries,
        decisions: session.decisions,
        observations: session.observations
      },
      agentIdentity
    );

    // Create snapshot
    const snapshot = await this.snapshotManager.createSnapshot(
      protocol,
      {
        mission: {
          id: session.id,
          name: `Completed Pitch Session: ${pitch.pitchContent.title}`,
          type: 'sales-pitch',
          goal: 'Interactive pitch delivery',
          status: 'completed',
          steps: [],
          createdAt: session.startedAt
        } as any,
        gear: this.pitchUnpacker['gearSelector'].getCurrentGear(),
        heroHost: this.pitchUnpacker['heroHost'].getCurrentPersona() || undefined,
        discoveries: session.observations.map(obsId => ({
          id: obsId,
          type: 'observation',
          content: {},
          timestamp: Date.now()
        })) as any[]
      },
      agentIdentity,
      {
        deploy: {
          platform: 'vercel',
          environment: 'production',
          config: {}
        },
        createButton: true,
        includeIdentity: true
      }
    );

    // Update pitch protocol metrics
    const pitchProtocol = Array.from(this.pitchProtocols.values())
      .find(pp => pp.pitch.id === session.pitchId);
    if (pitchProtocol) {
      pitchProtocol.metrics.completedSessions++;
      const duration = session.completedAt! - session.startedAt;
      pitchProtocol.metrics.averageSessionDuration =
        (pitchProtocol.metrics.averageSessionDuration * (pitchProtocol.metrics.completedSessions - 1) + duration) /
        pitchProtocol.metrics.completedSessions;
      pitchProtocol.metrics.averageButtonClicks =
        (pitchProtocol.metrics.averageButtonClicks * (pitchProtocol.metrics.completedSessions - 1) + session.buttonClicks.length) /
        pitchProtocol.metrics.completedSessions;
    }

    return {
      session,
      protocol,
      snapshot
    };
  }

  /**
   * Get pitch protocol
   */
  getPitchProtocol(protocolId: string): PitchProtocol | undefined {
    return this.pitchProtocols.get(protocolId);
  }

  /**
   * Get session
   */
  getSession(sessionId: string): PitchSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * List all pitch protocols
   */
  listPitchProtocols(): PitchProtocol[] {
    return Array.from(this.pitchProtocols.values());
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `SESSION-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}



/**
 * GitSeed Pitch Unpacker
 * Interactive pitch delivery system via GitSeed prompts
 */

import {
  Protocol,
  HeroHostPersona,
  TransmissionGear,
  AwarenessOctave,
  AgentIdentity
} from '../types/index.js';
import { HeroHostOrchestrator } from '../core/hero-host.js';
import { TransmissionGearSelector } from '../core/transmission-gears.js';
import { ObservationButtonSnapshotManager } from '../snapshots/observation-button-snapshot.js';

export interface GitSeedPitch {
  id: string;
  repositoryUrl: string;
  repositoryPath: string;
  pitchContent: PitchContent;
  heroHostPersona: string;
  transmissionGear: AwarenessOctave;
  buttonMenu: PitchButtonMenu;
  metadata: PitchMetadata;
  createdAt: number;
}

export interface PitchContent {
  title: string;
  overview: string;
  sections: PitchSection[];
  callToAction: string;
  repositoryReadme?: string;
  codeExamples?: string[];
}

export interface PitchSection {
  id: string;
  title: string;
  content: string;
  order: number;
  interactive?: boolean;
}

export interface PitchButtonMenu {
  id: string;
  buttons: PitchButton[];
  layout: 'horizontal' | 'vertical' | 'grid';
  style: 'minimal' | 'standard' | 'premium';
}

export interface PitchButton {
  id: string;
  label: string;
  action: PitchButtonAction;
  icon?: string;
  order: number;
  category?: string;
}

export interface PitchButtonAction {
  type: 'navigate' | 'summarize' | 'capture' | 'ask' | 'explore' | 'deploy' | 'custom';
  target?: string;
  prompt?: string;
  handler?: string;
}

export interface PitchMetadata {
  venueId?: string;
  clientId?: string;
  salesRep?: string;
  revenuePlan?: any;
  tags: string[];
}

export interface GitSeedPrompt {
  prompt: string;
  instructions: string[];
  heroHostConfig: HeroHostConfig;
  buttonMenuConfig: ButtonMenuConfig;
  captureConfig: CaptureConfig;
}

export interface HeroHostConfig {
  persona: string;
  engagementLevel: 'guided' | 'interactive' | 'autonomous';
  walkthroughMode: boolean;
  animationEnabled: boolean;
}

export interface ButtonMenuConfig {
  enabled: boolean;
  layout: string;
  style: string;
  buttons: Array<{
    id: string;
    label: string;
    action: string;
    prompt: string;
  }>;
}

export interface CaptureConfig {
  autoCapture: boolean;
  captureOnButtonClick: boolean;
  captureOnSummary: boolean;
  includeConversation: boolean;
  includeDecisions: boolean;
}

export class GitSeedPitchUnpacker {
  private heroHost: HeroHostOrchestrator;
  private gearSelector: TransmissionGearSelector;
  private observationSnapshots: ObservationButtonSnapshotManager;
  private pitches: Map<string, GitSeedPitch>;

  constructor(
    heroHost: HeroHostOrchestrator,
    gearSelector: TransmissionGearSelector,
    observationSnapshots: ObservationButtonSnapshotManager
  ) {
    this.heroHost = heroHost;
    this.gearSelector = gearSelector;
    this.observationSnapshots = observationSnapshots;
    this.pitches = new Map();
  }

  /**
   * Create GitSeed pitch
   */
  async createGitSeedPitch(
    repositoryUrl: string,
    repositoryPath: string,
    pitchContent: PitchContent,
    heroHostPersona: string,
    transmissionGear: AwarenessOctave,
    metadata: PitchMetadata
  ): Promise<GitSeedPitch> {
    // Generate button menu
    const buttonMenu = this.generateButtonMenu(pitchContent);

    const pitch: GitSeedPitch = {
      id: this.generatePitchId(),
      repositoryUrl,
      repositoryPath,
      pitchContent,
      heroHostPersona,
      transmissionGear,
      buttonMenu,
      metadata,
      createdAt: Date.now()
    };

    this.pitches.set(pitch.id, pitch);
    return pitch;
  }

  /**
   * Generate GitSeed prompt for pitch
   */
  generateGitSeedPrompt(pitch: GitSeedPitch): GitSeedPrompt {
    const prompt = this.buildPrompt(pitch);
    const instructions = this.buildInstructions(pitch);
    const heroHostConfig = this.buildHeroHostConfig(pitch);
    const buttonMenuConfig = this.buildButtonMenuConfig(pitch);
    const captureConfig = this.buildCaptureConfig();

    return {
      prompt,
      instructions,
      heroHostConfig,
      buttonMenuConfig,
      captureConfig
    };
  }

  /**
   * Build main prompt
   */
  private buildPrompt(pitch: GitSeedPitch): string {
    return `# GitSeed Pitch Unpacker - Interactive Hero Host Session

## Repository to Read
${pitch.repositoryUrl}
${pitch.repositoryPath}

## Pitch Overview
**Title:** ${pitch.pitchContent.title}

${pitch.pitchContent.overview}

## Your Role
You are now an interactive Hero Host AI assistant (${pitch.heroHostPersona}) guiding the user through this pitch. 

## Instructions
1. Read and analyze the target repository: ${pitch.repositoryUrl}
2. Understand the pitch content and structure
3. Animate your AI session with Hero Host persona: ${pitch.heroHostPersona}
4. Walk the user through the pitch interactively
5. Use the guided prompt button menu for interactions
6. Summarize and capture all interactions

## Transmission Gear
Current Awareness Octave: ${pitch.transmissionGear} (${AwarenessOctave[pitch.transmissionGear]})

## Pitch Sections
${pitch.pitchContent.sections.map((s, i) => `${i + 1}. ${s.title}\n   ${s.content}`).join('\n\n')}

## Call to Action
${pitch.pitchContent.callToAction}

## Interactive Button Menu
The user can interact with you using these buttons:
${pitch.buttonMenu.buttons.map(b => `- [${b.label}](${b.action.handler || '#'}) - ${b.action.type}`).join('\n')}

Begin by reading the repository and then introduce yourself as ${pitch.heroHostPersona}, ready to guide them through this pitch interactively.`;
  }

  /**
   * Build instructions
   */
  private buildInstructions(pitch: GitSeedPitch): string[] {
    return [
      `Read the repository at ${pitch.repositoryUrl} and understand its structure, code, and documentation`,
      `Activate Hero Host persona: ${pitch.heroHostPersona} with interactive, animated guidance`,
      `Walk through each pitch section (${pitch.pitchContent.sections.length} sections) interactively`,
      `Use the button menu to guide user interactions and capture responses`,
      `Summarize the pitch session and capture all key points and decisions`,
      `Create observation snapshots for important moments in the conversation`,
      `Generate a protocol snapshot at the end capturing the entire pitch session`
    ];
  }

  /**
   * Build Hero Host config
   */
  private buildHeroHostConfig(pitch: GitSeedPitch): HeroHostConfig {
    return {
      persona: pitch.heroHostPersona,
      engagementLevel: 'interactive',
      walkthroughMode: true,
      animationEnabled: true
    };
  }

  /**
   * Build button menu config
   */
  private buildButtonMenuConfig(pitch: GitSeedPitch): ButtonMenuConfig {
    return {
      enabled: true,
      layout: pitch.buttonMenu.layout,
      style: pitch.buttonMenu.style,
      buttons: pitch.buttonMenu.buttons.map(b => ({
        id: b.id,
        label: b.label,
        action: b.action.type,
        prompt: b.action.prompt || this.getDefaultPromptForAction(b.action.type)
      }))
    };
  }

  /**
   * Get default prompt for action
   */
  private getDefaultPromptForAction(action: string): string {
    const prompts: Record<string, string> = {
      'navigate': 'Navigate to the next section of the pitch',
      'summarize': 'Summarize what we\'ve discussed so far',
      'capture': 'Capture this moment as an observation snapshot',
      'ask': 'Ask a question about this section',
      'explore': 'Explore the repository code in more detail',
      'deploy': 'Show deployment options and next steps',
      'custom': 'Custom interaction'
    };
    return prompts[action] || 'Continue the conversation';
  }

  /**
   * Build capture config
   */
  private buildCaptureConfig(): CaptureConfig {
    return {
      autoCapture: true,
      captureOnButtonClick: true,
      captureOnSummary: true,
      includeConversation: true,
      includeDecisions: true
    };
  }

  /**
   * Generate button menu
   */
  private generateButtonMenu(pitch: PitchContent): PitchButtonMenu {
    const buttons: PitchButton[] = [];

    // Navigation buttons
    buttons.push({
      id: 'nav-next',
      label: '➡️ Next Section',
      action: {
        type: 'navigate',
        target: 'next',
        prompt: 'Navigate to the next section of the pitch'
      },
      icon: '➡️',
      order: 1,
      category: 'navigation'
    });

    buttons.push({
      id: 'nav-prev',
      label: '⬅️ Previous Section',
      action: {
        type: 'navigate',
        target: 'prev',
        prompt: 'Navigate to the previous section'
      },
      icon: '⬅️',
      order: 2,
      category: 'navigation'
    });

    // Interaction buttons
    buttons.push({
      id: 'summarize',
      label: '📝 Summarize',
      action: {
        type: 'summarize',
        prompt: 'Summarize what we\'ve discussed in this pitch session'
      },
      icon: '📝',
      order: 3,
      category: 'interaction'
    });

    buttons.push({
      id: 'capture',
      label: '📸 Capture Moment',
      action: {
        type: 'capture',
        prompt: 'Capture this moment as an observation snapshot'
      },
      icon: '📸',
      order: 4,
      category: 'interaction'
    });

    buttons.push({
      id: 'ask',
      label: '❓ Ask Question',
      action: {
        type: 'ask',
        prompt: 'Ask a question about the current section or repository'
      },
      icon: '❓',
      order: 5,
      category: 'interaction'
    });

    buttons.push({
      id: 'explore',
      label: '🔍 Explore Repository',
      action: {
        type: 'explore',
        prompt: 'Explore the repository code, structure, and documentation in detail'
      },
      icon: '🔍',
      order: 6,
      category: 'interaction'
    });

    // Action buttons
    buttons.push({
      id: 'deploy',
      label: '🚀 Deploy Options',
      action: {
        type: 'deploy',
        prompt: 'Show deployment options and next steps'
      },
      icon: '🚀',
      order: 7,
      category: 'action'
    });

    buttons.push({
      id: 'complete',
      label: '✅ Complete Pitch',
      action: {
        type: 'custom',
        handler: 'completePitch',
        prompt: 'Complete the pitch session and generate final summary'
      },
      icon: '✅',
      order: 8,
      category: 'action'
    });

    return {
      id: `menu-${Date.now()}`,
      buttons: buttons.sort((a, b) => a.order - b.order),
      layout: 'grid',
      style: 'premium'
    };
  }

  /**
   * Generate complete GitSeed prompt text
   */
  generateGitSeedPromptText(pitch: GitSeedPitch): string {
    const config = this.generateGitSeedPrompt(pitch);
    
    return `# GitSeed Pitch Unpacker Prompt

Copy and paste this entire prompt into your AI of choice to begin an interactive Hero Host-guided pitch session.

---

${config.prompt}

---

## Detailed Instructions

${config.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

## Hero Host Configuration

- **Persona:** ${config.heroHostConfig.persona}
- **Engagement Level:** ${config.heroHostConfig.engagementLevel}
- **Walkthrough Mode:** ${config.heroHostConfig.walkthroughMode ? 'Enabled' : 'Disabled'}
- **Animation:** ${config.heroHostConfig.animationEnabled ? 'Enabled' : 'Disabled'}

## Interactive Button Menu

When the user clicks a button, respond accordingly:

${config.buttonMenuConfig.buttons.map(b => `
### ${b.label}
**Action:** ${b.action}
**Prompt:** ${b.prompt}
`).join('\n')}

## Capture Configuration

- **Auto Capture:** ${config.captureConfig.autoCapture ? 'Enabled' : 'Disabled'}
- **Capture on Button Click:** ${config.captureConfig.captureOnButtonClick ? 'Enabled' : 'Disabled'}
- **Capture on Summary:** ${config.captureConfig.captureOnSummary ? 'Enabled' : 'Disabled'}
- **Include Conversation:** ${config.captureConfig.includeConversation ? 'Yes' : 'No'}
- **Include Decisions:** ${config.captureConfig.includeDecisions ? 'Yes' : 'No'}

---

**Start the session by reading the repository and introducing yourself as ${pitch.heroHostPersona}.**`;
  }

  /**
   * Create protocol from pitch session
   */
  async createProtocolFromPitchSession(
    pitch: GitSeedPitch,
    sessionData: {
      conversation: Array<{ role: string; content: string; timestamp: number }>;
      buttonClicks: Array<{ buttonId: string; timestamp: number }>;
      summaries: string[];
      decisions: Array<{ decision: string; timestamp: number }>;
      observations: string[];
    },
    agentIdentity: AgentIdentity
  ): Promise<Protocol> {
    const protocol: Protocol = {
      id: `pitch-protocol-${pitch.id}`,
      name: `Sales Pitch Protocol: ${pitch.pitchContent.title}`,
      version: '1.0.0',
      type: 'protocol',
      content: JSON.stringify({
        pitch,
        sessionData,
        heroHost: pitch.heroHostPersona,
        gear: pitch.transmissionGear
      }),
      structure: {
        sections: pitch.pitchContent.sections.map(s => ({
          id: s.id,
          title: s.title,
          content: s.content,
          order: s.order
        })),
        components: [],
        flows: []
      },
      metadata: {
        id: `pitch-protocol-${pitch.id}`,
        name: `Sales Pitch Protocol: ${pitch.pitchContent.title}`,
        description: `Interactive pitch protocol for ${pitch.pitchContent.title}`,
        author: agentIdentity.name,
        tags: ['sales-pitch', 'gitseed', 'interactive', ...pitch.metadata.tags],
        category: 'enterprise-sales',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return protocol;
  }

  /**
   * Get pitch by ID
   */
  getPitch(pitchId: string): GitSeedPitch | undefined {
    return this.pitches.get(pitchId);
  }

  /**
   * List all pitches
   */
  listPitches(): GitSeedPitch[] {
    return Array.from(this.pitches.values());
  }

  /**
   * Generate pitch ID
   */
  private generatePitchId(): string {
    return `PITCH-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}



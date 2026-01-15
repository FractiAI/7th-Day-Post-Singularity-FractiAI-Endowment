/**
 * Layer Button Protocol
 * Buttons for layering Vibeverse OS onto targets
 */

import {
  VibeverseOSLayer,
  LayerTarget,
  PreservationConfig,
  TransformationConfig
} from './vibeverse-os-layer.js';
import { VibeverseOSLayerSystem } from './vibeverse-os-layer.js';
import { AgentIdentity } from '../types/index.js';

export interface LayerButton {
  id: string;
  type: 'layer-os' | 'layer-awareness' | 'layer-generative' | 'layer-holographic' | 'layer-hhsc';
  label: string;
  target: LayerTarget;
  preservation: PreservationConfig;
  transformation: TransformationConfig;
  buttonHtml: string;
  buttonMarkdown: string;
  status: 'pending' | 'ready' | 'layering' | 'completed' | 'failed';
  createdAt: number;
}

export interface LayerButtonConfig {
  target: LayerTarget;
  preservation?: Partial<PreservationConfig>;
  transformation?: Partial<TransformationConfig>;
  autoLayer?: boolean;
}

export class LayerButtonProtocol {
  private layerSystem: VibeverseOSLayerSystem;
  private buttons: Map<string, LayerButton>;

  constructor(layerSystem: VibeverseOSLayerSystem) {
    this.layerSystem = layerSystem;
    this.buttons = new Map();
  }

  /**
   * Create layer button
   */
  async createLayerButton(
    config: LayerButtonConfig,
    agentIdentity: AgentIdentity
  ): Promise<LayerButton> {
    const buttonId = this.generateButtonId();

    // Default preservation config
    const preservation: PreservationConfig = {
      preserveExisting: true,
      preserveData: true,
      preserveFunctionality: true,
      preserveIdentity: true,
      backupBeforeLayer: true,
      ...config.preservation
    };

    // Default transformation config
    const transformation: TransformationConfig = {
      enableGenerativeAwareness: true,
      enableHolographicRendering: true,
      enableHydrogenSpinCloud: true,
      enablePostSingularityFeatures: true,
      octaveUpgrade: 4, // SYMPHONY
      ...config.transformation
    };

    // Determine button type
    const buttonType = this.determineButtonType(config.target, transformation);

    // Generate button
    const button: LayerButton = {
      id: buttonId,
      type: buttonType,
      label: this.generateButtonLabel(config.target, transformation),
      target: config.target,
      preservation,
      transformation,
      buttonHtml: this.generateButtonHTML(buttonId, config.target, transformation),
      buttonMarkdown: this.generateButtonMarkdown(buttonId, config.target, transformation),
      status: 'ready',
      createdAt: Date.now()
    };

    this.buttons.set(buttonId, button);

    // Auto-layer if requested
    if (config.autoLayer) {
      await this.executeLayer(button, agentIdentity);
    }

    return button;
  }

  /**
   * Execute layer from button
   */
  async executeLayer(
    button: LayerButton,
    agentIdentity: AgentIdentity
  ): Promise<VibeverseOSLayer> {
    button.status = 'layering';

    try {
      const layer = await this.layerSystem.layerVibeverseOS(
        button.target,
        button.preservation,
        button.transformation,
        agentIdentity
      );

      button.status = 'completed';
      return layer;
    } catch (error) {
      button.status = 'failed';
      throw error;
    }
  }

  /**
   * Determine button type
   */
  private determineButtonType(
    target: LayerTarget,
    transformation: TransformationConfig
  ): LayerButton['type'] {
    if (transformation.enableHydrogenSpinCloud) {
      return 'layer-hhsc';
    }
    if (transformation.enableHolographicRendering) {
      return 'layer-holographic';
    }
    if (transformation.enableGenerativeAwareness) {
      return 'layer-generative';
    }
    if (transformation.enablePostSingularityFeatures) {
      return 'layer-awareness';
    }
    return 'layer-os';
  }

  /**
   * Generate button label
   */
  private generateButtonLabel(
    target: LayerTarget,
    transformation: TransformationConfig
  ): string {
    const features: string[] = [];
    
    if (transformation.enableGenerativeAwareness) {
      features.push('Generative Awareness');
    }
    if (transformation.enableHolographicRendering) {
      features.push('Holographic');
    }
    if (transformation.enableHydrogenSpinCloud) {
      features.push('HHSC');
    }
    if (transformation.enablePostSingularityFeatures) {
      features.push('Post Singularity');
    }

    const featureText = features.length > 0 ? ` (${features.join(', ')})` : '';
    return `🌌 Layer Vibeverse OS${featureText}: ${target.type}`;
  }

  /**
   * Generate button HTML
   */
  private generateButtonHTML(
    buttonId: string,
    target: LayerTarget,
    transformation: TransformationConfig
  ): string {
    const label = this.generateButtonLabel(target, transformation);
    
    return `
      <button 
        id="${buttonId}"
        class="vibeverse-layer-button"
        data-target-type="${target.type}"
        data-target-id="${target.identifier}"
        style="
          display: inline-block;
          padding: 16px 32px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        "
        onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 24px rgba(99, 102, 241, 0.6)'"
        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.4)'"
        onclick="window.location.href='/api/vibeverse/layer/${buttonId}'">
        ${label}
      </button>
    `.trim();
  }

  /**
   * Generate button Markdown
   */
  private generateButtonMarkdown(
    buttonId: string,
    target: LayerTarget,
    transformation: TransformationConfig
  ): string {
    const label = this.generateButtonLabel(target, transformation);
    return `[${label}](/api/vibeverse/layer/${buttonId})`;
  }

  /**
   * Create "Layer Everything" button
   */
  async createLayerEverythingButton(
    transformation: TransformationConfig,
    agentIdentity: AgentIdentity
  ): Promise<LayerButton> {
    return this.createLayerButton(
      {
        target: {
          type: 'everything',
          identifier: 'global',
          scope: 'global'
        },
        transformation,
        autoLayer: false
      },
      agentIdentity
    );
  }

  /**
   * Get button
   */
  getButton(buttonId: string): LayerButton | undefined {
    return this.buttons.get(buttonId);
  }

  /**
   * List all buttons
   */
  listButtons(): LayerButton[] {
    return Array.from(this.buttons.values());
  }

  /**
   * Generate button ID
   */
  private generateButtonId(): string {
    return `LAYER-BTN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}



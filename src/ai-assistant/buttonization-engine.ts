/**
 * UNIVERSAL BUTTONIZATION ENGINE
 * Turn ANYTHING into EVERYTHING with one click
 * Firmware, Franchise, Series, Magazine, Marketplace, School, Ecosystem, etc.
 */

import { routeWithTags } from '../bbhe/grammar-tag-system.js';
import { vibeBlock } from '../blockchain/block-button-api.js';

export type TransformationFormat =
  | 'firmware'
  | 'franchise'
  | 'series'
  | 'magazine'
  | 'marketplace'
  | 'school'
  | 'ecosystem'
  | 'vchip'
  | 'adventure'
  | 'nft'
  | 'token'
  | 'property'
  | 'api'
  | 'book'
  | 'video'
  | 'soundtrack';

export type ButtonCategory =
  | 'ownership'
  | 'content'
  | 'business'
  | 'technical'
  | 'social'
  | 'monetization'
  | 'expansion';

export interface QuickButton {
  id: string;
  label: string;
  icon: string;
  category: ButtonCategory;
  
  action: {
    type: 'transform' | 'deploy' | 'create' | 'publish';
    target: string;
    params?: any;
  };
  
  transformsTo: {
    format: TransformationFormat;
    template: string;
    autoGenerate: boolean;
  };
  
  requirements?: {
    octaveLevel?: number;
    permissions?: string[];
    resources?: string[];
  };
  
  bbheTags: string[];
}

export interface TransformationResult {
  success: boolean;
  format: TransformationFormat;
  outputId: string;
  outputs: {
    primary: any;
    supporting?: any[];
  };
  metadata: {
    transformedAt: Date;
    fromConcept: string;
    templateUsed: string;
  };
  nextActions?: string[];
}

export class ButtonizationEngine {
  private buttons: Map<string, QuickButton>;
  private templates: Map<TransformationFormat, any>;
  private transformations: Map<string, TransformationResult>;
  
  constructor() {
    this.buttons = new Map();
    this.templates = new Map();
    this.transformations = new Map();
    
    this.initializeButtons();
    this.initializeTemplates();
  }
  
  /**
   * Initialize all quick buttons
   */
  private initializeButtons(): void {
    const buttons: QuickButton[] = [
      // OWNERSHIP BUTTONS
      {
        id: 'btn-burn-firmware',
        label: 'Burn to Firmware',
        icon: '🔥',
        category: 'ownership',
        action: { type: 'transform', target: 'immutable-protocol' },
        transformsTo: {
          format: 'firmware',
          template: 'base-protocol-template',
          autoGenerate: true
        },
        requirements: {
          octaveLevel: 40,
          permissions: ['protocol.modify', 'firmware.write']
        },
        bbheTags: [
          '#CORE:PROTOCOL:FIRMWARE:IMMUTABLE',
          '#OWNERSHIP:PERMANENT:LOCK:FOUNDATION'
        ]
      },
      
      {
        id: 'btn-franchise',
        label: 'Franchise It',
        icon: '🏢',
        category: 'business',
        action: { type: 'create', target: 'franchise-opportunity' },
        transformsTo: {
          format: 'franchise',
          template: 'franchise-package-template',
          autoGenerate: true
        },
        requirements: {
          octaveLevel: 21,
          permissions: ['franchise.create']
        },
        bbheTags: [
          '#BUSINESS:FRANCHISE:CREATE:OPPORTUNITY',
          '#MONETIZATION:LICENSE:TERRITORY:RIGHTS'
        ]
      },
      
      {
        id: 'btn-mint-nft',
        label: 'Mint as NFT',
        icon: '💎',
        category: 'monetization',
        action: { type: 'create', target: 'nft-collection' },
        transformsTo: {
          format: 'nft',
          template: 'nft-collection-template',
          autoGenerate: true
        },
        bbheTags: [
          '#MONETIZATION:NFT:MINT:COLLECTION',
          '#OWNERSHIP:BLOCKCHAIN:TRADEABLE:ASSET'
        ]
      },
      
      // CONTENT BUTTONS
      {
        id: 'btn-create-series',
        label: 'Turn into Series',
        icon: '📺',
        category: 'content',
        action: { type: 'create', target: 'episodic-content' },
        transformsTo: {
          format: 'series',
          template: 'episode-series-template',
          autoGenerate: true
        },
        bbheTags: [
          '#EXPERIENCES:CONTENT:SERIES:EPISODES',
          '#STREAMING:EPISODIC:SEASON:STRUCTURE'
        ]
      },
      
      {
        id: 'btn-create-magazine',
        label: 'Create Magazine',
        icon: '📰',
        category: 'content',
        action: { type: 'create', target: 'publication' },
        transformsTo: {
          format: 'magazine',
          template: 'magazine-format-template',
          autoGenerate: true
        },
        bbheTags: [
          '#EXPERIENCES:CONTENT:MAGAZINE:PUBLICATION',
          '#STREAMING:PERIODIC:ISSUE:DISTRIBUTION'
        ]
      },
      
      {
        id: 'btn-build-adventure',
        label: 'Build Adventure',
        icon: '🎮',
        category: 'content',
        action: { type: 'create', target: 'interactive-experience' },
        transformsTo: {
          format: 'adventure',
          template: 'adventure-module-template',
          autoGenerate: true
        },
        bbheTags: [
          '#EXPERIENCES:ADVENTURE:INTERACTIVE:MODULE',
          '#STREAMING:GAMEPLAY:EXPERIENCE:PLAYABLE'
        ]
      },
      
      // BUSINESS BUTTONS
      {
        id: 'btn-launch-marketplace',
        label: 'Launch Marketplace',
        icon: '🏪',
        category: 'business',
        action: { type: 'deploy', target: 'trading-platform' },
        transformsTo: {
          format: 'marketplace',
          template: 'marketplace-platform-template',
          autoGenerate: true
        },
        bbheTags: [
          '#BUSINESS:MARKETPLACE:LAUNCH:PLATFORM',
          '#MONETIZATION:TRADING:COMMERCE:ECOSYSTEM'
        ]
      },
      
      {
        id: 'btn-start-school',
        label: 'Start School',
        icon: '🎓',
        category: 'business',
        action: { type: 'create', target: 'educational-system' },
        transformsTo: {
          format: 'school',
          template: 'university-system-template',
          autoGenerate: true
        },
        bbheTags: [
          '#BUSINESS:SCHOOL:CREATE:EDUCATION',
          '#EXPERIENCES:LEARNING:COURSES:CERTIFICATION'
        ]
      },
      
      {
        id: 'btn-build-ecosystem',
        label: 'Build Ecosystem',
        icon: '🌳',
        category: 'business',
        action: { type: 'create', target: 'interconnected-system' },
        transformsTo: {
          format: 'ecosystem',
          template: 'ecosystem-network-template',
          autoGenerate: true
        },
        bbheTags: [
          '#BUSINESS:ECOSYSTEM:BUILD:NETWORK',
          '#INFRASTRUCTURE:INTERCONNECTED:SELF_SUSTAINING:ECONOMY'
        ]
      },
      
      // TECHNICAL BUTTONS
      {
        id: 'btn-deploy-vchip',
        label: 'Deploy as vCHIP',
        icon: '🚀',
        category: 'technical',
        action: { type: 'deploy', target: 'virtual-chip' },
        transformsTo: {
          format: 'vchip',
          template: 'vchip-deployment-template',
          autoGenerate: true
        },
        requirements: {
          octaveLevel: 10
        },
        bbheTags: [
          '#INFRASTRUCTURE:VCHIP:DEPLOY:EDGE',
          '#NODES:DEPLOYMENT:DISTRIBUTED:CAPABILITY'
        ]
      },
      
      {
        id: 'btn-generate-api',
        label: 'Generate API',
        icon: '🔧',
        category: 'technical',
        action: { type: 'create', target: 'api-interface' },
        transformsTo: {
          format: 'api',
          template: 'rest-api-template',
          autoGenerate: true
        },
        bbheTags: [
          '#ENGINEER:IMPLEMENTATION:API:GENERATE',
          '#INFRASTRUCTURE:INTERFACE:PROGRAMMATIC:ENDPOINTS'
        ]
      },
      
      // MONETIZATION BUTTONS
      {
        id: 'btn-create-token',
        label: 'Create Token',
        icon: '💰',
        category: 'monetization',
        action: { type: 'create', target: 'utility-token' },
        transformsTo: {
          format: 'token',
          template: 'token-economics-template',
          autoGenerate: true
        },
        bbheTags: [
          '#MONETIZATION:TOKEN:CREATE:UTILITY',
          '#NODES:VIBECHAIN:TOKEN:ECONOMY'
        ]
      },
      
      {
        id: 'btn-sell-property',
        label: 'Sell as Property',
        icon: '🏘️',
        category: 'monetization',
        action: { type: 'create', target: 'property-listing' },
        transformsTo: {
          format: 'property',
          template: 'real-estate-listing-template',
          autoGenerate: true
        },
        bbheTags: [
          '#MONETIZATION:PROPERTY:SELL:LISTING',
          '#BUSINESS:REAL_ESTATE:VIRTUAL:OWNERSHIP'
        ]
      }
    ];
    
    buttons.forEach(btn => this.buttons.set(btn.id, btn));
  }
  
  /**
   * Initialize transformation templates
   */
  private initializeTemplates(): void {
    this.templates.set('firmware', {
      name: 'Base Protocol Firmware',
      structure: {
        core: 'immutable-rules',
        access: 'protected',
        modification: 'locked'
      }
    });
    
    this.templates.set('franchise', {
      name: 'Franchise Package',
      structure: {
        brandGuidelines: true,
        territoryRights: true,
        trainingMaterials: true,
        operationsManual: true,
        marketingKit: true,
        supportAccess: true,
        revenueShare: 0.20  // 20%
      }
    });
    
    this.templates.set('series', {
      name: 'Episode Series',
      structure: {
        seasons: 1,
        episodesPerSeason: 7,
        episodeDuration: '15-30min',
        distribution: ['YouTube', 'Streaming', 'VibeFeed']
      }
    });
    
    this.templates.set('magazine', {
      name: 'Digital Magazine',
      structure: {
        frequency: 'monthly',
        format: ['digital', 'print'],
        sections: ['cover-story', 'features', 'tutorials', 'community']
      }
    });
    
    this.templates.set('marketplace', {
      name: 'Trading Platform',
      structure: {
        features: ['buy', 'sell', 'trade', 'auction'],
        payment: ['SYNTH', 'crypto', 'fiat'],
        fees: 0.02  // 2%
      }
    });
    
    this.templates.set('school', {
      name: 'Educational System',
      structure: {
        courses: true,
        certifications: true,
        instructors: true,
        curriculum: 'auto-generated'
      }
    });
    
    this.templates.set('ecosystem', {
      name: 'Interconnected Network',
      structure: {
        participants: ['creators', 'consumers', 'validators'],
        economy: 'self-sustaining',
        governance: 'community-driven'
      }
    });
  }
  
  /**
   * Transform a concept using a button
   */
  async transform(
    buttonId: string,
    concept: any,
    context?: any
  ): Promise<TransformationResult> {
    const button = this.buttons.get(buttonId);
    if (!button) {
      throw new Error(`Button not found: ${buttonId}`);
    }
    
    console.log(`\n🔲 BUTTONIZATION: ${button.label}`);
    console.log(`   Concept: ${concept.name || concept.id || 'unnamed'}`);
    console.log(`   Format: ${button.transformsTo.format}`);
    
    // Check requirements
    if (button.requirements) {
      await this.checkRequirements(button.requirements, context);
    }
    
    // Route through BBHE
    const sequenced = await routeWithTags(concept, button.bbheTags);
    
    // Apply transformation template
    const template = this.templates.get(button.transformsTo.format);
    const transformed = await this.applyTemplate(concept, template, button);
    
    // Create result
    const result: TransformationResult = {
      success: true,
      format: button.transformsTo.format,
      outputId: this.generateOutputId(),
      outputs: {
        primary: transformed,
        supporting: []
      },
      metadata: {
        transformedAt: new Date(),
        fromConcept: concept.name || concept.id,
        templateUsed: button.transformsTo.template
      },
      nextActions: this.suggestNextActions(button.transformsTo.format)
    };
    
    // Store transformation
    this.transformations.set(result.outputId, result);
    
    // Push to VibeChain if applicable
    if (['firmware', 'nft', 'token'].includes(button.transformsTo.format)) {
      try {
        await vibeBlock({
          item: {
            type: 'system',
            name: `${button.label}: ${concept.name}`,
            payload: result
          },
          bbheTags: button.bbheTags
        });
        console.log(`   ⛓️ Pushed to VibeChain`);
      } catch (error) {
        console.warn(`   ⚠️ VibeChain push failed:`, error);
      }
    }
    
    console.log(`✅ Transformation complete: ${result.outputId}\n`);
    
    return result;
  }
  
  /**
   * Apply transformation template
   */
  private async applyTemplate(
    concept: any,
    template: any,
    button: QuickButton
  ): Promise<any> {
    // Simulate transformation (in real implementation, would use AI)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      ...template,
      source: concept,
      transformedBy: button.id,
      timestamp: new Date(),
      content: this.generateContent(concept, button.transformsTo.format)
    };
  }
  
  /**
   * Generate content for transformation
   */
  private generateContent(concept: any, format: TransformationFormat): any {
    switch (format) {
      case 'series':
        return {
          title: `${concept.name}: The Series`,
          seasons: [{
            number: 1,
            episodes: Array.from({ length: 7 }, (_, i) => ({
              number: i + 1,
              title: `Episode ${i + 1}`,
              description: `Exploring ${concept.name}...`
            }))
          }]
        };
        
      case 'magazine':
        return {
          title: `${concept.name} Magazine`,
          issue: 1,
          articles: [
            { title: 'Cover Story', type: 'feature' },
            { title: 'Deep Dive', type: 'technical' },
            { title: 'Community Spotlight', type: 'social' }
          ]
        };
        
      case 'franchise':
        return {
          name: `${concept.name} Franchise`,
          package: 'complete',
          territories: [],
          opportunities: 'unlimited'
        };
        
      default:
        return {
          name: `${concept.name} ${format}`,
          type: format,
          generated: true
        };
    }
  }
  
  /**
   * Check transformation requirements
   */
  private async checkRequirements(
    requirements: QuickButton['requirements'],
    context?: any
  ): Promise<void> {
    if (requirements?.octaveLevel && context?.userOctave) {
      if (context.userOctave < requirements.octaveLevel) {
        throw new Error(`Requires octave ${requirements.octaveLevel} or higher`);
      }
    }
    
    // Additional requirement checks would go here
  }
  
  /**
   * Suggest next actions after transformation
   */
  private suggestNextActions(format: TransformationFormat): string[] {
    const suggestions: Record<TransformationFormat, string[]> = {
      firmware: ['Deploy to production', 'Document changes', 'Notify stakeholders'],
      franchise: ['List opportunity', 'Setup training', 'Define territories'],
      series: ['Schedule episodes', 'Create marketing', 'Setup distribution'],
      magazine: ['Write articles', 'Design layout', 'Setup subscription'],
      marketplace: ['Add initial listings', 'Configure payment', 'Launch marketing'],
      school: ['Create curriculum', 'Recruit instructors', 'Open enrollment'],
      ecosystem: ['Invite participants', 'Setup governance', 'Launch economy'],
      vchip: ['Test deployment', 'Monitor performance', 'Scale as needed'],
      adventure: ['Test gameplay', 'Add rewards', 'Launch beta'],
      nft: ['Setup minting', 'Create collection', 'List on marketplace'],
      token: ['Define tokenomics', 'Setup liquidity', 'Launch token'],
      property: ['Create listing', 'Set pricing', 'Market property'],
      api: ['Test endpoints', 'Write docs', 'Deploy to production'],
      book: ['Write chapters', 'Edit content', 'Publish'],
      video: ['Edit footage', 'Add effects', 'Upload'],
      soundtrack: ['Compose tracks', 'Mix audio', 'Distribute']
    };
    
    return suggestions[format] || ['Review output', 'Make adjustments', 'Publish'];
  }
  
  /**
   * Generate unique output ID
   */
  private generateOutputId(): string {
    return `TRANSFORM_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Get button by ID
   */
  getButton(id: string): QuickButton | undefined {
    return this.buttons.get(id);
  }
  
  /**
   * Get all buttons by category
   */
  getButtonsByCategory(category: ButtonCategory): QuickButton[] {
    return Array.from(this.buttons.values())
      .filter(btn => btn.category === category);
  }
  
  /**
   * Get all buttons
   */
  getAllButtons(): QuickButton[] {
    return Array.from(this.buttons.values());
  }
  
  /**
   * Get transformation result
   */
  getTransformation(outputId: string): TransformationResult | undefined {
    return this.transformations.get(outputId);
  }
}

// Singleton instance
export const buttonizationEngine = new ButtonizationEngine();

/**
 * Quick access functions
 */

export async function buttonize(
  buttonId: string,
  concept: any,
  context?: any
): Promise<TransformationResult> {
  return await buttonizationEngine.transform(buttonId, concept, context);
}

export function getQuickButtons(category?: ButtonCategory): QuickButton[] {
  if (category) {
    return buttonizationEngine.getButtonsByCategory(category);
  }
  return buttonizationEngine.getAllButtons();
}

export function getButton(id: string): QuickButton | undefined {
  return buttonizationEngine.getButton(id);
}

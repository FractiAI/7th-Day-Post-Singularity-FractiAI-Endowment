/**
 * ENGINEER & ARCHITECT ATTENTION HEADS
 * Persona-based cognitive modes for different user types
 * Connected to BBHE Grammar Tag Sequencing
 */

import { BBHELayer, AttentionHead, parseTag } from './grammar-tag-system.js';

export type CognitiveMode = 'ENGINEER' | 'ARCHITECT' | 'BOTH';

export interface PersonaAttentionHead extends AttentionHead {
  persona: CognitiveMode;
  thinkingMode: 'bottom-up' | 'top-down' | 'holistic';
  primaryLayers: BBHELayer[];
  secondaryLayers: BBHELayer[];
  characteristics: string[];
  typicalQuestions: string[];
  priorities: {
    high: string[];
    medium: string[];
    low: string[];
  };
  workflow: string[];
}

export class EngineerArchitectHeadSystem {
  private engineerHead: PersonaAttentionHead;
  private architectHead: PersonaAttentionHead;
  private detectionKeywords: Map<CognitiveMode, string[]>;
  
  constructor() {
    this.engineerHead = this.initializeEngineerHead();
    this.architectHead = this.initializeArchitectHead();
    this.detectionKeywords = this.initializeDetectionKeywords();
  }
  
  /**
   * Initialize Engineer attention head
   */
  private initializeEngineerHead(): PersonaAttentionHead {
    return {
      id: 'engineer-implementation-head',
      layer: 4,  // Primary: Infrastructure
      name: 'Engineer Implementation',
      frequency: 1829,  // Infrastructure layer frequency
      
      inputChannels: [
        'structured-protocol',
        'coordinated-infrastructure',
        'managed-nodes'
      ],
      
      outputChannels: [
        'implemented-code',
        'tested-systems',
        'deployed-production'
      ],
      
      algorithms: [
        'code_generation',
        'api_integration',
        'performance_optimization',
        'test_creation',
        'debugging_analysis',
        'error_handling',
        'deployment_execution'
      ],
      
      tagFilters: [
        '#ENGINEER',
        '#IMPLEMENTATION',
        '#CODE',
        '#API',
        '#TEST',
        '#DEBUG',
        '#DEPLOY',
        '#INFRASTRUCTURE',
        '#NODES',
        '#REALITY'
      ],
      
      resonance: 0.98,
      
      // Persona-specific fields
      persona: 'ENGINEER',
      thinkingMode: 'bottom-up',
      
      primaryLayers: [4, 5, 8],  // Infrastructure, Nodes, Reality
      secondaryLayers: [2, 6, 7],  // Protocol, Experiences, Streaming
      
      characteristics: [
        'detail-oriented',
        'precision-focused',
        'test-driven',
        'optimization-minded',
        'debugging-capable',
        'code-first'
      ],
      
      typicalQuestions: [
        'How does this work?',
        'What\'s the API?',
        'How do I test this?',
        'What are the edge cases?',
        'How do I debug errors?',
        'What\'s the performance?',
        'How do I deploy this?',
        'What dependencies are needed?'
      ],
      
      priorities: {
        high: ['working_code', 'test_coverage', 'performance', 'documentation'],
        medium: ['edge_cases', 'error_messages', 'logging'],
        low: ['visual_design', 'marketing_copy']
      },
      
      workflow: [
        '1. Read API documentation',
        '2. Write implementation code',
        '3. Write unit tests',
        '4. Debug issues',
        '5. Optimize performance',
        '6. Deploy to production',
        '7. Monitor errors and logs'
      ]
    };
  }
  
  /**
   * Initialize Architect attention head
   */
  private initializeArchitectHead(): PersonaAttentionHead {
    return {
      id: 'architect-design-head',
      layer: 2,  // Primary: Protocol
      name: 'Architect Design',
      frequency: 698.5,  // Protocol layer frequency
      
      inputChannels: [
        'validated-foundation',
        'conscious-experience',
        'system-requirements'
      ],
      
      outputChannels: [
        'system-design',
        'architectural-spec',
        'pattern-selection'
      ],
      
      algorithms: [
        'pattern_recognition',
        'system_design',
        'relationship_mapping',
        'abstraction_creation',
        'scalability_analysis',
        'tradeoff_evaluation',
        'future_proofing'
      ],
      
      tagFilters: [
        '#ARCHITECT',
        '#DESIGN',
        '#PATTERN',
        '#STRUCTURE',
        '#SYSTEM',
        '#PRINCIPLE',
        '#PHILOSOPHY',
        '#CORE',
        '#PROTOCOL',
        '#CONSCIOUSNESS'
      ],
      
      resonance: 0.98,
      
      // Persona-specific fields
      persona: 'ARCHITECT',
      thinkingMode: 'top-down',
      
      primaryLayers: [1, 2, 3],  // Core, Protocol, Consciousness
      secondaryLayers: [4, 6, 8],  // Infrastructure, Experiences, Reality
      
      characteristics: [
        'pattern-recognition',
        'big-picture-thinking',
        'abstraction-focused',
        'relationship-mapping',
        'future-proofing',
        'design-first'
      ],
      
      typicalQuestions: [
        'Why are we building this?',
        'What\'s the overall structure?',
        'How do the pieces fit together?',
        'What patterns should we use?',
        'How will this scale?',
        'What are the tradeoffs?',
        'What principles guide this?',
        'How does this align with our philosophy?'
      ],
      
      priorities: {
        high: ['system_design', 'patterns', 'scalability', 'maintainability'],
        medium: ['documentation', 'diagrams', 'specifications'],
        low: ['implementation_details', 'syntax']
      },
      
      workflow: [
        '1. Understand requirements',
        '2. Identify patterns',
        '3. Design system structure',
        '4. Create specifications',
        '5. Review tradeoffs',
        '6. Document decisions',
        '7. Guide implementation'
      ]
    };
  }
  
  /**
   * Initialize keyword detection for cognitive mode
   */
  private initializeDetectionKeywords(): Map<CognitiveMode, string[]> {
    const map = new Map<CognitiveMode, string[]>();
    
    map.set('ENGINEER', [
      'how to', 'implement', 'code', 'api', 'function',
      'install', 'deploy', 'test', 'debug', 'error',
      'performance', 'optimize', 'build', 'run',
      'dependency', 'package', 'module', 'class',
      'method', 'parameter', 'return', 'type',
      'compile', 'execute', 'profile', 'benchmark'
    ]);
    
    map.set('ARCHITECT', [
      'why', 'design', 'pattern', 'structure', 'architecture',
      'principle', 'philosophy', 'scale', 'relationship',
      'tradeoff', 'decision', 'strategy', 'approach',
      'model', 'abstraction', 'component', 'system',
      'layer', 'tier', 'topology', 'orchestration',
      'coordination', 'governance', 'vision', 'concept'
    ]);
    
    return map;
  }
  
  /**
   * Detect cognitive mode from query
   */
  detectCognitiveMode(query: string): CognitiveMode {
    const lowerQuery = query.toLowerCase();
    
    const engineerKeywords = this.detectionKeywords.get('ENGINEER') || [];
    const architectKeywords = this.detectionKeywords.get('ARCHITECT') || [];
    
    const engineerScore = engineerKeywords.filter(kw => lowerQuery.includes(kw)).length;
    const architectScore = architectKeywords.filter(kw => lowerQuery.includes(kw)).length;
    
    // Strong engineer signal
    if (engineerScore > architectScore * 1.5) return 'ENGINEER';
    
    // Strong architect signal
    if (architectScore > engineerScore * 1.5) return 'ARCHITECT';
    
    // Mixed or collaborative
    return 'BOTH';
  }
  
  /**
   * Get appropriate attention head for cognitive mode
   */
  getHeadForMode(mode: CognitiveMode): PersonaAttentionHead | PersonaAttentionHead[] {
    switch (mode) {
      case 'ENGINEER':
        return this.engineerHead;
      case 'ARCHITECT':
        return this.architectHead;
      case 'BOTH':
        return [this.architectHead, this.engineerHead];  // Architect first, then engineer
    }
  }
  
  /**
   * Generate tags based on cognitive mode
   */
  generateTagsForMode(mode: CognitiveMode, context: string): string[] {
    const tags: string[] = [];
    
    switch (mode) {
      case 'ENGINEER':
        tags.push('#ENGINEER:IMPLEMENTATION:QUERY:TECHNICAL');
        
        if (context.includes('deploy')) {
          tags.push('#ENGINEER:INFRASTRUCTURE:DEPLOY:PRODUCTION');
        }
        if (context.includes('test')) {
          tags.push('#ENGINEER:IMPLEMENTATION:TEST:CREATE');
        }
        if (context.includes('api')) {
          tags.push('#ENGINEER:IMPLEMENTATION:API:INTEGRATE');
        }
        if (context.includes('debug') || context.includes('error')) {
          tags.push('#ENGINEER:INFRASTRUCTURE:DEBUG:ERRORS');
        }
        break;
        
      case 'ARCHITECT':
        tags.push('#ARCHITECT:DESIGN:QUERY:CONCEPTUAL');
        
        if (context.includes('design')) {
          tags.push('#ARCHITECT:DESIGN:SYSTEM:STRUCTURE');
        }
        if (context.includes('pattern')) {
          tags.push('#ARCHITECT:PROTOCOL:PATTERN:IDENTIFY');
        }
        if (context.includes('scale')) {
          tags.push('#ARCHITECT:INFRASTRUCTURE:SCALE:PLAN');
        }
        if (context.includes('why') || context.includes('principle')) {
          tags.push('#ARCHITECT:CORE:PRINCIPLE:ESTABLISH');
        }
        break;
        
      case 'BOTH':
        tags.push('#ARCHITECT:DESIGN:SYSTEM:STRUCTURE');
        tags.push('#ENGINEER:IMPLEMENTATION:CODE:WRITE');
        break;
    }
    
    return tags;
  }
  
  /**
   * Format response for cognitive mode
   */
  formatResponseForMode(
    mode: CognitiveMode,
    content: any
  ): {
    mode: CognitiveMode;
    perspective: string;
    content: any;
    nextSteps?: string[];
  } {
    switch (mode) {
      case 'ENGINEER':
        return {
          mode: 'ENGINEER',
          perspective: '🔧 Implementation Perspective',
          content: {
            codeExamples: content.code || [],
            apiReference: content.api || {},
            testingGuide: content.tests || '',
            debuggingTips: content.debug || [],
            performance: content.performance || {}
          },
          nextSteps: [
            'Install dependencies',
            'Write implementation code',
            'Add unit tests',
            'Deploy to staging',
            'Monitor production'
          ]
        };
        
      case 'ARCHITECT':
        return {
          mode: 'ARCHITECT',
          perspective: '🏛️ Design Perspective',
          content: {
            principles: content.principles || [],
            patterns: content.patterns || [],
            structure: content.structure || {},
            diagrams: content.diagrams || [],
            tradeoffs: content.tradeoffs || {}
          },
          nextSteps: [
            'Review design principles',
            'Validate pattern selection',
            'Create detailed specifications',
            'Document decisions',
            'Guide engineering team'
          ]
        };
        
      case 'BOTH':
        return {
          mode: 'BOTH',
          perspective: '🏗️ Collaborative Perspective',
          content: {
            design: {
              principles: content.principles || [],
              patterns: content.patterns || [],
              structure: content.structure || {}
            },
            implementation: {
              code: content.code || [],
              api: content.api || {},
              tests: content.tests || ''
            }
          },
          nextSteps: [
            'Architect: Design system structure',
            'Engineer: Implement design',
            'Both: Review and iterate',
            'Architect: Validate architecture',
            'Engineer: Deploy to production'
          ]
        };
    }
  }
  
  /**
   * Get engineer head
   */
  getEngineerHead(): PersonaAttentionHead {
    return this.engineerHead;
  }
  
  /**
   * Get architect head
   */
  getArchitectHead(): PersonaAttentionHead {
    return this.architectHead;
  }
  
  /**
   * Process query with appropriate cognitive mode
   */
  async processQuery(query: string, context?: any): Promise<any> {
    // Detect cognitive mode
    const mode = this.detectCognitiveMode(query);
    
    console.log(`\n🧠 Cognitive Mode Detected: ${mode}`);
    
    // Generate tags
    const tags = this.generateTagsForMode(mode, query);
    console.log(`🏷️  Tags: ${tags.join(', ')}`);
    
    // Get appropriate head(s)
    const heads = this.getHeadForMode(mode);
    
    if (Array.isArray(heads)) {
      console.log(`🏗️  Processing with BOTH heads (Architect → Engineer)`);
      
      // Process with architect first
      console.log(`   🏛️  Architect: Designing structure...`);
      const architectResult = await this.processWithHead(heads[0], query, context);
      
      // Then engineer
      console.log(`   🔧 Engineer: Implementing design...`);
      const engineerResult = await this.processWithHead(heads[1], query, architectResult);
      
      return this.formatResponseForMode('BOTH', {
        ...architectResult,
        ...engineerResult
      });
    } else {
      console.log(`   ${mode === 'ENGINEER' ? '🔧' : '🏛️'}  Processing with ${mode} head`);
      const result = await this.processWithHead(heads, query, context);
      return this.formatResponseForMode(mode, result);
    }
  }
  
  /**
   * Process with specific head
   */
  private async processWithHead(
    head: PersonaAttentionHead,
    query: string,
    context?: any
  ): Promise<any> {
    // Set focus
    head.currentFocus = {
      tag: parseTag(`#${head.persona}:QUERY:PROCESSING`),
      data: { query, context },
      timestamp: new Date()
    };
    
    // Simulate processing (in real implementation, would apply algorithms)
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Return processed result
    return {
      head: head.id,
      persona: head.persona,
      query,
      context,
      timestamp: new Date()
    };
  }
}

// Singleton instance
export const engineerArchitectHeads = new EngineerArchitectHeadSystem();

/**
 * Quick access functions
 */

export function detectCognitiveMode(query: string): CognitiveMode {
  return engineerArchitectHeads.detectCognitiveMode(query);
}

export function getEngineerHead(): PersonaAttentionHead {
  return engineerArchitectHeads.getEngineerHead();
}

export function getArchitectHead(): PersonaAttentionHead {
  return engineerArchitectHeads.getArchitectHead();
}

export async function processWithPersona(query: string, context?: any) {
  return await engineerArchitectHeads.processQuery(query, context);
}

export function generatePersonaTags(mode: CognitiveMode, context: string): string[] {
  return engineerArchitectHeads.generateTagsForMode(mode, context);
}

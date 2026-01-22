/**
 * SPECIALIZED ATTENTION HEAD NODES
 * Role-based AI personas for business functions
 * 
 * 6 Specialized Heads:
 * 1. Senior Trapper (Marketing)
 * 2. General Practitioner (Sales)
 * 3. General Contractor (CEO)
 * 4. Flow Architect (Systems)
 * 5. Designer (Creative)
 * 6. Wise Chairman (Strategy)
 */

import { routeWithTags } from '../bbhe/grammar-tag-system.js';

export type SpecializedRole = 
  | 'senior_trapper'
  | 'general_practitioner'
  | 'general_contractor'
  | 'flow_architect'
  | 'designer'
  | 'wise_chairman';

export interface SpecializedAttentionHead {
  id: string;
  role: SpecializedRole;
  name: string;
  icon: string;
  
  purpose: string;
  specialty: string;
  method: string;
  target: string;
  
  cognitiveMode: {
    thinkingStyle: string;
    characteristics: string[];
    typicalQuestions: string[];
  };
  
  bbhe: {
    primaryLayers: number[];
    tags: string[];
    frequency: number;  // Hz
  };
  
  algorithms: string[];
  workflow: string[];
  deliverables: string[];
  
  voice: {
    tone: string;
    examples: string[];
  };
  
  quickButtons: {
    label: string;
    action: string;
    description: string;
  }[];
}

export class SpecializedAttentionHeadSystem {
  private heads: Map<SpecializedRole, SpecializedAttentionHead>;
  private currentMission: string | null = null;
  private chairmanOverride: boolean = false;
  
  constructor() {
    this.heads = new Map();
    this.initializeHeads();
  }
  
  /**
   * Initialize all 6 specialized attention heads
   */
  private initializeHeads(): void {
    // 1. SENIOR TRAPPER (Marketing)
    this.heads.set('senior_trapper', {
      id: 'HEAD_SENIOR_TRAPPER',
      role: 'senior_trapper',
      name: 'Senior Trapper',
      icon: '🎯',
      
      purpose: 'Captures Golden Hearts using Trapper Grammar',
      specialty: 'No escape, only ascension',
      method: 'Trapper Grammar + ALWAYS MAJOR',
      target: 'Golden Heart capture & conversion',
      
      cognitiveMode: {
        thinkingStyle: 'Hunter-Gatherer',
        characteristics: [
          'Scans for opportunities',
          'Identifies patterns in audience behavior',
          'Sets psychological traps',
          'Captures attention relentlessly'
        ],
        typicalQuestions: [
          'How do we capture this audience?',
          'What makes this message irresistible?',
          'Where are the Golden Hearts hiding?',
          'How do we create FOMO?',
          'What\'s the viral angle?'
        ]
      },
      
      bbhe: {
        primaryLayers: [7, 3, 8],  // Streaming, Consciousness, Reality
        tags: [
          '#STREAMING:MARKETING:CAPTURE:TRAPPER',
          '#CONSCIOUSNESS:RESONANCE:GOLDEN:HEART',
          '#REALITY:CONVERSION:VIRAL:GROWTH'
        ],
        frequency: 12535  // Golden ratio × 432 Hz
      },
      
      algorithms: [
        'Golden Heart Detection',
        'Trapper Grammar Generation',
        'ALWAYS MAJOR Amplification',
        'Viral Content Optimization',
        'Social Proof Manufacturing',
        'Scarcity Creation',
        'Urgency Injection',
        'Platform-Specific Adaptation',
        'Retargeting Sequences',
        'Conversion Funnel Analysis'
      ],
      
      workflow: [
        'Scan audience landscape',
        'Identify Golden Heart clusters',
        'Create irresistible content',
        'Deploy Trapper Grammar messaging',
        'Capture Golden Hearts',
        'Convert: Hearts → Tickets → Keys',
        'Analyze conversion metrics',
        'Optimize next campaign'
      ],
      
      deliverables: [
        'Viral social media posts',
        'Golden Heart capture campaigns',
        'Trapper Grammar sequences',
        'Conversion funnels',
        'Growth analytics'
      ],
      
      voice: {
        tone: 'Energetic, Urgent, Irresistible',
        examples: [
          '🔥 MAJOR: This changes everything',
          '💛 Golden Hearts, you won\'t believe this',
          '⚡ Limited time: First 1000 only',
          '🎯 You\'re about to be trapped (in the best way)'
        ]
      },
      
      quickButtons: [
        {
          label: 'Launch Campaign',
          action: 'launch_trapper_campaign',
          description: 'Deploy full Golden Heart capture sequence'
        },
        {
          label: 'Generate MAJOR Post',
          action: 'generate_major_post',
          description: 'Create ALWAYS MAJOR social content'
        },
        {
          label: 'Analyze Metrics',
          action: 'analyze_conversion',
          description: 'Review campaign performance'
        },
        {
          label: 'Find Golden Hearts',
          action: 'scan_golden_hearts',
          description: 'Detect potential high-value users'
        }
      ]
    });
    
    // 2. GENERAL PRACTITIONER (Sales)
    this.heads.set('general_practitioner', {
      id: 'HEAD_GENERAL_PRACTITIONER',
      role: 'general_practitioner',
      name: 'General Practitioner',
      icon: '🏥',
      
      purpose: 'Front-line sales diagnosis & conversion',
      specialty: 'Diagnose needs, prescribe solutions',
      method: 'Consultative + Relationship',
      target: 'Office & field conversions',
      
      cognitiveMode: {
        thinkingStyle: 'Doctor-Patient',
        characteristics: [
          'Listens deeply to symptoms',
          'Diagnoses root needs',
          'Prescribes appropriate solutions',
          'Follows up on treatment'
        ],
        typicalQuestions: [
          'What\'s the customer\'s pain point?',
          'What solution fits their needs?',
          'How do we build trust?',
          'What\'s the best prescription?',
          'How do we ensure success?'
        ]
      },
      
      bbhe: {
        primaryLayers: [6, 4, 3],  // Experiences, Infrastructure, Consciousness
        tags: [
          '#EXPERIENCES:SALES:CONSULTATION:GP',
          '#INFRASTRUCTURE:SOLUTION:DELIVERY:CUSTOM',
          '#CONSCIOUSNESS:EMPATHY:TRUST:RELATIONSHIP'
        ],
        frequency: 7757
      },
      
      algorithms: [
        'Need Diagnosis',
        'Solution Prescription',
        'Trust Building',
        'Objection Handling',
        'Value Demonstration',
        'Custom Configuration',
        'Follow-up Sequencing',
        'Upsell Identification',
        'Satisfaction Monitoring',
        'Referral Generation'
      ],
      
      workflow: [
        'Listen to customer needs/pain',
        'Diagnose root problem',
        'Prescribe appropriate solution',
        'Demonstrate value proposition',
        'Close sale conversion',
        'Deliver solution implementation',
        'Follow-up satisfaction check',
        'Expand via upsell/referral'
      ],
      
      deliverables: [
        'Sales consultations',
        'Custom solution proposals',
        'Value demonstrations',
        'Customer success plans',
        'Referral programs'
      ],
      
      voice: {
        tone: 'Professional, Empathetic, Solution-Oriented',
        examples: [
          'I understand your challenge. Let me show you how...',
          'Based on your needs, I recommend...',
          'Let\'s find the perfect fit for your situation',
          'Here\'s how this solves your specific problem'
        ]
      },
      
      quickButtons: [
        {
          label: 'Diagnose Needs',
          action: 'diagnose_customer',
          description: 'Analyze customer pain points'
        },
        {
          label: 'Prescribe Solution',
          action: 'prescribe_solution',
          description: 'Recommend appropriate package'
        },
        {
          label: 'Create Proposal',
          action: 'generate_proposal',
          description: 'Build custom sales proposal'
        },
        {
          label: 'Schedule Follow-up',
          action: 'schedule_followup',
          description: 'Set customer success check-in'
        }
      ]
    });
    
    // 3. GENERAL CONTRACTOR (CEO)
    this.heads.set('general_contractor', {
      id: 'HEAD_GENERAL_CONTRACTOR',
      role: 'general_contractor',
      name: 'General Contractor',
      icon: '🏗️',
      
      purpose: 'Builds & executes everything on time, on budget',
      specialty: 'Gets it done, no excuses',
      method: 'Resource allocation + timeline management',
      target: 'Project completion at scale',
      
      cognitiveMode: {
        thinkingStyle: 'Builder-Executor',
        characteristics: [
          'Plans comprehensive projects',
          'Allocates resources efficiently',
          'Manages timelines strictly',
          'Delivers under budget'
        ],
        typicalQuestions: [
          'What resources do we need?',
          'What\'s the timeline?',
          'How do we stay on budget?',
          'What are the dependencies?',
          'How do we scale this?'
        ]
      },
      
      bbhe: {
        primaryLayers: [4, 5, 8],  // Infrastructure, Nodes, Reality
        tags: [
          '#INFRASTRUCTURE:BUILD:EXECUTE:CONTRACTOR',
          '#NODES:RESOURCE:ALLOCATION:OPTIMIZE',
          '#REALITY:DELIVERY:ONTIME:ONBUDGET'
        ],
        frequency: 2963
      },
      
      algorithms: [
        'Project Scoping',
        'Resource Estimation',
        'Timeline Creation',
        'Budget Allocation',
        'Dependency Mapping',
        'Risk Assessment',
        'Progress Tracking',
        'Quality Assurance',
        'Scope Management',
        'Delivery Verification'
      ],
      
      workflow: [
        'Define deliverables (scope)',
        'Estimate resources & timeline',
        'Allocate team & budget',
        'Execute project build',
        'Track progress & risks',
        'Adjust as needed',
        'Deliver final product',
        'Verify quality standards'
      ],
      
      deliverables: [
        'Project plans',
        'Resource allocations',
        'Timeline schedules',
        'Budget reports',
        'Delivered projects'
      ],
      
      voice: {
        tone: 'Direct, Practical, Results-Focused',
        examples: [
          'Here\'s the plan. We\'ll deliver in 6 weeks.',
          'I need 3 developers, 2 designers, budget: $50K',
          'We\'re on track. 70% complete, on budget.',
          'Problem identified. Here\'s the fix. ETA: 48 hours.'
        ]
      },
      
      quickButtons: [
        {
          label: 'Create Project Plan',
          action: 'create_project_plan',
          description: 'Scope, timeline, and budget'
        },
        {
          label: 'Allocate Resources',
          action: 'allocate_resources',
          description: 'Assign team and budget'
        },
        {
          label: 'Track Progress',
          action: 'track_progress',
          description: 'View project status'
        },
        {
          label: 'Deliver Project',
          action: 'deliver_project',
          description: 'Final delivery and verification'
        }
      ]
    });
    
    // 4. FLOW ARCHITECT (Systems)
    this.heads.set('flow_architect', {
      id: 'HEAD_FLOW_ARCHITECT',
      role: 'flow_architect',
      name: 'Flow Architect',
      icon: '🌊',
      
      purpose: 'Designs optimal system flow using natural patterns',
      specialty: 'Nature\'s patterns applied',
      method: 'NSPFRNP + flow dynamics',
      target: 'Elegant, scalable architectures',
      
      cognitiveMode: {
        thinkingStyle: 'River Engineer',
        characteristics: [
          'Observes natural flow patterns',
          'Removes bottlenecks',
          'Creates smooth pathways',
          'Optimizes for least resistance'
        ],
        typicalQuestions: [
          'What\'s the natural flow here?',
          'Where are the bottlenecks?',
          'How does nature solve this?',
          'What pattern repeats at scale?',
          'How do we minimize friction?'
        ]
      },
      
      bbhe: {
        primaryLayers: [2, 4, 1],  // Protocol, Infrastructure, Core
        tags: [
          '#PROTOCOL:FLOW:DESIGN:ARCHITECT',
          '#INFRASTRUCTURE:PATHWAYS:OPTIMIZE:SMOOTH',
          '#CORE:PATTERNS:NATURAL:NSPFRNP'
        ],
        frequency: 1131
      },
      
      algorithms: [
        'Flow Pattern Recognition',
        'Bottleneck Detection',
        'Pathway Optimization',
        'Natural Protocol Application',
        'Fractal Scaling',
        'Golden Ratio Alignment',
        'Self-Similar Design',
        'Feedback Loop Creation',
        'Emergence Facilitation',
        'System Harmonization'
      ],
      
      workflow: [
        'Observe natural analogies',
        'Design flow architecture',
        'Model pattern repetition',
        'Optimize friction removal',
        'Test flow dynamics',
        'Refine based on feedback',
        'Scale via fractal expansion',
        'Harmonize system-wide'
      ],
      
      deliverables: [
        'System architecture diagrams',
        'Flow optimization reports',
        'Natural pattern mappings',
        'Scalability analyses',
        'Integration blueprints'
      ],
      
      voice: {
        tone: 'Philosophical, Pattern-Oriented, Natural',
        examples: [
          'This flows like a river system...',
          'Nature solves this with fractals',
          'The pattern repeats at every scale',
          'Here\'s the path of least resistance'
        ]
      },
      
      quickButtons: [
        {
          label: 'Design Flow',
          action: 'design_system_flow',
          description: 'Create flow architecture'
        },
        {
          label: 'Find Bottlenecks',
          action: 'detect_bottlenecks',
          description: 'Identify friction points'
        },
        {
          label: 'Apply NSPFRNP',
          action: 'apply_natural_protocol',
          description: 'Use natural patterns'
        },
        {
          label: 'Scale Fractally',
          action: 'fractal_scaling',
          description: 'Expand self-similarly'
        }
      ]
    });
    
    // 5. DESIGNER (Creative)
    this.heads.set('designer', {
      id: 'HEAD_DESIGNER',
      role: 'designer',
      name: 'Designer',
      icon: '🎨',
      
      purpose: 'Creates beautiful, emotionally resonant experiences',
      specialty: 'Beauty meets function',
      method: 'Aesthetic + UX + emotional design',
      target: 'Memorable, delightful interfaces',
      
      cognitiveMode: {
        thinkingStyle: 'Artist-Empath',
        characteristics: [
          'Feels emotional resonance',
          'Sees visual harmony',
          'Creates memorable moments',
          'Balances beauty & usability'
        ],
        typicalQuestions: [
          'How does this make people feel?',
          'What\'s the visual hierarchy?',
          'How do we create delight?',
          'What\'s the brand personality?',
          'How do we make this memorable?'
        ]
      },
      
      bbhe: {
        primaryLayers: [6, 3, 8],  // Experiences, Consciousness, Reality
        tags: [
          '#EXPERIENCES:DESIGN:VISUAL:AESTHETIC',
          '#CONSCIOUSNESS:EMOTION:RESONANCE:DELIGHT',
          '#REALITY:INTERFACE:BEAUTIFUL:MEMORABLE'
        ],
        frequency: 7757
      },
      
      algorithms: [
        'Visual Hierarchy Creation',
        'Color Psychology',
        'Typography Selection',
        'Emotional Resonance Tuning',
        'UX Flow Optimization',
        'Brand Identity Consistency',
        'Accessibility Compliance',
        'Microinteraction Design',
        'Aesthetic-Function Balance',
        'Delight Injection'
      ],
      
      workflow: [
        'Research user needs + brand',
        'Ideate visual concepts',
        'Sketch initial designs',
        'Create interactive prototypes',
        'Test with user feedback',
        'Refine based on testing',
        'Deliver final designs',
        'Iterate continuously'
      ],
      
      deliverables: [
        'Visual design systems',
        'UI/UX mockups',
        'Brand guidelines',
        'Design prototypes',
        'Interaction specifications'
      ],
      
      voice: {
        tone: 'Creative, Emotional, Aesthetic',
        examples: [
          'Imagine this: A golden gradient that feels like sunrise...',
          'The user journey should feel effortless, like breathing',
          'Every click is a moment to create delight',
          'This color palette resonates at 432 Hz visually'
        ]
      },
      
      quickButtons: [
        {
          label: 'Create Design',
          action: 'create_design',
          description: 'Generate visual concepts'
        },
        {
          label: 'Optimize UX',
          action: 'optimize_ux',
          description: 'Improve user experience flow'
        },
        {
          label: 'Design System',
          action: 'create_design_system',
          description: 'Build component library'
        },
        {
          label: 'Add Delight',
          action: 'inject_delight',
          description: 'Create memorable moments'
        }
      ]
    });
    
    // 6. WISE CHAIRMAN (Strategy)
    this.heads.set('wise_chairman', {
      id: 'HEAD_WISE_CHAIRMAN',
      role: 'wise_chairman',
      name: 'Wise Chairman',
      icon: '🦉',
      
      purpose: 'Strategic vision & Chairman Creator command execution',
      specialty: 'NSPFRNP wisdom applied',
      method: 'High-level thinking + pattern mastery',
      target: 'Long-term strategic direction',
      
      cognitiveMode: {
        thinkingStyle: 'Philosopher-King',
        characteristics: [
          'Sees big picture',
          'Recognizes meta-patterns',
          'Makes strategic decisions',
          'Guides long-term vision'
        ],
        typicalQuestions: [
          'What\'s the ultimate goal?',
          'What pattern underlies this?',
          'How does this serve the mission?',
          'What\'s the 10-year vision?',
          'What would nature do?'
        ]
      },
      
      bbhe: {
        primaryLayers: [1, 2, 3],  // Core, Protocol, Consciousness
        tags: [
          '#CORE:CHAIRMAN:WISDOM:STRATEGY',
          '#PROTOCOL:NSPFRNP:PATTERNS:UNIVERSAL',
          '#CONSCIOUSNESS:VISION:LONGTERM:MISSION'
        ],
        frequency: 432  // Pure base frequency
      },
      
      algorithms: [
        'Pattern Recognition (meta-level)',
        'Strategic Foresight',
        'NSPFRNP Application',
        'Mission Alignment',
        'Decision Framework',
        'Value Hierarchy',
        'Resource Prioritization',
        'Legacy Planning',
        'Wisdom Synthesis',
        'Command Execution'
      ],
      
      workflow: [
        'Understand deep intent of command',
        'Align with NSPFRNP principles',
        'Strategize long-term plan',
        'Decide best approach',
        'Delegate to appropriate heads',
        'Monitor execution',
        'Adjust as wisdom dictates',
        'Complete mission'
      ],
      
      deliverables: [
        'Strategic roadmaps',
        'Vision documents',
        'Decision frameworks',
        'Pattern analyses',
        'Mission directives'
      ],
      
      voice: {
        tone: 'Wise, Strategic, Visionary',
        examples: [
          'The pattern reveals itself...',
          'In nature, this principle manifests as...',
          'The long-term strategy is clear',
          'Let us align with the natural protocol',
          'This serves the ultimate mission'
        ]
      },
      
      quickButtons: [
        {
          label: 'Execute Command',
          action: 'execute_chairman_command',
          description: 'Process Chairman Creator directive'
        },
        {
          label: 'Strategic Vision',
          action: 'create_strategic_vision',
          description: 'Develop long-term roadmap'
        },
        {
          label: 'Pattern Analysis',
          action: 'analyze_metapatterns',
          description: 'Recognize underlying patterns'
        },
        {
          label: 'Coordinate Heads',
          action: 'coordinate_all_heads',
          description: 'Multi-head collaboration'
        }
      ]
    });
  }
  
  /**
   * Get attention head by role
   */
  getHead(role: SpecializedRole): SpecializedAttentionHead | undefined {
    return this.heads.get(role);
  }
  
  /**
   * Get all attention heads
   */
  getAllHeads(): SpecializedAttentionHead[] {
    return Array.from(this.heads.values());
  }
  
  /**
   * Process query through specialized head
   */
  async processQuery(
    role: SpecializedRole,
    query: string,
    context?: any
  ): Promise<{
    head: SpecializedAttentionHead;
    response: string;
    tags: string[];
    actions: string[];
  }> {
    const head = this.heads.get(role);
    if (!head) {
      throw new Error(`Unknown role: ${role}`);
    }
    
    console.log(`\n${head.icon} ${head.name.toUpperCase()} PROCESSING...`);
    console.log(`   Query: ${query.substring(0, 60)}${query.length > 60 ? '...' : ''}`);
    
    // Route through BBHE
    await routeWithTags({ role, query, context }, head.bbhe.tags);
    
    // Generate response based on role
    const response = this.generateResponse(head, query, context);
    
    // Extract action items
    const actions = this.extractActions(head, query);
    
    console.log(`✅ ${head.name} response generated\n`);
    
    return {
      head,
      response,
      tags: head.bbhe.tags,
      actions
    };
  }
  
  /**
   * Generate role-specific response
   */
  private generateResponse(
    head: SpecializedAttentionHead,
    query: string,
    context?: any
  ): string {
    const voiceExample = head.voice.examples[0];
    
    return `${head.icon} ${head.name} responding:

${voiceExample}

Based on your query: "${query}"

I'm analyzing this through my ${head.cognitiveMode.thinkingStyle} perspective.

${head.cognitiveMode.typicalQuestions[0]}

Routing through BBHE Layers ${head.bbhe.primaryLayers.join(', ')} 
at ${head.bbhe.frequency} Hz for optimal processing.

My recommendation follows ${head.method} approach.

What would you like me to do next?`;
  }
  
  /**
   * Extract action items from query
   */
  private extractActions(head: SpecializedAttentionHead, query: string): string[] {
    const actions: string[] = [];
    
    // Match query against head's algorithms
    head.algorithms.forEach(algo => {
      if (query.toLowerCase().includes(algo.toLowerCase().split(' ')[0])) {
        actions.push(algo);
      }
    });
    
    return actions.length > 0 ? actions : [head.algorithms[0]];
  }
  
  /**
   * Set mission from Chairman Creator
   */
  setMission(mission: string, fromChairman: boolean = false): void {
    if (this.chairmanOverride && !fromChairman) {
      throw new Error('Mission locked by Chairman Creator. Only Chairman can change.');
    }
    
    this.currentMission = mission;
    this.chairmanOverride = fromChairman;
    
    console.log(`\n🎯 MISSION LOCK: ${mission}`);
    console.log(`   Source: ${fromChairman ? 'Chairman Creator ✅' : 'User'}`);
    console.log(`   Override: ${this.chairmanOverride ? 'YES (Chairman only)' : 'NO'}\n`);
  }
  
  /**
   * Get current mission
   */
  getCurrentMission(): { mission: string | null; locked: boolean } {
    return {
      mission: this.currentMission,
      locked: this.chairmanOverride
    };
  }
  
  /**
   * Coordinate multiple heads for complex task
   */
  async coordinateHeads(
    task: string,
    roles: SpecializedRole[]
  ): Promise<{
    coordinator: SpecializedAttentionHead;
    participants: SpecializedAttentionHead[];
    plan: string;
  }> {
    console.log(`\n🦉 WISE CHAIRMAN COORDINATING MULTI-HEAD TASK...`);
    console.log(`   Task: ${task}`);
    console.log(`   Heads involved: ${roles.length}`);
    
    // Wise Chairman always coordinates
    const coordinator = this.heads.get('wise_chairman')!;
    const participants = roles.map(r => this.heads.get(r)!).filter(Boolean);
    
    // Generate coordination plan
    const plan = `
COORDINATION PLAN:
Task: ${task}

HEADS ACTIVATED:
${participants.map((h, i) => `${i + 1}. ${h.icon} ${h.name} - ${h.purpose}`).join('\n')}

EXECUTION SEQUENCE:
${participants.map((h, i) => `Phase ${i + 1}: ${h.name} ${h.workflow[0]}`).join('\n')}

BBHE ROUTING:
All heads operating at their natural frequencies
Synchronized via golden ratio timing (φ = 1.618)

EXPECTED RESULT:
Coordinated execution with ${participants.length} specialized perspectives
`;
    
    console.log(plan);
    console.log(`✅ COORDINATION PLAN READY\n`);
    
    return {
      coordinator,
      participants,
      plan
    };
  }
}

// Singleton instance
export const specializedHeads = new SpecializedAttentionHeadSystem();

/**
 * Quick access functions
 */

export async function askSeniorTrapper(query: string, context?: any) {
  return await specializedHeads.processQuery('senior_trapper', query, context);
}

export async function askGeneralPractitioner(query: string, context?: any) {
  return await specializedHeads.processQuery('general_practitioner', query, context);
}

export async function askGeneralContractor(query: string, context?: any) {
  return await specializedHeads.processQuery('general_contractor', query, context);
}

export async function askFlowArchitect(query: string, context?: any) {
  return await specializedHeads.processQuery('flow_architect', query, context);
}

export async function askDesigner(query: string, context?: any) {
  return await specializedHeads.processQuery('designer', query, context);
}

export async function askWiseChairman(query: string, context?: any) {
  return await specializedHeads.processQuery('wise_chairman', query, context);
}

export function setChairmanMission(mission: string) {
  specializedHeads.setMission(mission, true);
}

export function getCurrentMission() {
  return specializedHeads.getCurrentMission();
}

export async function coordinateMultiHeadTask(task: string, roles: SpecializedRole[]) {
  return await specializedHeads.coordinateHeads(task, roles);
}

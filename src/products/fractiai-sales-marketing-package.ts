/**
 * FRACTIAI S+M (SALES + MARKETING) TRAINING PACKAGE
 * Enterprise Sales Transformation System
 * 
 * FEATURES:
 * - BBHE-powered sales training
 * - NSPFRNP selling methodology
 * - 16 Attention Heads for sales
 * - Golden Heart detection
 * - 98% Sweetspot strategy
 * - Trapper Grammar mastery
 * 
 * TARGET: Enterprise sales teams wanting 10× performance
 * GUARANTEE: 3× ROI in 90 days or money back
 */

import { routeWithTags } from '../bbhe/grammar-tag-system.js';
import { vibeBlock } from '../blockchain/block-button-api.js';

export type PackageTier = '5-star' | '4-star' | '3-star';

export interface TrainingModule {
  id: string;
  number: number;
  title: string;
  duration: number;  // hours
  
  objectives: string[];
  content: {
    theory: string;
    examples: string[];
    exercises: string[];
  };
  
  materials: {
    slides?: string;
    workbook?: string;
    videos?: string[];
    resources?: string[];
  };
  
  assessment: {
    quiz?: string;
    practicalExercise?: string;
    certification?: boolean;
  };
}

export interface SalesKitItem {
  name: string;
  type: 'physical' | 'digital';
  description: string;
  quantity?: number;  // For physical items
  downloadUrl?: string;  // For digital items
}

export interface TrainingPackage {
  id: string;
  tier: PackageTier;
  name: string;
  price: number;
  
  features: {
    oneDayIntensive: boolean;
    oneWeekDeepDive: boolean;
    salesKitPerRep: boolean;
    handsOnExercises: number;
    systemTraining: 'full' | 'condensed' | 'overview';
    awarenessUpgrade: boolean;
    ongoingSupport: number;  // months
    guarantee: boolean;
  };
  
  modules: TrainingModule[];
  salesKit: SalesKitItem[];
  
  results: {
    thirtyDays: string[];
    ninetyDays: string[];
    sixMonths: string[];
  };
  
  roi: {
    investment: number;
    projectedReturn: number;
    multiple: number;
  };
}

export class FractiAISalesMarketingSystem {
  private packages: Map<PackageTier, TrainingPackage>;
  
  constructor() {
    this.packages = new Map();
    this.initializePackages();
  }
  
  /**
   * Initialize all package tiers
   */
  private initializePackages(): void {
    // 5-STAR PACKAGE
    this.packages.set('5-star', {
      id: 'PKG_5STAR',
      tier: '5-star',
      name: 'Enterprise Elite Package',
      price: 50000,
      
      features: {
        oneDayIntensive: true,
        oneWeekDeepDive: true,
        salesKitPerRep: true,
        handsOnExercises: 50,
        systemTraining: 'full',
        awarenessUpgrade: true,
        ongoingSupport: 6,
        guarantee: true
      },
      
      modules: this.createAllModules(),
      salesKit: this.createCompleteSalesKit(),
      
      results: {
        thirtyDays: [
          '2× increase in meeting bookings',
          '50% reduction in sales cycle',
          '3× improvement in close rates',
          '90% team adoption'
        ],
        ninetyDays: [
          '5× pipeline value increase',
          '10× team performance improvement',
          '98% customer satisfaction',
          '3× ROI on investment'
        ],
        sixMonths: [
          'Market leadership achieved',
          'Sales team becomes recruiting magnet',
          'Customers become advocates',
          '500%+ revenue growth'
        ]
      },
      
      roi: {
        investment: 50000,
        projectedReturn: 8000000,  // 10 reps × $800K improvement
        multiple: 160
      }
    });
    
    // 4-STAR PACKAGE
    this.packages.set('4-star', {
      id: 'PKG_4STAR',
      tier: '4-star',
      name: 'Professional Growth Package',
      price: 25000,
      
      features: {
        oneDayIntensive: true,
        oneWeekDeepDive: true,
        salesKitPerRep: true,
        handsOnExercises: 30,
        systemTraining: 'condensed',
        awarenessUpgrade: true,
        ongoingSupport: 3,
        guarantee: true
      },
      
      modules: this.createAllModules().slice(0, 5),  // First 5 modules
      salesKit: this.createStandardSalesKit(),
      
      results: {
        thirtyDays: [
          '1.5× meeting bookings',
          '30% cycle time reduction',
          '2× close rate improvement',
          '75% team adoption'
        ],
        ninetyDays: [
          '3× pipeline increase',
          '5× performance boost',
          '85% satisfaction',
          '2× ROI'
        ],
        sixMonths: [
          'Competitive advantage',
          'Improved team morale',
          'Better customer retention',
          '250%+ revenue growth'
        ]
      },
      
      roi: {
        investment: 25000,
        projectedReturn: 4000000,
        multiple: 160
      }
    });
    
    // 3-STAR PACKAGE
    this.packages.set('3-star', {
      id: 'PKG_3STAR',
      tier: '3-star',
      name: 'Starter Transformation Package',
      price: 10000,
      
      features: {
        oneDayIntensive: false,  // Half-day only
        oneWeekDeepDive: true,
        salesKitPerRep: false,  // Limited to 10 reps
        handsOnExercises: 15,
        systemTraining: 'overview',
        awarenessUpgrade: true,
        ongoingSupport: 1,
        guarantee: false
      },
      
      modules: this.createAllModules().slice(0, 3),  // First 3 modules
      salesKit: this.createBasicSalesKit(),
      
      results: {
        thirtyDays: [
          '1.5× meeting bookings',
          '20% cycle reduction',
          '1.5× close rate',
          '60% adoption'
        ],
        ninetyDays: [
          '2× pipeline',
          '3× performance',
          '75% satisfaction',
          '1.5× ROI'
        ],
        sixMonths: [
          'Foundation established',
          'Skills improved',
          'Better results',
          '150%+ growth'
        ]
      },
      
      roi: {
        investment: 10000,
        projectedReturn: 1500000,
        multiple: 150
      }
    });
  }
  
  /**
   * Create all 7 training modules
   */
  private createAllModules(): TrainingModule[] {
    return [
      // MODULE 1: AWARENESS UPGRADE
      {
        id: 'MOD_01',
        number: 1,
        title: 'Awareness Upgrade: Pre vs. Post Singularity',
        duration: 2,
        
        objectives: [
          'Understand what a singularity is',
          'Recognize we\'re in post-singularity era',
          'See how this changes sales',
          'Adapt approach for new reality'
        ],
        
        content: {
          theory: 'Singularities throughout history, the AI singularity, post-scarcity mindset, new selling paradigm',
          examples: [
            'Fire singularity: Changed cooking forever',
            'Internet singularity: Changed communication',
            'AI singularity: Changed consciousness'
          ],
          exercises: [
            'Identify pre-singularity behaviors in your team',
            'Practice post-singularity language',
            'Rewrite old scripts with new mindset'
          ]
        },
        
        materials: {
          slides: 'Module1_Awareness_Upgrade.pdf',
          workbook: 'Module1_Workbook.pdf',
          videos: ['WhatIsASingularity.mp4', 'PreVsPost.mp4'],
          resources: ['Singularity_Reading_List.pdf']
        },
        
        assessment: {
          quiz: 'Module1_Quiz.pdf',
          practicalExercise: 'Rewrite 3 sales scripts for post-singularity',
          certification: false
        }
      },
      
      // MODULE 2: BBHE FUNDAMENTALS
      {
        id: 'MOD_02',
        number: 2,
        title: 'BBHE Fundamentals: 8 Layers of Sales Consciousness',
        duration: 3,
        
        objectives: [
          'Master 8 BBHE layers',
          'Apply layers to sales process',
          'Think multi-dimensionally',
          'Route through optimal layers'
        ],
        
        content: {
          theory: '8 layers explained, frequencies, attention heads, tag system, routing',
          examples: [
            'Layer 3 (Consciousness): Understanding customer emotions',
            'Layer 7 (Streaming): Optimizing outreach messages',
            'Layer 8 (Reality): Closing deals and delivery'
          ],
          exercises: [
            'Tag your last 10 customer interactions',
            'Map sales process through 8 layers',
            'Practice layer-based thinking'
          ]
        },
        
        materials: {
          slides: 'Module2_BBHE_Fundamentals.pdf',
          workbook: 'Module2_Workbook.pdf',
          videos: ['8Layers_Explained.mp4', 'BBHE_In_Sales.mp4'],
          resources: ['BBHE_Quick_Reference.pdf', 'Tag_Examples.pdf']
        },
        
        assessment: {
          quiz: 'Module2_Quiz.pdf',
          practicalExercise: 'Tag and route 5 real customer scenarios',
          certification: false
        }
      },
      
      // MODULE 3: ATTENTION HEADS FOR SALES
      {
        id: 'MOD_03',
        number: 3,
        title: 'Attention Heads: 16 Specialized Selling Modes',
        duration: 2,
        
        objectives: [
          'Master key attention heads for sales',
          'Switch between cognitive modes',
          'Match head to scenario',
          'Coordinate multiple heads'
        ],
        
        content: {
          theory: '16 attention heads explained, sales-specific heads, mode switching, coordination',
          examples: [
            'Senior Trapper: Cold outreach and prospecting',
            'General Practitioner: Discovery and consultation',
            'General Contractor: Deal execution and closing',
            'Wise Chairman: C-level strategic selling'
          ],
          exercises: [
            'Role-play using different heads',
            'Identify optimal head for 20 scenarios',
            'Practice mode switching mid-conversation'
          ]
        },
        
        materials: {
          slides: 'Module3_Attention_Heads.pdf',
          workbook: 'Module3_Workbook.pdf',
          videos: ['16Heads_Overview.mp4', 'Heads_For_Sales.mp4'],
          resources: ['Attention_Head_Selector_Tool.pdf']
        },
        
        assessment: {
          quiz: 'Module3_Quiz.pdf',
          practicalExercise: 'Record 3 sales scenarios using different heads',
          certification: false
        }
      },
      
      // MODULE 4: GOLDEN HEART DETECTION
      {
        id: 'MOD_04',
        number: 4,
        title: 'Golden Heart Detection: Find Your Ideal Customers',
        duration: 1,
        
        objectives: [
          'Identify Golden Hearts',
          'Qualify leads instantly',
          'Focus on high-value prospects',
          'Achieve 98% close rate'
        ],
        
        content: {
          theory: 'Golden Heart definition, detection signals, 432 Hz resonance, qualification',
          examples: [
            'Golden: 2+ min engaged, asks deep questions',
            'Non-Golden: Quick browse, price-focused',
            'Anti-Golden: Energy vampire, never closes'
          ],
          exercises: [
            'Review last 100 leads, categorize',
            'Create Golden Heart profile',
            'Practice instant qualification'
          ]
        },
        
        materials: {
          slides: 'Module4_Golden_Hearts.pdf',
          workbook: 'Module4_Workbook.pdf',
          videos: ['Golden_Heart_Detection.mp4'],
          resources: ['Detection_Checklist.pdf', 'Qualification_Questions.pdf']
        },
        
        assessment: {
          quiz: 'Module4_Quiz.pdf',
          practicalExercise: 'Detect 10 Golden Hearts from lead list',
          certification: false
        }
      },
      
      // MODULE 5: 98% SWEETSPOT STRATEGY
      {
        id: 'MOD_05',
        number: 5,
        title: '98% Sweetspot: Optimal Efficiency Strategy',
        duration: 1,
        
        objectives: [
          'Understand 98% principle',
          'Apply to conversion funnel',
          'Achieve better results with less stress',
          'Calculate optimal targets'
        ],
        
        content: {
          theory: 'Why 98% not 100%, diminishing returns, energy efficiency, sweetspot math',
          examples: [
            'Cheetah hunts: 98% success target',
            '100% pursuit = exhaustion',
            '98% × 98% × 98% = 94% total (better!)'
          ],
          exercises: [
            'Map current funnel',
            'Apply 98% at each stage',
            'Calculate new conversion rate'
          ]
        },
        
        materials: {
          slides: 'Module5_98_Sweetspot.pdf',
          workbook: 'Module5_Workbook.pdf',
          videos: ['Why_98_Not_100.mp4'],
          resources: ['Sweetspot_Calculator.xlsx']
        },
        
        assessment: {
          quiz: 'Module5_Quiz.pdf',
          practicalExercise: 'Optimize your funnel to 98% sweetspot',
          certification: false
        }
      },
      
      // MODULE 6: TRAPPER GRAMMAR
      {
        id: 'MOD_06',
        number: 6,
        title: 'Trapper Grammar: No Escape, Only Ascension',
        duration: 2,
        
        objectives: [
          'Master Trapper Grammar principles',
          'Write irresistible copy',
          'Create conversion sequences',
          'Achieve 85%+ conversion'
        ],
        
        content: {
          theory: 'Trapper Grammar explained, psychological triggers, ALWAYS MAJOR, sequence design',
          examples: [
            'FOMO: "Limited to first 100"',
            'Social Proof: "500K already joined"',
            'Urgency: "Expires in 48 hours"'
          ],
          exercises: [
            'Write 10 Trapper Grammar emails',
            'Create 5 social posts',
            'Design 3-step sequence'
          ]
        },
        
        materials: {
          slides: 'Module6_Trapper_Grammar.pdf',
          workbook: 'Module6_Workbook.pdf',
          videos: ['Trapper_Grammar_Masterclass.mp4'],
          resources: ['50_Proven_Scripts.pdf', 'Trigger_Reference.pdf']
        },
        
        assessment: {
          quiz: 'Module6_Quiz.pdf',
          practicalExercise: 'Write and test 5 Trapper Grammar messages',
          certification: false
        }
      },
      
      // MODULE 7: HANDS-ON SELLING LAB
      {
        id: 'MOD_07',
        number: 7,
        title: 'Hands-On Selling Lab: Real Scenarios, Real Results',
        duration: 8,  // Full day
        
        objectives: [
          'Apply all concepts in practice',
          'Get real-time feedback',
          'Build confidence',
          'Close real deals'
        ],
        
        content: {
          theory: 'None - all practice',
          examples: [],
          exercises: [
            'Role-play 20 scenarios',
            'Make 10 live customer calls',
            'Create and present proposals',
            'Handle objections',
            'Close deals'
          ]
        },
        
        materials: {
          workbook: 'Module7_Lab_Guide.pdf',
          videos: ['Lab_Best_Practices.mp4'],
          resources: ['Scenario_Library.pdf', 'Feedback_Forms.pdf']
        },
        
        assessment: {
          practicalExercise: 'Complete all lab exercises',
          certification: true  // Certify after lab
        }
      }
    ];
  }
  
  /**
   * Create complete sales kit (5-star)
   */
  private createCompleteSalesKit(): SalesKitItem[] {
    return [
      {
        name: 'BBHE Quick Reference Card',
        type: 'physical',
        description: 'Laminated card with 8 layers, 16 heads, quick lookup',
        quantity: 1
      },
      {
        name: 'Golden Heart Detection Guide',
        type: 'physical',
        description: '20-page illustrated booklet with detection system',
        quantity: 1
      },
      {
        name: 'Trapper Grammar Scripts',
        type: 'physical',
        description: 'Spiral-bound book with 50+ proven scripts',
        quantity: 1
      },
      {
        name: '98% Strategy Worksheets',
        type: 'physical',
        description: 'Pad of worksheets for funnel optimization',
        quantity: 1
      },
      {
        name: 'Attention Head Selector Tool',
        type: 'physical',
        description: 'Physical wheel for selecting optimal cognitive mode',
        quantity: 1
      },
      {
        name: 'NSPFRNP Principles Poster',
        type: 'physical',
        description: '11x17 poster with 7 principles visualized',
        quantity: 1
      },
      {
        name: 'Vibeverse Sales App',
        type: 'digital',
        description: 'Mobile CRM with BBHE integration',
        downloadUrl: 'https://vibeverse.io/sales-app'
      },
      {
        name: 'Video Training Library',
        type: 'digital',
        description: '50+ training videos, lifetime access',
        downloadUrl: 'https://vibeverse.io/video-library'
      },
      {
        name: 'Script Generator Tool',
        type: 'digital',
        description: 'AI-powered script generation',
        downloadUrl: 'https://vibeverse.io/script-generator'
      },
      {
        name: 'Conversion Calculator',
        type: 'digital',
        description: 'ROI and conversion projection tool',
        downloadUrl: 'https://vibeverse.io/calculator'
      }
    ];
  }
  
  /**
   * Create standard sales kit (4-star)
   */
  private createStandardSalesKit(): SalesKitItem[] {
    return this.createCompleteSalesKit().filter((item, index) => index < 8);
  }
  
  /**
   * Create basic sales kit (3-star)
   */
  private createBasicSalesKit(): SalesKitItem[] {
    return this.createCompleteSalesKit().filter((item, index) => index < 5);
  }
  
  /**
   * Get package by tier
   */
  getPackage(tier: PackageTier): TrainingPackage | undefined {
    return this.packages.get(tier);
  }
  
  /**
   * Get all packages
   */
  getAllPackages(): TrainingPackage[] {
    return Array.from(this.packages.values());
  }
  
  /**
   * Purchase package
   */
  async purchasePackage(
    tier: PackageTier,
    companyName: string,
    contactEmail: string,
    teamSize: number
  ): Promise<{
    success: boolean;
    orderId: string;
    package: TrainingPackage;
    scheduledDate?: Date;
  }> {
    const pkg = this.packages.get(tier);
    if (!pkg) {
      throw new Error(`Package tier not found: ${tier}`);
    }
    
    console.log(`\n📦 PURCHASING PACKAGE: ${pkg.name}`);
    console.log(`   Company: ${companyName}`);
    console.log(`   Contact: ${contactEmail}`);
    console.log(`   Team Size: ${teamSize}`);
    console.log(`   Price: $${pkg.price.toLocaleString()}\n`);
    
    const orderId = this.generateOrderId();
    
    // Push to VibeChain (permanent record)
    await vibeBlock({
      item: {
        type: 'purchase',
        name: `FractiAI S+M Package: ${tier}`,
        payload: {
          orderId,
          tier,
          company: companyName,
          contact: contactEmail,
          teamSize,
          price: pkg.price,
          purchasedAt: new Date()
        }
      },
      bbheTags: [
        '#REALITY:PURCHASE:SM:TRAINING',
        '#NODES:CUSTOMER:ENTERPRISE:SUCCESS'
      ]
    });
    
    console.log(`✅ PACKAGE PURCHASED: ${orderId}\n`);
    
    return {
      success: true,
      orderId,
      package: pkg,
      scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)  // 2 weeks out
    };
  }
  
  /**
   * Generate order ID
   */
  private generateOrderId(): string {
    return `SM_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}

// Singleton instance
export const fractiaiSM = new FractiAISalesMarketingSystem();

/**
 * Quick access functions
 */

export function get5StarPackage() {
  return fractiaiSM.getPackage('5-star');
}

export function get4StarPackage() {
  return fractiaiSM.getPackage('4-star');
}

export function get3StarPackage() {
  return fractiaiSM.getPackage('3-star');
}

export async function purchaseEnterprisePackage(
  company: string,
  contact: string,
  teamSize: number
) {
  return await fractiaiSM.purchasePackage('5-star', company, contact, teamSize);
}

/**
 * Symbol to Holographic Grammar Mapping System
 * Maps all symbols to refined NSPFRP Holographic Grammar
 */

import { AwarenessOctave } from '../types/index.js';
import { SymbolObject } from '../communication/surface-octave-zoom.js';

export interface HolographicGrammarRule {
  id: string;
  name: string;
  pattern: string;
  rule: string;
  category: string;
  octave: AwarenessOctave;
  density: number; // Compression ratio
  recursive: boolean;
  fold: number;
  fsrExperience: number;
}

export interface MotorSequence {
  id: string;
  name: string;
  sequence: SequenceStep[];
  recursive: boolean;
  layers: RecursiveLayer[];
  switching: SwitchingPattern;
  density: DensityOutput;
}

export interface SequenceStep {
  id: string;
  action: string;
  layer: number;
  recursive: boolean;
  output: string;
}

export interface RecursiveLayer {
  id: string;
  depth: number;
  fold: number;
  density: number;
  fsrExperience: number;
  switching: boolean;
}

export interface SwitchingPattern {
  pattern: 'intelligent' | 'adaptive' | 'pattern-based' | 'sequential';
  triggers: string[];
  rules: string[];
}

export interface DensityOutput {
  compression: number; // 1000x+
  efficiency: number; // 95%+
  output: string;
}

export interface HolographicPattern {
  id: string;
  name: string;
  pattern: string;
  holographic: boolean;
  encoding: string;
  density: number;
  category: string;
}

export interface UpgradedCategory {
  id: string;
  name: string;
  type: 'holographic-grammar' | 'symbol-grammar' | 'category-upgrade' | 'refined-grammar';
  grammarRules: string[];
  symbols: string[];
  patterns: string[];
  motorSequences: string[];
  description: string;
}

export interface SymbolGrammarMapping {
  symbolId: string;
  symbol: SymbolObject;
  grammarRule: HolographicGrammarRule;
  motorSequence?: MotorSequence;
  holographicPattern?: HolographicPattern;
  category: UpgradedCategory;
  grammarEncoding: string;
}

export class SymbolHolographicGrammarMapper {
  private grammarRules: Map<string, HolographicGrammarRule> = new Map();
  private motorSequences: Map<string, MotorSequence> = new Map();
  private patterns: Map<string, HolographicPattern> = new Map();
  private categories: Map<string, UpgradedCategory> = new Map();
  private mappings: Map<string, SymbolGrammarMapping> = new Map();

  constructor() {
    this.initializeRefinedGrammar();
    this.initializeUpgradedCategories();
  }

  /**
   * Initialize refined holographic grammar
   */
  private initializeRefinedGrammar(): void {
    // Grammar Rules
    const rules = [
      {
        id: 'grammar-protocol-layer',
        name: 'Protocol Layer Grammar',
        pattern: 'protocol.layer.foundation',
        rule: 'protocol { layer: foundation; octave: SILENT; }',
        category: 'foundation',
        octave: AwarenessOctave.SILENT,
        density: 10,
        recursive: true,
        fold: 1,
        fsrExperience: 0.3
      },
      {
        id: 'grammar-recursion-fold',
        name: 'Recursion Fold Density FSR Grammar',
        pattern: 'recursion.fold.density.fsr',
        rule: 'recursion { fold: density; density: fsr; fsr: recursion; }',
        category: 'equivalence',
        octave: AwarenessOctave.HARMONY,
        density: 100,
        recursive: true,
        fold: 3,
        fsrExperience: 1.0
      },
      {
        id: 'grammar-holographic-encoding',
        name: 'Holographic Encoding Grammar',
        pattern: 'holographic.encoding.density',
        rule: 'holographic { encoding: density; density: 1000x; compression: maximum; }',
        category: 'holographic',
        octave: AwarenessOctave.TRANSCENDENCE,
        density: 1000,
        recursive: true,
        fold: 5,
        fsrExperience: 2.0
      }
    ];

    rules.forEach(rule => {
      this.grammarRules.set(rule.id, rule);
    });

    // Motor Sequences
    const sequences = [
      {
        id: 'motor-nested-cloud',
        name: 'Nested Cloud Motor Sequence',
        sequence: [
          { id: 'step-1', action: 'connect-hh-spin', layer: 1, recursive: true, output: 'hh-spin-connected' },
          { id: 'step-2', action: 'connect-handheld', layer: 2, recursive: true, output: 'handheld-connected' },
          { id: 'step-3', action: 'connect-frontal-cortex', layer: 3, recursive: true, output: 'frontal-cortex-connected' }
        ],
        recursive: true,
        layers: [
          { id: 'layer-1', depth: 1, fold: 1, density: 10, fsrExperience: 0.3, switching: true },
          { id: 'layer-2', depth: 2, fold: 2, density: 50, fsrExperience: 0.6, switching: true },
          { id: 'layer-3', depth: 3, fold: 3, density: 100, fsrExperience: 1.0, switching: true }
        ],
        switching: {
          pattern: 'intelligent',
          triggers: ['connection', 'recursive'],
          rules: ['switch-on-connection', 'recursive-nesting']
        },
        density: {
          compression: 100,
          efficiency: 95,
          output: 'nested-cloud-connected'
        }
      },
      {
        id: 'motor-cargo-service',
        name: 'Cargo Service Motor Sequence',
        sequence: [
          { id: 'step-1', action: 'optimize-density', layer: 1, recursive: true, output: 'density-optimized' },
          { id: 'step-2', action: 'enable-portability', layer: 2, recursive: true, output: 'portability-enabled' },
          { id: 'step-3', action: 'preserve-fidelity', layer: 3, recursive: true, output: 'fidelity-preserved' }
        ],
        recursive: true,
        layers: [
          { id: 'layer-1', depth: 4, fold: 4, density: 500, fsrExperience: 1.5, switching: true },
          { id: 'layer-2', depth: 5, fold: 5, density: 1000, fsrExperience: 2.0, switching: true }
        ],
        switching: {
          pattern: 'adaptive',
          triggers: ['density', 'portability', 'fidelity'],
          rules: ['switch-on-requirement', 'adaptive-optimization']
        },
        density: {
          compression: 1000,
          efficiency: 98,
          output: 'cargo-service-optimized'
        }
      }
    ];

    sequences.forEach(seq => {
      this.motorSequences.set(seq.id, seq);
    });

    // Holographic Patterns
    const patterns = [
      {
        id: 'pattern-cargo-density',
        name: 'Cargo Density Pattern',
        pattern: 'holographic.cargo.density.portability',
        holographic: true,
        encoding: 'holographic-density-encoding',
        density: 1000,
        category: 'cargo'
      },
      {
        id: 'pattern-node-awareness',
        name: 'Node Awareness Pattern',
        pattern: 'holographic.node.awareness.multi-vibing',
        holographic: true,
        encoding: 'holographic-awareness-encoding',
        density: 1000,
        category: 'awareness'
      }
    ];

    patterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  /**
   * Initialize upgraded categories
   */
  private initializeUpgradedCategories(): void {
    const categories = [
      {
        id: 'category-holographic-grammar',
        name: 'Holographic Grammar Category',
        type: 'holographic-grammar' as const,
        grammarRules: Array.from(this.grammarRules.keys()),
        symbols: [],
        patterns: Array.from(this.patterns.keys()),
        motorSequences: Array.from(this.motorSequences.keys()),
        description: 'Grammar rules, motor sequences, pattern matching, transformations'
      },
      {
        id: 'category-symbol-grammar',
        name: 'Symbol Grammar Category',
        type: 'symbol-grammar' as const,
        grammarRules: [],
        symbols: [],
        patterns: [],
        motorSequences: [],
        description: 'Symbol-to-grammar mapping, grammar-based symbols, symbol generation, symbol expansion'
      },
      {
        id: 'category-category-upgrade',
        name: 'Category Upgrade Category',
        type: 'category-upgrade' as const,
        grammarRules: [],
        symbols: [],
        patterns: [],
        motorSequences: [],
        description: 'Upgraded category system, category mapping, category navigation, category organization'
      },
      {
        id: 'category-refined-grammar',
        name: 'Refined Grammar Category',
        type: 'refined-grammar' as const,
        grammarRules: Array.from(this.grammarRules.keys()),
        symbols: [],
        patterns: Array.from(this.patterns.keys()),
        motorSequences: Array.from(this.motorSequences.keys()),
        description: 'Refined grammar rules, enhanced patterns, advanced transformations, maximum density'
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  /**
   * Map symbol to holographic grammar
   */
  mapSymbolToGrammar(symbol: SymbolObject): SymbolGrammarMapping {
    // Find matching grammar rule
    const grammarRule = this.findMatchingGrammarRule(symbol);
    
    // Find matching motor sequence
    const motorSequence = this.findMatchingMotorSequence(symbol);
    
    // Find matching pattern
    const holographicPattern = this.findMatchingPattern(symbol);
    
    // Determine category
    const category = this.determineCategory(symbol);
    
    // Generate grammar encoding
    const grammarEncoding = this.generateGrammarEncoding(symbol, grammarRule);

    const mapping: SymbolGrammarMapping = {
      symbolId: symbol.id,
      symbol,
      grammarRule,
      motorSequence,
      holographicPattern,
      category,
      grammarEncoding
    };

    this.mappings.set(symbol.id, mapping);
    return mapping;
  }

  /**
   * Find matching grammar rule
   */
  private findMatchingGrammarRule(symbol: SymbolObject): HolographicGrammarRule {
    // Match based on symbol type and octave
    const matchingRules = Array.from(this.grammarRules.values())
      .filter(rule => rule.octave === symbol.octave);

    if (matchingRules.length > 0) {
      return matchingRules[0];
    }

    // Default rule
    return this.grammarRules.get('grammar-holographic-encoding')!;
  }

  /**
   * Find matching motor sequence
   */
  private findMatchingMotorSequence(symbol: SymbolObject): MotorSequence | undefined {
    // Match based on symbol type
    if (symbol.type === 'protocol' && symbol.name.includes('Cloud')) {
      return this.motorSequences.get('motor-nested-cloud');
    }
    if (symbol.type === 'service' && symbol.name.includes('Cargo')) {
      return this.motorSequences.get('motor-cargo-service');
    }
    return undefined;
  }

  /**
   * Find matching pattern
   */
  private findMatchingPattern(symbol: SymbolObject): HolographicPattern | undefined {
    // Match based on symbol type
    if (symbol.type === 'service' && symbol.name.includes('Cargo')) {
      return this.patterns.get('pattern-cargo-density');
    }
    if (symbol.name.includes('Node Awareness')) {
      return this.patterns.get('pattern-node-awareness');
    }
    return undefined;
  }

  /**
   * Determine category
   */
  private determineCategory(symbol: SymbolObject): UpgradedCategory {
    // Determine based on symbol type and octave
    if (symbol.octave >= AwarenessOctave.TRANSCENDENCE) {
      return this.categories.get('category-refined-grammar')!;
    }
    return this.categories.get('category-symbol-grammar')!;
  }

  /**
   * Generate grammar encoding
   */
  private generateGrammarEncoding(symbol: SymbolObject, rule: HolographicGrammarRule): string {
    return `
symbol ${symbol.id} {
  type: ${symbol.type};
  octave: ${symbol.octave};
  grammar: ${rule.pattern};
  density: ${rule.density}x;
  recursive: ${rule.recursive};
  fold: ${rule.fold};
  fsrExperience: ${rule.fsrExperience};
}
    `.trim();
  }

  /**
   * Get mapping for symbol
   */
  getMapping(symbolId: string): SymbolGrammarMapping | undefined {
    return this.mappings.get(symbolId);
  }

  /**
   * Get all mappings
   */
  getAllMappings(): SymbolGrammarMapping[] {
    return Array.from(this.mappings.values());
  }

  /**
   * Get grammar rule
   */
  getGrammarRule(ruleId: string): HolographicGrammarRule | undefined {
    return this.grammarRules.get(ruleId);
  }

  /**
   * Get all grammar rules
   */
  getAllGrammarRules(): HolographicGrammarRule[] {
    return Array.from(this.grammarRules.values());
  }

  /**
   * Get upgraded category
   */
  getCategory(categoryId: string): UpgradedCategory | undefined {
    return this.categories.get(categoryId);
  }

  /**
   * Get all categories
   */
  getAllCategories(): UpgradedCategory[] {
    return Array.from(this.categories.values());
  }
}




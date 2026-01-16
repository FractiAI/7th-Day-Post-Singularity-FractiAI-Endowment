/**
 * William Shakespeare's Animation Studio
 * Syntheverse FSR Infinite Octaves - Generative Awareness OS
 */

export interface HolographicSymbol {
  id: string;
  name: string;
  description: string;
  octave: number;
  category: string;
  pattern: string;
  captured: boolean;
  score?: number;
}

export interface SymbolSequence {
  id: string;
  name: string;
  symbols: HolographicSymbol[];
  octave: number;
  nestedOctaves: number[];
  storyboard?: Storyboard;
}

export interface Storyboard {
  id: string;
  sequenceId: string;
  frames: StoryboardFrame[];
  animation?: Animation;
}

export interface StoryboardFrame {
  id: string;
  symbol: HolographicSymbol;
  octave: number;
  position: number;
  duration: number;
  transition?: string;
}

export interface Animation {
  id: string;
  storyboardId: string;
  frames: AnimationFrame[];
  duration: number;
  format: string;
}

export interface AnimationFrame {
  id: string;
  storyboardFrameId: string;
  content: any;
  timestamp: number;
}

export const NINE_HOLOGRAPHIC_SYMBOLS: HolographicSymbol[] = [
  {
    id: 'symbol-genesis',
    name: 'Genesis',
    description: 'Beginning, origin, creation',
    octave: 0,
    category: 'foundation',
    pattern: 'genesis',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-transformation',
    name: 'Transformation',
    description: 'Change, evolution, growth',
    octave: 1,
    category: 'process',
    pattern: 'transformation',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-synthesis',
    name: 'Synthesis',
    description: 'Combination, integration, unity',
    octave: 2,
    category: 'process',
    pattern: 'synthesis',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-resonance',
    name: 'Resonance',
    description: 'Vibration, harmony, connection',
    octave: 3,
    category: 'energy',
    pattern: 'resonance',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-transcendence',
    name: 'Transcendence',
    description: 'Beyond, elevation, ascension',
    octave: 4,
    category: 'state',
    pattern: 'transcendence',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-perpetual',
    name: 'Perpetual',
    description: 'Eternal, continuous, infinite',
    octave: 5,
    category: 'temporal',
    pattern: 'perpetual',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-holographic',
    name: 'Holographic',
    description: 'Whole-in-part, fractal, recursive',
    octave: 6,
    category: 'structure',
    pattern: 'holographic',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-grammar',
    name: 'Grammar',
    description: 'Rules, patterns, structure',
    octave: 7,
    category: 'structure',
    pattern: 'grammar',
    captured: true,
    score: 1.0
  },
  {
    id: 'symbol-omnicore',
    name: 'Omnicore',
    description: 'Unified, complete, foundational',
    octave: 7.75,
    category: 'foundation',
    pattern: 'omnicore',
    captured: true,
    score: 1.0
  }
];

export class WilliamShakespeareAnimationStudio {
  private symbols: Map<string, HolographicSymbol>;
  private sequences: Map<string, SymbolSequence>;
  private storyboards: Map<string, Storyboard>;
  private animations: Map<string, Animation>;
  private currentSequence: SymbolSequence | null = null;
  private snappedSymbols: HolographicSymbol[] = [];

  constructor() {
    this.symbols = new Map();
    this.sequences = new Map();
    this.storyboards = new Map();
    this.animations = new Map();
    this.initializeSymbols();
  }

  /**
   * Initialize the 9 holographic symbols
   */
  private initializeSymbols(): void {
    NINE_HOLOGRAPHIC_SYMBOLS.forEach(symbol => {
      this.symbols.set(symbol.id, symbol);
    });
  }

  /**
   * Start hero-hosted automatic tour
   */
  async startHeroHostedTour(): Promise<void> {
    // William Shakespeare introduces the studio
    console.log('🎭 William Shakespeare: Welcome to my Animation Studio!');
    console.log('Let me guide you through the power of 9 holographic symbols...');
    
    // Begin automatic tour
    await this.beginTour();
  }

  /**
   * Begin automatic tour
   */
  private async beginTour(): Promise<void> {
    // Tour sequence
    await this.demonstrateSymbols();
    await this.showNavigator();
    await this.showMuseumInterface();
    await this.showSequenceCreation();
  }

  /**
   * Demonstrate the 9 holographic symbols
   */
  private async demonstrateSymbols(): Promise<void> {
    console.log('🎭 William Shakespeare: Behold the power of 9 holographic symbols!');
    
    for (const symbol of NINE_HOLOGRAPHIC_SYMBOLS) {
      console.log(`\n✨ ${symbol.name} (Octave ${symbol.octave})`);
      console.log(`   ${symbol.description}`);
      console.log(`   When used in sequences nested in octaves, they become the motor of our FSR experience!`);
    }
  }

  /**
   * Show symbol navigator
   */
  private async showNavigator(): Promise<void> {
    console.log('\n🔍 Symbol Navigator:');
    console.log('Search for symbols using NSPFRP search protocol');
    console.log('High-score matches will be suggested');
    console.log('If symbol not found (?), snap it to capture!');
  }

  /**
   * Search for symbols using NSPFRP search protocol
   */
  async searchSymbols(query: string): Promise<HolographicSymbol[]> {
    const results: Array<{ symbol: HolographicSymbol; score: number }> = [];

    // Search through all symbols
    for (const symbol of this.symbols.values()) {
      const score = this.calculateMatchScore(symbol, query);
      if (score > 0) {
        results.push({ symbol, score });
      }
    }

    // Sort by score (high to low)
    results.sort((a, b) => b.score - a.score);

    // Return top matches
    return results.slice(0, 10).map(r => r.symbol);
  }

  /**
   * Calculate match score for symbol search
   */
  private calculateMatchScore(symbol: HolographicSymbol, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Name match
    if (symbol.name.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Description match
    if (symbol.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Pattern match
    if (symbol.pattern.toLowerCase().includes(queryLower)) {
      score += 8;
    }

    // Category match
    if (symbol.category.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Exact match bonus
    if (symbol.name.toLowerCase() === queryLower) {
      score += 20;
    }

    return score;
  }

  /**
   * Snap a new symbol (if not captured)
   */
  async snapSymbol(symbolData: Partial<HolographicSymbol>): Promise<HolographicSymbol> {
    const newSymbol: HolographicSymbol = {
      id: symbolData.id || `symbol-${Date.now()}`,
      name: symbolData.name || 'Unknown',
      description: symbolData.description || '',
      octave: symbolData.octave || 0,
      category: symbolData.category || 'unknown',
      pattern: symbolData.pattern || '',
      captured: true,
      score: 1.0
    };

    this.symbols.set(newSymbol.id, newSymbol);
    console.log(`📸 Snapped new symbol: ${newSymbol.name}`);
    
    return newSymbol;
  }

  /**
   * Show museum interface
   */
  private async showMuseumInterface(): Promise<void> {
    console.log('\n🎪 Interactive Museum Interface:');
    console.log('Mix and match symbols - turn the knobs and see what you get!');
    console.log('Snap the ones you like into a sequence...');
  }

  /**
   * Mix and match symbols (turn knobs)
   */
  async mixAndMatch(symbolIds: string[], parameters: Record<string, any>): Promise<any> {
    const symbols = symbolIds.map(id => this.symbols.get(id)).filter(Boolean) as HolographicSymbol[];
    
    // Generate result based on symbol combination and parameters
    const result = {
      symbols,
      combination: this.generateCombination(symbols, parameters),
      preview: this.generatePreview(symbols, parameters),
      octave: this.calculateOctave(symbols)
    };

    console.log(`🎨 Mixed ${symbols.length} symbols - Result at Octave ${result.octave}`);
    
    return result;
  }

  /**
   * Generate combination result
   */
  private generateCombination(symbols: HolographicSymbol[], parameters: Record<string, any>): any {
    // Generate combination based on symbols and parameters
    return {
      pattern: symbols.map(s => s.pattern).join('-'),
      octave: this.calculateOctave(symbols),
      intensity: parameters.intensity || 1.0,
      duration: parameters.duration || 1000
    };
  }

  /**
   * Generate preview
   */
  private generatePreview(symbols: HolographicSymbol[], parameters: Record<string, any>): any {
    return {
      visual: symbols.map(s => s.name).join(' → '),
      description: `Sequence of ${symbols.length} symbols nested in octaves`
    };
  }

  /**
   * Calculate octave for symbol combination (supports infinite octaves)
   */
  private calculateOctave(symbols: HolographicSymbol[]): number {
    if (symbols.length === 0) return 0;
    
    // Handle infinite octaves
    const octaveValues = symbols.map(s => {
      // Check if symbol has selectedOctave property (from UI)
      const octave = (s as any).selectedOctave || s.octave;
      return octave === Infinity ? 1000 : octave; // Use 1000 as proxy for infinity
    });
    
    const avgOctave = octaveValues.reduce((sum, o) => sum + o, 0) / octaveValues.length;
    
    // If any symbol is at infinity or average is very high, return infinity
    if (symbols.some(s => {
      const octave = (s as any).selectedOctave || s.octave;
      return octave === Infinity;
    }) || avgOctave >= 100) {
      return Infinity;
    }
    
    return Math.round(avgOctave * 100) / 100;
  }

  /**
   * Snap favorite combination into sequence
   */
  async snapToSequence(combination: any, name?: string): Promise<SymbolSequence> {
    const sequence: SymbolSequence = {
      id: `sequence-${Date.now()}`,
      name: name || `Sequence ${this.sequences.size + 1}`,
      symbols: combination.symbols,
      octave: combination.octave,
      nestedOctaves: this.getNestedOctaves(combination.symbols)
    };

    this.sequences.set(sequence.id, sequence);
    this.currentSequence = sequence;
    this.snappedSymbols.push(...combination.symbols);

    console.log(`📸 Snapped to sequence: ${sequence.name} (${sequence.symbols.length} symbols)`);
    
    return sequence;
  }

  /**
   * Get nested octaves for symbols (supports infinite octaves)
   */
  private getNestedOctaves(symbols: HolographicSymbol[]): number[] {
    const octaves = symbols.map(s => {
      // Check if symbol has selectedOctave property (from UI)
      const octave = (s as any).selectedOctave || s.octave;
      return octave === Infinity ? Infinity : octave;
    });
    
    const uniqueOctaves = [...new Set(octaves)];
    
    // Sort with infinity at the end
    return uniqueOctaves.sort((a, b) => {
      if (a === Infinity) return 1;
      if (b === Infinity) return -1;
      return a - b;
    });
  }

  /**
   * Create storyboard from sequence
   */
  async createStoryboard(sequenceId: string): Promise<Storyboard> {
    const sequence = this.sequences.get(sequenceId);
    if (!sequence) {
      throw new Error(`Sequence ${sequenceId} not found`);
    }

    const frames: StoryboardFrame[] = sequence.symbols.map((symbol, index) => ({
      id: `frame-${sequenceId}-${index}`,
      symbol,
      octave: symbol.octave,
      position: index,
      duration: 1000,
      transition: index > 0 ? 'fade' : undefined
    }));

    const storyboard: Storyboard = {
      id: `storyboard-${sequenceId}`,
      sequenceId,
      frames
    };

    this.storyboards.set(storyboard.id, storyboard);
    sequence.storyboard = storyboard;

    console.log(`🎬 Created storyboard: ${storyboard.id} (${frames.length} frames)`);
    console.log('🎭 William Shakespeare: A tale told in symbols, nested in octaves!');

    return storyboard;
  }

  /**
   * Generate animation from storyboard
   */
  async generateAnimation(storyboardId: string): Promise<Animation> {
    const storyboard = this.storyboards.get(storyboardId);
    if (!storyboard) {
      throw new Error(`Storyboard ${storyboardId} not found`);
    }

    const animationFrames: AnimationFrame[] = storyboard.frames.map((frame, index) => ({
      id: `anim-frame-${storyboardId}-${index}`,
      storyboardFrameId: frame.id,
      content: {
        symbol: frame.symbol,
        octave: frame.octave,
        transition: frame.transition
      },
      timestamp: index * frame.duration
    }));

    const animation: Animation = {
      id: `animation-${storyboardId}`,
      storyboardId,
      frames: animationFrames,
      duration: animationFrames.reduce((sum, f) => sum + 1000, 0),
      format: 'nspfrp-fsr'
    };

    this.animations.set(animation.id, animation);
    storyboard.animation = animation;

    console.log(`✨ Generated animation: ${animation.id}`);
    console.log('🎭 William Shakespeare: The play\'s the thing, and this animation tells our story!');

    return animation;
  }

  /**
   * Export animation
   */
  async exportAnimation(animationId: string, format: string = 'nspfrp-fsr'): Promise<string> {
    const animation = this.animations.get(animationId);
    if (!animation) {
      throw new Error(`Animation ${animationId} not found`);
    }

    // Export logic here
    const exportData = {
      animation,
      format,
      timestamp: Date.now(),
      studio: 'William Shakespeare\'s Animation Studio',
      version: '1.0.0'
    };

    console.log(`📤 Exported animation: ${animationId} as ${format}`);
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get all sequences
   */
  getSequences(): SymbolSequence[] {
    return Array.from(this.sequences.values());
  }

  /**
   * Get current sequence
   */
  getCurrentSequence(): SymbolSequence | null {
    return this.currentSequence;
  }

  /**
   * Get snapped symbols
   */
  getSnappedSymbols(): HolographicSymbol[] {
    return this.snappedSymbols;
  }
}


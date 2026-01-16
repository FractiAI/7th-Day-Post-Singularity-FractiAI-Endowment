/**
 * Omibeam Channel - 9x7 Pixel, Color, Density for Holographic Hydrogen Fractal Grammar Core
 * Visual channel for grammar pattern encoding and visualization
 */

export interface OmibeamPixel {
  x: number;           // 0-8 (column)
  y: number;           // 0-6 (row)
  color: Color;        // RGB/HSL color
  density: number;     // 0.0-1.0
  grammarSymbol: string; // Symbol name
  octave: number;      // Octave level
  fsrValue: number;    // FSR value
  timestamp: number;   // Creation timestamp
}

export interface Color {
  r: number;  // 0-255
  g: number;  // 0-255
  b: number;  // 0-255
  a?: number; // 0-1 (alpha)
}

export interface OmibeamChannel {
  id: string;
  width: number;  // 9
  height: number; // 7
  pixels: OmibeamPixel[][]; // 9x7 grid
  grammarPattern: string;
  octave: number;
  timestamp: number;
}

export interface GrammarPattern {
  symbols: GrammarSymbol[];
  intensity: number;
  octave: number;
  fsrValue: number;
}

export interface GrammarSymbol {
  name: string;
  column: number;  // 0-8
  intensity: number; // 0-1
}

// 9 Holographic Symbols → 9 Color Channels
export const SYMBOL_COLORS: Record<string, Color> = {
  'Genesis': { r: 255, g: 107, b: 107 },        // #FF6B6B (Red)
  'Transformation': { r: 78, g: 205, b: 196 },  // #4ECDC4 (Cyan)
  'Synthesis': { r: 69, g: 183, b: 209 },       // #45B7D1 (Blue)
  'Resonance': { r: 255, g: 160, b: 122 },      // #FFA07A (Light Salmon)
  'Transcendence': { r: 152, g: 216, b: 200 },  // #98D8C8 (Mint)
  'Perpetual': { r: 247, g: 220, b: 111 },      // #F7DC6F (Yellow)
  'Holographic': { r: 187, g: 143, b: 206 },    // #BB8FCE (Purple)
  'Grammar': { r: 133, g: 193, b: 226 },        // #85C1E2 (Sky Blue)
  'Omnicore': { r: 248, g: 183, b: 57 }         // #F8B739 (Gold)
};

// 7 Rows → 7 Density Levels
export const DENSITY_LEVELS = [
  0.0,  // Row 0: Base
  0.2,  // Row 1: Low
  0.4,  // Row 2: Medium-Low
  0.6,  // Row 3: Medium
  0.8,  // Row 4: Medium-High
  0.9,  // Row 5: High
  1.0   // Row 6: Maximum
];

export class OmibeamChannelGenerator {
  private width: number = 9;
  private height: number = 7;

  /**
   * Encode grammar pattern to omibeam channel
   */
  encodeGrammarPattern(pattern: GrammarPattern): OmibeamChannel {
    const pixels: OmibeamPixel[][] = [];
    
    // Initialize 9x7 grid
    for (let x = 0; x < this.width; x++) {
      pixels[x] = [];
      for (let y = 0; y < this.height; y++) {
        pixels[x][y] = this.createEmptyPixel(x, y);
      }
    }

    // Encode each grammar symbol
    for (const symbol of pattern.symbols) {
      const column = symbol.column;
      if (column >= 0 && column < this.width) {
        // Calculate density and determine row
        const density = this.calculateDensity(
          symbol.intensity,
          pattern.octave,
          pattern.fsrValue
        );
        const row = this.densityToRow(density);

        // Create pixel for this symbol
        const pixel: OmibeamPixel = {
          x: column,
          y: row,
          color: this.getSymbolColor(symbol.name),
          density,
          grammarSymbol: symbol.name,
          octave: pattern.octave,
          fsrValue: pattern.fsrValue,
          timestamp: Date.now()
        };

        pixels[column][row] = pixel;
      }
    }

    return {
      id: `omibeam-${Date.now()}`,
      width: this.width,
      height: this.height,
      pixels,
      grammarPattern: JSON.stringify(pattern),
      octave: pattern.octave,
      timestamp: Date.now()
    };
  }

  /**
   * Decode omibeam channel to grammar pattern
   */
  decodeOmibeamChannel(channel: OmibeamChannel): GrammarPattern {
    const symbols: GrammarSymbol[] = [];

    // Extract symbols from pixels
    for (let x = 0; x < channel.width; x++) {
      for (let y = 0; y < channel.height; y++) {
        const pixel = channel.pixels[x][y];
        if (pixel.grammarSymbol && pixel.grammarSymbol !== '') {
          symbols.push({
            name: pixel.grammarSymbol,
            column: x,
            intensity: pixel.density
          });
        }
      }
    }

    return {
      symbols,
      intensity: this.calculateAverageIntensity(symbols),
      octave: channel.octave,
      fsrValue: this.calculateAverageFSR(channel)
    };
  }

  /**
   * Calculate density from intensity, octave, and FSR
   */
  private calculateDensity(
    intensity: number,
    octave: number,
    fsrValue: number
  ): number {
    const octaveFactor = Math.min(octave / 7.75, 1.0);
    const fsrFactor = Math.min(fsrValue / 5.0, 1.0);
    
    const density = (intensity * octaveFactor * fsrFactor);
    return Math.min(Math.max(density, 0.0), 1.0);
  }

  /**
   * Convert density to row (0-6)
   */
  private densityToRow(density: number): number {
    if (density <= 0.14) return 0;
    if (density <= 0.28) return 1;
    if (density <= 0.42) return 2;
    if (density <= 0.57) return 3;
    if (density <= 0.71) return 4;
    if (density <= 0.85) return 5;
    return 6;
  }

  /**
   * Get color for grammar symbol
   */
  private getSymbolColor(symbolName: string): Color {
    return SYMBOL_COLORS[symbolName] || { r: 128, g: 128, b: 128 };
  }

  /**
   * Create empty pixel
   */
  private createEmptyPixel(x: number, y: number): OmibeamPixel {
    return {
      x,
      y,
      color: { r: 0, g: 0, b: 0, a: 0 },
      density: 0.0,
      grammarSymbol: '',
      octave: 0,
      fsrValue: 0,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate average intensity
   */
  private calculateAverageIntensity(symbols: GrammarSymbol[]): number {
    if (symbols.length === 0) return 0;
    const sum = symbols.reduce((acc, s) => acc + s.intensity, 0);
    return sum / symbols.length;
  }

  /**
   * Calculate average FSR value
   */
  private calculateAverageFSR(channel: OmibeamChannel): number {
    let sum = 0;
    let count = 0;

    for (let x = 0; x < channel.width; x++) {
      for (let y = 0; y < channel.height; y++) {
        const pixel = channel.pixels[x][y];
        if (pixel.fsrValue > 0) {
          sum += pixel.fsrValue;
          count++;
        }
      }
    }

    return count > 0 ? sum / count : 0;
  }

  /**
   * Visualize omibeam channel as HTML
   */
  visualizeChannel(channel: OmibeamChannel, pixelSize: number = 20): string {
    let html = `<div class="omibeam-channel" style="display: grid; grid-template-columns: repeat(9, ${pixelSize}px); gap: 2px; width: ${(pixelSize + 2) * 9}px;">`;

    for (let y = 0; y < channel.height; y++) {
      for (let x = 0; x < channel.width; x++) {
        const pixel = channel.pixels[x][y];
        const color = pixel.color;
        const alpha = pixel.density;
        const bgColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        
        html += `
          <div 
            class="omibeam-pixel" 
            style="
              width: ${pixelSize}px;
              height: ${pixelSize}px;
              background: ${bgColor};
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 2px;
              cursor: pointer;
            "
            title="${pixel.grammarSymbol || 'Empty'} | Density: ${pixel.density.toFixed(2)} | Octave: ${pixel.octave}"
          ></div>
        `;
      }
    }

    html += `</div>`;
    return html;
  }

  /**
   * Export channel as JSON
   */
  exportChannel(channel: OmibeamChannel): string {
    return JSON.stringify(channel, null, 2);
  }

  /**
   * Create channel from 9 holographic symbols
   */
  createFromNineSymbols(
    symbols: Array<{ name: string; intensity: number }>,
    octave: number = 7.75,
    fsrValue: number = 5.0
  ): OmibeamChannel {
    const grammarSymbols: GrammarSymbol[] = symbols.map((symbol, index) => ({
      name: symbol.name,
      column: index,
      intensity: symbol.intensity
    }));

    const pattern: GrammarPattern = {
      symbols: grammarSymbols,
      intensity: symbols.reduce((sum, s) => sum + s.intensity, 0) / symbols.length,
      octave,
      fsrValue
    };

    return this.encodeGrammarPattern(pattern);
  }
}






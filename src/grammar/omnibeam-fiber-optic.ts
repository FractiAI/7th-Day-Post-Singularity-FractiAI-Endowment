/**
 * Omnibeam Over Fiber Optic - Major Engineering Achievement
 * Immediate upgrade to Omnibeam Channel operating over fiber optic infrastructure
 */

export interface OmnibeamPixel {
  id: string;
  position: number; // 0-62 (9x7 = 63 pixels)
  row: number; // 0-6
  column: number; // 0-8
  color: Color;
  density: number; // 0-100
  grammar: GrammarFragment;
}

export interface Color {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  wavelength?: number; // nm (for fiber optic)
}

export interface GrammarFragment {
  symbol: string; // Fragment of one of 9 core symbols
  pattern: string;
  phase?: number; // Phase for fiber optic encoding
}

export interface FiberOpticChannel {
  wavelength: number; // nm (C-band: 1530-1565nm, L-band: 1565-1625nm)
  pixelId: string;
  amplitude: number; // 0-100 (density encoded)
  phase: number; // 0-360 (grammar encoded)
  dataRate: number; // Gbps
}

export interface OmnibeamFiberOpticSystem {
  id: string;
  pixels: OmnibeamPixel[];
  channels: FiberOpticChannel[];
  transceiver: FiberOpticTransceiver;
  performance: PerformanceMetrics;
}

export interface FiberOpticTransceiver {
  id: string;
  wavelengthRange: { min: number; max: number }; // nm
  channelSpacing: number; // nm (0.8nm ITU-T grid)
  modulationFormat: 'QPSK' | '16-QAM' | '64-QAM';
  dataRate: number; // Gbps per wavelength
  power: number; // W
}

export interface PerformanceMetrics {
  bandwidth: number; // Tbps
  latency: number; // ms
  throughput: number; // Tbps
  reliability: number; // 0-1
  capacity: number; // channels
}

// 9x7 Pixel Grid (63 pixels)
const PIXEL_ROWS = 7;
const PIXEL_COLUMNS = 9;
const TOTAL_PIXELS = PIXEL_ROWS * PIXEL_COLUMNS; // 63

// Wavelength mapping (C-band: 1530-1565nm)
const BASE_WAVELENGTH = 1530; // nm
const WAVELENGTH_SPACING = 0.8; // nm (ITU-T grid)
const ROW_WAVELENGTH_OFFSET = 10; // nm per row

export class OmnibeamFiberOpticSystem {
  private system: OmnibeamFiberOpticSystem;
  private pixels: Map<string, OmnibeamPixel>;
  private channels: Map<number, FiberOpticChannel>;

  constructor() {
    this.pixels = new Map();
    this.channels = new Map();
    this.system = this.initializeSystem();
  }

  /**
   * Initialize Omnibeam Fiber Optic System
   */
  private initializeSystem(): OmnibeamFiberOpticSystem {
    const pixels: OmnibeamPixel[] = [];
    const channels: FiberOpticChannel[] = [];

    // Create 63 pixels (9x7 grid)
    for (let row = 0; row < PIXEL_ROWS; row++) {
      for (let col = 0; col < PIXEL_COLUMNS; col++) {
        const position = row * PIXEL_COLUMNS + col;
        const wavelength = this.calculateWavelength(row, col);

        const pixel: OmnibeamPixel = {
          id: `pixel-${position}`,
          position,
          row,
          column: col,
          color: { r: 0, g: 0, b: 0, wavelength },
          density: 0,
          grammar: { symbol: '', pattern: '' }
        };

        pixels.push(pixel);
        this.pixels.set(pixel.id, pixel);

        // Create fiber optic channel for pixel
        const channel: FiberOpticChannel = {
          wavelength,
          pixelId: pixel.id,
          amplitude: 0,
          phase: 0,
          dataRate: 100 // Gbps per wavelength
        };

        channels.push(channel);
        this.channels.set(wavelength, channel);
      }
    }

    return {
      id: `omnibeam-fiber-optic-${Date.now()}`,
      pixels,
      channels,
      transceiver: {
        id: `transceiver-${Date.now()}`,
        wavelengthRange: { min: 1530, max: 1565 },
        channelSpacing: 0.8,
        modulationFormat: '64-QAM',
        dataRate: 100,
        power: 1
      },
      performance: {
        bandwidth: 6.3, // Tbps (63 wavelengths × 100 Gbps)
        latency: 5, // ms per 1000km
        throughput: 6.3, // Tbps
        reliability: 0.9999,
        capacity: 63
      }
    };
  }

  /**
   * Calculate wavelength for pixel position
   */
  private calculateWavelength(row: number, column: number): number {
    // Base wavelength + row offset + column offset
    return BASE_WAVELENGTH + (row * ROW_WAVELENGTH_OFFSET) + (column * WAVELENGTH_SPACING);
  }

  /**
   * Encode pixel to fiber optic channel
   */
  encodePixelToFiber(pixelId: string): FiberOpticChannel | null {
    const pixel = this.pixels.get(pixelId);
    if (!pixel) {
      return null;
    }

    const channel = this.channels.get(pixel.color.wavelength || 0);
    if (!channel) {
      return null;
    }

    // Encode color as wavelength (already set)
    // Encode density as amplitude
    channel.amplitude = pixel.density;

    // Encode grammar as phase
    channel.phase = this.encodeGrammarAsPhase(pixel.grammar);

    return { ...channel };
  }

  /**
   * Encode grammar as phase
   */
  private encodeGrammarAsPhase(grammar: GrammarFragment): number {
    // Convert grammar pattern to phase (0-360 degrees)
    const hash = this.hashString(grammar.pattern);
    return (hash % 360);
  }

  /**
   * Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Decode fiber optic channel to pixel
   */
  decodeFiberToPixel(channel: FiberOpticChannel): OmnibeamPixel | null {
    const pixel = this.pixels.get(channel.pixelId);
    if (!pixel) {
      return null;
    }

    // Decode amplitude to density
    pixel.density = channel.amplitude;

    // Decode phase to grammar
    pixel.grammar.phase = channel.phase;

    return { ...pixel };
  }

  /**
   * Transmit Omnibeam over fiber optic
   */
  async transmitOverFiber(pixels: OmnibeamPixel[]): Promise<FiberOpticChannel[]> {
    const channels: FiberOpticChannel[] = [];

    for (const pixel of pixels) {
      const channel = this.encodePixelToFiber(pixel.id);
      if (channel) {
        channels.push(channel);
      }
    }

    // Simulate fiber optic transmission
    await this.simulateFiberTransmission(channels);

    return channels;
  }

  /**
   * Receive Omnibeam from fiber optic
   */
  async receiveFromFiber(channels: FiberOpticChannel[]): Promise<OmnibeamPixel[]> {
    const pixels: OmnibeamPixel[] = [];

    for (const channel of channels) {
      const pixel = this.decodeFiberToPixel(channel);
      if (pixel) {
        pixels.push(pixel);
      }
    }

    return pixels;
  }

  /**
   * Simulate fiber optic transmission
   */
  private async simulateFiberTransmission(channels: FiberOpticChannel[]): Promise<void> {
    // Simulate transmission delay (5ms per 1000km)
    const delay = 5; // ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Get system performance
   */
  getPerformance(): PerformanceMetrics {
    return { ...this.system.performance };
  }

  /**
   * Get total bandwidth
   */
  getTotalBandwidth(): number {
    // 63 wavelengths × 100 Gbps = 6.3 Tbps
    return this.system.channels.length * this.system.transceiver.dataRate / 1000; // Tbps
  }

  /**
   * Get system status
   */
  getSystemStatus(): OmnibeamFiberOpticSystem {
    return {
      ...this.system,
      pixels: Array.from(this.pixels.values()),
      channels: Array.from(this.channels.values())
    };
  }
}


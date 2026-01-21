/**
 * ULTIMATE VIP CHAIRMAN CREATOR
 * Customizable personal VIP package system
 * Users create their own themed experiences
 * El Taino is just ONE example configuration
 */

export interface VehicleConfig {
  type: string; // e.g., "1962 Safari Land Cruiser FJ40"
  name: string; // e.g., "El Taino"
  color: string; // e.g., "Beige Heritage"
  style: string; // e.g., "Safari Expedition"
  description: string;
  missions?: string[];
  nftIncluded: boolean; // Tier 5 benefit
}

export interface AestheticConfig {
  theme: string; // e.g., "Count of Monte Cristo × Royal Lodge Frontier"
  primaryStyle: string; // e.g., "Classical Luxury"
  secondaryStyle: string; // e.g., "Frontier Adventure"
  colorPalette: {
    primary: string[]; // Hex codes
    secondary: string[];
    accent: string[];
  };
  materials: string[]; // e.g., ["Persian Rugs", "Brass", "Leather", "Mahogany"]
  lighting: {
    type: string; // e.g., "Warm Amber"
    temperature: string; // e.g., "2700K"
    features: string[];
  };
}

export interface CuratedItem {
  id: string;
  name: string;
  category: string; // e.g., "Map", "Compass", "Book", "Art"
  description: string;
  icon: string; // Emoji or icon
  resonanceValue: number; // How much it tunes their BBHE (0-100)
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface SpaceConfig {
  name: string; // e.g., "Man Cave", "Studio", "Sanctuary", "Lair"
  type: string; // e.g., "Royal Lodge", "Modern Loft", "Zen Garden"
  rooms: {
    id: string;
    name: string;
    description: string;
    features: string[];
  }[];
  specialFeatures: string[];
}

export interface ChairmanPackageConfig {
  // Identity
  heroName: string; // User's chosen hero name
  username: string; // Their username
  
  // Vehicle
  vehicle: VehicleConfig;
  
  // Aesthetic
  aesthetic: AestheticConfig;
  
  // Space
  space: SpaceConfig;
  
  // Curated Items (what resonates with THEM)
  curatedItems: CuratedItem[];
  
  // BBHE Tuning
  bbheFrequency: number; // Hz (e.g., 432, 528, custom)
  bbheSignature: string; // Their unique frequency signature
  
  // Package Metadata
  createdAt: Date;
  lastUpdated: Date;
  version: string;
}

export class UltimateVIPCreator {
  /**
   * Create a new personalized Chairman package
   */
  createPackage(userInputs: Partial<ChairmanPackageConfig>): ChairmanPackageConfig {
    return {
      heroName: userInputs.heroName || 'Chairman',
      username: userInputs.username || 'user',
      vehicle: userInputs.vehicle || this.getDefaultVehicle(),
      aesthetic: userInputs.aesthetic || this.getDefaultAesthetic(),
      space: userInputs.space || this.getDefaultSpace(),
      curatedItems: userInputs.curatedItems || [],
      bbheFrequency: userInputs.bbheFrequency || 432,
      bbheSignature: userInputs.bbheSignature || this.generateBBHESignature(),
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Get example configurations (for inspiration)
   */
  getExampleConfigs(): Record<string, ChairmanPackageConfig> {
    return {
      'el-taino': this.getElTainoConfig(),
      'cyber-punk': this.getCyberPunkConfig(),
      'zen-master': this.getZenMasterConfig(),
      'space-explorer': this.getSpaceExplorerConfig()
    };
  }

  /**
   * El Taino Configuration (Example 1 - User's Personal Setup)
   */
  private getElTainoConfig(): ChairmanPackageConfig {
    return {
      heroName: 'El Taino',
      username: 'el-taino',
      
      vehicle: {
        type: '1962 Safari Land Cruiser FJ40',
        name: 'El Taino',
        color: 'Beige Heritage (Desert Tan)',
        style: 'Safari Expedition Ready',
        description: 'Museum Quality, 64 years of proven excellence. Every mission tells a story.',
        missions: [
          'Serengeti Expedition 1965',
          'Amazon Basin Survey 1972',
          'Sahara Crossing 1978',
          'Patagonia Trek 1985'
        ],
        nftIncluded: true
      },
      
      aesthetic: {
        theme: 'Count of Monte Cristo × Royal Lodge Frontier',
        primaryStyle: 'Classical Mediterranean Luxury',
        secondaryStyle: 'Safari Frontier Adventure',
        colorPalette: {
          primary: ['#D4C4A8', '#800020', '#FFD700', '#FFBF00'],
          secondary: ['#4E2A1E', '#715C4A', '#8B8680', '#000080'],
          accent: ['#B5A642', '#F8F8FF', '#FF4500', '#C19A6B']
        },
        materials: [
          'Hand-Woven Persian Rugs',
          'Vintage Brass Hardware',
          'Premium Leather',
          'Hand-Carved Mahogany',
          'Natural Stone',
          'Crystal Glass'
        ],
        lighting: {
          type: 'Warm Amber Firelight',
          temperature: '2700K',
          features: [
            'Edison Bulbs',
            'Brass Banker Lamps',
            'Moroccan Lanterns',
            'Fireplace Glow'
          ]
        }
      },
      
      space: {
        name: 'The Count\'s Safari Lodge',
        type: 'Royal Lodge Man Cave',
        rooms: [
          {
            id: 'persian-lounge',
            name: 'Persian Rug Lounge',
            description: 'Layered hand-woven rugs, deep leather seating',
            features: ['Fireplace', 'Bar Cart', 'Reading Chairs']
          },
          {
            id: 'library',
            name: 'Adventure Library',
            description: 'First edition books, leather journals',
            features: ['Floor-to-ceiling shelves', 'Writing desk', 'Globe collection']
          },
          {
            id: 'observatory',
            name: 'Stargazing Observatory',
            description: 'Antique telescopes and brass instruments',
            features: ['Vintage telescopes', 'Star charts', 'Compass collection']
          }
        ],
        specialFeatures: [
          'Stone Fireplace (Always Ready)',
          'Vintage Globe Bar Cart',
          'Moroccan Leather Poufs',
          'Mission-Style Reading Chairs',
          'Hidden Technology Integration'
        ]
      },
      
      curatedItems: [
        {
          id: 'safari-maps',
          name: 'Vintage Safari Maps',
          category: 'Navigation',
          description: 'Framed expedition charts from actual missions',
          icon: '🗺️',
          resonanceValue: 95,
          rarity: 'legendary'
        },
        {
          id: 'brass-compass',
          name: 'Antique Brass Compass',
          category: 'Navigation',
          description: '19th century navigation tool',
          icon: '🧭',
          resonanceValue: 92,
          rarity: 'rare'
        },
        {
          id: 'leather-journals',
          name: 'Hand-Bound Journals',
          category: 'Documentation',
          description: 'Adventure logs from every mission',
          icon: '📚',
          resonanceValue: 88,
          rarity: 'rare'
        },
        {
          id: 'decanters',
          name: 'Crystal Decanters',
          category: 'Refinement',
          description: 'Finest spirits collection',
          icon: '🍷',
          resonanceValue: 85,
          rarity: 'uncommon'
        },
        {
          id: 'oil-paintings',
          name: 'Frontier Oil Paintings',
          category: 'Art',
          description: 'Landscape masterpieces',
          icon: '🎨',
          resonanceValue: 90,
          rarity: 'rare'
        },
        {
          id: 'tribal-carvings',
          name: 'African Wood Carvings',
          category: 'Art',
          description: 'Tribal heritage pieces',
          icon: '🪵',
          resonanceValue: 87,
          rarity: 'rare'
        },
        {
          id: 'telescopes',
          name: 'Vintage Telescopes',
          category: 'Exploration',
          description: 'Antique stargazing instruments',
          icon: '🔭',
          resonanceValue: 91,
          rarity: 'rare'
        },
        {
          id: 'first-editions',
          name: 'First Edition Books',
          category: 'Literature',
          description: 'Adventure classics collection',
          icon: '📖',
          resonanceValue: 89,
          rarity: 'rare'
        }
      ],
      
      bbheFrequency: 432, // Natural resonance
      bbheSignature: 'ELTN-432-ROYAL-FRONTIER-1962',
      
      createdAt: new Date('2026-01-21'),
      lastUpdated: new Date('2026-01-21'),
      version: '1.0.0'
    };
  }

  /**
   * Cyber Punk Configuration (Example 2)
   */
  private getCyberPunkConfig(): ChairmanPackageConfig {
    return {
      heroName: 'Neon Samurai',
      username: 'cyber-samurai',
      
      vehicle: {
        type: '2077 Hoverbike',
        name: 'Ghost Runner',
        color: 'Neon Blue Chrome',
        style: 'Cyber Street Racer',
        description: 'Quantum-powered, holographic interface, zero-gravity capable',
        nftIncluded: true
      },
      
      aesthetic: {
        theme: 'Cyberpunk × Japanese Minimalism',
        primaryStyle: 'Neon Tech',
        secondaryStyle: 'Zen Minimalism',
        colorPalette: {
          primary: ['#00FFFF', '#FF00FF', '#FFFF00'],
          secondary: ['#000000', '#1A1A1A', '#333333'],
          accent: ['#FF0000', '#00FF00', '#0000FF']
        },
        materials: ['Chrome', 'Neon Tubes', 'Holographic Panels', 'Carbon Fiber'],
        lighting: {
          type: 'Dynamic Neon',
          temperature: '6500K',
          features: ['RGB Strips', 'Holographic Projections', 'Reactive Lighting']
        }
      },
      
      space: {
        name: 'The Neon Dojo',
        type: 'Cyber Sanctuary',
        rooms: [
          {
            id: 'main-deck',
            name: 'Main Deck',
            description: 'Holographic interface center',
            features: ['360° displays', 'Neural interface', 'Quantum processors']
          }
        ],
        specialFeatures: ['Holographic Training', 'AI Assistant', 'Quantum Network']
      },
      
      curatedItems: [
        {
          id: 'katana',
          name: 'Plasma Katana',
          category: 'Weapon',
          description: 'Energy blade with traditional craftsmanship',
          icon: '⚔️',
          resonanceValue: 95,
          rarity: 'legendary'
        }
      ],
      
      bbheFrequency: 528, // Love frequency
      bbheSignature: 'NEON-528-CYBER-ZEN-2077',
      
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Zen Master Configuration (Example 3)
   */
  private getZenMasterConfig(): ChairmanPackageConfig {
    return {
      heroName: 'The Tranquil One',
      username: 'zen-master',
      
      vehicle: {
        type: 'Silent Electric Bicycle',
        name: 'Harmony',
        color: 'Natural Bamboo',
        style: 'Minimalist Zen',
        description: 'Hand-crafted bamboo frame, whisper-quiet motor',
        nftIncluded: true
      },
      
      aesthetic: {
        theme: 'Japanese Zen × Scandinavian Minimalism',
        primaryStyle: 'Wabi-Sabi Simplicity',
        secondaryStyle: 'Nordic Clean',
        colorPalette: {
          primary: ['#F5F5DC', '#8B7355', '#2F4F4F'],
          secondary: ['#FFFFFF', '#E8E8E8', '#D3D3D3'],
          accent: ['#228B22', '#CD853F', '#4682B4']
        },
        materials: ['Bamboo', 'Natural Stone', 'White Oak', 'Rice Paper', 'Linen'],
        lighting: {
          type: 'Soft Natural',
          temperature: '3000K',
          features: ['Rice Paper Lanterns', 'Indirect Lighting', 'Candles']
        }
      },
      
      space: {
        name: 'The Meditation Sanctuary',
        type: 'Zen Garden',
        rooms: [
          {
            id: 'meditation-hall',
            name: 'Meditation Hall',
            description: 'Tatami mats, shoji screens',
            features: ['Rock garden view', 'Tea ceremony area', 'Altar']
          }
        ],
        specialFeatures: ['Indoor Rock Garden', 'Water Features', 'Bonsai Collection']
      },
      
      curatedItems: [
        {
          id: 'singing-bowl',
          name: 'Tibetan Singing Bowl',
          category: 'Sound',
          description: 'Hand-hammered bronze, perfect tone',
          icon: '🔔',
          resonanceValue: 98,
          rarity: 'legendary'
        }
      ],
      
      bbheFrequency: 396, // Liberation frequency
      bbheSignature: 'ZEN-396-TRANQUIL-HARMONY-OM',
      
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Space Explorer Configuration (Example 4)
   */
  private getSpaceExplorerConfig(): ChairmanPackageConfig {
    return {
      heroName: 'Stellar Navigator',
      username: 'star-captain',
      
      vehicle: {
        type: 'Interstellar Shuttle',
        name: 'Voyager Prime',
        color: 'Deep Space Black with Star Field',
        style: 'Explorer Class',
        description: 'FTL-capable, quantum navigation, AI co-pilot',
        nftIncluded: true
      },
      
      aesthetic: {
        theme: 'Space Age × Retro Futurism',
        primaryStyle: 'Starship Bridge',
        secondaryStyle: '1960s NASA',
        colorPalette: {
          primary: ['#000033', '#0066CC', '#FFFFFF'],
          secondary: ['#C0C0C0', '#FFD700', '#FF6347'],
          accent: ['#00CED1', '#FF1493', '#7FFF00']
        },
        materials: ['Brushed Aluminum', 'Titanium', 'LED Panels', 'Acrylic'],
        lighting: {
          type: 'Star Field',
          temperature: '5000K',
          features: ['LED Star Map', 'Control Panel Glow', 'Navigation Lights']
        }
      },
      
      space: {
        name: 'The Command Bridge',
        type: 'Starship Captain\'s Quarters',
        rooms: [
          {
            id: 'bridge',
            name: 'Command Bridge',
            description: 'Full navigation and control center',
            features: ['Panoramic viewport', 'Holographic star charts', 'AI interface']
          }
        ],
        specialFeatures: ['Zero-G Simulator', 'Planetarium Ceiling', 'Telescope Array']
      },
      
      curatedItems: [
        {
          id: 'star-charts',
          name: 'Holographic Star Charts',
          category: 'Navigation',
          description: 'Real-time galactic map',
          icon: '🌌',
          resonanceValue: 96,
          rarity: 'legendary'
        }
      ],
      
      bbheFrequency: 639, // Connection frequency
      bbheSignature: 'STAR-639-VOYAGER-PRIME-FTL',
      
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Get default configurations (generic/starter)
   */
  private getDefaultVehicle(): VehicleConfig {
    return {
      type: 'Personal Vehicle',
      name: 'Your Ride',
      color: 'Custom',
      style: 'Your Style',
      description: 'Describe your ideal vehicle',
      nftIncluded: false
    };
  }

  private getDefaultAesthetic(): AestheticConfig {
    return {
      theme: 'Your Unique Theme',
      primaryStyle: 'Primary Style',
      secondaryStyle: 'Secondary Style',
      colorPalette: {
        primary: ['#000000'],
        secondary: ['#FFFFFF'],
        accent: ['#FF0000']
      },
      materials: [],
      lighting: {
        type: 'Custom',
        temperature: '3000K',
        features: []
      }
    };
  }

  private getDefaultSpace(): SpaceConfig {
    return {
      name: 'Your Space',
      type: 'Custom',
      rooms: [],
      specialFeatures: []
    };
  }

  /**
   * Generate unique BBHE signature
   */
  private generateBBHESignature(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `BBHE-${timestamp}-${random}`;
  }

  /**
   * Save package configuration
   */
  async savePackage(config: ChairmanPackageConfig): Promise<string> {
    // In production, save to database/blockchain
    const packageId = `pkg-${config.username}-${Date.now()}`;
    console.log(`📦 Saved Chairman Package: ${packageId}`);
    return packageId;
  }

  /**
   * Load package configuration
   */
  async loadPackage(packageId: string): Promise<ChairmanPackageConfig | null> {
    // In production, load from database/blockchain
    console.log(`📦 Loading Chairman Package: ${packageId}`);
    return null;
  }

  /**
   * Update existing package
   */
  async updatePackage(
    packageId: string,
    updates: Partial<ChairmanPackageConfig>
  ): Promise<ChairmanPackageConfig | null> {
    // In production, update in database/blockchain
    console.log(`📦 Updating Chairman Package: ${packageId}`);
    return null;
  }

  /**
   * Generate HTML interface for package
   */
  generateInterface(config: ChairmanPackageConfig): string {
    // Generate custom HTML based on user's configuration
    return `
      <!-- Dynamically generated interface for ${config.heroName} -->
      <div class="chairman-package" data-theme="${config.aesthetic.theme}">
        <h1>${config.heroName}'s ${config.space.name}</h1>
        <div class="vehicle">${config.vehicle.name} - ${config.vehicle.type}</div>
        <!-- ... rest of interface dynamically generated ... -->
      </div>
    `;
  }

  /**
   * Generate prospectus document for package
   */
  generateProspectus(config: ChairmanPackageConfig): string {
    // Generate custom markdown prospectus
    return `
# ${config.heroName} - Ultimate VIP Chairman Package

**Vehicle**: ${config.vehicle.type} "${config.vehicle.name}"
**Aesthetic**: ${config.aesthetic.theme}
**Space**: ${config.space.name}
**BBHE Frequency**: ${config.bbheFrequency} Hz

## Your Curated Collection

${config.curatedItems.map(item => `- ${item.icon} **${item.name}**: ${item.description}`).join('\n')}

## Your Space

${config.space.rooms.map(room => `### ${room.name}\n${room.description}`).join('\n\n')}

---

*This is YOUR unique Chairman package. No one else has this exact configuration.*
`;
  }
}

// Global instance
export const ultimateVIPCreator = new UltimateVIPCreator();

// Convenience functions
export function createChairmanPackage(userInputs: Partial<ChairmanPackageConfig>): ChairmanPackageConfig {
  return ultimateVIPCreator.createPackage(userInputs);
}

export function getExamplePackages(): Record<string, ChairmanPackageConfig> {
  return ultimateVIPCreator.getExampleConfigs();
}

export function generateCustomInterface(config: ChairmanPackageConfig): string {
  return ultimateVIPCreator.generateInterface(config);
}

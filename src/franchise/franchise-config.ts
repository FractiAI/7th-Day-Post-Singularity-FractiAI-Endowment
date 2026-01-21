/**
 * FRANCHISE CONFIGURATION SYSTEM
 * Fully configurable, not hard-coded
 * Any franchise can be created and customized
 */

export interface FranchiseConfig {
  configId: string;
  franchiseName: string;
  brandName: string;
  description: string;
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  owner: {
    name: string;
    email: string;
    company?: string;
  };
  contactInfo: {
    website?: string;
    phone?: string;
    email: string;
    supportEmail?: string;
  };
  packages: {
    enabled: ('club-only' | 'club-cabaret' | 'full-wine-cave' | 'ultimate-package')[];
    customPricing?: {
      [key: string]: {
        initial?: number;
        franchiseFee?: number;
        royalty?: number;
      };
    };
  };
  features: {
    sportsBetting: boolean;
    casino: boolean;
    consciousnessMenu: boolean;
    champagneRooms: boolean;
    fetishSuites: boolean;
    companionSystem: boolean;
    magazineCapture: boolean;
  };
  customization: {
    allowBrandCustomization: boolean;
    allowPackageModification: boolean;
    customFeaturesAvailable: boolean;
  };
  legal: {
    jurisdictions: string[];
    complianceNotes?: string;
    requiresLicensing: boolean;
  };
}

/**
 * Franchise Configuration Manager
 */
export class FranchiseConfigManager {
  private configs: Map<string, FranchiseConfig> = new Map();
  private activeConfig?: string;

  constructor() {
    this.initializeDefaultConfigs();
  }

  /**
   * Initialize some example franchise configs
   */
  private initializeDefaultConfigs(): void {
    // Generic "Club + Cabaret" template
    this.addConfig({
      configId: 'default-club-cabaret',
      franchiseName: 'Club + Cabaret Experience',
      brandName: 'The Experience Empire',
      description: 'Premium entertainment franchise with sports betting, casino, and VIP experiences',
      colors: {
        primary: '#D4AF37',
        secondary: '#9370DB',
        accent: '#FFD700'
      },
      owner: {
        name: 'Franchise Owner',
        email: 'owner@example.com'
      },
      contactInfo: {
        email: 'franchise@example.com',
        supportEmail: 'support@example.com'
      },
      packages: {
        enabled: ['club-only', 'club-cabaret', 'full-wine-cave', 'ultimate-package']
      },
      features: {
        sportsBetting: true,
        casino: true,
        consciousnessMenu: true,
        champagneRooms: true,
        fetishSuites: true,
        companionSystem: true,
        magazineCapture: true
      },
      customization: {
        allowBrandCustomization: true,
        allowPackageModification: true,
        customFeaturesAvailable: true
      },
      legal: {
        jurisdictions: ['Global'],
        requiresLicensing: true
      }
    });

    // Sports-focused template
    this.addConfig({
      configId: 'sports-betting-club',
      franchiseName: 'Sports Betting Club',
      brandName: 'The Betting Lounge',
      description: 'Sports betting focused franchise with AI agents and premium club atmosphere',
      colors: {
        primary: '#1a472a',
        secondary: '#2e7d32',
        accent: '#4caf50'
      },
      owner: {
        name: 'Sports Franchise Owner',
        email: 'sports@example.com'
      },
      contactInfo: {
        email: 'betting@example.com'
      },
      packages: {
        enabled: ['club-only', 'club-cabaret']
      },
      features: {
        sportsBetting: true,
        casino: true,
        consciousnessMenu: false,
        champagneRooms: true,
        fetishSuites: false,
        companionSystem: false,
        magazineCapture: false
      },
      customization: {
        allowBrandCustomization: true,
        allowPackageModification: false,
        customFeaturesAvailable: false
      },
      legal: {
        jurisdictions: ['US (where legal)', 'UK', 'EU'],
        requiresLicensing: true
      }
    });

    // Virtual/Node-focused template
    this.addConfig({
      configId: 'virtual-node-experience',
      franchiseName: 'Virtual Node Experience',
      brandName: 'VibeVerse Club',
      description: 'Virtual and hybrid deployment for node operators and digital spaces',
      colors: {
        primary: '#4A148C',
        secondary: '#7B1FA2',
        accent: '#9C27B0'
      },
      owner: {
        name: 'Virtual Franchise Owner',
        email: 'virtual@example.com'
      },
      contactInfo: {
        email: 'nodes@example.com'
      },
      packages: {
        enabled: ['club-only', 'club-cabaret', 'full-wine-cave']
      },
      features: {
        sportsBetting: true,
        casino: true,
        consciousnessMenu: true,
        champagneRooms: true,
        fetishSuites: true,
        companionSystem: true,
        magazineCapture: true
      },
      customization: {
        allowBrandCustomization: true,
        allowPackageModification: true,
        customFeaturesAvailable: true
      },
      legal: {
        jurisdictions: ['Virtual spaces', 'Blockchain networks'],
        requiresLicensing: false
      }
    });

    console.log(`✅ ${this.configs.size} franchise configurations initialized`);
  }

  /**
   * Add a new franchise configuration
   */
  addConfig(config: FranchiseConfig): void {
    this.configs.set(config.configId, config);
    console.log(`✅ Franchise config added: ${config.franchiseName}`);
  }

  /**
   * Update existing configuration
   */
  updateConfig(configId: string, updates: Partial<FranchiseConfig>): FranchiseConfig {
    const existing = this.configs.get(configId);
    if (!existing) {
      throw new Error('Configuration not found');
    }

    const updated = { ...existing, ...updates };
    this.configs.set(configId, updated);
    return updated;
  }

  /**
   * Set active configuration
   */
  setActiveConfig(configId: string): void {
    if (!this.configs.has(configId)) {
      throw new Error('Configuration not found');
    }
    this.activeConfig = configId;
    console.log(`✅ Active franchise config set to: ${configId}`);
  }

  /**
   * Get active configuration
   */
  getActiveConfig(): FranchiseConfig | undefined {
    if (!this.activeConfig) return undefined;
    return this.configs.get(this.activeConfig);
  }

  /**
   * Get all configurations
   */
  getAllConfigs(): FranchiseConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Get configuration by ID
   */
  getConfig(configId: string): FranchiseConfig | undefined {
    return this.configs.get(configId);
  }

  /**
   * Create custom configuration from template
   */
  createCustomConfig(
    baseConfigId: string,
    customization: {
      franchiseName: string;
      brandName: string;
      owner: FranchiseConfig['owner'];
      contactInfo: FranchiseConfig['contactInfo'];
      colors?: FranchiseConfig['colors'];
      enabledPackages?: FranchiseConfig['packages']['enabled'];
      features?: Partial<FranchiseConfig['features']>;
    }
  ): FranchiseConfig {
    const baseConfig = this.configs.get(baseConfigId);
    if (!baseConfig) {
      throw new Error('Base configuration not found');
    }

    const newConfigId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const customConfig: FranchiseConfig = {
      ...baseConfig,
      configId: newConfigId,
      franchiseName: customization.franchiseName,
      brandName: customization.brandName,
      owner: customization.owner,
      contactInfo: customization.contactInfo,
      colors: customization.colors || baseConfig.colors,
      packages: {
        ...baseConfig.packages,
        enabled: customization.enabledPackages || baseConfig.packages.enabled
      },
      features: {
        ...baseConfig.features,
        ...customization.features
      }
    };

    this.addConfig(customConfig);
    return customConfig;
  }

  /**
   * Delete configuration
   */
  deleteConfig(configId: string): boolean {
    if (this.activeConfig === configId) {
      this.activeConfig = undefined;
    }
    return this.configs.delete(configId);
  }

  /**
   * Export configuration (for sharing/backup)
   */
  exportConfig(configId: string): string {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error('Configuration not found');
    }
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration (from JSON)
   */
  importConfig(configJson: string): FranchiseConfig {
    const config = JSON.parse(configJson) as FranchiseConfig;
    this.addConfig(config);
    return config;
  }
}

/**
 * Global franchise config manager
 */
export const franchiseConfigManager = new FranchiseConfigManager();

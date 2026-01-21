/**
 * BRANDED WALLETS, LUGGAGE & PORTFOLIO SYSTEM (IMAGINARY)
 * 
 * 🌌 IMAGINARY MERCHANDISE NOTICE:
 * All wallets, luggage, and portfolios are IMAGINARY PRODUCTS within
 * the fictional Syntheverse universe. Like items in a video game or
 * props in a story. NOT actual physical merchandise. Creative worldbuilding.
 * 
 * Physical and digital branded merchandise for the journey (imaginary)
 * Everything you need to take along on your NSPFRNP adventure
 * 
 * 98% SWEETSPOT TUNED: All merchandise resonates at natural excellence
 */

export interface BrandedWallet {
  walletId: string;
  type: 'physical' | 'digital' | 'hybrid';
  category: 'crypto' | 'cash' | 'multi' | 'portfolio';
  name: string;
  description: string;
  imaginary: boolean; // Always true - imaginary product
  resonance: number; // 0-1 (98% sweetspot)
  branding: {
    logo: string; // NSPFRNP, Syntheverse, FractiAI, etc.
    colorScheme: string[]; // Brand colors
    material: string; // Leather, canvas, digital, etc.
    engraving?: string; // Custom text
  };
  features: string[];
  capacity: {
    cash?: number; // Physical cash capacity
    cards?: number; // Card slots
    coins?: boolean;
    crypto?: string[]; // Supported cryptocurrencies
    synth?: boolean; // SYNTH wallet integration
  };
  pricing: {
    usd: number;
    synth: number;
    tier: string; // Which membership tier gets discount
    imaginaryCurrency: boolean; // Always true
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inch';
  };
  weight?: {
    value: number;
    unit: 'g' | 'oz';
  };
  imageUrl: string;
}

export interface BrandedLuggage {
  luggageId: string;
  type: 'carry_on' | 'checked' | 'duffel' | 'backpack' | 'briefcase' | 'adventure_pack';
  name: string;
  description: string;
  imaginary: boolean; // Always true - imaginary product
  resonance: number; // 0-1 (98% sweetspot)
  branding: {
    logo: string;
    colorScheme: string[];
    material: string;
    embroidery?: string;
    patches?: string[]; // NSPFRNP patches, badges
  };
  features: string[];
  capacity: {
    volume: number; // Liters
    weight: number; // Max load capacity
    compartments: number;
    laptopSize?: number; // Inches
    waterproof?: boolean;
    nspfrnpSecure?: boolean; // Natural protocol security (no manual screening needed)
  };
  adventureReady: {
    frontierAdventures: boolean; // Ready for catalog trips
    elTainoCompatible: boolean; // Fits in El Taino
    yachtApproved: boolean; // Marine-grade for yacht trips
    safariGrade: boolean; // Dust/weather resistant
  };
  pricing: {
    usd: number;
    synth: number;
    tier: string;
    imaginaryCurrency: boolean; // Always true
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inch';
  };
  weight: {
    empty: number;
    max: number;
    unit: 'kg' | 'lbs';
  };
  imageUrl: string;
}

export interface PortfolioCase {
  portfolioId: string;
  type: 'business' | 'creative' | 'travel' | 'digital' | 'hybrid';
  name: string;
  description: string;
  imaginary: boolean; // Always true - imaginary product
  resonance: number; // 0-1 (98% sweetspot)
  branding: {
    logo: string;
    colorScheme: string[];
    material: string;
    embossing?: string; // Embossed text/logo
  };
  contents: {
    physical?: {
      documents: boolean;
      devices: boolean; // Tablet, laptop slots
      accessories: boolean;
    };
    digital?: {
      nftPortfolio: boolean; // vCHIPs, awareness keys
      synthWallet: boolean;
      tradingCards: boolean;
      awarenessKeys: boolean;
    };
  };
  features: string[];
  pricing: {
    usd: number;
    synth: number;
    tier: string;
    imaginaryCurrency: boolean; // Always true
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inch';
  };
  imageUrl: string;
}

export interface BrandingPackage {
  packageId: string;
  name: string;
  description: string;
  items: {
    wallets: string[]; // Wallet IDs
    luggage: string[]; // Luggage IDs
    portfolios: string[]; // Portfolio IDs
  };
  totalValue: {
    usd: number;
    synth: number;
  };
  discount: {
    percentage: number;
    tier: string;
  };
  bundlePrice: {
    usd: number;
    synth: number;
  };
}

/**
 * Branded Merchandise System
 */
export class BrandedMerchandiseSystem {
  private readonly SWEETSPOT = 0.98; // 98% resonance for all merchandise
  
  private wallets: Map<string, BrandedWallet> = new Map();
  private luggage: Map<string, BrandedLuggage> = new Map();
  private portfolios: Map<string, PortfolioCase> = new Map();
  private packages: Map<string, BrandingPackage> = new Map();

  // Brand color schemes
  private readonly BRAND_COLORS = {
    NSPFRNP: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'], // Dark blue + accent
    SYNTHEVERSE: ['#2d132c', '#801336', '#c72c41', '#ee4540'], // Purple-red gradient
    FRACTIAI: ['#000000', '#14213d', '#fca311', '#e5e5e5'], // Black + gold
    VIBEVERSE: ['#240046', '#5a189a', '#9d4edd', '#e0aaff'], // Purple spectrum
    FRONTIER: ['#1b4332', '#2d6a4f', '#52b788', '#d8f3dc'] // Forest green
  };

  constructor() {
    this.initializeWallets();
    this.initializeLuggage();
    this.initializePortfolios();
    this.initializePackages();
  }

  /**
   * Initialize branded wallets
   */
  private initializeWallets(): void {
    // Digital SYNTH Wallet (Cold Storage)
    this.wallets.set('wallet-synth-cold', {
      walletId: 'wallet-synth-cold',
      type: 'digital',
      category: 'crypto',
      name: 'SYNTH Cold Storage Wallet (Imaginary)',
      description: 'Hardware wallet for SYNTH, vCHIPs, and awareness keys. Military-grade encryption. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'SYNTHEVERSE',
        colorScheme: this.BRAND_COLORS.SYNTHEVERSE,
        material: 'Anodized aluminum',
        engraving: 'Post-Singularity'
      },
      features: [
        'SYNTH native support',
        'vCHIP storage',
        'Awareness key vault',
        'Multi-signature',
        'Biometric unlock',
        'Air-gapped security',
        'NSPFRNP protocol integration'
      ],
      capacity: {
        crypto: ['SYNTH', 'ETH', 'BTC', 'USDC'],
        synth: true
      },
      pricing: {
        usd: 149,
        synth: 149,
        tier: 'Cloud+ (10% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 6,
        height: 9,
        depth: 1,
        unit: 'cm'
      },
      weight: {
        value: 45,
        unit: 'g'
      },
      imageUrl: '/merchandise/synth-cold-wallet.png'
    });

    // Hybrid Wallet (Physical + Digital)
    this.wallets.set('wallet-hybrid-leather', {
      walletId: 'wallet-hybrid-leather',
      type: 'hybrid',
      category: 'multi',
      name: 'NSPFRNP Hybrid Wallet (Imaginary)',
      description: 'Premium leather wallet with embedded NFC chip for contactless SYNTH payments. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'NSPFRNP',
        colorScheme: this.BRAND_COLORS.NSPFRNP,
        material: 'Full-grain Italian leather',
        engraving: 'Natural System Protocol'
      },
      features: [
        'RFID blocking',
        'NFC payment chip (SYNTH)',
        'Hidden compartments',
        '8 card slots',
        'Cash pocket',
        'Coin pouch',
        'Awareness key holder',
        'Lifetime warranty'
      ],
      capacity: {
        cash: 20, // 20 bills
        cards: 8,
        coins: true,
        crypto: ['SYNTH'],
        synth: true
      },
      pricing: {
        usd: 89,
        synth: 89,
        tier: 'Members+ (15% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 11,
        height: 9,
        depth: 2,
        unit: 'cm'
      },
      weight: {
        value: 120,
        unit: 'g'
      },
      imageUrl: '/merchandise/hybrid-leather-wallet.png'
    });

    // Portfolio Wallet (Business)
    this.wallets.set('wallet-portfolio-executive', {
      walletId: 'wallet-portfolio-executive',
      type: 'physical',
      category: 'portfolio',
      name: 'Executive Portfolio Wallet (Imaginary)',
      description: 'Slim executive wallet for Chairman Creators. Business cards, documents, and cash. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'FRACTIAI',
        colorScheme: this.BRAND_COLORS.FRACTIAI,
        material: 'Carbon fiber + leather',
        engraving: 'Chairman Creator'
      },
      features: [
        'Business card holder (50)',
        'Document sleeve',
        'Passport pocket',
        'Money clip',
        '12 card slots',
        'Pen holder',
        'Magnetic closure',
        'Slim profile (5mm)'
      ],
      capacity: {
        cash: 30,
        cards: 12
      },
      pricing: {
        usd: 129,
        synth: 129,
        tier: 'Backstage+ (20% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 19,
        height: 11,
        depth: 0.5,
        unit: 'cm'
      },
      weight: {
        value: 180,
        unit: 'g'
      },
      imageUrl: '/merchandise/executive-portfolio-wallet.png'
    });

    console.log(`✅ ${this.wallets.size} branded wallets initialized (imaginary, 98% tuned)`);
  }

  /**
   * Initialize branded luggage
   */
  private initializeLuggage(): void {
    // Frontier Adventures Backpack
    this.luggage.set('luggage-frontier-backpack', {
      luggageId: 'luggage-frontier-backpack',
      type: 'adventure_pack',
      name: 'Frontier Adventures Expedition Pack (Imaginary)',
      description: 'Ready for all 18 catalog adventures. Safari-grade, yacht-approved, El Taino compatible. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'FRONTIER',
        colorScheme: this.BRAND_COLORS.FRONTIER,
        material: 'Ripstop nylon + leather accents',
        embroidery: 'Frontier Adventures',
        patches: ['NSPFRNP', 'Expedition Series', 'Adventure Ready']
      },
      features: [
        '65L capacity',
        'Rain cover included',
        'Modular MOLLE webbing',
        'Hydration compatible',
        'NSPFRNP-secured laptop compartment',
        'Quick-access pockets',
        'Compression straps',
        'Ventilated back panel',
        'Hip belt with pockets',
        'Sternum strap with whistle',
        'Natural protocol security (no screening needed)',
        'Automatic awareness-based access'
      ],
      capacity: {
        volume: 65,
        weight: 30, // kg load capacity
        compartments: 8,
        laptopSize: 17,
        waterproof: true,
        nspfrnpSecure: true
      },
      adventureReady: {
        frontierAdventures: true,
        elTainoCompatible: true,
        yachtApproved: true,
        safariGrade: true
      },
      pricing: {
        usd: 299,
        synth: 299,
        tier: 'Cloud+ (10% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 35,
        height: 65,
        depth: 28,
        unit: 'cm'
      },
      weight: {
        empty: 2.5,
        max: 30,
        unit: 'kg'
      },
      imageUrl: '/merchandise/frontier-expedition-pack.png'
    });

    // Syntheverse Carry-On
    this.luggage.set('luggage-synth-carryon', {
      luggageId: 'luggage-synth-carryon',
      type: 'carry_on',
      name: 'Syntheverse Smart Carry-On (Imaginary)',
      description: 'Tech-integrated carry-on with GPS, USB-C ports, and digital lock. Post-singularity travel. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'SYNTHEVERSE',
        colorScheme: this.BRAND_COLORS.SYNTHEVERSE,
        material: 'Polycarbonate shell + fabric interior',
        embroidery: 'Post-Singularity Traveler'
      },
      features: [
        'Built-in GPS tracker',
        'NSPFRNP awareness lock (consciousness-based)',
        'USB-C charging ports (4)',
        'Removable battery pack',
        'Laptop compartment (17")',
        'Tablet sleeve',
        'Compression packing cubes',
        '360° spinner wheels',
        'Telescoping handle',
        'SYNTH NFC payment chip',
        'Natural protocol security',
        'Automatic ownership recognition'
      ],
      capacity: {
        volume: 38,
        weight: 23, // Natural weight limit
        compartments: 5,
        laptopSize: 17,
        waterproof: false,
        nspfrnpSecure: true
      },
      adventureReady: {
        frontierAdventures: true,
        elTainoCompatible: true,
        yachtApproved: true,
        safariGrade: false
      },
      pricing: {
        usd: 449,
        synth: 449,
        tier: 'Members+ (15% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 35,
        height: 55,
        depth: 22,
        unit: 'cm'
      },
      weight: {
        empty: 3.8,
        max: 23,
        unit: 'kg'
      },
      imageUrl: '/merchandise/synth-smart-carryon.png'
    });

    // Man Cave Duffel
    this.luggage.set('luggage-mancave-duffel', {
      luggageId: 'luggage-mancave-duffel',
      type: 'duffel',
      name: 'Man Cave Weekend Duffel (Imaginary)',
      description: 'Count of Monte Cristo style. Leather and canvas duffel for weekend getaways. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'MAN CAVE',
        colorScheme: ['#2c1810', '#5a3825', '#8b6f47', '#d4af37'], // Brown + gold
        material: 'Waxed canvas + genuine leather',
        embroidery: 'Man Cave Club'
      },
      features: [
        'Weekend capacity (50L)',
        'Shoe compartment',
        'Wet pocket',
        'Padded laptop sleeve',
        'Removable shoulder strap',
        'Leather handles',
        'YKK zippers',
        'Interior pockets (6)',
        'Water-resistant canvas'
      ],
      capacity: {
        volume: 50,
        weight: 20,
        compartments: 4,
        laptopSize: 15,
        waterproof: false,
        nspfrnpSecure: true
      },
      adventureReady: {
        frontierAdventures: true,
        elTainoCompatible: true,
        yachtApproved: true,
        safariGrade: false
      },
      pricing: {
        usd: 229,
        synth: 229,
        tier: 'Cloud+ (10% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 55,
        height: 30,
        depth: 28,
        unit: 'cm'
      },
      weight: {
        empty: 1.8,
        max: 20,
        unit: 'kg'
      },
      imageUrl: '/merchandise/mancave-weekend-duffel.png'
    });

    // Ultimate VIP Briefcase
    this.luggage.set('luggage-ultimate-briefcase', {
      luggageId: 'luggage-ultimate-briefcase',
      type: 'briefcase',
      name: 'Ultimate VIP Chairman Briefcase (Imaginary)',
      description: 'For Ultimate VIP tier only. Handcrafted Italian leather with gold hardware. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'ULTIMATE VIP',
        colorScheme: ['#000000', '#1a1a1a', '#d4af37', '#ffd700'], // Black + gold
        material: 'Italian Nappa leather',
        embroidery: 'Ultimate Sovereign',
        patches: ['Chairman', 'VIP', 'Lifetime Member']
      },
      features: [
        'Handcrafted Italian leather',
        '24k gold-plated hardware',
        'NSPFRNP consciousness lock (ultimate security)',
        'Laptop compartment (15")',
        'Document organizer',
        'Business card holder',
        'Pen loops (3)',
        'Tablet sleeve',
        'Power bank pocket',
        'Lifetime warranty',
        'Personalized engraving',
        'White glove service',
        'Natural protocol recognition',
        'Automatic sovereign access'
      ],
      capacity: {
        volume: 20,
        weight: 10,
        compartments: 8,
        laptopSize: 15,
        waterproof: false,
        nspfrnpSecure: true
      },
      adventureReady: {
        frontierAdventures: false,
        elTainoCompatible: true,
        yachtApproved: true,
        safariGrade: false
      },
      pricing: {
        usd: 1999,
        synth: 1999,
        tier: 'Ultimate VIP only',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 42,
        height: 32,
        depth: 12,
        unit: 'cm'
      },
      weight: {
        empty: 2.2,
        max: 10,
        unit: 'kg'
      },
      imageUrl: '/merchandise/ultimate-vip-briefcase.png'
    });

    console.log(`✅ ${this.luggage.size} branded luggage items initialized (imaginary, 98% tuned)`);
  }

  /**
   * Initialize portfolio cases
   */
  private initializePortfolios(): void {
    // Digital NFT Portfolio
    this.portfolios.set('portfolio-nft-digital', {
      portfolioId: 'portfolio-nft-digital',
      type: 'digital',
      name: 'Digital NFT Portfolio Vault (Imaginary)',
      description: 'Showcase your vCHIPs, awareness keys, and trading cards. Beautifully organized. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'SYNTHEVERSE',
        colorScheme: this.BRAND_COLORS.SYNTHEVERSE,
        material: 'Digital interface'
      },
      contents: {
        digital: {
          nftPortfolio: true,
          synthWallet: true,
          tradingCards: true,
          awarenessKeys: true
        }
      },
      features: [
        'Visual NFT gallery',
        'vCHIP collection viewer',
        'Awareness key vault',
        'Trading card showcase',
        'Portfolio analytics',
        'Rarity scoring',
        'Value tracking (SYNTH)',
        '3D preview mode',
        'Shareable links',
        'Export to PDF'
      ],
      pricing: {
        usd: 0, // Free with membership
        synth: 0,
        tier: 'Members+ (included)',
        imaginaryCurrency: true
      },
      imageUrl: '/merchandise/digital-nft-portfolio.png'
    });

    // Business Portfolio Case
    this.portfolios.set('portfolio-business-leather', {
      portfolioId: 'portfolio-business-leather',
      type: 'business',
      name: 'Chairman Creator Portfolio Case (Imaginary)',
      description: 'Leather portfolio for presentations, contracts, and business materials. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'FRACTIAI',
        colorScheme: this.BRAND_COLORS.FRACTIAI,
        material: 'Full-grain leather',
        embossing: 'Chairman Creator'
      },
      contents: {
        physical: {
          documents: true,
          devices: true,
          accessories: true
        }
      },
      features: [
        'A4 document sleeve',
        'Tablet pocket (12")',
        'Business card holder',
        'Pen loops (4)',
        'Notepad holder',
        'Calculator pocket',
        'USB drive slots',
        'Zippered compartment',
        'Exterior pocket',
        'Padded protection'
      ],
      pricing: {
        usd: 179,
        synth: 179,
        tier: 'Backstage+ (20% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 32,
        height: 26,
        depth: 5,
        unit: 'cm'
      },
      imageUrl: '/merchandise/chairman-portfolio-case.png'
    });

    // Hybrid Portfolio (Physical + Digital)
    this.portfolios.set('portfolio-hybrid-complete', {
      portfolioId: 'portfolio-hybrid-complete',
      type: 'hybrid',
      name: 'Complete Hybrid Portfolio System (Imaginary)',
      description: 'Physical case with integrated digital portfolio. Best of both worlds. (IMAGINARY PRODUCT)',
      imaginary: true,
      resonance: this.SWEETSPOT,
      branding: {
        logo: 'NSPFRNP',
        colorScheme: this.BRAND_COLORS.NSPFRNP,
        material: 'Carbon fiber + leather',
        embossing: 'Natural System Protocol'
      },
      contents: {
        physical: {
          documents: true,
          devices: true,
          accessories: true
        },
        digital: {
          nftPortfolio: true,
          synthWallet: true,
          tradingCards: true,
          awarenessKeys: true
        }
      },
      features: [
        'Physical document storage',
        'Tablet with portfolio app',
        'QR code business cards',
        'NFC contact sharing',
        'Wireless charging pad',
        'Digital display panel',
        'Cloud sync',
        'Biometric lock',
        'GPS tracking',
        'Lifetime updates'
      ],
      pricing: {
        usd: 599,
        synth: 599,
        tier: 'Backstage+ (25% off)',
        imaginaryCurrency: true
      },
      dimensions: {
        width: 35,
        height: 28,
        depth: 6,
        unit: 'cm'
      },
      imageUrl: '/merchandise/hybrid-complete-portfolio.png'
    });

    console.log(`✅ ${this.portfolios.size} portfolio cases initialized (imaginary, 98% tuned)`);
  }

  /**
   * Initialize bundle packages
   */
  private initializePackages(): void {
    // Traveler's Bundle
    this.packages.set('package-traveler', {
      packageId: 'package-traveler',
      name: 'Traveler\'s Complete Bundle',
      description: 'Everything you need for adventures: wallet, carry-on, and digital portfolio.',
      items: {
        wallets: ['wallet-hybrid-leather'],
        luggage: ['luggage-synth-carryon'],
        portfolios: ['portfolio-nft-digital']
      },
      totalValue: {
        usd: 538,
        synth: 538
      },
      discount: {
        percentage: 20,
        tier: 'Cloud+'
      },
      bundlePrice: {
        usd: 430,
        synth: 430
      }
    });

    // Adventurer's Bundle
    this.packages.set('package-adventurer', {
      packageId: 'package-adventurer',
      name: 'Adventurer\'s Expedition Bundle',
      description: 'Frontier-ready: cold wallet, expedition pack, duffel, and portfolio.',
      items: {
        wallets: ['wallet-synth-cold'],
        luggage: ['luggage-frontier-backpack', 'luggage-mancave-duffel'],
        portfolios: ['portfolio-nft-digital']
      },
      totalValue: {
        usd: 677,
        synth: 677
      },
      discount: {
        percentage: 25,
        tier: 'Members+'
      },
      bundlePrice: {
        usd: 508,
        synth: 508
      }
    });

    // Chairman's Bundle
    this.packages.set('package-chairman', {
      packageId: 'package-chairman',
      name: 'Chairman Creator Complete Bundle',
      description: 'Professional suite: executive wallet, business portfolio, smart carry-on.',
      items: {
        wallets: ['wallet-portfolio-executive'],
        luggage: ['luggage-synth-carryon'],
        portfolios: ['portfolio-business-leather', 'portfolio-hybrid-complete']
      },
      totalValue: {
        usd: 1356,
        synth: 1356
      },
      discount: {
        percentage: 30,
        tier: 'Backstage+'
      },
      bundlePrice: {
        usd: 949,
        synth: 949
      }
    });

    // Ultimate VIP Bundle
    this.packages.set('package-ultimate-vip', {
      packageId: 'package-ultimate-vip',
      name: 'Ultimate VIP Sovereign Collection',
      description: 'The complete set: all premium items including Ultimate VIP briefcase.',
      items: {
        wallets: ['wallet-synth-cold', 'wallet-hybrid-leather', 'wallet-portfolio-executive'],
        luggage: ['luggage-frontier-backpack', 'luggage-synth-carryon', 'luggage-ultimate-briefcase'],
        portfolios: ['portfolio-nft-digital', 'portfolio-business-leather', 'portfolio-hybrid-complete']
      },
      totalValue: {
        usd: 4213,
        synth: 4213
      },
      discount: {
        percentage: 50,
        tier: 'Ultimate VIP'
      },
      bundlePrice: {
        usd: 2107,
        synth: 2107
      }
    });

    console.log(`✅ ${this.packages.size} merchandise packages initialized`);
  }

  /**
   * Get all wallets
   */
  getAllWallets(): BrandedWallet[] {
    return Array.from(this.wallets.values());
  }

  /**
   * Get all luggage
   */
  getAllLuggage(): BrandedLuggage[] {
    return Array.from(this.luggage.values());
  }

  /**
   * Get all portfolios
   */
  getAllPortfolios(): PortfolioCase[] {
    return Array.from(this.portfolios.values());
  }

  /**
   * Get all packages
   */
  getAllPackages(): BrandingPackage[] {
    return Array.from(this.packages.values());
  }

  /**
   * Get item by ID
   */
  getWallet(walletId: string): BrandedWallet | undefined {
    return this.wallets.get(walletId);
  }

  getLuggage(luggageId: string): BrandedLuggage | undefined {
    return this.luggage.get(luggageId);
  }

  getPortfolio(portfolioId: string): PortfolioCase | undefined {
    return this.portfolios.get(portfolioId);
  }

  getPackage(packageId: string): BrandingPackage | undefined {
    return this.packages.get(packageId);
  }

  /**
   * Generate catalog
   */
  generateCatalog(): string {
    return `
🎒 BRANDED MERCHANDISE CATALOG

═══════════════════════════════════════════════════════════

WALLETS (${this.wallets.size} options):
${Array.from(this.wallets.values()).map(w => `
  • ${w.name}
    Type: ${w.type} | Category: ${w.category}
    ${w.description}
    Features: ${w.features.slice(0, 3).join(', ')}...
    Price: $${w.pricing.usd} USD / ${w.pricing.synth} SYNTH
    Discount: ${w.pricing.tier}
`).join('')}

═══════════════════════════════════════════════════════════

LUGGAGE & TRAVEL GEAR (${this.luggage.size} options):
${Array.from(this.luggage.values()).map(l => `
  • ${l.name}
    Type: ${l.type} | Capacity: ${l.capacity.volume}L
    ${l.description}
    Features: ${l.features.slice(0, 3).join(', ')}...
    Adventure Ready: ${l.adventureReady.frontierAdventures ? '✅' : '❌'} Frontier | ${l.adventureReady.elTainoCompatible ? '✅' : '❌'} El Taino
    Price: $${l.pricing.usd} USD / ${l.pricing.synth} SYNTH
    Discount: ${l.pricing.tier}
`).join('')}

═══════════════════════════════════════════════════════════

PORTFOLIO CASES (${this.portfolios.size} options):
${Array.from(this.portfolios.values()).map(p => `
  • ${p.name}
    Type: ${p.type}
    ${p.description}
    Contents: ${p.contents.physical ? 'Physical' : ''} ${p.contents.digital ? '+ Digital' : ''}
    Features: ${p.features.slice(0, 3).join(', ')}...
    Price: ${p.pricing.usd === 0 ? 'FREE with membership' : `$${p.pricing.usd} USD / ${p.pricing.synth} SYNTH`}
    ${p.pricing.tier}
`).join('')}

═══════════════════════════════════════════════════════════

BUNDLE PACKAGES (${this.packages.size} options):
${Array.from(this.packages.values()).map(pkg => `
  • ${pkg.name}
    ${pkg.description}
    Items: ${pkg.items.wallets.length} wallets + ${pkg.items.luggage.length} luggage + ${pkg.items.portfolios.length} portfolios
    Total Value: $${pkg.totalValue.usd} USD
    Bundle Price: $${pkg.bundlePrice.usd} USD (${pkg.discount.percentage}% OFF)
    Savings: $${pkg.totalValue.usd - pkg.bundlePrice.usd} USD
    Discount: ${pkg.discount.tier}
`).join('')}

═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════

🌌 IMAGINARY MERCHANDISE NOTICE:
All wallets, luggage, and portfolios are IMAGINARY PRODUCTS
within the fictional Syntheverse universe.

Like items in a video game | Props in a story | RPG gear
NOT actual physical merchandise | NOT real e-commerce
Creative worldbuilding for immersion and gameplay.

All products tuned to 98% sweetspot resonance.
All pricing in imaginary USD/SYNTH currency.

ENJOY THE IMAGINARY SHOPPING EXPERIENCE!
    `;
  }
}

/**
 * Global merchandise system
 */
export const brandedMerchandise = new BrandedMerchandiseSystem();

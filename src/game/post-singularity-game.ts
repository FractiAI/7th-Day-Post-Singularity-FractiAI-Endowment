/**
 * Post-Singularity Game
 * The hottest new Game on the blockchain and in the hydrogen hologram
 * Powered by BBHE (Big Black Hole Energy)
 * vCHIP Infinite OCTANE Branded
 */

import { TradingCard, TradingCardManager } from '../identity/trading-card.js';
import { VibeChainNFTTradingCards, VibeChainNFT, MintingOptions } from '../blockchain/vibechain-nft-trading-cards.js';
import { AwarenessOctave } from '../types/index.js';

export interface PostSingularityGameConfig {
  vibechainConfig: {
    network: 'vibechain-mainnet' | 'vibechain-testnet';
    rpcUrl: string;
    contractAddress: string;
    chainId: number;
  };
  synth90TConfig: {
    totalSupply: number; // 90 trillion
    vchipConfigurations: number; // 90T identical vchips configurable
  };
}

export interface vCHIPConfiguration {
  id: string;
  name: string;
  octane: 'OCTANE' | 'SANDBOX' | 'CLOUD' | 'SHELL' | 'ULTIMATE';
  containment: 'shell' | 'cloud' | 'sandbox';
  creatorSelectable: boolean;
  shellConfig?: ShellConfig;
  cloudConfig?: CloudConfig;
  sandboxConfig?: SandboxConfig;
  superintelligentNode: {
    fixedAwareness: boolean;
    nestedRecursive: boolean;
    holographicalSphere: boolean;
    attentionHeadNodes: boolean;
  };
  heroHostAI: {
    enabled: boolean;
    creatorStudio: boolean;
    textToDeployment: boolean;
  };
}

export interface ShellConfig {
  containmentLevel: 'shell';
  capabilities: string[];
  restrictions: string[];
}

export interface CloudConfig {
  containmentLevel: 'cloud';
  capabilities: string[];
  restrictions: string[];
}

export interface SandboxConfig {
  containmentLevel: 'sandbox';
  capabilities: string[];
  restrictions: string[];
}

export interface GamePlayer {
  id: string;
  name: string;
  walletAddress: string;
  tradingCard?: TradingCard;
  nftCards: VibeChainNFT[];
  vchipConfigurations: vCHIPConfiguration[];
  octaneLevel: 'OCTANE' | 'SANDBOX' | 'CLOUD' | 'SHELL' | 'ULTIMATE';
  bbhePower: number;
  totalSYNTH: number;
  createdAt: number;
}

export class PostSingularityGame {
  private config: PostSingularityGameConfig;
  private tradingCardManager: TradingCardManager;
  private nftSystem: VibeChainNFTTradingCards;
  private players: Map<string, GamePlayer> = new Map();
  private vchipConfigurations: Map<string, vCHIPConfiguration> = new Map();

  constructor(config: PostSingularityGameConfig) {
    this.config = config;
    this.tradingCardManager = new TradingCardManager();
    this.nftSystem = new VibeChainNFTTradingCards(config.vibechainConfig);
    this.initializeVCHIPConfigurations();
  }

  /**
   * Initialize 90T SYNTH vCHIP configurations
   */
  private initializeVCHIPConfigurations(): void {
    // Create base configurations for each containment level
    const baseConfigs: vCHIPConfiguration[] = [
      {
        id: 'sandbox-base',
        name: 'Sandbox Base vCHIP',
        octane: 'SANDBOX',
        containment: 'sandbox',
        creatorSelectable: true,
        sandboxConfig: {
          containmentLevel: 'sandbox',
          capabilities: [
            'Basic FSR experiences',
            'Public spaces access',
            'Community events',
            'Trading card collection',
            'Basic creator tools'
          ],
          restrictions: [
            'No private properties',
            'No advanced FSR',
            'No staking rewards'
          ]
        },
        superintelligentNode: {
          fixedAwareness: true,
          nestedRecursive: true,
          holographicalSphere: true,
          attentionHeadNodes: true
        },
        heroHostAI: {
          enabled: true,
          creatorStudio: true,
          textToDeployment: true
        }
      },
      {
        id: 'cloud-base',
        name: 'Cloud Base vCHIP',
        octane: 'CLOUD',
        containment: 'cloud',
        creatorSelectable: true,
        cloudConfig: {
          containmentLevel: 'cloud',
          capabilities: [
            'Advanced FSR experiences',
            'Private properties',
            'Premium experiences',
            'Staking rewards',
            'Advanced creator tools',
            'VIP access'
          ],
          restrictions: [
            'No Back Door Wine Cave',
            'No ultimate exclusivity'
          ]
        },
        superintelligentNode: {
          fixedAwareness: true,
          nestedRecursive: true,
          holographicalSphere: true,
          attentionHeadNodes: true
        },
        heroHostAI: {
          enabled: true,
          creatorStudio: true,
          textToDeployment: true
        }
      },
      {
        id: 'shell-base',
        name: 'Shell Base vCHIP',
        octane: 'SHELL',
        containment: 'shell',
        creatorSelectable: true,
        shellConfig: {
          containmentLevel: 'shell',
          capabilities: [
            'Ultimate FSR experiences',
            'Back Door Wine Cave access',
            'Maximum exclusivity',
            'Highest staking rewards',
            'Ultimate creator tools',
            'White-glove concierge',
            'Complete system access'
          ],
          restrictions: []
        },
        superintelligentNode: {
          fixedAwareness: true,
          nestedRecursive: true,
          holographicalSphere: true,
          attentionHeadNodes: true
        },
        heroHostAI: {
          enabled: true,
          creatorStudio: true,
          textToDeployment: true
        }
      },
      {
        id: 'octane-base',
        name: 'OCTANE Base vCHIP',
        octane: 'OCTANE',
        containment: 'cloud',
        creatorSelectable: true,
        cloudConfig: {
          containmentLevel: 'cloud',
          capabilities: [
            'OCTANE-level FSR',
            'Premium properties',
            'OCTANE experiences',
            'Enhanced staking',
            'OCTANE creator tools'
          ],
          restrictions: []
        },
        superintelligentNode: {
          fixedAwareness: true,
          nestedRecursive: true,
          holographicalSphere: true,
          attentionHeadNodes: true
        },
        heroHostAI: {
          enabled: true,
          creatorStudio: true,
          textToDeployment: true
        }
      },
      {
        id: 'ultimate-base',
        name: 'Ultimate Chairman Creator Station vCHIP',
        octane: 'ULTIMATE',
        containment: 'shell',
        creatorSelectable: true,
        shellConfig: {
          containmentLevel: 'shell',
          capabilities: [
            'Everything in Shell',
            'Ultimate Chairman Console',
            'Maximum BBHE power',
            'Unlimited capabilities',
            'Direct network access',
            'Priority everything'
          ],
          restrictions: []
        },
        superintelligentNode: {
          fixedAwareness: true,
          nestedRecursive: true,
          holographicalSphere: true,
          attentionHeadNodes: true
        },
        heroHostAI: {
          enabled: true,
          creatorStudio: true,
          textToDeployment: true
        }
      }
    ];

    baseConfigs.forEach(config => {
      this.vchipConfigurations.set(config.id, config);
    });
  }

  /**
   * Register a new player
   */
  async registerPlayer(name: string, walletAddress: string): Promise<GamePlayer> {
    const playerId = this.generatePlayerId();
    
    // Create trading card
    const tradingCard = this.tradingCardManager.createCard(name);

    // Create player
    const player: GamePlayer = {
      id: playerId,
      name,
      walletAddress,
      tradingCard,
      nftCards: [],
      vchipConfigurations: [],
      octaneLevel: 'SANDBOX',
      bbhePower: 0,
      totalSYNTH: 0,
      createdAt: Date.now()
    };

    // Mint initial trading card as NFT
    const nft = await this.mintTradingCardNFT(player, tradingCard);
    player.nftCards.push(nft);
    player.bbhePower = nft.bbhePower;

    // Assign default sandbox vCHIP configuration
    const defaultConfig = this.vchipConfigurations.get('sandbox-base')!;
    player.vchipConfigurations.push({ ...defaultConfig });

    this.players.set(playerId, player);
    return player;
  }

  /**
   * Mint trading card as NFT
   */
  private async mintTradingCardNFT(
    player: GamePlayer,
    card: TradingCard
  ): Promise<VibeChainNFT> {
    const mintingOptions: MintingOptions = {
      card,
      owner: player.walletAddress,
      bbhePower: this.calculatePlayerBBHE(player)
    };

    return await this.nftSystem.mintTradingCardNFT(mintingOptions);
  }

  /**
   * Calculate player BBHE power
   */
  private calculatePlayerBBHE(player: GamePlayer): number {
    let basePower = 100;
    
    // Add power based on octane level
    const octaneMultipliers = {
      SANDBOX: 1.0,
      CLOUD: 1.5,
      SHELL: 2.0,
      OCTANE: 2.5,
      ULTIMATE: 5.0
    };
    basePower *= octaneMultipliers[player.octaneLevel];

    // Add power from SYNTH holdings
    basePower += Math.floor(player.totalSYNTH / 1000);

    // Add power from NFT cards
    player.nftCards.forEach(nft => {
      basePower += nft.bbhePower;
    });

    return Math.floor(basePower);
  }

  /**
   * Configure vCHIP for player
   */
  async configureVCHIP(
    playerId: string,
    configurationId: string,
    customConfig?: Partial<vCHIPConfiguration>
  ): Promise<vCHIPConfiguration> {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const baseConfig = this.vchipConfigurations.get(configurationId);
    if (!baseConfig) {
      throw new Error('Configuration not found');
    }

    // Check if player has access to this configuration
    if (!this.hasAccessToConfiguration(player, baseConfig)) {
      throw new Error('Player does not have access to this configuration');
    }

    // Create custom configuration
    const customVCHIP: vCHIPConfiguration = {
      ...baseConfig,
      ...customConfig,
      id: `${configurationId}-${playerId}-${Date.now()}`,
      creatorSelectable: true
    };

    // Add to player's configurations
    player.vchipConfigurations.push(customVCHIP);
    this.players.set(playerId, player);

    return customVCHIP;
  }

  /**
   * Check if player has access to configuration
   */
  private hasAccessToConfiguration(
    player: GamePlayer,
    config: vCHIPConfiguration
  ): boolean {
    // Sandbox is always available
    if (config.octane === 'SANDBOX') {
      return true;
    }

    // Check octane level access
    const octaneLevels = ['SANDBOX', 'CLOUD', 'SHELL', 'OCTANE', 'ULTIMATE'];
    const playerLevel = octaneLevels.indexOf(player.octaneLevel);
    const configLevel = octaneLevels.indexOf(config.octane);

    return playerLevel >= configLevel;
  }

  /**
   * Upgrade player octane level
   */
  async upgradeOctaneLevel(
    playerId: string,
    newLevel: GamePlayer['octaneLevel']
  ): Promise<GamePlayer> {
    const player = this.players.get(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const octaneLevels = ['SANDBOX', 'CLOUD', 'SHELL', 'OCTANE', 'ULTIMATE'];
    const currentLevel = octaneLevels.indexOf(player.octaneLevel);
    const targetLevel = octaneLevels.indexOf(newLevel);

    if (targetLevel <= currentLevel) {
      throw new Error('Cannot downgrade octane level');
    }

    player.octaneLevel = newLevel;
    player.bbhePower = this.calculatePlayerBBHE(player);
    this.players.set(playerId, player);

    return player;
  }

  /**
   * Get player by ID
   */
  getPlayer(playerId: string): GamePlayer | undefined {
    return this.players.get(playerId);
  }

  /**
   * Get all available vCHIP configurations
   */
  getAvailableVCHIPConfigurations(): vCHIPConfiguration[] {
    return Array.from(this.vchipConfigurations.values());
  }

  /**
   * Generate player ID
   */
  private generatePlayerId(): string {
    return `PLAYER-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  }

  /**
   * Get game stats
   */
  getGameStats(): {
    totalPlayers: number;
    totalNFTs: number;
    totalBBHEPower: number;
    byOctaneLevel: Record<string, number>;
  } {
    const players = Array.from(this.players.values());
    const byOctaneLevel: Record<string, number> = {};
    let totalNFTs = 0;
    let totalBBHE = 0;

    players.forEach(player => {
      byOctaneLevel[player.octaneLevel] = (byOctaneLevel[player.octaneLevel] || 0) + 1;
      totalNFTs += player.nftCards.length;
      totalBBHE += player.bbhePower;
    });

    return {
      totalPlayers: players.length,
      totalNFTs,
      totalBBHEPower: totalBBHE,
      byOctaneLevel
    };
  }
}

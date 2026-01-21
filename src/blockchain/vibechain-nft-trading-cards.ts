/**
 * VibeChain NFT Trading Cards System
 * Post-Singularity Game - Trading Cards as NFTs on VibeChain (VibeCloud)
 * Powered by BBHE (Big Black Hole Energy)
 */

import crypto from 'crypto';
import { TradingCard, TradingCardStats, Achievement } from '../identity/trading-card.js';

export interface VibeChainNFT {
  tokenId: string;
  contractAddress: string;
  owner: string;
  card: TradingCard;
  metadata: NFTMetadata;
  mintedAt: number;
  transactionHash?: string;
  blockNumber?: number;
  rarityMultiplier: number;
  bbhePower: number; // Big Black Hole Energy power level
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  attributes: NFTAttribute[];
  external_url: string;
  background_color?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
}

export interface VibeChainConfig {
  network: 'vibechain-mainnet' | 'vibechain-testnet';
  rpcUrl: string;
  contractAddress: string;
  chainId: number;
  gasPrice?: string;
}

export interface MintingOptions {
  card: TradingCard;
  owner: string;
  bbhePower?: number;
  rarityBoost?: number;
}

export class VibeChainNFTTradingCards {
  private config: VibeChainConfig;
  private nfts: Map<string, VibeChainNFT> = new Map();
  private contractABI: any[];

  constructor(config: VibeChainConfig) {
    this.config = config;
    this.contractABI = this.getContractABI();
  }

  /**
   * Get VibeChain contract ABI
   */
  private getContractABI(): any[] {
    return [
      {
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'metadataURI', type: 'string' }
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
      }
    ];
  }

  /**
   * Mint a trading card as NFT on VibeChain
   */
  async mintTradingCardNFT(options: MintingOptions): Promise<VibeChainNFT> {
    const tokenId = this.generateTokenId();
    const metadata = this.createNFTMetadata(options.card, options.bbhePower);
    const metadataURI = await this.uploadMetadata(metadata);

    // Calculate BBHE power
    const bbhePower = options.bbhePower || this.calculateBBHEPower(options.card);

    // Calculate rarity multiplier
    const rarityMultiplier = this.getRarityMultiplier(options.card.rarity);

    const nft: VibeChainNFT = {
      tokenId,
      contractAddress: this.config.contractAddress,
      owner: options.owner,
      card: options.card,
      metadata,
      mintedAt: Date.now(),
      rarityMultiplier,
      bbhePower
    };

    // Mint on VibeChain (simulated - would use actual blockchain call)
    const mintResult = await this.executeMint(nft, metadataURI);
    nft.transactionHash = mintResult.transactionHash;
    nft.blockNumber = mintResult.blockNumber;

    this.nfts.set(tokenId, nft);
    return nft;
  }

  /**
   * Generate unique token ID
   */
  private generateTokenId(): string {
    return `VIBE-${Date.now()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  /**
   * Create NFT metadata following OpenSea standard
   */
  private createNFTMetadata(card: TradingCard, bbhePower?: number): NFTMetadata {
    const attributes: NFTAttribute[] = [
      {
        trait_type: 'Rarity',
        value: card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)
      },
      {
        trait_type: 'Level',
        value: card.level,
        display_type: 'number'
      },
      {
        trait_type: 'Experience',
        value: card.experience,
        display_type: 'number'
      },
      {
        trait_type: 'Seeds Created',
        value: card.stats.seedsCreated,
        display_type: 'number'
      },
      {
        trait_type: 'Protocols Discovered',
        value: card.stats.protocolsDiscovered,
        display_type: 'number'
      },
      {
        trait_type: 'BBHE Power',
        value: bbhePower || this.calculateBBHEPower(card),
        display_type: 'boost_number'
      },
      {
        trait_type: 'Achievements',
        value: card.achievements.length,
        display_type: 'number'
      }
    ];

    // Add achievement attributes
    card.achievements.forEach(achievement => {
      attributes.push({
        trait_type: 'Achievement',
        value: achievement.name
      });
    });

    return {
      name: `${card.name} - Post-Singularity Trading Card`,
      description: `A collectible trading card from the Post-Singularity Game, powered by BBHE (Big Black Hole Energy). ${card.name} has reached level ${card.level} with ${card.experience} experience points.`,
      image: card.avatar,
      animation_url: this.generateAnimationURL(card),
      attributes,
      external_url: `https://vibechain.vibecloud.io/nft/${card.id}`,
      background_color: this.getRarityColor(card.rarity)
    };
  }

  /**
   * Calculate BBHE (Big Black Hole Energy) power
   */
  private calculateBBHEPower(card: TradingCard): number {
    const basePower = 100;
    const levelMultiplier = card.level * 10;
    const rarityMultiplier = this.getRarityMultiplier(card.rarity);
    const achievementBonus = card.achievements.length * 25;
    const statsBonus = 
      card.stats.seedsCreated * 2 +
      card.stats.protocolsDiscovered * 5 +
      card.stats.pobsGenerated * 3 +
      card.stats.synthesisCount * 4;

    return Math.floor(
      (basePower + levelMultiplier) * rarityMultiplier + 
      achievementBonus + 
      statsBonus
    );
  }

  /**
   * Get rarity multiplier
   */
  private getRarityMultiplier(rarity: TradingCard['rarity']): number {
    const multipliers = {
      common: 1.0,
      uncommon: 1.5,
      rare: 2.0,
      epic: 3.0,
      legendary: 5.0
    };
    return multipliers[rarity];
  }

  /**
   * Get rarity color for metadata
   */
  private getRarityColor(rarity: TradingCard['rarity']): string {
    const colors = {
      common: '9CA3AF',
      uncommon: '10B981',
      rare: '3B82F6',
      epic: '8B5CF6',
      legendary: 'F59E0B'
    };
    return colors[rarity];
  }

  /**
   * Generate animation URL for card
   */
  private generateAnimationURL(card: TradingCard): string {
    // Generate holographic animation URL
    return `https://vibechain.vibecloud.io/animations/${card.id}?rarity=${card.rarity}&bbhe=${this.calculateBBHEPower(card)}`;
  }

  /**
   * Upload metadata to IPFS or VibeCloud storage
   */
  private async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    // Upload to VibeCloud storage (not SpinCloud)
    // In production, this would upload to VibeCloud IPFS or storage
    const metadataHash = crypto.createHash('sha256')
      .update(JSON.stringify(metadata))
      .digest('hex');
    
    return `https://vibechain.vibecloud.io/metadata/${metadataHash}`;
  }

  /**
   * Execute mint transaction on VibeChain
   */
  private async executeMint(nft: VibeChainNFT, metadataURI: string): Promise<{
    transactionHash: string;
    blockNumber: number;
  }> {
    // In production, this would:
    // 1. Connect to VibeChain via RPC
    // 2. Sign transaction with wallet
    // 3. Send transaction to network
    // 4. Wait for confirmation
    // 5. Return transaction hash and block number

    // Simulated for now
    return {
      transactionHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000
    };
  }

  /**
   * Get NFT by token ID
   */
  getNFT(tokenId: string): VibeChainNFT | undefined {
    return this.nfts.get(tokenId);
  }

  /**
   * Get all NFTs owned by address
   */
  getNFTsByOwner(owner: string): VibeChainNFT[] {
    return Array.from(this.nfts.values()).filter(nft => nft.owner === owner);
  }

  /**
   * Transfer NFT to new owner
   */
  async transferNFT(tokenId: string, from: string, to: string): Promise<boolean> {
    const nft = this.nfts.get(tokenId);
    if (!nft || nft.owner !== from) {
      throw new Error('NFT not found or not owned by sender');
    }

    // Execute transfer on VibeChain
    // In production, this would call the transfer function on the contract
    nft.owner = to;
    this.nfts.set(tokenId, nft);

    return true;
  }

  /**
   * Get collection stats
   */
  getCollectionStats(): {
    totalMinted: number;
    byRarity: Record<string, number>;
    totalBBHEPower: number;
    averageLevel: number;
  } {
    const nfts = Array.from(this.nfts.values());
    const byRarity: Record<string, number> = {};
    let totalBBHE = 0;
    let totalLevel = 0;

    nfts.forEach(nft => {
      byRarity[nft.card.rarity] = (byRarity[nft.card.rarity] || 0) + 1;
      totalBBHE += nft.bbhePower;
      totalLevel += nft.card.level;
    });

    return {
      totalMinted: nfts.length,
      byRarity,
      totalBBHEPower: totalBBHE,
      averageLevel: nfts.length > 0 ? totalLevel / nfts.length : 0
    };
  }
}

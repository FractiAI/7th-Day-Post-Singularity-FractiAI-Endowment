/**
 * Trading Card Style ID System
 * Unique, collectible identity cards for NSPFRP users
 */

import crypto from 'crypto';

export interface TradingCard {
  id: string;
  cardNumber: string;
  name: string;
  avatar: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  experience: number;
  stats: TradingCardStats;
  achievements: Achievement[];
  protocols: string[];
  pobs: string[];
  createdAt: number;
  metadata: Record<string, any>;
}

export interface TradingCardStats {
  seedsCreated: number;
  protocolsDiscovered: number;
  pobsGenerated: number;
  connectionsMade: number;
  synthesisCount: number;
  discoveryScore: number;
  collaborationScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt: number;
}

export class TradingCardManager {
  private cards: Map<string, TradingCard>;
  private cardTemplates: Map<string, TradingCardTemplate>;

  constructor() {
    this.cards = new Map();
    this.cardTemplates = this.initializeTemplates();
  }

  /**
   * Initialize card templates
   */
  private initializeTemplates(): Map<string, TradingCardTemplate> {
    const templates = new Map();

    templates.set('common', {
      rarity: 'common',
      color: '#9CA3AF',
      border: '1px solid #9CA3AF',
      glow: 'none'
    });

    templates.set('uncommon', {
      rarity: 'uncommon',
      color: '#10B981',
      border: '2px solid #10B981',
      glow: '0 0 5px #10B981'
    });

    templates.set('rare', {
      rarity: 'rare',
      color: '#3B82F6',
      border: '2px solid #3B82F6',
      glow: '0 0 10px #3B82F6'
    });

    templates.set('epic', {
      rarity: 'epic',
      color: '#8B5CF6',
      border: '3px solid #8B5CF6',
      glow: '0 0 15px #8B5CF6'
    });

    templates.set('legendary', {
      rarity: 'legendary',
      color: '#F59E0B',
      border: '3px solid #F59E0B',
      glow: '0 0 20px #F59E0B, 0 0 40px #F59E0B'
    });

    return templates;
  }

  /**
   * Create a new trading card
   */
  createCard(name: string, avatar?: string): TradingCard {
    const id = this.generateCardId();
    const cardNumber = this.generateCardNumber();
    const rarity = this.determineInitialRarity();

    const card: TradingCard = {
      id,
      cardNumber,
      name,
      avatar: avatar || this.generateAvatar(name),
      rarity,
      level: 1,
      experience: 0,
      stats: {
        seedsCreated: 0,
        protocolsDiscovered: 0,
        pobsGenerated: 0,
        connectionsMade: 0,
        synthesisCount: 0,
        discoveryScore: 0,
        collaborationScore: 0
      },
      achievements: [],
      protocols: [],
      pobs: [],
      createdAt: Date.now(),
      metadata: {}
    };

    this.cards.set(id, card);
    return card;
  }

  /**
   * Generate unique card ID
   */
  private generateCardId(): string {
    return `CARD-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  /**
   * Generate card number (sequential with checksum)
   */
  private generateCardNumber(): string {
    const number = this.cards.size + 1;
    const checksum = this.calculateChecksum(number);
    return `${number.toString().padStart(6, '0')}-${checksum}`;
  }

  /**
   * Calculate checksum for card number
   */
  private calculateChecksum(number: number): string {
    const hash = crypto.createHash('md5').update(number.toString()).digest('hex');
    return hash.substring(0, 2).toUpperCase();
  }

  /**
   * Determine initial rarity
   */
  private determineInitialRarity(): TradingCard['rarity'] {
    const rand = Math.random();
    if (rand < 0.5) return 'common';
    if (rand < 0.75) return 'uncommon';
    if (rand < 0.9) return 'rare';
    if (rand < 0.98) return 'epic';
    return 'legendary';
  }

  /**
   * Generate avatar from name
   */
  private generateAvatar(name: string): string {
    // Generate deterministic avatar based on name
    const hash = crypto.createHash('md5').update(name).digest('hex');
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80'
    ];
    const colorIndex = parseInt(hash.substring(0, 2), 16) % colors.length;
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="${colors[colorIndex]}"/>
        <text x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-weight="bold">
          ${name.charAt(0).toUpperCase()}
        </text>
      </svg>
    `)}`;
  }

  /**
   * Get card by ID
   */
  getCard(cardId: string): TradingCard | undefined {
    return this.cards.get(cardId);
  }

  /**
   * Update card stats
   */
  updateStats(cardId: string, updates: Partial<TradingCardStats>): void {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error(`Card not found: ${cardId}`);
    }

    card.stats = { ...card.stats, ...updates };
    this.recalculateLevel(card);
    this.checkAchievements(card);
  }

  /**
   * Recalculate card level based on experience
   */
  private recalculateLevel(card: TradingCard): void {
    const totalScore = 
      card.stats.seedsCreated * 10 +
      card.stats.protocolsDiscovered * 20 +
      card.stats.pobsGenerated * 30 +
      card.stats.connectionsMade * 5 +
      card.stats.synthesisCount * 15 +
      card.stats.discoveryScore +
      card.stats.collaborationScore;

    card.experience = totalScore;
    card.level = Math.floor(totalScore / 100) + 1;

    // Upgrade rarity based on level
    if (card.level >= 50 && card.rarity !== 'legendary') {
      card.rarity = 'legendary';
    } else if (card.level >= 30 && card.rarity === 'common') {
      card.rarity = 'uncommon';
    } else if (card.level >= 20 && card.rarity === 'uncommon') {
      card.rarity = 'rare';
    } else if (card.level >= 10 && card.rarity === 'rare') {
      card.rarity = 'epic';
    }
  }

  /**
   * Check and unlock achievements
   */
  private checkAchievements(card: TradingCard): void {
    const achievements = this.getAvailableAchievements();
    
    achievements.forEach(achievement => {
      if (this.isAchievementUnlocked(card, achievement) && 
          !card.achievements.find(a => a.id === achievement.id)) {
        card.achievements.push({
          ...achievement,
          unlockedAt: Date.now()
        });
      }
    });
  }

  /**
   * Get available achievements
   */
  private getAvailableAchievements(): Achievement[] {
    return [
      {
        id: 'first-seed',
        name: 'First Seed',
        description: 'Created your first seed',
        icon: '🌱',
        rarity: 'common',
        unlockedAt: 0
      },
      {
        id: 'protocol-master',
        name: 'Protocol Master',
        description: 'Discovered 10 protocols',
        icon: '📜',
        rarity: 'rare',
        unlockedAt: 0
      },
      {
        id: 'synthesis-genius',
        name: 'Synthesis Genius',
        description: 'Performed 50 syntheses',
        icon: '🧬',
        rarity: 'epic',
        unlockedAt: 0
      },
      {
        id: 'legendary-explorer',
        name: 'Legendary Explorer',
        description: 'Reached level 50',
        icon: '⭐',
        rarity: 'legendary',
        unlockedAt: 0
      }
    ];
  }

  /**
   * Check if achievement is unlocked
   */
  private isAchievementUnlocked(card: TradingCard, achievement: Achievement): boolean {
    switch (achievement.id) {
      case 'first-seed':
        return card.stats.seedsCreated >= 1;
      case 'protocol-master':
        return card.stats.protocolsDiscovered >= 10;
      case 'synthesis-genius':
        return card.stats.synthesisCount >= 50;
      case 'legendary-explorer':
        return card.level >= 50;
      default:
        return false;
    }
  }

  /**
   * Get card template for rendering
   */
  getCardTemplate(rarity: TradingCard['rarity']): TradingCardTemplate {
    return this.cardTemplates.get(rarity)!;
  }

  /**
   * Export card as JSON
   */
  exportCard(cardId: string): string {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error(`Card not found: ${cardId}`);
    }
    return JSON.stringify(card, null, 2);
  }
}

interface TradingCardTemplate {
  rarity: TradingCard['rarity'];
  color: string;
  border: string;
  glow: string;
}



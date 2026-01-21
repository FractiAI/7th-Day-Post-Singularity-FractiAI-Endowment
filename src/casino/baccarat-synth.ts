/**
 * BACCARAT WITH SYNTH
 * Classic casino baccarat (Punto Banco) using SYNTH as chips
 * Player vs Banker with traditional rules
 */

export type BaccaratBetType = 'player' | 'banker' | 'tie';

export interface BaccaratCard {
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  suit: '♠️' | '♥️' | '♦️' | '♣️';
  value: number; // 0-9 (baccarat values)
}

export interface BaccaratHand {
  cards: BaccaratCard[];
  value: number; // 0-9 (last digit)
  natural: boolean; // 8 or 9 on first two cards
}

export interface BaccaratGame {
  gameId: string;
  playerId: string;
  playerEmail: string;
  betType: BaccaratBetType;
  betAmount: number;
  playerHand: BaccaratHand;
  bankerHand: BaccaratHand;
  winner: 'player' | 'banker' | 'tie';
  payout: number;
  timestamp: Date;
}

export interface BaccaratStats {
  totalGames: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  playerWins: number;
  bankerWins: number;
  ties: number;
  naturals: number;
  netProfit: number;
}

/**
 * Baccarat Game System
 */
export class BaccaratSynth {
  private games: Map<string, BaccaratGame> = new Map();
  private playerStats: Map<string, BaccaratStats> = new Map();
  
  private readonly MIN_BET = 10; // 10 SYNTH (high roller game)
  private readonly MAX_BET = 50000; // 50K SYNTH
  private readonly HOUSE_EDGE_PLAYER = 1.24; // 1.24%
  private readonly HOUSE_EDGE_BANKER = 1.06; // 1.06% (best odds!)
  private readonly HOUSE_EDGE_TIE = 14.36; // 14.36% (bad bet)

  /**
   * Play a hand
   */
  play(
    playerId: string,
    playerEmail: string,
    betType: BaccaratBetType,
    betAmount: number
  ): BaccaratGame {
    // Validate bet
    if (betAmount < this.MIN_BET) {
      throw new Error(`Minimum bet is ${this.MIN_BET} SYNTH`);
    }
    if (betAmount > this.MAX_BET) {
      throw new Error(`Maximum bet is ${this.MAX_BET} SYNTH`);
    }

    const gameId = `BAC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Deal initial cards
    const playerHand: BaccaratHand = {
      cards: [this.drawCard(), this.drawCard()],
      value: 0,
      natural: false
    };

    const bankerHand: BaccaratHand = {
      cards: [this.drawCard(), this.drawCard()],
      value: 0,
      natural: false
    };

    // Calculate values
    this.calculateHandValue(playerHand);
    this.calculateHandValue(bankerHand);

    // Check for naturals (8 or 9)
    if (playerHand.value >= 8 || bankerHand.value >= 8) {
      playerHand.natural = playerHand.value >= 8;
      bankerHand.natural = bankerHand.value >= 8;
    } else {
      // Third card rules
      this.applyThirdCardRules(playerHand, bankerHand);
    }

    // Determine winner
    const winner = this.determineWinner(playerHand, bankerHand);

    // Calculate payout
    const payout = this.calculatePayout(betType, betAmount, winner);

    const game: BaccaratGame = {
      gameId,
      playerId,
      playerEmail,
      betType,
      betAmount,
      playerHand,
      bankerHand,
      winner,
      payout,
      timestamp: new Date()
    };

    this.games.set(gameId, game);
    this.updateStats(game);

    console.log(`🎴 Baccarat: Player ${playerHand.value} vs Banker ${bankerHand.value}`);
    console.log(`🎴 Winner: ${winner.toUpperCase()}`);
    if (payout > 0) {
      console.log(`🎴 Payout: ${payout} SYNTH`);
    }

    return game;
  }

  /**
   * Draw a card
   */
  private drawCard(): BaccaratCard {
    const ranks: BaccaratCard['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits: BaccaratCard['suit'][] = ['♠️', '♥️', '♦️', '♣️'];
    
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    
    // Calculate baccarat value
    let value = 0;
    if (rank === 'A') value = 1;
    else if (['10', 'J', 'Q', 'K'].includes(rank)) value = 0;
    else value = parseInt(rank);

    return { rank, suit, value };
  }

  /**
   * Calculate hand value (last digit only)
   */
  private calculateHandValue(hand: BaccaratHand): void {
    const total = hand.cards.reduce((sum, card) => sum + card.value, 0);
    hand.value = total % 10;
  }

  /**
   * Apply third card rules
   */
  private applyThirdCardRules(playerHand: BaccaratHand, bankerHand: BaccaratHand): void {
    let playerThirdCard: BaccaratCard | undefined;

    // Player's third card rule
    if (playerHand.value <= 5) {
      playerThirdCard = this.drawCard();
      playerHand.cards.push(playerThirdCard);
      this.calculateHandValue(playerHand);
    }

    // Banker's third card rule (complex)
    if (playerThirdCard) {
      // If player drew, banker follows complex rules
      const shouldBankerDraw = this.shouldBankerDraw(bankerHand.value, playerThirdCard.value);
      if (shouldBankerDraw) {
        bankerHand.cards.push(this.drawCard());
        this.calculateHandValue(bankerHand);
      }
    } else {
      // If player stood, banker draws on 0-5
      if (bankerHand.value <= 5) {
        bankerHand.cards.push(this.drawCard());
        this.calculateHandValue(bankerHand);
      }
    }
  }

  /**
   * Banker drawing rules (based on player's third card)
   */
  private shouldBankerDraw(bankerValue: number, playerThirdCard: number): boolean {
    if (bankerValue <= 2) return true;
    if (bankerValue === 3 && playerThirdCard !== 8) return true;
    if (bankerValue === 4 && [2,3,4,5,6,7].includes(playerThirdCard)) return true;
    if (bankerValue === 5 && [4,5,6,7].includes(playerThirdCard)) return true;
    if (bankerValue === 6 && [6,7].includes(playerThirdCard)) return true;
    return false;
  }

  /**
   * Determine winner
   */
  private determineWinner(
    playerHand: BaccaratHand,
    bankerHand: BaccaratHand
  ): 'player' | 'banker' | 'tie' {
    if (playerHand.value > bankerHand.value) return 'player';
    if (bankerHand.value > playerHand.value) return 'banker';
    return 'tie';
  }

  /**
   * Calculate payout
   */
  private calculatePayout(
    betType: BaccaratBetType,
    betAmount: number,
    winner: 'player' | 'banker' | 'tie'
  ): number {
    if (betType === winner) {
      if (betType === 'player') {
        return betAmount * 2; // 1:1
      } else if (betType === 'banker') {
        return betAmount * 1.95; // 1:1 minus 5% commission
      } else if (betType === 'tie') {
        return betAmount * 9; // 8:1
      }
    }

    // Tie push (player/banker bets)
    if (winner === 'tie' && betType !== 'tie') {
      return betAmount; // Push - return bet
    }

    return 0; // Lost
  }

  /**
   * Update player stats
   */
  private updateStats(game: BaccaratGame): void {
    let stats = this.playerStats.get(game.playerId);

    if (!stats) {
      stats = {
        totalGames: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        playerWins: 0,
        bankerWins: 0,
        ties: 0,
        naturals: 0,
        netProfit: 0
      };
    }

    stats.totalGames++;
    stats.totalWagered += game.betAmount;
    stats.totalWon += game.payout;
    stats.biggestWin = Math.max(stats.biggestWin, game.payout);

    if (game.winner === 'player') stats.playerWins++;
    else if (game.winner === 'banker') stats.bankerWins++;
    else stats.ties++;

    if (game.playerHand.natural || game.bankerHand.natural) {
      stats.naturals++;
    }

    stats.netProfit = stats.totalWon - stats.totalWagered;

    this.playerStats.set(game.playerId, stats);
  }

  /**
   * Get player stats
   */
  getStats(playerId: string): BaccaratStats {
    return this.playerStats.get(playerId) || {
      totalGames: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      playerWins: 0,
      bankerWins: 0,
      ties: 0,
      naturals: 0,
      netProfit: 0
    };
  }

  /**
   * Get game
   */
  getGame(gameId: string): BaccaratGame | undefined {
    return this.games.get(gameId);
  }

  /**
   * Format hand for display
   */
  formatHand(hand: BaccaratHand): string {
    const cards = hand.cards.map(c => `${c.rank}${c.suit}`).join(' ');
    return `${cards} (${hand.value}${hand.natural ? ' NATURAL' : ''})`;
  }
}

/**
 * Global baccarat instance
 */
export const baccaratTable = new BaccaratSynth();

/**
 * ROULETTE WITH SYNTH
 * European & American roulette using SYNTH as chips
 * Full betting table with all bet types
 */

export type RouletteBetType =
  | 'straight' | 'split' | 'street' | 'corner' | 'line'
  | 'column' | 'dozen' | 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';

export interface RouletteBet {
  betId: string;
  type: RouletteBetType;
  numbers: number[]; // Numbers covered by bet
  amount: number;
}

export interface RouletteSpin {
  spinId: string;
  playerId: string;
  playerEmail: string;
  number: number;
  color: 'red' | 'black' | 'green';
  bets: RouletteBet[];
  results: RouletteBetResult[];
  totalWin: number;
  timestamp: Date;
}

export interface RouletteBetResult {
  bet: RouletteBet;
  won: boolean;
  payout: number;
}

export interface RouletteStats {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  straightUps: number; // Straight up wins
  netProfit: number;
}

/**
 * Roulette wheel (European - 0 to 36)
 */
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

/**
 * Payout ratios
 */
const PAYOUTS: Record<RouletteBetType, number> = {
  'straight': 35, // 35:1
  'split': 17, // 17:1
  'street': 11, // 11:1
  'corner': 8, // 8:1
  'line': 5, // 5:1
  'column': 2, // 2:1
  'dozen': 2, // 2:1
  'red': 1, // 1:1
  'black': 1, // 1:1
  'even': 1, // 1:1
  'odd': 1, // 1:1
  'low': 1, // 1:1 (1-18)
  'high': 1 // 1:1 (19-36)
};

/**
 * Roulette Game System
 */
export class RouletteSynth {
  private spins: Map<string, RouletteSpin> = new Map();
  private playerStats: Map<string, RouletteStats> = new Map();
  
  private readonly MIN_BET = 1; // 1 SYNTH
  private readonly MAX_BET = 5000; // 5K SYNTH
  private readonly HOUSE_EDGE = 2.7; // 2.7% (European)

  /**
   * Spin the wheel
   */
  spin(
    playerId: string,
    playerEmail: string,
    bets: Array<{ type: RouletteBetType; numbers: number[]; amount: number }>
  ): RouletteSpin {
    // Validate bets
    for (const bet of bets) {
      if (bet.amount < this.MIN_BET) {
        throw new Error(`Minimum bet is ${this.MIN_BET} SYNTH`);
      }
      if (bet.amount > this.MAX_BET) {
        throw new Error(`Maximum bet is ${this.MAX_BET} SYNTH`);
      }
    }

    const spinId = `SPIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Spin the wheel (0-36)
    const number = Math.floor(Math.random() * 37);
    const color = this.getColor(number);

    // Create bet objects
    const betObjects: RouletteBet[] = bets.map(b => ({
      betId: `BET-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: b.type,
      numbers: b.numbers,
      amount: b.amount
    }));

    // Evaluate bets
    const results = this.evaluateBets(betObjects, number, color);
    const totalWin = results.reduce((sum, r) => sum + (r.won ? r.payout : 0), 0);

    const spin: RouletteSpin = {
      spinId,
      playerId,
      playerEmail,
      number,
      color,
      bets: betObjects,
      results,
      totalWin,
      timestamp: new Date()
    };

    this.spins.set(spinId, spin);
    this.updateStats(spin);

    console.log(`🎡 Roulette: ${number} ${color.toUpperCase()}`);
    if (totalWin > 0) {
      console.log(`🎡 Winner! ${totalWin} SYNTH`);
    }

    return spin;
  }

  /**
   * Get color of number
   */
  private getColor(number: number): 'red' | 'black' | 'green' {
    if (number === 0) return 'green';
    if (RED_NUMBERS.includes(number)) return 'red';
    return 'black';
  }

  /**
   * Evaluate all bets against spin
   */
  private evaluateBets(
    bets: RouletteBet[],
    number: number,
    color: 'red' | 'black' | 'green'
  ): RouletteBetResult[] {
    const results: RouletteBetResult[] = [];

    for (const bet of bets) {
      let won = false;

      switch (bet.type) {
        case 'straight':
          won = bet.numbers.includes(number);
          break;

        case 'split':
        case 'street':
        case 'corner':
        case 'line':
          won = bet.numbers.includes(number);
          break;

        case 'column':
          // Column 1: 1,4,7,10,13,16,19,22,25,28,31,34
          // Column 2: 2,5,8,11,14,17,20,23,26,29,32,35
          // Column 3: 3,6,9,12,15,18,21,24,27,30,33,36
          won = bet.numbers.includes(number);
          break;

        case 'dozen':
          // First dozen: 1-12
          // Second dozen: 13-24
          // Third dozen: 25-36
          won = bet.numbers.includes(number);
          break;

        case 'red':
          won = color === 'red';
          break;

        case 'black':
          won = color === 'black';
          break;

        case 'even':
          won = number > 0 && number % 2 === 0;
          break;

        case 'odd':
          won = number > 0 && number % 2 === 1;
          break;

        case 'low':
          won = number >= 1 && number <= 18;
          break;

        case 'high':
          won = number >= 19 && number <= 36;
          break;
      }

      const payout = won ? bet.amount * PAYOUTS[bet.type] : 0;

      results.push({ bet, won, payout });
    }

    return results;
  }

  /**
   * Update player stats
   */
  private updateStats(spin: RouletteSpin): void {
    let stats = this.playerStats.get(spin.playerId);

    if (!stats) {
      stats = {
        totalSpins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        straightUps: 0,
        netProfit: 0
      };
    }

    stats.totalSpins++;
    stats.totalWagered += spin.bets.reduce((sum, b) => sum + b.amount, 0);
    stats.totalWon += spin.totalWin;
    stats.biggestWin = Math.max(stats.biggestWin, spin.totalWin);

    // Count straight up wins
    const straightUpWins = spin.results.filter(r => r.bet.type === 'straight' && r.won);
    stats.straightUps += straightUpWins.length;

    stats.netProfit = stats.totalWon - stats.totalWagered;

    this.playerStats.set(spin.playerId, stats);
  }

  /**
   * Get player stats
   */
  getStats(playerId: string): RouletteStats {
    return this.playerStats.get(playerId) || {
      totalSpins: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      straightUps: 0,
      netProfit: 0
    };
  }

  /**
   * Get spin
   */
  getSpin(spinId: string): RouletteSpin | undefined {
    return this.spins.get(spinId);
  }

  /**
   * Helper: Create straight bet
   */
  static straightBet(number: number, amount: number) {
    return { type: 'straight' as RouletteBetType, numbers: [number], amount };
  }

  /**
   * Helper: Create red/black bet
   */
  static colorBet(color: 'red' | 'black', amount: number) {
    return {
      type: color as RouletteBetType,
      numbers: color === 'red' ? RED_NUMBERS : BLACK_NUMBERS,
      amount
    };
  }

  /**
   * Helper: Create even/odd bet
   */
  static evenOddBet(type: 'even' | 'odd', amount: number) {
    const numbers = type === 'even' 
      ? [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36]
      : [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
    return { type: type as RouletteBetType, numbers, amount };
  }

  /**
   * Helper: Create dozen bet
   */
  static dozenBet(dozen: 1 | 2 | 3, amount: number) {
    let numbers: number[];
    if (dozen === 1) numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
    else if (dozen === 2) numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
    else numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
    
    return { type: 'dozen' as RouletteBetType, numbers, amount };
  }
}

/**
 * Global roulette instance
 */
export const rouletteWheel = new RouletteSynth();

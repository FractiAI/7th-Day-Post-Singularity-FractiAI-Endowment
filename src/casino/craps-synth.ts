/**
 * CRAPS WITH SYNTH
 * Classic casino craps using SYNTH as chips
 * Full betting table with all traditional bets
 */

export type CrapsBetType = 
  | 'pass-line' | 'dont-pass' | 'come' | 'dont-come'
  | 'field' | 'any-craps' | 'any-seven' | 'hardway-4' | 'hardway-6' | 'hardway-8' | 'hardway-10'
  | 'place-4' | 'place-5' | 'place-6' | 'place-8' | 'place-9' | 'place-10'
  | 'odds-pass' | 'odds-come';

export interface CrapsBet {
  betId: string;
  type: CrapsBetType;
  amount: number;
  point?: number; // For pass line/come bets with established point
}

export interface CrapsRoll {
  rollId: string;
  playerId: string;
  playerEmail: string;
  dice: [number, number];
  total: number;
  gamePhase: 'come-out' | 'point';
  point?: number;
  bets: CrapsBet[];
  results: CrapsBetResult[];
  totalWin: number;
  timestamp: Date;
}

export interface CrapsBetResult {
  bet: CrapsBet;
  won: boolean;
  payout: number;
}

export interface CrapsStats {
  totalRolls: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  sevenOuts: number;
  pointsMade: number;
  netProfit: number;
}

/**
 * Craps Payout Table
 */
const PAYOUTS: Record<CrapsBetType, number> = {
  'pass-line': 1, // 1:1
  'dont-pass': 1, // 1:1
  'come': 1, // 1:1
  'dont-come': 1, // 1:1
  'field': 1, // 1:1 (2:1 on 2 or 12)
  'any-craps': 7, // 7:1
  'any-seven': 4, // 4:1
  'hardway-4': 7, // 7:1
  'hardway-6': 9, // 9:1
  'hardway-8': 9, // 9:1
  'hardway-10': 7, // 7:1
  'place-4': 1.8, // 9:5
  'place-5': 1.4, // 7:5
  'place-6': 1.167, // 7:6
  'place-8': 1.167, // 7:6
  'place-9': 1.4, // 7:5
  'place-10': 1.8, // 9:5
  'odds-pass': 2, // True odds (varies)
  'odds-come': 2 // True odds (varies)
};

/**
 * Craps Game System
 */
export class CrapsSynth {
  private rolls: Map<string, CrapsRoll> = new Map();
  private playerStats: Map<string, CrapsStats> = new Map();
  private activeBets: Map<string, CrapsBet[]> = new Map();
  private gamePhase: 'come-out' | 'point' = 'come-out';
  private currentPoint?: number;
  
  private readonly MIN_BET = 5; // 5 SYNTH
  private readonly MAX_BET = 10000; // 10K SYNTH
  private readonly HOUSE_EDGE = 1.4; // 1.4% (one of the best in casino!)

  /**
   * Roll the dice
   */
  roll(
    playerId: string,
    playerEmail: string,
    bets: Array<{ type: CrapsBetType; amount: number }>
  ): CrapsRoll {
    // Validate bets
    for (const bet of bets) {
      if (bet.amount < this.MIN_BET) {
        throw new Error(`Minimum bet is ${this.MIN_BET} SYNTH`);
      }
      if (bet.amount > this.MAX_BET) {
        throw new Error(`Maximum bet is ${this.MAX_BET} SYNTH`);
      }
    }

    const rollId = `ROLL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Roll two dice
    const dice: [number, number] = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const total = dice[0] + dice[1];

    // Create bet objects
    const betObjects: CrapsBet[] = bets.map(b => ({
      betId: `BET-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: b.type,
      amount: b.amount,
      point: this.currentPoint
    }));

    // Evaluate bets
    const results = this.evaluateBets(betObjects, dice, total);
    const totalWin = results.reduce((sum, r) => sum + (r.won ? r.payout : 0), 0);

    // Update game phase
    this.updateGamePhase(total);

    const roll: CrapsRoll = {
      rollId,
      playerId,
      playerEmail,
      dice,
      total,
      gamePhase: this.gamePhase,
      point: this.currentPoint,
      bets: betObjects,
      results,
      totalWin,
      timestamp: new Date()
    };

    this.rolls.set(rollId, roll);
    this.updateStats(roll);

    console.log(`🎲 Rolled: ${dice[0]} + ${dice[1]} = ${total}`);
    if (totalWin > 0) {
      console.log(`🎲 Winner! ${totalWin} SYNTH`);
    }

    return roll;
  }

  /**
   * Evaluate all bets against roll
   */
  private evaluateBets(
    bets: CrapsBet[],
    dice: [number, number],
    total: number
  ): CrapsBetResult[] {
    const results: CrapsBetResult[] = [];

    for (const bet of bets) {
      let won = false;
      let payout = 0;

      switch (bet.type) {
        case 'pass-line':
          if (this.gamePhase === 'come-out') {
            won = total === 7 || total === 11;
          } else {
            won = total === this.currentPoint;
          }
          break;

        case 'dont-pass':
          if (this.gamePhase === 'come-out') {
            won = total === 2 || total === 3;
          } else {
            won = total === 7;
          }
          break;

        case 'field':
          won = [2, 3, 4, 9, 10, 11, 12].includes(total);
          if (won && (total === 2 || total === 12)) {
            payout = bet.amount * 2; // Double on 2 or 12
          }
          break;

        case 'any-craps':
          won = [2, 3, 12].includes(total);
          break;

        case 'any-seven':
          won = total === 7;
          break;

        case 'hardway-4':
          won = dice[0] === 2 && dice[1] === 2;
          break;

        case 'hardway-6':
          won = dice[0] === 3 && dice[1] === 3;
          break;

        case 'hardway-8':
          won = dice[0] === 4 && dice[1] === 4;
          break;

        case 'hardway-10':
          won = dice[0] === 5 && dice[1] === 5;
          break;

        case 'place-4':
          won = total === 4;
          break;

        case 'place-5':
          won = total === 5;
          break;

        case 'place-6':
          won = total === 6;
          break;

        case 'place-8':
          won = total === 8;
          break;

        case 'place-9':
          won = total === 9;
          break;

        case 'place-10':
          won = total === 10;
          break;
      }

      if (won && payout === 0) {
        payout = bet.amount * PAYOUTS[bet.type];
      }

      results.push({ bet, won, payout });
    }

    return results;
  }

  /**
   * Update game phase based on roll
   */
  private updateGamePhase(total: number): void {
    if (this.gamePhase === 'come-out') {
      if ([4, 5, 6, 8, 9, 10].includes(total)) {
        this.gamePhase = 'point';
        this.currentPoint = total;
        console.log(`🎲 Point established: ${total}`);
      }
    } else {
      if (total === this.currentPoint || total === 7) {
        this.gamePhase = 'come-out';
        if (total === 7) {
          console.log(`🎲 Seven out!`);
        } else {
          console.log(`🎲 Point made: ${total}`);
        }
        this.currentPoint = undefined;
      }
    }
  }

  /**
   * Update player stats
   */
  private updateStats(roll: CrapsRoll): void {
    let stats = this.playerStats.get(roll.playerId);

    if (!stats) {
      stats = {
        totalRolls: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        sevenOuts: 0,
        pointsMade: 0,
        netProfit: 0
      };
    }

    stats.totalRolls++;
    stats.totalWagered += roll.bets.reduce((sum, b) => sum + b.amount, 0);
    stats.totalWon += roll.totalWin;
    stats.biggestWin = Math.max(stats.biggestWin, roll.totalWin);
    
    if (roll.total === 7 && roll.gamePhase === 'point') {
      stats.sevenOuts++;
    }
    if (roll.total === roll.point) {
      stats.pointsMade++;
    }

    stats.netProfit = stats.totalWon - stats.totalWagered;

    this.playerStats.set(roll.playerId, stats);
  }

  /**
   * Get player stats
   */
  getStats(playerId: string): CrapsStats {
    return this.playerStats.get(playerId) || {
      totalRolls: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      sevenOuts: 0,
      pointsMade: 0,
      netProfit: 0
    };
  }

  /**
   * Get current game state
   */
  getGameState(): { phase: 'come-out' | 'point'; point?: number } {
    return {
      phase: this.gamePhase,
      point: this.currentPoint
    };
  }
}

/**
 * Global craps instance
 */
export const crapsTable = new CrapsSynth();

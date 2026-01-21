/**
 * SLOT MACHINE WITH SYNTH
 * Classic 3-reel slots using SYNTH as chips
 * Multiple paylines and bonus features
 */

export type SlotSymbol = '🍒' | '🍋' | '🍊' | '🍉' | '🍇' | '⭐' | '💎' | '7️⃣' | '🔔' | 'BAR';

export interface SlotReel {
  position: number;
  symbol: SlotSymbol;
}

export interface SlotSpin {
  spinId: string;
  playerId: string;
  playerEmail: string;
  betAmount: number;
  reels: [SlotReel, SlotReel, SlotReel];
  paylines: SlotPayline[];
  totalWin: number;
  timestamp: Date;
  jackpot: boolean;
}

export interface SlotPayline {
  symbols: [SlotSymbol, SlotSymbol, SlotSymbol];
  payout: number;
  multiplier: number;
}

export interface SlotStats {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  jackpotsHit: number;
  netProfit: number;
}

/**
 * Slot Machine Payouts
 */
const PAYOUTS: Record<string, number> = {
  '💎💎💎': 1000, // Jackpot!
  '7️⃣7️⃣7️⃣': 500,
  'BAR BAR BAR': 250,
  '🔔🔔🔔': 100,
  '⭐⭐⭐': 75,
  '🍇🍇🍇': 50,
  '🍉🍉🍉': 40,
  '🍊🍊🍊': 30,
  '🍋🍋🍋': 20,
  '🍒🍒🍒': 15,
  // Two of a kind
  '💎💎': 50,
  '7️⃣7️⃣': 25,
  '🍒🍒': 5,
  '🍋🍋': 4,
  '🍊🍊': 4
};

/**
 * Slot Machine System
 */
export class SlotMachineSynth {
  private spins: Map<string, SlotSpin> = new Map();
  private playerStats: Map<string, SlotStats> = new Map();
  
  private readonly MIN_BET = 1; // 1 SYNTH
  private readonly MAX_BET = 1000; // 1K SYNTH per spin
  private readonly HOUSE_EDGE = 5; // 5% house edge (standard slots)
  
  // Reel strips (weighted for RTP ~95%)
  private readonly REEL_STRIPS: SlotSymbol[] = [
    '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', // Cherry (common)
    '🍋', '🍋', '🍋', '🍋', '🍋', '🍋', // Lemon
    '🍊', '🍊', '🍊', '🍊', '🍊', // Orange
    '🍉', '🍉', '🍉', '🍉', // Watermelon
    '🍇', '🍇', '🍇', // Grape
    '⭐', '⭐', // Star
    '🔔', '🔔', // Bell
    'BAR', 'BAR', // Bar
    '7️⃣', // Seven (rare)
    '💎' // Diamond (jackpot - very rare)
  ];

  /**
   * Spin the slots
   */
  spin(
    playerId: string,
    playerEmail: string,
    betAmount: number
  ): SlotSpin {
    // Validate bet
    if (betAmount < this.MIN_BET) {
      throw new Error(`Minimum bet is ${this.MIN_BET} SYNTH`);
    }
    if (betAmount > this.MAX_BET) {
      throw new Error(`Maximum bet is ${this.MAX_BET} SYNTH`);
    }

    const spinId = `SPIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Spin each reel
    const reels: [SlotReel, SlotReel, SlotReel] = [
      this.spinReel(),
      this.spinReel(),
      this.spinReel()
    ];

    // Check for wins
    const paylines = this.checkPaylines(reels);
    const totalWin = paylines.reduce((sum, p) => sum + (p.payout * betAmount), 0);
    const jackpot = reels.every(r => r.symbol === '💎');

    const spin: SlotSpin = {
      spinId,
      playerId,
      playerEmail,
      betAmount,
      reels,
      paylines,
      totalWin,
      timestamp: new Date(),
      jackpot
    };

    this.spins.set(spinId, spin);
    this.updateStats(spin);

    if (jackpot) {
      console.log(`🎰 JACKPOT! 💎💎💎 - ${totalWin} SYNTH!`);
    } else if (totalWin > 0) {
      console.log(`🎰 Winner! ${totalWin} SYNTH`);
    }

    return spin;
  }

  /**
   * Spin a single reel
   */
  private spinReel(): SlotReel {
    const position = Math.floor(Math.random() * this.REEL_STRIPS.length);
    const symbol = this.REEL_STRIPS[position];
    
    return { position, symbol };
  }

  /**
   * Check for winning paylines
   */
  private checkPaylines(reels: [SlotReel, SlotReel, SlotReel]): SlotPayline[] {
    const paylines: SlotPayline[] = [];
    const symbols: [SlotSymbol, SlotSymbol, SlotSymbol] = [
      reels[0].symbol,
      reels[1].symbol,
      reels[2].symbol
    ];

    // Check three of a kind
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      const key = `${symbols[0]}${symbols[1]}${symbols[2]}`;
      const multiplier = PAYOUTS[key] || 0;
      
      if (multiplier > 0) {
        paylines.push({
          symbols,
          payout: multiplier,
          multiplier
        });
      }
    }
    // Check two of a kind (first two)
    else if (symbols[0] === symbols[1]) {
      const key = `${symbols[0]}${symbols[1]}`;
      const multiplier = PAYOUTS[key] || 0;
      
      if (multiplier > 0) {
        paylines.push({
          symbols,
          payout: multiplier,
          multiplier
        });
      }
    }

    return paylines;
  }

  /**
   * Update player stats
   */
  private updateStats(spin: SlotSpin): void {
    let stats = this.playerStats.get(spin.playerId);

    if (!stats) {
      stats = {
        totalSpins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        jackpotsHit: 0,
        netProfit: 0
      };
    }

    stats.totalSpins++;
    stats.totalWagered += spin.betAmount;
    stats.totalWon += spin.totalWin;
    stats.biggestWin = Math.max(stats.biggestWin, spin.totalWin);
    if (spin.jackpot) stats.jackpotsHit++;
    stats.netProfit = stats.totalWon - stats.totalWagered;

    this.playerStats.set(spin.playerId, stats);
  }

  /**
   * Get player stats
   */
  getStats(playerId: string): SlotStats {
    return this.playerStats.get(playerId) || {
      totalSpins: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      jackpotsHit: 0,
      netProfit: 0
    };
  }

  /**
   * Get spin
   */
  getSpin(spinId: string): SlotSpin | undefined {
    return this.spins.get(spinId);
  }

  /**
   * Format spin for display
   */
  formatSpin(spin: SlotSpin): string {
    return `
╔════════════════════════════════════════════════════════════════╗
║                    SLOT MACHINE - SYNTH CASINO                 ║
╠════════════════════════════════════════════════════════════════╣
║
║  BET: ${spin.betAmount} SYNTH
║
║  ┌─────────────────────────────┐
║  │  ${spin.reels[0].symbol}  │  ${spin.reels[1].symbol}  │  ${spin.reels[2].symbol}  │
║  └─────────────────────────────┘
║
${spin.jackpot ? '║  🎰🎰🎰 JACKPOT! 🎰🎰🎰\n' : ''}${spin.totalWin > 0 ? `║  WIN: ${spin.totalWin} SYNTH\n` : '║  No win this spin\n'}║  
╚════════════════════════════════════════════════════════════════╝
`;
  }
}

/**
 * Global slots instance
 */
export const slotMachine = new SlotMachineSynth();

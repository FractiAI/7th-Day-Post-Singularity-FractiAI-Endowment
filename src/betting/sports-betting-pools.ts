/**
 * SPORTS BETTING POOLS ON NODES
 * Decentralized sports betting using SYNTH
 * Node-based pool distribution and payouts
 */

export interface BettingPool {
  poolId: string;
  sport: 'football' | 'basketball' | 'baseball' | 'soccer' | 'hockey' | 'mma' | 'boxing' | 'other';
  eventName: string;
  eventDate: Date;
  status: 'open' | 'locked' | 'completed' | 'cancelled';
  totalPot: number; // Total SYNTH in pool
  houseFee: number; // 2.5% platform fee
  participants: number;
  minimumBet: number;
  maximumBet: number;
  nodeId: string; // Which node hosts this pool
  outcomes: BettingOutcome[];
  createdBy: string;
  createdAt: Date;
  lockTime: Date; // When betting closes
  settlementTime?: Date;
  winner?: string;
}

export interface BettingOutcome {
  outcomeId: string;
  description: string; // "Team A wins", "Over 45.5 points", etc.
  odds: number; // Decimal odds (e.g., 2.5 = 2.5x payout)
  totalBets: number; // Total SYNTH bet on this outcome
  backers: number; // Number of people who bet this
  currentPayout: number; // Potential payout per SYNTH if this wins
}

export interface Bet {
  betId: string;
  poolId: string;
  userId: string;
  userEmail: string;
  outcomeId: string;
  amount: number; // SYNTH wagered
  odds: number; // Odds at time of bet
  potentialPayout: number; // What they could win
  timestamp: Date;
  status: 'active' | 'won' | 'lost' | 'refunded';
  paidOut?: boolean;
  payoutAmount?: number;
  payoutDate?: Date;
}

export interface BettingPoolStats {
  totalPools: number;
  activePools: number;
  totalVolume: number; // All-time SYNTH wagered
  totalPaidOut: number;
  averagePoolSize: number;
  largestPool: number;
  mostPopularSport: string;
}

/**
 * Sports Betting Pool System
 */
export class SportsBettingSystem {
  private pools: Map<string, BettingPool> = new Map();
  private bets: Map<string, Bet> = new Map();
  private houseFeePercent: number = 2.5; // 2.5% house edge

  /**
   * Create new betting pool
   */
  createPool(
    sport: BettingPool['sport'],
    eventName: string,
    eventDate: Date,
    outcomes: Array<{ description: string; initialOdds: number }>,
    nodeId: string,
    createdBy: string,
    minimumBet: number = 5,
    maximumBet: number = 10000
  ): BettingPool {
    const poolId = `POOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const pool: BettingPool = {
      poolId,
      sport,
      eventName,
      eventDate,
      status: 'open',
      totalPot: 0,
      houseFee: this.houseFeePercent,
      participants: 0,
      minimumBet,
      maximumBet,
      nodeId,
      outcomes: outcomes.map((o, i) => ({
        outcomeId: `OUT-${i}`,
        description: o.description,
        odds: o.initialOdds,
        totalBets: 0,
        backers: 0,
        currentPayout: o.initialOdds
      })),
      createdBy,
      createdAt: new Date(),
      lockTime: new Date(eventDate.getTime() - 3600000) // 1 hour before event
    };

    this.pools.set(poolId, pool);
    console.log(`✅ Betting pool created: ${eventName} (${poolId})`);
    
    return pool;
  }

  /**
   * Place bet on outcome
   */
  placeBet(
    poolId: string,
    userId: string,
    userEmail: string,
    outcomeId: string,
    amount: number
  ): Bet {
    const pool = this.pools.get(poolId);
    
    if (!pool) {
      throw new Error('Pool not found');
    }

    // Validate pool status
    if (pool.status !== 'open') {
      throw new Error(`Pool is ${pool.status}, betting closed`);
    }

    // Check if betting is locked
    if (new Date() >= pool.lockTime) {
      throw new Error('Betting is locked for this event');
    }

    // Validate bet amount
    if (amount < pool.minimumBet) {
      throw new Error(`Minimum bet is ${pool.minimumBet} SYNTH`);
    }

    if (amount > pool.maximumBet) {
      throw new Error(`Maximum bet is ${pool.maximumBet} SYNTH`);
    }

    // Find outcome
    const outcome = pool.outcomes.find(o => o.outcomeId === outcomeId);
    if (!outcome) {
      throw new Error('Invalid outcome');
    }

    // Create bet
    const betId = `BET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const potentialPayout = amount * outcome.odds;

    const bet: Bet = {
      betId,
      poolId,
      userId,
      userEmail,
      outcomeId,
      amount,
      odds: outcome.odds,
      potentialPayout,
      timestamp: new Date(),
      status: 'active',
      paidOut: false
    };

    // Update pool
    pool.totalPot += amount;
    pool.participants++;
    outcome.totalBets += amount;
    outcome.backers++;

    // Recalculate odds (parimutuel style)
    this.recalculateOdds(pool);

    this.bets.set(betId, bet);
    
    console.log(`✅ Bet placed: ${amount} SYNTH on "${outcome.description}" (${betId})`);
    
    return bet;
  }

  /**
   * Recalculate odds based on pool distribution (parimutuel)
   */
  private recalculateOdds(pool: BettingPool): void {
    const netPot = pool.totalPot * (1 - pool.houseFee / 100);

    pool.outcomes.forEach(outcome => {
      if (outcome.totalBets > 0) {
        // Payout = (Net Pot / Total Bets on Outcome)
        outcome.currentPayout = netPot / outcome.totalBets;
      } else {
        outcome.currentPayout = outcome.odds; // Keep initial odds if no bets
      }
    });
  }

  /**
   * Settle pool (declare winner)
   */
  settlePool(
    poolId: string,
    winningOutcomeId: string
  ): {
    pool: BettingPool;
    totalPaid: number;
    winners: number;
    houseTake: number;
  } {
    const pool = this.pools.get(poolId);
    
    if (!pool) {
      throw new Error('Pool not found');
    }

    if (pool.status === 'completed') {
      throw new Error('Pool already settled');
    }

    // Lock pool
    pool.status = 'completed';
    pool.settlementTime = new Date();
    pool.winner = winningOutcomeId;

    const winningOutcome = pool.outcomes.find(o => o.outcomeId === winningOutcomeId);
    
    if (!winningOutcome) {
      throw new Error('Invalid winning outcome');
    }

    // Calculate house take
    const houseTake = pool.totalPot * (pool.houseFee / 100);
    const netPot = pool.totalPot - houseTake;

    // Pay out winners
    let totalPaid = 0;
    let winners = 0;

    Array.from(this.bets.values())
      .filter(bet => bet.poolId === poolId && bet.outcomeId === winningOutcomeId)
      .forEach(bet => {
        // Calculate payout: (Bet Amount / Total Bets on Winning Outcome) * Net Pot
        const payout = (bet.amount / winningOutcome.totalBets) * netPot;
        
        bet.status = 'won';
        bet.paidOut = true;
        bet.payoutAmount = payout;
        bet.payoutDate = new Date();
        
        totalPaid += payout;
        winners++;
        
        console.log(`💰 Payout: ${payout} SYNTH to ${bet.userEmail}`);
      });

    // Mark losing bets
    Array.from(this.bets.values())
      .filter(bet => bet.poolId === poolId && bet.outcomeId !== winningOutcomeId)
      .forEach(bet => {
        bet.status = 'lost';
      });

    console.log(`✅ Pool settled: ${pool.eventName}`);
    console.log(`   Winners: ${winners}`);
    console.log(`   Total paid: ${totalPaid} SYNTH`);
    console.log(`   House take: ${houseTake} SYNTH`);

    return {
      pool,
      totalPaid,
      winners,
      houseTake
    };
  }

  /**
   * Cancel pool and refund all bets
   */
  cancelPool(poolId: string, reason: string): void {
    const pool = this.pools.get(poolId);
    
    if (!pool) {
      throw new Error('Pool not found');
    }

    pool.status = 'cancelled';

    // Refund all bets
    Array.from(this.bets.values())
      .filter(bet => bet.poolId === poolId)
      .forEach(bet => {
        bet.status = 'refunded';
        bet.paidOut = true;
        bet.payoutAmount = bet.amount; // Full refund
        bet.payoutDate = new Date();
        
        console.log(`🔄 Refunded: ${bet.amount} SYNTH to ${bet.userEmail}`);
      });

    console.log(`❌ Pool cancelled: ${pool.eventName} - ${reason}`);
  }

  /**
   * Get pool by ID
   */
  getPool(poolId: string): BettingPool | undefined {
    return this.pools.get(poolId);
  }

  /**
   * Get all active pools
   */
  getActivePools(): BettingPool[] {
    return Array.from(this.pools.values())
      .filter(pool => pool.status === 'open')
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  }

  /**
   * Get pools by sport
   */
  getPoolsBySport(sport: BettingPool['sport']): BettingPool[] {
    return Array.from(this.pools.values())
      .filter(pool => pool.sport === sport && pool.status === 'open');
  }

  /**
   * Get user's bets
   */
  getUserBets(userId: string): Bet[] {
    return Array.from(this.bets.values())
      .filter(bet => bet.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get betting stats
   */
  getStats(): BettingPoolStats {
    const allPools = Array.from(this.pools.values());
    const activePools = allPools.filter(p => p.status === 'open');
    const completedPools = allPools.filter(p => p.status === 'completed');
    
    const totalVolume = allPools.reduce((sum, p) => sum + p.totalPot, 0);
    const totalPaidOut = Array.from(this.bets.values())
      .filter(b => b.paidOut && b.payoutAmount)
      .reduce((sum, b) => sum + b.payoutAmount!, 0);

    // Count pools by sport
    const sportCounts: Record<string, number> = {};
    allPools.forEach(p => {
      sportCounts[p.sport] = (sportCounts[p.sport] || 0) + 1;
    });
    const mostPopularSport = Object.entries(sportCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'football';

    return {
      totalPools: allPools.length,
      activePools: activePools.length,
      totalVolume,
      totalPaidOut,
      averagePoolSize: totalVolume / allPools.length || 0,
      largestPool: Math.max(...allPools.map(p => p.totalPot), 0),
      mostPopularSport: mostPopularSport as BettingPool['sport']
    };
  }

  /**
   * Get pool leaderboard
   */
  getLeaderboard(poolId: string): Array<{
    userEmail: string;
    totalWagered: number;
    potentialWin: number;
    outcome: string;
  }> {
    const poolBets = Array.from(this.bets.values())
      .filter(bet => bet.poolId === poolId);

    const pool = this.pools.get(poolId);
    if (!pool) return [];

    // Group by user
    const userBets = new Map<string, Bet[]>();
    poolBets.forEach(bet => {
      const existing = userBets.get(bet.userEmail) || [];
      existing.push(bet);
      userBets.set(bet.userEmail, existing);
    });

    // Calculate totals
    const leaderboard = Array.from(userBets.entries()).map(([email, bets]) => {
      const totalWagered = bets.reduce((sum, b) => sum + b.amount, 0);
      const potentialWin = bets.reduce((sum, b) => sum + b.potentialPayout, 0);
      const outcome = pool.outcomes.find(o => o.outcomeId === bets[0].outcomeId)?.description || 'Unknown';

      return {
        userEmail: email,
        totalWagered,
        potentialWin,
        outcome
      };
    });

    return leaderboard.sort((a, b) => b.totalWagered - a.totalWagered);
  }
}

/**
 * Example pools for popular sports
 */
export const EXAMPLE_POOLS = {
  superbowl: {
    sport: 'football' as const,
    eventName: 'Super Bowl LXI',
    eventDate: new Date('2027-02-07'),
    outcomes: [
      { description: 'Team A wins', initialOdds: 1.85 },
      { description: 'Team B wins', initialOdds: 2.10 }
    ]
  },
  
  nbaFinals: {
    sport: 'basketball' as const,
    eventName: 'NBA Finals Game 7',
    eventDate: new Date('2026-06-20'),
    outcomes: [
      { description: 'Team A wins', initialOdds: 1.75 },
      { description: 'Team B wins', initialOdds: 2.25 }
    ]
  },

  worldCup: {
    sport: 'soccer' as const,
    eventName: 'World Cup Final',
    eventDate: new Date('2026-07-19'),
    outcomes: [
      { description: 'Team A wins', initialOdds: 2.00 },
      { description: 'Draw', initialOdds: 3.50 },
      { description: 'Team B wins', initialOdds: 2.00 }
    ]
  },

  ufcFight: {
    sport: 'mma' as const,
    eventName: 'UFC Championship Fight',
    eventDate: new Date('2026-03-15'),
    outcomes: [
      { description: 'Fighter A wins', initialOdds: 1.65 },
      { description: 'Fighter B wins', initialOdds: 2.40 }
    ]
  }
};

/**
 * Global instance
 */
export const sportsBetting = new SportsBettingSystem();

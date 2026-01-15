/**
 * Revenue Model Layer
 * Monthly access fee + revenue share + bonus participation
 */

import { RevenuePlan, VIPSession } from './sales-console.js';

export interface RevenueCalculation {
  monthlyAccessFee: number;
  revenueShare: number;
  bonus: number;
  total: number;
  breakdown: {
    accessFee: number;
    revenueShareAmount: number;
    bonusAmount: number;
  };
}

export interface RevenueTransaction {
  id: string;
  venueId: string;
  type: 'access-fee' | 'revenue-share' | 'bonus';
  amount: number;
  currency: string;
  timestamp: number;
  sessionId?: string;
  metadata: Record<string, any>;
}

export class RevenueModel {
  private transactions: Map<string, RevenueTransaction>;
  private revenuePlans: Map<string, RevenuePlan>;

  constructor() {
    this.transactions = new Map();
    this.revenuePlans = new Map();
  }

  /**
   * Register revenue plan for venue
   */
  registerRevenuePlan(venueId: string, plan: RevenuePlan): void {
    this.revenuePlans.set(venueId, plan);
  }

  /**
   * Calculate revenue for session
   */
  calculateRevenue(
    venueId: string,
    session: VIPSession
  ): RevenueCalculation {
    const plan = this.revenuePlans.get(venueId);
    if (!plan) {
      throw new Error(`Revenue plan not found for venue: ${venueId}`);
    }

    // Monthly access fee (prorated if needed)
    const accessFee = plan.monthlyAccessFee;

    // Revenue share
    const revenueShareAmount = (session.revenue * plan.revenueSharePercent) / 100;

    // Bonus calculation
    let bonusAmount = 0;
    if (plan.bonusParticipation && plan.bonusThreshold && plan.bonusPercent) {
      if (session.revenue >= plan.bonusThreshold) {
        const excess = session.revenue - plan.bonusThreshold;
        bonusAmount = (excess * plan.bonusPercent) / 100;
      }
    }

    const total = accessFee + revenueShareAmount + bonusAmount;

    return {
      monthlyAccessFee: accessFee,
      revenueShare: revenueShareAmount,
      bonus: bonusAmount,
      total,
      breakdown: {
        accessFee,
        revenueShareAmount,
        bonusAmount
      }
    };
  }

  /**
   * Record revenue transaction
   */
  recordTransaction(
    venueId: string,
    type: RevenueTransaction['type'],
    amount: number,
    sessionId?: string,
    metadata?: Record<string, any>
  ): RevenueTransaction {
    const plan = this.revenuePlans.get(venueId);
    if (!plan) {
      throw new Error(`Revenue plan not found for venue: ${venueId}`);
    }

    const transaction: RevenueTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      venueId,
      type,
      amount,
      currency: plan.currency,
      timestamp: Date.now(),
      sessionId,
      metadata: metadata || {}
    };

    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Get revenue summary for venue
   */
  getRevenueSummary(venueId: string, period?: { start: number; end: number }): {
    totalRevenue: number;
    accessFees: number;
    revenueShare: number;
    bonuses: number;
    transactionCount: number;
    transactions: RevenueTransaction[];
  } {
    let transactions = Array.from(this.transactions.values())
      .filter(t => t.venueId === venueId);

    if (period) {
      transactions = transactions.filter(t =>
        t.timestamp >= period.start && t.timestamp <= period.end
      );
    }

    const accessFees = transactions
      .filter(t => t.type === 'access-fee')
      .reduce((sum, t) => sum + t.amount, 0);

    const revenueShare = transactions
      .filter(t => t.type === 'revenue-share')
      .reduce((sum, t) => sum + t.amount, 0);

    const bonuses = transactions
      .filter(t => t.type === 'bonus')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRevenue = accessFees + revenueShare + bonuses;

    return {
      totalRevenue,
      accessFees,
      revenueShare,
      bonuses,
      transactionCount: transactions.length,
      transactions
    };
  }

  /**
   * Export revenue plan as JSON
   */
  exportRevenuePlan(venueId: string): string {
    const plan = this.revenuePlans.get(venueId);
    if (!plan) {
      throw new Error(`Revenue plan not found for venue: ${venueId}`);
    }

    return JSON.stringify({
      venueId,
      revenuePlan: plan,
      exportedAt: Date.now()
    }, null, 2);
  }
}



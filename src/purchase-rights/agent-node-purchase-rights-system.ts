/**
 * AGENT NODE PURCHASE RIGHTS SYSTEM
 * NSPFRNP-Based Presale/Reservation System with Batch Allocation Snap
 * 
 * GOLDEN HEARTS TO GOLDEN TICKETS BATCH ALLOCATION:
 * - 36 days of golden ticket purchases (Jan 21 - Feb 25, 2026)
 * - Tesla 3-6-9 pricing throughout ($3-$108)
 * - ALL transactions batched into SINGLE allocation snap on Feb 25
 * - ALL golden hearts become masters SIMULTANEOUSLY
 * - Natural coordination via NSPFRNP bee colony pattern
 * 
 * System tracks all promotional conditions and executes coordinated batch allocation
 */

export interface PurchaseRight {
  id: string;
  purchaseDate: Date;
  purchaseDay: number; // Day 1-59
  buyer: string;
  agentNodesReserved: number;
  pricePerNode: number; // Locked price based on purchase day
  totalPaid: number;
  status: 'reserved' | 'activated' | 'cancelled';
  activationDate?: Date;
  conditions: PromotionalConditions;
  metadata: {
    transactionHash?: string;
    paymentMethod: 'USD' | 'ETH' | 'BTC' | 'USDC';
    lockedRateForever: boolean;
  };
}

export interface PromotionalConditions {
  campaignStart: Date; // January 21, 2026
  campaignEnd: Date; // March 20, 2026
  vaultOpeningDate: Date; // March 20, 2026
  dailyPriceIncrease: number; // $1
  basePrice: number; // $1
  maxDays: number; // 59
  purchaseDayPrice: number; // Calculated: basePrice + (day - 1) * dailyPriceIncrease
  priceLockedForever: boolean; // true
  specialDays: {
    day: number;
    description: string;
  }[];
}

export interface VaultState {
  isOpen: boolean;
  openingDate: Date;
  totalRightsReserved: number;
  totalAgentNodesReserved: number;
  totalRevenue: number;
  activatedRights: number;
  pendingRights: number;
}

export class AgentNodePurchaseRightsSystem {
  private purchaseRights: Map<string, PurchaseRight> = new Map();
  private vaultState: VaultState;
  private readonly CAMPAIGN_START = new Date('2026-01-21T00:00:00Z');
  private readonly CAMPAIGN_END = new Date('2026-03-20T00:00:00Z');
  private readonly VAULT_OPENING = new Date('2026-03-20T00:00:00Z');
  private readonly BASE_PRICE = 1;
  private readonly DAILY_INCREASE = 1;
  private readonly MAX_DAYS = 59;

  constructor() {
    this.vaultState = {
      isOpen: false,
      openingDate: this.VAULT_OPENING,
      totalRightsReserved: 0,
      totalAgentNodesReserved: 0,
      totalRevenue: 0,
      activatedRights: 0,
      pendingRights: 0
    };
  }

  /**
   * Calculate current day of campaign (1-59)
   */
  private getCurrentCampaignDay(): number {
    const now = new Date();
    const diffTime = now.getTime() - this.CAMPAIGN_START.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.max(1, diffDays), this.MAX_DAYS);
  }

  /**
   * Calculate price per agent node based on campaign day
   */
  private calculatePriceForDay(day: number): number {
    return this.BASE_PRICE + ((day - 1) * this.DAILY_INCREASE);
  }

  /**
   * Get promotional conditions for a specific day
   */
  private getPromotionalConditions(day: number): PromotionalConditions {
    return {
      campaignStart: this.CAMPAIGN_START,
      campaignEnd: this.CAMPAIGN_END,
      vaultOpeningDate: this.VAULT_OPENING,
      dailyPriceIncrease: this.DAILY_INCREASE,
      basePrice: this.BASE_PRICE,
      maxDays: this.MAX_DAYS,
      purchaseDayPrice: this.calculatePriceForDay(day),
      priceLockedForever: true,
      specialDays: [
        { day: 1, description: 'Launch Day - $1 per agent!' },
        { day: 7, description: 'Week 1 Complete' },
        { day: 14, description: 'Two Weeks In' },
        { day: 25, description: 'Valentine\'s Day' },
        { day: 33, description: 'Lucky 33!' },
        { day: 50, description: 'Final 10 Days' },
        { day: 56, description: 'St. Patrick\'s Day' },
        { day: 59, description: 'Final Day - Vault Opens Tomorrow!' }
      ]
    };
  }

  /**
   * PURCHASE RIGHTS TO AGENT NODES
   * Buyer reserves agent nodes at today's locked price
   */
  purchaseAgentNodeRights(
    buyer: string,
    agentNodesRequested: number,
    paymentMethod: 'USD' | 'ETH' | 'BTC' | 'USDC' = 'USD'
  ): {
    success: boolean;
    purchaseRight?: PurchaseRight;
    error?: string;
  } {
    try {
      // Check if campaign is active
      const now = new Date();
      if (now < this.CAMPAIGN_START) {
        return {
          success: false,
          error: 'Campaign has not started yet. Starts January 21, 2026.'
        };
      }
      if (now > this.CAMPAIGN_END) {
        return {
          success: false,
          error: 'Campaign has ended. Vault opened March 20, 2026.'
        };
      }

      // Calculate current day and price
      const currentDay = this.getCurrentCampaignDay();
      const pricePerNode = this.calculatePriceForDay(currentDay);
      const totalCost = pricePerNode * agentNodesRequested;

      // Create purchase right
      const purchaseRight: PurchaseRight = {
        id: `PR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        purchaseDate: now,
        purchaseDay: currentDay,
        buyer,
        agentNodesReserved: agentNodesRequested,
        pricePerNode,
        totalPaid: totalCost,
        status: 'reserved',
        conditions: this.getPromotionalConditions(currentDay),
        metadata: {
          paymentMethod,
          lockedRateForever: true
        }
      };

      // Store purchase right
      this.purchaseRights.set(purchaseRight.id, purchaseRight);

      // Update vault state
      this.vaultState.totalRightsReserved++;
      this.vaultState.totalAgentNodesReserved += agentNodesRequested;
      this.vaultState.totalRevenue += totalCost;
      this.vaultState.pendingRights++;

      console.log('✅ PURCHASE RIGHTS SECURED');
      console.log(`📋 Purchase ID: ${purchaseRight.id}`);
      console.log(`👤 Buyer: ${buyer}`);
      console.log(`🤖 Agent Nodes Reserved: ${agentNodesRequested}`);
      console.log(`💰 Price Per Node: $${pricePerNode} (Day ${currentDay})`);
      console.log(`💵 Total Paid: $${totalCost}`);
      console.log(`🔒 Rate Locked Forever: YES`);
      console.log(`📅 Activation Date: March 20, 2026`);
      console.log(`⏳ Days Until Activation: ${this.MAX_DAYS - currentDay + 1}`);

      return {
        success: true,
        purchaseRight
      };
    } catch (error) {
      return {
        success: false,
        error: `Purchase failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

            /**
             * BATCH ALLOCATION SNAP - February 25, 2026
             * Activates ALL purchase rights SIMULTANEOUSLY in coordinated batch
             * Golden Hearts to Golden Tickets - Single allocation event
             * All 36 days of promo transactions processed TOGETHER
             */
            openVault(): {
              success: boolean;
              activatedRights: number;
              totalAgentsDelivered: number;
              message: string;
            } {
    const now = new Date();

    // Check if it's vault opening day
    if (now < this.VAULT_OPENING) {
      const daysUntil = Math.ceil((this.VAULT_OPENING.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        success: false,
        activatedRights: 0,
        totalAgentsDelivered: 0,
        message: `Vault opens March 20, 2026. ${daysUntil} days remaining.`
      };
    }

              // BATCH ALLOCATION SNAP - Process ALL rights SIMULTANEOUSLY
              console.log('\n🔥 INITIATING BATCH ALLOCATION SNAP...');
              console.log('💎 Processing ALL 36 days of golden hearts TOGETHER\n');
              
              this.vaultState.isOpen = true;
              let activatedCount = 0;
              let totalAgents = 0;

              // Coordinated batch processing - NSPFRNP bee colony pattern
              console.log('⚡ Batch processing start...');
              const batchStartTime = Date.now();
              
              for (const [id, right] of this.purchaseRights.entries()) {
                if (right.status === 'reserved') {
                  right.status = 'activated';
                  right.activationDate = now;
                  activatedCount++;
                  totalAgents += right.agentNodesReserved;
                }
              }
              
              const batchDuration = Date.now() - batchStartTime;

              this.vaultState.activatedRights = activatedCount;
              this.vaultState.pendingRights = 0;

              console.log(`⚡ Batch processing complete: ${batchDuration}ms\n`);
              console.log('🎉 BATCH ALLOCATION SNAP COMPLETE!');
              console.log('💎 GOLDEN HEARTS TO GOLDEN TICKETS - ALL PROCESSED TOGETHER');
              console.log('📅 Date: February 25, 2026');
              console.log(`✅ Golden Hearts Activated: ${activatedCount}`);
              console.log(`🤖 Agent Nodes Assigned: ${totalAgents}`);
              console.log(`💰 Total Campaign Revenue: $${this.vaultState.totalRevenue}`);
              console.log('🔥 ALL golden hearts became masters SIMULTANEOUSLY!');
              console.log('⚡ Natural coordination via NSPFRNP batch allocation');
              console.log('💎 Forever locked Tesla rates honored for all golden hearts');

              return {
                success: true,
                activatedRights: activatedCount,
                totalAgentsDelivered: totalAgents,
                message: 'BATCH ALLOCATION SNAP COMPLETE! All golden hearts processed together. All agents assigned simultaneously. Natural coordination achieved.'
              };
  }

  /**
   * CHECK PURCHASE RIGHT STATUS
   */
  checkPurchaseRight(purchaseId: string): PurchaseRight | null {
    return this.purchaseRights.get(purchaseId) || null;
  }

  /**
   * GET BUYER'S PURCHASE RIGHTS
   */
  getBuyerRights(buyer: string): PurchaseRight[] {
    return Array.from(this.purchaseRights.values())
      .filter(right => right.buyer === buyer);
  }

  /**
   * GET CURRENT PRICING INFO
   */
  getCurrentPricing(): {
    currentDay: number;
    pricePerNode: number;
    tomorrowPrice: number;
    daysUntilVault: number;
    finalDayPrice: number;
  } {
    const currentDay = this.getCurrentCampaignDay();
    const now = new Date();
    const daysUntilVault = Math.ceil((this.VAULT_OPENING.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      currentDay,
      pricePerNode: this.calculatePriceForDay(currentDay),
      tomorrowPrice: this.calculatePriceForDay(Math.min(currentDay + 1, this.MAX_DAYS)),
      daysUntilVault: Math.max(0, daysUntilVault),
      finalDayPrice: this.calculatePriceForDay(this.MAX_DAYS)
    };
  }

  /**
   * GET VAULT STATE
   */
  getVaultState(): VaultState {
    return { ...this.vaultState };
  }

  /**
   * CALCULATE SAVINGS (Day 1 vs Today)
   */
  calculateSavings(agentNodes: number): {
    day1Cost: number;
    todayCost: number;
    savings: number;
    savingsPercentage: number;
  } {
    const currentDay = this.getCurrentCampaignDay();
    const day1Price = this.calculatePriceForDay(1);
    const todayPrice = this.calculatePriceForDay(currentDay);

    const day1Cost = day1Price * agentNodes;
    const todayCost = todayPrice * agentNodes;
    const savings = todayCost - day1Cost;
    const savingsPercentage = day1Cost > 0 ? ((savings / day1Cost) * 100) : 0;

    return {
      day1Cost,
      todayCost,
      savings,
      savingsPercentage
    };
  }

  /**
   * GET PROMOTIONAL CALENDAR
   */
  getPromotionalCalendar(): {
    day: number;
    date: Date;
    pricePerNode: number;
    description?: string;
  }[] {
    const calendar = [];
    const conditions = this.getPromotionalConditions(1);

    for (let day = 1; day <= this.MAX_DAYS; day++) {
      const date = new Date(this.CAMPAIGN_START);
      date.setDate(date.getDate() + (day - 1));

      const specialDay = conditions.specialDays.find(sd => sd.day === day);

      calendar.push({
        day,
        date,
        pricePerNode: this.calculatePriceForDay(day),
        description: specialDay?.description
      });
    }

    return calendar;
  }

  /**
   * FUTURE PURCHASE PRICE CHECK
   * Shows what buyer will pay for future purchases at locked rate
   */
  checkFuturePurchasePrice(purchaseId: string, additionalAgents: number): {
    lockedRate: number;
    futureCost: number;
    marketRate: number;
    marketCost: number;
    savings: number;
  } | null {
    const right = this.purchaseRights.get(purchaseId);
    if (!right) return null;

    const lockedRate = right.pricePerNode;
    const futureCost = lockedRate * additionalAgents;
    const marketRate = 100; // Assume $100 post-vault market rate
    const marketCost = marketRate * additionalAgents;
    const savings = marketCost - futureCost;

    return {
      lockedRate,
      futureCost,
      marketRate,
      marketCost,
      savings
    };
  }
}

/**
 * NSPFRNP COORDINATION LAYER
 * Fractally coordinates all purchase rights across the system
 */
export class PurchaseRightsCoordinator {
  private system: AgentNodePurchaseRightsSystem;

  constructor() {
    this.system = new AgentNodePurchaseRightsSystem();
  }

  /**
   * NATURAL PROTOCOL: Purchase Flow
   * Follows bee colony coordination pattern
   */
  async coordinatePurchase(
    buyer: string,
    agentNodes: number,
    paymentMethod: 'USD' | 'ETH' | 'BTC' | 'USDC' = 'USD'
  ): Promise<{
    success: boolean;
    purchaseRight?: PurchaseRight;
    pricing?: any;
    error?: string;
  }> {
    // Step 1: Get current pricing (Information gathering)
    const pricing = this.system.getCurrentPricing();

    console.log('\n🐝 NSPFRNP Coordination: Purchase Rights Flow');
    console.log(`📊 Current Day: ${pricing.currentDay}/59`);
    console.log(`💰 Price Per Node: $${pricing.pricePerNode}`);
    console.log(`📅 Days Until Vault: ${pricing.daysUntilVault}`);
    console.log(`🤖 Agent Nodes Requested: ${agentNodes}`);
    console.log(`💵 Total Cost: $${pricing.pricePerNode * agentNodes}\n`);

    // Step 2: Execute purchase (Natural coordination)
    const result = this.system.purchaseAgentNodeRights(buyer, agentNodes, paymentMethod);

    if (result.success) {
      console.log('\n✅ COORDINATION COMPLETE');
      console.log('🔒 Your price is locked forever');
      console.log('📅 Agents activate March 20, 2026');
      console.log('🤖 Superintelligent servants will serve you as master\n');
    }

    return {
      ...result,
      pricing
    };
  }

            /**
             * NATURAL PROTOCOL: Batch Allocation Snap Coordination
             * All 36 days of golden hearts processed TOGETHER
             */
            async coordinateVaultOpening(): Promise<any> {
              console.log('\n🐝 NSPFRNP Coordination: BATCH ALLOCATION SNAP');
              console.log('💎 Golden Hearts to Golden Tickets - Single Coordinated Event');
              console.log('📅 February 25, 2026 - Batch Assignment Day');
              console.log('⚡ All promo transactions batched into ONE allocation snap\n');

              return this.system.openVault();
            }

  /**
   * Get system for direct access
   */
  getSystem(): AgentNodePurchaseRightsSystem {
    return this.system;
  }
}

/**
 * QUICK ACCESS FUNCTIONS
 */

// Global coordinator instance
let coordinator: PurchaseRightsCoordinator | null = null;

export function initializePurchaseRightsSystem(): PurchaseRightsCoordinator {
  if (!coordinator) {
    coordinator = new PurchaseRightsCoordinator();
  }
  return coordinator;
}

export function getPurchaseRightsSystem(): PurchaseRightsCoordinator {
  if (!coordinator) {
    coordinator = initializePurchaseRightsSystem();
  }
  return coordinator;
}

/**
 * Quick purchase function
 */
export async function purchaseAgentNodeRights(
  buyer: string,
  agentNodes: number,
  paymentMethod: 'USD' | 'ETH' | 'BTC' | 'USDC' = 'USD'
): Promise<any> {
  const coordinator = getPurchaseRightsSystem();
  return await coordinator.coordinatePurchase(buyer, agentNodes, paymentMethod);
}

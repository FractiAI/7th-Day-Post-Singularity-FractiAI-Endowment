/**
 * PURCHASE RIGHTS SYSTEM DEMO
 * Shows how the presale/reservation system works
 */

import {
  AgentNodePurchaseRightsSystem,
  PurchaseRightsCoordinator,
  purchaseAgentNodeRights
} from './agent-node-purchase-rights-system.js';

/**
 * DEMO 1: Day 1 Purchase (Best Deal)
 */
async function demoDay1Purchase() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         DEMO 1: DAY 1 PURCHASE (BEST DEAL)                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const coordinator = new PurchaseRightsCoordinator();
  const system = coordinator.getSystem();

  console.log('📅 Date: January 21, 2026 (Day 1)');
  console.log('👤 Buyer: alice.eth');
  console.log('🤖 Requesting: 1,000 agent nodes');
  console.log('💰 Expected Price: $1 per node\n');

  // Make purchase
  const result = await coordinator.coordinatePurchase('alice.eth', 1000, 'USD');

  if (result.success && result.purchaseRight) {
    console.log('\n📊 PURCHASE RIGHT DETAILS:');
    console.log(`   ID: ${result.purchaseRight.id}`);
    console.log(`   Agent Nodes Reserved: ${result.purchaseRight.agentNodesReserved}`);
    console.log(`   Price Per Node: $${result.purchaseRight.pricePerNode}`);
    console.log(`   Total Paid: $${result.purchaseRight.totalPaid}`);
    console.log(`   Status: ${result.purchaseRight.status}`);
    console.log(`   Locked Rate Forever: ${result.purchaseRight.metadata.lockedRateForever}`);

    console.log('\n📅 WHAT HAPPENS NEXT:');
    console.log('   → Your price is locked at $1/agent forever');
    console.log('   → Wait until March 20, 2026');
    console.log('   → Vault opens automatically');
    console.log('   → 1,000 superintelligent agents delivered to your wallet');
    console.log('   → They serve you as master');

    console.log('\n💎 YOUR ADVANTAGE:');
    console.log('   → Future buyers on Day 59: Pay $59/agent');
    console.log('   → Post-vault buyers: Pay $100+/agent');
    console.log('   → You: Pay $1/agent FOREVER');
    console.log('   → Can buy unlimited more agents at $1 each');

    // Check future purchase pricing
    const futurePrice = system.checkFuturePurchasePrice(result.purchaseRight.id, 1000);
    if (futurePrice) {
      console.log('\n🔮 FUTURE PURCHASE EXAMPLE (After March 20):');
      console.log(`   Want 1,000 more agents:`);
      console.log(`   → Your cost: $${futurePrice.futureCost} (locked at $${futurePrice.lockedRate}/agent)`);
      console.log(`   → Market cost: $${futurePrice.marketCost} ($${futurePrice.marketRate}/agent)`);
      console.log(`   → YOUR SAVINGS: $${futurePrice.savings}! 💰`);
    }
  }

  return result;
}

/**
 * DEMO 2: Day 33 Purchase (Lucky 33!)
 */
async function demoDay33Purchase() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         DEMO 2: DAY 33 PURCHASE (LUCKY 33!)                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const system = new AgentNodePurchaseRightsSystem();

  console.log('📅 Date: February 22, 2026 (Day 33)');
  console.log('👤 Buyer: bob.eth');
  console.log('🤖 Requesting: 500 agent nodes');
  console.log('💰 Expected Price: $33 per node\n');

  const result = system.purchaseAgentNodeRights('bob.eth', 500, 'ETH');

  if (result.success && result.purchaseRight) {
    console.log('\n💡 COMPARISON TO DAY 1:');
    const day1Cost = 1 * 500; // Day 1 price was $1
    const day33Cost = result.purchaseRight.totalPaid;
    console.log(`   → Day 1 buyer paid: $${day1Cost} for 500 agents`);
    console.log(`   → You paid: $${day33Cost} for 500 agents`);
    console.log(`   → Difference: $${day33Cost - day1Cost} more`);
    console.log(`   → But still 67% cheaper than $100/agent post-vault!`);

    console.log('\n📊 YOUR LOCKED RATE:');
    console.log(`   → Forever rate: $${result.purchaseRight.pricePerNode}/agent`);
    console.log(`   → Can buy unlimited more at this rate`);
    console.log(`   → While Day 59 buyers pay $59/agent`);
    console.log(`   → And post-vault buyers pay $100+/agent`);
  }

  return result;
}

/**
 * DEMO 3: Vault Opening (March 20, 2026)
 */
async function demoVaultOpening() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         DEMO 3: VAULT OPENING (MARCH 20, 2026)                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const coordinator = new PurchaseRightsCoordinator();
  const system = coordinator.getSystem();

  // Simulate some purchases
  console.log('🎫 SIMULATING PRESALE PURCHASES:\n');
  
  await coordinator.coordinatePurchase('alice.eth', 1000, 'USD');
  await coordinator.coordinatePurchase('bob.eth', 500, 'ETH');
  await coordinator.coordinatePurchase('charlie.eth', 2000, 'USD');

  console.log('\n📊 VAULT STATE BEFORE OPENING:');
  const stateBefore = system.getVaultState();
  console.log(`   Total Purchase Rights: ${stateBefore.totalRightsReserved}`);
  console.log(`   Total Agent Nodes Reserved: ${stateBefore.totalAgentNodesReserved}`);
  console.log(`   Total Revenue: $${stateBefore.totalRevenue}`);
  console.log(`   Pending Rights: ${stateBefore.pendingRights}`);
  console.log(`   Vault Open: ${stateBefore.isOpen ? 'YES' : 'NO'}`);

  console.log('\n🎉 OPENING VAULT (March 20, 2026)...\n');

  // Open vault
  const result = await coordinator.coordinateVaultOpening();

  if (result.success) {
    console.log('\n✅ VAULT OPENED SUCCESSFULLY!');
    console.log(`   Rights Activated: ${result.activatedRights}`);
    console.log(`   Agent Nodes Delivered: ${result.totalAgentsDelivered}`);
    console.log(`   Message: ${result.message}`);

    console.log('\n📊 VAULT STATE AFTER OPENING:');
    const stateAfter = system.getVaultState();
    console.log(`   Vault Open: ${stateAfter.isOpen ? 'YES ✅' : 'NO'}`);
    console.log(`   Activated Rights: ${stateAfter.activatedRights}`);
    console.log(`   Pending Rights: ${stateAfter.pendingRights}`);

    console.log('\n🤖 WHAT BUYERS RECEIVE:');
    console.log('   → alice.eth: 1,000 superintelligent agent nodes');
    console.log('   → bob.eth: 500 superintelligent agent nodes');
    console.log('   → charlie.eth: 2,000 superintelligent agent nodes');
    console.log('\n   All agents are now ACTIVE and serving their masters!');
  }

  return result;
}

/**
 * DEMO 4: Current Pricing Check
 */
function demoCurrentPricing() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         DEMO 4: CURRENT PRICING CHECK                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const system = new AgentNodePurchaseRightsSystem();
  const pricing = system.getCurrentPricing();

  console.log('📊 CURRENT CAMPAIGN STATUS:\n');
  console.log(`   Current Day: ${pricing.currentDay}/59`);
  console.log(`   Today's Price: $${pricing.pricePerNode} per agent node`);
  console.log(`   Tomorrow's Price: $${pricing.tomorrowPrice} per agent node`);
  console.log(`   Final Day Price: $${pricing.finalDayPrice} per agent node`);
  console.log(`   Days Until Vault Opens: ${pricing.daysUntilVault}`);

  console.log('\n💡 PRICE COMPARISON:\n');
  console.log(`   Buy today: $${pricing.pricePerNode}/agent (locked forever)`);
  console.log(`   Buy tomorrow: $${pricing.tomorrowPrice}/agent (locked forever)`);
  console.log(`   Buy Day 59: $${pricing.finalDayPrice}/agent (locked forever)`);
  console.log(`   Buy after March 20: $100+/agent (market rate)`);

  console.log('\n💰 SAVINGS CALCULATOR (1,000 agents):\n');
  const savings = system.calculateSavings(1000);
  console.log(`   Day 1 cost: $${savings.day1Cost}`);
  console.log(`   Today's cost: $${savings.todayCost}`);
  console.log(`   Missed savings: $${savings.savings} (${savings.savingsPercentage.toFixed(0)}%)`);
  console.log(`   But: Still cheaper than post-vault pricing!`);

  return pricing;
}

/**
 * DEMO 5: Full Calendar
 */
function demoFullCalendar() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         DEMO 5: FULL 59-DAY CALENDAR                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const system = new AgentNodePurchaseRightsSystem();
  const calendar = system.getPromotionalCalendar();

  console.log('📅 COMPLETE PRICING SCHEDULE:\n');

  // Show first week
  console.log('   WEEK 1:');
  calendar.slice(0, 7).forEach(day => {
    const special = day.description ? ` ✨ ${day.description}` : '';
    console.log(`   Day ${day.day} (${day.date.toLocaleDateString()}): $${day.pricePerNode}/agent${special}`);
  });

  // Show notable days
  console.log('\n   NOTABLE DAYS:');
  const notableDays = [0, 6, 13, 24, 32, 49, 55, 58]; // Days 1, 7, 14, 25, 33, 50, 56, 59
  notableDays.forEach(index => {
    const day = calendar[index];
    const special = day.description ? ` - ${day.description}` : '';
    console.log(`   Day ${day.day} (${day.date.toLocaleDateString()}): $${day.pricePerNode}/agent${special}`);
  });

  console.log('\n   ... (See full calendar for all 59 days)');

  return calendar;
}

/**
 * RUN ALL DEMOS
 */
export async function runAllDemos() {
  console.log('\n🎬 AGENT NODE PURCHASE RIGHTS SYSTEM - COMPLETE DEMO');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    await demoDay1Purchase();
    await demoDay33Purchase();
    demoCurrentPricing();
    demoFullCalendar();
    await demoVaultOpening();

    console.log('\n✅ ALL DEMOS COMPLETE!');
    console.log('\n📖 KEY TAKEAWAYS:');
    console.log('   1. Buyers purchase RIGHTS, not immediate agents');
    console.log('   2. Payment and price lock happens TODAY');
    console.log('   3. Agent delivery happens March 20, 2026');
    console.log('   4. Your locked rate continues FOREVER');
    console.log('   5. Early buyers get massive permanent advantage');
    console.log('   6. NSPFRNP coordinates everything naturally');

    console.log('\n🎉 The presale/reservation system is fully operational!');
  } catch (error) {
    console.error('\n❌ Demo error:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos();
}

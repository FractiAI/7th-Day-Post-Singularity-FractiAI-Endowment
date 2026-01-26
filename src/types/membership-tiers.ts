/**
 * Membership Tiers System
 * 
 * The four-tier structure for Vibeverse venues:
 * 1. Guests - Entry level access
 * 2. Members - Full membership access
 * 3. Ultimate VIPs - Premium tier access
 * 4. Ballers - Highest tier access
 */

export type MembershipTier = 'guest' | 'member' | 'ultimate-vip' | 'baller';

export interface MembershipTierConfig {
  tier: MembershipTier;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  features: string[];
  pricing?: {
    monthly?: number;
    annual?: number;
    lifetime?: number;
  };
}

export const MEMBERSHIP_TIERS: Record<MembershipTier, MembershipTierConfig> = {
  guest: {
    tier: 'guest',
    name: 'Guest',
    displayName: 'Guest Access',
    icon: '🎫',
    description: 'Entry level access to Vibeverse experiences',
    features: [
      'Basic venue access',
      'Public events',
      'Limited features',
      'Guest pricing'
    ]
  },
  member: {
    tier: 'member',
    name: 'Member',
    displayName: 'Member',
    icon: '🏛️',
    description: 'Full membership with complete access',
    features: [
      'Full venue access',
      'Members-only events',
      'All standard features',
      'Member pricing (10% discount)',
      'Priority support'
    ]
  },
  'ultimate-vip': {
    tier: 'ultimate-vip',
    name: 'Ultimate VIP',
    displayName: 'Ultimate VIP',
    icon: '👑',
    description: 'Premium tier with exclusive access',
    features: [
      'VIP venue access',
      'Exclusive events',
      'All premium features',
      'Ultimate VIP pricing (50% discount)',
      'Personal Hero Host',
      'Priority booking',
      'Chairman console access'
    ]
  },
  baller: {
    tier: 'baller',
    name: 'Baller',
    displayName: 'Baller',
    icon: '🐋',
    description: 'Highest tier - After party, Cheese Baller level',
    features: [
      'Ultimate access everywhere',
      'After party access',
      'Cheese Baller level privileges',
      'All features unlocked',
      'Maximum discounts',
      'Dedicated concierge',
      'Custom experiences',
      'Backroom unlimited access'
    ]
  }
};

/**
 * Get tier configuration
 */
export function getTierConfig(tier: MembershipTier): MembershipTierConfig {
  return MEMBERSHIP_TIERS[tier];
}

/**
 * Get all tiers in order
 */
export function getAllTiers(): MembershipTierConfig[] {
  return [
    MEMBERSHIP_TIERS.guest,
    MEMBERSHIP_TIERS.member,
    MEMBERSHIP_TIERS['ultimate-vip'],
    MEMBERSHIP_TIERS.baller
  ];
}

/**
 * Check if tier has access to feature
 */
export function tierHasAccess(tier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierOrder: MembershipTier[] = ['guest', 'member', 'ultimate-vip', 'baller'];
  const userIndex = tierOrder.indexOf(tier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}

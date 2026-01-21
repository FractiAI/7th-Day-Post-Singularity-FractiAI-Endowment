/**
 * STRIPE OCTAVE BRIDGE
 * Connect legacy payment systems to post-singularity economy
 * Octave 1-2-3-4 Energy Bridge
 */

import Stripe from 'stripe';

export interface OctaveLevel {
  level: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  features: string[];
}

export interface PaymentIntent {
  id: string;
  amount: number; // USD cents
  currency: string;
  customerId: string;
  octaveLevel: 1 | 2 | 3 | 4;
  metadata: {
    noteQuantity?: number;
    notePrice?: number;
    purchaseDay?: number;
    userId?: string;
  };
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
}

export class StripeOctaveBridge {
  private stripe: Stripe;
  private octaveLevels: Record<number, OctaveLevel> = {
    1: {
      level: 1,
      name: 'Basic Purchase',
      description: 'Standard payment processing',
      features: [
        'Immediate note delivery',
        'Wallet auto-created',
        'NFT trading card minted',
        'Node activation (if available)'
      ]
    },
    2: {
      level: 2,
      name: 'Subscription Flow',
      description: 'Recurring note purchases',
      features: [
        'Daily/Weekly/Monthly auto-purchase',
        'Auto-price adjustment tracking',
        'Portfolio auto-growth',
        'Priority node allocation',
        'Discount tiers (5-20% based on commitment)'
      ]
    },
    3: {
      level: 3,
      name: 'Business Integration',
      description: 'API access for businesses',
      features: [
        'API key provisioning',
        'Bulk purchase discounts',
        'White-label options',
        'Custom branding',
        'Revenue sharing program (50/50)',
        'Reseller portal access'
      ]
    },
    4: {
      level: 4,
      name: 'Enterprise Connection',
      description: 'Custom enterprise integration',
      features: [
        'Dedicated account manager',
        'Custom integration support',
        'Volume discounts (up to 40%)',
        'Direct node allocation',
        'Custom smart contracts',
        'Priority support 24/7'
      ]
    }
  };

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia'
    });
  }

  /**
   * OCTAVE 1: Basic Purchase
   * Standard one-time payment
   */
  async createBasicPurchase(
    userId: string,
    noteQuantity: number,
    pricePerNote: number,
    email: string
  ): Promise<PaymentIntent> {
    const amount = Math.round(noteQuantity * pricePerNote * 100); // Convert to cents

    // Create or retrieve customer
    const customer = await this.getOrCreateCustomer(userId, email);

    // Create payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        octaveLevel: '1',
        noteQuantity: noteQuantity.toString(),
        notePrice: pricePerNote.toString(),
        purchaseDay: this.getCurrentDay().toString(),
        userId
      }
    });

    return {
      id: paymentIntent.id,
      amount,
      currency: 'usd',
      customerId: customer.id,
      octaveLevel: 1,
      metadata: {
        noteQuantity,
        notePrice: pricePerNote,
        purchaseDay: this.getCurrentDay(),
        userId
      },
      status: 'pending'
    };
  }

  /**
   * OCTAVE 2: Subscription Flow
   * Recurring payment for automatic note purchases
   */
  async createSubscription(
    userId: string,
    interval: 'day' | 'week' | 'month',
    notesPerInterval: number,
    email: string
  ): Promise<string> {
    const customer = await this.getOrCreateCustomer(userId, email);

    // Calculate base price (will adjust daily)
    const currentPrice = this.getCurrentNotePrice();
    const amount = Math.round(notesPerInterval * currentPrice * 100);

    // Create product
    const product = await this.stripe.products.create({
      name: `Gold Rush Notes - ${interval}ly Subscription`,
      description: `Automatic purchase of ${notesPerInterval} notes every ${interval}`,
      metadata: {
        octaveLevel: '2',
        notesPerInterval: notesPerInterval.toString(),
        interval
      }
    });

    // Create price
    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      recurring: {
        interval,
        interval_count: 1
      }
    });

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      metadata: {
        octaveLevel: '2',
        notesPerInterval: notesPerInterval.toString(),
        interval,
        userId
      }
    });

    return subscription.id;
  }

  /**
   * OCTAVE 3: Business Integration
   * API key for business integrations
   */
  async createBusinessAccount(
    businessName: string,
    email: string,
    userId: string,
    whiteLabelDomain?: string
  ): Promise<{ apiKey: string; customerId: string; portalUrl: string }> {
    const customer = await this.getOrCreateCustomer(userId, email);

    // Update customer metadata for business tier
    await this.stripe.customers.update(customer.id, {
      metadata: {
        octaveLevel: '3',
        businessName,
        whiteLabelDomain: whiteLabelDomain || '',
        userId
      }
    });

    // Generate API key (would be done in our system, not Stripe)
    const apiKey = this.generateApiKey(userId, 'business');

    // Create billing portal session for self-service
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `https://nspfrp-post-singularity-fsr.vercel.app/business/dashboard`
    });

    return {
      apiKey,
      customerId: customer.id,
      portalUrl: portalSession.url
    };
  }

  /**
   * OCTAVE 4: Enterprise Connection
   * Custom enterprise solutions
   */
  async createEnterpriseAccount(
    companyName: string,
    contactEmail: string,
    userId: string,
    nodeAllocation: number,
    customTerms: any
  ): Promise<{ customerId: string; accountManagerId: string; contractId: string }> {
    const customer = await this.getOrCreateCustomer(userId, contactEmail);

    // Update customer for enterprise tier
    await this.stripe.customers.update(customer.id, {
      name: companyName,
      metadata: {
        octaveLevel: '4',
        nodeAllocation: nodeAllocation.toString(),
        enterpriseTier: 'true',
        userId
      }
    });

    // Assign account manager (would integrate with CRM)
    const accountManagerId = this.assignAccountManager(customer.id);

    // Create contract (would integrate with DocuSign or similar)
    const contractId = await this.createEnterpriseContract(
      customer.id,
      companyName,
      customTerms
    );

    return {
      customerId: customer.id,
      accountManagerId,
      contractId
    };
  }

  /**
   * Process webhook from Stripe
   */
  async handleWebhook(
    rawBody: string,
    signature: string,
    webhookSecret: string
  ): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'subscription.created':
      case 'subscription.updated':
        await this.handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        // Subscription payment successful - deliver notes
        await this.handleSubscriptionPayment(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Helper methods
   */

  private async getOrCreateCustomer(userId: string, email: string): Promise<Stripe.Customer> {
    // Search for existing customer
    const customers = await this.stripe.customers.search({
      query: `metadata['userId']:'${userId}'`
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    // Create new customer
    return await this.stripe.customers.create({
      email,
      metadata: {
        userId,
        octaveLevel: '1' // Default
      }
    });
  }

  private getCurrentDay(): number {
    const launchDate = new Date('2026-01-21');
    const now = new Date();
    const daysSinceLaunch = Math.floor(
      (now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLaunch + 1;
  }

  private getCurrentNotePrice(): number {
    const day = this.getCurrentDay();
    return day; // $1 on day 1, $2 on day 2, etc.
  }

  private generateApiKey(userId: string, tier: string): string {
    // In production, use crypto.randomBytes and store securely
    return `grnote_${tier}_${userId}_${Date.now()}`;
  }

  private assignAccountManager(customerId: string): string {
    // In production, integrate with CRM system
    return `am_${customerId}_${Date.now()}`;
  }

  private async createEnterpriseContract(
    customerId: string,
    companyName: string,
    terms: any
  ): Promise<string> {
    // In production, integrate with DocuSign or similar
    return `contract_${customerId}_${Date.now()}`;
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Extract metadata
    const { noteQuantity, notePrice, purchaseDay, userId } = paymentIntent.metadata;

    // Deliver notes to user
    // await this.deliverNotes(userId, parseInt(noteQuantity), parseInt(purchaseDay));
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('Payment failed:', paymentIntent.id);
    
    // Notify user
    // await this.notifyPaymentFailure(paymentIntent.metadata.userId);
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    console.log('Subscription updated:', subscription.id);
    
    // Update user's subscription status
    // await this.updateSubscriptionStatus(subscription.metadata.userId, subscription);
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
    console.log('Subscription canceled:', subscription.id);
    
    // Cancel future deliveries
    // await this.cancelFutureDeliveries(subscription.metadata.userId);
  }

  private async handleSubscriptionPayment(invoice: Stripe.Invoice): Promise<void> {
    console.log('Subscription payment received:', invoice.id);
    
    // Deliver notes for this period
    // Extract from subscription metadata
    // await this.deliverSubscriptionNotes(invoice);
  }

  /**
   * Get octave level information
   */
  getOctaveLevel(level: 1 | 2 | 3 | 4): OctaveLevel {
    return this.octaveLevels[level];
  }

  /**
   * Get all octave levels
   */
  getAllOctaveLevels(): OctaveLevel[] {
    return Object.values(this.octaveLevels);
  }

  /**
   * Calculate discount for octave level
   */
  calculateDiscount(octaveLevel: 1 | 2 | 3 | 4, quantity: number): number {
    const discounts: Record<number, Record<string, number>> = {
      1: { base: 0 },
      2: { daily: 0.05, weekly: 0.10, monthly: 0.20 },
      3: { base: 0.15, bulk1000: 0.25, bulk10000: 0.35 },
      4: { base: 0.20, custom: 0.40 }
    };

    // Simplified discount calculation
    if (octaveLevel === 1) return 0;
    if (octaveLevel === 2) return 0.10; // Average 10%
    if (octaveLevel === 3) {
      if (quantity >= 10000) return 0.35;
      if (quantity >= 1000) return 0.25;
      return 0.15;
    }
    if (octaveLevel === 4) return 0.30; // Enterprise average

    return 0;
  }
}

// Create global instance
let stripeOctaveBridge: StripeOctaveBridge | null = null;

export function initStripeOctaveBridge(apiKey: string): StripeOctaveBridge {
  stripeOctaveBridge = new StripeOctaveBridge(apiKey);
  return stripeOctaveBridge;
}

export function getStripeOctaveBridge(): StripeOctaveBridge {
  if (!stripeOctaveBridge) {
    throw new Error('Stripe Octave Bridge not initialized. Call initStripeOctaveBridge() first.');
  }
  return stripeOctaveBridge;
}

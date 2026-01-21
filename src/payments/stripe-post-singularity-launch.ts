/**
 * Stripe Payment Integration for Post-Singularity Game Launch
 * VibeCloud - Opening Day: $1 per SYNTH
 * Then: $1 per SYNTH per day until no more
 */

import Stripe from 'stripe';

export interface SYNTHPurchaseConfig {
  amount: number; // Amount in SYNTH tokens
  pricePerSYNTH: number; // Price per SYNTH in USD
  totalPrice: number; // Total price in USD
  purchaseDate: number;
  dayNumber: number; // Days since opening
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
  amount: number;
  currency: string;
  metadata: Record<string, string>;
}

export interface LaunchPricing {
  openingDayPrice: number; // $1 per SYNTH
  dailyPrice: number; // $1 per SYNTH per day
  currentDay: number; // Days since opening
  currentPricePerSYNTH: number;
  totalSYNTHAvailable: number; // 90T SYNTH
  totalSYNTHSold: number;
  remainingSYNTH: number;
}

export class StripePostSingularityLaunch {
  private stripe: Stripe;
  private openingDate: number; // Timestamp of opening day
  private totalSYNTHAvailable: number = 90_000_000_000_000; // 90 Trillion
  private totalSYNTHSold: number = 0;
  private openingDayPrice: number = 1.00; // $1 per SYNTH
  private dailyPrice: number = 1.00; // $1 per SYNTH per day

  constructor(stripeSecretKey: string, openingDate?: number) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia'
    });
    this.openingDate = openingDate || Date.now();
  }

  /**
   * Get current launch pricing
   */
  getLaunchPricing(): LaunchPricing {
    const currentDay = this.getCurrentDay();
    const currentPricePerSYNTH = this.calculateCurrentPrice(currentDay);

    return {
      openingDayPrice: this.openingDayPrice,
      dailyPrice: this.dailyPrice,
      currentDay,
      currentPricePerSYNTH,
      totalSYNTHAvailable: this.totalSYNTHAvailable,
      totalSYNTHSold: this.totalSYNTHSold,
      remainingSYNTH: this.totalSYNTHAvailable - this.totalSYNTHSold
    };
  }

  /**
   * Calculate current day since opening
   */
  private getCurrentDay(): number {
    const now = Date.now();
    const diffMs = now - this.openingDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Calculate current price per SYNTH
   * Opening day: $1 per SYNTH
   * Then: $1 per SYNTH per day (so day 2 = $2, day 3 = $3, etc.)
   */
  private calculateCurrentPrice(dayNumber: number): number {
    if (dayNumber === 0) {
      return this.openingDayPrice; // $1 on opening day
    }
    // $1 per SYNTH per day
    return this.dailyPrice * (dayNumber + 1);
  }

  /**
   * Create Stripe checkout session for SYNTH purchase
   */
  async createSYNTHPurchaseSession(
    amountSYNTH: number,
    customerEmail: string,
    walletAddress?: string,
    successUrl?: string,
    cancelUrl?: string
  ): Promise<StripeCheckoutSession> {
    const pricing = this.getLaunchPricing();

    // Validate purchase
    if (amountSYNTH > pricing.remainingSYNTH) {
      throw new Error(`Insufficient SYNTH available. Remaining: ${pricing.remainingSYNTH.toLocaleString()}`);
    }

    if (amountSYNTH <= 0) {
      throw new Error('Purchase amount must be greater than 0');
    }

    // Calculate total price
    const totalPriceUSD = amountSYNTH * pricing.currentPricePerSYNTH;

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Post-Singularity Game SYNTH Tokens',
              description: `${amountSYNTH.toLocaleString()} SYNTH tokens for Post-Singularity Game on VibeCloud`,
              images: ['https://vibechain.vibecloud.io/images/synth-token.png'],
              metadata: {
                synth_amount: amountSYNTH.toString(),
                price_per_synth: pricing.currentPricePerSYNTH.toString(),
                day_number: pricing.currentDay.toString()
              }
            },
            unit_amount: Math.round(pricing.currentPricePerSYNTH * 100), // Convert to cents
            recurring: undefined
          },
          quantity: amountSYNTH
        }
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        synth_amount: amountSYNTH.toString(),
        price_per_synth: pricing.currentPricePerSYNTH.toString(),
        day_number: pricing.currentDay.toString(),
        purchase_type: 'synth_tokens',
        game: 'post_singularity',
        platform: 'vibecloud',
        ...(walletAddress && { wallet_address: walletAddress })
      },
      success_url: successUrl || 'https://vibechain.vibecloud.io/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'https://vibechain.vibecloud.io/cancel',
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return {
      sessionId: session.id,
      url: session.url || '',
      amount: totalPriceUSD,
      currency: 'usd',
      metadata: {
        synth_amount: amountSYNTH.toString(),
        price_per_synth: pricing.currentPricePerSYNTH.toString(),
        day_number: pricing.currentDay.toString()
      }
    };
  }

  /**
   * Handle Stripe webhook for successful payment
   */
  async handlePaymentSuccess(sessionId: string): Promise<{
    success: boolean;
    synthAmount: number;
    pricePerSYNTH: number;
    totalPaid: number;
    customerEmail: string;
    walletAddress?: string;
  }> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer']
    });

    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    const synthAmount = parseInt(session.metadata?.synth_amount || '0');
    const pricePerSYNTH = parseFloat(session.metadata?.price_per_synth || '0');
    const totalPaid = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents
    const customerEmail = session.customer_email || '';
    const walletAddress = session.metadata?.wallet_address;

    // Update sold amount
    this.totalSYNTHSold += synthAmount;

    return {
      success: true,
      synthAmount,
      pricePerSYNTH,
      totalPaid,
      customerEmail,
      walletAddress
    };
  }

  /**
   * Create subscription for recurring SYNTH purchases
   */
  async createSYNTHSubscription(
    amountSYNTH: number,
    customerEmail: string,
    walletAddress?: string
  ): Promise<Stripe.Subscription> {
    const pricing = this.getLaunchPricing();

    // Create or retrieve customer
    const customers = await this.stripe.customers.list({
      email: customerEmail,
      limit: 1
    });

    let customer: Stripe.Customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await this.stripe.customers.create({
        email: customerEmail,
        metadata: {
          wallet_address: walletAddress || '',
          game: 'post_singularity',
          platform: 'vibecloud'
        }
      });
    }

    // Create price for subscription
    const price = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: Math.round(pricing.currentPricePerSYNTH * 100), // Convert to cents
      recurring: {
        interval: 'day',
        interval_count: 1
      },
      product_data: {
        name: 'Daily SYNTH Purchase',
        description: `${amountSYNTH.toLocaleString()} SYNTH tokens per day for Post-Singularity Game`
      },
      metadata: {
        synth_amount: amountSYNTH.toString(),
        game: 'post_singularity',
        platform: 'vibecloud'
      }
    });

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: price.id,
          quantity: amountSYNTH
        }
      ],
      metadata: {
        synth_amount: amountSYNTH.toString(),
        wallet_address: walletAddress || '',
        game: 'post_singularity',
        platform: 'vibecloud'
      }
    });

    return subscription;
  }

  /**
   * Get purchase history for customer
   */
  async getPurchaseHistory(customerEmail: string): Promise<SYNTHPurchaseConfig[]> {
    const customers = await this.stripe.customers.list({
      email: customerEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return [];
    }

    const customer = customers.data[0];
    const charges = await this.stripe.charges.list({
      customer: customer.id,
      limit: 100
    });

    return charges.data
      .filter(charge => charge.paid && charge.metadata?.purchase_type === 'synth_tokens')
      .map(charge => ({
        amount: parseInt(charge.metadata?.synth_amount || '0'),
        pricePerSYNTH: parseFloat(charge.metadata?.price_per_synth || '0'),
        totalPrice: charge.amount / 100, // Convert from cents
        purchaseDate: charge.created * 1000, // Convert to milliseconds
        dayNumber: parseInt(charge.metadata?.day_number || '0')
      }));
  }

  /**
   * Update sold SYNTH amount (for tracking)
   */
  updateSoldSYNTH(amount: number): void {
    this.totalSYNTHSold += amount;
  }

  /**
   * Get remaining SYNTH available
   */
  getRemainingSYNTH(): number {
    return this.totalSYNTHAvailable - this.totalSYNTHSold;
  }

  /**
   * Check if SYNTH is still available
   */
  isSYNTHAvailable(amount: number): boolean {
    return amount <= this.getRemainingSYNTH();
  }
}

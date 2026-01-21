/**
 * Stripe Launch API
 * Complete API for Post-Singularity Game launch with Stripe
 * VibeCloud Platform
 */

import express, { Request, Response, Router } from 'express';
import { PostSingularityStripeLaunch } from '../launch/post-singularity-stripe-launch.js';
import { ChairmanDeploymentSystem } from '../integration/chairman-deployment-system.js';
import { OCTANEAwarenessKeyDelivery } from '../integration/octane-awareness-key-delivery.js';
import { DeployAllNow } from '../deployment/deploy-all-now.js';

export class StripeLaunchAPI {
  private router: Router;
  private launch: PostSingularityStripeLaunch;
  private deploymentSystem: ChairmanDeploymentSystem;
  private awarenessKeyDelivery: OCTANEAwarenessKeyDelivery;
  private deployer: DeployAllNow;

  constructor(stripeSecretKey: string, openingDate: number) {
    this.router = express.Router();
    
    this.launch = new PostSingularityStripeLaunch({
      stripeSecretKey,
      openingDate,
      vibechainConfig: {
        network: 'vibechain-mainnet',
        rpcUrl: process.env.VIBECHAIN_RPC_URL || 'https://vibechain.vibecloud.io/rpc',
        contractAddress: process.env.VIBECHAIN_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
        chainId: parseInt(process.env.VIBECHAIN_CHAIN_ID || '1')
      }
    });

    this.deploymentSystem = new ChairmanDeploymentSystem();
    this.awarenessKeyDelivery = new OCTANEAwarenessKeyDelivery(this.launch);
    this.deployer = new DeployAllNow();

    this.setupRoutes();
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Get launch status
    this.router.get('/status', this.getStatus.bind(this));

    // Get current pricing
    this.router.get('/pricing', this.getPricing.bind(this));

    // Get all tiers
    this.router.get('/tiers', this.getTiers.bind(this));

    // Purchase SYNTH
    this.router.post('/purchase/synth', this.purchaseSYNTH.bind(this));

    // Purchase tier
    this.router.post('/purchase/tier', this.purchaseTier.bind(this));

    // Get vCHIPs
    this.router.get('/vchips', this.getVCHIPs.bind(this));

    // Deploy vCHIP
    this.router.post('/deploy/vchip', this.deployVCHIP.bind(this));

    // Deploy all now
    this.router.post('/deploy/all', this.deployAll.bind(this));

    // Stripe webhook
    this.router.post('/webhook/stripe', this.handleStripeWebhook.bind(this));

    // Get Awareness Key status
    this.router.get('/awareness-key/:email', this.getAwarenessKeyStatus.bind(this));
  }

  /**
   * GET /status - Get launch status
   */
  private getStatus(req: Request, res: Response): void {
    try {
      const status = this.launch.getLaunchStatus();
      res.json({
        success: true,
        status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /pricing - Get current pricing
   */
  private getPricing(req: Request, res: Response): void {
    try {
      const pricing = this.launch.getCurrentPricing();
      res.json({
        success: true,
        pricing
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /tiers - Get all pricing tiers
   */
  private getTiers(req: Request, res: Response): void {
    try {
      const tiers = this.launch.getAllTiers();
      res.json({
        success: true,
        tiers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /purchase/synth - Purchase SYNTH tokens
   */
  private async purchaseSYNTH(req: Request, res: Response): Promise<void> {
    try {
      const { email, walletAddress, amountSYNTH } = req.body;

      if (!email || !amountSYNTH) {
        res.status(400).json({
          success: false,
          error: 'Email and amountSYNTH are required'
        });
        return;
      }

      const result = await this.launch.purchaseSYNTH({
        email,
        walletAddress,
        amountSYNTH
      });

      res.json({
        success: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /purchase/tier - Purchase pricing tier
   */
  private async purchaseTier(req: Request, res: Response): Promise<void> {
    try {
      const { email, walletAddress, tierId, billingCycle } = req.body;

      if (!email || !tierId) {
        res.status(400).json({
          success: false,
          error: 'Email and tierId are required'
        });
        return;
      }

      const result = await this.launch.purchaseTier({
        email,
        walletAddress,
        tierId,
        billingCycle: billingCycle || 'monthly'
      });

      res.json({
        success: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /vchips - Get all available vCHIPs
   */
  private getVCHIPs(req: Request, res: Response): void {
    try {
      const vchips = this.deploymentSystem.getAllVCHIPs();
      res.json({
        success: true,
        vchips
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /deploy/vchip - Deploy vCHIP
   */
  private async deployVCHIP(req: Request, res: Response): Promise<void> {
    try {
      const { stationId, vchipId, target, accessLevel, autoExecute } = req.body;

      if (!stationId || !vchipId || !target) {
        res.status(400).json({
          success: false,
          error: 'stationId, vchipId, and target are required'
        });
        return;
      }

      const result = await this.deploymentSystem.deployVCHIP(
        stationId,
        vchipId,
        target,
        accessLevel || 'admin',
        autoExecute !== false
      );

      res.json({
        success: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /deploy/all - Deploy all vCHIPs
   */
  private async deployAll(req: Request, res: Response): Promise<void> {
    try {
      const { owner } = req.body;

      if (!owner) {
        res.status(400).json({
          success: false,
          error: 'owner is required'
        });
        return;
      }

      const status = await this.deployer.deployAllNow(owner);

      res.json({
        success: true,
        status,
        message: '🎉 All vCHIPs deployed successfully!'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /webhook/stripe - Handle Stripe webhooks
   */
  private async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    try {
      const event = req.body;

      if (event.type === 'checkout.session.completed') {
        const result = await this.launch.handlePaymentSuccess(event.data.object.id);
        
        // If OCTANE tier, Awareness Key already delivered
        if (event.data.object.metadata?.tier === 'octane') {
          console.log('✅ OCTANE purchase completed with Awareness Key delivered');
        }

        res.json({
          success: true,
          received: true,
          result
        });
      } else {
        res.json({
          success: true,
          received: true
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /awareness-key/:email - Get Awareness Key status
   */
  private getAwarenessKeyStatus(req: Request, res: Response): void {
    try {
      const { email } = req.params;
      const hasKey = this.awarenessKeyDelivery.hasActiveAwarenessKey(email);
      const key = this.awarenessKeyDelivery.getAwarenessKey(email);
      const deliveries = this.awarenessKeyDelivery.getUserDeliveries(email);

      res.json({
        success: true,
        hasActiveKey: hasKey,
        key,
        deliveries
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get router
   */
  getRouter(): Router {
    return this.router;
  }
}

/**
 * Create Stripe Launch API
 */
export function createStripeLaunchAPI(
  stripeSecretKey: string,
  openingDate: number
): Router {
  const api = new StripeLaunchAPI(stripeSecretKey, openingDate);
  return api.getRouter();
}

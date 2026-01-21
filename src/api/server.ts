/**
 * Express Server for Post-Singularity Game Launch API
 * VibeCloud Platform
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createStripeLaunchAPI } from './stripe-launch-api.js';

export interface ServerConfig {
  port: number;
  stripeSecretKey: string;
  openingDate: number;
  corsOrigin?: string;
}

export class PostSingularityServer {
  private app: Express;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.app = express();
    this.config = config;
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    // Security
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
          frameSrc: ["'self'", "https://js.stripe.com"],
          connectSrc: ["'self'", "https://api.stripe.com"]
        }
      }
    }));

    // CORS
    this.app.use(cors({
      origin: this.config.corsOrigin || '*',
      credentials: true
    }));

    // JSON parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static files
    this.app.use(express.static('interfaces'));
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: Date.now(),
        platform: 'VibeCloud',
        game: 'Post-Singularity'
      });
    });

    // Stripe Launch API
    const stripeLaunchAPI = createStripeLaunchAPI(
      this.config.stripeSecretKey,
      this.config.openingDate
    );
    this.app.use('/api/launch', stripeLaunchAPI);

    // Serve main launch page
    this.app.get('/', (req, res) => {
      res.sendFile('post-singularity-game-launch.html', { root: 'interfaces' });
    });

    // Serve floating catalog
    this.app.get('/catalog', (req, res) => {
      res.sendFile('floating-catalog-icon.html', { root: 'interfaces' });
    });

    // Success page
    this.app.get('/success', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Successful - Post-Singularity Game</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .success-container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 3px solid rgba(0, 255, 0, 0.5);
              border-radius: 30px;
              padding: 60px 40px;
              text-align: center;
              max-width: 600px;
            }
            h1 {
              font-size: 3em;
              color: #00ff00;
              margin-bottom: 20px;
            }
            p {
              font-size: 1.2em;
              line-height: 1.8;
              color: #ccc;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              margin-top: 30px;
              padding: 15px 40px;
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              color: #000;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-container">
            <h1>✅ Purchase Successful!</h1>
            <p>Welcome to Post-Singularity Game on VibeCloud!</p>
            <p>Your vCHIP is being deployed automatically. You'll receive an email with your access details shortly.</p>
            <p><strong>🔑 AWARENESS KEY:</strong> If you purchased OCTANE tier, your Awareness Key has been delivered automatically.</p>
            <a href="/" class="button">Go to Dashboard</a>
          </div>
        </body>
        </html>
      `);
    });

    // Cancel page
    this.app.get('/cancel', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Cancelled - Post-Singularity Game</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .cancel-container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 3px solid rgba(255, 165, 0, 0.5);
              border-radius: 30px;
              padding: 60px 40px;
              text-align: center;
              max-width: 600px;
            }
            h1 {
              font-size: 3em;
              color: #FFA500;
              margin-bottom: 20px;
            }
            p {
              font-size: 1.2em;
              line-height: 1.8;
              color: #ccc;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              margin-top: 30px;
              padding: 15px 40px;
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              color: #000;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="cancel-container">
            <h1>Purchase Cancelled</h1>
            <p>No worries! You can still start with Sandbox tier for FREE forever.</p>
            <p>When you're ready, we'll be here.</p>
            <a href="/" class="button">Return to Home</a>
          </div>
        </body>
        </html>
      `);
    });
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
        
        // If OCTANE tier, check for Awareness Key delivery
        if (event.data.object.metadata?.tier === 'octane') {
          console.log('✅ OCTANE purchase completed with Awareness Key');
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
   * Start server
   */
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        console.log('🚀 Post-Singularity Game Launch Server Started');
        console.log(`📍 Port: ${this.config.port}`);
        console.log(`🌐 Platform: VibeCloud (Not SpinCloud)`);
        console.log(`💰 Pricing: $1/SYNTH opening day, then $1/SYNTH/day`);
        console.log(`🔑 AWARENESS KEY: Included in all OCTANE purchases/leases`);
        console.log(`\n✅ Server is ready for Stripe launch!`);
        resolve();
      });
    });
  }

  /**
   * Go live - activate launch
   */
  async goLive(): Promise<void> {
    await this.launch.goLive();
    console.log('🎉 POST-SINGULARITY GAME IS NOW LIVE!');
  }
}

/**
 * Create and start server
 */
export async function startServer(config: ServerConfig): Promise<PostSingularityServer> {
  const server = new PostSingularityServer(config);
  await server.start();
  return server;
}

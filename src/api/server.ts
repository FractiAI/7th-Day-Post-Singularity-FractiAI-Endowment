/**
 * Express Server for Post-Singularity Game Launch API
 * VibeCloud Platform
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createStripeLaunchAPI } from './stripe-launch-api.js';
import { createAuthAPI } from './auth-api.js';
import { unifiedVChipPortfolioWallet } from '../integration/unified-vchip-portfolio-wallet.js';
import { fiveStarTravelPackageSystem } from '../travel/5-star-travel-package-system.js';
import { seedEdgeNodeTravelSystem } from '../travel/seed-edge-node-travel-system.js';
import { thisnetZeroVibesphereFSRTheater } from '../vibeverse/thisnet-zero-vibesphere-fsr-theater.js';

export interface ServerConfig {
  port: number;
  stripeSecretKey: string;
  openingDate: number;
  corsOrigin?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  redirectUrl?: string;
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

    // Auth API (Google OAuth)
    if (this.config.supabaseUrl && this.config.supabaseAnonKey) {
      const authAPI = createAuthAPI({
        supabaseUrl: this.config.supabaseUrl,
        supabaseAnonKey: this.config.supabaseAnonKey,
        redirectUrl: this.config.redirectUrl || `http://localhost:${this.config.port}/auth/callback`
      });
      this.app.use('/api/auth', authAPI);
    }

    // Stripe Launch API
    const stripeLaunchAPI = createStripeLaunchAPI(
      this.config.stripeSecretKey,
      this.config.openingDate
    );
    this.app.use('/api/launch', stripeLaunchAPI);

    // Auth pages
    this.app.get('/login', (req, res) => {
      res.sendFile('auth-login.html', { root: 'interfaces' });
    });

    this.app.get('/auth/callback', (req, res) => {
      res.sendFile('auth-callback.html', { root: 'interfaces' });
    });

    this.app.get('/dashboard', (req, res) => {
      res.sendFile('dashboard.html', { root: 'interfaces' });
    });

    // Serve main launch page
    this.app.get('/', (req, res) => {
      res.sendFile('index.html', { root: '.' });
    });

    // Serve floating catalog
    this.app.get('/catalog', (req, res) => {
      res.sendFile('floating-catalog-icon.html', { root: 'interfaces' });
    });

    // Snap Pad · VibePad console (floating iPad, mic, snap mode)
    this.app.get('/snap-pad', (req, res) => {
      res.sendFile('snap-pad-vibepad-console.html', { root: 'interfaces' });
    });

    // Ultimate VIP Popup Landing (with button to Vibesphere console)
    this.app.get('/ultimate-vip-popup', (req, res) => {
      res.sendFile('ultimate-vip-popup-landing.html', { root: 'interfaces' });
    });

    // Ultimate VIP Creator Chairman Console (Vibesphere)
    this.app.get('/vibesphere', (req, res) => {
      res.sendFile('ultimate-vip-chairman-creator-console.html', { root: 'interfaces' });
    });

    // Nate → Shaman Wellness Bohio (button + popup)
    this.app.get('/nate-bohio', (req, res) => {
      res.sendFile('nate-shaman-wellness-bohio-button.html', { root: 'interfaces' });
    });

    // Interactive AI Consultation (Nate → Bohio) - Interactive session like other NSPFRNP experiences
    this.app.get('/nate-bohio-consultation', (req, res) => {
      res.sendFile('nate-bohio-interactive-consultation.html', { root: 'interfaces' });
    });

    // Reception Kiosk (Nate → Bohio)
    this.app.get('/reception-kiosk', (req, res) => {
      res.sendFile('reception-kiosk-nate-bohio.html', { root: 'interfaces' });
    });

    // Portfolio & Wallet Dashboard
    this.app.get('/portfolio', (req, res) => {
      res.sendFile('portfolio-wallet-dashboard.html', { root: 'interfaces' });
    });

    // 5-Star Travel Package Booking
    this.app.get('/travel', (req, res) => {
      res.sendFile('5-star-travel-package-booking.html', { root: 'interfaces' });
    });

    // Travel Package API endpoints
    this.setupTravelPackageAPI();

    // Seed:Edge Node Travel API endpoints
    this.setupSeedEdgeNodeTravelAPI();

    // Thisnet Zero Vibesphere FSR Theater API endpoints
    this.setupThisnetZeroVibesphereFSRTheaterAPI();

    // Net Zero-Infinity Pair API endpoints
    this.setupNetZeroInfinityPairAPI();

    // Portfolio & Wallet API endpoints
    this.setupPortfolioWalletAPI();

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

  // Note: These methods reference properties that don't exist in this class.
  // They are kept for future implementation or should be removed if not needed.
  // Uncomment and implement when deployment system is integrated.
  
  /**
   * GET /vchips - Get all available vCHIPs
   * TODO: Implement when deploymentSystem is available
   */
  private getVCHIPs(req: Request, res: Response): void {
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - deployment system not integrated'
    });
  }

  /**
   * POST /deploy/vchip - Deploy vCHIP
   * TODO: Implement when deploymentSystem is available
   */
  private async deployVCHIP(req: Request, res: Response): Promise<void> {
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - deployment system not integrated'
    });
  }

  /**
   * POST /deploy/all - Deploy all vCHIPs
   * TODO: Implement when deployer is available
   */
  private async deployAll(req: Request, res: Response): Promise<void> {
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - deployer not integrated'
    });
  }

  /**
   * POST /webhook/stripe - Handle Stripe webhooks
   * Note: Stripe webhooks are handled by stripe-launch-api.js at /api/launch/webhook
   */
  private async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    res.status(501).json({
      success: false,
      error: 'Use /api/launch/webhook for Stripe webhooks'
    });
  }

  /**
   * GET /awareness-key/:email - Get Awareness Key status
   * TODO: Implement when awarenessKeyDelivery is available
   */
  private getAwarenessKeyStatus(req: Request, res: Response): void {
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - awareness key delivery not integrated'
    });
  }

  /**
   * Setup Travel Package API endpoints
   */
  private setupTravelPackageAPI(): void {
    // Get all destinations
    this.app.get('/api/travel/destinations', (req, res) => {
      try {
        const destinations = fiveStarTravelPackageSystem.getAllDestinations();
        res.json({ success: true, destinations });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get destination by ID
    this.app.get('/api/travel/destination/:id', (req, res) => {
      try {
        const destinations = fiveStarTravelPackageSystem.getAllDestinations();
        const destination = destinations.find(d => d.id === req.params.id);
        
        if (!destination) {
          return res.status(404).json({
            success: false,
            error: 'Destination not found'
          });
        }
        
        res.json({ success: true, destination });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get available hero hosts
    this.app.get('/api/travel/hero-hosts', (req, res) => {
      try {
        const { HERO_HOSTS } = require('../mission-craft/welcome-console.js');
        const heroHosts = Object.values(HERO_HOSTS);
        res.json({ success: true, heroHosts });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all star plans
    this.app.get('/api/travel/star-plans', (req, res) => {
      try {
        const starPlans = fiveStarTravelPackageSystem.getAllStarPlans();
        res.json({ success: true, starPlans });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get star plan by rating
    this.app.get('/api/travel/star-plan/:stars', (req, res) => {
      try {
        const stars = parseInt(req.params.stars);
        if (stars < 1 || stars > 5) {
          return res.status(400).json({
            success: false,
            error: 'Star rating must be between 1 and 5'
          });
        }
        const starPlan = fiveStarTravelPackageSystem.getStarPlan(stars as any);
        if (!starPlan) {
          return res.status(404).json({
            success: false,
            error: 'Star plan not found'
          });
        }
        res.json({ success: true, starPlan });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Create travel package
    this.app.post('/api/travel/create-package', async (req, res) => {
      try {
        const { owner, destinationId, heroHostName, customizations, tier } = req.body;
        
        const travelPackage = await fiveStarTravelPackageSystem.createTravelPackage(
          owner,
          destinationId,
          heroHostName,
          customizations,
          tier
        );
        
        res.json({ success: true, package: travelPackage });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Deliver travel package (vCHIP + Golden Key)
    this.app.post('/api/travel/deliver/:packageId', async (req, res) => {
      try {
        const { packageId } = req.params;
        const result = await fiveStarTravelPackageSystem.deliverTravelPackage(packageId);
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get package by ID
    this.app.get('/api/travel/package/:id', (req, res) => {
      try {
        const travelPackage = fiveStarTravelPackageSystem.getPackage(req.params.id);
        
        if (!travelPackage) {
          return res.status(404).json({
            success: false,
            error: 'Travel package not found'
          });
        }
        
        res.json({ success: true, package: travelPackage });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get packages by owner
    this.app.get('/api/travel/packages/:owner', (req, res) => {
      try {
        const packages = fiveStarTravelPackageSystem.getPackagesByOwner(req.params.owner);
        res.json({ success: true, packages, count: packages.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Setup Seed:Edge Node Travel API endpoints
   */
  private setupSeedEdgeNodeTravelAPI(): void {
    // Package trip as seed:edge nodes
    this.app.post('/api/travel/seed-edge-nodes/package', async (req, res) => {
      try {
        const { packageId, includeSingularity } = req.body;
        
        const travelPackage = fiveStarTravelPackageSystem.getPackage(packageId);
        if (!travelPackage) {
          return res.status(404).json({
            success: false,
            error: 'Travel package not found'
          });
        }
        
        const seedNodes = await seedEdgeNodeTravelSystem.packageTripAsSeedEdgeNodes(
          travelPackage,
          includeSingularity !== false
        );
        
        res.json({ success: true, seedNodes, count: seedNodes.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Unpack seed:edge node
    this.app.post('/api/travel/seed-edge-nodes/:nodeId/unpack', async (req, res) => {
      try {
        const { nodeId } = req.params;
        const { trigger } = req.body;
        
        const result = await seedEdgeNodeTravelSystem.unpackSeedEdgeNode(nodeId, trigger);
        
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Deliver to destination
    this.app.post('/api/travel/seed-edge-nodes/:nodeId/deliver', async (req, res) => {
      try {
        const { nodeId } = req.params;
        
        const result = await seedEdgeNodeTravelSystem.deliverToDestination(nodeId);
        
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get seed:edge node
    this.app.get('/api/travel/seed-edge-nodes/:nodeId', (req, res) => {
      try {
        const { nodeId } = req.params;
        const node = seedEdgeNodeTravelSystem.getNode(nodeId);
        
        if (!node) {
          return res.status(404).json({
            success: false,
            error: 'Seed edge node not found'
          });
        }
        
        res.json({ success: true, node });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get nodes at octave
    this.app.get('/api/travel/seed-edge-nodes/octave/:octave', (req, res) => {
      try {
        const octave = parseInt(req.params.octave);
        if (octave < 0 || octave > 6) {
          return res.status(400).json({
            success: false,
            error: 'Octave must be between 0 and 6'
          });
        }
        
        const nodes = seedEdgeNodeTravelSystem.getNodesAtOctave(octave as any);
        
        res.json({ success: true, nodes, count: nodes.length, octave });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get singularity nodes
    this.app.get('/api/travel/seed-edge-nodes/singularity', (req, res) => {
      try {
        const nodes = seedEdgeNodeTravelSystem.getSingularityNodes();
        
        res.json({ success: true, nodes, count: nodes.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Setup Thisnet Zero Vibesphere FSR Theater API endpoints
   */
  private setupThisnetZeroVibesphereFSRTheaterAPI(): void {
    // Create fixed awareness node
    this.app.post('/api/vibesphere/thisnet-zero/fixed-node', async (req, res) => {
      try {
        const { octave, position } = req.body;
        
        const node = await thisnetZeroVibesphereFSRTheater.createFixedAwarenessNode(
          octave,
          position
        );
        
        res.json({ success: true, node });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Create Vibesphere FSR theater
    this.app.post('/api/vibesphere/fsr-theater/create', async (req, res) => {
      try {
        const { name, seatConfig } = req.body;
        
        const theater = await thisnetZeroVibesphereFSRTheater.createVibesphereFSRTheater(
          name,
          seatConfig
        );
        
        res.json({ success: true, theater });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Target attention head using joystick
    this.app.post('/api/vibesphere/fsr-theater/:theaterId/target', async (req, res) => {
      try {
        const { theaterId } = req.params;
        const { joystickInput, targetNodeId } = req.body;
        
        const result = await thisnetZeroVibesphereFSRTheater.targetAttentionHead(
          theaterId,
          joystickInput,
          targetNodeId
        );
        
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get theater
    this.app.get('/api/vibesphere/fsr-theater/:theaterId', (req, res) => {
      try {
        const { theaterId } = req.params;
        const theater = thisnetZeroVibesphereFSRTheater.getTheater(theaterId);
        
        if (!theater) {
          return res.status(404).json({
            success: false,
            error: 'Theater not found'
          });
        }
        
        res.json({ success: true, theater });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get fixed node
    this.app.get('/api/vibesphere/thisnet-zero/fixed-node/:nodeId', (req, res) => {
      try {
        const { nodeId } = req.params;
        const node = thisnetZeroVibesphereFSRTheater.getFixedNode(nodeId);
        
        if (!node) {
          return res.status(404).json({
            success: false,
            error: 'Fixed node not found'
          });
        }
        
        res.json({ success: true, node });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all fixed nodes
    this.app.get('/api/vibesphere/thisnet-zero/fixed-nodes', (req, res) => {
      try {
        const nodes = thisnetZeroVibesphereFSRTheater.getAllFixedNodes();
        res.json({ success: true, nodes, count: nodes.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get nested shells
    this.app.get('/api/vibesphere/nested-shells', (req, res) => {
      try {
        const shells = thisnetZeroVibesphereFSRTheater.getNestedShells();
        res.json({ success: true, shells });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get thisnet zero config
    this.app.get('/api/vibesphere/thisnet-zero', (req, res) => {
      try {
        const config = thisnetZeroVibesphereFSRTheater.getThisnetZero();
        res.json({ success: true, config });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Setup Net Zero-Infinity Pair API endpoints
   */
  private setupNetZeroInfinityPairAPI(): void {
    // Integrate pair into experience
    this.app.post('/api/net-zero-infinity/integrate/:experienceId', async (req, res) => {
      try {
        const { experienceId } = req.params;
        const { experienceType, config } = req.body;
        
        const integration = await netZeroInfinityPairSystem.integrateIntoExperience(
          experienceId,
          experienceType || 'all',
          config
        );
        
        res.json({ success: true, integration });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Metabolize into entire NSPFRNP
    this.app.post('/api/net-zero-infinity/metabolize', async (req, res) => {
      try {
        const result = await netZeroInfinityPairSystem.metabolizeIntoNSPFRNP();
        
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get pair
    this.app.get('/api/net-zero-infinity/pair', (req, res) => {
      try {
        const pair = netZeroInfinityPairSystem.getPair();
        
        if (!pair) {
          return res.status(404).json({
            success: false,
            error: 'Net zero-infinity pair not found'
          });
        }
        
        res.json({ success: true, pair });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get experience integration
    this.app.get('/api/net-zero-infinity/integration/:experienceId', (req, res) => {
      try {
        const { experienceId } = req.params;
        const integration = netZeroInfinityPairSystem.getExperienceIntegration(experienceId);
        
        if (!integration) {
          return res.status(404).json({
            success: false,
            error: 'Experience integration not found'
          });
        }
        
        res.json({ success: true, integration });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all integrations
    this.app.get('/api/net-zero-infinity/integrations', (req, res) => {
      try {
        const integrations = netZeroInfinityPairSystem.getAllIntegrations();
        res.json({ success: true, integrations, count: integrations.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get integration status
    this.app.get('/api/net-zero-infinity/status', (req, res) => {
      try {
        const pair = netZeroInfinityPairSystem.getPair();
        const metabolized = netZeroInfinityPairSystem.isMetabolized();
        const coverage = netZeroInfinityPairSystem.getIntegrationCoverage();
        
        res.json({
          success: true,
          metabolized,
          coverage,
          pair: pair ? {
            id: pair.id,
            netZero: pair.netZero,
            infinity: pair.infinity,
            pair: pair.pair,
            integration: pair.integration
          } : null
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Setup Portfolio & Wallet API endpoints
   */
  private setupPortfolioWalletAPI(): void {
    // Get portfolio for owner
    this.app.get('/api/portfolio/:owner', async (req, res) => {
      try {
        const { owner } = req.params;
        const portfolio = await unifiedVChipPortfolioWallet.getPortfolio(owner);
        
        if (!portfolio) {
          // Initialize if doesn't exist
          const newPortfolio = await unifiedVChipPortfolioWallet.initializePortfolio(owner);
          return res.json({ success: true, portfolio: newPortfolio });
        }
        
        res.json({ success: true, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Initialize portfolio
    this.app.post('/api/portfolio/:owner/initialize', async (req, res) => {
      try {
        const { owner } = req.params;
        const { identityData } = req.body;
        const portfolio = await unifiedVChipPortfolioWallet.initializePortfolio(owner, identityData);
        res.json({ success: true, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Burn vCHIP for portfolio
    this.app.post('/api/portfolio/:owner/burn-vchip', async (req, res) => {
      try {
        const { owner } = req.params;
        const { chairmanStationId } = req.body;
        const vchip = await unifiedVChipPortfolioWallet.burnVChipForPortfolio(owner, chairmanStationId);
        const portfolio = await unifiedVChipPortfolioWallet.getPortfolio(owner);
        res.json({ success: true, vchip, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Burn awareness key for portfolio
    this.app.post('/api/portfolio/:owner/burn-key', async (req, res) => {
      try {
        const { owner } = req.params;
        const { keyType, octaveAccess } = req.body;
        const key = await unifiedVChipPortfolioWallet.burnAwarenessKeyForPortfolio(
          owner,
          keyType || 'dual',
          octaveAccess || [1, 2, 3, 4, 5, 6, 7, 8]
        );
        const portfolio = await unifiedVChipPortfolioWallet.getPortfolio(owner);
        res.json({ success: true, key, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Complete burn operation (vCHIP + Key)
    this.app.post('/api/portfolio/:owner/burn-complete', async (req, res) => {
      try {
        const { owner } = req.params;
        const { chairmanStationId } = req.body;
        const result = await unifiedVChipPortfolioWallet.completeBurnOperation(owner, chairmanStationId);
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Update portfolio
    this.app.put('/api/portfolio/:owner', async (req, res) => {
      try {
        const { owner } = req.params;
        const updates = req.body;
        const portfolio = await unifiedVChipPortfolioWallet.updatePortfolio(owner, updates);
        res.json({ success: true, portfolio });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all portfolios (admin)
    this.app.get('/api/portfolios', (req, res) => {
      try {
        const portfolios = unifiedVChipPortfolioWallet.getAllPortfolios();
        res.json({ success: true, portfolios, count: portfolios.length });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
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
    // Launch is handled by stripe-launch-api.js
    console.log('🎉 POST-SINGULARITY GAME IS NOW LIVE!');
    console.log('💡 Use /api/launch endpoints for launch operations');
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

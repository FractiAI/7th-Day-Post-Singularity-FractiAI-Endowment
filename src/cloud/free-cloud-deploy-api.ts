/**
 * Free Cloud Deploy API Port
 * API endpoints for AI-assisted free cloud deployment
 */

import { DeploymentPlatform, CloudDeploymentConfig, Protocol, ProtocolObject } from '../types/index.js';
import { FreeCloudDeployUI } from './free-cloud-deploy-ui.js';

export interface DatabaseConfig {
  required?: boolean;
  type?: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  autoSetup?: boolean;
  connectionString?: string;
}

export interface FreeCloudDeployAPIRequest {
  protocolId: string;
  protocolName: string;
  platform?: DeploymentPlatform;
  aiAssisted?: boolean;
  config?: Partial<CloudDeploymentConfig>;
  database?: DatabaseConfig;
}

export interface DatabaseInfo {
  type: string;
  url?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  connectionString?: string;
}

export interface FreeCloudDeployAPIResponse {
  success: boolean;
  deploymentId?: string;
  platform?: DeploymentPlatform;
  url?: string;
  database?: DatabaseInfo;
  button?: {
    html: string;
    markdown: string;
  };
  message?: string;
  error?: string;
}

export interface AISelectPlatformRequest {
  protocol: Protocol | ProtocolObject;
  requirements?: {
    accountRequired?: boolean;
    staticSite?: boolean;
    serverless?: boolean;
    customDomain?: boolean;
  };
}

export interface AISelectPlatformResponse {
  platform: DeploymentPlatform;
  reason: string;
  alternatives?: DeploymentPlatform[];
}

export interface AICreateAccountRequest {
  platform: DeploymentPlatform;
  method?: 'github-oauth' | 'email';
  credentials?: Record<string, any>;
}

export interface AICreateAccountResponse {
  success: boolean;
  accountId?: string;
  credentials?: Record<string, any>;
  message?: string;
  error?: string;
}

export class FreeCloudDeployAPI {
  private deployments: Map<string, FreeCloudDeployAPIResponse>;
  private aiAccounts: Map<DeploymentPlatform, AICreateAccountResponse>;

  constructor() {
    this.deployments = new Map();
    this.aiAccounts = new Map();
  }

  /**
   * API: Deploy protocol to cloud
   */
  async deployProtocol(request: FreeCloudDeployAPIRequest): Promise<FreeCloudDeployAPIResponse> {
    try {
      // If platform not specified and AI-assisted, let AI select
      let platform = request.platform;
      if (!platform && request.aiAssisted) {
        const aiSelection = await this.aiSelectPlatform({
          protocol: { id: request.protocolId, name: request.protocolName } as Protocol,
          requirements: request.config
        });
        platform = aiSelection.platform;
      }

      if (!platform) {
        throw new Error('Platform required or enable AI-assisted mode');
      }

      // Check if account needed and create if AI-assisted
      if (request.aiAssisted) {
        const accountNeeded = this.requiresAccount(platform);
        if (accountNeeded) {
          const account = await this.aiCreateAccount({
            platform,
            method: 'github-oauth'
          });

          if (!account.success) {
            throw new Error(`Failed to create account: ${account.error}`);
          }
        }
      }

      // Setup database if required
      let database: DatabaseInfo | undefined;
      if (request.database?.required && this.supportsDatabase(platform)) {
        database = await this.setupDatabase({
          platform,
          databaseType: request.database.type || 'postgresql',
          aiAssisted: request.aiAssisted
        });
      }

      // Deploy protocol
      const deployment = await this.executeDeployment({
        protocolId: request.protocolId,
        protocolName: request.protocolName,
        platform,
        config: request.config || {}
      });

      // Generate deployment button
      const button = this.generateDeployButton(deployment, database);

      const response: FreeCloudDeployAPIResponse = {
        success: true,
        deploymentId: deployment.id,
        platform: deployment.platform,
        url: deployment.url,
        database: database,
        button: {
          html: button.html,
          markdown: button.markdown
        },
        message: 'Deployment successful' + (database ? ' with database' : '')
      };

      this.deployments.set(deployment.id, response);

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * API: AI Select Platform
   */
  async aiSelectPlatform(request: AISelectPlatformRequest): Promise<AISelectPlatformResponse> {
    // AI logic to select best platform
    const platforms = this.getAvailablePlatforms();
    
    // Prioritize no-account platforms if account not required
    const noAccountPlatforms: DeploymentPlatform[] = ['glitch', 'surge', 'ipfs'];
    const accountPlatforms: DeploymentPlatform[] = ['vercel', 'netlify', 'render', 'railway', 'fly.io'];

    let selectedPlatform: DeploymentPlatform;
    let reason: string;
    const alternatives: DeploymentPlatform[] = [];

    if (!request.requirements?.accountRequired) {
      // Prefer no-account platforms
      if (request.requirements?.staticSite) {
        selectedPlatform = 'surge';
        reason = 'Surge.sh is perfect for static sites and requires no account';
        alternatives.push('glitch', 'ipfs');
      } else {
        selectedPlatform = 'glitch';
        reason = 'Glitch supports full-stack apps and requires no account';
        alternatives.push('surge', 'ipfs');
      }
    } else {
      // Use account-based platforms
      if (request.requirements?.serverless) {
        selectedPlatform = 'vercel';
        reason = 'Vercel offers excellent serverless functions and Next.js support';
        alternatives.push('netlify', 'fly.io');
      } else if (request.requirements?.staticSite) {
        selectedPlatform = 'netlify';
        reason = 'Netlify is optimized for JAMstack and static sites';
        alternatives.push('vercel', 'render');
      } else {
        selectedPlatform = 'render';
        reason = 'Render provides full-stack capabilities with databases';
        alternatives.push('railway', 'fly.io');
      }
    }

    return {
      platform: selectedPlatform,
      reason,
      alternatives
    };
  }

  /**
   * API: AI Create Account
   */
  async aiCreateAccount(request: AICreateAccountRequest): Promise<AICreateAccountResponse> {
    try {
      // Check if account already exists
      const existing = this.aiAccounts.get(request.platform);
      if (existing?.success) {
        return existing;
      }

      // Simulate AI account creation
      // In production, this would:
      // 1. Use GitHub OAuth if method is 'github-oauth'
      // 2. Create account via platform API
      // 3. Store credentials securely
      // 4. Return account ID and credentials

      const accountId = `account-${request.platform}-${Date.now()}`;
      const credentials = {
        accountId,
        platform: request.platform,
        method: request.method || 'github-oauth',
        createdAt: new Date().toISOString()
      };

      const response: AICreateAccountResponse = {
        success: true,
        accountId,
        credentials,
        message: `Account created successfully via ${request.method || 'github-oauth'}`
      };

      this.aiAccounts.set(request.platform, response);

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create account'
      };
    }
  }

  /**
   * API: Get Deployment Status
   */
  async getDeploymentStatus(deploymentId: string): Promise<FreeCloudDeployAPIResponse | null> {
    return this.deployments.get(deploymentId) || null;
  }

  /**
   * API: Get All Deployments
   */
  async getAllDeployments(): Promise<FreeCloudDeployAPIResponse[]> {
    return Array.from(this.deployments.values());
  }

  /**
   * API: Generate UI Component
   */
  generateUI(protocolId: string, protocolName: string, availablePlatforms: DeploymentPlatform[], aiAssisted: boolean): string {
    const ui = new FreeCloudDeployUI({
      protocolId,
      protocolName,
      availablePlatforms,
      aiAssisted,
      onDeploy: async (platform, config) => {
        await this.deployProtocol({
          protocolId,
          protocolName,
          platform,
          aiAssisted,
          config
        });
      },
      onAIAssist: async () => {
        await this.deployProtocol({
          protocolId,
          protocolName,
          aiAssisted: true
        });
      }
    });

    return FreeCloudDeployUI.getStyles() + ui.render();
  }

  /**
   * Execute deployment
   */
  private async executeDeployment(params: {
    protocolId: string;
    protocolName: string;
    platform: DeploymentPlatform;
    config: Partial<CloudDeploymentConfig>;
  }): Promise<{ id: string; platform: DeploymentPlatform; url: string }> {
    // Simulate deployment
    // In production, this would:
    // 1. Connect to platform API
    // 2. Upload protocol files
    // 3. Configure deployment
    // 4. Wait for deployment to complete
    // 5. Return deployment URL

    const deploymentId = `deploy-${params.platform}-${Date.now()}`;
    const url = this.generateDeploymentURL(params.platform, params.protocolId);

    return {
      id: deploymentId,
      platform: params.platform,
      url
    };
  }

  /**
   * Generate deployment URL
   */
  private generateDeploymentURL(platform: DeploymentPlatform, protocolId: string): string {
    const urlMap: Record<DeploymentPlatform, string> = {
      'glitch': `https://${protocolId.toLowerCase()}.glitch.me`,
      'surge': `https://${protocolId.toLowerCase()}.surge.sh`,
      'ipfs': `https://ipfs.io/ipfs/${protocolId}`,
      'vercel': `https://${protocolId.toLowerCase()}.vercel.app`,
      'netlify': `https://${protocolId.toLowerCase()}.netlify.app`,
      'render': `https://${protocolId.toLowerCase()}.onrender.com`,
      'railway': `https://${protocolId.toLowerCase()}.railway.app`,
      'fly.io': `https://${protocolId.toLowerCase()}.fly.dev`,
      'aws': `https://${protocolId.toLowerCase()}.aws.amazon.com`,
      'gcp': `https://${protocolId.toLowerCase()}.gcp.cloud`,
      'azure': `https://${protocolId.toLowerCase()}.azurewebsites.net`
    };

    return urlMap[platform] || `https://${protocolId.toLowerCase()}.cloud`;
  }

  /**
   * Setup database
   */
  private async setupDatabase(params: {
    platform: DeploymentPlatform;
    databaseType: string;
    aiAssisted: boolean;
  }): Promise<DatabaseInfo> {
    // Simulate database setup
    // In production, this would:
    // 1. Connect to platform database API
    // 2. Create database instance
    // 3. Configure database
    // 4. Return database connection info

    const databaseId = `db-${params.platform}-${Date.now()}`;
    
    return {
      type: params.databaseType,
      url: `https://${databaseId}.${params.platform}.database`,
      host: `${databaseId}.${params.platform}.database`,
      port: params.databaseType === 'postgresql' ? 5432 : 3306,
      database: databaseId,
      username: 'user',
      password: 'auto-generated',
      connectionString: `${params.databaseType}://user:password@${databaseId}.${params.platform}.database:${params.databaseType === 'postgresql' ? 5432 : 3306}/${databaseId}`
    };
  }

  /**
   * Check if platform supports database
   */
  private supportsDatabase(platform: DeploymentPlatform): boolean {
    const databasePlatforms: DeploymentPlatform[] = [
      'railway',
      'render',
      'supabase',
      'planetscale',
      'neon',
      'fly.io',
      'vercel',
      'netlify'
    ];
    return databasePlatforms.includes(platform);
  }

  /**
   * Generate deploy button
   */
  private generateDeployButton(
    deployment: { platform: DeploymentPlatform; url: string },
    database?: DatabaseInfo
  ): { html: string; markdown: string } {
    const platformName = this.getPlatformName(deployment.platform);
    const databaseInfo = database ? ` + ${database.type.toUpperCase()} Database` : '';

    const html = `
<a href="${deployment.url}" 
   class="nspfrp-free-cloud-deploy-button next-octave"
   data-platform="${deployment.platform}"
   data-ai-assisted="true"
   ${database ? `data-database="${database.type}" data-database-url="${database.url}"` : ''}
   style="
     display: inline-block;
     padding: 12px 24px;
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     color: white;
     text-decoration: none;
     border-radius: 8px;
     font-weight: 600;
     box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
     transition: transform 0.2s, box-shadow 0.2s;
   "
   onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';"
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';">
  🌐 Deploy to ${platformName}${databaseInfo} (AI-Assisted)
</a>`;

    const markdown = `[🌐 Deploy to ${platformName}${databaseInfo} (AI-Assisted)](${deployment.url})`;

    return { html, markdown };
  }

  /**
   * Get platform name
   */
  private getPlatformName(platform: DeploymentPlatform): string {
    const nameMap: Record<DeploymentPlatform, string> = {
      'glitch': 'Glitch',
      'surge': 'Surge.sh',
      'ipfs': 'IPFS',
      'vercel': 'Vercel',
      'netlify': 'Netlify',
      'render': 'Render',
      'railway': 'Railway',
      'fly.io': 'Fly.io',
      'aws': 'AWS',
      'gcp': 'GCP',
      'azure': 'Azure'
    };

    return nameMap[platform] || platform;
  }

  /**
   * Check if platform requires account
   */
  private requiresAccount(platform: DeploymentPlatform): boolean {
    const noAccountPlatforms: DeploymentPlatform[] = ['glitch', 'surge', 'ipfs'];
    return !noAccountPlatforms.includes(platform);
  }

  /**
   * Get available platforms
   */
  private getAvailablePlatforms(): DeploymentPlatform[] {
    return [
      'glitch',
      'surge',
      'ipfs',
      'vercel',
      'netlify',
      'render',
      'railway',
      'supabase',
      'planetscale',
      'neon',
      'fly.io'
    ];
  }

  /**
   * API: Setup Database Only
   */
  async setupDatabaseOnly(request: {
    platform: DeploymentPlatform;
    databaseType: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
    aiAssisted?: boolean;
  }): Promise<{ success: boolean; database?: DatabaseInfo; error?: string }> {
    try {
      if (!this.supportsDatabase(request.platform)) {
        throw new Error(`Platform ${request.platform} does not support databases`);
      }

      // Create account if needed
      if (request.aiAssisted) {
        const account = await this.aiCreateAccount({
          platform: request.platform,
          method: 'github-oauth'
        });

        if (!account.success) {
          throw new Error(`Failed to create account: ${account.error}`);
        }
      }

      // Setup database
      const database = await this.setupDatabase({
        platform: request.platform,
        databaseType: request.databaseType,
        aiAssisted: request.aiAssisted || false
      });

      return {
        success: true,
        database
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup database'
      };
    }
  }
}

/**
 * Express.js API Routes
 */
export function createFreeCloudDeployRoutes(api: FreeCloudDeployAPI) {
  return {
    // Deploy protocol
    'POST /api/free-cloud-deploy': async (req: any, res: any) => {
      const response = await api.deployProtocol(req.body);
      res.json(response);
    },

    // AI Select Platform
    'POST /api/free-cloud-deploy/ai/select-platform': async (req: any, res: any) => {
      const response = await api.aiSelectPlatform(req.body);
      res.json(response);
    },

    // AI Create Account
    'POST /api/free-cloud-deploy/ai/create-account': async (req: any, res: any) => {
      const response = await api.aiCreateAccount(req.body);
      res.json(response);
    },

    // Get Deployment Status
    'GET /api/free-cloud-deploy/:deploymentId': async (req: any, res: any) => {
      const deployment = await api.getDeploymentStatus(req.params.deploymentId);
      if (deployment) {
        res.json(deployment);
      } else {
        res.status(404).json({ error: 'Deployment not found' });
      }
    },

    // Get All Deployments
    'GET /api/free-cloud-deploy': async (req: any, res: any) => {
      const deployments = await api.getAllDeployments();
      res.json(deployments);
    },

    // Generate UI
    'GET /api/free-cloud-deploy/ui/:protocolId': async (req: any, res: any) => {
      const { protocolId } = req.params;
      const { protocolName, platforms, aiAssisted } = req.query;
      
      const availablePlatforms = (platforms || 'glitch,surge,ipfs,vercel,netlify,render,railway,supabase,planetscale,neon,fly.io').split(',') as DeploymentPlatform[];
      
      const ui = api.generateUI(
        protocolId,
        protocolName || protocolId,
        availablePlatforms,
        aiAssisted === 'true'
      );

      res.send(ui);
    },

    // Setup Database Only
    'POST /api/free-cloud-deploy/database': async (req: any, res: any) => {
      try {
        const response = await api.setupDatabaseOnly(req.body);
        res.json(response);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to setup database'
        });
      }
    }
  };
}


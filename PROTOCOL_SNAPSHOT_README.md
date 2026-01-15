# Protocol Snapshot System with Cloud Deployment

## Overview

The Protocol Snapshot System creates complete, versioned snapshots of protocols (POBs) with integrated cloud deployment support and deployment buttons.

## Features

### 1. Protocol Object (POB) Snapshots
- **Versioned Protocol Storage**: Each protocol gets a unique POB snapshot
- **Reproducible States**: Recreate any protocol state from a POB
- **Evolution Tracking**: Track protocol changes through evolution paths
- **Lineage Management**: Parent-child relationships between POB versions

### 2. Cloud Deployment Protocol
- **Multi-Platform Support**: Deploy to Vercel, Netlify, AWS, GCP, Azure, Render, Fly.io, Railway
- **Automatic Deployment**: One-click deployment from protocol
- **Deployment Status Tracking**: Real-time deployment status and logs
- **Resource Configuration**: CPU, memory, storage settings

### 3. Deployment Buttons
- **HTML Buttons**: Ready-to-use HTML deployment buttons
- **Markdown Buttons**: Markdown format for documentation
- **Platform-Specific Styling**: Each platform has its own color scheme
- **One-Click Deploy**: Direct deployment from button click

### 4. Identity Integration
- **Wallet**: Cryptographic wallet address
- **Trading Card**: Collectible identity card with stats
- **Passport**: Cross-timeline identity with visas and stamps

### 5. Environment Management
- **High-Octave Encryption**: Encrypted environment variables
- **Public/Private Split**: Safe public vars for seeds, encrypted private vars
- **Cloud Shell Integration**: Secure cloud shell connections

## Usage

### Create Protocol Snapshot

```typescript
import { NSPFRPOmniMissionStation } from './src/index.js';

const station = new NSPFRPOmniMissionStation({
  encryptionKey: process.env.ENCRYPTION_KEY!,
  cloudShellConfig: {
    endpoint: process.env.CLOUD_SHELL_ENDPOINT!,
    apiKey: process.env.CLOUD_SHELL_API_KEY!,
    secret: process.env.CLOUD_SHELL_SECRET!,
    encryptionKey: process.env.CLOUD_SHELL_ENCRYPTION_KEY!
  }
});

await station.initialize();

// Create snapshot with deployment
const snapshot = await station.createProtocolSnapshot(
  protocol,
  context,
  agentIdentity,
  {
    deploy: {
      platform: 'vercel',
      environment: 'production',
      config: {
        framework: 'nextjs',
        buildCommand: 'npm run build'
      }
    },
    createButton: true,
    includeIdentity: true,
    includeEnvironment: true,
    includeCloudShell: true
  }
);
```

### Use Deployment Button

The snapshot includes a deployment button in both HTML and Markdown formats:

**HTML:**
```html
<a href="/api/deploy/BTN-1234567890-ABC123" 
   class="nspfrp-deploy-button" 
   data-platform="vercel"
   data-button-id="BTN-1234567890-ABC123"
   style="...">
  🚀 Deploy Protocol Name to vercel
</a>
```

**Markdown:**
```markdown
[🚀 Deploy Protocol Name to vercel](/api/deploy/BTN-1234567890-ABC123)
```

### Export Snapshot for Seed

```typescript
const seedData = station.snapshotManager.exportSnapshotForSeed(pobId);
// Includes: POB info, deployment status, button, identity, environment, cloud shell
```

## Supported Platforms

| Platform | Status | Features |
|----------|--------|----------|
| Vercel | ✅ | Next.js, React, Static sites |
| Netlify | ✅ | JAMstack, Functions, Edge |
| AWS | ✅ | Lambda, ECS, EC2 |
| GCP | ✅ | Cloud Run, App Engine, Functions |
| Azure | ✅ | App Service, Functions, Container Instances |
| Render | ✅ | Web Services, Static Sites, Background Workers |
| Fly.io | ✅ | Global app platform |
| Railway | ✅ | Full-stack deployments |

## Protocol Snapshot Structure

```typescript
interface ProtocolSnapshot {
  pob: ProtocolObject;              // Versioned protocol snapshot
  deployment?: {                    // Deployment information
    status: string;
    url?: string;
    platform: string;
  };
  button?: DeploymentButton;        // Deployment button
  identity?: {                      // Identity information
    wallet: string;
    tradingCard: string;
    passport: string;
  };
  environment?: {                   // Environment variables
    public: Record<string, string>;
    encrypted: boolean;
  };
  cloudShell?: {                   // Cloud shell connection
    endpoint: string;
    sessionId?: string;
  };
  createdAt: number;
  version: string;
}
```

## Security

- **Encrypted Environment**: All sensitive env vars are encrypted
- **Protected Secrets**: `.env.ignore` prevents committing secrets
- **Secure Deployment**: Encrypted cloud shell connections
- **Identity Verification**: Wallet-based identity verification

## Integration with Seeds

Protocol snapshots are automatically included in seeds when created with identity:

```typescript
const seed = await station.seedManager.createSeedWithIdentity(
  protocol,
  walletAddress,
  cloudShellConfig
);

// Seed includes:
// - Protocol content
// - Identity (wallet, trading card, passport)
// - Environment (public vars only)
// - Cloud shell config (if provided)
```

## Next Steps

1. **Deploy API Endpoints**: Create REST API for deployment buttons
2. **Add More Platforms**: Extend platform support
3. **Monitoring**: Add deployment monitoring and alerts
4. **CI/CD Integration**: Integrate with CI/CD pipelines

---

**Protocol ID:** `P-SNAPSHOT-CLOUD-DEPLOY-V17`  
**Version:** `17.0+Snapshot+CloudDeploy`  
**Status:** Implementation Complete



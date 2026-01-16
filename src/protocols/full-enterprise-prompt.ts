/**
 * Full Enterprise Prompt Protocol
 * Novel Protocol for Post Singularity Syntheverse FSR Full Octave Release
 */

import { Protocol, ProtocolMetadata, ProtocolStructure } from '../types/index.js';
import { FractiAICommandCenterManager } from '../enterprise/fractiai-command-center.js';
import { ThreeTierOfferingManager } from '../enterprise/three-tier-offering.js';
import { AutoUnpackFreeMeans } from '../core/auto-unpack-free-means.js';

export interface FullEnterprisePrompt {
  company: {
    name: string;
    mission: string;
    octave: number;
    heroHost: string;
  };
  departments: Array<{
    id: string;
    name: string;
    description: string;
    teams: string[];
    octave: number;
  }>;
  teams: Array<{
    id: string;
    name: string;
    department: string;
    members: Array<{
      id: string;
      name: string;
      role: string;
      octave: number;
    }>;
    octave: number;
  }>;
  tiers: Array<{
    id: string;
    name: string;
    price: string;
    octave: number;
    features: string[];
  }>;
  autoUnpack: {
    enabled: boolean;
    freeResources: string[];
    targetPlatforms: string[];
  };
}

export class FullEnterprisePromptProtocol {
  private commandCenter: FractiAICommandCenterManager;
  private tierManager: ThreeTierOfferingManager;
  private unpackManager: AutoUnpackFreeMeans;

  constructor() {
    this.commandCenter = new FractiAICommandCenterManager();
    this.tierManager = new ThreeTierOfferingManager();
    this.unpackManager = new AutoUnpackFreeMeans();
  }

  /**
   * Generate full enterprise prompt
   */
  generateFullEnterprisePrompt(): FullEnterprisePrompt {
    const center = this.commandCenter.getCommandCenter();
    const tiers = this.tierManager.getAllTiers();
    const freeResources = this.unpackManager.getAvailableFreeResources();

    return {
      company: {
        name: 'FractiAI',
        mission: 'Post-singularity Syntheverse FSR operations',
        octave: center.octave,
        heroHost: center.heroHost.name
      },
      departments: center.departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        teams: dept.teams,
        octave: dept.octave
      })),
      teams: center.teams.map(team => ({
        id: team.id,
        name: team.name,
        department: team.department,
        members: team.members.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          octave: member.octave
        })),
        octave: team.octave
      })),
      tiers: tiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        octave: tier.octave,
        features: tier.features.filter(f => f.enabled).map(f => f.name)
      })),
      autoUnpack: {
        enabled: true,
        freeResources: freeResources.map(r => r.name),
        targetPlatforms: ['vercel', 'netlify', 'railway', 'render']
      }
    };
  }

  /**
   * Create protocol from enterprise prompt
   */
  createProtocol(): Protocol {
    const prompt = this.generateFullEnterprisePrompt();

    const protocol: Protocol = {
      id: 'P-FULL-ENTERPRISE-PROMPT-V1',
      name: 'Full Enterprise Prompt Protocol',
      version: '1.0.0',
      type: 'protocol',
      content: JSON.stringify(prompt, null, 2),
      structure: {
        sections: [
          {
            id: 'company',
            title: 'Company Structure',
            content: JSON.stringify(prompt.company, null, 2),
            order: 1
          },
          {
            id: 'departments',
            title: 'Departments',
            content: JSON.stringify(prompt.departments, null, 2),
            order: 2
          },
          {
            id: 'teams',
            title: 'Teams',
            content: JSON.stringify(prompt.teams, null, 2),
            order: 3
          },
          {
            id: 'tiers',
            title: 'Three-Tier Offering',
            content: JSON.stringify(prompt.tiers, null, 2),
            order: 4
          },
          {
            id: 'auto-unpack',
            title: 'Auto-Unpack Configuration',
            content: JSON.stringify(prompt.autoUnpack, null, 2),
            order: 5
          }
        ],
        components: [],
        flows: []
      },
      metadata: {
        id: 'P-FULL-ENTERPRISE-PROMPT-V1',
        name: 'Full Enterprise Prompt Protocol',
        description: 'Novel protocol for Post Singularity Syntheverse FSR Full Octave Release with complete enterprise structure',
        author: 'FractiAI',
        tags: ['enterprise', 'post-singularity', 'full-octave', 'auto-unpack', 'novel-protocol'],
        category: 'enterprise',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return protocol;
  }

  /**
   * Get protocol as prompt text
   */
  getPromptText(): string {
    const prompt = this.generateFullEnterprisePrompt();
    
    return `# Post Singularity Syntheverse FSR Full Octave Release - Full Enterprise Prompt

## Company: ${prompt.company.name}
- Mission: ${prompt.company.mission}
- Octave: ${prompt.company.octave} (BEYOND_OCTAVE)
- Hero Host: ${prompt.company.heroHost}

## Departments (${prompt.departments.length})
${prompt.departments.map(dept => `- **${dept.name}**: ${dept.description} (Octave ${dept.octave}, ${dept.teams.length} teams)`).join('\n')}

## Teams (${prompt.teams.length})
${prompt.teams.map(team => `- **${team.name}** (${team.department}): ${team.members.length} members, Octave ${team.octave}`).join('\n')}

## Three-Tier Offering
${prompt.tiers.map(tier => `- **${tier.name}** (${tier.price}): Octave ${tier.octave}, ${tier.features.length} features`).join('\n')}

## Auto-Unpack
- Enabled: ${prompt.autoUnpack.enabled}
- Free Resources: ${prompt.autoUnpack.freeResources.join(', ')}
- Target Platforms: ${prompt.autoUnpack.targetPlatforms.join(', ')}
`;
  }
}










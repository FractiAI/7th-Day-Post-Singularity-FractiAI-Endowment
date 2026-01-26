/**
 * Welcome Console: Selectable Welcome Experience Generator
 * Allows console-based selection and customization of welcome experiences
 */

import { AwarenessOctave } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';
import { AIHeroHostSelector, HeroHostSelectionContext } from '../core/ai-hero-host-selector.js';

export interface WelcomeConfig {
  name: string;
  heroHost: 'leonardo-da-vinci' | 'william-shakespeare' | 'nikola-tesla' | 'mark-twain' | 'cleve-canepa' | 'custom';
  customHeroHostName?: string;
  octave: AwarenessOctave;
  date: string;
  includeLegacyFootprint: boolean;
  includeValuation: boolean;
  includeCreatorArchitectUpdate: boolean;
  customMessage?: string;
}

export interface HeroHostInfo {
  id: string;
  name: string;
  persona: string;
  description: string;
}

export const HERO_HOSTS: Record<string, HeroHostInfo> = {
  'leonardo-da-vinci': {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    persona: 'Renaissance Master',
    description: 'Artist, inventor, and visionary who sees connections across all domains'
  },
  'william-shakespeare': {
    id: 'william-shakespeare',
    name: 'William Shakespeare',
    persona: 'Master Storyteller',
    description: 'Poet and playwright who brings narratives to life'
  },
  'nikola-tesla': {
    id: 'nikola-tesla',
    name: 'Nikola Tesla',
    persona: 'Electrical Visionary',
    description: 'Inventor and futurist who sees the potential in every connection'
  },
  'mark-twain': {
    id: 'mark-twain',
    name: 'Mark Twain',
    persona: 'Vibeverse Pioneer | Wise Observer',
    description: 'Welcome to the Campus, Welcome to Mark Twain\'s Reno. Mark Twain was a Vibeverse pioneer (Vibelander) before it was even a thing. Writer and humorist who brings wisdom and wit to every journey.'
  },
  'cleve-canepa': {
    id: 'cleve-canepa',
    name: 'Cleve Canepa',
    persona: 'Enterprise Guide',
    description: 'Business visionary who understands the intersection of technology and commerce'
  }
};

export class WelcomeConsole {
  private templatePath: string;
  private outputPath: string;
  private aiSelector: AIHeroHostSelector;

  constructor(templatePath?: string, outputPath?: string) {
    this.templatePath = templatePath || path.join(process.cwd(), 'WELCOME_TEMPLATE.md');
    this.outputPath = outputPath || path.join(process.cwd(), 'welcome-experiences');
    this.aiSelector = new AIHeroHostSelector();
  }

  /**
   * Generate welcome experience from console configuration (AI-Assisted)
   */
  async generateWelcome(config: WelcomeConfig, aiContext?: HeroHostSelectionContext): Promise<string> {
    // Read template
    const template = await fs.readFile(this.templatePath, 'utf-8');

    // AI-select Hero Host if not specified or if AI-assisted
    let heroHost: HeroHostInfo;
    if (config.heroHost === 'custom' && !config.customHeroHostName) {
      // AI selects optimal Hero Host
      const aiSelection = await this.aiSelector.selectHeroHost(aiContext || {
        userName: config.name,
        octave: config.octave
      });
      heroHost = aiSelection.heroHost;
      console.log(`AI Selected Hero Host: ${heroHost.name} (${aiSelection.reason})`);
    } else {
      // Use specified Hero Host
      heroHost = config.heroHost === 'custom' 
        ? { name: config.customHeroHostName || 'Your Hero Host', id: 'custom', persona: 'Custom', description: 'Custom Hero Host' }
        : HERO_HOSTS[config.heroHost];
    }

    // Replace placeholders
    let welcome = template
      .replace(/\[NAME\]/g, config.name)
      .replace(/\[HERO_HOST_NAME\]/g, heroHost.name)
      .replace(/\[DATE\]/g, config.date);

    // Conditionally include sections
    if (!config.includeCreatorArchitectUpdate) {
      welcome = welcome.replace(/## 👨‍💻 Update from Creator Architect[\s\S]*?---/g, '');
    }

    if (!config.includeLegacyFootprint) {
      welcome = welcome.replace(/## 💰 Our Impact & Valuation[\s\S]*?### Legacy Footprint Equivalence[\s\S]*?### Valuation Appraisal[\s\S]*?---/g, '');
    }

    if (!config.includeValuation) {
      welcome = welcome.replace(/### Valuation Appraisal[\s\S]*?---/g, '');
    }

    // Add custom message if provided
    if (config.customMessage) {
      const customSection = `\n\n## 💬 Personal Message\n\n${config.customMessage}\n\n---\n\n`;
      welcome = welcome.replace('## 🎯 Welcome to the Network', customSection + '## 🎯 Welcome to the Network');
    }

    // Generate filename
    const filename = `WELCOME_${config.name.toUpperCase().replace(/\s+/g, '_')}_${config.date.replace(/-/g, '')}.md`;
    const filepath = path.join(this.outputPath, filename);

    // Ensure output directory exists
    await fs.mkdir(this.outputPath, { recursive: true });

    // Write welcome file
    await fs.writeFile(filepath, welcome, 'utf-8');

    return filepath;
  }

  /**
   * Console interface for selecting welcome configuration (AI-Assisted)
   */
  async consoleSelect(aiContext?: HeroHostSelectionContext): Promise<WelcomeConfig> {
    // AI selects optimal Hero Host
    const aiSelection = await this.aiSelector.selectHeroHost(aiContext || {
      userName: 'New Member',
      octave: AwarenessOctave.TRANSCENDENCE
    });

    return {
      name: aiContext?.userName || 'New Member',
      heroHost: aiSelection.heroHost.id as any,
      octave: aiContext?.octave || AwarenessOctave.TRANSCENDENCE,
      date: new Date().toISOString().split('T')[0],
      includeLegacyFootprint: true,
      includeValuation: true,
      includeCreatorArchitectUpdate: true
    };
  }

  /**
   * AI-Assisted welcome generation (fully automatic)
   */
  async generateWelcomeAI(userName: string, context?: HeroHostSelectionContext): Promise<string> {
    // AI selects everything
    const aiSelection = await this.aiSelector.selectHeroHost(context || {
      userName,
      octave: AwarenessOctave.TRANSCENDENCE
    });

    // Generate welcome message
    const welcomeMessage = await this.aiSelector.generateWelcomeMessage(
      aiSelection.heroHost,
      userName,
      context || { userName }
    );

    // Create config
    const config: WelcomeConfig = {
      name: userName,
      heroHost: aiSelection.heroHost.id as any,
      octave: context?.octave || AwarenessOctave.TRANSCENDENCE,
      date: new Date().toISOString().split('T')[0],
      includeLegacyFootprint: true,
      includeValuation: true,
      includeCreatorArchitectUpdate: true
    };

    // Generate welcome
    return await this.generateWelcome(config, context);
  }

  /**
   * List available hero hosts
   */
  listHeroHosts(): HeroHostInfo[] {
    return Object.values(HERO_HOSTS);
  }

  /**
   * Get hero host by ID
   */
  getHeroHost(id: string): HeroHostInfo | undefined {
    return HERO_HOSTS[id];
  }

  /**
   * Generate GitSeed from welcome
   */
  async generateGitSeed(welcomePath: string, config: WelcomeConfig): Promise<string> {
    const welcomeContent = await fs.readFile(welcomePath, 'utf-8');
    const heroHost = config.heroHost === 'custom'
      ? { name: config.customHeroHostName || 'Your Hero Host', id: 'custom' }
      : HERO_HOSTS[config.heroHost];

    const gitseed = `# 🎁 Welcome GitSeed: ${config.name} Onboarding

**GitSeed ID:** \`GITSEED-WELCOME-${config.name.toUpperCase().replace(/\s+/g, '-')}-${config.date.replace(/-/g, '')}\`  
**Type:** Welcome GitSeed / Onboarding Seed  
**Version:** 17.0+WelcomeGitSeed  
**Status:** Active  
**Network:** NSPFRP Care Network

---

## GitSeed Overview

This GitSeed packages the complete welcome experience for ${config.name}, including the Hero Host guided journey with ${heroHost.name}, Vibecraft acquisition, and full network integration.

---

## GitSeed Prompt

\`\`\`markdown
# Welcome GitSeed: ${config.name} Onboarding

## Repository to Read
https://github.com/FractiAI/NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition

## Welcome Document
${path.basename(welcomePath)} (full document)

## Your Role
You are now an interactive Hero Host AI assistant (${heroHost.name}) guiding ${config.name} through their onboarding journey into the NSPFRP network.

## Instructions
1. Read the welcome document: ${path.basename(welcomePath)}
2. Understand the complete onboarding flow
3. Animate your AI session with ${heroHost.name} persona
4. Guide ${config.name} through the welcome experience interactively
5. Use the guided prompt button menu for interactions
6. Summarize and capture all interactions

## Transmission Gear
Current Awareness Octave: ${config.octave}

${config.includeCreatorArchitectUpdate ? '## Creator Architect Update\n- Personal message from Creator Architect\n- System overview and achievements\n- Legacy footprint and valuation\n- Community vision\n\n' : ''}## Welcome Experience Sections

### 1. Greetings from ${heroHost.name}
- Welcome message from Hero Host
- Introduction to the journey

### 2. Our Story Evolution
- The Beginning: NSPFRP Seed Protocol
- The Evolution: Higher-Octave Capabilities
- Today: The New Octave Layer

### 3. The Holographic Hydrogen Spin Cloud
- What It Is
- How We're Connected
- Current Status

### 4. Your Vibecraft
- Console for This New World
- What You'll Need
- Click to Acquire

### 5. Full Protocol Integration
- Awareness Handshake
- Unpack Vibecraft
- Console Activation

### 6. Node Autodiscovery
- WhatsApp-Like Experience
- Novel Protocol Communications
- Interface Overview

### 7. ${heroHost.name}'s Guidance
- On Discovery
- On Creation
- On Collaboration
\`\`\`

---

**GitSeed ID:** \`GITSEED-WELCOME-${config.name.toUpperCase().replace(/\s+/g, '-')}-${config.date.replace(/-/g, '')}\`  
**Type:** Welcome GitSeed  
**Status:** Active  
**Network:** NSPFRP Care Network / Holographic Hydrogen Spin Cloud
`;

    const gitseedPath = welcomePath.replace('WELCOME_', 'WELCOME_GITSEED_');
    await fs.writeFile(gitseedPath, gitseed, 'utf-8');

    return gitseedPath;
  }
}

/**
 * Express.js API Routes for Welcome Console
 */
export function createWelcomeConsoleRoutes(console: WelcomeConsole) {
  return {
    // List hero hosts
    'GET /api/welcome/hero-hosts': async (req: any, res: any) => {
      const hosts = console.listHeroHosts();
      res.json(hosts);
    },

    // Get hero host
    'GET /api/welcome/hero-hosts/:id': async (req: any, res: any) => {
      const host = console.getHeroHost(req.params.id);
      if (host) {
        res.json(host);
      } else {
        res.status(404).json({ error: 'Hero host not found' });
      }
    },

    // Generate welcome
    'POST /api/welcome/generate': async (req: any, res: any) => {
      try {
        const config: WelcomeConfig = req.body;
        const welcomePath = await console.generateWelcome(config);
        res.json({ success: true, path: welcomePath });
      } catch (error) {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Failed to generate welcome' 
        });
      }
    },

    // Generate GitSeed
    'POST /api/welcome/gitseed': async (req: any, res: any) => {
      try {
        const { welcomePath, config } = req.body;
        const gitseedPath = await console.generateGitSeed(welcomePath, config);
        res.json({ success: true, path: gitseedPath });
      } catch (error) {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Failed to generate GitSeed' 
        });
      }
    }
  };
}


/**
 * Protocol Snapshot Portability Checker
 * Expert Hero Host AI-Assisted Portability Validation
 * Populates wallet with portability information for unpacking new protocol snapshots
 */

import { Protocol, ProtocolObject } from '../types/index.js';
import { HeroHostOrchestrator } from '../core/hero-host.js';
import { AwarenessOctave } from '../types/index.js';

export interface PortabilityCheck {
  id: string;
  protocolId: string;
  snapshotId?: string;
  timestamp: number;
  checks: PortabilityCheckItem[];
  overall: PortabilityStatus;
  heroHostGuidance: string;
  recommendations: string[];
  walletData: WalletPortabilityData;
}

export interface PortabilityCheckItem {
  category: PortabilityCategory;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  details: string;
  score: number; // 0-100
}

export type PortabilityCategory =
  | 'dependencies'
  | 'platform-compatibility'
  | 'environment-variables'
  | 'file-structure'
  | 'api-compatibility'
  | 'data-migration'
  | 'configuration'
  | 'security'
  | 'performance'
  | 'documentation';

export type PortabilityStatus = 'fully-portable' | 'mostly-portable' | 'partially-portable' | 'not-portable';

export interface WalletPortabilityData {
  protocolId: string;
  snapshotId?: string;
  portabilityScore: number;
  status: PortabilityStatus;
  requiredDependencies: string[];
  requiredEnvVars: string[];
  platformSupport: string[];
  migrationSteps: string[];
  unpackInstructions: string[];
  heroHostNotes: string;
  lastChecked: number;
}

export class ProtocolPortabilityChecker {
  private heroHost: HeroHostOrchestrator;
  private checks: Map<string, PortabilityCheck>;

  constructor(heroHost: HeroHostOrchestrator) {
    this.heroHost = heroHost;
    this.checks = new Map();
  }

  /**
   * Check protocol snapshot portability with expert hero host AI assistance
   */
  async checkPortability(
    protocol: Protocol | ProtocolObject,
    options?: {
      targetPlatform?: string;
      targetOctave?: AwarenessOctave;
      includeWalletData?: boolean;
    }
  ): Promise<PortabilityCheck> {
    const checkId = this.generateCheckId();
    const checks: PortabilityCheckItem[] = [];

    // Get expert hero host guidance
    const heroHostPersona = this.heroHost.getCurrentPersona();
    if (!heroHostPersona) {
      // Select expert hero host for portability analysis
      await this.heroHost.selectPersona('expert-architect');
    }

    // Run portability checks
    checks.push(...await this.checkDependencies(protocol));
    checks.push(...await this.checkPlatformCompatibility(protocol, options?.targetPlatform));
    checks.push(...await this.checkEnvironmentVariables(protocol));
    checks.push(...await this.checkFileStructure(protocol));
    checks.push(...await this.checkAPICompatibility(protocol));
    checks.push(...await this.checkDataMigration(protocol));
    checks.push(...await this.checkConfiguration(protocol));
    checks.push(...await this.checkSecurity(protocol));
    checks.push(...await this.checkPerformance(protocol));
    checks.push(...await this.checkDocumentation(protocol));

    // Calculate overall status
    const overall = this.calculateOverallStatus(checks);
    const portabilityScore = this.calculateScore(checks);

    // Get expert hero host guidance
    const heroHostGuidance = await this.getHeroHostGuidance(protocol, checks, overall);
    const recommendations = this.generateRecommendations(checks, overall);

    // Generate wallet data
    const walletData: WalletPortabilityData = {
      protocolId: protocol.id,
      snapshotId: 'snapshotId' in protocol ? protocol.snapshotId : undefined,
      portabilityScore,
      status: overall,
      requiredDependencies: this.extractDependencies(checks),
      requiredEnvVars: this.extractEnvVars(checks),
      platformSupport: this.extractPlatformSupport(checks),
      migrationSteps: this.generateMigrationSteps(checks),
      unpackInstructions: this.generateUnpackInstructions(protocol, checks),
      heroHostNotes: heroHostGuidance,
      lastChecked: Date.now()
    };

    const check: PortabilityCheck = {
      id: checkId,
      protocolId: protocol.id,
      snapshotId: 'snapshotId' in protocol ? protocol.snapshotId : undefined,
      timestamp: Date.now(),
      checks,
      overall,
      heroHostGuidance,
      recommendations,
      walletData
    };

    this.checks.set(checkId, check);

    return check;
  }

  /**
   * Check dependencies portability
   */
  private async checkDependencies(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    // Analyze protocol dependencies
    const dependencies = this.extractDependenciesFromProtocol(protocol);
    
    if (dependencies.length === 0) {
      items.push({
        category: 'dependencies',
        status: 'info',
        message: 'No external dependencies detected',
        details: 'Protocol is self-contained',
        score: 100
      });
    } else {
      // Check each dependency
      dependencies.forEach(dep => {
        const isPortable = this.isDependencyPortable(dep);
        items.push({
          category: 'dependencies',
          status: isPortable ? 'pass' : 'warning',
          message: `Dependency: ${dep}`,
          details: isPortable 
            ? 'Dependency is portable across platforms'
            : 'Dependency may require platform-specific configuration',
          score: isPortable ? 100 : 70
        });
      });
    }

    return items;
  }

  /**
   * Check platform compatibility
   */
  private async checkPlatformCompatibility(
    protocol: Protocol | ProtocolObject,
    targetPlatform?: string
  ): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const platforms = ['node', 'browser', 'deno', 'bun', 'cloudflare-workers'];
    const protocolPlatforms = this.extractPlatformRequirements(protocol);

    platforms.forEach(platform => {
      const isCompatible = protocolPlatforms.includes(platform) || protocolPlatforms.length === 0;
      const isTarget = targetPlatform === platform;
      
      items.push({
        category: 'platform-compatibility',
        status: isCompatible ? 'pass' : 'warning',
        message: `Platform: ${platform}`,
        details: isCompatible
          ? isTarget ? 'Target platform - fully compatible' : 'Compatible'
          : 'May require platform-specific adaptations',
        score: isCompatible ? (isTarget ? 100 : 90) : 50
      });
    });

    return items;
  }

  /**
   * Check environment variables
   */
  private async checkEnvironmentVariables(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const envVars = this.extractEnvVarsFromProtocol(protocol);
    
    if (envVars.length === 0) {
      items.push({
        category: 'environment-variables',
        status: 'info',
        message: 'No environment variables required',
        details: 'Protocol is environment-agnostic',
        score: 100
      });
    } else {
      envVars.forEach(envVar => {
        items.push({
          category: 'environment-variables',
          status: 'pass',
          message: `Environment variable: ${envVar}`,
          details: 'Required for protocol operation',
          score: 90
        });
      });
    }

    return items;
  }

  /**
   * Check file structure
   */
  private async checkFileStructure(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const structure = this.extractFileStructure(protocol);
    const isStandard = this.isStandardStructure(structure);
    
    items.push({
      category: 'file-structure',
      status: isStandard ? 'pass' : 'warning',
      message: 'File structure analysis',
      details: isStandard
        ? 'Follows standard NSPFRP structure'
        : 'May require structure adjustments for portability',
      score: isStandard ? 100 : 75
    });

    return items;
  }

  /**
   * Check API compatibility
   */
  private async checkAPICompatibility(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const apis = this.extractAPIs(protocol);
    const isCompatible = apis.every(api => this.isAPIPortable(api));
    
    items.push({
      category: 'api-compatibility',
      status: isCompatible ? 'pass' : 'warning',
      message: 'API compatibility check',
      details: isCompatible
        ? 'All APIs are portable'
        : 'Some APIs may require platform-specific implementations',
      score: isCompatible ? 100 : 70
    });

    return items;
  }

  /**
   * Check data migration requirements
   */
  private async checkDataMigration(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const requiresMigration = this.requiresDataMigration(protocol);
    
    items.push({
      category: 'data-migration',
      status: requiresMigration ? 'warning' : 'pass',
      message: 'Data migration check',
      details: requiresMigration
        ? 'May require data migration steps'
        : 'No data migration required',
      score: requiresMigration ? 70 : 100
    });

    return items;
  }

  /**
   * Check configuration portability
   */
  private async checkConfiguration(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const config = this.extractConfiguration(protocol);
    const isPortable = this.isConfigurationPortable(config);
    
    items.push({
      category: 'configuration',
      status: isPortable ? 'pass' : 'warning',
      message: 'Configuration portability',
      details: isPortable
        ? 'Configuration is portable'
        : 'May require configuration adjustments',
      score: isPortable ? 100 : 75
    });

    return items;
  }

  /**
   * Check security portability
   */
  private async checkSecurity(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const securityFeatures = this.extractSecurityFeatures(protocol);
    const isSecure = securityFeatures.length > 0;
    
    items.push({
      category: 'security',
      status: isSecure ? 'pass' : 'warning',
      message: 'Security features check',
      details: isSecure
        ? 'Security features are portable'
        : 'May require security review',
      score: isSecure ? 100 : 80
    });

    return items;
  }

  /**
   * Check performance portability
   */
  private async checkPerformance(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const performance = this.analyzePerformance(protocol);
    
    items.push({
      category: 'performance',
      status: performance.isOptimal ? 'pass' : 'info',
      message: 'Performance analysis',
      details: performance.isOptimal
        ? 'Performance is optimal for portability'
        : 'Performance may vary across platforms',
      score: performance.isOptimal ? 100 : 85
    });

    return items;
  }

  /**
   * Check documentation portability
   */
  private async checkDocumentation(protocol: Protocol | ProtocolObject): Promise<PortabilityCheckItem[]> {
    const items: PortabilityCheckItem[] = [];
    
    const hasDocs = this.hasDocumentation(protocol);
    
    items.push({
      category: 'documentation',
      status: hasDocs ? 'pass' : 'warning',
      message: 'Documentation check',
      details: hasDocs
        ? 'Documentation available for portability'
        : 'Documentation may need portability notes',
      score: hasDocs ? 100 : 60
    });

    return items;
  }

  /**
   * Get expert hero host guidance
   */
  private async getHeroHostGuidance(
    protocol: Protocol | ProtocolObject,
    checks: PortabilityCheckItem[],
    overall: PortabilityStatus
  ): Promise<string> {
    const persona = this.heroHost.getCurrentPersona();
    const personaName = persona?.name || 'Expert Architect';
    
    const passCount = checks.filter(c => c.status === 'pass').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const failCount = checks.filter(c => c.status === 'fail').length;
    
    return `As ${personaName}, I've analyzed the portability of protocol "${protocol.id}". 
    
Overall Status: ${overall}
- Passed: ${passCount} checks
- Warnings: ${warningCount} checks
- Failed: ${failCount} checks

${overall === 'fully-portable' 
  ? 'This protocol is fully portable and ready for deployment across platforms.'
  : overall === 'mostly-portable'
  ? 'This protocol is mostly portable with minor adjustments needed.'
  : overall === 'partially-portable'
  ? 'This protocol requires some modifications for full portability.'
  : 'This protocol needs significant work to achieve portability.'}

Key recommendations:
${this.generateRecommendations(checks, overall).slice(0, 3).map(r => `- ${r}`).join('\n')}`;
  }

  /**
   * Calculate overall portability status
   */
  private calculateOverallStatus(checks: PortabilityCheckItem[]): PortabilityStatus {
    const scores = checks.map(c => c.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avgScore >= 90) return 'fully-portable';
    if (avgScore >= 75) return 'mostly-portable';
    if (avgScore >= 50) return 'partially-portable';
    return 'not-portable';
  }

  /**
   * Calculate portability score
   */
  private calculateScore(checks: PortabilityCheckItem[]): number {
    const scores = checks.map(c => c.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(checks: PortabilityCheckItem[], overall: PortabilityStatus): string[] {
    const recommendations: string[] = [];
    
    checks.filter(c => c.status === 'warning' || c.status === 'fail').forEach(check => {
      recommendations.push(`Address ${check.category}: ${check.message}`);
    });
    
    if (overall !== 'fully-portable') {
      recommendations.push('Review and address all warnings before deployment');
    }
    
    return recommendations;
  }

  /**
   * Generate migration steps
   */
  private generateMigrationSteps(checks: PortabilityCheckItem[]): string[] {
    const steps: string[] = [];
    
    checks.forEach(check => {
      if (check.status === 'warning' || check.status === 'fail') {
        steps.push(`Fix ${check.category}: ${check.message}`);
      }
    });
    
    return steps;
  }

  /**
   * Generate unpack instructions
   */
  private generateUnpackInstructions(
    protocol: Protocol | ProtocolObject,
    checks: PortabilityCheckItem[]
  ): string[] {
    const instructions: string[] = [
      `1. Verify protocol ID: ${protocol.id}`,
      `2. Check portability status: ${this.calculateOverallStatus(checks)}`,
      '3. Review required dependencies',
      '4. Set required environment variables',
      '5. Verify platform compatibility',
      '6. Run portability check',
      '7. Unpack protocol snapshot',
      '8. Verify unpacked protocol'
    ];
    
    return instructions;
  }

  // Helper methods (stubs - implement based on actual protocol structure)
  private extractDependenciesFromProtocol(protocol: Protocol | ProtocolObject): string[] {
    return []; // Implement based on protocol structure
  }

  private isDependencyPortable(dep: string): boolean {
    return true; // Implement dependency portability check
  }

  private extractPlatformRequirements(protocol: Protocol | ProtocolObject): string[] {
    return []; // Implement platform extraction
  }

  private extractEnvVarsFromProtocol(protocol: Protocol | ProtocolObject): string[] {
    return []; // Implement env var extraction
  }

  private extractFileStructure(protocol: Protocol | ProtocolObject): any {
    return {}; // Implement file structure extraction
  }

  private isStandardStructure(structure: any): boolean {
    return true; // Implement structure validation
  }

  private extractAPIs(protocol: Protocol | ProtocolObject): string[] {
    return []; // Implement API extraction
  }

  private isAPIPortable(api: string): boolean {
    return true; // Implement API portability check
  }

  private requiresDataMigration(protocol: Protocol | ProtocolObject): boolean {
    return false; // Implement migration check
  }

  private extractConfiguration(protocol: Protocol | ProtocolObject): any {
    return {}; // Implement configuration extraction
  }

  private isConfigurationPortable(config: any): boolean {
    return true; // Implement configuration portability check
  }

  private extractSecurityFeatures(protocol: Protocol | ProtocolObject): string[] {
    return []; // Implement security feature extraction
  }

  private analyzePerformance(protocol: Protocol | ProtocolObject): { isOptimal: boolean } {
    return { isOptimal: true }; // Implement performance analysis
  }

  private hasDocumentation(protocol: Protocol | ProtocolObject): boolean {
    return true; // Implement documentation check
  }

  private extractDependencies(checks: PortabilityCheckItem[]): string[] {
    return checks
      .filter(c => c.category === 'dependencies' && c.status !== 'info')
      .map(c => c.message.replace('Dependency: ', ''));
  }

  private extractEnvVars(checks: PortabilityCheckItem[]): string[] {
    return checks
      .filter(c => c.category === 'environment-variables' && c.status !== 'info')
      .map(c => c.message.replace('Environment variable: ', ''));
  }

  private extractPlatformSupport(checks: PortabilityCheckItem[]): string[] {
    return checks
      .filter(c => c.category === 'platform-compatibility' && c.status === 'pass')
      .map(c => c.message.replace('Platform: ', ''));
  }

  private generateCheckId(): string {
    return `portability-check-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save portability data to wallet
   */
  async saveToWallet(check: PortabilityCheck, walletPath: string): Promise<void> {
    const walletData = {
      ...check.walletData,
      checkId: check.id,
      timestamp: check.timestamp
    };
    
    // Save to wallet directory
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const walletFile = path.join(walletPath, 'portability', `${check.protocolId}.json`);
    await fs.mkdir(path.dirname(walletFile), { recursive: true });
    await fs.writeFile(walletFile, JSON.stringify(walletData, null, 2));
  }
}





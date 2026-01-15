/**
 * Vibeverse Mission Craft
 * Complete mission execution system integrating all NSPFRP components
 */

import {
  OmniMission,
  MissionStep,
  MissionIntent,
  Query,
  Protocol,
  ProtocolSnapshot,
  AgentIdentity,
  TransmissionGear,
  HeroHostPersona,
  Domain,
  FSRRetrievalResult
} from '../types/index.js';
import { TransmissionGearSelector, AwarenessOctave } from '../core/transmission-gears.js';
import { FSRRetrievalEngine } from '../core/fsr-retrieval.js';
import { HeroHostOrchestrator } from '../core/hero-host.js';
import { ProtocolSnapshotManager } from '../protocols/protocol-snapshot.js';
import { CloudDeploymentProtocol } from '../protocols/cloud-deploy.js';
import { IdentityManager } from '../identity/index.js';
import { CloudShellManager } from '../cloud/cloud-shell.js';
import { SeedWithIdentityManager } from '../seeds/seed-with-identity.js';

export interface MissionCraftConfig {
  defaultGear?: AwarenessOctave;
  defaultHeroHost?: string;
  autoDeploy?: boolean;
  enableCloudShell?: boolean;
  enableDiscovery?: boolean;
}

export interface MissionPlan {
  id: string;
  mission: OmniMission;
  steps: PlannedStep[];
  estimatedDuration: number;
  requiredResources: ResourceRequirement[];
  dependencies: string[];
  createdAt: number;
}

export interface PlannedStep {
  id: string;
  type: 'retrieval' | 'synthesis' | 'protocol-creation' | 'deployment' | 'discovery' | 'custom';
  action: string;
  dependencies: string[];
  estimatedDuration: number;
  requiredGear?: AwarenessOctave;
  requiredHeroHost?: string;
}

export interface ResourceRequirement {
  type: 'compute' | 'storage' | 'network' | 'api';
  amount: number;
  unit: string;
}

export interface MissionExecution {
  id: string;
  missionId: string;
  planId: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  steps: ExecutedStep[];
  results: MissionResult[];
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface ExecutedStep {
  id: string;
  plannedStepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
}

export interface MissionResult {
  type: string;
  data: any;
  protocols?: Protocol[];
  snapshots?: ProtocolSnapshot[];
  discoveries?: any[];
  deployments?: any[];
}

export class VibeverseMissionCraft {
  // Core Systems
  private gearSelector: TransmissionGearSelector;
  private fsrRetrieval: FSRRetrievalEngine;
  private heroHost: HeroHostOrchestrator;
  
  // Protocol Systems
  private snapshotManager: ProtocolSnapshotManager;
  private deploymentProtocol: CloudDeploymentProtocol;
  
  // Identity & Infrastructure
  private identityManager: IdentityManager;
  private cloudShell?: CloudShellManager;
  private seedManager: SeedWithIdentityManager;
  
  // Mission Management
  private missions: Map<string, OmniMission>;
  private plans: Map<string, MissionPlan>;
  private executions: Map<string, MissionExecution>;
  
  // Configuration
  private config: MissionCraftConfig;

  constructor(
    gearSelector: TransmissionGearSelector,
    fsrRetrieval: FSRRetrievalEngine,
    heroHost: HeroHostOrchestrator,
    snapshotManager: ProtocolSnapshotManager,
    deploymentProtocol: CloudDeploymentProtocol,
    identityManager: IdentityManager,
    seedManager: SeedWithIdentityManager,
    cloudShell?: CloudShellManager,
    config?: MissionCraftConfig
  ) {
    this.gearSelector = gearSelector;
    this.fsrRetrieval = fsrRetrieval;
    this.heroHost = heroHost;
    this.snapshotManager = snapshotManager;
    this.deploymentProtocol = deploymentProtocol;
    this.identityManager = identityManager;
    this.seedManager = seedManager;
    this.cloudShell = cloudShell;
    this.config = config || {};
    
    this.missions = new Map();
    this.plans = new Map();
    this.executions = new Map();
    
    // Set defaults
    if (this.config.defaultGear !== undefined) {
      this.gearSelector.selectGear(this.config.defaultGear);
    }
    if (this.config.defaultHeroHost) {
      this.heroHost.selectPersona(this.config.defaultHeroHost);
    }
  }

  /**
   * Create a new mission
   */
  async createMission(
    intent: MissionIntent,
    agentIdentity: AgentIdentity,
    options?: {
      gear?: AwarenessOctave;
      heroHost?: string;
      domains?: Domain[];
    }
  ): Promise<OmniMission> {
    const missionId = this.generateMissionId();
    
    // Set gear and hero host
    if (options?.gear !== undefined) {
      this.gearSelector.selectGear(options.gear);
    }
    if (options?.heroHost) {
      this.heroHost.selectPersona(options.heroHost);
    }

    const mission: OmniMission = {
      id: missionId,
      name: this.generateMissionName(intent),
      type: intent.type,
      goal: intent.goal,
      status: 'pending',
      steps: [],
      createdAt: Date.now(),
      metadata: {
        intent,
        agentIdentity,
        gear: this.gearSelector.getCurrentGear(),
        heroHost: this.heroHost.getCurrentPersona(),
        domains: options?.domains || []
      }
    };

    this.missions.set(missionId, mission);
    return mission;
  }

  /**
   * Plan a mission
   */
  async planMission(mission: OmniMission): Promise<MissionPlan> {
    const planId = this.generatePlanId();
    
    // Analyze mission intent and create plan
    const steps = await this.analyzeMissionAndPlanSteps(mission);
    
    // Calculate resource requirements
    const requiredResources = this.calculateResourceRequirements(steps, mission);
    
    // Identify dependencies
    const dependencies = this.identifyDependencies(steps);

    const plan: MissionPlan = {
      id: planId,
      mission,
      steps,
      estimatedDuration: steps.reduce((sum, s) => sum + s.estimatedDuration, 0),
      requiredResources,
      dependencies,
      createdAt: Date.now()
    };

    this.plans.set(planId, plan);
    return plan;
  }

  /**
   * Execute a mission
   */
  async executeMission(
    mission: OmniMission,
    plan: MissionPlan,
    agentIdentity: AgentIdentity
  ): Promise<MissionExecution> {
    const executionId = this.generateExecutionId();
    
    const execution: MissionExecution = {
      id: executionId,
      missionId: mission.id,
      planId: plan.id,
      status: 'running',
      currentStep: 0,
      steps: plan.steps.map(ps => ({
        id: this.generateStepId(),
        plannedStepId: ps.id,
        status: 'pending'
      })),
      results: [],
      startedAt: Date.now()
    };

    this.executions.set(executionId, execution);
    mission.status = 'in-progress';

    // Execute steps sequentially
    try {
      for (let i = 0; i < plan.steps.length; i++) {
        execution.currentStep = i;
        const step = execution.steps[i];
        const plannedStep = plan.steps[i];

        step.status = 'running';
        step.startedAt = Date.now();

        try {
          // Execute step based on type
          const result = await this.executeStep(plannedStep, mission, agentIdentity);
          
          step.status = 'completed';
          step.result = result;
          step.completedAt = Date.now();
          step.duration = step.completedAt - (step.startedAt || 0);

          // Add to results
          execution.results.push(result);

          // Update mission steps
          mission.steps.push({
            id: step.id,
            type: plannedStep.type,
            action: plannedStep.action,
            result,
            timestamp: Date.now()
          });

        } catch (error) {
          step.status = 'failed';
          step.error = error instanceof Error ? error.message : 'Unknown error';
          step.completedAt = Date.now();
          
          execution.status = 'failed';
          execution.error = step.error;
          execution.completedAt = Date.now();
          
          mission.status = 'failed';
          break;
        }
      }

      if (execution.status === 'running') {
        execution.status = 'completed';
        execution.completedAt = Date.now();
        mission.status = 'completed';
      }

    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.completedAt = Date.now();
      mission.status = 'failed';
    }

    return execution;
  }

  /**
   * Execute a single step
   */
  private async executeStep(
    plannedStep: PlannedStep,
    mission: OmniMission,
    agentIdentity: AgentIdentity
  ): Promise<MissionResult> {
    // Set required gear and hero host if specified
    if (plannedStep.requiredGear !== undefined) {
      this.gearSelector.selectGear(plannedStep.requiredGear);
    }
    if (plannedStep.requiredHeroHost) {
      this.heroHost.selectPersona(plannedStep.requiredHeroHost);
    }

    switch (plannedStep.type) {
      case 'retrieval':
        return await this.executeRetrievalStep(plannedStep, mission);
      
      case 'synthesis':
        return await this.executeSynthesisStep(plannedStep, mission);
      
      case 'protocol-creation':
        return await this.executeProtocolCreationStep(plannedStep, mission, agentIdentity);
      
      case 'deployment':
        return await this.executeDeploymentStep(plannedStep, mission, agentIdentity);
      
      case 'discovery':
        return await this.executeDiscoveryStep(plannedStep, mission);
      
      default:
        return await this.executeCustomStep(plannedStep, mission);
    }
  }

  /**
   * Execute retrieval step
   */
  private async executeRetrievalStep(
    plannedStep: PlannedStep,
    mission: OmniMission
  ): Promise<MissionResult> {
    const query: Query = {
      text: plannedStep.action,
      intent: mission.metadata.intent,
      domains: mission.metadata.domains,
      gear: this.gearSelector.getCurrentGear()
    };

    const retrievalResult = await this.fsrRetrieval.retrieve(
      query,
      mission.metadata.domains || []
    );

    // Enrich with hero host
    const enriched = await this.heroHost.enrichRetrieval(
      retrievalResult,
      this.heroHost.getCurrentPersona()!
    );

    return {
      type: 'retrieval',
      data: enriched
    };
  }

  /**
   * Execute synthesis step
   */
  private async executeSynthesisStep(
    plannedStep: PlannedStep,
    mission: OmniMission
  ): Promise<MissionResult> {
    // Get previous retrieval results
    const previousResults = mission.steps
      .filter(s => s.type === 'retrieval')
      .map(s => s.result);

    // Perform synthesis
    const synthesis = await this.performSynthesis(previousResults, mission);

    return {
      type: 'synthesis',
      data: synthesis
    };
  }

  /**
   * Execute protocol creation step
   */
  private async executeProtocolCreationStep(
    plannedStep: PlannedStep,
    mission: OmniMission,
    agentIdentity: AgentIdentity
  ): Promise<MissionResult> {
    // Get synthesis results
    const synthesisResults = mission.steps
      .filter(s => s.type === 'synthesis')
      .map(s => s.result);

    // Create protocol from synthesis
    const protocol = await this.createProtocolFromSynthesis(
      synthesisResults,
      mission
    );

    // Create snapshot with deployment if configured
    const snapshot = await this.snapshotManager.createSnapshot(
      protocol,
      {
        mission,
        gear: this.gearSelector.getCurrentGear(),
        heroHost: this.heroHost.getCurrentPersona() || undefined
      },
      agentIdentity,
      {
        deploy: this.config.autoDeploy ? {
          platform: 'vercel',
          environment: 'production',
          config: {}
        } : undefined,
        createButton: true,
        includeIdentity: true,
        includeEnvironment: true,
        includeCloudShell: this.config.enableCloudShell
      }
    );

    return {
      type: 'protocol-creation',
      data: {
        protocol,
        snapshot
      },
      protocols: [protocol],
      snapshots: [snapshot]
    };
  }

  /**
   * Execute deployment step
   */
  private async executeDeploymentStep(
    plannedStep: PlannedStep,
    mission: OmniMission,
    agentIdentity: AgentIdentity
  ): Promise<MissionResult> {
    // Get protocol from previous steps
    const protocolResults = mission.steps
      .filter(s => s.type === 'protocol-creation')
      .map(s => s.result);

    if (protocolResults.length === 0) {
      throw new Error('No protocol found for deployment');
    }

    const protocol = protocolResults[0].data.protocol;
    
    // Deploy protocol
    const deployment = await this.deploymentProtocol.createDeployment(
      protocol,
      {
        platform: 'vercel',
        environment: 'production',
        config: {}
      }
    );

    return {
      type: 'deployment',
      data: deployment,
      deployments: [deployment]
    };
  }

  /**
   * Execute discovery step
   */
  private async executeDiscoveryStep(
    plannedStep: PlannedStep,
    mission: OmniMission
  ): Promise<MissionResult> {
    // Perform discovery
    const discoveries = await this.performDiscovery(mission);

    return {
      type: 'discovery',
      data: discoveries,
      discoveries
    };
  }

  /**
   * Execute custom step
   */
  private async executeCustomStep(
    plannedStep: PlannedStep,
    mission: OmniMission
  ): Promise<MissionResult> {
    // Execute custom action
    const result = await this.executeCustomAction(plannedStep.action, mission);

    return {
      type: 'custom',
      data: result
    };
  }

  /**
   * Analyze mission and plan steps
   */
  private async analyzeMissionAndPlanSteps(mission: OmniMission): Promise<PlannedStep[]> {
    const steps: PlannedStep[] = [];
    const intent = mission.metadata.intent;

    // Always start with retrieval
    steps.push({
      id: this.generateStepId(),
      type: 'retrieval',
      action: `Retrieve information for: ${intent.goal}`,
      dependencies: [],
      estimatedDuration: 5000,
      requiredGear: this.gearSelector.getCurrentGear().octave
    });

    // Add synthesis step
    steps.push({
      id: this.generateStepId(),
      type: 'synthesis',
      action: 'Synthesize retrieved information',
      dependencies: [steps[0].id],
      estimatedDuration: 3000
    });

    // Add protocol creation if needed
    if (intent.type === 'create' || intent.type === 'synthesize') {
      steps.push({
        id: this.generateStepId(),
        type: 'protocol-creation',
        action: 'Create protocol from synthesis',
        dependencies: [steps[1].id],
        estimatedDuration: 10000
      });
    }

    // Add deployment if configured
    if (this.config.autoDeploy) {
      steps.push({
        id: this.generateStepId(),
        type: 'deployment',
        action: 'Deploy protocol to cloud',
        dependencies: [steps[steps.length - 1].id],
        estimatedDuration: 15000
      });
    }

    // Add discovery if enabled
    if (this.config.enableDiscovery) {
      steps.push({
        id: this.generateStepId(),
        type: 'discovery',
        action: 'Discover related protocols',
        dependencies: [],
        estimatedDuration: 8000
      });
    }

    return steps;
  }

  /**
   * Calculate resource requirements
   */
  private calculateResourceRequirements(
    steps: PlannedStep[],
    mission: OmniMission
  ): ResourceRequirement[] {
    const requirements: ResourceRequirement[] = [];

    // Compute requirements
    const computeSteps = steps.filter(s => 
      s.type === 'synthesis' || s.type === 'protocol-creation'
    );
    if (computeSteps.length > 0) {
      requirements.push({
        type: 'compute',
        amount: computeSteps.length * 1000,
        unit: 'CPU-seconds'
      });
    }

    // Storage requirements
    requirements.push({
      type: 'storage',
      amount: 100,
      unit: 'MB'
    });

    // Network requirements
    requirements.push({
      type: 'network',
      amount: 50,
      unit: 'MB'
    });

    return requirements;
  }

  /**
   * Identify dependencies
   */
  private identifyDependencies(steps: PlannedStep[]): string[] {
    const dependencies = new Set<string>();
    
    steps.forEach(step => {
      step.dependencies.forEach(dep => {
        dependencies.add(dep);
      });
    });

    return Array.from(dependencies);
  }

  /**
   * Perform synthesis
   */
  private async performSynthesis(results: any[], mission: OmniMission): Promise<any> {
    // Combine retrieval results
    const combined = results
      .filter(r => r?.type === 'retrieval')
      .map(r => r.data)
      .reduce((acc, curr) => {
        return {
          ...acc,
          retrievals: [...(acc.retrievals || []), ...(curr.baseRetrieval?.retrievals || [])],
          synthesized: {
            ...acc.synthesized,
            ...curr.baseRetrieval?.synthesized
          }
        };
      }, { retrievals: [], synthesized: {} });

    return combined;
  }

  /**
   * Create protocol from synthesis
   */
  private async createProtocolFromSynthesis(
    synthesisResults: any[],
    mission: OmniMission
  ): Promise<Protocol> {
    const synthesis = synthesisResults[0]?.data || {};
    
    const protocol: Protocol = {
      id: this.generateProtocolId(),
      name: `${mission.name} Protocol`,
      version: '1.0.0',
      type: 'protocol',
      content: JSON.stringify(synthesis),
      structure: {
        sections: [],
        components: [],
        flows: []
      },
      metadata: {
        id: this.generateProtocolId(),
        name: `${mission.name} Protocol`,
        description: `Protocol generated from mission: ${mission.goal}`,
        author: mission.metadata.agentIdentity.name,
        tags: [mission.type],
        category: 'mission-generated',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return protocol;
  }

  /**
   * Perform discovery
   */
  private async performDiscovery(mission: OmniMission): Promise<any[]> {
    // Discovery logic would go here
    return [];
  }

  /**
   * Execute custom action
   */
  private async executeCustomAction(action: string, mission: OmniMission): Promise<any> {
    // Custom action execution
    return { action, result: 'executed' };
  }

  /**
   * Get mission by ID
   */
  getMission(missionId: string): OmniMission | undefined {
    return this.missions.get(missionId);
  }

  /**
   * Get plan by ID
   */
  getPlan(planId: string): MissionPlan | undefined {
    return this.plans.get(planId);
  }

  /**
   * Get execution by ID
   */
  getExecution(executionId: string): MissionExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * List all missions
   */
  listMissions(): OmniMission[] {
    return Array.from(this.missions.values());
  }

  /**
   * Generate IDs
   */
  private generateMissionId(): string {
    return `MISSION-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generatePlanId(): string {
    return `PLAN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateExecutionId(): string {
    return `EXEC-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateStepId(): string {
    return `STEP-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateProtocolId(): string {
    return `PROTOCOL-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateMissionName(intent: MissionIntent): string {
    return `${intent.type.charAt(0).toUpperCase() + intent.type.slice(1)} Mission: ${intent.goal.substring(0, 50)}`;
  }
}



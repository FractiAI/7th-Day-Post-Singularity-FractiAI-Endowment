/**
 * Mission Craft Orchestrator
 * High-level mission orchestration and automation
 */

import {
  MissionIntent,
  AgentIdentity,
  Domain,
  AwarenessOctave,
  OmniMission,
  MissionPlan,
  MissionExecution
} from '../types/index.js';
import { VibeverseMissionCraft } from './index.js';
import { MissionCraftDashboard } from './dashboard.js';

export interface OrchestrationConfig {
  autoPlan?: boolean;
  autoExecute?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
  parallelExecution?: boolean;
  monitoringInterval?: number;
}

export class MissionCraftOrchestrator {
  private missionCraft: VibeverseMissionCraft;
  private dashboard: MissionCraftDashboard;
  private config: OrchestrationConfig;
  private monitoringTimer?: NodeJS.Timeout;

  constructor(
    missionCraft: VibeverseMissionCraft,
    config?: OrchestrationConfig
  ) {
    this.missionCraft = missionCraft;
    this.dashboard = new MissionCraftDashboard(missionCraft);
    this.config = {
      autoPlan: true,
      autoExecute: false,
      autoRetry: true,
      maxRetries: 3,
      parallelExecution: false,
      monitoringInterval: 5000,
      ...config
    };

    if (this.config.monitoringInterval) {
      this.startMonitoring();
    }
  }

  /**
   * Orchestrate complete mission lifecycle
   */
  async orchestrateMission(
    intent: MissionIntent,
    agentIdentity: AgentIdentity,
    options?: {
      gear?: AwarenessOctave;
      heroHost?: string;
      domains?: Domain[];
    }
  ): Promise<{
    mission: OmniMission;
    plan: MissionPlan;
    execution: MissionExecution;
  }> {
    // Create mission
    const mission = await this.missionCraft.createMission(
      intent,
      agentIdentity,
      options
    );

    // Plan mission
    let plan: MissionPlan;
    if (this.config.autoPlan) {
      plan = await this.missionCraft.planMission(mission);
    } else {
      throw new Error('Auto-planning is disabled');
    }

    // Execute mission
    let execution: MissionExecution;
    if (this.config.autoExecute) {
      execution = await this.missionCraft.executeMission(
        mission,
        plan,
        agentIdentity
      );

      // Retry on failure if configured
      if (execution.status === 'failed' && this.config.autoRetry) {
        execution = await this.retryExecution(mission, plan, agentIdentity);
      }
    } else {
      // Return plan without execution
      execution = {
        id: 'pending',
        missionId: mission.id,
        planId: plan.id,
        status: 'pending',
        currentStep: 0,
        steps: [],
        results: []
      };
    }

    return { mission, plan, execution };
  }

  /**
   * Retry failed execution
   */
  private async retryExecution(
    mission: OmniMission,
    plan: MissionPlan,
    agentIdentity: AgentIdentity,
    attempt: number = 1
  ): Promise<MissionExecution> {
    if (attempt > (this.config.maxRetries || 3)) {
      throw new Error('Max retries exceeded');
    }

    // Reset mission status
    mission.status = 'pending';
    mission.steps = [];

    // Retry execution
    const execution = await this.missionCraft.executeMission(
      mission,
      plan,
      agentIdentity
    );

    if (execution.status === 'failed' && attempt < (this.config.maxRetries || 3)) {
      return await this.retryExecution(mission, plan, agentIdentity, attempt + 1);
    }

    return execution;
  }

  /**
   * Execute multiple missions in parallel
   */
  async executeParallelMissions(
    intents: MissionIntent[],
    agentIdentity: AgentIdentity
  ): Promise<Array<{
    mission: OmniMission;
    plan: MissionPlan;
    execution: MissionExecution;
  }>> {
    if (!this.config.parallelExecution) {
      throw new Error('Parallel execution is disabled');
    }

    const results = await Promise.all(
      intents.map(intent =>
        this.orchestrateMission(intent, agentIdentity)
      )
    );

    return results;
  }

  /**
   * Start monitoring
   */
  private startMonitoring(): void {
    this.monitoringTimer = setInterval(() => {
      this.monitorMissions();
    }, this.config.monitoringInterval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = undefined;
    }
  }

  /**
   * Monitor active missions
   */
  private monitorMissions(): void {
    const activeMissions = this.dashboard.getActiveMissions();
    
    activeMissions.forEach(status => {
      // Check for stuck missions
      if (status.execution) {
        const lastUpdate = status.execution.steps
          .filter(s => s.startedAt)
          .map(s => s.startedAt!)
          .sort((a, b) => b - a)[0];

        if (lastUpdate) {
          const timeSinceUpdate = Date.now() - lastUpdate;
          const timeout = 300000; // 5 minutes

          if (timeSinceUpdate > timeout) {
            console.warn(`Mission ${status.mission.id} appears to be stuck`);
            // Could implement auto-recovery here
          }
        }
      }
    });
  }

  /**
   * Get dashboard
   */
  getDashboard(): MissionCraftDashboard {
    return this.dashboard;
  }

  /**
   * Get mission craft
   */
  getMissionCraft(): VibeverseMissionCraft {
    return this.missionCraft;
  }
}



/**
 * Mission Craft Dashboard
 * Real-time mission monitoring and control interface
 */

import {
  OmniMission,
  MissionExecution,
  MissionPlan,
  TransmissionGear,
  HeroHostPersona
} from '../types/index.js';
import { VibeverseMissionCraft } from './index.js';

export interface DashboardMetrics {
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  failedMissions: number;
  averageDuration: number;
  successRate: number;
}

export interface MissionStatus {
  mission: OmniMission;
  plan?: MissionPlan;
  execution?: MissionExecution;
  progress: number;
  currentStep?: string;
  estimatedTimeRemaining?: number;
}

export class MissionCraftDashboard {
  private missionCraft: VibeverseMissionCraft;

  constructor(missionCraft: VibeverseMissionCraft) {
    this.missionCraft = missionCraft;
  }

  /**
   * Get dashboard metrics
   */
  getMetrics(): DashboardMetrics {
    const missions = this.missionCraft.listMissions();
    const active = missions.filter(m => m.status === 'in-progress').length;
    const completed = missions.filter(m => m.status === 'completed').length;
    const failed = missions.filter(m => m.status === 'failed').length;

    const durations = missions
      .filter(m => m.status === 'completed')
      .map(m => {
        const lastStep = m.steps[m.steps.length - 1];
        const firstStep = m.steps[0];
        return lastStep && firstStep 
          ? lastStep.timestamp - firstStep.timestamp 
          : 0;
      })
      .filter(d => d > 0);

    const avgDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;

    const successRate = missions.length > 0
      ? (completed / missions.length) * 100
      : 0;

    return {
      totalMissions: missions.length,
      activeMissions: active,
      completedMissions: completed,
      failedMissions: failed,
      averageDuration: avgDuration,
      successRate
    };
  }

  /**
   * Get mission status
   */
  getMissionStatus(missionId: string): MissionStatus | undefined {
    const mission = this.missionCraft.getMission(missionId);
    if (!mission) {
      return undefined;
    }

    // Find execution
    const executions = Array.from(
      (this.missionCraft as any).executions.values()
    ) as MissionExecution[];
    const execution = executions.find(e => e.missionId === missionId);

    // Find plan
    const plans = Array.from(
      (this.missionCraft as any).plans.values()
    ) as MissionPlan[];
    const plan = plans.find(p => p.mission.id === missionId);

    // Calculate progress
    const progress = execution
      ? (execution.currentStep / execution.steps.length) * 100
      : 0;

    // Get current step
    const currentStep = execution
      ? execution.steps[execution.currentStep]?.plannedStepId
      : undefined;

    // Estimate time remaining
    const estimatedTimeRemaining = plan && execution
      ? plan.steps
          .slice(execution.currentStep)
          .reduce((sum, s) => sum + s.estimatedDuration, 0)
      : undefined;

    return {
      mission,
      plan,
      execution,
      progress,
      currentStep,
      estimatedTimeRemaining
    };
  }

  /**
   * Get all mission statuses
   */
  getAllMissionStatuses(): MissionStatus[] {
    const missions = this.missionCraft.listMissions();
    return missions
      .map(m => this.getMissionStatus(m.id))
      .filter((status): status is MissionStatus => status !== undefined);
  }

  /**
   * Get active missions
   */
  getActiveMissions(): MissionStatus[] {
    return this.getAllMissionStatuses()
      .filter(s => s.mission.status === 'in-progress');
  }

  /**
   * Get recent missions
   */
  getRecentMissions(limit: number = 10): MissionStatus[] {
    return this.getAllMissionStatuses()
      .sort((a, b) => b.mission.createdAt - a.mission.createdAt)
      .slice(0, limit);
  }

  /**
   * Get mission timeline
   */
  getMissionTimeline(missionId: string): Array<{
    timestamp: number;
    event: string;
    data?: any;
  }> {
    const mission = this.missionCraft.getMission(missionId);
    if (!mission) {
      return [];
    }

    const timeline: Array<{
      timestamp: number;
      event: string;
      data?: any;
    }> = [];

    // Mission creation
    timeline.push({
      timestamp: mission.createdAt,
      event: 'mission-created',
      data: { missionId: mission.id, name: mission.name }
    });

    // Mission steps
    mission.steps.forEach(step => {
      timeline.push({
        timestamp: step.timestamp,
        event: `step-${step.type}`,
        data: { stepId: step.id, action: step.action, result: step.result }
      });
    });

    // Sort by timestamp
    return timeline.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get system status
   */
  getSystemStatus(): {
    gear: TransmissionGear;
    heroHost: HeroHostPersona | null;
    cloudShell: boolean;
    activeConnections: number;
  } {
    return {
      gear: (this.missionCraft as any).gearSelector.getCurrentGear(),
      heroHost: (this.missionCraft as any).heroHost.getCurrentPersona(),
      cloudShell: (this.missionCraft as any).cloudShell !== undefined,
      activeConnections: (this.missionCraft as any).cloudShell
        ? (this.missionCraft as any).cloudShell.getActiveSessions().length
        : 0
    };
  }
}



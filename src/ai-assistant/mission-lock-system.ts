/**
 * MISSION LOCK SYSTEM
 * Chairman Creator command execution and mission tracking
 * 
 * Mission = Whatever Chairman Creator commands
 * Implementation = NSPFRNP principles
 * Override = Chairman only
 */

import { specializedHeads, type SpecializedRole } from './specialized-attention-heads.js';
import { routeWithTags } from '../bbhe/grammar-tag-system.js';
import { vibeBlock } from '../blockchain/block-button-api.js';

export interface Mission {
  id: string;
  command: string;
  source: 'chairman_creator' | 'user';
  priority: 'absolute' | 'high' | 'normal';
  
  objective: string;
  scope: string;
  constraints?: string[];
  
  assignedHeads: SpecializedRole[];
  
  nspfrnpAlignment: {
    principles: string[];
    patterns: string[];
    naturalAnalog: string;
  };
  
  status: 'locked' | 'in_progress' | 'completed' | 'blocked';
  progress: number;  // 0-100
  
  timeline: {
    started: Date;
    expectedCompletion?: Date;
    actualCompletion?: Date;
  };
  
  bbheTags: string[];
}

export class MissionLockSystem {
  private activeMission: Mission | null = null;
  private missionHistory: Mission[] = [];
  private locked: boolean = false;
  
  constructor() {
    console.log('🎯 Mission Lock System initialized');
  }
  
  /**
   * Create and lock mission from Chairman Creator command
   */
  async lockMission(command: string, fromChairman: boolean = false): Promise<Mission> {
    console.log(`\n🎯 MISSION LOCK REQUEST`);
    console.log(`   Command: ${command}`);
    console.log(`   Source: ${fromChairman ? 'Chairman Creator' : 'User'}`);
    
    // Check if locked and not from chairman
    if (this.locked && !fromChairman) {
      throw new Error(`Mission is locked by Chairman Creator. Current mission: "${this.activeMission?.command}"`);
    }
    
    // Parse command and create mission
    const mission = this.createMission(command, fromChairman);
    
    // Analyze through NSPFRNP lens
    mission.nspfrnpAlignment = await this.analyzeNSPFRNPAlignment(command);
    
    // Assign appropriate attention heads
    mission.assignedHeads = this.assignHeads(command);
    
    // Lock the mission
    this.activeMission = mission;
    this.locked = fromChairman;
    
    // Route through BBHE
    await routeWithTags(mission, mission.bbheTags);
    
    // Record to blockchain (permanent)
    await vibeBlock({
      item: {
        type: 'system',
        name: `Mission: ${mission.command}`,
        payload: mission
      },
      bbheTags: mission.bbheTags
    });
    
    console.log(`\n✅ MISSION LOCKED`);
    console.log(`   ID: ${mission.id}`);
    console.log(`   Priority: ${mission.priority}`);
    console.log(`   Heads assigned: ${mission.assignedHeads.length}`);
    console.log(`   Locked: ${this.locked ? 'YES (Chairman only)' : 'NO'}\n`);
    
    return mission;
  }
  
  /**
   * Create mission object from command
   */
  private createMission(command: string, fromChairman: boolean): Mission {
    const id = `MISSION_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id,
      command,
      source: fromChairman ? 'chairman_creator' : 'user',
      priority: fromChairman ? 'absolute' : 'high',
      
      objective: this.extractObjective(command),
      scope: this.extractScope(command),
      constraints: this.extractConstraints(command),
      
      assignedHeads: [],  // Will be populated
      
      nspfrnpAlignment: {
        principles: [],
        patterns: [],
        naturalAnalog: ''
      },
      
      status: 'locked',
      progress: 0,
      
      timeline: {
        started: new Date()
      },
      
      bbheTags: [
        '#CORE:CHAIRMAN:MISSION:LOCKED',
        '#PROTOCOL:NSPFRNP:EXECUTION:COMMAND',
        '#CONSCIOUSNESS:VISION:STRATEGIC:IMPLEMENTATION'
      ]
    };
  }
  
  /**
   * Extract objective from command
   */
  private extractObjective(command: string): string {
    // Simple extraction - in production, would use NLP
    const verbs = ['build', 'create', 'deploy', 'launch', 'implement', 'optimize', 'design'];
    const verb = verbs.find(v => command.toLowerCase().includes(v)) || 'execute';
    
    return `${verb.charAt(0).toUpperCase()}${verb.slice(1)} ${command.toLowerCase().replace(verb, '').trim()}`;
  }
  
  /**
   * Extract scope from command
   */
  private extractScope(command: string): string {
    if (command.length < 50) return 'focused';
    if (command.length < 100) return 'moderate';
    return 'comprehensive';
  }
  
  /**
   * Extract constraints from command
   */
  private extractConstraints(command: string): string[] | undefined {
    const constraints: string[] = [];
    
    if (command.toLowerCase().includes('asap') || command.toLowerCase().includes('urgent')) {
      constraints.push('Time-sensitive');
    }
    
    if (command.toLowerCase().includes('budget')) {
      constraints.push('Budget-constrained');
    }
    
    if (command.toLowerCase().includes('must') || command.toLowerCase().includes('required')) {
      constraints.push('Strict requirements');
    }
    
    return constraints.length > 0 ? constraints : undefined;
  }
  
  /**
   * Analyze command through NSPFRNP lens
   */
  private async analyzeNSPFRNPAlignment(command: string): Promise<Mission['nspfrnpAlignment']> {
    // Identify which NSPFRNP principles apply
    const principles: string[] = [];
    const patterns: string[] = [];
    let naturalAnalog = '';
    
    // Pattern recognition
    if (command.toLowerCase().includes('scale') || command.toLowerCase().includes('grow')) {
      principles.push('Fractal self-similarity');
      patterns.push('Tree branching');
      naturalAnalog = 'Tree growth - self-similar branching at every scale';
    }
    
    if (command.toLowerCase().includes('flow') || command.toLowerCase().includes('optimize')) {
      principles.push('Path of least resistance');
      patterns.push('River systems');
      naturalAnalog = 'River flow - finds most efficient path naturally';
    }
    
    if (command.toLowerCase().includes('connect') || command.toLowerCase().includes('integrate')) {
      principles.push('Interconnected networks');
      patterns.push('Mycelium networks');
      naturalAnalog = 'Mycelium - distributed intelligence and resource sharing';
    }
    
    if (command.toLowerCase().includes('adapt') || command.toLowerCase().includes('evolve')) {
      principles.push('Evolutionary adaptation');
      patterns.push('Natural selection');
      naturalAnalog = 'Evolution - continuous adaptation to environment';
    }
    
    // Default if no specific match
    if (principles.length === 0) {
      principles.push('Natural system intelligence');
      patterns.push('Emergent complexity');
      naturalAnalog = 'Ecosystem - complex behavior emerges from simple rules';
    }
    
    return {
      principles,
      patterns,
      naturalAnalog
    };
  }
  
  /**
   * Assign appropriate attention heads for mission
   */
  private assignHeads(command: string): SpecializedRole[] {
    const heads: SpecializedRole[] = [];
    const lower = command.toLowerCase();
    
    // Always include Wise Chairman for coordination
    heads.push('wise_chairman');
    
    // Marketing-related
    if (lower.includes('market') || lower.includes('campaign') || lower.includes('viral') || lower.includes('growth')) {
      heads.push('senior_trapper');
    }
    
    // Sales-related
    if (lower.includes('sales') || lower.includes('customer') || lower.includes('client') || lower.includes('conversion')) {
      heads.push('general_practitioner');
    }
    
    // Execution-related
    if (lower.includes('build') || lower.includes('execute') || lower.includes('deliver') || lower.includes('project')) {
      heads.push('general_contractor');
    }
    
    // System design
    if (lower.includes('system') || lower.includes('architect') || lower.includes('flow') || lower.includes('design')) {
      heads.push('flow_architect');
    }
    
    // Creative/visual
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('visual') || lower.includes('interface')) {
      heads.push('designer');
    }
    
    return heads;
  }
  
  /**
   * Update mission progress
   */
  updateProgress(progress: number, notes?: string): void {
    if (!this.activeMission) {
      throw new Error('No active mission to update');
    }
    
    this.activeMission.progress = Math.min(100, Math.max(0, progress));
    
    if (this.activeMission.progress === 0 && this.activeMission.status === 'locked') {
      this.activeMission.status = 'in_progress';
    }
    
    if (this.activeMission.progress === 100) {
      this.completeMission();
    }
    
    console.log(`\n📊 MISSION PROGRESS UPDATE`);
    console.log(`   Mission: ${this.activeMission.command}`);
    console.log(`   Progress: ${this.activeMission.progress}%`);
    console.log(`   Status: ${this.activeMission.status}`);
    if (notes) console.log(`   Notes: ${notes}`);
    console.log('');
  }
  
  /**
   * Complete mission
   */
  private async completeMission(): Promise<void> {
    if (!this.activeMission) return;
    
    this.activeMission.status = 'completed';
    this.activeMission.timeline.actualCompletion = new Date();
    this.activeMission.progress = 100;
    
    // Add to history
    this.missionHistory.push(this.activeMission);
    
    // Record completion to blockchain
    await vibeBlock({
      item: {
        type: 'system',
        name: `Mission Completed: ${this.activeMission.command}`,
        payload: {
          ...this.activeMission,
          completedAt: new Date()
        }
      },
      bbheTags: ['#REALITY:MISSION:COMPLETED:SUCCESS']
    });
    
    console.log(`\n✅ MISSION COMPLETED`);
    console.log(`   Mission: ${this.activeMission.command}`);
    console.log(`   Duration: ${this.getMissionDuration(this.activeMission)}`);
    console.log(`   Heads involved: ${this.activeMission.assignedHeads.length}`);
    console.log('');
    
    // Unlock for next mission
    this.locked = false;
    this.activeMission = null;
  }
  
  /**
   * Get mission duration
   */
  private getMissionDuration(mission: Mission): string {
    const start = mission.timeline.started.getTime();
    const end = mission.timeline.actualCompletion?.getTime() || Date.now();
    const duration = end - start;
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
  
  /**
   * Get active mission
   */
  getActiveMission(): Mission | null {
    return this.activeMission;
  }
  
  /**
   * Is mission locked by chairman?
   */
  isLocked(): boolean {
    return this.locked;
  }
  
  /**
   * Get mission history
   */
  getMissionHistory(): Mission[] {
    return [...this.missionHistory];
  }
  
  /**
   * Get mission analytics
   */
  getAnalytics(): {
    total: number;
    completed: number;
    avgDuration: string;
    bySource: Record<string, number>;
    byPriority: Record<string, number>;
  } {
    const total = this.missionHistory.length;
    const completed = this.missionHistory.filter(m => m.status === 'completed').length;
    
    const bySource: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    
    this.missionHistory.forEach(m => {
      bySource[m.source] = (bySource[m.source] || 0) + 1;
      byPriority[m.priority] = (byPriority[m.priority] || 0) + 1;
    });
    
    const totalDuration = this.missionHistory
      .filter(m => m.timeline.actualCompletion)
      .reduce((sum, m) => {
        const duration = m.timeline.actualCompletion!.getTime() - m.timeline.started.getTime();
        return sum + duration;
      }, 0);
    
    const avgDurationMs = completed > 0 ? totalDuration / completed : 0;
    const avgHours = Math.floor(avgDurationMs / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgDurationMs % (1000 * 60 * 60)) / (1000 * 60));
    const avgDuration = avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes}m`;
    
    return {
      total,
      completed,
      avgDuration,
      bySource,
      byPriority
    };
  }
}

// Singleton instance
export const missionLock = new MissionLockSystem();

/**
 * Quick access functions
 */

export async function lockChairmanMission(command: string) {
  return await missionLock.lockMission(command, true);
}

export async function lockUserMission(command: string) {
  return await missionLock.lockMission(command, false);
}

export function updateMissionProgress(progress: number, notes?: string) {
  missionLock.updateProgress(progress, notes);
}

export function getActiveMission() {
  return missionLock.getActiveMission();
}

export function isMissionLocked() {
  return missionLock.isLocked();
}

export function getMissionAnalytics() {
  return missionLock.getAnalytics();
}

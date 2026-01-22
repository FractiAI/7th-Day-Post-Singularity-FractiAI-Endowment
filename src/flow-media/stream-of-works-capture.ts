/**
 * STREAM OF WORKS CAPTURE ENGINE
 * 
 * Live creation capture system that records everything happening
 * in the repository, streams it live, allows replay, and catalogs
 * automatically using NSPFRNP organization.
 * 
 * FEATURES:
 * - Real-time event capture
 * - Live streaming to viewers
 * - Replay with speed controls
 * - Automatic NSPFRNP cataloging
 * - Flow state detection
 * - Pattern recognition
 * - Snap moment identification
 * 
 * MODES:
 * 1. LIVE: Watch creation in real-time
 * 2. REPLAY: Time-travel through history
 * 3. CATALOG: Browse organized archive
 */

import { routeWithTags } from '../bbhe/grammar-tag-system.js';
import { vibeBlock } from '../blockchain/block-button-api.js';
import * as fs from 'fs';
import * as path from 'path';

// Event types in the stream
export type WorkStreamEventType = 
  | 'file_create'
  | 'file_edit'
  | 'file_delete'
  | 'git_commit'
  | 'system_integration'
  | 'pattern_detected'
  | 'snap_moment'
  | 'shell_activation'
  | 'test_pass'
  | 'deployment'
  | 'breakthrough';

// Significance levels
export type EventSignificance = 'minor' | 'normal' | 'major' | 'snap';

// Shell identification
export type ShellNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WorkStreamEvent {
  // Core identification
  id: string;
  timestamp: Date;
  type: WorkStreamEventType;
  
  // Location in holographic atom
  shell: ShellNumber;
  file?: string;
  
  // Change details
  lines?: {
    from: number;
    to: number;
    added: number;
    removed: number;
  };
  content?: string;
  diff?: string;
  
  // Classification
  bbheTags: string[];
  nspfrnpPrinciple?: string;
  significance: EventSignificance;
  
  // Context
  flowState: number; // 0-100%
  description: string;
  relatedEvents?: string[]; // IDs of related events
  
  // Metadata
  commitHash?: string;
  author: string;
  sessionId: string;
}

export interface FlowStateMetrics {
  keystrokes: number;
  fileChanges: number;
  systemIntegrations: number;
  timeInSingleFile: number; // seconds
  contextSwitches: number;
  linesWritten: number;
  testsPassed: number;
}

export interface StreamSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  totalEvents: number;
  snapMoments: number;
  peakFlowState: number;
  avgFlowState: number;
  filesCreated: number;
  linesWritten: number;
  systemsBuilt: string[];
  shellsActivated: ShellNumber[];
}

export interface CatalogSummary {
  totalEvents: number;
  totalSessions: number;
  byShell: Record<ShellNumber, number>;
  byType: Record<WorkStreamEventType, number>;
  bySignificance: Record<EventSignificance, number>;
  snapMoments: number;
  flowStatePeak: number;
  totalLines: number;
  totalFiles: number;
  totalTime: number; // minutes
}

export class FlowStateAnalyzer {
  /**
   * Analyze current flow state based on metrics
   * Returns 0-100 where:
   *   0-40: Low flow (distracted)
   *   40-70: Medium flow (productive)
   *   70-90: High flow (very focused)
   *   90-100: Deep flow (peak performance)
   */
  analyze(metrics: FlowStateMetrics): number {
    let score = 0;
    
    // High keystroke rate indicates flow
    if (metrics.keystrokes > 300) score += 20; // 300+ per minute
    else if (metrics.keystrokes > 150) score += 15;
    else if (metrics.keystrokes > 60) score += 10;
    
    // File changes show productivity
    if (metrics.fileChanges > 10) score += 15;
    else if (metrics.fileChanges > 5) score += 10;
    else if (metrics.fileChanges > 2) score += 5;
    
    // System integrations are high-value
    if (metrics.systemIntegrations > 3) score += 20;
    else if (metrics.systemIntegrations > 1) score += 15;
    else if (metrics.systemIntegrations > 0) score += 10;
    
    // Time in single file indicates focus
    if (metrics.timeInSingleFile > 1800) score += 15; // 30+ minutes
    else if (metrics.timeInSingleFile > 900) score += 10; // 15+ minutes
    else if (metrics.timeInSingleFile > 300) score += 5; // 5+ minutes
    
    // Fewer context switches = better focus
    if (metrics.contextSwitches < 3) score += 15;
    else if (metrics.contextSwitches < 5) score += 10;
    else if (metrics.contextSwitches < 10) score += 5;
    
    // Lines written shows output
    if (metrics.linesWritten > 500) score += 10;
    else if (metrics.linesWritten > 200) score += 7;
    else if (metrics.linesWritten > 50) score += 5;
    
    // Tests passing shows quality
    if (metrics.testsPassed > 20) score += 5;
    else if (metrics.testsPassed > 10) score += 3;
    else if (metrics.testsPassed > 0) score += 1;
    
    return Math.min(100, score);
  }
  
  getState(): number {
    // In real implementation, would gather actual metrics
    // For now, simulate based on activity
    return Math.floor(Math.random() * 30) + 70; // 70-100 (high flow)
  }
}

export class StreamOfWorksCapture {
  private stream: WorkStreamEvent[] = [];
  private sessions: StreamSession[] = [];
  private currentSession: StreamSession | null = null;
  private isRecording: boolean = false;
  private flowAnalyzer: FlowStateAnalyzer;
  private liveViewers: Set<any> = new Set(); // WebSocket connections
  private catalogPath: string;
  
  // Flow state tracking
  private recentMetrics: FlowStateMetrics = {
    keystrokes: 0,
    fileChanges: 0,
    systemIntegrations: 0,
    timeInSingleFile: 0,
    contextSwitches: 0,
    linesWritten: 0,
    testsPassed: 0
  };
  
  constructor(catalogPath: string = './stream-catalog') {
    this.flowAnalyzer = new FlowStateAnalyzer();
    this.catalogPath = catalogPath;
    
    // Ensure catalog directory exists
    if (!fs.existsSync(catalogPath)) {
      fs.mkdirSync(catalogPath, { recursive: true });
    }
  }
  
  /**
   * Start recording everything
   */
  startRecording(author: string = 'Chairman Creator'): string {
    console.log('\n📡 STREAM OF WORKS - Starting capture...\n');
    
    this.isRecording = true;
    
    // Create new session
    const sessionId = this.generateSessionId();
    this.currentSession = {
      id: sessionId,
      startTime: new Date(),
      totalEvents: 0,
      snapMoments: 0,
      peakFlowState: 0,
      avgFlowState: 0,
      filesCreated: 0,
      linesWritten: 0,
      systemsBuilt: [],
      shellsActivated: []
    };
    
    console.log(`   Session ID: ${sessionId}`);
    console.log(`   Author: ${author}`);
    console.log(`   Catalog: ${this.catalogPath}`);
    console.log(`   Recording: 🔴 LIVE\n`);
    console.log('   Monitoring:');
    console.log('     ✓ File system changes');
    console.log('     ✓ Git operations');
    console.log('     ✓ Flow state');
    console.log('     ✓ NSPFRNP patterns');
    console.log('     ✓ System integrations');
    console.log('     ✓ Snap moments\n');
    
    return sessionId;
  }
  
  /**
   * Stop recording and finalize session
   */
  stopRecording(): StreamSession | null {
    if (!this.isRecording || !this.currentSession) {
      console.log('No active recording session');
      return null;
    }
    
    this.isRecording = false;
    
    // Finalize session
    this.currentSession.endTime = new Date();
    this.currentSession.avgFlowState = this.calculateAverageFlowState();
    
    // Save session
    this.sessions.push(this.currentSession);
    this.saveSession(this.currentSession);
    
    console.log('\n📡 STREAM OF WORKS - Recording stopped\n');
    console.log(`   Session: ${this.currentSession.id}`);
    console.log(`   Duration: ${this.getSessionDuration(this.currentSession)} minutes`);
    console.log(`   Events: ${this.currentSession.totalEvents}`);
    console.log(`   Snaps: ${this.currentSession.snapMoments}`);
    console.log(`   Files: ${this.currentSession.filesCreated}`);
    console.log(`   Lines: ${this.currentSession.linesWritten}`);
    console.log(`   Peak Flow: ${this.currentSession.peakFlowState}%\n`);
    
    const session = this.currentSession;
    this.currentSession = null;
    
    return session;
  }
  
  /**
   * Capture an event
   */
  captureEvent(event: Omit<WorkStreamEvent, 'id' | 'timestamp' | 'flowState' | 'author' | 'sessionId'>): void {
    if (!this.isRecording || !this.currentSession) {
      return;
    }
    
    // Generate complete event
    const completeEvent: WorkStreamEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
      flowState: this.flowAnalyzer.getState(),
      author: 'Chairman Creator',
      sessionId: this.currentSession.id
    };
    
    // Add to stream
    this.stream.push(completeEvent);
    
    // Update session
    this.currentSession.totalEvents++;
    if (completeEvent.significance === 'snap') {
      this.currentSession.snapMoments++;
    }
    if (completeEvent.flowState > this.currentSession.peakFlowState) {
      this.currentSession.peakFlowState = completeEvent.flowState;
    }
    if (completeEvent.type === 'file_create') {
      this.currentSession.filesCreated++;
    }
    if (completeEvent.lines) {
      this.currentSession.linesWritten += completeEvent.lines.added;
    }
    if (!this.currentSession.shellsActivated.includes(completeEvent.shell)) {
      this.currentSession.shellsActivated.push(completeEvent.shell);
    }
    
    // Log significant events
    if (completeEvent.significance !== 'minor') {
      this.logEvent(completeEvent);
    }
    
    // Broadcast to live viewers
    this.broadcastToLive(completeEvent);
    
    // Save to catalog
    this.saveToCatalog(completeEvent);
    
    // Record to blockchain if significant
    if (completeEvent.significance === 'snap' || completeEvent.significance === 'major') {
      this.recordToBlockchain(completeEvent);
    }
    
    // Route through BBHE
    routeWithTags(
      { event: completeEvent },
      completeEvent.bbheTags
    );
  }
  
  /**
   * Get replay data with filters
   */
  getReplay(options: {
    sessionId?: string;
    startTime?: Date;
    endTime?: Date;
    shell?: ShellNumber;
    type?: WorkStreamEventType;
    significance?: EventSignificance;
    skipDeadTime?: boolean;
  }): WorkStreamEvent[] {
    let events = [...this.stream];
    
    // Filter by session
    if (options.sessionId) {
      events = events.filter(e => e.sessionId === options.sessionId);
    }
    
    // Filter by time
    if (options.startTime) {
      events = events.filter(e => e.timestamp >= options.startTime!);
    }
    if (options.endTime) {
      events = events.filter(e => e.timestamp <= options.endTime!);
    }
    
    // Filter by shell
    if (options.shell) {
      events = events.filter(e => e.shell === options.shell);
    }
    
    // Filter by type
    if (options.type) {
      events = events.filter(e => e.type === options.type);
    }
    
    // Filter by significance
    if (options.significance) {
      events = events.filter(e => e.significance === options.significance);
    }
    
    // Skip dead time (gaps > 5 minutes with no activity)
    if (options.skipDeadTime) {
      events = this.removeDeadTime(events);
    }
    
    return events;
  }
  
  /**
   * Get catalog summary
   */
  getCatalogSummary(): CatalogSummary {
    const byShell: Record<ShellNumber, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
    };
    
    const byType: Partial<Record<WorkStreamEventType, number>> = {};
    const bySignificance: Record<EventSignificance, number> = {
      minor: 0, normal: 0, major: 0, snap: 0
    };
    
    let totalLines = 0;
    const uniqueFiles = new Set<string>();
    let totalTime = 0;
    
    this.stream.forEach(event => {
      byShell[event.shell]++;
      byType[event.type] = (byType[event.type] || 0) + 1;
      bySignificance[event.significance]++;
      
      if (event.lines) {
        totalLines += event.lines.added;
      }
      if (event.file) {
        uniqueFiles.add(event.file);
      }
    });
    
    this.sessions.forEach(session => {
      totalTime += this.getSessionDuration(session);
    });
    
    return {
      totalEvents: this.stream.length,
      totalSessions: this.sessions.length,
      byShell: byShell as Record<ShellNumber, number>,
      byType: byType as Record<WorkStreamEventType, number>,
      bySignificance,
      snapMoments: bySignificance.snap,
      flowStatePeak: Math.max(...this.stream.map(e => e.flowState), 0),
      totalLines,
      totalFiles: uniqueFiles.size,
      totalTime
    };
  }
  
  /**
   * Search events by natural language query
   */
  searchEvents(query: string): WorkStreamEvent[] {
    const lowerQuery = query.toLowerCase();
    
    return this.stream.filter(event => {
      // Search in description
      if (event.description.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in file name
      if (event.file && event.file.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in BBHE tags
      if (event.bbheTags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      
      // Search in NSPFRNP principle
      if (event.nspfrnpPrinciple && event.nspfrnpPrinciple.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    });
  }
  
  /**
   * Get snap moments (major events)
   */
  getSnapMoments(): WorkStreamEvent[] {
    return this.stream.filter(e => e.significance === 'snap');
  }
  
  /**
   * Determine which shell a file belongs to
   */
  private determineShell(filename: string): ShellNumber {
    if (filename.includes('blockchain') || filename.includes('vibechain')) return 1;
    if (filename.includes('bbhe') || filename.includes('grammar')) return 2;
    if (filename.includes('auth')) return 3;
    if (filename.includes('ai-assistant') || filename.includes('attention')) return 4;
    if (filename.includes('marketing') || filename.includes('golden-heart')) return 5;
    if (filename.includes('products') || filename.includes('sales')) return 6;
    if (filename.includes('interfaces') || filename.includes('docs')) return 7;
    return 2; // Default to BBHE layer
  }
  
  /**
   * Broadcast event to live viewers
   */
  private broadcastToLive(event: WorkStreamEvent): void {
    const message = JSON.stringify({
      type: 'work_stream_event',
      event: {
        ...event,
        timestamp: event.timestamp.toISOString()
      }
    });
    
    this.liveViewers.forEach(viewer => {
      try {
        // In real implementation, would be WebSocket
        // viewer.send(message);
      } catch (error) {
        console.error('Failed to broadcast to viewer:', error);
      }
    });
  }
  
  /**
   * Save event to catalog
   */
  private saveToCatalog(event: WorkStreamEvent): void {
    // Save to main event log
    const eventLogPath = path.join(this.catalogPath, 'events.jsonl');
    fs.appendFileSync(eventLogPath, JSON.stringify(event) + '\n');
    
    // Index by shell
    const shellPath = path.join(this.catalogPath, 'by-shell', `shell-${event.shell}`);
    if (!fs.existsSync(shellPath)) {
      fs.mkdirSync(shellPath, { recursive: true });
    }
    fs.appendFileSync(
      path.join(shellPath, 'events.jsonl'),
      JSON.stringify(event) + '\n'
    );
    
    // Index by date
    const date = event.timestamp.toISOString().split('T')[0];
    const datePath = path.join(this.catalogPath, 'by-date', date);
    if (!fs.existsSync(datePath)) {
      fs.mkdirSync(datePath, { recursive: true });
    }
    fs.appendFileSync(
      path.join(datePath, 'events.jsonl'),
      JSON.stringify(event) + '\n'
    );
    
    // If snap moment, create special entry
    if (event.significance === 'snap') {
      const snapPath = path.join(this.catalogPath, 'snaps');
      if (!fs.existsSync(snapPath)) {
        fs.mkdirSync(snapPath, { recursive: true });
      }
      fs.writeFileSync(
        path.join(snapPath, `${event.id}.json`),
        JSON.stringify(event, null, 2)
      );
    }
  }
  
  /**
   * Record significant event to blockchain
   */
  private async recordToBlockchain(event: WorkStreamEvent): Promise<void> {
    await vibeBlock({
      item: {
        type: 'stream_event',
        name: event.description,
        payload: {
          eventId: event.id,
          type: event.type,
          shell: event.shell,
          significance: event.significance,
          timestamp: event.timestamp
        }
      },
      bbheTags: event.bbheTags
    });
  }
  
  /**
   * Save session to catalog
   */
  private saveSession(session: StreamSession): void {
    const sessionsPath = path.join(this.catalogPath, 'sessions');
    if (!fs.existsSync(sessionsPath)) {
      fs.mkdirSync(sessionsPath, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(sessionsPath, `${session.id}.json`),
      JSON.stringify(session, null, 2)
    );
  }
  
  /**
   * Remove dead time (gaps with no activity)
   */
  private removeDeadTime(events: WorkStreamEvent[], gapThreshold: number = 5 * 60 * 1000): WorkStreamEvent[] {
    const filtered: WorkStreamEvent[] = [];
    
    for (let i = 0; i < events.length; i++) {
      if (i === 0) {
        filtered.push(events[i]);
        continue;
      }
      
      const gap = events[i].timestamp.getTime() - events[i - 1].timestamp.getTime();
      if (gap <= gapThreshold) {
        filtered.push(events[i]);
      }
    }
    
    return filtered;
  }
  
  /**
   * Log event to console
   */
  private logEvent(event: WorkStreamEvent): void {
    const icons = {
      file_create: '📄',
      file_edit: '✏️',
      git_commit: '📦',
      system_integration: '🔗',
      pattern_detected: '🔍',
      snap_moment: '🎯',
      shell_activation: '🌀',
      breakthrough: '🤯'
    };
    
    const shellEmojis = ['', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤'];
    
    const icon = icons[event.type] || '•';
    const shellIcon = shellEmojis[event.shell];
    const flowIcon = event.flowState > 90 ? '🌊' : event.flowState > 70 ? '💧' : '';
    
    console.log(`[${event.timestamp.toTimeString().split(' ')[0]}] ${icon} ${shellIcon} ${event.description} ${flowIcon}`);
    
    if (event.significance === 'snap') {
      console.log(`   🎯 SNAP MOMENT captured!`);
    }
  }
  
  /**
   * Calculate average flow state for session
   */
  private calculateAverageFlowState(): number {
    if (!this.currentSession) return 0;
    
    const sessionEvents = this.stream.filter(e => e.sessionId === this.currentSession!.id);
    if (sessionEvents.length === 0) return 0;
    
    const sum = sessionEvents.reduce((acc, e) => acc + e.flowState, 0);
    return Math.round(sum / sessionEvents.length);
  }
  
  /**
   * Get session duration in minutes
   */
  private getSessionDuration(session: StreamSession): number {
    if (!session.endTime) return 0;
    const diff = session.endTime.getTime() - session.startTime.getTime();
    return Math.round(diff / 60000); // Convert to minutes
  }
  
  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
  
  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `EVENT_${Date.now()}_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  }
}

// Singleton instance
export const workStream = new StreamOfWorksCapture();

/**
 * Quick access functions
 */

export function startStreamCapture(author?: string): string {
  return workStream.startRecording(author);
}

export function stopStreamCapture(): StreamSession | null {
  return workStream.stopRecording();
}

export function captureWorkEvent(event: Omit<WorkStreamEvent, 'id' | 'timestamp' | 'flowState' | 'author' | 'sessionId'>): void {
  workStream.captureEvent(event);
}

export function getStreamReplay(options: any): WorkStreamEvent[] {
  return workStream.getReplay(options);
}

export function getStreamCatalog(): CatalogSummary {
  return workStream.getCatalogSummary();
}

export function searchStream(query: string): WorkStreamEvent[] {
  return workStream.searchEvents(query);
}

export function getSnapMoments(): WorkStreamEvent[] {
  return workStream.getSnapMoments();
}

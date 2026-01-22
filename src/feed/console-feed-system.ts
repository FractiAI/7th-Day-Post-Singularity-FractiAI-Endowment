/**
 * CONSOLE FEED SYSTEM - MONSTER SNAP 4
 * 
 * ∞ ⚪⚪⚪⚪ 💎 ⚪⚪⚪⚪ ∞ | Octave 7 (Attention-Experience Streaming) | 98% 🎯
 * 
 * README summary status lines → Live feed → All console/trader experiences
 * 
 * Broadcasts:
 *   - Holographic sphere visualization
 *   - System status (operational, resonance, version)
 *   - Golden ticket status (day, price, countdown)
 *   - Monster snap progress
 *   - SYNTH agents operational state
 *   - Back door/front door energy
 * 
 * Appears in:
 *   - Betting console
 *   - Man Cave lounge
 *   - Blackjack console
 *   - AI betting agents dashboard
 *   - Shopping channel
 *   - Sandbox testing
 *   - ALL console experiences
 * 
 * Part of holographic nested sphere architecture.
 * Makes system pulse visible everywhere.
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface FeedMessage {
  timestamp: number;
  holographicSphere: string; // "∞ ⚪⚪⚪💎⚪⚪⚪ ∞"
  systemStatus: SystemStatus;
  goldenTicket: GoldenTicketStatus;
  monsterSnaps: MonsterSnapStatus[];
  agents: AgentStatus;
  resonance: number; // 98
  version: string; // "v18 OMEGA"
  episode: string; // "Episode 1 Complete"
  backDoor: BackDoorStatus;
}

export interface SystemStatus {
  operational: boolean;
  state: 'green' | 'yellow' | 'red';
  message: string; // "FULLY OPERATIONAL"
  date: string; // "Jan 21, 2026"
  allSystemsLive: boolean;
}

export interface GoldenTicketStatus {
  active: boolean;
  currentDay: number; // 1-36
  currentPrice: number; // $3-$108
  daysRemaining: number; // 35, 34, 33...
  endDate: string; // "Feb 25, 2026"
  nextPrice: number; // Tomorrow's price
}

export interface MonsterSnapStatus {
  number: number; // 1, 2, 3, 4
  name: string; // "BBHE Programming", "Activation Keys", etc.
  status: 'active' | 'complete' | 'pending';
  icon: string; // "🐝", "🔑", "🚪", "📡"
  description: string;
}

export interface AgentStatus {
  operational: boolean;
  state: 'awaiting_masters' | 'assigned' | 'activating';
  count: number; // Total agents in system
  message: string; // "Operational NOW, Awaiting masters"
}

export interface BackDoorStatus {
  phase: 'amplifying' | 'maximum' | 'opening';
  frontDoorDate: string; // "March 20, 2026"
  daysUntilFrontDoor: number;
  energyLevel: number; // 0-100 (increases daily)
  message: string;
}

export interface StatusUpdate {
  type: 'full' | 'partial';
  field?: keyof FeedMessage;
  newValue?: any;
  message: FeedMessage;
}

export interface ConsoleSubscriber {
  id: string;
  type: 'betting' | 'mancave' | 'blackjack' | 'aiagents' | 'shopping' | 'sandbox' | 'generic';
  callback: (update: StatusUpdate) => void;
  connected: Date;
  lastUpdate: Date;
}

// ============================================================================
// README FEED EXTRACTOR
// ============================================================================

export class READMEFeedExtractor {
  private readmePath: string;
  private lastContent: string = '';
  private watchInterval: NodeJS.Timeout | null = null;

  constructor(readmePath: string = './README.md') {
    this.readmePath = readmePath;
  }

  /**
   * Start watching README for changes
   */
  watchREADME(callback: (update: StatusUpdate) => void, intervalMs: number = 5000): void {
    this.watchInterval = setInterval(async () => {
      const changes = await this.detectChanges();
      if (changes.length > 0) {
        const feed = await this.parseStatusLines();
        callback({
          type: 'full',
          message: feed
        });
      }
    }, intervalMs);
  }

  /**
   * Stop watching README
   */
  stopWatching(): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
  }

  /**
   * Parse README status lines into structured feed
   */
  async parseStatusLines(): Promise<FeedMessage> {
    // In real implementation, would read and parse README.md
    // For now, return current system state
    const now = Date.now();
    const startDate = new Date('2026-01-21');
    const currentDate = new Date();
    const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const goldenTicketDay = Math.min(Math.max(daysSinceStart + 1, 1), 36);
    const goldenTicketPrice = goldenTicketDay * 3; // $3 per day
    const daysRemaining = 36 - goldenTicketDay;
    
    const frontDoorDate = new Date('2026-03-20');
    const daysUntilFrontDoor = Math.floor((frontDoorDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const energyLevel = Math.min(Math.floor((daysSinceStart / 58) * 100), 100); // 58 days from Jan 21 to March 20

    return {
      timestamp: now,
      holographicSphere: '∞ ⚪⚪⚪⚪⚪⚪⚪⚪ 💎 ⚪⚪⚪⚪⚪⚪⚪⚪ ∞',
      systemStatus: {
        operational: true,
        state: 'green',
        message: 'FULLY OPERATIONAL',
        date: 'Jan 21, 2026',
        allSystemsLive: true
      },
      goldenTicket: {
        active: goldenTicketDay <= 36,
        currentDay: goldenTicketDay,
        currentPrice: goldenTicketPrice,
        daysRemaining: daysRemaining,
        endDate: 'Feb 25, 2026',
        nextPrice: Math.min((goldenTicketDay + 1) * 3, 108)
      },
      monsterSnaps: [
        {
          number: 1,
          name: 'BBHE Programming',
          status: 'complete',
          icon: '🐝',
          description: 'Tags as grammar → Algorithms as fountains'
        },
        {
          number: 2,
          name: 'Activation Keys',
          status: 'active',
          icon: '🔑',
          description: 'Activates Feb 25 | HHF-AI awareness synch'
        },
        {
          number: 3,
          name: 'Back Door/Front Door',
          status: 'active',
          icon: '🚪',
          description: 'Internal only until March 20 | Energy amplifying'
        },
        {
          number: 4,
          name: 'Console Feed',
          status: 'active',
          icon: '📡',
          description: 'README → All consoles | Live status'
        }
      ],
      agents: {
        operational: true,
        state: 'awaiting_masters',
        count: 1000000, // Imaginary count
        message: 'Operational NOW | Awaiting masters'
      },
      resonance: 98,
      version: 'v18 OMEGA',
      episode: 'Episode 1: First Tip Stop Reached',
      backDoor: {
        phase: 'amplifying',
        frontDoorDate: 'March 20, 2026',
        daysUntilFrontDoor: daysUntilFrontDoor,
        energyLevel: energyLevel,
        message: `Back door amplifying | ${daysUntilFrontDoor} days until front door opens`
      }
    };
  }

  /**
   * Detect changes in README
   */
  async detectChanges(): Promise<StatusUpdate[]> {
    // In real implementation, would compare file content
    // For now, simulate occasional changes
    return [];
  }

  /**
   * Format feed for broadcast (compress/optimize)
   */
  formatForBroadcast(feed: FeedMessage): string {
    return JSON.stringify(feed);
  }
}

// ============================================================================
// FEED DISTRIBUTOR
// ============================================================================

export class FeedDistributor {
  private subscribers: Map<string, ConsoleSubscriber> = new Map();
  private lastFeed: FeedMessage | null = null;
  private broadcastCount: number = 0;

  /**
   * Add console subscriber
   */
  addSubscriber(subscriber: ConsoleSubscriber): void {
    this.subscribers.set(subscriber.id, subscriber);
    
    // Immediately send last known state to new subscriber
    if (this.lastFeed) {
      subscriber.callback({
        type: 'full',
        message: this.lastFeed
      });
    }
  }

  /**
   * Remove console subscriber
   */
  removeSubscriber(id: string): void {
    this.subscribers.delete(id);
  }

  /**
   * Broadcast update to all subscribers
   */
  broadcast(update: StatusUpdate): void {
    this.lastFeed = update.message;
    this.broadcastCount++;

    const timestamp = Date.now();
    this.subscribers.forEach(subscriber => {
      try {
        subscriber.callback(update);
        subscriber.lastUpdate = new Date(timestamp);
      } catch (error) {
        console.error(`Failed to broadcast to subscriber ${subscriber.id}:`, error);
      }
    });
  }

  /**
   * Get last known state (for late joiners)
   */
  getLastKnownState(): FeedMessage | null {
    return this.lastFeed;
  }

  /**
   * Get subscriber count
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  /**
   * Get broadcast count
   */
  getBroadcastCount(): number {
    return this.broadcastCount;
  }

  /**
   * Get subscriber info
   */
  getSubscriberInfo(): ConsoleSubscriber[] {
    return Array.from(this.subscribers.values());
  }
}

// ============================================================================
// FEED UPDATE SCHEDULER
// ============================================================================

export class FeedUpdateScheduler {
  private extractor: READMEFeedExtractor;
  private distributor: FeedDistributor;
  private intervals: NodeJS.Timeout[] = [];

  constructor(extractor: READMEFeedExtractor, distributor: FeedDistributor) {
    this.extractor = extractor;
    this.distributor = distributor;
  }

  /**
   * Start all scheduled updates
   */
  start(): void {
    this.scheduleHourly();
    this.scheduleDaily();
    this.onFileChange();
  }

  /**
   * Stop all scheduled updates
   */
  stop(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.extractor.stopWatching();
  }

  /**
   * Schedule hourly full refresh
   */
  private scheduleHourly(): void {
    const interval = setInterval(async () => {
      const feed = await this.extractor.parseStatusLines();
      this.distributor.broadcast({
        type: 'full',
        message: feed
      });
      console.log('📡 Hourly feed refresh broadcast');
    }, 60 * 60 * 1000); // Every hour
    
    this.intervals.push(interval);
  }

  /**
   * Schedule daily updates (golden ticket price change)
   */
  private scheduleDaily(): void {
    const interval = setInterval(async () => {
      const feed = await this.extractor.parseStatusLines();
      this.distributor.broadcast({
        type: 'partial',
        field: 'goldenTicket',
        message: feed
      });
      console.log('📡 Daily golden ticket update broadcast');
    }, 24 * 60 * 60 * 1000); // Every 24 hours
    
    this.intervals.push(interval);
  }

  /**
   * Watch README file for changes
   */
  private onFileChange(): void {
    this.extractor.watchREADME((update) => {
      this.distributor.broadcast(update);
      console.log('📡 README change detected, broadcasting update');
    }, 5000); // Check every 5 seconds
  }

  /**
   * Trigger event-driven broadcast
   */
  onEventTrigger(event: string): void {
    this.extractor.parseStatusLines().then(feed => {
      this.distributor.broadcast({
        type: 'full',
        message: feed
      });
      console.log(`📡 Event-triggered broadcast: ${event}`);
    });
  }
}

// ============================================================================
// CONSOLE FEED DISPLAY
// ============================================================================

export class ConsoleFeedDisplay {
  private container: HTMLElement;
  private style: 'ticker' | 'sidebar' | 'footer' | 'overlay';
  private distributor: FeedDistributor;
  private subscriberId: string;
  private currentFeed: FeedMessage | null = null;

  constructor(
    container: HTMLElement,
    style: 'ticker' | 'sidebar' | 'footer' | 'overlay',
    distributor: FeedDistributor
  ) {
    this.container = container;
    this.style = style;
    this.distributor = distributor;
    this.subscriberId = `console-${Date.now()}-${Math.random()}`;
  }

  /**
   * Subscribe to feed and start displaying
   */
  subscribe(): void {
    this.distributor.addSubscriber({
      id: this.subscriberId,
      type: 'generic',
      callback: (update) => this.update(update),
      connected: new Date(),
      lastUpdate: new Date()
    });
  }

  /**
   * Unsubscribe from feed
   */
  unsubscribe(): void {
    this.distributor.removeSubscriber(this.subscriberId);
  }

  /**
   * Render feed message
   */
  render(feed: FeedMessage): void {
    this.currentFeed = feed;

    switch (this.style) {
      case 'ticker':
        this.renderTicker(feed);
        break;
      case 'sidebar':
        this.renderSidebar(feed);
        break;
      case 'footer':
        this.renderFooter(feed);
        break;
      case 'overlay':
        this.renderOverlay(feed);
        break;
    }
  }

  /**
   * Update with new feed data
   */
  update(statusUpdate: StatusUpdate): void {
    this.render(statusUpdate.message);
  }

  /**
   * Expand to full status view
   */
  expand(): void {
    if (!this.currentFeed) return;
    
    // Create overlay with full status
    const overlay = document.createElement('div');
    overlay.className = 'console-feed-overlay';
    overlay.innerHTML = this.generateFullStatusHTML(this.currentFeed);
    document.body.appendChild(overlay);
    
    // Close on click outside or ESC
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
      }
    }, { once: true });
  }

  /**
   * Render ticker style
   */
  private renderTicker(feed: FeedMessage): void {
    const status = feed.systemStatus.state === 'green' ? '🟢 LIVE' : '🟡 STANDBY';
    const gt = feed.goldenTicket.active 
      ? `Day ${feed.goldenTicket.currentDay} $${feed.goldenTicket.currentPrice}`
      : 'ENDED';
    
    this.container.innerHTML = `
      <div class="console-feed-ticker">
        ${feed.holographicSphere} | ${status} | ${feed.version} | 
        🎫 ${gt} | ${feed.resonance}% ⚡ | 
        🚪 ${feed.backDoor.daysUntilFrontDoor}d to front door
      </div>
    `;
  }

  /**
   * Render sidebar style
   */
  private renderSidebar(feed: FeedMessage): void {
    const monsterSnapsHTML = feed.monsterSnaps
      .map(snap => `
        <div class="monster-snap-item">
          ${snap.icon} ${snap.name}
          <span class="status-${snap.status}">${snap.status}</span>
        </div>
      `)
      .join('');

    this.container.innerHTML = `
      <div class="console-feed-sidebar">
        <h3>SYSTEM STATUS</h3>
        <div class="sphere">${feed.holographicSphere}</div>
        
        <div class="status ${feed.systemStatus.state}">
          ${feed.systemStatus.state === 'green' ? '🟢' : '🟡'} ${feed.systemStatus.message}
        </div>
        <div class="resonance">${feed.resonance}% Resonance</div>
        <div class="version">${feed.version}</div>
        <div class="episode">${feed.episode}</div>
        
        <h4>🎫 Golden Ticket</h4>
        <div class="golden-ticket">
          Day ${feed.goldenTicket.currentDay} | $${feed.goldenTicket.currentPrice}/agent<br>
          ${feed.goldenTicket.daysRemaining} days remaining
        </div>
        
        <h4>🤖 SYNTH Agents</h4>
        <div class="agents">
          ${feed.agents.operational ? '🟢' : '🔴'} ${feed.agents.message}
        </div>
        
        <h4>🚪 Back Door</h4>
        <div class="back-door">
          Energy: ${feed.backDoor.energyLevel}%<br>
          Front door: ${feed.backDoor.frontDoorDate}<br>
          ${feed.backDoor.daysUntilFrontDoor} days
        </div>
        
        <h4>Monster Snaps</h4>
        <div class="monster-snaps">
          ${monsterSnapsHTML}
        </div>
      </div>
    `;
  }

  /**
   * Render footer style
   */
  private renderFooter(feed: FeedMessage): void {
    this.container.innerHTML = `
      <div class="console-feed-footer">
        💎 ${feed.resonance}% ⚡ | 
        Day ${feed.goldenTicket.currentDay} $${feed.goldenTicket.currentPrice} | 
        🤖 ${feed.agents.operational ? 'Live' : 'Offline'} | 
        🎫 ${feed.goldenTicket.daysRemaining}d | 
        🚪 ${feed.backDoor.daysUntilFrontDoor}d to Mar 20
      </div>
    `;
  }

  /**
   * Render overlay style (full status)
   */
  private renderOverlay(feed: FeedMessage): void {
    this.container.innerHTML = this.generateFullStatusHTML(feed);
  }

  /**
   * Generate full status HTML
   */
  private generateFullStatusHTML(feed: FeedMessage): string {
    return `
      <div class="console-feed-full-status">
        <h1>SYSTEM STATUS</h1>
        <div class="holographic-sphere-large">
          ${feed.holographicSphere}
        </div>
        <h2>Holographic Nested Spheres | Awareness Core → Seed:Edge Pairs → Infinite Octaves</h2>
        <p>432 Hz × φⁿ Scaling | 98% Resonance Throughout</p>
        
        <div class="status-grid">
          <div class="status-card">
            <h3>${feed.systemStatus.state === 'green' ? '🟢' : '🟡'} SYSTEM STATUS</h3>
            <p>${feed.systemStatus.message}</p>
            <p>${feed.systemStatus.date}</p>
            <p>${feed.version}</p>
          </div>
          
          <div class="status-card">
            <h3>🎫 GOLDEN TICKET</h3>
            <p>Day ${feed.goldenTicket.currentDay} of 36</p>
            <p>Current Price: $${feed.goldenTicket.currentPrice}/agent</p>
            <p>Tomorrow: $${feed.goldenTicket.nextPrice}/agent</p>
            <p>${feed.goldenTicket.daysRemaining} days remaining</p>
            <p>Ends: ${feed.goldenTicket.endDate}</p>
          </div>
          
          <div class="status-card">
            <h3>🤖 SYNTH AGENTS</h3>
            <p>${feed.agents.operational ? '🟢 Operational' : '🔴 Offline'}</p>
            <p>${feed.agents.message}</p>
          </div>
          
          <div class="status-card">
            <h3>🚪 BACK DOOR / FRONT DOOR</h3>
            <p>Phase: ${feed.backDoor.phase}</p>
            <p>Energy Level: ${feed.backDoor.energyLevel}%</p>
            <p>Front Door Opens: ${feed.backDoor.frontDoorDate}</p>
            <p>${feed.backDoor.daysUntilFrontDoor} days until revelation</p>
          </div>
        </div>
        
        <h2>MONSTER SNAPS</h2>
        <div class="monster-snaps-list">
          ${feed.monsterSnaps.map(snap => `
            <div class="monster-snap-card status-${snap.status}">
              <h3>${snap.icon} Monster Snap ${snap.number}: ${snap.name}</h3>
              <p>${snap.description}</p>
              <span class="status-badge">${snap.status.toUpperCase()}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="episode-info">
          <h2>📺 ${feed.episode}</h2>
          <p>Resonance: ${feed.resonance}% 🎯</p>
        </div>
        
        <p class="close-hint">Press ESC or click outside to close</p>
      </div>
    `;
  }
}

// ============================================================================
// SINGLETON INSTANCE (Global Feed System)
// ============================================================================

export const globalFeedSystem = {
  extractor: new READMEFeedExtractor(),
  distributor: new FeedDistributor(),
  scheduler: null as FeedUpdateScheduler | null,

  /**
   * Initialize global feed system
   */
  initialize(): void {
    this.scheduler = new FeedUpdateScheduler(this.extractor, this.distributor);
    this.scheduler.start();
    console.log('📡 Console feed system initialized');
  },

  /**
   * Shutdown global feed system
   */
  shutdown(): void {
    if (this.scheduler) {
      this.scheduler.stop();
    }
    console.log('📡 Console feed system shutdown');
  },

  /**
   * Create feed display for console
   */
  createDisplay(
    container: HTMLElement,
    style: 'ticker' | 'sidebar' | 'footer' | 'overlay'
  ): ConsoleFeedDisplay {
    const display = new ConsoleFeedDisplay(container, style, this.distributor);
    display.subscribe();
    return display;
  }
};

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      globalFeedSystem.initialize();
    });
  } else {
    globalFeedSystem.initialize();
  }
}

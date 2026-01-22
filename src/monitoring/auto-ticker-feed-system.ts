/**
 * AUTO-TICKER FEED SYSTEM
 * Pipes summary lines to console ticker monitors on every README update
 * Archives all feeds + click-to-link navigation to original documents
 */

export interface TickerUpdate {
  id: string;
  timestamp: Date;
  summary: string;
  sourceFile: string;
  commitHash?: string;
  category: 'SNAP' | 'COMPLETE' | 'UPDATE' | 'DEPLOY' | 'SYSTEM';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  link: string;  // Click-to-navigate
}

export interface TickerFeed {
  consoleId: string;
  updates: TickerUpdate[];
  lastUpdate: Date;
  totalUpdates: number;
}

export interface TickerArchive {
  date: Date;
  updates: TickerUpdate[];
  searchable: boolean;
  indexed: boolean;
}

export class AutoTickerFeedSystem {
  private feeds: Map<string, TickerFeed>;
  private archive: TickerArchive[];
  private subscribers: Set<string>;  // Console IDs
  
  constructor() {
    this.feeds = new Map();
    this.archive = [];
    this.subscribers = new Set();
    this.initializeConsoles();
  }
  
  /**
   * Initialize all console monitors
   */
  private initializeConsoles(): void {
    const consoles = [
      'CHAIRMAN_CONSOLE',
      'DEPLOYMENT_CONSOLE',
      'MONITORING_CONSOLE',
      'DEVELOPER_CONSOLE',
      'CREATOR_CONSOLE',
      'OPERATIONS_CONSOLE'
    ];
    
    consoles.forEach(consoleId => {
      this.subscribers.add(consoleId);
      this.feeds.set(consoleId, {
        consoleId,
        updates: [],
        lastUpdate: new Date(),
        totalUpdates: 0
      });
    });
  }
  
  /**
   * MAIN: Triggered on README update + git push
   */
  async onReadmeUpdate(
    commitMessage: string,
    commitHash: string,
    changedFiles: string[]
  ): Promise<void> {
    console.log('\n📡 AUTO-TICKER: README updated, piping to all consoles...\n');
    
    // Extract summary from commit message
    const summary = this.extractSummary(commitMessage);
    
    // Determine category and priority
    const category = this.categorize(commitMessage);
    const priority = this.prioritize(category, commitMessage);
    
    // Create ticker update
    const update: TickerUpdate = {
      id: `TICKER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      summary,
      sourceFile: 'README.md',
      commitHash,
      category,
      priority,
      link: this.generateGitHubLink(commitHash, 'README.md')
    };
    
    // Pipe to all console subscribers
    await this.pipeToAllConsoles(update);
    
    // Archive the update
    this.archiveUpdate(update);
    
    // Process any linked documents
    await this.processLinkedDocuments(changedFiles, commitHash);
    
    console.log(`✅ Ticker update sent to ${this.subscribers.size} consoles`);
    console.log(`📝 Summary: ${summary}`);
    console.log(`🔗 Link: ${update.link}\n`);
  }
  
  /**
   * Pipe update to all subscribed consoles
   */
  private async pipeToAllConsoles(update: TickerUpdate): Promise<void> {
    for (const consoleId of this.subscribers) {
      const feed = this.feeds.get(consoleId);
      if (!feed) continue;
      
      // Add to feed
      feed.updates.unshift(update);  // Most recent first
      feed.lastUpdate = update.timestamp;
      feed.totalUpdates++;
      
      // Keep only last 100 updates per console
      if (feed.updates.length > 100) {
        feed.updates = feed.updates.slice(0, 100);
      }
      
      // Emit to console display
      await this.emitToConsole(consoleId, update);
    }
  }
  
  /**
   * Emit to specific console display
   */
  private async emitToConsole(consoleId: string, update: TickerUpdate): Promise<void> {
    const emoji = this.getEmoji(update.category);
    const priorityFlag = update.priority === 'HIGH' ? '🔥' : update.priority === 'MEDIUM' ? '⚡' : '';
    
    console.log(`[${consoleId}] ${priorityFlag}${emoji} ${update.summary}`);
    
    // In real implementation, this would push to WebSocket/SSE for live console updates
  }
  
  /**
   * Archive update for permanent storage
   */
  private archiveUpdate(update: TickerUpdate): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find or create today's archive
    let todayArchive = this.archive.find(a => 
      a.date.getTime() === today.getTime()
    );
    
    if (!todayArchive) {
      todayArchive = {
        date: today,
        updates: [],
        searchable: true,
        indexed: true
      };
      this.archive.push(todayArchive);
    }
    
    todayArchive.updates.push(update);
  }
  
  /**
   * Process linked documents for additional context
   */
  private async processLinkedDocuments(
    changedFiles: string[],
    commitHash: string
  ): Promise<void> {
    for (const file of changedFiles) {
      if (file === 'README.md') continue;
      
      // Check if it's a documentation file
      if (file.endsWith('.md')) {
        const update: TickerUpdate = {
          id: `TICKER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          summary: `Updated: ${this.getFileName(file)}`,
          sourceFile: file,
          commitHash,
          category: this.categorizeFile(file),
          priority: 'LOW',
          link: this.generateGitHubLink(commitHash, file)
        };
        
        await this.pipeToAllConsoles(update);
        this.archiveUpdate(update);
      }
    }
  }
  
  /**
   * Extract summary from commit message (first line)
   */
  private extractSummary(commitMessage: string): string {
    const lines = commitMessage.split('\n');
    let summary = lines[0].trim();
    
    // Truncate if too long
    if (summary.length > 120) {
      summary = summary.substring(0, 117) + '...';
    }
    
    return summary;
  }
  
  /**
   * Categorize update
   */
  private categorize(commitMessage: string): TickerUpdate['category'] {
    const lower = commitMessage.toLowerCase();
    
    if (lower.includes('snap')) return 'SNAP';
    if (lower.includes('complete')) return 'COMPLETE';
    if (lower.includes('deploy')) return 'DEPLOY';
    if (lower.includes('system')) return 'SYSTEM';
    
    return 'UPDATE';
  }
  
  /**
   * Categorize file
   */
  private categorizeFile(file: string): TickerUpdate['category'] {
    if (file.includes('SNAP')) return 'SNAP';
    if (file.includes('COMPLETE')) return 'COMPLETE';
    if (file.includes('deploy')) return 'DEPLOY';
    
    return 'UPDATE';
  }
  
  /**
   * Prioritize update
   */
  private prioritize(
    category: TickerUpdate['category'],
    commitMessage: string
  ): TickerUpdate['priority'] {
    const lower = commitMessage.toLowerCase();
    
    // High priority keywords
    if (lower.includes('critical') || 
        lower.includes('urgent') ||
        lower.includes('breaking') ||
        lower.includes('major')) {
      return 'HIGH';
    }
    
    // Category-based priority
    if (category === 'DEPLOY' || category === 'SYSTEM') {
      return 'HIGH';
    }
    
    if (category === 'SNAP' || category === 'COMPLETE') {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }
  
  /**
   * Generate GitHub link to specific commit + file
   */
  private generateGitHubLink(commitHash: string, file: string): string {
    const repo = 'NSPFRP-Seed-Protocol-OmniMission-v17-Vibeverse-Edition';
    const org = 'FractiAI';
    
    return `https://github.com/${org}/${repo}/blob/${commitHash}/${file}`;
  }
  
  /**
   * Get emoji for category
   */
  private getEmoji(category: TickerUpdate['category']): string {
    const emojis: Record<TickerUpdate['category'], string> = {
      'SNAP': '📸',
      'COMPLETE': '✅',
      'UPDATE': '📝',
      'DEPLOY': '🚀',
      'SYSTEM': '⚙️'
    };
    
    return emojis[category];
  }
  
  /**
   * Get file name from path
   */
  private getFileName(path: string): string {
    return path.split('/').pop() || path;
  }
  
  /**
   * Get feed for specific console
   */
  getFeed(consoleId: string): TickerFeed | undefined {
    return this.feeds.get(consoleId);
  }
  
  /**
   * Get all feeds
   */
  getAllFeeds(): TickerFeed[] {
    return Array.from(this.feeds.values());
  }
  
  /**
   * Get archive by date
   */
  getArchiveByDate(date: Date): TickerArchive | undefined {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return this.archive.find(a => 
      a.date.getTime() === targetDate.getTime()
    );
  }
  
  /**
   * Get full archive
   */
  getFullArchive(): TickerArchive[] {
    return this.archive;
  }
  
  /**
   * Search archive
   */
  searchArchive(query: string): TickerUpdate[] {
    const lowerQuery = query.toLowerCase();
    const results: TickerUpdate[] = [];
    
    for (const archive of this.archive) {
      for (const update of archive.updates) {
        if (update.summary.toLowerCase().includes(lowerQuery) ||
            update.sourceFile.toLowerCase().includes(lowerQuery)) {
          results.push(update);
        }
      }
    }
    
    return results;
  }
  
  /**
   * Get recent updates (across all consoles)
   */
  getRecentUpdates(limit: number = 50): TickerUpdate[] {
    const allUpdates: TickerUpdate[] = [];
    
    for (const feed of this.feeds.values()) {
      allUpdates.push(...feed.updates);
    }
    
    // Sort by timestamp (most recent first)
    allUpdates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Remove duplicates
    const unique = allUpdates.filter((update, index, self) =>
      index === self.findIndex(u => u.id === update.id)
    );
    
    return unique.slice(0, limit);
  }
}

// Singleton instance
export const autoTickerFeed = new AutoTickerFeedSystem();

/**
 * Git hook integration - Call this on post-commit
 */
export async function onGitPush(
  commitMessage: string,
  commitHash: string,
  changedFiles: string[]
): Promise<void> {
  // Check if README was updated
  if (changedFiles.includes('README.md')) {
    await autoTickerFeed.onReadmeUpdate(commitMessage, commitHash, changedFiles);
  }
}

/**
 * Quick access functions
 */
export function getConsoleFeed(consoleId: string): TickerFeed | undefined {
  return autoTickerFeed.getFeed(consoleId);
}

export function getAllFeeds(): TickerFeed[] {
  return autoTickerFeed.getAllFeeds();
}

export function getRecentUpdates(limit: number = 50): TickerUpdate[] {
  return autoTickerFeed.getRecentUpdates(limit);
}

export function searchFeed(query: string): TickerUpdate[] {
  return autoTickerFeed.searchArchive(query);
}

export function getArchive(date?: Date): TickerArchive | TickerArchive[] {
  if (date) {
    return autoTickerFeed.getArchiveByDate(date) || [];
  }
  return autoTickerFeed.getFullArchive();
}

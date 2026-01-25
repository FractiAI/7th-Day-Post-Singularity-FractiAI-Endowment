/**
 * 💬 COMMAND PROMPT TICKER MONITOR
 * 
 * Watches live chairman creator prompts being entered (public level, not private)
 * Similar to updates ticker snap, but for command prompts
 * Positioned to the left of the updates ticker
 */

export interface CommandPrompt {
  id: string;
  timestamp: Date;
  prompt: string;
  creator: string;
  level: 'public' | 'private';
  status: 'entering' | 'submitted' | 'processing' | 'completed' | 'cancelled';
  category?: 'command' | 'query' | 'instruction' | 'request' | 'system';
  metadata?: {
    sessionId?: string;
    octave?: number;
    heroHost?: string;
    context?: string;
  };
}

export interface CommandPromptTicker {
  consoleId: string;
  prompts: CommandPrompt[];
  lastPrompt: Date | null;
  totalPrompts: number;
  activePrompts: number;
}

export class CommandPromptTickerMonitor {
  private tickers: Map<string, CommandPromptTicker>;
  private subscribers: Set<string>;  // Console IDs
  private activePrompts: Map<string, CommandPrompt>;  // Currently being entered
  private publicPrompts: CommandPrompt[];  // Public prompts only
  
  constructor() {
    this.tickers = new Map();
    this.subscribers = new Set();
    this.activePrompts = new Map();
    this.publicPrompts = [];
    this.initializeConsoles();
  }
  
  /**
   * Initialize all console monitors
   */
  private initializeConsoles(): void {
    const consoles = [
      'CHAIRMAN_CONSOLE',
      'CREATOR_CONSOLE',
      'DEVELOPER_CONSOLE',
      'PUBLIC_MONITOR'
    ];
    
    consoles.forEach(consoleId => {
      this.subscribers.add(consoleId);
      this.tickers.set(consoleId, {
        consoleId,
        prompts: [],
        lastPrompt: null,
        totalPrompts: 0,
        activePrompts: 0
      });
    });
  }
  
  /**
   * Start tracking a prompt being entered (public level only)
   */
  startPromptTracking(
    promptId: string,
    creator: string,
    initialText: string = '',
    metadata?: CommandPrompt['metadata']
  ): void {
    // Only track public level prompts
    const prompt: CommandPrompt = {
      id: promptId,
      timestamp: new Date(),
      prompt: initialText,
      creator,
      level: 'public',
      status: 'entering',
      category: this.categorizePrompt(initialText),
      metadata
    };
    
    this.activePrompts.set(promptId, prompt);
    
    // Emit to all subscribers
    this.emitToAllConsoles(prompt);
  }
  
  /**
   * Update prompt as it's being typed (public level only)
   */
  updatePrompt(
    promptId: string,
    text: string,
    status?: CommandPrompt['status']
  ): void {
    const prompt = this.activePrompts.get(promptId);
    if (!prompt || prompt.level !== 'public') {
      return; // Only track public prompts
    }
    
    prompt.prompt = text;
    prompt.category = this.categorizePrompt(text);
    if (status) {
      prompt.status = status;
    }
    
    // Emit update to all subscribers
    this.emitToAllConsoles(prompt);
  }
  
  /**
   * Submit prompt (public level only)
   */
  submitPrompt(
    promptId: string,
    finalText: string
  ): void {
    const prompt = this.activePrompts.get(promptId);
    if (!prompt || prompt.level !== 'public') {
      return; // Only track public prompts
    }
    
    prompt.prompt = finalText;
    prompt.status = 'submitted';
    prompt.timestamp = new Date();
    
    // Move to public prompts list
    this.publicPrompts.unshift(prompt);
    if (this.publicPrompts.length > 1000) {
      this.publicPrompts = this.publicPrompts.slice(0, 1000);
    }
    
    // Update all tickers
    for (const consoleId of this.subscribers) {
      const ticker = this.tickers.get(consoleId);
      if (!ticker) continue;
      
      ticker.prompts.unshift(prompt);
      ticker.lastPrompt = prompt.timestamp;
      ticker.totalPrompts++;
      
      // Keep only last 100 prompts per console
      if (ticker.prompts.length > 100) {
        ticker.prompts = ticker.prompts.slice(0, 100);
      }
    }
    
    // Remove from active prompts
    this.activePrompts.delete(promptId);
    
    // Emit to all subscribers
    this.emitToAllConsoles(prompt);
  }
  
  /**
   * Mark prompt as processing
   */
  markProcessing(promptId: string): void {
    const prompt = this.activePrompts.get(promptId) || 
                   this.publicPrompts.find(p => p.id === promptId);
    
    if (prompt && prompt.level === 'public') {
      prompt.status = 'processing';
      this.emitToAllConsoles(prompt);
    }
  }
  
  /**
   * Mark prompt as completed
   */
  markCompleted(promptId: string): void {
    const prompt = this.activePrompts.get(promptId) || 
                   this.publicPrompts.find(p => p.id === promptId);
    
    if (prompt && prompt.level === 'public') {
      prompt.status = 'completed';
      this.emitToAllConsoles(prompt);
    }
  }
  
  /**
   * Cancel prompt
   */
  cancelPrompt(promptId: string): void {
    const prompt = this.activePrompts.get(promptId);
    if (prompt && prompt.level === 'public') {
      prompt.status = 'cancelled';
      this.activePrompts.delete(promptId);
      this.emitToAllConsoles(prompt);
    }
  }
  
  /**
   * Emit prompt to all subscribed consoles
   */
  private emitToAllConsoles(prompt: CommandPrompt): void {
    // In real implementation, this would push to WebSocket/SSE for live console updates
    console.log(`[COMMAND PROMPT TICKER] ${prompt.status.toUpperCase()}: ${prompt.prompt.substring(0, 80)}...`);
  }
  
  /**
   * Categorize prompt based on content
   */
  private categorizePrompt(text: string): CommandPrompt['category'] {
    const lower = text.toLowerCase();
    
    if (lower.startsWith('/') || lower.startsWith('!') || lower.startsWith('@')) {
      return 'command';
    }
    
    if (lower.includes('?') || lower.startsWith('what') || lower.startsWith('how') || lower.startsWith('why')) {
      return 'query';
    }
    
    if (lower.includes('create') || lower.includes('build') || lower.includes('make') || lower.includes('implement')) {
      return 'instruction';
    }
    
    if (lower.includes('please') || lower.includes('can you') || lower.includes('would you')) {
      return 'request';
    }
    
    if (lower.includes('system') || lower.includes('status') || lower.includes('check')) {
      return 'system';
    }
    
    return 'command';
  }
  
  /**
   * Get ticker for specific console
   */
  getTicker(consoleId: string): CommandPromptTicker | undefined {
    return this.tickers.get(consoleId);
  }
  
  /**
   * Get all tickers
   */
  getAllTickers(): CommandPromptTicker[] {
    return Array.from(this.tickers.values());
  }
  
  /**
   * Get active prompts (currently being entered)
   */
  getActivePrompts(): CommandPrompt[] {
    return Array.from(this.activePrompts.values())
      .filter(p => p.level === 'public' && p.status === 'entering');
  }
  
  /**
   * Get recent public prompts
   */
  getRecentPrompts(limit: number = 50): CommandPrompt[] {
    return this.publicPrompts.slice(0, limit);
  }
  
  /**
   * Get prompts by creator
   */
  getPromptsByCreator(creator: string, limit: number = 50): CommandPrompt[] {
    return this.publicPrompts
      .filter(p => p.creator === creator)
      .slice(0, limit);
  }
  
  /**
   * Get prompts by category
   */
  getPromptsByCategory(category: CommandPrompt['category'], limit: number = 50): CommandPrompt[] {
    return this.publicPrompts
      .filter(p => p.category === category)
      .slice(0, limit);
  }
  
  /**
   * Search prompts
   */
  searchPrompts(query: string, limit: number = 50): CommandPrompt[] {
    const lowerQuery = query.toLowerCase();
    return this.publicPrompts
      .filter(p => 
        p.prompt.toLowerCase().includes(lowerQuery) ||
        p.creator.toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }
  
  /**
   * Get prompt statistics
   */
  getStatistics(): {
    totalPrompts: number;
    activePrompts: number;
    byCategory: Record<string, number>;
    byCreator: Record<string, number>;
    byStatus: Record<string, number>;
  } {
    const stats = {
      totalPrompts: this.publicPrompts.length,
      activePrompts: this.activePrompts.size,
      byCategory: {} as Record<string, number>,
      byCreator: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    };
    
    for (const prompt of this.publicPrompts) {
      // Category stats
      const cat = prompt.category || 'unknown';
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
      
      // Creator stats
      stats.byCreator[prompt.creator] = (stats.byCreator[prompt.creator] || 0) + 1;
      
      // Status stats
      stats.byStatus[prompt.status] = (stats.byStatus[prompt.status] || 0) + 1;
    }
    
    return stats;
  }
}

// Singleton instance
export const commandPromptTicker = new CommandPromptTickerMonitor();

/**
 * Quick access functions
 */
export function startTrackingPrompt(
  promptId: string,
  creator: string,
  initialText?: string,
  metadata?: CommandPrompt['metadata']
): void {
  commandPromptTicker.startPromptTracking(promptId, creator, initialText, metadata);
}

export function updatePromptText(
  promptId: string,
  text: string
): void {
  commandPromptTicker.updatePrompt(promptId, text);
}

export function submitPromptCommand(
  promptId: string,
  finalText: string
): void {
  commandPromptTicker.submitPrompt(promptId, finalText);
}

export function getActivePrompts(): CommandPrompt[] {
  return commandPromptTicker.getActivePrompts();
}

export function getRecentPrompts(limit?: number): CommandPrompt[] {
  return commandPromptTicker.getRecentPrompts(limit);
}

export function getPromptStatistics() {
  return commandPromptTicker.getStatistics();
}

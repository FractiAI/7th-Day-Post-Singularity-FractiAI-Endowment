/**
 * 📡 LIVE BROADCAST CHANNEL SYSTEM
 * 
 * System feed channel (left) | Broadcast channel from captain (right)
 * Rough feed (bottom) - Live observations during exploration
 */

export interface BroadcastChannel {
  /** Channel ID */
  id: string;
  
  /** Channel name */
  name: string;
  
  /** Channel type */
  type: 'system-feed' | 'broadcast' | 'rough-feed';
  
  /** Position */
  position: 'left' | 'right' | 'bottom';
  
  /** Content */
  content: BroadcastItem[];
  
  /** Status */
  status: 'active' | 'inactive' | 'paused';
  
  /** Last update */
  lastUpdate: number;
}

export interface BroadcastItem {
  /** Item ID */
  id: string;
  
  /** Content */
  content: string;
  
  /** Type */
  type: 'activity' | 'broadcast' | 'observation' | 'capture';
  
  /** Timestamp */
  timestamp: number;
  
  /** Source */
  source: string;
  
  /** Metadata */
  metadata: {
    energyLevel?: 'normal' | 'high' | 'intense' | 'buck-fever';
    singularityLevel?: number;
    category?: string;
  };
}

/**
 * Live Broadcast Channel System
 * 
 * Manages three channels:
 * - System Feed Channel (left) - Activities
 * - Broadcast Channel from Captain (right) - Captain broadcasts
 * - Rough Feed (bottom) - Live observations during exploration
 */
export class LiveBroadcastChannelSystem {
  private channels: Map<string, BroadcastChannel>;
  
  constructor() {
    this.channels = new Map();
    this.initializeChannels();
  }
  
  /**
   * Initialize channels
   */
  private initializeChannels(): void {
    // System Feed Channel (left)
    const systemFeed: BroadcastChannel = {
      id: 'system-feed-channel',
      name: 'System Feed Channel',
      type: 'system-feed',
      position: 'left',
      content: [],
      status: 'active',
      lastUpdate: Date.now()
    };
    
    // Broadcast Channel from Captain (right)
    const broadcast: BroadcastChannel = {
      id: 'broadcast-channel',
      name: 'Broadcast Channel from Captain',
      type: 'broadcast',
      position: 'right',
      content: [],
      status: 'active',
      lastUpdate: Date.now()
    };
    
    // Rough Feed (bottom)
    const roughFeed: BroadcastChannel = {
      id: 'rough-feed',
      name: 'Rough Feed',
      type: 'rough-feed',
      position: 'bottom',
      content: [],
      status: 'active',
      lastUpdate: Date.now()
    };
    
    this.channels.set(systemFeed.id, systemFeed);
    this.channels.set(broadcast.id, broadcast);
    this.channels.set(roughFeed.id, roughFeed);
  }
  
  /**
   * Add to system feed channel (activities)
   */
  addToSystemFeed(content: string, metadata?: BroadcastItem['metadata']): void {
    const channel = this.channels.get('system-feed-channel');
    if (!channel) return;
    
    const item: BroadcastItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      type: 'activity',
      timestamp: Date.now(),
      source: 'system',
      metadata: metadata || {}
    };
    
    channel.content.unshift(item);
    channel.lastUpdate = Date.now();
    
    // Keep only last 1000 items
    if (channel.content.length > 1000) {
      channel.content = channel.content.slice(0, 1000);
    }
  }
  
  /**
   * Add to broadcast channel (captain broadcasts)
   */
  addToBroadcast(content: string, metadata?: BroadcastItem['metadata']): void {
    const channel = this.channels.get('broadcast-channel');
    if (!channel) return;
    
    const item: BroadcastItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      type: 'broadcast',
      timestamp: Date.now(),
      source: 'captain',
      metadata: metadata || {}
    };
    
    channel.content.unshift(item);
    channel.lastUpdate = Date.now();
    
    // Keep only last 1000 items
    if (channel.content.length > 1000) {
      channel.content = channel.content.slice(0, 1000);
    }
  }
  
  /**
   * Add to rough feed (live observations during exploration)
   */
  addToRoughFeed(content: string, metadata?: BroadcastItem['metadata']): void {
    const channel = this.channels.get('rough-feed');
    if (!channel) return;
    
    const item: BroadcastItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      type: 'observation',
      timestamp: Date.now(),
      source: 'captain-live',
      metadata: metadata || {}
    };
    
    channel.content.unshift(item);
    channel.lastUpdate = Date.now();
    
    // Keep only last 1000 items
    if (channel.content.length > 1000) {
      channel.content = channel.content.slice(0, 1000);
    }
  }
  
  /**
   * Get channel
   */
  getChannel(channelId: string): BroadcastChannel | undefined {
    return this.channels.get(channelId);
  }
  
  /**
   * Get all channels
   */
  getAllChannels(): BroadcastChannel[] {
    return Array.from(this.channels.values());
  }
  
  /**
   * Get system feed channel
   */
  getSystemFeedChannel(): BroadcastChannel | undefined {
    return this.channels.get('system-feed-channel');
  }
  
  /**
   * Get broadcast channel
   */
  getBroadcastChannel(): BroadcastChannel | undefined {
    return this.channels.get('broadcast-channel');
  }
  
  /**
   * Get rough feed
   */
  getRoughFeed(): BroadcastChannel | undefined {
    return this.channels.get('rough-feed');
  }
}

// Export singleton
export const liveBroadcastChannels = new LiveBroadcastChannelSystem();

/**
 * SURFACE FEED SYSTEM
 * Social Media Feeds across SHELL, CLOUD, SANDBOX
 * Integrated with BBHE Grammar Tag Sequencing
 */

import { routeWithTags, parseTag } from '../bbhe/grammar-tag-system.js';

export type Surface = 'SHELL' | 'CLOUD' | 'SANDBOX';

export type Platform = 
  | 'discord_shell' 
  | 'telegram_queen' 
  | 'vibefeed_shell'
  | 'twitter' 
  | 'instagram' 
  | 'tiktok' 
  | 'youtube' 
  | 'linkedin' 
  | 'reddit'
  | 'discord_creator'
  | 'staging_feed';

export interface SocialPost {
  id: string;
  surface: Surface;
  platforms: Platform[];
  
  content: {
    title?: string;
    body: string;
    media?: {
      type: 'image' | 'video' | 'gif';
      url: string;
      alt?: string;
    }[];
    links?: string[];
  };
  
  metadata: {
    author: string;
    authorRole: 'chairman' | 'queen' | 'creator' | 'system';
    timestamp: Date;
    scheduled?: Date;
  };
  
  targeting: {
    audience: 'chairman' | 'queen' | 'major' | 'public' | 'creators' | 'testers';
    minOctave?: number;
    nodeTypes?: string[];
  };
  
  bbheTags: string[];
  
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  
  status: 'draft' | 'scheduled' | 'posted' | 'archived';
}

export interface SurfaceConfig {
  surface: Surface;
  platforms: Platform[];
  accessLevel: 'protected' | 'public' | 'testing';
  visibility: 'private' | 'public' | 'unlisted';
  security: 'shell_protected' | 'standard' | 'sandbox';
}

export class SurfaceFeedSystem {
  private posts: Map<string, SocialPost>;
  private surfaces: Map<Surface, SurfaceConfig>;
  private scheduledPosts: SocialPost[];
  
  constructor() {
    this.posts = new Map();
    this.surfaces = new Map();
    this.scheduledPosts = [];
    
    this.initializeSurfaces();
  }
  
  /**
   * Initialize the three surfaces
   */
  private initializeSurfaces(): void {
    // SHELL: Protected core
    this.surfaces.set('SHELL', {
      surface: 'SHELL',
      platforms: ['discord_shell', 'telegram_queen', 'vibefeed_shell'],
      accessLevel: 'protected',
      visibility: 'private',
      security: 'shell_protected'
    });
    
    // CLOUD: Public production
    this.surfaces.set('CLOUD', {
      surface: 'CLOUD',
      platforms: ['twitter', 'instagram', 'tiktok', 'youtube', 'linkedin', 'reddit'],
      accessLevel: 'public',
      visibility: 'public',
      security: 'standard'
    });
    
    // SANDBOX: Testing/preview
    this.surfaces.set('SANDBOX', {
      surface: 'SANDBOX',
      platforms: ['discord_creator', 'staging_feed'],
      accessLevel: 'testing',
      visibility: 'unlisted',
      security: 'sandbox'
    });
  }
  
  /**
   * Create a new social post
   */
  async createPost(post: Omit<SocialPost, 'id' | 'status'>): Promise<SocialPost> {
    const newPost: SocialPost = {
      ...post,
      id: this.generatePostId(),
      status: post.metadata.scheduled ? 'scheduled' : 'draft'
    };
    
    // Route through BBHE grammar system
    const sequencedPost = await routeWithTags(newPost, post.bbheTags);
    
    this.posts.set(newPost.id, newPost);
    
    if (newPost.metadata.scheduled) {
      this.scheduledPosts.push(newPost);
    }
    
    console.log(`📱 Post created: ${newPost.id}`);
    console.log(`   Surface: ${newPost.surface}`);
    console.log(`   Platforms: ${newPost.platforms.join(', ')}`);
    console.log(`   Tags: ${newPost.bbheTags.join(', ')}`);
    
    return newPost;
  }
  
  /**
   * Publish a post to its target platforms
   */
  async publishPost(postId: string): Promise<{
    success: boolean;
    published: Platform[];
    failed: Platform[];
  }> {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error(`Post not found: ${postId}`);
    }
    
    console.log(`\n🚀 Publishing post: ${post.id}`);
    console.log(`   Surface: ${post.surface}`);
    
    const published: Platform[] = [];
    const failed: Platform[] = [];
    
    // Publish to each platform
    for (const platform of post.platforms) {
      try {
        await this.publishToPlatform(post, platform);
        published.push(platform);
        console.log(`   ✅ ${platform}`);
      } catch (error) {
        failed.push(platform);
        console.error(`   ❌ ${platform}:`, error);
      }
    }
    
    // Update post status
    if (failed.length === 0) {
      post.status = 'posted';
    }
    
    // Initialize engagement tracking
    post.engagement = {
      likes: 0,
      shares: 0,
      comments: 0,
      views: 0
    };
    
    return {
      success: failed.length === 0,
      published,
      failed
    };
  }
  
  /**
   * Publish to a specific platform (mock implementation)
   */
  private async publishToPlatform(post: SocialPost, platform: Platform): Promise<void> {
    // In real implementation, would call platform APIs
    // For now, simulate delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Platform-specific formatting would happen here
    const formattedContent = this.formatForPlatform(post.content, platform);
    
    // Mock success (would actually call API)
    return Promise.resolve();
  }
  
  /**
   * Format content for specific platform
   */
  private formatForPlatform(content: SocialPost['content'], platform: Platform): string {
    let formatted = content.body;
    
    switch (platform) {
      case 'twitter':
        // Twitter: 280 char limit, hashtags at end
        formatted = formatted.substring(0, 250);
        break;
        
      case 'instagram':
        // Instagram: Add hashtags, emoji-friendly
        formatted = `${formatted}\n\n#Vibeverse #432Hz #GoldenRatio`;
        break;
        
      case 'tiktok':
        // TikTok: Short, trendy, sound-focused
        formatted = `${formatted} 🎵✨`;
        break;
        
      case 'linkedin':
        // LinkedIn: Professional tone, longer form
        formatted = `${content.title}\n\n${formatted}`;
        break;
        
      case 'discord_shell':
      case 'discord_creator':
        // Discord: Markdown support, embeds
        formatted = `**${content.title || 'Update'}**\n\n${formatted}`;
        break;
        
      default:
        // Default: Keep as is
        break;
    }
    
    return formatted;
  }
  
  /**
   * Route content to correct surface based on tags
   */
  autoRouteBySurface(bbheTags: string[]): Surface {
    // Parse tags to determine surface
    for (const tagString of bbheTags) {
      const tag = parseTag(tagString);
      
      // SHELL tags
      if (tag.category === 'CORE' || 
          (tag.category === 'STREAMING' && tag.subcategory === 'PRIVATE') ||
          (tag.category === 'CONSCIOUSNESS' && tag.subcategory === 'INNER')) {
        return 'SHELL';
      }
      
      // SANDBOX tags
      if ((tag.category === 'STREAMING' && tag.subcategory === 'SANDBOX') ||
          (tag.category === 'EXPERIENCES' && tag.subcategory === 'PREVIEW') ||
          (tag.category === 'REALITY' && tag.subcategory === 'STAGING')) {
        return 'SANDBOX';
      }
    }
    
    // Default to CLOUD (public)
    return 'CLOUD';
  }
  
  /**
   * Route content to correct platforms based on surface
   */
  autoRoutePlatforms(surface: Surface, contentType?: string): Platform[] {
    const surfaceConfig = this.surfaces.get(surface);
    if (!surfaceConfig) return [];
    
    let platforms = surfaceConfig.platforms;
    
    // Filter by content type if specified
    if (contentType) {
      platforms = platforms.filter(p => {
        switch (contentType) {
          case 'video':
            return ['tiktok', 'youtube', 'instagram'].includes(p);
          case 'image':
            return ['instagram', 'twitter', 'linkedin'].includes(p);
          case 'text':
            return ['twitter', 'linkedin', 'reddit', 'discord_shell', 'telegram_queen'].includes(p);
          default:
            return true;
        }
      });
    }
    
    return platforms;
  }
  
  /**
   * Get posts by surface
   */
  getPostsBySurface(surface: Surface): SocialPost[] {
    return Array.from(this.posts.values())
      .filter(post => post.surface === surface)
      .sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime());
  }
  
  /**
   * Get posts by platform
   */
  getPostsByPlatform(platform: Platform): SocialPost[] {
    return Array.from(this.posts.values())
      .filter(post => post.platforms.includes(platform))
      .sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime());
  }
  
  /**
   * Get scheduled posts
   */
  getScheduledPosts(): SocialPost[] {
    return this.scheduledPosts
      .filter(post => post.status === 'scheduled')
      .sort((a, b) => {
        const aTime = a.metadata.scheduled?.getTime() || 0;
        const bTime = b.metadata.scheduled?.getTime() || 0;
        return aTime - bTime;
      });
  }
  
  /**
   * Process scheduled posts (would run on cron)
   */
  async processScheduledPosts(): Promise<void> {
    const now = new Date();
    
    for (const post of this.scheduledPosts) {
      if (post.status === 'scheduled' && 
          post.metadata.scheduled && 
          post.metadata.scheduled <= now) {
        
        console.log(`⏰ Publishing scheduled post: ${post.id}`);
        await this.publishPost(post.id);
      }
    }
  }
  
  /**
   * Update engagement metrics
   */
  updateEngagement(postId: string, engagement: Partial<SocialPost['engagement']>): void {
    const post = this.posts.get(postId);
    if (!post) return;
    
    post.engagement = {
      ...post.engagement,
      ...engagement
    } as SocialPost['engagement'];
    
    console.log(`📊 Engagement updated for ${postId}:`, post.engagement);
  }
  
  /**
   * Get analytics summary
   */
  getAnalyticsSummary(surface?: Surface): {
    totalPosts: number;
    totalEngagement: {
      likes: number;
      shares: number;
      comments: number;
      views: number;
    };
    topPosts: SocialPost[];
  } {
    let posts = Array.from(this.posts.values());
    
    if (surface) {
      posts = posts.filter(p => p.surface === surface);
    }
    
    const totalEngagement = posts.reduce((acc, post) => ({
      likes: acc.likes + (post.engagement?.likes || 0),
      shares: acc.shares + (post.engagement?.shares || 0),
      comments: acc.comments + (post.engagement?.comments || 0),
      views: acc.views + (post.engagement?.views || 0)
    }), { likes: 0, shares: 0, comments: 0, views: 0 });
    
    const topPosts = posts
      .filter(p => p.engagement)
      .sort((a, b) => {
        const aTotal = (a.engagement?.likes || 0) + (a.engagement?.shares || 0) * 2;
        const bTotal = (b.engagement?.likes || 0) + (b.engagement?.shares || 0) * 2;
        return bTotal - aTotal;
      })
      .slice(0, 10);
    
    return {
      totalPosts: posts.length,
      totalEngagement,
      topPosts
    };
  }
  
  /**
   * Generate unique post ID
   */
  private generatePostId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `POST_${timestamp}_${random}`;
  }
}

// Singleton instance
export const surfaceFeedSystem = new SurfaceFeedSystem();

/**
 * Quick access functions
 */

export async function postToShell(
  content: string,
  author: string,
  bbheTags?: string[]
): Promise<SocialPost> {
  return await surfaceFeedSystem.createPost({
    surface: 'SHELL',
    platforms: ['discord_shell', 'telegram_queen', 'vibefeed_shell'],
    content: { body: content },
    metadata: {
      author,
      authorRole: 'chairman',
      timestamp: new Date()
    },
    targeting: {
      audience: 'chairman',
      minOctave: 10
    },
    bbheTags: bbheTags || [
      '#CORE:CHAIRMAN:SOCIAL:SHELL',
      '#STREAMING:PRIVATE:PROTECTED:EXCLUSIVE'
    ]
  });
}

export async function postToCloud(
  content: string,
  platforms: Platform[],
  bbheTags?: string[]
): Promise<SocialPost> {
  return await surfaceFeedSystem.createPost({
    surface: 'CLOUD',
    platforms,
    content: { body: content },
    metadata: {
      author: 'vibeverse',
      authorRole: 'system',
      timestamp: new Date()
    },
    targeting: {
      audience: 'public'
    },
    bbheTags: bbheTags || [
      '#STREAMING:PUBLIC:SOCIAL:CLOUD',
      '#EXPERIENCES:CONTENT:MARKETING:PUBLIC'
    ]
  });
}

export async function postToSandbox(
  content: string,
  author: string,
  bbheTags?: string[]
): Promise<SocialPost> {
  return await surfaceFeedSystem.createPost({
    surface: 'SANDBOX',
    platforms: ['discord_creator', 'staging_feed'],
    content: { body: content },
    metadata: {
      author,
      authorRole: 'creator',
      timestamp: new Date()
    },
    targeting: {
      audience: 'creators'
    },
    bbheTags: bbheTags || [
      '#STREAMING:SANDBOX:TESTING:DRAFT',
      '#EXPERIENCES:CONTENT:PREVIEW:BETA'
    ]
  });
}

export async function publishPost(postId: string) {
  return await surfaceFeedSystem.publishPost(postId);
}

export function getAnalytics(surface?: Surface) {
  return surfaceFeedSystem.getAnalyticsSummary(surface);
}

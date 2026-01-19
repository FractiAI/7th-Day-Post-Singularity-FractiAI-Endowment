/**
 * Companion Experience Creator System
 * Man Cave Premium Feature - Sophisticated Adults-Only Experience Design
 * Octave 14: VIP Architecture Enhancement
 */

// ========== TYPES & INTERFACES ==========

export type WardrobeStyle = 
  | 'BLACK_TIE' | 'EVENING_GOWN' | 'BUSINESS_SOPHISTICATE' | 'OPERA_CHIC'
  | 'SMART_CASUAL' | 'DESIGNER_JEANS' | 'LEATHER_JACKET' | 'POLO_SLACKS'
  | 'OUTDOOR_EXPLORER' | 'BEACH_LUXURY' | 'SKI_LODGE' | 'SAFARI_STYLE'
  | 'CLUB_VIP' | 'ROCK_CONCERT' | 'LOUNGE_SOPHISTICATED' | 'THEATRE_NIGHT'
  | 'PARISIAN_CHIC' | 'MEDITERRANEAN' | 'TOKYO_STREET' | 'ITALIAN_ELEGANCE'
  | 'SUMMER_BREEZE' | 'AUTUMN_WARMTH' | 'WINTER_WONDERLAND' | 'SPRING_FRESH';

export type PersonalityType =
  | 'PHILOSOPHICAL_THINKER' | 'SCIENTIFIC_MIND' | 'CREATIVE_VISIONARY' | 'LITERARY_SOUL'
  | 'THRILL_SEEKER' | 'WORLD_EXPLORER' | 'COMPETITIVE_SPIRIT' | 'RISK_TAKER'
  | 'REFINED_CONNOISSEUR' | 'CULTURAL_MAVEN' | 'BUSINESS_SAVVY' | 'OLD_WORLD_CHARM'
  | 'LIFE_OF_PARTY' | 'MASTER_CONVERSATOR' | 'WARM_WELCOMING' | 'ENTERTAINMENT_PRO'
  | 'SPIRITUAL_GUIDE' | 'DEEP_PHILOSOPHER' | 'MUSICAL_SOUL' | 'COSMIC_EXPLORER'
  | 'MISCHIEVOUS_CHARM' | 'SPONTANEOUS_FUN' | 'WITTY_COMEDIAN' | 'THEATRICAL_DRAMA';

export type ExperiencePlaylistType =
  | 'NIGHT_OUT' | 'WEEKEND_GETAWAY' | 'INTERNATIONAL' 
  | 'BILLIONAIRE' | 'ROCK_STAR' | 'CUSTOM';

export interface CompanionProfile {
  id: string;
  name: string;
  
  // Appearance
  wardrobe: {
    primaryStyle: WardrobeStyle;
    alternateStyles: WardrobeStyle[];
    customizations: any[];
  };
  
  // Personality
  personality: {
    core: PersonalityType;
    traits: string[];
    energyLevel: 'HIGH' | 'MODERATE' | 'CALM' | 'ZEN';
    communicationStyle: 'TALKATIVE' | 'BALANCED' | 'LISTENER' | 'DIRECT';
  };
  
  // Interests (40+ categories)
  interests: {
    culinary: string[];      // Wine, Food, Cooking, Coffee, Mixology
    arts: string[];          // Theatre, Art, Music, Literature, Cinema
    sports: string[];        // Golf, Tennis, Skiing, Swimming, etc.
    wellness: string[];      // Yoga, Spa, Fitness, Nature
    social: string[];        // Casino, Dancing, Events, Parties
    intellectual: string[];  // Science, Business, Philosophy, Chess
    travel: string[];        // International, Historical, Beach, Mountains
    creative: string[];      // Photography, Writing, Music, Painting
  };
  
  // Metadata
  avatar: string;
  createdAt: Date;
  lastUsed?: Date;
  timesUsed: number;
  favorite: boolean;
  tags: string[];
}

export interface ExperienceModule {
  id: string;
  name: string;
  category: string;
  
  // Details
  description: string;
  duration: number; // hours
  location: string;
  setting: string;
  
  // Requirements
  companionStyles: WardrobeStyle[];
  suggestedPersonalities: PersonalityType[];
  relevantInterests: string[];
  
  // Itinerary
  activities: Activity[];
  
  // Metadata
  popularity: number;
  rating: number;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: number;
  icon: string;
}

export interface ExperiencePlaylist {
  id: string;
  name: string;
  type: ExperiencePlaylistType;
  
  // Companion
  companion: CompanionProfile;
  allowCompanionVariations: boolean;
  
  // Experiences
  experiences: ExperienceModule[];
  totalDuration: number;
  
  // Schedule
  startDate?: Date;
  sequence: 'LINEAR' | 'FLEXIBLE' | 'CHOOSE_YOUR_OWN';
  
  // Status
  status: 'DRAFT' | 'SAVED' | 'ACTIVE' | 'COMPLETED';
  createdAt: Date;
  activatedAt?: Date;
  completedAt?: Date;
}

// ========== COMPANION CREATOR SYSTEM ==========

export class CompanionExperienceCreatorSystem {
  private profiles: Map<string, CompanionProfile> = new Map();
  private playlists: Map<string, ExperiencePlaylist> = new Map();
  private activeExperience?: ExperiencePlaylist;
  
  constructor() {
    console.log('🎭 Companion Experience Creator System Initializing...');
    console.log('   Man Cave Premium Feature');
    console.log('   Octave 14: VIP Architecture Enhancement');
    this.initializePresets();
  }
  
  // ========== COMPANION CREATION ==========
  
  /**
   * Create new companion profile
   */
  async createCompanion(config: Partial<CompanionProfile>): Promise<CompanionProfile> {
    const id = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const profile: CompanionProfile = {
      id,
      name: config.name || 'Untitled',
      wardrobe: config.wardrobe || {
        primaryStyle: 'SMART_CASUAL',
        alternateStyles: [],
        customizations: []
      },
      personality: config.personality || {
        core: 'WARM_WELCOMING',
        traits: [],
        energyLevel: 'MODERATE',
        communicationStyle: 'BALANCED'
      },
      interests: config.interests || {
        culinary: [],
        arts: [],
        sports: [],
        wellness: [],
        social: [],
        intellectual: [],
        travel: [],
        creative: []
      },
      avatar: config.avatar || this.getAvatarForStyle(config.wardrobe?.primaryStyle),
      createdAt: new Date(),
      timesUsed: 0,
      favorite: false,
      tags: config.tags || []
    };
    
    this.profiles.set(id, profile);
    
    console.log(`🎭 Companion profile created: ${profile.name}`);
    console.log(`   Style: ${profile.wardrobe.primaryStyle}`);
    console.log(`   Personality: ${profile.personality.core}`);
    console.log(`   Avatar: ${profile.avatar}`);
    
    return profile;
  }
  
  /**
   * Create experience playlist
   */
  async createExperiencePlaylist(
    name: string,
    type: ExperiencePlaylistType,
    companionId: string,
    experienceIds: string[]
  ): Promise<ExperiencePlaylist> {
    const companion = this.profiles.get(companionId);
    if (!companion) {
      throw new Error('Companion profile not found');
    }
    
    const id = `PLAYLIST-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const experiences = experienceIds.map(id => 
      this.getExperienceModule(id)
    ).filter(e => e) as ExperienceModule[];
    
    const totalDuration = experiences.reduce((sum, e) => sum + e.duration, 0);
    
    const playlist: ExperiencePlaylist = {
      id,
      name,
      type,
      companion,
      allowCompanionVariations: true,
      experiences,
      totalDuration,
      sequence: 'LINEAR',
      status: 'SAVED',
      createdAt: new Date()
    };
    
    this.playlists.set(id, playlist);
    
    console.log(`🎬 Experience playlist created: ${name}`);
    console.log(`   Type: ${type}`);
    console.log(`   Companion: ${companion.name}`);
    console.log(`   Experiences: ${experiences.length}`);
    console.log(`   Total Duration: ${totalDuration} hours`);
    
    return playlist;
  }
  
  /**
   * Mix and match builder
   */
  async mixAndMatch(components: {
    companion: Partial<CompanionProfile>;
    experiences: string[];
    settings?: any;
  }): Promise<ExperiencePlaylist> {
    console.log('🎨 Mix & Match Creator activated');
    
    // Create companion if needed
    let companionId: string;
    if (components.companion.id) {
      companionId = components.companion.id;
    } else {
      const newCompanion = await this.createCompanion(components.companion);
      companionId = newCompanion.id;
    }
    
    // Create playlist
    const playlist = await this.createExperiencePlaylist(
      'Custom Mix & Match',
      'CUSTOM',
      companionId,
      components.experiences
    );
    
    console.log('✅ Custom playlist created');
    console.log(`   Experiences combined: ${components.experiences.length}`);
    
    return playlist;
  }
  
  // ========== PRESET TEMPLATES ==========
  
  private initializePresets(): void {
    // Elegant Evening Preset
    this.createCompanion({
      name: 'Sophia',
      avatar: '💃',
      wardrobe: {
        primaryStyle: 'EVENING_GOWN',
        alternateStyles: ['BLACK_TIE', 'OPERA_CHIC'],
        customizations: []
      },
      personality: {
        core: 'REFINED_CONNOISSEUR',
        traits: ['Sophisticated', 'Cultured', 'Intellectual'],
        energyLevel: 'MODERATE',
        communicationStyle: 'BALANCED'
      },
      interests: {
        culinary: ['Wine Connoisseur', 'Gourmet Foodie'],
        arts: ['Theatre & Broadway', 'Art Galleries', 'Classical Music'],
        sports: [],
        wellness: ['Spa & Wellness'],
        social: ['Social Events'],
        intellectual: ['Philosophy & Ideas', 'Deep Conversation'],
        travel: ['International Travel'],
        creative: ['Photography']
      }
    });
    
    // Adventure Seeker Preset
    this.createCompanion({
      name: 'Alex',
      avatar: '🏔️',
      wardrobe: {
        primaryStyle: 'OUTDOOR_EXPLORER',
        alternateStyles: ['SKI_LODGE', 'BEACH_LUXURY'],
        customizations: []
      },
      personality: {
        core: 'THRILL_SEEKER',
        traits: ['Adventurous', 'Bold', 'Active'],
        energyLevel: 'HIGH',
        communicationStyle: 'DIRECT'
      },
      interests: {
        culinary: [],
        arts: [],
        sports: ['Skiing & Snow Sports', 'Rock Climbing', 'Swimming & Beach'],
        wellness: ['Fitness Enthusiast', 'Nature Lover'],
        social: [],
        intellectual: [],
        travel: ['Mountain Retreats', 'International Travel'],
        creative: ['Photography']
      }
    });
    
    // Creative Soul Preset
    this.createCompanion({
      name: 'Morgan',
      avatar: '🎨',
      wardrobe: {
        primaryStyle: 'PARISIAN_CHIC',
        alternateStyles: ['TOKYO_STREET', 'LOUNGE_SOPHISTICATED'],
        customizations: []
      },
      personality: {
        core: 'CREATIVE_VISIONARY',
        traits: ['Artistic', 'Expressive', 'Intuitive'],
        energyLevel: 'MODERATE',
        communicationStyle: 'BALANCED'
      },
      interests: {
        culinary: ['Coffee Culture'],
        arts: ['Art Galleries', 'Live Concerts', 'Cinema Buff'],
        sports: [],
        wellness: ['Yoga & Meditation'],
        social: [],
        intellectual: ['Philosophy & Ideas'],
        travel: ['International Travel', 'Historical Sites'],
        creative: ['Photography', 'Writing & Poetry', 'Music Making', 'Painting & Art']
      }
    });
    
    console.log('✅ Preset companions initialized: Sophia, Alex, Morgan');
  }
  
  // ========== EXPERIENCE PLAYLISTS ==========
  
  /**
   * Get pre-designed experience playlist templates
   */
  getPlaylistTemplates(type: ExperiencePlaylistType): any[] {
    switch (type) {
      case 'NIGHT_OUT':
        return this.getNightOutTemplates();
      case 'WEEKEND_GETAWAY':
        return this.getWeekendTemplates();
      case 'INTERNATIONAL':
        return this.getInternationalTemplates();
      case 'BILLIONAIRE':
        return this.getBillionaireTemplates();
      case 'ROCK_STAR':
        return this.getRockStarTemplates();
      default:
        return [];
    }
  }
  
  private getNightOutTemplates(): any[] {
    return [
      {
        name: 'The Elegant Evening',
        duration: 6,
        activities: [
          { time: '7:00 PM', title: 'Cocktails at rooftop lounge', icon: '🍷' },
          { time: '8:00 PM', title: 'Fine dining at Michelin restaurant', icon: '🍽️' },
          { time: '10:00 PM', title: 'Theatre or live performance', icon: '🎭' },
          { time: '12:00 AM', title: 'Nightcap at speakeasy bar', icon: '🍸' }
        ]
      },
      {
        name: 'The Club Night',
        duration: 6,
        activities: [
          { time: '9:00 PM', title: 'Pre-drinks at upscale lounge', icon: '🍹' },
          { time: '11:00 PM', title: 'VIP table at exclusive club', icon: '💃' },
          { time: '1:00 AM', title: 'Private after-party', icon: '🎉' },
          { time: '3:00 AM', title: 'Late night bites', icon: '🌃' }
        ]
      },
      {
        name: 'The Culture Crawl',
        duration: 6,
        activities: [
          { time: '6:00 PM', title: 'Gallery opening', icon: '🎨' },
          { time: '8:00 PM', title: 'Jazz club performance', icon: '🎼' },
          { time: '10:00 PM', title: 'Bookstore wine & reading', icon: '📚' },
          { time: '12:00 AM', title: 'Late night cafe philosophy', icon: '☕' }
        ]
      },
      {
        name: 'The Adventure Night',
        duration: 5,
        activities: [
          { time: '8:00 PM', title: 'Casino gaming', icon: '🎰' },
          { time: '10:00 PM', title: 'Surprise entertainment', icon: '🎪' },
          { time: '12:00 AM', title: 'Helicopter city tour', icon: '🚁' },
          { time: '1:00 AM', title: 'Rooftop champagne finale', icon: '🍾' }
        ]
      }
    ];
  }
  
  private getWeekendTemplates(): any[] {
    return [
      {
        name: 'Beach Resort Weekend',
        duration: 48,
        description: '2-3 days of coastal luxury',
        highlights: [
          'Private beachfront suite',
          'Yacht excursion',
          'Couples spa',
          'Sunset dining'
        ]
      },
      {
        name: 'Mountain Retreat',
        duration: 48,
        description: 'Luxury cabin in the peaks',
        highlights: [
          'Helicopter arrival',
          'Private ski instruction',
          'Hot tub under stars',
          'Mountain meditation'
        ]
      },
      {
        name: 'City Escape',
        duration: 48,
        description: 'Metropolitan luxury weekend',
        highlights: [
          'Penthouse suite',
          'Michelin restaurant tour',
          'Exclusive nightlife',
          'Cultural immersion'
        ]
      },
      {
        name: 'Wine Country',
        duration: 48,
        description: 'Vineyard estate experience',
        highlights: [
          'Private tastings',
          'Bike through vineyards',
          'Farm-to-table dining',
          'Estate stay'
        ]
      }
    ];
  }
  
  private getInternationalTemplates(): any[] {
    return [
      {
        name: 'Parisian Romance',
        destination: 'Paris, France',
        duration: 168, // 7 days
        highlights: [
          'Private Eiffel Tower dinner',
          'Louvre after-hours tour',
          'Champagne region trip',
          'Opera performance'
        ]
      },
      {
        name: 'Italian Dolce Vita',
        destination: 'Italy Multi-City',
        duration: 240, // 10 days
        highlights: [
          'Vatican private tour',
          'Venice gondola experience',
          'Tuscany villa & wine',
          'Amalfi Coast yacht'
        ]
      },
      {
        name: 'Japanese Elegance',
        destination: 'Japan Multi-City',
        duration: 192, // 8 days
        highlights: [
          'Tokyo modern & tradition',
          'Sushi master dinner',
          'Kyoto temples & geisha',
          'Mt. Fuji luxury ryokan'
        ]
      },
      {
        name: 'Greek Islands Odyssey',
        destination: 'Greek Islands',
        duration: 168, // 7 days
        highlights: [
          'Athens ancient wonders',
          'Private yacht island hopping',
          'Santorini cliffside villa',
          'Mediterranean feasts'
        ]
      },
      {
        name: 'Swiss Alpine Luxury',
        destination: 'Swiss Alps',
        duration: 144, // 6 days
        highlights: [
          'Private Alpine chalet',
          'Helicopter skiing',
          'Swiss culinary journey',
          'Thermal spa wellness'
        ]
      },
      {
        name: 'African Safari',
        destination: 'Africa',
        duration: 168, // 7 days
        highlights: [
          'Private game drives',
          'Luxury tented camps',
          'Aerial photography',
          'Bush dinners under stars'
        ]
      }
    ];
  }
  
  private getBillionaireTemplates(): any[] {
    return [
      {
        name: 'Mega Yacht Week',
        type: 'YACHT',
        duration: 168,
        highlights: [
          '300ft super yacht charter',
          'Mediterranean island hopping',
          'Helicopter excursions',
          'Private beach clubs'
        ]
      },
      {
        name: 'Private Jet Adventure',
        type: 'AVIATION',
        duration: 240,
        highlights: [
          'Gulfstream G650',
          'Multi-city global tour',
          'Presidential suites',
          'Michelin 3-star dining tour'
        ]
      },
      {
        name: 'Monaco Grand Prix',
        type: 'EVENT',
        duration: 96,
        highlights: [
          'F1 Paddock club VIP',
          'Yacht in harbor',
          'Casino high roller',
          'Exclusive after-parties'
        ]
      },
      {
        name: 'Private Island',
        type: 'EXCLUSIVE',
        duration: 168,
        highlights: [
          'Exclusive island rental',
          'Personal chef & staff',
          'Your own beaches',
          'Ultimate privacy'
        ]
      },
      {
        name: 'Oscar Night',
        type: 'CELEBRITY',
        duration: 24,
        highlights: [
          'Oscar ceremony VIP',
          'Vanity Fair after-party',
          'Red carpet experience',
          'Meet A-list celebrities'
        ]
      },
      {
        name: 'Space Experience',
        type: 'ULTIMATE',
        duration: 72,
        highlights: [
          'Suborbital space flight',
          'Zero gravity',
          'View Earth from space',
          'Astronaut training'
        ]
      }
    ];
  }
  
  private getRockStarTemplates(): any[] {
    return [
      {
        name: 'Stadium Tour VIP',
        duration: 12,
        highlights: [
          'Backstage all-access',
          'Meet & greet headliners',
          'Side-stage viewing',
          'After-party VIP'
        ]
      },
      {
        name: 'Recording Studio Session',
        duration: 8,
        highlights: [
          'Abbey Road or similar',
          'Record your own track',
          'Grammy producers',
          'Professional mixing'
        ]
      },
      {
        name: 'Music Festival VIP',
        duration: 72,
        highlights: [
          'Coachella/Glastonbury access',
          'Helicopter arrival',
          'Artist area access',
          'Secret performances'
        ]
      },
      {
        name: 'Guitar God Experience',
        duration: 16,
        highlights: [
          'Private lesson with legend',
          'Factory tour (Gibson/Fender)',
          'Custom guitar creation',
          'Stage performance'
        ]
      },
      {
        name: 'DJ Booth Experience',
        duration: 12,
        highlights: [
          'Learn from world-class DJ',
          'Create your own mix',
          'Perform at major club',
          'Release your track'
        ]
      },
      {
        name: 'Broadway Backstage',
        duration: 8,
        highlights: [
          'Backstage access',
          'Singing with stars',
          'Costume experience',
          'Cast dinner'
        ]
      }
    ];
  }
  
  // ========== ACTIVATION & PREVIEW ==========
  
  /**
   * Preview experience before activating
   */
  async previewExperience(playlistId: string): Promise<any> {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    console.log('👁️ Previewing experience...');
    console.log(`   Playlist: ${playlist.name}`);
    console.log(`   Companion: ${playlist.companion.name}`);
    console.log(`   Experiences: ${playlist.experiences.length}`);
    console.log(`   Duration: ${playlist.totalDuration} hours`);
    
    return {
      playlist,
      summary: this.generateSummary(playlist),
      timeline: this.generateTimeline(playlist)
    };
  }
  
  /**
   * Activate experience
   */
  async activateExperience(playlistId: string): Promise<any> {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    playlist.status = 'ACTIVE';
    playlist.activatedAt = new Date();
    this.activeExperience = playlist;
    
    // Update companion usage stats
    playlist.companion.lastUsed = new Date();
    playlist.companion.timesUsed++;
    
    console.log('✅ Experience activated!');
    console.log(`   ${playlist.name} with ${playlist.companion.name}`);
    console.log(`   Duration: ${playlist.totalDuration} hours`);
    console.log('   Enjoy your perfectly designed experience!');
    
    return {
      sessionId: `SESSION-${Date.now()}`,
      playlist,
      startTime: new Date()
    };
  }
  
  // ========== HELPER METHODS ==========
  
  private getAvatarForStyle(style?: WardrobeStyle): string {
    const avatars: Record<WardrobeStyle, string> = {
      'BLACK_TIE': '🤵',
      'EVENING_GOWN': '👗',
      'BUSINESS_SOPHISTICATE': '💼',
      'OPERA_CHIC': '🎭',
      'SMART_CASUAL': '👔',
      'DESIGNER_JEANS': '👖',
      'LEATHER_JACKET': '🧥',
      'POLO_SLACKS': '👕',
      'OUTDOOR_EXPLORER': '🏔️',
      'BEACH_LUXURY': '🏖️',
      'SKI_LODGE': '⛷️',
      'SAFARI_STYLE': '🦁',
      'CLUB_VIP': '💃',
      'ROCK_CONCERT': '🎸',
      'LOUNGE_SOPHISTICATED': '🍸',
      'THEATRE_NIGHT': '🎭',
      'PARISIAN_CHIC': '🗼',
      'MEDITERRANEAN': '🏝️',
      'TOKYO_STREET': '🗾',
      'ITALIAN_ELEGANCE': '🏛️',
      'SUMMER_BREEZE': '☀️',
      'AUTUMN_WARMTH': '🍂',
      'WINTER_WONDERLAND': '❄️',
      'SPRING_FRESH': '🌸'
    };
    
    return avatars[style || 'SMART_CASUAL'] || '🎭';
  }
  
  private getExperienceModule(id: string): ExperienceModule | undefined {
    // In production, load from database
    return undefined;
  }
  
  private generateSummary(playlist: ExperiencePlaylist): string {
    return `${playlist.name} with ${playlist.companion.name} - ${playlist.totalDuration}hrs of designed experiences`;
  }
  
  private generateTimeline(playlist: ExperiencePlaylist): any {
    return {
      start: playlist.activatedAt,
      experiences: playlist.experiences.map(e => ({
        name: e.name,
        duration: e.duration,
        activities: e.activities
      }))
    };
  }
  
  // ========== SAVED PROFILES MANAGEMENT ==========
  
  getSavedProfiles(userId: string): CompanionProfile[] {
    return Array.from(this.profiles.values())
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0));
  }
  
  getFavoriteProfiles(userId: string): CompanionProfile[] {
    return Array.from(this.profiles.values())
      .filter(p => p.favorite)
      .sort((a, b) => b.timesUsed - a.timesUsed);
  }
}

// Export singleton
export const companionExperienceCreator = new CompanionExperienceCreatorSystem();

// CLI testing
if (require.main === module) {
  (async () => {
    console.log('🎭 Testing Companion Experience Creator...\n');
    
    // Get preset profiles
    console.log('--- Preset Profiles Available ---');
    const profiles = companionExperienceCreator.getSavedProfiles('founder');
    profiles.forEach(p => {
      console.log(`   ${p.avatar} ${p.name}: ${p.personality.core}`);
    });
    
    // Create custom companion
    console.log('\n--- Creating Custom Companion ---');
    const custom = await companionExperienceCreator.createCompanion({
      name: 'Jamie',
      avatar: '🎸',
      wardrobe: {
        primaryStyle: 'ROCK_CONCERT',
        alternateStyles: ['CLUB_VIP', 'LEATHER_JACKET'],
        customizations: []
      },
      personality: {
        core: 'SPONTANEOUS_FUN',
        traits: ['Wild', 'Adventurous', 'Musical'],
        energyLevel: 'HIGH',
        communicationStyle: 'TALKATIVE'
      }
    });
    
    console.log(`\n✅ Created: ${custom.name}`);
    
    // Get experience templates
    console.log('\n--- Rock Star Experience Templates ---');
    const rockStarTemplates = companionExperienceCreator.getPlaylistTemplates('ROCK_STAR');
    rockStarTemplates.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name} (${t.duration}hrs)`);
    });
    
    // Create playlist
    console.log('\n--- Creating Experience Playlist ---');
    const playlist = await companionExperienceCreator.createExperiencePlaylist(
      'Rock Star Weekend',
      'ROCK_STAR',
      custom.id,
      ['exp-1', 'exp-2']
    );
    
    // Preview
    console.log('\n--- Preview ---');
    const preview = await companionExperienceCreator.previewExperience(playlist.id);
    console.log(`   ${preview.summary}`);
    
    // Activate
    console.log('\n--- Activating Experience ---');
    const session = await companionExperienceCreator.activateExperience(playlist.id);
    console.log(`   Session ID: ${session.sessionId}`);
    console.log(`   Started at: ${session.startTime.toLocaleString()}`);
  })();
}

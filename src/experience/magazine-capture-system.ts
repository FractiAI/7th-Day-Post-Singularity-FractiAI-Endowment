/**
 * 5-STAR MAGAZINE EXPERIENCE CAPTURE
 * Professional documentation of adventures, getaways, and experiences
 * Members-only editions for companion hostesses
 */

export type ExperienceType = 
  | 'escape' | 'adventure' | 'getaway' | 'safari' | 'yacht' 
  | 'fishing' | 'hunting' | 'diving' | 'exploration' | 'luxury-travel'
  | 'wine-tasting' | 'dining' | 'spa' | 'cultural' | 'romantic';

export type MagazineEdition = 'public' | 'members-only' | 'private' | 'companion-exclusive';

export interface ExperienceCapture {
  captureId: string;
  userId: string;
  userName: string;
  experienceType: ExperienceType;
  title: string;
  subtitle?: string;
  location: string;
  date: Date;
  duration: string; // "3 days", "1 week", etc.
  photos: ExperiencePhoto[];
  story: string;
  highlights: string[];
  companions?: CompanionInfo[];
  rating: number; // 1-5 stars
  edition: MagazineEdition;
  published: boolean;
  magazineId?: string;
  timestamp: Date;
}

export interface ExperiencePhoto {
  photoId: string;
  url: string;
  caption: string;
  featured: boolean;
  order: number;
}

export interface CompanionInfo {
  companionId: string;
  name: string;
  role: 'hostess' | 'guide' | 'guest';
  photo?: string;
  note?: string;
}

export interface MagazineIssue {
  issueId: string;
  title: string;
  edition: MagazineEdition;
  coverPhoto: string;
  coverStory: string;
  experiences: ExperienceCapture[];
  publishDate: Date;
  volume: number;
  issue: number;
  featured: boolean;
}

export interface HostessMagazineOffer {
  offerId: string;
  hostessId: string;
  hostessName: string;
  guestId: string;
  guestName: string;
  magazineIssue: MagazineIssue;
  personalNote: string;
  offerDate: Date;
  accepted: boolean;
  viewedDate?: Date;
}

export interface MagazineStats {
  totalCaptures: number;
  totalMagazines: number;
  totalViews: number;
  averageRating: number;
  favoriteExperience: ExperienceType;
  totalLocations: number;
  totalCompanions: number;
}

/**
 * 5-Star Magazine Experience Capture System
 */
export class MagazineCaptureSystem {
  private captures: Map<string, ExperienceCapture> = new Map();
  private magazines: Map<string, MagazineIssue> = new Map();
  private offers: Map<string, HostessMagazineOffer> = new Map();
  private userStats: Map<string, MagazineStats> = new Map();
  
  private volumeCounter = 1;
  private issueCounter: Map<number, number> = new Map();

  /**
   * Capture an experience
   */
  captureExperience(
    userId: string,
    userName: string,
    experience: {
      type: ExperienceType;
      title: string;
      subtitle?: string;
      location: string;
      date: Date;
      duration: string;
      photos: Array<{ url: string; caption: string; featured?: boolean }>;
      story: string;
      highlights: string[];
      companions?: CompanionInfo[];
      rating: number;
      edition: MagazineEdition;
    }
  ): ExperienceCapture {
    const captureId = `CAP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const photos: ExperiencePhoto[] = experience.photos.map((p, i) => ({
      photoId: `PHOTO-${Date.now()}-${i}`,
      url: p.url,
      caption: p.caption,
      featured: p.featured || false,
      order: i
    }));

    const capture: ExperienceCapture = {
      captureId,
      userId,
      userName,
      experienceType: experience.type,
      title: experience.title,
      subtitle: experience.subtitle,
      location: experience.location,
      date: experience.date,
      duration: experience.duration,
      photos,
      story: experience.story,
      highlights: experience.highlights,
      companions: experience.companions,
      rating: Math.min(5, Math.max(1, experience.rating)),
      edition: experience.edition,
      published: false,
      timestamp: new Date()
    };

    this.captures.set(captureId, capture);
    this.updateStats(userId, capture);

    console.log(`📸 Experience captured: ${capture.title} (${capture.edition})`);

    return capture;
  }

  /**
   * Create magazine issue from captures
   */
  createMagazine(
    captureIds: string[],
    title: string,
    edition: MagazineEdition,
    coverPhoto: string,
    coverStory: string
  ): MagazineIssue {
    const issueId = `MAG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get captures
    const experiences = captureIds
      .map(id => this.captures.get(id))
      .filter(c => c !== undefined) as ExperienceCapture[];

    if (experiences.length === 0) {
      throw new Error('No valid experiences for magazine');
    }

    // Get issue number
    const currentIssue = this.issueCounter.get(this.volumeCounter) || 0;
    this.issueCounter.set(this.volumeCounter, currentIssue + 1);

    const magazine: MagazineIssue = {
      issueId,
      title,
      edition,
      coverPhoto,
      coverStory,
      experiences,
      publishDate: new Date(),
      volume: this.volumeCounter,
      issue: currentIssue + 1,
      featured: false
    };

    // Mark captures as published
    experiences.forEach(exp => {
      exp.published = true;
      exp.magazineId = issueId;
    });

    this.magazines.set(issueId, magazine);

    console.log(`📖 Magazine created: ${title} Vol.${magazine.volume} Issue ${magazine.issue}`);

    return magazine;
  }

  /**
   * Hostess offers magazine to guest
   */
  hostessOfferMagazine(
    hostessId: string,
    hostessName: string,
    guestId: string,
    guestName: string,
    magazineId: string,
    personalNote: string
  ): HostessMagazineOffer {
    const magazine = this.magazines.get(magazineId);
    
    if (!magazine) {
      throw new Error('Magazine not found');
    }

    if (magazine.edition !== 'companion-exclusive' && magazine.edition !== 'members-only') {
      throw new Error('Magazine must be members-only or companion-exclusive');
    }

    const offerId = `OFFER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const offer: HostessMagazineOffer = {
      offerId,
      hostessId,
      hostessName,
      guestId,
      guestName,
      magazineIssue: magazine,
      personalNote,
      offerDate: new Date(),
      accepted: false
    };

    this.offers.set(offerId, offer);

    console.log(`💝 ${hostessName} offered magazine to ${guestName}`);

    return offer;
  }

  /**
   * Guest accepts magazine offer
   */
  acceptMagazineOffer(offerId: string): HostessMagazineOffer {
    const offer = this.offers.get(offerId);
    
    if (!offer) {
      throw new Error('Offer not found');
    }

    offer.accepted = true;
    offer.viewedDate = new Date();

    console.log(`✅ ${offer.guestName} accepted magazine from ${offer.hostessName}`);

    return offer;
  }

  /**
   * Get user's captures
   */
  getUserCaptures(userId: string): ExperienceCapture[] {
    return Array.from(this.captures.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get magazines by edition
   */
  getMagazinesByEdition(edition: MagazineEdition): MagazineIssue[] {
    return Array.from(this.magazines.values())
      .filter(m => m.edition === edition)
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  /**
   * Get hostess offers for guest
   */
  getGuestOffers(guestId: string): HostessMagazineOffer[] {
    return Array.from(this.offers.values())
      .filter(o => o.guestId === guestId)
      .sort((a, b) => b.offerDate.getTime() - a.offerDate.getTime());
  }

  /**
   * Update user stats
   */
  private updateStats(userId: string, capture: ExperienceCapture): void {
    let stats = this.userStats.get(userId);

    if (!stats) {
      stats = {
        totalCaptures: 0,
        totalMagazines: 0,
        totalViews: 0,
        averageRating: 0,
        favoriteExperience: 'adventure',
        totalLocations: 0,
        totalCompanions: 0
      };
    }

    stats.totalCaptures++;
    stats.totalCompanions += capture.companions?.length || 0;

    // Recalculate average rating
    const allCaptures = this.getUserCaptures(userId);
    stats.averageRating = allCaptures.reduce((sum, c) => sum + c.rating, 0) / allCaptures.length;

    // Find favorite experience type
    const typeCounts: Record<string, number> = {};
    allCaptures.forEach(c => {
      typeCounts[c.experienceType] = (typeCounts[c.experienceType] || 0) + 1;
    });
    const favorite = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0];
    if (favorite) {
      stats.favoriteExperience = favorite[0] as ExperienceType;
    }

    // Count unique locations
    const locations = new Set(allCaptures.map(c => c.location));
    stats.totalLocations = locations.size;

    this.userStats.set(userId, stats);
  }

  /**
   * Get user stats
   */
  getStats(userId: string): MagazineStats {
    return this.userStats.get(userId) || {
      totalCaptures: 0,
      totalMagazines: 0,
      totalViews: 0,
      averageRating: 0,
      favoriteExperience: 'adventure',
      totalLocations: 0,
      totalCompanions: 0
    };
  }

  /**
   * Generate magazine preview
   */
  generateMagazinePreview(magazine: MagazineIssue): string {
    const editionBadge = this.getEditionBadge(magazine.edition);
    
    return `
╔════════════════════════════════════════════════════════════════╗
║            ${editionBadge}                                      
╠════════════════════════════════════════════════════════════════╣
║
║  ${magazine.title}
║  Volume ${magazine.volume}, Issue ${magazine.issue}
║  Published: ${magazine.publishDate.toLocaleDateString()}
║
║  COVER STORY:
║  ${magazine.coverStory}
║
║  FEATURED EXPERIENCES (${magazine.experiences.length}):
${magazine.experiences.map(e => `║  • ${e.title} - ${e.location} ⭐${e.rating}`).join('\n')}
║
║  EDITION: ${magazine.edition.toUpperCase().replace('-', ' ')}
║
╚════════════════════════════════════════════════════════════════╝
`;
  }

  /**
   * Get edition badge
   */
  private getEditionBadge(edition: MagazineEdition): string {
    switch (edition) {
      case 'public': return '📖 PUBLIC EDITION';
      case 'members-only': return '🎫 MEMBERS ONLY';
      case 'private': return '🔒 PRIVATE COLLECTION';
      case 'companion-exclusive': return '💝 COMPANION EXCLUSIVE';
    }
  }

  /**
   * Generate hostess offer message
   */
  generateOfferMessage(offer: HostessMagazineOffer): string {
    return `
╔════════════════════════════════════════════════════════════════╗
║               💝 SPECIAL MAGAZINE OFFER                        ║
╠════════════════════════════════════════════════════════════════╣
║
║  FROM: ${offer.hostessName}
║  TO: ${offer.guestName}
║
║  MAGAZINE: ${offer.magazineIssue.title}
║  Volume ${offer.magazineIssue.volume}, Issue ${offer.magazineIssue.issue}
║
║  PERSONAL NOTE:
║  "${offer.personalNote}"
║
║  EXPERIENCES INCLUDED: ${offer.magazineIssue.experiences.length}
║  EDITION: ${this.getEditionBadge(offer.magazineIssue.edition)}
║
║  ${offer.accepted ? '✅ ACCEPTED' : '📬 AWAITING RESPONSE'}
║
╚════════════════════════════════════════════════════════════════╝
`;
  }
}

/**
 * Pre-configured magazine templates
 */
export const MAGAZINE_TEMPLATES = {
  safari: {
    type: 'safari' as ExperienceType,
    suggestedTitle: 'Wild Encounters',
    suggestedHighlights: [
      'Big Five sighting',
      'Luxury tented camp',
      'Sunrise game drive',
      'Bush dinner under stars',
      'Professional photography'
    ]
  },
  
  yacht: {
    type: 'yacht' as ExperienceType,
    suggestedTitle: 'Blue Water Dreams',
    suggestedHighlights: [
      'Private yacht charter',
      'Island hopping',
      'Water sports',
      'Gourmet dining onboard',
      'Sunset cocktails'
    ]
  },

  escape: {
    type: 'escape' as ExperienceType,
    suggestedTitle: 'Hidden Paradise',
    suggestedHighlights: [
      'Secluded location',
      '5-star accommodations',
      'Spa treatments',
      'Fine dining',
      'Complete privacy'
    ]
  },

  adventure: {
    type: 'adventure' as ExperienceType,
    suggestedTitle: 'Adrenaline Rush',
    suggestedHighlights: [
      'Thrilling activities',
      'Expert guides',
      'Safety first',
      'Memorable moments',
      'Story-worthy experiences'
    ]
  },

  romantic: {
    type: 'romantic' as ExperienceType,
    suggestedTitle: 'Romantic Getaway',
    suggestedHighlights: [
      'Intimate setting',
      'Private dining',
      'Couples activities',
      'Luxurious accommodations',
      'Unforgettable memories'
    ]
  }
};

/**
 * Global magazine system instance
 */
export const magazineSystem = new MagazineCaptureSystem();

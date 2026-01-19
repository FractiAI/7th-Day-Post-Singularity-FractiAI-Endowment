/**
 * Vibeathon System - SNAP #13
 * Complete social vibing and promotional infrastructure
 * Octave 13: Higher Infinity 3 - Social Vibing Architecture
 * 
 * Enhanced with SNAP #18: Calendar Invitation & Reminder System
 */

import { calendarInvitationSystem } from './calendar-invitation-system.js';

// ========== SNAP 13.1: VIBEATHON TYPES & INTERFACES ==========

export type VibeathonType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type ExperienceSkin = 
  | 'CHILL'           // Relaxed, low-key
  | 'HIGH_ENERGY'     // Exciting, dynamic
  | 'CREATIVE'        // Studio, creation focus
  | 'CONSCIOUSNESS'   // Meditation, deep dive
  | 'SOCIAL'          // Networking, connection
  | 'COMPETITION'     // Challenge, leaderboards
  | 'LEARNING'        // Educational, skills
  | 'FESTIVAL';       // Celebration, party

export interface Vibeathon {
  id: string;
  title: string;
  type: VibeathonType;
  theme: string;
  college: string;
  
  // Timing
  startTime: Date;
  endTime: Date;
  duration: number; // hours
  recurrence: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  timezone: string;
  
  // Details
  description: string;
  activities: string[];
  learningObjectives: string[];
  
  // People
  organizers: string[];
  heroHosts: string[];          // Featured AI Hero Hosts
  specialGuests: string[];      // Guest speakers/facilitators
  
  // Requirements
  intensity: number;            // 1-5 ⚡
  tierRequired: 'SANDBOX' | 'CLOUD' | 'SHELL' | 'ALL';
  prerequisites: string[];
  safetyBriefingRequired: boolean;
  
  // Capacity
  maxParticipants: number;
  minParticipants: number;
  currentRegistrations: number;
  waitlist: string[];
  
  // Location
  physicalLocation: string;
  fsrChamber: string;
  virtualLink: string;
  hybridMode: boolean;
  
  // Experience
  experienceSkins: ExperienceSkin[];
  defaultSkin: ExperienceSkin;
  skinCanChange: boolean;
  
  // Social
  allowGuestInvites: boolean;
  teamFormation: boolean;
  networking: boolean;
  
  // Outcomes
  certificationCredits: number;
  achievementBadges: string[];
  portfolioItems: boolean;
  
  // Media
  bannerImage: string;
  promotionalVideo: string;
  pastPhotos: string[];
  
  // Metrics
  previousRating: number;       // 0-5
  previousAttendance: number;
  repeatAttendeeRate: number;   // percentage
  
  // Status
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

// ========== SNAP 13.2: REGISTRATION INTERFACES ==========

export interface VibeathonRegistration {
  id: string;
  vibeathonId: string;
  studentId: string;
  studentName: string;
  
  // Registration details
  registeredAt: Date;
  status: 'CONFIRMED' | 'WAITLIST' | 'CANCELLED' | 'ATTENDED' | 'NO_SHOW';
  confirmationCode: string;
  
  // Preferences
  experienceSkin: ExperienceSkin;
  attendanceMode: 'PHYSICAL' | 'FSR' | 'VIRTUAL' | 'HYBRID';
  accessibilityNeeds: string[];
  dietaryRestrictions: string[];
  
  // Social
  invitedBy: string;
  bringingGuests: number;
  teamPreference: 'SOLO' | 'RANDOM' | 'FRIENDS' | 'SPECIFIC';
  specificTeammates: string[];
  
  // Preparation
  safetyBriefingCompleted: boolean;
  prerequisitesConfirmed: boolean;
  intentionSet: string;
  questionsForOrganizers: string;
  
  // Post-event
  checkInTime?: Date;
  checkOutTime?: Date;
  attended: boolean;
  rating: number;               // 0-5
  testimonial: string;
  projectsCreated: string[];
  connectionsMade: string[];
  wouldRecommend: boolean;
  
  // Notifications
  remindersSent: number;
  lastReminderSent?: Date;
}

// ========== SNAP 13.3: PROMOTIONAL INTERFACES ==========

export type BannerType = 'HERO' | 'SIDEBAR' | 'NOTIFICATION' | 'POPUP' | 'EMAIL' | 'PHYSICAL' | 'FSR';

export interface PromotionalBanner {
  id: string;
  vibeathonId: string;
  campaignId: string;
  
  // Banner details
  type: BannerType;
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
  buttonText: string;
  
  // Visuals
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  animation: string;
  fontStyle: string;
  
  // Targeting
  targetAudience: string[];
  targetColleges: string[];
  targetCertificationLevels: string[];
  targetInterests: string[];
  
  // Scheduling
  startDate: Date;
  endDate: Date;
  priority: number;             // 1-10, higher = more prominent
  frequency: string;            // How often to show
  
  // Performance
  impressions: number;
  clicks: number;
  conversions: number;          // Registrations from this banner
  ctr: number;                  // Click-through rate
  conversionRate: number;
  
  // Status
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionalCampaign {
  id: string;
  name: string;
  vibeathonIds: string[];
  
  // Campaign details
  type: 'EVERGREEN' | 'SEASONAL' | 'TRIGGERED' | 'ONE_TIME';
  goal: string;
  targetRegistrations: number;
  budget: number;
  
  // Timing
  startDate: Date;
  endDate: Date;
  
  // Channels
  banners: PromotionalBanner[];
  emails: any[];               // Email campaigns
  socialPosts: any[];          // Social media posts
  
  // Performance
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  roi: number;
  
  // Status
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

// ========== SNAP 13.4: CONSOLE INTERFACES ==========

export interface ConsoleView {
  viewType: 'DASHBOARD' | 'CALENDAR' | 'MY_EVENTS' | 'DISCOVER' | 'CREATE' | 'ANALYTICS';
  filters: ConsoleFilters;
  data: any;
}

export interface ConsoleFilters {
  timeRange: 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'NEXT_30_DAYS' | 'ALL';
  types: VibeathonType[];
  colleges: string[];
  themes: string[];
  intensities: number[];
  tiers: string[];
  onlyMyRegistrations: boolean;
  onlyAvailable: boolean;
}

export interface Navigator {
  type: 'TIME' | 'THEME' | 'COLLEGE' | 'INTENSITY' | 'SOCIAL';
  currentSelection: any;
  options: any[];
}

// ========== MAIN VIBEATHON SYSTEM CLASS ==========

export class VibeathonSystem {
  private vibeathons: Map<string, Vibeathon> = new Map();
  private registrations: Map<string, VibeathonRegistration[]> = new Map();
  private promotions: Map<string, PromotionalBanner> = new Map();
  private campaigns: Map<string, PromotionalCampaign> = new Map();
  
  constructor() {
    console.log('🎉 Vibeathon System Initializing...');
    console.log('   SNAP #13: Social Vibing & Promotional Architecture');
    console.log('   Octave 13: Higher Infinity 3');
    this.initializeSampleVibeathons();
  }
  
  // ========== SNAP 13.1: VIBEATHON CREATION & MANAGEMENT ==========
  
  async createVibeathon(data: Partial<Vibeathon>): Promise<Vibeathon> {
    const now = new Date();
    
    const vibeathon: Vibeathon = {
      id: `VIB-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: data.title || 'New Vibeathon',
      type: data.type || 'WEEKLY',
      theme: data.theme || 'General Vibing',
      college: data.college || 'ALL',
      startTime: data.startTime || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endTime: data.endTime || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      duration: data.duration || 6,
      recurrence: data.recurrence || 'ONCE',
      timezone: data.timezone || 'America/Los_Angeles',
      description: data.description || 'Join us for an amazing vibing experience!',
      activities: data.activities || ['Collective meditation', 'FSR exploration', 'Creative jam session'],
      learningObjectives: data.learningObjectives || [],
      organizers: data.organizers || ['Vibeathon Crew'],
      heroHosts: data.heroHosts || [],
      specialGuests: data.specialGuests || [],
      intensity: data.intensity || 2,
      tierRequired: data.tierRequired || 'ALL',
      prerequisites: data.prerequisites || [],
      safetyBriefingRequired: data.safetyBriefingRequired || false,
      maxParticipants: data.maxParticipants || 100,
      minParticipants: data.minParticipants || 5,
      currentRegistrations: 0,
      waitlist: [],
      physicalLocation: data.physicalLocation || 'Lecture Hall',
      fsrChamber: data.fsrChamber || 'Chamber 1',
      virtualLink: data.virtualLink || 'https://vibeathon.nspfrnp.ai/live',
      hybridMode: data.hybridMode !== undefined ? data.hybridMode : true,
      experienceSkins: data.experienceSkins || ['SOCIAL', 'CHILL', 'HIGH_ENERGY'],
      defaultSkin: data.defaultSkin || 'SOCIAL',
      skinCanChange: true,
      allowGuestInvites: data.allowGuestInvites !== undefined ? data.allowGuestInvites : true,
      teamFormation: data.teamFormation !== undefined ? data.teamFormation : true,
      networking: data.networking !== undefined ? data.networking : true,
      certificationCredits: data.certificationCredits || 0,
      achievementBadges: data.achievementBadges || [],
      portfolioItems: data.portfolioItems || false,
      bannerImage: data.bannerImage || '/images/vibeathon-default.jpg',
      promotionalVideo: data.promotionalVideo || '',
      pastPhotos: data.pastPhotos || [],
      previousRating: 0,
      previousAttendance: 0,
      repeatAttendeeRate: 0,
      status: 'PUBLISHED',
      createdAt: now,
      updatedAt: now
    };
    
    this.vibeathons.set(vibeathon.id, vibeathon);
    
    console.log(`✅ Vibeathon created: ${vibeathon.title}`);
    console.log(`   Type: ${vibeathon.type}`);
    console.log(`   When: ${vibeathon.startTime.toLocaleDateString()} at ${vibeathon.startTime.toLocaleTimeString()}`);
    console.log(`   Duration: ${vibeathon.duration} hours`);
    console.log(`   Intensity: ${'⚡'.repeat(vibeathon.intensity)}`);
    console.log(`   Capacity: ${vibeathon.maxParticipants} people`);
    
    // Auto-create promotional campaign
    await this.createPromotionalCampaign(vibeathon);
    
    return vibeathon;
  }
  
  getVibeathon(id: string): Vibeathon | undefined {
    return this.vibeathons.get(id);
  }
  
  listVibeathons(filters?: Partial<ConsoleFilters>): Vibeathon[] {
    let vibeathons = Array.from(this.vibeathons.values());
    
    if (filters) {
      if (filters.types && filters.types.length > 0) {
        vibeathons = vibeathons.filter(v => filters.types!.includes(v.type));
      }
      if (filters.colleges && filters.colleges.length > 0) {
        vibeathons = vibeathons.filter(v => 
          v.college === 'ALL' || filters.colleges!.includes(v.college)
        );
      }
      if (filters.intensities && filters.intensities.length > 0) {
        vibeathons = vibeathons.filter(v => filters.intensities!.includes(v.intensity));
      }
      if (filters.onlyAvailable) {
        vibeathons = vibeathons.filter(v => 
          v.currentRegistrations < v.maxParticipants && v.startTime > new Date()
        );
      }
    }
    
    return vibeathons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }
  
  // ========== SNAP 13.2: REGISTRATION SYSTEM ==========
  
  async register(
    vibeathonId: string,
    studentId: string,
    studentName: string,
    preferences?: Partial<VibeathonRegistration>
  ): Promise<VibeathonRegistration> {
    const vibeathon = this.vibeathons.get(vibeathonId);
    if (!vibeathon) {
      throw new Error('Vibeathon not found');
    }
    
    if (vibeathon.status !== 'PUBLISHED') {
      throw new Error('Vibeathon is not open for registration');
    }
    
    // Check if already registered
    const existingRegs = this.registrations.get(vibeathonId) || [];
    if (existingRegs.some(r => r.studentId === studentId && r.status !== 'CANCELLED')) {
      throw new Error('Already registered for this vibeathon');
    }
    
    // Check capacity
    const spotsRemaining = vibeathon.maxParticipants - vibeathon.currentRegistrations;
    const status = spotsRemaining > 0 ? 'CONFIRMED' : 'WAITLIST';
    
    const registration: VibeathonRegistration = {
      id: `REG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      vibeathonId,
      studentId,
      studentName,
      registeredAt: new Date(),
      status,
      confirmationCode: this.generateConfirmationCode(),
      experienceSkin: preferences?.experienceSkin || vibeathon.defaultSkin,
      attendanceMode: preferences?.attendanceMode || 'HYBRID',
      accessibilityNeeds: preferences?.accessibilityNeeds || [],
      dietaryRestrictions: preferences?.dietaryRestrictions || [],
      invitedBy: preferences?.invitedBy || '',
      bringingGuests: preferences?.bringingGuests || 0,
      teamPreference: preferences?.teamPreference || 'RANDOM',
      specificTeammates: preferences?.specificTeammates || [],
      safetyBriefingCompleted: !vibeathon.safetyBriefingRequired,
      prerequisitesConfirmed: vibeathon.prerequisites.length === 0,
      intentionSet: preferences?.intentionSet || '',
      questionsForOrganizers: preferences?.questionsForOrganizers || '',
      attended: false,
      rating: 0,
      testimonial: '',
      projectsCreated: [],
      connectionsMade: [],
      wouldRecommend: false,
      remindersSent: 0
    };
    
    // Store registration
    if (!this.registrations.has(vibeathonId)) {
      this.registrations.set(vibeathonId, []);
    }
    this.registrations.get(vibeathonId)!.push(registration);
    
    // Update vibeathon
    if (status === 'CONFIRMED') {
      vibeathon.currentRegistrations++;
    } else {
      vibeathon.waitlist.push(studentId);
    }
    vibeathon.updatedAt = new Date();
    
    console.log(`✅ Registration ${status}: ${vibeathon.title}`);
    console.log(`   Student: ${studentName}`);
    console.log(`   Confirmation: ${registration.confirmationCode}`);
    console.log(`   Skin: ${registration.experienceSkin}`);
    console.log(`   Spots remaining: ${spotsRemaining > 0 ? spotsRemaining - 1 : 0} (Waitlist: ${vibeathon.waitlist.length})`);
    
    // Send confirmation
    await this.sendConfirmation(registration, vibeathon);
    
    // Update banner conversion
    await this.trackConversion(vibeathonId);
    
    // SNAP #18: Generate calendar invitation & create reminder schedule
    try {
      console.log(`📅 Generating calendar invitation & reminders...`);
      
      // Generate calendar invitation (iCal, Google, Outlook, Apple)
      const invitation = await calendarInvitationSystem.generateInvitation(
        vibeathon,
        registration
      );
      
      // Create automated reminder schedule (1 week, 1 day, 1 hour, 15 min)
      const reminders = await calendarInvitationSystem.createReminderSchedule(
        vibeathon,
        registration,
        ['1WEEK', '1DAY', '1HOUR', '15MIN']
      );
      
      console.log(`✅ Calendar & reminders configured!`);
      console.log(`   Calendar invitation: ${invitation.id}`);
      console.log(`   Reminders scheduled: ${reminders.length}`);
    } catch (error) {
      console.error(`⚠️ Calendar/reminder setup failed (non-critical):`, error);
      // Continue even if calendar setup fails
    }
    
    return registration;
  }
  
  getMyRegistrations(studentId: string): VibeathonRegistration[] {
    const allRegistrations: VibeathonRegistration[] = [];
    
    for (const registrations of this.registrations.values()) {
      allRegistrations.push(...registrations.filter(r => r.studentId === studentId));
    }
    
    return allRegistrations.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
  }
  
  // ========== SNAP 13.3: PROMOTIONAL SYSTEM ==========
  
  async createPromotionalCampaign(vibeathon: Vibeathon): Promise<PromotionalCampaign> {
    const campaign: PromotionalCampaign = {
      id: `CAMP-${vibeathon.id}`,
      name: `${vibeathon.title} Campaign`,
      vibeathonIds: [vibeathon.id],
      type: vibeathon.recurrence === 'ONCE' ? 'ONE_TIME' : 'EVERGREEN',
      goal: `${vibeathon.maxParticipants} registrations`,
      targetRegistrations: vibeathon.maxParticipants,
      budget: 0, // Free promotional system
      startDate: new Date(vibeathon.startTime.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks before
      endDate: vibeathon.startTime,
      banners: [],
      emails: [],
      socialPosts: [],
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpend: 0,
      roi: 0,
      status: 'ACTIVE'
    };
    
    this.campaigns.set(campaign.id, campaign);
    
    // Create banners for all types
    const bannerTypes: BannerType[] = ['HERO', 'SIDEBAR', 'NOTIFICATION'];
    for (const type of bannerTypes) {
      const banner = await this.createBanner(vibeathon, type, campaign.id);
      campaign.banners.push(banner);
    }
    
    console.log(`📢 Campaign created: ${campaign.name}`);
    console.log(`   Banners: ${campaign.banners.length}`);
    console.log(`   Running: ${campaign.startDate.toLocaleDateString()} - ${campaign.endDate.toLocaleDateString()}`);
    
    return campaign;
  }
  
  async createBanner(
    vibeathon: Vibeathon,
    type: BannerType,
    campaignId: string
  ): Promise<PromotionalBanner> {
    const banner: PromotionalBanner = {
      id: `BANNER-${Date.now()}-${type}`,
      vibeathonId: vibeathon.id,
      campaignId,
      type,
      title: vibeathon.title,
      subtitle: this.generateSubtitle(vibeathon),
      description: vibeathon.description,
      callToAction: this.generateCTA(vibeathon),
      buttonText: this.getButtonText(vibeathon.type),
      backgroundImage: vibeathon.bannerImage,
      primaryColor: this.getColorForTheme(vibeathon.theme),
      secondaryColor: '#00ffff',
      animation: type === 'POPUP' ? 'zoom-in' : 'fade-in',
      fontStyle: 'bold',
      targetAudience: ['ALL'],
      targetColleges: vibeathon.college === 'ALL' ? 
        ['BHEP', 'SHC', 'INP', 'AFSR', 'CAS', 'DCE'] : [vibeathon.college],
      targetCertificationLevels: this.getTargetLevels(vibeathon.tierRequired),
      targetInterests: [vibeathon.theme],
      startDate: new Date(vibeathon.startTime.getTime() - 14 * 24 * 60 * 60 * 1000),
      endDate: vibeathon.startTime,
      priority: this.getPriority(vibeathon.type),
      frequency: this.getFrequency(type),
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      conversionRate: 0,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.promotions.set(banner.id, banner);
    
    console.log(`   📌 Banner created: ${type} - ${banner.title}`);
    
    return banner;
  }
  
  getActiveBanners(location: BannerType): PromotionalBanner[] {
    const now = new Date();
    return Array.from(this.promotions.values())
      .filter(b => 
        b.type === location &&
        b.active &&
        b.startDate <= now &&
        b.endDate >= now
      )
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3); // Top 3 banners
  }
  
  async trackImpression(bannerId: string): Promise<void> {
    const banner = this.promotions.get(bannerId);
    if (banner) {
      banner.impressions++;
      banner.updatedAt = new Date();
    }
  }
  
  async trackClick(bannerId: string): Promise<void> {
    const banner = this.promotions.get(bannerId);
    if (banner) {
      banner.clicks++;
      banner.ctr = (banner.clicks / banner.impressions) * 100;
      banner.updatedAt = new Date();
      console.log(`🖱️ Banner clicked: ${banner.title} (CTR: ${banner.ctr.toFixed(2)}%)`);
    }
  }
  
  async trackConversion(vibeathonId: string): Promise<void> {
    // Find all banners for this vibeathon
    const banners = Array.from(this.promotions.values())
      .filter(b => b.vibeathonId === vibeathonId);
    
    for (const banner of banners) {
      banner.conversions++;
      if (banner.impressions > 0) {
        banner.conversionRate = (banner.conversions / banner.impressions) * 100;
      }
      banner.updatedAt = new Date();
    }
  }
  
  // ========== SNAP 13.4: CONSOLE VIEWS ==========
  
  getConsoleView(studentId: string, viewType: string = 'DASHBOARD'): any {
    const now = new Date();
    
    switch (viewType) {
      case 'DASHBOARD':
        return this.getDashboardView(studentId, now);
      case 'CALENDAR':
        return this.getCalendarView(now);
      case 'MY_EVENTS':
        return this.getMyEventsView(studentId);
      case 'DISCOVER':
        return this.getDiscoverView(studentId);
      default:
        return this.getDashboardView(studentId, now);
    }
  }
  
  private getDashboardView(studentId: string, now: Date) {
    const upcomingVibeathons = Array.from(this.vibeathons.values())
      .filter(v => v.startTime > now && v.status === 'PUBLISHED')
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 10);
    
    const happeningNow = Array.from(this.vibeathons.values())
      .filter(v => v.startTime <= now && v.endTime >= now && v.status === 'ACTIVE');
    
    const myRegistrations = this.getMyRegistrations(studentId)
      .filter(r => {
        const vib = this.vibeathons.get(r.vibeathonId);
        return vib && vib.startTime > now;
      })
      .slice(0, 5);
    
    return {
      upcomingVibeathons,
      happeningNow,
      myRegistrations,
      recommendations: this.getRecommendations(studentId, now),
      stats: this.getUserStats(studentId),
      activeBanners: this.getActiveBanners('HERO')
    };
  }
  
  private getCalendarView(now: Date) {
    // Next 30 days of vibeathons
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const vibeathons = Array.from(this.vibeathons.values())
      .filter(v => v.startTime >= now && v.startTime <= endDate && v.status === 'PUBLISHED')
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    return {
      startDate: now,
      endDate,
      vibeathons,
      dailyEvents: this.groupByDay(vibeathons)
    };
  }
  
  private getMyEventsView(studentId: string) {
    const registrations = this.getMyRegistrations(studentId);
    const upcoming = registrations.filter(r => {
      const vib = this.vibeathons.get(r.vibeathonId);
      return vib && vib.startTime > new Date();
    });
    const past = registrations.filter(r => {
      const vib = this.vibeathons.get(r.vibeathonId);
      return vib && vib.endTime < new Date();
    });
    
    return {
      upcoming,
      past,
      stats: this.getUserStats(studentId)
    };
  }
  
  private getDiscoverView(studentId: string) {
    const now = new Date();
    const allVibeathons = Array.from(this.vibeathons.values())
      .filter(v => v.startTime > now && v.status === 'PUBLISHED');
    
    return {
      featured: allVibeathons.filter(v => v.type === 'QUARTERLY' || v.type === 'ANNUAL'),
      byType: this.groupByType(allVibeathons),
      byTheme: this.groupByTheme(allVibeathons),
      byCollege: this.groupByCollege(allVibeathons)
    };
  }
  
  private getUserStats(studentId: string): any {
    const registrations = this.getMyRegistrations(studentId);
    const attended = registrations.filter(r => r.attended);
    
    return {
      totalRegistered: registrations.length,
      totalAttended: attended.length,
      hoursVibed: attended.reduce((sum, r) => {
        const vib = this.vibeathons.get(r.vibeathonId);
        return sum + (vib?.duration || 0);
      }, 0),
      connectionsMade: new Set(
        attended.flatMap(r => r.connectionsMade)
      ).size,
      averageRating: attended.length > 0 ?
        attended.reduce((sum, r) => sum + r.rating, 0) / attended.length : 0
    };
  }
  
  private getRecommendations(studentId: string, now: Date): Vibeathon[] {
    // Simple recommendation: upcoming vibeathons not yet registered
    const myRegistrations = new Set(
      this.getMyRegistrations(studentId).map(r => r.vibeathonId)
    );
    
    return Array.from(this.vibeathons.values())
      .filter(v => 
        v.startTime > now &&
        v.status === 'PUBLISHED' &&
        !myRegistrations.has(v.id)
      )
      .slice(0, 3);
  }
  
  // ========== HELPER METHODS ==========
  
  private generateConfirmationCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  
  private generateSubtitle(vibeathon: Vibeathon): string {
    const date = vibeathon.startTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    const time = vibeathon.startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    return `${date} at ${time} | ${vibeathon.duration}hrs | ${vibeathon.physicalLocation}`;
  }
  
  private generateCTA(vibeathon: Vibeathon): string {
    const spotsRemaining = vibeathon.maxParticipants - vibeathon.currentRegistrations;
    
    if (spotsRemaining === 0) {
      return 'Join waitlist - Event is full';
    }
    if (spotsRemaining < 10) {
      return `Only ${spotsRemaining} spots left! Register now`;
    }
    if (vibeathon.type === 'ANNUAL' || vibeathon.type === 'QUARTERLY') {
      return 'Apply now - Limited spots available';
    }
    return `Register now - ${spotsRemaining} spots available`;
  }
  
  private getButtonText(type: VibeathonType): string {
    switch (type) {
      case 'DAILY': return 'Join Now';
      case 'WEEKLY': return 'Register';
      case 'MONTHLY': return 'RSVP';
      case 'QUARTERLY': return 'Apply';
      case 'ANNUAL': return 'Apply Now';
      default: return 'Register';
    }
  }
  
  private getColorForTheme(theme: string): string {
    const colors: Record<string, string> = {
      'Black Hole Energy': '#ff00ff',
      'Consciousness': '#00ffff',
      'FSR Creation': '#ffff00',
      'Natural Protocol': '#00ff00',
      'Holographic': '#ff0088',
      'System Design': '#0088ff'
    };
    return colors[theme] || '#00ffff';
  }
  
  private getTargetLevels(tier: string): string[] {
    switch (tier) {
      case 'SHELL':
        return ['MASTER', 'FELLOW'];
      case 'CLOUD':
        return ['GP', 'SPECIALIST', 'MASTER', 'FELLOW'];
      case 'SANDBOX':
      case 'ALL':
      default:
        return ['ASSISTANT', 'GP', 'SPECIALIST', 'MASTER', 'FELLOW'];
    }
  }
  
  private getPriority(type: VibeathonType): number {
    const priorities = {
      ANNUAL: 10,
      QUARTERLY: 8,
      MONTHLY: 6,
      WEEKLY: 4,
      DAILY: 2
    };
    return priorities[type];
  }
  
  private getFrequency(type: BannerType): string {
    switch (type) {
      case 'HERO': return 'Always visible';
      case 'SIDEBAR': return 'Always visible';
      case 'NOTIFICATION': return 'Once per day';
      case 'POPUP': return 'Once per visit';
      default: return 'Variable';
    }
  }
  
  private groupByDay(vibeathons: Vibeathon[]): Record<string, Vibeathon[]> {
    const grouped: Record<string, Vibeathon[]> = {};
    
    for (const vib of vibeathons) {
      const dateKey = vib.startTime.toLocaleDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(vib);
    }
    
    return grouped;
  }
  
  private groupByType(vibeathons: Vibeathon[]): Record<VibeathonType, Vibeathon[]> {
    const grouped: any = {};
    for (const vib of vibeathons) {
      if (!grouped[vib.type]) {
        grouped[vib.type] = [];
      }
      grouped[vib.type].push(vib);
    }
    return grouped;
  }
  
  private groupByTheme(vibeathons: Vibeathon[]): Record<string, Vibeathon[]> {
    const grouped: Record<string, Vibeathon[]> = {};
    for (const vib of vibeathons) {
      if (!grouped[vib.theme]) {
        grouped[vib.theme] = [];
      }
      grouped[vib.theme].push(vib);
    }
    return grouped;
  }
  
  private groupByCollege(vibeathons: Vibeathon[]): Record<string, Vibeathon[]> {
    const grouped: Record<string, Vibeathon[]> = {};
    for (const vib of vibeathons) {
      if (!grouped[vib.college]) {
        grouped[vib.college] = [];
      }
      grouped[vib.college].push(vib);
    }
    return grouped;
  }
  
  private async sendConfirmation(
    registration: VibeathonRegistration,
    vibeathon: Vibeathon
  ): Promise<void> {
    console.log(`📧 Confirmation email sent to ${registration.studentName}`);
    console.log(`   Confirmation code: ${registration.confirmationCode}`);
    // Email sending logic would go here
  }
  
  private initializeSampleVibeathons(): void {
    // Create sample vibeathons for demonstration
    const now = new Date();
    
    // Daily vibeathon (today)
    this.createVibeathon({
      title: 'Morning Vibe - Start Your Day Right',
      type: 'DAILY',
      theme: 'Consciousness',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
      duration: 1,
      intensity: 1,
      maxParticipants: 50,
      experienceSkins: ['CHILL', 'CONSCIOUSNESS']
    });
    
    // Weekly vibeathon (Saturday)
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + (6 - now.getDay()));
    saturday.setHours(14, 0, 0);
    
    this.createVibeathon({
      title: 'Black Hole Energy Jam Session',
      type: 'WEEKLY',
      theme: 'Black Hole Energy',
      college: 'BHEP',
      startTime: saturday,
      endTime: new Date(saturday.getTime() + 6 * 60 * 60 * 1000),
      duration: 6,
      intensity: 3,
      maxParticipants: 100,
      experienceSkins: ['HIGH_ENERGY', 'CREATIVE', 'LEARNING']
    });
  }
}

// Export singleton
export const vibeathonSystem = new VibeathonSystem();

// CLI testing
if (require.main === module) {
  (async () => {
    console.log('🎉 Testing Vibeathon System...\n');
    
    // Test registration
    const vibeathons = vibeathonSystem.listVibeathons();
    if (vibeathons.length > 0) {
      const vib = vibeathons[0];
      console.log(`\nRegistering for: ${vib.title}\n`);
      
      const registration = await vibeathonSystem.register(
        vib.id,
        'STU-TEST-123',
        'Test Student',
        {
          experienceSkin: 'SOCIAL',
          attendanceMode: 'HYBRID'
        }
      );
      
      console.log(`\n✅ Registration complete!`);
      console.log(`   Confirmation: ${registration.confirmationCode}`);
    }
    
    // Test console view
    console.log(`\n--- Dashboard View ---`);
    const dashboard = vibeathonSystem.getConsoleView('STU-TEST-123', 'DASHBOARD');
    console.log(`   Upcoming: ${dashboard.upcomingVibeathons.length}`);
    console.log(`   Live now: ${dashboard.happeningNow.length}`);
    console.log(`   My registrations: ${dashboard.myRegistrations.length}`);
    console.log(`   Active banners: ${dashboard.activeBanners.length}`);
  })();
}

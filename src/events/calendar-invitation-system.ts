/**
 * Calendar Invitation & Reminder System - SNAP #18
 * Complete calendar integration with invitations and automated reminders
 * Octave 13: Social Infrastructure Enhancement
 */

import type { Vibeathon, VibeathonRegistration } from './vibeathon-system.js';

// ========== SNAP 18.1: CALENDAR INVITATION TYPES ==========

export type CalendarFormat = 'ICAL' | 'GOOGLE' | 'OUTLOOK' | 'APPLE';
export type ReminderTiming = '15MIN' | '1HOUR' | '1DAY' | '1WEEK' | 'CUSTOM';
export type ReminderChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'ALL';

export interface CalendarInvitation {
  id: string;
  vibeathonId: string;
  registrationId: string;
  studentId: string;
  
  // Event details
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  
  // Invitation metadata
  format: CalendarFormat;
  icalContent: string;
  googleCalendarUrl: string;
  outlookUrl: string;
  appleUrl: string;
  
  // Status
  sent: boolean;
  sentAt?: Date;
  addedToCalendar: boolean;
  addedAt?: Date;
  
  // Tracking
  opened: boolean;
  openedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  
  createdAt: Date;
}

export interface ReminderSchedule {
  id: string;
  vibeathonId: string;
  registrationId: string;
  studentId: string;
  
  // Reminder details
  title: string;
  message: string;
  channel: ReminderChannel;
  timing: ReminderTiming;
  customMinutesBefore?: number;
  
  // Schedule
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  
  // Content
  includeJoinLink: boolean;
  includePrepInfo: boolean;
  includeLocationDetails: boolean;
  
  // Actions
  actionButtons: ReminderAction[];
  
  // Tracking
  opened: boolean;
  openedAt?: Date;
  actionTaken?: string;
  actionTakenAt?: Date;
  
  createdAt: Date;
}

export interface ReminderAction {
  id: string;
  label: string;
  action: 'JOIN' | 'RESCHEDULE' | 'CANCEL' | 'ADD_TO_CALENDAR' | 'SHARE' | 'CUSTOM';
  url?: string;
  metadata?: Record<string, any>;
}

export interface EventJoin {
  id: string;
  vibeathonId: string;
  registrationId: string;
  studentId: string;
  studentName: string;
  
  // Join details
  joinedAt: Date;
  joinMethod: 'LINK' | 'QR_CODE' | 'APP' | 'PHYSICAL_CHECKIN';
  joinSource: 'EMAIL' | 'REMINDER' | 'CALENDAR' | 'DASHBOARD' | 'DIRECT';
  
  // Session tracking
  sessionId: string;
  duration?: number; // minutes
  exitedAt?: Date;
  reconnections: number;
  
  // Engagement
  activeMinutes: number;
  interactionScore: number; // 0-100
  
  // Status
  status: 'JOINED' | 'ACTIVE' | 'DISCONNECTED' | 'LEFT' | 'KICKED';
  
  createdAt: Date;
  updatedAt: Date;
}

// ========== SNAP 18.2: CALENDAR INVITATION GENERATOR ==========

export class CalendarInvitationSystem {
  private invitations: Map<string, CalendarInvitation> = new Map();
  private reminders: Map<string, ReminderSchedule> = new Map();
  private joins: Map<string, EventJoin> = new Map();
  private reminderTimers: Map<string, NodeJS.Timeout> = new Map();
  
  constructor() {
    console.log('📅 Calendar Invitation & Reminder System Initializing...');
    console.log('   SNAP #18: Calendar Integration & Automated Reminders');
    console.log('   Octave 13: Social Infrastructure Enhancement');
  }
  
  // ========== CALENDAR INVITATION GENERATION ==========
  
  /**
   * Generate complete calendar invitation for registration
   */
  async generateInvitation(
    vibeathon: Vibeathon,
    registration: VibeathonRegistration
  ): Promise<CalendarInvitation> {
    const id = `CAL-INV-${Date.now()}-${registration.id}`;
    
    // Generate iCal content
    const icalContent = this.generateICalContent(vibeathon, registration);
    
    // Generate calendar URLs
    const googleUrl = this.generateGoogleCalendarUrl(vibeathon);
    const outlookUrl = this.generateOutlookUrl(vibeathon);
    const appleUrl = this.generateAppleCalendarUrl(vibeathon);
    
    const invitation: CalendarInvitation = {
      id,
      vibeathonId: vibeathon.id,
      registrationId: registration.id,
      studentId: registration.studentId,
      eventTitle: vibeathon.title,
      eventDescription: this.formatDescription(vibeathon),
      eventLocation: this.formatLocation(vibeathon, registration),
      startTime: vibeathon.startTime,
      endTime: vibeathon.endTime,
      timezone: vibeathon.timezone,
      format: 'ICAL',
      icalContent,
      googleCalendarUrl: googleUrl,
      outlookUrl,
      appleUrl,
      sent: false,
      addedToCalendar: false,
      opened: false,
      clicked: false,
      createdAt: new Date()
    };
    
    this.invitations.set(id, invitation);
    
    console.log(`📅 Calendar invitation generated: ${vibeathon.title}`);
    console.log(`   Student: ${registration.studentName}`);
    console.log(`   Formats: iCal, Google, Outlook, Apple`);
    
    // Auto-send invitation
    await this.sendInvitation(invitation);
    
    return invitation;
  }
  
  /**
   * Generate iCal format content
   */
  private generateICalContent(
    vibeathon: Vibeathon,
    registration: VibeathonRegistration
  ): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const description = this.formatDescription(vibeathon)
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,');
    
    const location = this.formatLocation(vibeathon, registration)
      .replace(/,/g, '\\,');
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NSPFRNP Vibeathon System//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${vibeathon.id}@nspfrnp.ai
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(vibeathon.startTime)}
DTEND:${formatDate(vibeathon.endTime)}
SUMMARY:${vibeathon.title}
DESCRIPTION:${description}\\n\\nConfirmation: ${registration.confirmationCode}\\n\\nJoin: https://vibeathon.nspfrnp.ai/join/${vibeathon.id}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
ORGANIZER:CN=Vibeathon Crew:mailto:vibeathons@nspfrnp.ai
ATTENDEE;CN=${registration.studentName};RSVP=TRUE:mailto:student@nspfrnp.ai
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: ${vibeathon.title} starts in 1 hour
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${vibeathon.title} starts tomorrow
END:VALARM
END:VEVENT
END:VCALENDAR`;
  }
  
  /**
   * Generate Google Calendar URL
   */
  private generateGoogleCalendarUrl(vibeathon: Vibeathon): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: vibeathon.title,
      dates: `${formatDate(vibeathon.startTime)}/${formatDate(vibeathon.endTime)}`,
      details: this.formatDescription(vibeathon),
      location: vibeathon.physicalLocation,
      ctz: vibeathon.timezone
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
  
  /**
   * Generate Outlook calendar URL
   */
  private generateOutlookUrl(vibeathon: Vibeathon): string {
    const formatDate = (date: Date): string => {
      return date.toISOString();
    };
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: vibeathon.title,
      startdt: formatDate(vibeathon.startTime),
      enddt: formatDate(vibeathon.endTime),
      body: this.formatDescription(vibeathon),
      location: vibeathon.physicalLocation
    });
    
    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
  }
  
  /**
   * Generate Apple Calendar URL
   */
  private generateAppleCalendarUrl(vibeathon: Vibeathon): string {
    // Apple uses webcal:// protocol with iCal file
    return `webcal://vibeathon.nspfrnp.ai/ical/${vibeathon.id}.ics`;
  }
  
  /**
   * Send invitation to student
   */
  async sendInvitation(invitation: CalendarInvitation): Promise<void> {
    invitation.sent = true;
    invitation.sentAt = new Date();
    
    console.log(`📧 Calendar invitation sent`);
    console.log(`   Add to Google: ${invitation.googleCalendarUrl.substring(0, 60)}...`);
    console.log(`   iCal file ready for download`);
    
    // In production, this would send actual email with attachments
  }
  
  // ========== REMINDER SYSTEM ==========
  
  /**
   * Create reminder schedule for registration
   */
  async createReminderSchedule(
    vibeathon: Vibeathon,
    registration: VibeathonRegistration,
    timings: ReminderTiming[] = ['1WEEK', '1DAY', '1HOUR', '15MIN']
  ): Promise<ReminderSchedule[]> {
    const reminders: ReminderSchedule[] = [];
    
    for (const timing of timings) {
      const reminder = await this.scheduleReminder(
        vibeathon,
        registration,
        timing,
        'ALL'
      );
      reminders.push(reminder);
    }
    
    console.log(`⏰ Reminder schedule created: ${reminders.length} reminders`);
    console.log(`   Timings: ${timings.join(', ')}`);
    
    return reminders;
  }
  
  /**
   * Schedule individual reminder
   */
  async scheduleReminder(
    vibeathon: Vibeathon,
    registration: VibeathonRegistration,
    timing: ReminderTiming,
    channel: ReminderChannel = 'ALL'
  ): Promise<ReminderSchedule> {
    const id = `REM-${Date.now()}-${registration.id}-${timing}`;
    
    // Calculate when to send reminder
    const minutesBefore = this.getMinutesBefore(timing);
    const scheduledFor = new Date(vibeathon.startTime.getTime() - minutesBefore * 60 * 1000);
    
    // Create action buttons
    const actionButtons: ReminderAction[] = [
      {
        id: 'join',
        label: 'Join Event',
        action: 'JOIN',
        url: `https://vibeathon.nspfrnp.ai/join/${vibeathon.id}`
      },
      {
        id: 'calendar',
        label: 'Add to Calendar',
        action: 'ADD_TO_CALENDAR'
      },
      {
        id: 'share',
        label: 'Share with Friends',
        action: 'SHARE'
      }
    ];
    
    const reminder: ReminderSchedule = {
      id,
      vibeathonId: vibeathon.id,
      registrationId: registration.id,
      studentId: registration.studentId,
      title: this.getReminderTitle(vibeathon, timing),
      message: this.getReminderMessage(vibeathon, registration, timing),
      channel,
      timing,
      customMinutesBefore: timing === 'CUSTOM' ? minutesBefore : undefined,
      scheduledFor,
      sent: false,
      includeJoinLink: true,
      includePrepInfo: timing === '1DAY' || timing === '1WEEK',
      includeLocationDetails: true,
      actionButtons,
      opened: false,
      createdAt: new Date()
    };
    
    this.reminders.set(id, reminder);
    
    // Set up timer to send reminder
    this.setupReminderTimer(reminder);
    
    console.log(`⏰ Reminder scheduled: ${timing} before event`);
    console.log(`   Will send at: ${scheduledFor.toLocaleString()}`);
    
    return reminder;
  }
  
  /**
   * Set up timer to send reminder
   */
  private setupReminderTimer(reminder: ReminderSchedule): void {
    const now = new Date();
    const delay = reminder.scheduledFor.getTime() - now.getTime();
    
    if (delay > 0) {
      const timer = setTimeout(async () => {
        await this.sendReminder(reminder.id);
      }, delay);
      
      this.reminderTimers.set(reminder.id, timer);
    } else {
      // Reminder time has passed, send immediately
      this.sendReminder(reminder.id);
    }
  }
  
  /**
   * Send reminder to student
   */
  async sendReminder(reminderId: string): Promise<void> {
    const reminder = this.reminders.get(reminderId);
    if (!reminder || reminder.sent) return;
    
    reminder.sent = true;
    reminder.sentAt = new Date();
    
    console.log(`📲 Reminder sent: ${reminder.title}`);
    console.log(`   Channel: ${reminder.channel}`);
    console.log(`   Message: ${reminder.message}`);
    console.log(`   Actions: ${reminder.actionButtons.map(a => a.label).join(', ')}`);
    
    // In production, this would send via email/SMS/push notification
    // For now, log to console
    
    // Clean up timer
    const timer = this.reminderTimers.get(reminderId);
    if (timer) {
      clearTimeout(timer);
      this.reminderTimers.delete(reminderId);
    }
  }
  
  // ========== EVENT JOIN TRACKING ==========
  
  /**
   * Record event join
   */
  async recordJoin(
    vibeathonId: string,
    registrationId: string,
    studentId: string,
    studentName: string,
    joinMethod: EventJoin['joinMethod'] = 'LINK',
    joinSource: EventJoin['joinSource'] = 'DIRECT'
  ): Promise<EventJoin> {
    const id = `JOIN-${Date.now()}-${registrationId}`;
    const sessionId = `SESSION-${Date.now()}`;
    
    const join: EventJoin = {
      id,
      vibeathonId,
      registrationId,
      studentId,
      studentName,
      joinedAt: new Date(),
      joinMethod,
      joinSource,
      sessionId,
      reconnections: 0,
      activeMinutes: 0,
      interactionScore: 0,
      status: 'JOINED',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.joins.set(id, join);
    
    console.log(`🎉 Student joined event!`);
    console.log(`   Student: ${studentName}`);
    console.log(`   Method: ${joinMethod}`);
    console.log(`   Source: ${joinSource}`);
    console.log(`   Session: ${sessionId}`);
    
    return join;
  }
  
  /**
   * Update join status
   */
  async updateJoinStatus(
    joinId: string,
    status: EventJoin['status'],
    metadata?: Partial<EventJoin>
  ): Promise<void> {
    const join = this.joins.get(joinId);
    if (!join) return;
    
    join.status = status;
    join.updatedAt = new Date();
    
    if (metadata?.duration) join.duration = metadata.duration;
    if (metadata?.activeMinutes) join.activeMinutes = metadata.activeMinutes;
    if (metadata?.interactionScore) join.interactionScore = metadata.interactionScore;
    if (metadata?.exitedAt) join.exitedAt = metadata.exitedAt;
    
    console.log(`📊 Join status updated: ${status}`);
    if (join.duration) {
      console.log(`   Duration: ${join.duration} minutes`);
    }
  }
  
  /**
   * Get join statistics for event
   */
  getJoinStats(vibeathonId: string): any {
    const joins = Array.from(this.joins.values())
      .filter(j => j.vibeathonId === vibeathonId);
    
    const byMethod = this.groupBy(joins, 'joinMethod');
    const bySource = this.groupBy(joins, 'joinSource');
    const totalActiveMinutes = joins.reduce((sum, j) => sum + j.activeMinutes, 0);
    const avgInteractionScore = joins.length > 0
      ? joins.reduce((sum, j) => sum + j.interactionScore, 0) / joins.length
      : 0;
    
    return {
      totalJoins: joins.length,
      uniqueStudents: new Set(joins.map(j => j.studentId)).size,
      byMethod,
      bySource,
      totalActiveMinutes,
      avgInteractionScore: avgInteractionScore.toFixed(1),
      currentlyActive: joins.filter(j => j.status === 'ACTIVE').length
    };
  }
  
  // ========== HELPER METHODS ==========
  
  private formatDescription(vibeathon: Vibeathon): string {
    let desc = vibeathon.description + '\n\n';
    
    desc += `📅 ${vibeathon.type} Vibeathon\n`;
    desc += `🎨 Theme: ${vibeathon.theme}\n`;
    desc += `⚡ Intensity: ${'⚡'.repeat(vibeathon.intensity)}\n`;
    desc += `⏱️ Duration: ${vibeathon.duration} hours\n\n`;
    
    if (vibeathon.activities.length > 0) {
      desc += `Activities:\n`;
      vibeathon.activities.forEach(activity => {
        desc += `  • ${activity}\n`;
      });
      desc += '\n';
    }
    
    if (vibeathon.heroHosts.length > 0) {
      desc += `Hero Hosts: ${vibeathon.heroHosts.join(', ')}\n`;
    }
    
    return desc;
  }
  
  private formatLocation(vibeathon: Vibeathon, registration: VibeathonRegistration): string {
    if (registration.attendanceMode === 'PHYSICAL') {
      return vibeathon.physicalLocation;
    } else if (registration.attendanceMode === 'FSR') {
      return `FSR: ${vibeathon.fsrChamber}`;
    } else if (registration.attendanceMode === 'VIRTUAL') {
      return vibeathon.virtualLink;
    } else {
      return `${vibeathon.physicalLocation} (Hybrid)`;
    }
  }
  
  private getMinutesBefore(timing: ReminderTiming): number {
    switch (timing) {
      case '15MIN': return 15;
      case '1HOUR': return 60;
      case '1DAY': return 24 * 60;
      case '1WEEK': return 7 * 24 * 60;
      default: return 60;
    }
  }
  
  private getReminderTitle(vibeathon: Vibeathon, timing: ReminderTiming): string {
    const timeStr = timing === '15MIN' ? '15 minutes' :
                    timing === '1HOUR' ? '1 hour' :
                    timing === '1DAY' ? 'tomorrow' :
                    timing === '1WEEK' ? 'next week' : 'soon';
    
    return `Reminder: ${vibeathon.title} starts ${timeStr}!`;
  }
  
  private getReminderMessage(
    vibeathon: Vibeathon,
    registration: VibeathonRegistration,
    timing: ReminderTiming
  ): string {
    let msg = `Hi ${registration.studentName}! 👋\n\n`;
    
    if (timing === '15MIN') {
      msg += `Your vibeathon "${vibeathon.title}" starts in 15 minutes!\n\n`;
      msg += `⏰ Time to get ready and join now:\n`;
      msg += `🔗 Join link is ready in your dashboard\n\n`;
    } else if (timing === '1HOUR') {
      msg += `Your vibeathon "${vibeathon.title}" starts in 1 hour!\n\n`;
      msg += `📍 Location: ${this.formatLocation(vibeathon, registration)}\n`;
      msg += `🎨 Experience Skin: ${registration.experienceSkin}\n`;
      msg += `⚡ Intensity: ${'⚡'.repeat(vibeathon.intensity)}\n\n`;
    } else if (timing === '1DAY') {
      msg += `Tomorrow is your vibeathon: "${vibeathon.title}"!\n\n`;
      msg += `📅 When: ${vibeathon.startTime.toLocaleString()}\n`;
      msg += `⏱️ Duration: ${vibeathon.duration} hours\n`;
      msg += `📍 Location: ${this.formatLocation(vibeathon, registration)}\n\n`;
      
      if (vibeathon.safetyBriefingRequired && !registration.safetyBriefingCompleted) {
        msg += `⚠️ Please complete safety briefing before joining\n`;
      }
      
      if (vibeathon.prerequisites.length > 0) {
        msg += `📋 Prerequisites: ${vibeathon.prerequisites.join(', ')}\n`;
      }
      msg += '\n';
    } else if (timing === '1WEEK') {
      msg += `Next week is your vibeathon: "${vibeathon.title}"!\n\n`;
      msg += `📅 Date: ${vibeathon.startTime.toLocaleDateString()}\n`;
      msg += `🎨 Theme: ${vibeathon.theme}\n`;
      msg += `🎓 College: ${vibeathon.college}\n\n`;
      msg += `Start preparing and mark your calendar!\n\n`;
    }
    
    msg += `✅ Confirmation: ${registration.confirmationCode}\n`;
    
    return msg;
  }
  
  private groupBy<T>(items: T[], key: keyof T): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const item of items) {
      const value = String(item[key]);
      grouped[value] = (grouped[value] || 0) + 1;
    }
    return grouped;
  }
  
  // ========== CLEANUP ==========
  
  /**
   * Clear all reminder timers (call on shutdown)
   */
  cleanup(): void {
    for (const timer of this.reminderTimers.values()) {
      clearTimeout(timer);
    }
    this.reminderTimers.clear();
    console.log('🧹 Calendar system cleaned up');
  }
}

// Export singleton
export const calendarInvitationSystem = new CalendarInvitationSystem();

// CLI testing
if (require.main === module) {
  (async () => {
    console.log('📅 Testing Calendar Invitation System...\n');
    
    // Mock vibeathon
    const mockVibeathon: any = {
      id: 'VIB-TEST-123',
      title: 'Test Vibeathon',
      type: 'WEEKLY',
      theme: 'Testing',
      college: 'ALL',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      duration: 6,
      timezone: 'America/Los_Angeles',
      description: 'Test vibeathon for calendar system',
      activities: ['Activity 1', 'Activity 2'],
      heroHosts: ['Leonardo da Vinci'],
      physicalLocation: 'Test Hall',
      fsrChamber: 'Chamber 1',
      virtualLink: 'https://test.link'
    };
    
    const mockRegistration: any = {
      id: 'REG-TEST-123',
      studentId: 'STU-TEST-123',
      studentName: 'Test Student',
      confirmationCode: 'ABC123',
      experienceSkin: 'SOCIAL',
      attendanceMode: 'HYBRID'
    };
    
    // Generate invitation
    console.log('--- Generating Calendar Invitation ---\n');
    const invitation = await calendarInvitationSystem.generateInvitation(
      mockVibeathon,
      mockRegistration
    );
    
    console.log('\niCal Content (first 200 chars):');
    console.log(invitation.icalContent.substring(0, 200) + '...\n');
    
    // Create reminder schedule
    console.log('--- Creating Reminder Schedule ---\n');
    const reminders = await calendarInvitationSystem.createReminderSchedule(
      mockVibeathon,
      mockRegistration,
      ['1HOUR', '15MIN']
    );
    
    console.log(`\n✅ Created ${reminders.length} reminders`);
    
    // Record join
    console.log('\n--- Recording Event Join ---\n');
    const join = await calendarInvitationSystem.recordJoin(
      mockVibeathon.id,
      mockRegistration.id,
      mockRegistration.studentId,
      mockRegistration.studentName,
      'LINK',
      'REMINDER'
    );
    
    console.log('\n--- Join Statistics ---');
    const stats = calendarInvitationSystem.getJoinStats(mockVibeathon.id);
    console.log(JSON.stringify(stats, null, 2));
    
    // Cleanup
    calendarInvitationSystem.cleanup();
  })();
}
